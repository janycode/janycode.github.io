---
title: 02-Linux常用命令
date: 2016-4-28 21:42:42
tags:
- Linux
- 命令
- vim
- VMware
- CentOS
categories: 
- 01_操作系统
- 04_Linux
---

 

### Linux的概述

 

Linux是基于Unix的开源免费的操作系统，继承了Unix以网络为核心的设计思想，是一个性能稳定的多用户网络操作系统。由于系统的稳定性和安全性几乎成为程序代码运行的最佳系统环境。

 

Linux是由Linus Torvalds（林纳斯·托瓦兹）起初开发的，由于源代码的开放性，现在已经衍生出了千上百种不同的Linux系统。

 

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200704200025.png)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200704200029.png)

 

Linux系统的应用非常广泛，不仅可以长时间的运行我们编写的程序代码，还可以安装在各种计算机硬件设备中，比如手机、平板电脑、路由器等。尤其在这里提及一下，我们熟知是Android程序最底层就是运行在Linux系统上的。

各种场合都有使用各种Linux发行版，从嵌入式设备到超级计算机，并且在服务器领域确定了地位，通常服务器使用LAMJ（Linux + Apache + MySQL + java）或LNMJ（Linux + Nginx+ MySQL + java）组合。

 

Linux内核网站：[www.kernel.org](http://www.kernel.org) 

### Linux的分类

 

**Linux根据市场需求不同，基本分为两个方向**：

1. 图形化界面版：注重用户体验，类似window操作系统，但目前成熟度不够.

2. 服务器版：没有好看的界面，是以在控制台窗口中输入命令操作系统的，类似于DOS，是我们架设服务器的最佳选择.

 

Linux根据原生程度，又分为两种

1. 内核版本：在Linus领导下的内核小组开发维护的系统内核的版本号.

2. 发行版本：一些组织或公司在内核版基础上进行二次开发重新发行的版本.

 

Linux发行版本不同，又可以分为n多种：

 	  ![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200704200047.png)

 

 

### Linux与Windows

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200706192608.png)

 

### Linux的安装

因为Linux也是一个系统，本质上跟我们电脑的Window没有区别，我们可以在我们电脑上安装一个软件，这个软件可以模拟一台或多台虚拟的电脑机器，这就是虚拟机。

 

虚拟机（Virtual Machine）指通过软件模拟的具有完整硬件系统功能的、运行在一个完全隔离环境中的完整计算机系统。虚拟系统通过生成现有操作系统的全新虚拟镜像，它具有真实windows系统完全一样的功能，进入虚拟系统后，所有操作都是在这个全新的独立的虚拟系统里面进行，可以独立安装运行软件，保存数据，拥有自己的独立桌面，不会对真正的系统产生任何影响 ，而且具有能够在现有系统与虚拟镜像之间灵活切换的一类操作系统。虚拟系统和传统的虚拟机（Parallels Desktop ，Vmware，VirtualBox，Virtual pc）不同在于：虚拟系统不会降低电脑的性能，启动虚拟系统不需要像启动windows系统那样耗费时间，运行程序更加方便快捷；虚拟系统只能模拟和现有操作系统相同的环境，而虚拟机则可以模拟出其他种类的操作系统；而且虚拟机需要模拟底层的硬件指令，所以在应用程序运行速度上比虚拟系统慢得多。流行的虚拟机软件有VMware(VMWare ACE）、Virtual Box和Virtual PC，它们都能在Windows系统上虚拟出多个计算机

 

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200706192624.png)

 

### VMware的安装

VMware 可以使你在一台机器上同时运行二个或更多Windows、DOS、LINUX系统。与“多启动”系统相比，VMWare采用了完全不同的概念。多启动系统在一个时刻只能运行一个系统，在系统切换时需要重新启动机器。VMWare是真正“同时”运行，多个操作系统在主系统的平台上，就像标准Windows应用程序那样切换。而且每个操作系统你都可以进行虚拟的分区、配置而不影响真实硬盘的数据，你甚至可以通过网卡将几台虚拟机用网卡连接为一个局域网，极其方便。安装在VMware操作系统性能上比直接安装在硬盘上的系统低不少，因此，比较适合学习和测试。 使我们可以在同一台PC机上同时运行Windows 、Linux、FreeBSD……可以在使用Linux的同时，即时转到Windows中运行Word。如果要使用Linux，只要轻轻一点，又回到Linux之中。就如同你有两台计算机在同时工作。实现的工具就是：虚拟计算平台——Vmware。

 

