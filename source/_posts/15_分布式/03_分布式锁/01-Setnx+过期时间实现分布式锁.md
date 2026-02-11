---
title: 01-Setnx+过期时间实现分布式锁
date: 2021-02-18 08:02:52
tags:
- 架构
- Redis
- 注解
categories: 
- 15_分布式
- 03_分布式锁
---

![image-20220207094644153](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220207094645.png)


> 验证代码已放在 git：https://github.com/janycode/eelock.git

### 1. Redis分布式锁理论

Redis有一系列的命令，特点是以NX结尾，NX是Not eXists的缩写，如SETNX命令就应该理解为：SET if Not eXists。
设置成功，返回 1 。 设置失败，返回 0
由于Redis为单进程单线程模式，采用队列模式将并发访问变成串行访问，命令是一条一条执行的所以可以利用setNx可以实现分布式锁。
方法执行前请求redis 进行setnx命令。如果返回1，则表示此时该线程获得锁，执行方法，如果返回0，表示锁已经被占用了，等待重新获取或者超时处理。
项目依赖：spring-boot 版本2.3.0

```xml
<!--Redis-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<!--AOP-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
<!--JSON-->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
<!--Web-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### 2. Redis整合 封装服务类

基于spring boot 封装的 RedisTemplate 实现redis 服务。

1. Redis 配置：主要设置了redis 序列化的一些配置

```java
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * @Class: RedisServiceImpl
 * @Description:
 * @Author: Jerry(姜源)
 * @Create: 21/02/18 10:42
 */
@Configuration
@SuppressWarnings("all")
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<String, Object>();
        template.setConnectionFactory(factory);
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(om);
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
        // key采用String的序列化方式
        template.setKeySerializer(stringRedisSerializer);
        // hash的key也采用String的序列化方式
        template.setHashKeySerializer(stringRedisSerializer);
        // value序列化方式采用jackson
        template.setValueSerializer(jackson2JsonRedisSerializer);
        // hash的value序列化方式采用jackson
        template.setHashValueSerializer(jackson2JsonRedisSerializer);
        template.afterPropertiesSet();
        return template;
    }
}
```

2. service层编写： service 只提供2个方法加锁和解锁，加锁需要几个参数redis 里的key、value，锁的过期时间，获取锁的重试间隔时间，获取不到锁的超时时间。 解锁要两个参数锁的key 和value值

```java
/**
 * @Class: RedisServiceImpl
 * @Description:
 * @Author: Jerry(姜源)
 * @Create: 21/02/18 10:42
 */
public interface RedisService {
    /**
     *  加锁
     * @param key redis key
     * @param value redis value
     * @param expireTime 过期时间
     * @param timeout 获取不到锁超时时间
     * @param interval 重试间隔
     * @return
     */
    boolean tryLock(String key, String value, long expireTime, long timeout, long interval);

    /**
     * 解锁
     * @param key
     * @param value
     */
    void unLock(String key, String value);
}
```

3. service实现层
    加锁方法： 首先判断 获取不到锁的等待时间如果小于等于0 给一个默认时间30毫秒。
    如果获取不到锁超时时间大于0 就获取当前时间进行判断，是否超时
    获取到锁直接返回true 获取不到锁则锁定当前线程进行等待。

这里使用redisTemplate里的方法进行redis 命令操作，需要考虑的问题：锁必须有超时时间，如果A线程获取了锁，A线程在执行过程中异常，导致永远也不会执行结束 这时候锁被A线程占用，其他线程永远获取不到锁，造成死锁。所以要根据业务处理估算时间 进行设置过期时间，如果A线程异常 则超时自动释放锁。由于setnx和expire不具备原子性，假设 用户setnx后 在expire前线程异常，则锁的过期时没有设置上，所以此处**必须保证原子性**。 redis版本升级到2.1以上，直接在setIfAbsent中设置过期时间，也可以是用lua脚本实现。

```java
import com.example.eelock.service.RedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;

import java.util.Collections;
import java.util.concurrent.TimeUnit;


/**
 * @Class: RedisServiceImpl
 * @Description:
 * @Author: Jerry(姜源)
 * @Create: 21/02/18 10:42
 */
@Service
@SuppressWarnings("all")
public class RedisServiceImpl implements RedisService {

    @Autowired
    private RedisTemplate redisTemplate;

    /**
     *  加锁
     * @param key redis key
     * @param value redis value
     * @param expireTime 过期时间
     * @param timeout 获取不到锁超时时间
     * @param interval 重试间隔
     * @return
     */
    @Override
    public boolean tryLock(String key, String value, long expireTime, long timeout, long interval) {
        if(interval<=0){
            //默认等待时间 30 毫秒
            interval = 30L;
        }
        try {
            if (timeout > 0) {
                long begin = System.currentTimeMillis();
                while (System.currentTimeMillis() - begin < timeout) {
                    if (redisTemplate.opsForValue().setIfAbsent(key, value, expireTime, TimeUnit.MILLISECONDS)) {
                        return true;
                    }
                    //等待
                    synchronized (Thread.currentThread()) {
                        Thread.currentThread().wait(interval);
                    }
                }
                return false;
            } else {
                return redisTemplate.opsForValue().setIfAbsent(key, value, expireTime, TimeUnit.MILLISECONDS);
            }
        }catch (Exception e){
            return false;
        }
    }

