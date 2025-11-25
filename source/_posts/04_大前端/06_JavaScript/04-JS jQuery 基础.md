---
title: 04-JS jQuery 基础
date: 2018-5-13 21:36:21
tags:
- JavaScript
- JQuery
- 语法
categories: 
- 04_大前端
- 06_JavaScript
---

### 一、引言

#### 1.1 jQuery概述

> jQuery是一个快速、简洁的JavaScript代码库。jQuery设计的宗旨是“Write Less，Do More”，即倡导写更少的代码，做更多的事情。它封装JavaScript常用的功能代码，提供一种简便的JavaScript操作方式，优化HTML文档操作、事件处理、动画设计和Ajax交互。

#### 1.2 jQuery特点

> - 具有独特的链式语法。
> - 支持高效灵活的CSS选择器。
> - 拥有丰富的插件。
> - 兼容各种主流浏览器，如IE 6.0+、FF 1.5+、Safari 2.0+、Opera 9.0+等。

#### 1.3 为什么要用jQuery

> - 目前网络上有大量开源的 JS 框架, 但是 jQuery 是目前最流行的 JS 框架，而且提供了大量的扩展。很多大公司都在使用 jQuery， 例如：Google、Microsoft、IBM、Netflix

### 二、jQuery安装


#### 2.1 直接引用jQuery

