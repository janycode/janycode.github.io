---
title: 02-Docker Dockerfile和镜像部署
date: 2018-5-23 22:18:03
tags:
- Docker
- Dockerfile
categories: 
- 12_项目管理
- 04_Docker
---

![docker](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200711093637.jpg)

参考资料：http://c.biancheng.net/docker/

## 一、Dockerfile

容器化：将应用打包成容器，再容器中运行应用程序的过程。

`Dockerfile`：是一个文本文件

步骤：

1. `创建`一个 Dockerfile
2. 使用 Dockerfile `构建`镜像
3. 使用镜像创建和`运行`容器

最简单的例子：

index.js 

```js
console.log("这是docker中运行js的输出内容")
```

Dockerfile - 文件无扩展名（vscode可以安装 `Docker` 扩展）

```dockerfile
FROM node:16-alpine        #使用node版本，如16版本，也可以使用其他版本，改数字即可
COPY index.js /index.js    #复制 index.js 文件到镜像的根目录下
CMD node /index.js         #执行命令
```

```sh
#[前置]docker中安装 node 对应版本
docker pull node:16-alpine
#镜像构建，基于 . 当前目录
docker build -t hello-docker .
#查看镜像，默认版本是 latest
docker images
#运行镜像
docker run hello-docker
#可以将镜像上传到 dockerhub 上，任何人都可以 docker pull
```

![image-20260221112026685](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260221112028118.png)

![image-20260221112045821](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260221112047058.png)



## 二、镜像部署

### 1. 镜像操作命令

- Docker官方的中央仓库:这个仓库是镜像最全的，但是下载速度较慢。
  - https://hub.docker.com/
- 国内的镜像网站: 网易蜂巢，daoCloud 等，下载速度快， 但是镜像相对不全。
  - https://c.163yun.com/hub#/home
  - http://hub.daocloud.io/ (★)

搜索 --> 详情中找到 [版本] --> 选择版本[拉取]



● 拉取镜像

```sh
docker pull 镜像名称[:tag]
# eg: docker pull daocloud.io/library/tomcat:9.0.0-jre8
```

● 查看本地全部镜像

```sh
docker images
# eg: 
# REPOSITORY                   TAG                 IMAGE ID            CREATED             SIZE
# daocloud.io/library/tomcat   9.0.0-jre8          273c6a7e33d5        2 years ago         566MB
```

● 删除本地镜像

```sh
docker rmi 镜像id
# 镜像id，即 IMAGE ID，也可简写为前几位，eg: docker rmi 273
# 注意事项: 删除镜像前需要保证镜像内没有正在运行的容器。
```

● 镜像的导入导出

```sh
# 导出本地镜像（在路径中为导出镜像命名文件名）
docker save -o 导出路径 镜像id
# eg: docker save -o ./tomcat9.0.tar 273c6a7e33d5

# 导入本地镜像（默认导入后镜像名称为空）
docker load -i 镜像文件
# eg: docker load -i ./tomcat9.0.tar

# 修改镜像名称
docker tag 镜像id 新镜像名称:版本
# eg: docker tag 273c6a7e33d5 tomcat9.0-jre8:9.0
```



### 2. 容器操作命令

> 容器id 均可 替换为 容器 NAMES

● 运行容器

```sh
# 简单操作（前台运行）
docker run 镜像id
# eg: docker run 273

# 常规操作（后台运行）常用参数
docker run -d -p 宿主机端口:容器端口 --name 起的名字 镜像id
# eg: docker run -d -p 8888:8080 --name newTomcat 273c6a7e33d5
```

> 注意事项：
>
> * 运行容器需要指定具体的镜像，如果镜像不存在，会直接下载。
> * WARNING: IPv4 forwarding is disabled. Networking will not work.
>     \# `echo "net.ipv4.ip_forward=1" >>/usr/lib/sysctl.d/00-system.conf`
>     \# `systemctl restart network && systemctl restart docker`
>     再次 docker run ... 即可解决。



