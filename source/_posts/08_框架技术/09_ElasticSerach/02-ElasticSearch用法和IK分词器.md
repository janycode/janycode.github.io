---
title: 02-ElasticSearch用法和IK分词器
date: 2021-2-13 10:24:55
tags:
- ElasticSearch
categories: 
- 08_框架技术
- 09_Elasticsearch
---



![image-20200723190721900](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200723190723.png)

官方网站：https://www.elastic.co/cn/elasticsearch/

分词器：https://www.cnblogs.com/cjsblog/p/10327673.html

词频计算相关性：https://www.elastic.co/guide/en/elasticsearch/guide/current/relevance-intro.html

## ElasticSearch 是什么？

ElasticSearch 是一个基于Lucene的分布式、RESTful 风格、近实时的搜索和数据分析引擎。以下简称ES

开发语言： Java

支持客户端：Java、.NET（C#）、PHP、Python、Apache Groovy、Ruby 等，支持REST风格调用

## 为什么选择ES?

市场类似类似产品：Solr

市场地位： 目前已取代Solr成为使用最多最受欢迎的搜索分析引擎

ElasticSearch 和 Solr的取舍：

1. ElasticSearch 晚于Solr ，借鉴了Solr的成功经验 更注重扩展性，搜索实时性更高

2. Solr在搜索静态数据时性能更高,ES在更新索引时依然可以维持稳定的搜索性能

3. ES ，Solr搜索指数对比
    ![image-20210213100910539](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210213101806.png)
    ![image-20210213100943338](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210213100944.png)
    ![image-20210213100953411](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210213100954.png)

## ES提供的能力

1. 数据存储，整合
2. 精确匹配
3. 模糊搜索：可定义匹配度。 例如：搜索：我是中国人
4. 聚合搜索：用于数据统计等功能
5. 相关度搜索： 例如：在多篇文章中搜索某个词语，可以按照默认算法或者自定义评分规则使搜索结果排序符合我们的预期
6. 特殊类型搜索： 地理空间搜索（计算两点之间距离，搜索指定半径范围数据,搜索指定边界内数据等），Ip地址搜索（ip范围搜索） 等
7. 搜索建议： 如百度搜索时实时返回的提示词

## ES常用使用场景

1. 站内搜索: 比如各类电商,论坛,新闻,ERP网站,站内搜索功能一般都由ES或Solr支持

2. 日志分析: 常用组合ELK,既 ES + Logstash (最新用Beats) + Kibana
    监控、统计、日志类时间序的数据存储和分析、可视化，ELK可以完美支持
    ![image-20210213101010195](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210213101011.png)

3. 作为NoSQL Json数据库
    作为NoSQL数据库,ES比Mogo读写性能更强大,可以支持PB级数据.
    对地理位置等数据支持更好,可以方便的计算经纬度坐标的距离,坐标范围查询等功能

4. BI系统
    BI系统也成商业智能,主要是通过数据挖掘,数据分析提供有价值的商业决策
    ES的海量数据处理能力和多样,快速的查询,统计可以提供强大的支撑



## ES架构

![image-20210213101101370](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210213101102.png)



```
1. Gateway是ES用来存储索引的文件系统，支持多种类型。
2. Gateway的上层是一个分布式的lucene框架。
3. Lucene之上是ES的模块，包括：索引模块、搜索模块、映射解析模块等
4. ES模块之上是 Discovery、Scripting和第三方插件。Discovery是ES的节点发现模块，不同机器上的ES节点要组成集群需要进行消息通信，集群内部需要选举master节点，这些工作都是由Discovery模块完成。支持多种发现机制，如 Zen 、EC2、gce、Azure。Scripting用来支持在查询语句中插入javascript、python等脚本语言，scripting模块负责解析这些脚本，使用脚本语句性能稍低。ES也支持多种第三方插件。
5. 再上层是ES的传输模块和JMX.传输模块支持多种传输协议，如 Thrift、memecached、http，默认使用http。JMX是java的管理框架，用来管理ES应用。
6. 最上层是ES提供给用户的接口，可以通过RESTful接口和ES集群进行交互。
```



## ES 基本概念

