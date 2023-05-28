---
title: 03-RocketMQ 延迟消息
date: 2019-5-23 22:25:40
tags:
- RocketMQ
- SpringCloudAlibaba
categories: 
- 08_框架技术
- 14_RocketMQ
---

![image-20220225231712788](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220225231718.png)



官网：https://rocketmq.apache.org/

参考资料：https://github.com/apache/rocketmq



### 1. 定时(延迟)消息

RocketMQ 不支持任意时间自定义的延迟消息，仅支持内置预设值的延迟时间间隔的延迟消息。

18个级别延迟消息，预设值的延迟时间间隔为：1s、 5s、 10s、 30s、 1m、 2m、 3m、 4m、 5m、 6m、 7m、 8m、 9m、 10m、 20m、 30m、 1h、 2h

只有延时消息的概念，并且需要在配置文件中给出延时等级的定义，在`broker.conf`中指定以下配置：

```shell
messageDelayLevel=1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h
```

| 级别 | 延迟时间 | 备注 |
| :--: | :------: | :--: |
|  1   |    1s    |      |
|  2   |    5s    |      |
|  3   |   10s    |      |
|  4   |   30s    |      |
|  5   |    1m    |      |
|  6   |    2m    |      |
|  7   |    3m    |      |
|  8   |    4m    |      |
|  9   |    5m    |      |
|  10  |    6m    |      |
|  11  |    7m    |      |
|  12  |    8m    |      |
|  13  |    9m    |      |
|  14  |   10m    |      |
|  15  |   20m    |      |
|  16  |   30m    |      |
|  17  |    1h    |      |
|  18  |    2h    |      |

延时消息的使用场景：
比如电商里，提交了一个订单就可以发送一个延时消息，1h后去检查这个订单的状态，如果还是未付款就取消订单释放库存。

### 2. Demo

#### 2.1 生产者

```java
import com.xin.rocketmq.demo.config.JmsConfig;
import org.apache.rocketmq.client.producer.DefaultMQProducer;
import org.apache.rocketmq.client.producer.SendResult;
import org.apache.rocketmq.common.message.Message;

public class ProducerDelay {
    public static void main(String[] args) throws Exception {
        DefaultMQProducer producer = new DefaultMQProducer("please_rename_unique_group_name");

        producer.setNamesrvAddr("192.168.10.11:9876");
        producer.start();

        Message msg1 = new Message(JmsConfig.TOPIC, "订单001".getBytes());
        msg1.setDelayTimeLevel(2);//延迟5秒

        Message msg2 = new Message(JmsConfig.TOPIC, "订单001".getBytes());
        msg2.setDelayTimeLevel(4);//延迟30秒

        SendResult sendResult1 = producer.send(msg1);
        SendResult sendResult2 = producer.send(msg2);
        System.out.println("Product1-同步发送-Product信息={}" + sendResult1);
        System.out.println("Product2-同步发送-Product信息={}" + sendResult2);
        producer.shutdown();
    }
}
```



#### 2.2 消费者

```java
import com.xin.rocketmq.demo.config.JmsConfig;
import org.apache.rocketmq.client.consumer.DefaultMQPushConsumer;
import org.apache.rocketmq.client.consumer.listener.ConsumeConcurrentlyContext;
import org.apache.rocketmq.client.consumer.listener.ConsumeConcurrentlyStatus;
import org.apache.rocketmq.client.consumer.listener.MessageListenerConcurrently;
import org.apache.rocketmq.common.message.MessageExt;

import java.util.List;

public class ConsumerDelay {
    public static void main(String[] args) throws Exception {
        // 实例化消费者
        DefaultMQPushConsumer consumer = new DefaultMQPushConsumer("please_rename_unique_group_name");

        // 设置NameServer的地址
        consumer.setNamesrvAddr("192.168.10.11:9876");

        // 订阅一个或者多个Topic，以及Tag来过滤需要消费的消息
        consumer.subscribe(JmsConfig.TOPIC, "*");
        // 注册消息监听者
        consumer.registerMessageListener(new MessageListenerConcurrently() {
            @Override
            public ConsumeConcurrentlyStatus consumeMessage(List<MessageExt> messages, ConsumeConcurrentlyContext context) {
                for (MessageExt message : messages) {
                    // Print approximate delay time period
                    System.out.println("Receive message[msgId=" + message.getMsgId() + "] " + (System.currentTimeMillis() - message.getStoreTimestamp()) + "ms later");
                }
                return ConsumeConcurrentlyStatus.CONSUME_SUCCESS;
            }
        });
        // 启动消费者
        consumer.start();
    }
}
```

