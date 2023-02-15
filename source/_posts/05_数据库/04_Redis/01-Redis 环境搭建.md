---
title: 01-Redis 环境搭建
date: 2017-6-20 23:04:05
tags:
- Redis
- 配置
categories: 
- 05_数据库
- 03_Redis
---

![image-20200815230439632](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815230440.png)

官网教程：https://www.redis.net.cn/tutorial/3501.html

菜鸟教程：https://www.runoob.com/redis/redis-tutorial.html



### 1. Redis 简介

关系型数据库 与 noSQL 数据库(键值对存储)

从性能上而言，nosql数据库要优于关系型数据库，从安全性上而言关系型数据库要优于nosql数据库，所以在实际开发中一个项目中 `nosql 和关系型数据库会一起使用，达到性能和安全性的双保证`。

Redis 是一个 `key-value` 存储系统，和 Memcached 类似，它支持存储的 value 类型相对更多，包括 **`string`** (字符串)、**`list`** (链表)、**`set`** (集合)、**`zset`** (sorted set--有序集合)和**`hash`**（哈希类型）。

为了保证效率，数据都是缓存在内存中，因为是纯内存操作，Redis 是单线程的，性能非常出色，每秒可以处理超过 10 万次读写操作，是已知`综合性能最快`的 Key-Value DB。



官网：https://redis.io

下载：http://download.redis.io/releases

中文官网：https://www.redis.net.cn/



### 2. Redis 安装

* 下载：`wget http://download.redis.io/releases/redis-5.0.4.tar.gz`

#### 2.1 CentOS 虚拟机

* 把下载好的 redis-5.0.4.tar.gz 安装包拷贝到当前虚拟机 root 目录下，解压到/usr/local下
    [root@localhost ~]# `tar -zxvf redis-5.0.4.tar.gz -C /usr/local`

 

* 编译的 c 环境
    [root@localhost ~]# `yum install gcc-c++`

 

* 进入 redis-5.0.4 目录，使用 make 命令编译 redis（若报错，先make distclean，再make）
    [root@localhost redis-5.0.4]# `cd /usr/local/redis-5.0.4/`
    [root@localhost redis-5.0.4]# `make`

 

* 使用如下命令安装（安装后会出现 bin 目录）
    [root@localhost redis-5.0.4]# `make PREFIX=/usr/local/redis-5.0.4 install`

 

* 启动 redis 服务端（前台启动）
    [root@localhost redis-5.0.4]# `cd bin`
    [root@localhost bin]# `./redis-server`

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200706195758.png)



#### 2.2 CentOS 阿里云

步骤同虚拟机方式，只需要 打开 `安全组` 中的 `6379` 端口即可。



### 3. Redis 配置

#### 3.1 后台启动

* 切换到 redis-5.0.4/bin 目录下，把上级目录下的 redis.conf 文件拷贝到当前目录下
    [root@localhost redis-5.0.4/bin]# `cp ../redis.conf .`

 

* 切换到bin目录下，修改redis.conf文件
    [root@localhost bin]# `vim redis.conf`

 

* 将 redis.conf 文件中的 daemonize 的值从 no 修改成 yes 表示后台启动。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200706195846.png)

* 启动 redis 服务端（后台启动）
    [root@localhost bin]# `./redis-server redis.conf`

 

* 查看是否启动成功
    [root@localhost bin]# `ps -ef | grep redis`

 

* 启动客户端
    [root@localhost bin]# `./redis-cli`

 

* 存取数据进行测试

    ```
    127.0.0.1:6379> set name jack
    OK
    127.0.0.1:6379> get name
    "jack"
    ```



#### 3.2 性能测试

redis-benchmark官方自带的性能测试工具：

[root@localhost bin]# `./redis-benchmark -h 127.0.0.1 -p 6379 -c 100 -n 100000`

![image-20200706200141575](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200706200142.png)



### 4. Redis 图形化工具

Redis 中默认有 16 个库，可以在不同的库中存储数据，默认使用 0 号库存储数据，使用 select 0-15 可以选择不同的库。 

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200707201304.png)

 

安装之后，输入IP地址登录即可看到如下界面：（连接前需要`注释掉 bind 127.0.0.1`）

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200707201322.png)



