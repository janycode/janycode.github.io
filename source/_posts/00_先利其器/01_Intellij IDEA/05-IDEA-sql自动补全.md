---
title: 05-IDEA-sql自动补全
date: 2016-5-18 21:13:45
tags: 
- IDEA
- sql
- 自动补全
categories:
- 00_先利其器
- 01_Intellij IDEA
---

> 修改过 IDEA 默认的自动补全(Ctrl+空格) 为 Alt + /


### ① sql 语句自动补全

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200330131610283.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200330120629356.png)

### ② sql 语句去除警告波浪线（不去除所有警告线）
> 相信不少人遇到在 IDEA 中输入的 sql 语句会普遍飘一个警告的波浪线，很是让人觉得不爽，今天，干它！

sql语句的警告波浪线示例：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200328232927675.png)
* 原因：
(`鼠标放上去`可以看到提示，或光标在这一行的任意位置 按下那神奇的 `F2`)
No data sources are configured to run this SQL and provide advanced code assistance. Disable this inspection via problem menu (Alt+Enter).

* 解释：
① 首先，这个波浪线是个警告，不是错误，可选择忽略，不管它也OK；
② 根据提示信息：`没有配置任何数据源来运行此SQL并提供高级代码帮助。`禁用此检查通过问题菜单(Alt+回车)。

【根本原因】
因为没有在 IDEA 中设置该 sql 语句的 `Data Source`，也就是数据源，这个数据源需要登录需要连接的数据库。

### 1. 解决办法
那么，现在我们配置一个 Data Source：
（当前使用的是 MySQL5.7 版本，Driver 包为 5.1通用5类的版本）

第一步：`创建 Data Source >> MySQL`
![去除sql语句的警告波浪线](https://img-blog.csdnimg.cn/20200328233814134.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)
第二步：`Driver：MySQL 5.1`
![去除sql语句的警告波浪线](https://img-blog.csdnimg.cn/202003282340109.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)

（导入过5.1的Driver jar包或者在这里点击自动 download 该版本）
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020040612565375.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)
![去除sql语句的警告波浪线](https://img-blog.csdnimg.cn/20200328234146837.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)
第三步：`填入连接的 MySQL 的用户名和密码，Alt+/ 可以测试连接可用性，也顺带会读出数据库名，数据库名选不选无所谓`
（当前使用的本机上的 mysql57 服务，默认的 root 用户）
![去除sql语句的警告波浪线](https://img-blog.csdnimg.cn/202003282346475.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)

查看结果：
![去除sql语句的警告波浪线](https://img-blog.csdnimg.cn/20200328235342244.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)
结语：
* `消除了波浪线`，需要连接一个可用的 MySQL 的 Data Source 服务，个人认为是 IDEA 在给 sql 语句着色或者解析的时候需要知道是哪家的数据库语言；
* 强大的 IDEA 自带了一个`数据库客户端`，当连接上 MySQL 服务后，该界面可以替代 SQLyog 或 Navicat，毕竟在 IDEA 内部只需要 `Alt + ←或→`就可以切换编辑栏标签了。
![去除sql语句的警告波浪线](https://img-blog.csdnimg.cn/20200329000457148.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)
![去除sql语句的警告波浪线](https://img-blog.csdnimg.cn/20200329000807885.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200330131621531.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200330131635691.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)
消它，消它，消它，OMG！（>_O）

### 2. 不同文件关联不同的数据库（且自动补全）



主菜单文件进入关联设置：

![img](https://img-blog.csdnimg.cn/20190417221541365.png)



F2：用于弹出错误提示的，这里需要在 sql 语句中一直按，会有神奇的发现，在 表名出给出了修复错误的 action！！！辣么，开干！
* 第一步：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200330205321344.png)
* 第二步：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200330205535412.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)
* 第三步：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200330205828590.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)
* 第四步：（如果到第三步的时候，自动补全还未生效的话，操作这一步，个人认为是 IDEA 重新读取了该 库中的所有表）
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200330210005553.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70)



### 3. console 中命令保存的位置

IDEA datasource 的 console 控制台保存的sql文本路径：
`C:\Users\Administrator\AppData\Roaming\JetBrains\IntelliJIdea2020.1\consoles\.history\db`