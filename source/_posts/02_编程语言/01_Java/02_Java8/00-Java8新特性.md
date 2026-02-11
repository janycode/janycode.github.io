---
title: 00-Java8新特性
date: 2016-4-30 22:12:21
tags:
- Java8
- Lambda
- Stream
categories: 
- 02_编程语言
- 01_Java
- 02_Java8
---



### 01. Java8 接口

* java8.0之前的接口组成
  * 公开静态常量
    * public static final 属性
  * 公开抽象方法
    * public abstract 方法
* java8.0的接口组成
  * `default 方法`
  * `static 方法`
* java9.0的接口组成
  * `private 方法`



#### 1.1 接口中的default方法

* 作用

  * 解决接口下不同实现资料的功能扩展问题
* 不使用default方法

```java
public interface MyInterface01 {

    void show();

}

public interface SonMyInterface01 extends MyInterface01{

    void show02();

}

public class MyInterface01Impl01 implements SonMyInterface01 {
    @Override
    public void show() {
        System.out.println("MyInterface01Impl01 show");
    }


    @Override
    public void show02() {

    }
}

public class MyInterface01Impl02 implements MyInterface01 {
    @Override
    public void show() {
        System.out.println("MyInterface01Impl02 show");
    }

}

```

* 需要编写大量的子接口对新的功能进行维护。

* 使用default方法

```java
public interface MyInterface02 {

    void show();

    default void show02(){
    }

}

public class MyInterface02Impl01 implements MyInterface02 {
    @Override
    public void show() {
        System.out.println("MyInterface02Impl01 show");
    }

    @Override
    public void show02() {
        System.out.println("MyInterface02Impl01 show02");
    }
}

public class MyInterface02Impl02 implements MyInterface02 {
    @Override
    public void show() {
        System.out.println("MyInterface02Impl02 show");
    }
}

```

* 哪一个实现子类需要对功能进行扩展，就重写default方法





#### 1.2 接口中的static方法

* 格式

```java
public static 返回值类型 方法名(参数类型 参数名1,参数类型 参数名2...){
    方法体;
    return 返回值;   
}
```

* 注意事项

  * 接口中的静态方法只能通过接口名调用，不能通过接口的实现子类对象调用。






### 02. lambda表达式

Lambda表达式和匿名内部类对象的区别？

* 概念
  * lambda表达式可以看作是匿名内部类对象的语法糖
* 区别
  * 使用匿名内部类对象会产生三个class文件，使用lambda表达式会产生两个class文件；也就是说，使用lambda表达式，不仅仅只是语法的精简，还可以使程序的执行效率更加高效。



#### 2.1 lambda使用场景

* 使用 Lambda 作为参数：开启线程

```java
public static void main(String[] args) {
    startThread();
}

public static void startThread(){
    new Thread(()-> System.out.println("线程要做的事~~~~")).start();
}
```

* 使用函数是接口作为返回值：数组排序

```java
Integer[] nums = {3,2,4,1,6};

Arrays.sort(nums,(o1,o2)-> o2 -  o1);

for (Integer num : nums) {
    System.out.println(num);
}
```



#### 2.2 lambda日志案例

* 非lambda表达式

```java
public static void main(String[] args) {
    String msg1 = "a";
    String msg2 = "b";
    String msg3 = "c";

    printLog1(2,msg1 + msg2 + msg3);
}

public static void printLog1(int level ,String msg){
    if (level == 1) {
        System.out.println(msg);
    }
}
```

* 当日志级别不为1的时候是不需要打印日志的，但是依然对日志内容进行了拼接，这就影响了程序的执行性能

* lambda表达式

```java
interface PrintLogInter {
    public String getMsg();
}

public static void main(String[] args) {
    String msg1 = "日志1";
    String msg2 = "日志2";
    String msg3 = "日志3";
    // lambada表达式
    printLog(2, () -> {
        return msg1 + msg2 + msg3;
    }); 
    // lambada简写
    printLog2(2,()-> msg1 + msg2 + msg3);
}

public static void printLog2(int level , SystemLog systemLog){
    if (1 == level) {
        System.out.println(systemLog.getMsg());
    }
}
```

* 使用lambda表达式，只有当日志级别为1的时候才会对日志内容进行拼接。



