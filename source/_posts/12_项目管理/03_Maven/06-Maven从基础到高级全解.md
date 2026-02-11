---
title: 06-Maven从基础到高级全解
date: 2023-06-01 16:36:24
tags:
- Maven
categories: 
- 12_项目管理
- 03_Maven
---



![maven](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/maven.jpg)

## 1. Maven 是什么

Maven 是 Apache 软件基金会组织维护的一款专门为 Java 项目提供**构建**和**依赖**管理支持的工具。

一个 Maven 工程有约定的目录结构，约定的目录结构对于 Maven 实现自动化构建而言是必不可少的一环，就拿自动编译来说，Maven 必须 能找到 Java 源文件，下一步才能编译，而编译之后也必须有一个准确的位置保持编译得到的字节码文件。 我们在开发中如果需要让第三方工具或框架知道我们自己创建的资源在哪，那么基本上就是两种方式：

1. 通过配置的形式明确告诉它
2. 基于第三方工具或框架的约定 Maven 对工程目录结构的要求



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226164326.png)

### 1.1 构建

Java 项目开发过程中，构建指的是使用『**原材料生产产品**』的过程。



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226164333.png)



构建过程主要包含以下环节：



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226164337.png)

### 1.2 依赖

Maven 中最关键的部分，我们使用 Maven 最主要的就是使用它的依赖管理功能。当 A jar 包用到了 B jar 包中的某些类时，A 就对 B 产生了依赖，那么我们就可以说 A 依赖 B。

依赖管理中要解决的具体问题：

- jar 包的下载：使用 Maven 之后，jar 包会从规范的远程仓库下载到本地
- jar 包之间的依赖：通过依赖的传递性自动完成
- jar 包之间的冲突：通过对依赖的配置进行调整，让某些 jar 包不会被导入

## 2. Maven 开发环境配置

### 2.1 下载安装

首页：[Maven – Welcome to Apache Maven](https://xie.infoq.cn/link?target=https%3A%2F%2Fmaven.apache.org%2F)

下载页面：[Maven – Download Apache Maven](https://xie.infoq.cn/link?target=https%3A%2F%2Fmaven.apache.org%2Fdownload.cgi)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226164422.png)



或者你也可以选择之前的版本：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226164428.png)



然后里面选择自己对应的版本下载即可：



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226164440.png)



下载之后解压到**非中文、没有空格**的目录，如下：



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226164444.png)

### 2.2 指定本地仓库

本地仓库默认值：用户家目录/.m2/repository。由于本地仓库的默认位置是在用户的家目录下，而家目录往往是在 C 盘，也就是系统盘。将来 Maven 仓库中 jar 包越来越多，仓库体积越来越大，可能会拖慢 C 盘运行速度，影响系统性能。所以建议将 Maven 的本地仓库放在其他盘符下。配置方式如下：

```xml
<!-- localRepository
| The path to the local repository maven will use to store artifacts.
|
| Default: ${user.home}/.m2/repository
<localRepository>/path/to/local/repo</localRepository>
-->
<localRepository>D:\software\maven-repository</localRepository>
```

本地仓库这个目录，我们手动创建一个空的目录即可。

**记住**：一定要把 localRepository 标签**从注释中拿出来**。

**注意**：本地仓库本身也需要使用一个**非中文、没有空格**的目录。

### 2.3 配置阿里云提供的镜像仓库

Maven 下载 jar 包默认访问境外的中央仓库，而国外网站速度很慢。改成阿里云提供的镜像仓库，**访问国内网站**，可以让 Maven 下载 jar 包的时候速度更快。配置的方式是：

1. 将原有的例子配置注释掉

```xml
   <!-- <mirror>
     <id>maven-default-http-blocker</id>
     <mirrorOf>external:http:*</mirrorOf>
     <name>Pseudo repository to mirror external repositories initially using HTTP.</name>
     <url>http://0.0.0.0/</url>
     <blocked>true</blocked>
   </mirror> -->
```

2. 加入自己的配置

```xml
   <mirror>
     <id>nexus-aliyun</id>
     <mirrorOf>central</mirrorOf>
     <name>Nexus aliyun</name>
     <url>http://maven.aliyun.com/nexus/content/groups/public</url>
   </mirror>
```

### 2.4 配置基础 JDK 版本

如果按照默认配置运行，Java 工程使用的默认 JDK 版本是 1.5，而我们熟悉和常用的是 JDK 1.8 版本。修改配置的方式是：将 `profile` 标签整个复制到 settings.xml 文件的 `profiles` 标签内。

```xml
<profile>
    <id>jdk-1.8</id>
    <activation>
        <activeByDefault>true</activeByDefault>
        <jdk>1.8</jdk>
    </activation>
    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
       <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
    </properties>
</profile>
```



### 2.5 配置环境变量

Maven 是一个用 Java 语言开发的程序，它必须基于 JDK 来运行，需要通过 JAVA_HOME 来找到 JDK 的安装位置。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226164835.png)



可以使用下面的命令验证：

```bash
C:\Users\Administrator>echo %JAVA_HOME%
D:\software\Java

C:\Users\Administrator>java -version
java version "1.8.0_141"
Java(TM) SE Runtime Environment (build 1.8.0_141-b15)
Java HotSpot(TM) 64-Bit Server VM (build 25.141-b15, mixed mode)

```

然后新建环境变量：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226164854.png)

> 配置环境变量的规律：
>
> XXX_HOME 通常指向的是 bin 目录的上一级
>
> PATH 指向的是 bin 目录



在配置 PATH



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226164901.png)



通过 `mvn -v` 验证：

```bash
C:\Users\Administrator>mvn -v
Apache Maven 3.3.9 (bb52d8502b132ec0a5a3f4c09453c07478323dc5; 2015-11-11T00:41:47+08:00)
Maven home: D:\software\apache-maven-3.3.9\bin\..
Java version: 1.8.0_333, vendor: Oracle Corporation
Java home: D:\software\jdk1.8\jre
Default locale: zh_CN, platform encoding: GBK
OS name: "windows 11", version: "10.0", arch: "amd64", family: "dos"
```

## 3. Maven 的使用

### 3.1 核心概念：坐标

