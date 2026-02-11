---
title: 02-GitHub 第三方关联登陆
date: 2018-5-13 21:36:21
tags:
- 第三方
- OAuth2
categories: 
- 13_第三方
- 07_OAuth2.0
---

![image-20200815155630313](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815225036.png)

参考资料：https://www.jianshu.com/p/78d186aeb526



### 1. 基于GitHub实现关联登陆

准备校验的 key：Client ID + Client Secret

#### 1.1 申请应用

登录Github →头像 → setting → Developer Setting → Oauth App → 注册应用 → 填写信息 → 注册成功之后显示 Client ID 和 Client Secret
拼接：`client_id=xxx&client_secret=xxx&code`

#### 1.2 使用GitHub进行登录

1. 在页面上添加GitHub的图标，设置点击事件
    请求：https://github.com/login/oauth/authorize
    需要参数：

    ```js
    var params="?client_id=xxx&scope=user&state="+(new Date()).valueOf();
    ```

![image-20200815160227048](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815160228.png)

```js
/* 例子 */
$("#btngithub").click(function(){
	var params = "?client_id=xxx&scope=user&state=" + (new Date()).valueOf();
	location.href = "https://github.com/login/oauth/authorize" + params;
})
```

2. 获取授权码，进行令牌获取
    请求的接口：https://github.com/login/oauth/access_token

![image-20200815160650008](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815160651.png)

```js
$("#btntoken").click(function() {
	var params = "client_id=xxx&client_secret=xxx&code=" + $("#gcode").val();
	$.ajax({
		url: "https://github.com/login/oauth/access_token",
		data: params,
		method: "post",
		headers: {
			"Accept": "application/json"
		},
		success: function(res) {
			console.log(res);
		}
	});
})
```

3. 请求用户信息
    请求接口：https://api.github.com/user?access_token=xxx
    需要参数：access_token=上一步获取的令牌值 

```js
$("#btnuser").click(function() {
	$.ajax({
		url: "https://api.github.com/user?access_token=xxx",
		method: "get",
		success: function(res) {
			console.log(res);
		}
	});
})
```



