---
title: 02-@Validated和@Valid用法详解
date: 2021-11-28 10:24:23
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

### 1.情景展示

SpringBoot，SpringMvc 常用参数校验用法详解

在实际开发过程中，针对前端请求参数的校验是一个不小的工作量。

什么时候需要对请求参数进行校验？

**情形1：前后端分离**

前后端分离，虽然会提高项目的开发进度，但同样也存在前后端开发人员交流不及时等问题。

比方说：性别参数，后端要求只能传1或2，前端非要给你传男或女，当前后端对于数据的要求标准不一致时，就会出现问题。

后台对入参进行校验，一方面，可以提高数据的规范性；另一方面，也可以增加数据的安全性（比如：数据在传输过程中被篡改）。

**情形2：对外提供接口**

本质上，前后端分离，后台提供请求，也是属于接口，这里特指的是后台对后台。

也就是说，别的项目或者公司需要调用咱们写的接口，这个时候，参数的校验就显得格外重要，不想前后端那种，后台加不加校验都没有太大的影响。

### 2.准备工作

关于校验标准，可供java使用的一共有两套：

  一种是：Java API规范 (JSR303) 定义了Bean校验的标准validation-api，但没有提供实现。

  另一种是：hibernate validation是对这个规范的实现，并增加了校验注解如@Email、@Length等。

  Spring Validation是对hibernate validation的二次封装，用于支持spring mvc参数自动校验。

  接下来，以spring-boot项目为例，介绍Spring Validation的使用。

**关于jar包的引用**

  如果spring-boot版本小于2.3.x，spring-boot-starter-web会自动传入hibernate-validator依赖；

  如果spring-boot版本大于2.3.x，则需要手动引入依赖：

```xml
<!--spring对参数进行校验：hibernate validator-->
<dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-validator</artifactId>
    <version>6.0.18.Final</version>
</dependency>
```

现在网络上都是旧的内容，用的是：

![image-20231224102554480](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224102555.png)

完全没有必要，使用第一个jar包就可以了。

关于jar包的区别，文末会进行详细解说。

**@Valid和@Validated的区别**

![image-20231224102616717](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224102617.png)

### 3.具体实现

#### 用法1：requestParam参数校验

描述：通常用于get请求或者请求参数比较少的情形。

**校验生效的前提：**

必须在Controller类上标注@Validated注解，在方法或者参数前添加无效！

![image-20231224102628702](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224102629.png)

如果校验失败，会抛出ConstraintViolationException异常。

用法：

将请求入参一一在请求方法()内，进行罗列，并将校验注解添加在对应入参的前面。

![image-20231224102638705](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224102639.png)

@RequestParam注解的required属性的默认值为true，也就是，要求该参数是必传项；

如果可以为空的话，需要将其值改成false：

![image-20231224102659680](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224102700.png)

否则的话，会报非空错误！

![image-20231224102731176](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224102732.png)

另外，如果请求参数与自己定义的接收的变量名称不一样的话，可以进行映射；

即：只要@RequestParam里面的名称和请求入参名称保持一致即可。

![image-20231224102750470](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224102751.png)

可以看到，只要对照好参数映射关系，就能接收到数据。

说明：

请求参数，的后台不用@RequestParam修饰参数名，并不影响前端发送get请求（form表单格式数据：param1=value1&param2=value2&...）。

另外，没有@RequestParam注解也是可以进行校验的。

所以说，不用@RequestParam注解也是可以的，用不用的区别就在于：方便knife4j识别接口类型是不是application/x-www-form-urlencoded。

如果接收请求入参的变量被@RequestParam注解修饰，knife4j就将接口类型展示为：form表单格式；

![image-20231224102856206](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224102856.png)

![image-20231224102908148](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224102908.png)

当没有@RequestParam注解修饰时，展示为JSON格式。

![image-20231224102924325](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224102925.png)

![image-20231224102938824](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224102939.png)

#### 用法2：pathVariable参数校验

描述：通过{}来动态配置请求路径，并将请求路径当成方法的入参之一。

