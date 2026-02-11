---
title: 02-RocketMQ 使用demo
date: 2019-5-22 19:11:49
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



### 1. 下载启动

#### 1.1 下载解压

https://rocketmq.apache.org/dowloading/releases/

选择 Binary 的 zip 压缩包下载，如 rocketmq-all-x.x.x-bin-release.zip

解压到一个指定的目录，比如我的解压路径 D:\RocketMQ\rocketmq-all-x.x.x-bin-release

#### 1.2 环境变量

变量名：`ROCKETMQ_HOME`
变量值：rocketmq解压路径

![image-20220225234134073](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220225234135.png)

#### 1.3 启动 NameServer

从cmd.exe进入到 `rocketmq解压路径/bin` 目录下，执行命令：

```shell
start mqnamesrv.cmd
```

启动成功如图：

![image-20220225234339944](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220225234341.png)

> 如果弹出以下窗口，说明不能分配足够的内存。
>
> ![image-20220225234422616](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220225234423.png)
>
> 需要修改jvm相关参数，set “JAVA_OPT=%JAVA_OPT% -server -Xms2g -Xmx2g -Xmn1g”，将参数改小。broker的同理。两个文件分别位于：“rocketmq解压路径/bin/runserver.cmd”，“rocketmq解压路径/bin/runbroker.cmd”
>
> 修改完保存后再次启动即可。

#### 1.4 启动 Broker

还是在当前目录，执行命令：

```powershell
start mqbroker.cmd -n 127.0.0.1:9876 autoCreateTopicEnable=true
```

启动成功如图：

![image-20220225234746620](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220225234747.png)

> 启动 broker 可能会出现以下3个问题：
>
> （1）Invalid maximum direct memory size: -XX:MaxDirectMemorySize=15g
>
> ![image-20220225234838086](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220225234838.png)
>
> 解决：修改runbroker.cmd的参数，将-XX:MaxDirectMemorySize=15g的值改小。
>
> 
>
> （2）找不到或无法加载主类
>
> ![image-20220225234911310](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220225234912.png)
>
> 解决：将runbroker.cmd中的
>
> set "JAVA_OPT=%JAVA_OPT% -cp %CLASSPATH%"
>
> 改为：
>
> set "JAVA_OPT=%JAVA_OPT% -cp "%CLASSPATH%""
>
> 
>
> （3）闪退回命令行
>
> 解决：删除C:\Users\”当前系统用户名”\store下的所有文件。



### 2. 使用Demo

#### 2.1 NameServer

名称服务器，参考1.3

#### 2.2 Broker

消息服务器，参考1.4

#### 2.3 Topic

创建一个Topic，还是在当前目录，执行命令：

```shell
start mqadmin.cmd updateTopic -n 127.0.0.1:9876 -b 192.168.31.244:10911 -t demo
```

其中用-b指定Broker, 即步骤1.4中显示的地址。

![image-20220226000220703](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220226000221.png)

> mqadmin.cmd 命令以及其他控制台命令说明参考: https://www.iteye.com/blog/jameswxx-2091971
>
> ![image-20220225235710108](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220225235711.png)



#### 2.4 Producer

建立一个SpringBoot项目, 目录结构：

![image-20220225235950477](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220225235951.png)

添加依赖。

```xml
<dependency>
    <groupId>org.apache.rocketmq</groupId>
    <artifactId>rocketmq-client</artifactId>
    <version>4.4.0</version>
</dependency>
```

创建ProducerService

```java
package com.rocket.demo.product;

import org.apache.rocketmq.client.exception.MQClientException;
import org.apache.rocketmq.client.producer.DefaultMQProducer;
import org.apache.rocketmq.common.message.Message;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

@Service
public class ProducerService {
    private DefaultMQProducer producer = null;

    @PostConstruct
    public void initMQProducer() {
        producer = new DefaultMQProducer("defaultGroup");
        producer.setNamesrvAddr("localhost:9876");
        producer.setRetryTimesWhenSendFailed(3);

        try {
            producer.start();
        } catch (MQClientException e) {
            e.printStackTrace();
        }
    }

    public boolean send(String topic, String tags, String content) {
        Message msg = new Message(topic, tags, "", content.getBytes());
        try {
            producer.send(msg);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @PreDestroy
    public void shutDownProducer() {
        if (producer != null) {
            producer.shutdown();
        }
    }
}
```

测试：

```java
package com.rocket.demo;

import com.rocket.demo.product.ProducerService;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.jupiter.api.Assertions.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest
class RocketmqApplicationTests {

    @Autowired
    private ProducerService producerService;

    @Test
    public void contextLoads() {
        boolean result = producerService.send("demo", "TAG-A", "Hello RocketMQ2");
        assertTrue(result);
    }
}
```

#### 2.5 Consumer

创建ConsumerService

```java
package com.rocket.demo.consumer;

import org.apache.rocketmq.client.consumer.DefaultMQPushConsumer;
import org.apache.rocketmq.client.consumer.listener.ConsumeConcurrentlyContext;
import org.apache.rocketmq.client.consumer.listener.ConsumeConcurrentlyStatus;
import org.apache.rocketmq.client.consumer.listener.MessageListenerConcurrently;
import org.apache.rocketmq.client.exception.MQClientException;
import org.apache.rocketmq.common.message.MessageExt;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.List;

@Service
public class ConsumerService {

    private DefaultMQPushConsumer consumer = null;

    @PostConstruct
    public void initMQConsumer() {
        consumer = new DefaultMQPushConsumer("defaultGroup");
        consumer.setNamesrvAddr("localhost:9876");
        try {
            consumer.subscribe("demo", "*");
            consumer.registerMessageListener(new MessageListenerConcurrently() {
                @Override
                public ConsumeConcurrentlyStatus consumeMessage(
                        List<MessageExt> msgs, ConsumeConcurrentlyContext context) {
                    for (MessageExt msg : msgs) {
                        System.out.println("Message Received: " + new String(msg.getBody()));
                    }
                    return ConsumeConcurrentlyStatus.CONSUME_SUCCESS;
                }
            });
            consumer.start();
        } catch (MQClientException e) {
            e.printStackTrace();
        }
    }

    @PreDestroy
    public void shutDownConsumer() {
        if (consumer != null) {
            consumer.shutdown();
        }
    }
}
```



![image-20220226001059373](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220226001101.png)

