---
title: Nacos配置中心
date: 2020-03-02 17:59:44
tags:
- 微服务
- Nacos
- SpringCloudAlibaba
categories: 
- 14_微服务
- 01_配置中心
---



![image-20200729130824878](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200729130826.png)

官网地址：https://nacos.io/zh-cn/index.html

中文文档：https://nacos.io/zh-cn/docs/architecture.html



### 1. Nacos 简介

Nacos : 一个更易于构建云原生应用的动态**服务发现**、**配置管理**和**服务管理**平台。

* 服务发现和服务健康监测
* 动态配置服务
* 动态 DNS 服务
* 服务及其元数据管理

#### 1.1 Nacos的核心作用

1. `服务注册中心`
    
    服务治理框架 可以实现服务的发现和注册
    
2. `统一配置中心`

    可以实现共享的配置信息的管理

    微服务配置中心：

    Spring Cloud Config - SpringCloud：https://spring.io/projects/spring-cloud-config

    Apollo - 携程：https://github.com/ctripcorp/apollo

    Nacos - 阿里：https://github.com/alibaba/nacos

#### 1.2 Nacos注册中心原理

![image-20230606222904014](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230606222906.png)



### 2. Nacos 安装和启动

> Nacos 服务端对内存要求较高，单机启动起码要预留 1G 内存或更高。

```sh
#1.下载nacos
https://github.com/alibaba/nacos/releases

#2.解压
tar -zxvf nacos-server-1.3.1.tar.gz -C /usr/local/

# 启动前可根据内存情况进行限制内存配置
vi startup.sh
# 修改line 88 为: JAVA_OPT="${JAVA_OPT} -Xms256m -Xmx256m -Xmn128m"

#3.启动 win
bin/startup.cmd
bin/shutdown.cmd
#3.启动 linux，单机启动nacos
bin/startup.sh -m standalone
# Nacos启动需要具备Java环境+JAVA_HOME和Maven环境，Nacos 依赖 Java 环境来运行。如果是从代码开始构建并运行Nacos，还需要为此配置 Maven 环境

#4.访问测试
http://IP地址:8848/nacos/index.html
默认账号: nacos
默认密码: nacos
```

![image-20200730142432405](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200730142434.png)

![image-20200730135838516](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200730135840.png)





### 3. Nacos 注册中心

Nacos的第一个核心作用就是用来作为注册中心使用，可以实现服务的发现和注册功能。 

默认账号: `nacos`
默认密码: `nacos`

![image-20200801094953021](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200801094955.png)

<center>demo启了1个服务提供者，1个服务消费者，1个网关中心</center>



### 4. Nacos 配置中心-本地

基于Nacos实现微服务的统一配置管理：可以用在`消费者` 或 `提供者`。

1. 依赖 jar

```xml        &lt;dependency&gt;
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
    <version>2.2.1.RELEASE</version>
</dependency>
```

2. nacos 配置管理中创建配置

![image-20200801104714166](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200801104715.png)

> 对应DataId要求：
> `dataId` 的完整格式如下：
>
> ```properties
> ${prefix}-${spring.profile.active}.${file-extension}
> ```
>
> * prefix 默认为 spring.application.name 的值，也可以通过配置项 spring.cloud.nacos.config.prefix 来配置。
>
> * spring.profile.active 即为当前环境对应的 profile，详情可以参考 [Spring Boot文档](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-profiles)。 **注意：当**spring.profile.active **为空时，对应的连接符** - **也将不存在，**dataId **的拼接格式变成**${prefix}.${fileextension}
> * file-exetension 为配置内容的数据格式，可以通过配置项 spring.cloud.nacos.config.fileextension 来配置。目前只支持 properties 和 yaml 类型。
>     比如demo：
>     **jerryProvider.properties** 
>
> 注意事项：
>
> 1. `实测目前只能读取 properties 格式数据`
> 2. `使用 application.yml 配置只能使用 Nacos 在 localhost 本机启动才能测试`
> 3. `使用 bootstrap.yml 配置可以使用 Nacos 在 云服务器 地址启动测试` ——参考 5.Nacos配置远程服务器
>

