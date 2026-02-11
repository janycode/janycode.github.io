---
title: 06-Lambda和Stream(42-48)
date: 2020-9-16 15:11:14
tags:
- EffectiveJava
- Lambda
- Stream
categories: 
- 02_编程语言
- 01_Java
- 04_EffectiveJava
---

### 42. Lambda 优先于匿名类

![image-20210217174100481](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210217174101.png)

尽可能不要序列化一个 Lambda或匿名类实例。

千万不要给函数对象使用匿名类，除非必须创建非函数接口的类型的实例。



### 43. 方法引用优先于 Lambda

Java提供了生成比 Lambda 更简介函数对象的方法：方法引用。

格式：`类名::方法名`

eg:

![image-20210217174341544](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210217174343.png)

只要方法引用更加简介、更加清晰，就使用方法引用；反之则使用 Lambda。

![image-20210217174419147](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210217174420.png)



### 44. 坚持使用标准的函数接口

只要标准的函数接口能够满足就使用标准的函数接口。

6 个基础的函数接口：

![image-20210217174913284](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210217174914.png)



### 45. 谨慎使用 Stream

滥用 Stream 会使程序代码更难读懂和维护。



### 46. 优先选择 Stream 流中无副作用的函数

最重要收集器工厂是：toList, toSet, toMap, groupingBy, joining.



### 47. Stream 要优先用 Collection 作为返回类型

如果能够返回集合就尽可能返回 Collection 的子类，比如 ArrayList。

如果不能返回集合，就返回 Stream 或 Iterable。



### 48. 谨慎使用 Stream 并行

.parallel()

![image-20210217175808226](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210217175810.png)

尽量不要并行 Stream，除非有足够的理由相信它能保证计算的正确性，并且能加快程序的运行速度。

