---
title: 01-shell脚本基础语法
date: 2017-4-28 22:21:04
index_img: https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241024151751.png
tags:
- shell
- 语法
categories: 
- 02_编程语言
- 03_Shell
---



### 脚本基础

shell脚本文件后缀名：.sh

建立脚本顶行：#! /bin/sh
// 指明使用哪种shell来解释缩写的脚本

shell脚本是以文本方式存储的，而非二进制文件，所以shell脚本必须在Linux系统的shell下解释执行，需要修改其执行权限：
\#:' chmod +x filename.sh

不设置权限指定shell脚本：
\#:' sh filename.sh
\#:' source filename.sh

### 变量说明
shell系统变量：
'$#' // 保存程序命令行的数目
'$0' // 当前程序名
'$*' // 以("$1 $2...")的形式保存所有输入的命令行参数
'$@' // 以("$1" "$2"...)的形式保存所有输入的命令行参数
'$n' // $1 为命令行的第一个参数，$2为命令行的第二个参数，依次类推

shell环境变量：
PATH // 决定shell将到哪些目录中寻找命令或程序
HOME // 当前用户主目录的完全路径名
HISTSIZE // 历史命令记录数
LOGNAME // 当前用户的登录名
HOSTNAME // 主机的名称
SHELL // shell路径名
LANGUGE // 语言相关的环境变量，多语言可以修改此环境变量
MAIL // 当前用户的邮件存放目录
PWD // 当前工作目录的绝对路径名

环境变量命令：
echo $HOME // 显示变量
export WELCOME="HE" // 设置变量
env // 查看所有变量
set // 查看本地变量
unset // 删除变量
env | grep WELCOME // 查询变量

shell用户变量：
linux下支持用户自定义变量，使用' = '进行赋值，即  **变量名=变量值**

```bash
/* 代码演示 */
#! /bin/sh

VAR="hello"

echo $VAR   // hello【正确引用变量值】
echo "VAR"  // hello【正确引用变量值】
echo VAR    // VAR
echo 'VAR'  // $VAR
echo \$VAR  // $VAR
```

### 变量扩展
变量扩展符号：'$'
```bash
例如：
echo hey$VAR   // heyhello
echo hey$VAR123   // hey【错误，无法正确使用变量扩展】
修改：
echo hey${VAR}123 // heyhello123 【正确实现变量扩展】
```

{} 表示清晰的告诉bash引用的是哪一个变量。

【字符串截断】
左截断 '#'(3)
例如：
```bash
$ MYVAR=foodforthought.jpg
$ echo ${MYVAR##*fo}
rthought.jpg // 双#加上*fo是从左侧截断到最后一个fo最长的子字符串，输出剩余字符
$ echo ${MYVAR#*fo}
odforthought.jpg // 单#加上*fo是从左侧截断到最短的一个fo的子字符串，输出剩余字符
```

变量扩展 '$'(4)

右截断 '%'(5)
例如：
```bash
$ MYFOO="chickensoup.tar.gz"
$ echo ${MYFOO%%.*}
chickensoup // 双%加上.*是从右侧截断到最长的子字符串，输出剩余字符
$ echo ${MYFOO%.*}
chickensoup.tar // 单%加上.*是从右侧截断到最短的子字符串，输出剩余字符
```

### 流程控制
主要有两种不同形式的条件语句： if 和 case

shell中的 **if** 格式：

if [ expression ]  # expression 两侧一定保证各有一个空格，否则无法找到命令
then
  commands1  # expression为true时的动作
else
  commands2  # expression为false时的动作
fi

<文件比较运算符>
```bash
-e filename  // 如果filename存在，则为真 [ -e /var/log/syslog ]
-d filename  // 如果filename为目录，则为真 [ -d /tmp/mydir ]
-f filename  // 如果filename为常规文件，则为真 [ -f /usr/bin/grep ]
-L filename  // 如果filename为符号链接，则为真 [ -L /usr/bin/grep ]
-w filename  // 如果filename可写，则为真 [ -w /var/mytmp.txt ]
-x filename  // 如果filename可执行，则为真 [ -x /usr/bin/grep ]
filename1 -nt filename2  // 如果filename1比filename2新，则为真 [ /tmp/server -nt /etc/server ]
filename1 -ot filename2  // 如果filename1比filename2旧，则为真 [ /tmp/server -ot /etc/server ]
```


