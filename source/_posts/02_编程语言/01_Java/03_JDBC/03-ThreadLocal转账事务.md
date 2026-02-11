---
title: 03-ThreadLocal转账事务
date: 2016-4-28 22:15:35
tags:
- JDBC
- 事务
categories: 
- 02_编程语言
- 01_Java
- 03_JDBC
---

>转账基本流程：fromAccount 转入 toAccount 账户中一定金额
>
>1. 验证 fromAccount 是否存在
>2. 验证 fromAccount 是否密码正确
>3. 验证当前账户余额是否充足
>4. 验证 toAccount 是否存在
>5. 减少 fromAccount 的余额
>6. 增加 toAccount 的余额

### 1. ThreadLocal 类的使用
ThreadLocal 可以创建一个绑定了`当前线程`与`1个泛型对象`的键值对的对象(该类使用map键值对方式实现)。

ThreadLocal 很多地方叫做线程本地变量，也有些地方叫做`线程本地存储`，ThreadLocal 的作用是提供线程内的局部变量，这种变量在线程的生命周期内起作用，减少同一个线程内多个函数或者组件之间一些公共变量的传递的复杂度。
ThreadLocalMap（ThreadLocal 类的一个静态内部类）：
1. 每个线程中都有一个自己的 ThreadLocalMap 类对象，可以将线程自己的对象保持到其中，各管各的，线程可以正确的访问到自己的对象。
2. 将一个`共用的 ThreadLocal 静态实例作为 key`，将`不同对象的引用保存到不同线程的
ThreadLocalMap 中`，然后在线程执行的各处通过这个静态 ThreadLocal 实例的 get()方法取
得自己线程保存的那个对象，避免了将这个对象作为参数传递的麻烦。
3. ThreadLocalMap 其实就是线程里面的一个属性，它在 Thread 类中定义
ThreadLocal.ThreadLocalMap threadLocals = null;

因此 ThreadLocal 对象在使用时`天生线程安全`。

> 常用方法：
> 1. public void `set`(T value); // 设置当前线程绑定的对象
> 2. public T `get`(); // 返回当前线程绑定的对象
> 3. public void `remove`(); // 移除当前线程的绑定对象

![image-20230316140834818](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316140835.png)
代码示例：

```java
/**
 * JDBC工具类：读取配置文件，连接数据库
 */
public class DBUtils {
    private static final Properties properties = new Properties();
    // 线程的局部：1个线程绑定1个connection
    private static final ThreadLocal<Connection> THREAD_LOCAL = new ThreadLocal<>();

    // 反射加载配置文件信息并加载 MySQL Driver
    static {
        try {
            InputStream is = DBUtils.class.getResourceAsStream("/db.properties");
            properties.load(is);
            Class.forName(properties.getProperty("driver"));
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    // 获取数据库连接对象
    public static Connection getConnection() {
        //Connection connection = null;
        // 当前线程从 ThreadLocal 里取
        Connection connection = THREAD_LOCAL.get(); // 默认 get 到的是 null
        try {
            if (connection == null) { // 如果为空
                connection = DriverManager.getConnection(properties.getProperty("url"), properties.getProperty("username"), properties.getProperty("password"));
                THREAD_LOCAL.set(connection);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return connection;
    }

    /**
     * 用于关闭所有非空的数据库连接资源
     * @param c 数据库连接对象
     * @param s 数据库sql语句执行对象
     * @param r 数据库sql语句返回的集合对象
     */
    public static void closeAll(Connection connection, Statement s, ResultSet r) {
        try {
            if (r != null) {
                r.close();
            }
            if (s != null) {
                s.close();
            }
            if (connection != null) {
                connection.close();
                THREAD_LOCAL.remove(); // 最后关闭 connection 的时候移除线程对象
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```
### 2. 转账中的事务流程体现
![image-20230316140850726](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316140851.png)
代码示例：
```java
public class T_AccountServiceImpl {
    /**
     * 转账业务
     * @param fromNo 转账卡号
     * @param pwd 转账卡号的密码
     * @param toNo 收钱卡号
     * @param money 转账金额
     */
    public String transfer(String fromNo, String pwd, String toNo, double money) { 
        // 1.形参接收参数
        String result = "转账失败";
        // 2.组织业务功能
        T_AccountDaoImpl t_accountDao = new T_AccountDaoImpl();

        // 接收一个 MySQL客户端连接
        Connection connection = null;

        try {
            // ① 建立了一个数据库连接
            connection = DBUtils.getConnection();
            // ② 开启事务：关闭自动提交
            connection.setAutoCommit(false);

            // 2.1验证 fromNo 是否存在
            T_Account fromAcc = t_accountDao.select(fromNo);
            if(fromAcc == null) {
                throw new RuntimeException("::卡号不存在::");
            }
            // 2.2验证 fromNo 的密码是否正确
            if (!fromAcc.getPassword().equals(pwd)) {
                throw new RuntimeException("::密码错误::");
            }
            // 2.3验证余额是否充足
            if (fromAcc.getBalance() < money) {
                throw new RuntimeException("::余额不足::");
            }
            // 2.4验证 toNo 是否存在
            T_Account toAcc = t_accountDao.select(toNo);
            if (toAcc == null) {
                throw new RuntimeException("::对方卡号不存在::");
            }
            // 2.5减少 fromNo 的余额
            fromAcc.setBalance(fromAcc.getBalance() - money);
            t_accountDao.update(fromAcc);

            int i = 10/0; // 生成1个异常

            // 2.6增加 toNo 的余额
            toAcc.setBalance(toAcc.getBalance() + money);
            t_accountDao.update(toAcc);

            result = "转账成功";

            // ③ 提交事务：执行到这里无异常
            connection.commit();
        } catch (RuntimeException | SQLException e) {
            try {
                // ④ 回滚事务：因为出现了异常
                if (connection != null) {
                    System.out.println("出现了异常，回滚整个事务！");
                    connection.rollback();
                }
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            e.printStackTrace();
        } finally {
            DBUtils.closeAll(connection, null, null);
        }
        return result;
    }
}
```