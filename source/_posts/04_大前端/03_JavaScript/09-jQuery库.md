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
* jQuery插件库：https://owlcarousel2.github.io/OwlCarousel2/
* swiper轮播库：https://swiper.com.cn/

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



### 3.2 xxxClass() 方法

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

### 案例：选项卡jquery改造

引入jquery

```js
<script src="./lib/jquery.js"></script>
```

核心js改造点：2行代码搞定

```js
    <script>
        $(".header li").click(function() {
            $(this).addClass("active").siblings().removeClass("active")
            $(".box li").eq($(this).index()).addClass("active").siblings().removeClass("active")
        })
    </script>
```

完整代码：

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

### 案例：鼠标跟随jquery改造

引入jquery

```
<script src="./lib/jquery.js"></script>
```

核心代码：

```html
    <script>
        $("#box").mouseover(function() {
            $(this).children("p").css("display", "block")
        })
        $("#box").mouseout(function() {
            $(this).children("p").css("display", "none")
        })
        $("#box").mousemove(function(evt) {
            $(this).children("p").offset({
                left: evt.pageX + 10,
                top: evt.pageY + 10
            })
        })
    </script>
```

完整代码：

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
        #box, #box2 {
            width: 200px;
            height: 100px;
            background: yellow;
            position: relative;
        }
        #box p{
            width: 300px;
            height: 200px;
            background: red;
            position: absolute;
            left: 100px;
            top: 100px;
            display: none;

            /* 穿透，防止鼠标移动时闪烁 */
            pointer-events: none;

            /* 提高鼠标跟随显示内容的层级，高一点防止被其他内容遮挡 */
            z-index: 100;
        }
    </style>
    <script src="./lib/jquery.js"></script>
</head>
<body>
    <div id="box">
        我的头像
        <p>我的介绍信息：这家伙不懒，留下了一堆信息。</p>
    </div>
    <br>
    <div id="box2">其他内容</div>

    <script>
        // box.onmouseover = function() {
        //     console.log("鼠标移入")
        //     this.firstElementChild.style.display = "block"
        // }
        // box.onmouseout = function() {
        //     console.log("鼠标移出")
        //     this.firstElementChild.style.display = "none"
        // }
        // box.onmousemove = function(evt) {
        //     this.firstElementChild.style.left = evt.offsetX + 10 + "px"
        //     this.firstElementChild.style.top = evt.offsetY + 10 + "px"
        // }
        $("#box").mouseover(function() {
            $(this).children("p").css("display", "block")
        })
        $("#box").mouseout(function() {
            $(this).children("p").css("display", "none")
        })
        $("#box").mousemove(function(evt) {
            $(this).children("p").offset({
                left: evt.pageX + 10,
                top: evt.pageY + 10
            })
        })
    </script>
