---
title: 00-Java技术选型总纲
date: 2020-6-13 23:18:32
tags:
- 框架
- 选型
categories: 
- 19_技术选型
---

```
技术选型总纲（常见）：

网关：Nginx、Kong、Zuul
熔断：Hystrix、Resilience4j
负载均衡：Nginx、SLB、DNS、F5、LVS、OpenResty、HAproxy

数据库：MySql、Oracle、polarDB、Redis、MariaDB、MongoDB、PostgreSQL、Memcache、HBase、ElasticSearch
数据库中间件：DRDS、Mycat、ShardingSphere/Sharding-Proxy、Atlas（360）、Cobar(不维护了)
SQL审核：Yearning、Archery
全文检索：Lucene、ElasticSearch、Solr、Hibernate Search
缓存：Redis、MemCached、OsCache、EhCache
缓存客户端：Spring Data Redis、Jedis、Redisson

ORM框架：Hibernate、MyBatis、MyBatisPlus、SpringDataJPA、JOOQ

注册中心：Nacos、Eureka、Zookeeper、Redis、Etcd、Consul
配置中心：Nacos、Apollo、Spring Cloud Config、Disconf、Diamond
限流工具：Sentinel
认证鉴权：Spring Security、JWT、Shiro
消息队列：RocketMQ、MQCloud（搜狐）、RabbitMQ、ActiveMQ、Kafka、ZeroMQ、Redis、Pulsar
RPC框架：Feign+Ribbon、Dubbo、grpc、Motan、Thrift
文件系统：OSS、NFS、FastDFS、MogileFS
爬虫框架：Jsoup、Webmagic、Crawler4j、Nutch
网络框架：Netty、RocketMQ+MQTT、WebSocket

分布式ID：UUID、SnowFlake、Leaf（美团）、TinyID（滴滴）、Uidgenerator（百度）
分布式框架：SpringCould、SpringCloudAlibaba、Dubbo、Motan
分布式存储：HDFS、Swift、Ceph
分布式事务：Seata
分布式任务：XXL-JOB、Elastic-Job、Quartz、Saturn
分布式追踪：SkyWalking、Spring Cloud Sleuth、Pinpoint、CAT、zipkin
分布式日志：Elasticsearch、Logstash、Kibana（ELK）、Redis、kafka、Filebeat

工具整合：Hutool、Guava
AI写代码：Cursor(客户端)、Copilot(插件)、Bito(插件)、CodeGPT(插件)
JSON解析：Fastjson、Jackson、Gson
Excel解析：EasyExcel、Apache POI、EasyPoi
图片绘制：Graphics2D
规则引擎：Easy Rules、Drools、ILOG JRules
模版引擎：Freemarker、Thymeleaf

调试工具：Arthas、JMH
代码检测：Sonar、SpotBugs
单元测试：Junit、Jacoco、Diffblue、Mockito
接口文档：Knife4j、Swagger、YApi、Apidoc、ApiFox
压测工具：LoadRunner、JMeter、AB、webbench、MeterSphere
构建工具：Maven、Gradle、Bazel
集成部署：Docker、Jenkins、Git、Maven
容器管理：Docker、Rancher、K8s(Kubernetes)
系统监控：Grafana、Prometheus、Influxdb、Telegraf、Lepus
版本发布：蓝绿部署、A/B测试、灰度发布/金丝雀发布
```



每一项都按照从上到下为从好到差的顺序排列技术栈，并给它们打分（满分100分）。

### 1.持久层框架

#### 说明

这几个框架我都用过。按开发速度来看，一个模块，如果MyBatis-Plus开发需要1天，则JPA需要2.5天，MyBatis需要4天。

新项目基本都是用MyBatis-Plus了。

#### 评分

##### MyBatis-Plus（95）

好处：开发速度快、兼容MyBatis
缺点：个别场景的多表联查不如JPA。

##### JPA（60）

好处：个别场景的多表联查比较好用。
缺点：正常场景下，开发速度不如MyBatis-Plus。

##### MyBatis（40）

优点：可以被MyBatis-Plus依赖，与MyBatis-Plus共同使用。
缺点：开发速度慢

### 2.分布式框架

#### 说明

现在新项目一般都用Spring Cloud Alibaba了。feign+nacos+sentinel，很舒服！

#### 评分

##### Spring Cloud Alibaba（95）

优点：feign调用基于http，灵活；nacos和sentinel很好用

##### Spring Cloud原生（80）

优点：feign调用基于http，灵活
缺点：eureka已闭源，配置中心使用不方便

##### Dubbo（50）

优点：基于长连接，比SpringCloud速度稍快一点儿
缺点：不够灵活，且相关的组件很少

### 3.分布式锁

##### Redisson（95分）

续期、可重入等接近完美

##### Zookeeper（70分）

用的比较少

##### MySQL（30分）

效率很低

### 4.分布式定时任务

##### XXL-JOB（90分）

很流行；很好用

##### PowerJob（80分）

流行度低；使用体验略差

##### Quartz（50分）

难用；

##### Spring自带（30分）

无可视化页面

### 5.分布式事务

##### Seata（95分）

阿里开发，很流行

### 6.MQ

##### RocketMQ（95）

##### RabbitMQ（85）

##### Kafka（70）

### 7.Redis客户端

##### Redisson（98）

##### RedisTemplate（80）

##### Jedis（60）

### 8.ElasticSearch客户端

##### Spring Data ElasticSearch（95）

##### bboss-elasticsearch（75）

##### elasticsearch-sql（60）

### 9.链路追踪

##### SkyWalking（90）

##### Zipkin（80）

##### Cat（60）

### 10.接口文档工具

##### knife4j（90）

##### swagger（75）

##### apidoc（60）

### 11.杂项

#### 11.1 JSON工具

##### Jackson（99）

Spring自带，效率和稳定性都很好

##### FastJson（60）

bug多，经常爆出问题

##### gson（50）

不流行

#### 11.2 HTTP客户端

##### RestTemplate（95）

Spring自带，稳定性好

##### HttpRequest（80）

hutool的，灵活性好