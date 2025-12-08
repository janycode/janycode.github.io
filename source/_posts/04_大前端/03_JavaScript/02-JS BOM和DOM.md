---
title: 02-JS BOM和DOM
date: 2017-4-28 22:23:58
tags:
- JS
- JavaScript
- BOM
- DOM
categories: 
- 04_大前端
- 03_JavaScript
---

![image-20251125100829463](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251128131801.png)



JavaScript = ECMAscript + BOM  + DOM

- BOM：**Browser** Object Model，`浏览器对象模型`。
- DOM：**Document** Object model，`文档对象模型`。

## 1. BOM

### 1.1 定义

`BOM` （**Browser** Object Model）浏览器对象模型，操作浏览器的能力，核心是 `window` 对象。

* **window**，是浏览器内置的一个对象，包含着操作浏览器的方法。`书写时都可以省略 window. `

### 1.2 浏览器窗口尺寸

* `innerHeight` 和 `innerWidth` 对应分别获取浏览器窗口的高度和宽度（包含滚动条）

```js
    <script>
        // window. 可省略，直接写 innerHeight 和 innerWidth 效果一样
        console.log(innerHeight)
        console.log(innerWidth)
    </script>
```



### 1.3 浏览器的弹出层

* `alert()` 浏览器弹窗
* `confirm()` 浏览器确认弹窗
* `prompt()` 浏览器输入弹窗

```js
    <button id="btn1">模拟清除缓存</button>
    <button id="btn2">删除</button>
    <button id="btn3">输入姓名</button>
    <script>
        // alert() 浏览器弹窗
        var btn1 = document.getElementById('btn1')
        btn1.onclick = function () {
            setTimeout(() => {
                alert('缓存清除成功')
            }, 2000);
        }
        // confirm() 确认弹窗
        var btn2 = document.getElementById('btn2')
        btn2.onclick = function () {
            var res = confirm('确定删除吗？')
            if (res) {
                alert('删除成功')
            }
        }
        // prompt() 输入弹窗
        var btn3 = document.getElementById('btn3')
        btn3.onclick = function () {
            var name = prompt('请输入姓名')
            if (name) {
                alert('你好，' + name)
            } else {
                alert('你没有输入姓名')
            }
        }
    </script>
```



### 1.4 浏览器地址信息

* `location` 专门用来存储浏览器地址栏内的信息
  * `location.href` 获取当前页面的地址，也可以用于跳转页面【**常用**】

```js
    <button id="btn1">跳转</button>
    <button id="btn2">刷新</button>
    <script>
        // location 对象
        console.log(location)
        // location.href 可以获取当前页面的地址
        console.log(location.href)
        btn1.onclick = function () {
            location.href = "https://www.baidu.com"
        }

        // reload 方法可以重新加载当前页面
        btn2.onclick = function () {
            location.reload()
        }
    </script>
```



### 1.5 浏览器常见事件

* `window.onload` 页面所有资源都加载完毕后执行
* `window.resize` 当浏览器窗口的大小发生改变时触发
* `window.onscroll` 当浏览器窗口滚动时触发
* `document.documentElement.scrollTop || document.body.scrollTop`  纵向滚动距离（兼容性）
* `document.documentElement.scrollLeft || document.body.scrollLeft` 横向滚动距离（兼容性）
* `window.scrollTo(0, 0)` 回到顶部 
* `window.open(url)` 打开标签页url
* `window.close()` 关闭当前标签页
* `window.history.forward()` == `window.history.go(1)` 前进一页（需要有历史记录）
* `window.history.back()` == `window.history.go(-1)` 返回上一页【**最常用**】

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body{
            width: 2000px;
            height: 2000px;
        }
    </style>
    <script>
        // onload 事件：当页面所有资源都加载完毕后触发
        window.onload = function () {
            console.log('页面素有资源都已加载完毕（图片、视频、音频、js、DOM等）！')

            /* 页面都加载完后，才绑定按钮的事件，否则 js 代码就需要写在挨着 /body 标签前面 */
            btn.onclick = function () {
                console.log(btn.innerHTML)
            }
        }
    </script>
