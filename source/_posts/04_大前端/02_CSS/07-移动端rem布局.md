---
title: 07-移动端rem布局
date: 2017-4-28 22:23:58
tags:
- CSS
- CSS3
- rem布局
categories: 
- 04_大前端
- 02_CSS
---

![image-20251125100829463](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251128131801.png)





## 1. rem等比例缩放

* **px**： 50px，固定像素值

* **em**：相对单位，相对于父元素的字体大小。width: 2em;

* `rem`：相对单位，相对于**根元素（html）**字体大小。width: 10rem;

示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        html{
            font-size: 20px;
        }
        .div1, .div2{
            border: 1px solid red;
            font-size: 16px;
        }
        .div1 p{
            font-size: 32px;
        }
        .div2 p{
            /* font-size: 2em;  相对于父元素的字体大小 */
            font-size: 2rem; /* 相对于根元素 html 中的字体大小的倍数，即 20px*2=40px */
        }
        .div2 p span{
            font-size: 2em; /* 相对于父元素p，即 40px*2 = 80px */
        }
    </style>
</head>
<body>
    <div class="div1">
        <p>大家好</p>
    </div>
    <div class="div2">
        <p>大家妙<span>厉害厉害</span></p>
    </div>
</body>
</html>
```

效果：

![image-20251203091529608](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251203091532.png)





## 2. rem布局准备

### 2.1 font-size基准

使用如下一行JS代码将根元素 html 的字体大小进行自动参与像素计算，适应屏幕大小。

`动态计算的font-size值 = 当前设备的CSS布局宽度 / 物理分辨率(即设计稿量取宽度) * 基准font-size`

```css
html{
    /* 基准font-size */
    font-size: 100px;
}
```

```js
<script>
    //font-size 计算：当前设备的CSS布局宽度 / 物理分辨率(即设计稿量取宽度) * 基准font-size
    document.documentElement.style.fontSize = document.documentElement.clientWidth/375 * 100 + 'px';
</script>
```

示例：

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
        html{
            /* 基准font-size */
            font-size: 100px;
        }
        body{
            /* 用于全局默认字体大小 */
            font-size: 16px;
        }
        .box{
            width: 7.5rem;          /* 结合font-size计算，设计稿量多少，就可以设置除以100之后的 rem 值 */
            height: 100px;
            background: yellow;
        }
    </style>

    <script>
        //font-size 计算
        document.documentElement.style.fontSize = document.documentElement.clientWidth/750 * 100 + 'px';
    </script>
</head>
<body>
    <div class="box"></div>
    <p>哈哈哈</p>
</body>
</html>
```

PS：JS需要加载，需要手动刷新页面。



### 2.2 rem计算插件

插件名称：`px to rem & rpx & vw (cssrem)`

使用方式：

方式①

* 快捷键【**Alt+Z**】可以快速转换单个属性 或者 整个文档的 px->rem

方式②

![image-20251203094917082](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251203094918.png)

方式③

* 按 F1 搜索 cssrem，回车，则会把页面中的所有尺寸进行计算转换为 rem 单位。

![image-20251203095109918](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251203095111.png)



## 案例：足球圈首页rem改造

![image-20251203100446836](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251203100447.png)

此处基准值修改为 20px了，留意！`默认值是 16px`

特殊说明：

```css
    <script>
        //font-size 计算：当前设备的CSS布局宽度 / 物理分辨率(即设计稿量取宽度) * 基准font-size
        //改造说明：rem转换后会有问题，因为之前足球圈的尺寸已经是除以2后的值，所以使用量取值缩小2倍，即 640->320
        //如果量取的像素值是1:1使用的，则此处就按照量取尺寸取值，即 640而不是320
        document.documentElement.style.fontSize = document.documentElement.clientWidth/320 * 20 + 'px';
    </script>
```

