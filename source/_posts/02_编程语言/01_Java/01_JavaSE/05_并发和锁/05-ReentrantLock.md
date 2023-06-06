---
title: 05-ReentrantLock重入锁
date: 2016-4-28 21:59:06
tags:
- JavaSE
- ReentrantLock
- 锁
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 05_并发和锁
---

### 1. Lock接口

```java
public interface Lock {}
```
提供更多实用性方法，功能更强大、性能更优越。

常用方法：

* void lock() // 获取锁，如锁被占用，则等待
* boolean trylock() // 尝试获取锁（成功true，失败false，不阻塞）
* void unlock() // 释放锁 

![image-20230605211740164](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230605211741.png)



### 2. ReentrantLock类(重入锁/递归锁)
 - Lock接口实现类

```java
public class ReentrantLock extends Object implements Lock, Serializable
```
* Lock接口的实现类，与synchronized一样具有互斥锁功能。
注意：
1）使用Lock，需要显式的获取锁和释放锁；
2）为了避免拿到锁的线程在运行期间出现异常，导致程序终止没有释放锁！应用try-finally来保证无论是否出现异常，最终必须释放锁；
3）ReentrantLock为重入锁，避免递归，如果必须递归，必须正确控制退出条件。
(此锁支持同一线程的2147483647个递归锁的最大值。试图在Error超过这个限制的结果将从锁定的方法。)
主要的API接口：



```java
// 创建一个 ReentrantLock ，默认是“非公平锁”。
ReentrantLock()
// 创建策略是fair的 ReentrantLock。fair为true表示是公平锁，fair为false表示是非公平锁。
ReentrantLock(boolean fair)

// 查询当前线程保持此锁的次数。
int getHoldCount()
// 返回目前拥有此锁的线程，如果此锁不被任何线程拥有，则返回 null。
protected Thread getOwner()
// 返回一个 collection，它包含可能正等待获取此锁的线程。
protected Collection<Thread> getQueuedThreads()
// 返回正等待获取此锁的线程估计数。
int getQueueLength()
// 返回一个 collection，它包含可能正在等待与此锁相关给定条件的那些线程。
protected Collection<Thread> getWaitingThreads(Condition condition)
// 返回等待与此锁相关的给定条件的线程估计数。
int getWaitQueueLength(Condition condition)
// 查询给定线程是否正在等待获取此锁。
boolean hasQueuedThread(Thread thread)
// 查询是否有些线程正在等待获取此锁。
boolean hasQueuedThreads()
// 查询是否有些线程正在等待与此锁有关的给定条件。
boolean hasWaiters(Condition condition)
// 如果是“公平锁”返回true，否则返回false。
boolean isFair()
// 查询当前线程是否保持此锁。
boolean isHeldByCurrentThread()
// 查询此锁是否由任意线程保持。
boolean isLocked()
// 获取锁。
void lock()
// 如果当前线程未被中断，则获取锁。
void lockInterruptibly()
// 返回用来与此 Lock 实例一起使用的 Condition 实例。
Condition newCondition()
// 仅在调用时锁未被另一个线程保持的情况下，才获取该锁。
boolean tryLock()
// 如果锁在给定等待时间内没有被另一个线程保持，且当前线程未被中断，则获取该锁。
boolean tryLock(long timeout, TimeUnit unit)
// 试图释放此锁。
void unlock()
```

使用：
```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
public class TestLocks {
      public static void main(String[] args) {
            Test obj = new Test();
            Thread t1 = new Thread(new MyTask(obj));
            Thread t2 = new Thread(new MyTask2(obj));
            
            t1.start();
            t2.start();
      }
}
class Test{
      Lock lock = new ReentrantLock(); // 可重入锁
      public void method() {
            System.out.println(Thread.currentThread().getName() + "进入上锁的方法中...");
            try {
                  lock.lock(); // 获取锁（显式）
                  try {
                        Thread.sleep(2000);
                  } catch (InterruptedException e) {
                        e.printStackTrace();
                  }
                  //method(); //不要出现无穷递归，容易内存溢出导致锁一直没有释放。
                  System.out.println(Thread.currentThread().getName() +  "退出上锁的方法中...");
            } finally {
                  lock.unlock(); // 释放锁（显式） + 切记finally释放资源
            }
      }
}
class MyTask implements Runnable {
      Test obj;
      public MyTask(Test obj) {
            super();
            this.obj = obj;
      }
      @Override
      public void run() {
            obj.method();
      }
}
class MyTask2 implements Runnable {
      Test obj;
      public MyTask2(Test obj) {
            super();
            this.obj = obj;
      }
      @Override
      public void run() {
            obj.method();
      }
}
```

