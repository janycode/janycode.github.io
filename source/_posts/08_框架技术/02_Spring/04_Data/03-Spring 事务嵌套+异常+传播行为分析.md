---
title: 03-Spring 事务嵌套+异常+传播行为分析
date: 2021-1-22 23:46:57
tags:
- Spring
- 事务
categories: 
- 08_框架技术
- 02_Spring
- 04_Data
---

![image-20200708160944615](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708160946.png)



### 1. 无嵌套的正常事务

```java
public class C{
    @Transactional
    public void a(){
         //TODO
    }
}
```

【结论】：`出现异常，正常回滚。`

> 原因：
>
> 事务的 ACID 特性中的 C，Consistency 一致性，事务内有操作失败时则数据将全部回滚到修改前的状态。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210122234844.png)



### 2. 方法A调用带事务的方法B

```java
public class C{
    public void a(){
        b();
    }
    @Transactional
    public void b(){
         //TODO
    }
}
```

【结论】：`同一个类内，方法 A 调用了带事务的方法 B，则方法 B 的事务将失效。`

> 原因：
>
> spring aop 动态代理机制给当前类 C 生成代理类 PolicyC，然后 A 调用 B 还是在 C 类中调用(而不是代理类 PolicyC)，代理类 PolicyC 中的 B 方法并没有被调用到。

![image-20210122235728136](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210123001601.png)

> 解决方案：
>
> `只有在不同的类 C 和 C1 中，C 类中的 A 方法调用 C1 类中的 B 方法，这样 B 中的事务就会生效。`
>
> ```java
> public class C{
>     @Autowired 
>     private C1 c1;
>     //注入 C1 类调用 c1 类中的 B() 方法
>     public void A(){
>        c1.B();
>     }
> }
> public class C1{
>     @Transactional
>     public void B(){
>         //TODO
>     }
> }
> ```



### 3. 加入异常捕获处理的事务

