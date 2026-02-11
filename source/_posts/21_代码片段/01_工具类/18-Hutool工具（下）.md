---
title: 18-Hutool工具（下）
date: 2023-08-20 15:16:15
tags:
- 工具类
categories:
- 21_代码片段
- 01_工具类
---



![image-20241114155630664](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241114155631.png)



参考资料: https://www.hutool.cn/

参考资料-api文档: https://apidoc.gitee.com/loolly/hutool/overview-summary.html

> 本文主要用作汇总和自查用。

依赖：

```xml
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.8.16</version>
</dependency>
```



# 线程工具-ThreadUtil

## [由来](https://www.hutool.cn/docs/#/core/线程和并发/线程工具-ThreadUtil?id=由来)

并发在Java中算是一个比较难理解和容易出问题的部分，而并发的核心在线程。好在从JDK1.5开始Java提供了`concurrent`包可以很好的帮我们处理大部分并发、异步等问题。

不过，`ExecutorService`和`Executors`等众多概念依旧让我们使用这个包变得比较麻烦，如何才能隐藏这些概念？又如何用一个方法解决问题？`ThreadUtil`便为此而生。

## [原理](https://www.hutool.cn/docs/#/core/线程和并发/线程工具-ThreadUtil?id=原理)

Hutool使用`GlobalThreadPool`持有一个全局的线程池，默认所有异步方法在这个线程池中执行。

## [方法](https://www.hutool.cn/docs/#/core/线程和并发/线程工具-ThreadUtil?id=方法)

### [ThreadUtil.execute](https://www.hutool.cn/docs/#/core/线程和并发/线程工具-ThreadUtil?id=threadutilexecute)

直接在公共线程池中执行线程

### [ThreadUtil.newExecutor](https://www.hutool.cn/docs/#/core/线程和并发/线程工具-ThreadUtil?id=threadutilnewexecutor)

获得一个新的线程池

### [ThreadUtil.execAsync](https://www.hutool.cn/docs/#/core/线程和并发/线程工具-ThreadUtil?id=threadutilexecasync)

执行异步方法

### [ThreadUtil.newCompletionService](https://www.hutool.cn/docs/#/core/线程和并发/线程工具-ThreadUtil?id=threadutilnewcompletionservice)

创建CompletionService，调用其submit方法可以异步执行多个任务，最后调用take方法按照完成的顺序获得其结果。若未完成，则会阻塞。

### [ThreadUtil.newCountDownLatch](https://www.hutool.cn/docs/#/core/线程和并发/线程工具-ThreadUtil?id=threadutilnewcountdownlatch)

新建一个CountDownLatch，一个同步辅助类，在完成一组正在其他线程中执行的操作之前，它允许一个或多个线程一直等待。

### [ThreadUtil.sleep](https://www.hutool.cn/docs/#/core/线程和并发/线程工具-ThreadUtil?id=threadutilsleep)

挂起当前线程，是`Thread.sleep`的封装，通过返回boolean值表示是否被打断，而不是抛出异常。

> `ThreadUtil.safeSleep`方法是一个保证挂起足够时间的方法，当给定一个挂起时间，使用此方法可以保证挂起的时间大于或等于给定时间，解决`Thread.sleep`挂起时间不足问题，此方法在Hutool-cron的定时器中使用保证定时任务执行的准确性。

### [ThreadUtil.getStackTrace](https://www.hutool.cn/docs/#/core/线程和并发/线程工具-ThreadUtil?id=threadutilgetstacktrace)

此部分包括两个方法：

- `getStackTrace` 获得堆栈列表
- `getStackTraceElement` 获得堆栈项

### [其它](https://www.hutool.cn/docs/#/core/线程和并发/线程工具-ThreadUtil?id=其它)

- `createThreadLocal` 创建本地线程对象
- `interupt` 结束线程，调用此方法后，线程将抛出InterruptedException异常
- `waitForDie` 等待线程结束. 调用 `Thread.join()` 并忽略 InterruptedException
- `getThreads` 获取JVM中与当前线程同组的所有线程
- `getMainThread` 获取进程的主线程

# 自定义线程池-ExecutorBuilder

## [由来](https://www.hutool.cn/docs/#/core/线程和并发/自定义线程池-ExecutorBuilder?id=由来)

在JDK中，提供了`Executors`用于创建自定义的线程池对象`ExecutorService`，但是考虑到线程池中存在众多概念，这些概念通过不同的搭配实现灵活的线程管理策略，单独使用`Executors`无法满足需求，构建了`ExecutorBuilder`。

### [概念](https://www.hutool.cn/docs/#/core/线程和并发/自定义线程池-ExecutorBuilder?id=概念)

- `corePoolSize` 初始池大小
- `maxPoolSize` 最大池大小（允许同时执行的最大线程数）
- `workQueue` 队列，用于存在未执行的线程
- `handler` 当线程阻塞（block）时的异常处理器，所谓线程阻塞即线程池和等待队列已满，无法处理线程时采取的策略

### [线程池对待线程的策略](https://www.hutool.cn/docs/#/core/线程和并发/自定义线程池-ExecutorBuilder?id=线程池对待线程的策略)

1. 如果池中任务数 < corePoolSize -> 放入立即执行
2. 如果池中任务数 > corePoolSize -> 放入队列等待
3. 队列满 -> 新建线程立即执行
4. 执行中的线程 > maxPoolSize -> 触发handler（RejectedExecutionHandler）异常

### [workQueue线程池策略](https://www.hutool.cn/docs/#/core/线程和并发/自定义线程池-ExecutorBuilder?id=workqueue线程池策略)

- `SynchronousQueue` 它将任务直接提交给线程而不保持它们。当运行线程小于`maxPoolSize`时会创建新线程，否则触发异常策略
- `LinkedBlockingQueue` 默认无界队列，当运行线程大于`corePoolSize`时始终放入此队列，此时`maxPoolSize`无效。当构造LinkedBlockingQueue对象时传入参数，变为有界队列，队列满时，运行线程小于`maxPoolSize`时会创建新线程，否则触发异常策略
- `ArrayBlockingQueue` 有界队列，相对无界队列有利于控制队列大小，队列满时，运行线程小于`maxPoolSize`时会创建新线程，否则触发异常策略

## [使用](https://www.hutool.cn/docs/#/core/线程和并发/自定义线程池-ExecutorBuilder?id=使用)

1. 默认线程池

策略如下：

- 初始线程数为corePoolSize指定的大小
- 没有最大线程数限制
- 默认使用LinkedBlockingQueue，默认队列大小为1024（最大等待数1024）
- 当运行线程大于corePoolSize放入队列，队列满后抛出异常

```java
ExecutorService executor = ExecutorBuilder builder = ExecutorBuilder.create()..build();
```

1. 单线程线程池

- 初始线程数为 1
- 最大线程数为 1
- 默认使用LinkedBlockingQueue，默认队列大小为1024
- 同时只允许一个线程工作，剩余放入队列等待，等待数超过1024报错

```java
ExecutorService executor = ExecutorBuilder.create()//
    .setCorePoolSize(1)//
    .setMaxPoolSize(1)//
    .setKeepAliveTime(0)//
    .build();
```

1. 更多选项的线程池

- 初始5个线程
- 最大10个线程
- 有界等待队列，最大等待数是100

```java
ExecutorService executor = ExecutorBuilder.create()
    .setCorePoolSize(5)
    .setMaxPoolSize(10)
    .setWorkQueue(new LinkedBlockingQueue<>(100))
    .build();
```

1. 特殊策略的线程池

- 初始5个线程
- 最大10个线程
- 它将任务直接提交给线程而不保持它们。当运行线程小于maxPoolSize时会创建新线程，否则触发异常策略

```java
ExecutorService executor = ExecutorBuilder.create()
    .setCorePoolSize(5)
    .setMaxPoolSize(10)
    .useSynchronousQueue()
    .build();
```

# 高并发测试-ConcurrencyTester

## [由来](https://www.hutool.cn/docs/#/core/线程和并发/高并发测试-ConcurrencyTester?id=由来)

很多时候，我们需要简单模拟N个线程调用某个业务测试其并发状况，于是Hutool提供了一个简单的并发测试类——ConcurrencyTester。

## [使用](https://www.hutool.cn/docs/#/core/线程和并发/高并发测试-ConcurrencyTester?id=使用)

```java
ConcurrencyTester tester = ThreadUtil.concurrencyTest(100, () -> {
    // 测试的逻辑内容
    long delay = RandomUtil.randomLong(100, 1000);
    ThreadUtil.sleep(delay);
    Console.log("{} test finished, delay: {}", Thread.currentThread().getName(), delay);
});

// 获取总的执行时间，单位毫秒
Console.log(tester.getInterval());
```

# 图片工具-ImgUtil

## [介绍](https://www.hutool.cn/docs/#/core/图片/图片工具-ImgUtil?id=介绍)

针对awt中图片处理进行封装，这些封装包括：缩放、裁剪、转为黑白、加水印等操作。

## [方法介绍](https://www.hutool.cn/docs/#/core/图片/图片工具-ImgUtil?id=方法介绍)

### [`scale` 缩放图片](https://www.hutool.cn/docs/#/core/图片/图片工具-ImgUtil?id=scale-缩放图片)

提供两种重载方法：其中一个是按照长宽缩放，另一种是按照比例缩放。

```java
ImgUtil.scale(
    FileUtil.file("d:/face.jpg"), 
    FileUtil.file("d:/face_result.jpg"), 
    0.5f//缩放比例
);
```

### [`cut` 剪裁图片](https://www.hutool.cn/docs/#/core/图片/图片工具-ImgUtil?id=cut-剪裁图片)

```java
ImgUtil.cut(
    FileUtil.file("d:/face.jpg"), 
    FileUtil.file("d:/face_result.jpg"), 
    new Rectangle(200, 200, 100, 100)//裁剪的矩形区域
);
```

### [`slice` 按照行列剪裁切片（将图片分为20行和20列）](https://www.hutool.cn/docs/#/core/图片/图片工具-ImgUtil?id=slice-按照行列剪裁切片（将图片分为20行和20列）)

```java
ImgUtil.slice(FileUtil.file("e:/test2.png"), FileUtil.file("e:/dest/"), 10, 10);
```

### [`convert` 图片类型转换，支持GIF->JPG、GIF->PNG、PNG->JPG、PNG->GIF(X)、BMP->PNG等](https://www.hutool.cn/docs/#/core/图片/图片工具-ImgUtil?id=convert-图片类型转换，支持gif-gtjpg、gif-gtpng、png-gtjpg、png-gtgifx、bmp-gtpng等)

```java
ImgUtil.convert(FileUtil.file("e:/test2.png"), FileUtil.file("e:/test2Convert.jpg"));
```

### [`gray` 彩色转为黑白](https://www.hutool.cn/docs/#/core/图片/图片工具-ImgUtil?id=gray-彩色转为黑白)

```java
ImgUtil.gray(FileUtil.file("d:/logo.png"), FileUtil.file("d:/result.png"));
```

### [`pressText` 添加文字水印](https://www.hutool.cn/docs/#/core/图片/图片工具-ImgUtil?id=presstext-添加文字水印)

```java
ImgUtil.pressText(//
    FileUtil.file("e:/pic/face.jpg"), //
    FileUtil.file("e:/pic/test2_result.png"), //
    "版权所有", Color.WHITE, //文字
    new Font("黑体", Font.BOLD, 100), //字体
    0, //x坐标修正值。 默认在中间，偏移量相对于中间偏移
    0, //y坐标修正值。 默认在中间，偏移量相对于中间偏移
    0.8f//透明度：alpha 必须是范围 [0.0, 1.0] 之内（包含边界值）的一个浮点数字
);
```

### [`pressImage` 添加图片水印](https://www.hutool.cn/docs/#/core/图片/图片工具-ImgUtil?id=pressimage-添加图片水印)

```java
ImgUtil.pressImage(
    FileUtil.file("d:/picTest/1.jpg"), 
    FileUtil.file("d:/picTest/dest.jpg"), 
    ImgUtil.read(FileUtil.file("d:/picTest/1432613.jpg")), //水印图片
    0, //x坐标修正值。 默认在中间，偏移量相对于中间偏移
    0, //y坐标修正值。 默认在中间，偏移量相对于中间偏移
    0.1f
);
```

### [`rotate` 旋转图片](https://www.hutool.cn/docs/#/core/图片/图片工具-ImgUtil?id=rotate-旋转图片)

```java
// 旋转180度
BufferedImage image = ImgUtil.rotate(ImageIO.read(FileUtil.file("e:/pic/366466.jpg")), 180);
ImgUtil.write(image, FileUtil.file("e:/pic/result.png"));
```

### [`flip` 水平翻转图片](https://www.hutool.cn/docs/#/core/图片/图片工具-ImgUtil?id=flip-水平翻转图片)

```java
ImgUtil.flip(FileUtil.file("d:/logo.png"), FileUtil.file("d:/result.png"));
```

# 图片编辑器-Img

## [介绍](https://www.hutool.cn/docs/#/core/图片/图片编辑器-Img?id=介绍)

针对awt中图片处理进行封装，这些封装包括：缩放、裁剪、转为黑白、加水印等操作。

## [方法介绍](https://www.hutool.cn/docs/#/core/图片/图片编辑器-Img?id=方法介绍)

### [图像切割](https://www.hutool.cn/docs/#/core/图片/图片编辑器-Img?id=图像切割)

```java
// 将face.jpg切割为原型保存为face_radis.png
Img.from(FileUtil.file("e:/pic/face.jpg"))
    .cut(0, 0, 200)//
    .write(FileUtil.file("e:/pic/face_radis.png"));
```

### [图片压缩](https://www.hutool.cn/docs/#/core/图片/图片编辑器-Img?id=图片压缩)

图片压缩只支持Jpg文件。

```java
Img.from(FileUtil.file("e:/pic/1111.png"))
    .setQuality(0.8)//压缩比率
    .write(FileUtil.file("e:/pic/1111_target.jpg"));
```



# 网络工具-NetUtil

## [由来](https://www.hutool.cn/docs/#/core/网络/网络工具-NetUtil?id=由来)

在日常开发中，网络连接这块儿必不可少。日常用到的一些功能,隐藏掉部分IP地址、绝对相对路径的转换等等。

## [介绍](https://www.hutool.cn/docs/#/core/网络/网络工具-NetUtil?id=介绍)

`NetUtil` 工具中主要的方法包括：

1. `longToIpv4` 根据long值获取ip v4地址
2. `ipv4ToLong` 根据ip地址计算出long型的数据
3. `isUsableLocalPort` 检测本地端口可用性
4. `isValidPort` 是否为有效的端口
5. `isInnerIP` 判定是否为内网IP
6. `localIpv4s` 获得本机的IP地址列表
7. `toAbsoluteUrl` 相对URL转换为绝对URL
8. `hideIpPart` 隐藏掉IP地址的最后一部分为 * 代替
9. `buildInetSocketAddress` 构建InetSocketAddress
10. `getIpByHost` 通过域名得到IP
11. `isInner` 指定IP的long是否在指定范围内

## [使用](https://www.hutool.cn/docs/#/core/网络/网络工具-NetUtil?id=使用)

```java
String ip= "127.0.0.1";
long iplong = 2130706433L;

//根据long值获取ip v4地址
String ip= NetUtil.longToIpv4(iplong);


//根据ip地址计算出long型的数据
long ip= NetUtil.ipv4ToLong(ip);

//检测本地端口可用性
boolean result= NetUtil.isUsableLocalPort(6379);

//是否为有效的端口
boolean result= NetUtil.isValidPort(6379);

//隐藏掉IP地址
 String result =NetUtil.hideIpPart(ip);
```

更多方法请见：