### 3. ReentrantReadWriteLock类
(读写锁) - ReadWriteLock接口实现类
```java
public class ReentrantReadWriteLock extends Object implements ReadWriteLock, Serializable
```
* 一种支持一写多读的同步锁，读写分离，可分别分配读锁、写锁；
* 支持多次分配读锁，使多个读操作可以并发执行（写锁同步，读锁异步）。
互斥规则：
① 写-写：互斥，阻塞；
② 读-写：互斥，读阻塞写、写阻塞读；
③ 读-读：不互斥、不阻塞；
* 在读操作远远高于写操作的环境下，可在保证线程安全的情况下，提高运行效率。




```java
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock.ReadLock;
import java.util.concurrent.locks.ReentrantReadWriteLock.WriteLock;
public class TestReadWriteLock {
      public static void main(String[] args) {
            Student s = new Student();
            ExecutorService es = Executors.newFixedThreadPool(20);
            WriteTask write = new WriteTask(s);
            ReadTask read = new ReadTask(s);
            
            long start = System.currentTimeMillis();
            es.submit(write);
            es.submit(write);
            
            for (int i = 1; i <= 18; i++) {
                  es.submit(read);
            }
            
            es.shutdown();
            while(true) {
                  System.out.println("结束了吗？");
                  if (es.isTerminated() == true) {
                        break;
                  }
            }
            
            long end = System.currentTimeMillis();
            System.out.println("运行时间：" + (end-start));
      }
}
class WriteTask implements Callable<Object> {
      Student stu;
      public WriteTask(Student stu) {
            this.stu = stu;
      }
      @Override
      public Object call() throws Exception {
            this.stu.setAge(20);
            return null;
      }
}
class ReadTask implements Callable<Object> {
      Student stu;
      public ReadTask(Student stu) {
            this.stu = stu;
      }
      @Override
      public Object call() throws Exception {
            this.stu.getAge();
            return null;
      }
}
class Student {
      private int age;
      //Lock lock = new ReentrantLock(); // 读写情况下都加锁，性能过低！
      ReentrantReadWriteLock rrwl = new ReentrantReadWriteLock(); // 有两把锁
      ReadLock read = rrwl.readLock(); // 读锁 - 内部类
      WriteLock write = rrwl.writeLock(); // 写锁 - 内部类
      // 赋值：写操作
      public void setAge(int age) throws InterruptedException {
            //lock.lock();
            write.lock();
            try {
                  Thread.sleep(1000);
                  this.age = age;
            } finally {
                  //lock.unlock();
                  write.unlock();
            }
      }
      // 取值：读操作
      public int getAge() throws InterruptedException {
            //lock.lock();
            read.lock();
            try {
                  Thread.sleep(1000);
                  return this.age;
            } finally {
                  //lock.unlock();
                  read.lock();
            }
      }
}
// Lock互斥锁运行时间20034毫秒，ReadWriteLock读写锁运行时间3004毫秒
```



### 4. ReentrantLock 的3个高级功能

由于ReentrantLock是java.util.concurrent包下提供的一套互斥锁，相比Synchronized，ReentrantLock类提供了3个高级功能（表格中也有锁体现）。

#### 功能①：等待可中断

**持有锁的线程长期不释放的时候，正在等待的线程可以选择放弃等待**，这相当于Synchronized来说可以避免出现死锁的情况。通过lock.lockInterruptibly()来实现这个机制。

三个API说明：
1）lock(), 拿不到lock就不罢休，不然线程就一直block，死等。
2）tryLock()，马上返回，拿到lock就返回true，不然返回false，不等。带时间限制的tryLock()，拿不到lock，就等一段时间，超时返回false。
3）lockInterruptibly():

