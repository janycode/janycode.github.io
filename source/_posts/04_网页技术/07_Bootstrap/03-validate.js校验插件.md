---
title: 03-validate.js校验插件
date: 2018-5-26 21:36:21
tags:
- Bootstrap
- 校验
categories: 
- 04_网页技术
- 06_JavaScript
---

### 1. validate.js 校验插件

> -  validate: jquery的一个插件,依赖jquery使用，Validation是历史最悠久的jQuery插件之一，经过了全球范围内不同项目的验证，并得到了许多Web开发者的好评。作为一个标准的验证方法库，Validation拥有如下特点：
>   -  内置验证规则： 拥有必填、数字、Email、URL和信用卡号码等19类内置验证规则
>   - 自定义验证规则： 可以很方便地自定义验证规则
>   - 简单强大的验证信息提示： 默认了验证信息提示，并提供自定义覆盖默认的提示信息的功能
>   - 实时验证： 可能通过keyup或blur事件触发验证，而不仅仅在表单提交的时候验证

### 2. 导入引入

**导入** 3 个 js 文件：

* `jquery-3.2.1.min.js`
* `validate.min.js`
* `messages_zh.js`

**引入** 3 个 js 文件：

```js
<!-- 文件引入顺序不能变 -->
<script src="js/jquery-3.2.1.min.js" type="text/javascript" charset="utf-8"></script>
<script src="js/validate.min.js" type="text/javascript" charset="utf-8"></script>
<script src="js/messages_zh.js" type="text/javascript" charset="utf-8"></script>
```

> -  页面加载成功后!对表单进行验证!  $("选择器").validate({ ... });
> -  在validate中编写校验规则

```javascript
$("选择器").validate(
	rules:{},
	messages:{}
);
```

### 3. 校验规则

> 默认校验规则

| 属性               | 描述                                                         |
| :------------------: | ------------------------------------------------------------ |
| required:true      | 必输字段，或者`单个非空校验时使用 username:"required"`       |
| remote:"check.jsp" | 使用ajax方法调用check.php验证输入值                          |
| email:true         | 必须输入正确格式的电子邮件                                   |
| url:true           | 必须输入正确格式的网址                                       |
| date:true          | 必须输入正确格式的日期 日期校验ie6出错，慎用                 |
| dateISO:true       | 必须输入正确格式的日期(ISO)，例如：2009-06-23，1998/01/22 只验证格式，不验证有效性 |
| number:true        | 必须输入合法的数字(负数，小数)                               |
| digits:true        | 必须输入整数                                                 |
| creditcard:        | 必须输入合法的信用卡号                                       |
| equalTo:"#field"   | 输入值必须和#field相同，`通过name验证格式 equalTo:"[name=pwd]"` |
| accept:            | 输入拥有合法后缀名的字符串（上传文件的后缀）                 |
| maxlength:5        | 输入长度最多是5的字符串(汉字算一个字符)                      |
| minlength:10       | 输入长度最小是10的字符串(汉字算一个字符)                     |
| rangelength:[5,10] | 输入长度必须介于 5 和 10 之间的字符串")(汉字算一个字符)      |
| range:[5,10]       | 输入值必须介于 5 和 10 之间                                  |
| max:5              | 输入值不能大于5                                              |
| min:10             | 输入值不能小于10                                             |

###  4. 使用步骤

```javascript
$(function(){
    $("#formId").validate({
        rules:{
            //1.校验元素的name属性  username:"校验器" 使用单一的校验器
            //2.校验元素的name属性  username:{校验器:"值",校验器:"值"}
            username:"required",
            password:{required:true,digits:true},
            repassword:{equalTo:"[name='password']"},
            zxz:{min:3,required:true},
            shuzhiqujian:{range:[5,10],required:true}
        },
        messages:{
            username:"xxx",
            password:{required:"req",digits:"dddd"},
            zxz:{min:"最小值应该大于{0}"},
            shuzhiqujian:{range:"值应该在{0}-{1}之间!"}
        }
    });
})
```

> - 实现步骤：
>   - 导入jquery.js和validate.js，messages_zh.js中文提示
>   - 加载完成 进行验证 username 必填
>   - 用户名必须设置
>   - messages
>     - name的属性:提示信息
>     - name的属性:{校验器:"xx","校验器":"xxx"}
>     - username:"xxx",
>     - password:{required:"req",digits:"dddd"}
>     - 此处可以导入messages中文提示库!	
>   - 密码须为数字 ：password:{required:true, digits:true}
>   - 重复密码：equalTo:"#field"  repassword:{equalTo:"[name='password']"}	
>   - 最小值	：min 注意 需要添加必填
>   - 动态修改提示的值：0是索引!!    zxz:{min:"最小值应该大于{0}"}

```javascript
$(function(){
			$("#formId").validate({
			rules:{
				//1.校验元素的name属性  username:"校验器" 使用单一的校验器
				//2.校验元素的name属性  username:{校验器:"值",校验器:"值"}
				username:"required"
			},
			messages:{}
	});	
})   	 
```

### 5. Demo

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
	</head>
	<!-- 文件引入顺序不能变 -->
	<script src="js/jquery-3.2.1.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="js/validate.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="js/messages_zh.js" type="text/javascript" charset="utf-8"></script>
	<script type="text/javascript">
		$(function() {
			doValidate();
		});
		
		function doValidate() {
			$("form").validate({
				rules:{
					usr:"required",
					pwd:{required:true, digits:true, minlength:6, maxlength:10},
					repwd:{required:true, equalTo:"[name=pwd]"},
					email:{required:true, email:true}
				},
				messages:{
					usr:"* 用户名不合法",
					pwd:{required:"亲，这是必填的呦！", digits:"哎呦，只能是数字不懂吗？！"},
					repwd:"两次密码输入不一致",
					email:"邮箱格式错误"
				}
			});
		}
	</script>
	<style type="text/css">
		/* .error 可以直接覆盖 validate 中的css 类样式 */
		.error {
			color: red;
			font-family: "楷体";
		}
	</style>
	<body>
		<form>
			账号：<input type="text" name="usr" id="usr"/> <br>
			密码：<input type="password" name="pwd" id="pwd"/> <br>
			二密：<input type="password" name="repwd" id="repwd"/> <br>
			邮箱：<input type="text" name="email" id="email"/> <br>
			<input type="submit" value="提交" />
		</form>
	</body>
</html>
```
