---
title: 10-Node.js+WebSocket通信
date: 2022-5-22 21:36:21
tags:
- Vue
- Node
- Node.js
- WebSocket
- Socket.io
categories: 
- 04_大前端
- 06_Node.js
---

![image-20260113102144733](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260113102145988.png)

参考：

* Express 官网：https://www.expressjs.com.cn/
* ws npm仓库文档：https://www.npmjs.com/package/ws
* ws 简易聊天室：https://github.com/janycode/nodejs-express-websocket



## 1. WebSocket 介绍

应用场景：弹幕、媒体聊天、协同编辑、基于位置的应用、体育实况更新、股票基金报价实时更新...

WebSocket并不是全新的协议，而是利用了HTTP协议来建立连接。我们来看看WebSocket连接是如何创建的。

首先，WebSocket连接 `必须由浏览器发起`，因为请求协议是一个标准的HTTP请求，格式如下：

```http
GET ws://localhost:3000/ws/chat HTTP/1.1
Host: localhost
Upgrade: websocket
Connection: Upgrade
Origin: http://localhost:3000
Sec-WebSocket-Key: client-random-string
Sec-WebSocket-Version: 13
```

WebSocket，简写 ws

该请求和普通的HTTP请求有几点不同：

* GET请求的地址不是类似 /path/，而是以 `ws://` 开头的地址；
* 请求头 Upgrade: websocket 和 Connection: Upgrade表示这个连接将要被转换为WebSocket连接；
* Sec-WebSocket-Key 是用于标识这个连接，并非用于加密数据；
* Sec-WebSocket-Version 指定了WebSocket的协议版本。

随后，服务器如果接受该请求，就会返回如下响应：

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: server-random-string
```

该响应代码101表示本次连接的HTTP协议即将被更改，更改后的协议就是Upgrade: websocket指定的WebSocket协议。

版本号和子协议规定了双方能理解的数据格式，以及是否支持压缩等等。如果仅使用WebSocket的API，就不需要关心这些。

现在，一个WebSocket连接就建立成功，浏览器和服务器就可以随时主动发送消息给对方。消息有两种，一种是文本，一种是二进制数据。通常，我们可以发送JSON格式的文本，这样，在浏览器处理起来就十分容易。

为什么WebSocket连接可以实现全双工通信而HTTP连接不行呢？实际上HTTP协议是建立在TCP协议之上的，TCP协议本身就实现了全双工通信，但是HTTP协议的请求－应答机制限制了全双工通信。WebSocket连接建立以后，其实只是简单规定了一下：接下来，咱们通信就不使用HTTP协议了，直接互相发数据吧。

安全的WebSocket连接机制和HTTPS类似。首先，浏览器用wss://xxx创建WebSocket连接时，会先通过HTTPS创建安全的连接，然后，该HTTPS连接升级为WebSocket连接，底层通信走的仍然是安全的SSL/TLS协议。

### 浏览器支持

很显然，要支持WebSocket通信，浏览器得支持这个协议，这样才能发出ws://xxx的请求。目前，支持WebSocket的主流浏览器如下：

* Chrome
* Firefox
* IE >= 10
* Sarafi >= 6
* Android >= 4.4
* iOS >= 8



### 服务器支持

由于WebSocket是一个协议，服务器具体怎么实现，取决于所用编程语言和框架本身。Node.js本身支持的协议包括TCP协议和HTTP协议，要支持WebSocket协议，需要对Node.js提供的HTTPServer做额外的开发。

已经有若干基于Node.js的稳定可靠的WebSocket实现，我们直接用npm安装使用即可。



## 2. WS 模块

### 2.1 安装

安装：*npm init; npm i express@4 ws*

文档：https://www.npmjs.com/package/ws

### 2.2 使用

最简单示例，群聊、匿名

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <h1>WebSocket聊天室</h1>

    <script>
        var ws = new WebSocket("ws://localhost:8080")
        ws.onopen = () => {
            console.log("连接成功");
        }
        ws.onmessage = (msObj) => {
            console.log(msObj.data);
        }
        ws.onerror = (error) => {
            console.error(error);
        }
    </script>
</body>

</html>
```

