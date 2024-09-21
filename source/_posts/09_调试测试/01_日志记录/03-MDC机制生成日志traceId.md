---
title: 03-MDC机制生成日志traceId
date: 2016-8-19 16:11:08
tags:
- logback
- Spring
categories: 
- 09_调试测试
- 01_日志记录
---



## MDC机制

**MDC**（Mapped Diagnostic Context）是一种用于在日志记录过程中传递上下文信息的机制。它允许将自定义的键值对与日志记录相关联，并在日志输出时自动将这些键值对添加到日志消息中

使用MDC（Mapped Diagnostic Context）的主要目的是在日志记录过程中携带和传递上下文信息。以下是一些使用MDC的好处和原因：

* 跟踪和调试：MDC允许将关键的上下文信息与每条日志消息相关联。例如，请求ID、用户信息、会话ID等。这样，当日志中出现问题或需要进行故障排除时，可以更轻松地跟踪和调试，因为您可以查看包含相关上下文信息的日志消息。

* 上下文感知日志记录：MDC使日志记录更加上下文感知。通过将关键信息添加到MDC上下文中，这些信息将自动出现在日志消息中，而无需手动编写并在每个日志语句中添加。这样可以避免代码中的重复工作，提高代码的可读性和可维护性。

* 安全审计：对于安全审计和合规性方面的需求，MDC可以用于记录关键的安全信息，例如用户身份、操作类型、时间戳等。这些信息可以用于后续的审计和监控，以确保系统的安全性和合规性。

* 多线程环境支持：MDC在多线程环境中是线程安全的。它为每个线程维护独立的MDC上下文，因此线程之间的上下文信息不会相互干扰。这对于并发和多线程应用程序非常重要。

* 日志聚合和分析：MDC的上下文信息可以用于日志聚合和分析。通过将相同请求或操作的日志消息关联到相同的上下文，可以更轻松地对日志进行分组、过滤和分析，以获得更全面的视图和洞察力。



## 使用

基于ruoyi框架的springboot项目为示例：

### 1. 定义traceId标记字符串

```java
package com.ruoyi.common.constant;

/**
 * 通用常量信息
 */
public class Constants {
    public static final String TRACE_ID = "TRACE_ID";
}

```



### 2. 拦截器中实现

```java
package com.ruoyi.framework.config.web;

import com.baomidou.mybatisplus.core.toolkit.SystemClock;
import com.ruoyi.common.utils.uuid.IdUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.MDC;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

import static com.ruoyi.common.constant.Constants.TRACE_ID;

@Slf4j
public class LogInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object obj) throws Exception {
        request.setAttribute("start_time", SystemClock.now());
        String ipAddress = RequestUtil.getIPAddress(request);
        String requestURI = request.getRequestURI();
        Map<String, String> parameterMap = RequestUtil.parseRequestParam(request);
        Map<String, String> headersMap = RequestUtil.parseRequestHeaderParam(request);
        MDC.put(TRACE_ID, IdUtils.fastSimpleUUID());
        log.info(">>请求日志:请求的api={},请求参数={},请求header参数={},请求的ip={}", requestURI, parameterMap, headersMap, ipAddress);
        return true;
    }


    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object arg2, Exception arg3) {
        String ipAddress = RequestUtil.getIPAddress(request);
        String requestURI = request.getRequestURI();
        String responseParameter;

        if (requestURI != null && requestURI.contains("export") && ResponseUtil.getResponseDataSize(response) > 200) {
            responseParameter = "该请求为下载文件类型请求不显示具体值";
        } else if (StringUtils.isNotEmpty(response.getHeader("Content-Disposition")) && ResponseUtil.getResponseDataSize(response) > 200) {
            responseParameter = "响应为下载类型不显示具体值，Content-Disposition值为" + response.getHeader("Content-Disposition");
        } else if (requestURI.startsWith("/view")) {
            responseParameter = "响应为静态页面类型不显示具体值";

        } else {
            responseParameter = ResponseUtil.getResponseParameter(response);
        }
        long startTime = (long) request.getAttribute("start_time");
        long endTime = SystemClock.now();
        long total = endTime - startTime;
        log.info(">>响应日志:请求的api={},返回参数={},请求的ip={},接口耗时毫秒值={}", requestURI, responseParameter, ipAddress, total);
        MDC.remove(TRACE_ID);
    }

    @Override
    public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, ModelAndView arg3) {
    }

}
```



### 3. 注册拦截器

注册日志拦截器，只需要加入此行。

```java
package com.ruoyi.framework.config;

/**
 * 通用配置
 */
@Configuration
public class ResourcesConfig implements WebMvcConfigurer {
    ...

    /**
     * 自定义拦截规则
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(repeatSubmitInterceptor).addPathPatterns("/**");
        registry.addInterceptor(downLoadErrorInterceptor).addPathPatterns(
                "/preparationExams/questionBank/export*",
                "/preparationExams/examPaper/downloadRandom",
                "/preparationExams/examPaper/download/*",
                "/preparationExams/exam/download*",
                "/preparationExams/practice/download/*",
                "/*/practice/downloadPaper",
                "/*/exam/download"
        );
        //注册日志拦截器
        registry.addInterceptor(new LogInterceptor()).addPathPatterns("/**").order(-1);
    }

    ...
}
```



### 4. logback改造

![image-20240819161753666](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240819161754.png)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- 日志存放路径 -->
    <property name="log.path" value="logs"/>
    <!-- 日志输出格式 -->
    <property name="log.pattern" value="%d{HH:mm:ss.SSS} [%thread] %-5level %logger{20} - [%method,%line] - [%X{TRACE_ID}] - %msg%n"/>

    <!-- 控制台输出 -->
    <appender name="console" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>${log.pattern}</pattern>
        </encoder>
    </appender>

...//部分代码展示 ↑
```



## 线程中使用MDC机制

参考工具类：[TraceIdGenerator](https://yuancodes.github.io/#/./20_%E6%94%B6%E8%97%8F%E6%95%B4%E7%90%86/03_%E5%B7%A5%E5%85%B7%E7%B1%BB/16-TraceIdGenerator)