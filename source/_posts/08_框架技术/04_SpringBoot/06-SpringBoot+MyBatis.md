---
title: 06_SpringBoot+MyBatis
date: 2018-6-20 17:59:44
tags:
- SpringBoot
- MyBatis
categories: 
- 08_框架技术
- 04_SpringBoot
---

![image-20200708160944615](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708160946.png)

参考资料：https://www.springcloud.cc/spring-boot.html

中文文档2：https://felord.cn/_doc/_springboot/2.1.5.RELEASE/_book/index.html



### 1. 导入依赖

```xml
<!--  引入mybatis相关依赖，必须写版本号 -->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.1</version>
</dependency>

<!--  引入mysql相关依赖，如果不写版本号，引入的8.0以上版本
 可以设置为其他版本
 -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```

### 2. 配置文件

如果使用 properties 格式的配置：application.properties

```sh
# 数据库配置
# 默认使用mysql的驱动是8.x的版本，注意driver-class-name，url中增加时区的配置
spring.datasource.url=jdbc:mysql://localhost:3306/数据库名?serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# mybatis配置
# 引入映射文件
mybatis.mapper-locations=classpath:mapper/*.xml
# 配置别名需要扫描的包
mybatis.type-aliases-package=com.demo.pojo
# 配置日志在控制台显示sql语句
mybatis.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
```



如果使用 yml 格式的配置：application.yml

```yaml
# 数据库配置
spring:
  datasource:
    username: root
    password: 123456
    url: jdbc:mysql://localhost:3306/数据库名?serverTimezone=Asia/Shanghai
    driver-class-name: com.mysql.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource

# mybatis 配置
mybatis:
  mapper-locations: classpath:com/demo/dao/*.xml
  type-aliases-package: com.demo.pojo
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```



### 3. 实体类

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    private Integer id;
    private String name;
    private Double money;
}
```



### 4. Mapper

```JAVA
import com.demo.pojo.Account;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AccountMapper {
    public List<Account> findAll();
}
```



### 5. Mapper.xml

在 src\main\resources\mapper 路径下创建对应的 AccountMapper.xml 文件

```xml
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >

<mapper namespace="com.demo.mapper.AccountMapper">
    <select id="findAll" resultType="com.demo.pojo.Account">
        select * from account
    </select>
</mapper>
```




### 6. Service

```java
import com.demo.pojo.Account;
import java.util.List;

public interface AccountService {
    public List<Account> findAll();
}
```



### 7. ServiceImpl

```java
import com.demo.mapper.AccountMapper;
import com.demo.pojo.Account;
import com.demo.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountServiceImpl implements AccountService {
    @Autowired
    private AccountMapper accountMapper;
    
    @Override
    public List<Account> findAll() {
        return accountMapper.findAll();
    }
}
```



### 8. Controller

```java
import com.demo.pojo.Account;
import com.demo.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/account")
public class AccountController {
    @Autowired
    private AccountService accountService;

    @RequestMapping("/findAll")
    public List<Account> findAll(){
        return accountService.findAll();
    }
}
```



### 9. `@MapperScan`

> 注意：需要在启动类上添加 `@MapperScan` 扫描 Mapper

```java
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.demo.mapper")  // 扫描 Mapper
public class Springboot02Application {
    public static void main(String[] args) {
        SpringApplication.run(Springboot02Application.class, args);
    }
}
```



### 10. 分页插件整合

pom.xml - 【`注意`】如果低版本有循环依赖报错，就升高版本即可，如 **1.4.7** 版本验证无误可用，没有循环依赖问题。

```xml
<!--分页插件-->
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>1.2.13</version>
</dependency>
```

Controller 控制器

```java
import com.demo.pojo.Account;
import com.demo.service.AccountService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/account")
public class AccountController {
    @Autowired
    private AccountService accountService;
    
    @RequestMapping("/findByPage")
    public PageInfo<Account> findAll(@RequestParam(defaultValue = "1") Integer pageNum,
                                 @RequestParam(defaultValue = "5") Integer pageSize) {

        PageHelper.startPage(pageNum, pageSize);
        List<Account> accountList = accountService.findAll();
        return new PageInfo<>(accountList);
    }
}
```

![image-20200709143234884](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200709143236.png)



### 11. 使用Druid连接池进行测试

#### 11.1 导入依赖

```xml
<dependency>
   <groupId>com.alibaba</groupId>
   <artifactId>druid-spring-boot-starter</artifactId>
   <version>1.1.10</version>
</dependency>
```



#### 11.2 application.properties

```sh
#使用阿里巴巴druid数据源，默认使用自带的
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
```



#### 11.3 application.yml

```yaml
mybatis:
  type-aliases-package: com.demo.pojo
  mapper-locations: classpath:mapper/*.xml
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl

spring:
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    url: jdbc:mysql://localhost:3306/java2001?serverTimezone=Asia/Shanghai
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver
```