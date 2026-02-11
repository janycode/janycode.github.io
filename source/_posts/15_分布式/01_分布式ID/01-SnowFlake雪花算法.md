---
title: 01-SnowFlake雪花算法
date: 2020-04-05 10:51:30
tags:
- 架构
- 分布式
categories: 
- 15_分布式
- 01_分布式ID
---



![image-20220205110804463](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220205110805.png)

参考资料：

[GitHub - beyondfengyu/SnowFlake: Twitter的雪花算法SnowFlake，使用Java语言实现。](https://github.com/beyondfengyu/SnowFlake)

[唯一ID工具-IdUtil (hutool.cn)](https://www.hutool.cn/docs/#/core/工具类/唯一ID工具-IdUtil?id=使用)

### 1. ID组成结构

![20200727173229821](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220205111906.png)

* **1位，不用。**

  二进制中最高位为1的都是负数，但是我们生成的id一般都使用整数，所以这个最高位固定是0。

* **41位，用来记录时间戳（毫秒）**。
  
       * 41位可以表示$2^{41}-1$个数字
           * 如果只用来表示正整数（计算机中正数包含0），可以表示的数值范围是：0 至 $2^{41}-1$，减1是因为可表示的数值范围是从0开始算的，而不是1。
           * 也就是说41位可以表示$2^{41}-1$个毫秒的值，转化成单位年则是$(2^{41}-1) / (1000 * 60 * 60 * 24 * 365) = 69$年。
   
* **10位，用来记录工作机器id**。
       * 可以部署在$2^{10} = 1024$个节点，包括 5位datacenterId 和 5位workerId。
           * 5位（bit）可以表示的最大正整数是$2^{5}-1 = 31$，即可以用0、1、2、3、....31这32个数字，来表示不同的datecenterId或workerId。
   
* **12位，序列号，用来记录同毫秒内产生的不同id**。
  
       * 12位（bit）可以表示的最大正整数是$2^{12}-1 = 4095$，即可以用0、1、2、3、....4094这4095个数字，来表示同一机器同一时间截（毫秒)内产生的4095个ID序号。

由于在Java中64bit的整数是long类型，所以在Java中SnowFlake算法生成的id就是long来存储的。

SnowFlake可以保证：

​        ●  所有生成的id按时间趋势递增

​        ●  整个分布式系统内不会产生重复id（因为有datacenterId和workerId来做区分）

### 2. 存在问题和解决

* *时间回拨问题*：由于机器的时间是动态的调整的，有可能会出现时间跑到之前几毫秒，如果这个时候获取到了这种时间，则会出现数据重复

* *机器id分配及回收问题*：目前机器id需要每台机器不一样，这样的方式分配需要有方案进行处理，同时也要考虑，如果改机器宕机了，对应的workerId分配后的回收问题

* *机器id上限*：机器id是固定的bit，那么也就是对应的机器个数是有上限的，在有些业务场景下，需要所有机器共享同一个业务空间，那么10bit表示的1024台机器是不够的。

参考资料：https://github.com/SimonAlong/Butterfly

Butterfly（蝴蝶）是一个超高性能的发号器框架。框架通过引入多种新的方案不仅解决了雪花算法存在的所有问题，而且还能够提供比雪花算法更高的性能。

1. 时间回拨问题

   这里采用新的方案：大概思路是：时间戳采用的是`历史时间`，每次请求只增序列值，序列值增满，然后“历史时间”增1，序列值归0，其中"历史时间"的初始值是应用启动时候的当前时间。

2. 机器id分配和回收

   这里机器id分配和回收具体有两种方案：`zookeeper`和`db`。理论上分配方案zk是通过哈希和扩容机器，而db是通过查找机制。回收方案，zk采用的是永久节点，节点中存储下次过期时间，客户端定时上报（设置心跳），db是添加过期时间字段，查找时候判断过期字段。

3. 机器id上限

   这个采用将`改造版雪花+zookeeper分配id`方案作为服务端的节点，客户端采用双Buffer+异步获取提高性能，服务端采用每次请求时间戳增1。



### 3. ID生成使用

Hutool工具中：

分布式系统中，有一些需要使用全局唯一ID的场景，有些时候我们希望能使用一种简单一些的ID，并且希望ID能够按照时间有序生成。Twitter的Snowflake 算法就是这种生成器。

使用方法如下：

```java
//参数1为终端ID, 参数2为数据中心ID
Snowflake snowflake = IdUtil.getSnowflake(1, 1);
long id = snowflake.nextId();
```

> 注意 `IdUtil.createSnowflake`每次调用会创建一个新的Snowflake对象，不同的Snowflake对象创建的ID可能会有重复，因此请自行维护此对象为单例，或者使用`IdUtil.getSnowflake`使用`全局单例对象`。

网上的教程一般存在两个问题：
                1. 机器ID（5位）和数据中心ID（5位）配置没有解决，分布式部署的时候会使用相同的配置，任然有ID重复的风险。
                2. 使用的时候要实例化对象，没有形成开箱即用的工具类。

本文针对上面两个问题进行解决，笔者的解决方案是，workId使用服务器hostName生成，dataCenterId使用IP生成，这样可以最大限度防止10位机器码重复，但是由于两个ID都不能超过32，只能取余数，还是难免产生重复，但是实际使用中，hostName和IP的配置一般连续或相近，只要不是刚好相隔32位，就不会有问题，况且，hostName和IP同时相隔32的情况更加是几乎不可能的事，平时做的分布式部署，一般也不会超过10台容器。

使用上面的方法可以零配置使用雪花算法，雪花算法10位机器码的设定理论上可以有1024个节点，生产上使用docker配置一般是一次编译，然后分布式部署到不同容器，不会有不同的配置，这里不知道其他公司是如何解决的，即使有方法使用一套配置，然后运行时根据不同容器读取不同的配置，但是给每个容器编配ID，1024个（大部分情况下没有这么多），似乎也不太可能，此问题留待日后解决后再行补充。

 具体生成 workId 和 dataCenterId 的方法如下：

```java
 private static Long getWorkId(){
        try {
            String hostAddress = Inet4Address.getLocalHost().getHostAddress();
            int[] ints = StringUtils.toCodePoints(hostAddress);
            int sums = 0;
            for(int b : ints){
                sums += b;
            }
            return (long)(sums % 32);
        } catch (UnknownHostException e) {
            //如果获取失败，则使用随机数备用
            return RandomUtils.nextLong(0,31);
        }
    }
 
    private static Long getDataCenterId(){
        int[] ints = StringUtils.toCodePoints(SystemUtils.getHostName());
        int sums = 0;
        for (int i: ints) {
            sums += i;
        }
        return (long)(sums % 32);
    }
```

使用上面的方法需要增加Apache Commons lang3 的依赖，这也是此方法的缺点，但是在实际使用的时候，lang3这个类一般也是要引入的，非常非常好用，提高效率的利器 (注意：`这里的commons-lang3必须是 3.8版本或者更高版本，否则低于这个版本会报没有toCodePoints(CharSequence str) 和 getHostName()方法`)。

```java
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.8</version>
</dependency>
```

最终完整代码如下：

```java
import org.apache.commons.lang3.RandomUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.SystemUtils;
 
import java.net.Inet4Address;
import java.net.UnknownHostException;
 
/**
 * Twitter_Snowflake<br>
 * SnowFlake的结构如下(每部分用-分开):<br>
 * 0 - 0000000000 0000000000 0000000000 0000000000 0 - 00000 - 00000 - 000000000000 <br>
 * 1位标识，由于long基本类型在Java中是带符号的，最高位是符号位，正数是0，负数是1，所以id一般是正数，最高位是0<br>
 * 41位时间截(毫秒级)，注意，41位时间截不是存储当前时间的时间截，而是存储时间截的差值（当前时间截 - 开始时间截)
 * 得到的值），这里的的开始时间截，一般是我们的id生成器开始使用的时间，由我们程序来指定的（如下下面程序IdWorker类的startTime属性）。41位的时间截，可以使用69年，年T = (1L << 41) / (1000L * 60 * 60 * 24 * 365) = 69<br>
 * 10位的数据机器位，可以部署在1024个节点，包括5位datacenterId和5位workerId<br>
 * 12位序列，毫秒内的计数，12位的计数顺序号支持每个节点每毫秒(同一机器，同一时间截)产生4096个ID序号<br>
 * 加起来刚好64位，为一个Long型。<br>
 * SnowFlake的优点是，整体上按照时间自增排序，并且整个分布式系统内不会产生ID碰撞(由数据中心ID和机器ID作区分)，并且效率较高，经测试，SnowFlake在我本地每秒能够产生26万ID左右。
 */
public class SnowflakeIdWorker {
 
    // ==============================Fields===========================================
    /** 开始时间截 (2015-01-01) */
    private final long twepoch = 1489111610226L;
 
    /** 机器id所占的位数 */
    private final long workerIdBits = 5L;
 
    /** 数据标识id所占的位数 */
    private final long dataCenterIdBits = 5L;
 
    /** 支持的最大机器id，结果是31 (这个移位算法可以很快的计算出几位二进制数所能表示的最大十进制数) */
    private final long maxWorkerId = -1L ^ (-1L << workerIdBits);
 
    /** 支持的最大数据标识id，结果是31 */
    private final long maxDataCenterId = -1L ^ (-1L << dataCenterIdBits);
 
    /** 序列在id中占的位数 */
    private final long sequenceBits = 12L;
 
    /** 机器ID向左移12位 */
    private final long workerIdShift = sequenceBits;
 
    /** 数据标识id向左移17位(12+5) */
    private final long dataCenterIdShift = sequenceBits + workerIdBits;
 
    /** 时间截向左移22位(5+5+12) */
    private final long timestampLeftShift = sequenceBits + workerIdBits + dataCenterIdBits;
 
    /** 生成序列的掩码，这里为4095 (0b111111111111=0xfff=4095) */
    private final long sequenceMask = -1L ^ (-1L << sequenceBits);
 
    /** 工作机器ID(0~31) */
    private long workerId;
 
    /** 数据中心ID(0~31) */
    private long dataCenterId;
 
    /** 毫秒内序列(0~4095) */
    private long sequence = 0L;
 
    /** 上次生成ID的时间截 */
    private long lastTimestamp = -1L;
 
    private static SnowflakeIdWorker idWorker;
 
    static {
        idWorker = new SnowflakeIdWorker(getWorkId(),getDataCenterId());
    }
 
    //==============================Constructors=====================================
    /**
     * 构造函数
     * @param workerId 工作ID (0~31)
     * @param dataCenterId 数据中心ID (0~31)
     */
    public SnowflakeIdWorker(long workerId, long dataCenterId) {
        if (workerId > maxWorkerId || workerId < 0) {
            throw new IllegalArgumentException(String.format("workerId can't be greater than %d or less than 0", maxWorkerId));
        }
        if (dataCenterId > maxDataCenterId || dataCenterId < 0) {
            throw new IllegalArgumentException(String.format("dataCenterId can't be greater than %d or less than 0", maxDataCenterId));
        }
        this.workerId = workerId;
        this.dataCenterId = dataCenterId;
    }
 
    // ==============================Methods==========================================
    /**
     * 获得下一个ID (该方法是线程安全的)
     * @return SnowflakeId
     */
    public synchronized long nextId() {
        long timestamp = timeGen();
 
        //如果当前时间小于上一次ID生成的时间戳，说明系统时钟回退过这个时候应当抛出异常
        if (timestamp < lastTimestamp) {
            throw new RuntimeException(
                    String.format("Clock moved backwards.  Refusing to generate id for %d milliseconds", lastTimestamp - timestamp));
        }
 
        //如果是同一时间生成的，则进行毫秒内序列
        if (lastTimestamp == timestamp) {
            sequence = (sequence + 1) & sequenceMask;
            //毫秒内序列溢出
            if (sequence == 0) {
                //阻塞到下一个毫秒,获得新的时间戳
                timestamp = tilNextMillis(lastTimestamp);
            }
        }
        //时间戳改变，毫秒内序列重置
        else {
            sequence = 0L;
        }
 
        //上次生成ID的时间截
        lastTimestamp = timestamp;
 
        //移位并通过或运算拼到一起组成64位的ID
        return ((timestamp - twepoch) << timestampLeftShift)
                | (dataCenterId << dataCenterIdShift)
                | (workerId << workerIdShift)
                | sequence;
    }
 
    /**
     * 阻塞到下一个毫秒，直到获得新的时间戳
     * @param lastTimestamp 上次生成ID的时间截
     * @return 当前时间戳
     */
    protected long tilNextMillis(long lastTimestamp) {
        long timestamp = timeGen();
        while (timestamp <= lastTimestamp) {
            timestamp = timeGen();
        }
        return timestamp;
    }
 
    /**
     * 返回以毫秒为单位的当前时间
     * @return 当前时间(毫秒)
     */
    protected long timeGen() {
        return System.currentTimeMillis();
    }
 
    private static Long getWorkId(){
        try {
            String hostAddress = Inet4Address.getLocalHost().getHostAddress();
            int[] ints = StringUtils.toCodePoints(hostAddress);
            int sums = 0;
            for(int b : ints){
                sums += b;
            }
            return (long)(sums % 32);
        } catch (UnknownHostException e) {
            // 如果获取失败，则使用随机数备用
            return RandomUtils.nextLong(0,31);
        }
    }
 
    private static Long getDataCenterId(){
        int[] ints = StringUtils.toCodePoints(SystemUtils.getHostName());
        int sums = 0;
        for (int i: ints) {
            sums += i;
        }
        return (long)(sums % 32);
    }
 
 
    /**
     * 静态工具类
     *
     * @return
     */
    public static synchronized Long generateId(){
        long id = idWorker.nextId();
        return id;
    }
 
    //==============================Test=============================================
    /** 测试 */
    public static void main(String[] args) {
        System.out.println(System.currentTimeMillis());
        long startTime = System.nanoTime();
        for (int i = 0; i < 50000; i++) {
            long id = SnowflakeIdWorker.generateId();
            System.out.println(id);
        }
        System.out.println((System.nanoTime()-startTime)/1000000+"ms");
    }
}
```

或者使用Hutool工具后更简洁的写法：

```java
import cn.hutool.core.lang.Snowflake;
import cn.hutool.core.util.IdUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.InetAddress;

/**
 * ID生成器，基于雪花算法，可用于数据库主键id生成
 *
 * @author Jerry
 * @version V1.0
 * @date 2020/04/05
 */
public class IdWorker {

    private static final Logger logger = LoggerFactory.getLogger(IdWorker.class);

    /**
     * 直接生成ID
     */
    public static long nextId() {
        Snowflake snowflake = IdUtil.getSnowflake(1, 1);
        return snowflake.nextId();
    }

    /**
     * 指定前缀生成ID
     */
    public static String nextId(String prefix) {
        int workerId = 1;
        try {
            String[] ips = InetAddress.getLocalHost().getHostAddress().split("\\.");
            workerId = Integer.parseInt(ips[ips.length - 1]);
        } catch (Exception e) {
            e.printStackTrace();
        }
        Snowflake snowflake = IdUtil.getSnowflake(workerId % 10, 1);
        return prefix + snowflake.nextId();
    }

    public static void main(String[] args) {
        logger.info("" + nextId());
    }
}
```

