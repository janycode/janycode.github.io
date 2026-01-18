---
title: 10-Node.js+WebSocket连接
date: 2022-5-22 21:36:21
tags:
- Vue
- Node
- Node.js
- Socket
- WebSocket
categories: 
- 04_大前端
- 06_Node.js
---

![image-20260113102144733](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260113102145988.png)

参考：

* Express 官网：https://www.expressjs.com.cn/
* ws npm仓库文档：https://www.npmjs.com/package/ws



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



### 2.3 