> 从 [jQuery.com](http://jquery.com/download/) 官网或从[GitHub](https://github.com/jquery/jquery/releases)下载合适版本（1.x+的版本兼容性更好，最新版本为3.x），放入服务器的合适目录中，在页面中直接引用。
> 
> 有两个版本的 jQuery 可供下载：
>    
> - Production version - 用于实际的网站中，已被精简和压缩。
> - Development version - 用于测试和开发（未压缩，便于可读）。

jQuery 库是一个 JavaScript 文件，使用 HTML 的 `< script src="">< /script>` 标签引用

```html
<head>
	<script src="jquery-1.12.2.min.js"></script>
</head>
```

#### 2.2 CDN引用

##### 2.2.1 什么是CDN？

> CDN的全称是Content Delivery Network，即[内容分发网络](https://baike.baidu.com/item/内容分发网络/4034265) , 使用户就近获取所需内容，降低网络拥塞，提高用户访问响应速度和命中率。

##### 2.2.2 常见 CDN

> 百度 CDN

```html
<script src="https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
```

> 新浪 CDN

```html
<script src="http://lib.sinaapp.com/js/jquery/2.0.2/jquery-2.0.2.min.js"></script>
```

> Google CDN

```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
```

> Microsoft CDN

```html
<script src="http://ajax.htmlnetcdn.com/ajax/jQuery/jquery-1.10.2.min.js"></script>
```

### 三、jQuery语法【★】

#### 3.1 基本使用

> + **`$(匿名函数)`**：表示页面`DOM加载完毕(页面所有标签不含属性)`，则执行，`比onload事件执行早`，并且可以写多个。$是jQuery函数的简写。

```html
<html>
  <head>
     <script src="jquery-1.12.2.min.js"></script>
  </head>
<body>
	 <script>
    	$(function(){
            alert("欢迎使用jQuery1");
        });
     </script>
</body>
</html>
```

> -  **`$(selector).action()`**：通过选取 HTML 元素，并对选取的元素执行某些操作。
>     - 选择符（selector）表示"查找" HTML 元素
>   - jQuery 的 action() 执行对元素的操作

```html
- $(this).hide() - 隐藏当前元素
- $("p").hide() - 隐藏所有 <p> 元素
- $("p.test").hide() - 隐藏所有 class="test" 的 <p> 元素
- $("#test").hide() - 隐藏所有 id="test" 的元素
<html>
  <head>
     <script src="jquery-1.12.2.min.js"></script>
  </head>
</html>
<body>	
     <p>窗前明月光</p>
     <p>疑是地上霜</p>
     <p>举头望明月</p>
     <p>低头思故乡</p>
	 <script>
		$("p").hide();
		$("p.test").hide(); 
		$("#test").hide();
     </script>
</body>
```



#### 3.2 jQuery选择器

> - 元素选择器：jQuery 元素选择器基于元素名选取元素。
>
> - 示例：在页面中选取所有 \<p> 元素

```javascript
$(document).ready(function(){
  $("button").click(function(){
    $("p").hide();
  });
});
```

> -  id选择器：jQuery `#id` 选择器通过 HTML 元素的 id 属性选取指定的元素。
>
> - 页面中元素的 id 应该是唯一的，所以要在页面中选取唯一的元素需要通过 #id 选择器。通过 id 选取元素语法如下：
>

```javascript
$(document).ready(function(){
  $("button").click(function(){
    $("#test").hide();
  });
});
```

> - class选择器：jQuery 类选择器可以通过指定的 `.class` 查找元素。
>
> - 语法如下：

```javascript
$(document).ready(function(){
  $("button").click(function(){
    $(".test").hide();
  });
});
```

> * 属性选择器：jQuery 属性选择器通过 `标签[属性='值']` 来通过属性选择元素。

```js
<script type="text/javascript">
    $(function(){
        $("p[name='test']").hide();
	});
</script>
<body>
	<p name="test">name 的 p 标签</p>
</body>
```



#### 3.3 jQuery事件

| 鼠标事件     | 键盘事件   | 表单事件 | 文档/窗口事件 |
| :------------: | :----------: | :--------: | :-------------: |
| click()      | keypress() | submit() | load()        |
| dblclick()   | keydown()  | change() | resize()      |
| mouseenter() | keyup()    | focus()  | scroll()      |
| mouseleave() |            | blur()   | unload()      |
| hover()      |            |          |               |

> - ######  jQuery 事件方法语法：
>
>
> - 在 jQuery 中，大多数 DOM 事件都有一个等效的 jQuery 方法。
>   - 页面中指定一个点击事件：

```javascript
$("p").click();
```

> 下一步是定义什么时间触发事件。可以通过一个事件函数实现：
>

```javascript
$("p").click(function(){
    // 动作触发后执行的代码!!
});
```

+ 总结：也就是说，不传参数是点击，传参数是设置事件。

> - 常用的 jQuery 事件方法
> - $(document).ready() 方法允许在文档完全加载完后执行函数。该事件方法在 [jQuery 语法](http://www.runoob.com/jquery/jquery-syntax.html) 中已经提到过。

> - click()：当按钮点击事件被触发时会调用一个函数。
> - 该函数在用户点击 HTML 元素时执行。

在下面的实例中，当点击事件在某个 <p> 元素上触发时，隐藏当前的 <p> 元素：

```javascript
$("p").click(function(){
  $(this).hide();
});
```

> - dblclick()：当双击元素时，会发生 dblclick 事件。
>
> - dblclick() 方法触发 dblclick 事件，或规定当发生 dblclick 事件时运行的函数：

```javascript
$("p").dblclick(function(){
  $(this).hide();
});
```

> - mouseenter()：当鼠标指针穿过元素时，会发生 mouseenter 事件。
> - mouseenter() 方法触发 mouseenter 事件，或规定当发生 mouseenter 事件时运行的函数：

```javascript
$("#p1").mouseenter(function(){
    alert('的鼠标移到了 id="p1" 的元素上!');
});
```

> - mouseleave()：当鼠标指针离开元素时，会发生 mouseleave 事件。
>
> - mouseleave() 方法触发 mouseleave 事件，或规定当发生 mouseleave 事件时运行的函数：

```javascript
$("#p1").mouseleave(function(){
    alert("再见，的鼠标离开了该段落。");
});
```

> - mousedown()：当鼠标指针移动到元素上方，并按下鼠标按键时，会发生 mousedown 事件。
>
> - mousedown() 方法触发 mousedown 事件，或规定当发生 mousedown 事件时运行的函数：

```javascript
$("#p1").mousedown(function(){
    alert("鼠标在该段落上按下！");
});
```

> - mouseup()：当在元素上松开鼠标按钮时，会发生 mouseup 事件。
>
> - mouseup() 方法触发 mouseup 事件，或规定当发生 mouseup 事件时运行的函数：

```javascript
$("#p1").mouseup(function(){
    alert("鼠标在段落上松开。");
});
```

> - hover()：hover()方法用于模拟光标悬停事件。
>
> - 当鼠标移动到元素上时，会触发指定的第一个函数(mouseenter);当鼠标移出这个元素时，会触发指定的第二个函数(mouseleave)。

```javascript
$("#p1").hover(
    function(){
        alert("你进入了 p1!");
    },
    function(){
        alert("拜拜! 现在你离开了 p1!");
    }
);
```

> - focus()：当元素获得焦点时，发生 focus 事件。
>
> - 当通过鼠标点击选中元素或通过 tab 键定位到元素时，该元素就会获得焦点。
>   focus() 方法触发 focus 事件，或规定当发生 focus 事件时运行的函数：

```javascript
$("input").focus(function(){
  $(this).css("background-color","#cccccc");
});
```

> - blur()：当元素失去焦点时，发生 blur 事件。
>
> - blur() 方法触发 blur 事件，或规定当发生 blur 事件时运行的函数：

```javascript
$("input").blur(function(){
  $(this).css("background-color","#ffffff");
});
```

### 四、jQuery效果

| 隐藏显示 | 淡入淡出     | 滑动          | 动画/停止动画 |
| :--------: | :------------: | :-------------: | :-------------: |
| hide()   | fadeIn()     | slideUp()     | animate()     |
| show()   | fadeOut()    | slideDown()   | stop()        |
| toggle() | fadeToggle() | slideToggle() |               |
|          | fadeTo()     |               |               |

#### 4.1 隐藏显示

> * hide()：可以使用 hide() 将元素隐藏

```javascript
$("#hide").click(function(){
  $("p").hide();
});
```

> * show()： 可以使用show()将元素显示

```javascript
$("#show").click(function(){
  $("p").show();
});
```

> - toggle()：通过 jQuery，可以使用 toggle() 方法来切换 hide() 和 show() 方法。
> - 显示被隐藏的元素，并隐藏已显示的元素。

```javascript
$("button").click(function(){
  $("p").toggle();
});
```

> 事实上，这三种方法都是有两个参数的：
>

```javascript
$(selector).hide(speed,callback);
$(selector).show(speed,callback);
$(selector).toggle(speed,callback);
```

> - 可选的 speed 参数规定隐藏/显示的速度，可以取以下值："slow"、"fast" 或毫秒。
>
> - 可选的 callback 参数是隐藏或显示完成后所执行的函数名称。

#### 4.2 淡入淡出

> - 通过 jQuery，可以实现元素的淡入淡出效果。
> - jQuery 拥有下面四种 fade 方法：
>   - fadeIn()
>   - fadeOut()
>   - fadeToggle()
>   - fadeTo()

> jQuery fadeIn() 方法：jQuery fadeIn() 用于淡入已隐藏的元素。

```javascript
$(selector).fadeIn(speed,callback);
```

> - 可选的 speed 参数规定效果的时长。它可以取以下值："slow"、"fast" 或毫秒。.
>
> - 可选的 callback 参数是 fading 完成后所执行的函数名称。
> - 了带有不同参数的 fadeIn() 方法：

```javascript
$("button").click(function(){
  $("#div1").fadeIn();
  $("#div2").fadeIn("slow");
  $("#div3").fadeIn(3000);
});
```

> jQuery fadeOut() 方法用于淡出可见元素。
>

```javascript
$(selector).fadeOut(speed,callback);
```

> - 可选的 speed 参数规定效果的时长。它可以取以下值："slow"、"fast" 或毫秒。
>
> - 可选的 callback 参数是 fading 完成后所执行的函数名称。
> - 了带有不同参数的 fadeOut() 方法：

```javascript
$("button").click(function(){
  $("#div1").fadeOut();
  $("#div2").fadeOut("slow");
  $("#div3").fadeOut(3000);
});
```

> - jQuery fadeToggle() 方法可以在 fadeIn() 与 fadeOut() 方法之间进行切换。
>
> - 如果元素已淡出，则 fadeToggle() 会向元素添加淡入效果。
> - 如果元素已淡入，则 fadeToggle() 会向元素添加淡出效果。

```javascript
$(selector).fadeToggle(speed,callback);
```

> - 可选的 speed 参数规定效果的时长。它可以取以下值："slow"、"fast" 或毫秒。
>
> - 可选的 callback 参数是 fading 完成后所执行的函数名称。
> - 了带有不同参数的 fadeToggle() 方法：

```javascript
$("button").click(function(){
  $("#div1").fadeToggle();
  $("#div2").fadeToggle("slow");
  $("#div3").fadeToggle(3000);
});
```

> jQuery fadeTo() 方法允许渐变为给定的不透明度（值介于 0 与 1 之间）。
>

```javascript
$(selector).fadeTo(speed,opacity,callback);
```

> - 必需的 speed 参数规定效果的时长。它可以取以下值："slow"、"fast" 或毫秒。
>
> - fadeTo() 方法中必需的 opacity 参数将淡入淡出效果设置为给定的`不透明度`（值介于 0 与 1 之间）。
> - 可选的 callback 参数是该函数完成后所执行的函数名称。
> - 了带有不同参数的 fadeTo() 方法：

```javascript
$("button").click(function(){
  $("#div1").fadeTo("slow",0.15);
  $("#div2").fadeTo("slow",0.4);
  $("#div3").fadeTo("slow",0.7);
});
```

#### 4.3 滑动

> - 通过 jQuery，可以在元素上创建滑动效果。jQuery 拥有以下滑动方法：
>   - slideDown()
>   - slideUp()
>   - slideToggle()
> - jQuery slideDown() 方法用于向下滑动元素。
>

```javascript
$(selector).slideDown(speed,callback);
```

> - 可选的 speed 参数规定效果的时长。它可以取以下值："slow"、"fast" 或毫秒。
>
> - 可选的 callback 参数是滑动完成后所执行的函数名称。
>
> - 了 slideDown() 方法：
>

```javascript
$("#flip").click(function(){
  $("#panel").slideDown();
});
```

> * slideUp() 方法用于向上滑动元素。

```javascript
$(selector).slideUp(speed,callback);
```

> - 可选的 speed 参数规定效果的时长。它可以取以下值："slow"、"fast" 或毫秒。
>
> - 可选的 callback 参数是滑动完成后所执行的函数名称。
>
> - 了 slideUp() 方法：
>

```javascript
$("#flip").click(function(){
  $("#panel").slideUp();
});
```

> - jQuery slideToggle() 方法可以在 slideDown() 与 slideUp() 方法之间进行切换。
>
> - 如果元素向下滑动，则 slideToggle() 可向上滑动它们。
>
> - 如果元素向上滑动，则 slideToggle() 可向下滑动它们。
>

```javascript
$(selector).slideToggle(speed,callback);
```

> - 可选的 speed 参数规定效果的时长。它可以取以下值："slow"、"fast" 或毫秒。
>
> - 可选的 callback 参数是滑动完成后所执行的函数名称。
>
> - 了 slideToggle() 方法：
>

```javascript
$("#flip").click(function(){
  $("#panel").slideToggle();
});
```

#### 4.4 动画

> * animate() 方法：jQuery animate() 方法用于创建自定义动画。

```javascript
$(selector).animate({params},speed,callback);
```

> - 必需的 params 参数定义形成动画的 CSS 属性。
>
> - 可选的 speed 参数规定效果的时长。它可以取以下值："slow"、"fast" 或毫秒。
>
> - 可选的 callback 参数是动画完成后所执行的函数名称。
>
> -  animate() 方法的简单应用。它把 <div> 元素往右边移动了 250 像素：
>

```javascript
$("button").click(function(){
  $("div").animate({margnLeft:'250px'});
});
```

> -  操作多个属性
>
> - 请注意，生成动画的过程中可同时使用多个属性：
>

```javascript
$("button").click(function(){
  $("div").animate({
    margnLeft:'250px',
    opacity:'0.5',
    height:'150px',
    width:'150px'
  });
});
```

> - 可以用 animate() 方法来操作所有 CSS 属性吗？
>
> - 是的，可以！不过：当使用 animate() 时，必须使用 Camel 标记法书写所有的属性名(`小驼峰`)，比如，必须使用 paddingLeft 而不是 padding-left，使用 marginRight 而不是 margin-right，等等。
>
> - 同时，色彩动画并不包含在核心 jQuery 库中。
>
> - 如果需要生成颜色动画，需要从 [jquery.com](http://jquery.com/download/) 下载 [颜色动画](http://plugins.jquery.com/color/) 插件。
>
> - 也可以定义相对值（该值相对于元素的当前值）。需要在值的前面加上 += 或 -=：
>

```javascript
$("button").click(function(){
  $("div").animate({
    margnLeft:'250px',
    height:'+=150px',
    width:'+=150px'
  });
});
```

> 预定义的值：甚至可以把属性的动画值设置为 "show"、"hide" 或 "toggle"：
>

```javascript
$("button").click(function(){
  $("div").animate({
    height:'toggle'
  });
});
```

> - 使用队列功能：默认地，jQuery 提供针对动画的队列功能。
>
> - 这意味着如果在彼此之后编写多个 animate() 调用，jQuery 会创建包含这些方法调用的"内部"队列。然后逐一运行这些 animate 调用。
>

```javascript
$("button").click(function(){
  var div=$("div");
  div.animate({height:'300px',opacity:'0.4'},"slow");
  div.animate({width:'300px',opacity:'0.8'},"slow");
  div.animate({height:'100px',opacity:'0.4'},"slow");
  div.animate({width:'100px',opacity:'0.8'},"slow");
});
```

> 把 <div> 元素往右边移动了 100 像素，然后增加文本的字号：
>

```javascript
$("button").click(function(){
  var div=$("div");
  div.animate({margnLeft:'100px'},"slow");
  div.animate({fontSize:'3em'},"slow");
});
```

#### 4.5 停止动画

> - jQuery stop() 方法用于停止动画或效果，在它们完成之前。
>
> - stop() 方法适用于所有 jQuery 效果函数，包括滑动、淡入淡出和自定义动画。
>

```javascript
$(selector).stop(stopAll,goToEnd);
```

> - 可选的 stopAll 参数规定是否应该清除动画队列。默认是 false，即仅停止活动的动画，允许任何排入队列的动画向后执行。
>
> - 可选的 goToEnd 参数规定是否立即完成当前动画。默认是 false。
>
> - 因此，默认地，stop() 会清除在被选元素上指定的当前动画。
>
> -  stop() 方法，不带参数：
>

```javascript
$("#stop").click(function(){
  $("#panel").stop();
});
```

#### 4.6 Callback

> - 许多 jQuery 函数涉及动画。这些函数也许会将 *speed* 或 *duration* 作为可选参数。
>
> - 例子：*$("p").hide("slow")*
>
> - speed* 或 *duration* 参数可以设置许多不同的值，比如 "slow", "fast", "normal" 或毫秒。
>

```javascript
$("button").click(function(){
  $("p").hide("slow",function(){
    alert("段落现在被隐藏了");
  });
});
```

> 以下实例没有回调函数，警告框会在隐藏效果完成前弹出：
>

```javascript
$("button").click(function(){
  $("p").hide(1000);
  alert("段落现在被隐藏了");
});
```

#### 4.7 链式编程

> - 直到现在，都是一次写一条 jQuery 语句（一条接着另一条）。
>
> - 不过，有一种名为链接（chaining）的技术，允许在相同的元素上运行多条 jQuery 命令，一条接着另一条。
>
> - **提示：** 这样的话，浏览器就不必多次查找相同的元素。
> - 如需链接一个动作，只需简单地把该动作追加到之前的动作上。
>
> - 把 css()、slideUp() 和 slideDown() 链接在一起。"p1" 元素首先会变为红色，然后向上滑动，再然后向下滑动：
>

```javascript
$("#p1").css("color","red").slideUp(2000).slideDown(2000);
```

> - 如果需要，也可以添加多个方法调用。
>
> - **提示：**当进行链接时，代码行会变得很差。不过，jQuery 语法不是很严格；可以按照希望的格式来写，包含换行和缩进。
>
> - 如下书写也可以很好地运行：
>

```javascript
$("#p1").css("color","red")
  .slideUp(2000)
  .slideDown(2000);
```

### 五、jQuery DOM操作【★】

* 不带参：获取，带参：设置。

| 捕获       | 设置            | 添加/删除元素 | CSS类/方法     | 尺寸          |
| :----------: | :---------------: | :-------------: | :--------------: | :-------------: |
| text()     | text(str)       | append()      | addClass()     | width()       |
| html()     | html(str)       | prepend()     | removeClass()  | height()      |
| val()      | val(str)        | after()       | toggleClass()  | innerWidth()  |
| attr(name) | attr(name, val) | before()      | css()          | innerHeight() |
|            |                 | remove()      | css(name, val) | outerWidth()  |
|            |                 | empty()       |                | outerHeight() |

#### 5.1 捕获

> - 三个简单实用的用于 DOM 操作的 jQuery 方法，获取/设置值：
>   - `text()` - 设置或返回所选元素的文本内容
>   - `html()` - 设置或返回所选元素的内容（包括 HTML 标记）
>   - `val()` - 设置或返回表单字段的值
>

```javascript
$("#btn1").click(function(){
  alert("Text: " + $("#test").text());
});
$("#btn2").click(function(){
  alert("HTML: " + $("#test").html());
});
$("#btn1").click(function(){
  alert("值为: " + $("#test").val());
});
```

> - 获取属性-attr()
>
> 

```javascript
$("button").click(function(){
  alert($("#a1").attr("href"));
});
```

#### 5.2 设置

> - 三个相同的方法来设置内容：
>   - `text(str)` - 设置或返回所选元素的文本内容
>   - `html(str)` - 设置或返回所选元素的内容（包括 HTML 标记）
>   - `val(str)` - 设置或返回表单字段的值
>

```javascript
$("#btn1").click(function(){
    $("#test1").text("Hello world!");
});
$("#btn2").click(function(){
    $("#test2").html("<b>Hello world!</b>");
});
$("#btn3").click(function(){
    $("#test3").val("Hello world!");
});
```

> - 下面的三个 jQuery 方法：text()、html() 以及 val()，同样拥有回调函数。
>- 回调函数有两个参数：被选元素列表中当前元素的下标，以及原始（旧的）值。然后以函数新值返回希望使用的字符串。
> 

```javascript
<body>
    <button type="button" id="btn1">替换</button>
    <p class="text">hello</p>
    <p class="text">hello</p>
    <p class="text">hello</p>
</body>
<script type="text/javascript">
    $("#btn1").click(function() {
        console.log("点击鼠标");
        $(".text").text(function(i, origText) {
            return "旧文本:" + origText + " 新文本:你好世界! (index: " + i + ")";
        });
	});
</script>
 
$("#btn2").click(function(){
    $("#test2").html(function(i,origText){
        return "旧 html: " + origText + " 新 html: Hello <b>world!</b> (index: " + i + ")"; 
    });
});
```

> - jQuery attr() 方法也用于设置/改变属性值。
>
> - 如何改变（设置）文本中 color属性的值：
>

```javascript
$("button").click(function(){
  $("#font1").attr("color","red");
});
```

#### 5.3 添加元素

> - 用于添加新内容的四个 jQuery 方法：
>   - `append()` - 在被选元素的结尾插入内容
>   - `prepend()` - 在被选元素的开头插入内容
>   - `after()` - 在被选元素之后插入内容
>   - `before()` - 在被选元素之前插入内容
> - jQuery append() 方法在被选元素的结尾插入内容。

```javascript
$("p").append("追加文本");
```

> jQuery prepend() 方法在被选元素的开头插入内容。
>

```javascript
$("p").prepend("v文本");
```

> - 不过，append() 和 prepend() 方法能够通过`传递多个参数接收无限数量的新元素`。可以通过 jQuery 来生成文本/HTML（就像上面的例子那样），或者通过 JavaScript 代码和 DOM 元素。
>
>

```javascript
function appendText()
{
    var txt1="<p>文本。</p>";                 // 使用 HTML 标签创建文本
    var txt2=$("<p></p>").text("文本。");     // 使用 jQuery 创建文本
    var txt3=document.createElement("p");
    txt3.innerHTML="文本。";                  // 使用 DOM 创建文本 text with DOM
    $("body").append(txt1,txt2,txt3);        // 追加新元素
}
```

> - jQuery after() 方法在被选元素之后插入内容。
>
> - jQuery before() 方法在被选元素之前插入内容。
>

```javascript
$("img").after("在后面添加文本");
$("img").before("在前面添加文本");
```

> - after() 和 before() 方法能够通过`传递多个参数接收无限数量的新元素`。可以通过 text/HTML、jQuery 或者 JavaScript/DOM 来创建新元素。
>
> 

```javascript
function afterText()
{
    var txt1="<b>I </b>";                    // 使用 HTML 创建元素
    var txt2=$("<i></i>").text("love ");     // 使用 jQuery 创建元素
    var txt3=document.createElement("big");  // 使用 DOM 创建元素
    txt3.innerHTML="jQuery!";
    $("img").after(txt1,txt2,txt3);          // 在图片后添加文本
}
```

#### 5.4 删除元素

> - 如需删除元素和内容，一般可使用以下两个 jQuery 方法：
>   - `remove()` - 删除被选元素（及其子元素）
>   - `empty()` - 从被选元素中删除子元素

```javascript
$("#div1").remove();
$("#div1").empty();
```

> - jQuery remove() 方法也可接受一个参数，允许对被删元素进行过滤。
>
> - eg: 删除 class="italic" 的所有 \<p> 元素
>

```javascript
$("p").remove(".italic");
```

#### 5.5 CSS类

> - jQuery 拥有若干进行 CSS 操作的方法：
>   - `addClass()` - 向被选元素添加一个或多个类
>   - `removeClass()` - 从被选元素删除一个或多个类
>   - `toggleClass()` - 对被选元素进行添加/删除类的切换操作
>   - `css()` - 设置或返回样式属性
> 

```css
.important
{
    font-weight:bold;
    font-size:xx-large;
}
.blue
{
	color:blue;
}
```

> 当然，在添加类时，也可以选取多个元素：
>

```javascript
$("button").click(function(){
  $("h1,h2,p").addClass("blue");
  $("div").addClass("important");
});
```

> 也可以在 addClass() 方法中规定多个类：
>

```javascript
$("button").click(function(){
  $("body div:first").addClass("important blue");
});
```

> 如何在不同的元素中删除指定的 class 属性：
>

```javascript
$("button").click(function(){
  $("h1,h2,p").removeClass("blue");
});
```

> 如何使用 jQuery toggleClass() 方法。该方法对被选元素进行添加/删除类的切换操作：
>

```javascript
$("button").click(function(){
  $("h1,h2,p").toggleClass("blue");
});
```

#### 5.6 css()方法

> - css() 方法设置或返回被选元素的一个或多个样式属性。
>
> 

```javascript
css("propertyname");
```

> 返回首个匹配元素的 background-color 值：
>

```javascript
$("p").css("background-color");
```

> 设置指定的 CSS 属性，请使用如下语法：
>

```javascript
css("propertyname","value");
```

> 为所有匹配元素设置 background-color 值：
>

```javascript
$("p").css("background-color","yellow");
```

> 设置多个 CSS 属性，请使用如下语法：
>

```javascript
css({"propertyname":"value","propertyname":"value",...});
```

> 为所有匹配元素设置 background-color 和 font-size：
>

```javascript
$("p").css({"background-color":"yellow","font-size":"200%"});
```

#### 5.7 尺寸

> - jQuery 提供多个处理尺寸的重要方法：
>   - `width()`
>   - `height()`
>   - `innerWidth()`
>   - `innerHeight()`
>   - `outerWidth()`
>   - `outerHeight()`

|                             尺寸                             |
| :----------------------------------------------------------: |
| ![2020-6-9-jQuery尺寸](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/2020-6-9-jQuery尺寸.gif) |



> - width() 方法设置或返回元素的宽度（不包括内边距、边框或外边距）。
>
> - height() 方法设置或返回元素的高度（不包括内边距、边框或外边距）。
>
> 

```javascript
$("button").click(function(){
  var txt="";
  txt+="div 的宽度是: " + $("#div1").width() + "</br>";
  txt+="div 的高度是: " + $("#div1").height();
  $("#div1").html(txt);
});
```

> - innerWidth() 方法返回元素的宽度（包括内边距）。
>
> - innerHeight() 方法返回元素的高度（包括内边距）。
>
> 

```javascript
$("button").click(function(){
  var txt="";
  txt+="div 宽度，包含内边距: " + $("#div1").innerWidth() + "</br>";
    txt+="div 高度，包含内边距: " + $("#div1").innerHeight();
  $("#div1").html(txt);
});
```

> - outerWidth() 方法返回元素的宽度（包括内边距和边框）。
>
> - outerHeight() 方法返回元素的高度（包括内边距和边框）。
>
> 

```javascript
$("button").click(function(){
  var txt="";
  txt+="div 宽度，包含内边距和边框: " + $("#div1").outerWidth() + "</br>";
  txt+="div 高度，包含内边距和边框: " + $("#div1").outerHeight();
  $("#div1").html(txt);
});
```

#### 5.8 自适应宽度

```js
//页面加载完根据像素判断是否要增加toolbar高度(175px左侧导航占用)
$(function () {
    var width = document.body.clientWidth;
    if (width <= (1920-175)) {
        $(".l-toolbar").attr("style", "height:45px");
    }
});

//窗口变化时自适应处理表格toolbar工具栏的高度
$(document).ready(function() {
    $(window).resize(function () {
        var width = document.body.clientWidth;
        if (width <= (1920-175)) {
            $(".l-toolbar").attr("style", "height:45px");
        } else {
            $(".l-toolbar").attr("style", "height:30px");
        }
    });
});
```



### 六、jQuery遍历

| 祖先方法       | 后代方法   | 同胞方法    | 过滤方法 |
| :--------------: | :----------: | :-----------: | :--------: |
| parent()       | children() | siblings()  | first()  |
| parents()      | find()     | next()      | last()   |
| parentsUntil() |            | nextAll()   | eq()     |
|                |            | nextUntil() | filter() |
|                |            | prev()      | not()    |

#### 6.1 遍历

> - jQuery 遍历，意为"移动"，用于根据其相对于其他元素的关系来"查找"（或选取）HTML 元素。以某项选择开始，并沿着这个选择移动，直到抵达期望的元素为止。
>
> 

#### 6.2 祖先方法

> - parent() 方法返回被选元素的直接父元素。
>
> - 该方法只会向上一级对 DOM 树进行遍历。
>
> 

```javascript
$(document).ready(function(){
  $("span").parent();
});
```

> - parents() 方法返回被选元素的所有祖先元素，它一路向上直到文档的根元素 (html)。
>
> 

```javascript
$(document).ready(function(){
  $("span").parents();
});
```

> - 也可以使用可选参数来过滤对祖先元素的搜索。
>
> 

```javascript
$(document).ready(function(){
  $("span").parents("ul");
});
```

> - parentsUntil() 方法返回介于两个给定元素之间的所有祖先元素。
>
> 

```javascript
$(document).ready(function(){
  $("span").parentsUntil("div");
});
```

#### 6.3 后代方法

> - children() 方法返回被选元素的所有直接子元素。
>
> - 该方法只会向下一级对 DOM 树进行遍历。
>
> 

```javascript
$(document).ready(function(){
  $("div").children();
});
```

> - 也可以使用可选参数来过滤对子元素的搜索。
>
> 

```javascript
$(document).ready(function(){
  $("div").children("p.a");
});
```

> - find() 方法返回被选元素的后代元素，一路向下直到最后一个后代。
>

```javascript
$(document).ready(function(){
  $("div").find("span");
});
```

> 返回 div 的所有后代：
>

```javascript
$(document).ready(function(){
  $("div").find("*");
});
```

#### 6.4 同胞方法

> - siblings() 方法返回被选元素的所有同胞元素。
>
> - 返回 h2 的所有同胞元素：
>

```javascript
$(document).ready(function(){
  $("h2").siblings();
});
```

> - 也可以使用可选参数来过滤对同胞元素的搜索。
>
> - 返回属于 h2 的同胞元素的所有 p 元素：
>

```javascript
$(document).ready(function(){
  $("h2").siblings("p");
});
```

> - next() 方法返回被选元素的下一个同胞元素。
>
> - 该方法只返回一个元素。
>
> - 返回h2的下一个同胞元素：
>

```javascript
$(document).ready(function(){
  $("h2").next();
});
```

> - nextAll() 方法返回被选元素的所有跟随的同胞元素。
>
> - 返回 h2 的所有跟随的同胞元素：
>

```javascript
$(document).ready(function(){
  $("h2").nextAll();
});
```

> - nextUntil() 方法返回介于两个给定参数之间的所有跟随的同胞元素。
>
> - 返回介于 h2 与 h6 元素之间的所有同胞元素：
>

```javascript
$(document).ready(function(){
  $("h2").nextUntil("h6");
});
```

> - prev()方法取得一个包含匹配的元素集合中每一个元素紧邻的前一个同辈元素的元素集合
> - 返回 h2 的下一个同胞元素

```javascript
$(document).ready(function(){
  $("h2").prev();
});
```

> prevAll() 方法查找当前元素之前所有的同辈元素
>
> prevUntil() 方法查找当前元素之前所有的同辈元素，直到遇到匹配的那个元素为止

#### 6.5 过滤方法

> - first() 方法返回被选元素的首个元素。
>
> - 选取首个div 元素内部的第一个 p 元素：
>

```javascript
$(document).ready(function(){
  $("div p").first();
});
```

> - last() 方法返回被选元素的最后一个元素。
>
> - 选择最后一个div 元素中的最后一个 p 元素：
>

```javascript
$(document).ready(function(){
  $("div p").last();
});
```

> - eq() 方法返回被选元素中带有指定索引号的元素。
>
> - 索引号从 0 开始，因此首个元素的索引号是 0 而不是 1。选取第二个p 元素（索引号 1）：
>

```javascript
$(document).ready(function(){
  $("p").eq(1);
});
```

> - filter() 方法允许规定一个标准。不匹配这个标准的元素会被从集合中删除，匹配的元素会被返回。
>
> - 返回带有类名 "url" 的所有p 元素：
>

```javascript
$(document).ready(function(){
  $("p").filter(".url");
});
```

> - not() 方法返回不匹配标准的所有元素。
>
> - 提示：not() 方法与 filter() 相反。
> - 返回不带有类名 "url" 的所有p元素：

```javascript
$(document).ready(function(){
  $("p").not(".url");
});
```

### 七、jQuery AJAX

#### 7.1 jQuery AJAX简介

> - AJAX = 异步 JavaScript 和 XML（Asynchronous JavaScript and XML）。
>
> - 简短地说，在不重载整个网页的情况下，AJAX 通过后台加载数据，并在网页上进行显示。
>
> - 使用 AJAX 的应用程序案例：谷歌地图、腾讯微博、优酷视频、人人网等等。
>

#### 7.2 get和post方法

> * $.get() 方法通过 HTTP GET 请求从服务器上请求数据。
>    * `$.get(url, callback)`;
>     * 必需的 *URL* 参数规定希望请求的 URL。
>    * 可选的 *callback* 参数是请求成功后所执行的函数名。
>     * 使用 $.get() 方法从服务器上的一个文件中取回数据：
>

```javascript
$("button").click(function(){
  $.get("demo_test.jsp?paramer=xxx",function(data){
    alert("数据: " + data );
  });
});
```

> - $.post() 方法通过 HTTP POST 请求从服务器上请求数据。
>   - `$.post(url, data, callback)`;
>   - 必需的 *URL* 参数规定希望请求的 URL。
>   - 可选的 *data* 参数规定连同请求发送的数据。
>   - 可选的 *callback* 参数是请求成功后所执行的函数名。
> - 使用 $.post() 连同请求一起发送数据：

```javascript
$("button").click(function(){
    $.post("/try/ajax/demo_test_post.jsp",
    {
        name:"百度",
        url:"http://www.baidu.com"
    },
        function(data){
        alert("数据: \n" + data );
    });
});
```

#### 7.3 ajax()方法

> - `$.ajax([settings])`
> - jQuery 底层 AJAX 实现。简单易用的高层实现见 $.get, $.post 等。$.ajax() 返回其创建的 XMLHttpRequest  对象。大多数情况下无需直接操作该函数，除非需要操作不常用的选项，以获得更多的灵活性。
> - 最简单的情况下，$.ajax()可以不带任何参数直接使用。

### 八、其他

#### 8.1 jQuery noConflict方法

> - 正如已经了解到的，jQuery 使用 $ 符号作为 jQuery 的简写。
>
> - 如果其他 JavaScript 框架也使用 $ 符号作为简写怎么办？
>
> - 其他一些 JavaScript 框架包括：MooTools、Backbone、Sammy、Cappuccino、Knockout、JavaScript MVC、Google Web Toolkit、Google Closure、Ember、Batman 以及 Ext JS。
>
> - 其中某些框架也使用 $ 符号作为简写（就像 jQuery），如果在用的两种不同的框架正在使用相同的简写符号，有可能导致脚本停止运行。
>
> - jQuery 的团队考虑到了这个问题，并实现了 noConflict() 方法。
>
> - noConflict() 方法会释放对 $ 标识符的控制，这样其他脚本就可以使用它了。
>
> - 当然，仍然可以通过全名替代简写的方式来使用 jQuery：
>

```javascript
$.noConflict();
jQuery(document).ready(function(){
  jQuery("button").click(function(){
    jQuery("p").text("jQuery 仍然在工作!");
  });
});
```

> 也可以创建简写。noConflict() 可返回对 jQuery 的引用，可以把它存入变量，以供稍后使用。请看这个例子：
>

```javascript
var jq = $.noConflict();
jq(document).ready(function(){
  jq("button").click(function(){
    jq("p").text("jQuery 仍然在工作!");
  });
});
```

> 如果 jQuery 代码块使用 $ 简写，并且不愿意改变这个快捷方式，那么可以把 $ 符号作为变量传递给 ready 方法。这样就可以在函数内使用 $ 符号了 - 而在函数外，依旧不得不使用 "jQuery"：
>

```
$.noConflict();
jQuery(document).ready(function($){
  $("button").click(function(){
    $("p").text("jQuery 仍然在工作!");
  });
});
```

