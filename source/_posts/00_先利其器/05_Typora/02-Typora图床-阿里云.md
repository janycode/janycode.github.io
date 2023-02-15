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
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020052008575666.png)
4. 右侧 Bucket 管理，创建
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200520085836253.png)
5. 设置存储类型
![设置存储类型](https://img-blog.csdnimg.cn/20200520090226627.png)
6. 设置读写权限
![设置读写权限](https://img-blog.csdnimg.cn/2020052009024960.png)

创建成功后，下一步配置 PicGo 的图床。

### 2. PicGo 设置
官网下载太慢，云盘飞快：
链接：[https://pan.baidu.com/s/10i2eo2aw0fBcvJJIv9JtwQ](https://pan.baidu.com/s/10i2eo2aw0fBcvJJIv9JtwQ) 
提取码：1u0a

1. 获取阿里云的 AccessKey
![获取阿里云的AccessKey](https://img-blog.csdnimg.cn/20200520090523899.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)
2. 配置 PicGo 阿里云OSS图床
![PicGo阿里云OSS图床配置](https://img-blog.csdnimg.cn/20200520090815480.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)
3. 填写好配置信息后，设置默认图床，确认
4. PicGo设置开机自启(软件小没啥影响，因为上传图片时需要它在启动状态下)




### 3. Typora 设置
Typora，markdown神器中【文件】>>【偏好设置】>>【图像】，设置并验证：
![设置PicGo安装路径](https://img-blog.csdnimg.cn/2020052008551728.png)

![验证图片上传项](https://img-blog.csdnimg.cn/20200520085619251.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)

### 4. 测试图片上传
![测试图片上传](https://img-blog.csdnimg.cn/2020052009114667.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)

![上传测试](https://img-blog.csdnimg.cn/20200520091247931.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)

浏览器访问OK：
![浏览器访问OK](https://img-blog.csdnimg.cn/2020052009133299.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)

阿里云OSS文件存储查看：
![阿里云OSS文件存储查看](https://img-blog.csdnimg.cn/20200520091426149.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)

> 目前个人使用没有什么问题（存的少，访问的也少些），对于 阿里云的OSS对象存储服务，如果 存储空间 和 访问流量 上有免费上限的话，后续再做补充。