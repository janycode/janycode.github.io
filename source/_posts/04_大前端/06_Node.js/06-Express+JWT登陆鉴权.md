---
title: 06-Express+JWT登陆鉴权
date: 2022-5-22 21:36:21
tags:
- Vue
- Node
- Node.js
- Express
- MongoDB
- cookie
- session
- JWT
categories: 
- 04_大前端
- 06_Node.js
---

![image-20260113102144733](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260113102145988.png)

参考：

* Express 官网：https://www.expressjs.com.cn/
* JWT-npm仓库和文档：https://www.npmjs.com/package/jsonwebtoken
* 参考资料：https://zhuanlan.zhihu.com/p/677982758
* 验证项目demo：https://github.com/janycode/nodejs-express-mongodb



## 1. Cookie+Session

### 1.1 应用

**Cookie+Session**：安全、易管控，但服务端有存储压力、跨域差，适合`小型、前后端未分离、安全性要求高`的项目。

### 1.2 流程

> HTTP 是无状态的，也就是 HTTP请求方和响应方之间无法维护状态，都是一次性的，它不知道前后的请求都发生了什么。
>
> 但在登陆这种场景下，我们需要维护状态，因此需要对用户登录状态进行标记。

![image-20260117100056586](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260117100057838.png)

- 浏览器登录发送账号密码，服务端查用户库，校验用户
- 服务端把用户登录状态存为 Session，生成一个 sessionId
- 通过登录接口返回，把 sessionId set 到 cookie 上
- 此后浏览器再请求业务接口，sessionId 随 cookie 带上
- 服务端查 sessionId 校验 session
- 成功后正常做业务处理，返回结果

即：`服务端存储用户身份信息（Session），客户端只存一个随机标识（SessionID）在 Cookie 里；每次请求时，客户端带 SessionID 到服务端，服务端通过 ID 查 Session 确认身份`。



### 1.3 实现

安装1：*npm i express-session@1*  - 支持 session

安装2：*npm i connect-mongo@4*  - 支持 session 存储到 mongo

* 版本兼容 node18.20+, mongo3.6+, mongoose6.13+, express-session1.18+, connect-mongo4.6.0

app.js

```js
// session: 1.引入 express-session 模块
var session = require('express-session')
// mongo存储session: 1.安装 npm i connect-mongo@4.6.0, 支持 session 存储到 mongo
const MongoStore = require("connect-mongo");
...
var app = express();
...
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// session: 2.注册 session 中间件
app.use(session({
  name: 'jerry-system',          // [可选]给 session 系统命名
  secret: 'hello123world456',    // 自定义服务器生成 session 的签名
  cookie: {
    maxAge: 1000 * 60 * 60,      // 过期时间：1h
    secure: false                // true-限制为 https，false-可用于 http
  },
  resave: true,                  // 接口被访问且重新设置 session 后会重新计时
  saveUninitialized: true,       // 第一次访问就会给浏览器 cookie 值
  rolling: true,                 // 默认为 true-超时前刷新，cookie 会重新计时；false-超时前刷新都是按第一次刷新开始计时
  // mongo存储session: 2.设置 session 的 store 属性
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/jerry_session',  //会新创建一个数据库，即 Collection
    ttl: 1000 * 60 * 10           // 与 cookie 过期时间要保持一致！
  })
}))

// session: 3.设置 session 中间件，用于过期校验拦截路由和接口
app.use((req, res, next) => {
  // 排除 login 相关的路由和接口
  if (req.url.includes("login")) {
    next()
    return
  }
  if (req.session.user) {
    // 重新设置 session 让过期时间重新计时，自定义一个字段即可，比如用时间戳
    req.session.mydate = Date.now()
    next() //进入下方的路由中间件
  } else {
    // 接口：返回错误码-页面ejs做重定向, 路由：重定向
    req.url.includes("api") ? res.status(401).json({ ok: -1 }) : res.redirect("/login")
  }
})

app.use('/', indexRouter);
app.use('/api', usersRouter);
app.use('/login', loginRouter); // 对应 login.js 中的 /login/ 路由
...
```

