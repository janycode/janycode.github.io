---
title: Java高性能海报绘制设计
date: 2021-07-02 10:18:02
tags:
- 海报绘制
categories: 
- 08_框架技术
- 13_Poster
---

参考资料: Graphics2D绘图，基于Java绘图封装的工具 生成海报图片
https://www.cnblogs.com/Lbox/p/14368349.html
https://blog.csdn.net/qq_26212181/article/details/97621758



### 1. 海报设计规范

- 海报**宽,高,上边距,左边距等**单位为px,且必须为整数
- 海报**宽,高** 最好设计为**偶数**,方便painter-custom-poster可视化编辑时进行缩放计算

- 相同类型的海报最好设计为统一模板，减少逻辑复杂度
- 使用统一模板时，须考虑文字长度变化，兼顾不同行数或不同元素数量时海报美观性

- 每一个元素目前设计为占用固定的位置,并为可变元素设计超限时展示方案. 避免因为某个元素内容变化破坏海报美观

### 2. 海报实现方案

1. 使用开源前端方案 painter-custom-poster 按照UI设计图画出海报模板
   painter-custom-poster: https://lingxiaoyi.github.io/painter-custom-poster/
2. 导出json代码
1. 对json代码进行自定义处理
4. 测试模板，对json进行微调
1. 为需自定义填充内容的VIEW对象设置标签，该标签对应JAVA代码中的填充逻辑
2. 确认模板没有问题，将模板及调试json导入数据表UaPostertemplate
7. 优劣：功能比较稳定，执行效率高于freemarker模板渲染 + xhtmlrenderer转换的方案；但是扩展性不足，有复杂的调整都必须改动后端代码，对于样式的支持不太好，定位坐标计算复杂。

### 3. 海报模板JSON定义规范

后端设计海报最大的问题在于调试不方便，如果没有可视化界面，需要计算每一个元素的坐标，宽高或字体的颜色大小，调试一张海报可能需要一天的时间。 所以设计过程中结合了一款前端开源海报可视化编辑项目 painter-custom-poster进行调试。
painter-custom-poster可以对图片，文字，矩形元素进行可视化调整，然后导出json格式文档。
我们生成海报的模板就以此json文档为基础，添加适当的自定义字段后，由JAVA解析JSON渲染生成海报图片。
painter-custom-poster还可以导出调试JSON，可以在需要时再次导入此JSON恢复调试页面，方便后续再次调试。

| 字段               | 说明                                                         | 是否支持              |
| ------------------ | ------------------------------------------------------------ | --------------------- |
| **rotate**         | **旋转，按照顺时针旋转的度数**                               | ×                     |
| **width**          | **view的宽度**                                               | √                     |
| **height**         | **view的高度**                                               | √                     |
| **top**            | **上边距**                                                   | √                     |
| **left**           | **左边距**                                                   | √                     |
| **background**     | **背景颜色示例:#f8f8f8**                                     | √                     |
| **borderRadius**   | **边框圆角半径**                                             | √                     |
| **borderWidth**    | **边框宽**                                                   | √                     |
| **borderColor**    | **边框颜色**                                                 | √                     |
| **shadow**         | **阴影**                                                     | ×                     |
| **text**           | **字体内容**                                                 | √                     |
| **maxLines**       | **最大行数**                                                 | √                     |
| **lineHeight**     | **行高（上下两行文字baseline的距离）**                       | √                     |
| **fontSize**       | **字体大小**                                                 | √                     |
| **color**          | **字体颜色**                                                 | √                     |
| **fontWeight**     | **字体粗细。仅支持 normal， bold**                           | √                     |
| **textDecoration** | **文本修饰，支持none** **underline、 overline、 linethrough** | 不支持**overline**    |
| **textStyle**      | **fill： 填充样式** **stroke：镂空样式(咱不支持)**           | 不支持stroke          |
| **fontFamily**     | **字体,请使用Linux支持的字体**                               | **overline**          |
| **textAlign**      | **文字的对齐方式 todo** **分为 left， center， right**       | ×                     |
| **url**            | **图片路径**                                                 | √                     |
| **mode**           | **图片裁剪、缩放的模式** **- scaleToFill 缩放图片到固定的宽高** **- aspectFill 图片裁剪显示对应的宽高** **- auto 自动填充 宽度全显示 高度自适应居中显示** | 只支持**scaleToFill** |
| **wrapLine**       | **自定义字段:从此行开始,换行后X坐标起始位置重定位到wrapLeft位置,** | √                     |
| **wrapLeft**       | **自定义字段: 换行后X轴起始坐标**                            | √                     |
| **marginTop**      | **自定义字段:外边距:上**                                     | ×                     |
| **marginLeft**     | **自定义字段:外边距:左**                                     | ×                     |
| **marginBottom**   | **自定义字段:外边距:下**                                     | ×                     |
| **marginRight**    | **自定义字段:外边距:右**                                     | ×                     |
| **moneySign**      | **￥**                                                       | √                     |

