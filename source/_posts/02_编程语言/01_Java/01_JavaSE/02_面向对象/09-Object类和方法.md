---
title: 09-Object类和方法
date: 2016-4-28 21:49:50
tags:
- JavaSE
- Object
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 02_面向对象
---

```java
class Anything {
    // do something
}
// 等价于 ↓↓↓
class Anything extends Object {
    // do something
}
```

在Java中所有的类都直接或间接的继承了 java.lang.Object 类。
Object是一个特殊的类，它是所有类的父类，是Java类中最高层的类。
因此在Java中创建一个类时，总是在继承，除非某个类已经制定要从其他类继承，否则它就是从 java.lang.Object 类继承而来。

### 常用方法
#### getClass().getName();
// 返回对象执行时的Class实例，然后再调用getname()方法可以取的类的名称。

```java
public class TestObjcet {
      public static void main(String[] args) {
            MyClass m = new MyClass();
            String s = m.getClass().getName();
            
            System.out.println(s); // com.test.object.MyClass (全限定名)
      }
}
class MyClass {
      int a = 10;
      
      public MyClass() {
            System.out.println("MyClass()");
      }
}
```

#### toString();
// 将一个对象返回为字符串形式，它会返回一个String实例。
// 在实际应用中通常会重写toString()方法，为对象提供一个特定的输出模式。

```java
public class TestObjcet {
      public static void main(String[] args) {
            MyClass m = new MyClass();
            System.out.println(m.toString("main")); // [Date]<File>:main:This is a log line.
      }
}
class MyClass {
      public MyClass() {}
      // 重写了toString()方法，优先调用子类的该方法
      public String toString(String name) {
            return "[Date]<File>:" + name + ":This is a log line.";
      }
}
```

#### equals();
// 比较的是两个对象的实际内容是否相等。

```java
public class TestEquals {
      public static void main(String[] args) {
            String s1 = new String("This is a dog.");
            String s2 = new String("This is a dog.");
            
            System.out.println(s1 == s2); // false，==对比的是引用的地址，两次new必然在堆里的地址不同
            System.out.println(s1.equals(s2)); // true，.equals()对比的是地址里的内容，所以内容是一样的
      }
}
```

#### hashCode();
// 是一个本地方法，返回对象的地址值
//  在String等封装类中对此方法进行了重写。方法调用得到一个计算公式得到的 int值
```java
public class TestObjcet {
      public static void main(String[] args) {
            MyClass m1 = new MyClass();
            MyClass m2 = new MyClass();
            
            int m1AddrInt = m1.hashCode();
            int m2AddrInt = m2.hashCode();
            System.out.println(m1AddrInt); // 2018699554, 一个地址值转换的int值
            System.out.println(m2AddrInt); // 1311053135, 一个地址值转换的int值
      }
}
class MyClass {
      int a = 10;
      
      public MyClass() {}
}
```
#### equals() 与 hashCode() 两者的关系:
①两个obj，如果equals()相等，hashCode()一定相等
②两个obj，如果hashCode()相等，equals()不一定相等

可以考虑在Java集合中，判断两个对象是否相等的规则是：
第一步，如果hashCode()相等，则查看第二步，否则不相等;
第二步，查看equals()是否相等，如果相等，则两obj相等，否则还是不相等。

#### wait(),wait(long),wait(long,int),notify(),notifyAll();
这几个函数体现的是Java的多线程机制
在使用的时候要求在synchronize语句中使用
wait()用于让当前线程失去操作权限，当前线程进入等待序列
notify()用于随机通知一个持有对象的锁的线程获取操作权限
notifyAll()用于通知所有持有对象的锁的线程获取操作权限
wait(long) 和wait(long,int)用于设定下一次获取锁的距离当前释放锁的时间间隔。