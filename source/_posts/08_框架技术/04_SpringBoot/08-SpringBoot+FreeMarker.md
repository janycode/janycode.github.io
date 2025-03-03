---
title: 08_SpringBoot+FreeMarker
date: 2018-6-20 17:59:44
tags:
- SpringBoot
- FreeMarker
- 模板引擎
categories: 
- 08_框架技术
- 04_SpringBoot
---

![image-20220306114112047](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220306114113.png)

官方文档: http://freemarker.foofun.cn/toc.html

参考资料: https://www.cnblogs.com/itdragon/p/7750903.html



> FreeMarker 是一款 *模板引擎*： 即一种基于模板和要改变的数据， 并用来生成输出文本(HTML网页，电子邮件，配置文件，源代码等)的通用工具。 它不是面向最终用户的，而是一个Java类库，是一款程序员可以嵌入他们所开发产品的组件。

SpringBoot整合FreeMarker，验证页面静态化：批量生成静态页面（html）。

#### 1. 导入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-freemarker</artifactId>
</dependency>
```



#### 2. application.properties

```sh
########## 配置freemarker ##########
#是否开启缓存
spring.freemarker.cache=false
#模板路径
spring.freemarker.template-loader-path=classpath:/templates
#文件后缀
spring.freemarker.suffix=.ftl
#编码方式
spring.freemarker.charset=UTF-8
#文本类型
spring.freemarker.content-type=text/html
```



#### 3. 实体类

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    private Integer id;
    private String name;
    private Integer age;
    private String address;
}
```



#### 4. 创建 ftl 文件

在 templates 目录下创建 student.ftl 文件（ 然后把该ftl文件拷贝到 D:/ftl 目录下，生成时用）。

```xml
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <table border="1" width=600>
        <tr>
            <th>index</th>
            <th>id</th>
            <th>name</th>
            <th>age</th>
            <th>address</th>
        </tr>
        <#list students as student>
            <#if student_index % 2 == 0>
            <tr bgcolor="red">
                <#else>
            <tr bgcolor="yellow">
            </#if>
            <td>${student_index}</td>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.address}</td>
            </tr>
        </#list>
    </table>
</body>
</html>
```



#### 5. Controller

```java
import com.demo.pojo.Student;
import freemarker.template.Configuration;
import freemarker.template.Template;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.HashMap;

@Controller
@RequestMapping("/freemarker")
public class FreeMarkerController {

    @RequestMapping("/student")
    public String hello(Model model) throws Exception {

        //创建List集合获取多个元素
        ArrayList<Student> students = new ArrayList<>();
        students.add(new Student(1, "jack", 18, "郑州二七"));
        students.add(new Student(2, "rose", 19, "郑州中原"));
        students.add(new Student(3, "tom", 20, "郑州金水"));

        model.addAttribute("students",students);

        return "/student";
    }

    //生成静态页面的方法 - 通用方法，替换数据即可
    @RequestMapping("createHtml")
    @ResponseBody
    public String createHtml()throws Exception{
        //获取配置对象
        Configuration configuration = new Configuration(Configuration.DEFAULT_INCOMPATIBLE_IMPROVEMENTS);
        //设置字符集
        configuration.setDefaultEncoding("utf-8");

        //设置加载的模版目录
        configuration.setDirectoryForTemplateLoading(new File("D:/ftl"));
        //创建List集合获取多个元素
        ArrayList<Student> students = new ArrayList<>();
        students.add(new Student(1,"张三",18,"北京"));
        students.add(new Student(2,"李四",19,"上海"));
        students.add(new Student(3,"王五",20,"广州"));

        //使用map集合加载数据
        HashMap<String,ArrayList> map = new HashMap<>();
        map.put("students",students);

        //创建输出流对象
        FileWriter fileWriter = new FileWriter(new File("D:/ftl_html/student.html"));

        //获取加载的模板
        Template template = configuration.getTemplate("student.ftl");
        //生成html文件
        template.process(map,fileWriter);
        //关流
        fileWriter.close();

        return "success";
    }
}
```