### 03. 函数式接口

* 概念

  * 指的是只有一个抽象方法的接口
  * 适用于函数式编程
  * 在java中函数式编程就是lambda表达式，也就是说函数式接口适用于lambda表达式
* 语法糖

  * 从语法使用上变得更加的方便
  * 比如：增强for循环就是for循环一种语法糖，底层还是迭代器
  * lambda表达式可以也是匿名内部类对象的语法糖，但是从原理上有着本质不同。
    * 匿名内部类对象就是一个接口、类的子类对象。
* 格式

```java
@FunctionalInterface // 用于标注接口是一个函数式接口，Java 8中专门为函数式接口引入的注解
public interface 接口名{
   	返回值类型 方法名(形参类型 参数名...);
}
```

> 一旦使用该注解来定义接口，编译器将会强制检查该接口是否确实有且仅有一个抽象方法，否则将会 
>
> 报错。需要注意的是，`即使不使用该注解`，只要满足函数式接口的定义，这`仍然是一个函数式接口`， 
>
> 使用起来都一样。

* 优势
  * 函数式接口比匿名内部类对象产生更少的字节码对象,提升java执行效率。



#### 3.1 函数式接口基本使用

* 函数式接口作为方法参数，且接口中的方法没有参数

  * MyFunctionalInterface02

```java
@FunctionalInterface
public interface MyFunctionalInterface02 {
    void show();
}
```

* Demo02

```java
public class Demo02 {
    /*
        new 接口名/类名(){
            重写方法
        }
     */
    public static void main(String[] args) {
        //使用匿名内部类对象
        method(new MyFunctionalInterface02() {
            @Override
            public void show() {
                System.out.println("show");
            }
        });

        //使用lambda表达式完整版
        method(() -> {
                System.out.println("show");
            }
        );

        //使用lambda表达式简洁版
        method(()->System.out.println("show"));
    }

    public static void method(MyFunctionalInterface02 inter){
        inter.show();
    }
}
```



* 函数式接口作为方法参数，且接口中的方法有参数

  * MyFunctionalInterface03

```java
@FunctionalInterface
public interface MyFunctionalInterface03 {

    void show(String msg1 ,Integer num , boolean flag);

}
```

* Demo03

```java
public class Demo03 {

    public static void main(String[] args) {
        //匿名内部类对象
        method(new MyFunctionalInterface03() {
            @Override
            public void show(String msg1, Integer num, boolean flag) {
                System.out.println(msg1 + "!" + num + "?" + (flag ? "yes" : "no"));
            }
        });
        //lambda表达式完整版
        method((String msg1, Integer num, boolean flag)->{
            System.out.println(msg1 + "!" + num + "?" + (flag ? "yes" : "no"));
        });
        //lambda表达式简洁版
        method(( msg1,  num,  flag)->System.out.println(msg1 + "!" + num + "?" + (flag ? "yes" : "no")));

    }

    public static void method(MyFunctionalInterface03 inter){
        inter.show("hello",250,true);
    }

}
```



* 函数式接口作为方法返回值，且接口中的方法有参数

  * MyFunctionalInterface04

```java
@FunctionalInterface
public interface MyFunctionalInterface04 {

    void show(String msg);
}
```

* Demo04

```java
public class Demo04 {

    public static void main(String[] args) {
        getInter1().show("helloworld1");

        getInter2().show("helloworld2");

        getInter3().show("helloworld3");
    }


    /**
     * 使用匿名内部类对象
     * @return
     */
    public static MyFunctionalInterface04 getInter1(){
        return new MyFunctionalInterface04() {
            @Override
            public void show(String msg) {
                System.out.println("msg : " + msg);
            }
        };
    }

    public static MyFunctionalInterface04 getInter2(){
        return (String msg) -> {
            System.out.println("msg : " + msg);
        };
    }

    public static MyFunctionalInterface04 getInter3(){
        return msg -> System.out.println("msg : " + msg);
    }


}
```



* 函数式接口的方法有返回值

  * MyFunctionalInterface05

```java
@FunctionalInterface
public interface MyFunctionalInterface05 {

    String getMsg(String msg);

}
```

* Demo05

