---
title: 13-RedisUtils
date: 2016-5-3 11:22:34
tags:
- 工具类
categories: 
- 20_收藏整理
- 03_工具类
---



### RedisUtils

```java
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * Redis工具类
 * @auther Jerry(姜源)
 * @date 2021/1/13/013 17:19
 */
@Component
public class RedisUtil {

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    /**
     * 过期时间：24H
     */
    public static final Long EXPIRE_24H = 24 * 60 * 60 * 1000L;
    /**
     * 过期时间：2H
     */
    public static final Long EXPIRE_2H = 2 * 60 * 60 * 1000L;
    /**
     * 过期时间：1H
     */
    public static final Long EXPIRE_1H = 60 * 60 * 1000L;
    /**
     * 过期时间：30MIN
     */
    public static final Long EXPIRE_30M = 30 * 60 * 1000L;

    /**
     * 判断 key 是否存在
     *
     * @param key
     * @return
     */
    public Boolean exists(final String key) {
        return redisTemplate.hasKey(key);
    }

    /**
     * 设置有效时间
     *
     * @param key     Redis键
     * @param timeout 超时时间，单位：毫秒
     * @return true=设置成功；false=设置失败
     */
    public Boolean expire(final String key, final Long timeout) {
        return expire(key, timeout, TimeUnit.MILLISECONDS);
    }

    /**
     * 设置有效时间
     *
     * @param key     Redis键
     * @param timeout 超时时间
     * @param unit    时间单位
     * @return true=设置成功；false=设置失败
     */
    public Boolean expire(final String key, final Long timeout, final TimeUnit unit) {
        Boolean ret = redisTemplate.expire(key, timeout, unit);
        return ret != null && ret;
    }

    /**
     * 查询 key 剩余有效期
     *
     * @param key Redis键
     * @return 剩余时间，单位：秒
     */
    public Long ttl(String key) {
        return redisTemplate.getExpire(key);
    }

    /**
     * 删除单个key
     *
     * @param key 键
     * @return true=删除成功；false=删除失败
     */
    public Boolean del(final String key) {
        Boolean ret = redisTemplate.delete(key);
        return ret != null && ret;
    }

    /**
     * 删除多个key
     *
     * @param keys 键集合
     * @return 成功删除的个数
     */
    public Long del(final Collection<String> keys) {
        Long ret = redisTemplate.delete(keys);
        return ret == null ? 0 : ret;
    }

    /**
     * 存入key-value普通对象
     *
     * @param key   Redis键
     * @param value 值
     */
    public void set(final String key, final Object value) {
        redisTemplate.opsForValue().set(key, value);
    }

    /**
     * 存入key-value普通对象
     *
     * @param key     Redis键
     * @param value   值
     * @param timeout 时间
     * @param timeout 有效期，单位分钟
     */
    public void set(final String key, final Object value, final Long timeout) {
        redisTemplate.opsForValue().set(key, value, timeout, TimeUnit.MILLISECONDS);
    }

    /**
     * 获取普通对象
     *
     * @param key 键
     * @return 对象
     */
    public Object get(final String key) {
        return redisTemplate.opsForValue().get(key);
    }

    /**
     * 自增+1
     *
     * @param key 键值
     * @return 增量后的结果
     */
    public Long incr(final String key) {
        return redisTemplate.opsForValue().increment(key);
    }

    /**
     * 自增指定步长
     *
     * @param key  键值
     * @param step 步进值
     * @return 增量后的结果
     */
    public Long incrBy(final String key, int step) {
        return redisTemplate.opsForValue().increment(key, step);
    }

    /**
     * 自增指定步长，并设置有效期
     *
     * @param key        键值
     * @param step       步进值
     * @param expireTime 失效时间
     * @return 增量后的结果
     */
    public Long incrBy(String key, Long step, Long expireTime) {
        Long result = redisTemplate.opsForValue().increment(key, step);
        expire(key, expireTime);
        return result;
    }

    /**
     * 确定哈希hashKey是否存在
     *
     * @param key  键
     * @param hkey hash键
     * @return true=存在；false=不存在
     */
    public Boolean hexists(final String key, String hkey) {
        return redisTemplate.opsForHash().hasKey(key, hkey);
    }

    /**
     * 往Hash中存入数据
     *
     * @param key   Redis键
     * @param hKey  Hash键
     * @param value 值
     */
    public void hset(final String key, final String hKey, final Object value) {
        redisTemplate.opsForHash().put(key, hKey, value);
    }

    /**
     * 往Hash中存入多个数据
     *
     * @param key    Redis键
     * @param values Hash键值对
     */
    public void hset(final String key, final Map<String, Object> values) {
        redisTemplate.opsForHash().putAll(key, values);
    }

    /**
     * 获取Hash中的数据
     *
     * @param key  Redis键
     * @param hKey Hash键
     * @return Hash中的对象
     */
    public Object hget(final String key, final String hKey) {
        return redisTemplate.opsForHash().get(key, hKey);
    }

    /**
     * 获取Hash中的数据
     *
     * @param key Redis键
     * @return Hash对象
     */
    public Map<Object, Object> hgetall(final String key) {
        return redisTemplate.opsForHash().entries(key);
    }

    /**
     * 获取多个Hash中的数据
     *
     * @param key   Redis键
     * @param hKeys Hash键集合
     * @return Hash对象集合
     */
    public List<Object> hgetall(final String key, final Collection<Object> hKeys) {
        return redisTemplate.opsForHash().multiGet(key, hKeys);
    }

    /**
     * 删除1个或多个Hash中的数据
     *
     * @param key   Redis键
     * @param hKeys Hash键
     * @return Hash对象集合
     */
    public Long hdel(final String key, final Object... hKeys) {
        return redisTemplate.opsForHash().delete(key, hKeys);
    }

    /**
     * 哈希 hashKey 的 value 增加给定的 step
     *
     * @param key
     * @param field
     * @param step
     * @return
     */
    public Long hincrBy(String key, String field, Long step) {
        return redisTemplate.opsForHash().increment(key, field, step);
    }

    /**
     * 往Set中存入数据
     *
     * @param key    Redis键
     * @param values 值
     * @return 存入的个数
     */
    public Long sadd(final String key, final Object... values) {
        Long count = redisTemplate.opsForSet().add(key, values);
        return count == null ? 0 : count;
    }

    /**
     * 删除Set中的数据
     *
     * @param key    Redis键
     * @param values 值
     * @return 移除的个数
     */
    public Long srem(final String key, final Object... values) {
        Long count = redisTemplate.opsForSet().remove(key, values);
        return count == null ? 0 : count;
    }

    /**
     * 获取set中的所有对象
     *
     * @param key Redis键
     * @return set集合
     */
    public Set<Object> smembers(final String key) {
        return redisTemplate.opsForSet().members(key);
    }

    /**
     * 往ZSet中存入数据
     *
     * @param key    Redis键
     * @param values 值
     * @return 存入的个数
     */
    public Long zadd(final String key, final Set<ZSetOperations.TypedTuple<Object>> values) {
        Long count = redisTemplate.opsForZSet().add(key, values);
        return count == null ? 0 : count;
    }

    /**
     * 获取集合大小
     *
     * @param key
     * @return
     */
    public Long zZCard(String key) {
        return redisTemplate.opsForZSet().zCard(key);
    }

    /**
     * 获取所有zset数据
     *
     * @param key Redis键
     */
    public Set<ZSetOperations.TypedTuple<Object>> zrangebyscore(final String key) {
        return redisTemplate.opsForZSet().rangeWithScores(key, 0, -1);
    }

    /**
     * 获取指定区间的元素,注意是区间不是score; 默认由低到高排序
     *
     * @param start 开始位置
     * @param end   结束位置
     * @param key   Redis键
     */
    public Set<ZSetOperations.TypedTuple<Object>> zrangebyscore(final String key, Long start, Long end) {
        return redisTemplate.opsForZSet().rangeWithScores(key, start, end);
    }

    /**
     * 通过score区间获取zset数据
     *
     * @param min 最小分数
     * @param max 最大分数
     * @param key Redis键
     */
    public Set<ZSetOperations.TypedTuple<Object>> zrangebyscoreWithScores(final String key, double min, double max) {
        return redisTemplate.opsForZSet().rangeByScoreWithScores(key, min, max);
    }

    /**
     * 获取由高到低排序后指定区间的元素,注意是区间不是score;
     *
     * @param start 开始位置
     * @param end   结束位置
     * @param key   Redis键
     */
    public Set<ZSetOperations.TypedTuple<Object>> reverseRangeWithScores(final String key, Long start, Long end) {
        return redisTemplate.opsForZSet().reverseRangeWithScores(key, start, end);
    }

    /**
     * 删除ZSet中1个或多个数据
     *
     * @param key    Redis键
     * @param values 值
     * @return 移除的个数
     */
    public Long zrem(final String key, final Object... values) {
        Long count = redisTemplate.opsForZSet().remove(key, values);
        return count == null ? 0 : count;
    }

    /**
     * 删除ZSet中制定排名的数据
     *
     * @param key    Redis键
     * @param start 开始位置
     * @param end   结束位置
     * @return 移除的个数
     */
    public Long zremByRange(final String key, Long start, Long end) {
        if (start > end){
            return 0L;
        }
        Long count = redisTemplate.opsForZSet().removeRange(key, start, end);
        return count == null ? 0 : count;
    }

    /**
     * 删除ZSet中给定的字典区间的所有成员
     *
     * @param key    Redis键
     * @param min 最小值
     * @param max 最大值
     * @return 移除的个数
     */
    public Long zremRangeByScore(final String key, double min, double max) {
        Long count = redisTemplate.opsForZSet().removeRangeByScore(key, min, max);
        return count == null ? 0 : count;
    }

    /**
     * 通过索引获取列表中的元素
     *
     * @param key   Redis键
     * @param index 索引值
     * @return 该索引的元素
     */
    public Object lindex(String key, Long index) {
        return redisTemplate.opsForList().index(key, index);
    }

    /**
     * 获取列表最后一个元素
     *
     * @param key Redis键
     * @return 元素
     */
    public Object llast(String key) {
        Long size = llen(key);
        if (size == 0L) {
            return null;
        }
        return redisTemplate.opsForList().index(key, size - 1L);
    }

    /**
     * 获取列表长度
     *
     * @param key Redis键
     * @return 列表元素个数
     */
    public Long llen(String key) {
        return redisTemplate.opsForList().size(key);
    }

    /**
     * 往列表指定索引存储指定值
     *
     * @param key   Redis键
     * @param index 索引
     * @param obj   值
     */
    public void lset(String key, Long index, Object obj) {
        redisTemplate.opsForList().set(key, index, obj);
    }

    /**
     * 从key中存储的列表中删除value的第count个出现
     *
     * @param key   Redis键
     * @param count 出现次数
     * @param value 要删除的值
     * @return 返回删除的个数
     */
    public Long lrem(String key, Long count, String value) {
        return redisTemplate.opsForList().remove(key, count, value);
    }

    /**
     * 将value附加到key最右侧
     *
     * @param key Redis键
     * @param obj 要附加的值
     * @return 列表中的索引
     */
    public Long rpush(String key, Object obj) {
        return redisTemplate.opsForList().rightPush(key, obj);

    }

    /**
     * 从key列表中获取begin和end之间的元素
     *
     * @param key   Redis键
     * @param start 起始索引
     * @param count 个数
     * @return 元素列表
     */
    public List lrange(String key, Long start, Long count) {
        return redisTemplate.opsForList().range(key, start, count);
    }

    /**
     * 从key列表中获取begin和end之间的元素
     *
     * @param key   Redis键
     * @param start 起始索引
     * @return 元素列表
     */
    public List lrange(String key, Long start) {
        Long size = llen(key);
        if (size == 0L) {
            return null;
        }
        return redisTemplate.opsForList().range(key, start, size - 1L);
    }

    /**
     * 从key列表中获取begin和end之间的元素
     *
     * @param key Redis键
     * @return 完整元素列表
     */
    public List lrange(String key) {
        Long size = llen(key);
        if (size == 0L) {
            return null;
        }
        return redisTemplate.opsForList().range(key, 0, size - 1L);
    }

    /**
     *
     *
     * @param prefix Redis键
     * @return key的集合
     */
    public Set<String> getkeys(String prefix) {
        return redisTemplate.keys(prefix);
    }

}
```

