---
title: 00-CSS基础入门
date: 2017-4-28 22:23:58
tags:
- CSS
- 选择器
categories: 
- 04_大前端
- 02_CSS
---



## 1. 什么是CSS

CSS，**Cascading Style Sheets** 层叠样式表。

即：如何修饰网页信息的显示样式。

目前推荐遵循的是 W3C 发布的 `CSS3.0`（1998年5月21日W3C推出了CSS2.0），用来表现XHTML或者XML等样式文件的计算机语言。



## 2. CSS语法

1. 每个CSS样式由两部分组成，即`选择符`和`声明`，声明又分为`属性和属性值`
2. 属性必须放在`花括号{}`内，属性与属性值用`冒号:`连接
3. 每条声明用`分号;`结束
4. 当一个属性有多个属性值的时候，属性值与属性值`不分先后顺序，用空格隔开`
5. 在书写样式过程中，空格、换行等操作不影响显示

> 常规原则：`style` 标签需要放在 head 标签中，写一个即可。

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>css</title>
    <style>
        h1 {
            color: red;
        }
        h2 {
            color: yellow;
        }
    </style>
</head>

<body>
    <h1>1111</h1>
    <h2>2222</h2>
</body>
```



## 3. CSS样式

### 3.1 外部样式-常用

`link` 与 `@import`

![image-20251126095136983](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251126095139.png)

```html
    <!-- CSS外部引入方式1 -->
    <link rel="stylesheet" type="text/css" href="css/index.css">
    <!-- CSS外部引入方式2 -->
    <style>
        @import url(css/index.css);
    </style>
```

css/index.css

```css
h1{
    color: blue;
}
h2{
    color: green;
}
```

> 扩展：link 和 import 之间的区别？
>
> 1. 本质差别：link 属于XHTML`标签`，而 @import 完全是`CSS提供的一种方式`
> 2. 加载顺序差别：当一个页面被加载的时候（即浏览器浏览的时候），link引用的CSS会`同时被加载`，而@import引用的CSS会等到页面全部被`下载完再被加载`。所以有时候浏览@import加载的CSS页面时会开始没有样式（就是闪烁），网速慢时最明显。
> 3. 兼容性差别：@import是CSS2.1提出的，所以老的浏览器不支持，@import只有IE5以上才能识别，而link标签无此问题。



### 3.2 内部样式

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS内部样式</title>
    <style>
        div{
            color: yellow;
        }
    </style>
</head>
<body>
    <div>1111111111111</div>
</body>
</html>
```

显示写在head标签内的。



### 3.3 行内样式

标签内 `style` 标签直接写样式。

![image-20251126100431452](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251126100434.png)



> 样式优先级：就近原则。即 行内样式 > 内部样式 > 外部样式。
>
> `!important` 突破优先级顺序，加谁身上，谁优先级高。如果都有!important还是就近原则。且针对的是同一个标签同一个样式属性，其他的会被保留下来。
>
> 即 `!important > 行内 > 内部 > 外部`。

```css
div{
    color: red!important;
    background-color: yellow;
}
```



## 4. CSS选择器

要使用CSS对HTML页面中的元素实现`一对一`、`一对多`或`多对一`的控制。

元素选择符/类型选择符（element选择器），如

```css
div{
	width: 100px;
	height: 100px;
	background: red;
}
```

语法：`元素名称{属性:属性值;}`

### 4.1 class类选择器.

语法：`.class名{属性:属性值;}`

说明：

1. 当使用class选择符时，应先为每个元素定义一个class名称

2. class选择符的语法格式是

   ```css
   如 <div class="top"></div>
   .top{width:200px; height:100px; background:green;}
   ```

用法：class选择器更适合定义一类样式。

> 注意：生效的顺序取决于 style 中的编写顺序，不受 class 定义的影响。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>类选择器</title>
    <style>
        /* 按先后顺序生效 */
        .ibm{
            background-color: blue;
        }
        .soft{
            color: red;
            background-color: yellow;
        }
    </style>
