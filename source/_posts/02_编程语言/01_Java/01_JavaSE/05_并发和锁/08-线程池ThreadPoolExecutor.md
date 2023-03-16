---
title: 08-线程池ThreadPoolExecutor
date: 2020-03-17 16:32:14
tags:
- JavaSE
- 线程池
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 05_并发和锁
---



参考资料(阿里巴巴java开发手册嵩山版): https://developer.aliyun.com/topic/java20

参考资料：https://blog.csdn.net/ming1215919/article/details/114799184



### 线程池

线程池的工作主要是控制运行的线程的数量，处理过程中将任务放入队列，然后在线程创建后启动这些任务，如果线程数量超过了最大数量，那么超出数量的线程排队等候，等其他线程执行完毕再从队列中取出任务来执行。

在开发过程中，合理地使用线程池能够带来3个好处：

* **降低资源消耗。**通过重复利用已创建的线程降低线程创建和销毁造成的消耗；

* **提高响应速度。**当任务到达时，任务可以不需要等到线程创建就能立即执行；

* **提高线程的可管理性。**线程是稀缺资源，如果无限制地创建，不仅会消耗系统资源，还会降低系统的稳定性，使用线程池可以进行统一分配、调优和监控。

原理：

![image-20220320092357084](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220320092358.png)

整个过程就像下面这个有趣的动画：

![d38d89315298edf89732cd931ad145b9](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316140045.gif)

> ![image-20200818082017332](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200818082018.png)
>
> OOM: Out Of Memory.

#### ThreadPoolExecutor

![image-20200818081923059](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200818081924.png)

![image-20200818081943000](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200818081944.png)

![image-20220320092924604](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220320092926.png)

> 参数 6 threadFactory 和 7 handler 为可选参数，有其默认值。

1）`corePoolSize`：线程池的核心线程数，定义了最小可以同时运行的线程数量。

2）`maximumPoolSize`：线程池的最大线程数。方队列中存放的任务达到队列容量时，房前可以同时运行的线程数量变为最大线程数。

3）`keepAliveTime`：当线程池中的线程数量大于corePoolSize时，如果没有新任务提交，核心线程外的线程不会立即销毁，而是会等待，直到等待的时间超过了KeepAliveTime才会被回收销毁。

4）`unit`：keepAliveTime参数的时间单位，包括DAYS、HOURS、MINUTES、MILLISECONDS等。

5）`workQueue`：用于保存等待执行任务的阻塞队列。可以选择以下集个阻塞队列：

* **ArrayBlockingQueue**：是一个基于[数组结构]()的阻塞队列，此队列按FIFO原则对元素进行排序；
* **LinkedBlockingQueue**：是一个基于[链表结构]()的阻塞队列，此队列按FIFO排序元素，吞吐量通常高于ArrayBlockingQueue。静态工厂方法Executors.newFixedThreadPool()使用了这个队列。
* **SynchronousQueue**：一个[不存储元素]()的阻塞队列。每个插入操作必须等到另一个线程调用移除操作，否则插入操作一直处于阻塞状态，吞吐量常高于LinkedBlockingQueue，静态工厂方法Executors.newCachedThreadPool()使用了这个队列。
* **PriorityBlockingQueue**：一个具有[优先级的无限]()阻塞队列。

6）`threadFactory`：用于设置创建线程的工厂，可以通过工厂给每个创造出来的线程设置更有意义的名字。使用开源框架guava提供的ThreadFactoryBuilder可以快速给线程池里的线程设置有意义的名字：

```java
//使用guava设置线程池名字
new ThreadFactoryBuilder().setNameFormat("XX-task-%d").build(),
//或使用的是 new ThreadFactory(), 精简为lambda表达式
r -> new Thread(r, "XX_Thread_" + r.hashCode()),
```

7）`handler`：饱和策略。若当前同时运行的线程数量达到最大线程数量并且队列已经被放满，ThreadPoolExecutor定义了一些饱和策略：

* **ThreadPoolExecutor.AbortPolicy**：直接抛出RejectedExecutionException异常来[拒绝处理]()新任务；
* **ThreadPoolExecutor.CallerRunsPolicy**：只用[调用者所在的线程来运行]()任务，会降低新任务的提交速度，影响程序的整体性能。
* **ThreadPoolExecutor.DiscardPolicy**：不处理新任务，直接[丢弃]()掉。
* **ThreadPoolExecutor.DiscardOldestPolicy**：[丢弃队列中最近]()的一个任务，执行当前任务。



####  原理

ThreadPoolExecutor执行execute()方法原理：

![image-20220320092514228](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220320092515.png)

#### 使用

1. 向线程池提交任务

* **execute()方法用于像线程池提交不需要返回值的任务**
  所以无法判断任务是否被线程池执行成功。

```java
executor.execute(new Runnable() {
    @Override public void run() {
        // TODO 
    }
});
```

* **submit()方法用于提交需要返回值的任务。**
  线程池会返回一个future类型的对象，通过这个future对象可以判断任务是否执行成功，并且可以通过future的get()方法获取返回值，get()方法会阻塞当前线程直到任务完成，而使用get(long timeout, TimeUnit unit)方法则会阻塞当前线程一段时间后立即返回，这时有可能任务还没有执行完。

```java
Future<T> future = executor.submit(hasReturnValueTask);
try {
    T s = future.get();
} catch (InterruptedExecption | ExecutortionExcception e) {
    // 处理异常
    e.printStackTrace();
} finally {
    // 关闭线程池
    executor.shutdown();
}
```



2. 关闭线程池

可以使用线程池的`shutdown`或shutdownNow方法来关闭线程池。其原理在于遍历线程池中的工作线程，然后逐个调用线程的interrupt方法来中断线程，所以无法响应中断的任务可能无法终止。

二者区别在于：shutdownNow方法首先将线程池状态设置为STOP，然后尝试停止所有正在执行或暂停任务的线程，并返回等到执行任务的列表，而shutdown只是将线程池的状态设置为SHUTDOWN状态，然后中断所有没有整在执行任务的线程。

3. 合理配置线程池

查看当前设备的CPU核数：

```
Runtime.getRuntime().availableProcessors();
```

![image-20220320094550957](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220320094552.png)

* CPU密集型任务
  任务需要大量的运算，而没有阻塞，CPU一直全速运行。CPU密集型任务配置尽可能的少的线程数量。
  公式：`CPU核数 + 1` 个线程的线程池。
* IO密集型任务
  数据库交互，文件上传下载，网络传输等。
  方法一：由于IO密集型任务线程并不是一直在执行任务，可以多分配一点线程数，如`CPU核数*2`。
  方法二：任务需要大量的IO，即大量的阻塞。在单线程上运IO密集型的任务会导致浪费大量的CPU运算能力浪费在等待。所以在IO密集型任务中使用多线程可以大大的加速程序运行，即使在单核CPU上，这种加速主要就是利用了被浪费掉的阻塞时间。
  公式：`CPU核数/(1-阻塞系数)`，其中阻塞系数在0.8-0.9之间(比如8核CPU：8/(1 - 0．9)=80个线程数)。

> 《Java并发编程实战》的作者 Brain Goetz 推荐的计算方法：
>
> * 线程数 = `CPU核数*(1+平均等待时间/平均工作时间)`



### ThreadPoolTaskExecutor

参考资料: [Java ThreadPoolTaskExecutor.setQueueCapacity方法代码示例](https://vimsky.com/examples/detail/java-method-org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor.setQueueCapacity.html)

```java
@Configuration
@EnableAsync
public class ThreadPoolTaskConfig {

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
    // 查询用户和当前人的好友关系
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