**数学中的坐标**使用 x、y、z 三个『**向量**』作为空间的坐标系，可以在『**空间**』中唯一的定位到一个『**点**』。



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226164918.png)



**Maven 中的坐标**使用三个『**向量**』在『**Maven 的仓库**』中**唯一**的定位到一个『**jar**』包。

- **groupId**：公司或组织的 id，即公司或组织域名的倒序，通常也会加上项目名称
  - 例如：groupId：com.javatv.maven
- **artifactId**：一个项目或者是项目中的一个模块的 id，即模块的名称，将来作为 Maven 工程的工程名
  - 例如：artifactId：auth
- **version**：版本号
  - 例如：version：1.0.0

提示：坐标和仓库中 jar 包的存储路径之间的对应关系，如下

```xml
<groupId>javax.servlet</groupId>
<artifactId>servlet-api</artifactId>
<version>2.5</version>
```

上面坐标对应的 jar 包在 Maven 本地仓库中的位置：

```xml
Maven本地仓库根目录\javax\servlet\servlet-api\2.5\servlet-api-2.5.jar
```

### 3.2 pom.xml

`POM`：**P**roject **O**bject **M**odel，项目对象模型。和 POM 类似的是：DOM（Document Object Model），文档对象模型。它们都是模型化思想的具体体现。

POM 表示将工程抽象为一个模型，再用程序中的对象来描述这个模型。这样我们就可以用程序来管理项目了。我们在开发过程中，最基本的做法就是将现实生活中的事物抽象为模型，然后封装模型相关的数据作为一个对象，这样就可以在程序中计算与现实事物相关的数据。

POM 理念集中体现在 Maven 工程根目录下 **pom.xml** 这个配置文件中。所以这个 pom.xml 配置文件就是 Maven 工程的核心配置文件。其实学习 Maven 就是学这个文件怎么配置，各个配置有什么用。

```xml
<!-- 当前Maven工程的坐标 -->
<groupId>com.example</groupId>
<artifactId>demo</artifactId>
<version>0.0.1-SNAPSHOT</version>
<name>demo</name>
<description>Demo project for Spring Boot</description>
<!-- 当前Maven工程的打包方式，可选值有下面三种： -->
<!-- jar：表示这个工程是一个Java工程  -->
<!-- war：表示这个工程是一个Web工程 -->
<!-- pom：表示这个工程是“管理其他工程”的工程 -->
<packaging>jar</packaging>
<properties>
    <!-- 工程构建过程中读取源码时使用的字符集 -->
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>
<!-- 当前工程所依赖的jar包 -->
<dependencies>
    <!-- 使用dependency配置一个具体的依赖 -->
    <dependency>
        <!-- 在dependency标签内使用具体的坐标依赖我们需要的一个jar包 -->
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
        <!-- scope标签配置依赖的范围 -->
        <scope>test</scope>
    </dependency>
</dependencies>
```

### 3.3 依赖

上面说到我们使用 Maven 最主要的就是使用它的依赖管理功能，引入依赖存在一个范围，maven 的依赖范围包括： `compile`，`provide`，`runtime`，`test`，`system`。

- **compile**：表示编译范围，指 A 在编译时依赖 B，该范围为**默认依赖范围**。编译范围的依赖会用在编译，测试，运行，由于运行时需要，所以编译范围的依赖会被打包。
- **provided**：provied 依赖只有当 jdk 或者一个容器已提供该依赖之后才使用。provide 依赖在编译和测试时需要，在运行时不需要。例如：servlet api 被 Tomcat 容器提供了。
- **runtime**：runtime 依赖在运行和测试系统时需要，但在编译时不需要。例如：jdbc 的驱动包。由于运行时需要，所以 runtime 范围的依赖会被打包。
- **test**：test 范围依赖在编译和运行时都不需要，只在测试编译和测试运行时需要。例如：Junit。由于运行时不需要，所以 test 范围依赖不会被打包。
- **system**：system 范围依赖与 provide 类似，但是必须显示的提供一个对于本地系统中 jar 文件的路径。一般不推荐使用。

而在实际开发中，我们常用的就是 `compile`、`test`、`provided` 。

### 3.4 依赖的传递

A 依赖 B，B 依赖 C，那么在 A 没有配置对 C 的依赖的情况下，A 里面能不能直接使用 C？

再以上的前提下，C 是否能够传递到 A，取决于 B 依赖 C 时使用的依赖范围。

- B 依赖 C 时使用 compile 范围：可以传递
- B 依赖 C 时使用 test 或 provided 范围：不能传递，所以需要这样的 jar 包时，就必须在需要的地方明确配置依赖才可以。

### 3.5 依赖的排除

当 A 依赖 B，B 依赖 C 而且 C 可以传递到 A 的时候，A 不想要 C，需要在 A 里面把 C 排除掉。而往往这种情况都是为了避免 jar 包之间的冲突。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226170016.png)



所以配置依赖的排除其实就是阻止某些 jar 包的传递。因为这样的 jar 包传递过来会和其他 jar 包冲突。

一般通过使用`excludes`标签配置依赖的排除：

```xml
<dependency>
  <groupId>net.javatv.maven</groupId>
  <artifactId>auth</artifactId>
  <version>1.0.0</version>
  <scope>compile</scope>
    
  <!-- 使用excludes标签配置依赖的排除  -->
  <exclusions>
    <!-- 在exclude标签中配置一个具体的排除 -->
    <exclusion>
      <!-- 指定要排除的依赖的坐标（不需要写version） -->
      <groupId>commons-logging</groupId>
      <artifactId>commons-logging</artifactId>
    </exclusion>
  </exclusions>
</dependency>
```

### 3.6 继承

#### 3.6.1 概念

Maven 工程之间，A 工程继承 B 工程

- B 工程：父工程
- A 工程：子工程

本质上是 A 工程的 pom.xml 中的配置继承了 B 工程中 pom.xml 的配置。

#### 3.6.2 作用

在父工程中统一管理项目中的依赖信息，具体来说是管理依赖信息的版本。

它的背景是：

- 对一个比较大型的项目进行了模块拆分。
- 一个 project 下面，创建了很多个 module。
- 每一个 module 都需要配置自己的依赖信息。

它背后的需求是：

