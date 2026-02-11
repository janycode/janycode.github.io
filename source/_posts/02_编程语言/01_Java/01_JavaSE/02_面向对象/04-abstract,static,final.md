---
title: 04-abstract,static,final
date: 2016-4-28 21:49:50
tags:
- JavaSE
- 抽象
- 静态
- final
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 02_面向对象
---

为什么不能用abstract修饰属性，私有方法，构造器，静态方法，final的方法？

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91cGxvYWQtaW1hZ2VzLmppYW5zaHUuaW8vdXBsb2FkX2ltYWdlcy8yMTQ3NTc3My00Njg5ZjhhMjY1MzRlODI4LnBuZw)



### abstract

抽象： 程序中不能被new创建的？父类，抽象，不完整，不具体，不能独立存在。通过 abstract 修饰类，意为抽象类，不能new对象
abstract： 抽象的，似是而非，像却又不是，具备某种对象的特征，但不完整
abstract修饰类概念： 不够完整，不够具体，不能独立存在
语法： `abstract class 类名 { }`
abstract修饰类：

* 抽象类，不能直接独立new对象；
* 可被子类继承，提供共性属性和方法；
* 可声明为引用，强制使用多态(更纯粹的多态)；
* 抽象类的构造方法作用：构建子类对象时，先构建父类对象，（父类共性 + 子类独有 = 完整子类对象）



经验：abstract修饰后的抽象父类，依附于子类对象存在。

abstract修饰方法概念：抽象方法，不够完整、不够具体
语法：`访问权限修饰符 abstract 返回值类型 函数名([参数列表]);`
abstract修饰方法：
* 只有方法声明，没有方法实现；
* 必须包含在抽象类中(abstract class XX{})；
* 强制子类必须实现该方法，提供完整的、具体的调用版本；



总结：
子类继承抽象类，子类必须覆盖父类中所有的抽象方法，否则子类还是抽象类；
抽象类中不一定有抽象方法，但有抽象方法的类一定是抽象类。 
```java
public class TestAbstract {
      public static void main(String[] args) {
            //new OneAnimal();  // 不能直接独立存在
            
            new NewDog(); // 构建子类对象，先构建父类对象（父类共性 + 子类独有 = 完整子类对象）
            
            OneAnimal a = new NewDog(); // 更纯粹的多态。
            
            a.eat();
      }
}
abstract class OneAnimal { // abstract修饰为抽象类，不能直接new对象（不够完整，不够具体，不改独立存在）
      String breed;
      int age;
      String sex;
      
      public OneAnimal() {
            System.out.println("OneAnimal()");
      }
      
      // 抽象方法（abstract修饰，只有方法声明，没有方法实现。必须包含在抽象类中，意为不够完整、不够具体）
      // 强制子类必须实现该方法，提供完整的、具体的调用版本。
      public abstract void eat();
      
      // 普通方法
      public void sleep() {
            System.out.println();
      }
}
class NewDog extends OneAnimal {
      
      public NewDog() {
            System.out.println("Dog()");
      }
      @Override
      public void eat() {
            System.out.println("狗在吃骨头...");
      }
}
```

abstract修饰类：
* 抽象类，不能直接独立new对象；
* 可被子类继承，提供共性属性和方法；
* 可声明为引用，强制使用多态(更纯粹的多态)；

abstract修饰方法：
* 只有方法声明，没有方法实现；
* 必须包含在抽象类中(abstract class XX{})；
* 强制子类必须实现该方法，提供完整的、具体的调用版本；

### static
`实例属性`，是每个对象各自持有的独立内存空间（多份），对象单方面修改，不会影响其他对象。
`静态属性`，static 修饰的实例属性，为。静态属性，是整个类共同持有的共享空间（一份），任何对象修改，都会影响其他对象。
>Java中规定：不能将方法体内的局部变量声明为 static！

