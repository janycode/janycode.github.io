---
title: 4H搞定Dubbo
date: 2019-03-02 17:59:44
tags:
- Dubbo
- SpringCloudAlibaba
categories: 
- 08_框架技术
- 11_Dubbo
---

![image-20200817090726235](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200817090727.png)

官网地址：http://dubbo.apache.org/zh-cn/

GitHub源码地址：https://github.com/apache/dubbo



### 1. 概述

#### 1.1 简介

Dubbo: 2011.10，阿里开源Java RPC框架；2012年，当当、网易、中国人寿、海尔等采用...

Apache Dubbo：一款**`高性能 Java RPC 框架`**。

* RPC：Remote Procedure Call 远程过程调用

> Dubbo 采用流逝计算架构（SOA）。
>
> SOA：
>
> 面向服务的架构是一个组件模型，它将应用程序的不同功能单元（称为服务）进行拆分，并通过这些服务之间定义良好的接口和协议联系起来。接口是采用中立的方式进行定义的，它应该独立于实现服务的硬件平台、操作系统和编程语言。这使得构件在各种各样的系统中的服务可以以一种统一和通用的方式进行交互。



#### 1.2 作用

Apache Dubbo |ˈdʌbəʊ| 是一款高性能、轻量级的开源Java RPC框架，它提供了三大核心能力：面向接口的远程方法调用，智能容错和负载均衡，以及服务自动注册和发现。

Dubbo 架构：

![image-20200817091247999](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200817091249.png)

| 节点        | 角色说明                               |
| ----------- | -------------------------------------- |
| `Provider`  | 暴露服务的服务提供方                   |
| `Consumer`  | 调用远程服务的服务消费方               |
| `Registry`  | 服务注册与发现的注册中心               |
| `Monitor`   | 统计服务的调用次数和调用时间的监控中心 |
| `Container` | 服务运行容器                           |

1. 服务容器负责启动，加载，运行服务提供者。
2. 服务提供者在启动时，向注册中心注册自己提供的服务。
3. 服务消费者在启动时，向注册中心订阅自己所需的服务。
4. 注册中心返回服务提供者地址列表给消费者，如果有变更，注册中心将基于长连接推送变更数据给消费者。
5. 服务消费者，从提供者地址列表中，基于软负载均衡算法，选一台提供者进行调用，如果调用失败，再选另一台调用。
6. 服务消费者和提供者，在内存中累计调用次数和调用时间，定时每分钟发送一次统计数据到监控中心。



#### 1.3 功能

* 面向接口代理的高性能RPC调用
* 智能负载均衡
* 服务自动注册与发现
* 高度可扩展能力
* 运行期流量调度
* 可视化的服务治理与运维



#### 1.4 传输协议

Dubbo 为了提升传输的性能，支持多种传输协议：

> Dubbo 解决高并发，文件传输使用 rmi。

1. **Dubbo 协议（推荐）**

    采用单一长连接和 NIO 异步通讯，适合于小数据量大并发的服务调用，以及服务消费者机器数远大于服务提供者机器数的情况。
    连接个数：单连接
    连接方式：长连接
    传输协议：TCP
    传输方式：NIO 异步传输
    序列化：Hessian 二进制序列化
    适用范围：`传入传出参数数据包较小（建议小于100K）`，消费者比提供者个数多，单一消费者无法压满提供者，尽量不要用 dubbo 协议传输大文件或超大字符串。
    适用场景：常规远程服务方法调用

    ```xml
    <dubbo:protocol name="dubbo" port="20880" />
    ```

    

2. **rmi 协议**

    采用 JDK 标准的 `java.rmi.*` 实现，采用阻塞式短连接和 JDK 标准序列化方式。
    连接个数：多连接
    连接方式：短连接
    传输协议：TCP
    传输方式：同步传输
    序列化：Java 标准二进制序列化
    适用范围：传入传出参数数据包大小混合，消费者与提供者个数差不多，`可传文件`。
    适用场景：常规远程服务方法调用，与原生RMI服务互操作

    ```xml
    <dubbo:protocol name="rmi" port="1099" />
    ```

3. **http 协议**
    基于 HTTP 表单的远程调用协议，采用 Spring 的 HttpInvoker 实现。
    连接个数：多连接
    连接方式：短连接
    传输协议：HTTP
    传输方式：同步传输
    序列化：表单序列化
    适用范围：传入传出参数数据包大小混合，提供者比消费者个数多，可用浏览器查看，可用表单或URL传入参数，`暂不支持传文件`。
    适用场景：需同时给应用程序和浏览器 JS 使用的服务。

    ```xml
    <dubbo:protocol name="http" port="8080" />
    ```



#### 1.5 注册中心

1. **Zookeeper** 注册中心
    http://dubbo.apache.org/zh-cn/docs/user/references/registry/zookeeper.html

