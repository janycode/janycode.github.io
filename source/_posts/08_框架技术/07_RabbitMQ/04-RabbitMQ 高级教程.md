---
title: 04-RabbitMQ 高级教程
date: 2021-08-17 12:16:56
tags:
- RabbitMQ
categories: 
- 08_框架技术
- 07_RabbitMQ
---



![image-20200721101643278](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200721101644.png)

# 1. MQ 的相关概念

## 1.1 什么是 MQ 

MQ(message queue)，从字面意思上看，本质是个队列，**FIFO 先入先出**，只不过队列中存放的内容是message 而已，还是一种跨进程的通信机制，用于上下游传递消息。在互联网架构中，MQ 是一种非常常

见的上下游“逻辑解耦+物理解耦”的消息通信服务。使用了 MQ 之后，消息发送上游只需要依赖 MQ，不

用依赖其他服务。

## 1.2 为什么要用 MQ 

### 1.2.1 流量消峰

举个例子，如果订单系统最多能处理一万次订单，这个处理能力应付正常时段的下单时绰绰有余，正常时段我们下单一秒后就能返回结果。但是在高峰期，如果有两万次下单操作系统是处理不了的，只能限制订单超过一万后不允许用户下单。使用消息队列做缓冲，我们可以取消这个限制，把一秒内下的订单分散成一段时间来处理，这时有些用户可能在下单十几秒后才能收到下单成功的操作，但是比不能下单的体验要好。

![image-20211230172619942](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230172619942.png)

### 1.2.2 应用解耦

以电商应用为例，应用中有订单系统、库存系统、物流系统、支付系统。用户创建订单后，如果耦合调用库存系统、物流系统、支付系统，任何一个子系统出了故障，都会造成下单操作异常。当转变成基于消息队列的方后，系统间调用的问题会减少很多，比如物流系统因为发生故障，需要几分钟来修复。在这几分钟的时间里，物流系统要处理的内存被缓存在消息队列中，用户的下单操作可以正常完成。当物流系统恢复后，继续处理订单信息即可，中单用户感受不到物流系统的故障，提升系统的可用性。

![image-20211230172643280](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230172643280.png)

### 1.2.3 异步处理

有些服务间调用是异步的，例如 A 调用 B，B 需要花费很长时间执行，但是 A 需要知道 B 什么时候可以执行完，以前一般有两种方式，A 过一段时间去调用 B 的查询 api 查询。或者 A 提供一个 callback api， B 执行完之后调用 api 通知 A 服务。这两种方式都不是很优雅，使用消息总线，可以很方便解决这个问题，A 调用 B 服务后，只需要监听 B 处理完成的消息，当 B 处理完成后，会发送一条消息给 MQ，MQ 会将此消息转发给 A 服务。这样 A 服务既不用循环调用 B 的查询 api，也不用提供 callback api。同样 B 服务也不用做这些操作。A 服务还能及时的得到异步处理成功的消息。

![image-20211230172653752](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230172653752.png)

### 1.2.4 广播

如果没有消息队列，每当一个新的业务方接入，我们都要联调一次新接口。有了消息队列，我们只需要关心消息是否送达了队列，至于谁希望订阅，是下游的事情，无疑极大地减少了开发和联调的工作量。

### 1.2.5 最终一致性

最终一致性指的是两个系统的状态保持一致，要么都成功，要么都失败。当然有个时间限制，理论上越快越好，但实际上在各种异常的情况下，可能会有一定延迟达到最终一致状态，但最后两个系统的状态是一样的。

------

## 1.3 MQ 的分类

### 1.3.1 ActiveMQ

**优点：**单机吞吐量万级，时效性 ms 级，可用性高，基于主从架构实现高可用性，消息可靠性较低的概率丢失数据。

**缺点：**官方社区现在对 ActiveMQ 5.x **维护越来越少，高吞吐量场景较少使用。**

### 1.3.2 Kafka

大数据的杀手锏，谈到大数据领域内的消息传输，则绕不开 Kafka，这款**为大数据而生**的消息中间件，以其**百万级 TPS** 的吞吐量名声大噪，迅速成为大数据领域的宠儿，在数据采集、传输、存储的过程中发挥着举足轻重的作用。目前已经被 LinkedIn，Uber， Twitter， Netflix 等大公司所采纳。

**优点：**性能卓越，单机写入 TPS 约在百万条/秒，**最大的优点，就是吞吐量高**。时效性 ms 级可用性非常高，kafka 是分布式的，一个数据多个副本，少数机器宕机，不会丢失数据，不会导致不可用，消费者采用 Pull 方式获取消息， 消息有序， 通过控制能够保证所有消息被消费且仅被消费一次;有优秀的第三方Kafka Web 管理界面 Kafka-Manager；在日志领域比较成熟，被多家公司和多个开源项目使用；功能支持：功能较为简单，主要支持简单的 MQ 功能，**在大数据领域的实时计算以及日志采集被大规模使用。**

**缺点：**Kafka 单机超过 64 个队列/分区，Load 会发生明显的飙高现象，队列越多，load 越高，发送消息响应时间变长，使用短轮询方式，实时性取决于轮询间隔时间，消费失败不支持重试；支持消息顺序，但是一台代理宕机后，就会产生消息乱序，社区更新较慢。

### 1.3.3 RocketMQ

​	RocketMQ 出自阿里巴巴的开源产品，用 Java 语言实现，在设计时参考了 Kafka，并做出了自己的一些改进。被阿里巴巴广泛应用在订单，交易，充值，流计算，消息推送，日志流式处理，binglog 分发等场景。

**优点：**单机吞吐量十万级**，可用性非常高，分布式架构，**消息可以做到 0 丢失**，MQ 功能较为完善，还是分布式的，扩展性好，**支持 10 亿级别的消息堆积**，不会因为堆积导致性能下降，源码是 java 我们可以自己阅读源码，定制自己公司的 MQ。

**缺点：**支持的客户端语言不多，目前是 java 及 c++，其中 c++不成熟；社区活跃度一般，没有在 MQ核心中去实现 JMS 等接口，有些系统要迁移需要修改大量代码。

### 1.3.4 RabbitMQ

