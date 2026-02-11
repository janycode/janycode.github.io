---
title: 01-JavaSE简单总结
date: 2017-6-28 23:09:27
tags:
- 面试题
categories: 
- 20_面试问题
- 01_技术问题
---

### 01-abstract 与 interface

>据说是常见面试题。

#### 1. 语法区别
![抽象类与接口](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316151743.png)
1. **构造方法**：抽象类可以有构造方法，接口中不能有构造方法
2. **成员变量**：抽象类和接口中都可以包含静态成员变量，抽象类中的静态成员变量的访问类型可以任意，但接口中定义的变量只能是public static final类型，并且默认即为public static final类型。
3. **普通成员变量**：抽象类中可以有普通成员变量，接口中没有普通成员变量
4. **普通方法**：抽象类中可以包含非抽象的普通方法，接口中的所有方法必须都是抽象的方法声明，不能有非抽象的普通方法
5. **静态方法**：抽象类中可以包含静态方法，接口中不能包含静态方法(JDK1.8中开始接口中可以定义 公开静态方法，拥有方法体，接口名直接调用)
6. **访问权限**：抽象类中的抽象方法的访问类型可以是public，protected和（默认类型,虽然eclipse下不报错，但应该也不行），但接口中的抽象方法只能是public类型的，并且默认即为public abstract类型。
7. **与类关系**：一个类可以实现多个接口，但只能继承一个抽象类。


#### 2. 应用场景
 2.1 接口（interface）应用场景
1. 类与类之前需要特定的接口进行协调，而**不在乎其如何实现**。
2. 作为能够实现特定功能的**标识**存在，也可以是什么接口方法都没有的纯粹标识。
3. 需要将一组类视为单一的类，而调用者只通过接口来与这组类**发生联系**。
4. 需要实现**特定的多项功能**，而这些功能之间可能完全没有任何联系。

 2.2 抽象类（abstract class）应用场景
一句话，在既需要统一的接口，又需要实例变量或缺省的方法的情况下，就可以使用它。最常见的有：
1. 定义了一组接口，但又**不想强迫每个实现类都必须实现所有的接口**。可以用abstract class定义一组方法体，甚至可以是空方法体，然后由子类选择自己所感兴趣的方法来覆盖。
2. 某些场合下，只靠纯粹的接口不能满足类与类之间的协调，还**必需类中表示状态的变量来区别不同的关系**。abstract的中介作用可以很好地满足这一点。
3. 规范了一组相互协调的方法，**其中一些方法是共同的**，与状态无关的，可以共享的，无需子类分别实现；而**另一些方法却需要各个子类根据自己特定的状态来实现特定的功能**。

>【总结】
>任何抽象类都应该适应真正的需求而产生的。
>当必须时，应该实现接口而不是到处添加额外级别的继承，并由此会带来额外的复杂性。这种额外的复杂性非常显著，如果你让某人去处理这种复杂性，只是因为你意识到由于以防万一而添加了新接口，而没有其他更有说服力的原因，那么好吧，如果我碰上了这种事，就会质疑此人所作的所有设计了。



### 02-整型包装类缓冲区

#### 1.什么是包装类？

* 基本数据类型所对应的引用数据类型。
* Object可统一所有数据，包装类的默认值是null。
* 包装类中实际上就是持有了一个基本类型的数据，作为数据的存储空间（Byte中有一个byte的value属性），还提供了常用的转型方法，以及常量。既可以存储值，又具备了一系列功能。
* 包装类型中提供了若干转型的方法，可以让自身类型与其他包装类型、基本类型、字符串相互之间进行转换。

![image-20230316151806690](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316151807.png)


#### 2.转型方法

8种包装类型中，有6种是数字型（Byte、Short、Integer、Long、Float、Double），均继承自 java.lang.Number 父类。

![image-20230316151819936](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316151820.png)

#####  ① 包装→基本：xxxValue()
**成员转型方法**，java.lang.Number 父类为所有子类分别提供了6种对应类型互相转型的方法，将自身类型转换成其他数字型；
```java
public class TestEncapsulationClass {
      public static void main(String[] args) {
            byte b = 10;
            Byte b1 = new Byte(b);
            Byte b2 = new Byte("-128"); // 只包含数字的字符串
            
            System.out.println(Byte.MIN_VALUE); // -128
            System.out.println(Byte.MAX_VALUE); // 127
            System.out.println(b2); // -128
            
            // 1. java.lang.Number 父类提供的转型方法 (服务数字型的 6 种包装类型)
            byte b3 = b1.byteValue();
            short sh1 = b1.shortValue();
            int i1 = b1.intValue();
            long l1 = b1.longValue();
            float f1 = b1.floatValue();
            double d1 = b1.doubleValue();
            System.out.println(b3 + " " + sh1 + " " + i1 + " " + l1 + "  " + f1 + " " + d1); // 10 10 10 10 10.0 10.0
      }
}
```

#####  ② 包装→基本：parseXxxx(String s)
**静态转型方法**，服务7种包装类型（除了Character包装类型都可以通过String构建）；
```java
            // 2. parseXxxx静态方法 (服务 8 种包装类型)
            byte bp = Byte.parseByte("123");
            System.out.println(bp); // 123
```

