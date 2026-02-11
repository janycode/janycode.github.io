---
title: 05-Queue队列
date: 2016-4-28 21:53:30
tags:
- JavaSE
- Queue
- 队列
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 03_泛型集合
---

### 1. Queue接口 - 队列

```java
public interface Queue<E> 
	extends Collection<E>
```
* Collection的子接口，表示队列**FIFO**（First In First Out）
常用方法：
**（1）抛出异常**
boolean add(E e) // 顺序添加1个元素（到达上限后，再添加则会抛出异常）
E remove() // 获得第1个元素并移除（如果队列没有元素时，则抛异常）
E element() // 获得第1个元素但不移除（如果队列没有元素时，则抛异常）
**（2）返回特殊值【推荐】**
boolean **offer**(E e) // 顺序**添加**1个元素（到达上限后，再添加则会返回false）
E **poll**() // **获得第1个元素并移除**（如果队列没有元素时，则返回null）
E **keep**() // **获得第1个元素但不移除**（如果队列没有元素时，则返回null）

常用方法：
```java
boolean	add(E e)
将指定的元素插入到此队列中，如果可以立即执行此操作，而不会违反容量限制， 
true在成功后返回 IllegalStateException如果当前没有可用空间，则抛出IllegalStateException。
E	remove()
检索并删除此队列的头。
E	element()
检索，但不删除，这个队列的头。

boolean	offer(E e)
如果在不违反容量限制的情况下立即执行，则将指定的元素插入到此队列中。
E	peek()
检索但不删除此队列的头，如果此队列为空，则返回 null 。
E	poll()
检索并删除此队列的头，如果此队列为空，则返回 null 。
```
#### 1.1 ConcurrentLinkedQueue类（线程安全）
```java
public class ConcurrentLinkedQueue<E> 
	extends AbstractQueue<E> 
	implements Queue<E>, Serializable
```
说明：
* **线程安全**、可高效读写的队列，**高并发下性能最好的队列**；
* **无锁、CAS比较交换算法**，修改的方法包含3个核心参数(V,E,N)；
* V：要更新的变量、E：预期值、N：新值
* 只有当V==E时，V=N；否则表示已被更新过，则取消当前操作。

常用方法：
```java
boolean	add(E e)
在此deque的尾部插入指定的元素。
void	addFirst(E e)
在此deque前面插入指定的元素。
void	addLast(E e)
在此deque的末尾插入指定的元素。
void	clear()
从这个deque中删除所有的元素。
boolean	contains(Object o)
返回 true如果这个deque包含至少一个元素 e ，这样 o.equals(e) 。
E	element()
检索但不删除由此deque表示的队列的头部（换句话说，该deque的第一个元素）。
E	getFirst()
检索，但不删除，这个deque的第一个元素。
E	getLast()
检索，但不删除，这个deque的最后一个元素。
boolean	isEmpty()
如果此集合不包含元素，则返回 true 。
Iterator<E>	iterator()
以正确的顺序返回此deque中的元素的迭代器。
boolean	offer(E e)
在此deque的尾部插入指定的元素。
boolean	offerFirst(E e)
在此deque前面插入指定的元素。
boolean	offerLast(E e)
在此deque的末尾插入指定的元素。
E	peek()
检索但不删除由此deque表示的队列的头（换句话说，该deque的第一个元素），如果此deque为空，则返回 null 。
E	peekFirst()
检索但不删除此deque的第一个元素，如果此deque为空，则返回 null 。
E	peekLast()
检索但不删除此deque的最后一个元素，如果此deque为空，则返回 null 。
E	poll()
检索并删除由此deque表示的队列的头部（换句话说，该deque的第一个元素），如果此deque为空，则返回 null 。
E	pollFirst()
检索并删除此deque的第一个元素，如果此deque为空，则返回 null 。
E	pollLast()
检索并删除此deque的最后一个元素，如果此deque为空，则返回 null 。
E	pop()
从这个deque表示的堆栈中弹出一个元素。
void	push(E e)
将元素推送到由此deque代表的堆栈（换句话说，在该deque的头部），如果可以立即执行，而不违反容量限制，则抛出 IllegalStateException如果当前没有可用空间）。
E	remove()
检索并删除由此deque表示的队列的头（换句话说，该deque的第一个元素）。
boolean	remove(Object o)
删除第一个元素 e ，使 o.equals(e) ，如果这样一个元素存在于这个deque。
E	removeFirst()
检索并删除此deque的第一个元素。
E	removeLast()
检索并删除此deque的最后一个元素。
int	size()
返回此deque中的元素数。
<T> T[]	toArray(T[] a)
以适当的顺序（从第一个到最后一个元素）返回一个包含此deque中所有元素的数组; 返回的数组的运行时类型是指定数组的运行时类型。
```


