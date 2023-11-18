---
title: 15-CompletableAsyncUtil
date: 2023-08-20 15:08:05
tags:
- 工具类
categories:
- 20_收藏整理
- 03_工具类
---


### CompletableAsyncUtil

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.concurrent.*;
import java.util.function.Function;
import java.util.function.Supplier;

@Slf4j
@Component
public class CompletableAsyncUtil {
    // 最大超时时间 10S
    private static final int TIMEOUT_VALUE = 10 * 1000;
    // 时间单位
    private static final TimeUnit TIMEOUT_UNIT = TimeUnit.MILLISECONDS;

    private static Executor webAnswerExecutor;

    @Autowired
    @Qualifier("reportJobExecutor")
    private Executor w;

    @PostConstruct
    public void init() {
        webAnswerExecutor = w;
    }

    /**
     * 有返回值的异步
     *
     * @param supplier
     * @param <T>
     * @return
     */
    public static <T> CompletableFuture<T> supply(Supplier<T> supplier) {
        //获取调用者的类名
        String className = new Throwable().getStackTrace()[1].getClassName();
        //获取调用者的方法名
        String methodName = new Throwable().getStackTrace()[1].getMethodName();
        String throwName = className + ":" + methodName;
        return supply(TIMEOUT_VALUE, TIMEOUT_UNIT, supplier, throwName);
    }

    /**
     * 有返回值的异步 - 可设置超时时间
     *
     * @param timeout
     * @param unit
     * @param supplier
     * @param <T>
     * @return
     */
    public static <T> CompletableFuture<T> supply(long timeout, TimeUnit unit, Supplier<T> supplier) {
        //获取调用者的类名
        String className = new Throwable().getStackTrace()[1].getClassName();
        //获取调用者的方法名
        String methodName = new Throwable().getStackTrace()[1].getMethodName();
        String throwName = className + ":" + methodName;
        return CompletableFuture.supplyAsync(supplier, webAnswerExecutor)
                .applyToEither(timeoutAfter(throwName, timeout, unit), Function.identity())
                .exceptionally(throwable -> {
                    throwable.printStackTrace();
                    log.error("WebAnswerAsyncUtil # supplyAsync error:{}", throwable.getMessage());
                    return null;
                });
    }

    /**
     * 有返回值的异步 - 可设置超时时间
     *
     * @param timeout
     * @param unit
     * @param supplier
     * @param <T>
     * @return
     */
    public static <T> CompletableFuture<T> supply(long timeout, TimeUnit unit, Supplier<T> supplier, String throwName) {
        return CompletableFuture.supplyAsync(supplier, webAnswerExecutor)
                .applyToEither(timeoutAfter(throwName, timeout, unit), Function.identity())
                .exceptionally(throwable -> {
                    throwable.printStackTrace();
                    log.error("WebAnswerAsyncUtil # supplyAsync error:{}", throwable.getMessage());
                    return null;
                });
    }


    /**
     * 无返回值的异步
     *
     * @param runnable
     * @return
     */
    public static CompletableFuture run(Runnable runnable) {
        //获取调用者的类名
        String className = new Throwable().getStackTrace()[1].getClassName();
        //获取调用者的方法名
        String methodName = new Throwable().getStackTrace()[1].getMethodName();
        String throwName = className + ":" + methodName;
        return run(TIMEOUT_VALUE, TIMEOUT_UNIT, runnable, throwName);
    }

    /**
     * 无返回值的异步 - 可设置超时时间
     *
     * @param runnable
     * @return
     */
    public static CompletableFuture<Void> run(long timeout, TimeUnit unit, Runnable runnable) {
        //获取调用者的类名
        String className = new Throwable().getStackTrace()[1].getClassName();
        //获取调用者的方法名
        String methodName = new Throwable().getStackTrace()[1].getMethodName();
        String throwName = className + ":" + methodName;
        return CompletableFuture.runAsync(runnable, webAnswerExecutor)
                .applyToEither(timeoutAfter(throwName, timeout, unit), Function.identity())
                .exceptionally(throwable -> {
                    throwable.printStackTrace();
                    log.error("WebAnswerAsyncUtil # runAsync error:{}", throwable.getMessage());
                    return null;
                });
    }

    /**
     * 无返回值的异步 - 可设置超时时间
     *
     * @param runnable
     * @return
     */
    public static CompletableFuture run(long timeout, TimeUnit unit, Runnable runnable, String throwName) {
        return CompletableFuture.runAsync(runnable, webAnswerExecutor)
                .applyToEither(timeoutAfter(throwName, timeout, unit), Function.identity())
                .exceptionally(throwable -> {
                    throwable.printStackTrace();
                    log.error("WebAnswerAsyncUtil # runAsync error:{}", throwable.getMessage());
                    return null;
                });
    }