● 查看、重启、停止、启动、删除容器

```sh
# 查看所有容器
docker ps [-qa]
# -q: 只查看容器的id
# -a: 查看全部的容器，包括没有运行的
# 常用: docker ps -a
# CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS                    NAMES
# 18b96c60c2a9        273c6a7e33d5        "catalina.sh run"   5 seconds ago       Up 4 seconds        0.0.0.0:8888->8080/tcp   newTomcat
# 容器id，即 CONTAINER ID

# 重启指定容器
docker restart 容器id
# eg: docker restart 18b

# 停止指定容器
docker stop 容器id
# eg: docker stop 18b

# 停止全部容器
docker stop $(docker ps -qa)

# 启动指定容器
docker start 容器id
# eg: docker start 18b

# 删除指定容器（必须先 stop 容器 或 kill 掉对应容器启动的进程）
docker rm 容器名称
# eg: docker stop 18b && docker rm newTomcat
# eg: kill -9 进程ID && docker rm newTomcat

# 删除全部容器
docker rm $(docker ps -qa)
```



● 查看容器日志

```sh
docker logs -f 容器ID
docker logs -f 容器NAMES
# -f: 可以滚动查看日志的最后几行
```



● 进入容器内部

```sh
docker exec -it 容器ID bash
docker exec -it 容器NAMES bash
```



● 复制内容到容器

```sh
docker cp 文件名称 容器id:容器内部路径
# eg: docker cp LayUIDemo.war ade52d200537:/usr/local/tomcat/webapps/
# 宿主机(非虚拟机)浏览器访问 http://192.168.247.128:8888/LayUIDemo/form.html
```



● 映射目录到容器（代替频繁的拷贝-会直接侵入到tomcat容器中）

```sh
# 如映射本地 war 目录到 docker 中的 tomcat/webapps 目录
docker run -d -p 8080:8080 -v /root/war:/usr/local/tomcat/webapps --name tomcat tomcat:9.0
# 在 war/ 目录下放置任何文件会映射到 webapps/ 下
```



### 3. 部署 SSM 工程

```sh
docker images
# REPOSITORY                   TAG                 IMAGE ID            CREATED             SIZE
# daocloud.io/library/tomcat   9.0.0-jre8          273c6a7e33d5        2 years ago         566MB
# daocloud.io/library/mysql    5.7.4               aa5364eb3d85        5 years ago         252MB
```

① 运行 tomcat 容器

```sh
docker run -d -p 8080:8080 --name tomcat 273c6a7e33d5
```

② 运行 mysql 容器

```sh
docker run -d -p 3306:3306 --name mysql -e MYSQL_ROOT_PASSWORD=123456 aa5364eb3d85
```

③ 部署 SSM 工程

* 修改 ssm 工程环境，设置为 Linux 中的 Docker 容器的信息

    ```sh
    # 注意1：修改位置，JDBC 配置中的虚拟机IP，serverTimezone 兼容 mysql 5.x 和 8.x 版本
    jdbc.url=jdbc:mysql://192.168.247.130:3306/数据库名?serverTimezone=Asia/Shanghai
    # 注意2：在 tomcat 的 webapps 目录部署工程后，所有的资源路径都要带上"项目名称"，如 ajax 的 url
    url: "/项目名称/music/findByPage",
    ```

* 通过 Maven 的 package 重新打成 war 包

* 将 windows 下的 war 包复制到 linux 中

* 通过 docker 命令将宿主机的 war 包复制到容器内部

    ```sh
    # 注意：如果重新导入新的 war 包时，需要将容器停止后，再启动，否则 war 包修改不生效
    docker exec -it 容器id bash
    # 删除上一个已被 tomcat 解压的工程和 war 包
    rm webapps/项目名*
    # 停掉 tomcat 容器（本质是将 tomcat 进程杀掉）
    docker stop tomcat
    # 复制 war 包到 tomcat 的对应路径
    docker cp LayUIDemo.war 容器ID:/usr/local/tomcat/webapps/
    # 启动 tomcat 容器（启动 tomcat 进程）
    docker start tomcat
    ```

