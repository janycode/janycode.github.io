---
title: 06-Cookie原理
date: 2017-5-22 22:26:20
tags:
- Servlet
- Cookie
- 原理
categories: 
- 04_网页技术
- 04_Servlet
---

### 1.1 Cookie 背景信息

客户端状态管理技术，将状态信息保存在客户端。
网景公司发明，`浏览器会话技术`。
一个Cookie只能标识一种信息，它至少含有一个标识该信息的名称`name`和设置值`value`。
浏览器一般只允许存放`300`个Cookie，每个站点最多存放`20`个Cookie，每个大小限制为`4kb`。

### 1.2 Cookie 工作原理
![Cookie工作原理](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142547.png)
执行流程：
1. 浏览器向服务器发送请求，服务器需要创建cookie，服务器会通过响应携带cookie，在产生响应时会产生Set-Cookie响应头，从而将cookie信息传递给了浏览器；
2. 当浏览器再次向服务器发送请求时，会产生cookie请求头，将之前服务器的cookie信息再次发送给了服务器，然后服务器根据cookie信息跟踪客户端状态。

### 1.3 Cookie 创建、获取、修改
>chrome谷歌浏览器查看cookie信息，浏览器地址栏输入：
>* chrome://settings/content/cookies
>* chrome://settings/siteData

Cookie 创建：
```java
// 用响应创建Cookie，等价于 response.addHeader("set-cookie", "name=value");
Cookie cookie = new Cookie(String name, String value); // Cookie: name=value
cookie.setMaxAge(seconds); // 设置Cookie的生命周期
cookie.setPath("/"); // 设置Cookie的共享范围
response.addCookie(cookie); // 添加1个Cookie
```
Cookie 获取：
```java
// 用请求获取Cookie
Cookie[] cookies = request.getCookies(); // 获取Cookies返回数组
// 需遍历
cookie.getName(); // 获取键
cookie.getValue(); // 获取值
```
Cookie 修改：
```java
// 修改Cookie
cookie.setValue(String name);
```

### 1.4 Cookie 共享范围
* `/` 当前项目下`所有资源`均可共享访问该Cookie对象内容
* `/project/demo` 当前项目下`只有资源demo`均可共享访问该Cookie对象内容

设置 Cookie 数据共享范围：
```java
// 设置Cookie的共享范围
cookie.setPath("/");
```

### 1.5 Cookie 生命周期
* <0：浏览器会话结束/浏览器关闭，内存存储(`默认`)
* =0：失效
* \>0：生效时间，单位s
> 在生命周期内Cookie会跟随任何请求，可通过`设置路径限制携带Cookie的请求资源范围`。

设置 Cookie 数据生命周期：
```java
// 设置Cookie生命周期，单位s
cookie.setMaxAge(int second); // 7天：7*24*60*60
```

### 1.6 Cookie 中文乱码 - 解决方案
>中文：Unicode，4个字节    英文：ASCII，2个字节

Cookie的中文乱码需要进行编码和解码处理：
编码：java.net.URLEncoder 的 `URLEncoder.encode(String str, String encoding)`
解码：java.net.URLDecoder 的 `URLDecoder.decode(String str, String encoding)`

```java
// 编码
Cookie cookie = new Cookie(
        URLEncoder.encode("键", "utf-8"),
        URLEncoder.encode("值", "utf-8")
);
response.addCookie(cookie);
// 解码
String keyStr = URLDecoder.decode(cookie.getName(), "utf-8");
```

### 1.7 Cookie 优缺特点分析
优点：
● `可配置到期规则`：① 1次请求就失效  ②1次浏览器会话(关闭)失效  ③配置永久生效
● `简单性`：基于文本的轻量结构，简单键值对
● `数据持久性`：虽然Cookie可被客户端浏览器的过期处理和干预，但Cookie通常也是客户端上持续时间最长的数据保留形式
缺点：
● `大小受到限制`：大多数浏览器的Cookie只有4kb大小的限制
● `用户配置禁用`：客户浏览器设置了禁用接收Cookie的能力，限制了该功能
● `潜在安全风险`：用户可能会操纵篡改浏览器上的Cookie，会造成Cookie应用程序执行失败的问题