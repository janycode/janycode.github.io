---
title: 01-SpringMVC Demo
date: 2018-6-20 17:59:44
tags:
- SpringMVC
- 架构
categories: 
- 08_框架技术
- 03_SpringMVC
---





![image-20200620175456961](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200620175458.png)

参考资料：https://spring-mvc.linesh.tw/



### 1. SpringMVC 概述

SpringMVC 是一种基于 Java 实现 `MVC 设计模型的请求驱动类型的轻量级 Web 框架`。它和 Struts2 都属于表现层的框架，属于 Spring FrameWork 的后续产品，Spring MVC 分离了控制器、模型对象、过滤器以及处理程序对象的角色，这种分离让它们更容易进行定制。

SpringMVC 已经成为目前最主流的 MVC 框架之一，并且随着 Spring3.0 的发布，全面超越 Struts2，成为最优秀的 MVC 框架，它通过一套注解，让一个简单的 Java 类成为处理请求的控制器，而无须实现任何接口。同时它还支持 RESTful 编程风格的请求。

### 2. SpringMVC 架构

#### 2.1 架构流程

Spring MVC 框架核心：`请求驱动`； 所有设计都围绕着一个中央 Servlet 来展开， 它负责把所有请求分发到控制器； 同时提供其他web应用开发所需要的功能。   

Spring Web MVC的中央处理器 `DispatcherServlet` 处理请求的工作流：

1. 用户发送请求至前端控制器 DispatcherServlet

2. DispatcherServlet 收到请求调用 HandlerMapping 处理器映射器
3. 处理器映射器根据请求 url 找到具体的处理器，生成处理器对象及处理器拦截器(如果有则生成)一并返回给 DispatcherServlet
4. DispatcherServlet 通过 HandlerAdapter 处理器适配器调用处理器
5. 执行处理器( Controller，也叫后端控制器)
6. Controller 执行完成返回 ModelAndView
7. HandlerAdapter 将 controller 执行结果 ModelAndView 返回给 DispatcherServlet
8. DispatcherServlet 将 ModelAndView 传给 ViewReslover 视图解析器
9. ViewReslover 解析后返回具体 View
10. DispatcherServlet 对 View 进行渲染视图（即将模型数据填充至视图中）
11. DispatcherServlet 响应用户

![springmvc架构图](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200620091254.png)

#### 2.2 组件说明

以下组件通常使用框架提供实现：

* **DispatcherServlet**：前端控制器
    用户请求到达前端控制器，它就相当于mvc模式中的c，dispatcherServlet是整个流程控制的中心，由它调用其它组件处理用户的请求，dispatcherServlet的存在降低了组件之间的耦合性。

* **HandlerMapping**：处理器映射器
    HandlerMapping负责根据用户请求url找到Handler即处理器，springmvc提供了不同的映射器实现不同的映射方式，例如：配置文件方式，实现接口方式，注解方式等。

* **Handler**：处理器
    Handler 是继DispatcherServlet前端控制器的后端控制器，在DispatcherServlet的控制下Handler对具体的用户请求进行处理。
    由于Handler涉及到具体的用户业务请求，所以一般情况需要程序员根据业务需求开发Handler。

* **HandlAdapter**：处理器适配器
    通过HandlerAdapter对处理器进行执行，这是适配器模式的应用，通过扩展适配器可以对更多类型的处理器进行执行。适配器最终都可以使用usb接口连接 

* **ViewResolver**：视图解析器
    View Resolver负责将处理结果生成View视图，View Resolver首先根据逻辑视图名解析成物理视图名即具体的页面地址，再生成View视图对象，最后对View进行渲染将处理结果通过页面展示给用户。 

* **View**：视图
    springmvc框架提供了很多的View视图类型的支持，包括：jstlView、freemarkerView、pdfView等。我们最常用的视图就是jsp。

一般情况下需要通过页面标签或页面模版技术将模型数据通过页面展示给用户，需要由程序员根据业务需求开发具体的页面。

在 springmvc 的各个组件中，`处理器映射器、处理器适配器、视图解析器`称为 springmvc 的三大组件。
`需要用户开发的组件有 handler、view`，因为框架已经默认加载这些组件了，所以我们不需要做任何配置，就可以使用这些组件了。



### 3. SpringMVC 入门

1. 创建一个 web 工程，导入 SpringMVC 核心依赖 `spring-webmvc`

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200611104019-Maven%E5%88%9B%E5%BB%BAweb%E9%A1%B9%E7%9B%AE.png)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    ...
    <dependencies>
        <!-- 导入 SpringMVC 核心依赖 -->
		<dependency>
		    <groupId>org.springframework</groupId>
		    <artifactId>spring-webmvc</artifactId>
		    <version>5.2.7.RELEASE</version>
	    </dependency>
    </dependencies>

    <!-- 按需指定maven编译器版本和tomcat版本，正常情况配置 tomcat9.0即可，无需配置以下插件 -->
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <target>1.8</target>
                    <source>1.8</source>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
                <plugin>
                    <groupId>org.apache.tomcat.maven</groupId>
                    <artifactId>tomcat7-maven-plugin</artifactId>
                    <version>2.2</version>
                    <configuration>
                        <port>8081</port>
                    </configuration>
                </plugin>
        </plugins>
    </build>
</project>
```

2. 在 webapp 目录下创建 login.jsp 和 /WEB-INF/jsp/success.jsp

```html
login.jsp：
    <body>
        <a href="user/login">登录</a>
    </body>

success.jsp：
    <body>
            success.jsp
    </body>
```

3. 在 main 目录下创建 java 目录，然后创建 com.demo.controller.UserController

```java
@Controller
@RequestMapping("/user") // 注解映射请求路径
public class UserController {
    @RequestMapping("/login") // 指定细分的注解映射请求路径
    public String Login(){
        System.out.println("login...");
        return "/success.jsp";
    }
}
```
4. 在 main 目录下创建 resources 目录，然后创建 springmvc.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/mvc
        http://www.springframework.org/schema/mvc/spring-mvc.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">

    <!-- 1.开启注解扫描 -->
    <context:component-scan base-package="com.demo"/>

    <!-- 2.视图解析器对象 -->
    <bean id="internalResourceViewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <!-- 指定控制层方法返回的路径前缀为 /WEB-INF/jsp -->
        <property name="prefix" value="/WEB-INF/jsp" />
    </bean>

    <!-- 3.开启SpringMVC框架注解的支持 -->
    <mvc:annotation-driven />

</beans>
```
5. 配置 web.xml

```xml
<!DOCTYPE web-app PUBLIC
        "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
        "http://java.sun.com/dtd/web-app_2_3.dtd" >

<web-app>
    <display-name>Archetype Created Web Application</display-name>

    <!--配置解决中文乱码的过滤器-->
    <filter>
        <filter-name>characterEncodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>characterEncodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <!--配置前端控制器 DispatcherServlet-->
    <servlet>
        <servlet-name>dispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:springmvc.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>dispatcherServlet</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>

</web-app>
```

