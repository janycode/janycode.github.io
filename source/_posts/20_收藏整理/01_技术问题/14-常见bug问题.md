---
title: 14-常见bug问题
date: 2017-5-3 00:09:33
tags:
- 面试题
categories: 
- 20_收藏整理
- 01_技术问题
---

## 1. 应用服务 8080 端口被意外占用如何解决？

1）按键盘WIN+R键，打开后在运行框中输入“CMD”命令，点击确定。

2）在CMD窗口，输入“netstat -ano”命令，按回车键，即可查看所有的端口占用情况。

3）找到本地地址一览中类似“0.0.0.0:8080”信息，通过此列查看8080端口对应的程序PID。

4）打开任务管理器，详细信息找到对应的应用PID（若不存在通过设置可以调出来），右键结束任务即可。

## 2. JSP 获取 ModelAndView 传参数据问题？

Idea开发工具自动创建的web.xml约束太低，导致无法正常获取数据，需要把web.xml约束的信息调整一下，参考如下：

```xml
<?xml version="1.0" encoding="UTF-8"?> <web-app version="2.5" xmlns="http://java.sun.com/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://java.sun.com/xml/ns/javaee   http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd">
```

## 3. Linux 运行 SQL 语句文件报错？

原因分析：Linux下MySQL版本不兼容导致的。

解决办法：把文件中所有的utf8mb4_0900_ai_ci替换为utf8_general_ci以及utf8mb4替换为utf8类型。

## 4. Spring Cloud Config 使用 SSH 连接 GitHub 报错？

Spring Cloud Config使用SSH连 GitHub报错：

```bash
JSchException: Auth fail
```

可以使用命令生成公钥来解决GitHub报错问题，举例如下：

```bash
ssh-keygen -m PEM -t rsa -b 4096 -C "java@qq.com"
```

## 5. 如何解决 Linux 显示中文乱码问题？

在Linux中通过locale来设置程序运行的不同语言环境，locale由 ANSI C提供支持。locale的命名规则为_.，如zh_CN.GBK，zh代表中文，CN代表大陆地区，GBK表示字符集。

修改 /etc/locale.conf文件的内容

```bash
LANG="zh_CN.UTF-8"
```

执行命令，使修改文件立刻生效

```bash
source /etc/locale.conf
```

## 6. IDEA 中 Maven 项目无法自动识别 pom.xml？

**方式一**

File->Settings->Build,Excecution,Deployment->Build Tools->Maven->Ignored Files

查看是否存在maven pom被勾选，去掉勾选即可。

**方式二**

右键项目pom.xml文件，选择“add as maven project”,自动导入pom所依赖的jar包。

刷新Maven配置

右键单击项目，在弹出菜单中选择Maven->Reimport菜单项。IDEA将通过网络自动下载相关依赖，并存放在Maven的本地仓库中。

或者将Maven的刷新设置为自动，单击File|Setting菜单项，打开Settings选项卡，在左侧的目录树中展开Maven节点，勾选Import Maven projects automatically选择项。

## 7. JSP 模版引擎如何解析 ${} 表达式？

目前开发中已经很少使用JSP模版引擎，JSP虽然是一款功能比较强大的模板引擎，并被广大开发者熟悉，但它前后端耦合比较高。

其次是JSP页面的效率没有HTML高，因为JSP是同步加载。而且JSP需要Tomcat应用服务器部署，但不支持Nginx等，已经快被时代所淘汰。

JSP页面中使用${表达式}展示数据，但是页面上并没有显示出对应数据，而是把${表达式}当作纯文本显示。

原因分析：这是由于jsp模版引擎默认会无视EL表达式，需要手动设置igNoreEL为false。

```java
<%@ page isELIgnored="false" %>
```

## 8. 前端传输参数保存数据到 MySQL 中乱码问题？

数据库连接驱动配置参数url添加UTF-8编码：

```bash
url:jdbc:mysql://127.0.0.1:3306/JavaJingXuan?useUnicode=true&characterEncoding=UTF-8
```

## 9. MySQL 中日期函数时间不准确？

这是由于时区问题导致，首选设置MySQL时区为中国。

需要注意的是MySQL重启后就会恢复默认：

```bash
set time_zone='+8:00';
```

url连接MySQL数据库的时区要和MySQL服务的时区一致，配置参数如下：

```bash
characterEncoding=utf-8&serverTimezone=UTC
```

## 10. Maven 打包提示 “程序包com.sun.deploy.net不存在” 的问题？

