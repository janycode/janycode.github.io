---
title: 05-ThreadLocal源码与内存泄漏分析
date: 2022-01-27 10:02:02
tags:
- 源码分析
- 线程
- 线程池
- ThreadPool
categories: 
- 18_源码分析
---



参考资料：[ThreadPoolExecutor的实现原理](https://xie.infoq.cn/link?target=https%3A%2F%2Fwww.cnblogs.com%2Fthrowable%2Fp%2F13574306.html)



## 为什么需要线程池

我们知道创建线程的常用方式就是 `new Thread()`，而每一次`new Thread()`都会重新创建一个线程，而线程的创建和销毁都需要耗时的，不仅会消耗系统资源，还会降低系统的稳定性。在 jdk1.5 的 JUC 包中有一个 Executors，他能使我们创建的线程得到复用，不会频繁的创建和销毁线程。

线程池首先创建一些线程，它们的集合称为线程池。使用线程池可以很好地提高性能，线程池在系统启动时即创建大量空闲的线程，程序将一个任务传给线程池，线程池就会启动一条线程来执行这个任务，执行结束以后，该线程并不会死亡，而是再次返回线程池中成为空闲状态，等待执行下一个任务。

先不管它到底是个啥，先看看使用线程池和`new Thread()`的耗时情况：

```java
public class ThreadPoolTest {

    static CountDownLatch latch = new CountDownLatch(100000);
    static ExecutorService es = Executors.newFixedThreadPool(4);

    public static void main(String[] args) throws InterruptedException {

        long timeStart = System.currentTimeMillis();

        for (int i = 0; i < 100000; i++) {
            newThread();
            //executors();
        }
        latch.await();
        System.out.println(System.currentTimeMillis() - timeStart);
        es.shutdown();
    }

    /**
     * 使用线程池
     */
    public static void executors() {
        es.submit(() -> {
            latch.countDown();
        });
    }

    /**
     * 直接new
     */
    public static void newThread() {
        new Thread(() -> {
            latch.countDown();
        }).start();
    }
}
```

对于 10 万个线程同时跑，如果使用 new 的方式耗时：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241227100740.png)



使用线程池耗时：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241227100744.png)



总得来说，合理的使用线程池可以带来以下几个好处：

1. **降低资源消耗**。通过重复利用已创建的线程，降低线程创建和销毁造成的消耗。
2. **提高响应速度**。当任务到达时，任务可以不需要等到线程创建就能立即执行。
3. **增加线程的可管理性**。线程是稀缺资源，使用线程池可以进行统一分配，调优和监控。

## 线程池设计思路

我们先了解线程池的思路，哪怕你重来没了解过什么是线程池，所以不会一上来就给你讲一堆线程池的参数。我尝试多种想法来解释它的设计思路，但都过于官方，但在查找资料的时候在博客上看到了非常通俗易懂的描述，它是这样描述的，先假想一个工厂的生产流程：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241227100758.png)

工厂中有固定的一批工人，称为正式工人，工厂接收的订单由这些工人去完成。当订单增加，正式工人已经忙不过来了，工厂会将生产原料暂时堆积在仓库中，等有空闲的工人时再处理（因为工人空闲了也不会主动处理仓库中的生产任务，所以需要调度员实时调度）。仓库堆积满了后，订单还在增加怎么办？工厂只能临时扩招一批工人来应对生产高峰，而这批工人高峰结束后是要清退的，所以称为临时工。当时临时工也以招满后（受限于工位限制，临时工数量有上限），后面的订单只能忍痛拒绝了。

和线程池的映射如下：

- 工厂——线程池
- 订单——任务（Runnable）
- 正式工人——核心线程
- 临时工——普通线程
- 仓库——任务队列
- 调度员——getTask()

> getTask()是一个方法，将任务队列中的任务调度给空闲线程，源码分析再去了解。

映射后，形成线程池流程图如下：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241227100835.png)



## 线程池的工作机制

了解了线程池设计思路，我们可以总结一下线程池的工作机制：

在线程池的编程模式下，任务是提交给整个线程池，而不是直接提交给某个线程，线程池在拿到任务后，**在内部寻找是否有空闲的线程**，如果有，则将任务交给某个空闲的线程。如果不存在空闲线程，即线程池中的线程数大于核心线程 **corePoolSize**，则将任务添加到任务队列中 **workQueue**，如果任务队列有界且满了之后则会判断线程池中的线程数是否大于最大线程数 **maximumPoolSize**，如果小于则会创建新的线程来执行任务，否则在没有空闲线程的情况下就会执行决绝策略 **handler**。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241227100936.png)



**注意**：线程池中刚开始没有线程，当一个任务提交给线程池后，线程池会创建一个新线程来执行任务。一个线程同时只能执行一个任务，但可以同时向一个线程池提交多个任务。

## 线程池的参数及使用

线程池的真正实现类是 **ThreadPoolExecutor**，类的集成关系如下：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241227101043.png)



**ThreadPoolExecutor** 的构造方法有几个，掌握最主要的即可，其中包含 7 个参数：

```java
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler)
```

