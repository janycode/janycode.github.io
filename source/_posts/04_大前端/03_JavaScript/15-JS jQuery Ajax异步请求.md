---
title: 15-JS jQuery Ajax异步请求
date: 2018-5-12 21:36:21
tags:
- JavaScript
- Ajax
categories: 
- 04_大前端
- 03_JavaScript
---

\>> [jQuery 参考手册](https://www.w3school.com.cn/jquery/jquery_reference.asp)

jQuery，是一个 JavaScript 脚本类库文件，简化了JS编程。
JQuery 是2006年8月诞生的一个开源项目，凭借简洁的语法和跨平台的兼容性，极大地简化了 JavaScript 开发遍历 HTML 文档、操作 DOM 、处理事件、执行动画和开发 Ajax 的操作，其独特而又优雅的代码风格改变了 JavaScript 程序员的设计思路和编写程序的方式。

### 1. jQuery 导入方式
#### 1.1 下载导入
从官网下载 jQuery 库：[https://jquery.com/download/](https://jquery.com/download/)

导入(/web/js/ 目录下)：
```html
<script src="js/jquery-1.10.2.min.js"></script>
```

#### 1.2 CDN载入
CDN，内容分发网络。
官网 CDN 选择 minified (压缩版) 即可：[https://code.jquery.com/](https://code.jquery.com/)
载入：
```html
官网：
<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
```
其他站点 CDN ：
```html
百度：
<script src="https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
谷歌：
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
微软：
<script src="https://ajax.aspnetcdn.com/ajax/jquery/jquery-1.9.0.min.js"></script>
```

>许多用户在访问其他站点时，已经从谷歌或微软加载过 jQuery。因此当他们访问我们的站点时，会从缓存中加载 jQuery，这样可以`减少加载时间`。同时，大多数 CDN 都可以确保当用户向其请求文件时，会从离用户最近的服务器上返回响应，这样也可以`提高加载速度`。

#### 1.3 jQuery 命名冲突解决
多个JS库很有可能会导致 jQuery 命名冲突，解决办法：
```js
var jq=$.noConflict(); // 使用自定义的名称：比如 jq 来代替 $ 符号。
```

### 2. jQuery 语法
#### 2.1 jQuery 与 js 对象转换
JS 对象 与 jQuery 对象的属性和方法各自独立，不能相互调用。
JS DOM 转 jQuery：
```js
var jqObj = $(jsObj);
```

jQuery 转 JS DOM：
```js
var jqObj = $("#div1");
var jsObj1 = jqObj.get(0); // 方式1
var jsObj2 = jqObj[0]; // 方式2 √
```

#### 2.2 jQuery 选择器
参考手册：[https://www.w3school.com.cn/jquery/jquery_ref_selectors.asp](https://www.w3school.com.cn/jquery/jquery_ref_selectors.asp)

**① 基本选择器**：
- id选择器：`$("#id");`
- 类选择器：`$(".className");`
- 标签选择器：`$("标签名");`
- 通配符选择器：`$("*");`

**② 层次选择器**：
从父子关系和胸弟关系来进行选择页面节点。
- `$("a b");`     a节点的所有后代节点b都被选中
- `$("a > b");`  a节点的所有子节点b都被选中
- `$("a + b");`  a节点之后的第一个胸弟节点b
- `$("a ~ b");`  a节点之后的所有胸弟节点b

**③ 过滤选择器**：
【基本过滤】从位置的角度来对页面的标签进行过滤选择。
- `$("tagName:first");` 选择第一个tagName标签
- `$("tagName:last");` 选择最后一个tagName标签
- `$("tagName:eq(2)");` 选择脚标为2的tagName标签
- `$("tagName:gt(2)");` 选择脚标大于2的tagName标签
- `$("tagName:lt(2)");` 选择脚标小于2的tagName标签

【内容过滤】节点值是否为空，节点值是否包含指定的字符串。
- `$("tagName:empty");` tagName节点中没有子元素(文本元素,其他子元素)
- `$("tagName:contains('aaa')");` tagName节点是否包含指定字符串
- `$("tagName:has(.one)");` tagName节点是否包含class为one的tagName元素

【属性过滤】从节点的属性来过滤筛选节点:有无属性,属性值等于,不等于,包含,多重过滤。
- `$("tagName[id]")` :tagName节点是否包含id属性
- `$("tagName[id='cc']")` : tagName节点属性值是否为cc
- `$("tagName[id!='cc']")` :tagName节点属性值是否不为cc
- `$("tagName[id^='cc']")` :tagName节点属性值是否以cc为开头
- `$("tagName[id$='cc']")` :tagName节点属性值是否以cc为结尾
- `$("tagName[title*='cc']")` :tagName节点属性值是否包含cc
- `$("tagName[title*='cc'][name='ee'][id!='ff']")` : tagName节点属性值title是否包含cc,属性值name是否为ee,id属性是否不是ff

> 属性过滤的下标从 0 开始，因为拿到的是个数组。

【子元素过滤】选择父元素下的子元素(第1个,最后1个,第几个子元素) 。语法中的空格不能少。
- `$("tagName :first‐child")` :tagName节点下的第一个子节点
- `$("tagName :last‐child")` :tagName节点下的最后一个子节点
- `$("tagName :nth‐child(2)")` :tagName节点下的第二个子节点
- `$("tagName :only-child")` :tagName如果只有一个子元素，就选中该子元素

> tagName 后的空格不能少； 子元素过滤器下标从 1 开始；

#### 2.3 jQuery DOM
内容操作：
- `.html("html content")` : 设置/获取标签内容，解析 html 标签，相当于 .innerHTML
- `.text("text content")` : 设置/获取标签内容，不解析 html 标签，相当于 .innerText
- `.val(string)` : 多用于 input 元素，设置/获取 value 属性，相当于 .value

属性操作：
- `.attr("属性名", "属性值")` : 获取/设置元素的属性，相当于 .setAttribute()
- `.removeAttr("属性名")` : 删除属性，相当于 .removeAttirbute()

使用：`获取第2个li节点的title属性和文本内容`
```html
<script>
    // 获取第2个 li 的 title 属性值
    function getTitle1() {
        // 基本过滤器：下标取值
        alert( $("li:eq(1)").attr("title") );
    }
    function getTitle2() {
        // 子元素过滤器：子元素下标
        alert( $("ul :nth-child(2)").attr("title") );
    }
    // 获取第 2 个 li 的文本内容
    function getText() {
        alert( $("li:eq(1)").html() );
    }
</script>
<ul>
    <li title="xg">西瓜</li>
    <li title="hmg">哈密瓜</li>
    <li title="hfl">黑凤梨</li>
</ul>
<br>
<button onclick="getTitle1()">获取1</button>
<button onclick="getTitle2()">获取2</button>
<button onclick="getText()">获取3</button>
```


#### 2.4 jQuery 事件
参考手册：[https://www.w3school.com.cn/jquery/jquery_ref_events.asp](https://www.w3school.com.cn/jquery/jquery_ref_events.asp)
jQuery 是为处理 HTML 事件而特别设计的，更恰当且更易维护的代码规则：
- 所有 jQuery 代码置于事件处理函数中；
- 所有事件处理函数置于文档就绪事件处理器中；
- jQuery 代码置于单独的 .js 文件中；
- 如果存在名称冲突，则重命名 jQuery 库。

**JS 与 jQuery 事件对比**：
```html
<script>
    // js 事件方式一
    function fn1() {
        alert("点击111");
    }
    window.onload = function () {
        // js 事件方式二
        document.getElementById("btn1").onclick = function () {
            alert("点击222");
        };
        // jQuery 事件
        $("#btn2").click(function () {
            alert("点击333");
        });
    }
</script>
<button onclick="fn1()">点击1</button>
<button id="btn1">点击2</button>
<button id="btn2">点击3</button>
```

**jQuery 事件绑定的两种方式**：
```html
<script>
    $(function () { // 监听页面加载完成
        // jQuery 事件绑定方式1
        $("#btn1").click(function () {
            console.log("点击111！！！");
        });
        // jQuery 事件绑定方式2
        $("#btn2").bind("click", function () {
           console.log("点击222！！！")
        });
    });
</script>
```

**监听页面加载完成**：

```html
<script>
	// js 方式
	window.onload = function () {
	    // 页面加载完成操作
	};
	
	// jQuery方式
	$(document).ready(function () {
	    // 页面加载完成操作
	});
	
	// jQuery简化
	$(function () {
	    // 页面加载完成操作
	});
</script>
```
使用：`输入框的获取/失去焦点默认值点击事件`
```html
<script>
    $(function () {
        var username = $("#username");
        username.focus(function () {
            console.log("默认值时，获取焦点，置空");
            if (username.attr("placeholder") === "请输入用户名") {
                username.attr("placeholder", "");
            }
        });

        username.blur(function () {
            console.log("空时，失去焦点，设值默认值");
            if (username.attr("placeholder") === "") {
                username.attr("placeholder", "请输入用户名");
            }
        });
    });
</script>
<input type="text" name="username" id="username" placeholder="请输入用户名">
```


#### 2.5 jQuery 遍历
参考手册：[https://www.w3school.com.cn/jquery/jquery_ref_traversing.asp](https://www.w3school.com.cn/jquery/jquery_ref_traversing.asp)

使用：`js 与 jQuery 遍历方式对比`
```html
<script>
    function fn1() { // JS 遍历
        var lis = document.getElementsByTagName("li");
        for (var i = 0; i < lis.length; i++) {
            console.log(lis[i].innerHTML);
        }
    }

    function fn2() { // jQuery 遍历1
        $("ul > li").each(function (index, element) {
            // index : 当前元素的下标
            // element : 当前元素对象(js对象)
            console.log("js> " + index + ":" + element.innerHTML);
            console.log("jq> " + index + ":" + $(element).html());
        });
    }

    function fn3() { // jQuery 遍历1
        $("ul > li").each(function (index) {
            // this : 内置 js 对象，当前元素
            console.log(index + ":" + this.innerHTML);
            console.log(index + ":" + $(this).html());
        });
    }

    function fn4() { // jQuery 遍历2
        var lis = $("ul > li");
        $.each(lis, function (index, element) {
            console.log(index + ":" + element.innerHTML + ":" + this.innerHTML);
        })
    }
</script>
<ul>
    <li>西瓜</li>
    <li>哈密瓜</li>
    <li>黑凤梨</li>
</ul>
<button onclick="fn1()">js获取遍历</button>
<button onclick="fn2()">jQuery获取遍历1</button>
<button onclick="fn3()">jQuery获取遍历2</button>
<button onclick="fn4()">jQuery获取遍历3</button>
```

### 3. jQuery 异步请求：get/post/ajax
参考手册：[https://www.w3school.com.cn/jquery/jquery_ref_ajax.asp](https://www.w3school.com.cn/jquery/jquery_ref_ajax.asp)
通过 jQuery AJAX 方法，您能够使用 HTTP Get 和 HTTP Post 从远程服务器上请求文本、HTML、XML 或 JSON，同时您能够把这些外部数据直接载入网页的被选元素中。
- $(selector).**load**(url,data,callback) 把远程数据加载到被选的元素中
- $.**ajax**(options) 把远程数据加载到 XMLHttpRequest 对象中
- $.**get**(url,data,callback,type) 使用 HTTP GET 来加载远程数据
- $.**post**(url,data,callback,type) 使用 HTTP POST 来加载远程数据
- $.**getJSON**(url,data,callback) 使用 HTTP GET 来加载远程 JSON 数据
- $.**getScript**(url,callback) 加载并执行远程的 JavaScript 文件  

> 参数说明：
> @selector, jQuery 元素选择器语法
> @url, 被加载的数据的 URL（地址）
> @data, 发送到服务器的数据的键/值对象
> @callback, 当数据被加载时，所执行的函数
> @type, 被返回的数据的类型 (html,xml,json,jasonp,script,text)
> @options, 完整 AJAX 请求的所有键/值对选项 


#### 3.1 get
`$.get(url, data, callback, type)` : 使用GET 来加载远程数据

- url:请求的路径
- data:请求的参数
- callback: 当数据被加载时，所执行的函数
- type: 被返回的数据的类型 (html,xml,json,jasonp,script,text)

使用：`get 异步请求参数并输出响应信息`
```html
<script>
    function get() {
        /* $.get(url, data, callback, type) */
        $.get("${pageContext.request.contextPath}/demoServlet", {
            "username": "root",
            "password": "1234"
        }, function (data) { // @data, 服务器响应正文
            // data 响应正文受到 type="json" 的影响，直接被解析为 js 对象
            console.log(data.flag);
            console.log(data.msg);
        }, "json");
    }
</script>
<button onclick="get()">get请求</button>
```

<table>
<tr>
<th align="left" width="25%">参数</th>
    <th align="left" width="75%">描述</th>  </tr>
<tr>
<td><em>URL</em></td>
    <td>必需。规定您需要请求的 URL。</td>
    </tr>
<tr>
<td><em>data</em></td>
    <td>可选。规定连同请求发送到服务器的数据。</td>
    </tr>
<tr>
<td><em>function(data,status,xhr)</em></td>
    <td>
	可选。规定当请求成功时运行的函数。<br>
	额外的参数：<br><ul>
<li>
<em>data</em> - 包含来自请求的结果数据</li>
		<li>
<em>status</em> - 包含请求的状态（"success"、"notmodified"、"error"、"timeout"、"parsererror"）</li>
		<li>
<em>xhr</em> - 包含 XMLHttpRequest 对象</li>
</ul>
</td>
    </tr>
<tr>
<td><em>dataType</em></td>
    <td>
	可选。规定预期的服务器响应的数据类型。<br>
	默认地，jQuery 会智能判断。<br>
	可能的类型：<ul>
<li>"xml" - 一个 XML 文档</li>
		<li>"html" - HTML 作为纯文本</li>
		<li>"text" - 纯文本字符串</li>
		<li>"script" - 以 JavaScript 运行响应，并以纯文本返回</li>
		<li>"json" - 以 JSON 运行响应，并以 JavaScript 对象返回</li>
		<li>"jsonp" - 使用 JSONP 加载一个 JSON 块，将添加一个 "?callback=?" 到 URL 来规定回调</li>
	</ul>
</td>
    </tr>
</table>


#### 3.2 post

`$.post(url, data, callback, type)` : 使用POST 来加载远程数据 
- url:请求的路径
- data:请求的参数
- callback: 当数据被加载时，所执行的函数
- type: 被返回的数据的类型 (html,xml,json,jasonp,script,text)

使用：`post 异步请求参数并输出响应信息`
```html
<script>
    function post() {
        /* $.post(url, data, callback, type) */
        $.post("${pageContext.request.contextPath}/demoServlet", {
            "username": "root",
            "password": "1234"
        }, function (data) { // @data, 服务器响应正文
            // data 响应正文受到 type="json" 的影响，直接被解析为 js 对象
            console.log(data);
        }, "json");
    }
</script>
<button onclick="post()">post请求</button>
```

<table>
<tr>
<th align="left" width="30%">参数</th>
    <th align="left" width="70%">描述</th>  </tr>
<tr>
<td><em>URL</em></td>
    <td>必需。规定将请求发送到哪个 URL。</td>
    </tr>
<tr>
<td><em>data</em></td>
    <td>可选。规定连同请求发送到服务器的数据。</td>
    </tr>
<tr>
<td><em>function(data,status,xhr)</em></td>
    <td>
	可选。规定当请求成功时运行的函数。<br>
	额外的参数：<br><ul>
<li>
<em>data</em> - 包含来自请求的结果数据</li>
		<li>
<em>status</em> - 包含请求的状态（"success"、"notmodified"、"error"、"timeout"、"parsererror"）</li>
		<li>
<em>xhr</em> - 包含 XMLHttpRequest 对象</li>
</ul>
</td>
    </tr>
<tr>
<td><em>dataType</em></td>
    <td>
	可选。规定预期的服务器响应的数据类型。<br>
	默认地，jQuery 会智能判断。<br>
	可能的类型：<ul>
<li>"xml" - 一个 XML 文档</li>
		<li>"html" - HTML 作为纯文本</li>
		<li>"text" - 纯文本字符串</li>
		<li>"script" - 以 JavaScript 运行响应，并以纯文本返回</li>
		<li>"json" - 以 JSON 运行响应，并以 JavaScript 对象返回</li>
		<li>"jsonp" - 使用 JSONP 加载一个 JSON 块，将添加一个 "?callback=?" 到 URL 来规定回调</li>
	</ul>
</td>
    </tr>
</table>



#### 3.3 ajax

`$.ajax([settings])` 是低层级 AJAX 函数的语法。
$.ajax 提供了比高层级函数更多的功能，但是同时也更难使用。

- option 参数设置的是 name|value 对，定义 url 数据、密码、数据类型、过滤器、字符集、超时以及错误函数。
- async，设置是否为异步请求
- contentType，设置请求头Content-Type，默认值："application/x-www-form-urlencoded"
- **data**，请求参数
- **dataType**，响应正文的数据类型("html", "xml", "json", "jasonp", "script", "text")
- complete(XHR, TS)，请求完成的回调函数
- error，请求失败的回调函数
- **success**，请求成功的回调函数
- timeout，设置请求延迟时间
- **type**，请求方式(Get/Post)
- **url**，请求路径
- xhr，获取异步请求对象

使用：`ajax 异步请求 post 方式发送参数并输出响应信息`
```html
<script>
    function ajax() {
        $.ajax({
            type: "post",
            url: "${pageContext.request.contextPath}/demoServlet",
            data: {
                "username": "root",
                "password": "1234"
            },
            success: function (data) {
                console.log(data.flag);
                console.log(data.msg);
            },
            dataType: "json",
        });
    }
</script>
<button onclick="ajax()">ajax请求</button>
```

<table>
<tr>
<th align="left" width="27%">名称</th>
    <th align="left" width="73%">值/描述</th>  </tr>
<tr>
<td>async</td>
    <td>布尔值，表示请求是否异步处理。默认是 true。</td>
    </tr>
<tr>
<td>beforeSend(<em>xhr</em>)</td>
    <td>发送请求前运行的函数。</td>
    </tr>
<tr>
<td>cache</td>
    <td>布尔值，表示浏览器是否缓存被请求页面。默认是 true。</td>
    </tr>
<tr>
<td>complete(<em>xhr,status</em>)</td>
    <td>请求完成时运行的函数（在请求成功或失败之后均调用，即在 success 和 error 函数之后）。<br>
</td>
    </tr>
<tr>
<td>contentType</td>
    <td>发送数据到服务器时所使用的内容类型。默认是："application/x-www-form-urlencoded"。</td>
    </tr>
<tr>
<td>context</td>
    <td>为所有 AJAX 相关的回调函数规定 "this" 值。</td>
    </tr>
<tr>
<td>data</td>
    <td>规定要发送到服务器的数据。</td>
    </tr>
<tr>
<td>dataFilter(<em>data</em>,<em>type</em>)</td>
    <td>用于处理 XMLHttpRequest 原始响应数据的函数。</td>
    </tr>
<tr>
<td>dataType</td>
    <td>预期的服务器响应的数据类型。</td>
    </tr>
<tr>
<td>error(<em>xhr,status,error</em>)</td>
    <td>如果请求失败要运行的函数。</td>
    </tr>
<tr>
<td>global</td>
    <td>布尔值，规定是否为请求触发全局 AJAX 事件处理程序。默认是 true。<br>
</td>
    </tr>
<tr>
<td>ifModified</td>
    <td>布尔值，规定是否仅在最后一次请求以来响应发生改变时才请求成功。默认是 false。</td>
    </tr>
<tr>
<td>jsonp</td>
    <td>在一个 jsonp 中重写回调函数的字符串。</td>
    </tr>
<tr>
<td>jsonpCallback</td>
    <td>在一个 jsonp 中规定回调函数的名称。</td>
    </tr>
<tr>
<td>password</td>
    <td>规定在 HTTP 访问认证请求中使用的密码。</td>
    </tr>
<tr>
<td>processData</td>
    <td>布尔值，规定通过请求发送的数据是否转换为查询字符串。默认是 true。</td>
    </tr>
<tr>
<td>scriptCharset</td>
    <td>规定请求的字符集。</td>
    </tr>
<tr>
<td>success(<em>result,status,xhr</em>)</td>
    <td>当请求成功时运行的函数。</td>
    </tr>
<tr>
<td>timeout</td>
    <td>设置本地的请求超时时间（以毫秒计）。</td>
    </tr>
<tr>
<td>traditional</td>
    <td>布尔值，规定是否使用参数序列化的传统样式。</td>
    </tr>
<tr>
<td>type</td>
    <td>规定请求的类型（GET 或 POST）。</td>
    </tr>
<tr>
<td>url</td>
    <td>规定发送请求的 URL。默认是当前页面。<br>
</td>
    </tr>
<tr>
<td>username</td>
    <td>规定在 HTTP 访问认证请求中使用的用户名。</td>
    </tr>
<tr>
<td>xhr</td>
    <td>用于创建 XMLHttpRequest 对象的函数。</td>
    </tr>
</table>


#### 3.4 ajax 操作函数

<table>
<tr>
<th>函数</th>
<th>描述</th>
</tr>
<tr>
<td><a href="https://www.w3school.com.cn/jquery/ajax_ajax.asp" title="jQuery ajax - ajax() 方法">jQuery.ajax()</a></td>
<td>执行异步 HTTP (Ajax) 请求。</td>
</tr>
<tr>
<td><a href="https://www.w3school.com.cn/jquery/ajax_ajaxcomplete.asp" title="jQuery ajax - ajaxComplete() 方法">.ajaxComplete()</a></td>
<td>当 Ajax 请求完成时注册要调用的处理程序。这是一个 Ajax 事件。</td>
</tr>
<tr>
<td><a href="https://www.w3school.com.cn/jquery/ajax_ajaxerror.asp" title="jQuery ajax - ajaxError() 方法">.ajaxError()</a></td>
<td>当 Ajax 请求完成且出现错误时注册要调用的处理程序。这是一个 Ajax 事件。</td>
</tr>
<tr>
<td><a href="https://www.w3school.com.cn/jquery/ajax_ajaxsend.asp" title="jQuery ajax - ajaxSend() 方法">.ajaxSend()</a></td>
<td>在 Ajax 请求发送之前显示一条消息。</td>
</tr>
<tr>
<td><a href="https://www.w3school.com.cn/jquery/ajax_ajaxsetup.asp" title="jQuery ajax - ajaxSetup() 方法">jQuery.ajaxSetup()</a></td>
<td>设置将来的 Ajax 请求的默认值。</td>
</tr>
<tr>
<td><a href="https://www.w3school.com.cn/jquery/ajax_ajaxstart.asp" title="jQuery ajax - ajaxStart() 方法">.ajaxStart()</a></td>
<td>当首个 Ajax 请求完成开始时注册要调用的处理程序。这是一个 Ajax 事件。</td>
</tr>
<tr>
<td><a href="https://www.w3school.com.cn/jquery/ajax_ajaxstop.asp" title="jQuery ajax - ajaxStop() 方法">.ajaxStop()</a></td>
<td>当所有 Ajax 请求完成时注册要调用的处理程序。这是一个 Ajax 事件。</td>
</tr>
<tr>
<td><a href="https://www.w3school.com.cn/jquery/ajax_ajaxsuccess.asp" title="jQuery ajax - ajaxSuccess() 方法">.ajaxSuccess()</a></td>
<td>当 Ajax 请求成功完成时显示一条消息。</td>
</tr>
<tr>
<td><a href="https://www.w3school.com.cn/jquery/ajax_get.asp" title="jQuery ajax - get() 方法">jQuery.get()</a></td>
<td>使用 HTTP GET 请求从服务器加载数据。</td>
</tr>
<tr>
<td><a href="https://www.w3school.com.cn/jquery/ajax_getjson.asp" title="jQuery ajax - getJSON() 方法">jQuery.getJSON()</a></td>
<td>使用 HTTP GET 请求从服务器加载 JSON 编码数据。</td>
</tr>
<tr>
<td><a href="https://www.w3school.com.cn/jquery/ajax_getscript.asp" title="jQuery ajax - getScript() 方法">jQuery.getScript()</a></td>
<td>使用 HTTP GET 请求从服务器加载 JavaScript 文件，然后执行该文件。</td>
</tr>
<tr>
<td><a href="https://www.w3school.com.cn/jquery/ajax_load.asp" title="jQuery ajax - load() 方法">.load()</a></td>
<td>从服务器加载数据，然后把返回到 HTML 放入匹配元素。</td>
</tr>
<tr>
<td><a href="https://www.w3school.com.cn/jquery/ajax_param.asp" title="jQuery ajax - param() 方法">jQuery.param()</a></td>
<td>创建数组或对象的序列化表示，适合在 URL 查询字符串或 Ajax 请求中使用。</td>
</tr>
<tr>
<td><a href="https://www.w3school.com.cn/jquery/ajax_post.asp" title="jQuery ajax - post() 方法">jQuery.post()</a></td>
<td>使用 HTTP POST 请求从服务器加载数据。</td>
</tr>
<tr>
<td><a href="https://www.w3school.com.cn/jquery/ajax_serialize.asp" title="jQuery ajax - serialize() 方法">.serialize()</a></td>
<td>将表单内容序列化为字符串。</td>
</tr>
<tr>
<td><a href="https://www.w3school.com.cn/jquery/ajax_serializearray.asp" title="jQuery ajax - serializeArray() 方法">.serializeArray()</a></td>
<td>序列化表单元素，返回 JSON 数据结构数据。</td>
</tr>
</table>


Demo：`验证用户名是否存在，给出合适的提示`
regist.jsp

```html
<script>
    function checkUsername() {
        var username = $("#username").val();
        // post 异步请求
        $.post("${pageContext.request.contextPath}/checkUsername",{
            "username":username,
        }, function (data) {
            console.log(data);
            if (data.flag) {
                // 用户名可用
                $("#span").html("√ 用户名可用");
                $("button[type='submit']").attr("disabled", false); //使能按钮
            } else {
                $("#span").html("* 用户名已存在");
                $("button[type='submit']").attr("disabled", true); //禁用按钮
            }
        }, "json");
    }
</script>
<form action="${pageContext.request.contextPath}/regist" method="post">
    账户：<input type="text" name="username" id="username" onchange="checkUsername()">
    <span id="span"></span><br>
    密码：<input type="text" name="password" id="password"> <br>
    <button type="submit">注册</button>
</form>
```
CheckUsernameServlet.java
```java
@WebServlet(name = "CheckUsernameServlet", urlPatterns = "/checkUsername")
public class CheckUsernameServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        String username = request.getParameter("username");
        UserService userService = new UserServiceImpl();
        try {
            boolean flag = userService.checkUsername(username);
            String msg = flag ? "用户名可用" : "用户名已存在";
            Map<String, Object> map = new HashMap<>();
            map.put("flag", flag);
            map.put("msg", msg);

            JsonUtils.writeJsonStr(response, map);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```
UserServiceImpl.java
```java
public class UserServiceImpl implements UserService {
    private UserDao userDao = new UserDaoImpl();
    @Override
    public boolean checkUsername(String username) throws Exception {
        return userDao.checkUsername(username) == null;
    }
}
```