- 在每一个 module 中各自维护各自的依赖信息很容易发生出入，不易统一管理。
- 使用同一个框架内的不同 jar 包，它们应该是同一个版本，所以整个项目中使用的框架版本需要统一。
- 使用框架时所需要的 jar 包组合（或者说依赖信息组合）需要经过长期摸索和反复调试，最终确定一个可用组合。这个耗费很大精力总结出来的方案不应该在新的项目中重新摸索。

通过在父工程中为整个项目维护依赖信息的组合既**保证了整个项目使用规范、准确的 jar 包**；又能够将**以往的经验沉淀**下来，节约时间和精力。

#### 3.6.3 一个例子

**① 一般再模块化开发中一般都会创建一个父工程，如下**：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226170122.png)



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226170138.png)

父工程创建好之后，要修改它的打包方式：

```xml
<!-- 当前工程作为父工程，它要去管理子工程，所以打包方式必须是 pom -->
<packaging>pom</packaging>
```

只有打包方式为 pom 的 Maven 工程能够管理其他 Maven 工程。打包方式为 pom 的 Maven 工程中不写业务代码，它是专门管理其他 Maven 工程的工程，所以可以将生成的 src 目录删除。

**② 创建模块工程**

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226170208.png)



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226170211.png)



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226170215.png)



然后可以再**父工程**的 pom 文件中看到：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226170221.png)



而**子工程**的 pom 如下：



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226170226.png)



**③ 在父工程中配置依赖的统一管理**

使用`dependencyManagement`标签配置对依赖的管理，如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>net.javatv.maven</groupId>
    <artifactId>maven-demo-parent</artifactId>
    <packaging>pom</packaging>
    <version>1.0-SNAPSHOT</version>

    <modules>
        <module>demo-module</module>
    </modules>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-beans</artifactId>
                <version>5.3.19</version>
            </dependency>

            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-core</artifactId>
                <version>5.3.19</version>
            </dependency>

            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-context</artifactId>
                <version>5.3.19</version>
            </dependency>

            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-aop</artifactId>
                <version>5.3.19</version>
            </dependency>
        </dependencies>
    </dependencyManagement>

</project>
```

而实际上**被管理的依赖并没有真正被引入到工程**。

**④ 子工程中引用那些被父工程管理的依赖**

关键点：省略版本号

子工程引用父工程中的依赖信息时，可以把版本号去掉。把版本号去掉就表示子工程中这个依赖的版本由父工程决定，具体来说是由父工程的 dependencyManagement 来决定。

子工程 pom 如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <!-- 使用parent标签指定当前工程的父工程 -->
    <parent>
        <artifactId>maven-demo-parent</artifactId>
        <groupId>net.javatv.maven</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <!-- 子工程的坐标 -->
    <!-- 如果子工程坐标中的groupId和version与父工程一致，那么可以省略 -->
    <artifactId>demo-module</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-beans</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-core</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-aop</artifactId>
        </dependency>
    </dependencies>
    
</project>
```

此时，**被管理的依赖才被引入到工程**。



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226170337.png)



**⑤ 修改父工程依赖信息的版本**

这个修改可以是降级，也可以是升级，但一般来说都是升级。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226170344.png)



**⑥ 父工程中声明自定义属性**

对同一个框架的一组 jar 包最好使用相同的版本，为了方便升级框架，可以将 jar 包的版本信息统一提取出来，统一声明版本号 ：

```xml
<!-- 通过自定义属性，统一指定Spring的版本 -->
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <!-- 自定义标签，维护Spring版本数据 -->
    <spring.version>5.3.19</spring.version>
</properties>
```