    /**
     * 统一处理异步结果
     *
     * @param futures
     * @return
     */
    public static CompletableFuture allOf(CompletableFuture... futures) {
        //获取调用者的类名
        String className = new Throwable().getStackTrace()[1].getClassName();
        //获取调用者的方法名
        String methodName = new Throwable().getStackTrace()[1].getMethodName();
        String throwName = className + ":" + methodName;
        return allOf(throwName, TIMEOUT_VALUE, TIMEOUT_UNIT, futures);
    }


    /**
     * 统一处理异步结果 - 可设置超时时间
     *
     * @param futures
     * @return
     */
    public static CompletableFuture allOf(long timeout, TimeUnit unit, CompletableFuture... futures) {
        //获取调用者的类名
        String className = new Throwable().getStackTrace()[1].getClassName();
        //获取调用者的方法名
        String methodName = new Throwable().getStackTrace()[1].getMethodName();
        String throwName = className + ":" + methodName;
        return CompletableFuture.allOf(futures)
                .applyToEither(timeoutAfter(throwName, timeout, unit), Function.identity())
                .exceptionally(throwable -> {
                    throwable.printStackTrace();
                    log.error("WebAnswerAsyncUtil # allOf error:{}", throwable.getMessage());
                    return null;
                });
    }

    /**
     * 统一处理异步结果 - 可设置超时时间
     *
     * @param futures
     * @return
     */
    public static CompletableFuture allOf(String throwName, long timeout, TimeUnit unit, CompletableFuture... futures) {
        return CompletableFuture.allOf(futures)
                .applyToEither(timeoutAfter(throwName, timeout, unit), Function.identity())
                .exceptionally(throwable -> {
                    throwable.printStackTrace();
                    log.error("WebAnswerAsyncUtil # allOf error:{}", throwable.getMessage());
                    return null;
                });
    }

    /**
     * 异步超时处理
     *
     * @param timeout
     * @param unit
     * @param <T>
     * @return
     */
    public static <T> CompletableFuture<T> timeoutAfter(String throwName, long timeout, TimeUnit unit) {
        CompletableFuture<T> result = new CompletableFuture<T>();
        // timeout 时间后 抛出TimeoutException 类似于sentinel / watcher
        Delayer.delayer.schedule(() -> result.completeExceptionally(new TimeoutException(throwName)), timeout, unit);
        return result;
    }


    /**
     * Singleton delay scheduler, used only for starting and * cancelling tasks.
     */
    public static final class Delayer {

        static final ScheduledThreadPoolExecutor delayer;

        /**
         * 异常线程，不做请求处理，只抛出异常
         */
        static {
            delayer = new ScheduledThreadPoolExecutor(1, new DaemonThreadFactory());
            delayer.setRemoveOnCancelPolicy(true);
        }

        static ScheduledFuture<?> delay(Runnable command, long delay, TimeUnit unit) {
            return delayer.schedule(command, delay, unit);
        }

        static final class DaemonThreadFactory implements ThreadFactory {
            @Override
            public Thread newThread(Runnable r) {
                Thread t = new Thread(r);
                t.setDaemon(true);
                t.setName("CompletableFutureScheduler");
                return t;
            }
        }
    }
}
```



### 线程池

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.ThreadPoolExecutor;

@Configuration
@EnableAsync
public class ThreadPoolConfig {

    private static final int corePoolSize = 10;   // 核心线程数（默认线程数）
    private static final int maxPoolSize = 20;   // 最大线程数
    private static final int keepAliveTime = 10;  // 允许线程空闲时间（单位：默认为秒）
    private static final int queueCapacity = 500; // 缓冲队列数

    /**
     * 默认异步线程池
     */
    @Bean("taskExecutor")
    public ThreadPoolTaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor pool = new ThreadPoolTaskExecutorMdc();
        pool.setThreadNamePrefix("customThreadPool-");
        pool.setCorePoolSize(corePoolSize);
        pool.setMaxPoolSize(maxPoolSize);
        pool.setKeepAliveSeconds(keepAliveTime);
        pool.setQueueCapacity(queueCapacity);
        pool.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        pool.initialize();
        return pool;
    }

    @Bean("reportJobExecutor")
    public ThreadPoolTaskExecutor reportJobExecutor() {
        ThreadPoolTaskExecutor pool = new ThreadPoolTaskExecutorMdc();
        pool.setThreadNamePrefix("reportJobThreadPool-");
        pool.setCorePoolSize(30);
        pool.setMaxPoolSize(60);
        pool.setKeepAliveSeconds(30);
        pool.setQueueCapacity(10000);
        pool.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        pool.initialize();
        return pool;
    }
}
```

