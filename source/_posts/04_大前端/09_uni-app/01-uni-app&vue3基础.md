---
title: 01-uni-app&vue3基础
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

- uni-app 官网：https://www.dcloud.io/
- HBuild X 开发工具：https://hx.dcloud.net.cn/



## 1. 环境准备

### 1.1 安装 HBuild X

HBuild X 开发工具：https://hx.dcloud.net.cn/

注意事项：

- 安装时选择快捷键方案 `IntelliJ IDEA` 方案即可。



### 1.2 创建项目

![image-20260204184825609](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260204184826896.png)

![image-20260204185517015](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260204185518714.png)

### 1.3 验证运行

① 运行到 chrome 浏览器：【运行】-【运行到浏览器】-【Chrome】

第一次运行项目，确保默认模版代码运行成功。

② 运行到 微信开发者工具：

![image-20260204190948927](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260204190950046.png)

![image-20260204191003894](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260204191004968.png)



### 1.4 iconfont

[阿里矢量图标库](https://www.iconfont.cn/)，准备字体图标，收集好图标，打包下载到本地，放在项目的 `static/` 目录下。样式文件放在 `common/`目录下（手动创建）

```
common/
  iconfont.css
static/
  iconfont/
     其他文件.xxx
```

common/iconfont.css

```css
@font-face {
  font-family: "iconfont"; 
  /* url 中添加前缀 ~@/static/iconfont/ 以访问到 static 中的 iconfont */
  src: url('~@/static/iconfont/iconfont.woff2?t=1770204954739') format('woff2'),
       url('~@/static/iconfont/iconfont.woff?t=1770204954739') format('woff'),
       url('~@/static/iconfont/iconfont.ttf?t=1770204954739') format('truetype');
}
...
```

验证：pages/index/index.vue

```html
<template>
  <view class="content">
    hello, uniapp <text class="iconfont icon-shouye"></text>
  </view>
</template>

<script>
  import '@/common/iconfont.css'  //引入字体图标样式文件
  export default {}
</script>

<style>
</style>
```

![image-20260204195511088](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260204195517012.png)





## 2. 页面与组件

> 先搭结构 -> 再写样式 -> 渲染数据 -> 交互行为。

### 2.1 目录结构

https://uniapp.dcloud.net.cn/tutorial/project.html

```js
┌─uniCloud              云空间目录，支付宝小程序云为uniCloud-alipay，阿里云为uniCloud-aliyun，腾讯云为uniCloud-tcb（uniCloud）
│─components            符合vue组件规范的uni-app【'组件'】目录
│  └─comp-a.vue         可复用的a组件
├─pages                 业务【'页面'】文件存放的目录
│  ├─index
│  │  └─index.vue       index页面
│  └─list
│     └─list.vue        list页面
├─static                存放应用引用的本地【'静态资源'】（如图片、视频等）的目录，注意：静态资源都应存放于此目录
├─uni_modules           存放uni_module 
├─platforms             存放各平台专用页面的目录
├─nativeplugins         App原生语言插件 
├─nativeResources       App端原生资源目录
│  ├─android            Android原生资源目录 
|  └─ios                iOS原生资源目录 
├─hybrid                App端存放本地html文件的目录
├─wxcomponents          存放微信小程序、QQ小程序组件的目录
├─mycomponents          存放支付宝小程序组件的目录
├─swancomponents        存放百度小程序组件的目录
├─ttcomponents          存放抖音小程序、飞书小程序组件的目录
├─kscomponents          存放快手小程序组件的目录
├─jdcomponents          存放京东小程序组件的目录
├─unpackage             非工程代码，一般存放运行或发行的【'编译结果'】
├─main.js               【'Vue初始化入口'】文件
├─App.vue               【'应用配置'】，用来配置App全局样式以及监听 应用生命周期
├─pages.json            【'配置页面路由、导航条、选项卡'】等页面类信息
├─manifest.json         配置应用名称、appid、logo、版本等【'打包信息'】
├─AndroidManifest.xml   Android原生应用清单文件 
├─Info.plist            iOS原生应用配置文件 
└─uni.scss              内置的常用样式变量
```



### 2.2 自定义头部组件

自定义导航 title：https://uniapp.dcloud.net.cn/collocation/pages.html#style

配置 pages.json

```json
{
	"pages": [ //pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
		{
			"path": "pages/index/index",
			"style": {
				"navigationStyle": "custom" //custom 自定义头组件
			}
		}
	],
	...
}

```

根目录新建 `components/` 目录，在该目录下`新建组件` xxx，同时勾选 `☑`创建组件 。



### 2.3 页面创建

https://uniapp.dcloud.net.cn/component/view.html

创建页面使用 vue3 + 组合式api 方式：`使用 scss 的页面(组合式)` + `导航栏标题 navigationBarTitleText`

![image-20260205110041243](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260205110042692.png)

对应 [page.json](https://uniapp.dcloud.net.cn/collocation/pages.html#pages) 也会创建出来路由：

```json
{
	"pages": [ //pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
		{
			"path": "pages/index/index",
			"style": {
				"navigationBarTitleText": "uni-app"
			}
    },
    {
      "path": "pages/demo1/demo1",  //demo1 的路由路径
      "style": {
        "navigationBarTitleText": "demo1"  //demo1 的导航栏标题
      }
    }
	],
	"globalStyle": {
		"navigationBarTextStyle": "black",
		"navigationBarTitleText": "uni-app",
		"navigationBarBackgroundColor": "#F8F8F8",
		"backgroundColor": "#F8F8F8"
	},
	"uniIdRouter": {}
}
```



### 2.4 view | text 容器

[view](https://uniapp.dcloud.net.cn/component/view.html) 类似于传统html中的div，用于包裹各种元素内容。

[text](https://uniapp.dcloud.net.cn/component/text.html#text%E7%BB%84%E4%BB%B6) 类似于传统html中的span，用于包裹文本内容。

```html
<template>
  <!-- hover-stay-time 按下持续时间，默认 400ms  -->
  <view class="box" hover-class="boxHover" hover-stay-time="0">
    <!-- hover-stop-propagation 默认 true，阻止事件冒泡 -->
    <view class="inner" hover-class="innerHover" hover-stop-propagation>内部</view>
  </view>
  <text selectable space>text文本标签</text>
</template>
```



### 2.5 scroll-view 滚动

[scroll-view](https://uniapp.dcloud.net.cn/component/scroll-view.html) 使用竖向滚动时，需要给 `<scroll-view>` 一个固定高度，通过 css 设置 height；使用横向滚动时，需要给`<scroll-view>`添加`white-space: nowrap;`样式。

```html
  <!-- 纵向滚动 -->
  <scroll-view scroll-y class="scrollview-y">
    <view>scrollview子元素</view>
    ...
  </scroll-view>

<style lang="scss">
  .scrollview-y {
    width: 80%;
    height: 200px;
    border: 1px solid red;
  }
</style>
```

```html
  <!-- 横向滚动 -->
  <scroll-view scroll-x class="scrollview-x">
    <view>scrollview子元素</view>
    ...
  </scroll-view>

<style lang="scss">
  .scrollview-x {
    width: 80%;
    height: 200px;
    border: 1px solid red;
    white-space: nowrap;  /* 父级不换行 */
    view {
      width: 80px;
      height: 80px;
      border: 1px solid blue;
      display: inline-block; /* 子级行级块 */
    }
  }
</style>
```



### 2.6 swiper 轮播

[swiper](https://uniapp.dcloud.net.cn/component/swiper.html)  滑块视图容器。一般用于左右滑动或上下滑动，比如banner轮播图。

注意滑动切换和滚动的区别，滑动切换是一屏一屏的切换。swiper下的每个swiper-item是一个滑动切换区域，不能停留在2个滑动区域之间。

```html
<template>
  <view class="">
    <!-- indicator-dots 指示点；circular 衔接轮播；autoplay 自动播放；vertical：纵向轮播 -->
    <swiper :indicator-dots="true" :circular="true" :autoplay="true" :interval="3000" :duration="1000">
      <swiper-item>111</swiper-item>
      <swiper-item>222</swiper-item>
      <swiper-item>333</swiper-item>
      <swiper-item>444</swiper-item>
    </swiper>
  </view>
</template>

<script setup></script>

<style lang="scss">
  swiper {
    width: 99vw;
    height: 200px;
    border: 1px solid red;

    swiper-item {
      width: 100%;
      height: 100%;
      background: pink;
    }

    swiper-item:nth-child(2n) {
      background: orange;
    }
  }
</style>
```



### 2.7 image 图片

[image](https://uniapp.dcloud.net.cn/component/image.html) 媒体组件中用于图片渲染显示。常用 mode 属性：

- aspectFit  保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。
- aspectFill  保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。
- widthFix  宽度不变，高度自动变化，保持原图宽高比不变
- heightFix  高度不变，宽度自动变化，保持原图宽高比不变

```html
<template>
  <view>
    <!-- 默认会把图片渲染为 240px 需要单独设置宽高；重点是 mode 属性的控制 -->
    <image src="/static/logo.png" mode="" class="pic1"></image>
    <!-- aspectFill 保持纵横比缩放图片，只保证图片的短边能完全显示出来【最常用】 -->
    <image src="/static/logo.png" mode="aspectFill" class="pic2"></image>
  </view>
</template>

<script setup></script>

<style lang="scss">
  .pic1 {
    width: 150px;
    height: 150px;
  }

  .pic2 {
    width: 100px;
    height: 100px;
  }
</style>
```



### 2.8 navigator 跳转

[navigator](https://uniapp.dcloud.net.cn/component/navigator.html) 页面跳转。该组件类似HTML中的`<a>`组件，但只能跳转本地页面。目标页面必须在 pages.json 中注册。

重点是 open-type 属性：（`声明式路由跳转` ，编程式路由跳转 对应 nui.xxx）

| 值           | 说明                                                         | 平台差异说明                                   |
| :----------- | :----------------------------------------------------------- | :--------------------------------------------- |
| navigate     | 对应 uni.navigateTo 的功能，保留当前页面，跳转到应用内的某个页面 |                                                |
| redirect     | 对应 uni.redirectTo 的功能，关闭当前页面，跳转到应用内的某个页面 |                                                |
| switchTab    | 对应 uni.switchTab 的功能，跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面 |                                                |
| reLaunch     | 对应 uni.reLaunch 的功能，关闭所有页面，打开到应用内的某个页面 | 抖音小程序与飞书小程序不支持                   |
| navigateBack | 对应 uni.navigateBack 的功能，关闭当前页面，返回上一页面或多级页面 |                                                |
| exit         | 退出小程序，target="miniProgram"时生效                       | 微信2.1.0+、百度2.5.2+、QQ1.4.7+、小红书小程序 |

```html
<template>
  <view>
    <!-- url 直接跳转 -->
    <navigator url="/pages/demo1/demo1">跳转到demo1</navigator>
    <navigator url="/pages/demo1/demo1" open-type="reLaunch">跳转到demo1-open-type</navigator>
  </view>
</template>
```



### 2.9 表单组件

[button](https://uniapp.dcloud.net.cn/component/button.html)  [input](https://uniapp.dcloud.net.cn/component/input.html)  

```html
<template>
  <view>
    <button>默认按钮</button>
    <button size="mini">mini</button>
    <button size="mini" type="primary">primary</button>
    <button size="mini" type="warn">warn</button>
    <button size="mini" type="primary" plain>plain镂空</button>
    <button size="mini" type="primary" plain disabled>禁用</button>
    <button size="mini" type="primary" plain loading>loading</button>
    <hr />
    <input type="text" placeholder="默认text输入框" maxlength="10" />
  </view>
</template>
```



### 2.10 事件映射表

```json
// 事件映射表，左侧为 WEB 事件，右侧为 ``uni-app`` 对应事件
	{
		click: 'tap',
		touchstart: 'touchstart',
		touchmove: 'touchmove',
		touchcancel: 'touchcancel',
		touchend: 'touchend',
		tap: 'tap',
		longtap: 'longtap', //推荐使用longpress代替
		input: 'input',
		change: 'change',
		submit: 'submit',
		blur: 'blur',
		focus: 'focus',
		reset: 'reset',
		confirm: 'confirm',
		columnchange: 'columnchange',
		linechange: 'linechange',
		error: 'error',
		scrolltoupper: 'scrolltoupper',
		scrolltolower: 'scrolltolower',
		scroll: 'scroll'
	}
```



### 2.11 页面生命周期

[页面生命周期](https://uniapp.dcloud.net.cn/tutorial/page.html#lifecycle)：`uni-app` 页面除支持 Vue 组件生命周期外还支持下方页面生命周期函数。

基于 vue3 的组合式 api 使用页面生命周期：https://uniapp.dcloud.net.cn/tutorial/vue3-composition-api.html

> uniapp中生命周期函数的执行顺序：
>
> 不包含组件的页面：**onLoad** > **onShow** > **onReady**
>
> 包含组件的页面：**onLoad** > **onShow** > beforeCreate > created > beforeMount > mounted > **onReady**

- onLoad - 页面开始加载，一般用于获取 url 上的参数
- onReady - 监听页面初次渲染完成，此时组件已挂载完成，DOM 树($el)已可用，可做相关的初始化 或 DOM操作
- onShow - 监听页面显示，页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面，如**进入页面视频/游戏播放**（从 onHide 进来的页面）
- onHide - 监听页面隐藏，如**离开页面视频/游戏播放暂停**
- onUnload - 监听页面卸载
- onPageScroll - 监听页面滚动，参数为Object
- ...

onLoad 示例：

```js
<script setup>
    import { ref } from 'vue'
    import { onLoad } from '@dcloudio/uni-app'
    const title = ref('Hello')
    onLoad(() => {
      console.log('onReady')
    })
</script>
```

接收 url 上的参数：

```js
<script setup>
    import { onLoad } from '@dcloudio/uni-app'
    onLoad((e) => {
        //访问：http://localhost:5173/#/pages/index/index?name=张三&age=18
    	console.log("onLoad 执行：", e.name, e.age); //onLoad 执行：张三 18
    })
</script>
```



onPageScoroll 示例：（回到顶部功能）

```html
<template>
  <view>
    <view v-for="(item,index) in 50" :key="index">
      {{item}} - {{index}}
    </view>
    <view class="backTop" v-if="showBackTop" @click="goBack">
      Top↑
    </view>
  </view>
</template>

<script setup>
  import {
    onPageScroll
  } from '@dcloudio/uni-app'
  import {
    ref
  } from 'vue';
  // 滚动超过200显示回到顶部
  let showBackTop = ref(false)
  onPageScroll((e) => {
    console.log("滚动：", e.scrollTop);
    showBackTop.value = e.scrollTop > 200
  })
  // 回到顶部
  const goBack = () => {
    document.documentElement.scrollTop = 0
  }
</script>

<style lang="scss" scoped>
  .backTop {
    width: 50px;
    height: 50px;
    background-color: yellow;
    position: fixed;
    right: 10px;
    bottom: 10px;
  }
</style>
```



### 2.12 css 尺寸单位 rpx(750基准)

[css 尺寸单位](https://uniapp.dcloud.net.cn/tutorial/syntax-css.html#%E5%B0%BA%E5%AF%B8%E5%8D%95%E4%BD%8D)  

- px 即屏幕像素
- `rpx` 即`响应式 px`，一种**根据屏幕宽度自适应的动态单位**。以 `750px` 宽的屏幕为基准，`750rpx` 恰好为屏幕宽度。屏幕变宽，rpx 实际显示效果会等比放大，但在 App（vue2 不含 nvue） 端和 H5（vue2） 端屏幕宽度达到 960px 时，默认将按照 375px 的屏幕宽度进行计算，具体配置参考：[rpx 计算配置](https://uniapp.dcloud.net.cn/collocation/pages#globalstyle) 。

> UI 常用在线工具：[蓝湖](https://lanhuapp.com/)、[MasterGo](https://mastergo.com/)、[即时设计](https://js.design/)
>
> **取尺寸单位的方式**：在 UI 工具中（或PS）中对设计稿进行等比缩放，宽度固定为 `750px`，此时就可以显示多大，就可以设置多大的 `rpx`。

目录放置要求：

- `css`、`less/scss` 等资源不要放在 `static` 目录下，建议这些公用的资源放在自建的 `common` 目录下。
- 非 `static` 目录下的文件（vue组件、js、css 等）只有被引用时，才会被打包编译。且默认 `static` 目录必定会被打包编译。

导入方式：使用`@import`语句可以导入外联样式表，`@import`后跟需要导入的外联样式表的相对路径，用`;`表示语句结束。

```css
<style>
    @import "../../common/uni.css";
    .uni-text {
        color: $uni-color-primary;  //可以直接使用 uni.scss 中的变量，或 uni.scss 文件中自定义新增变量
    }
</style>
```

也可以自己定义目录：

```txt
common/
  css/
  js/
  scss/
    xxx.scss
```

在 uni.scss 中引入自定义的 scss 文件，成为公共样式变量：

```css
/* 行为相关颜色 */
$uni-color-primary: #007aff;
...
@import "@/common/scss/xxx.css";  //一定注意要以分号 ; 结束
```



## 3. 全局配置

### 3.1 路由 globalStyle

5.3



### 3.2 配置 页面路径



### 3.3 底部选项卡



### 3.4 配置 manifest.json



### 3.5 .vite.config



### 3.6 showToast 提示



### 3.7 showLoading 加载中



### 3.8 showModal 模态框



* 



### 3.10 动态设置导航条



### 3.11 下拉刷新



## 3.12 路由跳转



### 3.13 数据缓存 StorageSync



* 

### 4.1 uni.request



















