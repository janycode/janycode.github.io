---
title: 02-MyBatis CRUD和工具类
date: 2017-6-18 23:04:05
tags:
- MyBatis
categories: 
- 05_数据库
- 02_MyBatis
---

![001](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/001.png)



### 1. MyBatis的CRUD操作【★】

Mapper接口的动态代理实现，需要遵循 4 大原则：

- 映射文件中的 namespace 命名空间（名称空间）与 Mapper 接口的`全路径限定名`一致

    ```xml
    <!-- 对应全限定包名 com.demo.dao.AdminMapper -->
    <mapper namespace="com.demo.dao.AdminMapper" >...</mapper>
    ```

- 映射文件中的 CRUD 标签的 id 与 Mapper 接口的`方法名`保持一致

    ```xml
    <!-- 对应接口中的 findAll() 方法 -->
    <select id="findAll" resultMap="BaseResultMap">...</select>
    ```

- 映射文件中的 CRUD 标签的 resultType 必须和 Mapper 接口方法的`返回类型`一致（即使不采用动态代理，也要一致）

    ```xml
    <!-- 返回值类型 Integer：public Integer countByExample() {...} -->
    <select id="countByExample" resultType="java.lang.Integer" >...</select>
    ```

    

- 映射文件中的 CRUD 标签的 parameterType 必须和 Mapper 接口方法的`参数类型`一致（不一定，该参数可省略）

    ```xml
    <!-- 参数类型 UserExample：public Integer countByExample(UserExample userExample) {...} -->
    <select id="countByExample" parameterType="com.demo.pojo.UserExample">...</select>
    ```

    

#### 1.1 查询

标签：`<select id="" resultType="">`

##### 1.1.1 序号参数绑定

```java
public interface UserDao {
	//使用原生参数绑定
    public User selectUserByIdAndPwd(Integer id , String pwd);
}
```

```xml
<select id="selectUserByIdAndPwd" resultType="user">
    SELECT * FROM t_users
    WHERE id = #{arg0} AND password = #{arg1} <!--arg0 arg1 arg2 ...-->
</select>

<select id="selectUserByIdAndPwd" resultType="user">
	SELECT * FROM t_users
    WHERE id = #{param1} AND password = #{param2} <!--param1 param2 param3 ...-->
</select>
```



##### 1.1.2 注解参数绑定【推荐】

```java
import org.apache.ibatis.annotations.Param; //引入注解

public interface UserDao {
    //使用 MyBatis 提供的 @Param 进行参数绑定
    public User selectUserByIdAndPwd(@Param("id") Integer id , @Param("pwd") String pwd);
}
```

```xml
<select id="selectUserByIdAndPwd" resultType="user">
    SELECT * FROM t_users
    WHERE id = #{id} AND password = #{pwd} <!-- 使用注解值 @Param("xxx") 中的 id或pwd -->
</select>
```



##### 1.1.3 Map参数绑定

```java
public interface UserDao {
    //添加Map进行参数绑定
	public User selectUserByIdAndPwd_map(Map values);
}
```

```java
Map values = new HashMap(); //测试类创建Map
values.put("myId",1); //自定义key，绑定参数
values.put("myPwd","123456");
User user = userDao.selectUserByIdAndPwd_map(values);
```

```xml
<select id="selectUserByIdAndPwd_map" resultType="user">
    SELECT * FROM t_users 
  	WHERE id = #{myId} AND password = #{myPwd} <!-- 通过key获得value -->
</select>
```



##### 1.1.4 对象参数绑定

```java
public interface UserDao {
    //使用对象属性进行参数绑定
    public User selectUserByUserInfo(User user);
}
```

```xml
<select id="selectUserByUserInfo" resultType="user">
    SELECT * FROM t_users
    WHERE id = #{id} AND password = #{password} <!-- #{id}取User对象的id属性值、#{password}同理 -->
</select>
```



##### 1.1.5 模糊查询

```java
public interface UserDao {
    public List<User> selectUsersByKeyword(@Param("keyword") String keyword);
}
```

```xml
<mapper namespace="com.mybatis.part1.different.UserDao">
    <select id="selectUsersByKeyword" resultType="user">
        SELECT * FROM t_users 
  		WHERE name LIKE concat('%',#{keyword},'%') <!-- 拼接'%' -->
    </select>
</mapper>
```



#### 1.2 删除

标签：`<delete id="" parameterType="">`

```xml
 <delete id="deleteUser" parameterType="int">
    DELETE FROM t_users
    WHERE id = #{id} <!--只有一个参数时，#{任意书写}-->
</delete>
```



#### 1.3 修改

标签：`<update id="" parameterType="">`

```xml
<update id="updateUser" parameterType="user">
    UPDATE t_users SET name=#{name}, password=#{password}, sex=#{sex}, birthday=#{birthday}
    WHERE id = #{id} <!--方法参数为对象时，可直接使用#{属性名}进行获取-->
</update>
```



#### 1.4 添加

标签：`<insert id="" parameterType="">`

