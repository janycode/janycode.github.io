---
title: 13-JS Ajax异步请求
date: 2018-5-10 10:19:39
tags:
- JavaScript
- Ajax
categories: 
- 04_大前端
- 03_JavaScript
---

### 1. Ajax 异步请求 说明
AJAX, Asynchronous Javascript And XML，`异步 JavaScript 和 XML`，一种创建交互式网页应用的网页开发技术。

**原理**：
通过在后台与服务器进行少量数据交换，AJAX可以是网页实现异步更新。
这意味着可以在不重新加载整个网页的情况下，`对网页的部分内容进行更新`。
（普通不适用AJAX的网页如果需要更新则必须刷新整个页面内容）

**作用**：

1. 可以刷新局部页面内容
2. 可以发起异步请求

**异步&同步请求**：
- 同步请求：当页面内容发生改变时，必须全部刷新，且刷新的时候不能发出其他请求。
- 异步请求：可以局部改变网页的内容，当正在发生改变时，其他的模块内容也可以发出请求。

### 2. Ajax 实现对象：XMLHttpRequest
XMLHttpRequest 异步请求对象提供了对 HTTP 协议的完全的访问,包括做出 POST 和 HEAD 请求以及普通的 GET 请求的能力。

#### 2.1 xhr 建立 Ajax 流程
1. new 一个 xhr 对象；
2. 调用 xhr 对象的 open 方法；
3. send 一些数据；
4. 对服务器的响应过程进行监听，来知道服务器是否正确得做出了响应，接着就可以做一些事情。比如获取服务器响应的内容，在页面上进行呈现。

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316144319.png)

#### 2.2 xhr 属性、句柄、方法
按照建立 Ajax 流程：
① **创建**

- `new XMLHttpRequest()` 创建一个 XMLHttpRequest 对象

② **事件句柄**
- `onreadystatechange`： 用于指定XMLHttpRequest对象状态改变时的事件处理函数

③ **属性**
- `status` / `statusText`：以数字/文本形式返回http状态码
- `readyState`： XMLHttpRequest对象的处理状态，响应返回成功的时候得到通知
0 ：请求未初始化。open() 还没有调用，xhr 对象已创建或已被 abort() 方法重置
1 ：服务器连接已建立。open() 已经调用了，但是 send() 方法未调用。请求还没有被发送
2 ：请求已经接收。send() 方法已调用，HTTP 请求已发送到 Web 服务器
3 ：请求处理中。所有响应头信息已接收，响应体开始接收单未完成
4 ：请求已完成。响应已就绪，HTTP 响应已经完全接收，也就是响应完成了

> * 当 `status === 200 && readyState === 4` 时才去读取响应数据。

- `responseText` / `responsXML`：获得字符串/XML形式的响应数据
- `getAllResponseHeader()`：获取所有的响应报头
- `getResponseHeader()`：查询响应中的某个字段的值

④ **方法**
- `open()`：打开链接。

```javascript
open(请求方式, 请求路径, flag); // flag==true 异步请求, false 同步请求
```

- `setRequestHeader()`：设置请求头。
模拟form表单，专用于POST请求

```javascript
setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
```


- `send()`： 发送数据
GET请求，send 方法不需要携带参数，直接将参数拼接在 open 方法的路径后面
POST 请求，需要 send 方法带参来发送

```javascript
send(请求参数数据);
```



### 3. Ajax 异步 GET/POST 请求
服务器 Servlet 处理请求的资源：
```java
@WebServlet(name = "TestAjaxServlet", urlPatterns = "/ajax")
public class TestAjaxServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ... {
    	// 获取参数
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        if (username != null && password != null) {
            String msg = "账户可用";
            boolean flag = true;
            Map<String, Object> map = new HashMap<>();
            map.put("flag", flag);
            map.put("msg", msg);
			// 封装 JSON 字符串
            ObjectMapper objectMapper = new ObjectMapper();
            String resp = objectMapper.writeValueAsString(map);
			// 响应到浏览器（浏览器页面 Ajax 会接收处理）
            response.setContentType("text/html;charset=utf-8");
            response.getWriter().write(resp);
        }
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throw ... {
        doPost(request, response);
    }
}
```

