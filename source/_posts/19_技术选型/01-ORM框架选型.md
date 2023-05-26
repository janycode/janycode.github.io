---
title: 01-ORM框架选型
date: 2020-6-13 23:18:32
tags:
- 框架
- 选型
- ORM
categories: 
- 19_技术选型
---



| ORM框架           | 官网                                        | 开源时间 | 支持的数据库                | 灵活性 | 开发效率 | 优点                                                         | 缺点                                                         |
| ----------------- | ------------------------------------------- | -------- | --------------------------- | ------ | -------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Hibernate**     | https://hibernate.org/zh-cn/                | 2001年   | MySQL, Oracle, SQL Server等 | 中等   | 高       | 1.简化了数据库操作，提高了开发效率；<br />2.支持对象关系映射，允许Java应用程序使用面向对象编程的方式而不是使用传统的SQL语句进行数据存取；<br />3.支持二级缓存和查询缓存，提高了系统性能。 | 1.底层实现复杂，使用过程中较容易出错；<br />2.配置相对繁琐，需要深入学习和理解才能正确使用；<br />3.由于采用全自动建表的方式，在数据库性能较弱时执行SQL语句较慢。 |
| **MyBatis**       | https://mybatis.org/mybatis-3/zh/index.html | 2010年   | MySQL, Oracle, SQL Server等 | 较高   | 高       | 1.将SQL语句与Java代码分离，降低了代码耦合度；<br />2.支持动态SQL语句，可以根据条件拼接SQL语句，灵活性较高；<br />3.对原始JDBC进行了封装，易于上手使用。 | 1.需要手写SQL语句，一定程度上增加了开发难度；<br />2.极少的自动化操作，例如对象映射等；<br />3.缺乏全局二级缓存支持，查询性能较低。 |
| `MyBatisPlus`     | https://baomidou.com/                       | 2018年   | MySQL, Oracle, SQL Server等 | 高     | 极高     | 1.基于MyBatis进行了增强和扩展，使得开发更简单；<br />2.提供代码生成器，大量减少重复工作；<br />3.内置多种插件，如分页插件等。 | 1.过于依赖注解，灵活性比较差；<br />2.不支持多数据源操作；<br />3.功能较为单一，很多高级特性无法满足需求。 |
| **SpringDataJPA** | https://spring.io/projects/spring-data-jpa  | 2013年   | MySQL, Oracle, SQL Server等 | 中等   | 高       | 1.基于Spring Framework进行了增强和扩展，容易上手；<br />2.采用注解方式管理实体对象和数据库表结构之间的映射，简化了开发流程；<br />3.支持多种查询方法，按照属性名称自动生成查询方法。 | 1.底层实现相对简单，无法满足高级需求；<br />2.缺少灵活的查询语句支持；<br />3.性能相对较低，不适用于大数据量系统。 |
| **JOOQ**          | https://www.jooq.org/                       | 2010年   | MySQL, Oracle, SQL Server等 | 高     | 高       | 类型安全、易于使用、提供流畅的API、支持多表联查              | 舍弃了对象关系映射，需要手动编写Java代码                     |



### **1) Hibernate**

Hibernate 框架是一个全表映射的框架。通常开发者只要定义好持久化对象到数据库表的映射关系，就可以通过 Hibernate 框架提供的方法完成持久层操作。

开发者并不需要熟练地掌握 SQL 语句的编写，Hibernate 框架会根据编制的存储逻辑，自动生成对应的 SQL，并调用 JDBC 接口来执行，所以其开发效率会高于 MyBatis 框架。

然而 Hibernate 框架自身也存在一些缺点，例如：

- 多表关联时，对 SQL 查询的支持较差；
- 更新数据时，需要发送所有字段；
- 不支持存储过程；
- 不能通过优化 SQL 来优化性能。

这些问题导致其只适合在场景不太复杂且对性能要求不高的项目中使用。

Hibernate 官网：[http://hibernate.org/](https://link.zhihu.com/?target=http%3A//hibernate.org/)

### **2) MyBatis**

MyBatis 框架是一个半自动映射的框架。这里所谓的 “半自动” 是相对于 Hibernate 框架全表映射而言的，MyBatis 框架需要手动匹配提供 POJO、SQL 和映射关系，而 Hibernate 框架只需提供 POJO 和映射关系即可。

与 Hibernate 框架相比，虽然使用 MyBatis 框架手动编写 SQL 要比使用 Hibernate 框架的工作量大，但 MyBatis 框架可以配置动态 SQL 并优化 SQL、通过配置决定 SQL 的映射规则，以及支持存储过程等。对于一些复杂的和需要优化性能的项目来说，显然使用 MyBatis 框架更加合适。

MyBatis 框架可应用于需求多变的互联网项目，如电商项目；Hibernate 框架可应用于需求明确、业务固定的项目，如 OA 项目、ERP 项目等。

MyBatis 3 中文文档：[mybatis – MyBatis 3 | 简介](https://link.zhihu.com/?target=https%3A//mybatis.org/mybatis-3/zh/)

### **3) gaarason**

- 让连接数据库以及对数据库进行增删改查操作变得非常简单，不论希望使用原生 SQL、还是查询构造器，还是 Eloquent ORM。
- Eloquent ORM 提供一个美观、简单的与数据库打交道的 ActiveRecord 实现，每个数据表都对应一个与该表数据结构对应的实体（Entity），以及的进行交互的模型（Model），通过模型类，你可以对数据表进行查询、插入、更新、删除等操作，并将结果反映到实体实例化的 java 对象中。
- 对于关联关系 Eloquent ORM 提供了富有表现力的声明方式，与简洁的使用方法，并专注在内部进行查询与内存优化，在复杂的关系中有仍然有着良好的体验。
- 兼容于其他常见的 ORM 框架, 以及常见的数据源 (DataSource)

```text
// 查询id为4的一条数据 select * from student where id = 4 limit 1
Student student = studentModel.find(4).toObject();

// 表达式列名风格 select name,age from student where id in (1,2,3)
List<Student> Students = studentModel.newQuery().whereIn(Student::getId, 1,2,3)
    .select(Student::getName).select(Student::getAge)
    .get().toObjectList();

// 稍复杂嵌套的语句 select id,name from student where id=3 or(age>11 and id=7 and(id between 4 and 10 and age>11))
List<Student> Students = studentModel.newQuery().where("id", "3").orWhere(
    builder -> builder.where("age", ">", "11").where("id", "7").andWhere(
        builder2 -> builder2.whereBetween("id", "4", "10").where("age", ">", "11")
    )
).select("id", "name").get().toObjectList();


// 关联查询 找出学生们的老师们的父亲们的那些房子
List<Student> Students = studentModel.newQuery().whereIn("id", "1","2","3").get().with("teacher.father.house").toObjectList();


// 增加关联 给id为8的学生增加3名老师(id分别为1,2,3)
studentModel.findOrFail(8).bind("teachers").attach( teacherModel.findMany(1,2,3) );
```



gaarason 中文文档：[Gaarasion database | 简介](https://link.zhihu.com/?target=https%3A//github.com/gaarason/database-all)

### **4) spring data JPA**

spirng data jpa是spring提供的一套简化JPA开发的框架，按照约定好的【方法命名规则】写dao层接口，就可以在不写接口实现的情况下，实现对数据库的访问和操作。同时提供了很多除了CRUD之外的功能，如分页、排序、复杂查询等等。

Spring Data JPA 可以理解为 JPA 规范的再次封装抽象，底层还是使用了 Hibernate 的 JPA 技术实现。