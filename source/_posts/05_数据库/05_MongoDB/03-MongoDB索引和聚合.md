---
title: 03-MongoDB索引和聚合
date: 2022-08-14 10:08:56
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



## 聚合 - Aggregation Pipline

> 类似于将SQL中的group by + order by + left join  等操作管道化。

### 常规使用

- 图例理解

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260116212023549.png)

- 准备数据

```sh
> db.orders.insertMany( [
     { _id: 1, cust_id: "abc1", ord_date: ISODate("2012-11-02T17:04:11.102Z"), status: "A", amount: 50 },
     { _id: 2, cust_id: "xyz1", ord_date: ISODate("2013-10-01T17:04:11.102Z"), status: "A", amount: 100 },
     { _id: 3, cust_id: "xyz1", ord_date: ISODate("2013-10-12T17:04:11.102Z"), status: "D", amount: 25 },
     { _id: 4, cust_id: "xyz1", ord_date: ISODate("2013-10-11T17:04:11.102Z"), status: "D", amount: 125 },
     { _id: 5, cust_id: "abc1", ord_date: ISODate("2013-11-12T17:04:11.102Z"), status: "A", amount: 25 }
 ] );
{ "acknowledged" : true, "insertedIds" : [ 1, 2, 3, 4, 5 ] }
> db.orders.find({})
{ "_id" : 1, "cust_id" : "abc1", "ord_date" : ISODate("2012-11-02T17:04:11.102Z"), "status" : "A", "amount" : 50 }
{ "_id" : 2, "cust_id" : "xyz1", "ord_date" : ISODate("2013-10-01T17:04:11.102Z"), "status" : "A", "amount" : 100 }
{ "_id" : 3, "cust_id" : "xyz1", "ord_date" : ISODate("2013-10-12T17:04:11.102Z"), "status" : "D", "amount" : 25 }
{ "_id" : 4, "cust_id" : "xyz1", "ord_date" : ISODate("2013-10-11T17:04:11.102Z"), "status" : "D", "amount" : 125 }
{ "_id" : 5, "cust_id" : "abc1", "ord_date" : ISODate("2013-11-12T17:04:11.102Z"), "status" : "A", "amount" : 25 }
    
```



- 聚合操作

```sh
> db.orders.aggregate([
                      { $match: { status: "A" } },
                      { $group: { _id: "$cust_id", total: { $sum: "$amount" } } },
                      { $sort: { total: -1 } }
                    ])
{ "_id" : "xyz1", "total" : 100 }
{ "_id" : "abc1", "total" : 75 }
    
```



官网还有两个例子：

