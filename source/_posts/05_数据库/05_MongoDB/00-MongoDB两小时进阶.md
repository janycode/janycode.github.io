---
title: 00-MongoDB两小时进阶
date: 2022-08-13 19:14:35
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



# 什么是MongoDB ?

MongoDB 是由C++语言编写的，是一个基于分布式文件存储的开源数据库系统。

在高负载的情况下，添加更多的节点，可以保证服务器性能。

MongoDB 旨在为WEB应用提供可扩展的高性能数据存储解决方案。

MongoDB 将数据存储为一个文档，数据结构由键值(key=>value)对组成。MongoDB 文档类似于 JSON 对象。字段值可以包含其他文档，数组及文档数组。

 

# 主要特点

- MongoDB的提供了一个面向文档存储，操作起来比较简单和容易。
- 你可以在MongoDB记录中设置任何属性的索引 (如：FirstName="Ning",Address="Beijing")来实现更快的排序。
- 你可以通过本地或者网络创建数据镜像，这使得MongoDB有更强的扩展性。
- 如果负载的增加（需要更多的存储空间和更强的处理能力） ，它可以分布在计算机网络中的其他节点上这就是所谓的分片。
- Mongo支持丰富的查询表达式。查询指令使用JSON形式的标记，可轻易查询文档中内嵌的对象及数组。
- MongoDb 使用update()命令可以实现替换完成的文档（数据）或者一些指定的数据字段 。
- Mongodb中的Map/reduce主要是用来对数据进行批量处理和聚合操作。
- Map和Reduce。Map函数调用emit(key,value)遍历集合中所有的记录，将key与value传给Reduce函数进行处理。
- Map函数和Reduce函数是使用Javascript编写的，并可以通过db.runCommand或mapreduce命令来执行MapReduce操作。
- GridFS是MongoDB中的一个内置功能，可以用于存放大量小文件。
- MongoDB允许在服务端执行脚本，可以用Javascript编写某个函数，直接在服务端执行，也可以把函数的定义存储在服务端，下次直接调用即可。
- MongoDB支持各种编程语言:RUBY，PYTHON，JAVA，C++，PHP，C#等多种语言。

 

# 下载安装配置启动连接

官网：https://www.mongodb.com/download-center#community

```bash
# 下载
curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.0.6.tgz
# 解压
tar -zxvf mongodb-linux-x86_64-3.0.6.tgz
# 将解压包拷贝到指定目录
mv  mongodb-linux-x86_64-3.0.6/ /usr/local/mongodb

##<mongodb-install-directory> 为Mongo的安装路径，如本文的 /usr/local/mongodb 
export PATH=<mongodb-install-directory>/bin:$PATH      
#创建数据库目录(启动指定--dbpath)
mkdir -p /data/db
```

## 配置文件

```bash
$ cat /usr/local/etc/mongod.conf 
systemLog:
  destination: file
  path: /usr/local/var/log/mongodb/mongo.log
  logAppend: true
storage:
  dbPath: /usr/local/var/mongodb
net:
  bindIp: 127.0.0.1
  port: 11811
$
```

## 启动

```bash
$ ./mongod 
$ ./mongod --dbpath=/data/db --rest
# 默认端口为：27017
# MongoDB 提供了简单的 HTTP 用户界面。 如果你想启用该功能，需要在启动的时候指定参数 --rest
# MongoDB 的 Web 界面访问端口比服务的端口多1000。如果你的MongoDB运行端口使用默认的27017，你可以在端口号为28017访问web用户界面，即地址为：http://localhost:28017
```

## 连接

```bash
$ sudo mongo
$ sudo mongo --port 11811
$ sudo mongo -u root -p pwd 127.0.0.1:11811/test
```

 

# 安全验证

## 创建管理员

