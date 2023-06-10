---
title: 02-Spring Cloud Euraka搭建高可用服务
date: 2021-3-23 17:34:24
tags: 
- SpringCloud
- Euraka
categories: 
- 14_微服务
- 02_注册中心
---

参考资料：
Spring Cloud 官网：<https://spring.io/projects/spring-cloud>

Spring Cloud Eureka 介绍和部署：<http://www.heartthinkdo.com/?p=1933>

### 1. 什么是SpringCloud

以前的服务器就好像，一个会语数外全能的老师，为学生提供服务，这个老师生病了，那全校停课。现在微服务流行后，学校有了数学教研组，语文教研组，外语教研组，每个教研组有一群老师具体负责某科的教学，缺了谁，学校都照样运转。

而这个变化中，那些改变历史的程序员就是把一个服务器中的众多服务，或好几台服务器中的众多服务，分类出来，解耦合出来，把他们类似的功能交给同一个集群来做，把互相耦合在一起的功能剥离出来，按业务，按功能来把他们作为一个个微服务放在服务器上，而这个服务器就只提供一个服务，或较少的服务。让一个超大的服务逻辑，解耦合为一个个小服务，均匀的分布在各自的服务器中。

微服务就微在这。每个教研组就是一个微服务集群。他们提供同样的服务，而注册中心Eureka就是这个存放这个教研组老师名单的地方，学生们想先访问这个注册中心获取教师名单，然后根据相应的负载方法去访问各自老师。不至于让集群中某一老师累死也不至于让某一老师闲死。

而Zuul网关呢，就是学校的门卫，某些学生来学校找谁，它负责指引（路由），并且通过一些非常简单的配置，达到阻拦一些人进入（身份验证），或者控制想学数学的人只能去数学教研组，不能去核能教研组学怎么造原子弹（权限验证）。

那Hystrix熔断器呢，可以把它当成学校的志愿者，当一个教研组集体罢课后，学生找不到老师了，这些志愿者及时的告诉来访问的学生，相应的结果，异常信息等，免得大量的学生在学校等待，这些志愿者赶快把这些等待的学生梳理出去，学生一直在学校等待，那其他需要学生的学校，也会等待学生，最后造成大面积的学校瘫痪。这里学生我们看成一个个请求。熔断器就是把某事故的蔓延即使熔断了。

当然这些组件也是微服务需要注册到Eureka注册中心那SpringCloud就可以看成是这个学校了。众多上面提到的组件相当于都是这个学校的各职能部门。

### 2. 微服务的搭建

> 基于Maven+idea搭建。另外SpringCloud需要基于springboot搭建。
> 引入Spring Boot相关依赖：这里的springboot用的是1.5.7版本；
> 引入Spring Cloud相关依赖：这里为 Edgware.SR5

#### 2.1 工程初始化配置

在Idea中创建工程：File -> New ->Project
![在Idea中创建工程](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436437.png "70065f42404b1fd59cda630283a4fc98.png")

点击 Empty Project -> Next
![Next](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436354.png "957de0ed0a212b6acf59d260de00d692.png")

项目命名 -> 项目位置
![项目位置](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436355.png "df1e2716baa9d28a458af0b73f858e18.png")

选择模组 modules ->next
![选择模组](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436356.png "1c2b7f00ddbea7a8e096005e33573efc.png")

进入新的窗口后，开始配置Maven，打开设置 setting
![配置Maven](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436357.png "69ea2490b6c4351776df858361be61b2.png")
![设置 setting](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436358.png "9d11ce75461559dc4d0186390c386e74.png")

因为我之前做过配置，因此只需要改变框1的路径，如第一次配置需要自己找到你maven放置的位置，以及settings.xml，repository的位置，实在不会的百度 maven集成idea
![maven集成idea](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436238.png "cf6bd61c897dd2c9edd3c801997cc248.png")

3个框选择完毕后点击 ok接下来新建module
![新建module](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436441.png "57ba6d9161917a62d8d10fda5512c135.png")

这里可能会出现加载不出archetype list的问题
![加载不出archetype list](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436400.png "cca58d3b30f97c75acef98bdefd38d79.png")

