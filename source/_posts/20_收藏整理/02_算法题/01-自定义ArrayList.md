---
title: 01-自定义ArrayList
date: 2017-6-28 23:09:27
tags:
- 算法题
categories: 
- 20_收藏整理
- 02_算法题
---



* 需要导入外部的包 java.util.Arrays.copyOf(); 用于数组扩容
* 对于重复使用的如check、print类的功能以函数编写减少代码冗余
* 对数组的操作主要是2点：① 越界问题；②索引下标0~length-1问题；
* 使用独立的size作为数组的有效元素个数统计，更利于可读性；



```java
import java.util.Arrays; // Arrays.copyOf() 数组扩容

public class TestArrayAction {
    
    static int[] arr = new int[8]; // 全局数组
    static int size = 0; // 数组有效长度
    
    public static void main(String[] args) {
        int num = 11;
        
        System.out.println("source arr.length = " + arr.length);
        
        // 增 - test
        for (int i = 0; i < 12; i++) {
            System.out.println("insert >> arr[" + i + "] = " + num);
            insert(i, num);
            num += 11;
        }
        print(); // 11 22 33 44 55 66 77 88 99 110 121 132
        
        // 删 - test
        System.out.println("delete(3), 44 >>");
        delete(3);
        print(); // 11 22 33 55 66 77 88 99 110 121 132
        
        // 改 - test
        System.out.println("replace(2, 99) >>");
        replace(2, 99);
        print(); // 11 22 99 55 66 77 88 99 110 121 132
        
        // 查 - test
        int result = search(2);
        System.out.println("search(2) >> " + result);


    }


    // 【增】指定数组下标位置插入数值
    public static void insert (int pos, int val) {
        
        // 1.判断扩容
        if (size == arr.length) {
            expandArr();
        }
        
        // 2.检查pos下标值合法
        if (!checkPos(pos)) {
            return;
        }
        
        // 3.后移pos到size之间的元素，将val值赋值插入
        for (int i = size; i > pos; i--) {
            arr[i] = arr[i-1];
        }
        arr[pos] = val;


        // 4.有效长度++
        size++;
    }


    // 【删】删除指定位置的值
    public static void delete (int pos) {
        // 1.检查pos下标值合法
        if (!checkPos(pos)) {
            return;
        }
        
        // 2.前移pos到size-1位置的元素，逐个覆盖
        for (int i = pos; i < size-1; i++) {
            arr[i] = arr[i+1];
        }
        
        // 3.有效值--
        size--;
    }
    
    // 【改】修改指定数组下标位置的元素值
    public static void replace (int pos, int val) {
        // 1.检查pos下标值合法
        if (!checkPos(pos)) {
            return;
        }
        
        // 2.赋值覆盖pos下标位置元素
        arr[pos] = val;        
    }
    
    // 【查】查找指定下标位置的值，返回该值
    public static int search (int pos) {
        // 1.检查pos下标值合法
        if (!checkPos(pos)) {
            return -1; // 默认ERROR为-1
        }
        
        return arr[pos];
    }
    
    // <扩容>将数组扩容一倍
    public static void expandArr () {
        // 元素复制+地址赋值，一行搞定
        arr = Arrays.copyOf(arr, arr.length*2);
    }
    
    // <检查>下标索引值通用检查
    public static boolean checkPos (int pos) {
        if (pos < 0 || pos > arr.length) {
            System.out.println("Error: 索引值越界，请核对传参！");
            return false;
        } else {
            return true;
        }
    }
    
    // <打印>遍历数组，打印有效值
    public static void print () {
        for (int i = 0; i < size; i++) {
            System.out.print(arr[i] + " ");
        }
        System.out.println();
    }
}
```
输出：
source arr.length = 8
insert >> arr[0] = 11
insert >> arr[1] = 22
insert >> arr[2] = 33
insert >> arr[3] = 44
insert >> arr[4] = 55
insert >> arr[5] = 66
insert >> arr[6] = 77
insert >> arr[7] = 88
insert >> arr[8] = 99
insert >> arr[9] = 110
insert >> arr[10] = 121
insert >> arr[11] = 132
11 22 33 44 55 66 77 88 99 110 121 132
delete(3), 44 >>
11 22 33 55 66 77 88 99 110 121 132
replace(2, 99) >>
11 22 99 55 66 77 88 99 110 121 132
search(2) >> 99