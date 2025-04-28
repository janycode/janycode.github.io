---
title: 06-Linux服务器应急排查实战指南
date: 2025-05-02 15:00:58
index_img: https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241024154332.png
tags: 
- 服务器
- Linux
- 安全
categories:
- 06_服务器
- 00_Server
---

参考资料：

* 网络安全行业门户：https://www.freebuf.com/



## 引言

在服务器运行过程中，网络安全攻击频发，常见威胁包括 挖矿病毒、蠕虫传播、DDoS 攻击、后门程序等。这些攻击不仅影响系统稳定性，还可能造成数据泄露或业务中断。对于系统运维和应急排查人员而言，如何在最短时间内识别攻击迹象、精准定位问题来源，并迅速采取应对措施，是一项至关重要的技能。

## 1. 排查思路

1）了解清楚事件发生时间点、事件有什么特征、服务器的用途、服务器上部署的应用组件、已做过那些应急措施，禁忌上来就一顿操作；

2）大概思考下能沾边的网络攻击特征，同时根据服务器版本以及服务器上部署的组件看看近期是否有nday漏洞，有时匹配上了可以节约一大部分时间；

3）根据已部署的安全设备，快速看看异常事件以及已攻击成功的事件；

4）上机排查，使用busybox套装防止发生预期以外的情况，使用磁盘备份（dd）进行整个备份，或手工备份日志以及一些易被覆盖的系统文件，如：.viminfo、history，使用LiME（Linux Memory Extractor）备份服务器内存，或者使用手工追加将进程、网络连接状态等进行备份，（虚拟化/云环境可直接拍摄快照）；

5）根据前期了解的情况、事件特征进行排查，若排查到有一定的特征的异常文件或者进程时，可先到网上找找有没有相似案例，可以节约很多时间。

## 2. 常见网络安全攻击特征

| **攻击类型**                | **特征表现**                                                 |
| :-------------------------- | :----------------------------------------------------------- |
| **挖矿病毒**                | - CPU / GPU 长时间 **占用 100%**<br />- 异常进程（如`xmrig`、`kworker`、`ddgs`） <br />- 持续对外连接 **矿池地址**（`stratum+tcp://`） |
| **DDoS 攻击**               | - 服务器 **带宽异常占满**<br />-`netstat`显示大量`SYN_RECV`、`TIME_WAIT`<br />-`ps`发现大量`httpd`/`nginx`进程 |
| **后门木马**                | - **隐藏进程**，`ps`进程列表找不到但`top`能看到 <br />-`crontab`中出现可疑定时任务 <br />- 端口监听异常 (`ss -antp`显示 root 运行的非标准端口) |
| **蠕虫病毒**                | - 短时间内**大量文件变动**<br />-`top`显示异常高 I/O 负载 <br />- 服务器对外疯狂扫描其他 IP |
| **勒索病毒**                | - 文件被加密（扩展名`.lock`、`.encrypted`） <br />-`/tmp`目录下出现未知可执行文件 <br />-`ps`发现`wget`/`curl`下载可疑文件 |
| **Webshell / 恶意代码**     | - 网站目录（`/var/www/html/`）出现**陌生脚本文件**<br />- `grep -r eval` |
| **SQL 注入攻击**            | - 数据库`mysqld`进程 CPU 异常升高 <br />- 网站日志出现大量 **UNION SELECT**或 **OR 1=1**语句 |
| **暴力破解 SSH**            | -`/var/log/secure`出现大量 **failed login**记录 <br />-`who`发现陌生 IP 登录 <br />-`ss -antp`发现`22`端口大量连接 |
| **DNS 劫持**                | -`resolv.conf`被篡改，DNS 解析异常 <br />-`ping google.com`解析 IP 变化 <br />- 服务器 DNS 记录被改到`8.8.8.8`之外的未知 IP |
| **恶意代理 / 隧道**         | -`ps`发现`socat`、`nc`、`iodine`等隧道工具 <br />- 服务器对外大量`443`/`80`连接 <br />-`iptables`规则被修改 |
| **ARP 欺骗 / 内网流量劫持** | -`arp -a`显示异常网关 MAC <br />- 内网通信异常，流量到达错误 IP <br />-`tcpdump`发现 ARP 报文激增 |

