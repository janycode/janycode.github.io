---
title: 03-Set集合
date: 2016-4-28 21:53:30
tags:
- JavaSE
- Set
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 03_泛型集合
---

### 1. Set接口与实现类

特点：
1）**无序、无下标、元素不可重复**（当插入新元素时，如果新元素与已有元素进行equals比较，结果为true时，则拒绝新元素插入）
2）set接口并没有提供自己独有的方法，**均是继承Collection的方法**

Set 注重**独一无二**的性质,该体系集合用于存储无序(存入和取出的顺序不一定相同)元素，值不能重复。对象的相等性本质是对象 hashCode 值（java 是依据对象的内存地址计算出的此序号）判断的，如果想要让两个不同的对象视为相等的，就必须覆盖 Object 的 hashCode 方法和 equals 方法。

**元素不重复**的基本逻辑判断示意图：
![image-20230316135310477](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316135311.png)
包装类型，重写hashCode就很简单：

```java
class Student{
	String name;
	Integer age;
	String sex;
	Double score;
	// ...
	@Override
	public int hashCode() {
		return (this.name.hashCode() + this.sex.hashCode() + this.age.hashCode() + this.score.hashCode());
	}
	
}
```

基本类型，重写hashCode详解：[【Java】如何重写hashCode()和equals()方法](https://simple.blog.csdn.net/article/details/104663785)

Set集合常用方法：
```java
boolean	add(E e)
如果指定的元素不存在，则将其指定的元素添加（可选操作）。
boolean	addAll(Collection<? extends E> c)
将指定集合中的所有元素添加到此集合（如果尚未存在）（可选操作）。
void	clear()
从此集合中删除所有元素（可选操作）。
boolean	contains(Object o)
如果此集合包含指定的元素，则返回 true 。
boolean	containsAll(Collection<?> c)
返回 true如果此集合包含所有指定集合的元素。
boolean	equals(Object o)
将指定的对象与此集合进行比较以实现相等。
int	hashCode()
返回此集合的哈希码值。
boolean	isEmpty()
如果此集合不包含元素，则返回 true 。
Iterator<E>	iterator()
返回此集合中元素的迭代器。
boolean	remove(Object o)
如果存在，则从该集合中删除指定的元素（可选操作）。
boolean	removeAll(Collection<?> c)
从此集合中删除指定集合中包含的所有元素（可选操作）。
boolean	retainAll(Collection<?> c)
仅保留该集合中包含在指定集合中的元素（可选操作）。
int	size()
返回此集合中的元素数（其基数）。
default Spliterator<E>	spliterator()
在此集合中的元素上创建一个 Spliterator 。
Object[]	toArray()
返回一个包含此集合中所有元素的数组。
<T> T[]	toArray(T[] a)
返回一个包含此集合中所有元素的数组; 返回的数组的运行时类型是指定数组的运行时类型。
```
Set接口的实现类：HashSet、LinkedHashSet、TreeSet

### ① HashSet类（基于HashCode-无序）
特点：
* 基于HashCode实现元素不重复 - 无序
* 当存入元素的哈希码相同时，会调用equals确认，结果为true，则拒绝后者加入
* 无参构建初始容量为16（负载因子0.75，即+75%容量扩容）
* 底层使用的HashMap类，即将所有需要存储的值，通过HashMap去重存入
* 先判断hashCode是否相同，再==比较地址是否相同，再equals内容是否相同



```java
import java.util.HashSet;
import java.util.Set;
public class TestHashSet3 {
      public static void main(String[] args) {
            Student s1 = new Student("tom", 20, "male", 99.0); //  0x0000 1111
            Student s2 = new Student("jack", 23, "male", 88.0);
            Student s3 = new Student("mark", 22, "male", 95.0);
            Student s4 = new Student("anna", 21, "female", 93.0);
            Student s5 = new Student("tom", 20, "male", 99.0); //  0x0000 2222
            
            Set<Student> students = new HashSet<Student>(); // 快速导包：Ctrl+Shift+O
            students.add(s1); // 0x0000 1111
            students.add(s2);
            students.add(s3);
            students.add(s4);
            students.add(s1); // 0x0000 1111, add失败，去掉了重复：equals--->Object类提供的(this==obj)判断
            students.add(s5); // 0x0000 2222(内容相同，地址不同)也需要去重
            
            for (Student student : students) {
                  System.out.println(student.toString());
            }
            
            /*
             * 注意：HashSet没有必要在每次插入一个新值时对数据都去一一比较
             * 注意：HashSet调用equals方法进行比较，是具有前提的（两个对象的哈希码相同）
             */
            
            System.out.println(s1.equals(s5));
      }
}
class Student{
      String name;
      Integer age;
      String sex;
      Double score;
      public Student() {}
      public Student(String name, Integer age, String sex, Double  score) {
            super();
            this.name = name;
            this.age = age;
            this.sex = sex;
            this.score = score;
      }
      @Override
      public String toString() {
            return "Student [name=" + name + ", age=" + age + ", sex="  + sex + ", score=" + score + "]";
      }
      @Override
      public boolean equals(Object obj) {
            System.out.println("Student's equals() method  executed...");
            
            if (this == obj) { return true; }
            if (null == obj) { return false; }
            if (this.getClass() != obj.getClass()) { return false; }
            Student s = (Student)obj;
            
            if (this.toString().equals(s.toString())) {
                  return true;
            }
            
            return false;
      }
      @Override
      public int hashCode() {
            return (this.name.hashCode() + this.sex.hashCode() +  this.age.hashCode() + this.score.hashCode());
      }
}
```

### ② LinkedHashSet类（记录插入顺序）
特点：
* 继承自HashSet，又基于LinkedHashMap来实现的
* 底层使用LinkedHashMap（链表结构）存储，节点形式独立存储数据，并可以指向下一个节点，通过顺序访问节点，可保留元素的插入顺序 - 插入顺序
* 所有方法与HashSet相同，用法也一模一样



```java
import java.util.LinkedHashSet;
public class TestLinkedHashSet {
      public static void main(String[] args) {
            // 底层使用LinkedHashMap（链表结构）存储，节点形式完成单独数据的保存
            // 并可以指向下一个节点，通过顺序访问节点，可保留元素的插入顺序
            LinkedHashSet<String> set = new LinkedHashSet<String>();
            set.add("aa");
            set.add("bb");
            set.add("cc");
            set.add("dd");
            set.add("ee");
            
            for (String s : set) {
                  System.out.print(s + " ");
            }
            System.out.println();
            
            LinkedHashSet<Integer> lhs = new LinkedHashSet<Integer>();
            lhs.add(11);
            lhs.add(99);
            lhs.add(66);
            lhs.add(33);
            lhs.add(55);
            lhs.add(44);
            
            for (Integer i : lhs) {
                  System.out.print(i + " ");
            }
            
      }
}
```

### ③ TreeSet类（二叉树-自动排序）
特点：
* 基于排列顺序实现元素不重复 - 自动排序
* 实现了SortedSet接口，对所有插入集合的元素自动排序
* 元素对象的类型必须实现Comparable接口，指定排序规则（Integer/String类默认实现），通过重写CompareTo方法才能使用，以确定是否为重复元素



```java
import java.util.TreeSet;
public class TestTreeSet2 {
      public static void main(String[] args) {
            TreeSet<Student> stus = new TreeSet<Student>();
            
            stus.add(new Student("tom", 20, "male", 80.0));
            stus.add(new Student("jak", 20, "male", 90.0));
            stus.add(new Student("vae", 20, "male", 100.0));
            stus.add(new Student("com", 20, "male", 60.0));
            
            for (Student student : stus) {
                  System.out.println(student.toString());
            }
      }
}
class Student implements Comparable<Student>{
      String name;
      Integer age;
      String sex;
      Double score;
      public Student() {
            super();
      }
      public Student(String name, Integer age, String sex, Double  score) {
            super();
            this.name = name;
            this.age = age;
            this.sex = sex;
            this.score = score;
      }
      @Override
      public int compareTo(Student o) {
            //主要排序列
            if (this.score < o.score) {
                  return -1;
            } else if (this.score > o.score){
                  return 1;
            } else {
                  //次要排序列(排序的属性中可能是个多属性的对象)
                  if (this.age < o.age) {
                        return -1;
                  } else if (this.age > o.age) {
                        return 1;
                  }
            }
            
            return 0;
      }
      @Override
      public String toString() {
            return "Student [name=" + name + ", age=" + age + ", sex="  + sex + ", score=" + score + "]";
      }
}
```

### 2. HashSet排序的两种方法
1）遍历加入到List中使用Collections.sort(list)排序；
2）使用TreeSet的构造创建一个TreeSet对象实现自动排序；

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.TreeSet;
public class TestHashSetSort {
      public static void main(String[] args) {
            /* 对HashSet排序的两种办法验证 */
            HashSet<Integer> numSet = new HashSet<Integer>();
            numSet.add(55);
            numSet.add(11);
            numSet.add(66);
            numSet.add(88);
            numSet.add(33);
            System.out.println(numSet); // [33, 66, 55, 88, 11]
            System.out.println("------------------------");
            sortByTreeSet(numSet); // [11, 33, 55, 66, 88]
            System.out.println("------------------------");
            sortByList(numSet); // [11, 33, 55, 66, 88]
            
      }
      // 装进TreeSet里，自动排序
      public static void sortByTreeSet(HashSet<Integer> set) {
            TreeSet<Integer> numTree = new TreeSet<Integer>(set);
            System.out.println(numTree);
      }
      
      // 装进ArrayList里，通过sort排序
      public static void sortByList(HashSet<Integer> set) {
            List<Integer> numList = new ArrayList<Integer>();
            for (Integer i : set) {
                  numList.add(i);
            }
            Collections.sort(numList);
            System.out.println(numList);
      }
}
```