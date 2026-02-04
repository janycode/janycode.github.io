---
title: 02-wechat微信小程序项目搭建
date: 2022-5-22 21:36:21
tags:
- wechat
- 微信小程序
categories: 
- 04_大前端
- 10_小程序
---

![image-20260201221415938](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260202194534866.png)

参考：

* 微信小程序官网：https://mp.weixin.qq.com/cgi-bin/wx
* 微信小程序开发文档：https://developers.weixin.qq.com/doc/
* 案例源码：https://github.com/janycode/wx-wechat-mall-applet-demo
* .gitignore: https://github.com/janycode/wx-wechat-mall-applet-demo/blob/main/.gitignore

## 1. 项目搭建

`小布旅购助手` [项目搭建](https://github.com/janycode/wx-wechat-mall-applet-demo/commit/8a9a164a2bcf7212193d580ec830d6488c78d5a0)：全局配置和一级路由配置，底部导航对应页面 title 配置。

① 通过 js 基础模版创建项目，选择自己注册好的小程序。

② 删除 utils 目录、清空 pages 目录

③ 清空 app.js

```js
// app.js
App({
  onLaunch() {
  },
})
```

④ 定义底部选项卡，通过 app.json - pages

```json
"pages": [
    "pages/home/home",
    "pages/category/category",
    "pages/shopcar/shopcar",
    "pages/center/center"
  ],
```

⑤ 配置顶部颜色和信息，通过 app.json -window

```json
  "window": {
    "navigationBarTextStyle": "white",
    "navigationBarTitleText": "小布旅购助手",
    "navigationBarBackgroundColor": "#14c145",  //微信绿
    "backgroundTextStyle": "light"
  },
```

⑥ 配置底部选项卡高亮图片切换([阿里iconfont矢量图标](https://www.iconfont.cn/))，通过 app.json - tabBar

```json
"tabBar": {
    "list": [
      {
        "pagePath": "pages/home/home",
        "text": "首页",
        "iconPath": "images/home.png",
        "selectedIconPath": "images/home_light.png"
      },
      {
        "pagePath": "pages/category/category",
        "text": "分类",
        "iconPath": "images/category.png",
        "selectedIconPath": "images/category_light.png"
      },
      {
        "pagePath": "pages/shopcar/shopcar",
        "text": "购物车",
        "iconPath": "images/shopcar.png",
        "selectedIconPath": "images/shopcar_light.png"
      },
      {
        "pagePath": "pages/center/center",
        "text": "我的",
        "iconPath": "images/center.png",
        "selectedIconPath": "images/center_light.png"
      }
    ]
  },
```

![image-20260203140942878](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260203140944330.png)

## 2. restful 接口

`json-server` 通过 json 文件 mock 数据，模拟 restful 接口。

参考文档：https://rtool.cn/jsonserver/docs/introduction

模拟数据：*json-server -w db.json -p 5000*

请求地址：http://localhost:5000/xxx



## 3. request 封装+ loading

`request.js` 封装 [Promise 风格请求方式工具](https://github.com/janycode/wx-wechat-mall-applet-demo/commit/d3cd35a23e8f2fd44f8425c4835a700598d4e9f0)，可以很方便链式调用。

* `import request from '[path]/utils/request'`  JS 模块导入方式

`wx.showLoading` | `wx.hideLoading` 显示 或 隐藏请求的 [loading](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showLoading.html) 框

```js
// /utils/request.js 封装
// 基地址
var BASE_URL = "http://localhost:5000"
function request(params) {
  // wx.showLoading: https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showLoading.html
  // 显示 loading
  wx.showLoading({ title: '正在加载中' })
  return new Promise((resolve, reject) => {
    wx.request({
      ...params, //url, method, header, body...
      url: BASE_URL + params.url,  //url 参数同名覆盖
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        // 隐藏 loading（complete 不论成功与失败）
        wx.hideLoading({ success: (res) => { } })
      }
    })
  })
}

module.exports = request
```

```js
import request from '../../utils/request'
// pages/home/home.js
Page({
  data: {},
  handleGetTap() {
    request({ url: "/users" }).then((res) => {
      console.log(res);
    })
  },
  handlePostTap() {
    request({ url: '/users' }).then(res => {
      console.log(res);
    }).catch(err => {
      console.error(err);
    })
  },
  ...
})
```

![image-20260203140154875](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260203140156721.png)

## 4. 首页

### 【使用扩展组件】

1. 初始化 npm：*npm init* - 初始化生成 package.json

2. 安装 sticky：*npm i @miniprogram-component-plus/sticky*

3. 构建 npm：【`工具`】-【`构建npm`】 （否则引入会报错）

4. 引入 sticky：https://developers.weixin.qq.com/miniprogram/dev/platform-capabilities/extended/component-plus/sticky.html

> -> 375宽度的机型上不生效，原因未知，可能是组件库BUG（验证过**非**边缘像素计算临界值问题）
>
> 微信团队扩展组件：https://developers.weixin.qq.com/miniprogram/dev/platform-capabilities/extended/component-plus/



### 轮播

[首页轮播](https://github.com/janycode/wx-wechat-mall-applet-demo/commit/9adbfc6f0ec78c67f91bb19a06081fbd73c16b46)：优化request封装同时暴露基地址、轮播组件中拼接基地址、`基地址挂载到全局对象的方式和使用`

utils/request.js

```js
// /utils/request.js
const BASE_URL = "http://localhost:5000";
function request(params) {
  // wx.showLoading: https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showLoading.html
  // 显示 loading
  wx.showLoading({ title: '正在加载中' })
  return new Promise((resolve, reject) => {
    wx.request({
      ...params, //url, method, header, body...
      url: BASE_URL + params.url,  //url 参数同名覆盖
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        // 隐藏 loading（complete 不论成功与失败）
        wx.hideLoading({ success: (res) => { } })
      }
    })
  })
}

module.exports = {
  request, // 请求封装
  BASE_URL // 暴露基地址
};
```

app.js

```js
// app.js
import { BASE_URL } from './utils/request'

App({
  onLaunch() {
    // 挂载到全局对象的globalData中，获取方式: getApp().globalData.BASE_URL
    this.globalData = {
      BASE_URL: BASE_URL // 全局基地址
    }
  },
})
```

pages/home/home.js

```js
import {request} from '../../utils/request'

// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    BASE_URL: '',
    looplist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取小程序全局实例，将全局基地址赋值到页面data
    this.setData({
      BASE_URL: getApp().globalData.BASE_URL
    });
    this.renderSwiper()
  },

  renderSwiper() {
    request({ url: '/recommends' }).then(res => {
      console.log(res);
      this.setData({
        looplist: res
      })
    }).catch(err => {
      console.error(err);
    })
  },
  ...
})
```

```xml
<!--pages/home/home.wxml-->
<swiper indicator-dots="{{true}}" circular="{{true}}" autoplay="{{true}}" interval="2000">
  <swiper-item wx:for="{{looplist}}" wx:key="index">
    <image src="{{BASE_URL + item.url}}" mode="widthFix"/>
  </swiper-item>
</swiper>
```

![image-20260203155947367](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260203155949074.png)

### 列表+懒加载

[首页列表](https://github.com/janycode/wx-wechat-mall-applet-demo/commit/441d505e680d10b40596dc86f268b7bb48a1c72e)：商品列表请求和渲染展示、列表滚动到底懒加载处理、下拉刷新逻辑

```xml
<!--pages/home/home.wxml-->
<view wx:for="{{goodlist}}" wx:key="index" class="goodbox">
  <image src="{{BASE_URL + item.poster}}" mode="widthFix" />
  <view>{{item.title}}</view>
  <view>价格：<text style="color: red">￥{{item.price}}</text></view>
  <view>好评率：{{item.goodcomment}}</view>
</view>
```

```js
import {request} from '../../utils/request'
// pages/home/home.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    BASE_URL: '',
    looplist: [],
    goodlist: [],
    currentPage: 1,
    goodTotal: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取小程序全局实例，将全局基地址赋值到页面data
    this.setData({
      BASE_URL: getApp().globalData.BASE_URL
    });
    //this.renderSwiper() //轮播
    this.renderGoods() //商品
  },

  renderGoods() {
    //默认分页10条，否则翻页不生效 json-server 1.0.0-beta.3
    request({ url: `/goods?_page=${this.data.currentPage}` }).then(res => {
      console.log(res.data); // _page 默认10条，数据在 data 中
      this.setData({
        goodlist: [...this.data.goodlist, ...res.data],
        goodTotal: res.items
      })
    }).catch(err => {
      console.error(err);
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 懒加载效果，滚动到底部按分页加载
    console.log(this.data.goodlist.length, this.data.goodTotal);
    if (this.data.goodlist?.length === this.data.goodTotal) {
      console.log("滚动到底了...");
      return
    }
    this.setData({
      currentPage: this.data.currentPage + 1
    })
    this.renderGoods() // current 增加追加渲染列表数据
  },
  ...
})
```

下拉刷新更新数据：

```json
{
  "usingComponents": {},
  "navigationBarTitleText": "首页",
  "enablePullDownRefresh": true       //开启下拉刷新
}
```

```js
// pages/home/home.js
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    setTimeout(() => {
      //更新数据
      console.log("下拉更新数据了");
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000) //eg: 1s时间
  },
```



### 搜索+吸顶

[搜索和吸顶](https://github.com/janycode/wx-wechat-mall-applet-demo/commit/949fd634d5125dcce505fe3d90d43ccb3bf987e9)：自定义组件搜索输入框，吸顶引入扩展组件 sticky 使用


components/search/search.xx

```xml
<!--components/search/search.wxml-->
<input placeholder="请输入搜索内容" bindtap="handleTap" />
```

```js
// components/search/search.js
Component({
  methods: {
    handleTap() {
      this.triggerEvent("SearchEvent")
    }
  }
})
```

```css
/* components/search/search.wxss */
input{
  border: 1rpx solid gray;
  border-radius: 10rpx;
  margin: 10rpx;
  padding: 10rpx;
  height: 30rpx;
  background-color: white;
}
```

pages/home/home.xx

```json
{
  "usingComponents": {
    "mysearch": "../../components/search/search",        //引入 search 自定义组件
    "mp-sticky": "@miniprogram-component-plus/sticky"    //引入 扩展组件：吸顶组件 sticky
  },
  "navigationBarTitleText": "首页",
  "enablePullDownRefresh": true
}
```

```xml
<!--pages/home/home.wxml-->
<!-- 搜索框 + sticky 吸顶效果(375宽度的机型上不生效，原因未知，可能是组件库BUG) -->
<mp-sticky offset-top="0">
    <view style="width: 100vw">
      <mysearch bindSearchEvent="handleSearchEvent"></mysearch>
    </view>
</mp-sticky>
```

![image-20260203183639345](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260203183640461.png)



### 页面跳转+带参

[页面跳转带参](https://github.com/janycode/wx-wechat-mall-applet-demo/commit/79b11e04dee264f8f26707940a2d35441f82303d)：商品列表页绑定点击事件，携带多个参数到详情页面，详情页解析参数并设置自己的导航栏标题

* `wx.navigateTo()` 直接跳转到【目标页】
* `wx.redirectTo()` 关闭当前页面再跳转到目标页
* `wx.switchTab()` 跳转【底部选项卡】页
* `wx.setNavigationBarTitle({ title: '' })` 设置当前页顶部导航栏的标题

pages/home/home.xx

```xml
<!--pages/home/home.wxml-->
<!-- 列表：绑定点击跳转事件 并 携带参数 -->
<view wx:for="{{goodlist}}" wx:key="index" class="goodbox" bindtap="handleGoToDetail" data-id="{{item.id}}" data-title="{{item.title}}">
  ...
</view>
```

```js
import { request } from '../../utils/request'
// pages/home/home.js
Page({
  handleGoToDetail(evt) {
    //wx.redirectTo() - 关闭当前页面再跳转到目标页
    //wx.switchTab()  - 跳转【底部选项卡】页
    var id = evt.currentTarget.dataset.id
    var title = evt.currentTarget.dataset.title
    console.log(id, title);
    wx.navigateTo({ //- 直接跳转到【目标页】
      url: `/pages/detail/detail?id=${id}&title=${title}`,
    })
  },
  ...
})
```

app.json

```json
{
  "pages": [
    "pages/home/home",
    ...
    "pages/detail/detail"
  ],
}
```

pages/detail/detail.xx

```js
// pages/detail/detail.js
Page({
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //列表进入详情携带的参数 id，即 url?id=1&title=小米
    console.log(options); // {id: "2", title: "小米"}  options.id  options.title
    //设置当前页面导航栏的 title 
    wx.setNavigationBarTitle({
      title: options.title,
    })
  },
  ...
})
```





## 5. 详情页

### 【添加编译模式】

设置后，后面就只编译这一页，对开发进行时相当友好。

![image-20260203190316584](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260203190318000.png)

### 轮播+全屏预览

[轮播和全屏预览](https://github.com/janycode/wx-wechat-mall-applet-demo/commit/cd3d71815144eed4ad7525a5c63d59759c4997f2)：详情页轮播图、原生方法全屏预览轮播图

* `wx.previewImage({ })` 全屏预览图片

```xml
<!--pages/detail/detail.wxml-->
<!-- 详情页轮播 -->
<swiper indicator-dots="{{true}}" circular="{{true}}" autoplay="{{true}}" interval="2000">
  <swiper-item wx:for="{{info.slides}}" wx:key="index">
  <!-- aspectFit 保持缩放比，样式中设置了图片的宽高，为了让图片完整显示 -->
    <image src="{{BASE_URL + item}}" mode="aspectFit" bindtap="handleFullScreenTap" data-current="{{BASE_URL + item}}" />
  </swiper-item>
</swiper>
```

```css
/* pages/detail/detail.wxss */
swiper image{
  width: 100%;
  height: 200px;
}
swiper {
  height: 200px;
}
```

```js
const { request, BASE_URL } = require("../../utils/request");
// pages/detail/detail.js
Page({
  data: {
    BASE_URL: '',
    info: null
  },
  onLoad(options) {
    // 获取小程序全局实例，将全局基地址赋值到页面data
    this.setData({
      BASE_URL: getApp().globalData.BASE_URL
    });
    //列表进入详情携带的参数 id，即 url?id=1&title=小米
    console.log(options); // {id: "2", title: "小米"}  options.id  options.title
    //设置当前页面导航栏的 title 
    wx.setNavigationBarTitle({
      title: options.title,
    })
    //ajax请求详情信息
    this.getGoodDetailById(options.id)
  },

  getGoodDetailById(id) {
    request({
      url: `/goods/${id}`
    }).then(res => {
      console.log(res);
      this.setData({
        info: res
      })
    }).catch(err => {
      console.error(err);
    })
  },

  handleFullScreenTap(evt) {
    //原生方法全屏预览图片
    wx.previewImage({
      current: evt.currentTarget.dataset.current, //当前显示图片的 http 链接 
      urls: this.data.info.slides.map(item => BASE_URL + `${item}`)  //需要预览的图片 http 链接列表
    })
  },
  ...
})
```

![image-20260203191854728](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260203191855913.png)



### 详情

[商品详情](https://github.com/janycode/wx-wechat-mall-applet-demo/commit/1de051faf23e2d531643332127efaf03b669327d)：页内导航和高亮处理、吸顶效果、商品详情遍历

```xml
<!--pages/detail/detail.wxml-->
<!-- 详情页轮播 -->
<swiper indicator-dots="{{true}}" circular="{{true}}" autoplay="{{true}}" interval="2000">
  <swiper-item wx:for="{{info.slides}}" wx:key="index">
    <!-- aspectFit 保持缩放比，样式中设置了图片的宽高，为了让图片完整显示 -->
    <image src="{{BASE_URL + item}}" mode="aspectFit" bindtap="handleFullScreenTap" data-current="{{BASE_URL + item}}" />
  </swiper-item>
</swiper>
<!-- 详情页 tabbar + sticky吸顶（需要设置子元素 100vw） -->
<mp-sticky offset-top="0">
  <view class="detailtabbar" style="width: 100vw;">
    <view class="{{current === 0 ? 'active' : ''}}" bindtap="handleActive" data-index="{{0}}">商品详情</view>
    <view class="{{current === 1 ? 'active' : ''}}" bindtap="handleActive" data-index="{{1}}">用户评价</view>
  </view>
</mp-sticky>
<!-- 详情页：商品详情 -->
<view wx:if="{{current === 0}}">
  <view style="color: gray; margin: 10px;">{{info.feature}}</view>
  <image wx:for="{{info.desc}}" src="{{item}}" mode="widthFix" style="width: 100%;" />
</view>
<!-- 详情页：用户评价 -->
<view wx:else>
  <view wx:for="{{comments}}" wx:key="index" style="border-bottom: 1px solid lightgray;">
    <view class="user">
      <image src="{{BASE_URL + item.userImageUrl}}" mode="widthFix" class="left" />
      <view class="left">{{item.nickname}}</view>
      <view class="right">{{item.creationTime}}</view>
    </view>
    <view class="content">{{item.content}}</view>
    <view class="content">
      <image src="{{BASE_URL + item.imgUrl}}" mode="widthFix" />
    </view>
  </view>
</view>

<!-- 底部按钮 -->
<view class="bottom">
  <view style="background-color: #14c145;">查看购物车</view>
  <view style="background-color: #F76260;">加入购物车</view>
  <view style="background-color: #ffa591;">立即购买</view>
</view>
```

```json
{
  "usingComponents": {
    "mp-sticky": "@miniprogram-component-plus/sticky"
  }
}
```

```css
/* pages/detail/detail.wxss */
swiper image {
  width: 100%;
  height: 200px;
}
swiper {
  height: 200px;
}

.detailtabbar {
  display: flex;
  flex-direction: row;
  text-align: center;
  height: 100rpx;
  line-height: 100rpx;
  background-color: white;
}

.detailtabbar view {
  flex: 1;
}
.detailtabbar .active {
  border-bottom: 1px solid red;
}

.user {
  overflow: hidden;
  padding: 20px;
}
.user .left {
  float: left;
  height: 100rpx;
  line-height: 100rpx;
}
.user image {
  width: 100rpx;
  border-radius: 50rpx;
}
.user .right {
  float: right;
  height: 100rpx;
  line-height: 100rpx;
}
.content {
  padding: 20rpx;
}
.content image {
  width: 300rpx;
}

.bottom {
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
}
.bottom view{
  flex: 1;
  color: white;
}
```

```js
const { request, BASE_URL } = require("../../utils/request");

// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    BASE_URL: '',
    info: null,
    current: 0,
    comments: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取小程序全局实例，将全局基地址赋值到页面data
    this.setData({
      BASE_URL: getApp().globalData.BASE_URL
    });
    //列表进入详情携带的参数 id，即 url?id=1&title=小米
    console.log(options); // {id: "2", title: "小米"}  options.id  options.title
    //设置当前页面导航栏的 title 
    wx.setNavigationBarTitle({
      title: options.title,
    })
    //ajax请求详情信息
    this.getGoodDetailById(options.id)
    //ajax请求评价信息
    this.getGoodComment()
  },

  getGoodDetailById(id) {
    request({
      url: `/goods/${id}`
    }).then(res => {
      console.log(res);
      this.setData({
        info: res
      })
    }).catch(err => {
      console.error(err);
    })
  },

  handleFullScreenTap(evt) {
    //原生方法全屏预览图片
    wx.previewImage({
      current: evt.currentTarget.dataset.current, //当前显示图片的 http 链接 
      urls: this.data.info.slides.map(item => BASE_URL + `${item}`)  //需要预览的图片 http 链接列表
    })
  },

  handleActive(evt) {
    this.setData({
      current: evt.currentTarget.dataset.index
    })
  },

  getGoodComment() {
    request({
      url: "/comments"
    }).then(res => {
      console.log(res);
      this.setData({
        comments: res
      })
    }).catch(err => {
      console.log(err);
    })
  },
  ...
})
```

![image-20260203215101434](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260203215102602.png)

### 评价

[商品用户评价](https://github.com/janycode/wx-wechat-mall-applet-demo/commit/5d7e99be4d1bcd20910ffa450248eafe03137485)：评价内容请求、列表布局、底部固定3个按钮布局

代码同上。

![image-20260203215134133](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260203215135283.png)



## 6. 搜索模块

### 【使用 WeUI】

官方文档：https://wechat-miniprogram.github.io/weui/docs/

1. 通过 [useExtendedLib 扩展库](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#useExtendedLib) 的方式引入，这种方式引入的组件将`不会计入代码包大小`。
2. 可以通过[npm](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)方式下载构建，npm包名为`weui-miniprogram`

app.json - 使用第 1 种方式引入，只需要添加一个配置即可

```json
{
  ...
  "useExtendedLib": {
    "weui": true
  }
}
```



### 搜索框 SearchBar

参考文档：https://wechat-miniprogram.github.io/weui/docs/search.html

pages/search/search.xx

```json
{
  "usingComponents": {
    "mp-searchbar": "weui-miniprogram/searchbar/searchbar"  //引入 weUI searchbar
  },
  "navigationBarTitleText": "搜索"
}
```

```xml
<!--pages/search/search.wxml-->
<!-- WeUI searchbar 搜索组件 -->
<mp-searchbar bindselectresult="handleSearchResult" search="{{search}}"></mp-searchbar>
```

```js
const { request } = require("../../utils/request");
// pages/search/search.js
Page({
  data: {
    search: ''
  },
  onLoad(options) {
    this.setData({
      search: this.search.bind(this)  //绑定 this 指向
    })
  },
  // 输入过程不断调用此函数得到新的搜索结果，参数是输入框的值value，返回Promise实例
  search(value) {
    return Promise.all([
      request({ url: `/goods` }),
      request({ url: `/categories` })
    ]).then(res => {
      console.log(res[0], res[1]);
      // 商品名称 + type 1 进详情页，最终映射对象必须是 {text: xx, type: yy}
      var goodsTitles = res[0].filter(item => item.title.includes(value)).map(item => {
        return { ...item, text: item.title, type: 1 }
      })
      // 分类名称 + type 2 进搜索列表，最终映射对象必须是 {text: xx, type: yy}
      var categoriesTitles = res[1].filter(item => item.title.includes(value)).map(item => {
        return { ...item, text: item.title, type: 2 }
      })
      return [...goodsTitles, ...categoriesTitles]
    })
  },
  // 在选择搜索结果的时候触发事件
  handleSearchResult(e) {
    console.log(e.detail); // {index: x, item: {...}}
    var { type, id, title } = e.detail.item
    if (type === 1) {
      console.log("详情页面");
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}&title=${title}`
      })
    } else {
      console.log("搜索列表");
      wx.navigateTo({
        url: `/pages/searchlist/searchlist?id=${id}&title=${title}`
      })
    }
  }
})
```

![image-20260203215357206](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260203215358825.png)

### 搜索列表 和 排序

[搜索列表和排序](https://github.com/janycode/wx-wechat-mall-applet-demo/commit/990f4bb726d87b8c675dba44db449c709af8d9a0)：列表布局、详情页跳转、图标引入、价格排序和评价排序

```xml
<!--pages/searchlist/searchlist.wxml-->
<view class="goodcontainer">
  <view wx:for="{{goodlist}}" wx:key="index" class="good" bindtap="handleGoToDetail" data-id="{{item.id}}" data-title="{{item.title}}">
    <image src="{{BASE_URL + item.poster}}" mode="widthFix" />
    <view>{{item.title}}</view>
    <view>价格：<text style="color: red">￥{{item.price}}</text></view>
    <view>好评率：<text style="color: green">{{item.goodcomment}}</text></view>
  </view>
</view>
```

```json
{
  "usingComponents": {
    "mp-icon": "weui-miniprogram/icon/icon"
  }
}
```

```css
/* pages/searchlist/searchlist.wxss */
.goodcontainer {
  display: flex;
  flex-wrap: wrap;
}
.good {
  width: 50%;
  padding: 20rpx;
  box-sizing: border-box;
  text-align: center;
}
.good image{
  width: 100%;
}

.sort-header {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: 80rpx;
  line-height: 80rpx;
}
```

```js
const { request } = require("../../utils/request");
// pages/searchlist/searchlist.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    BASE_URL: '',
    goodlist: [],
    priceOrder: true,
    commentOrder: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取小程序全局实例，将全局基地址赋值到页面data
    this.setData({
      BASE_URL: getApp().globalData.BASE_URL
    });
    console.log(options); //接收参数
    wx.setNavigationBarTitle({
      title: options.title
    })
    this.getList(options.id)
  },
  //请求分类和商品列表
  getList(id) {
    request({
      url: `/categories?id=${id}&_embed=goods`
    }).then(res => {
      console.log(res[0]); //在第一个元素里面
      this.setData({
        goodlist: res[0].goods
      })
    }).catch(err => {
      console.error(err);
    })
  },
  // 跳转详情页
  handleGoToDetail(evt) {
    var { id, title } = evt.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}&title=${title}`
    })
  },
  // 价格排序
  handlePriceOrder() {
    console.log(this.data.priceOrder);
    this.setData({
      priceOrder: !this.data.priceOrder,
      goodlist: this.data.priceOrder
        ? this.data.goodlist.sort((x, y) => y.price - x.price)
        : this.data.goodlist.sort((x, y) => x.price - y.price)
    })
  },
  // 评价排序
  handleCommentOrder() {
    console.log(this.data.commentOrder);
    this.setData({
      commentOrder: !this.data.commentOrder,
      goodlist: this.data.commentOrder
        ? this.data.goodlist.sort((x, y) => parseInt(y.goodcomment) - parseInt(x.goodcomment))
        : this.data.goodlist.sort((x, y) => parseInt(x.goodcomment) - parseInt(y.goodcomment))
    })
  },
  ...
})
```

![image-20260203215428852](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260203215430318.png)



## 7. 分类模块

> 官方的扩展组件文档没有使用 demo，需要结合源码查看
>
> 扩展组件：https://developers.weixin.qq.com/miniprogram/dev/platform-capabilities/extended/component-plus/
>
> 源码示例：https://github.com/wechat-miniprogram/miniprogram-component-plus
>
> 源码 demo位置：/tools/demo/example/xxx，如 vtabs 在 /tools/demo/example/vtabs/...
>
> 或者通过该链接地址直接通过浏览器打开 微信开发工具 ：https://developers.weixin.qq.com/s/SG4tK2mD77f7

### vtabs 组件

`vtabs` [纵向选项卡组件](https://developers.weixin.qq.com/miniprogram/dev/platform-capabilities/extended/component-plus/vtabs.html)，需与 `<vtabs-content>` 组件结合使用。

安装：*npm i @miniprogram-component-plus/vtabs @miniprogram-component-plus/vtabs-content* - 安装完 `工具-构建npm`

引入：pages/category/category.json

```json
{
  "usingComponents": {
    "mp-vtabs": "@miniprogram-component-plus/vtabs",
    "mp-vtabs-content": "@miniprogram-component-plus/vtabs-content"
  },
  "navigationBarTitleText": "分类"
}
```

[分类页面](https://github.com/janycode/wx-wechat-mall-applet-demo/commit/71eccff8f1312ea429dc7c69ab4245975b4be71d)：vtabs组件源码demo分析和使用、样式高度问题处理、跳转详情处理

```xml
<!--pages/category/category.wxml-->
<mp-vtabs vtabs="{{vtabs}}" activeTab="{{activeTab}}" bindtabclick="onTabCLick" bindchange="onChange" class="test">
  <block wx:for="{{vtabs}}" wx:key="title">
    <mp-vtabs-content tabIndex="{{index}}">
      <view class="item-title">{{item.title}}</view>
      <view class="vtabs-content-item">
        <view wx:for="{{item.goods}}" wx:key="id" class="item" bindtap="handleGoodTap" data-id="{{item.id}}" data-title="{{item.title}}">
          <image src="{{BASE_URL + item.poster}}" mode="widthFix" />
          <view>{{item.title}}</view>
        </view>
      </view>
    </mp-vtabs-content>
  </block>
</mp-vtabs>
```

```css
/* pages/category/category.wxss */
/* page 拷贝过来的样式 */
page {
  background-color: #FFFFFF;
  height: 100%;
}
/* 标题 */
.item-title {
  padding: 10px;
  border-bottom: 1px solid lightgray;
}
.vtabs-content-item {
  display: flex;
  flex-wrap: wrap;
  /* height: 100vh; 可以让每个分类单独一屏，会有样式问题 */
}
.vtabs-content-item .item {
  width: 50%;
  height: 300rpx;   /* 300rpx 社区文档建议，可以正常显示 */
  padding: 30rpx;
  box-sizing: border-box;
}
.item image {
  width: 200rpx;
}
.item view {
  font-size: 13px;
  text-align: center;
}
```

```js
const { request } = require("../../utils/request")
// pages/category/category.js
Page({
  data: {
    BASE_URL: '',
    vtabs: [],
    activeTab: 0
  },
  onLoad(options) {
    // 获取小程序全局实例，将全局基地址赋值到页面data
    this.setData({
      BASE_URL: getApp().globalData.BASE_URL
    });
    request({ url: "/categories?_embed=goods" }).then(res => {
      console.log(res);
      this.setData({
        vtabs: res
      })
    }).catch(err => {
      console.error(err);
    })
  },
  // 点击分类事件
  onTabCLick(e) {
    const index = e.detail.index
    console.log('tabClick', index)
  },
  // 滑动右侧列表触发事件
  onChange(e) {
    const index = e.detail.index
    console.log('change', index)
  },
  // 点击右侧商品触发事件
  handleGoodTap(evt) {
    const { id, title } = evt.currentTarget.dataset
    console.log(id, title);
    //跳转详情页
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}&title=${title}`})
  },
  ...
})
```

![image-20260204111209612](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260204111211238.png)



## 8. 授权模块(★)

模拟本地存储/删除 token：

```sh
wx.setStorageSync("token", {name: "jerry"})
wx.removeStorageSync("token")
```

[微信授权与手机号绑定](https://github.com/janycode/wx-wechat-mall-applet-demo/commit/5f610eddfe523f1da321f79c254bb69cf39d53fe)：微信授权流程、手机号绑定页面逻辑、购物车页auth拦截、个人中心页auth拦截

### 微信授权

获取用户信息：https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserProfile.html

获取用户头像和昵称：https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/userProfile.html

```xml
<!--pages/auth/auth.wxml-->
<button type="primary" bindtap="handleAuth">微信授权</button>
```

```js
// pages/auth/auth.js
Page({
  handleAuth() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res);
        var { userInfo } = res
        wx.setStorageSync("token", userInfo)
        wx.navigateTo({ url: '/pages/telform/telform' })
      }
    })
  }
})
```



### 手机绑定

WeUI FormPage组件：https://wechat-miniprogram.github.io/weui/docs/form-page.html

WeUI Cells组件：https://wechat-miniprogram.github.io/weui/docs/cells.html

```json
{
  "usingComponents": {
    "mp-form-page": "weui-miniprogram/form-page/form-page",
    "mp-form": "weui-miniprogram/form/form",
    "mp-cells": "weui-miniprogram/cells/cells",
    "mp-cell": "weui-miniprogram/cell/cell"
  },
  "navigationBarTitleText": "手机号授权"
}
```

```xml
<!--pages/telform/telform.wxml-->
<mp-form-page title="手机绑定" subtitle="您的手机号将会与您的微信绑定">
  <!-- 手机号输入 -->
  <mp-cells title="信息" >
    <mp-cell prop="mobile" title="手机号" required ext-class=" weui-cell_vcode">
      <input bindinput="formInputMobile" data-field="mobile" class="weui-input" placeholder="请输入正确的手机号" />
    </mp-cell>
    <mp-cell prop="mobile" title="验证码" ext-class=" weui-cell_vcode">
      <input bindinput="formInputCode" class="weui-input" placeholder="请输入验证码" value="{{code}}" />
      <view slot="footer" class="weui-vcode-btn" bindtap="formRequestCode" >获取验证码</view>
    </mp-cell>
  </mp-cells>
  <!-- 按钮 -->
  <view slot="button">
    <button class="weui-btn" type="primary" bindtap="submitForm">确定</button>
  </view>
