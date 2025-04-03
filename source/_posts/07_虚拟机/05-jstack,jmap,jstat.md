---
title: 05-jstack,jmap,jstat
date: 2020-06-11 12:17:17
tags:
- JVM
- jstack
categories: 
- 07_虚拟机
---



参考资料：

《Trouble Shooting Guide for JavaSE 6 with HotSpot VM》: http://www.oracle.com/technetwork/java/javase/tsg-vm-149989.pdf 

VisualVM: http://docs.oracle.com/javase/7/docs/technotes/guides/visualvm/

jConsole: http://docs.oracle.com/javase/1.5.0/docs/guide/management/jconsole.html

Monitoring and Managing JavaSE 6 Applications: http://www.oracle.com/technetwork/articles/javase/monitoring-141801.html

> 先 `jps -ml`
>
> 再 `sudo -u hive /usr/java/latest/bin/jstack 19661(此为进程号) > /tmp/jstack.txt`

### 1. jps

(Java Virtual Machine Process Status Tool)

jps主要用来输出JVM中运行的进程状态信息。语法格式如下：

```
jps [options] [hostid]

如果不指定hostid就默认为当前主机或服务器。
命令行参数选项说明如下：
-q 不输出类名、Jar名和传入main方法的参数
-m 输出传入main方法的参数
-l 输出main类或Jar的全限名
-v 输出传入JVM的参数
```


比如下面：

```
root@ubuntu:/# jps -m -l
2458 org.artifactory.standalone.main.Main /usr/local/artifactory-2.2.5/etc/jetty.xml
29920 com.sun.tools.hat.Main -port 9998 /tmp/dump.dat
3149 org.apache.catalina.startup.Bootstrap start
30972 sun.tools.jps.Jps -m -l
8247 org.apache.catalina.startup.Bootstrap start
25687 com.sun.tools.hat.Main -port 9999 dump.dat
21711 mrf-center.jar
```



### 2. jstack
`jstack -F pid 检查是否有死锁`

jstack主要用来查看某个Java进程内的线程堆栈信息。语法格式如下：

```
jstack [option] pid
jstack [option] executable core
jstack [option] [server-id@]remote-hostname-or-ip

命令行参数选项说明如下：
-l long listings，会打印出额外的锁信息，在发生死锁时可以用jstack -l pid来观察锁持有情况
-m mixed mode，不仅会输出Java堆栈信息，还会输出C/C++堆栈信息（比如Native方法）
```


jstack可以定位到线程堆栈，根据堆栈信息我们可以定位到具体代码，所以它在JVM性能调优中使用得非常多。下面我们来一个实例找出某个Java进程中最耗费CPU的Java线程并定位堆栈信息，用到的命令有ps、top、printf、jstack、grep。

第一步先找出Java进程ID，我部署在服务器上的Java应用名称为mrf-center：

```
root@ubuntu:/# ps -ef | grep mrf-center | grep -v grep
root     21711     1  1 14:47 pts/3    00:02:10 java -jar mrf-center.jar
```

得到进程ID为21711，第二步找出该进程内最耗费CPU的线程，可以使用ps -Lfp pid或者ps -mp pid -o THREAD, tid, time或者top -Hp pid，我这里用第三个，输出如下：

![image-20220206000913264](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220206000914.png)

TIME列就是各个Java线程耗费的CPU时间，CPU时间最长的是线程ID为21742的线程，用

```
printf "%x\n" 21742
```

得到21742的十六进制值为54ee，下面会用到。    

OK，下一步终于轮到jstack上场了，它用来输出进程21711的堆栈信息，然后根据线程ID的十六进制值grep，如下：

```
root@ubuntu:/# jstack 21711 | grep 54ee
"PollIntervalRetrySchedulerThread" prio=10 tid=0x00007f950043e000 nid=0x54ee in Object.wait() [0x00007f94c6eda000]
```

可以看到CPU消耗在PollIntervalRetrySchedulerThread这个类的Object.wait()，我找了下我的代码，定位到下面的代码：

