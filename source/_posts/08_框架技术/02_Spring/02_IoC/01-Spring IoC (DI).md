---
title: 01-Spring IoC (DI)
date: 2018-5-30 17:20:30
tags:
- Spring
- IoC
categories: 
- 08_框架技术
- 02_Spring
- 02_IoC
---



![LOGO](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200617144911.png)



参考资料：https://lfvepclr.gitbooks.io/spring-framework-5-doc-cn/content/



### 1. 引言

#### 1.1 原生web开发的弊端

- 传统Web开发存在硬编码所造成的过度程序耦合（例如：Service中作为属性Dao对象）。

- 部分Java EE API较为复杂，使用效率低（例如：JDBC开发步骤）。

- 侵入性强，移植性差（例如：DAO实现的更换，从Connection到SqlSession）。



### 2. Spring 框架

#### 2.1 概念

* 什么是Spring
Spring是分层的 JavaSE/EE full-stack(一站式) 轻量级开源框架，以 IoC（Inverse of Control 控制反转）和 AOP（Aspect Oriented Programming面向切面编程) 为内核。



* 分层:
    JavaEE 的三层结构 : `web层、业务层、数据访问层`（持久层，集成层）
    ​Struts2 是 web 层基于 MVC 设计模式框架。
    ​Mybatis、Hibernate 是持久的一个 ORM 的框架。
    ​	
    一站式:
    ​    Spring框架有对三层的每层解决方案:
    ​    web层: `Spring MVC`
    ​    持久层: `JDBC Template` 
    ​    业务层: `Spring的Bean管理`



* Spring的好处：
    ​    **方便解耦，简化开发**
    ​    Spring就是一个大工厂，可以将所有对象创建和依赖关系维护，交给Spring管理
    ​    **AOP编程的支持**
    ​    Spring提供面向切面编程，可以方便的实现对程序进行权限拦截、运行监控等功能
    ​    **声明式事务的支持**
    ​    只需要通过配置就可以完成对事务的管理，而无需手动编程
    ​    **方便程序的测试**
    ​    Spring对 Junit4 支持，可以通过注解方便的测试 Spring 程序
    ​    **方便集成各种优秀框架**
    ​    Spring 不排斥各种优秀的开源框架，其内部提供了对各种优秀框架（如：Struts、Hibernate、MyBatis、Quartz等）的直接支持
    ​    Spring 对 JavaEE 开发中非常难用的一些API（JDBC、JavaMail、远程调用等），都提供了封装，降低JavaEE API的使用难度



