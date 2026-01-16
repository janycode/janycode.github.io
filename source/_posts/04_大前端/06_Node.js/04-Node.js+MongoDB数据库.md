---
title: 04-Node.js+MongoDB数据库
date: 2022-5-22 21:36:21
tags:
- Vue
- Node
- Node.js
- MongoDB
categories: 
- 04_大前端
- 06_Node.js
---

![image-20260113102144733](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260113102145988.png)

参考：

* Node.js 官网：https://nodejs.org/zh-cn
* Node.js 下载地址：https://nodejs.cn/download/
* Node.js 官方文档：http://nodejs.cn/learn/how-much-javascript-do-you-need-to-know-to-use-nodejs
* Node.js 历史版本：https://registry.npmmirror.com/binary.html?path=node/



## 1. 关系型与非关系型数据库

### 关系型数据库

1. 表与表之间可以建立关联关系
2. sql语句增删改查操作
3. 保持事务的一致性、事务机制（回滚）：mysql、oracle、sqlserver、db2

### 非关系型数据库

1. no sql，库表之间没有关联关系，not only sql
2. 轻量、高效、自由(每行数据字段可以不一致)：mongodb、redis、hbase

### 为什么喜欢 mongodb？

* 由于mongodb独特的数据处理方式，可以将`热点数据加载到内存，因此会非常快`（当然也会非常消耗内存）。

* 同时由于采用了 `BSON` (二进制的JSON)的方式存储数据，故对`JSON格式数据非常友好`，以及友好的表结构修改性。

* `文档式的存储方式`，数据友好可见。

* 数据库的`分片集群负载`具有非常好的`扩展性`，以及非常不错的自动故障转移。

| SQL术语     | MongoDB术语  | 说明                                         |
| ----------- | ------------ | -------------------------------------------- |
| database    | database     | 数据库                                       |
| table       | `collection` | 数据库`表`/`集合`                            |
| row         | `document`   | 数据记录`行`/`文档`                          |
| column      | `field`      | 数据`字段`/`域`                              |
| index       | index        | 索引                                         |
| table joins | -            | 表连接，mongodb不支持                        |
| primary key | primary key  | 主键，mongodb自动将 `_id` 字段设置为**主键** |



## 2. MongoDB 安装

MongoDB 官网下载链接：https://www.mongodb.com/try/download/community

MongoDB 官网安装教程：https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

MongoDB 3.6.11版本，官网下载：（太旧）

* 绿色版（.zip）：https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-3.6.11.zip

* 安装版（.msi）：https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-3.6.11-signed.msi

MongoDB 5.0.32 版本，下载地址：（主流版本）

* 绿色版（.zip）：https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-5.0.32.zip

> 绿色版不需要安装，随用随启动即可。



## 3. MongoDB 启动

（1）windows

```powershell
#启动服务端，并指定数据库文件存储位置
mongod --dbpath=d:/data/db
#启动客户端
mongo
```

eg: mongo 绿色版安装目录 `D:\Java\mongodb`， 在 D:\Java\mongodb\bin 下启动 powershell：

```powershell
> .\mongod.exe --dbpath=E:\work\webProjects\nodejs\03-MongoDB\db
```



 （2）mac

```sh
#启动服务端，并指定数据库文件存储位置
mongod --config /usr/local/etc/mongod.conf
#启动客户端
mongo
```



## 4. MongoDB 命令行操作

![image-20260116165606353](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260116165607675.png)

![image-20260116165821799](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260116165823043.png)

![image-20260116170031541](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260116170032931.png)

注意事项：

* use 创建数据库时，db 命令可以看到，但是 show dbs 命令看不到，是因为里面没有任何数据，有数据即可查询到。



### 基本命令

