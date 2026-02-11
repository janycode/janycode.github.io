---
title: 中午吃什么？
date: 2016-10-20 02:36:08
---

<center>
	世界难题"中午吃什么？"解决方案：<br><br><br><br>
	<span id="food"></span>
	<hr style="width: 450px;" />
	<input type="text" id="inputText" style="height: 25px; border: gray solid 1px;" placeholder="请输入1个候选" />
	<input type="button" id="button" style="font-size: 22px; border: gray solid 1px;" value="添加" onclick="addToPool()" /> <br><br>
	当前随机候选池：<span id="pool"></span><br><br>
	<input type="button" id="button" style="font-size: 25px; border: gray solid 1px;" value="清空" onclick="clearPool()" />
	<input type="button" id="startOrStop" style="font-size: 25px; color: orangered; border: gray solid 1px;" value="开始" onclick="run()" /><br><br>
</center>
<script type="text/javascript">
	var arr = []; // 随机候选池
	window.onload = show();
	function show() {
		var pool = document.getElementById("pool");
		var optStr = '';
		if (arr.length < 1) {
			optStr = "当前暂无候选项，请逐个添加！";
		}
		for (var i = 0; i < arr.length; i++) {
			if (i == arr.length - 1) {
				optStr += arr[i];
			} else {
				optStr += arr[i] + ",";
			}
		}
		pool.innerText = optStr;
	}
	function clearPool() {
		arr = '';
		document.getElementById("inputText").value = '';
		show();
	}
	function addToPool() {
		var inputText = document.getElementById("inputText");
		//alert(inputText.value);
		arr[arr.length] = inputText.value;
		show();
	}
	function getFood() {
		// 随机下标
		var index = Math.floor(Math.random() * arr.length);
		var code = arr[index];
		var spanNode = document.getElementById("food");
		spanNode.innerText = code;
		spanNode.style.fontSize = "99px";
		spanNode.style.color = "red";
		spanNode.style.backgroundColor = "lightyellow";
		spanNode.style.fontFamily = "楷体";
	}
	var id = 0;
	function run() {
		if (id) {
			document.getElementById("startOrStop").value = "开始";
			clearInterval(id);
			id = 0;
		} else {
			document.getElementById("startOrStop").value = "暂停";
			id = setInterval("getFood()", 50);
		}
	}
</script>



