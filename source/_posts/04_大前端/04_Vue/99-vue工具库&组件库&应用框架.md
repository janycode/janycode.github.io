---
title: 99-vue工具库&组件库&应用框架
date: 2022-5-22 21:36:21
tags:
- Vue
- 工具库
- 组件库
categories: 
- 04_大前端
- 04_Vue
---

![image-20200723170734421](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200723170735.png)

参考资料：

* vue 生态开源的组件和库集合：https://github.com/vuejs/awesome-vue?tab=readme-ov-file#components--libraries
* vue3+TS 高颜值组件库(移动端)：https://wot-ui.cn/



## 1. 工具库

### 1.0 lodash - 工具库

Lodash 是一个一致性、模块化、高性能的 JavaScript 实用工具库，官网：https://www.lodashjs.com/

安装：*npm i lodash*

使用：(习惯使用 `_` 作为其对象名称来引入。)

```js
import _ from 'lodash'
```

#### 如验证 groupBy 使用

示例1：

```js
const numbers = [1, 2, 3, 4, 5, 6];
// 使用 groupBy 按「奇偶性」分组
const grouped = _.groupBy(numbers, (num) => num % 2 === 0 ? '偶数' : '奇数');
console.log(grouped);
```

```json
{
  奇数: [1, 3, 5],
  偶数: [2, 4, 6]
}
```

示例2：

```js
const users = [
  { name: '张三', age: 20 },
  { name: '李四', age: 30 },
  { name: '王五', age: 20 },
  { name: '赵六', age: 30 }
];
// 按「年龄」分组（直接传属性名字符串，更简洁）
const groupedByAge = _.groupBy(users, 'age');
console.log(groupedByAge);
```

```json
{
  '20': [{ name: '张三', age: 20 }, { name: '王五', age: 20 }],
  '30': [{ name: '李四', age: 30 }, { name: '赵六', age: 30 }]
}
```



### 1.1 axios - 请求库

axios 基于 Promise 的网络请求库，官网: https://www.axios-http.cn/ 

*npm i axios*

一般封装使用，封装工具类 

#### 1.1.1 http.js 工具类