**校验生效的前提：**

必须在Controller类上标注@Validated注解，在方法或者参数前添加无效！

如果校验失败，会抛出ConstraintViolationException异常。

用法：校验注解可以放在@PathVariable前面也可以放在它的后面。

![image-20231224102956628](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224102957.png)

#### 用法3：responseBody参数校验（application/json）

当请求方法入参有@RequestBody注解的时候，spring会将它识别成JSON格式的请求，要求调用方必须发送application/json格式的数据；

**第1步：在实体类的字段上加上约束注解；**

![image-20231224103010708](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224103011.png)

**第2步：在方法参数上声明校验注解。**

格式：@RequestBody+@Validated+实体类

或者：@RequestBody+@Valid+实体类

![image-20231224103023594](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224103024.png)

这种情况下，使用@Valid和@Validated都可以（只能用@Valid或@Validated的地方，下面会讲）。

#### 用法4：responseBody参数校验（application/x-www-form-urlencoded）

当请求方法入参只有实体类接收的时候，spring会将它识别成FORM表单请求，要求调用方必须发送application/x-www-form-urlencoded格式的数据；

**第1步：在实体类的字段上加上约束注解；**

![image-20231224103047412](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224103048.png)

**第2步：在方法参数上声明校验注解。**

![image-20231224103059109](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224103059.png)

同样地，使用@Valid和@Validated都可以。

### 4.参数校验配置（校验失败，立即抛出异常）

Hibernate Validator有以下两种验证模式：

**普通模式**：会校验完所有的属性，然后返回所有的验证失败信息。

**快速失败返回模式**：只要有一个验证失败，则返回。

默认是普通模式，可以通过一些简单的配置，开启Fali Fast模式，一旦校验失败就立即返回。

```java
import org.hibernate.validator.HibernateValidator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.beanvalidation.MethodValidationPostProcessor;

import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

/**
 * 请求参数校验配置
 */
@Configuration
public class WebParamValidateConfig {
    @Bean
    public Validator validator() {
        ValidatorFactory validatorFactory = Validation.byProvider(HibernateValidator.class)
                .configure()
                //failFast的意思只要出现校验失败的情况，就立即结束校验，不再进行后续的校验。
                //.failFast(true)
                .addProperty("hibernate.validator.fail_fast", "true")
                .buildValidatorFactory();
        return validatorFactory.getValidator();
    }

    @Bean
    public MethodValidationPostProcessor methodValidationPostProcessor() {
        MethodValidationPostProcessor methodValidationPostProcessor = new MethodValidationPostProcessor();
        methodValidationPostProcessor.setValidator(validator());
        return methodValidationPostProcessor;
    }
}
```



### 5.统一异常处理

如果校验失败，会抛出异常，需要对异常进行管理，以便返回一个更友好的提示。

下面是我总结的异常拦截配置类：

