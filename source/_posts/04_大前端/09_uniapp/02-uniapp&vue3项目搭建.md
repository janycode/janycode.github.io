---
title: 02-uniapp&vue3项目搭建
date: 2022-5-22 21:36:21
tags:
- uniapp
- vue3
categories: 
- 04_大前端
- 09_uniapp
---



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260204182332703.png)

参考：

* uni-app 官网：https://www.dcloud.io/
* HBuild X 开发工具：https://hx.dcloud.net.cn/
* uni-helper (uni-app脚手架)：https://uni-helper.js.org/

> 免费测试api接口：https://jsonplaceholder.typicode.com/
>
> 随机猫咪API接口：https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=10
>
> 随机狗子API接口：https://pro-api.thedogapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=5
>
> NBA球员榜：https://tiyu.baidu.com/api/match/playerranking/match/NBA/tabId/60



## 1. 萌宠项目 demo

### 1.1 单页实现 demo

* 页面布局、数据请求、数据渲染
* 懒加载：图片懒加载、页面触底懒加载
* 下拉刷新、点击刷新、回到顶部
* `env(safe-area-inset-bottom)` - 不同设备兼容适应底部的安全区域

```html
<template>
  <view class="container">
    <view class="menu">
      <!-- 扩展组件：uni-segmented-control 分段器 -->
      <uni-segmented-control
        :current="current"
        :values="values"
        @clickItem="onClickItem"
        styleType="button"
        activeColor="#14c145"></uni-segmented-control>
    </view>
    <view class="layout">
      <view class="box" v-for="(item, index) in pets" key="item._id">
        <view class="pic">
          <!-- lazy-load 图像懒加载，小程序中支持 -->
          <image
            :src="item.url"
            mode="widthFix"
            @click="onPreview(index)"
            lazy-load></image>
        </view>
        <view class="text">{{ item.id }}</view>
        <view class="author">——{{ item.width }}x{{ item.height }}</view>
      </view>
    </view>

    <view class="float">
      <view class="item" @click="onRefresh">
        <!-- 扩展组件：uni-icons 图标 -->
        <uni-icons type="refreshempty" size="30"></uni-icons>
      </view>
      <view class="item" @click="onTop">
        <!-- 扩展组件：uni-icons 图标 -->
        <uni-icons type="arrow-up" size="30"></uni-icons>
      </view>
    </view>

    <view class="loadMore">
      <!-- 扩展组件：uni-load-more 底部加载更多 -->
      <uni-load-more status="loading"></uni-load-more>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onLoad, onReachBottom, onPullDownRefresh } from "@dcloudio/uni-app";

const pets = ref([]);

const current = ref(0);
const items = ref(["猫咪", "狗子"]);
const classify = [
  {
    key: "dog",
    value: "狗子",
    url: "https://pro-api.thedogapi.com/v1/images/search?mime_types=jpg&page=0&limit=5",
  },
  {
    key: "cat",
    value: "猫咪",
    url: "https://api.thecatapi.com/v1/images/search?mime_types=jpg&page=0&limit=5",
  },
];
const values = computed(() => classify.map((item) => item.value));
const onClickItem = (e) => {
  console.log(e); // {currentIndex: 0}
  current.value = e.currentIndex;
  pets.value = [];
  network(e.currentIndex);
};

// 预览图片
const onPreview = (index) => {
  let urls = pets.value.map((item) => item.url);
  uni.previewImage({
    urls: urls,
  });
};

// 点击刷新
const onRefresh = () => {
  console.log("刷新");
  uni.startPullDownRefresh();
};

// 回到顶部
const onTop = () => {
  console.log("顶部");
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 100, //100ms
  });
};

// 触底加载更多
onReachBottom(() => {
  console.log("触底了，重新请求追加数据");
  network();
});

// 下拉刷新（请求的 finally 中 stop掉下拉刷新）
onPullDownRefresh(() => {
  console.log("下拉刷新");
  pets.value = [];
  network();
});

// 发送请求（参数默认值）
function network(index = 0) {
  // uni.showLoading({
  //   title: "加载中",
  // });
  uni.showNavigationBarLoading(); //顶部导航栏加载
  uni
    .request({
      // 免费 api
      url: classify[index].url,
    })
    .then((res) => {
      console.log(res);
      if (res.statusCode === 200) {
        pets.value = [...pets.value, ...res.data];
        console.log(pets.value);
      } else {
        uni.showToast({
          title: res.errMsg,
          icon: "none",
          duration: 2000,
        });
      }
    })
    .catch((err) => {
      consolog.err(err);
      uni.showToast({
        title: "服务器繁忙",
        icon: "none",
        duration: 2000,
      });
    })
    .finally(() => {
      console.log("成功或失败都会执行");
      // uni.hideLoading();
      uni.hideNavigationBarLoading(); //隐藏顶部导航栏加载
      uni.stopPullDownRefresh(); //隐藏下拉刷新显示
    });
}

// 页面加载就渲染数据
onLoad(() => {
  network();
});
</script>

<style lang="scss" scoped>
.container {
  .menu {
    padding: 50rpx 50rpx 0;
  }
  .layout {
    padding: 50rpx;

    .box {
      margin-bottom: 60rpx;
      box-shadow: 0 10rpx 50rpx rgba(0, 0, 0, 0.08);
      border-radius: 10rpx;
      overflow: hidden;

      .pic {
        image {
          width: 100%;
        }
      }

      .text {
        padding: 30rpx;
        font-size: 36rpx;
      }

      .author {
        padding: 0 30rpx 30rpx;
        text-align: right;
        color: gray;
        font-size: 30rpx;
      }
    }
  }

  .loadMore {
    padding-bottom: calc(env(safe-area-inset-bottom) + 50rpx);
  }

  .float {
    position: fixed;
    right: 30rpx;
    bottom: 100rpx;
    //不同设备兼容适应底部的安全区域
    padding-bottom: env(safe-area-inset-bottom);

    .item {
      width: 90rpx;
      height: 90rpx;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20rpx;
      border: 1px solid lightgray;
    }
  }
}
</style>
```