2007 年发布，是一个在 AMQP(高级消息队列协议)基础上完成的，可复用的企业消息系统，**是当前最主流的消息中间件之一。**

**优点：**由于 erlang 语言的高并发特性**，性能较好；**吞吐量到万级**，MQ 功能比较完备，健壮、稳定、易用、跨平台、**支持多种语言 如：Python、Ruby、.NET、Java、JMS、C、PHP、ActionScript、XMPP、STOMP等，支持 AJAX 文档齐全；开源提供的管理界面非常棒，用起来很好用，社区活跃度高；更新频率相当高。

**缺点：**商业版需要收费，学习成本较高。

## 1.4 MQ 的选择 

### 1.4.1 Kafka 

Kafka 主要特点是基于 Pull 的模式来处理消息消费，追求高吞吐量，一开始的目的就是用于日志收集 和传输，**适合产生大量数据**的互联网服务的数据收集业务。大型公司建议可以选用，如果有**日志采集**功能， 肯定是首选 kafka 了。

### 1.4.2 RocketMQ 

天生为**金融互联网领域**而生，对于可靠性要求很高的场景，尤其是电商里面的订单扣款，以及业务削 峰，在大量交易涌入时，后端可能无法及时处理的情况。RoketMQ 在稳定性上可能更值得信赖，这些业务 场景在阿里双 11 已经经历了多次考验。 

### 1.4.3 RabbitMQ 

结合 erlang 语言本身的并发优势，**性能好、时效性微秒级**，社区活跃度也比较高，管理界面用起来十分 方便，如果你的**数据量没有那么大**，中小型公司优先选择功能比较完备的 RabbitMQ。

------

# 2. RabbitMQ 

## 2.1 RabbitMQ 的概念 

RabbitMQ 是一个消息中间件：它接受并转发消息。你可以把它当做一个快递站点，当你要发送一个包时，你把你的包裹放到快递站，快递员最终会把你的快递送到收件人那里，按照这种逻辑 RabbitMQ 是 一个快递站，一个快递员帮你传递快件。RabbitMQ 与快递站的主要区别在于，它不处理快件而是接收， 存储和转发消息数据。

![image-20211230172733814](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230172733814.png)

**（AMQP 0-9-1 模型）**

## 2.2 四大核心概念 

**生产者** 

产生数据发送消息的程序是生产者。 

**交换机** 

交换机是 RabbitMQ 非常重要的一个部件，一方面它接收来自生产者的消息，另一方面它将消息 推送到队列中。交换机必须确切知道如何处理它接收到的消息，是将这些消息推送到特定队列还是推 送到多个队列，亦或者是把消息丢弃，这个得有交换机类型决定 。

**队列**

队列是RabbitMQ 内部使用的一种数据结构，尽管消息流经 RabbitMQ 和应用程序，但它们只能存 储在队列中。队列仅受主机的内存和磁盘限制的约束，本质上是一个大的消息缓冲区。许多生产者可 以将消息发送到一个队列，许多消费者可以尝试从一个队列接收数据。这就是我们使用队列的方式 。

**消费者** 

消费与接收具有相似的含义。消费者大多时候是一个等待接收消息的程序。请注意生产者，消费 者和消息中间件很多时候并不在同一机器上。同一个应用程序既可以是生产者又是可以是消费者。

## 2.3 各个名词介绍 

![image-20211230172747783](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230172747783.png)

**Broker：**接收和分发消息的应用，RabbitMQ Server 就是 Message Broker。 

**Virtual host：**出于多租户和安全因素设计的，把 AMQP 的基本组件划分到一个虚拟的分组中，类似于网络中的 namespace 概念。当多个不同的用户使用同一个 RabbitMQ server 提供的服务时，可以划分出多个 vhost，每个用户在自己的 vhost 创建 exchange／queue 等。 

**Connection：**publisher／consumer 和 broker 之间的 TCP 连接。 

**Channel：**如果每一次访问 RabbitMQ 都建立一个 Connection，在消息量大的时候建立 TCP Connection 的开销将是巨大的，效率也较低。Channel 是在 connection 内部建立的逻辑连接，如果应用程序支持多线程，通常每个 thread 创建单独的 channel 进行通讯，AMQP method 包含了 channel id 帮助客户端和 message broker 识别channel，所以 channel 之间是完全隔离的。Channel 作为轻量级的 Connection 极大减少了操作系统建立 TCP connection 的开销。

**Exchange：**message 到达 broker 的第一站，根据分发规则，匹配查询表中的 routing key，分发消息到 queue 中去。常用的类型有：direct (point-to-point), topic (publish-subscribe) and fanout (multicast) 。

**Queue：**消息最终被送到这里等待 consumer 取走。 

**Binding：**exchange 和 queue 之间的虚拟连接，binding 中可以包含 routing key，Binding 信息被保 

存到 exchange 中的查询表中，用于 message 的分发依据。

## 2.4 交换机和交换机类型

**服务器发送消息不会直接发送到队列中（Queue），只能将消息发送给交换机（Exchange）**，然后根据确定的规则，RabbitMQ将会决定消息该投递到哪个队列。这些规则称为**路由键（routing key）**，队列通过路由键绑定到交换机上。消息发送到服务器端（broker），消息也有自己的路由键（也可以是空），RabbitMQ也会将消息和消息指定发送的交换机的绑定（binding，就是队列和交互机的根据路由键映射的关系）的路由键进行匹配。

如果匹配的话，就会将消息投递到相应的队列。交换机工作的内容非常简单，一方面它接收来自生产者的消息，另一方面将它们推入队列。交换机必须确切知道如何处理收到的消息。是应该把这些消息放到特定队列还是说把他们到许多队列中还是说应该丢弃它们。这就的由交换机的类型来决定。

交换机是用来发送消息的AMQP实体。交换机拿到一个消息之后将它路由给一个或零个队列。它使用哪种路由算法是由交换机类型和被称作绑定（bindings）的规则所决定的。AMQP 0-9-1的代理提供了四种交换机。

