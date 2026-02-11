---
title: Spring Data Redis+Redisson
date: 2020-03-02 17:59:44
tags:
- 微服务
- Redis
- 缓存服务
categories: 
- 14_微服务
- 11_缓存服务
---

![image-20200815230439632](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815230440.png)

官网地址：https://spring.io/projects/spring-data-redis

参考文档：https://docs.spring.io/spring-data/data-redis/docs/current/reference/html/



### 1. 简介

适合：高频 使用的数据、具有有效期的数据

不适合：频繁修改的数据、敏感数据

常用技术：Redis、MongoDB

对比：

* **Redis**：

优点：适合读多写少的业务场景，支持操作原子性。读写性能在100,000 ops/s（operation per second 每秒操作次数）左右，时延一般为10～70微妙左右；而HBase的单机读写性能一般不会超过1,000ops/s，时延则在1～5毫秒之间。

缺点：不支持二级索引。也不适合做存储和分析。处理的数据量要小于HBase与MongoDB。

适用场景：“读写分离”的场景下作为“读库”用，特别是存放Hadoop或Spark的分析结果。微信token每两小时刷新一次，就比较适合用redis存储，读也比较方便。  

* **MongoDB**：

优点：适合复杂数据格式存储及查询。  

缺点：比较消耗内存，有事务、join（全外连接）等短板

适用场景：排行榜，每天刷新一次，remove一次再从db更新过去。  

* **Hbase**：

优点：写性能高，适合超高量级写入的场景，适合写多读少的业务场景，可用来存储BI数据及存储大数据。

缺点：不支持二级索引。

适用场景：作为MapReduce（大规模数据集（大于1TB）的并行运算）的后台数据源；Facebook的消息类应用，包括Messages、Chats、Emails和SMS系统，用的都是HBase；淘宝的WEB版阿里旺旺，后台是HBase；小米的米聊用的也是HBase；移动某省公司的手机详单查询系统。（单次分析，只能scan全表或者一个范围内的）  



### 2. 缓存服务

实现：`Spring Data Redis` + `Redission`(分布式锁 setnx)

Spring Data Redis 的封装操作Redis模板对象：

```java
RedisTemplate<String,Object>：可以存储任意类型（需要实现序列化接口）
StringRedisTemplate :存储的值只能是String类型
```

提供的方法：

```java
String : opsForValue()
List : opsForList()
Set : opsForSet()
ZSet : opsForZSet()
Hash : opsForHash()
Geo : opsForGeo()
HyperLogLog : opsForHyperLogLog()
Stream : opsForStream()  
```

#### 2.1 依赖

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        <dependency>
            <groupId>org.redisson</groupId>
            <artifactId>redisson</artifactId>
            <version>3.13.2</version>
        </dependency>
```

#### 2.2 配置类

可根据情况修改生成策略。

```java
@Configuration
@EnableCaching //启用缓存
public class RedisConfig extends CachingConfigurerSupport {
    //自定义Redis的key的生成策略
    @Override
    public KeyGenerator keyGenerator() {
        /**
         * 生成策略：
         * 1.target 类
         * 2.method 方法
         * 3.params 参数
         */
        return (target, method, params) -> {
            StringBuffer buffer = new StringBuffer();
            buffer.append(target.getClass().getName() + ":");
            buffer.append(method.getName() + ":");
            for (Object o : params) {
                buffer.append(o.toString());
            }
            return buffer.toString();
        };
    }

    //transient String msg;
    //创建缓存管理器
    @Bean
    public CacheManager createCM(LettuceConnectionFactory connectionFactory) {
        //Redis写入对象
        RedisCacheWriter writer = RedisCacheWriter.lockingRedisCacheWriter(connectionFactory);
        return new RedisCacheManager(writer, RedisCacheConfiguration.defaultCacheConfig());
    }

