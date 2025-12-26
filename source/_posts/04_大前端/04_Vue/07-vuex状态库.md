---
title: 07-vuex状态库
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

```js
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  // state 公共状态字段，任何组件均可访问 <-- 通过 this.$store.state.key 访问（dom节点中不需要 this.）
  state: {},
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

**Vue2** 安装Edge浏览器扩展程序的`5.3.4`，参考下载：https://blog.csdn.net/weixin_45204443/article/details/124205504

**Vue3** 安装Chrome浏览器扩展程序的`7.7.7`版本，参考下载：https://chrome.zzzmh.cn/info/nhdogjmejiglipccpnnnanhbledajbpd

亲测可用。

如 Edge 检查 vue2 的 状态监控：

![image-20251226175647210](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251226175648379.png)



### 1.4 异步应用

1. 非父子的数据通信
2. 后端数据的缓存快照，减少重复数据请求，减轻服务器压力，提高用户体验





























