---
title: 03-Express框架
date: 2022-5-22 21:36:21
tags:
- Vue
- Node
- Node.js
- Express
categories: 
- 04_大前端
- 06_Node.js
---

![image-20260113102144733](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260113102145988.png)

参考：

* Node.js 官网：https://nodejs.org/zh-cn
* Node.js 下载地址：https://nodejs.cn/download/
* Node.js 官方文档：http://nodejs.cn/learn/how-much-javascript-do-you-need-to-know-to-use-nodejs
* Node.js 历史版本：https://registry.npmmirror.com/binary.html?path=node/
* Express 官网：https://www.expressjs.com.cn/



## 1. 介绍

`Express` 基于 `Node.js` 平台，快速、开放、极简的 Web 开发框架。

**Web 应用程序**

Express 是一个保持最小规模的灵活的 Node.js Web 应用程序开发框架，为 Web 和移动应用程序提供一组强大的功能。

**API**

使用您所选择的各种 HTTP 实用工具和中间件，快速方便地创建强大的 API。

**性能**

Express 提供精简的基本 Web 应用程序功能，而不会隐藏您了解和青睐的 Node.js 功能。

**中间件**

Express 是一个轻量、灵活的框架，其核心功能极少， 可通过 Express [中间件](https://www.expressjs.com.cn/resources/middleware.html) 模块对其进行扩展。



## 2. 安装

初始化：*npm init*

安装：*npm i express@4.17.3*

引入和使用：

```js
const express = require("express")

const app = express() //创建一个 app server
app.get("/",      (req, res) => { res.send("hello express") })
app.get("/login", (req, res) => { res.send(`<html><h1>login</h1></html>`) })  //支持解析 html
app.get("/json",  (req, res) => { res.send({ name: "jerry", age: 20 }) })      //支持解析 json
app.listen(3000, () => {   // 监听 3000 端口
    console.log("express server start");
})
```



## 3. 路由

路由是指如何定义应用的端点（URIs）以及如何响应客户端的请求。

路由是由一个 URI、HTTP 请求（GET、POST等）和若干个句柄组成，它的结构如下： 

```js
app.METHOD(path, [callback...], callback)
```

* app 是 express 对象的一个实例
* METHOD 是一个 HTTP 请求方法
* path 是服务器上的路径
* callback 是当路由匹配时要执行的函数

基本路由，如 / 

```js
app.get("/", (req, res) => {
    res.send("hello express")
})
```

路由路径和请求方法一起定义了请求的端点，它可以是**字符串**、**字符串模式**或者**正则表达式**。

### 字符串

```js
// 匹配根路径的请求
app.get('/', (req, res) => { res.send('root') })
// 匹配 /about 路径的请求
app.get('/about', (req, res) => { res.send('about') })
// 匹配 /random.text 路径的请求
app.get('/random.text', (req, res) => { res.send('random.text') })
```

### 字符串模式

```js
// 匹配 acd 和 abcd
app.get('/ab?cd', (req, res) => { res.send('ab?cd') })
// 匹配 /ab/**
app.get('/ab/:id', (req, res) => { res.send('aaaaaaa') })
// 匹配 abcd、abbcd、abbbcd等
app.get('/ab+cd', (req, res) => { res.send('ab+cd') })
// 匹配 abcd、abxcd、abRABDOMcd、ab123cd等
app.get('/abcd', (req, res) => { res.send('abcd') })
// 匹配 /abe 和 /abcde
app.get('/ab(cd)?e', (req, res) => { res.send('ab(cd)?e') })
```

### 正则表达式

```js
// 匹配任何路径中含有 a 的路径：
app.get(/a/, (req, res) => { res.send('/a/') })
// 匹配 butterfly、dragonfly，不匹配 butterflyman、dragonfly man等
app.get(/.fly$/, (req, res) => { res.send('/.fly$/') })
```

### 回调函数-类似中间件

可以为请求处理提供多个回调函数，其行为类似 中间件。唯一的区别是这些回调函数有可能调用 `next('route')` 方法而略过其他路由回调函数。

可以`利用该机制为路由定义前提条件`，如果在现有路径上继续执行没有意义，则可将控制权交给剩下的路径。

```js
app.get('/example/a', (req, res) => { res.send('Hello from A!') })
```

使用多个回调**函数**处理路由（记得指定 next 对象）：

```js
app.get('/example/b', (req, res, next) => {
  console.log('response will be sent by the next function ...')
  if(条件为true) {
      next() //继续执行（执行下一个回调函数）
  } else { 返回错误 }
}, (req, res) => {
  res.send('Hello from B!')  // next()调用才走这个函数
});
```

回调函数**数组**处理路由： 

```js
var cb0 = (req, res, next) => {
  console.log('CB0')
  next()
}
var cb1 = (req, res, next) => {
  console.log('CB1')
  next()
}
var cb2 = (req, res) => {
  res.send('Hello from C!')
}
app.get('/example/c', [cb0, cb1, cb2]) //cb0-next()执行才进入 cb1=next()后再进cb2
```

混合使用**函数**和**函数数组**处理路由：

```js
var cb0 = (req, res, next) => {
  console.log('CB0')
  res.jerry = 'jerry'  //也支持传递参数
  next()
}
var cb1 = (req, res, next) => {
  console.log('CB1', res.jerry) // CB1 jerry
  next()
}
app.get('/example/d', [cb0, cb1], (req, res, next) => {
  console.log('response will be sent by the next function ...')
  next()
}, (req, res) => {
  res.send('Hello from D!')
})
```



## 4. 中间件

Express 是一个自身功能极简，完全是由路由和中间件构成一个的 web 开发框架：从本质上来说，`一个 Express 应用就是在调用各种中间件`。

`中间件（Middleware）` 是一个函数，它可以访问请求对象（request object (req)）, 响应对象（response object (res)）, 和 web 应用中处于请求-响应循环流程中的中间件，一般被命名为 next 的变量。

中间件的功能包括：

* 执行任何代码。
* 修改请求和响应对象。
* 终结请求-响应循环。
* 调用堆栈中的下一个中间件。

如果当前中间件没有终结请求-响应循环，则必须调用 next() 方法将控制权交给下一个中间件，否则请求就会挂起。

Express 应用可使用如下几种中间件：

* 应用级中间件

* 路由级中间件

* 错误处理中间件

* 内置中间件

* 第三方中间件

使用可选则挂载路径，可在应用级别或路由级别装载中间件。另外，你还可以同时装在一系列中间件函数，从而在一个挂载点上创建一个子中间件栈。

### 应用级中间件

应用级中间件：`绑定到 app 对象`。

使用 app.use() 和 app.METHOD()， 其中， METHOD 是需要处理的 HTTP 请求的方法，例如 GET, PUT, POST 等等，全部小写。

* 如登陆前的校验

```js
var app = express()

//没有挂载路径的中间件，应用的每个请求都会执行该中间件【注意 .use() 的放置位置】
app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})
```



### 路由级中间件

路由级中间件和应用级中间件一样，只是它绑定的对象为 `express.Router()`。

目录：

```txt
router1/
  IndexRouter.js
router2/
  HomeRouter.js
  LoginRouter.js
index.js
```

index.js

```js
const express = require("express")
const app = express()
const IndexRouter = require("./router1/InterRouter")
const HomeRouter = require("./router2/HomeRouter")
const LoginRouter = require("./router2/LoginRouter")
//应用级别中间件
app.use(function (req, res, next) {
    console.log("验证token")
    next()
})

app.use("/api", IndexRouter)    //匹配: /api/home /api/login
app.use("/home", HomeRouter)    //匹配: /home
app.use("/login", LoginRouter)  //匹配: /login

app.listen(3000, () => {
    console.log("server start");
})
```

IndexRouter.js

```js
const express = require("express")

const router = express.Router()
// 路由级别中间件
router.get("/", (req, res) => {
    res.send("index")
})
router.get("/home", (req, res) => {
    res.send("home")
})
router.get("/login", (req, res) => {
    res.send("login")
})
module.exports = router
```

HomeRouter.js

```js
const express = require("express")

const router = express.Router()
// 路由级别中间件
router.get("/", (req, res) => {
    res.send("home/")
})
module.exports = router
```

LoginRouter.js

```js
const express = require("express")

const router = express.Router()
// 路由级别中间件
router.get("/", (req, res) => {
    res.send("login/")
})
module.exports = router
```

访问路径分别匹配：

http://127.0.0.1:3000/api

http://127.0.0.1:3000/api/home

http://127.0.0.1:3000/api/login

http://127.0.0.1:3000/home

http://127.0.0.1:3000/login



### 错误处理中间件

错误处理中间件和其他中间件定义类似，只是要使用 4 个参数，而不是 3 个，其签名如下： (err, req, res, next)。

```js
// 错误中间件 - 注意要放到最后
app.use((req, res) => {
    res.status(404).send("页面找不到了")
})
```



### 内置中间件

express.static 是 Express 唯一内置的中间件。它基于 serve-static，负责在 Express 应用中提托管静态资源。每个应用可有多个静态目录。

```js
app.use(express.static('public'))
app.use(express.static('uploads'))
app.use(express.static('files'))
```



### 第三方中间件

安装所需功能的 node 模块，并在应用中加载，可以在应用级加载，也可以在路由级加载。如一个解析 cookie 的中间件： cookie-parser

安装：*npm init; npm i cookie-parser*

```js
var express = require('express')
var app = express()
var cookieParser = require('cookie-parser')

// 加载用于解析 cookie 的中间件
app.use(cookieParser())
```



## 5. 获取请求参数

### GET - req.query

`req.query`

```js
const router = express.Router()
// 路由级别中间件 - 响应 get 请求
router.get("/", (req, res) => {
    //http://127.0.0.1:3000/login?username=admin&password=123456
    console.log(req.query);          //{ username: 'admin', password: '123456' }
    console.log(req.query.username); //admin
    console.log(req.query.password); //123456
    res.send("login..get")
})
//post, put, delete 都可以同时写
```



### POST - req.body

`req.body`

需要预先配置解析的工具（放在中间件代码最前面）- 针对当前新版 express(v4.17.3) 无需下载第三方任何库：

```js
var express = require('express')
var app = express()
// 配置解析post参数的中间件 - 注意要放到最前面
app.use(express.urlencoded({ extended: false })) //urlencode: username=admin&password=123456
app.use(express.json())                          //json: {"username": "admin", "password": "123456"}
```

```js
const router = express.Router()
// 路由级别中间件 - 响应 post 请求
router.post("/", (req, res) => {
    //必须配置中间件
    console.log("body", req.body)   //[Object: null prototype] { username: 'admin', password: '123456' }
    console.log(req.body.username); //admin
    console.log(req.body.password); //123456
    res.send("login..post")
})
//post, put, delete 都可以同时写
```



验证 post 请求参数：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>login</title>
</head>

<body>
    <div>
        <div>用户名：
            <input type="text" id="username">
        </div>
        <div>密码：
            <input type="text" id="password">
        </div>
        <div>
            <button id="login_get">登陆-get</button>
            <button id="login_post">登陆-post</button>
        </div>
    </div>

    <script>
        var ologinGet = document.querySelector("#login_get")
        var ologinPost = document.querySelector("#login_post")
        var username = document.querySelector("#username")
        var password = document.querySelector("#password")
        ologinGet.onclick = () => {
            console.log(username.value, password.value);
            fetch(`/login?username=${username.value}&password=${password.value}`)
                .then(res => res.text())
                .then(res => {
                    console.log(res);
                })
        }
        ologinPost.onclick = () => {
            console.log(username.value, password.value);
            fetch(`/login`, {
                method: "POST",
                body: JSON.stringify({
                    username: username.value,
                    password: password.value
                }),
                headers: {
                    "content-type": "application/json"
                }
            }).then(res => res.text())
                .then(res => {
                    console.log(res);
                })
        }
    </script>
</body>

</html>
```



## 6. 返回数据

`res.send()` - send 返回代码片段 或 json

`res.json()` - json 返回只能是 json 对象

`res.render()` - render 返回是模版页面，如 ejs 模版



## 7. 托管静态文件

### 方式1

目录

```txt
public/
  home.html
  login.html
```

```js
// 配置静态资源 - 注意要放到最前面(多个写多行)
app.use(express.static("public"))
app.use(express.static("static"))
```

访问如下路径就都没有任何问题了：

```
http://127.0.0.1:3000/home.html
http://127.0.0.1:3000/login.html
http://127.0.0.1:3000/images/kitten.jpg
http://127.0.0.1:3000/css/style.css
http://127.0.0.1:3000/js/app.js
http://127.0.0.1:3000/images/bg.png
http://127.0.0.1:3000/hello.html
```

### 方式2

目录

```txt
static/
  list.html
```

```js
// 配置静态资源 - 注意要放到最前面(指定第一个参数时，url访问必须加上该path)
app.use("/static", express.static("static"))
```

访问如下路径中必须添加 static 目录才能访问到：

```
http://127.0.0.1:3000/static/list.html
http://127.0.0.1:3000/static/images/kitten.jpg
http://127.0.0.1:3000/static/css/style.css
http://127.0.0.1:3000/static/js/app.js
http://127.0.0.1:3000/static/images/bg.png
http://127.0.0.1:3000/static/hello.html
```



## 8. 模板引擎-服务端渲染

> * 服务端渲染，后端嵌套模版，后端渲染模版，SSR（后端把页面组装）
>   * 做好静态页面，动态效果
>   * 把前端代码提供给后端，后端要把静态 html 以及里面的假数据删掉，通过模版进行动态生成 html 里的内容
> * 前后端分离，BSR（前端中组装页面）
>   * 做好静态页面，动态效果
>   * json 模拟，ajax，动态创建页面
>   * 真实接口数据，前后联调
>   * 把前端提供给后端静态资源文件夹

### 安装

安装：*npm i ejs@3.1.6*

* 插件安装：**EJS language support** - 支持 ejs 的语法着色效果

需要在应用中进行如下设置才能让 Express 渲染模板文件：

* views, 放模板文件的目录，比如： `app.set('views', './views')`

* view engine, 模板引擎，比如： `app.set('view engine', 'ejs')`

index.js

```js
//配置模版引擎 - 写在最前面
app.set("views", "./views")
app.set("view engine", "ejs")
```

### 语法

* `<% %>` 流程控制标签，可写 if else，for
* `<%=  %>` 输出标签，原文输出HTML标签（不会解析HTML）
* `<%-  %>` 输出标签，HTML会被浏览器解析（*XSS攻击风险*）
* `<%#  %>` 注释标签，不会显示到浏览器页面源码（只有开发者编辑器中可见）
* `<%- include('user/show', {user: user}) %>` 导入公共的模版内容



### 使用

#### **输出标签示例 .ejs**

```ejs
    <p>
        <%= isShow ? '用户名密码不匹配错误' : '' %>
    </p>
```

LoginRouter.js

```js
const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    // 渲染模版给前端，会读取 views/login.ejs 模版页面返回给前端
    res.render("login", { isShow: false })
})

router.post("/", (req, res) => {
    if (req.body.username == "admin" && req.body.password == "123") {
        console.log("登录成功");
        res.redirect("/home") //redirect 重定向/跳转到 home
    } else {
        console.log("登陆失败");
        res.render("login", { isShow: true })
    }
})

module.exports = router
```



#### **for 示例 .ejs**

```ejs
    <ul>
        <% for(var i=0;i<list.length;i++) { %>
            <li><%= list[i] %></li>
         <% } %>
    </ul>
```

HomeRouter.js

```js
const express = require("express")

const router = express.Router()
// 路由级别中间件
router.get("/", (req, res) => {
    let list = ["aaa", "bbb", "ccc"]
    res.render("home", { list: list })
})

module.exports = router
```



#### 导入公共模版

如相同的头部、底部，单独写 header.ejs、footer.ejs...

header.ejs - 参数由谁导入谁传递

```ejs
<header>
    <% if(isShowBanner) { %>
        <h1>banner广告</h1>
    <% } %>
    <h1>我是公共头部</h1>
</header>

<style>
    header {
        background: yellow;
    }
</style>
```

home.ejs

* `<%- include("./header.ejs") %>` 导入公共模版，不传参数
* `<%- include("./header.ejs", { isShowBanner:isShowBanner }) %>` 导入公共模版，传参数

```ejs
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <%- include("./header.ejs", { isShowBanner:isShowBanner }) %>
    home主页。
    <ul>
        <% for(var i=0;i<list.length;i++) { %>
            <li>
                <%= list[i] %>
            </li>
            <% } %>
    </ul>
</body>

</html>
```

HomeRouter.js - 渲染给 home.ejs 参数内容 list, isShowBanner

```js
const express = require("express")

const router = express.Router()
// 路由级别中间件
router.get("/", (req, res) => {
    let list = ["aaa", "bbb", "ccc"]
    res.render("home", { list: list, isShowBanner: true })
})

module.exports = router
```



#### 渲染 html

index.js

```js
//配置模版引擎
app.set("views", "./views")
app.set("view engine", "html")
//支持直接渲染 html 文件
app.engine("html", require("ejs").renderFile())
```

将 public 下的 .html 文件，都剪切到了 views 目录下，需要上述配置才能渲染 html 文件。



### 生成器(★)

教程：https://expressjs.com/en/starter/generator.html#express-application-generator

安装：*npm i -g express-generator*

创建：*express myapp --view=ejs*

依赖：*cd myapp; npm i* 

启动：*npm start* - 有且仅只在 start 时，才能省略 run （等价于 *npm run start*）

* 本质是 package.json 中的 start 配置的 `node ./bin/www`，或添加一条命令，支持改代码自动重启 node 服务

```json
  "scripts": {
    "start": "node ./bin/www",
    "startdev": "node-dev ./bin/www",  //可选 node-dev
    "startmon": "nodemon ./bin/www"    //可选 nodemon
  },
```

最终启动：*npm run startdev*

目录结构：

```js
├─bin/
│  ├─www              // http 服务，默认端口 3000
├─public/             // 公共静态资源
├─routes/
│  ├─index.js         // home 首页路由中间件
│  ├─users.js         // users 示例路由中间件
├─views/
│  ├─error.ejs        // error 错误信息 ejs 模版
│  ├─index.ejs        // home 首页 ejs 模版
├─app.js              // 默认项目入口
└─package.json        // 默认依赖
```



验证 cookie-parser 的使用，如 router/users.js

```js
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  // 获取 cookie（浏览器控制台手动设置 cookie: document.cookie="username=jerry"）
  console.log(req.cookies); // 输出 json 格式: { username: "jerry" }
  // 设置 cookie 给前端
  res.cookie("location", "china")

  res.send('respond with a resource');
});

module.exports = router;
```