```bash
> use admin
switched to db admin
> db
admin
> db.createUser({user:'suoning',pwd:'123456',roles:[{role:'userAdminAnyDatabase',db:'admin'}]})
Successfully added user: {
    "user" : "suoning",
    "roles" : [
        {
            "role" : "userAdminAnyDatabase",
            "db" : "admin"
        }
    ]
}
> exit
bye
```

## 修改配置文件

版本区别与更多配置：https://docs.mongodb.com/manual/administration/configuration/

```bash
$ cat /usr/local/etc/mongod.conf 
systemLog:
  destination: file
  path: /usr/local/var/log/mongodb/mongo.log
  logAppend: true
storage:
  dbPath: /usr/local/var/mongodb
net:
  bindIp: 127.0.0.1
  port: 11811
security:
   authorization: enabled
$ 
```

## 重启验证

```bash
> show dbs
2017-04-25T08:41:50.126+0800 E QUERY    [thread1] Error: listDatabases failed:{
    "ok" : 0,
    "errmsg" : "not authorized on admin to execute command { listDatabases: 1.0 }",
    "code" : 13,
    "codeName" : "Unauthorized"
} :
_getErrorWithCode@src/mongo/shell/utils.js:25:13
Mongo.prototype.getDBs@src/mongo/shell/mongo.js:62:1
shellHelper.show@src/mongo/shell/utils.js:761:19
shellHelper@src/mongo/shell/utils.js:651:15
@(shellhelp2):1:1
> 
> use admin
switched to db admin
> db.auth('suoning','123456')
1
> show dbs
admin  0.000GB
local  0.000GB
>
```

## 创建普通用户

```bash
> use admin
switched to db admin
> db.auth('suoning','123456')
1
> 
> use mydb
switched to db mydb
> db.createUser({user:'nick',pwd:'123456',roles:[{role:'readWrite',db:'mydb'}]})
Successfully added user: {
    "user" : "nick",
    "roles" : [
        {
            "role" : "readWrite",
            "db" : "mydb"
        }
    ]
}
> 
> db.auth('nick','123456')
1
>
```

## 删除用户

```bash
> db.dropUser("nick")
true
```

## 查看所有存在用户

```bash
> use admin
switched to db admin
> db.auth('suoning','123456')
1
> db.system.users.find()
{ "_id" : "admin.suoning", "user" : "suoning", "db" : "admin", "credentials" : { "SCRAM-SHA-1" : { "iterationCount" : 10000, "salt" : "XXW+MD0TENKSkzk0bM2EGw==", "storedKey" : "iIuv5DpGOksvaFpFOSnAIRSwh+w=", "serverKey" : "ZGA7/Lkjv+RJX3fNANQN9hgBUwY=" } }, "roles" : [ { "role" : "userAdminAnyDatabase", "db" : "admin" } ] }
{ "_id" : "mydb.nick", "user" : "nick", "db" : "mydb", "credentials" : { "SCRAM-SHA-1" : { "iterationCount" : 10000, "salt" : "j71pQs/OR1eRtRa1IT80+w==", "storedKey" : "5hkHmU+FwdENDgGjV0wIbmTAOrQ=", "serverKey" : "Qs+c0gfGNUpwD/ZKgeOackzwNxI=" } }, "roles" : [ { "role" : "readWrite", "db" : "mydb" } ] }
> 
```

 

## 总结：

- 创建超级管理员需要未开启权限模式的情况下执行;
- 如果 MongoDB 开启了权限模式，并且某一个数据库没有任何用户时，在不验证权限的情况下，可以创建一个用户，当继续创建第二个用户时，会返回错误，若想继续创建用户则必须登录;
- 用户只能在用户所在数据库登录，管理员需要通过admin认证后才能管理其他数据库。

 

# 数据库角色