```java
// Idle wait  
getLog().info("Thread [" + getName() + "] is idle waiting...");  
schedulerThreadState = PollTaskSchedulerThreadState.IdleWaiting;  
long now = System.currentTimeMillis();  
long waitTime = now + getIdleWaitTime();  
long timeUntilContinue = waitTime - now;  
synchronized(sigLock) {  
    try {  
        if(!halted.get()) {  
            sigLock.wait(timeUntilContinue);  
        }  
    }   
    catch (InterruptedException ignore) {  
    }  
}
```

它是轮询任务的空闲等待代码，上面的sigLock.wait(timeUntilContinue)就对应了前面的Object.wait()。

jstack信息分析：

```
Full thread dump Java HotSpot(TM) 64-Bit Server VM (24.71-b01 mixed mode):  
  
"Attach Listener" daemon prio=10 tid=0x00007f75a4001000 nid=0x947 waiting on condition [0x0000000000000000]  
   java.lang.Thread.State: RUNNABLE  
  
"LeaseRenewer:hive@nameservice1" daemon prio=10 tid=0x00007f7364f5a000 nid=0x537 waiting on condition [0x00007f713407f000]  
   java.lang.Thread.State: TIMED_WAITING (sleeping)  
    at java.lang.Thread.sleep(Native Method)  
    at org.apache.hadoop.hdfs.LeaseRenewer.run(LeaseRenewer.java:438)  
    at org.apache.hadoop.hdfs.LeaseRenewer.access$700(LeaseRenewer.java:71)  
    at org.apache.hadoop.hdfs.LeaseRenewer$1.run(LeaseRenewer.java:298)  
    at java.lang.Thread.run(Thread.java:745)  
  
"HiveServer2-Handler-Pool: Thread-883126" prio=10 tid=0x00007f73bc016000 nid=0x4e5 waiting on condition [0x00007f7137bba000]  
   java.lang.Thread.State: TIMED_WAITING (parking)  
    at sun.misc.Unsafe.park(Native Method)  
    - parking to wait for  <0x00000006585a35d8> (a java.util.concurrent.SynchronousQueue$TransferStack)  
    at java.util.concurrent.locks.LockSupport.parkNanos(LockSupport.java:226)  
    at java.util.concurrent.SynchronousQueue$TransferStack.awaitFulfill(SynchronousQueue.java:460)  
    at java.util.concurrent.SynchronousQueue$TransferStack.transfer(SynchronousQueue.java:359)  
    at java.util.concurrent.SynchronousQueue.poll(SynchronousQueue.java:942)  
    at java.util.concurrent.ThreadPoolExecutor.getTask(ThreadPoolExecutor.java:1068)  
    at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1130)  
    at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:615)  
    at java.lang.Thread.run(Thread.java:745)  
  
"IPC Parameter Sending Thread #729" daemon prio=10 tid=0x00007f7364f59000 nid=0x73cc waiting on condition [0x00007f712c302000]  
   java.lang.Thread.State: TIMED_WAITING (parking)  
    at sun.misc.Unsafe.park(Native Method)  
    - parking to wait for  <0x0000000656680e10> (a java.util.concurrent.SynchronousQueue$TransferStack)  
    at java.util.concurrent.locks.LockSupport.parkNanos(LockSupport.java:226)  
    at java.util.concurrent.SynchronousQueue$TransferStack.awaitFulfill(SynchronousQueue.java:460)  
    at java.util.concurrent.SynchronousQueue$TransferStack.transfer(SynchronousQueue.java:359)  
    at java.util.concurrent.SynchronousQueue.poll(SynchronousQueue.java:942)  
    at java.util.concurrent.ThreadPoolExecutor.getTask(ThreadPoolExecutor.java:1068)  
    at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1130)  
    at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:615)  
    at java.lang.Thread.run(Thread.java:745)  
  
"HiveServer2-Handler-Pool: Thread-882656" prio=10 tid=0x00007f73bc013000 nid=0x497a waiting on condition [0x00007f712cc0b000]  
   java.lang.Thread.State: TIMED_WAITING (parking)  
    at sun.misc.Unsafe.park(Native Method)  
    - parking to wait for  <0x00000006585a35d8> (a java.util.concurrent.SynchronousQueue$TransferStack)  
    at java.util.concurrent.locks.LockSupport.parkNanos(LockSupport.java:226)  
    at java.util.concurrent.SynchronousQueue$TransferStack.awaitFulfill(SynchronousQueue.java:460)  
    at java.util.concurrent.SynchronousQueue$TransferStack.transfer(SynchronousQueue.java:359)  
    at java.util.concurrent.SynchronousQueue.poll(SynchronousQueue.java:942)  
    at java.util.concurrent.ThreadPoolExecutor.getTask(ThreadPoolExecutor.java:1068)  
    at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1130)  
    at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:615)  
    at java.lang.Thread.run(Thread.java:745)  
  
"qtp931145444-882653" daemon prio=10 tid=0x00007f747401c000 nid=0x3376 waiting on condition [0x00007f7137dbc000]  
   java.lang.Thread.State: TIMED_WAITING (parking)  
    at sun.misc.Unsafe.park(Native Method)  
    - parking to wait for  <0x0000000657459540> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)  
    at java.util.concurrent.locks.LockSupport.parkNanos(LockSupport.java:226)  
    at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.awaitNanos(AbstractQueuedSynchronizer.java:2082)  
    at org.eclipse.jetty.util.BlockingArrayQueue.poll(BlockingArrayQueue.java:342)  
    at org.eclipse.jetty.util.thread.QueuedThreadPool.idleJobPoll(QueuedThreadPool.java:526)  
    at org.eclipse.jetty.util.thread.QueuedThreadPool.access$600(QueuedThreadPool.java:44)  
    at org.eclipse.jetty.util.thread.QueuedThreadPool$3.run(QueuedThreadPool.java:572)  
    at java.lang.Thread.run(Thread.java:745)  
  
"qtp931145444-882456" daemon prio=10 tid=0x00007f7470001000 nid=0x9600 waiting on condition [0x00007f7133776000]  
   java.lang.Thread.State: TIMED_WAITING (parking)  
    at sun.misc.Unsafe.park(Native Method)  
    - parking to wait for  <0x0000000657459540> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)  
    at java.util.concurrent.locks.LockSupport.parkNanos(LockSupport.java:226)  
    at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.awaitNanos(AbstractQueuedSynchronizer.java:2082)  
    at org.eclipse.jetty.util.BlockingArrayQueue.poll(BlockingArrayQueue.java:342)  
    at org.eclipse.jetty.util.thread.QueuedThreadPool.idleJobPoll(QueuedThreadPool.java:526)  
    at org.eclipse.jetty.util.thread.QueuedThreadPool.access$600(QueuedThreadPool.java:44)  
    at org.eclipse.jetty.util.thread.QueuedThreadPool$3.run(QueuedThreadPool.java:572)  
    at java.lang.Thread.run(Thread.java:745)  
  
"qtp931145444-882454" daemon prio=10 tid=0x00007f7454005800 nid=0x8ca1 waiting on condition [0x00007f713508f000]  
   java.lang.Thread.State: TIMED_WAITING (parking)  
    at sun.misc.Unsafe.park(Native Method)  
    - parking to wait for  <0x0000000657459540> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)  
    at java.util.concurrent.locks.LockSupport.parkNanos(LockSupport.java:226)  
    at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.awaitNanos(AbstractQueuedSynchronizer.java:2082)  
    at org.eclipse.jetty.util.BlockingArrayQueue.poll(BlockingArrayQueue.java:342)  
    at org.eclipse.jetty.util.thread.QueuedThreadPool.idleJobPoll(QueuedThreadPool.java:526)  
    at org.eclipse.jetty.util.thread.QueuedThreadPool.access$600(QueuedThreadPool.java:44)  
    at org.eclipse.jetty.util.thread.QueuedThreadPool$3.run(QueuedThreadPool.java:572)  
    at java.lang.Thread.run(Thread.java:745)  
  
"qtp931145444-881328" daemon prio=10 tid=0x00007f746c001800 nid=0x184c waiting on condition [0x00007f713306f000]  
   java.lang.Thread.State: TIMED_WAITING (parking)  
    at sun.misc.Unsafe.park(Native Method)  
    - parking to wait for  <0x0000000657459540> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)  
    at java.util.concurrent.locks.LockSupport.parkNanos(LockSupport.java:226)  
    at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.awaitNanos(AbstractQueuedSynchronizer.java:2082)  
    at org.eclipse.jetty.util.BlockingArrayQueue.poll(BlockingArrayQueue.java:342)  
    at org.eclipse.jetty.util.thread.QueuedThreadPool.idleJobPoll(QueuedThreadPool.java:526)  
    at org.eclipse.jetty.util.thread.QueuedThreadPool.access$600(QueuedThreadPool.java:44)  
    at org.eclipse.jetty.util.thread.QueuedThreadPool$3.run(QueuedThreadPool.java:572)  
    at java.lang.Thread.run(Thread.java:745)  
  
"pool-68894-thread-1" prio=10 tid=0x00007f73649a1800 nid=0x6d7 waiting on condition [0x00007f7130544000]  
   java.lang.Thread.State: TIMED_WAITING (parking)  
    at sun.misc.Unsafe.park(Native Method)  
    - parking to wait for  <0x00000006c5af6798> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)  
    at java.util.concurrent.locks.LockSupport.parkNanos(LockSupport.java:226)  
    at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.awaitNanos(AbstractQueuedSynchronizer.java:2082)  
    at java.util.concurrent.ScheduledThreadPoolExecutor$DelayedWorkQueue.take(ScheduledThreadPoolExecutor.java:1090)  
    at java.util.concurrent.ScheduledThreadPoolExecutor$DelayedWorkQueue.take(ScheduledThreadPoolExecutor.java:807)  
    at java.util.concurrent.ThreadPoolExecutor.getTask(ThreadPoolExecutor.java:1068)  
    at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1130)  
    at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:615)  
    at java.lang.Thread.run(Thread.java:745)
```

