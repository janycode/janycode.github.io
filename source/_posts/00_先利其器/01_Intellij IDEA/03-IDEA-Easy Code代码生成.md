---
title: 03-IDEA-Easy Code代码生成
date: 2018-4-22 20:12:13
tags: 
- IDEA
- Easy Code
- 代码生成
categories:
- 00_先利其器
- 01_Intellij IDEA
---

Easycode是idea的一个插件，可以直接对数据的表生成entity,controller,service,dao,mapper,无需任何编码，简单而强大。
### 1. 安装(EasyCode)
我这里的话是已经装好了。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200428124920832.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)


建议再安装一个插件，叫做`Lombok`。  
Lombok能通过注解的方式，在编译时自动为属性生成构造器、getter/setter、equals、hashcode、toString方法。出现的神奇就是在源码中没有getter和setter方法，但是在编译生成的字节码文件中有getter和setter方法。

### 2. 建立数据库
```sql
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`(  
  `id` int(11) NOT NULL,  
  `username` varchar(20) DEFAULT NULL,  
  `sex` varchar(6) DEFAULT NULL,  
  `birthday` date DEFAULT NULL,  
  `address` varchar(20) DEFAULT NULL,  
  `password` varchar(20) DEFAULT NULL,  
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
SET FOREIGN_KEY_CHECKS = 1;  
```

### 3. 在IDEA配置连接数据库
在这个之前，新建一个Spring Boot项目，这个应该是比较简单的。

建好Spring Boot项目之后，如下图所示，找到这个Database
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020042812393044.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)

按照如下图所示进行操作：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200428123950553.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)

然后填写数据库名字，用户名，密码。点击OK即可。这样的话，IDEA连接数据库就完事了。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200428124020215.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)

### 4. 开始生成代码
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200428124058404.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)

在这个里面找到你想生成的表，然后右键，就会出现如下所示的截面。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200428124223348.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)

勾选你需要生成的代码，点击OK。
这样的话就完成了代码的生成了，生成的代码如下图所示：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200428124305218.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)

### 5. 配置文件：pom.xml
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>

<!--热部署-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional> <!-- 这个需要为 true 热部署才有效 -->
</dependency>

<!--mybatis-->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>1.3.2</version>
</dependency>

<!-- mysql -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.47</version>
</dependency>

<!--阿里巴巴连接池-->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.0.9</version>
</dependency>
```

### 6. 配置文件：Application.yml
```yml
server:
  port: 8089
  spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/database?useUnicode=true&characterEncoding=UTF-8
    username: root
    password: 123456
    type: com.alibaba.druid.pool.DruidDataSource
    driver-class-name: com.mysql.jdbc.Driver

mybatis:
  mapper-locations: classpath:/mapper/*Dao.xml
  typeAliasesPackage: com.vue.demo.entity
```

### 7. 启动项目

在启动项目之前，我们需要先修改两个地方。
在dao层加上@mapper注解：
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020042812461274.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)
在启动类里面加上@MapperScan("com.vue.demo.dao")注解：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200428124648791.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)
启动项目：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200428124714495.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)

测试一下：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200428124754686.png)