1. 内建的角色
2. 数据库用户角色：read、readWrite;
3. 数据库管理角色：dbAdmin、dbOwner、userAdmin；
4. 集群管理角色：clusterAdmin、clusterManager、clusterMonitor、hostManager；
5. 备份恢复角色：backup、restore；
6. 所有数据库角色：readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、dbAdminAnyDatabase
7. 超级用户角色：root // 这里还有几个角色间接或直接提供了系统超级用户的访问（dbOwner 、userAdmin、userAdminAnyDatabase）
8. 内部角色：__system

```bash
角色说明：
Read：允许用户读取指定数据库
readWrite：允许用户读写指定数据库
dbAdmin：允许用户在指定数据库中执行管理函数，如索引创建、删除，查看统计或访问system.profile
userAdmin：允许用户向system.users集合写入，可以找指定数据库里创建、删除和管理用户
clusterAdmin：只在admin数据库中可用，赋予用户所有分片和复制集相关函数的管理权限。
readAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读权限
readWriteAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读写权限
userAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的userAdmin权限
dbAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的dbAdmin权限。
root：只在admin数据库中可用。超级账号，超级权限
```

 

# 数据类型

| 数据类型           | 描述                                                         |
| ------------------ | ------------------------------------------------------------ |
| String             | 字符串。存储数据常用的数据类型。在 MongoDB 中，UTF-8 编码的字符串才是合法的。 |
| Integer            | 整型数值。用于存储数值。根据你所采用的服务器，可分为 32 位或 64 位。 |
| Boolean            | 布尔值。用于存储布尔值（真/假）。                            |
| Double             | 双精度浮点值。用于存储浮点值。                               |
| Min/Max keys       | 将一个值与 BSON（二进制的 JSON）元素的最低值和最高值相对比。 |
| Arrays             | 用于将数组或列表或多个值存储为一个键。                       |
| Timestamp          | 时间戳。记录文档修改或添加的具体时间。                       |
| Object             | 用于内嵌文档。                                               |
| Null               | 用于创建空值。                                               |
| Symbol             | 符号。该数据类型基本上等同于字符串类型，但不同的是，它一般用于采用特殊符号类型的语言。 |
| Date               | 日期时间。用 UNIX 时间格式来存储当前日期或时间。你可以指定自己的日期时间：创建 Date 对象，传入年月日信息。 |
| Object ID          | 对象 ID。用于创建文档的 ID。                                 |
| Binary Data        | 二进制数据。用于存储二进制数据。                             |
| Code               | 代码类型。用于在文档中存储 JavaScript 代码。                 |
| Regular expression | 正则表达式类型。用于存储正则表达式。                         |

 

# 库与表操作

## 创建库与表

```bash
> show dbs
admin  0.000GB
local  0.000GB
> 
> use mydb
switched to db mydb
> db
mydb
> 
> db.mydb.insert({"name":"Nick","age":18})
WriteResult({ "nInserted" : 1 })
> 
> show dbs
admin  0.000GB
local  0.000GB
mydb   0.000GB
>
> show tables;
mydb
>
```

##  删除库

```bash
> db.dropUser("nick")
true
> 
> db.createUser({user:'nick',pwd:'123456',roles:[{role:'dbAdmin',db:'mydb'}]})
Successfully added user: {
    "user" : "nick",
    "roles" : [
        {
            "role" : "dbAdmin",
            "db" : "mydb"
        }
    ]
}
> 
> db.auth("nick","123456")
1
> 
> use mydb
switched to db mydb
> db
mydb
> 
> show dbs;
admin  0.000GB
local  0.000GB
mydb   0.000GB
>
> db.dropDatabase()
{ "dropped" : "mydb", "ok" : 1 }
> 
> show dbs;
admin  0.000GB
local  0.000GB
> 
```

##  删除表

```bash
> db;
mydb
> show tables;
mydb
> 
> db.mydb.drop();
true
> show tables;
> 
```

 

# 文档操作

## 增

使用 insert() 或 save() 方法向集合中插入文档，语法如下：

```bash
db.COLLECTION_NAME.insert(document)
```

创建读写用户：