各状态说明：

**New**: 当线程对象创建时存在的状态，此时线程不可能执行；

**Runnable**：当调用thread.start()后，线程变成为Runnable状态。只要得到CPU，就可以执行；

**Running**：线程正在执行；

**Waiting**：执行thread.join()或在锁对象调用obj.wait()等情况就会进该状态，表明线程正处于等待某个资源或条件发生来唤醒自己；

**Timed_Waiting**：执行Thread.sleep(long)、thread.join(long)或obj.wait(long)等就会进该状态，与Waiting的区别在于Timed_Waiting的等待有时间限制；

**Blocked**：如果进入同步方法或同步代码块，没有获取到锁，则会进入该状态；

**Dead**：线程执行完毕，或者抛出了未捕获的异常之后，会进入dead状态，表示该线程结束

其次，对于jstack日志，我们要着重关注如下关键信息

**Deadlock**：表示有死锁

**Waiting on condition**：等待某个资源或条件发生来唤醒自己。具体需要结合jstacktrace来分析，比如线程正在sleep，网络读写繁忙而等待

**Blocked**：阻塞

**Waiting on monitor entry**：在等待获取锁

**in Object.wait()**：获取锁后又执行obj.wait()放弃锁

对于Waiting on monitor entry 和 in Object.wait()的详细描述：Monitor是 Java中用以实现线程之间的互斥与协作的主要手段，它可以看成是对象或者 Class的锁。每一个对象都有，也仅有一个 monitor。从下图中可以看出，每个 Monitor在某个时刻，只能被一个线程拥有，该线程就是 "Active Thread"，而其它线程都是 "Waiting Thread"，分别在两个队列 " Entry Set"和 "Wait Set"里面等候。在 "Entry Set"中等待的线程状态是 "Waiting for monitor entry"，而在 "Wait Set"中等待的线程状态是 "in Object.wait()"

