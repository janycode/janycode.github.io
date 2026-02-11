---
title: 01-Typora自用设置
date: 2016-5-20 09:28:50
tags: 
- Typora
- 设置
categories: 
- 00_先利其器
- 05_Typora
---



### 1. 新版破解

#### 下载

Typora 官网地址：[https://typora.io](https://typora.io/)

Typora 中文官网地址：[https://typoraio.cn](https://typoraio.cn/)

工具下载地址：[蓝奏云，密码：fkmj](https://www.lanzouh.com/i7j9H26waded) || [百度网盘，密码：dcqe](https://pan.baidu.com/s/1gga2OZ732Xvig1QKn52NHQ)

#### 复制文件至安装目录

把解压出来的两个 `exe` 文件复制到 Typora 的安装目录下，默认路径为：`C:\Program Files\Typora`，如安装在其他路径，请自行替换。

#### 以管理员运行cmd执行两个exe

（1）输入 cd C:\Program Files\Typora 按回车，跳转到 Typora 安装路径。
（2）输入 node_inject.exe 按回车，等待提示“**done!**”。
（3）输入 license-gen.exe 按回车，等待显示序列号。

![image-20251224104229529](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251224112052507.png)

#### 打开typora激活

启动 Typora，随意输入邮箱地址，并将生成的序列号粘贴到激活窗口中，点击按钮。

上述方法已验证无效。



最新方法：2025.12 [使用1.9.5版本破解方法](https://www.cnblogs.com/zong0919/articles/19318385)



### 2. 主题设置

1. 文件 >> 偏好设置 >> 外观 >> 主题 >> **获取主题** >> 下载（`Vue`）

2. 解压下载的 typora-vue-theme-master.zip 中的 `vue.css` 和 `vue-dark.css` 文件到下面的目录
3. 文件 >> 偏好设置 >> 外观 >> 主题 >> 获取主题 >> **打开主题文件夹**

![image-20200601093005044](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200601093005044.png)



### 3. 字体设置

```css
body {
	font-family: "Microsoft Yahei Mono", ...;
	...
}
...
.md-fences,
code,
tt {
	font-family: "Microsoft Yahei Mono", ...;
	...
}
```



### 4. csdn文章复制在线转md

csdn文章路径: https://blog.csdn.net/xxx/article/details/123

浏览器url中进入阅读模式，加`read://`：`read://https://blog.csdn.net/xxx/article/details/123`

F12开发者工具模式，复制文章内容的div为 outHTML：

![image-20260113104745774](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260113104747124.png)

在线转md：

https://tool.lu/markdown/

