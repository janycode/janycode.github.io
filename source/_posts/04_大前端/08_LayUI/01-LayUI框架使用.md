---
title: 01-LayUI框架使用
date: 2018-5-22 21:36:21
tags:
- LayUI
- 框架
categories: 
- 04_大前端
- 08_LayUI
---



![image-20200701125924471](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200701125929.png)



### 1. LayUI 入门

#### 1.1 框架介绍

官网：https://www.layui.com/

文档：https://www.layui.com/doc/

经典模块化前端框架：由职业前端倾情打造，面向全层次的前后端开发者，低门槛开箱即用的前端 UI 解决方案。

![image-20200701130705946](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200701130707.png)

#### 1.2 环境搭建

1. 官网首页下载压缩包，解压即可；

![image-20200701130837880](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200701130839.png)

2. 将解压后的 layui 目录导入项目中；

![image-20200701192003525](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200701192005.png)



3. 页面中引入 css 和 js 文件。

```html
    <link rel="stylesheet" href="/layui/css/layui.css" media="all">
    <script src="/layui/layui.js"></script>
```



### 2. 页面元素

#### 2.1 表单

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>form</title>
</head>

<script src="layui/layui.js"></script>
<link rel="stylesheet" href="layui/css/layui.css">

<body>
<!-- 表单：layui-form -->
<form class="layui-form" action="">
    <div class="layui-form-item">
        <label class="layui-form-label">输入框</label>
        <div class="layui-input-block"> <!-- layui-input-block 输入框长度顶边 -->
            <input type="text" name="title" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">密码框</label>
        <div class="layui-input-inline"> <!-- layui-input-block 输入框长度短的 -->
            <input type="password" name="password" required lay-verify="required" placeholder="请输入密码" autocomplete="off" class="layui-input">
        </div>
        <div class="layui-form-mid layui-word-aux">辅助文字</div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">选择框</label>
        <div class="layui-input-block">
            <select name="city" lay-verify="required">
                <option value=""></option>
                <option value="0">北京</option>
                <option value="1">上海</option>
                <option value="2">广州</option>
                <option value="3">深圳</option>
                <option value="4">杭州</option>
            </select>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">复选框</label>
        <div class="layui-input-block">
            <input type="checkbox" name="like[write]" title="写作">
            <input type="checkbox" name="like[read]" title="阅读" checked>
            <input type="checkbox" name="like[dai]" title="发呆">
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">开关</label>
        <div class="layui-input-block">
            <input type="checkbox" name="switch" lay-skin="switch">
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">单选框</label>
        <div class="layui-input-block">
            <input type="radio" name="sex" value="男" title="男">
            <input type="radio" name="sex" value="女" title="女" checked>
        </div>
    </div>
    <div class="layui-form-item layui-form-text">
        <label class="layui-form-label">文本域</label>
        <div class="layui-input-block">
            <textarea name="desc" placeholder="请输入内容" class="layui-textarea"></textarea>
        </div>
    </div>
    <div class="layui-form-item">
        <div class="layui-input-block">
            <button class="layui-btn" lay-submit lay-filter="formDemo">立即提交</button>
            <button type="reset" class="layui-btn layui-btn-primary">重置</button>
        </div>
    </div>
</form>

<script>
    // 必须导入 form 模块，才能保证表单正常渲染
    layui.use('form', function(){
        var form = layui.form;
        //监听提交
        form.on('submit(formDemo)', function(data){
            layer.msg(JSON.stringify(data.field));
            return false; // true: 跳转到 form 的 action   false：不跳转
        });
    });
</script>

</body>
</html>
```

![image-20200701150035377](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200701150036.png)

#### 2.2 表格

* **动态表格 + 分页参数 + 表格工具栏 + 操作按钮 + 操作按钮的事件**(table.on())

准备 json/data.json 文件，源数据：https://www.layui.com/demo/table/user/

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>table模块快速使用</title>
    <link rel="stylesheet" href="/layui/css/layui.css" media="all">
    <script src="/layui/layui.js"></script>
</head>
<body>

<table id="demo" lay-filter="test"></table>

</body>
<script>
    layui.use('table', function(){
        var table = layui.table;

        table.render({
            elem: '#demo'
            ,toolbar: true // 显示表格工具栏（列显/隐、导出、打印）
            ,height: 600
            ,url: '/json/data.json' // 数据接口(访问 .json 静态数据)
            ,page: true // 开启分页(默认分页样式)
            // ,page:{limit: 5 // 使用分页参数
            //     ,limits: [5, 10, 20] // 可选每页条数下拉框
            //     ,first: '首页'
            //     ,last: '尾页'
            //     ,prev: '<em>←</em>>'
            //     ,next: '<i class="layui-icon layui-icon-next"></i>'
            //     ,layout:['prev', 'page', 'next', 'count', 'limit', 'skip', 'refresh']  // 自定义分页布局
            // }
            ,cols: [[ //表头
                {field: 'id', title: 'ID', width:80, sort: true, fixed: 'left'}
                ,{field: 'username', title: '用户名', width:80}
                ,{field: 'sex', title: '性别', width:80, sort: true}
                ,{field: 'city', title: '城市', width:80}
                ,{field: 'sign', title: '签名', width: 177}
                ,{field: 'experience', title: '积分', width: 80, sort: true}
                ,{field: 'score', title: '评分', width: 80, sort: true}
                ,{field: 'classify', title: '职业', width: 80}
                ,{field: 'wealth', title: '财富', width: 135, sort: true}
                ,{field: 'right', title: '操作', toolbar: '#barDemo'}
            ]]
        });
        
        // 操作按钮的事件
        //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        table.on('tool(test)', function(obj){
            var data = obj.data; //获得当前行数据
            //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var layEvent = obj.event;
            var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）
            if(layEvent === 'del'){ //删除
                layer.confirm('真的删除行么', function(index){
                    // 向服务端发送删除请求
                    // $.ajax(
                    //     url:"deleteUser"
                    //     ...
                    // )
                    // 此处可以发送ajax
                    obj.del(); //删除对应行（tr）的DOM结构
                    layer.close(index);
                });
            } else if(layEvent === 'edit'){ //编辑
                // 向服务端发送更新请求
                // 同步更新缓存对应的值
                obj.update({
                    username: 'shine001',
                    city: '北京',
                    sex:'女',
                    score:99});
            }
        });
    });
</script>

<!--js定义两个操作表格的按钮：编辑、删除-->
<script type="text/html" id="barDemo">
    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
</script>
</html>
```

