---
title: 03-Spring IoC与Bean
date: 2018-5-30 18:20:30
tags:
- Spring
- IoC
- Bean
categories: 
- 08_框架技术
- 02_Spring
- 01_Core
---



![LOGO](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200617144911.png)



参考资料：https://lfvepclr.gitbooks.io/spring-framework-5-doc-cn/content/



### 1. 容器

容器（container）是 Spring 框架的核心，它管理着 Spring 应用中 bean 的`创建、 配置和管理`，负责对象的整个生命周期。



#### 1.1 容器实现

Spring 自带两种不同类型容器实现，主要使用 `ApplicationContext`。

##### 1）BeanFactory

最简单的容器，提供基本的 DI 支持。使用控制反转将应用的配置和依赖与实际的应用代码分离开来。

第一次访问某一 Bean 时才实例化它。

##### 2）ApplicationContext

基于 BeanFactory 构建， 并提供应用框架级别的服务。

初始化容器时就实例化所有单例的 Bean。

有多种 ApplicationContext 的实现， 每一种都提供了配置 Spring 的不同方式。

##### 3）Bean Factory 和 ApplicationContext 的区别

ApplicationContext 提供了一种解决文档信息的方法，一种加载文件资源的方式(如图片)，他们可以向监听他们的beans发送消息。

另外，容器或者容器中 beans 的操作，这些必须以 Bean Factory 的编程方式处理的操作可以在 ApplicationContext 中以声明的方式处理。

ApplicationContext 实现了 MessageSource，该接口用于获取本地消息，实际的实现是可选的。

* **ApplicationContext**: 它在构建核心容器时，创建对象采取的策略是采用`立即加载`的方式。
* **BeanFactory**: 它在构建核心容器时，创建对象采取的策略是采用`延迟加载`的方式。

ApplicationContext 对 BeanFactory 提供了扩展 :

- 国际化处理
- 事件传递
- Bean 自动装配
- 各种不同应用层的 Context 实现
- 早期开发使用 BeanFactory



#### 1.2 getBean()

通过容器 getBean() 方法从容器获取指定 bean。

```java
@Autowired
ApplicationContext applicationContext;

healthAPI =applicationContext.getBean(AdminServiceAPI.HealthAPI.class);
```



### 2. Spring Bean



#### 2.1 Spring Bean 定义

在 Spring 中，构成应用程序主干并由 Spring IoC 容器管理的对象称为 Bean。这些对象由 Spring IOC 容器实例化、组装、管理。

Spring Bean 中定义了所有的配置元数据，这些配置信息告知容器如何创建它，它的生命周期是什么以及它的依赖关系。



#### 2.2 定义 bean 的作用域

在 Spring 中创建一个 bean 的时候，我们可以通过“scope”属性声明它的作用域。

Spring 中的 bean 默认都是单例（singleton）的，这对可变类型是非线程安全的。

Spring 定义了几种 bean 的作用域：

- Singleton：单例。在 Spring IOC 容器中仅存在一个 Bean 实例，Bean 以单实例的方式存在。
- Prototype：原型。每次被装配时，都会创建一个新的实例。
- Request：在 WebApplicationContext 中，在每次 http 请求中创建一个 bean 的实例。
- Session：在 WebApplicationContext 中，在每次 HTTP Session 过程中只创建一个 bean 的实例；
- GlobalSession：在 WebApplicationContext 中，在同一个全局 HTTP Session 只创建一个 Bean 的实例



### 3. Bean 的生命周期

对于普通的 Java 对象，当 new 的时候创建对象，当它没有任何引用的时候被垃圾回收机制回收。而由 Spring IoC 容器托管的对象，它们的生命周期完全由容器控制。

Spring 只管理单例模式 Bean 的完整生命周期，对于 prototype 的 bean ，Spring 在创建好交给使用者之后则不会再管理后续的生命周期。

![1545011848523-Bean生命周期](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200621002527.png)

BeanFactory 负责 bean 创建的最初四步，然后移交给 ApplicationContext 做后续创建过程



#### 3.1 实例化

