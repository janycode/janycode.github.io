---
title: 01-接入小红书开放api同步店铺数据
date: 2024-11-13 15:54:23
index_img: https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241113155930.png
tags:
- 第三方
- 小红书
categories:
- 13_第三方
- 05_小红书
---

![image-20241113155929061](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241113155930.png)

参考资料:

* 小红书API开发文档：https://xiaohongshu.apifox.cn/
* 小红书开放平台注册：https://open.xiaohongshu.com/



## 准备工作

#### 帐号注册、登录

访问[小红书开放平台](https://open.xiaohongshu.com/)，点击右上角注册
进入注册页面后，使用邮箱注册，注册成功后会发送设置密码链接到邮箱中

![image-20241113160134207](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241113160135.png)

#### 基本信息

登录完成后在 控制台-账号管理-基本信息 中查看，可修改开发者绑定的手机号
此手机号在创建应用后获取 appSecret 时用于短信验证

#### 资质信息

开发者在创建应用之前必须先完成资质审核
未提交资质审核之前，进入控制台系统会引导开发者进行资质审核

资质类型选择
![image-20241113160713276](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241113160714.png)

第三方开发者，进入资质信息页面，提交资质审核之后进入审核流程，查看审核结果后按指引操作 

![image-20241113161106507](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241113161108.png)

商家自研，跳转到ARK商家系统进行店铺登录绑定，必须使用店铺主帐号完成资质绑定 

![image-20241113161155284](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241113161157.png)