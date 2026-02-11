---
title: 08-MyBatis 逆向工程
date: 2017-6-19 08:26:24
tags:
- MyBatis
categories: 
- 05_数据库
- 02_MyBatis
---



![001](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/001.png)



> 【躲坑】：
>
> * 注意数据库中字段名（列名）要与实体类中的字段名（属性名）完全一致
> * 解决办法：在逆向工程生成 pojo 后，`手动将 实体类的属性名+Mapper.xml的属性名 修改为完全一致`，避免 N 多映射问题。
>
> 即：`数据库字段名`、`实体类字段名`、`前端页面标签中的 name 属性值`，三者必须完全一致。
>
> 原因：
>
> 1. 数据库中使用小驼峰命名时，如 className，逆向工程生成 pojo 实体类属性名会变成 classname；
>
> 2. 数据库中使用下划线命名时，如 class_name，逆向工程生成 pojo 实体类属性名会变成 className；



### 1. 概念

*逆向工程*,有的人也叫*反求工程*,英文是reverse engineering,大意是根据已有的东西和结果,通过分析来推导出具体的实现方法。

说白点，就是 `生成指定代码`。

> 如 Mybatis 的逆向工程生成器，可以帮我们生成 pojo 实体类 + dao 接口 + dao 实现类 Mapper.xml



### 2. 官网入门

官方网站：http://mybatis.org/generator/



### 3. 开发步骤(简化)

#### 3.1 创建 JavaEE 项目

其实 使用 JavaSE、或者 通过 Maven 创建 SpringMVC 的web工程也可以（pom导入依赖很方便），此处单独拷贝的 jar 包。

![image-20200625075438785](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200625075439.png)

#### 3.2 GeneratorSqlmap

唯一的一个 Java 文件，也是主要的代码生成文件。放在 src 下。`无需修改`。

```java
import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.mybatis.generator.api.MyBatisGenerator;
import org.mybatis.generator.config.Configuration;
import org.mybatis.generator.config.xml.ConfigurationParser;
import org.mybatis.generator.internal.DefaultShellCallback;

public class GeneratorSqlmap {

	public void generator() throws Exception{

		List<String> warnings = new ArrayList<String>();
		boolean overwrite = true;
		//指定 逆向工程配置文件
		File configFile = new File("src/generatorConfig.xml");
		ConfigurationParser cp = new ConfigurationParser(warnings);
		Configuration config = cp.parseConfiguration(configFile);
		DefaultShellCallback callback = new DefaultShellCallback(overwrite);
		MyBatisGenerator myBatisGenerator = new MyBatisGenerator(config,
				callback, warnings);
		myBatisGenerator.generate(null);

	} 
	
	public static void main(String[] args) throws Exception {
		try {
			GeneratorSqlmap generatorSqlmap = new GeneratorSqlmap();
			generatorSqlmap.generator();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}

```



#### 3.3 generatorConfig.xml

唯一的一个配置文件。放在 src 下。`只需要修改 数据库名 + 指定数据表的名字(可以多个)即可`。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
  PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
  "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">

<generatorConfiguration>
	<context id="testTables" targetRuntime="MyBatis3">
		<commentGenerator>
			<!-- 是否去除自动生成的注释 true：是 ： false:否 -->
			<property name="suppressAllComments" value="true" />
		</commentGenerator>
		<!--数据库连接的信息：驱动类、连接地址、用户名、密码(此处需修改为指定的数据库名) -->
		<jdbcConnection driverClass="com.mysql.jdbc.Driver"
			connectionURL="jdbc:mysql://localhost:3306/videos" userId="root" password="123456">
		</jdbcConnection>
		<!-- <jdbcConnection driverClass="oracle.jdbc.OracleDriver"
			connectionURL="jdbc:oracle:thin:@127.0.0.1:1521:yycg" 
			userId="yycg"
			password="yycg">
		</jdbcConnection> -->

		<!-- 默认false，把JDBC DECIMAL 和 NUMERIC 类型解析为 Integer，为 true时把JDBC DECIMAL 和 
			NUMERIC 类型解析为java.math.BigDecimal -->
		<javaTypeResolver>
			<property name="forceBigDecimals" value="false" />
		</javaTypeResolver>

		<!-- targetProject:生成PO类的位置 -->
		<javaModelGenerator targetPackage="com.demo.pojo"
			targetProject=".\src">
			<!-- enableSubPackages:是否让schema作为包的后缀 -->
			<property name="enableSubPackages" value="false" />
			<!-- 从数据库返回的值被清理前后的空格 -->
			<property name="trimStrings" value="true" />
		</javaModelGenerator>
        <!-- targetProject:mapper映射文件生成的位置 -->
		<sqlMapGenerator targetPackage="com.demo.dao" 
			targetProject=".\src">
			<!-- enableSubPackages:是否让schema作为包的后缀 -->
			<property name="enableSubPackages" value="false" />
		</sqlMapGenerator>
		<!-- targetPackage：mapper接口生成的位置 -->
		<javaClientGenerator type="XMLMAPPER"
			targetPackage="com.demo.dao" 
			targetProject=".\src">
			<!-- enableSubPackages:是否让schema作为包的后缀 -->
			<property name="enableSubPackages" value="false" />
		</javaClientGenerator>
		<!-- 指定数据库表(此处需修改为指定生成的表) -->
		<table schema="" tableName="admin"></table>
		<table schema="" tableName="course"></table>
		<table schema="" tableName="speaker"></table>
		<table schema="" tableName="subject"></table>
		<table schema="" tableName="user"></table>
		<table schema="" tableName="video"></table>
		
		<!-- 有些表的字段需要指定java类型
		 <table schema="" tableName="">
			<columnOverride column="" javaType="" />
		</table> -->
	</context>
</generatorConfiguration>
```



#### 3.4 log4j.properties

没啥说的，为了看日志。

```properties
log4j.rootLogger=DEBUG, Console
#Console
log4j.appender.Console=org.apache.log4j.ConsoleAppender
log4j.appender.Console.layout=org.apache.log4j.PatternLayout
log4j.appender.Console.layout.ConversionPattern=%d [%t] %-5p [%c] - %m%n
log4j.logger.java.sql.ResultSet=INFO
log4j.logger.org.apache=INFO
log4j.logger.java.sql.Connection=DEBUG
log4j.logger.java.sql.Statement=DEBUG
log4j.logger.java.sql.PreparedStatement=DEBUG
```



#### 3.5 测试生成(图)

![image-20200625075911068](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200625075932.png)

#### 3.6 检查确认

检查实体类属性名是否与数据库的字段名完全一致，不一致时及时修改（`实体类属性 + mapper.xml`）。

后续使用 lombok 注解生成实体类构造和方法、mybatis 映射、springMVC 映射页面 name 到控制器参数才可以正常。



### 4. text 大文本显示

当数据库中存在 `text` 类型的文本字段(非 VARCHAR)时，在逆向工程中生成的并没有进行属性映射，需要手动将该 `result` 标签放在 resultMap 映射中，才能生效。

如图：

![image-20200628134209165](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200628134210.png)