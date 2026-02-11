---
title: Sentinel概述和使用
date: 2020-03-02 17:59:44
tags:
- 微服务
- Sentinel
- SpringCloudAlibaba
categories: 
- 14_微服务
- 05_限流降级
---

![image-20200731140445075](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200731143429.png)

官网地址：https://github.com/alibaba/Sentinel/releases

中文文档参考：https://github.com/alibaba/Sentinel/wiki/%E4%B8%BB%E9%A1%B5



### 1. Sentinel 简介

Sentinel:阿里巴巴开源的服务容错框架，也叫：流量防卫兵。可以在高并发下提高服务的稳定性！
可以实现：1. 服务降级（当服务不可用的时候，可以去执行降级方法）2. 流量控制 3. 规则配置
需要具备：1. 控制台（运行下载）2. 服务中使用  

介绍信息：https://github.com/alibaba/Sentinel/wiki/%E4%BB%8B%E7%BB%8D

![image-20200815230043664](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815230044.png)



### 2. Sentinel 控制台

Sentinel 控制台提供一个轻量级的控制台，它提供机器发现、单机资源实时监控、集群资源汇总，以及规则管理的功能 Sentinel DashBoard。

使用步骤：

1. 下载
    下载地址：https://github.com/alibaba/Sentinel/releases

2. 启动

    ```sh
    #依赖 jdk 环境，win或linux均可直接运行，默认 8080 端口启动
    java -jar sentinel-dashboard-1.7.2.jar
    
    # 指定端口启动
    java -jar sentinel-dashboard-1.7.2.jar --server.port=8088
    
    # 后台启动，输出日志到文件，并制定端口
    nohup java -jar sentinel-dashboard-1.7.2.jar --server.port=8088 > sentinel.log 2>&1 &
    ```
3. 访问控制台
    http://localhost:8080  或  http://localhost:8088
    默认账号：`sentinel`
    默认密码：`sentinel`

> ps：默认没有任何监控，需要访问对应的服务接口才会有监控（如从网关访问或消费者接口访问）

![image-20200731141523302](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200731141525.png)



### 3. Sentinel 应用

Sentinel 作用在`消费者服务`上可以实现核心方法的高可用性：

1. 依赖 jar

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
    <version>2.2.1.RELEASE</version>
</dependency>
```

2. 实现服务降级处理

```java
@Api(tags = "文件上传接口")
@RestController
@RequestMapping("/api/oss/")
public class OssController {
    @Autowired
    private OssService service;

    /**
     * 上传普通文件
     *
     * @param file 普通文件
     * @return
     */
    @SentinelResource(value = "upload.do", fallback = "error")
    @PostMapping("upload.do")
    public R upload(@RequestPart MultipartFile file) {
        System.out.println(1/0); // 手动创造异常情况模拟测试
        return service.upload(file);
    }

    //降级方法-保护的方法出现了异常，就会执行降级方法
    public R error(@RequestPart MultipartFile file) {
        return R.fail("服务降级");
    }
}
```

3. 配置文件

```yaml
server:
  port: 8090
spring:
  application:
    name: jerryConsumer  #服务名称
  cloud:
    nacos:
      discovery:
        server-addr: 47.94.193.104:8848  #注册中心地址
    sentinel:  #哨兵配置
      transport:
        #在消费者 8090 端口启动服务后，sentinel 还会在 8719 这个端口起一个服务和 sentinel-dashboard 通信（发心跳）
        port: 8719
        # sentinel-dashboard 的地址，即默认 sentinel 监控台的地址和端口，如指定了 8088 端口
        dashboard: localhost:8088
feign:
  sentinel:
    enabled: true  #Feign启用Sentinel哨兵监控流量熔断-服务降级
  client:
    config:
      default:
        connectTimeout: 10000 #设置连接的超时时间
        readTimeout: 20000  #设置读取的超时时间
```

4. 测试
    必须请求一次才能看到对应请求被监控的效果。

![image-20200801094723956](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200801094725.png)