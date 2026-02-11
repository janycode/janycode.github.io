---
title: 04-Jacoco+Mock+Diffblue自动生成单元测试
date: 2022-10-12 15:56:06
tags:
- 测试
- Junit5
categories: 
- 09_调试测试
- 02_单元测试
---

![image-20230203143612061](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230203143613.png)

参考资料:

Jacoco代码覆盖率工具：https://github.com/jacoco/jacoco

Diffblue cover官网：https://www.diffblue.com/



### 1. POM依赖

#### 1.1 Jacoco 依赖

多模块代码结构下，在`service模块`pom文件下引入jacoco依赖和插件 （因为一般情况下只需要针对service中的方法进行单元测试覆盖）

jacoco的maven依赖：

```xml
<dependency>
   <groupId>org.jacoco</groupId>
   <artifactId>jacoco-maven-plugin</artifactId>
   <version>0.8.8</version>
   <scope>test</scope>
</dependency>
```

jacoco插件配置：

```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.8</version>
    <executions>
        <execution>
            <id>prepare-agent</id>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>prepare-package</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
        <execution>
            <id>post-unit-test</id>
            <phase>test</phase>
            <goals>
                <goal>report</goal>
            </goals>
            <configuration>
                <dataFile>target/jacoco.exec</dataFile>
                <outputDirectory>target/jacoco-ut</outputDirectory>
            </configuration>
        </execution>
    </executions>
</plugin>
```

#### 1.2 Diffblue 依赖

在需要测试的模块引入依赖，一般情况下在service引入即可。

  对service中的方法，生成单元测试代码，进行测试，controller中的方法只是调用方，进行单元测试意义不大。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
    <exclusions>
        <exclusion>
            <groupId>org.junit.vintage</groupId>
            <artifactId>junit-vintage-engine</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<!-- diffblue cover 依赖 -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter-engine</artifactId>
    <scope>test</scope>
</dependency>
<!-- mockito 依赖 -->
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>
```



### 2. Diffblue Cover 插件安装

插件名称：diffblue cover

![image-20230203154714014](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230203154715.png)

重启 idea 后，插件激活选择 Community 免费激活即可

![image-20230203154741001](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230203154742.png)



### 3. 接入条件

- IntelliJ版本2019.3或更高版本
- Java 8 或 11 源代码（但请注意不支持 Java 11.0.7）
- 基于 Maven 或 Gradle 的项目 2 GB 最低内存要求（要在 IntelliJ 中进行修改，请选择Helpthen Change Memory Settings）
-  您的项目必须编译成功并运行
- JUnit 始终是必需的依赖项。

### 4. 接入步骤

- 安装Cover IntelliJ插件：idea plugins搜索 diffblue cover，注意接入条件中idea版本要再2019.3或更高
- 生成测试：右键单击类并选择Write Tests。
- 创建新测试后，它们将被自动集成到项目中src/test/java。
- 自动生成的代码很多可以不用自己修改
- 结合jacoco代码覆盖率工具查看代码测试报告

### 5. 生成单元测试

生成单元测试：

![image-20230203154947255](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230203154948.png)

单元测试验证：

![image-20230203155022755](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230203155023.png)

单元测试覆盖率报告目录：

![image-20230203155153100](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230203155153.png)

点击查看index.html 即可查看单元测试覆盖率报告。

