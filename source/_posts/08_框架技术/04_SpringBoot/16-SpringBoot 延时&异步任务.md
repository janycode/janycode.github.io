---
title: 16_SpringBoot 延时&异步任务
date: 2022-03-20 11:26:52
tags:
- SpringBoot
- 异步
- 延时
categories: 
- 08_框架技术
- 04_SpringBoot
---

![image-20200708160944615](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708160946.png)

### 1. 延时任务

JDK 原型单点延时或定时任务：自从JDK1.5之后，提供了`ScheduledExecutorService`代替TimerTask来执行`延时`或**定时**任务，提供了不错的可靠性。

```java
public class ScheduledExecutorTest {
    public static void main(String[] args) {
        //创建线程池任务，共 1 个线程
        ScheduledExecutorService scheduledExecutor = Executors.newScheduledThreadPool(1);
        //延时任务：5秒 后开始执行
        scheduledExecutor.schedule(() -> {
            System.out.println("线程执行任务：" + Thread.currentThread().getName());
        }, 5, TimeUnit.SECONDS);
        scheduledExecutor.shutdown();
        System.out.println("主线程结束: " + Thread.currentThread().getName());

        //定时任务: 5秒 后开始执行，每 2秒 执行一次
        //scheduledExecutorService.scheduleAtFixedRate(() -> {
        //    System.out.println("执行任务：" + new Date());
        //}, 5, 2, TimeUnit.SECONDS);
    }
}
```

![image-20220320111732475](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220320111733.png)

```java
public ScheduledFuture<?> schedule(
	Runnable command,	//线程任务
    long delay,      	//延时时间
    TimeUnit unit    	//时间单位
);
```



### 2. 异步任务

#### 2.1 编写异步任务类

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class AsyncTask {
    private static final Logger LOGGER = LoggerFactory.getLogger(AsyncTask.class) ;
    
    /*
     * 结果输出：
     * [ asyncTask1-2] com.xxx.AsyncTask : ======异步任务结束1======
     * [ asyncTask1-1] com.xxx.AsyncTask : ======异步任务结束0======
     */
    // 只配置了一个 asyncExecutor1，@Async中不指定线程池Bean也会默认使用
    @Async
    public void asyncTask0 () {
        try{
            Thread.sleep(5000);
        }catch (Exception e){
            e.printStackTrace();
        }
        LOGGER.info("======异步任务结束0======");
    }
    
    @Async("asyncExecutor1")
    public void asyncTask1 () {
        try{
            Thread.sleep(5000);
        }catch (Exception e){
            e.printStackTrace();
        }
        LOGGER.info("======异步任务结束1======");
    }
}
```

#### 2.2 指定异步任务执行的线程池

这里可以不指定，指定执行的线程池，可以更加方便的监控和管理异步任务的执行。

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * 定义异步任务执行的线程池
 */
@Configuration
public class TaskPoolConfig {
    @Bean("asyncExecutor1")
    public Executor taskExecutor1 () {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        //核心线程数10：线程池创建时候初始化的线程数
        executor.setCorePoolSize(10);
        //最大线程数20：线程池最大的线程数，只有在缓冲队列满了之后才会申请超过核心线程数的线程
        executor.setMaxPoolSize(20);
        //缓冲队列200：用来缓冲执行任务的队列
        executor.setQueueCapacity(200);
        //允许线程的空闲时间60秒：当超过了核心线程出之外的线程在空闲时间到达之后会被销毁
        executor.setKeepAliveSeconds(60);
        //线程池名的前缀：设置好了之后可以方便定位处理任务所在的线程池
        executor.setThreadNamePrefix("asyncTask1-");
        /*
        线程池对拒绝任务的处理策略：这里采用了CallerRunsPolicy策略，
        当线程池没有处理能力的时候，该策略会直接在 execute 方法的调用线程中运行被拒绝的任务；
        如果执行程序已关闭，则会丢弃该任务
         */
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        //设置线程池关闭的时候等待所有任务都完成再继续销毁其他的Bean
        executor.setWaitForTasksToCompleteOnShutdown(true);
        //设置线程池中任务的等待时间，如果超过这个时候还没有销毁就强制销毁
        //以确保应用最后能够被关闭，而不是阻塞住。
        executor.setAwaitTerminationSeconds(600);
        return executor;
    }
}
```

#### 2.3 启动类添加异步注解

```java
@EnableAsync        //启用异步任务
@SpringBootApplication
public class TaskApplication {
    public static void main(String[] args) {
        SpringApplication.run(TaskApplication.class,args) ;
    }
}
```

#### 2.4 异步调用的测试接口

```java
@RestController
public class TaskController {
    
    @Resource
    private AsyncTask asyncTask ;
    
    @RequestMapping("/asyncTask")
    public String asyncTask (){
        asyncTask.asyncTask0();
        asyncTask.asyncTask1();
        return "success" ;
    }
}
```