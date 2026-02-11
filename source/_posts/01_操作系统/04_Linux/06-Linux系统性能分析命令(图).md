---
title: 06-Linux系统性能分析命令(图)
date: 2017-4-28 21:42:42
tags:
- Linux
- 命令
- 性能
categories: 
- 01_操作系统
- 04_Linux
---

 



![Linux系统性能分析命令图谱](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200822132126.png)



`top命令`参数和对应的信息：

1. 线程数：在top命令的输出中，可以看到一个名为"Tasks"的行，其中的`"Tasks:"列显示了当前系统中的总线程数，"Running"列显示了正在运行的线程数`。
2. CPU使用情况：在top命令的输出中，可以看到一个名为"%Cpu(s)"的行，其中的`"%Cpu(s):"列显示了当前CPU的使用情况`。具体的CPU使用情况包括用户态、系统态、空闲等。
3. 内存使用情况：在top命令的输出中，可以看到一个名为`"KiB Mem"的行，其中的"total"列显示了系统总内存，"used"列显示了已使用的内存，"free"列显示了空闲的内存`。