<字符串比较运算符> '注意引号的使用，防止空格扰乱代码的好方法'
```bash
-z string  // 如果string长度为0，则为真 [ -z "$myvar" ]
-n string  // 如果string长度非0，则为真 [ -n "$myvar" ]
string1 = string2  // 如果string1与string2相同，则为真 [ "$myvar" = "one two three" ]
string1 != string2  // 如果string1与string2不同，则为真 [ "$myvar" != "one two three" ]
```


<算术比较运算符>
```bash
num1 -eq num2  // 等于 [ 3 -eq $mynum]
num1 -ne num2  // 不等于 [ 3 -ne $mynum]
num1 -lt num2  // 小于 [ 3 -lt $mynum]
num1 -le num2  // 小于或等于 [ 3 -le $mynum]
num1 -gt num2  // 大于 [ 3 -gt $mynum]
num1 -ge num2  // 大于或等于 [ 3 -ge $mynum]
```

```bash
/* 代码演示 */
#! /bin/sh
MYVAR=3

if [ -e ./test.sh ]
then
    echo "ok"
else
    echo "err"
fi

if [ $MYVAR -eq 3 ]
then
    echo "eq 3"
fi

if [ $MYVAR = "3" ]
then
    echo "=3"
fi
```

shell中的 **case** 格式：

case 字符串 in
模式1) command;;
模式2) command;;
...
*) command;;
esac

如果每个都匹配不到，则会在最后放置一个*，相当于c语言中的default

```bash
/* 代码演示 */
Test=test.tar.gz
case "${Test##*.}" in
gz)
    tar -xzvf $Text ;;
bz2)
    tar -xjvf $Text ;;
*)
    exho "format error..." ;;
esac
```

### 循环语句
shell中的 **while** 语句格式：

while [ expression ]
do
  command
  ...
done

```bash
/* 代码演示 */
#! /bin/sh
MYNUM=0

while [ $MYNUM -ne 10]
do
    echo $MYNUM
    MYNUM=$(($MYNUM + 1))   # 注意小括号
done
```

shell中的 **for** 语句格式：

for 变量名 [in 列表]
do
  command1
  command2
  ...
done

```bash
/* 代码演示 */
for x in one two three four   # 变量循环4次
do
    echo number $x
done

for MYFILE in /etc/r*
do
if [ -d "$MYFILE" ]
then
    echo "$MYFILE (dir)"
else
    echo "$MYFILE"
fi
done
```

\>> 实验1：自动备份源代码

```bash
/* 代码演示 */
#!/bin/sh

# BAKDIR可以换一个你喜欢的
BAK_DIR=/backup

# *为未知,自己查一下怎么取星期啦, 要0-6那个
DATE=$(date +%*)

# 自己查一下怎么周数啦
WEEK=$(date +%*)

# 备份文件名
FULL_BAK=full_back.$WEEK.tar.bz2
INCRE_BAK=increment_back.$WEEK.$DATE.tar.bz2

# 其实没什么不同的,只是要改文件名而已
if [ $DATE -eq 0]; then
    tar -g $BAK_DIR/sn.$WEEK cjf $BAK_DIR/$FULL_BAK
else
    tar -g $BAK_DIR/sn.$WEEK cjf $BAK_DIR/$INCRE_BAK
fi
exit $?
# 把任务加到crontab里就行了,每天执行一次

'--------------------------------------------------------------------------------------------------'

#!/bin/sh

BAK_DIR=/backup

# 还原目录
RECOVER_DIR=/

FULL_BAK=full_back.$WEEK.tar.bz2
INCRE_BAK=increment_back.$WEEK.$DATE.tar.bz2

echo -n "recover from week: "
read WEEK

if [ -e $BAKDIR/$FULL_BAK ]
then
    tar xjf $BAK_DIR/$FULL_BAK -C $RECOVER_DIR
    for N in $(seq 6)
    do
    if [ -e $BAK_DIR/$INCRE_BAK ]
    then
        tar xjf $BAK_DIR/$INCRE_BAK -C $RECOVER_DIR
    fi
    done
else
    echo "Backup file not exist!! exit now~~"
fi
exit $?
# 这个是手动执行的,要自己输入想还原到的周数年
# 补充:使用的时候还是要自己调试一下。
```

\>> 实验2：自动解包分类并统计文件

