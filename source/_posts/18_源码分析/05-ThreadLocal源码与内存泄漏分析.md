---
title: 05-ThreadLocal源码与内存泄漏分析
date: 2021-12-31 21:47:21
tags:
- 源码分析
- 线程
- ThreadLocal
- 内存泄漏
categories: 
- 18_源码分析
---

### **1.什么是ThreadLocal**

ThreadLocal是Therad的局部变量的维护类，在Java中是作为一个特殊的变量存储在。当使用ThreadLocal维护变量时，ThreadLocal为每个使用该变量的线程提供独立的变量副本，所以每一个线程都可以独立地改变自己的副本，而不会影响其它线程所对应的副本。

因为每个Thread内有自己的实例副本，且该副本只能由当前Thread使用，也就不存在多线程间共享的问题。

总的来说，ThreadLocal适用于每个线程需要自己独立的实例且该实例需要在多个方法中被使用，也即变量在线程间隔离而在方法或类间共享的场景。

**ThreadLocal的作用即是：**
`在每个线程中存储一个变量的副本，这样在每个线程对该变量进行使用，使用的即是该线程的局部变量，从而保证了线程的安全性以及高效性。`
 **ThreadLocal的使用场景：**

`在并发编程中时常有这样一种需求：每条线程都需要存取一个同名变量，但每条线程中该变量的值均不相同。`

比如，有一个变量count，在多线程并发时操作count++会出现线程安全问题。但是通过ThreadLocal就可以为每个线程创建只属于当前线程的count副本，各自操作各自的副本，不会影响到其他线程。

从另外一个角度来说，ThreadLocal是一个数据结构，有点像HashMap，可以保存"key:value"键值对，但是一个ThreadLocal只能保存一个键值对，各个线程的数据互不干扰。

```java
@Test
public void test1(){
    ThreadLocal<String> localName = new ThreadLocal<>();
    // 只提供了一个set方法；
    localName.set("hello");
    // 同时只提供了一个get方法
    String name = localName.get();
    System.out.println(name);
}
```

上述代码中线程A初始化了一个ThreadLocal对象，并调用set方法，保持了一个值。而这个值只能线程A调用get方法才能获取到。如果此时线程B调用get方法是无法获取到的。

### **2.ThreadLocal使用实例**

上面介绍了使用场景和基本的实现理论，下面我们就来通过一个简单的实例看一下如何使用ThreadLocal。

```java
public class ThreadLocalMain {
    /**
     * ThreadLocal变量，每个线程都有一个副本，互不干扰
     */
    public static final ThreadLocal<String> HOLDER = new ThreadLocal<>();
    public static void main(String[] args) throws Exception {
        new ThreadLocalMain().execute();
    }
    public void execute() throws Exception {
        // 主线程设置值
        HOLDER.set("hello");
        System.out.println(Thread.currentThread().getName() + "线程ThreadLocal中的值：" + HOLDER.get());
        new Thread(() -> {
            System.out.println(Thread.currentThread().getName() + "线程ThreadLocal中的值：" + HOLDER.get());
            // 设置当前线程中的值
            HOLDER.set("《hello》");
            System.out.println("重新设置之后，" + Thread.currentThread().getName() + "线程ThreadLocal中的值：" + HOLDER.get());
            System.out.println(Thread.currentThread().getName() + "线程执行结束");
        }).start();
        // 等待所有线程执行结束
        Thread.sleep(1000L);
        System.out.println(Thread.currentThread().getName() + "线程ThreadLocal中的值：" + HOLDER.get());
    }
}
```

示例中定义了一个static final的ThreadLocal变量HOLDER，在main方法中模拟通过两个线程来操作HOLDER中存储的值。先对HOLDER设置一个值，然后打印获取得到的值，然后新起一个线程去修改HOLDER中的值，然后分别在新线程和主线程两处获取对应的值。

执行程序，打印结果如下：

```
main线程ThreadLocal中的值：hello
Thread-0线程ThreadLocal中的值：null
重新设置之后，Thread-0线程ThreadLocal中的值：《hello》
Thread-0线程执行结束
main线程ThreadLocal中的值：hello
```

对照程序和输出结果，你会发现，主线程和Thread-0各自独享自己的变量存储。主线程并没有因为Thread-0调用了HOLDER的set方法而被改变。

之所以能达到这个效果，正是因为在ThreadLocal中，每个线程Thread拥有一份自己的副本变量，多个线程互不干扰。

### **3.ThreadLocal原理分析**

在学习ThreadLocal的原理之前，我们先来看一些相关的理论知识和数据结构。

#### **3.1 基本流程与源码实现**

一个线程内可以存多个ThreadLocal对象，存储的位置位于Thread的ThreadLocal.ThreadLocalMap变量，在Thread中有如下变量：

