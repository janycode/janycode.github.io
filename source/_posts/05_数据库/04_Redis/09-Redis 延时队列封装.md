---
title: 09-Redis 延时队列封装
date: 2023-11-13 18:01:22
tags:
- redis
- 延时队列
categories:
- 05_数据库
- 04_Redis
---



### RedisDelayQueueUtil

依赖：

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        <dependency>
            <groupId>org.redisson</groupId>
            <artifactId>redisson-spring-boot-starter</artifactId>
            <version>3.19.3</version>
        </dependency>
        <dependency>
            <groupId>org.redisson</groupId>
            <artifactId>redisson-spring-data-23</artifactId>
            <version>3.19.3</version>
        </dependency>
```



实现：

```java
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.thread.ThreadUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.Iterator;
import java.util.Set;

/**
 * redis延迟队列工具类
 *
 * @author Jerry(姜源)
 * @date 2023/11/13 17:41
 */
@Slf4j
@Component
@SuppressWarnings("all")
public class RedisDelayQueueUtil {

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    /**
     * 队列名称
     */
    public static final String REDIS_DELAY_QUEUE = "redisDelayQueue";

    /**
     * 设置延时任务
     *
     * @param msg       消息
     * @param delayTime 延时时间,距离当前时间的时间间隔(单位:毫秒)
     * @author Jerry(姜源)
     * @date 2023/11/13 16:26
     */
    public void setDelayTask(Object msg, int delayTime) {
        long expireTime = System.currentTimeMillis() + delayTime * 1000L;
        Boolean addFlag = redisTemplate.opsForZSet().add(REDIS_DELAY_QUEUE, JSONUtil.toJsonStr(msg), expireTime);
        if (Boolean.TRUE.equals(addFlag)) {
            //TODO 记录状态等...
            log.info("redis 延时消息创建成功: msg={}, expireTime={}", msg, DateUtil.date(expireTime));
        }
    }

    /**
     * 消费延时队列 - 方式一
     *
     * @author Jerry(姜源)
     * @date 2023/11/13 16:26
     */
    @PostConstruct
    public void consumeDelayTask1() {
        log.info("redis 延时队列扫描已启动.....");
        ThreadUtil.newSingleExecutor().execute(() -> {
            while (true) {
                Set<String> set = redisTemplate.opsForZSet().rangeByScore(REDIS_DELAY_QUEUE, 0, System.currentTimeMillis(), 0L, 1L);
                // 如果没有需要消费的消息,则间隔一段时间再扫描
                if (CollUtil.isEmpty(set)) {
                    try {
                        Thread.sleep(1000L);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    continue;
                }
                String msgStr = set.iterator().next();
                Long remove = redisTemplate.opsForZSet().remove(REDIS_DELAY_QUEUE, msgStr);
                if (remove > 0) {
                    //TODO 将 msgStr 转化为 Msg 对象
                    //JSONUtil.toBean(msgStr, Msg.class);
                    //TODO 消费消息逻辑
                    log.info("redis 延时消息已成功消费：{}", msgStr);
                }
            }
        });
    }

    /**
     * 消费延时队列 - 方式二
     * <br> 需依赖 spring-boot-starter-quartz 包
     * <br> 启动类 @EnableScheduling 加注解
     *
     * @author Jerry(姜源)
     * @date 2023/11/14 09:26
     */
    @Scheduled(cron = "* * * * * ?")
    public void consumeDelayTask2() {
        //取出QUEUENAME集合中的score在0-当前时间戳这个范围的所有值
        Set<String> set = redisTemplate.opsForZSet().rangeByScore(REDIS_DELAY_QUEUE, 0, System.currentTimeMillis());
        Iterator<String> iterator = set.iterator();
        while (iterator.hasNext()) {
            String msg = iterator.next();
            //遍历取出每一个score
            Double score = redisTemplate.opsForZSet().score(REDIS_DELAY_QUEUE, msg);
            //达到了时间就进行消费
            if (System.currentTimeMillis() > score) {
                System.out.println("消费了：" + msg + "消费时间为：" + DateUtil.now());
                redisTemplate.opsForZSet().remove(REDIS_DELAY_QUEUE, msg);
            }
        }
    }

}
```

### 第一种方式：

#### 优点：

1. 使用单独的线程进行轮询扫描，能够及时消费到达时间的延时任务，不会受到定时任务调度的限制。
2. 适用于简单的消费逻辑，消费任务的处理逻辑在同一个线程中执行，可以方便地进行错误处理和日志记录。

#### 缺点：

1. 使用自定义的线程轮询扫描，可能会导致资源浪费，特别是在没有延时任务需要消费时，会导致线程空转浪费CPU资源。
2. 对于大规模的延时任务队列，线程轮询扫描可能会导致性能问题，因为扫描的时间间隔是固定的，无法根据实际情况动态调整。

### 第二种方式：

#### 优点：

1. 基于Spring的定时任务框架，使用`@Scheduled`注解可以方便地进行任务调度，不需要手动管理线程。
2. 可以利用Spring的特性，方便集成到Spring Boot项目中，无需额外的线程管理和资源消耗。

#### 缺点：

1. 受限于定时任务框架的调度机制，可能无法及时准确地消费到达时间的延时任务，特别是在任务调度频率较低的情况下。
2. 对于复杂的消费逻辑，可能需要考虑任务调度并发执行、错误处理、日志记录等方面的问题。

### 总结：

第一种方式适合简单的延时任务消费逻辑，并且对资源消耗要求较高的场景，但可能存在资源浪费和性能问题；第二种方式适合集成到Spring Boot项目中，可以利用Spring的特性进行任务调度，但可能无法及时准确地消费到达时间的延时任务，特别是在任务调度频率较低的情况下。

根据实际场景和需求，可以根据优缺点选择合适的方式来实现延时消息队列。
