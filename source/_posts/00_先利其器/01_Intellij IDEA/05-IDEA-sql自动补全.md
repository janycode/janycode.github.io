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

![image-20230316113029721](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316113030.png)
![image-20230316113039876](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316113040.png)

### ② sql 语句去除警告波浪线（不去除所有警告线）
> 相信不少人遇到在 IDEA 中输入的 sql 语句会普遍飘一个警告的波浪线，很是让人觉得不爽，今天，干它！

sql语句的警告波浪线示例：
![image-20230316113053314](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316113054.png)

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
![image-20230316113107180](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316113108.png)
第二步：`Driver：MySQL 5.1`
![image-20230316113118663](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316113119.png)

（导入过5.1的Driver jar包或者在这里点击自动 download 该版本）
![image-20230316113130382](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316113131.png)

![image-20230316113147446](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316113148.png)
第三步：`填入连接的 MySQL 的用户名和密码，Alt+/ 可以测试连接可用性，也顺带会读出数据库名，数据库名选不选无所谓`
（当前使用的本机上的 mysql57 服务，默认的 root 用户）
![image-20230316113156671](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316113158.png)

查看结果：
![image-20230316113208214](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316113209.png)
结语：
* `消除了波浪线`，需要连接一个可用的 MySQL 的 Data Source 服务，个人认为是 IDEA 在给 sql 语句着色或者解析的时候需要知道是哪家的数据库语言；
* 强大的 IDEA 自带了一个`数据库客户端`，当连接上 MySQL 服务后，该界面可以替代 SQLyog 或 Navicat，毕竟在 IDEA 内部只需要 `Alt + ←或→`就可以切换编辑栏标签了。
![image-20230316113216369](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316113217.png)
![image-20230316113240641](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316113241.png)
![image-20230316113250869](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316113251.png)
![image-20230316113300816](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316113301.png)
消它，消它，消它，OMG！（>_O）

### 2. 不同文件关联不同的数据库（且自动补全）



主菜单文件进入关联设置：

![image-20230316113309391](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316113310.png)



F2：用于弹出错误提示的，这里需要在 sql 语句中一直按，会有神奇的发现，在 表名出给出了修复错误的 action！！！辣么，开干！
* 第一步：
![image-20230316113323470](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316113324.png)
* 第二步：
![image-20230316113332499](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316113333.png)
* 第三步：
![image-20230316113340880](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316113341.png)
* 第四步：（如果到第三步的时候，自动补全还未生效的话，操作这一步，个人认为是 IDEA 重新读取了该 库中的所有表）
![image-20230316113351418](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316113352.png)



### 3. console 中命令保存的位置

IDEA datasource 的 console 控制台保存的sql文本路径：
`C:\Users\Administrator\AppData\Roaming\JetBrains\IntelliJIdea2020.1\consoles\.history\db`