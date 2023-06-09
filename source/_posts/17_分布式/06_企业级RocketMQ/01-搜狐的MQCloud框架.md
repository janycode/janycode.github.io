---
title: 01-搜狐的MQCloud框架
date: 2022-04-03 15:17:20
tags:
- 架构
- 分布式
- MQCloud
categories: 
- 17_分布式
- 06_MQCloud
---

![image-20220225231712788](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220225231718.png)



参考资料1：https://toscode.gitee.com/dongzhumao86/mqcloud

参考资料(官方文档)：https://github.com/sohutv/mqcloud/wiki

* MQCloud 是搜狐的一款开源RocketMQ企业级一站式服务平台。



### 1. MQCloud创建topic

访问链接（也是 domain 字段配置）：

dev: [dev-mqcloud.xxx.com](http://dev-mqcloud.xxx.com/):80

*默认所有创建的topic都需要经过管理员的审核。

> topic格式：`组名-业务名-topic`
>
> 消费者组：`组名-业务名-topic-consumer`
>
> 生产者组：`组名-业务名-topic-producer`

以下均以此两个业务场景为举例：

**学生信息同步topic**: **chinese-middle-exam-studentinfo-topic**

天总消息量：1万 （预估量，并非limit）

并发消息量：100（预估量，并非limit）

消费者组: 对应topic**-consumer**

流控：20 （每个服务实例每秒最多消费的消息数，有效的限流控制）

生产者组: 对应topic**-producer**



**答题topic**: **chinese-middle-exam-answer-topic**

天总消息量：10万（预估量，并非limit）

并发消息量：1000（预估量，并非limit）

消费者组: 对应topic**-consumer**

流控：1000 （每个服务实例每秒最多消费的消息数，有效的限流控制，eg: 线上2节点，并发理论值2000QPS）

生产者组: 对应topic**-producer**



### 2. 生产者服务接入

分支：dev-mqcloud-jiangyuan

pom.xml

```xml
<!--MQCloud--> 
<dependency>
    <groupId>com.sohu.tv</groupId>
    <artifactId>mq-client-open</artifactId>
    <version>4.6.3</version>
</dependency>
<repository>
    <id>sohu.nexus</id>
    <url>https://raw.github.com/sohutv/mvn_repo/master</url>
</repository>
```

Nacos MQCloud配置（支持重试次数配置）：

```yml
#MQCloud配置
xxx:
  mq:
    domain: mqcloud.xxx.com:80
    retryTimes: 2
    middleExamAnswer: 
      topic: chinese-middle-exam-answer-topic
      producerGroup: chinese-middle-exam-answer-topic-producer
      consumerGroup: chinese-middle-exam-answer-topic-consumer
    middleExamStudentInfo:
      topic: chinese-middle-exam-studentinfo-topic
      producerGroup: chinese-middle-exam-studentinfo-topic-producer
      consumerGroup: chinese-middle-exam-studentinfo-topic-consumer
#消除RocketMQ官方警告：No topic route info in name server for the topic: TBW102
logging:
  level:
    RocketmqClient: error
    RocketmqCommon: error
    RocketmqRemoting: error
```

配置文件：

```yml
# MQCloud配置文件
- data-id: xxx-mqcloud-${spring.profiles.active}.${spring.cloud.nacos.config.file-extension}
  refresh: true
  group: zzz
```

配置类：

```java
@Configuration
@Slf4j
@SuppressWarnings("all")
public class MQConfiguration {

    @Value("${xxx.mq.domain}")
    private String domain;

    @Value("${xxx.mq.retryTimes}")
    private Integer retryTimes;

    @Value("${xxx.mq.middleExamAnswer.topic}")
    private String middleExamAnswerTopic;

    @Value("${xxx.mq.middleExamAnswer.producerGroup}")
    private String middleExamAnswerProducerGroup;

    @Value("${xxx.mq.middleExamStudentInfo.topic}")
    private String middleExamStudentInfoTopic;

    @Value("${xxx.mq.middleExamStudentInfo.producerGroup}")
    private String middleExamStudentInfoProducerGroup;

    /**
     * 中考答题生产者Bean，使用方法名注入
     *
     * @return com.sohu.tv.mq.rocketmq.RocketMQProducer
     * @throws
     * @author Jerry(姜源)
     * @date 2022-04-01 18:22
     */
    @Bean(initMethod = "start", destroyMethod = "shutdown")
    public RocketMQProducer answerProducer() {
        RocketMQProducer producer = new RocketMQProducer(middleExamAnswerProducerGroup, middleExamAnswerTopic);
        //根据环境的不同需要修改对应的域名
        producer.setMqCloudDomain(domain);
        //重试次数
        producer.setDefaultRetryTimes(retryTimes);
        //异步重试的结果
        producer.setResendResultConsumer(result -> {
            if (!result.isSuccess) {
                log.info("MQCloud失败重试次数:{},消息:{}", result.getRetriedTimes(), result.getMqMessage());
            }
        });
        return producer;
    }

    /**
     * 中考学生信息同步生产者Bean，使用方法名注入
     *
     * @return com.sohu.tv.mq.rocketmq.RocketMQProducer
     * @throws
     * @author Jerry(姜源)
     * @date 2022-04-01 18:22
     */
    @Bean(initMethod = "start", destroyMethod = "shutdown")
    public RocketMQProducer studentInfoProducer() {
        RocketMQProducer producer = new RocketMQProducer(middleExamStudentInfoProducerGroup, middleExamStudentInfoTopic);
        //根据环境的不同需要修改对应的域名
        producer.setMqCloudDomain(domain);
        //重试次数
        producer.setDefaultRetryTimes(retryTimes);
        //异步重试的结果
        producer.setResendResultConsumer(result -> {
            if (!result.isSuccess) {
                log.info("MQCloud失败重试次数:{},消息:{}", result.getRetriedTimes(), result.getMqMessage());
            }
        });
        return producer;
    }
}
```

发送消息示例其中1个：

```java
@Component
@Slf4j
@SuppressWarnings("all")
public class MiddleExamAnswerProducer {

    @Autowired
    private RocketMQProducer answerProducer;

    /**
     * 中考问题答案消息发送
     *
     * @param middleExamAnswerDto
     * @return
     */
    public Result<SendResult> sendMessage(MiddleExamAnswerDto middleExamAnswerDto) {
        log.info("MQCloud:answer_message_send={}", JSONObject.toJSONString(middleExamAnswerDto));
        //转换为json
        String jsonStr = JSON.toJSONString(middleExamAnswerDto);
        //建议设置keys(多个key用空格分隔)参数(也可以忽略该参数)，比如keys指定为id，那么就可以根据id查询消息
        Result<SendResult> sendResult = answerProducer.publish(jsonStr, String.valueOf(middleExamAnswerDto.getUserId()));
        if (!sendResult.isSuccess) {
            //失败消息处理，记录日志
            log.error("MQCloud:answer_message_send failed, result={}", JSONObject.toJSONString(sendResult));
        }
        return sendResult;
    }
}
```



### 3. 消费者服务接入

分支：dev-mqcloud-jiangyuan

pom.xml

```xml
<!--MQCloud--> 
<dependency>
    <groupId>com.sohu.tv</groupId>
    <artifactId>mq-client-open</artifactId>
    <version>4.6.3</version>
</dependency>
<repository>
    <id>sohu.nexus</id>
    <url>https://raw.github.com/sohutv/mvn_repo/master</url>
</repository>
```

Nacos 配置共享（同上，略）。

配置文件共享（同上，略）。

配置类：

```java
@Configuration
@Slf4j
@SuppressWarnings("all")
public class MQConfiguration {

    @Value("${xxx.mq.domain}")
    private String domain;

    @Value("${xxx.mq.middleExamAnswer.topic}")
    private String middleExamAnswerTopic;

    @Value("${xxx.mq.middleExamAnswer.consumerGroup}")
    private String middleExamAnswerConsumerGroup;

    @Value("${xxx.mq.middleExamStudentInfo.topic}")
    private String middleExamStudentInfoTopic;

    @Value("${xxx.mq.middleExamStudentInfo.consumerGroup}")
    private String middleExamStudentInfoConsumerGroup;

    /**
     * 中考答题消费者
     *
     * @param callback 消费逻辑处理回调
     * @return com.sohu.tv.mq.rocketmq.RocketMQConsumer
     */
    @Bean(initMethod = "start", destroyMethod = "shutdown")
    public RocketMQConsumer answerConsumer(AnswerJsonConsumer callback) {
        RocketMQConsumer consumer = new RocketMQConsumer(middleExamAnswerConsumerGroup, middleExamAnswerTopic);
        //根据环境的不同需要修改对应的域名
        consumer.setMqCloudDomain(domain);
        //配置callback用于具体消费逻辑处理
        consumer.setConsumerCallback(callback);
        return consumer;
    }

    /**
     * 中考学生信息同步消费者
     *
     * @param callback 消费逻辑处理回调
     * @return com.sohu.tv.mq.rocketmq.RocketMQConsumer
     */
    @Bean(initMethod = "start", destroyMethod = "shutdown")
    public RocketMQConsumer studentInfoConsumer(UserInfoSyncConsumer callback) {
        RocketMQConsumer consumer = new RocketMQConsumer(middleExamStudentInfoConsumerGroup, middleExamStudentInfoTopic);
        //根据环境的不同需要修改对应的域名
        consumer.setMqCloudDomain(domain);
        //配置callback用于具体消费逻辑处理
        consumer.setConsumerCallback(callback);
        return consumer;
    }

}
```



消费消息示例1个：

```java
@Component
@Slf4j
@SuppressWarnings("all")
public class AnswerJsonConsumer implements ConsumerCallback<String, MessageExt> {

    @Autowired
    private AnswerJsonService answerJsonService;

    /**
     * 后端json解析入库消息处理
     *
     * @param jsonStr    json参数
     * @param messageExt 消息扩展对象
     * @return void
     */
    @Override
    @SneakyThrows
    public void call(String jsonStr, MessageExt messageExt) {
        if (StringUtils.isEmpty(jsonStr)) {
            log.info("MQCloud:consumer jsonStr is null!");
            return;
        }
        MiddleExamAnswerDto middleExamAnswerDto = BeanUtils.jsonToBean(jsonStr, MiddleExamAnswerDto.class);
        log.info("MQCloud:consumer analyAnswer===messageParamter》{}", jsonStr);
        Integer throughTypeId = middleExamAnswerDto.getThroughTypeId();
        if ((ThroughTypeIdEnum.GUAN_QIA_1.getCode().equals(throughTypeId) ||
                ThroughTypeIdEnum.GUAN_QIA_2.getCode().equals(throughTypeId) ||
                ThroughTypeIdEnum.GUAN_QIA_3.getCode().equals(throughTypeId))) {
            answerJsonService.analyFirstThreeLevels(middleExamAnswerDto);
        } else if (ThroughTypeIdEnum.GUAN_QIA_4.getCode().equals(throughTypeId)) {
            answerJsonService.analyFourLevel(middleExamAnswerDto);
        }
    }
}
```



### 4. 发送&消费查看

MQ发送成功：

![image-20220403153214989](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220403153216.png)

MQ消费成功：

![image-20220403153233503](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220403153234.png)