在需要的地方使用`${}`的形式来引用自定义的属性名，真正实现**一处修改，处处生效**。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>net.javatv.maven</groupId>
    <artifactId>maven-demo-parent</artifactId>
    <packaging>pom</packaging>
    <version>1.0-SNAPSHOT</version>

    <modules>
        <module>demo-module</module>
    </modules>


    <!-- 通过自定义属性，统一指定Spring的版本 -->
    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

        <!-- 自定义标签，维护Spring版本数据 -->
        <spring.version>5.3.19</spring.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-beans</artifactId>
                <version>${spring.version}</version>
            </dependency>

            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-core</artifactId>
                <version>${spring.version}</version>
            </dependency>

            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-context</artifactId>
                <version>${spring.version}</version>
            </dependency>

            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-aop</artifactId>
                <version>${spring.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>

</project>
```

编写一套符合要求、开发各种功能都能正常工作的依赖组合并不容易。如果公司里已经有人总结了成熟的组合方案，那么再开发新项目时，如果不使用原有的积累，而是重新摸索，会浪费大量的时间。为了提高效率，我们可以使用工程继承的机制，让成熟的依赖组合方案能够保留下来。如下：



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226170427.png)



如上图所示，公司级的父工程中管理的就是成熟的依赖组合方案，各个新项目、子系统各取所需即可。

### 3.7 聚合

聚合，指分散的聚集到一起，即部分组成整体。

#### 3.7.1 Maven 中的聚合

使用一个**总工程**将各个**模块工程**汇集起来，作为一个整体对应完整的项目，实际就是 `module` 标签。

- 项目：整体
- 模块：部分

#### 3.7.2 继承和聚合的对应关系

从继承关系角度来看：

- 父工程
- 子工程



从聚合关系角度来看：

- 总工程
- 模块工程

#### 3.7.3 聚合的配置

在总工程中配置 modules 即可：

```xml
<modules>
    <module>demo-module</module>
</modules>
```

#### 3.7.4 依赖循环问题

如果 A 工程依赖 B 工程，B 工程依赖 C 工程，C 工程又反过来依赖 A 工程，那么在执行构建操作时会报下面的错误：

```
DANGER
[ERROR] [ERROR] The projects in the reactor contain a cyclic reference:
```

这个错误的含义是：循环引用。

## 4. build 标签

在实际使用 Maven 的过程中，我们会发现 build 标签有时候有，有时候没，这是怎么回事呢？其实通过有效 POM 我们能够看到，build 标签的相关配置其实一直都在，只是在我们需要定制构建过程的时候才会通过配置 build 标签覆盖默认值或补充配置。这一点我们可以通过打印有效 POM 来看到。

> 打印有效 pom
>
> mvn help:effective-pom

当默认配置无法满足需求的定制构建的时候，就需要使用 build 标签。

### 4.1 build 标签的组成

build 标签的子标签大致包含三个主体部分：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226170554.png)

#### 4.1.1 定义约定的目录结构

```xml
<sourceDirectory>D:\product\maven-demo-parent\demo-module\src\main\java</sourceDirectory>
<scriptSourceDirectory>D:\product\maven-demo-parent\demo-module\src\main\scripts</scriptSourceDirectory>
<testSourceDirectory>D:\product\maven-demo-parent\demo-module\src\test\java</testSourceDirectory>
<outputDirectory>D:\product\maven-demo-parent\demo-module\target\classes</outputDirectory>
<testOutputDirectory>D:\product\maven-demo-parent\demo-module\target\test-classes</testOutputDirectory>
<resources>
    <resource>
        <directory>D:\product\maven-demo-parent\demo-module\src\main\resources</directory>
    </resource>
</resources>
<testResources>
    <testResource>
        <directory>D:\product\maven-demo-parent\demo-module\src\test\resources</directory>
    </testResource>
</testResources>
<directory>D:\product\maven-demo-parent\demo-module\target</directory>
<finalName>demo-module-1.0-SNAPSHOT</finalName>
```

各个目录的作用如下：

#### 4.1.2 备用插件管理

pluginManagement 标签存放着几个极少用到的插件：

- maven-antrun-plugin
- maven-assembly-plugin
- maven-dependency-plugin
- maven-release-plugin

通过 pluginManagement 标签管理起来的插件就像 dependencyManagement 一样，子工程使用时可以省略版本号，起到在父工程中统一管理版本的效果。

#### 4.1.3 生命周期插件

plugins 标签存放的是默认生命周期中实际会用到的插件，这些插件想必大家都不陌生，所以抛开插件本身不谈，plugin 标签的结构如下：

```xml
<plugin>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.1</version>
    <executions>
        <execution>
            <id>default-compile</id>
            <phase>compile</phase>
            <goals>
                <goal>compile</goal>
            </goals>
        </execution>
        <execution>
            <id>default-testCompile</id>
            <phase>test-compile</phase>
            <goals>
                <goal>testCompile</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

**① 坐标部分**

artifactId 和 version 标签定义了插件的坐标，作为 Maven 的自带插件这里省略了 groupId。

**② 执行部分**

executions 标签内可以配置多个 execution 标签，execution 标签内：

- id：指定唯一标识
- phase：关联的生命周期阶段
- goals/goal：关联指定生命周期的目标
- goals 标签中可以配置多个 goal 标签，表示一个生命周期环节可以对应当前插件的多个目标。

### 4.2 典型应用：指定 JDK 版本

前面我们在 settings.xml 中配置了 JDK 版本，那么将来把 Maven 工程部署都服务器上，脱离了 settings.xml 配置，如何保证程序正常运行呢？思路就是我们直接把 JDK 版本信息告诉负责编译操作的 maven-compiler-plugin 插件，让它在构建过程中，按照我们指定的信息工作。如下：

```xml
<!-- build 标签：意思是告诉 Maven，你的构建行为，我要开始定制了！ -->
<build>
    <!-- plugins 标签：Maven 你给我听好了，你给我构建的时候要用到这些插件！ -->
    <plugins>
        <!-- plugin 标签：这是我要指定的一个具体的插件 -->
        <plugin>
            <!-- 插件的坐标。此处引用的 maven-compiler-plugin 插件不是第三方的，是一个 Maven 自带的插件。 -->
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.1</version>
            
            <!-- configuration 标签：配置 maven-compiler-plugin 插件 -->
            <configuration>
                <!-- 具体配置信息会因为插件不同、需求不同而有所差异 -->
                <source>1.8</source>
                <target>1.8</target>
                <encoding>UTF-8</encoding>
            </configuration>
        </plugin>
    </plugins>
</build>
```

- settings.xml 中配置：仅在本地生效，如果脱离当前 settings.xml 能够覆盖的范围，则无法生效。
- 在当前 Maven 工程 pom.xml 中配置：无论在哪个环境执行编译等构建操作都有效。

### 4.3 典型应用：SpringBoot 定制化打包

很显然 spring-boot-maven-plugin 并不是 Maven 自带的插件，而是 SpringBoot 提供的，用来改变 Maven 默认的构建行为。具体来说是改变打包的行为。默认情况下 Maven 调用 maven-jar-plugin 插件的 jar 目标，生成普通的 jar 包。

普通 jar 包没法使用 java -jar xxx.jar 这样的命令来启动、运行，但是 SpringBoot 的设计理念就是每一个『**微服务**』导出为一个 jar 包，这个 jar 包可以使用 java -jar xxx.jar 这样的命令直接启动运行。

这样一来，打包的方式肯定要进行调整。所以 SpringBoot 提供了 spring-boot-maven-plugin 这个插件来定制打包行为。

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
      <version>2.5.5</version>
    </plugin>
  </plugins>
</build>
```

## 5. 依赖配置补充

管理依赖最基本的办法是继承父工程，但是和 Java 类一样，Maven 也是单继承的。如果不同体系的依赖信息封装在不同 POM 中了，没办法继承多个父工程怎么办？这时就可以使用 import 依赖范围。

### 5.1 import

典型案例当然是在项目中引入 SpringBoot、SpringCloud 依赖：

```xml
<dependencyManagement>
    <dependencies>
        <!-- SpringCloud 微服务 -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${spring-cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        
        <!-- SpringCloud Alibaba 微服务 -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-alibaba-dependencies</artifactId>
            <version>${spring-cloud-alibaba.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

import 依赖范围使用要求：

- 打包类型必须是 pom
- 必须放在 dependencyManagement 中

> 官网说明如下：
>
> This scope is only supported on a dependency of type `pom` in the `<dependencyManagement>` section. It indicates the dependency is to be replaced with the effective list of dependencies in the specified POM's `<dependencyManagement>` section. Since they are replaced, dependencies with a scope of `import` do not actually participate in limiting the transitivity of a dependency.
>
> 此作用域仅支持`<dependencyManagement>`节中`pom`类型的依赖项。它指示该依赖项将被指定POM的`<dependencyManagement>`部分中的有效依赖项列表所替换。因为它们被替换了，所以作用域为`import`的依赖实际上并不参与限制依赖的可传递性。

### 5.2 system

以 Windows 系统环境下开发为例，假设现在 `D:\product\maven-demo-parent\demo-module\target\demo-module-1.0-SNAPSHOT.jar` 想要引入到我们的项目中，此时我们就可以将依赖配置为 system 范围：

```xml
<dependency>
    <groupId>net.javatv.maven</groupId>
    <artifactId>demo-module</artifactId>
    <version>1.0-SNAPSHOT</version>
    <systemPath>D:\product\maven-demo-parent\demo-module\target\demo-module-1.0-SNAPSHOT.jar</systemPath>
    <scope>system</scope>
</dependency>
```

但是很明显：这样引入依赖完全不具有可移植性，所以**不要使用**。

### 5.3 runtime

专门用于编译时不需要，但是运行时需要的 jar 包。比如：编译时我们根据接口调用方法，但是实际运行时需要的是接口的实现类。典型案例是：

```xml
<!--热部署 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

## 6. profile

### 6.1 profile 概述

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226171029.png)



这里我们可以对接 profile 这个单词中『**侧面**』这个含义：项目的每一个运行环境，相当于是项目整体的一个侧面。



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226171034.png)



通常情况下，我们项目至少有三种运行环境：

- 开发环境：供不同开发工程师开发的各个模块之间互相调用、访问；内部使用
- 测试环境：供测试工程师对项目的各个模块进行功能测试；内部使用
- 生产环境：供最终用户访问——所以这是正式的运行环境，对外提供服务



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226171041.png)



而我们这里的『环境』仍然只是一个笼统的说法，实际工作中一整套运行环境会包含很多种不同服务器：

- MySQL
- Redis
- ElasticSearch
- RabbitMQ
- FastDFS
- Nginx
- Tomcat
- ……

就拿其中的 MySQL 来说，不同环境下的访问参数肯定完全不同，可是代码只有一套。如果在 jdbc.properties 里面来回改，那就太麻烦了，而且很容易遗漏或写错，增加调试的难度和工作量。所以最好的办法就是把适用于各种不同环境的配置信息分别准备好，部署哪个环境就激活哪个配置。

在 Maven 中，使用 profile 机制来管理不同环境下的配置信息。但是解决同类问题的类似机制在其他框架中也有，而且从模块划分的角度来说，持久化层的信息放在构建工具中配置也违反了『高内聚，低耦合』的原则。

实际上，即使我们在 pom.xml 中不配置 profile 标签，也已经用到 profile 了。为什么呢？因为根标签 project 下所有标签相当于都是在设定默认的 profile。这样一来我们也就很容易理解下面这句话：project 标签下除了 modelVersion 和坐标标签之外，其它标签都可以配置到 profile 中。

### 6.2 profile 配置

#### 6.2.1 外部视角：配置文件

从外部视角来看，profile 可以在下面两种配置文件中配置：

- settings.xml：全局生效。其中我们最熟悉的就是配置 JDK 1.8。
- pom.xml：当前 POM 生效

#### 6.2.2 内部实现：具体标签

从内部视角来看，配置 profile 有如下语法要求：

**① profiles/profile 标签**

- 由于 profile 天然代表众多可选配置中的一个所以由复数形式的 profiles 标签统一管理。
- 由于 profile 标签覆盖了 pom.xml 中的默认配置，所以 profiles 标签通常是 pom.xml 中的最后一个标签。

**② id 标签**

每个 profile 都必须有一个 id 标签，指定该 profile 的唯一标识。这个 id 标签的值会在命令行调用 profile 时被用到。这个命令格式是：

```bash
-D<profile id>
```

**③ 其它允许出现的标签**

一个 profile 可以覆盖项目的最终名称、项目依赖、插件配置等各个方面以影响构建行为。

- build
- defaultGoal
- finalName
- resources
- testResources
- plugins
- reporting
- modules
- dependencies
- dependencyManagement
- repositories
- pluginRepositories
- properties

### 6.3 激活 profile

**① 默认配置默认被激活**

前面提到了，POM 中没有在 profile 标签里的就是默认的 profile，当然默认被激活。

**② 基于环境信息激活**

环境信息包含：JDK 版本、操作系统参数、文件、属性等各个方面。一个 profile 一旦被激活，那么它定义的所有配置都会覆盖原来 POM 中对应层次的元素。可参考下面的标签结构：

```xml
<profile>
  <id>dev</id>
    <activation>
        <!-- 配置是否默认激活 -->
      <activeByDefault>false</activeByDefault>
        <jdk>1.5</jdk>
        <os>
          <name>Windows XP</name>
            <family>Windows</family>
            <arch>x86</arch>
            <version>5.1.2600</version>
        </os>
        <property>
          <name>mavenVersion</name>
            <value>2.0.5</value>
        </property>
        <file>
          <exists>file2.properties</exists>
            <missing>file1.properties</missing>
        </file>
    </activation>
</profile>
```

这里有个问题是：多个激活条件之间是什么关系呢？

- Maven **3.2.2 之前**：遇到第一个满足的条件即可激活——**或**的关系。
- Maven **3.2.2 开始**：各条件均需满足——**且**的关系。

下面我们来看一个具体例子。假设有如下 profile 配置，在 JDK 版本为 1.6 时被激活：

```xml
<profiles>
  <profile>
      <id>JDK1.6</id>
        <activation>
            <!-- 指定激活条件为：JDK 1.6 -->
          <jdk>1.6</jdk>
        </activation>
        ……
    </profile>
</profiles>
```

这里需要指出的是：Maven 会自动检测当前环境安装的 JDK 版本，只要 JDK 版本是以 1.6 开头都算符合条件。下面几个例子都符合：

- 1.6.0_03
- 1.6.0_02
- ……

### 6.4 Maven profile 多环境管理

在开发过程中，我们的软件会面对不同的运行环境，比如开发环境、测试环境、生产环境，而我们的软件在不同的环境中，有的配置可能会不一样，比如数据源配置、日志文件配置、以及一些软件运行过程中的基本配置，那每次我们将软件部署到不同的环境时，都需要修改相应的配置文件，这样来回修改，很容易出错，而且浪费劳动力。

因此我们可以利用 Maven 的 profile 来进行定义多个 profile，然后每个 profile 对应不同的激活条件和配置信息，从而达到不同环境使用不同配置信息的效果。

```xml
<build>
    <!-- profile对资源的操作 -->
    <resources>
        <resource>
            <directory>src/main/resources</directory>
            <!-- 先排除所有环境相关的配置文件 -->
            <excludes>
                <exclude>application*.yml</exclude>
            </excludes>
        </resource>
        <resource>
            <directory>src/main/resources</directory>
            <!-- 是否替换 @xx@ 表示的maven properties属性值 -->
            <!--通过开启 filtering，maven 会将文件中的 @xx@ 替换 profile 中定义的 xx 变量/属性-->
            <filtering>true</filtering>
            <includes>
                <include>application.yml</include>
                <include>application-${profileActive}.yml</include>
            </includes>
        </resource>
    </resources>
</build>

<!--多环境文件配置-->
<profiles>
    <!--开发环境-->
    <profile>
        <id>dev</id>
        <activation>
            <!--默认激活-->
            <activeByDefault>true</activeByDefault>
        </activation>
        <properties>
            <profileActive>dev</profileActive>
        </properties>
    </profile>
    <!--测试环境-->
    <profile>
        <id>test</id>
        <properties>
            <profileActive>test</profileActive>
        </properties>
    </profile>
    <!--正式环境-->
    <profile>
        <id>prod</id>
        <properties>
            <profileActive>prod</profileActive>
        </properties>
    </profile>
</profiles>
```

在 idea 中可以看到，因此，当你需要打包哪一个环境的就勾选即可：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226171400.png)



同时，SpringBoot 天然支持多环境配置，一般来说，`application.yml`存放公共的配置，`application-dev.yml`、`application-test.yml`、`application.prod.yml`分别存放三个环境的配置。如下：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226171511.png)

`application.yml` 中配置`spring.profiles.active=prod`（或者 dev、test）指定使用的配置文件，如下：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226171519.png)

注：`profileActive`，就是上面我们自定义的标签。

然后当我们勾选哪一个环境，打包的配置文件就是那一个环境：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226171642.png)



同时我们再在 resource 标签下看到 includes 和 excludes 标签。它们的作用是：

- includes：指定执行 resource 阶段时要包含到目标位置的资源
- excludes：指定执行 resource 阶段时要排除的资源

## 7. 搭建 Maven 私服：Nexus

很多公司都是搭建自己的 Maven 私有仓库，主要用于项目的公共模块的迭代更新等。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226171650.png)

### 7.1 Nexus 下载安装

下载地址：[https://download.sonatype.com/nexus/3/latest-unix.tar.gz](https://xie.infoq.cn/link?target=https%3A%2F%2Fdownload.sonatype.com%2Fnexus%2F3%2Flatest-unix.tar.gz)

百度网盘：[https://pan.baidu.com/s/12IjpSSUSZa6wHZoQ8wHsxg](https://xie.infoq.cn/link?target=https%3A%2F%2Fpan.baidu.com%2Fs%2F12IjpSSUSZa6wHZoQ8wHsxg) （提取码：5bu6）

然后将下载的文件上传到 Linux 系统，解压后即可使用，不需要安装。但是需要**注意**：必须提前安装 JDK。（我这里放在 /root/nexus 下）

```bash
tar -zxvf nexus-3.25.1-04-unix.tar.gz
```

解压后如下：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226171731.png)

通过以下命令启动：

```bash
# 启动
/root/nexus/nexus-3.25.1-04/bin/nexus start
# 查看状态
/root/nexus/nexus-3.25.1-04/bin/nexus status
```

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226171900.png)



如果显示`nexus is stopped.`则说明启动失败，通过命令查看端口占用情况：

```bash
netstart -luntp|grep java
```

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226171910.png)

可以看到 8081 端口被占用，而 nexus 的默认端口为 8081，我们可以修改其默认端口号，其配置文件在 `etc`目录下的`nexus-default.properties`，如下：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226171921.png)

打开后修改为自己需要设置的端口，注意开启对外防火墙：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226171935.png)

**提示**：

> bin 目录下 nexus.vmoptions 文件，可调整内存参数，防止占用内存太大。
>
> etc 目录下 nexus-default.properties 文件可配置默认端口和 host 及访问根目录。

然后访问 `http://[Linux服务器地址]:8090/`进入首页：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226171954.png)

### 7.2 初始设置

点击右上角的登录：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226172017.png)



这里参考提示：

- 用户名：admin
- 密码：查看 /opt/sonatype-work/nexus3/admin.password 文件

然后输入密码进行下一步：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226172025.png)

匿名登录，启用还是禁用？由于启用匿名登录后，后续操作比较简单，这里我们演示禁用匿名登录的操作方式：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226172039.png)

