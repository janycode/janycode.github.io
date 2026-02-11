---
title: 00-OSI七层模型
date: 2016-4-28 22:08:09
tags:
- JavaSE
- OSI
- TCP/IP
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 07_网络编程
---



### 1. 计算机网络

为实现资源共享和信息传递，通过通信线路连接起来的若干主机(Host)。

互联网：Internet 

点与点相连万维网：WWW World Wide Web 

端与端相连物联网：IoT Internet of things 

物与物相连网络编程：让计算机与计算机之间建立连接、进行通信。



### 2. 网络模型

**OSI**（Oper System Interconnection）开放式系统互联。

由底层到上层：`物理层、数据链路层、网络层、传输层、会话层、表示层、应用层`。

> 物、数、网、传、会、表、应
>
> 谐音：`武术网传会比较硬`！

![image-20200530163510444](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200530163510444.png)

![image-20200530163520211](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200530163520211.png)

### 3. TCP/IP模型

TCP/IP 四层模型：`网络接口层、网络层、传输层、应用层`。

![image-20200530163528162](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200530163528162.png)



### 4. TCP/UDP协议

**TCP**：传输控制协议

* 一种`面向连接、可靠的、基于字节流的传输层协议`。
* 数据包`大小无限制`。
* 建立连接的过程需要`三次握手`，断开连接的过程需要`四次挥手`。

**UDP**：用户数据报协议

* 一种`无连接的传输层协议`，提供面向事务的简单不可靠信息传送服务。
* 每个包的大小`64kb`。



### 5. IP协议

IPV4:4字节32位整数IPV6:16字节128位整数

![image-20200530163600062](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200530163600062.png)

### 6. Port

![image-20200530163608178](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200530163608178.png)