```js
import axios from 'axios'
import { Message, MessageBox } from 'element-ui' // 适配Vue2+ElementUI的提示组件
import store from '@/store' // 如需获取token，引入vuex（可根据项目调整）
import router from '@/router' // 路由跳转（登录失效时用）

// 1. 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 环境变量区分接口前缀（推荐）
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 2. 请求取消令牌：防止重复提交
const pendingMap = new Map()
/**
 * 生成请求唯一标识
 * @param {Object} config axios配置
 */
const getPendingKey = (config) => {
  let { url, method, params, data } = config
  if (typeof data === 'string') data = JSON.parse(data) // 处理序列化后的data
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}
/**
 * 添加请求到待取消队列
 */
const addPending = (config) => {
  const key = getPendingKey(config)
  config.cancelToken = config.cancelToken || new axios.CancelToken(cancel => {
    if (!pendingMap.has(key)) {
      pendingMap.set(key, cancel)
    }
  })
}
/**
 * 移除并取消重复请求
 */
const removePending = (config) => {
  const key = getPendingKey(config)
  if (pendingMap.has(key)) {
    const cancel = pendingMap.get(key)
    cancel(`重复请求已取消：${config.url}`)
    pendingMap.delete(key)
  }
}

// 3. 请求拦截器：添加token、取消重复请求
service.interceptors.request.use(
  (config) => {
    // 取消重复请求
    removePending(config)
    addPending(config)
    
    // 添加token（根据项目鉴权方式调整）
    if (store.getters.token) {
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config
  },
  (error) => {
    console.error('请求拦截器错误：', error)
    return Promise.reject(error)
  }
)

// 4. 响应拦截器：统一错误处理、数据解构
service.interceptors.response.use(
  (response) => {
    // 移除已完成的请求
    removePending(response.config)
    
    const res = response.data
    // 业务码判断（根据后端约定调整，示例：200为成功）
    if (res.code !== 200) {
      // 提示错误信息
      Message({
        message: res.msg || '请求失败',
        type: 'error',
        duration: 3 * 1000
      })

      // 常见业务异常处理
      switch (res.code) {
        case 401: // 未登录/登录过期
          MessageBox.confirm(
            '登录状态已失效，请重新登录',
            '系统提示',
            {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            store.dispatch('user/logout').then(() => {
              router.push(`/login?redirect=${router.currentRoute.fullPath}`)
            })
          })
          break
        case 403: // 权限不足
          Message({
            message: '暂无操作权限',
            type: 'error',
            duration: 3 * 1000
          })
          break
        case 404: // 接口不存在
          Message({
            message: '请求资源不存在',
            type: 'error',
            duration: 3 * 1000
          })
          break
        case 500: // 服务器错误
          Message({
            message: '服务器内部错误，请稍后重试',
            type: 'error',
            duration: 3 * 1000
          })
          break
      }
      return Promise.reject(new Error(res.msg || '请求失败'))
    } else {
      // 成功时直接返回数据（简化业务层调用）
      return res
    }
  },
  (error) => {
    // 移除失败的请求
    if (error.config) {
      removePending(error.config)
    }
    
    // 网络/超时错误处理
    console.error('响应错误：', error)
    let msg = ''
    if (axios.isCancel(error)) {
      console.warn('请求已取消：', error.message)
      return Promise.reject(error)
    } else if (error.message.includes('timeout')) {
      msg = '请求超时，请稍后重试'
    } else if (error.message.includes('Network Error')) {
      msg = '网络异常，请检查网络连接'
    } else {
      msg = error.msg || '请求失败'
    }
    
    Message({
      message: msg,
      type: 'error',
      duration: 3 * 1000
    })
    
    // 401状态码单独处理（网络层的401）
    if (error.response && error.response.status === 401) {
      MessageBox.confirm(
        '登录状态已失效，请重新登录',
        '系统提示',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('user/logout').then(() => {
          location.reload() // 强制刷新，避免路由缓存问题
        })
      })
    }
    return Promise.reject(error)
  }
)

// 5. 暴露核心请求方法（封装常用请求类型）
export default {
  /**
   * GET请求
   * @param {string} url 接口地址
   * @param {Object} params 请求参数
   * @param {Object} config 额外配置
   */
  get(url, params = {}, config = {}) {
    return service({
      url,
      method: 'get',
      params,
      ...config
    })
  },

  /**
   * POST请求
   * @param {string} url 接口地址
   * @param {Object} data 请求体
   * @param {Object} config 额外配置
   */
  post(url, data = {}, config = {}) {
    return service({
      url,
      method: 'post',
      data,
      ...config
    })
  },

  /**
   * PUT请求
   * @param {string} url 接口地址
   * @param {Object} data 请求体
   * @param {Object} config 额外配置
   */
  put(url, data = {}, config = {}) {
    return service({
      url,
      method: 'put',
      data,
      ...config
    })
  },

  /**
   * DELETE请求
   * @param {string} url 接口地址
   * @param {Object} params 请求参数
   * @param {Object} config 额外配置
   */
  delete(url, params = {}, config = {}) {
    return service({
      url,
      method: 'delete',
      params,
      ...config
    })
  },

  /**
   * 上传文件（FormData）
   * @param {string} url 接口地址
   * @param {FormData} data 表单数据（包含文件）
   * @param {Object} config 额外配置（如进度回调）
   */
  upload(url, data, config = {}) {
    return service({
      url,
      method: 'post',
      data,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...config
    })
  }
}
```

#### 1.1.2 .env 环境变量

`.env.development` / `.env.production`

```env
# 开发环境
VUE_APP_BASE_API = '/dev-api' # 开发环境接口前缀（配合vue-cli代理）

# 生产环境
VUE_APP_BASE_API = '/prod-api' # 生产环境接口前缀
```

#### 1.1.3 vue.config.js反向代理

`vue.config.js`

```js
module.exports = {
  devServer: {
    proxy: {
      '/dev-api': {
        target: 'https://xxx.xxx.com/api', // 后端真实接口地址
        changeOrigin: true,
        pathRewrite: {
          '^/dev-api': '' // 移除前缀
        }
      }
    }
  }
}
```

#### 1.1.4 组件使用

