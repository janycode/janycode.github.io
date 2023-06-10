---
title: 01-Nacos 注册中心部署与服务注册
date: 2021-03-25 02:39:15
tags: 
- SpringCloudAlibaba
- Nacos
- 注册中心
categories: 
- 14_微服务
- 02_注册中心
---

参考资料：
Nacos 官方文档：https://nacos.io/zh-cn/
自建 Nacos 服务注册中心-阿里云文档：https://help.aliyun.com/document_detail/142100.html


### 1. Nacos 简介
#### 1.1 主流注册中心对比
当下主流的注册中心对比：
![主流的注册中心对比](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213251616655269412.png)


#### 1.2 Nacos 介绍
Nacos是阿里的一个开源产品，它是针对微服务架构中的服务发现、配置管理、服务治理的综合型解决方案。

官方介绍是这样的:
Nacos致力于帮助您发现、配置和管理微服务。Nacos 提供了-组简单易用的特性集,帮助您实现动态服务发现、服务配置管理、服务及流量管理。
Nacos帮助您更敏捷和容易地构建、交付和管理微服务平台。Nacos 是构建以“服务"为中心的现代应用架构的服务基础设施。
Nacos主要提供以下四大功能:
1. 服务发现与服务健康检查
2. 动态配置管理
3. 动态DNS服务
4. 服务和元数据管理

而且阿里巴巴在 2021-3-20 日 `Nacos 2.0` 正式发布了，且据说性能提升了 `10` 倍左右。

Nacos 2.0 下载地址：https://github.com/alibaba/nacos/releases/tag/2.0.0

我在 Nacos 官网页发现了阿里对 Nacos 2.0 的压测报告，性能提升真不是盖的：

Nacos 2.0 配置模块压测报告：https://nacos.io/zh-cn/docs/nacos2-config-benchmark.html

Nacos 2.0 服务发现模块压测报告：https://nacos.io/zh-cn/docs/nacos2-naming-benchmark.html

盲猜以后会是注册中心主流框架(Jerry(姜源) 2021-3-26 11:06:29)。


### 2. Nacos 部署启动
Nacos 默认端口为 `8848`。
部署步骤：

``` bash
#下载 nacos 2.0(如果指定目录同时重命名则加 -O ./Downloads/nacos2.0.zip)
wget https://github.com/alibaba/nacos/releases/download/2.0.0/nacos-server-2.0.0.zip

#解压(如果没有权限则加 sudo)
unzip nacos-server-2.0.0.zip -d /usr/local/nacos2.0/

#启动(单机模式启动，非集群模式)，windows直接双击 startup.cmd 启动
bin/startup.sh -m standalone
```

* 如果是云服务器，则需要在安全组中开放端口 8848 的访问权限：
![安全组开放端口配置](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213261616727344504.png)

* 不论是云服务器或者虚拟机，都需要关闭防火墙：
	``` bash
	#关闭防火墙
	systemctl stop firewalld.service
	#禁用防火墙(开机不自启)
	systemctl disable firewalld.service
	```

打开 Nacos 管理端页面查看：http://IP地址:8848/nacos/index.html
账号：nacos
密码：nacos
![Nacos管理端页面](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213251616666792893.png)


### 3. Nacos 服务注册

Demo 测试：
![Nacos 与服务的注册逻辑](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213261616740821022.png)

![Nacos 注册中心服务注册测试](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213251616667013208.png)

![Spring Cloud Alibaba 的框架支持的 SpringBoot 版本在 2.2.0~2.3.0 之间](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213261616725611762.png)

#### 3.1 Provider 服务

pom.xml
``` xml
<?xml version="1.0" encoding="UTF-8"?>
	...
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
		<!-- 指定 Spring Boot 版本 2.2.6 -->
        <version>2.2.6.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
	...
    <dependencies>
        <!-- SpringBoot Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!--Spring Cloud Alibaba 的框架支持的 SpringBoot 版本在 2.2.0~2.3.0 之间 2021-3-25 10:34:55-->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
            <version>2.2.5.RELEASE</version>
        </dependency>
    </dependencies>
```

ProviderApplication.java
``` java
package com.jerry.provider;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient  //开启服务注册与发现
@SpringBootApplication
public class ProviderApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProviderApplication.class, args);
    }
}
```

application.yml
``` yml
# 提供者
server:
  port: 8081
spring:
  application:
    name: jerryProvider  # 服务名称
  cloud:
    nacos:
      discovery:
        server-addr: 192.168.134.128:8848  # Nacos 地址和端口
```

服务启动完成，会有服务注册日志信息：
``` java
c.a.c.n.registry.NacosServiceRegistry    : nacos registry, DEFAULT_GROUP jerryProvider 192.168.195.1:8081 register finished
com.jerry.provider.ProviderApplication   : Started ProviderApplication in 2.948 seconds (JVM running for 3.548)
```


#### 3.2 Consumer 服务