- **corePoolSize**（必需），线程池中的核心线程数。
- 当提交一个任务时，线程池创建一个新线程执行任务，直到当前线程数等于 corePoolSize。
- 如果当前线程数小于 corePoolSize，此时存在**空闲线程**，提交的任务会创建一个新线程来执行该任务。
- 如果当前线程数等于 corePoolSize，则继续提交的任务被保存到阻塞队列中，等待被执行。
- 如果执行了线程池`prestartAllCoreThreads()`方法，线程池会提前创建并启动所有核心线程。
- **maximumPoolSize**（必需），线程池中允许的最大线程数。
- 当队列满了，且**已创建的线程数小于 maximumPoolSize**，则线程池会创建新的线程来执行任务。另外，对于无界队列，可忽略该参数。
- **keepAliveTime**（必需），线程存活保持时间。
- 当线程没有任务执行时，继续存活的时间。默认情况下，该参数只在线程数大于 corePoolSize 时才有用，即当非核心线程处于空闲状态的时间超过这个时间后，该线程将被回收。将`allowCoreThreadTimeOut`参数设置为`true`后，核心线程也会被回收。
- **unit**（必需），keepAliveTime 的时间单位。
- **workQueue**（必需），任务队列。
- 用于保存等待执行的任务的阻塞队列。workQueue 必须是 BlockingQueue 阻塞队列。当线程池中的线程数超过它的 corePoolSize 的时候，线程会进入阻塞队列进行阻塞等待。
- 一般来说，我们应该尽量使用有界队列，因为使用无界队列作为工作队列会对线程池带来如下影响。
- 当线程池中的线程数达到 corePoolSize 后，新任务将在无界队列中等待，因此线程池中的线程数不会超过 corePoolSize。
- 由于 1，使用无界队列时 maximumPoolSize 将是一个无效参数。
- 由于 1 和 2，使用无界队列时 keepAliveTime 将是一个无效参数。
- 更重要的，使用无界 queue 可能会耗尽系统资源，有界队列则有助于防止资源耗尽，同时即使使用有界队列，也要尽量控制队列的大小在一个合适的范围。一般使用，`ArrayBlockingQueue`、`LinkedBlockingQueue`、 `SynchronousQueue`、`PriorityBlockingQueue`等。
- **threadFactory**（可选），创建线程的工厂。
- 通过自定义的线程工厂可以给每个新建的线程设置一个具有识别度的**线程名**，threadFactory 创建的线程也是采用 `new Thread()` 方式，threadFactory 创建的线程名都具有统一的风格：`pool-m-thread-n`（m 为线程池的编号，n 为线程池内的线程编号）。
- **handler**（可选），线程饱和策略。
- 当阻塞队列满了，且没有空闲的工作线程，如果继续提交任务，必须采取一种策略处理该任务，线程池提供了 四种策略：
- **AbortPolicy**，直接抛出异常，默认策略。
- **CallerRunsPolicy**，用调用者所在的线程来执行任务。
- **DiscardOldestPolicy**，丢弃阻塞队列中靠最前的任务，并执行当前任务。
- **DiscardPolicy**，直接丢弃任务。
- 当然也可以根据应用场景实现 `RejectedExecutionHandler` 接口，自定义饱和策略，如记录日志或持久化存储不能处理的任务。

### 线程池的状态

ThreadPoolExecutor 使用 int 的高 3 位来表示线程池状态，低 29 位表示线程数量：

源码如下：

```java
private final AtomicInteger ctl = new AtomicInteger(ctlOf(RUNNING, 0));
private static final int COUNT_BITS = Integer.SIZE - 3;//29
private static final int CAPACITY   = (1 << COUNT_BITS) - 1;//约5亿
// runState is stored in the high-order bits
private static final int RUNNING    = -1 << COUNT_BITS;
private static final int SHUTDOWN   =  0 << COUNT_BITS;
private static final int STOP       =  1 << COUNT_BITS;
private static final int TIDYING    =  2 << COUNT_BITS;
private static final int TERMINATED =  3 << COUNT_BITS;
```

至于为什么这么设计，我觉得主要原因是为了避免额外的开销，如果使用 2 个变量来分别表示状态和线程数量，为了保证原子性必须进行额外的加锁操作，而 ctl 则通过原子类就解决了该问题，在通过位运算就能得到状态和线程数量。

### 提交任务

可以使用两个方法向线程池提交任务，分别为`execute()`和`submit()`方法。

- **execute()**，用于提交不需要返回值的任务，所以无法判断任务是否被线程池执行成功。
- **submit()**，用于提交需要返回值的任务。线程池会返回一个 future 类型的对象，通过这个 future 对象可以判断任务是否执行成功，并且可以通过 future 的 `get()`方法来获取返回值，`get()`方法会阻塞当前线程直到任务完成，而使用 `get(long timeout，TimeUnit unit)`方法则会阻塞当前线程一段时间后立即返回，这 时候有可能任务没有执行完。

此外，**ExecutorService** 还提供了两个提交任务的方法，`invokeAny()`和`invokeAll()`。

- **invokeAny()**，提交所有任务，哪个任务先成功执行完毕，返回此任务执行结果，其它任务取消。
- **invokeAll()**，提交所有的任务且必须全部执行完成。

### corePoolSize 和 maximumPoolSize

测试核心线程数为 1 ，最大线程数为 2，任务队列为 1。

```java
@Slf4j(topic = "ayue")
public class ThreadExecutorPoolTest1 {

    public static void main(String[] args) {
        ThreadPoolExecutor executor = 
            new ThreadPoolExecutor(1, 2, 3, TimeUnit.SECONDS, new ArrayBlockingQueue<>(1));
        for (int i = 1; i < 4; i++) {
            //执行任务
            executor.execute(new MyTask(i));
        }
    }

    //任务
    static class MyTask implements Runnable {

        private int taskNum;

        public MyTask(int num) {
            this.taskNum = num;
        }

        @Override
        public void run() {
            log.debug("线程名称：{},正在执行task：{}", Thread.currentThread().getName(), taskNum);
            try {
                //模拟其他操作
                Thread.currentThread().sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            log.debug("task{}执行完毕", taskNum);
        }
    }
}
```

