---
title: 01-ssh使用详解
date: 2022-04-01 11:14:31
tags: 
- 服务器
- ssh
categories:
- 06_服务器
- 00_Server
---



## SSH 基本知识

SSH（Secure Shell 的缩写）是一种网络协议，用于加密两台计算机之间的通信，并且支持各种身份验证机制。

实务中，它主要用于保证远程登录和远程通信的安全，任何网络服务都可以用这个协议来加密。

历史上，网络主机之间的通信是不加密的，属于明文通信。这使得通信很不安全，一个典型的例子就是服务器登录。登录远程服务器的时候，需要将用户输入的密码传给服务器，如果这个过程是明文通信，就意味着传递过程中，线路经过的中间计算机都能看到密码，这是很可怕的。

SSH 就是为了解决这个问题而诞生的，它能够加密计算机之间的通信，保证不被窃听或篡改。它还能对操作者进行认证（authentication）和授权（authorization）。明文的网络协议可以套用在它里面，从而实现加密。

## 安装

* ubuntu

  ```bash
  sudo apt install openssh-server  #下载安装ssh服务的服务器
  sudo apt install openssh-client  #下载安装ssh服务的客户端
  ```

* centos

  ```bash
  yum install openssh-server       #安装ssh
  systemctl start sshd.service     #启动ssh
  systemctl status sshd.service    #查看ssh启动状态：active (running)
  systemctl enable sshd.service    #设置开机启动
  ```

  

## 跳过密码

需要安装：

```bash
sudo apt-get install sshpass     # Ubuntu/Debian
sudo yum install sshpass         # CentOS/RHEL
```

执行远程命令：

```bash
sshpass -p 'your_password' ssh user@remote_host 'command_to_execute'
```

这里，`your_password` 是你的密码，`user` 是远程服务器上的用户名，`remote_host` 是远程服务器的地址，`command_to_execute` 是你想在远程服务器上执行的命令。

> 更安全的方法是使用SSH密钥对。
>
> 在本地机器上生成一个SSH密钥对，然后将公钥添加到远程服务器的 `~/.ssh/authorized_keys` 文件中。

* 无密码地SSH登录到远程服务器

  ```bash
  ssh-keygen -t rsa                          #生成公钥
  ssh-copy-id user@remote_host               #拷贝公钥到远程服务器：此处需要输入一次远程服务器密码
  ssh user@remote_host 'command_to_execute'  #无需输入密码就可以远程执行命令了
  ```

  

## 密码更新

场景为出现报错信息：`sh: .ssh/authorized_keys: Permission denied`

* 本机操作：

```bash
#生成ssh
ssh-keygen 
#将公钥的内容写入authorized_keys中
cat id_rsa.pub >> authorized_keys

#将公钥发送给目标主机
scp id_rsa.pub xxx.xxx.xxx.xxx:/root/.ssh
```

* 接下来是目标主机的操作：

```bash
#刚开始删除的时候报Operation not permitted，用这个指令就可以了
chattr -i authorized_keys  
#删除原来的authorized_keys文件
rm -rf authorized_keys
cat id_rsa.pub >> authorized_keys
```

然后再 ssh ip地址 就可以连接主机了，或者 ssh执行远程命令也没问题了。

## 默认进入目录

在 SSH 连接后默认进入的目录可以通过以下几种方法进行修改：
修改用户主目录下的 `.bash_profile` 或 `.bashrc`

```bash
# 设置默认进入的目录
cd /new/dir/
```



## scp客户端

### 本地文件复制到远程

复制本机文件到远程系统的用法如下。

```bash
#语法 
scp SourceFile user@host:directory/TargetFile 
#示例 
scp file.txt remote_username@10.10.0.2:/remote/directory
```

下面是复制整个目录的例子。

```bash
#将本机的 documents 目录拷贝到远程主机， 
#会在远程主机创建 documents 目录 
scp -r documents username@server_ip:/path_to_remote_directory 
#将本机整个目录拷贝到远程目录下 
scp -r localmachine/path_to_the_directory username@server_ip:/path_to_remote_directory/ 
将本机目录下的所有内容拷贝到远程目录下 
scp -r localmachine/path_to_the_directory/* username@server_ip:/path_to_remote_directory/
```

### 远程文件复制到本地

从远程主机复制文件到本地的用法如下。

```bash
#语法 
scp user@host:directory/SourceFile TargetFile 
#示例 
scp remote_username@10.10.0.2:/remote/file.txt /local/directory
```

下面是复制整个目录的例子。

```bash
#拷贝一个远程目录到本机目录下  
scp -r username@server_ip:/path_to_remote_directory local-machine/path_to_the_directory/  
#拷贝远程目录下的所有内容，到本机目录下  
scp -r username@server_ip:/path_to_remote_directory/* local-machine/path_to_the_directory/ 
scp -r user@host:directory/SourceFolder TargetFolder 
```



### 两个远程系统之间的复制

本机发出指令，从远程主机 A 拷贝到远程主机 B 的用法如下。

```bash
#语法 
scp user@host1:directory/SourceFile user@host2:directory/SourceFile 
#示例 
scp user1@host1.com:/files/file.txt user2@host2.com:/files
```

系统将提示你输入两个远程帐户的密码。数据将直接从一个远程主机传输到另一个远程主机。