| **Name（交换机类型）**           | **Default pre-declared names（预声明的默认名称）** |
| -------------------------------- | -------------------------------------------------- |
| Direct exchange（直连交换机）    | (Empty string) and amq.direct                      |
| Fanout exchange（扇型交换机）    | amq.fanout                                         |
| **Topic exchange（主题交换机）** | amq.topic                                          |
| Headers exchange（头交换机）     | amq.match (and amq.headers in RabbitMQ)            |

除交换机类型外，在声明交换机时还可以附带许多其他的属性，其中最重要的几个分别是：

- Name
- Durability （消息代理重启后，交换机是否还存在）

- Auto-delete （当所有与之绑定的消息队列都完成了对此交换机的使用后，删掉它）
- Arguments（依赖代理本身）

交换机可以有两个状态：持久（durable）、暂存（transient）。持久化的交换机会在消息代理（broker）重启后依旧存在，而暂存的交换机则不会（它们需要在代理再次上线后重新被声明）。然而并不是所有的应用场景都需要持久化的交换机。

### 2.4.1 Direct Exchange

将消息中的Routing key与该Exchange关联的所有Binding中的Routing key进行比较，**如果相等**，则发送到该Binding对应的Queue中。

![image-20211230172801166](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230172801166.png)

### 2.4.2 Topic Exchange

将消息中的Routing key与该Exchange关联的所有Binding中的Routing key进行对比，**如果匹配上了**，则发送到该Binding对应的Queue中。

![image-20211230172811483](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230172811483.png)

#### topic要求

发送到类型是 topic 交换机的消息的 routing_key 不能随意写，必须满足一定的要求，**它必须是一个单词列表，以点号分隔开。**这些单词可以是任意单词，比如说："stock.usd.nyse", "nyse.vmw", "quick.orange.rabbit".这种类型的。**当然这个单词列表最多不能超过 255 个字节。**

#### 规则

在这个规则列表中，其中有两个替换符是大家需要注意的。

***(星号)可以代替一个单词**

**#(井号)可以替代零个或多个单词**

#### 注意

- 当一个队列绑定键是#,那么这个队列将接收所有数据，就有点像 fanout 了
- 如果队列绑定键当中没有#和*出现，那么该队列绑定类型就是 direct 了

### 2.4.3 Fanout Exchange

直接将消息转发到所有binding的对应queue中，这种exchange在路由转发的时候，**忽略Routing key**。

![image-20211230172824713](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230172824713.png)

### 2.4.4 Headers Exchange

**将消息中的headers与该Exchange相关联的所有Binging中的参数进行匹配**，如果匹配上了，则发送到该Binding对应的Queue中。

### 2.4.5 六大模式

**简单模式**

![image-20211230172833658](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230172833658.png)

**工作模式**

![image-20211230172845711](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230172845711.png)

**发布订阅模式**

![image-20211230172957861](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230172957861.png)

**路由模式**

![image-20211230173014717](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230173014717.png)

**主题模式**

![image-20211230173025614](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230173025614.png)

**RPC模式**

![image-20211230173036138](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230173036138.png)

------

## 2.5 绑定

binding 其实是 **exchange 和 queue 之间的桥梁**，它告诉我们 exchange 和那个 queue 进行了绑定关系。如果要指示交换机“E”将消息路由给队列“Q”，那么“Q”就需要与“E”进行绑定。绑定操作需要定义一个可选的路由键（routing key）属性给某些类型的交换机。路由键的意义在于从发送给交换机的众多消息中选择出某些消息，将其路由给绑定的队列。

![image-20211230173046913](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230173046913.png)

如果AMQP的消息无法路由到队列（例如，发送到的交换机没有绑定队列），消息会被就地销毁或者返还给发布者。如何处理取决于发布者设置的消息属性。

------

## 2.6 消息分发

### 2.6.1 轮训分发

RabbitMQ 默认分发消息采用的轮训分发的，如果同一队列有多个消费节点，则会按照**消息顺序进行轮训消费。**

### 2.6.2 不公平分发

RabbitMQ **默认分发消息采用的轮训分发**，但是在某种场景下这种策略并不是很好，比方说有两个消费者在处理务，其中有个消费者 1 处理任务的速度非常快，而另外一个消费者 2 处理速度却很慢，这个时候我们还是采用轮训分发的化就会到这处理速度快的这个消费者很大一部分时间处于空闲状态，而处理慢的那个消费者一直在干活，这种分配方式在这种情况下其实就不太好，但是RabbitMQ 并不知道这种情况它依然很公平的进行分发。

为了避免这种情况，我们可以设置参数 **channel.basicQos(1);** 意思就是如果这个任务我还没有处理完或者我还没有应答你，你先别分配给我，我目前只能处理一个任务，然后 rabbitmq 就会把该任务分配给没有那么忙的那个空闲消费者，当然如果所有的消费者都没有完成手上任务，队列还在不停的添加新任务，队列有可能就会遇到队列被撑满的情况，这个时候就只能添加新的 worker 或者改变其他存储任务的策略。 

### 2.6.3 限流

通过使用 basic.qos 方法设置“**预取计数**”值来完成的。该值定义通道上允许的未确认消息的最大数量。**100 到 300** 范围内的值通常可提供最佳的吞吐量，并且不会给消费者带来太大的风险。预取值为 1 是最保守的。

------

## 2.7 消息确认

### 2.7.1 发布确认

#### 原理

生产者将信道设置成 **confirm** 模式，一旦信道进入 confirm 模式，所有在**该信道上面发布的消息都将会被指派一个唯一的 ID(从 1 开始)**，一旦**消息被投递到所有匹配的队列**之后，broker就会发送一个确认给生产者(包含消息的唯一 ID)，这就使得生产者知道消息已经正确到达目的队列了，**如果消息和队列是可持久化的，那么确认消息会在将消息写入磁盘之后发出**，broker 回传给生产者的确认消息中 delivery-tag 域包含了确认消息的序列号，此外 broker 也可以设置basic.ack 的 multiple 域，表示到这个序列号之前的所有消息都已经得到了处理。

#### 开启发布确认

发布确认默认是没有开启的，如果要开启需要调用方法 **confirmSelect**，每当你要想使用发布确认，都需要在 channel 上调用该方法。