使用示例：
```java
import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;
public class TestQueue {
      public static void main(String[] args) {
            // 列表：尾部追加 - add...
            // 链表：头尾添加 - addFirst/addLast
            // 队列：先进先出(FIFO) - offer...
            // >>> 以上三种的对应成员方法，切记不能混用！会打乱已知规则。
            LinkedList<String> link = new LinkedList<String>();
            //Queue<String> link = new LinkedList<String>(); // 强制LinkedList遵循队列的规则
            link.offer("A"); // offer用的是FIFO队列方式
            link.offer("B");
            link.offer("C");
            // 用列表的方式打乱了FIFO队列的规则
            link.add(0, "D");
            System.out.println(link.peek()); // D
            
            // 线程安全的队列Queue
            // 严格遵循队列规则，线程安全，采用CAS交换算法
            Queue<String> q = new ConcurrentLinkedQueue<String>();
            // 1.抛出异常的 2.返回结果的
            q.offer("A");
            q.offer("B");
            q.offer("C");
            
            q.poll(); // 删除表头，表头更新为B
            
            System.out.println(q.peek()); // 获取表头，此时为B
      }
}
```

### 2. BlockingQueue接口 - 阻塞队列
```java
public interface BlockingQueue<E> 
	extends Queue<E>
```
常用方法：
void **put**(E e) // 将指定元素插入此队列中，如果没有可用空间，则**死等**
E **take**() // 获取并移除此队列头部元素，如果没有可用元素，则**死等**
```java
boolean	add(E e)
将指定的元素插入到此队列中，如果可以立即执行此操作而不违反容量限制， true在成功后返回 IllegalStateException如果当前没有可用空间，则抛出IllegalStateException。
boolean	contains(Object o)
如果此队列包含指定的元素，则返回 true 。
int	drainTo(Collection<? super E> c)
从该队列中删除所有可用的元素，并将它们添加到给定的集合中。
int	drainTo(Collection<? super E> c, int maxElements)
最多从该队列中删除给定数量的可用元素，并将它们添加到给定的集合中。
boolean	offer(E e)
将指定的元素插入到此队列中，如果可以立即执行此操作，而不会违反容量限制， true在成功时 false如果当前没有可用空间，则返回false。
boolean	offer(E e, long timeout, TimeUnit unit)
将指定的元素插入到此队列中，等待指定的等待时间（如有必要）才能使空间变得可用。
E	poll(long timeout, TimeUnit unit)
检索并删除此队列的头，等待指定的等待时间（如有必要）使元素变为可用。
void	put(E e)
将指定的元素插入到此队列中，等待空格可用。
int	remainingCapacity()
返回该队列最好可以（在没有存储器或资源约束）接受而不会阻塞，或附加的元素的数量 Integer.MAX_VALUE如果没有固有的限制。
boolean	remove(Object o)
从该队列中删除指定元素的单个实例（如果存在）。
E	take()
检索并删除此队列的头，如有必要，等待元素可用。
```

说明：
* Queue的子接口，阻塞的队列，增加了两个线程状态为无限期等待的方法
* 可用于解决生产者、消费者问题

#### 2.1 ArrayBlockingQueue类（有界阻塞队列）
* 数组结构实现，有界队列。手工固定上限



```java
BlockingQueue<String> abq = new ArrayBlockingQueue<String>(3);
```

#### 2.2 LinkedBlockingQueue类（无界阻塞队列）
* 链表结构实现，无界队列。默认上限Integer.MAX_VALUE



```java
BlockingQueue<String> lbq = new LinkedBlockingQueue<String>();
```