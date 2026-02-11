---
title: 01-Maven安装与配置
date: 2018-5-23 22:18:03
tags:
- Maven
- 安装
- 配置
categories: 
- 12_项目管理
- 03_Maven
---



![maven](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/maven.jpg)

参考资料：

* 菜鸟教程：https://www.runoob.com/maven/maven-tutorial.html
* 极客学院：https://wiki.jikexueyuan.com/project/maven/

### 1. 引言

#### 1.1 项目管理问题

项目中jar包资源越来越多，jar包的管理越来越沉重。

##### 1.1.1 繁琐

要为每个项目手动导入所需的jar，需要搜集全部jar

##### 1.1.2 复杂

项目中的jar如果需要版本升级，就需要再重新搜集jar

##### 1.1.3 冗余

相同的jar在不同的项目中保存了多份

#### 1.2 项目管理方案

java项目需要一个统一的便捷的管理工具：**`Maven`**

### 2. 介绍

Maven这个单词来自于意第绪语（犹太语），意为知识的积累.

Maven是一个基于项目对象模型（POM）的概念的纯java开发的开源的项目管理工具。主要用来管理java项目，进行依赖管理(jar包依赖管理)和项目构建(项目编译、打包、测试、部署)。此外还能分模块开发，提高开发效率。

### 3. Maven安装

#### 3.1 下载Maven

| Maven 下载地址：http://maven.apache.org/download.cgi         |
| ------------------------------------------------------------ |
| ![image-20200610161324196](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200610161324196.png) |

#### 3.2 Maven安装

##### 3.2.1 解压

解压后，有如下目录：

```markdown
bin : 含有mvn运行的脚本
boot : 含有plexus-classworlds类加载器框架,Maven 使用该框架加载自己的类库。
conf : 含有settings.xml配置文件
lib : 含有Maven运行时所需要的java类库
```

> 注意： 解压文件尽量不要放在含有中文或者特殊字符的目录下。

##### 3.2.2 环境变量

maven依赖java环境，所以要确保java环境已配置好 （maven-3.3+ 需要jdk7+）

在 Windows 环境下 maven 本身有2个环境变量要配置：

```java
MAVEN_HOME = D:\maven\apache-maven-3.6.3
PATH = %MAVEN_HOME%\bin
```

##### 3.2.3 测试

查看maven版本信息 `mvn -v` ，即 配置OK。

```cmd
mvn -v

Apache Maven 3.6.3 (cecedd343002696d0abb50b32b541b8a6ba2883f)
Maven home: D:\maven\apache-maven-3.6.3\bin\..
Java version: 1.8.0_231, vendor: Oracle Corporation, runtime: D:\Java\jdk1.8.0_231\jre
Default locale: zh_CN, platform encoding: GBK
OS name: "windows 10", version: "10.0", arch: "amd64", family: "windows"
```

### 4. Maven配置

#### 4.1 本地仓库配置

maven的conf目录中有 `settings.xml` ，是maven的配置文件，找到 localRepository 注释的地方：

```xml
  <!-- localRepository
   | The path to the local repository maven will use to store artifacts.
   |
   | Default: ${user.home}/.m2/repository
  <localRepository>/path/to/local/repo</localRepository>
  -->
  <!-- 选择一个磁盘目录，作为本地仓库 -->
  <localRepository>D:\Program Files\maven\myrepository</localRepository>
```

#### 4.2 公共仓库配置

如使用 阿里云 aliyun 的 maven 公共仓库地址：

```xml
<!--setting.xml中添加如下配置-->
<mirrors>
	<mirror>
        <id>aliyun</id>
        <!-- 中心仓库的 mirror(镜像) -->
        <mirrorOf>central</mirrorOf>
        <name>Nexus aliyun</name>
        <!-- aliyun 的公共仓库地址 以后所有要指向中心仓库的请求，都会指向aliyun仓库-->
        <url>http://maven.aliyun.com/nexus/content/groups/public</url>
    </mirror>
</mirrors>
```

#### 4.3 JDK配置

在 `<profiles>` 标签中 增加 一个 `<profile>` 标签，限定maven项目默认的 jdk 版本，并设置生效：

```xml
<profiles>
    <!-- 在已有的 profiles 标签中添加 profile 标签 -->
	<profile>
        <!-- 该id为自定义名称，activeProfile生效时使用 -->
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
</profiles>

<!-- 让增加的 profile 生效 -->
<activeProfiles>
    <activeProfile>jdk-1.8</activeProfile>
</activeProfiles>
```

### 5.仓库

#### 5.1 概念

存储依赖的地方，体现形式就是本地的一个目录。

仓库中不仅存放依赖，而且管理着每个依赖的唯一标识(坐标)，Java项目凭坐标获取依赖。

#### 5.2 仓库分类

|                           仓库分类                           |
| :----------------------------------------------------------: |
| ![仓库分类](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/仓库分类.jpg) |

当需要依赖时，会从仓库中取查找，优先顺序为：

`本地仓库  >  私服(如果配置了的话) >  公共仓库(如果配置了的话) > 中央仓库`



#### 5.3 本地仓库

即在`settings.xml`中配置的目录。

`使用过了的依赖都会自动存储在本地仓库中，后续可以复用。`



#### 5.4 远程仓库

##### 5.4.1 中央仓库

* Maven 中央仓库是由 Maven 社区提供的仓库，不用任何配置，maven中内置了中央仓库的地址。
    其中包含了绝大多数流行的开源Java构件。
* https://mvnrepository.com/ 可以搜索需要的依赖的相关信息（仓库搜索服务）
* http://repo.maven.apache.org/maven2/  中央仓库地址



##### 5.4.2 公共仓库【★】

* 除中央仓库之外，还有其他远程仓库。
    比如aliyun仓库（http://maven.aliyun.com/nexus/content/groups/public/）

* 中央仓库在国外，下载依赖速度过慢，所以都会配置一个国内的公共仓库替代中央仓库。

比如 阿里云 的公共仓库：

```xml
<!--setting.xml中添加如下配置-->
<mirrors>
	<mirror>
        <id>aliyun</id>  
        <!-- 中心仓库的 mirror(镜像) -->
        <mirrorOf>central</mirrorOf>    
        <name>Nexus aliyun</name>
        <!-- aliyun仓库地址 以后所有要指向中心仓库的请求，都会指向aliyun仓库-->
        <url>http://maven.aliyun.com/nexus/content/groups/public</url>  
    </mirror>
</mirrors>
```

##### 5.4.3 私服

公司范围内共享的仓库，不对外开放。可以通过 Nexus来创建、管理一个私服。