除了默认账号 admin，admin 具有全部权限，还有 anonymous，anonymous 作为匿名用户，只具有查看权限，但可以查看仓库并下载依赖。

完成：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226172048.png)

### 7.3 Nexus Repository

nexus 默认创建了几个仓库，如下：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226172055.png)

其中仓库 Type 类型为：

仓库名称：

其中 maven-public 相当于仓库总和，默认把其他 3 个仓库加进来一起对外提供服务了，另外，如果有自己建的仓库，也要加进该仓库才有用。

初始状态下，这几个仓库都没有内容：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226172149.png)

### 7.4 创建 Nexus Repository

除了自带的仓库，有时候我们需要单独创建自己的仓库，按照默认创建的仓库类型来创建我们自己的仓库。

#### 7.4.1 创建 Nexus 宿主仓库

点击左边导航栏中的 Repositories，如下图：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226172218.png)



然后创建仓库，如下：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226173838.png)

同理创建 releases 仓库，然后查看列表：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226172233.png)

宿主仓库配置如下：

#### 7.4.2 创建 Nexus 代理仓库

然后建一个代理仓库，用来下载和缓存中央仓库（或者阿里云仓库）的构件，这里选择 proxy：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226172252.png)

然后创建：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226172300.png)

代理仓库配置中，仓库 ID、仓库名称、Provider、Policy 以及 Default Local Storage Location 等配置的含义与宿主仓库相同，不再赘述。需要注意的是，代理仓库的 Repository Type 的取值是 proxy。