> 总结：
>
> 对于jstack日志，我们要着重关注如下关键信息
>
> Deadlock：表示有死锁
>
> Waiting on condition：等待某个资源或条件发生来唤醒自己。具体需要结合jstacktrace来分析，比如线程正在sleep，网络读写繁忙而等待
>
> Blocked：阻塞
>
> Waiting on monitor entry：在等待获取锁
>
> 如果说系统慢，那么要特别关注Blocked,Waiting on condition
>
> 如果说系统的cpu耗的高，那么肯定是线程执行有死循环，那么此时要关注下Runable状态。



### 3. jmap

（Memory Map）和jhat（Java Heap Analysis Tool）
    jmap用来查看堆内存使用状况，一般结合jhat使用。

jmap语法格式如下：

```
jmap [option] pid
jmap [option] executable core
jmap [option] [server-id@]remote-hostname-or-ip

如果运行在64位JVM上，可能需要指定-J-d64命令选项参数。
jmap -permstat pid
```

打印进程的类加载器和类加载器加载的持久代对象信息，输出：类加载器名称、对象是否存活（不可靠）、对象地址、父类加载器、已加载的类大小等信息，如下图：

![image-20220206001149161](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220206001150.png)

   使用jmap -heap pid查看进程堆内存使用情况，包括使用的GC算法、堆配置参数和各代中堆内存使用情况。比如下面的例子：

