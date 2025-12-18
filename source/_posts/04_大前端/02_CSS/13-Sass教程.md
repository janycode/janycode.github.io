---
title: 13-Sass教程
date: 2017-4-28 22:23:58
tags:
- CSS
- CSS3
- sass
categories: 
- 04_大前端
- 02_CSS
---

![image-20251125100829463](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251128131801.png)



参考资料：

* sass官网：https://sass-lang.com.cn/
* sass教程：https://sass-lang.com.cn/documentation/



## 1. 介绍

`sass`最成熟、最稳定、最强大的专业级css扩展语言

* sass是css的预编译工具
* 更优雅的书写css
* 需要转换成css才能让浏览器认识和运行



安装一个插件：`Easy Sass`

* 可以自动将`.scss`的样式代码文件转成 css 代码文件，即会自动生成 `.css` 和 `.min.css` 两个文件

![image-20251216184955175](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251216184956.png)



## 2. 语法

创建文件格式为 `.scss` 文件后缀。不建议 .sass （因为格式要求太严格，极易出错）

### 2.1 变量

Sass 使用 `$` 符号来使某些内容成为变量。

```scss
$color: blue;
$width: 100px;

.box{
    background: $color;
    width: $width;
}

.box2{
    width: $width * 2;
}

.footer{
    border-top: 1px solid $color;
}
```

![image-20251216185818531](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251216185819.png)



### 2.2 if 条件

`@if - @else`   条件判断仅支持 `==` ，注意没有 *===* 。

```scss
$isShowTab: true;
$isRed: true;

@if ($isShowTab == true) {
    .tabbar{
        position: fixed;
        left: 0;
        top: 0;
    }
}

@else {
    .tabbar{
        position: relative;
    }
}

div{
    width: 100px;
    height: 100px;
    @if ($isRed == true) {
        background: red;
    } @else {
        background: yellow;
    }
}
```

![image-20251216192437039](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251216192437.png)

### 2.3 for 循环

```scss
// from 1 to 6: 1,2,3,4,5
// from 1 through 6: 1,2,3,4,5,6
@for $item from 1 through 6 {
    li:nth-child(#{$item}){
        position: absolute;
        left: ($item - 1) * 100px;
        top: ($item - 1) * 100px;
    }
}
```

![image-20251216192505465](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251216192506.png)

### 2.4 each 遍历

```scss
$colors: red, green, yellow;

@each $item in $colors {
    $index: index($colors, $item);
    li:nth-child(#{$index}){
        background: $item;
    }
}
```

![image-20251216192532448](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251216192533.png)

### 2.5 mixin 混入

`@mixin` 与 `@include` 类似`函数` 和 `函数调用`，而且支持传参 和 默认值。

```scss
@mixin jerry_transition($a:all, $b:1s) {
    transform: $a $b;
    -webkit-transform: $a $b;
    -moz-transform: $a $b;
}

.box {
    @include jerry_transition()
}

.box1 {
    @include jerry_transition(width, 2s)
}
```

![image-20251216192601483](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251216192602.png)

## 3. 嵌套

按照层级去写，就可以转换为层级的样式。

```scss
div {
    width: 100px;
    height: 100px;
    p {
        width: 50px;
        height: 50px;
        span {
            color: red;
        }
    }
}
```

```scss
ul {
    > li {
        background: yellow;
        // & 代表它自己，必须加
        &:hover {
            background: red;
        }
        &:active {
            background: blue;
        }
    }
}
```

![image-20251216192339424](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251216192340.png)



## 4. 继承

`基样式` + `@extend 基样式;`  使用定义的基础样式，并在需要的元素上继承该样式

```scss
.base {
    width: 100px;
    height: 100px;
    outline: auto;
}

.btn1 {
    @extend .base;
    background: green;
}

.btn2 {
    @extend .base;
    background: red;
}
```

![image-20251216192931458](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251216192933.png)



## 5. 导入

`@import "路径"` 导入公共的基样式文件。

base.scss

```scss
$color: blue;
$width: 100px;
```

导入.scss

```scss
@import "./base.scss";

.box-jerry {
    color: $color;
    width: $width;
}
```

![image-20251216193336862](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251216193337.png)











