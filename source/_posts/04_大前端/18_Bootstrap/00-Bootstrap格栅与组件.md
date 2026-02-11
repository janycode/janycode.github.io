---
title: 00-Bootstrap格栅与组件
date: 2018-5-7 15:21:05
tags:
- jQuery
categories: 
- 04_大前端
- 18_Bootstrap
---

![image-20251125100829463](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251128131801.png)

参考资料：

* Bootstrap官网：https://www.bootcss.com/
* Bootstrap v5下载：https://v5.bootcss.com/docs/getting-started/download/



## 1. 引入使用

https://v5.bootcss.com/docs/getting-started/contents/

最简单的验证：- 只使用 css 引入

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="./lib/bootstrap.css">
</head>

<body>
    <!-- container 默认就支持了响应式布局 -->
    <div class="container">
        <button type="button" class="btn btn-primary">Primary</button>
        <button type="button" class="btn btn-secondary">Secondary</button>
        <button type="button" class="btn btn-success">Success</button>
        <button type="button" class="btn btn-danger">Danger</button>
        <button type="button" class="btn btn-warning">Warning</button>
        <button type="button" class="btn btn-info">Info</button>
        <button type="button" class="btn btn-light">Light</button>
        <button type="button" class="btn btn-dark">Dark</button>

        <button type="button" class="btn btn-link">Link</button>
    </div>
</body>

</html>
```

![image-20251216180230967](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251216180232.png)



## 2. 响应式布局

* `class="container"` 参考：https://v5.bootcss.com/docs/layout/containers/
* `grid` **栅格布局**，参考：https://v5.bootcss.com/docs/layout/grid/
  * `12栅格`布局，总比例数字加起来为12，比如分 4列，就是 3:3:3:3 就可以实现均分4列。
* 弹性盒布局：参考：https://v5.bootcss.com/docs/layout/columns/

![image-20251216181431309](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251216181432.png)

响应式示例：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="./lib/bootstrap.css">
</head>

<body>
    <!-- 根据屏幕大小变小，从4列变3列变2列变1列 -->
    <div class="container text-center">
        <div class="row">
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                Column
            </div>
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                Column
            </div>
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                Column
            </div>
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                Column
            </div>
        </div>
    </div>
</body>

</html>
```





## 3. 各种组件

表单：https://v5.bootcss.com/docs/forms/overview/

表单校验：https://v5.bootcss.com/docs/forms/validation/

组件：https://v5.bootcss.com/docs/components/accordion/

弹窗：https://v5.bootcss.com/docs/components/modal/

导航：https://v5.bootcss.com/docs/components/navbar/



示例： - 引入 css 和 js

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="./lib/bootstrap.css">
    <script src="./lib/bootstrap.bundle.js"></script>
</head>

<body>
    <div class="container">
        <form>
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Email address</label>
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword1">
            </div>
            <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="exampleCheck1">
                <label class="form-check-label" for="exampleCheck1">Check me out</label>
            </div>
            <div class="mb-3">
                <select class="form-select" aria-label="Default select example">
                <option selected>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </select>
            </div>
            
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</body>

</html>
```

































