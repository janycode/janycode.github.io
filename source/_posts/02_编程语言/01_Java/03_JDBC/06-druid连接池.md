---
title: 06-druid连接池
date: 2016-4-28 22:13:57
tags:
- JDBC
- druid
categories: 
- 02_编程语言
- 01_Java
- 03_JDBC
---



### 1. 导入 jar 包

jar包下载地址：[https://mvnrepository.com/](https://mvnrepository.com/)

![image-20230316141008404](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316141009.png)
导入IDEA，位置：project\lib\
![image-20230316141016791](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316141039.png)

### 2. 配置文件
位置：project\src\database.properties
```shell
# MySQL 数据库配置
driver=com.mysql.jdbc.Driver
url=jdbc:mysql://localhost:3306/数据库名?useUnicode=true&characterEncoding=utf8
username=root
password=123456
# Druid 初始化连接数
initialSize=10
# Druid 最大连接数
maxActive=30
# Druid 最小空闲连接数
minIdle=5
# Druid 超时等待时间,单位：毫秒ms
maxWait=5000
```

### 3. 连接池工具类
DruidDbUtils.java
```java
public class DruidDbUtils {
    // 使用 Druid 线程池
    private static DruidDataSource druidDataSource = null;
    // 使用 ThreadLocal 绑定使用的 connection 对象
    private static final ThreadLocal<Connection> THREAD_LOCAL = new ThreadLocal<>();

    static {
        Properties properties = new Properties();
        InputStream is = DruidDbUtils.class.getResourceAsStream("/database.properties");
        try {
            properties.load(is);
            druidDataSource = (DruidDataSource) DruidDataSourceFactory.createDataSource(properties);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取数据源
     * @return 德鲁伊数据源对象
     */
    public static DataSource getDataSource() {
        return druidDataSource;
    }

    /**
     * 获取并设置绑定当前线程的连接对象
     * @return 线程池中当前连接对象
     */
    private static Connection getConnection() throws SQLException {
        Connection connection = THREAD_LOCAL.get();
        if (connection == null) {
            connection = druidDataSource.getConnection();
            THREAD_LOCAL.set(connection);
        }

        return connection;
    }

    /**
     * 开启事务：关闭自动提交
     */
    public static void begin() {
        try {
            getConnection().setAutoCommit(false);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * 提交事务
     */
    public static void commit() {
        try {
            getConnection().commit();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * 回滚事务
     */
    public static void rollback() {
        try {
            getConnection().rollback();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * 关闭连接对象，仅连接对象
     */
    public static void close() {
        try {
            Objects.requireNonNull(getConnection()).close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * 关闭连接相关资源
     * @param connection 连接对象
     * @param statement  声明对象
     * @param resultSet  结果集对象
     */
    public static void closeAll(Connection connection, Statement statement, ResultSet resultSet) {
        try {
            Objects.requireNonNull(connection).close();
            Objects.requireNonNull(statement).close();
            Objects.requireNonNull(resultSet).close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}

```

### 4. 执行SQL语句
```java
public class UserDaoImpl implements UserDao {
    private QueryRunner queryRunner = new QueryRunner(DruidDbUtils.getDataSource());

    /**
     * 增删改操作
     * @param action 字符串insert/delete/update
     * @param user 操作的用户
     * @return 影响结果行
     */
    @Override
    public int update(String action, User user) throws SQLException {
        if (null == action) {
            return -1;
        }

        String sql = null;
        Object[] args = null;
        if ("insert".equals(action)) {
            sql = "insert into userinfo(username, password) value(?,?)";
            args = new Object[]{user.getUsername(), user.getPassword()};
        } else if ("delete".equals(action)) {
            sql = "delete from userinfo where id=?";
            args = new Object[]{user.getId()};
        } else if ("update".equals(action)) {
            sql = "update userinfo set username=?,password=? where id=?";
            args = new Object[]{user.getUsername(), user.getPassword(), user.getId()};
        } else {
            return -1;
        }
        System.out.println("sql=" + sql);
        System.out.println("args=" + args);
        return queryRunner.update(Objects.requireNonNull(sql), args);
    }

    /**
     * 查单个
     * @param id 编号
     * @return 用户对象
     */
    @Override
    public User select(Integer id) throws SQLException {
        return queryRunner.query(
                "select * from userinfo where id=?",
                new BeanHandler<>(User.class),
                id
        );
    }

    /**
     * 查所有
     * @return 对象表
     */
    @Override
    public List<User> selectALL() throws SQLException {
        return queryRunner.query(
                "select * from userinfo",
                new BeanListHandler<>(User.class)
        );
    }
}
```