</head>
<body>
    <div>111111</div>
    <!-- class中无顺序效果 -->
    <div class="ibm soft">222222</div>
    <div class="soft ibm">333333</div>
    <div class="ibm">444444</div>
    <div>555555</div>
</body>
</html>
```



### 4.2 id选择器#

语法：`#id名{属性:属性值;}`

说明：

1. 当使用id选择器时，应该给每个元素定义一个id属性

   ```html
   <div id="box"></div>
   ```

2. id选择器语法格式需要加上 `#` 号

   ```css
   #box{width:300px; height:300px;}
   ```

3. 起名要用英文名，且不能使用关键字（所有的标签和属性都是关键字，如head标签）

4. 一个id名称只能对应html文档中一个具体的元素对象（`唯一性`）

```html
<head>
    <style>
        #box1{
            background-color: red;
        }
        #box2{
            background-color: green;
        }
        #box3{
            background-color: blue;
        }
    </style>
</head>
<body>
    <div id="box1">11111</div>
    <div id="box2">22222</div>
    <div id="box3">33333</div>
</body>
```



### 4.3 通配符*

语法：`*{属性:属性值;}`

说明：通配符的写法就是 `*`，含义就是所有元素

如 `*{margin:0; padding:0;}` 代表**清除所有元素的默认边距值和填充值**。

```html
<head>
    <style>
        *{
            margin: 0; /* 外边距 */
            padding: 0; /* 内边距 */
        }
    </style>
</head>
<body>
    <div>11111</div>
    <p>222222</p>
    <h1>3333333</h1>
</body>
```



### 4.4 群组&包含&后代选择器

#### 4.4.1 群组选择器

语法：`选择符1, 选择符2, 选择符3....{属性:属性值;}`

说明：当有多个选择器应用相同的声明时，可以选择用`,`分隔的方式，合并为一组。

```css
margin:0 auto;  /* 实现盒子的水平居中 */
```

举例：

```css
#top1, #nav1, h1{width:960px;}
```



#### 4.4.2 后代or包含选择器

语法：`选择符1 选择符2{属性:属性值;}`

说明：其含义就是选择符1中包含的选择符2

用法：当元素存在父级元素时，需要改变自己本身的样式，可以不另加选择符，直接包含选择器的方式解决

举例：

```html
<head>
    <style>
        /* 后代or包含选择器 */
        div p{
            color: red;
        }
    </style>
</head>
<body>
    <div>
        <p>111111</p> <!-- color 生效 -->
    </div>
    <p>2222222</p>
</body>
```



### 4.5 伪类选择器

语法：

* `a:link{属性:属性值;}`          超链接初始的状态;
* `a:visited{属性:属性值;}`      超链接被访问后状态;
* `a:hover{属性:属性值;}`       超链接鼠标悬停，即鼠标滑过超链接时的状态; - `最常用`
* `a:active{属性:属性值;}`      超链接被激活时，即鼠标按下超链接时的状态;

> Link >> visited >> hover >> active ， 即 L V H A

说明：

1. 当这个4个超链接伪类选择符联合使用时，应注意顺序，正常顺序为：
   a:link, a:visited, a:hover, a:active, 错误的顺序有时会使超链接样式失效。
2. 为了简化代码，可以把相同的声明放在a选择符中
   eg: a{color:red;}  a:hover{color:green;} 表示超链接的初始和访问过后的状态一样，鼠标滑过的状态和点击时的状态一样。

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        /* 初始 */
        a:link{
            color: red;
        }
        /* 访问过后 */
        a:visited{
            color: yellow;
        }
        /* 鼠标滑过 */
        a:hover{
            color: orange;
        }
        /* 点击激活 */
        a:active{
            color: green;
        }
    </style>
</head>
<body>
    <a href="https://www.baidu.com/">百度一下</a>