## 3. Linux数据传输

应急响应需要将相应工具上传到服务器，可使用的方式：

| **传输方式**                       | **适用场景**                                                 | **使用示例**                                                 |
| :--------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **SCP（安全复制协议）**✅ 推荐      | 适用于**内网或有 SSH 访问权限**的服务器，支持加密传输        | `scp tool.tar.gz user@192.168.1.100:/tmp/`                   |
| **SFTP（安全文件传输）**✅ 推荐     | **基于 SSH**，适用于**Windows 客户端**上传                   | 使用`FileZilla`、`WinSCP`等客户端                            |
| **rsync（高效增量同步）**✅ 推荐    | **大文件同步**，支持**断点续传**                             | `rsync -avz tool.tar.gz user@192.168.1.100:/tmp/`            |
| **Xshell / Xftp（图形化）**        | 适用于**Windows 远程管理**                                   | **Xftp 上传文件到服务器**                                    |
| **FTP（不安全，谨慎使用）**        | 适用于**无 SSH 但开放 FTP 端口**的服务器                     | `ftp 192.168.1.100`                                          |
| **HTTP / Python Web 服务器**✅ 推荐 | 适用于**目标服务器可访问外网**的情况                         | `python3 -m http.server 8080`                                |
| **Wget / Curl（远程下载）**✅ 推荐  | 适用于**服务器能访问公网**的情况                             | `wget http://your-server.com/tool.tar.gz`                    |
| **Netcat（适用于封闭环境）**✅ 推荐 | **适用于内网受限环境**，可用于**无 SSH 但有端口通信的服务器** | **发送端：**`nc -lvp 4444 < tool.tar.gz`**接收端：**`nc IP 4444 > tool.tar.gz` |
| **SMB 共享（Windows ↔ Linux）**    | 适用于**Windows 与 Linux 互传**                              | **Linux 挂载 SMB:**`mount -t cifs //192.168.1.100/share /mnt` |
| **U 盘 / 物理介质**                | 适用于**离线服务器**                                         | 直接拷贝到 U 盘，然后`mount /dev/sdb1 /mnt`                  |

## 4. 应急排查方法

注：攻击者可能会替换系统关键命令（如`ls`、`ps`、`netstat`）来隐藏恶意进程或文件。若不使用busybox套装，建议使用如下命令查看命令是否被替换，以ls示例：

```bash
#确保命令路径正确
which ls

#查看 ls 是否是别名
alias

#检查 ls 的完整性，计算 ls 命令的 MD5 哈希值，并与系统正常版本对比，判断是否被篡改
md5sum /usr/bin/ls

#使用 RPM 验证系统核心文件
rpm -Va | grep ^..5

#运行 echo $PATH，如果 .（当前目录）在前，可能被劫持

#strace 跟踪系统调用，open 和 execve 能显示命令加载的库和执行的二进制文件
strace -e trace=open,execve ls

#使用 stat 检查命令的修改时间
stat /usr/bin/ls
```

### 4.1 账户/登录/权限信息排查

注：主要用于检测系统是否存在异常用户、未授权访问、权限提升等安全隐患。

##### 账户相关

```bash
/etc/passwd                        #查看所有账户，确认是否有陌生账户
grep -v "nologin" /etc/passwd           #找出所有能登录的用户
/home                            #用户家目录查看是否有陌生账户目录
awk -F: '($3==0){print $1}' /etc/passwd    #检查是否有多个 root 账户（UID=0）
cat /etc/shadow                    #如果shadow有,但passwd没有，可能是隐藏账户
```

![image-20250425153500867](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250425153509.png)

##### 权限相关

