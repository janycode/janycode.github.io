---
title: 02-Vue 核心
date: 2020-01-22 12:32:55
tags:
- Vue
- 语法
categories: 
- 04_网页技术
- 09_Vue
---



![image-20200723170734421](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200723170735.png)

官网（中文）教程：https://cn.vuejs.org/

### 1. Vue 简介

#### 1.1 官网

英文官网: https://vuejs.org/  中文官网: https://cn.vuejs.org/

#### 1.2 介绍

动态构建用户界面的`渐进式` JavaScript 框架，作者: `尤雨溪`。

#### 1.3 特点

* 遵循 MVVM 模式
* 编码简洁, 体积小, 运行效率高, 适合移动/PC 端开发
* 它本身只关注 UI, 也可以引入其它第三方库开发项

#### 1.4 与其它 JS 框架的关联

1. 借鉴 Angular 的模板和数据绑定技术
2. 借鉴 React 的组件化和虚拟 DOM 技术
1.1.5. Vue 周边库
1. vue-cli: vue 脚手架
2. vue-resource
3. axios
4. vue-router: 路由
5. vuex: 状态管理
6. element-ui: 基于 vue 的 UI 组件库(PC 端) ……



### 2. 初识Vue

#### 2.1 Hello，Vue！

![image-20220212175729713](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220212175730.png)

> 1. 基于 Visual Studio Code 工具环境
>
> 2. 本地引入的 vue 开发版本 vue.js， 生产版本为 vue.min.js (压缩版)
>
> 3. Vue.config.productionTip 为生产提示，默认为 `true`，可以置位 `false`关闭提示
>
> 4. Vue Devtools 浏览器开发工具插件 `vue_dev_tools.crx`(MS Edge或Chrome通用), 否则浏览器控制台会报提示：
>    Download the Vue Devtools extension for a better development ...
>    插件下载:  链接：https://pan.baidu.com/s/1gzL3K4z3xIu4lacbR1cVtA  提取码：6j3p
>
> 5. 总结：
>        1.想让Vue工作，就必须创建一个Vue实例，且要传入一个配置对象；
>        2.root容器里的代码依然符合html规范，只不过混入了一些特殊的Vue语法；
>        3.root容器里的代码被称为【Vue模板】；
>        4.Vue实例和容器是一一对应的；
>        5.真实开发中只有一个Vue实例，并且会配合着组件一起使用；
>        6.{{xxx}}中的xxx要写js表达式，且xxx可以自动读取到data中的所有属性；
>        7.一旦data中的数据发生改变，那么页面中用到该数据的地方也会自动更新；
>
>    ​    注意区分：js表达式 和 js代码(语句)
>    ​            1.表达式：一个表达式会产生一个值，可以放在任何一个需要值的地方：
>    ​                        (1) a
>    ​                        (2) a+b
>    ​                        (3) demo(1)
>    ​                        (4) x === y ? 'a' : 'b'
>
>    ​            2.js代码(语句)
>    ​                        (1) if(){}
>    ​                        (2) for(){}



```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>初识Vue</title>
    <!-- 引入vue -->
    <script type="text/javascript" src="../js/vue.js"></script>
</head>
<body>
    <!-- 准备好一个容器 -->
    <div id="root">
        <h1>Hello, {{name.toUpperCase()}}!</h1>
        <h1>Hello, {{age}}!</h1>
    </div>

    <script type="text/javascript">
        Vue.config.productionTip = false;//阻止 Vue 在启动时生成生产提示。

        //创建Vue实例，一切的开端: 参数{} 配置对象
        const x = new Vue({
            el:'#root', //el 用于指定当前Vue实例为哪个容器服务，值通常为css选择器字符串
            data:{ //data 中用于存储数据，数据提供el所指定的容器去使用
                name:'Jerry',
                age:'22'
            }
        });
    </script>
</body>
</html>
```



### 3. 模板语法

#### 3.1 效果

![image-20220212180935424](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220212180936.png)



#### 3.2 模板的理解

html 中包含了一些 JS 语法代码，语法分为两种，分别为：
1. 插值语法（双大括号表达式）
2. 指令（以 v-开头）

#### 3.3 插值语法

1. 功能: 用于解析标签体内容
2. 语法: {{xxx}} ，xxxx 会作为 js 表达式解析

#### 3.4 指令语法

