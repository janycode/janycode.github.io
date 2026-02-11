---
title: 02-ORM封装DAO思想
date: 2016-4-28 22:15:35
tags:
- JDBC
- ORM
categories: 
- 02_编程语言
- 01_Java
- 03_JDBC
---



### 1. JDBC 封装连接数据库工具类

![image-20230316140738757](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316140739.png)
#### 1.1 可重用方式
封装了获取连接、释放资源两个方法：
public static Connection `getConnection`( )
public static void `closeAll`(Connection c, Statement s, ResultSet r)

```java
/**
 * JDBC 可重用性方案
 */
public class DBUtils {

    // 类加载，加载驱动
    static {
        try {
            Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    /**
     * 重用方法，每次都是新的 Connection - 硬编码（写死）
     * @return 一个数据库连接对象
     */
    public Connection getConnection() {
        Connection connection = null;
        try {
            String url = "jdbc:mysql://localhost:3306/companydb?useUnicode=true&characterEncoding=utf8";
            connection = DriverManager.getConnection(url, "root", "admin123");
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return connection;
    }

    // 关闭资源
    public void closeAll(Connection c, Statement s, ResultSet r) {
        try {
            if (r != null) {
                r.close();
            }
            if (s != null) {
                s.close();
            }
            if (c != null) {
                c.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```



#### 1.2 跨平台方式



```java
// dbConfig.properties
driver=com.mysql.jdbc.Driver
url=jdbc:mysql://localhost:3306/companydb?useUnicode=true&characterEncoding=utf8
username=root
password=123456
```
```java
​```java
/**
 * JDBC 跨平台方案
 */
public class DBUtils {
    private static final Properties properties = new Properties();

    static {
        try {
            // 使用类自身自带的流(反射的应用)，目录：src，即项目根目录下
            InputStream is = DBUtils.class.getResourceAsStream("/db.properties");
            properties.load(is); // 通过类自身的流，将配置信息分割成键值对
            Class.forName(properties.getProperty("driver"));
        } catch (ClassNotFoundException | IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 重用方法，每次都是新的 Connection - 硬编码（写死）
     * @return 一个数据库连接对象
     */
    public static Connection getConnection() {
        Connection connection = null;
        try {
            connection = DriverManager.getConnection(properties.getProperty("url"), properties.getProperty("username"), properties.getProperty("password"));
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return connection;
    }

    // 关闭资源
    public static void closeAll(Connection c, Statement s, ResultSet r) {
        try {
            if (r != null) {
                r.close();
            }
            if (s != null) {
                s.close();
            }
            if (c != null) {
                c.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

}
```

### 2. JDBC 封装数据访问
#### 2.1 ORM 思想
概念：Object Relational Mapping，`对象关系映射`。
将数据库查询到的结果集遍历映射为对象集合。
ORM entity规则：`表名=类名`；`列名=属性名`；提供`各个属性的get/set方法`；提供`无参构造和[若需有参构造]`。

```java
/**
 * ORM：User 表
 */
class User {
    private int id;
    private String username;
    private String password;
    private String sex;
    private String email;
    private String address;

    // 无参构造
    // 有参构造
    // 所有属性的get、set方法
    // toString()
}

/**
 * JDBC ORM
 */
public class OrmSelect {
    public static void main(String[] args) throws SQLException {
        Connection connection = DBUtils.getConnection();
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;

        String sql = "select id, username, passwrod, sex, email, address from user";
        preparedStatement = connection.prepareStatement(sql);
        resultSet = preparedStatement.executeQuery();
        while (resultSet.next()) { // 每行数据
            // 每列数据
            int id = resultSet.getInt("id");
            String username = resultSet.getString("username");
            String password = resultSet.getString("passwrod");
            String sex = resultSet.getString("sex");
            String email = resultSet.getString("email");
            String address = resultSet.getString("address");

            // 输出
            User user = new User();
            user.setId(id);
            user.setUsername(username);
            user.setPassword(password);
            user.setSex(sex);
            user.setEmail(email);
            user.setAddress(address);
            System.out.println(user);
        }
    }
}
```



#### 2.2 DAO 层

概念：Data Access Object，`数据访问对象`。
1. 将所有对同一张表的操作(增删改查)都封装在一个 `XXXDaoImpl` 对象中；
2. 根据增删改查的不同功能，实现具体的方法(`insert, update, delete, select, selectAll`)；
经验：应将对于一张表的所有操作统一封装在一个数据访问对象中。——`重用`！



```java
/**
 * ORM: 映射Stu表的数据进行封装
 */
class Stu {
    private String student_id;
    private String student_name;
    private String sex;
    private Date birthday; // java.util.Date java应用层的日期
    private String phone;
    private int gradeId;
    // 无参
    // 有参
    // get、set
    // toString
}

/**
 * DAO层：对ORM封装的映射数据的 增、删、改、查 操作。
 */
public class StuDaoImpl {
    private Connection connection = null;
    private PreparedStatement preparedStatement = null;
    private ResultSet resultSet = null;

    public int insert(Stu stu) {
        connection = DBUtils.getConnection();
        String sql;

        sql = "insert into stu(student_id, student_name, sex, birthday, phone, gradeId) values(?,?,?,?,?,?)";
        try {
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, stu.getStudent_id());
            preparedStatement.setString(2, stu.getStudent_name());
            preparedStatement.setString(3, stu.getSex());
            // java应用层是：java.util.Date    Java数据库是：java.sql.Date
            // stu.getBirthday() -> UtilDate
            //preparedStatement.setDate(4, new java.sql.Date(stu.getBirthday().getTime()));
            preparedStatement.setDate(4, DateUtils.utilToSql(stu.getBirthday()));
            preparedStatement.setString(5, stu.getPhone());
            preparedStatement.setInt(6, stu.getGradeId());
            return preparedStatement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtils.closeAll(connection, preparedStatement, resultSet);
        }

        return 0;
    }

    public int delete(int id) {}
    public int update(Stu stu) {}
    public Stu select(int id) {}
    public void selectAll() {}
}
```



### 补充：String、java.util.Date、java.sql.Date 之间的转换



看我一张图，胜写10行码！
![image-20230316140806732](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316140807.png)