```powershell
> show dbs                       #显示所有的数据库
> use jerry_test                 #创建/使用数据库
> db                             #查看当前使用的数据库
> db.createCollection("users")   #在当前使用的数据库中创建集合 users (也就是 表)
> show dbs                       #显示所有的数据库，即可看到 jerry_test
> db.createCollection("news")    #在创建一个 news 表
{ "ok" : 1 }
> db.getCollectionNames()        #显示所有的表
[ "news", "users" ]
> db.news.drop()                 #删除 news 表
true
> db.users.insertOne({username:"jerry", age:22})     #插入一条数据，插入多条 [{}, {}, {}]
WriteResult({ "nInserted" : 1 })
> db.users.find()                               #查询 users 表里的数据
{ "_id" : ObjectId("6969ff5194216e09d8268614"), "username" : "jerry", "age" : 22 }
> db.users.insertMany([{username:"tom", age:100}, {username: "spike", age: 100}])
BulkWriteResult({..."nInserted" : 2,...})
> db.users.find()
{ "_id" : ObjectId("6969ff5194216e09d8268614"), "username" : "jerry", "age" : 22 }
{ "_id" : ObjectId("6969ffa494216e09d8268616"), "username" : "tom", "age" : 20 }
{ "_id" : ObjectId("6969ffa494216e09d8268617"), "username" : "spike", "age" : 18 }
{ "_id" : ObjectId("696a002e94216e09d8268619"), "username" : "tom", "age" : 100 }
{ "_id" : ObjectId("696a002e94216e09d826861a"), "username" : "spike", "age" : 100 }
> db.users.remove({age: 100})
WriteResult({ "nRemoved" : 2 })
> db.users.find()
{ "_id" : ObjectId("6969ff5194216e09d8268614"), "username" : "jerry", "age" : 22 }
{ "_id" : ObjectId("6969ffa494216e09d8268616"), "username" : "tom", "age" : 20 }
{ "_id" : ObjectId("6969ffa494216e09d8268617"), "username" : "spike", "age" : 18 }
```

### find() 查询

![image-20260116171537305](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260116171538514.png)

![image-20260116171553533](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260116171554658.png)

![image-20260116172818165](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260116172820291.png)

```powershell
> db.users.find()  #查询 users 表所有数据
> db.users.find({username: "jerry"})  # 查询 users 表中带条件的数据
> db.users.find().limit(2)   #查询 users 表中前2条数据
```



## 5. 可视化工具

使用 Navicat 或 Datagrip 或 Robomongo Robo3T adminMongo 均可。

* Navicat 无版本兼容问题。

* Datagrip 版本兼容验证，使用 mongodb 5.0.x 或 3.6.x 对应驱动版本 `1.18`：

![image-20260116174818988](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260116174827020.png)



## 6. Nodejs操作MongoDB

### 安装

安装：*npm i mongoose@6*

* 版本关联对应报错信息（node18.20+, mongodb3.6+）：MongooseServerSelectionError: Server at 127.0.0.1:27017 reports maximum wire `version 6`, but this version of the Node.js Driver requires at least 8 (MongoDB 4.2)

### 连接数据库

config/db.config.js - 添加数据库配置（独立维护在 `config` 目录）

```js
// 导入 mongodb 数据库支持库，需要安装依赖 npm i mongoose
const mongoose = require("mongoose")
// 连接数据库: 插入集合和数据时，数据库 jerry_project 会自动创建
mongoose.connect("mongodb://127.0.0.1:27017/jerry_project")
```

bin/www.js - 引入数据库

```js
var app = require('../app');
var debug = require('debug')('server:server');
var http = require('http');

// 引入数据库
require("../config/db.config")
```

model/UserModel.js - 添加数据模型（独立维护在 `model` 目录）

```js
const mongoose = require("mongoose")

const Schema = mongoose.Schema  // 模型字段和类型限定: new Schema(Xxx)
const UserType = {
    username: String,
    password: String,
    age: Number
}
const UserModel = mongoose.model("user", new Schema(UserType))  // 模型 user 将会对应 users 集合

module.exports = UserModel
```

views/users.ejs - **页面**模板引擎-用户模块

