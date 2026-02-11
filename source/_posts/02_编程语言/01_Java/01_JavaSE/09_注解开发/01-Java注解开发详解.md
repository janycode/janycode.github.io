---
title: 01-Java注解开发详解
date: 2017-9-28 22:09:30
tags:
- JavaSE
- 注解
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 08_反射机制
---

![image-20210218161045094](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210218161046.png)

前言：Annotation中文释义注解之意, Java注解用于为Java代码提供元数据。

### **一、如何创建注解？**

JDK5.0出来后，Java语言中就有了四种类型，即类class、枚举enum、接口interface、注解`@interface`，它们处于同一级别，Java就是通过注解来表示元数据的。

```java
public @interface MyAnnotation {
    // 定义公共的final静态属性
    int age = 25;

    // 定义公共的抽象方法
    String name();
}
```

Java注解本质上就是接口，是继承了Annotation接口的接口。

### **二、元注解**

元注解是可以注解到注解上的注解，或者说元注解是一种基本注解，它能够应用到其它的注解上面。

元标签有 @Retention、@Documented、@Target、@Inherited、@Repeatable 5 种。

1、@Retention

Retention，中文释义保留期的意思

当@Retention应用到注解上的时候，它解释说明了这个注解的生命周期。

- RetentionPolicy.SOURCE 注解只在源码阶段保留，在编译器进行编译时它将被丢弃忽视。
- RetentionPolicy.CLASS 注解只被保留到编译进行的时候，它并不会被加载到JVM中。
- RetentionPolicy.RUNTIME 注解可以保留到程序运行的时候，它会被加载到JVM中。

2、@Documented

顾名思义，这个元注解肯定和文档有关。它的作用是能够将注解中的元素包含到Javadoc中去。

3、@Target

标明注解运用的地方。

- ElementType.ANNOTATION_TYPE 可以给一个注解进行注解
- ElementType.CONSTRUCTOR 可以给构造方法进行注解
- ElementType.FIELD 可以给属性进行注解
- ElementType.LOCAL_VARIABLE 可以给局部变量进行注解
- ElementType.METHOD 可以给方法进行注解
- ElementType.PACKAGE 可以给一个包进行注解
- ElementType.PARAMETER 可以给一个方法内的参数进行注解
- ElementType.TYPE 可以给一个类型进行注解，比如类、接口、枚举

4、@Inherited

lnherited是继承的意思。

如果一个超类被@Inherited注解过的注解进行注解的话，那么如果它的子类没有被任何注解应用的话，那么这个子类就继承了超类的注解。

代码实例

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)//注解可以保留到程序运行时，加载到JVM中
@Target(ElementType.TYPE)//给一个类型进行注解，比如类、接口、枚举
@Inherited //子类继承父类时，注解会起作用
public @interface Desc {
    enum Color {
        White, Grayish, Yellow
    }

    // 默认颜色是白色的
    Color c() default Color.White;
}
```

5、@Repeatable

Repeatable 自然是可重复的意思。@Repeatable 是 Java 1.8 才加进来的，所以算是一个新的特性。

什么样的注解会多次应用呢？通常是注解的值可以同时取多个。

在生活中一个人往往是具有多种身份，如果我把每种身份当成一种注解该如何使用？？？

先声明一个Persons类用来包含所有的身份

```java
@Target(ElementType.TYPE)  
@Retention(RetentionPolicy.RUNTIME)
public @interface Persons {
	Person[] value();
}
```

这里@Target是声明Persons注解的作用范围，参数ElementType.Type代表可以给一个类型进行注解，比如类，接口，枚举。

@Retention是注解的有效时间，RetentionPolicy.RUNTIME是指程序运行的时候。

Person注解：

```java
@Repeatable(Persons.class)
public @interface Person{
	String role() default "";
}
```

@Repeatable括号内的就相当于用来保存该注解内容的容器。

声明一个Man类，给该类加上一些身份。

```java
@Person(role="CEO")
@Person(role="husband")
@Person(role="father")
@Person(role="son")
public class Man {
	String name="";
}
```

在主方法中访问该注解：

```java
public static void main(String[] args) {
    Annotation[] annotations = Man.class.getAnnotations();  
    System.out.println(annotations.length);
    Persons p1=(Persons) annotations[0];
    for(Person t:p1.value()){
        System.out.println(t.role());
    }
}
```

下面的代码结果输出相同，但是可以先判断是否是相应的注解，比较严谨。 

```java
if(Man.class.isAnnotationPresent(Persons.class)) {
    Persons p2=Man.class.getAnnotation(Persons.class);
    for(Person t:p2.value()){
        System.out.println(t.role());
    }
 }
