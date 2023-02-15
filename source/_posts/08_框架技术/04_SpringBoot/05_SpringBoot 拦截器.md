---
title: 05_SpringBoot 拦截器
date: 2018-6-20 17:59:44
tags:
- SpringBoot
- 拦截器
categories: 
- 08_框架技术
- 04_SpringBoot
---

![image-20200708160944615](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708160946.png)

参考资料：https://www.springcloud.cc/spring-boot.html

中文文档2：https://felord.cn/_doc/_springboot/2.1.5.RELEASE/_book/index.html

### 1. 自定义拦截器类

```java
import org.omg.PortableInterceptor.Interceptor;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class MyInterceptor implements HandlerInterceptor {
    //进入controller方法之前调用
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("preHandle");
        return true;//true表示放行，false表示不放行
    }

    //调用完controller之后，视图渲染之前
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println("postHandle");
    }

    //页面跳转之后，整个流程执行之后，一般用于资源清理操作
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        System.out.println("afterCompletion");
    }
}
```



### 2. 拦截器配置类

实现 `WebMvcConfigurer` 接口。

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MyInterceptorConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        //设置拦截器并指定拦截路径
        registry.addInterceptor(new MyInterceptor()).addPathPatterns("/interceptor/*");
        //registry.addInterceptor(new MyInterceptor()).addPathPatterns("/**");//拦截所有
        //registry.addInterceptor(new MyInterceptor()).addPathPatterns("/**").excludePathPatterns("/test");//指定不拦截
        //添加自定义拦截器
        WebMvcConfigurer.super.addInterceptors(registry);
    }
}
```

> 匹配规则：
>
> * addPathPatterns("/*/**") 可以拦截所有请求
>
> * 一个*：只匹配字符，不匹配路径（ / ）
>     两个**：匹配字符，和路径（ / ）
>
> * ```yaml
>     - /**： 匹配所有路径
>     - /admin/**：匹配 /admin/ 下的所有路径
>     - /secure/*：只匹配 /secure/user，不匹配 /secure/user/info
>     ```
>
> addPathPatterns("`/**`") 表示拦截所有的请求
> addPathPatterns("`/**`") 表示拦截所有的请求
> addPathPatterns("`/test/**`") 表示拦截/test/ 下的所有路径请求
> addPathPatterns("`/test/*`") 表示拦截/test/abc，拦截/test/aaa , 不拦截 /test/abc/def
> addPathPatterns("`/test/`").excludePathPatterns("`/test/login`", “`/test/register`”) 表示拦截/test/ 下的所有路径请求，但不拦截 /test/login 和 /test/register


### 3. 测试类

在 static 目录下创建 index.html 以及 controller 测试类。

```java
package com.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class InterceptorController {
    @RequestMapping("/interceptor/myinterceptor")
    public String myinterceptor(){
        System.out.println("myinterceptor");
        return "/index.html";
    }
}
```

访问 controller 测试，拦截器生效。
