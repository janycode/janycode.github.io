---
title: AList搭建网盘挂载硬盘并挂载网络资源
date: 2023-03-08 13:14:02
tags: 
- AList
- 网盘
- 小雅
categories:
- 00_先利其器
- 08_AList
---

![image-20230308130755019](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230308130756.png)

参考资料：

AList: https://alist.nn.ci/zh/

RaiDrive: https://www.raidrive.com/

> 一个支持多种存储的文件列表程序，可以实现多种网盘挂载为硬盘，并可以挂载不限量的网络资源。
>
> 重点：`免费!`

![image-20230308131007980](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230308131008.png)

## 1.安装AList

### 1.1 下载

下载地址：https://github.com/alist-org/alist/releases

![image-20230308131137406](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230308131138.png)



### 1.2 解压

解压到指定目录，比如：`D:\Program Files (x86)\`

![image-20230308131238926](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230308131240.png)



### 1.3 启动

选择`在终端打开`，启动 alist 服务。

```
alist.exe server
```

![image-20230308131651642](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230308131652.png)

> 可以加入环境变量中，任意路径可启动。

![image-20230308131914660](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230308131916.png)

账号：admin

密码：xxx（如图）

### 1.4 登录

浏览器访问地址：`http://127.0.0.1:5244/`

使用 admin 和 密码 登录。

![image-20230308132126742](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230308132127.png)



### 1.5 改密

在 `管理`  - `个人资料` 修改密码，并重新登陆。

![image-20230308132217414](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230308132219.png)

![image-20230308132308325](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230308132309.png)

> 如果忘记密码可以使用命令 `alist.exe admin` 查看修改后的密码是多少：
>
> ![image-20230308132645035](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230308132646.png)

### 1.6 开机自启

用 **`.VBS`** 脚本启动和停止，分别创建两个脚本 分别是 启动.vbs 和 停止.vbs

直接在和Alist启动程序同级文件夹里面双击启动即可，不用担心没有反应 直接去 浏览器访问即可。

两个启动脚本：

**启动.vbs**

```vbscript
Dim ws
Set ws = Wscript.CreateObject("Wscript.Shell")
ws.run "alist.exe server",vbhide
Wscript.quit
```

**停止.vbs**

```vbscript
Dim ws
Set ws = Wscript.CreateObject("Wscript.Shell")
ws.run "taskkill /f /im alist.exe",0
Wscript.quit
```

1. 脚本不会创建的可以自行下载：[**脚本下载**](https://www.aliyundrive.com/s/DHPMhRtKUzY/folder/63e0961eae317bd4d4d945cda69dbb00f9837fb7)
2. 脚本不会使用的可以看看视频：[**参考视频**](https://www.bilibili.com/video/BV1DG411s7j5?t=266.2)

![image-20230308133748940](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230308133750.png)

非常小的CPU和内存占用，完全放心开启自启动。



## 2.添加云盘存储

### 2.1 添加阿里云盘

AList管理后台中 `存储` - `添加` - `阿里云盘Open` ，挂载路径可以自定义，比如我写的 `/阿里云盘`。

![image-20230308143752603](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230308143753.png)

### 2.2 阿里云刷新令牌

参考官方文档：https://alist.nn.ci/zh/guide/drivers/aliyundrive_open.html

1. 从该地址点击 `Go to login` 跳转阿里云盘登陆
   https://alist.nn.ci/tool/aliyundrive/request.html
   ![image-20230308144158115](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230308144159.png)
2. 任一方式登陆即可，比如我使用扫码登陆，登录后会点击`允许`
   ![image-20230308144502071](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230308144503.png)

3. 页面会自动跳转到 refresh_token 展示页
   ![image-20230308144634995](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230308144636.png)
4. 复制 - 粘贴 到 Alist 后台
   ![image-20230308144713798](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230308144714.png)



### 2.3 查看云盘文件

添加成功后的样子如下图，点击主页查看云盘文件。

![image-20230308144857319](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230308144858.png)

![image-20230308144953647](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230308144954.png)

其他网盘方法类似，如出一辙，傻瓜式按步骤配置即可。



## 3.映射本地盘

> 在网页上查看和管理还是非常麻烦的，因此可以映射到本地磁盘，让网盘的使用如同本地磁盘一样（而且还不占物理硬盘的空间，岂不美哉？！）

### 3.1 下载RaiDrive

官网：https://www.raidrive.com/

### 3.2 安装

一路下一步，设置好安装路径即可。安装好启动如图：

![image-20230308151555807](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230308151556.png)

### 3.2 设置

选择 `添加` - 服务类型里的 `NAS` - WebDAV，将`地址`取消勾选，然后填写：

* ip地址: 127.0.0.1
* 端口号：5244
* 路径：/dav
* 账户：admin
* 密码：xxx(自己改过的密码)

![image-20230308151754445](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230308151755.png)

连接即可，打开后可以看到挂载的盘和盘里的内容：

![image-20230308160245458](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230308160246.png)

![image-20230308160321035](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230308160321.png)



## 4.使用问题

### 4.1 阿里云token不通问题

alist 挂载 aliyunopen 失效的解决办法如下：
只需要将 aliyundrive_open 后台配置中的 Oauth令牌链接进行更换。

原: https://api-cf.nn.ci/alist/ali_open/token （如果该地址已恢复，可能是因为接口挂了一段时间吧）

换为

新: https://api.xhofe.top/alist/ali_open/token （获取令牌时的 cn 对应域名，只换域名）

