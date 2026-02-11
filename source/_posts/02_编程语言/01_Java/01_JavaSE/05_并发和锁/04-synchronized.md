---
title: 04-synchronized同步锁
date: 2016-4-28 21:59:06
tags:
- JavaSE
- synchronized
- 锁
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 05_并发和锁
---

### 1. synchronized同步锁（悲观锁）

synchronized 它可以把任意一个非 NULL 的对象当作锁。他属于**独占式的悲观锁，同时属于可重入锁**。
#### 1.1 synchronized 作用范围
1. 作用于**方法**时，锁住的是**对象的实例(this)**；
2. 作用于**静态方法**时，锁住的是**Class实例**，又因为Class的相关数据存储在永久带PermGen（jdk1.8 则是 metaspace），永久带是**全局共享**的，因此静态方法锁相当于类的一个**全局锁，会锁所有调用该方法的线程**；
3. 作用于**对象实例**时，锁住的是**所有以该对象为锁的代码块**。它有多个队列，当多个线程一起访问某个对象监视器的时候，对象监视器会将这些线程存储在不同的容器中。


#### 1.2 synchronized 核心组件
Synchronized 核心组件
1) Wait Set：那些调用 wait 方法**被阻塞的线程**被放置在这里；
2) Contention List：竞争队列，**所有请求锁的线程**首先被放在这个竞争队列中；
3) Entry List：Contention List 中那些有资格成为**候选资源的线程**被移动到 Entry List 中；
4) OnDeck：任意时刻，最多只有一个线程**正在竞争锁资源**，该线程被成为 OnDeck；
5) Owner：当前**已经获取到锁资源的线程**被称为 Owner；
6) !Owner：当前**释放锁的线程**。

#### 1.3 synchronized 实现
1. JVM 每次从队列的尾部取出一个数据用于锁竞争候选者（OnDeck），但是并发情况下，ContentionList 会被大量的并发线程进行 CAS 访问，为了降低对尾部元素的竞争，JVM 会将一部分线程移动到 EntryList 中作为候选竞争线程。
2. Owner 线程会在 unlock 时，将 ContentionList 中的部分线程迁移到 EntryList 中，并指定EntryList 中的某个线程为 OnDeck 线程（一般是最先进去的那个线程）。
3. Owner 线程并不直接把锁传递给 OnDeck 线程，而是把锁竞争的权利交给 OnDeck，OnDeck 需要重新竞争锁。这样虽然牺牲了一些公平性，但是能极大的提升系统的吞吐量，在JVM 中，也把这种选择行为称之为“竞争切换”。
4. OnDeck 线程获取到锁资源后会变为 Owner 线程，而没有得到锁资源的仍然停留在 EntryList中。如果 Owner 线程被 wait 方法阻塞，则转移到 WaitSet 队列中，直到某个时刻通过 notify或者 notifyAll 唤醒，会重新进去 EntryList 中。
5. 处于 ContentionList、EntryList、WaitSet 中的线程都处于阻塞状态，该阻塞是由操作系统来完成的（Linux 内核下采用 pthread_mutex_lock 内核函数实现的）。
6. Synchronized 是非公平锁。 Synchronized 在线程进入 ContentionList 时，等待的线程会先尝试自旋获取锁，如果获取不到就进入 ContentionList，这明显对于已经进入队列的线程是不公平的，还有一个不公平的事情就是自旋获取锁的线程还可能直接抢占 OnDeck 线程的锁资源。
7. 每个对象都有个 monitor 对象，加锁就是在竞争 monitor 对象，代码块加锁是在前后分别加上 monitorenter 和 monitorexit 指令来实现的，方法加锁是通过一个标记位来判断的
8. synchronized 是一个重量级操作，需要调用操作系统相关接口，性能是低效的，有可能给线程加锁消耗的时间比有用操作消耗的时间更多。
9. Java1.6，synchronized 进行了很多的优化，有适应自旋、锁消除、锁粗化、轻量级锁及偏向锁等，效率有了本质上的提高。在之后推出的 Java1.7 与 1.8 中，均对该关键字的实现机理做了优化。引入了偏向锁和轻量级锁。都是在对象头中有标记位，不需要经过操作系统加锁。
10. 锁可以从偏向锁升级到轻量级锁，再升级到重量级锁。这种升级过程叫做锁膨胀；
11. JDK 1.6 中默认是开启偏向锁和轻量级锁，可以通过-XX:-UseBiasedLocking 来禁用偏向锁。



