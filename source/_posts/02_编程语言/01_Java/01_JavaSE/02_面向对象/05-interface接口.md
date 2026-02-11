---
title: 05-interface接口
date: 2016-4-28 21:49:50
tags:
- JavaSE
- 接口
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 02_面向对象
---

![Java-接口interface定义和使用](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91cGxvYWQtaW1hZ2VzLmppYW5zaHUuaW8vdXBsb2FkX2ltYWdlcy8yMTQ3NTc3My03MWMxNGEwZTFmYzE2NmM1LnBuZw)

### 1.什么是接口
Java为单继承，当父类的方法种类无法满足子类需求时，可实现接口扩容子类能力。
即：Java中使用抽象类/父类表示通用属性时，每个类只能继承一个类，假如子类已经从一个父类继承了，就不能再继续继承另外的父类。但每个类可以实现多个接口，这样子类就拥有了更多的能力。

微观概念：接口是一种能力和约定。
* 接口的定义：代表了某种能力
* 方法的定义：能力的具体要求

### 2.接口语法
API(应用程序编程接口): Application Program Interface
接口相当于特殊的抽象类，定义方式、组成部分与抽象类类似。
接口的定义语法：
```java
interface 接口名 { }
```
接口的定义要求：
* 没有构造方法，不能创建对象
* 只能定义：公开静态常量、公开抽象方法


```java
public interface MyInterface {
    public static final String FIELD = "value";
    public abstract void method();
}
//public 关键字仅限用于接口在于其同名文件中被定义
```
```java
interface MyInterface {
      // 公开静态常量(只能): public static final
      public static final String A = "hello";
      String D = "good"; // public static final 默认隐式存在、修饰
      
      // 公开抽象方法(只能): public abstract
      public abstract void method();
      void m(); // public abstract 默认隐式存在、修饰
}
```
接口与抽象类的【相同】：
* 可编译为字节码文件(.class)
* 不能创建对象(接口不是类，也没有构造方法)
* 可以作为引用类型
* 具备Object类中所定义的方法


接口与抽象类的【不同】：
* 所有属性都**只能且默认是公开静态常量**，隐式使用public static final修饰
* 所有方法都**只能且默认是公开抽象方法**，隐式使用public abstract修饰
* 没有构造方法、没有动态/静态代码块



接口的使用语法：
```java
    // 增加/赋予1种/多种能力（逗号分隔） [约定]
    calss Sub extends Super implements 接口名,接口名 {
        @OverRide
        public 返回值 method() { ... }
    }
```
### 3.接口规范
* 任何类在实现接口时，必须实现接口中所有的抽象方法，否则此类为抽象类。
* 实现接口中抽象方法，访问修饰符必须是public。

### 4.接口引用
同父类一样，接口也可声明为引用，并指向真实类对象。
注意：
* 使用接口引用作为方法形参，实现更自然的多态（只关注能力-具备能力的类对象均可传入）
* 仅可调用接口中所声明的方法，不可调用实现类中独有的方法
* 可强转回真实类本身类型，进行独有方法调用（注意判断真实类对象 instanceof）

