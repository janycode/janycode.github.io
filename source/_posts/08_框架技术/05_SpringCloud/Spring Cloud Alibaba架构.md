---
title: Spring Cloud Alibaba架构
date: 2020-03-02 17:59:44
tags:
- SpringCloud
- SpringCloudAlibaba
categories:
- 08_框架技术
- 05_SpringCloud
---



![image-20200729130824878](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200729130826.png)

官网地址：https://spring.io/projects/spring-cloud-alibaba

GitHub源码：https://github.com/alibaba/spring-cloud-alibaba

https://github.com/alibaba/spring-cloud-alibaba/blob/master/README-zh.md

参考教程：https://www.jianshu.com/p/9a8d94c0c90c



### 1. SpringCloud Alibaba

#### 1.1 微服务架构

SOA（Service-Oriented Architecture）-面向服务的体系架构  

微服务架构（Microservice Architecture）是一种架构概念，旨在通过将功能分解到各个离散的服务中以实现对
解决方案的解耦。你可以将其看作是在架构层次而非获取服务的类上应用很多SOLID原则。微服务架构是个很有趣的概念，它的主要作用是将功能`分解到离散的各个服务当中`，从而`降低系统的耦合性`，并提供更加灵活的服务支持。  

**概念**：把一个大型的单个应用程序和服务拆分为数个甚至数十个的支持微服务，它可扩展单个组件而不是整个的应用程序堆栈，从而满足服务等级协议。
**定义**：围绕业务领域组件来创建应用，这些应用可独立地进行开发、管理和迭代。在分散的组件中使用云架构和平台式部署、管理和服务功能，使产品交付变得更加简单。
**本质**：用一些功能比较明确、业务比较精练的服务去解决更大、更实际的问题。  

![image-20200730094937910](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200730094939.png)

![image-20200730201054656](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200730201055.png)

微服务的应用场景：
◆ 大型复杂的系统 例如大型电商系统
◆ 高并发系统 例如大型门户网站,商品秒杀系统
◆ 需求不明确,且变更很快的系统 例如创业公司业务系统  



#### 1.2 微服务技术

1. Dubbo/DubboX
    Dubbo: http://dubbo.apache.org/zh-cn/
    DubboX: https://github.com/dangdangdotcom/dubbox

2. gRPC
    https://grpc.io/docs/what-is-grpc/core-concepts/#service-definition

3. Spring Cloud Netflex
    https://spring.io/projects/spring-cloud

4. `Spring Cloud Alibaba` 主流
    https://spring.io/projects/spring-cloud-alibaba

5. Servicecomb
    http://servicecomb.apache.org/  

6. Istio
    Istio是什么：Istio是Google/IBM/Lyx联合开发的开源项目，2017年5月发布第一个release 0.1.0
    https://istio.io/  



#### 1.3 微服务12原则

12factor：https://12factor.net/

1. 一份基准代码，多份部署  
2. 显式声明依赖关系  
3. 在环境中存储配置  
4. 把后端服务当作附加资源  
5. 严格分离构建、发布和运行  
6. 以一个或多个无状态的进程运行应用  
7. 通过端口绑定提供服务  
8. 通过进程模型进行扩展  
9. 快速启动和优雅终止可最大化健壮性  
10. 开发环境与线上环境等价  
11. 把日志当作事件流  
12. 后台管理任务当作一次性进程运行  



#### 1.4 核心组件

* 服务发现 Nacos

* 负载均衡 Ribbon (也是HTTP客户端，可与Feign同用)
* 声明式HTTP客户端 Feign
* 服务容错 Sentinel
* 消息驱动 RocketMQ
* API网关 GateWay
* 用户认证与授权
* 配置管理 Nacos
* 调用链监控 Sleuth

> SpringCloud Alibaba是SpringCloud的子项目，SpringCloud Alibaba符合SpringCloud标准 比较SpringCloud第一代与SpringCloud Alibaba的优势。



