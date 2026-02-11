---
title: 01-RabbitMQ 消息队列
date: 2018-6-21 23:59:45
tags:
- RabbitMQ
categories: 
- 08_框架技术
- 07_RabbitMQ
---



![image-20200721101643278](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200721101644.png)



官网：https://www.rabbitmq.com/#getstarted

中文教程网：http://rabbitmq.mr-ping.com



### 1. 简介

MQ，消息队列（Message Queue，简称MQ），本质是个队列，`FIFO先入先出`，只不过队列中存放的内容是 message 而已。 其主要用途：不同进程Process/线程Thread之间通信。
MQ框架流行的有 RabbitMq、ActiveMq、ZeroMq、kafka，以及阿里开源的 RocketMQ。

* 主流 MQ 框架对比

| 特性         | ActiveMQ                                                     | `RabbitMQ`                                                   | RocketMQ                                                     | Kafka                                                        |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 优劣 势总 结 | 非常成熟，功能强 大，在业内大量的 公司以及项目中都 有应用 偶尔会有较 低概率丢失消息 而 且现在社区以及国 内应用都越来越 少，官方社区现在 对ActiveMQ 5.x维 护越来越少，几个 月才发布一个版本 而且确实主要是基 于解耦和异步来用 的，较少在大规模 吞吐的场景中使用。 | erlang语言开 发，性能极其 好，延时很 低； 吞吐量到 万级，MQ功能 比较完备 而且 开源提供的管 理界面非常 棒，用起来很 好用 社区相对 比较活跃，几 乎每个月都发 布几个版本分 在国内一些互 联网公司近几 年用rabbitmq 也比较多一些。 | 接口简单易用，而且 毕竟在阿里大规模应 用过，有阿里品牌保 障 日处理消息上百亿 之多，可以做到大规 模吞吐，性能也非常 好，分布式扩展也很 方便，社区维护还可 以，可靠性和可用性 都是可以的，还可以 支撑大规模的topic数 量，支持复杂MQ业 务场景 而且一个很大 的优势在于，阿里出 品都是java系精品。 | kafka的特点其实很明显，就是 仅仅提供较少的核心功能，但 是提供超高的吞吐量，ms级的 延迟，极高的可用性以及可靠 性，而且分布式可以任意扩展 同时kafka最好是支撑较少的 topic数量即可，保证其超高吞 吐量 而且kafka唯一的一点劣 势是有可能消息重复消费，那 么对数据准确性会造成极其轻 微的影响，在大数据领域中以 及日志采集中，这点轻微影响 可以忽略 这个特性天然适合大 数据实时计算。 |

* **`RabbitMQ`** - `异步消息队列` / 消息中间件
    RabbitMQ 是部署最广泛的开源消息代理，是`最受欢迎的开源消息代理之一`，支持多种消息传递协议，满足大规模，高可用性的要求。
    底层实现语言：`Erlang`

![image-20200721104639117](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200721104640.png)

* RabbitMQ 作用
    * 异步消息通信
    * 分布式部署
    * 支持多种语言，插件丰富
    * 支持消息有效期处理
* RabbitMQ 应用场景
    * 异步解耦：简化复杂的同步方法
    * 削峰填谷：高并发下的异步处理，如下单等复杂接口
    * 延迟消息处理：基于死信队列，实现延迟消息处理
    * 协调器：自定义分布式事务
