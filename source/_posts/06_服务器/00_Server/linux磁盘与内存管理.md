---
title: linux磁盘与内存管理
date: 2024-5-25 15:00:58
tags: 
- 服务器
- 磁盘
- 内存
categories:
- 06_服务器
- 00_Server
---



## 磁盘管理

```bash
#查看硬盘挂载情况
vi /etc/fstab
#挂载设置格式参考: /dev/vdb1   /opt ext4    defaults    0  0

#列出硬盘列表（aliyun的磁盘是以此命名：vda[vda1, vda2...], vdb[vdb1, vdb2...]）
ll /dev/vd*

#列出硬盘挂载目录情况（树状图）
lsblk

#查看磁盘用量情况，如 /dev/vdb1 盘
fdisk -l /dev/vdb1

#查看硬盘与挂载目录和使用情况
df -h

#查看当前一级目录文件大小
du -h --max-depth=1

#查看当前目录所有文件大小
du -sh
```



## 内存管理

小知识：测试服务器内存不够用怎么办？（使用类似虚拟内存的方式设置一部分硬盘空间为交换内存）

![image-20240929171434533](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240929171443.png)



![image-20240929171539325](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240929171540.png)