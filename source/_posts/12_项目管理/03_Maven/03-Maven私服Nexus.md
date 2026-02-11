---
title: 03-Maven私服Nexus
date: 2018-5-23 22:18:03
tags:
- Maven
categories: 
- 12_项目管理
- 03_Maven
---



![maven](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/maven.jpg)

参考资料：

* 菜鸟教程：https://www.runoob.com/maven/maven-tutorial.html
* 极客学院：https://wiki.jikexueyuan.com/project/maven/



### 1.1 概念

私服是架设在局域网的一种特殊的远程仓库，目的是代理远程仓库及部署第三方构件。

有了私服之后，`当 Maven 需要下载依赖时，直接请求私服，私服上存在则下载到本地仓库；否则，私服请求外部的远程仓库，将构件/依赖下载到私服，再提供给本地仓库下载`。私服可以解决在企业做开发时每次需要的 jar 包都要在中央仓库下载，且每次下载完只能被自己使用，不能被其他开发人员使用的问题。

所谓私服就是一个服务器，但是不是本地层面的，是`公司层面`的，**公司中所有的开发人员都在使用同一个私服**。



### 1.2 架构

|                            无私服                            |                            有私服                            |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| ![私服1](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/maven指令3.jpg) | ![私服2](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/私服2.png) |

可以使用专门的 Maven 仓库管理软件来搭建私服，比如：Apache Archiva，Artifactory，Sonatype Nexus。如测试使用 Sonatype Nexus 安装配置私服仓库。

### 1.3 Nexus安装【☆】

#### 1.3.1 下载

* 官网：https://blog.sonatype.com/

* 下载地址：<https://help.sonatype.com/repomanager2/download/download-archives---repository-manager-oss>  



#### 1.3.2 安装

下载 `nexus-2.x-bundle.zip` 解压即可。

|                        nexus安装目录                         |
| :----------------------------------------------------------: |
| ![私服3](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/私服3.jpg) |

### 1.4 启动【☆】

解压后在 bin 目录中执行 cmd（需要以管理员权限执行）：

- `nexus install`  在系统中安装nexus服务
- nexus uninstall 卸载nexus服务
- `nexus start`    启动服务
- nexus stop    停止服务

![image-20200611114202879](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200611114202879.png)

> 注意：
>
> 1. 私服启动后，为了方便后面验证测试，该 cmd 窗口`不要关闭`！（实测为一直windows后台自启）
> 2. Nexus 私服使用的是 `8081` 端口，需要确保该端口没有被占用；
> 3. 8081 端口占用问题，可通过 电脑管家 中扫描开启启动项中，把 Nexus 服务开机自启禁用。



### 1.5 Nexus登录【☆】

访问私服：http://localhost:8081/nexus/

右上角 **login in** 默认登陆账号 `admin` 密码 `admin123`

|             登录 Nexus 才可以使用 Nexus 管理功能             |
| :----------------------------------------------------------: |
|![私服_list](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/私服_login.jpg) ![私服_login](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/私服_login2.jpg)  |

### 1.6 仓库列表【☆】

| 仓库类型 | 描述                                                         |
| ---------- | ------------------------------------------------------------ |
| group    | 包含多个仓库，通过group库的地址可以从包含的多个仓库中查找构件 |
| hosted   | 私服 服务器本地的仓库，其中存储诸多构件                      |
| proxy    | 代理仓库，其会关联一个远程仓库, 比如中央仓库，aliyun仓库，向该仓库查找构件时，如果没有会从其关联的仓库中下载 |

| 仓库名    | 描述                                                         |
| --------- | ------------------------------------------------------------ |
| Releases  | 存放项目的稳定发布版本，一个模块做完后如果需要共享给他人，可以上传到私服的该库 |
| Snapshots | 对应不稳定的发布版本                                         |
| 3rd party | 存放中央仓库没有的 ，如ojdbc.jar，可以上传到私服的该库中     |

|                           仓库列表                           |
| :----------------------------------------------------------: |
|![私服_login2](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/私服_list.jpg)  |



### 1.7 Maven配置私服 【★】

