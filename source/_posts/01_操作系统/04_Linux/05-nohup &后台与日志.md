---
title: 05-nohup &后台与日志
date: 2016-4-28 21:42:42
tags:
- Linux
- web
- 命令
- 后台
- 日志
- nohup
categories: 
- 01_操作系统
- 04_Linux
---

 

### 1. 后台运行+日志

```sh
# 【后台】后台且不挂断的运行 jar 包程序
nohup java -jar xxx.jar &

# 【日志】默认所有输出都在 nohup.out 文件中，也可以指定输出文件
nohup java -jar xxx.jar > myout.file 2>&1 &

# 【查看日志】从日志文件尾部实时查看输出的内容
tail -f nohup.out

# 【切分日志】切分同时不让它无限增长，做 .sh 脚本去后台启动
current_date=`date -d "-1 day" "+%Y%m%d"`
split -b 65535000 -d -a 4 nohup.out ./log/log_${current_date}_
# 65535000b 大概60多M吧，可以自定义大小
# 最终输出格式为 log_20190918_0001
```

**(1) nohup** 

加在一个命令的最前面，表示不挂断的运行命令

**(2) &**

加载一个命令的最后面，表示这个命令放在后台执行

> 日志默认输出位置：当前后台运行目录下的 nohup.out 文件中。

定义为 shell 脚本文件：`每天日志切分、易排查，体积过大时也可定时删除，保留几天即可`

```sh
#!/bin/bash
path=$(cd `dirname $0`;pwd)
 
cd $path
echo $path
current_date=`date -d "-1 day" "+%Y%m%d"`
echo $current_date
split -b 65535000 -d -a 4 /home/nohup.out /home/log/log_${current_date}_
cat /dev/null > nohup.out
```



### 2. 查看后台的任务

```sh
jobs
#[1]- 运行中        nohup java ... &
#[2]+ 运行中        nohup java ... &
```

`ps` 适用于查看瞬时进程的动态，可以看到别的终端的任务。

如： ps -aux | grep xxx 或 ps -ef | grep xxx

`jobs` 只能查看当前终端后台执行的任务



### 3. 前后台进程切换

（1）`fg`命令

将后台中的命令调至前台继续运行

（2）`Ctrl + z` 命令

将一个正在前台执行的命令放到后台，并且处于暂停状态

（3）`bg`命令

将一个在后台暂停的命令，变成在后台继续执行