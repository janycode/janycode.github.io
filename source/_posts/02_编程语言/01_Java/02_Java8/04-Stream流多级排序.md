---
title: 04-Stream流多级排序
date: 2021-1-9 22:26:07
tags:
- Java8
- Stream
- 排序
categories: 
- 02_编程语言
- 01_Java
- 02_Java8
---

![image-20210109222655433](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210109222656.png)



### 1. 多字段排序

```java
List<类> list; 代表某集合
 
/* 返回 对象集合以类属性1升序排序 */
list.stream().sorted(Comparator.comparing(类::属性1));
 
/* 返回 对象集合以类属性1降序排序 注意两种写法 */
//先以属性1升序,结果进行属性1降序
list.stream().sorted(
    Comparator.comparing(类::属性1).reversed()
);
//以属性1降序
list.stream().sorted(
    Comparator.comparing(类::属性1,Comparator.reverseOrder())
);
 
/* 返回 对象集合以类属性1升序 属性2升序 */
list.stream().sorted(
    Comparator.comparing(类::属性1).thenComparing(类::属性2)
);
 
/* 返回 对象集合以类属性1降序 属性2升序 注意两种写法 */
//先以属性1升序,升序结果进行属性1降序,再进行属性2升序
list.stream().sorted(
    Comparator.comparing(类::属性1).reversed().thenComparing(类::属性2)
);
//先以属性1降序,再进行属性2升序
list.stream().sorted(
    Comparator.comparing(类::属性1, Comparator.reverseOrder()).thenComparing(类::属性2)
);
 
/* 返回 对象集合以类属性1降序 属性2降序 注意两种写法 */
//先以属性1升序,升序结果进行属性1降序,再进行属性2降序
list.stream().sorted(
    Comparator.comparing(类::属性1).reversed().thenComparing(类::属性2, Comparator.reverseOrder())
);
//先以属性1降序,再进行属性2降序
list.stream().sorted(
    Comparator.comparing(类::属性1, Comparator.reverseOrder())
    		 .thenComparing(类::属性2, Comparator.reverseOrder())
);
 
/* 返回 对象集合以类属性1升序 属性2降序 注意两种写法 */
//先以属性1升序,升序结果进行属性1降序,再进行属性2升序,结果进行属性1降序属性2降序
list.stream().sorted(
    Comparator.comparing(类::属性1).reversed().thenComparing(类::属性2).reversed()
);
//先以属性1升序,再进行属性2降序
list.stream().sorted(
    Comparator.comparing(类::属性1).thenComparing(类::属性2, Comparator.reverseOrder())
);
```

> 1. Comparator.comparing(类::属性一).reversed(); //得到正序结果后再逆序
>
> 2. Comparator.comparing(类::属性一,Comparator.reverseOrder()); //直接逆序
>
> 两种排序是完全不一样的,一定要区分开来 1 是得到排序结果后再排序,2是直接进行排序,很多人会混淆导致理解出错,2更好理解,建议使用 2 。