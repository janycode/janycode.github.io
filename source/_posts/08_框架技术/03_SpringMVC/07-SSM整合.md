---
title: 07-SSM整合
date: 2018-6-20 23:59:44
tags:
- SpringMVC
- SSM
categories: 
- 08_框架技术
- 03_SpringMVC
---



### 1. 项目创建

#### 0. 准备数据库

```sql
CREATE DATABASE wyy_music;

USE wyy_music;

DROP TABLE IF EXISTS `tb_music`;
CREATE TABLE `tb_music` (
  `music_id` VARCHAR(255) NOT NULL, -- 歌曲ID
  `music_name` VARCHAR(255) NOT NULL, -- 歌曲名称
  `music_album_name` VARCHAR(255) NOT NULL, -- 专辑名称
  `music_album_picUrl` VARCHAR(255) NOT NULL, -- 专辑图片路径
  `music_mp3Url` VARCHAR(255) NOT NULL, -- 歌曲播放路径
  `music_artist_name` VARCHAR(255) NOT NULL, -- 歌手名称
  `sheet_id` INT(11) DEFAULT NULL, -- 对应的歌单ID
  PRIMARY KEY (`music_id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;

INSERT INTO tb_music VALUES ('1', '大碗宽面', '大碗宽面', 'http://p1.music.126.net/yDFbKhM9wIO0GWEuOvxhVg==/109951164007799327.jpg?param=130y130', 'http://music.163.com/song/media/outer/url?id=1359595520.mp3', '吴亦凡','1');
INSERT INTO tb_music VALUES ('2', '来自天堂的魔鬼', '新的心跳', 'https://p1.music.126.net/kVwk6b8Qdya8oDyGDcyAVA==/1364493930777368.jpg', 'http://music.163.com/song/media/outer/url?id=36270426.mp3', 'G.E.M.邓紫棋','1');
INSERT INTO tb_music VALUES ('3', '好久不见', '认了吧', 'https://p1.music.126.net/o_OjL_NZNoeog9fIjBXAyw==/18782957139233959.jpg', 'http://music.163.com/song/media/outer/url?id=65538.mp3', '陈奕迅','2');

DROP TABLE IF EXISTS `tb_sheet`;
CREATE TABLE `tb_sheet` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `sheet_name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO tb_sheet VALUES ('1', '华语金曲榜');
INSERT INTO tb_sheet VALUES ('2', '陈奕迅精选');
INSERT INTO tb_sheet VALUES ('3', '抖音热门歌曲');
```



#### 1. 创建Maven Web工程

#### 2. 导入依赖

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.7</maven.compiler.source>
    <maven.compiler.target>1.7</maven.compiler.target>
    <!-- 配置全局spring版本 -->
    <spring.version>5.2.6.RELEASE</spring.version>
  </properties>

  <dependencies>
    <!-- spring & springmvc -->
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-webmvc</artifactId>
      <!-- 配置版本-->
      <version>${spring.version}</version>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-jdbc</artifactId>
      <version>5.2.6.RELEASE</version>
    </dependency>
    <dependency>
      <groupId>org.aspectj</groupId>
      <artifactId>aspectjweaver</artifactId>
      <version>1.9.4</version>
    </dependency>

    <!-- mybatis -->
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

    <!-- jackson -->
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



#### 	3. 生成pojo和Mapper

使用逆向工程生成 pojo，mapper 以及 mapper.xml 文件

