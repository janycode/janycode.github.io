---
title: 01-Java开发原则
date: 2018-5-22 22:18:03
tags:
- 理论规范
categories: 
- 11_理论规范
---


### 1. 面向对象五大设计原则

* 单一职责原则 **SRP**
  * Single Responsibility Principle
* 开放关闭原则 **OCP**
  * Open Close Principle
* 里氏替换原则 **LSP**
  * Liskov Substitution Principle
* 接口隔离原则 **ISP**
  * Interface Segregation Principle
* 依赖倒置原则 **DIP**
  * Dependency Inversion Principle
* 总结
  * `SOLID`原则



### 2. 设计模式七大原则

* 面向对象设计原则 × 5
* 迪米特法则 **LoD**
  * Law of Demeter
  * 也叫`最少知道原则`



#### 2.1 单一职责原则 SRP

* 概念

  * `每个模块、每个类、每个方法都只负责一件事情`
* 反例代码实现

```java
    public static void main(String[] args) {//测试
        int num1 = 2;
        int num2 = 2;
        //求和
        int sum = num1 + num2;
        System.out.println(sum);
        //求积
        int ji = num1 * num2;
        System.out.println(ji);
        int num3 = 3;
        int num4 = 4;
        int sum1 = num3 + num4;
        System.out.println(sum1);
    }
```

* 正例代码实现

```java
    public static void main(String[] args) {//测试
        int num1 = 2;
        int num2 = 2;
        getSum(num1 , num2);
        getJi(num1,num2);
        getSum(3,3);
    }

    /**
     * 求和
     * @param num1
     * @param num2
     * @return
     */
    public static int getSum(int num1 , int num2){
        return num1 + num2;
    }


    /**
     * 求积
     * @param num1
     * @param num2
     * @return
     */
    public static int getJi(int num1 , int num2){
        return num1 * num2;
    }
```

* main方法就只负责代码测试
* getSum方法只负责相加
* getJi方法只负责相乘



#### 2.2 开闭原则 OCP

* 概念
* `对功能扩展开放，对修改源码关闭`。Java世界里最基础的设计原则。

* 反例代码

```java
public class Product {

    private String name;
    private double price;
	......
    public double getPrice() {
        return price * 0.8 ;
    }
    ......
}
```

> 在Porduct类的源码进行修改的话，所有的商品都会进行打折！不满足开闭原则。

* 正例代码

```java
public class DiscountProduct extends Product {

    @Override
    public double getPrice() {
        double price  = super.getPrice();
        System.out.println(price);
        return price * 0.8;
    }
}
```

* 使用DiscountProduct类对Product类进行功能扩展，满足开闭原则。
* 注意事项

  * 作为开发者分为两类
    * 使用者：代码是别人写的，自己只使用。就不能修改源码，只能进行扩展
    * 作者：代码是自己写的。可以视情况修改源码。


#### 2.3 里氏替换原则 LSP

* 概念

  * Liskov Substitution Principle
  * 任何父类可以出现的地方，子类一定可以出现。
  * LSP是继承的基石，只有当子类可以替换掉父类，软件单位的功能不受到影响时，父类才能真正被复用，而子类也 能够在父类的基础上增加新的行为。
  * 子类可以无障碍地替换父类
* 反例代码

```java
public class Rectangle {

    private Integer width;
    private Integer height;

	//get、set方法

    public void reSize(){
        while (getWidth() <= getHeight()) {
            System.out.println("reSize");
            setWidth(getWidth()+1);
        }
    }
}
```

```java
  public class Square extends Rectangle {
  
      @Override
      public void setWidth(Integer width) {
          super.setWidth(width);
          super.setHeight(width);
      }
  
      @Override
      public void setHeight(Integer height) {
          super.setHeight(height);
          super.setWidth(height);
      }
  }
```

```java
  public static void main(String[] args) {
  
      Rectangle rectangle = new Rectangle();
      rectangle.setHeight(200);
      rectangle.setWidth(100);
      rectangle.reSize();
      System.out.println(rectangle);
  
  
      Square square = new Square();
      square.setWidth(300);
      square.reSize();
      System.out.println(square)
  
  }
```

* 以上代码中，正方形Square无法完全替换长方形Rectangle，当正方形使用reSize方法时，业务发生了改变，不满足里氏替换原则。



#### 2.4 接口隔离原则 ISP

* 概念
  * 使用`多个专门的接口比使用单一的总接口要好`。
  * 一个类对另外一个类的依赖性应当是建立在最小的接口上的。
  * 一个接口代表一个角色，不应当将不同的角色都交给一个接口。没有关系的接口合并在一起，形 成一个臃肿的大接口，这是对角色和接口的污染。

* 反例代码


```java
public interface Animal {
    void fly();
    void jump();
    void swim();
}
```

```java
public class Bird implements Animal {
    @Override
    public void fly() {
        System.out.println("Bird飞起来了");
    }

    @Override
    public void jump() {
        System.out.println("Bird跳起来了");
    }

    @Override
    public void swim() {
        System.out.println("Bird游起来了");
    }
}
```