</body>
</html>
```





## 9. trigger触发事件(★)

* `trigger("click")`  自动触发点击事件（不需要人主动点击鼠标了）

> 用于完成一些浏览器控制台自动化去执行一些工作，经典的就是浏览器插件、自动化插件等，如 油猴。

比如设置定时器，在页面控制台上执行，就可以一直自动化，比如抢票。

示例：（在百度上搜索我的笔记）

```js
$("#chat-textarea").val("姜源の云笔记");
setTimeout(function() {
    //$("#form ul li").eq(4).trigger("click")
    $("#chat-submit-button").trigger("click")
}, 2000)
```



## 10. 操作动画

* 基本动画，参数都是三个：(动画执行时间，动画效果，动画执行完后回调函数)
  * `show() / hide() / toggle()` 显示/隐藏/切换
  * `slideDown() / slideUp() / slideToggle()` 卷轴显示/卷轴隐藏/切换
  * `fadeIn() / fadeOut() / fadeToggle()` 渐出/渐隐/切换

* 综合动画，①不支持过度的样式 ②不支持颜色变化 ③不支持transform变形
  * `animate()`  参考：https://www.runoob.com/jquery/jquery-animate.html
  * `stop() / finish()` 停止/打断动画，一般在其他动画函数之前调用
    * stop，运动到哪里，就停在哪里
    * finish，运动到哪里，就立即到完成位置

语法：

```js
$("#myShow").click(function() {
    $("#box").show(500, "linear", function() {
        alert("显示完毕！")
    })
})
```

示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="./lib/jquery.js"></script>
    <style>
        #box{
            width: 200px;
            height: 200px;
            background: yellow;
        }
    </style>
</head>
<body>
    <button id="myShow">显示</button>
    <button id="myHide">隐藏</button>
    <button id="myTogg">切换</button>
    <div id="box"></div>

    <script>
        $("#myShow").click(function() {
            $("#box").show(500, "linear", function() {
                alert("显示完毕！")
            })
        })
        $("#myHide").click(function() {
            $("#box").hide(500, "linear", function() {
                alert("隐藏完毕！")
            })
        })
        $("#myTogg").click(function() {
            $("#box").toggle(500, "linear", function() {
                alert("切换完毕")
            })
        })
    </script>
</body>
</html>
```

### 案例：树状菜单jquery实现

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="./lib/jquery.js"></script>
    <style>
        ul,ol{
            list-style: none;
        }
        li::before{
            content: "+";
        }
        li.active::before{
            content: "-";
        }
        ol{
            display: none;
        }
    </style>
</head>
<body>
    <ul>
        <li class="active">菜单111
            <ol>
                <li>111-1</li>
                <li>111-2</li>
                <li>111-3</li>
            </ol>
        </li>
        <li>菜单222
            <ol>
                <li>222-1</li>
                <li>222-2</li>
                <li>222-3</li>
            </ol>
        </li>
        <li>菜单333
            <ol>
                <li>333-1</li>
                <li>333-2</li>
                <li>333-3</li>
            </ol>
        </li>
    </ul>

    <script>
        // 允许同时展开
        // $("ul>li").click(function(){
        //     $(this).toggleClass("active").children("ol").slideToggle(200)
        // })
        // 只允许一个展开：给ul下的所有li绑事件
        $("ul li").click(function(){
            $(this).toggleClass("active").children("ol").slideToggle(200)
            $(this).siblings().removeClass("active").children("ol").slideUp(200)
            //阻止冒泡到父元素
            return false
        })
    </script>
</body>
</html>
```

效果：

![chrome-capture-2025-12-16](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251216102523.gif)

### 案例：手风琴效果jquery实现

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="./lib/jquery.js"></script>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        ul {
            width: 640px;
            height: 200px;
            margin: 5px;
            border: 5px solid skyblue;
            display: flex;
        }
        ul li{
            width: 160px;
            overflow: hidden;
        }
        /* 可以换成具体的图片，图片大小固定640x200即可 */
        ul>li>div{
            width: 640px;
            height: 200px;
        }
    </style>
</head>
<body>
    <ul>
        <li>
            <div style="background: red;"></div>
        </li>
        <li>
            <div style="background: yellow;"></div>
        </li>
        <li>
            <div style="background: blue;"></div>
        </li>
        <li>
            <div style="background: green;"></div>
        </li>
    </ul>
    <script>
        $("ul li").mouseover(function(){
            // 自己变520，兄弟变40
            $(this).stop().animate({
                width: 520
            }).siblings().stop().animate({
                width: 40
            })
        })

        // mouseleave 不会冒泡到ul身上，性能比 mouseout 好
        $("ul").mouseleave(function(){
            //console.log("mouseout")  //冒泡会频繁执行 mouseout
            $("ul li").stop().animate({
                width: 160
            })
        })
    </script>
</body>
</html>
```

效果：

![chrome-capture-2025-12-16 (1)](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251216104016.gif)