![image-20200701150106152](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200701150107.png)



### 3. 内置模块

#### 3.1 layer 弹窗

```html
<script>
    // 导入 layer模块
    layui.use(["layer"],function(){
        var layer = layui.layer;
        layer.msg("hello world!!");
        layer.msg("确定吗？",{btn:["确定！","放弃！"],
            yes:function(i){layer.close(i);layer.msg("yes!!!")},
            btn2:function(i){layer.close(i);layer.msg("no!!!")},}
        );
    });
</script>
```

![image-20200701154210188](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200701154211.png)

![image-20200701154228870](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200701154229.png)

```html
<script>
    // 导入 layer模块
    layui.use(["layer"],function(){
        var layer = layui.layer;
        //0-6 7种图标  0:warning  1:success  2:error  3:question  4:lock  5:哭脸  6：笑脸
        layer.alert("alert弹框蓝",
            {title:'alert',icon:6 },
            function(){//点击“确定”按钮时的回调
                layer.msg("好滴");
            }
        );
    });
</script>
```

![image-20200701154259791](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200701154300.png)

```html
<script>
    // 导入 layer模块
    layui.use(["layer"],function(){
        var layer = layui.layer;
        layer.confirm("hello world~",
            {shade:false,icon:3,btn:["好滴","不行"]},
            function(){layer.msg("好滴！");},
            function(){layer.msg("不行！")}
        );
    });
</script>
```

![image-20200701154359671](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200701154400.png)

```html
<script>
    layui.use(["layer"],function(){
        layer = layui.layer;
        // layer.open({
        //     type:1,// 消息框，没有确定按钮
        //     title:["hello","padding-left:5px"], // 标题，及标题样式
        //     content:layui.$("#testmain"), // dom格式
        //     offset:'rb',//可以在右下角显示
        //     shade:true //是否遮罩
        // });

        layer.open({
            type:2,// iframe加载，需要一个url
            content:"demo1.html"
        });
    });
</script>
```

![image-20200701154554682](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200701154555.png)



#### 3.2 layDate 日期

```html
<form class="layui-form layui-form-pane" action="" method="post">
    <!-- layui-form-item 一个输入项-->
    <div class="layui-form-item">
        <label class="layui-form-label">生日</label>
        <!-- layui-input-block 输入框会占满除文字外的整行 -->
        <div class="layui-input-block">
            <input readonly id="birth" type="text" name="birth" placeholder="请选择生日日期" autocomplete="off" class="layui-input">
        </div>
    </div>
</form>

...

<script>
    layui.use(["laydate","form"],function(){
        var laydate = layui.laydate;
        //执行一个laydate实例
        laydate.render({
            elem: '#birth', //指定元素
            format:'yyyy/MM/dd',
            //value:'2012/12/12' //默认值
            value:new Date() //默认值
        });
    });
</script>
```

![image-20200701191709434](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200701191710.png)

#### 3.3 upload 文件上传

```html
<form class="layui-form layui-form-pane" action="" method="post">
    <div class="layui-form-item">
        <div class="layui-input-block">
            <button type="button" class="layui-btn" id="test1">
                <i class="layui-icon">&#xe67c;</i>上传图片
            </button>
        </div>
    </div>
</form>

...

<script>
    layui.use(['upload','layer'], function(){
        var upload = layui.upload;
        //执行实例
        var uploadInst = upload.render({
            elem: '#test1' //绑定元素
            ,url: '/file/upload' //上传接口
            ,accept:'file' // file 代表所有文件，默认是 images 代表图片
            ,size:100 // 文件最大100kb
            ,done: function(res){
                //上传完毕回调
                layui.layer.msg("ok");
            }
            ,error: function(){
                //请求异常回调
                layui.layer.msg("error");
            }
        });
    });
</script>
```

![image-20200701155133749](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200701155134.png)



#### 3.4 carousel 轮播图

```html
<div class="layui-carousel" id="test1">
    <div carousel-item style="text-align: center;line-height: 280px">
        <div>条目1</div>
        <div>条目2</div>
        <div>条目3</div>
        <div>条目4</div>
        <div>条目5</div>
    </div>
</div>

...

<script>
    layui.use(['carousel'], function(){
        var carousel = layui.carousel;
        //建造实例
        carousel.render({
            elem: '#test1'
            ,width: '100%' //设置容器宽度
            ,arrow: 'always' //始终显示箭头
        });
    });
</script>
```



### 4. 使用技巧

1. 在多个控件的外边加上 一个div，class设置为：layui-form-item

2. 在input控件外加一个div,class设置为：layui-input-inline


这样的话，多个控件即可在一行显示啦~