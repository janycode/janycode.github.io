---
title: 10_SpringBoot+Quartz
date: 2018-6-20 17:59:44
tags:
- SpringBoot
- Quartz
categories: 
- 08_框架技术
- 04_SpringBoot
---

![image-20200708160944615](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708160946.png)

参考资料：https://www.springcloud.cc/spring-boot.html

中文文档2：https://felord.cn/_doc/_springboot/2.1.5.RELEASE/_book/index.html



#### 1. 导入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-quartz</artifactId>
</dependency>
```



#### 2. 任务类

```java
package com.demo.quartz;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.util.Date;

@Component
public class MyQuartz {
    @Scheduled(cron="*/2 * * * * ? ") // 每隔 2s 执行一次
    public void testQuartz(){
        System.out.println("testQuartz："+new Date().toLocaleString());
    }
}
```



#### 3. @EnableScheduling

在启动类添加 `@EnableScheduling` 配置，然后直接启动测试。

```java
package com.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class Springboot02Application {
    public static void main(String[] args) {
        SpringApplication.run(Springboot02Application.class, args);
    }
}
```