代理仓库配置如下表：

#### 7.4.3 创建 Nexus 仓库组

下面我们将创建一个仓库组，并将刚刚创建的 3 个仓库都聚合起来，这里选择 group，如下：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226172406.png)

查看 Nexus 仓库列表，可以看到创建的仓库组已经创建完成，如下图：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226172415.png)

### 7.5 通过 Nexus 下载 jar 包

由于初始状态下都没有内容，所以我们需要进行配置，我们先在本地的 Maven 的配置文件中新建一个空的本地仓库作为测试。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226172428.png)

然后，把我们原来配置阿里云仓库地址的 mirror 标签改成下面这样：

```xml
<mirror>
  <id>maven-public</id>
  <mirrorOf>central</mirrorOf>
  <name>Maven public</name>
  <url>http://服务器ip地址:8090/repository/maven-public/</url>  
</mirror>
```

这里的 url 标签是这么来的：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226172644.png)

把上图中看到的地址复制出来即可。如果我们在前面允许了匿名访问，到这里就够了。但如果我们禁用了匿名访问，那么接下来我们还要继续配置 settings.xml：

```xml
<server>
  <id>maven-public</id>
  <username>admin</username>
  <password>@123456</password>
</server>
```

**注意**：server 标签内的 id 标签值必须和 mirror 标签中的 id 值一样。

