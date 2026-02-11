---
title: Jmeter 基本使用
date: 2020-10-8 22:15:39
tags:
- Jmeter
- 压测
categories: 
- 09_调试测试
- 03_压力测试
---



参考资料：http://www.jmeter.com.cn/category/jmeter-book

### 一、下载

进入官网：http://jmeter.apache.org/download_jmeter.cgi

1.第一步进入官网如下图

2.选择进行下载，下载下来为一个压缩包，解压即可。

![image-20201008222343114](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20201008222344.png)

3.下载jmeter5.3对应jdk1.8的版本。然后就进行解压。

![image-20201008223522264](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20201008223523.png)

个人认为要注意3点：

1）解压之后压缩包叫apache-jmeter-5.3.zip，如是src.zip后缀的都不对，打开之后会报错不可用，因为里面缺少我们下一步将要配置的环境变量.jar文件。

2）对应的jdk版本不可太低，一般jmeter3.0的对应jdk1.7，jmeter4.0对应jdk1.8以上，否者启用jmeter也会报错。

3）一定要确保环境变量配置正确（包括jdk的与jmeter的环境变量配置）。

 

### 二、环境变量

 1.）  电脑桌面 >> “计算机”图标 >> 鼠标右键选择“属性” >> 点击高级系统设置 >> 高级---》环境变量页面

![image-20201008223740595](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20201008223742.png)

2） 开始配置环境变量了。在系统变量框，点击“新建”一个系统变量：`JMETER_HOME`,值为解压的`jmeter安装路径`。然后点击确定保存即可

3）配置`classpath`变量，没有的话也要按照上面步骤进行新建，有的话直接进行选中，点击编辑即可。变量值固定为：`;%JMETER_HOME%\lib\ext\ApacheJMeter_core.jar;%JMETER_HOME%\lib\jorphan.jar;%JMETER_HOME%\lib/logkit-2.0.jar` 做完之后一定要保存，不确定的话可以直接点击确定按钮直到退到我的电脑页面

![image-20201008224031799](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20201008224033.png)

4）基本配置完成，然后验证一下是否配置正确，是否可用。

首先进到的`jmeter安装路径，找到bin文件夹，点击进去，找到jmeter.bat`，鼠标右键用管理员方式运行，或者直接双击打开，此时会弹出2个界面：

1.个是命令窗口，使用jmeter的时候此命令窗口不能关，缩小到电脑任务栏即可。

2.还有一个界面是jmeter工作页面，可以在里面进行相关的操作.具体如图

 ![image-20201008224104966](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20201008224105.png)

5）确认安装是否成功，双击jmeter.bat或者以管理员方式运行，页面如下：

 ![image-20201008224130280](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20201008224131.png)

6）jmeter的工作区域如下：，我们每次使用jmeter的首先打开方式就是进入bin文件下双击这个jmeter.bat，如果觉得麻烦，可以鼠标右键快捷方式发送电脑桌面，就会方便很多。

![image-20201008224146681](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20201008224147.png)

 

### 三、压测步骤

先设置中文：

![image-20201008224512468](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20201008224513.png)

1、添加本次测试计划 （右键-->添加-->Threads（Users）-->线程组）

![image-20201008224551355](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20201008224552.png)

2、设置线程数 （所谓线程数就是并发用户数）

![image-20201008224609501](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20201008224610.png)

3、添加协议及相关配置信息

![image-20201008224648099](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20201008224649.png)

如有参数，设置参数即可。

4、为线程添加监听器

![image-20201008224724705](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20201008224725.png)

5、启动测试

 ![image-20201008224815170](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20201008224816.png)

6、查看报告

查看结果树

![image-20201008224907619](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20201008224908.png)

聚合报告

![image-20201008224954571](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20201008224955.png)

图形结果

![image-20201008225024120](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20201008225025.png)

至此，基本测试已完成！



### 四、请求参数随机数

> 随机数种类：
>
> * `${__UUID}`  36位全球唯一ID
> * `${__Random(0,999,rand)}`   0~999之间的随机数
> * `${__RandomDate(yyyy-MM-dd,,2020-12-31,,)}`  从现在到2020-12-31的随机日期
> * `${__RandomString(3,qwertyuiopasdfghjklzxcvbnm,)}`  从给定的字符中随机字符3位组成字符串
> * 在用户定义的变量中随机，参考：https://blog.csdn.net/qq19970496/article/details/101028055
>
> 将参数赋值给另外的一个参数：
>
> ![image-20201008225528642](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20201008225530.png)

1.tools >> 打开函数助手 >> 选择_RandomString函数 >> 填入对应的参数

![image-20201008225101197](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20201008225102.png)

2.拷贝生成的函数变量（点生成后实际自动拷贝了），在请求参数值里粘贴

![image-20201008225223899](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20201008225224.png)

