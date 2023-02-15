---
title: 05-Redis 主从复制+哨兵模式
date: 2017-6-20 23:04:05
tags:
- Redis
- 哨兵
categories: 
- 05_数据库
- 03_Redis
---

![image-20200815230439632](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815230440.png)

官网教程：https://www.redis.net.cn/tutorial/3515.html

### 1. Redis 主从复制

主从复制是指将一台 Redis 服务器的数据，复制到其它的 Redis 服务器。

前者称为主节点(`master`)，后者称为从节点(`slave`)；数据的复制是单向的，只能由主节点到从节点。

默认情况下，每台 Redis 服务器都是主节点，且一个主节点可以有多个从节点（或没有从节点），但一个从节点只能有一个主节点。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200707201558.png)

主从复制的作用：

1. `数据冗余`：主从复制实现了数据的热备份，是持久化之外的一种数据冗余方式

2. `故障恢复`：当主节点出现问题时，可以由从节点提供服务，实现快速的故障恢复，但实际上是一种服务的冗余

3. `负载均衡`：在主从复制的基础上，配合读写分离，可以由主节点提供写服务，由从节点提供读服务（即写Redis数据时应用连接主节点，读Redis数据时应用连接从节点），分担服务器负载；尤其是在写少读多的场景下，通过多个从节点分担读负载，可以大大提高Redis服务器的并发量

4. `高可用`：主从复制还是**哨兵**和**集群**能够实施的基础，因此说主从复制是Redis高可用的基础

 

#### 1.1 配置步骤

三台 CentOS 虚拟机：`192.168.247.128`、`192.168.247.129`、`192.168.247.130`

![image-20200707205023182](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200707205024.png)

XShell 同时开启三台虚拟机的 3 个 SSH 窗口：

![image-20200707205849119](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200707205851.png)

1. 查看当前库的信息：
    (ip后缀128)[ /usr/local/redis-5.0.4/bin]# `./redis-server`
    (ip后缀128 新 SSH)[ /usr/local/redis-5.0.4/bin]# `./redis-cli`
    (ip后缀128) 127.0.0.1:6379> `info replication`  (默认 server 启动为单线程主机角色)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200707201907.png)

2. 拷贝配置并修改配置：
    (ip后缀128)[ /usr/local/redis-5.0.4/bin]# `cp ../redis.conf .`
    修改配置为：

    ```sh
    #bind 127.0.0.1    # 注释掉 ip 绑定
    protected-mode no  # 关闭保护模式
    daemonize yes      # 打开后台启动
    ```

    (ip后缀129和130)[ /usr/local/redis-5.0.4/bin]# `cp ../redis.conf .`
    两台均修改配置为：

    ```sh
    #bind 127.0.0.1    # 注释掉 ip 绑定
    protected-mode no  # 关闭保护模式
    daemonize yes      # 打开后台启动
    replicaof 192.168.247.128 6379  # 设置主机 ip 和 port
    ```

3. 启动服务器：
    (3台)[ /usr/local/redis-5.0.4/bin]# `./redis-server redis.conf`

    (3台)[ /usr/local/redis-5.0.4/bin]# `./redis-cli` （本地连接开启的 redis-server 查看主从信息）
    **128主机**：127.0.0.1:6379> `info replication`

    ```sh
    # Replication
    role:master  # 角色：主机
    connected_slaves:2
    slave0:ip=192.168.247.129,port=6379,state=online,offset=56,lag=0  # 从机0
    slave1:ip=192.168.247.130,port=6379,state=online,offset=56,lag=1  # 从机1
    master_replid:647d2d5e7e065a2be71fb0181a78aa74cdbbc438
    master_replid2:0000000000000000000000000000000000000000
    master_repl_offset:56
    second_repl_offset:-1
    repl_backlog_active:1
    repl_backlog_size:1048576
    repl_backlog_first_byte_offset:1
    repl_backlog_histlen:56
    ```

    **129和130从机**：127.0.0.1:6379> `info replication`

    ```sh
    # Replication
    role:slave  # 角色：从机
    master_host:192.168.247.128  # 主机地址信息
    master_port:6379
    master_link_status:up  # 主机连接状态 up(开启)
    master_last_io_seconds_ago:7
    master_sync_in_progress:0
    slave_repl_offset:196
    slave_priority:100
    slave_read_only:1
    connected_slaves:0
    master_replid:647d2d5e7e065a2be71fb0181a78aa74cdbbc438
    master_replid2:0000000000000000000000000000000000000000
    master_repl_offset:196
    second_repl_offset:-1
    repl_backlog_active:1
    repl_backlog_size:1048576
    repl_backlog_first_byte_offset:1
    repl_backlog_histlen:196
    ```

4. 测试主从复制：
    **128主机**：127.0.0.1:6379> `set key1 hello,everyone!`

    ```sh
    OK
    ```

    **129和130从机**：127.0.0.1:6379> `get key1`

    ```sh
    "hello,everyone!"
    ```

    

