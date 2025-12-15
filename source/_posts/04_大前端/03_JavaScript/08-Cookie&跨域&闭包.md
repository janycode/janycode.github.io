---
title: 08-Cookie&跨域&闭包
date: 2018-5-7 15:21:05
tags:
- cookie
categories: 
- 04_大前端
- 03_JavaScript
---

![image-20251125100829463](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251128131801.png)



## 1. cookie

特点：

* 只能存储`文本`
* 单条存储有大小限制`4KB左右`，数量有限制，一般浏览器限制在`50条左右`
* 读取有域名限制：`不可跨域读取`，只能由来自 写入cookie的同一域名 的网页可进行读取。
* 时间限制：`expires` 可以设置过期时间，默认有效期是会话级别（浏览器关闭cookie就销毁）
* 路径限制：`path`存储时可以指定路径，只允许子路径读取外层cookie，外层不能读取内层

> 结合token和sessionId才能实现用户登录验证的功能。



### 1.1 创建cookie

```js
    <button id="saveBtn">存cookie</button>
    <script>
        // 存储 cookie：浏览器关闭就会消失
        saveBtn.onclick = function () {
            // path 限制访问路径 设置
            // path参数可以限制哪些目录下可以访问，未设置是当前目录及子目录均可访问
            document.cookie = "username=jerry;path=/07_cookie/aaa"
            document.cookie = "age=18"
            document.cookie = "address=china"

            // expires 过期时间，UTC时间格式
            // 浏览器>应用>Cookie显示的具体key value过期时间是 UTC时间（查看时需要+8h）
            let date = new Date()
            date.setMinutes(date.getMinutes() + 1)  //eg: 1分钟后过期
            document.cookie = `username=tom; expires=${date.toUTCString()}`
        }
    </script>
```



### 1.2 删除cookie

使用旧的过期时间进行设置，覆盖后即为删除。

```js
    <button id="delBtn">删cookie</button>
    <script>
        // 删除 cookie：没有具体方法，只能设置为以前的时间
        delBtn.onclick = function () {
            let date = new Date()
            date.setMinutes(date.getMinutes() - 1)
            document.cookie = `age=18; expires=${date.toUTCString()}`
            document.cookie = `username=tom; expires=${date.toUTCString()}`
        }
    </script>
```



### 1.3 修改cookie

使用创建的方式覆盖。



### 1.4 查询cookie

```js
    <button id="getBtn">取cookie</button>
    <script>
        // 获取 cookie：多个键值对需要自行分隔字符串
        getBtn.onclick = function () {
            // alert(document.cookie)
            console.log(getCookie("username"))
            console.log(getCookie("age"))
            console.log(getCookie("address"))
            console.log(getCookie())
        }

        // 获取 cookie 函数封装
        function getCookie(key) {
            let arr = document.cookie.split("; ")
            let obj = {}
            for (let i = 0; i < arr.length; i++) {
                let kv = arr[i].split("=")
                obj[kv[0]] = kv[1]
            }
            return key ? obj[key] : obj
        }
    </script>
```



## 2. jsonp跨域

### 2.1 CORS

同源策略：同域名、同端口号、同协议

不符合同源策略，浏览器为了安全，会阻止请求。

`CORS`跨域解决：

1. 由后端去实现允许跨域的范围 ，在header中设置`Access-Control-Allow-Origin:*`
   - `*` 允许所有域名请求，如果设置为具体域名，则限制为具体域名可请求访问
2. 如果是前端实现跨域，可以用 `jsonp`，必须前后端协作



### 2.2 jsonp

原理：

* 动态创建 script 标签，src 属性指向没有跨域限制
* 指向一个接口，接口返回的格式一定是 `****()` 函数表达式

缺点：

1. 需要 onload 删除 script 标签
2. 只能 get 请求，不能 post/put/delete 请求

用法：

jsonp.html

```js
    <button id="myBtn">jsonp</button>
    <script>
        function test(obj) {
            console.log(obj)
        }
        myBtn.onclick = function() {
            let oScript = document.createElement("script")
            oScript.src = "1.txt"  // 未来的api接口地址
            document.body.appendChild(oScript)
            oScript.onload = function() {
                oScript.remove()   //删除当前节点
            }
        }
    </script>
```

1.txt

```txt
test({name:"jerry123"})
```



示例：

