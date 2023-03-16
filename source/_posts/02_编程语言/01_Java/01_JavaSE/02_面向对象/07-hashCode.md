---
title: 07-hashCode
date: 2016-4-28 21:49:50
tags:
- JavaSE
- hashCode
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 02_面向对象
---

### 1. hashCode的特性

（1）HashCode的存在主要是用于查找的快捷性，如Hashtable，HashMap等，HashCode经常用于确定对象的存储地址；
（2）如果两个对象相同， equals方法一定返回true，并且这两个对象的HashCode一定相同；
（3）两个对象的HashCode相同，并不一定表示两个对象就相同，即equals()不一定为true，只能够说明这两个对象在一个散列存储结构中。
（4）如果对象的**equals方法被重写**，那么对象的**HashCode也尽量重写**，以保证equals方法相等时两个对象hashcode返回相同的值（eg：Set集合中确保自定义类的成功去重）。

Set集合中**元素不重复**的基本逻辑判断示意图：
![image-20230316135310477](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316135311.png)

### 2. hashCode的算法
1. 对象类型的数据，返回的一串字符；
2. String类型的数据，返回一串字符；
3. integer类型的数据，返回的hash值为数据本身；

* Object对hashCode()的方法实现：

```java
 public native int hashCode();
```
该方法返回该对象的十六进制的哈希码值（即，对象在内存中的数字型名字）。
哈希算法根据对象的地址或者字符串或者数字计算出来的int类型的数值。而且哈希码并不唯一，可保证相同对象返回相同的哈希码，只能尽量保证不同对象返回不同的哈希码值。

* String 对hashCode()的方法实现：

```java
    public int hashCode() {
        int h = hash;
        if (h == 0 && value.length > 0) {
            char val[] = value;
 
            for (int i = 0; i < value.length; i++) {
                h = 31 * h + val[i];
            }
            hash = h;
        }
        return h;
    }
```
主要探讨一下String对于hashCode算法的实现：
>字符串对象的哈希码根据以下公式计算：
>s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
>使用 int 算法，这里 s[i] 是字符串的第 i 个字符，n 是字符串的长度，^ 表示求幂。空字符串的哈希值为 0。

* Integer对hashCode()的实现：

```java
    @Override
    public int hashCode() {
        return Integer.hashCode(value);
    }
```


### 3. hashCode的作用
哈希算法也称为散列算法，是将数据依特定算法直接指定到一个地址上。这样一来，当集合要添加新的元素时，先调用这个元素的HashCode方法，就一下子能定位到它应该放置的物理位置上。

（1）如果这个位置上没有元素，它就可以直接存储在这个位置上，不用再进行任何比较了；
（2）如果这个位置上已经有元素了，就调用它的equals方法与新元素进行比较，相同的话就不存了；
（3）不相同的话，也就是发生了Hash key相同导致冲突的情况，那么就在这个Hash key的地方产生一个链表，将所有产生相同HashCode的对象放到这个单链表上去，串在一起。这样一来实际调用equals方法的次数就大大降低了。 

 hashCode在上面扮演的角色为**寻域**（寻找某个对象在集合中区域位置）。

所以，总结一下，hashCode的存在主要是**用于查找的快捷性**，如Hashtable，HashMap，HashSet等。

>hashCode是用来在散列存储结构中确定对象的存储地址的。