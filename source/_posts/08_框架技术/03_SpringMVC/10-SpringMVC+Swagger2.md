---
title: 10-SpringMVC+Swagger2
date: 2018-6-21 22:59:44
tags:
- SpringMVC
- Swagger
categories: 
- 08_框架技术
- 03_SpringMVC
---



![image-20200821163242071](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200821163243.png)



### 1. pom 依赖

```xml
        <!--jackson：For Swagger2，注意 2.9.5 可用-->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-core</artifactId>
            <version>2.9.5</version>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.9.5</version>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-annotations</artifactId>
            <version>2.9.5</version>
        </dependency>

        <!--springfox的核心jar包：For Swagger2，注意 2.6.1 可用-->
        <dependency>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger2</artifactId>
            <version>2.6.1</version>
        </dependency>
        <!--springfox-ui的jar包：For Swagger2，注意 2.6.1 可用-->
        <dependency>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger-ui</artifactId>
            <version>2.6.1</version>
        </dependency>
```



### 2. 配置类

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * @Configuration和@WebAppConfiguration都可以使用
 * 如果项目引入junit测试，此处需要使用@WebAppConfiguration；如果没有使用junit使用@Configuration
 * @WebAppConfiguration 这个ComponentScan配置没有用处
 * 通过限定要生成文档的controller是通过apis()和paths()控制的
 * @ComponentScan(basePackages = "com.demo.controller.api.goods") 扫描control
 */
@Configuration
@EnableSwagger2
@EnableWebMvc
public class SwaggerConfig {

    public static final String PROJECT_NAME = "优居选房小程序后端";
    public static final String PROJECT_VERSION = "1.0.0";
    public static final String PROJECT_URL = "www.youjuhouse.com";
    public static final String SCAN_API_PACKAGE = "com.applet.consumer.controller";
    public static final String SCAN_API_PATH = "/**";

    /**
     * apis():指定要生成文档的接口包基本路径
     * paths():指定针对哪些请求生成接口文档
     * 参考官方资料：http://www.baeldung.com/swagger-2-documentation-for-spring-rest-api
     */
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                //.apis(RequestHandlerSelectors.any())
                .apis(RequestHandlerSelectors.basePackage(SCAN_API_PACKAGE))
                .paths(PathSelectors.ant(SCAN_API_PATH))
                .build()
                .apiInfo(apiInfo());
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title(PROJECT_NAME + " 项目接口文档")
                .description(PROJECT_NAME + " API接口文档")
                .version(PROJECT_VERSION)
                .termsOfServiceUrl(PROJECT_URL)
                .license("")
                .licenseUrl("")
                .build();
    }
}

```



### 3. xml配置

`springmvc.xml`

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
    <mvc:resources mapping="doc.html" location="classpath:/META-INF/resources/"/>
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

`web.xml`

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



#### 4. 支持的所有注解

https://www.cnblogs.com/niudaben/p/11869869.html