### CentOS的安装

CentOS是一个Linux的发行版本，是目前企业中用来做应用服务器系统的主要版本，CentOS的安装，其实是将该系统安装到VMware虚拟机软件中，让VMware虚拟机软件模拟出一台Linux系统的电脑。



CentOS官网：http://www.centos.org/

CentOS搜狐镜像：http://mirrors.sohu.com/centos/

CentOS网易镜像：http://mirrors.163.com/centos/

 

 

### **远程工具的安装**

​		

FileZilla（文件传输工具） 和 Xshell（远程命令工具）

 

### **Linux目录结构**

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200704200147.png)

/ 根目录

/bin：是Binary的缩写, 这个目录存放着最经常使用的命令。

/boot：存放的是启动Linux时使用的一些核心文件，包括一些连接文件以及镜像文件。

/dev ：是Device(设备)的缩写, 该目录下存放的是Linux的外部设备，在Linux中访问设备的方式和访问文件的方式是相同的。

/etc：用来存放所有的系统管理所需要的配置文件和子目录。

/home：用户的主目录，在Linux中，每个用户都有一个自己的目录，一般该目录名是以用户的账号命名的。

/lib：放着系统最基本的动态连接共享库，其作用类似于Windows里的DLL文件。几乎所有的应用程序都需要用到这些共享库。

/lost+found：这个目录一般情况下是空的，当系统非法关机后，这里就存放了一些文件。

/media：linux系统会自动识别一些设备，例如U盘、光驱等等，当识别后，linux会把识别的设备挂载到这个目录下。

/mnt：系统提供该目录是为了让用户临时挂载别的文件系统的，我们可以将光驱挂载在/mnt/上，然后进入该目录就可以查看光驱里的内容了。

/opt：主机额外安装软件所摆放的目录。比如你安装一个ORACLE数据库则就可以放到这个目录下。默认是空的。

/proc：是一个虚拟的目录，它是系统内存的映射，我们可以通过直接访问这个目录来获取系统信息。

/root：为系统管理员，也称作超级权限者的用户主目录。

/sbin：s就是Super User的意思，这里存放的是系统管理员使用的系统管理程序。

/selinux：是Redhat/CentOS所特有的目录，Selinux是一个安全机制，类似于windows的防火墙，但是这套机制比较复杂，这个目录就是存放selinux相关的文件的。

/srv：存放一些服务启动之后需要提取的数据。

/sys：linux2.6内核的一个很大的变化。该目录下安装了2.6内核中新出现的一个文件系统 sysfs，sysfs文件系统集成了下面3种文件系统的信息：针对进程信息的proc文件系统、针对设备的devfs文件系统以及针对伪终端的devpts文件系统。该文件系统是内核设备树的一个直观反映。当一个内核对象被创建的时候，对应的文件和目录也在内核对象子系统中被创建。

/tmp：是用来存放一些临时文件的。

/usr：用户的很多应用程序和文件都放在这个目录下，类似于windows下的program files目录。

/usr/bin：系统用户使用的应用程序。

/usr/sbin：超级用户使用的比较高级的管理程序和系统守护程序。

/usr/src：内核源代码默认的放置目录。

/var：这个目录中存放着在不断扩充着的东西，我们习惯将那些经常被修改的目录放在这个目录下。包括各种日志文件

 

### Linux的基本命令

 

Ctrl + c  停止当前进程

 

#### **目录切换命令**

cd切换目录

​		cd /usr  切换到usr目录

​		cd ..	  切换到上一层目录

​		cd ../..  跳到目前目录的上上两层

​		cd /	  切换到系统根目录

​		cd ~	  切换到用户主目录（root）

