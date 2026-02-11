---
title: 09-Koa框架
date: 2022-5-22 21:36:21
tags:
- Vue
- Node
- Node.js
- koa
categories: 
- 04_大前端
- 06_Node.js
---

![image-20260113102144733](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260113102145988.png)

参考：

* Koa 官网：https://koa.node.org.cn/



## 1. 介绍

Koa 是由 Express 团队设计的新 Web 框架，旨在为 Web 应用和 API 提供更小、更具表现力且更强大的基础。通过利用异步函数，Koa 允许您摆脱回调并大大增强错误处理能力。Koa 的核心不捆绑任何中间件，它提供了一套优雅的方法，使编写服务器变得快速而愉快。



## 2. 快速开始

### 2.1 安装

```sh
#初始化 package.json
npm init
```

初始化：*npm init*  - 初始化package.json

安装：*npm i koa@2*  - 安装koa2



### 2.2 使用

```js
const Koa = require("koa")
const app = new Koa()
// ctx --> context 上下文
app.use((ctx, next) => {
    // ctx.request, ctx.response
    console.log(ctx.request.path);
    // ctx.response.body = "hello,world"
    // ctx.response.body = { name: "jerry", age: 22 }
    ctx.body = "hello,world"
})
app.listen(3000)
```



### 2.3 req与res

请求方式：

Koa-router 请求方式： get 、 put 、 post 、 patch 、 delete 、 del ，而使用方法就是 router.方式() ，比如 router.get() 和 router.post() 。而 router.all() 会匹配所有的请求方法。

koa 中 request 和 response 可以省略，都在 ctx 上下文对象中。

| 请求 request                                                 | 响应 response                                                |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ctx.header<br/>ctx.headers<br/>ctx.method<br/>ctx.method=<br/>ctx.url<br/>ctx.url=<br/>ctx.originalUrl<br/>ctx.origin<br/>ctx.href<br/>ctx.path<br/>ctx.path=<br/>ctx.query<br/>ctx.query=<br/>ctx.querystring<br/>ctx.querystring=<br/>ctx.host<br/>ctx.hostname<br/>ctx.fresh<br/>ctx.stale<br/>ctx.socket<br/>ctx.protocol<br/>ctx.secure<br/>ctx.ip<br/>ctx.ips<br/>ctx.subdomains<br/>ctx.is()<br/>ctx.accepts()<br/>ctx.acceptsEncodings()<br/>ctx.acceptsCharsets()<br/>ctx.acceptsLanguages()<br/>ctx.get() | ctx.body<br/>ctx.body=<br/>ctx.status<br/>ctx.status=<br/>ctx.message<br/>ctx.message=<br/>ctx.length=<br/>ctx.length<br/>ctx.type=<br/>ctx.type<br/>ctx.headerSent<br/>ctx.redirect()<br/>ctx.attachment()<br/>ctx.set()<br/>ctx.append()<br/>ctx.remove()<br/>ctx.lastModified=<br/>ctx.etag= |



### 2.4 对比express

#### 洋葱模型

![image-20260118100525505](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260118100527106.png)

通常都会说 Koa 是`洋葱模型`，这重点在于中间件的设计。

因此如果我们想做接口耗时统计、错误处理 Koa 的这种中间件模式处理起来更方便些。

最后一点响应机制也很重要，Koa 不是立即响应，是整个中间件处理完成在最外层进行了响应，而 Express 则是立即响应。

#### 【更轻量】

* koa 不提供内置的中间件；
* koa 不提供路由，而是把路由这个库分离出来了（koa/router）

#### 【Context对象】

* koa增加了一个Context的对象，作为这次请求的上下文对象（在koa2中作为中间件的第一个参数传入）。

* 同时Context上也挂载了Request和Response两个对象。和Express类似，这两个对象都提供了大量的便捷方法辅助开发, 这样的话对于在保存一些公有的参数的话变得更加合情合理。

#### 【异步流程控制】

* express采用callback来处理异步， koa v1采用generator，koa v2 采用async/await。

* generator和async/await使用同步的写法来处理异步，明显好于callback和promise，

#### 【中间件模型】

* express基于connect中间件，线性模型；

* koa中间件采用洋葱模型（对于每个中间件，在完成了一些事情后，可以非常优雅的将控制权传递给下一个中间件，并能够等待它完成，当后续的中间件完成处理后，控制权又回到了自己）



#### 【同步 vs 异步】

![image-20260118100651698](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260118100653296.png)

koa 异步示例：

