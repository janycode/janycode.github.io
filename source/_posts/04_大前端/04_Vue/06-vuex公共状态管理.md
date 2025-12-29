---
title: 06-vuex公共状态管理
date: 2018-5-22 21:36:21
tags:
- Vue
- vuex
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
* vuex 持久化：https://github.com/robinvdvleuten/vuex-persistedstate

## 1. vuex状态库

### 1.1 介绍

Vuex 是一个专为 Vue.js 应用程序开发的**状态管理模式**。

它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

匹配 vue2 版本是 vuex3：https://v3.vuex.vuejs.org/zh/

匹配 vue3 版本是 vuex4：https://vuex.vuejs.org/zh/

![vuex](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251226165655952.png)

状态（值）被修改必须经过 Mutations（`内部只支持同步`），通过 Devtools 能够记录出值的变化，让数据改变更安全、可追溯可跟踪。

vuex 默认的管理在内存，只要刷新页面公共状态就丢失了。需要进行持久化处理。



### 1.2 同步工作流

`state` 公共状态字段，任何组件均可访问

* 通过 *this.$store.state.状态名* 访问（dom节点中不需要 this.）

`getters` 从store的state派生一些状态，它的返回值会根据它的依赖被缓存，且只有当依赖值发生改变才会被重新计算。可以认为是 **store 的计算属性**

* 通过 *this.$store.getters.计算属性名* 访问

`mutaitons` 只支持同步，维护修改 state 的方法，统一管理且被devtools记录state的修改

* 通过 *this.$store.`commit`("func", param)* 触发调用

`actions` 支持异步和同步的方法实现

* 通过 *this.$store.`dispatch`("func", param)* 触发调用

`modules`