输出：

```java
11:07:04.377 [pool-1-thread-2] DEBUG ayue - 线程名称：pool-1-thread-2,正在执行task：3
11:07:04.377 [pool-1-thread-1] DEBUG ayue - 线程名称：pool-1-thread-1,正在执行task：1
11:07:05.384 [pool-1-thread-2] DEBUG ayue - task3执行完毕
11:07:05.384 [pool-1-thread-1] DEBUG ayue - task1执行完毕
11:07:05.384 [pool-1-thread-2] DEBUG ayue - 线程名称：pool-1-thread-2,正在执行task：2
11:07:06.397 [pool-1-thread-2] DEBUG ayue - task2执行完毕
```

当有 3 个线程通过线程池执行任务时，由于核心线程只有一个，且任务队列为 1，所以当第 3 个线程到来的时候， 会重新开启一个新的线程`pool-1-thread-2`来执行任务。

当然，这里可能有人问核心线程会不会大于最大线程？当然不会，如果`corePoolSize > maximumPoolSize`，则程序启动会直接报错。

### 任务队列

任务队列是基于阻塞队列实现的，即采用生产者消费者模式，在 Java 中需要实现 **BlockingQueue** 接口。但 Java 已经为我们提供了 7 种阻塞队列的实现：

1. **ArrayBlockingQueue**：一个由数组结构组成的有界阻塞队列。
2. **LinkedBlockingQueue**： 一个由链表结构组成的有界阻塞队列，在未指明容量时，容量默认为 `Integer.MAX_VALUE`。
3. **PriorityBlockingQueue**： 一个支持优先级排序的无界阻塞队列，对元素没有要求，可以实现 Comparable 接口也可以提供 Comparator 来对队列中的元素进行比较。跟时间没有任何关系，仅仅是**按照优先级取任务**。
4. **DelayQueue**：类似于 PriorityBlockingQueue，是二叉堆实现的无界优先级阻塞队列。要求元素都实现 Delayed 接口，通过执行时延从队列中提取任务，时间没到任务取不出来。
5. **SynchronousQueue**： 一个不存储元素的阻塞队列，消费者线程调用 `take()` 方法的时候就会发生阻塞，直到有一个生产者线程生产了一个元素，消费者线程就可以拿到这个元素并返回；生产者线程调用 `put()` 方法的时候也会发生阻塞，直到有一个消费者线程消费了一个元素，生产者才会返回。
6. **LinkedBlockingDeque**： 使用双向队列实现的有界双端阻塞队列。双端意味着可以像普通队列一样 FIFO（先进先出），也可以像栈一样 FILO（先进后出）。
7. **LinkedTransferQueue**： 它是 ConcurrentLinkedQueue、LinkedBlockingQueue 和 SynchronousQueue 的结合体，但是把它用在 ThreadPoolExecutor 中，和 LinkedBlockingQueue 行为一致，但是是无界的阻塞队列。

### 线程工厂

线程工厂默认创建的线程名：`pool-m-thread-n`，在`Executors.defaultThreadFactory()`可以看到：

```java
static class DefaultThreadFactory implements ThreadFactory {
    private static final AtomicInteger poolNumber = new AtomicInteger(1);
    private final ThreadGroup group;
    private final AtomicInteger threadNumber = new AtomicInteger(1);
    private final String namePrefix;
    DefaultThreadFactory() {
        SecurityManager s = System.getSecurityManager();
        group = (s != null) ? s.getThreadGroup() :
                              Thread.currentThread().getThreadGroup();
        namePrefix = "pool-" + poolNumber.getAndIncrement() + "-thread-";
    }
    public Thread newThread(Runnable r) {
        //线程名：namePrefix + threadNumber.getAndIncrement()
        Thread t = new Thread(group, r, namePrefix + threadNumber.getAndIncrement(),0);
        if (t.isDaemon())
            t.setDaemon(false);
        if (t.getPriority() != Thread.NORM_PRIORITY)
            t.setPriority(Thread.NORM_PRIORITY);
        return t;
    }
}
```

我们也可以通过`ThreadPoolExecutor`自定义线程名：

```java
@Slf4j(topic = "ayue")
public class ThreadExecutorPoolTest1 {

    public static void main(String[] args) {
        //自增线程id
        AtomicInteger threadNumber = new AtomicInteger(1);
        ThreadPoolExecutor executor = new ThreadPoolExecutor(1, 2, 3, TimeUnit.SECONDS, new ArrayBlockingQueue<>(1), new ThreadFactory() {
            @Override
            public Thread newThread(Runnable r) {
                return new Thread(r, "javatv-" + threadNumber.getAndIncrement());
            }
        });
        for (int i = 1; i < 4; i++) {
            executor.execute(new MyTask(i));
        }
    }


    static class MyTask implements Runnable {

        private int taskNum;

        public MyTask(int num) {
            this.taskNum = num;
        }

        @Override
        public void run() {
            log.debug("线程名称：{},正在执行task：{}", Thread.currentThread().getName(), taskNum);
            try {
                //模拟其他操作
                Thread.currentThread().sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            log.debug("task{}执行完毕", taskNum);
        }
    }
}
```

