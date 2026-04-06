---
title: 01-RocketMQ原理及安装
date: 2022-04-03 15:17:20
tags:
- 架构
- 分布式
- RocketMQ
categories: 
- 15_分布式
- 06_分布式消息队列
---

![image-20220225231712788](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220225231718.png)



## 一、为什么选择RocketMQ

Apache RocketMQ 自诞生以来，因其架构简单、业务功能丰富、具备极强可扩展性等特点被众多企业开发者以及云厂商广泛采用。历经十余年的大规模场景打磨，RocketMQ 已经成为业内共识的金融级可靠业务消息首选方案，被广泛应用于互联网、大数据、移动互联网、物联网等领域的业务场景。

### 1、RocketMQ优缺点

RocketMQ 优点：

* 单机吞吐量：十万级
* 可用性：非常高，分布式架构
* 消息可靠性：经过参数优化配置，消息可以做到 0 丢失
* 功能支持：MQ 功能较为完善，还是分布式的，扩展性好
* 支持 10 亿级别的消息堆积，不会因为堆积导致性能下降
* 源码是 Java，方便结合公司自己的业务进行二次开发
* 天生为金融互联网领域而生，对于可靠性要求很高的场景，尤其是电商里面的订单扣款，以及业务削峰，在大量交易涌入时，后端可能无法及时处理的情况
* RoketMQ 在稳定性上可能更值得信赖，这些业务场景在阿里双11已经经历了多次考验

RocketMQ 缺点：

* 支持的客户端语言不多，目前仅支持 Java 及 C++，而且 C++ 还不成熟
* 没有在 MQ 核心中去实现 JMS 等接口，有些系统要迁移需要修改大量代码

### 2、各消息队列性能对比

![image-20260406193247230](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406193248440.png)

## 二、RocketMQ基本概念了解

在了解rocketmq之前有必要对rocketmq的相关概念混个脸熟

### 主题（Topic）

Apache RocketMQ 中消息传输和存储的顶层容器，用于标识`同一类业务`逻辑的消息。主题通过TopicName来做唯一标识和区分。

### 消息类型（MessageType）

Apache RocketMQ 中按照消息传输特性的不同而定义的分类，用于类型管理和安全校验。 Apache RocketMQ 支持的消息类型有普通消息、顺序消息、事务消息和定时/延时消息。

### 消息队列（MessageQueue）

队列是 Apache RocketMQ 中消息存储和传输的实际容器，也是消息的最小存储单元。 Apache RocketMQ 的所有主题都是由多个队列组成，以此实现队列数量的水平拆分和队列内部的流式存储。队列通过QueueId来做唯一标识和区分。

### 消息（Message）

消息是 Apache RocketMQ 中的最小数据传输单元。生产者将业务数据的负载和拓展属性包装成消息发送到服务端，服务端按照相关语义将消息投递到消费端进行消费。

### 消息视图（MessageView）

消息视图是 Apache RocketMQ 面向开发视角提供的一种消息只读接口。通过消息视图可以读取消息内部的多个属性和负载信息，但是不能对消息本身做任何修改。

### 消息标签（MessageTag）

消息标签是Apache RocketMQ 提供的细粒度`消息分类`属性，可以在 `Topic 主题层级之下做消息类型的细分`。消费者通过订阅特定的标签来实现细粒度过滤。

### 消息位点（MessageQueueOffset）

消息是按到达Apache RocketMQ 服务端的先后顺序存储在指定主题的多个队列中，每条消息在队列中都有一个唯一的Long类型坐标，这个坐标被定义为消息位点。

### 消费位点（ConsumerOffset）

一条消息被某个消费者消费完成后不会立即从队列中删除，Apache RocketMQ 会基于每个消费者分组记录消费过的最新一条消息的位点，即消费位点。

### 消息索引（MessageKey）

消息索引是Apache RocketMQ 提供的面向消息的索引属性。通过设置的`消息索引`可以快速查找到对应的消息内容。

### 【生产者】（Producer）

生产者是Apache RocketMQ 系统中用来构建并传输消息到服务端的运行实体。生产者通常被集成在业务系统中，将业务消息按照要求封装成消息并发送至服务端。

### 事务检查器（TransactionChecker）

Apache RocketMQ 中生产者用来执行本地事务检查和异常事务恢复的监听器。事务检查器应该通过业务侧数据的状态来检查和判断事务消息的状态。

### 事务状态（TransactionResolution）

Apache RocketMQ 中事务消息发送过程中，事务提交的状态标识，服务端通过事务状态控制事务消息是否应该提交和投递。事务状态包括事务提交、事务回滚和事务未决。

### 消费者分组（ConsumerGroup）

消费者分组是Apache RocketMQ 系统中承载多个消费行为一致的消费者的负载均衡分组。和消费者不同，消费者分组并不是运行实体，而是一个逻辑资源。在 Apache RocketMQ 中，通过消费者分组内初始化多个消费者实现消费性能的水平扩展以及高可用容灾。

### 【消费者】（Consumer）