#### 接口引用的应用（伪代码示例-eclipse可编译运行）
```java
/* (可编译通过的伪代码) */
// 使用接口引用作为方法形参，实现更自然的多态（只关注能力-具备能力的类对象均可传入）
public class TestApply {
      public static void main(String[] args) {
            // 接口应用伪代码
            System.out.println("接口应用伪代码");
      }
}
abstract class 船 implements 会漂浮的 {
      public abstract void 漂浮(); // 子类去覆盖
}
class 小舟 extends 船 {
      public void 漂浮() {}
}
class 游艇 extends 船 {
      public void 漂浮() {}
}
class 木筏 extends 船 {
      public void 漂浮() {}
}
class 纸壳 {}
class 纸壳箱 extends 纸壳 implements 会漂浮的 {
      public void 漂浮() {
            System.out.println("纸壳箱通过胶带多次山绕，具备了可以承载重量后，漂浮在水面上");
      }
}
class 瓶子 {}
class 矿泉水瓶 extends 瓶子 implements 会漂浮的 {
      public void 漂浮() { }
}
class 树 {}
class 大木头 extends 树 implements 会漂浮的 {
      public void 漂浮() { }
}
class GameTeam {
//    public void 过汉江 (船 boat) {
      public void 过汉江 (会漂浮的 n) { // 使用接口引用作为方法形参，实现更自然的多态（关注行为、能力）
            System.out.println("n可以传入具备 会漂浮的 能力的对象均可-多态");
      }
}
interface 会漂浮的 {
      public abstract void 漂浮();
}
```
#### 接口引用指向实现类对象，以及强转回实现类对象
```java
/* interface.java */
// 定义了一种能力：会跑的
interface Runnable {
      public abstract void run();
}
// 定义了一种能力：会游的
interface Swimmable {
      public abstract void swim();
}
// 定义了一种能力：会爬的
interface Climbable {
      void climb();
}
// 定义了一种能力：会飞的
interface Flyable {
      void fly();
}
```
```java
/* TestApplyInterface.java */
public class TestApplyInterface {
      public static void main(String[] args) {
            Animal a = new Dog(); // 多态：父类引用指向子类对象
            
            // 接口引用指向实现类对象，仅可调用接口中所声明的方法
            Runnable r = new Dog(); // 指向一个会跑的xxx
            r.run();
            r = new Cat();
            r.run();
            r = new Bus();
            r.run();
            
            // 接口引用可强转回类的真实对象，进行独有的属性和方法的调用
            if (r instanceof Bus) {
                  Bus b = (Bus)r;
                  System.out.println(b.seatNum);
            }
      }
}
class Animal{
      String breed;
      int age;
      String sex;
      
      public void eat() {}
      public void sleep() {}
}
// implements 接口名 ： 增加/赋予一种能力 [约定]
class Dog extends Animal implements Runnable,Swimmable { // 实现--->落地
      String furColor;
      
      public void run() {
            System.out.println("狗在奔跑...");
      }
      @Override
      public void swim() {
            System.out.println("狗在游泳...");
      }
}
// implements 接口名,接口名 : 增加/赋予多种能力（逗号分隔） [约定]
class Cat extends Animal implements Runnable,Climbable{
      String furColor;
      
      public void run() {
            System.out.println("猫在奔跑...");
      }
      
      public void climb() {
            System.out.println("猫在爬树...");
      }
}
class Fish extends Animal{
      //public void swim() {}
}
class Bird extends Animal{
      //public void fly() {}
}
class Bus implements Runnable{
      int seatNum = 50;
      @Override
      public void run() {
            System.out.println("公交车在跑...");
      }
}
```
输出：
狗在奔跑...
猫在奔跑...
公交车在跑...
50

### 5.接口多继承
类与类：单继承，extends 父类名称
类与接口：多实现，implements 接口名1,接口名2,接口名3
接口与接口：多继承，extends 父接口1,父接口2,父接口3

> 接口继承多个父接口后，所有父接口的公开抽象方法也会被继承，进而在实现类中必须都要重写以覆盖抽象方法。

代码示例：
```java
public class TestMultiExtends {
      public static void main(String[] args) {
            IC ic = new ClassE();
            
            /* 将 ic 指向的对象强转为 ID - 拆箱
             * 因为ID接口继承了ma mb mc md方法，所以均可调用访问
             */
            // 调用ma方法，直接强转
            ((IA)ic).ma();
            // 调用mb方法，直接强转
            ((IB)ic).mb();
            // 调用mc方法
            ic.mc();
            // 调用md方法，直接强转
            ((ID)ic).md();
            
            // 全部为true, 因为接口继承，ic指向的类对象实现了所有接口
            System.out.println(ic instanceof IA); //true
            System.out.println(ic instanceof IB); //true
            System.out.println(ic instanceof IC); //true
            System.out.println(ic instanceof ID); //true
            System.out.println(ic instanceof ClassE); //true
      }
}
interface IA {
      void ma();
}
interface IB extends IA {
      void mb();
}
interface IC {
      void mc();
}
interface ID extends IB, IC {
      void md();
}
// 实现接口ID需要实现 ma() mb() mc() md() 方法覆盖。
class ClassE implements ID {
      
      public ClassE () {}
      
      @Override
      public void ma() {
            System.out.println("ma()");
      }
      @Override
      public void mb() {
            System.out.println("mb()");
      }
      @Override
      public void mc() {
            System.out.println("mc()");
      }
      @Override
      public void md() {
            System.out.println("md()");
      }
}
```

