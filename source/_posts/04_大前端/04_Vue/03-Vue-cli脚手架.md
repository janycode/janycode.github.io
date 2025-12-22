---
title: 03-Vue-cli脚手架
date: 2018-5-22 21:36:21
tags:
- Vue
- Vue-cli
categories: 
- 04_大前端
- 04_Vue
---

![image-20200723170734421](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200723170735.png)

参考资料：

* 官网：https://cn.vuejs.org/
* vue2 官方教程：https://v2.cn.vuejs.org/v2/guide/
* vue3 官方教程：https://cn.vuejs.org/guide/introduction.html
* 说明：`Vue 2.0 在 2023 年 12 月 31 日停止更新`。


## 1. vue-cli 脚手架

官方文档：https://v2.cn.vuejs.org/v2/guide/single-file-components.html

> 可以只是简单地使用 Babel，TypeScript，SCSS，PostCSS - 或者其他任何能够帮助你提高生产力的预处理器。如果搭配 `vue-loader` 使用 webpack，它也能为 CSS Modules 提供头等支持。

### 1.1 单文件组件

#### 1.1.1 安装脚手架

`-g` 是全局安装，不论在哪个文件夹下均可。

```bash
# 一次安装：npm 或 cnpm使用的淘宝镜像
npm install -g @vue/cli
# OR
yarn global add @vue/cli
# 查看版本
vue --version
```

#### 1.1.2 创建项目

在具体要创建项目的文件夹，创建一个项目（未提及的均可默认）：

```bash
vue create my-project
# OR
vue ui
```

![image-20251222124107668](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251222124115.png)

![image-20251222124322537](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251222124323.png)

![image-20251222124333470](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251222124334.png)

![image-20251222124451920](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251222124452.png)

![image-20251222124514115](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251222124515.png)

![image-20251222124615133](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251222124615.png)

![image-20251222124752661](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251222124753.png)

生成文件结构：

![image-20251222124814788](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251222124815.png)

#### 1.1.3 启动项目

启动命令在文件 package.json 中

```json
...
"scripts": {
    "serve": "vue-cli-service serve", //->命令：npm run serve - 对应开发环境，打包到内存热更新
    "build": "vue-cli-service build", //->命令：npm run build - 对应生产环境，会压缩代码，打包为静态文件
    "lint": "vue-cli-service lint"    //->命令：npm run lint  - 自动修复格式错误等
},
...
```

该标签可以修改，如

```json
...
"scripts": {
    "start": "vue-cli-service serve", // npm start，其中start时才可以省略 run
    "serve": "vue-cli-service serve", //->命令：npm run serve - 对应开发环境，打包到内存热更新
    "build": "vue-cli-service build", //->命令：npm run build - 对应生产环境，会压缩代码，打包为静态文件
    "lint": "vue-cli-service lint"    //->命令：npm run lint  - 自动修复格式错误等
},
...
```

启动命令：

```bash
# npm start 对应 "start": "vue-cli-service serve",
npm start
npm run serve
npm run build
npm run lint
```

### 1.2 项目目录

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251222154236.png)

```bash
.
├── node_modules/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/
│   │   └── logo.png
│   ├── components/
│   │   └── HelloWorld.vue
│   ├── router/
│   │   └── index.js
│   ├── store/
│   │   └── index.js
│   ├── views/
│   │   ├── AboutView.vue
│   │   └── HomeView.vue
│   ├── App.vue
│   └── main.js                          #main.js不能重命名，其他都可以
├── .browserslistrc
├── .editorconfig
├── .eslintrc.js
├── .gitignore
├── babel.config.js
├── jsconfig.json
├── lint-staged.config.js
├── package-lock.json
├── package.json
├── README.md
└── vue.config.js                           #vue项目的配置文件覆盖
```

main.js

```js
import Vue from 'vue' // ES6 的导入方式
import App from './App.vue' // 导入根组件App
// import router from './router'
// import store from './store'

Vue.config.productionTip = false // 开发环境有log，生产无log

new Vue({
  // router,
  // store,
  render: h => h(App)
}).$mount('#app')
```



#### 1.2.1 ESLint 语法检测处理

ESLint语法检测时报错，解决方案有以下几种： - **推荐 4.1**

① 运行 `npm run lint`，会自动修复语法检测的内容

② **vue.config.js** (如果没有就手动创建出来的) 中配置 `publicPath: './'`

③ vscode自动修复eslint，安装 ESLint 插件，并启用。(*不一定好使，跟vscode和eslint的版本有关系*)

* 文件 >> 首选项 >> 设置 >> 用户 >> setting.json，加上以下配置

