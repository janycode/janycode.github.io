---
title: 14-EXPLAIN关键词
date: 2020-9-23 22:50:05
tags:
- MySQL
- explain
categories: 
- 05_数据库
- 01_MySQL
---

![image-20200812132737977](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200812132738.png)

![EXPLAIN](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/EXPLAIN.png)

### 1. EXPLAIN简介

   使用EXPLAIN关键字可以模拟优化器执行SQL查询语句，从而知道MySQL是如何处理你的SQL语句的。分析你的查询语句或是表结构的性能瓶颈。 通过explain我们可以获得以下信息：

- 表的读取顺序
- 数据读取操作的操作类型
- 哪些索引可以使用
- 哪些索引被实际使用
- 表之间的引用
- 每张表有多少行被优化器查询

使用方法：`EXPLAIN SQL语句;`

### 2. 执行计划各字段含义

#### 2.1 id

- id相同，执行顺序由上至下 
- id不同，如果是子查询，id的序号会递增，id值越大优先级越高，越先被执行
- id相同不同，同时存在 id相同的可以认为是一组，同一组中从上往下执行，所有组中id大的优先执行

#### 2.2 type

type所显示的是查询使用了哪种类型，type包含的类型包括如下图所示的几种，从好到差依次是

system > const > eq_ref > ref > range > index > all

- `system` 表只有一行记录（等于系统表），这是const类型的特列，平时不会出现，这个也可以忽略不计
- `const` 表示通过索引一次就找到了，const用于比较primary key 或者unique索引。因为只匹配一行数据，所以很快。如将主键置于where列表中，MySQL就能将该查询转换为一个常量。 
- `eq_ref` 唯一性索引扫描，对于每个索引键，表中只有一条记录与之匹配。常见于主键或唯一索引扫描
- ref 非唯一性索引扫描，返回匹配某个单独值的所有行，本质上也是一种索引访问，它返回所有匹配某个单独值的行，然而，它可能会找到多个符合条件的行，所以他应该属于查找和扫描的混合体。 
- `range` 只检索给定范围的行，使用一个索引来选择行，key列显示使用了哪个索引，一般就是在你的where语句中出现between、< 、>、in等的查询，这种范围扫描索引比全表扫描要好，因为它只需要开始于索引的某一点，而结束于另一点，不用扫描全部索引。 
- `index`  Full Index Scan，Index与All区别为index类型只遍历索引树。这通常比ALL快，因为索引文件通常比数据文件小。（也就是说虽然all和Index都是读全表，但index是从索引中读取的，而all是从硬盘读取的） 
- `all`  Full Table Scan 将遍历全表以找到匹配的行 

#### 2.3 possible_keys 和 key

- `possible_keys` 显示可能应用在这张表中的索引，一个或多个。查询涉及到的字段上若存在索引，则该索引将被列出，**但不一定被查询实际使用**。

- key实际使用的索引，如果为NULL，则没有使用索引。（可能原因包括没有建立索引或索引失效） 

#### 2.4 key_len

表示索引中使用的字节数，可通过该列计算查询中使用的索引的长度，在`不损失精确性的情况下，长度越短越好`。

#### 2.5 rows

根据表统计信息及索引选用情况，大致估算出找到所需的记录所需要`读取的行数`，也就是说，`用的越少越好` 

#### 2.6 Extra

* **Using filesort**

说明mysql会对数据使用一个外部的索引排序，而不是按照表内的索引顺序进行读取。MySQL中无法利用索引完成的排序操作称为“文件排序”。

* **Using temporary**

使用了用临时表保存中间结果，MySQL在对查询结果排序时使用临时表。常见于排序order by和分组查询group by。 

* **Using index**

表示相应的select操作中使用了覆盖索引（Covering Index），避免访问了表的数据行，效率不错。

`如果同时出现 Using where，表明索引被用来执行索引键值的查找`；如果没有同时出现Using where，表明索引用来读取数据而非执行查找动作。

* **Using join buffer**

表明使用了连接缓存,比如说在查询的时候，多表join的次数非常多，那么将配置文件中的缓冲区的join buffer调大一些。