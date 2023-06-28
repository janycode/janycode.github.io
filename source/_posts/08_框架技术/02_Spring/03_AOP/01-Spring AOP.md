---
title: 01-Spring AOP
date: 2018-06-01 17:20:30
tags:
- Spring
- AOP
categories: 
- 08_框架技术
- 02_Spring
- 03_AOP
---



![LOGO](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200617144911.png)



参考资料：https://lfvepclr.gitbooks.io/spring-framework-5-doc-cn/content/




### 1.  AOP 原理

**AOP** Aspect Oriented Programing，面向切面编程。
AOP 采取横向抽取机制，取代了传统纵向继承体系重复性代码（性能监视、事务管理、安全检查、缓存）
Spring AOP 使用纯 Java 实现，不需要专门的编译过程和类加载器，在`运行期通过代理方式向目标类织入增强代码`。

**AOP底层原理**：就是`代理机制`

动态代理：

* 特点：字节码随用随创建，随用随加载

* 作用：不修改源码的基础上对方法增强

分类：

* 基于`接口`的动态代理 - JDK 动态代理
* 基于`继承`的动态代理 - CGLib 动态代理



#### 1.1 JDK 动态代理

* 接口：UserDao

```java
public interface UserDao {
	public void add();
	public void update();
}
```

* 实现类：UserDaoImpl

```java
public class UserDaoImpl implements UserDao {
	public void add() {
		System.out.println("add...");
	}
	public void update() {
		System.out.println("update...");
	}
}
```

* JDK 动态代理机制（实现 InvocationHandler 接口，重写 invoke() 方法）

```java
public class JDKProxy implements InvocationHandler{
	private UserDao userDao;

	public JDKProxy(UserDao userDao) {
		this.userDao = userDao;
	}

	public UserDao createProxy() {
		UserDao proxy = (UserDao) Proxy.newProxyInstance(
				userDao.getClass().getClassLoader(),
				userDao.getClass().getInterfaces(),
				this); // this : 类的实例对象，即 new 出来的对象
		return proxy;
	}

	// 调用目标对象的任何一个方法 都相当于调用invoke();
    @Override
	public Object invoke(Object proxy, Method method, Object[] args)
			throws Throwable {
		if("update".equals(method.getName())){
			// 记录日志:
			System.out.println("日志记录...");
			Object result = method.invoke(userDao, args);
			return result;
		}
		return method.invoke(userDao, args);
	}
}
```

* JDK 动态代理机制（匿名内部类直接调用返回代理对象，与实现 InvocationHandler 接口等价）

```java
public class TestProxy {
    public static void main(String[] args) {
        UserDao userDao = new UserDaoImpl();
        //动态代理设计模式：匿名内部类对象
        UserDao p = (UserDao) Proxy.newProxyInstance(
                userDao.getClass().getClassLoader(),
                userDao.getClass().getInterfaces(),
                //Lambda表达式，等价于 new InvocationHandler(){ invoke(){...} }
                (proxy, method, argss) -> {
                    String methodName = method.getName();
                    Object result;
                    //方法名比较：只增强指定的需要增强的方法
                    if ("add".equals(methodName)) {
                        System.out.println("日志记录...");
                        result = method.invoke(userDao, argss);
                    } else {
                        result = method.invoke(userDao, argss);
                    }
                    return result;
                });
        p.add();
        p.update();
}
```

* 测试

```java
import org.junit.Test;
public class SpringDemo1 {
	@Test
	public void test1(){
		UserDao userDao = new UserDaoImpl();
		userDao.add();
		userDao.update();
	}
	@Test
	public void test2(){
		// 被代理对象
		UserDao userDao = new UserDaoImpl();
		// 创建代理对象的时候传入被代理对象.
		UserDao proxy = new JDKProxy(userDao).createProxy();
		proxy.add();
		proxy.update();
	}
}
```

> test2 结果中打印了增强方法的信息：日志记录... add... update...



#### 1.2 CGLib 动态代理

* 普通类：ProductDaoImpl

```java
public class ProductDaoImpl {
	public void add(){
		System.out.println("add...");
	}
	public void update(){
		System.out.println("update...");
	}
}
```

* CGLib 动态代理机制（实现 MethodInterceptor 接口，重写 intercept() 方法）

```java
/**
 * 使用CGLib生成代理对象
 */
public class CGLibProxy implements MethodInterceptor{
	private ProductDaoImpl productDao;

	public CGLibProxy(ProductDaoImpl productDao) {
		this.productDao = productDao;
	}
	
	public ProductDaoImpl createProxy(){
		// 使用CGLIB生成代理:
		// 1.创建核心类
		Enhancer enhancer = new Enhancer();
		// 2.为其设置父类
		enhancer.setSuperclass(productDao.getClass());
		// 3.设置回调
		enhancer.setCallback(this);
		// 4.创建代理
		return (ProductDaoImpl) enhancer.create();
	}

    @Override
	public Object intercept(Object proxy, Method method, Object[] args, MethodProxy methodProxy) throws Throwable {
		if("add".equals(method.getName())){
			System.out.println("日志记录...");
			Object obj = methodProxy.invokeSuper(proxy, args);
			return obj;
		}
		return methodProxy.invokeSuper(proxy, args);
	}
}
```