index.js

```js
const express = require("express")
const app = express()
//访问 public 下的静态资源如 chat.html
app.use(express.static("./public"))
// http响应
app.get("/", (req, res) => {
    res.send({ ok: 1 })
})

// websocket响应
const WebSocket = require("ws")
const wss = new WebSocket.WebSocketServer({ port: 8080 });
// 监听默认事件 connection，不可修改，修改没什么用
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    ws.on('message', function message(data) {
        console.log('received: %s', data);
        // Server broadcast：转发给其他人(广播)
        wss.clients.forEach(function each(client) {
            if (client != ws && client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: false });
            }
        });
    });

    ws.send('欢迎来到聊天室！');
});


app.listen(3000)
```



### 2.3 在线聊天室

#### 简易效果

![image-20260119120111670](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260119120113242.png)

#### 实现

demo 完整代码参考 github：https://github.com/janycode/nodejs-express-websocket

核心代码实现：websocketServer.js 与 chat.ejs

bin/websocketServer.js

```js
// websocket响应
const WebSocket = require("ws");
const JWT = require("../util/JWT");
const wss = new WebSocket.WebSocketServer({ port: 8080 });
// 监听默认事件 connection，不可修改，修改没什么用
wss.on('connection', function connection(ws, req) {
    console.log("req.url->", req.url);
    const reqUrl = new URL(req.url, "http://127.0.0.1:3000")
    const payload = JWT.verify(reqUrl.searchParams.get("token"))
    if (payload) {
        console.log("success:", payload);
        ws.user = payload  // .user 是新挂上 ws 的属性
        ws.send(createMessage(WebSocketType.GroupChat, ws.user, "欢迎来到聊天室-群聊开始..."))
        // 群发：用户上线时，群发一下用户列表
        sendTo(WebSocketType.GroupList, ws.user, Array.from(wss.clients).map(item => item.user))
    } else {
        console.log("未授权");
        ws.send(createMessage(WebSocketType.Error, null, "未授权！"))
    }

    ws.on('error', console.error);
    ws.on('message', function message(data) {
        // console.log('received: %s', data);
        const msgObj = JSON.parse(data)
        switch (msgObj.type) {
            case WebSocketType.GroupList:
                //console.log(Array.from(wss.clients).map(item => item.user)); //wss.clients中有 user{} 对象
                // 在线用户列表
                sendTo(WebSocketType.GroupList, ws.user, Array.from(wss.clients).map(item => item.user))
                console.log("发送用户列表 success ->", userList);
                break;
            case WebSocketType.GroupChat:
                console.log(msgObj.data);
                sendTo(WebSocketType.GroupChat, ws.user, msgObj.data)
                break;
            case WebSocketType.SingleChat:
                sendTo(WebSocketType.SingleChat, ws.user, msgObj.data, msgObj.to)
                break;
            case WebSocketType.Error:
                break;
            default:
                break;
        }
    });

    ws.on("close", () => {
        wss.clients.delete(ws.user)
        console.log("close:", ws.user);
    })

    //ws.send('欢迎来到聊天室！');
});

const WebSocketType = {
    Error: 0,     //错误
    GroupList: 1, //获取在线用户列表
    GroupChat: 2, //群聊
    SingleChat: 3 //私聊
}

function createMessage(type, user, data) {
    return JSON.stringify({
        type, user, data
    })
}

function sendTo(type, user, data, to) {
    // Server broadcast：转发给其他人(广播)
    wss.clients.forEach(function each(client) {
        let condition = client.readyState === WebSocket.OPEN
        if (to) {
            //私聊，添加到发送消息条件上
            condition = condition && (client.user.username === to)
        }
        if (condition) {
            client.send(createMessage(type, user, JSON.stringify(data)))
            console.log("广播消息:", type, user, data);
        }
    });
}
```

views/chat.ejs