</head>
<body>
    <button id="btn">点击我</button>

    <div style="height: 500px; background-color: pink;"></div>
    <button id="backTop">回到顶部</button>

    <script>
        // resize 事件：当浏览器窗口的大小发生改变时触发
        window.onresize = function () {
            console.log('浏览器窗口的大小发生改变了！')
        }

        // onscroll 事件：当浏览器窗口的滚动条滚动时触发
        window.onscroll = function () {
            console.log('浏览器窗口的滚动条滚动了！')
        }

        // 滚动距离：scrollTop 和 scrollLeft
        window.onscroll = function () {
            // 纵向滚动距离
            console.log(document.documentElement.scrollTop || document.body.scrollTop)
            // 横向滚动距离
            console.log(document.documentElement.scrollLeft || document.body.scrollLeft)
        }

        if (document.documentElement.scrollTop || document.body.scrollTop > 100) {
            console.log('显示回到顶部按钮')
        } else {
            console.log('隐藏回到顶部按钮')
        }

        //scrollTo  回到顶部
        backTop.onclick = function () {
            // 回到顶部写法1
            // window.scrollTo(0, 0)
            // 回到顶部写法2
            window.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            })
            // 回到顶部写法3
            document.documentElement.scrollTop = 0
            document.body.scrollTop = 0
        }
    </script>
</body>
</html>
```

标签页：

```html
    <button id="btn">打开百度</button>
    <button id="closeBtn">关闭当前标签页</button>
    <script>
        btn.onclick = function () {
            // 浏览器打开标签页
            window.open('https://www.baidu.com')
        }

        closeBtn.onclick = function () {
            // 关闭当前标签页
            window.close()
        }
    </script>
```

浏览器历史记录前进和后退：

```html
    <button id="backBtn">返回上一页</button>
    <button id="forwardBtn">前进一页</button>
    <script>
        backBtn.onclick = function () {
            // 返回上一页: back() 或 go(-1)
            // history.back()
            history.go(-1)
        }
        forwardBtn.onclick = function () {
            // location.href = '#'
            // 前进一页(有历史记录才能前进): forward() 或 go(1)
            // history.forward()
            history.go(1)
        }
    </script>
```



### 1.6 本地存储

#### 1.6.1 localStorage-永久

注意：`永久存储`，关闭页面或浏览器不会消失，只有在刻意去清除或者卸载浏览器操作等才会消失。

* `localStorage.setItem(key, value)` 存/改 一个键值对到本地存储中，**只能存储字符串类型的数据**
* `localStorage.getItem(key)` 获取本地存储中key的value值，**读取 json字符串时要进行解析**
* `localStorage.removeItem(key)` 删除本地存储中的key和value
* `localStorage.clear()` 删除所有的本地存储内容

```html
    <button id="save">点击存</button>
    <button id="get">点击取</button>
    <button id="del">点击删</button>
    <button id="clear">点击全部删除</button>
    <script>
        // localStorage
        save.onclick = function () {
            // 存/改，因为localStorage中如果有相同的key，会覆盖之前的value
            // 只能存储字符串类型的数据
            localStorage.setItem('name', '张三')
            localStorage.setItem('age', 18)
            // 要想存储对象类型的数据，需要先将对象转换为 json字符串 类型
            localStorage.setItem('obj', JSON.stringify({name: '李四', age: 28}))
        }
        get.onclick = function () {
            // 取
            console.log(localStorage.getItem('name'))
            var age = localStorage.getItem('age')
            console.log(age, typeof age)                  // 18 string
            var obj = localStorage.getItem('obj')
            console.log(obj, typeof obj)                  // {"name":"李四","age":28} string
            // 要想将字符串类型的对象转换为对象类型，需要使用JSON.parse()方法
            console.log(JSON.parse(obj))                  // {name: '李四', age: 28}
        }
        del.onclick = function () {
            // 删
            localStorage.removeItem('name')
            localStorage.removeItem('age')
            localStorage.removeItem('obj')
        }
        clear.onclick = function () {
            // 全部删除
            localStorage.clear()
        }
    </script>
