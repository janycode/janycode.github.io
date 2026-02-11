---
title: 10-BigDecimal类和方法
date: 2016-4-28 21:49:50
tags:
- JavaSE
- BigDecimal
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 02_面向对象
---



不变的，任意精度的带符号的十进制数字。

位置：java.math包中

java.lang.Object

-- java.lang.Number

---- java.math.`BigDecimal`

作用：精确计算浮点数

创建：BigDecimal bd = new BigDecimal("1.0");

方法：

* BigDecimal **add**(BigDecimal db)   //加

* BigDecimal **subtract**(BigDecimal bd)//减

* BigDecimal **multiply**(BigDecimal bd)//乘

* BigDecimal **divide**(BigDecimal db) //除

【注意】除法：BigDecimal(BigDecimal bd, int scal, RoundingMode mode)

@scal, 指定精确到的小数位数

@mode, 指定小数部分的取舍模式，通常采用四舍五入模式(BigDecimal.ROUND_HALF_UP)



```java
public class BigDecimal
    extends Number
    implements Comparable<BigDecimal>
```

```java
public class TestBigDecimal {
      public static void main(String[] args) {
            double d1 = 100.0;
            double d2 = 99.0 + 1.0;
            System.out.println(d1 == d2); // true
            
            double d3 = 1.0;
            double d4 = 2.2 - 1.2;
            System.out.println(d3 == d4); // false
            
            double d5 = 1.0 - 0.9;
            double d6 = 0.1;
            System.out.println(d5 == d6); // false
            
            System.out.println(99.0+1.0); // 100.0
            System.out.println(2.2-1.2);  // 1.0000000000000002
            System.out.println(1.0-0.9);  // 0.09999999999999998
            
      }
}
```

```java
import java.math.BigDecimal;
public class TestBigDecimal {
      public static void main(String[] args) {
            BigDecimal bd1 = new BigDecimal("1.20");
            BigDecimal bd2 = new BigDecimal("2.2");
            System.out.println(bd1);
            System.out.println(bd2);
            
            BigDecimal r1 = bd2.add(bd1);
            BigDecimal r2 = bd2.subtract(bd1);
            BigDecimal r3 = bd2.multiply(bd1);
            //BigDecimal r4 = bd2.divide(bd1); //  Error:ArithmeticException
            // 除不尽的情况下必须明确两个信息（1.保留小数位数 2.是否使用四舍五入）
            BigDecimal r4 = bd2.divide(bd1, 2,  BigDecimal.ROUND_HALF_UP);
            System.out.println(r1 + " " + r2 + " " + r3 + " " + r4);
            
            System.out.println(r1.getClass().getName() + "@" +  Integer.toHexString(r1.hashCode()));
      }
}
```