</mp-form-page>
```

```js
import { request } from "../../utils/request";

// pages/telform/telform.js
Page({
  data: {
    tel: '',
    code: ''
  },

  formInputMobile(evt) {
    console.log("手机号=", evt.detail.value);
    this.setData({ tel: evt.detail.value })
  },
  formInputCode(evt) {
    console.log("验证码=", evt.detail.value);
    //this.setData({ code: evt.detail.value })
  },
  formRequestCode() {
    //校验手机号
    if (this.data.tel === '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'fail',
        duration: 2000
      })
      return
    } else {
      if (this.data.tel.length != 11) {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'fail',
          duration: 2000
        })
        return
      } else {
        //正则校验手机号是否符合规则 todo
      }
    }
    wx.showToast({
      title: '测试验证码1234',
      icon: 'success',
      duration: 2000
    })
    // request({ url: '/code'}).then(res => {...})
    this.setData({ code: '1234' }) //测试验证码
  },

  submitForm() {
    //校验验证码
    if (this.data.code === '' || this.data.code.length != 4) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'fail',
        duration: 2000
      })
      return
    }
    wx.setStorageSync("tel", this.data.tel)
    var userInfo = wx.getStorageSync("token")
    request({
      url: `/users?tel=${this.data.tel}&nickName=${userInfo.nickName}`
    }).then(res => {
      console.log(res);
      if (res.length === 0) {
        // 用户不存在，新增
        request({
          url: "/users",
          method: "post",
          data: {
            ...userInfo,
            tel: this.data.tel
          }
        }).then(res => {
          console.log("1111");
          wx.navigateBack({ delta: 2 }) //返回2层页面
        })
      } else {
        // 用户存在
        console.log("2222");
        wx.navigateBack({ delta: 2 }) //返回2层页面
      }
    }).catch(err => {
      console.error(err);
    })
  },
  ...
})
```

![image-20260204123656943](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260204123658188.png)

![image-20260204123719260](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260204123720874.png)

#### authTool.js

```js
function checkAuth(callback) {
  if (wx.getStorageSync('tel')) {
    callback() //回调函数处理业务
  } else {
    if (wx.getStorageSync('token')) {
      wx.navigateTo({ url: '/pages/telform/telform' })  //手机绑定页
    } else {
      wx.navigateTo({ url: '/pages/auth/auth' }) //微信授权页
    }
  }
}