```java
//创建 channel实例
channel = connection.createChannel();

// 开启发布确认
channel.confirmSelect();
```

#### 单个确认发布

这是一种简单的确认方式，它是一种**同步确认发布**的方式，也就是发布一个消息之后只有它被确认发布，后续的消息才能继续发布**,waitForConfirmsOrDie(long)**这个方法只有在消息被确认的时候才返回，如果在指定时间范围内这个消息没有被确认那么它将抛出异常。一个最大的缺点就是:**发布速度特别的慢**，因为如果没有确认发布的消息就会阻塞所有后续消息的发布，这种方式最多提供**每秒不超过数百条**发布消息的吞吐量。

```java
// 默认0L
channel.waitForConfirmsOrDie();
// 时间内
channel.waitForConfirmsOrDie(1000L);
```

#### 批量确认发布

与单个等待确认消息相比，先发布一批消息然后一起确认**waitForConfirms()**可以**极大地提高吞吐量**，当然这种方式的缺点就是:**当发生故障导致发布出现问题时，不知道是哪个消息出现问题了**，我们必须将整个批处理保存在内存中，以记录重要的信息而后重新发布消息。当然这种方案**仍然是同步的**，也一样阻塞消息的发布。

```java
for (int i = 0; i < MESSAGE_COUNT; i++) {
    String message = i + "";
    channel.basicPublish("", queueName, null, message.getBytes());
    outstandingMessageCount++;
    if (outstandingMessageCount == batchSize) {
        channel.waitForConfirms();
        outstandingMessageCount = 0;
    }
}

//为了确保还有剩余没有确认消息 再次确认
if (outstandingMessageCount > 0) {
    channel.waitForConfirms();
}
```

#### 异步确认发布

**利用回调函数来达到消息可靠性传递的**，这个中间件也是通过函数回调来保证是否投递成功。把未确认的消息放到一个**基于内存的能被发布线程访问的队列**，比如说用 ConcurrentLinkedQueue 这个队列在 confirm callbacks 与发布线程之间进行消息的传递。

```java
//开启发布确认
channel.confirmSelect();
/**
 * 线程安全有序的一个跳表，适用于高并发的情况
 * 1.轻松的将序号与消息进行关联
 * 2.轻松批量删除条目 只要给到序列号
 * 3.支持并发访问
 */
ConcurrentSkipListMap<Long, String> outstandingConfirms = new ConcurrentSkipListMap<>();

/**
 * 确认监听器
 * 1. 消息序列号
 * 2. true 可以确认小于等于当前序列号的消息
 * 3. false 确认当前序列号消息
 */
ConfirmListener confirmListener = new ConfirmListener() {
    @Override
    public void handleAck(long deliveryTag, boolean multiple) throws IOException {
         // 是否批量
    	if (multiple) {
       	 	//返回的是小于等于当前序列号的未确认消息 是一个 map
        	ConcurrentNavigableMap<Long, String> confirmed = outstandingConfirms.headMap(deliveryTag, true);
      	 	//清除该部分未确认消息
       		confirmed.clear();
    	}else{
        	//只清除当前序列号的消息
        	outstandingConfirms.remove(deliveryTag);
    	}
    }
    @Override
    public void handleNack(long deliveryTag, boolean multiple) throws IOException {
         String message = outstandingConfirms.get(deliveryTag);
    	logger.error("发布的消息" + message + "未被确认，序列号" + sequenceNumber);
    }
};


/**
 * 添加一个异步确认的监听器
 * 1.确认收到消息的回调
 * 2.未收到消息的回调
 */
channel.addConfirmListener(confirmListener);

for (int i = 0; i < MESSAGE_COUNT; i++) {
    String message = "消息" + i;
    /**
     * channel.getNextPublishSeqNo()获取下一个消息的序列号
     * 通过序列号与消息体进行一个关联
     * 全部都是未确认的消息体
     */
    outstandingConfirms.put(channel.getNextPublishSeqNo(), message);
    channel.basicPublish("", queueName, null, message.getBytes());
}
```

#### 回退消息

在仅开启了生产者确认机制的情况下，交换机接收到消息后，会直接给消息生产者发送确认消息，如果发现该消息不可路由，那么消息会被直接丢弃，此时生产者是不知道消息被丢弃这个事件的。

通过设置 **mandatory** 参数可以在当消息传递过程中不可达目的地时将消息返回给生产者。

```java
// mandatory true 强制推送到一个队列中 
public abstract void publish(String topic,boolean mandatory, boolean immediate,boolean durable,Object data) throws Exception;

ReturnListener returnListener = new ReturnListener() {
    @Override
    public void handleReturn(int replyCode, String replyText, String exchange, String routingKey, BasicProperties properties, byte[] body) throws IOException {
        
    }
};
// 添加回退监听器
channel.addReturnListener(returnListener);
```

### 2.7.2 消息应答

为了保证消息在发送过程中不丢失，rabbitmq 引入消息应答机制，消息应答就是：**消费者在接收到消息并且处理该消息之后，告诉 rabbitmq 它已经处理了，rabbitmq 可以把该消息删除了。**

#### 自动应答

消息发送后立即被认为已经传送成功，**这种模式需要在高吞吐量和数据传输安全性方面做权衡,**因为这种模式如果消息在接收到之前，消费者那边出现连接或者 channel 关闭，那么消息就丢失了,当然另一方面这种模式消费者那边可以传递过载的消息，没有对传递的消息数量进行限制，当然这样有可能使得消费者这边由于接收太多还来不及处理的消息，导致这些消息的积压，最终使得内存耗尽，最终这些消费者线程被操作系统杀死，所以这种模式**仅适用在消费者可以高效并以某种速率能够处理这些消息的情况下使用。**

#### 手动应答

- Channel.basicAck(用于肯定确认)RabbitMQ 已知道该消息并且成功的处理消息，可以将其丢弃了
- Channel.basicNack(用于否定确认)

- Channel.basicReject(用于否定确认) 与 Channel.basicNack 相比少一个参数不处理该消息了直接拒绝，可以将其丢弃了

#### 批量应答