```

运行结果：

![img](https://oscimg.oschina.net/oscnet/0b01226f07eb84fe2900ea5396e4e5b0352.jpg)

### **三、注解的属性**

注解的属性也叫做成员变量，注解只有成员变量，没有方法。注解的成员变量在注解的定义中以“无参的方法”形式来声明，其方法名定义了该成员变量的名字，其返回值定义了该成员变量的类型。

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface TestAnnotation {
    int id();
    String msg();
}
```

上面代码中定义了TestAnnotation这个注解中拥有id和msg两个属性。在使用的时候，我们应该给他们进行赋值。

赋值的方式是在注解的括号内以value=“”形式，多个属性之前用，隔开。

```java
@TestAnnotation(id=3,msg="hello annotation")
public class Test {
}
```

需要注意的是，在注解中定义属性时它的类型必须是 8 种基本数据类型外加 类、接口、注解及它们的数组。

注解中属性可以有默认值，默认值需要用 default 关键值指定。比如：

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface TestAnnotation {
    public int id() default -1;
    public String msg() default "江疏影";
}
```

TestAnnotation 中 id 属性默认值为 -1，msg 属性默认值为 江疏影。 

它可以这样应用。

```java
@TestAnnotation()
public class Test {}
```

因为有默认值，所以无需要再在 @TestAnnotation 后面的括号里面进行赋值了，这一步可以省略。

另外，还有一种情况。如果一个注解内仅仅只有一个名字为 value 的属性时，应用这个注解时可以直接接属性值填写到括号内。

```java
public @interface Check {
    String value();
}
```

上面代码中，Check 这个注解只有 value 这个属性。所以可以这样应用。

```java
@Check("hi")
int a;
```

这和下面的效果是一样的

```java
@Check(value="hi")
int a;
```

最后，还需要注意的一种情况是一个注解没有任何属性。比如

```java
public @interface Perform {}
```

那么在应用这个注解的时候，括号都可以省略。

```java
@Perform
public void testMethod(){}
```

### **四、Java预置的注解**

学习了上面相关的知识，我们已经可以自己定义一个注解了。其实 Java 语言本身已经提供了几个现成的注解。

1、@Override

这个大家应该很熟悉了，提示子类要复写父类中被 @Override 修饰的方法

2、@Deprecated

加上这个注解之后，表示此方法或类不再建议使用，调用时会出现删除线，但不代表不能用，只是说，不推荐使用，因为有更好的方法可以调用。

那么直接删掉不就完了？

因为在一个项目中，工程比较大，代码比较多，而在后续的开发过程中，可能之前的某个方法实现的并不是很合理，这个时候要重新写一个方法，而之前的方法还不能随便删，因为别的地方可能在调用它，所以加上这个注解，就OK啦！

```java
import java.util.ArrayList;
import java.util.List;

public class Hero {
    @Deprecated
    public void say(){
        System.out.println("nothing has to say!");
    }
    public void speak(){
        System.out.println("i have a dream!");
    }