```java
public class Fish implements Animal {
    @Override
    public void fly() {
        System.out.println("Fish飞起来了");
    }

    @Override
    public void jump() {
        System.out.println("Fish跳起来了");
    }

    @Override
    public void swim() {
        System.out.println("Fish游起来了");
    }
}
```

```java
public class Kangaroo implements Animal {
    @Override
    public void fly() {
        System.out.println("Kangaroo飞起来了");
    }

    @Override
    public void jump() {
        System.out.println("Kangaroo跳起来了");
    }

    @Override
    public void swim() {
        System.out.println("Kangaroo游起来了");
    }
}
```

* 以上代码，所有的动物都会有fly、jump、swim行为，因为Animal接口过于臃肿，对角色有污染。

* 正例代码


```java
public interface FlyAnimal {
    void fly();
}
```

```java
public interface SwimAnimal {
    void swim();
}

```

```java
public class Bird implements FlyAnimal {
    @Override
    public void fly() {
        System.out.println("Bird飞起来了");
    }

}
```

```java
public class Fish implements SwimAnimal {

    @Override
    public void swim() {
        System.out.println("Fish游起来了");
    }
}
```

* FlyAnimal接口的角色就针对会飞的动物即可
* SwimAnimal接口的角色就针对会游泳的动物即可



#### 2.5 依赖倒置原则 DIP

* 概念

  * 要求面向抽象进行编程，不要面向具体进行编程，这样就降低了客户与实现模块间的耦合。

* 反例UML图

  ![image-20230617184502237](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230617184503.png)

* 正例UML图

  ![image-20230617184534190](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230617184535.png)

* MVC模式中的依赖倒置

  ![image-20230617184606394](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230617184607.png)




#### 2.6 迪米特法则 LoD

* 概念

  * Low of Demete
  * 也叫最少知道原则，Least Knowledge Principle
  * 一个对象应当对其他对象有尽可能少的了解,不和陌生人说话。

* 反例代码

  ```java
  public class Computer {
  
      public void saveData(){
          System.out.println("保存数据");
      }
  
      public void closeScreen(){
          System.out.println("关闭屏幕");
      }
  
      public void powerOff(){
          System.out.println("关闭电源");
      }
  
  
  }
  ```

  ```java
  public class Demo02 {
  
      //作者
      //使用者
      public static void main(String[] args) {
          //电脑关机！（保存数据、关闭屏幕、关闭电源）
          Computer computer = new Computer();
          //保存数据
          computer.saveData();
          //关闭电源
          computer.powerOff();
          //关闭屏幕
          computer.closeScreen();
      }
  }
  ```

  * Demo02作为Computer的使用，对于Computer类中的方法知道的太多了，如果对“电脑关机”这个业务不太熟悉的话，容易导致“电脑关机”失败

* 正例代码

  ```java
  public class Computer {
  
      private void saveData(){
          System.out.println("保存数据");
      }
  
      private void closeScreen(){
          System.out.println("关闭屏幕");
      }
  
      private void powerOff(){
          System.out.println("关闭电源");
      }
  
      /**
       * 电脑关机
       */
      public void shutDown(){
          saveData();
          closeScreen();
          powerOff();
      }
  
  }
  ```

  ```java
  public class Demo02 {
  
      public static void main(String[] args) {
          //电脑关机！（保存数据、关闭屏幕、关闭电源）
          Computer computer = new Computer();
          computer.shutDown();
      }
  
  }
  ```

  * Demo02作为使用者只需要知道shutDown方法即可，不要知道shutDown方法内部流程，shutDown方法内部流程交给作者来维护。

#### 2.7 合成复用原则 CRP

Composite Reuse Principle

**目的**：防止类的体系庞大

**含义**：当要扩展类的功能时，优先考虑使用合成/聚合，而不是继承。

**解决**：当类与类之间的关系是"Is-A"时，用继承；当类与类之间的关系是"Has-A"时，用组合。

**实例**：如桥接模式，抽象和实现可以独立的变化，扩展功能时，增加实现类即可；比如装饰模式，只需要一个类，即可为一类类扩展新功能。对于显示图形需求，用图形Shape类，和显示Paint类实现。每个Shape类有一个Paint类指针负责图形绘制显示。Paint类派生RedPaint类和BluePaint类，传递给Shape类，实现图形不同颜色绘制，这样图形绘制逻辑和图形绘制实现可独立变化。某天增加需求，所有的绘制需要加边框，可增加PaintDecorator类，派生自Paint基类，每一个PaintDecorator类有一个Paint对象指针，增加虚函数AddedPaint，重写Paint的绘制方法，增加AddedPaint方法的调用。增加BorderPaintDecorator类，派生自PaintDecorator类，重写AddedPaint方法，增加添加绘制边框代码。这样新增加一个类可以对原始所有画笔类的功能进行扩充。