routes/login.js

```js
var express = require('express');
var router = express.Router();

/* Get login page. */
router.get('/', function (req, res, next) {
    res.render('login', { title: 'Express' });
});

module.exports = router;
```

views/login.ejs

```ejs
    <h1>登陆</h1>
    <div>
        <div>用户名：<input type="text" id="username"></div>
        <div>密码：<input type="password" id="password"></div>
        <div><button id="login">登陆</button></div>
    </div>

    <script>
        var username = document.querySelector("#username")
        var password = document.querySelector("#password")
        var login = document.querySelector("#login")
        // 登陆
        login.onclick = () => {
            console.log(username.value, password.value);
            fetch("/api/login", {
                method: "POST",
                body: JSON.stringify({
                    username: username.value,
                    password: password.value,
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json()).then(res => {
                console.log(res);
                if (res.ok === 1) {
                    location.href = "/"
                } else {
                    alert("用户名与密码不匹配")
                }
            })
        }
    </script>
```

routes/users.js

```js
var express = require('express');
const UserModel = require('../model/UserModel');
const UserController = require('../controllers/UserController');
var router = express.Router();
...
// 登陆与退出登陆校验
router.post("/login", UserController.login);
router.get("/logout", UserController.logout);

module.exports = router;
```

controllers/UserController.js

```js
const UserService = require("../services/UserService");

const UserController = {
    ...
    login: async (req, res) => {
        const { username, password } = req.body
        const data = await UserService.login(username, password)
        if (data.length === 0) {
            // 未查询到
            res.send({ ok: -1 })
        } else {
            // session: 3.设置 session 对象，默认存储在内存中
            req.session.user = data[0] // 挂一个 user 字段，内容是用户信息
            res.send({ ok: 1 })
        }
    },
    logout: async (req, res) => {
        // session: 销毁 session 在退出登陆时
        req.session.destroy(() => {
            res.send({ ok: 1 })
        })
    }
}

module.exports = UserController
```

services/UserService.js

```js
const UserModel = require("../model/UserModel");

const UserService = {
    ...
    login: (username, password) => {
        // find({}) 该方法参数是一个对象类型 {} 
        return UserModel.find({ username, password })
    }
}

module.exports = UserService
```

model/UserModel.js

```js
const mongoose = require("mongoose")
// 模型字段和类型限定
const Schema = mongoose.Schema
const UserType = {
    username: String,
    password: String,
    age: Number
}
// 模型 user 将会对应 users 集合
const UserModel = mongoose.model("user", new Schema(UserType))

module.exports = UserModel
```



## 2. JWT-JSON Web Token

### 2.1 应用

**JWT**：无状态、跨域友好、易扩展，但安全性低(拷走设置到浏览器里)、无法主动作废，适合`前后端分离、分布式、多端`的项目。

### 2.2 流程

![image-20260117100310516](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260117100311802.png)

即：`服务端不存储任何用户信息，而是把用户身份（如 ID、用户名）加密成一个 Token 字符串返回给客户端；客户端存 Token（Cookie / 本地存储），每次请求带 Token，服务端解密验证即可，无需查库。`

### 2.3 实现