输出：

```java
14:08:07.166 [javatv-1] DEBUG ayue - 线程名称：javatv-1,正在执行task：1
14:08:07.166 [javatv-2] DEBUG ayue - 线程名称：javatv-2,正在执行task：3
14:08:08.170 [javatv-1] DEBUG ayue - task1执行完毕
14:08:08.170 [javatv-2] DEBUG ayue - task3执行完毕
14:08:08.170 [javatv-1] DEBUG ayue - 线程名称：javatv-1,正在执行task：2
14:08:09.172 [javatv-1] DEBUG ayue - task2执行完毕
```



### 拒绝策略

线程池提供了 四种策略：

1. **AbortPolicy**，直接抛出异常，默认策略。
2. **CallerRunsPolicy**，用调用者所在的线程来执行任务。
3. **DiscardOldestPolicy**，丢弃阻塞队列中靠最前的任务，并执行当前任务。
4. **DiscardPolicy**，直接丢弃任务。

把上面代码的循环次数改为 4 次，则会抛出`java.util.concurrent.RejectedExecutionException`异常。

```java
for (int i = 1; i < 5; i++) {
    executor.execute(new MyTask(i));
}
```

### 关闭线程池

可以通过调用线程池的 **shutdown** 或 **shutdownNow** 方法来关闭线程池。它们的原理是遍历线程池中的工作线程，然后逐个调用线程的 **interrupt** 方法来中断线程，所以无法响应中断的任务可能永远无法终止。但是它们存在一定的区别，**shutdownNow** 首先将线程池的状态设置成 **STOP**，然后尝试停止所有的正在执行或暂停任务的线程，并返回等待执行任务的列表，而 **shutdown** 只是将线程池的状态设置成 **SHUTDOWN** 状态，然后中断所有没有正在执行任务的线程。 简单来说：

- **shutdown()**：线程池状态变为 SHUTDOWN，不会接收新任务，但已提交任务会执行完，不会阻塞调用线程的执行 。
- **shutdownNow()**：线程池状态变为 STOP，会接收新任务，会将队列中的任务返回，并用 interrupt 的方式中断正在执行的任务。

只要调用了这两个关闭方法中的任意一个，**isShutdown** 方法就会返回 true。当所有的任务都已关闭后，才表示线程池关闭成功，这时调用 **isTerminaed** 方法会返回 true。至于应该调用哪一种方法来关闭线程池，应该由提交到线程池的任务特性决定，通常调用 **shutdown** 方法来关闭线程池，如果任务不一定要执行完，则可以调用 **shutdownNow** 方法。

## Executors 静态工厂

**Executors**，提供了一系列静态工厂方法用于创建各种类型的线程池，基于 ThreadPoolExecutor。

1. **FixedThreadPool**

```java
   public static ExecutorService newFixedThreadPool(int nThreads) {
       return new ThreadPoolExecutor(nThreads, nThreads,
                                     0L, TimeUnit.MILLISECONDS,
                                     new LinkedBlockingQueue<Runnable>());
   }
```

**特点**：核心线程数等于最大线程数，因此也无需超时时间，执行完立即回收，阻塞队列是无界的，可以放任意数量的任务。

**场景**：适用于任务量已知，相对耗时的任务。

1. **newCachedThreadPool**

```java
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                  60L, TimeUnit.SECONDS,
                                  new SynchronousQueue<Runnable>());
}
```

可根据需要创建新线程的线程池，如果现有线程没有可用的，则创建一个新线程并添加到池中，如果有被使用完但是还没销毁的线程，就复用该线程。终止并从缓存中移除那些已有 60 秒钟未被使用的线程。因此，长时间保持空闲的线程池不会使用任何资源。这种线程池比较灵活，**对于执行很多短期异步任务的程序而言，这些线程池通常可提高程序性能**。

**特点**：核心线程数是 0， 最大线程数是 `Integer.MAX_VALUE`，全部都是空闲线程 60s 后回收。

**场景**：执行大量、耗时少的任务。

1. **newSingleThreadExecutor**

```java
   public static ExecutorService newSingleThreadExecutor() {
       return new FinalizableDelegatedExecutorService
           (new ThreadPoolExecutor(1, 1,
                                   0L, TimeUnit.MILLISECONDS,
                                   new LinkedBlockingQueue<Runnable>()));
   }
```

**特点**：单线程线程池。希望多个任务排队执行，线程数固定为 1，任务数多于 1 时，会放入无界队列排队，任务执行完毕，这唯一的线程也不会被释放。

**场景**：区别于自己创建一个单线程串行执行任务，如果使用`new Thread`任务执行失败而终止那么没有任何补救措施，而线程池还会新建一个线程，保证池的正常工作。

1. **ScheduledThreadPool**

```
   public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize) {       return new ScheduledThreadPoolExecutor(corePoolSize);   }
```

ScheduledThreadPoolExecutor 继承自 ThreadPoolExecutor。它主要用来在给定的延迟之后运行任务，或者定期执行任务。ScheduledThreadPoolExecuto 的功能与 Timer 类似，但 ScheduledThreadPoolExecutor 功能更强大、更灵活。Timer 对应的是单个后台线程，而 ScheduledThreadPoolExecutor 可以在构造函数中指定多个对应的后台线程数。

**特点**：核心线程数量固定，非核心线程数量无限，执行完闲置 10ms 后回收，任务队列为延时阻塞队列。

