---
title: 01-Junit 4单元测试
date: 2017-03-21 20:49:13
tags:
- Junit4
- 测试
categories: 
- 09_调试测试
- 02_单元测试
---

![image-20220226112657540](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220226112658.png)

参考资料(官网): https://junit.org/junit4/

GitHub: https://github.com/junit-team/junit4



### 1. 概念

java单元测试是最小的功能单元测试代码, 单元测试就是针对单个java方法的测试

java程序的最小功能单元是方法

### 2. 优点

- main方法进行测试的缺点:
  - 只能有一个main()方法, 不能把测试代码分离出来
  - 无法打印出测试结果和期望结果.例如: expected: 3628800, but actual: 123456
- 单元测试的优点:
  - 确保单个方法正常运行
  - 如果修改了方法代码, 只需要保其对应的单元测试通过就可以了
  - 测试代码本省就可以作为示例代码
  - 可以自动化运行所有测试并获得报告

### 3. Junit单元测试实践

JUnit是一个开源的java语言的单元测试框架，专门针对java语言设计, 使用最广泛, JUnit是标准的单元测试架构。

#### 3.1 JUnit特点

- 使用断言(Assertion)测试期望结果
- 可以方便的组织和运行测试
- 可以方便的查看测试结果
- 常用的开发工具IDEA, Eclipse都集成了JUnit
- 可以方便的继承到maven中

#### 3.2 maven依赖

```xml
<dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.12</version>
     <!-- junit的版本有3.x, 4.x, 5.x -->
</dependency>
```

#### 3.3 快捷键生成单元测试

测试类的使用目录必须是如下, 测试类规定标准是在test目录中进行测试

```shell
localhost:javatest$ tree -d -L 3
.
├── src
│   ├── main
│   │   └── java
│   └── test
│       └── java
```

IDE的快捷键是: **`Ctrl+Shift+T` --> create new test**

然后选择对应的方法进行测试就好了。

#### 3.4 断言

##### 3.4.1 断言的例子

断言的使用, 必须先引入必须的包: IDE自动创建的会自动引入

```java
import static org.junit.Assert.*;
```

例子: 在main包中的编写的一个正则表达式的类

```java
import java.util.Arrays;

public class Calculator {

    public int calculate(String expression) {
        String[] ss = expression.split("\\+");
        System.out.println(expression + " => " + Arrays.toString(ss));
        int sum = 0;
        for (String s: ss) {
            sum += Integer.parseInt(s.trim());
        }
        return sum;
    }
}
```

测试类:

```typescript
import org.junit.Test;

import static org.junit.Assert.*;

public class CalculatorTest {

    @Test
    public void calculate() {
        assertEquals(3, new Calculator().calculate("1 + 2"));
        assertEquals(3, new Calculator().calculate("1 + 2 + 3"));
    }
}
```

测试类执行结果如下:

```java
1 + 2 => [1 ,  2]
1 + 2 + 3 => [1 ,  2 ,  3]

java.lang.AssertionError: 
Expected :3
Actual   :6
 <Click to see difference>


	at javatest.CalculatorTest.calculate(CalculatorTest.java:12)
```

第一个方法: 1 + 2 => [1 , 2], 最终的结果3是正确的, 所有没有任何报错, 正常显示

第二个方法: 1 + 2 + 3 => [1 , 2 , 3], 最终报错, 并提示在代码的位置: CalculatorTest.java:12, 并且罗列出Expected和Actual的值, 清楚的显示了结果的对比情况, 和代码出现的位置

##### 3.4.2 断言的常用方法

assertEquals(100, x): 断言相等

assertArrayEquals({1, 2, 3}, x): 断言数组相等

assertEquals(3.1416, x, 0.0001): 浮点数组断言相等

assertNull(x): 断言为null

assertTrue(x > 0): 断言为true

assertFalse(x < 0): 断言为false;

assertNotEquals: 断言不相等

assertNotNull: 断言不为null

#### 3.5 使用@Before和@After

- 在@Before方法中初始化测试资源
- 在@After方法中释放测试资源
- @BeforeClass: 初始化非常耗时的资源, 例如创建数据库
- @AfterClass: 清理@BeforeClass创建的资源, 例如创建数据库

