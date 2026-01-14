---
title: 01-Node.js基础
date: 2022-5-22 21:36:21
tags:
- Vue
- Node
- Node.js
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



## 1. Node.js 基础

### 1.1 介绍

Node.js 是一个 JavaScript 运行环境。它让 JavaScript 可以开发后端程序，实现几乎其他后端语言实验的所有功能，可以与 PHP、Java、Python、.net、Ruby等后端语言平起平坐。

Nodejs是基于V8引擎，V8是Google发布的开源JavaScript引擎，本身就是用于Chrome浏览器的js解释部分，但是Ryan Dahl 这哥们，鬼才般的，把这个V8搬到了服务器上，用于做服务器的软件。

#### nodejs的特性

- Nodejs语法完全是js语法，只要懂js基础就可以学会Nodejs后端开发

- Nodejs超强的高并发能力，实现高性能服务器

- 开发周期短、开发成本低、学习成本低

#### 核心特点

* 单线程：Node.js 使用单线程处理请求
* 事件循环：通过事件驱动机制处理并发
* 非阻塞 I/O：I/O 操作不会阻塞主线程
* 跨平台：可以在 Windows、Linux、macOS 等系统上运行

#### 工作机制

![image-20260113113609626](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260113113613154.png)

### 1.2 安装&插件

可选版本：16+版本，18+版本，20+版本

Node.js 下载地址：https://nodejs.cn/download/

安装注意事项（以 windows 为例）：

* 16+版本：https://registry.npmmirror.com/-/binary/node/latest-v16.x/node-v16.20.2-x64.msi
* 18+版本：https://registry.npmmirror.com/-/binary/node/latest-v18.x/node-v18.20.3-x64.msi
* 20+版本：https://registry.npmmirror.com/-/binary/node/latest-v20.x/node-v20.15.0-x64.msi

> node 安装步骤参考：https://www.runoob.com/nodejs/nodejs-install-setup.html

如果安装了 nvm 就可以使用 nvm 命令安装指定的 node 版本。

> nvm 安装和使用：https://www.runoob.com/nodejs/nodejs-nvm.html

命令如下：

```sh
nvm install 18.20.3
nvm use 18.20.3
node -v #输出 v18.20.3
```

插件推荐：

* **Node.js Extension Pack**：包含多个 Node.js 相关插件的集合包
* **JavaScript (ES6) code snippets**：提供 ES6+ 代码片段
* **npm Intellisense**：npm 包自动补全
* **Path Intellisense**：文件路径自动补全



### 1.3 验证使用

hello.js

```js
console.log("hello,nodejs");

function test() {
    console.log("test function");
}

test()
```

```powershell
> node .\01-hello.js
hello,nodejs
test function
```



> Node 中没有 bom 和 dom，只能以基础的 JavaScript 语法来进行开发，比如遵循 ES6 标准。



### 1.4 commonJS规范 - 【CJS】

为什么需要模块化开发？

![image-20260113112237766](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260113112239476.png)

commonJS（模块化）规范：

![image-20260113113657167](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260113113659343.png)

#### 模块化规范写法

公共功能抽离为一个单独的 js 文件，它作为一个模块。默认情况下面这个模块里面的方法或者属性，外面是没法访问的。如果要让外部可以访问模块里面的方法或者属性，就必须在模块里面通过 `exports` 或者 `module.exports` 暴露属性或者方法。

模块定义 ./js/a.js

```js
function test() {
    console.log("a.test");
}
function test2() {
    console.log("a.test2");
}
// 多个方法导出方式1
// module.exports = {
//     test,
//     test2
// }
// 多个方法导出方式2
exports.test = test
exports.test2 = test2
```

index.js

```js
let moduleA = require('./js/a')
console.log(moduleA);

moduleA.test()
moduleA.test2()
```

内部方法以 _ 下划线开头，并且不导出，其他模块就无法使用。如：