**1、文档 （document）**

文档是ES索引和搜索数据的最小单位。

它拥有灵活的结构。文档不依赖于预先定义的模式。并非所有的文档都需要拥有相同的字段，它们不受限于同一个模式。

不过当用于搜索时,为了提高性能通常会定义好每个字段的类型,并使用mapping定义文档结构.

**2、类型 （type）**

类型是文档的逻辑容器，类似于表格是行的容器。在不同的类型中，最好放入不同结构的文档。例如，可以用一个类型存放商品的数据，而另一个类型存放用户的数据。

PS: 7.X版本已彻底放弃type, 提倡每个索引存放单一类型数据,不再有type的概念了

**3、索引 （index）**

索引是映射类型的容器。一个Elasticsearch索引是独立的大量的文档集合。 每个索引存储在磁盘上的同组文件中，索引存储了所有映射类型的字段，还有一些设置。

当你插入一个文档时,ES默认会自动为每一个自动匹配一个类型,作为小白直接使用也是可以的, 但是正式环境使用时一般都需要根据业务需求自定义mapping去定义索引字段及字段类型才能发挥出更高的性能

**4、映射（mapping）**

所有文档在写入索引前都将被分析，用户可以设置一些参数，决定如何将输入文本分割为词条，哪些词条应该被过滤掉，或哪些附加处理有必要被调用（比如移除HTML标签）。这就是映射扮演的角色：存储分析链所需的所有信息。

示例:



```
{
  "doccenter_test" : {
    "mappings" : {
      "DcDoc" : {
        "properties" : {
          "catalogId" : {
            "type" : "keyword"
          },  
          "docConvertstatus" : {
            "type" : "keyword"
          },
          "docCreateddate" : {
            "type" : "date",
            "format" : "yyyy-MM-dd HH:mm:ss"
          },
          "docDowncount" : {
            "type" : "integer"
          },
          "docId" : {
            "type" : "keyword"
          },
          "docName" : {
            "type" : "text",
            "analyzer" : "ik_max_word"
          }
        }
      }
    }
  }
}
```



## ES 数据类型

看了上边的mapping定义,是不是发现其中有数据类型的定义了?

```
【基本数据类型】
字符型：string
数字型：long：64位存储 , integer：32位存储 , short：16位存储 , byte：8位存储 , double：64位双精度存储 , float：32位单精度存储
日期型：date
布尔型: boolean
二进制型：binary

【复杂数据类型】
数组类型：数组类型不需要专门指定数组元素的type，例如：
	字符型数组: [ "one", "two" ]
	整型数组：[ 1, 2 ]
	数组型数组：[ 1, [ 2, 3 ]] 等价于[ 1, 2, 3 ]
	对象数组：[ { "name": "Mary", "age": 12 }, { "name": "John", "age": 10 }]
对象类型：* object *用于单个JSON对象；
嵌套类型：* nested *用于JSON数组；

【地理位置类型】
地理坐标类型：* geo_point *用于经纬度坐标；
地理形状类型：* geo_shape *用于类似于多边形的复杂形状；

【专业类型】
IPv4 类型：* ip *用于IPv4 地址；
Completion 类型：* completion *提供自动补全建议；
Token count 类型：* token_count *用于统计做了标记的字段的index数目，该值会一直增加，不会因为过滤条件而减少。
[mapper-murmur3]：通过插件，可以通过 *murmur3 *来计算index的 hash 值；
附加类型（Attachment datatype）：采用[mapper-attachments] 插件，可支持* attachments *索引，例如Microsoft Office 格式，Open Document 格式，ePub, HTML 等。
```



## ElasticSearch  , Kibana 和 elasticsearch-head

业务使用中，为了进行调试和管理还需要使用到Kibana和 es-head

Kibana是为ES提供的可视化界面，在上面我们可以进行DSL的调试，或者管理索引，建立自己的视图等操作 

elasticsearch-head 是ES一个比较古老的管理服务，虽然界面比较丑，但是功能基本可以满足日常监控和管理使用

![image-20210213101329028](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210213101330.png)

## 第一个HelloWorld(v6.8)

首先你得安装好你的ES和Kibana.