注意: 单个@Test方法执行前会创建新的XxxTest实例, 实例变量的状态不会传递给下一个@Test方法, 单个@Test方法执行前后会执行@Before和@After方法。

对于每一个@Test方法的执行顺序：

1. 执行类的构造函数
2. 执行@Before方法
3. 执行@Test方法
4. 执行@After方法

写一个整体的测试类如下:

```java
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

public class SequenceTest {

    @BeforeClass
    public static void setUpBeforeClass() throws Exception {
        System.out.println("BeforeClass()");
    }

    @AfterClass
    public static void tearDownAfterClass() throws Exception {
        System.out.println("AfterClass()");
    }

    @Before
    public void setUp() throws Exception {
        System.out.println("    Before()");
    }

    @After
    public void tearDown() throws Exception {
        System.out.println("    After()");
    }

    public SequenceTest() {
        System.out.println("  new SequenceTest()");
    }

    @Test
    public void testA() {
        System.out.println("    testA()");
    }

    @Test
    public void testB() {
        System.out.println("    testB()");
    }

    @Test
    public void testC() {
        System.out.println("    testC()");
    }
}
```

如果运行整个类, 运行结果如下:

```shell
BeforeClass()
  new SequenceTest()
    Before()
    testA()
    After()
  new SequenceTest()
    Before()
    testB()
    After()
  new SequenceTest()
    Before()
    testC()
    After()
AfterClass()
```

如果运行单个@Test类

```shell
BeforeClass()
  new SequenceTest()
    Before()
    testA()
    After()
AfterClass()
```

#### 3.6 异常测试

异常测试可以通过@Test(expected=Exception.class), 对可能发生的每种类型的异常进行测试

- 如果抛出了指定类型的异常, 测试成功
- 如果没有抛出指定类型的异常, 或者抛出的异常类型不对, 测试失败

例子:

运行如下代码: 正常通过

```java
// 运行如下代码, 正常运行, 确实发生了ArithmeticException异常, 代码通过
@Test(expected = ArithmeticException.class)
public void testException() {
    int i = 1 / 0;
}
```

运行如下代码: 有报错信息

```java
@Test(expected = ArithmeticException.class)
public void testException() {
    int i = 1 / 1;
}
```

执行结果如下:

```java
java.lang.AssertionError: Expected exception: java.lang.ArithmeticException
```

#### 3.7 参数化测试

@RunWith: 当类被@RunWith注释修饰, 或者类继承了一个被该注解类修饰的类, JUnit将会使用这个注解所指明的运行器(runner)来运行测试, 而不是JUni默认的运行器。

要进行参数化测试，需要在类上面指定如下的运行器：

```java
@RunWith (Parameterized.class)
```

然后，在提供数据的方法上加上一个@Parameters注解，这个方法必须是静态static的，并且返回一个集合Collection。

> JUnit4中参数化测试要点： 
> 1. 测试类必须由Parameterized测试运行器修饰 
> 2. 准备数据。数据的准备需要在一个方法中进行，该方法需要满足一定的要求： 
>     1）该方法必须由Parameters注解修饰 
>     2）该方法必须为public static的 
>     3）该方法必须返回Collection类型 
>     4）该方法的名字不做要求 
>     5）该方法没有参数

例子:

```java
@RunWith(Parameterized.class)
public class Testa {

    @Parameterized.Parameters
    public static Collection<?> data() {
        return Arrays.asList(new Object[][] { { "1+2", 3 }, { "1+2+5", 8 }, { "123+456", 579 }, { " 1 + 5 + 10 ", 16 } });
    }

    Calculator calc;

    @Parameterized.Parameter(0)
    public String input;

    @Parameterized.Parameter(1)
    public int expected;

    @Before
    public void setUp() {
        calc = new Calculator();
    }

    @Test
    public void testCalculate() {
        int r = calc.calculate(this.input);
        assertEquals(this.expected, r);
    }
}
```

执行结果:

```java
1+2 => [1, 2]
1+2+5 => [1, 2, 5]
123+456 => [123, 456]
 1 + 5 + 10  => [ 1 ,  5 ,  10 ]
```

#### 3.8 超时测试

@Test(timeout=1000)可以设置超时时间

timeout单位是毫秒。