改造后：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <!-- 以下px像素值，均为量取的物理分辨率都除以2后的结果 -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="../08-css3/font_5078037_fsrix9gsee/iconfont.css">
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        ul{
            list-style: none;
        }
        html,body{
            height: 100%;
        }
        html{
            font-size: 20px;
        }

        body{
            display: flex;
            flex-direction: column;
            font-size: 1rem;
        }

        header{
            height: 2.75rem; 
            background: green;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        header div{
            width: 3.75rem;
            height: 1.5625rem;
            line-height: 1.5625rem;
            text-align: center;
            color: white;
        }
        header div:nth-child(1){
            /* 绘制圆角：因高1.5625rem，圆角一半即.75rem，所以 左上.75rem 右上0 右下0 左下.75rem */
            border-radius: .75rem 0 0 .75rem;
            background: lightgreen;
        }
        header div:nth-child(2){
            /* 绘制圆角：同理，所以 左上0 右上.75rem 右下.75rem 左下0 */
            border-radius: 0 .75rem .75rem 0;
            background: #a9e4b4;
        }
        
        section{
            flex: 1;
            overflow: auto;  /* 溢出滚动，会添加滚动条 */
        }

        section ul{
            display: flex;
            /* 粘性定位：滚动时固定顶部导航 */
            position: sticky;
            top: 0;
            background: white;
        }
        section ul li{
            flex: 1;
            text-align: center;
            height: 2.1875rem;
            line-height: 2.1875rem;
            border-bottom: .0625rem solid #d9d9d9;
            color: gray;
            font-size: .875rem;
        }
        section ul li:nth-child(1) {
            color: #08c63e;
        }
        section ul li:hover{
            border-bottom: .125rem solid #08c63e;
            color: #08c63e;
        }
        section .list{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
        }
        section .list>div{
            width: 49%;
            margin-top: .25rem;
            border: .0625rem solid gray;
        }

        section .list>div img{
            width: 100%;
        }

        section .list>div p{
            height: 1.875rem;
            line-height: 1.875rem;
            text-indent: .625rem;
        }

        footer{
            height: 2.75rem; 
            background: white;
        }

        footer ul{
            display: flex;
            height: 100%;
        }

        footer ul li{
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;

            color: gray;
        }

        footer ul li:nth-child(1) {
            color: #08c63e;
        }

        footer ul li i{
            height: 1.3125rem;
            line-height: 1.3125rem;
            text-align: center;
            font-size: 1rem;
        }
        footer ul li span{
            height: 1.0625rem;
            line-height: 1.0625rem;
            text-align: center;
            font-size: .75rem;
        }

        footer ul li:hover{
            color: #08c63e;
        }

        footer ul li:nth-child(3) {
            position: relative;       /* 使用定位脱离文档流，父相 */
        }

        footer ul li:nth-child(3) i{
            /* 绘制圆形 */
            width: 3.125rem;
            height: 3.125rem;
            border: .0625rem solid gray;
            border-radius: 50%;

            position: absolute;        /* 使用定位脱离文档流，子绝 */
            left: 50%;
            margin-left: -1.625rem;
            top: -0.5rem;

            font-size: 1.875rem;
            text-align: center;
            line-height: 3.125rem;
            background: white;
        }

        .iconfont{
            font-size: .8rem;
        }
    </style>

    <script>
        //font-size 计算：当前设备的CSS布局宽度 / 物理分辨率(即设计稿量取宽度) * 基准font-size
        //改造说明：rem转换后会有问题，因为之前足球圈的尺寸已经是除以2后的值，所以使用量取值缩小2倍，即 640->320
        //如果量取的像素值是1:1使用的，则此处就按照量取尺寸取值，即 640而不是320
        document.documentElement.style.fontSize = document.documentElement.clientWidth/320 * 20 + 'px';
    </script>
</head>
<body>
    <header>
        <div>热点</div>
        <div>关注</div>
    </header>
    <section>
        <ul>
            <li>足球现场</li>
            <li>足球生活</li>
            <li>足球美女</li>
        </ul>

        <div class="list">
            <div>
                <img src="../08-css3/img/2.png" alt="">
                <p>大家好</p>
            </div>
            <div><img src="../08-css3/img/2.png" alt="">
                <p>大家好</p></div>
            <div><img src="../08-css3/img/2.png" alt="">
                <p>大家好</p></div>
            <div><img src="../08-css3/img/2.png" alt="">
                <p>大家好</p></div>
            <div><img src="../08-css3/img/2.png" alt="">
                <p>大家好</p></div>
            <div><img src="../08-css3/img/2.png" alt="">
                <p>大家好</p></div>
            <div><img src="../08-css3/img/2.png" alt="">
                <p>大家好</p></div>
        </div>
    </section>
    <footer>
        <ul>
            <li>
                <i class="iconfont icon-anquan"></i>
                <span>首页</span>
            </li>
            <li><i class="iconfont icon-daka"></i>
                <span>发现</span></li>
            <li><i class="iconfont icon-fenxiang"></i></li>
            <li><i class="iconfont icon-fapiao"></i>
                <span>我的</span></li>
            <li><i class="iconfont icon-houtai"></i>
                <span>退出</span></li>
        </ul>
    </footer>
</body>
</html>
```



## 3. vh与vw单位

不使用 js 实现等比例缩放布局。

* `vh`，view-height，100vh == 视口的100%高度

* `vw`，view-width，100vw == 视口的100%宽度

```css
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        div{
            width: 100vw;
            height: 100vh;
            background: yellow;
        }
        /*  eg:
            iphone6       100vw -> 375px, 1vw=3.75px
            iphone6plus   100vw -> 414px, 1vw=4.14px
        */
    </style>
```

`26.67vw` 等同于 100px 的基准font-size值，转换后的 rem 则就能够等比缩放。

```css
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        html{
            /*  26.67vw 就等同于 100px
                375px = 100vw
                1px = 100/375 = 0.2667vw
            */
            /* font-size: 100px; */
            font-size: 26.67vw;
        }
        div{
            width: 3.75rem;
            height: 100px;
            background: yellow;
        }
    </style>
```

足球圈案例继续改造：

```css
html{
    /* 
    320px == 100px
    16px == 5vw
    */
    font-size: 5vw;
}

.iconfont{
    font-size: 1rem;
}
```

**面试题**：

1. 没有滚动条的时候：100vw = 100%
2. 有滚动条的时候：100vw包含滚动条，即窗口大小；100%刨除滚动条后剩余空间占满。

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
        .box1{
            width: 100vw;
            /* 不含滚动条 */
            /* height: 300px; */
            /* 含滚动条 */
            height: 2000px;
            background: yellow;
        }
        .box2{
            width: 100%;
            /* 不含滚动条 */
            /* height: 300px; */
            /* 含滚动条 */
            height: 2000px;
            background: red;
        }
    </style>
</head>
<body>
    <div class="box1"></div>
    <div class="box2"></div>
</body>
</html>
```

效果：

![image-20251203103806938](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251203103807.png)























