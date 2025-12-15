---
title: 09-jQuery库
date: 2018-5-7 15:21:05
tags:
- jQuery
categories: 
- 04_大前端
- 03_JavaScript
---

![image-20251125100829463](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251128131801.png)

参考资料：

* jQuery官网下载：https://jquery.com/download/
* jQuery在线实例：https://www.runoob.com/jquery/jquery-examples.html
* jQuery参考手册：https://www.runoob.com/jquery/jquery-ref-selectors.html
* jQuery-API手册：https://www.runoob.com/manual/jquery/

> jQuery 是一个前端`库`(不是框架)，也是一个方法库。
>
> 优点：
>
> * 优质的选择器和筛选器
> * 好用的隐式迭代
> * 强大的链式编程
>
> 因为这些，很多东西就可以一行代码解决。



## 1. jQuery下载

方法一：官网下载

方法二：从百度上`偷`一个稳定版本 [手动狗头]

![image-20251215171850650](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251215171851.png)

```js
https://pss.bdstatic.com/static/superman/js/lib/jquery-1-edb203c114.10.2.js
```

试一试：

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <title>jQuery</title>
    <!-- 从百度拿过来的：jquery-1-edb203c114.10.2.js -->
    <script src="./lib/jquery.js"></script>
</head>
<body>
    <script>
        console.log($)
        console.log(jQuery)
        console.log($ === jQuery)   // true
    </script>
</body>
</html>
```



## 2. jQuery选择器

### 基本选择器

```js
$("ul li")    // 返回伪数组
$("#box")     // 返回伪数组，哪怕是一个元素
$("ul li:nth-child(1)")  // css选择器都支持
```



### 特殊选择器

```js
$("ul li:first")         // 第一个元素
$("ul li:last")          // 最后一个元素
var index = 2
$(`ul li:eq(${index})`)  // 第三个元素，支持模版字符串
$("ul li:odd")   // 偶数元素
$("ul li:even")  // 奇数元素
```



### 筛选选择器

```js
$("ul li").first()   // 筛选第一个元素
$("ul li").first().next()   // 链式调用：筛选第二个元素
$("ul li").last()    // 筛选最后一个元素
$("ul li").eq(2)    // 筛选第三个元素
$("ul li.active").next()  // active元素的下一个元素
$("ul li.active").nextAll()  // active元素后的所有元素
$("ul li.active").nextAll(".a")  // active元素后的所有元素
$("ul li.active").nextUntil(".end")  // active元素后的所有元素
$("ul li.active").prev()  // active元素的上一个元素，同理 next

$("ul li.active").parent()  // 父节点
$("ul li.active").parents() // 所有祖先节点：ul body html

$("ul").children()  // 所有的子节点

$("ul li.active").siblings()  // 自己的前后兄弟节点（不含自己）

$("ul").find("li.active")  // 查找节点

$("ul li.active").index()  // 2, 获取节点索引
```



## 3. 操作样式

### 3.1 css() 方法

* `css("属性")`  获取样式的值
* `css("属性", "值")`  设置样式
* `css({属性:值, 属性:值, ...})`  批量设置样式

```js
    <script>
        // css()
        console.log($("#box").css("width"));      //200px
        console.log($("#box").css("height"));     //100px
        console.log($("#box").css("background-color"));   //rgb(255, 255, 0)
        $("#box").css("width", "300px")
        $("#box").css("height", 200)
        $("#box").css("background", "red")
        
        $("ul li").css("color", "blue")  //隐式迭代，自动循环迭代多个
        $("ul li:eq(3)").css({width:200, height:100, backgroundColor: "yellow"})  //给单个设置样式
    </script>
```



### 3.2 addClass() 方法

* `addClass()`   添加样式类
* `removeClass()` 移除样式类
* `hasClass()` 是否包含样式类
* `toggleClass()` 切换样式类：有就移除，无就添加

> 注意：有隐式迭代的效果，会批量给设置。

```js
<head>
    <script src="./lib/jquery.js"></script>
    <style>
        .active{
            color: red;
            background: yellow;
        }
    </style>
</head>
<body>
    <div id="box">active</div>
    <ul>
        <li class="active">001</li>
        <li>002</li>
        <li>003</li>
    </ul>
    <script>
        // addClass()
        $("#box").addClass("active")
        //$("#box").removeClass("active")

        // $("ul li").addClass("active")
        // 先全部移除，再给点击的元素添加样式
        $("ul li").removeClass("active").eq(1).addClass("active")  //链式调用，可以用于点击事件
        // 或者先加样式，再移除其他元素样式
        $("ul li").eq(2).addClass("active").siblings().removeClass("active")

        // hasClass
        console.log($("ul li:eq(2)").hasClass("active"))

        // toggleClass: 切换，无就加，有就移除
        $("ul li:eq(1)").toggleClass("active")
    </script>
</body>
```



## 4. 操作内容

* `html()` 等价于 innerHTML，获取或设置带html标签的内容
* `text()` 等价于 innerText，获取或设置纯文本的内容 - 不解析html标签
* `val()` 等价于 value

```js
    <div id="box">
        <div>
            11111
            <p>2222<span>3333</span></p>
        </div>
    </div>
    <ul class="list1"></ul>
    <ul class="list2"></ul>
    <input type="text" id="username">
    <script>
        console.log($("#box").html())
        var arr = ["aaa", "bbb", "ccc"]
        var listr = arr.map(item => `<li>${item}</li>`).join("")
        $("ul.list1").html(listr)

        console.log($("#box").text())
        $("ul.list2").text(listr)

        username.onblur = function() {
            console.log($("#username").val())
        }
        $("#username").val("请输入用户名...")
    </script>
