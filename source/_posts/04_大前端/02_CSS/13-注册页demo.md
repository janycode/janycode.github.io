---
title: 13-注册页demo
date: 2017-4-29 22:23:58
tags:
- CSS
categories: 
- 04_大前端
- 02_CSS
---

### 注册页

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142216.png)

### 注册页 CSS

```css
html{
    height: 100%;
}
body{
    height: 100%;
    margin: 0px;
    background-image: url(../img/bg.jpg);
    background-size: cover;
    display: flex;/* 伸缩布局 */
    align-items: center;/* 垂直居中 */
    justify-content: center;/* 水平居中 */
}

#left{
    width: 20%;
    padding-top: 20px;
    padding-left: 20px;
}
#left font{
    font-size: 25px;
    color: gray;
}
#left #f1{
    color: orange;
}

#center{
    width: 60%;
    padding-top: 20px;
    display: flex;/* 伸缩布局 */
    padding-top: 60px;
    /* align-items: center;/* 垂直居中 */
    justify-content: center;/* 伸缩居中 */
    color: gray;
}
#center input{
    width: 300px;
    height: 35px;
    border: 1px solid lightgray;
    border-radius: 5px;
}
#center #codes{
    display: flex;/* 伸缩布局 */
    align-items: center;/* 垂直居中 */
}
#center #code{
    width: 210px;
}
#center #img{
    padding-left: 10px;
}
#center button{
    width: 9.375rem;
    height: 2.1875rem;
    margin-top: 20px;
    background-color: orange;
    border-radius: 5px;
    color: white;
    font-weight: bolder;
}
#center button:active{
    background-color: #ff5500;
}

#right{
    width: 20%;
    padding-top: 20px;
}
#right a{
    color: indianred;
    text-decoration: none;
}
#right a:hover{
    color: red;
}

#container{
    display: flex;/* 伸缩布局 */
    background-color: white;
    width: 62.5rem;
    height: 31.25rem;
}
img{
    width: 80px;
}
```



### 注册页 HTML

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>CSS伸缩布局之注册页面</title>
        <link rel="stylesheet" type="text/css" href="./css/register.css" />
    </head>
    <body>
        <div id="container">
            <div id="left">
                <font id="f1">新用户注册</font> <br>
                <font id="f2">USER REGISTER</font>
            </div>
            <div id="center">
                <form action="post" method="/servlet">
                    <table>
                        <tr>
                            <td>账户</td>
                            <td>
                                <input type="text" name="username" placeholder="请输入账户" />
                            </td>
                        </tr>
                        <tr>
                            <td>密码</td>
                            <td>
                                <input type="password" name="password" placeholder="请输入密码" />
                            </td>
                        </tr>
                        <tr>
                            <td>确认密码</td>
                            <td>
                                <input type="password" name="password" placeholder="请输入密码" />
                            </td>
                        </tr>
                        <tr>
                            <td>姓名</td>
                            <td>
                                <input type="text" name="realname" placeholder="请输入姓名" />
                            </td>
                        </tr>
                        <tr>
                            <td>邮箱</td>
                            <td>
                                <input type="text" name="email" placeholder="请输入邮箱" />
                            </td>
                        </tr>
                        <tr>
                            <td>电话</td>
                            <td>
                                <input type="text" name="phone" placeholder="请输入电话" />
                            </td>
                        </tr>
                        <tr>
                            <td>出生日期</td>
                            <td>
                                <input type="text" name="birthday" placeholder="YYYY-MM-DD" />
                            </td>
                        </tr>
                        <tr>
                            <td>验证码</td>
                            <td id="codes">
                                <input id="code" type="text" name="code" placeholder="请输入验证码" />
                                <img id="img" src="img/java.png">
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <button type="submit">注册</button>
                            </td>
                        </tr>
                    </table>
                </form>
            </div>

            <div id="right">
                <font>已有账户？</font>
                <a href="index.html">立即登录</a>
            </div>

        </div>
    </body>
</html>

```
