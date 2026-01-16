---
title: 04-MongoDB使用Java API
date: 2022-08-14 10:45:26
index_img: https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220813214425.png
tags:
- 数据库
- NoSQL
- MongoDB
categories: 
- 05_数据库
- 05_MongoDB
---

![image-20220813214346098](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220813214347.png)



## MongoDB Driver

```xml
<!-- https://mvnrepository.com/artifact/org.mongodb/mongo-java-driver -->
<dependency>
    <groupId>org.mongodb</groupId>
    <artifactId>mongo-java-driver</artifactId>
    <version>3.12.6</version>
</dependency>
```



## 代码测试

例子请参考 [mongo-java-driver 例子  (opens new window)](http://mongodb.github.io/mongo-java-driver/3.12/driver/getting-started/quick-start/)

```java
    private static final String MONGO_HOST = "xxx.xxx.xxx.xxx";
    private static final Integer MONGO_PORT = 27017;
    private static final String MONGO_DB = "testdb";

    public static void main(String args[]) {
        try {
            // 连接到 mongodb 服务
            MongoClient mongoClient = new MongoClient(MONGO_HOST, MONGO_PORT);

            // 连接到数据库
            MongoDatabase mongoDatabase = mongoClient.getDatabase(MONGO_DB);
            System.out.println("Connect to database successfully");

            // 创建Collection
            mongoDatabase.createCollection("test");
            System.out.println("create collection");

            // 获取collection
            MongoCollection<Document> collection = mongoDatabase.getCollection("test");

            // 插入document
            Document doc = new Document("name", "MongoDB")
                    .append("type", "database")
                    .append("count", 1)
                    .append("info", new Document("x", 203).append("y", 102));
            collection.insertOne(doc);

            // 统计count
            System.out.println(collection.countDocuments());

            // query - first
            Document myDoc = collection.find().first();
            System.out.println(myDoc.toJson());

            // query - loop all
            MongoCursor<Document> cursor = collection.find().iterator();
            try {
                while (cursor.hasNext()) {
                    System.out.println(cursor.next().toJson());
                }
            } finally {
                cursor.close();
            }

        } catch (Exception e) {
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
        }
    }
```



## Spring Data 与 MongoDB

> 在初学使用者而言，常会分不清Spring-data-jpa, spring-data-mongo, springboot-data-mongo-starter以及mongo-driver之间的关联关系， 本节将带你理解它们之间的关系。

### Spring Data的层次结构

首先让我们回顾下Spring runtime体系：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260116212316093.png)

Spring Data是基于Spring runtime体系的：

> 下面这个图能够直观反映出它们之间的依赖关系，以及包中类之间的以来关系。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260116212327556.png)

### springboot-data-mongo层次结构

我们通过引入`springboot-data-mongo-starter`包来看它们之间的层次结构：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260116212344795.png)

## mongodb+Java用法

> 所以通过上面分析我们可以得到基于mongodb+Java的常见用法：

### 使用方式及依赖包的引入

- 引入`mongodb-driver`, 使用最原生的方式通过Java调用mongodb提供的Java driver;

- 引入

  ```
  spring-data-mongo
  ```

  自行配置使用spring data 提供的对MongoDB的封装

  - 使用`MongoTemplate` 的方式
  - 使用`MongoRespository` 的方式

- 引入`spring-data-mongo-starter`, 采用spring autoconfig机制自动装配，然后再使用`MongoTemplate`或者`MongoRespository`方式。

### 具体使用中文档的参考

[spring-data/mongodb 官方的参考文档  (opens new window)](https://docs.spring.io/spring-data/mongodb/docs/3.0.3.RELEASE/reference/html/#preface)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260116212400572.png)

### 一些案例的参考

#### 原生方式

- 前文我们展示的Java通过[mongodb-driver操作mongodb示例]()。
- [官方mongo-java-driver 例子  (opens new window)](http://mongodb.github.io/mongo-java-driver/3.12/driver/getting-started/quick-start/)

#### spring-data-mongo

- [官方spring-data-mongodb 例子  (opens new window)](https://spring.io/projects/spring-data-mongodb#samples)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260116212410345.png)