1. 线程在sleep或wait,join此时如果别的进程调用此进程的 interrupt（）方法，此线程会被唤醒并被要求处理InterruptedException；
2. 此线程在运行中，则不会收到提醒。但是此线程的 “打扰标志”会被设置， 可以通过isInterrupted()查看并作出处理。线程在请求lock并被阻塞时，如果被interrupt，则“此线程会被唤醒并被要求处理InterruptedException”。并且如果线程已经被interrupt，再使用lockInterruptibly的时候，此线程也会被要求处理interruptedException。

代码示例：

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class TestInterrupt {
	public static void main(String[] args) throws Exception {
		new TestInterrupt().test();
	}

	public void test() throws Exception {
		final Lock lock = new ReentrantLock();
		lock.lock();

		Thread t1 = new Thread(new Runnable() {
			@Override
			public void run() {
				try {
					int i = 5;
					while (i-- > 0) {
						System.out.println("I'm running " + i);
						Thread.sleep(1000);
					}
					// 相当于一个可被中断的设置，会抛出中断异常(受查异常)
					lock.lockInterruptibly();
				} catch (InterruptedException e) {
					System.out.println(Thread.currentThread().getName() + " interrupted(我被中断了).");
					System.out.println("被打断后所做的事情...");
				}
			}
		}, "子线程-1");

		t1.start();
		Thread.sleep(3000); // 2秒后打断t1线程，t1线程会中断执行
		t1.interrupt(); // 打断：触发t1线程任务run中的中断异常(抛出)，进入执行异常代码块
	}
}
```

###### 释义：线程中断（interrupt）

中断一个线程，其本意是**给这个线程一个通知信号，会影响这个线程内部的一个中断标识位。这个线程本身并不会因此而改变状态(如阻塞，终止等)**。

1. 调用 interrupt()方法并**不会中断一个正在运行的线程**。也就是说处于 Running 状态的线程并不会因为被中断而被终止，仅仅改变了内部维护的中断标识位而已。
2. 若调用 **sleep()**而使线程处于 TIMED-WATING 状态，这时调用 interrupt()方法，会抛出InterruptedException,从而**使线程提前结束 TIMED-WATING 状态**。
3. 许多声明抛出 InterruptedException 的方法(如 Thread.sleep(long mills 方法))，抛出异常前，都会**清除中断标识位**，所以抛出异常后，调用 isInterrupted()方法将会返回 false。
4. 中断状态是线程固有的一个标识位，**可以通过此标识位安全的终止线程**。比如,你想终止一个线程 thread 的时候，可以调用 thread.interrupt()方法，在线程的 run 方法内部可以根据 thread.isInterrupted()的值来优雅的终止线程。


#### 功能②：公平锁机制

**多个线程等待同一个锁时，必须按照申请锁的时间顺序获得锁**，Synchronized锁非公平锁，ReentrantLock默认的构造函数是创建的非公平锁，可以通过参数true设为公平锁，但公平锁表现的性能不是很好。

>公平锁：加锁前检查是否有排队等待的线程，优先排队等待的线程，先来先得；
>非公平锁：加锁时不考虑排队等待问题，直接尝试获取锁，获取不到自动到队尾等待。

公平锁、非公平锁的创建方式：

```java
//创建一个非公平锁，默认是非公平锁
Lock lock = new ReentrantLock();
Lock lock = new ReentrantLock(false);
 
//创建一个公平锁，构造传参true
Lock lock = new ReentrantLock(true);
```

#### 功能③：锁绑定多个条件

一个ReentrantLock对象可以同时绑定对个对象。ReentrantLock提供了一个**Condition**（条件）类，用来**实现分组唤醒需要唤醒的线程**，而不是像synchronized要么随机唤醒一个线程要么唤醒全部线程。
代码示例：

```java
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class TestCondition {
	public static void main(String[] args) throws InterruptedException {
		MyService service = new MyService();
		Thread t1 = new Thread(new MyServiceThread1(service), "a");
		Thread t2 = new Thread(new MyServiceThread2(service), "b");
		
		t1.start();
		t2.start();

		// 线程sleep2秒钟
		Thread.sleep(2000);
		// 唤醒所有持有conditionA的线程
		service.signallA();

		Thread.sleep(3000);
		// 唤醒所有持有conditionB的线程
		service.signallB();
	}
}