用了网上的所有解决办法花了3个小时解决都没用，重启之后竟然可以了····你敢信？？？？？小时候网吧网管的至理名言都忘了！！重启一下嘛！！出来之后 选择quickstart ->下一步
![quickstart](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436539.png "d64da9cd823860e7b323b6a198403127.png")

名字自己想 想好后，复制一下你想好的 ArtifactId点击Next，groupId为组织名 也是自己想一个，一般为公司网址反写。
![填写三点坐标](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436292.png "80ba94c6761b181dd6ac0b8ad855fceb.png")

粘贴后下一步
![下一步](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436401.png "cdf9dcb96b3b4f1d02ecf6fbde888eb4.png")
![配置pom](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436403.png "70ff06130835919bef03ee7b4d331c6a.png")

提供注册服务的服务器pom.xml配置如下：

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.yun</groupId>
    <artifactId>springcloud-eureka-server</artifactId>
    <version>1.0-SNAPSHOT</version>
    <name>springcloud-eureka-server</name><!-- FIXME change it to the project's website -->
    <url>http://www.example.com</url>
    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>1.7</maven.compiler.source>
        <maven.compiler.target>1.7</maven.compiler.target>
    </properties><!--引入springboot-parent父项目-->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>1.5.7.RELEASE</version>
    </parent>
    <dependencies><!--引入springcloud的euekea server依赖-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
        </dependency>
    </dependencies><!--指定下载源和使用springcloud的版本-->
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>Edgware.SR5</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
</project>
```

点击Import Changes
![Import Changes](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436330.png "fb897e20e2ebfa345894b85516efcde0.png")

等待右下角加载springcloud的依赖
![加载springcloud的依赖](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436332.png "a5ccf13afe2c16e94229e6a0d3bec7dc.png")

#### 2.2 Springboot搭建及服务配置

创建resources文件夹
![创建resources](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436404.png "f96ef8ff3c1ddc40fb9fc7ae55e3eeec.png")

并设置作为资源根目录，之后文件变成这样
![设置作为资源根目录](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436333.png "6d4e249f7e1ba3678c6c439c3fb2fd39.png")

之后文件夹变成有黄色的横杠
![Resources Root](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436758.png "25b30fcfad79a9595451b38e6d7c0baf.png")

在resources下新建文件，文件名为application.yml （对是yml 不是xml ，博主第一次学习时，还以为是其他博主打错了，踩了一个小坑）
![新建application.yml](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436425.png "8815d84a17fb6da1b25077e3f8abb91e.png")

配置yml，注意：如果只配置前两行端口号信息会报错
![配置yml](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436334.png "7767eb3b848a9e8b13a37f9fe94ad4ef.png")

``` yml
server:
  port: 8700
  # 端口自己决定
  # 指定当前eureka客户端的注册地址，也就是eureka服务的提供方，当前配置的服务的注册服务方
  eureka:
    client:
      service-url:
        defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka
      register-with-eureka: false #自身不在向eureka注册
      fetch-registry: false #启动时禁用client的注册
    instance:
      hostname: localhost
#指定应用名称
spring:
  application:
    name: eureka-server
```

知识补充：
![](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436439.png "fd638f55a47407eef0fd5d6078b8b86b.png")

开发springboot的入口类 
EurekaServerApplication.java
![EurekaServerApplication.java](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436601.png "09f97c2ad7a1ea0ebc436f095b508cb7.png")

``` java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer //当前使用eureka的server
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
```

右键运行当前类：
![运行](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436765.png "25fc7e9145c79fc1141c6e31dde10d43.png")

运行成功console画面
![console](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436733.png "2a2217842692714c37f6073d429bc977.png")

尝试进入eureka管理界面 端口号为 yml里配置的（端口号自己设置 需要大于公用和保留的端口号）1024~65535一般我喜欢设置为 8700到8800之间如下管理界面已经可以登录了。
![登录](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436766.png "956c92446da2bfbb3546296b9f571d31.png")

#### 2.3 客户端client

提供真正服务的角色的配置， 它提供服务 在 服务注册方server （注册中心）进行注册同样新建module，选择quickstart点击下一步
![quickstart点击下一步](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436806.png "9c807fd636f406e0156aae72c2138165.png")

两个位置 置空![置空](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436734.png "a74a063ba5756a92fa28807c02c726f1.png")

取名 下一步![下一步](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436736.png "1e1a9efa59b0c4ddf399003251483102.png")

注意这里要在根目录springcloud 下创建模组，content root 会默认在之前的模组之下创建模组 这样创建模组会出现问题并报错
![报错](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436600.png "8b54e6692087ff634564a7c6815f1926.png")

推荐这种配置方法 在content root下springcloud后改名字 如下图配置点下一步，红框处一般默认为上一个模组的文件目录名，需要改为你的模组名
![模组](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436737.png "891f59ea7b65aaae50e259b468cb89e8.png")

成功后为并列状态，如不为并列或报错请重新配置
![并列](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436752.png "6e95b195834b85b6ac94280a29bcd09f.png")

配置servicesupport的pom，与server的pom配置相同，只需要把第一个pom的1的方框处server改为client和第一个微服务同理 我们需要配置入口类 pom.xml application.yml，因为是服务提供者，这里还需编写服务类controller 
application.yml

``` yml
server:
  port: 8701 # 服务提供方
 