</body>
```

```html
<head>
    <style>
        /* a:link {
            background-color: black;
            color: white;
        }

        a:visited {
            background-color: black;
            color: white;
        }

        a:hover{
            background-color: red;
        }

        a:active{
            background-color: red;
        } */

        .home{
            background-color: red;
        }
        /* 简写 */
        a{
            background-color: black;
            color: white;
        }
        a:hover{
            background-color: red;
        }
    </style>
</head>

<body>
    <a href="" class="home">首页</a>
    <a href="">国内</a>
    <a href="">国际</a>
    <a href="">军事</a>
    <a href="">关于</a>
</body>
```



### 4.6 选择器【权重】

![image-20251126111744559](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251126111745.png)

> !important > 内联/行内样式 > 包含/后代/群组选择器 > id选择器 > class类选择器 > 元素选择器



## 5. CSS属性

### 5.1 CSS文本属性

![image-20251126112629629](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251126112631.png)

![image-20251126120044989](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251126120046.png)

> font-weight: 
>
> * 100-细体，ligter
> * 400-正常，normal
> * 700-加粗，bold
> * 900-更粗，bolder
>
> ```css
> text-indent: 2em; /* 只对首行生效，当前字体的两倍来缩进，即2个汉字 */
> ```
>
> ```css
> text-decoration: none;/* none 常用在a标签超链接上，用于去掉下划线 */
> ```
>
> ```css
> text-decoration: line-through underline;/* 多个时空格隔开，比如删除线和下划线同时使用 */
> ```
>
> ```css
> text-transform: uppercase; /* capitalize-首字母大写,  lowercase-全小写, uppercase全大写, none-无效果*/
> ```
>
> 

网页浏览器支持的常见字体：

![image-20251126114607451](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251126114608.png)



文本水平位置和行高eg：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .box1{
            text-align: center;
            width: 500px;
            background-color: yellow;
        }
        .box2{
            text-align: justify;  /* 多行文本中有效，两端对齐 */
            width: 500px;
            background-color: green;
        }
        .box3{
            width: 500px;
            height: 100px;
            background-color: yellow;
            line-height: 100px;
            text-align: center;
        }
        .box4{
            width: 500px;
            height: 100px;
            background-color: orange;
            line-height: 15px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="box1">大家好</div>
    <p class="box2">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis voluptatem adipisci officia atque animi earum ullam illum deleniti delectus cupiditate esse corrupti harum alias illo, minus sed ratione et. Enim.</p>
    <div class="box3">大家都很好，好好好啊！</div>
    <p class="box4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic possimus consequatur sequi illum ab quasi voluptatum ea voluptas magni culpa, provident deleniti quaerat pariatur qui similique beatae ipsam delectus error!</p>
</body>
</html>
```



### 5.2 CSS列表属性

![image-20251126154025567](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251126154027.png)

> list-style 复合属性，没有顺序要求，都会生效。

常用：（方便自定义控制列表）

```css
list-style: none;
```



### 5.3 CSS背景属性

![image-20251126155339151](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251126155340.png)