```js
    <button id="myBtn">jsonp</button>
    <script>
        function test(obj) {
            console.log(obj)
        }

        myBtn.onclick = function() {
            let oScript = document.createElement("script")
            oScript.src = `https://www.runoob.com/try/ajax/jsonp.php?jsoncallback=test`
            document.body.appendChild(oScript)
            oScript.onload = function() {
                oScript.remove()   //删除当前节点
            }
        }
    </script>
```

浏览器 console.log：

```
(2) ['customername1', 'customername2']
```



### 案例：jsonp模拟百度搜索联想词

`https://www.baidu.com/sugrec?...&wd=a...cb=jQuery110207800798037841062_1765776153723...`

* `wd`: 搜索关键词
* `cb`: 回调函数

```html
    <input type="text" name="" id="mySearch">
    <ul id="list"></ul>
    <script>
        // https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=60273,63142,66226,66244,66286,66393,66529,66564,66582,66594,66648,66682,66671,66695,66687,66742,66630,66774,66789,66801,66803,66854,66856,66599,66840,66605,66870&wd=a&req=2&usegosug=1&csor=1&pwd=abcd&cb=jQuery110207800798037841062_1765776153723&_=1765776153728

        mySearch.oninput = function(evt) {
            // console.log(evt.target.value)
            if (!evt.target.value) {
                list.innerHTML = ""
                return
            }

            let oScript = document.createElement("script")
            // 参数 wd=搜索关键词, cb=test
            oScript.src = `https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=60273,63142,66226,66244,66286,66393,66529,66564,66582,66594,66648,66682,66671,66695,66687,66742,66630,66774,66789,66801,66803,66854,66856,66599,66840,66605,66870&wd=${evt.target.value}&req=2&usegosug=1&csor=1&pwd=abcd&cb=test&_=1765776153728`
            document.body.appendChild(oScript)

            oScript.onload = function() {
                oScript.remove()
            }
        }

        // 自己定义的函数
        function test(obj) {
            console.log(obj.g)
            list.innerHTML = obj.g.map(item => `<li>${item.q}</li>`).join("")
        }
    </script>
```

效果：

![chrome-capture-2025-12-15 (1)](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251215133626.gif)

## 3. 闭包

### 3.1 背景

![image-20251215154912724](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251215154913.png)

百度搜索时，输入搜索词 common，每一个字母都会触发 callback 函数去执行搜索和搜索结果展示，但是输入比较快的时候前面的字母均会被打断，显示失败，之后最后输入完毕时，触发正常 callback 执行。



`函数有返回值，而且返回值必须是复杂类型，同时要赋值给外面的变量。`

```js
    <script>
        function test() {
            var name = "jerry"
            console.log(name)
            var obj = {
                a: 1,
                b: 2
            }
            return obj
        }
        var obj1 = test()
        var obj2 = test()   // 每次函数调用拿到的对象都是全新的
        console.log(obj1 == obj2)   // false，否则修改obj1或obj2中的kv就会互相影响
        console.log(obj1 === obj2)   // false，否则修改obj1或obj2中的kv就会互相影响
    </script>
```



### 3.2 闭包

函数内部（或函数内部的对象属性中包含函数，对象被返回时）`返回一个函数`，`被外界所引用`。

* 这个内部函数就不会被销毁回收。

* 内部函数所用到的外部函数的变量也不会被销毁。

优点：让临时变量永驻内存

缺点：内存泄露风险，记得赋值 func = null (则会被回收) 即可。

![image-20251215164446738](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251215164447.png)

闭包应用：`函数的柯里化`

语法示例1：

```js
<script>
    // 闭包空间：函数和函数内的变量都不会被回收
    function outer() {
        var name = "jerry"
        return function() {
            return name + "123"
        }
    }
    var func = outer()
    console.log(func())
</script>
```

语法示例2：（闭包的匿名自执行函数）

```js
btn.onclick = (function(index) {
    return function(evt) {                      // 切记：事件对象evt在此处！
        console.log(evt.target.value, index)
    }
})(i)                                           // 实参i，形参index
```



fetch 闭包的封装：