* 测试

```java
import org.junit.Test;
public class SpringDemo2 {
	
	@Test
	public void test1(){
		ProductDaoImpl productDao = new ProductDaoImpl();
		productDao.add();
		productDao.update();
	}
	@Test
	public void test2(){
		ProductDaoImpl productDao = new ProductDaoImpl();
		ProductDaoImpl proxy = new CGLibProxy(productDao).createProxy();
		proxy.add();
		proxy.update();
	}
}
```

> test2 结果中打印了增强方法的信息：日志记录... add... update...





#### 1.3 Spring  AOP 代理方式

* `JDK 动态代理`：被代理对象必须要实现接口，才能产生代理对象，如果没有接口将不能使用动态代理技术。
* `CGLib 代理机制`：第三方代理技术，CGLib 代理，可以对任何类生成代理。代理的原理是`对目标对象进行继承代理`。 如果目标对象被 final 修饰，那么该类无法被 CGLib 代理。

> 【结论】
>
> Spring 框架中：
>
> * **如果类实现了接口，就使用 JDK 的动态代理生成代理对象**；
> * **如果这个类没有实现任何接口，使用 CGLib 生成代理对象**。

![image-20200618165834904](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200618165835.png)

![image-20200618165909739](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200618165911.png)



### 2. AOP 术语

- **Joinpoint**(`连接点`) : 所谓连接点是指那些被拦截到的点。在 spring 中，这些点指的是方法，因为 spring 只支持方法类型的连接点。
- **Pointcut**(`切入点`) : 所谓切入点是指我们要对哪些 Joinpoint 进行拦截的定义。
- **Advice**(`通知/增强`) : 所谓通知是指拦截到 Joinpoint 之后所要做的事情就是通知，通知分为前置通知、后置通知、异常通知、最终通知、环绕通知(切面要完成的功能)。
- **Introduction**(引介) : 引介是一种特殊的通知在不修改类代码的前提下， Introduction 可以在运行期为类动态地添加一些方法或 Field。——类级别的增强。
- **Target**(`目标对象`) : 代理的目标对象
- **Weaving**(`织入`) : 是指把增强应用到目标对象来创建新的代理对象的过程，spring 采用动态代理织入，而AspectJ 采用编译期织入和类装载期织入。
- **Proxy**(`代理`) : 一个类被 AOP 织入增强后，就产生一个结果代理类
- **Aspect**(`切面`) : 是切入点和通知（引介）的结合

![image-20200618170028865](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200618170030.png)



### 3. AOP 实现

1. **依赖配置**
    在 pom.xml 添加 aop 依赖：`aspectjweaver`

```xml
<dependency>
	<groupId>org.aspectj</groupId>
	<artifactId>aspectjweaver</artifactId>
	<version>1.8.13</version>
</dependency>
```

2. **创建通知类**
* 前置通知(**before**)：目标方法运行`之前`调用
* 最终通知(**after**)：在目标方法运行`之后`调用 (无论是否出现异常)
* 后置通知(**after-returning**)：在目标方法运行`之后`调用 (`未出现异常就会调用`)
* 异常拦截通知(**after-throwing**)：在目标方法运行`之后`调用（如果`出现异常就调用`）
* 环绕通知(**around**)：在目标方法`之前和之后`都调用 (ProceedingJoinPoint对象 -->> 调用proceed方法)

```java
public class MyAdvice {
    public void before() {
        System.out.println("前置通知（执行目标方法之前执行）");
    }

    public void after() {
        System.out.println("后置通知 目标方法之后执行（无论是否发生异常都会执行）");
    }

    public void after_returning() {
        System.out.println("后置通知 目标方法之后执行（未发生异常才执行）");
    }

    public void after_throwing() {
        System.out.println("异常通知（发生异常才执行）");
    }

    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("环绕通知（执行目标方法之前）");
        Object proceed = joinPoint.proceed();
        System.out.println("环绕通知（执行目标方法之后）");
        return proceed;
    }
}
```



#### 3.1 XML 配置 AOP

创建 applicationContext.xml，添加 aop 约束

