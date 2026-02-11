---
title: Spring Cloud Alibaba快速上手
date: 2020-03-02 17:59:42
tags:
- SpringCloud
- SpringCloudAlibaba
categories: 
- 08_框架技术
- 05_SpringCloud
---



![image-20200814133640125](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200814133641.png)



# 1、简单了解 SpringCloud

**官网地址：**https://spring.io/projects/spring-cloud

**spring-cloud-alibaba:(基于2.2.7.RELEASE** **)**

https://spring-cloud-alibaba-group.github.io/github-pages/hoxton/en-us/index.html

## 1.1 概述：

Spring Cloud 为开发者提供了工具来快速构建分布式系统中的一些常见模式（例如配置管理、服务发现、断路器、智能路由、微代理、控制总线、一次性令牌、全局锁、领导选举、分布式会话，集群状态）。

分布式系统的协调导致了样板模式，使用 Spring Cloud 开发人员可以快速建立实现这些模式的服务和应用程序。它们在任何分布式环境中都能很好地工作，包括开发人员自己的笔记本电脑、裸机数据中心以及 Cloud Foundry 等托管平台。

## 1.2 特征

Spring Cloud 专注于为典型用例提供良好的开箱即用体验，并提供可扩展机制以覆盖其他用例。

- 分布式/版本化配置
- 服务注册和发现
- 路由
- 服务到服务调用
- 负载均衡
- 断路器
- 全局锁
- leader选举和集群状态
- 分布式消息传递

> **如果您想要将 Spring Cloud 添加到该应用程序的现有 Spring Boot 应用程序，则第一步是确定您应该使用的 Spring Cloud 版本。您在应用程序中使用的版本取决于您使用的 Spring Boot 版本。** 

### SpringCloud 与 Spring Boot 兼容性（版本对应关系）

| Spring Cloud 发行版本 | Spring Boot 版本                      |
| --------------------- | ------------------------------------- |
| 2021.0.x aka Jubilee  | 2.6.x                                 |
| 2020.0.x aka Ilford   | 2.4.x, 2.5.x (Starting with 2020.0.3) |
| Hoxton                | 2.2.x, 2.3.x (Starting with SR5)      |
| Greenwich             | 2.1.x                                 |
| Finchley              | 2.0.x                                 |
| Edgware               | 1.5.x                                 |
| Dalston               | 1.5.x                                 |

Spring Cloud Dalston, Edgware, Finchley, and Greenwich 都已达到生命周期结束状态，不再受支持.

**spring-cloud==>** Hoxton.SR5

**spring-cloud-alibaba==>** 2.2.7.RELEASE

**spring-boot ==>** 2.2.10.RELEASE

## 1.3 引入依赖

### 1.3.1 以maven的方式

```xml
<properties>
  <spring.cloud-version>Hoxton.SR8</spring.cloud-version>
</properties>
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-dependencies</artifactId>
      <version>${spring.cloud-version}</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

如果我们使用的是maven版本，我们可以在父项目里面使用management 并把这个依赖放进去，这样我们可以管理版本spring-cloud相关依赖项（重点是版本控制）

### 1.3.2 以gradle的方式

```json
buildscript {
  dependencies {
  classpath "io.spring.gradle:dependency-management-plugin:1.0.10.RELEASE"
}
}

ext {
  set('springCloudVersion', "Hoxton.SR8")
}