> 注意：生成的代码拷贝至工程的指定位置，并在 Mapper 接口上加 @Repository 注解
>
> 逆向工程的使用：[MyBatis-逆向工程](https://janycode.github.io/2017/06/19/05_%E6%95%B0%E6%8D%AE%E5%BA%93/02_MyBatis/08-MyBatis%20%E9%80%86%E5%90%91%E5%B7%A5%E7%A8%8B/)





#### 	4. 编写 Service

```java
package com.demo.service;

import com.demo.pojo.TbMusic;
import java.util.List;

public interface MusicService {
    List<TbMusic> findAll();
}
```



#### 	 5. 编写 ServiceImpl

```java
package com.demo.service.impl;

import com.demo.dao.TbMusicMapper;
import com.demo.pojo.TbMusic;
import com.demo.service.MusicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MusicServiceImpl implements MusicService {

    @Autowired
    private TbMusicMapper tbMusicMapper;

    @Override
    public List<TbMusic> findAll() {
        return tbMusicMapper.selectByExample(null);
    }

}
```



#### 	6. 编写 Controller

```java
package com.demo.controller;

import com.demo.pojo.TbMusic;
import com.demo.service.MusicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController // @RestController = @Controller + @ResponseBody
@RequestMapping("/music") // servlet 访问路径映射：一级目录
public class MusicController {

    @Autowired // 自动类型注入
    private MusicService musicService;

    @RequestMapping("/findAll") // servlet 访问路径映射：二级目录
    public List<TbMusic> findAll(){
        return musicService.findAll();
    }
}

```



#### 7. 编写 jdbc.properties

```properties
jdbc.driver=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/wyy_music?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf8
jdbc.username=root
jdbc.password=123456
```



#### 8. 编写 mybatis-config.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
	<!-- 暂无内容，后续可设置分页插件配置 -->
</configuration>
```



#### 9. 编写 applicationContext.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx.xsd">
    
    <!-- 开启注解扫描，希望处理 service 和 dao，不需要 spring 框架去处理 controller -->
    <context:component-scan base-package="com.demo">
        <!-- 配置不扫描的注解 -->
        <!-- <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller" />-->
    </context:component-scan>

    <!-- 引入外部 properties 文件 -->
    <context:property-placeholder location="classpath:jdbc.properties"/>

    <!--Spring 整合 MyBatis 框架 -->
    <!-- 配置数据源 -->
    <bean name="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="username" value="${jdbc.username}"/>
        <property name="password" value="${jdbc.password}"/>
        <property name="url" value="${jdbc.url}"/>
        <property name="driverClassName" value="${jdbc.driverClassName}"/>
    </bean>

    <!-- 配置 sqlSessionFactoryBean 对象 -->
    <bean name="sqlSessionFactoryBean" class="org.mybatis.spring.SqlSessionFactoryBean">
        <!-- 配置数据源 -->
        <property name="dataSource" ref="dataSource"/>
        <!-- 引入 mybatis-config.xml -->
        <property name="configLocation" value="classpath:mybatis-config.xml"/>
    </bean>

    <!-- 扫描 mapper.xml 配置文件 -->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="basePackage" value="com.demo.dao"/>
    </bean>

    <!-- 配置事务平台管理器 -->
    <bean name="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>

    <!-- 配置事务通知 -->
    <tx:advice id="txAdvice" transaction-manager="transactionManager">
        <tx:attributes>
            <!-- 事务通知匹配的方法 + 隔离级别 + 传播行为 + 查询(RD:true)/非查询(RD:false) -->
            <tx:method name="find*" isolation="DEFAULT" propagation="REQUIRED" read-only="true"/>
        </tx:attributes>
    </tx:advice>

    <!-- 配置事务到 AOP -->
    <aop:config>
        <aop:advisor advice-ref="txAdvice" pointcut="execution(* com.demo.service.impl.*ServiceImpl.*(..))" />
    </aop:config>
</beans>
```



#### 10. 编写 springmvc.xml

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



#### 11. 编写 web.xml

```xml
<!DOCTYPE web-app PUBLIC
        "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
        "http://java.sun.com/dtd/web-app_2_3.dtd" >
<web-app>
    <display-name>Archetype Created Web Application</display-name>

    <!--  配置 applicationContext.xml 为全局参数 -->
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:applicationContext.xml</param-value>
    </context-param>

    <!-- 通过 Spring 监听器自动加载 context-param 全局参数 -->
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>

    <!-- 前端控制器 DispatcherServlet (SpringMVC 中央核心控制器) -->
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



#### 12. 测试

浏览器访问：http://localhost:8080/music/findAll





### 2. 添加分页操作

#### 1. 导入依赖

```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper</artifactId>
    <version>5.1.11</version>
</dependency>
```



#### 2. 配置分页插件（2选1）

2.1 第一种：在 applicationContext.xml 中添加分页插件配置

```xml
    <!-- 配置sqlSessionFactoryBean -->
    <bean name="sqlSessionFactoryBean" class="org.mybatis.spring.SqlSessionFactoryBean">
        <!-- 配置数据源 -->
        <property name="dataSource" ref="dataSource" />
        <!-- 引入mybatis-config.xml -->
        <property name="configLocation" value="classpath:mybatis-config.xml"/>

        <!--分页插件配置（applicationContext.xml 或 mybatis-config.xml 中任配其一）-->
        <property name="plugins">
            <set>
                <bean class="com.github.pagehelper.PageInterceptor">
                    <property name="properties">
                        <props>
                            <!-- 数据库方言，可选择：oracle,mysql,mariadb 等 -->
                            <prop key="helperDialect">mysql</prop>
                            <!--reasonable：分页合理化参数，默认值：false。
                            当该参数设置为true时，pageNum<=0 时会查询第一页，
                            pageNum>totalPages（总页数），会查询最后一页 -->
                            <prop key="reasonable">true</prop>
                            <!--supportMethodsArguments：
                            是否支持通过 Mapper 接口参数来传递分页参数，默认值：false -->
                            <prop key="supportMethodsArguments">true</prop>
                        </props>
                    </property>
                </bean>
            </set>
        </property>

    </bean>
```

2.2 第二种：在 mybatis-config.xml 中添加配置

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <!--分页插件配置（applicationContext.xml 或 mybatis-config.xml 中任配其一）-->
    <plugins>
        <plugin interceptor="com.github.pagehelper.PageInterceptor">
            <property name="helperDialect" value="mysql"/>
            <property name="reasonable" value="true"/>
            <property name="supportMtehodsArguments" value="true"/>
        </plugin>
    </plugins>

</configuration>
```



#### 3. 在 controller 中添加方法

```java
	@RequestMapping("/findPage")
    public PageInfo findPage(
        /* required：是否为必需参数   defaultValue：参数未提供时的默认值 */
        @RequestParam(value = "pNo", required = false,defaultValue = "1") Integer pageNum,
        @RequestParam(value = "pSize", required = false,defaultValue = "2") Integer pageSize){

        PageHelper.startPage(pageNum,pageSize);
        List<TbMusic> list = musicService.findAll();

        PageInfo pageInfo = new PageInfo(list);

        return pageInfo;
    }
```



#### 4. 测试

浏览器访问：http://localhost:8080/music/findByPage?pNo=1&pSize=2



