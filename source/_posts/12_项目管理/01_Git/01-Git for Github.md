---
title: 01-Git for Github
date: 2018-5-25 22:18:03
tags:
- Git
categories: 
- 12_项目管理
- 01_Git
---

![image-20200616223337238](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200616223339.png)

### 1. Git介绍

Git是一个开源的分布式版本控制系统，是 Linus Torvalds 为了帮助管理 Linux 内核开发而开发的一个开放源码的版本控制软件，Git可以使用本地创建仓库与网络仓库，解决了集中管理型版本控制软件存在的一些问题（CVS、VSS、SVN）。

### 2. Git安装

打开 [Git-2.9.2-64-bit.exe](https://gitforwindows.org/) 文件，一直下一步即可。

### 3. Git使用

安装完成后，在任意的文件目录下，右键都可以开打Git的命令行窗口。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image74.jpg)





Git是分布式版本控制系统，所以需要填写用户名和邮箱作为一个标识，--global 表示全局属性，所有的git项目都会共用属性。


配置用户名 

$ `git config --global user.name "yourName"`

配置邮箱

$ `git config --global user.email "yourEmail"`


![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image75.png)


此时在 `C:\Users\你的用户名\.gitconfig`文件可以查看到我们的配置信息。


### 4. 提交流程


提交时的存储顺序：`工作目录` --> `暂存区` -->  `本地仓库`

* **工作区(Working Directory)：**电脑上的本地硬盘目录，平时存放项目代码的地方。

* **暂存区(stage)：**用于临时存放你的改动，事实上它只是一个文件，保存即将提交到文件列表信息，一般存放在"git目录"下的index文件（.git/index）中，所以我们把暂存区有时也叫作索引（index）。

* **本地仓库(Repository)：**工作区有个隐藏目录.git，它就是Git的本地版本库。


git的工作流程：

１、在工作目录中添加、修改文件；

２、将需要进行版本管理的文件放入暂存区域；

３、将暂存区域的文件提交到git仓库。


使用步骤：（首先设置电脑可以查看隐藏文件）

1.在任意位置创建空文件夹，作为项目目录，例如：在G盘右键创建git_repository文件夹

2.在项目文件夹内右键打开git bash窗口，输入命令:  `git init`


![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image76.png)


此时git_repository目录下会生成一个隐藏的 .git 目录。


3.新建一个文件，例如：a.txt

4.输入命令：`git add` 文件名，此时是将文件添加到暂存区当中

5.输入命令：`git status`，查看暂存区状态

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image77.png)

6.如需删除，可以输入命令：`git rm --cached 文件名`，此时是从暂存区中删除了，工作目录中还会存在该文件，删除之后再次查看，该文件名颜色已经发生变化

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image78.png)

7.提交文件到本地库：`git commit –m "注释内容"`, 直接带注释提交

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image7c.png)

8.输入命令：`git log` 查看所有历史记录，输入命令：`git log 文件名`，查看该文件的历史记录

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image7d.png)

9.输入命令：`git log --pretty=oneline` 查看所有文件历史记录简易信息，输入命令：`git log --pretty=oneline 文件名` 查看该文件历史记录简易信息

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image7e.png)


10. 输入命令：`git reset --hard HEAD^` ，回退到上一次提交

输入命令：`git reset --hard HEAD~n`，回退n次操作

输入命令：`git reset 文件名`，撤销文件缓存区的状态

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image7f.png)

11.输入命令：`git reflog [文件名]`，查看历史记录的版本号

输入命令：`git reset --hard 版本号`

![](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image80.png)

12.手动删除工作目录中的文件，然后输入命令：`git checkout 文件名`，可以恢复工作目录中已经删除的文件

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image81.png)

13.手动删除工作目录中的文件，然后输入命令：`git add 文件名` （此时该命令表示提交当前删除文件的操作）

或者：`git rm 文件名`

然后输入命令：`git commit -m "删除文件"` （此时才是真正删除了该文件，但是此次删除只是这一次操作的版本号没有了，其他的都可以恢复）

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image4.png)




