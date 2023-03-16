---
title: 11-Filter过滤器原理
date: 2017-5-22 22:26:20
tags:
- Servlet
- Filter
- 原理
categories: 
- 04_网页技术
- 04_Servlet
---

### 1.1 Filter 基本信息

`Filter`，过滤器`接口`。
对客户端向服务器发送的请求进行过滤，用于在请求之前处理资源的组件。
Filter和Listener都属于Servlet中的高级部分，`Filter是最为实用的技术`。

### 1.2 Filter 过滤器链
请求时，从客户端到服务端顺序处理；
响应时，从服务端到客户端顺序处理。

> 遵从原则：先过滤，后放行。

### 1.3 Filter 工作原理
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142712.png)
执行流程：

1. 浏览器发起请求
2. 服务器会根据这个请求，创建 request 对象及 response 对象
3. 过滤器会持有 request 对象及 response 对象
4. 只有当过滤器放行之后，request 对象及 response 对象才会传给 Servlet



### 1.4 Filter 生命周期
* 随着服务器的初始化而初始化
* 随着服务器的关闭而销毁



### 1.5 Filter 基本使用
开发步骤：
1. 自定义类`实现 Filter 接口`
2. 重写 `init`() `doFilter`() `destroy()` 三个方法
3. 在 web.xml 中配置过滤器：①声明过滤器 ②配置过滤器的过滤路径



创建一个过滤器：
```java
public class Filter01 implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("Filter01 过滤器的初始化");
    }
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        System.out.println("Filter01 放行之前");
        // 通过过滤器链操作：放行
        filterChain.doFilter(servletRequest, servletResponse);
        System.out.println("Filter01 放行之后");
    }
    @Override
    public void destroy() {
        System.out.println("Filter01 过滤器的销毁");
    }
}
```
配置过滤器，使其在服务器中指定资源下生效：
```xml
<!--声明Filter01过滤器-->
<filter>
    <filter-name>Filter01</filter-name>
    <filter-class>com.demo.filter.Filter01</filter-class>
</filter>
<!--配置Filter01的过滤路径-->
<filter-mapping>
    <filter-name>Filter01</filter-name>
    <!--/* 代表所有资源都过滤-->
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

### 1.6 Filter 配置方式 × 2
* web.xml
`<url-pattern>`标签中的匹配规则：
	* `/` 完全匹配
	* `/开头，*结尾` 目录匹配
	* `*开头，后缀名结尾` 后缀名匹配



```xml
<!--无限接近SpringMVC中文乱码解决方案-->
<filter>
    <filter-name>EncodingFilter</filter-name>
    <filter-class>com.demo.filter.EncodingFilter</filter-class>
    <init-param>
        <param-name>encoding</param-name>
        <param-value>utf-8</param-value>
        </init-param>
</filter>
<filter-mapping>
    <filter-name>EncodingFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```
* 注解配置
@WebFilter注解
WebInitParam[] initParams() default {}; //配置初始化参数
String filterName() default ""; //配置过滤器名称
String[] servletNames() default {}; //配置过滤的Servlet
String[] urlPatterns() default {}; //配置过滤路径



```java
@WebFilter(filterName = "Demo04Filter" ,
        urlPatterns = "/demo01",
        servletNames = "Demo01Servlet" ,
        initParams = {
                @WebInitParam(name = "username",value = "root"),
                @WebInitParam(name = "password",value = "root123")
        })
public class Demo04Filter implements Filter { }
```

### 1.7 Filter 中文乱码处理
* 方式一：使用默认 .jsp 动态页面，中文乱码



```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>登陆</title>
</head>
<body>
<form action="/demo/login" method="post">
    账户:<input type="text" name="username"/><br>
    密码:<input type="text" name="password"/><br>
    7天内自动登录:<input type="checkbox" name="autoLogin" value="logined"><br>
    <button type="submit">登录</button>
</form>
</body>
</html>
```
* 方式二：使用过滤器对 request 中的服务器编码/客户端解码进行设置
(服务器初始化时会从web.xml中读取出filter的配置信息，在任何请求过程中执行Servlet前，/* 即所有的项目资源均会先被该 Filter 过滤，设置编码方式为utf-8)



```xml
<!--web.xml-->
    <filter>
        <filter-name>EncodingFilter</filter-name>
        <filter-class>com.demo.filter.EncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>utf-8</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>EncodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
```
```java
public class EncodingFilter implements Filter {
    private String encoding = null;

    @Override
    public void init(FilterConfig config) throws ServletException {
        encoding = config.getInitParameter("encoding");
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {
        // 处理响应中文乱码
        //resp.setContentType("text/html;charset=" + encoding);
        // 处理请求中文乱码
        req.setCharacterEncoding(encoding);
        // 放行
        chain.doFilter(req, resp);
    }

    @Override
    public void destroy() { }
}
```
