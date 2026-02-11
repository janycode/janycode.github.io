---
title: 04-Map集合
date: 2016-4-28 21:53:30
tags:
- JavaSE
- Map
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 03_泛型集合
---

### 1. Map接口和实现类

特点：
* 用于存储任意键值对（Key-Value）
* 键：无序、无下标、不允许重复（唯一）
* 值：无序、无下标、允许重复

**Map父接口**
特点：存储一对数据（Key-Value），无序、无下标，键不可重复，值可重复。
常用方法：
* V **put**(K key, V value) // 将对象存入集合中，关联键值，key重复则覆盖value
* Object **get**(Object key) // 根据键获取对应的值
* Set\<K> **keySet**()// 返回所有key
* Collection\<V> **values**() // 返回包含所有值的Collection集合
* Set<Map.Entry<K,V>> **entrySet**()// 键值匹配的Set集合



```java
void clear()
从该地图中删除所有的映射（可选操作）。
boolean	containsKey(Object key)
如果此映射包含指定键的映射，则返回 true 。
boolean	containsValue(Object value)
如果此地图将一个或多个键映射到指定的值，则返回 true 。
Set<Map.Entry<K,V>>	entrySet()
返回此地图中包含的映射的Set视图。
boolean	equals(Object o)
将指定的对象与此映射进行比较以获得相等性。
V	get(Object key)
返回到指定键所映射的值，或 null如果此映射包含该键的映射。
int	hashCode()
返回此地图的哈希码值。
boolean	isEmpty()
如果此地图不包含键值映射，则返回 true 。
Set<K>	keySet()
返回此地图中包含的键的Set视图。
V	put(K key, V value)
将指定的值与该映射中的指定键相关联（可选操作）。
V	remove(Object key)
如果存在（从可选的操作），从该地图中删除一个键的映射。
default boolean	remove(Object key, Object value)
仅当指定的密钥当前映射到指定的值时删除该条目。
default V	replace(K key, V value)
只有当目标映射到某个值时，才能替换指定键的条目。
default boolean	replace(K key, V oldValue, V newValue)
仅当当前映射到指定的值时，才能替换指定键的条目。
int	size()
返回此地图中键值映射的数量。
Collection<V>	values()
返回此地图中包含的值的Collection视图。
```

Map实现类：HashMap、Hashtable、Properties、TreeMap

### ① HashMap类（数组+链表+红黑树）
HashMap 根据键的 hashCode 值存储数据，大多数情况下可以直接定位到它的值，因而具有很快的访问速度，但遍历顺序却是不确定的。 
HashMap 最多只允许一条记录的键为 null，允许多条记录的值为 null。HashMap 非线程安全，即任一时刻可以有多个线程同时写 HashMap，可能会导致数据的不一致。
如果需要满足线程安全，可以用 Collections 的 synchronizedMap 方法使HashMap 具有线程安全的能力，或者使用ConcurrentHashMap。

特点：
* JDK1.2版本，线程不安全，运行效率快；允许用null作为key或是value
* 无参构建初始容量为16（负载因子0.75，即+75%容量扩容）
* HashMap算法：拿到任何一个对象后，通过hash(key)做运算，key>>>16(除16)，只可能得到0-15之间的一个数组，作为插入数组的下标。



### ② LinkedHashMap类（记录插入顺序）
特点：HashMap 的一个子类，保存了记录的插入顺序，也可在构造时带参数，按照访问次序排序。
用法：类似HashMap，接口参阅api文档

### ③ Hashtable类（线程安全）
Hashtable 是遗留类，很多映射的常用功能与 HashMap 类似，不同的是它承自 Dictionary 类，并且是线程安全的，任一时间只有一个线程能写 Hashtable，并发性不如 ConcurrentHashMap，因为 ConcurrentHashMap 引入了分段锁。
Hashtable 不建议在新代码中使用，不需要线程安全的场合可以用 HashMap 替换，需要线程安全的场合可以用ConcurrentHashMap 替换。

特点：JDK1.0版本，线程安全，运行效率慢；不允许null作为key或是value
用法：类似HashMap，接口参阅api文档

### ④ Properties类（配置文件读取）
特点：Hashtable的子类，要求key和value都是String，通常用于配置文件的读取。
用法：类似HashMap，不需要指定泛型，接口参阅api文档

### ⑤ TreeMap类（自动排序）
TreeMap 实现 SortedMap 接口，能够把它保存的记录根据键排序，默认是按键值的升序排序，也可以指定排序的比较器，当用 Iterator 遍历TreeMap 时，得到的记录是排过序的。
如果使用排序的映射，建议使用 TreeMap。
在使用 TreeMap 时，key 必须实现 Comparable 接口或者在构造 TreeMap 传入自定义的Comparator，否则会在运行时抛出java.lang.ClassCastException 类型的异常。