```java
/* ThreadLocal values pertaining to this thread. This map is maintained
 * by the ThreadLocal class. */
ThreadLocal.ThreadLocalMap threadLocals = null;
```

ThreadLocalMap是由ThreadLocal维护的`静态内部类`，正如代码中注解所说这个变量是由ThreadLocal维护的。

我们在使用ThreadLocal的get()、set()方法时，其实都是调用了`ThreadLocalMap类对应的get()、set()方法`。

Thread中的这个变量的初始化通常是在首次调用ThreadLocal的get()、set()方法时进行的。

```java
public void set(T value) {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null)
        map.set(this, value);
    else
        createMap(t, value);
}
```

上述set方法中，首先获取当前线程对象，然后通过getMap方法来获取当前线程中的threadLocals：

```java
ThreadLocalMap getMap(Thread t) {
    return t.threadLocals;
}
```

如果Thread中的对应属性为null，则创建一个ThreadLocalMap并赋值给Thread：

```java
void createMap(Thread t, T firstValue) {
    t.threadLocals = new ThreadLocalMap(this, firstValue);
}
```

如果已经存在，则通过ThreadLocalMap的set方法设置值，这里我们可以看到set中key为this，也就是当前ThreadLocal对象，而value值则是我们要存的值。

对应的get方法源码如下：

```java
public T get() {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null) {
        ThreadLocalMap.Entry e = map.getEntry(this);
        if (e != null) {
            @SuppressWarnings("unchecked")
            T result = (T)e.value;
            return result;
        }
    }
    return setInitialValue();
}
```

可以看到同样通过当前线程，拿到当前线程的threadLocals属性，然后从中获取存储的值并返回。在get的时候，如果Thread中的threadLocals属性未进行初始化，则也会间接调用createMap方法进行初始化操作。

流程图来汇总一下上述流程：

![image-20230530221916250](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230530221917.png)

上述流程中给Thread的threadLocals属性初始化的操作，在JDK8中通过debug发现，都没有走createMap方法，暂时还不清楚JVM是如何进行初始化赋值的。而在测试JDK13和JDK14的时候，很明显走了createMap方法。

#### **3.2 ThreadLoalMap的数据结构**

ThreadLoalMap是ThreadLocal中的一个静态内部类，类似HashMap的数据结构，但并没有实现Map接口。

`ThreadLoalMap中初始化了一个大小 16 的Entry数组，Entry对象用来保存每一个key-value键值对`。通过上面的set方法，我们已经知道其中的`key永远都是ThreadLocal对象`。

相关的源码：

```java
static class ThreadLocalMap {
    static class Entry extends WeakReference<ThreadLocal<?>> {
        /** The value associated with this ThreadLocal. */
        Object value;
        Entry(ThreadLocal<?> k, Object v) {
            super(k);
            value = v;
        }
    }
    private static final int INITIAL_CAPACITY = 16;
    // ...
}
```

ThreadLoalMap的类图结构如下： 

![image-20230530222156299](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230530222158.png)

这里需要留意的是，`ThreadLocalMap 类中的 Entry 对象继承自 WeakReference，也就是说它是弱引用。这里会出现内存泄露的情况`。（参考下方内容）

由于hreadLocalMaps是延迟创建的，因此在构造时至少要创建一个Entry对象。这里可以从构造方法中看到：

```java
ThreadLocalMap(ThreadLocal<?> firstKey, Object firstValue) {
    table = new Entry[INITIAL_CAPACITY];
    int i = firstKey.threadLocalHashCode & (INITIAL_CAPACITY - 1);
    table[i] = new Entry(firstKey, firstValue);
    size = 1;
    setThreshold(INITIAL_CAPACITY);
}
```

上述构造方法，创建了一个默认长度为16的Entry数组，通过hashCode与length位运算确定索引值i。而上面也提到，每个Thread都有一个ThreadLocalMap类型的变量。

至此，结合Thread，我们可以看到整个数据模型如下：

![image-20230530222402499](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230530222404.png)

#### **3.3 hash冲突及解决**

我们留意到构造方法中Entry在table中存储位置是通过hashcode算法获得。每个ThreadLocal对象都有一个hash值threadLocalHashCode，每初始化一个ThreadLocal对象，hash值就增加一个固定的大小0x61c88647。

在向ThreadLocalMap中的Entry数值存储Entry对象时，会根据ThreadLocal对象的hash值，定位到table中的位置i。这里分三种情况：

- 如果当前位置为空的，直接将Entry存放在对应位置；
- 如果位置i已经有值且这个Entry对象的key正好是即将设置的key，那么重新设置Entry中的value；
- 如果位置i的Entry对象和即将设置的key没关系，则寻找一个空位置；

计算hash值便会有hash冲突出现，常见的解决方法有：`再哈希法、开放地址法、建立公共溢出区、链式地址法等`。

