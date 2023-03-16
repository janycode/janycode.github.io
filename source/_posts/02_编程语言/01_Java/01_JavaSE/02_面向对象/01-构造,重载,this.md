---
title: 01-构造,重载,this
date: 2016-4-28 21:49:50
tags:
- JavaSE
- 构造
- 重载
- this
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 02_面向对象
---

### 1.什么是对象

- 程序是为了模拟现实世界，解决现实问题而使用计算机语言编写的指令集和。
- 现实世界是由无数个"对象"组成。
- 万物皆对象。任何对象，都由自己的特征和行为。
  - 特征：称之为属性，一般为名词，代表对象有什么。
  - 行为：称之为方法，一般为动词，代表对象能做什么。
- 分析一个对象有什么？（手机：属性）
  - 颜色、品牌、价格、星号、重量、尺寸、材质
- 分析一个对象能做什么？（手机：方法）
  - 打电话、发短信、拍照、上网
- 程序中的对象
  - 来自于模板（类）创造出来程序中的实体（对象）。



### 2.类与对象的关系

- 类：定义了对象应具有的特征和行为，类是对象的模板
- 对象：拥有多个特征和行为的实体，对象是类的实例

```java
public class TestOOP {
      public static void main(String[] args) {
            // 1.创建dog类型的对象，并保存在dog1变量中
            Dog dog1 = new Dog();
            
            // 2.赋值属性：为各个属性赋值
            dog1.breed = "金毛";
            dog1.age = 5;
            dog1.sex = "公";
            dog1.furcolor = "黄色";
            
            // 3.访问属性：从各个属性中取值
            System.out.println(dog1.breed);
            System.out.println(dog1.age);
            System.out.println(dog1.sex);
            System.out.println(dog1.furcolor);
            
            // 4.调用对象的方法
            dog1.eat();
            dog1.sleep();
      }
}
class Dog {
      
      // 属性 - 实例变量
      String breed; // 品种
      int age; // 年龄
      String sex; // 性别
      String furcolor; // 毛色
      
      // 方法 - 实例函数
      public void eat() {
            // TODO Auto-generated method stub
            System.out.println("eat...");
      }
      
      public void sleep() {
            // TODO Auto-generated method stub
            System.out.println("sleep...");
      }
}
```





### 3.实例变量与局部变量

- 属性、实例变量、成员变量，三者等价
- 实例方法、成员方法，二者等价
- reference - 引用、句柄、指针



![image-20230316134936318](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316134937.png)



### 4.方法重载

- 方法重载（Overload）：一个类中定义多个相同名称的方法
- 到底采用哪种形式，需要取决于调用者给定的方法的参数
- 要求：
  - 方法名称相同
  - 参数列表不同（类型、个数、顺序）
  - 与访问修饰符、返回值类型、形参的名称均无关
- 调用带有重载的方法时，需要根据传入的参数去找到对应的方法
- 好处：屏蔽使用差异，方便、灵活。



```java
/**
* @author Jerry
* 验证构造方法的重载
*/
public class TestConstratorOverload {
      public static void main(String[] args) {
            new Teacher();
            
            new Teacher("Jared");
            
            new Teacher("Marry", 20);
      }
}

class Teacher {
      String name;
      int age;
      char sex;
      double salary;
      
      public Teacher() {
            System.out.println("---Teacher()---");
      }
      
      public Teacher(String name) {
            System.out.println("---Teacher(" + name + ")---");
      }
      
      public Teacher(String name, int age) {
            System.out.println("---Teacher(" + name + ", " + age +  ")---");
      }
}
输出：
---Teacher()---
---Teacher(Jared)---
---Teacher(Marry, 20)---
```





### 5.构造方法

- 构造方法（Constructor）：类中的特殊方法，主要用于创建对象
- 要求：
  - 名称与类名完全相同（包括大小写）
  - 没有返回值类型修饰符（void也没有）
  - 创建对象时触发构造方法的调用，不可通过.访问符访问
- 对象创建的过程：
  - 内存堆区中开辟对象空间
  - 为各个属性赋予初始值（默认0 / 0.0 / null）
  - 执行构造方法中的代码
  - [将对象的地址赋值给变量]
- 构造方法也可以重载，遵循重载规则
- 【注意】
  - 如果没有显示定义构造方法，编译器会默认提供一个无参构造方法
  - 如果显示定义了有参构造方法，则无参构造方法必须也要显示定义
  - 没有public声明的构造函数，在非同包中不能被访问

```java
public class TestConstructor {
      public static void main(String[] args) {
            // 无参构造 - test
            Student stu1 = new Student();
            System.out.println(stu1.name + " " + stu1.age + " " +  stu1.sex + " " + stu1.score);
            
            // 有参构造 - test
            Student stu2 = new Student("tom", 20, '男', 99.0);
            System.out.println(stu2.name + " " + stu2.age + " " +  stu2.sex + " " + stu2.score);
            
            stu1.siHay();
      }
}
class Student {
      String name;
      int age;
      char sex;
      double score;
      
      // 无参构造方法
      public Student() {
            System.out.println("--- Student() ---");
      }
      
      // 有参构造方法
      public Student(String n, int a, char s, double sc) {
            name = n;
            age = a;
            sex = s;
            score = sc;
            System.out.println("--- 有参构造函数被执行 ---");
      }
      
      public void siHay() {
            System.out.println("Hi~~~");
      }
}
输出：
--- Student() ---
null 0 0.0
--- 有参构造函数被执行 ---
tom 20 男 99.0
Hi~~~
```





### 6.this关键字

- this是类中的默认引用，代表当前实例(当前对象)。
- this关键字的三种用法：
  - 调用实例属性、实例方法，eg：this.name、this.sayHi()
  - 调用本类中的其他构造方法，eg：this()、this(实参)
    - this([实参])必须在构造方法的首行，仅可在构造方法中使用
  - 表示当前方法
- 默认情况下，实例属性和方法前的this.隐式存在

```java
public class TestThisKeyword2 {
      public static void main(String[] args) {
            Teacher t1 = new Teacher("Jerry", 30, '男', 15000.0);
            System.out.println(t1.name);
            System.out.println(t1.age);
            System.out.println(t1.sex);
            System.out.println(t1.salary);
      }
}

class Teacher {
      String name;
      int age;
      char sex;
      double salary;
      
      public Teacher() {}
      
      public Teacher(String name, int age, char sex) {
            this.name = name;
            this.age = age;
            this.sex = sex;
            
            System.out.println("3参构造执行完毕!");
      }
      
      public Teacher(String name, int age, char sex, double salary) {
            //this.name = name;
            //this.age = age;
            //this.sex = sex;
            this(name, age, sex);
            this.salary = salary;
            System.out.println("4参构造执行完毕！！");
      }
}
输出：
3参构造执行完毕!
4参构造执行完毕！！
Jerry
30
男
15000.0
```