2. **Nacos** 注册中心

    http://dubbo.apache.org/zh-cn/docs/user/references/registry/nacos.html

3. **Multicast** 注册中心
    http://dubbo.apache.org/zh-cn/docs/user/references/registry/multicast.html



### 2. Demo

Dubbo 采用全 Spring 配置方式，透明化接入应用，对应用没有任何 API 侵入，只需用 Spring 加载 Dubbo 的配置即可，Dubbo 基于 Spring 的 Schema 扩展 进行加载。

> xml 约束：
>
> 1. DTD - eg: mybatis, web.xml...
> 2. Schema - eg: spring, springmvc...



架构模块图：（消费者、提供者）

![image-20200821151655873](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200821151657.png)

#### 2.1 消费者

● pom.xml

```
项目_业务接口

spring-webmvc  5.2.8

dubbo  2.7.8
dubbo-registry-nacos  2.7.8

javax.servlet-api  4.0.1

jackson-core  2.9.5
jackson-databind  2.9.5
jackson-annotations  2.9.5

springfox-swagger2  2.6.1
springfox-swagger-ui  2.6.1
```

● springmvc.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:dubbo="http://dubbo.apache.org/schema/dubbo"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/mvc
        http://www.springframework.org/schema/mvc/spring-mvc.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx.xsd
		http://www.springframework.org/schema/aop
		http://www.springframework.org/schema/aop/spring-aop.xsd
		http://dubbo.apache.org/schema/dubbo
		http://dubbo.apache.org/schema/dubbo/dubbo.xsd
">
    <!--扫描控制层，分包时需配置扫描类的直接父目录-->
    <context:component-scan base-package="com.applet.consumer.controller.user"/>
    <context:component-scan base-package="com.applet.consumer.controller.search"/>

    <!--开启注解支持-->
    <mvc:annotation-driven/>

    <!--配置静态资源可访问：将静态资源交由默认的servlet处理-->
    <mvc:default-servlet-handler/>

    <!--
        配置 Swagger2【坑】：
        把swaggerConfig文件刚开始写在controller中，结果总是会遇到莫名其妙的错误，
        在SpringMVC中，controller该组件由SpringMVC配置文件扫描，所以SwaggerConfig.java不要写在controller中
    -->
    <!--重要！配置swagger资源不被拦截-->
    <mvc:resources mapping="swagger-ui.html" location="classpath:/META-INF/resources/"/>
    <mvc:resources mapping="/webjars/**" location="classpath:/META-INF/resources/webjars/"/>
    <!--重要！将SwaggerConfig配置类注入-->
    <bean id="swaggerConfig" class="com.applet.consumer.config.SwaggerConfig"/>

    <!-- 消费方应用名，用于计算依赖关系，不是匹配条件，不要与提供方一样 -->
    <dubbo:application name="searchApi"/>
    <!-- 使用nacos注册中心暴露服务地址 -->
    <dubbo:registry address="nacos://47.94.193.104:8848" username="nacos" password="nacos"/>
    <!--<dubbo:registry address="nacos://39.99.208.213:8848" username="nacos" password="nacos"/>-->
    <!-- 生成远程服务代理，可以和本地bean一样使用demoService, check参数：先启动服务提供者 -->
    <dubbo:reference id="searchHistoryService" interface="com.applet.service.search.SearchHistoryService" check="true" timeout="10000" retries="5"/>

    <dubbo:reference id="userService" interface="com.applet.service.personal.UserService" check="true" timeout="10000" retries="5"/>

</beans>
```

● web.xml

```xml
<!DOCTYPE web-app PUBLIC
        "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
        "http://java.sun.com/dtd/web-app_2_3.dtd" >

<web-app>
    <display-name>ConsumerApi</display-name>

    <!--SpringNVC 配置文件-->
    <servlet>
        <servlet-name>dispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:springmvc.xml</param-value>
        </init-param>
    </servlet>

    <!--访问资源匹配规则：包含页面和控制器资源路径-->
    <servlet-mapping>
        <servlet-name>dispatcherServlet</servlet-name>
        <!--<url-pattern>*.do</url-pattern>-->
        <url-pattern>/</url-pattern>
    </servlet-mapping>
</web-app>
```



#### 2.2 提供者

● pom.xml

```
项目_业务接口

spring-web  5.2.8
spring-context  5.2.8
spring-tx  5.2.8
spring-jdbc  5.2.8

aspectjweaver 1.9.6

mybatis  3.5.5
mybatis-spring  2.0.5
mysql-connector-java  8.0.21
druid  1.1.22

