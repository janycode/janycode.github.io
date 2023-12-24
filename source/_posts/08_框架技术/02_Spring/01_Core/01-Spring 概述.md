---
title: 01-Spring 概述
date: 2018-5-30 17:20:30
tags:
- Spring
- 简述
categories: 
- 08_框架技术
- 02_Spring
- 01_Core
---



![LOGO](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200617144911.png)



参考资料：https://lfvepclr.gitbooks.io/spring-framework-5-doc-cn/content/



Spring 是一个开源的 Java EE 开发框架。

Spring 框架的核心功能可以应用在任何 Java 应用程序中，但对 Java EE 平台上的 Web 应用程序有更好的扩展性。Spring 框架的目标是使得 Java EE 应用程序的开发更加简捷，通过使用 POJO 为基础的编程模型促进良好的编程风格。
Spring 是由 Rod Johnson 组织和开发的一个分层的 Java SE/EE full-stack（全栈）轻量级开源框架，以`IoC`（Inversion of Control 控制反转）和 `AOP` （Aspect Oriented Programming 面向切面编程）为内核，使用基本的 `JavaBean` 来完成以前只可能由 EJB（Enterprise Java Beans，Java 企业 Bean）完成的工作，取代了 EJB 的臃肿、低效的开发模式。



### 1. Spring 基本理念

简化 Java 开发。

- 轻量级：基础版本的 Spring 框架大约只有 2 MB。
- 容器：Spring 包含并管理应用程序对象的配置及生命周期。
- 控制反转(IOC)：松耦合。依赖被注入到对象，而不是创建或寻找依赖对象。
- 面向切面编程(AOP)： 把应用的业务逻辑与系统的服务分离开来。消除样板式代码.

![spring中的编程思想](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224104910.png)



### 2. Spring 基本原理

1. 启动项目后，按照配置找到要 scan 的包（`自动装配`）
2. 解析包里面的所有类，找到所有含有 @bean，@service 等注解的类，利用`反射`解析，封装成各种信息类放到容器（map 实现）里。
3. 需要 bean 时，从 ApplicationContext 容器里找。找到则通过构造器 new 出来（`控制反转`），没找到则抛出异常
4. 如果类中有需要注入的，仍从容器寻找、解析类，new 出对象，用 setter 注入（`依赖注入`）。
5. 嵌套 bean 用了递归，容器会放到 servletcontext 里，每次 request 从 servletcontext 找 container。
6. 如果 bean 的 scope 是 singleton（单例），会重用，将这个 bean 放到一个 map 里，每次用都先从这个 map 里面找。
7. 如果 scope 是 session，则该 bean 会放到 session 里面。

![spring中常用设计模式和场景](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224104943.png)



### 3. Spring 体系结构

* **Spring 框架优点**
  Spring具有简单、可测试、松耦合等特点，可用于服务器端开发、Java 应用开发。
  - 非侵入式设计。
  - 方便解耦、简化开发。
  - 支持 AOP。
  - 支持声明式事务处理。
  - 方便程序的测试。
  - 方便集成各种优秀的框架。
  - 降低 Java EE API 的使用难度。
  
* **Spring 七大核心模块**

  * Spring Core
  * Spring AOP
  * Spring ORM
  * Spring Web
  * Spring DAO
  * Spring Context
  * Spring Web MVC

  ![image-20230606215438733](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230606215440.png)

* **Spring 体系结构**
  分层架构，20个模块。

| Spring 分层结构，包含 20 个模块                              |
| :------------------------------------------------------------: |
| ![1545011849499-spring框架结构](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200617144906.png) |



* **`Core Container` - 核心容器**
  核心容器是其他模块建立的基础，由 Beans、Core、Context、Context-support、SpEL(Spring 表达式语言) 组成。
  * **Beans** ：提供 BeanFactory 工厂模式的经典实现。
  * **Core** 核心：框架基本组成部分，包括 loC（`Inversion of Control，即“控制反转”`） 和 DI （`Dependency Injection，即“依赖注入”`）。
  * **Context** ：建立在 Core 和 Beans 模块的基础之上， 是访问定义和配置的任何对象的媒介。其中ApplicationContext 接口是上下文模块的焦点。
  * **Context-support** ：提供对第三方库嵌入 Spring 应用的集成支持， 比如缓存(Eh Cache、Guava、J Cache) 、邮件服务(JavaMail) 、任务调度(Common J、Quartz) 和模板引擎(FreeMarker、JasperReports、速率) 。
  * **SpEL** ：Spring 3.0+提供，Spring Expression Language支持，是运行时查询和操作对象图的强大的表达式语言。
    ![image-20200601234349015](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200601234349015.png)
* **`Data Access/Integration` - 数据集成访问**
  包括 JDBC、ORM、OXM、JMS 和 Transactions 模块。
  * **JDBC**：抽象层，简化数据库操作。
  * **ORM**：对象关系映射API。
  * **OXM**：对象/XML映射的抽象层。
  * **JMS：Java** 消息传递服务。
  * **Transactions** ：事务管理。
* **`Web`**
  包括 WebSocket、Servlet、Web 和 Portlet 模块。
  * **WebSocket**：实现了 WebSocket 和 SockJS 以及对 STOMP 的支持。
  * **Servlet**：Spring-webmvc，MVC+REST Web Services。
  * **Web**：web开发继承，如多文件上传、Servlet 监听器初始化 IoC 和 Web 应用上下文
  * **Portlet**：Portlet 环境中使用 MVC 的实现
* **其他模块**
  包括 AOP、Aspects、Instrumentation 和 Test 模块。
  * **AOP**：`面向切面编程`（允许定义方法拦截器和切入点，将代码按照功能进行分离，以降低耦合性）。
  * **Aspects**：AspectJ 的集成功能，（AspectJ 是一个强大且成熟的 AOP 框架） 。
  * **Instrumentation**：类工具 + 类加载器。
  * **Messaging**：消息传递体系结构和协议的支持。
  * **Test**：单元测试、集成测试。

### 4. Spring 社区经典项目

#### 4.1 Spring Security

安全对于许多应用都是一个非常关键的切面。 利用 Spring AOP， 为 Spring 应用提供了声明式的安全机制。



#### 4.2 Spring Data

使得在 Spring 中使用任何数据库都变得非常容易。 不管使用文档数据库， 还是关系型数据库，Spring Data 都为持久化提供了一种简单的编程模型。包括为多种数据库类型提供了一种自动化的 Repository 机制。



#### 4.3 Spring Boot

Spring Boot 主要是为了解决使用 Spring 框架需要进行大量的配置太麻烦的问题，所以它并不是用来替代 Spring 的解决方案，而是和 Spring 框架紧密结合用于提升 Spring 开发者体验的工具。

Spring Boot 大量依赖于自动配置（auto-configuration）技术，它能够消除大部分 Spring 配置。它还提供了多个 Starter 项目，降低了项目搭建的复杂度。同时它集成了大量常用的第三方库配置（例如Jackson, JDBC, Mongo, Redis, Mail等等），Spring Boot 应用中这些第三方库几乎可以零配置的开箱即用。