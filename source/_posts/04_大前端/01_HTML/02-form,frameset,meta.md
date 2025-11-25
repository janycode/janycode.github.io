---
title: 02-form,frameset,meta
date: 2017-4-28 22:23:58
tags:
- HTML
- 框架
categories: 
- 04_大前端
- 01_HTML
---

### 1. form 表单

表单元素：
* type 不同的输入方式
* name 用于`拼接到链接地址提交到服务器`，格式：name1=value1`&`name2=value2
* value 默认值
* checked 单选选中
* selected 多选选中

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>表单标签</title>
    </head>
    <body>
        <!-- 
        外部必须嵌套 form 标签，用于提交浏览器数据到服务器上
        type 不同的输入方式
        name 用于拼接到链接地址提交到服务器
        value 默认值
        -->
        <form action="" method="">
            账户：<input type="text" name="username" placeholder="请输入账户" /> <br>
            密码：<input type="password" name="password" placeholder="请输入密码" /> <br>
            性别：
            <input type="radio" name="sex" value="male" checked="checked" />男
            <input type="radio" name="sex" value="female" />女 <br>
            地址：
            <select name="city">
                <option value="ZhengZhou">郑州</option>
                <option value="NanYang" selected="selected">南阳</option>
            </select> <br>
            爱好：
            <input type="checkbox" name="hobbys" value="basketball" checked="checked" />篮球
            <input type="checkbox" name="hobbys" value="football" checked="checked" />足球
            <input type="checkbox" name="hobbys" value="volleyball" checked="checked" />排球 <br>
            照片：<input type="file" /> <br>
            介绍：<textarea name="introduce"></textarea> <br>
            <button type="submit">注册</button>
            <button type="reset">清空</button>
        </form>
    </body>
</html>
```
预览结果：
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316141710.png)

> 注意事项：
>
> - form 表单中的 input 标签`禁用`属性：
>     - 如果添加 **disabled** 属性时，该 input 标签的内容不可修改，也不能被提交为参数；
>     - 如果添加 **readonly** 属性时，该 input 标签的内容不可修改，但可以被提交为参数。

### 2. frameset 框架

frameset属性：
- **row**="20%,*"  横向20%+80%
- **cols**="50%,*" 纵向50%+50%
frame属性：
- **src**="填充的内容"
- **noresize**="noresize" 不能改变大小
- **scrolling**="no" 不显示滚动条
- 定位到具体位置使用 name 属性

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>frameset框架标签</title>
        <!-- 
            frameset属性：
            rows="xx,xx" 横向分割比例
            cols="xx,xx" 纵向分割比例
            frame属性：
            src="填充的内容"
            noresize="noresize" 不能改变大小
            scrolling="no" 不显示滚动条
         -->
	</head>
    <frameset rows="20%, *">
        <frame src="aaa.html" noresize="noresize" >
        <frameset cols="50%, *">
        <frame src="bbb.html" noresize="noresize" >
        <frame src="ccc.html" noresize="noresize" >
        </frameset>
    </frameset>
</html>
```
T 字形分割。
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316141721.png)

### 3. meta 网页元数据
```html
<!DOCTYPE html>
<html>
	<head>
        <!-- 网页的编码 -->
		<meta charset="utf-8">
        <!-- 网页的编码：html 4.01 -->
        <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
        <!-- 网页的关键字 seo -->
        <meta name="keywords" content="关键词1，关键词2，关键词3"/>
        <!-- 网页的描述 seo -->
        <meta name="description" content="this is my page"/>
        <!-- 页面自动跳转，2秒后跳转百度 -->
        <!-- <meta http-equiv="refresh" content="2;url=https://www.baidu.com"/> -->
        <!-- href: 引入css文件地址 -->
        <link rel="stylesheet" type="text/css" href="css/01CSS.css"/>
        <!-- src: js文件地址 -->
        <script src="js文件地址" type="text/javascript"></script>
		<title></title>
	</head>
	<body>
        <!-- 特殊符号 -->
        <p>&lt;</p> <!-- 小于号 < -->
        <p>&gt;</p> <!-- 大于号 > -->
        <p>&amp;</p> <!-- 与符号 & -->
        <p>&quot;</p> <!-- 引号 " -->
        <p>&reg;</p> <!-- 注册符号 ® -->
        <p>&copy;</p> <!-- 版权符号 © -->
        <p>&trade;</p> <!-- 商标符号 ™ -->
        <p>&nbsp;</p> <!-- 空格符 -->
        <p>&yen;</p> <!-- 人民币 ¥ -->
	</body>
</html>
```