```java
import org.jetbrains.annotations.NotNull;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.stream.Collectors;

/**
 * 全局异常处理器
 * @description: @ControllerAdvice默认会对所有的请求进行处理；
 * 对请求入参的校验异常，根本进不到Controller的方法体内，所以，只能在这拦截异常后返回友好错误提示
 * 加basePackages，可以只对具体包名下面的请求进行处理
 * @ControllerAdvice是一个增强的 Controller。使用这个 Controller，可以实现三个方面的功能：
 * 全局异常处理
 * 全局数据绑定
 * 全局数据预处理
 * 只拦截Controller，不会拦截Interceptor的异常
 */
@RestControllerAdvice(basePackages = {"com.xx", "com.yy"})  // 异常拦截位置
public class CzWebExceptionHandler {

    //处理Get请求中 使用@Valid 验证路径中请求实体校验失败后抛出的异常，详情继续往下看代码
    @ExceptionHandler(BindException.class)
    public CzResponseDto<JSONObject> BindExceptionHandler(@NotNull BindException e) {
        String errorMsg = e.getBindingResult().getAllErrors().stream().map(DefaultMessageSourceResolvable::getDefaultMessage).collect(Collectors.joining());
        return CzResult.error("接口调取失败：" + errorMsg, null);
    }

    //处理请求参数格式错误 @RequestParam上validate失败后抛出的异常是javax.validation.ConstraintViolationException
    @ExceptionHandler(ConstraintViolationException.class)
    public CzResponseDto<JSONObject> ConstraintViolationExceptionHandler(@NotNull ConstraintViolationException e) {
        String errorMsg = e.getConstraintViolations().stream().map(ConstraintViolation::getMessage).collect(Collectors.joining());
        return CzResult.error("接口调取失败：" + errorMsg, null);
    }

    //处理请求参数格式错误 @RequestBody上validate失败后抛出的异常是MethodArgumentNotValidException异常。
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public CzResponseDto<JSONObject> MethodArgumentNotValidExceptionHandler(@NotNull MethodArgumentNotValidException e) {
        String errorMsg = e.getBindingResult().getAllErrors().stream().map(DefaultMessageSourceResolvable::getDefaultMessage).collect(Collectors.joining());
        return CzResult.error("接口调取失败：" + errorMsg, null);
    }

    // 要求Content-type为application/json，但是内容类型却是text/plain或者text时会被该异常捕获
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public CzResponseDto<JSONObject> HttpMediaTypeNotSupportedExceptionHandler(@NotNull HttpMediaTypeNotSupportedException e) {
        String errorMsg = "本接口不接收application/json以外格式的数据，请检查入参是否是标准的json数据！\n" + e.getMessage();
        return CzResult.error("接口调取失败：" + errorMsg, null);
    }

    @ExceptionHandler(Exception.class)
    public CzResponseDto<JSONObject> handleException(@NotNull Exception e) {
        String errorMsg = "系统异常，请联系开发人员Marydon进行排错！\n" + e.getMessage();
        return CzResult.error("接口调取失败：" + errorMsg, null);
    }

    // 运行异常
    @ExceptionHandler(RuntimeException.class)
    public CzResponseDto<JSONObject> handleRuntimeException(@NotNull Exception e) {
        return CzResult.error("接口调取失败：" + e.getMessage(), null);
    }

    // 服务异常
    @ExceptionHandler(ServiceException.class)
    public CzResponseDto<JSONObject> handleServiceException(@NotNull Exception e) {
        return CzResult.error("接口调取失败：" + e.getMessage(), null);
    }

    // 请求方式异常（仅支持post请求）
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public CzResponseDto<JSONObject> handleHttpRequestMethodNotSupportedException(@NotNull Exception e) {
        return CzResult.error("接口调取失败：" + e.getMessage(), null);
    }

    // 不存在的请求方法InterfaceMethod，在CzRequestParams可以查看支持的接口
    // 注意：当请求数据格式为非text或text/plain时，也会抛出该异常（application/javascript,application/xml,text/xml,text/html）
    // 无请求入参时也会抛出该异常
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public CzResponseDto<JSONObject> handleHttpMessageNotReadableException(@NotNull Exception e) {
        // return CzResult.error("接口调取失败：未知的接口方法，请仔细核对入参InterfaceMethod的值！", null);
        return CzResult.error("接口调取失败：" + e.getMessage(), null);
    }
}
```

仅供参考。

### 6.常用注解

#### @NotBlank

@NotBlank：只用在String上，表示：传进来的值不能为null，而且调用trim()后，长度必须大于0，即：必须有实际字符；

![image-20231224103326583](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224103327.png)

#### @NotNull

@NotNull：不能为null，但值可以为empty(分配了内存空间)，只能校验String类型和对象；

![image-20231224103340529](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224103341.png)

不能校验：八大基本数据类型（因为基本数据类型有默认值：byte,short,int,long,double,flot,char,boolean）;

即该参数是必传项，但其值可以为空。

如果非得用基础数据类型接收的话

![image-20231224103355614](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224103356.png)

那就只能和基本数据类型的默认值比较，进行判断啦。