#####  ③ 基本→包装：valueOf(基本/字符串类型)
**静态转型方法**，服务8种包装类型；
```java
            // 3. valueOf(基本类型); valueOf(字符串类型); (服务 8 种包装类型)
            Byte bv = Byte.valueOf(b);
            System.out.println(bv); // 10
            //bv = Byte.valueOf("abc"); // Error: NumberFormatException
            bv = Byte.valueOf("124");
            System.out.println(bv); // 123
```
>【注意】使用字符串构建包装类型对象时，要保证类型的兼容，否则产生 NumberFormatException 异常。

#####  ④ 自动装箱、拆箱
JDK5之后，赋值时提供的自动装箱和自动拆箱:
```java
    Byte b4 = 40; // 【自动装箱】将基本类型直接赋值给包装类型
    byte b5 = b4; // 【自动拆箱】将包装类型引用赋值给基本类型（赋的是值）
```

#### 3. 整型包装类的缓冲区分析
首先，Java类加载时会预先创建了256个常用的整数包装类型对象(-128~127的常数)，在实际应用当中，对已创建的对象进行复用，节约内存效果明显。
其次，该缓冲区问题是一道经典**面试题**。

面试题代码如下：
```java
public class TestCache {
      public static void main(String[] args) {
            // 静态缓冲区 - 面试题
            // 缓冲区：大量的重复应用下，节约内存的效果明显
            
            // s1是地址值，调用静态方法valueOf(100)
            // 然后进行区间判断(-128~127),满足数组中一的Short数组对象
            Short s1 = 100; 
            // s2和s1是相同的地址值，在类加载时已经准备好了的 >
            // > 静态cache[]缓冲区数组中的地址取的，参考valueOf()源码
            Short s2 = 100; 
            Short s3 = 200;
            Short s4 = 200;
            
            System.out.println(s1 == s2); // true
            System.out.println(s3 == s4); // flase 【注意】因为s3/s4不在cache[]中
            
            System.out.println(s1.equals(s2)); // true
            System.out.println(s3.equals(s4)); // true
      }
}
```
运行结果：true **false** true true

#####  3.1 为什么是类加载时？
Short s1 = 100;  等价于 Short s1 = Short.valueOf(100);
如此行代码，在实际赋值给包装类Short时，会调用包装类Short类内的静态成员方法 valueOf(short s);将100传入。
然后我们看 valueOf 静态成员方法的实现：
```java
    public static Short valueOf(short s) {
        final int offset = 128;
        int sAsInt = s;
        if (sAsInt >= -128 && sAsInt <= 127) { // must cache
            return ShortCache.cache[sAsInt + offset];
        }
        return new Short(s);
    }
```
其中包含了一个 ShortCache 的私有静态内部类，如下：
```java
    private static class ShortCache {
        private ShortCache(){}

        static final Short cache[] = new Short[-(-128) + 127 + 1];

        static {
            for(int i = 0; i < cache.length; i++)
                cache[i] = new Short((short)(i - 128));
        }
    }
```
该 ShortCache 的私有静态内部类中，也是静态成员+静态代码块。

【综上】静态成员方法、静态代码块均在类加载时会被执行，在程序真正运行时，类加载的逻辑就已经进入内存准备好随时被调用执行。

##### 3.2 为什么是256个整数(-128-127)？
valueOf() 的静态成员方法 和 ShortCache的私有静态内部类两者的逻辑可以看出，只会对 -128~127之间的整数进行固定使用cache数组中已经在类加载时new出来的引用地址，这些地址已经指向了这256个常用的整数，在Java中因为这256个整数属于在编码中使用频率极高的整数，因此被称作是常用整数。

简言之：类加载已经准备好了256个整数，-128~127之间，只要有整数包装类赋值时调用valueOf()则都会从cache数组中读到值。

> Byte/Short/Integer/Long, 4 种整数型包装类都有其静态缓冲区，提前创建了256个常用对象，存了-128~127之间的常用整数。

#####  3.3 为什么可以节约内存？
![image-20230316151838979](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316151839.png)

如上图所示：
static final Short cache[] 的静态cache缓冲区存储了256个地址值，类加载时就会被JVM生成，整型包装类一旦赋值的是在-128~127之间的整数值时，valueOf()方法中的判断会自动去通过cache的下标索引到地址值，通过地址值取到整数值，return出去，完成赋值。

>该256个值在内存为堆中已经准备好的，可以反复使用的，故节约了内存，同时提高了赋值效率。



### 03-String引用比较

一道Java经典String类型引用的面试题：

```java
public class TestBasicString {
      public static void main(String[] args) {
            String s1 = "abc"; 
            String s2 = "abc"; 
            String s3 = new String("abc"); 
            System.out.println(s1 == s2); // true
            System.out.println(s1 == s3); // false
      }
}
```
运行结果如注释：**true** false

#### 1. String类的两个特点
* 字符串是常量，创建后不可改变；
* 字符串字面值存储在字符串池中，可以共享；



```java
    String s1 = "abc"; // 只有1个常量 abc，在常量池中
    String s2 = "abc"; // s1 s2中地址相同，均指向同1个常量 abc
    String s3 = new String("abc"); // 2个对象：常量池中1个对象，堆中1个对象
```

```java
    String s4 = new String("hello"); //2个对象：常量池中1个对象，堆中1个对象
    String s5 = "hello"; // 不创建对象，引用常量池中对象
    String s6 = "hello"; // 不创建对象，引用常量池中对象
```