```js
function _init() {
    console.log("内部方法 _init");
}
```



### 1.5 npm & nrm & yarn

#### npm

```sh
npm init                    #初始化库，自动创建 package.json
npm install 包名             #简写i(自动创建 node_modules/ 和 package-lock.json)，uninstall简写un或rm, update
npm install 包名 –g          #-g 全局安装【某些特定的包才需要全局】
npm install 包名 --save-dev  #--save 是默认(可省略)，上线打包会用到；--save-dev 是开发环境下用，上线打包时不会包含
npm list -g                 #不加-g，列举当前目录下的安装包
npm info 包名                #详细信息
npm info 包名 version        #获取最新版本
npm install 包名@版本         #安装指定版本，如 npm i md5@1
npm outdated                 #检查package.json中过时的包列表
```

npm init 初始化一个 npm 仓库，会创建一个 `package.json`，用于维护包的基本信息和依赖版本。

```sh
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (npm) aaa                 #默认包名字是文件夹名字，可以取个新的，如aaa
version: (1.0.0)                        #默认包版本号
description: test aaa                   #包描述信息
entry point: (index.js)                 #入口
test command:                           #测试命令
git repository:                         #git仓库
keywords:                               #关键词
author: jerry                           #作者
license: (ISC)                          #license
About to write to E:\work\webProjects\nodejs\01-基础\03-npm&nrm&yarn\npm\package.json:

{
  "name": "aaa",
  "version": "1.0.0",
  "description": "test aaa",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "jerry",
  "license": "ISC"
}

Is this OK? (yes)
```

版本号符号含义：

```js
"dependencies": { "md5": "^2.1.0" }
"dependencies": { "md5": "~2.1.0" }
"dependencies": { "md5": "*" } 
```

* `^ 表示在 npm i 时将会安装 md5 2.*.* 最新版本`
* `~ 表示在 npm i 时将会安装 md5 2.1.* 最新版本`
* ` * 表示在 npm i 时将会安装 md5 的最新版本`



#### nrm

> NRM (npm registry manager)是npm的镜像源管理工具，有时候国外资源太慢，使用这个就可以快速地在 npm 源间切换。

手动切换镜像为`淘宝镜像`：*npm config set registry https://registry.npmmirror.com*

```sh
#全局安装 nrm
npm i nrm -g
#确认安装成功，查看版本
nrm -V
#使用 nrm 查看可选的源，其中，带*的是当前使用的源，上面的输出表明当前源是官方源。
nrm ls
#切换 nrm 到 taobao 源
nrm use taobao
#测试 nrm 镜像源的速度
nrm test
```

> `cnpm` 国内镜像安装：*npm i cnpm -g --registry=https://registry.npmmirror.com*
>
> 就可以完全替代 npm，默认就连接到 taobao 镜像。
>
> 这是一个完整的 npmjs.org 镜像，可以用此代替官方版本（只读），同步频率为10分钟一次，保证尽量与官方服务同步。



#### yarn

yarn[jɑːn]，与 jar 基本同音。

安装命令：*npm i yarn -g*

> 对比npm:
>
> * `速度超快`: Yarn 缓存了每个下载过的包，所以再次使用时无需重复下载。 同时利用并行下载以最大化资源利用率，因此安装速度更快。
>
> * `超级安全`: 在执行代码之前，Yarn 会通过算法校验每个安装包的完整性。

```sh
#开始新项目
yarn init 
#添加依赖包
yarn add 包名
yarn add 包名@版本
yarn add 包名 --dev 
#升级依赖包
yarn upgrade 包名@版本
#移除依赖包
yarn remove 包名
#安装项目的全部依赖，没有简写命令
yarn install 
```



### 1.6 nodemon 自动重启

安装：*npm i nodemon -g*

每次保存代码就会自动重启服务器。

启动命令不变：*nodemon ./test.js*

> 另一种方案(开发阶段使用)：*npm i node-dev -g*
>
> 启动命令就需要换成：*node-dev ./test.js*