    //重新Redis操作模板对象，可以存储任意类型：对象存储 使用序列化存储 实现序列化接口
    @Bean
    public RedisTemplate<String, Object> createRT(LettuceConnectionFactory connectionFactory) {
        //实例化对象
        RedisTemplate<String, Object> template = new RedisTemplate();
        //设置连接对象
        template.setConnectionFactory(connectionFactory);
        //设置序列化格式
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
        template.setKeySerializer(stringRedisSerializer);
        template.setHashKeySerializer(stringRedisSerializer);
        //设置内容的序列化存储
        Jackson2JsonRedisSerializer redisSerializer = new Jackson2JsonRedisSerializer(Object.class);
        //设置序列化
        ObjectMapper mapper = new ObjectMapper();
        //设置
        mapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        //已过时
        //mapper.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        //新版本
        mapper.activateDefaultTyping(mapper.getPolymorphicTypeValidator(), ObjectMapper.DefaultTyping.NON_FINAL);
        //字符串、set、List、ZSet
        template.setValueSerializer(redisSerializer);
        //Hash
        template.setHashKeySerializer(redisSerializer);

        return template;
    }
}
```



#### 2.3 工具类

```java
public class RedissonUtil {
    private static RedissonUtil redissonUtil;

    //加锁 释放锁
    private RedissonClient client;

    private RedissonUtil(String host, int port, String pass) {
        Config config = new Config();
        config.useSingleServer().setAddress("redis://" + host + ":" + port).setPassword(pass);
        client = Redisson.create(config);
    }

//    public static RedissonUtil getInstance(String host, int port, String pass) {
//        Lock lock = null;
//        try {
//            lock = new ReentrantLock();
//            lock.lock();
//            if (redissonUtil == null) {
//                redissonUtil = new RedissonUtil(host, port, pass);
//            }
//        } finally {
//            lock.unlock();
//        }
//        return redissonUtil;
//    }

    /**
     * 获取一个传递来自配置中心参数的实例
     */
    public static RedissonUtil getInstance(String host, int port, String pass) {
        return new RedissonUtil(host, port, pass);
    }

    public void saveStr(String key, String value) {
        client.getBucket(key).set(value);
//        client.getMap(key).put();
//        client.getScoredSortedSet(key).add();
//        client.getList(key);
//        client.getSet().add();
//        client.getGeo(key).add();
    }

    public void lock(String key) {
        client.getLock(key).lock();
    }

    public void lock(String key, long timeseconds) {
        client.getLock(key).lock(timeseconds, TimeUnit.SECONDS);
    }

    public void unlock(String key) {
        client.getLock(key).unlock();
    }

    public boolean checkLock(String key) {
        return client.getLock(key).isLocked();
    }
}
```



#### 2.4 控制层

```java
@RestController
@RequestMapping("cache/api")
@Slf4j
public class CacheController {
    @Autowired
    private CacheService service;

    //实现常用的操作
    @SentinelResource(fallback = "saveError")
    @PostMapping("/savestr.do")
    public R saveStr2Redis(String key, long times, String value) throws CacheException {
        return R.ok(service.saveStr2Redis(key, times, value));
    }

    //降级方法
    public R saveError(String key, long times, String value) throws CacheException {
        log.error("缓存服务崩溃");
        return R.fail("服务器崩溃降级");
    }

    @PostMapping("/savelist.do")
    public R saveList2Redis(String key, long times, String... values) throws CacheException {
        return R.ok(service.saveStr2Redis(key, times, values));
    }

    @PostMapping("/saveset.do")
    public R saveSet2Redis(String key, long times, String... values) throws CacheException {
        return R.ok(service.saveSet2Redis(key, times, values));
    }

    @PostMapping("/savezset.do")
    public R saveScoreSet2Redis( @RequestBody ZsetDto zsetDto) throws CacheException {
        return R.ok(service.saveScoreSet2Redis(zsetDto.getKey(), zsetDto.getTimes(),zsetDto.getScore() , zsetDto.getValue()));
    }

    @PostMapping("/savehash.do")
    public R saveHash2Redis(String key, long times, String field, String value) throws CacheException {
        return R.ok(service.saveHash2Redis(key, times, field, value));
    }

    @GetMapping("/getstr.do")
    public R getStrFromRedis(String key) {
        return R.ok(service.getStrFromRedis(key));
    }

    @GetMapping("/getlistsize.do")
    public R getListSize(String key) {
        return R.ok(service.getListSize(key));
    }

    @GetMapping("/getlist.do")
    public R getListFromRedis(String key) {
        return R.ok(service.getListFromRedis(key).toString());
    }

