---
title: 01-ElasticSearch Demo
date: 2018-6-21 23:59:45
tags:
- ElasticSearch
categories: 
- 08_框架技术
- 09_Elasticsearch
---



![image-20200723190721900](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200723190723.png)

官网地址：https://www.elastic.co/cn/Elasticsearch/

参考资料：https://wiki.jikexueyuan.com/project/Elasticsearch-definitive-guide-cn/

### 1. 简介

* **海量数据的存储和搜索**
    随着系统的并发量越来越大，系统的数据量也越来越多，也就会数据搜索速度越来越低，存储和搜索的压力
    越来越大。
    * 存储：数据的分片、搭建数据库的集群、第三方云数据库（弹性扩容）
    * 搜索：全文检索技术（Elasticsearch、Solr）

#### 1.1 主流全文检索框架

* **Lucene**
    Lucene是Apache Jakarta家族中的一个开源项目，是一个开放源代码的全文检索引擎工具包，但它不是一个完整的全文检索引擎，而是一个全文检索引擎的架构，提供了完整的查询引擎、索引引擎和部分文本分析引
    擎。 Elasticsearch和Solr都是基于Lucene实现的。
    官网：https://lucene.apache.org/
* **Solr**
    Solr具有高度的可靠性，可伸缩性和容错性，可提供分布式索引，复制和负载平衡查询，自动故障转移和恢
    复，集中式配置等。Solr为许多世界上最大的互联网站点提供搜索和导航功能。
    分布式的开发中，占比重要，但是在微服务占有度下降。
    官网：https://lucene.apache.org/solr/
* **`Elasticsearch`**
    Elasticsearch是一个高度可扩展的开源全文本搜索和分析引擎。可以快速，近乎实时地存储，搜索和分析大量
    数据。它通常用作支持具有复杂搜索功能和要求的应用程序的基础引擎/技术。
    现在各大互联网主流

#### 1.2 Elasticsearch

Elasticsearch 是一个分布式、RESTful 风格的搜索和数据分析引擎，能够解决不断涌现出的各种用例。同时也一个高度可扩展的开源全文本搜索和分析引擎。可以快速，近乎实时地存储，搜索和分析大量数据。它通常用作支持具有`复杂搜索功能和要求的应用程序的基础引擎/技术`。

* 架构图

![image-20200723191658881](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200723191700.png)

* 特性
    Elasticsearch是基于Lucene开发的分布式搜索框架。
    * 分布式索引、搜索
    * 索引自动分片、负载均衡
    * 自动发现机器、组建集群
    * 支持 Restful 风格接口
    * 配置简单

* 组成

![image-20200723192215923](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200723192217.png)

1. `集群`
2. `索引-Index` 类似 数据库-Database
    索引是Elasticsearch存放数据的地方，可以理解为关系型数据库中的一个数据库。事实上，我们的数据被存储和索引在分片(shards)中，索引只是一个把一个或多个分片分组在一起的逻辑空间。然而，这只是一些内部细节——我们的程序完全不用关心分片。对于我们的程序而言，文档存储在索引(index)中。剩下的细节由Elasticsearch关心既可。（索引的名字必须是全部小写，不能以下划线开头，不能包含逗号）
3. `类型-Type` 类似 数据库中的表-Table
    类型用于区分同一个索引下不同的数据类型,相当于关系型数据库中的表。在Elasticsearch中，我们使用相同
    类型(type)的文档表示相同的“事物”，因为他们的数据结构也是相同的。每个类型(type)都有自己的映射(mapping)或者结构定义，就像传统数据库表中的列一样。所有类型下的文档被存储在同一个索引下，但是类型的映射(mapping)会告诉Elasticsearch不同的文档如何被索引。
    es 6.0 开始不推荐一个index下多个type的模式，在 7.0 中完全移除。在 7.0 的index下是无法创建多个
    type
4. `文档-Document` 类似 表中的行级数据
    文档是Elasticsearch中存储的实体，类比关系型数据库，每个文档相当于数据库表中的一行数据。 在Elasticsearch中，文档(document)这个术语有着特殊含义。它特指最顶层结构或者根对象(root object)序列化成的JSON数据（以唯一ID标识并存储于Elasticsearch中）。
5. `字段-Field` 类似 数据库表中的列名。

* 作用
    1. 实现海量数据的存储 支持PB级别
    2. 快速搜索 性能高（倒排索引）
    3. 对海量数据进行分析  



### 2. 安装

Linux 安装 / Linux 在 Docker 中安装。

**步骤**：