然后复习一下自从学了RESTFUL以来,从来就没有使用过的几个http请求格式

1）GET：获取请求对象的当前状态。

2）POST：改变对象的当前状态。ES中插入文档会自动生成ID

3）PUT：创建一个对象。ES中用于指定ID进行插入

4）DELETE：销毁对象。

5）HEAD：请求获取对象的基础信息。



打开Kibana,进入这个页面

![image-20210213101833843](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210213101834.png)



自定义mapping 创建一个索引,你会发现ES的使用就是这么简单

```json
PUT music
{
    "mappings": {
        "_doc" : {
            "properties" : {
            
                "name" : {
                    "type": "text"
                },
                "author":{
                  "type":"keyword"
                }
            }
        }
    }
}
```

有了索引就可以尝试一下程序员终极技能了:增删改查

```json
#创建索引
PUT music
{
    "mappings": {
        "musicType" : {
            "properties" : {
            
                "name" : {
                    "type": "text"
                },
                "author":{
                  "type":"text"
                }
            }
        }
    }
}
#插入文档
PUT music/musicType/10000 
{
  "name":"牧马城市",
  "author":"谁谁谁"
}
#根据id查询
GET music/musicType/10000 

#修改一下歌名
PUT music/musicType/10000
{
  "name":"牧马城市",
  "author":"毛不易"
}

#换个姿势查询所有
GET /music/musicType/_search
{
  "query":{
     "match_all": {}
  }
}
#匹配查询
GET /music/musicType/_search
{
  "query":{
    "match": {
      "name":"牧马"
    }
  }
}

#删除文档
DELETE music/musicType/10000

#换个姿势删除
POST music/musicType/_delete_by_query
{
  "query":{
    "match": {
      "name":"牧马"
    }
  }
}

#练习完毕,删除索引
DELETE music
```

![image-20210213102023898](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210213102025.png)



## 分词器

学会了增删改查,理所当然要找个实际需求练练手了,这个时候我们就需要接触到ES的另一个概念:分词

ES之所以能够对大量文档,大段文字进行快速检索,依靠的就是对文档进行分词,然后生成倒排索引. 数据库知识比较扎实的应该对倒排索引都不陌生, 它记录了每个词的关联文档,频率等信息从而在我们需要的时候能够快速检索. 具体理论可以参考以下文章

https://www.cnblogs.com/cjsblog/p/10327673.html

而所谓分词就是按照一定规则对大段的文字进行拆分,从而得到n多个有意义的词汇。

ES默认的分词规则是针对英文的,也就是按照空格拆分.比如:我爱你祖国,会被分词为 我,爱,你,祖,国五个词.  这对中文来说跟没有分词一样,毫无用处。 所以就有了针对中文的专门的分词器：IK Analazer

IK分词器在中文分词领域是毫无争议的No1 , 甚至强到都没人知道老二是谁

我们想使用它也很简单,只需要去下载ES相同版本,放在 %ES_HOME%/config 目录下

重启ES即可

然后我们就可以在定义mapping的时候或者搜索时指定分词器

```
PUT music
{
    "mappings": {
        "musicType" : {
            "properties" : {
            
                "name" : {
                    "type": "text",
                    "analyzer": "ik_smart"
                },
                "author":{
                  "type":"text",
                  "analyzer": "ik_max_word"
                }
            }
        }
    }
}
```

大家会发现我使用了ik_smart, ik_max_word两种分词器.

这其实是IK提供的两种模式,ik_smart 是精简的分词模式,同样的文字分出的词汇比较少, ik_max_word则会尽可能多的对词进行切分

我们可以使用Kibana进行简单的测试就可以明白其中的不同

```
GET _analyze 
{
  "analyzer":"ik_smart",
  "text":"我是一个中国人"
}
```

分词结果: 

```
我
是
一个
中国人
```



```
GET _analyze 
{
  "analyzer":"ik_max_word",
  "text":"我是一个中国人"
}
```



分词结果

```
我
是
一个中国
一个
个中
个
中国人
中国
国人
```



## 常见入门问题

#### 1. ES 6.8 IK分词器bug