    @GetMapping("/checkset.do")
    public R checkSet(String key, String val) {
        return R.ok(service.checkSet(key, val));
    }

    @GetMapping("/getset.do")
    public R getSetFromRedis(String key) {
        return R.ok(service.getSetFromRedis(key).toString());
    }

    /**
     * zset 自动排序
     *
     * @param key  指定zset的 key 名
     * @param flag 0 升序，非0 降序
     * @return 注意封装进去的数据必须为 string 否则 ribbon 请求服务时只能拿到集合的第1个
     */
    @GetMapping("/getzset.do")
    public R getScoreSetFromRedis(String key, int flag) {
        return R.ok(service.getScoreSetFromRedis(key, flag).toString());
    }

    @GetMapping("/gethash2.do")
    public R getHashFromRedis(String key, String field) {
        return R.ok(service.getHashFromRedis(key, field));
    }

    @GetMapping("/checkhash.do")
    public R checkHash(String key, String field) {
        return R.ok(service.checkHash(key, field));
    }

    @GetMapping("/gethash1.do")
    public R gethashFromRedis(String key) {
        return R.ok(service.gethashFromRedis(key).toString());
    }

    @GetMapping("/gethashstr.do")
    public R gethashStrFromRedis(String key) {
        return R.ok(service.gethashStrFromRedis(key).toString());
    }


    @GetMapping("/checkkey.do")
    public R checkKey(String key) {
        return R.ok(service.checkKey(key));
    }

    @GetMapping("/keys.do")
    public R keys(String prefile) {
        return R.ok(service.keys(prefile));
    }

    @PostMapping("/expire.do")
    public R expire(String key, long time, TimeUnit timeUnit) {
        return R.ok(service.expire(key, time, timeUnit));
    }

    @PostMapping("/delkeys")
    public R delKeys(String... keys) {
        return R.ok(service.delKey(keys));
    }

    @PostMapping("/lock.do")
    public R lock(String key) {
        return R.ok(service.lock(key));
    }

    @PostMapping("/locktime.do")
    public R lock(String key, long timeseconds) {
        return R.ok(service.lock(key, timeseconds));
    }

    @PostMapping("/unlock.do")
    public R unlock(String key) {
        return R.ok(service.unlock(key));
    }
}
```



#### 2.5 业务层

接口：

```java
public interface CacheService {
    //存储数据-5大常用类型
    //存储  字符串
    boolean saveStr2Redis(String key, long expireTimeSeconds, String value) throws CacheException;

    boolean saveList2Redis(String key, long expireTimeSeconds, String... values) throws CacheException;

    boolean saveSet2Redis(String key, long expireTimeSeconds, String... values) throws CacheException;

    boolean saveScoreSet2Redis(String key, long expireTimeSeconds, double score, String value) throws CacheException;

    boolean saveHash2Redis(String key, long expireTimeSeconds, String field, String value) throws CacheException;

    //存储 序列化单个对象
    boolean saveList2Redis(String key, long expireTimeSeconds, Object o) throws CacheException;

    boolean saveSet2Redis(String key, long expireTimeSeconds, Object o) throws CacheException;

    boolean saveScoreSet2Redis(String key, long expireTimeSeconds, double score, Object o) throws CacheException;

    boolean saveHash2Redis(String key, long expireTimeSeconds, String field, Object o) throws CacheException;

    //存储 序列化
    boolean saveStr2Redis(String key, long expireTimeSeconds, Object o) throws CacheException;

    boolean saveList2Redis(String key, long expireTimeSeconds, List<Object> list) throws CacheException;

    boolean saveSet2Redis(String key, long expireTimeSeconds, Set<Object> set) throws CacheException;

    boolean saveScoreSet2Redis(String key, long expireTimeSeconds, Map<Object, Double> map) throws CacheException;

    boolean saveHash2Redis(String key, long expireTimeSeconds, Map<String, Object> map) throws CacheException;

    //查询
    String getStrFromRedis(String key);

    long getListSize(String key);

    List<Object> getListFromRedis(String key);

    boolean checkSet(String key, String val);

    boolean checkSet(String key, Object val);

    Set<Object> getSetFromRedis(String key);

    Set<Object> getScoreSetFromRedis(String key, int flag);

    String getHashFromRedis(String key, String field);