```js
import http from '@/utils/http.js'

// GET请求
http.get('/user/list', { page: 1, size: 10 })
  .then(res => {
    console.log('用户列表：', res.data)
  })
  .catch(err => {
    console.error('请求失败：', err)
  })

// POST请求
http.post('/user/add', { name: '张三', age: 20 })
  .then(res => {
    Message.success('添加成功')
  })

// 文件上传
const formData = new FormData()
formData.append('file', file) // file为<input type="file">选择的文件
http.upload('/file/upload', formData, {
  onUploadProgress: (progressEvent) => {
    const progress = (progressEvent.loaded / progressEvent.total) * 100
    console.log('上传进度：', progress + '%')
  }
})
```



### 1.2 swiper - 轮播库

swiper 各种轮播样式库，官网: https://swiper.com.cn/

*npm i swiper*

考虑版本兼容：

```bash
# 安装swiper@5（swiper6+对Vue2支持不友好）
npm install swiper@5.4.5 --save
```

#### demo

```vue
<template>
  <!-- 轮播容器：必须设置宽度/高度 -->
  <div class="swiper-container" style="width: 100%; height: 300px;">
    <!-- 轮播内容列表 -->
    <div class="swiper-wrapper">
      <div class="swiper-slide" style="background: #f00;">
        轮播图1
      </div>
      <div class="swiper-slide" style="background: #0f0;">
        轮播图2
      </div>
      <div class="swiper-slide" style="background: #00f;">
        轮播图3
      </div>
    </div>
    <!-- 分页器（可选） -->
    <div class="swiper-pagination"></div>
    <!-- 左右切换按钮（可选） -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
// 1. 导入swiper核心和样式（ES6语法）
import Swiper from 'swiper/bundle'
import 'swiper/css/bundle' // 新版本 swiper 8+

export default {
  name: 'SwiperDemo',
  // 2. 挂载完成后初始化swiper
  mounted() {
    // 最简初始化：仅保留核心轮播功能
    new Swiper('.swiper-container', {
      loop: true, // 循环播放
      autoplay: {
        delay: 3000, // 自动切换间隔（毫秒）
        disableOnInteraction: false // 点击后仍自动播放
      },
      pagination: {
        el: '.swiper-pagination' // 分页器元素
      },
      navigation: {
        nextEl: '.swiper-button-next', // 下一页按钮
        prevEl: '.swiper-button-prev' // 上一页按钮
      }
    })
  }
}
</script>

<style scoped>
/* 可选：调整按钮样式，避免被遮挡 */
.swiper-button-prev, .swiper-button-next {
  color: gray; /* 按钮颜色 */
}
.swiper-pagination-bullet-active {
  background: orange; /* 激活的分页器颜色 */
}
</style>
```

App.vue

```vue
<template>
  <div id="app">
    <SwiperDemo/>
  </div>
</template>

<script>
import SwiperDemo from './components/SwiperDemo.vue'

export default {
  components: { SwiperDemo }
}
</script>
```

> 1. 核心步骤：导入 Swiper → 写固定 DOM 结构 → mounted 中初始化；
> 2. 必须给轮播容器设置宽高，否则无法渲染。

#### 轮播冲突

同一个页面多个轮播对象。

```js
// 解决轮播冲突：从父传过来不同的 class名，绑定新的name值，new出来对应不同的swiper轮播对象，互不影响
new Swiper('.' + this.name, {
  slidesPerView: this.perview,
  spaceBetween: 30,
  freeMode: true
})
```

```vue
<!-- 父传子：perview-轮播数量，name-是class名字 -->
<detail-swiper :perview="3.5" name="actors">...</detail-swiper>
<detail-swiper :perview="1.5" name="photos">...</detail-swiper>
```



### 1.3 moment - 时间库

moment 时间处理库，官网: https://momentjs.cn/

*npm i moment*

#### demo

```vue
<template>
  <div>
    <p>当前时间（格式化）：{{ formattedNow }}</p>
    <p>指定时间转换：{{ formattedDate }}</p>
    <p>时间差计算：{{ dateDiff }}</p>
  </div>
</template>

<script>
// ES6 导入 moment
import moment from 'moment'

export default {
  data() {
    return {
      formattedNow: '',
      formattedDate: '',
      dateDiff: ''
    }
  },
  created() {
    // 1. 格式化当前时间（最常用）
    this.formattedNow = moment().format('YYYY-MM-DD HH:mm:ss')       // 20xx-12-28 10:30:00
    // 2. 格式化指定时间（时间戳/字符串转标准格式）
    const targetDate = '20xx-12-28'
    this.formattedDate = moment(targetDate).format('YYYY年MM月DD日')  // 20xx年12月28日
    // 3. 计算时间差（例如：距离指定日期还有多少天）
    const diffDays = moment(targetDate).diff(moment(), 'days')
    this.dateDiff = `距离${targetDate}还有${diffDays}天`               // 距离20xx-12-28还有1天
  }
}
</script>
```