```html
<!DOCTYPE html>
<html>
<head>
  <title>
    <%= title %>
  </title>
  <link rel='stylesheet' href='/stylesheets/style.css' />
</head>

<body>
  <h1>mondogb增删改查</h1>
  <div>
    <div>用户名：<input type="text" id="username"></div>
    <div>密码：<input type="password" id="password"></div>
    <div>年龄：<input type="number" id="age"></div>
    <div><button id="register">注册</button></div>
  </div>
  <hr>
  <div>
    <button id="update">更新</button>
    <button id="delete">删除</button>
  </div>
  <hr>
  <table border="1px">
    <thead>
      <tr>
        <td>id</td>
        <td>用户名</td>
        <td>年龄</td>
      </tr>
    </thead>
    <tbody></tbody>
  </table>

  <script>
    var resigter = document.querySelector("#register")
    var updateBtn = document.querySelector("#update")
    var deleteBtn = document.querySelector("#delete")
    var username = document.querySelector("#username")
    var password = document.querySelector("#password")
    var age = document.querySelector("#age")
    // 请求新增
    // 请求更新
    // 请求删除
    // 请求列表
  </script>
</body>

</html>
```

router/users.js - 路由**接口**逻辑

```js
var express = require('express');
const UserModel = require('../model/UserModel');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// 新增
router.post('/user/add', async (req, res) => {...});
// 更新：1. 添加 async 关键字，使用 async/await 处理异步操作，并正确捕获错误
router.post('/user/update/:myid', async (req, res) => {...});
// 删除：async + await
router.get('/user/update/:myid', async (req, res) => {...});
// 列表: 支持分页、条件筛选、排序
router.get('/user/list', async (req, res) => {...});

module.exports = router;
```

### CRUD

#### 新增

页面

```js
    // 请求新增
    resigter.onclick = () => {
      console.log(username.value, password.value, age.value);
      fetch("/api/user/add", {
        method: "POST",
        body: JSON.stringify({
          username: username.value,
          password: password.value,
          age: age.value
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => res.json()).then(res => {
        console.log(res);
      })
    }
```

接口

```js
// 新增
router.post('/user/add', async (req, res) => {
  console.log("新增用户接收参数：", req.body);
  const { username, password, age } = req.body;
  // 1. 先做参数校验（避免空值插入数据库）
  if (!username || !password) {
    return res.send({ err: -1, msg: "用户名和密码为必填项" });
  }
  try {
    // 2. 统一使用 await 处理异步，不再混合 .then()，代码更清晰
    const createResult = await UserModel.create({
      username,
      password,
      age: age || 0 // 给age设置默认值，避免插入null
    });
    // 3. 打印详细的新增结果，便于排查
    console.log("用户新增成功：", createResult);
    // 4. 返回新增成功的标识 + 新增的用户数据（含自动生成的_id）
    res.send({
      ok: 1,
      msg: "用户新增成功",
      data: createResult // 把新增的完整文档返回给前端
    });
  } catch (error) {
    // 5. 打印具体的错误信息，定位问题（比如字段验证失败、数据库连接问题）
    console.error("用户新增失败：", error);
    // 6. 返回具体的错误提示，而非仅返回 err:-1
    res.send({
      err: -1,
      msg: "用户新增失败",
      error: error.message // 把错误信息返回（生产环境可酌情隐藏）
    });
  }
});
```



#### 更新

页面

```js
    // 请求更新
    updateBtn.onclick = () => {
      console.log(username.value, password.value, age.value);
      fetch("/api/user/update/696a13fa3b1df45cfe4b8740", {
        method: "POST",
        body: JSON.stringify({
          username: "修改的名称",
          password: "修改的密码",
          age: 1
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => res.json()).then(res => {
        console.log(res);
      })
    }
```

接口