## 2. 内置模块 - 模块化开发

> 以 node 18 版本文档为参考：https://nodejs.cn/api/v18/zlib.html
>
> 所有模块使用前都需要导入，导入方式有两种：
>
> * `CJS`，即 commonJS 规范
> * `ESM`，即 ES6 规范（**JavaScript 模块化标准**）

### 2.0 ES 规范 - 【ESM】

|         导出方式         |           导入方式            |            特点            |
| :----------------------: | :---------------------------: | :------------------------: |
|   `export default xxx`   | `import 任意名称 from '模块'` | 一个模块只能有一个默认导出 |
| `export const xxx = ...` | `import { xxx } from '模块'`  |      支持多个命名导出      |

模块化开发，需要在当前目录下 *npm init*，然后在 package.json 添加 `"type": "module", ` 字段

```json
{
  "name": "aaa",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "jerry",
  "license": "ISC",
  "description": ""
}
```

示例

module/moduleA.js

```js
const moduleA = {
    getName() {
        return 'jerry'
    }
}
export default moduleA
```

module/moduleB.js

```js
const moduleB = {
    getName() {
        return 'tom'
    }
}
export {
    moduleB
}
```

index.js

```js
import moduleA from "./module/moduleA.js"; //在 node中引入时 .js 需要写
import { moduleB } from "./module/moduleB.js";
// const moduleA = require("./module/moduleA.js")  // commonJS规范 与 ES规范不兼容，选其一即可

console.log(moduleA.getName()); //jerry
console.log(moduleB.getName()); //tom
```



### 2.1 http 模块

#### 2.1.1 http

CJS `const http = require('http');`  ESM `import http from 'http';`

> 要使用 HTTP 服务器和客户端，则必须 `require('http')`。

最简单的启动一个服务器：

```js
// 创建服务器
const server = http.createServer();
// 绑定每一个请求事件
server.on("request", (req, res) => {
    //req 接收浏览器传的参数，res 返回渲染的内容
    res.writeHead(renderStatus(req.url), { "Content-Type": "text/html;charset=UTF-8" })
    res.write(renderHTML(req.url))
    res.end()
})
// 监听到3000端口
server.listen(3000, () => {
    console.log("server start :3000");
})
```


模拟路由和响应html：

```js
var http = require("http")
// 创建服务器
const server = http.createServer();

server.on("request", (req, res) => {
    //req 接收浏览器传的参数，
    //res 返回渲染的内容
    // res.write("hello, http server111")
    // res.write("hello, http server222")
    // res.end() //必须要end，否则认为没有结束
    // res.end("[1, 2, 3]") //仅支持字符串
    console.log(req.url);  // 不包含域名的相对路径

    res.writeHead(renderStatus(req.url), { "Content-Type": "text/html;charset=UTF-8" })
    res.write(renderHTML(req.url))
    res.end()
})

server.listen(3000, () => {
    console.log("server start :3000");
})

function renderStatus(url) {
    let urls = ['/home', '/list']
    return urls.includes(url) ? 200 : 404
}

function renderHTML(url) {
    switch (url) {
        case '/home':
            return `
                <html>
                    <b>hello,wrold</b>
                    <b>大家好</b>
                </html>
            `
        case '/list':
            return `
                <html>
                    <b>hello,wrold</b>
                    <b>list页面</b>
                </html>
            `
        default:
            return `
                <html>
                    <b>404页面</b>
                </html>
            `
    }
}
```



#### 2.1.2 接口 jsonp

jsonp.js - 主要解决跨域。原理：`动态创建 script 标签-没有跨域限制，指向后端接口，返回一个前端提前定义好的 callback 方法`。

