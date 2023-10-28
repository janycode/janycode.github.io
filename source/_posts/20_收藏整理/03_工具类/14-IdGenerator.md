---
title: 14-IdGenerator
date: 2020-09-10 21:37:57
tags:
- 工具类
categories: 
- 20_收藏整理
- 03_工具类
---



### IdGenerator

```java
/**
 * twitter的一个id生成算法  雪花算法
 * <p>
 * Twitter-Snowflake算法产生的背景相当简单，为了满足Twitter每秒上万条消息的请求，
 * 每条消息都必须分配一条唯一的id，这些id还需要一些大致的顺序（方便客户端排序），
 * 并且在分布式系统中不同机器产生的id必须不同。
 * 000000000000
 * 1位标识，由于long基本类型在Java中是带符号的，最高位是符号位，正数是0，负数是1，所以id一般是正数，最高位是0<br>
 * 41位时间截(毫秒级)，注意，41位时间截不是存储当前时间的时间截，而是存储时间截的差值（当前时间截 - 开始时间截)
 * 得到的值），这里的的开始时间截，一般是我们的id生成器开始使用的时间
 * ，由我们程序来指定的（如下下面程序IdWorker类的startTime属性）。41位的时间截，可以使用69年，年T = (1L << 41) /
 * (1000L * 60 * 60 * 24 * 365) = 69<br>
 * 10位的数据机器位，可以部署在1024个节点，包括5位datacenterId和5位workerId<br>
 * 12位序列，毫秒内的计数，12位的计数顺序号支持每个节点每毫秒(同一机器，同一时间截)产生4096个ID序号<br>
 * 加起来刚好64位，为一个Long型。<br>
 * SnowFlake的优点是，整体上按照时间自增排序，并且整个分布式系统内不会产生ID碰撞(由数据中心ID和机器ID作区分)，并且效率较高，经测试，
 * SnowFlake每秒能够产生26万ID左右。
 */
public class IdGenerator {

    /**
     * 开始时间截 (2015-01-01)
     */
    private final long twepoch = 1420041600000L;

    /**
     * 机器id所占的位数
     */
    private final long workerIdBits = 5L;

    /**
     * 数据标识id所占的位数
     */
    private final long datacenterIdBits = 5L;

    /**
     * 支持的最大机器id，结果是31 (这个移位算法可以很快的计算出几位二进制数所能表示的最大十进制数)
     */
    private final long maxWorkerId = -1L ^ (-1L << workerIdBits);

    /**
     * 支持的最大数据标识id，结果是31
     */
    private final long maxDatacenterId = -1L ^ (-1L << datacenterIdBits);

    /**
     * 序列在id中占的位数
     */
    private final long sequenceBits = 12L;

    /**
     * 机器ID向左移12位
     */
    private final long workerIdShift = sequenceBits;

    /**
     * 数据标识id向左移17位(12+5)
     */
    private final long datacenterIdShift = sequenceBits + workerIdBits;

    /**
     * 时间截向左移22位(5+5+12)
     */
    private final long timestampLeftShift = sequenceBits + workerIdBits
            + datacenterIdBits;

    /**
     * 生成序列的掩码，这里为4095 (0b111111111111=0xfff=4095)
     */
    private final long sequenceMask = -1L ^ (-1L << sequenceBits);

    /**
     * 工作机器ID(0~31)
     */
    private long workerId;

    /**
     * 数据中心ID(0~31)
     */
    private long datacenterId;

    /**
     * 毫秒内序列(0~4095)
     */
    private long sequence = 0L;

    /**
     * 上次生成ID的时间截
     */
    private long lastTimestamp = -1L;

    /**
     * 构造函数
     *
     * @param workerId     工作ID (0~31)
     * @param datacenterId 数据中心ID (0~31)
     */
    public IdGenerator(long workerId, long datacenterId) {
        if (workerId > maxWorkerId || workerId < 0) {
            throw new IllegalArgumentException(String.format(
                    "worker Id can't be greater than %d or less than 0",
                    maxWorkerId));
        }
        if (datacenterId > maxDatacenterId || datacenterId < 0) {
            throw new IllegalArgumentException(String.format(
                    "datacenter Id can't be greater than %d or less than 0",
                    maxDatacenterId));
        }
        this.workerId = workerId;
        this.datacenterId = datacenterId;
    }

    public IdGenerator() {
        this.workerId = 0l;
        this.datacenterId = 0l;
    }

    ;

    /**
     * 获得下一个ID (该方法是线程安全的)
     *
     * @return SnowflakeId
     */
    public synchronized long nextId() {
        long timestamp = timeGen();

        // 如果当前时间小于上一次ID生成的时间戳，说明系统时钟回退过这个时候应当抛出异常
        if (timestamp < lastTimestamp) {
            throw new RuntimeException(
                    String.format(
                            "Clock moved backwards.  Refusing to generate id for %d milliseconds",
                            lastTimestamp - timestamp));
        }

        // 如果是同一时间生成的，则进行毫秒内序列
        if (lastTimestamp == timestamp) {
            sequence = (sequence + 1) & sequenceMask;
            // 毫秒内序列溢出
            if (sequence == 0) {
                // 阻塞到下一个毫秒,获得新的时间戳
                timestamp = tilNextMillis(lastTimestamp);
            }
        }
        // 时间戳改变，毫秒内序列重置
        else {
            sequence = 0L;
        }

        // 上次生成ID的时间截
        lastTimestamp = timestamp;

        // 移位并通过或运算拼到一起组成64位的ID
        return ((timestamp - twepoch) << timestampLeftShift)
                | (datacenterId << datacenterIdShift)
                | (workerId << workerIdShift)
                | sequence;
    }

    /**
     * 阻塞到下一个毫秒，直到获得新的时间戳
     *
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
     *
     * @return 当前时间(毫秒)
     */
    protected long timeGen() {
        return System.currentTimeMillis();
    }
}
```

