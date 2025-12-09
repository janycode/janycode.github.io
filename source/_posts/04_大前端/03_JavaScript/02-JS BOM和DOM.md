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

* `innerHeight` 和 `innerWidth` 对应分别获取**浏览器窗口**的高度和宽度（`包含`滚动条）

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
* `.setAttribute(key, value)` **设置**自定义属性和值
* `.getAttribute(key)` **获取**自定义属性和值
* `.removeAttribute(key)` 自定义属性**移除**属性和值
* `data-***` H5规范约定使用 `data-` 来命名属性时，就可以通过 `.dataset` 属性再 `.属性` 获取/设置自定义属性的值

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



### 2.5 操作元素的样式

* `.style` style对象，可以获取到所有的行内样式，只能获取行内样式
* `getComputedStyle(e)` 只能获取，不能设置样式，read-only 的
* `.className`  可以获取或设置元素的类名，但要严谨的**空格**隔开
* `.classList` 可以获取或设置元素的**类名列表**
  * `.add(class)`  添加样式类
  * `.remove(class)` 删除样式类
  * `.toggle(class)` 切换样式类（添加-删除 来回切换）

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        #box{
            height: 100px
        }
    </style>
</head>
<body>
    <div id="box" style="width: 100px; color: black; background-color: yellow;">111</div>
    <script>
        /* .style 只能获取行内样式 */
        console.log(box.style.width)      // 100px
        console.log(box.style.height)     // 空，无法获取到非行内样式
        console.log(box.style.color)      // black
        console.log(box.style['background-color'])     // yellow
        console.log(box.style.backgroundColor)         // yellow

        box.style.width = "200px"
        box.style.backgroundColor = "red"

        /* getComputedStyle() 内部样式、外部样式、行内样式，都可以获取到，但不能设置样式（read-only） */
        // 注意：getComputedStyle() 方法返回的是一个 CSSStyleDeclaration 对象，不是一个字符串。
        // 所以，不能直接使用 console.log(cs) 来查看样式。
        var cs = getComputedStyle(document.getElementById("box"))
        console.log(cs.width)      // 200px
        console.log(cs.height)     // 100px
        console.log(cs.color)      // rgb(0, 0, 0)
        console.log(cs.backgroundColor)         // rgb(255, 0, 0)
    </script>
</body>
</html>
```



批量获取和设置：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .item {
            width: 100px;
            height: 100px;
            background-color: red;
            color: black;
            border-radius: 10px;
        }
    </style>
</head>
<body>
    <div id="box" class="item item1 item2">hello</div>
    <button id="btn">点击切换类名</button>
    <script>
        // .className 可以获取或设置元素的类名
        var cn = box.className
        console.log(cn)     // item item1 item2
        cn = "item item3 item4"  // 覆盖原来的类名, 注意【空格】隔开
        console.log(cn)     // item item3 item4

        // .classList 可以获取或设置元素的类名列表
        var cls = box.classList
        console.log(cls)     // ["item", "item3", "item4"]
        cls.add("item5")     // 添加类名
        console.log(cls)     // ["item", "item3", "item4", "item5"]
        cls.remove("item3")  // 删除类名
        console.log(cls)     // ["item", "item4", "item5"]
        // 点击按钮切换类名
        btn.onclick = function () {
            // 点击一次添加一次类名, 点击第二次删除一次类名
            cls.toggle("item")
        }
    </script>
</body>
</html>
```



#### 案例：简易选项卡

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
            display: flex;
            list-style: none;
        }
        li {
            height: 50px;
            line-height: 50px;
            text-align: center;
            flex: 1;
        }
        .active {
            color: red;
            border-bottom: 1px solid red;
        }
    </style>
</head>
<body>
    <ul>
        <li class="active" id="item1">正在热映</li>
        <li id="item2">即将上映</li>
    </ul>
    <script>
        /* 选项卡 */
        item1Cls = item1.classList
        item2Cls = item2.classList
        item1.onclick = function () {
            item1Cls.add("active");
            item2Cls.remove("active");
        }
        item2.onclick = function () {
            item1Cls.remove("active");
            item2Cls.add("active");
        }
    </script>