1. 功能: 解析标签属性、解析标签体内容、绑定事件
2. 举例：v-bind:href = 'xxxx' ，xxxx 会作为 js 表达式被解析
3. 说明：Vue 中有有很多的指令，此处只是用 v-bind 举个例子

```html
<!-- 引入Vue -->
<script type="text/javascript" src="../js/vue.js"></script>
<body>
    <!-- 准备好一个容器-->
    <div id="root">
        <h1>插值语法</h1>
        <h3>你好，{{name}}</h3>
        <hr/>
        <h1>指令语法</h1>
        <a v-bind:href="school.url.toUpperCase()" x="hello">点我去{{school.name}}学习1</a>
        <a :href="school.url" x="hello">点我去{{school.name}}学习2</a>
    </div>
</body>

<script type="text/javascript">
    Vue.config.productionTip = false //阻止 vue 在启动时生成生产提示。

    new Vue({
        el:'#root',
        data:{
            name:'jerry',
            school:{
                name:'网站',
                url:'http://www.demo.com',
            }
        }
    })
</script>
```



### 4. 数据绑定

#### 4.1 效果

![image-20220213093423389](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220213093424.png)

#### 4.2 单向数据绑定

1. 语法：v-bind:href ="xxx" 或简写为 `:`href
2. 特点：数据只能从 data 流向页面

#### 4.3 双向数据绑定

1. 语法：v-mode:value="xxx" 或简写为 `v-model`="xxx" , 因为v-model默认收集的就是value值
2. 特点：数据不仅能从 data 流向页面，还能从页面流向 data
3. 注意：v-model只能应用在`表单类元素（输入类元素）`上

```html
<!-- 引入Vue -->
<script type="text/javascript" src="../js/vue.js"></script>
<body>
    <!-- 准备好一个容器-->
    <div id="root">
        <!-- 普通写法 -->
        <!-- 单向数据绑定：<input type="text" v-bind:value="name"><br/>
双向数据绑定：<input type="text" v-model:value="name"><br/> -->

        <!-- 简写 -->
        单向数据绑定：<input type="text" :value="name"><br/>
        双向数据绑定：<input type="text" v-model="name"><br/>

        <!-- 如下代码是错误的，因为v-model只能应用在表单类元素（输入类元素）上 -->
        <!-- <h2 v-model:x="name">你好啊</h2> -->
    </div>
</body>

<script type="text/javascript">
    Vue.config.productionTip = false //阻止 vue 在启动时生成生产提示。

    new Vue({
        el:'#root',
        data:{
            name:'姜源'
        }
    })
</script>
```

#### 4.4 el与data的两种写法

1. el有2种写法

   (1).new Vue时候配置el属性。

   (2).先创建Vue实例，随后再通过vm.`$mount`('#root')指定el的值。

2. data有2种写法

   (1).对象式

   (2).函数式

   如何选择：使用组件时，data必须使用函数式，否则会报错。

3. 一个重要的原则：

   由Vue管理的函数，一定不要写箭头函数`data:()=>{...}`，一旦写了箭头函数，this就不再是Vue实例了。

```html
<!-- 引入Vue -->
<script type="text/javascript" src="../js/vue.js"></script>
<body>
    <!-- 准备好一个容器-->
    <div id="root">
        <h2>你好啊，{{name}}</h2>
    </div>
</body>
<script type="text/javascript">
    Vue.config.productionTip = false //阻止 vue 在启动时生成生产提示。

    const vm = new Vue({
        //el: '#root', //el第一种写法
        //data: {      //data第一种写法-对象式
        //    name: '姜源'
        //}
        data(){ //data第二种写法-函数式，本质是 data:function() 等价于 data()
            console.log('@@@', this) //this为Vue实例对象
            return{
                name:'姜源'
            }
        }
    })
    console.log(vm); //$开头的Vue实例自带且可用的，_开头的是Vue内置的
    v.$mount('#root'); //el第二种写法
</script>
```

### 5. MVVM 模型和数据代理

#### 5.1 MVVM模型

M：模型(Model) ：对应 data 中的数据

V：视图(View) ：模板

VM：视图模型(ViewModel) ： Vue

> 1. data中所有的属性，最后都出现在了vm身上。
> 2. vm身上所有的属性 及 Vue原型上所有属性，在Vue模板中都可以直接使用。

![image-20220213095622884](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220213095623.png)