```java
public class Demo04 {

    public static void main(String[] args) {
        //使用匿名内部类对象
        method(new MyFunctionalInterface05() {
            @Override
            public String getMsg(String msg) {
                return msg + "250";
            }
        });
        //使用lambda表达式完整版
        method((String msg) ->{
            return msg + "251";
        });
        //使用lambda表达式简洁版  如果方法体中只有一行代码，且这行代码是一个返回值，那么可以省略return
        method(msg ->  msg + "252");

    }

    public static void method(MyFunctionalInterface05 inter){
        String msg = inter.getMsg("helloworld");
        System.out.println(msg);
    }

}
```

* 总结

```java
(参数类型1 参数名1,参数类型2 参数名2)->{
	方法体;
};
```

* 可以省略参数类型
* 如果方法体只有一行代码，方法体的大括号可以省略
* 如果方法体只有一行代码，且是一个返回语句，那可以省略return




#### 3.2 预定义的函数式接口

* 概念
  * java已经内置的一些函数式接口，这些接口都有特定的作用。
* 常用函数式接口
  * Supplier接口
    * 对外提供数据
  * Consumer接口
    * 消费外部数据
  * Predicate接口
    * 对数据进行判断



#### 3.3 Supplier接口

* 概念

  * java.util.function.Supplier\<T> 对外提供数据，该数据的类型由 Supplier 接口的泛型决定。
* 常用方法

  * T get();
    * 获取T类型的数据
* 基本使用

```java
public static void main(String[] args) {
    String msg1 = "hello";
    String msg2 = "world";
    //将msg1和msg2进行拼接并返回。
    String msg = getMsg(msg1, msg2, () -> msg1 + " , " + msg2);
    System.out.println(msg);
}

public static String getMsg(String msg1 , String msg2 ,Supplier<String> supplier){
    return supplier.get();
}
```

* 综合案例

```java
public static void main(String[] args) {
    //通过Lambda表达式求出int数组中的最大值
    Integer[] nums = {3,1,4};
    Integer max = getMax(nums,()->{
        Integer max1 = nums[0];
        for (Integer num : nums) {
            if (max1 < num) {
                max1 = num;
            }
        }
        return max1;
    });
    System.out.println(max);
}

public static Integer getMax(Integer[] nums , Supplier<Integer> supplier){
    return supplier.get();
}
```



#### 3.4 Consumer接口

* 概念

  * Consumer接口是消费外部提供的数据
* 常用方法

  * void accept(T t);
    * 消费外部数据t
  * default Consumer\<T> andThen(Consumer<? super T> after) 
    * 用以串联多个消费动作
* 代码实现

```java
	public static void main(String[] args) {
        method("helloworld",msg-> System.out.println(msg));
        System.out.println("------------------");
        method02("hElloWorld",msg-> System.out.println(msg.toUpperCase()),msg-> System.out.println(msg.toLowerCase()));
    }

    public static void method(String msg , Consumer<String> consumer){
        consumer.accept(msg);
    }

    /*
    * 1,第一次打印全大写
    * 2，第二次打印全小写
    * */
    public static void method02(String msg , Consumer<String> c1 , Consumer<String> c2){
        c1.andThen(c2).accept(msg);
    }
```





#### 3.5 Consumer接口综合案例

* 需求

  * 下面的字符串数组当中存有多条信息，请按照格式“ 姓名：XX。性别：XX。 ”的格式将信息打印出来。
  * 要求将打印姓 名的动作作为第一个 Consumer 接口的Lambda实例
  * 将打印性别的动作作为第二个 Consumer 接口的Lambda实例
* 代码实现

```java
    public static void main(String[] args) {
        String[] array = {"迪丽热巴,女", "古力娜扎,女", "马尔扎哈,男"};
        for (String info1 : array) {

            printInfo(info1, new Consumer<String>() {
                @Override
                public void accept(String info) {
                    System.out.print("姓名 : " + info.split(",")[0] + "；");
                }
            }, new Consumer<String>() {
                @Override
                public void accept(String info) {
                    System.out.println("性别 : " + info.split(",")[1] + "。");
                }
            });

            printInfo(
                info1,
                info-> System.out.print("姓名 : " + info.split(",")[0] + "；"),
                info-> System.out.println("性别 : " + info.split(",")[1] + "。")
            );
        }
    }

    public static void printInfo(String info, Consumer<String> c1, Consumer<String> c2) {
        c1.andThen(c2).accept(info);
    }
```