### 2. 线程的同步方式

线程为什么是不安全的？
当多线程并发访问临界资源时，如果破坏原子操作，可能会造成数据不一致。
* 临界资源：共享资源（同一对象），一次仅允许一个线程使用，才可以保证正确性；
* 原子操作：不可分割的多步操作，被视作一个整体，其顺序和步骤不可打乱或缺省。

因此在程序的线程中需要以 **同步** 的方式，保证数据在运行时的正确性。
#### 2.1 同步代码块
```java
synchronized (临界资源对象) { // 对临界资源加锁
    //代码（原子操作）
}
```
>注意：
>1. 每个对象都有一个互斥锁标记，用来分配给线程的；
>2. 只有拥有对象互斥锁标记的线程，才能进入对该对象加锁的同步代码块；
>3. 线程退出同步代码块时，会释放相应的互斥锁标记。

#### 2.2 同步方法
```java
synchronized 返回值类型 方法名称(形参列表) { // 对当前对象(this)加锁
    // 代码（原子操作）
}
```
>注意：
>1. 只有拥有对象互斥锁标记的线程，才能进入该对象加锁的同步方法中；
>2. 线程退出同步方法时，会释放相应的互斥锁标记。

实例测试，验证同步代码块和同步方法：
```java
public class TestSynchronized {
      public static void main(String[] args) {
            // 临界资源：被共享的对象
            // 临界资源对象只有1把锁！
            Account acc = new Account("6002", "1234", 20000);
            
            Thread husband = new Thread(new Husband(acc), "丈夫");
            Thread wife = new Thread(new Wife(acc), "妻子");
            
            husband.start();
            wife.start();
            
      }
}
class Husband implements Runnable {
      Account acc;
      
      public Husband() {}
      public Husband(Account acc) {
            this.acc = acc;
      }
      
      // 线程任务：取款
      public void run() {
//          synchronized (this.acc) { // 对临界资源对象加锁
                  this.acc.withdrawal("6002", "1234", 12000);
//          }
      }
}
class Wife implements Runnable {
      Account acc;
      
      public Wife() {}
      public Wife(Account acc) {
            this.acc = acc;
      }
      
      // 线程任务：取款
      public void run() {
//          synchronized (this.acc) { // 对临界资源对象加锁
                  this.acc.withdrawal("6002", "1234", 12000);
//          }
      }
}
// 银行账户
class Account {
      String cardNo;
      String password;
      double balance;
      public Account() {
            super();
      }
      public Account(String cardNo, String password, double balance) {
            super();
            this.cardNo = cardNo;
            this.password = password;
            this.balance = balance;
      }
      
      // 取款（原子操作：从插卡验证、到取款成功的一系列步骤，不可缺少或打乱）
      public /*synchronized*/ void withdrawal (String no, String pwd, double money) {
            // 当前线程的锁未被释放时，其他线程会被阻塞，等待锁释放。
            synchronized (this) { // 对临界资源对象加锁，类内 this 代表当前对象
                  System.out.println(Thread.currentThread().getName() +  "正在读卡...");
                  if (no.equals(this.cardNo) &&  pwd.equals(this.password)) {
                        System.out.println(Thread.currentThread().getName() + "验证成功...");
                        if (money <= this.balance) {
                              try {
                                    Thread.sleep(1000); // 模拟ATM数钱
                              } catch (InterruptedException e) {
                                    // TODO Auto-generated catch block
                                    e.printStackTrace();
                              }
                              this.balance = this.balance - money;
                              System.out.println(Thread.currentThread().getName() + "取款成功，当前余额为：" + this.balance);
                        } else {
                              System.out.println(Thread.currentThread().getName() + "当前卡内余额不足...");
                        }
                  } else {
                        System.out.println(Thread.currentThread().getName() + "账号/密码错误!!!");
                  }
            }
      }
}
```



![image-20230605211836926](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230605211837.png)