export default checkAuth
```

#### 购物车与个人中心 auth 拦截

```js
import checkAuth from "../../utils/authTool";
// pages/shopcar/shopcar.js
Page({
  onShow() {
    checkAuth(() => {
      console.log("进入购物车");
    })
  },
 ...
})
```

```js
import checkAuth from "../../utils/authTool";
// pages/shopcar/shopcar.js
Page({
  onShow() {
    checkAuth(() => {
      console.log("进入我的");
    })
  },
 ...
})
```



## 9. 购物车模块

[购物车模块](https://github.com/janycode/wx-wechat-mall-applet-demo/commit/b0b182de2884ccae8c5f3a1dfeb47d3d95ee3786)：详情页按钮加入购物车、购物车布局、数据渲染、金额计算、左滑删除、全选与反选

引入：mp-slideview

```json
{
  "usingComponents": {
    "mp-cells": "weui-miniprogram/cells/cells",
    "mp-cell": "weui-miniprogram/cell/cell",
    "mp-slideview": "weui-miniprogram/slideview/slideview"
  },
  "navigationBarTitleText": "购物车"
}
```

```xml
<!--pages/shopcar/shopcar.wxml-->
<mp-cells title="配送至默认地址：xxx" footer="左滑可以删除">
  <!-- <mp-cell value="标题文字" footer="说明文字"></mp-cell>
    <mp-cell>
        <view>标题文字（使用slot）</view>
        <view slot="footer">说明文字</view>
    </mp-cell> -->
  <mp-cell wx:for="{{cartlist}}" wx:key="id">
  <!-- 左滑删除组件 mp-slideview -->
    <mp-slideview buttons="{{slideButtons}}" bindbuttontap="slideButtonDeleteTap" data-item="{{item}}">
      <view class="content">
        <view class="cellcontent">
          <checkbox checked="{{item.checked}}" bindtap="handleCheckedTap" data-item="{{item}}" />
          <!-- image 的 mode 不能使用 widthFix 其他都可以，否则会影响左滑删除 -->
          <image src="{{BASE_URL + item.good.poster}}" mode="aspectFit" />
          <view>
            <view>{{item.good.title}}</view>
            <view style="color: red">￥{{item.good.price}}</view>
          </view>
        </view>
        <view slot="footer" class="cellfooter">
          <text bindtap="handleMinusTap" data-item="{{item}}">-</text>
          <text>{{item.number}}</text>
          <text bindtap="handleAddTap" data-item="{{item}}">+</text>
        </view>
      </view>
    </mp-slideview>
  </mp-cell>