### 6.接口使用
#### 微观概念：接口是一种能力和约定。
* 接口的定义：代表了某种能力
* 方法的定义：能力的具体要求

#### 宏观概念：接口是一种标准。
耦合度：模块与模块之间的关联程度，关联的越密切，耦合越高；越松散，耦合越低。

思路顺序：
（1）接口/标准
（2）接口使用者
（3）接口实现者

```java
//(2) 接口的使用者
public class TestUsbInterface {
      public static void main(String[] args) {
            Computer computer = new Computer(); // 电脑
            
            Fan myFan = new Fan(); // usb风扇
            computer.on(myFan);
            computer.executeUSB();
            
            Lamp myLamp = new Lamp(); // usb台灯
            computer.on(myLamp);
            computer.executeUSB();
            
            USBDisk myDisk = new USBDisk(); // u盘
            computer.on(myDisk);
            computer.executeUSB();
            
      }
}

//(1) 接口/标准
interface USB {
      // 服务方法（做什么，由实现者制定），服务的背后，必须遵照USB的长宽高材质形状...做一样的设计
      public abstract void service();
}
//(3) 接口的实现者
class Computer {
      // 使用USB接口
      USB usb1; // = 一个具体的USB设备
      
      // 开机
      public void on(USB usb) { // 使用接口作为方法形参，更自然的使用多态
            this.usb1 = usb;
      }
      
      // 执行USB
      public void executeUSB() {
            usb1.service(); // 调用了接口中定义的方法（抽象方法）
      }
}
//(3) 接口的实现者(设备)
class Fan implements USB {
      // 旋转
      @Override
      public void service() {
            System.out.println("通电---旋转");
      }
}
class Lamp implements USB {
      @Override
      public void service() {
            System.out.println("通电---照明");
      }
}
class USBDisk implements USB {
      @Override
      public void service() {
            System.out.println("通电---读写");
      }
}
```

### 7.接口回调
先有接口的使用者，后有接口的实现者。

案例：对一组学生对象进行排序
```java
/** Comparable.java
* 接口/标准 （排序）
* 只有实现此接口的对象，才可以排序
*/
public interface Comparable<T> {  // <T> 泛型
      /**
       * 比较的方法
       * this 与 传入的对象进行比较
       * @param stu 另一个对象
       * @return 标准：正数 负数 0
       * 正数：stu靠前，this靠后
       * 负数：this靠前，stu靠后
       * 0   ：不变
       */
      public int compareTo(T stu); // T 代表任意接收任意类型
}
```

```java
/** Tool.java
* 排序工具
*/
public class Tool {
      
      /**
       * 排序方法：可以帮助任何类型的一组对象做排序(冒泡)
       */
      public static void sort(Student[] stus) {
            for (int i = 0; i < stus.length - 1; i++) {
                  for (int j = 0; j < stus.length-1-i; j++) {
				// 传入的对象数组元素被强转成了接口引用
				// instanceof 可以进一步确保 stus[j] 中实现了 接口 方法
				if (stus[j] instanceof Comparable) {
					Comparable currentStu = (Comparable)stus[j];
				
					// stus[j] 就是1个 new student(), 不强转直接多态使用也OK
					//Comparable currentStu = stus[j];
					
					if (currentStu.compareTo(stus[j+1]) > 0) {  // 接口的使用者
						Student tmp = stus[j];
						stus[j] = stus[j+1];
						stus[j+1] = tmp;
					}
				}
                  }
            }
      }
}
```