### 1.4 better-scroll - 流畅滚动库

better-scroll 更好的滚动库, 官网：https://better-scroll.github.io/docs/zh-CN/

*npm i better-scroll*

#### demo

```vue
<template>
  <div>
    <!-- 为了使用better-scroll用单独一个div包裹 -->
    <div class="box" :style="{ height: height }">
      <ul>
        <li v-for="data in $store.state.cinemasList" :key="data.cinemaId">
          <div class="left">
            <div class="cinema_name">{{ data.name }}</div>
            <div class="cinema_text">{{ data.address }}</div>
          </div>
          <div class="right">
            <div class="cinema_name" style="color: red">
              ￥{{ data.lowPrice / 100 }}起
            </div>
            <div class="cinema_text">距离未知</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import BetterScroll from "better-scroll";

export default {
  data() {
    return {
      height: "0px",
    };
  },
  mounted() {
    // 动态计算高度: 视口高度 - 底部选项卡高度, 注意一定要加单位 'px'
    this.height =
      document.documentElement.clientHeight -
      this.$refs.navbar.$el.offsetHeight - //还需要减去顶部的高度
      document.querySelector("footer").offsetHeight +
      "px";

    // 长度==0时的判断，后面还能看到数据是利用的 store 中的缓存
    if (this.$store.state.cinemasList.length === 0) {
      // 分发
      this.$store
        .dispatch("getCinemaData", this.$store.state.cityId)
        .then((res) => {
          console.log("异步请求结束，数据拿到");
          this.$nextTick(() => {
            new BetterScroll(".box", {
              // better-scroll 初始化
              scrollbar: {
                fade: true, // 显示滚动条
              },
            });
          });
        });
    } else {
      // 缓存：但是第一次无法滚动，所以异步请求结束时，也需要对 better-scroll 初始化
      this.$nextTick(() => {
        new BetterScroll(".box", {
          // better-scroll 初始化
          scrollbar: {
            fade: true, // 显示滚动条
          },
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  // 配合better-scroll使用，必须设置高度 和 溢出隐藏
  // height: 38.625rem; // 理想高度：视口高度 减 底部固定导航高度,rem是基于宽度，所以高度需要js动态计算
  overflow: hidden;
  // 防止better-scroll的滚动条错位：加定位
  position: relative;
}
</style>
```



### 1.5 BI大屏应用

* `datav`：http://datav.jiaminghi.com/

* `GoView`：https://mtruning.club/



### 1.x 综合

> 1. **通用工具首选**：Lodash（全能）、Underscore（轻量）、Ramda（函数式）；
> 2. **日期处理主流**：date-fns（TypeScript 优先）、dayjs（轻量兼容）；
> 3. **数据验证推荐**：Zod（前端 / TS 项目）、Joi（后端 Node.js 项目）；
> 4. **网络请求标配**：Axios（浏览器 / Node.js 通用）；
> 5. **历史 / 传统项目**：jQuery（DOM 操作）、Moment.js（不推荐新项目，用 dayjs/date-fns 替代）。





## 2. 交互集

### 2.1 索引城市

demo