- [Aggregation with the Zip Code Data Set  (opens new window)](https://docs.mongodb.com/v3.6/tutorial/aggregation-zip-code-data-set/)
- [Aggregation with User Preference Data  (opens new window)](https://docs.mongodb.com/v3.6/tutorial/aggregation-with-user-preference-data/)

### Pipline操作

MongoDB的聚合管道（Pipline）将MongoDB文档在一个阶段（Stage）处理完毕后将结果传递给下一个阶段（Stage）处理。**阶段（Stage）操作是可以重复的**。

表达式：处理输入文档并输出。表达式是无状态的，只能用于计算当前聚合管道的文档，不能处理其它的文档。

这里我们介绍一下聚合框架中常用的几个Stages：

- `$project`：修改输入文档的结构。可以用来重命名、增加或删除域，也可以用于创建计算结果以及嵌套文档。
- `$match`：用于过滤数据，只输出符合条件的文档。$match使用MongoDB的标准查询操作。
- `$limit`：用来限制MongoDB聚合管道返回的文档数。
- `$skip`：在聚合管道中跳过指定数量的文档，并返回余下的文档。
- `$unwind`：将文档中的某一个数组类型字段拆分成多条，每条包含数组中的一个值。
- `$group`：将集合中的文档分组，可用于统计结果。
- `$sort`：将输入文档排序后输出。
- `$geoNear`：输出接近某一地理位置的有序文档。
- `$bucket`: 分组（分桶）计算。
- `$facet` : 多次分组计算。
- `$out`: 将结果集输出，必须是Pipline最后一个Stage。

举几个例子

- $project

```sh
> db.orders.aggregate(
     { $project : {
         _id : 0 , // 默认不显示_id
         cust_id : 1 ,
         status : 1
     }});
{ "cust_id" : "abc1", "status" : "A" }
{ "cust_id" : "xyz1", "status" : "A" }
{ "cust_id" : "xyz1", "status" : "D" }
{ "cust_id" : "xyz1", "status" : "D" }
{ "cust_id" : "abc1", "status" : "A" }

```



- $skip

```sh
 db.orders.aggregate(
     { $skip : 4 });
{ "_id" : 5, "cust_id" : "abc1", "ord_date" : ISODate("2013-11-12T17:04:11.102Z"), "status" : "A", "amount" : 25 }
    
```



- $unwind

```sh
> db.inventory2.insertOne({ "_id" : 1, "item" : "ABC1", sizes: [ "S", "M", "L"] })
{ "acknowledged" : true, "insertedId" : 1 }
> db.inventory2.aggregate( [ { $unwind : "$sizes" } ] )
{ "_id" : 1, "item" : "ABC1", "sizes" : "S" }
{ "_id" : 1, "item" : "ABC1", "sizes" : "M" }
{ "_id" : 1, "item" : "ABC1", "sizes" : "L" }
    
```



- $bucket

```sh
> db.artwork.insertMany([
 { "_id" : 1, "title" : "The Pillars of Society", "artist" : "Grosz", "year" : 1926,
     "price" : NumberDecimal("199.99") },
 { "_id" : 2, "title" : "Melancholy III", "artist" : "Munch", "year" : 1902,
     "price" : NumberDecimal("280.00") },
 { "_id" : 3, "title" : "Dancer", "artist" : "Miro", "year" : 1925,
     "price" : NumberDecimal("76.04") },
 { "_id" : 4, "title" : "The Great Wave off Kanagawa", "artist" : "Hokusai",
     "price" : NumberDecimal("167.30") },
 { "_id" : 5, "title" : "The Persistence of Memory", "artist" : "Dali", "year" : 1931,
     "price" : NumberDecimal("483.00") },
 { "_id" : 6, "title" : "Composition VII", "artist" : "Kandinsky", "year" : 1913,
     "price" : NumberDecimal("385.00") },
 { "_id" : 7, "title" : "The Scream", "artist" : "Munch", "year" : 1893 },
 { "_id" : 8, "title" : "Blue Flower", "artist" : "O'Keefe", "year" : 1918,
     "price" : NumberDecimal("118.42") }
 ])
{
        "acknowledged" : true,
        "insertedIds" : [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8
        ]
}
> db.artwork.find({})
{ "_id" : 1, "title" : "The Pillars of Society", "artist" : "Grosz", "year" : 1926, "price" : NumberDecimal("199.99") }
{ "_id" : 2, "title" : "Melancholy III", "artist" : "Munch", "year" : 1902, "price" : NumberDecimal("280.00") }
{ "_id" : 3, "title" : "Dancer", "artist" : "Miro", "year" : 1925, "price" : NumberDecimal("76.04") }
{ "_id" : 4, "title" : "The Great Wave off Kanagawa", "artist" : "Hokusai", "price" : NumberDecimal("167.30") }
{ "_id" : 5, "title" : "The Persistence of Memory", "artist" : "Dali", "year" : 1931, "price" : NumberDecimal("483.00") }
{ "_id" : 6, "title" : "Composition VII", "artist" : "Kandinsky", "year" : 1913, "price" : NumberDecimal("385.00") }
{ "_id" : 7, "title" : "The Scream", "artist" : "Munch", "year" : 1893 } // 注意这里没有price，聚合结果中为Others
{ "_id" : 8, "title" : "Blue Flower", "artist" : "O'Keefe", "year" : 1918, "price" : NumberDecimal("118.42") }
> db.artwork.aggregate( [
   {
     $bucket: {
       groupBy: "$price",
       boundaries: [ 0, 200, 400 ],
       default: "Other",
       output: {
         "count": { $sum: 1 },
         "titles" : { $push: "$title" }
       }
     }
   }
 ] )
{ "_id" : 0, "count" : 4, "titles" : [ "The Pillars of Society", "Dancer", "The Great Wave off Kanagawa", "Blue Flower" ] }
{ "_id" : 200, "count" : 2, "titles" : [ "Melancholy III", "Composition VII" ] }
{ "_id" : "Other", "count" : 2, "titles" : [ "The Persistence of Memory", "The Scream" ] }
    
```



- $bucket + $facet

> 非常常用！

```sh
db.artwork.aggregate( [
  {
    $facet: {
      "price": [
        {
          $bucket: {
              groupBy: "$price",
              boundaries: [ 0, 200, 400 ],
              default: "Other",
              output: {
                "count": { $sum: 1 },
                "artwork" : { $push: { "title": "$title", "price": "$price" } }
              }
          }
        }
      ],
      "year": [
        {
          $bucket: {
            groupBy: "$year",
            boundaries: [ 1890, 1910, 1920, 1940 ],
            default: "Unknown",
            output: {
              "count": { $sum: 1 },
              "artwork": { $push: { "title": "$title", "year": "$year" } }
            }
          }
        }
      ]
    }
  }
] )

// 输出
{
  "year" : [
    {
      "_id" : 1890,
      "count" : 2,
      "artwork" : [
        {
          "title" : "Melancholy III",
          "year" : 1902
        },
        {
          "title" : "The Scream",
          "year" : 1893
        }
      ]
    },
    {
      "_id" : 1910,
      "count" : 2,
      "artwork" : [
        {
          "title" : "Composition VII",
          "year" : 1913
        },
        {
          "title" : "Blue Flower",
          "year" : 1918
        }
      ]
    },
    {
      "_id" : 1920,
      "count" : 3,
      "artwork" : [
        {
          "title" : "The Pillars of Society",
          "year" : 1926
        },
        {
          "title" : "Dancer",
          "year" : 1925
        },
        {
          "title" : "The Persistence of Memory",
          "year" : 1931
        }
      ]
    },
    {
      // Includes the document without a year, e.g., _id: 4
      "_id" : "Unknown",
      "count" : 1,
      "artwork" : [
        {
          "title" : "The Great Wave off Kanagawa"
        }
      ]
    }
  ],
      "price" : [
    {
      "_id" : 0,
      "count" : 4,
      "artwork" : [
        {
          "title" : "The Pillars of Society",
          "price" : NumberDecimal("199.99")
        },
        {
          "title" : "Dancer",
          "price" : NumberDecimal("76.04")
        },
        {
          "title" : "The Great Wave off Kanagawa",
          "price" : NumberDecimal("167.30")
        },
        {
          "title" : "Blue Flower",
          "price" : NumberDecimal("118.42")
        }
      ]
    },
    {
      "_id" : 200,
      "count" : 2,
      "artwork" : [
        {
          "title" : "Melancholy III",
          "price" : NumberDecimal("280.00")
        },
        {
          "title" : "Composition VII",
          "price" : NumberDecimal("385.00")
        }
      ]
    },
    {
      // Includes the document without a price, e.g., _id: 7
      "_id" : "Other",
      "count" : 2,
      "artwork" : [
        {
          "title" : "The Persistence of Memory",
          "price" : NumberDecimal("483.00")
        },
        {
          "title" : "The Scream"
        }
      ]
    }
  ]
}

```



> 聚合操作使用的比较频繁，在实际的工作中可以参考[官方文档 - Aggregation Pipeline Stages  (opens new window)](https://docs.mongodb.com/v3.6/reference/operator/aggregation-pipeline/)。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260116212100037.png)

### Aggregation Options参数

> 举一个explain参数为例，更多的相关Options可以参考官方文档，[Aggregrate相关配置  (opens new window)](https://docs.mongodb.com/v3.6/reference/method/db.collection.aggregate/)

- explain

```sh
> db.orders.aggregate(
                      [
                        { $match: { status: "A" } },
                        { $group: { _id: "$cust_id", total: { $sum: "$amount" } } },
                        { $sort: { total: -1 } }
                      ],
                      {
                        explain: true
                      }
)
{
        "serverInfo" : {
                "host" : "localhost",
                "port" : 27017,
                "version" : "3.6.19",
                "gitVersion" : "41b289ff734a926e784d6ab42c3129f59f40d5b4"
        },
        "stages" : [
                {
                        "$cursor" : {
                                "query" : {
                                        "status" : "A"
                                },
                                "fields" : {
                                        "amount" : 1,
                                        "cust_id" : 1,
                                        "_id" : 0
                                },
                                "queryPlanner" : {
                                        "plannerVersion" : 1,
                                        "namespace" : "testdb.orders",
                                        "indexFilterSet" : false,
                                        "parsedQuery" : {
                                                "status" : {
                                                        "$eq" : "A"
                                                }
                                        },
                                        "winningPlan" : {
                                                "stage" : "COLLSCAN",
                                                "filter" : {
                                                        "status" : {
                                                                "$eq" : "A"
                                                        }
                                                },
                                                "direction" : "forward"
                                        },
                                        "rejectedPlans" : [ ]
                                }
                        }
                },
                {
                        "$group" : {
                                "_id" : "$cust_id",
                                "total" : {
                                        "$sum" : "$amount"
                                }
                        }
                },
                {
                        "$sort" : {
                                "sortKey" : {
                                        "total" : -1
                                }
                        }
                }
        ],
        "ok" : 1
}
    
```



## 聚合 - Map Reduce

- 图例理解

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260116212112247.png)

### 官网给了个例子

- 准备数据

```sh
{
     _id: ObjectId("50a8240b927d5d8b5891743c"),
     cust_id: "abc123",
     ord_date: new Date("Oct 04, 2012"),
     status: 'A',
     price: 25,
     items: [ { sku: "mmm", qty: 5, price: 2.5 },
              { sku: "nnn", qty: 5, price: 2.5 } ]
}
```



- 计算每个顾客总花费：

map

```sh
var mapFunction1 = function() {
                       emit(this.cust_id, this.price);
                   };
    
```



reduce

```sh
var reduceFunction1 = function(keyCustId, valuesPrices) {
                          return Array.sum(valuesPrices);
                      };

```



out

```sh
db.orders.mapReduce(
                     mapFunction1,
                     reduceFunction1,
                     { out: "map_reduce_example" }
                   )

```



- 计算每个订单中Items的均价

map

```sh
var mapFunction2 = function() {
                       for (var idx = 0; idx < this.items.length; idx++) {
                           var key = this.items[idx].sku;
                           var value = {
                                         count: 1,
                                         qty: this.items[idx].qty
                                       };
                           emit(key, value);
                       }
                    };
    
```



reduce

```sh
var reduceFunction2 = function(keySKU, countObjVals) {
                     reducedVal = { count: 0, qty: 0 };

                     for (var idx = 0; idx < countObjVals.length; idx++) {
                         reducedVal.count += countObjVals[idx].count;
                         reducedVal.qty += countObjVals[idx].qty;
                     }

                     return reducedVal;
                  };
    
```



finalize

```sh
var finalizeFunction2 = function (key, reducedVal) {

                       reducedVal.avg = reducedVal.qty/reducedVal.count;

                       return reducedVal;

                    };
    
```



## 索引

索引即为提升查询等的效率，默认是对_id进行索引的。

### 图例理解

以对users中score进行索引时查询的效果

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260116212127821.png)

### 索引的类型

对于索引，这里简单介绍下常用的类型，其它类型和例子可以参考[官网文档 - 索引  (opens new window)](https://docs.mongodb.com/v3.6/indexes/)

- 单一索引

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260116212138962.png)

- 复合索引

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260116212145914.png)

- 多键索引

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260116212156225.png)

### 对索引的操作

- 查看集合索引

```sh
db.col.getIndexes()
```



- 查看集合索引大小

```sh
db.col.totalIndexSize()
```



- 删除集合所有索引

```sh
db.col.dropIndexes()
```



- 删除集合指定索引

```sh
db.col.dropIndex("索引名称")
```