```js
// 更新：1. 添加 async 关键字，使用 async/await 处理异步操作，并正确捕获错误
router.post('/user/update/:myid', async (req, res) => {
  console.log(req.body, req.params.myid);
  const { username, password, age } = req.body;
  try {
    // 2. 添加 await 等待更新操作完成，并接收结果
    const updateResult = await UserModel.updateOne(
      { _id: req.params.myid },
      // 3. 最好加 $set 操作符（Mongoose 6.x 虽可省略，但显式写更规范）
      { $set: { username, password, age } }
    );

    // 4. 验证更新是否真的生效（关键：检查匹配的文档数）
    if (updateResult.matchedCount === 0) {
      return res.send({ err: -1, msg: "未找到该用户（_id 不存在）" });
    }
    console.log("更新成功", updateResult);
    res.send({ ok: 1, data: updateResult });
  } catch (error) {
    console.error("更新失败：", error); // 打印具体错误信息
    res.send({ err: -1, msg: error.message });
  }
});
```


#### 删除

页面

```js
    // 请求删除
    deleteBtn.onclick = () => {
      fetch("/api/user/update/696a13fa3b1df45cfe4b8740")
        .then(res => res.json()).then(res => {
          console.log(res);
        })
    }
```

接口

```js
// 删除：async + await
router.get('/user/update/:myid', async (req, res) => {
  console.log(req.params.myid);
  try {
    const deleteResult = await UserModel.deleteOne({ _id: req.params.myid });
    if (deleteResult.matchedCount === 0) {
      return res.send({ err: -1, msg: "未找到该用户（_id 不存在）" });
    }
    console.log("删除成功", deleteResult);
    res.send({ ok: 1, data: deleteResult });
  } catch (error) {
    console.error("删除失败：", error); // 打印具体错误信息
    res.send({ err: -1, msg: error.message });
  }
});
```


#### 列表

页面

```js
    // 请求列表：渲染到页面方式有二（①字符串模版语法，②模版引擎语法）
    fetch("/api/user/list?page=1&pageSize=2").then(res => res.json()).then(res => {
      console.log(res);
      let tbody = document.querySelector("tbody")
      tbody.innerHTML = res.data.list.map(item => `
        <tr>
          <td>${item._id}</td>
          <td>${item.username}</td>
          <td>${item.age}</td>
        </tr>
      `).join("")
    })
```

接口

```js
// 列表: 支持分页、条件筛选、排序
router.get('/user/list', async (req, res) => {
  // 1. 获取前端传入的查询参数（解构+设置默认值，避免参数缺失报错）
  const {
    page = 1,        // 当前页码，默认第1页
    pageSize = 10,   // 每页条数，默认10条
    username = '',   // 按用户名模糊查询，默认查全部
    age = '',        // 按年龄精准查询，默认查全部
    sort = '-_id'    // 排序规则，默认按_id降序（最新新增的在前）
  } = req.query;

  try {
    // 2. 构建查询条件（支持模糊/精准筛选）
    const queryCondition = {};
    // 用户名模糊查询（不区分大小写）
    if (username) {
      queryCondition.username = { $regex: username, $options: 'i' };
    }
    // 年龄精准查询（需确保age是数字）
    if (age) {
      queryCondition.age = Number(age);
    }

    // 3. 执行分页查询（countDocuments统计总数，find查列表，skip+limit分页）
    // 先统计符合条件的总条数（用于计算总页数）
    const total = await UserModel.countDocuments(queryCondition);
    // 再查询当前页的数据
    const list = await UserModel.find(queryCondition)
      .sort(sort)          // 排序（-字段=降序，字段=升序，如 'age' 按年龄升序）
      .skip((page - 1) * pageSize)  // 跳过前面的条数（分页核心）
      .limit(Number(pageSize))     // 限制每页条数
      .select('-password -__v');     // 排除__v字段（-字段名 表示排除该字段，多个字段用空格分隔）

    // 4. 打印日志，便于排查
    console.log(`用户列表查询成功：页码${page}，条数${list.length}，总条数${total}`);

    // 5. 返回完整的列表数据（含分页信息）
    res.send({
      ok: 1,
      msg: "用户列表查询成功",
      data: {
        list,           // 当前页数据列表
        pagination: {
          page: Number(page),
          pageSize: Number(pageSize),
          total,        // 总条数
          totalPage: Math.ceil(total / pageSize) // 总页数
        }
      }
    });
  } catch (error) {
    // 6. 捕获错误并返回详细信息
    console.error("用户列表查询失败：", error);
    res.send({
      err: -1,
      msg: "用户列表查询失败",
      error: error.message
    });
  }
});
```