```vue
<template>
  <van-index-bar :index-list="computedCityList" @change="handleChange">
    <div v-for="data in cityList" :key="data.type">
      <van-index-anchor :index="data.type" />
      <van-cell :title="item.name" v-for="item in data.list" :key="item.cityId" @click="handleCityClick(item)" />
    </div>
  </van-index-bar>
</template>

<script>
import http from "@/util/http.js";
import Vue from 'vue';
import { Toast } from 'vant';

Vue.use(Toast);

export default {
  data() {
    return {
      cityList: [],  //[{type: 'A', list:[{cityId: 111, isHot: 0, name: '', pinyin:''}, ...]}, ...]
    };
  },
  computed: {
    computedCityList() {
      // 过滤出收集到的字母：目的为了排除掉无城市值的索引字母
      return this.cityList.map((item) => item.type);
    },
  },
  mounted() {
    http({
      url: "https://m.maizuo.com/gateway?k=1105782",
      headers: {
        "x-host": "mall.film-ticket.city.list",
      },
    }).then((res) => {
      console.log("res->cities: ", res.data.data.cities)
      //解析组装城市数据结构
      this.cityList = this.renderCity(res.data.data.cities);
      console.log(this.cityList);
    });
  },
  methods: {
    renderCity(list) {
      //console.log(list);
      let cityList = [];
      let letterList = [];
      for (let i = 0; i < 26; i++) {
        letterList.push(String.fromCharCode(65 + i)); // 26个大写
        // letterList.push(String.fromCharCode(97 + i))  // 26个小写
      }
      //console.log(letterList);
      letterList.forEach((letter) => {
        let newList = list.filter(
          (item) => item.pinyin.substring(0, 1) === letter
        );
        newList.length > 0 &&
          cityList.push({
            type: letter,
            list: newList,
          });
      });
      return cityList;
    },
    handleChange(data) {
        // console.log("change->", data)  // data是字母
        Toast(data);
    },
    handleCityClick(item) {
        console.log(item.name)
        // 多页面方案：方式1-拼接到路径，方式2-cookie，方式3-localStorage
        // location.href = '#/cinemas?cityname=' + item.name;
        // 单页面方案：方式1-中间人模式，方式2-bus总线 $on,$emit
        // vuex-状态管理模式
        // this.$store.state.cityName = item.name  //不要去直接修改，无法被vuex监控到

        // 提交给 mutations 监管
        this.$store.commit('changeCityName', item.name)
        this.$store.commit('changeCityId', item.cityId)
        
        // 给 $router.back() 传参，使用 $route.params
        // this.$route.params.cityId = item.cityId
        // 点击城市的时候触发 vuex 的 action 去获取影院列表，同步就渲染了影院列表dom数据
        this.$store.dispatch("getCinemaData", item.cityId)
        this.$router.back()
    }
  },
};
</script>

<style lang="scss">
// 控制vant toast显示字母的宽度，覆盖默认样式需要去掉 scoped - 但防影响范围要做好充分的测试
.van-toast--html, .van-toast--text {
    min-width: 20px;
}
</style>
```

![image-20251228220036213](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251228220038127.png)

### 2.2 滑动吸顶

DetailHeader.vue - 可用 vant Navbar导航栏 组件代替。

```vue
<template>
  <div class="header">
    <i class="left" @click="handleBack">&lt;</i>
    <slot></slot>
    <i class="iconfont icon-fenxiang right"></i>
  </div>
</template>

<script>
export default {
  methods: {
    handleBack () {
      // 返回上一页：从哪页来返回哪页
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2.75rem;
  line-height: 2.75rem;
  text-align: center;
  background: white;
  .left {
    font-size: 22px;
    position: fixed;
    left: .625rem;
    top: 0;
    height: 2.75rem;
    line-height: 2.75rem;
  }
  .right {
    font-size: 22px;
    position: fixed;
    right: .625rem;
    top: 0;
    height: 2.75rem;
    line-height: 2.75rem;
  }
}
</style>

```

使用自定义指令实现：

```vue
<template>
  <!-- v-if 解决http请求还未有数据响应时默认取值问题 -->
  <div v-if="filmInfo">
    <detail-header v-scroll="50">
      {{ filmInfo.name }}
    </detail-header>
    ...
  </div>
</template>

<script>
...
import detailHeader from "@/components/detail/DetailHeader.vue";
// 指令
Vue.directive("scroll", {
  inserted(el, binding) {
    el.style.display = "none";
    // 往下滚动超过50像素时显示 header 吸顶
    window.onscroll = () => {
      console.log("scroll");
      if (
        (document.documentElement.scrollTop || document.body.scrollTop) >
        binding.value
      ) {
        el.style.display = "block";
      } else {
        el.style.display = "none";
      }
    };
  },
  unbind() {
    window.onscroll = null;
  },
});
...
</script>
```

![image-20251228215933272](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251228215935038.png)

### 2.3 折叠|展开

