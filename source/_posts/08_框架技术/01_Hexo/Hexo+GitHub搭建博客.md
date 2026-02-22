---
title: Hexo+GitHub搭建博客
date: 2016-05-26 12:12:57
tags:
- Hexo
- GitHub
- 配置
categories: 
- 08_框架技术
- 01_Hexo
---



Hexo 博客框架中文官网+文档：https://hexo.bootcss.com/

主要参考资料：https://wiki.jikexueyuan.com/project/hexo-document/



一个合格的Java程序员都应该拥有一个博客站点，最起码的作用：

① 技术笔记

② 经验总结

③ 前后端可劲造 - 学习

④ 美文撰写

>搭建博客的系统环境：`Windows 10 企业版 LTSC`
>
>只要是 Windows 主流系统环境下，本质上步骤并不会有任何差异。

## 1. GitHub 准备工作
#### 1.1 GitHub 账号注册
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316150551.png)
#### 1.2 GitBash 下载安装
下载地址：[https://gitforwindows.org/](https://gitforwindows.org/)

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316150653.png)

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316150737.png)

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316150746.png)

剩下的，一路默认就行（安装路径根据自己需要更改)。



#### 1.3 GitHub Desktop

GitHub Desktop 下载地址：https://desktop.github.com/

GitHub 的桌面版，为部署到 github.io 公网路径时使用。

下载安装，安装在非C盘即可，无脑下一步。



#### 1.4 Node.js 下载安装
下载地址：[https://nodejs.org/zh-cn/](https://nodejs.org/zh-cn/)

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316150755.png)

一路默认就行（安装路径根据自己需要更改)。

## 2. Hexo 准备工作
#### 2.1 Hexo 下载安装
① 在任意位置点击鼠标右键，选择Git Bash

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316150805.png)

② 安装Hexo命令：`npm install -g hexo`

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316150812.png)

#### 2.2 Hexo 初始化配置
1. 创建文件夹（我的是在D盘创建的Hexo）

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316150816.png)

2. 在Hexo文件下，右键运行Git Bash，输入命令：`hexo init`

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316150829.png)

3. 在`_config.yml`,进行基础配置

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316150834.png)

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316150842.png)

4、主题选择（博客整体外观哦）

Hexo的主题分享页：[https://hexo.io/themes/](https://hexo.io/themes/)

该页面里点击图片是预览，点击主题的名字则是进入git中，获取其git主题路径，然后在Hexo文件夹下使用 Git Bash。

输入命令(注意空格)：`git clone 主题的git链接 themes/目录名`

eg: 

```sh
git clone https://github.com/wujun234/hexo-theme-tree.git themes/tree
```

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316150852.png)

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316150903.png)

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316150907.png)



## 3. 博客更新、预览、部署(外网访问)
#### 3.1 文章更新
在 `磁盘:\Hexo\source\_posts`文件下，新建.md文件就可以以 markdown 格式写文章。

.md格式，即 markdown 格式的文本，熟练3-5个便捷的 markdown 命令，文章的效率和美观度嗖嗖的上涨。信我！试试！

（本篇20分钟编辑完，带图，你信吗？）

> 最佳搭档：`markdown语法` + `Typora工具`

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316150913.png)



#### 3.2 博客本地浏览方式
① Git Bash 输入命令：`hexo g && hexo s`

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316150921.png)

② 在浏览器输入：`http://localhost:4000` ，就可以进行访问

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316151003.png)



#### 3.2 博客部署到 GitHub 上
① 登陆 github 账号，`new repository`创建仓库、获取同名的`https 仓库源地址`：

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316153556.png)

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316151019.png)

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316153606.png)

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316151029.png)



② 在 `_config.yml` 进行配置：

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316151037.png)

③ 安装 hexo-deployer-git 自动部署发布工具：

安装命令(注意路径)：`npm install hexo-deployer-git  --save`

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316151043.png)

④ 一键发布到 GitHub：

发布命令(注意路径)：`hexo clean && hexo g && hexo d`

第一次发布会需要填入 github 账号密码，正确填入即可。

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316151049.png)

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316151059.png)

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316151111.png)

⑤ 测试访问：

在浏览器输入：[https://janycode.github.io/](https://janycode.github.io/)



#### 3.4 更新 + Git部署

常规日常更新操作四步走：

① 文章更新到固定路径下

`磁盘:\Hexo\source\_posts\文章名称.md`

② 进入 Hexo 目录

`cd D:\Hexo`

③ 本地部署，并浏览查看，确认无误

`hexo g && hexo s`

④ 远程部署，push到git仓库，即可浏览 xxx.github.io 正式博客确认是否更新。

`hexo clean && hexo g && hexo d`

完美！

所有涉及到的命令统一使用右键里的 `Git Bash`，规避各种神坑，你懂的。

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316151137.png)