```bash
cat /etc/group | grep wheel  #CentOS/RHEL，sudo组
cat /etc/group | grep sudo  #Ubuntu/Debian，sudo组
getent group sudo        #查看组中有那些用户
cat /etc/sudoers         #其他用户是否有sudo权限，是否有NOPASSWD:ALL规则或ALL:ALL
#是否有进程/用户频繁使用 su 或 sudo 提权
grep "su" /var/log/auth.log  # Debian/Ubuntu，日志审查
grep "sudo" /var/log/secure  # CentOS，日志审查
```

![image-20250425153608560](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250425153609.png)

##### 登录相关

```bash
w  who  last lastb  lastlog              #用户登录信息查询
/var/log/secure                      #登录日志
grep "Accepted" /var/log/secure | grep sshd   #查看 SSH 成功登录记录（CentOS）
grep "Failed" /var/log/secure | grep sshd    #查看 SSH 失败登录（暴力破解痕迹）
SSH
cat /etc/ssh/sshd_config | grep -E "PermitRootLogin|PasswordAuthentication|AllowUsers"  #SSH 配置安全检查
cat ~/.ssh/authorized_keys          #检查是否有陌生SSH密钥
ls -lah /home/*/.ssh/authorized_keys
ls -lah /root/.ssh/             #查看root账户的SSH目录时间戳
#是否启用了危险的远程访问方式
netstat -antp | grep -E "22|23"     # 查找常见远程管理端口
```

### 4.2 进程以及网络连接排查

注：进程和端口排查是检测恶意程序、后门、隧道、木马等异常行为的关键步骤。

##### 网络相关

```bash
netstat -tulnp                           #网络连接查看
ss -tulpan                             #网络连接查看
watch -n 1 'netstat -antp | grep "192.168.60.1"'   #监视与可疑IP通信的进程
iptables -L                             #查看防火墙规则
tcpdump                               #tcpdump装包对数据包进行分析
```

可疑点：

- 是否有`0.0.0.0:xxxx`监听非常规外网端口
- 连接到国外 IP
- *进程名是否可疑
- 大量`TIME_WAIT`连接

##### 进程相关

```bash
ls -al /proc/PID/cwd               #根据PID查看该应用程序启动的目录
pwdx PID                           #查询进程PID的当前工作目录
lsof -p PID                        #查看PID进程打开的所有文件
lsof -i :22                        #查看监听或连接到端口 22的所有进程
lsof -u username                   #查看用户username打开的所有文件和网络连接
systemctl status PID               #查看进程的启动时间
stat filename                      #查看进程文件创建、访问、修改时间
pstree -a                          #查看所有进程父子关系
lsof | grep evil.sh                #根据文件查找PID
nmap -p- IP                        #通过扫描自己查看隐藏端口
ps -aux                            #查看所有进程
top -c                             #查看CPU占用率高的进程
cat /proc/                         #通过PID查看所有进程
ps                                 #查看启动进程的CMD
```

其他补充：

`deleted`但仍在运行的恶意进程，即使攻击者删除了恶意程序文件，如果它仍在运行，**文件可能被标记为`(deleted)`**。

```bash
ls -lah /proc/*/exe | grep deleted

#找到进程并提取可执行文件：
cp /proc/<PID>/exe /tmp/suspicious_binary
strings /tmp/suspicious_binary  # 分析二进制内容
```

可疑点：

- 占用 CPU / 内存异常高的进程
- 陌生或随机命名的进程（如`xyz123`、`/tmp/.xyz`）
- 运行用户异常（如`nobody`、`daemon`）

### 4.3 任务计划排查

注：攻击者常通过 计划任务（Crontab） 或 系统服务 进行持久化，确保恶意程序在服务器重启后仍能运行。因此，任务计划排查是检测恶意后门、木马和隐藏任务的关键步骤。

