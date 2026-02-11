---
title: Spring Cloud Sleuth
date: 2020-03-02 17:59:44
tags:
- 微服务
- Sleuth
- SpringCloudAlibaba
categories: 
- 14_微服务
- 06_链路追踪
---



![image-20200729130824878](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200729130826.png)



官方地址：https://spring.io/projects/spring-cloud-sleuth

中文文档参考：https://segmentfault.com/a/1190000018986743



### 1. Sleuth 简介

Spring Cloud Sleuth为Spring Cloud实现了分布式跟踪解决方案。
其实是一个工具,它在整个分布式系统中能跟踪一个用户请求的过程(包括数据采集，数据传输，数据存储，数据分析，数据可视化)，捕获这些跟踪数据，就能构建微服务的整个调用链的视图，这是调试和监控微服务的关键具。  

功能：`提供链路追踪`、`性能分析`、`数据分析/优化业务`、`可视化`

#### 1.1 术语

Span：基本工作单元，发送一个远程调度任务 就会产生一个Span，Span是一个64位ID唯一标识的，Trace是用另一个64位ID唯一标识的，Span还有其他数据信息，比如摘要、时间戳事件、Span的ID、以及进度ID。
**迹线：**一组spans，形成树状结构
**注释：**用于及时记录事件的存在，一些核心注解用来定义一个请求的开始和结束，这些注解包括以下：

* cs：客户端已发送。客户提出了要求。此注释指示跨度的开始。
* sr：服务器收到数据：服务器端收到了请求并开始处理它。从此时间戳中减去 cs 时间戳可显示网络延迟。
* ss：服务器已发送。在请求处理完成时进行注释（当响应被发送回客户端时）。从此时间戳中减去 sr 时间戳将显示服务器端处理请求所需的时间。
* cr：客户端收到数据。表示跨度结束。客户端已成功收到服务器端的响应。从此时间戳中减去 cs 时间戳将显示客户端从服务器接收响应所需的整个时间。  



### 2. Zipkin 安装

Zipkin是一个分布式跟踪系统。它有助于收集解决服务体系结构中的延迟问题所需的时序数据。功能包括该数据的收集和查找。

实现步骤：

1. 下载
   https://dl.bintray.com/openzipkin/maven/io/zipkin/java/zipkin-server/
   https://search.maven.org/remote_content?g=io.zipkin&a=zipkin-server&v=LATEST&c=exec
2. 启动运行

    ```sh
    #依赖 jdk 环境，win或linux均可直接运行，默认端口 9411 启动
    java -jar zipkin-server-2.21.4.exec.jar
    
    # 指定端口启动
    java -jar zipkin-server-2.21.5-exec.jar --server.port=8099
    ```

3. 浏览器访问
    http://localhost:9411  

![image-20200731145743947](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200731145744.png)



### 3. Sleuth 应用

1. 依赖 jar

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-sleuth</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-zipkin</artifactId>
</dependency>
```

2. 配置文件
    `服务提供者` & `服务消费者` 都可配置链路跟踪，跟踪接口响应时间。

```yaml
server:
  port: 8081
spring:
  application:
    name: jerryProvider  #服务名称
  cloud:
    nacos:
      discovery:
        server-addr: 47.94.193.104:8848  #注册中心地址
  sleuth:
    sampler:
      probability: 1  #采样率
  zipkin:
    sender:
      type: web  #采用 http 协议进行传输
    base-url: http://localhost:9411/  # zipkin的控制台地址，默认 9411 端口启动
```



> 如果需要知道详细的调用过程，那么可以配置日志框架：
>
> 1.配置日志文件
>
> 使用的日志是SpringBoot 推荐的logback
>
> 2.在需要的地方：方法调用的时候需要记录日志
>
> 在类上：@Slf4j
>
> 在对应的方法中，直接使用log.xxx(日志信息)  



