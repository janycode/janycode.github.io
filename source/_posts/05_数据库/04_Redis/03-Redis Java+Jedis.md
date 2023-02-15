---
title: 03-Redis Java+Jedis
date: 2017-6-20 23:04:05
tags:
- Redis
- Jedis
categories: 
- 05_数据库
- 03_Redis
---

![image-20200815230439632](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815230440.png)

官网教程：https://www.redis.net.cn/tutorial/3525.html



### 1. Jedis 使用

#### 1.1 修改 redis.conf 配置

修改 /usr/local/redis-5.0.4/bin 目录下的 redis.conf 配置文件，然后启动 redis 服务端。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200706202550.png)

启动命令：[root@localhost /usr/local/redis-5.0.4/bin]# `./redis-server redis.conf`

> 将绑定 127.0.0.1 注释掉，然后把 保护模式 关掉。



如果配置密码的话：`如将密码配置为 root`

![redis-配置密码](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200707103053.png)

客户端命令行中使用密码：`auth 密码`

![redis-使用密码](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200707103120.png)



#### 1.2 创建 Maven 工程

导入依赖 pom.xml

```xml
<!-- jedis 依赖 -->
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>3.3.0</version>
</dependency>

<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.12</version>
</dependency>
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.11</version>
</dependency>
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.72</version>
</dependency>
```





#### 1.3 编写测试

```java
package com.demo.redis;

import com.alibaba.fastjson.JSON;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.junit.Test;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

public class TestRedis {

    /**
     * 获取单一的 jedis 对象操作数据库
     */
    @Test
    public void testRedis1() {
        // 1.获取连接对象
        Jedis jedis = new Jedis("192.168.247.128", 6379);

        //jedis.auth("root"); // 使用密码
        
        // 2.设置/获取 redis 中的数据
        jedis.set("name", "张三");
        String name = jedis.get("name");
        System.out.println("name = " + name); // name = 张三

        // 3.关闭资源
        jedis.close();
    }

    /**
     * 通过 jedis 的 pool 获取连接对象
     */
    @Test
    public void testRedis2() {
        // 创建池子的配置对象
        JedisPoolConfig jedisPoolConfig = new JedisPoolConfig();
        jedisPoolConfig.setMaxIdle(30); // 设置最大闲置个数
        jedisPoolConfig.setMinIdle(10); // 设置最小闲置个数
        jedisPoolConfig.setMaxTotal(100); // 设置最大连接数

        // 1.创建 redis 的连接池
        JedisPool jedisPool = new JedisPool(jedisPoolConfig, "192.168.247.128", 6379);
        // 使用超时时间 5s，使用密码 root
        //JedisPool jedisPool = new JedisPool(jedisPoolConfig, "192.168.247.128", 6379, 5000, "root");
        // 2.从池子中获取连接资源
        Jedis jedis = jedisPool.getResource();

        // 3.操作 redis 数据库
        User user = new User(1001, "姜源", 20);
        jedis.set("user", JSON.toJSONString(user));
        String dbuser = jedis.get("user");

        System.out.println("dbuser = " + dbuser); // dbuser = {"age":20,"id":1001,"name":"张三"}
        // 4.关闭资源
        jedis.close();
        jedisPool.close();
    }
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class User{
    private Integer id;
    private String name;
    private Integer age;
}
```



### 2. Redis 管道操作

因为在操作Redis的时候，执行一个命令需要先发送请求到Redis服务器，这个过程需要经历网络的延迟，Redis还需要给客户端一个响应。
如果我需要一次性执行很多个命令，上述的方式效率很低，可以通过Redis的管道，先将命令放到客户端的一个Pipeline中，之后一次性的将全部命令都发送到Redis服务，Redis服务- 次性的将 全部的返回结果响应给客户端。

```java
// Redis管道的操作
@Test
public void pipeline(){
    //1.创建连接池
    JedisPool pool = new JedisPool("192. 168.199.109"，6379);
    long l = System.currentTimeMillis():
    /*//2.获取一个连接对象
    Jedis jedis = pool.getResource();
    //3.执行incr。100000次
    for(inti=0;1<100000;1++){
    	jedis.incr("pp");
    }
    //4.释放资源
    jedis.close();*/
    //============================
    //2.获取一个连接对象
    Jedis jedis = pool.getResource();
    //3.创建管道
    Pipeline pipelined = jedis.pipelined();
    //3.执行incr - 100000次放到管道中
    for(int i = 0; i < 100000; 1++){
    	pipelined.iner("qq");
    }
    //4. 执行命令
    pipelined.syncAndReturnAll();
    //5.释放资源
    jedis.close();
    System.out.print1n(System.currentTimeMillis() - 1);
}
```