在手动应答时，**指定 multiple 为 true，**可以进行批量应答，从而减少网络拥堵。

```java
 channel.basicAck(envelope.getDeliveryTag(), true);
```

#### 重新入队

如果消费者由于某些原因失去连接(其通道已关闭，连接已关闭或 TCP 连接丢失)，导致消息未发送 ACK 确认，RabbitMQ 将了解到消息未完全处理，并将对其重新排队。如果此时其他消费者可以处理，它将很快将其重新分发给另一个消费者。这样，即使某个消费者偶尔死亡，也可以确保不会丢失任何消息。在手动应答时，**指定 requeue 为 true，可以进行重新入队。**

```java
// requeue ? 重新入队 : 丢弃
channel.basicReject(envelope.getDeliveryTag(), true);
```

------

## 2.8 持久化

我们需要将**队列和消息都标记为持久化**。来保障当 RabbitMQ 服务停掉或奔溃以后消息生产者发送过来的消息不丢失。

### 2.8.1 队列持久化

默认我们创建的队列都是非持久化的。rabbitmq 如果重启的话，该队列就会被删除掉，如果要队列实现持久化 需要在声明队列的时候把 durable 参数设置为持久化。

```java
boolean queue_durable = true;
channel.queueDeclare(queue_name, queue_durable, false, false, getQueueArgs(queueLength,queueByteLength));
```

**注意：如果之前声明的队列不是持久化的，需要把原先队列先删除，或者重新创建一个持久化的队列，不然就会出现错误**

### 2.8.2 消息持久化

要想让消息实现持久化，需要在生产者发布消息时 **指定 deliveryMode 为 2。**

```java
public abstract void publish(String topic,boolean mandatory, boolean immediate,boolean durable,Object data) throws Exception;

BasicProperties.Builder propsBuilder = new BasicProperties.Builder();

//是否持久化
propsBuilder.deliveryMode(durable ? 2 : 1);
```

注意：**将消息标记为持久化并不能完全保证不会丢失消息**。尽管它告诉 RabbitMQ 将消息保存到磁盘，但是这里依然存在当消息刚准备存储在磁盘的时候 但是还没有存储完，消息还在缓存的一个间隔点。此时并没

有真正写入磁盘。持久性保证并不强，。**如果需要更强有力的持久化策略，可以增加发布确认**。

------

## 2.9 队列

### 2.9.1 死信队列

死信，顾名思义就是无法被消费的消息，字面意思可以这样理解，一般来说，producer 将消息投递到 broker 或者直接到 queue 里了，consumer 从 queue 取出消息进行消费，但某些时候**由于特定的原因导致 queue 中的某些消息无法被消费**，这样的消息如果没有后续的处理，就变成了死信，有死信自然就有了死信队列。

#### 死信来源

- 消息 TTL 过期
- 队列达到最大长度(队列满了，无法再添加数据到 mq 中)

- 消息被拒绝(basic.reject 或 basic.nack)并且 requeue=false

#### 设置死信队列

![image-20211230173628371](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230173628371.png)

```java
//声明死信和普通交换机 类型为 direct
channel.exchangeDeclare(NORMAL_EXCHANGE, BuiltinExchangeType.DIRECT);
channel.exchangeDeclare(DEAD_EXCHANGE, BuiltinExchangeType.DIRECT);

//声明死信队列
String deadQueue = "dead-queue";
channel.queueDeclare(deadQueue, false, false, false, null);

// 死信队列绑定死信交换机与 routingkey
channel.queueBind(deadQueue, DEAD_EXCHANGE, "dead_routingkey");

// 正常队列绑定死信队列信息
Map<String, Object> params = new HashMap<>();
// 正常队列设置死信交换机 参数 key 是固定值
params.put("x-dead-letter-exchange", DEAD_EXCHANGE);
// 正常队列设置死信 routing-key 参数 key 是固定值
params.put("x-dead-letter-routing-key", "dead_routingkey");
String normalQueue = "normal-queue";
// 声明正常队列
channel.queueDeclare(normalQueue, false, false, false, params);
// 正常队列绑定
channel.queueBind(normalQueue, NORMAL_EXCHANGE, "normal_routingkey");
```

### 2.9.2 延迟队列

延时队列,**队列内部是有序的**，最重要的特性就体现在它的延时属性上，延时队列中的元素是希望在指定时间到了以后或之前取出和处理，简单来说，延时队列就是**用来存放需要在指定时间被处理的元素的队列**。

#### 实现方式

- 基于消息TTL和队列TTL转换入死信队列，消费死信队列中的消息
- 基于延迟插件，该类型消息支持延迟投递机制 消息传递后并不会立即投递到目标队列中，而是存储在 mnesia(一个分布式数据系统)表中，当达到投递时间时，才投递到目标队列中

- 用 Java 的 DelayQueue
- 利用 Redis 的 zset

### 2.9.3 优先队列

要让队列实现优先级需要做的事情有如下事情:**队列需要设置为优先级队列**，**消息需要设置消息的优先级**，消费者需要等待消息已经发送到队列中才去消费，因为这样才有机会对消息进行排序。

```java
// 队列
Map args = MapUtils.toMap(new Object[][]{{"x-max-priority", 10}});
channel.queueDeclare(queue_name, queue_durable, false, false, args);

// 消息
BasicProperties.Builder propsBuilder = new BasicProperties.Builder();
propsBuilder.priority(5);
channel.basicPublish(exchange_name, topic, null, str_msg.getBytes("UTF-8"));
```

### 2.9.4 惰性队列

RabbitMQ 从 **3.6.0** 版本开始引入了惰性队列的概念。**惰性队列会尽可能的将消息存入磁盘中**，而在消费者消费到相应的消息时才会被加载到内存中，它的一个重要的设计目标是能够**支持更长的队列**，即支持更多的消息存储。当消费者由于各种各样的原因(比如消费者下线、宕机亦或者是由于维护而关闭等)而致使长时间内不能消费消息造成堆积时，惰性队列就很有必要了。