    boolean checkHash(String key, String field);

    Map<String, Object> gethashFromRedis(String key);

    Map<String, String> gethashStrFromRedis(String key);

    //校验
    boolean checkKey(String key);

    List<String> keys(String prefile);

    boolean expire(String key, long time, TimeUnit timeUnit);

    boolean delKey(String... keys);

    boolean lock(String key);

    boolean lock(String key, long timeseconds);

    boolean unlock(String key);
}
```

实现类：

```java
@Slf4j
@Service
@RefreshScope //实时获取统一配置中心的 配置内容（如本地配置则无需该注解）
public class CacheServiceImpl implements CacheService {
    @Autowired
    private RedisTemplate<String, Object> template;

    @Value("${spring.redis.host}") //IOC 的属性注入是发送对象实例之后
    private String host;
    @Value("${spring.redis.port}")
    private int port;
    @Value("${spring.redis.password}")
    private String pass;

    private RedissonUtil redissonUtil;

    @PostConstruct()
    public void init() {
        redissonUtil = RedissonUtil.getInstance(host, port, pass);
    }
    // @PreDestroy -- destoryMethod

    /**
     * @param key
     * @param expireTimeSeconds -1 永久有效；-2 Key不存在；其他值 Key有效时间
     * @param value
     * @return 新增是否成功
     */
    @Override
    public boolean saveStr2Redis(String key, long expireTimeSeconds, String value) throws CacheException {
        try {
            template.opsForValue().set(key, value);
            if (expireTimeSeconds > 0) {
                template.opsForValue().set(key, value, expireTimeSeconds, TimeUnit.SECONDS);
            }
            return true;
        } catch (Exception e) {
            log.error("存储异常");
            throw new CacheException("存储异常" + e.getMessage());
        }
    }

    @Override
    public boolean saveList2Redis(String key, long expireTimeSeconds, String... values) throws CacheException {
        for (String v : values) {
            saveStr2Redis(key, expireTimeSeconds, v);
        }
        return true;
    }

    @Override
    public boolean saveSet2Redis(String key, long expireTimeSeconds, String... values) throws CacheException {
        try {
            template.opsForSet().add(key, values);
            if (expireTimeSeconds > 0) {
                template.opsForSet().getOperations().expire(key, expireTimeSeconds, TimeUnit.SECONDS);
            }
            return true;
        } catch (Exception e) {
            log.error("存储异常");
            throw new CacheException("存储异常" + e.getMessage());
        }
    }

    @Override
    public boolean saveScoreSet2Redis(String key, long expireTimeSeconds, double score, String value) throws CacheException {
        try {
            template.opsForZSet().add(key, value, score);
            if (expireTimeSeconds > 0) {
                template.opsForSet().getOperations().expire(key, expireTimeSeconds, TimeUnit.SECONDS);
            }
            return true;
        } catch (Exception e) {
            log.error("存储异常");
            throw new CacheException("存储异常" + e.getMessage());
        }
    }

    @Override
    public boolean saveHash2Redis(String key, long expireTimeSeconds, String field, String value) throws CacheException {
        try {
            template.opsForHash().put(key, field, value);
            if (expireTimeSeconds > 0) {
                template.expire(key, expireTimeSeconds, TimeUnit.SECONDS);
            }
            return true;
        } catch (Exception e) {
            log.error("存储异常");
            throw new CacheException("存储异常" + e.getMessage());
        }
    }

    @Override
    public boolean saveList2Redis(String key, long expireTimeSeconds, Object o) throws CacheException {
        try {
            template.opsForList().rightPush(key, o);
            if (expireTimeSeconds > 0) {
                template.opsForList().set(key, expireTimeSeconds, o);
            }
            return true;
        } catch (Exception e) {
            log.error("存储异常");
            throw new CacheException("存储异常" + e.getMessage());
        }
    }

    @Override
    public boolean saveSet2Redis(String key, long expireTimeSeconds, Object o) throws CacheException {
        try {
            template.opsForSet().add(key, o);
            if (expireTimeSeconds > 0) {
                template.opsForSet().getOperations().expire(key, expireTimeSeconds, TimeUnit.SECONDS);
            }
            return true;
        } catch (Exception e) {
            log.error("存储异常");
            throw new CacheException("存储异常" + e.getMessage());
        }
    }