#### 5.2 数据代理

* Object.defineProperty(x, y, z) 方法

  ```html
  <script type="text/javascript" >
      let number = 18
      let person = {
          name:'张三',
          sex:'男',
      }
  
      Object.defineProperty(person,'age',{
          // value:18,
          // enumerable:true, //控制属性是否可以枚举，默认值是false
          // writable:true, //控制属性是否可以被修改，默认值是false
          // configurable:true //控制属性是否可以被删除，默认值是false
  
          //当有人读取person的age属性时，get函数(getter)就会被调用，且返回值就是age的值
          get(){
              console.log('有人读取age属性了')
              return number
          },
  
          //当有人修改person的age属性时，set函数(setter)就会被调用，且会收到修改的具体值
          set(value){
              console.log('有人修改了age属性，且值是',value)
              number = value
          }
  
      })
  
      // 提取Object里可见的keys转换为数组
      // console.log(Object.keys(person))
  
      console.log(person)
  </script>
  ```

  

* 数据代理
  通过一个对象代理对另一个对象中属性的操作（读/写）

  ```html
  <script type="text/javascript" >
      let obj = {x:100}
      let obj2 = {y:200}
      //通过 obj2.x 也可以修改 obj.x 的值
      Object.defineProperty(obj2,'x',{
          get(){
              return obj.x
          },
          set(value){
              obj.x = value
          }
      })
  </script>
  ```

  

* Vue中的数据代理
  通过vm对象来代理data对象中属性的操作（读/写）。

  1. Vue中数据代理的好处：
     更加方便的操作data中的数据
  2. 基本原理：
     通过Object.defineProperty()把data对象中所有属性添加到vm上。
     为每一个添加到vm上的属性，都指定一个getter/setter。
     在getter/setter内部去操作（读/写）data中对应的属性。

  ![image-20220213103955985](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220213103957.png)

  ```html
  <!-- 引入Vue -->
  <script type="text/javascript" src="../js/vue.js"></script>
  <body>
      <!-- 准备好一个容器-->
      <div id="root">
          <h1>名称：{{name}}</h1>
          <h1>地址：{{address}}</h1>
      </div>
  </body>
  <script type="text/javascript">
      Vue.config.productionTip = false //阻止 vue 在启动时生成生产提示。
      let data = {
          name:'姜源',
          address:'郑州'
      }
  
      const vm = new Vue({
          el:'#root',
          //data 可以通过 vm._data 在控制台访问, 此时 vm._data === data
          data
      })
  </script>
  ```

  

### 6. 事件处理

#### 6.1 效果



#### 6.2 绑定监听

> 1.使用v-on:xxx 或 @xxx 绑定事件，其中xxx是事件名；
>
> 2.事件的回调需要配置在methods对象中，最终会在vm上；
>
> 3.methods中配置的函数，不要用箭头函数！否则this就不是vm了；
>
> 4.methods中配置的函数，都是被Vue所管理的函数，this的指向是vm 或 组件实例对象；
>
> 5.@click="demo" 和 @click="demo($event)" 效果一致，但后者可以传参；

1. v-on:xxx="fun" 
2. @xxx="fun" 
3. @xxx="fun(参数)" 
4. 默认事件形参: event

5. 隐含属性对象: $event

```html
<!-- 引入Vue -->
<script type="text/javascript" src="../js/vue.js"></script>
<body>
    <!-- 准备好一个容器-->
    <div id="root">
        <h2>欢迎进入网站{{name}}中访问</h2>
        <!-- <button v-on:click="showInfo1">点我提示信息1</button><br/> -->
        <button @click="showInfo1">点我提示信息1(不传参)</button><br/>
        <button @click="showInfo2($event, 66)">点我提示信息2(传参)</button>
    </div>
</body>
<script type="text/javascript">
    Vue.config.productionTip = false //阻止 vue 在启动时生成生产提示。

    const vm = new Vue({
        el:'#root',
        data:{
            name:'博客'
        },
        methods:{
            showInfo1(event){
                //console.log(event.target.innerText) //获取参数, 比如按钮文本
                //console.log(this) //此处的this是vm
                alert("你好！来都来了111")
            },
            showInfo2(event, number){
                console.log(event, number)
                alert("你好！来都来了222")
            }
        }
    })
</script>
```



#### 6.3 事件修饰符

