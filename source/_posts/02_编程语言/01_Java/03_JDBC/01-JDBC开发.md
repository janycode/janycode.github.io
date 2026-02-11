---
title: 01-JDBC开发
date: 2016-4-28 22:15:35
tags:
- JDBC
- 连接池
- 数据库
categories: 
- 02_编程语言
- 01_Java
- 03_JDBC
---

### 1. JDBC基本认识


#### 1.1 什么是JDBC？

> JDBC（Java DataBase Connectivity） Java连接数据库，可以`使用Java语言连接数据库完成CRUD操作`。



#### 1.2 JDBC核心思想

> Java中定义了访问数据库的接口，可以为多种关系型数据库提供统一的访问方式。
>
> 由数据库厂商提供驱动实现类(`Driver数据库驱动`)





##### 1.1.1 MySQL数据库驱动

> - mysql-connector-java-5.1.X 适用于5.X版本
> - mysql-connector-java-8.0.X 适用于8.X版本



##### 1.1.2 JDBC API

> JDBC 是由多个接口和类进行功能实现

| 类型      | 全限定名               | 简介                                                         |
| --------- | ---------------------- | ------------------------------------------------------------ |
| class     | java.sql.DriverManager | 管理多个数据库驱动类，提供了获取数据库连接的方法             |
| interface | java.sql.Connection    | 代表一个数据库连接(当Connection不是NULL时，表示已连接一个数据库) |
| interface | java.sql.Statement     | 发送SQL语句到数据库的工具                                    |
| interface | java.sql.ResultSet     | 保存SQL查询语句的结果数据(结果集)                            |
| class     | java.sql.SQLException  | 处理数据库应用程序时所发生的异常                             |



#### 1.3 环境搭建

> 1. 在项目下新建 `lib` 文件夹，用于存放 jar 文件
> 1. 将MySQL驱动文件 `mysql-connector-java-5.1.25-bin.jar` 复制到项目的lib文件夹中
> 2. 选中 lib 文件夹 右键选择 `add as library`，点击OK



### 2. JDBC开发步骤


#### 2.1 注册驱动

> 使用 `Class.forName("com.mysql.jdbc.Driver");` 手动加载字节码文件到JVM中

```java
Class.forName("com.mysql.jdbc.Driver");
```



#### 2.2 连接数据库

> - 通过 `DriverManager.getConnection(url,user,password);` 获得数据库连接对象
>   - URL:jdbc:mysql://localhost:3306/database
>   - user:root
>   - password:1234

```java
// useUnicode 和 utf8 字符集的设置为了使 MySQL 可以正常支持中文读写。
String url = "jdbc:mysql://localhost:3306/database?useUnicode=true&characterEncoding=utf8";
String username = "root";
String password = "1234";
Connection connection = DriverManager.getConnection(url, username, password);
```

- URL(Uniform Resource Locator)统一资源定位符：由协议、IP、端口、SID（程序实例名称）组成



#### 2.3 获取发送SQL的对象

> 通过Connection对象获得 `Statement对象 `，用于对数据库进行通用访问的

```java
Statement statement = connection.createStatement();
```



#### 2.4 执行SQL语句

> 编写SQL语句，并执行，接收执行后的结果

```java
String sqlStr = "update stu set student_name='小强',sex='男' where student_id = 'S1003'";
int result = statement.executeUpdate(sqlStr);
```

- 注意：在编写DML语句时，一定要注意字符串参数的符号是单引号  '值'
- DML语句：`增、删、改时，执行的结果是受影响行数(int类型)`。
- DQL语句：`查询时，返回的是数据结果集(ResultSet结果集)`。



#### 2.5 处理结果

> 接收并处理操作结果

```java
if(result > 0){
	System.out.println("执行成功");
}
```

- 受影响行数：逻辑判断，方法返回
- 查询结果集：迭代、依次获取



#### 2.6 释放资源

> 遵循的是`先开后关`的原则，释放过程中用到的所有资源对象

```
resultSet.close();
statement.close();
connection.close();
```



### 3. ResultSet(结果集)


> 在执行查询SQL后，存放查询到的结果集数据



