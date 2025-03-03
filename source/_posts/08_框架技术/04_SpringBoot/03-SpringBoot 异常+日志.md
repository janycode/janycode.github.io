---
title: 03_SpringBoot 异常+日志
date: 2018-6-20 17:59:44
tags:
- SpringBoot
- 异常
- 日志
categories: 
- 08_框架技术
- 04_SpringBoot
---





![image-20200708160944615](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708160946.png)

参考资料：https://www.springcloud.cc/spring-boot.html

中文文档2：https://felord.cn/_doc/_springboot/2.1.5.RELEASE/_book/index.html



### 1. 全局异常处理

SpringBoot 中的异常处理：

#### 1.1 测试类

```java
import com.demo.exception.MyException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ex")
public class ExceptionController {

    @RequestMapping("/ex1")
    public void ex1() {
        int i = 1/0; // 手动制造一个异常
    }

    @RequestMapping("/my")
    public void my() throws MyException {
        throw new MyException("自定义异常"); // 手动抛出一个自定义异常
    }
}
```

#### 1.2 自定义异常类

```java
public class MyException extends Throwable {
    public MyException(String msg) {
        super(msg);
    }
}
```

#### 1.3 全局异常处理类

* `@RestControllerAdvice` 修饰全局异常处理类，用于拦截异常

* `@ExceptionHandler(value = xxx.class)` 修饰全局异常处理类中的方法，用于处理指定异常

```java
package com.demo.exception;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;

@RestControllerAdvice // 拦截异常
public class MyExceptionHandler {
    /**
     * 处理指定异常
     * @return
     */
    @ExceptionHandler(value = Exception.class)
    public Object handler1(Exception e, HttpServletRequest request) {
        System.out.println("handler1");

        HashMap<Object, Object> map = new HashMap<>();
        map.put("msg", e.getMessage());
        map.put("url", request.getRequestURL());
        return map;
    }

    /**
     * 自定义异常处理
     * @return
     */
    @ExceptionHandler(value = MyException.class)
    public Object handler2(Exception e, HttpServletRequest request) {
        System.out.println("handler2");

        HashMap<Object, Object> map = new HashMap<>();
        map.put("msg", e.getMessage());
        map.put("url", request.getRequestURL());
        return map;
    }
}
```

访问测试：http://localhost:8081/ex/ex1

![image-20200708221952070](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708221953.png)

访问测试：http://localhost:8081/ex/my

![image-20200708222040166](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708222041.png)



### 2. 日志

SpringBoot 默认使用的日志是 `Logback`，官方建议日志文件命名为：`logback-spring.xml`

在 resources 目录下创建 logback-spring.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- scan:当此属性设置为true时，配置文件如果发生改变，将会被重新加载，默认值为true -->
<!-- scanPeriod:设置监测配置文件是否有修改的时间间隔，如果没有给出时间单位，默认单位是毫秒。当scan为true时，此属性生效。
	 默认的时间间隔为1分钟。 -->
<!-- debug:当此属性设置为true时，将打印出logback内部日志信息，实时查看logback运行状态。默认值为false。 -->
<configuration  scan="true" scanPeriod="60 seconds" debug="true">

    <!-- 存储位置任选其一 -->
    <!-- 存储位置配置1：定义变量，可通过 ${log.path}和${CONSOLE_LOG_PATTERN} 得到变量值 -->
    <property name="log.path" value="D:/log" />
    <!-- 存储位置配置2：当前的配置是在项目的目录中新建一个logs目录,在logs中创建具体的模块的日志目录 -->
    <property name="LOG_PATH" value="./logs/cache/"/>
    
    <property name="CONSOLE_LOG_PATTERN"
              value="%d{yyyy-MM-dd HH:mm:ss.SSS} |-[%-5p] in %logger.%M[line-%L] -%m%n"/>

    <!-- 输出到控制台 -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <!-- Threshold=即最低日志级别，此appender输出大于等于对应级别的日志
             (当然还要满足root中定义的最低级别)
        -->
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>debug</level>
        </filter>
        <encoder>
            <!-- 日志格式(引用变量) -->
            <Pattern>${CONSOLE_LOG_PATTERN}</Pattern>
            <!-- 设置字符集 -->
            <charset>UTF-8</charset>
        </encoder>
    </appender>

    <!-- 追加到文件中 -->
    <appender name="file1" class="ch.qos.logback.core.FileAppender">
        <file>${log.path}/mylog1.log</file>
        <encoder>
            <pattern>${CONSOLE_LOG_PATTERN}</pattern>
        </encoder>
    </appender>

    <!-- 滚动追加到文件中 -->
    <appender name="file2" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!-- 正在记录的日志文件的路径及文件名 -->
        <file>${log.path}/mylog2.log</file>
        <!--日志文件输出格式-->
        <encoder>
            <pattern>${CONSOLE_LOG_PATTERN}</pattern>
            <charset>UTF-8</charset> <!-- 设置字符集 -->
        </encoder>
        <!-- 日志记录器的滚动策略，按日期，按大小记录
             文件超过最大尺寸后，会新建文件，然后新的日志文件中继续写入
             如果日期变更，也会新建文件，然后在新的日志文件中写入当天日志
        -->
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- 新建文件后，原日志改名为如下  %i=文件序号，从0开始 -->
            <fileNamePattern>${log.path}/newlog-%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <!-- 每个日志文件的最大体量 -->
            <timeBasedFileNamingAndTriggeringPolicy
                    class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>1kb</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            <!-- 日志文件保留天数，1=则只保留昨天的归档日志文件 ,不设置则保留所有日志-->
            <maxHistory>1</maxHistory>
        </rollingPolicy>
    </appender>

    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="file1"/>
        <appender-ref ref="file2"/>
    </root>
</configuration>
```

