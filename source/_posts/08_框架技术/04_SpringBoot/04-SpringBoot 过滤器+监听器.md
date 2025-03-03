---
title: 04_SpringBoot 过滤器+监听器
date: 2018-6-20 17:59:44
tags:
- SpringBoot
- 过滤器
- 监听器
categories: 
- 08_框架技术
- 04_SpringBoot
---





![image-20200708160944615](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708160946.png)

参考资料：https://www.springcloud.cc/spring-boot.html

中文文档2：https://felord.cn/_doc/_springboot/2.1.5.RELEASE/_book/index.html



> SpringBoot 中 Filter 过滤器、Listener 监听器`用法相同`。



### 1. 创建过滤器

```java
import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import java.io.IOException;

@WebFilter("/filter/*")
public class MyFilter implements Filter {
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        System.out.println("MyFilter");
        filterChain.doFilter(servletRequest, servletResponse);
    }
}

```



### 2. 测试类

```java
package com.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/filter")
public class FilterController {

    @RequestMapping("/test")
    public String test() {
        System.out.println("测试");
        return "success";
    }
}
```



### 3. 启动类添加注解

* `@ServletComponentScan` 包含 Servlet、Filter、Listener 可以直接通过@WebServlet、@WebFilter、@WebListener注解自动注册

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

@SpringBootApplication
@ServletComponentScan  // SpringBoot 中扫描 @WebServlet、@WebFilter、@WebListener注解
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```



访问测试：http://localhost:8081/filter/test

![image-20200708224200807](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708224201.png)

输出：

MyFilter
测试