```vue
<template>
  <!-- v-if 解决http请求还未有数据响应时默认取值问题 -->
  <div v-if="filmInfo">
    ...
    <div class="content">
      <div>{{ filmInfo.name }}</div>
      <div>
        ...
        <!-- 静态class和动态绑定的:class 会共存！ style 也同理 -->
        <div class="detail-text" :class="isHidden ? 'hidden' : ''" style="line-height: 20px">
          {{ filmInfo.synopsis }}
        </div>
        <div style="text-align: center">
          <!-- 动态绑定:class与静态共存，控制字体图标的切换显示 -->
          <i class="iconfont" :class="isHidden ? 'icon-down' : 'icon-up'" @click="isHidden = !isHidden"></i>
        </div>
      </div>
    </div> 
  </div>
</template>

<script>
export default {
  data() {
    return {
      isHidden: true,
    }
  }
}
</script>

<style lang="scss" scoped>
.hidden {
  overflow: hidden;
  height: 1.25rem;
}
</style>

```

![image-20251228215831651](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251228215835113.png)





## 3. 主流开源组件库

#### 1. Tailwind CSS（工具类优先的原子化 CSS 框架）

- **定位**：不是传统组件库，而是原子化 CSS 工具集，可快速定制任意风格的用户端页面（官网 / 商城首选）
- **核心优势**：高度灵活、无预设样式束缚、响应式适配极佳，适合需要定制化设计的商城 / 品牌官网
- **企业应用**：Shopify、Netflix、Twitch、阿里 / 字节等大厂大量使用
- **官网**：https://tailwindcss.com/
- **补充**：搭配 `daisyUI`（基于 Tailwind 的组件库）使用更高效：https://daisyui.com/

#### 2. Ant Design（AntD，阿里出品）

- **定位**：不仅支持后台，也深度适配用户端场景（商城、官网、用户中心），设计体系成熟
- **核心优势**：组件丰富（含导航、轮播、商品卡片、表单等用户端核心组件）、交互规范统一、支持响应式
- **企业应用**：阿里系产品、知乎、B 站等大量使用
- **官网**：https://ant.design/
- **补充**：Vue 版本：https://www.antdv.com/（适配 Vue2/Vue3）

#### 3. Vuetify（Vue 生态用户端首选）

- **定位**：基于 Material Design 的 Vue 专属组件库，专为用户端场景优化（商城、官网、移动端 H5）
- **核心优势**：组件覆盖全（商品列表、轮播、购物车、支付组件等）、响应式原生支持、移动端适配优秀
- **企业应用**：大量中小电商、品牌官网使用，Vue 生态用户端场景渗透率极高
- **官网**：https://vuetifyjs.com/

#### 4. Bootstrap（经典通用型）

- **定位**：最老牌的响应式 CSS 框架，适配所有用户端场景（官网、商城、营销页）
- **核心优势**：生态极广、文档完善、学习成本低，适合快速搭建商城 / 官网
- **企业应用**：全球数百万网站使用，包括 NASA、Twitter 早期版本
- **官网**：https://getbootstrap.com/

#### 5. Element Plus（扩展用户端场景）

- **定位**：虽以后台为主，但 V2 版本大幅增强用户端组件（商品卡片、轮播、导航、优惠券等）
- **核心优势**：Vue3 生态最成熟，组件风格可定制，适合需要统一前后端风格的商城 / 官网
- **企业应用**：国内大量中小电商、品牌官网使用
- **官网**：https://element-plus.org/

#### 6. MUI（Material UI，React 生态首选）

- **定位**：基于 Material Design 的 React 组件库，专为用户端场景设计（商城、官网、移动端 H5）
- **核心优势**：组件精美、交互流畅、响应式适配优秀，适合 React 技术栈的商城 / 官网
- **企业应用**：Google 系产品、Airbnb、Netflix 等使用
- **官网**：https://mui.com/

#### 7. Vant（移动端用户端专用）

- **定位**：有赞出品，专为移动端 H5 / 小程序设计的 Vue 组件库（商城、电商 H5、会员中心）
- **核心优势**：轻量、高性能、适配各种移动端机型，电商场景组件全覆盖（购物车、支付、优惠券）
- **企业应用**：有赞生态、京东、拼多多部分移动端页面
- **官网**：https://vant-ui.github.io/vant/

#### 8. Layui（轻量通用型）