> 6个事件修饰符，前3个常用。
>
> 1.prevent：阻止默认事件（常用）；
>
> 2.stop：阻止事件冒泡（常用）；
>
> 3.once：事件只触发一次（常用）；
>
> 4.capture：使用事件的捕获模式；
>
> 5.self：只有event.target是当前操作的元素时才触发事件；
>
> 6.passive：事件的默认行为立即执行，无需等待事件回调执行完毕；

1. .prevent : 阻止事件的默认行为 event.preventDefault()

2. .stop : 停止事件冒泡 event.stopPropagation()

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <title>事件修饰符</title>
    <!-- 引入Vue -->
    <script type="text/javascript" src="../js/vue.js"></script>
    <style>
        * {
            margin-top: 20px;
        }

        .demo1 {
            height: 50px;
            background-color: skyblue;
        }

        .box1 {
            padding: 5px;
            background-color: skyblue;
        }

        .box2 {
            padding: 5px;
            background-color: orange;
        }

        .list {
            width: 200px;
            height: 200px;
            background-color: peru;
            overflow: auto;
        }

        li {
            height: 100px;
        }
    </style>
</head>

<body>
    <!-- 准备好一个容器-->
    <div id="root">
        <h2>欢迎进入网站{{name}}中访问</h2>
        <!-- 阻止默认事件（常用） -->
        <a href="http://www.baidu.com/" @click.prevent="showInfo">点我跳转到目标地址</a>
        <!-- 阻止事件冒泡（常用） -->
        <div class="demo1" @click="showInfo">
            <button @click.stop="showInfo">点我提示信息</button>
            <!-- 修饰符可以连续写 -->
            <!-- <a href="http://www.baidu.com" @click.prevent.stop="showInfo">点我提示信息</a> -->
        </div>
        <!-- 事件只触发一次（常用） -->
        <button @click.once="showInfo">点我提示信息</button>
        <!-- 使用事件的捕获模式 -->
        <div class="box1" @click.capture="showMsg(1)">
            div1
            <div class="box2" @click="showMsg(2)">
                div2
            </div>
        </div>
        <!-- 只有event.target是当前操作的元素时才触发事件； -->
        <div class="demo1" @click.self="showInfo">
            <button @click="showInfo">点我提示信息</button>
        </div>
        <!-- 事件的默认行为立即执行，无需等待事件回调执行完毕； -->
        <ul @wheel.passive="demo" class="list">
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
        </ul>
    </div>
</body>
<script type="text/javascript">
    Vue.config.productionTip = false //阻止 vue 在启动时生成生产提示。

    const vm = new Vue({
        el: '#root',
        data: {
            name: '博客'
        },
        methods: {
            showInfo(e) {
                //e.preventDefault() //阻止默认行为
                console.log(e.target)
                alert("你好！来了")
            },
            showMsg(msg) {
                console.log(msg)
            },
            demo() {
                for (let i = 0; i < 100; i++) {
                    console.log('#')
                }
                console.log('累坏了')
            }
        }
    })
</script>

</html>
```



#### 6.4 按键修饰符

> 1. Vue中常用的按键别名：
>
>    回车 => enter
>
>    删除 => delete (`捕获“删除”或“退格”键`)
>
>    退出 => esc
>
>    空格 => space
>
>    换行 => tab (`特殊，必须配合keydown去使用`)
>
>    上 => up
>
>    下 => down
>
>    左 => left
>
>    右 => right
>
> 2. Vue未提供别名的按键，可以使用按键原始的key值去绑定，但注意要转为kebab-case（短横线命名）
>
> 3. 系统修饰键（用法特殊）：ctrl、alt、shift、meta
>
>    (1).配合keyup使用：按下修饰键的同时，再按下其他键，随后释放其他键，事件才被触发。
>
>    (2).`配合keydown使用：正常触发事件`。
>
> 4. 也可以使用keyCode去指定具体的按键（不推荐）
>
> 5. Vue.config.keyCodes.自定义键名 = 键码，可以去定制按键别名

1. keycode : 操作的是某个 keycode 值的键

2. .keyName : 操作的某个按键名的键(少部分)

```html
<!-- 引入Vue -->
<script type="text/javascript" src="../js/vue.js"></script>
<body>
    <!-- 准备好一个容器-->
    <div id="root">
        <h2>欢迎进入网站{{name}}中访问</h2>
        <input type="text" placeholder="按下回车提示输入" @keyup.huiche="showInfo">
    </div>