</body>
</html>
```

效果：

![chrome-capture-2025-12-09](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251209124304.gif)

#### 案例：选项卡

`.dataset.index` 给元素添加属性 **data-index="值"**

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

        .header {
            display: flex;
            width: 500px;
        }

        .header li {
            flex: 1;
            height: 50px;
            line-height: 50px;
            text-align: center;
            border: 1px solid #ccc;
        }

        .box {
            position: relative;
        }

        .box li {
            position: absolute;
            left: 0;
            top: 0;
            width: 500px;
            height: 100px;
            line-height: 100px;
            text-align: center;
            border: 1px solid #ccc;
            background: yellow;
            /* 选项卡内容默认隐藏 */
            display: none;
        }

        .header .active {
            background: red;
        }

        .box .active {
            /* 拥有该类名的选项卡内容才显示 */
            display: block;
        }
    </style>
</head>

<body>
    <ul class="header">
        <li class="active">1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
    </ul>
    <ul class="box">
        <li class="active">111</li>
        <li>222</li>
        <li>333</li>
        <li>444</li>
        <li>555</li>
    </ul>

    <script>
        var oHeaderItems = document.querySelectorAll(".header li")
        var oBoxItems = document.querySelectorAll(".box li")
        for (var i = 0; i < oHeaderItems.length; i++) {
            // 设置自定义属性 data-index: 如 <li data-index="1">2</li>
            oHeaderItems[i].dataset.index = i
            oHeaderItems[i].onclick = handler
        }

        function handler() {
            // i 已经是最大索引了，即i一直是5
            console.log(i)     // 5
            // this 获取自身的属性，即当前点击的元素对象li （oHeaderItems[i]）
            console.log(this)  // <li data-index="1">2</li>
            for (var j = 0; j < oHeaderItems.length; j++) {
                oHeaderItems[j].classList.remove("active")
                oBoxItems[j].classList.remove("active")
            }
            var idx = this.dataset.index
            oHeaderItems[idx].classList.add("active")
            oBoxItems[idx].classList.add("active")
        }
    </script>
</body>

</html>
```

效果：

![chrome-capture-2025-12-09 (1)](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251209153227.gif)



### 2.6 DOM节点

DOM常用三大类`元素节点`、 `文本节点`、`属性节点`。

* 获取到的元素/标签，叫元素节点，通过 `getElementBy...() 获取到的都是元素节点`
* 标签里面写的文字，就是文本节点，通过 `getAttribute() 获取到的就是元素的属性节点`
* 标签上的属性，就是属性节点，通过 `innerText 获取到的就是元素的文本节点`
* DOM树：
  * **document**
    ![image-20251209155348159](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251209155456.png)
  * **html**
    ![image-20251209155629936](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251209155630.png)
  * **元素节点**
    ![image-20251209155553494](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251209155554.png)
  * **文本内容**
    ![image-20251209155723329](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251209155724.png)
  * **属性节点**
    ![image-20251209155812918](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251209155813.png)
  * **注释节点**
    ![image-20251209155842779](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251209155843.png)



### 2.7 获取DOM节点

