---
title: 11-使用方式,CSS选择器
date: 2017-4-28 22:23:58
tags:
- CSS
- 选择器
categories: 
- 04_大前端
- 02_CSS
---

### 1. CSS 样式使用方式

#### 1.1 内联方式
标签内，单独对特定标签元素生效，简单，但不能复用。
```html
<font style="color: red;">这是一行字</font>
```
#### 1.2 内部方式
1. 在 head 标签中，使用 style 标签
2. 使用选择器选中元素
3. 编写 css 代码



```html
<style type="text/css">
    font{
        font-size: 50px;
        color: darkblue;
    }
    a{ text-decoration:none }
</style>
</head>
```
#### 1.3 外部方式
1. 新建一个 css 样式文件
2. 编写 css 代码
3. 在 html 文件中引入 css 外部文件，使用 link 标签引入



```html
<link rel="stylesheet" type="text/css" href="./css/01CSS.css"/>
```

### 2. CSS 选择器
#### 2.1 标签选择器
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316141738.png)
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>标签选择器</title>
        <style type="text/css">
            span {
                color: green;
            }
        </style>
    </head>
    <body>
        <span>this is span</span> <br>
    </body>
</html>
```
#### 2.2 id选择器
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316141744.png)
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>CSS-id选择器</title>
        <style type="text/css">
            #aaa {
                color: red;
            }

            #bbb {
                color: blue;
            }
        </style>
    </head>
    <body>
        <p id="aaa">This is impontment!</p>
        <p id="bbb">This is impontment!</p>
    </body>
</html>
```
#### 2.3 class选择器
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316141750.png)
```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>CSS类选择器</title>
         <style type="text/css">
             .aaa{
                 color: red;
             }
             .bbb{
                 color: blue;
             }
         </style>
	</head>
	<body>
        <p class="aaa">hello, css!</p>
        <p class="aaa">hello, css!</p>
        <p class="bbb">hello, css!</p>
        <p class="bbb">hello, css!</p>
	</body>
</html>
```
#### 2.4 属性选择器
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316141759.png)
```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>CSS-属性选择器</title>
        <style type="text/css">
            input[type="text"]{
                color: red;
            }
            font[size]{
                color: blue;
            }
        </style>
	</head>
	<body>
        <div>
            账号：<input type="text" name="username" placeholder="请输入用户名" /> <br>
            密码：<input type="password" name="password" placeholder="请输入用户名" />
        </div>
        <font size="20px" color="">这是20号字</font>
	</body>
</html>
```
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316141806.png)
#### 2.5 层级选择器（子代、后代、相邻兄弟、通用兄弟）
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316141813.png)
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>CSS-层级选择器</title>
        <style type="text/css">
            /* 后代选择器 */
            div p{
                color: red;
            }
            /* 子代选择器 */
            #div1>p{
                color: green;
            }
            /* 相邻兄弟选择器 */
            #tp+div {
                color: blue;
            }
            /* 通用兄弟 */
            #tp~div {
                color: yellow;
            }
        </style>
    </head>
    <body>
        <div id="div1">
            <span>今天天气好</span>
            <p id="tp">天气那好了？</p>
            <div>
                <p>别人遛狗了</p>
                <span>那是谁在遛狗了。。。</span>
            </div>
        </div>
    </body>
</html>
```
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316141819.png)

#### 2.6 分组选择器
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316141825.png)
```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>选择器分组</title>
         <style type="text/css">
             #font, .class, span{
                 font-size: 30px;
                 color: red;
             }
         </style>
	</head>
	<body>
        <font id="font">this is font</font>
        <div class="class">this is div</div>
        <span>this is span</span> <br>
	</body>
</html>
```
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316141832.png)