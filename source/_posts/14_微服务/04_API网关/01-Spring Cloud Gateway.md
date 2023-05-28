---
title: 01-Spring Cloud Gateway
date: 2020-03-02 17:59:44
tags:
- 微服务
- SpringCloudAlibaba
- Gateway
categories: 
- 14_微服务
- 04_API网关
---



![image-20200729130824878](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200729130826.png)



官网地址：https://spring.io/projects/spring-cloud-gateway

中文文档参考：https://www.jianshu.com/p/6ff196940b67



### 1. Gateway 简介

Spring Cloud Gateway 是 Spring Cloud 的一个全新项目，该项目是基于Netty、Reactor以及WEbFlux构建，它旨在为微服务架构提供一种简单有效的统一的 `API 路由管理`方式。 Spring Cloud Gateway 作为 Spring Cloud 生态系统中的网关，目标是替代 Netflix Zuul，其不仅提供统一的路由方式，并且基于 Filter 链的方式提供了网关基本的功能，例如：`安全`、`监控`、`埋点`和`限流`等。  

* 优点
    性能强劲，是Zuul的1.6倍 功能强大，内置了很多实用的功能，例如转发、监控、限流等 设计优雅，容易扩展
* 缺点
    依赖Netty与WebFlux，不是传统的Servlet编程模型，不能在Servlet容器下工作，也不能构建成WAR包，即不能将其部署在Tomcat、Jetty等Servlet容器里，只能打成jar包执行 不支持Spring Boot 1.x，需2.0及更高的版本  

#### 1.1 核心

* **Route（路由）**
    这是Spring Cloud Gateway的基本构建块，可简单理解成一条转发规则。包含：ID、目标URL、一组断言和一组过滤器可以根据规则进行匹配
* **Predicate（断言）**
    这是一个 Java 8 的 Predicate，即java.util.function.Predicate这个接口，Gateway使用Predicate实现路由的匹配条件
* **Filter（过滤器）**
    这是 org.springframework.cloud.gateway.filter.GatewayFilter 的实例，我们可以使用它修改请求和响应  

![image-20200731133036595](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200731133038.png)

客户端向Spring Cloud Gateway发出请求。如果Gateway Handler Mapping确定请求与路由匹配，则将其发送到Gateway Web Handler。此handler通过特定于该请求的过滤器链处理请求。图中filters被虚线划分的原因是filters可以在发送代理请求之前或之后执行逻辑。先执行所有“pre filter”逻辑，然后进行请求代理。在请求代理执行完后，执行“post filter”逻辑。

> 注意
>  HTTP和HTTPS URI默认端口设置是80和443。

#### 1.2 路由匹配规则

![image-20200731133232265](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200731133233.png)



#### 1.3 官方配置文件

application.yml

```yml
#在该日期时间之后发生的请求都将被匹配。
spring:
  cloud:
    gateway:
      routes:
      - id: after_route
        uri: http://example.org
        predicates:
        - After=2017-01-20T17:42:47.789-07:00[America/Denver]

#在该日期时间之前发生的请求都将被匹配。
spring:
  cloud:
    gateway:
      routes:
      - id: before_route
        uri: http://example.org
        predicates:
        - Before=2017-01-20T17:42:47.789-07:00[America/Denver]

#在datetime1和datetime2之间的请求将被匹配。datetime2参数的实际时间必须在datetime1之后。
spring:
  cloud:
    gateway:
      routes:
      - id: between_route
        uri: http://example.org
        predicates:
        - Between=2017-01-20T17:42:47.789-07:00[America/Denver], 2017-01-21T17:42:47.789-07:00[America/Denver]

#请求包含次cookie名称且正则表达式为真的将会被匹配。
spring:
  cloud:
    gateway:
      routes:
      - id: cookie_route
        uri: http://example.org
        predicates:
        - Cookie=chocolate, ch.p

#请求包含次header名称且正则表达式为真的将会被匹配。
spring:
 cloud:
   gateway:
     routes:
     - id: header_route
       uri: http://example.org
       predicates:
       - Header=X-Request-Id, \d+

#使用Ant路径匹配规则 .作为分隔符。
spring:
  cloud:
    gateway:
      routes:
      - id: host_route
        uri: http://example.org
        predicates:
        - Host=**.somehost.org,**.anotherhost.org

#需要匹配的HTTP请求方式
spring:
  cloud:
    gateway:
      routes:
      - id: method_route
        uri: http://example.org
        predicates:
        - Method=GET

#一个Spring PathMatcher表达式列表和可选matchOptionalTrailingSeparator标识
#例如: /foo/1 or /foo/bar or /bar/baz的请求都将被匹配
spring:
  cloud:
    gateway:
      routes:
      - id: host_route
        uri: http://example.org
        predicates:
        - Path=/foo/{segment},/bar/{segment}

#必选项 param 和可选项 regexp. 包含了请求参数 baz的都将被匹配。
spring:
  cloud:
    gateway:
      routes:
      - id: query_route
        uri: http://example.org
        predicates:
        - Query=baz

#一个CIDR符号（IPv4或IPv6）字符串的列表，最小值为1，例如192.168.0.1/16（其中192.168.0.1是IP地址并且16是子网掩码）
spring:
  cloud:
    gateway:
      routes:
      - id: remoteaddr_route
        uri: http://example.org
        predicates:
        - RemoteAddr=192.168.1.1/24
```