静态属性：类属性
静态方法：类方法
不必创建对象，可直接通过类名访问【推荐】：类名.静态成员
```java
public class TestStaticField {
      public static void main(String[] args) {
            MyClass mc1 = new MyClass();
            mc1.a = 10;
            //mc1.b = 100;
            MyClass.b = 100;
            
            MyClass mc2 = new MyClass();
            mc2.a = 20;
            //mc2.b = 200;
            MyClass.b = 200;
            System.out.println(mc1.a + " " + mc2.a);
            System.out.println(MyClass.b + " " + MyClass.b);
            System.out.println();
            mc1.method2();
            System.out.println();
            mc2.method2();
      }
}
/**
* 类的信息：类的名字com.day16.t1_static.MyClass
* 父类是谁：java.lang.Object
* 实例属性：int a = 0
* 静态属性：int b = 0; double PI = 3.14;
* 实例方法：xxx
* 静态方法：xxx
* 类的创建时间：xxxx-xx-xx xx:xx:xx
* 类的编译JDK版本：JDK 8.xx.xx（主版本号.次版本号）
* 类的加密：MD5 checksum
*/
class MyClass {
      int a; // 实例属性
      static int b; // 静态属性
      static double PI = 3.14; // 静态属性（赋初始值）
      public static void method1() {
            System.out.println("method1()...");
      }
      
      public void method2() {
            //System.out.println(MyClass.a);
            System.out.println(MyClass.b);
            System.out.println(MyClass.PI);
            MyClass.method1();
      }
}
/* 输出：
10 20
200 200
200
3.14
method1()...
200
3.14
method1()...
*/
```
```java
// 统计一个类被创建的次数
public class TestApplyStaticField {
    public static void main(String[] args) {
        Student[] stus = new Student[10];
        
        for (int i = 0; i < stus.length; i++) {
            stus[i] = new Student();
        }
        
        System.out.println("count最终值：" + Student.getCount()); //10
    }
}


class Student {
    private static int count = 0;
    
    public Student() {
        count++;
    }
    
    public static int getCount() {
        return count;
    }
}
```


如这几个常见的静态方法，均使用类名直接调用
* Arrays.copyOf(); 
* Arrays.sort(); 
* Math.random(); 
* Math.sqrt();

静态方法规则：

1. 静态方法允许直接访问静态成员（不需要this.）；
2. 静态方法不允许直接访问非静态成员；
3. 静态方法中不允许使用this或super关键字；
4. 静态方法可以继承，不能重写(覆盖)、没有多态；

>static技巧: 在执行类时，希望先执行的初始化动作，可以使用static定义一个静态代码区域，在类加载时即会被执行仅有的一次。 

语法： 
```java
public class example {
    // 静态代码块：主要用于类执行前的一些初始化
    static {
        // do some init things.
    }
}
```

#### 类加载
JVM首次使用某个类时，需通过CLASSPATH查找该类的.class文件 
将.class文件中对类的描述信息加载到内存中，进行保存 
如：包名、类名、父类、属性、方法、构造方法... 
即：对一个类而言，加载的操作只做一次。
加载时机：

1. 创建对象
2. 创建子类对象
3. 访问静态属性
4. 调用静态方法

调用类加载语法: `Class.forName("全限定名");`


类加载时： 
* 触发：静态属性和静态代码块的执行 - （仅1次） 
* 顺序：静态属性初始化之后执行静态代码块 
* 作用：可谓静态属性赋值，或必要的初始化行为

