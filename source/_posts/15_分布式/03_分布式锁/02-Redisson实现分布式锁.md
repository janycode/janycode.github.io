---
title: 02-Redisson实现分布式锁
date: 2021-11-18 08:02:52
tags:
- 架构
- Redis
- 分布式锁
- Redisson
categories: 
- 15_分布式
- 03_分布式锁
---

![image-20220207094644153](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220207094645.png)

# 关键词

基于NIO的Netty框架，生产环境使用分布式锁

**redisson加锁**：lua脚本加锁（其他客户端自旋）

**自动延时机制**：启动watch dog，后台线程，每隔10秒检查一下客户端1还持有锁key，会不断的延长锁key的生存时间

**可重入锁机制**：第二个if判断 ，myLock :{“8743c9c0-0795-4907-87fd-6c719a6b4586:1”:2 }

**释放锁**：无锁直接返回；有锁不是我加的，返回；有锁是我加的，执行hincrby -1,当重入锁减完才执行del操作

**Redis使用同一个Lua解释器来执行所有命令，Redis保证以一种原子性的方式来执行脚本**：当lua脚本在执行的时候，不会有其他脚本和命令同时执行，这种语义类似于 MULTI/EXEC。从别的客户端的视角来看，一个lua脚本要么不可见，要么已经执行完

# 一、 Redisson使用

Redisson是架设在Redis基础上的一个Java驻内存数据网格（In-Memory Data Grid）。
Redisson在**基于NIO的Netty框架**上，生产环境使用分布式锁。

### 加入jar包的依赖

```xml
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson</artifactId>
    <version>2.7.0</version>
</dependency>
```

### 配置Redisson

```java
public class RedissonManager {
  private static Config config = new Config();
  //声明redisso对象
  private static Redisson redisson = null;
  
   //实例化redisson
	static{
	  config.useClusterServers()
	  // 集群状态扫描间隔时间，单位是毫秒
	 .setScanInterval(2000)
	  //cluster方式至少6个节点(3主3从，3主做sharding，3从用来保证主宕机后可以高可用)
	 .addNodeAddress("redis://127.0.0.1:6379" )
	 .addNodeAddress("redis://127.0.0.1:6380")
	 .addNodeAddress("redis://127.0.0.1:6381")
	 .addNodeAddress("redis://127.0.0.1:6382")
	 .addNodeAddress("redis://127.0.0.1:6383")
	 .addNodeAddress("redis://127.0.0.1:6384");
	 
	  //得到redisson对象
	  redisson = (Redisson) Redisson.create(config);
	}
	
	  //获取redisson对象的方法
	  public static Redisson getRedisson(){
	    return redisson;
	 }
}
```

### 锁的获取和释放

```java
public class DistributedRedisLock {
  //从配置类中获取redisson对象
  private static Redisson redisson = RedissonManager.getRedisson();
  private static final String LOCK_TITLE = "redisLock_";
  
  //加锁
  public static boolean acquire(String lockName){
    //声明key对象
    String key = LOCK_TITLE + lockName;
    //获取锁对象
    RLock mylock = redisson.getLock(key);
    //加锁，并且设置锁过期时间3秒，防止死锁的产生  uuid+threadId
    mylock.lock(2,3,TimeUtil.SECOND);
    //加锁成功
    return  true;
  }
  
  //锁的释放
  public static void release(String lockName){
    //必须是和加锁时的同一个key
    String key = LOCK_TITLE + lockName;
    //获取所对象
    RLock mylock = redisson.getLock(key);
    //释放锁（解锁）
    mylock.unlock();
  }
}
```

### 业务逻辑中使用分布式锁

```java
public String discount() throws IOException{
    String key = "lock001";
    //加锁
    DistributedRedisLock.acquire(key);
    //执行具体业务逻辑
    dosoming
    //释放锁
    DistributedRedisLock.release(key);
    //返回结果
    return soming;
 }
```