```bash
> db.createUser({user:'ning',pwd:'123456',roles:[{role:'readWrite',db:'mydb'}]})
Successfully added user: {
    "user" : "ning",
    "roles" : [
        {
            "role" : "readWrite",
            "db" : "mydb"
        }
    ]
}
> 
> db.auth('ning','123456')
1
>
```

插入数据：

```bash
> 
> db.user.insert({'name':'nick','age':18,'girlfriend':['jenny','coco','julia']})
WriteResult({ "nInserted" : 1 })
> 
> show tables
user
>
> 
> vb = ({'sex':'man'});
{ "sex" : "man" }
> db.user.insert(vb);
WriteResult({ "nInserted" : 1 })
>
```

 插入文档你也可以使用 db.col.save(document) 命令。如果不指定 _id 字段 save() 方法类似于 insert() 方法。如果指定 _id 字段，则会更新该 _id 的数据。

 

## 删

remove() 方法的基本语法格式如下所示：

```bash
db.collection.remove(
   <query>,
   <justOne>
)

# MongoDB 是 2.6 版本以后的，语法格式如下：
db.collection.remove(
   <query>,
   {
     justOne: <boolean>,
     writeConcern: <document>
   }
)

# 参数说明：
query :（可选）删除的文档的条件。
justOne : （可选）如果设为 true 或 1，则只删除一个文档。
writeConcern :（可选）抛出异常的级别。
```

删除数据：

```bash
> db.user.find()
{ "_id" : ObjectId("58fef7d55b9ea92ab29fbd4b"), "name" : "nick", "age" : 18, "girlfriend" : [ "jenny", "coco", "julia" ] }
{ "_id" : ObjectId("58fef9165b9ea92ab29fbd4c"), "sex" : "man" }
> 
> db.user.remove({'sex':'man'})
WriteResult({ "nRemoved" : 1 })
> 
> db.user.find()
{ "_id" : ObjectId("58fef7d55b9ea92ab29fbd4b"), "name" : "nick", "age" : 18, "girlfriend" : [ "jenny", "coco", "julia" ] }
>
```

删除第一条找到的记录可以设置 justOne 为 1：

```bash
>db.COLLECTION_NAME.remove(DELETION_CRITERIA,1)
```

删除所有数据：

```bash
>db.col.remove({})
>db.col.find()
>
```

 

## 改

```bash
# 只更新一条
> db.user.find()
{ "_id" : ObjectId("58fef7d55b9ea92ab29fbd4b"), "name" : "nick", "age" : 21, "girlfriend" : [ "jenny", "coco", "julia" ] }
{ "_id" : ObjectId("58feffe55b9ea92ab29fbd4d"), "name" : "jenny", "age" : 21 }
> 
> db.user.update({'age':21},{$set:{'age':22}})
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
> 
> db.user.find()
{ "_id" : ObjectId("58fef7d55b9ea92ab29fbd4b"), "name" : "nick", "age" : 22, "girlfriend" : [ "jenny", "coco", "julia" ] }
{ "_id" : ObjectId("58feffe55b9ea92ab29fbd4d"), "name" : "jenny", "age" : 21 }
> 

# 更新多条
> db.user.find()
{ "_id" : ObjectId("58fef7d55b9ea92ab29fbd4b"), "name" : "nick", "age" : 21, "girlfriend" : [ "jenny", "coco", "julia" ] }
{ "_id" : ObjectId("58feffe55b9ea92ab29fbd4d"), "name" : "jenny", "age" : 21 }
> 
> db.user.update({'age':21},{$set:{'age':22}},{multi:true})
WriteResult({ "nMatched" : 2, "nUpserted" : 0, "nModified" : 2 })
> 
> db.user.find()
{ "_id" : ObjectId("58fef7d55b9ea92ab29fbd4b"), "name" : "nick", "age" : 22, "girlfriend" : [ "jenny", "coco", "julia" ] }
{ "_id" : ObjectId("58feffe55b9ea92ab29fbd4d"), "name" : "jenny", "age" : 22 }
>
```

