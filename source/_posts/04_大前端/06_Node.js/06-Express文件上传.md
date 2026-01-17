---
title: 06-Express文件上传
date: 2022-5-22 21:36:21
tags:
- Vue
- Node
- Node.js
- Express
- 文件上传
categories: 
- 04_大前端
- 06_Node.js
---

![image-20260113102144733](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260113102145988.png)

参考：

* Express 官网：https://www.expressjs.com.cn/



## 1. 文件上传

### 1.1 multer

文档：[multer](https://github.com/expressjs/multer/blob/main/doc/README-zh-cn.md)

安装：*npm i multer*  - Don't forget the `enctype="multipart/form-data"` in your form.

已上传头像为例：

routes/users.js

```js
var express = require('express');
const UserController = require('../controllers/UserController');
var router = express.Router();
// multer: 1.引入 multer，配置图片存放目录为 public/uploads/ 下
const multer = require('multer')
const upload = multer({ dest: 'public/uploads/' })

// 新增-POST
// multer: 2.添加 single 指定 文件名，前后端一致【批量上传用 upload.array('avatars', 10), 10-最多接收10张】
router.post('/user', upload.single("avatar"), UserController.addUser);
```

controllers/UserController.js

```js
const UserService = require("../services/UserService");
const JWT = require("../util/JWT");

const UserController = {
    addUser: async (req, res) => {
        console.log("新增用户接收参数：", req.body);
        console.log("新增用户接收文件：", req.file); //批量上传用 req.files 数组
        // 如果头像非必传，则使用默认头像
        const avatar = req.file ? `/uploads/${req.file.filename}` : `/images/default.jpg`
        const { username, password, age } = req.body;
        if (!username || !password) {
            return res.send({ err: -1, msg: "用户名和密码为必填项" });
        }
        try {
            const createResult = await UserService.addUser(username, password, age, avatar)  //添加头像参数
            ...
    },
    ...
```

services/UserService.js

```js
const UserModel = require("../model/UserModel");

const UserService = {
    addUser: (username, password, age, avatar) => {
        return UserModel.create({
            username,
            password,
            age: age || 0,
            avatar //添加头像参数
        });
    },
    ...
```

model/UserModel.js

```js
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const UserType = {
    username: String,
    password: String,
    age: Number,
    avatar: String  //添加头像字段
}
const UserModel = mongoose.model("user", new Schema(UserType))
module.exports = UserModel
```



补充：`req.file` 接收到的文件对象：

```json
{
  fieldname: 'avatar',
  originalname: 'touxiang2-å\x86·å\x85\x94.png',
  encoding: '7bit',
  mimetype: 'image/png',
  destination: 'public/uploads/',
  filename: '4474fb3d6cad595ab4295aadc29228e7',
  path: 'public\\uploads\\4474fb3d6cad595ab4295aadc29228e7',
  size: 26292
}
```





### 1.2 form表单 | FromData

#### form表单

适用于 `form表单` 上传。

```ejs
    <!-- 必须设置 enctype="multipart/form-data" -->
    <form action="/api/user" method="POST" enctype="multipart/form-data">
        <div>
            用户名：<input type="text" name="username">
        </div>
        <div>
            密码：<input type="password" name="password">
        </div>
        <div>
            年龄：<input type="number" name="age">
        </div>
        <div>
            头像：<input type="file" name="avatar">
        </div>
        <div><input type="submit" value="添加用户"></div>
    </form>
```



#### FormData

适用于 `非form表单` 上传。

html

```ejs
    <!-- 单个上传 -->
    <div>头像：<input type="file" id="avatar"></div>
    <!-- 批量上传 -->
    <div>图片批量：<input type="file" id="avatars" multiple></div>
```

js

```js
    var avatar = document.querySelector("#avatar")
    // 请求新增-POST
    resigter.onclick = () => {
      // 组装 FormData 对象作为参数
      const formsData = new FormData()
      formsData.append("username", username.value)
      formsData.append("password", password.value)
      formsData.append("age", age.value)
      formsData.append("avatar", avatar.files[0])  // 头像文件在 avatar.files[0] 文件对象中，批量时为 avatar.files 数组
      axios.post("/api/user", formsData, {         // 必须添加 headers 指定为 multipart/form-data
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(res => {
        console.log("新增：", res.data);
        if (res.data.ok < 0) {
          location.href = "/login"
        }
      })
    }
```

<hr>

index.ejs - 完整代码

```ejs
<!DOCTYPE html>
<html>

<head>
  <title>
    <%= title %>
  </title>
  <link rel='stylesheet' href='/stylesheets/style.css' />
  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js"></script>
  <script>
    //axios 拦截器配置示例
    // 请求拦截
    axios.interceptors.request.use(function (config) {
      console.log("请求发出前，先执行的方法");
      // 所有请求携带 token
      const token = localStorage.getItem("token")
      config.headers.Authorization = `Bearer ${token}` //常规规范拼接 Bearer
      return config;
    }, function (error) {
      return Promise.reject(error);
    });

    // 响应拦截
    axios.interceptors.response.use(function (response) {
      console.log("响应成功后，先执行的方法");
      const { authorization } = response.headers
      authorization && localStorage.setItem("token", authorization)
      return response;
    }, function (error) {
      console.log(error.response.status);
      if (error.response.status === 401) {
        localStorage.removeItem("token")
        location.href = "/login"
      }
      return Promise.reject(error);
    });
  </script>
</head>

<body>
  <h1>后台系统用户管理</h1>
  <div><button id="logout">退出登陆</button></div>
  <div>
    <div>用户名：<input type="text" id="username"></div>
    <div>密码：<input type="password" id="password"></div>
    <div>年龄：<input type="number" id="age"></div>
    <div>头像：<input type="file" id="avatar"></div>
    <!-- 批量上传 -->
    <div>图片批量：<input type="file" id="avatars" multiple></div>
    <div>
      <button id="register">注册用户</button>
    </div>
  </div>
  <hr>
  <div>
    <button id="update">更新用户</button>
    <button id="delete">删除用户</button>
  </div>
  <hr>
  <table border="1px">
    <thead>
      <tr>
        <td>id</td>
        <td>用户名</td>
        <td>年龄</td>
        <td>头像</td>
      </tr>
    </thead>
    <tbody></tbody>
  </table>

  <script>
    var resigter = document.querySelector("#register")
    var logout = document.querySelector("#logout")
    var updateBtn = document.querySelector("#update")
    var deleteBtn = document.querySelector("#delete")
    var username = document.querySelector("#username")
    var password = document.querySelector("#password")
    var age = document.querySelector("#age")
    var avatar = document.querySelector("#avatar")
    // 请求新增-POST
    resigter.onclick = () => {
      // 头像文件在 avatar.files[0] 文件对象
      const formsData = new FormData()
      formsData.append("username", username.value)
      formsData.append("password", password.value)
      formsData.append("age", age.value)
      formsData.append("avatar", avatar.files[0])

      axios.post("/api/user", formsData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(res => {
        console.log("新增：", res.data);
        if (res.data.ok < 0) {
          location.href = "/login"
        }
      })
    }

    // 请求更新-PUT
    updateBtn.onclick = () => {
      axios.put("/api/user/696aeb1f3261b94d1d3a83e9", {
        username: "修改的名称",
        password: "修改的密码",
        age: 1
      }).then(res => {
        console.log("更新：", res.data);
        if (res.ok < 0) {
          location.href = "/login"
        }
      })
    }

    // 请求删除-DELETE
    deleteBtn.onclick = () => {
      axios.delete("/api/user/696aeb1f3261b94d1d3a83e9").then(res => {
        console.log("删除：", res.data);
        if (res.data.ok < 0) {
          location.href = "/login"
        }
      })
    }

    // 请求列表-GET
    axios.get("/api/user?page=1&pageSize=10").then(res => {
      console.log("列表：", res.data);
      let tbody = document.querySelector("tbody")
      tbody.innerHTML = res.data.data.list.map(item => `
        <tr>
          <td>${item._id}</td>
          <td>${item.username}</td>
          <td>${item.age}</td>
          <td><img src="${item.avatar}" style="width:50px;"></td>
        </tr>
      `).join("")
    })

    logout.onclick = () => {
      localStorage.removeItem("token")
      location.href = "/login"
    }
  </script>
</body>

</html>
```

效果

![image-20260117160906096](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260117160907241.png)