**场景**：执行定时或周期性的任务。

## 合理地配置线程池

需要针对具体情况而具体处理，不同的任务类别应采用不同规模的线程池，任务类别可划分为 CPU 密集型任务、IO 密集型任务和混合型任务。

- CPU 密集型任务：线程池中线程个数应尽量少，不应大于 CPU 核心数；
- IO 密集型任务：由于 IO 操作速度远低于 CPU 速度，那么在运行这类任务时，CPU 绝大多数时间处于空闲状态，那么线程池可以配置尽量多些的线程，以提高 CPU 利用率；
- 混合型任务：可以拆分为 CPU 密集型任务和 IO 密集型任务，当这两类任务执行时间相差无几时，通过拆分再执行的吞吐率高于串行执行的吞吐率，但若这两类任务执行时间有数据级的差距，那么没有拆分的意义。

## 线程池的监控

如果在系统中大量使用线程池，则有必要对线程池进行监控，方便在出现问题时，可以根据线程池的使用状况快速定位问题。利用线程池提供的参数进行监控，参数如下：

- **taskCount**：线程池需要执行的任务数量。
- **completedTaskCount**：线程池在运行过程中已完成的任务数量，小于或等于 taskCount。
- **largestPoolSize**：线程池曾经创建过的最大线程数量，通过这个数据可以知道线程池是否满过。如等于线程池的最大大小，则表示线程池曾经满了。
- **getPoolSize**：线程池的线程数量。如果线程池不销毁的话，池里的线程不会自动销毁，所以这个大小只增不减。
- **getActiveCount**：获取活动的线程数。

通过扩展线程池进行监控：继承线程池并重写线程池的`beforeExecute()`，`afterExecute()`和`terminated()`方法，可以在任务执行前、后和线程池关闭前自定义行为。如监控任务的平均执行时间，最大执行时间和最小执行时间等。

## 源码分析

在使用线程池的时候，我其实有一些问题也随之而来，比如线程池的线程怎么创建？任务怎么执行？任务怎么分配？线程执行完后怎么办？是存活还是死亡？什么时候死亡？为什么要使用阻塞队列等等问题。带着这些问题，我们去读读源码，读源码怎么入手？通过`ThreadPoolExecutor`的`execute()`方法。submit 底层也是调用了`execute()`。

### execute

```java
public void execute(Runnable command) {
    //如果没有任务直接抛出异常
    if (command == null)
        throw new NullPointerException();
    //获取当前线程的状态+线程个数
    int c = ctl.get();
    /**
     * workerCountOf,线程池当前线程数,并判断是否小于核心线程数
     */
    if (workerCountOf(c) < corePoolSize) {//如果小于
        if (addWorker(command, true))
            return;
        c = ctl.get();
    }
    if (isRunning(c) && workQueue.offer(command)) {
        // 这里是向任务队列投放任务成功，对线程池的运行中状态做二次检查
        // 如果线程池二次检查状态是非运行中状态，则从任务队列移除当前的任务调用拒绝策略处理（也就是移除前面成功入队的任务实例）
        int recheck = ctl.get();
        if (! isRunning(recheck) && remove(command))
            reject(command);
        /* 走到下面的else if分支，说明有以下的前提：
         * 1、待执行的任务已经成功加入任务队列
         * 2、线程池可能是RUNNING状态
         * 3、传入的任务可能从任务队列中移除失败（移除失败的唯一可能就是任务已经被执行了）
         *
         * 如果当前工作线程数量为0，则创建一个非核心线程并且传入的任务对象为null - 返回
         * 也就是创建的非核心线程不会马上运行，而是等待获取任务队列的任务去执行 
         * 如果前工作线程数量不为0，原来应该是最后的else分支，但是可以什么也不做，
         * 因为任务已经成功入队列，总会有合适的时机分配其他空闲线程去执行它。
        else if (workerCountOf(recheck) == 0)
            addWorker(null, false);
    }
    /* 走到这里说明有以下的前提：
     * 1、线程池中的工作线程总数已经大于等于corePoolSize（简单来说就是核心线程已经全部懒创建完毕）
     * 2、线程池可能不是RUNNING状态
     * 3、线程池可能是RUNNING状态同时任务队列已经满了
     *
     * 如果向任务队列投放任务失败，则会尝试创建非核心线程传入任务执行
     * 创建非核心线程失败，此时需要拒绝执行任务
     */
    else if (!addWorker(command, false))
        reject(command);
}
```



### addWorker

第一个 if 判断线程池当前线程数是否小于核心线程数。

```java
if (workerCountOf(c) < corePoolSize) {
    if (addWorker(command, true))
        return;
    c = ctl.get();
}
```

如果小于，则进入`addWorker`方法：