#### 2. 常量池与字符串池
JVM内存管理中：栈、堆、方法区（方法区中有常量池，常量池中嵌套了字符串池）

![image-20230316151854242](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316151855.png)

因为== 为引用的地址的比较，加上图的示意后，不明觉厉。

>【结论】
>s1与s2两个String类型引用，存储的都是字符串字面值常量"abc"的地址，**存储在方法区的常量池中，仅有1份**，故s1 == s2为true；
>s1与s3之间，s3中存储的是new出来的，在**内存的堆区中的某一块区域**，地址也是不可预知的，因此s1与s3不等。

#### 3. String.intern()方法作用
参考jdk1.8API文档。
```java
public String intern()
```
返回字符串对象的引用。
当调用intern方法时，如果池已经包含与equals(Object)方法确定的相当于此String对象的字符串，则返回来自池的字符串。 
否则，此String对象将添加到池中，并返回对此String对象的引用。

由此可见，对于任何两个字符串s和t ， s.intern() == t.intern()是true当且仅当s.equals(t)是true 。

所有文字字符串和字符串值常量表达式都被实体化。
>一个字符串与该字符串具有相同的内容，但保证来自一个唯一的字符串池。才能进一步确保字符串引用是 == 的关系。

##### 示例1：追加字符串的引用比较
```java
public class TestStringCompare {
	public static void main(String[] args) {
		String s1 = "abc";
		String s2 = s1 + "def"; //通过反编译知道，此处使用StringBuilder.append()实现
		String s3 = "abcdef";
		String s4 = s2;
		
		System.out.println(s2 == s3); // false
		System.out.println(s4 == s3); // false
	}
}
```
输出结果：
**false
false**

>【原因】
>s2和s4指向同一个对象，为JVM优化后的，字符串通过引用变量追加则会使用StringBuilder在堆区new一块空间进行append完成追加；
>s3指向字符串常量，保存在方法区的常量池中的字符串池中，为方法区的地址信息保存在s3；
>故都为flase。

那么，我们继续看
##### 示例2：字符串引用追加后intern()加入常量池
```java
public class TestStringCompare {
	public static void main(String[] args) {
		String s1 = "abc";
		String s2 = s1 + "def";
		s2.intern(); // String类的成员方法intern()
		String s3 = "abcdef";
		String s4 = s2;
		
		System.out.println(s2 == s3); // true
		System.out.println(s4 == s3); // true
	}
}
```
输出结果：
**true
true**

>【原因】
>如String的intern()方法的描述套用：
>如果 s1+"def" 的结果 "abcdef" 在s2被赋值时是代码运行逻辑中**首次出现**，那么intern()方法则会成功将字符串 "abcdef" 加入池中(常量池中的字符串池)，进而s3会成为复用池中的常量字符串"abcdef"的地址。
>故都为true。

然后，我们再看
##### 示例3：使用intern()方法的返回值比较
```java
public class TestStringCompare {
	public static void main(String[] args) {
		String s1 = "abc";
		String s2 = s1 + "def";
		String s3 = "abcdef";
		String s4 = s2.intern();
		
		System.out.println(s2 == s3); // false
		System.out.println(s4 == s3); // true
		
	}
}
```
输出：
**flase
true**

>【原因】
>同示例2后的原因解释，String中的成员方法intern()的先决条件是：调用者字符串首次出现。
>此时s3的字符串"abcdef"为首次出现，进而后面s2的字符串内容与s3相同的情况下去调用intern()方法则会**加入常量池失败，会直接返回池中常量字符串的地址**赋值给s4，即同s3的地址（复用"abcdef"的地址）。
>故只有 s4 == s3 为 true。

#### 4. 字符串比较的再次深入探讨
延续上述示例修改：
```java
public class TestStringCompare {
	public static void main(String[] args) {
		String s1 = "abc";
		String s2 = s1 + "def";
		String s3 = "abcdef";
		
		System.out.println(s2.hashCode() == s3.hashCode()); // true
		System.out.println(s2.equals(s3)); // true
		System.out.println(s2 == s3); // false
		
	}
}
```
输出：
true
true
**false**

【**结论**】
String类型的引用比较时：
两者的hashCode()相同，equals()相同，但也不一定是同一个对象。
还要看对象的实际存储区域是否有所不同。



### 04-hashCode与equals

#### 0. Set集合去重原理

Set集合中**元素不重复**的基本逻辑判断示意图：
![重写hashCode和equals方法](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316151915.png)

#### 1. 如何重写hashCode()方法
##### 1.1 基本数据类型 - hashCode固定算法
Google首席Java架构师Joshua Bloch在他的著作《Effective Java》中提出了一种简单通用的hashCode算法：
1. 初始化一个整形变量，为此变量赋予一个非零的常数值，比如int result = 17;
2. 选取equals方法中用于比较的所有域，然后针对每个域的属性进行计算：
    (1) 如果是boolean值，则计算 **f ? 1:0**
    (2) 如果是byte\char\short\int,则计算**(int)f**
    (3) 如果是long值，则计算**(int)(f ^ (f >>> 32))**
    (4) 如果是float值，则计算**Float.floatToIntBits(f)**
    (5) 如果是double值，则计算**Double.doubleToLongBits(f)**，然后**返回的结果是long,再用规则(3)去处理long,得到int**
    (6) 如果是对象应用，如果equals方法中采取递归调用的比较方式，那么hashCode中同样采取递归调用hashCode的方式。否则需要为这个域计算一个范式，比如当这个域的值为null的时候，那么hashCode 值为0
    (7) 如果是数组，那么需要为每个元素当做单独的域来处理。如果你使用的是1.5及以上版本的JDK，那么没必要自己去重新遍历一遍数组，java.util.Arrays.hashCode方法包含了8种基本类型数组和引用数组的hashCode计算，算法同上，
