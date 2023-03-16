---
title: 07-dbutils结果集
date: 2018-5-1 10:14:14
tags:
- JDBC
categories: 
- 02_编程语言
- 01_Java
- 03_JDBC
---



>Apache Commons DbUtils jar包：`commons-dbutils-1.7.jar`
>下载地址为：[https://mvnrepository.com/](https://mvnrepository.com/)

### 1. ResultSetHandler 接口
![image-20230316141105303](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316141106.png)

ResultSetHandler 接口的实现类：

- 处理**单行数据**的类：`ScalarHandler`/`ArrayHandler`/`MapHandler`/`BeanHandler`
- 处理**多行数据**的类：`BeanListHandler`
AbstractListHandler抽象类（`ArrayListHandler`/`MapListHandler`/`ColumnListHandler`）
AbstractKeyedHandler抽象类（`KeyedHandler`/`BeanMapHandler`）
- 可扩展的类：BaseResultSetHandler抽象类(可继承它后实现自己的结果集转换器)

QueryRunner 的 query 方法的返回值最终取决于 query 方法的 ResultHandler 参数的 hanlde 方法的返回值。

```java
package org.apache.commons.dbutils;

import java.sql.ResultSet;
import java.sql.SQLException;
/**
 * 此接口的实现将 ResultSet 转换为其他对象
 * T： 目标类型（类型参数），也就是 ResultSet 转换为的对象的类型
 */
public interface ResultSetHandler<T> {
	/**
     * 方法说明：将 ResultSet 转换为一个对象
     * @var1： 要转换的 ResultSet
     * T： 返回用 ResultSet 数据初始化的对象
     * 如果 ResultSet 包含0行，那么实现返回 null 也是合法的
     * 数据库访问出错将会抛出 SQLException 异常
     */
	T handle(ResultSet var1) throws SQLException;
}
```

### 2. 单行数据
#### 2.1 ScalarHandler 单值
可以返回指定列的一个值或返回一个统计函数的值，比如count(*)。

`该实现类会自动推导数据库中数据的类型，注意类型的转换`

```java
/**
 * 获取员工表中的员工数量
 * @return 整型数量
 */
public Integer getTotalSize() throws SQLException {
    return queryRunner.query(
            "select count(*) from t_employees",
            new ScalarHandler<Long>()
    ).intValue(); // Long自动推导，通过 .intValue 转 Integer 类型
}
```

#### 2.2 ArrayHandler 单行对象数组
把结果集中的`第一行`数据转成对象数组。

```java
/**
 * 获取员工表中第10行员工信息
 * @return 对象数组
 */
public Object[] getRowData() throws SQLException {
    return queryRunner.query(
            "select * from t_employees where id=?",
            new ArrayHandler(),
            10
    );
}
```

#### 2.3 MapHandler 单行Map对象
将结果集中的`第一行`数据封装到一个Map里，key是列名，value就是对应的值。
```java
/**
 * 获取员工表中第10行员工信息
 * @return Map对象，String类型列名，Object类型值
 */
public Map<String, Object> getRowData() throws SQLException {
    return queryRunner.query(
            "select * from t_employees where id=?",
            new MapHandler(),
            10
    ); // map.get("列名") 获取列对应的值
}
```

#### 2.4 BeanHandler 单行Bean对象
将结果集中的`第一行`数据封装到一个对应的JavaBean实例中。
```java
/**
 * 获取员工表中第10行员工信息
 * @return Map对象，String类型列名，Object类型值
 */
public Employee getSimpleById() throws SQLException {
    return queryRunner.query(
            "select * from t_employees where id=?",
            new BeanHandler<>(Employee.class), /* 返回值由此处决定，自动推导 */
            10
    );
}
```

### 3. 多行数据
#### 3.1 ArrayListHandler 多行数组
把结果集中的`每一行`数据都转成一个对象数组，再存放到List中。
```java
/**
 * 获取员工表中所有的员工信息
 * @return List对象，元素类型为Object[]
 */
public List<Object[]> queryAll() throws SQLException {
    return queryRunner.query(
            "select * from t_employees",
            new ArrayListHandler()
    ); // list.forEach(objects -> System.out.println(Arrays.toString(objects)));
}
```
#### 3.2 MapListHandler 多行Map
将结果集中的`每一行`数据都封装到一个Map里，然后再存放到List。
```java
/**
 * 获取员工表中所有的员工信息
 * @return List对象，元素类型为Map<String, Object>
 */
public List<Map<String, Object>> queryAll() throws SQLException {
    return queryRunner.query(
            "select * from t_employees",
            new MapListHandler()
    ); // 遍历list过程中map获取key/value
}
```
#### 3.3 ColumnListHandler 单列list
将结果集中`某一列`的数据存放到List中，单列多行数据。
```java
/**
 * 获取员工表中指定列的数据
 * @return List对象，元素类型为String
 */
public List<String> queryColumnByName(String colName) throws SQLException {
    return queryRunner.query(
            "select " + colName + " from t_employees",
            new ColumnListHandler<>()
    ); // list.forEach(System.out::println);
}
```
#### 3.4 BeanListHandler 多行Bean对象
将结果集中的`每一行`数据都封装到一个对应的JavaBean实例中，存放到List里。
```java
/**
 * 指定分页查询
 * @param offset 数据偏移量（页长*(当前页数-1)）
 * @param limit 页长（页中数据数量）
 * @return List对象，元素类型为JavaBean
 */
public List<Employee> queryAllByLimit(int offset, int limit) throws SQLException {
    return queryRunner.query(
            "select * from t_employees limit " + offset + "," + limit,
            new BeanListHandler<>(Employee.class)
    );
}
```
#### 3.5 KeyedHandler 双层Map
将结果集中的`每一行`数据都封装到一个MapA(key是行号,value是行数据)里，再把这些MapA再存到一个MapB(key为指定的列,value是对应里的行值即单值)里
```java
/**
 * 获取所有员工信息
 * @return 双层Map对象，遍历第一层获取的entry为行数据Map，第二层通过列名获取行值
 */
public Map<String, Map<String, Object>> queryMMapByCol(String colName) throws SQLException {
    return queryRunner.query(
            "select * from t_employees",
            new KeyedHandler<>(colName) // String 对应 "列名"
    );
}
```

#### 3.6 BeanMapHandler
将结果集中的`每一行`数据都封装到一个JavaBean里，再把这些JavaBean再存到一个Map里，其key为指定的列。
```java
/**
 * 获取所有员工信息
 * @return 双层Map对象，key为指定的列名，value为JavaBean对象(即行数据)
 */
public Map<String, Employee> queryMapByCol(String colName) throws SQLException {
    return queryRunner.query(
            "select * from t_employees",
            new BeanMapHandler<>(Employee.class, colName) // String 对应 "列名"
    );
}
```

>KeyedHandler 返回的Map的Value是：`Map<String, Object>`
>BeanMapHandler 返回的Map的Value是：`JavaBean`