* `e.childNodes` 所有子节点（元素节点、文本节点、注释节点等）
* `e.children` 只有元素节点
* `e.firstChild` 第一个子节点（包含元素节点、文本节点、注释节点等）
* `e.firstElementChild` 第一个元素子节点
* `e.lastChild` 最后一个子节点（包含元素节点、文本节点、注释节点等）
* `e.lastElementChild` 最后一个元素子节点
* `e.previousSibling` 前一个兄弟节点（包含元素节点、文本节点、注释节点等）
* `e.previousElementSibling` 前一个元素兄弟节点
* `e.nextSibling` 后一个兄弟节点（包含元素节点、文本节点、注释节点等）
* `e.nextElementSibling` 后一个元素兄弟节点
* `e.parentNode` 父节点（包含元素节点、文本节点、注释节点等）
* `e.parentElement` 父元素节点
* `e.getAttribute("id")` 获取元素的属性名为id的属性对应值
* `e.attributes` 获取元素的所有属性列表，返回一个 NodeNameMap 对象

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>hello</div>111
    <div id="box" index="div1">
        jerry
        <p>111111</p>
        <!-- 我是注释内容 -->
    </div>
    <script>
        // .childNodes 所有子节点（元素节点、文本节点、注释节点等）
        var box = document.getElementById("box")
        console.log(".childNodes: ", box.childNodes)
        // .children 只有元素节点
        console.log(".children: ", box.children)
        // .firstChild 第一个子节点（包含元素节点、文本节点、注释节点等）
        console.log(".firstChild: ", box.firstChild)
        // .firstElementChild 第一个元素子节点
        console.log(".firstElementChild: ", box.firstElementChild)
        // .lastChild 最后一个子节点（包含元素节点、文本节点、注释节点等）
        console.log(".lastChild: ", box.lastChild)
        // .lastElementChild 最后一个元素子节点
        console.log(".lastElementChild: ", box.lastElementChild)
        // .previousSibling 前一个兄弟节点（包含元素节点、文本节点、注释节点等）
        console.log(".previousSibling: ", box.previousSibling)
        // .previousElementSibling 前一个元素兄弟节点
        console.log(".previousElementSibling: ", box.previousElementSibling)
        // .nextSibling 后一个兄弟节点（包含元素节点、文本节点、注释节点等）
        console.log(".nextSibling: ", box.nextSibling)
        // .nextElementSibling 后一个元素兄弟节点
        console.log(".nextElementSibling: ", box.nextElementSibling)
        // .parentNode 父节点（包含元素节点、文本节点、注释节点等）
        console.log(".parentNode: ", box.parentNode)
        console.log(".parentNode2: ", box.parentNode.parentNode)   // html
        console.log(".parentNode3: ", box.parentNode.parentNode.parentNode)  //document
        // .parentElement 父元素节点
        console.log(".parentElement: ", box.parentElement)  // body
        console.log(".parentElement2: ", box.parentElement.parentElement) // html
        console.log(".parentElement3: ", box.parentElement.parentElement.parentElement)  // null

        // getAttribute() 获取元素的属性值
        console.log("id: ", box.getAttribute("id"))  // box
        console.log("attrs: ", box.attributes)  // NamedNodeMap {0: id, 1: index, id: "box", index: "div1"}
    </script>
</body>
</html>
```

### 2.8  操作DOM节点

* `document.createElement(tag)` 创建元素节点
* `.appendChlid(e)` 追加子节点
* `.insertBefore(e, 目标节点)` 在目标节点前面插入节点
* `.removeChild(e)`  删除子节点
* `.remove()` 删除自己以及后代节点
* `.replaceChild(新节点, 旧节点)` 替换子节点
* `.cloneNode(bool)` 克隆节点: false-不克隆后代，true-克隆后代

```html
    <div id="box">
        <div id="child">hello,world</div>
    </div>
    <script>
        // .createElement() 创建元素节点
        var odiv = document.createElement("div")
        odiv.innerHTML = "11111111"
        odiv.className = "newDiv"
        odiv.id = "newDiv"
        odiv.style.backgroundColor = "red"
        console.log(odiv)    // <div>我是新创建的div</div>
        // .appendChild(节点对象) 追加子节点
        box.appendChild(odiv)
        // .insertBefore(要插入的节点, 谁的前面)
        box.insertBefore(odiv, child)  // 在 child 之前插入 odiv
        // .removeChild(节点对象) 删除子节点
        //box.removeChild(child)
        // .remove() 删除节点
        //box.remove()  // 删除自己以及后代节点
        // .replaceChild(新节点, 旧节点) 替换子节点, 替换后的节点 odiv2 也会被添加到 box 中
        var odiv2 = document.createElement("div")
        odiv2.innerHTML = "22222222"
        box.replaceChild(odiv2, child)
        // .cloneNode() 克隆节点: false-不克隆后代，true-克隆后代
        var odiv3 = box.cloneNode(true)
        console.log(odiv3)    // <div>22222222</div>
        /* 克隆节点后，id也会被克隆，因此需要重新赋值新的id */
        odiv3.id = "newDiv3"
        console.log(odiv3)    // <div id="newDiv3">22222222</div>
        document.body.appendChild(odiv3)
    </script>