但是再好的代码也有bug, 我们在上一个项目中就遇到了一个6.8版本的bug,7.0已经修复. 在这里还是记录一下,毕竟我们使用的是6.8版本

这个bug就是在插入某些特定词语的时候IK分词器因为解析问题会报以下错误:

```
"startOffset must be non-negative, and endOffset must be >= startOffset, and offsets must not go backwards startOffset=2,endOffset=3,lastStartOffset=3 for field 'description'"
```

比如: 肉芽肿性唇炎的特点

解决方案也很简单:

1. 升级版本
2. 将报错的词语添加到自定义分词规则中
    显然第二中方案更简单一点



#### 2. 日期格式设置错误

资料中心创建时间 日期格式设置为 yyyy-mm-dd HH:mm:ss  导致排序数据异常
正确的格式：

```json
{
  "doccenter_dcdoc" : {
    "mappings" : {
      "DcDoc" : {
        "properties" : {
          "catalogId" : {
            "type" : "keyword"
          },
          "docCreateddate" : {
            "type" : "date",
            "format" : "yyyy-MM-dd HH:mm:ss" # MM表示月份
          }
     }
 }
```

#### 3. 设置匹配度 优化查询结果

由于内容的特性，我们不希望将关联度不大的结果展示给用户，所以设置了最新匹配度来进行限定

![image-20210213101433720](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210213101434.png)

## ES的Java客户端选择

RestClient, 未来ES会逐渐废弃其他client统一到RestClient ,未来的选择



####  1. ES提供了两个JAVA REST client 版本

Java Low Level REST Client: 低级别的REST客户端，通过http与集群交互，用户需自己编组请求JSON串，及解析响应JSON串。兼容所有ES版本。

Java High Level REST Client: 高级别的REST客户端，基于低级别的REST客户端，增加了编组请求JSON串、解析响应JSON串等相关api。使用的版本需要保持和ES服务端的版本一致，否则会有版本问题。

1. Java Low Level REST Client 

说明，特点，maven 引入、使用介绍： https://www.elastic.co/guide/en/elasticsearch/client/java-rest/current/java-rest-low.html

API doc ：https://artifacts.elastic.co/javadoc/org/elasticsearch/client/elasticsearch-rest-client/6.2.4/index.html.



2. Java High Level REST Client  (推荐)

High Level REST Client 从6.0.0开始加入，目的是以java面向对象的方式来进行请求、响应处理。

每个API 支持 同步/异步 两种方式，同步方法直接返回一个结果对象。异步的方法以async为后缀，通过listener参数来通知结果。

高级java REST 客户端依赖Elasticsearch core project

兼容性说明：

依赖 java1.8 和 Elasticsearch core project

请使用与服务端ES版本一致的客户端版本

