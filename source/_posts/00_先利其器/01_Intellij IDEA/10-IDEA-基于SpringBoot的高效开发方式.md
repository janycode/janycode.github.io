---
title: 10-IDEA-基于SpringBoot的高效开发方式
date: 2021-1-1 13:26:09
tags: 
- IDEA
- SpringBoot
- 开发
categories:
- 00_先利其器
- 01_Intellij IDEA
---



大道至简，一切皆是效率！

`基于 SpringBoot + MybatisPlus 框架和 IDEA 插件的高效率开发方式！ ——Jerry(姜源)`



> 场景：数据库设计已经完成。

### 1. 代码生成

`MyBatisCodeHelper 插件` 或 [在线的代码生成器-基于数据库建表语句](https://java.bejson.com/generator/)

下载安装：[08-IDEA-MyBatisCodeHelper插件](https://janycode.github.io/2017/12/18/00_%E5%85%88%E5%88%A9%E5%85%B6%E5%99%A8/01_Intellij%20IDEA/08-IDEA-MyBatisCodeHelper%E6%8F%92%E4%BB%B6/index.html)

使用步骤：

1. 配置IDEA连接数据库 DataBase：[配置方法说明](https://janycode.github.io/2016/05/18/00_%E5%85%88%E5%88%A9%E5%85%B6%E5%99%A8/01_Intellij%20IDEA/05-IDEA-sql%E8%87%AA%E5%8A%A8%E8%A1%A5%E5%85%A8/index.html)

2. 右键数据库表名，生成三层架构：
    ![image-20210101134511581](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210106225719.png)

![image-20210101135003574](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210106225716.png)

### 2. 生成 SQL

mybatisplus 通过方法名规则生成所需方法(不需要写mapper.xml中的sql)

![image-20210106230247422](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210106230248.png)

右键选择生成SQL：

![image-20210106230331183](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210106230332.png)

即可生成对应xml的SQL语句。

### 3. Api 快速定位+测试

`restfulTool 插件`

扫描所有的接口路径，以及展示方法的返回 json 字符串。`Ctrl + Alt + /` 快速搜索接口名。

![image-20210106230127887](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210106230129.png)

![image-20210106230013715](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210106230014.png)

### 4. Dto用json快速生成

`GSONFortmatPlus 插件`

按`Alt+s`打开GsonFormat窗口，输入json格式的字符串，根据选项按需生成自定义的接口交互 dto 类

```json
{
    "username": "wanglz",
    "password": 123,
    "age": 18
}　
```

![image-20210106231016480](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210106231017.png)