```css
background-color: red;  /* 单词指定颜色 */
background-color: rgb(255, 0, 0);  /* rgb指定为红色 */
background-color: rgba(0, 0, 0, 0.5);  /* rgb指定为红色，并且 0.5 是透明度 */
background-color: #ff0000;  /* 16进制写法指定颜色为红色 */

background-image: url(../html/img/1.png);  /* 图尺寸比当前尺寸小，默认平铺；反之，默认裁掉 */

/* 背景图片平铺方式 */
background-repeat: repeat; /* 平铺【默认】 */
background-repeat: repeat-x; /* x轴平铺 */
background-repeat: repeat-y; /* x轴平铺 */
background-repeat: no-repeat; /* 不平铺【常用】 */

/* 背景图片平铺位置 */
background-position: 20px 20px;     /* 像素控制，距离左侧和上侧，允许为负值 */
background-position: 10% 10%;       /* 百分比控制，不常用 */
background-position: center center; /* left center right, top center bottom */

/* 背景尺寸控制 */
background-size: 800px 800px; /* 拉伸图片会变形 */
background-size: 100% 100%;   /* 拉伸图片会变形 */
/* cover-扩展图片至足够大，背景图完全覆盖背景区域，也许无法显示在背景定位区域中 */
/* contain-扩展图片至最大尺寸，以使其宽度和高度完全适应内容区域，铺不满盒子，留白 */
background-size: cover;

/* 可做视差效果 */
background-attachment: scroll;  /* 滚动 */
background-attachment: fixed;   /* 固定 */

/* 复合写法：空格隔开，顺序可以换（除了位置属性）但不可以少，可以只取一个值-在后面会覆盖前面单独设置的只，其中 background-size 只能单独写，不可以复合 */
background: url(../html/img/1.png) no-repeat center fixed yellow;
```

视差效果示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>视差效果</title>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        div{
            height: 750px;
            background-position: center;
            background-size: cover;
            background-attachment: fixed;
        }
        .box1{
            background-image: url(img/bg1.png);
        }
        .box2{
            background-image: url(img/bg2.png);
        }
        .box3{
            background-image: url(img/bg3.png);
        }
    </style>
</head>
<body>
    <div class="box1"></div>
    <div class="box2"></div>
    <div class="box3"></div>
</body>
</html>
```



### 5.4  CSS浮动属性

![image-20251126164806747](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251126164807.png)

![image-20251126165630977](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251126165633.png)

![image-20251126165857098](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251126165858.png)

![image-20251126165931877](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251126165933.png)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .box1, .box2{
            width: 200px;
            height: 200px;
            float: left;
        }
        .box1{
            background-color: yellow;
        }
        .box2{
            background-color: blue;
        }
        .box3{
            width: 300px;
            height: 300px;
            background-color: red;
            /* clear: both; */
        } 
        .container{
            /* height: 200px; */
            overflow: hidden; /* 通过bfc让给浮动元素计算高度 */
        }
        /* 
          1. 外面盒子写固定高度
          2. 清浮动 clear: none/ left,right,both
          3. 当前浮动元素后面补一个盒子，不设置宽高，clear:both
          4. overflow:hidden;  通过bfc让给浮动元素计算高度
        */
    </style>
</head>
<body>
    <!-- 需求：2个在一行，第3个单独在一行 -->
    <div class="container">
        <div class="box1"></div>
        <div class="box2"></div>
        <!-- <div style="clear:both;"></div> -->
    </div>

    <div class="box3"></div>
</body>
</html>
```

案例：

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
        div {
            float: left;
        }
        div img{
            width: 187px;
            height: 125px;
        }
        div p{
            font-size: 12px;
            text-align: center;
            background: #f6f7f8;
            width: 182px;
        }
    </style>
</head>
<body>
    <div>
        <img src="https://contentcms-bj.cdn.bcebos.com/cmspic/913444a2e714cbedd2071dd175e87f53.jpeg" alt="">
        <p>土家人晒柿忙</p>
    </div>
    <div>
        <img src="https://contentcms-bj.cdn.bcebos.com/cmspic/913444a2e714cbedd2071dd175e87f53.jpeg" alt="">
        <p>土家人晒柿忙</p>
    </div>
    <div>
        <img src="https://contentcms-bj.cdn.bcebos.com/cmspic/913444a2e714cbedd2071dd175e87f53.jpeg" alt="">
        <p>土家人晒柿忙</p>
    </div>
    <div>
        <img src="https://contentcms-bj.cdn.bcebos.com/cmspic/913444a2e714cbedd2071dd175e87f53.jpeg" alt="">
        <p>土家人晒柿忙</p>
    </div>