```



#### 1.6.2 sessionStorage-会话

注意：`会话存储`，即**临时**存储，只要页面关闭即消失。

```js
使用方式与 localStorage 完全一样，如:
sessionStorage.setItem('key', 'value')
```



### 案例：记住用户名

```html
    <div>
        用户名：
        <input type="text" id="username">
        <br>
        密码：
        <input type="password" id="password">
        <br>
        <input type="checkbox" id="remember">
        记住用户名
        <br>
        <button id="login">登录</button>
    </div>

    <script>
        var userValue = localStorage.getItem('username')
        console.log("userValue:" + userValue)
        var passValue = localStorage.getItem('password')
        if (userValue && passValue) {
            // 如果本地存储中存在用户名和密码，就将它们填充到表单中
            document.getElementById('username').value = userValue
            document.getElementById('password').value = passValue
            // 同时勾选记住用户名复选框
            document.getElementById('remember').checked = true
        }

        login.onclick = function (e) {
            // 阻止表单的默认提交行为
            e.preventDefault()
            //console.log(username.value, password.value)
            // 取到用户名和密码
            var username = document.getElementById('username').value
            var password = document.getElementById('password').value
            // 判断是否勾选了记住用户名复选框
            var remember = document.getElementById('remember').checked
            if (remember) {
                // 如果勾选了，就将用户名存储到本地存储中
                localStorage.setItem('username', username)
                localStorage.setItem('password', password)
            }
        }
    </script>
```

效果：

![image-20251208173352166](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251208173353.png)



## 2. DOM

### 2.1 定义

`DOM` （**Document** Object model）文档对象模型，操作 html 中标签的能力，核心是 `document` 对象。（DOM树）

* **document**，是浏览器内置的一个对象，存储着专门用来操作元素的各种方法。



### 2.2 获取元素的方式

* `document.documentElement` 获取html根元素对象
* `document.head` 获取head元素对象
* `document.body` 获取body元素对象

* `document.getElementById(id)` 获取对应**id**的标签元素
* `document.getElementsByClassName(class)` 获取对应**class**的标签元素
* `document.getElementsByTagName(tag)` 获取对应**tag**标签的元素
* `document.getElementsByName(name)` 获取对应**name**的标签元素，取值需要加索引，即 `res[0]`
* `document.querySelector("#id")` 通过 css 选择器获取元素：返回**第一个**匹配的元素
* `document.querySelectorAll(".class")` 通过 css 选择器获取元素：返回**所有**匹配的元素

```html
    <div id="box">1111</div>
    <ul>
        <li class="newsItem">001</li>
        <li class="newsItem">002</li>
        <li class="newsItem">003</li>
        <li class="newsItem">004</li>
        <li class="newsItem">005</li>
    </ul>
    <input type="text" name="username">
    <br>
    <input type="password" name="password">
    <script>
        // html, body, body 非常规元素
        var htmlDoc = document.documentElement // html 元素，可以去设置 rem
        console.log(htmlDoc)
        var headDoc = document.head            // head 元素
        console.log(headDoc)
        var bodyDoc = document.body            // body 元素
        console.log(bodyDoc)

        // 获取元素通过id
        var box = document.getElementById("box")
        box.innerHTML = "2222"
        console.log(box)

        // 获取元素通过类名
        var newsItems = document.getElementsByClassName("newsItem")
        console.log(newsItems)   // 伪数组
        // 遍历 newsItems 数组，将每个元素的 innerHTML 改为 "新闻"
        for (var i = 0; i < newsItems.length; i++) {
            newsItems[i].innerHTML = "新闻" + (i + 1)
        }
        // 伪数组 转换为 数组
        var newsItemsArr = Array.from(newsItems)
        console.log(newsItemsArr.map((item) => {
            return item.innerHTML
        }))

        // 获取元素通过标签名
        var liTags = document.getElementsByTagName("li")
        console.log(liTags)

        // 获取元素通过name
        var username = document.getElementsByName("username")[0]
        console.log(username)
        username.value = "admin"
        var password = document.getElementsByName("password")[0]
        console.log(password)
        password.value = "123456"

        // querySelector 可以通过 css 选择器获取元素：返回第一个匹配的元素
        var box2 = document.querySelector("#box")
        console.log(box2)
        // querySelectorAll 可以通过 css 选择器获取元素：返回所有匹配的元素
        var newsItemsAll = document.querySelectorAll(".newsItem")
        console.log(newsItemsAll)
        // 遍历 newsItemsAll 数组，将每个元素的 innerHTML 改为 "新闻"
        for (var i = 0; i < newsItemsAll.length; i++) {
            newsItemsAll[i].innerHTML = "新闻news-" + (i + 1)
        }
    </script>
