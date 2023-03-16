---
title: 02-IDEA快捷键&高效插件
date: 2016-5-8 21:13:45
tags: 
- IDEA
- 快捷键
- 插件
categories:
- 00_先利其器
- 01_Intellij IDEA
---

### IDEA 生成 war 包
![image-20230316112703789](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316112704.png)
1. 配置：
**Project Structure**图标 >> **Artifacts** >> `+` 新增**Web Application: Arichive**选择当前项目**xxx:war** >> OK
2. 生成：
**Build** >> **Build Artifacts** >> 选择**xxx:war**点击**Build** >> out/artifacts/xxx_war/xxx_war.war
3. 部署：
将xxx_war.war包放在 Tomcat 的 `webapps` 目录下，启动服务器会自动解压该web项目，便于直接访问

### IDEA 生成 UML 类图

![image-20230316111906745](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316111907.png)

### IDEA 常用 快捷键
![image-20230316111922215](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316111923.png)

快速单元测试快捷键: **`Ctrl+Shift+T` --> create new test ** 然后选择对应的方法进行测试就好了。




### IDEA 高效 插件
![image-20230316112440714](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316112441.png)

> 自用存留最久的插件列表：
>
> * Alibaba Java Coding Guidelines 阿里巴巴Java编程规范，自动提示、警告
> * arthas idea 阿里巴巴开源Arthas工具
> * CodeGlance 代码编辑区右侧缩略图
> * Codota AI Autocomplete for Java 利用机器学习来得出最佳代码提示、检索热门代码示例等
> * Easy Code 快速生成类、方法、属性等中文Javadoc
> * GenerateAllSetter 快速生成类实例的所有属性setter方法或getter方法
> * GsonFormatPlus 从 Json String 生成 Json 模型的插件
> * Lombok POJO类的方法注解支持，懂的都懂
> * MyBatisCodeHelperPro 破解版手动从本地安装，mybatis/mybatis-plus强力插件
> * RestfulTool 一套Restful服务开发辅助工具集
> * SequenceDiagram 类的关系或方法调用关系图
> * SpotBugs 本地代码检查工具
> * Translation 翻译工具，Ctrl+Q 的时候可以自动翻译 或 Ctrl+Shift+Y 对选定内容翻译
> * Easy Javadoc 一键生成java代码注释，包含类、属性、方法



### IDEA /** 自动方法注释

![image-20220519225928665](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220519225937.png)

Template text：

```java
** 
 * $DESCRIPTION$
 * 
 $PARAM$
 * @return $RETURN$
 * @since $DATE$ $TIME$
 * @author Jerry(姜源)
 */
```

PARAM变量：

```java
groovyScript("def result = '';def params = \"${_1}\".replaceAll('[\\\\[|\\\\]|\\\\s]', '').split(',').toList(); for(i = 0; i < params.size(); i++) {if(params[i] != '')result+='* @param ' + params[i] + ((i < params.size() - 1) ? '\\r\\n ' : '')}; return result == '' ? null : '\\r\\n ' + result", methodParameters())
```

> 最好的方式使用插件：Easy Javadoc 一键生成java代码注释，包含类、属性、方法

![image-20230316112335649](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316112336.png)

Method Template:

```
/**
 * $DOC$
 *
 * $PARAMS$
 * $RETURN$
 * @author $author$
 * @date $date$
 */
```

