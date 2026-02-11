---
title: 17-MySQL慢查询日志使用
date: 2018-08-27 23:57:31
tags:
- MySQL
- 慢查询
- 日志
categories: 
- 05_数据库
- 01_MySQL
---

![image-20200812132737977](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200812132738.png)

### 1. 慢查询日志设置

#### 1.1 方式一

当语句执行时间较长时，通过日志的方式进行记录，这种方式就是慢查询的日志。

1. 临时开启慢查询日志（如果需要长时间开启，则需要更改mysql配置文件，第6点有介绍）

```SQL
set global slow_query_log = on; 
```

注：如果想关闭慢查询日志，只需要执行 `set global slow_query_log = off;` 即可

![image-20220125150541003](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220125150542.png)

2. 临时设置慢查询时间临界点  查询时间高于这个临界点的都会被记录到慢查询日志中（如果需要长时间开启，则需要更改mysql配置文件，第6点有介绍）。

```SQL
set long_query_time = 1;
```

现在起，所有执行时间超过1秒的sql都将被记录到慢查询文件中（这里就是 `/data/mysql/mysql-slow.log`）

![image-20220125150620669](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220125150621.png)

3. 设置慢查询存储的方式

```SQL
set globle log_output = file;
```

说明: 可以看到,这里设置为了file,就是说慢查询日志是通过file体现的,默认是none,可以设置为table或者file,如果是table则慢查询信息会保存到mysql库下的slow_log表中

![image-20220125150635596](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220125150636.png)

4. 查询慢查询日志的开启状态和慢查询日志储存的位置

```SQL
show variables like '%quer%';
```

![image-20220125150810721](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220125150815.png)

参数说明:

```SQL
slow_query_log : 是否已经开启慢查询
slow_query_log_file : 慢查询日志文件路径
long_query_time : 超过多少秒的查询就写入日志 
log_queries_not_using_indexes 如果值设置为ON，则会记录所有没有利用索引的查询(性能优化时开启此项,平时不要开启)
```

 

5. 使用慢查询日志示例

```SQL
cat -n /data/mysql/mysql-slow.log
```

![image-20220125150936243](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220125150937.png)

从慢查询日志中，可以看到每一条查询时间高于 1s 钟的sql语句，并可以看到执行的时间是多少。

比如上面，就表示 sql语句  select * from comic where comic_id < 1952000;  执行时间为 3.902864 秒，超出了设置的慢查询时间临界点1s，所以被记录下来了。



6. 永久设置慢查询日志开启，以及设置慢查询日志时间临界点

linux 中，mysql 配置文件一般默认在 `/etc/my.cnf` 更改对应参数即可。



#### 1.2 方式二

在mysql的配置文件中的mysqld下方添加以下参数

```SQL
log-slow-queries = D:/MySQL/log/mysqld-slow-query.log
long-query-time = 5
#log-long-format
#log-slow-admin-statements
log-queries-not-using-indexes
```

有关慢查询日志功能的相关参数说明：

* `log-slow-queries`

指定日志文件存放位置，该目录文件一定要有写的权限。可以不用设置，系统会给一个缺省的文件host_name-slow.log

* `long_query_time`

SQL执行时间阈值，默认为10秒。

注意以下三点：

1、设置long_query_time这个阈值后，mysql数据库会记录运行时间超过该值的所有SQL语句，但对于运行时间正好等于long_query_time的情况，并不会被记录下来。也就是说，在mysql源码里是判断大于long_query_time，而非大于等于。

2、从mysql 5.1开始，long_query_time开始以微秒记录SQL语句运行时间，之前仅用秒为单位记录。这样可以更精确地记录SQL的运行时间，供DBA分析。

3、建议该时间不应太小或太大，最好在5-10秒之间。当然可以根据自己情况决定。

* `log-queries-not-using-indexes`

如果运行的SQL语句没有使用索引，则mysql数据库同样会将这条SQL语句记录到慢查询日志文件中。

* `log-long-format`

这里需要注意这个参数，不要被网上一些关于mysql慢查询的相关文章所迷惑——他们对此参数的解释是（如果设置了，所有没有使用索引的查询也将被记录），我看了就奇怪了，这不和参数log-queries-not-using-indexes的功能是一样的么，于是百度之，可笑的是，即然有很多文章都是类似描述，这些只知道copy的站长或那些只顾转载的朋友，你要我怎么说你们呢。。。。

与这个参数对应的是另一个参数：log-short-format

简单的说log-long-format选项是用来设置日志的格式，它是以扩展方式记录有关事件。扩展方式可记录谁发出查询和什么时候发出查询的信息。可使我们更好地掌握客户端的操作情况。

