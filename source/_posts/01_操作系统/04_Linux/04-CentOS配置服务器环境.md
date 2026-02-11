---
title: 04-CentOS配置服务器环境
date: 2016-4-29 21:42:42
tags:
- CentOS
- JDK
- Linux
- Tomcat
- MySQL
categories: 
- 01_操作系统
- 04_Linux
---

 

### 1. JDK 安装

#### 1.1 删除默认 jdk

* 查看默认安装的 jdk

[root@localhost]# `rpm -qa | grep java`

java-1.8.0-openjdk-1.8.0.102-4.b14.el7.x86_64

javapackages-tools-3.4.1-11.el7.noarch

java-1.8.0-openjdk-headless-1.8.0.102-4.b14.el7.x86_64

tzdata-java-2016g-2.el7.noarch

python-javapackages-3.4.1-11.el7.noarch

java-1.7.0-openjdk-headless-1.7.0.111-2.6.7.8.el7.x86_64

java-1.7.0-openjdk-1.7.0.111-2.6.7.8.el7.x86_64



* 删除 jdk

需要将 opjdk 都删除（1.7和1.8各有两个），后缀为 .noarch 的文件可以不用删除

[root@localhost]# `rpm -e --nodeps java-1.8.0-openjdk-1.8.0.102-4.b14.el7.x86_64`

[root@localhost]# `rpm -e --nodeps java-1.8.0-openjdk-headless-1.8.0.102-4.b14.el7.x86_64`

[root@localhost]# `rpm -e --nodeps java-1.7.0-openjdk-headless-1.7.0.111-2.6.7.8.el7.x86_64`

[root@localhost]# `rpm -e --nodeps java-1.7.0-openjdk-1.7.0.111-2.6.7.8.el7.x86_64`



* 查看 jdk 是否已删除

[root@localhost]# `java -version`

-bash: /usr/bin/java: 没有那个文件或目录



#### 1.2 安装新的 jdk

* 解压 tar 包

把下载好的 jdk 安装包拷贝到当前虚拟机 root 目录下，一般解压到 /usr/local 目录下

[root@localhost ~]# `tar -zxvf jdk-8u151-linux-x64.tar.gz -C /usr/local`



* 配置环境变量

[root@localhost ~]# `vim /etc/profile`

在该文件中添加如下信息：

```properties
JAVA_HOME=/usr/local/jdk1.8.0_151
CLASSPATH=.:$JAVA_HOME/lib.tools.jar
PATH=$JAVA_HOME/bin:$PATH
export JAVA_HOME CLASSPATH PATH
```



* 立即生效

[root@localhost ~]# `source /etc/profile`（如果不行可重启虚拟机再次尝试）



* 再次测试

[root@localhost ~]# `java -version`

java version "1.8.0_151"

Java(TM) SE Runtime Environment (build 1.8.0_151-b12)

Java HotSpot(TM) 64-Bit Server VM (build 25.151-b12, mixed mode)

 

### 2. Tomcat 安装

* 解压 tar 包

把下载好的 tomcat 安装包拷贝到当前虚拟机 root 目录下，一般解压到 /usr/local 目录下

[root@localhost ~]# `tar -zxvf apache-tomcat-8.5.23.tar.gz -C /usr/local`



* 在启动 tomcat 之前需关闭防火墙

[root@localhost ~]# `systemctl stop firewalld.service`



* 切换到 tomcat 的 bin 目录

[root@localhost ~]# `cd /usr/local/apache-tomcat-8.5.23/bin/`



* 启动 tomcat （默认**后台**启动）

[root@localhost bin]# `./startup.sh `



* 关闭 tomcat

[root@localhost bin]# `./shutdown.sh `

 

### 3. MySQL 安装

CentOS 中默认安装的是 MariaDB，安装完 MySQL 之后会覆盖 MariaDB，由于安装 MySQL 需要添加很多依赖关系，所以这里使用 yum 安装。

* 下载 MySQL 源安装包

[root@localhost ~]# `wget -i -c http://dev.mysql.com/get/mysql57-community-release-el7-10.noarch.rpm`

2019-10-17 14:37:41 (230 KB/s) - 已保存 “mysql57-community-release-el7-10.noarch.rpm” 

[25548/25548])

-c: 没有那个文件或目录

在 -c 中找不到 URL。

FINISHED --2019-10-17 14:37:41--

Total wall clock time: 7.4s

Downloaded: 1 files, 25K in 0.1s (230 KB/s)



* 安装 MySQL 源

[root@localhost ~]# `yum -y install mysql57-community-release-el7-10.noarch.rpm`