pom.xml
``` xml
<?xml version="1.0" encoding="UTF-8"?>
	...
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
		<!-- 指定 Spring Boot 版本 2.2.6 -->
        <version>2.2.6.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
	...
    <dependencies>
        <!-- SpringBoot Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!--Spring Cloud Alibaba 的框架支持的 SpringBoot 版本在 2.2.0~2.3.0 之间 2021-3-25 10:34:55-->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
            <version>2.2.5.RELEASE</version>
        </dependency>
    </dependencies>
```

ConsumerApplication.java
``` java
package com.jerry.consumer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient  //开启服务注册与发现
@SpringBootApplication
public class ConsumerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConsumerApplication.class, args);
    }
}
```

application.yml
``` yml
# 消费者
server:
  port: 8082
spring:
  application:
    name: jerryConsumer  # 服务名称
  cloud:
    nacos:
      discovery:
        server-addr: 192.168.134.128:8848  # Nacos 地址和端口
```

服务启动完成，会有服务注册日志信息：
``` java
c.a.c.n.registry.NacosServiceRegistry    : nacos registry, DEFAULT_GROUP jerryConsumer 192.168.195.1:8082 register finished
com.jerry.consumer.ConsumerApplication   : Started ConsumerApplication in 2.555 seconds (JVM running for 3.165)
```


#### 3.3 Nacos 下的服务间通信
改造 Provider 和 Consumer的启动类，使其拥有 api 能力。

ProviderApplication.java
``` java
@RestController
@EnableDiscoveryClient
@SpringBootApplication
public class ProviderApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProviderApplication.class, args);
    }

    @GetMapping("nacos/hello")
    public String hello() {
        return "hello, nacos!";
    }
}
```

ConsumerApplication.java
``` java
@RestController
@EnableDiscoveryClient
@SpringBootApplication
public class ConsumerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConsumerApplication.class, args);
    }

    @Autowired
    private RestTemplate restTemplate;

    @Bean
    @LoadBalanced //开启负载均衡, 让 RestTemplate 在请求时拥有客户端负载均衡的能力
    public RestTemplate getRestTemplate() {
        return new RestTemplate();
    }

    @GetMapping("/consumer")
    public String test() {
        return "consumer: "restTemplate.getForObject("http://jerryProvider/nacos/hello", String.class);
    }
}
```
![Provider 服务接口测试](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213261616741765453.png)

![Consumer服务接口调用其他服务(Provider)接口测试](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213261616741797563.png)



### 4. 服务注册和管理

#### 4.1 服务注册查看
进入管理页面：http://192.168.134.128:8848/nacos/index.html
![两个服务已注册进 Nacos 注册中心](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213261616727417082.png)


> 更多的微服务模块扩展也类似，不赘述。

#### 4.2 服务流量权重和流量保护
Nacos 为用户提供了流量权重控制的能力，同时开放了服务流量的阈值保护，以帮助用户更好的保护服务服务提供者集群不被意外打垮。
如图，可以点击实例的编辑按钮，修改实例的权重。
`如果想增加实例的流量，可以将权重调大；如果不想实例接收流量，则可以将权重设为0`。

![服务流量阈值配置](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213261616730814403.png)

然后会看到触发保护阈值状态为 true 了。
![触发保护阈值](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213261616730877177.png)

#### 4.3 服务元数据管理
Nacos 提供多个维度的服务元数据的暴露，帮助用户存储自定义的信息。
这些信息都是以 K-V 的数据结构存储，在控制台上，会以 json 格式展示。类似的，编辑元数据可以通过相同的格式进行。
例如首先点击服务详情页右上角的`编辑服务`按钮，然后在元数据输入框输入：

``` json
{
    "version": 1.0,
    "env": "prod",
    "author": "jiangyuan"
}
```

![服务的元数据编辑](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213261616731251759.png)


#### 4.4 服务优雅上下线
Nacos 还提供服务实例的上下线操作，在服务详情页面，可以点击实例的“上线”或者“下线”按钮，被下线的实例，将不会包含在健康的实例列表里。

![服务优雅上下线](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213261616747109710.png)

![服务下线后直接请求和服务间调用情况](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213261616747318568.png)


#### 4.5 监听者查询
Nacos提供配置订阅者即监听者查询能力，同时提供客户端当前配置的 MD5 校验值，以便帮助用户更好的检查配置变更是否推送到 Client 端(需已建好配置)。

![查询监听者 IP 和 MD5](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213261616748142424.png)

#### 4.6 配置实例权重
可以通过手动配置权重来控制流量，当一个集群内两个实例，权重越高，到达该实例的请求比例越多。

#### 4.7 配置保护阈值
保护阈值的范围是 0~1
服务的健康比例 = 服务的健康实例 / 总实例个数
* 当服务健康比例 <= 保护阈值时，无论实例健不健康都会返回给调用方；
* 当服务健康比例 > 保护阈值时，只会返回健康实例给调用方服务管理-服务列表选择一个服务点击详情可以配置。