### 案例：滑动选项卡jquery实现

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="./lib/jquery.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
        }

        ul {
            list-style: none;
            margin: 10px;
            display: flex;
            position: relative;
        }

        ul li {
            height: 50px;
            line-height: 50px;
            text-align: center;
            width: 100px;
            z-index: 100;
            /* 提高层级，不被盖住 */
        }

        ul div {
            position: absolute;
            top: 0;
            left: 0;
            width: 100px;
            height: 50px;
            background: skyblue;
            border-bottom: 3px solid red;
        }

        ul li a {
            text-decoration: none;
            color: inherit;
        }
    </style>
</head>

<body>
    <ul>
        <li><a href="">菜单001</a></li>
        <li><a href="">菜单002</a></li>
        <li><a href="">菜单003</a></li>
        <li><a href="">菜单004</a></li>
        <li><a href="">菜单005</a></li>
        <!-- 单独加个样式进行定位 -->
        <div></div>
    </ul>
    <script>
        $("ul li").mousemove(function () {
            $("ul div").stop().animate({
                left: $(this).index() * 100
            }, 100)
        })
    </script>
</body>

</html>
```

效果：

![chrome-capture-2025-12-16 (2)](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251216105404.gif)



## 11. 操作节点

* `append / appendTo(#) / prepend / prependTo(#)`  内部插入往后追加 / 往前追加
* `before / insertBefore(#) / after / insertAfter(#)` 兄弟插入往前追加 / 往后追加
* `remove / empty` 删除节点 / 清空子节点
* `replaceWith / replaseAll(#)` 替换所有节点
* `clone` 克隆节点（包含父子节点）
  * clone(true)  克隆节点（包含父子节点+**父子事件**）
  * clone(true, flase) 克隆节点 （包含父子节点+**父事件**） 不克隆子节点事件

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="./lib/jquery.js"></script>
</head>
<body>
    <div id="box">
        <div>1111111</div>
        <span>aaaaaaaaaaa</span>
        <div>2222222</div>
    </div>
    <hr>
    <div id="center"></div>
    <script>
        // 创建、插入、删除、替换、克隆
        // 创建+box内部插入 append-往后追加，prepend-往前追加
        var odiv1 = $("<div>hello</div>")
        $("#box").append(odiv1)
        var odiv1 = $("<div>").html("<b>first div</b>").addClass("active").css("background", "red")
        $("#box").append(odiv1)

        // 链式插入（box内部插入） appendTo(#)-追加到后面，prependTo(#)-追加到前面
        $("<div>").html("<b>first div</b>").addClass("active").css("background", "red").appendTo($("#box"))

        // 兄弟位置插入 before/insertBefore(#)-前面插入，after/insertAfter(#)-后面插入
        var odiv2 = $("<div>兄弟节点</div>")
        $("#box").before(odiv2)
        $("<div>兄弟节点2</div>").insertBefore($("#box"))

        // 删除节点，remove-删除自己
        // $("#box div").eq(0).remove()
        // 清空自己，empty-清空
        // $("#box").empty()   // 等价于 $("#box").html("")

        // 替换节点，replaceWith/replaseAll(#)-替换节点
        var odiv3 = $("<div>新的节点</div>")
        $("#box span").replaceWith(odiv3)     // 等价于 odiv3.replaceAll($("#box span"))

        // 克隆 clone(true) true-事件也克隆，空则不克隆事件，.prop()改变id
        // clone(true, false) 父事件克隆，子事件不克隆
        $("#box").click(function(){
            console.log("点击事件")
        })
        $("#box").clone(true).prop("id", "box2").css("color", "blue").insertAfter($("#center"))
    </script>
</body>
</html>
```



## 12. 操作ajax

### 12.1 get/post

* `$.get(URL,callback)`  或 `$.get( URL [, data ] [, callback ] [, dataType ] )` 也支持promise风格
* `$.post(URL,callback);` 或  `$.post( URL [, data ] [, callback ] [, dataType ] )` 也只是promise风格
* 综合请求：

```js
$.ajax({
    url: "./api",       //必填，请求地址
    type: "GET",        //选填，请求方式，默认GET（忽略大小写）
    headers: {},        //选填，请求头，如 "content-type": "application/json"
    data: {},           //选填，发送请求携带的参数
    dataType: "json",   //选填，期望返回值的类型
    async: true,        //选填，是否异步，默认是true
    success() {},       //选填，成功的回调函数
    error() {},         //选填，失败的回调函数
    cache: true,        //选填，是否缓存，默认是true
    context: div,       //选填，回调函数中的this指向，默认是ajax对象
    status: {},         //选填，根据对应的状态码进行函数执行
    timeout: 1000       //选填，超时时间
}).then(res => {
    console.log(res)    //可选，promise风格
}).cache(err => {
    console.log(err)    //可选，promise风格
})
```



### 12.2 jsonp

* 发送 jsonp 请求

```js
$.ajax({
    url: './jsonp.api',
    dataType: 'jsonp',
    data: {},
    success(res) { console.log(res) },
    jsonp: 'cb',            // jsonp请求的时候回调函数的 key
    jsonpCallback: 'fn'     // jsonp请求的时候回调函数的 名称
})
```

如百度的搜索联想词api改造：

![image-20251216121523843](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251216121525.png)



### 12.3 钩子函数

`钩子函数`，在 ajax 的整个过程中的某一个阶段执行的函数，每一个 ajax 请求都会触发。

* `ajaxStart` 当前页面作用域`第一个`请求 **开始** 的时候就会触发这个函数
* `ajaxSend` 每一个请求在 **准备send之前** 都会触发这个函数
* `ajaxSuccess` 每一个请求在 **成功后** 都会触发这个函数
* `ajaxError` 每一个请求在 **失败后** 都会触发这个函数
* `ajaxComplete` 每一个请求在 **成功或失败后** 都会触发这个函数
* `ajaxStop` 当前页面作用域`最后一个`请求 **结束** 的时候就会触发这个函数

应用场景：

* loading 显示与隐藏，可以在 ajaxStart 与 ajaxStop 中使用

```js
$(window).ajaxStart(function() {
    console.log("第一个请求开始了")
    console.log("显示loading")
    $("#loading").css("display", "block")    
})
```

```js
$(window).ajaxStop(function() {
    console.log("最后一个请求结束了")
    console.log("隐藏loading")
    $("#loading").css("display", "none")
})
```

* 实用习惯 `$(function() {...})`，页面资源加载完之后的钩子函数

```js
    <script>
        // window.onload = func(){} 操作在 jquery 有等价操作 $(window).ready(func(){}), 下方是简写
        $(function() {
            // 所有的dom节点加载完后会执行的钩子函数
            console.log("jquery的钩子函数")
        })
    </script>
```



### 案例：loading加载显示隐藏控制

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="./lib/jquery.js"></script>
    <style>
        #loading{
            width: 100%;
            height: 100%;
            position: fixed;
            display: none;
            background-color: rgba(0, 0, 0, 0.5);
            left: 0;
            top: 0;
        }
        #loading div{
            width: 100px;
            height: 100px;
            line-height: 100px;
            background: white;
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto;
        }
    </style>
    <!-- 钩子函数尽量放在最前的位置 -->
    <script>
        /* 页面第一个请求和最后一个请求之间显示 loading */
        $(window).ajaxStart(function() {
            console.log("显示loading")
            $("#loading").css("display", "block")
        })
        $(window).ajaxStop(function() {
            console.log("隐藏loading")
            $("#loading").css("display", "none")
        })
    </script>
    <script>
        // 所有的外部资源(图片/js/css/dom) 加载完之后会执行
        // window.onload = function() {
        //     console.log()
        // }
        
        // jquery 的等价操作 $(window).ready(func), 下方是简写
        // $(window).ready(function() {
        $(function() {
            // 所有的dom节点加载完后会执行的钩子函数
            console.log("jquery的钩子函数")
        })
    </script>
</head>

<body>
    <button id="btn">获取数据</button>
    <ul id="myList"></ul>
    <div id="loading">
        <!-- 换成图片即可 -->
        <div>正在加载中...</div>
    </div>
    <script>
        btn.onclick = function() {
            $.ajax({
                url: "https://api.pearktrue.cn/api/dailyhot/?title=百度",
                success(res) {
                    render(res)
                }
            })
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
</body>

</html>
```

效果：

![chrome-capture-2025-12-16 (3)](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251216125726.gif)





## 13. 深浅拷贝

### 13.1 浅拷贝

```js
// 浅拷贝
var obj1 = { name: "jerry", location: { country: "china", city: "zz" } }
var obj2 = {}
for (var i in obj1) {
    obj2[i] = obj1[i]
}
obj2.name = "tom"
console.log(obj1, obj2)
var obj3 = { ...obj1 }
obj3.name = "lucy"
console.log(obj3)
obj3.location.city = "sz"
console.log(obj3);         // obj1 obj2 obj3复杂对象内部对象都被修改为了 sz
```



### 13.2 深拷贝-递归与JSON方法

```js
// 深拷贝方式：①deepCopy 递归方法   ② JSON.parse(JSON.stringify(source))
var o1 = {
    name: "jerry",
    location: { country: "china", city: "zz" },
    a: { b: { c: 1 } },
    hobby: ["xxx", "yyy", "zzz"]
}
var o2 = {}
// for 循环 + 递归 解决
function deepCopy(target, source) {
    for (let i in source) {
        // 判断复杂类型: Object.prototype.toString() === "[object Object]" 顶层对象原型上的方法
        // ? 如果空字段或未定义字段就不去 toString()，直接进行判断; 使用 .call() 替代方案
        // if (source[i]?.toString() === "[object Object]") {
        if (Object.prototype.toString.call(source[i]) === "[object Object]") {
            target[i] = {}  // 初始化为空对象
            deepCopy(target[i], source[i])
        }
        // 判断数组类型: Object.prototype.toString.call(arr) === "[object Array]"
        else if (Object.prototype.toString.call(source[i]) === "[object Array]") {
            target[i] = []  // 初始化为空数组
            deepCopy(target[i], source[i])
        }
        // 简单对象类型
        else {
            target[i] = source[i]
        }
    }
}
deepCopy(o2, o1)
o2.a.b.c = 2
o2.hobby[0] = "aaa"
console.log(o1, o2);
console.log("--------------------");


// 使用 JSON 的方法，缺点：如果字段值中有 undefined 类型时，字段就会丢失了
var o3 = JSON.parse(JSON.stringify(o1))
o3.a.b.c = 3
o3.hobby[0] = "bbb"
console.log(o1, o3);
```

### 13.3 深拷贝-jquery

* `$.extend([true, ]target, source)` 将source对象深拷贝到target对象，**true-深拷贝**(不传默认浅拷贝)

```js
// jQuery 浅拷贝
var jqo1 = {}
$.extend(jqo1, o1)
jqo1.hobby[0] = "jqjqjqjqjq"
console.log(o1, jqo1); // 两个都受到修改影响
```

```js
// jQuery 深拷贝
var jqo2 = {}
$.extend(true, jqo2, o1)
jqo2.hobby[0] = "jqo2jqo2"
console.log(o1, jqo2);  // 不受修改影响
```



## 14. 多库并存

```js
$.noConflict()               // 交出 $ 符
let jq = $.noConflict(true)  // 交出 $ 符 和 jQuery，赋值给 jq
jq.ajax({...})
```



## 15. 扩展机制

* `$.extend({...})`  可以扩展自己定义的方法，与jquery一样实现链式调用

```html
    <input type="checkbox" name="" id="">aaa
    <input type="checkbox" name="" id="">bbb
    <input type="checkbox" name="" id="">ccc
    <input type="checkbox" name="" id="">ddd
    <script>
        $.extend({
            // 扩展自定义函数
            jerry: function () {
                console.log("jerry...")
            },
            // 扩展为递归函数时，内部需要使用 this.
            deepCopy(target, source) {
                for (let i in source) {
                    if (Object.prototype.toString.call(source[i]) === "[object Object]") {
                        target[i] = {}  // 初始化为空对象
                        this.deepCopy(target[i], source[i])
                    } else if (Object.prototype.toString.call(source[i]) === "[object Array]") {
                        target[i] = []  // 初始化为空数组
                        this.deepCopy(target[i], source[i])
                    } else {
                        target[i] = source[i]
                    }
                }
            }
        })
        $.jerry()  //jerry...
        
        var o1 = {
            name: "jerry",
            location: { country: "china", city: "zz" },
            a: { b: { c: 1 } },
            hobby: ["xxx", "yyy", "zzz"],
            description: undefined
        }
        var o2 = {}
        $.deepCopy(o2, o1)
        o2.a.b.c = 2
        console.log(o1, o2)

        // 挂载元素集合上的链式调用
        //$("").css().addClass().jerry().attr()

        // $.fn.extend({
        //     jerry() {
        //         //...
        //     }
        // })
        /* 上下函数，两者等价 */
        // $.extend($.fn, function() {
        //     //...
        // })

        $.extend($.fn, {
            allChecked(isChecked) {
                // console.log(this)
                this.prop("checked", isChecked)
                // 返回 this 为了支持与 jquery 一样的链式调用
                return this
            }
        })
        $("input[type=checkbox]").allChecked(true).css({
            width: 20,
            height: 20
        })
    </script>
```



### 案例：自定义选项卡插件

原则：

1. dom必须符合插件要求
2. 样式需要引入
3. js引入，并初始化

```html
文件结构：
tabs/
--tabs.css
--tabs.js
```

tabs.css

```css
* {
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

.header li {
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

.box li {
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

.box .active {
    background: yellow;
    display: block;
}

.header .active {
    background: red;
}
```

tabs.js

```js
// 自定义插件：选项卡
$.fn.extend({
    tabs: function (index) {
        var oli = this.find(".header li")
        var obox = this.find(".box li")
        oli.eq(index).addClass("active")
        obox.eq(index).addClass("active")
        oli.click(function () {
            $(this).addClass("active").siblings().removeClass("active")
            obox.eq($(this).index()).addClass("active").siblings().removeClass("active")
        })
    }
})
```

tabs.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- 引入自定义的css -->
    <link rel="stylesheet" href="./tabs/tabs.css">
    <!-- 引入jQuery - 因为依赖 -->
    <script src="./lib/jquery.js"></script>
    <!-- 引入自定义的js -->
    <script src="./tabs/tabs.js"></script>
</head>

<body>
    <div id="container">
        <ul class="header">
        </ul>
        <ul class="box">
        </ul>
    </div>
    <script>
        // 1.动态获取数据，创建节点
        // 2.初始化数据
        var list = [     //模拟动态数据
            {
                title: "aaa",
                content: "aaa的内容"
            },
            {
                title: "bbb",
                content: "bbb的内容"
            },
            {
                title: "ccc",
                content: "ccc的内容"
            },
            {
                title: "ddd",
                content: "ddd的内容"
            },
            {
                title: "eee",
                content: "eee的内容"
            }
        ]
        var oHeaderLi = list.map(item => `<li>${item.title}</li>`).join("")
        $(".header").html(oHeaderLi)
        var oBoxLi = list.map(item => `<li>${item.content}</li>`).join("")
        $(".box").html(oBoxLi)

        $("#container").tabs(0) // 初始化
    </script>
</body>

</html>
```

![image-20251216163627471](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251216163628.png)



### 案例：引入和使用插件

如 http://owlcarousel2.github.io/OwlCarousel2/docs/started-welcome.html

![image-20251216170548126](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251216170549.png)



carousel.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="./dist/assets/owl.carousel.min.css">
    <link rel="stylesheet" href="./dist/assets/owl.theme.default.min.css">
    <script src="./lib/jquery.js"></script>
    <script src="./dist/owl.carousel.min.js"></script>
</head>

<body>
    <!-- Set up your HTML -->
    <div class="owl-carousel owl-theme owl-loaded">
        <div> <img src="./img/1.jpg"> </div>
        <div> <img src="./img/2.jpg"> </div>
        <div> <img src="./img/3.jpg"> </div>
        <div> <img src="./img/1.jpg"> </div>
        <div> <img src="./img/2.jpg"> </div>
        <div> <img src="./img/3.jpg"> </div>
    </div>

    <script>
        $(".owl-carousel").owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            autoplayTimeout: 3000
        });
    </script>
</body>

</html>
```

效果：

![chrome-capture-2025-12-16 (4)](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251216170649.gif)





## 16. swiper轮播库

官网入口：https://swiper.com.cn/

`使用方法`：https://swiper.com.cn/usage/index.html

下载地址：https://swiper.com.cn/download/index.html#file1

各种轮播：https://swiper.com.cn/demo/index.html

* 找到想要的轮播，新窗口打开，查看源码下 script 的 js 代码去使用。

索引获取：`slideChange(swiper)` https://swiper.com.cn/api/event/405.html



使用示例：（随用随查）

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="./lib/swiper-bundle.min.css">
    <script src="./lib/swiper-bundle.min.js"> </script>
    <style>
        .swiper {
            width: 600px;
            height: 300px;
            background: yellow;
        }
    </style>
</head>

<body>
    <div class="swiper source">
        <div class="swiper-wrapper">
            <div class="swiper-slide">Slide 1</div>
            <div class="swiper-slide">Slide 2</div>
            <div class="swiper-slide">Slide 3</div>
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>

        <!-- 如果需要导航按钮 -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>

        <!-- 如果需要滚动条 -->
        <!-- <div class="swiper-scrollbar"></div> -->
    </div>

    <hr>
    <div class="swiper jerry">
        <div class="swiper-wrapper">
            <div class="swiper-slide">Slide 1</div>
            <div class="swiper-slide">Slide 2</div>
            <div class="swiper-slide">Slide 3</div>
        </div>
    </div>

    <script>
        // 同一页面上有两个就 额外加 class 去new对象即可
        // new Swiper(".source")
        // new Swiper(".jerry")

        var mySwiper = new Swiper('.source', {
            //direction: 'vertical', // 垂直切换选项
            //loop: true, // 循环模式选项

            // 如果需要分页器
            pagination: {
                el: '.swiper-pagination',
            },
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },

            // 如果需要前进后退按钮
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },

            // 如果需要滚动条
            // scrollbar: {
            //     el: '.swiper-scrollbar',
            // },
        })      
    </script>
</body>

</html>
```



swiper数据动态渲染轮播图，示例代码：

```js
    <script>
        $.ajax("http://localhost:3000/banner").then(res => {
            console.log(res)
            render(res)
            // swiper 不能初始化过早
            initSwiper()
        })
        function render(list) {
            let oli = list.map(item => `<div><img src="${item.imgUrl}"></div>`).join("")
            $("swiper-wrapper").html(oli)
        }
        function initSwiper() {
            new Swiper('.jerry', {
                //direction: 'vertical', // 垂直切换选项
                loop: true, // 循环模式选项

                // 如果需要分页器
                pagination: {
                    el: '.swiper-pagination',
                }
            })
        }
    </script>
```