```bash
/* 代码演示 */
clear
echo "================================="
echo "       my test shell programe    "
echo "================================="

testfile="test.tar.gz"

cdir="c_files"
hdir="h_files"
csum=0
hsum=0

fileinfo() {
echo " "
echo "============file count=========" > fileinfo.txt
date >> fileinfo.txt
echo "====c file info====" >> fileinfo.txt
ls $cdir/* >> fileinfo.txt        # */
echo "----c files count:${csum}" >> fileinfo.txt
echo "====h file info====" >> fileinfo.txt
ls $hdir/* >> fileinfo.txt        # */
echo "----h files count:${hsum}" >> fileinfo.txt
cat fileinfo.txt
echo " "
}

if [ -e "$testfile" ]
then
	if [ -e test ]
        then
            echo "rm test dir"
            rm -rf test
	fi
	tar -xzf $testfile

	if [ -e "$cdir" ]
        then
            echo "rm $cdir dir"
            rm -rf "$cdir"
	fi
	mkdir "$cdir"

	if [ -e "$hdir" ]
        then
            echo "rm $hdir dir"
            rm -rf "$hdir"
	fi
	mkdir "$hdir"

	if [ -e test ]
	then
        for xfile in test/*        # */
        do
            case "${xfile##*.}" in
            c)
                cp $xfile $cdir
                csum=$(($csum+1))
                ;;
            h)
                cp $xfile $hdir
                hsum=$(($hsum+1))
                ;;
            *)	    ;;
        esac
        done
        fileinfo
        else
	    echo "test dir error"
        fi
else
	echo "$testfile no found"
fi

echo "================================="
echo "      test  finsh	               "
echo "================================="
```



### 后台运行且不输出日志

```bash
脚本路径/脚本名 >/dev/null 2>&1
```

或

```bash
nohup 脚本名 &
```



### 查找指定文件并转移位置

如创建MP4文件夹，查找当前目录(递归子目录)下的.mp4文件，并拷贝到创建的MP4文件夹：

```bash
mkdir ./MP4/ && find . -name "*.mp4" |xargs -i cp {} ./MP4/
```



### 脚本：Hexo循环部署

```bash
#! /bin/bash
#Author: Jerry(姜源)

#生成一次最新需要部署的页面
echo "生成一次最新需要部署的页面..."
hexo g
echo "生成完毕！"
echo

MYNUM=1
while [ $MYNUM -ne 0 ]
do
    echo "尝试第 $MYNUM 次部署，正在部署(请勿退出程序)..."
	RESULT=`hexo d`
	echo
	echo "[JERRY]RESULT="$RESULT
	FLAG=`echo $RESULT | grep "done"`
	#判断执行结果中是否包含执行成功的字符串
	if [[ "$FLAG" != "" ]]
	then
		break
	else
		echo "结果：第 $MYNUM 次部署失败！"
		MYNUM=$(($MYNUM + 1))
		echo
	fi
done

echo
echo "部署成功！！！"
echo
#echo "开始更新 local-search.xml 到阿里云OSS..."
#echo
#./oss.sh ./public/local-search.xml local-search.xml
#echo
#echo "更新成功！！！"
```



### 脚本：一键发布两个博客

> 背景1：访问慢，github 有时访问时快时慢，同时发了 gitee (使用 gitee pages + docsify 搭建)
>
> 背景2：搜索慢，使用 Hexo + Fluid 搭建的博客，搜索功能依赖一个很大的 local-search.xml，太慢
>
> 背景3：导航慢，左侧快速导航 + 全文搜索 + 国内访问速度，这三条让人欲罢不能

目录结构：

```bash
E:
├── janycode.blog
│   ├── markdown
│   │   ├── 00_先利其器
│   │   ├── 01_...
│   ├── gen2blogs.sh
├── janycode.gitee.io
│   ├── .git
│   ├── docs
│   │   ├── 00_先利其器
│   │   ├── 01_...
│   ├── ...
├── janycode.github.io
│   ├── .git
│   ├── source
│   │   ├── _posts
│   │   │   ├── 00_先利其器
│   │   │   ├── 01_...
│   ├── deploy.sh
│   ├── ...
└── ...
```

`gen2blogs.sh`