## 7. 规范与分层

### 接口规范

RESTful架构：url 地址中只包含名词表示资源，使用 http 动词表示动作进行操作资源。

示例：

```txt
GET     /blog/articles       获取所有文章
POST    /blog/articles       添加一篇文章
PUT     /blog/articles/{id}  修改一篇文章
DELETE  /blog/articles/{id}  删除一篇文章
```

过滤信息：用于补充规范的一些通用手段

* `?limit=10`  指定返回记录的数量
* `?offset=10`  指定返回记录的开始位置
* `?page=2&pageSize=10`  指定第几页，以及每页的记录数量
* `?sortby=name&order=asc`  指定返回结果按照哪个字段排序，以及排序顺序
* `?state=close`  指定筛选条件

页面

```js
// 请求新增-POST
resigter.onclick = () => {
  fetch("/api/user", {
    method: "POST",
    ...
}
// 请求更新-PUT
updateBtn.onclick = () => {
  fetch("/api/user/xxxx", {
    method: "PUT",
    ...
}
// 请求删除-DELETE
deleteBtn.onclick = () => {
  fetch("/api/user/xxxx", {
    method: "DELETE"
  })...
}
// 请求列表-GET
fetch("/api/user?page=1&pageSize=2")...
```

接口

```js
// 新增-POST
router.post('/user', async (req, res) => {...})
// 更新-PUT
router.put('/user/:myid', async (req, res) => {...})
// 删除-DELETE
router.delete('/user/:myid', async (req, res) => {...})
// 列表-GET
router.get('/user', async (req, res) => {...})
```



### 业务分层