    /**
     * 存储 ScoreSet 类型的数据到 redis
     * @param key
     * @param expireTimeSeconds
     * @param score
     * @param o
     * @return
     * @throws CacheException
     */
    @Override
    public boolean saveScoreSet2Redis(String key, long expireTimeSeconds, double score, Object o) throws CacheException {
        try {
            template.opsForZSet().add(key, o, score);
            if (expireTimeSeconds > 0) {
                template.opsForSet().getOperations().expire(key, expireTimeSeconds, TimeUnit.SECONDS);
            }
            return true;
        } catch (Exception e) {
            log.error("存储异常");
            throw new CacheException("存储异常" + e.getMessage());
        }
    }

    @Override
    public boolean saveHash2Redis(String key, long expireTimeSeconds, String field, Object o) throws CacheException {
        try {
            template.opsForHash().put(key, field, o);
            if (expireTimeSeconds > 0) {
                template.expire(key, expireTimeSeconds, TimeUnit.SECONDS);
            }
            return true;
        } catch (Exception e) {
            log.error("存储异常");
            throw new CacheException("存储异常" + e.getMessage());
        }
    }

    @Override
    public boolean saveStr2Redis(String key, long expireTimeSeconds, Object o) throws CacheException {
        try {
            template.opsForValue().set(key, o);
            if (expireTimeSeconds > 0) {
                template.opsForValue().set(key, o, expireTimeSeconds, TimeUnit.SECONDS);
            }
            return true;
        } catch (Exception e) {
            log.error("存储异常");
            throw new CacheException("存储异常" + e.getMessage());
        }
    }

    @Override
    public boolean saveList2Redis(String key, long expireTimeSeconds, List<Object> list) throws CacheException {
        for (Object o : list) {
            saveList2Redis(key, expireTimeSeconds, o);
        }
        return true;
    }

    @Override
    public boolean saveSet2Redis(String key, long expireTimeSeconds, Set<Object> set) throws CacheException {
        for (Object s : set) {
            saveSet2Redis(key, expireTimeSeconds, s);
        }
        return true;
    }

    @Override
    public boolean saveScoreSet2Redis(String key, long expireTimeSeconds, Map<Object, Double> map) throws CacheException {
        for (Map.Entry<Object, Double> m : map.entrySet()) {
            saveScoreSet2Redis(key, expireTimeSeconds, m.getValue(), m.getKey());
        }
        return true;
    }

    @Override
    public boolean saveHash2Redis(String key, long expireTimeSeconds, Map<String, Object> map) throws CacheException {
        for (Map.Entry<String, Object> m : map.entrySet()) {
            saveHash2Redis(key, expireTimeSeconds, m.getKey(), m.getValue());
        }
        return true;
    }

    @Override
    public String getStrFromRedis(String key) {
        return template.opsForValue().get(key, 0, -1);
    }

    @Override
    public long getListSize(String key) {
        return template.opsForList().size(key);
    }

    @Override
    public List<Object> getListFromRedis(String key) {
        return template.opsForList().range(key, 0, -1);
    }

    @Override
    public boolean checkSet(String key, String val) {
        return template.opsForSet().isMember(key, val);
    }

    @Override
    public boolean checkSet(String key, Object val) {
        return template.opsForSet().isMember(key, val);
    }

    @Override
    public Set<Object> getSetFromRedis(String key) {
        return template.opsForSet().members(key);
    }

    /**
     * 获取 SortedSet 有序集合
     *
     * @param key
     * @param flag 0 升序，非0 降序
     * @return
     */
    @Override
    public Set<Object> getScoreSetFromRedis(String key, int flag) {
        return flag == 0 ? template.opsForZSet().range(key, 0, -1) : template.opsForZSet().reverseRange(key, 0, -1);
    }

    @Override
    public String getHashFromRedis(String key, String field) {
        return (String) template.opsForHash().entries(key).get(field);
    }

    @Override
    public boolean checkHash(String key, String field) {
        return template.opsForHash().hasKey(key, field);
    }

    @Override
    public Map<String, Object> gethashFromRedis(String key) {
        Map<String, Object> map = new HashMap<>();
        template.opsForHash().entries(key).forEach((k, v) -> {
            if (k instanceof String) {
                map.put((String) k, v);
            }
        });
        return map;
    }

