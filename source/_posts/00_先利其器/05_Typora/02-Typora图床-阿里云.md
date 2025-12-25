---
title: 02-Typora图床-阿里云
date: 2016-5-20 09:28:50
tags: 
- Typora
- 图床
- 阿里云
categories: 
- 00_先利其器
- 05_Typora
---



基于GitHub图床总是不稳定的问题，频繁上传失败，专门总结了一下阿里云的图床设置。

### 1. 阿里云 设置
1. 进入阿里云首页：[https://www.aliyun.com/](https://www.aliyun.com/)
2. 登陆账号
3. 进入 OSS 对象存储管理

![image-20230316134641468](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316134642.png)

4. 右侧 Bucket 管理，创建

![image-20230316134656272](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316134657.png)

5. 设置存储类型

![image-20230316134705468](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316134706.png)

6. 设置读写权限

![image-20230316134713433](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316134714.png)

创建成功后，下一步配置 PicGo 的图床。

### 2. PicGo 设置
官网下载太慢，云盘飞快：

链接：[https://pan.baidu.com/s/10i2eo2aw0fBcvJJIv9JtwQ](https://pan.baidu.com/s/10i2eo2aw0fBcvJJIv9JtwQ) 

提取码：1u0a

1. 获取阿里云的 AccessKey

![image-20230316134727781](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316134728.png)

1. 配置 PicGo 阿里云OSS图床

![image-20230316134739819](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316134740.png)

1. 填写好配置信息后，设置默认图床，确认
2. PicGo设置开机自启(软件小没啥影响，因为上传图片时需要它在启动状态下)




### 3. Typora 设置
Typora，markdown神器中【文件】>>【偏好设置】>>【图像】，设置并验证：

![image-20230316134802841](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316134803.png)



![image-20230316134753840](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316134754.png)

### 4. 测试图片上传
![image-20230316134820311](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316134821.png)

![image-20230316134830375](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316134831.png)

浏览器访问OK：

![image-20230316134841000](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316134841.png)

阿里云OSS文件存储查看：

![image-20230316134852714](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316134853.png)



> 目前个人使用没有什么问题（存的少，访问的也少些），对于 阿里云的OSS对象存储服务，如果 存储空间 和 访问流量 上有免费上限的话，后续再做补充。





### 5. typora+picgo图床上传问题

不论是验证还是图片上传均报错："`failed to fetch`"。

1. 检查typora的上传端口号 与 picgo 的server端口号是否一致。不一致则修改一致再测。

2. 防火墙关闭，验证是否OK。如果OK，可以打开防火墙并设置防火墙入站规则（按程序添加，将typora和picgo都添加进去，端口号默认[任何]即可）。

![image-20251224121521956](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251224121525586.png)