* 将 store 分割成**模块（module）**。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块，[参考官方文档](https://v3.vuex.vuejs.org/zh/guide/modules.html)

```js
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  // state 公共状态字段，任何组件均可访问 <-- 通过 this.$store.state.key 访问（dom节点中不需要 this.）
  state: {},
  // getters 可以从store中的state中派生出一些状态，getters的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算
  getters: {},
  // mutations 只支持同步，统一管理且被devtools记录state的修改 <-- 通过 this.$store.commit("func", param) 触发调用
  mutations: {},
  // actions 支持异步和同步的方法实现 <-- 通过 this.$store.dispatch("func", param) 触发调用
  actions: {},
  modules: {}
})
```

1. `state` 定义公共状态字段。
2. `$store.state.key`组件里使用 state 中的公共状态字段（如果变化也会立即拦截渲染）
3. `this.$store.commit(function, newValue)`有组件提交了公共状态字段的修改方法
4. `mutations` 统一管理和记录，并执行修改逻辑

![image-20251226170914203](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251226170915736.png)



### 1.3 vue-devtools

`vue-devtools` 浏览器插件，可视化跟踪公共状态字段和方法的过程，支持时光回溯。

**Vue2** 安装Edge浏览器扩展程序的`5.3.4`版本，参考下载：https://blog.csdn.net/weixin_45204443/article/details/124205504

**Vue3** 安装Chrome浏览器扩展程序的`7.7.7`版本，参考下载：https://chrome.zzzmh.cn/info/nhdogjmejiglipccpnnnanhbledajbpd

亲测可用。

如 Edge 检查 vue2 的 状态监控：

![image-20251226175647210](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251226175648379.png)



### 1.4 异步应用

1. 非父子的数据通信
2. 后端数据的缓存快照，减少重复数据请求，减轻服务器压力，提高用户体验

```js
import Vue from 'vue'
import Vuex from 'vuex'
import http from "@/util/http.js";

Vue.use(Vuex)

export default new Vuex.Store({
  // state 公共状态（任何组件可访问）
  state: {
    cityId: '310100',
    cityName: '上海',
    cinemasList: []
  },
  getters: {
  },
  // 统一管理，被 devtools 记录状态的修改(只支持同步)，参数是 state 和 自定义参数
  mutations: {
    changeCityName(state, newName) {
      state.cityName = newName
    },
    changeCityId(state, newId) {
      state.cityId = newId
    },
    changeCinemaData(state, list) {
      state.cinemasList = list
    },
    clearCinemasList(state) {
      state.cinemasList = []
    }
  },
  // 支持异步和同步，参数是 store 和 自定义参数
  actions: {
    getCinemaData(store, cityId) {
      console.log("getCinemaData->http")
      // return 的是 promise 对象
      return http({
        url: `/gateway?cityId=${cityId}&ticketFlag=1&k=6136159`,
        headers: {
          "X-Host": "mall.film-ticket.cinema.list",
        },
      }).then((res) => {
        console.log("res->", res.data.data.cinemas)
        store.commit("changeCinemaData", res.data.data.cinemas)
      });
    }
  },
  modules: {
  }
})
```

### 1.5 注意

1. 应用层级的状态应该集中到单个 store 对象中（即单个项目）。
2. 提交 mutation 是更改状态的唯一方法，并且这个过程是同步的。
3. 异步逻辑都应该封装到 action 里面。



## 2. vuex新写法

### 2.1 mapState

`...mapState["title"]`  等价于 `this.$store.state.状态名`，新写法：**this.状态名**

* 导入 *import { mapState } from 'vuex'*，就不需要再 .$store.state. 了，直接 *this.* 就可以通过mapState访问到 store 中的公共状态字段
* 映射在计算属性 `computed` 中

示例：

```vue
<script>
...
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['cityId', 'cinemasList'])
  },
  mounted() {
    // if (this.$store.state.cinemasList.length === 0) {         // 不需要再 .$store.state 了，直接 this.
    if (this.cinemasList.length === 0) {
      // 分发
      this.$store
        // .dispatch("getCinemaData", this.$store.state.cityId)  // 不需要再 .$store.state 了，直接 this.
        .dispatch("getCinemaData", this.cityId)
        .then((res) => {
          console.log("异步请求结束，数据拿到");
          ...
</script>
```

本质原理：

```js
  computed: {
    cinemasList() {                            // 这种写法也可以 this.cinemasList
      return this.$store.state.cinemasList
    }
    //...mapState(['cinemasList']),
  },
```



### 2.2 mapGetters

`...mapGetters(["计算属性名"])`  等价于 `this.$store.getters.计算属性名`，新写法：**this.计算属性名**

* 映射在计算属性 `computed` 中

### 2.3 mapMutations | mapActions

`...mapMutations(["func"])`  等价于 `this.$store.commit("func", param)`，新写法：**this.func(param)**

`...mapActions(["func"])`  等价于 `this.$store.dispatch("func", param)`，新写法：**this.func(param)**

* 导入 *import { mapActions, mapMutations } from 'vuex'*，直接 *this.* 就可以访问到 store 中的对应方法
* 映射在计算属性 `methods` 中

示例：

```vue
// dom中也可以直接写 公共状态名，不需要 $store.state. 了
<template #left>
{{ cityName }}
<van-icon name="arrow-down" />
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState(['cityId', 'cityName', 'cinemasList'])
  },
  mounted() {
    // if (this.$store.state.cinemasList.length === 0) {
    if (this.cinemasList.length === 0) {
      // this.$store.dispatch('getCinemaData', this.cityId)
      this.getCinemaData(this.cityId)
        .then((res) => {...});
    } else {...}
  },
  methods: {
    onClickLeft() {
      Toast("城市");
      this.$router.push("/city");
      // this.$store.commit("clearCinemasList")
      this.clearCinemasList()
    },
    ...mapActions(['getCinemaData']),
    ...mapMutations(['clearCinemasList'])
  },
};
</script>
```





## 3. vuex+mixins 混入

`mixins` 需要结合 [混入](https://v2.cn.vuejs.org/v2/guide/mixins.html) 的使用方式。如 通过 vuex 控制底部选项卡显示/隐藏。


src/App.vue

```vue
<template>
  <div>
    ...
    <!-- 底部选项卡 -->
    <tabbar ref="mytabbar" v-show="$store.state.isTabbarShow"></tabbar>
  </div>
</template>
```


src/store/index.js

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isTabbarShow: true
  },
  mutations: {
    show(state) {
      state.isTabbarShow = true
    },
    hide(state) {
      state.isTabbarShow = false
    }
  },
})
```

src/util/mixinObj.js

```js
// 公共对象，谁用谁导入即可
let tabbarShowHide = {
    created() {
        console.log("tabbarShowHide 创建完成")
        this.$store.commit("hide")
    },
    destroyed() {
        console.log("tabbarShowHide 对象销毁")
        this.$store.commit("show")
    },
    methods: {
        aaa() {
            console.log("方法也可以混入被click事件触发，注意重名")
        }
    }
}
// 默认导出
export default tabbarShowHide
```

src/views/City.vue - 城市索引列表里不显示底部选项卡、其他位置正常展示。

```vue
<template>
  ...
</template>

<script>
import tabbarShowHide from '@/util/mixinObj.js'

export default {
  // 混入 - 控制底部选项卡是否显示 
  mixins: [tabbarShowHide],
  data() {},
};
</script>
```



## 4. vuex持久化

大部分场景不需要持久化，通过后端接口获取最新的数据渲染出来。

特殊的一些场景，比如 `选择了城市后，刷新页面，已选择的城市不能变化`。

### 4.1 vuex-persistedstate

源码和用法：https://github.com/robinvdvleuten/vuex-persistedstate

`vuex-persistedstate` 持久化插件安装：

```bash
cnpm i vuex-persistedstate
```

用法：store/index.js

```js
import createPersistedState from "vuex-persistedstate";

export default new Vuex.Store({
  // ...
  // 部分字段持久化
  plugins: [createPersistedState({
    storage: window.sessionStorage,  //默认是 localStorage
    reducer: (state) => {            //默认是 state 里的数据全部存储
      return {                       //定义只存储部分字段
        cityId: state.cityId,
        cityName: state.cityName
      }
    }
  })],
});
```

![image-20251229124725751](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251229124726877.png)



























