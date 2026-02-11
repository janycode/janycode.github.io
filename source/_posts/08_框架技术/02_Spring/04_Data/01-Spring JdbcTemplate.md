---
title: 01-Spring JdbcTemplate
date: 2018-5-31 17:20:30
tags:
- Spring
- JDBC
categories: 
- 08_框架技术
- 02_Spring
- 04_Data
---



![LOGO](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200617144911.png)



参考资料：https://lfvepclr.gitbooks.io/spring-framework-5-doc-cn/content/



在 Spring 中提供了一个可以操作数据库的对象 **org.springframework.jdbc.core.JdbcTemplate**，对象封装了 jdbc 技术，JDBC 的模板对象与 DBUtils 中的 QueryRunner 非常相似。

### 1. JdbcTemplate 依赖

在 pom.xml 中导入核心依赖 `spring-jdbc`

```xml
<dependency>
	<groupId>org.springframework</groupId>
	<artifactId>spring-jdbc</artifactId>
	<version>5.0.2.RELEASE</version>
</dependency>
```

* 简单测试：

```java
JdbcTemplate jt = new JdbcTemplate();
jt.setDataSource(dataSource);
List<User> list = jt.query("select * from user where id =?", new BeanPropertyRowMapper<User>(User.class), 1);
System.out.println(list.get(0));
//jt.update("delete from  user where id =?",4);
```



### 2. JdbcTemplate XML 配置

pom.xml

```xml
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.12</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.2.7.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>5.2.7.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.20</version>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>1.1.22</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
        <!-- spring-test -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-test</artifactId>
            <version>5.2.7.RELEASE</version>
        </dependency>
```

jdbc.properties

```properties
jdbc.driver=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/数据库名?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf8
jdbc.username=root
jdbc.password=123456
```

applicationContext.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">

    <!-- 配置读取数据库配置、创建数据库连接池 dataSource 注入 -->
    <context:property-placeholder location="classpath:jdbc.properties"/>
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="username" value="${jdbc.username}"/>
        <property name="password" value="${jdbc.password}"/>
        <property name="url" value="${jdbc.url}"/>
        <property name="driverClassName" value="${jdbc.driver}"/>
    </bean>

    <!-- 注入 jdbcTemplate -->
    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
        <property name="dataSource" ref="dataSource"/>
    </bean>
    <!-- 注入 userDao -->
    <bean id="userDao" class="com.demo.dao.impl.UserDaoImpl">
        <property name="jdbcTemplate" ref="jdbcTemplate"/>
    </bean>
    <!-- 注入 userService -->
    <bean id="userService" class="com.demo.service.impl.UserServiceImpl">
        <property name="userDao" ref="userDao"/>
    </bean>
    <!-- 注入 userController -->
    <bean id="userController" class="com.demo.controller.UserController">
        <property name="userService" ref="userService"/>
    </bean>
</beans>
```

实体类

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Integer id;
    private String username;
    private String password;
    private String phone;
    private String mail;
}
```

Dao 层

```java
public interface UserDao {
    List<User> findAll();
}

@Setter // 提供 set 方法，用于注入 IoC 容器
public class UserDaoImpl implements UserDao {

    private JdbcTemplate jdbcTemplate;

    @Override
    public List<User> findAll() {
        List<User> users = jdbcTemplate.query("select * from t_user", new BeanPropertyRowMapper<>(User.class));
        return users;
    }
}
```

Service 层

```java
public interface UserService {
    List<User> findAll();
}

@Setter // 提供 set 方法，用于注入 IoC 容器
public class UserServiceImpl implements UserService {

    private UserDao userDao;

    @Override
    public List<User> findAll() {
        return userDao.findAll();
    }
}
```

Controller 层

```java
@Setter // 提供 set 方法，用于注入 IoC 容器
public class UserController {

    private UserService userService;

    public List<User> findAll() {
        return userService.findAll();
    }
}
```

测试类：

```java
@RunWith(SpringJUnit4ClassRunner.class) // 替换 Spring 的测试 main 方法
@ContextConfiguration(locations = "classpath:applicationContext.xml") // 指定 xml 配置文件
public class TestController {
    @Test
    public void testFindAll() {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        UserController userController = (UserController) context.getBean("userController");

        List<User> list = userController.findAll();
        System.out.println(list);
    }
}
```



### 3. JdbcTemplate 注解 配置

注解类 SpringConfig.java 代替 applicationContext.xml 配置文件。

pom.xml 同上 + jdbc.properties 同上。

实体类

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Integer id;
    private String username;
    private String password;
    private String phone;
    private String mail;
}
```

Dao 层

```java
public interface UserDao {
    List<User> findAll();
}

@Repository // 配置 dao 持久层注解
public class UserDaoImpl implements UserDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<User> findAll() {
        List<User> users = jdbcTemplate.query("select * from t_user", new BeanPropertyRowMapper<>(User.class));
        return users;
    }
}
```

Service 层

```java
public interface UserService {
    List<User> findAll();
}

@Service // 配置 service 服务层注解
public class UserServiceImpl implements UserService {

    @Autowired // 自动类型注入
    private UserDao userDao;

    @Override
    public List<User> findAll() {
        return userDao.findAll();
    }
}
```

Controller 层

```java
@Controller // 配置 controller 控制层注解
public class UserController {

    @Autowired // 自动类型注入
    private UserService userService;

    public List<User> findAll() {
        return userService.findAll();
    }
}
```

SpringConfig 配置类（代替 applicationContext.xml）

```java
@Configuration // 指定当前是一个配置类
@ComponentScan("com.demo") // 指定 Spring 在创建容器时扫描的包的目录
@PropertySource("classpath:jdbc.properties") // 指定 properties 配置文件位置
public class SpringConfig {

    @Value("${jdbc.username}") // 注入基本类型/String类型数据
    private String username;
    
    @Value("${jdbc.password}")
    private String password;
    
    @Value("${jdbc.url}")
    private String url;
    
    @Value("${jdbc.driverClassName}")
    private String driverClassName;

    /**
     * 使用注解代替 applicationContext.xml 配置
     * @return JdbcTemplate类的实例
     */
    @Bean // 指定当前方法的返回值注入到 Spring 容器中 （同 xml 的 <bean> 标签）
    public JdbcTemplate getJdbcTemplate() throws Exception {
        Properties properties = new Properties();
        properties.setProperty("username", username);
        properties.setProperty("password", password);
        properties.setProperty("url", url);
        properties.setProperty("driverClassName", driverClassName);

        DataSource dataSource = DruidDataSourceFactory.createDataSource(properties);
        return new JdbcTemplate(dataSource);
    }
}
```

测试类：

```java
@RunWith(SpringJUnit4ClassRunner.class) // 替换 Spring 的测试 main 方法
@ContextConfiguration(classes = SpringConfig.class) // 指定 注解 配置类对象
public class TestController {

    @Autowired
    private UserController userController;

    @Test
    public void testFindAll() {
        List<User> list = userController.findAll();
        System.out.println(list);
    }
}
```

