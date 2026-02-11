---
title: 11-ExecutorCompletionService的使用和实现
date: 2022-11-06 11:16:30
tags:
- JavaSE
- 多线程
- 线程池
- ExecutorCompletionService
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 05_并发和锁
---

### 1.CompletionService介绍

`将生产新的异步任务与使用已完成任务的结果分离开来的服务`。

生产者 submit 执行的任务。使用者take 已完成的任务，并按照完成这些任务的完成顺序处理它们的结果。例如，CompletionService 可以用来管理异步 IO ，执行读操作的任务作为程序或系统的一部分提交，然后，当完成读操作时，会在程序的不同部分执行其他操作，执行操作的顺序可能与所请求的顺序不同。

通常，CompletionService 依赖于一个单独的[Executor]() 来实际执行任务，在这种情况下，CompletionService只管理一个内部完成队列。 

[ExecutorCompletionService]() 类提供了此方法的一个实现。

实现接口：


![image-20230603111614712](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230603111616.png)

任务代码：

```java
public class CallbleTask implements Callable<Integer> {
	/**
	 * 休眠时间
	 */
	private int sleepSeconds;
	/**
	 * 返回的值
	 */
	private int returnValue;

	public CallbleTask(int sleepSeconds, int returnValue) {
		this.sleepSeconds = sleepSeconds;
		this.returnValue = returnValue;
	}

	@Override
	public Integer call() throws Exception {
		System.out.println("begin to execute.");

		TimeUnit.SECONDS.sleep(sleepSeconds);

		System.out.println("end to execute.");

		return returnValue;
	}
}
```




```java
public class Main {

	public static void main(String[] args) {
		int taskSize = 5;

		ExecutorService executor = Executors.newFixedThreadPool(taskSize);

		// 构建完成服务
		CompletionService<Integer> completionService = new ExecutorCompletionService<Integer>(executor);
		int sleep = 5; // 睡眠时间，单位是秒，不是毫秒
		for (int i = 1; i <= taskSize; i++) {
			int value = i; // 返回结果
			// 向线程池提交任务
			completionService.submit(new CallbleTask(sleep, value));//返回结果类型FutureTask
		}

		// 按照完成顺序,打印结果
		for (int i = 0; i < taskSize; i++) {
			try {
				System.out.println(completionService.take().get());// 阻塞，知道有任务完成可以获取结果
				// System.out.println(completionService.poll());//poll直接返回，不阻塞。但是没有完成的任务则返回null
				// System.out.println(completionService.poll(5, TimeUnit.SECONDS));//阻塞等待指定时间，如果有完成结果返回，没有的直接返回null																					// completionService.submit(new RunnableTask(),2);//completionService提交Runnable任务是无法获取结果的

			} catch (InterruptedException e) {
				e.printStackTrace();
			} catch (ExecutionException e) {
				e.printStackTrace();
			}
		}

		// 所有任务已经完成,关闭线程池
		System.out.println("执行完毕....");
		executor.shutdown();
	}

}
```



通过这个程序可以看出来，简化了使用线程池提交一个Callable任务之后通过获取一个Future来轮询get结果，代码没有使用CompletionService简单！

### 2. 实现原理

```java
public interface CompletionService<V> {
    Future<V> submit(Callable<V> task);
    Future<V> submit(Runnable task, V result);
    Future<V> take() throws InterruptedException;
    Future<V> poll();
    Future<V> poll(long timeout, TimeUnit unit) throws InterruptedException;
}
```




```java
public Future<V> submit(Runnable task, V result) {
        if (task == null) throw new NullPointerException();
        RunnableFuture<V> f = newTaskFor(task, result);
        executor.execute(new QueueingFuture(f));
        return f;
    }
```



接下来看看java.util.concurrent.ExecutorCompletionService.newTaskFor(Runnable, V)源码：

```java
private RunnableFuture<V> newTaskFor(Runnable task, V result) {
        if (aes == null)
            return new FutureTask<V>(task, result);
        else
            return aes.newTaskFor(task, result);
    }
```



```java
protected <T> RunnableFuture<T> newTaskFor(Runnable runnable, T value) {
        return new FutureTask<T>(runnable, value);
    }
```



java.util.concurrent.CompletionService.submit(Callable&lt;Integer&gt;)实现就是返回FutureTask的&nbsp;private Object outcome结果。
























