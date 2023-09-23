---
title: 15-CompletableFutureUtil
date: 2023-08-20 15:08:05
tags:
- 工具类
categories:
- 20_收藏整理
- 03_工具类
---



### CompletableFutureUtil

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
public class CompletableFutureUtil {
    // 最大超时时间 10S
    private static final int TIMEOUT_VALUE = 10 * 1000;
    // 时间单位
    private static final TimeUnit TIMEOUT_UNIT = TimeUnit.MILLISECONDS;

    private static Executor webAnswerExecutor;

    @Autowired
    @Qualifier("taskExecutor")
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
                    log.error("CompletableFutureUtil # supplyAsync error:{}", throwable.getMessage());
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
                    log.error("CompletableFutureUtil # supplyAsync error:{}", throwable.getMessage());
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
                    log.error("CompletableFutureUtil # runAsync error:{}", throwable.getMessage());
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
                    log.error("CompletableFutureUtil # runAsync error:{}", throwable.getMessage());
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
                    log.error("CompletableFutureUtil # allOf error:{}", throwable.getMessage());
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
                    log.error("CompletableFutureUtil # allOf error:{}", throwable.getMessage());
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



### 刷数据应用

```java
private void parallelExecuteForReport(String wxCorpId, Long sopUserId, String userName, List<CustomerChatDTO> chatDTOList, List<Long> lawAssistantUserIds, Boolean isBindSpecialSop) {
        int total = chatDTOList.size();
        int step = STEP_SIZE;
        int finishNumber = 0;
        List<CompletableFuture<Void>> futures = Lists.newArrayList();

        while (finishNumber < total) {
            int startIndex = finishNumber;
            int endIndex = Math.min(finishNumber + step, total);
            List<CustomerChatDTO> subList = chatDTOList.subList(startIndex, endIndex);
            if (ObjUtil.isEmpty(subList)) {
                continue;
            }

            for (CustomerChatDTO group : subList) {
                String wxChatId = String.valueOf(group.getWxChatId());
                log.info("当前遍历群: wxChatId -> {}", wxChatId);
                //线程最大允许超时时间为10min
                CompletableFuture<Void> future = CompletableFutureUtil.run(10, TimeUnit.MINUTES, () -> {
                    //群id作为子线程的 traceId
                    TraceIdGenerator.setTraceId(wxChatId);
                    dealReportPrev(wxCorpId, sopUserId, userName, lawAssistantUserIds, isBindSpecialSop, group);
                    TraceIdGenerator.removeTraceId();
                });
                futures.add(future);
            }

            finishNumber += step;
            log.info("并行线程完成情况：startIndex={}, endIndex={}, finishNumber={}/{}", subList.size(), total);
        }

        //等待所有线程完成
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
    }
```