```json
{
	"width": "1008",
	"height": "1602",
	"background": "#000000",
	"views": [{
		"type": "image",
		"url": "http://test.demo.com/api/file/download?action=view&path=2021/03/16/16158554792140287.png",
		"css": {
			"width": "1008",
			"height": "1602",
			"top": "0",
			"left": "0",
			"rotate": "0",
			"borderRadius": "",
			"borderWidth": "",
			"borderColor": "#000000",
			"shadow": "",
			"mode": "scaleToFill"
		}
	}, {
		"type": "image",
		"url": "https://ufile.demo.com/api/file/download?action=view&path=2020/07/03/15937749164690247.jpg",
		"css": {
			"width": "887",
			"height": "490",
			"top": "60",
			"left": "60",
			"rotate": "0",
			"borderRadius": "72",
			"borderWidth": "",
			"borderColor": "#000000",
			"shadow": "",
			"mode": "scaleToFill"
		},
		"customTag": "posterCover"
	}, {
		"type": "image",
		"url": "https://test.demo.com/api/file/download?action=view&path=2021/02/04/16124267185430837.jpeg",
		"css": {
			"width": "241",
			"height": "241",
			"top": "863",
			"left": "87",
			"rotate": "0",
			"borderRadius": "",
			"borderWidth": "",
			"borderColor": "#000000",
			"shadow": "",
			"mode": "scaleToFill"
		},
		"customTag": "appletQrCode"
	}, {
		"type": "image",
		"url": "http://test.demo.com/api/file/download?action=view&path=2021/03/06/16149979435930666.jpg",
		"css": {
			"width": "135",
			"height": "135",
			"top": "1248",
			"left": "60",
			"rotate": "0",
			"borderRadius": "135",
			"borderWidth": "",
			"borderColor": "#000000",
			"shadow": "",
			"mode": "scaleToFill"
		},
		"customTag": "wxAvatar"
	}, {
		"type": "text",
		"text": "二级建造师【备考须知】，你想知道的备考攻略都在这里！二级建造师【备考须知】，你想知道的备考攻略都在这里！",
		"css": {
			"color": "#000000",
			"background": "",
			"width": "887",
			"height": "222",
			"top": "593",
			"left": "60",
			"rotate": "0",
			"borderRadius": "",
			"borderWidth": "",
			"borderColor": "#000000",
			"shadow": "",
			"padding": "0",
			"fontSize": "48",
			"fontWeight": "bold",
			"maxLines": "3",
			"lineHeight": "73.26",
			"textStyle": "fill",
			"textDecoration": "none",
			"fontFamily": "",
			"textAlign": "left"
		},
		"customTag": "posterText"
	}, {
		"type": "text",
		"text": "刘老师",
		"css": {
			"color": "#000000",
			"background": "",
			"width": "109",
			"height": "41",
			"top": "1263",
			"left": "226",
			"rotate": "0",
			"borderRadius": "",
			"borderWidth": "",
			"borderColor": "#000000",
			"shadow": "",
			"padding": "0",
			"fontSize": "36",
			"fontWeight": "normal",
			"maxLines": "1",
			"lineHeight": "39.96",
			"textStyle": "fill",
			"textDecoration": "none",
			"fontFamily": "",
			"textAlign": "left"
		},
		"customTag": "userName"
	}, {
		"type": "text",
		"text": "给您推荐",
		"css": {
			"color": "#999999",
			"background": "",
			"width": "133",
			"height": "38",
			"top": "1263",
			"left": "364",
			"rotate": "0",
			"borderRadius": "",
			"borderWidth": "",
			"borderColor": "#000000",
			"shadow": "",
			"padding": "0",
			"fontSize": "33",
			"fontWeight": "normal",
			"maxLines": "1",
			"lineHeight": "36.63",
			"textStyle": "fill",
			"textDecoration": "none",
			"fontFamily": "",
			"textAlign": "left"
		}
	}, {
		"type": "text",
		"text": "精彩内容尽在小程序中，快来看一看吧",
		"css": {
			"color": "#999999",
			"background": "",
			"width": "614",
			"height": "41",
			"top": "1339",
			"left": "226",
			"rotate": "0",
			"borderRadius": "",
			"borderWidth": "",
			"borderColor": "#000000",
			"shadow": "",
			"padding": "0",
			"fontSize": "36",
			"fontWeight": "normal",
			"maxLines": "1",
			"lineHeight": "39.96",
			"textStyle": "fill",
			"textDecoration": "none",
			"fontFamily": "",
			"textAlign": "left"
		}
	}]
}
```



### 4. 扩展功能

1. 支持流式布局，自适应生成海报长度
2. 支持图片旋转

1. 支持文字旋转
2. 支持文字上划线

1. 支持文字排列方式设置
2. 支持线段绘制

1. 支持多边形绘制