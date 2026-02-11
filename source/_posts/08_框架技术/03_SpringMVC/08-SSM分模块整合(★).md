---
title: 08-SSM分模块整合(★)
date: 2018-6-20 23:59:45
tags:
- SpringMVC
- SSM
categories: 
- 08_框架技术
- 03_SpringMVC
---

SSM 分模块整合

如3层：ssm-main { ssm-dao, ssm-service, ssm-web }

![image-20200624144939003](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200624144939.png)



### 1. 创建父工程 main

父工程：music-main

打包方式： pom

* pom.xml

```xml
<packaging>pom</packaging>
```

> pom 用在父级工程或聚合工程中。用来做 jar 包的版本控制。必须指明这个聚合工程的打包方式为 pom。

### 2. 创建子工程 dao

子工程：music-dao

打包方式：jar

命令：`mvn install`

#### 	2.1 pom.xml

```xml
    <parent>
        <artifactId>music-main</artifactId>
        <groupId>com.demo</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>music-dao</artifactId>

    <packaging>jar</packaging>

    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.2.6.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>5.2.6.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.20</version>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>1.1.19</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.4</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>2.0.4</version>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.12</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>3.8.1</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
```

> * **pojo**, **dao**, **mapper.xml** 可通过`逆向工程`生成：[MyBatis-逆向工程](https://janycode.github.io/2017/06/19/05_%E6%95%B0%E6%8D%AE%E5%BA%93/02_MyBatis/08-MyBatis%20%E9%80%86%E5%90%91%E5%B7%A5%E7%A8%8B/)

#### 	2.2  pojo

```java
package com.demo.pojo;

import lombok.Data;

@Data
public class Music {
    private String music_id;
    private String music_name;
    private String music_album_name;
    private String music_album_picUrl;
    private String music_mp3Url;
    private String music_artist_name;
    private Integer sheet_id;
}

```



#### 	2.3  Dao

```java
package com.demo.dao;

import com.demo.pojo.Music;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MusicDao {
    //@Select("select * from tb_music")
    List<Music> findAll();
}

```



#### 	2.4  Mapper.xml

resources/`com/demo/dao`/MusicDao.xml

> 注意：
>
> * resources 下的目录创建，使用的符号是 " `/` " 不是 " . "

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >

<mapper namespace="com.demo.dao.MusicDao">

    <resultMap id="musicMap" type="com.demo.pojo.Music" >
        <id column="music_id" property="music_id" jdbcType="VARCHAR" />
        <result column="music_name" property="music_name" jdbcType="VARCHAR" />
        <result column="music_album_name" property="music_album_name" jdbcType="VARCHAR" />
        <result column="music_album_picUrl" property="music_album_picUrl" jdbcType="VARCHAR" />
        <result column="music_mp3Url" property="music_mp3Url" jdbcType="VARCHAR" />
        <result column="music_artist_name" property="music_artist_name" jdbcType="VARCHAR" />
        <result column="sheet_id" property="sheet_id" jdbcType="INTEGER" />
    </resultMap>

    <select id="findAll" resultType="com.demo.pojo.Music" resultMap="musicMap">
        select * from tb_music
    </select>
</mapper>
```



#### 	2.5  jdbc.properties

```properties
jdbc.driver=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/wyy_music?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf8
jdbc.username=root
jdbc.password=123456
```



#### 	2.6 applicationContext.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
	    http://www.springframework.org/schema/context/spring-context-4.0.xsd">

        <!-- 扫描注解 -->
    <context:component-scan base-package="com.demo"/>

    <!-- 配置 读取properties文件 jdbc.properties -->
    <context:property-placeholder location="classpath:jdbc.properties"/>

    <!-- 配置 数据源 -->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="driverClassName" value="${jdbc.driver}"/>
        <property name="url" value="${jdbc.url}"/>
        <property name="username" value="${jdbc.username}"/>
        <property name="password" value="${jdbc.password}"/>
    </bean>

    <!--配置SqlSessionFactoryBean-->
    <bean id="sessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
       <!-- 设置数据源 -->
        <property name="dataSource" ref="dataSource"/>
        <!--配置mybatis 插件-->
        <property name="plugins">
            <set>
                <!--配置pageHelper 分页插件-->
                <bean class="com.github.pagehelper.PageInterceptor">
                    <property name="properties">
                        <props>
                            <!-- 数据库方言，可选择：oracle,mysql,mariadb 等-->
                            <prop key="helperDialect">mysql</prop>
                            <!--reasonable：分页合理化参数，默认值：false。
                            当该参数设置为true时，pageNum<=0时会查询第一页，
                            pageNum>pages（超过总数时），会查询最后一页-->
                            <prop key="reasonable">true</prop>
                            <!--supportMethodsArguments：
                            是否支持通过 Mapper 接口参数来传递分页参数，默认值：false-->
                            <prop key="supportMethodsArguments">true</prop>
                        </props>
                    </property>
                </bean>
            </set>
        </property>
    </bean>

    <!--配置Mapper扫描-->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <!--设置Mapper扫描包-->
        <property name="basePackage" value="com.demo.dao" />
    </bean>
</beans>
```



### 3.创建子工程 service

子工程：music-service

打包方式：jar

命令：`mvn install` (此处打包 parent 的才能使 service 生成 jar 包)

#### 	3.1 pom.xml

```xml
    <parent>
        <artifactId>music-main</artifactId>
        <groupId>com.demo</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>music-service</artifactId>

    <packaging>jar</packaging>

    <dependencies>
        <dependency>
            <groupId>com.demo</groupId>
            <artifactId>music-dao</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>
    </dependencies>
```



#### 	3.2 Service

```java
package com.demo.service;

import com.demo.pojo.Music;
import java.util.List;

public interface MusicService {
    List<Music> findAll();
}
```



#### 	3.3 ServiceImpl

```java
package com.demo.service.impl;

import com.demo.dao.MusicDao;
import com.demo.pojo.Music;
import com.demo.service.MusicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MusicServiceImpl implements MusicService {

    @Autowired
    private MusicDao musicDao;

    @Override
    public List<Music> findAll() {
        return musicDao.findAll();
    }
}
```



### 4.创建子工程 web

子工程：music-web

打包方式：war

命令：`mvn install`

#### 	4.1 pom.xml

```xml
    <parent>
        <artifactId>music-main</artifactId>
        <groupId>com.demo</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>music-web</artifactId>
    <packaging>war</packaging>

    <name>music-web Maven Webapp</name>
    <!-- FIXME change it to the project's website -->
    <url>http://www.example.com</url>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>1.7</maven.compiler.source>
        <maven.compiler.target>1.7</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <groupId>com.demo</groupId>
            <artifactId>music-service</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.2.7.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.11.0</version>
        </dependency>

        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.11</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
```



#### 	4.2 springmvc.xml

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

    <!-- 扫描指定包下的注解 -->
    <context:component-scan base-package="com.demo.controller"/>
    <!-- 设置静态资源可以访问 -->
    <mvc:default-servlet-handler/>
    <!-- 注解配置 -->
    <mvc:annotation-driven/>
    <!-- 配置视图解析器 -->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <!-- 前缀和后缀 -->
        <!-- <property name="prefix" value=""></property>-->
        <!-- <property name="suffix" value=""></property>-->
    </bean>
</beans>
```



#### 	4.3 web.xml

```xml
<!DOCTYPE web-app PUBLIC
        "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
        "http://java.sun.com/dtd/web-app_2_3.dtd" >

<web-app>
  <display-name>Archetype Created Web Application</display-name>

  <!-- 配置applicationContext.xml-->
  <context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>classpath:applicationContext.xml</param-value>
  </context-param>

  <!-- 通过监听的方式去加载applicationContext.xml-->
  <listener>
    <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
  </listener>

  <!-- 前端过滤器 -->
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



#### 	4.4  Controller

```java
package com.demo.controller;

import com.demo.pojo.Music;
import com.demo.service.MusicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/music")
public class MusicController {

    @Autowired
    private MusicService musicService;

    @RequestMapping("/findAll")
    public List<Music> findAll(){
        return musicService.findAll();
    }
}
```



依次在 IDEA Maven 菜单中 `install`  music-dao，music-service 然后启动 music-web 访问，该案例中整合并测试分页插件。



### 5. Q&A 问题汇总

#### 5.1 404 错误

* 一般均为路径问题，导致访问不到资源。
* 也可能为 @RequestMapping("url") 配置没有生效，需检查配置
* 还可能是因为 pom 依赖没有导入，刷新检查依赖

#### 5.2 500 服务器内部错误

* 检查 pojo 实体类属性名 与 数据库列名 是否完全一致，Mybatis ORM 映射需要保持一致
* 检查前端携带的参数 或 取值后.访问出来的属性名 是否与 pojo实体类属性名 或 Mapper.xml 中 resultMap 是否一致（result 中 column 与数据库列一致，property 与实体类一致）
* 检查 xxxMapper.xml 的 xxx 是否与 接口名完全一致，如 UserDao 接口与 UserDaoMapper.xml
* 检查 mvn install 后的 target/ 目录下配置文件是否没有遗漏

* 错误：**No qualifying bean of type 'com.demo.service.VideoService' available: expected at least 1 bean which qualifies as autowire candidate.**（dao service controller 的三层架构注解未装配成功）

    原因：applicationContext.xml 在使用监听器监听 ServletContext 初始化时加载时，没有成功加载，所以@Autowired注解没有正常生效，无法装配bean对象，没有成功注入。切记！！！`classpath的写法`！

```xml
<!-- web.xml -->
<context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>classpath*:applicationContext-*.xml</param-value>
</context-param>

<listener>
    <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
</listener>

<!-- 以下这两种写法OK：用*号通配时冒号前声明*号，精确匹配时可不用*号 -->
classpath*:applicationContext-*.xml
classpath:applicationContext-dao.xml
```