[API文档-NetUtil](https://apidoc.gitee.com/loolly/hutool/cn/hutool/core/net/NetUtil.html)

# URL生成器-UrlBuilder

## [由来](https://www.hutool.cn/docs/#/core/网络/URL生成器-UrlBuilder?id=由来)

在JDK中，我们可以借助`URL`对象完成URL的格式化，但是无法完成一些特殊URL的解析和处理，例如编码过的URL、不标准的路径和参数。在旧版本的hutool中，URL的规范完全靠字符串的替换来完成，不但效率低，而且处理过程及其复杂。于是在5.3.1之后，加入了UrlBuilder类，拆分URL的各个部分，分别处理和格式化，完成URL的规范。

按照[Uniform Resource Identifier](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier)的标准定义，URL的结构如下：

- [scheme:]scheme-specific-part[#fragment]
- [scheme:][//authority][path][?query][#fragment]
- [scheme:][//host:port][path][?query][#fragment]

按照这个格式，UrlBuilder将URL分成scheme、host、port、path、query、fragment部分，其中path和query较为复杂，又使用`UrlPath`和`UrlQuery`分别封装。

## [使用](https://www.hutool.cn/docs/#/core/网络/URL生成器-UrlBuilder?id=使用)

相比`URL`对象，UrlBuilder更加人性化，例如：

```java
URL url = new URL("www.hutool.cn")
```

此时会报`java.net.MalformedURLException: no protocol`的错误，而使用UrlBuilder则会有默认协议：

```java
// 输出 http://www.hutool.cn/
String buildUrl = UrlBuilder.create().setHost("www.hutool.cn").build();
```

### [完整构建](https://www.hutool.cn/docs/#/core/网络/URL生成器-UrlBuilder?id=完整构建)

```java
// https://www.hutool.cn/aaa/bbb?ie=UTF-8&wd=test
String buildUrl = UrlBuilder.create()
    .setScheme("https")
    .setHost("www.hutool.cn")
    .addPath("/aaa").addPath("bbb")
    .addQuery("ie", "UTF-8")
    .addQuery("wd", "test")
    .build();
```

### [中文编码](https://www.hutool.cn/docs/#/core/网络/URL生成器-UrlBuilder?id=中文编码)

当参数中有中文时，自动编码中文，默认UTF-8编码，也可以调用`setCharset`方法自定义编码。

```java
// https://www.hutool.cn/s?ie=UTF-8&ie=GBK&wd=%E6%B5%8B%E8%AF%95
String buildUrl = UrlBuilder.create()
    .setScheme("https")
    .setHost("www.hutool.cn")
    .addPath("/s")
    .addQuery("ie", "UTF-8")
    .addQuery("ie", "GBK")
    .addQuery("wd", "测试")
    .build();
```

### [解析](https://www.hutool.cn/docs/#/core/网络/URL生成器-UrlBuilder?id=解析)

当有一个URL字符串时，可以使用`of`方法解析：

```java
UrlBuilder builder = UrlBuilder.ofHttp("www.hutool.cn/aaa/bbb/?a=张三&b=%e6%9d%8e%e5%9b%9b#frag1", CharsetUtil.CHARSET_UTF_8);

// 输出张三
Console.log(builder.getQuery().get("a"));
// 输出李四
Console.log(builder.getQuery().get("b"));
```

我们发现这个例子中，原URL中的参数a是没有编码的，b是编码过的，当用户提供此类混合URL时，Hutool可以很好的识别并全部decode，当然，调用build()之后，会全部再encode。

### [特殊URL解析](https://www.hutool.cn/docs/#/core/网络/URL生成器-UrlBuilder?id=特殊url解析)

有时候URL中会存在`&`这种分隔符，谷歌浏览器会将此字符串转换为`&`使用，Hutool中也同样如此：

```java
String urlStr = "https://mp.weixin.qq.com/s?__biz=MzI5NjkyNTIxMg==&amp;mid=100000465&amp;idx=1";
UrlBuilder builder = UrlBuilder.ofHttp(urlStr, CharsetUtil.CHARSET_UTF_8);

// https://mp.weixin.qq.com/s?__biz=MzI5NjkyNTIxMg==&mid=100000465&idx=1
Console.log(builder.build());
```

> UrlBuilder主要应用于http模块，在构建HttpRequest时，用户传入的URL五花八门，为了做大最好的适应性，减少用户对URL的处理，使用UrlBuilder完成URL的规范化。

# 源码编译工具-CompilerUtil.md

## [介绍](https://www.hutool.cn/docs/#/core/源码编译/源码编译工具-CompilerUtil?id=介绍)

JDK提供了`JavaCompiler`用于动态编译java源码文件，然后通过类加载器加载，这种动态编译可以让Java有动态脚本的特性，Hutool针对此封装了对应工具。

## [使用](https://www.hutool.cn/docs/#/core/源码编译/源码编译工具-CompilerUtil?id=使用)

首先我们将编译需要依赖的class文件和jar文件打成一个包：

```java
// 依赖A，编译B和C
final File libFile = ZipUtil.zip(FileUtil.file("lib.jar"),
        new String[]{"a/A.class", "a/A$1.class", "a/A$InnerClass.class"},
        new InputStream[]{
                FileUtil.getInputStream("test-compile/a/A.class"),
                FileUtil.getInputStream("test-compile/a/A$1.class"),
                FileUtil.getInputStream("test-compile/a/A$InnerClass.class")
        });
```

开始编译：

```java
final ClassLoader classLoader = CompilerUtil.getCompiler(null)
    // 被编译的源码文件
    .addSource(FileUtil.file("test-compile/b/B.java"))
    // 被编译的源码字符串
    .addSource("c.C", FileUtil.readUtf8String("test-compile/c/C.java"))
    // 编译依赖的库
    .addLibrary(libFile)
    .compile();
```

加载编译好的类：

```java
final Class<?> clazz = classLoader.loadClass("c.C");
// 实例化对象c
Object obj = ReflectUtil.newInstance(clazz);
```

# 设置文件-Setting

## [简介](https://www.hutool.cn/docs/#/setting/设置文件-Setting?id=简介)

Setting除了兼容Properties文件格式外，还提供了一些特有功能，这些功能包括：

- 各种编码方式支持
- 变量支持
- 分组支持

首先说编码支持，在Properties中，只支`ISO8859-1`导致在Properties文件中注释和value没法使用中文，（用日本的那个插件在Eclipse里可以读写，放到服务器上读就费劲了），因此Setting中引入自定义编码，可以很好的支持各种编码的配置文件。

再就是变量支持，在Setting中，支持${key}变量，可以将之前定义的键对应的值做为本条值得一部分，这个特性可以减少大量的配置文件冗余。

最后是分组支持。分组的概念我第一次在Linux的rsync的/etc/rsyncd.conf配置文件中有所了解，发现特别实用，具体大家可以自行百度之。当然，在Windows的ini文件中也有分组的概念，Setting将这一概念引入，从而大大增加配置文件的可读性。

## [配置文件格式example.setting](https://www.hutool.cn/docs/#/setting/设置文件-Setting?id=配置文件格式examplesetting)

```shell
#中括表示一个分组，其下面的所有属性归属于这个分组，在此分组名为demo，也可以没有分组
[demo]
#自定义数据源设置文件，这个文件会针对当前分组生效，用于给当前分组配置单独的数据库连接池参数，没有则使用全局的配置
ds.setting.path = config/other.setting
#数据库驱动名，如果不指定，则会根据url自动判定
driver = com.mysql.jdbc.Driver
#JDBC url，必须
url = jdbc:mysql://fedora.vmware:3306/extractor
#用户名，必须
user = root${demo.driver}
#密码，必须，如果密码为空，请填写 pass = 
pass = 123456
```

配置文件可以放在任意位置，具体Setting类如何寻在在构造方法中提供了多种读取方式，具体稍后介绍。现在说下配置文件的具体格式 Setting配置文件类似于Properties文件，规则如下：

1. 注释用`#`开头表示，只支持单行注释，空行和无法正常被识别的键值对也会被忽略，可作为注释，但是建议显式指定注释。同时在value之后不允许有注释，会被当作value的一部分。
2. 键值对使用key = value 表示，key和value在读取时会trim掉空格，所以不用担心空格。
3. 分组为中括号括起来的内容（例如配置文件中的`[demo]`），中括号以下的行都为此分组的内容，无分组相当于空字符分组，即`[]`。若某个`key`是`name`，分组是`group`，加上分组后的key相当于group.name。
4. 支持变量，默认变量命名为 ${变量名}，变量只能识别读入行的变量，例如第6行的变量在第三行无法读取，例如配置文件中的${driver}会被替换为com.mysql.jdbc.Driver，为了性能，Setting创建的时候构造方法会指定是否开启变量替换，默认不开启。

## [代码](https://www.hutool.cn/docs/#/setting/设置文件-Setting?id=代码)

代码具体请见`cn.hutool.setting.test.SettingTest`

1. Setting初始化

```java
//读取classpath下的XXX.setting，不使用变量
Setting setting = new Setting("XXX.setting");

//读取classpath下的config目录下的XXX.setting，不使用变量
setting = new Setting("config/XXX.setting");

//读取绝对路径文件/home/looly/XXX.setting（没有就创建，关于touc请查阅FileUtil）
//第二个参数为自定义的编码，请保持与Setting文件的编码一致
//第三个参数为是否使用变量，如果为true，则配置文件中的每个key都以被之后的条目中的value引用形式为 ${key}
setting = new Setting(FileUtil.touc("/home/looly/XXX.setting"), CharsetUtil.CHARSET_UTF_8, true);

//读取与SettingDemo.class文件同包下的XXX.setting
setting = new Setting("XXX.setting", SettingDemo.class,CharsetUtil.CHARSET_UTF_8, true);
```

1. Setting读取配置参数

```java
//获取key为name的值
setting.getStr("name");
//获取分组为group下key为name的值
setting.getByGroup("name", "group1");
//当获取的值为空（null或者空白字符时，包括多个空格），返回默认值
setting.getStr("name", "默认值");
//完整的带有key、分组和默认值的获得值得方法
setting.getStr("name", "group1", "默认值");

//如果想获得其它类型的值，可以调用相应的getXXX方法，参数相似

//有时候需要在key对应value不存在的时候（没有这项设置的时候）告知户，故有此方法打印一个debug日志
setting.getWithLog("name");
setting.getByGroupWithLog("name", "group1");

//获取分组下所有配置键值对，组成新的Setting
setting.getSetting("group1")
```

1. 重新加载配置和保存配置

```java
//重新读取配置文件
setting.reload();
im
//在配置文件变更时自动加载
setting.autoLoad(true);

//当通过代码加入新的键值对的时候，调用store会保存到文件，但是会盖原来的文件，并丢失注释
setting.set("name1", "value");
setting.store("/home/looly/XXX.setting");
//获得所有分组名
setting.getGroups();

//将key-value映射为对象，原理是原理是调用对象对应的setXX方法
UserVO userVo = new UserVo();
setting.toBean(userVo);

//设定变量名的正则表达式。
//Setting的变量替换是通过正则查找替换的，如果Setting中的变量名其他冲突，可以改变变量的定义方式
//整个正则匹配变量名，分组1匹配key的名字
setting.setVarRegex("\\$\\{(.*?)\\}");
```

# Properties扩展-Props

## [介绍](https://www.hutool.cn/docs/#/setting/Properties扩展-Props?id=介绍)

对于Properties的广泛使用使我也无能为力，有时候遇到Properties文件又想方便的读写也不容易，于是对Properties做了简单的封装，提供了方便的构造方法（与Setting一致），并提供了与Setting一致的getXXX方法来扩展Properties类，`Props`类继承自Properties，所以可以兼容Properties类。

## [使用](https://www.hutool.cn/docs/#/setting/Properties扩展-Props?id=使用)

Props的使用方法和Properties以及Setting一致（同时支持）：

```java
Props props = new Props("test.properties");
String user = props.getProperty("user");
String driver = props.getStr("driver");
```

# 日志工厂-LogFactory

## [介绍](https://www.hutool.cn/docs/#/log/日志工厂-LogFactory?id=介绍)

Hutool-log做为一个日志门面，为了兼容各大日志框架，一个用于自动创建日志对象的日志工厂类必不可少。

`LogFactory`类用于灵活的创建日志对象，通过static方法创建我们需要的日志，主要功能如下：

- `LogFactory.get` 自动识别引入的日志框架，从而创建对应日志框架的门面Log对象（此方法创建一次后，下次再次get会根据传入类名缓存Log对象，对于每个类，Log对象都是单例的），同时自动识别当前类，将当前类做为类名传入日志框架。
- `LogFactory.createLog` 与get方法作用类似。但是此方法调用后会每次创建一个新的Log对象。
- `LogFactory.setCurrentLogFactory` 自定义当前日志门面的日志实现类。当引入多个日志框架时，我们希望自定义所用的日志框架，调用此方法即可。需要注意的是，此方法为全局方法，在获取Log对象前只调用一次即可。

## [使用](https://www.hutool.cn/docs/#/log/日志工厂-LogFactory?id=使用)

### [获取当前类对应的Log对象：](https://www.hutool.cn/docs/#/log/日志工厂-LogFactory?id=获取当前类对应的log对象：)

```java
//推荐创建不可变静态类成员变量
private static final Log log = LogFactory.get();
```

如果你想获得自定义name的Log对象（像普通Log日志实现一样），那么可以使用如下方式获取Log：

```java
private static final Log log = LogFactory.get("我是一个自定义日志名");
```

### [自定义日志实现](https://www.hutool.cn/docs/#/log/日志工厂-LogFactory?id=自定义日志实现)

```java
//自定义日志实现为Apache Commons Logging
LogFactory.setCurrentLogFactory(new ApacheCommonsLogFactory());

//自定义日志实现为JDK Logging
LogFactory.setCurrentLogFactory(new JdkLogFactory());

//自定义日志实现为Console Logging
LogFactory.setCurrentLogFactory(new ConsoleLogFactory());
```

### [自定义日志工厂（自定义日志门面实现）](https://www.hutool.cn/docs/#/log/日志工厂-LogFactory?id=自定义日志工厂（自定义日志门面实现）)

LogFactory是一个抽象类，我们可以继承此类，实现`createLog`方法即可（同时我们可能需要实现Log接口来达到自定义门面的目的），这样我们就可以自定义一个日志门面。最后通过`LogFactory.setCurrentLogFactory`方法装入这个自定义LogFactory即可实现自定义日志门面。

> PS 自定义日志门面的实现可以参考`cn.hutool.log.dialect`包中的实现内容自定义扩展。 本质上，实现Log接口，做一个日志实现的Wrapper，然后在相应的工厂类中创建此Log实例即可。同时，LogFactory中还可以初始化一些启动配置参数。



# 静态调用日志-StaticLog

## [由来](https://www.hutool.cn/docs/#/log/静态调用日志-StaticLog?id=由来)

很多时候，我们只是想简简单的使用日志，最好一个方法搞定，我也不想创建Log对象，那么`StaticLog`或许是你需要的。

## [使用](https://www.hutool.cn/docs/#/log/静态调用日志-StaticLog?id=使用)

```java
StaticLog.info("This is static {} log.", "INFO");
```

同样StaticLog提供了trace、debug、info、warn、error方法，提供变量占位符支持，使项目中日志的使用简单到没朋友。

StaticLog类中同样提供log方法，可能在极致简洁的状况下，提供非常棒的灵活性（打印日志等级由level参数决定）

## [与LogFactory同名方法](https://www.hutool.cn/docs/#/log/静态调用日志-StaticLog?id=与logfactory同名方法)

假如你只知道StaticLog，不知道LogFactory怎么办？Hutool非常贴心的提供了`get`方法，此方法与Logfactory中的`get`方法一样，同样可以获得Log对象。



# 缓存工具-CacheUtil

## [概述](https://www.hutool.cn/docs/#/cache/CacheUtil?id=概述)

CacheUtil是缓存创建的快捷工具类。用于快速创建不同的缓存对象。

## [使用](https://www.hutool.cn/docs/#/cache/CacheUtil?id=使用)

```java
//新建FIFOCache
Cache<String,String> fifoCache = CacheUtil.newFIFOCache(3);
```

同样其它类型的Cache也可以调用newXXX的方法创建。



# 先入先出-FIFOCache

## [介绍](https://www.hutool.cn/docs/#/cache/FIFOCache?id=介绍)

FIFO(first in first out) 先进先出策略。元素不停的加入缓存直到缓存满为止，当缓存满时，清理过期缓存对象，清理后依旧满则删除先入的缓存（链表首部对象）。

优点：简单快速 缺点：不灵活，不能保证最常用的对象总是被保留

## [使用](https://www.hutool.cn/docs/#/cache/FIFOCache?id=使用)

```java
Cache<String,String> fifoCache = CacheUtil.newFIFOCache(3);

//加入元素，每个元素可以设置其过期时长，DateUnit.SECOND.getMillis()代表每秒对应的毫秒数，在此为3秒
fifoCache.put("key1", "value1", DateUnit.SECOND.getMillis() * 3);
fifoCache.put("key2", "value2", DateUnit.SECOND.getMillis() * 3);
fifoCache.put("key3", "value3", DateUnit.SECOND.getMillis() * 3);

//由于缓存容量只有3，当加入第四个元素的时候，根据FIFO规则，最先放入的对象将被移除
fifoCache.put("key4", "value4", DateUnit.SECOND.getMillis() * 3);

//value1为null
String value1 = fifoCache.get("key1");
```

# 最少使用-LFUCache

## [介绍](https://www.hutool.cn/docs/#/cache/LFUCache?id=介绍)

LFU(least frequently used) 最少使用率策略。根据使用次数来判定对象是否被持续缓存（使用率是通过访问次数计算），当缓存满时清理过期对象，清理后依旧满的情况下清除最少访问（访问计数最小）的对象并将其他对象的访问数减去这个最小访问数，以便新对象进入后可以公平计数。

## [使用](https://www.hutool.cn/docs/#/cache/LFUCache?id=使用)

```java
Cache<String, String> lfuCache = CacheUtil.newLFUCache(3);
//通过实例化对象创建
//LFUCache<String, String> lfuCache = new LFUCache<String, String>(3);

lfuCache.put("key1", "value1", DateUnit.SECOND.getMillis() * 3);
lfuCache.get("key1");//使用次数+1
lfuCache.put("key2", "value2", DateUnit.SECOND.getMillis() * 3);
lfuCache.put("key3", "value3", DateUnit.SECOND.getMillis() * 3);
lfuCache.put("key4", "value4", DateUnit.SECOND.getMillis() * 3);

//由于缓存容量只有3，当加入第四个元素的时候，根据LRU规则，最少使用的将被移除（2,3被移除）
String value2 = lfuCache.get("key2");//null
String value3 = lfuCache.get("key3");//null
```

# 最近最久未使用-LRUCache

## [介绍](https://www.hutool.cn/docs/#/cache/LRUCache?id=介绍)

LRU (least recently used)最近最久未使用缓存。根据使用时间来判定对象是否被持续缓存，当对象被访问时放入缓存，当缓存满了，最久未被使用的对象将被移除。此缓存基于LinkedHashMap，因此当被缓存的对象每被访问一次，这个对象的key就到链表头部。这个算法简单并且非常快，他比FIFO有一个显著优势是经常使用的对象不太可能被移除缓存。缺点是当缓存满时，不能被很快的访问。

## [使用](https://www.hutool.cn/docs/#/cache/LRUCache?id=使用)

```java
Cache<String, String> lruCache = CacheUtil.newLRUCache(3);
//通过实例化对象创建
//LRUCache<String, String> lruCache = new LRUCache<String, String>(3);
lruCache.put("key1", "value1", DateUnit.SECOND.getMillis() * 3);
lruCache.put("key2", "value2", DateUnit.SECOND.getMillis() * 3);
lruCache.put("key3", "value3", DateUnit.SECOND.getMillis() * 3);
lruCache.get("key1");//使用时间推近
lruCache.put("key4", "value4", DateUnit.SECOND.getMillis() * 3);

//由于缓存容量只有3，当加入第四个元素的时候，根据LRU规则，最少使用的将被移除（2被移除）
String value2 = lruCache.get("key");//null
```

# 超时-TimedCache

## [介绍](https://www.hutool.cn/docs/#/cache/TimedCache?id=介绍)

定时缓存，对被缓存的对象定义一个过期时间，当对象超过过期时间会被清理。此缓存没有容量限制，对象只有在过期后才会被移除。

## [使用](https://www.hutool.cn/docs/#/cache/TimedCache?id=使用)

```java
//创建缓存，默认4毫秒过期
TimedCache<String, String> timedCache = CacheUtil.newTimedCache(4);
//实例化创建
//TimedCache<String, String> timedCache = new TimedCache<String, String>(4);

timedCache.put("key1", "value1", 1);//1毫秒过期
timedCache.put("key2", "value2", DateUnit.SECOND.getMillis() * 5);
timedCache.put("key3", "value3");//默认过期(4毫秒)

//启动定时任务，每5毫秒清理一次过期条目，注释此行首次启动仍会清理过期条目
timedCache.schedulePrune(5);

//等待5毫秒
ThreadUtil.sleep(5);

//5毫秒后由于value2设置了5毫秒过期，因此只有value2被保留下来
String value1 = timedCache.get("key1");//null
String value2 = timedCache.get("key2");//value2

//5毫秒后，由于设置了默认过期，key3只被保留4毫秒，因此为null
String value3 = timedCache.get("key3");//null

//取消定时清理
timedCache.cancelPruneSchedule();
```

如果用户在超时前调用了`get(key)`方法，会重头计算起始时间。举个例子，用户设置key1的超时时间5s，用户在4s的时候调用了`get("key1")`，此时超时时间重新计算，再过4s调用`get("key1")`方法值依旧存在。如果想避开这个机制，请调用`get("key1", false)`方法。

> 说明 如果启动了定时器，那会定时清理缓存中的过期值，但是如果不起动，那只有在get这个值得时候才检查过期并清理。不起动定时器带来的问题是：有些值如果长时间不访问，会占用缓存的空间。

# 弱引用-WeakCache

## [介绍](https://www.hutool.cn/docs/#/cache/WeakCache?id=介绍)

弱引用缓存。对于一个给定的键，其映射的存在并不阻止垃圾回收器对该键的丢弃，这就使该键成为可终止的，被终止，然后被回收。丢弃某个键时，其条目从映射中有效地移除。该类使用了WeakHashMap做为其实现，缓存的清理依赖于JVM的垃圾回收。

## [使用](https://www.hutool.cn/docs/#/cache/WeakCache?id=使用)

与TimedCache使用方法一致：

```java
WeakCache<String, String> weakCache = CacheUtil.newWeakCache(DateUnit.SECOND.getMillis() * 3);
```

WeakCache也可以像TimedCache一样设置定时清理时间，同时具备垃圾回收清理。

# 文件缓存-FileCache

## [介绍](https://www.hutool.cn/docs/#/cache/FileCache?id=介绍)

FileCache主要是将小文件以byte[]的形式缓存到内存中，减少文件的访问，以解决频繁读取文件引起的性能问题。

## [实现](https://www.hutool.cn/docs/#/cache/FileCache?id=实现)

- LFUFileCache
- LRUFileCache

## [使用](https://www.hutool.cn/docs/#/cache/FileCache?id=使用)

```java
//参数1：容量，能容纳的byte数
//参数2：最大文件大小，byte数，决定能缓存至少多少文件，大于这个值不被缓存直接读取
//参数3：超时。毫秒
LFUFileCache cache = new LFUFileCache(1000, 500, 2000);
byte[] bytes = cache.getFileBytes("d:/a.jpg");
```

LRUFileCache的使用与LFUFileCache一致，不再举例。

# JSON工具-JSONUtil

## [介绍](https://www.hutool.cn/docs/#/json/JSONUtil?id=介绍)

`JSONUtil`是针对JSONObject和JSONArray的静态快捷方法集合，在之前的章节我们已经介绍了一些工具方法，在本章节我们将做一些补充。

## [使用](https://www.hutool.cn/docs/#/json/JSONUtil?id=使用)

### [JSON字符串创建](https://www.hutool.cn/docs/#/json/JSONUtil?id=json字符串创建)

`JSONUtil.toJsonStr`可以将任意对象（Bean、Map、集合等）直接转换为JSON字符串。 如果对象是有序的Map等对象，则转换后的JSON字符串也是有序的。

```java
SortedMap<Object, Object> sortedMap = new TreeMap<Object, Object>() {
    private static final long serialVersionUID = 1L;
    {
    put("attributes", "a");
    put("b", "b");
    put("c", "c");
}};

JSONUtil.toJsonStr(sortedMap);
```

结果：

```json
{"attributes":"a","b":"b","c":"c"}
```

如果我们想获得格式化后的JSON，则：

```java
JSONUtil.toJsonPrettyStr(sortedMap);
```

结果：

```json
{
    "attributes": "a",
    "b": "b",
    "c": "c"
}
```

### [JSON字符串解析](https://www.hutool.cn/docs/#/json/JSONUtil?id=json字符串解析)

```java
String html = "{\"name\":\"Something must have been changed since you leave\"}";
JSONObject jsonObject = JSONUtil.parseObj(html);
jsonObject.getStr("name");
```

### [XML字符串转换为JSON](https://www.hutool.cn/docs/#/json/JSONUtil?id=xml字符串转换为json)

```java
String s = "<sfzh>123</sfzh><sfz>456</sfz><name>aa</name><gender>1</gender>";
JSONObject json = JSONUtil.parseFromXml(s);

json.get("sfzh");
json.get("name");
```

### [JSON转换为XML](https://www.hutool.cn/docs/#/json/JSONUtil?id=json转换为xml)

```java
final JSONObject put = JSONUtil.createObj()
        .set("aaa", "你好")
        .set("键2", "test");

// <aaa>你好</aaa><键2>test</键2>
final String s = JSONUtil.toXmlStr(put);
```

### [JSON转Bean](https://www.hutool.cn/docs/#/json/JSONUtil?id=json转bean)

我们先定义两个较为复杂的Bean（包含泛型）

```java
@Data
public class ADT {
    private List<String> BookingCode;
}

@Data
public class Price {
    private List<List<ADT>> ADT;
}
String json = "{\"ADT\":[[{\"BookingCode\":[\"N\",\"N\"]}]]}";

Price price = JSONUtil.toBean(json, Price.class);

// 
price.getADT().get(0).get(0).getBookingCode().get(0);
```

### [readXXX](https://www.hutool.cn/docs/#/json/JSONUtil?id=readxxx)

这类方法主要是从JSON文件中读取JSON对象的快捷方法。包括：

- readJSON
- readJSONObject
- readJSONArray

### [其它方法](https://www.hutool.cn/docs/#/json/JSONUtil?id=其它方法)

除了上面中常用的一些方法，JSONUtil还提供了一些JSON辅助方法：

- quote 对所有双引号做转义处理（使用双反斜杠做转义）
- wrap 包装对象，可以将普通任意对象转为JSON对象
- formatJsonStr 格式化JSON字符串，此方法并不严格检查JSON的格式正确与否

# JSON对象-JSONObject

## [介绍](https://www.hutool.cn/docs/#/json/JSONObject?id=介绍)

JSONObject代表一个JSON中的键值对象，这个对象以大括号包围，每个键值对使用`,`隔开，键与值使用`:`隔开，一个JSONObject类似于这样：

```json
{
  "key1":"value1",
  "key2":"value2"
}
```

此处键部分可以省略双引号，值为字符串时不能省略，为数字或波尔值时不加双引号。

## [使用](https://www.hutool.cn/docs/#/json/JSONObject?id=使用)

### [创建](https://www.hutool.cn/docs/#/json/JSONObject?id=创建)

```java
JSONObject json1 = JSONUtil.createObj()
  .put("a", "value1")
  .put("b", "value2")
  .put("c", "value3");
```

`JSONUtil.createObj()`是快捷新建JSONObject的工具方法，同样我们可以直接new：

```java
JSONObject json1 = new JSONObject();
...
```

### [转换](https://www.hutool.cn/docs/#/json/JSONObject?id=转换)

1. JSON字符串解析

   ```java
   String jsonStr = "{\"b\":\"value2\",\"c\":\"value3\",\"a\":\"value1\"}";
   //方法一：使用工具类转换
   JSONObject jsonObject = JSONUtil.parseObj(jsonStr);
   //方法二：new的方式转换
   JSONObject jsonObject2 = new JSONObject(jsonStr);
   ```

//JSON对象转字符串（一行） jsonObject.toString();

// 也可以美化一下，即显示出带缩进的JSON： jsonObject.toStringPretty();

```
2. JavaBean解析

首先我们定义一个Bean
​```java
// 注解使用Lombok
@Data
public class UserA {
    private String name;
    private String a;
    private Date date;
    private List<Seq> sqs;
}
```

解析为JSON：

```java
UserA userA = new UserA();
userA.setName("nameTest");
userA.setDate(new Date());
userA.setSqs(CollectionUtil.newArrayList(new Seq(null), new Seq("seq2")));

// false表示不跳过空值
JSONObject json = JSONUtil.parseObj(userA, false);
Console.log(json.toStringPretty());
```

结果：

```json
{
    "date": 1585618492295,
    "a": null,
    "sqs": [
        {
            "seq": null
        },
        {
            "seq": "seq2"
        }
    ],
    "name": "nameTest"
}
```

可以看到，输出的字段顺序和Bean的字段顺序不一致，如果想保持一致，可以：

```java
// 第二个参数表示保持有序
JSONObject json = JSONUtil.parseObj(userA, false, true);
```

结果：

```json
{
    "name": "nameTest",
    "a": null,
    "date": 1585618648523,
    "sqs": [
        {
            "seq": null
        },
        {
            "seq": "seq2"
        }
    ]
}
```

默认的，Hutool将日期输出为时间戳，如果需要自定义日期格式，可以调用：

```java
json.setDateFormat("yyyy-MM-dd HH:mm:ss");
```

得到结果为：

```json
{
    "name": "nameTest",
    "a": null,
    "date": "2020-03-31 09:41:29",
    "sqs": [
        {
            "seq": null
        },
        {
            "seq": "seq2"
        }
    ]
}
```

# JSON数组-JSONArray

## [介绍](https://www.hutool.cn/docs/#/json/JSONArray?id=介绍)

在JSON中，JSONArray代表一个数组，使用中括号包围，每个元素使用逗号隔开。一个JSONArray类似于这样：

```json
["value1","value2","value3"]
```

## [使用](https://www.hutool.cn/docs/#/json/JSONArray?id=使用)

### [创建](https://www.hutool.cn/docs/#/json/JSONArray?id=创建)

```java
//方法1
JSONArray array = JSONUtil.createArray();
//方法2
JSONArray array = new JSONArray();

array.add("value1");
array.add("value2");
array.add("value3");

//转为JSONArray字符串
array.toString();
```

### [从Bean列表解析](https://www.hutool.cn/docs/#/json/JSONArray?id=从bean列表解析)

先定义bean：

```java
@Data
public class KeyBean{
    private String akey;
    private String bkey;
}
KeyBean b1 = new KeyBean();
b1.setAkey("aValue1");
b1.setBkey("bValue1");
KeyBean b2 = new KeyBean();
b2.setAkey("aValue2");
b2.setBkey("bValue2");

ArrayList<KeyBean> list = CollUtil.newArrayList(b1, b2);

// [{"akey":"aValue1","bkey":"bValue1"},{"akey":"aValue2","bkey":"bValue2"}]
JSONArray jsonArray = JSONUtil.parseArray(list);

// aValue1
jsonArray.getJSONObject(0).getStr("akey");
```

### [从JSON字符串解析](https://www.hutool.cn/docs/#/json/JSONArray?id=从json字符串解析)

```java
String jsonStr = "[\"value1\", \"value2\", \"value3\"]";
JSONArray array = JSONUtil.parseArray(jsonStr);
```

### [转换为bean的List](https://www.hutool.cn/docs/#/json/JSONArray?id=转换为bean的list)

先定义一个Bean

```java
@Data
static class User {
    private Integer id;
    private String name;
}
String jsonArr = "[{\"id\":111,\"name\":\"test1\"},{\"id\":112,\"name\":\"test2\"}]";
JSONArray array = JSONUtil.parseArray(jsonArr);

List<User> userList = JSONUtil.toList(array, User.class);

// 111
userList.get(0).getId();
```

### [转换为Dict的List](https://www.hutool.cn/docs/#/json/JSONArray?id=转换为dict的list)

Dict是Hutool定义的特殊Map，提供了以字符串为key的Map功能，并提供getXXX方法，转换也类似：

```java
String jsonArr = "[{\"id\":111,\"name\":\"test1\"},{\"id\":112,\"name\":\"test2\"}]";
JSONArray array = JSONUtil.parseArray(jsonArr);

List<Dict> list = JSONUtil.toList(array, Dict.class);

// 111
list.get(0).getInt("id");
```

### [转换为数组](https://www.hutool.cn/docs/#/json/JSONArray?id=转换为数组)

```java
String jsonArr = "[{\"id\":111,\"name\":\"test1\"},{\"id\":112,\"name\":\"test2\"}]";
JSONArray array = JSONUtil.parseArray(jsonArr);

User[] list = array.toArray(new User[0]);
```

### [JSON路径](https://www.hutool.cn/docs/#/json/JSONArray?id=json路径)

如果JSON的层级特别深，那么获取某个值就变得非常麻烦，代码也很臃肿，Hutool提供了`getByPath`方法可以通过表达式获取JSON中的值。

```java
String jsonStr = "[{\"id\": \"1\",\"name\": \"a\"},{\"id\": \"2\",\"name\": \"b\"}]";
final JSONArray jsonArray = JSONUtil.parseArray(jsonStr);

// b
jsonArray.getByPath("[1].name");
```

# 加密解密工具-SecureUtil

## [介绍](https://www.hutool.cn/docs/#/crypto/加密解密工具-SecureUtil?id=介绍)

`SecureUtil`主要针对常用加密算法构建快捷方式，还有提供一些密钥生成的快捷工具方法。

## [方法介绍](https://www.hutool.cn/docs/#/crypto/加密解密工具-SecureUtil?id=方法介绍)

### [对称加密](https://www.hutool.cn/docs/#/crypto/加密解密工具-SecureUtil?id=对称加密)

- `SecureUtil.aes`
- `SecureUtil.des`

### [摘要算法](https://www.hutool.cn/docs/#/crypto/加密解密工具-SecureUtil?id=摘要算法)

- `SecureUtil.md5`
- `SecureUtil.sha1`
- `SecureUtil.hmac`
- `SecureUtil.hmacMd5`
- `SecureUtil.hmacSha1`

### [非对称加密](https://www.hutool.cn/docs/#/crypto/加密解密工具-SecureUtil?id=非对称加密)

- `SecureUtil.rsa`
- `SecureUtil.dsa`

### [UUID](https://www.hutool.cn/docs/#/crypto/加密解密工具-SecureUtil?id=uuid)

- `SecureUtil.simpleUUID` 方法提供无“-”的UUID

### [密钥生成](https://www.hutool.cn/docs/#/crypto/加密解密工具-SecureUtil?id=密钥生成)

- `SecureUtil.generateKey` 针对对称加密生成密钥
- `SecureUtil.generateKeyPair` 生成密钥对（用于非对称加密）
- `SecureUtil.generateSignature` 生成签名（用于非对称加密）

其它方法为针对特定加密方法的一些密钥生成和签名相关方法，详细请参阅API文档。



# 对称加密-SymmetricCrypto

## [介绍](https://www.hutool.cn/docs/#/crypto/对称加密-SymmetricCrypto?id=介绍)

对称加密(也叫私钥加密)指加密和解密使用相同密钥的加密算法。有时又叫传统密码算法，就是加密密钥能够从解密密钥中推算出来，同时解密密钥也可以从加密密钥中推算出来。而在大多数的对称算法中，加密密钥和解密密钥是相同的，所以也称这种加密算法为秘密密钥算法或单密钥算法。它要求发送方和接收方在安全通信之前，商定一个密钥。对称算法的安全性依赖于密钥，泄漏密钥就意味着任何人都可以对他们发送或接收的消息解密，所以密钥的保密性对通信的安全性至关重要。

对于对称加密，封装了JDK的，具体介绍见：https://docs.oracle.com/javase/7/docs/technotes/guides/security/StandardNames.html#KeyGenerator：

- AES (默认`AES/ECB/PKCS5Padding`)
- ARCFOUR
- Blowfish
- DES (默认`DES/ECB/PKCS5Padding`)
- DESede
- RC2
- PBEWithMD5AndDES
- PBEWithSHA1AndDESede
- PBEWithSHA1AndRC2_40

## [使用](https://www.hutool.cn/docs/#/crypto/对称加密-SymmetricCrypto?id=使用)

### [通用使用](https://www.hutool.cn/docs/#/crypto/对称加密-SymmetricCrypto?id=通用使用)

以AES算法为例：

```java
String content = "test中文";

//随机生成密钥
byte[] key = SecureUtil.generateKey(SymmetricAlgorithm.AES.getValue()).getEncoded();

//构建
SymmetricCrypto aes = new SymmetricCrypto(SymmetricAlgorithm.AES, key);

//加密
byte[] encrypt = aes.encrypt(content);
//解密
byte[] decrypt = aes.decrypt(encrypt);

//加密为16进制表示
String encryptHex = aes.encryptHex(content);
//解密为字符串
String decryptStr = aes.decryptStr(encryptHex, CharsetUtil.CHARSET_UTF_8);
```

### [DESede实现](https://www.hutool.cn/docs/#/crypto/对称加密-SymmetricCrypto?id=desede实现)

```java
String content = "test中文";

byte[] key = SecureUtil.generateKey(SymmetricAlgorithm.DESede.getValue()).getEncoded();

SymmetricCrypto des = new SymmetricCrypto(SymmetricAlgorithm.DESede, key);

//加密
byte[] encrypt = des.encrypt(content);
//解密
byte[] decrypt = des.decrypt(encrypt);

//加密为16进制字符串（Hex表示）
String encryptHex = des.encryptHex(content);
//解密为字符串
String decryptStr = des.decryptStr(encryptHex);
```

### [AES封装](https://www.hutool.cn/docs/#/crypto/对称加密-SymmetricCrypto?id=aes封装)

AES全称高级加密标准（英语：Advanced Encryption Standard，缩写：AES），在密码学中又称Rijndael加密法。

对于Java中AES的默认模式是：`AES/ECB/PKCS5Padding`，如果使用CryptoJS，请调整为：padding: CryptoJS.pad.Pkcs7

1. 快速构建

```java
String content = "test中文";

// 随机生成密钥
byte[] key = SecureUtil.generateKey(SymmetricAlgorithm.AES.getValue()).getEncoded();

// 构建
AES aes = SecureUtil.aes(key);

// 加密
byte[] encrypt = aes.encrypt(content);
// 解密
byte[] decrypt = aes.decrypt(encrypt);

// 加密为16进制表示
String encryptHex = aes.encryptHex(content);
// 解密为字符串
String decryptStr = aes.decryptStr(encryptHex, CharsetUtil.CHARSET_UTF_8);
```

1. 自定义内置模式和偏移

```java
AES aes = new AES(Mode.CTS, Padding.PKCS5Padding, "0CoJUm6Qyw8W8jud".getBytes(), "0102030405060708".getBytes());
```

1. `PKCS7Padding`模式

由于IOS等移动端对AES加密有要求，必须为`PKCS7Padding`模式，但JDK本身并不提供这种模式，因此想要支持必须做一些工作。

首先引入bc库：

```xml
<dependency>
    <groupId>org.bouncycastle</groupId>
    <artifactId>bcprov-jdk15to18</artifactId>
    <version>1.68</version>
</dependency>
AES aes = new AES("CBC", "PKCS7Padding",
  // 密钥，可以自定义
  "0123456789ABHAEQ".getBytes(),
  // iv加盐，按照实际需求添加
  "DYgjCEIMVrj2W9xN".getBytes());

// 加密为16进制表示
String encryptHex = aes.encryptHex(content);
// 解密
String decryptStr = aes.decryptStr(encryptHex);
```

### [DES封装](https://www.hutool.cn/docs/#/crypto/对称加密-SymmetricCrypto?id=des封装)

DES全称为Data Encryption Standard，即数据加密标准，是一种使用密钥加密的块算法，Java中默认实现为：`DES/CBC/PKCS5Padding`

DES使用方法与AES一致，构建方法为：

1. 快速构建

```java
byte[] key = SecureUtil.generateKey(SymmetricAlgorithm.DES.getValue()).getEncoded();
DES des = SecureUtil.des(key);
```

1. 自定义模式和偏移

```java
DES des = new DES(Mode.CTS, Padding.PKCS5Padding, "0CoJUm6Qyw8W8jud".getBytes(), "01020304".getBytes());
```

### [SM4](https://www.hutool.cn/docs/#/crypto/对称加密-SymmetricCrypto?id=sm4)

在4.2.1之后，Hutool借助Bouncy Castle库可以支持国密算法，以SM4为例：

我们首先需要引入Bouncy Castle库：

```xml
<dependency>
  <groupId>org.bouncycastle</groupId>
  <artifactId>bcpkix-jdk15on</artifactId>
  <version>1.60</version>
</dependency>
```

然后可以调用SM4算法，调用方法与其它算法一致：

```java
String content = "test中文";
SymmetricCrypto sm4 = new SymmetricCrypto("SM4");

String encryptHex = sm4.encryptHex(content);
String decryptStr = sm4.decryptStr(encryptHex, CharsetUtil.CHARSET_UTF_8);//test中文
```

同样我们可以指定加密模式和偏移：

```java
String content = "test中文";
SymmetricCrypto sm4 = new SymmetricCrypto("SM4/ECB/PKCS5Padding");

String encryptHex = sm4.encryptHex(content);
String decryptStr = sm4.decryptStr(encryptHex, CharsetUtil.CHARSET_UTF_8);//test中文
```

# 非对称加密-AsymmetricCrypto

## [介绍](https://www.hutool.cn/docs/#/crypto/非对称加密-AsymmetricCrypto?id=介绍)

对于非对称加密，最常用的就是RSA和DSA，在Hutool中使用`AsymmetricCrypto`对象来负责加密解密。

非对称加密有公钥和私钥两个概念，私钥自己拥有，不能给别人，公钥公开。根据应用的不同，我们可以选择使用不同的密钥加密：

1. 签名：使用私钥加密，公钥解密。用于让所有公钥所有者验证私钥所有者的身份并且用来防止私钥所有者发布的内容被篡改，但是不用来保证内容不被他人获得。
2. 加密：用公钥加密，私钥解密。用于向公钥所有者发布信息,这个信息可能被他人篡改,但是无法被他人获得。

Hutool封装了JDK的，详细见https://docs.oracle.com/javase/7/docs/technotes/guides/security/StandardNames.html#KeyPairGenerator：

- RSA
- RSA_ECB_PKCS1（RSA/ECB/PKCS1Padding）
- RSA_None（RSA/None/NoPadding）
- ECIES（需要Bouncy Castle库）

## [使用](https://www.hutool.cn/docs/#/crypto/非对称加密-AsymmetricCrypto?id=使用)

在非对称加密中，我们可以通过`AsymmetricCrypto(AsymmetricAlgorithm algorithm)`构造方法，通过传入不同的算法枚举，获得其加密解密器。

当然，为了方便，我们针对最常用的RSA算法构建了单独的对象：`RSA`。

### [基本使用](https://www.hutool.cn/docs/#/crypto/非对称加密-AsymmetricCrypto?id=基本使用)

我们以RSA为例，介绍使用RSA加密和解密 在构建RSA对象时，可以传入公钥或私钥，当使用无参构造方法时，Hutool将自动生成随机的公钥私钥密钥对：

```java
RSA rsa = new RSA();

//获得私钥
rsa.getPrivateKey()
rsa.getPrivateKeyBase64()
//获得公钥
rsa.getPublicKey()
rsa.getPublicKeyBase64()

//公钥加密，私钥解密
byte[] encrypt = rsa.encrypt(StrUtil.bytes("我是一段测试aaaa", CharsetUtil.CHARSET_UTF_8), KeyType.PublicKey);
byte[] decrypt = rsa.decrypt(encrypt, KeyType.PrivateKey);

//Junit单元测试
//Assert.assertEquals("我是一段测试aaaa", StrUtil.str(decrypt, CharsetUtil.CHARSET_UTF_8));

//私钥加密，公钥解密
byte[] encrypt2 = rsa.encrypt(StrUtil.bytes("我是一段测试aaaa", CharsetUtil.CHARSET_UTF_8), KeyType.PrivateKey);
byte[] decrypt2 = rsa.decrypt(encrypt2, KeyType.PublicKey);

//Junit单元测试
//Assert.assertEquals("我是一段测试aaaa", StrUtil.str(decrypt2, CharsetUtil.CHARSET_UTF_8));
```

> 对于加密和解密可以完全分开，对于RSA对象，如果只使用公钥或私钥，另一个参数可以为`null`

### [自助生成密钥对](https://www.hutool.cn/docs/#/crypto/非对称加密-AsymmetricCrypto?id=自助生成密钥对)

有时候我们想自助生成密钥对可以：

```java
KeyPair pair = SecureUtil.generateKeyPair("RSA");
pair.getPrivate();
pair.getPublic();
```

自助生成的密钥对是byte[]形式，我们可以使用`Base64.encode`方法转为Base64，便于存储为文本。

当然，如果使用`RSA`对象，也可以使用`encryptStr`和`decryptStr`加密解密为字符串。

## [案例](https://www.hutool.cn/docs/#/crypto/非对称加密-AsymmetricCrypto?id=案例)

### [案例一：](https://www.hutool.cn/docs/#/crypto/非对称加密-AsymmetricCrypto?id=案例一：)

已知私钥和密文，如何解密密文？

```java
String PRIVATE_KEY = "MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAIL7pbQ+5KKGYRhw7jE31hmA"
        + "f8Q60ybd+xZuRmuO5kOFBRqXGxKTQ9TfQI+aMW+0lw/kibKzaD/EKV91107xE384qOy6IcuBfaR5lv39OcoqNZ"
        + "5l+Dah5ABGnVkBP9fKOFhPgghBknTRo0/rZFGI6Q1UHXb+4atP++LNFlDymJcPAgMBAAECgYBammGb1alndta"
        + "xBmTtLLdveoBmp14p04D8mhkiC33iFKBcLUvvxGg2Vpuc+cbagyu/NZG+R/WDrlgEDUp6861M5BeFN0L9O4hz"
        + "GAEn8xyTE96f8sh4VlRmBOvVdwZqRO+ilkOM96+KL88A9RKdp8V2tna7TM6oI3LHDyf/JBoXaQJBAMcVN7fKlYP"
        + "Skzfh/yZzW2fmC0ZNg/qaW8Oa/wfDxlWjgnS0p/EKWZ8BxjR/d199L3i/KMaGdfpaWbYZLvYENqUCQQCobjsuCW"
        + "nlZhcWajjzpsSuy8/bICVEpUax1fUZ58Mq69CQXfaZemD9Ar4omzuEAAs2/uee3kt3AvCBaeq05NyjAkBme8SwB0iK"
        + "kLcaeGuJlq7CQIkjSrobIqUEf+CzVZPe+AorG+isS+Cw2w/2bHu+G0p5xSYvdH59P0+ZT0N+f9LFAkA6v3Ae56OrI"
        + "wfMhrJksfeKbIaMjNLS9b8JynIaXg9iCiyOHmgkMl5gAbPoH/ULXqSKwzBw5mJ2GW1gBlyaSfV3AkA/RJC+adIjsRGg"
        + "JOkiRjSmPpGv3FOhl9fsBPjupZBEIuoMWOC8GXK/73DHxwmfNmN7C9+sIi4RBcjEeQ5F5FHZ";

RSA rsa = new RSA(PRIVATE_KEY, null);

String a = "2707F9FD4288CEF302C972058712F24A5F3EC62C5A14AD2FC59DAB93503AA0FA17113A020EE4EA35EB53F"
        + "75F36564BA1DABAA20F3B90FD39315C30E68FE8A1803B36C29029B23EB612C06ACF3A34BE815074F5EB5AA3A"
        + "C0C8832EC42DA725B4E1C38EF4EA1B85904F8B10B2D62EA782B813229F9090E6F7394E42E6F44494BB8";

byte[] aByte = HexUtil.decodeHex(a);
byte[] decrypt = rsa.decrypt(aByte, KeyType.PrivateKey);

//Junit单元测试
//Assert.assertEquals("虎头闯杭州,多抬头看天,切勿只管种地", StrUtil.str(decrypt, CharsetUtil.CHARSET_UTF_8));
```

## [其它算法](https://www.hutool.cn/docs/#/crypto/非对称加密-AsymmetricCrypto?id=其它算法)

### [ECIES](https://www.hutool.cn/docs/#/crypto/非对称加密-AsymmetricCrypto?id=ecies)

ECIES全称集成加密方案（elliptic curve integrate encrypt scheme）

Hutool借助`Bouncy Castle`库可以支持`ECIES`算法：

我们首先需要引入Bouncy Castle库：

```xml
<dependency>
  <groupId>org.bouncycastle</groupId>
  <artifactId>bcprov-jdk15to18</artifactId>
  <version>1.66</version>
</dependency>
final ECIES ecies = new ECIES();
String textBase = "我是一段特别长的测试";
StringBuilder text = new StringBuilder();
for (int i = 0; i < 10; i++) {
    text.append(textBase);
}

// 公钥加密，私钥解密
String encryptStr = ecies.encryptBase64(text.toString(), KeyType.PublicKey);
String decryptStr = StrUtil.utf8Str(ecies.decrypt(encryptStr, KeyType.PrivateKey));
```

# 摘要加密-Digester

## [介绍](https://www.hutool.cn/docs/#/crypto/摘要加密-Digester?id=介绍)

### [摘要算法介绍](https://www.hutool.cn/docs/#/crypto/摘要加密-Digester?id=摘要算法介绍)

摘要算法是一种能产生特殊输出格式的算法，这种算法的特点是：无论用户输入什么长度的原始数据，经过计算后输出的密文都是固定长度的，这种算法的原理是根据一定的运算规则对原数据进行某种形式的提取，这种提取就是摘要，被摘要的数据内容与原数据有密切联系，只要原数据稍有改变，输出的“摘要”便完全不同，因此，基于这种原理的算法便能对数据完整性提供较为健全的保障。

但是，由于输出的密文是提取原数据经过处理的定长值，所以它已经不能还原为原数据，即消息摘要算法是不可逆的，理论上无法通过反向运算取得原数据内容，因此它通常只能被用来做数据完整性验证。

## [Hutool支持的摘要算法类型](https://www.hutool.cn/docs/#/crypto/摘要加密-Digester?id=hutool支持的摘要算法类型)

在不引入第三方库的情况下，JDK支持有限的摘要算法：

详细见：https://docs.oracle.com/javase/7/docs/technotes/guides/security/StandardNames.html#MessageDigest

### [摘要算法](https://www.hutool.cn/docs/#/crypto/摘要加密-Digester?id=摘要算法)

- MD2
- MD5
- SHA-1
- SHA-256
- SHA-384
- SHA-512

## [使用](https://www.hutool.cn/docs/#/crypto/摘要加密-Digester?id=使用)

### [Digester](https://www.hutool.cn/docs/#/crypto/摘要加密-Digester?id=digester)

以MD5为例：

```java
Digester md5 = new Digester(DigestAlgorithm.MD5);

// 5393554e94bf0eb6436f240a4fd71282
String digestHex = md5.digestHex(testStr);
```

当然，做为最为常用的方法，MD5等方法被封装为工具方法在`DigestUtil`中，以上代码可以进一步简化为：

```java
// 5393554e94bf0eb6436f240a4fd71282
String md5Hex1 = DigestUtil.md5Hex(testStr);
```

## [更多摘要算法](https://www.hutool.cn/docs/#/crypto/摘要加密-Digester?id=更多摘要算法)

### [SM3](https://www.hutool.cn/docs/#/crypto/摘要加密-Digester?id=sm3)

在`4.2.1`之后，Hutool借助`Bouncy Castle`库可以支持国密算法，以SM3为例：

我们首先需要引入Bouncy Castle库：

```xml
<dependency>
  <groupId>org.bouncycastle</groupId>
  <artifactId>bcprov-jdk15to18</artifactId>
  <version>1.66</version>
</dependency>
```

然后可以调用SM3算法，调用方法与其它摘要算法一致：

```java
Digester digester = DigestUtil.digester("sm3");

//136ce3c86e4ed909b76082055a61586af20b4dab674732ebd4b599eef080c9be
String digestHex = digester.digestHex("aaaaa");
```

> Java标准库的`java.security`包提供了一种标准机制，允许第三方提供商无缝接入。当引入`Bouncy Castle`库的jar后，Hutool会自动检测并接入。具体方法可见`SecureUtil.createMessageDigest`。

# 消息认证码算法-HMac

## [介绍](https://www.hutool.cn/docs/#/crypto/消息认证码算法-HMac?id=介绍)

### [HMAC介绍](https://www.hutool.cn/docs/#/crypto/消息认证码算法-HMac?id=hmac介绍)

HMAC，全称为“Hash Message Authentication Code”，中文名“散列消息鉴别码”，主要是利用哈希算法，以一个密钥和一个消息为输入，生成一个消息摘要作为输出。一般的，消息鉴别码用于验证传输于两个共 同享有一个密钥的单位之间的消息。HMAC 可以与任何迭代散列函数捆绑使用。MD5 和 SHA-1 就是这种散列函数。HMAC 还可以使用一个用于计算和确认消息鉴别值的密钥。

## [Hutool支持的算法类型](https://www.hutool.cn/docs/#/crypto/消息认证码算法-HMac?id=hutool支持的算法类型)

### [Hmac算法](https://www.hutool.cn/docs/#/crypto/消息认证码算法-HMac?id=hmac算法)

在不引入第三方库的情况下，JDK支持有限的摘要算法：

- HmacMD5
- HmacSHA1
- HmacSHA256
- HmacSHA384
- HmacSHA512

## [使用](https://www.hutool.cn/docs/#/crypto/消息认证码算法-HMac?id=使用)

### [HMac](https://www.hutool.cn/docs/#/crypto/消息认证码算法-HMac?id=hmac)

以HmacMD5为例：

```java
String testStr = "test中文";

// 此处密钥如果有非ASCII字符，考虑编码
byte[] key = "password".getBytes();
HMac mac = new HMac(HmacAlgorithm.HmacMD5, key);

// b977f4b13f93f549e06140971bded384
String macHex1 = mac.digestHex(testStr);
```

## [更多HMac算法](https://www.hutool.cn/docs/#/crypto/消息认证码算法-HMac?id=更多hmac算法)

与摘要算法类似，通过加入`Bouncy Castle`库可以调用更多算法，使用也类似：

```java
HMac mac = new HMac("XXXX", key);
```

# 签名和验证-Sign

## [介绍](https://www.hutool.cn/docs/#/crypto/签名和验证-Sign?id=介绍)

Hutool针对`java.security.Signature`做了简化包装，包装类为：`Sign`，用于生成签名和签名验证。

对于签名算法，Hutool封装了JDK的Signature，具体介绍见：https://docs.oracle.com/javase/7/docs/technotes/guides/security/StandardNames.html#Signature：

```java
// The RSA signature algorithm
NONEwithRSA

// The MD2/MD5 with RSA Encryption signature algorithm
MD2withRSA
MD5withRSA

// The signature algorithm with SHA-* and the RSA
SHA1withRSA
SHA256withRSA
SHA384withRSA
SHA512withRSA

// The Digital Signature Algorithm
NONEwithDSA

// The DSA with SHA-1 signature algorithm
SHA1withDSA

// The ECDSA signature algorithms
NONEwithECDSA
SHA1withECDSA
SHA256withECDSA
SHA384withECDSA
SHA512withECDSA
```

## [使用](https://www.hutool.cn/docs/#/crypto/签名和验证-Sign?id=使用)

```java
byte[] data = "我是一段测试字符串".getBytes();
Sign sign = SecureUtil.sign(SignAlgorithm.MD5withRSA);
//签名
byte[] signed = sign.sign(data);
//验证签名
boolean verify = sign.verify(data, signed);
```

# 国密算法工具-SmUtil

## [介绍](https://www.hutool.cn/docs/#/crypto/国密算法工具-SmUtil?id=介绍)

Hutool针对`Bouncy Castle`做了简化包装，用于实现国密算法中的SM2、SM3、SM4。

国密算法工具封装包括：

- 非对称加密和签名：SM2
- 摘要签名算法：SM3
- 对称加密：SM4

国密算法需要引入`Bouncy Castle`库的依赖。

## [使用](https://www.hutool.cn/docs/#/crypto/国密算法工具-SmUtil?id=使用)

### [引入`Bouncy Castle`依赖](https://www.hutool.cn/docs/#/crypto/国密算法工具-SmUtil?id=引入bouncy-castle依赖)

```xml
<dependency>
  <groupId>org.bouncycastle</groupId>
  <artifactId>bcprov-jdk15to18</artifactId>
  <version>1.69</version>
</dependency>
```

> 说明 `bcprov-jdk15to18`的版本请前往Maven中央库搜索，查找对应JDK的最新版本。

### [非对称加密SM2](https://www.hutool.cn/docs/#/crypto/国密算法工具-SmUtil?id=非对称加密sm2)

1. 使用随机生成的密钥对加密或解密

```java
String text = "我是一段测试aaaa";

SM2 sm2 = SmUtil.sm2();
// 公钥加密，私钥解密
String encryptStr = sm2.encryptBcd(text, KeyType.PublicKey);
String decryptStr = StrUtil.utf8Str(sm2.decryptFromBcd(encryptStr, KeyType.PrivateKey));
```

1. 使用自定义密钥对加密或解密

```java
String text = "我是一段测试aaaa";

KeyPair pair = SecureUtil.generateKeyPair("SM2");
byte[] privateKey = pair.getPrivate().getEncoded();
byte[] publicKey = pair.getPublic().getEncoded();

SM2 sm2 = SmUtil.sm2(privateKey, publicKey);
// 公钥加密，私钥解密
String encryptStr = sm2.encryptBcd(text, KeyType.PublicKey);
String decryptStr = StrUtil.utf8Str(sm2.decryptFromBcd(encryptStr, KeyType.PrivateKey));
```

1. SM2签名和验签

```java
String content = "我是Hanley.";
final SM2 sm2 = SmUtil.sm2();
String sign = sm2.signHex(HexUtil.encodeHexStr(content));

// true
boolean verify = sm2.verifyHex(HexUtil.encodeHexStr(content), sign);
```

当然，也可以自定义密钥对：

```java
String content = "我是Hanley.";
KeyPair pair = SecureUtil.generateKeyPair("SM2");
final SM2 sm2 = new SM2(pair.getPrivate(), pair.getPublic());

byte[] sign = sm2.sign(content.getBytes());

// true
boolean verify = sm2.verify(content.getBytes(), sign);
```

1. 使用SM2曲线点构建SM2

使用曲线点构建中的点生成和验证见：https://i.goto327.top/CryptTools/SM2.aspx?tdsourcetag=s_pctim_aiomsg

```java
String privateKeyHex = "FAB8BBE670FAE338C9E9382B9FB6485225C11A3ECB84C938F10F20A93B6215F0";
String x = "9EF573019D9A03B16B0BE44FC8A5B4E8E098F56034C97B312282DD0B4810AFC3";
String y = "CC759673ED0FC9B9DC7E6FA38F0E2B121E02654BF37EA6B63FAF2A0D6013EADF";

// 数据和ID此处使用16进制表示
String data = "434477813974bf58f94bcf760833c2b40f77a5fc360485b0b9ed1bd9682edb45";
String id = "31323334353637383132333435363738";

final SM2 sm2 = new SM2(privateKeyHex, x, y);
// 生成的签名是64位
sm2.usePlainEncoding();

final String sign = sm2.signHex(data, id);
// true
boolean verify = sm2.verifyHex(data, sign)
```

1. 使用私钥D值签名

```java
//需要签名的明文,得到明文对应的字节数组
byte[] dataBytes = "我是一段测试aaaa".getBytes();
//指定的私钥
String privateKeyHex = "1ebf8b341c695ee456fd1a41b82645724bc25d79935437d30e7e4b0a554baa5e";

// 此构造从5.5.9开始可使用
final SM2 sm2 = new SM2(privateKeyHex, null, null);
sm2.usePlainEncoding();
byte[] sign = sm2.sign(dataBytes, null);
```

1. 使用公钥Q值验证签名

```java
//指定的公钥
String publicKeyHex ="04db9629dd33ba568e9507add5df6587a0998361a03d3321948b448c653c2c1b7056434884ab6f3d1c529501f166a336e86f045cea10dffe58aa82ea13d725363";
//需要加密的明文,得到明文对应的字节数组
byte[] dataBytes = "我是一段测试aaaa".getBytes();
//签名值
String signHex ="2881346e038d2ed706ccdd025f2b1dafa7377d5cf090134b98756fafe084dddbcdba0ab00b5348ed48025195af3f1dda29e819bb66aa9d4d088050ff148482a";

final SM2 sm2 = new SM2(null, ECKeyUtil.toSm2PublicParams(publicKeyHex));
sm2.usePlainEncoding();

// true
boolean verify = sm2.verify(dataBytes, HexUtil.decodeHex(signHex));
```

1. 其他格式的密钥

在SM2算法中，密钥的格式分以下几种：

私钥：

- D值 一般为硬件直接生成的值
- PKCS#8 JDK默认生成的私钥格式
- PKCS#1 一般为OpenSSL生成的的EC密钥格式

公钥：

- Q值 一般为硬件直接生成的值
- X.509 JDK默认生成的公钥格式
- PKCS#1 一般为OpenSSL生成的的EC密钥格式

在新版本的Hutool中，SM2的构造方法对这几类的密钥都做了兼容，即用户无需关注密钥类型：

### [摘要加密算法SM3](https://www.hutool.cn/docs/#/crypto/国密算法工具-SmUtil?id=摘要加密算法sm3)

```java
//结果为：136ce3c86e4ed909b76082055a61586af20b4dab674732ebd4b599eef080c9be
String digestHex = SmUtil.sm3("aaaaa");
```

### [对称加密SM4](https://www.hutool.cn/docs/#/crypto/国密算法工具-SmUtil?id=对称加密sm4)

```java
String content = "test中文";
SymmetricCrypto sm4 = SmUtil.sm4();

String encryptHex = sm4.encryptHex(content);
String decryptStr = sm4.decryptStr(encryptHex, CharsetUtil.CHARSET_UTF_8);
```

# DFA查找

## [使用](https://www.hutool.cn/docs/#/dfa/DFA查找?id=使用)

### [1. 构建关键词树](https://www.hutool.cn/docs/#/dfa/DFA查找?id=_1-构建关键词树)

```java
WordTree tree = new WordTree();
tree.addWord("大");
tree.addWord("大土豆");
tree.addWord("土豆");
tree.addWord("刚出锅");
tree.addWord("出锅");
```

### [2. 查找关键词](https://www.hutool.cn/docs/#/dfa/DFA查找?id=_2-查找关键词)

```java
//正文
String text = "我有一颗大土豆，刚出锅的";
```

1. 情况一：标准匹配，匹配到最短关键词，并跳过已经匹配的关键词

```java
// 匹配到【大】，就不再继续匹配了，因此【大土豆】不匹配
// 匹配到【刚出锅】，就跳过这三个字了，因此【出锅】不匹配（由于刚首先被匹配，因此长的被匹配，最短匹配只针对第一个字相同选最短）
List<String> matchAll = tree.matchAll(text, -1, false, false);
Assert.assertEquals(matchAll.toString(), "[大, 土豆, 刚出锅]");
```

1. 情况二：匹配到最短关键词，不跳过已经匹配的关键词

```java
// 【大】被匹配，最短匹配原则【大土豆】被跳过，【土豆继续被匹配】
// 【刚出锅】被匹配，由于不跳过已经匹配的词，【出锅】被匹配
matchAll = tree.matchAll(text, -1, true, false);
Assert.assertEquals(matchAll.toString(), "[大, 土豆, 刚出锅, 出锅]");
```

1. 情况三：匹配到最长关键词，跳过已经匹配的关键词

```java
// 匹配到【大】，由于到最长匹配，因此【大土豆】接着被匹配
// 由于【大土豆】被匹配，【土豆】被跳过，由于【刚出锅】被匹配，【出锅】被跳过
matchAll = tree.matchAll(text, -1, false, true);
Assert.assertEquals(matchAll.toString(), "[大, 大土豆, 刚出锅]");
```

1. 情况四：匹配到最长关键词，不跳过已经匹配的关键词（最全关键词）

```java
// 匹配到【大】，由于到最长匹配，因此【大土豆】接着被匹配，由于不跳过已经匹配的关键词，土豆继续被匹配
// 【刚出锅】被匹配，由于不跳过已经匹配的词，【出锅】被匹配
matchAll = tree.matchAll(text, -1, true, true);
Assert.assertEquals(matchAll.toString(), "[大, 大土豆, 土豆, 刚出锅, 出锅]");
```

> 除了`matchAll`方法，`WordTree`还提供了`match`和`isMatch`两个方法，这两个方法只会查找第一个匹配的结果，这样一旦找到第一个关键字，就会停止继续匹配，大大提高了匹配效率。

## [针对特殊字符](https://www.hutool.cn/docs/#/dfa/DFA查找?id=针对特殊字符)

有时候，正文中的关键字常常包含特殊字符，比如:"〓关键☆字"，针对这种情况，Hutool提供了`StopChar`类，专门针对特殊字符做跳过处理，这个过程是在`match`方法或`matchAll`方法执行的时候自动去掉特殊字符。

# 数据库简单操作-Db

## [由来](https://www.hutool.cn/docs/#/db/数据库简单操作-Db?id=由来)

数据库操作不外乎四门功课：增删改查，在Java的世界中，由于JDBC的存在，这项工作变得简单易用，但是也并没有做到使用上的简化。于是出现了JPA（Hibernate）、MyBatis、Jfinal、BeetlSQL等解决框架，或解决多数据库差异问题，或解决SQL维护问题。而Hutool对JDBC的封装，多数为在小型项目中对数据处理的简化，尤其只涉及单表操作时。OK，废话不多，来个Demo感受下。

## [使用](https://www.hutool.cn/docs/#/db/数据库简单操作-Db?id=使用)

我们以MySQL为例

### [1、添加配置文件](https://www.hutool.cn/docs/#/db/数据库简单操作-Db?id=_1、添加配置文件)

Maven项目中在`src/main/resources`目录下添加`db.setting`文件（非Maven项目添加到ClassPath中即可）：

```java
## db.setting文件

url = jdbc:mysql://localhost:3306/test
user = root
pass = 123456

## 可选配置
# 是否在日志中显示执行的SQL
showSql = true
# 是否格式化显示的SQL
formatSql = false
# 是否显示SQL参数
showParams = true
# 打印SQL的日志等级，默认debug，可以是info、warn、error
sqlLevel = debug
```

### [2、引入MySQL JDBC驱动jar](https://www.hutool.cn/docs/#/db/数据库简单操作-Db?id=_2、引入mysql-jdbc驱动jar)

```xml
<!--mysql数据库驱动 -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>${mysql.version}</version>
</dependency>
```

> 注意 此处不定义MySQL版本，请参考官方文档使用匹配的驱动包版本。

### [3、增删改查](https://www.hutool.cn/docs/#/db/数据库简单操作-Db?id=_3、增删改查)

#### [增](https://www.hutool.cn/docs/#/db/数据库简单操作-Db?id=增)

```java
Db.use().insert(
    Entity.create("user")
    .set("name", "unitTestUser")
    .set("age", 66)
);
```

插入数据并返回自增主键：

```java
Db.use().insertForGeneratedKey(
    Entity.create("user")
    .set("name", "unitTestUser")
    .set("age", 66)
);
```

#### [删](https://www.hutool.cn/docs/#/db/数据库简单操作-Db?id=删)

```java
Db.use().del(
    Entity.create("user").set("name", "unitTestUser")//where条件
);
```

> 注意 考虑安全性，使用del方法时不允许使用空的where条件，防止全表删除，如有相关操作需要，请调用execute方法执行SQL实现。

#### [改](https://www.hutool.cn/docs/#/db/数据库简单操作-Db?id=改)

```java
Db.use().update(
    Entity.create().set("age", 88), //修改的数据
    Entity.create("user").set("name", "unitTestUser") //where条件
);
```

> 注意 条件语句除了可以用`=`精确匹配外，也可以范围条件匹配，例如表示 `age < 12` 可以这样构造Entity：`Entity.create("user").set("age", "< 12")`，但是通过Entity方式传入条件暂时不支持同字段多条件的情况。

#### [查](https://www.hutool.cn/docs/#/db/数据库简单操作-Db?id=查)

1. 查询全部字段

```java
//user为表名
Db.use().findAll("user");
```

1. 条件查询

```java
Db.use().findAll(Entity.create("user").set("name", "unitTestUser"));
```

1. 模糊查询

```java
Db.use().findLike("user", "name", "Test", LikeType.Contains);
```

或者：

```java
List<Entity> find = Db.use().find(Entity.create("user").set("name", "like 王%"));
```

1. 分页查询

```java
//Page对象通过传入页码和每页条目数达到分页目的
PageResult<Entity> result = Db.use().page(Entity.create("user").set("age", "> 30"), new Page(10, 20));
```

1. 执行SQL语句

```java
//查询
List<Entity> result = Db.use().query("select * from user where age < ?", 3);
//模糊查询
List<Entity> result = Db.use().query("select * from user where name like ?", "王%");
//新增
Db.use().execute("insert into user values (?, ?, ?)", "张三", 17, 1);
//删除
Db.use().execute("delete from user where name = ?", "张三");
//更新
Db.use().execute("update user set age = ? where name = ?", 3, "张三");
```

1. 事务

```java
Db.use().tx(new TxFunc() {
    @Override
    public void call(Db db) throws SQLException {
        db.insert(Entity.create("user").set("name", "unitTestUser"));
        db.update(Entity.create().set("age", 79), Entity.create("user").set("name", "unitTestUser"));
    }
});
```

JDK8中可以用lambda表达式（since：5.x）：

```java
Db.use().tx(db -> {
    db.insert(Entity.create("user").set("name", "unitTestUser2"));
    db.update(Entity.create().set("age", 79), Entity.create("user").set("name", "unitTestUser2"));
});
```

1. 支持命名占位符的SQL执行

有时候使用"?"占位符比较繁琐，且在复杂SQL中很容易出错，Hutool支持使用命名占位符来执行SQL。

```java
Map<String, Object> paramMap = MapUtil.builder("name1", (Object)"张三").put("age", 12).put("subName", "小豆豆").build();
Db.use().query("select * from table where id=@id and name = @name1 and nickName = @subName", paramMap);
```

在Hutool中，占位符支持以下几种形式：

- :name
- ?name
- @name

1. IN查询

我们在执行类似于`select * from user where id in 1,2,3`这类SQL的时候，Hutool封装如下：

```java
List<Entity> results = db.findAll(
    Entity.create("user")
        .set("id", "in 1,2,3"));
```

当然你也可以直接：

```java
List<Entity> results = db.findAll(
    Entity.create("user")
        .set("id", new long[]{1, 2, 3}));
```

# 支持事务的CRUD-Session

## [介绍](https://www.hutool.cn/docs/#/db/支持事务的CRUD-Session?id=介绍)

`Session`非常类似于`SqlRunner`，差别是`Session`对象中只有一个Connection，所有操作也是用这个Connection，便于事务操作，而`SqlRunner`每执行一个方法都要从`DataSource`中去要Connection。样例如下：

### [Session创建](https://www.hutool.cn/docs/#/db/支持事务的CRUD-Session?id=session创建)

与`SqlRunner`类似，`Session`也可以通过调用create

```java
//默认数据源
Session session = Session.create();

//自定义数据源（此处取test分组的数据源）
Session session = Session.create(DSFactory.get("test"));
```

### [事务CRUD](https://www.hutool.cn/docs/#/db/支持事务的CRUD-Session?id=事务crud)

`session.beginTransaction()`表示事务开始，调用后每次执行语句将不被提交，只有调用`commit`方法后才会合并提交，提交或者回滚后会恢复默认的自动提交模式。

1. 新增

```java
Entity entity = Entity.create(TABLE_NAME).set("字段1", "值").set("字段2", 2);
try {
    session.beginTransaction();
    // 增，生成SQL为 INSERT INTO `table_name` SET(`字段1`, `字段2`) VALUES(?,?)
    session.insert(entity);
    session.commit();
} catch (SQLException e) {
    session.quietRollback();
}
```

1. 更新

```java
Entity entity = Entity.create(TABLE_NAME).set("字段1", "值").set("字段2", 2);
Entity where = Entity.create(TABLE_NAME).set("条件1", "条件值");
try {
    session.beginTransaction();
    // 改，生成SQL为 UPDATE `table_name` SET `字段1` = ?, `字段2` = ? WHERE `条件1` = ?
    session.update(entity, where);
    session.commit();
} catch (SQLException e) {
    session.quietRollback();
}
```

1. 删除

```java
Entity where = Entity.create(TABLE_NAME).set("条件1", "条件值");
try {
    session.beginTransaction();
    // 删，生成SQL为 DELETE FROM `table_name` WHERE `条件1` = ?
    session.del(where);
    session.commit();
} catch (SQLException e) {
    session.quietRollback();
}
```

# 数据源配置db.setting样例

## [介绍](https://www.hutool.cn/docs/#/db/数据源配置db.setting样例?id=介绍)

DsFactory默认读取的配置文件是config/db.setting或db.setting，db.setting的配置包括两部分：基本连接信息和连接池配置信息。

基本连接信息所有连接池都支持，连接池配置信息根据不同的连接池，连接池配置是根据连接池相应的配置项移植而来。

## [基本配置样例](https://www.hutool.cn/docs/#/db/数据源配置db.setting样例?id=基本配置样例)

```
#------------------------------------------------------------------------------------------
## 基本配置信息
# JDBC URL，根据不同的数据库，使用相应的JDBC连接字符串
url = jdbc:mysql://<host>:<port>/<database_name>
# 用户名，此处也可以使用 user 代替
username = 用户名
# 密码，此处也可以使用 pass 代替
password = 密码
# JDBC驱动名，可选（Hutool会自动识别）
driver = com.mysql.jdbc.Driver

## 可选配置
# 是否在日志中显示执行的SQL
showSql = true
# 是否格式化显示的SQL
formatSql = false
# 是否显示SQL参数
showParams = true
# 打印SQL的日志等级，默认debug
sqlLevel = debug
#------------------------------------------------------------------------------------------
```

## [HikariCP](https://www.hutool.cn/docs/#/db/数据源配置db.setting样例?id=hikaricp)

```
## 连接池配置项
# 自动提交
autoCommit = true
# 等待连接池分配连接的最大时长（毫秒），超过这个时长还没可用的连接则发生SQLException， 缺省:30秒
connectionTimeout = 30000
# 一个连接idle状态的最大时长（毫秒），超时则被释放（retired），缺省:10分钟
idleTimeout = 600000
# 一个连接的生命时长（毫秒），超时而且没被使用则被释放（retired），缺省:30分钟，建议设置比数据库超时时长少30秒，参考MySQL wait_timeout参数（show variables like '%timeout%';）
maxLifetime = 1800000
# 获取连接前的测试SQL
connectionTestQuery = SELECT 1
# 最小闲置连接数
minimumIdle = 10
# 连接池中允许的最大连接数。缺省值：10；推荐的公式：((core_count * 2) + effective_spindle_count)
maximumPoolSize = 10
# 连接只读数据库时配置为true， 保证安全
readOnly = false
```

## [Druid](https://www.hutool.cn/docs/#/db/数据源配置db.setting样例?id=druid)

```
# 初始化时建立物理连接的个数。初始化发生在显示调用init方法，或者第一次getConnection时
initialSize = 0
# 最大连接池数量
maxActive = 8
# 最小连接池数量
minIdle = 0
# 获取连接时最大等待时间，单位毫秒。配置了maxWait之后， 缺省启用公平锁，并发效率会有所下降， 如果需要可以通过配置useUnfairLock属性为true使用非公平锁。
maxWait = 0
# 是否缓存preparedStatement，也就是PSCache。 PSCache对支持游标的数据库性能提升巨大，比如说oracle。 在mysql5.5以下的版本中没有PSCache功能，建议关闭掉。作者在5.5版本中使用PSCache，通过监控界面发现PSCache有缓存命中率记录， 该应该是支持PSCache。
poolPreparedStatements = false
# 要启用PSCache，必须配置大于0，当大于0时， poolPreparedStatements自动触发修改为true。 在Druid中，不会存在Oracle下PSCache占用内存过多的问题， 可以把这个数值配置大一些，比如说100
maxOpenPreparedStatements = -1
# 用来检测连接是否有效的sql，要求是一个查询语句。 如果validationQuery为null，testOnBorrow、testOnReturn、 testWhileIdle都不会其作用。
validationQuery = SELECT 1
# 申请连接时执行validationQuery检测连接是否有效，做了这个配置会降低性能。
testOnBorrow = true
# 归还连接时执行validationQuery检测连接是否有效，做了这个配置会降低性能
testOnReturn = false
# 建议配置为true，不影响性能，并且保证安全性。 申请连接的时候检测，如果空闲时间大于 timeBetweenEvictionRunsMillis，执行validationQuery检测连接是否有效。
testWhileIdle = false
# 有两个含义： 1) Destroy线程会检测连接的间隔时间 2) testWhileIdle的判断依据，详细看testWhileIdle属性的说明
timeBetweenEvictionRunsMillis = 60000
# 物理连接初始化的时候执行的sql
connectionInitSqls = SELECT 1
# 属性类型是字符串，通过别名的方式配置扩展插件， 常用的插件有： 监控统计用的filter:stat  日志用的filter:log4j 防御sql注入的filter:wall
filters = stat
# 类型是List<com.alibaba.druid.filter.Filter>， 如果同时配置了filters和proxyFilters， 是组合关系，并非替换关系
proxyFilters = 
```

## [Tomcat JDBC Pool](https://www.hutool.cn/docs/#/db/数据源配置db.setting样例?id=tomcat-jdbc-pool)

```
# (boolean) 连接池创建的连接的默认的auto-commit 状态
defaultAutoCommit = true
# (boolean) 连接池创建的连接的默认的read-only 状态。 如果没有设置则setReadOnly 方法将不会被调用。 ( 某些驱动不支持只读模式， 比如：Informix)
defaultReadOnly = false
# (String) 连接池创建的连接的默认的TransactionIsolation 状态。 下面列表当中的某一个： ( 参考javadoc) NONE READ_COMMITTED EAD_UNCOMMITTED REPEATABLE_READ SERIALIZABLE
defaultTransactionIsolation = NONE
# (int) 初始化连接： 连接池启动时创建的初始化连接数量，1。2 版本后支持
initialSize = 10
# (int) 最大活动连接： 连接池在同一时间能够分配的最大活动连接的数量， 如果设置为非正数则表示不限制
maxActive = 100
# (int) 最大空闲连接： 连接池中容许保持空闲状态的最大连接数量， 超过的空闲连接将被释放， 如果设置为负数表示不限制 如果启用，将定期检查限制连接，如果空闲时间超过minEvictableIdleTimeMillis 则释放连接 （ 参考testWhileIdle ）
maxIdle = 8
# (int) 最小空闲连接： 连接池中容许保持空闲状态的最小连接数量， 低于这个数量将创建新的连接， 如果设置为0 则不创建 如果连接验证失败将缩小这个值（ 参考testWhileIdle ）
minIdle = 0
# (int) 最大等待时间： 当没有可用连接时， 连接池等待连接被归还的最大时间( 以毫秒计数)， 超过时间则抛出异常， 如果设置为-1 表示无限等待
maxWait = 30000
# (String) SQL 查询， 用来验证从连接池取出的连接， 在将连接返回给调用者之前。 如果指定， 则查询必须是一个SQL SELECT 并且必须返回至少一行记录 查询不必返回记录，但这样将不能抛出SQL异常
validationQuery = SELECT 1
# (boolean) 指明是否在从池中取出连接前进行检验， 如果检验失败， 则从池中去除连接并尝试取出另一个。注意： 设置为true 后如果要生效，validationQuery 参数必须设置为非空字符串 参考validationInterval以获得更有效的验证
testOnBorrow = false
# (boolean) 指明是否在归还到池中前进行检验 注意： 设置为true 后如果要生效，validationQuery 参数必须设置为非空字符串
testOnReturn = false
# (boolean) 指明连接是否被空闲连接回收器( 如果有) 进行检验。 如果检测失败， 则连接将被从池中去除。注意： 设置为true 后如果要生效，validationQuery 参数必须设置为非空字符串
testWhileIdle = false
```

## [C3P0（不推荐）](https://www.hutool.cn/docs/#/db/数据源配置db.setting样例?id=c3p0（不推荐）)

```
# 连接池中保留的最大连接数。默认值: 15
maxPoolSize = 15
# 连接池中保留的最小连接数，默认为：3
minPoolSize = 3
# 初始化连接池中的连接数，取值应在minPoolSize与maxPoolSize之间，默认为3
initialPoolSize = 3
# 最大空闲时间，60秒内未使用则连接被丢弃。若为0则永不丢弃。默认值: 0
maxIdleTime = 0
# 当连接池连接耗尽时，客户端调用getConnection()后等待获取新连接的时间，超时后将抛出SQLException，如设为0则无限期等待。单位毫秒。默认: 0
checkoutTimeout = 0
# 当连接池中的连接耗尽的时候c3p0一次同时获取的连接数。默认值: 3
acquireIncrement = 3
# 定义在从数据库获取新连接失败后重复尝试的次数。默认值: 30 ；小于等于0表示无限次
acquireRetryAttempts = 0
# 重新尝试的时间间隔，默认为：1000毫秒
acquireRetryDelay = 1000
# 关闭连接时，是否提交未提交的事务，默认为false，即关闭连接，回滚未提交的事务
autoCommitOnClose = false
# c3p0将建一张名为Test的空表，并使用其自带的查询语句进行测试。如果定义了这个参数那么属性preferredTestQuery将被忽略。你不能在这张Test表上进行任何操作，它将只供c3p0测试使用。默认值: null
automaticTestTable = null
# 如果为false，则获取连接失败将会引起所有等待连接池来获取连接的线程抛出异常，但是数据源仍有效保留，并在下次调用getConnection()的时候继续尝试获取连接。如果设为true，那么在尝试获取连接失败后该数据源将申明已断开并永久关闭。默认: false
breakAfterAcquireFailure = false
# 检查所有连接池中的空闲连接的检查频率。默认值: 0，不检查
idleConnectionTestPeriod = 0
# c3p0全局的PreparedStatements缓存的大小。如果maxStatements与maxStatementsPerConnection均为0，则缓存不生效，只要有一个不为0，则语句的缓存就能生效。如果默认值: 0
maxStatements = 0
# maxStatementsPerConnection定义了连接池内单个连接所拥有的最大缓存statements数。默认值: 0
maxStatementsPerConnection = 0
```

## [DBCP（不推荐）](https://www.hutool.cn/docs/#/db/数据源配置db.setting样例?id=dbcp（不推荐）)

```
# (boolean) 连接池创建的连接的默认的auto-commit 状态
defaultAutoCommit = true
# (boolean) 连接池创建的连接的默认的read-only 状态。 如果没有设置则setReadOnly 方法将不会被调用。 ( 某些驱动不支持只读模式， 比如：Informix)
defaultReadOnly = false
# (String) 连接池创建的连接的默认的TransactionIsolation 状态。 下面列表当中的某一个： ( 参考javadoc) NONE READ_COMMITTED EAD_UNCOMMITTED REPEATABLE_READ SERIALIZABLE
defaultTransactionIsolation = NONE
# (int) 初始化连接： 连接池启动时创建的初始化连接数量，1。2 版本后支持
initialSize = 10
# (int) 最大活动连接： 连接池在同一时间能够分配的最大活动连接的数量， 如果设置为非正数则表示不限制
maxActive = 100
# (int) 最大空闲连接： 连接池中容许保持空闲状态的最大连接数量， 超过的空闲连接将被释放， 如果设置为负数表示不限制 如果启用，将定期检查限制连接，如果空闲时间超过minEvictableIdleTimeMillis 则释放连接 （ 参考testWhileIdle ）
maxIdle = 8
# (int) 最小空闲连接： 连接池中容许保持空闲状态的最小连接数量， 低于这个数量将创建新的连接， 如果设置为0 则不创建 如果连接验证失败将缩小这个值（ 参考testWhileIdle ）
minIdle = 0
# (int) 最大等待时间： 当没有可用连接时， 连接池等待连接被归还的最大时间( 以毫秒计数)， 超过时间则抛出异常， 如果设置为-1 表示无限等待
maxWait = 30000
# (String) SQL 查询， 用来验证从连接池取出的连接， 在将连接返回给调用者之前。 如果指定， 则查询必须是一个SQL SELECT 并且必须返回至少一行记录 查询不必返回记录，但这样将不能抛出SQL异常
validationQuery = SELECT 1
# (boolean) 指明是否在从池中取出连接前进行检验， 如果检验失败， 则从池中去除连接并尝试取出另一个。注意： 设置为true 后如果要生效，validationQuery 参数必须设置为非空字符串 参考validationInterval以获得更有效的验证
testOnBorrow = false
# (boolean) 指明是否在归还到池中前进行检验 注意： 设置为true 后如果要生效，validationQuery 参数必须设置为非空字符串
testOnReturn = false
# (boolean) 指明连接是否被空闲连接回收器( 如果有) 进行检验。 如果检测失败， 则连接将被从池中去除。注意： 设置为true 后如果要生效，validationQuery 参数必须设置为非空字符串
testWhileIdle = false
```

# 数据源工厂-DsFactory

## [释义](https://www.hutool.cn/docs/#/db/数据源工厂-DsFactory?id=释义)

数据源（DataSource）的概念来自于JDBC规范中，一个数据源表示针对一个数据库（或者集群）的描述，从数据源中我们可以获得N个数据库连接，从而对数据库进行操作。

每一个开源JDBC连接池都有对DataSource的实现，比如Druid为DruidDataSource，Hikari为HikariDataSource。但是各大连接池配置各不相同，配置文件也不一样，Hutool的针对常用的连接池做了封装，最大限度简化和提供一致性配置。

Hutool的解决方案是：在ClassPath中使用`config/db.setting`一个配置文件，配置所有种类连接池的数据源，然后使用`DsFactory.get()`方法自动识别数据源以及自动注入配置文件中的连接池配置（包括数据库连接配置）。`DsFactory`通过`try`的方式按照顺序检测项目中引入的jar包来甄别用户使用的是哪种连接池，从而自动构建相应的数据源。

Hutool支持以下连接池，并按照其顺序检测存在与否：

1. HikariCP
2. Druid
3. Tomcat
4. Dbcp
5. C3p0

在没有引入任何连接池的情况下，Hutool会使用其内置的连接池：Hutool Pooled（简易连接池，不推荐在线上环境使用）。

## [基本使用](https://www.hutool.cn/docs/#/db/数据源工厂-DsFactory?id=基本使用)

### [1. 引入连接池的jar](https://www.hutool.cn/docs/#/db/数据源工厂-DsFactory?id=_1-引入连接池的jar)

Hutool不会强依赖于任何第三方库，在Hutool支持的连接池范围内，用户需自行选择自己喜欢的连接池并引入。

### [2. 编写配置文件](https://www.hutool.cn/docs/#/db/数据源工厂-DsFactory?id=_2-编写配置文件)

Maven项目中，在`src/main/resources/config`下创建文件`db.setting`，编写配置文件即可。这个配置文件位置就是Hutool与用户间的一个约定（符合约定大于配置的原则）：

配置文件分为两部分

#### [1. 基本连接信息](https://www.hutool.cn/docs/#/db/数据源工厂-DsFactory?id=_1-基本连接信息)

```java
## 基本配置信息
# JDBC URL，根据不同的数据库，使用相应的JDBC连接字符串
url = jdbc:mysql://<host>:<port>/<database_name>
# 用户名，此处也可以使用 user 代替
username = 用户名
# 密码，此处也可以使用 pass 代替
password = 密码
# JDBC驱动名，可选（Hutool会自动识别）
driver = com.mysql.jdbc.Driver
```

> ** 小提示 ** 其中driver是可选的，Hutool会根据url自动加载相应的Driver类。基本连接信息是所有连接池通用的，原则上，只有基本信息就可以成功连接并操作数据库。

#### [2. 连接池特有配置信息](https://www.hutool.cn/docs/#/db/数据源工厂-DsFactory?id=_2-连接池特有配置信息)

针对不同的连接池，除了基本信息外的配置都各不相同，Hutool针对不同的连接池封装了其配置项，可以在项目的`src/test/resources/example`中看到针对不同连接池的配置文件样例。

我们以HikariCP为例：

```java
# 自动提交
autoCommit = true
# 等待连接池分配连接的最大时长（毫秒），超过这个时长还没可用的连接则发生SQLException， 缺省:30秒
connectionTimeout = 30000
# 一个连接idle状态的最大时长（毫秒），超时则被释放（retired），缺省:10分钟
idleTimeout = 600000
# 一个连接的生命时长（毫秒），超时而且没被使用则被释放（retired），缺省:30分钟，建议设置比数据库超时时长少30秒，参考MySQL wait_timeout参数（show variables like '%timeout%';）
maxLifetime = 1800000
# 获取连接前的测试SQL
connectionTestQuery = SELECT 1
# 最小闲置连接数
minimumIdle = 10
# 连接池中允许的最大连接数。缺省值：10；推荐的公式：((core_count * 2) + effective_spindle_count)
maximumPoolSize = 10
# 连接只读数据库时配置为true， 保证安全
readOnly = false
```

### [3. 获取数据源](https://www.hutool.cn/docs/#/db/数据源工厂-DsFactory?id=_3-获取数据源)

```java
//获取默认数据源
DataSource ds = DSFactory.get()
```

是滴，就是这么简单，一个简单的方法，可以识别数据源并读取默认路径(`config/db.setting`)下信息从而获取数据源。

### [4. 直接创建数据源](https://www.hutool.cn/docs/#/db/数据源工厂-DsFactory?id=_4-直接创建数据源)

当然你依旧可以按照连接池本身的方式获取数据源对象。我们以Druid为例：

```java
//具体的配置参数请参阅Druid官方文档
DruidDataSource ds2 = new DruidDataSource();
ds2.setUrl("jdbc:mysql://localhost:3306/dbName");
ds2.setUsername("root");
ds2.setPassword("123456");
```

### [5. 创建简单数据源](https://www.hutool.cn/docs/#/db/数据源工厂-DsFactory?id=_5-创建简单数据源)

有时候我们的操作非常简单，亦或者只是测试下远程数据库是否畅通，我们可以使用Hutool提供的`SimpleDataSource`:

```java
DataSource ds = new SimpleDataSource("jdbc:mysql://localhost:3306/dbName", "root", "123456");
```

SimpleDataSource只是`DriverManager.getConnection`的简单包装，本身并不支持池化功能，此类特别适合少量数据库连接的操作。

同样的，SimpleDataSource也支持默认配置文件：

```java
DataSource ds = new SimpleDataSource();
```

## [高级实用](https://www.hutool.cn/docs/#/db/数据源工厂-DsFactory?id=高级实用)

### [1. 自定义连接池](https://www.hutool.cn/docs/#/db/数据源工厂-DsFactory?id=_1-自定义连接池)

有时候当项目引入多种数据源时，我们希望自定义需要的连接池，此时可以：

```java
//自定义连接池实现为Tomcat-pool
DSFactory.setCurrentDSFactory(new TomcatDSFactory());
DataSource ds = DSFactory.get();
```

需要注意的是，`DSFactory.setCurrentDSFactory`是一个全局方法，必须在所有获取数据源的时机之前调用，调用一次即可（例如项目启动）。

### [2. 自定义配置文件](https://www.hutool.cn/docs/#/db/数据源工厂-DsFactory?id=_2-自定义配置文件)

有时候由于项目规划的问题，我们希望自定义数据库配置Setting的位置，甚至是动态加载Setting对象，此时我们可以使用以下方法从其它的Setting对象中获取数据库连接信息：

```java
//自定义数据库Setting，更多实用请参阅Hutool-Setting章节
Setting setting = new Setting("otherPath/other.setting");
//获取指定配置，第二个参数为分组，用于多数据源，无分组情况下传null
// 注意此处DSFactory需要复用或者关闭
DataSource ds = DSFactory.create(setting).getDataSource();
```

### [3. 多数据源](https://www.hutool.cn/docs/#/db/数据源工厂-DsFactory?id=_3-多数据源)

有的时候我们需要操作不同的数据库，也有可能我们需要针对线上、开发和测试分别操作其数据库，无论哪种情况，Hutool都针对多数据源做了很棒的支持。

多数据源有两种方式可以实现：

#### [1. 多个配置文件分别获得数据源](https://www.hutool.cn/docs/#/db/数据源工厂-DsFactory?id=_1-多个配置文件分别获得数据源)

就是按照自定义配置文件的方式读取多个配置文件即可。

#### [2. 在同一配置文件中使用分组隔离不同的数据源配置：](https://www.hutool.cn/docs/#/db/数据源工厂-DsFactory?id=_2-在同一配置文件中使用分组隔离不同的数据源配置：)

```java
[group_db1]
url = jdbc:mysql://<host>:<port>/<database_name>
username = 用户名
password = 密码

[group_db2]
url = jdbc:mysql://<host2>:<port>/<database_name>
username = 用户名
password = 密码
```

我们按照上面的方式编写`db.setting`文件，然后：

```java
DataSource ds1 = DSFactory.get("group_db1");
DataSource ds2 = DSFactory.get("group_db2");
```

这样我们就可以在一个配置文件中实现多数据源的配置。

## [结语](https://www.hutool.cn/docs/#/db/数据源工厂-DsFactory?id=结语)

Hutool通过多种方式获取DataSource对象，获取后除了可以在Hutool自身应用外，还可以将此对象传入不同的框架以实现无缝结合。

Hutool对数据源的封装很好的诠释了以下几个原则：

1. 自动识别优于用户定义
2. 便捷性与灵活性并存
3. 适配与兼容

# SQL执行器-SqlExecutor

## [介绍](https://www.hutool.cn/docs/#/db/SQL执行器-SqlExecutor?id=介绍)

这是一个静态类，对JDBC的薄封装，里面的静态方法只有两种：执行非查询的SQL语句和查询的SQL语句

## [使用](https://www.hutool.cn/docs/#/db/SQL执行器-SqlExecutor?id=使用)

```java
Connection conn = null;
try {
    conn = ds.getConnection();
    // 执行非查询语句，返回影响的行数
    int count = SqlExecutor.execute(conn, "UPDATE " + TABLE_NAME + " set field1 = ? where id = ?", 0, 0);
    log.info("影响行数：{}", count);
    // 执行非查询语句，返回自增的键，如果有多个自增键，只返回第一个
    Long generatedKey = SqlExecutor.executeForGeneratedKey(conn, "UPDATE " + TABLE_NAME + " set field1 = ? where id = ?", 0, 0);
    log.info("主键：{}", generatedKey);

    /* 执行查询语句，返回实体列表，一个Entity对象表示一行的数据，Entity对象是一个继承自HashMap的对象，存储的key为字段名，value为字段值 */
    List<Entity> entityList = SqlExecutor.query(conn, "select * from " + TABLE_NAME + " where param1 = ?", new EntityListHandler(), "值");
    log.info("{}", entityList);
} catch (SQLException e) {
    Log.error(log, e, "SQL error!");
} finally {
    DbUtil.close(conn);
}
```

# 案例1-导出Blob字段图像

## [需求：](https://www.hutool.cn/docs/#/db/案例1-导出Blob字段图像?id=需求：)

有一张单表存储着图片（图片使用Blob字段）以及图片的相关信息，需求是从数据库中将这些Blob字段内容保存为图片文件，文件名为图片的相关信息。

## [环境](https://www.hutool.cn/docs/#/db/案例1-导出Blob字段图像?id=环境)

数据库：Oracle 本地：Windows 工具：Hutool-db模块

## [编码](https://www.hutool.cn/docs/#/db/案例1-导出Blob字段图像?id=编码)

### [数据库配置：`src/main/resources/config/db.setting`](https://www.hutool.cn/docs/#/db/案例1-导出Blob字段图像?id=数据库配置：srcmainresourcesconfigdbsetting)

```shell
#JDBC url，必须
url = jdbc:oracle:thin:@localhost:1521/orcl
#用户名，必须
user = test
#密码，必须，如果密码为空，请填写 pass = 
pass = test
```

### [代码：`PicTransfer.java`](https://www.hutool.cn/docs/#/db/案例1-导出Blob字段图像?id=代码：pictransferjava)

```java
public class PicTransfer {
    public static void main(String[] args) throws SQLException {
        Db.use().find(
                ListUtil.of("NAME", "TYPE", "GROUP", "PIC"), 
                Entity.create("PIC_INFO").set("TYPE", 1),
                rs -> {
                    while(rs.next()){
                        save(rs);
                    }
                    return null;
                }
        );
    }
    
    private static void save(ResultSet rs) throws SQLException{
        String destDir = "f:/pic";
        String path = StrUtil.format("{}/{}-{}.jpg", destDir, rs.getString("NAME"), rs.getString("GROUP"));
        FileUtil.writeFromStream(rs.getBlob("PIC").getBinaryStream(), path);
    }
}
```

# Redis客户端封装-RedisDS

## [介绍](https://www.hutool.cn/docs/#/db/NoSQL/Redis客户端封装-RedisDS?id=介绍)

RedisDS基于Jedis封装，需自行引入Jedis依赖。

## [使用](https://www.hutool.cn/docs/#/db/NoSQL/Redis客户端封装-RedisDS?id=使用)

### [引入依赖](https://www.hutool.cn/docs/#/db/NoSQL/Redis客户端封装-RedisDS?id=引入依赖)

```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>3.7.0</version>
</dependency>
```

### [配置](https://www.hutool.cn/docs/#/db/NoSQL/Redis客户端封装-RedisDS?id=配置)

在ClassPath（或者src/main/resources）的config目录下下新建`redis.setting`

```
#-------------------------------------------------------------------------------
# Redis客户端配置样例
# 每一个分组代表一个Redis实例
# 无分组的Pool配置为所有分组的共用配置，如果分组自己定义Pool配置，则覆盖共用配置
# 池配置来自于：https://www.cnblogs.com/jklk/p/7095067.html
#-------------------------------------------------------------------------------

#----- 默认（公有）配置
# 地址，默认localhost
host = localhost
# 端口，默认6379
port = 6379
# 超时，默认2000
timeout = 2000
# 连接超时，默认timeout
connectionTimeout = 2000
# 读取超时，默认timeout
soTimeout = 2000
# 密码，默认无
password = 
# 数据库序号，默认0
database = 0
# 客户端名，默认"Hutool"
clientName = Hutool
# SSL连接，默认false
ssl = false;

#----- 自定义分组的连接
[custom]
# 地址，默认localhost
host = localhost
# 连接耗尽时是否阻塞, false报异常,ture阻塞直到超时, 默认true
BlockWhenExhausted = true;
# 设置的逐出策略类名, 默认DefaultEvictionPolicy(当连接超过最大空闲时间,或连接数超过最大空闲连接数)
evictionPolicyClassName = org.apache.commons.pool2.impl.DefaultEvictionPolicy
# 是否启用pool的jmx管理功能, 默认true
jmxEnabled = true;
# 是否启用后进先出, 默认true
lifo = true;
# 最大空闲连接数, 默认8个
maxIdle = 8
# 最小空闲连接数, 默认0
minIdle = 0
# 最大连接数, 默认8个
maxTotal = 8
# 获取连接时的最大等待毫秒数(如果设置为阻塞时BlockWhenExhausted),如果超时就抛异常, 小于零:阻塞不确定的时间,  默认-1
maxWaitMillis = -1
# 逐出连接的最小空闲时间 默认1800000毫秒(30分钟)
minEvictableIdleTimeMillis = 1800000
# 每次逐出检查时 逐出的最大数目 如果为负数就是 : 1/abs(n), 默认3
numTestsPerEvictionRun = 3;
# 对象空闲多久后逐出, 当空闲时间>该值 且 空闲连接>最大空闲数 时直接逐出,不再根据MinEvictableIdleTimeMillis判断  (默认逐出策略)
SoftMinEvictableIdleTimeMillis = 1800000
# 在获取连接的时候检查有效性, 默认false
testOnBorrow = false
# 在空闲时检查有效性, 默认false
testWhileIdle = false
# 逐出扫描的时间间隔(毫秒) 如果为负数,则不运行逐出线程, 默认-1
timeBetweenEvictionRunsMillis = -1
```

## [构建](https://www.hutool.cn/docs/#/db/NoSQL/Redis客户端封装-RedisDS?id=构建)

```java
Jedis jedis = RedisDS.create().getJedis();
```

# MongoDB客户端封装-MongoDS

## [介绍](https://www.hutool.cn/docs/#/db/NoSQL/MongoDB客户端封装-MongoDS?id=介绍)

针对MongoDB客户端封装。客户端需自行引入依赖。

## [使用](https://www.hutool.cn/docs/#/db/NoSQL/MongoDB客户端封装-MongoDS?id=使用)

### [引入依赖](https://www.hutool.cn/docs/#/db/NoSQL/MongoDB客户端封装-MongoDS?id=引入依赖)

```xml
<dependency>
    <groupId>org.mongodb</groupId>
    <artifactId>mongo-java-driver</artifactId>
    <version>3.12.10</version>
</dependency>
```

### [配置](https://www.hutool.cn/docs/#/db/NoSQL/MongoDB客户端封装-MongoDS?id=配置)

在ClassPath（或者src/main/resources）的config目录下下新建mongo.setting

```
#每个主机答应的连接数（每个主机的连接池大小），当连接池被用光时，会被阻塞住 ，默以为10 --int
connectionsPerHost=100
#线程队列数，它以connectionsPerHost值相乘的结果就是线程队列最大值。如果连接线程排满了队列就会抛出“Out of semaphores to get db”错误 --int
threadsAllowedToBlockForConnectionMultiplier=10
#被阻塞线程从连接池获取连接的最长等待时间（ms） --int
maxWaitTime = 120000
#在建立（打开）套接字连接时的超时时间（ms），默以为0（无穷） --int
connectTimeout=0
#套接字超时时间;该值会被传递给Socket.setSoTimeout(int)。默以为0（无穷） --int
socketTimeout=0
#是否打开长连接. defaults to false --boolean
socketKeepAlive=false

#---------------------------------- MongoDB实例连接
[master]
host = 127.0.0.1:27017

[slave]
host = 127.0.0.1:27018
#-----------------------------------------------------
```

### [使用](https://www.hutool.cn/docs/#/db/NoSQL/MongoDB客户端封装-MongoDS?id=使用-1)

```java
//master slave 组成主从集群
MongoDatabase db = MongoFactory.getDS("master", "slave").getDb("test");
```

# Http客户端工具类-HttpUtil

## [概述](https://www.hutool.cn/docs/#/http/Http客户端工具类-HttpUtil?id=概述)

HttpUtil是应对简单场景下Http请求的工具类封装，此工具封装了*HttpRequest*对象常用操作，可以保证在一个方法之内完成Http请求。

此模块基于JDK的HttpUrlConnection封装完成，完整支持https、代理和文件上传。

## [使用](https://www.hutool.cn/docs/#/http/Http客户端工具类-HttpUtil?id=使用)

### [请求普通页面](https://www.hutool.cn/docs/#/http/Http客户端工具类-HttpUtil?id=请求普通页面)

针对最为常用的GET和POST请求，HttpUtil封装了两个方法，

- `HttpUtil.get`
- `HttpUtil.post`

这两个方法用于请求普通页面，然后返回页面内容的字符串，同时提供一些重载方法用于指定请求参数（指定参数支持File对象，可实现文件上传，当然仅仅针对POST请求）。

GET请求栗子：

```java
// 最简单的HTTP请求，可以自动通过header等信息判断编码，不区分HTTP和HTTPS
String result1= HttpUtil.get("https://www.baidu.com");

// 当无法识别页面编码的时候，可以自定义请求页面的编码
String result2= HttpUtil.get("https://www.baidu.com", CharsetUtil.CHARSET_UTF_8);

//可以单独传入http参数，这样参数会自动做URL编码，拼接在URL中
HashMap<String, Object> paramMap = new HashMap<>();
paramMap.put("city", "北京");

String result3= HttpUtil.get("https://www.baidu.com", paramMap);
```

POST请求例子：

```java
HashMap<String, Object> paramMap = new HashMap<>();
paramMap.put("city", "北京");

String result= HttpUtil.post("https://www.baidu.com", paramMap);
```

### [文件上传](https://www.hutool.cn/docs/#/http/Http客户端工具类-HttpUtil?id=文件上传)

```java
HashMap<String, Object> paramMap = new HashMap<>();
//文件上传只需将参数中的键指定（默认file），值设为文件对象即可，对于使用者来说，文件上传与普通表单提交并无区别
paramMap.put("file", FileUtil.file("D:\\face.jpg"));

String result= HttpUtil.post("https://www.baidu.com", paramMap);
```

### [下载文件](https://www.hutool.cn/docs/#/http/Http客户端工具类-HttpUtil?id=下载文件)

因为Hutool-http机制问题，请求页面返回结果是一次性解析为byte[]的，如果请求URL返回结果太大（比如文件下载），那内存会爆掉，因此针对文件下载HttpUtil单独做了封装。文件下载在面对大文件时采用流的方式读写，内存中只是保留一定量的缓存，然后分块写入硬盘，因此大文件情况下不会对内存有压力。

```java
String fileUrl = "http://mirrors.sohu.com/centos/8.4.2105/isos/x86_64/CentOS-8.4.2105-x86_64-dvd1.iso";

//将文件下载后保存在E盘，返回结果为下载文件大小
long size = HttpUtil.downloadFile(fileUrl, FileUtil.file("e:/"));
System.out.println("Download size: " + size);
```

当然，如果我们想感知下载进度，还可以使用另一个重载方法回调感知下载进度：

```java
//带进度显示的文件下载
HttpUtil.downloadFile(fileUrl, FileUtil.file("e:/"), new StreamProgress(){
    
    @Override
    public void start() {
        Console.log("开始下载。。。。");
    }
    
    @Override
    public void progress(long progressSize) {
        Console.log("已下载：{}", FileUtil.readableFileSize(progressSize));
    }
    
    @Override
    public void finish() {
        Console.log("下载完成！");
    }
});
```

StreamProgress接口实现后可以感知下载过程中的各个阶段。

当然，工具类提供了一个更加抽象的方法：`HttpUtil.download`，此方法会请求URL，将返回内容写入到指定的OutputStream中。使用这个方法，可以更加灵活的将HTTP内容转换写出，以适应更多场景。

### [更多有用的工具方法](https://www.hutool.cn/docs/#/http/Http客户端工具类-HttpUtil?id=更多有用的工具方法)

- `HttpUtil.encodeParams` 对URL参数做编码，只编码键和值，提供的值可以是url附带参数，但是不能只是url
- `HttpUtil.toParams`和`HttpUtil.decodeParams` 两个方法是将Map参数转为URL参数字符串和将URL参数字符串转为Map对象
- `HttpUtil.urlWithForm`是将URL字符串和Map参数拼接为GET请求所用的完整字符串使用
- `HttpUtil.getMimeType` 根据文件扩展名快速获取其MimeType（参数也可以是完整文件路径）

### [更多请求参数](https://www.hutool.cn/docs/#/http/Http客户端工具类-HttpUtil?id=更多请求参数)

如果想设置头信息、超时、代理等信息，请见下一章节《Http客户端-HttpRequest》。

# Http请求-HttpRequest

## [介绍](https://www.hutool.cn/docs/#/http/Http请求-HttpRequest?id=介绍)

本质上，HttpUtil中的get和post工具方法都是HttpRequest对象的封装，因此如果想更加灵活操作Http请求，可以使用HttpRequest。

## [使用](https://www.hutool.cn/docs/#/http/Http请求-HttpRequest?id=使用)

### [普通表单](https://www.hutool.cn/docs/#/http/Http请求-HttpRequest?id=普通表单)

我们以POST请求为例：

```java
//链式构建请求
String result2 = HttpRequest.post(url)
    .header(Header.USER_AGENT, "Hutool http")//头信息，多个头信息多次调用此方法即可
    .form(paramMap)//表单内容
    .timeout(20000)//超时，毫秒
    .execute().body();
Console.log(result2);
```

通过链式构建请求，我们可以很方便的指定Http头信息和表单信息，最后调用execute方法即可执行请求，返回HttpResponse对象。HttpResponse包含了服务器响应的一些信息，包括响应的内容和响应的头信息。通过调用body方法即可获取响应内容。

### [Restful请求](https://www.hutool.cn/docs/#/http/Http请求-HttpRequest?id=restful请求)

```java
String json = ...;
String result2 = HttpRequest.post(url)
    .body(json)
    .execute().body();
```

### [配置代理](https://www.hutool.cn/docs/#/http/Http请求-HttpRequest?id=配置代理)

如果代理无需账号密码，可以直接：

```java
String result2 = HttpRequest.post(url)
    .setHttpProxy("127.0.0.1", 9080)
    .body(json)
    .execute().body();
```

如果需要自定其他类型代理或更多的项目，可以：

```java
String result2 = HttpRequest.post(url)
    .setProxy(new Proxy(Proxy.Type.HTTP,
                new InetSocketAddress(host, port))
    .body(json)
    .execute().body();
```

如果遇到https代理错误`Proxy returns "HTTP/1.0 407 Proxy Authentication Required"`，可以尝试：

```java
System.setProperty("jdk.http.auth.tunneling.disabledSchemes", "");
Authenticator.setDefault(
    new Authenticator() {
        @Override
        public PasswordAuthentication getPasswordAuthentication() {
              return new PasswordAuthentication(authUser, authPassword.toCharArray());
        }
    }
);
```

## [其它自定义项](https://www.hutool.cn/docs/#/http/Http请求-HttpRequest?id=其它自定义项)

同样，我们通过HttpRequest可以很方便的做以下操作：

- 指定请求头
- 自定义Cookie（cookie方法）
- 指定是否keepAlive（keepAlive方法）
- 指定表单内容（form方法）
- 指定请求内容，比如rest请求指定JSON请求体（body方法）
- 超时设置（timeout方法）
- 指定代理（setProxy方法）
- 指定SSL协议（setSSLProtocol）
- 简单验证（basicAuth方法）

# Http响应-HttpResponse

## [介绍](https://www.hutool.cn/docs/#/http/Http响应-HttpResponse?id=介绍)

HttpResponse是HttpRequest执行execute()方法后返回的一个对象，我们可以通过此对象获取服务端返回的：

- Http状态码（getStatus方法）
- 返回内容编码（contentEncoding方法）
- 是否Gzip内容（isGzip方法）
- 返回内容（body、bodyBytes、bodyStream方法）
- 响应头信息（header方法）

## [使用](https://www.hutool.cn/docs/#/http/Http响应-HttpResponse?id=使用)

此对象的使用非常简单，最常用的便是body方法，会返回字符串Http响应内容。如果想获取byte[]则调用bodyBytes即可。

### [获取响应状态码](https://www.hutool.cn/docs/#/http/Http响应-HttpResponse?id=获取响应状态码)

```java
HttpResponse res = HttpRequest.post(url)..execute();
Console.log(res.getStatus());
```

### [获取响应头信息](https://www.hutool.cn/docs/#/http/Http响应-HttpResponse?id=获取响应头信息)

```java
HttpResponse res = HttpRequest.post(url)..execute();
//预定义的头信息
Console.log(res.header(Header.CONTENT_ENCODING));
//自定义头信息
Console.log(res.header("Content-Disposition"));
```

# HTML工具类-HtmlUtil

## [由来](https://www.hutool.cn/docs/#/http/HTML工具类-HtmlUtil?id=由来)

针对Http请求中返回的Http内容，Hutool使用此工具类来处理一些HTML页面相关的事情。

比如我们在使用爬虫爬取HTML页面后，需要对返回页面的HTML内容做一定处理，比如去掉指定标签（例如广告栏等）、去除JS、去掉样式等等，这些操作都可以使用**HtmlUtil**完成。

## [方法](https://www.hutool.cn/docs/#/http/HTML工具类-HtmlUtil?id=方法)

### [`HtmlUtil.escape`](https://www.hutool.cn/docs/#/http/HTML工具类-HtmlUtil?id=htmlutilescape)

转义HTML特殊字符，包括：

1. `'` 替换为 `'`
2. `"` 替换为 `"`
3. `&` 替换为 `&`
4. `<` 替换为 `<`
5. `>` 替换为 `>`

```java
String html = "<html><body>123'123'</body></html>";
// 结果为：&lt;html&gt;&lt;body&gt;123&#039;123&#039;&lt;/body&gt;&lt;/html&gt;
String escape = HtmlUtil.escape(html);
```

### [`HtmlUtil.unescape`](https://www.hutool.cn/docs/#/http/HTML工具类-HtmlUtil?id=htmlutilunescape)

还原被转义的HTML特殊字符

```java
String escape = "&lt;html&gt;&lt;body&gt;123&#039;123&#039;&lt;/body&gt;&lt;/html&gt;";
// 结果为：<html><body>123'123'</body></html>
String unescape = HtmlUtil.unescape(escape);
```

### [`HtmlUtil.removeHtmlTag`](https://www.hutool.cn/docs/#/http/HTML工具类-HtmlUtil?id=htmlutilremovehtmltag)

清除指定HTML标签和被标签包围的内容

```java
String str = "pre<img src=\"xxx/dfdsfds/test.jpg\">";
// 结果为：pre
String result = HtmlUtil.removeHtmlTag(str, "img");
```

### [`HtmlUtil.cleanHtmlTag`](https://www.hutool.cn/docs/#/http/HTML工具类-HtmlUtil?id=htmlutilcleanhtmltag)

清除所有HTML标签，但是保留标签内的内容

```java
String str = "pre<div class=\"test_div\">\r\n\t\tdfdsfdsfdsf\r\n</div><div class=\"test_div\">BBBB</div>";
// 结果为：pre\r\n\t\tdfdsfdsfdsf\r\nBBBB
String result = HtmlUtil.cleanHtmlTag(str);
```

### [`HtmlUtil.unwrapHtmlTag`](https://www.hutool.cn/docs/#/http/HTML工具类-HtmlUtil?id=htmlutilunwraphtmltag)

清除指定HTML标签，不包括内容

```java
String str = "pre<div class=\"test_div\">abc</div>";
// 结果为：preabc
String result = HtmlUtil.unwrapHtmlTag(str, "div");
```

### [`HtmlUtil.removeHtmlAttr`](https://www.hutool.cn/docs/#/http/HTML工具类-HtmlUtil?id=htmlutilremovehtmlattr)

去除HTML标签中的指定属性，如果多个标签有相同属性，都去除

```java
String html = "<div class=\"test_div\"></div><span class=\"test_div\"></span>";
// 结果为：<div></div><span></span>
String result = HtmlUtil.removeHtmlAttr(html, "class");
```

### [`HtmlUtil.removeAllHtmlAttr`](https://www.hutool.cn/docs/#/http/HTML工具类-HtmlUtil?id=htmlutilremoveallhtmlattr)

去除指定标签的所有属性

```java
String html = "<div class=\"test_div\" width=\"120\"></div>";
// 结果为：<div></div>
String result = HtmlUtil.removeAllHtmlAttr(html, "div");
```

### [`HtmlUtil.filter` 过滤HTML文本，防止XSS攻击](https://www.hutool.cn/docs/#/http/HTML工具类-HtmlUtil?id=htmlutilfilter-过滤html文本，防止xss攻击)

```java
String html = "<alert></alert>";
// 结果为：""
String filter = HtmlUtil.filter(html);
```

# UA工具类-UserAgentUtil

## [由来](https://www.hutool.cn/docs/#/http/UA工具类-UserAgentUtil?id=由来)

User Agent中文名为用户代理，简称 UA，它是一个特殊字符串头，使得服务器能够识别客户使用的操作系统及版本、浏览器及版本、浏览器渲染引擎等。

Hutool在4.2.1之后支持User-Agent的解析。

## [使用](https://www.hutool.cn/docs/#/http/UA工具类-UserAgentUtil?id=使用)

以桌面浏览器为例，假设你已经获取了用户的UA：

```java
String uaStr = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.163 Safari/535.1";
```

### [获取UA信息](https://www.hutool.cn/docs/#/http/UA工具类-UserAgentUtil?id=获取ua信息)

我们可以借助`UserAgentUtil.parse`方法解析：

```java
UserAgent ua = UserAgentUtil.parse(uaStr);

ua.getBrowser().toString();//Chrome
ua.getVersion();//14.0.835.163
ua.getEngine().toString();//Webkit
ua.getEngineVersion();//535.1
ua.getOs().toString();//Windows 7
ua.getPlatform().toString();//Windows
```

### [判断终端是否为移动终端](https://www.hutool.cn/docs/#/http/UA工具类-UserAgentUtil?id=判断终端是否为移动终端)

```
ua.isMobile();
```

# 常用Http状态码-HttpStatus

## [介绍](https://www.hutool.cn/docs/#/http/常用Http状态码-HttpStatus?id=介绍)

针对Http响应，Hutool封装了一个类用于保存Http状态码

此类用于保存一些状态码的别名，例如：

```java
/**
* HTTP Status-Code 200: OK.
*/
public static final int HTTP_OK = 200;
```

[案例1-爬取开源中国的开源资讯](https://www.hutool.cn/docs/#/http/%E6%A1%88%E4%BE%8B1-%E7%88%AC%E5%8F%96%E5%BC%80%E6%BA%90%E4%B8%AD%E5%9B%BD%E7%9A%84%E5%BC%80%E6%BA%90%E8%B5%84%E8%AE%AF)



# Soap客户端-SoapClient

## [由来](https://www.hutool.cn/docs/#/http/WebService/Soap客户端-SoapClient?id=由来)

在接口对接当中，WebService接口占有着很大份额，而我们为了使用这些接口，不得不引入类似Axis等库来实现接口请求。

现在有了Hutool，就可以在无任何依赖的情况下，实现简便的WebService请求。

## [使用](https://www.hutool.cn/docs/#/http/WebService/Soap客户端-SoapClient?id=使用)

1. 使用[SoapUI](https://www.soapui.org/)解析WSDL地址，找到WebService方法和参数。

我们得到的XML模板为：

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://WebXml.com.cn/">
   <soapenv:Header/>
   <soapenv:Body>
      <web:getCountryCityByIp>
         <!--Optional:-->
         <web:theIpAddress>?</web:theIpAddress>
      </web:getCountryCityByIp>
   </soapenv:Body>
</soapenv:Envelope>
```

1. 按照SoapUI中的相应内容构建SOAP请求。

我们知道：

1. 方法名为：`web:getCountryCityByIp`
2. 参数只有一个，为:`web:theIpAddress`
3. 定义了一个命名空间，前缀为`web`，URI为`http://WebXml.com.cn/`

这样我们就能构建相应SOAP请求：

```java
// 新建客户端
SoapClient client = SoapClient.create("http://www.webxml.com.cn/WebServices/IpAddressSearchWebService.asmx")
    // 设置要请求的方法，此接口方法前缀为web，传入对应的命名空间
    .setMethod("web:getCountryCityByIp", "http://WebXml.com.cn/")
    // 设置参数，此处自动添加方法的前缀：web
    .setParam("theIpAddress", "218.21.240.106");

    // 发送请求，参数true表示返回一个格式化后的XML内容
    // 返回内容为XML字符串，可以配合XmlUtil解析这个响应
    Console.log(client.send(true));
```

## [扩展](https://www.hutool.cn/docs/#/http/WebService/Soap客户端-SoapClient?id=扩展)

### [查看生成的请求XML](https://www.hutool.cn/docs/#/http/WebService/Soap客户端-SoapClient?id=查看生成的请求xml)

调用`SoapClient`对象的`getMsgStr`方法可以查看生成的XML，以检查是否与SoapUI生成的一致。

```java
SoapClient client = ...;
Console.log(client.getMsgStr(true));
```

### [多参数或复杂参数](https://www.hutool.cn/docs/#/http/WebService/Soap客户端-SoapClient?id=多参数或复杂参数)

对于请求体是列表参数或多参数的情况，如：

```xml
<web:method>
  <arg0>
    <fd1>aaa</fd1>
    <fd2>bbb</fd2>
  </arg0>
</web:method>
```

这类请求可以借助`addChildElement`完成。

```java
SoapClient client = SoapClient.create("https://hutool.cn/WebServices/test.asmx")
        .setMethod("web:method", "http://hutool.cn/")
        SOAPElement arg0 = client.getMethodEle().addChildElement("arg0");
        arg0.addChildElement("fdSource").setValue("?");
        arg0.addChildElement("fdTemplated").setValue("?");
```

> 详细的问题解答见：https://gitee.com/dromara/hutool/issues/I4QL1V

# 简易Http服务器-SimpleServer

## [由来](https://www.hutool.cn/docs/#/http/Server/简易Http服务器-SimpleServer?id=由来)

Oracle JDK提供了一个简单的Http服务端类，叫做`HttpServer`，当然它是sun的私有包，位于com.sun.net.httpserver下，必须引入rt.jar才能使用，Hutool基于此封装了`SimpleServer`，用于在不引入Tomcat、Jetty等容器的情况下，实现简单的Http请求处理。

> SimpleServer在Hutool-5.3.0后才引入，请升级到最新版本

## [使用](https://www.hutool.cn/docs/#/http/Server/简易Http服务器-SimpleServer?id=使用)

1. 启动一个Http服务非常简单：

```java
HttpUtil.createServer(8888).start();
```

通过浏览器访问 http://localhost:8888/ 即可，当然此时访问任何path都是404。

1. 处理简单请求：

```
HttpUtil.createServer(8888)
    .addAction("/", (req, res)->{
        res.write("Hello Hutool Server");
    })
    .start();
```

此处我们定义了一个简单的action，绑定在"/"路径下，此时我们可以访问，输出“Hello Hutool Server”。

同理，我们通过调用addAction方法，定义不同path的处理规则，实现相应的功能。

### [简单的文件服务器](https://www.hutool.cn/docs/#/http/Server/简易Http服务器-SimpleServer?id=简单的文件服务器)

Hutool默认提供了简单的文件服务，即定义一个root目录，则请求路径后直接访问目录下的资源，默认请求`index.html`，类似于Nginx。

```
HttpUtil.createServer(8888)
    // 设置默认根目录
    .setRoot("D:\\workspace\\site\\hutool-site")
    .start();
```

此时访问http://localhost:8888/即可访问HTML静态页面。

> hutool-site是Hutool主页的源码项目，地址在：https://gitee.com/loolly_admin/hutool-site，下载后配合SimpleServer实现离线文档。

### [读取请求和返回内容](https://www.hutool.cn/docs/#/http/Server/简易Http服务器-SimpleServer?id=读取请求和返回内容)

有时候我们需要自定义读取请求参数，然后根据参数访问不同的数据，整理返回，此时我们自定义Action即可完成：

1. 返回JSON数据

```java
HttpUtil.createServer(8888)
    // 返回JSON数据测试
    .addAction("/restTest", (request, response) ->
            response.write("{\"id\": 1, \"msg\": \"OK\"}", ContentType.JSON.toString())
    ).start();
```

1. 获取表单数据并返回

```java
HttpUtil.createServer(8888)
    // http://localhost:8888/formTest?a=1&a=2&b=3
    .addAction("/formTest", (request, response) ->
        response.write(request.getParams().toString(), ContentType.TEXT_PLAIN.toString())
    ).start();
```

### [文件上传](https://www.hutool.cn/docs/#/http/Server/简易Http服务器-SimpleServer?id=文件上传)

除了常规Http服务，Hutool还封装了文件上传操作：

```java
HttpUtil.createServer(8888)
    .addAction("/file", (request, response) -> {
        final UploadFile file = request.getMultipart().getFile("file");
        // 传入目录，默认读取HTTP头中的文件名然后创建文件
        file.write("d:/test/");
        response.write("OK!", ContentType.TEXT_PLAIN.toString());
        }
    )
    .start();
```

# 全局定时任务-CronUtil

## [介绍](https://www.hutool.cn/docs/#/cron/全局定时任务-CronUtil?id=介绍)

CronUtil通过一个全局的定时任务配置文件，实现统一的定时任务调度。

## [使用](https://www.hutool.cn/docs/#/cron/全局定时任务-CronUtil?id=使用)

### [1、配置文件](https://www.hutool.cn/docs/#/cron/全局定时任务-CronUtil?id=_1、配置文件)

对于Maven项目，首先在`src/main/resources/config`下放入cron.setting文件（默认是这个路径的这个文件），然后在文件中放入定时规则，规则如下：

```
# 我是注释
[com.company.aaa.job]
TestJob.run = */10 * * * *
TestJob2.run = */10 * * * *
```

中括号表示分组，也表示需要执行的类或对象方法所在包的名字，这种写法有利于区分不同业务的定时任务。

`TestJob.run`表示需要执行的类名和方法名（通过反射调用，不支持Spring和任何框架的依赖注入），`*/10 * * * *`表示定时任务表达式，此处表示每10分钟执行一次，以上配置等同于：

```
com.company.aaa.job.TestJob.run = */10 * * * *
com.company.aaa.job.TestJob2.run = */10 * * * *
```

> 提示 关于表达式语法，见：http://www.cnblogs.com/peida/archive/2013/01/08/2850483.html

### [2、启动](https://www.hutool.cn/docs/#/cron/全局定时任务-CronUtil?id=_2、启动)

```java
CronUtil.start();
```

如果想让执行的作业同定时任务线程同时结束，可以将定时任务设为守护线程，需要注意的是，此模式下会在调用stop时立即结束所有作业线程，请确保你的作业可以被中断：

```java
//使用deamon模式，
CronUtil.start(true);
```

### [3、关闭](https://www.hutool.cn/docs/#/cron/全局定时任务-CronUtil?id=_3、关闭)

```java
CronUtil.stop();
```

## [更多选项](https://www.hutool.cn/docs/#/cron/全局定时任务-CronUtil?id=更多选项)

### [秒匹配和年匹配](https://www.hutool.cn/docs/#/cron/全局定时任务-CronUtil?id=秒匹配和年匹配)

考虑到Quartz表达式的兼容性，且存在对于秒级别精度匹配的需求，Hutool可以通过设置使用秒匹配模式来兼容。

```java
//支持秒级别定时任务
CronUtil.setMatchSecond(true);
```

此时Hutool可以兼容Quartz表达式（5位表达式、6位表达式都兼容）

### [动态添加定时任务](https://www.hutool.cn/docs/#/cron/全局定时任务-CronUtil?id=动态添加定时任务)

当然，如果你想动态的添加定时任务，使用`CronUtil.schedule(String schedulingPattern, Runnable task)`方法即可（使用此方法加入的定时任务不会被写入到配置文件）。

```java
CronUtil.schedule("*/2 * * * * *", new Task() {
    @Override
    public void execute() {
        Console.log("Task excuted.");
    }
});

// 支持秒级别定时任务
CronUtil.setMatchSecond(true);
CronUtil.start();
```

# 邮件工具-MailUtil

## [概述](https://www.hutool.cn/docs/#/extra/邮件工具-MailUtil?id=概述)

在Java中发送邮件主要品依靠javax.mail包，但是由于使用比较繁琐，因此Hutool针对其做了封装。由于依赖第三方包，因此将此工具类归类到extra模块中。

## [使用](https://www.hutool.cn/docs/#/extra/邮件工具-MailUtil?id=使用)

### [引入依赖](https://www.hutool.cn/docs/#/extra/邮件工具-MailUtil?id=引入依赖)

Hutool对所有第三方都是可选依赖，因此在使用MailUtil时需要自行引入第三方依赖。

```
<dependency>
    <groupId>com.sun.mail</groupId>
    <artifactId>javax.mail</artifactId>
    <version>1.6.2</version>
</dependency>
```

> 说明 com.sun.mail是javax.mail升级后的版本，新版本包名做了变更。

### [邮件服务器配置](https://www.hutool.cn/docs/#/extra/邮件工具-MailUtil?id=邮件服务器配置)

在classpath（在标准Maven项目中为`src/main/resources`）的config目录下新建`mail.setting`文件，最小配置内容如下，在此配置下，smtp服务器和用户名都将通过`from`参数识别：

```properties
# 发件人（必须正确，否则发送失败）
from = hutool@yeah.net
# 密码（注意，某些邮箱需要为SMTP服务单独设置密码，详情查看相关帮助）
pass = q1w2e3
```

有时候一些非标准邮箱服务器（例如企业邮箱服务器）的smtp地址等信息并不与发件人后缀一致，端口也可能不同，此时Hutool可以提供完整的配置文件：

完整配置

```properties
# 邮件服务器的SMTP地址，可选，默认为smtp.<发件人邮箱后缀>
host = smtp.yeah.net
# 邮件服务器的SMTP端口，可选，默认25
port = 25
# 发件人（必须正确，否则发送失败）
from = hutool@yeah.net
# 用户名，默认为发件人邮箱前缀
user = hutool
# 密码（注意，某些邮箱需要为SMTP服务单独设置授权码，详情查看相关帮助）
pass = q1w2e3
```

> 注意 邮件服务器必须支持并打开SMTP协议，详细请查看相关帮助说明 配置文件的样例中提供的是我专门为测试邮件功能注册的yeah.net邮箱，~~帐号密码公开，供Hutool用户测试使用~~。

## [发送邮件](https://www.hutool.cn/docs/#/extra/邮件工具-MailUtil?id=发送邮件)

1. 发送普通文本邮件，最后一个参数可选是否添加多个附件：

```java
MailUtil.send("hutool@foxmail.com", "测试", "邮件来自Hutool测试", false);
```

1. 发送HTML格式的邮件并附带附件，最后一个参数可选是否添加多个附件：

```
MailUtil.send("hutool@foxmail.com", "测试", "<h1>邮件来自Hutool测试</h1>", true, FileUtil.file("d:/aaa.xml"));
```

1. 群发邮件，可选HTML或普通文本，可选多个附件：

```java
ArrayList<String> tos = CollUtil.newArrayList(
    "person1@bbb.com", 
    "person2@bbb.com", 
    "person3@bbb.com", 
    "person4@bbb.com");

MailUtil.send(tos, "测试", "邮件来自Hutool群发测试", false);
```

发送邮件非常简单，只需一个方法即可搞定其中按照参数顺序说明如下：

1. tos: 对方的邮箱地址，可以是单个，也可以是多个（Collection表示）
2. subject：标题
3. content：邮件正文，可以是文本，也可以是HTML内容
4. isHtml： 是否为HTML，如果是，那参数3识别为HTML内容
5. files： 可选：附件，可以为多个或没有，将File对象加在最后一个可变参数中即可

### [其它](https://www.hutool.cn/docs/#/extra/邮件工具-MailUtil?id=其它)

1. 自定义邮件服务器

除了使用配置文件定义全局账号以外，`MailUtil.send`方法同时提供重载方法可以传入一个`MailAccount`对象，这个对象为一个普通Bean，记录了邮件服务器信息。

```java
MailAccount account = new MailAccount();
account.setHost("smtp.yeah.net");
account.setPort("25");
account.setAuth(true);
account.setFrom("hutool@yeah.net");
account.setUser("hutool");
account.setPass("q1w2e3");

MailUtil.send(account, CollUtil.newArrayList("hutool@foxmail.com"), "测试", "邮件来自Hutool测试", false);
```

1. 使用SSL加密方式发送邮件 在使用QQ或Gmail邮箱时，需要强制开启SSL支持，此时我们只需修改配置文件即可：

```properties
# 发件人（必须正确，否则发送失败），“小磊”可以任意变更，<>内的地址必须唯一，以下方式也对
# from = hutool@yeah.net
from = 小磊<hutool@yeah.net>
# 密码（注意，某些邮箱需要为SMTP服务单独设置密码，详情查看相关帮助）
pass = q1w2e3
# 使用SSL安全连接
sslEnable = true
```

在原先极简配置下只需加入`sslEnable`即可完成SSL连接，当然，这是最简单的配置，很多参数根据已有参数已设置为默认。

完整的配置文件如下：

```properties
# 邮件服务器的SMTP地址
host = smtp.yeah.net
# 邮件服务器的SMTP端口
port = 465
# 发件人（必须正确，否则发送失败）
from = hutool@yeah.net
# 用户名（注意：如果使用foxmail邮箱，此处user为qq号）
user = hutool
# 密码（注意，某些邮箱需要为SMTP服务单独设置密码，详情查看相关帮助）
pass = q1w2e3
#使用 STARTTLS安全连接，STARTTLS是对纯文本通信协议的扩展。
starttlsEnable = true

# 使用SSL安全连接
sslEnable = true
# 指定实现javax.net.SocketFactory接口的类的名称,这个类将被用于创建SMTP的套接字
socketFactoryClass = javax.net.ssl.SSLSocketFactory
# 如果设置为true,未能创建一个套接字使用指定的套接字工厂类将导致使用java.net.Socket创建的套接字类, 默认值为true
socketFactoryFallback = true
# 指定的端口连接到在使用指定的套接字工厂。如果没有设置,将使用默认端口456
socketFactoryPort = 465

# SMTP超时时长，单位毫秒，缺省值不超时
timeout = 0
# Socket连接超时值，单位毫秒，缺省值不超时
connectionTimeout = 0
```

1. 针对QQ邮箱和Foxmail邮箱的说明

(1) QQ邮箱中SMTP密码是单独生成的授权码，而非你的QQ密码，至于怎么生成，见腾讯的帮助说明：http://service.mail.qq.com/cgi-bin/help?subtype=1&&id=28&&no=1001256

使用帮助引导生成授权码后，配置如下即可：

```
pass = 你生成的授权码
```

(2) Foxmail邮箱本质上也是QQ邮箱的一种别名，你可以在你的QQ邮箱中设置一个foxmail邮箱，不过配置上有所区别。在Hutool中`user`属性默认提取你邮箱@前面的部分，但是foxmail邮箱是无效的，需要单独配置为与之绑定的qq号码或者`XXXX@qq.com`的`XXXX`。即：

```
host = smtp.qq.com
from = XXXX@foxmail.com
user = foxmail邮箱对应的QQ号码或者qq邮箱@前面部分
...
```

(3) 阿里云邮箱的`user`是邮箱的完整地址，即`xxx@aliyun.com`

1. 针对QQ邮箱（foxmail）PKIX path building failed错误（since 5.6.4）

部分用户反馈发送邮件时会遇到错误：

```java
cn.hutool.extra.mail.MailException: MessagingException: Could not connect to SMTP host: smtp.qq.com, port: 465
...
Caused by: javax.net.ssl.SSLHandshakeException: sun.security.validator.ValidatorException: PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target
```

这个错误可能是需要SSL验证造成的，我们可以手动跳过这个验证：

```java
MailAccount mailAccount = new MailAccount();
mailAccount.setAuth(true);
mailAccount.setSslEnable(true);
...
MailSSLSocketFactory sf = new MailSSLSocketFactory();
sf.setTrustAllHosts(true);
mailAccount.setCustomProperty("mail.smtp.ssl.socketFactory", sf);

Mail mail = Mail.create(mailAccount)
    .setTos("xx@xx.com")
    .setTitle("邮箱验证")
    .setContent("您的验证码是：<h3>2333</h3>")
    .setHtml(true)
    .send();
```

# 二维码工具-QrCodeUtil

## [由来](https://www.hutool.cn/docs/#/extra/二维码工具-QrCodeUtil?id=由来)

由于大家对二维码的需求较多，对于二维码的生成和解析我认为应该作为简单的工具存在于Hutool中。考虑到自行实现的难度，因此Hutool针对被广泛接受的的[zxing](https://github.com/zxing/zxing)库进行封装。而由于涉及第三方包，因此归类到extra模块中。

## [使用](https://www.hutool.cn/docs/#/extra/二维码工具-QrCodeUtil?id=使用)

### [引入zxing](https://www.hutool.cn/docs/#/extra/二维码工具-QrCodeUtil?id=引入zxing)

考虑到Hutool的非强制依赖性，因此zxing需要用户自行引入：

```xml
<dependency>
    <groupId>com.google.zxing</groupId>
    <artifactId>core</artifactId>
    <version>3.3.3</version>
</dependency>
```

> 说明 zxing-3.3.3是此文档编写时的最新版本，理论上你引入的版本应与此版本一致或比这个版本新。

### [生成二维码](https://www.hutool.cn/docs/#/extra/二维码工具-QrCodeUtil?id=生成二维码)

在此我们将Hutool主页的url生成为二维码，微信扫一扫可以看到H5主页哦：

```java
// 生成指定url对应的二维码到文件，宽和高都是300像素
QrCodeUtil.generate("https://hutool.cn/", 300, 300, FileUtil.file("d:/qrcode.jpg"));
```

效果qrcode.jpg：

![image-20241115092452143](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241115092453.png)

### [自定义参数（since 4.1.2）](https://www.hutool.cn/docs/#/extra/二维码工具-QrCodeUtil?id=自定义参数（since-412）)

1. 基本参数设定

通过`QrConfig`可以自定义二维码的生成参数，例如长、宽、二维码的颜色、背景颜色、边距等参数，使用方法如下：

```java
QrConfig config = new QrConfig(300, 300);
// 设置边距，既二维码和背景之间的边距
config.setMargin(3);
// 设置前景色，既二维码颜色（青色）
config.setForeColor(Color.CYAN.getRGB());
// 设置背景色（灰色）
config.setBackColor(Color.GRAY.getRGB());

// 生成二维码到文件，也可以到流
QrCodeUtil.generate("http://hutool.cn/", config, FileUtil.file("e:/qrcode.jpg"));
```

效果qrcode.jpg:

![image-20241115092506700](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241115092507.png)

1. 附带logo小图标

```java
QrCodeUtil.generate(//
    "http://hutool.cn/", //二维码内容
    QrConfig.create().setImg("e:/logo_small.jpg"), //附带logo
    FileUtil.file("e:/qrcodeWithLogo.jpg")//写出到的文件
);
```

效果如图：

![image-20241115092529343](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241115092530.png)

1. 调整纠错级别

很多时候，二维码无法识别，这时就要调整纠错级别。纠错级别使用zxing的`ErrorCorrectionLevel`枚举封装，包括：L、M、Q、H几个参数，由低到高。低级别的像素块更大，可以远距离识别，但是遮挡就会造成无法识别。高级别则相反，像素块小，允许遮挡一定范围，但是像素块更密集。

```java
QrConfig config = new QrConfig();
// 高纠错级别
config.setErrorCorrection(ErrorCorrectionLevel.H);
QrCodeUtil.generate("https://hutool.cn/", config, FileUtil.file("e:/qrcodeCustom.jpg"));
```

效果如图：

![image-20241115092613655](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241115092614.png)

### [识别二维码](https://www.hutool.cn/docs/#/extra/二维码工具-QrCodeUtil?id=识别二维码)

```java
// decode -> "http://hutool.cn/"
String decode = QrCodeUtil.decode(FileUtil.file("d:/qrcode.jpg"));
```

# Servlet工具-ServletUtil

## [由来](https://www.hutool.cn/docs/#/extra/Servlet工具-ServletUtil?id=由来)

最早Servlet相关的工具并不在Hutool的封装考虑范围内，但是后来很多人提出需要一个Servlet Cookie工具，于是我决定建立ServletUtil，这样工具的使用范围就不仅限于Cookie，还包括参数等等。

其实最早的Servlet封装来自于作者的一个MVC框架：[Hulu](https://gitee.com/loolly/hulu)，这个MVC框架对Servlet做了一层封装，使请求处理更加便捷。于是Hutool将Hulu中Request类和Response类中的方法封装于此。

## [使用](https://www.hutool.cn/docs/#/extra/Servlet工具-ServletUtil?id=使用)

### [加入依赖](https://www.hutool.cn/docs/#/extra/Servlet工具-ServletUtil?id=加入依赖)

```
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>3.1.0</version>
    <!-- 此包一般在Servlet容器中都有提供 -->
    <scope>provided</scope>
</dependency>
```

### [方法](https://www.hutool.cn/docs/#/extra/Servlet工具-ServletUtil?id=方法)

- `getParamMap` 获得所有请求参数
- `fillBean` 将请求参数转为Bean
- `getClientIP` 获取客户端IP，支持从Nginx头部信息获取，也可以自定义头部信息获取位置
- `getHeader`、`getHeaderIgnoreCase` 获得请求header中的信息
- `isIE` 客户浏览器是否为IE
- `isMultipart` 是否为Multipart类型表单，此类型表单用于文件上传
- `getCookie` 获得指定的Cookie
- `readCookieMap` 将cookie封装到Map里面
- `addCookie` 设定返回给客户端的Cookie
- `write` 返回数据给客户端
- `setHeader` 设置响应的Header

# 模板引擎封装-TemplateUtil

## [介绍](https://www.hutool.cn/docs/#/extra/模板引擎/模板引擎封装-TemplateUtil?id=介绍)

随着前后分离的流行，JSP技术和模板引擎慢慢变得不再那么重要，但是早某些场景中（例如邮件模板、页面静态化等）依旧无可可替代，但是各种模板引擎语法大相径庭，使用方式也不尽相同，学习成本很高。Hutool旨在封装各个引擎的共性，使用户只关注模板语法即可，减少学习成本。

Hutool现在封装的引擎有：

- [Beetl](http://ibeetl.com/)
- [Enjoy](https://gitee.com/jfinal/enjoy)
- [Rythm](http://rythmengine.org/)
- [FreeMarker](https://freemarker.apache.org/)
- [Velocity](http://velocity.apache.org/)
- [Thymeleaf](https://www.thymeleaf.org/)

## [原理](https://www.hutool.cn/docs/#/extra/模板引擎/模板引擎封装-TemplateUtil?id=原理)

类似于Java日志门面的思想，Hutool将模板引擎的渲染抽象为两个概念：

- TemplateEngine 模板引擎，用于封装模板对象，配置各种配置
- Template 模板对象，用于配合参数渲染产生内容

通过实现这两个接口，用户便可抛开模板实现，从而渲染模板。Hutool同时会通过`TemplateFactory`**根据用户引入的模板引擎库的jar来自动选择用哪个引擎来渲染**。

## [使用](https://www.hutool.cn/docs/#/extra/模板引擎/模板引擎封装-TemplateUtil?id=使用)

### [从字符串模板渲染内容](https://www.hutool.cn/docs/#/extra/模板引擎/模板引擎封装-TemplateUtil?id=从字符串模板渲染内容)

```java
//自动根据用户引入的模板引擎库的jar来自动选择使用的引擎
//TemplateConfig为模板引擎的选项，可选内容有字符编码、模板路径、模板加载方式等，默认通过模板字符串渲染
TemplateEngine engine = TemplateUtil.createEngine(new TemplateConfig());

//假设我们引入的是Beetl引擎，则：
Template template = engine.getTemplate("Hello ${name}");
//Dict本质上为Map，此处可用Map
String result = template.render(Dict.create().set("name", "Hutool"));
//输出：Hello Hutool
```

也就是说，使用Hutool之后，无论你用任何一种模板引擎，代码不变（只变更模板内容）。

### [从classpath查找模板渲染](https://www.hutool.cn/docs/#/extra/模板引擎/模板引擎封装-TemplateUtil?id=从classpath查找模板渲染)

只需修改TemplateConfig配置文件内容即可更换（这里以Velocity为例）：

```java
TemplateEngine engine = TemplateUtil.createEngine(new TemplateConfig("templates", ResourceMode.CLASSPATH));
Template template = engine.getTemplate("velocity_test.vtl");
String result = template.render(Dict.create().set("name", "Hutool"));
```

### [其它方式查找模板](https://www.hutool.cn/docs/#/extra/模板引擎/模板引擎封装-TemplateUtil?id=其它方式查找模板)

查找模板的方式由ResourceMode定义，包括：

- CLASSPATH 从ClassPath加载模板
- FILE 从File本地目录加载模板
- WEB_ROOT 从WebRoot目录加载模板
- STRING 从模板文本加载模板
- COMPOSITE 复合加载模板（分别从File、ClassPath、Web-root、String方式尝试查找模板）

# Jsch(SSH)工具-JschUtil

## [由来](https://www.hutool.cn/docs/#/extra/Jsch封装/Jsch工具-JschUtil?id=由来)

此工具最早来自于我的早期项目：Common-tools，当时是为了解决在存在堡垒机（跳板机）环境时无法穿透堡垒机访问内部主机端口问题，于是辗转找到了[jsch](http://www.jcraft.com/jsch/)库。为了更加便捷的、且容易理解的方式使用此库，因此有了`JschUtil`。

## [使用](https://www.hutool.cn/docs/#/extra/Jsch封装/Jsch工具-JschUtil?id=使用)

### [引入jsch](https://www.hutool.cn/docs/#/extra/Jsch封装/Jsch工具-JschUtil?id=引入jsch)

```xml
<dependency>
    <groupId>com.jcraft</groupId>
    <artifactId>jsch</artifactId>
    <version>0.1.54</version>
</dependency>
```

> 说明 截止本文档撰写完毕，jsch的最新版为`0.1.54`，理论上应引入的版本应大于或等于此版本。

### [使用](https://www.hutool.cn/docs/#/extra/Jsch封装/Jsch工具-JschUtil?id=使用-1)

### [ssh连接到远程主机](https://www.hutool.cn/docs/#/extra/Jsch封装/Jsch工具-JschUtil?id=ssh连接到远程主机)

```java
//新建会话，此会话用于ssh连接到跳板机（堡垒机），此处为10.1.1.1:22
Session session = JschUtil.getSession("10.1.1.1", 22, "test", "123456");
```

### [端口映射](https://www.hutool.cn/docs/#/extra/Jsch封装/Jsch工具-JschUtil?id=端口映射)

```java
//新建会话，此会话用于ssh连接到跳板机（堡垒机），此处为10.1.1.1:22
Session session = JschUtil.getSession("10.1.1.1", 22, "test", "123456");

// 将堡垒机保护的内网8080端口映射到localhost，我们就可以通过访问http://localhost:8080/访问内网服务了
JschUtil.bindPort(session, "172.20.12.123", 8080, 8080);
```

### [其它方法](https://www.hutool.cn/docs/#/extra/Jsch封装/Jsch工具-JschUtil?id=其它方法)

- `generateLocalPort` 生成一个本地端口（从10001开始尝试，找到一个未被使用的本地端口）
- `unBindPort` 解绑端口映射
- `openAndBindPortToLocal` 快捷方法，将连接到跳板机和绑定远程主机端口到本地使用一个方法搞定
- `close` 关闭SSH会话

# FTP客户端封装-Ftp

## [介绍](https://www.hutool.cn/docs/#/extra/FTP/FTP客户端封装-Ftp?id=介绍)

FTP客户端封装，此客户端基于[Apache Commons Net](http://commons.apache.org/proper/commons-net/)。

## [使用](https://www.hutool.cn/docs/#/extra/FTP/FTP客户端封装-Ftp?id=使用)

### [引入依赖](https://www.hutool.cn/docs/#/extra/FTP/FTP客户端封装-Ftp?id=引入依赖)

```xml
<dependency>
    <groupId>commons-net</groupId>
    <artifactId>commons-net</artifactId>
    <version>3.6</version>
</dependency>
```

### [使用](https://www.hutool.cn/docs/#/extra/FTP/FTP客户端封装-Ftp?id=使用-1)

```java
//匿名登录（无需帐号密码的FTP服务器）
Ftp ftp = new Ftp("172.0.0.1");
//进入远程目录
ftp.cd("/opt/upload");
//上传本地文件
ftp.upload("/opt/upload", FileUtil.file("e:/test.jpg"));
//下载远程文件
ftp.download("/opt/upload", "test.jpg", FileUtil.file("e:/test2.jpg"));

//关闭连接
ftp.close();
```

### [主动模式与被动模式](https://www.hutool.cn/docs/#/extra/FTP/FTP客户端封装-Ftp?id=主动模式与被动模式)

- PORT（主动模式）

> FTP客户端连接到FTP服务器的21端口，发送用户名和密码登录，登录成功后要list列表或者读取数据时，客户端随机开放一个端口（1024以上），发送 PORT命令到FTP服务器，告诉服务器客户端采用主动模式并开放端口；FTP服务器收到PORT主动模式命令和端口号后，通过服务器的20端口和客户端开放的端口连接，发送数据。

- PASV（被动模式）

> FTP客户端连接到FTP服务器的21端口，发送用户名和密码登录，登录成功后要list列表或者读取数据时，发送PASV命令到FTP服务器， 服务器在本地随机开放一个端口（1024以上），然后把开放的端口告诉客户端， 客户端再连接到服务器开放的端口进行数据传输。

更多介绍见：https://www.cnblogs.com/huhaoshida/p/5412615.html

Ftp中默认是被动模式，需要切换则：

```java
Ftp ftp = new Ftp("172.0.0.1");

//切换为主动模式
ftp.setMode(FtpMode.Active);
```

# 简易FTP服务器-SimpleFtpServer

## [介绍](https://www.hutool.cn/docs/#/extra/FTP/简易FTP服务器-SimpleFtpServer?id=介绍)

Hutool基于 [Apache FtpServer]（http://mina.apache.org/ftpserver-project/）封装了一个简易的FTP服务端组件，主要用于在一些测试场景或小并发应用场景下使用。

## [使用](https://www.hutool.cn/docs/#/extra/FTP/简易FTP服务器-SimpleFtpServer?id=使用)

### [引入FtpServer](https://www.hutool.cn/docs/#/extra/FTP/简易FTP服务器-SimpleFtpServer?id=引入ftpserver)

```xml
<dependency>
    <groupId>org.apache.ftpserver</groupId>
    <artifactId>ftpserver-core</artifactId>
    <version>1.1.1</version>
</dependency>
```

### [使用](https://www.hutool.cn/docs/#/extra/FTP/简易FTP服务器-SimpleFtpServer?id=使用-1)

- 开启匿名FTP服务：

```java
SimpleFtpServer
    .create()
    // 此目录必须存在
    .addAnonymous("d:/test/ftp/")
    .start();
```

此时就可以通过资源管理器访问：

```
ftp://localhost
```

- 自定义用户

```java
BaseUser user = new BaseUser();
user.setName("username");
user.setPassword("123");
user.setHomeDirectory("d:/test/user/");

SimpleFtpServer
    .create()
    .addUser(user)
    .start();
```

# Emoji工具-EmojiUtil

## [由来](https://www.hutool.cn/docs/#/extra/emoji/Emoji工具-EmojiUtil?id=由来)

考虑到MySQL等数据库中普通的UTF8编码并不支持Emoji（只有utf8mb4支持），因此对于数据中的Emoji字符进行处理（转换、清除）变成一项必要工作。因此Hutool基于`emoji-java`库提供了Emoji工具实现。

此工具在Hutoo-4.2.1之后版本可用。

## [使用](https://www.hutool.cn/docs/#/extra/emoji/Emoji工具-EmojiUtil?id=使用)

### [加入依赖](https://www.hutool.cn/docs/#/extra/emoji/Emoji工具-EmojiUtil?id=加入依赖)

```
<dependency>
    <groupId>com.vdurmont</groupId>
    <artifactId>emoji-java</artifactId>
    <version>4.0.0</version>
</dependency>
```

### [使用](https://www.hutool.cn/docs/#/extra/emoji/Emoji工具-EmojiUtil?id=使用-1)

1. 转义Emoji字符

```java
String alias = EmojiUtil.toAlias("😄");//:smile:
```

1. 将转义的别名转为Emoji字符

```
String emoji = EmojiUtil.toUnicode(":smile:");//😄
```

1. 将字符串中的Unicode Emoji字符转换为HTML表现形式

```
String alias = EmojiUtil.toHtml("😄");//&#128102;
```

# 中文分词封装-TokenizerUtil

## [介绍](https://www.hutool.cn/docs/#/extra/中文分词/中文分词封装-TokenizerUtil?id=介绍)

现阶段，应用于搜索引擎和自然语言处理的中文分词库五花八门，使用方式各不统一，虽然有适配于Lucene和Elasticsearch的插件，但是我们想在多个库之间选择更换时，依旧有学习时间。

Hutool针对常见中文分词库做了统一接口封装，既定义一套规范，隔离各个库的差异，做到一段代码，随意更换。

Hutool现在封装的引擎有：

- [Ansj](https://github.com/NLPchina/ansj_seg)
- [HanLP](https://github.com/hankcs/HanLP)
- [IKAnalyzer](https://github.com/yozhao/IKAnalyzer)
- [Jcseg](https://gitee.com/lionsoul/jcseg)
- [Jieba](https://github.com/huaban/jieba-analysis)
- [mmseg4j](https://github.com/chenlb/mmseg4j-core)
- [Word](https://github.com/ysc/word)
- [Smartcn](https://github.com/chenlb/mmseg4j-core)

> 注意 此工具和模块从Hutool-4.4.0开始支持。

## [原理](https://www.hutool.cn/docs/#/extra/中文分词/中文分词封装-TokenizerUtil?id=原理)

类似于Java日志门面的思想，Hutool将分词引擎的渲染抽象为三个概念：

- TokenizerEngine 分词引擎，用于封装分词库对象
- Result 分词结果接口定义，用于抽象对文本分词的结果，实现了Iterator和Iterable接口，用于遍历分词
- Word 表示分词中的一个词，既分词后的单词，可以获取单词文本、起始位置和结束位置等信息

通过实现这三个接口，用户便可抛开分词库的差异，实现多文本分词。

Hutool同时会通过`TokenizerFactory`**根据用户引入的分词库的jar来自动选择用哪个库实现分词**。

## [使用](https://www.hutool.cn/docs/#/extra/中文分词/中文分词封装-TokenizerUtil?id=使用)

### [解析文本并分词](https://www.hutool.cn/docs/#/extra/中文分词/中文分词封装-TokenizerUtil?id=解析文本并分词)

```java
//自动根据用户引入的分词库的jar来自动选择使用的引擎
TokenizerEngine engine = TokenizerUtil.createEngine();

//解析文本
String text = "这两个方法的区别在于返回值";
Result result = engine.parse(text);
//输出：这 两个 方法 的 区别 在于 返回 值
String resultStr = CollUtil.join((Iterator<Word>)result, " ");
```

当你引入Ansj，会自动路由到Ansi的库去实现分词，引入HanLP则会路由到HanLP，依此类推。

也就是说，使用Hutool之后，无论你用任何一种分词库，代码不变。

### [自定义模板引擎](https://www.hutool.cn/docs/#/extra/中文分词/中文分词封装-TokenizerUtil?id=自定义模板引擎)

此处以HanLP为例：

```java
TokenizerEngine engine = new HanLPEngine();

//解析文本
String text = "这两个方法的区别在于返回值";
Result result = engine.parse(text);
//输出：这 两个 方法 的 区别 在于 返回 值
String resultStr = CollUtil.join((Iterator<Word>)result, " ");
```

# Spring工具-SpringUtil

## [由来](https://www.hutool.cn/docs/#/extra/Spring/Spring工具-SpringUtil?id=由来)

使用Spring Boot时，通过依赖注入获取bean是非常方便的，但是在工具化的应用场景下，想要动态获取bean就变得非常困难，于是Hutool封装了Spring中Bean获取的工具类——SpringUtil。

## [使用](https://www.hutool.cn/docs/#/extra/Spring/Spring工具-SpringUtil?id=使用)

### [注册SpringUtil](https://www.hutool.cn/docs/#/extra/Spring/Spring工具-SpringUtil?id=注册springutil)

1. 使用ComponentScan注册类

```java
// 扫描cn.hutool.extra.spring包下所有类并注册之
@ComponentScan(basePackages={"cn.hutool.extra.spring"})
```

1. 使用Import导入

```java
@Import(cn.hutool.extra.spring.SpringUtil.class)
```

### [获取指定Bean](https://www.hutool.cn/docs/#/extra/Spring/Spring工具-SpringUtil?id=获取指定bean)

1. 定义一个Bean

```java
@Data
    public static class Demo2{
        private long id;
        private String name;

        @Bean(name="testDemo")
        public Demo2 generateDemo() {
            Demo2 demo = new Demo2();
            demo.setId(12345);
            demo.setName("test");
            return demo;
        }
    }
```

2. 获取Bean

```java
final Demo2 testDemo = SpringUtil.getBean("testDemo");
```

# Cglib工具-CglibUtil

## [介绍](https://www.hutool.cn/docs/#/extra/cglib/Cglib工具-CglibUtil?id=介绍)

CGLib (Code Generation Library) 是一个强大的,高性能,高质量的Code生成类库，通过此库可以完成动态代理、Bean拷贝等操作。

Hutool在`5.4.1`之后加入对Cglib的封装——`CglibUtil`，用于解决Bean拷贝的性能问题。

## [使用](https://www.hutool.cn/docs/#/extra/cglib/Cglib工具-CglibUtil?id=使用)

### [引入Cglib](https://www.hutool.cn/docs/#/extra/cglib/Cglib工具-CglibUtil?id=引入cglib)

```xml
<dependency>
    <groupId>cglib</groupId>
    <artifactId>cglib</artifactId>
    <version>${cglib.version}</version>
    <scope>compile</scope>
</dependency>
```

### [使用](https://www.hutool.cn/docs/#/extra/cglib/Cglib工具-CglibUtil?id=使用-1)

1. Bean拷贝

首先我们定义两个Bean：

```java
@Data
public class SampleBean {
    private String value;
}
@Data
public class OtherSampleBean {
    private String value;
}
```

> @Data是Lombok的注解，请自行补充get和set方法，或者引入Lombok依赖

```java
SampleBean bean = new SampleBean();
bean.setValue("Hello world");

OtherSampleBean otherBean = new OtherSampleBean();

CglibUtil.copy(bean, otherBean);

// 值为"Hello world"
otherBean.getValue();
```

当然，目标对象也可以省略，你可以传入一个class，让Hutool自动帮你实例化它：

```
OtherSampleBean otherBean2 = CglibUtil.copy(bean, OtherSampleBean.class);

// 值为"Hello world"
otherBean.getValue();
```

## [关于性能](https://www.hutool.cn/docs/#/extra/cglib/Cglib工具-CglibUtil?id=关于性能)

Cglib的性能是目前公认最好的，其时间主要耗费在`BeanCopier`创建上，因此，Hutool根据传入Class不同，缓存了`BeanCopier`对象，使性能达到最好。



# 拼音工具-PinyinUtil

## [介绍](https://www.hutool.cn/docs/#/extra/拼音/拼音工具-PinyinUtil?id=介绍)

拼音工具类在旧版本的Hutool中在core包中，但是发现自己实现相关功能需要庞大的字典，放在core包中便是累赘。

于是为了方便，Hutool封装了拼音的门面，用于兼容以下拼音库:

1. TinyPinyin
2. JPinyin
3. Pinyin4j

和其它门面模块类似，采用SPI方式识别所用的库。例如你想用Pinyin4j，只需引入jar，Hutool即可自动识别。

## [使用](https://www.hutool.cn/docs/#/extra/拼音/拼音工具-PinyinUtil?id=使用)

### [引入库](https://www.hutool.cn/docs/#/extra/拼音/拼音工具-PinyinUtil?id=引入库)

以下为Hutool支持的拼音库的pom坐标，你可以选择任意一个引入项目中，如果引入多个，Hutool会按照以上顺序选择第一个使用。

```xml
<dependency>
    <groupId>io.github.biezhi</groupId>
    <artifactId>TinyPinyin</artifactId>
    <version>2.0.3.RELEASE</version>
</dependency>
<dependency>
    <groupId>com.belerweb</groupId>
    <artifactId>pinyin4j</artifactId>
    <version>2.5.1</version>
</dependency>
<dependency>
    <groupId>com.github.stuxuhai</groupId>
    <artifactId>jpinyin</artifactId>
    <version>1.1.8</version>
</dependency>
```

### [使用](https://www.hutool.cn/docs/#/extra/拼音/拼音工具-PinyinUtil?id=使用-1)

1. 获取拼音

```java
// "ni hao"
String pinyin = PinyinUtil.getPinyin("你好", " ");
```

这里定义的分隔符为空格，你也可以按照需求自定义分隔符，亦或者使用""无分隔符。

1. 获取拼音首字母

```java
// "h, s, d, y, g"
String result = PinyinUtil.getFirstLetter("H是第一个", ", ");
```

1. 自定义拼音库（拼音引擎）

```java
Pinyin4jEngine engine = new Pinyin4jEngine();

// "ni hao h"
String pinyin = engine.getPinyin("你好h", " ");
```

# 压缩封装-CompressUtil

## [介绍](https://www.hutool.cn/docs/#/extra/压缩/压缩封装-CompressUtil?id=介绍)

虽然Hutool基于JDK提供了`ZipUtil`用于压缩或解压ZIP相关文件，但是对于7zip、tar等格式的压缩依旧无法处理，于是基于`commons-compress`做了进一步封装：`CompressUtil`。

此工具支持的格式有：

对于流式压缩支持：

- GZIP
- BZIP2
- XZ
- XZ
- PACK200
- SNAPPY_FRAMED
- LZ4_BLOCK
- LZ4_FRAMED
- ZSTANDARD
- DEFLATE

对于归档文件支持：

- AR
- CPIO
- JAR
- TAR
- ZIP
- 7z

对于归档文件，Hutool提供了两个通用接口：

- Archiver 数据归档，提供打包工作，如增加文件到压缩包等
- Extractor 归档数据解包，用于解压或者提取压缩文件

## [使用](https://www.hutool.cn/docs/#/extra/压缩/压缩封装-CompressUtil?id=使用)

首先引入`commons-compress`

```xml
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-compress</artifactId>
    <version>1.21</version>
</dependency>
```

### [压缩文件](https://www.hutool.cn/docs/#/extra/压缩/压缩封装-CompressUtil?id=压缩文件)

我们以7Zip为例：

```java
final File file = FileUtil.file("d:/test/compress/test.7z");
CompressUtil.createArchiver(CharsetUtil.CHARSET_UTF_8, ArchiveStreamFactory.SEVEN_Z, file)
    .add(FileUtil.file("d:/test/someFiles"));
    .finish()
    .close();
```

其中`ArchiveStreamFactory.SEVEN_Z`就是自定义的压缩格式，可以自行选择

add方法同时支持文件或目录，多个文件目录多次调用add方法即可。

有时候我们不想把目录下所有的文件放到压缩包，这时候可以使用add方法的第二个参数`Filter`，此接口用于过滤不需要加入的文件。

```java
CompressUtil.createArchiver(CharsetUtil.CHARSET_UTF_8, ArchiveStreamFactory.SEVEN_Z, zipFile)
    .add(FileUtil.file("d:/Java/apache-maven-3.6.3"), (file)->{
        if("invalid".equals(file.getName())){
            return false;
        }
        return true;
    })
    .finish().close();
```

### [解压文件](https://www.hutool.cn/docs/#/extra/压缩/压缩封装-CompressUtil?id=解压文件)

我们以7Zip为例：

```java
Extractor extractor =     CompressUtil.createExtractor(
        CharsetUtil.defaultCharset(),
        FileUtil.file("d:/test/compress/test.7z"));

extractor.extract(FileUtil.file("d:/test/compress/test2/"));
```

# 表达式引擎封装-ExpressionUtil

## [介绍](https://www.hutool.cn/docs/#/extra/表达式引擎/表达式引擎封装-ExpressionUtil?id=介绍)

与模板引擎类似，Hutool针对较为流行的表达式计算引擎封装为门面模式，提供统一的API，去除差异。 现有的引擎实现有：

- [Aviator](https://github.com/killme2008/aviatorscript)
- [Apache Jexl3](https://github.com/apache/commons-jexl)
- [MVEL](https://github.com/mvel/mvel)
- [JfireEL](https://gitee.com/eric_ds/jfireEL)
- [Rhino](https://github.com/mozilla/rhino)
- [Spring Expression Language (SpEL)](https://github.com/spring-projects/spring-framework/tree/master/spring-expression)

## [使用](https://www.hutool.cn/docs/#/extra/表达式引擎/表达式引擎封装-ExpressionUtil?id=使用)

首先引入我们需要的模板引擎，引入后，Hutool借助SPI机制可自动识别使用，我们以`Aviator`为例：

```java
<dependency>
    <groupId>com.googlecode.aviator</groupId>
    <artifactId>aviator</artifactId>
    <version>5.2.7</version>
</dependency>
```

### [执行表达式](https://www.hutool.cn/docs/#/extra/表达式引擎/表达式引擎封装-ExpressionUtil?id=执行表达式)

```java
final Dict dict = Dict.create()
        .set("a", 100.3)
        .set("b", 45)
        .set("c", -199.100);

// -143.8
final Object eval = ExpressionUtil.eval("a-(b-c)", dict);
```

### [自定义引擎执行](https://www.hutool.cn/docs/#/extra/表达式引擎/表达式引擎封装-ExpressionUtil?id=自定义引擎执行)

如果项目中引入多个引擎，我们想选择某个引擎执行，则可以：

```java
ExpressionEngine engine = new JexlEngine();

final Dict dict = Dict.create()
        .set("a", 100.3)
        .set("b", 45)
        .set("c", -199.100);

// -143.8
final Object eval = engine.eval("a-(b-c)", dict);
```

### [创建自定义引擎](https://www.hutool.cn/docs/#/extra/表达式引擎/表达式引擎封装-ExpressionUtil?id=创建自定义引擎)

引擎的核心就是实现`ExpressionEngine`接口，此接口只有一个方法：`eval`。

我们实现此接口后，在项目的`META-INF/services/`下创建spi文件`cn.hutool.extra.expression.ExpressionEngine`：

```java
com.yourProject.XXXXEngine
```

这样就可以直接调用`ExpressionUtil.eval`执行表达式了。

# 布隆过滤器-Bloom Filter使用

## [介绍](https://www.hutool.cn/docs/#/bloomFilter/概述?id=介绍)

布隆过滤器（英语：Bloom Filter）是1970年由布隆提出的。它实际上是一个很长的二进制向量和一系列随机映射函数。布隆过滤器可以用于检索一个元素是否在一个集合中。它的优点是空间效率和查询时间都远远超过一般的算法，缺点是有一定的误识别率和删除困难。

布隆过滤器的原理是，当一个元素被加入集合时，通过K个散列函数将这个元素映射成一个位数组中的K个点，把它们置为1。检索时，我们只要看看这些点是不是都是1就（大约）知道集合中有没有它了：如果这些点有任何一个0，则被检元素一定不在；如果都是1，则被检元素很可能在。这就是布隆过滤器的基本思想。

参考：https://www.cnblogs.com/z941030/p/9218356.html

## [使用](https://www.hutool.cn/docs/#/bloomFilter/概述?id=使用)

```java
// 初始化
BitMapBloomFilter filter = new BitMapBloomFilter(10);
filter.add("123");
filter.add("abc");
filter.add("ddd");

// 查找
filter.contains("abc")
```

# 切面代理工具-ProxyUtil

## [使用](https://www.hutool.cn/docs/#/aop/切面代理工具-ProxyUtil?id=使用)

### [使用JDK的动态代理实现切面](https://www.hutool.cn/docs/#/aop/切面代理工具-ProxyUtil?id=使用jdk的动态代理实现切面)

1. 我们定义一个接口：

```java
public interface Animal{
    void eat();
}
```

1. 定义一个实现类：

```java
public class Cat implements Animal{

    @Override
    public void eat() {
        Console.log("猫吃鱼");
    }
    
}
```

1. 我们使用`TimeIntervalAspect`这个切面代理上述对象，来统计猫吃鱼的执行时间：

```java
Animal cat = ProxyUtil.proxy(new Cat(), TimeIntervalAspect.class);
cat.eat();
```

`TimeIntervalAspect`位于`cn.hutool.aop.aspects`包，继承自`SimpleAspect`，代码如下：

```java
public class TimeIntervalAspect extends SimpleAspect{
    //TimeInterval为Hutool实现的一个计时器
    private TimeInterval interval = new TimeInterval();

    @Override
    public boolean before(Object target, Method method, Object[] args) {
        interval.start();
        return true;
    }
    
    @Override
    public boolean after(Object target, Method method, Object[] args) {
        Console.log("Method [{}.{}] execute spend [{}]ms", target.getClass().getName(), method.getName(), interval.intervalMs());
        return true;
    }
}
```

执行结果为：

```
猫吃鱼
Method [cn.hutool.aop.test.AopTest$Cat.eat] execute spend [16]ms
```

> 在调用proxy方法后，IDE自动补全返回对象为Cat，因为JDK机制的原因，我们的返回值必须是被代理类实现的接口，因此需要手动将返回值改为**Animal**，否则会报类型转换失败。

### [使用Cglib实现切面](https://www.hutool.cn/docs/#/aop/切面代理工具-ProxyUtil?id=使用cglib实现切面)

使用Cglib的好处是无需定义接口即可对对象直接实现切面，使用方式完全一致：

1. 引入Cglib依赖

```
<dependency>
    <groupId>cglib</groupId>
    <artifactId>cglib</artifactId>
    <version>3.2.7</version>
</dependency>
```

1. 定义一个无接口类（此类有无接口都可以）

```java
public class Dog {
    public String eat() {
        Console.log("狗吃肉");
    }
}
Dog dog = ProxyUtil.proxy(new Dog(), TimeIntervalAspect.class);
String result = dog.eat();
```

执行结果为：

```
狗吃肉
Method [cn.hutool.aop.test.AopTest$Dog.eat] execute spend [13]ms
```

## [其它方法](https://www.hutool.cn/docs/#/aop/切面代理工具-ProxyUtil?id=其它方法)

ProxyUtil中还提供了一些便捷的Proxy方法封装，例如newProxyInstance封装了Proxy.newProxyInstance方法，提供泛型返回值，并提供更多参数类型支持。

## [原理](https://www.hutool.cn/docs/#/aop/切面代理工具-ProxyUtil?id=原理)

动态代理对象的创建原理是假设创建的代理对象名为 $Proxy0：

1. 根据传入的interfaces动态生成一个类，实现interfaces中的接口
2. 通过传入的classloder将刚生成的类加载到jvm中。即将$Proxy0类load
3. 调用$Proxy0的$Proxy0(InvocationHandler)构造函数 创建$Proxy0的对象，并且用interfaces参数遍历其所有接口的方法，并生成实现方法，这些实现方法的实现本质上是通过反射调用被代理对象的方法。
4. 将$Proxy0的实例返回给客户端。
5. 当调用代理类的相应方法时，相当于调用 InvocationHandler.invoke(Object, Method, Object []) 方法。

# Script工具-ScriptUtil

## [介绍](https://www.hutool.cn/docs/#/script/Script工具-ScriptUtil?id=介绍)

针对Script执行工具化封装

## [使用](https://www.hutool.cn/docs/#/script/Script工具-ScriptUtil?id=使用)

1. `ScriptUtil.eval` 执行Javascript脚本，参数为脚本字符串。

栗子：

```java
ScriptUtil.eval("print('Script test!');");
```

1. `ScriptUtil.compile` 编译脚本，返回一个`CompiledScript`对象

栗子：

```java
CompiledScript script = ScriptUtil.compile("print('Script test!');");
try {
    script.eval();
} catch (ScriptException e) {
    throw new ScriptRuntimeException(e);
}
```

# Excel工具-ExcelUtil

## [介绍](https://www.hutool.cn/docs/#/poi/Excel工具-ExcelUtil?id=介绍)

Excel操作工具封装

## [使用](https://www.hutool.cn/docs/#/poi/Excel工具-ExcelUtil?id=使用)

1. 从文件中读取Excel为ExcelReader

```java
ExcelReader reader = ExcelUtil.getReader(FileUtil.file("test.xlsx"));
```

1. 从流中读取Excel为ExcelReader（比如从ClassPath中读取Excel文件）

```java
ExcelReader reader = ExcelUtil.getReader(ResourceUtil.getStream("aaa.xlsx"));
```

1. 读取指定的sheet

```java
ExcelReader reader;

//通过sheet编号获取
reader = ExcelUtil.getReader(FileUtil.file("test.xlsx"), 0);
//通过sheet名获取
reader = ExcelUtil.getReader(FileUtil.file("test.xlsx"), "sheet1");
```

1. 读取大数据量的Excel

```java
private RowHandler createRowHandler() {
    return new RowHandler() {
        @Override
        public void handle(int sheetIndex, int rowIndex, List<Object> rowlist) {
            Console.log("[{}] [{}] {}", sheetIndex, rowIndex, rowlist);
        }
    };
}

ExcelUtil.readBySax("aaa.xlsx", 0, createRowHandler());
```

## [后续](https://www.hutool.cn/docs/#/poi/Excel工具-ExcelUtil?id=后续)

`ExcelUtil.getReader`方法只是将实体Excel文件转换为ExcelReader对象进行操作。接下来请参阅章节ExcelReader对Excel工作簿进行具体操作。

# Excel读取-ExcelReader

## [介绍](https://www.hutool.cn/docs/#/poi/Excel读取-ExcelReader?id=介绍)

读取Excel内容的封装，通过构造ExcelReader对象，指定被读取的Excel文件、流或工作簿，然后调用readXXX方法读取内容为指定格式。

## [使用](https://www.hutool.cn/docs/#/poi/Excel读取-ExcelReader?id=使用)

1. 读取Excel中所有行和列，都用列表表示

   ```java
   ExcelReader reader = ExcelUtil.getReader("d:/aaa.xlsx");
   List<List<Object>> readAll = reader.read();
   ```

2. 读取为Map列表，默认第一行为标题行，Map中的key为标题，value为标题对应的单元格值。

   ```java
   ExcelReader reader = ExcelUtil.getReader("d:/aaa.xlsx");
   List<Map<String,Object>> readAll = reader.readAll();
   ```

3. 读取为Bean列表，Bean中的字段名为标题，字段值为标题对应的单元格值。

   ```java
   ExcelReader reader = ExcelUtil.getReader("d:/aaa.xlsx");
   List<Person> all = reader.readAll(Person.class);
   ```

# 流方式读取Excel2003-Excel03SaxReader

## [介绍](https://www.hutool.cn/docs/#/poi/流方式读取Excel2003-Excel03SaxReader?id=介绍)

在标准的ExcelReader中，如果数据量较大，读取Excel会非常缓慢，并有可能造成内存溢出。因此针对大数据量的Excel，Hutool封装了event模式的读取方式。

Excel03SaxReader只支持Excel2003格式的Sax读取。

## [使用](https://www.hutool.cn/docs/#/poi/流方式读取Excel2003-Excel03SaxReader?id=使用)

### [定义行处理器](https://www.hutool.cn/docs/#/poi/流方式读取Excel2003-Excel03SaxReader?id=定义行处理器)

首先我们实现一下`RowHandler`接口，这个接口是Sax读取的核心，通过实现handle方法编写我们要对每行数据的操作方式（比如按照行入库，入List或者写出到文件等），在此我们只是在控制台打印。

```java
private RowHandler createRowHandler() {
    return new RowHandler() {
        @Override
        public void handle(int sheetIndex, long rowIndex, List<Object> rowlist) {
            Console.log("[{}] [{}] {}", sheetIndex, rowIndex, rowlist);
        }
    };
}
```

### [ExcelUtil快速读取](https://www.hutool.cn/docs/#/poi/流方式读取Excel2003-Excel03SaxReader?id=excelutil快速读取)

```java
ExcelUtil.readBySax("aaa.xls", 1, createRowHandler());
```

### [构建对象读取](https://www.hutool.cn/docs/#/poi/流方式读取Excel2003-Excel03SaxReader?id=构建对象读取)

```java
Excel03SaxReader reader = new Excel03SaxReader(createRowHandler());
reader.read("aaa.xls", 0);
```

reader方法的第二个参数是sheet的序号，-1表示读取所有sheet，0表示第一个sheet，依此类推。

# 流方式读取Excel2007-Excel07SaxReader

## [介绍](https://www.hutool.cn/docs/#/poi/流方式读取Excel2007-Excel07SaxReader?id=介绍)

在标准的ExcelReader中，如果数据量较大，读取Excel会非常缓慢，并有可能造成内存溢出。因此针对大数据量的Excel，Hutool封装了Sax模式的读取方式。

Excel07SaxReader只支持Excel2007格式的Sax读取。

## [使用](https://www.hutool.cn/docs/#/poi/流方式读取Excel2007-Excel07SaxReader?id=使用)

### [定义行处理器](https://www.hutool.cn/docs/#/poi/流方式读取Excel2007-Excel07SaxReader?id=定义行处理器)

首先我们实现一下`RowHandler`接口，这个接口是Sax读取的核心，通过实现handle方法编写我们要对每行数据的操作方式（比如按照行入库，入List或者写出到文件等），在此我们只是在控制台打印。

```java
private RowHandler createRowHandler() {
    return new RowHandler() {
        @Override
        public void handle(int sheetIndex, long rowIndex, List<Object> rowlist) {
            Console.log("[{}] [{}] {}", sheetIndex, rowIndex, rowlist);
        }
    };
}
```

### [ExcelUtil快速读取](https://www.hutool.cn/docs/#/poi/流方式读取Excel2007-Excel07SaxReader?id=excelutil快速读取)

```java
ExcelUtil.readBySax("aaa.xlsx", 0, createRowHandler());
```

### [构建对象读取](https://www.hutool.cn/docs/#/poi/流方式读取Excel2007-Excel07SaxReader?id=构建对象读取)

```java
Excel07SaxReader reader = new Excel07SaxReader(createRowHandler());
reader.read("d:/text.xlsx", 0);
```

reader方法的第二个参数是sheet的序号，-1表示读取所有sheet，0表示第一个sheet，依此类推。

# Excel生成-ExcelWriter

## [由来](https://www.hutool.cn/docs/#/poi/Excel生成-ExcelWriter?id=由来)

Excel有读取也便有写出，Hutool针对将数据写出到Excel做了封装。

## [原理](https://www.hutool.cn/docs/#/poi/Excel生成-ExcelWriter?id=原理)

Hutool将Excel写出封装为`ExcelWriter`，原理为包装了Workbook对象，每次调用`merge`（合并单元格）或者`write`（写出数据）方法后只是将数据写入到Workbook，并不写出文件，只有调用`flush`或者`close`方法后才会真正写出文件。

由于机制原因，在写出结束后需要关闭`ExcelWriter`对象，调用`close`方法即可关闭，此时才会释放Workbook对象资源，否则带有数据的Workbook一直会常驻内存。

## [使用例子](https://www.hutool.cn/docs/#/poi/Excel生成-ExcelWriter?id=使用例子)

### [1. 将行列对象写出到Excel](https://www.hutool.cn/docs/#/poi/Excel生成-ExcelWriter?id=_1-将行列对象写出到excel)

我们先定义一个嵌套的List，List的元素也是一个List，内层的一个List代表一行数据，每行都有4个单元格，最终`list`对象代表多行数据。

```java
List<String> row1 = CollUtil.newArrayList("aa", "bb", "cc", "dd");
List<String> row2 = CollUtil.newArrayList("aa1", "bb1", "cc1", "dd1");
List<String> row3 = CollUtil.newArrayList("aa2", "bb2", "cc2", "dd2");
List<String> row4 = CollUtil.newArrayList("aa3", "bb3", "cc3", "dd3");
List<String> row5 = CollUtil.newArrayList("aa4", "bb4", "cc4", "dd4");

List<List<String>> rows = CollUtil.newArrayList(row1, row2, row3, row4, row5);
```

然后我们创建`ExcelWriter`对象后写出数据：

```java
//通过工具类创建writer
ExcelWriter writer = ExcelUtil.getWriter("d:/writeTest.xlsx");
//通过构造方法创建writer
//ExcelWriter writer = new ExcelWriter("d:/writeTest.xls");

//跳过当前行，既第一行，非必须，在此演示用
writer.passCurrentRow();

//合并单元格后的标题行，使用默认标题样式
writer.merge(row1.size() - 1, "测试标题");
//一次性写出内容，强制输出标题
writer.write(rows, true);
//关闭writer，释放内存
writer.close();
```

效果： ![写出效果图](https://static.oschina.net/uploads/img/201711/12111543_dmjs.png)

### [2. 写出Map数据](https://www.hutool.cn/docs/#/poi/Excel生成-ExcelWriter?id=_2-写出map数据)

构造数据：

```java
Map<String, Object> row1 = new LinkedHashMap<>();
row1.put("姓名", "张三");
row1.put("年龄", 23);
row1.put("成绩", 88.32);
row1.put("是否合格", true);
row1.put("考试日期", DateUtil.date());

Map<String, Object> row2 = new LinkedHashMap<>();
row2.put("姓名", "李四");
row2.put("年龄", 33);
row2.put("成绩", 59.50);
row2.put("是否合格", false);
row2.put("考试日期", DateUtil.date());

ArrayList<Map<String, Object>> rows = CollUtil.newArrayList(row1, row2);
```

写出数据：

```java
// 通过工具类创建writer
ExcelWriter writer = ExcelUtil.getWriter("d:/writeMapTest.xlsx");
// 合并单元格后的标题行，使用默认标题样式
writer.merge(row1.size() - 1, "一班成绩单");
// 一次性写出内容，使用默认样式，强制输出标题
writer.write(rows, true);
// 关闭writer，释放内存
writer.close();
```

效果： ![写出效果](https://static.oschina.net/uploads/img/201711/12134150_BDDT.png)

### [3. 写出Bean数据](https://www.hutool.cn/docs/#/poi/Excel生成-ExcelWriter?id=_3-写出bean数据)

定义Bean:

```java
public class TestBean {
    private String name;
    private int age;
    private double score;
    private boolean isPass;
    private Date examDate;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public boolean isPass() {
        return isPass;
    }

    public void setPass(boolean isPass) {
        this.isPass = isPass;
    }

    public Date getExamDate() {
        return examDate;
    }

    public void setExamDate(Date examDate) {
        this.examDate = examDate;
    }
}
```

构造数据：

```java
TestBean bean1 = new TestBean();
bean1.setName("张三");
bean1.setAge(22);
bean1.setPass(true);
bean1.setScore(66.30);
bean1.setExamDate(DateUtil.date());

TestBean bean2 = new TestBean();
bean2.setName("李四");
bean2.setAge(28);
bean2.setPass(false);
bean2.setScore(38.50);
bean2.setExamDate(DateUtil.date());

List<TestBean> rows = CollUtil.newArrayList(bean1, bean2);
```

写出数据：

```java
// 通过工具类创建writer
ExcelWriter writer = ExcelUtil.getWriter("d:/writeBeanTest.xlsx");
// 合并单元格后的标题行，使用默认标题样式
writer.merge(4, "一班成绩单");
// 一次性写出内容，使用默认样式，强制输出标题
writer.write(rows, true);
// 关闭writer，释放内存
writer.close();
```

效果： ![写出Bean数据](https://static.oschina.net/uploads/img/201711/12143029_3B2E.png)

### [4. 自定义Bean的key别名（排序标题）](https://www.hutool.cn/docs/#/poi/Excel生成-ExcelWriter?id=_4-自定义bean的key别名（排序标题）)

在写出Bean的时候，我们可以调用`ExcelWriter`对象的`addHeaderAlias`方法自定义Bean中key的别名，这样就可以写出自定义标题了（例如中文）。

写出数据：

```java
// 通过工具类创建writer
ExcelWriter writer = ExcelUtil.getWriter("d:/writeBeanTest.xlsx");

//自定义标题别名
writer.addHeaderAlias("name", "姓名");
writer.addHeaderAlias("age", "年龄");
writer.addHeaderAlias("score", "分数");
writer.addHeaderAlias("isPass", "是否通过");
writer.addHeaderAlias("examDate", "考试时间");

// 默认的，未添加alias的属性也会写出，如果想只写出加了别名的字段，可以调用此方法排除之
writer.setOnlyAlias(true);

// 合并单元格后的标题行，使用默认标题样式
writer.merge(4, "一班成绩单");
// 一次性写出内容，使用默认样式，强制输出标题
writer.write(rows, true);
// 关闭writer，释放内存
writer.close();
```

效果： ![img](https://static.oschina.net/uploads/img/201808/01220010_Ybbw.png)

> 提示（since 4.1.5） 默认情况下Excel中写出Bean字段不能保证顺序，此时可以使用`addHeaderAlias`方法设置标题别名，Bean的写出顺序就会按照标题别名的加入顺序排序。 如果不需要设置标题但是想要排序字段，请调用`writer.addHeaderAlias("age", "age")`设置一个相同的别名就可以不更换标题。 未设置标题别名的字段不参与排序，会默认排在前面。

### [5. 写出到流](https://www.hutool.cn/docs/#/poi/Excel生成-ExcelWriter?id=_5-写出到流)

```java
// 通过工具类创建writer，默认创建xls格式
ExcelWriter writer = ExcelUtil.getWriter();
//创建xlsx格式的
//ExcelWriter writer = ExcelUtil.getWriter(true);
// 一次性写出内容，使用默认样式，强制输出标题
writer.write(rows, true);
//out为OutputStream，需要写出到的目标流
writer.flush(out);
// 关闭writer，释放内存
writer.close();
```

### [6. 写出到客户端下载（写出到Servlet）](https://www.hutool.cn/docs/#/poi/Excel生成-ExcelWriter?id=_6-写出到客户端下载（写出到servlet）)

1. 写出xls

```java
// 通过工具类创建writer，默认创建xls格式
ExcelWriter writer = ExcelUtil.getWriter();
// 一次性写出内容，使用默认样式，强制输出标题
writer.write(rows, true);
//out为OutputStream，需要写出到的目标流

//response为HttpServletResponse对象
response.setContentType("application/vnd.ms-excel;charset=utf-8"); 
//test.xls是弹出下载对话框的文件名，不能为中文，中文请自行编码
response.setHeader("Content-Disposition","attachment;filename=test.xls"); 
ServletOutputStream out=response.getOutputStream(); 

writer.flush(out, true);
// 关闭writer，释放内存
writer.close();
//此处记得关闭输出Servlet流
IoUtil.close(out);
```

1. 写出xlsx

```java
ExcelWriter writer = ExcelUtil.getWriter(true);
writer.write(rows, true);

response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"); 
response.setHeader("Content-Disposition","attachment;filename=test.xlsx"); 

writer.flush(out, true);
writer.close();
IoUtil.close(out);
```

> 注意 `ExcelUtil.getWriter()`默认创建xls格式的Excel，因此写出到客户端也需要自定义文件名为XXX.xls，否则会出现文件损坏的提示。 若想生成xlsx格式，请使用`ExcelUtil.getWriter(true)`创建。

1. 下载提示文件损坏问题解决

有用户反馈按照代码生成的Excel下载后提示文件损坏，无法打开，经过排查，可能是几个问题：

- （1）writer和out流没有正确关闭，请在代码末尾的finally块增加关闭。
- （2）扩展名不匹配。getWriter默认生成xls，Content-Disposition中也应该是xls，只有getWriter(true)时才可以使用xlsx
- （3）Maven项目中Excel保存于ClassPath中（src/main/resources下）宏替换导致被破坏，解决办法是添加filtering（参考：https://blog.csdn.net/qq_42270377/article/details/92771349）
- （4）Excel打开提示文件损坏，WPS可以打开。这是Excel的安全性控制导致的，解决办法见：https://blog.csdn.net/zm9898/article/details/99677626

## [自定义Excel](https://www.hutool.cn/docs/#/poi/Excel生成-ExcelWriter?id=自定义excel)

### [1. 设置单元格背景色](https://www.hutool.cn/docs/#/poi/Excel生成-ExcelWriter?id=_1-设置单元格背景色)

```java
ExcelWriter writer = ...;

// 定义单元格背景色
StyleSet style = writer.getStyleSet();
// 第二个参数表示是否也设置头部单元格背景
style.setBackgroundColor(IndexedColors.RED, false);
```

### [2. 自定义字体](https://www.hutool.cn/docs/#/poi/Excel生成-ExcelWriter?id=_2-自定义字体)

```java
ExcelWriter writer = ...;
//设置内容字体
Font font = writer.createFont();
font.setBold(true);
font.setColor(Font.COLOR_RED); 
font.setItalic(true); 
//第二个参数表示是否忽略头部样式
writer.getStyleSet().setFont(font, true);
```

### [3. 写出多个sheet](https://www.hutool.cn/docs/#/poi/Excel生成-ExcelWriter?id=_3-写出多个sheet)

```java
//初始化时定义表名
ExcelWriter writer = new ExcelWriter("d:/aaa.xls", "表1");
//切换sheet，此时从第0行开始写
writer.setSheet("表2");
...
writer.setSheet("表3");
...
```

### [4. 更详细的定义样式](https://www.hutool.cn/docs/#/poi/Excel生成-ExcelWriter?id=_4-更详细的定义样式)

在Excel中，由于样式对象个数有限制，因此Hutool根据样式种类分为4个样式对象，使相同类型的单元格可以共享样式对象。样式按照类别存在于`StyleSet`中，其中包括：

- 头部样式 headCellStyle
- 普通单元格样式 cellStyle
- 数字单元格样式 cellStyleForNumber
- 日期单元格样式 cellStyleForDate

其中`cellStyleForNumber` `cellStyleForDate`用于控制数字和日期的显示方式。

因此我们可以使用以下方式获取`CellStyle`对象自定义指定种类的样式：

```java
StyleSet style = writer.getStyleSet();
CellStyle cellStyle = style.getHeadCellStyle();
...
```

### [5. 自定义写出的值](https://www.hutool.cn/docs/#/poi/Excel生成-ExcelWriter?id=_5-自定义写出的值)

你可以实现`CellSetter`接口来自定义写出到单元格的值，此接口只有一个方法：`setValue(Cell cell)`，通过暴露`Cell`对象使得用户可以自定义输出单元格内容，甚至是样式。

```java
// 此处使用lambda自定义写出内容
List<Object> row = ListUtil.of((CellSetter) cell -> cell.setCellValue("自定义内容"));

ExcelWriter writer = ExcelUtil.getWriter("/test/test.xlsx");
writer.writeRow(row);
writer.close();
```

> 注意 某些特殊的字符出会导致Excel自动转义，如_xXXXX_这种格式的字符串会被当做unicode转义符，会被反转义。 此时可以使用Hutool内置的`EscapeStrCellSetter`

```java
List<Object> row = ListUtil.of(new EscapeStrCellSetter("_x5116_"));

ExcelWriter writer = ExcelUtil.getWriter("/test/test.xlsx");
writer.writeRow(row);
writer.close();
```

此问题的详细说明见：https://gitee.com/dromara/hutool/issues/I466ZZ

# Excel大数据生成-BigExcelWriter

## [介绍](https://www.hutool.cn/docs/#/poi/Excel大数据生成-BigExcelWriter?id=介绍)

对于大量数据输出，采用`ExcelWriter`容易引起内存溢出，因此有了`BigExcelWriter`，使用方法与`ExcelWriter`完全一致。

## [使用](https://www.hutool.cn/docs/#/poi/Excel大数据生成-BigExcelWriter?id=使用)

```java
List<?> row1 = CollUtil.newArrayList("aa", "bb", "cc", "dd", DateUtil.date(), 3.22676575765);
List<?> row2 = CollUtil.newArrayList("aa1", "bb1", "cc1", "dd1", DateUtil.date(), 250.7676);
List<?> row3 = CollUtil.newArrayList("aa2", "bb2", "cc2", "dd2", DateUtil.date(), 0.111);
List<?> row4 = CollUtil.newArrayList("aa3", "bb3", "cc3", "dd3", DateUtil.date(), 35);
List<?> row5 = CollUtil.newArrayList("aa4", "bb4", "cc4", "dd4", DateUtil.date(), 28.00);

List<List<?>> rows = CollUtil.newArrayList(row1, row2, row3, row4, row5);

BigExcelWriter writer= ExcelUtil.getBigWriter("e:/xxx.xlsx");
// 一次性写出内容，使用默认样式
writer.write(rows);
// 关闭writer，释放内存
writer.close();
```

# Word生成-Word07Writer

## [由来](https://www.hutool.cn/docs/#/poi/Word生成-Word07Writer?id=由来)

Hutool针对Word（主要是docx格式）进行封装，实现简单的Word文件创建。

## [介绍](https://www.hutool.cn/docs/#/poi/Word生成-Word07Writer?id=介绍)

Hutool将POI中Word生成封装为`Word07Writer`, 通过分段写出，实现word生成。

## [使用例子](https://www.hutool.cn/docs/#/poi/Word生成-Word07Writer?id=使用例子)

```java
Word07Writer writer = new Word07Writer();

// 添加段落（标题）
writer.addText(new Font("方正小标宋简体", Font.PLAIN, 22), "我是第一部分", "我是第二部分");
// 添加段落（正文）
writer.addText(new Font("宋体", Font.PLAIN, 22), "我是正文第一部分", "我是正文第二部分");
// 写出到文件
writer.flush(FileUtil.file("e:/wordWrite.docx"));
// 关闭
writer.close();
```

# 系统属性调用-SystemUtil

## [概述](https://www.hutool.cn/docs/#/system/系统属性调用-SystemUtil?id=概述)

此工具是针对`System.getProperty(name)`的封装，通过此工具，可以获取如下信息：

### [Java Virtual Machine Specification信息](https://www.hutool.cn/docs/#/system/系统属性调用-SystemUtil?id=java-virtual-machine-specification信息)

```java
SystemUtil.getJvmSpecInfo();
```

### [Java Virtual Machine Implementation信息](https://www.hutool.cn/docs/#/system/系统属性调用-SystemUtil?id=java-virtual-machine-implementation信息)

```java
SystemUtil.getJvmInfo();
```

### [Java Specification信息](https://www.hutool.cn/docs/#/system/系统属性调用-SystemUtil?id=java-specification信息)

```java
SystemUtil.getJavaSpecInfo();
```

### [Java Implementation信息](https://www.hutool.cn/docs/#/system/系统属性调用-SystemUtil?id=java-implementation信息)

```java
SystemUtil.getJavaInfo();
```

### [Java运行时信息](https://www.hutool.cn/docs/#/system/系统属性调用-SystemUtil?id=java运行时信息)

```java
SystemUtil.getJavaRuntimeInfo();
```

### [系统信息](https://www.hutool.cn/docs/#/system/系统属性调用-SystemUtil?id=系统信息)

```java
SystemUtil.getOsInfo();
```

### [用户信息](https://www.hutool.cn/docs/#/system/系统属性调用-SystemUtil?id=用户信息)

```java
SystemUtil.getUserInfo();
```

### [当前主机网络地址信息](https://www.hutool.cn/docs/#/system/系统属性调用-SystemUtil?id=当前主机网络地址信息)

```java
SystemUtil.getHostInfo();
```

### [运行时信息，包括内存总大小、已用大小、可用大小等](https://www.hutool.cn/docs/#/system/系统属性调用-SystemUtil?id=运行时信息，包括内存总大小、已用大小、可用大小等)

```java
SystemUtil.getRuntimeInfo();
```

# Oshi封装-OshiUtil

## [概述](https://www.hutool.cn/docs/#/system/Oshi封装-OshiUtil?id=概述)

`Oshi`是Java的免费基于JNA的操作系统和硬件信息库，Github地址是：https://github.com/oshi/oshi

它的优点是不需要安装任何其他本机库，并且旨在提供一种跨平台的实现来检索系统信息，例如操作系统版本，进程，内存和CPU使用率，磁盘和分区，设备，传感器等。

这个库可以监测的内容包括：

1. 计算机系统和固件，底板
2. 操作系统和版本/内部版本
3. 物理（核心）和逻辑（超线程）CPU，处理器组，NUMA节点
4. 系统和每个处理器的负载百分比和滴答计数器
5. CPU正常运行时间，进程和线程
6. 进程正常运行时间，CPU，内存使用率，用户/组，命令行
7. 已使用/可用的物理和虚拟内存
8. 挂载的文件系统（类型，可用空间和总空间）
9. 磁盘驱动器（型号，序列号，大小）和分区
10. 网络接口（IP，带宽输入/输出）
11. 电池状态（电量百分比，剩余时间，电量使用情况统计信息）
12. 连接的显示器（带有EDID信息）
13. USB设备
14. 传感器（温度，风扇速度，电压）

也就是说配合一个前端界面，完全可以搞定系统监控了。

## [使用](https://www.hutool.cn/docs/#/system/Oshi封装-OshiUtil?id=使用)

先引入Oshi库：

```xml
<dependency>
    <groupId>com.github.oshi</groupId>
    <artifactId>oshi-core</artifactId>
    <version>5.6.1</version>
</dependency>
```

然后可以调用相关API获取相关信息。

例如我们像获取内存总量：

```java
long total = OshiUtil.getMemory().getTotal();
```

我们也可以获取CPU的一些信息：

```java
CpuInfo cpuInfo = OshiUtil.getCpuInfo();
Console.log(cpuInfo);
CpuInfo{cpu核心数=12, CPU总的使用率=12595.0, CPU系统使用率=1.74, CPU用户使用率=6.69, CPU当前等待率=0.0, CPU当前空闲率=91.57, CPU利用率=8.43, CPU型号信息='AMD Ryzen 5 4600U with Radeon Graphics         
 1 physical CPU package(s)
 6 physical CPU core(s)
 12 logical CPU(s)
Identifier: AuthenticAMD Family 23 Model 96 Stepping 1
ProcessorID: xxxxxxxxx
Microarchitecture: unknown'}
```

# 图形验证码

## [由来](https://www.hutool.cn/docs/#/captcha/概述?id=由来)

由于对验证码需求量巨大，且我之前项目中有所积累，因此在Hutool中加入验证码生成和校验功能。

## [介绍](https://www.hutool.cn/docs/#/captcha/概述?id=介绍)

验证码功能位于`cn.hutool.captcha`包中，核心接口为`ICaptcha`，此接口定义了以下方法：

- `createCode` 创建验证码，实现类需同时生成随机验证码字符串和验证码图片
- `getCode` 获取验证码的文字内容
- `verify` 验证验证码是否正确，建议忽略大小写
- `write` 将验证码写出到目标流中

其中write方法只有一个`OutputStream`，`ICaptcha`实现类可以根据这个方法封装写出到文件等方法。

`AbstractCaptcha`为一个`ICaptcha`抽象实现类，此类实现了验证码文本生成、非大小写敏感的验证、写出到流和文件等方法，通过继承此抽象类只需实现`createImage`方法定义图形生成规则即可。

## [实现类](https://www.hutool.cn/docs/#/captcha/概述?id=实现类)

### [`LineCaptcha` 线段干扰的验证码](https://www.hutool.cn/docs/#/captcha/概述?id=linecaptcha-线段干扰的验证码)

生成效果大致如下： ![img](https://static.oschina.net/uploads/img/201712/16113708_B8Hu.png)

贴栗子：

```java
//定义图形验证码的长和宽
LineCaptcha lineCaptcha = CaptchaUtil.createLineCaptcha(200, 100);

//图形验证码写出，可以写出到文件，也可以写出到流
lineCaptcha.write("d:/line.png");
//输出code
Console.log(lineCaptcha.getCode());
//验证图形验证码的有效性，返回boolean值
lineCaptcha.verify("1234");

//重新生成验证码
lineCaptcha.createCode();
lineCaptcha.write("d:/line.png");
//新的验证码
Console.log(lineCaptcha.getCode());
//验证图形验证码的有效性，返回boolean值
lineCaptcha.verify("1234");
```

### [`CircleCaptcha` 圆圈干扰验证码](https://www.hutool.cn/docs/#/captcha/概述?id=circlecaptcha-圆圈干扰验证码)

![img](https://static.oschina.net/uploads/img/201712/16113738_eqt9.png)

贴栗子：

```java
//定义图形验证码的长、宽、验证码字符数、干扰元素个数
CircleCaptcha captcha = CaptchaUtil.createCircleCaptcha(200, 100, 4, 20);
//CircleCaptcha captcha = new CircleCaptcha(200, 100, 4, 20);
//图形验证码写出，可以写出到文件，也可以写出到流
captcha.write("d:/circle.png");
//验证图形验证码的有效性，返回boolean值
captcha.verify("1234");
```

### [`ShearCaptcha` 扭曲干扰验证码](https://www.hutool.cn/docs/#/captcha/概述?id=shearcaptcha-扭曲干扰验证码)

![img](https://static.oschina.net/uploads/img/201712/16113807_sICp.png)

贴栗子：

```java
//定义图形验证码的长、宽、验证码字符数、干扰线宽度
ShearCaptcha captcha = CaptchaUtil.createShearCaptcha(200, 100, 4, 4);
//ShearCaptcha captcha = new ShearCaptcha(200, 100, 4, 4);
//图形验证码写出，可以写出到文件，也可以写出到流
captcha.write("d:/shear.png");
//验证图形验证码的有效性，返回boolean值
captcha.verify("1234");
```

## [写出到浏览器（Servlet输出）](https://www.hutool.cn/docs/#/captcha/概述?id=写出到浏览器（servlet输出）)

```java
ICaptcha captcha = ...;
captcha.write(response.getOutputStream());
//Servlet的OutputStream记得自行关闭哦！
```

## [自定义验证码](https://www.hutool.cn/docs/#/captcha/概述?id=自定义验证码)

有时候标准的验证码不满足要求，比如我们希望使用纯字母的验证码、纯数字的验证码、加减乘除的验证码，此时我们就要自定义`CodeGenerator`

```java
// 自定义纯数字的验证码（随机4位数字，可重复）
RandomGenerator randomGenerator = new RandomGenerator("0123456789", 4);
LineCaptcha lineCaptcha = CaptchaUtil.createLineCaptcha(200, 100);
lineCaptcha.setGenerator(randomGenerator);
// 重新生成code
lineCaptcha.createCode();
ShearCaptcha captcha = CaptchaUtil.createShearCaptcha(200, 45, 4, 4);
// 自定义验证码内容为四则运算方式
captcha.setGenerator(new MathGenerator());
// 重新生成code
captcha.createCode();
```

# NIO封装-NioServer和NioClient

## [由来](https://www.hutool.cn/docs/#/socket/NIO封装-NioServer和NioClient?id=由来)

Hutool对NIO其进行了简单的封装。

## [使用](https://www.hutool.cn/docs/#/socket/NIO封装-NioServer和NioClient?id=使用)

### [服务端](https://www.hutool.cn/docs/#/socket/NIO封装-NioServer和NioClient?id=服务端)

```java
NioServer server = new NioServer(8080);
server.setChannelHandler((sc)->{
    ByteBuffer readBuffer = ByteBuffer.allocate(1024);
    try{
        //从channel读数据到缓冲区
        int readBytes = sc.read(readBuffer);
        if (readBytes > 0) {
            //Flips this buffer.  The limit is set to the current position and then
            // the position is set to zero，就是表示要从起始位置开始读取数据
            readBuffer.flip();
            //eturns the number of elements between the current position and the  limit.
            // 要读取的字节长度
            byte[] bytes = new byte[readBuffer.remaining()];
            //将缓冲区的数据读到bytes数组
            readBuffer.get(bytes);
            String body = StrUtil.utf8Str(bytes);
            Console.log("[{}]: {}", sc.getRemoteAddress(), body);
            doWrite(sc, body);
        } else if (readBytes < 0) {
            IoUtil.close(sc);
        }
    } catch (IOException e){
        throw new IORuntimeException(e);
    }
});
server.listen();
public static void doWrite(SocketChannel channel, String response) throws IOException {
    response = "收到消息：" + response;
    //将缓冲数据写入渠道，返回给客户端
    channel.write(BufferUtil.createUtf8(response));
}
```

### [客户端](https://www.hutool.cn/docs/#/socket/NIO封装-NioServer和NioClient?id=客户端)

```java
NioClient client = new NioClient("127.0.0.1", 8080);
client.setChannelHandler((sc)->{
    ByteBuffer readBuffer = ByteBuffer.allocate(1024);
    //从channel读数据到缓冲区
    int readBytes = sc.read(readBuffer);
    if (readBytes > 0) {
        //Flips this buffer.  The limit is set to the current position and then
        // the position is set to zero，就是表示要从起始位置开始读取数据
        readBuffer.flip();
        //returns the number of elements between the current position and the  limit.
        // 要读取的字节长度
        byte[] bytes = new byte[readBuffer.remaining()];
        //将缓冲区的数据读到bytes数组
        readBuffer.get(bytes);
        String body = StrUtil.utf8Str(bytes);
        Console.log("[{}]: {}", sc.getRemoteAddress(), body);
    } else if (readBytes < 0) {
        sc.close();
    }
});
client.listen();
client.write(BufferUtil.createUtf8("你好。\n"));
client.write(BufferUtil.createUtf8("你好2。"));
// 在控制台向服务器端发送数据
Console.log("请输入发送的消息：");
Scanner scanner = new Scanner(System.in);
while (scanner.hasNextLine()) {
    String request = scanner.nextLine();
    if (request != null && request.trim().length() > 0) {
        client.write(BufferUtil.createUtf8(request));
    }
}
```

# AIO封装-AioServer和AioClient

## [由来](https://www.hutool.cn/docs/#/socket/AIO封装-AioServer和AioClient?id=由来)

在JDK7+后，提供了异步Socket库——AIO，Hutool对其进行了简单的封装。

## [使用](https://www.hutool.cn/docs/#/socket/AIO封装-AioServer和AioClient?id=使用)

### [服务端](https://www.hutool.cn/docs/#/socket/AIO封装-AioServer和AioClient?id=服务端)

```java
AioServer aioServer = new AioServer(8899);
aioServer.setIoAction(new SimpleIoAction() {
    
    @Override
    public void accept(AioSession session) {
        StaticLog.debug("【客户端】：{} 连接。", session.getRemoteAddress());
        session.write(BufferUtil.createUtf8("=== Welcome to Hutool socket server. ==="));
    }
    
    @Override
    public void doAction(AioSession session, ByteBuffer data) {
        Console.log(data);
        
        if(false == data.hasRemaining()) {
            StringBuilder response = StrUtil.builder()//
                    .append("HTTP/1.1 200 OK\r\n")//
                    .append("Date: ").append(DateUtil.formatHttpDate(DateUtil.date())).append("\r\n")//
                    .append("Content-Type: text/html; charset=UTF-8\r\n")//
                    .append("\r\n")
                    .append("Hello Hutool socket");//
            session.writeAndClose(BufferUtil.createUtf8(response));
        }else {
            session.read();
        }
    }
}).start(true);
```

### [客户端](https://www.hutool.cn/docs/#/socket/AIO封装-AioServer和AioClient?id=客户端)

```java
AioClient client = new AioClient(new InetSocketAddress("localhost", 8899), new SimpleIoAction() {
    
    @Override
    public void doAction(AioSession session, ByteBuffer data) {
        if(data.hasRemaining()) {
            Console.log(StrUtil.utf8Str(data));
            session.read();
        }
        Console.log("OK");
    }
});

client.write(ByteBuffer.wrap("Hello".getBytes()));
client.read();

client.close();
```

# JWT工具-JWTUtil

## [介绍](https://www.hutool.cn/docs/#/jwt/JWT工具-JWTUtil?id=介绍)

我们可以通过`JWT`实现链式创建JWT对象或JWT字符串，Hutool同样提供了一些快捷方法封装在`JWTUtil`中。主要包括：

- JWT创建
- JWT解析
- JWT验证

## [使用](https://www.hutool.cn/docs/#/jwt/JWT工具-JWTUtil?id=使用)

- JWT创建

```java
Map<String, Object> map = new HashMap<String, Object>() {
    private static final long serialVersionUID = 1L;
    {
        put("uid", Integer.parseInt("123"));
        put("expire_time", System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 15);
    }
};

JWTUtil.createToken(map, "1234".getBytes());
```

- JWT解析

```java
String rightToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9." +
    "eyJzdWIiOiIxMjM0NTY3ODkwIiwiYWRtaW4iOnRydWUsIm5hbWUiOiJsb29seSJ9." +
    "U2aQkC2THYV9L0fTN-yBBI7gmo5xhmvMhATtu8v0zEA";

final JWT jwt = JWTUtil.parseToken(rightToken);

jwt.getHeader(JWTHeader.TYPE);
jwt.getPayload("sub");
```

- JWT验证

```java
String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
    "eyJ1c2VyX25hbWUiOiJhZG1pbiIsInNjb3BlIjpbImFsbCJdLCJleHAiOjE2MjQwMDQ4MjIsInVzZXJJZCI6MSwiYXV0aG9yaXRpZXMiOlsiUk9MRV_op5LoibLkuozlj7ciLCJzeXNfbWVudV8xIiwiUk9MRV_op5LoibLkuIDlj7ciLCJzeXNfbWVudV8yIl0sImp0aSI6ImQ0YzVlYjgwLTA5ZTctNGU0ZC1hZTg3LTVkNGI5M2FhNmFiNiIsImNsaWVudF9pZCI6ImhhbmR5LXNob3AifQ." +
    "aixF1eKlAKS_k3ynFnStE7-IRGiD5YaqznvK2xEjBew";

JWTUtil.verify(token, "123456".getBytes());
```

# JWT签名工具-JWTSignerUtil

## [介绍](https://www.hutool.cn/docs/#/jwt/JWT签名工具-JWTSignerUtil?id=介绍)

JWT签名算法比较多，主要分为非对称算法和对称算法，支持的算法定义在`SignAlgorithm`中。

### [对称签名](https://www.hutool.cn/docs/#/jwt/JWT签名工具-JWTSignerUtil?id=对称签名)

- HS256(HmacSHA256)
- HS384(HmacSHA384)
- HS512(HmacSHA512)

### [非对称签名](https://www.hutool.cn/docs/#/jwt/JWT签名工具-JWTSignerUtil?id=非对称签名)

- RS256(SHA256withRSA)
- RS384(SHA384withRSA)
- RS512(SHA512withRSA)
- ES256(SHA256withECDSA)
- ES384(SHA384withECDSA)
- ES512(SHA512withECDSA)

### [依赖于BounyCastle的算法](https://www.hutool.cn/docs/#/jwt/JWT签名工具-JWTSignerUtil?id=依赖于bounycastle的算法)

- PS256(SHA256WithRSA/PSS)
- PS384(SHA384WithRSA/PSS)
- PS512(SHA512WithRSA/PSS)

## [使用](https://www.hutool.cn/docs/#/jwt/JWT签名工具-JWTSignerUtil?id=使用)

### [创建预定义算法签名器](https://www.hutool.cn/docs/#/jwt/JWT签名工具-JWTSignerUtil?id=创建预定义算法签名器)

`JWTSignerUtil`中预定义了一些算法的签名器的创建方法，如创建HS256的签名器：

```java
final JWTSigner signer = JWTSignerUtil.hs256("123456".getBytes());
JWT jwt = JWT.create().setSigner(signer);
```

### [创建自定义算法签名器](https://www.hutool.cn/docs/#/jwt/JWT签名工具-JWTSignerUtil?id=创建自定义算法签名器)

通过`JWTSignerUtil.createSigner`即可通过动态传入`algorithmId`创建对应的签名器，如我们如果需要实现`ps256`算法，则首先引入`bcprov-jdk15to18`包：

```xml
<dependency>
    <groupId>org.bouncycastle</groupId>
    <artifactId>bcprov-jdk15to18</artifactId>
    <version>1.69</version>
</dependency>
```

再创建对应签名器即可：

```java
String id = "ps256";
final JWTSigner signer = JWTSignerUtil.createSigner(id, KeyUtil.generateKeyPair(AlgorithmUtil.getAlgorithm(id)));

JWT jwt = JWT.create().setSigner(signer);
```

### [自行实现算法签名器](https://www.hutool.cn/docs/#/jwt/JWT签名工具-JWTSignerUtil?id=自行实现算法签名器)

`JWTSigner`接口是一个通用的签名器接口，如果想实现自定义算法，实现此接口即可。

# JWT验证-JWTValidator

## [介绍](https://www.hutool.cn/docs/#/jwt/JWT验证-JWTValidator?id=介绍)

由于`JWT.verify`，只能验证JWT Token的签名是否有效，其他payload字段验证都可以使用`JWTValidator`完成。

## [使用](https://www.hutool.cn/docs/#/jwt/JWT验证-JWTValidator?id=使用)

### [验证算法](https://www.hutool.cn/docs/#/jwt/JWT验证-JWTValidator?id=验证算法)

算法的验证包括两个方面

1. 验证header中算法ID和提供的算法ID是否一致
2. 调用`JWT.verify`验证token是否正确

```java
// 创建JWT Token
final String token = JWT.create()
    .setNotBefore(DateUtil.date())
    .setKey("123456".getBytes())
    .sign();

// 验证算法
JWTValidator.of(token).validateAlgorithm(JWTSignerUtil.hs256("123456".getBytes()));
```

### [验证时间](https://www.hutool.cn/docs/#/jwt/JWT验证-JWTValidator?id=验证时间)

对于时间类载荷，有单独的验证方法，主要包括：

- 生效时间（`JWTPayload#NOT_BEFORE`）不能晚于当前时间
- 失效时间（`JWTPayload#EXPIRES_AT`）不能早于当前时间
- 签发时间（`JWTPayload#ISSUED_AT`）不能晚于当前时间

一般时间线是：

(签发时间)---------(生效时间)---------(**当前时间**)---------(失效时间)

> 签发时间和生效时间一般没有前后要求，都早于当前时间即可。

```java
final String token = JWT.create()
    // 设置签发时间
    .setIssuedAt(DateUtil.date())
    .setKey("123456".getBytes())
    .sign();

// 由于只定义了签发时间，因此只检查签发时间
JWTValidator.of(token).validateDate(DateUtil.date());
```