```



### 2.3 操作元素的属性

* `.属性` 操作原生属性直接可以通过 . 找到对应属性的值，如 input框中的 username.type
* `.setAttribute()` **设置**自定义属性的值
* `.getAttribute()` **获取**自定义属性的值
* `.removeAttribute()` 自定义属性**移除**属性和值
* `data-***` H5规范约定使用 `data-` 来命名属性时，就可以通过 `.dataset` 属性再 `.属性` 获取属性的值

```html
    <div id="box"></div>
    <input type="text" id="username">
    <input type="checkbox" id="remember">
    <img src="" alt="" id="photo">
    <script>
        /* 操作原生元素属性 */
        box.innerHTML = "hello world"
        username.type = "password"
        remember.checked = true
        photo.src = "https://img2.baidu.com/it/u=3422284222,2928223328&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500"

        /* 自定义属性: setAttribute, getAttribute, removeAttribute */
        box.setAttribute("test111", "box1")
        console.log(box.getAttribute("test111"))    // box1
        console.log(box.test111)                    // undefined
        box.removeAttribute("test111")
        console.log(box.getAttribute("test111"))    // null

        // h5 -> 约定: 自定义属性以"data-"开头，获取时通过 .dataset 属性
        box.setAttribute("data-jerry", "box1")
        console.log(box.getAttribute("data-jerry"))    // box1
        console.log(box.dataset)                       // {jerry: "box1"}
        console.log(box.dataset.jerry)                 // box1

        delete box.dataset.jerry
        console.log(box.dataset)                       // {}
    </script>
```



#### 案例：密码可视

```html
    <input type="password" id="password">
    <button id="show">显示密码</button>
    <script>
        var password = document.getElementById("password")
        var show = document.querySelector("#show")
        show.onclick = function () {
            console.log(password.type)
            if (password.type === "password") {
                password.type = "text"
                show.innerHTML = "隐藏密码"
            } else {
                password.type = "password"
                show.innerHTML = "显示密码"
            }
        }
    </script>
```

效果：

![chrome-capture-2025-12-08](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251208182432.gif)



#### 案例：购物车全选

```html
    <input type="checkbox" id="all">全选
    <hr>
    <ul class="shop">
        <li><input type="checkbox">商品1</li>
        <li><input type="checkbox">商品2</li>
        <li><input type="checkbox">商品3</li>
        <li><input type="checkbox">商品4</li>
        <li><input type="checkbox">商品5</li>
    </ul>
    
    <script>
        var oAll = document.getElementById("all")
        var oItems = document.querySelectorAll(".shop input")
        // 全选复选框点击事件：点击时，将所有商品复选框选中
        oAll.onclick = function () {
            // this指向全选复选框
            console.log(this.checked)
            // 遍历所有商品复选框，将其选中状态设置为全选复选框的选中状态
            for (var i = 0; i < oItems.length; i++) {
                oItems[i].checked = this.checked
            }
        }
        // 商品复选框点击事件：全都选中时，去选中全选框
        for (var i = 0; i < oItems.length; i++) {
            oItems[i].onclick = function () {
                // 检查所有商品复选框是否都被选中
                var isAllChecked = true
                for (var j = 0; j < oItems.length; j++) {
                    console.log(j, oItems[j].checked)
                    if (!oItems[j].checked) {
                        isAllChecked = false
                        break
                    }
                }
                // 设置全选复选框的选中状态
                oAll.checked = isAllChecked
            }
        }
    </script>