```ejs
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        /* 新增：极简样式，让聊天记录更易读（可选但推荐） */
        #chatList {
            width: 500px;
            height: 300px;
            border: 1px solid #ccc;
            padding: 10px;
            overflow-y: auto;
            margin: 10px 0;
        }

        .chat-item {
            margin: 5px 0;
        }

        .chat-group {
            color: #333;
        }

        .chat-single {
            color: #0066cc;
        }

        .chat-self {
            text-align: right;
            color: #009900;
        }
    </style>
</head>

<body>
    <h1>WebSocket 聊天室</h1>
    <h3>欢迎 <span id="myname" style="color:red"></span>，当前在线用户数：<span id="count" style="color:green"></span></h3>

    <!-- 新增：聊天记录列表容器 -->
    <div id="chatList"></div>

    <input type="text" id="text"><button id="send">发送</button>
    <select id="select"></select>

    <script>
        let select = document.querySelector("#select")
        let myname = document.querySelector("#myname")
        let count = document.querySelector("#count")
        let send = document.querySelector("#send")
        let text = document.querySelector("#text")
        // 新增：获取聊天记录容器
        let chatList = document.querySelector("#chatList")

        //当前登陆用户信息显示
        const params = new URLSearchParams(window.location.search);
        const username = params.get('username'); // 新增：缓存当前用户名
        console.log("登陆用户:", username);
        myname.innerHTML = username

        const WebSocketType = {
            Error: 0,     //错误
            GroupList: 1, //获取在线用户列表
            GroupChat: 2, //群聊
            SingleChat: 3 //私聊
        }
        // 建立 socket 连接，带着 token，后端验证
        const ws = new WebSocket(`ws://localhost:8080?token=${localStorage.getItem("token")}`)
        ws.onopen = () => {
            console.log("连接成功");
        }
        ws.onmessage = (msgObj) => {
            console.log("msgObj.data->", msgObj.data);
            msgJSON = JSON.parse(msgObj.data)
            switch (msgJSON.type) {
                case WebSocketType.Error:
                    localStorage.removeItem("token")
                    location.href = "/login"
                    break
                case WebSocketType.GroupChat:
                    console.log((msgJSON.user ? msgJSON.user.username : "广播：") + ":" + msgJSON.data);
                    // 新增：渲染群聊消息到列表，如果当前就是我自己，就不需要再把我自己放上去
                    if (msgJSON.user?.username !== username) {
                        renderChatMsg(msgJSON.user?.username || "广播", msgJSON.data, "group");
                    }
                    break
                case WebSocketType.GroupList:
                    const onlineList = JSON.parse(msgJSON.data)
                    if (Array.isArray(onlineList)) {
                        console.log("在线用户数->", onlineList.length);
                        count.innerHTML = `${onlineList.length}`
                    }
                    select.innerHTML = ""
                    select.innerHTML = `<option>全部</option>` + onlineList.map(item => `
                        <option>${item.username}</option>
                    `)
                    break
                case WebSocketType.SingleChat:
                    console.log((msgJSON.user ? msgJSON.user.username : "广播：") + ":" + msgJSON.data);
                    // 新增：渲染私聊消息到列表
                    renderChatMsg(msgJSON.user?.username || "私聊", msgJSON.data, "single");
                    break
                default:
                    console.log("default");
                    break
            }
        }
        ws.onerror = (error) => {
            console.error(error);
        }

        send.onclick = () => {
            if (text.value.trim() === "") return; // 新增：空消息不发送
            if (select.value === "全部") {
                console.log("群发");
                ws.send(createMessage(WebSocketType.GroupChat, text.value))
                // 新增：自己发送的群聊消息，直接渲染（避免等后端回传）
                renderChatMsg("我", text.value, "self");
            } else {
                console.log("私聊");
                ws.send(createMessage(WebSocketType.SingleChat, text.value, select.value))
                // 新增：自己发送的私聊消息，直接渲染
                renderChatMsg(`我（私聊给${select.value}）`, text.value, "self");
            }
            text.value = ""; // 新增：发送后清空输入框
        }

        // 新增：渲染聊天消息的核心函数（最小改动的关键）
        function renderChatMsg(sender, content, type) {
            const chatItem = document.createElement("div");
            chatItem.className = `chat-item chat-${type}`;
            chatItem.innerHTML = `<strong>${sender}：</strong>${content}`;
            chatList.appendChild(chatItem);
            // 新增：自动滚动到最新消息
            chatList.scrollTop = chatList.scrollHeight;
        }

        function createMessage(type, data, to) {
            return JSON.stringify({ type, data, to })
        }
    </script>