# 二、Redisson分布式锁的实现原理

![image-20230527102033727](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527102034.png)

## 2.1 加锁机制

1. 如果该客户端面对的是一个redis cluster集群，他首先会根据hash节点选择一台机器。
2. 发送lua脚本到redis服务器上，脚本如下:

```shell
//exists',KEYS[1])==0 不存在，没锁
"if (redis.call('exists',KEYS[1])==0) then "+       --看有没有锁
  // 命令：hset,1：第一回
	"redis.call('hset',KEYS[1],ARGV[2],1) ; "+       --无锁 加锁 
	// 配置锁的生命周期 
	"redis.call('pexpire',KEYS[1],ARGV[1]) ; "+      
	"return nil; end ;" +

//可重入操作，判断是不是我加的锁
"if (redis.call('hexists',KEYS[1],ARGV[2]) ==1 ) then "+  --我加的锁
   //hincrby 在原来的锁上加1
	"redis.call('hincrby',KEYS[1],ARGV[2],1) ; "+  --重入锁
	"redis.call('pexpire',KEYS[1],ARGV[1]) ; "+  
	"return nil; end ;" +

//否则，锁存在，返回锁的有效期，决定下次执行脚本时间
"return redis.call('pttl',KEYS[1]) ;"  --不能加锁，返回锁的时间
```

**lua的作用**：保证这段复杂业务逻辑执行的原子性。

**lua的解释**：

* KEYS[1]) ： 加锁的key
* ARGV[1] ： key的生存时间，默认为30秒
* ARGV[2] ： 加锁的客户端ID (UUID.randomUUID()） + “:” + threadId)

第一段if判断语句，就是用“exists myLock”命令判断一下，如果你要加锁的那个锁key不存在的话，你就进行加锁。

如何加锁呢？很简单，用下面的命令：

* hset myLock
  8743c9c0-0795-4907-87fd-6c719a6b4586:1 1

通过这个命令设置一个hash数据结构，这行命令执行后，会出现一个类似下面的数据结构：

* myLock :{“8743c9c0-0795-4907-87fd-6c719a6b4586:1”:1 }

上述就代表“8743c9c0-0795-4907-87fd-6c719a6b4586:1”这个客户端对“myLock”这个锁key完成了加锁。

接着会执行“pexpire myLock 30000”命令，设置myLock这个锁key的生存时间是30秒。

### 锁互斥机制

那么在这个时候，如果客户端2来尝试加锁，执行了同样的一段lua脚本，会咋样呢？

很简单，第一个if判断会执行“exists myLock”，发现myLock这个锁key已经存在了。

接着第二个if判断，判断一下，myLock锁key的hash数据结构中，是否包含客户端2的ID，但是明显不是的，因为那里包含的是客户端1的ID。

所以，客户端2会获取到pttl myLock返回的一个数字，这个数字代表了myLock这个锁key的剩余生存时间。比如还剩15000毫秒的生存时间。

此时客户端2会进入一个while循环，不停的尝试加锁。

### 自动延时机制

只要客户端1一旦加锁成功，就会启动一个watch dog看门狗，他是一个后台线程，会每隔10秒检查一下，如果客户端1还持有锁key，那么就会不断的延长锁key的生存时间。

### 可重入锁机制

第一个if判断 肯定不成立，“exists myLock”会显示锁key已经存在了。

第二个if判断 会成立，因为myLock的hash数据结构中包含的那个ID，就是客户端1的那个ID，也就是“8743c9c0-0795-4907-87fd-6c719a6b4586:1”

此时就会执行可重入加锁的逻辑，他会用：incrby myLock 8743c9c0-0795-4907-87fd-6c71a6b4586:1 1

通过这个命令，对客户端1的加锁次数，累加1。数据结构会变成：myLock :{“8743c9c0-0795-4907-87fd-6c719a6b4586:1”:2 }

## 2.2 释放锁机制

执行lua脚本如下：

