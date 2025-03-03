---
title: 09_SpringBoot+Thymeleaf
date: 2018-6-20 17:59:44
tags:
- SpringBoot
- Thymeleaf
- 模板引擎
categories: 
- 08_框架技术
- 04_SpringBoot
---

![image-20200708160944615](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708160946.png)

参考资料：https://www.springcloud.cc/spring-boot.html

中文文档2：https://felord.cn/_doc/_springboot/2.1.5.RELEASE/_book/index.html



### 1. Thymeleaf 模板引擎

Thymeleaf ：Java 模板引擎，模板格式.html 

Freemarker、JSP差不多 

* 文本：直接输出的的内容

* 表达式：可以获取域中的的内容，并且进行技术处理

![image-20200711001027129](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200711001028.png)

![image-20200711001043090](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200711001044.png)

```html
   xmlns:th="http://www.thymeleaf.org"
<html lang="en" xmlns:th="http://www.w3.org/1999/xhtml">
```



* 获取数据
    属性标签 
    th:xxx=“${属性名称}” 


![image-20200711001151432](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200711001152.png)

* 分支和循环
    th:if="条件验证" 
    th:each="变量名:${属性名称}" 

th:each="变量名:${属性名称}" 



> SpringBoot 集成 Thymeleaf 模板引擎。

### 2. 导入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```



### 3. application.properties

```sh
########## 配置thymeleaf ##########
spring.thymeleaf.cache=false
spring.thymeleaf.encoding=utf-8
spring.thymeleaf.prefix=classpath:/templates
spring.thymeleaf.suffix=.html
spring.thymeleaf.mode=HTML5
spring.thymeleaf.servlet.content-type=text/html
```



### 4. 实体类

```java
package com.demo.pojo;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Integer id;
    private String username;
    private String password;
    private Date birthday;
}
```



### 5. Controller

```java
package com.demo.controller;

import com.demo.pojo.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.Date;

@Controller
@RequestMapping("user")
public class UserController {

    @RequestMapping("findAll")
    public String findAll(Model model) {
        ArrayList<User> users = new ArrayList<>();

        users.add(new User(1001, "张三", "123", new Date()));
        users.add(new User(1002, "李四", "456", new Date()));
        users.add(new User(1003, "王五", "789", new Date()));

        model.addAttribute("users", users);
        return "/list";
    }

    @RequestMapping("findById")
    public String findById(Model model, String uid) {
        System.out.println(uid);

        if (uid.equals("1001")) {
            User user = new User(1001, "张三", "123", new Date());
            model.addAttribute("user", user);
        }
        return "/queryOne";
    }
}
```



### 6. 创建 templates

在 templates 目录下创建 list.html 以及 queryOne.html

list.html

```xml
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>

<div th:if="${users!=null}">
    <table border="1" width="600">
        <tr th:each="user,state : ${users}">
            <td th:text="${state.count}"></td>
            <td th:text="${user.id}"></td>
            <td th:text="${user.username}"></td>

            <td th:text="${#dates.format(user.birthday, 'yyyy-MM-dd HH:mm:ss')}"></td>
        </tr>
    </table>

    <hr>
    <table border="1" width="600">

        <!-- 第二个变量，可以获取遍历的元素的状态-->

        <tr th:each="user,state : ${users}">
            <td th:text="${state.index}"></td>
            <td th:text="${user.id}"></td>
            <td th:text="${user.username}"></td>
            <td th:text="${#dates.format(user.birthday, 'yyyy-MM-dd HH:mm:ss')}"></td>
        </tr>
    </table>
    <hr>

    <table border="1" width="600">
        <!--如果不设置表示状态的变量，默认遍历的元素的变量名+Stat
表示状态的变量-->
        <tr th:each="user : ${users}">
            <td th:text="${userStat.count}"></td>
            <td th:text="${user.id}"></td>
            <td th:text="${user.username}"></td>
            <td th:text="${#dates.format(user.birthday, 'yyyy-MM-
dd HH:mm:ss')}"></td>
        </tr>
    </table>

</div>

<hr color="red">

<table border="1" width="600">
    <tr>
        <th>序号</th>
        <th>姓名</th>
        <th>生日</th>
        <th>详情</th>
    </tr>
    <tr th:each="user : ${users}">
        <td th:text="${userStat.count}"></td>
        <td th:text="${user.username}"></td>
        <td th:text="${#dates.format(user.birthday, 'yyyy-MM-dd HH:mm:ss')}"></td>
        <td><a th:href="@{/user/findById(uid=${user.id})}">查询</a></td>
    </tr>
</table>
</body>
</html>
```

queryOne.html

```xml
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<form th:object="${user}">
    <!-- *{...}选择表达式一般跟在th:object后，直接选择object中的属性-->
    <input type="hidden" th:id="*{id}" name="id">
    用户名：<input type="text" th:value="*{username}" name="username" /><br /><br />
    密码：<input type="text" th:value="*{password}" name="password"/>
</form>

</body>
</html>
```



### 7. Thymeleaf和Freemarker区别

这两个都是属于模板引擎，但是各有各的好处，
enn,在市面上比较多的也就是jsp、freemarker、velocity、thymeleaf等页面方案。


`FreeMarker`是一个**用Java语言编写的模板引擎，它基于模板来生成文本输出**。FreeMarker与Web容器无关，即在Web运行时，它并不知道Servlet或HTTP。它不仅可以用作表现层的实现技术，而且还可以用于生成XML，JSP或Java 等。

目前企业中: **主要用 Freemarker 做静态页面或是页面展示**
**优点：**
1、不能编写java代码，可以实现严格的mvc分离
2、性能非常不错
3、对jsp标签支持良好
4、内置大量常用功能，使用非常方便
5、宏定义（类似jsp标签）非常方便
6、使用表达式语言
**缺点：**
1、不是官方标准
2、用户群体和第三方标签库没有jsp多



`Thymeleaf`是个**XML/XHTML/HTML5模板引擎，可以用于Web与非Web应用**。

Thymeleaf的主要目标在于提供一种可被浏览器正确显示的、格式良好的模板创建方式，因此也可以用作静态建模。你可以使用它创建经过验证的XML与HTML模板。相对于编写逻辑或代码，开发者只需将标签属性添加到模板中即可。接下来，这些标签属性就会在DOM（文档对象模型）上执行预先制定好的逻辑。Thymeleaf的可扩展性也非常棒。你可以使用它定义自己的模板属性集合，这样就可以计算自定义表达式并使用自定义逻辑。这意味着Thymeleaf还可以作为模板引擎框架。

优点：
静态html嵌入标签属性，浏览器可以直接打开模板文件，便于前后端联调。





  



  



  



  



  



  