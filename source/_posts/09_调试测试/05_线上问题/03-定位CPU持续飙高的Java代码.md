---
title: 定位CPU持续飙高的Java代码
date: 2022-5-25 16:33:43
tags: 
- 服务器
- CPU
- jstack
categories:
- 09_调试测试
- 05_线上问题
---



```bash
#找到CPU飙高的进程id，即PID
top

#找到CPU飙高的进程中的线程id，也是PID
top -Hp 进程id

#将线程id转换为16进制
printf "0x%x" 线程id

#使用jstack找到线程栈信息，定位代码位置；-A 5 打印匹配行和后5行
jstack 线程id | grep 十六进制线程id -A 5
```