```shell
# 如果key已经不存在，说明已经被解锁，直接发布（publish）redis消息（无锁，直接返回）
"if (redis.call('exists', KEYS[1]) == 0) then " +
            "redis.call('publish', KEYS[2], ARGV[1]); " +
            "return 1; " +
          "end;" +
# key和field不匹配，说明当前客户端线程没有持有锁，不能主动解锁。 不是我加的锁 不能解锁 （有锁不是我加的，返回）
          "if (redis.call('hexists', KEYS[1], ARGV[3]) == 0) then " +
            "return nil;" +
          "end; " +
# 将value减1 （有锁是我加的，进行hincrby -1 ）
          "local counter = redis.call('hincrby', KEYS[1], ARGV[3],-1); " +
# 如果counter>0说明锁在重入，不能删除key
          "if (counter > 0) then " +
            "redis.call('pexpire', KEYS[1], ARGV[2]); " +
            "return 0; " +
# 删除key并且publish 解锁消息
					# 可重入锁减完了，进行del操作
          "else " + 
            "redis.call('del', KEYS[1]); " + #删除锁
            "redis.call('publish', KEYS[2], ARGV[1]); " +
            "return 1; "+
             "end; " +
             "return nil;",
```

* – KEYS[1] ：需要加锁的key，这里需要是字符串类型。
* – KEYS[2] ：redis消息的ChannelName，一个分布式锁对应唯一的一个channelName: “redisson_lockchannel{” + getName() + “}”
* – ARGV[1] ：reids消息体，这里只需要一个字节的标记就可以，主要标记redis的key已经解锁，再结合 redis的Subscribe，能唤醒其他订阅解锁消息的客户端线程申请锁。
* – ARGV[2] ：锁的超时时间，防止死锁
* – ARGV[3] ：锁的唯一标识，也就是刚才介绍的 id（UUID.randomUUID()） + “:” + threadId

如果执行lock.unlock()，就可以释放分布式锁，此时的业务逻辑也是非常简单的。

其实说白了，就是每次都对myLock数据结构中的那个加锁次数减1。

如果发现加锁次数是0了，说明这个客户端已经不再持有锁了，此时就会用：

“del myLock”命令，从redis里删除这个key。
然后呢，另外的客户端2就可以尝试完成加锁了。

## 分布式锁特性

**互斥性**

任意时刻，只能有一个客户端获取锁，不能同时有两个客户端获取到锁。

**同一性**

锁只能被持有该锁的客户端删除，不能由其它客户端删除。

**可重入性**

持有某个锁的客户端可继续对该锁加锁，实现锁的续租

**容错性**

锁失效后（超过生命周期）自动释放锁（key失效），其他客户端可以继续获得该锁，防止死锁

## 分布式锁的实际应用

**数据并发竞争**

利用分布式锁可以将处理串行化，前面已经讲过了。

**防止库存超卖**

![image-20230527102400784](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527102401.png)

> 订单1下单前会先查看库存，库存为10，所以下单5本可以成功；
>
> 订单2下单前会先查看库存，库存为10，所以下单8本可以成功；
>
> 订单1和订单2 同时操作，共下单13本，但库存只有10本，显然库存不够了，这种情况称为库存超卖。
>
> 可以采用分布式锁解决这个问题。

![image-20230527102427471](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527102428.png)

订单1和订单2都从Redis中获得分布式锁(setnx)，谁能获得锁谁进行下单操作，这样就把订单系统下单的顺序串行化了，就不会出现超卖的情况了。伪码如下：

```java
//加锁并设置有效期
if(redis.lock("RDL",200)){
  //判断库存
  if (orderNum<getCount()){
  //加锁成功 ,可以下单
  order(5);
  //释放锁
  redis,unlock("RDL");
 }  
}
```

注意此种方法会降低处理效率，这样不适合秒杀的场景，秒杀可以使用CAS和Redis队列的方式。