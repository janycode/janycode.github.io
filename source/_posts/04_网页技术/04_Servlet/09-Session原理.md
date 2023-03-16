---
title: 09-Session原理
date: 2017-5-22 22:26:20
tags:
- Servlet
- Session
- 原理
categories: 
- 04_网页技术
- 04_Servlet
---

### 1.1 Session 背景信息

服务器状态管理技术，将状态信息保存在服务器端。
是sun公司定义的一个接口。
### 1.2 Session 工作原理
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142643.png)
执行流程：

1. 第一次请求，请求头中没有jsessionid的cookie，当访问到对应的servlet资源时，执行到getSession()会创建HttpSession对象；进而响应时就将session的id作为cookie的value，响应到浏览器 Set-cookie:jsessionid=xxxx;
2. 再一次请求时，http请求中就有一个cookie:jsessionid=xxxx信息，那么该servlet就可以通过getSession()获取到jsessionid在服务器内查找对应的session对象，有就使用，无就创建。

### 1.3 Session 创建、获取、销毁
```java
// 获取session对象，服务器底层创建Session
HttpSession session = request.getSession();
// 获取session对象的唯一标识：sessionID (JSESSIONID=E925DE1EF00F7944537C01A3BC0E2688)
String jsessionid = session.getId();
// 销毁session对象中的jsessionid
session.invalidate();
```
### 1.4 Session 共享范围
http域对象之一，服务器中可跨资源共享数据。
```java
// 往 session 中存储 msg
HttpSession session = request.getSession();
session.setAttribute("msg", "helloSession");
// 获取 msg
HttpSession session = request.getSession();
Object msg = session.getAttribute("msg");
// 删除域对象中的数据
session.removeAttribute("msg");
```
### 1.5 Session 生命周期
一般都是默认值 30 分钟，无需更改。
取决于 Tomcat 中 web.xml 默认配置：
```xml
<session-config>
    <session-timeout>30</session-timeout>
</session-config>
```
Session生命周期结束时机：
* 浏览器关闭：销毁Cookie中的jsessionid=xxx，原session对象会保留默认30min后才销毁，30分钟后为新的session;
* session销毁：主动调用 session.invalidate() 方法后，立即将session对象销毁，再次访问时会创建新的session。

### 1.6 HTTP请求中 4 大共享数据方式对比
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142650.png)

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142656.png)