```bash
for user in $(cut -f1 -d: /etc/passwd); do echo "[$user]"; crontab -u $user -l 2>/dev/null; done                      #查看所有用户的定时任务
crontab -l                             #有部分恶意代码需要crontab -e 编辑才能看到
cat /var/log/cron                      #查看任务计划日志
cat /etc/crontab                       #系统全局 crontab 配置文件
cat /etc/anacrontab                    #查看 anacron 任务
ls -lah /etc/cron.d/                   #查看 /etc/cron.d 目录下的独立定时任务
ls -lah /etc/cron.hourly/              # 每小时执行的任务，通常用于日志清理或监控
ls -lah /etc/cron.daily/               # 每天执行的任务，如日志轮转（logrotate）
ls -lah /etc/cron.weekly/              # 每周执行的任务，通常用于备份或维护
ls -lah /etc/cron.monthly/             # 每月执行的任务，可能涉及系统更新等
ls -lah /var/spool/cron/               #查看所有用户的 crontab 任务存储文件
ls -lah /var/spool/anacron/            #查看 anacron 任务执行日志
atq                                    #at 计划任务查看
systemctl list-timers --all            #查看所有 systemd 定时任务
cat /etc/systemd/system/*.timer        #检查自定义 systemd 计划任务
find /etc/cron* -type f -mtime -3      #查找 3 天内修改的 cron 任务
grep -r "/tmp/" /etc/cron*             #查找任务是否调用 /tmp 目录的可疑脚本
```

![image-20250425153849774](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250425153851.png)

### 4.4 自启动排查

在应急响应中，自启动排查是发现恶意程序、后门、持久化攻击的重要步骤。攻击者可能通过多种方式实现系统启动后自动运行恶意代码。

##### 检查 systemd服务

```bash
systemctl list-unit-files --type=service   #列出所有启动服务
```

enabled：开机自启动，disabled：不开机启动，static：被其他服务依赖启动；

![image-20250425153922981](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250425153924.png)

可疑点：

- 服务名称伪装成常见服务（如`sshd.service`、`cron.service`），但路径异常
- 服务启动脚本在`/tmp/`、`/dev/shm/`、`/var/tmp/`目录中

##### 其他自启动文件/配置

```bash
# 查看 rc.local 文件，检查是否有异常启动项（如恶意脚本、反弹 shell）
cat /etc/rc.local  

# 列出所有 rc 运行级别目录中的启动项，关注 S 开头的脚本（表示开机启动）
ls -lah /etc/rc*.d/  

# 查看 init.d 目录，列出所有可以通过 init 脚本方式启动的服务
ls -lah /etc/init.d/  

# 检查当前用户的 Bash 配置文件，查看是否有异常命令
cat ~/.bashrc  

# 检查当前用户的 Bash 登录配置文件，可能包含自启动后门
cat ~/.bash_profile  

# 查看系统级别的环境变量及启动脚本，检查是否有全局恶意代码
cat /etc/profile  

# 如果使用 Zsh，检查其启动配置文件，可能存在隐藏后门
cat ~/.zshrc  

# 查看 systemd 系统服务文件，重点检查是否有异常服务文件
ls -lah /usr/lib/systemd/system  

# 列出 multi-user 运行级别的 systemd 服务，找出可疑的自动启动项
ls -lah /usr/lib/systemd/system/multi-user.target.wants  

# 检查 `/etc/inittab`，检查是否有异常的运行级别或启动项（针对 SysVinit 系统）
cat /etc/inittab  

# 使用 chkconfig 工具查看系统中所有的开机启动项（适用于 RHEL/CentOS 6）
chkconfig --list | grep "3:on|5:on"  
```

可疑点：

- 自定义脚本命名模仿系统服务，如`S99sshd`
- 脚本内容包含`curl`、`wget`、`nc`等下载/反弹 shell 工具

##### 检查内核模块

```bash
lsmod                                      # 列出所有加载的内核模块
modinfo <模块名>                            # 查看模块详细信息
ldd /usr/sbin/ss                           #ss命令动态库查询
/etc/ld.so.preload                         #该文件默认为空
```

可疑点：

- 模块名模仿系统模块（如`netfilter`）
- 模块路径在`/lib/modules/`之外

##### 环境变量