```js
    <script>
        // 封装 fetch，闭包的方式
        function FetchContainer(url) {
            return function(path) {
                return fetch(url + path)
            }
        }
        let fa = FetchContainer("http://www.a.com/")
        fa("/api1").then(res => res.json()).then(res => console.log(res))
        fa("/api2").then(res => res.json()).then(res => console.log(res))
        fa("/api3").then(res => res.json()).then(res => console.log(res))
        fa = null  // 避免内存泄露
        let fb = FetchContainer("http://www.b.com/")
        fb("/apiA").then(res => res.json()).then(res => console.log(res))
        fb("/apiB").then(res => res.json()).then(res => console.log(res))
        fb("/apiC").then(res => res.json()).then(res => console.log(res))
        fb = null  // 避免内存泄露
    </script>
```



### 案例：闭包-记住列表索引

```html
    <ul>
        <li>111</li>
        <li>222</li>
        <li>333</li>
    </ul>
    <script>
        // 1.记住列表的索引
        var oli = document.querySelectorAll("li")
        // for (let i = 0; i < oli.length; i++) {    // ES6: i使用let可以记住i的值
        //     oli[i].onclick = function() {
        //         console.log(i)
        //     }
        // }
        for (var i = 0; i < oli.length; i++) {
            oli[i].onclick = (function(index){       // 闭包，让i不被内存回收
                return function() {
                    console.log("i=", index)   // i=0, i=1, i=2
                }
            })(i) // 匿名自执行函数 (function() {})() 此时 实参i，形参index
        }
    </script>
```



### 案例：闭包应用1-防抖

```js
    <input type="text" name="" id="mySearch">
    <ul id="list"></ul>
    <script>
        function searchOninput(evt) {
            // console.log(evt.target.value)
            if (!evt.target.value) {
                list.innerHTML = ""
                return
            }

            let oScript = document.createElement("script")
            // 参数 wd=搜索关键词, cb=test
            oScript.src = `https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=60273,63142,66226,66244,66286,66393,66529,66564,66582,66594,66648,66682,66671,66695,66687,66742,66630,66774,66789,66801,66803,66854,66856,66599,66840,66605,66870&wd=${evt.target.value}&req=2&usegosug=1&csor=1&pwd=abcd&cb=test&_=1765776153728`
            document.body.appendChild(oScript)

            oScript.onload = function () {
                oScript.remove()
            }
        }

        // 自己定义的callback函数
        function test(obj) {
            console.log(obj.g)
            list.innerHTML = obj.g.map(item => `<li>${item.q}</li>`).join("")
        }

        // 防抖：输入每个字母都会启动一个500ms定时器，直到输入完停留时，即500ms定时器结束就执行 ajax 调用
        mySearch.oninput = (function () {
            var timer = null          //闭包中让局部变量永驻内存
            return function (evt) {   // 切记：事件对象evt在此处！
                if (timer) {
                    clearTimeout(timer)
                }
                timer = setTimeout(function () {
                    searchOninput(evt)
                }, 500) // 500ms
            }
        })()   // 匿名自执行函数
    </script>
```

效果：

![chrome-capture-2025-12-15 (2)](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251215163914.gif)



### 案例：闭包应用2-节流

节流： n 秒内只执行一次事件，即使n 秒内事件重复触发，也只有一次生效

场景：浏览器滚动事件、窗口大小的改变

示例：监听window窗口大小改变

```js
    <script>
        // 只要不断拉窗口，就会一直触发resize事件，造成大量计算
        window.addEventListener("resize", function (evt) {
            console.log(evt)    // Event {...}
        })
    </script>
```



```js
    <script>
        // 节流方案：两次触发的时间间隔到了指定时间就执行--并且记录第二次触发的时间，否则不执行
        // cb-需要进行节流处理的函数, delay-延迟的时间
        window.onresize = (function (cb, delay) {
            let lastTime = 0                           // 记录上一次事件执行的时间
            return function (evt) {
                // console.log(evt)
                const nowTime = new Date().getTime()   // 获取当前时间
                const remainTime = nowTime - lastTime  // cd剩余时间 = 当前时分秒 - 上次时分秒
                // 如果冷却的时间 >= 规则的冷却时间，可以再次执行
                if (remainTime - delay >= 0) {
                    lastTime = nowTime
                    cb()  //节流要做的事情
                }
            }
        })(_resize, 2000) // 节流时间：2s/次触发

        function _resize() {
            console.log("节流触发：要做的事情")
        }
    </script>
```

效果：

![image-20251215165942552](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251215165943.png)





















