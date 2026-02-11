---
title: 08-Redis SortedSet 排行榜
date: 2017-6-20 23:04:05
tags:
- Redis
- 排行榜
categories: 
- 05_数据库
- 04_Redis
---

![image-20200815230439632](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815230440.png)

官网教程：https://www.redis.net.cn/tutorial/3505.html

菜鸟教程：https://www.runoob.com/redis/redis-tutorial.html



> 场景：
>
> 实现汽车热度排行榜
>
> 现有 Api 消费者服务、CarServer 提供者服务、Cache Redis缓存服务

![image-20200815141958249](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815141959.png)

### 1. 基本逻辑

数据预热：

第一次从 Api 进行访问请求 CarServer 的汽车热度榜单，CarServer 会优先请求 Cache 缓存看是否已被同步过数据。

如果没有，则为第一次访问，从 MySQL 数据库中读取并同步存储到 Cache 中。

如果有，则为非第一次访问，正常访问，可以直接请求 Cache 服务以达到更高效率的请求和返回结果。

> 总结就是：
>
> 1. Cache redis服务中 SortedSet 只返回 set即可，map也行就是解析麻烦
> 2. Cache 的 controller 的所有 get获取数据接口以 `.toString()` 返回，否则会被 ribbon 截断为1个元素(原因尚未可知)
> 3. 其他服务接收到之后确保 接收到的 string 类型的 data 内有序不变，无需做其他操作
> 4. 返回给 swagger 或 页面时只需将 string 类型的 data 按照 List 带 `Feature.OrderedField` 进行反解析即可 -> 保留原有有序集合的顺序返回

### 2. 代码实现

* Api

    > JSONObject.parseObject(r.getData().toString(), List.class, `Feature.OrderedField`)

```java
// controller
@Api(tags = "汽车品牌查询接口")
@RestController
@RequestMapping("/api/brandlevecontroller/")
public class BrandLeveController {
    @ApiOperation(value = "热度排行榜", notes = "根据车辆被关注的数量作为热度值进行降序排序")
    @GetMapping("leaderboard.do/{bid}")
    public R leaderboard(@PathVariable Integer bid) {
        return service.leaderboard(bid);
    }
}

// serviceImpl
@Service
public class BrandLeveServiceImpl implements BrandLeveService {
    @Autowired
    private RestTemplate restTemplate;

    @Override
    public R leaderboard(Integer bid) {
        R r = restTemplate.getForObject("http://carserver/carserver/brandlevecontroller/leaderboard.do?bid=" + bid, R.class);
        List list = null;
        if (r != null) {
            // String 中在传入前即是有序的，因此只需要按 Feature.OrderedField 有序模式解析即可
            list = JSONObject.parseObject(r.getData().toString(), List.class, Feature.OrderedField);
        }
        return R.ok(list);
    }
}
```



* CarServer

    > 数据预热逻辑处理

```java
// controller
@RestController
@RequestMapping("/carserver/brandlevecontroller/")
public class BrandLeveController {
    @Autowired
    private BrandLeveService service;

    @GetMapping("leaderboard.do")
    public R leaderboard(@RequestParam Integer bid) {
        return service.leaderboard(bid);
    }
}

// serviceImpl
@Service
@Slf4j
public class BrandLeveServiceImpl implements BrandLeveService {
    @Autowired
    private BrandLevelDao dao;
    @Autowired
    private RestTemplate restTemplate;

    @Override
    public R leaderboard(Integer bid) {
        String key = CAR_LIST_KEY; // redis key："car:hot:zset"

        // 判断 Cache 中是否存在数据
        R checkKey = restTemplate.getForObject("http://cacheserver/cache/api/checkkey.do?key=" + key, R.class);
        if (checkKey != null && checkKey.getCode() == 200) {
            if ("false".equals(checkKey.getData())) {
                // Cache 中未存储 或 key已过期，则需要从数据库中读取一次 --> 即 上线前的【数据预热】
                List<CarDto> carAttention = dao.getCarAttention();
                if (carAttention != null) {
                    //遍历存入redis
                    for (CarDto dto : carAttention) {
                        // 添加到 redis 有序集合 zset
                        ZsetDto zset = new ZsetDto();
                        zset.setKey(key);
                        zset.setTimes(60 * 60 * 24L);
                        zset.setScore(dto.getAttention().doubleValue());
                        zset.setValue(JSON.toJSONString(dto));

                        HttpHeaders requestHeaders = new HttpHeaders();
                        requestHeaders.setContentType(MediaType.APPLICATION_JSON);
                        HttpEntity<ZsetDto> requestEntity = new HttpEntity<>(zset, requestHeaders);
                        restTemplate.postForObject("http://cacheserver/cache/api/savezset.do", requestEntity, R.class);
                    }

                    R r = restTemplate.getForObject("http://cacheserver/cache/api/getzset.do?key=" + key + "&flag=" + 1, R.class);
                    if (r != null) {
                        return R.ok(r.getData());
                    }
                }
            }
        }
        return R.fail("排序失败");
    }
}
```