```java
/** TestCallback.java
* 接口回调
* @author Jerry
*
*/
public class TestCallback {
      public static void main(String[] args) {
            // 需求：对一组学生对象排序
            Student[] students = new Student[] {
                        new Student("tom", 20, "male", 99.0),
                        new Student("jack", 21, "male", 98.0),
                        new Student("annie", 19, "female", 100.0),
                        new Student("marry", 25, "female", 88.0),
                        new Student("john", 18, "male", 76.0),
            };
            
            //java.util.Arrays.sort(students); // Error: 没有排序规则
            
            // 工具调用者
            Tool.sort(students); // 默认升序
            for (Student student : students) {
                  System.out.println(student.name + " " +  student.score);
            }
      }
}
// 学生类
class Student implements Comparable<Student> { // 接口的实现者：implements 接口名<类型名>
      String name;
      int age;
      String sex;
      double score;
      public Student() {
      }
      public Student(String name, int age, String sex, double score) {
            this.name = name;
            this.age = age;
            this.sex = sex;
            this.score = score;
      }
      @Override
      public int compareTo(Student stu) { // this是当前学生，传入的stu是下一个学生
            if (this.score > stu.score) {
                  return 1;
            } else if (this.score < stu.score) {
                  return -1;
            }
            
            return 0;
      }
}
```

#### 接口回调的理解

```java
public class TestTeacherSort {
      public static void main(String[] args) {
            Teacher[] ts = new Teacher[] {
                  new Teacher("eric", 30),      
                  new Teacher("abby", 29),      
                  new Teacher("john", 22),      
                  new Teacher("sani", 33),      
            };
            
            // 1998年写好的接口、工具类，回调了现在写的 compareTo(Object o)  函数
            java.util.Arrays.sort(ts); // 调用工具（Java程序员，工具的使用者）
                        
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
}
```

#### 验证哥德巴赫猜想
输入一个大于6的偶数，输出这个偶数能够分解为哪两个质数的和。

使用Java接口interface的方式实现思路：
① 先有接口/标准 - 约定
② 程序员B - 先有接口使用者，以工具方法传参形式编写逻辑（接口回调） : void checkGoldBach()
③ 程序员A - 后有接口实现者，根据接口规范编写实现类逻辑（方法覆盖） : class ProgramerPrime implements MathTool {}

```java
import java.util.Scanner;

public class TestGoldBach {
	public static void main(String[] args) {
		int num = 0;
		
		num = getInputNum();
		
		// ② 程序员A - 调用(传入数字 和 实现类对象[接口引用接收实参])
		checkGoldBach(num, new ProgramerPrime());

	}
	
	/**
	 * 验证哥德巴赫猜想（接口回调）工具
	 */
	// ② 程序员B - 接口使用者（与程序员A并行开发）
	public static void checkGoldBach (int n, MathTool tool) {
		// 避免两端重复质数，因此只需要循环一半
		for (int i = 0; i <= n/2; i++) {
			// n = i + (n-i)
			// i 和 n-i 两个求和数均需要进行质数判断
			if (tool.getPrimeNum(i) && tool.getPrimeNum(n-i)) {
				if (n == i + (n-i)) {
					System.out.println("验证结果：" + i + " " + (n-i));
				}
			} else {
				continue;
			}
		}
	}
	
	public static int getInputNum () {
		Scanner input = new Scanner(System.in);
		int evenNum = 0;
		
		while (true) {
			System.out.print("请输入1个大于6的偶数：");
			evenNum = input.nextInt();
			
			if (evenNum > 6 && evenNum%2 == 0) {
				System.out.println("开始验证哥德巴赫猜想...");
				break;
			} else {
				System.out.println("输入不正确，请重新输入！");
			}
		}
		input.close();
		
		return evenNum;
	}
}

// ① 接口/标准 - 约定
interface MathTool {
	boolean getPrimeNum (int n);
}

// ② 程序员A - 写好实现类
class ProgramerPrime implements MathTool {
	/**
	 * 判断是否为质数（只能被1和自身整除）
	 * @param n 整数形参
	 * @return boolean类型
	 */
	@Override
	public boolean getPrimeNum(int n) {
		
		for (int i = 2; i < n; i++) {
			if (n % i == 0) {
				return false;
			}
		}

		return true;
	}
}
```
输出：
请输入1个大于6的偶数：20
开始验证哥德巴赫猜想...
验证结果：1 19
验证结果：3 17
验证结果：7 13