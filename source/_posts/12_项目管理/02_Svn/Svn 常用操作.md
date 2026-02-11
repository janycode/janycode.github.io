---
title: Svn 常用操作
date: 2018-5-25 22:18:03
tags:
- Svn
categories: 
- 12_项目管理
- 02_Svn
---

![svn](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200711092153.jpg)




### 1. SVN in IDEA

#### 1.1 往SVN推项目

> * `仓库名与项目名必须保持一致`，否则会导致 pom.xml 中无法找到父目录而报错！
> * `删除 .idea 目录`，为了不影响 maven 仓库的路径设置。

![image-20200819133339197](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200819133340.png)

![image-20200819133325245](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200819133326.png)



#### 1.2 IDEA日常推拉

* 设置

![image-20200818135759375](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200818135800.png)

* 通过 SVN 版本库中的项目代码 → 创建项目

![image-20200818133915712](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200818133916.png)

![image-20200818135147660](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200818135148.png)

![image-20200818134115659](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200818134116.png)

* IDEA设置SVN自动忽略的文件

![image-20200820201056298](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200820201057.png)






### 2. SVN 常用命令

1. 从代码库中拉下代码，即 checkout
    将代码checkout到当前目录：`svn co url`
    将代码checkout到指定目录：`svn co url directory`
2. 把新建的文件提交的svn代码库，这需要两个步骤
    首先把文加加入svn管理：`svn add filename`
    其次提交文件: `svn ci filename`
3. 把修改后的文件提交道svn代码库
    `svn ci filename -m "comments"`
4. 更新代码到最新的版本：
    `svn up`
5. 解决冲突
    如果更新的代码有冲突，
    首先手动解决冲突：即编辑冲突文件为正常文件，然后使用：`svn resolved filename`
6. 代码库合并
    两个代码库 address1 和 address2
    把address1合并到address2中：
    先把address2代码checkout到本地：`svn co address2`
    然后进入address2的目录中执行：`svn merge address1`
    合并后可能需要解决冲突，然后提交代码到 address2



### 3. SVN 常见问题

**1. svn报错 refers to a file, not a directory**svn co http://server.com/svn/trunk/test.file test.filesvn: URL 'http://server.com/svn/trunk/test.file test.file' refers to a file, not a directory

**问题根本原因**： 

svn co 即svn checkout 下拉一份代码副本到本地，但是checkout仅支持目录，如果checkout单个文件的话会报此错误。

**解决方法**：

A. 下拉代码副本的时候，将目录下载下来，此操作并不会覆盖掉target_directory/目录下的原有文件；

```sh
svn co .../directory/ target_directory/ --username XXX --password XXX
```

B. 强制出文件，此操作仅为单向下拉文件，不能上传到svn库，根据需求来决定使用哪种方式；

```sh
svn export --force .../directory/svn_filename target_directory --useranme XXX --password XXX
```



**2. svn报错 commit fail： \**File out of date**svn: Commit failed (details follow):svn: Item '/banksystem/Mmoney/trunk/src/tpme/MEBS/timebargain/tradeweb/dao' is out of date
**问题根本原因**：  

svn需要在其下拉的工作目录下操作才可以，一般脚本使用到svn时没有留意到当前脚本的执行环境是当前目录，还是svn对应的工作目录。

**解决方法**：

A. 比如判断文件存在就up更新，不存在时就co一份副本下来，up前一定要进入该目录，否则后面的up和ci提交都会出错；  

```sh
if [ -e svn_filename ]; then
	cd target_directory/     # 注意点，svn需要在其下拉的目录中操作才可以
	svn up
else
	svn co .../directory/ target_directory --username XXX --password XXX
fi
```

### 4. SVN Server @Aliyun
 阿里云服务器 CentOS 安装 SVN 服务器【汇总】：

 ```sh
 #安装SVN
 yum -y install subversion
 #确认安装成功
 svn --version
 #创建仓库目录，如 找房宝 zhaofangbao
 mkdir -p /data/svn/repositories/zhaofangbao
 #创建SVN版本库
 svnadmin create /data/svn/repositories/zhaofangbao/
 #确认仓库相关配置文件被生成 [conf  db  format  hooks  locks  README.txt]
 ls /data/svn/repositories/zhaofangbao/
 #创建用户，在 passwd 中添加用户，格式为：用户名 = 密码
 cd /data/svn/repositories/zhaofangbao/
 vi conf/passwd
 #设置权限
 vi conf/authz
 #在文件最下方添加，格式如下：（zhaofangbao 为刚才创建的仓库名，rw为可读可写）
 [zhaofangbao:/]
 用户名 = rw
 # 启用账户和权限相关配置：（放出一下注释代码，更改该文件的配置不需要重启 svnserve）
 vi conf/svnserve.conf
 anon-access = none #开启日志可读权限
 auth-access = write #授权用户可写权限
 password-db = passwd #使用哪个文件作为账号文件
 authz-db = authz #使用哪个文件作为权限文件
 realm =  /data/svn/repositories/zhaofangbao #认证空间名，版本库所在目录
 #【注意】以上所有修改文件的操作，在每行的开头和结尾都不能留空格，不然会报错
 
 #启动SVN：（svnserve 命令，末尾没有r）
 svnserve -d -r /data/svn/repositories
 #检查是否启动成功
 ps -ef | grep svnserve
 
 #【阿里云】
 安全组配置打开 3690 端口。
 
 #【客户端工具】安装在英文路径，且打开command line client tools（见下方截图）
 TortoiseSVN-1.14.0.28885-x64-svn-1.14.0.msi
 #下载地址：https://tortoisesvn.net/downloads.html
 #安装好后，在本地使用方式同 Git，都在右键里
 
 #【基操】使用右键
 SVN Checkout #仅第一次克隆项目使用，仅需填入1次用户名和密码即可
 SVN Update #① 先更新，down下来最新的代码
 TortoiseSVN  >>  +Add  >>  OK  #② 选中要上传的文件，确认即可
 SVN Commit... #③ 提交到远程仓库，comment格式"[init]jiangyuan:初次尝试svn服务器搭建，测试文件提交"
 
 #So Easy！
 ```

【安装注意事项】`一定一定一定要勾选，否则IDEA无法关联使用SVN！`

![image-20200818134345888](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200818134347.png)




