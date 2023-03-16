---
title: 01-properties读写
date: 2016-4-28 22:03:43
tags:
- JavaSE
- File
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 06_文件和流
---

### 1. ".properties"配置文件介绍

![image-20230316140420688](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316140421.png)
后缀名为.properties是一种属性配置文件。
这种文件以key=value格式存储内容，Java中可以使用Properties类来读取这个文件
String value=p.getProperty(key);
就能得到对应的数据，一般这个文件作为一些参数的存储，代码就可以灵活一点。

>用于适应多语言环境，随着系统的语言环境的变化，读取不同的属性文件，存放一组配置(类似win下.ini, 还要简单些, 因为没有section)

由于难以表达层次, 复杂点可以用xml做配置替换.properties文件.
通俗点讲就相当于定义一个变量，在这个文件里面定义这些变量的值，在程序里面可以调用这些变量，好处就是，如果程序中的参数值需要变动，直接来改这个.properties文件就可以了，不用在去修改源代码。

优点在于有利于你以后的代码重构，集中管理，维护方便。

### 2. Eclipse中怎么创建properties文件
通用【新建】快捷键：Ctrl + N
![image-20230316140429767](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316140430.png)
![image-20230316140441641](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316140442.png)
![image-20230316140452903](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316140453.png)
写它，写它，写它，OMG！！！

### 3. Properties 类的特点
Properties类继承自Hashtable类并且实现了Map接口，也是使用一种键值对的形式来保存属性集。
特点如下：
1. 它的key键和value值都是**字符串类型**；
2. 它继承自线程安全的Hashtable，因此也是**线程安全**的；
3. 用法与HashMap和Hashtable类似，**不需要指定泛型**；
4. 主要用于.properties**配置文件的读写**。

常用方法：
```java
String	getProperty(String key)
使用此属性列表中指定的键搜索属性。
String	getProperty(String key, String defaultValue)
使用此属性列表中指定的键搜索属性。
void	list(PrintStream out)
将此属性列表打印到指定的输出流。
void	list(PrintWriter out)
将此属性列表打印到指定的输出流。
void	load(InputStream inStream)
从输入字节流读取属性列表（键和元素对）。
void	load(Reader reader)
以简单的线性格式从输入字符流读取属性列表（关键字和元素对）。
void	loadFromXML(InputStream in)
将指定输入流中的XML文档表示的所有属性加载到此属性表中。
Enumeration<?>	propertyNames()
返回此属性列表中所有键的枚举，包括默认属性列表中的不同键，如果尚未从主属性列表中找到相同名称的键。
Object	setProperty(String key, String value)
调用 Hashtable方法 put 。
void	store(OutputStream out, String comments)
将此属性列表（键和元素对）写入此 Properties表中，以适合于使用 load(InputStream)方法加载到 Properties表中的格式输出流。
void	store(Writer writer, String comments)
将此属性列表（键和元素对）写入此 Properties表中，以适合使用 load(Reader)方法的格式输出到输出字符流。
void	storeToXML(OutputStream os, String comment)
发出表示此表中包含的所有属性的XML文档。
void	storeToXML(OutputStream os, String comment, String encoding)
使用指定的编码发出表示此表中包含的所有属性的XML文档。
Set<String>	stringPropertyNames()
返回此属性列表中的一组键，其中键及其对应的值为字符串，包括默认属性列表中的不同键，
如果尚未从主属性列表中找到相同名称的键。
```


### 4. 读写.properties配置文件（非常简单）
(1) **load**(InputStream inStream)
这个方法可以从.properties属性文件对应的文件输入流中，加载属性列表到Properties类对象。如下面的代码：
```java
File file = new File("files\\config.properties");
Properties pt = new Properties();

// 如果文件不存在会抛出异常:FileNotFoundException
if (file.exists()) {
	pt.load(new FileReader(file));
} else {
	file.createNewFile();
}
```
(2) **store**(OutputStream out, String comments)
这个方法将Properties类对象的属性列表保存到输出流中。如下面的代码：
```java
File file = new File("files\\config.properties");
Properties pt = new Properties();

// 如果文件不存在会自动创建该文件(空文件)
pt.setProperty("testData1", "123456");
pt.setProperty("testData2", "888888");
// 将pt对象中的数据存储到文件(有数据的文件)
pt.store(new FileWriter(file), "提交账号密码");
```

(3) **getProperty** / **setProperty**
这两个方法是分别是获取和设置属性信息。

示例代码：
```java
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.Map.Entry;
import java.util.Properties;

public class TestProperties {
	public static void main(String[] args) throws Exception {
		File file = new File("files\\config.properties");
		Properties pt = new Properties();

		// 如果文件不存在会自动创建该文件(空文件)
		pt.setProperty("testData1", "123456");
		pt.setProperty("testData2", "888888");
		// 将pt对象中的数据存储到文件(有数据的文件)
		pt.store(new FileWriter(file), "提交账号密码");
		
		// 如果文件不存在会抛出异常:FileNotFoundException
		if (file.exists()) {
			pt.load(new FileReader(file));
		} else {
			file.createNewFile();
		}
		
		for (Entry<Object, Object> entry : pt.entrySet()) {
			System.out.println(entry.getKey() + " " + entry.getValue());
		}
	}
}
```
运行结果：
![image-20230316140509300](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316140510.png)