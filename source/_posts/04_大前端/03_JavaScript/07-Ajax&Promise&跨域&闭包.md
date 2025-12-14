---
title: 07-Ajax&Promise&跨域&闭包
date: 2018-5-7 15:21:05
tags:
- Ajax
- 跨域
- 闭包
categories: 
- 04_大前端
- 03_JavaScript
---

![image-20251212091516356](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251212091527.png)

参考资料：

* 永不收费开放api(感谢大神无私奉献)：https://api.aa1.cn/
* 今日热榜api：https://api.aa1.cn/doc/dailyhot.html



## 1. Ajax

### 1.1 背景：局部更新

`Ajax`（Async Javascript And Xml），`异步HTTP请求`，客户端给服务器发送消息的工具，以及接收响应的工具，默认`异步`执行的功能。

**优势**：

1. 不需要插件的支持，原生js就可以使用
2. 用户体验号（不需要刷新页面就可以更新数据）
3. 减轻服务和带宽的负担

**缺点**：

1. 搜索引擎的支持度不够（即SEO不友好），因为数据都不在页面上，搜索引擎搜索不到

AJAX 仅仅组合了：

- 浏览器内建的 XMLHttpRequest 对象（从 web 服务器请求数据）
- JavaScript 和 HTML DOM（显示或使用数据）

![image-20251212093008815](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251212093010.png)



XMLHttpRequest 对象的三个重要的属性：

| 属性               | 描述                                                         |
| :----------------- | :----------------------------------------------------------- |
| onreadystatechange | 存储函数（或函数名），每当 readyState 属性改变时，就会调用该函数。 |
| readyState         | 存有 XMLHttpRequest 的状态。从 0 到 4 发生变化。<br />`0`: 请求未初始化，也就是open方法还没有执行<br />`1`: 服务器连接已建立，即配置信息已经完成，也就是执行完open之后<br />`2`: 请求已接收，表示send方法已经执行完成<br />`3`: 请求处理中，表示正在解析响应内容<br />`4`: 请求已完成，且响应已就绪，表示可以在客户端使用数据了 |
| status             | 200: "OK" <br />404: 未找到页面                              |

在 onreadystatechange 事件中，我们规定当服务器响应已做好被处理的准备时所执行的任务。

当 readyState 等于 4 且状态为 200 时，表示响应已就绪。

### 1.2 ajax语法

步骤：

1. `let xhr = new XMLHttpRequest()`  创建XHR请求对象
2. `xhr.open(请求方式, 请求地址[, 是否异步])` 配置
3. `xhr.send()` 发送请求
4. `xhr.onreadystatechange = function() {... 4 && 200 ...}` 接收响应，注册一个事件
   - 或 `xhr.onload = function() {...200...}` onload默认readyState就是4，可以省略判断
   - `/^2\d{2}$/.test(xhr.status)` 判断 200-299 都是成功的 HTTP 状态码

示例：

> ![image-20251212104546805](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251212104548.png)
>
> 请求地址：http://localhost:5500/ajax/1.json
>
> 可以预先模拟后端响应的数据结构，因此可以将前端页面渲染工作前置。

```js
    <script>
        // 1.创建XHR：new XMLHttpRequest()
        let xhr = new XMLHttpRequest()
        // 2.配置：open(请求方式, 请求地址[, 是否异步]) - 1.json 模拟服务器数据
        xhr.open("GET", "http://localhost:5500/ajax/1.json")
        // 3.发送请求：send
        xhr.send()
        // 4.接收响应，注册一个事件
        xhr.onreadystatechange = function() {
            // console.log(xhr.readyState, xhr.status)
            // 4-请求完成且响应就绪，200-请求OK
            // xhr.status：http状态码 200-299都是OK，可用正则替换
            // if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let res = JSON.parse(xhr.responseText)
                console.log("数据解析完成: ", res)
                document.write(res.name)
            } else if (xhr.readyState === 4 && xhr.status === 404) {
                console.error("没有找到这个页面")
                location.href = "404.html"
            }
        }

        // 特殊：onload 只会在 readyState === 4 的时候执行
        xhr.onload = function() {
            // console.log(xhr.readyState)
            if (xhr.status === 200) {
                let res = JSON.parse(xhr.responseText)
                console.log("数据解析完成: ", res)
                document.write(res.name)
            } else if (xhr.status === 404) {
                console.error("没有找到这个页面")
                // location.href = "404.html"
            }
        }
    </script>
```