* CacheServer

    > Ribbon 服务间传输需使用 String 来规避集合只能获取 1 个的问题；
    > 获取有序集合时的标记设置，升降序通过 flag 传参。

```java
// controller
@RestController
@RequestMapping("cache/api")
@Slf4j
public class CacheController {
    @Autowired
    private CacheService service;

    @PostMapping("/savezset.do")
    public R saveScoreSet2Redis( @RequestBody ZsetDto zsetDto) throws CacheException {
        return R.ok(service.saveScoreSet2Redis(zsetDto.getKey(), zsetDto.getTimes(),zsetDto.getScore() , zsetDto.getValue()));
    }
    
	/**
     * zset 自动排序
     * @param key  指定zset的 key 名
     * @param flag 0 升序，非0 降序
     * @return 注意封装进去的数据必须为 String 否则 Ribbon 请求服务时只能拿到集合的第1个
     */
    @GetMapping("/getzset.do")
    public R getScoreSetFromRedis(String key, int flag) {
        return R.ok(service.getScoreSetFromRedis(key, flag).toString());
    }
}

// serviceImpl
@Slf4j
@Service
@RefreshScope //实时获取统一配置中心的 配置内容
public class CacheServiceImpl implements CacheService {
    @Autowired
    private RedisTemplate<String, Object> template;
    
    /**
     * 存储 ScoreSet 类型的数据到 redis
     * @param key
     * @param expireTimeSeconds
     * @param score
     * @param o
     * @return
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
    
    // 校验key是否有效
	@Override
    public boolean checkKey(String key) {
        return template.hasKey(key);
    }
}
```



### 3. 成绩排行榜

```java
    /**
     * 修改redis中的排行榜信息
     */
    private void updateRedisRank(MpMockexam mpMockexam, MpUseranswerstat mpUseranswerstat, List<MpUserscorestat> mpUserscorestatList){
        String redisKey = MockExamRedisKey.RKEY_MOCKEXAM_PAPERRANK +  mpUseranswerstat.getMeId() + ":" + mpUseranswerstat.getPaperId();
        //反向计算用户得分数和所用分钟数
        BigDecimal reverseScore = BigDecimal.valueOf(mpUseranswerstat.getUasScoretotal()).subtract(BigDecimal.valueOf(mpUseranswerstat.getUasAnswerscore()));
        //相同得分，时间越短越在前
        String redisScore = reverseScore.multiply(BigDecimal.valueOf(100)).intValue() + "." + String.format("%06d", mpUseranswerstat.getUasDuration());
        //获取排行榜排名
        Set<ZSetOperations.TypedTuple<Object>> rankSet = redisUtil.zrangebyscore(redisKey, 0L, Long.valueOf(mpMockexam.getMeRanknum()));
        //删除当前用户的已有排名
        for(ZSetOperations.TypedTuple typedTuple : rankSet) {
            MpUseranswerstatVo vo = JSON.parseObject(String.valueOf(typedTuple.getValue()), MpUseranswerstatVo.class);
            if (vo.getUserId().equals(mpUseranswerstat.getUserId())){
                redisUtil.zrem(redisKey, typedTuple.getValue());
            }
        }
        //创建排行榜保存对象
        MpUseranswerstatVo vo = createRankObject(mpUseranswerstat, mpUserscorestatList);
        //加入排行榜
        Set<ZSetOperations.TypedTuple<Object>> userSet = new HashSet<>();
        DefaultTypedTuple<Object> userData = new DefaultTypedTuple<>(JSON.toJSONString(vo), Double.parseDouble(redisScore));
        userSet.add(userData);
        redisUtil.zadd(redisKey, userSet);
        //删除排行榜往后的数据
        redisUtil.zremByRange(redisKey, Long.valueOf(mpMockexam.getMeRanknum()), redisUtil.zZCard(redisKey));
        //计算排行榜失效时间，默认活动结束时间 + 7天为排行榜时间；
        Long time = DateUtils.addDay(DateUtils.toDate(mpMockexam.getMeEnddate()), 7).getTime() - (new Date()).getTime();
        if (time <= 0){
            redisUtil.del(redisKey);
        }
        //设置排行榜失效时间
        redisUtil.expire(redisKey, time);
    }

    /**
     * 创建排行榜保存对象
     */
    private MpUseranswerstatVo createRankObject(MpUseranswerstat mpUseranswerstat, List<MpUserscorestat> mpUserscorestatList){
        MpUseranswerstatVo vo = new MpUseranswerstatVo();
        vo.setPaperId(mpUseranswerstat.getPaperId());
        vo.setUserId(mpUseranswerstat.getUserId());
        vo.setPushType(mpUseranswerstat.getPushType());
        vo.setUserName(mpUseranswerstat.getUserName());
        vo.setUasScoretotal(mpUseranswerstat.getUasAnswerscore());
        vo.setUasDuration(mpUseranswerstat.getUasDuration());
        Map ussScore = Maps.newHashMap();
        mpUserscorestatList.stream().forEach(mpUserscorestat -> ussScore.put(mpUserscorestat.getUssQuestiontype(), mpUserscorestat.getUssAnswerscore()));
        vo.setUssScore(ussScore);
        return vo;
    }
```

