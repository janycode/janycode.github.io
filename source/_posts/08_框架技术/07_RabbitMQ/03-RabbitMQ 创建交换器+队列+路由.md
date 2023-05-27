---
title: 03-RabbitMQ 创建交换器+队列+路由
date: 2018-9-24 12:16:56
tags:
- RabbitMQ
categories: 
- 08_框架技术
- 07_RabbitMQ
---



![image-20200721101643278](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200721101644.png)



官网：https://www.rabbitmq.com/#getstarted

中文教程网：http://rabbitmq.mr-ping.com



> RabbitMQ 创建 exchange、queue、routing 

### 1. web管理页面上创建

这里只是为了展示, 在实际开发中一般在消费端通过注解来自动创建。

1, 创建 Exchange 

![image-20210228121148995](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210228121149.png)

2, 创建 queue

![image-20210228121202830](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210228121203.png)

3, 配置 routing key , 绑定 exchange 和 queue( 在exchange 或 queue 均可以绑定)

![image-20210228121245808](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210228121247.png)

![image-20210228121303300](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210228121304.png)



### 2. 消费者端注解自动创建

1, 创建一个 springboot 项目, 导入依赖(和生产者一致)

2, application.properties (基础配置和生产者一致, 消费者需要再额外配置一些)

```properties
# rabbitmq
spring.rabbitmq.addresses=localhost:5672
spring.rabbitmq.username=guest
spring.rabbitmq.password=guest
spring.rabbitmq.virtual-host=/
spring.rabbitmq.connection-timeout=15000

# rabbitmq 消费者
# 并发数
spring.rabbitmq.listener.simple.concurrency=5
# 最大并发数
spring.rabbitmq.listener.simple.max-concurrency=10
# 签收模式
spring.rabbitmq.listener.simple.acknowledge-mode=AUTO
# 限流, 避免同时处理大量消息导致服务器 down 机, 根据线程数来决定
spring.rabbitmq.listener.simple.prefetch=1

# 服务端口
server.port=9002

# 格式化时间
spring.http.encoding.charset=UTF-8
spring.jackson.date-format=yyyy-MM-dd HH:mm:ss
spring.jackson.time-zone=GMT+8
```

3, 创建实体类, 实现序列化接口, 这个实体类要和生产者实体类一致, 因为发什么消息就应该接收什么消息

4, 消费消息

　　1) `@RabbitListener` 是一个强大的注解, 主要作用有二: 

　　　　1. 监听 Queue

　　　　2. 自动创建 exchange, queue, routing key

　　2) `@RabbitHandler` 用于发现有消息产生就立即触发方法来消费

```java
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import com.ictpaas.pojo.Order;

@Component
public class OrderRevicer {
    
    /**
     * 消费消息
     * @param order    消息内容
     * @param headers    消息 properties
     */
    @RabbitListener(bindings = @QueueBinding(
                value = @Queue(value = "order-queue", durable = "true"),
                exchange = @Exchange(name = "order-exchange", durable = "true", type = "topic"),
                key = "order.#"
            )
    )
    @RabbitHandler
    public void onOrderMsg(@Payload Order order, @Headers Map<String, Object> headers) {
        System.out.println("-------- 收到消息, 开始消费 ---------");
        System.out.println("订单 ID : " + order.getId());
        System.out.println("消息 ID : " + order.getMsgId());
    };
}
```

5, 测试

开发中一般会通过注解来创建 exchange, queue, routing key,

先启动消费者服务来创建所需 rabbitMQ 组件, 因为要监听 queue 所以消费者服务不能停止, 一直要处于启动状态

调用生产者服务来生成消息并发送

结果会每生产一条消息, 消费者服务就会立马收到消息并消费，打印出相关信息。

![image-20210228121640962](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210228121642.png)