</mp-cells>

<wxs src="./shopcar.wxs" module="calObj"></wxs>
<view class="footer">
  <!-- 全选组件 -->
  <checkbox-group bindchange="handleAllChecked">
    <checkbox checked="{{isAllChecked}}" />
  </checkbox-group>
  <view>全选</view>
  <view style="position:fixed; right: 180rpx; color: red; font-size: 20px;">￥{{calObj.sum(cartlist)}}</view>
  <button type="primary" size="mini">去结算</button>
</view>
```

```css
/* pages/shopcar/shopcar.wxss */
.content {
  display: flex;
  height: 100rpx;
  justify-content: space-between;
}
.cellcontent {
  display: flex;
}
.cellcontent checkbox {
  line-height: 100rpx;
}
.cellcontent image {
  width: 100rpx;
  height: 100rpx;
}
.cellfooter text{
  width: 60rpx;
  display: inline-block;
  text-align: center;
  border: 1px solid lightgray;
}

.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
  margin-bottom: 20rpx;
  height: 60rpx;
  line-height: 60rpx;
  background-color: white;
  display: flex;
}
.footer button{
  position: fixed;
  right: 0;
  margin-right: 20rpx;
}
```

```js
const { default: checkAuth } = require("../../utils/authTool");
const { request, BASE_URL } = require("../../utils/request");

