---
title: 02-Redis 数据存储类型
date: 2017-6-20 23:04:05
tags:
- Redis
- 命令
categories: 
- 05_数据库
- 03_Redis
---

![image-20200815230439632](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815230440.png)

官网教程：https://www.redis.net.cn/tutorial/3505.html

菜鸟教程：https://www.runoob.com/redis/redis-tutorial.html



### 1. Redis 数据类型

Redis 常用 5 种存储数据的结构：

* `String`：一个 key 对应一个值
* `Hash`：一个 key 对应一个 Map
* `List`：一个 key 对应一个列表
* `Set`：一个 key 对应一个集合
* `ZSet`：一个 key 对应一个有序的集合

![image-20200806130735111](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200806130736.png)

另外 3 种数据结构

* `HyperLogLog`：用于计算近似值
* `GEO`：用于计算地理位置
* `BIT`：一般存储的也是一个字符串，存储的是一个 byte[]



#### 1.0 应用场景

* **String**：value可以是String也可以是数字，可用于复杂的`计数`功能的缓存、`token`缓存；
* **Hash**：可用于`单点登录`，设置过期时间，模拟出session的效果；
* **List**：可用于做简单的`消息队列`、lrange做基于redis的`分页`功能时性能极佳、`生产者消费者`场景实现FIFO；
* **Set**：可用于`全局去重`，以及利用交集、并集、差集操作计算`共同喜好`、`全部喜好`、`独特喜好`等；
* **Sorted Set**：权重参数 score 可以用于`排行榜`应用，取top n操作。

> 总结：
>
> **redis 的使用场景**：会话缓存、全页缓存、队列、排行榜/计数器、发布/订阅



#### 1.1 String

```sh
#1.添加值
set key value

#2.取值
get key

#3.批量操作
mset key value [key value...]
mget key [key...]

#4.自增命令 - 自增1
incr key

#5.自减命令 - 自减1
decr key

#6.自增或自减指定数量
incrby key increment
decrby key increment

#7.设置值的同时，指定生存时间（每次向Redis中添加数据时，尽量都设置生存时间）
setex key second value

#8.设置值，如果key不存在的话（如果key存在，什么也不做，如果key不存在，和set命令一样） - 分布式锁
setnx key value

#9.在key对应的value后，追加内容
append key value

#10.查看value字符串的长度
strlen key
```



#### 1.2 Hash

```sh
#1.存储数据
hset key field value

#2.获取数据
hget key field

#3.批量操作
hmset key field value [field value ...]
hmget key field [field ...]

#4.自增(指定自增的值)
hincrby key field increment

#5.设置值(如果key-field不存在， 那么就正常添加，如果存在，什么事都不做)
hsetnx key field value

#6.检查field是否存在
hexists key field

#7.删除key对应的field,可以删除多个
hdel key field [field ...]

#8.获取当前hash结构中的全部field和value
hgetall key

#9.获取当前hash结构中的全部field
hkeys key

#10.获取当前hash结构中的全部value
hvals key

#11.获取当前hash结构中field的数量
hlen key 
```



#### 1.3 List

```sh
#1，存储数据(从左侧插入数据，从右侧插入数据)
lpush key value [value ...]
rpush key value [value ...]

#2.存储数据(如果key不存在，什么事都不做，如果key存在， 但是不是list结构，什么都不做)
lpushx key value
rpushx key value

#3.修改数据(在存储数据时，指定好你的索引位置，覆盖之前索引位置的数据，index超出整个列表的长度， 也会失败)
lset key index value

#4.弹栈方式获取数据(左侧弹出数据，从右侧弹出数据)
lpop key 
rpop key

#5.获取指定索引范围的数据(start从开始， stop输入-1， 代表最后一个，-2代表倒数第二个)
lrange key start stop

#6.获取指定索引位置的数据
lindex key index

#7.获取整个列表的长度
llen key

#8. 删除列表中的数据(他是删除当前列表中的count个value值， count > θ从左侧向右侧删除，count < 0从右侧向左侧删除，count == 0删除列表中全部的value)
lrem key count value

#9.保留列表中的数据(保留你指定索引范围内的数据，超过整个索引范围被移除掉)
ltrim key start stop

#10.将一个列表中最后的一个数据，插入到另外-个列表的头部位置
rpoplpush list1 list2
```



#### 1.4 Set

```sh
#1.存储数据
sadd key member [member ...]

#2.获取数据(获取全部数据)
smembers key

#3.随机获取一个数据(获取的同时，移除数据，count默认为1， 代表弹出数据的数量)
spop key [count]

#4.交集(取多个set集合交集)
sinter set1 set2 ...

#5.并集(获取全部集合中的数据)
sunion set1 set2

#6.差集(获取多个集合中不- -样的数据)
sdiff set1 set2 ...

#7.删除数据
srem key member [member ...]

#8.查看当前的set集合中是否包含这个值
sismember key member
```



#### 1.5 ZSet(Sorted Set)

```sh
#1.添加数据( score必须是数值。member不允许重复的。 )
zadd key score member [score member ...]

#2.修改member的分数(如果member是存在于key中的，正常增加分数，如果memeber不存在， 这个命令就相当于zadd)
zincrby key increment member

#3.查看指定的member的分数
zscore key member

#4.获取zset中数 据的数量
zcard key

#5.根据score的范围查询member数量
zcount key min max

#6，删除zset中的成员
zrem key member [member...]

#7.根据分数从小到大排序，获取指定范围内的数据(withscores如果添加这个参数，那么会返回member对应的分数)
zrange key start stop [withscores]

#8.根据分数从大到小排序，获取指定范围内的数据(withscores如果添加这个参数， 那么会返回member对应的分数)
zrevrange key start stop [withscores]

#9.根据分数的返回去获取member (withscores代表同时返回score,添加limit, 就和MySQL中-样，如果不希望等于min或者max的值被查询出来可以采用'(分数’相当于<但是不等于的方式，最大值和最小值使用+inf和- inf来标识)
zrangebyscore key min max [withscores] [limit offset count]

#10.根据分数的返回去获取member (wi thscores代表同时返回score,添加1imit, 就和MySQL中- 样)
zrangebyscore key max min [withscores] [limit offset count]
```



### 2. key 常用命令

```sh
#1.查看Redis中的全部的key (pattern取值 * 或 xxx* 或 *xxx)
keys pattern

#2.查看某一个key是否存在(1 - key存在，θ一key不存在)
exists key

#3.删除key
del key [key ...]

#4.设置key的生存时间，单位为秒，单位为毫秒,设置还能活多久
expire key second
pexpire key milliseconds

#5.设置key的生存时间，单位为秒，单位为毫秒,设置能活到什么时间点
expireat key timestamp
pexpireat key milliseconds

#6，查看key的剩余生存时间，ttl单位为秒，pttl单位为毫秒(-2：key不存在， -1：key没有设置生存时间，其他：具体剩余的生存时间)
ttl key
pttl key

#7.移除key的生存时间(1一移除成功，日一key不存在生存时间， key不存在)
persist key

#8，选择操作的库
select 0~15

#9.移动key到另外-个库中
move key db
```



### 3. 库 常用命令

```sh
#1.清空当前所在的数据库
flushdb

#2.清空全部数据库
flushall

#3.查看当前数据库中有多少个key
dbsize

#4.查看最后一次操作的时间
lastsave

#5.实时监控Redis服务接收到的命令
monitor
```