将com.sun.deploy.net.URLEncoder换成java.net.URLEncoder，就可以解决Maven 打包提示 “程序包com.sun.deploy.net不存在” 的问题。

## 11. thymeleaf 模板引擎在 Linux 解析报 500 问题？

Spring Boot项目中集成了thymeleaf模版引擎本地正常运行没任何问题，但是放到Linux系统后出现访问页面报500的问题。

分析原因：可能是thymeleaf模板引擎解析找不到模板路径导致的问题。

例如controller层返回url中出现有大写，文件名config.html，路径写成了device/Config，在window下启动项目时可能可以正常访问页面，但是在Linux系统时必须与文件名一致，还有就是前面不要加/，否则也会报500的问题。

## 12. Java 项目第一次登录页面加载很慢问题？

Java中UUID依赖于SecureRandom.nextBytes方法，而SecureRandom又依赖于操作系统提供的随机数源。在Linux系统下，它的默认依赖是/dev/random，而这个源是阻塞的。

主要原因是nextBytes方法是一个被synchronized关键字修饰的方法，也就是说如果多线程调用UUID，生成速率不升反降，解决这个问题需要修改java的默认随机生成规则就可以。

打开$JAVA_PATH/jre/lib/security/java.security文件，找到下面的内容：

```bash
securerandom.source=file:/dev/random
```

替换成

```bash
securerandom.source=file:/dev/./urandom
```

## 13. form 表单嵌套如何解决表单提交问题？

略。



## 14. Dubbo 中抛出 RpcException：No provider available for remote service 异常如何处理？

1）检查连接的注册中心是否正确。

2）到注册中心查看相应的服务提供者是否存在。

3）检查服务提供者是否正常运行。

## 15. SQL 语句执行时间过长，如何优化？

1、查看sql是否涉及多表的联表或者子查询，如果有，看是否能进行业务拆分，相关字段冗余或者合并成临时表（业务和算法的优化）。

2、涉及链表的查询，是否能进行分表查询，单表查询之后的结果进行字段整合。

3、如果以上两种都不能操作，非要链表查询，那么考虑对相对应的查询条件做索引。加快查询速度。

4、针对数量大的表进行历史表分离（如交易流水表）。

5、数据库主从分离，读写分离，降低读写针对同一表同时的压力，至于主从同步，mysql有自带的binlog实现 主从同步。

6、explain分析sql语句，查看执行计划，分析索引是否用上，分析扫描行数等等。

7、查看mysql执行日志，看看是否有其他方面的问题。

## 16. Linux 中如何解决 too many open files 异常问题？

略。



## 17. 如何解决 Redis key/value 中 \xac\xed\x00\x05t\x00 字符串？

略。



## 18. MySQL 中 如何解决 Incorrect string value: '\xE5\xB0' 异常？

略。



## 19. Tomcat 启动 Spring 项目如何实现注解方式配置定时任务？

Spring项目非Spring Boot项目借助Tomcat启动war包来启动项目，通过注解的方式配置定时任务。

1、在spring-mvc.xml的配置文件中添加约束文件：

```xml
xmlns:task="http://www.springframework.org/schema/task" 
http://www.springframework.org/schema/task  
http://www.springframework.org/schema/task/spring-task-3.2.xsd 
```

2、配置注解驱动

```xml
<task:annotation-driven />
```

3、添加注解的扫描包

```xml
<context:component-scan base-package="com.jingxuan" />
```

4、定时任务代码

```java
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class JingxuanTask {
    @Scheduled(cron = "0/5 * * * * ? ") // 间隔5秒执行
    public void task() {
        System.out.println("----定时任务开始执行-----");
		//执行具体业务逻辑----------  
        System.out.println("----定时任务执行结束-----");
    }
}
```

## 20. Tomcat 可以多个同时启动吗？如何实现？

Tomcat可以多个同时启动，但需要修改server.xml配置文件的端口号。

修改%TOMCAT_HOME%\conf下的server.xml配置文件

**第一个：** 修改http访问端口（默认为8080端口）

```xml
<Connector port="8080" protocol="HTTP/1.1" 
               connectionTimeout="20000" 
               redirectPort="8443" />
```

将8080修改为第一个tomcat不在使用的端口号。此处所设的端口号即是访问web时所用的端口号。

**第二个：** 修改Shutdown端口（默认为8005端口）

```xml
<Server port="8005" shutdown="SHUTDOWN">
```

将8005修改为没有在使用的端口号。

**第三个：** 修改8009端口

```xml
<Connector port="8009" protocol="AJP/1.3" redirectPort="8443" />
```

将8009修改为没有在使用的端口号。