```bash
# 检查 LD_PRELOAD是否被劫持
echo $LD_PRELOAD        

#检查LD_LIBRARY_PATH是否被篡改
echo $LD_LIBRARY_PATH

#检查PROMPT_COMMAND是否被利用
echo $PROMPT_COMMAND

#检查SSH_AUTH_SOCK是否被劫持
echo $SSH_AUTH_SOCK     ls -lah $SSH_AUTH_SOCK

# 查看所有当前环境变量，检查是否存在可疑或异常的环境配置
env  

# 查看 shell 当前的所有变量和函数定义，可能发现异常的变量或环境配置
set  

# 查看当前 shell 环境变量的设置，可以用来确认是否有恶意篡改的内容
export  

# 查看某个进程的环境变量，检查是否被注入恶意环境配置
cat /proc/$PID/environ  
strings -f /proc/PID/environ

# 查看系统的 PATH 环境变量，确认是否有异常的路径（如恶意程序路径）
echo $PATH

#alias别名检查
alias
```

可疑点：

- 环境变量指向/tmp、/dev/shm等路径的异常文件
- 环境变量含可以命令
- 权限异常（`ls -lah $SSH_AUTH_SOCK`）

### 4.5 文件排查

在进行文件排查时，关键是识别系统中的异常文件、可能被篡改的文件、隐藏文件及新生成的文件。

![image-20250425154032486](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250425154033.png)



```bash
# 检查临时目录（可能用来存放恶意程序），特别是 /tmp 和 /var/tmp，如果挂载为 noexec，仍可能被攻击者利用进行本地提权
ls -al /tmp         /var/tmp

# 检查动态库目录，恶意程序可能通过修改或加入恶意动态库来劫持进程
ls -al /lib* /usr/lib*

# 检查关键系统目录（如 /dev、/etc），防止恶意文件的存在
ls -al /dev /etc

# 检查 /dev/shm 目录，该目录在 Linux 中用于内存存储，恶意程序可能会在内存中运行并藏匿
ls -al /dev/shm

# 检查常见的可执行文件目录，可能包含恶意脚本或二进制文件
ls -al /bin /sbin /usr/bin /usr/sbin

# 检查是否有恶意的 SSH 后门脚本，可能被放置在 /etc/update-motd.d/ 中
ls -al /etc/update-motd.d/

# 查看主机 DNS 配置文件，检查是否有恶意 DNS 配置
cat /etc/hosts
cat /etc/resolv.conf

# 查找隐藏文件和目录，检查是否有可疑文件或后门
ls -al / | grep "^."
find / -type d -name ".*"  # 查找隐藏目录

# 查找具有 setuid 权限的文件，可能会被攻击者利用进行提权
find / -type f -perm -4000

#查找所有非标准权限的文件
find /bin /usr/bin /sbin /usr/sbin -type f ! -perm 755

# 查看文件系统的属性，可能存在不正常的文件保护（i属性）
lsattr / -R 2>/dev/null | grep "----i"

# 使用 rpm 校验系统文件，检测文件是否被篡改
rpm -Va | grep ^..5

#VIM文件编辑历史，可能存在编辑过恶意文件痕迹
/root/.viminfo    

# 查找最近修改的 JSP 文件，可能是被利用的 WebShell
find / -name "*.jsp" -ctime -2

# 查找特定目录下的 PHP 文件，检查是否包含恶意代码
find /var/ -type f -name '*.php' | xargs grep 'eval' | more

#对比两个文件内容的差异
diff -c -a -r cms1 cms2
```

补充：如果文件被删除且该文件正在被使用的情况下，通过lsof从/proc目录下恢复该文件的内容

![image-20250425154013979](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250428142136.png)

### 4.6 日志分析

##### 日志文件