　　java.util.Arrays.hashCode(long[])的具体实现:

```java
public static int hashCode(long a[]) {
        if (a == null)
            return 0;
 
        int result = 1;
        for (long element : a) {
            int elementHash = (int)(element ^ (element >>> 32));
            result = 31 * result + elementHash;
        }
 
        return result;
}
```
3. 对于涉及到的各个字段，采用第二步中的方式，将其依次应用于下式：

```java
result = result * 31 + [hashCode];
```
补充说明一点：
如果初始值result不取17而取0的话，则对于hashCode为0的字段来说就没有区分度了，这样更容易产生冲突。比如两个自定义类中，一个类比另一个类多出来一个或者几个字段，其余字段全部一样，分别new出来2个对象，这2个对象共有的字段的值全是一样的，而对于多来的那些字段的值正好都是0,并且在计算hashCode时这些多出来的字段又是最先计算的，这样的话，则这两个对象的hashCode就会产生冲突。还是那句话，hashCode方法的实现没有最好，只有更好。

故总结出hashCode()重写的**固定模板**如下：

```java
/**
 * 重写hashCode方法
 */
class TestHashCodeAutoCreate {
	byte b;
	short s;
	int i;
	long l;
	float f;
	double d;
	boolean bool;
	char c;
	String str; // 代表所有引用数据类型，因其拥有自身hashCode()方法
	
	// Eclipse 中 Alt+Shift+S,再 h 即可生成。
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + b;
		result = prime * result + (bool ? 1231 : 1237);
		result = prime * result + c;
		long temp;
		temp = Double.doubleToLongBits(d);
		result = prime * result + (int) (temp ^ (temp >>> 32));
		result = prime * result + Float.floatToIntBits(f);
		result = prime * result + i;
		result = prime * result + (int) (l ^ (l >>> 32));
		result = prime * result + s;
		result = prime * result + ((str == null) ? 0 : str.hashCode());
		return result;
	}
}
```



##### 1.2 包装类数据类型 - hashCode()方法相加
包装类型，重写hashCode就很简单，直接将所有包装类的属性调用hashCode()方法，相加求和即可。
举例包含了四种包装类型的属性，hashCode()方法重写示例：
```java
class TestHashCodeAutoCreate {
	Byte bb;
	Short sd;
	Integer ii;
	Long ll;
	Float ff;
	Double dd;
	Boolean bbool;
	Character cc;
	String sstr;
	
	// Eclipse 中 Alt+Shift+S,再 h 即可生成。
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((bb == null) ? 0 : bb.hashCode());
		result = prime * result + ((bbool == null) ? 0 : bbool.hashCode());
		result = prime * result + ((cc == null) ? 0 : cc.hashCode());
		result = prime * result + ((dd == null) ? 0 : dd.hashCode());
		result = prime * result + ((ff == null) ? 0 : ff.hashCode());
		result = prime * result + ((ii == null) ? 0 : ii.hashCode());
		result = prime * result + ((ll == null) ? 0 : ll.hashCode());
		result = prime * result + ((sd == null) ? 0 : sd.hashCode());
		result = prime * result + ((sstr == null) ? 0 : sstr.hashCode());
		return result;
	}
}
```
![image-20230316151935130](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316151935.png)

#### 2. 如何重写equals()方法
码来：
```java
	/**
	 * 5.5 为Worker添加equals方法，转字符串比较
	 */
	@Override
	public boolean equals(Object obj) {
		// 相同判断
		if (this == obj) {
			return true;
		}
		
		// null判断
		if (obj == null) {
			return false;
		}
		
		// 类型一致判断
		if (this.getClass() != obj.getClass()) {
			return false;
		}
		
		// 拆箱操作（类型一致）
		Worker w = (Worker)obj;
		
		// 比较内容（比较所有成员的值）
		if (this.toString().equals(w.toString())) {
			return true;
		}
		
		return false;
	}
```
验证如上图（本文就1张图）。

重写覆盖父类Object.equals()方法，五步走：
       1.判断引用地址是否相同
       2.判断引用地址是否为空
       3.确认对象类型是否一致
       4.转型 - 向下转型拆箱
       5.比较对象中的实际内容

>hashCode与equals的关系总结：
>1.hashcode相等，两个对象不一定相等，需要通过equals方法进一步判断；
>2.**hashcode不相等，两个对象一定不相等**；
>3.**equals方法为true，则hashcode肯定一样**；
>4.equals方法为false，则hashcode不一定不一样。



### 05-final,finalize,finally

#### ① final 修饰词

- final修饰类：最终类，不能被继承，如String、Math、System均为final修饰的类
- final修饰方法：最终方法，不能被覆盖
- final修饰变量：基本类型变量，值不可变；引用类型变量，地址不可变
- final作为形参使用的好处：拷贝引用，为了避免引用的地址值发生改变，例如被外部类的方法修改等，而导致内部类得到的值不一致，于是用final来让该引用不可改变。

