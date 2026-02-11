---
title: 06-速记Java开发中的各种O
date: 2023-11-6 17:24:43
tags:
- 理论规范
categories: 
- 11_理论规范
---

> 通过一张表和图快速对Java中的BO,DTO,DAO,PO,POJO,VO之间的含义，区别以及联系进行梳理。

| 名称 | 使用范围                                       | 解释说明                                                     |
| ---- | ---------------------------------------------- | ------------------------------------------------------------ |
| BO   | 用于Service,Manager,Business等业务相关类的命名 | Business Object业务处理对象，主要作用是把业务逻辑封装成一个对象。 |
| DTO  | 经过加工后的PO对象，其内部属性可能增加或减少   | Data Transfer Object数据传输对象，主要用于远程调用等需要大量传输数据的地方，例如，可以将一个或多个PO类的部分或全部属性封装为DTO进行传输 |
| DAO  | 用于对数据库进行读写操作的类进行命名           | Data Access Object数据访问对象，主要用来封装对数据库的访问，通过DAO可以将POJO持久化为PO，也可以利用PO封装出VO和DTO |
| PO   | Bean,Entity等类的命名                          | Persistant Object持久化对象，数据库表中的数据在Java对象中的映射状态，可以简单的理解为一个PO对象即为数据库表中的一条记录 |
| POJO | POJO是DO/DTO/BO/VO的统称                       | Plain Ordinary Java Object 简单Java对象，它是一个简单的普通Java对象，禁止将类命名为XxxxPOJO |
| VO   | 通常是视图控制层和模板引擎之间传递的数据对象   | Value Object 值对象，主要用于视图层，视图控制器将视图层所需的属性封装成一个对象，然后用一个VO对象在视图控制器和视图之间进行数据传输。 |
| AO   | 应用层对象                                     | Application Object，在Web层与Service层之间抽象的复用对象模型，很少用。 |

下面将通过一张图来理解上述几种O之间相互转换的关系:

![image-20241106172525402](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241106172526.png)