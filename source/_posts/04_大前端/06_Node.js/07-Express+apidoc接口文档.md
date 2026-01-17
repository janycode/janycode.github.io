---
title: 07-Express+apidoc接口文档
date: 2022-5-22 21:36:21
tags:
- Vue
- Node
- Node.js
- Express
- apidoc
categories: 
- 04_大前端
- 06_Node.js
---

![image-20260113102144733](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260113102145988.png)

参考：

* Express 官网：https://www.expressjs.com.cn/
* apidoc 参考资料：https://juejin.cn/post/7008442300594389022
* showdoc 官网：https://www.showdoc.com.cn/



## 1. apidoc

apidoc 是一个简单的 RESTful API 文档生成工具，它从代码注释中提取特定格式的内容生成文档。支持诸如 Go、Java、C++、Rust 等大部分开发语言，具体可使用 apidoc lang 命令行查看所有的支持列表。

apidoc 拥有以下特点：

* 跨平台，linux、windows、macOS 等都支持；
* 支持语言广泛，即使是不支持，也很方便扩展；
* 支持多个不同语言的多个项目生成一份文档；
* 输出模板可自定义；
* 根据文档生成 mock 数据；

### 安装

安装：*npm i http-server cross-env apidoc -g*

* 全局安装

插件：**ApiDoc Snippet** - apidoc注释代码提示工具



### 注意

在当前文件夹下 **apidoc.json**

```json
{
    "name": "接口文档",
    "version": "1.0.0",
    "description": "关于的接口文档描述",
    "title": "****"
}
```




### 使用

![image-20260117162048829](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260117162050241.png)

routes/users.js

```js
/**
 * 
 * @api {post} /user 添加用户
 * @apiName addUser
 * @apiGroup 用户接口
 * @apiVersion  1.0.0
 * 
 * @apiParam  {String} username 用户名
 * @apiParam  {String} password 密码
 * @apiParam  {Number} age 年龄
 * @apiParam  {File} avatar 头像
 * 
 * @apiSuccess (200) {Number} ok 标识成功字段
 * 
 * @apiParamExample  {type} Request-Example:
 * {
 *     username : "jerry",
 *     password : "123456",
 *     age : 22,
 *     avatar : File
 * }
 * 
 * @apiSuccessExample {type} Success-Response:
 * {
 *     ok : 1
 * }
 */
router.post('/user', upload.single("avatar"), UserController.addUser);

/**
 * 
 * @api {delete} /user/:myid 删除用户
 * @apiName deleteUser
 * @apiGroup 用户接口
 * @apiVersion  1.0.0
 * 
 * @apiParam  {String} myid 用户主键_id
 * 
 * @apiSuccess (200) {Number} ok 成功与否标识
 * 
 * @apiParamExample  {String} Request-Example:
 * {
 *     myid : abc123
 * }
 * 
 * @apiSuccessExample {type} Success-Response:
 * {
 *     ok : 1
 * }
 */
router.delete('/user/:myid', UserController.deleteUser);
```

命令生成（指定生成 routers/ 目录的接口到目标目录 doc/ 下）：

```sh
apidoc -i .\routes\ -o .\doc
```

打开 doc/ 目录下的 `index.html`  (右键-view in browser)，然后`右上角选择版本号 1.0.0`，就能看到接口。


### 在线文档

修改一下`package.json`，改一下运行脚本，添加 apidoc 这一行：

```sh
  "scripts": {
    "start": "nodemon ./bin/www",
    "apidoc": "apidoc -i ./routes -o ./doc && http-server ./doc -p 8080 -o --cors"
  },
```

运行：

```sh
npm run apidoc
```

会自动打开默认浏览器：http://127.0.0.1:8080/



### 效果

![image-20260117165833641](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260117165834892.png)



## 2. showdoc

https://www.showdoc.com.cn/



> 都可以关联到 [ApiFox](https://apifox.com/) 工具中，统一维护。















