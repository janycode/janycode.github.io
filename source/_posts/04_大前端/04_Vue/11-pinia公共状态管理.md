---
title: 11-pinia公共状态管理
date: 2022-5-22 21:36:21
tags:
- Vue
- vuex
- pinia
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
* pinia 新状态库：https://pinia.vuejs.org/zh/


## 1. pinia 新状态管理库(★)

[Pinia官网](https://pinia.vuejs.org/zh/) - **符合直觉的  Vue.js 状态管理库** - 类型安全、可扩展性以及模块化设计。 甚至让你忘记正在使用的是一个状态库。

* 类型自动推断
* 支持 vue2 和 vue3
* 极致轻量大小只有 1kb 左右

> Pinia API与Vuex(≤4)也有很多不同，即:
>
> * `mutotion 已被弃用`。它们经常被认为是极其冗余的。它们初衷是带来 devtools 的集成方案，但这已不再是一个问题了。
> * `无需要创建自定义的复杂包装器`来支持TypeScript，一切都可标注类型，API的设计方式是尽可能地利用TS类型推理。
> * `无过多的魔法字符串注入。`只需要导入函数并调用它们，然后享受自动补全的乐趣就好。
> * `无需要动态添加Store`，它们默认都是动态的，甚至你可能都不会注意到这点。注意，你仍然可以在任何时候手动使用一个Store来注册它，但因为它是自动的，所以你不需要担心它。
> * `不再有嵌套结构的模块`。你仍然可以通过导入和使用另一个Store来隐含地嵌套stores空间。虽然Pinia从设计上提供的是一个扁平的结构，但仍然能够在Store之间进行交叉组合。你甚至可以让 stores有循环依赖关系。
> * `不再有可命名的模块`。考虑到Store的扁平架构，Store的命名取决于它们的定义方式，你甚至可以说所有Store都应该命名。



### 1.1 安装和导入

安装：*npm i pinia*

使用：

1. 导入：main.js

```js
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'      //导入pinia插件

createApp(App)
.use(createPinia())                      //使用pinia插件
.mount('#app')
```



### 1.2 使用 option 风格

store 模块独立定义，独立维护。

* `state`，公共状态字段，格式 `state: () => { return { xx:xx, ...} }`  或 `state: () => ({ xx:xx, ... })`
* `getters`，计算属性，格式 `getters: { 计算属性(state) {...} }`
* `actions`，维护修改公共状态字段的方法，支持同步和异步，格式：`actions: { func(v) { this.xx = v }}`

目录：

```js
src/
  store/
    moduleAStore.js    //单独定义各自维护具体模块的 xxxStore.js
    moduleBStore.js    //单独定义各自维护具体模块的 xxxStore.js
    ...
```

src/store/tabbarStore.js

```js
import { defineStore } from "pinia";

// 命名建议 use 开头的驼峰格式，第一个参数是 唯一storeId
const useTabbarStore = defineStore("tabbar", {
    //option store 风格
    state: () => {               //为了完整类型推理，推荐使用箭头函数
        return {
            count: 0,            //所有这些属性都将自动推断出它们的类型
            isTabbarShow: true
        }
    },
    getters: {
        doubleCount(state) {
          return state.count * 2
        },
    },
    actions: {
        change(value) {
            this.isTabbarShow = value   //调用方式: store.change(false)
        }
    }
})

export default useTabbarStore
```

App.vue - `此风格常用`

```vue
<template>
  <div class="box">
    <Tabbar v-show="store.isTabbarShow"></Tabbar>
  </div>
</template>

<script setup>
import Tabbar from "./components/Tabbar.vue"
import useTabbarStore from "./store/tabbarStore";

const store = useTabbarStore()   //然后js或dom中就直接 store.公共状态 访问或修改均可，拥有响应性
</script>
```

选项式使用 pinia - 老的使用风格

```vue
<template>
  <div class="box">
    <Tabbar v-show="isTabbarShow"></Tabbar>
  </div>
</template>

<script setup>
import useTabbarStore from "./store/tabbarStore";
export default {
    computed: {
        ...mapState(useTabbarStore, ["isTabbarShow"])  //从 useTabbarStore 解构出来，此时可直接使用，无需 store.
    }
}
</script>
```



> `store.$patch({ key:value })`  对部分的值进行补丁式修改（同名覆盖、其他合并）
>
> `store.$reset()`  重置store为默认值



### 1.3 使用 setup 风格(★)

完全是钩子函数封装的写法，包括 watch 也可以写在这块逻辑中。

src/store/tabbarStore.js

```js
import { defineStore } from "pinia";
import { ref } from "vue";

const useTabbarStore = defineStore("tabbar", () => {
    const isTabbarShow = ref(true)
    const change = (value) => {
        isTabbarShow.value = value
    }
    return {
        isTabbarShow,
        change
    }
})

export default useTabbarStore
```

src/store/cinemasStore.js

```js
import { defineStore } from "pinia";
import { ref } from "vue";

const useCinemasStore = defineStore("cinemas", () => {
    const cinemaList = ref([])
    const getCinemaList = async () => {
        let res = await axios({
            url: 'https://api', 
            headers: { 'x': 'y' }
        })
        cinemaList.value = res.data.data.cinemas
    }
    const computedCinemaList = computed(() =>
        (type) => {
            return cinemaList.value.filter(item => item.type === type)
        }
    )
    return {
        cinemaList,
        getCinemaList,
        computedCinemaList
    }
})

export default useCinemasStore
```



### 1.4 actions 异步

```js
const useUsers = defineStore('users', {
    state: () => ({
        userData: null,
    }),
    actions: {
        async registerUser(login, password) {
          try {
            this.userData = await api.post({ login, password })
            showTooltip(`欢迎回来 ${this.userData.name}!`)
          } catch (error) {
            showTooltip(error)
            return error  // 让表单组件显示错误
          }
        },
      },
})
export default useUsers
```



### 1.5 跨store使用

src/store/cityStore.js

```js
import { defineStore } from "pinia";
import { ref } from "vue";

const useCityStore = defineStore("city", () => {
    const cityId = ref(110100)
    const cityName = ref("北京")
    const changeCity = (id, name) => {
        cityId.value = id
        cityName.value = name
    }

    return {
        cityId,
        cityName,
        changeCity
    }
})

export default useCityStore
```

src/store/cinemasStore.js

```js
import { defineStore } from "pinia";
import { ref } from "vue";
import useCityStore from "./cityStore";  //引入其他的 store
const cityStore = useCityStore()         //使用其他的 store

const useCinemasStore = defineStore("cinemas", () => {
    const cinemaList = ref([])
    const getCinemaList = async () => {
        let res = await axios({
            url: `https://api?cityId=${cityStore.cityId}`,  //其他 store 直接无感使用
            headers: { 'x': 'y' }
        })
        cinemaList.value = res.data.data.cinemas
    }
    const computedCinemaList = computed(() =>
        (type) => {
            return cinemaList.value.filter(item => item.type === type)
        }
    )
    return {
        cinemaList,
        getCinemaList,
        computedCinemaList
    }
})

export default useCinemasStore
```