```

效果：

![chrome-capture-2025-12-08 (1)](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251208183805.gif)

### 2.4 操作元素的文本

* `.innerHTML` 完整的html内容，包含标签+内容
* `.innerText` 只有元素(标签)的文本内容
* `.value` 元素内属性的文本内容value值

```html
    <div id="box">
        这是一个div元素
    </div>
    <input type="text" value="hello" id="username">

    <select name="" id="select">
        <option value="1">111</option>
        <option value="2" selected>222</option>
        <option value="3">333</option>
    </select>

    <script>
        console.log(box.innerHTML)         // 完整的html
        // box.innerHTML = "111111"

        console.log(box.innerText)         // 元素的文本内容
        box.innerText = "<h1>222222</h1>"  // 不解析html, 显示为 <h1>222222</h1>

        console.log(username.value)         // 元素的value内容: hello
        username.value = "world"
        console.log(username.value)         // 元素的value内容: world

        console.log(select.value)           // 选中的option的value值
        select.value = "3"                  // 会默认选中value为3的option
        console.log(select.value)           // 选中的option的value值: 3
    </script>
```



#### 案例：渲染页面

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }

        ul {
            list-style: none;
        }

        li {
            /* 父元素不写高度时，子元素写了浮动后，父元素发生高度塌陷。可以给父元素添加 overflow: hidden; 来解决 */
            overflow: hidden;
            margin-left: 10px;
            margin-top: 10px;
        }

        li img {
            /* 图片左浮动，文字就环绕在图片的右边 */
            float: left;
            width: 100px;
        }
    </style>
</head>

<body>
    <ul>
        <!-- <li>
            <img src="https://static.maizuo.com/pc/v5/usr/movie/53443bf08ac8f08d23e3fe35959a3240.jpg?x-oss-process=image/quality,Q_70" alt="">
            <h3>疯狂动物城</h3>
            <p>评分：8.5</p>
        </li> -->
    </ul>

    <script>
        // 1. 准备数据
        var filmList = [
            {
                url: "https://static.maizuo.com/pc/v5/usr/movie/53443bf08ac8f08d23e3fe35959a3240.jpg?x-oss-process=image/quality,Q_70",
                title: "疯狂动物城",
                score: "9.0"
            },
            {
                url: "https://static.maizuo.com/pc/v5/usr/movie/d474040d4d8aaee98a126c2c581b57ed.jpg?x-oss-process=image/quality,Q_70",
                title: "让子弹飞",
                score: "8.9"
            },
            {
                url: "https://static.maizuo.com/pc/v5/usr/movie/7767b643a38cbaf714aaea55f5c44053.jpg?x-oss-process=image/quality,Q_70",
                title: "速度与激情8",
                score: "8.5"
            }
        ]
        // 2. 处理数据
        var fileItems = filmList.map(function (item) {
            // 模板字符串
            return `<li>
                        <img src="${item.url}" alt="">
                        <h3>${item.title}</h3>
                        <p>评分：${item.score}</p>
                    </li>`
        })
        console.log(fileItems.join(""))
        // 3. 渲染页面
        document.querySelector("ul").innerHTML = fileItems.join("")
    </script>
</body>

</html>
```

效果：

![image-20251208191540501](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251208191541.png)





083













## 3. 事件