* +
    测试工具：[junit](https://junit.org)、[postman](https://www.postman.com/)、[postwoman](https://postwoman.io/)、[swagger](https://swagger.io)
    安全框架：shiro 和 spring security
    容器引擎：docker 和 k8s
    Spring初版：[interface21](https://www.interface21.io)



#### 2.2 访问与下载

官方网站：<https://spring.io/>

下载地址：<http://repo.spring.io/release/org/springframework/spring/>



### 3. Spring 架构组成

Spring架构由诸多模块组成，可分类为

- **核心技术**：`依赖注入`，事件，资源，i18n(国际化)，验证，数据绑定，类型转换，SpEL，`AOP`。

- **测试**：模拟对象，TestContext框架，Spring MVC测试，WebTestClient。

- **数据访问**：`事务`，DAO支持，JDBC，ORM，封送XML。

- Spring MVC 和 Spring WebFlux Web框架。

- **集成**：远程处理，JMS，JCA，JMX，电子邮件，任务，调度，缓存。

- **语言**：Kotlin，Groovy，动态语言。

|                        Spring架构组成                        |
| :----------------------------------------------------------: |
| ![001](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200617144906.png) |

**Spring 依赖**：

| **GroupId**         | **ArtifactId**             | **说明**                                           |
| :-------------------: | :--------------------------: | -------------------------------------------------- |
| org.springframework | **`spring-beans`**       | `Beans 支持，包含 Groovy`                        |
| org.springframework | **`spring-aop`**         | `基于代理的AOP支持`                              |
| org.springframework | **`spring-aspects`**     | `基于AspectJ 的切面`                             |
| org.springframework | **`spring-context`**     | `应用上下文运行时，包括调度和远程抽象`           |
| org.springframework | **`spring-context-support`** | `支持将常见的第三方类库集成到 Spring 应用上下文` |
| org.springframework | **`spring-core`**        | `其他模块所依赖的核心模块`                       |
| org.springframework | **`spring-expression`**  | `Spring 表达式语言，SpEL`                        |
| org.springframework | spring-instrument          | JVM 引导的仪表（监测器）代理                       |
| org.springframework | spring-instrument-tomcat   | Tomcat 的仪表（监测器）代理                        |
| org.springframework | **`spring-jdbc`**        | `支持包括数据源设置和 JDBC 访问支持`             |
| org.springframework | spring-jms                 | 支持包括发送/接收JMS消息的助手类                   |
| org.springframework | spring-messaging           | 对消息架构和协议的支持                             |
| org.springframework | spring-orm                 | 对象/关系映射，包括对 JPA 和 Hibernate 的支持      |
| org.springframework | spring-oxm                 | 对象/XML 映射（Object/XML Mapping，OXM）           |
| org.springframework | **`spring-test`**        | `单元测试和集成测试支持组件`                     |
| org.springframework | **`spring-tx`**          | `事务基础组件，包括对 DAO 的支持及 JCA 的集成`   |
| org.springframework | **`spring-web`**         | `web支持包，包括客户端及web远程调用`             |
| org.springframework | **`spring-webmvc`**      | `REST web 服务及 web 应用的 MVC 实现`            |
| org.springframework | spring-webmvc-portlet      | 用于 Portlet 环境的MVC实现                         |
| org.springframework | spring-websocket           | WebSocket 和 SockJS 实现，包括对 STOMP 的支持      |
| org.springframework | **`spring-jcl`**         | `Jakarta Commons Logging 日志系统`               |



### 4. Spring 入门

#### 4.1 导入依赖

```xml
<dependency>
     <groupId>org.springframework</groupId>
     <artifactId>spring-context</artifactId>
     <version>5.0.2.RELEASE</version>
</dependency>
```

#### 4.2 创建applicationContext.xml

在 \src\main\resources 目录下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="
            http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

        <bean id="userDao" class="dao.UserDaoImpl"></bean>
            
    </beans>
```

#### 4.3 测试

使用 `ClassPathXmlApplicationContext(String filename)` 来获取 context 对象，进而获取 Bean 对象的实例（本质是反射原理）。

```java
	@Test
    public void test(){
    	ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
    	UserDao userDao = context.getBean(UserDao.class);
    	userDao.xxx(); // 调用方法
    }
```

#### 4.4 ApplicationContext与BeanFactory

**ApplicationContext**: 它在构建核心容器时，创建对象采取的策略是采用`立即加载`的方式。
**BeanFactory**: 它在构建核心容器时，创建对象采取的策略是采用`延迟加载`的方式。

ApplicationContext 对 BeanFactory 提供了扩展 :

- 国际化处理
- 事件传递
- Bean 自动装配
- 各种不同应用层的 Context 实现
- 早期开发使用 BeanFactory



### 5. Spring bean 管理

#### 5.1 创建bean×3

**`<bean>`** 元素: 使用该元素描述需要 spring 容器管理的对象

* **class** 属性: 被管理对象的完整类名

* **name** 属性: 给被管理的对象起个名字，获得对象时根据该名称获得对象

* **id** 属性: 与 name 属性作用相同 



**创建方式**：

* **第一种方式**：使用`默认构造函数`创建。

    在spring的配置文件中使用bean标签，配以id和class属性之后，且没有其他属性和标签时。采用的就是默认构造函数创建bean对象，此时如果类中没有默认构造函数，则对象无法创建。

```java
public interface UserDao {
    int deleteUser(Integer id);
}

public class UserDaoImpl implements UserDao {
    @Override
    public int deleteUser(Integer id) {
        System.out.println("删除了1个用户");
        return 1;
    }
}

applicationContext.xml
<bean id="userDao" class="com.demo.dao.UserDaoImpl"></bean>
```

* **第二种方式**： 使用普通工厂中的`方法`创建对象
  
    使用某个类中的方法创建对象，并存入spring容器

```java
public class UserFactory {
    public UserDao getUserDao() {
        return new UserDaoImpl();
    }
}

applicationContext.xml
<bean id="userFactory" class="com.demo.factory.UserFactory"></bean>
<bean id="userDao" factory-bean="userFactory" factory-method="getUserDao"></bean>
```

* **第三种方式**：使用工厂中的`静态方法`创建对象
  
    使用某个类中的静态方法创建对象，并存入spring容器

```java
public class UserStaticFactory {
    public static UserDao getUserDao() {
        return new UserDaoImpl();
    }
}

applicationContext.xml
<bean id="userDao" class="com.demo.factory.UserStaticFactory" factory-method="getUserDao"></bean>
```



#### 5.2 bean 作用范围

* **scope** 属性：用于指定bean的作用范围。取值： 常用的就是单例的和多例的
    * singleton：每个 Spring IoC 容器仅有一个单实例。 `单例的（默认值）`
    * prototype：每次请求都会产生一个新的实例。 多例的（`Struts2中 action 默认是多例的`）
    * request：每一次 HTTP 请求都会产生一个新的实例，并且该 bean 仅在当前 HTTP 请求内有效。作用于web应用的请求范围
    * session：每一次 HTTP 请求都会产生一个新的 bean，同时该 bean 仅在当前 HTTP session 内有效。作用于web应用的会话范围
    * global-session：作用于集群环境的会话范围（全局会话范围），当不是集群环境时，它就是 session。

```xml
<bean id="userDao" class="com.demo.dao.impl.UserDaoImpl" scope="prototype"></bean>
```



#### 5.3 bean 生命周期

生命周期属性：

* **init-method** 属性：配置一个方法作为生命周期初始化方法，Spring会在对象创建之后立即调用，
* **destory-method** 属性：配置一个方法作为生命周期的销毁方法，Spring容器在关闭并销毁所有容器中的对象之前调用
* **lazy-init** 属性：配置当前使用的 applicationContext 对象为`懒汉式单例`（使用单例时可配置）

> 注意：
>
> 1. close() 方法为`子类独有`，父类无法直接调用；
> 2. close 释放资源时，destory-method 对应的方法只在 `单例` 中有效。

```java
public class UserDaoImpl implements UserDao {
    public void init() {
        System.out.println("初始化方法：init");
    }
    @Override
    public int deleteUser(Integer id) {
        System.out.println("删除了1个用户");
        return 1;
    }
    public void destroy() {
        System.out.println("销毁方法：destroy");
    }
}

applicationContext.xml
<bean id="userDao1" class="com.demo.dao.impl.UserDaoImpl" scope="singleton" init-method="init"
    destroy-method="destroy"/>

<bean id="userDao2" class="com.demo.dao.impl.UserDaoImpl" scope="prototype" init-method="init"
        destroy-method="destroy"/>
```

![image-20200617151447537](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200617151448.png)



### 6. Spring 依赖注入

Dependency Injection(**`DI`**)，依赖注入：

* **IoC 的作用**：降低程序间的耦合（依赖关系）

* **依赖关系管理**：以后都交给spring来维护，在当前类需要用到其他类的对象，由spring为提供，只需要在配置文件中说明
* **依赖关系维护**：就叫做依赖注入。

能注入的数据：

* 基本类型(包装类型)和String
* 其他bean类型（在配置文件中或者注解配置过的bean）
* 复杂类型/集合类型

![Spring底层的IOC原理实现](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200619165717.bmp)

注入方式：

第一种：使用`构造函数`提供注入

第二种：使用`set方法` 提供注入

第三种：使用`注解`提供注入



#### 6.1 构造函数注入

bean标签的内部，使用子标签：`<constructor-arg>`

标签中的属性：
* **name**：用于指定给构造函数中指定名称的参数赋值

* **index**：用于指定要注入的数据给构造函数中指定索引位置的参数赋值。索引的位置是从 0 开始
* **`value`**：用于提供基本类型和 String 类型的数据
* **`ref`**：用于指定其他的 bean 类型数据。它指的就是在 Spring 的 Ioc 核心容器中出现过的 bean 对象
* **type**：用于指定要注入的数据的数据类型，该数据类型也是构造函数中某个或某些参数的类型(可省略)

> 注意：可只提供 name 和 value/ref 属性，type、index 可自动推断

优势：在获取 bean 对象时，注入数据是必须的操作，否则对象无法创建成功。
弊端：改变了 bean 对象的实例化方式，使在创建对象时，如果用不到这些数据，也必须提供。

```java
// demo：使用 构造函数 提供注入
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private Integer id;
    private String name;
    private Car car;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Car {
    private String cname;
}

applicationContext.xml
    <bean id="car" class="com.demo.pojo.Car">
        <constructor-arg name="cname" value="奥迪"/>
    </bean>

    <bean id="user" class="com.demo.pojo.User">
        <constructor-arg name="id" value="2001" index="0" />
        <constructor-arg name="name" value="张三" index="1" />
        <constructor-arg name="car" ref="car" index="2" />
    </bean>

TestPojo.java
    @Test
    public void test() {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        User user = (User) context.getBean("user");

        System.out.println(user); // User(id=111, name=张三, car=Car(cname=奥迪))
    }
```



#### 6.2 set 方法注入

bean标签的内部，使用子标签：`<property>`

标签中的属性：

* **name**：用于指定注入时所调用的 set 方法名称
* **value**：用于提供基本类型和 String 类型的数据
* **ref**：用于指定其他的 bean 类型数据。它指的就是在 Spring 的 Ioc 核心容器中出现过的 bean 对象

优势：创建对象时没有明确的限制，可以直接使用默认构造函数
弊端：如果有某个成员必须有值，则获取对象是有可能 set 方法没有执行。

```java
// demo：使用 set方法 提供注入
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private Integer id;
    private String name;
    private Car car;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Car {
    private String cname;
}

applicationContext.xml
    <bean id="car1" class="com.demo.pojo.Car">
        <property name="cname" value="蔚来"/>
    </bean>

    <bean id="user1" class="com.demo.pojo.User">
        <property name="id" value="2333"/>
        <property name="name" value="李四"/>
        <property name="car" ref="car1"/>
    </bean>
        
TestPojo.java
    @Test
    public void test() {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        User user = (User) context.getBean("user1");

        System.out.println(user);
    }
```



#### 6.3 注解方式注入(★)

* **用于创建对象的注解**
    他们的作用就和在XML配置文件中编写一个\<bean>标签实现的功能是一样的
    * **@Component** : 用于把当前类对象存入 spring 容器中，pojo/entiry/bean
        * value 属性：用于指定 bean 的 id 。`当不写时，它的默认值是当前类名的首字母小写形式`。
    * **@Controller** ：一般用在表现层，controller
    * **@Service** ：一般用在业务层，service
    * **@Repository** ：一般用在持久层，dao

以上三个注解的作用和属性与 Component 相同，是 Spring 框架为提供明确的三层使用的注解。



扫描注解：`即在 applicationContext.xml 中的添加 context 约束`。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">

    <!-- 扫描指定包下的所有注解注入 -->
	<context:component-scan base-package="com.demo"/>
</beans>
```



* **用于注入数据的**
    他们的作用就和在xml配置文件中的bean标签中写一个\<property>标签的作用是一样的
    * **@Autowired** : 自动按照类型注入
    * **@Qualifier** : 在按照类中注入的基础之上再按照名称注入，value属性：用于指定注入bean的id，`一般与 @Autowired 注解结合使用`
    * **@Resource** : 直接按照 bean 的 id 注入，等价于@Autowired+@Qualifier。它可以独立使用，name属性：用于指定bean的id，name必须书写（`如果该注解无法使用，则需要导入 javax.annotation-api 依赖`）
    * **@Value**：用于注入基本类型和String类型的数据

![image-20200618100730140](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200618100731.png)

> 注意：
>
> 该三个注入都只能注入其他 bean 类型的数据，而 基本类型和String类型 无法使用上述注解实现。
>
> 另外，`集合类型的注入只能通过 XML 来实现`。因为 Resource 注解是 J2EE 的，而不是 Spring 本身的，所以在使用时需要在 pom.xml 中导入`javax.annotation-api`依赖。

```xml
	<!-- @Resource 注解需导依赖 -->
	<dependency>
            <groupId>javax.annotation</groupId>
            <artifactId>javax.annotation-api</artifactId>
            <version>1.3.2</version>
    </dependency>
```



```java
// User.java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Component // 把当前类对象存入 Spring 容器中
public class User {
    private String username;
}

// UserDaoImpl.java
@Repository
public class UserDaoImpl implements UserDao {
    @Override
    public List<User> findAll() {
        ArrayList<User> users = new ArrayList<>();
        users.add(new User("aaa"));
        users.add(new User("bbb"));
        return users;
    }
}

// UserServiceImpl.java
@Service // 把当前控制层对象存入 Spring 对象中
public class UserServiceImpl implements UserService {

    @Autowired // (自动穿上)自动按照类型注入
    private UserDao userDao;

    @Override
    public List<User> findAll() {
        return userDao.findAll();
    }
}

// UserController.java
@Controller // 把当前控制层对象存入 Spring 对象中
public class UserController {

    @Autowired // (自动穿上)自动按照类型注入
    private UserService userService;

    public List<User> findAll() {
        return userService.findAll();
    }
}

// applicationContext.xml
<context:component-scan base-package="com.demo"/>

// TestController.java
public class TestController {
    @Test
    public void testController() {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        UserController userController = (UserController) context.getBean("userController");

        List<User> users = userController.findAll();
        System.out.println(users); // [User(username=aaa), User(username=bbb)]
    }
}
```



* **用于改变作用范围的**
    作用和在 bean 标签中使用 scope 属性实现的功能是一样的。
    * **@scope** ：指定bean的作用范围
        * **value** ：指定范围的取值。常用取值：singleton(默认单例) prototype



```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Component
@Scope("prototype") // 手动指定为多例
public class User {
    private Integer id;
    @Value("张三")
    private String username;
}
```



* **和生命周期相关**
    作用和在 bean 标签中使用 init-method 和 destroy-methode 的作用是一样的。
    * **@PreDestroy**：指定销毁方法（同样只在单例模式下生效，即 @Scope 或 @Scope("singleton")）
    * **@PostConstruct**：指定初始化方法



```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Component
public class User {
    private Integer id;
    @Value("张三")
    private String username;

	@PostConstruct
    public void init() {
        System.out.println("init");
    }

    @PreDestroy
    public void destory() {
        System.out.println("destory");
    }
}
```



#### 6.4 集合类型注入方式

用于给List结构集合注入的标签：

* `<list>` `<array>` `<set>`

用于个Map结构集合注入的标签:

* `<map>`  `<props>`

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CollectionsDemo {
    private Integer[] arr;
    private List<Object> list;
    private Set<Object> set;
    private Map<Object, Object> map;
    private Properties properties;
}

applicationContext.xml
    <bean id="collectionsDemo" class="com.demo.pojo.CollectionsDemo">
        <!--Array-->
        <property name="arr">
            <array>
                <value>10</value>
                <value>20</value>
                <value>30</value>
                <value>40</value>
            </array>
        </property>

        <!--List-->
        <property name="list">
            <list>
                <value>hello</value>
                <value>888</value>
                <ref bean="user"/>
            </list>
        </property>

        <!--Set-->
        <property name="set">
            <set>
                <value>jerry</value>
                <value>ling</value>
                <value>jerry</value>
                <ref bean="car"/>
            </set>
        </property>

        <!--Map-->
        <property name="map">
            <map>
                <entry key="key1" value="value1"/>
                <entry key-ref="car" value-ref="car"/>
            </map>
        </property>

        <property name="properties">
            <props>
                <prop key="username">root</prop>
                <prop key="password">1234</prop>
            </props>
        </property>
    </bean>

TestCollecitonsDemo.java
    @Test
    public void testCollectionDemo() {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        CollectionsDemo collectionsDemo = (CollectionsDemo) context.getBean("collectionsDemo");

        System.out.println(collectionsDemo);
    }
```


### 7. Spring 引入其他 xml 

在当前 applicationContext.xml 配置文件中`引入其他配置文件`，如 bean.xml

```xml
<import resource="bean.xml"></import>
```

