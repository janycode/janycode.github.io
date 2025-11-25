---
title: 04-BootstrapValidator表单校验
date: 2018-5-13 21:36:21
tags:
- Bootstrap
- 校验
categories: 
- 04_大前端
- 07_Bootstrap
---



更好的表单校验：`Bootstrap Validator`
- 官网(GitHub)：[https://github.com/nghuuphuoc/bootstrapvalidator](https://github.com/nghuuphuoc/bootstrapvalidator)
- 官网(jQuery)：[https://plugins.jquery.com/bootstrapValidator/](https://plugins.jquery.com/bootstrapValidator/)
- 文档(API)：[http://bootstrapvalidator.votintsev.ru/api/](http://bootstrapvalidator.votintsev.ru/api/)

> API文档可以使用 谷歌浏览器 自动翻译中文、或 360浏览器右键翻译网页上的英文。


### 1. 概述
Bootstrap Validator 数据校验，就是表单验证，友好的错误提示可以提升用户体验，基于bootstrap、jQuery组成。

### 2. 环境配置
1. **导入组件库**
目录结构：
![Bootstrap Validator](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316144940.jpg)


2. **代码中引入**
当前项目引入 BootStrap Validator 相关的资源
引入 bootstrap.css
引入 bootstrapValidator.css
引入 jquery-3.5.1.min.js
引入 bootstrap.js
引入 bootstrapValidator.js

```html
<link href="bootstrap/css/bootstrap.min.css" rel="stylesheet">
<link href="bootstrapValidator/css/bootstrapValidator.min.css" rel="stylesheet">
<script src="js/jquery-3.5.1.min.js"></script>
<script src="bootstrap/js/bootstrap.min.js"></script>
<script src="bootstrapValidator/js/bootstrapValidator.min.js"></script> 
```

3. **使用** `<div class="form-group"> </div>` **包裹每一个 input 输入标签，且拥有 name 属性值**

```html
<div class="form-group">
    账户:<input type="text" name="username"><br>
</div>
```

### 3. 表单验证使用
**【普通验证】**
普通账号和密码输入框的验证和提示。
```html
<%--引入bootstrap.css / BootstrapValidator.css / jquery.js / Bootstrap.js / BootstrapValidator.js--%>
<link href="${pageContext.request.contextPath}/bootstrap/css/bootstrap.min.css" rel="stylesheet">
<link href="${pageContext.request.contextPath}/bootstrapValidator/css/bootstrapValidator.min.css" rel="stylesheet">
<script src="${pageContext.request.contextPath}/js/jquery-3.5.1.min.js"></script>
<script src="${pageContext.request.contextPath}/bootstrap/js/bootstrap.min.js"></script>
<script src="${pageContext.request.contextPath}/bootstrapValidator/js/bootstrapValidator.min.js"></script>

<script>
    $(function () {//页面加载完成
        $("#myForm").bootstrapValidator({
            message: "这不是合法的有效字段",//设置提示信息
            fields: {//设置要校验的字段集合
                username: {
                    validators: {
                        notEmpty: {
                            message: "用户名不能为空"
                        },
                        stringLength: {
                            min: 6,
                            max: 10,
                            message: "用户名长度在6-10之间"
                        },
                        regexp: {
                            regexp: /^[a-z0-9]{6,10}$/,
                            message: "用户名必须是小写字母+数字"
                        }
                    }
                },
                password: {
                    validators: {
                        notEmpty: {
                            message: "密码不能为空"
                        },
                        stringLength: {
                            min: 6,
                            max: 10,
                            message: "密码长度在6-10之间"
                        },
                        regexp: {
                            regexp: /^[a-z0-9]{6,10}$/,
                            message: "密码必须是小写字母+数字"
                        }
                    }
                }
            }
        });
    })
</script>

<form id="myForm" action="${pageContext.request.contextPath}/demo" method="post">
    <div class="form-group">
        账户:<input type="text" name="username"><br>
    </div>
    <div class="form-group">
        密码:<input type="text" name="password"><br>
    </div>
    <div class="form-group">
        <button type="submit">提交</button>
    </div>
</form>
```

**【高级验证】**
添加了更多的验证和验证成功与否的文字图标。

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Bootstrap Validator高级案例</title>
    <%--引入bootstrap.css / BootstrapValidator.css / jquery.js / Bootstrap.js / BootstrapValidator.js--%>
    <link href="${pageContext.request.contextPath}/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/bootstrapValidator/css/bootstrapValidator.min.css" rel="stylesheet">
    <script src="${pageContext.request.contextPath}/js/jquery-3.5.1.min.js"></script>
    <script src="${pageContext.request.contextPath}/bootstrap/js/bootstrap.min.js"></script>
    <script src="${pageContext.request.contextPath}/bootstrapValidator/js/bootstrapValidator.min.js"></script>

    <script>
        $(function () {//页面加载完成
            $("#myForm").bootstrapValidator({
                // 默认的提示消息
                message: "this is not valid field",
                // 表单框里右侧的icon
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    username: { // name="username"
                        validators: {
                            notEmpty: {
                                message: "账户不能为空！"
                            },
                            stringLength: {
                                message: "账户长度在6-10之间！",
                                min: 6,
                                max: 10
                            },
                            regexp: {
                                message: "账户由小写字母、数字组成！",
                                regexp: /^[a-z0-9]{6,10}$/
                            }
                        }
                    },
                    password: { // name="password" 密码不能与账户相同
                        validators: {
                            notEmpty: {
                                message: "密码不能为空！"
                            },
                            stringLength: {
                                message: "密码长度在6-10之间！",
                                min: 6,
                                max: 10
                            },
                            regexp: {
                                message: "密码由小写字母、数字组成！",
                                regexp: /^[a-z0-9]{6,10}$/
                            },
                            different: { // different：密码不能与账户相同
                                message: "账户和密码不能一致",
                                field: "username" // 比较的字段值
                            }
                        }
                    },
                    repassword: { // name="repassword" 确认密码与密码必须一致
                        validators: {
                            notEmpty: {
                                message: "确认密码不能为空！"
                            },
                            stringLength: {
                                message: "确认密码长度在6-10之间！",
                                min: 6,
                                max: 10
                            },
                            regexp: {
                                message: "确认密码由小写字母、数字组成！",
                                regexp: /^[a-z0-9]{6,10}$/
                            },
                            identical: { // identical：确认密码与密码必须一致
                                message: "两次密码不一致！",
                                field: "password" // 比较的字段值
                            }
                        }
                    },
                    email: { // name="email" 规则在 bootstrap 中已默认封装
                        validators: {
                            notEmpty: {
                                message: "邮箱不能为空！"
                            },
                            emailAddress: {
                                message: "邮箱格式不对！"
                            }
                        }
                    }
                }
            })
        });
    </script>
    <style>
        /* 控制 feedbackIcons 输入框后的图标的位置 */
        .form-control-feedback{
            left: 200px;
        }
    </style>
</head>
<body>

<br>
<form id="myForm" action="${pageContext.request.contextPath}/demo" method="post">

    <div class="form-group">
        账户:<input type="text" name="username"><br>
    </div>

    <div class="form-group">
        密码:<input type="text" name="password"><br>
    </div>
    确认密码:
    <div class="form-group">
        <input type="text" name="repassword"><br>
    </div>
    邮箱:
    <div class="form-group">
        <input type="text" name="email"><br>
    </div>
    <div class="form-group">
        <button type="submit">提交</button>
    </div>
</form>

</body>
</html>
```

![Bootstrap Validator](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316144951.png)