* RabbitMQ 消息类型
    * 普通消息
        ![img](https://www.rabbitmq.com/img/tutorials/python-one.png)
    * Work 消息
        ![img](https://www.rabbitmq.com/img/tutorials/python-two.png)
    * 发布/订阅消息
        ![img](https://www.rabbitmq.com/img/tutorials/python-three.png)
    * 路由消息
        ![img](https://www.rabbitmq.com/img/tutorials/python-four.png)

* RabbitMQ 消息角色
    * **P** - Producing : 消息`提供者`，主要实现消息的发送，可以将消息发到指定的队列中
    * **Q** - Queue : 消息`队列`，主要是实现消息的存储，存储特点是 `FIFO 先进先出`，`异步消息`
    * **C** - Consuming : 消息`消费者`，主要是实现消息的消费，可以指定的消息队列中获取对应的消息  

### 2. RabbitMQ 安装 

* 虚拟机 或 云服务器(安全组开放 `15672`、`5672` 端口)
* 基于 Docker 镜像

```sh
#搜索（可选）
docker search rabbitmq:management
#安装
docker pull rabbitmq:management
#启动（15671端口映射可选）
docker run -d --name rabbitmq -p 15671:15671 -p 15672:15672 -p 5671:5671 -p 5672:5672 rabbitmq:management
#测试（默认登陆 账号：guest 密码：guest）
http://服务器ip:15672
```

> RabbitMQ 默认端口号：
>
> * 4369 (epmd), 25672 (Erlang distribution)
> * `5672`, `5671` (AMQP 0-9-1 without and with TLS)
> * `15672` (if management plugin is enabled)
> * 61613, 61614 (if STOMP is enabled)
> * 1883, 8883 (if MQTT is enabled)

* 注意：如果队列在 rabbit 的管理页面已经创建了队列，修改程序去重新测试时，注意`删除管理页面中的 队列或routingkey`。再次测试即可。

### 3. Java 集成

* 依赖

```xml
<dependency>
    <groupId>com.rabbitmq</groupId>
    <artifactId>amqp-client</artifactId>
    <version>5.6.0</version>
</dependency>
```

* 消息发送

```java
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class ProducerSend {
    public static void main(String[] args) throws IOException, TimeoutException {
        //1、创建连接工厂
        ConnectionFactory factory=new ConnectionFactory();
        //2、设置服务器信息
        factory.setHost("服务器ip");
        factory.setPort(5672); // 默认端口
        factory.setUsername("guest"); // 默认账号
        factory.setPassword("guest"); // 默认密码
        factory.setVirtualHost("/");
        //3、获取连接对象
        Connection connection=factory.newConnection();
        //4、获取通道对象
        Channel channel=connection.createChannel();
        //5、创建队列
        /**
        * 参数说明：
        * 1.队列名称
        * 2.是否持久化
        * 3.是否设置消息的排他 排他特性：只能是声明的人使用，并且使用结束自动删除
        * 4.是否自动删除
        * 5.参数信息
        */
        channel.queueDeclare("hello",true,false,true,null);
        //6、消息发布
        /**
        * 参数说明：
        * 1.交换器的名称
        * 2.路由名称
        * 3.消息的基本属性
        * 4.消息内容
        */
        channel.basicPublish("","hello",null,"Hello，Offer!".getBytes());
        //7、关闭
        channel.close();
        connection.close();
    }
}
```

* 运行测试

![image-20200721110659988](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200721110701.png)

* 消息消费

```java
import com.rabbitmq.client.*;
import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class MsgConsumer {
    public static void main(String[] args) throws IOException, TimeoutException {
        //1、创建连接工厂
        ConnectionFactory factory=new ConnectionFactory();
        //2、设置服务器信息
        factory.setHost("服务器ip");
            factory.setPort(5672);
        factory.setUsername("guest");
        factory.setPassword("guest");
        factory.setVirtualHost("/");
        //3、获取连接对象
        Connection connection=factory.newConnection();
        //4、获取通道对象
        Channel channel=connection.createChannel();
        //5、获取消息消费者对象
        channel.basicConsume("hello", new DefaultConsumer(channel){
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                    System.out.println("获取消息："+new String(body));
                    channel.basicAck(envelope.getDeliveryTag(),false);
            }
        });
    }
}
```

* 运行测试

![image-20200721110925371](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200721110926.png)

### 4. SpringBoot 集成

* 依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

* 配置文件

```yaml
spring:
    rabbitmq:
        host: 服务器ip
        port: 5672
        username: guest
        password: guest
        virtual-host: /
```

* 配置类

```java
@Configuration
public class RabbitConfig {
    //创建队列
    @Bean
    public Queue createQue(){
    	return new Queue("qname_001");
    }
}
```

* 消息的发送

```java
@RestController
@RequestMapping("api/mq")
public class MqController {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    /**
     * 普通消息，只能被消费1次
     * http://localhost:8080/api/mq/sendMsg?msg=hello123
     * @param msg
     * @return
     */
    @GetMapping("/sendMsg")
    public String sendMsg(String msg) {
        rabbitTemplate.convertAndSend("qname_001", msg);
        return "OK";
    }
}
```

* 消息的消费

```java
@Component
@RabbitListener(queues = "qname_001") //设置需要监听的队列
public class QnameListener {
    @RabbitHandler //修饰方法 实现消息的接收
    public void handler(String msg){
    	System.out.println("消费者----"+msg);
    }
}
```