Spring 容器（从 XML 文件、注解、Java 配置文件）读取 bean 的定义并实例化 bean。

- 对于 BeanFactory 容器：当客户向容器请求一个尚未初始化的 bean 时，或初始化 bean 的时候需要注入另一个尚未初始化的依赖时，容器就会调用 createBean 进行实例化。
- 对于 ApplicationContext 容器：当容器启动结束后，便实例化所有的 bean。

容器通过获取 BeanDefinition 对象中的信息进行实例化。并且这一步仅仅是简单的实例化，并未进行依赖注入。

实例化对象被包装在 BeanWrapper 对象中，BeanWrapper 提供了设置对象属性的接口，从而避免了使用反射机制设置属性。



#### 3.2 属性填充（依赖注入）

实例化后的对象被封装在 BeanWrapper 对象中，并且此时对象仍然是一个原生的状态，并没有进行依赖注入。

紧接着，Spring 根据 BeanDefinition 中的信息进行依赖注入。

并且通过 BeanWrapper 提供的设置属性的接口完成依赖注入。



#### 3.3 注入 Aware 接口

紧接着，Spring 会检测该对象是否实现了 xxxAware 接口，并将相关的 xxxAware 实例注入给 bean。

- 如果该 Bean 实现了 BeanNameAware 接口，Spring 将 bean 的 id 传递给 setBeanName() 方法。
- 如果该 Bean 实现了 BeanFactoryAware 接口，Spring 将 BeanFactory 传递给 setBeanFactory() 方法。
- 如果该 Bean 实现了 ApplicationContextAware 接口，Spring 将 ApplicationContext 传递给 setApplicationContext() 方法。

xxxAware 接口可以用于在初始化 bean 时获得 Spring 中的一些对象，如获取 Spring 上下文等。



#### 3.4 BeanPostProcessor

当经过上述几个步骤后，bean 对象已经被正确构造，但如果你想要对象被使用前再进行一些自定义的处理，就可以通过 BeanPostProcessor 接口实现。

该接口提供了两个函数：

- postProcessBeforeInitialzation( Object bean, String beanName )
    - 当前正在初始化的 bean 对象会被传递进来，我们就可以对这个 bean 作任何处理。
    - 这个函数会先于 InitialzationBean 执行，因此称为“前置处理”。
    - 所有 Aware 接口的注入就是在这一步完成的。
- postProcessAfterInitialzation( Object bean, String beanName )
    - 当前正在初始化的 bean 对象会被传递进来，我们就可以对这个 bean 作任何处理。
    - 这个函数会在 InitialzationBean 完成后执行，因此称为“后置处理”。



#### 3.5 自定义初始化

当 BeanPostProcessor 的“前置处理”完成后就会进入本阶段。

##### 1）InitializingBean 接口

InitializingBean 接口只有一个函数：afterPropertiesSet()

这一阶段也可以在 bean 正式构造完成前增加我们自定义的逻辑，但它与前置处理不同，由于该函数并不会把当前 bean 对象传进来，因此在这一步没办法处理对象本身，只能增加一些额外的逻辑。

若要使用它，我们需要让 bean 实现该接口，并把要增加的逻辑写在该函数中。

Spring 会在前置处理完成后检测当前 bean 是否实现了 InitializingBean 接口，并执行 afterPropertiesSet 函数。

##### 2）init-method 属性

Spring 为了降低对客户代码的侵入性，给 bean 的配置提供了 init-method 属性，该属性指定了在这一阶段需要执行的函数名。

Spring 便会在初始化阶段执行我们设置的函数。init-method 本质上仍然使用了 InitializingBean 接口。

##### 3）@PostConstruct 注解

对象构建之后调用



#### 3.6 自定义销毁

当 BeanPostProcessor 的“后置处理”完成后就会进入本阶段。

##### 1）DisposableBean 接口

如果该 bean 实现了 DisposableBean，调用 destroy() 方法。

##### 2）destroy-method 属性

和 init-method 一样，通过给 destroy-method 指定函数，就可以在 bean 销毁前执行指定的逻辑。

##### 3）@PreDestroy 注解

对象移除之前调用