save() 方法通过传入的文档来替换已有文档。语法格式如下：

```bash
db.collection.save(
   <document>,
   {
     writeConcern: <document>
   }
)

参数说明：
document : 文档数据。
writeConcern :可选，抛出异常的级别。
> db.user.find()
{ "_id" : ObjectId("58fef7d55b9ea92ab29fbd4b"), "name" : "nick", "age" : 22, "girlfriend" : [ "jenny", "coco", "julia" ] }
> 
> db.user.save({ "_id" : ObjectId("58fef7d55b9ea92ab29fbd4b"), "name" : "nick", "age" : 18, "girlfriend" : [ "jenny", "julia" ] })
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
> 
> db.user.find().pretty()
{
    "_id" : ObjectId("58fef7d55b9ea92ab29fbd4b"),
    "name" : "nick",
    "age" : 18,
    "girlfriend" : [
        "jenny",
        "julia"
    ]
}
>
```

 

## 查

查询数据的语法格式如下：

```bash
db.mydb.find(query, projection)

query ：可选，使用查询操作符指定查询条件
projection ：可选，使用投影操作符指定返回的键。查询时返回文档中所有键值， 只需省略该参数即可（默认省略）。
pretty() 方法以格式化的方式来显示所有文档。
>db.mydb.find().pretty()
```

### 大于小于：

| 操作       | 格式                     | 范例                                        | RDBMS中的类似语句     |
| ---------- | ------------------------ | ------------------------------------------- | --------------------- |
| 等于       | `{<key>:<value>`}        | `db.col.find({"name":"nick"}).pretty()`     | `where name = 'nick'` |
| 小于       | `{<key>:{$lt:<value>}}`  | `db.col.find({"likes":{$lt:50}}).pretty()`  | `where likes < 50`    |
| 小于或等于 | `{<key>:{$lte:<value>}}` | `db.col.find({"likes":{$lte:50}}).pretty()` | `where likes <= 50`   |
| 大于       | `{<key>:{$gt:<value>}}`  | `db.col.find({"likes":{$gt:50}}).pretty()`  | `where likes > 50`    |
| 大于或等于 | `{<key>:{$gte:<value>}}` | `db.col.find({"likes":{$gte:50}}).pretty()` | `where likes >= 50`   |
| 不等于     | `{<key>:{$ne:<value>}}`  | `db.col.find({"likes":{$ne:50}}).pretty()`  | `where likes != 50`   |

获取"col"集合中 "likes" 大于100，小于 200 的数据，你可以使用以下命令：

```bash
db.col.find({likes : {$lt :200, $gt : 100}}) 
```

###  and or:

```bash
and:
    >db.col.find({key1:value1, key2:value2}).pretty()
or:
    >db.col.find(
       {
          $or: [
             {key1: value1}, {key2:value2}
          ]
       }
    ).pretty()
```

### Limit、Skip

limit()方法基本语法如下所示：

```bash
>db.COLLECTION_NAME.find().limit(NUMBER)
```

skip() 方法脚本语法格式如下：

使用skip()方法来跳过指定数量的数据，skip方法接受一个数字参数作为跳过的记录条数，默认为0。

```bash
>db.COLLECTION_NAME.find().limit(NUMBER).skip(NUMBER)
```

###  sort

sort()方法对数据进行排序，sort()方法可以通过参数指定排序的字段，并使用 1 和 -1 来指定排序的方式，其中 1 为升序排列，而-1是用于降序排列。

```bash
>db.COLLECTION_NAME.find().sort({KEY:1})
```

### 操作符 $type

获取 "col" 集合中 title 为 String 的数据:

```bash
db.col.find({"title" : {$type : 2}})
```

对应匹配类型：

