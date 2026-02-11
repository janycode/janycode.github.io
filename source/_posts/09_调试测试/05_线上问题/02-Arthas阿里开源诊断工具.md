---
title: 02-Arthas阿里开源诊断工具
date: 2022-02-20 11:17:58
tags:
- Arthas
- 诊断工具
categories: 
- 09_调试测试
- 05_线上问题
---

![image-20220220121832949](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220220121833.png)

参考资料(官网): https://arthas.gitee.io/index.html

参考资料(阿里云官方CSDN): [Arthas 使用的四种方式](https://blog.csdn.net/alitech2017/article/details/113990603)

参考资料: [使用 Arthas 五分钟解决一个问题](https://blog.csdn.net/u011001084/article/details/116229027)

### 1. 安装

下载并启动：

```shell
curl -O https://arthas.aliyun.com/arthas-boot.jar
java -jar arthas-boot.jar
```

如果下载慢，可以使用阿里云镜像：

```shell
java -jar arthas-boot.jar --repo-mirror aliyun --use-http
```

启动后可以选择应用java进程：

```shell
$ java -jar arthas-boot.jar
* [1]: 35542
  [2]: 71560 math-game.jar
2      #math-game进程是第2个，则输入2，再输入回车/enter。Arthas会attach到目标进程上，并输出日志
```

进入进程后，也可以通过 Arthas Console 自有的控制台: http://localhost:8563/
或者在 arthas-boot 启动前，使用 `jps` 命令可以快速查看当前启动的 java 进程PID和进程名称：
```shell
$ jps
35542 
71560 math-game.jar
16316 Jps
```



> 全局命令说明：
>
> - -x 是展示结果属性遍历深度，默认为 1
> - -n 是执行的次数 ，q 退出
> - -c classloader 的hash值
> - 退出 q ，关闭 stop

### 2. 快速诊断

#### 2.1 快速诊断流程

> 一、定位相关方法
>
> 二、生成观测方法命令：`arthas idea`插件，在方法上右键，`Arthas Command` - `Watch`或`Trace`
>
> 三、登陆应用服务器
>
> 四、curl 或拷贝 jar 包安装 Arthas
>
> 五、运行 Arthas
>
> 六、执行观测方法命令
>
> 七、查看观测结果



#### dashboard

> 查看当前进程的实时面板数据。
>
> https://arthas.gitee.io/dashboard.html

```shell
dashboard
```

![image-20220220122032905](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220220122034.png)

#### thread

> 查看当前线程信息，查看线程的堆栈
>
> https://arthas.gitee.io/thread.html

```shell
thread 1 | grep 'main('
```

    at demo.MathGame.main(MathGame.java:17)



#### jad

> 反编译指定已加载类的源码，查看代码是否是最新的。
>
> https://arthas.gitee.io/jad.html
>
> 扩展: [jad/mc/redefine线上热更新一条龙](https://hengyun.tech/arthas-online-hotswap/)

```shell
jad com.xxx.service.impl.XxxImpl [方法名]
```



#### ★ watch

> 可以查看入参、返回值、异常、可以执行表达式获取静态变量、target.xxx调用目标实施的字段、方法等等，只要你想得到没有做不到的。
>
> https://arthas.gitee.io/watch.html

```shell
watch com.xxx.service.impl.XxxImpl 方法名 '{params,returnObj,throwExp}' -n 5 -x 3 
```

* params 参数
* returnObj 返回值
* throwExp 异常
* -n 5 表示只执行5次
* -x 3 表示遍历深度，可以调整来打印具体的参数和结果内容，默认值是1



#### ★ trace

>方法内部调用路径，并输出方法路径上的每个节点上耗时 —— 定位代码中执行慢的逻辑，性能优化！
>
>https://arthas.gitee.io/trace.html

```shell
#简单用法：跟踪调用路径和耗时
trace demo.MathGame run
#只会展示耗时大于100ms的调用路径，有助于在排查问题的时候，只关注异常情况
trace demo.MathGame run '#cost > 100'
#可以用正则表匹配路径上的多个类和函数，一定程度上达到多层trace的效果。
trace -E com.xxx.service.impl.XxxImpl 方法名 -n 5  --skipJDKMethod false '1==1'
```

* 没有被trace到的函数。比如java.* 下的函数调用默认会忽略掉。通过增加--skipJDKMethod false参数可以打印出来。



### 3. 高级命令

[进阶使用 — Arthas 3.5.5 文档 (gitee.io)](https://arthas.gitee.io/advanced-use.html)

[命令列表 — Arthas 3.5.5 文档 (gitee.io)](https://arthas.gitee.io/commands.html)

![image-20220220122229951](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220220122231.png)



### 4. IDEA 插件

`arthas idea`

安装了“arthas idea”插件之后，在方法名上面单击右键，选择watch，就生成方法观测命令在粘贴板中：

![image-20220220122306645](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220220122308.png)



### 5. 命令图示详解

![Arthas命令图示详解](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230706161943.png)