```bash
# 记录身份验证信息，包括用户登录、sudo 使用、SSH 登录等，该日志对于安全审计至关重要；
cat /var/log/auth.log  # Debian/Ubuntu 系统
cat /var/log/secure    # CentOS/Red Hat 系统

# 记录系统定时任务（Cron）执行的日志，帮助分析计划任务的运行情况
cat /var/log/cron

# 记录邮件服务的相关日志，包括邮件的发送、接收、传输等信息
cat /var/log/maillog  # Red Hat/CentOS 系统
cat /var/log/mail.log  # Debian/Ubuntu 系统

# 记录 Apache HTTP 服务器的访问日志和错误日志，用于分析 Web 服务的状态、请求等信息
cat /var/log/httpd/access_log  # Red Hat/CentOS 系统
cat /var/log/apache2/access.log  # Debian/Ubuntu 系统

# 记录 MySQL 数据库的日志信息，包括查询日志、错误日志、慢查询日志等
cat /var/log/mysql/error.log  # MySQL 错误日志
cat /var/log/mysql/mysql.log  # MySQL 查询日志

# 记录安全相关的审计信息，包括用户活动、权限变更、访问敏感资源等事件。
cat /var/log/audit/audit.log

# 记录 UFW（Uncomplicated Firewall）防火墙日志，显示哪些请求被允许或拒绝
cat /var/log/ufw.log

# 记录 Samba 服务的日志，包括共享文件夹访问情况、网络文件传输等信息
cat /var/log/samba/log.smbd
```

##### 日志分析

```bash
#查看爆破失败的 IP
grep 'Failed' /var/log/secure | awk '{print $11}' | sort | uniq -c | sort -nr | head -n 10

#查看登录成功的 IP
grep 'Accepted' /var/log/secure | awk '{print $11}' | sort | uniq -c | sort -nr | head -n 10

#定位有多少 IP 在爆破 root 帐号
grep "Failed password for root" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -nr | head -n 5

#查看登录成功的日期、用户名及 IP
grep "Accepted " /var/log/secure* | awk '{print $1,$2,$3,$9,$11}'

#查看爆破用户名字典
grep "Failed password" /var/log/secure | awk '{print $9}' | sort | uniq -c | sort -nr

#查看爆破失败的所有密码字典
grep -o "Failed password" /var/log/secure | uniq -c

#查看 su sudo使用情况
grep 'su' /var/log/secure
grep 'sudo' /var/log/secure

#检查 sudo 错误尝试
grep "incorrect password attempt" /var/log/secure

#查看通过 sudo 或 su 提权的时间和来源
grep 'sudo' /var/log/secure | awk '{print $1, $2, $3, $9, $11, $NF}' | sort | uniq -c | sort -nr
grep 'su' /var/log/secure | awk '{print $1, $2, $3, $9, $11}' | sort | uniq -c | sort -nr
```

![image-20250425154131102](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250425154132.png)

## 5. 隐藏后门以及排查方法

### SSH Wrapper后门

攻击者通过替换合法的 SSH 服务（如 /usr/sbin/sshd），在其中嵌入恶意代码，实现后门访问。

排查方法：

验证`/usr/sbin/sshd`的完整性，查看其是否为脚本或被替换；

file /usr/sbin/sshd

如果`sshd`是脚本，检查其内容是否包含可疑代码。

cat /usr/sbin/sshd

### 端口复用

通过端口复用来达到隐藏端口、绕过防火墙的目的。

排查方法：通过端口扫描检查是否有端口复用，通过ss或者netstat无法检查出，发现端口复用后排查iptables以及相关服务配置是否被更改；

![image-20250425154201774](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250425154203.png)

### 进程隐藏

管理员无法通过相关命令工具查找到你运行的进程，从而达到隐藏目的，实现进程隐藏。

cpu 使用率高,但是却找不到任何占用cpu高的程序

![image-20250425154221270](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250425154222.png)

排查方法：

`unhide`是一个小巧的网络取证工具，能够发现那些借助rootkit，LKM及其它技术隐藏的进程和TCP / UDP端口。

![image-20250425154237904](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250425154239.png)

### SUID Shell

Suid shell是一种可用于以拥有者权限运行的shell，使用普通用户登录就可以获取root权限。

![image-20250425154255002](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250425154256.png)

排查方法：

```bash
# 在Linux中查找SUID设置的文件
find . -perm /4000 
# 在Linux中查找使用SGID设置的文件
find . -perm /2000
# 取消s权限
chmod u-s /tmp/shell
```

### SSH公私钥免密登录

排查方法：查看`/root/.ssh/authorized_keys`是否被修改，find / -name`authorized_keys`。

### 软连接