参考:[https://blog.csdn.net/qq_26676207/article/details/81019677](https://blog.csdn.net/qq_26676207/article/details/81019677)



#### 2. TransportClient

   官方提示TransportClient在7.0版本过时,8.0版本将被废弃

#### 3. JestClient

#### 4. spring-data-elasticsearch

  spring-data 体系的用户可以使用,如果你不用spring-data还是算了

#### 5. NodeClient(2.x时代的客户端,5.x已经消失了)


##  ES 节点

#### 1. 客户端节点

　　当主节点和数据节点配置都设置为false的时候，**该节点只能处理路由请求，处理搜索，分发索引操作**等，从本质上来说该客户节点表现为智能负载平衡器。独立的客户端节点在一个比较大的集群中是非常有用的，他协调主节点和数据节点，客户端节点加入集群可以得到集群的状态，根据集群的状态可以直接路由请求。

#### 2. 数据节点

　　数据节点主要是存储索引数据的节点，**主要对文档进行增删改查操作，聚合操作**等。数据节点对cpu，内存，io要求较高， 在优化的时候需要监控数据节点的状态，当资源不够的时候，需要在集群中添加新的节点。

#### 3. 主节点

　 主节点的主要职责是和集群操作相关的内容，如**创建或删除索引，跟踪哪些节点是群集的一部分，并决定哪些分片分配给相关的节点**。稳定的主节点对集群的健康是非常重要的，默认情况下任何一个集群中的节点都有可能被选为主节点，索引数据和搜索查询等操作会占用大量的cpu，内存，io资源，为了确保一个集群的稳定，分离主节点和数据节点是一个比较好的选择。 

#### 4. 生产环境使用建议（规模较大时适用）

　　在一个生产集群中我们可以对这些节点的职责进行划分，建议集群中设置3台以上的节点作为master节点，这些节点只负责成为主节点，维护整个集群的状态。再根据数据量设置一批data节点，这些节点只负责存储数据，后期提供建立索引和查询索引的服务，这样的话如果用户请求比较频繁，这些节点的压力也会比较大，所以在集群中建议再设置一批client节点(node.master: false node.data: false)，这些节点只负责处理用户请求，实现请求转发，负载均衡等功能。



## ES 集群，分片和副本

想要理解ES是如何实现分布式高可用的就必须要理解以下这张图

部署架构图

![image-20210213101505689](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210213101506.png)
***\*集群(cluster):\****由一个或多个节点组成, 并通过集群名称与其他集群进行区分

***\*节点(node):\****单个ElasticSearch实例. 通常一个节点运行在一个隔离的容器或虚拟机中

***\*索引(index):\****在ES中, 索引是一组文档的集合

***\*分片(shard):\****因为ES是个分布式的搜索引擎, 所以索引通常都会分解成不同部分, 而这些分布在不同节点的数据就是分片. ES自动管理和组织分片, 并在必要的时候对分片数据进行再平衡分配, 所以用户基本上不用担心分片的处理细节，***\*一个分片默认最大文档数量是20亿\**\**.\****

***\*副本(replica):\****ES默认为一个索引创建5个主分片, 并分别为其创建一个副本分片. 也就是说每个索引都由5个主分片成本, 而每个主分片都相应的有一个copy.



理解了什么叫分配以后可能会有不少人认为分片越多越好，副本越多性能越高

其实不然，要根据自己的数据量和写入、读取比例来客观分析。 分片数量关系写入性能的高低，副本数量关系查询速度的快慢，但是少量的数据分配到大量的分片上反而会导致查询性能的降低。 通常认为一个分片大小以30G左右为宜  

- 每个分片本质上就是一个Lucene索引, 因此会消耗相应的文件句柄, 内存和CPU资源
- 每个搜索请求会调度到索引的每个分片中. 如果分片分散在不同的节点倒是问题不太. 但当分片开始竞争相同的硬件资源时, 性能便会逐步下降
- ES使用[词频统计来计算相关性](https://www.elastic.co/guide/en/elasticsearch/guide/current/relevance-intro.html). 当然这些统计也会分配到各个分片上. 如果在大量分片上只维护了很少的数据, 则将导致最终的文档相关性较差



## 生产中常用优化

#### 索引优化

```
优化方向：
    .合理创建分片和备份
  .尽可能严格控制数据类型
  .非查询字段不创建索引
  .使用合理的分词规则
{
"settings":{
  "number_of_replicas":0, //备份数,根据需要决定是否需要备份,备份会降低写/改速度,提升查询速度
  "number_of_shards":5, //分片数,默认5. 一般建议每个分片大小10-30G, 根据数据大小计算分片数
  "index.store.type": "niofs", //存储方式
  "index.query.default_field": "title",//默认搜索字段
  "index.unassigned.node_left.delayed_timeout": "5m",//节点异常后5分钟后再执行备份恢复操作,防止  网络抖动引发备份,影响性能
  },
"mappings":{
  "house":{
      "dynamic" : "false",// 可选值 true/ false/strict  数据类型逐渐严格
      "_all":{
            "enabled":false //6.0版本后已经废弃,会把所有字段整合起来供搜索,浪费性能  
        }  
      "properties":{
         
      }
  }
}
}
```



#### 配置优化:

1. 禁止通配符删除  //可动态修改

2. 设置合理的刷盘时间 index.refresh_interval:30s//重启才能生效

3. 集群通信优化,适当延长通信时间可以避免短时间网络异常造成的集群数据恢复

   discovery.zen.fd.ping_interval: 10s  //心跳时间

​    discovery.zen.fd.ping_timeout:120s//超时时间

​    discovery.zen.fd.ping_retries:3 //重试次数

4. 各个节点各司其职,尽量不要让一个节点担任多个功能

    node.name:master  //节点名称

    node.master:true   //是否是指挥节点

    node.data: true    //是否是数据节点

常见配置:

```
指挥节点:
node.master:true
node.data: false
数据节点:
node.master:false
node.data: true
负载均衡节点: [一般我们会用Nginx之类做负载均衡,而不是使用ES的节点去做负载均衡]
node.master:fale
node.data: false
```



5. 内存设置[config/jvm.options]

    -Xms256m

    -Xmx256m

最大不要超过32G, 并且不要超过总内存的50%

6. 大量数据导入不要单条导入,使用bulk批量导入可以大大提升性能

7. 硬盘尽量使用SSD硬盘

## 查询

match 
下面的查询匹配就会进行分词，比如"我是中国人"会被分词为我，中国，中国人 等, 那么所有包含这三个词中的一个或多个的文档就会被搜索出来。

并且根据lucene的评分机制(TF/IDF)来进行评分。

```
{
  "query": {
    "match": {
        "content" : {
            "query" : "我是中国人"
        }
    }
  }
}
```

match_phrase  短语匹配

那么想要精确匹配所有同时包含"中国人"的文档怎么做？就要使用 match_phrase 了

完全匹配可能也不是我们想要的，我们会希望少匹配字一个也满足，那就需要使用到slop调节因子进行调节。

```
{
  "query": {
    "match_phrase": {
        "content" : {
            "query" : "中国人"，
             "slop" : 1
        }
    }
  }
}
```



multi_match

实际业务中我们一般需要多个字段进行匹配，其中一个字段有这个文档就满足的话，就可以使用multi_match

但是multi_match就涉及到匹配评分的问题了。

```
{
  "query": {
    "multi_match": {
      "query": "我是中国人",
      "type": "best_fields",
      "fields": [
        "tag",
        "content"
      ],
      "tie_breaker": 0.3 #意思就是完全匹配"我 中国人"的文档评分会比较靠前，如果只匹配一个的文档评分乘以0.3的系数，类似的分数控制方式还有很多，需要大家自己去阅读官方文档

    }
  }
}
```



 term

term是代表完全匹配，即不进行分词器分析，文档中必须包含整个搜索的词汇

```
{
  "query": {
    "term": {
      "content": "我是中国人"
    }
  }
}
```

bool联合查询: must,should,must_not

这三个可以这么理解

\*  must: 文档必须完全匹配条件

\*  should: should下面会带一个以上的条件，至少满足一个条件，这个文档就符合should

\*  must_not: 文档必须不匹配条件



如果我们想要请求"content中带宝马，但是tag中不带宝马"这样类似的需求，就需要用到bool联合查询。

联合查询就会使用到must,should,must_not三种关键词。

```
{
  "query": {
    "bool": {
      "must": {
        "term": {
          "content": "宝马"
        }
      },
      "must_not": {
        "term": {
          "tags": "宝马"
        }
      }
    }
  }
}
```



合理使用Filter

Filter 是ES中的过滤查询，是一种精确匹配，它会按照条件对文档进行过滤，不匹配的文档都会被过滤掉而不再参与后续的评分。
而且能够使用到ES的各种优化和缓存，这就意味着在数据稀疏的情况下，使用Filter可以大大提高查询性能

示例：

```
GET /_search
{
  "query": { （1）
    "bool": { （2）
      "must": [
        { "match": { "title":   "Search"        }}, （3）
        { "match": { "content": "Elasticsearch" }}  （4）
      ],
      "filter": [ （5）
        { "term":  { "status": "published" }}, （6）
        { "range": { "publish_date": { "gte": "2015-01-01" }}} （7）
      ]
    }
  }
}
```



除了上述我们列出的常用查询方式以外还有很多其他方式的查询，我们无法一一列举，
ES的评分规则因为比较复杂这里也没有做过多介绍
大家可以参照以下学习路线进行学习



## ES学习路线

![ES学习路线](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210213101756.png)