然后找一个用到框架的 Maven 工程，编译 compile，下载过程日志：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226172728.png)

下载后，Nexus 服务器上就有了 jar 包：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226173826.png)

### 7.6 将 jar 包部署到 Nexus

这一步的作用是将通用的模块打成 jar 包，发布到 Nexus 私服，让其他的项目来引用，以更简洁高效的方式来实现复用和管理。

需要配置 server：

```xml
<server>
  <id>maven-public</id>
  <username>admin</username>
  <password>@123456</password>
</server>
<server>
  <id>maven-releases</id>
  <username>admin</username>
  <password>@123456</password>
</server>
<server>
  <id>maven-snapshots</id>
  <username>admin</username>
  <password>@123456</password>
</server>
```

然后在我们需要上传的 maven 项目中的`pom.xml`添加如下配置：

```xml
<!-- 这里的 id 要和上面的 server 的 id 保持一致,name 随意写-->
<distributionManagement>
    <repository>
        <id>maven-releases</id>
        <name>Releases Repository</name>
        <url>http://106.15.15.213:8090/repository/maven-releases/</url>
    </repository>
    <snapshotRepository>
        <id>maven-snapshots</id>
        <name>Snapshot Repository</name>
        <url>http://106.15.15.213:8090/repository/maven-snapshots/</url>
    </snapshotRepository>
</distributionManagement>
```

#### 7.6.1 上传到 maven-snapshots

执行命令 `mvn deploy`  将当前 SNAPSHOT（快照版）上传到私服 maven-snapshots。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226172854.png)

#### 7.6.2 上传到 maven-releases

修改项目的版本，如下：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226172902.png)

执行命令 `mvn deploy`：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226172911.png)

查看：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226172923.png)

> package 命令完成了项目编译、单元测试、打包功能。
>
> install 命令完成了项目编译、单元测试、打包功能，同时把打好的可执行 jar 包（war 包或其它形式的包）布署到本地 maven 仓库。
>
> deploy 命令完成了项目编译、单元测试、打包功能，同时把打好的可执行 jar 包（war 包或其它形式的包）布署到本地 maven 仓库和远程 maven 私服仓库。

## 8. jar 包冲突问题

先给结论：编订依赖列表的程序员。初次设定一组依赖，因为尚未经过验证，所以确实有可能存在各种问题，需要做有针对性的调整。那么谁来做这件事呢？我们最不希望看到的就是：团队中每个程序员都需要自己去找依赖，即使是做同一个项目，每个模块也各加各的依赖，没有统一管理。那前人踩过的坑，后人还要再踩一遍。而且大家用的依赖有很多细节都不一样，版本更是五花八门，这就让事情变得更加复杂。

所以虽然初期需要根据项目开发和实际运行情况对依赖配置不断调整，最终确定一个各方面都 OK 的版本。但是一旦确定下来，放在父工程中做依赖管理，各个子模块各取所需，这样基本上就能很好的避免问题的扩散。

即使开发中遇到了新问题，也可以回到源头检查、调整 dependencyManagement 配置的列表——而不是每个模块都要改。

### 8.1 表现形式

由于实际开发时我们往往都会整合使用很多大型框架，所以一个项目中哪怕只是一个模块也会涉及到大量 jar 包。数以百计的 jar 包要彼此协调、精密配合才能保证程序正常运行。而规模如此庞大的 jar 包组合在一起难免会有磕磕碰碰。最关键的是由于 jar 包冲突所导致的问题非常诡异，这里我们只能罗列较为典型的问题，而没法保证穷举。

但是我们仍然能够指出一点：一般来说，由于我们自己编写代码、配置文件写错所导致的问题通常能够在异常信息中看到我们自己类的全类名或配置文件的所在路径。如果整个错误信息中完全没有我们负责的部分，全部是框架、第三方工具包里面的类报错，这往往就是 jar 包的问题所引起的。

而具体的表现形式中，主要体现为找不到类或找不到方法。

#### 8.1.1 抛异常：找不到类

此时抛出的常见的异常类型：

- java.lang.**ClassNotFoundException**：编译过程中找不到类
- java.lang.**NoClassDefFoundError**：运行过程中找不到类
- java.lang.**LinkageError**：不同类加载器分别加载的多个类有相同的全限定名

我们来举个例子：

```xml
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpclient</artifactId>
    <version>4.x.x</version>
</dependency>
```

httpclient 这个 jar 包中有一个类：org.apache.http.conn.ssl.NoopHostnameVerifier。这个类在较低版本中没有，但在较高版本存在。比如：

那当我们确实需要用到 NoopHostnameVerifier 这个类，我们看到 Maven 通过依赖传递机制引入了这个 jar 包，所以没有明确地显式声明对这个 jar 包的依赖。可是 Maven 传递过来的 jar 包是 4.3.6 版本，里面没有包含我们需要的类，就会抛出异常。