```xml
<!--手动主键-->
<insert id="insertUser" parameterType="user">
    INSERT INTO t_users VALUES(#{id},#{name},#{password},#{sex},#{birthday},NULL);
</insert>

<!--自动主键-->
<insert id="insertUser" parameterType="user">
	<!-- 自动增长主键，以下两种方案均可 -->
    INSERT INTO t_users VALUES(#{id}, #{name}, #{password}, #{sex}, #{birthday}, NULL);
	INSERT INTO t_users VALUES(NULL, #{name}, #{password}, #{sex}, #{birthday}, NULL);
</insert>
```



#### 1.5 主键回填

标签：

* `<selectKey id="" parameterType="" order="BEFORE">` sql语句执行之前填入，如 uuid
* `<selectKey id="" parameterType="" order="AFTER">` sql语句执行之后封装，如 自增 id



##### 1.5.1 last_insert_id()

在 sql 语句执行之后（AFTER）通过 `SELECT last_insert_id()` 查询主键，传入 sql 语句，即可在 java 代码中获取到自增的实际 id 值，`适用于整数类型自增主键`。

```sql
create table t_product(
  id int primary key auto_increment,
  name varchar(50)
)default charset = utf8;
```

```java
class Product{
    private Integer id;
    private String name;
    //set+get ...
}
```

```xml
<mapper namespace="com.mybatis.part1.basic.ProductDao">
    <insert id="insertProduct" parameterType="product">
        <selectKey keyProperty="id" resultType="int" order="AFTER"> <!-- 插入之后 -->
            SELECT LAST_INSERT_ID() <!-- 适用于整数类型自增主键 -->
        </selectKey>
        INSERT INTO t_product(id,name) VALUES(#{id},#{name})
    </insert>
</mapper>
```



##### 1.5.2 uuid()

在 sql 语句执行之前（BEFORE）通过 `SELECT REPLACE(UUID(),'-','')` 查询主键，传入 sql 语句，即可配置唯一字符串类型的主键，`适用于字符串型主键`。

```sql
create table t_order(
  id varchar(32) primary key, # 字符型主键
  name varchar(50)
)default charset = utf8;
```

```java
class Order{
    private Integer id;
    private String name;
    //set+get ...
}
```

```xml
<mapper namespace="com.mybatis.part1.basic.OrderDao">
    <insert id="insertOrder" parameterType="order">
        <selectKey keyProperty="id" resultType="String" order="BEFORE"><!-- 插入之前 -->
            SELECT REPLACE(UUID(),'-','') <!-- 适用于字符类型主键 -->
        </selectKey>
        INSERT INTO t_order(id,name) VALUES(#{id},#{name})
    </insert>
</mapper>
```



### 2. MyBatis工具类【★】

#### 2.1 封装工具类

* `Resource`：用于获得读取配置文件的IO对象，耗费资源，建议通过IO一次性读取所有所需要的数据。

* `SqlSessionFactory`：SqlSession工厂类，内存占用多，耗费资源，建议每个应用只创建一个对象。

* `SqlSession`：相当于Connection，可控制事务，应为线程私有，不被多线程共享。

* 封装 获取连接、关闭连接、提交事务、回滚事务、获得接口实现类等方法。

```java
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;

public class MyBatisUtils {

    //获得SqlSession工厂
    private static SqlSessionFactory sqlSessionFactory;
    //创建ThreadLocal绑定当前线程中的SqlSession对象
    private static final ThreadLocal<SqlSession> SQL_SESSION_THREAD_LOCAL = new ThreadLocal<>();

    static {
        try {
            InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(is);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取 SqlSession 连接对象（线程唯一）
     * @return SqlSession
     */
    public static SqlSession getSqlSession() {
        SqlSession sqlSession = SQL_SESSION_THREAD_LOCAL.get();
        if (null == sqlSession) {
            sqlSession = sqlSessionFactory.openSession();
            SQL_SESSION_THREAD_LOCAL.set(sqlSession);
        }
        return sqlSession;
    }

    /**
     * 释放 SqlSession 对象，移除线程绑定
     */
    public static void close() {
        getSqlSession().close();
        SQL_SESSION_THREAD_LOCAL.remove();
    }

    /**
     * 事务处理：提交
     */
    public static void commit() {
        getSqlSession().commit();
        close();
    }

    /**
     * 事务处理：回滚
     */
    public static void rollback() {
        getSqlSession().rollback();
        close();
    }

    /**
     * 获得接口实现类对象
     * @param t 接口类对象
     * @param <T> 接口类泛型
     * @return 返回 t 的实现类实例
     */
    public static <T> T getMapper(Class<T> t) {
        return getSqlSession().getMapper(t);
    }
}
```



#### 2.2 测试工具类

调用 MyBatisUtils 中的封装方法。

```java
@Test
public void testUtils() {
    try {
        UserDao userDao = MyBatisUtils.getMapper(UserDao.class);
        userDao.deleteUser(15);
        MyBatisUtils.commit();
    } catch (Exception e) {
        MyBatisUtils.rollback();
        e.printStackTrace();
    }
}
```