* **router.js**  负责将请求分发给 Controller 层
* **controller.js**  负责处理业务逻辑（V与M之间的沟通）
* **views/**  V层，负责展示页面
* **model/**  M层，负责处理数据（增删改查）

![image-20260116202853799](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260116202855158.png)



示例（users.js 三层架构）：

#### routes/users.js

```js
var express = require('express');
const UserModel = require('../model/UserModel');
const UserController = require('../controllers/UserController');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
// 新增-POST
router.post('/user', UserController.addUser);
// 更新-PUT
router.put('/user/:myid', UserController.updateUser);
// 删除-DELETE
router.delete('/user/:myid', UserController.deleteUser);
// 列表-GET
router.get('/user', UserController.getUsers);

module.exports = router;
```

#### controllers/UserController.js

```js
const UserService = require("../services/UserService");

const UserController = {
    addUser: async (req, res) => {
        console.log("新增用户接收参数：", req.body);
        const { username, password, age } = req.body;
        // 1. 先做参数校验（避免空值插入数据库）
        if (!username || !password) {
            return res.send({ err: -1, msg: "用户名和密码为必填项" });
        }
        try {
            const createResult = await UserService.addUser(username, password, age)
            // 3. 打印详细的新增结果，便于排查
            console.log("用户新增成功：", createResult);
            // 4. 返回新增成功的标识 + 新增的用户数据（含自动生成的_id）
            res.send({
                ok: 1,
                msg: "用户新增成功",
                data: createResult // 把新增的完整文档返回给前端
            });
        } catch (error) {
            // 5. 打印具体的错误信息，定位问题（比如字段验证失败、数据库连接问题）
            console.error("用户新增失败：", error);
            // 6. 返回具体的错误提示，而非仅返回 err:-1
            res.send({
                err: -1,
                msg: "用户新增失败",
                error: error.message // 把错误信息返回（生产环境可酌情隐藏）
            });
        }
    },
    updateUser: async (req, res) => {
        console.log(req.body, req.params.myid);
        const { username, password, age } = req.body;
        try {
            // 1. async 添加 await 等待更新操作完成，并接收结果
            const updateResult = await UserService.updateUser(req.params.myid, username, password, age)
            // 3. 验证更新是否真的生效（关键：检查匹配的文档数）
            if (updateResult.matchedCount === 0) {
                return res.send({ err: -1, msg: "未找到该用户（_id 不存在）" });
            }
            console.log("更新成功", updateResult);
            res.send({ ok: 1, data: updateResult });
        } catch (error) {
            console.error("更新失败：", error); // 打印具体错误信息
            res.send({ err: -1, msg: error.message });
        }
    },
    deleteUser: async (req, res) => {
        console.log(req.params.myid);
        try {
            const deleteResult = await UserService.deleteUser(req.params.myid);
            if (deleteResult.matchedCount === 0) {
                return res.send({ err: -1, msg: "未找到该用户（_id 不存在）" });
            }
            console.log("删除成功", deleteResult);
            res.send({ ok: 1, data: deleteResult });
        } catch (error) {
            console.error("删除失败：", error); // 打印具体错误信息
            res.send({ err: -1, msg: error.message });
        }
    },
    getUsers: async (req, res) => {
        // 1. 获取前端传入的查询参数（解构+设置默认值，避免参数缺失报错）
        const {
            page = 1,        // 当前页码，默认第1页
            pageSize = 10,   // 每页条数，默认10条
            username = '',   // 按用户名模糊查询，默认查全部
            age = '',        // 按年龄精准查询，默认查全部
            sort = '-_id'    // 排序规则，默认按_id降序（最新新增的在前）
        } = req.query;

        try {
            // 2. 构建查询条件（支持模糊/精准筛选）
            const queryCondition = {};
            // 用户名模糊查询（不区分大小写）
            if (username) {
                queryCondition.username = { $regex: username, $options: 'i' };
            }
            // 年龄精准查询（需确保age是数字）
            if (age) {
                queryCondition.age = Number(age);
            }

            // 3. 执行分页查询（countDocuments统计总数，find查列表，skip+limit分页）
            // 先统计符合条件的总条数（用于计算总页数）再查询当前页的数据
            const { total, list } = await UserService.getUsers(queryCondition, sort, page, pageSize)

            // 4. 打印日志，便于排查
            console.log(`用户列表查询成功：页码${page}，条数${list.length}，总条数${total}`);

            // 5. 返回完整的列表数据（含分页信息）
            res.send({
                ok: 1,
                msg: "用户列表查询成功",
                data: {
                    list,           // 当前页数据列表
                    pagination: {
                        page: Number(page),
                        pageSize: Number(pageSize),
                        total,        // 总条数
                        totalPage: Math.ceil(total / pageSize) // 总页数
                    }
                }
            });
        } catch (error) {
            // 6. 捕获错误并返回详细信息
            console.error("用户列表查询失败：", error);
            res.send({
                err: -1,
                msg: "用户列表查询失败",
                error: error.message
            });
        }
    }
}

module.exports = UserController
```

#### services/UserService.js

```js
const UserModel = require("../model/UserModel");

const UserService = {
    addUser: (username, password, age) => {
        // 2. 统一使用 await 处理异步，不再混合 .then()，代码更清晰
        return UserModel.create({
            username,
            password,
            age: age || 0 // 给age设置默认值，避免插入null
        });
    },
    updateUser: (_id, username, password, age) => {
        return UserModel.updateOne(
            { _id },
            // 2. 最好加 $set 操作符（Mongoose 6.x 虽可省略，但显式写更规范）
            { $set: { username, password, age } }
        );
    },
    deleteUser: (_id) => {
        return UserModel.deleteOne({ _id })
    },
    getUsers: async (condition, sort, page, pageSize) => {
        const total = await UserModel.countDocuments(condition)
        const list = await UserModel.find(condition)
            .sort(sort)          // 排序（-字段=降序，字段=升序，如 'age' 按年龄升序）
            .skip((page - 1) * pageSize)  // 跳过前面的条数（分页核心）
            .limit(Number(pageSize))     // 限制每页条数
            .select('-password -__v');     // 排除__v字段（-字段名 表示排除该字段，多个字段用空格分隔）
        return { total, list }
    }
}

module.exports = UserService
```