# 指定当前eureka客户端的注册地址,
eureka:
  client:
    service-url:
      defaultZone: http://${eureka.instance.hostname}:8700/eureka
  instance:
    hostname: localhost
 
#当前服务名称
spring:
  application:
    name: eureka-service
```

pom.xml:
![pom.xml](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436900.png "af3cf3f2911f483e0d5cc0f863b2ac2c.png")

编写所提供的 服务controller：

``` java
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
 
@RestController
@RequestMapping("/Hello")
public class Controller {
    @RequestMapping("/World")
    public String helloWorld(String s){
        System.out.println("传入的值为："+s);
        return "传入的值为："+s;
    }
}
```

入口类 并运行此微服务：

``` java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
 
@SpringBootApplication
@EnableDiscoveryClient//代表自己是一个服务提供方
public class EurekaServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServiceApplication.class,args);
    }
}
```

右键入口类名点击 run（当然开启此服务时需要先开启server服务 就是我们第一个编写的微服务）
![run](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436836.png "3c62a45db6d752152f1be32feee521a7.png")

此时再进入服务注册的页面 <http://localhost:8700/>可以看见服务提供者已被注册进 服务注册者
![服务注册](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436757.png "459ec9c2d17f3bd71a155b7c429855de.png")

在直接访问一下服务提供者的 网络位置http://localhost:8701/Hello/World?s=小沛
我们已经看见 可以访问了，证明此微服务可用。
![服务可用](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436692.png "5a27787cd736ac9c7c10293a5cab5fee.png")

但是我们一般不直接调用所需的微服务，而是经过提供注册服务的服务器server，获取所需的服务提供者列表（为一个列表，此列表包含了能提供相应服务的服务器），他们也许是个集群，因此server会返回一个 ip+端口号的表，服务消费者通过相应算法访问这表上的不同服务器，这些服务器提供的是相同的服务，这种在服务消费者一方挑选服务器为自己服务的方式是一种客户端的负载均衡。目前博主所知的有 轮询和随机两种方式 访问这些服务器，轮询就是循环的意思，假如有3台服务器，访问方式就是1,2,3,1,2,3,1,2,3····，随机就是随机，回想一下random方法，一种无规律的方式。

这两种方式都是为了，访问每个服务器的可能性尽量的相同。还有权重负载这种算法，意思就是 根据服务器负载能力的分配相应的服务。能力大的干得多。能力小的干得少。

#### 2.4 服务的调用方式
第一种调用方式：restTemplate + ribbon
第二种调用方式：feign

##### 2.4.1 restTemplate + ribbonRibbon
是一种负载均衡的客户端，它是什么呢？可以看见其中的一段如下：

> 而客户端负载均衡和服务端负载均衡最大的不同点在于上面所提到服务清单所存储的位置。在客户端负载均衡中，所有客户端节点都维护着自己要访问的服务端清单，而这些服务端端清单来自于服务注册中心，比如上一章我们介绍的Eureka服务端。同服务端负载均衡的架构类似，在客户端负载均衡中也需要心跳去维护服务端清单的健康性，默认会创建针对各个服务治理框架的Ribbon自动化整合配置，比如Eureka中的org.springframework.cloud.netflix.ribbon.eureka.RibbonEurekaAutoConfiguration，Consul中的org.springframework.cloud.consul.discovery.RibbonConsulAutoConfiguration。在实际使用的时候，我们可以通过查看这两个类的实现，以找到它们的配置详情来帮助我们更好地使用它。

接下来我们来搭建基于ribbon的客户端，他用于消费服务。同理先搭建springboot的环境与之前搭建servicesupport不同的是：
第一步：现在pom中需要在dependencies中添加ribbon依赖

``` xml
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-ribbon</artifactId>
        </dependency>
