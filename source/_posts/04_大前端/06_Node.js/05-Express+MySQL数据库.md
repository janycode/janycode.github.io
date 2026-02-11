---
title: 05-Express+MySQL数据库
date: 2022-5-22 21:36:21
tags:
- Vue
- Node
- Node.js
- Express
- MySQL
categories: 
- 04_大前端
- 06_Node.js
---

![image-20260113102144733](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260113102145988.png)

参考：

* Express 官网：https://www.expressjs.com.cn/



## 1. nodejs 操作数据库

### 1.1 安装

安装：*npm init; npm i express mysql2*



### 1.2 使用

```js
const express = require("express")
const app = express()
const mysql2 = require("mysql2")  //引入 mysql2 支持 mysql操作

app.get("/", async (req, res) => {
    // 创建连接池，进行操作
    const config = getDBConfig()
    const promisePool = mysql2.createPool(config).promise()
    // 1.普通 sql 查询
    //var result = await promisePool.query("select * from students order by score desc limit 3")
    // 2.带参数查询方式①
    // var name = "李四"
    // var result = await promisePool.query(`select * from students where name="${name}"`)
    // 2.带参数查询方式② - 推荐
    var gender = 1
    var score = 60
    var result = await promisePool.query("select * from students where gender=? and score>=?", [gender, score])
    res.send({ ok: 1, data: result[0] })
})

app.get("/insert", async (req, res) => {
    // 创建连接池，进行操作
    const config = getDBConfig()
    const promisePool = mysql2.createPool(config).promise()
    // 插入数据
    var name = "狗蛋"
    var gender = 1
    var score = 88
    var class_id = 2
    var result = await promisePool.query("insert into students(name, score, gender, class_id) values (?,?,?,?)", [name, score, gender, class_id])
    res.send({ ok: 1, data: result[0] })
})

app.get("/update", async (req, res) => {
    // 创建连接池，进行操作
    const config = getDBConfig()
    const promisePool = mysql2.createPool(config).promise()
    // 更新数据
    var id = 8
    var name = "狗剩"
    var score = 98
    var result = await promisePool.query("update students set name=?, score=? where id=?", [name, score, id])
    res.send({ ok: 1, data: result[0] })
})

app.get("/delete", async (req, res) => {
    // 创建连接池，进行操作
    const config = getDBConfig()
    const promisePool = mysql2.createPool(config).promise()
    // 删除数据
    var id = 3
    var result = await promisePool.query("delete from students where id=?", [id])
    res.send({ ok: 1, data: result[0] })
})

app.listen(3000)

function getDBConfig() {
    return {
        host: '127.0.0.1',
        prot: 3306,
        user: 'root',
        password: '123456',
        database: 'jerry_test',
        connectionLimit: 1
    }
}
```