</body>

</html>
```



## 3. socket.io 模块

### 3.1 安装

安装：*npm init; npm i express@4 socket.io*

文档：https://www.npmjs.com/package/socket.io



### 3.2 使用

前后端都是 socket.on 监听，socket.emit 触发，减少了很多学习成本。

bin/www

```js
var app = require('../app');
var debug = require('debug')('server:server');
var http = require('http');
// 1.引入socket服务器
var socketioServer = require("./socketioServer")
//...
var server = http.createServer(app);
// 2.引入socket.io
socketioServer(server);
```

bin/socketioServer.js

```js
const JWT = require('../util/JWT');

// socket.io响应
function start(server) {
    const io = require('socket.io')(server)
    io.on('connection', (socket) => {
        console.log("connection success  111", socket.handshake.query.token);
        // token解析
        const payload = JWT.verify(socket.handshake.query.token)
        if (payload) {
            socket.user = payload
            //发送欢迎
            socket.emit(WebSocketType.GroupChat, createMessage(socket.user, "欢迎来到聊天室"))
            //给所有发送用户列表(实时获取)
            sendAll(io, socket.user)
        } else {
            socket.emit(WebSocketType.Error, createMessage(socket.user, "token过期，未授权"))
        }

        socket.on(WebSocketType.GroupList, () => {
            // 用户列表需要实时获取
            console.log("sockets user:", Array.from(io.sockets.sockets).map(item => item[1].user))
            sendAll(io, socket.user)
        })
        socket.on(WebSocketType.GroupChat, (msg) => {
            console.log("群聊：", msg);
            console.log("群聊 data：", JSON.parse(msg).data);
            //给所有人发
            // io.sockets.emit(WebSocketType.GroupChat, createMessage(socket.user, msg.data))
            //除了自己不发，其他人发
            socket.broadcast.emit(WebSocketType.GroupChat, createMessage(socket.user, JSON.parse(msg).data))
        })
        socket.on(WebSocketType.SingleChat, (msg) => {
            const msgObj = JSON.parse(msg)
            Array.from(io.sockets.sockets).forEach(item => {
                if (item[1].user.username === msgObj.to) {
                    item[1].emit(WebSocketType.SingleChat, createMessage(socket.user, msgObj.data))
                }
            })
        })

        socket.on('disconnect', () => {
            sendAll(io, socket.user)
        });
    });
}

const WebSocketType = {
    Error: 0,     //错误
    GroupList: 1, //获取在线用户列表
    GroupChat: 2, //群聊
    SingleChat: 3 //私聊
}

function createMessage(user, data) {
    return JSON.stringify({
        user, data
    })
}

function sendAll(io, user) {
    const userList = Array.from(io.sockets.sockets).map(item => item[1].user).filter(item => item)
    io.sockets.emit(WebSocketType.GroupList, createMessage(user, userList))
}

module.exports = start
```

views/chat_sosketio.ejs

```ejs
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        /* 新增：极简样式，让聊天记录更易读（可选但推荐） */
        #chatList {
            width: 500px;
            height: 300px;
            border: 1px solid #ccc;
            padding: 10px;
            overflow-y: auto;
            margin: 10px 0;
        }

        .chat-item {
            margin: 5px 0;
        }

        .chat-group {
            color: #333;
        }

        .chat-single {
            color: #0066cc;
        }

        .chat-self {
            text-align: right;
            color: #009900;
        }
    </style>
    <script src="/javascripts/socket.io.min.js"></script>
</head>