![image-20231224103411873](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224103412.png)

或者：把基本数据类型改成String，然后，在需要的时候，再将其进行数据类型转换，转成自己所需的数据类型。

#### @NotEmpty

@NotEmpty：不能为null，而且长度必须大于0，只能校验字符串。

#### @Max

@Max：最大值，限制该参数的最大值。

#### @Min

@Min：最小值，限制该参数的最小值。

说明：

@Max和@Min只能校验数值类型，也就是说，限制该参数的数据类型只能为数字！

这两个注解，通常一块使用，可以单独使用；

用于接收的数据类型既可以是数值类型，也可以是字符串类型。

![image-20231224103431289](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224103432.png)

![image-20231224103448681](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224103449.png)

#### @Length

@Length：校验字符串长度。

![image-20231224103500221](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224103500.png)

@Size：校验数组、集合大小（java，经测试无效）；

#### @Pattern

@Pattern：正则表达式校验（只能用于校验字符串，即String类型，不能定义成Integer或Long类型，否则报错）

使用标准的正则表达式用法，带反斜杠\的会自动转义。

![image-20231224103513040](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224103513.png)

#### **常用正则表达式**

固定字符：regexp = `"^(门诊|住院|资往)$"`；

可以为空或8个数字：regexp = `"^(\s{0}|\d{8})$"`；

长度必须为6的字符串：regexp = `"^([0-9a-z]{6})$"`；

可以为空或者正整数[1,99]：regexp = `"^(\s{0}|[1-9]\d{0,1})$"`；

校验手机号：regexp = `"^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$"`

身份证号校验：regexp = `"^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$"`

密码校验：

​    密码设定规则：8-16位，其中必须包含数字、小写字母、大写字母；字符仅支持`“！@#¥%”`，不支持空格  

  1、`(?!.*[！·（）{}【】“”：；，》￥、。‘’——\\s-……%\\n])`  表示的是不含中文的特殊字符，以及空格与回车，里面的符合可以自动补充或删除；
  2、`(?=.*[a-zA-Z])`  表示含小写或大写的英文字母
  3、`(?=.*\\d)`  表示必须匹配到数字  ;小写字母`(?=.*[a-z])`;大写字母`(?=.*[A-Z])`
  4、`(?=.*[~!@#$%^&*()_+\\-={}:\";'<>?,.\\/])`  表示含英文的特殊字符，里面的符合可以自动补充或删除
  5、`[^\\u4e00-\\u9fa5]`  表示不允许有中文  ；表示允许有中文的，即：`[\\u4e00-\\u9fa5]`
  6、`{8,16}`  表示长度要求，8~16位

正整数的正则表达式(不包括0): `^[1-9]\d*$`

可为空值或其它：`^$|^`这里写其它表达式`$`

### 7.扩展延伸

#### 延伸1：分组校验

在实际项目中，可能多个方法需要使用同一个实体类来接收参数，而不同方法的校验规则很可能是不一样的；

这个时候，简单地在实体的字段上加约束注解无法解决这个问题。

因此，spring-validation支持了分组校验的功能，专门用来解决这类问题。

举个栗子：

A方法要求参数1的值必须为1，B方法则要求其值必须为2，如何实现？

**第1步：在实体类当中添加接口类；**

把接口类用作分组的依据；

注意：在实体类当中添加的接口，没有实际意义，仅仅将其作为分组依据；

由于spring校验的groups只能这样用，没有办法。

![image-20231224104009267](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224104010.png)

**第1步：在约束注解里，添加该注解生效的的分组信息groups。**

多个组之间使用逗号隔开；

并且，组必须以".class"进行结尾。

![image-20231224104133498](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224104134.png)

针对不同的组，可以添加不同的校验规则。

**第2步：@Validated注解上指定校验分组。**

![image-20231224104147962](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224104148.png)

注意：分组校验只能使用注解@Validated，不能使用@Valid！

另外，方法上使用了分组校验，实体类需要多组共用的字段规则校验，也必须添加组，即使是：校验规则一致的。

