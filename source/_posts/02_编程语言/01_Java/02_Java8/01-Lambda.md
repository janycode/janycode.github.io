---
title: 01-Lambda
date: 2016-4-28 22:12:21
tags:
- Java8
- Lambda
categories: 
- 02_编程语言
- 01_Java
- 02_Java8
---

### 1. 接口中的实现方法

① 使用 **default** 关键字就可以给接口增加一个**非抽象的方法实现**；
② 接口还可以存在 **static** 静态方法实现，使用 **接口名.静态方法名** 的形式直接调用；
>包括声明@FunctionalInterface限制接口只有1个抽象方法时，也可以增加①或②。

代码示例：
```java
public class TestInterface {
      public static void main(String[] args) {
            TestInter ti = new TestInter() {
                  @Override
                  public void m1() {
                        System.out.println("m1():匿名内部类实现该接口，只需要覆盖m1()");
                  }
            };
            
            ti.m1();
            ti.m2();
            TestInter.m3();
      }
}
/**
* 接口
* 测试Java8新特性，default和static在接口中定义的场景
* @FunctionalInterface 声明为函数式接口，只能有 1 个公开抽象方法
*/
@FunctionalInterface
interface TestInter {
      void m1(); // 公开抽象方法
      default void m2() {
            System.out.println("m2():default修饰的方法实现，在接口中...");
      }
      public static void m3() {
            System.out.println("m3():static修饰的方法实现，在接口中...");
      }
}
```

### 2. Lambda 表达式
概念：允许把函数作为一个方法的参数，代码简洁紧凑（函数作为参数传递到方法中）
语法：
```java
函数式接口 变量名 = (参数1,参数2...)->{
    //方法体
};
```
新的操作符：**->** （箭头操作符）
* 箭头操作符左侧 **(参数1,参数2,...)->** 表示参数列表
* 箭头操作符右侧 **->{...}** 表示方法体

Lambda 表达式特点：
* 形参列表的数据**类型会自动推断**
* 如果形参列表为空，**只需保留()**
* 如果形参列表**只有1个参数，可以省略()**，只要参数名字即可
* 如果执行语句**只有1句，且无返回值，{}可以省略**
* 若有返回值，仍想省略{}，return也省略，**必须保证执行语句为1句**
* Lambda表达式**不会生成单独的内部类.class文件**
* Lambda表达式**访问局部变量**时，变量要修饰为 **final**，如果没加会隐式自动添加

示例代码：
```java
public class TestBasicLambda {
      public static void main(String[] args) {
            // 普通方式
            List<String> list1 = Arrays.asList("aaa", "ddd", "ccc",  "bbb");
            list1.sort(new Comparator<String>() {
                  @Override // 按首字符排序规则
                  public int compare(String o1, String o2) {
                        return o1.charAt(0) > o2.charAt(0) ? 1 : -1;
                  }
            });
            System.out.println(list1); // aaa bbb ccc ddd
            
            // Lambda表达式方式：实现接口中唯一1个方法的匿名内部类
            List<String> list2 = Arrays.asList("aaa", "ddd", "ccc",  "bbb");
            list2.sort( (s1, s2)->{ return s1.charAt(0)>s2.charAt(0) ?  1 : -1; });
            System.out.println(list2); // aaa bbb ccc ddd
      }
}
```

### 3. 方法引用 ::
Lambda表达式的一种简写形式。
如果Lambda表达式方法体中**只是调用一个特定的已存在的方法**，则可以使用方法引用。
使用 :: 操作符将对象或类和方法的名字分割开，有 4 种形式：
**① 对象::实例方法
② 类::静态方法
③ 类::实例方法
④ 类::new**
注意：调用的方法的**参数列表与返回值类型**，都与**函数式接口**中的方法参数列表与返回值**类型一致**。

代码示例（使用到了函数式编程的 4 个核心接口）：
```java
public class TestMethodRef {
    public static void main(String[] args) {
        // Lambda表达式简化了匿名内部类，方法引用简化了Lambda表达式
        // 1.对象::方法名
        Consumer<String> con = (s)->System.out.println(s); // lambda
        con.accept("hello,world"); // hello,world
        Consumer<String> con2 = System.out::println; // 方法引用
        con2.accept("哈哈哈"); // 哈哈哈
        
        // String也可以是自定义类
        String s = new String("hello,world");
        //Supplier<Integer> sup = ()->s.length(); // lambda
        Supplier<Integer> sup = s::length; // 方法引用
        System.out.println(sup.get()); // 11
        
        // 2.类名::静态方法(不常用)
        //Comparator<Integer> com = (x,y)->Integer.compare(x,y); // lambda
        Comparator<Integer> com = Integer::compare; // 方法引用
        System.out.println( com.compare(1, 2) ); // -1: 1 < 2
        
        TreeSet<Integer> ts = new TreeSet<Integer>(com);
        System.out.println(ts); // ts就会遵循com指向的 Integer中的Compare方法进行排序
        
        // 3.类名::实例方法名
        //Function<String, Integer> fun = s->s.hashCode(); // lambda
        Function<String, Integer> fun = String::hashCode; // 方法引用
        Integer hash = fun.apply(s);
        System.out.println(hash); // 2137655864
        
        // 4.类::new 即 类名::构造方法
        //Supplier<String> supp = ()->new String(); // lambda
        Supplier<String> supp = String::new; // 方法引用
        System.out.println(supp.get().getClass()); // class java.lang.String
    }
}
```