- **定位**：国产轻量 UI 框架，无框架依赖（原生 JS），适配官网 / 商城 / 营销页
- **核心优势**：学习成本极低、开箱即用，适合非前后端分离的传统官网 / 商城
- **企业应用**：国内大量中小企业官网、小型商城使用
- **官网**：https://layui.dev/

### 场景选型

| 场景                  | 首选组件库             | 次选组件库             |
| --------------------- | ---------------------- | ---------------------- |
| Vue3 + 商城 / 官网    | Vuetify / Element Plus | Tailwind CSS + daisyUI |
| React + 商城 / 官网   | MUI (Material UI)      | Ant Design             |
| 移动端 H5 / 小程序    | Vant                   | MUI (移动端适配版)     |
| 高度定制化官网 / 商城 | Tailwind CSS           | Bootstrap              |
| 快速搭建 / 低学习成本 | Bootstrap              | Layui                  |

### 总结

1. **通用首选**：Tailwind CSS（高度定制）、Bootstrap（快速搭建）是所有用户端场景的基础选择，适配性最广；
2. **框架绑定型**：Vue 生态选 Vuetify/Element Plus，React 生态选 MUI/Ant Design，移动端选 Vant；
3. **企业级适配**：Ant Design、Element Plus、Vuetify 是国内企业做商城 / 官网最常用的三大组件库，兼顾功能、美观和维护性。



## 4. 企业应用级框架

### 一、若依系列（RuoYi）—— 标杆级，企业应用量 TOP1

作为你参考的标杆框架，若依本身是国内企业落地最多的 Vue 前后端一体框架，衍生多版本适配不同场景，**Vue2 版本仍是企业主流**：

- 核心版本：`RuoYi-Vue`（Vue2 + Element UI）

  ✅ 特殊注明：Vue2 版本，企业应用量绝对第一，中小型公司、传统企业信息化项目首选，生态完善、教程丰富、二次开发成本极低；

  ✅ 配套后端：Spring Boot 单体 / 微服务，前后端分离 + 一键部署，内置用户 / 角色 / 菜单 / 部门 / 字典 / 日志等全套系统基础功能；

  ✅ 衍生版本：RuoYi-Vue3（Vue3 + Element Plus）、RuoYi-Cloud（微服务版），但企业实际落地中 Vue2 版本占比超 80%。

### 二、Jeecg-Boot —— 中大型企业首选，功能更全面（Vue2 为主流）

国内**中大型企业落地量第二**的前后端一体框架，比若依功能更丰富，侧重低代码、可视化开发，适配复杂业务场景：

- 核心版本：`Jeecg-Boot Vue2`（Vue2 + Element UI）

  ✅ 特殊注明：Vue2 版本为企业主流，中大型制造、政务、金融企业首选，支持低代码表单 / 报表 / 大屏，内置工作流、在线代码生成、移动端适配；

  ✅ 配套后端：Spring Boot + MyBatis-Plus，支持微服务、多数据源、分布式事务，前后端代码一键生成，大幅降低开发量；

  ✅ Vue3 版本：已推出 Jeecg-Boot Vue3 版，但企业落地仍以 Vue2 为主，生态和稳定性更成熟。

### 三、Avue Admin —— 可视化强，快速开发（Vue2 为主流）

基于若依 / Jeecg 优化，主打**可视化配置、零代码 / 低代码开发**，适合快速落地中小型企业应用，企业落地量稳居前三：

- 核心版本：`Avue Admin Pro`（Vue2 + Element UI + Avue 组件库）

  ✅ 特殊注明：Vue2 版本为绝对主流，Avue 组件库本身基于 Vue2 开发，封装了大量企业级业务组件（表格、表单、弹窗等），支持拖拽式配置；

  ✅ 核心优势：在若依基础上强化了可视化开发能力，后端接口 + 前端页面可通过配置生成，开发效率比若依更高，适合快速迭代的企业项目；

  ✅ 配套后端：兼容 Spring Boot 单体 / 微服务，可直接对接若依 / Jeecg 后端，前后端分离部署。

### 四、D2Admin —— 轻量灵活，中小团队首选（Vue2 版本主流）

一款**轻量、高可定制化**的 Vue 前后端一体框架，比若依更灵活，无过度封装，适合需要二次开发深度定制的中小团队：