```
root@ubuntu:/# jmap -heap 21711
Attaching to process ID 21711, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 20.10-b01
 
using thread-local object allocation.
Parallel GC with 4 thread(s)
 
Heap Configuration:
   MinHeapFreeRatio = 40
   MaxHeapFreeRatio = 70
   MaxHeapSize      = 2067791872 (1972.0MB)
   NewSize          = 1310720 (1.25MB)
   MaxNewSize       = 17592186044415 MB
   OldSize          = 5439488 (5.1875MB)
   NewRatio         = 2
   SurvivorRatio    = 8
   PermSize         = 21757952 (20.75MB)
   MaxPermSize      = 85983232 (82.0MB)
 
Heap Usage:
PS Young Generation
Eden Space:
   capacity = 6422528 (6.125MB)
   used     = 5445552 (5.1932830810546875MB)
   free     = 976976 (0.9317169189453125MB)
   84.78829520089286% used
From Space:
   capacity = 131072 (0.125MB)
   used     = 98304 (0.09375MB)
   free     = 32768 (0.03125MB)
   75.0% used
To Space:
   capacity = 131072 (0.125MB)
   used     = 0 (0.0MB)
   free     = 131072 (0.125MB)
   0.0% used
PS Old Generation
   capacity = 35258368 (33.625MB)
   used     = 4119544 (3.9287033081054688MB)
   free     = 31138824 (29.69629669189453MB)
   11.683876009235595% used
PS Perm Generation
   capacity = 52428800 (50.0MB)
   used     = 26075168 (24.867218017578125MB)
   free     = 26353632 (25.132781982421875MB)
   49.73443603515625% used
   ....
```

使用jmap -histo[:live] pid查看堆内存中的对象数目、大小统计直方图，如果带上live则只统计活对象，如下：

```
root@ubuntu:/# jmap -histo:live 21711 | more
 
 num     #instances         #bytes  class name
----------------------------------------------
   1:         38445        5597736  <constMethodKlass>
   2:         38445        5237288  <methodKlass>
   3:          3500        3749504  <constantPoolKlass>
   4:         60858        3242600  <symbolKlass>
   5:          3500        2715264  <instanceKlassKlass>
   6:          2796        2131424  <constantPoolCacheKlass>
   7:          5543        1317400  [I
   8:         13714        1010768  [C
   9:          4752        1003344  [B
  10:          1225         639656  <methodDataKlass>
  11:         14194         454208  java.lang.String
  12:          3809         396136  java.lang.Class
  13:          4979         311952  [S
  14:          5598         287064  [[I
  15:          3028         266464  java.lang.reflect.Method
  16:           280         163520  <objArrayKlassKlass>
  17:          4355         139360  java.util.HashMap$Entry
  18:          1869         138568  [Ljava.util.HashMap$Entry;
  19:          2443          97720  java.util.LinkedHashMap$Entry
  20:          2072          82880  java.lang.ref.SoftReference
  21:          1807          71528  [Ljava.lang.Object;
  22:          2206          70592  java.lang.ref.WeakReference
  23:           934          52304  java.util.LinkedHashMap
  24:           871          48776  java.beans.MethodDescriptor
  25:          1442          46144  java.util.concurrent.ConcurrentHashMap$HashEntry
  26:           804          38592  java.util.HashMap
  27:           948          37920  java.util.concurrent.ConcurrentHashMap$Segment
  28:          1621          35696  [Ljava.lang.Class;
  29:          1313          34880  [Ljava.lang.String;
  30:          1396          33504  java.util.LinkedList$Entry
  31:           462          33264  java.lang.reflect.Field
  32:          1024          32768  java.util.Hashtable$Entry
  33:           948          31440  [Ljava.util.concurrent.ConcurrentHashMap$HashEntry;
```



class name是对象类型，说明如下：