```js
var http = require("http")
var url = require("url")

http.createServer((req, res) => {
    var urlobj = url.parse(req.url, true)
    console.log(urlobj.query.callback); //test
    switch (urlobj.pathname) {
        case "/api/aaa":
            res.end(`${urlobj.query.callback}(${JSON.stringify({
                name: 'jerry',
                age: 20
            })})`)
            break;
        default:
            res.end("404")
    }
}).listen(3000)
```

index.html

```html
<body>
    <!-- jsonp接口调用 -->
    <script>
        var oscript = document.createElement("script")
        oscript.src = "http://localhost:3000/api/aaa?callback=test"
        document.body.appendChild(oscript)
        function test(obj) {
            console.log("test ->", obj);  //test-> {name: 'jerry', age: 20}
        }
    </script>
</body>
```



#### 2.1.3 跨域 cors

node解决跨域：`"access-control-allow-origin": "*"` 允许跨域响应头

```js
var http = require("http")
var url = require("url")

http.createServer((req, res) => {
    var urlobj = url.parse(req.url, true)
    // console.log(urlobj.query.callback);
    res.writeHead(200, {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*"  // 允许跨域响应头（大小写不敏感）
    })
    switch (urlobj.pathname) {
        case "/api/aaa":
            res.end(`${JSON.stringify({
                name: 'jerry',
                age: 20
            })}`)
            break;
        default:
            res.end("404")
    }
}).listen(3000)
```

index.html

```html
<body>
    <script>
        fetch("http://127.0.0.1:3000/api/aaa")
            .then(res => res.json())
            .then(res => {
                console.log(res);
            })
    </script>
</body>
```



#### 2.1.4 模拟 get

node 模拟客户端，请求到跨域的数据，返回给自己的前端页面。

* `httpGet(() => {...})`  回调函数方式，解耦 res 的处理逻辑

```js
var http = require("http")
var https = require("https")
var url = require("url")

http.createServer((req, res) => {
    var urlobj = url.parse(req.url, true)
    res.writeHead(200, {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*"  // 允许跨域响应头
    })
    switch (urlobj.pathname) {
        case "/api/aaa":
            // node 扮演客户端去 猫眼 接口取数据
            httpGet((data) => {       // callback 回调函数方式 - res 解耦
                res.end(data)
            })
            break;
        default:
            res.end("404")
    }
}).listen(3000)

function httpGet(callback) {
    var data = ""
    // eg: 猫眼的接口数据 get 请求
    https.get("https://m.maoyan.com/ajax/comingList?ci=73&token=&limit=10&optimus_uuid=AC61DF20F05F11F09A8AD317E4C1BC3675378D79B8704B99A3C79EF2542CC2D4&optimus_risk_level=71&optimus_code=10",
        (res) => {
            res.on("data", (chunk) => {
                data += chunk
            })

            res.on("end", () => {
                //console.log(data)
                callback(data) //把数据拿到后，给前端响应出去
            })
        }
    )
}
```

index.html

```html
<body>
    <script>
        /* 请求自己的 node 服务（node 服务中通过 https 请求猫眼的跨域 api 数据） */
        fetch("http://127.0.0.1:3000/api/aaa")
            .then(res => res.json())
            .then(res => {
                console.log(res);
            })
    </script>
</body
```



#### 2.1.5 模拟 post

node 模拟客户端，请求 post 数据，返回给自己的前端页面。

```js
var http = require("http")
var https = require("https")
var url = require("url")

http.createServer((req, res) => {
    var urlobj = url.parse(req.url, true)
    res.writeHead(200, {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*"  // 允许跨域响应头
    })
    switch (urlobj.pathname) {
        case "/api/aaa":
            // node 扮演客户端去 小米优品 接口取数据
            httpPost((data) => {       // callback 回调函数方式 - res 解耦
                res.end(data)
            })
            break;
        default:
            res.end("404")
    }
}).listen(3000)

function httpPost(callback) {
    var data = ""
    var options = {
        hostname: "m.xiaomiyoupin.com",
        post: "443",
        path: "/mtop/market/search/placeHolder",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
            // "Content-Type": "x-www-form-urlencode"
        }
    }
    var req = https.request(options, (res) => {
        res.on("data", chunk => {
            data += chunk
        })
        res.on("end", () => {
            callback(data)
        })
    })
    // req.write("name=jerry&age=20")
    req.write(JSON.stringify([{}, { "baseParam": { "ypClient": 1 } }]))
    req.end()
}
```

