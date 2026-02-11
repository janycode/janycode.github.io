---
title: 04-JVM参数调优
date: 2020-4-15 22:17:25
tags:
- JVM
- 调优
categories: 
- 07_虚拟机
---





参考资料(oracle官网)：https://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html#BABFAFAE

### 1. 常用参数

- -Xms：初始化堆大小，建议设置与-Xmx同样大小

- -Xmx：最大堆的大小，依据程序稳定运行期活跃数据的大小，建议设置为活跃数据的3·4倍

- -Xmn：堆年轻代的初始化大小和最大大小；等同于-XX:NewSize和-XX:MaxNewSize建议设置大小占整个堆的1/4·3/8。如果系统是纯IO交互，不涉及大量自建缓存，如网关可适当调大年轻代所占比列

- -Xss：线程栈的大小，等同于-XX:ThreadStackSize，64位linux下，大小默认1m，建议非特殊需求不要调整

- -XX：MetaspaceSize：建议与MaxMetaspaceSize一样大小

- -XX：MaxMetaspaceSize：根据项目启动加载类得的个数设置，通常一个类大小不超过10k

- -XX：+UseCompressedOops：适用64位JVM，默认开启，不建议调整

- -XX:+UseCompressedClassPointers：适用64位JVM，默认开启，不建议调整

- -XX：+HeapDumpOnOutOfMemoryError：建议开启,outOfMemoryError引发异常时转储堆到本地

- -XX：HeapDumpPath：异常堆存储路径

- -XX：-UseBiasedLocking：如果你的同步资源或代码一直都是多线程访问的，可开启参数。默认是关闭的

### 2. 垃圾回收器的选择

#### 2.1 CMS垃圾回收器

- -XX:+UseConcMarkSweepGC：采用cms垃圾回收器，建议线上使用

- -XX:UseCMSCompactAtFullCollection:默认是true，处理内存碎片，不建议修改

- -XX:CMSFullGCsBeforeCompaction：整数值，默认是0.多少次fullgc后进行内存压缩；经验值6-10次

- -XX:+CMSScavengeBeforeRemark：重新标记前进行一次younggc建议开启

- -XX:+UseCMSInitiatingOccupancyOnly：建议开启

- -XX:CMSInitiatingOccupancyFraction：默认是92，经验值70左右

- -XX:+CMSClassUnloadingEnabled:类得卸载，默认开启，如果比较耗时，可以考虑关闭

#### 2.2 G1垃圾回收器

- -XX：+UseG1GC：堆大小约为6GB或更大，建议采用G1垃圾回收器



如果当前具有CMS或ParallelOld垃圾收集器运行的应用程序具有以下一个或多个特征，建议切换G1

超过50％的Java堆被实时数据占用。不必要的长时间垃圾收集或压缩暂停（长于0.5到1秒)。

**涉及JIT编译项的参数不建议调整。**