```

第二步：yml如下配置：

``` yml
server:
  port: 8702 # 服务消费方
 
# 指定当前eureka客户端的注册地址,
eureka:
  client:
    service-url:
      defaultZone: http://${eureka.instance.hostname}:8700/eureka
  instance:
    hostname: localhost
 
#当前服务名称
spring:
  application:
    name: eureka-consumer
```

服务的消费方依旧需要在注册方8700端口去注册。配置当前服务消费方的端口8072，名字为eureka-consumer

第三步：依旧需要启动类，因为它是一个springboot的架构：

``` java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
 
 
@SpringBootApplication
@EnableDiscoveryClient //当前使用eureka的server
public class EurekaConsumerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaConsumerApplication.class,args);
    }
}
```
![springboot](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436735.png "eae1a5b7b5c44026821bf6a0af87e04b.png")

如上图：我们需要一个controller类来编写ribbon的代码。

``` java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.loadbalancer.LoadBalancerClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/Hello")
class ConsumerController {
    @Autowiredprivate
    LoadBalancerClient loadBalancerClient;
    @Autowiredprivate
    RestTemplate restTemplate;

    @RequestMapping("/Consumer")
    public String helloWorld(String s) {
        System.out.println("传入的值为：" + s);//第一种调用方式：直接调用，不经过注册中心那服务列表，直接访问的servicesupport
        // String forObject = new RestTemplate().getForObject("http://localhost:8071/Hello/World?s=" + s, String.class);
        // 第二种调用方式：根据服务名 获取服务列表 根据算法选取某个服务 并访问某个服务的网络位置
        // 根据服务名选择调用，需要注入 LoadBalancerClient
        // ServiceInstance serviceInstance = loadBalancerClient.choose("EUREKA-SERVICE");
        // String forObject = new RestTemplate().getForObject("http://"+serviceInstance.getHost()+":"+serviceInstance.getPort()+"/Hello/World?s="+s,String.class);
        // 第三种调用方式：常用，需要restTemplate注入的方式
        String forObject = restTemplate.getForObject("http://EUREKA-SERVICE/Hello/World?s=" + s, String.class);
        return forObject;
    }
}
```

我们常用第三种调用方式。这种调用方式需要一个@Bean的注解自动注入并直接调用restTemplate对象调用服务。底层调用模式与第二种调用方式一样。如下：

``` java
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
 