默认情况下，当生产者将消息发送到 RabbitMQ 的时候，**队列中的消息会尽可能的存储在内存之中**，这样可以更加快速的将消息发送给消费者。即使是持久化的消息，在被写入磁盘的同时也会在内存中驻留一份备份。当 RabbitMQ 需要释放内存的时候，会将内存中的消息换页至磁盘中，这个操作会耗费较长的时间，也会阻塞队列的操作，进而无法接收新的消息。

#### 队列声明

```java
// 队列
Map args = MapUtils.toMap(new Object[][]{{"x-queue-mode", "lazy"}});
channel.queueDeclare(queue_name, queue_durable, false, false, args);
```

#### 内存开销对比

![image-20211230173648687](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230173648687.png)

在发送 1 百万条消息，每条消息大概占 1KB 的情况下，普通队列占用内存是 1.2GB，而惰性队列仅仅占用 1.5MB。

## 2.10 TTL

TTL 是 RabbitMQ 中一个消息或者队列的属性，**表明一条消息或者该队列中的所有消息的最大存活时间**，单位是**毫秒**。换句话说，如果一条消息设置了 TTL 属性或者进入了设置 TTL 属性的队列，那么这条消息如果在 TTL 设置的时间内没有被消费，则会成为"死信"。**如果同时配置了队列的 TTL 和消息的TTL，那么较小的那个值将会被使用**。

### 2.10.1 队列TTL

```java
Map args = MapUtils.toMap(new Object[][]{{"x-message-ttl", 2000}});
channel.queueDeclare(queue_name, queue_durable, false, false, args);
```

### 2.10.2 消息TTL

```java
BasicProperties.Builder basicProperties = new BasicProperties.Builder();
basicProperties.expiration("1000");
```

------

## 2.11 幂等性

### 2.11.1 消息重复消费

消费者在消费 MQ 中的消息时，MQ 已把消息发送给消费者，消费者在给 MQ 返回 ack 时网络中断，故MQ 未收到确认信息，该条消息会重新发给其他的消费者，或者在网络重连后再次发送给该消费者，但实际上该消费者已成功消费了该条消息，造成消费者消费了重复的消息。

### 2.11.2 解决思路 

MQ 消费者的幂等性的解决一般使用全局 ID 或者写个唯一标识比如时间戳 或者 UUID 或者可按自己的规则生成一个全局唯一 id，每次消费消息时用该 id 先判断该消息是否已消费过。

### 2.11.3 幂等性保障

#### 唯一 ID+指纹码机制

指纹码:我们的一些规则或者时间戳加别的服务给到的唯一信息码,它并不一定是我们系统生成的，基本都是由我们的业务规则拼接而来，但是一定要保证唯一性，然后就利用查询语句进行判断这个 id 是否存在数据库中,优势就是实现简单就一个拼接，然后查询判断是否重复；劣势就是在高并发时，如果是单个数据库就会有写入性能瓶颈当然也可以采用分库分表提升性能，但也不是我们最推荐的方式。

#### Redis 原子性 

利用 redis 执行 setnx 命令，天然具有幂等性。从而实现不重复消费。



# 3. DEMO_RabbitMQ

## 3.1 配置文件解析

```java
--------------must--------------
# 消息队列类型[仅支持rabbitmq]
mq.type=rabbitmq

# 服务器地址
mq.host=192.168.11.208

# 用户名
mq.username=admin

# 密码
mq.password=123456

--------------not must--------------
# 端口(def:5672)
mq.port=5672

# 连接超时时间(def:10s)
mq.connectionTimeout=10000

# 预发值(def:100)[不公平分发、可做限流]
mq.channel.basicQos=1000

# 虚拟主机[类似nameSpaces](def:/)
mq.virtualHost=/

# 交换机(def:demo)[topic模式]
mq.exchange.name=demo

# 消息锁定超时时间(def:30s)
mq.messageLock_timeout=10000

# 队列持久化(def:true)
mq.queue.durable=true

# 自动确认(def:false)
mq.queue.aucoAck=false

# 队列最大消息(def:100w)
mq.queue.maxLength=1000000

# 队列最大容量(def:1G)
mq.queue.maxLengBytes=1073741824 

# 消费者最大线程数量(def:50)
mq.consume.maxThread=50

# 消费者最小线程数量(def:0)
mq.consume.minThread=0

# 消费者最大空闲时间(def:3min)
mq.consume.maxIdle=180000

# 是否延迟队列(def:false)
mq.isDelay=false

# 是否启用
mq.enable=false
```

## 3.2 加载MQ

```java
@Override
public void onPropsReaded() throws Exception {
	super.onPropsReaded();
	
	//加载MQ
	buildBean("mqService", MQServiceFactory.getService(null));
	//加载延迟MQ
	buildBean("delayMqService", MQServiceFactory.getService("delay"));
	buildBean("basicMqService", MQServiceFactory.getService("basic"));
}
```

## 3.3 初始化MQ