// pages/shopcar/shopcar.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    BASE_URL: '',
    slideButtons: [{
      type: 'warn',
      text: '删除',
    }],
    cartlist: [],
    isAllChecked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取小程序全局实例，将全局基地址赋值到页面data
    this.setData({
      BASE_URL: getApp().globalData.BASE_URL
    });
    let { nickName } = wx.getStorageSync('token')
    let tel = wx.getStorageSync('tel')
    console.log(nickName, tel);
    request({ url: `/carts?_embed=good&username=${nickName}&tel=${tel}` }).then(res => {
      console.log("cartlist=", res);
      this.setData({
        cartlist: res
      })
    }).catch(err => {
      console.error(err);
    })
    // 检查是否全选，并设置全选 checked
    this.setData({
      isAllChecked: this.data.cartlist.every(item => item.checked === true)
    })
  },

  // 左滑删除按钮点击事件回调（必须添加，否则点击无反应）
  slideButtonDeleteTap(evt) {
    console.log('左滑删除触发', evt);
    // 此处编写删除购物车商品的逻辑（示例：提示+模拟删除）
    wx.showModal({
      title: '提示',
      content: '确定删除该商品吗？',
      success: (res) => {
        if (res.confirm) {
          // 调用接口删除购物车数据 + 更新页面列表
          let id = evt.currentTarget.dataset.item.id
          request({ url: `/carts/${id}`, method: "delete" }).then(res => {
            console.log(res);
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1500
            });
          })
          this.setData({
            cartlist: this.data.cartlist.filter(item => item.id !== id)
          })
        }
      }
    });
  },

  handleCheckedTap(evt) {
    let item = evt.currentTarget.dataset.item
    console.log(item);
    item.checked = !item.checked
    this.handleUpdate(item)
    // 检查是否全选，并设置全选 checked
    this.setData({
      isAllChecked: this.data.cartlist.every(item => item.checked === true)
    })
  },

  handleUpdate(item) {
    this.setData({
      cartlist: this.data.cartlist.map(data => {
        if (data.id === item.id) {
          return item
        }
        return data
      })
    })
    request({
      url: `/carts/${item.id}`,
      method: "put",
      data: {
        username: item.username,
        tel: item.tel,
        goodId: item.goodId,
        number: item.number,
        checked: item.checked
      }
    })
  },

  handleMinusTap(evt) {
    let item = evt.currentTarget.dataset.item
    console.log(item);
    item.number--
    this.handleUpdate(item)
  },

  handleAddTap(evt) {
    let item = evt.currentTarget.dataset.item
    console.log(item);
    item.number++
    this.handleUpdate(item)
  },
  // 全选与否逻辑处理
  handleAllChecked(evt) {
    console.log(evt.detail.value);
    if (evt.detail.value.length === 0) {
      //未全选
      this.setData({
        cartlist: this.data.cartlist.map(item => ({
          ...item,
          checked: false
        }))
      })
      //请求接口批量修改为 false
    } else {
      //全选
      this.setData({
        cartlist: this.data.cartlist.map(item => ({
          ...item,
          checked: true
        }))
      })
      //请求接口批量修改为 true
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    checkAuth(() => {
      console.log("进入购物车");
    })
  },
  ...
})
```

```js
// pages/shopcar/shopcar.wxs
function sum(list) {
  var total = 0
  for (var i  = 0; i < list.length; i++) {
    if(list[i].checked) {
      total += list[i].good.price * list[i].number
    }
  }
  return total
}