```

#### 案例：动态删除

```html
    <ul id="list"></ul>
    <script>
        var arr = ["111", "222", "333", "444"]
        for (var i = 0; i < arr.length; i++) {
            var oli = document.createElement("li")
            oli.innerHTML = arr[i]

            var obutton = document.createElement("button")
            obutton.innerHTML = "删除"
            obutton.onclick = handler
            oli.appendChild(obutton)
            list.appendChild(oli)
        }

        function handler () {
            console.log(this)         // this：<button>删除</button>
            this.parentNode.remove()  // this 的父节点为 li，即可删除成功
        }
    </script>
```

效果：

![chrome-capture-2025-12-09 (2)](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251209174916.gif)

### 2.9 获取节点类型

* `e.nodeType`  节点类型：1-元素节点，2-属性节点，3-文本节点

![image-20251209175404969](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251209175405.png)

```html
    <div class="box">
        helloworld
        <!-- 注释注释 -->

        <div>111</div>
    </div>
    <script>
        var obox = document.querySelector(".box")
        console.log(obox.childNodes)
        for (var i = 0; i < obox.childNodes.length; i++) {
            var node = obox.childNodes[i]
            console.log(node.nodeType)
            // 元素节点类型，值为 1
            if (node.nodeType === 1) {
                console.log("node:", node)  // <div>111</div>
                console.log(node.nodeType + ":" + node.nodeName + ":" + node.nodeValue)  // 1:DIV:null
            }
        }
        console.log("类型：", obox.childNodes[0].nodeType) // 3
        console.log("值：", obox.childNodes[0].nodeValue)  // \nhelloworld\n
    </script>
```



### 2.10 获取元素尺寸

就是获取元素的“占地面积”。

* `.offsetWidth`，获取的是元素 **内容+padding+border** 的宽度
* `.offsetHeight`，获取的是元素 **内容+padding+border** 的高度

* `.clientWidth`，获取的是元素 **内容+padding** 的宽度
* `.clientHeight`，获取的是元素 **内容+padding** 的高度

注意：

1. 获取到的尺寸是没有单位的数字
2. 当元素在页面不占位置的时候，获取到的是0
   - display: none;  元素在页面不占位
   - 怪异盒子模型，不影响计算结果

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        div{
            width: 100px;
            height: 100px;
            padding: 10px;
            border: 5px solid red;
            background-color: yellow;
            /* box-sizing: border-box; */
            /* display: none; */
        }
    </style>
</head>
<body>
    <div id="box"></div>
    <script>
        // offset* = border + padding + content
        console.log(box.offsetWidth)  // 5 + 10 + 100 + 10 + 5 = 130
        //加上 box-sizing: border-box; 怪异盒子模型后计算方式无影响
        console.log(box.offsetWidth)  // 100

        // client* = padding + content
        console.log(box.clientWidth)  // 120
    </script>
</body>
</html>
```



### 2.11 获取元素的偏移量

* `.offsetLeft`  左侧偏移量（相对定位父级，否则为body）
* `.offsetTop` 顶部偏移量（相对定位父级，否则为body）
* `.clientLeft` 左侧偏移量（相对于左边框==边框尺寸）
* `.clientTop` 顶部偏移量（相对于顶部边框==边框尺寸）

注意：

- 参考点是`定位父级`（最近一层的定位父级）
- 如果父级没有定位，则参考点相对于`body`

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251209183631.png)

### 2.12 获取可视窗口尺寸

* `document.documentElement.clientHeight` 
* `document.documentElement.clientWidth`

对应分别获取浏览器中**可视**窗口的高度和宽度（`不`包含滚动条）

```js
    <script>
        // var windowHeight = window.innerHeight
        console.log(innerHeight)
        // var windowWidth = window.innerWidth
        console.log(innerWidth)

        // DOM:不计算滚动条的宽度
        console.log(document.documentElement.clientHeight)
        console.log(document.documentElement.clientWidth)
    </script>
```



#### 案例：懒加载（滚动加载）

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        html,body{
            height: 100%;
        }
        ul {
            list-style: none;
        }
        ul li{
            overflow: hidden;
            height: 150px;
        }
        ul li img{
            float: left;
            width: 80px;
        }
    </style>