3. 服务提供者中添加配置

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
      config:
        server-addr: localhost:8848  #配置中心地址
        file-extension: yaml  #配置文件的格式（但暂未生效）
```

4. demo程序中添加配置类测试
    **`@RefreshScope`**  注解开启实时刷新，实时获取配置中心的数据，实现动态配置。

```java
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RefreshScope  // 开启实时刷新，实时获取配置中心的数据，实现动态配置
@RequestMapping("/api/config")
public class ServerConfig {

    // : 用于配置默认值
    @Value("${openmain.version:1.0}")
    private String version;

    @GetMapping("/version")
    public String getVersion() {
        System.err.println("----> " + version);
        return version;
    }
}
```

访问测试：http://localhost:8081/api/config/version

![image-20200801110135250](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200801110136.png)



### 5. Nacos 配置中心-远程

以 Jedis 工具类中对 Redis 配置信息统一管理为例：

> 注意：
>
> 1. @Value 注解 IOC 的属性注入是发生在对象创建实例之后，如果在构造中直接使用@Value的值进行构造对象，则无法获取到对应的值来创建对象；
> 2. 云服务器中使用 Nacos 作为统一配置中心时，需要使用加载更早的 bootstrap.yml 来配置，否则Spring默认会使用 localhost:8848 来寻找 Nacos服务器，导致无法访问云服务器的统一配置信息。

* Jedis 工具类 [XXX_Common]

```java
public class JedisCore {
    private Jedis jedis;
    // 三参构造方法
    public JedisCore(String host, int port, String pass) {
        JedisPool pool = new JedisPool(host, port);
        jedis = pool.getResource();
        jedis.auth(pass);
    }
    // 传递参数获取一个实例
    public static JedisCore getInstance(String host, int port, String pass) {
        return new JedisCore(host, port, pass);
    }

    /**
     * 获取指定key的值,如果key不存在返回null，如果该Key存储的不是字符串，会抛出一个错误
     */
    public String get(String key) {
        String value = null;
        value = jedis.get(key);
        return value;
    }

    //... 其他工具类内方法
}
```

* 消费者 [XXX_Api]

```java
@Service
public class UserServiceImpl implements UserService {
    /**
     * RestTemplate提供了多种便捷访问远程Http服务的方法
     */
    @Autowired
    private RestTemplate restTemplate;

    @Value("${spring.redis.host}") // @Value 注解 IOC 的属性注入是发生在对象实例之后
    private String host;
    @Value("${spring.redis.port}")
    private int port;
    @Value("${spring.redis.password}")
    private String pass;

    private JedisCore jedisCore;
    @PostConstruct // 指定在Spring对象创建后立即调用的初始化方法
    public void init() {
        System.err.println("host = " + host); // 获取到了统一配置的IP
        System.err.println("port = " + port); // 获取到了统一配置的端口
        System.err.println("pass = " + pass); // 获取到了统一配置的密码
        jedisCore = JedisCore.getInstance(host, port, pass);
    }

    @Override
    public R checkN(String name) {
        jedisCore.set("testKey001", "testValue16:25:40"); // 写入了 Redis 缓存
        return restTemplate.getForObject("http://jerryProvider/provider/user/checkname.do?name=" + name, R.class);
    }
}
```

> 测试时启动打印信息：
>
> ![image-20200814134654670](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200814134655.png)

* 消费者使用配置文件 bootstrap.yml `优先比 application.yml 加载`

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
      config:
        server-addr: 47.94.193.104:8848  #配置中心地址
```

> bootstrap.yml（bootstrap.properties）用来在程序引导时执行，应用于更加早期配置信息读取，如可以使用来配置application.yml中使用到参数等
>
> application.yml（application.properties) 应用程序特有配置信息，可以用来配置后续各个模块中需使用的公共参数等。
>
> bootstrap.yml 先于 application.yml 加载。

* Nacos配置中心中配置 jerryConsumer.properties

```properties
spring.redis.host=47.94.193.104
spring.redis.port=6379
spring.redis.password=Redis密码
```

![image-20200806170405473](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200806170406.png)



### 6. Nacos 配置集群服务支持

基于 阿里云 服务器。

![20200814191027-阿里云配置微服务多机分布方式](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200822131901.jpg)