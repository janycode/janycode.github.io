---
title: 02-Spring 注解配置 Bean
date: 2018-5-31 17:20:30
tags:
- Spring
- Bean
categories: 
- 08_框架技术
- 02_Spring
- 02_IoC
---



![LOGO](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200617144911.png)



参考资料：https://lfvepclr.gitbooks.io/spring-framework-5-doc-cn/content/





### 1. 注解配置 Bean

写一个 SpringConfig.java 作为注解配置类，它的作用和 bean.xml 是一样的。以 jdbc 为例。

Spring中的新注解：

* @**Configuration**
    作用：指定当前类是一个配置类

    > 注意：当配置类作为 AnnotationConfigApplicationContext 对象创建的参数时，该注解可以不写。

* @**ComponentScan**("com.demo")
    作用：用于通过注解指定 spring 在创建容器时要扫描的包

    * value：它和 basePackages 的作用是一样的，都是用于指定创建容器时要扫描的包。
        使用此注解就等同于在 xml 中配置了:

    > \<context:component-scan base-package="com.demo">\</context:component-scan>

* @**PropertySource**("classpath:jdbc.properties")
    作用：用于指定 properties 文件的位置

    * value：指定文件的名称和路径。
    * classpath：表示类路径下
        使用此注解就等同于在xml中配置了:

    > \<!-- applicationContext.xml 中导入 properties 文件 -->
    >
    > \<context:property-placeholder location="classpath:jdbc.properties"/>



* 测试：

    在 resources 目录下创建 jdbc.properties

    ```properties
    jdbc.driverClassName=com.mysql.jdbc.Driver
    jdbc.url=jdbc:mysql://localhost:3306/数据库名?serverTimezone=Asia/Shanghai
    jdbc.username=root
    jdbc.password=root
    ```

    

> 注意：使用 ${properties文件中key的名称} 来获取对应的值。



* @**Bean**
    作用：用于把当前方法的返回值作为 bean 对象存入 spring 的 IoC 容器中
    * name : 用于指定 bean 的 id。`当不写时，默认值是当前方法的名称`
        细节：当使用注解配置方法时，如果方法有参数，在参数前加：@Qualifier("@Bean注解中name的值")，spring框架会去容器中查找有没有可用的 bean 对象，查找的方式和 @Autowired 注解的作用是一样的。

* 测试：

 	1. 数据库和数据库连接池等依赖导入

```xml
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
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.22</version>
</dependency>
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.13</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.20</version>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.12</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-test</artifactId>
    <version>5.2.7.RELEASE</version>
</dependency>
```

​    

2. 在 SpringConfig 类中添加方法

```java
@Configuration // 指定当前类是一个配置类
@ComponentScan("com.demo") // 指定 spring 在创建容器时要扫描的包
@PropertySource("classpath:jdbc.properties") // 指定 properties 文件位置
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
    @Bean // 把当前方法的返回值作为 bean 对象存入 Spring 的 IoC 容器中
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



3. dao 层

```java
@Repository
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



4. 编写测试类

```java
@RunWith(SpringJUnit4ClassRunner.class) // 替换 junit 的 @Test 注解底层 main 方法为 Spring 提供的
@ContextConfiguration(classes = SpringConfig.class) // 指定 Spring 容器的创建基于 注解
public class TestController {

    @Autowired // 自动按照类型注入
    private UserController userController;

    @Test
    public void testFindAll() {
        // 无需创建 ClassPathXmlApplicationContext 对象
        List<User> list = userController.findAll(); // 直接通过三层架构的 控制层 调用方法执行
        System.out.println(list);
    }
}
```





### 2. @Import 

* @**Import**
    作用：用于导入其他的配置类
    * value：用于指定其他配置类的字节码。
        当使用 Import 的注解之后，有 Import 注解的类就父配置类，而导入的都是子配置类

```java
@Configuration
public class ConfigA {
    @Bean
    public A a() {
    	return new A();
	}
} 

@Configuration
@Import(ConfigA.class) // 导入其他配置类 configA
public class ConfigB {
    @Bean
    public B b() {
    	return new B();
    }
}
```

```java
// 在实例化上下文时仅仅需要明确提供ConfigB
public static void main(String[] args) {
	ApplicationContext ctx = new AnnotationConfigApplicationContext(ConfigB.class);
    // now both beans A and B will be available...
    A a = ctx.getBean(A.class);
    B b = ctx.getBean(B.class);
}
```

