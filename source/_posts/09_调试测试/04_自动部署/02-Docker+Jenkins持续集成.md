---
title: 02-Docker+Jenkins持续集成
date: 2019-09-08 20:11:25
tags:
- Jenkins
- 自动部署
- Docker
categories: 
- 09_调试测试
- 04_自动部署
---



参考资料(官网)：https://www.jenkins.io/zh/

参考资料：https://www.jianshu.com/p/41f2def6ec59

参考资料：https://www.yisu.com/zixun/1138.html

![image-20220127112845609](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220127112846.png)

# CI/CD的开发流程

**开发流程：**编码 -> 构建 -> 集成 -> 测试 -> 交付 -> 部署

![image-20230624111535488](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230624111536.png)

### 一、Jenkins安装和配置

```
1.运行Jenkins，如果docker容器中没有安装，会自动安装(当前安装版本为v2.263.2)并启动，端口号8080
  docker run --name jenkins --user=root -p 8080:8080 -p 50000:50000 -v /opt/data/jenkins_home:/var/jenkins_home -d jenkins/jenkins:lts

2.registry安装
  docker run --name registry -p 5000:5000 -v /opt/devdata/registry:/var/lib/registry -d registry

3.如果是云服务器的话，将8080端口加入安全组

4.浏览器访问jenkins，访问地址 http://IP地址:8080
  第一次需要填入jenkins的 Administrator Password(超级管理员密码)

5.查看jenkins日志以及获取密码
  方式一：(仅在第一次docker安装jenkins才能查看到)
  docker logs jenkins
  610844ae9456448380397642835e173f
  方式二：
  docker exec -it jenkins bash
  cat /var/jenkins_home/secrets/initialAdminPassword

6.配置时区
  配置时间一致：右上角 admin >> configure >> User Defined Time Zone >> 选择"Asia/Shanghai"
  配置时间正确：系统管理 >> 脚本命令行 >> 输入下面的命令 >> 运行 >> 会显示"Result: Asia/Shanghai"
  System.setProperty('org.apache.commons.jelly.tags.fmt.timeZone', 'Asia/Shanghai')

7.配置汉化
  Dashboard >> Manage Jenkins >> Manage Plugins >> Available >> 搜索"Localization" >> 选择"Localization: Chinese (Simplified)" >> Download now and install after restart

8.重启方法
  方式一：浏览器访问 IP地址:8080/restart
  方式二：手动重启# systemctl restart jenkins ，然后重新访问 Jenkins 控制台

9.配置用户，在安装汉化后因为选择了重启 jenkins 所以进入了配置用户界面
  root
  654321
```

![Image](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220130112630.png)

![Image](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220130112638.png)



### 二、Jenkins持续构建

```
1.安装docker构建插件：docker build step plugin 或 docker-build-step
2.安装角色权限管理插件：Role-based Authorization Strategy
3.安装SSH插件：SSH
  用于构建成功后执行远端服务器脚本从docker本地仓库获取镜像后发布新版本。
4.安装邮件通知插件：Email Extension
5.配置Jenkins属性
  5.1 配置JDK： Dashboard >> 系统管理 >> 全局工具配置 >> JDK安装 >> 自动从Oracle官网安装(需账号密码)
      Oracle官网确认账号可正常登陆：https://login.oracle.com/mysso/signon.jsp
      471553857@qq.com + 个人常用密码
      重新配置该账号密码的路径：http://IP地址:8080/descriptorByName/hudson.tools.JDKInstaller/enterCredential
  5.2 配置Maven： Dashboard >> 系统管理 >> 全局工具配置 >> Maven安装
  5.3 配置Docker： Dashboard >> 系统管理 >> 全局工具配置 >> Docker安装
  5.4 配置SSH： Dashboard >> 系统管理 >> Manage Credentials(管理证书) >> Jenkins >> 全局凭据 >> 添加凭据
      Dashboard >> 系统管理 >> 系统配置 >> SSH remote hosts >> IP地址,端口22,选证书,剩下两个选项填0
      Jenkins配置证书参考资料：https://blog.csdn.net/qq_41838901/article/details/95483936
  5.5 配置Docker Builder(暂忽略)： Dashboard >> 系统管理 >> 系统配置 >> Docker Builder >> Docker server REST API URL
      Docker REST URL配置参考资料：https://blog.csdn.net/weixin_30650039/article/details/96353968
6.持续构建步骤
  6.1 步骤：创建-编译-打包-上传docker镜像任务-执行远端脚本从私有仓库获取镜像发布新版本-发布完成发送邮件推送
      源码管理 -> 构建触发器 -> 构建 -> 构建后操作通知
  6.2 源码管理：需安装 Git 插件、安装 SVN 插件(看源码位置)、安装 Generic Webhook Trigger 插件
```

![Image](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220130112803.png)

源码管理 - 构建触发器 - 构建 - 构建后操作通知

![Image](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220130112818.png)

![Image](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220130112824.png)

![Image](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220130112828.png)

![Image](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220130112834.png)

### 三、Jenkins权限管理

```
1.安装插件
  Dashboard >> 系统管理 >> 插件管理 >> 搜索"role" >> 安装"Role-based Authorization Strategy"

2.启用插件
  Dashboard >> 系统管理 >> 全局安全配置 >> 授权策略 >> ● Role-Based Strategy
  可以看到：系统管理 下的 Manage and Assign Roles

3.创建用户
  Dashboard >> 系统管理 >> 管理用户 >> 新建用户 >> 如：账号dev密码123456

4.分配权限
  Dashboard >> 系统管理 >> Manage and Assign Roles >> Manage Roles(管理角色) >> 如图
  Dashboard >> 系统管理 >> Manage and Assign Roles >> Assign Roles(分配角色) >> 如图

5.测试权限，如图(1张)
```

管理角色：

![Image](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220130112955.png)

分配角色：

![Image](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220130113031.png)

测试dev用户：

![Image](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220130113045.png)