```java
/**
 * 1. 创建连接工厂
 * 2. 设置连接属性
 * 3. 获取连接、创建信道
 * 4. 声明交换机
 * 	  - 正常交换机[topic]
 * 	  - 延迟交换机[x-delayed-message]
 */
@Override
public void init(String name) throws Exception {
	if (!isEmpty(name)) {
		this.keyPre = "." + name;
	} else {
		this.keyPre = "";
	}
	//创建一个连接工厂 connection factory
	ConnectionFactory factory = new ConnectionFactory();
	//设置rabbitmq-server服务IP地址
	this.checkRepeat = BooleanUtils.toBoolean(MVCUtils.getProperty("mq" + this.keyPre + ".checkRepeat", "false"));
	factory.setHost(MVCUtils.requireProperty("mq" + this.keyPre + ".host"));
	factory.setPort(toInt(MVCUtils.getProperty("mq" + this.keyPre + ".port", "5672")));
	factory.setUsername(MVCUtils.requireProperty("mq" + this.keyPre + ".username"));
	factory.setPassword(MVCUtils.requireProperty("mq" + this.keyPre + ".password"));
	factory.setConnectionTimeout(toInt(MVCUtils.getProperty("mq" + this.keyPre + ".connectionTimeout", "10000")));
	factory.setVirtualHost(MVCUtils.getProperty("mq" + this.keyPre + ".virtualHost", "/"));
	exchange_name = MVCUtils.getProperty("mq" + this.keyPre + ".exchange.name", "demo");
	messageLock_timeout = toLong(MVCUtils.getProperty("mq" + this.keyPre + ".messageLock_timeout", (30 * 1000) + ""));
	isDelay = toBoolean(MVCUtils.getProperty("mq" + this.keyPre + ".isDelay", "false"));
	int channel_basicQos = (toInt(MVCUtils.getProperty("mq" + this.keyPre + ".channel.basicQos", "100")));
	queue_durable = (toBoolean(MVCUtils.getProperty("mq" + this.keyPre + ".queue.durable", "true")));
	queue_autoAck = (toBoolean(MVCUtils.getProperty("mq" + this.keyPre + ".queue.autoAck", "false")));            //
	queue_maxLength = (toLong(MVCUtils.getProperty("mq" + this.keyPre + ".queue.maxLength", 100 * 10000 + "")));        //100W
	queue_maxLengthBytes = (toLong(MVCUtils.getProperty("mq" + this.keyPre + ".queue.maxLengthBytes", 1 * 1024 * 1024 * 1024 + "")));//1G
	logger.info("[MQ][初始化]" + "host=" + factory.getHost() + ",port=" + factory.getPort() + ",username=" + factory.getUsername() + ",password=" + factory.getPassword() + ",connectionTimeout=" + factory.getConnectionTimeout());
	// 单线程进行分配，就算这里配了多线程也没用，因为只有一个channel
	Connection connection = factory.newConnection(Executors.newSingleThreadExecutor());
	Connection connection = factory.newConnection();
	//创建 channel实例
	channel = connection.createChannel();
	// 预发值
	channel.basicQos(channel_basicQos);
	// 延时交换机
	if (isDelay) {
		exchange_name = exchange_name + "_delay";
		channel.exchangeDeclare(exchange_name, "x-delayed-message", true, false,
				MapUtils.toMap(new Object[][]{{"x-delayed-type", "topic"}}));
	} else {
		// 正常交换机
		channel.exchangeDeclare(exchange_name, "topic", true, false, null);
	}
}
```

## 3.4 绑定订阅者

```java
@Override
protected void onLoaded() throws Exception {
	// MQ
	if("true".equals(MVCUtils.getProperty("mq.enable"))){
		MQUtils.bindSubscriber();	
	}
}




/** 
 * 绑定TopicHandler
 * 
 * @throws Exception
 */
public static void bindSubscriber() throws Exception{
	Map<String,Object> topHandlers=MVCUtils.getBeansByAnnotation(MQSubscriber.class);
	for(Object obj:topHandlers.values()){
		MQTopicHandler topHandler		=(MQTopicHandler)obj;
		Class type						= MVCUtils.getOriginClass(topHandler.getClass());
		
		if(!(obj instanceof MQTopicHandler)){
			logger.warn("[MQ][TOPIC绑定]未发现非处理器:"+type.getName());
			continue;
		}
		
		MQSubscriber ann				=(MQSubscriber)type.getAnnotation(MQSubscriber.class);
		if(ann==null||ann.value().length==0){
			logger.warn("[MQ][TOPIC绑定]未发现绑定符:"+type.getName());
			continue;
		}
		String mqName					=ann.mq();
		MQService service				=MQServiceFactory.getService(mqName);
		if(service==null){
			throw new Exception("[MQ][TOPIC绑定]未找到指定MQ["+mqName+"]:"+type.getName());
		}
		String queueName = ann.queueName();
		if(StringUtils.isEmpty(queueName)){
			queueName = "demo_"+StringUtils.removeStartEnd(CoreConfig.Uri.context, "/","/");
		}
		String postfix = ann.share()?(String)n2d(CoreConfig.Sys.clusterId, UUIDGen.getUUID()):"";
		queueName = queueName + postfix;
		for(String topic:ann.value()){
			//抢消息时用一个组，不抢消息时用各自的组
			service.subscribe(topic,queueName,topHandler,ann.queueLength(),ann.queueByteLength());
		}
	}
}


/** 
 * 订阅队列
 * 1. 绑定队列和Handler处理关系
 * 2. 声明队列
 * 3. 第一次绑定时，将消费队列中消息
 * 
 * @throws Exception
 */
@Override
public void subscribe(String topic, String queue_name, MQTopicHandler topicHandler,long queueLength,long queueByteLength) throws Exception {
	if (isEmpty(queue_name)) {
		throw new ApplicationException("queueName不能为空");
	}
	super.subscribe(topic, queue_name, topicHandler);
	logger.debug("[MQ" + this.keyPre + "][订阅]" + topic + ":" + topicHandler.getClass().getName());
	//如果组队列没有创建则进行定义
	boolean isNewQueue = false;
	if (!queueDeclareds.containsKey(queue_name)) {
		channel.queueDeclare(queue_name, queue_durable, false, false, getQueueArgs(queueLength,queueByteLength));
		queueDeclareds.put(queue_name, new HashMap());
		isNewQueue = true;
	}
	channel.queueBind(queue_name, exchange_name, topic);
	//消费
	if (isNewQueue) {
		channel.basicConsume(queue_name, queue_autoAck, new ConsumerImpl());
	}
}
```

## 3.5 发布消息

```java
/**
 *  过滤MQ消息
 *
 * @param topic  	routingKey
 * @param message	消息
 */
protected Map filterMessage(String topic,Object message) {
	Map msg=null;
	if(message instanceof MQPackage) {
		msg=BeanUtils.bean2Map(message);
	}else{
		msg=MapUtils.toMap(new Object[][]{
			{"type"			,topic},
			{"sid"			, UUID.randomUUID().toString().replace("-","")},
			{"cid"			,null},
			{"timestamp"	,DateUtils.getNowDString()},
			{"msg"			,null},
			{"code"			,"0000"},
			{"data"			,message},
			{"sysid"		,CoreConfig.Sys.id},
		});
	}
	return msg;
}


/** 
 * 推送
 *
 * @param topic		routingKey
 * @param message   消息
 * @throws Exception
 */
public abstract void publish(String topic,Object data) throws Exception;

/**
 * 推送
 *
 * @param topic 	routingKey
 * @param data 		消息
 * @param delayTime 延迟时间
 * @throws Exception
 */
public abstract void publish(String topic,Object data,int delayTime) throws Exception;

/**
 * 推送
 *
 * @param topic 	routingKey
 * @param header 	消息的其他属性 - 路由标头等
 * @param data 		消息
 * @throws Exception
 */
public abstract void publish(String topic,Map header, Object data) throws Exception;
	
/** 
 * 推送
 *
 * @param topic		routingKey
 * @param mandatory	强制必须发送到一个queue中
 * @param immediate	即时发送[RabbitMQ 服务器不支持]
 * @param durable	消息持久化
 * @param data		消息	
 * @throws Exception
 */
public abstract void publish(String topic,boolean mandatory, boolean immediate,boolean durable,Object data) throws Exception;
```