```xml
<aop:config>
	<!-- 配置切入点 切入点表达式的写法：execution(表达式)
      public void com.abyg.service.UserServiceImpl.save() 精确查找 save 方法
      void com.demo.service.UserServiceImpl.save()  其他修饰符无返回值的save空参方法
      * com.demo.service.UserServiceImpl.save()  有或者无返回值的save空参方法
      * com.demo.service.UserServiceImpl.*()  有或者无返回值的所有空参方法
      * com.demo.service.*ServiceImpl.*(..)  有或者无返回值的所有有参或者空参方法
      * com.demo.service..*ServiceImpl.*(..)  一般不用，service包下子和孙包以ServiceImpl结尾的类中的方法
	-->
	<aop:pointcut id="pc" expression="execution(* com.demo.service.*ServiceImpl.*(..))" />
	<aop:aspect ref="myAdvice" >
		<!-- 指定名为before方法作为前置通知 -->
		<aop:before method="before" pointcut-ref="pc" />
		<!-- 后置 -->
		<aop:after method="after" pointcut-ref="pc"/>
		<!-- 后置 -->
		<aop:after-returning method="after_returning" pointcut-ref="pc" />
		<!-- 异常拦截通知 -->
		<aop:after-throwing method="after_throwing" pointcut-ref="pc"/>
		<!-- 环绕通知 -->
		<aop:around method="around" pointcut-ref="pc" />
	</aop:aspect>
</aop:config>
```



#### 3.2 注解 配置 AOP-推荐

Spring中的注解配置AOP：

```java
//通知类: 表示该类是一个通知类
@Aspect
public class MyAdvice {
    //【自定义切点】管理重复代码
	@Pointcut("execution(* com.demo.service.*ServiceImpl.*(..))")
	public void pc(){}
    
	//前置通知 : 指定该方法是前置通知，并指定切入点为【自定义切点】
	@Before("MyAdvice.pc()")
    public void before() {
        System.out.println("前置通知（执行目标方法之前执行）");
    }
    
	//后置通知
	@After("execution(* com.demo.service.*ServiceImpl.*(..))")
    public void after() {
        System.out.println("后置通知 目标方法之后执行（无论是否发生异常都会执行）");
    }
    
	//后置通知
	@AfterReturning("execution(* com.demo.service.*ServiceImpl.*(..))")
    public void after_returning() {
        System.out.println("后置通知 目标方法之后执行（未发生异常才执行）");
    }

    //异常通知
	@AfterThrowing("execution(* com.demo.service.*ServiceImpl.*(..))")
    public void after_throwing() {
        System.out.println("异常通知（发生异常才执行）");
    }
    
	//环绕通知
	@Around("execution(* com.demo.service.*ServiceImpl.*(..))")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("环绕通知（执行目标方法之前）");
        Object proceed = joinPoint.proceed();
        System.out.println("环绕通知（执行目标方法之后）");
        return proceed;
    }
}
```

```xml
<!-- applicationContext.xml - 在 Springboot 中则不需要 xml 配置文件！ -->
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xmlns="http://www.springframework.org/schema/beans" 
xmlns:context="http://www.springframework.org/schema/context" 
xmlns:aop="http://www.springframework.org/schema/aop" 
xsi:schemaLocation="http://www.springframework.org/schema/beans 
http://www.springframework.org/schema/beans/spring-beans-4.2.xsd 
http://www.springframework.org/schema/context 
http://www.springframework.org/schema/context/spring-context-4.2.xsd 
http://www.springframework.org/schema/aop 
http://www.springframework.org/schema/aop/spring-aop-4.2.xsd ">

<!-- 准备工作: 导入aop(约束)命名空间 -->
	<!-- 1.配置目标对象 -->
	<bean name="userService" class="com.demo.service.UserServiceImpl" />
	<!-- 2.配置通知对象 -->
	<bean name="myAdvice" class="com.demo.annotation_aop.MyAdvice" />
	<!-- 3.开启使用注解完成织入 -->
	<aop:aspectj-autoproxy />

</beans>
```



#### 3.3 切点正则和指示器

**正则**：

`execution(* com.springboot.chapter4.aspect.service.impl.UserServiceImpl.printUser(..))`

* `execution`表示在执行的时候，拦截里面的正则匹配的方法

* `*` 表示任意返回类型的方法

* `(..)`表示任意参数进行匹配

**指示器**：

| 项目类型        | 描述                                                       |
| --------------- | ---------------------------------------------------------- |
| arg()           | 限定连接点方法参数                                         |
| @args()         | 通过连接点方法参数上的注解进行限定                         |
| **execution()** | 用于匹配是连接点的执行方法                                 |
| this()          | 限制连接点匹配AOP代理Bean引用为指定的类型                  |
| target          | 目标对象(即被代理对象)                                     |
| @target()       | 限制目标对象的配置了指定的注解                             |
| within          | 限制连接点匹配执行的类型                                   |
| @windin()       | 限定连接点带有匹配注解类型                                 |
| **@annotation** | 限定带有指定注解的连接点（`常与自定义注解合用`，极其好用） |


