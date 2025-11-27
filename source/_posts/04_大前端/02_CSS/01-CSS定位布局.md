---
title: 01-CSS定位布局
date: 2017-4-28 22:23:58
tags:
- CSS
- 定位
- 布局
categories: 
- 04_大前端
- 02_CSS
---



## 1. position 定位

`position` 定位，需要结合便宜位置（top/left/right/bottom）使用。

![image-20251127173633018](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251127173634.png)

```css
position 偏移位置属性：
top:100px;
left:100px;
right:100px;
bottom:100px;
```

### 绝对与相对定位

口诀：`子绝父相`，子盒子绝对定位，父盒子使用相对定位，即可实现子盒相对于父盒的位置定位。



### 固定定位

* fixed 固定定位演示（右下角，不受窗口滚动影响）：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .box1{
            width: 100%;
            height: 2000px;
            background-color: yellow;
        }
        .box2{
            width: 200px;
            height: 200px;
            background-color: red;
            position: fixed;
            right: 0;
            bottom: 0;
        }
    </style>
</head>
<body>
    <div class="box1"></div>
    <div class="box2"></div>
</body>
</html>
```

![image-20251127180505821](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251127180507.png)

### 粘性定位

* sticky 粘性定位演示

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .header{
            background: yellow;
            width: 100%;
            height: 100px;
        }
        .nav{
            background: red;
            width: 500px;
            height: 100px;
            margin: 0 auto;
            position: sticky;
            top: 0;  /* 支持负值，一般用 0 就可以 */
        }
        .body{
            height: 2000px;
            background: green;
        }
    </style>
</head>
<body>
    <div class="header"></div>
    <div class="nav"></div>
    <div class="body"></div>
</body>
</html>
```

![image-20251127180858698](E:\blog\image\01-CSS定位布局\image-20251127180858698.png)



### 案例

![image-20251127190708720](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251127190710.png)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        .container{
            width: 1033px;
            height: 681px;
            /* background-color: yellow; */
            margin: 0 auto;
        }
        .box{
            width: 300px;
            height: 300px;
            border: 7px solid #cdccce;
            position: relative;  /* 父盒子：相对定位（为了子盒子绝对定位） */
            float: left;
            margin-right: 25px;
            margin-bottom: 25px;
        }
        .box .pic{
            width: 100%;
            height: 100%;
        }
        .box .icon, .box .icongreen{
            width: 25px;
            height: 25px;
            position: absolute;  /* 子盒子绝对定位，则定位对象是相对于父盒子位置 */
            left: 7px;
            bottom: 7px;
        }
        .box .icongreen{
            display: none;
        }
        .box:hover .icongreen, .box:hover .box1{
            display: block;  /* 鼠标移上去显示出来 */
        }
        .box:hover .pic{
            opacity: 0.7; /* 图片透明度设置范围：0-1 */
        }
        .box .box1{
            position: absolute;
            left: 7px;
            top: 7px;
            display: none;
        }
        .box .box1 span{
            color: blue;
        }
        /* 将第一行最后一个和第二行最后一个的右边距去掉 */
        .picright{
            margin-right: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="box">
            <img src="img/images/dog_03.jpg" alt="" class="pic">
            <img src="img/images/icon_03.jpg" alt="" class="icon">
            <img src="img/images/icongreen_03.jpg" alt="" class="icon icongreen">
            <div class="box1">
                <img src="img/images/icon2_03.jpg" alt="" class="icon2">
                <span>好好快写，写会了一会儿好出去玩。好好快写，写会了一会儿好出去玩。</span>
            </div>
        </div>
        <div class="box">
            <img src="img/images/dog_03.jpg" alt="" class="pic">
            <img src="img/images/icon_03.jpg" alt="" class="icon">
            <img src="img/images/icongreen_03.jpg" alt="" class="icon icongreen">
            <div class="box1">
                <img src="img/images/icon2_03.jpg" alt="" class="icon2">
                <span>好好快写，写会了一会儿好出去玩。好好快写，写会了一会儿好出去玩。</span>
            </div>
        </div>
        <div class="box picright">
            <img src="img/images/dog_03.jpg" alt="" class="pic">
            <img src="img/images/icon_03.jpg" alt="" class="icon">
            <img src="img/images/icongreen_03.jpg" alt="" class="icon icongreen">
            <div class="box1">
                <img src="img/images/icon2_03.jpg" alt="" class="icon2">
                <span>好好快写，写会了一会儿好出去玩。好好快写，写会了一会儿好出去玩。</span>
            </div>
        </div>
        <div class="box">
            <img src="img/images/dog_03.jpg" alt="" class="pic">
            <img src="img/images/icon_03.jpg" alt="" class="icon">
            <img src="img/images/icongreen_03.jpg" alt="" class="icon icongreen">
            <div class="box1">
                <img src="img/images/icon2_03.jpg" alt="" class="icon2">
                <span>好好快写，写会了一会儿好出去玩。好好快写，写会了一会儿好出去玩。</span>
            </div>
        </div>
        <div class="box">
            <img src="img/images/dog_03.jpg" alt="" class="pic">
            <img src="img/images/icon_03.jpg" alt="" class="icon">
            <img src="img/images/icongreen_03.jpg" alt="" class="icon icongreen">
            <div class="box1">
                <img src="img/images/icon2_03.jpg" alt="" class="icon2">
                <span>好好快写，写会了一会儿好出去玩。好好快写，写会了一会儿好出去玩。</span>
            </div>
        </div>
        <div class="box picright">
            <img src="img/images/dog_03.jpg" alt="" class="pic">
            <img src="img/images/icon_03.jpg" alt="" class="icon">
            <img src="img/images/icongreen_03.jpg" alt="" class="icon icongreen">
            <div class="box1">
                <img src="img/images/icon2_03.jpg" alt="" class="icon2">
                <span>好好快写，写会了一会儿好出去玩。好好快写，写会了一会儿好出去玩。</span>
            </div>
        </div>
    </div>
</body>
</html>
```





## 2. 布局