// MyServiceThread1 使用了awaitA()方法，持有的是conditionA！
class MyServiceThread1 implements Runnable {
	private MyService service;
	public MyServiceThread1(MyService service) {
		this.service = service;
	}
	@Override
	public void run() {
		service.awaitA();
	}
}

// MyServiceThread2 使用了awaitB()方法，持有的是conditionB！
class MyServiceThread2 implements Runnable {
	private MyService service;
	public MyServiceThread2(MyService service) {
		this.service = service;
	}
	@Override
	public void run() {
		service.awaitB();
	}
}

// 主要的功能代码
class MyService {
	// 实例化一个ReentrantLock对象
	private ReentrantLock lock = new ReentrantLock();
	// 为线程A注册一个Condition
	public Condition conditionA = lock.newCondition();
	// 为线程B注册一个Condition
	public Condition conditionB = lock.newCondition();

	public void awaitA() {
		try {
			lock.lock();
			
			System.out.println(Thread.currentThread().getName() + "进入了awaitA方法");
			long timeBefore = System.currentTimeMillis();
			conditionA.await(); // 执行conditionA等待
			long timeAfter = System.currentTimeMillis();
			
			System.out.println(Thread.currentThread().getName() + "被唤醒");
			System.out.println(Thread.currentThread().getName() + "等待了: " + (timeAfter - timeBefore) / 1000 + "s");
		} catch (InterruptedException e) {
			e.printStackTrace();
		} finally {
			lock.unlock();
		}
	}

	public void awaitB() {
		try {
			lock.lock();
			
			System.out.println(Thread.currentThread().getName() + "进入了awaitB方法");
			long timeBefore = System.currentTimeMillis();
			conditionB.await(); // 执行conditionB等待
			long timeAfter = System.currentTimeMillis();
			
			System.out.println(Thread.currentThread().getName() + "被唤醒");
			System.out.println(Thread.currentThread().getName() + "等待了: " + (timeAfter - timeBefore) / 1000 + "s");
		} catch (InterruptedException e) {
			e.printStackTrace();
		} finally {
			lock.unlock();
		}
	}

	public void signallA() {
		try {
			lock.lock();
			System.out.println("启动唤醒程序");
			// 唤醒所有注册conditionA的线程
			conditionA.signalAll();
		} finally {
			lock.unlock();
		}
	}

	public void signallB() {
		try {
			lock.lock();
			System.out.println("启动唤醒程序");
			// 唤醒所有注册conditionB的线程
			conditionB.signalAll();
		} finally {
			lock.unlock();
		}
	}
}
```

![image-20230316140006365](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316140007.png)

##### 补充：Condition 类和 Object 类锁方法区别

1. Condition 类的 awiat 方法和 Object 类的 wait 方法等效；
2. Condition 类的 signal 方法和 Object 类的 notify 方法等效；
3. Condition 类的 signalAll 方法和 Object 类的 notifyAll 方法等效；
4. ReentrantLock 类可以**唤醒指定条件的线程**，而 Object 的**唤醒是随机的**。

##### 补充：trylock 和 lock 和 lockInterruptibly 方法区别

1. tryLock 能**获得锁就返回 true，不能就立即返回 false**，tryLock(long timeout,TimeUnit unit)，可以增加时间限制，**如果超过该时间段还没获得锁，返回 false**；
2. lock 能获得锁就返回 true，不能的话**一直等待**获得锁；
3. lock 和 lockInterruptibly，如果两个线程分别执行这两个方法，但此时**中断这两个线程，lock 不会抛出异常，而 lockInterruptibly 会抛出异常**。

### 5. 什么时候使用ReentrantLock？

答案是：

1. 原子操作的颗粒度更小的加锁操作或跨方法释放锁时（灵活）；
2. 如果你需要使用ReentrantLock的三个高级功能时。



![image-20230605211836926](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230605211837.png)