```bash
#! /bin/bash
#Author: Jerry(姜源)

SOURCE_MARKDOWN_PATH=./markdown
GITHUB_BLOG_PATH=../janycode.github.io/source/_posts
GITEE_BLOG_PATH=../janycode.gitee.io/docs
CURRENT_DIR=`pwd`
echo "当前执行脚本目录："$CURRENT_DIR

GITHUB_BLOG_PATH_ALL=$GITHUB_BLOG_PATH/*_*
GITEE_BLOG_PATH_ALL=$GITEE_BLOG_PATH/*_*

function dealGithub() {
	echo ">>> 开始处理github.io:"
	for dir in $GITHUB_BLOG_PATH_ALL
	do
		echo "The dir is: $dir"
		currDirName=`basename $dir`
		echo currDirName=$currDirName
		toDelDir=$GITHUB_BLOG_PATH/$currDirName
		#如果目录存在则清理，不存在无需处理
		if [ -d $toDelDir ]; then
			echo "待清理的目录: toDelDir="$toDelDir
			rm -rf $toDelDir
			echo $toDelDir" 目录清理成功！"
		else
			echo $toDelDir" 目录已清理！"
		fi
	done
	
	#Github：
	#拷贝目录文件到目录 - 递归拷贝
	cp $SOURCE_MARKDOWN_PATH/* $GITHUB_BLOG_PATH -r
	echo "目录拷贝成功！"
	ls -l $GITHUB_BLOG_PATH
	#cd 进入目录
	cd $GITHUB_BLOG_PATH
	pwd
	GITHUB_PATH=`dirname $(dirname $GITHUB_BLOG_PATH)`
	echo "进入目录："$GITHUB_PATH
	cd ../../
	echo "当前目录："
	pwd
	echo "github: 开始>>>"
	./deploy.sh
	echo "github 部署成功！！！"
	#gitee 提交和推送代码
	pushGitee
	cd $CURRENT_DIR
	echo "cd "$CURRENT_DIR
}


function dealGitee() {
	echo ">>> 开始处理gitee.io:"
	for dir in $GITEE_BLOG_PATH_ALL
	do
		echo "The dir is: $dir"
		currDirName=`basename $dir`
		echo currDirName=$currDirName
		#跳过以_开头的文件或目录
		if [[ "$currDirName" =~ ^_.* ]]; then
			continue
		else
			toDelDir=$GITEE_BLOG_PATH/$currDirName
			#如果目录存在则清理，不存在无需处理
			if [ -d $toDelDir ]; then
				echo "待清理的目录: toDelDir="$toDelDir
				rm -rf $toDelDir
				echo $toDelDir" 目录清理成功！"
			else
				echo $toDelDir" 目录已清理！"
			fi
		fi
	done

	#Gitee：
	#拷贝目录文件到目录 - 递归拷贝
	cp $SOURCE_MARKDOWN_PATH/* $GITEE_BLOG_PATH -r
	echo "目录拷贝成功！"
	ls -l $GITEE_BLOG_PATH
	#cd 进入目录
	cd $GITEE_BLOG_PATH
	pwd
	echo "进入目录："$GITEE_BLOG_PATH
	#js 生成目录.md
	echo "生成页面侧边目录开始 >>>"
	node gensidebar.js
	echo "生成页面侧边目录成功！！！"
	cd ..
	echo "回到上一级目录："
	pwd
	#gitee 提交和推送代码
	pushGitee
	echo -e "\033[35mgitee 部署还需手动更新pages: https://gitee.com/janycode/janycode/pages\033[0m"
	cd $CURRENT_DIR
	echo "cd "$CURRENT_DIR
}

function pushGitee() {
	echo "git: 检查变动的文件1 git status ."
	git status .
	echo "git: 加入本地缓存 git add ."
	git add .
	echo "git: 检查变动的文件2 git status ."
	git status .
	echo "git: 提交并添加备注 git commit -m ..."
	todayTime=`date -d "now" +"%Y年%m月%d日%H:%M:%S"`
	git commit -m "更新博客，时间: "$todayTime
	echo "git: 推送到远程仓库 git push"
	git push
	echo "gitee 推送成功！！！"

}

dealGithub

dealGitee

echo -e "\033[32mAll Work Finished！！！\033[0m"
echo ""
```

### 脚本：监控程序并自动拉起

比如手机上跑 alist 服务时，程序会被莫名 kill 掉，所以需要监控并拉起，间隔为 60s：

```bash
#!/bin/bash

now=`date '+%Y-%m-%d %H:%M:%S'`
grepFlag='alist'
thisLog='./alistlog'
sleepTime=60s

while [ 0 -lt 1 ]
do
    now=`date '+%Y-%m-%d %H:%M:%S'`
    ret=`ps aux | grep "$grepFlag" | grep -v grep | wc -l`
    if [ $ret -eq 0 ]; then
	echo "$now $grepFlag not exists, restart now..." >> "$thisLog"
	alist server 2>&1 &
	echo "$now restart done..." >> "$thisLog"
    else
	echo "$now $grepFlag exists, sleep $sleepTime." >> "$thisLog"
    fi
    sleep $sleepTime
done
```

