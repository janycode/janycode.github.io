---
title: 02-logback-spring.xml日志配置
date: 2016-4-28 21:57:13
tags:
- logback
- Spring
categories: 
- 09_调试测试
- 01_日志记录
---



```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration scan="true" scanPeriod="6000000" debug="false">

    <property name="LOG_PATTERN" value="%date{HH:mm:ss.SSS} %-5p [%t:%c{1}:%L] - %msg%n"/>
    <!--
    将日志文件的保存位置修改为自定义的路径,当前的配置是在项目的目录中新建一个logs目录,在logs中创建具体的模块的日志目录.
    -->
    <property name="LOG_PATH" value="./logs/cache/"/>
    <!-- 系统级配置文件　开始 -->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <layout class="ch.qos.logback.classic.PatternLayout">
            <Pattern>${LOG_PATTERN}</Pattern>
        </layout>
    </appender>

    <!-- stdout -->
    <appender name="rootstdout"
              class="ch.qos.logback.core.rolling.RollingFileAppender">
        <File>${LOG_PATH}rootstdout.log</File>
        <rollingPolicy class="ch.qos.logback.core.rolling.FixedWindowRollingPolicy">
            <FileNamePattern>${LOG_PATH}rootstdout.%i.log.zip</FileNamePattern>
            <MinIndex>1</MinIndex>
            <MaxIndex>20</MaxIndex>
        </rollingPolicy>
        <triggeringPolicy
                class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
            <MaxFileSize>10MB</MaxFileSize>
        </triggeringPolicy>
        <layout class="ch.qos.logback.classic.PatternLayout">
            <Pattern>${LOG_PATTERN}</Pattern>
        </layout>
    </appender>

    <!-- debug -->
    <appender name="rootDebug" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <File>${LOG_PATH}root-debug.log</File>
        <rollingPolicy class="ch.qos.logback.core.rolling.FixedWindowRollingPolicy">
            <FileNamePattern>${LOG_PATH}root-debug.%i.log.zip</FileNamePattern>
            <MinIndex>1</MinIndex>
            <MaxIndex>10</MaxIndex>
        </rollingPolicy>
        <triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
            <MaxFileSize>10MB</MaxFileSize>
        </triggeringPolicy>
        <layout class="ch.qos.logback.classic.PatternLayout">
            <Pattern>${LOG_PATTERN}</Pattern>
        </layout>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>DEBUG</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <!-- info -->
    <appender name="rootInfo" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <File>${LOG_PATH}root-info.log</File>
        <rollingPolicy class="ch.qos.logback.core.rolling.FixedWindowRollingPolicy">
            <FileNamePattern>${LOG_PATH}root-info.%i.log.zip</FileNamePattern>
            <MinIndex>1</MinIndex>
            <MaxIndex>10</MaxIndex>
        </rollingPolicy>
        <triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
            <MaxFileSize>10MB</MaxFileSize>
        </triggeringPolicy>
        <layout class="ch.qos.logback.classic.PatternLayout">
            <Pattern>${LOG_PATTERN}</Pattern>
        </layout>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>INFO</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <!-- warn -->
    <appender name="rootWarn" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <File>${LOG_PATH}root-warn.log</File>
        <rollingPolicy class="ch.qos.logback.core.rolling.FixedWindowRollingPolicy">
            <FileNamePattern>${LOG_PATH}root-warn.%i.log.zip</FileNamePattern>
            <MinIndex>1</MinIndex>
            <MaxIndex>10</MaxIndex>
        </rollingPolicy>
        <triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
            <MaxFileSize>10MB</MaxFileSize>
        </triggeringPolicy>
        <layout class="ch.qos.logback.classic.PatternLayout">
            <Pattern>${LOG_PATTERN}</Pattern>
        </layout>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>WARN</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <!-- error -->
    <appender name="rootError" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <File>${LOG_PATH}root-error.log</File>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <FileNamePattern>${LOG_PATH}root-error.%d{yyyy-MM-dd}.log</FileNamePattern>
            <MaxHistory>30</MaxHistory>
        </rollingPolicy>
        <layout class="ch.qos.logback.classic.PatternLayout">
            <Pattern>${LOG_PATTERN}</Pattern>
        </layout>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>Error</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <springProfile name="local">
        <root level="info">
            <!-- 本地测试时使用，将日志打印到控制台,实际部署时请注释掉 -->
            <appender-ref ref="STDOUT"/>
            <appender-ref ref="rootstdout"/>
            <appender-ref ref="rootDebug"/>
            <appender-ref ref="rootInfo"/>
            <appender-ref ref="rootWarn"/>
            <appender-ref ref="rootError"/>
        </root>
    </springProfile>

    <springProfile name="dev">
        <root level="info">
            <!-- 本地测试时使用，将日志打印到控制台,实际部署时请注释掉 -->
            <appender-ref ref="rootstdout"/>
            <appender-ref ref="rootDebug"/>
            <appender-ref ref="rootInfo"/>
            <appender-ref ref="rootWarn"/>
            <appender-ref ref="rootError"/>
        </root>
    </springProfile>

    <springProfile name="prod">
        <root level="info">
            <!-- 本地测试时使用，将日志打印到控制台,实际部署时请注释掉 -->
            <appender-ref ref="rootstdout"/>
            <appender-ref ref="rootDebug"/>
            <appender-ref ref="rootInfo"/>
            <appender-ref ref="rootWarn"/>
            <appender-ref ref="rootError"/>
        </root>
    </springProfile>
    <include resource="org/springframework/boot/logging/logback/base.xml"/>
    <jmxConfigurator/>
</configuration>
```