```json
"editor.codeActionsOnSave": {
    "source.fixAll": true
}
```

④ 关闭eslint，两种方法（推荐**第一种**即可）

1. 【`推荐`】在 **vue.config.js**(如果没有就手动创建出来的) 中 的`module.exports` 下 `lintOnSave: false`
   - 在这种情况下，每次提交代码之前只需要执行一次 `npm run lint` 自动修复1次语法检测就可以提交了

2. .eslintrc 删除 `'@vue/standard'` （对于某个规则关闭，no-new: "off"）
   - 或者，也可以通过设置让浏览器 overlay 同时显示警告和错误



### 1.3 单文件组件写法

常规注意事项：

* 目录名字是纯小写
* 组件.vue文件是首字母大写

最基本的单文件组件写法格式：

./App.vue

```vue
/* dom */
<template>
  <div>
    hello app-{{ myname }}
    <input type="text" v-model="mytext" />
    <button @click="handleAdd">点击</button>
    <ul>
      <li v-for="item in datalist" :key="item">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

/* js */
<script>
// es6 导出规范
export default {
  data () {
    return {
      myname: 'jerry',
      mytext: '',
      datalist: []
    }
  },
  methods: {
    handleAdd () {
      console.log(this.mytext)
      this.datalist.push(this.mytext)
    }
  }
}
</script>

/* css: sass完全支持 */
<style lang="scss">
$width: 300px;
ul {
  li {
    background: yellow;
    width: $width;
  }
}
</style>

```



### 1.4 单文件组件引入

`全局引入 或 局部引入 按需选择其一。`

./components/Navbar.vue

```vue
<template>
    <div>
        hello,navbar.
    </div>
</template>
```

./App.vue

```vue
/* dom */
<template>
  <div>
    ...
    <navbar></navbar>
  </div>
</template>

/* js */
<script>
// es6 导入 - 包括 Vue 对象也需要单独引入（哪个组件使用哪个引入）
//import Vue from 'vue'
import navbar from './components/Navbar.vue'
// ①全局注册（导入的组件还是需要注册进来才能使用）
//Vue.component('navbar', navbar)

// es6 导出规范 - babel(ES6==>ES5)
export default {
  data () {
    return {}
  },
  // ②局部注册（全局或局部按需选其一）
  components: {
    navbar   // 名称相同因此可以简写，原 navbar: navbar
  },
  methods: {}
}
</script>

/* css: sass完全支持 */
<style lang="scss">
...
</style>

```



### 1.5 单文件组件通信

./App.vue

```vue
/* dom */
<template>
  <div>
    hello app-{{ myname }}
    <input type="text" v-model="mytext" />
    <button @click="handleAdd">点击</button>
    <ul>
      <li v-for="item in datalist" :key="item">
        {{ item }}
      </li>
    </ul>
    <!-- 父传子、子传父、不同组件之间 通信 -->
    <navbar :myname="myname" :myright="false" @event="handleEvent">
      <div>1111111111插槽替换</div>
    </navbar>

    <sidebar v-show="isShow"></sidebar>
  </div>
</template>

/* js */
<script>
// es6 导入 - 包括 Vue 对象也需要单独引入（哪个组件使用哪个引入）
// import Vue from 'vue'
import navbar from './components/Navbar.vue'
import sidebar from './components/Sidebar.vue'
// 全局注册（导入的组件还是需要注册进来才能使用）
// Vue.component('navbar', navbar)

// es6 导出规范 - babel(ES6==>ES5)
export default {
  data () {
    return {
      myname: 'jerry',
      mytext: '',
      datalist: [],
      isShow: true
    }
  },
  // 局部注册（全局或局部按需选其一）
  components: {
    navbar,
    sidebar
  }, // 名称相同因此可以简写，原 navbar: navbar
  methods: {
    handleAdd () {
      console.log(this.mytext)
      this.datalist.push(this.mytext)
    },
    handleEvent() {
      this.isShow = !this.isShow
    }
  }
}
</script>

/* css: sass完全支持 */
<style lang="scss" scoped>
$width: 300px;
ul {
  li {
    background: red;
    width: $width;
  }
}
</style>
```

./components/Navbar.vue

```vue
<template>
  <div>
    <button @click="handleLeft">left</button>
    hello,navbar. - {{ myname }}
    <button v-show="myright">right</button>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    myname: {
      type: String,
      default: ''
    },
    myright: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleLeft() {
        // 通知父组件执行组件内的 event 事件函数
        this.$emit("event")
    }
  }
}
</script>
```

./components/Sidebar.vue