## 3.6 消费消息

```java
/**
 * 消费者worker
 */
class ConsumerWorker extends Worker {
	@Override
	public void work(Object message) {
		Object[] objects = (Object[]) message;
		String a = (String) objects[0];
		Envelope envelope = (Envelope) objects[1];
		BasicProperties props = (BasicProperties) objects[2];
		byte[] content = (byte[]) objects[3];
		String messageId = envelope.getDeliveryTag() + "";
		String topic = envelope.getRoutingKey();
		try {
			if (checkRepeat) {
				//防止消息重推
				if (messageHandlings.containsKey(topic + "_" + messageId)) {
					logger.info("[MQ" + keyPre + "][消息重收][" + topic + "/" + messageId + "]消息被抛弃");
					channel.basicReject(envelope.getDeliveryTag(), false);
					return;
				}
				messageHandlings.put(topic + "_" + messageId, System.currentTimeMillis());
			}
			MQTopicHandler topicHandler = MQServiceRabbitMQ.this.subscribes.get(topic);
			if (topicHandler == null) {
				logger.debug("[MQ" + keyPre + "][收到][" + topic + "/" + messageId + "]无法找到处理器");
				channel.basicReject(envelope.getDeliveryTag(), false);
				return;
			}
			MQTopicContext context = new MQTopicContext();
			context.service = MQServiceRabbitMQ.this;
			context.topic = envelope.getRoutingKey();
			context.content = content;
			context.contentEncoding = e2d(props.getContentEncoding(), "UTF-8");
			context.messageId = messageId;
			if (logger.isDebugEnabled()) {
				logger.debug("[MQ" + keyPre + "][收到][" + topic + "/" + messageId + "]" + new String(context.content, context.contentEncoding));
			}
			MQTopicContext.Ack ack = null;
			try {
				ack = topicHandler.handle(context);
			} catch (Throwable e) {
				logger.error("[MQ][处理失败][" + topic + "/" + messageId + "]" + e.getMessage(), e);
			}
			if (ack == null) {
				ack = MQTopicContext.Ack.accept;
			}
			if (ack == MQTopicContext.Ack.accept) {
				channel.basicAck(envelope.getDeliveryTag(), false);
			} else if (ack == MQTopicContext.Ack.reject) {
				channel.basicReject(envelope.getDeliveryTag(), false);
			} else if (ack == MQTopicContext.Ack.reject_requeue) {
				channel.basicReject(envelope.getDeliveryTag(), true);
			}
			if (checkRepeat) {
				removeTimeoutMessages();
			}
		} catch (Exception e) {
			logger.error("[MQ" + keyPre + "][处理异常][" + topic + "/" + messageId + "]" + e.getMessage(), e);
		}
	}
    
	/**
	 * 移除超时消息
	 */
	private void removeTimeoutMessages() {
		long time = System.currentTimeMillis();
		if (time - lastCheck > 10 * 1000) {
			synchronized (messageHandlings) {
				if (time - lastCheck > 10 * 1000) {
					//超时取消（防止在ACK时，MQ的重推）
					for (String key : messageHandlings.keySet()) {
						if ((time - messageHandlings.get(key)) > messageLock_timeout) {
							messageHandlings.remove(key);
						}
					}
					lastCheck = System.currentTimeMillis();
				}
			}
		}
	}
}
```

## 3.7 如何使用

### 3.7.1 添加配置文件

![image-20211230173928711](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230173928711.png)

### 3.7.2 注册bean

![image-20211230173958940](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230173958940.png)

### 3.7.3 绑定订阅关系

![image-20211230174013729](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230174013729.png)

### 3.7.4 发布消息

- **及时发布**

![image-20211230174030274](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230174030274.png)

![image-20211230174056057](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230174056057.png)

- **延时发布**

![image-20211230174112828](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230174112828.png)

![image-20211230174131123](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230174131123.png)

**注意：**

- mq必须安装插件rabbitmq_delayed_message_exchange 并且配置文件中增加isDelay=true
- 延时队列的mq与正常消息的mq必须分开配置，也就是说，如果同时需要两种消息 ，需要配置两个mqService

- 在使用延时队列的handler注解@MQSubscriber上加上mq="xxx"
- 延迟的时间是一个毫秒数，支持范围int以内，请注意范围，直接使用大long值强转有可能造成时间错误

### 3.7.5 订阅消费消息

![image-20211230174156402](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211230174156402.png)

# 4. Q&A

## 消息处理异常会被消费吗？

MQTopicHandler.handle如处理异常时，会被框架捕获异常，MQTopicContext.Ack = accept；消息就被消费掉了。

## 如何使用延迟队列？

- 使用public abstract void publish(String topic,Object data,int delayTime)；
- @MQSubscriber(mq = "delay") 中指定数据源	

## 怎么实现共享？

设置@MQSubscriber(share = true);

原理：

当设置share = true时，在绑定订阅者关系时，会在队列名称后Sys.clusterId 或UUID，保证每个消费服务或消费节点所声明的队列名称是不一致的，不同的队列名称和交换机及路由键进行绑定，从而实现消息共享。

## 怎么去重消息？

设置mq.checkRepeat=true

目前框架仅支持单节点消息重推，不支持消息幂等性校验。

messageHandlings.containsKey(topic + "_" + messageId)

------