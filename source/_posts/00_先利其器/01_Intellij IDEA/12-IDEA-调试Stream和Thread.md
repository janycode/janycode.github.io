---
title: 12-IDEA-调试Stream和Thread
date: 2021-02-27 16:01:22
tags: 
- IDEA
- SpringBoot
- 开发
categories:
- 00_先利其器
- 01_Intellij IDEA
---



### 1. 调试Stream流

java的stream编程给调试带来了极大的不便，idea 推出了streamtrace功能，可以详细看到每一步操作的关系、结果，非常方便进行调试。

#### 初遇StreamTrace

这里简单将字符串转成它的字符数，并设置断点开启debug模式。

![image-20230227160535945](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230227160537.png)

如上图所示，可以看到每一步操作的元素个数、操作的结果、元素转换前后的对应关，非常清晰明了；还可以查看具体的对象内容。



#### 使用StreamTrace

StreamTrace只有在debug模式下才能使用，当在Stream代码上设置断点后，启动debug，点击流按钮，如图所示。

![image-20230227160547020](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230227160548.png)

点击后，默认Split 模式显示。

![image-20230227160605536](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230227160606.png)

可以点击左下方按钮切换到 FlatMode 模式，当然也可以再切换回去。

![image-20230227160619492](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230227160620.png)

#### 实战演示

这里演示一段字符转长度并过滤长度小于5的stream操作：

```java
@Test
public void TestTrace() {
    Stream.of("beijing","tianjin","shanghai","wuhan")
        .map(String::length)
        .filter(e->e>5)
        .collect(Collectors.toList());
}
```

![image-20230227160830021](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230227160831.png)



### 2.调试Thread线程

#### 线程例子

在这里，编写了一个多线程程序来计算此数学问题：`100! + 100000!`。即：100的阶乘 + 100000的阶乘。

> 100 阶乘就是：1 * 2 * 3 * …… * 100 = ？ ，简写为100！

```java
import java.math.BigInteger;

public class MathProblemSolver {

    //开启两个线程
    public static void main(String arg[]) {
        //第一个线程计算 100!
        FactorialCalculatingThread thread1 = new FactorialCalculatingThread(100);
        //第二个线程计算 100000!
        FactorialCalculatingThread thread2 = new FactorialCalculatingThread(100000);

        thread1.setName("Thread 1");
        thread2.setName("Thread 2");

        thread1.start();
        thread2.start();

        try {
            thread1.join(); //线程Jion，以使主线程在“线程1”和“线程2”都返回结果之前不会进一步执行
            thread2.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        BigInteger result = thread1.getResult().add(thread2.getResult());
        System.out.println("将两个线程的计算结果相加等于：" + result);
    }

    //用于阶乘计算的线程类
    private static class FactorialCalculatingThread extends Thread {
        private BigInteger result = BigInteger.ONE;
        private long num;

        public FactorialCalculatingThread(long num) {
            this.num = num;
        }

        @Override
        public void run() {
            System.out.println(Thread.currentThread().getName() + " 开始阶乘的计算：" + num);
            factorialCalc(num);
            System.out.println(Thread.currentThread().getName() + "执行完成");
        }

        //数的阶乘计算方法
        public void factorialCalc(long num) {
            BigInteger f = new BigInteger("1");
            for (int i = 2; i <= num; i++)
                f = f.multiply(BigInteger.valueOf(i));
            result = f;
        }

        public BigInteger getResult() {
            return result;
        }
    }
}
```

- 开启两个线程，“Thread 1”计算（100！）和“Thread 2”计算（100000！)
- 在main()方法中启动两个线程，然后调用`thread1.join()`和`thread2.join()`，以使主线程在“线程1”和“线程2”都返回结果之前不会进一步执行。
- 最后将两个线程的计算结果相加，得到`100! + 100000!`

#### Frames 与 Thread 面板

调试工具窗口的“*Frames”面板*包含一个下拉菜单。它的关注点在：由于断点而导致暂停的线程，并显示这些线程的调用堆栈信息。在下图中，断点位于main()方法中如图所示的位置，Frame显示了主线程的调用堆栈。

![image-20230611203133400](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230611203135.png)

如果要检查其他线程的调用堆栈，则可以从下拉列表中进行选择。

![image-20230611203151704](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230611203153.png)

*Thread面板*显示当前处于活动状态的所有线程。参考上面的代码，在`thread1.join()`添加了一个断点。当应用程序在该断点处暂停时，应该在此窗格中至少看到三个线程“main”，“Thread 1”和“Thread 2”（请看下面的屏幕截图），可以双击每个线程以观察其调用堆栈。

![image-20230611204700143](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230611204701.png)

#### 条件断点-只挂起符合条件的线程

假设正在解决该程序中的错误，并且只需要在“Thread 2”开始运行时就暂停执行。这表明需要在FactorialCalculatingThread的run()方法的第一行上添加一个断点。因为开启的两个线程使用的是同一段代码，所以会遇到一个问题-使用该段代码的所有线程遇到断点都将被挂起,包括应用程序的“Thread 1”和“Thread 2”。不希望两个线程都暂停，该怎么做？

可以使用条件断点功能。添加断点后，右键单击它，选中“suspend”并选择“Thread”。然后添加条件`currentThread().getName().equals("Thread 2")`。

如下图所示，此条件确保调试器仅在当前线程的名称为“Thread 2”时才暂停当前线程：

![image-20230611204815376](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230611204820.png)

现在执行调试程序，当应用暂停时，仅“Thread 2”被暂停。可以通过以下步骤确认“Thread 1”已执行并且没有被挂起：

1.在控制台中，您可以通过日志来验证“Thread 1”已运行并退出。

![image-20230611205038725](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230611205039.png)

2.在“Thread”面板中，可以看到此时已经没有“Thread 1”，已经运行完成了！

![image-20230611205056959](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230611205057.png)

在不同的IDE版本中，配置条件断点的方式可能有所不同。