```js
const Koa = require("koa")
const app = new Koa()

app.use(async (ctx, next) => {
    if (ctx.url === "/.well-known/appspecific/com.chrome.devtools.json") return
    console.log("111");
    await next()
    console.log("444", ctx.token);
    ctx.body = "hello,world"
})

app.use(async (ctx, next) => {
    console.log("222");
    await delay(1000)
    ctx.token = "abc123def456ghi789"
    console.log("333");
})

function delay(timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, timeout)
    })
}

app.listen(3000)
```

输出：

111
222
333
444 abc123def456ghi789



## 3. 路由

### 3.1 安装

安装：*npm i koa-router*

使用示例：

```js
const Koa = require("koa")
const Router = require("koa-router")
const app = new Koa()
const router = new Router()

router.post("/list", (ctx, next) => { // 增
    ctx.body = { ok: 1, message: "add list success" }
}).del("/list/:id", (ctx, next) => {  // 删
    ctx.body = { ok: 1, message: "del list success" }
}).put("/list/:id", (ctx, next) => {  // 改
    console.log(ctx.params); // { id: '123' }
    ctx.body = { ok: 1, message: "put list success" }
}).get("/list", (ctx, next) => {      // 查
    ctx.body = ["111", "222", "333"]
})

app.use(router.routes()).use(router.allowedMethods()) //请求方式更严格 get与post
app.listen(3000, () => {
    console.log("server start");
})
```

> router.allowedMethods()
>
> Koa 框架中 *koa-router* 的一个中间件，用于处理 HTTP 方法不匹配的情况。当请求方法不被允许时，它会返回 *405 Method Not Allowed* 状态码，并在响应头中添加 *Allow* 字段，列出允许的请求方法。

### 3.2 拆分路由

```txt
routes/
  index.js
  home.js
  user.js
  list.js
index.js
```

index.js

```js
const Koa = require("koa")
const router = require("./routes") //默认导入 /index.js

const app = new Koa()

// use 应用级组件
app.use(router.routes()).use(router.allowedMethods()) //请求方式更严格 get与post
app.listen(3000, () => {
    console.log("server start");
})
```

routes/index.js

```js
const Router = require("koa-router")
const homeRouter = require("./home")
const userRouter = require("./user")
const listRouter = require("./list")
const router = new Router()

// 统一添加前缀
// router.prefix("/api")
// use 路由级组件
router.use("/home", homeRouter.routes(), homeRouter.allowedMethods())
router.use("/user", userRouter.routes(), userRouter.allowedMethods())
router.use("/list", listRouter.routes(), listRouter.allowedMethods())
router.redirect("/", "/home")  // 重定向首页默认到 /home 页

module.exports = router
```

routes/home.js

```js
const Router = require("koa-router")
const router = new Router()

router.get("/", (ctx, next) => {      // 页面
    ctx.body = `
        <html>
            <h1>home页面</h1>
        </html>
    `
})

module.exports = router
```

routes/user.js

```js
const Router = require("koa-router")
const router = new Router()

router.post("/", (ctx, next) => { // 增
    ctx.body = { ok: 1, message: "add user success" }
}).del("/:id", (ctx, next) => {  // 删
    ctx.body = { ok: 1, message: "del user success" }
}).put("/:id", (ctx, next) => {  // 改
    console.log(ctx.params); // { id: '123' }
    ctx.body = { ok: 1, message: "put user success" }
}).get("/", (ctx, next) => {      // 查
    ctx.body = ["aaa", "bbb", "ccc"]
})

module.exports = router
```

routes/list.js

```js
const Router = require("koa-router")
const router = new Router()

router.post("/", (ctx, next) => { // 增
    ctx.body = { ok: 1, message: "add list success" }
}).del("/:id", (ctx, next) => {  // 删
    ctx.body = { ok: 1, message: "del list success" }
}).put("/:id", (ctx, next) => {  // 改
    console.log(ctx.params); // { id: '123' }
    ctx.body = { ok: 1, message: "put list success" }
}).get("/", (ctx, next) => {      // 查
    ctx.body = ["111", "222", "333"]
})

module.exports = router
```



### 3.3 静态资源

安装：*npm i koa-static*

引入和注册：

```js
const Koa = require('koa')
const static = require("koa-static") //导入静态资源支持模块
const path = require("path")  //导入path模块
const app = new Koa()
app.use(static(path.join( __dirname, "public")))  // 注册静态资源目录 public
```

目录：

```txt
public/
  css/
    center.css
  center.html
```