module.exports = {
  sum: sum
}
```

![image-20260204170108366](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260204170110395.png)



## 10. 我的模块

### 布局+换头像

[个人中心](https://github.com/janycode/wx-wechat-mall-applet-demo/commit/89fb4deb85f28679d74b7e1c01ca294758be0ab8)：布局、换头像功能

更换头像：https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.chooseMedia.html

引入：

```json
{
  "usingComponents": {
    "mp-cells": "weui-miniprogram/cells/cells",
    "mp-cell": "weui-miniprogram/cell/cell",
    "mp-icon": "weui-miniprogram/icon/icon"
  },
  "navigationBarTitleText": "我的"
}
```

```xml
<!--pages/center/center.wxml-->
<view class="userinfo">
  <image src="https://janycode.github.io/img/avatar.png" mode="widthFix" bindtap="handleAvatarChange" />
  <view>{{userInfo.nickName}}</view>
</view>

<view>
  <mp-cell value="完善信息">
    <mp-icon slot="icon" type="field" icon="me" color="#14c145" size="{{20}}"></mp-icon>
    <mp-icon slot="icon" type="field" icon="arrow" color="#14c145" size="{{10}}" slot="footer"></mp-icon>
  </mp-cell>
  <mp-cell value="个性设置">
    <mp-icon slot="icon" type="field" icon="like" color="#14c145" size="{{20}}"></mp-icon>
    <mp-icon slot="icon" type="field" icon="arrow" color="#14c145" size="{{10}}" slot="footer"></mp-icon>
  </mp-cell>