```
B  byte
C  char
D  double
F  float
I  int
J  long
Z  boolean
[  数组，如[I表示int[]
[L+类名 其他对象
```



还有一个很常用的情况是：用jmap把进程内存使用情况dump到文件中，再用jhat分析查看。jmap进行dump命令格式如下：

```
jmap -dump:format=b,file=dumpFileName
```

我一样地对上面进程ID为21711进行Dump：

```
root@ubuntu:/# jmap -dump:format=b,file=/tmp/dump.dat 21711     
Dumping heap to /tmp/dump.dat ...
Heap dump file created
```


   dump出来的文件可以用MAT、VisualVM等工具查看，这里用jhat查看：

```
root@ubuntu:/# jhat -port 9998 /tmp/dump.dat
Reading from /tmp/dump.dat...
Dump file created Tue Jan 28 17:46:14 CST 2014
Snapshot read, resolving...
Resolving 132207 objects...
Chasing references, expect 26 dots..........................
Eliminating duplicate references..........................
Snapshot resolved.
Started HTTP server on port 9998
Server is ready.
```



 然后就可以在浏览器中输入主机地址:9998查看了：

![image-20220206001326784](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220206001327.png)

上面红线框出来的部分大家可以自己去摸索下，最后一项支持OQL（对象查询语言）。

#### 3.1 发现程序异常导出dump

1. JVM启动时增加两个参数:

```makefile
#出现 OOME 时生成堆 dump: 
-XX:+HeapDumpOnOutOfMemoryError
#生成堆文件地址：
-XX:HeapDumpPath=/opt/jvmlogs/
```

2. 发现程序异常前通过执行指令，直接生成当前JVM的dmp文件，1234是指JVM的进程号

```perl
jmap -dump:format=b,file=/var/logs/heap.hprof 1234
```

获得heap.hprof以后，就可以分析你的java线程里面对象占用堆内存的情况了。

推荐使用Eclipse插件Memory Analyzer Tool 或者 MAT 工具 来打开heap.hprof文件。

**2. 查看整个JVM内存状态**

　　jmap -heap [pid]
![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250324094633.png)

**3. 查看JVM堆中对象详细占用情况**
　　jmap -histo [pid]

**4. 导出整个JVM 中内存信息，可以利用其它工具打开dump文件分析，例如jdk自带的visualvm工具**

　　jmap -dump:file=文件名.dump [pid]

　　jmap -dump:format=b,file=文件名 [pid]

　　format=b指定为二进制格式文件

 

### 4. jstat

（JVM统计监测工具）
    语法格式如下：

```
jstat [ generalOption | outputOptions vmid [interval[s|ms] [count]] ]
```



vmid是虚拟机ID，在Linux/Unix系统上一般就是进程ID。interval是采样时间间隔。count是采样数目。比如下面输出的是GC信息，采样时间间隔为250ms，采样数为4：

```
root@ubuntu:/# jstat -gc 21711 250 4
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       PC     PU    YGC     YGCT    FGC    FGCT     GCT   
192.0  192.0   64.0   0.0    6144.0   1854.9   32000.0     4111.6   55296.0 25472.7    702    0.431   3      0.218    0.649
192.0  192.0   64.0   0.0    6144.0   1972.2   32000.0     4111.6   55296.0 25472.7    702    0.431   3      0.218    0.649
192.0  192.0   64.0   0.0    6144.0   1972.2   32000.0     4111.6   55296.0 25472.7    702    0.431   3      0.218    0.649
192.0  192.0   64.0   0.0    6144.0   2109.7   32000.0     4111.6   55296.0 25472.7    702    0.431   3      0.218    0.649
```

要明白上面各列的意义，先看JVM堆内存布局：

![image-20220206001433198](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220206001434.png)

可以看出：

堆内存 = 年轻代 + 年老代 + 永久代
年轻代 = Eden区 + 两个Survivor区（From和To）

现在来解释各列含义：

S0C、S1C、S0U、S1U：Survivor 0/1区容量（Capacity）和使用量（Used）
EC、EU：Eden区容量和使用量
OC、OU：年老代容量和使用量
PC、PU：永久代容量和使用量
YGC、YGT：年轻代GC次数和GC耗时
FGC、FGCT：Full GC次数和Full GC耗时
GCT：GC总耗时