```java
public class TestClassLoad {
      public static void main(String[] args) throws Exception {
            //new Super();
            //Super.method();
            //System.out.println(" ------------------------------------ ");
            //Super.method();
            //System.out.println(" ------------------------------------ ");
            //Class.forName("com.day16.t3_classloaded.Super"); // 静态属性, 静态代码块 (优先执行，且只执行1次)
            
            Class.forName("com.day16.t3_classloaded.Sub");
            System.out.println(" ------------------------ ");
            new Sub();
            System.out.println(" ************************ ");
            new Sub();
      }
}
//调用顺序： ↓↓↓
class Super {
   // 1.1静态属性（类层面：仅加载类时执行一次，归类所有，非对象所有）
   static String field2 = "父类静态属性";
   
   // 1.2静态代码块（类层面：仅加载类时执行一次，归类所有，非对象所有）
   static {
         System.out.println(field2);
         System.out.println("父类静态代码块");
   }
   // ----------------------父类执行顺序分割线-------------------------- 
   // 3.实例属性（创建对象时执行）
   String field1 = "父类实例属性";
   // 4.动态代码块（创建对象时执行）
   {
         System.out.println(field1);
         System.out.println("父类动态代码块");
   }
   
   // 5.无参构造方法（创建对象时执行）
   public Super() {
         super();
         System.out.println("父类无参构造方法");
   }
   // 6.类中静态方法（可被类名直接调用，可执行多次）
   public static void method() {
         System.out.println("父类类中的静态方法");
   }
}

class Sub extends Super {
   // 2.1静态属性（类层面：仅加载类时执行一次，归类所有，非对象所有）
   static String subfield2 = "子类静态属性";
   // 2.2静态代码块（类层面：仅加载类时执行一次，归类所有，非对象所有）
   static {
         System.out.println(subfield2);
         System.out.println("子类静态代码块");
   }
   // 7.实例属性（创建对象时执行）
   String subfield1 = "子类实例属性";
   // 8.动态代码块（创建对象时执行）
   {
         System.out.println(subfield1);
         System.out.println("子类动态代码块");
   }
   // 9.无参构造方法（创建对象时执行）
   public Sub() {
         super();
         System.out.println("子类无参构造方法");
   }
   // 10.类中静态方法（可被类名直接调用，可执行多次）
   public static void submethod() {
         System.out.println("子类类中的静态方法");
   }
}
/* 输出：
父类静态属性
父类静态代码块
子类静态属性
子类静态代码块
 ------------------------ 
父类实例属性
父类动态代码块
父类无参构造方法
子类实例属性
子类动态代码块
子类无参构造方法
 ************************ 
父类实例属性
父类动态代码块
父类无参构造方法
子类实例属性
子类动态代码块
子类无参构造方法
*/
```

#### static总结
（1）特点： 
1、static是一个修饰符，static修饰的成员变量称之为静态变量或类变量。 
2、static修饰的成员被所有的对象共享。 
3、static优先于对象存在，因为static的成员随着类的加载就已经存在。 
4、static修饰的成员多了一种调用方式，可以直接被类名所调用（类名.静态成员）。 
5、static修饰的数据是共享数据，对象中的存储的是特有的数据。 
（2）成员变量和静态变量的区别： 
1、生命周期的不同： 成员变量随着对象的创建而存在随着对象的回收而释放。 静态变量随着类的加载而存在随着类的消失而消失。 
2、调用方式不同： 成员变量只能被对象调用。 静态变量可以被对象调用，也可以用类名调用。（推荐用类名调用） 
3、别名不同： 成员变量也称为实例变量。 静态变量称为类变量。 
4、数据存储位置不同： 成员变量数据存储在堆内存的对象中，所以也叫对象的特有数据。 静态变量数据存储在方法区（共享数据区）的静态区，所以也叫对象的共享数据。 
（3）静态使用时需要注意的事项： 
1、静态方法只能访问静态成员（非静态既可以访问静态，又可以访问非静态）。 
2、静态方法中不可以使用this或者super关键字。 
3、主函数是静态的。

`静态方法规则`:
* 静态方法允许直接访问静态成员（不需要this.）；
* 静态方法不允许直接访问非静态成员；
* 静态方法中不允许使用this或super关键字（构造方法可以）；
* 静态方法可以继承，不能重写(覆盖)、没有多态；

![image-20200618143805542](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200618143808.png)



### final
概念：最后的，不可更改的。—— 保护类/方法/变量的功能和值

**final可修饰**：

* 类（最终类）：此类不能被继承，eg：String, Math, System均为final修饰的类 
* 方法（最终方法）：此方法不能被覆盖。 
* 变量（最终变量）：此变量值不能被改变（常量 - 通常变量名全大写），eg: Math.PI

**实例常量赋值**：显式初始化、动态代码块、构造方法 
要求： 
①DeadLine：在构造方法完成之前，为实例常量赋值即可； 
②如果在构造方法中为实例常量赋值，必须保证所有的构造方法都能对其正确赋值。 

```java
public class TestFinal {
	public static void main(String[] args) {
		//MyClass mc = new MyClass(50); //Deadline: 在对象完成创建之前对常量进行赋值
		System.out.println(mc.num);
		
		// 对象常量
		final int[] nums = new int[]{11, 22, 33}; // nums引用类型地址为常量不可修改，值可改变。
		nums[0] = 88;
	}
}

class MyClass {
	static final double numbers = 1.5; // ①静态常量赋值：显式初始化

	static {
		//numbers = 3.5; // ②静态常量赋值：静态代码块
	}
	
	final int num = 10; // ①实例常量赋值：显式初始化
	
	{
		//num = 20; // ②实例常量赋值：动态代码块
	}
	
	public MyClass() {
		//num = 30; // ③实例常量赋值：构造函数
	}
	
	public MyClass(int n) {
		//num = n;
	}
}
```