​		cd -	  切换到上一个所在目

 

#### **目录操作命令**

​	pwd	显示当前目录

 

​	ls	查看该目录下的所有的目录和文件

​	ls -a	查看该目录下的所有文件和目录，包括隐藏目录

​	ls -l	查看该目录下的所有目录和文件的详细信息（ls -l 可以缩写成ll）

ls -al	查看该目录下的所有目录（包括隐藏目录）和文件的详细信息

ls -l |grep xxx	 查看筛选后的目录和文件的详细信息

​	

#### **vi/vim编辑器**	

​	首先切换到桌面：[root@localhost ~]# cd /root/桌面

拷贝系统中的文件做练习：[root@localhost 桌面]# cp /etc/kdump.conf  a.conf

分别使用vi和vim测试，vim对文件中注释的内容会改变其颜色，退出改文件编辑输入 ：q  然后回车即可

[root@localhost 桌面]# vi a.conf

[root@localhost 桌面]# vim a.conf 

 

#### vim的三种模式

一般模式（默认模式） 编辑模式 命令模式

 

进入到文件中以后默认就是一般模式

 

:set nu  显示行号

:set nonu  隐藏行号	

dd  删除当前行

dnd  删除多少行（从尾部开始删）

u  撤销当前操作

yy  复制

p  粘贴

shift+g  光标移动至文件末尾

输入N，然后shift+g  光标移动到第N行

 

进入到文件中以后输入i/a/o进入编辑模式

i  光标前编辑

a  光标后编辑

o  光标移至下一行编辑

[Esc]  退出编辑模式



编辑完成之后，点击[Esc]，然后进入命令模式

:q!  强制退出（修改了内容，不保存）

:wq  保存并退出

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200704200251.png)

### 常用命令

 

* Ctrl+l  清屏

* ifconfig  查看ip地址

* tab 补全

* man  查看手册

* man ls  查看ls相关命令手册（按q退出当前手册）

* ls --help  查看ls相关命令手册

 

* date  日期

* cal  日历

 

* mkdir xxx  创建目录

* mkdir -p x/y/z  创建多级目录

 

* touch xxx 创建文件

* vim xxx  创建文件并编辑

* rmdir xxx  删除空目录
* rm xxx 删除子目录或文件
    * rm -r xxx 会询问，递归删除，可以删除子目录
    * rm -rvf xxx  不会询问，显示已删除信息
    * rm -rf xxx  不会询问，不显示已删除信息

 

* cp xxx（被复制文件） xxx（复制到某个位置）  拷贝文件

* cp -rv xxx xxx  连同子目录一起拷贝，并显示信息

 

* mv xxx（源文件名） xxx（新文件名）  重命名

* mv xxx  /目录名 移动xxx文件到某个位置

 

* cat xxx  查看文件，一般查看较小的文件

* more xxx  查看文件，一般查看较大的文件

* less xxx  和more类似，操作键不同

* tail xxx  从尾部开始查看
    * tail -N xxx  从尾部查看N行
    * `tail -f xxx`  跟随查看，一般用于查看日志

* history  查看历史命令

 

* find [搜索路径] [匹配条件] 查找文件或目录   
    如果没有指定搜索路径，默认从当前目录查找
    * -name 按名称查找，精准查找
    * -iname 按名称查找，忽略大小写
    * *：匹配所有
    * ？：匹配单个字符

比如`find /etc -name "init???"`在目录/etc中查找以init开头的，且后面有三位的文件

 

* `locate xxx`  和find类似，通过索引来查，速度更快，和updatedb一起用

* `updatedb`  创建索引，然后再使用locate xxx会显示该索引

 

* tar  -zcvf  xx.tar.gz  xxx.txt  压缩文件
    * -z  使用gzip压缩
    * -c  创建压缩文件
    * -x  解开压缩文件
    * -v  显示文件信息
    * -f  指定压缩后的文件名

* tar  -zxvf  xxx.tar.gz  解压缩

 

* `ps -aux`  查看系统中的进程信息
    * -a  显示所有进程信息
    * -u  以用户格式显示进程信息
    * -x  显示后台进程运行参数
    * ps -aux | grep xxx  筛选进程
    * `ps -ef | grep xxx` 以全格式显示当前所有进程



