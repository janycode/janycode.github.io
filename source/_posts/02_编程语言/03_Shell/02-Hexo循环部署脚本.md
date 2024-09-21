---
title: 02-Hexo循环部署脚本
date: 2024-3-21 22:48:42
tags:
- shell
- 语法
categories: 
- 02_编程语言
- 03_Shell
---

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
>
> `奇技淫巧`：stream加速工具 [Watt Toolkit](https://steampp.net/) 默认可以加速github，奇怪的用法又增加了~

目录结构：

```bash
E:
├── janycode.blog
│   ├── markdown
│   │   ├── 00_先利其器
│   │   ├── 01_...
│   ├── gen2blogs.sh
├── janycode.gitee.io（弃用，替换为github部署了，目录为下方janycode.yuancodes.github.io）
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
├── janycode.yuancodes.github.io
│   ├── .git
│   ├── docs
│   │   ├── 00_先利其器
│   │   ├── 01_...
│   ├── ...
└── ...
```

`gen2blogs.sh`

```bash
#! /bin/bash
#Author: Jerry(姜源)

SOURCE_MARKDOWN_PATH=./markdown
GITHUB_BLOG_PATH=../janycode.github.io/source/_posts
GITHUB_BLOG_PATH_2=../janycode.yuancodes.github.io/docs
GITEE_BLOG_PATH=../janycode.gitee.io/docs
CURRENT_DIR=`pwd`
echo "当前执行脚本目录："$CURRENT_DIR

GITHUB_BLOG_PATH_ALL=$GITHUB_BLOG_PATH/*_*
GITHUB_BLOG_PATH_ALL_2=$GITHUB_BLOG_PATH_2/*_*
GITEE_BLOG_PATH_ALL=$GITEE_BLOG_PATH/*_*

function dealGithub() {
	echo ">>> 开始处理janycode.github.io:"
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
	echo "github hexo 部署成功！！！"
	#git 提交和推送代码
	pushGit
	cd $CURRENT_DIR
	echo "cd "$CURRENT_DIR
}

function dealGithub2() {
	echo ">>> 开始处理yuancodes.github.io:"

	for dir in $GITHUB_BLOG_PATH_ALL_2
	do
		echo "The dir is: $dir"
		currDirName=`basename $dir`
		echo currDirName=$currDirName
		#跳过以_开头的文件或目录
		if [[ "$currDirName" =~ ^_.* ]]; then
			continue
		else
			toDelDir=$GITHUB_BLOG_PATH_2/$currDirName
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

	#Github2:
	#拷贝目录文件到目录 - 递归拷贝
	cp $SOURCE_MARKDOWN_PATH/* $GITHUB_BLOG_PATH_2 -r
	echo "目录拷贝成功！"
	ls -l $GITHUB_BLOG_PATH_2
	#cd 进入目录
	cd $GITHUB_BLOG_PATH_2
	pwd
	echo "进入目录："$GITHUB_BLOG_PATH_2
	#js 生成目录.md
	echo "生成页面侧边目录开始 >>>"
	node gensidebar.js
	echo "生成页面侧边目录成功！！！"
	cd ..
	echo "回到上一级目录："
	pwd
	
	echo "github: 开始>>>"
	#github 提交和推送代码
	pushGit
	cd $CURRENT_DIR
	echo "cd "$CURRENT_DIR

	echo "github2 docs 部署成功！！！"
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
	pushGit
	echo -e "\033[35mgitee 部署还需手动更新pages: https://gitee.com/janycode/janycode/pages\033[0m"
	cd $CURRENT_DIR
	echo "cd "$CURRENT_DIR
}

function pushGit() {
    echo "git: 先拉取代码同步仓库1 git pull"
	git pull
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
	echo "git 推送成功！！！"

}

#hexo
dealGithub

#docsify
dealGithub2

#2024年gitee的pages功能禁用了，解禁时间未知。
#dealGitee

echo -e "\033[32mAll Work Finished！！！\033[0m"
echo ""
```