恢复文件某个版本

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image1.png)


### 5. 分支相关操作

#### 5.1 创建分支

创建分支：`git branch <分支名>`

查看分支：`git branch –v`

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image84.png)



#### 5.2 切换分支

切换分支：`git checkout <分支名>`

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image85.png)

切换到分支后，在分支下的操作，master（主线）不会有任何变化

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image86.png)



此时在工作目录中可以查看到c.txt文件，但是当切换到master时，再去查看工作目录已经没有c.txt文件了

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image6.png)



创建并切换：`git checkout –b <分支名>`

将创建分支并切换分支一起完成

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image88.png)

#### 5.3 合并分支

切换分支：`git checkout master`

合并分支：`git merge <分支名>`

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image89.png)




此时在工作目录中又可以查看到 c.txt 文件了

> 冲突问题：
>
> 当主线和分支合并之后，分支和主线都会有相同的文件，此时在主线中修改该文件内容并提交，在分支中也修改该文件内容并提交，再次合并时就会出现冲突，此时文件中会显示冲突内容，我们需要手动解决再合并了。


### 6. GitHub

GitHub是一个基于Git的面向`开源`及`私有软件`项目的托管平台。

官网：https://github.com/

登录官网 --> 注册 --> 邮箱确认 --> 创建仓库

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image8a.jpg)




把本地仓库项目上传到GitHub上步骤：

#### 6.1 增加远程地址

`git remote add <远端代号> <远端地址>`

<远端代号> 是指远程链接的代号，一般直接用origin作代号，也可以自定义。

<远端地址> 默认远程链接的url

例：`git remote add origin https://github.com/xxxxxx.git`

#### 6.2 推送到远程库

`git push <远端代号> <本地分支名称>`

<远端代号> 是指远程链接的代号。

<分支名称>  是指要提交的分支名字，比如master。

例：`git push origin master`

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image8b.png)




提交完成之后，刷新浏览器，会显示工作目录提交的数据

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image8c.png)




#### 6.3 克隆1个项目

`git clone <远端地址> <新项目目录名>`

<远端地址> 是指远程链接的地址。

<项目目录名>  是指为克隆的项目在本地新建的目录名称，可以不填，默认是 GitHub 的项目名。

命令执行完后，会自动为这个远端地址建一个名为 origin 的代号。

例：`git clone https://github.com/xxxxxxx.git 文件夹名`

> 注意：在磁盘下创建任意目录，然后右键打开git bash，再输入克隆命令。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image8d.png)




> 注意：
>
> 如果是其他用户克隆项目之后，对项目进行了修改，然后想要推送到GitHub上时，需要当前用户授权才行！
>
> （例如：yangl2819想要对yangl7299的GitHub上的项目进行修改，需要yangl7299授权才行）

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image8e.jpg)


![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image92.png)

当前用户邀请其他用户成为伙伴时，需要其他伙伴同意，此时会发送一封邮件，需要其他用户登录网站进行同意，登录之后，拷贝邀请链接，用浏览器打开，同意该邀请。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image8f.png)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image90.png)


成为合作伙伴之后就可以更新仓库中的项目文件了

git config 用于配置当前提交文件的用户信息，可以配置用户名以及邮箱

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image91.png)


合作伙伴修改完文件之后，推送到GitHub中的仓库中，此时仓库中的文件内容已经发生变化，当前用户如果需要和GitHub中的已经更新的文件内容保持一致，则需要更新项目

#### 6.4 从GitHub更新项目

`git pull <远端代号> <远端分支名>`

<远端代号> 是指远程链接的代号。

<远端分支名>是指远端的分支名称，如master。 

例：`git pull origin master`



打开当前用户的 git bash 窗口，进行更新：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image7.png)



另一种情况：A，B都是该公司员工，可以共享同一个GitHub仓库，B无法解决项目中的问题，找C帮忙，C不是该公司员工，则只能查看该仓库，不能向仓库提交代码，如何来解决？