* 宿主机 windows 测试访问 ssm 工程



### 4. Tomcat+Mysql+Redis+Nginx

```sh
# 通过 名称:版本号 拉取
docker pull tomcat:9.0
docker pull mysql:5.7.4
docker pull redis:5.0.4
docker pull nginx:latest

docker images
# REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
# tomcat              9.0                 6055d4d564e1        8 days ago          647MB
# redis               5.0.4               a4fe14ff1981        14 months ago       95MB
# mysql               5.7.4               aa5364eb3d85        5 years ago         252MB
# nginx               latest              5cdef4ac3335        2 weeks ago         161MB

# 启动 nginx
docker run --name nginx -p 80:80 -d nginx
# 启动 tomcat
docker run -d -p 8080:8080 --name tomcat tomcat:9.0
# 启动 mysql
docker run -d -p 3306:3306 --name mysql -e MYSQL_ROOT_PASSWORD=123456 mysql:5.7.4
# 启动 redis
# 1.拷贝 1个 redis.conf 到目录(新建) /docker/redis/ 并修改配置
	#bind 127.0.0.1 # 注释掉这句。这是限制redis只能本地访问
	protected-mode no # 设置为no。默认yes开启保护模式，限制为本地访问
	daemonize no # 默认no，后台启动，docker中运行该配置无需改动(yes时docker无法从配置文件启动redis)
	requirepass 1234 # 修改登陆密码为 1234
	databases 16 # 数据库个数（可选）
	dir  ./ # 输入本地redis数据库存放文件夹（可选）
	appendonly yes # redis持久化存储（可选）
	maxmemory 134217728 # 限制内存使用 134217728 = 1024byte * 1024k * 128M = 128M
# 2.启动命令
docker run -p 6379:6379 --name redis -v /docker/redis/redis.conf:/etc/redis/redis.conf -v /usr/local/docker/data:/data -d redis:5.0.4 redis-server /etc/redis/redis.conf --appendonly yes --requirepass "1234"
# @-d 后台启动，镜像名称:镜像版本
# @-p 端口映射，主机端口:容器端口
# @--name 指定启动容器的名字
# @-v 挂载目录，规则与端口映射相同（docker沙箱隔离，需要映射挂载目录到主机才能访问配置文件）
# @--appendonly 开启 redis 持久化
# @--requirepass "1234" 带配置密码启动
# @redis-server /etc/redis/redis.conf 以配置文件形式启动 redis，加载挂载的配置文件(/docker/redis/redis.conf)
# @/data 该目录被挂载为 docker 容器中的 /usr/local/docker/data 目录，appendonly.aof 持久化文件存放这里


# 查看 3个进程启动情况
ps -ef | grep -e tomcat -e mysql -e redis
```



### 5. 敏捷开发：禅道

参考官网教程：https://www.zentao.net/book/zentaopmshelp/405.html

```sh
#docker拉取禅道开源版（免费！）认准 12.3.3 版本
docker pull easysoft/zentao:12.3.3
#创建docker网络驱动
docker network create --subnet=172.172.172.0/24 zentaonet
#启动禅道容器，映射端口号自定义了为 9090
docker run --name zentao -p 9090:80 --network=zentaonet --ip 172.172.172.172 --mac-address 02:42:ac:11:00:00 -v /www/zentaopms:/www/zentaopms -v /www/mysqldata:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 -d easysoft/zentao:12.3.3
#@Aliyun打开 9090 端口的安全组访问权限后，访问测试
http://云服务器ip:9090

#根据提示配置，然后创建组织中的成员&帐密&部门，创建项目，项目中创建任务，指派任务
```

![image-20200819002428127](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200819002430.png)