#### 3.1 Ajax GET 请求
```html
<title>ajax-get请求</title>
<script>
    /**
     * 1. 创建异步请求对象 XMLHttpRequest
     * @returns {XMLHttpRequest}
     */
    function createXMLHttpRequest() {
        var xmlHttp;
        try {
            // IE7+, Chrome, Firefox, Opera 8.0+, Safari 主流浏览器
            xmlHttp = new XMLHttpRequest();
        } catch (e) {
            try {
                // IE6, IE5 浏览器
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    // 其他浏览器
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    // Nothing to do.
                }
            }
        }
        return xmlHttp;
    }
    var xhr = createXMLHttpRequest();
    // 2. 监听异步请求对象的状态改变 (当异步请求对象状态发生改变就会执行本方法)
    xhr.onreadystatechange = function () {
        console.log("服务器响应码status = "+xhr.status+", 服务器响应完成状态readyState = "+xhr.readyState);
        // 判断服务器响应状态码 status && 判断服务器响应完成状态 readyState
        if (xhr.status === 200 && xhr.readyState === 4) {
            console.log("请求成功，读取响应完成...");
            var responseText = xhr.responseText;
            // json字符串 >> js对象
            var jsObj = eval("(" + responseText + ")");
            console.log(jsObj.flag + ":" + jsObj.msg);
        }
    };
    // 3. 打开链接
    xhr.open("get", "${pageContext.request.contextPath}/ajax?username=root&password=1234", true);
    // 4. 发送数据（GET请求的参数必须拼接在请求链接中）
    xhr.send();
</script>
```

#### 3.2 Ajax POST 请求
```html
<title>ajax-post请求</title>
<script>
    // 1.创建异步请求对象
    function createXMLHttpRequest() {
        var xmlHttp;
        try {
            // IE7+, Chrome, Firefox, Opera 8.0+, Safari 主流浏览器
            xmlHttp = new XMLHttpRequest();
        } catch (e) {
            try {
                // IE6, IE5 浏览器
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    // 其他浏览器
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    // Nothing to do.
                }
            }
        }
        return xmlHttp;
    }
    var xhr = createXMLHttpRequest();
    // 2. 监听异步请求对象的状态改变 (当异步请求对象状态发生改变就会执行本方法)
    xhr.onreadystatechange = function () {
        console.log("服务器响应码status = "+xhr.status+", 服务器响应完成状态readyState = "+xhr.readyState);
        // 判断服务器响应状态码 status && 判断服务器响应完成状态 readyState
        if (xhr.status === 200 && xhr.readyState === 4) {
            console.log("请求成功，读取响应完成...");
            var responseText = xhr.responseText;
            console.log(responseText);
            // json字符串 >> js对象
            var jsObj = eval("(" + responseText + ")");
            console.log(jsObj.flag);
            console.log(jsObj.msg);
        }
    };
    // 3.打开链接
    xhr.open("post", "${pageContext.request.contextPath}/ajax", true);
    // 4.设置请求头(模拟 form 表单)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // 5.发送参数
    xhr.send("username=root&password=1234");
</script>
```

> 【注意事项】在以下情况中`请使用 POST 请求`：
> - 无法使用缓存文件（更新服务器上的文件或数据库）
> - 向服务器发送大量数据（POST 没有数据量限制）
> - 发送包含未知字符的用户输入时，POST 比 GET 更稳定也更可靠



### 4. 异步请求无法正确获取返回值

#### 4.1 问题现象
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316144335.png)
普通的 ajax 校验会出现的问题：`无法正确返回 boolean 值 false，因此无法正确拦截表单提交！！！`

```js
	// 普通的 ajax 异步请求（校验用户名是否与数据库中重复）
	$.ajax({
		type : "post",
		async : true,
		url : "<%=request.getContextPath()%>/validateLogin", // 查重 Servlet
		data : {
			"username" : name
		},
		success : function(data) {
			console.log("data:" + data + ", type:" + (typeof data));
			// 与 登陆逻辑正好相反，false 用户不存在, true 用户存在（不能注册） 
			if (data == false) {
				nameSpan.innerHTML = "√".fontcolor("green");
				return true;
			} else {
				nameSpan.innerHTML = "用户名已存在".fontcolor("red");
				return false;
			}
		},
		dataType: "json",
	});
```

因此，当下的需求非常明确：
如何在 ajax 异步请求回调函数 function(data) 中正确获取一个返回值，用于表单的提交 / 拦截。

进一步研究验证，解决方案有 两种：
* 方式1：`将 ajax 作为临时同步的校验事件，可正确赋值需要的返回值`
* 方式2：`使用自定义 get/set 方法确保操作的是永远是同一个 变量` (即需要正确赋值的返回值)


#### 4.2 解决方案 1：改变 async 为临时同步 + 变量赋值
jQuery.ajax() 参数：`async`
* 类型：Boolean
* 默认值: true。默认不带 async 参数时，所有请求均为异步请求。显式设置为 false 则为同步请求。
* 注意，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。

