---
title: 03-Linux自用配置(vim)
date: 2017-4-28 21:42:42
tags:
- Linux
- vim
- 配置
- 命令
categories: 
- 01_操作系统
- 04_Linux
---

 

### 命令行提示符

命令行输入：`vi ~/.bashrc`

进入修改环境个性化设置文件bashrc

shift + G 文件末尾加入(常用)：`export PS1='[\u@\h \w]\$ '`

如现在在用的（提示符变黄）：

**export PS1='\e[33;1m[\w]\e[0m\$: '**

小写w代表完整路径显示，大写W代表只显示当前路径。

```properties
# some more ls aliases
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias LS='ls && ls | sed 's:^:`pwd`/:''
alias sl='ls && ls | sed 's:^:`pwd`/:''
alias vi='vim'
```

命令行输入：`source ~/.bashrc`

执行刚修改的初始化文件，使之立即生效。



### vim 基本配置

$: `vi ~/.vimrc` （Ubuntu）

$: `vi /etc/vimrc` （CentOS）

shift + G 文件末尾加入以下内容

```properties
set nu "显示行号"
set ts=4  "table 替换 space 4个"
set autoindent  "自动缩进"
set cindent
set tabstop=4
set softtabstop=4
set shiftwidth=4
```

$: `bash`

立即生效。