<body>
    <h1>WebSocket 聊天室</h1>
    <h3>欢迎 <span id="myname" style="color:red"></span>，当前在线用户数：<span id="count" style="color:green"></span></h3>

    <!-- 新增：聊天记录列表容器 -->
    <div id="chatList"></div>

    <input type="text" id="text"><button id="send">发送</button>
    <select id="select"></select>

    <script>
        let select = document.querySelector("#select")
        let myname = document.querySelector("#myname")
        let count = document.querySelector("#count")
        let send = document.querySelector("#send")
        let text = document.querySelector("#text")
        // 新增：获取聊天记录容器
        let chatList = document.querySelector("#chatList")

        //当前登陆用户信息显示 socket.io[演示]存了 localStorage
        const username = localStorage.getItem("username");
        console.log("登陆用户:", username);
        myname.innerHTML = username
        count.innerHTML = 0

        const WebSocketType = {
            Error: 0,     //错误
            GroupList: 1, //获取在线用户列表
            GroupChat: 2, //群聊
            SingleChat: 3 //私聊
        }
        // 建立 socket 连接，带着 token，后端验证
        const socket = io(`ws://localhost:3000?token=${localStorage.getItem("token")}`)
        socket.on(WebSocketType.GroupChat, msg => {
            console.log("msg 2:", JSON.parse(msg));
            const msgJSON = JSON.parse(msg)
            // 新增：渲染群聊消息到列表，如果当前就是我自己，就不需要再把我自己放上去
            if (msgJSON.user?.username !== username) {
                renderChatMsg(msgJSON.user?.username || "广播", msgJSON.data, "group");
            }
        })
        socket.on(WebSocketType.Error, msg => {
            localStorage.removeItem("token")
            location.href = "/login"
        })
        socket.on(WebSocketType.GroupList, msg => {
            console.log("msg 1:", JSON.parse(msg));
            const onlineList = JSON.parse(msg).data
            if (Array.isArray(onlineList)) {
                console.log("在线用户数->", onlineList.length);
                count.innerHTML = `${onlineList.length}`
            }
            select.innerHTML = ""
            select.innerHTML = `<option>全部</option>` + onlineList.map(item => `
                        <option>${item.username}</option>
                    `)
        })
        socket.on(WebSocketType.SingleChat, msg => {
            console.log("msg 3:", JSON.parse(msg));
            const msgJSON = JSON.parse(msg)
            // 新增：渲染私聊消息到列表
            renderChatMsg(msgJSON.user?.username || "私聊", msgJSON.data, "single");
        })

        send.onclick = () => {
            if (text.value.trim() === "") return; // 新增：空消息不发送
            if (select.value === "全部") {
                console.log("群发");
                socket.emit(WebSocketType.GroupChat, createMessage(text.value))
                // 新增：自己发送的群聊消息，直接渲染（避免等后端回传）
                renderChatMsg("我", text.value, "self");
            } else {
                console.log("私聊");
                socket.emit(WebSocketType.SingleChat, createMessage(text.value, select.value))
                // 新增：自己发送的私聊消息，直接渲染
                renderChatMsg(`我（私聊给${select.value}）`, text.value, "self");
            }
            text.value = ""; // 新增：发送后清空输入框
        }
        // 新增：渲染聊天消息的核心函数（最小改动的关键）
        function renderChatMsg(sender, content, type) {
            const chatItem = document.createElement("div");
            chatItem.className = `chat-item chat-${type}`;
            chatItem.innerHTML = `<strong>${sender}：</strong>${content}`;
            chatList.appendChild(chatItem);
            // 新增：自动滚动到最新消息
            chatList.scrollTop = chatList.scrollHeight;
        }
        function createMessage(data, to) {
            return JSON.stringify({ data, to })
        }
    </script>
</body>

</html>
```



### 3.3 在线聊天室

#### 效果同上

#### 实现

demo 完整代码参考 github：https://github.com/janycode/nodejs-express-websocket

核心代码实现：socketioServer.js 与 chat_sosketio.ejs

ejs 页面的客户端涉及 js 库引入：[socket.io.min.js](https://github.com/socketio/socket.io/blob/main/packages/socket.io/client-dist/socket.io.min.js)



