| **类型**                | **数字** | **备注**         |
| ----------------------- | -------- | ---------------- |
| Double                  | 1        |                  |
| String                  | 2        |                  |
| Object                  | 3        |                  |
| Array                   | 4        |                  |
| Binary data             | 5        |                  |
| Undefined               | 6        | 已废弃。         |
| Object id               | 7        |                  |
| Boolean                 | 8        |                  |
| Date                    | 9        |                  |
| Null                    | 10       |                  |
| Regular Expression      | 11       |                  |
| JavaScript              | 13       |                  |
| Symbol                  | 14       |                  |
| JavaScript (with scope) | 15       |                  |
| 32-bit integer          | 16       |                  |
| Timestamp               | 17       |                  |
| 64-bit integer          | 18       |                  |
| Min key                 | 255      | Query with `-1`. |
| Max key                 | 127      |                  |

 

# 索引

使用 `ensureIndex()` 方法来创建索引，语法如下：

```bash
>db.COLLECTION_NAME.ensureIndex({KEY:1})

语法中 Key 值为你要创建的索引字段，1为指定按升序创建索引，如果你想按降序来创建索引指定为-1即可
复合索引
db.col.ensureIndex({"title":1,"description":-1})
后台执行
通过在创建索引时加background:true 的选项，让创建工作在后台执行
db.values.ensureIndex({open: 1, close: 1}, {background: true})
```

ensureIndex() 接收可选参数，可选参数列表如下：

| Parameter          | Type          | Description                                                  |
| ------------------ | ------------- | ------------------------------------------------------------ |
| background         | Boolean       | 建索引过程会阻塞其它数据库操作，background可指定以后台方式创建索引，即增加 "background" 可选参数。 "background" 默认值为**false**。 |
| unique             | Boolean       | 建立的索引是否唯一。指定为true创建唯一索引。默认值为**false**. |
| name               | string        | 索引的名称。如果未指定，MongoDB的通过连接索引的字段名和排序顺序生成一个索引名称。 |
| dropDups           | Boolean       | 在建立唯一索引时是否删除重复记录,指定 true 创建唯一索引。默认值为 **false**. |
| sparse             | Boolean       | 对文档中不存在的字段数据不启用索引；这个参数需要特别注意，如果设置为true的话，在索引字段中不会查询出不包含对应字段的文档.。默认值为 **false**. |
| expireAfterSeconds | integer       | 指定一个以秒为单位的数值，完成 TTL设定，设定集合的生存时间。 |
| v                  | index version | 索引的版本号。默认的索引版本取决于mongod创建索引时运行的版本。 |
| weights            | document      | 索引权重值，数值在 1 到 99,999 之间，表示该索引相对于其他索引字段的得分权重。 |
| default_language   | string        | 对于文本索引，该参数决定了停用词及词干和词器的规则的列表。 默认为英语 |
| language_override  | string        | 对于文本索引，该参数指定了包含在文档中的字段名，语言覆盖默认的language，默认值为 language. |

索引不能被以下的查询使用：

- 正则表达式及非操作符，如 $nin, $not, 等。
- 算术运算符，如 $mod, 等。
- $where 子句

## 最大范围

- 集合中索引不能超过64个
- 索引名的长度不能超过125个字符 
- 一个复合索引最多可以有31个字段
- 现有的索引字段的值超过索引键的限制，MongoDB中不会创建索引。

 

# 聚合

聚合(aggregate)主要用于处理数据(诸如统计平均值,求和等)，并返回计算后的数据结果。

聚合的方法使用 `aggregate()` 方法，基本语法格式如下所示：

```bash
>db.COLLECTION_NAME.aggregate(AGGREGATE_OPERATION)
> db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$sum : 1}}}])

以上实例类似sql语句： select by_user, count(*) from mycol group by by_user
我们通过字段by_user字段对数据进行分组，并计算by_user字段相同值的总和。
```

