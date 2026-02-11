---
title: 02-Node.js路由
date: 2022-5-22 21:36:21
tags:
- Vue
- Node
- Node.js
- 路由
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



## 1. Node.js 路由

### 1.1 路由基础

封装与解耦的思想，目录：

```txt
static/
  home.html
  login.html
  404.html
  favicon.ico
api.js
index.js
route.js
server.js
```

index.js

```js
const server = require("./server")
const route = require("./route")
const api = require("./api")

// 注册路由
server.use(route)
server.use(api)
// 启动服务器
server.start()
```

server.js

```js
const http = require("http")

let Router = {}
// express use
function use(obj) {
    Object.assign(Router, obj)
}

function start() {
    const server = http.createServer()
    server.on("request", (req, res) => {
        const myURL = new URL(req.url, "http://127.0.0.1")
        console.log(myURL.pathname)
        // route(res, myURL.pathname) // 对应方式1
        try {
            Router[myURL.pathname](req, res) // 对应方式2
        } catch (error) {
            Router["/404"](req, res)
        }
    })

    server.listen(3000, () => {
        console.log("server start");
    })
}

exports.start = start
exports.use = use
```

route.js

```js
const fs = require("fs")

// route["/login"]  text/html
function render(res, code, path, type = "") {
    res.writeHead(code, { "content-type": `${type ? type : "text/html"};chartset=utf-8` })
    res.write(fs.readFileSync(path), "utf-8")
    res.end()
}
const route = {
    "/login": (res) => {
        render(res, 200, "./static/login.html")
    },
    "/home": (res) => {
        render(res, 200, "./static/home.html")
    },
    "/404": (res) => {
        render(res, 404, "./static/404.html")
    },
    "/favicon.ico": (res) => {
        render(res, 200, "./static/favicon.ico", "image/x-icon")
    }
}

module.exports = route
```

api.js

```js
// application/json
function render(res, code, data, type = "") {
    res.writeHead(code, { "content-type": `${type ? type : "application/json"};chartset=utf-8` })
    res.write(data)
    res.end()
}

const apiRouter = {
    "/api/login": (res) => {
        render(res, 200, `{ok: 1}`)
    }
}

module.exports = apiRouter
```



### 1.2 获取参数

api.js - 解析 GET 和 POST 请求参数

```js
const apiRouter = {
    "/api/login": (req, res) => {
        // 获取 GET 请求参数
        const myURL = new URL(req.url, "http://127.0.0.1")
        console.log(myURL.searchParams);
        let username = myURL.searchParams.get("username")
        let password = myURL.searchParams.get("password")
        if (username === "admin" && password === "123") {
            render(res, 200, `{"ok": 1}`)
        } else {
            render(res, 200, `{"ok": 0}`)
        }
    },
    "/api/login/post": (req, res) => {
        // 获取 POST 请求参数
        let post = ""
        req.on("data", chunk => {
            post += chunk
        })
        req.on("end", () => {
            console.log("post->", post);
            post = JSON.parse(post)
            if (post.username === "admin" && post.password === "123") {
                render(res, 200, `{"ok": 1}`)
            } else {
                render(res, 200, `{"ok": 0}`)
            }
        })
    }
}

// application/json
function render(res, code, data, type = "") {
    res.writeHead(code, { "content-type": `${type ? type : "application/json"};chartset=utf-8` })
    res.write(data)
    res.end()
}

module.exports = apiRouter
```

login.html - 传递参数

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
            fetch(`/api/login?username=${username.value}&password=${password.value}`)
                .then(res => res.json())
                .then(res => {
                    console.log(res);
                })
        }
        ologinPost.onclick = () => {
            console.log(username.value, password.value);
            fetch(`/api/login/post`, {
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
                })
        }
    </script>
</body>

</html>
```



### 1.3 静态资源处理 mime

依赖 [mime](https://www.npmjs.com/package/mime) 库，用于返回给浏览器，识别并渲染如 css 静态资源。

安装：*npm init; npm i mime@3.0.0*

> 基于 node18.20.3 使用 mime3.0.0，主要因为 mime4不支持 require 引入。

目录

```txt
static/
  css/
    login.css
  js/
    login.js
  ...
  login.html
...
router.js
```

router.js - 改造支持静态资源返回给浏览器

```js
const fs = require("fs")
const path = require("path")
const mime = require("mime")  // 引入 mime

const route = {
    "/login": (req, res) => {
        render(res, 200, "./static/login.html")
    },
    "/": (req, res) => {  //默认首页
        render(res, 200, "./static/home.html")
    },
    "/home": (req, res) => {
        render(res, 200, "./static/home.html")
    },
    "/404": (req, res) => {
        if (readStaticFile(req, res)) {   //静态资源判断，如果是就直接返回（不返回404）
            return
        }
        render(res, 404, "./static/404.html")
    },
    "/favicon.ico": (req, res) => {
        render(res, 200, "./static/favicon.ico", "image/x-icon")
    }
}

function readStaticFile(req, res) {
    // 获取路径
    const myURL = new URL(req.url, "http://127.0.0.1:3000")
    // 静态资源绝对路径
    const pathname = path.join(__dirname, "/static", myURL.pathname)
    // if (myURL.pathname === "/") return false
    if (fs.existsSync(pathname)) {
        // 返回静态资源绝对地址，用于渲染和显示(渲染依赖 mime 库: npm i mime@3.0.0)
        render(res, 200, pathname, mime.getType(myURL.pathname.split(".")[1]))
        return true
    } else {
        return false
    }
}

// route["/login"]  text/html
function render(res, code, path, type = "") {
    res.writeHead(code, { "content-type": `${type ? type : "text/html"};chartset=utf-8` })
    res.write(fs.readFileSync(path), "utf-8")
    res.end()
}

module.exports = route
```



### 1.4 重定向|跳转

```js
res.redirect("/home")  //跳转到 /home 路由
```





