### 案例：ajax请求百度热榜

url地址：

```
https://api.pearktrue.cn/api/dailyhot/?title=百度
```

示例：

```html
    <button id="btn">获取数据</button>
    <ul id="myList"></ul>
    <script>
        // url:https://api.pearktrue.cn/api/dailyhot/?title=百度
        btn.onclick = function () {
            let xhr = new XMLHttpRequest()
            xhr.open("GET", "https://api.pearktrue.cn/api/dailyhot/?title=百度")
            xhr.send()
            xhr.onload = function () {
                if (xhr.status === 200) {
                    //console.log(xhr.responseText)
                    let jsonData = JSON.parse(xhr.responseText)
                    //渲染页面
                    render(jsonData)
                }
            }
        }

        function render(jsonData) {
            //取前10条
            let data = jsonData.data.slice(0, 10)
            console.log(data)
            let html = data.map(item => `
                <li>
                    <div>${item.title}</div>
                    <img src="${item.cover}" style="width:200px; height:100px"/>
                </li>
            `).join("")
            myList.innerHTML = html
        }
    </script>
```

效果：

![chrome-capture-2025-12-12](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251212104825.gif)



### 1.3 ajax异步和同步

`xhr.open(请求方式, 请求地址[, 是否异步])` 配置

* 第三个参数是否异步：`true`-异步（*默认*）, `false`-同步

注意：如果是同步时，需要在send前就要给 onload 绑定事件，否则send都响应结束了才绑定事件就晚了。

示例：

```js
    <script>
        let xhr = new XMLHttpRequest()
        // open第三个参数：true-异步(默认), false-同步
        xhr.open("GET", "http://127.0.0.1:5500/05_ajax/1.json", false)
        // 如果是同步时，需要在send前就要给 onload 绑定事件，否则绑定事件就晚了不会打印
        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log(xhr.responseText)
            }
        }
        xhr.send()
        console.log("11111111111")
    </script>
```



### 1.4 请求方式

* `GET`，明文传输，参数体现在URL上，有长度限制（太长会被截断）2KB
* `POST`，请求体中传输，足够安全，请求体数据量可以比较大

Ajax下：

* GET，偏向于获取
* POST，偏向于提交
* PUT，偏向于更新（全部）       - PATCH，偏向于更新（部分）
* DELETE，偏向于删除

### 准备：nodejs安装

