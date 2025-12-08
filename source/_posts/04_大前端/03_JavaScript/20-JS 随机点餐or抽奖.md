---
title: 20-JS 随机点餐or抽奖
date: 2018-5-24 21:36:21
tags:
- JavaScript
- 抽奖
categories: 
- 04_大前端
- 03_JavaScript
---



Demo 演示地址：http://janycode.github.io/random/index.html



![image-20200604120359746](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200604120359746.png)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
	</head>
	<body onload="getFood()">
		世界难题"中午吃什么？"解决方案：<br><br>
		<center>
			<span id="food"></span>
			<hr style="width: 450px;" />
			<input type="button" id="button" style="font-size: 30px;" value="开始" onclick="run()" />
		</center>
	</body>
	<script type="text/javascript">
		function getFood() {
			var arr = ['盖浇饭', '油泼面', '焖面', '凉皮', '兰州拉面', '炒面', '热干面'];
			// 随机下标
			var index = Math.floor(Math.random() * arr.length);
			var code = arr[index];
			var spanNode = document.getElementById("food");
             // 设置样式
			spanNode.innerText = code;
			spanNode.style.fontSize = "99px";
			spanNode.style.color = "red";
			spanNode.style.backgroundColor = "lightyellow";
			spanNode.style.fontFamily = "楷体";
		}

		var id;
		var cnt = 0; // 必须赋初始值，否则自增操作无法运算，不能停止。
		function run() {
			cnt++;
			if (cnt % 2 == 0) {
				document.getElementById("button").value = "开始";
				clearInterval(id);
			} else {
				document.getElementById("button").value = "暂停";
				id = setInterval("getFood()", 50);
			}
		}
	</script>
</html>
```

