---
title: 02-Spring AOP应用
date: 2018-06-20 14:20:54
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

AOP 提供了一种面向切面操作的扩展机制，通常这些操作是与业务无关的，在实际应用中，可以实现：日志处理、事务控制、参数校验和自定义注解等功能。

## 一、日志处理

### 1.1 普通日志处理

在调试程序时，如果需要在执行方法前打印方法参数，或者在执行方法后打印方法返回结果，可以使用切面来实现。

```java
@Slf4j
@Aspect
@Component
public class LoggerAspect {

    @Around("execution(* cn.codeartist.spring.aop.sample.*.*(..))")
    public Object doAround(ProceedingJoinPoint joinPoint) throws Throwable {
        // 方法执行前日志
        log.info("Method args: {}", joinPoint.getArgs());
        Object proceed = joinPoint.proceed();
        // 方法执行后日志
        log.info("Method result: {}", proceed);
        return proceed;
    }
}
```

### 1.2 记录接口调用的日志

在排查问题时，一般会追溯接口的入参信息，因此需要一个切面去打印进入 Controller 的接口方法时的入参信息，实现如下：

```java
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Objects;

/**
 * 请求映射切面
 *
 * @author Jerry(姜源)
 */
@Slf4j
@Aspect
@Component
public class RequestMappingAspect {

    @Before("@annotation(org.springframework.web.bind.annotation.RequestMapping)")
    public void beforeRequestMapping(JoinPoint joinPoint) {
        //获取 HttpServletRequest 对象
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = ((ServletRequestAttributes) Objects.requireNonNull(requestAttributes)).getRequest();
        //获取请求头来源应用 ID
        String appId = request.getHeader("appId");
        //获取远程 IP 地址
        String remoteIp = request.getRemoteAddr();
        //获取请求方式
        String method = request.getMethod();
        //获取请求 URL
        String url = request.getRequestURL().toString();
        //获取请求方法名
        String methodName = joinPoint.getSignature().getName();
        //获取请求参数
        String params = Arrays.toString(joinPoint.getArgs());
        //打印请求信息
        log.info("[请求信息]" +
                ": appId=" + appId +
                ", remoteIp=" + remoteIp +
                ", method=" + method +
                ", url=" + url +
                ", methodName=" + methodName +
                ", params=" + params
        );
    }
}
```

