---
title: 11-IDEA-生成Javadoc外部文档
date: 2021-02-17 18:19:44
tags: 
- IDEA
- javadoc
- 文档
categories:
- 00_先利其器
- 01_Intellij IDEA
---



1. IDEA中，点击 **Tools**-> **Generate JavaDoc**，这样会打开生成 javadoc 文档的配置页面。

2. 进行配置：

![image-20210217182039521](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210217182041.png)

标注的是重要的部分，从上往下分别是配置 javadoc 的范围，输出文件夹路径以及命令行参数。

这里的命令行参数很重要，因为只有使用 utf-8 编码才能保证生成时可以正常处理中文字符，所以一定要加上：

```
-encoding utf-8 -charset utf-8
```

还可以配置那些注解需要生成，哪些权限类（private、package、protected、public）需要生成等等精细的控制。

还有一点需要注意，即不要勾选“Include test sources”，勾选后，生成时会造成很奇怪的错误。

3. 配置好后，点击生成按钮，生成好后就会自动在浏览器打开进行查看:

![image-20210217182124296](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210217182125.png)