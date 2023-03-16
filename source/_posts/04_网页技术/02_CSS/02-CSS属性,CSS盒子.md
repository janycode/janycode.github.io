---
title: 02-CSS属性,CSS盒子
date: 2017-4-28 22:23:58
tags:
- CSS
- 属性
categories: 
- 04_网页技术
- 02_CSS
---

### 1. CSS 样式属性

#### 1.1 字体 font-xxx
定义文本的字体系列、大小、加粗、风格（如斜体）和变形（如小型大写字母）。
- font	简写属性。作用是把所有针对字体的属性设置在一个声明中。eg：font:oblique 700 30px "黑体"; /* 样式 加粗 大小 风格 */
- font-family	设置字体系列。
- font-size	设置字体的尺寸。
- font-style	设置字体风格。（斜体）
- font-weight	设置字体的粗细。

#### 1.2 文本 text-xxx, color...
改变文本的颜色、字符间距，对齐文本，装饰文本，对文本进行缩进，等等。
- color	设置文本颜色
- direction	设置文本方向。
- line-height	设置行高。
- text-align	对齐元素中的文本。（左对齐、居中、右对齐）
- text-decoration	向文本添加修饰。（上划线、下划线、删除线、无线条）
- text-indent	缩进元素中文本的首行（2em : 2个字符；20% : 20%的宽度）
- text-transform	控制元素中的字母。（全大写、全小写、所有单词首字母大写）
- unicode-bidi	设置文本方向。
- white-space	设置元素中空白的处理方式。（="nowrap" 禁止文本分行，即都在1行内）
- letter-spacing	设置字符间距。
- word-spacing	设置单词间距。

#### 1.3 背景 background-xxx
- background-color：设置背景颜色，默认透明
- background-image:url("图片路径");设置背景图片
- background-size: 设置背景图片的尺寸属性
- background-repeat:
        repeat-y:只在垂直方向都平铺
        repeat-x:只在水平方向都平铺
        repeat:在水平垂直方向都平铺
        no-repeat:任何方向都不平铺

- background-position: 改变图像在背景中的位置。top、bottom、left、right 和 center(1个位置值或多个组合位置值)
/*简写 没有顺序*/
- background: red center no-repeat url(img/003.jpg);  
#### 1.4 列表 list-style-xxx
- list-style-type:decimal;改变列表的标志类型
- list-style-image: url("images/dog.gif");用图像表示标志
- list-style-position: inside;确定标志出现在列表项内容之外还是内容内部
简写
- list-style: decimal url(img/001.png) inside;
去掉样式:
- list-style:none;
- list-style-type:none;
#### 1.5 尺寸 width, height, line-height
- width:设置元素的宽度
- height:设置元素的高度
- line-height:设置元素的行高

#### 1.6 显示 display
- display:
    none 不显示
    block 块级显示 默认
    inline 行级显示
    inline-block 行级块
    flex 伸缩布局

#### 1.7 轮廓 outline-xxx
轮廓（outline）
绘制于元素周围的一条线，位于边框边缘的外围，可起到突出元素的作用。常用属性：
- outline-style:
    solid(实线)  dotted(虚线)  dashed(虚线的每段较长)  double(框为空心);  设置轮廓的样式
- outline-color:red;  设置轮廓的颜色
- outline-width:10px  设置轮廓的宽度

#### 1.8 浮动 float, clear
- float="?"
left 左浮动    right 右浮动    none 不浮动    inherit 继承父元素
* 浮动起来的元素会遮盖没有浮动属性的元素

- clear="?"
left 左侧不允许浮动元素
right 右侧不允许浮动元素
both 左右两侧均不允许浮动元素
none 默认，允许浮动元素出现在两侧
inherit 继承父元素

#### 1.9 定位 position, left, right, top, bottom
- position:
    static(默认)
    relative(相对) 相对自身原来的位置偏移某个距离，原本所占的空间仍然保留。
    absolute(绝对) 相对于已定位的父元素，如无已定位的父元素则相对于浏览器，不保留原空间。
    fixed(固定) 固定加载位置，不会因为滚动而变化位置
- left - 相对浏览器左边
- right - 相对浏览器右边
- top - 相对浏览器顶端
- bottom - 相对浏览器底端

> 注意：body有默认的margin(`8px`)

### 2. CSS 盒子模型
![CSS 盒子模型](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316141849.png)
1. 边框 `border`
- border-style:边框样式，值有以下情况：
    solid:实线
    double:空心线
    dashed:虚线组成的边框
    dotted:圆点组成的边框
- border-color:边框颜色
- border-width:边框宽度
简写
- border: 1px solid red;
2. 外边距 `margin`
- margin:外间距,边框和边框外层元素的距离
    四个方向的距离(top right bottom left)
- margin-top:像素值px;
- margin-bottom:像素值px;
- margin-left:像素值px;
- margin-right:像素值px;
3. 内边距 `padding`
- padding:内间距,元素内容和边框之间的距离((top right bottom left))
- padding-left:像素值px;
- padding-right:像素值px;
- padding-top:像素值px;
- padding-bottom:像素值px;

> 盒子模型的`实际的宽度：width+2*(padding+border+margin)`
> 盒子模型的`实际的高度：height+2*(padding+border+margin)`

### 3. CSS3 扩展属性
1. 圆角 `border-radius`
border-radius:50%; //圆角半径
可以将正方形图片切为圆形。
2. 阴影 `xxx-shadow`
相对于自身原来的位置偏移x,y像素值  模糊半径值  颜色值
box-shadow:10px 10px 5px #888888; //方框阴影属性
text-shadow:5px 5px 5px #ffff00; //文本阴影属性
3. 背景图片 `background-xxx`
\<body style="text-align: center;
    background:url(img/1.png);
    background-size: 200px 300px;
    background-repeat: no-repeat;">
\</body> //背景图片尺寸，不平铺
background-image:url(bg_flower.gif),url(bg_flower_2.gif); // 多张背景图
