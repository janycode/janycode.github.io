---
title: 02-IDEA创建Maven项目
date: 2018-5-23 22:18:03
tags:
- Maven
- IDEA
categories: 
- 12_项目管理
- 03_Maven
---



![maven](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/maven.jpg)

参考资料：

* 菜鸟教程：https://www.runoob.com/maven/maven-tutorial.html
* 极客学院：https://wiki.jikexueyuan.com/project/maven/



### 1.1 在Idea中关联Maven

|                   在全局设置中，关联Maven                    |
| :----------------------------------------------------------: |
| ![idea关联maven](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/idea关联maven.jpg) |

### 1.2 创建Maven项目

#### 1.2.1 新建普通/web项目

|            新建普通 Maven 项目，要选择 Maven 选项            |
| :----------------------------------------------------------: |
| ![创建maven项目1](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/创建maven项目1.jpg) |

| 如需新建 `web` 项目，勾选 `Cteate from archetype`(从原型创建) > 选择 `maven-archetype-webapp` |
| :----------------------------------------------------------: |
| ![20200611104019-Maven创建web项目](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200611104019-Maven创建web项目.png) |

#### 1.2.2 指定项目名

GAV 坐标

![image-20200815180452774](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815180453.png)

#### 1.2.3 项目位置

|                           项目位置                           |
| :----------------------------------------------------------: |
| ![创建maven项目3](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/创建maven项目3.jpg) |

 ####  1.2.4 项目结构

* **src/main/java** 存放源代码，建包，放项目中代码(service,dao,User,....)
* **src/main/resources** 书写配置文件，项目中的配置文件(jdbc.properties) `不需拼路径可直接被读取`
* **src/test/java** 书写测试代码，项目中测试案例代码
* **src/test/resources** 书写测试案例相关配置文件 `手动创建文件夹时，选择即可`
* **根目录/pom.xml** (project object model) maven项目核心文件，其中定义项目构建方式，声明依赖等

> 注意：`项目中的建包，建类，执行，都和普通项目无差异`

|    项目结构（test 目录下添加 resources + 设置其文件类型）    |
| :----------------------------------------------------------: |
| ![创建maven项目5](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/创建maven项目5.jpg)<br />![image-20200610174423374](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200610174423374.png)<br />![image-20200610174451788](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200610174451788.png)<br />![image-20200610173804824](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200610173804824.png) |

##### 1.2.5 项目类型

> 根据项目类型，在 `pom.xml` 中做出对应配置，添加配置：`<packaging>war/jar</packaging>`

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.demo</groupId>
    <artifactId>test01</artifactId>
    <version>1.0-SNAPSHOT</version>
    <!-- 打包方式，如果是java项目则用 jar，
         如果是web项目则用 war -->
    <!--<packaging>war</packaging>-->
    <packaging>jar</packaging>
</project>
```



#### 1.3 导入依赖jar

建好项目后，需要导入需要的jar，要通过`坐标`(GAV)

* 每个构件都有自己的坐标 = `G`roupId + `A`rtifactId + `V`ersion = `项目标识` + `项目名` + 版本号

* 在maven项目中只需要配置坐标，maven便会自动加载对应依赖。删除坐标则会移除依赖

##### 1.3.1 查找依赖

依赖查找服务：https://mvnrepository.com/ ，获得依赖的坐标，在maven项目中导入。

|                         查找依赖坐标                         |
| :----------------------------------------------------------: |
| ![依赖搜索](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/依赖搜索.jpg) |
| ![依赖搜索2](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/依赖搜索2.jpg) |

##### 1.3.2 导入依赖

在项目的 pom 文件中，增加依赖。

> 注意：IDEA中新的项目需要 打开自动导入【`Enable-Auto-Import`】，根据依赖自动下载 jar 包到本地仓库并关联到 IDEA 中的当前项目。

|                 在项目的pom.xml文件添加依赖                  |
| :----------------------------------------------------------: |
| ![依赖搜索3](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/创建maven项目4.jpg) |

##### 1.3.3 同步依赖

引入坐标后，同步依赖，确认导入。

|      窗口右下角弹窗，刷新依赖，使新加的配置被maven加载       |
| :----------------------------------------------------------: |
| ![创建maven项目4](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/依赖搜索3.jpg) |



#### 1.4 创建web项目

##### 1.4.1 打包方式

pom.xml 中设置 `<packaging>war</packaging>`

> 注意：packaging 标签中 `war 为 web 项目`打包文件后缀，`jar 为 java 项目`打包文件后缀。

|                  web项目打包方式为：[war]()                  |
| :----------------------------------------------------------: |
| ![web项目1](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/web项目1.jpg) |

##### 1.4.2 web依赖

导入 `JSP` 和 `Servlet` 和 `JSTL` 依赖，使项目具有web编译环境。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project ...>
    ...
    <packaging>war</packaging>

	<!-- 导入JSP 和 Servlet 和 JSTL 依赖 -->
    <dependencies>
        <dependency>
            <!-- jstl 支持 -->
            <groupId>javax.servlet</groupId>
            <artifactId>jstl</artifactId>
            <version>1.2</version>
        </dependency>
        <dependency>
            <!-- servlet编译环境 -->
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>3.1.0</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <!-- jsp编译环境 -->
            <groupId>javax.servlet</groupId>
            <artifactId>jsp-api</artifactId>
            <version>2.0</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
</project>
```

