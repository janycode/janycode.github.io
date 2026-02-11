---
title: 03-Docker 禅道-敏捷开发
date: 2018-5-23 22:18:03
tags:
- Docker
categories: 
- 12_项目管理
- 04_Docker
---

![image-20200819081758968](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200819081800.png)

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