index.html

```html
<body>
    <script>
        /* 请求自己的 node 服务（node 服务中通过 https 请求猫眼的跨域 api 数据） */
        fetch("http://127.0.0.1:3000/api/aaa")
            .then(res => res.json())
            .then(res => {
                console.log(res);
            })
    </script>
</body>
```



#### 2.1.6 爬虫 cheerio

安装第三方模块：

*npm init*

*npm i cheerio@1.0.0-rc.12*    - (兼容性: node18 与 cheerio1.0.0-rc.12 兼容，否则 require 报错)

* cheerio 可以让解析 dom 像类似 jquery 一样。

```js
var http = require("http")
var https = require("https")
var url = require("url")
var cheerio = require("cheerio")

http.createServer((req, res) => {
    var urlobj = url.parse(req.url, true)
    res.writeHead(200, {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*"  // 允许跨域响应头
    })
    switch (urlobj.pathname) {
        case "/api/aaa":
            // node 扮演客户端去 猫眼 接口取数据
            httpGet((data) => {       // callback 回调函数方式 - res 解耦
                res.end(spider(data))
            })
            break;
        default:
            res.end("404")
    }
}).listen(3000)

function httpGet(callback) {
    var data = ""
    https.get("https://m.maoyan.com",
        (res) => {
            res.on("data", (chunk) => {
                data += chunk
            })

            res.on("end", () => {
                //console.log(data)
                callback(data) //把数据拿到后，给前端响应出去
            })
        }
    )
}

// 函数：爬虫，主要解析 html 页面结构
function spider(data) {
    // cheerio 第三方模块，需要安装。像操作 dom 一样使用
    let $ = cheerio.load(data)
    let $moviewlist = $(".column.content")  // css class 选择器
    // console.log($moviewlist);
    let movies = []
    $moviewlist.each((index, value) => {
        movies.push({
            title: $(value).find(".title").text(),
            grade: $(value).find(".grade").text(),
            actor: $(value).find(".actor").text(),
        })
    })
    console.log(movies);
    return JSON.stringify(movies)
}
```





### 2.2 url 解析模块

CJS `const url = require('url');`  ESM `import url from 'url';`

#### 旧版: 废弃-也可用

2.2.1 parse()

解析 url 为不同的参数。

```js
const url = require('url')

const urlString = 'https://www.baidu.com:443/ad/index.html?id=8&name=mouse#tag=110'
// const parsedRes = url.parse(urlString)
const parsedRes = url.parse(urlString, true) //true 会转为json对象，就可以直接 . 访问参数
console.log(parsedRes)             //Url {...}
console.log(parsedRes.pathname);   ///ad/index.html
console.log(parsedRes.hash);       //#tag=110
console.log(parsedRes.query);      //[Object: null prototype] { id: '8', name: 'mouse' }
console.log(parsedRes.query.name); //mouse
```



2.2.2 format()

与 parse() 相反，给到参数，反解析为完整的 url 路径。

```js
const url = require('url')

const urlObject = {
  protocol: 'https:',
  slashes: true,
  auth: null,
  host: 'www.baidu.com:443',
  port: '443',
  hostname: 'www.baidu.com',
  hash: '#tag=110',
  search: '?id=8&name=mouse',
  query: { id: '8', name: 'mouse' },
  pathname: '/ad/index.html',
  path: '/ad/index.html?id=8&name=mouse'
}
const parsedObj = url.format(urlObject)
console.log(parsedObj) //https://www.baidu.com:443/ad/index.html?id=8&name=mouse#tag=110
```