```sh
#1.下载镜像
docker pull Elasticsearch:7.6.1

#2.创建并运行
docker run --name es9200 -p 9200:9200 -d Elasticsearch:7.6.1
#以低内存方式启动
docker run -e ES_JAVA_OPTS="-Xms256m -Xmx256m" -d -p 9200:9200 --name es elasticsearch:7.6.1

#3.访问测试
http://服务器IP:9200/
```

> Elasticsearch 对内存的要求较高，一般最低 8G 起步。

![image-20200723192607784](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200723192608.png)

**可视化**：

```sh
谷歌浏览器安装 ES-Head 插件，实现可视化ES
1.下载插件
2.打开谷歌浏览器
设置 --> 扩展程序 --> 启动开发者模式
3.解压
crx 后缀名改为zip，再解压，删除内部文件夹：_metadata
浏览器 --> 设置 --> 扩展程序 --> 加载已解压的扩展程序
```



> * `无需8G即可在CentOS虚拟机中安装启动ES：`
>
> ```sh
> #拉取镜像
> docker pull elasticsearch:7.6.1
> #修改启动参数
> find / -name "jvm.options"
> 找到文件修改 -Xms256m -Xmx256m 即可
> #创建一个网络节点
> docker network create esnet
> #运行es
> docker run -d --name es -p 9200:9200 -p 9300:9300 --network esnet -e "discovery.type=single-node" 镜像ID
> #查看启动状态
> docker ps
> #本地测试
> curl 127.0.0.1:9200
> #云服务器测试 - 需安全组开放9200端口
> 云服务器IP:9200
> ```
>
> 参考资料：https://www.cnblogs.com/powerbear/p/11298135.html
>
> ![image-20200809133149181](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200809133151.png)



### 3. 使用

Elasticsearch存储数据，可以实现常用的CRUD，擅长搜索，Java使用ES有 2 种方式：

* 原生 `Transport`
* `Spring Data Elasticsearch`

#### 3.1 Transport

* 依赖

```xml
<!-- https://mvnrepository.com/artifact/org.elasticsearch.client/transport -->
<dependency>
    <groupId>org.elasticsearch.client</groupId>
    <artifactId>transport</artifactId>
    <version>7.6.1</version>
</dependency>
<!-- https://mvnrepository.com/artifact/org.elasticsearch.client/elasticsearch-rest-highlevel-client -->
<dependency>
    <groupId>org.elasticsearch.client</groupId>
    <artifactId>elasticsearch-rest-high-level-client</artifactId>
    <version>7.6.1</version>
</dependency>
```

* 实现

```java
public static void main(String[] args) throws IOException {
    //创建连接，完成客户端实例化对象 高级操作
    RestHighLevelClient client=new RestHighLevelClient(
        RestClient.builder(
        	new HttpHost("39.105.189.141",9200,"http")
        )
    );

    //新增或修改 id不存在：新增 id存在：修改
    Student stu01=new Student("2","小二",18);
    IndexResponse response=client.index(new IndexRequest("es2001")
            .id(stu01.getNo())
            .source(JSON.toJSONString(stu01), XContentType.JSON)
        ,RequestOptions.DEFAULT);
    System.err.println("操作----"+response.status().name());
    
    //新增或修改 id不存在：新增 id存在：修改
    Student stu02=new Student("22","小王吧",18);
    UpdateResponse response02=client.update(new UpdateRequest("es2001","2")
    		.doc(JSON.toJSONString(stu02),XContentType.JSON)
		,RequestOptions.DEFAULT);
    System.err.println("ssss----->"+response02.status().name());
    
    //删除
    DeleteResponse response03=client.delete(new
    DeleteRequest("es2001","2"),RequestOptions.DEFAULT);
    System.err.println("删除---->"+response03.status().name());
    
    //查询
    GetResponse response04=client.get(new
    GetRequest("es2001","22"),RequestOptions.DEFAULT);
    System.err.println("操作-----》"+response04.getSourceAsString());
    
    //关闭
    client.close();
}
```

* 条件查询 - IK分词