center.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="/css/center.css">
</head>
<body>
    <div>center</div>
</body>
</html>
```

访问 http://localhost:3000/center.html 静态资源则被完全支持。



### 3.4 获取请求参数

#### get

在koa中，获取GET请求数据源头是koa中request对象中的query方法或querystring方法，query返回是格式化好的参数对象，querystring返回的是请求字符串，由于ctx对request的API有直接引用的方式，所以获取GET请求数据有两个途径。

是从上下文中直接获取

* 请求对象`ctx.query`，返回如 { a:1, b:2 }
* 请求字符串 `ctx.querystring`，返回如 a=1&b=2

是从上下文的request对象中获取

* 请求对象`ctx.request.query`，返回如 { a:1, b:2 }
* 请求字符串 `ctx.request.querystring`，返回如 a=1&b=2

使用：

```js
const Router = require("koa-router")
const router = new Router()

router.get("/", (ctx, next) => {      // 查
    // 获取 get 传来的参数
    console.log("get 参数->", ctx.query);       //{ username: 'admin', password: '123' }
    console.log("get 参数->", ctx.querystring); //username=admin&password=123
    ctx.body = ["aaa", "bbb", "ccc"]
})
module.exports = router
```



#### post

对于POST请求的处理，`koa-bodyparser` 中间件可以把koa2上下文的 formData 数据解析到 `ctx.request.body` 中（request 不能省略）

安装：*npm i koa-bodyparser*

引入和注册：

```js
const Koa = require("koa")
const bodyParser = require("koa-bodyparser") //导入body解析器模块
const app = new Koa()
// 获取post参数
app.use(bodyParser())
```

使用：

```js
const Router = require("koa-router")
const router = new Router()

router.post("/", (ctx, next) => { // 增
    // 获取 post 传来的参数
    console.log("post 参数->", ctx.request.body); //{ username: 'admin', password: '123' }
    ctx.body = { ok: 1, message: "add user success" }
})
module.exports = router
```



## 4. 模板引擎 ejs

### 4.1 安装

安装：*npm i koa-views ejs* - 安装 koa-views 和 ejs 库

目录：

```txt
├── package.json
├── index.js
├── routes/
|   └── home.js 
└── view/
    └── home.ejs
```

引入和注册：

```js
const Koa = require("koa")
const path = require("path")  //导入path模块
const views = require("koa-views") //导入 koa-views 模版引擎模块

const app = new Koa()
// 配置模版引擎: 目录 views，文件后缀 ejs
app.use(views(path.join(__dirname, "views"), { extension: "ejs" }))
```

### 4.2 使用

home.js

```js
const Router = require("koa-router")
const router = new Router()

router.get("/", async (ctx, next) => {      // 页面
    //默认异步，必须添加async+await；自动找到 views/home.ejs
    await ctx.render("home", { username: "jerry" })
})
module.exports = router
```

home.ejs

```ejs
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
</head>
<body>
    <h1>home<%= title %>页面</h1>
    <div>欢迎 <%= username %> 回来！</div>
</body>
</html>
```



## 5. Cookie & Session

### 5.1 Cookie

koa提供了从上下文直接读取、写入 cookie 的方法。

* `ctx.cookies.get(name, [options])` 读取上下文请求中的cookie

* `ctx.cookies.set(name, value, [options])` 在上下文中写入cookie

routes/login.js - 示例

```js
const Router = require("koa-router")
const router = new Router()

router.get("/", async (ctx, next) => {      // 页面
    // 获取 cookie
    console.log(ctx.cookies.get("age"))
    console.log(ctx.cookies.get("location"))
    // 设置 cookie
    ctx.cookies.set("name", "jerry")

    //默认异步，必须添加async+await；自动找到 views/home.ejs
    await ctx.render("login", { title: '登陆', username: "jerry" })
})

module.exports = router
```



### 5.2 Session

koa-session-minimal 适用于koa2 的session中间件，提供存储介质的读写接口 。

安装：*npm i koa-session-minimal*

引入和注册、拦截配置 示例：

```js
const Koa = require("koa")
const router = require("./routes") //默认导入 /index.js
const session = require("koa-session-minimal") //导入 session 支持模块

const app = new Koa()
// session 配置
app.use(session({
    key: "jerrySessionId",
    cookie: {
        maxAge: 1000 * 60 * 60, // 1h
    }
}))
// session 拦截（app.use 默认异步，因此都需要 async+await 同步返回，否则执行不到具体的逻辑）
app.use(async (ctx, next) => {
    //排除login相关的路由和接口
    if (ctx.url.includes("login")) {
        await next()
        return
    }
    if (ctx.session.user) {
        //重新设置以下sesssion
        ctx.session.mydate = Date.now()
        await next()
    } else {
        ctx.redirect("/login")
    }
})