dubbo  2.7.8
dubbo-registry-nacos  2.7.8
```

● jdbc.properties

```properties
jdbc.driver=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql://39.98.140.199:3306/db_youju?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf8&useSSL=false
jdbc.username=root
jdbc.password=1234
```

● spring-dao.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/mvc
        http://www.springframework.org/schema/mvc/spring-mvc.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx.xsd
		http://www.springframework.org/schema/aop
		http://www.springframework.org/schema/aop/spring-aop.xsd
">

    <!--配置数据库配置文件-->
    <context:property-placeholder location="classpath:jdbc.properties"/>
    <!--配置数据库连接池-->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="driverClassName" value="${jdbc.driver}"/>
        <property name="url" value="${jdbc.url}"/>
        <property name="username" value="${jdbc.username}"/>
        <property name="password" value="${jdbc.password}"/>
    </bean>
    <!--配置数据库会话工厂-->
    <bean id="sessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource"/>
        <property name="mapperLocations" value="classpath:mapper/*.xml"/>
        <!--此处也可以配置 mybatisHelper 分页插件-->
    </bean>
    <!--扫描Mapper-->
    <bean id="mapper" class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="basePackage" value="com.applet.personal.dao"/>
    </bean>

</beans>
```

● spring-service.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:dubbo="http://dubbo.apache.org/schema/dubbo"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/mvc
        http://www.springframework.org/schema/mvc/spring-mvc.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx.xsd
		http://www.springframework.org/schema/aop
		http://www.springframework.org/schema/aop/spring-aop.xsd
		http://dubbo.apache.org/schema/dubbo
		http://dubbo.apache.org/schema/dubbo/dubbo.xsd
">
    <!--配置扫描的包-->
    <context:component-scan base-package="com.applet.personal.provider"/>

    <!--配置事务-->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>

    <!--配置事务通知-->
    <tx:advice id="txAdvice" transaction-manager="transactionManager">
        <tx:attributes>
            <tx:method name="*" propagation="REQUIRED" isolation="SERIALIZABLE" rollback-for="java.lang.Exception"/>
            <!--<tx:method name="get*" read-only="true"></tx:method>-->
        </tx:attributes>
    </tx:advice>

    <!--配置AOP切面表达式-->
    <aop:config proxy-target-class="false">
        <!--配置切点（方法匹配）-->
        <aop:pointcut id="ptt1" expression="execution(* com.applet.personal.provider.*.save*(..))"/>
        <aop:pointcut id="ptt2" expression="execution(* com.applet.personal.provider.*.update*(..))"/>
        <aop:pointcut id="ptt3" expression="execution(* com.applet.personal.provider.*.delete*(..))"/>
        <!--切点与切面绑定-->
        <aop:advisor advice-ref="txAdvice" pointcut-ref="ptt1"/>
        <aop:advisor advice-ref="txAdvice" pointcut-ref="ptt2"/>
        <aop:advisor advice-ref="txAdvice" pointcut-ref="ptt3"/>
    </aop:config>

    <!-- 配置 Dubbo 服务提供者-->
    <!-- 用dubbo协议默认在20880端口暴露服务，-1 代表自动分配端口，该配置写在最前面 -->
    <dubbo:protocol name="dubbo" port="-1"/>
    <!-- 提供方应用信息，用于计算依赖关系 -->
    <dubbo:application name="personalServer"/>
    <!-- 使用nacos注册中心暴露服务地址 -->
    <dubbo:registry address="nacos://47.94.193.104:8848" username="nacos" password="nacos"/>
    <!-- 声明需要暴露的服务接口, 如果有多个服务，就写多个 -->
    <dubbo:service interface="com.applet.service.personal.UserService" ref="userServiceImpl" timeout="10000" retries="5"/>
</beans>
```

● web.xml

```xml
<!DOCTYPE web-app PUBLIC
        "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
        "http://java.sun.com/dtd/web-app_2_3.dtd" >

<web-app>
    <display-name>PersonalServer</display-name>

    <!--初始化参数 Spring 的配置文件-->
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:spring-*.xml</param-value>
    </context-param>

    <!--加载 Spring 配置文件并初始化 IOC 容器-->
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>
</web-app>
```

#### 2.3 公共模块

Common、Entity、Service 的 pom.xml 最好加上 maven 编译插件。

```xml
    <!--模块编译war包插件-->
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
            </plugin>
        </plugins>
    </build>
```

> 如果IDEA没有tomcat(如社区版)，可以到插件中安装一个 smarttomcat。
> proxy-target-class="true" // jdk 动态代理
> proxy-target-class="false" // CGLib 动态代理



### 3. 跳坑记录

> 1. 如果服务模块注册不上nacos，检查所有扫描路径的地方是否正确
> 2. 服务模块，不论消费者还是提供者，需在pom中打war包
> 3. 对返回结果封装的 R 类，也同样需要实现 序列化，不仅仅是实体类需要序列化（Dubbo在远程过程调用时需要保证传输数据是序列化格式的）
> 4. 对Common、Entity、Service这些公共模块，需要添加 maven 的编译插件
> 5. 局域网内Dubbo的服务可以在不同的机器上启动，只要Nacos中可以注册，那么服务就是可被消费者消费的