准确的说，它是记录激活的更新日志、二进制更新日志、和慢查询日志的大量信息。例如，所有查询的用户名和时间戳将记录下来。不赞成选用该选项，因为它现在代表 默认记录行为。

* `log-short-format`

记录激活的更新日志、二进制更新日志、和慢查询日志的少量信息。例如，用户名和时间戳不记录下来。

* `log-slow-admin-statements`

将慢管理语句例如OPTIMIZE TABLE、ANALYZE TABLE和ALTER TABLE记入慢查询日志。



### 2. 对慢查询日志进行分析

#### 2.1 方式一

通过查看慢查询日志可以发现，很乱，数据量大的时候，可能一天会产生几个G的日志，根本没有办法去清晰明了的分析。所以，这里，采用工具进行分析。

1. 使用mysqldumpslow进行分析【第一种方式】

```SQL
mysqldumpslow -t 10  /data/mysql/mysql-slow.log  #显示出慢查询日志中最慢的10条sql
```

![image-20220125151254772](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220125151255.png)

注：mysqldumpslow工具还有其他参数，以提供其他功能，这里，只以最基本的-t做了介绍。

 

2. 使用pt-query-digest工具进行分析

mysqldumpslow是mysql安装后就自带的工具，用于分析慢查询日志，但是pt-query-digest却不是mysql自带的，如果想使用pt-query-digest进行慢查询日志的分析，则需要自己安装pt-query-digest。pt-query-digest工具相较于mysqldumpslow功能多一点。

（1）安装

```shell
yum install perl-DBI
yum install perl-DBD-MySQL
yum install perl-Time-HiRes
yum install perl-IO-Socket-SSL
wget percona.com/get/pt-query-digest
chmod u+x pt-query-digest 
mv pt-query-digest /usr/bin/  
```

 （2）查看具体参数作用

```shell
pt-query-digest --help
```

![image-20220125162806140](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220125162809.png)

 

（3）使用

```shell
pt-query-digest  /data/mysql/mysql-slow.log
```

查询出来的结果分为三部分

![image-20220125162905679](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220125162906.png)

 第一部分：

显示出了日志的时间范围，以及总的sql数量和不同的sql数量。

第二部分：

显示出统计信息。

第三部分：

每一个sql具体的分析

![image-20220125162955226](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220125162956.png)

pct是percent的简写，表示占的百分比

cout是占总sql个数的百分比，exec time 是占总执行时间的百分比，lock time 表示占总的锁表时间的百分比。

 

（4）如何通过pt-query-digest 慢查询日志发现有问题的sql

1）查询次数多且每次查询占用时间长的sql

通常为pt-query-digest分析的前几个查询

2）IO消耗大的sql

注意pt-query-digest分析中的Rows examine项

3）为命中索引的sql

注意pt-query-digest分析中Rows examine（扫描行数） 和 Rows sent （发送行数）的对比 ，如果扫描行数远远大于发送行数，则说明索引命中率并不高。



#### 2.2 方式二

mysql提供的`mysqldumpslow`命令使用方法如下：

命令行下，进入 mysql/bin 目录，输入 mysqldumpslow ?help 或 --help 可以看到这个工具的参数

```SQL
mysqldumpslow -s c -t 20 host-slow.log
mysqldumpslow -s r -t 20 host-slow.log 
```

上述命令可以看出访问次数最多的 20 个 sql 语句和返回记录集最多的 20 个 sql 

```
mysqldumpslow -t 10 -s t -g "left join" host-slow.log
```

这个是按照时间返回前 10 条里面含有左连接的 sql 语句。

```
mysqldumpslow -s c -t 10 /database/mysql/slow-log
```

这会输出记录次数最多的10条SQL语句，其中：

-s order，是表示按照何种方式排序，order值有：c、t、l、r 分别是按照记录次数、时间、查询时间、返回的记录数来排序，ac、at、al、ar，表示相应的倒序；
-t num，即为返回前面多少条的数据；
-g pattern，pattern可以写一个正则匹配模式，大小写不敏感的；

使用mysqldumpslow命令可以非常明确的得到各种我们需要的查询语句，对MySQL查询语句的监控、分析、优化是MySQL优化的第一步，也是非常重要的一步。
相关命令

查看慢查询的记录数

```
mysql> show global status like '%slow%';
```

查看long_query_time值

```
mysql> show variables like '%long%';
```

查看是否开启慢查询

```
mysql> show variables like 'log_slow_queries';
```

查看log_queries_not_using_indexes状态

```
mysql> show variables like 'log_queries_not_using_indexes';
```



接下来就可以针对性的对 SQL进行优化、对索引进行优化、对数据库结构进行优化、以及系统配置的优化。