消费者是Apache RocketMQ 中用来接收并处理消息的运行实体。消费者通常被集成在业务系统中，从服务端获取消息，并将消息转化成业务可理解的信息，供业务逻辑处理。

### 消费结果（ConsumeResult）

Apache RocketMQ 中PushConsumer消费监听器处理消息完成后返回的处理结果，用来标识本次消息是否正确处理。消费结果包含消费成功和消费失败。

### 订阅关系（Subscription）

订阅关系是Apache RocketMQ 系统中`消费者获取消息、处理消息的规则和状态配置`。订阅关系由消费者分组动态注册到服务端系统，并在后续的消息传输中按照订阅关系定义的过滤规则进行消息匹配和消费进度维护。

### 消息过滤

消费者可以通过订阅指定消息标签（Tag）对消息进行过滤，确保最终只接收被过滤后的消息合集。过滤规则的计算和匹配在Apache RocketMQ 的服务端完成。

### 重置消费位点

以时间轴为坐标，在消息持久化存储的时间范围内，重新设置消费者分组对已订阅主题的消费进度，设置完成后消费者将接收设定时间点之后，由生产者发送到Apache RocketMQ 服务端的消息。

### 消息轨迹

在一条消息从生产者发出到消费者接收并处理过程中，由各个相关节点的时间、地点等数据汇聚而成的完整链路信息。通过消息轨迹，您能清晰定位消息从生产者发出，经由Apache RocketMQ 服务端，投递给消费者的完整链路，方便定位排查问题。

### 消息堆积

生产者已经将消息发送到Apache RocketMQ 的服务端，但由于消费者的消费能力有限，未能在短时间内将所有消息正确消费掉，此时在服务端保存着未被消费的消息，该状态即消息堆积。

### 事务消息

事务消息是Apache RocketMQ 提供的一种高级消息类型，支持在分布式场景下保障消息生产和本地事务的最终一致性。

### 定时/延时消息

定时/延时消息是Apache RocketMQ 提供的一种高级消息类型，消息被发送至服务端后，在指定时间后才能被消费者消费。通过设置一定的定时时间可以实现分布式场景的延时调度触发效果。

### 顺序消息

顺序消息是Apache RocketMQ 提供的一种高级消息类型，支持消费者按照发送消息的先后顺序获取消息，从而实现业务场景中的顺序处理。

## 三、领域模型概述

Apache RocketMQ 是一款典型的分布式架构下的中间件产品，使用异步通信方式和发布订阅的消息传输模型。 Apache RocketMQ 产品具备异步通信的优势，系统拓扑简单、上下游耦合较弱，主要应用于异步解耦，流量削峰填谷等场景。

### 1、Apache RocketMQ领域模型

![image-20260406193626302](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406193627604.png)

如上图（官方图）所示，Apache RocketMQ 中消息的生命周期主要分为消息生产、消息存储、消息消费这三部分。

生产者生产消息并发送至 Apache RocketMQ 服务端，消息被存储在服务端的主题中，消费者通过订阅主题消费消息。

### 2、通信方式介绍

分布式系统架构思想下，将复杂系统拆分为多个独立的子模块，例如微服务模块。此时就需要考虑子模块间的远程通信，典型的通信模式分为以下两种：

#### 一种是同步的RPC远程调用

![image-20260406193641874](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406193644984.png)

同步RPC调用模型下，不同系统之间直接进行调用通信，每个请求直接从调用方发送到被调用方，然后要求被调用方立即返回响应结果给调用方，以确定本次调用结果是否成功。 注意 此处的同步并不代表RPC的编程接口方式，RPC也可以有异步非阻塞调用的编程方式，但本质上仍然是需要在指定时间内得到目标端的直接响应。

#### 一种是基于中间件代理的异步通信方式

![image-20260406193705002](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406193706110.png)


异步消息通信模式下，各子系统之间无需强耦合直接连接，调用方只需要将请求转化成异步事件（消息）发送给中间代理，发送成功即可认为该异步链路调用完成，剩下的工作中间代理会负责将事件可靠通知到下游的调用系统，确保任务执行完成。该中间代理一般就是消息中间件。

#### 异步通信的优势

系统拓扑简单由于调用方和被调用方统一和中间代理通信，系统是星型结构，易于维护和管理。

上下游耦合性弱上下游系统之间弱耦合，结构更灵活，由中间代理负责缓冲和异步恢复。 上下游系统间可以独立升级和变更，不会互相影响。

容量削峰填谷基于消息的中间代理往往具备很强的流量缓冲和整形能力，业务流量高峰到来时不会击垮下游。

### 3、消息传输模型介绍

主流的消息中间件的传输模型主要为点对点模型和发布订阅模型。

#### 点对点模型

![image-20260406193722423](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406193724250.png)

点对点模型也叫队列模型，具有如下特点：

* **消费匿名**：消息上下游沟通的唯一的身份就是队列，下游消费者从队列获取消息无法申明独立身份。
* **一对一通信**：基于消费匿名特点，下游消费者即使有多个，但都没有自己独立的身份，因此共享队列中的消息，每一条消息都只会被唯一一个消费者处理。因此点对点模型只能实现一对一通信。