    @Override
    public void unLock(String key, String value) {
        //todo... 往下看
    }
}
```

解锁方法：解锁需要注意一点，**解铃还须系铃人**，假设A线程获取到了锁，但是正常执行了，但是执行方法耗时太长了导致超时了，锁自动释放了，此时B线程获取到了锁，B执行方法中，A执行结束 进行了释放锁， 由于没有判断 锁是否是A加的锁，进行了删除，所以B在正常未执行结束的时候锁已经被A释放了，这就造成了并发问题。所以A在解锁前要判断锁是否为A加的锁，利用redis命令存储时设置的value 进行判断是否为A加的锁，删除锁之前先获取判断后如果值和A设置的值相等进行删除操作。需要注意的是判断和删除操作**必须保持原子性**，在高并发情况下，如果两条命令不是原子性操作，在判断后，锁超时释放了，其他线程获取到了锁，就会被误删除。

```java
    /**
     * 解锁
     *
     * @param key
     * @param value
     */
    @Override
    public void unLock(String key, String value) {
        String script = "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";
        DefaultRedisScript<Long> defaultRedisScript = new DefaultRedisScript();
        defaultRedisScript.setScriptText(script);
        defaultRedisScript.setResultType(Long.class);
        //执行 脚本 删除 key ,必须使用lua 脚本实现  保证原子性
        Long res = (Long) redisTemplate.execute(defaultRedisScript, Collections.singletonList(key), value);
        if (res != 1L) {
            System.err.println("释放失败");
        }
    }
```

注意：使用redisTemplate执行脚本 和使用Jedis 执行脚本参数不一致。开始没注意，导致测试的时候 一直删除不掉锁。
看下代码：
jedis 参数为 脚本和两个集合

```java
//源码
public Object eval(String script, List<String> keys, List<String> args) {
    return this.eval(script, keys.size(), getParams(keys, args));
}
```

redisTemplate参数为一个集合 和多个参数代替第二个集合

```java
//源码
public <T> T execute(RedisScript<T> script, List<K> keys, Object... args) {
   return scriptExecutor.execute(script, keys, args);
}
```

### 3. 自定义注解

自定义注解：需要几个参数 锁的key,获取锁的间隔、失效时间、超时时间

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * redis 分布式锁注解
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface RedisLock {

    /**
     * key 默认为类名+方法名
     * 使用方法：
     * 1.String 字符串
     * 2.#args[]变量
     * 例如： #args[0]
     * #args[1].getName() 只支持无参方法调用
     */
    String key() default "";

    /**
     * 重新获取锁的间隔时间，默认100ms
     */
    long interval() default 100L;

    /**
     * 失效时间，默认10秒
     */
    long expireTime() default 10 * 1000L;

    /**
     * 阻塞时间，超时获取不到锁，抛异常 或走回调方法
     */
    long timeout() default 5 * 1000L;
}
```

### 4. Aop实现注解环绕通知、获取注解参数、加锁解锁

Aop里需要做的事情：在方法执行前，获取锁的注解值，进行加锁，如果加锁成功进行方法执行，如果加锁失败 抛出异常，可以自定义异常使用统一异常处理。

大概是：切入注解 RedisLock ，获得注解的参数，使用uuid作为redis value，解锁的时候传入认证 封装获取key的方法，反射根据注解 执行方法 获得参数里的key值，默认为类名+方法名