</head>
<body>
    <h1>标题</h1>
    <ul id="list">
        <!-- <li>
            <img src="https://static.maizuo.com/pc/v5/usr/movie/53443bf08ac8f08d23e3fe35959a3240.jpg?x-oss-process=image/quality,Q_70" alt="">
            <h3>测试测试</h3>
        </li> -->
    </ul>
    <script>
        var arr1 = [
            {
                name: "疯狂动物城",
                url: "https://static.maizuo.com/pc/v5/usr/movie/53443bf08ac8f08d23e3fe35959a3240.jpg?x-oss-process=image/quality,Q_70"
            },
            {
                name: "疯狂动物城",
                url: "https://static.maizuo.com/pc/v5/usr/movie/53443bf08ac8f08d23e3fe35959a3240.jpg?x-oss-process=image/quality,Q_70"
            },
            {
                name: "疯狂动物城",
                url: "https://static.maizuo.com/pc/v5/usr/movie/53443bf08ac8f08d23e3fe35959a3240.jpg?x-oss-process=image/quality,Q_70"
            },
            {
                name: "疯狂动物城",
                url: "https://static.maizuo.com/pc/v5/usr/movie/53443bf08ac8f08d23e3fe35959a3240.jpg?x-oss-process=image/quality,Q_70"
            },
            {
                name: "疯狂动物城",
                url: "https://static.maizuo.com/pc/v5/usr/movie/53443bf08ac8f08d23e3fe35959a3240.jpg?x-oss-process=image/quality,Q_70"
            }
        ]
        var arr2 = [
            {
                name: "速度与激情8",
                url: "https://static.maizuo.com/pc/v5/usr/movie/7767b643a38cbaf714aaea55f5c44053.jpg?x-oss-process=image/quality,Q_70"
            },
            {
                name: "速度与激情8",
                url: "https://static.maizuo.com/pc/v5/usr/movie/7767b643a38cbaf714aaea55f5c44053.jpg?x-oss-process=image/quality,Q_70"
            },
            {
                name: "速度与激情8",
                url: "https://static.maizuo.com/pc/v5/usr/movie/7767b643a38cbaf714aaea55f5c44053.jpg?x-oss-process=image/quality,Q_70"
            },
            {
                name: "速度与激情8",
                url: "https://static.maizuo.com/pc/v5/usr/movie/7767b643a38cbaf714aaea55f5c44053.jpg?x-oss-process=image/quality,Q_70"
            },
            {
                name: "速度与激情8",
                url: "https://static.maizuo.com/pc/v5/usr/movie/7767b643a38cbaf714aaea55f5c44053.jpg?x-oss-process=image/quality,Q_70"
            }
        ]

        // 进入页面先渲染一次数据
        renderHTML(arr1)
        function renderHTML(arr) {
            // += 操作可能会导致浏览器闪烁渲染
            // list.innerHTML += arr.map(function (item) {
            //     return `<li>
            //                 <img src="${item.url}" alt="">
            //                 <h3>${item.name}</h3>
            //             </li>`
            // }).join("")
            
            // .appendChild() 追加 - 【推荐】
            for (var i = 0; i < arr.length; i++) {
                var oli = document.createElement("li")
                oli.innerHTML = `<img src="${arr[i].url}" alt="">
                            <h3>${arr[i].name}</h3>`
                list.appendChild(oli)
            }
        }

        // 防频繁触发标记：触发时设置为true，但是渲染新数据后需要重置为false-为下一次渲染准备使用
        isLoading = false
        window.onscroll = function() {
            var listHeight = list.offsetHeight  // ul 的高度
            var listTop = list.offsetTop        // ul 距离body顶部的高度
            console.log(listHeight + listTop)

            var windowHeight = document.documentElement.clientHeight   // 视窗高度
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop  // 滚动距离
            console.log(Math.round(windowHeight + scrollTop))

            if (isLoading) return
            // 计算到底的公式：(列表高度+列表距离body顶部的高度) - (视窗高度+滚动距离) < 50或100
            if ((listHeight + listTop) - Math.round(windowHeight + scrollTop) < 50) {
                console.log("滚动到底了！！！ < 50px")
                isLoading = true

                //渲染下一组数据（模拟接口延时1s）
                setTimeout(() => {
                    renderHTML(arr2)
                    isLoading = false
                }, 1000);
            }
        }
    </script>
</body>
</html>
```

效果（右侧滚动条会额外加载，[效果参考](https://m.maizuo.com/v5/#/films/nowPlaying)）:

![chrome-capture-2025-12-09 (3)](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251209194824.gif)

