    public void  addItems(String item){
        List items =  new  ArrayList();
        items.add(item);
        System.out.println("i am "+items);
    }
}
```

![img](https://oscimg.oschina.net/oscnet/04619c177c777d34a126866fe87da51b194.jpg)

![img](https://oscimg.oschina.net/oscnet/2a24de094d4921716193df5e77ea48ebeaa.jpg)

3、@SuppressWarnings

阻止警告的意思。

该批注的作用是给编译器一条指令，告诉它对被批注的代码元素内部的某些警告保持静默。

![img](https://oscimg.oschina.net/oscnet/fc68df7f0c4a34b8b171a88935b629286ff.jpg)

注：这个注解有很多参数，这里就不多做赘述了，如有需要，请自行百度！

4、@SafeVarargs

参数安全类型注解。

它的目的是提醒开发者不要用参数做一些不安全的操作，它的存在会阻止编译器产生unchecked这样的警告。

在声明具有模糊类型（比如：泛型）的可变参数的构造函数或方法时，Java编译器会报unchecked警告。鉴于这种情况，如果程序猿断定声明的构造函数和方法的主体no problem，可使用@SafeVarargs进行标记，这样Java编译器就不会报unchecked警告了！

先看看@SafeVarargs在Java SE中的声明：

```java
import java.lang.annotation.*;

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.CONSTRUCTOR, ElementType.METHOD})
public @interface SafeVarargs {}
```

由Java源代码声明我们了解到：@SafeVarargs注解，只能用于标记构造函数和方法，由于保留策略声明为RUNTIME，所以此注解可以在运行时生效。

@SafeVarargs注解，只能用于static或final的方法。

代码实例：

泛型参数的方法，不加注解的情况：

```java
public class SafeVarargsAnnotation<S> {
    private S[] args;
    public SafeVarargsAnnotation(S... args){
        this.args = args;
    }
    
    public void loopPrintArgs(S... args){
        for (S arg : args){
            System.out.println(arg);
        }
    }
    
    public final void printSelfArgs(S... args){
        for (S arg : this.args) {
            System.out.println(arg);
        }
    }
    
    public static <T> void loopPrintInfo(T... infos){
        for(T info:infos){
            System.out.println(info);
        }
    }

    public static void main(String[] args) {
        SafeVarargsAnnotation.loopPrintInfo("A","B","C");
    }
}
```

![img](https://oscimg.oschina.net/oscnet/b8f1bd87a92c0274c55da1bf961d0e9b883.jpg)

注解的正确使用方式：

```java
public class SafeVarargsAnnotation<S> {
    private S[] args;
    //构造函数可以使用@SafeVarargs标记
    @SafeVarargs
    public SafeVarargsAnnotation(S... args){
        this.args = args;
    }

    //此处不能使用@SafeVarargs，因为此方法未声明为static或final方法，
    // 如果要抑制unchecked警告，可以使用@SuppressWarnings注解
    @SuppressWarnings("unchecked")
    public void loopPrintArgs(S... args){
        for (S arg : args){
            System.out.println(arg);
        }
    }
    //final方法可以使用@SafeVarargs标记
    @SafeVarargs
    public final void printSelfArgs(S... args){
        for (S arg : this.args) {
            System.out.println(arg);
        }
    }
    //static方法可以使用@SafeVarargs标记
    @SafeVarargs
    public static <T> void loopPrintInfo(T... infos){
        for(T info:infos){
            System.out.println(info);
        }
    }