##### 1.4.3 webapp目录

按照 maven 规范，新建 web 项目特有目录，packaging 标签必须为 war 类型才能自动识别 webapp 目录。

> 注意：实际开发中，可在 Maven 项目创建时勾选 `Cteate from archetype`(从原型创建) > 选择 `maven-archetype-webapp` 以直接创建带有 web 项目目录的工程结构。

|                      新建如下目录和文件                      |
| :----------------------------------------------------------: |
| ![web项目2](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/web项目2.jpg) |

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
	<!-- 这是一个空白的web.xml文件模板 -->
</web-app>
```

##### 1.4.4 定义Servlet和Jsp

|                         照常定义即可                         |
| :----------------------------------------------------------: |
| ![web项目3](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/web项目3.jpg) |

#### 1.5 部署web项目

##### 1.5.1 新增Tomcat

|                          新增Tomcat                          |
| :----------------------------------------------------------: |
| ![web项目4-新建tomcat](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/web项目4-新建tomcat.jpg) |
| ![web项目5-新建tomcat2](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/web项目5-新建tomcat2.jpg) |
| ![web项目6-新建tomcat3](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/web项目6-新建tomcat3.jpg) |

##### 1.5.2 部署web项目

|                         部署web项目                          |
| :----------------------------------------------------------: |
| ![web项目7-新建tomcat4](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/web项目7-新建tomcat4.jpg) |
| ![web项目8-新建tomcat5](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/web项目9-新建tomcat6.jpg) |
| ![web项目9-新建tomcat6](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/web项目10-启动Tomcat.jpg) |

##### 1.5.3 启动Tomcat

|                          启动Tomcat                          |
| :----------------------------------------------------------: |
| ![web项目10-启动Tomcat](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/web项目8-新建tomcat5.jpg) |
| ![maven指令3](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/web项目11-访问servlet.jpg) |


#### 1.6 依赖生命周期

##### 1.1.1 概念

Jar包生效的时间段，即Jar的生命周期。

##### 1.1.2 使用方式

项目中导入的依赖可以通过 `<scope>` 标签做生命周期的管理。

```xml
<dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.6</version>
    <!-- 生命周期 -->
    <scope>compile</scope>
</dependency>
<dependency>
    <!-- servlet编译环境 -->
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>3.1.0</version>
    <!-- 生命周期 -->
    <scope>provided</scope>
</dependency>
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.12</version>
    <!-- 生命周期 -->
    <scope>test</scope>
</dependency>
```

##### 1.1.3 生命周期详解

| 标识       | 周期                                                         |
| ---------- | ------------------------------------------------------------ |
| compile    | `缺省值`，适用于所有阶段（测试运行，编译，运行，打包）       |
| `provided` | 类似compile，`期望JDK、容器或使用者会提供这个依赖`。如servlet-api.jar；适用于（测试运行，编译）阶段 |
| `runtime`  | `只在运行时使用`，如 mysql的驱动jar，适用于（运行，测试运行）阶段 |
| `test`     | `只在测试时使用`，适用于（编译，测试运行）阶段，如 junit.jar |
| system     | Maven不会在仓库中查找对应依赖，在本地磁盘目录中查找；适用于（编译，测试运行，运行）阶段 |

### 1.7 Maven指令

通过Idea打开 `Terminal`，然后执行Maven指令。

|                  打开 cmd，并定位到项目目录                  |
| :----------------------------------------------------------: |
| ![maven指令](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/maven指令.jpg) |

|                        执行maven指令                         |
| :----------------------------------------------------------: |
| ![maven指令2](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/私服1.png) |



Idea中有Maven面板，其中可以快速执行Maven指令。

|                          maven面板                           |
| :----------------------------------------------------------: |
| ![web项目11-访问servlet](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/maven指令2.jpg) |