> nodejs 准备
>
> * json-server，基于一个json文件就可以创建很多的后端模拟接口。
>
> 下载：https://nodejs.cn/download/
>
> 当前使用版本 [v16.15.1 下载 .msi](https://registry.npmmirror.com/-/binary/node/latest-v16.x/node-v16.15.1-x64.msi)
>
> 当前电脑已安装版本（VSCode中 `Alt + F12` 打开终端）：
>
> ![image-20251212111659796](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251212111701.png)
>
> 使用 npm 安装 json-server (-g 全局安装)：
>
> ```powershell
> npm install json-server -g
> json-server --version
> ```
>
> ![image-20251212111735388](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251212111736.png)
>
> 此时使用命令 `json-server --version` 如果报错的话，则需要修改一下windows本机的脚本执行策略（允许执行脚本命令）
>
> ```powershell
> Get-ExecutionPolicy                //查看当前执行策略
> Set-ExecutionPolicy RemoteSigned   //修改执行策略
> ```
>
> ![image-20251212112108851](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251212112110.png)
>
> 再次验证（已OK）：
>
> ![image-20251212112215485](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251212112216.png)



准备一个 test.json 在当前代码路径下，打开终端监听 test.json（即启动好了后端）：

test.json

```json
{
    "users": [
        {
            "id": 1,
            "username": "jerry",
            "password": 123456
        },
        {
            "id": 2,
            "username": "tom",
            "password": 123456
        }
    ],
    "list": [
        { "id": 1, "value": "111" },
        { "id": 2, "value": "222" },
        { "id": 3, "value": "333" }
    ]
}
```

```powershell
json-server .\test.json --watch
```

![image-20251212112718710](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251212112719.png)

浏览器查看：

![image-20251212112814447](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251212112815.png)

浏览器查看api接口：

![image-20251212112835004](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251212112835.png)



### 验证请求方式

> 预览使用插件 Preview on Web Server 可以`让 POST 请求不会去刷新页面`。
>
> 该插件的默认预览页面接口是 8080，通过快捷键进行启停。
>
> 快捷键改为了：
>
> * Ctrl + Alt + Shift + **R** 启动服务
> * Ctrl + Alt + Shift + **L** 预览页面
> * Ctrl + Alt + Shift + **S** 停止服务

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <button id="myGet">GET</button>
    <button id="myPost">POST</button>
    <button id="myPut">PUT</button>
    <button id="myPatch">PATCH</button>
    <button id="myDelete">DELETE</button>

    <script>
        // GET
        myGet.onclick = function () {
            let xhr = new XMLHttpRequest()
            // xhr.open("GET", "http://localhost:3000/users")
            // GET 传参使用: ? & 
            xhr.open("GET", "http://localhost:3000/users?username=lucy&password=1234")
            xhr.onload = function () {
                if (xhr.status === 200) {
                    console.log(JSON.parse(xhr.responseText))
                }
            }
            xhr.send()
        }
        // POST
        myPost.onclick = function () {
            let xhr = new XMLHttpRequest()
            xhr.open("POST", "http://localhost:3000/users")
            xhr.onload = function () {
                // post 此时返回状态码是 201
                if (/^2\d{2|$/.test(xhr.status)) {
                    console.log(JSON.parse(xhr.responseText))
                }
            }
            // send 参数可以提交信息：① name=xxx&age=18  ② {"name":"xxx", "age":18}
            // 需要设置传输的内容类型-form表单类型: application/x-www-form-urlencoded
            // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
            // xhr.send(`username=lucy&password=1234`)
            // 需要设置传输的内容类型-form表单类型: application/json
            xhr.setRequestHeader("Content-Type", "application/json")
            xhr.send(JSON.stringify({
                username: "lucy",
                password: 1234
            }))
        }
        // PUT-全部修改
        myPut.onclick = function () {
            let xhr = new XMLHttpRequest()
            // url中需要传id
            xhr.open("PUT", "http://localhost:3000/users/1")
            xhr.onload = function () {
                //  
                if (/^2\d{2|$/.test(xhr.status)) {
                    console.log(JSON.parse(xhr.responseText))
                }
            }
            xhr.setRequestHeader("Content-Type", "application/json")
            xhr.send(JSON.stringify({
                username: "liLi",
            }))
        }
        // PATCH-部分修改
        myPatch.onclick = function () {
            let xhr = new XMLHttpRequest()
            // url中需要传id
            xhr.open("PATCH", "http://localhost:3000/users/2")
            xhr.onload = function () {
                //  
                if (/^2\d{2|$/.test(xhr.status)) {
                    console.log(JSON.parse(xhr.responseText))
                }
            }
            xhr.setRequestHeader("Content-Type", "application/json")
            xhr.send(JSON.stringify({
                username: "john",
            }))
        }
        // DELETE
        myDelete.onclick = function () {
            let xhr = new XMLHttpRequest()
            // url中需要传id
            xhr.open("DELETE", "http://localhost:3000/users/4810")
            xhr.onload = function () {
                //  
                if (/^2\d{2|$/.test(xhr.status)) {
                    console.log(JSON.parse(xhr.responseText))
                }
            }
            xhr.send()
        }
    </script>
</body>

</html>
```



### 1.5 ajax封装 util.js

util.js

```js
function queryStringify(obj) {
  let str = ''
  for (let k in obj) str += `${k}=${obj[k]}&`
  return str.slice(0, -1)
}

// 封装 ajax
function ajax(options) {
  let defaultoptions = {
    url: "",
    method: "GET",
    async: true,
    data: {},
    headers: {},
    success: function () { },
    error: function () { }
  }
  let { url, method, async, data, headers, success, error } = {
    ...defaultoptions,
    ...options
  }

  if (typeof data === 'object' && headers["content-type"]?.indexOf("json") > -1) {
    data = JSON.stringify(data)
  }
  else {
    data = queryStringify(data)

  }
  // 如果是 get 请求, 并且有参数, 那么直接组装一下 url 信息
  if (/^get$/i.test(method) && data) url += '?' + data

  // 4. 发送请求
  const xhr = new XMLHttpRequest()
  xhr.open(method, url, async)
  xhr.onload = function () {
    if (!/^2\d{2}$/.test(xhr.status)) {
      error(`错误状态码:${xhr.status}`)
      return 
    }
    // 执行解析
    try {
      let result = JSON.parse(xhr.responseText)
      success(result)
    } catch (err) {
      error('解析失败 ! 因为后端返回的结果不是 json 格式字符串')
    }
  }

  // 设置请求头内的信息
  for (let k in headers) xhr.setRequestHeader(k, headers[k])
  if (/^get$/i.test(method)) {
    xhr.send()
  } else {
    xhr.send(data)
  }
}
```

```js
// 调用示例
ajax({
    url: "http://localhost:3000/users",
    method: "GET",
    async: true,
    data: {
        username: "jerry",
        password: "123"
    },
    headers: {},
    success: function (res) {
        console.log(res)
    },
    error: function (err) {
        console.log(err)
    }
})
```

验证ajax封装 util.js

```html
    <button id="testGet">GET</button>
    <button id="testPost">POST</button>
    <script src="./util.js"></script>
    <script>
        // GET 请求（默认）
        testGet.onclick = function () {
            ajax({
                url: "http://localhost:3000/users",
                success: function (res) {
                    console.log("success", res)
                },
                error: function (err) {
                    console.log("error", err)
                }
            })
        }

        // POST 请求
        testPost.onclick = function () {
            ajax({
                url: "http://localhost:3000/users",
                method: "POST",
                data: {
                    username: "aaa",
                    password: "123321"
                },
                headers: {
                    "content-type": "application/json"
                },
                success: function (res) {
                    console.log("success", res)
                },
                error: function (err) {
                    console.log("error", err)
                }
            })
        }
    </script>
```



### 案例：模拟待办事项

使用 ajax封装+面向对象+json-server 功能。`特别注意：同时移除li列表数据中指定的元素 的位置`

test.json （使用nodejs的 json-server 进行启动：`json-server .\test.json --watch` ）

```json
{
  "list": [
    {
      "text": "aaa",
      "id": "1"
    },
    {
      "id": "2",
      "text": "bbb"
    }
  ]
}
```

index.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <input type="text" name="" id="mytext">
    <button id="myadd">添加</button>
    <ul class="list"></ul>

    <script type="module">
        import { ajax, pajax } from './util.js'
        // console.log(ajax)

        class TodoList {
            constructor(select) {
                this.listEle = document.querySelector(select)
                this.listData = []     // li列表数据

                this.init()
            }
            init() {
                // 绑定事件
                this.bindEvent()
                // 获取数据
                this.getList().then((res) => {
                    this.listData = res
                    this.render()
                }).catch((err) => {
                    console.error(err)
                })
            }

            // 绑定事件
            bindEvent() {
                this.listEle.onclick = (evt) => {
                    // console.log(evt.target)    // <button>删除</button>
                    if (evt.target.nodeName === "BUTTON") {
                        this.removeItem(evt.target)
                    }
                }
            }

            // 获取数据
            getList() {
                return pajax({
                    url: "http://localhost:3000/list",
                })
            }

            // 渲染页面
            render() {
                // console.log("render")
                this.listEle.innerHTML = this.listData.map(item => `
                    <li>
                        ${item.text}
                        <button data-index=${item.id}>删除</button>
                    </li>
                `).join("")
            }

            addItem(text) {
                // console.log(text)
                if (!text) {
                    alert("你还未填写内容！")
                    return
                }
                // 先在数据库添加成功的回调里，才能在页面进行添加
                pajax({
                    url: "http://localhost:3000/list",
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    data: {
                        text
                    }
                }).then((res) => {
                    console.log("成功", res)
                    this.listData = [...this.listData, res]
                    this.render()
                })
            }

            removeItem(target) {
                // button按钮的 parentNode 就是 li
                target.parentNode.remove()

                // 删除任务
                pajax({
                    url: `http://localhost:3000/list/${target.dataset.index}`,
                    method: "DELETE"
                }).then((res) => {
                    console.log("删除成功", res)
                    // 同时移除li列表数据中指定的元素
                    let idx = this.listData.findIndex((item) => item.id === target.dataset.index)
                    this.listData.splice(idx, 1)
                })
            }

            updateItem() {

            }
        }

        let obj = new TodoList(".list")
        console.log(obj)

        myadd.onclick = function () {
            // console.log(mytext.value)
            obj.addItem(mytext.value)
        }

        console.log("显示加载中...")
        let q1 = pajax({
            url: "http://localhost:3000/looplist"
        })
        let q2 = pajax({
            url: "http://localhost:3000/datalist"
        })
        //等待两个promise对象都兑现承诺resolve
        Promise.all([q1, q2]).then(res => {
            console.log(res)
            console.log("隐藏加载中...")
        }).catch(err => {
            console.error(err)
        })
    </script>
</body>

</html>
```

效果：

![chrome-capture-2025-12-12](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251212181349.gif)



## 2. Promise

### 2.1 背景：回调地狱

回调函数过多嵌套会导致 回调地狱，难以维护，一旦出错层层error。

示例：

```js
ajax({    // 第一个请求
    url: "http://localhost:3000/",
    success: (res) => {
        console.log(res)
        ajax({    // 第二个请求：依赖第一个请求成功 和 返回的数据
            url: "http://localhost:3000/",
            success: (res) => {
                console.log(res)
                ajax({    // 第三个请求：依赖第二个请求成功 和 返回的数据
                    url: "http://localhost:3000/",
                    success: (res) => {
                        console.log(res)
                    }
                })
            }
        })
    }
})
```



### 2.2 Promise语法

`Promise` 是一个语法，执行时都会有三个状态：

* pending，执行中
* fulfilled，`成功 - resolve() >> .then()`
* reject，`失败 - reject() >> .catch()`

```js
new Promise(function(resolve, reject) {
    //resolve() 表示成功的回调
    //reject()  表示失败的回调
}).then(function() {
    //成功的函数
}).catch(function() {
    //失败的函数
})
```

> .then() 方法可以嵌套多个，直到兑现承诺Promise。



### 2.3 Promise版封装ajax

封装新增的核心代码：

```js
// promise ajax
function pajax(options) {
    return new Promise((resolve, reject) => {
        ajax({
            ...options,
            success(res) {
                resolve(res)
            },
            error(err) {
                reject(err)
            }
        })
    })
}
```

基于封装后的使用：

```js
<script src="./util.js"></script>
<script>
    pajax({
        url: "http://localhost:3000/news",
        data: {
            name: "jerry"
        }
    }).then(res => {         // .then 可以嵌套多个，但是需要 return Promise 对象出去
        return pajax({
            url: "http://localhost:3000/news",
            data: {
                name: "tom"
            }
        })
    }).then(res => {          // 此时的 res 是上个顺序的 .then 返回的内容 return 过来的
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
</script>
```



util.js - 基于 ajax封装 再次封装  promise

```js
function queryStringify(obj) {
    let str = ''
    for (let k in obj) str += `${k}=${obj[k]}&`
    return str.slice(0, -1)
}

// 封装 ajax
function ajax(options) {
    let defaultoptions = {
        url: "",
        method: "GET",
        async: true,
        data: {},
        headers: {},
        success: function () { },
        error: function () { }
    }
    let { url, method, async, data, headers, success, error } = {
        ...defaultoptions,
        ...options
    }

    // ? 的作用：表示如果 ? 前面为假，就不去 . 操作，如 .indexOf()
    if (typeof data === 'object' && headers["content-type"]?.indexOf("json") > -1) {
        data = JSON.stringify(data)
    } else {
        data = queryStringify(data)

    }
    // 如果是 get 请求, 并且有参数, 那么直接组装一下 url 信息
    if (/^get$/i.test(method) && data) url += '?' + data

    // 4. 发送请求
    const xhr = new XMLHttpRequest()
    xhr.open(method, url, async)
    xhr.onload = function () {
        // 非 200-299 的HTTP状态码均返回error
        if (!/^2\d{2}$/.test(xhr.status)) {
            error(`错误状态码:${xhr.status}`)  // 回调
            return
        }
        // 执行解析
        try {
            let result = JSON.parse(xhr.responseText)
            success(result)
        } catch (err) {
            error('解析失败 ! 因为后端返回的结果不是 json 格式字符串')
        }
    }

    // 设置请求头内的信息
    for (let k in headers) xhr.setRequestHeader(k, headers[k])
    if (/^get$/i.test(method)) {
        xhr.send()
    } else {
        xhr.send(data)
    }
}


// promise ajax
function pajax(options) {
    return new Promise((resolve, reject) => {
        ajax({
            ...options,
            success(res) {
                resolve(res)
            },
            error(err) {
                reject(err)
            }
        })
    })
}
```



### 2.4 Promise.all()聚合承诺

`Promise.all([])` 可以同时执行**多个** Promise，并且等它们**全部成功**后才返回结果。如果其中有一个失败，整个 Promise.all() 就会立刻 reject。

* 适用于并行任务，但不适合有依赖关系的任务。

示例：

```js
console.log("显示加载中...")
let q1 = pajax({
    url: "http://localhost:3000/looplist"
})
let q2 = pajax({
    url: "http://localhost:3000/datalist"
})
//等待两个promise对象都兑现承诺resolve，任一失败就立刻reject
Promise.all([q1, q2]).then(res => {
    console.log(res)
    console.log("隐藏加载中...")
}).catch(err => {
    console.error(err)
})
```

效果：

![image-20251212193035937](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251212193037.png)





### 2.5 async与await语法

#### 2.5.1 基本用法

参考资料：https://www.runoob.com/js/js-async-await.html

> 背景：
>
> 在 async/await 出现之前，JavaScript 主要使用回调函数处理异步操作，但这会导致"回调地狱"（Callback Hell），即多层回调嵌套结构使得代码难以阅读和维护。
>
> ES6 引入了 Promise 对象来解决回调地狱问题。虽然 Promise 改善了回调问题，但 then() 链式调用仍然不够直观。
>
> ES7（即ES2017） 引入了 `async/await`，它`建立在 Promise 之上，让异步代码看/写起来像同步代码一样`。

`async` 和 `await`  都是属于 ES7 支持的语法。

* async，在**函数声明前添加**，表示该函数是异步的。
  * async 函数总是返回一个 Promise：
    * 如果返回值不是 Promise，会自动包装成 resolved Promise
    * 如果抛出异常，会返回 rejected Promise
* await，**只能在 async 函数内部使用**，函数内部变同步执行。
  * await 会暂停 async 函数的执行，等待 Promise 完成：
    * 如果 Promise 被 resolve，返回 resolve 的值
    * 如果 Promise 被 reject，抛出错误（可以用 try/catch 捕获）

基本用法：

```js
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function showMessage() {
  console.log('开始');
  await delay(1000);
  console.log('1秒后');
  await delay(1000);
  console.log('又1秒后');
}

showMessage();
```

错误处理：

```js
async function fetchUserData() {
  try {
    const response = await fetch('https://api.example.com/user');
    if (!response.ok) {
      throw new Error('网络响应不正常');
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('获取数据失败:', error);
  }
}
```

并行执行：

```js
async function fetchMultipleData() {
  const [p1Data, p2Data] = await Promise.all([p1, p2]);  //p1,p2都是Promise对象
  const p1Res = await p1Data.json();
  const p2Res = await p2Data.json();
  return { p1Res, p2Res };
}
```

#### 2.5.2 最佳实践

1. 不要忘记 await

```js
// 错误示例 - 忘记 await
async function example() {
  const data = fetch('/api'); // 缺少 await
  console.log(data); // 输出 Promise 对象
}
// 正确示例
async function example() {
  const data = await fetch('/api');
  console.log(data); // 输出实际数据
}
```

2. 避免不必要的 async

```js
// 不必要 - 函数内部没有 await
async function unnecessaryAsync() {
  return 42;
}
// 更简单的写法
function simpleFunction() {
  return 42;
}
```

3. 顶层await（在模块顶层可以直接使用 await（ES2022 特性））

```js
// 在模块中
const data = await fetch('/api');
console.log(data);
```

4. 性能考虑
   - 顺序执行 vs 并行执行：`合理使用 Promise.all 提高性能`
   - 错误处理：确保所有可能的错误都被捕获



代码实例（一个接口依赖上一个接口的返回值如id的使用场景）：

```js
    <script type="module">
        import {ajax, pajax} from './util.js'

        console.log(11111111)

        // async 异步执行，但是内部加上 await 会让函数内容变成同步
        async function test() {
            // 同步的res：await 后跟 同步代码 或 Promise对象(只用于promise)
            let res = await pajax({
                // url: "https://api.pearktrue.cn/api/dailyhot/?title=百度",
                url: "https://api.pearktrue.cn/api/dailyhot/",
                data: {
                    title: "百度"
                }
            })
            console.log("await:", res.data)
            console.log(2222222)

            // 同步的res1：res请求完，本次请求依赖res返回值中的id，比如评论系统等经典父子id接口结构
            let res1 = await pajax({
                url: "https://api.pearktrue.cn/api/dailyhot/?title=百度",
                data: {
                    newsId: res.data[0].id
                }
            })
            //console.log(res1)

            return res1 // 只有return出去后才能让外部的 test().then()拿到res数据
        }

        test().then(res => {
            console.log("then:", res)
        }).catch(err => {
            console.log("catch:", err)
        })
        console.log(3333333)
    </script>
```

输出：

```text
1111
3333
await: [{...}, {...}]
2222
then: {...}
```



### 案例：模拟待办事项-async+await

```js
    <input type="text" name="" id="mytext">
    <button id="myadd">添加</button>
    <ul class="list"></ul>

    <script type="module">
        import { ajax, pajax } from './util.js'
        // console.log(ajax)

        class TodoList {
            constructor(select) {
                this.listEle = document.querySelector(select)
                this.listData = []     // li列表数据

                this.init()
            }
            init() {
                // 绑定事件
                this.bindEvent()
                // 获取数据
                this.getList().then((res) => {
                    this.listData = res
                    this.render()
                }).catch((err) => {
                    console.error(err)
                })
            }

            // 绑定事件
            bindEvent() {
                this.listEle.onclick = (evt) => {
                    // console.log(evt.target)    // <button>删除</button>
                    if (evt.target.nodeName === "BUTTON") {
                        this.removeItem(evt.target)
                    }
                }
            }

            // 获取数据
            async getList() {
                let res = await pajax({
                    url: "http://localhost:3000/list",
                })
                console.log("getList:", res)
                return res
            }

            // 渲染页面
            render() {
                // console.log("render")
                this.listEle.innerHTML = this.listData.map(item => `
                    <li>
                        ${item.text}
                        <button data-index=${item.id}>删除</button>
                    </li>
                `).join("")
            }

            async addItem(text) {
                // console.log(text)
                if (!text) {
                    alert("你还未填写内容！")
                    return
                }
                // 先在数据库添加成功的回调里，才能在页面进行添加
                let res = await pajax({
                    url: "http://localhost:3000/list",
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    data: {
                        text
                    }
                })
                // .then((res) => {
                //     console.log("成功", res)
                //     this.listData = [...this.listData, res]
                //     this.render()
                // })
                // 加了 async 和 await，.then 就可以写成像如下同步代码一样
                console.log("成功", res)
                this.listData = [...this.listData, res]
                this.render()
            }

            async removeItem(target) {
                // button按钮的 parentNode 就是 li
                target.parentNode.remove()

                // 删除任务
                let res = await pajax({
                    url: `http://localhost:3000/list/${target.dataset.index}`,
                    method: "DELETE"
                })
                console.log("删除成功", res)
                // 同时移除li列表数据中指定的元素
                let idx = this.listData.findIndex((item) => item.id === target.dataset.index)
                this.listData.splice(idx, 1)
            }

            updateItem() {

            }
        }

        let obj = new TodoList(".list")
        console.log(obj)

        myadd.onclick = function () {
            // console.log(mytext.value)
            obj.addItem(mytext.value)
        }

        console.log("显示加载中...")
        let q1 = pajax({
            url: "http://localhost:3000/looplist"
        })
        let q2 = pajax({
            url: "http://localhost:3000/datalist"
        })
        //等待两个promise对象都兑现承诺resolve
        // Promise.all([q1, q2]).then(res => {
        //     console.log(res)
        //     console.log("隐藏加载中...")
        // }).catch(err => {
        //     console.error(err)
        // })
        async function promiseAll() {
            let res = await Promise.all([q1, q2])
            console.log("promiseAll:", res)   // promiseAll: [Array(n), Array(m)]
            console.log("隐藏加载中。")
        }
        promiseAll()
    </script>
```

效果一模一样。



### 2.6 fetch

`fetch` 的出现是为了取代 XMLHttpRequest的，但不是为了取代 ajax的，它可以简洁地发起 HTTP 请求，并处理服务器的响应。

**优点**：

- 基于 `Promises` 封装出来的，代码更加简洁和易读。
- 更好的错误处理机制：只在网络错误（如无法连接服务器）时返回 `catch`，而非状态码错误。
- 支持多种数据格式（JSON、文本、二进制等）。
- 可以处理跨域请求，通过 `CORS` 机制配置。

**缺点**：

* 兼容性不太好，`不兼容 IE678,11`，[caniuse查询](https://caniuse.com/?search=fetch)
* .catch 无法自动捕获错误，需要在第一个 .then 中手动去做拒绝承诺的返回

第一个 .then 固定返回的数据格式 Response：

![image-20251213111749835](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251213111757.png)



fetch GET：

```js
    <script>
        // fetch: GET 请求(默认)
        fetch("https://api.pearktrue.cn/api/dailyhot/?title=百度")
        // 返回的是 json 格式的 Response 对象，固定常规写法
        .then(res => {
            console.log(res)
            // 手动判断和拒绝
            return res.ok ? res.json() : Promise.reject({
                a:1,  // 可自定义参数传到 reject -> .catch
                status: res.status,
                statusText: res.statusText
            })
        })
        // 在第二个 .then 中才能获取到具体的数据
        .then(res => {
            console.log("get success:", res.data)  // [{...}, {...}, ...]
        })
        // 为了能够报错进 .catch 必须在第一个 .then 中判断和手动拒绝承诺 .reject()
        .catch(err => {
            console.error("get error:", err)
        })
    </script>
```



fetch POST：

```js
    <script>
        // fetch: POST 请求
        fetch("https://api.pearktrue.cn/api/dailyhot/", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                title: "百度"
            })
        }).then(res => {
            return res.ok ? res.json() : Promise.reject({
                status: res.status,
                statusText: res.statusText
            })
        }).then(res => {
            console.log("post success:", res)
        }).catch(err => {
            console.error("post err:", err)
        })
    </script>
```



### 案例：模拟待办事项-fetch

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <input type="text" name="" id="mytext">
    <button id="myadd">添加</button>
    <ul class="list"></ul>

    <script type="module">
        import { ajax, pajax } from './util.js'
        // console.log(ajax)

        class TodoList {
            constructor(select) {
                this.listEle = document.querySelector(select)
                this.listData = []     // li列表数据

                this.init()
            }
            init() {
                // 绑定事件
                this.bindEvent()
                // 获取数据
                this.getList().then((res) => {
                    this.listData = res
                    this.render()
                }).catch((err) => {
                    console.error(err)
                })
            }

            // 绑定事件
            bindEvent() {
                this.listEle.onclick = (evt) => {
                    // console.log(evt.target)    // <button>删除</button>
                    if (evt.target.nodeName === "BUTTON") {
                        this.removeItem(evt.target)
                    }
                }
            }

            // 获取数据
            async getList() {
                return await fetch("http://localhost:3000/list")
                .then(res => res.json())
            }

            // 渲染页面
            render() {
                // console.log("render")
                this.listEle.innerHTML = this.listData.map(item => `
                    <li>
                        ${item.text}
                        <button data-index=${item.id}>删除</button>
                    </li>
                `).join("")
            }

            async addItem(text) {
                // console.log(text)
                if (!text) {
                    alert("你还未填写内容！")
                    return
                }
                // 先在数据库添加成功的回调里，才能在页面进行添加
                let res = await fetch("http://localhost:3000/list", {
                    method: "post",
                    headers: {
                        "content-type": "application/json"
                    },
                    // 这里是body，不是data
                    body: JSON.stringify({
                        text
                    })
                }).then(res => res.json())
                console.log(res)
                this.listData = [...this.listData, res]
                this.render()
            }

            async removeItem(target) {
                // button按钮的 parentNode 就是 li
                target.parentNode.remove()

                // 删除任务
                let res = await fetch(`http://localhost:3000/list/${target.dataset.index}`, {
                    method: "DELETE"
                }).then(res => res.json())
                console.log("删除成功", res)
                // 同时移除li列表数据中指定的元素
                let idx = this.listData.findIndex((item) => item.id === target.dataset.index)
                this.listData.splice(idx, 1)
            }

            updateItem() {

            }
        }

        let obj = new TodoList(".list")
        console.log(obj)

        myadd.onclick = function () {
            obj.addItem(mytext.value)
        }

        console.log("显示加载中...")
        let q1 = fetch("http://localhost:3000/looplist").then(res => res.json())
        let q2 = fetch("http://localhost:3000/datalist").then(res => res.json())

        async function promiseAll() {
            let res = await Promise.all([q1, q2])
            console.log("promiseAll:", res)   // promiseAll: [Array(n), Array(m)]
            console.log("隐藏加载中。")
        }
        promiseAll()
    </script>
</body>

</html>
```

效果一模一样。





