#### 3.1 接收结果集

> 接收结果集：ResultSet resultSet = `statement.executeQuery(sql)`;

```java
ResultSet rs = statement.executeQuery("SELECT * FROM stu");
```



#### 3.2 遍历ResultSet中的数据

> ResultSet 以表(Table)结构进行临时结果的存储，需要通过JDBC API将其中的数据进行依次获取
>
> - 数据行指针：初始位置在第一行数据前，每调用一次`boolean next()`方法，ResultSet中指针向下移动一行，结果为true，表示当前行有数据。
> - rs.getXxx("列名"); 根据列名获得数据；
> - rs.getXxx(整数下标); 代表根据`列的编号顺序获得，从1开始`。

```java
boolean next() throws SQLException;//判断rs结果集中下一行是否有数据
```



##### 3.1.1 遍历方法

```java
int getXxxx(int columnIndex) throws SQLException;//获得当前行的第N列的int值
int getXxxx(String columnLabel) throws SQLException;//获得当前行columnLabel列的int值
```


### 4. 案例演示
```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class TestDql {
    public static void main(String[] args)  throws Exception{
        //1.注册驱动
        Class.forName("com.mysql.jdbc.Driver");

        //2.获得连接
        Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/companydb?useUnicode=true&characterEncoding=utf8","root","1234");

        //3.获取执行SQL的对象
        Statement statement = connection.createStatement();

        //4.编写SQL语句
        String sql = "select student_id,student_name,sex,birthday,phone,GradeId from stu;";
        ResultSet resultSet = statement.executeQuery(sql);

        //5.处理结果 （结果集！）
        while(resultSet.next()){//判断结果集中是否有下一行！
            //根据列名获取当前行每一列的数据
            String student_id = resultSet.getString("student_id");
            String student_name = resultSet.getString("student_name");
            String sex = resultSet.getString("sex");
            String birthday = resultSet.getString("birthday");
            String phone = resultSet.getString("phone");
            int gradeId = resultSet.getInt("gradeId");
            System.out.println(student_id+"\t"+student_name+"\t"+sex+"\t"+birthday+"\t"+phone+"\t"+gradeId);
        }

        //6.释放资源
        resultSet.close();
        statement.close();
        connection.close();

    }
}

```

### 5. 避免 SQL 注入
什么是SQL注入

> 当用户输入的数据中有SQL关键字或语法时，并且参与了SQL语句的编译，导致SQL语句编译后条件结果为true，一直得到正确的结果。称为SQL注入

如何解决SQL注入：
> 由于编写的SQL语句，是在用户输入数据后，整合后再编译成SQL语句。所以为了避免SQL注入的问题，使SQL语句在用户输入数据前，SQL语句已经完成编译，成为了完整的SQL语句，再进行填充数据。

`PreparedStatement` 接口继承了 Statement 接口。执行SQL语句的方法没有区别！
```java
/**
 * 解决 SQL 注入问题。
 */
public class TestLoginSafe {
    public static void main(String[] args) throws Exception {
        Scanner scanner = new Scanner(System.in);
        System.out.println("请输入用户名：");
        String username = scanner.nextLine(); // 使用 nextLine() 接收整行输入
        System.out.println("请输入密码：");
        String password = scanner.nextLine();

        Class.forName("com.mysql.jdbc.Driver");
        String url = "jdbc:mysql://localhost:3306/companydb?useUnicode=true&characterEncoding=utf8";
        Connection connection = DriverManager.getConnection(url, "root", "admin123");

        // 1.SQL 语句使用 ? 占位符填充
        String sql = "select * from user where username=? and password=?";
        // 2.预编译 SQL 语句
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
        System.out.println(preparedStatement);
        // 3.为占位符下标赋值，严格按顺序
        preparedStatement.setString(1, username);
        preparedStatement.setString(2, password);
        System.out.println(preparedStatement);

        // 执行 SQL 语句，此时不需要传参
        ResultSet resultSet = preparedStatement.executeQuery();
        if (resultSet.next()) {
            System.out.println("登陆成功！！！");
        } else {
            System.out.println("登陆失败。");
        }
    }
}
```