#### ② finalize() 方法
当对象被判定为辣鸡对象时，由JVM自动调用此方法，用以标记垃圾对象，进入回收队列。
- 自动回收机制：JVM的内存耗尽，一次性回收所有辣鸡对象。
- 手动回收机制：使用 **System.gc()** 通知JVM触发垃圾回收。

#### ③ finally 关键字
finally 关键字：
作为异常处理的一部分，它只能用在try-catch语句中，并且附带一个语句块，表示这段语句最终一定会被执行（不管有没有抛出异常/不管是否有return），经常被用在需要释放资源的情况下。

#### finally 常用于释放资源
finally触发资源回收代码演示： - 可参考finalize()方法的描述
```java
public class TestFinally {
	public static void main(String[] args) {
		TestClass t = new TestClass ();
		
		try {
			t = null;
		} catch (Exception e) {
			System.err.println(e.getMessage());
		} finally {
			System.gc();
		}

		System.out.println(t); // null
	}
}

class TestClass {
    @Override
    protected void finalize() throws Throwable {
          super.finalize(); // 千万不要改
          System.out.println("进入JVM垃圾回收队列");
    }
}
```
![Java测试finally](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316151945.png)

#### finally 与 return 对比
finally与return测试例子1：
```java
public class TestFinally1 {
      public static void main(String[] args) {
            System.out.println( method(11) );
      }
      
      public static int method(int n) {
            try {
                  if (n % 2 == 0) {
                        throw new RuntimeException();
                  } else {
                        System.out.println("奇数");
                  }
                  return 1; // 执行了return
            } catch (Exception e) {
                  System.out.println(e.toString());
                  return 0;
            } finally {
                  System.out.println("finally执行...");
            }
      }
}
```
结果输出：
奇数
finally执行...
1

>【结论】
>**无论是否有异常/是否return，finally都会执行**。

finally与return测试例子2：
```java
public class TestFinally2 {
	public static void main(String[] args) {
		System.out.println( ma() ); // b为2或者0，结果都是 30
	}
	
	public static int ma() {
		int b = 2;
		//int b = 0;
		try {
			int n = 10;
			return b=n/b; // return 后的表达式一定会被执行
		} catch (Exception e) {
			System.out.println("####:" + b);
			return 20;
		} finally {
			System.out.println("@@@:" + b); // 10/2=5
			return 30;
		}
	}
}
```
当b=2时输出：
@@@:5
30
当b=0时输出：
####:0
@@@:0
30

>【结论】
>return如果放表达式，表达式一定会被执行。
>**finally中如果有return语句，一定会作为最终的方法返回值返回**。

finally与return测试例子3：
```java
public class TestFinally3 {
	public static void main(String[] args) {
		System.out.println( m1() ); // 30
	}
	
	public static int m1() {
		int a = 10;
		try {
			a = 20;
			throw new RuntimeException();
		} catch (Exception e) {
			a = 30;
			return a;
		} finally {
			a = 40;
		}
	}
}
```
结果输出：30

Why？？？或者说，如何解释呢？

此问题不能通过应用层的语法逻辑来解释，通过反编译对JVM执行的字节码指令进行分析：
![Java反编译](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316154045.png)
![Java中finally关键字使用分析](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316151959.png)

>【结论】
>在产生了异常时，异常代码块与finally代码块中都对局部变量修改的情况下，**异常代码块return了，而finally代码块中对局部变量的修改则不会作为最终的返回值**。
>原因：**通过反编译的字节码分析，方法的返回值在实际执行的return语句时，取的是栈顶的值进行返回。而finally的赋值在局部变量表中，不会成为最终返回值**。



### 06-synchronized与ReentrantLock