静态常量赋值：
显式初始化、静态代码块 
要求： 
①Deadline：在类加载完成之前，为静态常量赋值即可。

对象常量赋值：
final修饰基本类型：值不可变
final修饰引用类型：地址不可变

【总结】
final修饰类：此类不能被继承。 
final修饰方法：此方法不能被覆盖。 
final修饰变量：此变量值不可改变。（无初始值，只允许被赋值一次）

* 局部常量：显式初始化
* 实例常量：显式初始化、动态代码块、构造方法
* 静态常量：显式初始化、静态代码块
* 基本数据类型常量：值不可变。
* 引用数据类型常量：地址不可变。

final作为形参使用的原因：拷贝引用，为了避免引用值发生改变，例如被外部类的方法修改等，而导致内部类得到的值不一致，于是用final来让该引用不可改变。

```java
public class TestFinalArguments {
      public static void main(String[] args) {
            int a = 10;
            m1(a);
            System.out.println(a); // 10
            
            final int[] nums = {11, 22, 33};
            System.out.println(nums.length);
            m2(nums);
            System.out.println("m2()调用: " + nums.length);
            m3(nums);
            System.out.println("m3(): " + nums[0] + ",  nums.hashCode()=" + nums.hashCode()); // 88, hashCode() = 2018699554
            
            final Teacher[] t = {new Teacher(), new Teacher(), new  Teacher()};
            //t = m5(t); // t的地址不允许被修改指向
      }
      
      /** 【基本数据类型】
       * 形参final int a会复制一份实参a的值(10)，但是值不能被再次修改。
       * 形参的传入是对形参的初始化，相当于 final int a = 10(实参);
       * @param a final修饰的int类型参数
       */
      public static void m1(final int a) {
            System.out.println("形参a = " + a); // a=10
            //a = 20; // Error: a为形参且final修饰
      }
      
      /** 【引用数据类型：数组】
       * 形参为普通int类型数组的nums(方法的局部变量)的该方法调用时，会拷贝实参 final nums 的地址进来
       * 扩容后还是属于局部变量nums在方法内，不会对实参nums有任何改变（值和地址）。
       * @param nums int类型数组
       */
      public static void m2(int[] nums) {
            nums = java.util.Arrays.copyOf(nums, nums.length*2);
            System.out.println("m2()方法:" + nums.length);
      }
      
      /** 【引用数据类型：数组】
       * 形参final int[] ns会复制一份实参nums的值(地址)，但是地址不能修改，地址指向的内容可修改，即修改了实参数组的元素内容。
       * 形参的传入是对形参的初始化：final int[] ns = 实参引用;
       * @param ns final修饰的int类型数组
       */
      public static void m3(final int[] ns) {
            ns[0] = 88;
            System.out.println("ns.hashCode()=" + ns.hashCode()); //  hashCode() = 2018699554
      }
      
      /** 【引用数据类型：自定义类型数组】
       * 形参为引用类型对象t1，其age为final类型不可被修改，其t1自身为final不可修改指向。
       * @param t1 final修饰的类对象
       */
      public static void m4(final Teacher t1) {
            t1.name = "11";
            //t1.age = 31; // Error: age 为final修饰
            //t1 = new Teacher(); // Error: t1 为final修饰
      }
      
      /** 【引用数据类型：自定义类型数组】
       * 形参为可变长类型，age为final修饰的属性，不可更改。
       * @param teachers 可变长参数（同数组理解）
       * @return 返回一个类对象数组引用（原final修饰的数组引用不能再次被赋值）
       */
      public static Teacher[] m5(Teacher...teachers) {
            for (int i = 0; i < teachers.length; i++) {
                  teachers[i].name += i; // 自动类型提升，字符串拼接
                  //teachers[i].age += i; // Error: age为final类型的
            }
            
            return teachers;
      }
}
class Teacher {
      String name;
      final int age = 30;
}
/*
输出： 
形参a = 10 
10 
3 
m2()方法:6 
m2()调用: 3 
ns.hashCode()=2018699554 
m3(): 88, nums.hashCode()=2018699554
*/
```
