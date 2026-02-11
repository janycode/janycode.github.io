---
title: 03-ThreadPoolTaskConfig
date: 2020-03-17 17:34:32
tags:
- JavaSE
- 线程池
- 配置类
categories: 
- 21_代码片段
- 02_配置类
---

### 异步处理器Service

```java
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.concurrent.BasicThreadFactory;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.stereotype.Service;
import java.util.concurrent.*;

@Slf4j
@Service
public class AsyncHandlerService {

    public final static int THREAD_MAX_NUM = 60;

    /**
     * 执行异步任务的线程池
     */
    private final ExecutorService executorService = new ThreadPoolExecutor(
            THREAD_MAX_NUM / 2,
            THREAD_MAX_NUM,
            10,
            TimeUnit.SECONDS,
            //阻塞队列的大小需要显式指定，要不然防止内存堆积导致fgc
            new LinkedBlockingQueue<>(10240),
            new BasicThreadFactory.Builder().namingPattern("AsyncHandlerService-thread-%d").daemon(true).build()
    );

    public void submit(Runnable runnable) {
        Callable<Integer> callable = () -> {
            runnable.run();
            return 1;
        };
        Future<?> future = executorService.submit(callable);
        //异常的捕获必须要一个异步线程中去进行，否则 future.get 会阻塞，失去了异步性。
        executorService.submit(() -> {
            try {
                future.get();
            } catch (Throwable throwable) {
                log.error("执行异步任务出错{}", ExceptionUtils.getRootCauseMessage(throwable), throwable);
            }
        });
    }
}
```



### ThreadPoolExecutor

核心参数详解: https://juejin.cn/post/6987576686472593415

```java
@Configuration
@Slf4j
public class ThreadPoolConfig {

    @Bean(value = "executorService")
    public ThreadPoolExecutor threadPoolExecutor() {
        int cpus = Runtime.getRuntime().availableProcessors();
        return new ThreadPoolExecutor(
                cpus * 5,                         //核心线程大小
                cpus * 10,                        //最大线程大小
                30L,                              //允许线程的空闲时间
                TimeUnit.SECONDS,                 //单位：秒
                new LinkedBlockingQueue<>(100),   //缓冲队列最大容量
                new CustomThreadFactory(),        //线程工厂,Executors.defaultThreadFactory()
                new CommAbortPolicy()             //拒绝策略
        );          
    }
    
    /**
     * 拒绝策略：中止线程往线程池提交
     */
    static class CommAbortPolicy implements RejectedExecutionHandler {
        @Override
        public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
            String message = executor.toString();
            log.error("线程池已满，无法继续处理任务：{}", message);
        }
    }

    /**
     * 自定义线程工厂
     */
    static class CustomThreadFactory implements ThreadFactory {
        public Thread newThread(Runnable r) {
            int hashCode = r.hashCode();
            log.info("线程 " + hashCode + " 创建");
            return new Thread(r, "threadPool-" + hashCode);
        }
    }
}
```

使用方式：

```java
    @Autowired
    private ThreadPoolExecutor executorService;

    public void xxxAsyncHandle() {
        CompletableFuture.runAsync(() -> {
            //TODO
        }, executorService);
    }
```



### ThreadPoolTaskExecutor