@Configuration
public class Beans {
    //管理简单对象
    @Bean
    @LoadBalanced
    public RestTemplate getRestTemplate(){
        return new RestTemplate();
    }
}
```

@Bean注解告诉工厂，这个方法需要自动注入。@LoadBalanced，表示需要做负载匀衡。然后如controller中一样注入一下restTemplate，并且使用他，区别是可以直接使用服务名访问了

> String forObject = restTemplate.getForObject("[http://EUREKA-SERVICE/Hello/World?s=](http://eureka-service/Hello/World?s=)" + s, String.class);

开始测试：
1.运行server的启动类：
![运行server](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436754.png "c8e38ea04dd54d6baf90ecfae227cb84.png")

2.运行servicesupport的启动类：
![运行servicesupport](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436755.png "08f56f94f8598bb3e539ee63e06efb2b.png")

3.运行serviceconsume的启动类：
![运行serviceconsume](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436756.png "44f76c58578a3a97d45ab435f0c19721.png")

浏览器访问：
![浏览器访问](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436759.png "ed0cef1fc2e4688f768f74d0740725c0.png")

8072为服务消费方的端口访问方法解析：
访问服务消费方@RequestMapping指定的路径及消费方的端口来访问消费方的controllercontroller根据服务名去server方获取获取服务列表，获取服务列表后根据随机的模式负载匀衡后去选择服务地址去访问servicesupport：如下图
![访问servicesupport](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436944.png "4ef5d4f3acba1a72593948f0574ffb50.png")

#### 2.5 Eureka server的高可用配置
点击下图配置
![配置1](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436914.png "43e74164807ffe32f71c7e9ea67333d4.png")
![配置2](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436919.png "9f1e867503f14ac4e0f5a3ba6dd2f4bf.png")

接下来配置三台01,02,03的虚拟机参数
01:8699
![8699](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436926.png "c786a5249b808099a94cc04fc6798e85.png")

02:8698
![8698](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436927.png "a3bdc4d45e8704e112a2bae22e4f1b5f.png")

03:8697
![8697](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436929.png "12c9d667579c0354660e6dbebdfac25f.png")

之后点ok保存，可看见多出三个启动项
![三个启动项](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436930.png "dd20d7c6470febcd88c6ad47f5460d23.png")

接下来分别改注册端口号，defaultZone分别启动三个启动项打开server的yml配置，删掉前两行端口号配置（图中有错，请把instance 和hostname那两行删掉）
![改注册端口号](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436931.png "2db799758eeb1388d70576f46f6699d6.png")

配置好yml后点击启动
![点击启动](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436915.png "36dafcc79436813d64c706eaaeb62089.png")

同理，我们再次改动端口号为8699和8697后，把启动项改为02，之后启动（图中有错，请把instance 和hostname那两行删掉）
![启动项改为02](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436945.png "0f27aa5645dec2d3722f1d4f4da3823b.png")

同理把yml端口改为8699 和 8698后，把启动项改为03，之后启动（图中有错，请把instance 和hostname那两行删掉）
![启动项改为03](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436962.png "eb5ca0df4364ff673264d2231116b710.png")

启动后分别访问三个01，02，03端口，已经可以看见可以访问了。
![01](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436916.png "ae85c9ce5b0db36d33f91cf7eb3a82a2.png")
![02](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436917.png "c855ebf34f3e5d94e7e373a8b5fdea05.png")
![03](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436918.png "e8584708babfb9e8a302530b01461400.png")

打开服务提供方的yml配置如下，把端口号改为三个中其中的一个。
![端口号改为三个中其中的一个](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436978.png "04ebff570837e1ed42c8b6c648de7a69.png")

启动服务提供方之后，再次访问三个01，02，03我们会发现重点：
即使服务提供方只注册了一个端口号8699，但是另外两个端口号，也能感知到服务提供方8701的存在了。三个端口号刷新均可看到如下图：
![三个端口号刷新](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436964.png "bed9825e8b182fbf1d6fa3dbebed8e7e.png")

接下来像服务消费方中添加服务注册者的端口号，这样在server挂掉任何一个的时候，都能有其他的server也能获取服务列表
![一个挂掉，其他server获取，高可用](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436928.png "151fa22c06cc25ce7abc2a8ae8d3b4ce.png")

访问以下服务消费方，发现可以通过消费方调用server服务列表并且访问service了
![消费方调用server服务列表并且访问service了](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436965.png "1a3232156528da3aec77c4992db1d54a.png")

我么随便关闭其中两个server的副本，重启serviceconsume，再进行访问。必须重启serviceconsume才能清空缓存，清掉consume里面有的服务列表。
![必须重启serviceconsume才能清空缓存](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436963.png "a4d909d6685d88be7c8cc8b28b72b8e7.png")

上图发现即使关闭两台server后依旧可以访问，如下图，依旧从server中获取了服务列表，从中也能看见之后不用再获取服务列表了。
![](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436976.png "c0db80ee5ca0e53d59703ea5f899e2eb.png")

但是当我们关掉所有server后。访问还是没问题，因为缓存了服务列表。
![缓存了服务列表](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436977.png "016a0411ce254693aacb2dbdb407e5e8.png")

但是让我们来重启一下serviceconsume，再访问就不行了。
![重启一下serviceconsume，再访问就不行了](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616491436982.png "5f13dbdb115793a9475c4be4883d34d5.png")

综上我们就完成了springcloud中server的高可用配置。