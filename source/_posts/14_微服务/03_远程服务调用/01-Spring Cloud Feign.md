---
title: 01-Spring Cloud Feign
date: 2020-03-02 17:59:44
tags:
- 微服务
- Feign
- SpringCloudAlibaba
categories: 
- 14_微服务
- 03_远程服务调用
---



![image-20200729130824878](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200729130826.png)

官网文档：https://spring.io/projects/spring-cloud-openfeign



### 1. 简介

**`Spring Cloud OpenFeign`** : Declarative REST Client: Feign（声明式REST服务调用）是一种声明式的web 客户端，可以使用它的注解创建接口，它也支持自定义编解码。Spring Cloud 集成了 **Ribbon 和 Eureka 为客户端提供了负载均衡策略**。

Feign是实现服务的远程调用技术。主要是作用在服务客户端，用于实现服务的调用。  

Feign有两个主要注解： `@EnableFeignClients` 用于开启feign功能，`@FeignClient` 用于定义feign 接口  

![image-20200730203801522](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200730203802.png)



### 2. 使用步骤

1. 导入jar

```xml
<dependency>
	<groupId>org.springframework.cloud</groupId>
	<artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

2. 启动类配置

```java
// 提供者
@SpringBootApplication
@EnableDiscoveryClient //发布服务
@MapperScan("com.demo.open.server.dao") //扫描 Mybatis 的dao
@EnableTransactionManagement //启用事务
public class OpenServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(OpenServerApplication.class, args);
    }
}

// 消费者
@SpringBootApplication
@EnableDiscoveryClient //服务注册与发现
@EnableFeignClients //启用OpenFeign, 开启该注解，则自动实现 @FeignClient 注解修饰的接口实现类
public class OpenApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(OpenApiApplication.class, args);
    }
}
```

3. 定义远程接口

```java
// 消费者 controller
@RestController
@RequestMapping("/api/oss/")
public class OssController {
    @Autowired
    private OssService service;

    /**
     * 上传普通文件
     */
    @PostMapping("upload.do")
    public R upload(@RequestPart MultipartFile file) {
        System.out.println(1 / 0);
        return service.upload(file);
    }
}

// 消费者 service & serviceImpl
@FeignClient("jerryProvider")  // @FeignClient 为接口提供了具体的实现类，因此可以成功注入
public interface OssService {
    /**
     * 文件上传： consumes 注解参数，实际本质还是配置的文件上传项 "multipart/form-data"
     */
    @PostMapping(value = "provider/oss/upload.do", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    R upload(MultipartFile file);
}

// 提供者 controller
@RestController
@RequestMapping("/provider/oss")
public class OssController {
    @Autowired
    private OssService service;

    @PostMapping("/upload.do")
    public R upload(MultipartFile file) {
        return service.upload(file);
    }
}
```

4. 配置文件 application.yml

```yaml
# 提供者
server:
  port: 8081
spring:
  application:
    name: jerryProvider  #服务名称
  cloud:
    nacos:
      discovery:
        server-addr: 47.94.193.104:8848  #注册中心地址

# 消费者
server:
  port: 8090
spring:
  application:
    name: jerryConsumer  #服务名称
  cloud:
    nacos:
      discovery:
        server-addr: 47.94.193.104:8848  #注册中心地址
```



### 3. 415 Unsupported Media Type

HTTP Status 415 – Unsupported Media Type

**问题现象**：

当**消费者**的控制层接口封装了 实体类 后，通过 RestTemplate 发送HTTP请求到 提供者 时报错 `415`，报错的核心信息为 HTTP Status 415 – Unsupported Media Type；

**提供者**警告信息为 WARN 27148 --- [io-8081-exec-10] .w.s.m.s.DefaultHandlerExceptionResolver : Resolved [org.springframework.web.**HttpMediaTypeNotSupportedException**: Content type '`application/xml;charset=UTF-8`' not supported]

**根本原因**：推测是 spring cloud sentinel 的版本本身问题

```java
//控制器
@PostMapping(value = "/upd")
public R updateLevel(@RequestBody MainLevel mainLevel) {
    return service.updateLevel(mainLevel);
}

//业务层
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@Override
public R updateLevel(MainLevel mainLevel) {
    log.info(mainLevel.toString());

    // 去掉 sentinel 流量哨兵的pom依赖 or 【推荐】加入HTTP头打包消息体发送到服务提供者
    HttpHeaders requestHeaders = new HttpHeaders();
    requestHeaders.setContentType(MediaType.APPLICATION_JSON);
    HttpEntity<MainLevel> requestEntity = new HttpEntity<MainLevel>(mainLevel, requestHeaders);

    return restTemplate.postForObject("http://server/server/carlevel/update.do", mainLevel, R.class);
}

//服务提供者 - 控制器
@PostMapping("/update.do")
public R updateLevel(@RequestBody MainLevel mainLevel) { // json接收，映射实体类
    return service.updateLevel(mainLevel);
}
```