> 在上述代码中，使用 `@Before` 注解来指定切入点表达式，该表达式表示在所有带有 `@RequestMapping` 注解的方法执行之前执行 `beforeRequestMapping` 方法。
>
> 在 `beforeRequestMapping` 方法中，首先通过 `RequestContextHolder.getRequestAttributes()` 获取当前请求的 HttpServletRequest 对象，然后可以从该对象中获取远程 IP 地址、请求方式、请求 URL 等信息。
>
> 通过 `joinPoint.getSignature().getName()` 可以获取当前执行的方法名。
>
> 通过 `joinPoint.getArgs()` 可以获取当前请求的参数列表，然后将参数拼接为字符串。
>
> 最后，打印参数信息（字符串的 + 操作会自动被JVM编译优化为 StringBuilder [参考资料](https://janycode.gitee.io/#/./02_%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80/01_Java/01_JavaSE/02_%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1/11-StringBuilder&StringBuffer)）。
>
> 需要注意的是，为了使切面生效，还需要在 Spring Boot 的配置类中添加 `@EnableAspectJAutoProxy` 注解。

### 1.3 记录sql消耗时间日志

记录 dao 方法在`执行前后的执行时间`，计算 sql 实际消耗的时间，如果时间超过一定时间，将该sql记录到日志或文件，来做有目标性的优化。

```java
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * sql执行时间切面
 *
 * @author Jerry(姜源)
 */
@Slf4j
@Aspect
@Component
public class SqlExecutionAspect {

    /**
     * sql执行时间（毫秒）
     */
    public static final Integer SQL_EXECUTE_TIME = 1000;
    
    @Around("execution(* cn.ienglish.dao.*.*(..)) && (@annotation(org.springframework.stereotype.Repository) || @annotation(org.apache.ibatis.annotations.Mapper))")
    public Object measureSqlExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        //获取目标方法的类名和方法名
        //String className = joinPoint.getTarget().getClass().getSimpleName();
        String className = joinPoint.getTarget().getClass().getInterfaces()[0].getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        //获取目标方法的参数
        String args = Arrays.toString(joinPoint.getArgs());
        //获取当前时间
        long startTime = System.currentTimeMillis();
        //执行目标方法
        Object result = joinPoint.proceed();
        //计算执行时间
        long executionTime = System.currentTimeMillis() - startTime;
        //如果执行时间超过一定时间，记录到日志中 或 文件 或 异步推送通知提醒
        if (executionTime > SQL_EXECUTE_TIME) {
            log.warn("SQL 执行时间超过 {}ms DAO层信息: {} ms. Class: {}, Method: {}, Args: {}",
                SQL_EXECUTE_TIME, executionTime, className, methodName, args);
        }
        //返回方法执行结果
        return result;
    }
}
```

> 也可将 1.2 与 1.3 相结合，记录接口从进入到返回的耗时时间，可与 TPS 指标关联对比。

## 二、事务控制

Spring 提供的声明式事务也是基于 AOP 来实现的，在需要添加事务的方法上面使用 `@Transactional` 注解。

```java
@Service
public class DemoService {

    @Transactional(rollbackFor = Exception.class)
    public void insertBatch() {
        // 带事务控制的业务操作
    }
}
```

## 三、参数校验

如果需要在方法执行前对方法参数进行校验时，可以使用前置通知来获取切入点方法的参数，然后进行校验。

```java
@Slf4j
@Aspect
@Component
public class ValidatorAspect {

    @Before("execution(* cn.codeartist.spring.aop.sample.*.*(..))")
    public void doBefore(JoinPoint joinPoint) {
        // 方法执行前校验参数
        Object[] args = joinPoint.getArgs();
    }
}
```

## 四、自定义注解

因为 AOP 可以拦截到切入点方法，Spring 也支持通过注解的方式来定义切点表达式，所以可以通过 AOP 来实现自定义注解的功能。

例如，自定义一个注解来实现声明式缓存，把方法的返回值进行缓存。

```java
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Cacheable {

    /**
     * 缓的Key
     */
    String key();

    /**
     * 缓存过期时间
     */
    long timeout() default 0L;

    /**
     * 缓存过期时间单位（默认：毫秒）
     */
    TimeUnit timeUnit() default TimeUnit.MILLISECONDS;
}
```

然后定义一个切片来实现常规的缓存操作，先读缓存，缓存不存在时执行方法，然后把方法的返回结果进行缓存。

```java
@Aspect
@Component
public class AnnotationAspect {

    @Around("@annotation(cacheable)")
    public Object doAround(ProceedingJoinPoint joinPoint, Cacheable cacheable) throws Throwable {
        // 自定义缓存逻辑
        return joinPoint.proceed();
    }
}
```

## 五、AOP 方法失效问题

Spring AOP 的原理是在原有方法外面增加一层代理，所以在当前类调用 AOP 方法时，因为 `this` 指向的是当前对象，而不是代理对象，所以 AOP 会失效。

```java
@Service
public class DemoService {

    public void insert() {
        // 该方法事务会失效
        insertBatch();
    }

    @Transactional(rollbackFor = Exception.class)
    public void insertBatch() {
        // 带事务控制的业务操作
    }
}
```

解决这个问题的常用方法有下面三种：

### 1. ApplicationContext

使用 `ApplicationContext` 来手动获取 Bean 对象，来调用 AOP 方法。

```java
@Service
public class DemoService {

    @Autowired
    private ApplicationContext applicationContext;

    public void insert() {
        DemoService demoService = applicationContext.getBean(DemoService.class);
        demoService.insertBatch();
    }

    @Transactional(rollbackFor = Exception.class)
    public void insertBatch() {
        // 带事务控制的业务操作
    }
}
```

### 2. AopContext

使用 `AopContext` 工具类来获取当前对象的代理对象。

```java
@Service
public class DemoService {

    public void insert() {
        ((DemoService) AopContext.currentProxy()).insertBatch();
    }

    @Transactional(rollbackFor = Exception.class)
    public void insertBatch() {
        // 带事务控制的业务操作
    }
}
```

### 3. 注入自身

使用 Spring 注入自身来调用 AOP 方法。

```java
@Service
public class DemoService {

    @Autowired
    private DemoService that;

    public void insert() {
        that.insertBatch();
    }

    @Transactional(rollbackFor = Exception.class)
    public void insertBatch() {
        // 带事务控制的业务操作
    }
}
```

