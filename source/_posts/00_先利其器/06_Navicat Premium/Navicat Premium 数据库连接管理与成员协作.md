---
title: Navicat Premium 数据库连接管理与成员协作 
date: 2021-4-25 18:52:14
tags: 
- Navicat Premium
- 数据库工具
- Navicat
categories: 
- 00_先利其器
- 06_Navicat Premium
---


> Navicat Premium 12 或 Navicat Premium 15 版本均可。
> Navicat Premium 15 百度网盘下载：
> 链接：https://pan.baidu.com/s/1fcYhI9JcbnPk_xKk2bo0wg 
> 提取码：6sc3 


### 1. 数据库连接管理
#### 1.1 MySQL 连接
![MySQL 连接](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20214241619233613026.png)

![多个连接](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20214241619233665017.png)

#### 1.2 颜色管理
![连接着色管理](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20214241619233772236.png)

#### 1.3 分组管理
分组前，数据库表比较杂乱，在没有规范命名的情况下，查找效率依赖记忆力：
![分组前](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20214241619233895388.png)

分组后，数据库表有组名，容易管理，容易区分，且无需可以记忆，便于维护：
![分组后](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20214241619234231871.png)

分组的配置文件在如下位置：
C:\Users\Administrator\Documents\Navicat\Premium\profiles\vgroup.json
```json
{
	"version": "1.1",
	"vgroups": [],
	"connections": [{
		"conn_name": "01-AC-Dev1(192.168.10.101)",
		"conn_type": "MYSQL",
		"vgroups": [],
		"catalogs": [{
			"catalog_name": "default",
			"vgroups": [],
			"schemas": [{
				"schema_name": "activitycenter",
				"vgroups": [{
					"vgroup_name": "01活动",
					"vgroup_type": "TABLE",
					"items": [{
						"name": "AcActivity",
						"type": "TABLE"
					},
					{
						"name": "AcActivityact",
						"type": "TABLE"
					},
					{
						"name": "AcAppletcode",
						"type": "TABLE"
					}]
				},
				//其他分组
				...]},
				//其他数据库
				...]},
				...]}
				//其他数据库连接
				...]
}
```
可以直接修改 json 文件进行扩展其他 数据库连接 的分组设置，原因就是因为分组配置和密码一样只会保存在本地。
`也正是因为分组信息只保存在本地，所以我们需要账号来实现同步。`

### 2. 数据库成员协作
#### 2.1 注册账号
注册账号后，需要验证邮箱，然后登陆进去即可。
![注册 Cloud 账号](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20214241619234821391.png)

#### 2.2 Cloud 同步
![Navicat Cloud 同步](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20214241619234978596.png)

`Navicat Cloud 也承诺不会保存密码，所以同步上去后再次连接数据库，还是需要输入密码的。`
![Navicat 不会保存密码](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20214241619235079659.png)

### 2.3 添加成员
点击 协作与...
![Navicat Cloud 添加成员协作](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20214241619235130711.png)

点击 添加成员
![点击添加成员](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20214241619235241193.png)

输入 成员邮箱账号
![添加成员，需要邮箱账号](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20214241619235224375.png)

成员添加成功。
![成员添加成功](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20214241619235299015.png)

> 默认有3个身份：管理员、成员、客人。
> 盲猜都能猜到权限，一般没有权限限制时直接将身份设置为 管理员 即可。

### 2.4 成员界面
我的：
![我的界面](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20214241619235516841.png)

加入的成员界面：
![成员界面](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20214241619235450616.png)

![分组已同步](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20214241619235535964.png)

> 后续可新增更多成员，做数据库统一分组划分。

再高一层的延伸：
可以考虑运维来申请一个总账号，然后给所有需要有权限的开发人员添加为 "管理员" 身份的成员即可，维护和使用将更加便捷、统一、规范！