特点：实现了SortedMap接口（Map的子接口），可以对key自动排序。
用法：类似HashMap，接口参阅api文档

### 2. 源码：HashMap使用示例+Map遍历
```java
import java.util.HashMap;
public class TestBasicHashMap {
      public static void main(String[] args) {
            HashMap<String, String> map = new HashMap<String,  String>();
            
            map.put("CN", "中国");
            map.put("US", "美国");
            map.put("KR", "韩国");
            map.put("JP", "日本");
            map.put("UK", "英国");
            
            map.put("CN", "中华人民共和国");
            map.put("HH", "韩国");
            
            
            System.out.println( map.get("CN") ); // 中华人民共和国
            System.out.println( map.get("KR") ); // 韩国
            System.out.println( map.get("HH") ); // 韩国
            
            map.remove("HH");
            // {JP=日本, UK=英国, KR=韩国, CN=中华人民共和国, US=美国}
            System.out.println(map);
			// 遍历key
			for (String string : map.keySet()) {
				System.out.print(string + " "); // JP UK KR CN US 
			}
			System.out.println();
			// 遍历value
			for (String string : map.values()) {
				System.out.print(string + " "); // 日本 英国 韩国 中华人民共和国 美国
			}
			
			// 遍历 key,value
			for (Map.Entry<String, String> entry : map.entrySet()) {
				System.out.println(entry.getKey() + " " + entry.getValue());
			}
      }
}
```



遵循程序设计基本原则，**要先写测试代码**：
```java
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class TestMap {
	public static void main(String[] args) {
		Map<Integer, String> map = new HashMap<Integer, String>();
		map.put(1, "aaa");
		map.put(2, "bbb");
		map.put(3, "ccc");
		map.put(4, "ddd");
		map.put(5, "eee");
		
		mapTraverse1(map); // ①
		mapTraverse2(map); // ②
		mapTraverse3(map); // ③
		mapTraverse4(map); // ④
		mapTraverse5(map); // ⑤
	}
}
```

### 3. foreach遍历Map
foreach用法：
```java
for (数据类型 变量名 : 容器名称) {
    //可遍历集合或数组（常用在无序集合上）
}
```
#### ① entrySet() + foreach直接遍历
第一种map遍历方法：entrySet() + foreach直接遍历
说明：①简洁；②适用于map容量大的时候；③遍历时，如果改变其大小，会报错(ConcurrentModificationException)
```java
	public static void mapTraverse1(Map<Integer, String> map) {
		for (Map.Entry<Integer, String> m : map.entrySet()) {
			//map.put(6, "fff"); // Error: java.util.ConcurrentModificationException
			System.out.println("key=" + m.getKey() + " value=" + m.getValue());
		}
	}
```

#### ② keySet() + foreach直接遍历
第二种map遍历方法：keySet() + foreach直接遍历
说明：①简洁；②效率不如entrySet()不是最优选择；③且遍历时，如果改变其大小，会报错
```java
	public static void mapTraverse2(Map<Integer, String> map) {
		for (Integer key : map.keySet()) {
			//map.put(6, "fff"); // Error: java.util.ConcurrentModificationException
			System.out.println("key=" + key + " value=" + map.get(key));
		}
	}
```
### 2. iterator遍历Map
#### ③ entrySet() + iterator()迭代器方法.next()遍历
第三种map遍历方法：entrySet() + iterator()迭代器方法.next()遍历
说明：可使用Iterator的remove方法删除最后1个元素，放在循环内则会将源map全部元素删除

```java
	public static void mapTraverse3(Map<Integer, String> map) {
		Iterator<Map.Entry<Integer, String>> it = map.entrySet().iterator();
		while (it.hasNext()) {
			Map.Entry<Integer, String> entry = it.next();
			System.out.println("key=" + entry.getKey() + " value=" + entry.getValue());
		}
		//从底层集合中删除此迭代器返回的最后一个元素 (5, "eee")
		//下一次重新遍历map的时候才会看到remove结果
		//it.remove();
	}
```
#### ④ keySet() + iterator()迭代器方法.next()遍历
第四种map遍历方法：keySet() + iterator()迭代器方法.next()
说明：可使用Iterator的remove方法删除最后1个元素，放在循环内则会将源map全部元素删除
```java
	public static void mapTraverse4(Map<Integer, String> map) {
		for (Iterator<?> i = map.keySet().iterator(); i.hasNext();) {
			Object obj = i.next();
			System.out.println("key=" + obj + " value=" + map.get(obj));
			//i.remove(); //循环内调用会删除源map所有key,value
		}
	}
```
### 3. values()方法遍历
第五种map遍历方法：values()方法单独遍历输出value
说明：只能遍历value，不能遍历key，按需使用
```java
	public static void mapTraverse5(Map<Integer, String> map) {
		for (Iterator<?> i = map.values().iterator(); i.hasNext();) {
			System.out.println("value=" + i.next());
		}
	}
```