```java
private boolean addWorker(Runnable firstTask, boolean core) {
    retry:
    //外层循环：判断线程池状态
    for (;;) {
        int c = ctl.get();
        //获取线程池状态
        int rs = runStateOf(c);
        // 检查线程池的状态是否存活.
        if (rs >= SHUTDOWN && ! (rs == SHUTDOWN && firstTask == null && ! workQueue.isEmpty()))
            return false;
        //内层循环：线程池添加核心线程并返回是否添加成功的结果
        for (;;) {
            //线程数量
            int wc = workerCountOf(c);
            //线程数量超过容量，返回false
            if (wc >= CAPACITY || wc >= (core ? corePoolSize : maximumPoolSize))
                return false;
            //CAS增加线程数量，若成功跳出外层循环
            if (compareAndIncrementWorkerCount(c))
                break retry;
            //否则失败，并更新c
            c = ctl.get();  // Re-read ctl
            //如果这时的线程池状态发生变化，重新对外层循环进行自旋
            if (runStateOf(c) != rs)
                continue retry;
            // else CAS failed due to workerCount change; retry inner loop
        }
    }
    //如果CAS成功了，则继续往下走
    boolean workerStarted = false;
    boolean workerAdded = false;
    Worker w = null;
    try {
        //创建一个Worker，这个Worker实现了Runable，把它看成一个任务单元
        w = new Worker(firstTask);
        //这个Thread就是当前的任务单元Worker，即this
        final Thread t = w.thread;
        if (t != null) {
            //加锁，因为可能有多个线程来调用
            final ReentrantLock mainLock = this.mainLock;
            mainLock.lock();
            try {
                // 再次检查线程池的状态，避免在获取锁前调用shutdown方法
                int rs = runStateOf(ctl.get());
                if (rs < SHUTDOWN || (rs == SHUTDOWN && firstTask == null)) {
                    //如果t线程已经启动尚未终止，则抛出异常
                    if (t.isAlive()) // precheck that t is startable
                        throw new IllegalThreadStateException();
                    //否则，加入线程池
                    workers.add(w);
                    int s = workers.size();
                    if (s > largestPoolSize)
                        largestPoolSize = s;
                    workerAdded = true;
                }
            } finally {
                mainLock.unlock();
            }
            //加入线程池后，启动该线程，上面已经设置为true
            if (workerAdded) {
                t.start();
                workerStarted = true;
            }
        }
    } finally {
        //如果线程启动失败，则调用addWorkerFailed，回滚操作
        if (! workerStarted)
            addWorkerFailed(w);
    }
    return workerStarted;
}
```



### Worker

Worker 是 ThreadPoolExecutor 的内部类，继承了 AQS 并且实现了 Runnable。

```java
private final class Worker extends AbstractQueuedSynchronizer implements Runnable{
    
    final Thread thread;
    /** Initial task to run.  Possibly null. */
    Runnable firstTask;
    
    //构造方法
    Worker(Runnable firstTask) {
        //在调用runWorker前禁止中断
        //当其它线程调用了线程池的 shutdownNow 时候，如果 worker 状态 >= 0 则会中断该线程
        //具体方法在 interruptIfStarted() 中可以看到
        setState(-1); // inhibit interrupts until runWorker
        this.firstTask = firstTask;
        this.thread = getThreadFactory().newThread(this);
  }
    
    /** Delegates main run loop to outer runWorker  */
    public void run() {
        runWorker(this);
    }
    //省略其他代码...
}
```

可以看到，在 Worker 的构造方法可以知道，其中的 thread 属性就是通过 this 去创建的，所以线程池核心线程的创建主要是 run 方法中的 **runWorker** 方法：

### runWorker

runWorker 核心线程执行逻辑。

```java
final void runWorker(Worker w) {
    Thread wt = Thread.currentThread();
    Runnable task = w.firstTask;
    w.firstTask = null;
    // 调用unlock()是为了让外部可以中断
    w.unlock(); // allow interrupts
    // 线程退出的原因，true是任务导致，false是线程正常退出
    boolean completedAbruptly = true;
    try {
        // 1. 如果firstTask不为null，则执行firstTask
         // 2. 如果firstTask为null，则调用getTask()从队列获取任务
        // 3. 阻塞队列的特性就是：当队列为空时，当前线程会被阻塞等待
        while (task != null || (task = getTask()) != null) {
            w.lock();
            // 判断线程池的状态，如果线程池正在停止，则对当前线程进行中断操作
            if ((runStateAtLeast(ctl.get(), STOP) || (Thread.interrupted() &&
                  runStateAtLeast(ctl.get(), STOP))) && !wt.isInterrupted())
                wt.interrupt();//中断
            try {
                //该方法里面没有内容，可以自己扩展实现，比如上面提到的线程池的监控
                beforeExecute(wt, task);
                Throwable thrown = null;
                try {
                    //执行具体的任务
                    task.run();
                } catch (RuntimeException x) {//线程异常后操作
                    thrown = x; throw x;
                } catch (Error x) {
                    thrown = x; throw x;
                } catch (Throwable x) {
                    thrown = x; throw new Error(x);
                } finally {
                    //同 beforeExecute()
                    afterExecute(task, thrown);
                }
            } finally {
                task = null;//help gc
                //统计当前worker完成了多少个任务
                w.completedTasks++;
                //释放锁
                w.unlock();
            }
        }
        completedAbruptly = false;
    } finally {
        // 处理线程退出，completedAbruptly为true说明由于任务异常导致线程非正常退出
        processWorkerExit(w, completedAbruptly);
    }
}
```

复制代码

### getTask

而对于其中的`getTask()`方法，任务队列中的任务调度给空闲线程，该方法是非常重要的，为什么重要？其中就涉及到面试官常问的**线程池如何保证核心线程不会被销毁，而空闲线程会被销毁？**