![image-20231224104203277](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224104204.png)

否则的话，该校验规则将会失效。

#### 延伸2：嵌套校验

当入参实体类的某字段也是对象时，这时，需要对该对象里的字段进行校验时，这就牵扯到了：嵌套校验；

此时，入参实体类的对应的字段对象，必须标记@Valid注解。

![image-20231224104223668](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224104224.png)

嵌套的实体类，示例：

![image-20231224104236896](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224104237.png)

#### 延伸3：集合校验（list）

如果请求体直接传递了json数组给后台，并希望对数组中的每一项都进行参数校验。

此时，如果直接使用java.util.Collection下的list或者set来接收数据，参数校验并不会生效！

可以使用自定义list集合来接收参数：

**第1步：包装List类型，并声明@Valid注解；**

```java
public class ValidationList<E> implements List<E> {
    @Delegate
    @Valid
    public List<E> list = new ArrayList<>();

    @Override
    public String toString() {
        return list.toString();
    }
}
```

@Delegate注解受lombok版本限制，1.18.6以上版本可支持；

如果校验不通过，会抛出NotReadablePropertyException，同样可以使用统一异常进行处理。

**第2步：校验调用**

格式：@Validated + ValidationList<实体类>。

比如，需要一次性保存多个User对象，Controller层的方法可以这么写：

```java
@PostMapping("/saveList")
public Result saveList(@RequestBody @Validated(UserDTO.Save.class) ValidationList<UserDTO> userList) {
    return Result.ok();
}
```

说明：后端如果想要使用list接收数据的话，必须加上注解@RequestBody；

前端必须发送json请求：application/json，也就说前端的参数格式为：JsonArray。

#### 延伸4：自定义校验

校验规则是可以自己定义的，也就是说可以自己写注解类。 具体写法参考：[Java Bean Validation 2.0 (二): 自定义校验规则](https://zhuanlan.zhihu.com/p/261020040)

#### 延伸5：编程式校验

[@Valid和@Validated的编程式调用，手动触发参数校验](https://juejin.cn/post/7086093314256011294)

### 8.hibernate-validator.jar详细介绍

当spring-boot-starter-web.jar的版本为1.X时，该jar包依赖的有：hibernate-validator.jar；

hibernate-validator.jar又依赖了：validation-api.jar。

![image-20231224104429080](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224104429.png)

当spring-boot-starter-web.jar的版本为2.X时，该jar包没有依赖hibernate-validator.jar，也没有依赖：validation-api.jar；

![image-20231224104439849](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224104440.png)

此时只能使用注解@Validated

![image-20231224104451544](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224104452.png)

但是，只有它的话，并不能完成参数的校验。

由开篇了解到：参数校验，要么用hibernate校验，要么使用java校验。

hibernate-validator.jar包的引入有两种方式：

**方式一：org.hibernate.validator**

```xml
<!--spring对参数进行校验：hibernate validator-->
<dependency>
    <groupId>org.hibernate.validator</groupId>
    <artifactId>hibernate-validator</artifactId>
    <version>6.0.18.Final</version>
</dependency>
```

![image-20231224104501159](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224104501.png)

**方式二：org.hibernate**

```xml
<!--spring对参数进行校验：hibernate validator-->
<dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-validator</artifactId>
    <version>6.0.8.Final</version>
</dependency>
```

![image-20231224104509910](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20231224104510.png)

可以看到：这两种方式引入的hibernate-validator.jar都对jakarta.validation-api.jar有依赖；

因此，无需额外引入依赖：

```xml
<dependency>
    <groupId>javax.validation</groupId>
    <artifactId>validation-api</artifactId>
    <version>2.0.1.Final</version>
</dependency>
```

**小结：**

当spring-boot-starter-web.jar的版本为1.X时，该jar包依赖的有：hibernate-validator.jar，无需额外引入；

当spring-boot-starter-web.jar的版本为2.X时，该jar包需要引入依赖：hibernate-validator.jar（以上两种引入方式均可）。