### Hutool雪花id

```java
import cn.hutool.core.lang.Snowflake;
import cn.hutool.core.util.IdUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.InetAddress;

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



### Hutool雪花id封装 - 推荐

注入如下 service 调用 generatorStoreId() 即可。

```java
public interface IdGeneratorService {
    Long generatorStoreId();
}
```

```java
import cn.hutool.core.lang.Snowflake;
import cn.hutool.core.util.IdUtil;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RAtomicLong;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class IdGeneratorServiceImpl implements IdGeneratorService, InitializingBean {

    private static final String WORK_ID_FORMAT = "id:generator:wordId";
    private static final String SNOW_FLAKE_LOCK = "id:generator:lock";
    private static final String CENTER_ID_FORMAT = "id:generator:center";
    private final int MAX_CENTER_ID = 31;
    private Snowflake snowflake;
    
    @Autowired
    private RedissonClient redissonClient;

    @SneakyThrows
    private void generatorWorkAndCenterId() {
        RLock rLock = redissonClient.getLock(SNOW_FLAKE_LOCK);
        boolean b = rLock.tryLock(20, TimeUnit.SECONDS);
        if (!b) {
            throw new Exception("锁超时");
        }
        try {
            int workId = getWorkId();
            int centerId = getCenterId(workId);
            snowflake = IdUtil.getSnowflake(workId, centerId);
            log.info("snowFlake init success centerId:{} workId:{}", centerId, workId);

        } finally {
            rLock.unlock();
        }
    }

    private int getWorkId() {
        int workId;
        // 先修改workId 如果workId不重置为0无需修改centerId
        RAtomicLong atomicLong = redissonClient.getAtomicLong(WORK_ID_FORMAT);
        Long l = atomicLong.get();
        if (l.intValue() >= MAX_CENTER_ID) {
            atomicLong.set(0);
            workId = 0;
        } else {
            l = atomicLong.incrementAndGet();
            workId = l.intValue();
        }
        return workId;
    }

    private int getCenterId(int workId) {
        int centerId;
        RAtomicLong centerAtomicLong = redissonClient.getAtomicLong(CENTER_ID_FORMAT);
        Long cl = centerAtomicLong.get();
        // 先修改workId 如果workId不重置为0无需修改centerId
        if(workId > 0){
                centerId = cl.intValue();
        }else{
            if (cl.intValue() >= MAX_CENTER_ID) {
                centerAtomicLong.set(0);
                centerId = 0;
            } else {
                cl = centerAtomicLong.incrementAndGet();
                centerId = cl.intValue();
            }
        }
        return centerId;
    }


    @Override
    public Long generatorStoreId() {
        return snowflake.nextId();
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        generatorWorkAndCenterId();
        Long snowId = generatorStoreId();
        log.info("验证snowflake生成正常,生成id：{}",snowId);
    }
}
```

