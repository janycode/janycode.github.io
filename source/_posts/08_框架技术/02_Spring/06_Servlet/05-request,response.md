---
title: 05-request,response
date: 2017-5-22 22:26:20
tags:
- Servlet
- 请求
categories: 
- 08_框架技术
- 02_Spring
- 06_Servlet
---

![request请求对象、response响应对象](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142521.png)

### 1. HttpServlet中 request 请求对象
#### 1.1 操作请求行
request.getMethod() 获取请求方式
request.getRequestURI() 获取请求路径
request.getQueryString() 获取请求路径上的参数，仅限于GET

#### 1.2 操作请求头
request.getHeader(String name) 根据请求头名称获取值，如 User-Agent
#### 1.3 操作请求参数
request.getParameter() 获取指定参数名称的值
request.getParameterValues() 获取指定参数名称的一组值
request.getParameterMap() 返回此请求的参数的 java.util.Map
request.getParameterNames() 获取所有的参数名称
```java
        // 获取所有请求参数(?后面所有参数和值)
        Enumeration<String> parameterNames = request.getParameterNames();
        while (parameterNames.hasMoreElements()) {
            String name = parameterNames.nextElement();
            String value = request.getParameter(name);
            System.out.println(name+":"+value);
        }
        // 获取指定请求参数的一组值，用于多选参数提交(?hobbys=111&hobbys=222&hobbys=333)
        String[] hobbys = request.getParameterValues("hobbys");
        System.out.println(Arrays.toString(hobbys));
        // 获取请求参数对应Map
        // 键：相当于 getParameterNames
        // 值：相当于 getParameterValues
        Map<String, String[]> parameterMap = request.getParameterMap();
        for (Map.Entry<String, String[]> stringEntry : parameterMap.entrySet()) {
            String name = stringEntry.getKey();
            String[] values = stringEntry.getValue();
            System.out.println(name+":"+Arrays.toString(values));
        }
```
#### 1.4 操作请求中文乱码
```java
/* POST请求正文乱码，两种方式都可以；GET是QueryString乱码，只能用方式二 */
// ● 终极方案：设置请求正文编码，用于POST在Tomcat8.5环境。
request.setCharacterEncoding("utf-8");
// 其他方案：将请求中拿到的乱码字符串编码成iso8859-1字节，再将字节解码为utf-8字符串，通用Tomcat7.0&8.5环境。
String serverEncoding = request.getCharacterEncoding();
String tmp = request.getParameter("username");
String username = new String(tmp.getBytes(serverEncoding), "utf-8");
/* Tomcat8.5比7.0中新增了URIEncoding="utf-8"，修复了GET请求QueryString乱码，POST请求还需设置请求正文编码 */
```
#### 1.5 操作请求数据 - form表单
@WebServlet(name = "任意名字", urlPatterns = "/资源路径")
\<!--默认提交方式为 GET，同时可省略，POST不可省略-->
\<form method="post" action="/projname/资源路径">...\</form>
#### 1.6 页面跳转之一：请求转发
原理：
客户浏览器发送http`请求` >> web服务器`接收`此请求 >> 服务器`内部完成`请求处理和转发动作 >> 将目标资源`响应`给客户
特点：
1. 转发是`服务器`行为
2. 转发是浏览器只做了 `1` 次访问请求
3. 转发浏览器`地址不变`
4. 转发两次跳转之间的`信息不会丢失`(request生命周期内可传递数据)
5. 转发只能将请求转发给`同一个web项目内的资源`

```java
// 转发，如提交成功自动进行一次配置路径的Servlet请求调用执行，此处为配置路径(无projname)
request.getRequestDispatcher("/资源路径").forward(request, response);
```
### 2. HttpServlet中 response 响应对象
#### 2.1 操作响应行
response.setStatus() 操作响应状态码，如200,302
response.sendError() 操作响应错误码，如404
#### 2.2 操作响应头
response.setHeader() 覆盖原有响应头的值
response.addHeader() 在原有的响应头的基础上添加新值(Cookie)
#### 2.3 操作响应正文
response.getWriter().println("响应正文内容") 返回可将字符文本发送到客户端的 java.io.PrintWriter 对象
#### 2.4 操作响应中文乱码
```java
// ● 终极方案：同时设置服务器的编码，设置浏览器解码方式
response.setContentType("text/html;charset=utf-8");
// 其他方案：分别设置服务器编码、浏览器解码
response.setCharacterEncoding("utf-8") 设置服务器的编码方式
response.setHeader("Content-Type", "text/html;charset=utf-8") 设置浏览器的解码方式
```
#### 2.5 定时跳转
```java
/*定时跳转*/
response.setHeader("refresh", "5;url=/demo/demo02"); // 5s后跳转demo02
```
#### 2.6 页面跳转之二：重定向
原理：
客户浏览器发送http`请求` >> web服务器回复`响应状态码302`+`响应头location`给浏览器 >> 浏览器收到302则自动再发送1个http`请求`(url+location) >> 服务器根据新请求的url寻找资源`响应`给浏览器
特点：
1. 重定向是`客户端`行为
2. 重定向是浏览器做了至少 `2` 次的访问请求
3. 重定向浏览器`地址改变`
4. 重定向两次跳转之间传输的`信息会丢失`(request生命周期为单次请求)
5. 重定向可以定向到`任何web资源`(当前站点/外部站点)

```java
// 方式一：设置 Status Code=302 和 Location=url
response.setStatus(302);
response.setHeader("location", "/projname/success.html");
// ● 方式二：本质还是 Status Code=302 和 Location=url
response.sendRedirect("/projname/success.html");
response.sendRedirect(request.getContextPath() + File.separator + "资源/页面");
```

>● 重定向中不能使用 request域对象，因为1次请求响应后该对象便销毁；
>● 转发中可以使用 request域对象，因为转发只有1次请求，在域对象生命周期内。