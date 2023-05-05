---
title: 01-Spring Validation注解参数校验
date: 2021-1-28 16:08:21
tags:
- Spring
- 注解
- 参数校验
categories: 
- 08_框架技术
- 02_Spring
- 05_Validation
---

![image-20200708160944615](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708160946.png)



参考资料：[Spring Boot 官网文档 《37. Validation》](https://docs.spring.io/spring-boot/docs/2.1.7.RELEASE/reference/htmlsingle/#boot-features-validation)

参考资料：[@Valid 与 @Validated 注解用法详解](https://www.cnblogs.com/Marydon20170307/p/15707793.html)

> Spring官方在SpringBoot文档中，关于参数校验（Validation）给出的解决方案是这样的：
>
> 使用 JSR-303 规范，直接利用注解进行参数校验。
>
> JSR-303 是 JAVA EE 6 中的一项子规范，叫做 Bean Validation，官方参考实现是 Hibernate Validator。

### 1. 依赖

```xml
<!--【推荐】基于SpringBoot项目时推荐此方式导入依赖-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

```xml
<!--可选方式1：导入校验依赖-->
<dependency>
    <groupId>javax.validation</groupId>
    <artifactId>validation-api</artifactId>
    <version>2.0.1.Final</version>
</dependency>
<!--可选方式2：导入校验依赖-->
<dependency>
    <groupId>org.hibernate.validator</groupId>
    <artifactId>hibernate-validator</artifactId>
</dependency>
```

### 2. 注解用法

1. 对于简单类型参数（非Bean），直接在参数前，使用注解添加约束规则。比如 @NotNull @Length 等（参看上面的官网示例）
2. 在类名前追加 @Validated 注解，否则添加的约束规则不生效。
3. 方法被调用时，如果传入的实际参数与约束规则不符，会直接抛出 ConstraintViolationException ，表明参数校验失败
4. 对于Bean类型的参数，在Bean内部的各个字段上面追加约束注解，然后在方法的参数前面添加 @Valid 注解即可。示例：

```tsx
public class CreateProjectReqVO extends BaseVO {
    /**
     * 请求序列号
     */
    @NotNull(message = "请求序列号不可为空")
    private Integer requestNo;
    /**
     * 项目名称
     */
    @NotNull(message = "项目名称不可为空")
    private String projectName;
    ...
}    
```

```cpp
public CreateProjectRespVO createProject(@Valid CreateProjectReqVO reqVO) {
    ...
}
```

对于Bean里面套Bean的，同样在外层Bean里面写 @Valid 即可。

### 3. 常用校验注解

#### @AssertTrue / @AssertFalse 

验证适用字段：boolean
注解说明：验证值是否为 true / false

```java
@AssertTrue(message = "必须为true")
private boolean status;

@AssertFalse(message = "必须为false")
private boolean status;
```

#### @DecimalMax / @DecimalMin

验证适用字段：BigDecimal,BigInteger,String,byte,short,int,long
注解说明：验证值是否小于或者等于指定的小数值，要注意小数存在精度问题

```java
@DecimalMax(value = "300", message = "必须大于等于300")
private BigDecimal height;

@DecimalMin(value = "150", message = "必须大于等于150")
private BigDecimal height;
```

#### @Digits

验证适用字段：BigDecimal,BigInteger,String,byte,short,int,long
注解说明：验证值的数字构成是否合法
属性说明：integer:指定整数部分的数字的位数。fraction: 指定小数部分的数字的位数。

```java
@Digits(integer=3,fraction = 2,message = "整数位上限为3位，小数位上限为2位")
private BigDecimal height;
```

#### @Future / @Past

验证适用字段：Date,Calendar
注解说明：验证值是否在当前时间之后 / 之前
属性说明：公共

```java
@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
@Future(message = "必须为未来的时间")
private Date createDate;

@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
@Past(message = "必须为过去的时间")
private Date createDate;
```

#### @Max / @Min

验证适用字段：BigDecimal,BigInteger,String,byte,short,int,long
注解说明：验证值是否小于或者等于指定的整数值
属性说明：公共
注意事项：建议使用在Stirng,Integer类型，不建议使用在int类型上，因为表单提交的值为""时无法转换为int

```java
@Max(value = 18, message = "必须小于等于18")
private int age;

@Min(value = 18, message = "必须大于等于18")
private int age;
```

#### @NotNull / @Null

验证适用字段：引用数据类型
注解说明：验证值是否 不为null / null
属性说明：公共

```java
@Null(message = "必须为null")
private String username;

@NotNull(message = "必须不为null")
private String username;
```

#### @NotBlank / @NotEmpty

@NotBlank 检查约束字符串是不是Null还有被Trim的长度是否大于0,只对字符串,且会去掉前后空格
@NotEmpty 检查约束元素是否为Null或者是EMPTY
@NotBlank 与 @NotEmpty 的区别：空格（" "）对于 NotEmpty 是合法的，而 NotBlank 会抛出校验异常

```java
@NotBlank(message = "必须不为空")
private String username;

@NotEmpty(message = "必须不为null且不为空")
private String username;
```

#### @Size

验证适用字段：String,Collection,Map,数组
注解说明：验证值是否满足长度要求
属性说明：max:指定最大长度，min:指定最小长度。

```java
@Size(max = 11, min = 7, message = "长度必须大于等于7或小于等于11")
private String mobile;
```

#### @Length

@Length(min=, max=)：专门应用于String类型

```java
@Length(max = 11, min = 7, message = "长度必须大于等于7或小于等于11")
private String mobile;
```

#### @Range

@Range(min=, max=) 被指定的元素必须在合适的范围内。

```java
@Range(max = 80, min = 18, message = "必须大于等于18或小于等于80")
private int age;
```

#### @Email

@Email 验证是否是邮件地址，如果为null,不进行验证，算通过验证。 

```java
@Email(message = "必须是邮箱")
private String email;
```

#### @Pattern

验证适用字段：String
注解说明：验证值是否配备正则表达式
属性说明：regexp:正则表达式flags: 指定Pattern.Flag 的数组，表示正则表达式的相关选项。

```java
@Pattern(regexp = "\\d{11}",message = "必须为数字，并且长度为11")
private String mobile;
```

#### @Valid

验证适用字段：递归的对关联对象进行校验
注解说明：如果关联对象是个集合或者数组,那么对其中的元素进行递归校验,如果是一个map,则对其中的值部分进行校验(是否进行递归验证)
参考：[@Valid 与 @Validated 注解用法详解](https://www.cnblogs.com/Marydon20170307/p/15707793.html)

```java
public CreateProjectRespVO createProject(@Valid CreateProjectReqVO reqVO) {}
```

#### @CreditCardNumber

信用卡验证。

#### @URL

校验必须为链接地址，即url。
@URL(protocol=,host=, port=,regexp=, flags=)



### 4. 进阶用法提示

1. 校验规则是可以自己定义的，也就是说可以自己写注解类。
   具体写法参考：[Java Bean Validation 2.0 (二): 自定义校验规则](https://zhuanlan.zhihu.com/p/261020040)

2. 约束规则可以“分组”（group），比如在A场景下只需要一部分规则生效，B场景下需要全部生效，那么直接在注解上指定生效范围即可。
   具体写法参考：[@Valid分组校验](https://www.cnblogs.com/pengyifeng/p/15215939.html)

3. 方法的返回值也是可以校验的，在方法前面追加约束规则即可：

   ```java
   public @NotNull CreateProjectRespVO createProject(CreateProjectReqVO reqVO) {
   ```

4. 约束用的注解，一般需要带上message参数，方便自定义错误信息，比如前面例子中的“@NotNull(message = "项目名称不可为空")”。而这个message参数是支持EL表达式的

   ```java
   @NotNull(message = "${member.id.null}") 
   ```

   再定义一个比如叫做 messages.properties 的配置文件来统一管理错误信息

   ```java
   member.id.null=用户编号不能为空
   ```

5. 约束规则支持正则表达式。

6. 支持跨参数校验（即通过直接写注解的方式验证多个参数之间的逻辑关系）

### 5. 需要注意的坑

`注解不能（只）放在实现类上`，还是之前举的例子，如果是这么写的话:

```csharp
public interface IProjectService {
    /**
     * 项目创建
     */
    CreateProjectRespVO createProject(CreateProjectReqVO reqVO);
```

```java
@Service
public class ProjectServiceImpl implements IProjectService {

    /**
     * 项目创建
     */
    @Override
    public CreateProjectRespVO createProject(@Valid CreateProjectReqVO reqVO) {
    ……
    
```

在进行校验时会发生“javax.validation.ConstraintDeclarationException”异常（注意跟校验不通过发生的异常不是一个）

> 解决方法：
>
> @Override父类/接口的方法，入参约束只能写在父类/接口上面。
>
> 或者两边都写上也可（但是这样维护时容易出问题，不推荐）。
>
> 另外 @Validated 这个注解写在哪边都可以。

### 6. @Valid与@Validated区别

![image-20230505171001717](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230505171003.png)