| 表达式    | 描述                                           | 实例                                                         |
| --------- | ---------------------------------------------- | ------------------------------------------------------------ |
| $sum      | 计算总和。                                     | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$sum : "$likes"}}}]) |
| $avg      | 计算平均值                                     | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$avg : "$likes"}}}]) |
| $min      | 获取集合中所有文档对应值得最小值。             | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$min : "$likes"}}}]) |
| $max      | 获取集合中所有文档对应值得最大值。             | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$max : "$likes"}}}]) |
| $push     | 在结果文档中插入值到一个数组中。               | db.mycol.aggregate([{$group : {_id : "$by_user", url : {$push: "$url"}}}]) |
| $addToSet | 在结果文档中插入值到一个数组中，但不创建副本。 | db.mycol.aggregate([{$group : {_id : "$by_user", url : {$addToSet : "$url"}}}]) |
| $first    | 根据资源文档的排序获取第一个文档数据。         | db.mycol.aggregate([{$group : {_id : "$by_user", first_url : {$first : "$url"}}}]) |
| $last     | 根据资源文档的排序获取最后一个文档数据         | db.mycol.aggregate([{$group : {_id : "$by_user", last_url : {$last : "$url"}}}]) |

### 管道

MongoDB的聚合管道将MongoDB文档在一个管道处理完毕后将结果传递给下一个管道处理。管道操作是可以重复的。

表达式：处理输入文档并输出。表达式是无状态的，只能用于计算当前聚合管道的文档，不能处理其它的文档。

- $project：修改输入文档的结构。可以用来重命名、增加或删除域，也可以用于创建计算结果以及嵌套文档。
- $match：用于过滤数据，只输出符合条件的文档。$match使用MongoDB的标准查询操作。
- $limit：用来限制MongoDB聚合管道返回的文档数。
- $skip：在聚合管道中跳过指定数量的文档，并返回余下的文档。
- $unwind：将文档中的某一个数组类型字段拆分成多条，每条包含数组中的一个值。
- $group：将集合中的文档分组，可用于统计结果。
- $sort：将输入文档排序后输出。
- $geoNear：输出接近某一地理位置的有序文档。

#### 管道操作符实例

1、$project实例

```bash
db.article.aggregate(
    { $project : {
        title : 1 ,
        author : 1 ,
    }}
 );
这样的话结果中就只还有_id,tilte和author三个字段了，默认情况下_id字段是被包含的，如果要想不包含_id话可以这样:
db.article.aggregate(
    { $project : {
        _id : 0 ,
        title : 1 ,
        author : 1
    }});
```

2.$match实例

```bash
db.articles.aggregate( [
                        { $match : { score : { $gt : 70, $lte : 90 } } },
                        { $group: { _id: null, count: { $sum: 1 } } }
                       ] );
$match用于获取分数大于70小于或等于90记录，然后将符合条件的记录送到下一阶段$group管道操作符进行处理。
```

3.$skip实例

```bash
db.article.aggregate(
    { $skip : 5 });
经过$skip管道操作符处理后，前五个文档被"过滤"掉。
```

 

# 查询分析

## explain()

mongo执行计划分析，[详细点此处](http://www.mongoing.com/eshu_explain1)。

```
> db.user.find({"name":"nick"}).explain();
> db.user.find({"name":"nick"}).explain(true);
```

关键参数详细：

```bash
executionStats.executionSuccess
是否执行成功

executionStats.nReturned
查询的返回条数

executionStats.executionTimeMillis
整体执行时间

executionStats.totalKeysExamined
索引扫描次数

executionStats.totalDocsExamined
document扫描次数
```

 

## hint()

使用 hint 来强制 MongoDB 使用一个指定的索引。

这种方法某些情形下会提升性能。 一个有索引的 collection 并且执行一个多字段的查询(一些字段已经索引了)。

```bash
如下查询指定了使用 naem 和 age 索引字段来查询：
> db.user.find({"name":"nick","age":18}).hint({"name":1,"age":1});
```

 