Running transaction

 正在安装  : mysql57-community-release-el7-10.noarch              1/1 

 验证中   : mysql57-community-release-el7-10.noarch              1/1 

已安装:

mysql57-community-release.noarch 0:el7-10                      

完毕！



* 安装 MySQL

> 阿里云 CentOS 服务器中配置时需要先执行：`yum module disable mysql`
>
> 再继续...

[root@localhost ~]# `yum -y install mysql-community-server`

作为依赖被安装:

 mysql-community-client.x86_64 0:5.7.28-1.el7  mysql-community-common.x86_64 0:5.7.28-1.el7 

作为依赖被升级:

 openssl.x86_64 1:1.0.2k-19.el7       openssl-libs.x86_64 1:1.0.2k-19.el7       

 postfix.x86_64 2:2.10.1-7.el7        

替代:

 mariadb-libs.x86_64 1:5.5.52-1.el7                             

完毕！



* 配置 MySQL

[root@localhost ~]# `vim /etc/my.cnf`

在/etc/my.cnf的[mysqld]中增加如下内容：

```properties
#不添加则在设置MySQL新密码时会错
validate_password=off
#用于设置MySQL的字符集
character_set_server=utf8
#用于设置MySQL的远程连接
skip-name-resolve
```

> 【注意事项】
>
> 先不带注释复制后两行配置到 my.cnf，启动 mysql，检查是否OK，再放第一句，重启服务。

 

* 启动 MySQL

[root@localhost ~]# `systemctl start  mysqld.service`

 

* 查看MySQL运行状态

[root@localhost ~]# `systemctl status mysqld.service`

mysqld.service - MySQL Server

Loaded: loaded (/usr/lib/systemd/system/mysqld.service; enabled; vendor preset: disabled)

Active: active (running) since 四 2019-10-17 15:00:59 CST; 26s ago

 

* 设置MySQL自启动

[root@localhost ~]# `systemctl enable mysqld`

 

此时 MySQL 已经开始正常运行，不过要想进入 MySQL 还得先找出此时 root 用户的密码，通过如下命令可以在日志文件中找出密码：

[root@localhost ~]# `grep "generate" /var/log/mysqld.log`

2019-10-17T07:00:52.740835Z 1 [Note] A temporary password is generated for root@localhost: `l0hN)kEXugYv` （把密码复制一份）

2019-10-17T07:14:54.867706Z 3 [Note] Access denied for user 'root'@'localhost' (using password: YES)

 

* 登录 MySQL

[root@localhost ~]# `mysql -uroot -p`

粘贴密码：`l0hN)kEXugYv` 进入到MySQL

输入初始密码，此时不能做任何事情，因为 MySQL 默认必须修改密码之后才能操作数据库：

mysql> `ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';`

 

* 设置 MySQL 可以远程访问

mysql>`grant all privileges on *.* to 'root'@'%' identified by '123456' with grant option;`

此时可以使用的数据库客户端工具进行远程连接，如果连接不上，重启MySQL后再测试

测试成功后，退出MySQL

mysql> `exit;`

Bye



* 卸载 MySQL 自动更新功能

卸载 Yum Repository 中的 MySQL 自动更新功能，否则每次yum操作都会自动更新

[root@localhost ~]# `yum -y remove mysql57-community-release-el7-10.noarch`

已加载插件：fastestmirror, langpacks

正在解决依赖关系

--> 正在检查事务

---> 软件包 mysql57-community-release.noarch.0.el7-10 将被 删除

--> 解决依赖关系完成

依赖关系解决

=========================================================================================

 Package              架构      版本      源         大小

=========================================================================================

正在删除:

 mysql57-community-release     noarch     el7-10     installed      30 k

事务概要

=========================================================================================

移除 1 软件包

安装大小：30 k

Downloading packages:

Running transaction check

Running transaction test

Transaction test succeeded

Running transaction

 正在删除  : mysql57-community-release-el7-10.noarch                1/1 

 验证中   : mysql57-community-release-el7-10.noarch                1/1 

删除:

 mysql57-community-release.noarch 0:el7-10                        

完毕！

> 测试远程连接，连接未成功，需要再次关闭防火墙，重启 MySQL
>
> 关闭防火墙：`systemctl stop firewalld.service`



### 4. 阿里云 web 环境配置

整体步骤参照 1.2.3. 点，安装 JDK + Tomcat + MySQL。(拍快照，以便后续出错恢复)

然后为阿里云服务器中的 CentOS 当前实例配置 `安全组` 即可。

打开 tomcat(8080)、mysql(3306)、redis(6379) 等端口，针对本实例打开：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200706192018.png)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200706192029.png)

![image-20200706192325233](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200706192326.png)