而『**冲突**』体现在：4.3.6 和 4.4 这两个版本的 jar 包都被框架所依赖的 jar 包给传递进来了，但是假设 Maven 根据『**版本仲裁**』规则实际采纳的是 4.3.6。

> **版本仲裁**
>
> Maven 的版本仲裁机制只是在没有人为干预的情况下，自主决定 jar 包版本的一个办法。而实际上我们要使用具体的哪一个版本，还要取决于项目中的实际情况。所以在项目正常运行的情况下，jar 包版本可以由 Maven 仲裁，不必我们操心；而发生冲突时 Maven 仲裁决定的版本无法满足要求，此时就应该由程序员明确指定 jar 包版本。

版本仲裁遵循以下规则：

- **最短路径优先**

  - 在下图的例子中，对模块 pro25-module-a 来说，Maven 会采纳 1.2.12 版本。

  ![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226173029.png) 

  

- **路径相同时先声明者优先**

  - 此时 Maven 采纳哪个版本，取决于在 pro29-module-x 中，对 pro30-module-y 和 pro31-module-z 两个模块的依赖哪一个先声明。

  ![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226173041.png) 

  


#### 8.1.2 抛异常：找不到方法

程序找不到符合预期的方法。这种情况多见于通过反射调用方法，所以经常会导致：java.lang.NoSuchMethodError。

#### 8.1.3 没报错但结果不对

发生这种情况比较典型的原因是：两个 jar 包中的类分别实现了同一个接口，这本来是很正常的。但是问题在于：由于没有注意命名规范，两个不同实现类恰巧是同一个名字。



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226173049.png)



具体例子是实际工作中遇到过：项目中部分模块使用 log4j 打印日志；其它模块使用 logback，编译运行都不会冲突，但是会引起日志服务降级，让你的 log 配置文件失效。比如：你指定了 error 级别输出，但是冲突就会导致 info、debug 都在输出。

### 8.2 本质

以上表现形式归根到底是**两种基本情况**导致的：

- **同一 jar 包的不同版本**

  ![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226173101.png) 

  

- **不同 jar 包中包含同名类**

  - 这里我们拿 netty 来举个例子，netty 是一个类似 Tomcat 的 Servlet 容器。通常我们不会直接依赖它，所以基本上都是框架传递进来的。那么当我们用到的框架很多时，就会有不同的框架用不同的坐标导入 netty。可以参照下表对比一下两组坐标：

- 但是偏偏这两个『**不同的包**』里面又有很多『**全限定名相同**』的类。例如：

```java
org.jboss.netty.channel.socket.ServerSocketChannelConfig.class  org.jboss.netty.channel.socket.nio.NioSocketChannelConfig.class  org.jboss.netty.util.internal.jzlib.Deflate.class  org.jboss.netty.handler.codec.serialization.ObjectDecoder.class  org.jboss.netty.util.internal.ConcurrentHashMap$HashIterator.class  org.jboss.netty.util.internal.jzlib.Tree.class  org.jboss.netty.util.internal.ConcurrentIdentityWeakKeyHashMap$Segment.class  org.jboss.netty.handler.logging.LoggingHandler.class  org.jboss.netty.channel.ChannelHandlerLifeCycleException.class  org.jboss.netty.util.internal.ConcurrentIdentityHashMap$ValueIterator.class  org.jboss.netty.util.internal.ConcurrentIdentityWeakKeyHashMap$Values.class  org.jboss.netty.util.internal.UnterminatableExecutor.class  org.jboss.netty.handler.codec.compression.ZlibDecoder.class  org.jboss.netty.handler.codec.rtsp.RtspHeaders$Values.class  org.jboss.netty.handler.codec.replay.ReplayError.class  org.jboss.netty.buffer.HeapChannelBufferFactory.class
……
```

### 8.3 解决办法

很多情况下常用框架之间的整合容易出现的冲突问题都有人总结过了，拿抛出的异常搜索一下基本上就可以直接找到对应的 jar 包。我们接下来要说的是通用方法。

不管具体使用的是什么工具，基本思路无非是这么两步：

- 第一步：把彼此冲突的 jar 包找到
- 第二步：在冲突的 jar 包中选定一个。具体做法无非是通过 exclusions 排除依赖，或是明确声明依赖。

#### 8.3.1 IDEA 的 Maven Helper 插件

这个插件是 IDEA 中安装的插件，不是 Maven 插件。它能够给我们罗列出来同一个 jar 包的不同版本，以及它们的来源。但是对不同 jar 包中同名的类没有办法。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226173215.png)

然后基于 pom.xml 的依赖冲突分析，如下：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226173231.png)

查看冲突分析结果：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226173235.png)

#### 8.3.2 Maven 的 enforcer 插件

使用 Maven 的 enforcer 插件既可以检测同一个 jar 包的不同版本，又可以检测不同 jar 包中同名的类。

这里我们引入两个对 netty 的依赖，展示不同 jar 包中有同名类的情况作为例子。

```xml
<dependencies>
    <dependency>
        <groupId>org.jboss.netty</groupId>
        <artifactId>netty</artifactId>
        <version>3.2.10.Final</version>
    </dependency>

    <dependency>
        <groupId>io.netty</groupId>
        <artifactId>netty</artifactId>
        <version>3.9.2.Final</version>
    </dependency>
</dependencies>
```

然后配置 enforcer 插件：

```xml
<build>
    <pluginManagement>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-enforcer-plugin</artifactId>
                <version>1.4.1</version>
                <executions>
                    <execution>
                        <id>enforce-dependencies</id>
                        <phase>validate</phase>
                        <goals>
                            <goal>display-info</goal>
                            <goal>enforce</goal>
                        </goals>
                    </execution>
                </executions>
                <dependencies>
                    <dependency>
                        <groupId>org.codehaus.mojo</groupId>
                        <artifactId>extra-enforcer-rules</artifactId>
                        <version>1.0-beta-4</version>
                    </dependency>
                </dependencies>
                <configuration>
                    <rules>
                        <banDuplicateClasses>
                            <findAllDuplicates>true</findAllDuplicates>
                        </banDuplicateClasses>
                    </rules>
                </configuration>
            </plugin>
        </plugins>
    </pluginManagement>
</build>
```

执行如下 Maven 命令：

```bash
mvn clean package enforcer:enforce
```

部分运行结果：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241226173340.png)