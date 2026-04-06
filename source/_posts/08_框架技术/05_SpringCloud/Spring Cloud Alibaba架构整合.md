---
title: Spring Cloud Alibaba架构整合
date: 2020-03-02 17:59:44
tags:
- SpringCloud
- SpringCloudAlibaba
categories:
- 08_框架技术
- 05_SpringCloud
---



![image-20200729130824878](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200729130826.png)

参考资料：

* https://www.imooc.com/u/1863086/articles?page=1



## 一. SpringCloudAlibaba

### 1.1 背景

- 什么是SpringCloudAlibaba?
  - 阿里巴巴结合自身[微服务](https://zhida.zhihu.com/search?content_id=190167073&content_type=Article&match_order=1&q=微服务&zhida_source=entity)实践，开源的微服务全家桶
  - 在Spring Cloud项目中孵化，很可能成为Spring Cloud第二代标准的实现
  - 在业界广泛使用，已有很多成功案例



- Spring Cloud Alibaba真实应用场景
  - 大型复杂的系统，例如大型电商系统
  - 高并发系统，例如大型门户，秒杀系统
  - 需求不明确，且变更很快的系统，例如初创公司业务系统



- Spring Cloud Alibaba与Spring Cloud
  - 简单来说，`SpringCloud Alibaba`是SpringCloud的子项目，它是SpringCloud第二代的实现；
  - 图示如下：

![image-20260406195436896](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406195438123.png)

- 总结来说：
  - 组件性能更强
  - 良好的可视化界面
  - 搭建简单，学习曲线低
  - 文档丰富并且是中文



### 1.2 项目环境搭建

- 用到的软件
  - JDK8
  - MySQL5.7
  - Maven安装与配置
  - IDEA



- 安装Maven：
  - 我们可以用IDEA自带的Maven，也可以自行下载安装Maven使用



- 安装JDK和MySQL
  - 我们可以通过网上搜索相关教程安装



## 二. SpringBoot基础

### 2.1 本章概述

![image-20260406195636875](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406195638049.png)



### 2.2 [Spring Boot](https://zhida.zhihu.com/search?content_id=190167073&content_type=Article&match_order=1&q=Spring+Boot&zhida_source=entity)是什么？能做什么？

- 是什么？
  - SpringBoot是一个快速开发的脚手架



- 作用？
  - 快速创建独立的、生产级的机遇Spring的应用程序



- 特性？
  - 无需部署WAR文件
  - 提供starter简化配置
  - 尽可能自动配置Spring以及第三方库
  - 提供“生产就绪”功能，例如指标、健康检查、外部配置等
  - 无代码生成&无XML



### 2.3 编写第一个SpringBoot应用

- 需求：
  - 整合Spring MVC
  - /test路径，我们成为“端点”



- 使用Spring Initializr快速创建SpringBoot 应用
  - 点击Create New Project -> Spring Initializr -> 配置JDK-> 选择Default-> 点击Next，如图所示：

![image-20260406195656435](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406195658194.png)



- 根据自己实际配置好Group及Artifact，Type选Maven（若为Gradle项目也可以选Gradle），其他根据实际配置，如图所示：

![image-20260406195709522](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406195710761.png)



- 选择需要的依赖，同时选择SpringBoot版本，其中如图所示的，除了2.1.5外，上方的都不是正式版，所以我们选择版本为2.1.5，如图所示：

![image-20260406195726641](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406195727985.png)



> 我们可以自己部署一个Costom，结合官方文档和网上文章，当为内王环境时，自己就可以部署一个，如图所示：

![image-20260406195800136](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406195801271.png)

- 创建接口并启动访问，如图所示：

![image-20260406195813897](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406195814917.png)



> 通过启动启动类，直接就可以运行项目，我们不需要打war包再放到tomcat中了；

### 2.4 Spring Boot应用组成分析

- 依赖：

![image-20260406195829579](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406195830952.png)



- 注解：

![image-20260406195846168](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406195847355.png)



- 配置：

![image-20260406195854977](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406195856111.png)



- 静态文件：
  - resource/static目录



- 模板引擎：
  - 支持：Freemarker、Groovy、Thymeleaf、Mustache
  - 现在逐渐前后端分离开发，模板引擎用的越来越少了
  - resource/templates 目录



### 2.5 SpringBoot 开发三板斧

- 加依赖（整合什么，就加什么的依赖）
  - 官方提供的starter格式： `spring-boot-starter-xxx`
  - 非官方提供的starter格式： `xxx-spring-boot-starter`



- 写注解：
  - 某些需要用到注解的，需要在启动类上或者指定的地方上加上注解



- 写配置：
  - 可以是Bean类型的配置类
  - 也可以是在resource下的yml&properties&等加配置



### 2.6 必会 Spring Boot [Actuator](https://zhida.zhihu.com/search?content_id=190167073&content_type=Article&match_order=1&q=Actuator&zhida_source=entity)

- 是什么？

- 如何整合？

  - 加依赖：

    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    ```

    

  - 直接启动，访问：`ip:端口/actuator`

    - health： 健康检查

      - 我们在application.yml中配置，让健康检查更加详细：

        ```properties
        management.endpoint.health.show-details=always
        ```

        

      - 如图所示：

![image-20260406200014747](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406200015882.png)



- status取值：
  - UP： 正常
  - DOWN: 遇到了问题，不正常
  - OUT_OF_SERVICE: 资源未在使用，或者不该去使用
  - UNKNOWN: 不知道





- info：不是用于监控的，我们一般用于描述应用，使用key-value形式去写，如图所示：

![image-20260406200028535](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406200029588.png)



- 展示内容如图：

![image-20260406200040396](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406200041326.png)







- 提供的监控端点如图（此处列的是常用的，可以去官方文档查看全部的）：

![image-20260406200056150](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406200100972.png)



- 激活所有的Acttuator端点，在application.yml中添加：

![image-20260406200113351](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406200114415.png)



- 激活指定的端点：

  ```properties
  management.endpoints.web.exposure.include=metrics,health
  ```

  多个以逗号隔开

### 2.7 必会 Spring Boot 配置管理

- 支持的配置格式：
  - application.yml
  - `application.yaml` - 常用
  - application.properties

properties中的值若为 `*` ,在yml中则需要改为 "`*`" yml>yaml>properties 执行顺序，如果有重复内容，则properties为最终的结果

- 环境变量：
  - 以 `${xxx}` 形式标记变量名，在IDEA中可在 Environment variables 中添加环境变量，如图所示：

![image-20260406200229047](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406200230197.png)

![image-20260406200239089](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406200240145.png)





- 外部配置文件
  - spring-boot能够读取外部的配置文件，将其配置文件放同一路经下即可，且外部的配置文件优先级更高



- 命令行参数：

  - 命令行中：

    ```powershell
    java -jar xxx.jar --server.port=8081
    ```

    

  - IDEA中：

![image-20260406200314724](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406200316417.png)





### 2.8 必会 Profile

- 如何实现不同环境不同配置？
  - 方式一：
    - 配置如图：

![image-20260406200329838](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406200330913.png)



- 在IDEA中指定要启动的环境：

![image-20260406200344705](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406200345702.png)



- 不指定环境配置的时候，就只执行公共部分的配置，我们可以配置默认的环境配置方案，如图所示：

![image-20260406200354792](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406200355860.png)





- 方式二：
  - 我们也可以创建出多个profile配置文件，然后在配置的时候选择指定的配置文件，如图所示：

![image-20260406200406857](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406200407911.png)



## 三. 微服务的拆分与编写

### 3.1 本章概述

![image-20260406200435267](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406200436416.png)



### 3.2 单体应用

- 什么是单体架构？
  - 一个归档包（例如War包）包含所有功能的应用程序，我们通常称为单体应用。而架构单体应用的方法论，就是单体应用架构



- 单体架构的优点
  - 架构简单
  - 开发、测试、部署方便



- 单体架构的缺点：
  - 复杂性高
  - 部署慢、频率低
  - 扩展能力受限（比如IO操作多的，和CPU操作多的，不能物尽其用）
  - 阻碍技术创新（更换技术栈不方便）



### 3.3 微服务

- 微服务定义
  - 微服务架构风格是一种将一个单一应用程序开发为一组小型服务的方法，每个服务运行在自己的进程中，服务间通信采用轻量级通信机制（通常用HTTP资源API）。这些服务围绕业务能力构建并且可通过全自动和部署机制独立部署。这些服务共用一个最小型的集中式的管理，服务可用不同的语言开发，使用不同的数据存储技术；



- 微服务的特性：
  - 每个微服务可独立运行在自己的进程里
  - 一系列独立运行的微服务共同构建起整个系统
  - 每个服务为独立的业务开发，一个微服务只关注某个特定的功能，例如订单管理、用户管理等
  - 可使用不同的语言与存储技术（契合项目情况与团队实力）
  - 微服务之间通过轻量的通信机制进行通信，例如通过REST API进行调用；
  - 全自动的部署机制



- 微服务架构图：

![image-20260406200512339](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406200513662.png)



- 微服务的优点：
  - 单个服务更易于开发、维护
  - 单个微服务启动较快
  - 局部修改容易部署
  - 技术栈不受限
  - 按需伸缩



- 微服务的缺点：
  - 运维要求高
  - 分布式固有的复杂性
  - 重复劳动



- 微服务的适用场景
  - 大型、复杂的项目
  - 服务压力大
  - 变更较快的服务



- 微服务不适用的场景
  - 业务稳定
  - 迭代周期长



### 3.4 项目效果演示

此处省略。

### 3.5 微服务拆分

- 领域驱动设计（Domain Driven Design）
- 面向对象（by name./ by berb.）根据名词或动词拆分
  - 职责划分
  - 通用性划分



- 合适的粒度
  - 良好地满足业务
  - 幸福感
  - 增量迭代
  - 持续进化



### 3.6 项目架构图

![image-20260406200635671](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406200637201.png)



### 3.7 数据库设计

- 建模，如图所示：

![image-20260406200708847](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406200710331.png)



- 然后导出，将其创建为实际的MySQL表

### 3.8 API文档

- 写Api文档，提前定义好要写哪些功能需求
- 如图所示：

![image-20260406200737880](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406200739077.png)



### 3.9 如何创建小程序

- 注册账号： https://mp.weixin.qq.com
- 填写信息，申请创建小程序

- 在激活邮箱中点击跳转链接，完善补全如图信息：

- 进入小程序首页，我们可以配置小程序信息等，这里我们点击 **开发设置 **，查看AppId与AppSecret

### 3.10 前段代码如何使用

- 安装Node.js
  - 下载node.js



- 假定已有对应nodejs前端项目

  - 打包命令：

    ```sh
    npm install
    ```

    

  - 打包加速命令：

    ```sh
    npm --registry [https://registry.npm.taobao.org](https://link.zhihu.com/?target=https%3A//registry.npm.taobao.org) install
    ```

    

  - 开发环境启动部署：

    ```sh
    npm run dev
    ```

    

  - 生产环境构建：

    ```sh
    npm run build
    ```

    

### 3.11 创建项目-1

- 技术选型：
  - Spring Boot(快速开发)
  - Spring Mvc（MVC框架）
  - Mybatis(持久层框架，操作数据库)+通用Mapper
  - Spring Cloud Alibaba(分布式)



- 项目结构规划：

![image-20260406201020629](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201021679.png)



### 3.12 创建项目-2

- 为项目引入通用Mapper

1. 去掉原来的依赖（如果存在）

   ```xml
   <dependency>
       <groupId>org.mybatis.spring.boot</groupId>
       <artifactId>mybatis-spring-boot-starter</artifactId>
   </dependency>
   ```

   

2. 换成通用mapper

   ```xml
   <dependency>
       <groupId>tk.mybatis</groupId>
       <artifactId>mapper-spring-boot-starter</artifactId>
       <version>2.1.5</version>
   </dependency>
   ```

   

3. 在启动类上使用MapperScan注解扫描需要的接口

   ```java
   @MapperScan("xxx")
   ```

   如图所示：

![image-20260406201122853](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201124167.png)



1. application.yml中配置mysql相关信息

![image-20260406201133872](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201135638.png)


通用Mapper专用代码生成器生成的Model会在原有基础上增加@Table,@Id,@Column等注解，方便自动回数据库字段进行映射。运行MBG有多种方法，这里只是介绍两种比较常见的方法。并且有关的内容会针对这样的运行方式进行配置；

使用Java编码方式运行MBG：

> 要使用这种方式，需要引入MBG的依赖，同时项目中应该已经有通用Mapper的依赖了。

6.  使用Plugin的方式去运行：
    1. 将如图代码引入pom.xml中的对应位置：
        ![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201223730.webp)
    
       > maven-compiler-plgin在SpringBoot中提供了，我们可以不用加
    
    2. 在 **resources/generator**目录下创建generatorConfig.xml文件，如图所示：
        ![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201236812.webp)

    3. 可以去百度这个文件下的内容，将对应的占位符信息填充即可 

       ![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201247692.webp)

    4. 如果有外部的config.properties引用，我们需要单独创建一个，将里面引入的比如username,password等信息在config.properties中补充，如图所示：
        ![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201256559.webp)
    
    5. 补充完，并且在generatorConifg.xml中配置好了所有的内容后，点击右侧Maven的插件: mybaits-generator 选择generate即可生成代码，如图所示：
        ![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201304684.webp)
    
    6. 它能生成model，也能生成通用maper的代码，如图所示：
        ![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201312355.webp) ![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201317661.webp)

### 3.13 整合[Lombok](https://zhida.zhihu.com/search?content_id=190167073&content_type=Article&match_order=1&q=Lombok&zhida_source=entity)简化代码编写

- Lombok
  - 作用： 简化代码编写，提升开发效率
  - 项目主页：([www.prjectlombok.org/)[https://w…](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fwww.prjectlombok.org%2F)%255Bhttps%3A%2F%2F[www.prjectlombok.org%2F%255D](https://link.zhihu.com/?target=http%3A//www.prjectlombok.org%2F%255d/) "[https://www.prjectlombok.org/)%5Bhttps://www.prjectlombok.org/%5D"](https://link.zhihu.com/?target=https%3A//www.prjectlombok.org/)%5Bhttps%3A//www.prjectlombok.org/%5D%22))
  - IDEA中整合Lombok：

- 在IDEA中安装好了插件后，引入下方依赖（也可以自行百度最新版本）

  ```xml
  <dependency> 
      <groupId>org.projectlombok</groupId> 
      <artifactId>lombok</artifactId> 
      <version>1.18.8</version> 
      <scope>provided</scope> 
  </dependency>
  ```

  

- 使用@Getter,@Setter,@ToString,@EqualsAndHashCode可以自动生成getter，setter，tostring等方法，如图所示：

![image-20260406201416633](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201417807.png)



- 注解说明：
  - 使用@Data就相当于使用上面这几个注解，它内部聚合了这几个注解；
  - @RequiredArgsConstructor是为标记为final的属性生成构造方法；
  - @Builder使用了建造者模式，可以以这种方式去创建对象并且同时赋值；
  - @Sl4j 注解，可以直接使用log功能



- 稳定功能和实验室功能，具体的可以在官网查看功能说明及示例；
- lombok与代码生成器：
  - Lombok增加model代码生成时，可以直接生成lombok的@Getter@Setter@ToString@Accessors(chain=true)四类注解
  - 使用者在插件配置项中增加 即可生成对应包含注解的model类





### 3.14 解决IDEA的红色警告

- 当我们引入mapper的时候，会暴露这样的警告：

![image-20260406201429625](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201430643.png)


可以看到 `userMapper` 下有一个红色警告。虽然代码本身没有问题，能正常运行，但有个警告总归有点恶心。本文分析原因，并列出解决该警告的集中方案；

- 原因：
  - 众所周知，IDEA是非常智能的，它可以理解Spring的上下文。然而UserMapper这个接口是Mybatis的，IDEA理解不了。
  - 而 `@Autowired` 默认情况下要求依赖对象（也就是 `userMapper`）必须存在。而IDEA认为注射个对象的实例/代理是个null,所以就友好的给个提示。



- 解决方案：
  - 方法一：为@Autowired注解设置required= false，允许null值就不会有警告了。如图所示：

![image-20260406201445034](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201445993.png)



- 方法二：用 `@Resource`替换 `@Autowired`

- 方法三： 在Mapper接口上加上@Repository注解

- 方法四： 使用Lombok的注解，使用构造方法注入的方式；

  - 直接在类上面使用此注解即可：

    ```java
    @RequiredArgsConstructor()
    ```

    

  - 也可以使用此方式，更推荐：

    ```java
    @RequiredArgsConstructor(onConstructor = @__(@Autowired))
    ```

    

  - 如图所示：

![image-20260406201535057](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201536386.png)



- 总结： 此种方式最为推荐，原因有2：

1. Spring官方并不建议直接在类的field上使用@Autowired注解，原因详见 《Why field injection is evil》，用本方法可将field注入编程构造方法注入，Spring是比较推荐的。
2. 体现了Lombok的优势，简化了你的代码。而且你也不用在每个field上都加上@Autowired注解了。



不过这种方式也有缺点： 那就是如果你类之间的依赖比较复杂，特别是存在循环依赖（A引用B，B引用A，或者间接引用时），引用将会启动不起来...这其实是构造方法注入方式的缺点；

- 方式五:  把IDEA的警告关闭掉
- 方式六： 安装Mybatis plugin插件



### 3.18 现有架构存在的问题

- 地址发生变化了怎么办？
- 如何实现负载均衡？
- 用户中心挂掉了怎么办？

## 四. Spring Cloud Alibaba介绍

### 4.1 Spring Cloud Alibaba是什么

- 快速构建分布式系统的工具集（主要功能如图所示：）

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201611536.jpg)



- 部分子项目如图：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201616624.jpg)



- 常用子项目如图：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201620827.jpg)



- 什么是SpringCloudAlibaba?
  - 它是Spring Cloud的子项目
  - 致力于提供微服务开发的一站式解决方案
    - 包含微服务开发的必备组件
    - 机遇Spring Cloud,符合Spring Cloud标准
    - 阿里的微服务解决方案



- SpringCloud Alibaba的功能描述：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201625754.jpg)



- 我们整理后如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201631090.jpg)





### 4.2 版本与兼容性

- 我们平时的版本是语义化的版本控制，在version中的版本号描述了此版本的大致情况，如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201637419.jpg)



- SpringCloud很多项目是以字母排序命名的，因为它容易与它的一些子依赖的版本号起歧义，所以干脆不用数字了。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201641594.jpg)



- 版本释义：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201645752.jpg)



- 版本兼容性：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201701725.jpg)



- 未来版本兼容性（如果SpringCloudAlibaba进入第二代后：）



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201704912.jpg)



- 生产环境如何选用版本？
  - 坚决不用非稳定版本/end-of-life版本
  - 尽量用最新一代
    - xxx.RELEASE版本缓一缓
    - SR2之后一般可大规模使用





### 4.3 为项目整合SpringCloudAlibaba

- 整合SpringCloudAlibaba
  - 整合SpringCloud
    - 引入依赖,如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201714104.jpg)





- 整合SpringCloudAlibaba
  - 如果使用的是Greenwich版本，则使用如图依赖：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201718379.jpg)



- 如果使用的是Finchley版本，则使用如图依赖：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201722201.jpg)





- 第一种方式整合cloud以及Alibaba如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201724955.jpg)





> 使用了如图所示内容后，我们在引入Cloud中的其他组件时，可以不指定版本，它会自动配置对应的版本。如果没有使用如图内容可能会导致依赖冲突，依赖不一致的情况。

## 五. 服务发现-Nacos

### 5.1 服务提供者与服务消费者

- 服务提供者：服务的被调用方（即：为其他微服务提供接口的微服务）
- 服务消费者：服务的调用方（即：调用其他微服务接口的微服务）

### 5.2 大白话剖析服务发现原理

- 问题：如果用户地址发生变化，怎么办？
  - 服务发现机制就是通过一个中间件去记录服务提供者的ip地址，服务名以及心跳等数据（比如用mysql去存储这些信息），然后服务消费者会去这个中间平台去查询相关信息，然后再去访问对应的地址，这就是服务注册和服务发现。
  - 当用户地址发生了变化也没有影响，因为服务提供方修改了用户地址，在中间件中会被更新，当服务消费方去访问中间件时就能及时获取最新的用户地址，就不会出现用户地址发生变化导致服务找不到



### 5.3 什么是Nacos?

- 官方文档：http://nacos.io/zh-cn/docs/what-is-nacos.html
- 微服务全景架构图:

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201937992.jpg)



- 引入Nacos后的架构演进图：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406201941171.jpg)



### 5.4 搭建Nacos Server

- 下载Nacos Server
  - (下载地址)[[github.com/alibaba/nac…](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Falibaba%2Fnacos%2Freleases)]



- 搭建Nacos Server
  - (参考文档)[[nacos.io/zh-cn/docs/…](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fnacos.io%2Fzh-cn%2Fdocs%2Fquick-start.html)]



- 启动服务器：
  - Linux/Unix/Mac:
    sh startup.sh -m standalone 复制代码
  - Windows：
    cmd startup.md 复制代码

> 此处启动命令为单机模式，非集群模式



### 5.5 将应用注册到Nacos

- 目标：
  - 用户中心注册到Nacos
  - 内容中心注册到Nacos
  - 测试： 内容中心总能找到用户中心



- 用户中心注册到Nacos

  - 加依赖：

    ```xml
    <dependency> 
        <groupId>org.springframework.cloud</groupId> 
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId> 
    </dependency>
    ```

    在SpringCloud中的依赖规则与SpringBoot类似。官方项目是以此作为结构：spring-cloud-starter-{spring cloud子项目的名称}-{模块名称}，比如feign可以这样：spring-cloud-starter-openfeign,而sentinel可以这样：spring-cloud-starter-alibaba-sentinel,当没有模块的时候，就不用加模块了，比如feign就没有

  - 加注解:

    - 早期在启动类上需要加上 @EnableDiscoveryClient注解，现在已经可以不需要加了



- 加配置：

  ```yaml
  spring:
    cloud:
      discovery:
        server-addr: localhost:8848 #指定nacos server的地址 
  application: 
    name: 服务名称 # 比如 user-center,服务名称尽量用- ，不要用_ 
  ```

  

### 5.6 为内容中心引入服务发现

- 内容中心引入参照 **章节5.5**，其他服务也如此，服务名称相应变化一下；
- 注册成功如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202131696.jpg)



> 使用DiscoverClient的相关Api可以在代码中获取Nacos提供的微服务的一些信息，调用方法如图：

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202143060.png)

### 5.7 Nacos服务发现的领域模型

- 如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202147973.jpg)



- 不同namespace是隔离的，使用Group可以进行管理（比如多个机房多个服务，可以将同机房的服务分一个组），Cluster是同一个Cluster下会尽量调用自己的Cluster服务；
- 各个关键字释义如下：
  - Namespace: 实现隔离，默认public
  - Group: 不同服务可以分到一个组，默认DEFAULT_GROUP
  - Service： 微服务
  - Cluster: 对指定微服务的一个虚拟划分，默认DEFAULT
  - Instance: 微服务实例



- 指定方法，代码如图：
  - 首先在Nacos中配置NameSpace:

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202154267.jpg)



- 然后在代码中添加字段：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202157653.jpg)





### 5.8 Nacos元数据

- 什么是元数据？（Metadata）
  - Nacos数据（如配置和服务）描述信息，如服务版本、权重、容灾策略、负载均衡策略、鉴权配置、各种自定义标签（label），从作用范围来看，分为服务级别的元信息、集群的元信息及实例的元信息。



- 应用（Application）
  - 用于标识服务提供方的服务的属性



- 服务分组（Service Group）
  - 不同的服务可以归类到同一分组



- 虚拟集群（Virtual Cluster）
  - 同一个服务下的所有服务实例组成一个默认集群，集群可以被进一步按需求划分，划分的单位可以是虚拟集群；





![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202210465.jpg)



- 元数据是什么？
  - (官方描述)[[nacos.io/zh-cn/docs/…](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fnacos.io%2Fzh-cn%2Fdocs%2Fconcepts.html)]
  - 级别: [服务级别、集群级别、实例级别]



- 元数据作用：
  - 提供描述信息
  - 让微服务调用更加灵活： 例如微服务版本控制



- 元数据操作方式：

1. 如上图中可以在Nacos Server中进行 集群、服务、实例各级别的元数据控制
2. 在application.yml中进行配置，如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202217297.jpg)





## 六. 实现负载均衡

### 6.1 负载均衡的两种方式

- 服务器端负载均衡：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202226431.jpg)



- 客户端负载均衡：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202230253.jpg)



### 6.2 手写一个客户端侧负载均衡器

- 手写负载均衡器部分代码如图：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202233907.jpg)


手写负载均衡器主要原理就是获取到此服务的所有url，然后以轮询、随机等方式进行调用指定的url

### 6.3 使用Ribbon实现负载均衡

- Ribbon是什么？
  - Ribbon为我们提供了丰富的负载均衡算法；



- 引入Ribbon：

1. 加依赖： 此步骤省略，因为Nacos已经结合了Ribbon
2. 写注解：

- 在RestTemplate的Bean上加@LoadBalanced，如图所示：

  ```java
  @Bean 
  @LoadBalanced 
  public RestTemplate restTemplate{ 
      return new RestTemplate() 
  }
  ```

  

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202239977.jpg)



- 使用RestTemplate：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202304606.jpg)







### 6.4 Ribbon组成

- Ribbon的组成如图，若不合适自己的，可以进行重写

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202308385.jpg)



### 6.5 Ribbon内置的负载均衡规则

- 负载均衡规则如图：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202317403.jpg)



### 6.6 细粒度配置自定义01-Java代码

- 用Java代码配置

  - 在与启动类包下创建：

    ```java
    @RibonClient(name = "服务名称", configuration=RibbonConfiguration.class) 
    public class XXXRibbonConfiguration{ }
    ```

    

  - 如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202339816.jpg)



- 在与启动类包不同路径下创建：

  ```java
  @Configuration
  public class RibbonConfiguration{
      @Bean public IRule ribbonRule(){ 
          // 随机 return new RandomRule(); 
      }
  }
  ```

  

- 如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202427907.jpg)



Ribbon的启动类不能被启动类扫描到，不然容易发生父子上下文重叠，出现各种bug问题；

### 6.7 细粒度配置自定义02-父子上下文

- 官方描述如图，父子上下文重叠会变成全局共享，所有服务都是这个配置；

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202437403.jpg)



### 6.8 细粒度配置自定义03-配置属性

- 在resource目录下的application.yml中添加配置：

  ```yaml
  xxx服务名称: 
    ribbon: 
      NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule # 想要的规则的类的所在全路径
  ```

  

- 如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202520762.jpg)



### 6.9 细粒度配置自定义04-两种方式

- 对比如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202526371.jpg)



> 属性配置方式优先级更高。

### 6.10 细粒度配置自定义05-最佳实践

1. 尽量使用属性配置，属性方式实现不了的情况下再考虑用代码配置
2. 在同一个微服务内尽量保持单一性，比如统一使用属性配置，不要两种方式混用，增加定位代码的复杂性；

### 6.11 全局配置

- 让父子上下文重叠（强烈不建议使用，因为可能会导致项目无法启动，同时也不是科学的解决方案）
- 在我们定义的XXXRibbonConfiguration中，把configuration改为defaultConfiguration即可，代码如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202532324.jpg)



### 6.12 支持的配置项

- 如图的每一项都支持，方式就是定义一个Bean,去返回它的实现类。如果配置实现类，则给指定的key值，value值为实现类的全路径地址；
- 配置规则如图：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202536046.jpg)



- 代码配置如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202540192.jpg)



- 配置属性方式如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202544015.jpg)



> 代码配置和属性配置与之前上面的自定义配置一样；

### 6.13 饥饿加载

- 在使用RestTemplate的时候，用Rabbon时会进行懒加载，头一次的访问会比较慢。我们可以通过改变加载模式，将懒加载改为饥饿加载，这样第一次请求就不会慢了，在`application.yml`中进行配置：

  ```yaml
  ribbon: 
    eager-load:
      enabled: true
        clients: xxx服务名 # 多个服务，以 `,`号分割
  ```

  

> 此处为开启饥饿加载

### 6.14 扩展Ribbon-支持Nacos权重

- 因为Spring中的子项目没有对权重进行定义规范，所以它不支持权重，而Nacos是支持的；
- 扩展Ribbon支持权重的三种方式： [https://www.imooc.com/article/288…](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttp%3A%2F%2Fwww.imooc.com%2Farticle%2F288660)
- 操作如图：
  - 定义一个类去继承另外一个类 `AbstractLoadBalancerRule`并实现方法，如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202733011.jpg)



- 补全代码：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202736712.jpg)



- 定义Bean替换默认的：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202740631.jpg)



- 在Nacos中编辑权重：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202743775.jpg)





### 6.15 扩展Ribbon-同一集群优先调用

- 服务发现的领域模型：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202747884.jpg)



- 使用Cluster可以非常方便的实现统一集群优先调用的办法，具体可百度

### 6.16 扩展Ribbon-基于元数据的版本

- 多版本共存的时候，某些接口只对指定的版本生效，我们可以扩展Ribbon,使用Nacos元数据来解决这个问题；
- 元数据解决办法，文档跳转：[使用元数据解决数据共存问题](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fwww.imoooc.com%2Farticle%2F288674)

### 6.17 深入理解Nacos的NameSpace

- NameSpace是命名空间。处于不同命名空间的服务，它们之间是隔离的，通过这个特点，我们可以多个环境同时注册Nacos，通过处于不同的命名空间，去区分dev/test/prod等不同环境
- 代码如图：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202758394.jpg)



### 6.18 现有架构存在的问题

- 远程调用代码不可读，url过长，不能准确区分出服务，复杂的url难以维护
- 微服务适应于快速迭代，就目前而言，难以响应需求的变化
- 编程体验不统一

## 七. 声明式HTTP客户端： Feign

### 7.1 使用Feign实现远程Http调用

- Feign是NetFlix的一款声明式远程调用HTTP客户端；
- [GitHub地址](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fopenfeign%2Ffeign)
- 整合办法：

1. pom.xml中引入依赖

   ```xml
   <dependency> 
       <groupId>org.springframework.cloud</groupId> 
       <artifactId>spring-cloud-starter-openfeign</artifactId> 
   </dependency>
   ```

   

2. 写注解，启动类上加上 `@EnableFeignClients` 注解

3. 写配置，暂时没有

4. 写一个Feign示例：

   ```java
   @FeignClient(name="xxx服务名称")
   public interface xxxFeignCLient{
       // 这是一个Feign的示例
       @GetMapping("xxx/xxx")
       XXX findById(xxx xxx) 
   }
   ```

   

- Feign与Ribbon也可以一起整合，可以参考Feign的整合方式

### 7.2 Feign的组成

- 组成如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202947897.jpg)


使用RequestInterceptor可以进行拦截，我们可以加上通用逻辑，比如为每个Feign的方法在调用的时候，都加上Header，Header里可以统一带上AuthToken

### 7.3 细粒度配置自定义-01-Java代码

- Feign的日志级别：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202953034.jpg)


Feign的日志级别与通用的日志级别不同，它自己定义了四种日志级别

- 用Java代码配置如图：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202956359.jpg)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406202959822.jpg)



> 在配置类中，不能加@Configuration,如果加了必须在启动类能扫描的地方以外，否则会发生父子上下文异常，导致全局共享这个配置类

### 7.4 细粒度配置自定义-02-配置属性

- 在resource/appilcation.yml中进行配置：

  ```yaml
  feign: 
    client: 
      config: # 想要调用的微服务名称 
      user-center: 
        loggerLevel: full 
  ```

  

### 7.5 全局配置-01-Java代码方式

1. 让父子上下文重叠（不建议，这是以不正规的方式实现的）
2. 唯一正确的途径： 在启动类中的 `@EnableFeignClients(defaultConfiguration=xxx.class)`

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203031091.jpg)



### 7.6 全局配置-02-配置属性方式

- 在resource/application.yml中进行设置

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203042138.jpg)



### 7.7 支持的配置项

- 代码方式，如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203048040.jpg)



- 属性方式，如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203051888.jpg)



### 7.8 配置最佳实践总结

- 概述：
  - Rinnbon配置 vs Feign配置
  - Feign代码方式 vs 属性方式
  - 最佳实践总结



- 对比图如图：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203059355.jpg)



- Feign代码方式 Vs 属性方式：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203102071.jpg)



- 最佳实践：
  - 尽量使用属性配置，属性方式实现不了的情况下再考虑用代码配置
  - 在同一个微服务内尽量保持单一性，比如统一使用属性配置，不要两种方式混用



### 7.9 Feign的继承

- 当我们有一些服务存在一些相同的Feign远程调用时，我们可以将这些通用的Feign独立出来，然后写在外部的一些地方然后引用进来，直接继承。这样就可以一次修改，处处生效，同时遵循契约写法。
- 官方不建议使用，因为这样会导致多个微服务紧耦合。实际上很多公司在采用这种方式，个人可以权衡利弊。

### 7.10 GetMapping如何发送Feign请求

- 使用@GetMapping请求方式的Feign调用，它仍然会发送Post请求，所以会导致请求异常；
- 解决办法如下：

1. 使用@SpringQueryMap 推荐，如图所示：

   ```java
   @FeignClient("xxxx-xx") 
   public interface UserFeignClient{ 
       @GetMapping("/get") 
       public User get0(@SpringQueryMap User user);
   }
   ```

   

2. 方法二：Url中有几个参数，Feign接口中的方法就有几个参数。使用@RequestParam注解指定请求的参数是什么

   ```java
   @FeignClient("xxxx-xx") 
   public interface UserFeignClient{ 
       @GetMapping("/get") 
       public User get0(@RequestParam("id")Long id,@RequestParam("username")String str); 
   }
   ```

   

3. 多参数的Url也可以使用Map来进行构建。当目标Url参数非常多的时候，可使用这种方式简化Feign接口的编写：

   ```java
   @FeignClient("xxxx-xx") 
   public interface UserFeignClient{ 
       @GetMapping("/get") 
       public User get0(@RequestParam Map<String,Object>map); 
   }
   ```

   调用时可以使用类似如图代码：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203212980.jpg)





### 7.11 Feign脱离Ribbon使用

- 脱离Ribbon使用就是不直接指定服务名去调用，而是直接填入url地址：
- 代码如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203217629.jpg)



- Feign支持占位符，如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203222202.jpg)



> 在早期的Spring Cloud版本中，无需提供name属性，从Brixton版开始，@FeignClient必须提供name属性，否则应用将无法正常启动；

### 7.12 RestTemplate VS Feign

- 对比如图：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203228487.jpg)



- 如何选择？
  - 原则：尽量使用Feign，杜绝使用RestTemplate
  - 事无绝对，合理选择，就是如果Feign解决不了的，只有RestTemplate才能的情形



### 7.13 Feign常见性能优化

- 配置连接池（提升15%左右）
  - okHtpp HttpClient都支持连接池



- 配置HttpClient:

1. 引入依赖：

   ```xml
   <dependency> 
       <group>io.github.openfeign</groupId> 
       <artifactId>feign-httpclient</artifactId> 
   </dependency>
   ```

   

2. application.yml中进行配置：

   ```yaml
   # Feign 客户端配置
   feign:
     # 客户端全局配置
     client:
       config:
         default:
           loggerLevel: full  # 日志级别：full=最全
   
     # Apache HttpClient 连接池（提升性能，必须独立配置）
     httpclient:
       enabled: true                        # 启用 Apache 连接池（替代默认 URLConnection）
       max-connections: 200                 # 全局最大连接数
       max-connections-per-route: 50        # 每个接口路径最大并发连接数
   ```

   

- 也可以使用OkHttp:

1. 引入依赖：

   ```xml
   <dependency> 
       <groupId>io.github.openfeign</groupId> 
       <artifactId>feign-okhttp</artifactId> 
       <version>10.1.0</verrsion> 
   </dependency>
   ```

   

2. 在application.yml中增加配置：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203423294.jpg)





- 还有一个优化是降低日志级别，越低的日志级别，打印的日志越少，同时性能就越高

### 7.14 常见问题总结

- 地址：[www.imooc.com/article/289…](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fwww.imooc.com%2Farticle%2F289005)

## 八. 服务容错

### 8.1 雪崩效应

- 在我们的系统中，当一个服务宕机后，其他服务如果需要来访问这个服务时，就会得不到结果，然后会一直等待此服务返回结果，直至调用超时。每个一个访问请求都是一个线程资源，当服务的调用次数过多，就会导致大量的资源得不到释放，可能就会导致消费服务方也宕机，这样类推会导致雪崩效应，就是由一个服务宕机导致其他服务系统资源被持续占用消耗得不到释放，从而引发一连串的级联失败。

### 8.2 常见容错方案

1. 设置超时时间
2. 设置限流
3. 仓壁模式：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203438394.jpg)


比如这个船，里面每个船舱都是独立的，当一个船舱进水了，也不会导致所有的船舱进水，从而使船沉没。每个Controller作为一个“船舱”

1. 断路器
   1. 参考我们日常中的电闸，当用电量超过阀值时，就会跳闸；
   2. 短路器的三态转换：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203442492.jpg)





### 8.3 使用Sentinel实现容错

- Sentinel是什么？
  - 它是一个轻量级容错的库



- 引入：

1. 引入依赖：

   ```xml
   <dependency> 
       <groupId>org.springframework.cloud</groupId> 
       <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId> 
   </dependency>
   ```

   

2. 引入actuator

   ```xml
   <dependency> 
       <groupId>org.springframework.boot</groupId> 
       <artifactId>spring-boot-starter-actuator</artifactId> 
   </dependency>
   ```

   

3. application.yml 加入配置，暴露端点：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203518577.jpg)



1. 访问 localhost:服务端口号/actuator/sentinel，出现如下图所示画面，即为配置完成：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203521999.jpg)





### 8.4 Sentinel控制台

- 搭建控制台：
  - (地址)[[github.com/alibaba/Sen…](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Falibaba%2FSentinel%2Freleases)]
  - 版本选择： 根据我们的依赖版本或者使用最新的也可以，如果用在生产环境，最好是依赖与控制台版本相同；
  - 使用方式：

1. 下载

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203527975.jpg)



1. 传入服务器，运行以下命令启动：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203531792.jpg)



1. 访问web页面：ip/8080/#/login   输入账号密码均为： sentinel

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203536930.jpg)



1. 添加配置：

   ```yaml
   spring:
     cloud:
       sentinel:
         transport:
           dashboard: localhost:8080   # 控制台地址
           port: 8719                  # 与控制台通信端口（默认即可）
         eager: true                   # 服务启动即连接控制台
   ```

   

> sentinel是懒加载

### 8.5 流控规则

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203616351.jpg)



- QPS 和线程数，是过滤条件，以哪种方式来进行过滤。单机阀值是达到多少量后进行流控；
- 流控模式有三种，分别是直接、关联和链路。直接就是最常见的一种模式，限流达到了，直接对这个接口生效。而流控效果就是生效的三种形式；快速失败也是最常用的一种，就是当达到阀值后，这个直接接口直接返回失败。而流控模式-关联 表示，当访问填入入口资源的路径的单机阀值触发了，此接口就会触发所选择的流控效果；而链路就表示只对此入口过来的数据对此接口触发限流规则；Warm up是热等待，它会在指定的时间后完成触发效果；排队等待是不返回失败，而是进行排队，一个处理完了，再去处理另外一个。
- Warm Up

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203621909.jpg)



- 它可以让流量缓慢增加。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203624754.jpg)





- 排队等待：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203629206.jpg)



### 8.6 降级规则详解

- RT降级规则图示：
  - 图一：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203633411.jpg)



- 图二：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203638051.jpg)

> RT 默认最大4900ms,通过 -Dcsp.sentinel.statistic.max.rt=xxx 修改

- 降级-异常比例：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203642088.jpg)



- 降级-异常数：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203653793.jpg)


注意点: 时间窗口 < 60秒可能会出问题 比如我们设置时间窗口为10秒，当触发降级内如果异常数依然触发降级，那么可能会再次降级

- 源码：
  - com.alibaba.csp.sentinel.slots.block.degrade.DegradeRule#passCheck



- 官方解释：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203702676.jpg)



- 注意： 目前Sentinel没有半开状态，后期可能会推出半开；

### 8.7 热点规则详解

- 热点规则的功能是，能够对指定的接口进行限流。可以对这个接口的某个参数，某个类型，以及这个参数取某个值时单位时间内限流等；它能够对一些热点接口起到保护的作用，所以叫做热点规则；
- 定义一个热点规则：

1. 定义接口：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203708332.jpg)



1. 配置热点规则

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203711668.jpg)



- 适用于场景：

1. QPS非常高的接口或者参数
2. 参数必须为基本类型或者String



- 源码地址：
  - com.alibaba.csp.sentinel.slots.block.flow.param.ParamFlowChecker#passCheck



### 8.8 系统规则详解

- 图示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203720374.jpg)



- 系统-Load：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203723883.jpg)



- 系统-RT、线程数、入口QPS：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203727165.jpg)



- 源码地址：
  - com.alibaba.csp.sentinel.slots.block.flow.param.ParamFlowChecker#passCheck



### 8.9 授权规则详解

- 概述：
  - 授权规则可以对服务消费者的授权，限制访问等



- 图示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203732355.jpg)



### 8.10 代码配置详解

- 配置方法手记：[配置方法手记](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fwww.imooc.com%2Farticle%2F289345)
- 扩展Sentinel以及学习其架构有一定意义，我们也可以直接通过这个界面去配置就可以。

### 8.11 Sentinel与控制台通信原理剖析

- 问题：

1. 控制台是如何获取到微服务的监控信息的？

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203737457.jpg)



- 定时推送到控制台



1. 用控制台配置规则时，控制台是如何将规则发送到各个微服务的呢？



- 相关源码：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203927205.jpg)



### 8.12 控制台相关配置项

- 图示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203930651.jpg)



- 操作： 启动Sentinel jar的时候，传入参数即可，如图：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203933506.jpg)



### 8.13 Sentinel API详解

- 图示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203936563.jpg)


这样就会统计这个流控，同时如果超过限流阀值，就会执行catch内的代码；

- 监控其他异常情况：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203940097.jpg)



- 来源：
  - 图示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203944400.jpg)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203947508.jpg)


结尾需要关闭流

- 针对此来源的服务可以进行单独限流规则：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203950474.jpg)





- 主要API：

1. SphU：定义资源，让资源被监控，并且可以保护资源
2. Tracer: 对我们想要的其他异常进行统计
3. ContextUtil:针对来源



> 后期我们可以用更简单的办法来实现，但都是基于此上图中的代码实现的；

### 8.14 SentinelResource注解详解

- 使用此注解可以完成 **8.13** 的功能，手记地址： [手记地址](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fwww.imooc.com%2Farticle%2F289384)
- 代码图示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406203958118.jpg)


这里面的block可以处理限流或者降级。处理降级可以单独使用fallback关键字，然后也类似于block一样写一个方法即可；升级到sentinel 1.6 可以处理Throwable

- 相关源码：
  - com.alibaba.csp.sentinel.annotation.aspectj.SentinelResourceAspect
  - com.alibaba.csp.sentinel.annotation.aspectj.AbstractSentinelAspectSupport



### 8.15 RestTemplate整合Sentinel

- 只需要使用@SentinelRestTemplate注解即可
  - 图示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204002112.jpg)


开关在 application.yml中进行配置



- 代码如图所示：

1. 为RestTemplate加上注解：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204020354.jpg)



1. 代码中使用RestTemplate即可，这样会在Sentinel获取到监控信息，如果将开关改为false,则就不能获取到信息了。



### 8.16 Feign整合Sentinel

- 使用Fallback：

1. 添加配置：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204025114.jpg)



1. 在Feign中指向一个类：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204028827.jpg)



1. 补全这个类：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204032213.jpg)





- 使用FallbackFactory,它的功能更强大，且能够拿到异常：

1. 定义类：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204035826.jpg)



1. Feign去引用这个FallbackFactory:

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204039579.jpg)





- 源码：
  - org.springframework.cloud.alibaba.sentinel.feign.Sentinel



### 8.17 Sentinel使用姿势总结



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204043477.jpg)



### 8.18 规则持久化01-拉模式

- 手记地址：[手记地址](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fwww.imooc.com%2Farticle%2F289402)

> 配置好了重新刷新可能会没有数据展示，可以先去访问接口再回来刷新，因为它是懒加载模式；

- 拉模式优缺点：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204053102.jpg)



### 8.19 规则持久化02-推模式

- 手记地址：[手记地址](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fwww.imooc.com%2Farticle%2F289464)

### 8.20 生产环境使用Sentinel



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204058250.jpg)



### 8.21 集群流控

- 集群流控官方文档： hppts://[http://github.com/alibaba/Sentinel/wiki/](https://link.zhihu.com/?target=http%3A//github.com/alibaba/Sentinel/wiki/)集群流控

> 网关gateway也可以实现类似集群流控的效果，且更加简单，性能更好；

### 8.22 扩展Sentinel01- 错误页优化

- 使用UrlBlockHandler可以优化错误提示，这样我们能区分出这个接口是因为 **限流**或**降级**还是**异常**的原因导致的；
- 代码操作：

1. 继承接口：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204123817.jpg)



1. 编写代码：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204127939.jpg)



1. 返回结果

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210439971.jpg)





### 8.23 扩展Sentinel02- 实现区分来源

- 区分来源：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204130587.jpg)



- 将指定来源配置规则：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204133854.jpg)



### 8.24 扩展Sentinel03- RESTFUL URL

- 使用如下图代码，可以让所有相同资源名称的路径使用相同的限流规则：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204137397.jpg)



- 配置资源如图：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204140750.jpg)



### 8.25 扩展Sentinel04- 通过现象看本质

- 总结来说：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204145832.jpg)



### 8.26 配置项总结

- 配置项总结手记：[配置项总结手记](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fwww.imooc.com%2Farticle%2F289562)

### 8.27 本章总结：再谈常见容错方案

- 常见容错方案：
  - 超时
  - 限流
  - 仓壁模式（没有实现）： Sentinel虽然没有用仓壁模式，但是它规定了哪些线程用于哪些地方，这样实现了类似仓壁模式的效果
  - 断路器

## 九. 消息驱动的微服务-Spring Cloud Alibaba

### 9.1 Spring实现异步的方法

- AsyncRestTemplate: [参考文档](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fblog.csdn.net%2Fjiangchao858%2Farticle%2Fdetails%2F86709750)
- @Async注解： [参考文档](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fspring.io%2Fguides%2Fgs%2Fasync-method%2F)
- WebClient(Spring 5.0引入）：[参考文档](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fdocs.spring.io%2Fspring%2Fdocs%2F5.1.8.RELEASE%2Fspring-framework-reference%2Fweb-reactive.html%23webflux-client)
- MQ

### 9.2 引入MQ后的架构演进

- 引入MQ后，一些同步耗时的地方可以用异步处理，MQ作为一个中间件连接两个地方

### 9.3 MQ适用场景

- 异步处理
- 流量削峰填谷
- 解耦微服务

### 9.4 MQ的选择

- MQ的种类：
  - Kafka
  - RabbitMQ
  - RocketMQ
  - ActiveMQ



- 手记：[MQ的选择](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fwww.imooc.com%2Farticle%2F290040)
- RocketMQ成功案例： [参考](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttp%3A%2F%2Frocketmq.apache.org%2Fusers%2F)

### 9.5 搭建RocketMQ

- [手记](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fwww.imooc.com%2Farticle%2F290089)

### 9.6 搭建RocketMQ控制台

- [手记](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fwww.imooc.com%2Farticle%2F290092)

### 9.7 RocketMQ的术语与概念

- 术语/概念：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204217007.jpg)



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204221124.jpg)



### 9.8 RocketMQ进阶

- 如果要完整的去理解RocketMQ，我们需要阅读[开发者指南](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fgit.imooc.com%2Fcoding-358%2Frocketmq-dev-guide)

### 9.9 Spring消息编程模型01

- 在项目中使用RocketMQ：

1. 引入依赖：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204229915.jpg)



1. 写注解： 无注解
2. 写配置：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204233403.jpg)



1. 引入RocketTemplate:

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204235860.jpg)



1. 发送消息：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204238780.jpg)





> 不指定group会报异常，后期不知是否会处理这种；

- 工具类的使用:

1. RocketMQ: RocketMQTemplate
2. ActiveMQ/Artemis:JmsTemplate
3. RabbitMQ:AmqpTemplate
4. Kafka: KafkaTemplate



### 9.10 Spring消息编程模型02

- 我们已经编写好了消息的生产者，接下来我们来编写消息的消费者：
- 步骤如下：

1. 引入依赖：

   ```xml
   <dependency> 
       <groupId>org.apache.rocketmq</groupId> 
       <artifactId>rocketmq-spring-boot-starter</artifactId> 
       <version>2.0.3</version> 
   </dependency>
   ```

   

2. 写配置，在application.yml中编写：

   ```yaml
   rocketmq: 
     name-server:127.0.0.1:9876
   ```

   name-server的值根据每个人自身实际的ip及端口来填写，以我们安装的rocketmq地址来决定

3. 创建接收消息的对象：

   ```java
   @Data 
   @NoArgsConstructor 
   @AllArgsConstructor 
   @Builder 
   public class UserAddBOnusMsgDTO{ 
       /** * 为谁加积分 */ 
       private Integer userId； 
       /** * 加多少积分 */ 
       private Integer bonus; 
   }
   ```

   

4. 创建消息监听类：

   ```java
   @Service 
   @RocketMQMessageListener(consumerGroup= "consumer-group",topic= "add-bonus") 
   public class AddBonusListener implements RocketMQListener<UserAddBonusMsgDTO>{ 
       @Override 
       public void onMessage(UserAddBonusMsgDTO message){ 
           System.out.println(message.getUserId()) 
               System.out.println(message.getBonus()) 
       } 
   }
   ```

   注意：consumerGroup在生产者中是写到配置文件中的，在消费者中是在此处进行指定的。topic在生产者中是发送消息的时候添加，在此处是接收监听类的时候指定，这两个都必须带上；



- [官方文档中对各类MQ的使用方法总结](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3Adocs.spring.io%2Fsring-boot%2Fdocs%2F2.1.5.RELEASE%2Freference%2Fhtml%2Fboot-features-messaging.html%23boot-features-jms)
- 消费者各个MQ的注解简单总结：
  - RocketMQ: RocketMQMessageListener
  - ActiveMQ/Artemis:JmsListener
  - RabbitMQ: RabbitListener
  - Kafka: KafkaListener



### 9.11 分布式事务01

- 以前解决事务的办法： `@Transactional(rollbackFor= Exception.class)` 当发现了Exception异常，就进行回滚
- 存在的问题：
  - 图示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204426876.jpg)



- 问题概述：当我们的逻辑代码中，不仅仅对数据库做了处理，一些场景下我们需要同时进行消息发送和与MySQL进行交互的功能；此图中，我们首先进行了消息发送，然后再把消息写入缓存，那么就会导致： 如果写入缓存的时候，代码执行失败，回滚操作只能回滚数据库，消息已经被消费者监听到了并做了处理了。



- RocketMQ实现事务的流程：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204431544.jpg)


简单来说RocketMQ实现分布式事务的原理是： 执行到应该发送消息的时候，它并未发送，而是处于“准备发送”阶段，当所有的代码都已执行完毕且无异常时，则进行完全发送，此刻消息消费者才能监听到消息；

- 概念术语解答：
  - 半消息（Half(Prepare) Message）
    - 暂时无法消费的消息。生产者将消息发送到了MQ server，但这个消息会被标记为“暂不能投递”状态，先存储起来；消费者不会去消费这条消息



- 消息回查（Message Status Check）
  - 网络断开或生产者重启可能会导致丢失事务消息的第二次确认。当MQ Server发现消息长时间处于半消息状态时，将向消息生产者发送请求，询问该消息的最终状态（提交或回滚）



- 消息三态：
  - Commit：提交事务消息，消费者可以消费此消息
  - Rollback: 回滚事务消息，broker会删除该消息，消费者不能消费
  - UNKNOWN: broker需要回查确认该消息的状态





### 9.12 分布式事务02- 编码

1. 到数据库中新增一张表，用来记录 RocketMQ的事务日志：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204437450.jpg)



- 执行代码：

  ```sql
  create table rocketmq_transaction_log( 
      id int auto_increment comment 'id' primary key, 
      transaction_Id varchar(45) not null comment '事务id', 
      log varchar(45) not null comment '日志'
  )
  ```

  



1. 消息生产者编写：发送半消息：

   ```java
   // 首先可以判断，当前面代码执行成功后再执行此代码，此处略 
   // 发送半消息 
   String transactionId=UUID.randomUUID().toString() 
   this.rocketMQTemplate.sendMessageInTransaction( "tx-add-bonus-group","add-bonus",MessageBuilder.withPayload( 	
       UserAddBonusMsgDTO.builder().userId(share.getUserId).bonus(50).build()
   ).setHeader(RocketMQHeaders.TRANSACTION_ID,transactionId)
    .setHeader("share_id",id).build(), auditDTO)
   ```

   此处 "tx-add-bonus-group","add-bonus" 组名及topic是由自己指定的，可根据实际改变。auditDTO、share_id是根据业务需要所传入的数据，auditDTO在消息监听类中可以直接强转使用，share_id的数据可以直接从请求头中获取；

2. 消息消费者编写：

   ```java
   @RocketMQTransactionListener(txProducerGroup = "tx-add-bonus-group")
   @RequiredArgsConstructor(onConstructor = @__(@Autowired))
   public class AddBonusTransactionListener implements RocketMQLocalTransactionListener {
   
       private final ShareService shareService;
   
       /**
        * 执行本地事务
        */
       @Override
       public RocketMQLocalTransactionState executeLocalTransaction(Message msg, Object arg) {
           // 获取消息头
           Map<String, String> headers = MessageUtil.extractProperties(msg);
           String transactionId = headers.get(RocketMQHeaders.TRANSACTION_ID);
           Integer shareId = Integer.valueOf(headers.get("share_id"));
   
           try {
               // 执行本地事务
               this.shareService.auditByIdInDB(shareId, (ShareAuditDTO) arg);
               // 提交事务消息
               return RocketMQLocalTransactionState.COMMIT;
           } catch (Exception e) {
               // 回滚事务消息
               return RocketMQLocalTransactionState.ROLLBACK;
           }
       }
   
       /**
        * 事务回查（必须实现，不能返回 null）
        */
       @Override
       public RocketMQLocalTransactionState checkLocalTransaction(Message msg) {
           // 回查逻辑：根据业务状态判断本地事务是否成功
           Map<String, String> headers = MessageUtil.extractProperties(msg);
           Integer shareId = Integer.valueOf(headers.get("share_id"));
   
           // 这里你可以根据 shareId 查询数据库，判断本地事务是否执行成功
           boolean isSuccess = shareService.checkTransactionSuccess(shareId);
           
           if (isSuccess) {
               return RocketMQLocalTransactionState.COMMIT;
           } else {
               return RocketMQLocalTransactionState.ROLLBACK;
           }
       }
   }
   ```

   当我们执行成功，则执行RocketMQLocalTransactionState.COMMIT,失败则ROLLBACK。但是有这样一种情况，比如我们已经执行完逻辑代码，正准备COMMIT提交，此时突然停电了，导致数据已经存入，但是却没有提交成功。所以我们需要一个回查方法，checkLocalTransaction()是一个回查方法，它会去里面进行判断是否执行成功。结合我们已经建立的RocketMQ事务表，我们可以进行回查操作，代码看下方：

   // auditByInDB具体方法内容如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204727231.jpg)



1. 新建一个存入方法，我们之前的存入方法，没有将事务数据加入日志表，我们可以这样改造： 当数据存入的时候，将数据存入日志表；回查方法就进行回查，如果没有存入则表示执行失败：

   ```java
   @Autowired
   private RocketmqTransactionLogMapper rocketmqTransactionLogMapper;
   
   /**
    * 审核并记录事务日志（RocketMQ 事务消息用）
    */
   @Transactional(rollbackFor = Exception.class)
   public void auditByIdWithRocketMqLog(Integer id, ShareAuditDTO auditDTO, String transactionId) {
       // 1. 执行审核更新DB
       this.auditByIdInDB(id, auditDTO);
   
       // 2. 插入事务日志（供 RocketMQ 回查使用）
       rocketmqTransactionLogMapper.insertSelective(
           RocketmqTransactionLog.builder()
               .transactionId(transactionId)
               .log("审核分享")
               .build()
       );
   }
   ```

   

2. 消息消费者重写:

```java
@Autowired
private ShareService shareService;

@Autowired
private RocketmqTransactionLogMapper rocketmqTransactionLogMapper;

@RocketMQTransactionListener(txProducerGroup = "tx-add-bonus-group")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AddBonusTransactionListener implements RocketMQLocalTransactionListener {

    /**
     * 执行本地事务
     */
    @Override
    public RocketMQLocalTransactionState executeLocalTransaction(Message msg, Object arg) {
        MessageHeaders headers = msg.getHeaders();
        String transactionId = (String) headers.get(RocketMQHeaders.TRANSACTION_ID);
        Integer shareId = Integer.valueOf((String) headers.get("share_id"));

        try {
            this.shareService.auditByIdWithRocketMqLog(shareId, (ShareAuditDTO) arg, transactionId);
            return RocketMQLocalTransactionState.COMMIT;
        } catch (Exception e) {
            return RocketMQLocalTransactionState.ROLLBACK;
        }
    }

    /**
     * 事务回查
     */
    @Override
    public RocketMQLocalTransactionState checkLocalTransaction(Message msg) {
        MessageHeaders headers = msg.getHeaders();
        String transactionId = (String) headers.get(RocketMQHeaders.TRANSACTION_ID);

        // 查询事务日志
        RocketmqTransactionLog transactionLog = rocketmqTransactionLogMapper.selectOne(
            RocketmqTransactionLog.builder()
                .transactionId(transactionId)
                .build()
        );

        // 存在记录 = 本地事务成功 = 提交 MQ
        if (transactionLog != null) {
            return RocketMQLocalTransactionState.COMMIT;
        }
        // 不存在 = 回滚
        return RocketMQLocalTransactionState.ROLLBACK;
    }
}
```



> 使用header和arg可以传参

### 9.13 Spring Cloud Stream 是什么？

- 是一个用于构建消息驱动的微服务的框架
- 架构：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204844063.jpg)



### 9.14 Spring Cloud Stream 编程模型

- 概念：

1. Destination Binder(目标绑定器)

- 与消息中间件通信的组件



1. Destination Bindings(目标绑定)

- Binding是连接应用程序跟消息中间件的桥梁，用于消息的消费和生产，由binder创建



1. Message(消息)



- 编程模型图：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204851181.jpg)



当消息生产者使用Kafka发送消息，那只能用Kafka来接收消息。当使用SpringCloudStream来处理消息的话，我们接收Kafka的消息，可以使用其他的消息中间件来进行接收。SpringCloudStream对消息进行了一层封装，所以我们不需要去关心生产者用的是什么消息中间件。

### 9.15 Spring Cloud Stream 代码-消息生产者

- 编写生产者：

1. 添加依赖：

   ```xml
   <dependency> 
       <groupId>org.springframework.cloud</groupId> 
       <artifactId>spring-cloud-starter-stream-rocketmq</artifactId> 
   </dependency>
   ```

   

2. 添加注解（在启动类上添加注解）：

- 添加@ **EnableBing(Source.class)** 注解，如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406204912526.jpg)



1. 写配置(application.yml)：

   ```yml
   spring:
     cloud:
       stream:
         # RocketMQ 绑定器配置
         rocketmq:
           binder:
             # namesrv 地址
             name-server: 127.0.0.1:9876
         # 消息绑定配置
         bindings:
           # 输出通道（生产者）
           output:
             # 发送的 topic
             destination: stream-test-topic
   ```

   

2. 生产者发送消息：

   ```java
   @GetMapping("test-stream") 
   public String testStream(){ 
       this.source.output().send( 
           MessageBuilder.withPayload("消息体").build() 
       ); 
       return "success"; 
   }
   ```

   

3. 检查是否成功发送。

- 在控制台中我们可以查看此组下是否有已发送过的消息：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205020355.jpg)



- 如果控制台在一直打印日志的话，我们可以降低日志级别：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205024332.jpg)







### 9.16 Spring Cloud Stream 消息消费者

- 编写消费者：

1. 添加依赖：

   ```xml
   <dependency> 
       <groupId>org.springframework.cloud</groupId> 
       <artifactId>spring-cloud-starter-stream-rocketmq</artifactId> 
   </dependency>
   ```

   

2. 添加注解（在启动类上添加注解）：@EnableBinding(Sink.class)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205049095.jpg)



1. 写配置（application.yml）：

   ```yml
   spring:
     cloud:
       stream:
         # RocketMQ 绑定器
         rocketmq:
           binder:
             name-server: 127.0.0.1:9876
   
         # 消息通道绑定
         bindings:
           # 消费者输入通道
           input:
             destination: stream-test-topic
             group: binder-group
   ```

   

2. 监听消费类：

   ```java
   @Service 
   @Slf4j 
   public class TestStreamConsumer{ 
       @StreamListener(Sink.INPUT) 
       public void receive(String messageBody){ 
           log.info("通过stream收到了消息： messageBody = {}"); 
       }
   }
   ```

   



### 9.17 Spring Cloud Stream 接口自定义：消息生产者

- 接口：

  ```java
  public interface MySource{ 
      String MY_OUTPUT= "my-output"; 
      @Output(MY_OUTPUT) 
      MessageChannel output(); 
  }
  ```

  

- 启动类上，@EnableBinding注解上引入 MySource.class，如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205227424.jpg)



- 加配置：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205231400.jpg)



- 定义接口，发送消息：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205235699.jpg)



使用自定义的接口我们可以进行消息的收发；

### 9.18 Spring Cloud Stream 接口自定义：消息消费者

1. 创建方法：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205241130.jpg)



1. 启动类中引入：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205244339.jpg)



1. 配置类修改：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205247856.jpg)



1. 使用自定义接口：消息消费监听，如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205251506.jpg)



### 9.19 消息过滤

- [手记](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fwww.imooc.com%2Farticle%2F290424)

### 9.20 Spring Cloud Stream 的监控

- Spring Cloud Actuator为我们提供了三个端点来监控Stream:

1. /actuator/bindings
2. /actuator/channels
3. /actuator/health



### 9.21 Spring Cloud Stream 异常处理

- [错误处理手记](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fwww.imooc.com%2Farticle%2F290435)
- 定义全局异常处理的办法如下：
  @StreamListener("errorChannel") public void error(Message<?> message){ ErrorMessage errorMessage= (ErrorMessage) message; log.warn("发生异常,errorMessage = {}",errorMessage); } 复制代码

### 9.22 Spring Cloud Stream + RocketMQ实现分布式事务

- SpringCloud Stream 本身没有实现分布式事务，它与RocketMQ结合则是使用RocketMQ的分布式事务。它若与其他结合，则使用其他消息中间件的分布式事务。
- Spring Cloud Stream 的分布式事务改造如图：

1. 发送者从rocketRestTemplate改为source:

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205305686.jpg)



1. 在配置文件中定义组合事务：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205309077.jpg)



1. 消息的监听定义组名称时，一定要与配置文件中的保持一致，如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205312899.jpg)





## 十. Spring Cloud Gateway

### 10.1 为什么要使用网关

- 在不使用Gateway的情况下，当我们直接与微服务通信的情况下，需要每个服务都进行网关登录验证，同时需要解决各个服务的登录状态的同步等功能；
- 使用Gateway可以对外暴露一个域名，微服务无论增加多少，都只需要指向一个网关即可，它可以统一对外进行登录、校验、授权、以及一些拦截操作；

### 10.2 Spring Cloud Gateway 是什么？

- 它是SpringCloud的网关（第二代），未来会取代Zuul（第一代）
- 基于Netty、Reactor以及WebFlux构建（所以它启动会比其他微服务一般要快）
- 它的优点：
  - 性能强劲： 它的性能是第一代网关Zuul 1.x的1.6倍！ [性能PK](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fwww.imooc.com%2Farticle%2F285068)
  - 功能强大：内置了很多实用功能，比如转发、监控、限流等
  - 设计优雅、易扩展



- 它的缺点：
  - 依赖Netty与Webflux，不是Servlet编程模型，有一定适应成本
  - 不能在Servlet容器下工作，也不能构建成WAR包
  - 不支持Spring Boot 1.x



### 10.3 编写Spring Cloud Gateway

- 创建项目 gateway,此处省略
  - pom.xml:

1. 父工程依赖：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205328188.jpg)



1. 定义SpringCloud版本、gateway依赖：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205332114.jpg)



1. SpringCloudAlibaba等引入：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205336124.jpg)



1. 加入Nacos、Actuator依赖：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205339558.jpg)





- application.yml配置：

1. 配置端口及nacos、gateway配置：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205343428.jpg)



1. 配置Actuator相关配置：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205346536.jpg)





- 启动gateway

gateway是基于Netty，所以启动速度非常快。从上面就已经可以进行服务转发了，因为gateway:discovery:locator:enabled:true 可以自动让服务转发到对应的路径去；

- 转发规律：访问${GATEWAY_URL}/{微服务X}/路径 会转发到微服务X的/路径

### 10.4 核心概念

- Route（路由）：
  - Spring Cloud Gateway 的基础元素，可简单理解成一条转发的规则。包含：ID、目标URL、Predicate集合以及Filter集合。



- Predicate（谓词）：即 java.util.function.Predicate,Spring Cloud Gateway 使用Predicate实现路由的匹配条件
- Filter（过滤器）： 修改请求以及响应
- 路由配置示例：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205355872.jpg)





### 10.5 架构剖析

- 架构图：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205403356.jpg)



- 源码：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205406681.jpg)



### 10.6 内置路由谓词工厂详解（Route Predicate Factories）

- 工厂图示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205411314.jpg)



- [谓词工厂手记](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttp%3A%2F%2Fwww.imooc.com%2Farticle%2F290804)

### 10.7 自定义路由谓词工厂

- 自定义路由谓词工厂类必须以PredicateFactory结尾命名
- 大致步骤：
  - 继承 AbstractRoutePredicateFactory<自定义配置对象>
  - 添加构造方法
  - 重写抽象方法
  - 配置中添加配置规则



### 10.8 内置过滤器工厂详解

- [手记：总结了全部的内置过滤器工厂](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttp%3A%2F%2Fwww.imooc.com%2Farticle%2F290816)

### 10.9 自定义过滤器工厂

- 内容介绍：

1. 过滤器生命周期
2. 自定义过滤器工厂的方式
3. 核心API
4. 编写一个过滤器工厂



- 过滤器生命周期：
  - pre: Gateway 转发请求之前
  - post: Gateway 转发请求之后



- 自定义过滤器工厂- 方式1：
  - 继承和参考示例：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205423036.jpg)



- 配置形式：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205430148.jpg)





- 自定义过滤器工厂-方式2：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205434899.jpg)



- 自定义过滤器工厂-核心API

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205438228.jpg)


这些过滤器工厂的核心Api比较简单，从名称就可以看出其含义；

- 编写一个过滤器工程：

1. 创建一个类： PreLogGatewayFilterFactory:

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205442088.jpg)


最后在过滤器工厂上面加上 @Component 注解

1. 在配置中新增内容，并修改工厂类，打印配置中新增的数据：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205446517.jpg)



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205450305.jpg)


配置文件中，传入了ab两个配置值，在我们工厂类中可以通过config.getName,config.getValue获取到；当有请求访问经过此过滤器工厂时，日志就会打印出来了；



### 10.10 全局过滤器

- 会作用在所有的路由，有执行顺序的概念，order越小越靠前执行；
- [手记笔记](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttp%3A%2F%2Fwww.imooc.com%2Farticle%2F290821)

### 10.11 悬念：如何为Spring Cloud Gateway 整合Sentinel?

- [gateway整合hystrix](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttp%3Awww.imooc.com%2Farticle%2F290816)

sentinel要在1.6 版本以后才支持gateway

### 10.12 监控SpringCloud gateway

- [SpringCloud Gateway监控](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttp%3A%2F%2Fwww.imooc.com%2Farticle%2F290822)

### 10.13 排错、调试技巧总结

- [Spring cloud Gateway排查问题总结](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttp%3A%2F%2Fwww.imooc.com%2Farticle%2F290824)

### 10.14 进阶：再谈过滤器执行顺序

- 结论：

1. order越小越靠前执行
2. 过滤器工厂的Order按配置顺序从1开始递增
3. 如果配置了默认过滤器，则线执行相同Order的默认过滤器

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205503355.jpg)


相同顺序的，以default-filter中的优先

1. 如需自行控制Order,可返回OrderedGatewayFilter

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205508904.jpg)





- 源码：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205514271.jpg)



### 10.15 Spring Cloud Gateway限流

- [SpringCloud gateway限流手记](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttp%3A%2F%2Fwww.imooc.com%2Farticle%2F290828)

### 10.16 本章总结

- 路由、路由谓词工厂、过滤器工厂、全局过滤器
- 网关集大成：
  - 注册到Nacos
  - 集成Ribbon
  - 容错（默认Hystrix,也可用Sentinel）



## 十一. 微服务的用户认证与授权

### 11.1 认证授权-必然会面临的话题

- 每个应用基本上都需要进行登录，校验用户权限

### 11.2 有状态vs 无状态

- 有状态：
  - 图示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205530226.jpg)



- 优点：服务端控制力强
- 缺点：存在中心点，鸡蛋放在一个篮子里，迁移麻烦，服务器端存储数据，加大了服务器端压力



- 无状态：
  - 图示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205534537.jpg)



- 优点：去中心话，无存储，简单，任意扩容、缩容
- 缺点：服务器端控制力相对弱（不能随时强制让人下线，修改登录时长等）



### 11.3 微服务认证方案 01 “处处安全”

- [关于处处安全的博客](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttp%3A%2F%2Fwww.cnblogs.com%2Fcjsblog%2Fp%2F10548022)
- 常用的协议为: OAuth2.0,[系列文章](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttp%3A%2F%2Fifeve.com%2Foauth2-tutorial-all%2F)
- 代表实现：
  - [Spring Cloud Security](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fcloud.spring.io%2Fspring-cloud-security%2Freference%2Fhtml)，[实例代码](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fchengjiansheng%2Fcjs-oauth2-sso-demo.git)
  - [Jboss Keycloak](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fwww.keycloak.org)， [示例代码](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fwww.github.com%2Feacdy%2Fspring-cloud-yes.git)

看好Keyclock，但是它不支持CLoud,它是Servlet模型的，无法与Gateway配合使用；

- 优点： 安全性高 缺点： 实现成本高，性能要低一些

### 11.4 微服务认证方案 02 - 外部无状态，内部有状态方案

- 图示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205542014.jpg)



- 它能够与老架构项目相兼容。就是老项目可能没有Token，但是可以从Session中获取信息。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205544780.jpg)



它安全性和性能都不占优势，但它的优点是能够与老项目服务相兼容

### 11.5 微服务认证方案 03 - 网关认证授权、内部裸奔方案

- 图示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205547935.jpg)



安全性低，性能高

### 11.6 微服务认证方案 04 内部裸奔改进方案

- 图示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205554775.jpg)



- 每个服务都能够对Token进行解析，每个服务就不会裸奔了，但是每个服务都知道Token解密方式，容易暴露；

### 11.7 微服务认证方案 05 方案对比

- 对比图示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205559808.jpg)



### 11.8 访问控制模型

- 模型如图：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205606343.jpg)



- RBAC：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205609710.jpg)



### 11.9 JWT是什么？【是什么、组成】

- JWT全称Json web token,是一个开放标准（RFC 7519），用来在各方之间安全地传输信息。JWT可被验证和信任，因为它是数字签名的。
- JWT组成图示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205614788.jpg)



- 公式：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205617885.jpg)



- [JWT的手记](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fwww.imooc.com%2Farticle%2F290892)

### 11.10 AOP实现登录状态检查

- 实现登录状态检查的方式：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205623430.jpg)



建议使用SpringAop 来实现，这样解耦且灵活

- 手动实现切面：
  - 定义注解：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205628850.jpg)



- 定义切面：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205633863.jpg)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205640392.jpg)



- 定义异常捕获类：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205643792.jpg)





### 11.11 Feign实现Token传递

- Controller层可以接收Token：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205649311.jpg)



- Feign中可以携带Token：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205654454.jpg)



- 上面的这种方式携带Token，需要每个都进行配置，比较麻烦。当我们Feign调用的接口比较多的时候，我们可以使用拦截器统一携带Token：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205657836.jpg)



- 使用全局配置的时候，需要在配置中添加如图配置：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205701668.jpg)



### 11.12 RestTemplate实现Token传递

- 两种方式,分别是`exchange()`和`ClientHttpRequestInterceptor`
- exchange()代码示例：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205707571.jpg)



- 使用RestTemplate拦截器示例：
  - 拦截器配置：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205710803.jpg)



- RestTemplate配置：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205714617.jpg)





11.13 Java 自定义注解

- [java 自定义注解手记](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dcnblogs.com%2FCatsBlog%2Fp%2F9329785.html)

11.15 本章总结

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205717713.jpg)



## 十二. 配置管理

### 12.1 为什么要实现配置管理？

- 不同环境存在不同的配置
- 配置属性要求动态刷新，不重启

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205730718.jpg)


使用Nacos就可以作为一个配置服务器，实现上面两个功能；

### 12.2 使用Nacos管理配置

1. 添加依赖：

   ```xml
   <dependency> 
       <groupId>org.springframework.cloud</groupId> 
       <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId> 
   </dependency>
   ```

   

2. 写配置：- 配置内的内容与Nacos中的配置必须保持一致，一定要记住这张图：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205750036.jpg)



1. 建立bootstrap.yml:

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205752808.jpg)


spirngconfig与Nacos的配置是分开来的。config的配置建议放在bootstrap.yml中，否则可能不生效，应用无法读取配置；

1. 代码中写入配置：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205756933.jpg)



1. 在Nacos中建立配置：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205759025.jpg)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205804250.jpg)


配置好内容后点击发布即可。

1. 重启应用，调用接口，发现参数能获取到，完成！

### 12.3 配置属性动态刷新与回滚

- 在需要属性动态刷新的类上写上注解 `@RefreshScope` ，即可动态刷新配置，如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205807671.jpg)



- 当我们将itmuch改为[http://itmuch.com](https://link.zhihu.com/?target=http%3A//itmuch.com)，调用接口时，会自动刷新：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205814057.jpg)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210446366.jpg)



- 回滚：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205817363.jpg)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205820707.jpg)



### 12.4 应用的配置共享

- 配置共享：
- shared-dataids:

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205826327.jpg)



- 方式2： ext-config：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205829361.jpg)



- 方式3： 自动的方式：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205832777.jpg)


这个自动方式就是里面的内容是所有环境的公共配置数据，profiles.active指向的环境可以放置其存在变化的配置；

- 优先级：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205835734.jpg)



### 12.5 引导上下文

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205841377.jpeg)



- 默认远程配置优先级更高，我们可以使用下方代码进行配置优先级：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205844581.jpg)



- 远程配置优先级必须要在Nacos下配置才生效，如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205849021.jpg)



### 12.6 数据持久化

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205909080.jpg)



服务发现组件是放在文件夹内。配置数据是放在嵌入式数据库中（生产环境建议更换为mysql）；

### 12.7 搭建生产可用的Nacos集群

- [搭建生产可用的nacos集群](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fwww.imooc.com%2Farticle%2F288153)

### 12.8 配置最佳实践总结

- 能放本地的情况下，就不要放在远程
- 尽量规避优先级，简化配置
- 定规范，例如所有配置属性都要加上注释
- 配置管理人员尽量少（Nacos的安全权限功能还未齐全，为了安全高效管理着想，人员尽量少）

## 十三. 调用链监控-Sleuth

### 13.1 调用链监控

- 使用调用链监控，我们能够清晰的看出来这个接口调用了哪些方法，哪些方法消耗了多少时间，同时如果出现了问题，是哪个方法出现了问题，我们也能够快速定位
- 业界主流的调用链监控工具
  - Spring Cloud Sleuth+Zipkin
  - Skywalking、Pinpoint



### 13.2 整合Sleuth

- 什么是Sleuth？
  - Sleuth是一个Spring Cloud的分布式跟踪解决方案



- Sleuth术语？
  - Span(跨度)： Sleuth的基本工作单元，它用一个64位的id唯一标识。除ID外，span还包含其他数据，例如描述、时间戳事件、键值对的注解（标签）、span ID、span 父ID等

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205914921.jpg)


里面每一行数据，可以理解为一个span

- trace（跟踪）： 一组span组成的树状结构成为trace
- Annotation(标注）：
  - CS（Client Sent 客户端发送）：客户端发起一个请求，该annotation描述了span的开始
  - SR（Serverr Received 服务器端的接收）： 服务器端获得请求并准备处理它
  - SS（Server Sent服务器端发送）： 该annotation表明完成请求处理（当响应发回客户端时）
  - CR（Client Received客户端接收）：span结束的标识。客户端成功接收到服务器端的响应





- 为用户中心整合Sleuth:

1. 加依赖

   ```xml
   <dependency> 
       <groupId>org.springframework.cloud</groupId> 
       <artifactId>spring-cloud-starter-sleuth</artifactId> 
   </dependency>
   ```

   

2. 修改日志级别（可打印更多的日志，可选项）

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406205944395.jpg)





### 13.3 Zipkin搭建与整合

- Zipkin是什么？
  - Zipkin是Twitter开源的分布式跟踪系统，主要用来收集系统的时序数据，从而追踪系统的调用问题
  - Zipkin通俗来讲，它就是将sleuth收集来的数据进行存储、展示的，它的可视化界面能够更友好的，更清晰的为我们提供决策；



- 搭建Zipkin Server (本文章版本为：2.12.9)
  - 方式一：使用Zipkin官方的Shell下载，如下命令可下载最新版本：
    curl -sSL [https://zipkin.io/quickstart.sh](https://link.zhihu.com/?target=https%3A//zipkin.io/quickstart.sh) | bash -s 复制代码
  - 方式二： 到Maven中央仓库下载，访问如下地址即可：
    [https://search.maven.org/remote_content?g=io.zipkin.java&a=zipkin-server&v=1](https://link.zhihu.com/?target=https%3A//search.maven.org/remote_content%3Fg%3Dio.zipkin.java%26a%3Dzipkin-server%26v%3D1) 复制代码
    下载下来的文件名为： zipkin-server-2.12.9-exec.jar
  - 方式三：使用百度盘地址下载，提供2.12.9版本：
    [https://pan.baidu.com/s/1HXjzNDpzin6fXGrZPyQeWQ](https://link.zhihu.com/?target=https%3A//pan.baidu.com/s/1HXjzNDpzin6fXGrZPyQeWQ) 复制代码
    密码：aon2



- 启动Zipkin，执行如图所示命令： `java -jar zipkin-server-2.12.9-exec.jar`

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210428293.jpg)



- 为用户中心整合Sleuth+Zipkin：

1. 加依赖：去掉Sleuth,加上zipkin依赖（去掉sleuth是因为zipkin中有sleuth的依赖）

- Gradle:
  compile group: 'org.springframework.cloud', name: 'spring-cloud-sleuth-zipkin', version: '2.2.3.RELEASE' 复制代码

- Maven:

  ```xml
  <dependency> 
      <groupId>org.springframework.cloud</groupId> 
      <artifactId>spring-cloud-sleuth-zipkin</artifactId> 
      <version>2.2.3.RELEASE</version> 
  </dependency>
  ```

  



1. 加配置：设置zipkin服务器地址以及抽样率，如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210007775.jpg)


抽样率不是越高越好，也不是越低越好。抽样率高的话，分析的更加准确，但是它的性能消耗会更严重；



### 13.4 整合Zipkin之后Nacos报错的解决

- SpringCloud 把[http://localhost:9411/当做了服务发现组件里面的服务名称；于是，Nacos](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttp%3A%2F%2Flocalhost%3A9411%2F%25E5%25BD%2593%25E5%2581%259A%25E4%25BA%2586%25E6%259C%258D%25E5%258A%25A1%25E5%258F%2591%25E7%258E%25B0%25E7%25BB%2584%25E4%25BB%25B6%25E9%2587%258C%25E9%259D%25A2%25E7%259A%2584%25E6%259C%258D%25E5%258A%25A1%25E5%2590%258D%25E7%25A7%25B0%25EF%25BC%259B%25E4%25BA%258E%25E6%2598%25AF%25EF%25BC%258CNacos) Client尝试从Nacos Server寻找一个名为： `localhost:9411`的服务...这个服务根本不存在，所以会一直报异常；
- 解决方案：

1. 方案一： 让Spring Cloud 正确识别 [http://localhost:9411/当成一个URL，而不要当做服务名（选择此项目）](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttp%3A%2F%2Flocalhost%3A9411%2F%25E5%25BD%2593%25E6%2588%2590%25E4%25B8%2580%25E4%25B8%25AAURL%25EF%25BC%258C%25E8%2580%258C%25E4%25B8%258D%25E8%25A6%2581%25E5%25BD%2593%25E5%2581%259A%25E6%259C%258D%25E5%258A%25A1%25E5%2590%258D%25EF%25BC%2588%25E9%2580%2589%25E6%258B%25A9%25E6%25AD%25A4%25E9%25A1%25B9%25E7%259B%25AE%25EF%25BC%2589)
2. 方案二： 把Zipkin Server注册到Nacos(官方不支持)



- 以方案一的方式解决，需要将 `discoveryClientEnabled: false`，如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210014335.jpg)


这里的小驼峰命名是因为有一个小bug，后面会修复就以 - 隔开

### 13.5 为所有微服务整合Zipkin

- 参照13.5的引入方式；

### 13.6 Zipkin数据持久化

- 持久化方式：
  - MySQL(不建议，有性能问题)
  - Elasticsearch
  - Cassandra
  - 相关文档： （[github.com/openzipkin/…](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fopenzipkin%2Fzipkin%23storage-component%25EF%25BC%2589%255Bhttps%3A%2F%2Fgithub.com%2Fopenzipkin%2Fzipkin%23storage-component%255D)



- 下载ElasticSearch:( 建议使用5,6,7版本)
  - 点击地址进行下载：(官网地址)[[http://elastic.co/cn/downloads/past-releases#elasticsearch](https://link.zhihu.com/?target=http%3A//elastic.co/cn/downloads/past-releases%23elasticsearch)]

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210021857.jpg)



- 解压并进入目录：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210025297.jpg)



- 切换到bin目录，并执行： `./elasticsearch` 或后台执行 `./elasticsearch -d`
- 查看Zipkin的环境变量，配置`STORAGE_TYPE`和`ES_HOSTS`,然后执行zipkin server服务：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210029457.jpg)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210036664.jpg)



Zipkin其他环境变量：[github.com/openzipkin/…](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fopenzipkin%2Fzipkin%2Ftree%2Fmaster%2Fzipkin-server%23environment-variables)

### 13.7 依赖关系图

- 使用ElasticSearch的话，需要使用 `spark job`才能分析出依赖关系图，使用方式如下：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210039860.jpg)


它是zipkin的子项目，第一步下载，第二步启动

- Zipkin Dependencies使用ElasticSearch的环境变量：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210046597.jpg)



- 启动Zipkin Dependencies:

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210101474.jpg)



- Zipkin Denpendencies其他的环境变量：([github.com/openzipkin/…](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fopenzipkin%2Fzipkin-dependencies)%255Bhttps%3A%2F%2Fgithub.com%2Fopenzipkin%2Fzipkin-dependencies%255D "[https://github.com/openzipkin/zipkin-dependencies)%5Bhttps://github.com/openzipkin/zipkin-dependencies%5D"](https://link.zhihu.com/?target=https%3A//github.com/openzipkin/zipkin-dependencies)%5Bhttps%3A//github.com/openzipkin/zipkin-dependencies%5D%22))
- Zipkin Dependencies指定分析日期：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210107153.jpg)


可以编写脚本每日执行；

## 十四. 既有代码优化与改善

### 14.1 简单指标： Statistic

- 注释原则：
  - 每一步主要业务流程
  - 核心方法
  - 条件、分支、判断前



- 使用Statistic插件：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210126526.jpg)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210129552.jpg)


建议服务上线，注释率要求达到35%

### 14.3 Alibaba Java代码规约（P3c）

- [github](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3Awww.github.com%2Falibaba%2Fp3c)
- IDEA插件支持，搜索 `Alibaba Java Coding Guidelines`

### 14.4 SonarQube

- [教程](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fwww.imooc.com%2Farticle%2F291857)
- [下载](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fwww.sonarqube.org%2Fdownloads%2F)：jdk8只支持6.x~7.8.x 的版本
- 安装：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210136499.jpg)



- 查看日志命令：

  ```sh
  tail -f ../../logs/sonar.log
  ```

  

- 访问首页:localhost:9000/about

- 账号密码都是admin

- 根据手记我们与项目融合，建议使用Token，命令行的方式去融合。融合后我们可以很方便的看到程序有多少个bug，哪里的代码不够优雅等信息：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210150794.jpg)



- 它还有很多插件，比如汉化插件、其他监控插件等：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210155298.jpg)



内嵌数据库不方便伸缩，所以不适用于生产环境，所以建议更换为MySql之类的数据库

## 十五. 进阶：多维度微服务监控

### 1.51 本章概要

- Spring Boot Actutator: 监控微服务实例的情况
- Sentinel Dashboard: 监控实例的QPS、限流等
- Spring Cloud Sleuth+Zipkin： 监控服务的调用情况

### 15.2 Spring Boot Actuator监控数据库

- SpringBoot Admin:
  - 它是为Spring Boot 量身打造的一个简单易用的监控数据管理工具
  - (GitHub地址)[[github.com/codecentric…](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Fcodecentric%2Fspring-boot-admin)]
  - (官方文档)[[codecentric.github.io/spring-boot…](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttp%3A%2F%2Fcodecentric.github.io%2Fspring-boot-admin%2F2.1.6%2F)]



- 搭建SpringBoot admin 步骤：
  - 加依赖：
    - 整合版本，如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210206088.jpg)



- 加入SpringBootAdmin以及Nacos，将Admin注册到Nacos上，如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210210176.jpg)





- 写注解：
  - 在启动类上添加 `@EnableAdminServer` 注解，如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210213264.jpg)





- 加配置：
  - 在application.yml中进行配置：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210216330.jpg)







- 被监控的服务的步骤：

  - 加依赖：

    ```xml
    <dependency> 
        <groupId>org.springframework.boot</groupId> 
        <artifactId>spring-boot-starter-actuator</artifactId> 
    </dependency>
    ```

    

  - 加配置：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210219772.jpg)





### 15.3 JVM监控

- Spring Boot Actuator: metrics、heapdump、threaddump
- Java自带的JVM监控工具： jconsole、jvisualvm
- 自带工具打开方式：
  - jconsole: 在IDEA或者CMD中输入 jconsole,如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210238271.jpg)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210241004.jpg)



- jvisualvm: 与jconsole类似，输入`jvisualvm` 即可，如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210244425.jpg)


jvisualvm与jconsole类似，但是它的功能更强大一点，但是它们都是客户端形式，希望能出一款强大的web浏览形式的监控工具；



### 15.4 GC日志、线程Dump日志、堆Dump可视化分析

1. 第一步，启动参数中设置打印GC详情日志：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210249540.jpg)



1. 第二步,选择项目，右击选择`Synchronize 'xxxx'`,生成出gc.log,如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210253036.jpg)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210256817.jpg)



1. 找到输出的日志文件，右键后选择 `Reveal in Finder`，将文件导出：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210301959.jpg)



1. 将生成的文件在`gceasy.io`中，点击选择文件打开，然后会生成统计图表

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210305767.jpg)



1. 生成统计图表如图：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210310802.jpg)



1. 虽然这款工具很强大，但是它不是开源产品，我们可以使用如图产品替代，但是可能相比来说要功能缺失一些：

[Spring Cloud Alibaba从入门到精通，史上最全面的讲解（下篇） - 掘金](https://link.zhihu.com/?target=https%3A//juejin.cn/post/6949351223191404558)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210316085.jpg)



### 15.5 日志监控

- ELK架构如图所示：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210322711.jpg)



对日志监控的工具可以不做强制要求，只要合适就行，不一定得必须要ELK

### 15.6 其他监控

- 监控的时候，应该要全面一点，比如用到了docker，我们应该就要监控docker。用到了Linux服务器，我们就应该要监控服务器的运行情况。用到了RabbitMQ，我们也应该去监控rabbitmq。
- 只有当监控完善的时候，我们分析问题就能更加的全面。

## 十六. 进阶：完美融合异构微服务

### 16.1 如何完美整合异构微服务

- 非SpringCloud的服务，就叫做异构微服务
- 完美整合：
  - SpringCloud 微服务完美调用异构微服务
  - 异构微服务完美嗲用SpringCloud微服务



- 完美调用：互相之间需要满足如下：
  - 服务发现
  - 负载均衡
  - 容错处理



### 16.2 Spring Cloud Wii实现完美整合

- [使用SpringCloud Wii完美整合Github地址](https://link.zhihu.com/?target=https%3A//link.juejin.cn/%3Ftarget%3Dhttps%3Awww.github.com%2Feacdy%2Fspring--cloud-wii%2Ftree%2F0.9.0)
- 部分配置如图所示，参照上方的教程配置即可

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406210351551.jpg)



它未来是SpringCloudAlibaba的一个子项目