</body>
<script type="text/javascript">
    Vue.config.productionTip = false //阻止 vue 在启动时生成生产提示。
    Vue.config.keyCodes.huiche = 13 //定义了一个别名按键

    const vm = new Vue({
        el:'#root',
        data:{
            name:'博客'
        },
        methods: {
            showInfo(e) {
                console.log(e.target.value)
            }
        }
    })
</script>
```



### 7. 计算属性与监视

#### 7.1 效果

![image-20220213212449256](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220213212450.png)

#### 7.2 计算属性-computed

> 1. 定义：要用的属性不存在，要通过Vue管理的`已有属性`计算得来。
>
> 2. 原理：底层借助了Objcet.defineproperty方法提供的getter和setter。
>
> 3. get函数什么时候执行？
>
>    ​      (1).初次读取时会执行一次。
>
>    ​      (2).当依赖的数据发生改变时会被再次调用。
>
> 4. 优势：与methods实现相比，`内部有缓存机制（复用）`，效率更高，调试方便。
>
> 5. 备注：
>
>    ​    1.计算属性最终会出现在vm上，直接读取使用即可。
>
>    ​    2.如果计算属性要被修改，那必须写set函数去响应修改，且set中要引起计算时依赖的数据发生改变。

1. 要显示的数据不存在，要通过计算得来。
2. 在 computed 对象中定义计算属性。
3. 在页面中使用{{方法名}}来显示计算的结果。

```html
<!-- 引入Vue -->
<script type="text/javascript" src="../js/vue.js"></script>
<body>
    <!-- 准备好一个容器-->
    <div id="root">
        姓：<input type="text" v-model="firstName"><br>
        名：<input type="text" v-model="lastName"><br>
        姓名：<span>{{fullName}}</span>
    </div>
</body>
<script type="text/javascript">
    Vue.config.productionTip = false //阻止 vue 在启动时生成生产提示。

    const vm = new Vue({
        el:'#root',
        data:{
            firstName:'张',
            lastName:'三'
        },
        computed: {
            fullName:{
                //当有人读取fullName时，get就会被调用，且返回值就是fullName的值
                get(){
                    console.log('get被调用了')
                    return this.firstName + '-' + this.lastName;
                }
            }
        }
    })
</script>
```

```html
        computed: {
            //简写：只考虑读取getter，不考虑写入setter的时候可以使用简写
            fullName(){
                return this.firstName + '-' + this.lastName
            }
        }
```



#### 7.3 监视属性-watch

![image-20220213214002802](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220213214003.png)

> 1.当被监视的属性变化时, 回调函数自动调用, 进行相关操作
>
> 2.监视的属性必须存在，才能进行监视！！
>
> 3.监视的两种写法：
>
> ​    (1).new Vue时传入watch配置
>
> ​    (2).通过vm.$watch监视

1. 通过通过 vm 对象的$watch()或 watch 配置来监视指定的属性
2. 当属性变化时, 回调函数自动调用, 在函数内部进行计算

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>天气案例</title>
    <!-- 引入Vue -->
    <script type="text/javascript" src="../js/vue.js"></script>
</head>
<body>
    <!-- 准备好一个容器-->
    <div id="root">
        <h2>今天天气很{{info}}</h2>
        <button @click="changeWeather">切换天气</button>
    </div>
</body>
<script type="text/javascript">
    Vue.config.productionTip = false //阻止 vue 在启动时生成生产提示。

    const vm = new Vue({
        el: '#root',
        data: {
            isHot: true,
        },
        computed: {
            info() {
                return this.isHot ? '炎热' : '凉爽'
            }
        },
        methods: {
            changeWeather() {
                this.isHot = !this.isHot
            }
        },
        watch: {
            //监视方式1
            // info: {
            //     immediate: true, //初始化时让handler调用一下
            //     //当isHot发生改变时就调用
            //     handler(newValue, oldValue) {
            //         console.log(newValue, oldValue)
            //     }
            // }
        }
    })
    //监视方式2
    vm.$watch('info', {
        immediate: true, //初始化时让handler调用一下
        //当isHot发生改变时就调用
        handler(newValue, oldValue) {
            console.log(newValue, oldValue)
        }
    })
</script>
</html>
```



--> 023 深度监视...