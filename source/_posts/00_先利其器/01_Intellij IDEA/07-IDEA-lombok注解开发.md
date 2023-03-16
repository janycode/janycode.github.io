---
title: 07-IDEA-lombok注解开发
date: 2016-12-18 21:13:45
tags: 
- IDEA
- lombok
- 注解开发
categories:
- 00_先利其器
- 01_Intellij IDEA
---

Lombok是一个Java库，它会自动插入编辑器和构建工具中，Lombok提供了一组有用的注解，用来消除Java类中的大量样板代码。

### 1. Lombok 环境配置
1. `lombok.jar` 包下载并导入：[https://projectlombok.org/download](https://projectlombok.org/download)
2. IDEA Lombok 插件安装：**Settings** >> **Plugins** 搜索安装
3. IDEA 打开注解开发：**Settings** >> **Build** >> **Compiler** >> `☑`**Enable annotation processing**


![image-20230316133931471](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316133932.png)

### 2. Lombok 基本用法
![image-20230316133941838](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316133942.png)

**@Getter / @Setter** 源码

```java
// 生成对应属性的 get/set 方法
@Target({ElementType.FIELD, ElementType.TYPE})  // 可作用在属性、类/接口/枚举上
@Retention(RetentionPolicy.SOURCE) // 在源码编译阶段自动生成对应方法
public @interface Getter {   // Getter/Setter
    AccessLevel value() default AccessLevel.PUBLIC; // 更改 get/set 方法的权限修饰符
    ...
}
```

**@ToString** 源码
```java
// 生成包含属性的 toString 方法
@Target({ElementType.TYPE})  // 只能作用在类/接口/枚举上
@Retention(RetentionPolicy.SOURCE)
public @interface ToString {
    boolean includeFieldNames() default true;
    String[] exclude() default {}; // 排除部分属性
    String[] of() default {}; // 包含部分属性
    ...
}
```

**@NoArgsConstructor / @AllArgsConstructor** 源码
```java
// 生成无参 / 有参构造方法
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.SOURCE)
public @interface NoArgsConstructor { // NoArgsConstructor/AllArgsConstructor
    ...
    AccessLevel access() default AccessLevel.PUBLIC; // 设置方法的权限修饰符
    ...
}
```

**@Data** 源码
```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.SOURCE)
public @interface Data {
    String staticConstructor() default "";
}
```

#### 2.1 注解组合×3
`@Data`
`@NoArgsConstructor`
`@AllArgsConstructor`

demo - 生成 get / set / equals / canEqual / hashCode / toString / 无参构造 / 有参构造
```java
//@Getter // 生成类中所有属性的 get 方法
//@Setter // 生成类中所有属性的 set 方法
//@ToString // 生成类中所有属性的1个 toString 方法
//@ToString(exclude = {"email", "password"}) // 生成排除指定属性的 toString 方法(排除一部分)
//@ToString(of = {"id", "username"}) // 生成包含指定属性的 toString 方法(包含一部分)
@Data // 生成 get/set/equals/canEqual/hashCode/toString
@NoArgsConstructor // 生成类的无参构造
@AllArgsConstructor // 生成类的所有参数的有参构造
public class User {
    private Integer id;
    private String username;
    private String password;
    private String email;
}
```

![image-20230316133958878](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316133959.png)



#### 2.2 链式编程

##### @Builder

`使用 @SuperBuilder(toBuilder=true) 代替，在lombok较新的版本比如大于 1.18.8 上可以解决 @Builder 不支持继承的父类属性的问题。 `

```java
@Data
@SuperBuilder(toBuilder=true)  //代替@Builder, 参数toBuilder=true用于支持属性初始化和修改
@AllArgsConstructor
@NoArgsConstructor
public class UserInfo {
    private String id;
    private String name;
    @Builder.Default        //或 @Default 注解，使链式编程时支持默认值
    private String password = "123456";
}
```

1. @Builder(toBuilder=true) 同时支持属性初始化和修改：

```java
//初始化
UserInfo jerry = UserInfo.builder().id("123").name("jerry").password("666").build();
//修改
UserInfo tom = jerry.toBuilder().name("tom").password("888").build();
```

2. @Data和@Builder导致无参构造丢失 以及 @Builder注解导致默认值无效，因此使用常用组合即可

```java
常用组合：@Data, @SuperBuilder(toBuilder=true), @AllArgsConstructor, @NoArgsConstructor
```



##### @Accessors

@Accessors 是用来配置lombok如何产生和显示getters和setters的注解,可以用在类或方法上面。

@Accessors有三个属性，分别是`fluent`,`chain`,`prefix`

1. fluent 属性
   fluent设置为true，则getter和setter方法的方法名和属性名一模一样，且setter方法返回当前对象 ,该属性默认为false。

```java
@Data
@Accessors(fluent = true)
public class User {
    private Long id;
    private String name;
    
    // 生成的getter和setter方法如下，方法体略
    public Long id() {}
    public User id(Long id) {}
    public String name() {}
    public User name(String name) {}
}
```
![image-20220310224537742](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220310224538.png)

2. chain属性
   chain设置为true，则setter方法返回当前对象。该属性默认为false，(如果当fluent为true时，chain默认则为true).   

```java
@Data
@Accessors(chain = true)
public class User {
    private Long id;
    private String name;
    
    // 生成的setter方法如下，方法体略
    public User setId(Long id) {}
    public User setName(String name) {}
}
```
![image-20220310224555386](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220310224556.png)

3. prefix属性
   prefix可以指定前缀，生成get/set方法时会去掉指定的前缀

```java
@Data
@Accessors(prefix = "p")
public class User {
	private Long pId;
	private String pName;
    
    // 生成的getter和setter方法如下，方法体略
    public Long getId() {}
    public void setId(Long id) {}
    public String getName() {}
    public void setName(String name) {}
}
```


##### 对比和坑

@Builder就是基于建造者模式支持链式操作，但很多时候都是构造失血模式的Bean或者没有共享变量，这时候为了链式操作就新建一个builder是不是有点大材小用
示例：实体类加上@Builder注解（目前更新为@SuperBuilder ）

@Accessors就可以解决上述的问题，支持链式操作，同时减少多余对象的创建，builder类元信息又可以减少
示例：实体类加上@Accessors(chain = true)注解

```java
//@Builder
UserInfo jerry = UserInfo.builder().id("123").name("jerry").password("666").build();
//@Accessors
UserInfo jerry = new UserInfo().setId("123").setName("jerry").setPassword("666");
```

坑：有的开源反射工具包对对象进行浅拷贝时，获取set方法元信息时会判断方法返回值是否是void，这时候@Accessors就会出现异常。

##### @Singular

```java
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
class UserBean {
    private Integer id;
    private String userName;
    @Default
    private String example = "123456";
    @Singular
    private List<String> favorites;
}
```

```java
//@Singular这个注解可以这样操作list了
UserBean u = UserBean.builder().id(1001).userName("polly")
					 .favorite("music")
					 .favorite("movie")
					 .build();
```



##### @SuperBuilder

因为 @Builder 并不支持父类成员属性的构造，使用 @SuperBuilder 可以解决次问题，对于 toBuilder = true 在父类也需要同时添加。

```java
@SuperBuilder(toBuilder = true)
public class Person {
    private Integer age;
    private String name;
}

@SuperBuilder(toBuilder = true)
public class Ming extends Person {
}
```

```java
Ming mingD = Ming.builder()
      .age(11)
      .name("小明")
      .build();
Ming mingF = mingD.toBuilder().name("猪").build();
```



#### 2.3 @SneakyThrows

在`java`的异常体系中`Exception`异常有两个分支，一个是运行时异常`RuntimeException`，一个是编译时异常，在`Exception`下的所有非`RuntimeException`异常，比如`IOException`、`SQLException`等；所有的运行时异常不捕获，编译时异常是一定要捕获，否则编译会报错。`@SneakyThrows`就是利用了这一机制，将当前方法抛出的异常，包装成`RuntimeException`，骗过编译器，使得调用点可以不用显示处理异常信息。

```java
/*
 * 若不使用@SneakyThrows注解，newInsstance方法会要求抛出InstantiationException, 
 * IllegalAccessException异常，且调用sneakyThrowsTest()的地方需要捕获这些异常，
 * 加上@SneakyThrows注解之后就不需要捕获异常信息。
 */
@SneakyThrows
private void sneakyThrowsTest() {
	SneakyThrowsDemo.class.newInstance();
}
```

`简言之，不想 try-catch的时候，可以使用此注解修饰方法。异常依然会被捕获，只是不用写。`