</view>
```

```css
/* pages/center/center.wxss */
.userinfo {
  background-color: #14c145;
  text-align: center;
  height: 320rpx;
}
.userinfo image{
  width: 200rpx;
  height: 200rpx;
  line-height: 100rpx;
  border-radius: 100rpx;
  margin: 20rpx;
}
```

```js
import checkAuth from "../../utils/authTool";

// pages/center/center.js
Page({
  data: {
    BASE_URL: '',
    userInfo: null
  },

  onLoad(options) {
    // 获取小程序全局实例，将全局基地址赋值到页面data
    this.setData({
      BASE_URL: getApp().globalData.BASE_URL
    });
  },
  //更换头像：拍摄或从手机相册中选择图片或视频
  handleAvatarChange() {
    wx.chooseMedia({
      count: 1, //选择图片数量
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      //success(res) {
      success: (res) => {  //使用箭头函数 确保 this 指向为当前页面对象
        console.log(res.tempFiles[0].tempFilePath)
        console.log(res.tempFiles[0].size)
        this.setData({
          userInfo: {
            ...this.data.userInfo,
            avatarUrl: res.tempFiles[0].tempFilePath
          }
        })
        //放在本地存储中
        wx.setStorageSync("token", {
          ...wx.getStorageSync("token"),
          avatarUrl: res.tempFiles[0].tempFilePath
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    checkAuth(() => {
      console.log("进入我的");
      this.setData({
        userInfo: wx.getStorageSync("token")
      })
    })
  },
  ...
})
```

![image-20260204173729986](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260204173731302.png)



## 11. 微信支付(★)

### 微信支付账户介绍

![image-20260204173814836](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260204173816213.png)

**微信账号**：二维码收款

* 主要面向线下收款，如果小程序面向线上，异地交易会导致账户异常

**微信商户**：找有权限的代理商可以去申请签约

* api 收款、营销、分账、官方活动
* 钱 进微信商户号，最终结算/体现到银行卡



### 整体业务流程

① 签约商户

1. 方式1
   - 微信(个体户、企业)：https://pay.weixin.qq.com
     - 成为商家 或 绑定商户号 → 小微商户(仅有身份证) → 
   - 支付宝(个体户、企业)-支付宝生态：https://b.alipay.com

② API 对接

③ 回调处理

④ 对账



参考资料：

微信支付开发文档：https://pay.weixin.qq.com/doc/v3/partner/4012069852

微信小程序支付：https://pay.weixin.qq.com/doc/v3/partner/4012085810

参考实现流程：https://blog.csdn.net/qq_40791475/article/details/147588905



































