2.2.3 resolve()

对 url 的拼接与替换。

```js
const url = require('url')

var a1 = url.resolve('/one/two/three', 'four')       //注意最后加 / ，不加 / 的区别
var a2 = url.resolve('/one/two/three/', 'four')       //注意最后加 / ，不加 / 的区别
var b = url.resolve('http://example.com/', '/one')
var c = url.resolve('http://example.com/one', '/two')
console.log("a1 -> ", a1); // /one/two/four
console.log("a2 -> ", a2); // /one/two/three/four
console.log("b -> ", b);   // http://example.com/one
console.log("c -> ", c);   // http://example.com/two
```



#### 新版: new URL()

参考官方文档说明：https://nodejs.cn/api/v18/url.html#new-urlinput-base

代替 parse()

```js
//urlString 也可以是 http 服务器的 req.url 相对路径
const urlString = 'https://www.baidu.com:443/ad/index.html?id=8&name=mouse#tag=110'
const myURL = new URL(urlString, 'https://www.baidu.com')
console.log("myURL->", myURL);
console.log(myURL.pathname); //  /ad/index.html
const params = myURL.searchParams
for (const [key, value] of params) {
    console.log(key + ',' + value); // id,8  name,mouse
}
```

代替 resolve()

```js
const url = require('url')

// 替代 resolve
const url2 = new URL('/home', 'http://127.0.0.1:3000')
console.log(url2.href); // http://127.0.0.1:3000/home
```

新版 format()

```js
const url = require('url')

const myURL = new URL('https://a:b@測試?abc#foo');
console.log(myURL.href); // https://a:b@xn--g6w251d/?abc#foo
console.log(myURL.toString()); // https://a:b@xn--g6w251d/?abc#foo
console.log(url.format(myURL, { fragment: false, unicode: true, auth: false })); // 'https://測試/?abc'
```



### 2.4 querystring 查询字符串

CJS `const querystring = require('querystring');`  ESM `import querystring from 'querystring';`

parse() - 解析路径参数

```js
const str = "name=jerry&age=20&location=china"
var obj = querystring.parse(str)
console.log(obj); //{name: 'jerry', age: '20', location: 'china'}
console.log(obj.name, obj.age, obj.location); //jerry 20 china
```

stringify() - 将对象转为路径参数

```js
var myobj = { name: 'jerry', age: '20', location: 'china' }
var mystr = querystring.stringify(myobj)
console.log(mystr); //name=jerry&age=20&location=china
```

escape() - 针对网址查询字符串的特定要求优化的方式对给定的 `str` 执行网址百分比编码。

```js
var str1 = 'id=3&city=北京&url=https://www.baidu.com'
var escaped = querystring.escape(str1)
console.log(escaped)  //id%3D3%26city%3D%E5%8C%97%E4%BA%AC%26url%3Dhttps%3A%2F%2Fwww.baidu.com
```

unescape() - 当将网址不安全的字符转换为查询字符串中的百分比编码时使用的函数。

```js
var str2 = 'id%3D3%26city%3D%E5%8C%97%E4%BA%AC%26url%3Dhttps%3A%2F%2Fwww.baidu.com'
var unescaped = querystring.unescape(str2)
console.log(unescaped) //id=3&city=北京&url=https://www.baidu.com
```



### 2.5 event 事件模块

CJS `const EventEmitter = require('events');`  ESM `import { EventEmitter } from 'events';`

```js
const EventEmitter = require("events")
const event = new EventEmitter()

event.on("play", () => {
    console.log("事件触发了");
})

// 立即触发
event.emit("play")
// 2s后触发
setTimeout(() => {
    event.emit("play", "123456")
}, 2000)
```

应用示例：

get.js