```java
public static void main(String[] args) throws IOException {
    //查询
    //创建连接，完成客户端实例化对象 高级操作
    RestHighLevelClient client=new RestHighLevelClient(
        RestClient.builder(
        	new HttpHost("39.105.189.141",9200,"http"))
    );

    //范围查询
    RangeQueryBuilder rangeQueryBuilder= QueryBuilders.rangeQuery("age").gt(10).lt(24);
    //精确查询
    TermQueryBuilder termQueryBuilder=QueryBuilders.termQuery("name","小二");
    //模糊查询
    WildcardQueryBuilder wildcardQueryBuilder=QueryBuilders.wildcardQuery("name","*z*");
    //布尔查询 条件拼接
    BoolQueryBuilder boolQueryBuilder=QueryBuilders.boolQuery();
    //boolQueryBuilder.must(rangeQueryBuilder).should(wildcardQueryBuilder);
    boolQueryBuilder.must(wildcardQueryBuilder);
    // boolQueryBuilder.must(); //必须的 同时满足 类似 and
    // boolQueryBuilder.should(); //应该的 类似 or
    // boolQueryBuilder.mustNot(); //不必须
    // boolQueryBuilder.filter(); //弥补must效率低下（查询的时候，需要进行评估打分，_score）
    SearchSourceBuilder sourceBuilder=new SearchSourceBuilder();
    //设置分页 和查询条件
    sourceBuilder.from(0).size(10).query(boolQueryBuilder);
    //执行查询
    SearchResponse response=client.search(new SearchRequest("es2001")
			.source(sourceBuilder)
		, RequestOptions.DEFAULT);
    //获取查询的结果集
    SearchHits searchHits=response.getHits();
    //遍历结果
    for(SearchHit sh : searchHits){
    	System.err.println(sh.getSourceAsString());
    } 
    //关闭
    client.close();
}
```

* 批处理 - 批量增/删/改

```java
public static void main(String[] args) throws IOException {
    //查询
    //创建连接，完成客户端实例化对象 高级操作
    RestHighLevelClient client=new RestHighLevelClient(
        RestClient.builder(
        	new HttpHost("39.105.189.141",9200,"http"))
    );
    
    BulkRequest request=new BulkRequest();
    for(int i=10;i<1000;i++){
        request.add(new IndexRequest("es2001")
            	.id(i+"")
            	.source(JSON.toJSONString(new Student(i+"", "测试-"+i, i/10))
        	,XContentType.JSON));
    }
    BulkResponse responses=client.bulk(request,RequestOptions.DEFAULT);
    System.err.println(responses.status().name());
    //关闭
    client.close();
}
```



#### 3.2 Spring Data Elasticsearch

Spring Data 框架，是Spring给出的一种操作各种数据源的框架,Spring Data的任务是为数据访问提供一个熟悉
且一致的，基于Spring的编程模型，同时仍保留基础数据存储的特殊特征。

* 支持对关系型数据库的操作，比如：Spring Data JPA、Spring Data JDBC
* 支持NO-SQL类型的数据库的操作，比如：Spring Data Redis、Spring Data Mongodb、Spring Data Hbase
* 支持全文检索引擎的操作，比如Spring Data Elasticsearch、Spring Data Solr等  

**Spring Data Elastcisearch** : 是Spring对ElasticSearch操作的封装，`ElasticsearchRestTemplate`。

* 依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
</dependency>
```

* 实现

```java
// entity 实体类
@Data
@Document(indexName = "job2001") //设置对应的索引信息
public class Job {
    @Id //标记是否为主键 唯一属性
    private String id;
    @Field //可以设置字段信息
    private String jno;
    private String jname;
    private String company;
    private String salary;
}

// dao 继承 ElasticsearchRepository<实体类泛型, 主键类型泛型>
public interface JobDao extends ElasticsearchRepository<Job,Integer> { }

// service
public interface JobService {
    R save(Job job);
    R queryAll();
    R queryPage(int p,int s);
}

// serviceImpl
@Service
public class JobServiceImpl implements JobService {
    @Autowired
    private JobDao dao;
    @Autowired
    private ElasticsearchRestTemplate restTemplate; //注入 ElasticsearchRestTemplate 高级操作
    // private ElasticsearchTemplate template; //注入低级操作
    
    @Override
    public R save(Job job) {
        if(dao.save(job) != null){
        	return R.ok(null);
        }else {
        	return R.failed("新增失败");
        }
    } 
    @Override
    public R queryAll() {
    	return R.ok(dao.findAll());
    } 
    @Override
    public R queryPage(int p, int s) {
    	return R.ok(dao.findAll(PageRequest.of(p-1, s, Sort.by(Sort.Order.asc("id")))));
    }
}

// controller
@RestController
public class JobController {
    @Autowired
    private JobService service;
    
    @GetMapping("/api/job/save.do")
    public R save(Job job){
    	return service.save(job);
    }
    
    @GetMapping("/api/job/all.do")
    public R all(){
    	return service.queryAll();
    } 
    
    @GetMapping("/api/job/page.do")
    public R page(int p,int s){
    	return service.queryPage(p, s);
    }
}
```

* 配置文件

```yaml
# application.yml
spring:
    elasticsearch:
        rest:
        	uris: ES服务器IP:9200
```

![image-20200723201032364](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200723201033.png)

* 测试

![image-20200723202022980](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200723202023.png)