```java
import com.example.eelock.anno.RedisLock;
import com.example.eelock.service.RedisService;
import com.example.eelock.util.ThreadLocalUtil;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.UUID;

/**
 * 分布式锁AOP
 */
@Aspect
@Component
public class LockAspect {

    @Autowired
    private RedisService redisService;

    /**
     * 环绕通知  加锁 解锁
     * 注意：@Around("@annotation(RedisLock)") 会报错
     *     java.lang.IllegalArgumentException: error Type referred to is not an annotation
     *
     * @param joinPoint
     * @return
     * @throws Throwable
     */
    @Around("@annotation(com.example.eelock.anno.RedisLock)")
    public Object redisLockAop(ProceedingJoinPoint joinPoint) throws Throwable {
        Object res = null;
        RedisLock lock = ((MethodSignature) joinPoint.getSignature()).getMethod().getAnnotation(RedisLock.class);
        String uuid = UUID.randomUUID().toString();
        String key = getKey(joinPoint, lock.key());
        System.err.println("[KEY] :" + key);
        if (ThreadLocalUtil.get(key) != null) {
            //当前线程已经获取到锁 不需要重复获取锁。保证可重入性
            return joinPoint.proceed();
        }
        if (redisService.tryLock(key, uuid, lock.expireTime(), lock.timeout(), lock.interval())) {
            //获取到锁进行标记 执行方法
            ThreadLocalUtil.put(key, "");
            res = joinPoint.proceed();
            //方法执行结束 释放锁
            ThreadLocalUtil.clear(key);
            redisService.unLock(key, uuid);
            return res;
        } else {
            //获取不到锁 抛出异常 进入统一异常处理
            throw new Exception();
        }
    }

    /**
     * 根据参数 和注解 获取 redis key值
     *
     * @param joinPoint
     * @param key
     * @return
     */
    public String getKey(ProceedingJoinPoint joinPoint, String key) {
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();
        try {
            if ("".equals(key)) {
                //默认类名 + 方法名
                return className + methodName;
            }
            if (key.startsWith("#args")) {
                //包含 #args 读取参数 设置key 不包含直接返回
                //获取参数
                Object[] args = joinPoint.getArgs();
                //获取注解下标  例如：#args[0]  或者 #args[1].getName()
                int index = Integer.parseInt(key.substring(key.indexOf("[") + 1, key.indexOf("]")));
                Object keyArgs = args[index];
                if (key.split("\\.").length <= 1) {
                    return keyArgs.toString();
                }
                //反射执行方法 拿到返回值 返回key
                Class<?> clas = keyArgs.getClass();
                Method method = clas.getMethod(key.split("\\.")[1].split("\\(")[0]);
                return method.invoke(keyArgs).toString();
            }
            return key;
        } catch (Exception e) {
            return className + methodName;
        }
    }
}
```

### 5. ThreadLocal实现可重入锁

可重入性：假设a方法需要 testlock锁，b方法也需要testlock锁，a方法调用了b方法，此时锁被a方法获取，b方法获取不到锁永远等待，所以 如果线程有一个方法获取到了锁，则其他方法不需要获取锁就可以执行了。

> ThreadLocal是解决线程安全问题一个很好的思路，它通过为每个线程提供一个独立的变量副本解决了变量并发访问的冲突问题。

使用ThreadLocal，在获取到锁的时候 标记一下，方法获取锁之前先判断线程是否已经获取到锁了。

提供一个ThreadLocal 帮助类

```java
import java.util.HashMap;
import java.util.Map;

public class ThreadLocalUtil {
    
    private static final ThreadLocal<Object> tlContext = new ThreadLocal<>();

    /**
     * 放入缓存
     *
     * @param key   键
     * @param value 数值
     */
    public static void put(Object key, Object value) {
        Map m = (Map) tlContext.get();
        if (m == null) {
            m = new HashMap();
            tlContext.set(m);
        }
        m.put(key, value);
    }

    /**
     * 获取缓存
     *
     * @param key 键
     */
    public static Object get(Object key) {
        Map m = (Map) tlContext.get();
        if (m == null) return null;
        return m.get(key);
    }

    /**
     * 清理
     *
     * @param key 键
     */
    public static void clear(Object key) {
        Map m = (Map) tlContext.get();
        if (m == null) return;
        m.remove(key);
    }
}
```

* 测试：

    ```java
    package com.example.eelock.controller;
    
    import com.example.eelock.anno.RedisLock;
    import com.example.eelock.pojo.Userinfo;
    import com.example.eelock.service.RedisService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.PostMapping;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RestController;
    
    import java.util.UUID;
    
    /**
     * @Class: TestRedisLock
     * @Description:
     * @Author: Jerry(姜源)
     * @Create: 21/02/18 11:04
     */
    @RestController
    @RequestMapping("api/redislock")
    public class TestEeLock {
        @Autowired
        private RedisService redisService;
    
        @RedisLock(key = "REDISLOCK_TEST")
        @GetMapping("test")
        public String test() {
            return UUID.randomUUID().toString();
        }
    
        @PostMapping("testlock1")
        @RedisLock(key = "#args[1]")
        public String testLock1(Userinfo userinfo, String testKey) {
            System.out.println("[分布式锁]测试1：" + userinfo.getName());
            return userinfo.getName();
        }
    
        @PostMapping("testlock2")
        @RedisLock(key = "#args[0].getName")
        public String testLock2(Userinfo userinfo, String testKey) {
            System.out.println("[分布式锁]测试2：" + userinfo.getName());
            return userinfo.getName();
        }
    }
    ```

test：

![image-20210218120720289](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210218120721.png)

testlock1:

![image-20210218120144483](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210218120145.png)

![image-20210218120240627](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210218120241.png)

testlock2:

![image-20210218120526392](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210218120527.png)





