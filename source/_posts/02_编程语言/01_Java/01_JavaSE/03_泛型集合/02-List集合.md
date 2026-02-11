---
title: 02-List集合
date: 2016-4-28 21:53:30
tags:
- JavaSE
- List
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 03_泛型集合
---

### 1. List接口

特点：有序、有下标、元素可重复
补充：继承了父接口提供的共性方法，同时定义了一些独有的与下标相关的操作方法
方法：<参考jdk1.8 API>
常用方法：

```java
boolean	add(E e)
将指定的元素追加到此列表的末尾（可选操作）。
void	add(int index, E element)
将指定的元素插入此列表中的指定位置（可选操作）。
void	clear()
从此列表中删除所有元素（可选操作）。
boolean	contains(Object o)
如果此列表包含指定的元素，则返回 true 。
boolean	equals(Object o)
将指定的对象与此列表进行比较以获得相等性。
E	get(int index)
返回此列表中指定位置的元素。
int	hashCode()
返回此列表的哈希码值。
int	indexOf(Object o)
返回此列表中指定元素的第一次出现的索引，如果此列表不包含元素，则返回-1。
boolean	isEmpty()
如果此列表不包含元素，则返回 true 。
Iterator<E>	iterator()
以正确的顺序返回该列表中的元素的迭代器。
int	lastIndexOf(Object o)
返回此列表中指定元素的最后一次出现的索引，如果此列表不包含元素，则返回-1。
E	remove(int index)
删除该列表中指定位置的元素（可选操作）。
boolean	remove(Object o)
从列表中删除指定元素的第一个出现（如果存在）（可选操作）。
E	set(int index, E element)
用指定的元素（可选操作）替换此列表中指定位置的元素。
int	size()
返回此列表中的元素数。
default void	sort(Comparator<? super E> c)
使用随附的 Comparator排序此列表来比较元素。
List<E>	subList(int fromIndex, int toIndex)
返回此列表中指定的 fromIndex （含）和 toIndex之间的视图。
<T> T[]	toArray(T[] a)
以正确的顺序返回一个包含此列表中所有元素的数组（从第一个到最后一个元素）; 返回的数组的运行时类型是指定数组的运行时类型。
```


List实现类：ArrayList、Vector、LinkedList
### 2. ArrayList类

`数组`

特点：
	1. 数组结构实现，查询快、增删慢；
	2. JDK1.2版本，运行效率快、线程不安全；
场景：注册（1次） -> 查询（n次）
注意：

* JDK7之前，无参构造方法实际创建长度为 10 的Object数组，用还是不用，数组就在那里，爱用不用(占了内存)
* JDK8之后，无参构造方法实际创建长度为 0 的Object数组，首次add元素时，才执行数组扩容操作，然后真正向数组中插入数据（Lazy懒），用的时候创建或加载，有效降低无用内存的占用。
方法：<参考jdk1.8 API>

### 3. Vector类
`数组、线程同步`

特点：
	1. 数组结构实现，查询快、增删慢；
	2. JDK1.0版本，运行效率慢、线程安全。

### 4. LinkedList类
`链表`

特点：

1. 链表结构实现，增删快，查询慢；

### 5. 源码：List实现类常用API测试例子
```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Vector;

public class TestArrayListMethods {
	public static void main(String[] args) {
		/* 打印的三份结果一样 */
		
		System.out.println("Test List:");
		testArrayList(); // 数组实现，查询快，增删慢，运行快，线程不安全。

		System.out.println("\nTest LinkedList:");
 		testLinkedList(); // 链表实现，查询慢，增删快。
		
 		System.out.println("\nTest Vector:");
		testVector(); // 数组实现，查询快，增删慢，运行慢，线程安全。
	}
	
	public static void testVector() {
		List<String> list = new Vector<String>();
		listApiTest(list);
	}
	
	public static void testLinkedList() {
		List<String> list = new LinkedList<String>();
		listApiTest(list);
	}
	
	public static void testArrayList() {
		List<String> list = new ArrayList<String>();
		listApiTest(list);
	}
	
	public static void listApiTest(List<String> ll) {
		// 1. 增加对象到数组列表
		ll.add("A");
		ll.add("B");
		ll.add("C"); // 顺序插入
		ll.add(1, "abc"); // 按位置插入，后面元素后移(类型可以不同)
		
		for (int i = 0; i < ll.size(); i++) {
			System.out.print(ll.get(i) + " "); // A abc B C
		}
		System.out.println();
		
		// 2. 删除对象从数组列表
		boolean bool = ll.remove("abc"); // 返回boolean
		System.out.println(bool + " " + ll.toString()); // true [A, B, C]
		Object rmObj = ll.remove(1); // 返回被删除的对象
		System.out.println(rmObj + " " + ll.toString()); // B [A, C]
		
		// 3. 设置/替换对象
		ll.set(0, "F");
		System.out.println(ll.toString()); // [F, C]
		
		// 4. 转换为数组，该数组为一份副本
		Object[] objs = ll.toArray();
		for (Object object : objs) {
			System.out.print(object + " "); // F C
		}
		System.out.println();
		
		// 5. 检查是否包含元素
		System.out.println(ll.contains("C")); // true
		
		// 6. 第一次出现的索引值
		ll.add(2, "C");
		System.out.println(ll.toString()); // [F, C, C]
		System.out.println(ll.indexOf("C")); // 1
		System.out.println(ll.lastIndexOf("C")); // 2
		
		// 7. 清空数组列表元素
		ll.clear();
		System.out.println(ll.toString()); // []
		System.out.println(ll.size()); // 0
		System.out.println(ll.isEmpty()); // true
		
		// 工具方法中：服务集合的工具、服务数组的工具Arrays
		List<String> list = Arrays.asList("A", "B", "10", "D", "e"); // List更通用
		System.out.println(list.toString()); // [A, B, 10, D, e]
	}
}

```
输出：
Test List:*************************************
A abc B C 
true [A, B, C]
B [A, C]
[F, C]
F C 
true
[F, C, C]
1
2
[]
0
true
[A, B, 10, D, e]

Test LinkedList:*************************************
A abc B C 
true [A, B, C]
B [A, C]
[F, C]
F C 
true
[F, C, C]
1
2
[]
0
true
[A, B, 10, D, e]

Test Vector:*************************************
A abc B C 
true [A, B, C]
B [A, C]
[F, C]
F C 
true
[F, C, C]
1
2
[]
0
true
[A, B, 10, D, e]