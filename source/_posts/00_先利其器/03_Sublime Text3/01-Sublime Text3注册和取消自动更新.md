---
title: 01-Sublime Text3注册和取消自动更新
date: 2016-4-28 22:37:24
tags: 
- Sublime Text3
- 设置
categories: 
- 00_先利其器
- 03_Sublime Text3
---

### 1. 一个可用的注册码：
```java
----- BEGIN LICENSE -----
sgbteam
Single User License
EA7E-1153259
8891CBB9 F1513E4F 1A3405C1 A865D53F
115F202E 7B91AB2D 0D2A40ED 352B269B
76E84F0B CD69BFC7 59F2DFEF E267328F
215652A3 E88F9D8F 4C38E3BA 5B2DAAE4
969624E7 DC9CD4D5 717FB40C 1B9738CF
20B3C4F1 E917B5B3 87C38D9C ACCE7DD8
5F7EF854 86B9743C FADC04AA FB0DA5C0
F913BE58 42FEA319 F954EFDD AE881E0B
------ END LICENSE ------
```

### 2. 取消自动更新弹窗提示
在菜单栏“Preferences”=> "Settings-User"将里面修改为如下（红色部分）：
{
	"color_scheme": "Monokai.sublime-color-scheme",
	`"update_check": false`
}

### 3. 示例jsp自动补全插件安装
① 先安装 Package Control：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200427124959266.png)
② Ctrl+Shift+P 打开pacakges列表界面，搜索packages:install packages
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200427125358384.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)

> Ctrl+`,打开控制台console，可以看到安装过程信息。

随后弹窗输入需要的插件名字，等待安装成功。