apply plugin: "io.spring.dependency-management"
  
  dependencyManagement {
  imports {
  mavenBom "org.springframework.cloud:spring-cloud-dependencies:${springCloudVersion}"
}
}
```

# 2.关于Spring Cloud Alibaba

## 2.1概念与特性

Spring Cloud Alibaba 提供分布式应用开发的一站式解决方案。它包含开发分布式应用程序所需的所有组件，使您可以轻松地使用 Spring Cloud 开发应用程序。

使用 Spring Cloud Alibaba，您只需要添加一些注解和少量配置，即可将 Spring Cloud 应用连接到阿里巴巴的分布式解决方案，并通过阿里巴巴中间件构建分布式应用系统。

![image-20230527223624479](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527223625.png)

1. **流量控制和服务降级**：支持WebServlet、WebFlux、OpenFeign、RestTemplate、Dubbo接入限流降级功能。可以在运行时通过控制台实时修改限流和降流规则，还支持对限流和降流Metrics的监控。
2. **服务注册和发现**：可以注册服务，客户端可以使用 Spring 管理的 bean，自动集成 Ribbon 发现实例。
3. **分布式配置**：支持分布式系统的外部化配置，配置变化时自动刷新。
4. **Rpc Service**：扩展 Spring Cloud 客户端 RestTemplate 和 OpenFeign 以支持调用 Dubbo RPC 服务。
5. **事件驱动**：支持构建与共享消息系统连接的高度可扩展的事件驱动微服务。
6. **分布式事务**：支持高性能、易用的分布式事务解决方案。
7. **阿里云对象存储**：海量、安全、低成本、高可靠的云存储服务。支持随时随地在任何应用程序中存储和访问任何类型的数据。
8. **阿里云SchedulerX**：精准、高可靠、高可用的定时作业调度服务，响应时间秒级。
9. **阿里云短信**：覆盖全球的短信服务，阿里短信提供便捷、高效、智能的通信能力，帮助企业快速联系客户。 

## 2.2 父依赖:

最简单的入门方法是包含 Spring Cloud BOM，然后添加spring-cloud-alibaba-dependencies到应用程序的类路径中。如果您不想包含所有 Spring Cloud Alibaba 功能，您可以为您想要的功能添加单独的启动器。

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>com.alibaba.cloud</groupId>
      <artifactId>spring-cloud-alibaba-dependencies</artifactId>
      <version>{project-version}</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

**父项目主要依赖：**

```xml
    <properties>
        <spring.cloud.version>Hoxton.SR5</spring.cloud.version>
        <spring.cloud.alibaba.version>2.2.7.RELEASE</spring.cloud.alibaba.version>
        <spring.boot.version>2.2.10.RELEASE</spring.boot.version>
        <java.version>1.8</java.version>
    </properties>

    <dependencyManagement>
        <dependencies>
           <!--spring-cloud相关依赖集-->
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring.cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
           <!--spring-cloud-alibaba相关依赖集-->
            <dependency>
                <groupId>com.alibaba.cloud</groupId>
                <artifactId>spring-cloud-alibaba-dependencies</artifactId>
                <version>${spring.cloud.alibaba.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <!-- spring-boot版本 -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot</artifactId>
                <version>${spring.boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
```

**其他依赖**

```xml
   <properties>
        <spring.cloud.version>Hoxton.SR5</spring.cloud.version>
        <spring.cloud.alibaba.version>2.2.7.RELEASE</spring.cloud.alibaba.version>
        <spring.boot.version>2.2.10.RELEASE</spring.boot.version>
        <maven-deploy-plugin.version>2.8.2</maven-deploy-plugin.version>
        <java.version>1.8</java.version>
        <junit.version>4.13.2</junit.version>
        <log4j.version>1.2.12</log4j.version>
        <lombok.version>1.16.10</lombok.version>
        <logback.version>1.2.5</logback.version>
        <mybatis.springboot.start.version>1.3.2</mybatis.springboot.start.version>
        <alibaba.druid.version>1.1.10</alibaba.druid.version>
        <mysql.version>5.1.47</mysql.version>
    </properties>
<dependencyManagement>
        <dependencies>
        <!--数据库-->
            <!-- https://mvnrepository.com/artifact/mysql/mysql-connector-java -->
            <dependency>
                <groupId>mysql</groupId>
                <artifactId>mysql-connector-java</artifactId>
                <version>${mysql.version}</version>
            </dependency>

            <!--数据源-->
            <!-- https://mvnrepository.com/artifact/com.alibaba/druid -->
            <dependency>
                <groupId>com.alibaba</groupId>
                <artifactId>druid</artifactId>
                <version>${alibaba.druid.version}</version>
            </dependency>

            <!--spring-boot-mybatis启动器-->
            <!-- https://mvnrepository.com/artifact/org.mybatis.spring.boot/mybatis-spring-boot-starter -->
            <dependency>
                <groupId>org.mybatis.spring.boot</groupId>
                <artifactId>mybatis-spring-boot-starter</artifactId>
                <version>${mybatis.springboot.start.version}</version>
            </dependency>

            <!--lombok-->
            <!-- https://mvnrepository.com/artifact/org.projectlombok/lombok-maven-plugin -->
            <dependency>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
            </dependency>

            <!--junit-->
            <dependency>
                <groupId>junit</groupId>
                <artifactId>junit</artifactId>
                <version>${junit.version}</version>
            </dependency>

            <!--log4j-->
            <dependency>
                <groupId>log4j</groupId>
                <artifactId>log4j</artifactId>
                <version>${log4j.version}</version>
            </dependency>

            <!--logback-core-->
            <!-- https://mvnrepository.com/artifact/ch.qos.logback/logback-core -->
            <dependency>
                <groupId>ch.qos.logback</groupId>
                <artifactId>logback-core</artifactId>
                <version>${logback.version}</version>
            </dependency>
                  </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <!-- 指定jdk版本 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <!-- 源码的编译器版本 -->
                    <source>${java.version}</source>
                    <!-- class的编译器版本 -->
                    <target>${java.version}</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
```

## 2.3  相关端口

```
端口 模块名称
8848 (默认) 注册中心
8801 Nacos配置服务
8081 生产者1
8082 生产者2
8083 生产者3
8282 消费者
8383 服务熔断降级、限流
8384 Sentinel-Feign
8385 网关Zuul
8386 网关GateWay
8686 RocketMQ
8900 seata-business-Service
8980 seata-storage-Service
8981 seata-order-Service
8982 seata-account-Service
```

## 2.4 Nacos (服务注册与发现 )

快速下载地址：https://sourceforge.net/mirror/nacos/activity/

![image-20230527223904894](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527223905.png)
控制台网址 ：[http://ip:8848/nacos](https://link.juejin.cn?target=http%3A%2F%2Fip%3A8848%2Fnacos)   账号 ：nacos   密码：nacos

### 服务注册/服务发现 核心依赖：

```xml
   <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
   </dependency>
```

### 核心注解：

@EnableDiscoveryClient

## 2.5 Sentinel (哨兵：流量控制、流量路由、熔断降级)

快速下载地址：https://sourceforge.net/projects/sentinel.mirror/

文档：[Sentinel: 分布式系统的流量防卫兵](https://github.com/alibaba/Sentinel/wiki/%E4%BB%8B%E7%BB%8D)

Sentinel 的主要特性：
![image-20230527224119992](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527224121.png)

Sentinel 分为两个部分:

- 核心库（Java 客户端）不依赖任何框架/库，能够运行于所有 Java 运行时环境，同时对 Dubbo / Spring Cloud 等框架也有较好的支持。
- 控制台（Dashboard）基于 Spring Boot 开发，打包后可以直接运行，不需要额外的 Tomcat 等应用容器。

Sentinel 社区官方网站：https://sentinelguard.io/

### @SentinelResource 注解

注意：注解方式埋点不支持 private 方法。

@SentinelResource 用于定义资源，并提供可选的异常处理和 fallback 配置项。 

@SentinelResource 注解包含以下属性：

> - **value**：资源名称，必需项（不能为空）
>
> - **entryType**：entry 类型，可选项（默认为 EntryType.OUT）
>
> - **blockHandler / blockHandlerClass**: blockHandler 对应处理 BlockException 的函数名称，可选项。blockHandler 函数访问范围需要是 public，返回类型需要与原方法相匹配，参数类型需要和原方法相匹配并且最后加一个额外的参数，类型为 BlockException。blockHandler 函数默认需要和原方法在同一个类中。若希望使用其他类的函数，则可以指定 blockHandlerClass 为对应的类的 Class 对象，注意对应的函数必需为 static 函数，否则无法解析。
>
> - **fallback / fallbackClass**
>
>   fallback 函数名称，可选项，用于在抛出异常的时候提供 fallback 处理逻辑。fallback 函数可以针对所有类型的异常（除了 exceptionsToIgnore 里面排除掉的异常类型）进行处理。fallback 函数签名和位置要求：
>
>   - 返回值类型必须与原函数返回值类型一致；
>   - 方法参数列表需要和原函数一致，或者可以额外多一个 Throwable 类型的参数用于接收对应的异常。
>   - fallback 函数默认需要和原方法在同一个类中。若希望使用其他类的函数，则可以指定 fallbackClass 为对应的类的 Class 对象，注意对应的函数必需为 static 函数，否则无法解析。
>
> - **defaultFallback**
>
>   since 1.6.0：默认的 fallback 函数名称，可选项，通常用于通用的 fallback 逻辑（即可以用于很多服务或方法）。默认 fallback 函数可以针对所有类型的异常（除了 exceptionsToIgnore 里面排除掉的异常类型）进行处理。若同时配置了 fallback 和 defaultFallback，则只有 fallback 会生效。defaultFallback 函数签名要求：
>
>   - 返回值类型必须与原函数返回值类型一致；
>   - 方法参数列表需要为空，或者可以额外多一个 Throwable 类型的参数用于接收对应的异常。
>   - defaultFallback 函数默认需要和原方法在同一个类中。若希望使用其他类的函数，则可以指定 fallbackClass 为对应的类的 Class 对象，注意对应的函数必需为 static 函数，否则无法解析。
>
> - **exceptionsToIgnore**（since 1.6.0）：用于指定哪些异常被排除掉，不会计入异常统计中，也不会进入 fallback 逻辑中，而是会原样抛出。

### 核心依赖

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>
```

### 服务限流

#### 概述

流量控制（flow control），其原理是监控应用流量的 QPS 或并发线程数等指标，当达到指定的阈值时对流量进行控制，以避免被瞬时的流量高峰冲垮，从而保障应用的高可用性。

同一个资源可以创建多条限流规则。FlowSlot 会对该资源的所有限流规则依次遍历，直到有规则触发限流或者所有规则遍历完毕。

一条限流规则主要由下面几个因素组成，我们可以组合这些元素来实现不同的限流效果：

* resource：资源名，即限流规则的作用对象
* count: 限流阈值
* grade: 限流阈值类型（QPS 或并发线程数）
* limitApp: 流控针对的调用来源，若为 default 则不区分调用来源
* strategy: 调用关系限流策略
* controlBehavior: 流量控制效果（直接拒绝、Warm Up、匀速排队）

### 熔断降级

#### 概述

除了流量控制以外，对调用链路中不稳定的资源进行熔断降级也是保障高可用的重要措施之一。一个服务常常会调用别的模块，可能是另外的一个远程服务、数据库，或者第三方 API 等。例如，支付的时候，可能需要远程调用银联提供的 API；查询某个商品的价格，可能需要进行数据库查询。然而，这个被依赖服务的稳定性是不能保证的。如果依赖的服务出现了不稳定的情况，请求的响应时间变长，那么调用服务的方法的响应时间也会变长，线程会产生堆积，最终可能耗尽业务自身的线程池，服务本身也变得不可用。

![image-20230527225312263](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527225313.png)

#### 熔断策略

Sentinel 提供以下几种熔断策略：

- 慢调用比例 (SLOW_REQUEST_RATIO)：选择以慢调用比例作为阈值，需要设置允许的慢调用 RT（即最大的响应时间），请求的响应时间大于该值则统计为慢调用。当单位统计时长（statIntervalMs）内请求数目大于设置的最小请求数目，并且慢调用的比例大于阈值，则接下来的熔断时长内请求会自动被熔断。经过熔断时长后熔断器会进入探测恢复状态（HALF-OPEN 状态），若接下来的一个请求响应时间小于设置的慢调用 RT 则结束熔断，若大于设置的慢调用 RT 则会再次被熔断。
- 异常比例 (ERROR_RATIO)：当单位统计时长（statIntervalMs）内请求数目大于设置的最小请求数目，并且异常的比例大于阈值，则接下来的熔断时长内请求会自动被熔断。经过熔断时长后熔断器会进入探测恢复状态（HALF-OPEN 状态），若接下来的一个请求成功完成（没有错误）则结束熔断，否则会再次被熔断。异常比率的阈值范围是 [0.0, 1.0]，代表 0% - 100%。
- 异常数 (ERROR_COUNT)：当单位统计时长内的异常数目超过阈值之后会自动进行熔断。经过熔断时长后熔断器会进入探测恢复状态（HALF-OPEN 状态），若接下来的一个请求成功完成（没有错误）则结束熔断，否则会再次被熔断。

#### 熔断降级规则说明

熔断降级规则（DegradeRule）包含下面几个重要的属性：

| **Field**          | **说明**                                                     | **默认值** |
| ------------------ | ------------------------------------------------------------ | ---------- |
| resource           | 资源名，即规则的作用对象                                     |            |
| grade              | 熔断策略，支持慢调用比例/异常比例/异常数策略                 | 慢调用比例 |
| count              | 慢调用比例模式下为慢调用临界 RT（超出该值计为慢调用）；异常比例/异常数模式下为对应的阈值 |            |
| timeWindow         | 熔断时长，单位为 s                                           |            |
| minRequestAmount   | 熔断触发的最小请求数，请求数小于该值时即使异常比率超出阈值也不会熔断（1.7.0 引入） | 5          |
| statIntervalMs     | 统计时长（单位为 ms），如 60*1000 代表分钟级（1.8.0 引入）   | 1000 ms    |
| slowRatioThreshold | 慢调用比例阈值，仅慢调用比例模式有效（1.8.0 引入）           |            |

### 集成Feign

**步骤：**

> 1.引入依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>

//不能缺少注册发现
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

> 2.编写配置

```yaml
spring:
  cloud:
    sentinel:
      transport:
        port: 8719
        dashboard: localhost:8080

feign:
  sentinel:
    enabled: true
```

> 3.编写代码

```java
@FeignClient(name = "nacos-provider", fallback = EchoServiceFallback.class, configuration = FeignConfiguration.class)
public interface EchoService {
    @GetMapping(value = "/user/list")
    List<User> userList();
}

class FeignConfiguration {
    @Bean
    public EchoServiceFallback echoServiceFallback() {
        return new EchoServiceFallback();
    }
}

class EchoServiceFallback implements EchoService {
    @Override
    public  List<User> userList() {
        return null;
    }
}

//主启动类
@SpringbootApplication
@EnableFeignClients
public class Application{

} 
```

### Zuul(路由)

https://sentinelguard.io/zh-cn/docs/api-gateway-flow-control.html

> 依赖

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>

<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-alibaba-sentinel-gateway</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-zuul</artifactId>
</dependency>
```

> 配置

```yaml
spring:
  application:
    name: sentinel-zuul
  cloud:
    sentinel:
      transport:
        port: 8719
        dashboard: localhost:8080
      #filter:
      #  enabled: false 
      datasource.ds2.file:
        file: "classpath: gateway.json"
        ruleType: gw-flow
      datasource.ds1.file:
        file: "classpath: api.json"
        ruleType: gw-api-group
      zuul.enabled: true
      eager: true
server:
  port: 8385

management.endpoints.web.exposure.include: "*"

zuul:
  routes:
    myUser:
      path: /myUser1/**
      serviceId: nacos-provider
      #url: http://localhost:8081
      #stripPrefix: false

#nacos-provider:
#  ribbon:
#    NIWSServerListClassName: com.netflix.loadbalancer.ConfigurationBasedServerList
#    listOfServers: http://localhost:8081,http://localhost:8082
#    ConnectTimeout: 1000
#    ReadTimeout: 3000
#    MaxTotalHttpConnections: 500
#    MaxConnectionsPerHost: 100
```

发生限流之后的处理流程 ：

- 发生限流之后可自定义返回参数，通过实现 SentinelFallbackProvider 接口，默认的实现是 DefaultBlockFallbackProvider。
- 默认的 fallback route 的规则是 route ID 或自定义的 API 分组名称。

比如：

```java
// 自定义 FallbackProvider 
public class MyBlockFallbackProvider implements ZuulBlockFallbackProvider {

    private Logger logger = LoggerFactory.getLogger(DefaultBlockFallbackProvider.class);
    
    // you can define route as service level 
    @Override
    public String getRoute() {
        return "/book/app";
    }

    @Override
        public BlockResponse fallbackResponse(String route, Throwable cause) {
            RecordLog.info(String.format("[Sentinel DefaultBlockFallbackProvider] Run fallback route: %s", route));
            if (cause instanceof BlockException) {
                return new BlockResponse(429, "Sentinel block exception", route);
            } else {
                return new BlockResponse(500, "System Error", route);
            }
        }
 }
 
 // 注册 FallbackProvider
 ZuulBlockFallbackManager.registerProvider(new MyBlockFallbackProvider());
```

限流发生之后的默认返回：

> {
>
>   "code": 429,
>
>   "message": "Sentinel block exception",
>
>   "route": "/"
>
> }

**注意**：

- Sentinel 网关流控默认的粒度是 route 维度以及自定义 API 分组维度，默认**不支持 URL 粒度**。若通过 Spring Cloud Alibaba 接入，请将 spring.cloud.sentinel.filter.enabled 配置项置为 false（若在网关流控控制台上看到了 URL 资源，就是此配置项没有置为 false）。
- 若使用 Spring Cloud Alibaba Sentinel 数据源模块，需要注意网关流控规则数据源类型是 gw-flow，若将网关流控规则数据源指定为 flow 则不生效。

### GateWay(网关)

https://sentinelguard.io/zh-cn/docs/api-gateway-flow-control.html

您可以在 GatewayCallbackManager 注册回调进行定制：

- setBlockHandler：注册函数用于实现自定义的逻辑处理被限流的请求，对应接口为 BlockRequestHandler。默认实现为 DefaultBlockRequestHandler，当被限流时会返回类似于下面的错误信息：Blocked by Sentinel: FlowException。

> 依赖

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>

<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-alibaba-sentinel-gateway</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

> 配置文件：

```yaml

server:
  port: 8386
spring:
  application:
    name: sentinel-gateway
  cloud:
    sentinel:
      transport:
        dashboard: localhost:8080
      datasource.ds2.file:
        file: "classpath: gateway.json"
        ruleType: gw-flow
      datasource.ds1.file:
        file: "classpath: api.json"
        ruleType: gw-api-group
    gateway:
      enabled: true
      discovery:
        locator:
          lower-case-service-id: true
      routes:
        # Add your routes here.
        - id: userList
          uri: http://localhost:8081
          predicates:
            - Path=/user/list
        - id: userInfo
          uri: http://localhost:8081
          predicates:
            - Path=/user/get/**
```

> 网关限流规则 GatewayFlowRule 的字段

- resource：资源名称，可以是网关中的 route 名称或者用户自定义的 API 分组名称。
- resourceMode：规则是针对 API Gateway 的 route（RESOURCE_MODE_ROUTE_ID）还是用户在 Sentinel 中定义的 API 分组（RESOURCE_MODE_CUSTOM_API_NAME），默认是 route。
- grade：限流指标维度，同限流规则的 grade 字段。
- count：限流阈值
- intervalSec：统计时间窗口，单位是秒，默认是 1 秒。
- controlBehavior：流量整形的控制效果，同限流规则的 controlBehavior 字段，目前支持快速失败和匀速排队两种模式，默认是快速失败。
- burst：应对突发请求时额外允许的请求数目。
- maxQueueingTimeoutMs：匀速排队模式下的最长排队时间，单位是毫秒，仅在匀速排队模式下生效。
- paramItem：参数限流配置。若不提供，则代表不针对参数进行限流，该网关规则将会被转换成普通流控规则；否则会转换成热点规则。其中的字段：
  - parseStrategy：从请求中提取参数的策略，目前支持提取来源 IP（PARAM_PARSE_STRATEGY_CLIENT_IP）、Host（PARAM_PARSE_STRATEGY_HOST）、任意 Header（PARAM_PARSE_STRATEGY_HEADER）和任意 URL 参数（PARAM_PARSE_STRATEGY_URL_PARAM）四种模式。
  - fieldName：若提取策略选择 Header 模式或 URL 参数模式，则需要指定对应的 header 名称或 URL 参数名称。
  - pattern：参数值的匹配模式，只有匹配该模式的请求属性值会纳入统计和流控；若为空则统计该请求属性的所有值。（1.6.2 版本开始支持）
  - matchStrategy：参数值的匹配策略，目前支持精确匹配（PARAM_MATCH_STRATEGY_EXACT）、子串匹配（PARAM_MATCH_STRATEGY_CONTAINS）和正则匹配（PARAM_MATCH_STRATEGY_REGEX）。（1.6.2 版本开始支持）

> 重要的常量 见常量类 SentinelGatewayConstants

```json
  {
    "resource": "some_customized_api",
    "resourceMode":1,//针对的自定义api进行限流
    "count": 2,
    "paramItem":{
      "parseStrategy":3,//针对url参数的解析策略
       "fieldName":"name"
    }
  }
```

## 2.6 RocketMQ（消息订阅与发布）

> RocketMQ启动错误：找不到或无法加载主类：https://www.cnblogs.com/luguojun/p/16132759.html

### 参考案例

**github（demo）**
https://github.com/alibaba/spring-cloud-alibaba/tree/2.2.7.RELEASE/spring-cloud-alibaba-examples/rocketmq-example

> 核心启动命令

```shell
#启动namesrv
start mqnamesrv.cmd
#启动broker
start mqbroker.cmd -n 127.0.0.1:9876 -c ../conf/broker.conf autoCreateTopicEnable=true
```

> broker.conf

```shell
#接受客户端连接的监听端口,默认10911
listenPort=10911
#name server服务器地址及端口，可以是多个，分号隔开
namesrvAddr=192.168.1.100:9876

brokerClusterName = DefaultCluster
brokerName = broker-a
brokerId = 0
deleteWhen = 04
fileReservedTime = 48
brokerRole = ASYNC_MASTER
flushDiskType = ASYNC_FLUSH

#检测物理文件磁盘空间
diskMaxUsedSpaceRatio=88
#存储路径
storePathRootDir=E:/dev-soft/rocketmq-all-4.3.2-bin-release/store
#commitLog存储路径
storePathCommitLog=E:/dev-soft/rocketmq-all-4.3.2-bin-release/store/commitlog
#消费队列存储路径
storePathConsumeQueue=E:/dev-soft/rocketmq-all-4.3.2-bin-release/store/consumequeue
#消息索引存储路径
storePathIndex=E:/dev-soft/rocketmq-all-4.3.2-bin-release/store/index
#checkpoint 文件存储路径
storeCheckpoint=E:/dev-soft/rocketmq-all-4.3.2-bin-release/store/checkpoint
#abort 文件存储路径
abortFile=E:/dev-soft/rocketmq-all-4.3.2-bin-release/store/abort
```

### 核心代码：

> 消息发送的核心代码

```java
MessageBuilder builder = MessageBuilder.withPayload(msg)
    .setHeader(RocketMQHeaders.TAGS, "binder")
    .setHeader(RocketMQHeaders.KEYS, "my-key")
    .setHeader(MessageConst.PROPERTY_DELAY_TIME_LEVEL, "1");
Message message = builder.build();
output().send(message);
```

> 头部标签:TAGS, DELAY, TRANSACTIONAL_ARG, KEYS, WAIT_STORE_MSG_OK, FLAG

### RocketMQConsumerProperties(RocketMq消费方属性 )

**版本:**2.2.7发布版

**包名:**com.alibaba.cloud.stream.binder.rocketmq.properties

**参数格式前缀**:spring.cloud.stream.rocketmq.bindings..consumer..

**常用参数**

| **属性**                          | **作用**                             | **默认值**                                                   |
| --------------------------------- | ------------------------------------ | ------------------------------------------------------------ |
| **orderly**                       | 同时或有序地接收消息                 | false                                                        |
| **enabled**                       | 启用消费者绑定                       | true                                                         |
| **delayLevelWhenNextConsume**     | 并发消费的消息消费重试策略           | - -1，不重试，直接放入DLQ - 0,broker控制重试频率 - >0,客户端控制重试频率 - 默认值：0. |
| **suspendCurrentQueueTimeMillis** | 消息消费重试的时间间隔，用于有序消费 | 1000                                                         |
| **subscription**                  | 订阅标签                             |                                                              |

### RocketMQProducerProperties (RocketMq生产方属性 )

**版本: **2.2.7发布版

**包名: **com.alibaba.cloud.stream.binder.rocketmq.properties

**参数格式前缀**: spring.cloud.stream.rocketmq.bindings..producer..

**常用参数**

| **属性**                | **作用**                               | **默认值**                                      |
| ----------------------- | -------------------------------------- | ----------------------------------------------- |
| **group**               | **生产者组名称**                       |                                                 |
| **enabled**             | **启用生产者绑定**                     | **true**                                        |
| **maxMessageSize**      | **允许的最大消息大小（以字节为单位）** | **8249344**                                     |
| **producerType**        | **生产者类型,分别为Normal,Trans;**     | **Normal** **（如果要开启事务需要设置为Trans)** |
| **transactionListener** | **发送事务消息**                       | **false**                                       |
| **sync**                | **以同步方式发送消息**                 | **false**                                       |
| **sendMessageTimeout**  | **发送消息超时的毫秒数**               | **3000**                                        |

![image-20230527231125337](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527231126.png)

## 2.7 Seata （分布式事务架构）

官网：https://seata.io/zh-cn/docs/overview/what-is-seata.html
https://github.com/seata/seata

快速下载地址：https://github.com/seata/seata/releases/tag/v1.4.1

推荐下载版本: seata-server-1.4.1.zip

### 概念：

用于微服务架构的具有高性能和易用性的分布式事务解决方案。

### 分布式事务产生：

**（不同服务自己的调度 产生的）**

![image-20230527231307679](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527231308.png)

> **seata-server启动参数**

```arduino
  -h: 注册到注册中心的ip
  -p: Server rpc 监听端口
  -m: 全局事务会话信息存储模式，file、db、redis，优先读取启动参数 (Seata-Server 1.3及以上版本支持redis)
  -n: Server node，多个Server时，需区分各自节点，用于生成不同区间的transactionId，以免冲突
  -e: 多环境配置参考 http://seata.io/en-us/docs/ops/multi-configuration-isolation.html
```

> **单机启动命令 ：** start seata-server.bat -p 8091 -m file

注： file模式为单机模式，全局事务会话信息内存中读写并持久化本地文件root.data，性能较高; db模式为高可用模式，全局事务会话信息通过db共享，相应性能差些;

版本兼容:

> 查看版本说明 2.1.0内嵌seata-all 0.7.1，2.1.1内嵌seata-all 0.9.0，2.2.0内嵌seata-spring-boot-starter 1.0.0, 2.2.1内嵌seata-spring-boot-starter 1.1.0

> 2.1.0和2.1.1兼容starter解决方案: @SpringBootApplication注解内exclude掉spring-cloud-starter-alibaba-seata内的com.alibaba.cloud.seata.GlobalTransactionAutoConfiguration

- spring-cloud-starter-alibaba-seata推荐依赖配置方式

```xml
<dependency>
  <groupId>io.seata</groupId>
  <artifactId>seata-spring-boot-starter</artifactId>
  <version>最新版</version>
</dependency>
<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-starter-alibaba-seata</artifactId>
  <version>最新版本</version>
  <exclusions>
    <exclusion>
      <groupId>io.seata</groupId>
      <artifactId>seata-spring-boot-starter</artifactId>
    </exclusion>
  </exclusions>
</dependency>
```

### 事务的四种模式

#### 01. AT

**整体机制**

两阶段提交协议的演变：

- 一阶段：业务数据和回滚日志记录在同一个本地事务中提交，释放本地锁和连接资源。
- 二阶段：
  - 提交异步化，非常快速地完成。
  - 回滚通过一阶段的回滚日志进行反向补偿。

![image-20230527231404516](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527231405.png)

#### 02. TCC

一个分布式的全局事务，整体是 两阶段提交 的模型。全局事务是由若干分支事务组成的，分支事务要满足两阶段提交 的模型要求，即需要每个分支事务都具备自己的：

- 一阶段 prepare 行为
- 二阶段 commit 或 rollback 行为

**整体机制:**

![image-20230527231416486](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527231417.png)

根据两阶段行为模式的不同，我们将分支事务划分为 **Automatic (Branch) Transaction Mode** 和 **TCC (Branch) Transaction Mode**.

AT 模式（[参考链接 TBD](https://seata.io/zh-cn/docs/dev/mode/tcc-mode.html)）基于 **支持本地 ACID 事务** 的 **关系型数据库**：

- 一阶段 prepare 行为：在本地事务中，一并提交业务数据更新和相应回滚日志记录。
- 二阶段 commit 行为：马上成功结束，**自动** 异步批量清理回滚日志。
- 二阶段 rollback 行为：通过回滚日志，**自动** 生成补偿操作，完成数据回滚。

相应的，TCC 模式，不依赖于底层数据资源的事务支持：

- 一阶段 prepare 行为：调用 **自定义** 的 prepare 逻辑。
- 二阶段 commit 行为：调用 **自定义** 的 commit 逻辑。
- 二阶段 rollback 行为：调用 **自定义** 的 rollback 逻辑。

所谓 TCC （Try-Confirm-Cancel）模式，是指支持把 **自定义** 的分支事务纳入到全局事务的管理中。

#### 03.Saga

**整体机制:**

![image-20230527231609857](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527231611.png)

**适用场景：**

- 业务流程长、业务流程多
- 参与者包含其它公司或遗留系统服务，无法提供 TCC 模式要求的三个接口

**优势：**

- 一阶段提交本地事务，无锁，高性能
- 事件驱动架构，参与者可异步执行，高吞吐
- 补偿服务易于实现

**缺点：**

- 不保证隔离性（应对方案见后面文档）

#### 04.XA

**整体机制：**

在 Seata 定义的分布式事务框架内，利用事务资源（数据库、消息服务等）对 XA 协议的支持，以 XA 协议的机制来管理分支事务的一种 事务模式。

![image-20230527231704875](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527231706.png)

### 相关脚本说明：

https://gitee.com/seata-io/seata/tree/develop/server/src/main/resources

https://gitee.com/seata-io/seata/tree/develop/script/client

存放用于客户端的配置和SQL

- at: AT模式下的 undo_log 建表语句
- conf: 客户端的配置文件
- saga: SAGA 模式下所需表的建表语句
- spring: SpringBoot 应用支持的配置文件

https://gitee.com/seata-io/seata/tree/develop/script/server

存放server侧所需SQL和部署脚本

- db: server 侧的保存模式为 db 时所需表的建表语句
- docker-compose: server 侧通过 docker-compose 部署的脚本
- helm: server 侧通过 Helm 部署的脚本
- kubernetes: server 侧通过 Kubernetes 部署的脚本

https://gitee.com/seata-io/seata/tree/develop/script/config-center

用于存放各种配置中心的初始化脚本，执行时都会读取 config.txt配置文件，并写入配置中心

- nacos: 用于向 Nacos 中添加配置
- zk: 用于向 Zookeeper 中添加配置，脚本依赖 Zookeeper 的相关脚本，需要手动下载；ZooKeeper相关的配置可以写在 zk-params.txt 中，也可以在执行的时候输入
- apollo: 向 Apollo 中添加配置，Apollo 的地址端口等可以写在 apollo-params.txt，也可以在执行的时候输入
- etcd3: 用于向 Etcd3 中添加配置
- consul: 用于向 consul 中添加配置