#### 3.6 Predicate接口基本使用

* 概念

  * 用以处理条件判断

* 常用方法

  * ```java
    boolean test(T t);
    ```

    * 判断数据t

  * ```java
    default Predicate<T> and(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) && other.test(t);
    }
    ```

    * 进行两次判断，将两次判断的结果进行与操作

  * ```java
    default Predicate<T> negate() {
        return (t) -> !test(t);
    }
    ```

    * 进行取非操作

  * ```
    default Predicate<T> or(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) || other.test(t);
    }
    ```

    * 进行两次判断，将两次判断结果进行或操作

* 代码实现

```java
public static void main(String[] args) {

        boolean flag1 = method01("hello", msg -> msg.length() == 4);
        System.out.println(flag1);

        boolean flag2 = method02("hello", msg -> msg.length() == 5, msg -> msg.equals("hello"));
        System.out.println(flag2);

        boolean flag3 = method03("hello", msg -> msg.length() == 5);
        System.out.println(flag3);

        boolean flag4 = method04("hello", msg -> msg.length() == 5, msg -> msg.equals("world"));
        System.out.println(flag4);
    }

    public static boolean method01(String msg , Predicate<String> predicate){
        return predicate.test(msg);
    }

    public static boolean method02(String msg , Predicate<String> p1 , Predicate<String> p2){
        return p1.and(p2).test(msg);
    }

    public static boolean method03(String msg , Predicate<String> p1 ){
        return p1.negate().test(msg);
    }

    public static boolean method04(String msg ,  Predicate<String> p1 , Predicate<String> p2){
        return p1.or(p2).test(msg);
    }
}
```



#### 3.7 Predicate综合案例

* 需求

  * 将姓名长度为4,性别为女的信息保存并打印
* 代码实现

```java
    public static void main(String[] args) {
        String[] array = { "迪丽热巴,女", "古力娜扎,女", "马尔扎哈,男" };

        List<String> list = new ArrayList<>();
        for (String info : array) {
            boolean flag = saveInfo(
                    info,
                    info1 -> 4 == info1.split(",")[0].length(),
                    info1 -> "女".equals(info1.split(",")[1])
            );
            if (flag) {
                list.add(info);
            }
        }

        System.out.println(list);
    }

    public static boolean saveInfo(String info , Predicate<String> p1 , Predicate<String> p2){
        return p1.and(p2).test(info);
    }
```





### 04. Stream流

* 概念

  * 说到Stream便容易想到I/O Stream，而实际上，谁规定“流”就一定是“IO流”呢？
  * 在Java 8 中，得益于Lambda所带 来的函数式编程，引入了一个全新的Stream概念，用于解决已有集合 类库既有的弊端。

* 需求

  * 筛选出姓张且名字长度为3的人名并打印

```java
// 普通做法
public static void main(String[] args) {
    //筛选出姓张且名字长度为3的人名并打印.
    List<String> list = new ArrayList<>();
    list.add("张憨憨");
    list.add("老邱");
    list.add("张无忌");
    list.add("周芷若");
    list.add("张阔阔");

    List<String> list1 = new ArrayList<>();
    for (String name : list) {
        if (name.startsWith("张")) {
            list1.add(name);
        }
    }
    List<String> list2 = new ArrayList<>();
    for (String name : list1) {
        if (name.length() == 3) {
            list2.add(name);
        }
    }

    System.out.println(list2);
}
```

* 该 demo 作为开发者，不仅要关注做什么，同时还要关注怎么做！




```java
// 使用 stream 流式思想
public static void main(String[] args) {
    List<String> list = new ArrayList<>();
    list.add("张憨憨");
    list.add("老邱");
    list.add("张无忌");
    list.add("周芷若");
    list.add("张阔阔");

    list.stream()
        .filter(name->name.startsWith("张"))
        .filter(name->4 == name.length())
        .forEach(name-> System.out.println(name));
}
```

* 该 demo 作为开发者，只需要关注做什么即可！





#### 4.1 流式思想