```js
// 方式1：将 ajax 作为临时同步的校验事件，可正确赋值需要的返回值 result
function checkStuName1() {
	// 如果 id 标签不存在，id === undefined，且不能直接操作 .value
	var id = document.getElementsByName("stuId")[0];
	var name = document.getElementsByName("username")[0].value;
	var nameSpan = document.getElementById("nameSpan");
	
	console.log("id:" + id + ", " + "name:" + name);
	if (null === name || "" === name) {
		nameSpan.innerHTML = "* 用户名不能为空".fontcolor("red");
		return false;
	}

	var result;
	if (undefined === id || null === id || "" === id) {
		// 注册
		$.ajax({
			type : "post",
			async : false, // 转为同步请求 + result变量
			url : "<%=request.getContextPath()%>/validateLogin",
			data : {
				"username" : name
			},
			success : function(data) {
				console.log("data:" + data + ", type:" + (typeof data));
				// 与 登陆逻辑正好相反，false 用户不存在, true 用户存在（不能注册） 
				if (data == false) {
					nameSpan.innerHTML = "√".fontcolor("green");
					result = true;
				} else {
					nameSpan.innerHTML = "用户名已存在".fontcolor("red");
					result = false;
				}
			},
			dataType: "json",
		});
	} else {
		// id 不为空：修改操作
		console.log("修改操作");
		result = false;
	}
	return result;
}
```

#### 4.3 解决方案 2：使用全局变量 + 写 get/set 方法
```js
// 方式2：使用自定义 get/set 方法确保操作的是永远是同一个 flag (即需要正确赋值的返回值)
var flag = false;
function getFlag() {
	return flag;
}
function setFlag(b) {
	flag = b;
}
function checkStuName2() {
	// 如果 id 标签不存在，id === undefined，且不能直接操作 .value
	var id = document.getElementsByName("stuId")[0];
	var name = document.getElementsByName("username")[0].value;
	var nameSpan = document.getElementById("nameSpan");
	
	console.log("id:" + id + ", " + "name:" + name);
	if (null === name || "" === name) {
		nameSpan.innerHTML = "* 用户名不能为空".fontcolor("red");
		return false;
	}

	if (undefined === id || null === id || "" === id) {
		// 注册
		$.post("<%=request.getContextPath()%>/validateLogin", {
			"username": name
		}, function(data) {
			console.log("data:" + data + ", type:" + (typeof data));
			// 与 登陆逻辑正好相反，true 用户存在 false 用户不存在
			if (data == true) {
				nameSpan.innerHTML = "用户名已存在".fontcolor("red");
				setFlag(false);
			} else {
				nameSpan.innerHTML = "√".fontcolor("green");
				setFlag(true);
			}
		}, "json");
	} else {
		// 修改
		console.log("修改操作");
	}
	console.log("最终flag=" + getFlag());
	return getFlag();
}
```

#### 4.4 demo 源码

