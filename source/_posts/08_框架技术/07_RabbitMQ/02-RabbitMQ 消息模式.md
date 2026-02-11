---
title: 02-RabbitMQ 消息模式
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



### 1. 消息模式

#### 1.1 普通消息

![img](https://www.rabbitmq.com/img/tutorials/python-one.png)

* Java 原生 - 如上集成代码

* SpringBoot - 如上集成代码



#### 1.2 Work 消息

![img](https://www.rabbitmq.com/img/tutorials/python-two.png)

> Work模式消息：一个发送者对应多个消费者。还是保证一个消息只能被消费1次。
> 消息特点：
> 实现了消息消费者的集群、负载均衡，适用于高并发下消息发送的速度远远大于消费速度。 `高并发下的消息生成`

* Java 原生 demo

```java
// 创建消息提供者，实现消息的海量发送
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import java.io.IOException;
import java.util.concurrent.TimeoutException;
/**
* @program: Rabbitmq_Study
* @description: 工作模式下的消息海量发送 每秒发送1000条消息
*/
public class WorkerSend {
    public static void main(String[] args) throws IOException, TimeoutException {
        //1、创建连接工厂
        ConnectionFactory factory=new ConnectionFactory();
        //2、设置服务器信息
        factory.setHost("服务器IP");
        factory.setPort(5672);
        factory.setUsername("guest");
        factory.setPassword("guest");
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
        channel.queueDeclare("TestHello",true,false,true,null);
        //6、消息发布
        /**
        * 参数说明：
        * 1.交换器的名称
        * 2.路由名称
        * 3.消息的基本属性
        * 4.消息内容
        */
        new Thread(()->{
            while (true){
                for(int i=1;i<1000;i++) {
                    try {
                    	channel.basicPublish("", "TestHello", null, ("Hello，Offer!_"+i+"_"+System.currentTimeMillis()).getBytes());
                    } catch (IOException e) {
                    	e.printStackTrace();
                    }
                } try {
                	Thread.sleep(1000);
                } catch (InterruptedException e) {
                	e.printStackTrace();
                }
            }
        }).start();
    }
}
```

```java
// 创建第一个消费者，消费队列里的消息
import com.rabbitmq.client.*;
import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class WorkerConsumer2 {
    public static void main(String[] args) throws IOException, TimeoutException {
        //1、创建连接工厂
        ConnectionFactory factory=new ConnectionFactory();
        //2、设置服务器信息
        factory.setHost("服务器IP");
        factory.setPort(5672);
        factory.setUsername("guest");
        factory.setPassword("guest");
        factory.setVirtualHost("/");
        //3、获取连接对象
        Connection connection=factory.newConnection();
        //4、获取通道对象
        Channel channel=connection.createChannel();
        //5、采用消息监听器的模式进行消息的消费
        while (true) {
            channel.basicConsume("TestHello", new DefaultConsumer(channel) {
                @Override
                public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                    System.out.println("第一个消费者：获取消息：" + new String(body));
                }
            });
        }
    }
}

// 创建第二个消费者 消费队列里的消息
import com.rabbitmq.client.*;
import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class WorkerConsumer2 {
    public static void main(String[] args) throws IOException, TimeoutException {
        //1、创建连接工厂
        ConnectionFactory factory=new ConnectionFactory();
        //2、设置服务器信息
        factory.setHost("服务器IP");
        factory.setPort(5672);
        factory.setUsername("guest");
        factory.setPassword("guest");
        factory.setVirtualHost("/");
        //3、获取连接对象
        Connection connection=factory.newConnection();
        //4、获取通道对象
        Channel channel=connection.createChannel();
        //5、采用消息监听器的模式进行消息的消费
        while (true) {
            channel.basicConsume("TestHello", new DefaultConsumer(channel) {
            	@Override
            	public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                	System.out.println("第二个消费者：获取消息：" + new String(body));
                }
            });
        }
    }
}
```

运行测试：

运行提供者，不断生成消息；运行消费者，不断消费消息



* SpringBoot demo

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

```java
//配置类 RabbitWorkConfig.java
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitWorkConfig {
    @Bean
    public Queue createQue() {
        return new Queue("mq_work_001");
    }
}

// 监听器01
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RabbitListener(queues = "mq_work_001")  //设置需要监听的队列
public class MqWorkListener01 {
    @RabbitHandler  //修饰方法 实现消息的接收
    public void handler(String msg) {
        System.out.println("消费者111：" + msg);
    }
}

// 监听器02
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RabbitListener(queues = "mq_work_001") //设置需要监听的队列
public class MqWorkListener02 {
    @RabbitHandler //修饰方法 实现消息的接收
    public void handler(String msg) {
        System.out.println("消费者222：" + msg);
    }
}

// 控制器
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/mq")
public class MqController {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    /**
     * work消息，可以发给多个消费者，但只能被消费1次，轮询
     * http://localhost:8080/api/mq/fanoutMsg?msg=hello123
     * @param msg 消息内容
     * @return
     */
    @GetMapping("/workMsg")
    public String sendWorkMsg(String msg) {
        rabbitTemplate.convertAndSend("mq_work_001", msg);
        return "OK";
    }
}
```

运行测试：

消费者01和02轮换接收到消息，每个消息每次还是只有1个消费者消费。



#### 1.3 ExChange-fanout 消息

ExChange 的 fanout 的特点就是`将交换器获取的消息，直接全部转发给所有绑定的队列`。  

![image-20200721144617585](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200721144618.png)

* Java 原生 demo

```java
// 消息发送 实现基于发布订阅的消息发送代码
import com.rabbitmq.client.BuiltinExchangeType;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class PubsubSend {
    public static void main(String[] args) throws IOException, TimeoutException {
        //1、创建连接工厂
        ConnectionFactory factory=new ConnectionFactory();
        //2、设置服务器信息
        factory.setHost("服务器IP");
        factory.setPort(5672);
        factory.setUsername("guest");
        factory.setPassword("guest");
        factory.setVirtualHost("/");
        //3、获取连接对象
        Connection connection=factory.newConnection();
        //4、获取通道对象
        Channel channel=connection.createChannel();
        //5、定义交换器
        channel.exchangeDeclare("Testex_pubsub", BuiltinExchangeType.FANOUT);
        //6、定义队列
        channel.queueDeclare("TestEx_Qlog",false,false,false,null);
        channel.queueDeclare("TestEx_Qinfo",false,false,false,null);
        //7、绑定交换器和队列
        /**
        * 参数说明
        * 1.队列命令
        * 2.交换器名称
        * 3.路由名称
        */
        channel.queueBind("TestEx_Qlog","Testex_pubsub","");
        channel.queueBind("TestEx_Qinfo","Testex_pubsub","");
        //8、发布消息
        channel.basicPublish("Testex_pubsub","",null,"今日抢到了秒杀商品".getBytes());
        //9、关闭
        channel.close();
        connection.close();
    }
}
```

```java
// 消息消费 第一个队列 基于发布订阅的消息消费端的代码 监听：TestEx_Qlog
import com.rabbitmq.client.*;
import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class PubsubConsumer01 {
    public static void main(String[] args) throws IOException, TimeoutException {
        //1、创建连接工厂
        ConnectionFactory factory=new ConnectionFactory();
        //2、设置服务器信息
        factory.setHost("服务器IP");
        factory.setPort(5672);
        factory.setUsername("guest");
        factory.setPassword("guest");
        factory.setVirtualHost("/");
        //3、获取连接对象
        Connection connection=factory.newConnection();
        //4、获取通道对象
        Channel channel=connection.createChannel();
        //5、获取消息消费者对象
        channel.basicConsume("TestEx_Qlog", new DefaultConsumer(channel){
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
            	System.out.println("日志-获取消息："+new String(body));
            	channel.basicAck(envelope.getDeliveryTag(),false);
            }
        });
    }
}
```

```java
// 消息消费 第二个队列 基于发布订阅的消息消费端的代码 监听：TestEx_Qinfo
import com.rabbitmq.client.*;
import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class PubsubConsumer01 {
    public static void main(String[] args) throws IOException, TimeoutException {
        //1、创建连接工厂
        ConnectionFactory factory=new ConnectionFactory();
        //2、设置服务器信息
        factory.setHost("服务器IP");
        factory.setPort(5672);
        factory.setUsername("guest");
        factory.setPassword("guest");
        factory.setVirtualHost("/");
        //3、获取连接对象
        Connection connection=factory.newConnection();
        //4、获取通道对象
        Channel channel=connection.createChannel();
        //5、获取消息消费者对象
        channel.basicConsume("TestEx_Qinfo", new DefaultConsumer(channel){
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                System.out.println("消息-获取消息："+new String(body));
                channel.basicAck(envelope.getDeliveryTag(),false);
            }
        });
    }
}
```

![image-20200721145210629](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200721145211.png)



* SpringBoot demo

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

```java
// 配置类
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitFanoutConfig {
    // 2个队列
    @Bean
    public Queue createQue1() {
        return new Queue("mq_fanout_2001_01");
    }
    @Bean
    public Queue createQue2() {
        return new Queue("mq_fanout_2001_02");
    }
    // 1个交换器
    @Bean
    public FanoutExchange createEx() {
        // @name 创建的交换器名称
        // @durable 持久化存储配置
        // @autoDelete 消费者从队列收到消息后是否自动删除
        return new FanoutExchange("ex_fanout_2001", true, true);
    }
    // 交换器绑定 2 个队列
    @Bean
    public Binding createB01(FanoutExchange fx) {
        return BindingBuilder.bind(createQue1()).to(fx);
    }
    @Bean
    public Binding createB02(FanoutExchange fx) {
        return BindingBuilder.bind(createQue2()).to(fx);
    }
}

// 监听器01
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RabbitListener(queues = "mq_fanout_2001_01") //设置需要监听的队列
public class MqFanoutListener01 {
    @RabbitHandler //修饰方法 实现消息的接收
    public void handler(String msg) {
        System.out.println("消费者AAA：" + msg);
    }
}

// 监听器02
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RabbitListener(queues = "mq_fanout_2001_02") //设置需要监听的队列
public class MqFanoutListener02 {
    @RabbitHandler //修饰方法 实现消息的接收
    public void handler(String msg) {
        System.out.println("消费者BBB：" + msg);
    }
}

// 控制器
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/mq")
public class MqController {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    /**
     * 交换器模式：fanout 将交换器获取的消息，直接转发给所有的队列
     * http://localhost:8080/api/mq/fanoutMsg?msg=hello123
     * @param msg 消息内容
     * @return
     */
    @GetMapping("/fanoutMsg")
    public String sendFanoutMsg(String msg) {
        // @name 交换器名称
        // @routingKey 在fanout消息模式下为 null，不做路由过滤
        // @object 消息内容
        rabbitTemplate.convertAndSend("ex_fanout_2001", null, msg);
        return "OK";
    }
}
```

运行测试：

消费者01和02都能同时从队列获取到消息。



#### 1.4 ExChange-direct 消息

ExChange 的 direct 消息的特点是`交换器转发消息可以进行路由过滤，路由只支持精确匹配`。

![image-20200721150010902](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200721150011.png)

* Java 原生 demo

```java
// 编写消息发送者 实现消息的发送 采用Exchange 的Direct模式
import com.rabbitmq.client.BuiltinExchangeType;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class DirectSend {
    public static void main(String[] args) throws IOException, TimeoutException {
        //1、创建连接工厂
        ConnectionFactory factory=new ConnectionFactory();
        //2、设置服务器信息
        factory.setHost("服务器IP");
        factory.setPort(5672);
        factory.setUsername("guest");
        factory.setPassword("guest");
        factory.setVirtualHost("/");
        //3、获取连接对象
        Connection connection=factory.newConnection();
        //4、获取通道对象
        Channel channel=connection.createChannel();
        //5、定义交换器
        channel.exchangeDeclare("Testex_direct", BuiltinExchangeType.DIRECT);
        //6、定义队列
        channel.queueDeclare("TestEx_directlog",false,false,false,null);
        //7、绑定队列到交换器上
        /**
        * 参数说明
        * 1.队列名称
        * 2.交换器名称
        * 3.路由关键字 精确
        */
        channel.queueBind("TestEx_directlog","Testex_direct","log");
        //8、发布消息
        channel.basicPublish("Testex_direct","log",null,"阳光明媚，下午好！".getBytes());
        //9、关闭 销毁
        channel.close();
        connection.close();
    }
}
```

```java
// 编写消费者实现消息队列的消息消费
import com.rabbitmq.client.*;
import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class DirectConsumer01 {
    public static void main(String[] args) throws IOException, TimeoutException {
        //1、创建连接工厂
        ConnectionFactory factory=new ConnectionFactory();
        //2、设置服务器信息
        factory.setHost("服务器IP");
        factory.setPort(5672);
        factory.setUsername("guest");
        factory.setPassword("guest");
        factory.setVirtualHost("/");
        //3、获取连接对象
        Connection connection=factory.newConnection();
        //4、获取通道对象
        Channel channel=connection.createChannel();
        //5、获取消息消费者对象
        channel.basicConsume("TestEx_directlog", new DefaultConsumer(channel){
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                System.out.println("Direct-获取消息："+new String(body));
                channel.basicAck(envelope.getDeliveryTag(),false);
            }
        });
    }
}
```

运行测试：

![image-20200721150452129](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200721150453.png)



* SpringBoot demo

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

```java
// 配置类
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitDirectConfig {
    // 2个队列
    @Bean
    public Queue createQue1() {
        return new Queue("mq_direct_2001_01");
    }
    @Bean
    public Queue createQue2() {
        return new Queue("mq_direct_2001_02");
    }
    // 1个交换器
    @Bean
    public DirectExchange createEx() {
        // @name 创建的交换器名称
        // @durable 持久化存储配置
        // @autoDelete 消费者从队列收到消息后是否自动删除
        return new DirectExchange("ex_direct_2001", true, true);
    }
    // 交换器绑定 2 个队列
    @Bean
    public Binding createB01(DirectExchange fx) {
        return BindingBuilder.bind(createQue1()).to(fx).with("log");
    }
    @Bean
    public Binding createB02(DirectExchange fx) {
        return BindingBuilder.bind(createQue2()).to(fx).with("error");
    }
}

// 监听器01
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RabbitListener(queues = "mq_direct_2001_01") //设置需要监听的队列
public class MqDirectListener01 {
    @RabbitHandler //修饰方法 实现消息的接收
    public void handler(String msg) {
        System.out.println("消费者PPP：" + msg);
    }
}

// 监听器02
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RabbitListener(queues = "mq_direct_2001_02") //设置需要监听的队列
public class MqDirectListener02 {
    @RabbitHandler //修饰方法 实现消息的接收
    public void handler(String msg) {
        System.out.println("消费者QQQ：" + msg);
    }
}

// 控制器
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/mq")
public class MqController {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    /**
     * 交换器模式：direct 路由过滤，只支持精确匹配的 routingKey
     * http://localhost:8080/api/mq/directMsg?msg=hello123&key=log
     * @param msg 消息内容
     * @param key 指定routingKey路由
     * @return
     */
    @GetMapping("/directMsg")
    public String sendDirectMsg(String msg, String key) {
        rabbitTemplate.convertAndSend("ex_direct_2001", key, msg);
        return "OK";
    }
}
```

运行测试：

精确匹配路由 routingKey 的消费者可以收取到队列中的消息。



#### 1.5 ExChange-topic 消息

Exchange的 Topic 模式，路由模式，支持路由匹配，且支持路由的`模糊匹配`。  

![image-20200721153830956](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200721153831.png)

> 模糊匹配：
>
> * 使用 `.` 来区分单词
> * 使用 `*` 来匹配单个单词
> * 使用 `#` 来匹配 0个或多个

* Java 原生 demo

```java
// 消息发送者 实现基于Exchange的Topic模式的消息发送
import com.rabbitmq.client.BuiltinExchangeType;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class TopicSend {
    public static void main(String[] args) throws IOException, TimeoutException {
        //1、创建连接工厂
        ConnectionFactory factory=new ConnectionFactory();
        //2、设置服务器信息
        factory.setHost("服务器IP");
        factory.setPort(5672);
        factory.setUsername("guest");
        factory.setPassword("guest");
        factory.setVirtualHost("/");
        //3、获取连接对象
        Connection connection=factory.newConnection();
        //4、获取通道对象
        Channel channel=connection.createChannel();
        //5、定义交换器
        channel.exchangeDeclare("Testex_topic", BuiltinExchangeType.TOPIC);
        //6、定义队列
        channel.queueDeclare("TestEx_topiclog",false,false,false,null);
        //7、绑定队列到交换器上
        /**
        * 参数说明
        * 1.队列名称
        * 2.交换器名称
        * 3.路由关键字 精确
        */
        channel.queueBind("TestEx_topiclog","Testex_topic","log.#");
        //8、发布消息
        channel.basicPublish("Testex_topic","log.info",null,"上课信息".getBytes());
        channel.basicPublish("Testex_topic","log.error",null,"错误信息".getBytes());
        channel.basicPublish("Testex_topic","log.warn",null,"警告睡觉".getBytes());
        //9、关闭 销毁
        channel.close();
        connection.close();
    }
}
```

```java
// 消息消费的代码实践
import com.rabbitmq.client.*;
import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class TopicConsumer01 {
    public static void main(String[] args) throws IOException, TimeoutException {
        //1、创建连接工厂
        ConnectionFactory factory=new ConnectionFactory();
        //2、设置服务器信息
        factory.setHost("服务器IP");
        factory.setPort(5672);
        factory.setUsername("guest");
        factory.setPassword("guest");
        factory.setVirtualHost("/");
        //3、获取连接对象
        Connection connection=factory.newConnection();
        //4、获取通道对象
        Channel channel=connection.createChannel();
        //5、获取消息消费者对象
        channel.basicConsume("TestEx_topiclog", new DefaultConsumer(channel){
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                System.out.println("Topic-获取消息："+new String(body));
                channel.basicAck(envelope.getDeliveryTag(),false);
            }
        });
    }
}
```



* SpringBoot demo

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

```java
// 配置类
@Configuration
public class RabbitTopicConfig {
    //2个队列
    @Bean
    public Queue createQ1(){
    	return new Queue("qname_topic_2001_01");
    } 
    @Bean
    public Queue createQ2(){
    	return new Queue("qname_topic_2001_02");
    } 
    //1个交换器
    @Bean
    public TopicExchange createEx(){
    	return new TopicExchange("ex_topic_2001",true,true);
    } 
    //交换器绑定 2 个队列
    @Bean
    public Binding createB01(TopicExchange fx){
    	return BindingBuilder.bind(createQ1()).to(fx).with("log.#"); //0~n个单词
    } 
    @Bean
    public Binding createB02(TopicExchange fx){
    	return BindingBuilder.bind(createQ2()).to(fx).with("stu.*"); //1个单词
    }
}

// 监听器01
@Component
@RabbitListener(queues = "qname_topic_2001_01") //设置需要监听的队列
public class TopicListener01 {
    @RabbitHandler //修饰方法 实现消息的接收
    public void handler(String msg){
	    System.out.println("消费者001----"+msg);
    }
}

// 监听器02
@Component
@RabbitListener(queues = "qname_topic_2001_02") //设置需要监听的队列
public class TopicListener02 {
    @RabbitHandler //修饰方法 实现消息的接收
    public void handler(String msg){
    	System.out.println("消费者002----"+msg);
    }
}

// 控制器
@RestController
public class TopicController {
    @Autowired
    private RabbitTemplate rabbitTemplate;
    // http://localhost:8080/api/mq/directMsg?msg=hello123&key=log.hello.123
    @GetMapping("api/mq/topicmsg")
    public String sendWorkMsg(String msg,String key){
        rabbitTemplate.convertAndSend("ex_topic_2001",key,msg);
        return "OK";
    }
}
```



#### 1.6 ExChange-headers 消息

Headers 根据消息头的信息进行匹配队列，而且消息头支持整型和哈希。

对应的属性：`x-match`

支持的2种取值：

* `all`: 默认 headers 中的键值对和消息的键值对完全匹配，才可以实现转发
* `any`: 只需要匹配任意一个，就可以实现消息的转发

![image-20200721160014965](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200721160016.png)

* Java 原生 demo

```java
// 消息发送者 基于Exchange为Headers的模式实现消息的发送
import com.rabbitmq.client.*;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeoutException;

public class HeadersSend {
    public static void main(String[] args) throws IOException, TimeoutException {
    //1、创建连接工厂
    ConnectionFactory factory=new ConnectionFactory();
    //2、设置服务器信息
    factory.setHost("服务器IP");
    factory.setPort(5672);
    factory.setUsername("guest");
    factory.setPassword("guest");
    factory.setVirtualHost("/");
    //3、获取连接对象
    Connection connection=factory.newConnection();
    //4、获取通道对象
    Channel channel=connection.createChannel();
    //5、定义交换器
    channel.exchangeDeclare("Testex_headers", BuiltinExchangeType.HEADERS);
    //6、定义消息属性
    Map<String,Object> headMap=new HashMap<>();
    headMap.put("x-match","all");
    headMap.put("author","Feri");
    headMap.put("version",1);
    AMQP.BasicProperties propertie=new AMQP.BasicProperties.Builder().headers(headMap).build();
    //7、发布消息
    channel.basicPublish("Testex_headers","",propertie,"测试信息".getBytes());
    //9、关闭 销毁
    channel.close();
    connection.close();
    }
}
```

```java
// 消息消费者 实现消息消费
import com.rabbitmq.client.*;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeoutException;

public class HeaderConsumer01 {
    public static void main(String[] args) throws IOException, TimeoutException {
    //1、创建连接工厂
    ConnectionFactory factory=new ConnectionFactory();
    //2、设置服务器信息
    factory.setHost("服务器IP");
    factory.setPort(5672);
    factory.setUsername("guest");
    factory.setPassword("guest");
    factory.setVirtualHost("/");
    //3、获取连接对象
    Connection connection=factory.newConnection();
    //4、获取通道对象
    Channel channel=connection.createChannel();
    channel.exchangeDeclare("Testex_headers", BuiltinExchangeType.HEADERS);
    channel.queueDeclare("Testex_headerslog",false,false,false,null);
    Map<String,Object> headMap=new HashMap<>();
    headMap.put("x-match","all");
    headMap.put("author","Feri");
    headMap.put("version",1);
    channel.queueBind("Testex_headerslog","Testex_headers","",headMap);
    //5、获取消息消费者对象
    channel.basicConsume("Testex_headerslog", new DefaultConsumer(channel){
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                System.out.println("Headers-获取消息："+new String(body));
                channel.basicAck(envelope.getDeliveryTag(),false);
            }
        });
    }
}
```

运行测试：输出 Headers-获取消息：测试信息



* SpringBoot demo

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

```java
// 配置类
@Configuration
public class HeadersConfig {
    //2个队列
    @Bean
    public Queue createQ1(){
    	return new Queue("qname_headers_2001_01");
    } 
    @Bean
    public Queue createQ2(){
    	return new Queue("qname_headers_2001_02");
    } 
    //1个交换器
    @Bean
    public HeadersExchange createEx(){
    	return new HeadersExchange("ex_headers_2001",true,true);
    } 
    // 交换器绑定 2 个队列
    @Bean
    public Binding createB01(HeadersExchange fx){
    	return BindingBuilder.bind(createQ1()).to(fx).whereAll("token","ver").exist();
    } 
    @Bean
    public Binding createB02(HeadersExchange fx){
    	return BindingBuilder.bind(createQ2()).to(fx).whereAny("version","author").exist();
    }
}

// 发送消息
@RestController
public class HeadersController {
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    @GetMapping("api/mq/headmsgall")
    public String sendWorkMsg1(String msg){
        rabbitTemplate.convertAndSend(
            "ex_headers_2001"
            ,null
            ,msg
            ,message -> { //lambda表达式
                    MessageProperties properties=message.getMessageProperties();
                    properties.getHeaders().put("ver","1.0");
                    properties.getHeaders().put("token","abc001");
                    return message;
			}
			,new CorrelationData(UUID.randomUUID().toString()));
        return "OK";
    }
    
    @GetMapping("api/mq/headmsgany")
    public String sendWorkMsg2(String msg){
        rabbitTemplate.convertAndSend(
            "ex_headers_2001"
            ,null
            ,msg
            ,message -> { //lambda表达式
                MessageProperties properties=message.getMessageProperties();
                properties.getHeaders().put("version","1.0");
                return message;
            }
            ,new CorrelationData(UUID.randomUUID().toString()));
        return "OK";
    }
}

// 消息监听器01
@Component
@RabbitListener(queues = "qname_headers_2001_01") //设置需要监听的队列
public class HeadersListener01 {
    @RabbitHandler //修饰方法 实现消息的接收
    public void handler(String msg){
    	System.out.println("消费者001----"+msg);
    }
}
// 消息监听器02
@Component
@RabbitListener(queues = "qname_headers_2001_02") //设置需要监听的队列
public class HeadersListener02 {
    @RabbitHandler //修饰方法 实现消息的接收
    public void handler(String msg){
    	System.out.println("消费者002----"+msg);
    }
}
```

运行测试：

whereAll() 所有的 header 字段匹配才能发送成功，消息被获取到；

whereAny() 任一的 header 字段匹配都能发送成功，消息被获取到。



### 2. 延迟消息

#### 2.1 死信

RabbitMQ可以为消息队列设置内部消息的有效期，如果消息超过有效期，还未被处理，name这条消息就会被转发到死信队列，成为死信消息。

`DLX` 私信交换器 Dead Letter - ExChange，专门用来进行转发死信消息到达对应的死信队列中。

`TTL` 消息对立内部消息的有效期。

涉及参数：

* 消息队列中消息的有效期： `x-message-ttl` **设置有效期**
* 消息队列对应的死信交换器：`x-dead-letter-exchange` **设置死信交换器**
* 消息队列对应的死信路由： `x-dead-letter-routingkey` **死信交换器对应的路由**

需要满足的条件：

* 超时
* 消息被拒绝队列满了或者达到了上限...

#### 2.2 场景

延迟处理或者超时处理，借助死信实现延迟消息处理：

把消息发送到一个队列中（`设置消息的有效期为指定的时间`），该队列没有消费者(`没有监听器`)，目的让消息`超时成为死信`，借助死信交换器将死信消息转发到对应的队列（`死信队列`），值需要`监听死信队列`就可以实现消息的延迟处理。

> 如：
>
> * 超时订单，15分/30分/2小时 必须完成支付，超时自动处理，如关闭订单
> * 自动确认收货，7天自动收货
> * 默认评价，7天自动好评
> * 预约提醒，秒杀活动开始前推送提醒
> * 订单退款，超过一定期限，没人处理就自动处理

#### 2.3 实现

借助 RabbitMQ 的死信机制实现延迟消息处理。

 ![image-20200721200449222](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200721200450.png)

```java
// 配置类
@Configuration
public class RabbitMQConfig {
    //【延迟队列】
    //延迟队列：设置三个参数 1.有效期 2.死信交换器 3.匹配路由
    @Bean
    public Queue createQ01() {
        Map<String,Object> args=new HashMap<>();
        //设置队列内部的消息的有效期 10秒
        args.put("x-message-ttl",10000);
        //设置死信交换器名称
        args.put("x-dead-letter-exchange","dead-study");
        //设置匹配的路由
        args.put("x-dead-letter-routing-key","order-timeout");
        //设置队列的名称，和对应的属性
        return QueueBuilder.durable("qname-time-order").withArguments(args).build();
    }
    
    //【死信队列】 超时订单
    @Bean
    public Queue createQ02(){
    	return new Queue("qname-timeout-order");
    }
    //【死信交换器】注意需要和延迟队列绑定的交换器一致
    @Bean
    public DirectExchange createEx(){
    	return new DirectExchange("dead-study");
    } 
    //【绑定】死信交换器 绑定 死信队列，并关联上 延迟队列。
    //注意 路由的名称需要和延迟队列中绑定的名称一致
    @Bean
    public Binding createBd(DirectExchange ex){
    	return BindingBuilder.bind(createQ02()).to(ex).with("order-timeout");
    }
}

// 监听器 - 监听死信队列
@Component
@RabbitListener(queues = "qname-timeout-order")
public class OrderTimeOutLintener {
    @RabbitHandler
    public void handler(String msg){
    	System.out.println("消息--->"+msg+"------>"+System.currentTimeMillis()/1000);
    }
}

// 控制器 - 发送消息
// http://localhost:8080/api/mq/dlxmsg?msg=222222
@RestController
public class DeadController {
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    @GetMapping("/api/mq/dlxmsg")
    public String sendMsg(String msg){
        System.out.println("发送消息---->"+msg+"---->"+System.currentTimeMillis()/1000);
        rabbitTemplate.convertAndSend(null,"qname-time-order",msg);
        return "OK-"+System.currentTimeMillis();
    }
}
```

运行测试：

发送消息后，过了 10s 监听器监听到死信队列消息，做该做的逻辑即可。





















