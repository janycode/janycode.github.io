---
title: 03-Spring 整合 junit
date: 2018-5-31 17:20:30
tags:
- Spring
- junit
categories: 
- 08_框架技术
- 02_Spring
- 02_IoC
---



![LOGO](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200617144911.png)



参考资料：https://lfvepclr.gitbooks.io/spring-framework-5-doc-cn/content/



### 1. spring-test依赖

提供所需的依赖 `spring-test`

```xml
<dependency>
	<groupId>org.springframework</groupId>
	<artifactId>spring-test</artifactId>
	<version>5.0.2.RELEASE</version>
</dependency>
```

### 2. @RunWith注解

使用 Junit 提供的一个注解把原有的 main 方法替换了，替换成 spring 提供的

* `@RunWith(SpringJUnit4ClassRunner.class)`
    * value：指定 SpringJUnit4ClassRunner.class 即可



### 3. @ContextConfiguration

告知 spring 的运行器，spring 和 IoC 创建是基于 xml 还是注解的，并且说明位置

* `@ContextConfiguration(locations = "classpath:applicationContext.xml")`
* locations：指定xml文件的位置，classpath关键字表示在类路径下



* `@ContextConfiguration(classes = SpringConfig.class)`

    * classes：指定注解配置类（需要手动编写配置类）

> 注意：当使用 spring 5.x 版本的时候，要求 junit 的 jar 必须是 4.12 及以上，spring 版本必须保持一致。



