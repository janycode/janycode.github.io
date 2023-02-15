---
title: 01-Docker 安装
date: 2018-5-23 22:18:03
tags:
- Docker
- 安装
- 配置
categories: 
- 12_项目管理
- 04_Docker
---

![docker](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200711093637.jpg)

参考资料：http://c.biancheng.net/docker/



### 1. Docker 由来

* 我本地运行没问题啊：由于环境不一致导致相同的程序运行结果不一致
* 哪个哥们又写死循环了，怎么这么卡：在多用户环境下会因为其他用户的操作失误影响到自己编写的程序
* 淘宝双11用户量暴增：需要很多的运维人员增加部署的服务器，运维成本过高的问题
* 一门技术的环境要先安装搭建啊：安装软件，安装依赖环境，繁琐的操作



Docker 作者：所罗门

![image-20200711094017220](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200711094018.png)



Docker 的思想：

* 集装箱：会将所有需要的内容放到不同的集装箱中，谁需要这些环境就直接拿到集装箱即可
* 标准化：运输标准化、命令标准化、提供 rest 的 API
* 隔离性：运行集装箱中的内容时，会在 linux 内核中单独开辟一片空间，不影响其他程序
* **仓库（Repository）**：仓库可看成一个代码控制中心，用来保存镜像。
* **镜像（Image）**：Docker 镜像（Image），就相当于是一个 root 文件系统。比如官方镜像 ubuntu:16.04 就包含了完整的一套 Ubuntu16.04 最小系统的 root 文件系统。
* **容器（Container）**：镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的类和实例一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。



### 2. Docker 安装

安装方法(选择 CentOS)：https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors

#### 2.1 安装 Docker 客户端

> 安装前准备：
>
> * 禁用 PackageKit 的后台自启，因为它会占用锁定 yum 的 pid 导致无法安装其他。
>     \# `vi /etc/yum/pluginconf.d/langpacks.conf`
>
>     ```sh
>     [main] 
>     # enabled=1
>     enabled=0
>     ```

```sh
# step 1: 安装必要的一些系统工具
sudo yum install -y yum-utils device-mapper-persistent-data lvm2

# Step 2: 添加软件源信息
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# Step 3: 更新并安装 Docker-CE
sudo yum makecache fast
sudo yum -y install docker-ce

# Step 4: 开启Docker服务
sudo service docker start

注意：其他注意事项在下面的注释中
# 官方软件源默认启用了最新的软件，您可以通过编辑软件源的方式获取各个版本的软件包。例如官方并没有将测试版本的软件源置为可用，你可以通过以下方式开启。同理可以开启各种测试版本等。
# vim /etc/yum.repos.d/docker-ce.repo
#   将 [docker-ce-test] 下方的 enabled=0 修改为 enabled=1
#
# 安装指定版本的Docker-CE:
# Step 1: 查找Docker-CE的版本:
# yum list docker-ce.x86_64 --showduplicates | sort -r
#   Loading mirror speeds from cached hostfile
#   Loaded plugins: branch, fastestmirror, langpacks
#   docker-ce.x86_64            17.03.1.ce-1.el7.centos            docker-ce-stable
#   docker-ce.x86_64            17.03.1.ce-1.el7.centos            @docker-ce-stable
#   docker-ce.x86_64            17.03.0.ce-1.el7.centos            docker-ce-stable
#   Available Packages
# Step2 : 安装指定版本的Docker-CE: (VERSION 例如上面的 17.03.0.ce.1-1.el7.centos)
# sudo yum -y install docker-ce-[VERSION]
# 注意：在某些版本之后，docker-ce安装出现了其他依赖包，如果安装失败的话请关注错误信息。例如 docker-ce 17.03 之后，需要先安装 docker-ce-selinux。
# yum list docker-ce-selinux- --showduplicates | sort -r
# sudo yum -y install docker-ce-selinux-[VERSION]

# 通过经典网络、VPC网络内网安装时，用以下命令替换Step 2中的命令
# 经典网络：
# sudo yum-config-manager --add-repo http://mirrors.aliyuncs.com/docker-ce/linux/centos/docker-ce.repo
# VPC网络：
# sudo yum-config-manager --add-repo http://mirrors.could.aliyuncs.com/docker-ce/linux/centos/docker-ce.repo
```



#### 2.2 配置镜像加速器

针对 Docker 客户端版本大于 1.10.0 的用户

您可以通过修改 daemon 配置文件 `/etc/docker/daemon.json` 来使用加速器

```sh
sudo mkdir -p /etc/docker

sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://7cptp8wl.mirror.aliyuncs.com"]
}
EOF

sudo systemctl daemon-reload

sudo systemctl restart docker
```

#### 2.3 启动 Docker 并测试

```sh
# 查看是否安装成功
docker -v

# 启动 docker 服务
systemctl start docker

# 查看 docker 状态
systemctl status docker

# 设置开机自动启动
systemctl enable docker
```



### 3. 阿里云 Docker 安装

```sh
#1. 下载docker-ce的repo
curl https://download.docker.com/linux/centos/docker-ce.repo -o /etc/yum.repos.d/docker-ce.repo

#2. 安装依赖
yum install https://download.docker.com/linux/fedora/30/x86_64/stable/Packages/containerd.io-1.2.6-3.3.fc30.x86_64.rpm

#3. 安装docker-ce
yum install docker-ce

#4. 启动docker
systemctl start docker
```