    @Override
    public Map<String, String> gethashStrFromRedis(String key) {
        Map<String, String> map = new HashMap<>();
        template.opsForHash().entries(key).forEach((k, v) -> {
            if (k instanceof String && v instanceof String) {
                map.put((String) k, (String) v);
            }
        });
        return map;
    }

    @Override
    public boolean checkKey(String key) {
        return template.hasKey(key);
    }

    @Override
    public List<String> keys(String prefile) {
        Set<String> keys = template.keys(prefile + "*");
        List<String> list = null;
        if (keys != null) {
            list = new ArrayList<>(keys);
        }
        return list;
    }

    @Override
    public boolean expire(String key, long time, TimeUnit timeUnit) {
        return template.expire(key, time, timeUnit);
    }

    @Override
    public boolean delKey(String... keys) {
        return template.delete(Arrays.asList(keys)) == keys.length;
    }

    @Override
    public boolean lock(String key) {
        redissonUtil.lock(key);
        return true;
    }

    @Override
    public boolean lock(String key, long timeseconds) {
        redissonUtil.lock(key, timeseconds);
        return true;
    }

    @Override
    public boolean unlock(String key) {
        redissonUtil.unlock(key);
        return true;
    }
}
```



#### 2.6 全局异常

```java
public class CacheException extends Exception {
    public CacheException() {
    }

    public CacheException(String msg) {
        super(msg);
    }

    public CacheException(String msg, CacheException exception) {
        super(msg, exception);
    }
}
```



### 3. 调用缓存服务示例

Ribbon 远程调用：

```java
// ribbon 进行远程调用
@Service
public class RedisServiceImpl implements RedisService {
    @Autowired
    private RestTemplate restTemplate;

    @Override
    public R saveStr2Redis(String key, long times, String value) {
        RedisStrDto dto = new RedisStrDto(key, times, value);
		// 设置 JSON 请求头，封装消息体，JSON格式必须设置
        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<RedisStrDto> requestEntity = new HttpEntity<>(dto, requestHeaders);
        return restTemplate.postForObject("http://cacheserver/cache/api/savestr.do", requestEntity, R.class);
    }

    @Override
    public R getStrFromRedis(String key) {
        return restTemplate.getForObject("http://cacheserver/cache/api/getstr.do?key=" + key, R.class);
    }

    @Override
    public R delkeyFromRedis(String key) {
        return restTemplate.getForObject("http://cacheserver/cache/api/delkeys?key=" + key, R.class);
    }

    @Override
    public R checkKeyFromRedis(String key) {
        return restTemplate.getForObject("http://cacheserver/cache/api/checkkey.do?key=" + key, R.class);
    }
}
```

调用实现类注入：

```java
@Service
@Slf4j
public class UserLoginServiceImpl implements UserLoginService {
    @Autowired
    private UserLoginDao dao;
    @Autowired
    private RedisService cache;

    //...
    
    @Override
    public R checkToken(String token) {
        if (StringUtil.isnoEmpty(token)) {
            // 从 Cache 服务中获取key，能获取到就没有过期，反之则过期
            R r = cache.checkKeyFromRedis(USERLOGIN_TOKEN + token);
            if (r.getCode() == 200) {
                if (StringUtil.isnoEmpty(r.getData().toString())) {
                    R.ok("token有效");
                }
            }
        }
        return R.fail("token或账户名有误！");
    }
}

```



### 4. 缓存服务高可用

```xml
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
            <version>2.2.1.RELEASE</version>
        </dependency>
```

```java
@RestController
@RequestMapping("cache/api")
@Slf4j
public class CacheController {
    @Autowired
    private CacheService service;

    //实现常用的操作，@SentinelResource 注解指定服务降级后的回调函数
    @SentinelResource(fallback = "saveError")
    @PostMapping("/savestr.do")
    public R saveStr2Redis(String key, long times, String value) throws CacheException {
        return R.ok(service.saveStr2Redis(key, times, value));
    }

    //降级方法
    public R saveError(String key, long times, String value) throws CacheException {
        log.error("缓存服务崩溃");
        return R.fail("服务器崩溃");
    }
}
```