```html
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core"  prefix="c"%>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>注册/修改页</title>
		<script src="${pageContext.request.contextPath}/js/jquery-3.5.1.min.js"></script>
		<script type="text/javascript">
			function show(file) {
				var reader = new FileReader(); // 实例化一个FileReader对象，用于读取文件
				var img = document.getElementById('img'); // 获取要显示图片的标签
				//读取File对象的数据
				reader.onload = function(evt) {
					img.width = "50";
					img.height = "50";
					img.src = evt.target.result;
				}
				reader.readAsDataURL(file.files[0]);
			}

			// 方式1：将 ajax 作为临时同步的校验事件，可正确赋值需要的返回值 result
			function checkStuName1() {
				// 如果 id 标签不存在，id === undefined，且不能直接操作 .value
				var id = document.getElementsByName("stuId")[0];
				var name = document.getElementsByName("username")[0].value;
				var nameSpan = document.getElementById("nameSpan");
				
				console.log("id:" + id + ", " + "name:" + name);
				if (null === name || "" === name) {
					nameSpan.innerHTML = "* 用户名不能为空".fontcolor("red");
					return false;
				}

				var result;
				if (undefined === id || null === id || "" === id) {
					// 注册
					$.ajax({
						type : "post",
						async : false, // 转为同步请求 + result变量
						url : "<%=request.getContextPath()%>/validateLogin",
						data : {
							"username" : name
						},
						success : function(data) {
							console.log("data:" + data + ", type:" + (typeof data));
							// 与 登陆逻辑正好相反，false 用户不存在, true 用户存在（不能注册） 
							if (data == false) {
								nameSpan.innerHTML = "√".fontcolor("green");
								result = true;
							} else {
								nameSpan.innerHTML = "用户名已存在".fontcolor("red");
								result = false;
							}
						},
						dataType: "json",
					});
				} else {
					// id 不为空：修改操作
					console.log("修改操作");
					result = false;
				}
				return result;
			}

			// 方式2：使用自定义 get/set 方法确保操作的是永远是同一个 flag (即需要正确赋值的返回值)
			var flag = false;
			function getFlag() {
				return flag;
			}
			function setFlag(b) {
				flag = b;
			}
			function checkStuName2() {
				// 如果 id 标签不存在，id === undefined，且不能直接操作 .value
				var id = document.getElementsByName("stuId")[0];
				var name = document.getElementsByName("username")[0].value;
				var nameSpan = document.getElementById("nameSpan");
				
				console.log("id:" + id + ", " + "name:" + name);
				if (null === name || "" === name) {
					nameSpan.innerHTML = "* 用户名不能为空".fontcolor("red");
					return false;
				}

				if (undefined === id || null === id || "" === id) {
					// 注册
					$.post("<%=request.getContextPath()%>/validateLogin", {
						"username": name
					}, function(data) {
						console.log("data:" + data + ", type:" + (typeof data));
						// 与 登陆逻辑正好相反，true 用户存在 false 用户不存在
						if (data == true) {
							nameSpan.innerHTML = "用户名已存在".fontcolor("red");
							setFlag(false);
						} else {
							nameSpan.innerHTML = "√".fontcolor("green");
							setFlag(true);
						}
					}, "json");
				} else {
					// 修改
					console.log("修改操作");
				}
				console.log("最终flag=" + getFlag());
				return getFlag();
			}

			// 校验返回
			function checkAll() {
				//return checkStuName1();
				return checkStuName2();
			}
		</script>
	</head>
	<body>
		<form action="<%=request.getContextPath()%>/addOrUpdate" method="post" enctype="multipart/form-data" onsubmit="return checkAll()">
			<table>
				<c:if test="${null != stuData.stuId}">
					<tr>
						<td>编号</td>
						<td>
							<input type="text" name="stuId" readonly="readonly" value="${stuData.stuId}">
						</td>
						<td></td>
					</tr>
				</c:if>

				<tr>
					<td>姓名</td>
					<td>
						<input type="text" name="username" value="${stuData.stuName}" onblur="checkStuName2()">
					</td>
					<td><span id="nameSpan"></span></td>
				</tr>
				<tr>
					<td>年龄</td>
					<td>
						<input type="text" name="age" value="${stuData.stuAge}">
					</td>
					<td></td>
				</tr>
				<tr>
					<td>爱好</td>
					<td>
						<input type="text" name="hobby" value="${stuData.stuHobby}">
					</td>
					<td></td>
				</tr>
				<tr>
					<td>班级</td>
					<td>
						<select name="grade">
							<option value="1" <c:if test="${stuData.gId==1}">selected</c:if>>zz2001</option>
							<option value="2" <c:if test="${stuData.gId==2}">selected</c:if>>zz2002</option>
							<option value="3" <c:if test="${stuData.gId==3}">selected</c:if>>zz2003</option>
							<option value="4" <c:if test="${stuData.gId==4}">selected</c:if>>zz2004</option>
							<option value="5" <c:if test="${stuData.gId==5}">selected</c:if>>zz2005</option>
						</select>
					</td>
					<td></td>
				</tr>
				<tr>
					<td>密码</td>
					<td><input type="password" name="password" value="${stuData.pwd}"></td>
					<td></td>
				</tr>
				<tr>
					<td>生日</td>
					<td><input type="date" name="birthday" value="${stuData.stuBirthday}"></td>
					<td></td>
				</tr>
				<tr>
					<td>头像</td>
					<td>
						<c:choose>
							<c:when test="${not empty stuData.imgPath}">
								<img id="img" height="50px" width="50px" alt="有头像" src="http://localhost:8081/uploadfile/images/${stuData.imgPath}">
							</c:when>
							<c:otherwise>
								<img id="img" height="50px" width="50px" alt="有头像" src="<%=request.getContextPath()%>/img/default.png">
							</c:otherwise>
						</c:choose>
					</td>
					<td>
						<input type="file" name="imgPath" onchange="show(this)">
					</td>
				</tr>
			</table>
			<input type="submit" value="注册">
			<input type="reset" value="重置">
		</form>

	</body>
</html>
```