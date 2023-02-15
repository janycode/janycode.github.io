---
title: 04-Redis 事务+持久化+订阅
date: 2017-6-20 23:04:05
tags:
- Redis
- 事务
categories: 
- 05_数据库
- 03_Redis
---

![image-20200815230439632](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815230440.png)

官网教程：https://www.redis.net.cn/tutorial/3515.html

### 1. Redis 事务

Redis 中的事务和 MySQL 中的事务有本质的区别，`Redis中的事务是一个单独的隔离操作`，事务中所有的命令都会序列化，按照顺序执行，事务在执行的过程中，不会被其他客户端发来的命令所打断，因为Redis服务端是个`单线程`的架构，不同的 Client 虽然看似可以同时保持连接，但发出去的命令是序列化执行的，这在通常的数据库理论下是最高级别的隔离。

Redis中的事务的作用就是`串联多个命令，防止别的命令插队`。

#### 1.1 事务命令

* `multi`、`exec`、`discard`
    * 当输入 multi 命令时，之后输入的命令都会被放在队列中，但不会执行；
    * 直到输入 exec 命令后，Redis 会将队列中的命令依次执行；
    * 如果输入 discard 命令用来撤销 exec 之前被暂存的命令，并不是回滚。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200707195012.png)

 

* `watch`、`unwacth`

在执行 multi 之前，先执行 watch key1 [key2...] ，watch 提供的`乐观锁`功能（初始时一个版本号，exec 之后会更新当前版本号），在你 exec 的那一刻，如果被 watch 的键发生过改动，则 multi 到 exec 之间的指令全部不执行。

watch 表示监控，相当于加锁，但在执行完 exec 时就会解锁。

unwacth 取消所有锁。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200707195350.png)



#### 1.2 Redis 事务特性

**1）单独的隔离操作**

事务中的所有命令都会序列化，然后按顺序执行，在执行过程中，不会被其他客户端发送的命令打断。

**2）没有隔离级别的概念**

队列中的命令没有被提交之前都不会执行。

**3）不能保证原子性**

Redis 同一个事务中如果有一条命令执行失败，其后的命令仍然会被执行，不会回滚。



### 2. Redis 持久化

Redis有两种持久化方式：**`RDB`**和**`AOF`**。



#### 2.1 RDB

`R`edis `D`ata`B`ase, 将内存中的数据以快照的方式写入磁盘中，在 redis.conf 文件中，可以找到如下配置：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200707195633.png)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200707195646.png)

```shell
save 900 1
save 300 10
save 60 10000

# 配置含义 #
900 秒内，如果超过 1 个key被修改，则发起快照保存;
300 秒内，如果超过 10 个key被修改，则发起快照保存;
60 秒内，如果 1万 个key被修改，则发起快照保存。
```

RDB方式存储的数据会在 `dump.rdb` 文件中（在哪个目录启动 redis 服务端，该文件就会在对应目录下生成），该文件不能查看。

`如需备份，对 Redis 操作完成之后，只需拷贝该文件即可。`（Redis服务端启动时会自动加载该文件）



#### 2.2 AOF

AOF，Append Of File。默认是不开启的，需要手动开启，同样是在 redis.conf 文件中开启，如下：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200707195908.png)

配置文件中的 `appendonly 修改为 yes`，开启AOF持久化。开启后，启动redis服务端，发现多了一个`appendonly.aof` 文件。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200707195934.png)

之后任何的操作都会保存在 appendonly.aof 文件中，可以进行 cat 查看(保存了 redis 客户端执行过的命令)，Redis 启动时会将 appendonly.aof 文件中的内容执行一遍。

> 如果 AOF 和 RDB 同时开启，系统会`默认读取 AOF 的数据`。



#### 2.3 RDB优缺

**优点**：

如果要进行`大规模数据恢复，RDB 要比 AOF 方式恢复速度要快`。

RDB 是一个非常紧凑( compact )的文件,它保存了某个时间点的数据集，非常适合用作备份，同时也非常适合用作灾难性恢复，它只有一个文件，内容紧凑，通过备份原文件到本机外的其他主机上，一旦本机发生宕机，就能将备份文件复制到 redis 安装目录下，通过启用服务就能完成数据的恢复。

**缺点**：

RDB这种持久化方式`不太适应对数据完整性要求严格的情况`，因为，尽管可以用过修改快照实现持久化的频率，但是要持久化的数据是一段时间内的整个数据集的状态，如果在还没有触发快照时，本机就宕机了，那么对数据库所做的写操作就随之而消失了并没有持久化本地 dump.rdb 文件中。

 

#### 2.4 AOF优缺

**优点**：

AOF appendfsync 有着`多种持久化策略`：

* `always` : **每修改同步**，每一次发生数据变更都会持久化到磁盘上，性能较差，但数据完整性较好。

* `everysec` : **每秒同步**，每秒内记录操作，异步操作，如果一秒内宕机，有数据丢失。

* `no` : **不同步**。

![image-20200707200415023](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200707200416.png)

AOF 文件是一个只进行追加操作的日志文件，对文件写入不需要进行 seek，即使在追加的过程中，写入了不完整的命令（例如：磁盘已满），可以使用 redis-check-aof 工具可以修复这种问题。

Redis 可以在 AOF 文件变得过大时，会自动地在后台对 AOF 进行重写。重写后的新的 AOF 文件包含了恢复当前数据集所需的最小命令集合。整个重写操作是绝对安全的，因为 Redis 在创建 AOF 文件的过程中，会继续将命令追加到现有的 AOF 文件中，即使在重写的过程中发生宕机，现有的 AOF 文件也不会丢失。一旦新 AOF 文件创建完毕，Redis 就会从旧的 AOF 文件切换到新的 AOF 文件，并对新的 AOF 文件进行追加操作。

**缺点**

对于`相同的数据集，AOF文件要比 RDB 文件大`。

根据所使用的持久化策略来说，AOF的速度要慢于RDB。一般情况下，每秒同步策略效果较好。不使用同步策略的情况下，AOF与RDB速度一样快。



> 一般为了安全，RDB 和 AOF 两种持久化方式都会打开，并且每台 redis 服务器都对生成的数据库文件做备份（dump.rdb 和 appendonly.aof）。



### 3. Redis 订阅

`subscribe channel  订阅频道`   例如：subscribe cctv5

`subscribe channel*  批量订阅频道` 例如：subscribe cctv* 表示订阅以cctv开头的频道

`publish channel content  在指定频道中发布的内容` 例如：publish cctv5 basketball

同时打开两个客户端，一个订阅频道，一个在频道中发布内容，订阅频道的客户端会接收到消息。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200707201004.png)