参考资料: [Java ThreadPoolTaskExecutor 配置类代码多种场景示例](https://vimsky.com/examples/detail/java-method-org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor.setQueueCapacity.html)

> 从ThreadPoolTaskExecutor的唯一带参构造方法可以看出，实际上在底层依然依赖ThreadPoolExecutor本身，也就是说该工具更关注于扩展的内容，执行任务依然交由ThreadPoolExecutor去处理。

#### ① 将参数配置到配置文件中

application.yml

```yml
#线程池配置
thread:
  pool:
    #核心线程数
    core-pool-size: 50
    #最大线程数
    max-pool-size: 200
    #工作队列容量
    queue-capacity: 1000
    #线程池维护线程所允许的空闲时间
    keep-alive-seconds: 300
    #拒绝策略
    rejected-execution-handler: AbortPolicyWithReport
```

```java
import cn.hutool.log.Log;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;

import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadPoolExecutor;

@Data
@Component
@ConfigurationProperties(prefix = "thread.pool")
public class ThreadPoolConfig {

    /**
     * 核心线程数
     */
    private int corePoolSize;
    /**
     * 最大线程数
     */
    private int maxPoolSize;
    /**
     * 工作队列容量
     */
    private int queueCapacity;
    /**
     * 线程池维护线程所允许的空闲时间(秒)
     */
    private int keepAliveSeconds;
    /**
     * 拒绝策略
     */
    private String rejectedExecutionHandler;

    @Bean("threadPoolTaskExecutor")
    public ThreadPoolTaskExecutor threadPoolTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        //核心线程数
        executor.setCorePoolSize(this.corePoolSize);
        //最大线程数
        executor.setMaxPoolSize(this.maxPoolSize);
        //缓冲队列最大容量
        executor.setQueueCapacity(this.queueCapacity);
        //允许线程的空闲时间
        executor.setKeepAliveSeconds(this.keepAliveSeconds);
        //线程工厂
        executor.setThreadFactory(r -> {
            Log log = Log.get();
            int hashCode = r.hashCode();
            log.info("线程 " + hashCode + " 创建。");
            return new Thread(r, "threadPool-" + hashCode);
        });
        //拒绝策略
        try {
            //反射加载类
            Class<?> clazz = Class.forName("java.util.concurrent.ThreadPoolExecutor$" + this.rejectedExecutionHandler);
            executor.setRejectedExecutionHandler((RejectedExecutionHandler) clazz.newInstance());
        } catch (ClassNotFoundException | IllegalAccessException | InstantiationException e) {
            e.printStackTrace();
            //默认使用CallerRunsPolicy策略：直接在execute方法的调用线程中运行被拒绝的任务
            executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        }
        return executor;
    }
}
```



#### ② 将参数放代码里

```java
@Configuration
public class ThreadPoolConfig {

    /**
     * 当前机器的核数
     */
    private static final int CPU_NUM = Runtime.getRuntime().availableProcessors();
    private static final int KEEP_ALIVE_TIME = 10;
    private static final int QUEUE_CAPACITY = 100;
    private static final int AWAIT_TERMINATION = 60;
    private static final String THREAD_NAME_PREFIX = "XXX-THREAD-";

    @Bean("threadPoolTaskExecutor")
    public ThreadPoolTaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor taskExecutor = new ThreadPoolTaskExecutor();
        //核心线程大小
        taskExecutor.setCorePoolSize(CPU_NUM);
        //最大线程大小
        taskExecutor.setMaxPoolSize(CPU_NUM * 2 + 1);
        //允许线程的空闲时间(秒)：当超过了核心线程出之外的线程在空闲时间到达之后会被销毁
        taskExecutor.setKeepAliveSeconds(KEEP_ALIVE_TIME);
        //缓冲队列最大容量，QueueCapacity默认值是: Integer.MAX_VALUE (可查看上述参考资料)
        taskExecutor.setQueueCapacity(QUEUE_CAPACITY);
        //设置线程池关闭的时候等待所有任务都完成再继续销毁其他的Bean, 默认值为“false”
        taskExecutor.setWaitForTasksToCompleteOnShutdown(true);
        //设置true时线程池中corePoolSize线程空闲时间达到keepAliveTime也将关闭
        taskExecutor.setAllowCoreThreadTimeOut(true);
        //线程池中任务的等待时间，如果超过这个时候还没有销毁就强制销毁
        taskExecutor.setAwaitTerminationSeconds(AWAIT_TERMINATION);
        //eg: CallerRunsPolicy只用调用者所在的线程来运行任务，会降低新任务的提交速度，影响程序的整体性能。
        taskExecutor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        //线程池名的前缀：设置好了之后可以方便定位处理任务所在的线程池
        taskExecutor.setThreadNamePrefix(THREAD_NAME_PREFIX);
        //手动创建线程池实例
        taskExecutor.initialize();
        return taskExecutor;
    }
}
```

```java
//使用方式一：注入、调用方法
@Autowired
private ThreadPoolTaskExecutor threadPoolTaskExecutor;
...
Future<Result<XxxDTO>> xxxDTOFuture = threadPoolTaskExecutor.submit(() -> {
    //TODO
    return 方法调用;
});
Result<XxxDTO> xxxDTOResult =  xxxDTOFuture.get();

//使用方式二：注解  依赖注解@EnableAsync --参考SpringBoot异步任务
@Async("threadPoolTaskExecutor")
public XXX method() {
    //TODO
}
```

测试调用：

![image-20220324221640949](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220324221642.png)

![image-20220324221655243](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220324221656.png)