![image-20260206171631701](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260206171632667.png)

### 1.2 扩展组件 uni-ui

[uni-icons](https://uniapp.dcloud.net.cn/component/uniui/uni-icons.html) 需要点击安装，会自动跳入 HbuilderX，选择项目进行安装。（参考右下角刷新、返回顶部图标）

[uni-load-more](https://uniapp.dcloud.net.cn/component/uniui/uni-load-more.html) 用于列表中，做滚动加载使用，展示 loading 的各种状态。

![image-20260206165418564](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260206165419831.png)



[uni-segmented-control](https://uniapp.dcloud.net.cn/component/uniui/uni-segmented-control.html) 分段器，即页面内部选项卡。

![image-20260206171900098](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260206171901246.png)

更多扩展组件参考：https://uniapp.dcloud.net.cn/component/uniui/uni-ui.html



## 2. 壁纸项目 demo

> 先搭结构 -> 再写样式 -> 渲染数据 -> 交互行为。

案例源码：https://github.com/janycode/uniapp-vue3-wallpaper-demo

### 2.1 创建工程

uniapp创建基于 vue3 的默认模版项目。

梳理目录结构：

```js
common/       //新建目录放公共资源（引入才会被打包）
  images/     //图片资源
  style/      //样式资源
    common-style.scss  //全局公共样式
pages/
  index/
    index.vue  //默认首页
static/
  logo.png
.gitignore    //手动新增的文件
App.vue       //引入全局公共样式：  @import "common/style/common-style.scss";
main.js
manifest.json
pages.json
README.md
uni.promisify.adaptor.js
uni.scss
```

pages/index/index.vue

```html
<template>
  <view class="homeLayout">
    index
  </view>
</template>

<script setup>
</script>

<style lang="scss" scoped>
</style>
```

common-style.scss

```css
view,
swiper,
swiper-item {
  box-sizing: border-box;
}
```



### 2.2 swiper 轮播

首页轮播：[左右滚动轮播](https://github.com/janycode/uniapp-vue3-wallpaper-demo/commit/6d9663db238bad26eec2186a5ece40771cd18414)

首页轮播：[上下滚动轮播](https://github.com/janycode/uniapp-vue3-wallpaper-demo/commit/f4dedc505be366a92fcda920bf98da9696c653d5)

* sass 语法：

```css
swiper {
  width: 750rpx;
  height: 340rpx;
  &-item {  // &代表父级 swiper，等价于 swiper-item
    ...
  }
}
```



![image-20260206202408839](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260206202410109.png)

### 2.3 自定义组件

[首页公共标题：具名插槽](https://github.com/janycode/uniapp-vue3-wallpaper-demo/commit/1d1e5a6c168a290fa2b38394105150a3439037f2)

* 日期格式化

```html
<!-- uni-dateformat 日期格式化：安装 -->
<uni-dateformat :date="Date.now()" format="dd日"></uni-dateformat>
```

* scroll-view 横向左右滑动(3个条件)：①`scroll-x` ②父级`nowrap`不换行 ③image`行级块`

```html
<scroll-view scroll-x>
  <view class="box" v-for="item in 8">
    <image src="/common/images/wallpaper/preview_small.webp" mode="aspectFill"></image>
  </view>
</scroll-view>

//scss
scroll-view {
  white-space: nowrap; //不换行
  .box {
    width: 200rpx;
    height: 445rpx;
    display: inline-block; //行级块
    margin-right: 15rpx;
    image {
      width: 100%;
      height: 100%;
      border-radius: 10rpx;
}
```

![image-20260206202559893](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260206202601237.png)

![image-20260206202628504](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260206202629680.png)

[首页专题精选：磨砂背景、定位布局、缩放最小字体](https://github.com/janycode/uniapp-vue3-wallpaper-demo/commit/ca5f131d6b2202d3992ff433645382c9d4e457e5)

[首页专题精选：复用组件，props传值做more更多效果](https://github.com/janycode/uniapp-vue3-wallpaper-demo/commit/792fd8915eec03e2f786de6da5776a3c426b51d8)

* 父级加圆角、子级是 image 图像会盖住，需要加 overflow: hidden;
* 毛玻璃效果

```css
      // 毛玻璃效果
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10rpx); //半透明模糊效果属性
```

* 字体缩放，使其小于最小字体

```css
      font-size: 22rpx; //字体最小12px，因此不能设置到小于24rpx
      transform: scale(0.8); //此时使用缩放可以对字体进行缩小
      transform-origin: left top; //以左上角为基准缩小
```

![image-20260206202659870](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260206202700865.png)



### 2.4 页面与路由

[底部选项卡 tabBar:创建页面、设置 tabBar 路由和图标和高亮](https://github.com/janycode/uniapp-vue3-wallpaper-demo/commit/dfae8dfc8fc2bc67ee01b914124ee6a48387673c)

![image-20260206202812257](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260206202813401.png)

[我的：页面布局](https://github.com/janycode/uniapp-vue3-wallpaper-demo/commit/164d9e7d74543f9d1c72cc48a3df396e6e1b9808)

![image-20260206202905458](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260206202906629.png)

### 2.5 条件编译(★)

[条件编译处理跨端兼容](https://uniapp.dcloud.net.cn/tutorial/platform.html)

```html
<!-- 条件编译：小程序(MP)出现联系客服，其他出现拨打电话 -->
<!-- #ifdef MP -->
<button open-type="contact">联系客服</button>
<!-- #endif -->
<!-- #ifndef MP -->
<button @click="clickContact">拨打电话</button>
<!-- #endif -->
```

```css
/* #ifdef MP */
css...
/* #endif */
```



### 2.6 小程序客服

button 组件中 `open-type="concat"` 就可以支持打开客服，以微信小程序为例。

```html
<button open-type="contact">打开客服会话</button>
```

前置设置，如微信小程序：

① manifest.json

* 微信小程序 AppID：wx51c55a4653bba442
* √ 上传时自动代码压缩

② 微信小程序后台添加客服

* https://mp.weixin.qq.com/
* 【基础功能】-【客服】-【客服人员】-【添加客服】，输入微信号搜索选择即可。

③ 微信开发工具中设置 AppID

* 【基本信息】-【AppId】
* 【真机调试】即可在线与客服人员沟通

④ 登陆客服系统进行收发消息

![image-20260207102206849](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260207102208190.png)



### 2.7 拨打电话

[拨打电话API](https://uniapp.dcloud.net.cn/api/system/phone.html)

```html
<button @click="clickContact">拨打电话</button>

// 拨打电话 js
const clickContact = () => {
    uni.makePhoneCall({
        phoneNumber: '114' //仅为示例
    });
}
```






### 2.8 CSS 样式技巧(★)

#### 渐变色

/common/style/common-style.scss

```css
.pageBg {
  // 背景渐变：多重渐变层叠样式
  background: linear-gradient(to bottom, transparent 0, #fff 400rpx), linear-gradient(to right, #beecd8 20%, #F4E2D8);
  min-height: 80vh; //最小高度
}
```

/pages/xx/xx.vue

```html
<template>
  <view class="homeLayout pageBg">
  ...
```

![image-20260207202623633](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260207202624890.png)

#### 全局主题色

创建 /common/style/base-style.scss

```css
$brand-theme-color: #28B389;      //品牌主题颜色

$border-color: #e0e0e0;           //边框颜色
$border-color-light: #efefef;     //边框亮色

$text-font-color-1: #000;         //文字主色
$text-font-color-2: #676767;      //文字主色
$text-font-color-3: #a7a7a7;      //文字主色
$text-font-color-4: #e4e4e4;      //文字主色

// @mixin flex {
// }
```

uni.scss 中引入

```css
...
// 自定义全局颜色，引入自己定义的，不污染默认全局样式
@import "@/common/style/base-style.scss"; //注意：末尾分号
```

使用全局主题色：

```css
    //样式穿透到原生组件内部
    :deep(.uni-icons) {
      color: $brand-theme-color !important;
    }
```


#### fit-content 按内容自动宽度

有多少内容宽度就多大，兼容性也可以。

```css
  //父级的下一级子元素 view
  &>view {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto; // 配合 left 0 right 0 就在中间了
    width: fit-content; //有多少内容宽度就多大，兼容性也可以
    color: #fff;
  }
```

#### 去掉行高

```css
line-height: 1em; //默认行高去掉，取值1em即可
```

#### 增加手指点击面积

```css
padding: 2rpx 12rpx; //给元素多增加点内边距，可以增加手指点击面积
```

#### 弹性布局：空盒子占位

```css
    display: flex;
    justify-content: space-between; //头部：空盒子占位 + 壁纸信息 + 关闭按钮，空盒子是技巧
    align-items: center;
```

![image-20260207203458794](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260207203500896.png)



#### 不挤压兄弟元素

```css
    .value {
      flex: 1; //占用剩余宽度
      width: 0; //兼容性写法：不挤压左侧 label 的宽度
    }
```

![image-20260207203651949](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260207203653244.png)

#### 标签样式

```html
<view class="value tabs">
  <view class="tab" v-for="item in 3">标签名</view>
</view>
```

```css
    .tabs {
      display: flex;
      flex-wrap: wrap;
      .tab { //标签样式
        border: 1px solid $brand-theme-color;
        color: $brand-theme-color;
        font-size: 22rpx;
        padding: 10rpx 30rpx;
        border-radius: 40rpx;
        line-height: 1em;
        margin: 0 10rpx 10rpx 0;
      }
    }
```

![image-20260207204220234](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260207204221629.png)

#### 父级圆角子级图像

```css
    border-radius: 10rpx; //父级加圆角、子级是图像会盖住，需要加 overflow: hidden;
    overflow: hidden;
```

#### 底部安全区通用样式

```html
...
    <!-- 底部安全区: pages/xxx/xxx.vue -->
    <view class="safe-area-inset-bottom"></view>
  </view>
</template>
```

common/style/common-style.scss

```css
// 底部安全区通用设置
.safe-area-inset-bottom {
    height: env(safe-area-inset-bottom);
}
```

`注意`：底部弹窗时，在小程序会有一个 padding 值，让弹窗与手机底部有间隔镂空了，需要改原生组件（如果有此情况则需要处理）

位置：uni_modules/uni_popup/components/uni-popup/uni-popup.vue

搜索：底部弹出样式处理

```js
    /**
     * 底部弹出样式处理
     */
    bottom(type) {
        this.popupstyle = 'bottom'
        this.ani = ['slide-bottom']
        this.transClass = {
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            // paddingBottom: this.safeAreaInsets + 'px',  //注释掉此行！！！
            backgroundColor: this.bg
        }
        if (type) return
        this.showPopup = true
        this.showTrans = true
    },
```



### 2.9 自定义头部 - 高度(兼容性)

[自定义头部导航栏布局：通过获取系统信息和胶囊按钮尺寸，兼容设置自定义头部导航栏的尺寸](https://github.com/janycode/uniapp-vue3-wallpaper-demo/commit/92fa9e8a36d25759fbcc694e56275691105b982d)

utils/system.js - 兼容 H5、微信小程序、抖音小程序 的 自定义头部区域高度。

```js
// 获取系统信息: h5是0，微信小程序不同的机型高度不一样，如iphone12 是47
const SYSTEM_INFO = uni.getSystemInfoSync()
export const getStatusBarHeight = () => SYSTEM_INFO.statusBarHeight || 15

// 微信小程序：高度计算，通过获取胶囊按钮的信息
export const getTitleBarHeight = () => {
  // 有胶囊按钮时获取高度计算，没有的话固定返回 40，基本通用
  if (uni.getMenuButtonBoundingClientRect) {
    let { top, height } = uni.getMenuButtonBoundingClientRect()
    return height + (top - getStatusBarHeight()) * 2
  } else {
    return 40
  }
}
export const getNavBarHeight = () => getStatusBarHeight() + getTitleBarHeight()

// 抖音小程序：左侧固定有一个 logo
export const getLeftIcon = () => {
  // 条件编译
  // #ifdef MP-TOUTIAO
  let { leftIcon: { left, width } } = tt.getCustomButtonBoundingClientRect()
  return left + parseInt(width)
  // #endif
  // #ifndef MP-TOUTIAO
  return 0
  // #endif
}
```

components/custom-nav-bar/custom-nav-bar.vue 自定义头部组件：

```html
<template>
  <view class="layout">
    <view class="navbar">
      <!-- 需要使用动态绑定 style 的 height 高度，设置头部高度 -->
      <view class="statusBar" :style="{height: getStatusBarHeight() + 'px'}"></view>
      <view class="titleBar" :style="{height: getTitleBarHeight() + 'px', marginLeft: getLeftIcon() + 'px'}">
        <view class="title">标题</view>
        <view class="search">
          <uni-icons class="icon" type="search" color="#888" size="18"></uni-icons>
          <text class="text">搜索</text>
        </view>
      </view>
    </view>
    <!-- 填充区域：作为头部和内容区域的间隔 -->
    <view class="fill" :style="{height: getNavBarHeight() + 'px'}">
    </view>
  </view>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { getStatusBarHeight, getTitleBarHeight, getNavBarHeight, getLeftIcon } from '@/utils/system.js'
</script>

<style lang="scss" scoped>
  .layout {
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 10;
      background: linear-gradient(to bottom, transparent 0, #fff 400rpx), linear-gradient(to right, #beecd8 20%, #F4E2D8);

      .statusBar {
        border: 1px solid red;
      }

      .titleBar {
        display: flex;
        align-items: center;
        padding: 0 30rpx;
        border: 1px solid green;

        .title {
          font-size: 22px;
          font-weight: 700;
          color: $text-font-color-1;
        }

        .search {
          width: 220rpx;
          height: 50rpx;
          border-radius: 60rpx;
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid #fff;
          margin-left: 30rpx;
          color: #999;
          font-size: 28rpx;
          display: flex;
          align-items: center;

          .icon {
            margin-left: 5rpx;
          }

          .text {
            padding-left: 10rpx;
          }
        }
      }
    }

    .fill {}
  }
</style>
```



### 2.10 request 请求封装(★)

utils/request.js

```js
const BASE_URL = 'https://www.xxx.com/api/'

export function request(config = {}) {
  let { url, method = 'GET', header = {}, data = {} } = config

  url = BASE_URL + url
  header['access-key'] = 'xxm_jerry_123'
  header['token'] = 'token123'

  return new Promise((resolve, reject) => {
    uni.request({
      url,
      method,
      header,
      data,
      success: res => {
        if (res.data.errCode === 0) {
          resolve(res.data) //向内多拿一层数据
        } else if (res.data.errCode === 400) {
          uni.showModal({
            title: '错误提示',
            content: res.data.errMsg,
            showCancel: false
          })
          reject(res.data)
        // } else if (res.data.errCode === 500) {   //扩展其他状态码的单独处理分支
        } else {
          uni.showToast({
            title: res.data.errMsg,
            icon: 'none'
          })
          reject(res.data)
        }
      },
      fail: err => {
        reject(err)
      }
    })
  })
}
```

api/apis.js

```js
import { request } from '../utils/request'

export function apiGetBanner() {
  return request({ url: '/homeBanner' })
}

export function apiGetDayRandom() {
  return request({ url: '/randomWall' })
}

export function apiGetNotice(data) {
  return request({
    url: '/wallNewsList',
    method: 'post',
    data
  })
}

export function apiGetClassify(data) {
  return request({ url: '/classify', data })
}
```

使用：

```js
  import { apiGetBanner } from '../../api/apis'
  // 获取banner图片列表
  const bannerList = ref([])
  const getBanner = async () => {
    let res = await apiGetBanner()
    bannerList.value = res.data
  }
```



### 2.11 对象传值 props 默认值

```js
  //接收父类传值
  defineProps({
    item: {
      type: Object,
      default () { //对象类型的默认值
        return {
          name: '默认名称',
          picurl: '/common/images/1.jpg',
          updateTime: Date.now()
        }
      }
    }
  })
```



### 2.12 时间日期换算工具类

utils/common.js - 借助 ai 生成并验证，返回结果需求："1分钟"、"25分钟"、"3小时"、"5天"、"2月"，超3个月返回null

```js
/**
 * 时间戳与当前时间对比，返回友好时间描述（超3个月返回null）
 * @param {number} timestamp - 传入的时间戳（支持10位秒级/13位毫秒级）
 * @returns {string|null} - 如"1分钟"、"25分钟"、"3小时"、"5天"、"2月"，超3个月返回null
 */
export default function formatTimeDiff(timestamp) {
  // 1. 统一时间戳为毫秒级（兼容10位秒级时间戳）
  const targetTime = timestamp.toString().length === 10 ? timestamp * 1000 : timestamp
  const now = Date.now() // 当前时间戳（毫秒）
  const diffMs = Math.abs(now - targetTime) // 时间差（毫秒，取绝对值避免负数）

  // 2. 时间单位换算（毫秒 → 分钟/小时/天/月，月按30天近似计算）
  const minute = 60 * 1000 // 1分钟=60000毫秒
  const hour = 60 * minute // 1小时=3600000毫秒
  const day = 24 * hour // 1天=86400000毫秒
  const month = 30 * day // 1月≈30天（2592000000毫秒）
  const threeMonths = 3 * month // 3月≈90天

  // 3. 按规则判断并返回结果
  if (diffMs < minute) {
    // 1分钟内 → 显示"1分钟"
    return '1分钟'
  } else if (diffMs < hour) {
    // 1小时内 → 显示"X分钟"（取整）
    const minutes = Math.floor(diffMs / minute)
    return `${minutes}分钟`
  } else if (diffMs < day) {
    // 1天内 → 显示"X小时"（取整）
    const hours = Math.floor(diffMs / hour)
    return `${hours}小时`
  } else if (diffMs < month) {
    // 1月内 → 显示"X天"（取整）
    const days = Math.floor(diffMs / day)
    return `${days}天`
  } else if (diffMs < threeMonths) {
    // 3月内 → 显示"X月"（取整，按30天/月换算）
    const months = Math.floor(diffMs / month)
    return `${months}月`
  } else {
    // 超过3个月 → 返回null
    return null
  }
}
```



### 2.13 触底加载&防抖(★)

```js
<script setup>
import { onLoad, onReachBottom } from '@dcloudio/uni-app'

//接收 url 携带的参数 :url="`/pages/calsslist/calsslist?id=111&name=jerry`"
onLoad(e => {
  console.log(e)
  let { id=null, name='' } = e
  console.log(id, name)
  //调用方法 func 进行渲染
})
// 触底回调
onReachBottom(() => {
  console.log('触底了')
  // pageNum++, 调用方法 func 进行下一页获取和渲染（func 方法中进行展开拼接）
  // 做触底防抖，避免无效网络请求，方案有二：①判断总数与累计数量  ②判断请求结果数据长度
})
</script>
```



### 2.14 大对象跨页面传值

* `uni.setStorageSync(key, data)` - 将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口。
* `const data = uni.getStorageSync(key)` - 从本地缓存中同步获取指定 key 对应的内容。
* `uni.removeStorageSync(key)` - 从本地缓存中同步移除指定 key。

```js
const classList = ref([])
const getClassList = async () => {
  let res = await apiGetClassify()
  classList.value = res.data
  // 针对数据量比较大，需要传递到跳转的页面时使用本地缓存
  uni.setStorageSync('storageClassList', classList.value)
}
//离开页面的时候将其清空即可 - 养成好习惯，提高性能
onUnload(()=>{
	uni.removeStorageSync("storgClassList")
})
```



### 2.15 骨架屏

骨架屏，一般用于页面在请求远程数据尚未完成时，在内容加载出来前展示与内容布局结构一致的灰白块，提升用户视觉体验。如B占首页下划时。

插件地址：https://ext.dcloud.net.cn/plugin?id=15145

官方文档：https://www.uvui.cn/components/skeletons.html



### 2.16 解决请求加载数据过多(★)

节约流量、提升用户体验。

① 对于 image 上的 v-if 可以控制加载的图片

② 并且缓存用户看过的图

③ 以及实现预加载上一张、本张、下一张

```html
    <swiper circular @change="swiperChange">
      <swiper-item v-for="item in 5" :key="item">
        <!-- 条件 readImgs.includes(index) 满足的才会加载：上一张、本张、下一张  -->
        <image v-if="readImgs.includes(index)" :src="xxx" mode="aspectFill"></image>
      </swiper-item>
    </swiper>
```

```js
  function readImgsFun() {
    readImgs.value.push(
      currentIndex.value <= 0 ? classList.value.length - 1 : currentIndex.value - 1,
      currentIndex.value,
      currentIdex.value >= classList.value.length - 1 ? 0 : currentIndex.value + 1
    )
    readImgs.value = [...new Set(readImgs.value)]
  }

  //swiper滑动索引值
  const swiperChange = e => {
    console.log(e.detail.current) //当前轮播滑动的索引值
    //...
    readImgsFun()
  }

  const readImgs = ref([])
  onLoad(e => {
    //...
    readImgsFun()
  })
```



### 2.17 小程序下载图片

前置：

1. **安全域名**配置：微信小程序后台 - 开发管理 - 服务器域名 - downloadFile 域名添加。
2. **隐私协议**配置：微信小程序后台 - 设置 - 服务内容声明 - 用户隐私协议设置 - 按要求填写、选择所需要的权限即可保存。

![image-20260208105016604](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260208105017660.png)

```js
  //点击下载：H5与小程序的兼容条件编译
  const clickDownload = async () => {
    // #ifdef H5
    uni.showModal({
      content: '请长按保存壁纸',
      showCancel: false
    })
    // #endif

    // #ifndef H5
    try {
      // 等待提示，此时用户正在保存图片
      uni.showLoading({
        title: '下载中...',
        mask: true
      })
      let { classid, _id: wallId } = currentInfo.value
      let res = await apiWriteDownload({ classid, wallId })
      if (res.errCode !== 0) throw res
      // 获取小程序图片信息
      uni.getImageInfo({
        src: currentInfo.value.picurl, //图片网络地址
        success: res => {
          // 小程序保存图片api
          uni.saveImageToPhotosAlbum({
            filePath: res.path, //小程序图片临时地址 res.path
            success: res => {
              uni.showToast({
                title: '保存成功，请到相册查看',
                icon: 'none'
              })
            },
            fail: err => {
              if (err.errMsg === 'saveImageToPhotosAlbum:fail cancel') {  //未授权的错误信息判断
                uni.showToast({
                  title: '保存失败，请重新点击下载',
                  icon: 'none'
                })
                return
              }
              uni.showModal({
                title: '授权提示',
                content: '需要授权保存相册',
                success: res => {
                  if (res.confirm) {  // 确认弹窗：跳转授权页面，打开保存相册权限
                    uni.openSetting({
                      success: setting => {
                        console.log(setting)
                        if (setting.authSetting['scope.writePhotosAlbum']) { //授权成功返回值 true
                          uni.showToast({
                            title: '获取授权成功',
                            icon: 'none'
                          })
                        } else {
                          uni.showToast({
                            title: '获取权限失败',
                            icon: 'none'
                          })
                        }
                      }
                    })
                  }
                }
              })
            },
            complete: () => { // 兜底关闭掉 下载中的提示
              uni.hideLoading()
            }
          })
        }
      })
    } catch (err) {
      console.log(err)
      uni.hideLoading()
    }
    // #endif
  }
```

![image-20260208105034457](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260208105035414.png)



### 2.18 分享给好友|朋友圈

[onShareAppMessage](https://uniapp.dcloud.net.cn/api/plugins/share.html#onshareappmessage) 小程序中用户点击分享后，在 js 中定义 onShareAppMessage 处理函数（和 onLoad 等生命周期函数同级），设置该页面的分享信息。

[onShareTimeline](https://uniapp.dcloud.net.cn/tutorial/page.html#lifecycle)  监听用户点击右上角转发到朋友圈。

* `imageUrl` - 可以是**变量url** / **网络图片** / **本地图片**（本地需要使用 static/ 目录下图片，因为会被打包，否则拿不到）

#### 页面无需参数-分享

```js
import {onShareAppMessage,onShareTimeline} from "@dcloudio/uni-app"
//分享给好友
onShareAppMessage((e)=>{
	return {
		title:"好看的手机壁纸",
		path:"/pages/classify/classify"
	}
})
//分享朋友圈
onShareTimeline(()=>{
	return {
		title:"好看的手机壁纸",
        imageUrl: '/static/images/logo.jpg' //可以自定义显示的小图内容
	}
})
```

![image-20260208104910711](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260208104912320.png)

#### 页面需要参数-分享

```js
let pageName;
onLoad((e) => {	
	let { id=null, name=null, type=null } = e;	
	pageName = name	
	//修改导航标题
	uni.setNavigationBarTitle({ title:name })
	//执行获取分类列表方法
	getClassList();
})
//分享给好友
onShareAppMessage((e) => {
	return {
		title:"精美壁纸-"+pageName,
		path:"/pages/classlist/classlist?id="+queryParams.classid+"&name="+pageName
	}
})
//分享朋友圈： query 只是参数
onShareTimeline(() => {
	return {
		title:"精美壁纸-"+pageName,
		query:"id="+queryParams.classid+"&name="+pageName
	}
})
```



### 2.19 文章详情 - 富文本渲染

* `<rich-text>` - 官方自带的富文本组件
* `<mp-html>` - 插件市场的富文本组件，功能更丰富，如文章内图片点击可以放大等【推荐】

pages/notice/detail.vue

```html
<template>
	<view class="noticeLayout">
		<view class="title">
			<view class="tag" v-if="detail.select">
				<uni-tag inverted text="置顶" type="error" />
			</view>
			<view class="font">{{detail.title}}</view>			
		</view>
		
		<view class="info">
			<view class="item">{{detail.author}}</view>					
			<view class="item">
				<uni-dateformat :date="detail.publish_date" format="yyyy-MM-dd hh:mm:ss"></uni-dateformat>
			</view>	
		</view>
		<!-- 富文本渲染 -->
		<view class="content">		
			<mp-html :content="detail.content" />
			<!-- <rich-text :nodes="detail.content"></rich-text> -->
		</view>
		
		<view class="count">
			阅读 {{detail.view_count}}	
		</view>
	</view>
</template>

<script setup>
import {apiNoticeDetail} from "@/api/apis.js"
import { ref } from "vue";
import {onLoad} from "@dcloudio/uni-app"

const detail = ref({})
let noticeId
onLoad((e)=>{
	noticeId = e.id
	getNoticeDetail();
})

const getNoticeDetail = ()=>{
	apiNoticeDetail({id:noticeId}).then(res=>{
		detail.value = res.data
		console.log(res);
	})
}
</script>

<style lang="scss" scoped>
.noticeLayout{
	padding:30rpx;
    .title{
        font-size: 40rpx;
        color:#111;
        line-height: 1.6em;
        padding-bottom:30rpx;
        display: flex;
        .tag{
            transform: scale(0.8);
            transform-origin: left center;
            flex-shrink: 0;	
        }
        .font{
            padding-left:6rpx;
        }
    }
    .info{
        display: flex;
        align-items: center;
        color:#999;
        font-size: 28rpx;
        .item{
            padding-right: 20rpx;
        }
    }
    .content{
        padding:50rpx 0;
    }
    .count{
        color:#999;
        font-size: 28rpx;
    }
}
</style>
```

![image-20260208113452205](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260208113453749.png)



### 2.20 搜索页

包含搜素框、最近搜索、热门搜索。

* `uni-search-bar` - 官方搜索栏组件
* `uv-empty` - 插件市场组件，该组件用于需要加载内容，但是加载的第一页数据就为空，提示一个 没有内容 的场景。

搜索历史核心逻辑：

```js
//新值追加到数组(展开)、Set去重、slice截取数量
historySearch.value = [...new Set([queryParams.value.keyword, ...historySearch.value])].slice(0, 10)
```

pages/search/search.vue

```html
<template>
  <view class="searchLayout">
    <view class="search">
      <uni-search-bar @confirm="onSearch" @cancel="onClear" @clear="onClear" focus placeholder="搜索"
        v-model="queryParams.keyword">
      </uni-search-bar>
    </view>

    <view v-if="!classList.length || noSearch">
      <view class="history" v-if="historySearch.length">
        <view class="topTitle">
          <view class="text">最近搜索</view>
          <view class="icon" @click="removeHistory">
            <uni-icons type="trash" size="25"></uni-icons>
          </view>
        </view>
        <view class="tabs">
          <view class="tab" v-for="tab in historySearch" :key="tab" @click="clickTab(tab)">{{tab}}</view>
        </view>
      </view>

      <view class="recommend">
        <view class="topTitle">
          <view class="text">热门搜索</view>
        </view>
        <view class="tabs">
          <view class="tab" v-for="tab in recommendList" :key="tab" @click="clickTab(tab)">{{tab}}</view>
        </view>
      </view>
    </view>

    <view class="noSearch" v-if="noSearch">
      <uv-empty mode="search" icon="http://cdn.uviewui.com/uview/empty/search.png"></uv-empty>
    </view>

    <view v-else>
      <view class="list">
        <navigator :url="`/pages/preview/preview?id=${item._id}`" class="item" v-for="item in classList"
          :key="item._id">
          <image :src="item.smallPicurl" mode="aspectFill"></image>
        </navigator>
      </view>
      <view class="loadingLayout" v-if="noData || classList.length">
        <uni-load-more :status="noData?'noMore':'loading'" />
      </view>
    </view>

  </view>
</template>

<script setup>
  import { ref } from 'vue'
  import { onLoad, onUnload, onReachBottom } from '@dcloudio/uni-app'
  import { apiSearchData } from '@/api/apis.js'
  //查询参数
  const queryParams = ref({
    pageNum: 1,
    pageSize: 12,
    keyword: ''
  })

  //搜索历史词
  const historySearch = ref(uni.getStorageSync('historySearch') || [])
  //热门搜索词
  const recommendList = ref(['美女', '帅哥', '宠物', '卡通'])
  //没有更多
  const noData = ref(false)
  //没有搜索结果
  const noSearch = ref(false)
  //搜索结果列表
  const classList = ref([])

  //点击搜索
  const onSearch = () => {
    uni.showLoading()
    historySearch.value = [...new Set([queryParams.value.keyword, ...historySearch.value])].slice(0, 10)
    uni.setStorageSync('historySearch', historySearch.value)
    initParams(queryParams.value.keyword)
    searchData()
    console.log(queryParams.value.keyword)
  }

  //点击清除按钮
  const onClear = () => {
    initParams()
  }

  //点击标签进行搜索
  const clickTab = value => {
    initParams(value)
    onSearch()
  }

  //点击清空搜索记录
  const removeHistory = () => {
    uni.showModal({
      title: '是否清空历史搜索？',
      success: res => {
        if (res.confirm) {
          uni.removeStorageSync('historySearch')
          historySearch.value = []
        }
      }
    })
  }

  const searchData = async () => {
    try {
      let res = await apiSearchData(queryParams.value)
      classList.value = [...classList.value, ...res.data]
      uni.setStorageSync('storgClassList', classList.value)
      if (queryParams.value.pageSize > res.data.length) noData.value = true
      if (res.data.length === 0 && classList.value.length === 0) noSearch.value = true
      console.log(res)
    } finally {
      uni.hideLoading()
    }
  }

  const initParams = (value = '') => {
    classList.value = []
    noData.value = false
    noSearch.value = false
    queryParams.value = {
      pageNum: 1,
      pageSize: 12,
      keyword: value || ''
    }
  }

  //触底加载更多
  onReachBottom(() => {
    if (noData.value) return
    queryParams.value.pageNum++
    searchData()
  })

  //关闭有页面
  onUnload(() => {
    uni.removeStorageSync('storgClassList', classList.value)
  })
</script>

<style lang="scss" scoped>
  .searchLayout {
    .search {
      padding: 0 10rpx;
    }

    .topTitle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 32rpx;
      color: #999;
    }

    .history {
      padding: 30rpx;
    }

    .recommend {
      padding: 30rpx;
    }

    .tabs {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      padding-top: 20rpx;

      .tab {
        background: #F4F4F4;
        font-size: 28rpx;
        color: #333;
        padding: 10rpx 28rpx;
        border-radius: 50rpx;
        margin-right: 20rpx;
        margin-top: 20rpx;
      }
    }

    .list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 5rpx;
      padding: 20rpx 5rpx;

      .item {
        height: 440rpx;

        image {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
    }
  }
</style>
```

![image-20260208115019772](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260208115020956.png)



### 2.21 跳转外部小程序

```html
<swiper circular indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff" autoplay>
    <swiper-item v-for="item in bannerList" :key="item._id">
        <!-- 跳转外部小程序 -->
        <navigator v-if="item.target == 'miniProgram'"  :url="item.url" target="miniProgram" :app-id="item.appid" class="like">
            <image :src="item.picurl" mode="aspectFill"></image>
        </navigator>
		<!-- 跳转自身小程序内部页面 -->
        <navigator v-else :url="`/pages/classlist/classlist?${item.url}`" class="like">
            <image :src="item.picurl" mode="aspectFill"></image>
        </navigator>
    </swiper-item>				
</swiper>
```







