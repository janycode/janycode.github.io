---
title: 02_SpringBoot YML
date: 2018-6-20 17:59:44
tags:
- SpringBoot
- YAML
- 配置
categories: 
- 08_框架技术
- 04_SpringBoot
---





![image-20200708160944615](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708160946.png)

参考资料：https://www.springcloud.cc/spring-boot.html

中文文档2：https://felord.cn/_doc/_springboot/2.1.5.RELEASE/_book/index.html



### 1. SpringBoot 默认配置

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708165445.png)

可以从 jar 包中找到 SpringBoot 的默认配置文件位置。

SpringBoot 是基于约定的，所以很多配置都有默认值，但如果想使用自己的配置替换默认配置的话，就可以使用`application.properties` 或者 `application.yml`（application.yaml）进行配置，SpringBoot 默认会从 Resources 目录下加载 application.properties 或 application.yml（application.yaml）文件。

其中，application.properties 文件是键值对类型的文件，除此之外，SpringBoot 还可以使用 yml 文件进行配置，YML 文件格式是 YAML (YAML Aint Markup Language) 编写的文件格式，YAML 是一种直观的能够被电脑识别的的数据数据序列化格式，并且容易被人类阅读，容易和脚本语言交互的，可以被支持 YAML 库的不同的编程语言程序导入，比如： C/C++, Ruby, Python, Java, Perl, C#, PHP 等。

YML 文件是以数据为核心的，比传统的 xml 方式更加简洁，YML 文件的扩展名可以使用 `.yml `或者 `.yaml`。

* pom 中 配置文件的加载顺序：

![image-20200710082528176](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200710082529.png)

![image-20200710082635699](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200710082636.png)

* application.properties 方式修改默认配置：

![image-20200708213826823](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708213828.png)



* application.yml 方式修改默认配置：（注意：yml 文件中空格表示层级关系）

![image-20200708214208076](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708214209.png)

 

查找 spring boot 集成的依赖：

![image-20200709092042727](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200709092044.png)



###  2. yml 配置格式

```yml
#普通数据的配置
name: jack

#对象的配置
user:
  username: rose
  password: 123

#配置数组
array:
  beijing,
  tianjin,
  shanghai

#配置集合
demo:
  test:
    name: tom
    arr: 1,jack,2,tom  #这种对象形式的，只能单独写一个对象去接收，所以无法使用 @value 注解获取
    list1:
      - zhangsan
      - lisi
    list2:
      - driver: mysql
        port: 3306
      - driver: oracle
        port: 1521
    map:
      key1: value1
      key2: value2

#端口配置
server:
  port: 8081
```



### 3. 获取配置文件值

把 yml 文件中配置的内容注入到成员变量中。

* 第一种方式，使用 `@Value` 注解方式注入

```java
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/yml")
@Data
public class YmlController {

    @Value("${name}")
    private String name;
    @Value("${user.username}")
    private String username;
    @Value("${user.password}")
    private String password;
    @Value(("${array}"))
    private String[] array;

    @RequestMapping("/test")
    public String[] test() {
        System.out.println("name = " + name);
        System.out.println("username = " + username);
        System.out.println("password = " + password);
        return array;
    }
}
```

访问：http://localhost:8081/yml/test

输出：

name = jack
username = rose
password = 123

* 第二种方式，使用 `@ConfigurationProperties` 注解方式，提供 GET/SET 方法

```java
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@ConfigurationProperties(prefix = "demo.test")
@RequestMapping("/yml")
@Data
public class YmlController {

    private String name;
    private String[] arr;
    private List<String> list1;
    private List<Map<String, String>> list2;
    private Map<String, String> map;

    @RequestMapping("/test2")
    public List<Map<String, String>> test2() {
        System.out.println("name = " + name);
        System.out.println("Arrays.toString(arr) = " + Arrays.toString(arr));
        System.out.println("list1 = " + list1);
        System.out.println("map = " + map);
        return list2;
    }
}
```

访问：http://localhost:8081/yml/test2

输出：

name = tom
Arrays.toString(arr) = [1, jack, 2, tom]
list1 = [zhangsan, lisi]
map = {key1=value1, key2=value2}



如果使用 @ConfigurationProperties 注解时提示以下信息：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708220033.png)

 

导入依赖即可（也可以不导入）

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
```