```



## 5. 操作属性

* `attr()` 可以操作原生或自定义属性，不成文规范，最好`只用于操作 自定义属性`
  * 总结：都用 attr 也能解决所有的属性操作需求。
* `prop()` 可以操作原生属性，`只能用于操作 原生属性`
  * 原因：*prop 可以设置到对象身上的属性，但不是在标签身上；移除同理。*其他的能力与 attr 一样。

```js
    <div id="box" index="1">1111</div>
    <button id="btn">按钮</button>
    <script>
        console.log($("#box").attr("id"))            //获取原生属性
        console.log($("#box").attr("id", "box2"))    //设置原生属性

        console.log($("#box2").attr("index"))        //获取自定义属性
        console.log($("#box2").attr("index", "2"))   //设置自定义属性

        console.log($("#box2").removeAttr("index"))  //移除自定义属性
        console.log($("#box2").removeAttr("id"))     //移除原生属性

        console.log($("#btn").attr("disabled", true))//设置禁用
    </script>
```



## 6. 获取偏移量

* `offset()`  距离文档流左上角的left，top，如果传参就是设置
* `position()` 距离有定位元素左上角的left，top

```js
$("#box").offset()     // {top:50, left:50}
$("#box").offset({
    left: 100,
    top: 100
})
```



## 7. 获取元素尺寸

* `width() / height()`  元素内容的宽、高
* `innerWidth() / innerHeight()` 元素内容的宽、高（+padding）
* `outerWidth() / outerHeight()` 元素内容的宽、高（+padding+border）
* `outerWidth(true) / outerHeight(true)` 元素内容的宽、高（+padding+border+margin）



## 8.操作事件

* `on()` 每次都会触发的事件，常用的方法函数
  * `.click(func(){...})`  对应 `on("click", function(){...})`  并且支持链式调用
  * 链式调用示例：`$("#div").mousedown(function() {...}).mouseup(function() {...})`
* `one()` 一次性事件
* `off()` 解绑事件（不传参数-解绑所有事件，传参-解绑参数对应的事件）
  * `off(事件, 要处理的函数)` 对多个绑定事件时，可以针对要解绑的函数进行解绑

```js
$("ul li").on("click", function() {
    console.log("点击了")
})
// on - 事件委托（解决后续动态加入的节点也可以生效绑定的事件）
$("ul").on("click", "button", function() {
    console.log("点击了", this)  //当前事件元素 button
})
// on - 传参数（必须是对象）
$("ul").on("click", {name: "jerry"}, function(e) {
    console.log("点击了", e)
})
// on - 事件委托 + 传参数（第三个参数此时不区分对象或字符串）
$("ul").on("click", "button", {name: "jerry"}, function(e) {
    console.log("点击了", e)  //当前事件元素 button
})
```

```js
$("ul").one("click", "button", function() {
    console.log("点击了", this)  //当前事件元素 button
})
```

```js
$("ul li").off("click")  //解绑事件
```



> 转jQuery 对象：
>
> * document >> $(document)
> * this >> $(this)

## 案例：选项卡jquery改造

核心js改造点：2行代码搞定

```js
    <script>
        $(".header li").click(function() {
            $(this).addClass("active").siblings().removeClass("active")
            $(".box li").eq($(this).index()).addClass("active").siblings().removeClass("active")
        })
    </script>
```

完成代码：

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
        ul {
            list-style: none;
        }
        .header {
            display: flex;
            width: 600px;
        }
        .header li{
            flex: 1;
            border: 1px solid #ccc;
            height: 50px;
            line-height: 50px;
            text-align: center;
        }
        .box {
            position: relative;
            width: 600px;
        }
        .box li{
            position: absolute;
            left: 0;
            top: 0;
            width: 600px;
            height: 100px;
            line-height: 100px;
            text-align: center;
            background: yellow;

            display: none;
        }
        .box .active{
            background: yellow;
            display: block;
        }
        .header .active {
            background: red;
        }
    </style>
    <script src="./lib/jquery.js"></script>
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
        $(".header li").click(function() {
            $(this).addClass("active").siblings().removeClass("active")
            $(".box li").eq($(this).index()).addClass("active").siblings().removeClass("active")
        })
    </script>
</body>
</html>
```

效果一样：

![chrome-capture-2025-12-09 (1)](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251209153227.gif)



## 9. trigger触发事件

* `trigger("click")`  自动触发点击事件（不需要人的鼠标点击了）

> 用于完成一些浏览器控制台自动化去执行一些工作，经典就是浏览器插件，如 油猴插件。

比如设置定时器，在页面控制台上执行，就可以一直自动化，比如抢票。

示例：（在百度上搜索我的笔记）

```js
$("#chat-textarea").val("姜源の云笔记");
setTimeout(function() {
    //$("#form ul li").eq(4).trigger("click")
    $("#chat-submit-button").trigger("click")
}, 2000)
```















更多内容参考其他关于 jQuery 的章节，此处不再赘述...

