即使主机断开链接（127.0.0.1:6379>`shutdown`），从机仍然可以连接到主机，如果使用的是命令行配置的从机，从机一旦断开链接后，就会变回主机了，如果再次变回从机，仍旧可以获取主机中的值。

如果主机断开链接，从机可以使用命令：127.0.0.1:6380> `slaveof no one` 使自己成为主机。



#### 1.2 主从复制原理

Slave 启动成功连接到 master 后会发送一个 sync 同步命令，Master 接到命令后，会启动后台的存盘进程，同时收集所有接收到的用于修改数据集命令，在后台进程执行完毕后，master 将传送整个数据文件到 salve，并完成一次完整的同步。

`全量复制`：salve服务在接收到数据库文件数据后，将其存盘并加载到内存中

`增量复制`：master继续将新的所有收集到的修改命令依次传递给salve，完成同步



### 2. Redis 哨兵模式

#### 2.1 高可用

当主服务器宕机后，并且我们并没有及时发现，这时候就可能会出现数据丢失或程序无法运行。此时，redis 的哨兵模式就派上用场了，可以用它`来做 redis 的高可用`。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200707211159.png)

功能作用：

1. `监控`(monitoring)：Sentinel 会不断地检查你的主服务器和从服务器是否运作正常。

2. `提醒`(Notifation)：当被监控的某个 Redis 服务器出现问题时， Sentinel 可以通过 API 向管理员或者其他应用程序发送通知。

3. `自动故障转移`(Automatic failover)：当一个主服务器不能正常工作时， Sentinel 会开始一次自动故障迁移操作，它会将失效主服务器的其中一个从服务器升级为新的主服务器， 并让失效主服务器的其他从服务器改为复制新的主服务器； 当客户端试图连接失效的主服务器时， 集群也会向客户端返回新主服务器的地址， 使得集群可以使用新主服务器代替失效服务器。

 

#### 2.1 配置步骤

1. 需配置好主从关系的 redis 服务器，如本人配置3台 CentOS （ip后缀 128-主、129-从、130-从）

2. 从机创建哨兵配置文件
    (ip后缀129和130)[ /usr/local/redis-5.0.4/bin]# `cp ../sentinel.conf .`
    均修改该哨兵配置文件 sentinel.conf：

    ```sh
    sentinel monitor mymaster 192.168.247.128 6379 1
    sentinel down-after-milliseconds mymaster 5000
    sentinel failover-timeout mymaster 900000
    sentinel parallel-syncs mymaster 2
    ```

    > sentinel monitor mymaster 192.168.247.128 6379 1
    >
    > ：哨兵监视器(名为 mymaster,ip,port,1表示主机挂了 slave 会投票选举成为主机)
    >
    > sentinel down-after-milliseconds mymaster 5000
    >
    > ：主机 down 掉后经过 5s 后哨兵开始投票选举谁成为主机
    >
    > sentinel failover-timeout mymaster 900000
    >
    > ：当一个slave从一个错误的master那里同步数据的计算时间为 900s
    >
    > sentinel parallel-syncs mymaster 2
    >
    > ：指定在发生failover主备切换时最多可以有多少个slave同时对新的master进行数据同步
    >
    > Redis 的哨兵配置参数详解：https://simple.blog.csdn.net/article/details/107208175

3. 从机启动哨兵监控程序
    (ip后缀129和130)[ /usr/local/redis-5.0.4/bin]# `./redis-server sentinel.conf --sentinel &`
    (ip后缀129 SSH)[ /usr/local/redis-5.0.4/bin]# `./redis-cli -h 192.168.247.129 -p 26379 info sentinel` (此命令用于查看哨兵相关信息)
    (ip后缀130 SSH)[ /usr/local/redis-5.0.4/bin]# `./redis-cli -h 192.168.247.130 -p 26379 info sentinel` (此命令用于查看哨兵相关信息)

![image-20200707212354803](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200707212356.png)

![image-20200707212559944](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200707212600.png)

4. 主机模拟宕机，查看从机被投票成为新的主机
    **128主机**：127.0.0.1:6379> `shutdown`
    not connected>
    129从机与130从机 哨兵 日志信息：`已自动投票将 130 ip的设置为主机，剩余从机1台即 129 ip`

![image-20200707212830057](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200707212831.png)

![image-20200707213018917](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200707213019.png)

> 【注意事项】
>
> 此时如果恢复 ip 为 128 的宕机的原主机，启动 redis-server 后，会自动成为 从机（只读）；
>
> 130 的被投票选为主机的身份不会发生变化，可读可写；
>
> 129 依然为从机。

如下图：

![image-20200707213535994](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200707213537.png)



#### 2.3 哨兵模式优缺点

**优点**

1. 哨兵集群模式是基于主从模式的，所有主从的优点，哨兵模式同样具有。

2. 主从可以切换，故障可以转移，系统可用性更好。

3. 哨兵模式是主从模式的升级，系统更健壮，可用性更高。

**缺点**

1. Redis较难支持在线扩容，在集群容量达到上限时在线扩容会变得很复杂。

2. 实现哨兵模式的配置也不简单，甚至可以说有些繁琐。