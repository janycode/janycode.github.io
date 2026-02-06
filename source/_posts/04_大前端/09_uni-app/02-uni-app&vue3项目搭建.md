---
title: 02-uni-app&vue3项目搭建
date: 2022-5-22 21:36:21
tags:
- uni-app
- vue3
categories: 
- 04_大前端
- 09_uni-app
---



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260204182332703.png)

参考：

* uni-app 官网：https://www.dcloud.io/
* HBuild X 开发工具：https://hx.dcloud.net.cn/
* 案例源码：

> 免费测试api接口：https://jsonplaceholder.typicode.com/
>
> 随机猫咪API接口：https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=10
>
> 随机狗子API接口：https://pro-api.thedogapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=5
>
> 咸虾米API接口：https://api.qingnian8.com/apis/wallpaper/randomWall.html
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