```java
private Runnable getTask() {
    //判断最新一次的poll是否超时
    //poll：取走BlockingQueue里排在首位的对象
    boolean timedOut = false; // Did the last poll() time out?
    for (;;) {
        int c = ctl.get();
        int rs = runStateOf(c);
        // Check if queue empty only if necessary.
        /**
         * 条件1：线程池状态SHUTDOWN、STOP、TERMINATED状态
         * 条件2：线程池STOP、TERMINATED状态或workQueue为空
         * 条件1与条件2同时为true，则workerCount-1，并且返回null
         * 注：条件2是考虑到SHUTDOWN状态的线程池不会接受任务，但仍会处理任务（前面也讲到了）
         */
        if (rs >= SHUTDOWN && (rs >= STOP || workQueue.isEmpty())) {
            decrementWorkerCount();
            return null;
        }
        int wc = workerCountOf(c);
        // Are workers subject to culling?
        /*
         * 该属性的作用是判断当前线程是否允许超时：
         * 1.allowCoreThreadTimeOut
         *   如果为 false（默认），核心线程即使在空闲时也保持活动状态。
         *   如果为 true，则核心线程使用 keepAliveTime 超时等待工作。
         * 2.wc > corePoolSize
         *   当前线程是否已经超过核心线程数量。
         */
        boolean timed = allowCoreThreadTimeOut || wc > corePoolSize;
        /*
         * 判断当前线程是否可以退出：
         * 1.wc > maximumPoolSize || (timed && timedOut)
         *   wc > maximumPoolSize = true，说明当前的工作线程总数大于线程池最大线程数。
         *   timed && timedOut = true，说明当前线程允许超时并且已经超时。
         * 2.wc > 1 || workQueue.isEmpty()
         *   工作线程总数大于1或者任务队列为空，则通过CAS把线程数减去1，同时返回null
         */
        if ((wc > maximumPoolSize || (timed && timedOut)) && (wc > 1 || workQueue.isEmpty())) {
            if (compareAndDecrementWorkerCount(c))
                return null;
            continue;
        }
        try {
            /*
       * 1.poll(long timeout, TimeUnit unit)：从BlockingQueue取出一个队首的对象，
       * 如果在指定时间内，队列一旦有数据可取，则立即返回队列中的数据。否则直到时间超时还没有数据可取，返回失败。
       *
       * 2.take():取走BlockingQueue里排在首位的对象,若BlockingQueue为空,阻断进入等待状态直到BlockingQueue有新的数据被加入。     
       *
       *
       * 如果timed为true，通过poll()方法做超时拉取，keepAliveTime时间内没有等待到有效的任务，则返回null。
       *
             * 如果timed为false，通过take()做阻塞拉取，会阻塞到有下一个有效的任务时候再返回（一般不会是null）。
       */
            Runnable r = timed ? workQueue.poll(keepAliveTime, TimeUnit.NANOSECONDS) :
                workQueue.take();
            if (r != null)
                return r;
            //通过poll()方法从任务队列中拉取任务为null
            timedOut = true;
        } catch (InterruptedException retry) {
            timedOut = false;
        }
    }
}
```



① 对于`getTask()`下面的这段代码，这段逻辑大多数情况下是针对非核心线程：

```java
boolean timed = allowCoreThreadTimeOut || wc > corePoolSize;

if ((wc > maximumPoolSize || (timed && timedOut)) && (wc > 1 || workQueue.isEmpty())) {
    if (compareAndDecrementWorkerCount(c))
        return null;
    continue;
}
```



② 我们这样来阅读这段代码，当工作线程数大于核心线程`corePoolSize`，此时进入`execute()`方法中的第二个 if 语句：

```java
if (isRunning(c) && workQueue.offer(command)) {
    int recheck = ctl.get();
    if (! isRunning(recheck) && remove(command))
        reject(command);
    else if (workerCountOf(recheck) == 0)
        addWorker(null, false);
}
```

此时线程池总数已经超过了`corePoolSize`但小于`maximumPoolSize`，当任务队列已经满了的时候，会通过`addWorker(task,false)`添加非核心线程。

而在高并发的情况下，肯定会产生多余的线程，也就是出现 ① 中的情况`wc > maximumPoolSize`，而这些多余的线程怎么办，是不是会被回收？如果`workQueue.poll`没有获取到有效的任务，那么①中的逻辑刚好与`addWorker(task,false)`相反，通过 CAS 减少非核心线程，使得工作线程总数趋向于`corePoolSize`。

如果对于非核心线程，上一轮循环获取任务对象为`null`，在默认情况下`allowCoreThreadTimeOut = false`，因此，`getTask()`中`timed = true`，如果没有获取到任务，此时`timedOut = true`，这一轮循环很容易满足`timed && timedOut`为 true，这个时候`getTask()`返回 null 会导致`Worker#runWorker()`方法跳出死循环，之后执行`processWorkerExit()`方法处理后续工作，而该非核心线程对应的`Worker`则变成**游离对象**，等待被 JVM 回收。

当`allowCoreThreadTimeOut`设置为 true 的时候，这里分析的非核心线程的生命周期终结逻辑同时会适用于核心线程。

由此推出一个面试题：**线程池有多个线程同时没取到任务，会全部回收吗？**

举个例子：线程池核心线程数是 5，最大线程数为 5，当前工作线程数为 6（6>5，意味着当前可以触发线程回收），如果此时有 3 个线程同时超时没有获取到任务，这 3 个线程会都被回收销毁吗？

思路：这道题的核心点在于有多个线程同时超时获取不到任务。正常情况下，此时会触发线程回收的流程。但是我们知道，正常不设置 allowCoreThreadTimeOut 变量时，线程池即使没有任务处理，也会保持核心线程数的线程。如果这边 3 个线程被全部回收，那此时线程数就变成了 3 个，不符合核心线程数 5 个，所以这边我们可以首先得出答案：不会被全部回收。这个时候面试官肯定会问为什么？