#### 发布订阅模型

![image-20260406193822809](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406193824222.png)

发布订阅模型具有如下特点：

* **消费独立**：相比队列模型的匿名消费方式，发布订阅模型中消费方都会具备的身份，一般叫做订阅组（订阅关系），不同订阅组之间相互独立不会相互影响。
* **一对多通信**：基于独立身份的设计，同一个主题内的消息可以被多个订阅组处理，每个订阅组都可以拿到全量消息。因此发布订阅模型可以实现一对多通信。

#### 点对点模型和发布订阅模型对比

点对点模型和发布订阅模型各有优势，点对点模型更为简单，而发布订阅模型的扩展性更高。 Apache RocketMQ 使用的传输模型为发布订阅模型，因此也具有发布订阅模型的特点。

## 四、RocketMQ简要工作流程

![image-20260406193918312](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406193920153.png)

**NameServer**： NameServer 是专为 RocketMQ 设计的轻量级名称服务，具有简单、可集群 横吐扩展、无状态，节点之间互不通信等特点。

**Broker集群**： Broker用于接收生产者发送消息，或者消费者消费消息的请求。一个Broker集群由多组Master/Slave组成，Master可写可读，Slave只可以读，Master将写入的数据同步给Slave。每个Broker节点，在启动时，都会遍历NameServer列表，与每个NameServer建立长连接，注册自己的信息，之后定时上报。

**Producer集群**： 消息的生产者，通过NameServer集群获得Topic的路由信息，包括Topic下面有哪些Queue，这些Queue分布在哪些Broker上等。Producer只会将消息发送到Master节点上，因此只需要与Master节点建立连接。

**Consumer集群**： 消息的消费者，通过NameServer集群获得Topic的路由信息，连接到对应的Broker上消费消息。注意，由于Master和Slave都可以读取消息，因此Consumer会与Master和Slave都建立连接。

## 五、RocketMQ安装启动

我们以windows机器为例，linux也是一样。

### 1、下载

下载地址：
https://archive.apache.org/dist/rocketmq/5.0.0/

https://www.apache.org/dyn/closer.cgi?path=rocketmq/5.0.0/rocketmq-all-5.0.0-bin-release.zip

我们选择5.0解压缩版本

![image-20260406194019022](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406194020325.png)

放到自己的工作目录解压：

![image-20260406194033549](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406194034567.png)

### 2、配置环境变量修改堆内存

配置环境变量

![image-20260406194048090](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406194049270.png)


修改堆内存大小（这个可以根据机器适当调整，也可不做调整）

进去到bin目录，修改 `runserver.cmd` 和 `runbroker.cmd` 的启动脚本

![image-20260406194117365](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406194118582.png)

![image-20260406194135334](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406194136329.png)

### 3、启动NameServer

在bin目录下进入cmd模式，执行 `start mqnamesrv.cmd`

![image-20260406194156284](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406194157479.png)

我们可以看到启动之后报了一个错，找不到或无法加载主类

解决办法：

编辑runbroker.cmd 为 `%CLASSPATH%` 增加 双引号

![image-20260406194225124](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406194226220.png)


大家需要注意一点，rocketmq的安装路径一定不要有空格，否则还会提示找不到主类（我上面的截图中因为有空格，所以又失败了，大家也检查下自己的安装路径）

再次启动：

![image-20260406194249700](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406194250756.png)

这次成功了



### 4、启动Broker

bin目录下进入cmd，执行如下命令 （autoCreateTopicEnable=true 允许自动创建topic）

```powershell
mqbroker.cmd -n localhost:9876 autoCreateTopicEnable=true
```

看到如下提示标识启动成功：

![image-20260406194329772](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406194331047.png)

## 六、安装rocketmq-console管理的UI工具

rocketmq-console下载地址：https://github.com/apache/rocketmq-externals

修改application.properties配置文件：

![image-20260406194351982](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406194352962.png)

![image-20260406194409165](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406194410330.png)

启动项目：

1、执行命令进行打包（首先电脑要安装maven并配置环境变量）

```powershell
mvn clean package -Dmaven.test.skip=true
```

看到目录下生成了target文件夹表示打包成功

![image-20260406194436407](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406194437547.png)


进到target目录，执行启动命令

```powershell
java -jar rocketmq-console-ng-1.0.0.jar
```

![image-20260406194515956](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406194517092.png)


浏览器访问 http://localhost:8080/#/

![image-20260406194536195](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406194537360.png)

## 七、演示

### 1、发送消息

如果没有主题先新增主题，点击发送消息

![image-20260406194606701](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406194607744.png)

![image-20260406194629675](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406194630778.png)

### 2、消费者接收消息

执行命令，启动消费者监听

```powershell
set NAMESRV_ADDR=localhost:9876
tools.cmd org.apache.rocketmq.example.quickstart.Consumer
```

可以看到我们上面发送的消息

![image-20260406194701565](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406194703395.png)


管理端查看消息：

![image-20260406194715320](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260406194718102.png)