```java
public class C{
    @Transactional
    public void a(){
        try {
            //TODO
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

【结论】：`事务方法中对原子操作进行普通的 try-catch 时，事务会失效。`

> 原因：
>
> 默认spring事务只在发生未被捕获的 RuntimeExcetpion 时才回滚。
>
> Spring 声明式事务默认会对非检查型异常和运行时异常进行回滚，而`对检查型异常不进行回滚`操作。Error和RuntimeException及其子类为非检查型异常。通过如下几种方式改变其规则：
>
> 1）让 checked 异常也进行回滚，使用 @Transactional(rollbackFor = Exception.class)
>
> 2）让 unchecked 异常也不回滚，使用 @Transactional(notRollbackFor = RunTimeException.class)
>
> 3）不需要事务，@Transactional(propagation = Propagation.NOT_SUPPORTED)
>
> 4）如果不添加 rollbackFor 等属性，Spring碰到 Unchecked Exceptions 都会回滚，不仅是RuntimeException，也包括 Error。
>
> 因此，本场景下会让 spring aop 无法正常捕捉到运行时的事务中的异常，从而事务失效。

![image-20210123001556309](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210123001557.png)

> 解决方案：
>
> 1. 在 catch 语句中，继续抛出 Exception。不建议这么做，不太友好(调用者需捕获处理异常)。
>
>     ```java
>     public class C{
>         @Transactional
>         public void a() throws Exception {
>             try {
>                 //TODO
>             } catch (Exception e) {
>                 e.printStackTrace();
>                 throw new Exception(); //或用 throw new RuntimeException() 则无需往上继续抛，可被 aop 捕获进而事务回滚
>             }
>         }
>     }
>     ```
>
> 2. 对于要进行事务的方法，不使用 try catch，在上层调用的时候处理异常；
>     说明：同样不能再同一个类内，原因参考 方法A调用带事务的方法B 场景。
>
> 3. 在 catch 语句中增加 TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();语句，手动回滚，这样上层就无需去处理异常。
>
>     ```java
>     public class C{
>         @Transactional
>         public void a() {
>             try {
>                 //TODO
>             } catch (Exception e) {
>                 e.printStackTrace();
>                 TransactionAspectSupport.currentTransactionStatus().setRollbackOnly(); //手动回滚
>             }
>         }
>     }
>     ```



### 4. 事务回滚的注意事项

1. 要想事务起作用，必须是主方法名上有 @Transactional 注解，方法体内不能用 try catch；如果用 try catch，则 catch 中必须用 throw new RuntimeException();
2. @Transactional 注解应该只被应用到 public 方法上，不要用在 protected、private 等方法上，即使用了也将被忽略，不起作用，这是由 Spring AOP 决定的。
3. 只有来自外部的方法调用才会被 AOP 代理捕捉，类内部方法调用类内部的其他方法，子方法并会不引起事务行为，即使被调用的方法上使用有 @Transactional 注解。
4. 类内部方法调用内部的其他方法，被调用的方法体中如果有 try catch，则 catch 中必须用 throw new RuntimeException()，否则即使主方法上加上 @Transactional 注解，如果被调用的子方法出错也不会抛出异常，不会引起事务起作用。



### 5. 事务传播行为分析

七大事务传播行为：

![image-20210123152507103](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210123152510.png)

事务传播行为用法：

```java
public class C{
    //1.REQUIRED 没有事务则创建一个事务执行(默认的事务传播行为)
    //@Transactional 等价于 @Transactional(propagation = Propagation.REQUIRED)
    @Transactional(propagation = Propagation.REQUIRED)
    //2.REQUIRES_NEW 不管事务是否存在，都会另起一个事务
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    //3.SUPPORTS 存在事务就加入该事务运行，不存在事务则在非事务中运行
    @Transactional(propagation = Propagation.SUPPORTS)
    //4.NOT_SUPPORTED 不在事务中运行，如果当前存在事务则将事务挂起
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    //5.MANDATORY 必须在事务中运行，否则就会抛出异常
    @Transactional(propagation = Propagation.MANDATORY)
    //6.NEVER 不能在事务中运行，否则就会抛出异常(与 MANDATORY 相反)
    @Transactional(propagation = Propagation.NEVER)
    //7.NESTED 嵌套事务，外围如果没有事务则自己另起一个事务，可独立与外围事务进行单独提交或者回滚
    @Transactional(propagation = Propagation.NESTED)
    public void a() {
        //TODO
    }
}
```

#### 5.0 无事务

无事务运行，保留出错前的数据，不涉及回滚。

![image-20210123155641606](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210123155642.png)

#### 5.1 REQUIRED 示例解析

没有事务则创建一个事务执行(默认的事务传播行为)。
@Transactional 等价于 @Transactional(propagation = Propagation.REQUIRED)

![image-20210123160359814](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210123160400.png)



#### 5.2 REQUIRES_NEW 示例解析

场景①：新起的事务抛出异常会不会让外围事务回滚？会！

![image-20210123162327528](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210123162328.png)

场景②：外围事务失败会不会导致新起的事务中已提交的数据进行回滚？会！

![image-20210123163647037](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210123163648.png)



#### 5.3 SUPPORTS 示例解析

场景①：调用者不存在事务，则不会回滚。

![image-20210123165656469](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210123165658.png)

场景②：调用者存在事务，则会回滚。

![image-20210123170731266](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210123170732.png)



#### 5.4 NOT_SUPPORTED 示例解析

当前不支持事务。比如 ServiceA.methodA 的事务级别是 PROPAGATION_REQUIRED ，而 ServiceB.methodB 的事务级别是 PROPAGATION_NOT_SUPPORTED ，那么当执行到 ServiceB.methodB 时，ServiceA.methodA 的事务挂起，而他以非事务的状态运行完，再继续 ServiceA.methodA 的事务。

![image-20210123174901885](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210123174903.png)

![image-20210123175353583](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210123175354.png)

`如果是同一个类内，该事务级别不会生效。`

即 A 类的 a 方法使用事务 REQUIRED，调用 A 类内部的 b 方法使用事务 NOT_SUPPORTED 时，不论 a或b 谁出现异常，则都会回滚。（已验证） 

#### 5.5 MANDATORY 示例解析

必须在事务中运行，否则就会抛出异常。

![image-20210123180146349](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210123180147.png)

![image-20210123180507280](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210123180508.png)



#### 5.6 NEVER 示例解析

不能在事务中使用，否则抛出异常。`而且在非事务中使用时，一旦出现异常也不会进行回滚。`

![image-20210123180725848](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210123180727.png)

![image-20210123180910853](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210123180912.png)



#### 5.7 NESTED 示例解析

嵌套事务，外围如果没有事务则自己另起一个事务，可`独立与外围事务进行自身事务的单独提交或者回滚`。

![image-20210123181818192](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210123181819.png)
