---
title: 06-MyBatis Druid
date: 2017-6-18 08:26:24
tags:
- MyBatis
- Druid
categories: 
- 05_数据库
- 02_MyBatis
---



![001](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/001.png)





### 1. 概念

Druid 是阿里巴巴开源平台上的一个项目，整个项目由数据库连接池、插件框架和 SQL 解析器组成。该项目主要是为了扩展 JDBC 的一些限制，可以让程序员实现一些特殊的需求，比如向密钥服务请求凭证、统计 SQL 信息、SQL 性能收集、SQL 注入检查、SQL 翻译等，程序员可以通过定制来实现自己需要的功能。



### 2. 不同连接池对比

测试执行申请归还连接 1,000,000（一百万）次总耗时性能对比。



#### 2.1 测试环境

| 环境 | 版本                  |
| ---- | --------------------- |
| OS   | OS X 10.8.2           |
| CPU  | Intel i7 2GHz 4 Core  |
| JVM  | Java Version 1.7.0_05 |



#### 2.2 基准测试结果对比

| JDBC-Conn Pool   | 1 Thread | 2 threads | 5 threads  | 10 threads | 20 threads | 50 threads  |
| ---------------- | -------- | --------- | ---------- | ---------- | ---------- | ----------- |
| Druid| `898`  | `1,191` | `1,324`  | `1,362`  | `1,325`  | `1,459`   ||||
| tomcat-jdbc      | 1,269    | 1,378     | 2,029      | 2,103      | 1,879      | 2,025       |
| DBCP             | 2,324    | 5,055     | 5,446      | 5,471      | 5,524      | 5,415       |
| BoneCP           | 3,738    | 3,150     | 3,194      | 5,681      | 11,018     | 23,125      |
| jboss-datasource | 4,377    | 2,988     | 3,680      | 3,980      | 32,708     | 37,742      |
| C3P0             | 10,841   | 13,637    | 10,682     | 11,055     | 14,497     | 20,351      |
| Proxool          | 16,337   | 16,187    | 18,310(Ex) | 25,945     | 33,706(Ex) | 39,501 (Ex) |



#### 2.3 测试结论

* `Druid 是性能最好的数据库连接池，tomcat-jdbc 和 druid 性能接近`。
* Proxool 在激烈并发时会抛异常，不适用。
* C3P0 和 Proxool 都相当慢，影响 sql 执行效率。
* BoneCP 性能并不优越，采用 LinkedTransferQueue 并没有能够获得性能提升。
* 除了 bonecp，其他的在 JDK 7 上跑得比 JDK 6 上快。
* jboss-datasource 虽然稳定，但性能很糟糕。



### 3. 配置pom.xml

引入Druid依赖：

```xml
<!-- https://mvnrepository.com/artifact/com.alibaba/druid -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.16</version>
</dependency>
```



### 4. 创建DruidDataSourceFactory

MyDruidDataSourceFactory并继承PooledDataSourceFactory，并替换数据源：

```java
package com.mybatis.part2.utils;

import com.alibaba.druid.pool.DruidDataSource;
import org.apache.ibatis.datasource.pooled.PooledDataSourceFactory;

public class MyDruidDataSourceFactory extends PooledDataSourceFactory {
    public MyDruidDataSourceFactory() {
        this.dataSource = new DruidDataSource();//替换数据源
    }
}
```



### 5. 修改mybatis-config.xml

mybatis-config.xml中连接池相关配置：

```xml
<!--连接池-->
<dataSource type="com.mybatis.part2.utils.DruidDataSourceFactory"><!--数据源工厂-->
    <property name="driverClass" value="${driver}"/>
    <property name="jdbcUrl" value="${url}"/>
    <property name="username" value="${username}"/>
    <property name="password" value="${password}"/>
</dataSource>
```

注意：`<property name="属性名" />`属性名必须与 com.alibaba.druid.pool.DruidAbstractDataSource 中一致。

