---
title: 18-MySQL主从复制+读写分离详细方案
date: 2021-05-09 20:46:28
tags:
- MySQL
- 读写分离
- 分库分表
categories: 
- 05_数据库
- 01_MySQL
---

![image-20200812132737977](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200812132738.png)

> 正常情况下，只要当单机真的顶不住压力了才会集群，不要一上来就集群，没这个必要。有关于软件的东西都是越简单越好，复杂都是形势所迫。
>
> 一般是`先优化`，优化一些慢查询，优化业务逻辑的调用或者加入缓存等，如果真的优化到没东西优化了`然后才上集群，先读写分离`，读写分离之后顶不住就`再分库分表`。

# 一、MySQL主从复制

## 1.1mysql的复制类型

基于语句的复制（STATEMENT，mysql默认类型）：在主服务器上执行的 SQL 语句，在从服务器上执行同样的语句。MySQL 默认采用基于语句的复制，效率比较高

基于行的复制（ROW）：把改变的内容复制过去，而不是把命令在从服务器上执行一遍

混合类型的复制（MIXED）：默认采用基于语句的复制，一旦发现基于语句无法精确复制时，就会采用基于行的复制

## 1.2mysql主从复制的工作过程

![image-20230223153753599](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223153755.png)



两日志： 二进制日志和中继日志

三线程： master的dump和slave的I/O、sql

dump Thread： 为每个Slave的I/O Thread启动一个dump线程，用于向其发送binary log events

I/O Thread： 向Master请求二进制日志事件，并保存于中继日志中

SQL Thread： 从中继日志中读取日志事件，在本地完成重放



工作过程：

两种说法：

首先client端（tomcat）将数据写入到master节点的数据库中，master节点会通知存储引擎提交事务，同时会将数据以（基于行、基于sql、基于混合）的方式保存在二进制日志钟

SLAVE节点会开启I/O线程，用于监听master的二进制日志的更新，一旦发生更新内容，则向master的dump线程发出同步请求

master的dump线程在接收到SLAVE的I/O请求后，会读取二进制文件中更新的数据，并发送给SLAVE的I/O线程

SLAVE的I/O线程接收到数据后，会保存在SLAVE节点的中继日志中

同时，SLAVE节点钟的SQL线程，会读取中继日志钟的熟，更新在本地的mysql数据库中

最终，完成slave——>复制master数据，达到主从同步的效果

或者

（1）Master节点将数据的改变记录成二进制日志（bin log），当Master上的数据发生改变时，则将其改变写入二进制日志中

（2）Slave节点会在一定时间间隔内对Master的二进制日志进行探测其是否发生改变，如果发生改变，则开始一个I/O线程请求 Master的二进制事件

（3）同时Master节点为每个I/O线程启动一个dump线程，用于向其发送二进制事件，并保存至Slave节点本地的中继日志（Relay log）中

（4）Slave节点将启动SQL线程从中继日志中读取二进制日志，在本地存放，即解析成 sql 语句逐一执行，使得其数据和 Master节点的保持一致，最后I/O线程和SQL线程将进入睡眠状态，等待下一次被唤醒



注意：

中继日志通常会位于 OS 缓存中，所以中继日志的开销很小

复制过程有一个很重要的限制，即复制在slave上是串行化的，也就是说Master上的并行更新操作不能在slave上并行操作



## 1.3MySQL的四种同步方式

MySQL有四种同步方式：

1、异步复制（Async Replication）

2、同步复制（sync Replication）

3、半同步复制（Async Replication）

4、增强半同步复制（lossless Semi-Sync Replication）、无损复制



### 1.3.1异步复制（Async Replication）

主库将更新写入Binlog日志文件后，不需要等待数据更新是否已经复制到从库中，就可以继续处理更多的请求。Master将事件写入binlog，但并不知道Slave是否或何时已经接收且已处理。在异步复制的机制的情况下，如果Master宕机，事务在Master上已提交，但很可能这些事务没有传到任何的Slave上。假设有Master->Salve故障转移的机制，此时Slave也可能会丢失事务。MySQL复制默认是异步复制，异步复制提供了最佳性能。



### 1.3.2同步复制（Sync Replication）

主库将更新写入Binlog日志文件后，需要等待数据更新已经复制到从库中，并且已经在从库执行成功，然后才能返回继续处理其它的请求。同步复制提供了最佳安全性，保证数据安全，数据不会丢失，但对性能有一定的影响。



