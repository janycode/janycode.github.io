---
title: 06-IDEA-jQuery自动补全
date: 2016-5-18 21:13:45
tags: 
- IDEA
- jQuery
- 自动补全
categories:
- 00_先利其器
- 01_Intellij IDEA
---

**第一步**：

引入官网CDN

```html
<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
```

把这段代码嵌入到html中，移到上面Alt+Enter 选择 下载，这个时候就会自动下载jQuery文件。

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316153409.png)



**第二步：**

给 js 添加 lib 库，并且下载文档进本地，删去这个网址，采用本地的 .js 。

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200801222928.gif)

**第三步**：

之后就能使用了，如果后面显示有several xxx，意思是你的库 有重复的，比如jQuery和jdk9 就有重复的，我用的是 jdk1.8的没有重复问题。

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316153424.png)