```vue
<template>
  <div>
    <ul>
        <li>001</li>
        <li>002</li>
        <li>003</li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
$width: 300px;
ul {
  li {
    background: yellow;
    width: $width;
  }
}
</style>
```



### 1.6 单文件组件样式

`scoped` 在style标签中加，css样式组件内部生效

`lang="scss"` 在style标签中加，支持scss语法

```vue
<style lang="scss" scoped> ... </style>
```



### 1.7 单文件组件生命周期

./components/Sidebar.vue  -  如 mounted()

```vue
<template>
  <div>
    <ul>
        <li v-for="item in datalist" :key="item.filmId">
            {{item.name}}
        </li>
    </ul>
  </div>
</template>

<script>
// 安装 axios 使用命令：cnpm i --save axios  安装成功后引入即可
import axios from 'axios'
export default {
    data() {
        return {
            datalist: []
        }
    },
    mounted() {
        // fetch("./maizuo.json")
        // .then(res => res.json())
        axios.get("./maizuo.json")
        .then(res => {
            // fetch 返回值在 第二个.then
            // console.log(res.data.films)
            // this.datalist = res.data.films
            // axios 返回值在 第一个.then 的 res.data 中
            console.log(res.data)
            this.datalist = res.data.data.films
        })
    }
}
</script>

<style lang="scss" scoped>
$width: 300px;
ul {
  li {
    background: yellow;
    width: $width;
  }
}
</style>
```



### 1.8 单文件组件-指令|过滤器

./App.vue

```vue
/* dom */
<template>
  <div>
    <!-- 验证指令和过滤器 -->
    <div v-hello>111111</div>
    <img :src="imgUrl | imgFilter">
  </div>
</template>

/* js */
<script>
// es6 导入 - 包括 Vue 对象也需要单独引入（哪个组件使用哪个引入）
import Vue from 'vue'

// 指令 - 支持
Vue.directive("hello", {
  inserted(el, binding) {
    // console.log("hello", el, binding)
    el.style.border = "1px solid gray"
  }
})

// 过滤器 - 支持
Vue.filter("imgFilter", (path) => {
  return path + "?imageView2/1/w/128/h/180"
})

// es6 导出规范 - babel(ES6==>ES5)
export default {
  data () {
    return {
      myname: 'jerry',
      // imgUrl: "https://p0.pipi.cn/mediaplus/friday_image_fe/0fa3341477e6e3e327ce636483bf95940d84e.jpg?imageView2/1/w/128/h/180"
      imgUrl: "https://p0.pipi.cn/mediaplus/friday_image_fe/0fa3341477e6e3e327ce636483bf95940d84e.jpg"
    }
  }
}
</script>
```



### 1.9 单文件组件-swiper轮播

vue2对应vant2，安装命令：

```bash
npm i swiper@5.x vue-awesome-swiper@4.1.1 -S
```

步骤：

```js
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

// 添加组件
components: {
    Swiper,
    SwiperSlide,
},
```

完整参考：

```vue
<template>
  <div>
    <div class="swiper">
      <swiper :options="swiperOption">
        <swiper-slide>Slide 1</swiper-slide>
        <swiper-slide>Slide 2</swiper-slide>
        <swiper-slide>Slide 3</swiper-slide>
        <swiper-slide>Slide 4</swiper-slide>
        <swiper-slide>Slide 5</swiper-slide>
        <swiper-slide>Slide 6</swiper-slide>
        <swiper-slide>Slide 7</swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

export default {
  name: "Main",
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      swiperOption: {
        spaceBetween: 30,
        slidesPerView: 5, // 一屏显示的slide个数
        centeredSlides: true, // 居中的slide是否标记为active，默认是最左active,这样样式即可生效
        slideToClickedSlide: true, // 点击的slide会居中
        // loop: true,// 循环播放, 可有无限滚动效果，初始加载即是滚动后的效果
        on: {
          // 该方法中的this都指代swiper本身
          tap: function () {
            console.log("点击的位置", this.activeIndex);
          },
        },
      },
    };
  },
  mounted() {},
  methods: {
    test(e) {
      // 默认会$event对象
      console.log(11, e);
    },
  },
};
</script>

<style scoped>
.swiper {
  width: 100%;
  height: 50px;
  bottom: 10px; /* 比如：在页面底部 */
  position: absolute;
  background-color: darkred;
}

.swiper-container {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  transition: 300ms;
  transform: scale(0.5);
}

.swiper-slide-active,
.swiper-slide-duplicate-active {
  background-color: aqua;
  transform: scale(1);
}
</style>

```

效果：

![chrome-capture-2025-12-22](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251222195258.gif)





