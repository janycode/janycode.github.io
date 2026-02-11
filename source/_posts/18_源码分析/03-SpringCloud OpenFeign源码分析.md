---
title: 03-SpringCloud OpenFeign源码分析
date: 2021-3-7 17:59:46
tags:
- 源码分析
- Feign
- OpenFeign
categories: 
- 18_源码分析
---



![image-20200729130824878](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200729130826.png)

官网文档：https://spring.io/projects/spring-cloud-openfeign



### 1. 简介

**`Spring Cloud OpenFeign`** : Declarative REST Client: Feign（音[feɪn]即"飞恩", 声明式 REST 服务调用）是一种声明式的 webService 客户端，可以使用它的注解修饰接口，它也支持自定义编解码。Spring Cloud 集成了 **Ribbon 和 Eureka 为客户端提供了负载均衡策略**。

Feign是实现服务的远程调用技术。主要是作用在服务客户端，用于实现服务的调用。  

Feign有两个主要注解： `@EnableFeignClients` 用于开启feign功能，`@FeignClient` 用于定义feign 接口

### 2. 基本使用

#### 2.1 Feign 依赖

```xml
<!--OpenFeign-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

#### 2.2 Feign 注解

接口：

```java
@FeignClient(name = "yiguan", url = "${serverapi.yiguan.outer.url}")
public interface YiGuanFeign {
    /**
     * 获取易观统计数据
     *
     * @param params 请求参数
     * @return 返回结果
     */
    @PostMapping("${serverapi.yiguan.outer.accessdataapi}")
    Object getAccessDataApi(@RequestBody Map<String, Object> params);
}
```

启动类：

```java
@SpringBootApplication
@EnableFeignClients
public class MpServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(MpServiceApplication.class, args);
    }
}
```



#### 2.3 Feign 测试

调用外部易观的PV和UV访问数据测试(数据已解析)：

![image-20210307175426921](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210307175428.png)

请求和响应(日志)：

![image-20210307175816223](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210307175817.png)





#### 2.4 Feign 配置(可选)

* Feign 配置自定义连接超时时间、读取响应超时时间

```yml
#Feign 连接超时时间和读取响应超时时间配置
feign:
  client:
    config:
      default:
        connectTimeout: 5000    #连接超时时间
        readTimeout: 5000       #读取超时时间
        loggerLevel: basic      #日志等级
```

* 使用 Okhttp 发送 request

    > `Okhttp优势：`
    > **网络优化方面**：
    > （1）内置连接池，支持连接复用；
    > （2）支持gzip压缩响应体；
    > （3）通过缓存避免重复的请求；
    > （4）支持http2，对一台机器的所有请求共享同一个socket。
    >
    > **功能方面**：
    > 功能全面，满足了网络请求的大部分需求
    >
    > **扩展性方面：**
    > 责任链模式使得很容易添加一个自定义拦截器对请求和返回结果进行处理

```yml
feign:
  client:
    config:
      default:
        connectTimeout: 5000
        readTimeout: 5000
        loggerLevel: basic
  okhttp:
    enabled: true  #使用OKhttp发送request
  hystrix:
    enabled: true
```
* Spring Cloud Feign支持对请求和响应进行 GZIP 压缩，以提高通信效率：

```yml
feign:
  compression:
    request:  #请求
      enabled: true  #开启
      mime-types: text/xml,application/xml,application/json  #开启支持压缩的MIME TYPE
      min-request-size: 2048  #配置压缩数据大小的下限
    response:  #响应
      enabled: true  #开启响应GZIP压缩