## 4. 遇到的问题 & 解决方案
#### 4.1 _config.yml 中文乱码问题
_config.yml 配置(我只改了这一部分，用记事本修改好像会出问题。

在 localhost:4000 上运行,标题和副标题都出现乱码。

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316151143.png)

为什么设置了zh-CN还会乱码呢？

解决方案：

1.不要用记事本打开，因为记事本不会utf8转码，`用sublime text编辑`。

2.或者用记事本打开另保存为utf-8编码



#### 4.2 Push到git仓库时报错 fatal: HttpRequestException encountered
无论是push前先将远程仓库pull到本地仓库，还是强制push都会弹出这个问题。

网上查了一下发现是Github 禁用了TLS v1.0 and v1.1，必须更新Windows的git凭证管理器，才行。 

[https://github.com/Microsoft/Git-Credential-Manager-for-Windows/releases/tag/v1.14.0](https://github.com/Microsoft/Git-Credential-Manager-for-Windows/releases/tag/v1.14.0)

点击下载安装 `GCMW-1.14.0.exe` ，测试远程push还是不行，灵机一动，万能的重启电脑，问题就解决了。ORZ...

此处切记一点，更新到远程git仓库时`使用 Git Bash 的命令行操作`。

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316151151.png)



#### 4.3 每次部署到远程 github 总是需要输入账号密码
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316151159.png)

解决方案：

**配置SSH key**

① 在任意文件夹下，右键git bash，配置生成公钥：

```shell
cd ~/.ssh
git config --global user.name "yourname"
git config --global user.email "youremail"
ssh-keygen -t rsa -C "youremail"（后三个空格即可，也可以根据提示输入）
```
2、这时候.ssh下将出现两个文件id_rsa和id_rsa.pub，`id_rsa.pub是公钥`，打开`复制里面的内容`；

3、在github中的 yourname.github.io 仓库下的 setting 下的  deploy ssh 下添加 key,将上述内容复制即可，title任意；

4、测试

```shell
ssh -T git@github.com
```
输入 yes，出现如下信息则正常：

Hi username! You've successfully authenticated, but GitHub does not provide shell access.

后续再使用 远程部署 命令则会自动登录，无需输入账号密码。



#### 4.4 YAMLException: end of the stream or a document separator is expected at
```java
YAMLException: end of the stream or a document separator is expected at line 26, column 1:
```

检查所有出现 "---------" 的地方。

作横线的 “----------” 后面`少了一个空格的原因`,改成"---------- "就好了，如果有类似报错，也请先检查空格。



#### 4.5 生成和设置分类&标签


● 添加标签页面

① `hexo new page tags`

② 确认站点配置文件里有 tag_dir: tags

③ 确认主题配置文件里有 tags: /tags

④ 编辑站点的 source/tags/index.md 顶部 Front Matter

● 添加分类页面

① `hexo new page categories`

② 确认站点配置文件里有 category_dir: categories

③ 确认主题配置文件里有 categories: /categories

④ 编辑站点的 source/categories/index.md 顶部 Front Matter

● 文章顶部标签

Typora软件中【段落】-【YAML Front Matter】生成顶部标识。

在两个 --- 之间，`冒号后面要有空格`。

要使用命令添加 tags 和 categories 页面；且主题的配置文件和站点的配置文件 tags 和 categories 的注释要打开

文章顶部标识：

```
title: 标题
index_img: https://xxxxxx.png
tags:
- 关键词1
- 关键词2
categories: 
- 一级分类
- 二级分类
```



#### 4.6 Support for password authentication was removed on August 13,2021.

参考解决方案：https://blog.csdn.net/qq_42592823/article/details/123913963



### 5. 一键部署

基于shell脚本在windows上通过git bash执行一键部署。

deploy.sh

```shell
#! /bin/bash

#生成一次最新需要部署的页面
echo "生成一次最新需要部署的页面..."
hexo g
echo "生成完毕！"
echo

MYNUM=1
while [ $MYNUM -ne 0 ]
do
    echo "尝试第 $MYNUM 次部署，正在部署(请勿退出程序)..."
	RESULT=`hexo d`
	echo $RESULT
	FLAG=`echo $RESULT | grep "Deploy done: git"`
	#判断执行结果中是否包含执行成功的字符串
	if [[ "$FLAG" != "" ]]
	then
		break
	else
		echo "结果：第 $MYNUM 次部署失败！"
		MYNUM=$(($MYNUM + 1))
		echo
	fi
done

echo "部署成功！！！"
```

以及专门写了个更方便的: [脚本：一键发布两个博客](https://yuancodes.github.io/#/./02_%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80/03_Shell/02-Hexo%E5%BE%AA%E7%8E%AF%E9%83%A8%E7%BD%B2%E8%84%9A%E6%9C%AC?id=%e8%84%9a%e6%9c%ac%ef%bc%9a%e4%b8%80%e9%94%ae%e5%8f%91%e5%b8%83%e4%b8%a4%e4%b8%aa%e5%8d%9a%e5%ae%a2)