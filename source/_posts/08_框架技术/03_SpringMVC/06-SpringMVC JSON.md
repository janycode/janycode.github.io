---
title: 06-SpringMVC JSON
date: 2018-6-20 22:59:44
tags:
- SpringMVC
- JSON
categories: 
- 08_框架技术
- 03_SpringMVC
---





![image-20200620175456961](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200620175458.png)

参考资料：https://spring-mvc.linesh.tw/



### 1. JSON 注解获取/响应

一般用于 ajax 中获取请求 json 类型的数据和返回响应 json 类型的数据。

* **`@RequestBody`** ：用于获取请求体 json 的数据（写在形参类型前）
    ajax 中设置请求参数为 json 类型：`contentType:application/json`

> 注意：GET方式请求不可以获取请求体 json 数据。

* **`@ResponseBody`**：用于响应 json 数据（写在返回值类型前）
    ajax 中设置响应参数为 json 类型：`dataType: "json"`

> 注意：
>
> 1. 前提是需要提前导入 json 的 jar 包依赖。
> 2. **`@RestController` = @Controller + @ResponseBody** 使用一个 @RestController 有双重效果。



1. 在 pom.xml 中导入依赖 `jackson-databind`

```xml
	<dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-databind</artifactId>
      <version>2.9.0</version>
    </dependency>
```

2. 编写 html/jsp 页面

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>登陆</title>
    <script src="js/jquery-3.2.1.min.js"></script>
</head>
<body>

<form>
    id: <input type="text" name="id" id="id"> <br>
    username:<input type="text" name="username" id="username"> <br>
    password:<input type="text" name="password" id="password"> <br>

    <input type="button" value="登陆1" onclick="login1()">
    <input type="button" value="登陆2" onclick="login2()">
</form>

<script>
    // 测试 普通 响应数据
    function login1() {
        $.ajax({
            type: "POST",
            url: "user/testAjax1",
            dataType: "json",
            data: $("form").serialize(),
            success: function (data, status, xmlHttpRequest) {
                console.log(data);
                console.log(data.id + "," + data.username + "," + data.password);
                console.log(status);
                console.log(xmlHttpRequest.responseText);
            },
            error: function () {
                console.log("ajax error...");
            }
        });
    }
	// 测试 JSON 响应数据
    function login2() {
        let id = $("#id").val();
        let username = $("#username").val();
        let password = $("#password").val();
        $.ajax({
            type: "POST",
            url: "user/testAjax2",
            dataType: "json",
            // 注意 JSON 字符串的格式：
            data: '{"id":' + id + ', "username":"' + username + '", "password":"' + password + '"}',
            contentType: "application/json;charset=UTF-8", // 声明请求参数为 json 字符串，对应 @RequestBody 注解。
            success: function (data) {
                console.log(data);
            },
            error: function () {
                console.log("ajax error...");
            }
        });
    }

</script>

</body>
</html>
```

3. 在 Controller 中添加方法

```java
@RestController // @RestController = @Controller + @ResponseBody
@RequestMapping("/user")
public class UserController {
	//模拟异步请求响应1
    @RequestMapping("/testAjax1")
    public @ResponseBody User testAjax1(User user) {
        // 客户端发送ajax的请求，传的是json字符串，后端把json字符串封装到user对象中
        System.out.println(user);
        // 做响应，模拟查询数据库
        user.setId(111);
        user.setUsername("李四111");
        user.setPassword("12345678");
        // 做响应
        return user;
    }
	//模拟异步请求响应2
    @RequestMapping("/testAjax2")
    public @ResponseBody User testAjax2(@RequestBody User user) {
        System.out.println(user);
        user.setId(222);
        user.setUsername("李四222");
        user.setPassword("12345678");
        return user;
    }
}
```



### 2. JSON 转换

1. 常用的Json框架：**`Jackson`**  `FastJson`  `Gson`
    JavaBean 序列化转换为 Json 格式，性能：Jackson > FastJson > Gson > Json-lib

    > ★ 3种 Json 框架 JSON 数据 在 Java 中的相互转换：[Java JSON解析转换](https://janycode.github.io/2018/05/04/04_%E7%BD%91%E9%A1%B5%E6%8A%80%E6%9C%AF/06_JavaScript/06-JS&Java%20JSON%E8%A7%A3%E6%9E%90%E8%BD%AC%E6%8D%A2/index.html)
    
2. Jackson常用注解

* **`@JsonIgnore`**
    指定属性不返回。
* **`@JsonFormat`**(pattern = "yyyy-MM-dd hh:mm:ss", locale = "zh", timezone = "GMT+8")
    指定日期属性，pattern 日期格式、locale 区域(zh 中国)、timezone 时区(中国东八区)。
* **`@JsonProperty`**("别名")
    给属性指定别名。



测试 Jackson 注解：

```java
// 实体类
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mytime {
    @JsonIgnore
    private Integer id;
    @JsonProperty("username")
    private String name;
    @JsonProperty("pwd")
    private String password;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss,SSS E", locale = "zh", timezone = "GMT+8")
    private Date date;
}
```

```java
// 控制器
@RestController
@RequestMapping("/user")
public class UserController {
    @RequestMapping("testJson")
    public @ResponseBody List<Mytime> testMytime() {
        List<Mytime> list = new ArrayList<>();
        list.add(new Mytime(1, "aaa", "111", new Date()));
        list.add(new Mytime(1, "aaa", "111", new Date()));
        list.add(new Mytime(1, "aaa", "111", new Date()));
        return list;
    }
}
```