### 1.3.3半同步复制（Semi-Sync Replication）

主库提交更新写入二进制日志文件后，等待数据更新写入了从服务器中继日志中，然后才能再继续处理其它请求。该功能确保至少有1个从库接收完主库传递过来的binlog内容已经写入到自己的relay log里面了，才会通知主库上面的等待线程，该操作完毕。

半同步复制，是最佳安全性与最佳性能之间的一个折中。

MySQL 5.5版本之后引入了半同步复制功能，主从服务器必须安装半同步复制插件，才能开启该复制功能。如果等待超时，超过rpl_semi_sync_master_timeout参数设置时间（默认值为10000，表示10秒），则关闭半同步复制，并自动转换为异步复制模式。当master dump线程发送完一个事务的所有事件之后，如果在rpl_semi_sync_master_timeout内，收到了从库的响应，则主从又重新恢复为增强半同步复制。

ACK (Acknowledge character）即是确认字符。



### 1.3.4增强半同步复制（lossless Semi-Sync Replication、无损复制）

增强半同步是在MySQL 5.7引入，其实半同步可以看成是一个过渡功能，因为默认的配置就是增强半同步，所以，大家一般说的半同步复制其实就是增强的半同步复制，也就是无损复制。

增强半同步和半同步不同的是，等待ACK时间不同

rpl_semi_sync_master_wait_point = AFTER_SYNC（默认）

半同步的问题是因为等待ACK的点是Commit之后，此时Master已经完成数据变更，用户已经可以看到最新数据，当Binlog还未同步到Slave时，发生主从切换，那么此时从库是没有这个最新数据的，用户看到的是老数据。

增强半同步将等待ACK的点放在提交Commit之前，此时数据还未被提交，外界看不到数据变更，此时如果发送主从切换，新库依然还是老数据，不存在数据不一致的问题



## 1.4MySQL集群和主从复制分别适合什么场景下使用

集群和主从复制是为了应对高并发、大访问量的情况,如果网站访问量和并发量太大了，少量的数据库服务器是处理不过来的，会造成网站访问慢,数据写入会造成数据表或记录被锁住，锁住的意思就是其他访问线程暂时不能读写要等写入完成才能继续，这样会影响其他用户读取速度,采用主从复制可以让一些服务器专门读，一些专门写可以解决这个问题



## 1.5为什么使用主从复制，读写分离

主从复制、读写分离一般是一起使用的，目的很简单，就是为了提高数据库的并发性能。你想，假设是单机，读写都在一台MySQL上面完成，性能肯定不高。如果有三台MySQL，一台mater只负责写操作，两台salve只负责读操作，性能不就能大大提高了吗？

所以主从复制、读写分离就是为了数据库能支持更大的并发

随着业务量的扩展、如果是单机部署的MySQL，会导致I/O频率过高。采用主从复制、读写分离可以提高数据库的可用性



## 1.6用途及条件

（1）MYSQL主从复制用途：

实时灾备，用于故障切换

读写分离，提供查询服务

备份，避免影响服务



（2）必要条件

主库开启binlog日志

主从server-id不同

从库服务器能够连通主库



## 1.7MYSQL主从复制存在的问题

①主库宕机后，数据可能丢失

②从库只有一个SQL Thread,主库写压力大，复制很可能延时

解决办法：

半同步复制——解决数据丢失的问题

并行复制——解决从库复制延迟的问题



## 1.8MySQL主从复制延迟

（1）master服务器高并发，形成大量事务

（2）网络延迟

（3）主从硬件设备导致——cpu主频、内存io、硬盘io

（4）本来就不是同步复制、而是异步复制



从库优化Mysql参数。比如增大innodb_buffer_pool_size，让更多操作在Mysql内存中完成，减少磁盘操作

从库使用高性能主机，包括cpu强悍、内存加大。避免使用虚拟云主机，使用物理主机，这样提升了i/o方面性

从库使用SSD磁盘

网络优化，避免跨机房实现同步



# 二、MySQL读写分离

> 扩展阅读：
>
> 使用Sharding-JDBC 实现Mysql读写分离：[https://developer.aliyun.com/article/1136722](https://developer.aliyun.com/article/1136722)
>
> Centos 7使用MyCat搭建 MySQL-读写分离：[https://developer.aliyun.com/article/1143556](https://developer.aliyun.com/article/1143556)

## 2.1什么是读写分离

### 2.1.1读写分离基本原理

读写分离，基本的原理是让主数据库处理事务性增、改、删操作（INSERT、UPDATE、DELETE），而从数据库处理SELECT查询操作

数据库复制被用来把事务性操作导致的变更同步到集群中的从数据库



### 2.1.2mysql读写分离原理

读写分离就是只在主服务器上写，只在从服务器上读。基本的原理是让主数据库处理事务性操作，而从数据库处理 select 查询。数据库复制被用来把主数据库上事务性操作导致的变更同步到集群中的从数据库



## 2.2为什么要读写分离

因为数据库的“写”（写10000条数据可能要3分钟）操作是比较耗时的

但是数据库的“读”（读10000条数据可能只要5秒钟）

所以读写分离，解决的是，数据库的写入，影响了查询的效率



## 2.3什么时候要读写分离

（1）数据库不一定要读写分离，如果程序使用数据库较多时，而更新少，查询多的情况下会考虑使用。

（2）利用数据库主从同步，再通过读写分离可以分担数据库压力，提高性能



## 2.4主从复制与读写分离

在实际的生产环境中，对数据库的读和写都在同一个数据库服务器中，是不能满足实际需求的。无论是在安全性、高可用性还是高并发等各个方面都是完全不能满足实际需求的。因此，通过主从复制的方式来同步数据，再通过读写分离来提升数据库的并发负载能力。

有点类似于rsync，但是不同的是rsync是对磁盘文件做备份，而mysql主从复制是对数据库中的数据、语句做备份



## 2.5MySQL读写分离的俩种实现方式

目前较为常见的mysql读写分离分为以下俩种：



### 2.5.1基于程序代码内部实现

`在代码中根据 select、insert 进行路由分类，这类方法也是目前生产环境应用最广泛的。`

优点是性能较好，因为在程序代码中实现，不需要增加额外的设备为硬件开支；缺点是需要开发人员来实现，运维人员无从下手。

但是并不是所有的应用都适合在程序代码中实现读写分离，像一些大型复杂的Java应用，如果在程序代码中实现读写分离对代码改动就较大。



### 2.5.2基于中间代理层实现

代理一般位于客户端和服务器之间，代理服务器接到客户端请求后通过判断后转发到后端数据库，有以下代表性程序

（1）MySQL-Proxy：MySQL-Proxy 为 MySQL 开源项目，通过其自带的 lua 脚本进行SQL 判断。

（2）Atlas：是由奇虎360的Web平台部基础架构团队开发维护的一个基于MySQL协议的数据中间层项目。它是在mysql-proxy 0.8.2版本的基础上，对其进行了优化，增加了一些新的功能特性。360内部使用Atlas运行的mysql业务，每天承载的读写请求数达几十亿条。支持事物以及存储过程。

（3）Amoeba：由陈思儒开发，作者曾就职于阿里巴巴。该程序由Java语言进行开发，阿里巴巴将其用于生产环境。但是它不支持事务和存储过程。

注：由于使用MySQL Proxy 需要写大量的Lua脚本，这些Lua并不是现成的，而是需要自己去写。这对于并不熟悉MySQL Proxy 内置变量和MySQL Protocol 的人来说是非常困难的。Amoeba是一个非常容易使用、可移植性非常强的软件。因此它在生产环境中被广泛应用于数据库的代理层



# 三、MySQL主从复制和读写分离实验部署

## 3.1环境配置

| 服务器 | 系统     | IP地址         | 安装包或软件                    |
| ------ | -------- | -------------- | ------------------------------- |
| Master | CentOS 7 | 192.168.145.10 | ntp， mysql-boost-5.7.20.tar.gz |

| Slave 1 | CentOS 7 | 192.168.145.21 | ntp，ntpdate，mysql-boost-5.7.20.tar.gz  |
| ------- | -------- | -------------- | ---------------------------------------- |
| Slave 2 | CentOS 7 | 192.168.145.12 | ntp，ntpdate， mysql-boost-5.7.20.tar.gz |

| Amoeba | CentOS 7 | 192.168.121.22 | jdk-6u14-linux-x64.bin、amoeba-mysql-binary-2.2.0.tar.gz |
| ------ | -------- | -------------- | -------------------------------------------------------- |
| 客户端 | CentOS7  | 192.168.121.55 | Mariadb                                                  |

## 3.2初始环境准备

```
systemctl stop firewalld
systemctl disable firewalld
setenforce 0
```



## 3.3搭建MySQL主从复制

![image-20230223154017562](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223154018.png)

### 3.3.1搭建时间同步（主服务器：192.168.145.10）

主mysql服务器192.168.145.10上的配置

总体操作：

```
1.#安装时间同步服务器
yum install ntp -y
 
2.#修改配置文件
vim /etc/ntp.conf  
server 127.127.137.0   #设置本地时钟源
fudge 127.127.137.0 stratum 8  #设置时间层级为8 限制在15 以内
 
3.#开启服务
service ntpd start
安装时间同步服务器
```



分部演示：

①安装时间同步服务器

```
#安装时间同步服务器
yum install ntp -y
```

![image-20230223154108789](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223154109.png)



②修改配置文件

```
#修改配置文件
vim /etc/ntp.conf  
server 127.127.137.0   #设置本地时钟源
fudge 127.127.137.0 stratum 8  #设置时间层级为8 限制在15 以内
```

![image-20230223154143317](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223154144.png)



④开启服务

```
#开启服务
service ntpd start
```

![image-20230223154159087](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223154200.png)



### 3.3.2搭建时间同步（从服务器：192.168.145.21、192.168.145.12）

总体操作：

```
1.#安装时间同步服务器、同步服务
yum install ntp -y
yum install ntpdate -y
 
2. #开启服务
service ntpd start
 
3. #执行同步
/usr/sbin/ntpdate 192.168.145.10
 
4.#计划定时任务
crontab -e
*/30 * * * *  /usr/sbin/ntpdate 192.168.145.10
 
###########slave2:192.168.145.12与以上操作相同######
```



分部演示：

从mysql服务器192.168.145.21上的配置

①安装时间同步服务器、同步服务

```
#安装时间同步服务器、同步服务
yum install ntp -y
yum install ntpdate -y
```

![image-20230223154254426](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223154255.png)



②开启服务

```
#开启服务
service ntpd start
```

![image-20230223154325643](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223154326.png)



③执行同步

```
#执行同步
/usr/sbin/ntpdate 192.168.145.10
```

![image-20230223154345396](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223154346.png)



④计划定时任务

```
计划定时任务
crontab -e
*/30 * * * *  /usr/sbin/ntpdate 192.168.145.10
```

![image-20230223154416779](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223154417.png)

从mysql服务器192168.145.12上的配置（与上文配置相同）

①安装时间同步服务器、同步服务

```
#安装时间同步服务器、同步服务
yum install ntp -y
yum install ntpdate -y
```

②开启服务

```
#开启服务
service ntpd start
```

③执行同步

```
#执行同步
/usr/sbin/ntpdate 192.168.137.20
```

④计划定时任务

```
#计划定时任务
crontab -e
*/30 * * * *  /usr/sbin/ntpdate 192.168.145.10
```



### 3.3.3配置主服务器（192.168.145.10）

总体操作：

```
1. #开启二进制日志
vim /etc/my.cnf
 
log-bin=master-bin        #开启二进制日志
binlog_format=MIXED       #二进制日志格式
log-slave-updates=true    #开启从服务器同步
 
2. #重启服务
systemctl restart mysqld.service 
 
3. #登入mysql，给从服务器在网段授权
mysql -uroot -p123456
grant replication slave on *.* to 'myslave'@'192.168.145.%' identified by '123456';

#刷新数据库
flush privileges;

#查看主服务器二进制文件
show master status;
```



分部演示：

①开启二进制日志

```
#开启二进制日志
vim /etc/my.cnf
 
server-id = 1             #修改server-id，主从服务器的server-id都不能重复
log-bin=master-bin        #开启二进制日志
binlog_format=MIXED       #二进制日志格式为MIXED
log-slave-updates=true    #开启从服务器同步
```

![image-20230223154536462](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223154537.png)



②重启服务

```
systemctl restart mysqld.service
```



③登入mysql，给从服务器在网段授权

```
mysql -uroot -p123456
GRANT REPLICATION SLAVE ON *.* TO 'myslave'@'192.168.145.%' IDENTIFIED BY '123456';     #给从服务器授权
flush privileges; #刷新数据库
show master status; #查看主服务器二进制文件
```

![image-20230223154612671](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223154613.png)

### 3.3.4配置从服务器（192.168.145 .21/192.168.145.12）

总体操作：

```
1.#开启二进制日志
vim /etc/my.cnf
server-id = 2 #slave1和slave2的id不能相同，我slave2设置的3
relay-log=relay-log-bin
relay-log-index=slave-relay-bin.index
relay_log_recovery = 1
 
2.#重启服务
systemctl restart mysqld.service 
 
3. #登入mysql，配置同步注意master_log_file和master_log_pos的值要和master查询的一致
mysql -uroot -p123456
change master to master_host='192.168.137.20',master_user='myslave',master_password='123456',master_log_file='master-bin.000003',master_log_pos=604;
 
4.#启动同步，如果报错，执行restart slave试试
start slave;
show slave status\G;
##以下两个必须要是YES
#Slave_IO_Running: Yes
#Slave_SQL_Running: Yes
 
```



分部演示：

\#########slave2：192.168.145.21与以上操作相同######

从mysql服务器192168.145.21上的配置

①开启二进制日志

```
vim /etc/my.cnf
server-id = 2                       #修改，注意id与Master的不同，两个Slave的id也要不同
relay-log=relay-log-bin                     #添加，开启中继日志，从主服务器上同步日志文件记录到本地
relay-log-index=slave-relay-bin.index       #添加，定义中继日志文件的位置和名称
relay_log_recovery = 1                      #选配项
#当 slave 从库宕机后，假如 relay-log 损坏了，导致一部分中继日志没有处理，则自动放弃所有未执行的 relay-log，并且重新从 master 上获取日志，这样就保证了relay-log 的完整性。默认情况下该功能是关闭的，将 relay_log_recovery 的值设置为 1 时， 可在 slave 从库上开启该功能，建议开启
```

![image-20230223154711309](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223154712.png)

②重启服务

```
systemctl restart mysqld.service
```



③登入mysql，配置同步注意master_log_file和master_log_pos的值要和master查询的一致

mysql -u root -p

```
mysql -u root -p
change master to master_host='192.168.145.10',master_user='myslave',master_password='123456',master_log_file='master-bin.000001',master_log_pos=756;
#配置同步，注意 master_log_file 和 master_log_pos 的值要与Master查询的一致，这里的是例子，每个人的都不一样
```

![image-20230223155057278](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223155058.png)

④启动同步

```
start slave;      #启动同步，如有报错执行 reset slave;
show slave status\G     #查看 Slave 状态
//确保 IO 和 SQL 线程都是 Yes，代表同步正常。
Slave_IO_Running: Yes    #负责与主机的io通信
Slave_SQL_Running: Yes    #负责自己的slave mysql进程
```

![image-20230223155109605](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223155110.png)

一般 Slave_IO_Running: Connecting/No 的可能性：

1、网络不通

2、my.cnf配置有问题

3、密码、file文件名、pos偏移量不对

4、防火墙没有关闭



从mysql服务器192168.137.10上的配置

①开启二进制日志

```
vim /etc/my.cnf
server-id = 3 #slave1和slave2的id不能相同，我slave2设置的3
relay-log=relay-log-bin
relay-log-index=slave-relay-bin.index
relay_log_recovery = 1
```

②重启服务

```
systemctl restart mysqld.service
```

③登入mysql，配置同步注意master_log_file和master_log_pos的值要和master查询的一致

```
mysql -u root -p
change master to master_host='192.168.137.20',master_user='myslave',master_password='123456',master_log_file='master-bin.000003',master_log_pos=604;
#配置同步，注意 master_log_file 和 master_log_pos 的值要与Master查询的一致，这里的是例子，每个人的都不一样
```

④启动同步

```
start slave;                        #启动同步，如有报错执行 reset slave;
show slave status\G                 #查看 Slave 状态
//确保 IO 和 SQL 线程都是 Yes，代表同步正常。
Slave_IO_Running: Yes               #负责与主机的io通信
Slave_SQL_Running: Yes              #负责自己的slave mysql进程
```

### 3.3.5验证主从同步

```
#在主服务器上创建一个库
create database ceshi;
```

![image-20230223155811178](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223155812.png)



```
#在从服务器上查看
show databases;
```

![image-20230223155826595](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223155827.png)

注：如果需要新加入从服务器，需要先锁住主服务器（防止别人写入数据造成数据丢失），然后将主服务器的数据全部备份到新的从服务器上，然后在新添加的从服务器上 master_log_file 和 master_log_pos 的值是最新的。

```
锁库
flush tables with read lock;
解锁
unlock tables;
```



## 3.4搭建MySQL读写分离

### 3.4.1安装java环境

总体操作：

```
################安装 Java 环境(以jdk1.6为例)###############
1.#下载安装包：jdk-6u14-linux-x64.bin、amoeba-mysql-binary-2.2.0.tar.gz 
cd /opt
 
2.#把jdk复制到/usr/local下
cp jdk-6u14-linux-x64.bin /usr/local/
 
3.#赋予jdk权限并执行
chmod +x /usr/local/jdk-6u14-linux-x64.bin
cd /usr/local/
./jdk-6u14-linux-x64.bin  #一路回车到底，最后输入yes 自动安装
 
4.#jdk改个名字
mv jdk1.6.0_14/ jdk1.6
 
5.#配置环境并刷新
vim /etc/profile
export JAVA_HOME=/usr/local/jdk1.6
export CLASSPATH=$CLASSPATH:$JAVA_HOME/lib:$JAVA_HOME/jre/lib
export PATH=$JAVA_HOME/lib:$JAVA_HOME/jre/bin/:$PATH:$HOME/bin
export AMOEBA_HOME=/usr/local/amoeba
export PATH=$PATH:$AMOEBA_HOME/bin
 
source /etc/profile      #刷新配置文件
java -version
```



分部演示：

①下载 安装包

![image-20230223160035044](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223160036.png)

②把jdk复制到/usr/local下

```
cp jdk-6u14-linux-x64.bin /usr/local/
```

③赋予jdk权限并执行

```
chmod +x /usr/local/jdk-6u14-linux-x64.bin
cd /usr/local/
./jdk-6u14-linux-x64.bin  #一路回车到底，最后输入yes 自动安装
```

![image-20230223160246554](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223160247.png)

④把jdk改个名字

```
mv jdk1.6.0_14/ jdk1.6
```

![image-20230223160311207](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223160312.png)

⑤配置环境并刷新

```
配置环境并刷新
vim /etc/profile
export JAVA_HOME=/usr/local/jdk1.6
export CLASSPATH=$CLASSPATH:$JAVA_HOME/lib:$JAVA_HOME/jre/lib
export PATH=$JAVA_HOME/lib:$JAVA_HOME/jre/bin/:$PATH:$HOME/bin
export AMOEBA_HOME=/usr/local/amoeba
export PATH=$PATH:$AMOEBA_HOME/bin
 
source /etc/profile      #刷新配置文件
java -version #查看版本
```

![image-20230223160331149](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223160332.png)

### 3.4.2配置amoeba

总体操作：

```
############## 安装amoeba ###########
1.#在/usr/local目录下创建amoeba目录
mkdir /usr/local/amoeba
2.#切换至opt解压amoeba
cd /opt/
tar zxvf amoeba-mysql-binary-2.2.0.tar.gz -C /usr/local/amoeba
cd /usr/local/ 切换至目录查看
3.#给目录/usr/local/amoeba赋予执行权限
chmod -R 755 /usr/local/amoeba/
4.#运行amoeba
/usr/local/amoeba/bin/amoeba
```

分部演示：

①在/usr/local目录下创建amoeba目录并解压amoeba

```
mkdir /usr/local/amoeba
```

②切换至opt解压amoeba

```
cd /opt/
tar zxvf amoeba-mysql-binary-2.2.0.tar.gz -C /usr/local/amoeba
cd /usr/local/ 切换至目录查看
```

![image-20230223160439347](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223160440.png)

③给目录/usr/local/amoeba赋予执行权限并运行amoeba

```
#给目录/usr/local/amoeba赋予执行权限
chmod -R 755 /usr/local/amoeba/
#运行amoeba
/usr/local/amoeba/bin/amoeba
# 显示amoeba start|stop就算是成功了
```

![image-20230223160454387](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223160455.png)

### 3.4.3配置amoeba读写分离

总体操作：

```
###########配置 Amoeba读写分离 ####
1.#先在Master、slave1、slave2mysql上开放权限给 Amoeba 访问
grant all on *.* to test@'192.168.145.%' identified by '123456';
flush privileges;
 
2.#备份amoeba配置
cd /usr/local/amoeba/conf/
cp amoeba.xml amoeba.xml.bak
cp dbserver.dtd dbserver.dtd.bak
 
3.#修改amoeba配置
vim amoeba.xml
30 <property name="user">amoeba</property>
#设置登录用户名
32<property name="password">123456</property>
#设置密码
 
115<property name="defaultPool">master</property>
#设置默认池为master
118<property name="writePool">master</property>
#设置写池
119<property name="readPool">slaves</property>
#设置读池
 
vim dbServers.xml 
23 <!-- <property name="schema">test</property> -->
#23行注释
26<property name="user">test</property>
#设置登录用户
28 <!--  mysql password -->
#删除
29<property name="password">123456</property>
#解决28注释，添加密码
 
45<dbServer name="master"  parent="abstractServer">
#服务池名
48<property name="ipAddress">192.168.145.10</property>
#添加地址
 
52<dbServer name="slave1"  parent="abstractServer">
55<property name="ipAddress">192.168.145.21</property>
复制6行 添加另一从节点
59<dbServer name="slave2"  parent="abstractServer">
62<property name="ipAddress">192.168.145.12</property>
 
66<dbServer name="slaves" virtual="true">
#定义池名
72<property name="poolNames">slave1,slave2</property>
#写上从节点名
 
4.#启动amoeba，并测试
amoeba start
netstat -ntap |grep java
```

![image-20230223160512040](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223160513.png)

分部演示：

①先在master、slave1、slave2的mysql上开放权限给amoeba访问

```
grant all on *.* to test@'192.168.145.%' identified by '123456';
flush privileges;
```

②备份amoeba配置

```
cd /usr/local/amoeba/conf/
cp amoeba.xml amoeba.xml.bak
cp dbserver.dtd dbserver.dtd.bak
```

③修改amoeba配置

```
vim amoeba.xml
30 <property name="user">amoeba</property>
#设置登录用户名
32<property name="password">123456</property>
#设置密码
115<property name="defaultPool">master</property>
#设置默认池为master
118<property name="writePool">master</property>
#设置写池
119<property name="readPool">slaves</property>
#设置读池
vim dbServers.xml 
23 <!-- <property name="schema">test</property> -->
#23行注释
26<property name="user">test</property>
#设置登录用户
28 <!--  mysql password -->
#删除
29<property name="password">123456</property>
#解决28注释，添加密码
45<dbServer name="master"  parent="abstractServer">
#服务池名
48<property name="ipAddress">192.168.137.20</property>
#添加地址
52<dbServer name="slave1"  parent="abstractServer">
55<property name="ipAddress">192.168.137.15</property>
复制6行 添加另一从节点
59<dbServer name="slave2"  parent="abstractServer">
62<property name="ipAddress">192.168.137.10</property>
66<dbServer name="slaves" virtual="true">
#定义池名
72<property name="poolNames">slave1,slave2</property>
#写上从节点名
```

![image-20230223160625748](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223160626.png)

④启动amoeba，并测试

```
amoeba start
或
/usr/local/amoeba/bin/amoeba start &
netstat -ntap |grep java
```

![image-20230223160644172](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223160645.png)

### 3.4.4进行主从复制测试

①这边就把amoeba机器当成客户机进行测试（也可以使用另一台机器当客户端）

```
yum install mariadb mariadb-server.x86_64 -y
```

![image-20230223160708858](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223160709.png)

②登入并查看数据库

```
mysql -uamoeba -p123456 -h 192.168.145.11 -P8066
```

![image-20230223160728127](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223160728.png)

③测试同步

```
#在主服务器服务器上新建表
use class;
create table test(id int(10),name char(40));
show tables;
#在客户机上，插入数据会同步到所有数据库中
 use class;
 insert intotest values(3,'ll');
```

![image-20230223160739948](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223160740.png)

④在从服务器上查看

![image-20230223160811897](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223160812.png)

### 3.4.5进行读写分离测试

①两台从服务器上

```
stop slave;     #关闭同步
```

![image-20230223160910298](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223160911.png)

```
#在主服务器 上
insert into test values('4','开');
#在slave1上
insert into test values('2','始');
#在slave2上
insert into test values('3','le');
```

![image-20230223160920909](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230223160921.png)

# 四、总结

mysql的主从复制原理和读写分离的原理；

MySQL有四种同步方式：异步复制（Async Replication）、同步复制（sync Replication）、半同步复制（Async Replication）、增强半同步复制（lossless Semi-Sync Replication）；

MySQL读写分离的俩种实现方式：基于程序代码内部实现、基于中间代理层实现。