* kill pid  通过进程pid杀死当前进程

* kill -9 pid 强行杀死进程（常用）

 

例如：在vm上的虚拟机桌面上右键打开终端，然后在Xshell上找到 bash 对应的进程pid 

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200706193113.png)

使用 kill 3577 和 kill -9 3577 进行测试

 

* `systemctl  start  服务名（xxx.service）`  启动该服务

* `systemctl  restart  服务名（xxx.service） ` 重启该服务

* `systemctl  stop  服务名（xxx.service）`  停止该服务

* `systemctl  status  服务名（xxx.service） ` 查看该服务

例如： 

* `systemctl  status  firewalld.service`  查看防火墙

* `systemctl  stop  firewalld.service`  关闭防火墙

 

因为防火墙会随着虚拟机开机自动运行，避免麻烦，我们可以永久关闭防火墙

[root@localhost 桌面]# systemctl list-unit-files |grep firewalld 找到防火墙

[root@localhost 桌面]# systemctl disable firewalld.service 永久关闭防火墙

 

* `netstat -anp |grep 8080` 查看8080端口是否被占用

 

useradd  xxx（用户名）  新增用户

passwd  xxx（用户名）  设置该用户密码

su - xxx（用户名）  切换至该用户

whoami/who am i  查看当前用户

id xxx（用户名）  查看当前用户 

 

groupadd xxx（组名）  新增用户组

usermod -g xxx（组名） yyy（用户名）  修改用户的用户组

useradd -g xxx（组名） yyy（用户名）  新增用户时直接添加组 

 

vim /etc/passwd  可以查看系统中的所有用户

vim /etc/shadow  可以查看系统中的所有用户的密码

vim /etc/group  可以查看系统中的所有用户组

 

### 文件权限管理

执行ls -l（ll）

 

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200704200501.png)

 

第0位：文件类型（d 目录，- 普通文件，l 链接文件）

第1-3位：所属用户(所有者)权限，用u（user）表示

第4-6位：所属组权限，用g（group）表示

第7-9位：其他用户（其他人）权限，用o（other）表示

 

r：代表权限是可读，r也可以用数字4表示

w：代表权限是可写，w也可以用数字2表示

x：代表权限是可执行，x也可以用数字1表示

 

修改文件/目录的权限的命令：`chmod`

示例：

修改a.txt的权限为属主有全部权限，属主所在的组有读写权限，其他用户只有读的权限

chmod u=rwx,g=rw,o=r a.txt 或者 chmod 764 a.txt（常用）

 

注意：root用户是超级用户，不管有没有权限，root都能进行更改, 用普通用户测试权限

 

### RPM

（Red-Hat Package Manager）Red-Hat软件包管理

 

rpm –qa  查看已安装软件

`rpm –qa | grep xxx`  筛选查看已安装软件

rpm -e xxx  卸载已安装软件

rpm -ivh xxx  安装软件

​	-i  安装（install）

​	-v  查看信息

​	-h  查看进度条

 

例如：可以使用自带的火狐浏览器进行测试

[root@localhost 桌面]# rpm -qa|grep firefox

[root@localhost 桌面]# rpm -e firefox

再次查看

[root@localhost 桌面]# rpm -qa | grep firefox

[root@localhost 桌面]# cd /run/media/root

[root@localhost root]# cd *

[root@localhost CentOS 7 x86_64]# cd Packages

[root@localhost Packages]# ll|grep firefox

[root@localhost Packages]# rpm -ivh firefox-45.4.0-1.el7.centos.x86_64.rpm 

[root@localhost Packages]# rpm -qa|grep firefox

 

**YUM（yellowdog updater modified）软件包管理工具**

应用yum的好处:

1. 自动解决软件包依赖关系（类似MAVEN）
2. 方便的软件包升级

 

[root@localhost Packages]# `yum list | grep firefox`  自动联网查看firefox可用安装包

[root@localhost Packages]# `yum install firefox`  自动选择安装firefox  