</body>
</html>
```

![image-20251126171624858](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251126171625.png)



## 6. 盒子模型

![image-20251126171810453](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251126171811.png)

### 6.1 padding 内边距

`padding`

1. 背景色`会`蔓延到内边距
2. 可以单独设置`1到4个值`均可，对应位置不同
3. 可以单独设置某个方向，或将其清0，如上右下左 padding-top/padding-right/padding-bottom/padding-left
4. `*{padding:0}` 清除默认带的内边距样式
5. 设置为负值`没有`意义，即不支持

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        div{
            width: 300px;
            height: 300px;
            background-color: yellow;
            text-align: justify; /* 水平两端对齐 */
            padding: 10px 20px 30px 40px;
            /* 
               padding 内边距：
               1. 1个值，4个方向都一样
               2. 2个值，上下，左右
               3. 3个值，上，左右，下
               4. 4个值，上，右，下，左
            */
        }
    </style>
</head>
<body>
    <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum cum nesciunt beatae dolores sint quisquam nostrum voluptatibus explicabo! Eos illum rem soluta corrupti voluptates quibusdam voluptas incidunt fugit. Voluptates, ipsa.</div>
</body>
</html>
```



### 6.2 border 边框

`border`  边框

样式: solid-实线，double-双实线，dashed-虚线，dotted-点状线

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .box1 {
            width: 100px;
            height: 100px;
            background: yellow;
            border: 10px solid red;
            /* 样式: solid-实线，double-双实线，dashed-虚线，dotted-点状线 */
            /* 背景色也会蔓延到边框 */
        }

        .box2 {
            width: 100px;
            height: 100px;
            background: blue;
            border-top: 5px solid red;
            border-right: 10px double orange;
            border-bottom: 15px dashed gray;
            border-left: 20px dotted green;
        }

        .box3 {
            width: 100px;
            height: 100px;
            background: green;
            border-width: 10px 20px 30px 40px;
            border-color: yellow blue black red;
            border-style: solid double dashed dotted;
        }
    </style>
</head>

<body>
    <div class="box1"></div>
    <hr>
    <div class="box2"></div>
    <hr>
    <div class="box3"></div>
</body>

</html>
```



### 6.3 margin 外边距

`margin` 外边距

1. 背景色`不会`蔓延到内边距
2. 可以单独设置1到4个值均可，对应位置不同，与padding位置一致
3. 可以单独设置某个方向，或将其清0，如上右下左 margin-top/margin-right/margin-bottom/margin-left
4. `*{margin:0}` 清除默认带的外边距样式
5. 设置为负值`有`意义，即支持
6. 快速屏幕居中 `margin: 0 auto;`，即 横向居中。

特性：

* 兄弟关系的盒子，`垂直方向外边距取最大值`；`水平方向外边距会合并处理`。

* 父子关系的盒子，给子加外边距，但作用在了父上，如何解决？

  1. 方案①：在`父盒子中加padding`，注意高度计算

  2. 方案②：给`父盒子设置透明边框border`，子盒子的margin则就会生效在自己身上

     ```css
     border: 1px solid transparent;  /* transparent 边框透明 */
     ```

  3. 方案③：给`父盒子或者子盒子加浮动`都可以，即可让子盒子的margin生效在自己身上

  4. 方案④：给父盒子加上 `overflow: hidden;`触发bfc去计算距离，也能生效

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        div {
            width: 200px;
            height: 200px;
        }
        .box1 {
            background: red;
            border: 1px solid yellow;
            margin: 50px 100px;
        }

        .box2 {
            background: blue;
            border: 1px solid yellow;
            margin: 0 auto; /* 横向居中 */
        }

        .box3 {
            background: green;
            border: 1px solid yellow;
            margin-left: -100px; /* 支持负值 */
        }
    </style>
</head>

<body>
    <div class="box1"></div>
    <div class="box2"></div>
    <div class="box3"></div>
</body>

</html>
```





























