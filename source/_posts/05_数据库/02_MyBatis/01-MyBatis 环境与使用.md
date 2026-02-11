---
title: 01-MyBatis 环境与使用
date: 2017-6-18 23:04:05
tags:
- MyBatis
- 配置
categories: 
- 05_数据库
- 02_MyBatis
---

![001](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/001.png)





> 扩展了解：[Mybatis-Plus](https://mp.baomidou.com/)、TKMybatis、[Hibernate](http://hibernate.org/)、[jpa](https://spring.io/projects/spring-data-jpa)



### 1. 引言

#### 1.1 ORM框架介绍

ORM（Object Relational Mapping）对象关系映射，将程序中的`一个对象与表中的一行数据一一对应`。

ORM框架提供了持久化类与表的映射关系，在运行时参照映射文件的信息，`把对象持久化到数据库中`。



####  1.2 使用JDBC完成ORM操作的缺点

- 存在大量的冗余代码。

- 手工创建 Connection、Statement 等。

- 手工将结果集封装成实体对象。

- 查询效率低，没有对数据访问进行过优化（Not Cache）。



###  2. MyBatis框架

#### 2.1 概念

MyBatis本是Apache软件基金会的一个开源项目iBatis, 2010年这个项目由apache software foundation 迁移到了Google Code，并且改名为MyBatis 。2013年11月迁移到Github。

MyBatis是一个`优秀的基于Java的持久层框架`，支持自定义SQL，存储过程和高级映射。

MyBatis`对原有JDBC操作进行了封装`，几乎消除了所有JDBC代码，使开发者只需关注 SQL 本身。

MyBatis可以使用简单的XML或Annotation来配置执行SQL，并`自动完成ORM操作`，将执行结果返回。



#### 2.2 访问与下载

> 官方网站：<http://www.mybatis.org/mybatis-3/>
>
> 下载地址：<https://github.com/mybatis/mybatis-3/releases/tag/mybatis-3.5.1>



### 3. 构建Maven项目

#### 3.1 新建项目

|                使用IDEA打开已创建的文件夹目录                |
| :----------------------------------------------------------: |
| ![002](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/002.png) |



#### 3.2 选择Maven目录

|                        选择Maven项目                         |
| :----------------------------------------------------------: |
| ![003](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/007.png) |



#### 3.3 GAV坐标

|                           GAV坐标                            |
| :----------------------------------------------------------: |
| ![image-20191230174727813](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/003.png) |



### 4. MyBatis环境搭建【★】

#### 4.1 POM引入依赖

在 pom.xml 中引入 MyBatis 依赖。

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" 	
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation=
         "http://maven.apache.org/POM/4.0.0 
          http://maven.apache.org/xsd/maven-4.0.0.xsd">
    
    <modelVersion>4.0.0</modelVersion>

    <!--项目配置-->
    <groupId>com.demo</groupId>
    <artifactId>hello-mybatis</artifactId>
    <version>1.0-SNAPSHOT</version>

    <!--依赖-->
    <dependencies>
        <!--MyBatis核心依赖-->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.4.6</version>
        </dependency>

        <!--MySql驱动依赖-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.47</version>
        </dependency>
	  </dependencies>
</project>
```



#### 4.2 XML文件配置

创建并配置 mybatis-config.xml （名称可自定义，见名知意）。

* XML 文件约束：https://mybatis.org/mybatis-3/zh/getting-started.html
* XML settings 标签配置和作用：cacheEnabled、lazyLoadingEnabled、aggressiveLazyLoading、multipleResultSetsEnabled、useColumnLabel、useGeneratedKeys、autoMappingBehavior、defaultExecutorType、等参考：https://mybatis.org/mybatis-3/zh/configuration.html

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
	"http://mybatis.org/dtd/mybatis-3-config.dtd">

<!--MyBatis配置-->
<configuration>
    <properties .../>
    <settings>...</settings>
    
    <!--JDBC环境配置、选中默认环境-->
    <environments default="MySqlDB">
        <!--MySql数据库环境配置-->
        <environment id="MySqlDB">
            <!--事务管理-->
            <transactionManager type="JDBC"/>
            <!--连接池-->
            <dataSource type="org.apache.ibatis.datasource.pooled.PooledDataSourceFactory">
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <!-- &转义&amp; -->
                <property name="url" value="jdbc:mysql://localhost:3306/数据库名?useUnicode=true&amp;characterEncoding=utf8&amp;useSSL=false"/>
                <property name="username" value="xxx"/>
                <property name="password" value="xxx"/>
            </dataSource>
        </environment>
    </environments>

    <!--Mapper注册-->
    <mappers>
        <!--注册Mapper文件的所在位置-->
        <mapper resource="xxxMapper.xml"/>
    </mappers>
</configuration>
```

* `注意：mapper.xml 默认建议存放在 resources 中,路径不能以/开头`






### 5. MyBatis开发步骤【★】

1. 定义实体类 - 与数据库表对应
2. 定义 dao 接口
3. 编写 Mapper.xml
4. 注册 Mapper.xml



#### 5.1 建表(准备)

```	sql
create table t_users(
  id int primary key auto_increment,
  name varchar(50),
  password varchar(50),
  sex varchar(1),
  birthday datetime,
  registTime datetime
)default charset = utf8;
```



#### 5.2 定义实体类

定义所需CURD操作的实体类：

```java
package com.mybatis.part1.basic;

public class User {
    private Integer id;
    private String name;
    private String password;
    private String sex;
  	private Date birthday;
  	private Date registTime;

	//无参构造（必备构造二选一）
    public User() {}
    
    //全参构造（必备构造二选一）
    public User(Integer id, String name, String password, String sex, Date birthday, Date registTime) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.sex = sex;
      	this.birthday = birthday;
      	this.registTime = registTime;
    }
    
    //Getters And Setters
}
```



#### 5.3 定义DAO接口

根据所需DAO定义接口、以及方法：

```java
package com.mybatis.part1.basic;

public interface UserDao {
    public User selectUserById(Integer id);
}
```



#### 5.4 编写Mapper.xml

在resources目录中创建 `UserDaoMapper.xml` 文件，且名称命名必须为 `接口名Mapper.xml`

* XML 文件约束：https://mybatis.org/mybatis-3/zh/getting-started.html


```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
	"http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<!--namespace = 所需实现的接口全限定名-->
<mapper namespace="com.mybatis.part1.basic.UserDao">
    <!--id = 所需重写的接口抽象方法，resultType = 查询后所需返回的对象类型-->
    <select id="selectUserById" resultType="com.mybatis.part1.basic.User" parameterType="Integer">
        <!--#{arg0} = 方法的第一个形参-->
      	SELECT * FROM t_users WHERE id = #{arg0}
    </select>

    <!-- 实体类属性名最好与数据库字段名相同 -->
    <!-- select * from t_goods where goodsName='${goodsName}' and id='${id}' -->
    <select id="getGoodsByNameAndId" resultType="com.demo.entity.Goods">
        select * from t_goods where goodsName=#{goodsName} and id=#{id}
    </select>

</mapper>
```

> 注意：可能会因为文件编码方式问题，`尽量不使用中文注释`。



#### 5.5 注册Mapper

将 `UserDaoMapper.xml` 注册到 mybatis-config.xml 中（三种方式任选其一）

```xml
<!--Mapper文件注册位置-->
<mappers>
    <!--方式 ①：通过 路径 注册 xml Mapper 文件  -->
    <mapper resource="com/demo/dao/impl/UserDaoMapper.xml"/>
    <!--方式 ②：通过 class 注册 xml Mapper 文件  -->
    <mapper class="com.demo.dao.UserMapper"/>
    <!--方式 ③：通过 包名 注册目录下所有的 xml Mapper 文件  -->
    <package name="com.demo.dao"/>
</mappers>
```



#### 5.6 测试一

MyBatis 的 API 一般操作方式：

```java
package com.mybatis.part1.basic;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;

public class HelloMyBatis {

    @Test
    public void test1() throws IOException {
		//1.获得读取MyBatis配置文件的流对象（注意 Resources 导包为 org.apache.ibatis.io）
        InputStream is = Resources.getResourceAsStream("mybatis-config.xml");

        //2.构建SqlSession连接对象的工厂
        SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(is);

        //3.通过工厂获得 sql 会话对象（该对象可以直接操作数据库）
        SqlSession sqlSession = factory.openSession();

        //4.通过连接对象获得接口实现类对象，并调用方法执行
        User user = sqlSession.getMapper(UserDao.class).selectUserById(1);
        System.out.println(user);
    }
}
```



#### 5.7 测试二

~~iBatis 传统操作方式，写法繁琐（弃用）。~~

```java
package com.mybatis.part1.basic;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;

public class HelloMyBatis {

    @Test
    public void test2() throws IOException {
		//1.获得读取MyBatis配置文件的流对象
        InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
        //2.构建SqlSession连接对象的工厂
        SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(is);
        //3.通过工厂获得连接对象
        SqlSession sqlSession = factory.openSession();
        //4.通过连接对象直接调用接口中的方法
		Object o = sqlSession.selectOne("com.mybatis.part1.basic.UserDao.selectUserById", 1);
      	System.out.println(o);
    }
}
```



### 6. 补充

#### 6.1 mapper.xml路径变更

解决 mapper.xml 存放在 resources 以外路径中的读取问题：

将自定义的 mapper.xml （实现类xml文件）放到 com.demo.`dao.impl` 包下时，需要配置 pom.xml 才可读取。在 pom.xml 文件最后追加`<build>`标签，以便可以将 xml 文件复制到classes中，并在程序运行时正确读取。

> 注意：移动到 resources 以外的路径时会报错：**2 字节的 UTF-8 序列的字节 2 无效** 解决方案？
>
> * build >> rebuild project `重建整个项目`
> * 自定义的 xml 文件中`去掉所有的中文，包括注释`

```xml
...
<build>
    <resources>
        <resource>
            <directory>src/main/java</directory>
            <includes>
              	<include>*.xml</include><!-- 默认（新添加自定义则失效） -->
                <include>**/*.xml</include><!-- 新添加 */代表1级目录 **/代表多级目录 -->
            </includes>
            <filtering>true</filtering>
        </resource>
    </resources>
</build>

</project>
```



#### 6.2 properties配置文件

对于 mybatis-config.xml 的核心配置中，如果存在需要频繁改动的数据内容，可以提取到 properties 中。

```properties
#jdbc.properties
jdbc.driver=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/数据库名?useUnicode=true&characterEncoding=utf8
jdbc.username=root
jdbc.password=123456
```

> 注意：
>
> windows mysql57 的后台服务时，也可以使用 `mysql 8.0.20` 版本的依赖，但是需要在 jdbc.url 中使用该参数 `serverTimezone=Asia/Shanghai`,即 jdbc:mysql://localhost:3306/库名?serverTimezone=Asia/Shanghai
>
> 如果使用 mysql 5.x 的版本是时，则可以不需要该时区参数。
>
> ![image-20200615160307849](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200615160307849.png)

修改 mybatis-config.xml。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>
	<!--添加properties配置文件路径(外部配置、动态替换)-->
    <properties resource="jdbc.properties" />
    
    <environments default="MySqlDB">
        ...
        <environment id="MySqlDB">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <!--使用$ + 占位符-->
                <property name="driver" value="${jdbc.driver}"/>
                <property name="url" value="${jdbc.url}"/>
                <property name="username" value="${jdbc.username}"/>
                <property name="password" value="${jdbc.password}"/>
            </dataSource>
        </environment>
        
    </environments>
	...
</configuration>
```



#### 6.3 实体类别名

为`实体类定义`别名，提高书写效率。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>
    <properties ... />
    
    <!--定义别名二选一-->
    <typeAliases>
        <!--定义类的别名-->
        <typeAlias type="com.mybatis.part1.basic.User" alias="User" />

        <!--自动扫描包，将原类名作为别名(最佳)-->
        <package name="com.mybatis.part1.basic" />
    </typeAliases>
  
  	...
</configuration>
```

![image-20200612100517763](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200612100517763.png)

> 注意：书写顺序有严格要求。



#### 6.4 log4j配置文件

* pom.xml 添加 **log4j** 依赖：

```xml
<!-- log4j日志依赖 https://mvnrepository.com/artifact/log4j/log4j -->
<dependency>
    <groupId>log4j</groupId>
    <artifactId>log4j</artifactId>
    <version>1.2.17</version>
</dependency>
```

* 创建并配置 **log4j.properties**（`此配置文件名称不能自定义命名`）

```properties
# Global logging configuration
log4j.rootLogger=DEBUG, stdout
# MyBatis logging configuration...
log4j.logger.org.mybatis.example.BlogMapper=TRACE
# Console output...
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern=[%-5p] %d{yyyy-MM-dd HH:mm:ss,SSS} method:%l%n%m%n

#设置输出日志信息编码（根据实际编码情况修改，如 UTF-8 或 GBK）
log4j.appender.stdout.encoding=GBK
```

|   级别    | 描述                                                         |
| :-------: | :----------------------------------------------------------- |
| ALL LEVEL | 打开所有日志记录开关；是最低等级的，用于打开所有日志记录。   |
|  `DEBUG`  | `输出调试信息；指出细粒度信息事件对调试应用程序是非常有帮助的`。 |
|   INFO    | 输出提示信息；消息在粗粒度级别上突出强调应用程序的运行过程。 |
|   WARN    | 输出警告信息；表明会出现潜在错误的情形。                     |
|   ERROR   | 输出错误信息；指出虽然发生错误事件，但仍然不影响系统的继续运行。 |
|   FATAL   | 输出致命错误；指出每个严重的错误事件将会导致应用程序的退出。 |
| OFF LEVEL | 关闭所有日志记录开关；是最高等级的，用于关闭所有日志记录。   |

log4j参考配置文件：

```properties
### 设置 ###
log4j.rootLogger=debug,stdout,D,E

### 输出信息到控制抬 ###
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.Target=System.out
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern=[%-5p] %d{yyyy-MM-dd HH:mm:ss,SSS} method:%l%n%m%n

### 输出DEBUG 级别以上的日志到=E://logs/error.log ###
log4j.appender.D=org.apache.log4j.DailyRollingFileAppender
log4j.appender.D.File=E://logs/log.log
log4j.appender.D.Append=true
log4j.appender.D.Threshold=DEBUG 
log4j.appender.D.layout=org.apache.log4j.PatternLayout
log4j.appender.D.layout.ConversionPattern=%-d{yyyy-MM-dd HH:mm:ss}  [ %t:%r ] - [ %p ]  %m%n

### 输出ERROR 级别以上的日志到=E://logs/error.log ###
log4j.appender.E=org.apache.log4j.DailyRollingFileAppender
log4j.appender.E.File=E://logs/error.log 
log4j.appender.E.Append=true
log4j.appender.E.Threshold=ERROR 
log4j.appender.E.layout=org.apache.log4j.PatternLayout
log4j.appender.E.layout.ConversionPattern=%-d{yyyy-MM-dd HH:mm:ss}  [ %t:%r ] - [ %p ]  %m%n
```



#### 6.5 中文乱码解决

排查区域：

* MySql 建库时的编码方式（CREATE DATABASE xxx `CHARACTER SET UTF8`;）
* MySql 建表时的编码方式（CREATE TABLE xxx(... ...) `CHARSET=utf8`;）
* MySql 配置文件 my.ini 配置文件中编码方式配置（# default-character-set=）注释意为 默认系统编码
* IDEA 中 `File Encodings` 的 全局编码、项目编码、Path中编码不一致的提示文件、properties文件编码、以及xml/html/jsp等web页面中声明的页面编码方式
    如：xml 的编码声明 `<?xml version="1.0" encoding="UTF-8" ?>`
    如：log4j 的编码配置在创建的 log4j.properties 中 `log4j.appender.stdout.encoding=系统编码方式`



![image-20200612151139179](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200612151139179.png)