// use 应用级组件
app.use(router.routes()).use(router.allowedMethods()) //请求方式更严格 get与post
app.listen(3000, () => {
    console.log("server start");
})
```

routes/user.js - login

```js
const Router = require("koa-router")
const router = new Router()

router.post("/login", (ctx, next) => {
    console.log(ctx.request.body);
    const { username, password } = ctx.request.body
    if (username === "admin" && password === "123") {
        // 设置 sessionId，自定义字段 user，值为加密的 username（通过sessionId才能换回来）
        ctx.session.user = { username }
        ctx.body = { ok: 1 }
    } else {
        ctx.body = { ok: -1 }
    }
})

module.exports = router
```

views/login.ejs

```ejs
   <div>
        <div>用户名：
            <input type="text" id="username">
        </div>
        <div>密码：
            <input type="text" id="password">
        </div>
        <div>
            <button id="login_post">登陆-post</button>
        </div>
    </div>

    <script>
        var ologinPost = document.querySelector("#login_post")
        var username = document.querySelector("#username")
        var password = document.querySelector("#password")
        ologinPost.onclick = () => {
            console.log(username.value, password.value);
            fetch(`/user/login`, {
                method: "POST",
                body: JSON.stringify({
                    username: username.value,
                    password: password.value
                }),
                headers: {
                    "content-type": "application/json"
                }
            }).then(res => res.json())
                .then(res => {
                    console.log(res);
                    if (res.ok === 1) {
                        location.href = "/"
                    } else {
                        alert("账号或密码错误！")
                    }
                })
        }
    </script>
```



## 6. JWT

安装：*npm i jsonwebtoken@9*

引入和使用封装工具类 JWT.js

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
            console.error(error.message);
            return false
        }
    }
}

module.exports = JWT
```

index.js - token 判断和拦截，注意 async+await 同步拦截

```js
app.use(async (ctx, next) => {
    //排除login相关的路由和接口
    if (ctx.url.includes("login")) {
        await next()
        return
    }
    const token = ctx.headers["authorization"]?.split(" ")[1]
    // console.log(req.headers["authorization"])
    if (token) {
        const payload = JWT.verify(token)  //JWT工具类
        if (payload) {
            //重新计算token过期时间
            const newToken = JWT.generate({
                _id: payload._id,
                username: payload.username
            }, "1h")
            ctx.set("Authorization", newToken)
            await next()
        } else {
            ctx.status = 401
            ctx.body = { errCode: -1, errInfo: "token过期" }
        }
    } else {
        await next()
    }
})
```

login.js - 登陆成功时，返回到 header 中 token 值（jwt加密生成的内容）

```js
router.post("/login", (ctx, next) => {
    console.log(ctx.request.body);
    const { username, password } = ctx.request.body
    if (username === "admin" && password === "123") {
        // jwt: 1.使用 jwt 生成 token，并返回到 header 中
        const token = JWT.generate({
            username: username
        }, "10s")
        // token 返回在 header 中
        ctx.set("Authorization", token)
        ctx.body = { ok: 1 }
    } else {
        ctx.body = { ok: -1 }
    }
})
```



## 7. 上传文件

文档：[@koa/multer](https://www.npmjs.com/package/@koa/multer)

安装：*npm i @koa/multer multer*  - Don't forget the `enctype="multipart/form-data"` in your form.

引入和使用：routes/user.js

```js
const multer = require('@koa/multer');
const upload = multer({ dest: 'public/uploads/' })

router.post("/", upload.single('avatar'), (ctx, next) => {
    console.log(ctx.request.body, ctx.file)
    ctx.body = {
        ok: 1,
        info: "add user success"
    }
})
```



## 8. 操作MongoDB

### 安装

安装：*npm i mongoose@6*

引入和连接 mongoDB：

```js
const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/jerry_project")
```



```js
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const UserType = {
    username:String,
    password:String,
    age:Number,
    avatar:String
}

const UserModel = mongoose.model("user",new Schema(UserType))
// 模型user 将会对应 users 集合,
module.exports = UserModel
```



### 使用

使用方式与 express 一样，没有差异，[参考 express 与 mongodb 使用](https://github.com/janycode/nodejs-express-mongodb/blob/main/config/db.config.js)。