1. 再创建一个新用户，然后登录，拷贝仓库地址（https://github.com/xxxxxxx.git），在浏览器执行，然后点击 **`Fork`** ，表示`拷贝之前的仓库到该用户`下

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image8.png)



拷贝成功后如下：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image94.png)



此时，相当于在GitHub中有了两个相同的仓库，`一个为 master，一个为 Fork`，然后在磁盘再创建一个目录，在目录下右键git bash 打开新窗口，进行如下操作：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image95.png)





此时C把A仓库克隆下来之后进行了修改，然后又提交到了C自己的仓库，但实际运行的是A仓库中的代码，所以C需要向A发送请求，A需要同意请求，然后合并即可。

C**发送请求**：（首先刷新C当前浏览器页面，点击**`New pull requst`**）

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image96.png)



**确认发送请求**

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image9.png)



**再次确认发送请求**

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image98.png)

此时请求已经发送，A登录后查看请求，若已登录可直接刷新当前浏览器页面

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image99.png)


![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image97.png)

**点击查看请求后，同意合并请求**

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image9a.png)

**再次确认合并**


![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image9b.png)

**查看状态**

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image9c.png)



### 7. IDEA中使用Git

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image9d.png)


![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image9e.png)



#### 7.1 本地推送到GitHub

第一种情况：如果需要在GitHub创建新的仓库，进行如下操作

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image9f.png)



第二种情况：GitHub上已经有仓库了，只是把代码推到库上，进行如下操作

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/imagea0.png)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/imagea1.png)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/imagea2.png)



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/imagea3.png)





![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/imagea4.png)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/imagea5.png)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/imagea6.png)



#### 7.2 从GitHub上下载项目

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/imagea7.png)




![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/imagea8.png)

#### 7.3 从GitHub上更新项目

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/imagea9.png)



#### 7.4 Git分支操作

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/imageaa.png)




创建分支，切换分支，切换主线


![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/imageab.png)


测试时，先切换到分支，然后添加代码，提交，然后再切换到主线，分支下添加的代码就不显示了

**合并分支**


![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/imageac.png)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/imagead.png)



#### 7.5 .gitignore文件

![image-20200616224229306](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200616224230.png)



#### 7.6 IDEA中Git日常更新

第一次提交时创建仓库：

![image-20200629085125936](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200629085130.png)

日常修改代码进行更新推库（三步走）：

① Git > `Add`    ② Git > `Commit Directory...`    ③ Git > Respository > Push...(`Ctrl+Shift+K`)

> 注意事项：
>
> * 注意清理 out 或 target 等编译生成的 .class 文件和其他文件。



#### 7.7 解决IDEA中git太慢的问题

解决idea提交git代码过慢的问题，修改这两个文件名，让idea找不到这两个文件就可以了。

![image-20210228120333266](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210228120335.png)



### 8. 解决切换账号无法提交

在使用https协议做push时，如果曾经使用过一个账号，但密码有过改动，此时会报错。即 `github push failed` 错误（`remote: Permission to userA/repo.git denied to userB`）

```shell
remote: Permission to userA/repo.git denied to userB.
fatal: unable to access 'https://github.com/userA/repo.git/': The requested URL returned error: 403
```

很明显，根据提示，**userB**没有权限对**userA**的repo进行push更改。

>问题原因：
>
>由于该电脑使用 git bash 配置使用过userB，系统已经将指向github的用户设置为了userB，每次push操作的时候，都将读取到userB的用户信息，类似于**记住密码**。因为git默认读取的是上一次记住密码的账号，而不是我自己个人的git账户。

**Windows解决办法**：

- 打开 **控制面板**–>**用户账户**–>**凭据管理器**–>**管理Windows凭据**

![image-20200616223846172](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200616223848.png)

找到github的凭据，进行删除。

重新push，会重新提示输入账号、密码即可成功提交(该凭据也会被更新)。