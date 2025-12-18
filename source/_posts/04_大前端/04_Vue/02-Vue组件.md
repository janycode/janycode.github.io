---
title: 02-Vue组件
date: 2018-5-22 21:36:21
tags:
- Vue
- 组件
categories: 
- 04_大前端
- 04_Vue
---

![image-20200723170734421](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200723170735.png)

参考资料：

* 官网：https://cn.vuejs.org/
* vue2 官方教程：https://v2.cn.vuejs.org/v2/guide/
* vue3 官方教程：https://cn.vuejs.org/guide/introduction.html
* 说明：*`Vue 2.0 在 2023 年 12 月 31 日停止更新`*。



## 1. 组件

组件，扩展HTML元素，封装可重用的代码。`vue最强大的功能之一`

![image-20251218180540448](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251218180541.png)

### 1.1 创建组件

全局组件：`Vue.component(tagName, options)`

* 起名字 ①纯小写  ②js驼峰,html使用-连接

* template 属性需要包含一个根节点
* 所有实例都能使用

```html
<div id="app">
    <navbar></navbar>
</div>
<script>
    Vue.component('navbar', {               // 全局组件 navbar
      template: '<h1>自定义组件!</h1>',
      methods: { handleXxx(){} ... }
    })
    new Vue({
      el: '#app'
    })
</script>
```

局部组件：`new Vue({ el:..., components: {xxx:Child} })`

* 如果写在 Vue.component 中，就属于他自己的子组件，只能在自己的内部使用
* 只能在当前初始化实例中使用

```html
<div id="app">
    <navbar></navbar>
</div>
<script>
var Child = {
  template: '<h1>自定义组件!</h1>'
}
new Vue({
  el: '#app',
  components: {
    'navbar': Child           // <navbar> 将只在当前实例可用
  }
})
</script>
```



### 1.2 父子组件通信

#### 1.2.1 父传子

1. 子组件标签通过`:自定义属性`去**绑定**父组件的**属性值**
2. 子组件的`props`属性通过该**自定义属性**来**接受**父组件的属性值

```html
    <div id="box">
        <div style="background: yellow;">根组件标题</div>
        <!-- 变量：myname，myright，其中myright需要指定为js领域，才能识别为bool值 -->
        <!-- 父传子 parent，需要 : 进行绑定，然后子组件进行接受该属性值 -->
        <navbar myname="电影" :myright="false" :my_parent="parent"></navbar>
        <navbar myname="影院" :myright="true" :my_parent="parent"></navbar>
    </div>
    <script>
        // 子组件 navbar
        Vue.component("navbar", {
            //props: ["myname", "myright"],      // 接受myname属性，使用 this.myname
            // props: {
            //     myname: String,
            //     myright: Boolean
            // },  // 接受myname属性，属性类型验证
            props: {
                myname: {
                    type: String,
                    default: ""
                },
                myright: {
                    type: Boolean,
                    default: true
                },
                my_parent: {         // 子组件 navbar 接受父组件的属性值
                    type: String,
                    default: ""
                }
            },   // 接受myname属性，属性：类型验证、默认值
            template: `<div>
                    <button>left</button>
                    <span>{{myname}}-{{my_parent}}</span>
                    <button v-show="myright">Q</button>
                </div>`
        })
        // 父组件 box
        new Vue({
            el: "#box",
            data: {
                parent: "11111111111"
            }
        })  // 创建根组件
    </script>
```

效果：

![image-20251218193312941](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251218193313.png)

#### 1.2.2 子传父

1. 子组件1标签通过`@自定义事件`去**绑定**父组件的**事件方法**
2. 子组件1的 methods 点击事件中操作子组件自身的 `this.$emit(...)` **触发执行**绑定父组件的事件方法
   - this.$emit(eventName, args...) 该方法为固定写法，且支持传参

```html
    <div id="box">
        <!-- 1. @父组件自定义事件（点击子 navbar 控制显示或隐藏子 sidebar） -->
        <navbar @my_event="handleEvent"></navbar>
        <sidebar v-show="isShow"></sidebar>
    </div>
    <script>
        // 子组件 navbar
        Vue.component("navbar", {
            template: `
                <div>
                    <button @click="handleClick()">点击</button>-导航栏
                </div>`,
            methods: {
                handleClick() {
                    console.log("子传父")
                    // 2. $emit 触发/分发，子组件告诉父组件，触发父组件的事件 handleEvent
                    this.$emit("my_event", 100)  // 支持传参
                }
            }
        })
        // 子组件 sidebar
        Vue.component("sidebar", {
            template: `
                <div>
                    <ul>
                        <li>111</li>
                        <li>222</li>
                        <li>333</li>
                        <li>444</li>
                        <li>555</li>
                    </ul>
                </div>`
        })
        // 父组件 box
        new Vue({
            el: "#box",
            data: {
                isShow: true
            },
            methods: {
                handleEvent(arg) {
                    console.log("父组件定义的事件:", arg)  // 父组件定义的事件: 100
                    this.isShow = !this.isShow
                }
            }
        })  // 创建根组件
    </script>
```

效果：类似抽屉效果

![chrome-capture-2025-12-18](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251218193405.gif)







### 1.3 引用



### 1.4 动态组件



### 1.5 插槽slot



### 1.6 过渡效果



### 1.7 生命周期



## 2. 指令



## 3. 单文件组件



## 4. 路由



## 5. vuex持久化





## 6. 组件库

### 6.1 elementUI



### 6.2 vant



## 7. 实战

### 7.1 项目



### 7.2 betterScroll



### 7.3 300ms以及手势问题



### 7.4 git



### 7.5 nginx