根据答案不难推测，为了防止本题的这种并发回收问题的出现，线程回收的流程必然会有并发控制。compareAndDecrementWorkerCount(c) 用的是 CAS 方法，如果 CAS 失败就 continue，进入下一轮循环，重新判断。

像上述例子，其中一条线程会 CAS 失败，然后重新进入循环，发现工作线程数已经只有 5 了，**timed =  false**， 这条线程就不会被销毁，可以一直阻塞了，此时就会调用`workQueue.take()`阻塞等待下一次的任务，也就是说核心线程并不会死亡。

从这里也可以看出，虽然有核心线程数，但线程并没有区分是核心还是非核心，并不是先创建的就是核心，超过核心线程数后创建的就是非核心，最终保留哪些线程，完全随机。

**然后可以回答出前面的问题，线程池如何保证核心线程不会被销毁，而空闲线程会被销毁？**

**核心线程是因为调用了阻塞方法而不会被销毁，空闲线程调用了超时方法在下次执行时获取不到任务而死亡。**

**这样回答其实是可以的，但是这可能显示出你是背得八股文，所以你应该回答核心线程不仅仅是因为调用了阻塞方法而不会被销毁，同时利用了 CAS 来保证。**

还可以得出 `**getTask()**`  **返回 null 的情况** ：

1. 线程池的状态已经为 STOP，TIDYING, TERMINATED，或者是 SHUTDOWN 且工作队列为空。
2. 工作线程数大于最大线程数或当前工作线程已超时，且，其存在工作线程或任务队列为空。

runWorker 的流程：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241227114128.png)

### processWorkerExit

在 runWorker 的 finally 块中，当任务执行之后，要对其做处理，作线程在执行完`processWorkerExit()`方法才算真正的终结，该方法如下：

```java
private void processWorkerExit(Worker w, boolean completedAbruptly) {
    // 因为抛出用户异常导致线程终结，直接使工作线程数减1即可
    // 如果没有任何异常抛出的情况下是通过getTask()返回null引导线程正常跳出runWorker()方法的while死循环从而正常终结，这种情况下，在getTask()中已经把线程数减1
    if (completedAbruptly) // If abrupt, then workerCount wasn't adjusted
        decrementWorkerCount();

    final ReentrantLock mainLock = this.mainLock;
    mainLock.lock();
    try {
        // 全局的已完成任务记录数加上此将要终结的Worker中的已完成任务数
        completedTaskCount += w.completedTasks;
        // 工作线程集合中移除此将要终结的Worker
        workers.remove(w);
    } finally {
        mainLock.unlock();
    }
     
    // 见下一小节分析，用于根据当前线程池的状态判断是否需要进行线程池terminate处理
    tryTerminate();

    int c = ctl.get();
    // 如果线程池的状态小于STOP，也就是处于RUNNING或者SHUTDOWN状态的前提下：
    // 1.如果线程不是由于抛出用户异常终结，如果允许核心线程超时，则保持线程池中至少存在一个工作线程
    // 2.如果线程由于抛出用户异常终结，或者当前工作线程数，那么直接添加一个新的非核心线程
    if (runStateLessThan(c, STOP)) {
        if (!completedAbruptly) {
            // 如果允许核心线程超时，最小值为0，否则为corePoolSize
            int min = allowCoreThreadTimeOut ? 0 : corePoolSize;
            // 如果最小值为0，同时任务队列不空，则更新最小值为1
            if (min == 0 && ! workQueue.isEmpty())
                min = 1;
            // 工作线程数大于等于最小值，直接返回不新增非核心线程
            if (workerCountOf(c) >= min)
                return; // replacement not needed
        }
        addWorker(null, false);
    }
}
```

代码的后面部分区域，会判断线程池的状态，如果线程池是`RUNNING`或者`SHUTDOWN`状态的前提下，如果当前的工作线程由于抛出异常被终结，那么会新创建一个非核心线程。如果当前的工作线程并不是抛出用户异常被终结（正常情况下的终结），那么会这样处理：

- `allowCoreThreadTimeOut`为 true，也就是允许核心线程超时的前提下，如果任务队列空，则会通过创建一个非核心线程保持线程池中至少有一个工作线程。
- `allowCoreThreadTimeOut`为 false，如果工作线程总数大于`corePoolSize`则直接返回，否则创建一个非核心线程，也就是会趋向于保持线程池中的工作线程数量趋向于`corePoolSize`。

`processWorkerExit()`执行完毕之后，意味着该工作线程的生命周期已经完结。

## 面试题

1、线程池的线程怎么创建？任务怎么执行？

主要在于 **Worker** 类以及 **Worker#runWorker()** 方法。



2、任务怎么分配？

参考 **getTask()** 方法。



3、线程池如何保证核心线程不会被销毁，而空闲线程会被销毁？

参考上文。



4、线程池有多个线程同时没取到任务，会全部回收吗？

参考上文。



5、为什么要使用阻塞队列？

线程池是采用生产者-消费者模式设计的。线程池为消费者。

在线程池中活跃线程数达到 corePoolSize 时，线程池将会将后续的任务提交到 BlockingQueue 中, （每个 task 都是单独的生产者线程）进入到堵塞对列中的 task 线程会 wait() 从而释放 cpu，从而提高 cpu 利用率。