    public static void main(String[] args) {
        SafeVarargsAnnotation.loopPrintInfo("A","B","C");
    }
}
```

![img](https://oscimg.oschina.net/oscnet/c5738752559329466758b7025dfcbe42935.jpg)

![img](https://oscimg.oschina.net/oscnet/d684fc84462444ed585655164952f38d782.jpg)

5、@FunctionalInterface

Java 8为函数式接口引入了一个新注解@FunctionalInterface，主要用于编译级错误检查，加上该注解，当你写的接口不符合函数式接口定义的时候，编译器会报错。

它们主要用在Lambda表达式和方法引用（实际上也可认为是Lambda表达式）上。

如定义了一个函数式接口如下：

```java
@FunctionalInterface
interface GreetingService 
{
    void sayMessage(String message);
}
```

那么就可以使用Lambda表达式来表示该接口的一个实现(注：JAVA 8 之前一般是用匿名类实现的)：

```java
GreetingService greetService1 = message -> System.out.println("Hello " + message);
```

### **五、注解与反射**

1、注解通过反射获取。首先可以通过 Class 对象的 isAnnotationPresent() 方法判断它是否应用了某个注解。

```java
public boolean isAnnotationPresent(Class<? extends Annotation> annotationClass) {}
```

2、或者是 getAnnotations() 方法。

```java
public Annotation[] getAnnotations() {}
```

前一种方法返回指定类型的注解，后一种方法返回注解到这个元素上的所有注解。

3、代码实例：

① 没加注解的时候：

```java
package OSChina.ClinetNew1.Annotation;

public class Test {
    public static void main(String[] args) {
        boolean hasAnnotation = Test.class.isAnnotationPresent(TestAnnotation.class);
        if(hasAnnotation){
            TestAnnotation testAnnotation = Test.class.getAnnotation(TestAnnotation.class);
            System.out.println("id:"+testAnnotation.id());
            System.out.println("msg:"+testAnnotation.msg());
        }
    }
}
```

屁都没有！

![img](https://oscimg.oschina.net/oscnet/6af56fc8f5ccef20686ffcbb134175f50bb.jpg)

② 加上注解

```java
@TestAnnotation
public class Test {
    public static void main(String[] args) {
        boolean hasAnnotation = Test.class.isAnnotationPresent(TestAnnotation.class);
        if(hasAnnotation){
            TestAnnotation testAnnotation = Test.class.getAnnotation(TestAnnotation.class);
            System.out.println("id:"+testAnnotation.id());
            System.out.println("msg:"+testAnnotation.msg());
        }
    }
}
```

![img](https://oscimg.oschina.net/oscnet/94815e142cd6ce6281214427e3650c8d78f.jpg)

这个正是 TestAnnotation 中 id 和 msg 的默认值。

上面的例子只是检阅出了注解在类上的注解，其实属性、方法上的注解也是一样的。同样还是要假手与反射。

③ 属性和方法上的注解：

```java
public @interface Check {
    String value();
}
package OSChina.ClinetNew1.Annotation;

public @interface Perform {
}

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

@TestAnnotation(msg="hello")
public class Test {
    @Check(value="hi")
    int a;
    @Perform
    public void testMethod(){}
    @SuppressWarnings("deprecation")
    public void test1(){
        Hero hero = new Hero();
        hero.say();
        hero.speak();
    }
    public static void main(String[] args) {
        boolean hasAnnotation = Test.class.isAnnotationPresent(TestAnnotation.class);
        if ( hasAnnotation ) {
            TestAnnotation testAnnotation = Test.class.getAnnotation(TestAnnotation.class);
            //获取类的注解
            System.out.println("id:"+testAnnotation.id());
            System.out.println("msg:"+testAnnotation.msg());
        }
        try {
            Field a = Test.class.getDeclaredField("a");
            a.setAccessible(true);
            //获取一个成员变量上的注解
            Check check = a.getAnnotation(Check.class);
            if ( check != null ) {
                System.out.println("check value:"+check.value());
            }
            Method testMethod = Test.class.getDeclaredMethod("testMethod");
            if ( testMethod != null ) {
                // 获取方法中的注解
                Annotation[] ans = testMethod.getAnnotations();
                for( int i = 0;i < ans.length;i++) {
                    System.out.println("method testMethod annotation:"+ans[i].annotationType().getSimpleName());
                }
            }
        } catch (NoSuchFieldException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            System.out.println(e.getMessage());
        } catch (SecurityException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            System.out.println(e.getMessage());
        } catch (NoSuchMethodException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            System.out.println(e.getMessage());
        }
    }
}
```

![img](https://oscimg.oschina.net/oscnet/66f973e517fa53b4c7a6b9c1e874044f748.jpg)

需要注意的是，如果一个注解要在运行时被成功提取，那么 @Retention(RetentionPolicy.RUNTIME) 是必须的。

### **六、注解的使用场景**

1、注解的官方释义：

注解是一系列元数据，它提供数据用来解释程序代码，但是注解并非是所解释的代码本身的一部分。注解对于代码的运行效果没有直接影响。

2、注解有许多用处：

① 提供信息给编译器：编译器可以利用注解来探测错误或警告信息

② 编译阶段时的处理：软件工具可以利用注解信息来生成代码、HTML文档或其它响应处理。

③ 运行时的处理：某些注解可以在程序运行时接受代码的提取。

值得注意的是，注解不是代码本身的一部分。

3、注解运用的地方太多了，比如JUnit测试框架，典型的使用方法：

```java
public class ExampleUnitTest {
    @Test
    public void addition_isCorrect() throws Exception {
        assertEquals(4, 2 + 2);
    }
}
```

@Test 标记了要进行测试的方法 addition_isCorrect().

还有例如ssm框架等运用了大量的注解。

### **七、注解的应用实例**

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Inherited
public @interface Desc {
    enum Color {
        White, Grayish, Yellow
    }

    // 默认颜色是白色的
    Color c() default Color.White;
}
```

