---
title: 02-UML类图设计
date: 2017-10-18 21:13:45
tags: 
- UML
- 类图
- 设计
categories:
- 00_先利其器
- 04_PowerDesigner
---


### 01. UML类图

* 概念
  * Unified Modeling Language，UML `统一建模语言`。
  * 统一建模语言是一种为面向对象系统的产品进行说明、可视化和编制文档的一种标准语言，是非专利的第三代建模和规约语言。UML是面向对象设计的建 模工具，独立于任何具体程序设计语言。
* 作用
  * 为软件系统建立可视化模型。 
  * 为软件系统建立构件。 
  * 为软件系统建立文档。

![image-20201213152655891](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20201213152657.png)



### 02. UML经典类图

* ![image-20200528114758485](https://qiuzhiwei.oss-cn-beijing.aliyuncs.com/typora/20200528114801.png)

* 类

  * ![image-20200528114841365](https://qiuzhiwei.oss-cn-beijing.aliyuncs.com/typora/20200528114843.png)

> 类图分三层：
>
> 第一层显示类的名称，如果是抽象类，那就用斜体显示。
>
> 第二层是类的特性，通常就是字段和属性。
>
> 第三层是类的操作，通常是方法或行为。
>
> 注意前面的符号，+ 表示public ，# 表示protected，- 表示 private。

* 接口

  * ![image-20200528114928644](https://qiuzhiwei.oss-cn-beijing.aliyuncs.com/typora/20200528115455.png)

  * 使用`<<interface>>`
    * 第一层：接口名称
    * 第二层：抽象方法
  * 使用棒棒糖
    * 圆圈旁为接口名称
    * 接口方法在实现类中出现

* 继承关系

  * 也叫泛化关系（Generalization）
  * 空心三角形+实线

* 实现关系

  * 空心三角形+虚线

* 关联关系

  * 实线
  * 对象A拥有对象B，通俗点讲，就是对象B是对象A的成员变量
  * 分类
    * 组合关系
    * 聚合关系

* 组合关系

  * 实心菱形+实线
  * 是一种强关联关系
  * 体现了严格的部分和整体的关系，部分和整体的生命周期一样

* 聚合关系
  * 空心菱形+实线
  * 是一种弱关联关系
  * 体现的是A对象可以包含B对象，但B对象不是A对象的必要部 分。
* 依赖关系
  * 虚线
  * 通俗点讲，对象A拥有局部变量对象B，那么，对象A依赖于对象B





### 03. PowerDesigner建立UML类图

* ![image-20200528150150053](https://qiuzhiwei.oss-cn-beijing.aliyuncs.com/typora/20200528150153.png)
  * class
* ![image-20200528150210268](https://qiuzhiwei.oss-cn-beijing.aliyuncs.com/typora/20200528150212.png)
  * interface
* ![image-20200528150259003](https://qiuzhiwei.oss-cn-beijing.aliyuncs.com/typora/20200528150300.png)
  * generalization(继承)
* ![image-20200528150401262](https://qiuzhiwei.oss-cn-beijing.aliyuncs.com/typora/20200528150402.png)
  * association(关联)
* ![image-20200528150430304](https://qiuzhiwei.oss-cn-beijing.aliyuncs.com/typora/20200528150431.png)
  * aggregation(聚合)
* ![image-20200528150503588](https://qiuzhiwei.oss-cn-beijing.aliyuncs.com/typora/20200528150505.png)
  * composition(组合)
* ![image-20200528150524155](https://qiuzhiwei.oss-cn-beijing.aliyuncs.com/typora/20200528150525.png)
  * dependency(依赖)
* ![image-20200528150549091](https://qiuzhiwei.oss-cn-beijing.aliyuncs.com/typora/20200528150550.png)
  * realization(实现)





