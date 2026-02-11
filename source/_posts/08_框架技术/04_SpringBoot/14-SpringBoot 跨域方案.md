---
title: 14_SpringBoot 跨域方案
date: 2018-6-20 17:59:44
tags:
- SpringBoot
- 跨域
categories: 
- 08_框架技术
- 04_SpringBoot
---

![image-20200708160944615](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708160946.png)



三种解决方案，任一即可。



### 1. 跨域过滤器

* 跨域过滤器：`实现 Filter 接口 重写 doFilter() 方法`

```java
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@WebFilter("/*")
public class CROSFilter implements Filter {
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        response.setHeader("Access-Control-Allow-Origin", "*"); //允许跨域
        response.setHeader("Access-Control-Allow-Credentials", "true"); //允许跨域
        response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");//支持跨域的请求方式
        response.setHeader("Access-Control-Allow-Headers", "content-type,votertoken");// 允许跨域的请求消息头
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("content-type", "application/json;charset=UTF-8");
        filterChain.doFilter(servletRequest, response);
    }
}
```



### 2. 跨域拦截器

* 跨域拦截器：`实现 HandlerInterceptor 重写 preHandle() 方法`

```java
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class CorsInterceptor implements HandlerInterceptor{
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object arg2) throws Exception {
	    // 此处配置的是允许任意域名跨域请求，可根据需求指定
        // 允许所有跨域
        response.setHeader("Access-Control-Allow-Origin", "*"); 
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("origin"));
        // 允许跨域凭证
        response.setHeader("Access-Control-Allow-Credentials", "true");
        // 允许跨域的方法
        response.setHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS");
        // 允许跨域的有效期
        response.setHeader("Access-Control-Max-Age", "86400");
        // 允许跨域的请求消息头
        response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
        
        return true;
	}
}
```



### 3. 跨域注解

* 解决跨域请求：**控制器类**上添加 `@CrossOrigin` 注解

```java
@CrossOrigin(origins = "*")//解决跨域请求                                                             
```

