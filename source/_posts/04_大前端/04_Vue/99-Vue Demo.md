---
title: 99-Vue Demo
date: 2018-5-22 21:36:21
tags:
- Vue
categories: 
- 04_大前端
- 04_Vue
---

![image-20200723170734421](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200723170735.png)

官网（中文）教程：https://cn.vuejs.org/



### 1. 简介

#### 1.1 渐进式框架

Vue (读音 /vjuː/，类似于 **view**) 是一套用于构建用户界面的**渐进式框架**。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与[现代化的工具链](https://cn.vuejs.org/v2/guide/single-file-components.html)以及各种[支持类库](https://github.com/vuejs/awesome-vue#libraries--plugins)结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。



#### 1.2 入门

1. 引入 vue.js

```js
<!-- CDN 方式 -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

2. 标签绑定 Vue 对象

3. 实例化 Vue 对象

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<!-- 开发环境版本，包含了有帮助的命令行警告 -->
		<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
	</head>
	<body>
		<!-- 声明标签 绑定 Vue 使用Vue的数据 -->
		<div id="app">
			<!-- 插值 获取Vue Data中的内容 -->
		  {{ message }}
		  <p>{{name}}</p>
		</div>
		<script>
			// 实例化Vue对象,并设置绑定的标签
		var app = new Vue({
			  el: '#app',   //设置标签 只支持ID
			  data: {  //数据源
			    message: 'Hello Vue!',
				name:"测试"
			  }
			})
		</script>
	</body>
</html>
```



### 2. Vue.js 核心

Vue.js 提供一整套的渲染页面标签的操作，比如基本文件插值、分支、循环、事件绑定、属性绑定、自定义组件等。

```js
<script>
    var app = new Vue({ //实例化Vue对象
        el: "#id" //绑定标签【只能绑定id值，唯一】
        ,data: { //数据源
            message: "hello, vue!"
        }
    });
</script>
```

#### 2.1 文本插值

标签中使用 Vue 对象的数据，格式：`{{名称}}`



#### 2.2 绑定属性

属性的值和 Vue 对象的数据进行绑定，格式：`vue-bind:属性='值'` 简写：`:属性='值'`

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<!-- 开发环境版本，包含了有帮助的命令行警告 -->
		<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
	</head>
	<body>
		<!-- 声明标签 绑定 Vue 使用Vue的数据 -->
		<div id="app">
			<p> {{msg1}}</p>
			<p v-bind:class="mcls1" v-html="msg1"></p>
			<p v-once>{{msg1}}</p>
			<p>{{mflag==1?'有效':'无效'}}</p>
		</div>
		<script>
			// 实例化Vue对象,并设置绑定的标签
		var app = new Vue({
			  el: '#app',   //设置标签 只支持ID
			  data: {  //数据源
			    msg1:'<h1>看看，吃了吗</h1>',
				mcls1:'red',
				mflag: 1
			  }
			})
		</script>
		<style>
			.red{
				color: red;
			}
			.green{
				color: green;
			}
		</style>
	</body>
</html>
```



#### 2.3 分支语句

`v-if`  / `v-else` / `v-else-if`

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<!-- 开发环境版本，包含了有帮助的命令行警告 -->
		<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
		<script src="js/jquery-3.3.1.js"></script>
	</head>
	<body>
		<!-- 声明标签 绑定 Vue 使用Vue的数据 -->
		<div id="app">
			<div >
				<div v-if="islogin">
					<h3>张三</h3>
				</div>
				<div v-else>
					还未登录，请点击<a href="">登录</a>
				</div>
			</div>
		</div>
		<button onclick="add()">获取令牌</button>
		<button onclick="del()">删除令牌</button>
		<script>
			// 实例化Vue对象,并设置绑定的标签
		var app = new Vue({
			  el: '#app',   //设置标签 只支持ID
			  data: {  //数据源
				islogin:false
			  }
			})
		$(function(){
			 var t=localStorage.getItem("usertoken");
			 console.log(t);
			 if(t){
				 app.islogin=true;
			 }
		})
		function add(){
			localStorage.setItem("usertoken","aass");
			 app.islogin=true;
		}
		function del(){
			localStorage.removeItem("usertoken");
			app.islogin=false;
		}
		</script>
		
	</body>
</html>
```



#### 2.4 循环语句

`v-for`

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<!-- 开发环境版本，包含了有帮助的命令行警告 -->
		<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
		<script src="js/jquery-3.3.1.js"></script>
	</head>
	<body>
		<!-- 声明标签 绑定 Vue 使用Vue的数据 -->
		<div id="app">
			<div>
				<ol>
					<li v-for="s in msgs">
						{{s}}
					</li>
				</ol>
			</div>
			<div>
				<h1>后端数据的获取</h1>
				<h2><button onclick="getData()">获取数据</button></h2>
				<table>
					<thead>
						<tr>
							<th>序号</th>
							<th>招聘id</th>
							<th>名称</th>
							<th>公司</th>
							<th>薪水</th>
						</tr>
						<tbody>
							<tr v-for="j in jobs">
								<td>{{j.id}}</td>
								<td>{{j.jno}}</td>
								<td>{{j.jname}}</td>
								<td>{{j.company}}</td>
								<td>{{j.salary}}</td>
							</tr>
						</tbody>
					</thead>
				</table>
			</div>
		</div>
		<script>
			// 实例化Vue对象,并设置绑定的标签
		var app = new Vue({
			  el: '#app',   //设置标签 只支持ID
			  data: {  //数据源
				msgs:["Java","Ruby","Go","Python"],
				jobs:[]
			  }
			})
		function getData(){
			$.ajax({
				url:"http://localhost:8080/api/job/all.do",
				success:function(r){
					if(r.code==0){
						app.jobs=r.data.content;
					}
				}
			})
		}
		</script>
	</body>
</html>
```



#### 2.5 绑定事件

`v-on:事件="回调名称"`，Vue 对象中 methods 中的属性-回调名称

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<!-- 开发环境版本，包含了有帮助的命令行警告 -->
		<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
	</head>
	<body>
		<!-- 声明标签 绑定 Vue 使用Vue的数据 -->
		<div id="app">
			<button v-on:click="dianji">点我</button>
			<button @click="dianji">点我</button>
			<p>你一个点了 {{count}} 次</p>
		</div>
		<script>
			// 实例化Vue对象,并设置绑定的标签
		var app = new Vue({
			  el: '#app',   //设置标签 只支持ID
			  data: {  //数据源
			    message: 'Hello Vue!',
				count:1
			  },
			  methods:{
				  dianji:function(){
					  this.count++;
				  }
			  }
			})
		</script>
	</body>
</html>
```

#### 2.6 点击事件动态传参

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>vue 带下标循环、点击事件动态id赋值和事件传参</title>
		<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
	</head>
	<body>
		<div id="test">
			<!-- 普通带 index 下标的 vue v-for 循环，和 点击事件实现动态传参 -->
			<div v-for="(t, index) in testList" v-if="t <= 3">
				<h3>h3：这是值 {{t}}, 遍历下标 index={{index}}。</h3>
				<a href="t01-click.html" id="a1" v-bind:id=t v-on:click="getId($event)">超链接{{t}}</a>
			</div>
			<!-- 简写版    :id 等价于 v-bind:id    v-on:click 等价于 @click -->
			<div v-for="(p, index) in pageList" v-if="p === 'p2.html'">
				<h3>p2.html：这是值 {{p}}, 遍历下标 index={{index}}。</h3>
				<a href=p id="a1" :id=p @click="getId($event)">{{p}}</a>
			</div>
		</div>

	</body>
	<script>
		var app = new Vue({
			el: "#test",
			data: {
				testList: [1, 2, 3, 4, 5], // 如 ajax 异步请求后，赋值给 app.testList
				pageList: ['p1.html', 'p2.html', 'p3.html', 'p4.html', 'p5.html']
			},
			methods: {
				getId: function(e) {
					alert(e.currentTarget); // href属性的绝对路径值：http://127.0.0.1:8848/TestVue/t01-click.html
					alert(e.currentTarget.id); // 获取 v-bind:id=值 中绑定的 id 的值，此 id 为其标签中的属性，且不会与非绑定的 id 冲突
					for (var i = 0; i < app.idList.length; i++) {
						console.log(app.idList[i]);
					}
				}
			}
		});
	</script>
</html>
```

