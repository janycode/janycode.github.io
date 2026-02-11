---
title: 01-JDK环境搭建
date: 2016-4-28 21:45:47
tags:
- JavaSE
- JDK
- 环境
- 配置
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 01_基础语法
---

### 1.1 Java的由来

   1995年推出

   1996年发布JDK1.0

   2009年被Oracle收购

   2014年由Oracle发布Java 8.0 （JDK1.8 较成熟应用较多）



1.1.1 JavaSE：Java Platform Standard Edition (Java平台标准版) CoreJava

1.1.2 JavaEE：Java Platform Enterprise Edition (Java平台企业版) 企业级开发

​     1) C/S 结构的应用程序

​       Client/Server, 需要下载安装本地客户端的软件，如QQ、大型游戏等等...

​     2) B/S 结构的应用程序

​       Browser/Server, 通过浏览器输入域名可以直接访问的软件，如百度，淘宝等等...

1.1.3 JavaME：Java Platform Micro Edition (Java平台微小版) Java最初的定位(机顶盒)



### 1.2 Java的特点

1.2.1 面向对象

   我们为什么要学习软件？

  行业前景？钱途？找对象？--new？兴趣爱好？

  模拟现实世界，解决现实问题。（抓现实的痛点）每一个软件、产品，都有存在的意义和价值。



  淘宝解决了什么问题？

​     买东西 -> 出门 -> 逛街 -> 付款 -> 带着东西回家（累，多了商品少了钱）

​     买东西 -> 足不出户的逛 -> 付款 -> 快递送货上门 (类，多了商品少了钱) 节省了时间

​     痛点：机会成本（8h投入，现在1h投入，节约了7h）

   

  淘宝卖家 -- 淘宝买家 无法建立陌生人信任（支付宝公信平台）



1.2.2 简单

  Java有虚拟机，内置了垃圾收集器（GC），自动完成内存空间的管理，规避可能因人为导致的问题。



1.2.3 跨平台

  跨操作系统（Windows<C#>，Unix-Linux，MacOS，Solaris）、服务器、数据库



### 1.3 Java的运行机制

1.3.1 编译执行

  在具体的环境中（windows）执行一次翻译的工作（源代码->二进制），执行时运行的是二进制文件。

  执行效率高，但是不能跨平台。



1.3.2 解释执行

  在具体环境中一行一行解释并执行，不同的环境都有自己的解释器。

  可以跨平台，但执行的效率低。



1.3.3 Java运行机制：先编译、再解释

  *.java(源文件) -> 编译 -> *.class(字节码文件) -> 执行 -> Win/Unic/MacOS/Others-(JVM)

  Java设计理念：Write Once Run Anywhere.



1.3.4 名词解释

  JVM（Java Virtual Machine）虚拟机：使用软件在不同操作系统中模拟相同的环境。

  JRE（Java Runtime Environment）运行环境：包含JVM和解释器，完整的Java运行环境。

  JDK（Java Development Kit）开大环境：包含JRE + 类库 + 开发工具包（编译器+调试工具）。



### 1.4 Java的环境搭建

1.4.1 JDK获取

所有的安装工具都从官网（oracle甲骨文）获取。

官网JDK1.8：

https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html

下载需注册账号。

安装建议：

   1.不安装在C盘；

   2.安装路径不带任何中文和空格；

   3.JDK、JRE安装到同目录下；



1.4.2 JDK安装

安装可以不再安装JRE（也就是安装过程的第二步）



1.4.3 JDK环境变量配置

win+E >> 右键(空白处) >> 属性 >> 环境变量

- **新建系统变量**：

   变量名：JAVA_HOME

   变量值：E:\program files\Java\jdk1.8.0_231 （找到实际安装路径）

- **新建系统变量**：

   变量名：CLASS_PATH

   变量值：.;%JAVA_HOME%\lib;%JAVA_HOME%\lib\tools.jar

- **编辑Path变量**：

   变量名：Path

   变量值：;%JAVA_HOME%\bin;%JAVA_HOME%\jre\bin; （末尾添加）

验证是否安装OK：cmd命令窗口中输入"javac -version"



1.4.4 常用DOS命令操作

Win+R 呼出windows运行窗口：

   更换盘符：d:

  查看当前目录下的文件和文件夹：dir

  创建文件夹：mkdir 文件夹名字

  进入文件夹：cd 文件夹名字

  返回上一级目录：cd ..

  清空屏幕：cls

  删除文件：del 文件名

  删除文件夹：rd 文件夹名称

  退出：exit



### 1.5 第一个Java程序

创建HelloWorld.java

```java
class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, Java!!!");
    }
}
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

### 1.6 编译和运行

win> `javac HelloWorld.java`

win> `java HelloWorld`

Hello, java!!!



### 1.7 类的阐述

- 同一个源文件中可以定义多个类
- 相同源文件中的多个类编译后会生成各自的.class文件
- 一个类中只能有一个主函数main，每个类都可以有各自的主函数main
- public修饰的类成为公开类，要求类名与文件名必须相同，包括大小写
- 一个源文件中只能有一个public公开类



编程习惯：一个源文件中只写一个public公开类就够了，便于维护。



### 1.8 Package（包）

- 包的作用：类似文件夹，用于管理归纳字节码(.class)文件。
- 声明语法：`package 包名`;
- 多级目录：`package 包名.包名`; （可以设置多个包名，即多个层级的目录）
- 多级规则：采用域名倒置的方式，eg：[cn.com.company.department.group.project.module.XxxClass](http://cn.com.company.department.group.project.module.xxxclass/)
- 位置：必须写在源文件的第一行
- 带包编译：`javac -d 目录名 源文件.java` (会自动创建package包目录)

​     eg：javac -d . MyPack.java

​     当前目录下会生成 test 目录，将.class字节码文件放在test目录下。

- 带包运行：java 包名.类名 （包名+类名又称全限定名）

​     eg：java test.MyPack

​     当前目录下会自动查找test目录下的MyPack.class进行运行

```java
package test; // 运行时则会使用 test.MyPack 格式的类
public class MyPack{
    public static void main(String[] args) {
        System.out.println("test Package location...");
    }
}
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

### 1.9 编码规范

- 层级之间必须缩进（Tab：一个制表位/4个空格）
- 一行只写一句代码
- 单行注释：// 单行注释
- 多行注释：/* 多行注释 */
- 文档注释：/** 文档注释 */

​     生成外部文档：javadoc -d 目录名 源文件.java

​     文档注意事项：1.源文件编码问题，中文使用utf-8；2.主要查看index.html文件

- 标识符命名：

​     1）字母、数字、下划线、$组成，但不能以数字开头

​     2）不能与关键字、保留字重名

- 标识符约定俗成：

​     1）望文生义、见名知意

​     2）类名首字母大写，由一个或多个单词组成（大驼峰命名）

​     3）函数名、变量名首单词首字母小写，由一个或多个单词组成（小驼峰命名），拼接词首字母大写

​     4）包名全小写，只可以使用特殊字符"."，并且不可以以"."开头或者结尾

​     5）常量全大写，多个单词用"_"连接

编码规范终极参考：[阿里巴巴Java开发手册(代码规范).pdf](https://github.com/alibaba/p3c)