* 概述

  * 流式思想类似于工厂车间的“生产流水线”。
  * Stream（流）是一个来自数据源的元 素队列 元素是特定类型的对象，形成一个队列。
  * 数据源 流的来源。 可以是集合，数组等
* 获取Stream流

  * `CollectionObj.stream`方法
    * 获取单列集合对应的Stream流对象
  * `Stream.of`方法
    * 获取数组对应的Stream流对象
* 代码实现

```java
    public static void main(String[] args) {
        //1,Collection集合
        List<String> list1 = new ArrayList<>();
        Stream<String> stream1 = list1.stream();

        //2,数组
        String[] strs = {"a","b","c"};
        Stream<String> stream2 = Stream.of(strs);

        //3,Map集合
        Map<Integer,String> map = new HashMap<>();
        Set<Integer> keySet = map.keySet();
        Collection<String> values = map.values();
        Stream<Integer> stream3 = keySet.stream();
        Stream<String> stream4 = values.stream();
    }
```





#### 4.2 Stream常用方法

* 方法分类

  * 延迟方法
    * 方法的返回值是Stream类对象；支持链式编程。
  * 终结方法
    * 方法的返回值不是Stream类对象；不支持链式编程。

* 常用方法

  * **逐一处理**：void `forEach`(Consumer<? super T> action)
    * 为 终结方法
      * 给流中每一个元素执行一个动作
      * 动作是什么，由Consumer接口决定
    * ![image-20200530140740562](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200530140740562.png)
  * **过滤处理**：Stream\<T> `filter`(Predicate<? super T> predicate)
    * 为 延迟方法
      * 返回一个能够匹配Predicate接口条件的流
    * ![image-20200530140902514](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200530140902514.png)
    * ![image-20200530140912045](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200530140912045.png)
  * **统计个数**：long `count`()
    * 为 终结方法
      * 返回流中的元素数量
    * ![image-20200530140925328](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200530140925328.png)
  * **取前几个**：Stream\<T> `limit`(long maxSize)
    * 为 延迟方法
      * 获取流中前maxSize个元素
    * ![image-20200530140940622](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200530140940622.png)
  * **跳过几个**：Stream\<T> `skip`(long n)
    * 为 延迟方法
      * 获取跳过n个元素之后的元素
    * ![image-20200530141117593](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200530141117593.png)
  * **将流组合**：Stream\<T> `concat`(Stream<? extends T> a, Stream<? extends T> b)
    * 为 延迟方法
      * 将两个流合并成一个新的流
    * ![image-20200530141132051](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200530141132051.png)





#### 4.3 Stream综合案例

* 需求

  * a. 第一个队伍只要名字为3个字的成员姓名； 
  * b. 第一个队伍筛选之后只要前3个人； 
  * c. 第二个队伍只要姓张的成员姓名； s
  * d. 第二个队伍筛选之后不要前2个人；
  * e. 将两个队伍合并为一个队伍； 
  * f. 打印整个队伍的Person对象信息
* 代码实现

```java
public static void main(String[] args) {
    List<Person> personList = new ArrayList<>();
    personList.add(new Person(1, "张三", 20));
    personList.add(new Person(2, "乔峰", 28));
    personList.add(new Person(3, "张无忌", 21));
    personList.add(new Person(4, "周芷若", 18));
    personList.add(new Person(5, "金毛狮王", 45));
    personList.add(new Person(6, "扫地僧", 48));
    personList.add(new Person(7, "张三丰", 58));
    personList.add(new Person(8, "裘千仞", 38));
    personList.add(new Person(9, "段誉", 20));
    personList.add(new Person(10, "尹志平", 25));

    Stream<Person> s1 = personList.stream()
        .filter(person -> person.getName().length() == 3)
        .limit(3);
    //s1.forEach(person -> System.out.println(person));

    Stream<Person> s2 = personList.stream()
        .filter(person -> person.getName().startsWith("张"))
        .skip(2);
    //s2.forEach(person -> System.out.println(person));

    Stream.concat(s1, s2).forEach(person -> System.out.println(person));
}
```

* ![image-20200530141404404](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200530141404404.png)
* 注意事项
  * 当一个Stream调用终结方法后，Stream处于关闭状态，就不能再去调用Stream类的方法了。