```js
var http = require("http")
var https = require("https")
const { EventEmitter } = require("stream")
var url = require("url")
var event = null

http.createServer((req, res) => {
    var urlobj = url.parse(req.url, true)
    res.writeHead(200, {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*"  // 允许跨域响应头
    })
    switch (urlobj.pathname) {
        case "/api/aaa":
            // node 扮演客户端去 猫眼 接口取数据
            event = new EventEmitter() //不能放在外部作用域，否则会被重复触发多次事件
            event.on("play", (data) => {       // callback 回调函数方式 - res 解耦
                res.end(data)
            })
            httpGet()
            break;
        default:
            res.end("404")
    }
}).listen(3000)

function httpGet() {
    var data = ""
    https.get("https://m.maoyan.com/ajax/comingList?ci=73&token=&limit=10&optimus_uuid=AC61DF20F05F11F09A8AD317E4C1BC3675378D79B8704B99A3C79EF2542CC2D4&optimus_risk_level=71&optimus_code=10",
        (res) => {
            res.on("data", (chunk) => {
                data += chunk
            })

            res.on("end", () => {
                //console.log(data)
                event.emit("play", data) //把数据拿到后，给前端响应出去
            })
        }
    )
}
```



### 2.5 fs 文件操作模块

#### 2.5.1 文件基本操作

CJS `const fs = require('fs');`  ESM `import * as fs from 'fs';`

```js
// 创建目录
fs.mkdir("./avatar", (err) => {
    // console.log(err);
    if (err && err.code === "EEXIST") {
        console.log("目录已存在");
    }
})
```

```js
// 重命名
fs.rename("./avatar", "./avatar2", (err) => {
    // console.log(err);
    if (err && err.code === "ENOENT") {
        console.log("要重命名的目录不存在！");
    }
})
```

```js
// 删除目录
fs.rmdir("./avatar", (err) => {
    console.log(err);
    if (err && err.code === "ENOENT") {
        console.log("要删除目录不存在！");
    }
    if (err && err.code === "ENOTEMPTY") {
        console.log("要删除目录不为空！");
    }
})
```

```js
// 会覆盖文件内容
fs.writeFile("./avatar/a.txt", "你好", (err) => {
    console.log(err); //null 成功
    if (!err) {
        console.log("覆盖写入成功");
    }
})
```

```js
// 追加文件内容
fs.appendFile("./avatar/a.txt", "\nhello,node", (err) => {
    console.log(err); //null 成功
    if (!err) {
        console.log("追加写入成功");
    }
})
```

```js
// 读取文件，按照utf-8编码方式（err first风格，错误优先）
fs.readFile("./avatar/a.txt", "utf-8", (err, data) => {
    if (!err) {
        console.log(data);
    }
})
```

```js
// 文件删除
fs.unlink("./avatar/a.txt", (err) => {
    console.log(err);
    if (!err) {
        console.log("文件删除成功！");
    }
})
```

```js
// 读取目录下的文件列表，返回是数组
fs.readdir("./avatar", (err, data) => {
    if (!err) {
        console.log(data); //[ 'a.txt', 'b.vue' ]
    }
})
```

```js
// 文件属性信息
fs.stat("./avatar", (err, data) => {
    console.log(data);
    console.log(data.isFile()); //false
    console.log(data.isDirectory()); //true
})
```

#### 2.5.2 文件删除健壮版

```js
const fs = require("fs").promises  //使用Promise方式

let path = "./avatar"
// try {
//     fs.mkdir(path).then(data => {
//         console.log(data);
//     })
// } catch (error) {
//     console.log("catch:", error);
// }

// fs.readFile("./avatar/a.txt", "utf-8").then(data => {
//     console.log(data);
// })
```

```js
// 健壮的删除目录（先删除目录下的文件），且需要同步删除
fs.readdir(path).then(async data => {
    await Promise.all(data.map(item => fs.unlink(`${path}/${item}`)))
    await fs.rmdir("./avatar")
})
```

### 2.6 stream 流模块