```



### 3. 源码分析

疑问：

* `请求是如何转到 Feign 的 ?`

* `Feign 是怎么工作的 ?`

* `Feign 的负载均衡策略？`

通过源码分析解答这三个疑问。

#### 3.1 原理和源码详解

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
@Import(FeignClientsRegistrar.class)
public @interface EnableFeignClients {
	String[] value() default {};
	String[] basePackages() default {};
	Class<?>[] basePackageClasses() default {};
	Class<?>[] defaultConfiguration() default {};
	Class<?>[] clients() default {};
}
```

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface FeignClient {
	@AliasFor("name")
	String value() default "";
	@Deprecated
	String serviceId() default "";
	@AliasFor("value")
	String name() default "";
	String qualifier() default "";
	String url() default "";
	boolean decode404() default false;
	Class<?>[] configuration() default {};
	Class<?> fallback() default void.class;
	Class<?> fallbackFactory() default void.class;
	String path() default "";
	boolean primary() default true;
}
```



1. Feign基本原理

- 启动时，程序会进行包扫描，扫描所有包下所有 @FeignClient 注解的类，并将这些类注入到 spring 的 IOC 容器中。当定义的 Feign 中的接口被调用时，通过 JDK 的动态代理来生成 RequestTemplate。
- RequestTemplate 中包含请求的所有信息，如请求参数，请求URL等。
- RequestTemplate 生成 Request，然后将 Request 交给 client 处理，这个 client 默认是 JDK 的 HTTPUrlConnection ，也可以是 OKhttp、Apache 的 HTTPClient 等。
- 最后 client 封装成 LoadBaLanceClient，结合 Ribbon 负载均衡地发起调用。

2. Feign源码分析(图解)

![image-20210307174113861](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210307174115.png)

![image-20210307174301648](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210307174303.png)



#### 3.2 请求是如何转到 Feign 的？

分为两部分，第一是为接口定义的每个接口都生成一个实现方法，结果就是 SynchronousMethodHandler 对象。第二是为该服务接口生成了动态代理。动态代理的实现是 ReflectiveFeign.FeignInvocationHanlder，代理被调用的时候，会根据当前调用的方法，转到对应的 SynchronousMethodHandler。

#### 3.3 Feign 是怎么工作的？

当对接口的实例进行请求时（Autowire 的对象是某个ReflectiveFeign.FeignInvocationHanlder 的实例），根据方法名进入了某个 SynchronousMethodHandler 对象的 invoke 方法。

SynchronousMethodHandler 其实也并不处理具体的 HTTP 请求，它关心的更多的是请求结果的处理。HTTP 请求的过程，包括服务发现，都交给了当前 context 注册中的 Client 实现类，比如 LoadBalancerFeignClient。Retry 的逻辑实际上已经提出来了，但是 fallback 并没有在上面体现，因为我们上面分析动态代理的过程中，用的是 Feign.Builder，而如果有 fallback 的情况下，会使用 HystrixFeign.Builder，这是 Feign.Builder 的一个子类。它在创建动态代理的时候，主要改了一个一个东西，就是 invocationFactory 从默认的 InvocationHandlerFactory.Default 变成了一个内部匿名工厂，这个工厂的create 方法返回的不是 ReflectiveFeign.FeignInvocationHandler，而是 HystrixInvocationHandler。所以动态代理类换掉了，invoke 的逻辑就变了。在新的逻辑里，没有简单的将方法转到对应的 SynchronousMethodHandler 上面，而是将 fallback 和 SynchronousMethodHandler一起封装成了 HystrixMethod，并且执行该对象。

#### 3.4 Feign 的负载均衡策略？

Feign 默认集成了 Ribbon 的`轮询`方式的负载均衡策略。

Feign 的时候，如何去切换到 Ribbon 中其他均衡策略呢？甚至切换到自定义的策略呢？

在 application.yml 配置文件中来指定，如下：

```yml
# feign和ribbon结合，指定负载均衡策略为【随机策略】
MICROSERVICE-ORDER:
 ribbon:
   NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule
```

MICROSERVICE-ORDER 表示作用到哪个微服务，com.netflix.loadbalancer.RandomRule 即 Ribbon 里面的随机策略，当然，也可以指定为其他策略，包括自己定义的，只要把相应的包路径写到这即可。