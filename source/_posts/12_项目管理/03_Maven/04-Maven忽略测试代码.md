---
title: 04-Maven忽略测试代码
date: 2018-5-23 22:18:03
tags:
- Maven
categories: 
- 12_项目管理
- 03_Maven
---



![maven](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/maven.jpg)



错误信息：

[ERROR] Failed to execute goal org.apache.maven.plugins:maven-surefire-plugin:2.10:test (default-test) on project web_nanchang: **There are test failures**.



测试代码时遇到错误，它会停止编译。只需要在 [pom.xml]() 的`<project>`里添加以下配置，使得测试出错不影响项目的编译。

```xml
 <build>
     <plugins>
         <plugin>
             <groupId>org.apache.maven.plugins</groupId>
             <artifactId>maven-surefire-plugin</artifactId>
             <configuration>
                 <testFailureIgnore>true</testFailureIgnore>            
             </configuration>
         </plugin>
     </plugins>
</build>
```