可以从文件中用流的方式读取和写入，以及复制文件，核心方法 `fs.createReadStream`,  `fs.createWriteStream`,  `rs.pipe(ws)`

```js
const fs = require("fs")
// 可读流
const rs = fs.createReadStream("./1.txt", "utf-8")
rs.on("data", (chunk) => {
    console.log("chunk:", chunk);
})
rs.on("end", () => {
    console.log("end");
})
rs.on("error", () => {
    console.log("error");
})
```

```js
const fs = require("fs")
// 可写流
const ws = fs.createWriteStream("./2.txt", "utf-8")
ws.write("aaaaaaaaaaaa\n")
ws.write("bbbbbbbbb\n")
ws.write("ccccccccccc")
ws.end()
```

```js
const fs = require("fs")
// 高性能的复制文件的方法 pipe 管道
const rs = fs.createReadStream("./1.txt")
const ws = fs.createWriteStream("./2.txt")
rs.pipe(ws)
```



### 2.7 zlib 压缩模块

CJS `const zlib = require('zlib'); `  ESM `import zlib from 'zlib';`

```js
const fs = require("fs")
const http = require("http")
const zlib = require("zlib")
// gzip压缩，可以让文件传输流传输变小，减少流量消耗
const gzip = zlib.createGzip()
http.createServer((req, res) => {
    const rs = fs.createReadStream("./index.js")
    res.writeHead(200, {
        "content-type": "application/x-javascript;charset=utf-8",
        "content-encoding": "gzip"
    })
    rs.pipe(gzip).pipe(res)
}).listen(3000, () => {
    console.log("server start");
})
```

![image-20260113192631287](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260113192632820.png)



### 2.8 crypto 加密模块

CJS `const crypto = require('crypto'); `  ESM `import crypto from 'crypto';`

crypto 目的为了提供通用的加密和哈希算法。

#### MD5

MD5是一种常用的哈希算法，用于给任意数据一个签名，这个签名通常用一个十六进制的字符串表示。（简单密码可以，重要密码`有一定撞库风险`）

```js
const hash = crypto.createHash("md5")
hash.update("123456")
// 存储方式：hex-16进制。
console.log(hash.digest("hex")); //e10adc3949ba59abbe56e057f20f883e
```



#### SHA1

Hmac算法也是一种哈希算法，可以利用MD5或SHA1等哈希算法，不同的是，Hmac还需要一个密钥串。

```js
//基于 md5 或 sha1 或 sha256, 第二个参数是密钥串
const hash = crypto.createHmac("sha256", "jerry")
hash.update("123456")
// 存储方式：hex-16进制。
console.log(hash.digest("hex")); //bf222067d4890271557a4d8b60248aba3e9e01f1a29b7d37ae5bcdf842aca1a2
```



#### AES-对称加密

对称加密算法，加解密都用同一个密钥。

```js
// 加密方法：key-16个字符, iv-16个字符, data-需要加密的数据
function encrypt(key, iv, data) {
    let decipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    return decipher.update(data, 'binary', 'hex') + decipher.final('hex');
}

// 解密方法：key-16个字符, iv-16个字符, crypted-需要解密的密文串
function decrypt(key, iv, crypted) {
    crypted = Buffer.from(crypted, 'hex').toString('binary');
    let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    return decipher.update(crypted, 'binary', 'utf8') + decipher.final('utf8');
}
```

验证：

```js
let key = "abcdef1234567890" //必须是16个字节，因为 16字节*8位=128，对应 aes-128-cbc 中的 128 位
let iv = "1234567890abcdef"  //必须是16个字节，因为 16字节*8位=128，对应 aes-128-cbc 中的 128 位
let data = "jerry123456"     //我的密码
let dataEncrypt = encrypt(key, iv, data)
console.log("加密结果：", dataEncrypt); //f27e150f042b0279913459f5fdbcc803
let dataSource = decrypt(key, iv, dataEncrypt)
console.log("解密结果：", dataSource);  //jerry123456
```

