... ... 更多过滤规则参考：https://www.jianshu.com/p/6ff196940b67



### 2. Gateway 应用

作为独立项目，承载请求的统一入口处理。

* `网关服务内部使用的 Netty 通信，发布的时候只能使用 jar 包`
* 网关服务要部署在`外网服务器`：对外。其他服务在内网服务器，除了邮件等...

1. 依赖 jar

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    <version>2.2.1.RELEASE</version>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

2. 实现路由配置 application.yml

```yaml
server:
  port: 80
spring:
  application:
    name: jerrygateway #路由服务的名称
  cloud:
    nacos:
      discovery:
        server-addr: 47.94.193.104:8848  #注册中心地址
#路由匹配转发，注意 routes 配置中的格式
    gateway:
      discovery: #可以实现注册中心所有服务的直接访问(一般不会开启) - 请求网关，后面追加服务的名称(全小写)
        locator:
          enabled: true #允许从注册中心直接访问服务
          lower-case-service-id: true #服务名称小写访问
      routes:
      - id: openapi #任意命名，唯一即可
        uri: lb://jerryConsumer #标记匹配的服务，如果来自注册中心，则配置为lb://服务的名称
        predicates:
        - Path=/open/** #请求路径，即外界需要请求的名称，如果请求匹配，那就转发到请求的服务上
        filters:
        - StripPrefix=1
#      - id: xxx # 可以配置多个路由过滤的服务
```

3. 配置启动类

```java
@SpringBootApplication
@EnableDiscoveryClient  //启动服务发现
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class,args);
    }
}
```

4. 测试
    访问消费者的 swagger2 的 doc.html 需要使用路径：http://localhost/open/doc.html
    * open 为 Path=/open/** 中配置的访问路径匹配



### 3. Gateway 过滤器

全局过滤器 GlobalFilter、路由过滤器 GatewayFilter

* 全局过滤器测试

```java
@Component
@Slf4j
public class VersionFilter implements GlobalFilter, Ordered {
    /**
     * Gateway 全局过滤器
     * @param exchange
     * @param chain
     * @return
     */
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info("过滤器----->");

        ServerHttpRequest request = exchange.getRequest();
        ServerHttpResponse response = exchange.getResponse();
        //设置状态响应码 和 响应格式
        response.setStatusCode(HttpStatus.BAD_REQUEST);
        //response.getHeaders().add("Content-Type", "application/json;charset=UTF-8");
        response.getHeaders().add("Content-Type", "text/html;charset=UTF-8");

        if (request.getQueryParams().containsKey("version")) {
            //验证版本号
            double v = Double.parseDouble(request.getQueryParams().get("version").get(0));
            log.info("过滤器----->版本号：" + v);
            if (v == 1.0) {
                // 放行
                return chain.filter(exchange);
            } else {
                //当前版本不支持
                DataBuffer dataBuffer = response.bufferFactory().wrap(new JSONObject(R.fail("当前版本不支持，请尽快升级")).toString().getBytes());
                // 返回响应信息
                return response.writeWith(Mono.just(dataBuffer));
            }
        } else {
            //响应信息
//            DataBuffer dataBuffer = response.bufferFactory().wrap(
//                    new JSONObject(R.fail("当请传递版本号，version")).toString().getBytes());
//            return response.writeWith(Mono.just(dataBuffer));
            // 放行
            return chain.filter(exchange);
        }
    }

    /**
     * 排序 项目中有多个过滤器，那么可以通过Order设置执行顺序 数值越小，优先级越高
     *
     * @return
     */
    @Override
    public int getOrder() {
        return 1;
    }
}
```

* 路由过滤器（自定义过滤器）测试

```java
// 定义过滤器
@Component //IOC 容器对象
public class TokenFilter implements GatewayFilter, Ordered {
    //实现过滤处理
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        System.out.println("过滤器……");
        return chain.filter(exchange);//放行
    }

    //排序 项目中有多个过滤器，那么可以通过Order设置执行
    @Override
    public int getOrder() {
        return 0;
    }
}

// 实现路由和过滤器配置
@Configuration
public class GatewayConfig {
    //全程都是函数式编程
    @Bean
    public RouteLocator createRL(RouteLocatorBuilder builder, TokenFilter tf) {
        //配置网关中心通过 open 作为一级目录访问，过滤请求转发到 jerryConsumer 消费者服务中
        return builder.routes().route(r -> r.path("/open/**").
                filters(f -> f.stripPrefix(1).filters(tf)).
                uri("lb://jerryConsumer")).build();
    }
}
```

测试：访问消费者的 swagger2 的 doc.html 需要使用路径 http://localhost/open/doc.html