- 核心版本：`D2Admin V2`（Vue2 + Element UI）

  ✅ 特殊注明：Vue2 版本为企业主流，体积小、启动快，内置基础权限体系、路由懒加载、主题定制等企业级功能，无冗余代码；

  ✅ 核心优势：文档完善，易上手，支持多环境配置、打包优化，可快速剥离基础框架做定制化开发，适合互联网创业公司、中小型科技企业；

  ✅ 配套后端：无强绑定，可快速对接 Spring Boot 后端（官方提供对接示例），前后端分离解耦性强。

### 五、Vue Admin Template 生态 —— 阿里系基础，企业二次开发首选（Vue2 版本主流）

由**饿了么团队（Element UI 官方）** 维护的基础框架，是国内绝大多数 Vue 企业级框架的底层基础（包括若依），**企业落地量极大**，以 “基础、稳定、无冗余” 为核心：

- 核心版本：`Vue Admin Template`（Vue2 + Element UI）

  ✅ 特殊注明：Vue2 版本为绝对主流，本身是轻量基础框架（仅含权限、路由、布局核心功能），无业务代码，企业均基于此做二次开发；

  ✅ 核心优势：阿里系维护，稳定性拉满，兼容所有 Element UI 组件，是若依、Jeecg 等框架的 “底层基石”，大型企业更倾向基于此定制专属框架；

  ✅ 衍生版本：PanJiaChen/vue-element-admin（基于该模板的全功能版，含所有企业级功能），企业落地中均以 Vue2 版本为主。

### 六、Naive Admin —— 新一代 Vue3 企业级标杆（替代 Vue2 框架的主流选择）

目前**Vue3 版本中企业落地最快**的前后端一体框架，对标若依，解决 Vue2 框架的技术迭代问题，是近几年企业新立项项目的首选：

- 核心版本：`Naive Admin`（Vue3 + Naive UI + Vite）

  ✅ 无 Vue2 版本，纯 Vue3 生态，配套 Spring Boot 3.x 后端，前后端分离 + 一键部署；

  ✅ 核心优势：内置全套企业级功能（用户 / 角色 / 菜单 / 日志 / 字典等），基于 Vite 构建，启动快、打包小，Naive UI 组件库适配企业级场景，文档完善；

  ✅ 企业适配：互联网企业、中大型科技公司新立项项目首选，替代传统 Vue2 框架，二次开发成本低，生态正在快速赶超 Vue2 框架。

### 七、Ant Design Pro Vue —— 中大厂首选，阿里系生态（Vue2 版本主流）

基于**阿里 Ant Design Vue** 组件库的企业级框架，对标阿里 React 版 Ant Design Pro，是中大型互联网企业、大厂分部的首选：

- 核心版本：`Ant Design Pro Vue V2`（Vue2 + Ant Design Vue 1.x）

  ✅ 特殊注明：Vue2 版本为企业主流，中大厂落地量高，组件库风格更贴合互联网产品，内置中后台常用的所有功能模块；

  ✅ 核心优势：阿里系生态，组件库稳定性强，支持微前端、多标签页、主题定制，适配复杂的中后台业务场景；

  ✅ Vue3 版本：Ant Design Pro Vue V3（Vue3 + Ant Design Vue 2.x），企业落地正在逐步增加，但 Vue2 版本仍占主导。

### 核心选型总结（按企业场景分类）

#### 1. 优先选 Vue2 框架（传统企业、中小型项目、低改造成本）

✅ 若依（RuoYi-Vue）：企业量 TOP1，教程最多，二次开发最简单；

✅ Jeecg-Boot：中大型企业，需要低代码 / 工作流 / 复杂业务；

✅ Avue Admin：快速开发，可视化配置，中小团队首选。

#### 2. 优先选 Vue3 框架（新立项项目、互联网企业、技术迭代）

✅ Naive Admin：对标若依，Vue3 生态标杆，企业落地最快；

✅ 若依 Vue3 版（RuoYi-Vue3）：有 Vue2 开发经验，无缝迁移；

✅ Ant Design Pro Vue V3：中大厂，阿里系生态偏好。

#### 3. 核心共性

以上所有框架均为**前后端一体**（配套 Spring Boot 后端），内置企业级必备的**权限管理、系统基础功能、模块化开发**能力，与若依定位一致，且均经过大量企业项目验证，稳定性和可维护性拉满。