软连接后门是一种 隐蔽性较强 的持久化后门方法，攻击者利用软链接 (ln -s) 指向关键文件或隐藏恶意程序，使其在特定条件下执行，达到 权限提升、命令劫持或绕过安全检查 的目的。

劫持`/etc/ld.so.preload`

`ld.so.preload`是 Linux 动态链接库预加载机制，攻击者可以创建软链接，注入恶意`so`文件：

```bash
ln -sf /tmp/malicious.so /etc/ld.so.preload
```

系统所有动态链接的可执行程序都会加载`/tmp/malicious.so`，实现权限提升或隐藏恶意进程。

排查方法：

```bash
find / -type l -ls 2>/dev/null
```

检查是否有关键目录的异常软链接，检查 /tmp、/dev/shm 等目录中的可疑软链接。

### strace后门

攻击者利用`strace`工具，通过命令替换动态跟踪系统调用和数据，记录用户的敏感操作，如 SSH、SU、SUDO 等。

通过修改用户的环境配置文件（如`.bashrc`），为常用命令设置别名，加入`strace`跟踪。

排查方法：

查看`.bashrc`、`.bash_profile`等文件，查找异常的别名设置。

```bash
grep 'alias' ~/.bashrc ~/.bash_profile
```

查找系统中是否存在可疑的隐藏日志文件

```bash
find / -name '.*' -type f -size +1M
```

### openSSH后门

攻击者可能替换`/usr/sbin/sshd`或`/bin/ssh`以植入后门，使其在认证阶段记录密码或允许特定后门密码登录。

排查方法：

```bash
rpm -Va | grep openssh  # 检查 RPM 安装包完整性（适用于 RPM 系统）
dpkg --verify openssh-server  # 检查 DEB 安装包完整性
md5sum /usr/sbin/sshd  # 计算 md5 并与官方比对
ls -lah /usr/sbin/sshd  # 检查时间戳是否异常

strace -o aa -ff -p  SSHDPID #跟踪sshd PID
```

### PAM后门

PAM（可插拔认证模块）是 Linux 认证机制的重要组成部分。攻击者可以通过劫持 PAM 模块或修改 PAM 配置，实现无密码登录、隐藏用户、记录密码等后门。

```bash
后门方式                     检查方法                       修复措施
替换PAM认证模块        md5sum /lib/security/pam_unix.so     重新安装 PAM
添加自定义 PAM 后门   ls -l /lib/security/                   删除恶意 .so 文件
修改 PAM 配置         grep "pam_permit.so" /etc/pam.d/sshd 还原 /etc/pam.d/sshd
认证日志劫持            grep "pam_exec.so" /etc/pam.d/*   删除恶意日志记录
LD_PRELOAD 劫持      cat /etc/ld.so.preload              删除 /etc/ld.so.preload
```

## 6. 实用排查/杀毒工具

```bash
chkrootkit          #能检测已知的Rootkit特征，如隐藏进程、恶意netstat、ifconfig等

Rkhunter            #专业检测系统是否感染rootkit的工具  rkhunter -check
地址：http://rootkit.nl/projects/rootkit_hunter.html

ClamAV              #支持病毒库更新，可检测病毒、木马、恶意软件
使用yum可进行安装，需要先安装依赖包
sudo apt install clamav*      安装
sudo freshclam                   更新
clamscan -ri / -l o           全盘扫描

河马                #webshell查杀
地址：https://www.shellpub.com/

NeoPi       #检测文本/脚本文件中的混淆和加密内容，其主要目的是帮助检测隐藏的Web Shell 代码

unhide              #能够发现那些借助rootkit，LKM及其它技术隐藏的进程和TCP / UDP端口。
sudo yum install unhide          #安装
unhide [options] test_list       #unhide proc   unhide sys

execsnoop           #execsnoop通过ftrace实时监控进程的exec()行为，输出短时进程的信息，包括进程 PID、父进程 PID、命令行参数以及执行的结果。
https://github.com/brendangregg/perf-tools

java -jar arthas-boot.jar    #sc javax.servlet.* 查找内存马
```