### 4. 限制排行榜最大长度

以下是使用 Jedis 客户端向 Redis 中添加元素并设置排行榜长度的示例代码： - redis 工具类同理

```java
Jedis jedis = new Jedis("localhost");

// 添加元素到有序集合中
jedis.zadd("rank", 100, "user1");
jedis.zadd("rank", 200, "user2");
jedis.zadd("rank", 300, "user3");
    
// 获取有序集合的长度
long rankLength = jedis.zcard("rank");

// 如果有序集合长度超过了设定的最大值，则删除末尾的元素
if (rankLength > MAX_RANK_LENGTH) {
    jedis.zremrangeByRank("rank", 0, rankLength - MAX_RANK_LENGTH - 1);
}
```

在上述代码中，我们首先通过 `zadd` 方法向有序集合中添加元素，并指定元素的分数。然后，通过 `zcard` 方法获取有序集合的长度，判断是否超出设定的最大值。如果有序集合长度超过了设定的最大值，则调用 `zremrangeByRank` 方法删除末尾的元素。

### 5. 获取指定排名的元素

使用 RedisTemplate 实现取指定排名位置的数据的示例代码：

```java
java复制代码@Autowired
private RedisTemplate<String, String> redisTemplate;

public Set<String> getRankingList(int start, int end) {
    // 添加元素到有序集合中
    redisTemplate.opsForZSet().add("rank", "user1", 100);
    redisTemplate.opsForZSet().add("rank", "user2", 200);
    redisTemplate.opsForZSet().add("rank", "user3", 300);

    // 取得排名第start和第end的元素，当start==end时，获取的就是对应名次的1个元素
    return redisTemplate.opsForZSet().range("rank", start, end);
}
```

倒数排名则需要更换方法：

```java
    // 取得倒数第start和第end的元素，当start==end时，获取的就是对应名次的1个元素
    return redisTemplate.opsForZSet().reverseRange("rank", start, end);
```

### 6. 获取指定元素的排名

如果想要获取指定成员的排名（即分数从高到低的排名），可以使用 `reverseRank()` 方法或 `rank()` 方法。例如：

```java
java复制代码@Autowired
private RedisTemplate<String, String> redisTemplate;

public Long getUserRank(String user) {
    // 添加元素到有序集合中
    redisTemplate.opsForZSet().add("rank", "user1", 100);
    redisTemplate.opsForZSet().add("rank", "user2", 200);
    redisTemplate.opsForZSet().add("rank", "user3", 300);

    // 获取用户排名
    return redisTemplate.opsForZSet().reverseRank("rank", user);
}
```

在上述代码中，我们可以使用 `reverseRank` 方法获取指定成员的排名。如果要获取分数从低到高的排名，可以使用 `rank` 方法。