该注解Desc前增加了三个注解：Retention表示的是该注解的保留级别，Target表示的是注解可以标注在什么地方，@Inherited表示该注解会被自动继承。

```java
@Desc(c = Desc.Color.White)
abstract class Bird {
    public abstract Desc.Color getColor();
}

public enum BirdNest {
    Sparrow;
    // 鸟类繁殖
    public Bird reproduce() {
        Desc bd = Sparrow.class.getAnnotation(Desc.class);
        return bd == null ? new Sparrow() : new Sparrow(bd.c());
    }
}

public class Sparrow extends Bird {
    private Desc.Color color;
    // 默认是浅灰色
    public Sparrow() {
        color = Desc.Color.Grayish;
    }

    // 构造函数定义鸟的颜色
    public Sparrow(Desc.Color _color) {
        color = _color;
    }

    @Override
    public Desc.Color getColor() {
        return color;
    }
}
```

上面程序声明了一个Bird抽象类，并且标注了Desc注解，描述鸟类的颜色是白色，然后编写一个麻雀Sparrow类，它有两个构造函数，一个是默认的构造函数，也就是我们经常看到的麻雀是浅灰色的，另外一个构造函数是自定义麻雀的颜色，之后又定义了一个鸟巢(工厂方法模式)，它是专门负责鸟类繁殖的，它的生产方法reproduce会根据实现类注解信息生成不同颜色的麻雀。我们编写一个客户端调用，代码如下：　　　

```java
public static void main(String[] args) {
    Bird bird = BirdNest.Sparrow.reproduce();
    Desc.Color color = bird.getColor();
    System.out.println("Bird's color is :" + color);
}
```

会打印出什么呢？因为采用了工厂方法模式，它主要的问题是bird比那里到底采用了哪个构造函数来生成，如果单独看子类Sparrow，它没有任何注释，那工厂方法中bd变量应该就是null了，应该调用无参构造！

![img](https://oscimg.oschina.net/oscnet/3fb20b6a829873096273cc7f99f74d085a4.jpg)

输出为什么会是白色呢？这是我们添加到父类的颜色，why？这是因为我们在注解上加了@Inherited注解，它表示的意思是我们只要把注解@Desc加到父类Bird上，它的所有子类都会从父类继承@Desc注解。

### **八、总结**

1、注解就是标签，注解为了解释代码

2、注解的基本语法@interface

3、注解的元注解

4、注解的属性

5、注解主要给编译器及工具类型的软件用的

6、注解的提取要借助于Java的反射技术，反射比较慢，所以注解使用时也需要谨慎计较时间成本