安装1：*npm i jsonwebtoken@9*  - [JWT-npm仓库和文档](https://www.npmjs.com/package/jsonwebtoken)

* 即最新版 jsonwebtoken 9.x 都能兼容。

安装2：*npm i axios*  - 需要 [axios](https://www.npmjs.com/package/axios) 拦截器

试一试：

```js
// 验证 jwt
var jwt = require('jsonwebtoken');
var token = jwt.sign({
  data: 'jerry'
}, 'anydata-secret', { expiresIn: '10s' }); //10s
console.log("token->", token);

setTimeout(() => {
  var decoded = jwt.verify(token, "anydata-secret")
  console.log('9s ->', decoded);
}, 9000) //9s -> { data: 'jerry', iat: 1768622811, exp: 1768622821 }
setTimeout(() => {
  var decoded = jwt.verify(token, "anydata-secret")
  console.log('11s ->', decoded);
}, 11000) //11s -> TokenExpiredError: jwt expired
```

#### JWT.js - 工具类

util/JWT.js

```js
const jwt = require("jsonwebtoken")
const secret = "jerry-anydata"
const JWT = {
    generate(value, expires) {
        return jwt.sign(value, secret, { expiresIn: expires })
    },
    verify(token) {
        try {
            return jwt.verify(token, secret)
        } catch (error) {
            console.error(error.message); // jwt expired
            return false
        }
    }
}

module.exports = JWT
```

验证：

```js
// 验证 jwt
var token = JWT.generate({ name: "jerry" }, "10s")
console.log("token->", token);

setTimeout(() => {
  var decoded = JWT.verify(token, "anydata-secret")
  console.log('9s ->', decoded);
}, 9000) //9s -> { data: 'jerry', iat: 1768622811, exp: 1768622821 }
setTimeout(() => {
  var decoded = JWT.verify(token, "anydata-secret")
  console.log('11s ->', decoded);
}, 11000) //11s -> false
```



#### 具体实现

页面上使用 script axios 引入：

```js
<script src="https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js"></script>
```

登录页 views/login.ejs - 引入 axios 和 拦截器。

```ejs
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>登陆页面</title>
    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js"></script>
    <script>
        //axios 拦截器配置示例
        // 请求拦截
        axios.interceptors.request.use(function (config) {
            console.log("请求发出前，先执行的方法");
            return config;
        }, function (error) {
            return Promise.reject(error);
        });

        // 响应拦截
        axios.interceptors.response.use(function (response) {
            console.log("响应成功后，先执行的方法");
            const { authorization } = response.headers
            authorization && localStorage.setItem("token", authorization)
            return response;
        }, function (error) {
            return Promise.reject(error);
        });
    </script>
</head>

<body>
    <h1>登陆</h1>
    <div>
        <div>用户名：<input type="text" id="username"></div>
        <div>密码：<input type="password" id="password"></div>
        <div><button id="login">登陆</button></div>
    </div>

    <script>
        var username = document.querySelector("#username")
        var password = document.querySelector("#password")
        var login = document.querySelector("#login")

        login.onclick = () => {
            axios.post("/api/login", {
                username: username.value,
                password: password.value,
            }).then(res => {
                console.log("axios login->", res);  //token 在 res.headers.authorization
                if (res.data.ok === 1) {
                    // 存储token
                    console.log("进入首页 /");
                    location.href = "/"
                } else {
                    alert("用户名与密码不匹配")
                }
            })
        }
    </script>
</body>

</html>
```

登陆后跳转首页 views/index.ejs

```js
<!DOCTYPE html>
<html>

<head>
  <title>
    <%= title %>
  </title>
  <link rel='stylesheet' href='/stylesheets/style.css' />
  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js"></script>
  <script>
    //axios 拦截器配置示例
    // 请求拦截
    axios.interceptors.request.use(function (config) {
      console.log("请求发出前，先执行的方法");
      // 所有请求携带 token
      const token = localStorage.getItem("token")
      config.headers.Authorization = `Bearer ${token}` //常规规范拼接 Bearer
      return config;
    }, function (error) {
      return Promise.reject(error);
    });

    // 响应拦截
    axios.interceptors.response.use(function (response) {
      console.log("响应成功后，先执行的方法");
      const { authorization } = response.headers
      authorization && localStorage.setItem("token", authorization)
      return response;
    }, function (error) {
      console.log(error.response.status);
      if (error.response.status === 401) {
        localStorage.removeItem("token")
        location.href = "/login"
      }
      return Promise.reject(error);
    });
  </script>
</head>

<body>
  <h1>后台系统用户管理</h1>
  <div><button id="logout">退出登陆</button></div>
  <div>
    <div>用户名：<input type="text" id="username"></div>
    <div>密码：<input type="password" id="password"></div>
    <div>年龄：<input type="number" id="age"></div>
    <div>
      <button id="register">注册用户</button>
    </div>
  </div>
  <hr>
  <div>
    <button id="update">更新用户</button>
    <button id="delete">删除用户</button>
  </div>
  <hr>
  <table border="1px">
    <thead>
      <tr>
        <td>id</td>
        <td>用户名</td>
        <td>年龄</td>
      </tr>
    </thead>
    <tbody></tbody>
  </table>

  <script>
    var resigter = document.querySelector("#register")
    var logout = document.querySelector("#logout")
    var updateBtn = document.querySelector("#update")
    var deleteBtn = document.querySelector("#delete")
    var username = document.querySelector("#username")
    var password = document.querySelector("#password")
    var age = document.querySelector("#age")
    // 请求新增-POST
    resigter.onclick = () => {
      axios.post("/api/user", {
        username: username.value,
        password: password.value,
        age: age.value
      }).then(res => {
        console.log("新增：", res.data);
        if (res.data.ok < 0) {
          location.href = "/login"
        }
      })
    }

    // 请求更新-PUT
    updateBtn.onclick = () => {
      axios.put("/api/user/696aeb1f3261b94d1d3a83e9", {
        username: "修改的名称",
        password: "修改的密码",
        age: 1
      }).then(res => {
        console.log("更新：", res.data);
        if (res.ok < 0) {
          location.href = "/login"
        }
      })
    }

    // 请求删除-DELETE
    deleteBtn.onclick = () => {
      axios.delete("/api/user/696aeb1f3261b94d1d3a83e9").then(res => {
        console.log("删除：", res.data);
        if (res.data.ok < 0) {
          location.href = "/login"
        }
      })
    }

    // 请求列表-GET
    axios.get("/api/user?page=1&pageSize=10").then(res => {
      console.log("列表：", res.data);
      let tbody = document.querySelector("tbody")
      tbody.innerHTML = res.data.data.list.map(item => `
        <tr>
          <td>${item._id}</td>
          <td>${item.username}</td>
          <td>${item.age}</td>
        </tr>
      `).join("")
    })

    logout.onclick = () => {
      localStorage.removeItem("token")
      location.href = "/login"
    }
  </script>
</body>

</html>
```

controllers/UserController.js

```js
const UserService = require("../services/UserService");
const JWT = require("../util/JWT");

const UserController = {
    ...
    login: async (req, res) => {
        const { username, password } = req.body
        const data = await UserService.login(username, password)
        if (data.length === 0) {
            // 未查询到
            res.send({ ok: -1 })
        } else {
            // jwt: 1.使用 jwt 生成 token，并返回到 header 中
            const token = JWT.generate({
                _id: data[0]._id,
                username: data[0].username
            }, "1h")
            res.header("Authorization", token)
            res.send({ ok: 1 })
        }
    }
}

module.exports = UserController
```

app.js

```js
...
const JWT = require('./util/JWT'); //引入 JWT 工具类

var app = express();
...
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// jwt: 2.token 的后端校验
app.use((req, res, next) => {
  // 排除 login 相关的路由和接口
  if (req.url.includes("login")) {
    next()
    return
  }
  // 从 header 中解析 token
  const token = req.headers["authorization"]?.split(" ")[1]
  console.log(req.headers["authorization"]); //Bearer null (都会进if分支)
  if (token) {
    const payload = JWT.verify(token)
    console.log("当前登录用户信息: ", payload);
    if (payload) {
      //每次访问时，在有效期内，重新计算有效期，即续期（否则有效期就是一次性的，到期必然退出登录）
      const newToken = JWT.generate({
        _id: payload._id,
        username: payload.username
      }, "1h")
      res.header("Authorization", newToken)

      next()
    } else {
      res.status(401).send({ errCode: -1, errMessage: "token过期" })
    }
  } else {
    next()
  }
})

app.use('/', indexRouter);
app.use('/api', usersRouter);
app.use('/login', loginRouter);
...
```