```java
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.util.concurrent.ListenableFuture;

import java.util.concurrent.Callable;
import java.util.concurrent.Future;

@Slf4j
public class ThreadPoolTaskExecutorMdc extends ThreadPoolTaskExecutor {

    @Override
    public <T> Future<T> submit(Callable<T> task) {
        return super.submit(ThreadMdcUtil.wrap(task, MDC.getCopyOfContextMap()));
    }

    @Override
    public void execute(Runnable task) {
        super.execute(ThreadMdcUtil.wrap(task, MDC.getCopyOfContextMap()));
    }

    @Override
    public void execute(Runnable task, long startTimeout) {
        super.execute(ThreadMdcUtil.wrap(task, MDC.getCopyOfContextMap()), startTimeout);
    }

    @Override
    public Future<?> submit(Runnable task) {
        return super.submit(ThreadMdcUtil.wrap(task, MDC.getCopyOfContextMap()));
    }

    @Override
    public ListenableFuture<?> submitListenable(Runnable task) {
        return super.submitListenable(ThreadMdcUtil.wrap(task, MDC.getCopyOfContextMap()));
    }

    @Override
    public <T> ListenableFuture<T> submitListenable(Callable<T> task) {
        return super.submitListenable(ThreadMdcUtil.wrap(task, MDC.getCopyOfContextMap()));
    }

    @Override
    protected void cancelRemainingTask(Runnable task) {
        super.cancelRemainingTask(ThreadMdcUtil.wrap(task, MDC.getCopyOfContextMap()));
    }
}
```

```java
import org.slf4j.MDC;

import java.util.Map;
import java.util.concurrent.Callable;

public class ThreadMdcUtil {

    public static void setTraceIdIfAbsent() {
        if (MDC.get(Constant.TRACE_ID) == null) {
            MDC.put(Constant.TRACE_ID, TraceIdGenerator.createTraceId());
        }
    }

    public static <T> Callable<T> wrap(Callable<T> callable, final Map<String, String> context) {
        return () -> {
            if (context == null) {
                MDC.clear();
            } else {
                MDC.setContextMap(context);
            }
            setTraceIdIfAbsent();
            try {
                return callable.call();
            } finally {
                MDC.clear();
            }
        };
    }

    public static Runnable wrap(Runnable runnable, final Map<String, String> context) {
        return () -> {
            if (context == null) {
                MDC.clear();
            } else {
                MDC.setContextMap(context);
            }
            setTraceIdIfAbsent();
            try {
                runnable.run();
            } finally {
                MDC.clear();
            }
        };
    }
}
```

```java
public interface Constant {
    String TRACE_ID = "traceId";
}
```







### 刷数据应用

```java
private void parallelExecuteForReport(String wxCorpId, List<CustomerChatDTO> chatDTOList, List<Long> lawAssistantUserIds, Boolean isBindSpecialSop) {
        int total = chatDTOList.size();
        int step = reportConfig.getThreadNum();
        int finishNumber = 0;

        while (finishNumber < total) {
            int startIndex = finishNumber;
            int endIndex = Math.min(finishNumber + step, total);
            List<CustomerChatDTO> subList = chatDTOList.subList(startIndex, endIndex);
            if (ObjUtil.isEmpty(subList)) {
                continue;
            }

            //遍历subList每个元素提交线程池，并等待所有的线程执行完毕
            List<CompletableFuture<Void>> futures = Lists.newArrayList();
            for (CustomerChatDTO group : subList) {
                String roomId = String.valueOf(group.getWxChatId());
                String traceId = UUID.randomUUID().toString().replaceAll("-", "");
                log.info("当前遍历群: roomId -> {}, traceId -> {}", roomId, traceId);
                //线程最大允许超时时间单位：分钟
                CompletableFuture<Void> future = CompletableAsyncUtil.run(30, TimeUnit.MINUTES, () -> {
                    log.info("线程开启: roomId -> {}, traceId -> {}", roomId, traceId);
                    TraceIdGenerator.setTraceId(traceId);

                    //生成报告核心逻辑
                    dealReportPrev(wxCorpId, lawAssistantUserIds, isBindSpecialSop, group);
                    TraceIdGenerator.removeTraceId();
                    log.info("线程完毕: roomId -> {}, traceId -> {}", roomId, traceId);
                });
                futures.add(future);
            }

            finishNumber += subList.size();
            log.info("并行线程完成情况：startIndex={}, endIndex={}, finishNumber={}/{}", startIndex, endIndex, finishNumber, total);

            //等待本轮线程完成
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        }
    }
```