上面的流程可以看出这里采用的是`开放地址方法`，如果当前位置有值，就继续寻找下一个位置，注意table[len-1]的下一个位置是table[0]，就像是一个环形数组，所以也叫闭散列法。如果一直都找不到空位置就会出现死循环，发生内存溢出。当然有扩容机制，一般不会找不到空位置的。

### **4.ThreadLocal内存泄露**

ThreadLocal使用不当可能会出现内存泄露，进而可能导致内存溢出，接下来就是内存泄露的原因及相关设计思想。

#### **4.1 内存引用链路**

根据前面对ThreadLocal的分析，得知每个Thread维护一个ThreadLocalMap，它key是ThreadLocal实例本身，value是业务需要存储的Object。也就是说ThreadLocal本身并不存储值，它只是作为一个key来让线程从ThreadLocalMap获取value。

`ThreadLocalMap，这个map是使用ThreadLocal的弱引用作为Key的，弱引用的对象在GC时会被回收。`因此使用了ThreadLocal后，引用链如图所示：

![image-20230530222745627](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230530222747.png)

其中虚线表示弱引用。

#### **4.2 Java中的引用**

Java中通常会存在以下类型的引用：强引用、弱引用、软引用、虚引用。

- **强引用**：通常new出来的对象就是强引用类型，只要引用存在，垃圾回收器将永远不会回收被引用的对象，哪怕内存不足的时候；
- **软引用**：使用 SoftReference 修饰的对象被称为软引用，软引用指向的对象在内存要溢出的时候被回收。如果回收之后，还没有足够的内存，才会抛出内存溢出异常；
- **弱引用**：`使用 WeakReference 修饰的对象被称为弱引用，只要发生垃圾回收，无论当前内存是否足够，都会回收掉只被弱引用关联的对象实例`。
- **虚引用**：虚引用是最弱的引用，在Java中使用PhantomReference进行定义。虚引用中唯一的作用就是用队列接收对象即将死亡的通知。

#### **4.3 泄露原因分析**

正常来说，当Thread执行完会被销毁，Thread.threadLocals指向的ThreadLocalMap实例也随之变为垃圾，它里面存放的Entity也会被回收。这种情况是不会发生内存泄漏的。

发生内存泄露的场景：`一般存在于线程池的情况下`。

**此时，Thread生命周期比较长（存在循环使用），threadLocals引用一直存在，当其存放的ThreadLocal被回收（弱引用生命周期比较短）后，对应的Entity就成了key为null的实例，但value值不会被回收。`如果此Entity一直不被get()、set()、remove()，就一直不会被回收，也就发生了内存泄漏。`**

所以，通常在使用完 ThreadLocal 后需要调用` remove() 方法进行内存的清除`。

比如在web请求当中，我们可以通过过滤器等进行回收方法的调用：

```java
public void doFilter(ServeletRequest request, ServletResponse){
    try{
        //设置ThreadLocal变量
        localName.set("hello");
        chain.doFilter(request, response)
    } finally {
        //调用remove方法移除threadLocal中的变量
        localName.remove();
    }
}
```

#### **4.4 为什么使用弱引用而不是强引用?**

从表面上看内存泄漏的根源在于使用了弱引用，但为什么JDK采用了弱引用的实现而不是强引用呢？

先来看ThreadLocalMap类上的一段注释：

```
To help deal with very large and long-lived usages, the hash table entries use WeakReferences for keys. 
为了协助处理数据比较大并且生命周期比较长的场景，hash table 的条目使用了 WeakReference 作为key。
```

这跟我们想象的有些不同，`弱引用反而是为了解决内存存储问题而专门使用的`。

> 我们先来假设一下，如果key使用强引用，那么在其他持有ThreadLocal引用的对象都回收了，但ThreadLocalMap依旧持有ThreadLocal的强引用，这就导致ThreadLocal不会被回收，从而直接会导致Entry内存泄露。
>
> 对照一下，弱引用的情况。持有ThreadLocal引用的对象都回收了，ThreadLocalMap持有的是ThreadLocal的弱引用，会被自动回收。只不过对应的value值，需要在下次调用set/get/remove方法时会被清除。

综合对比会发现，采用弱引用反而多了一层保障，ThreadLocal被清理后key为null，对应的value在下一次ThreadLocalMap调用set、get、remove的时候可能会被清除。

所以，内存泄露的根本原因是：`是否手动清除操作，而不是弱引用`。

### **5.ThreadLocal应用场景**

最后，ThreadLocal的应用场景列举：

- 线程间数据隔离，各线程的ThreadLocal互不影响。
- 方便同一个线程使用某一对象，避免不必要的参数传递。
- 全链路追踪中的 traceId 或者流程引擎中上下文的传递一般采用 ThreadLocal。
- Spring 事务管理器采用了 ThreadLocal。
- Spring MVC 的 RequestContextHolder 的实现使用了 ThreadLocal。