在maven中配置私服，使得maven可以从私服上获取构件/依赖。

#### 1.7.1 仓库组

私服中有一个仓库组，组中包含多个仓库，可以指定仓库组的url，即可从多个仓库中获取构件/依赖。

|              仓库组 注意：proxy的仓库排序在最后              |
| :----------------------------------------------------------: |
| ![私服_deploy2](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/私服_deploy2.jpg) |

| 设置 中央仓库 从远程地址下载，如 aliyun 中央仓库<br />地址：http://maven.aliyun.com/nexus/content/groups/public |
| :----------------------------------------------------------: |
| ![image-20200611113345254](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200611113345254.png) |

| Nexus 私服本地存储物理存储位置 |
| :----------------------------------------------------------: |
| ![2020-6-11-Nexus私服仓库本地物理路径](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/2020-6-11-Nexus私服仓库本地物理路径.png) |



#### 1.7.2 Maven关联私服

* 配置`settings.xml`，设置私服地址、认证等信息

```xml
<servers>
	<server> 
		<id>nexus-public</id> <!-- nexus的认证id -->
		<username>admin</username> <!--nexus中的用户名密码-->
		<password>admin123</password> 
	</server>
</servers>

<profiles>
    ...<!-- 其他 profile 如 JDK -->
	<profile> 
        <id>nexus</id> 
        <repositories> 
            <repository> 
                <id>nexus-public</id> <!--nexus认证id 【此处的repository的id要和 <server>的id保持一致】-->
                <!--name随便-->
                <name>Nexus Release Snapshot Repository</name> 
                <!--地址是 nexus 中仓库组对应的地址-->
                <url>http://localhost:8081/nexus/content/groups/public/</url>
                <releases><enabled>true</enabled></releases> 
                <snapshots><enabled>true</enabled></snapshots> 
            </repository>
        </repositories> 
        <pluginRepositories> <!--插件仓库地址，各节点的含义和上面是一样的-->
            <pluginRepository> 
                <id>nexus-public</id> <!--nexus认证id 【此处的repository的id要和 <server>的id保持一致】-->
                <!--地址是nexus中仓库组对应的地址-->
                <url>http://localhost:8081/nexus/content/groups/public/</url>
                <releases><enabled>true</enabled></releases> 
                <snapshots><enabled>true</enabled></snapshots> 
            </pluginRepository> 
        </pluginRepositories> 
    </profile>
</profiles>

<activeProfiles>
	...
    <!-- 使私服配置生效 -->
    <activeProfile>nexus</activeProfile>
</activeProfiles>
```

至此，Maven 项目中需要依赖时，Maven 会从私服中下载

> 注意：
>
> 为了测试，可以将 maven 中的本地仓库中的 依赖 全删除，然后通过 IDEA 的 自动导入包的设置进行自动下载，此时会将依赖全部下载到私服中。
>
> 验证私服中是否下载成功，访问 `settings.xml` 中配置的 profile 标签中的 仓库对应地址：
>
> http://localhost:8081/nexus/content/groups/public/

![image-20200611133435674](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200611133435674.png)



### 1.8 Maven项目部署到私服

* 执行 ：`mvn deploy`  即可将项目部署到私服对应的仓库中，此时项目中的打包方式多为 jar

但需要提前在项目的`pom.xml`中配置部署私服仓库位置，如下：

```xml
    ...
	<dependencies>
		.....
	</dependencies>
	
	<!-- 在项目的 pom.xml 中 配置私服的仓库地址，可以将项目打 jar 包部署到私服 -->
	<distributionManagement>
        <repository>
            <id>nexus-public</id> <!-- nexus认证id -->
            <url>http://localhost:8081/nexus/content/repositories/releases</url>
        </repository>
        <snapshotRepository>
            <id>nexus-public</id> <!-- nexus认证id -->
            <url>http://localhost:8081/nexus/content/repositories/snapshots</url>
        </snapshotRepository>
	</distributionManagement>
</project>
```

> 注意：
>
> 如上的 repository的 id 依然是要和 settings.xml 中配置的 server 中的 id 一致，才能通过私服的认证。