ReentrantLock实现类(Lock接口)详解：[【Java】Lock锁接口和实现类详解](https://simple.blog.csdn.net/article/details/104851461)
synchronized关键字线程同步详解：[【Java】线程的基本同步方式和常用方法](https://simple.blog.csdn.net/article/details/104824565)

#### 1. synchronized与ReentrantLock对比
| 比较点   | synchronized关键字                                           | ReentrantLock实现类(Lock接口)                                |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **构成** | 它是java语言的关键字，是原生语法层面的互斥，需要jvm实现      | 它是JDK 1.5之后提供的API层面的互斥锁类                       |
| **实现** | 通过JVM获取锁/释放锁                                         | api层面的获取锁释放锁，释放锁需要手动                        |
| **代码** | 采用synchronized不需要手动释放锁，当synchronized方法或者synchronized代码块执行完之后，系统会自动让线程释放对锁的占用，更安全 | ReentrantLock则必须要手动释放锁，如果没有主动释放锁，就有可能导致出现死锁，需要lock()和unlock()方法配合try-finally语句块完成 |
| **灵活** | 锁的范围是整个方法或synchronized代码块部分                   | 使用Lock接口的方法调用，可以跨方法，灵活性更强大             |
| **中断** | 不可中断，除非抛出异常(释放锁方式：<br>①代码执行完，正常释放锁；<br>②抛出异常，由JVM退出等待) | 可中断，持有锁的线程长期不释放的时候，正在等待的线程可以选择放弃等待(方法：<br>①设置超时方法 tryLock(long timeout, TimeUnit unit)时间过了就放弃等待；<br>②lockInterruptibly()放代码块中，调用interrupt()方法可中断) |
| **公平** | 非公平锁，不考虑排队问题直接尝试获取锁                       | 公平锁和非公平锁两者都可以，默认非公平锁，检查是否有排队等待的线程，先来者先得锁，构造器可以传入boolean值，true为公平锁，false为非公平锁 |
| **条件** | 无                                                           | 通过多次newCondition可以获得多个Condition对象，可以简单的实现比较复杂的线程同步的功能 |
| **高级** | 无                                                           | 提供很多方法用来监听当前锁的信息，如： <br>getHoldCount()  <br>getQueueLength() <br>isFair() <br>isHeldByCurrentThread() <br>isLocked() |
| **便利** | 方便简洁，由编译器去保证锁的加锁和释放                       | 需要手工声明来加锁和释放锁                                   |
| **场景** | 资源竞争不是很激烈的情况下，偶尔会有同步的情形下，synchronized是很合适的。原因在于，编译程序通常会尽可能的进行优化synchronized，另外可读性非常好 | 提供了多样化的同步，比如有时间限制的同步，可以被Interrupt的同步等 |
| **性能** | 低并发优先，性能好，可读性好                                 | 高并发优先，性能最佳                                         |



### 07-Comparable和Comparator

>Java 中为我们提供了两种比较机制：**Comparable** 和 **Comparator**。
>两个词的意思都是比较的意思，但实际又是 **可比较的** 和 **比较器**。
>所以很是疑惑。。。

#### 1. Comparable 自然排序比较
```java
java.lang 
public interface Comparable<T> {
	// 有且仅有 1 个公开抽象方法
	// 将此对象与指定的对象进行比较，返回正数、负数、0。  
	int compareTo(T o) 
}
```
Comparable 可以让实现它的类的对象进行比较，具体的比较规则是按照 **compareTo** 方法中的规则进行，为 **自然顺序比较**。

compareTo 方法的返回值有 3 种情况：
正数 - 集合升序：e1.compareTo(e2) > 0 即 e1 > e2
零值 - 集合不变：e1.compareTo(e2) = 0 即 e1 = e2
负数 - 集合降序：e1.compareTo(e2) < 0 即 e1 < e2

>自己定义的类如果想要使用有序的集合类，需要实现 Comparable 接口。
>自己定义的类还需重写 equlas(), hashCode() 方法，为了保证类的对象比较的一致性。

代码示例：
```java
public class TestComparable {
	public static void main(String[] args) {
		Teacher[] ts = new Teacher[] { 
				new Teacher("eric", 30), 
				new Teacher("abby", 29), 
				new Teacher("john", 22),
				new Teacher("sani", 33), };

		// Java中已有的接口、工具类，回调了现在写的 compareTo(Object o) 函数
		java.util.Arrays.sort(ts); // 调用工具
		for (Teacher teacher : ts) {
			System.out.println(teacher.toString());
		}
	}
}

class Teacher implements Comparable<Teacher> { // java.lang.Comparable
	String name;
	int age;

	public Teacher(String name, int age) {
		super();
		this.name = name;
		this.age = age;
	}

	// 需要根据接口进行抽象方法覆盖 - 参考JDK1.8手册
	@Override
	public int compareTo(Teacher o) {
		if (this.age > o.age) {
			return 1;
		} else if (this.age < o.age) {
			return -1;
		}

		return 0;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + age;
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Teacher other = (Teacher) obj;
		if (age != other.age)
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Teacher [name=" + name + ", age=" + age + "]";
	}
}
```
输出：
![Comparable](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316152010.png)

#### 2. Comparator 定制排序比较
```java
java.util 
@FunctionalInterface // 函数式接口
public interface Comparator<T> {
	// 比较其两个参数。 
	int compare(T o1, T o2);
	// JDK1.8 之后增加了很多其他的静态方法...参见 API 文档
}
```

Comparator 则是在外部制定排序规则，然后作为排序策略参数传给某些类。
比如 Collections.sort(), Arrays.sort(), 或者一些内部有序的集合（比如 SortedSet，SortedMap 等）。

使用方式主要分三步：
1. **创建**一个 Comparator 接口的实现类，并赋值给一个对象在 compare 方法中针对自定义类写排序规则；
2. 将 Comparator 对象作为**参数传递**给 排序类的某个方法；
3. 向排序类中**添加 compare 方法**中使用的自定义类。



```java
public class TestComparator {
	public static void main(String[] args) {
		// 示例1：添加时遵循构造传入的 Comparator 的 compare 规则进行
		// 1.创建一个实现 Comparator 接口的对象
		Comparator<String> comparator = new Comparator<String>() {
			@Override
			public int compare(String object1, String object2) {
				// return 1: 长的被换到后面；-1: 短的被换到后面
				return object1.length() > object2.length() ? 1 : -1;
			}
		};

		// 2.将此对象作为形参传递给 TreeSet 的构造方法中
		TreeSet<String> treeSet = new TreeSet<String>(comparator);

		// 3.向 TreeSet 中添加 步骤 1 中 compare 方法中设计的类的对象
		treeSet.add(new String("a"));
		treeSet.add(new String("bbb"));
		treeSet.add(new String("ccccc"));
		treeSet.add(new String("dd"));
		System.out.println(treeSet.toString()); // [a, dd, bbb, ccccc]
		
		// 示例2：排序时遵循 Comparator 的 compare 规则，首字母大小
		List<String> list1 = Arrays.asList("ccc", "ddd", "aaa", "bbb");
		list1.sort(new Comparator<String>() {
			@Override 
			public int compare(String o1, String o2) {
				// 按首字符排序规则，return 1:首字母大的换到后面; -1:首字母小的换到后面
				return o1.charAt(0) > o2.charAt(0) ? 1 : -1;
			}
		});
		System.out.println(list1); // [aaa, bbb, ccc, ddd]
	}
}
```
输出结果：
![输出结果](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316152017.png)

#### 3. 两者的比较总结
对于**已定义好的普通包装数据类型**（比如 String, Integer, Double…），它们默认实现了Comparable 接口，实现了 compareTo 方法，我们可以**直接使用**。

而对于**我们自定义的类**，它们可能在不同情况下需要实现**不同的比较策略**，我们可以新创建 Comparator 接口，然后实现特定的 compare 比较规则进行比较。



### 08-StringBuilder和StringBuffer

**StringBuilder**: 可变长字符串，JDK5.0提供，`运行效率快、线程不安全`。

**StringBuffer**: 可变长字符串，JDK1.0提供，`运行效率慢、线程安全`。

> 两者实现几乎一样，决定两者区别的是 StringBuffer 成员方法上增加了 `synchronized` 关键字修饰。

#### StringBuilder

```java
public final class StringBuilder
    extends Object
    implements Serializable, CharSequence
```

StringBuilder提供与StringBuffer的API，但不保证同步。 此类设计用作简易替换为StringBuffer在正在使用由单个线程字符串缓冲区的地方（如通常是这种情况）。 

在可能的情况下，`建议使用这个类别优先于StringBuffer ，因为它在大多数实现中将更快`。

StringBuilder的主要StringBuilder是**append**和**insert**方法，它们是重载的，以便接受任何类型的数据。 每个都有效地将给定的数据转换为字符串，然后将该字符串的字符附加或插入字符串构建器。 append方法始终在构建器的末尾添加这些字符; insert方法将insert添加到指定点。
一般情况下，如果某人是指的一个实例StringBuilder ，则sb.append(x)具有相同的效果sb.insert(sb.length(), x) 。

每个字符串构建器都有一个容量。 只要字符串构建器中包含的字符序列的长度不超过容量，则不需要分配新的内部缓冲区。 如果内部缓冲区溢出，则会自动变大。
StringBuilder不能安全使用多线程，`如果需要同步，那么建议使用StringBuffer`。

除非另有说明，否则将null参数传递给null中的构造函数或方法将导致抛出NullPointerException 。



#### StringBuffer

```java
public final class StringBuffer
	extends Object
	implements Serializable, CharSequence
```

一个线程安全的，字符的可变序列。一个字符串缓冲区就像一 String，但是可以修改。在任何一个时间点，它包含一些特定的字符序列，但该序列的长度和内容可以通过某些方法调用。 
字符串缓冲区是安全的使用多个线程。在必要的情况下，所有的操作在任何特定的实例的行为，如果他们发生在一些串行顺序是一致的顺序的方法调用所涉及的每个单独的线程的方法是同步的。

在StringBuffer主要是是append和insert方法的重载，以便接受任何数据类型。每个有效地将一个给定的数据到一个字符串，然后追加或插入字符串的字符的字符串缓冲区。的append方法总是添加这些字符缓冲区末尾的insert方法添加的特点；在指定点。

例如，如果z指一个字符串缓冲区对象的当前内容"start"，然后调用方法z.append("le")会导致字符串缓冲区包含"startle"，而z.insert(4, "le")会改变字符串缓冲区包含"starlet"。

一般来说，如果某人是一个StringBuffer实例，然后sb.append(x)具有相同的效果sb.insert(sb.length(), x)。

当一个操作发生涉及源序列（如添加或插入从源序列），这类同步只在字符串缓冲区进行操作，不在源。值得注意的是，虽然StringBuffer的设计是使用同时从多个线程安全的，如果构造函数或append或insert操作是通过源序列，跨线程共享，调用代码必须确保手术的手术时间的源序列一致的和不变的观点。通过使用一个不可变的源序列，或通过不共享在线程中的源序列，调用方在操作过程中保持一个锁，可以满足这一。

每一个字符串缓冲区都有一个容量。只要字符串缓冲区中包含的字符序列的长度不超过容量，就没有必要分配一个新的内部缓冲区阵列。如果内部缓冲区溢出，则自动作出较大的。



```java
public class TestString {
      public static void main(String[] args) {
            char[] chs = {'H', 'e', 'l', 'l', 'o'};
            String s = new String(chs); // 1.String本质为final修饰的字符数组 2.保证String的不变特性
            System.out.println(s);
            
            /*
             * 被final修饰，地址不变；元素，String类不做改变； "abc" -->  new char[]{'a','b','c'}
             */
            String s1 = "abc";
            /*
             * 实际：copyOf()，new一份新的长度为s1.length+s2.length的字符数组内存空间，依次拷贝s1元素值和"def"元素值
             */
            String s2 = s1 + "def";
            
            System.out.println(s2);
      }
}
```

```java
/**
* StringBuilder 可变长字符串
*/
public class TestStringBuilder {
      public static void main(String[] args) {
            String str = "Hello";
            
            StringBuilder sb = new StringBuilder(str);
            
            for (int i = 0; i < 100; i++) {
                  /**
                   * str += i; // 被JVM自动优化了，实际不会产生中间变量
                   * JDK的实现方式是什么？会产生中间变量 - 查看反编译bytecode
                   * 1.自动创建了StringBuilder对象
                   * 2.调用StringBuilder的构造方法
                   * 3.调用StringBuilder的append(int i)方法
                   * 4.调用StringBuilder的toString()方法转回为String类型，并赋值给str
                   */
                  //str += i; // 理论上：会产生若干的中间变量，浪费内存
                  sb.append(i); // StringBuilder直接在sb指向的对象空间里扩展空间追加
            }
            str = sb.toString();
            System.out.println(str);
      }
}
```

```java
/**
* 字符串比较与StringBuilder，反编译探讨字符串追加的自动优化
*/
public class TestStringBuilder2 {
      public static void main(String[] args) {
            String s1 = "abc"; // 1.直接声明；2.首次出现在池中被保存
            String s2 = s1 + "def"; // 1.自动优化  StringBuilder.append()和toString() 3.在堆区中
            //s2.intern(); // 必须满足"abcdef"在池中首次出现，手动将s2加入到常量池的字符串池中
            String s3 = "abcdef"; // 1.直接声明；2.首次出现在池中被保存
            String s4 = s2; // 返回s2在堆中的地址给s4
            String s5 = s2.intern(); // 返回s2在池中的地址给s5(手动将s2加入常量池会失败，因为"abcdef"不是首次出现)
            
            System.out.println(s2.hashCode()); // -1424385949
            System.out.println(s3.hashCode()); // -1424385949
            System.out.println(s4.hashCode()); // -1424385949
            System.out.println(s5.hashCode()); // -1424385949
            
            System.out.println(s2 == s3); // 空间不同，地址不同，故  false；如果s2.intern()手动成功加入常量池后，结果为 true
            System.out.println(s4 == s3); // s4地址在堆中，s3地址在池中，故flase；如果s2.intern()手动成功加入常量池后，结果为 true
            System.out.println(s5 == s3); // 均为"abcdef"首次出现的池中地址，故true
      }
}
```



【结论】
不论字符串被保存在堆中，还是常量池中字符串池里，只要内容一样，hashCode()也一样；

   * == 关系运算符对比的是String类型的地址，堆区与方法区中常量池地址在内存的不同区域，故不同；
        * "abc" + "def" 完全等价于 "abcdef" 的写法，常量池中只有一份(首次出现)，赋值String变量时地址均相同；
  * String类中的成员方法 intern() 可手动将堆中的字符串加入到字符串池中，但必须满足被加入的字符串为代码逻辑中首次出现；否则则会使用首次出现的字符串常量的地址去做对比。



### 09-易混概念汇总（图&表）

#### 9.1. private、default、protected、public 访问范围

![四个访问修饰符的访问范围](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316152030.png)



#### 9.2. abstract、static、final 作用和混用
![三大关键字的修饰和作用](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316152038.png)



#### 9.3. 成员内部类、静态内部类、局部内部类、匿名内部类 区别

![四种内部类的区别和特点](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316152045.png)



#### 9.4. abstract 抽象类、interface 接口 区别

![abstract 抽象类与interface 接口](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316152053.png)



#### 9.5. hashCode() 、 equals() 比较 问题

用Set集合元素不重复的基本逻辑，最能解释两者本质：
![hashCode() 与 equals()](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316152058.png)



#### 9.6. 八种包装类、256个整数的缓冲区 问题

![八种包装类](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316152105.png)
Byte/Short/Integer/Long, 4 种整数型包装类都有其静态缓冲区，提前创建了256个常用对象，存了-128~127之间的常用整数。
（非这256个数的范围的会重新再堆中new一个新的对象，注意地址的比较运算）
![包装类缓冲区问题](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316152113.png)



#### 9.7. Throwable 异常处理基本架构 分支

![异常处理基本架构类型](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316152121.png)
![异常处理基本架构类型](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316152128.png)



#### 9.8. List、Set、Queue、Map 常用数据集合体系 汇总

![常用数据集合体系汇总](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316152135.png)
![常用数据集合体系汇总](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316152143.png)
![常用数据集合体系汇总](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316152152.png)



#### 9.9. synchronized同步锁、ReentrantLock重入锁 区别

![synchronized同步锁与ReentrantLock重入锁](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316152200.png)



#### 9.10. 字节流、字符流 区别

![字节流与字符流](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316152208.png)
![字节流与字符流](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316152216.png)
![字节流与字符流](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316152224.png)



#### 9.11. 方法重载(Overload)、方法重写(Override) 区别

![方法重载(Overload)、方法重写(Override)](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316152229.png)



#### 9.12. final、finally、finalize() 区别

![final、finally、finalize()](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316152239.png)



#### 9.13. Comparable接口、Comparator接口 区别

详情参考：[【Java】Comparable和Comparator两接口区别总结](https://simple.blog.csdn.net/article/details/105054054)
![Comparable接口、Comparator接口](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316154014.png)



#### 9.14. 构造方法、静态代码块、动态代码块 执行顺序

![构造方法、静态代码块、动态代码块 执行顺序](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316152253.png)



#### 9.15 Map集合存储 null 值问题

![20200807134841-Map-null值问题](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200807134959.jpg)