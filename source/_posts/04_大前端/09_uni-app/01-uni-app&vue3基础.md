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

[globalStyle](https://uniapp.dcloud.net.cn/collocation/pages.html#globalstyle)  用于设置应用的状态栏、导航条、标题、窗口背景色等。

| 属性                           | 类型     | 默认值  | 描述                                                         |
| :----------------------------- | :------- | :------ | :----------------------------------------------------------- |
| `navigationBarBackgroundColor` | HexColor | #F8F8F8 | 导航栏背景颜色（同状态栏背景色）                             |
| `navigationBarTextStyle`       | String   | black   | 导航栏标题颜色及状态栏前景颜色，仅支持 black/white           |
| `navigationBarTitleText`       | String   |         | 导航栏标题文字内容                                           |
| `navigationStyle`              | String   | default | 导航栏样式，仅支持 default/custom。`custom` 即取消默认的原生导航栏，需看[使用注意](https://uniapp.dcloud.net.cn/collocation/pages#customnav) |
| `backgroundColor`              | HexColor | #ffffff | 下拉显示出来的窗口的背景色                                   |
| `backgroundTextStyle`          | String   | dark    | 下拉 loading 的样式，仅支持 dark / light                     |
| `enablePullDownRefresh`        | Boolean  | false   | 是否开启下拉刷新，详见[页面生命周期](https://uniapp.dcloud.net.cn/tutorial/page.html#lifecycle)。 |
| `onReachBottomDistance`        | Number   | 50      | 页面上拉触底事件触发时距页面底部距离，单位只支持 px，详见[页面生命周期](https://uniapp.dcloud.net.cn/tutorial/page.html#lifecycle) |
| ...                            |          |         |                                                              |

```json
"globalStyle": {
    "navigationBarTextStyle": "white",
    "navigationBarTitleText": "全局导航标题",
    "navigationBarBackgroundColor": "#14c145",
    "backgroundColor": "#F8F8F8",
    "backgroundTextStyle": "dark",
    "enablePullDownRefresh": true,
    "onReachBottomDistance": 50
  },
```



### 3.2 配置 pages.json（完整）

[pages 配置项列表](https://uniapp.dcloud.net.cn/collocation/pages.html#%E9%85%8D%E7%BD%AE%E9%A1%B9%E5%88%97%E8%A1%A8) 以下是包含了额所有配置项的 pages.json :

* globalStyle 中的属性都适用于 pages 中的 style，且 pages 中 style 优先级更高。

```json
{
  "pages": [ //数组，这里的 "style" 配置会覆盖全局的 "globalStyle"
    //pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
    {
      "path": "pages/index/index",  //路径，在 pages/ 目录下新建页面，默认会添加 path
      "style": {
        "navigationBarTitleText": "组件"
      }
    },
    {
      "path": "pages/API/index",
      "style": {
        "navigationBarTitleText": "接口"
      }
    },
    {
      "path": "pages/component/view/index",
      "style": {
        "navigationBarTitleText": "view"
      }
    }
  ],
  "condition": {
    //模式配置，仅开发期间生效
    "current": 0, //当前激活的模式（list 的索引项）
    "list": [
      {
        "name": "test", //模式名称
        "path": "pages/component/view/index" //启动页面，必选
      }
    ]
  },
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "演示",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8",
    "usingComponents": {
      "collapse-tree-item": "/components/collapse-tree-item"
    },
    "renderingMode": "seperated", // 仅微信小程序，webrtc 无法正常时尝试强制关闭同层渲染
    "pageOrientation": "portrait", //横屏配置，全局屏幕旋转设置(仅 APP/微信/QQ小程序)，支持 auto / portrait / landscape
    "rpxCalcMaxDeviceWidth": 960,
    "rpxCalcBaseDeviceWidth": 375,
    "rpxCalcIncludeWidth": 750
  },
  "tabBar": {
    "color": "#7A7E83",
    "selectedColor": "#3cc51f",
    "borderStyle": "black",
    "backgroundColor": "#ffffff",
    "height": "50px",
    "fontSize": "10px",
    "iconWidth": "24px",
    "spacing": "3px",
    "iconfontSrc": "static/iconfont.ttf", // app tabbar 字体.ttf文件路径 app 3.4.4+
    "list": [
      {
        "pagePath": "pages/component/index",
        "iconPath": "static/image/icon_component.png",
        "selectedIconPath": "static/image/icon_component_HL.png",
        "text": "组件",
        "iconfont": {
          // 优先级高于 iconPath，该属性依赖 tabbar 根节点的 iconfontSrc
          "text": "\ue642", // 已实际字体编码为准
          "selectedText": "\ue776",
          "fontSize": "17px",
          "color": "#000000",
          "selectedColor": "#0000ff"
        }
      },
      {
        "pagePath": "pages/API/index",
        "iconPath": "static/image/icon_API.png",
        "selectedIconPath": "static/image/icon_API_HL.png",
        "text": "接口"
      }
    ],
    "midButton": {
      "width": "80px",
      "height": "50px",
      "text": "文字",
      "iconPath": "static/image/midButton_iconPath.png",
      "iconWidth": "24px",
      "backgroundImage": "static/image/midButton_backgroundImage.png"
    }
  },
  "easycom": {
    "autoscan": true, //是否自动扫描组件
    "custom": {
      //自定义扫描规则
      "^uni-(.*)": "@/components/uni-$1.vue"
    }
  },
  "topWindow": {
    "path": "responsive/top-window.vue",
    "style": {
      "height": "44px"
    }
  },
  "leftWindow": {
    "path": "responsive/left-window.vue",
    "style": {
      "width": "300px"
    }
  },
  "rightWindow": {
    "path": "responsive/right-window.vue",
    "style": {
      "width": "300px"
    },
    "matchMedia": {
      "minWidth": 768
    }
  }
}
```



### 3.3 底部选项卡

[tabBar](https://uniapp.dcloud.net.cn/collocation/pages.html#tabbar) 如果应用是一个多 tab 应用，可以通过 tabBar 配置项指定一级导航栏，以及 tab 切换时显示的对应页。

* 配置最少 2 个、最多 5 个 tab，tab 按数组的顺序排序
* iconPath 图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px

```json
  "tabBar": {
    "color": "#696969", //底部导航文字颜色
    "selectedColor": "#14c145", //底部导航选中文字颜色
    "borderStyle": "white", //底部导航边框颜色
    "backgroundColor": "white", //底部导航背景色
    //"position": "top", //导航变成顶部 - 仅小程序支持
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "/static/images/home.png",
        "selectedIconPath": "/static/images/home_light.png",
        "text": "首页"
      },
      {
        "pagePath": "pages/classify/classify",
        "iconPath": "/static/images/category.png",
        "selectedIconPath": "/static/images/category_light.png",
        "text": "分类"
      },
      {
        "pagePath": "pages/order/order",
        "iconPath": "/static/images/shopcar.png",
        "selectedIconPath": "/static/images/shopcar_light.png",
        "text": "订单"
      },
      {
        "pagePath": "pages/user/user",
        "iconPath": "/static/images/center.png",
        "selectedIconPath": "/static/images/center_light.png",
        "text": "我的"
      }
    ]
  },
```

![image-20260206105619468](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260206105621025.png)

### 3.4 配置 manifest.json

[manifest.json](https://uniapp.dcloud.net.cn/collocation/manifest.html) 是应用的配置文件，用于指定应用的名称、图标、权限等。HBuilderX 创建的工程此文件在根目录，CLI 创建的工程此文件在 src 目录。

* 【微信小程序配置】- 填写 AppId，勾选上传代码自动压缩
* 【Web配置】- 配置页面标题，和其他选项按需，打包上线时做具体配置



### 3.5 .vite.config 配置插件自动导包

`unplugin-auto-import`  是一款 npm 插件库，需要安装，安装后可以免去每次导入（如 ref、computed等）的步骤了。

安装：~~npm i unplugin-auto-import~~ - 实测不安装，仅配置 vite.config.js 也可以自动导包。

项目根目录下新建 vite 配置文件：[vite.config.js](https://uniapp.dcloud.net.cn/collocation/vite-config.html)

* 仅`vue 3`项目生效。

vite.config.js

```js
import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
  plugins: [
    uni(),
    // 自动导入配置
    AutoImport({
      imports: [
        // 预设
        "vue",
        "uni-app",
      ],
    }),
  ],
});
```

还支持其他配置，参考官方文档即可：

* 自定义静态资源目录
* 注入全局依赖
* 配置环境变量
* 发布时删除 console
* 发布时动态修改 manifest.json



### 3.6 showToast 提示

[showToast](https://uniapp.dcloud.net.cn/api/ui/prompt.html#showtoast)  显示消息提示框。

```js
uni.showToast({
  title: "操作成功",
  icon: "error", //默认 success(可省略), 常用error/loading/none等，也可以不要图标
  //image: "../../static/images/home.png", //自定义图标显示
  duration: 2000, //默认 1500ms（1.5s）
  mask: true, //透明蒙层，toast 消失后才能点击操作页面
});
```

```js
uni.hideToast(); //关闭消息提示框
```



### 3.7 showLoading 加载中

[showLoading](https://uniapp.dcloud.net.cn/api/ui/prompt.html#showloading) 显示 loading 提示框, 需主动调用 [uni.hideLoading](https://uniapp.dcloud.net.cn/api/ui/prompt.html#hideloading) 才能关闭提示框。

```js
uni.showLoading({
  title: "加载中",
});

setTimeout(function () {
  uni.hideLoading();
}, 2000);
```

![image-20260206115630709](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260206115631762.png)

### 3.8 showModal 模态框

[showModal](https://uniapp.dcloud.net.cn/api/ui/prompt.html#showmodal)  显示模态弹窗，可以只有一个确定按钮，也可以同时有确定和取消按钮。类似于一个API整合了 html 中：alert、confirm。

```js
  uni.showModal({
    title: "删除",
    content: "注意：删除后不可恢复！",
    // showCancel: false,  //不显示【取消】按钮
    confirmColor: "red", //【确定】按钮颜色
    //editable: true, //配合 title 为：请输入xxx来校验删除
    // placeholderText: "请输入【确认删除】",
    success: function (res) {
      if (res.confirm) {
        console.log("用户点击确定");
        //console.log("用户点击确定:", res.content); // res.content 输入的内容
      } else if (res.cancel) {
        console.log("用户点击取消");
      }
    },
  });
```

![image-20260206115613147](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260206115614475.png)

### 3.9 showActionSheet 弹出菜单

[showActionSheet](https://uniapp.dcloud.net.cn/api/ui/prompt.html#showactionsheet)  从底部向上弹出操作菜单。

```js
  let list = ["选项A", "选项B", "选项C"];
  uni.showActionSheet({
    title: "请选择",
    // itemColor: "blue", //选项颜色
    itemList: list,
    success: function (res) {
      console.log(
        "选中了第" + (res.tapIndex + 1) + "个按钮: ",
        list[res.tapIndex]
      );
    },
    fail: function (res) {
      console.log("取消", res.errMsg);
    },
  });
```

![image-20260206115552150](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260206115553872.png)

### 3.10 动态设置导航条

[setNavigationBarTitle](https://uniapp.dcloud.net.cn/api/ui/navigationbar.html)  动态设置当前页面的标题。

```js
uni.hideHomeButton(); //用于非底部导航页面默认左上角的Home按钮 - 隐藏
uni.showNavigationBarLoading(); //在当前页面【显示】导航条加载动画。
setTimeout(() => {
  uni.setNavigationBarTitle({
    title: "详情页动态标题",
  });
  uni.hideNavigationBarLoading(); //在当前页面【隐藏】导航条加载动画。
}, 2000);
```

![image-20260206120057869](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260206120059265.png)

![image-20260206120334426](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260206120335688.png)

### 3.11 setTabBar 和 下拉刷新

[setTabBar](https://uniapp.dcloud.net.cn/api/ui/tabbar.html) 用于动态设置底部菜单。 - 用的极少。

setTabBarBadge - 为 tabBar 某一项的右上角添加文本。

showTabBarRedDot - 显示 tabBar 某一项的右上角的红点。

App.vue（需要在应用加载时就设置）

```js
<script setup>
onLaunch: () => {
  console.log("App Launch");
  uni.setTabBarBadge({
    index: 2,  //订单
    text: "3",
  });
  uni.showTabBarRedDot({
    index: 3,
    text: "3",
  });
};
</script>
```

![image-20260206121857747](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260206121859029.png)

```js
<script setup>
onShow(() => {
  console.log("User hide");
  uni.hideTabBarRedDot({  //进入我的后，隐藏红点
    index: 3,
  });
});
</script>
```

下拉刷新：

```js
uni.startPullDownRefresh();  //开启下拉刷新
setTimeout(() => {
  uni.stopPullDownRefresh();  //关闭下拉刷新（2s后）
}, 2000);
```



### 3.12 路由跳转

[页面和路由跳转](https://uniapp.dcloud.net.cn/api/router.html#navigateto)

* `uni.navigateTo` - 保留当前页面，跳转到应用内的某个页面，使用`uni.navigateBack`可以返回到原页面。
* `uni.navigateBack` - 关闭当前页面，返回上一页面或多级页面。可通过 `getCurrentPages()` 获取当前的页面栈，决定需要返回几层。
  * `uni.navigateBack({ delta: 2 });` 返回 2层，delta 固定参数名
* `uni.redirectTo` - 关闭当前页面，跳转到应用内的某个页面。
* `uni.reLaunch` - 关闭所有页面，打开到应用内的某个页面。
* `uni.switchTab` - 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。

```js
//在起始页面跳转到test.vue页面并传递参数
uni.navigateTo({
	url: 'test?id=1&name=uniapp'
});
```

```js
// 在test.vue页面接受参数
export default {
	onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
		console.log(option.id); //打印出上个页面传递的参数。
		console.log(option.name); //打印出上个页面传递的参数。
	}
}
```



### 3.13 数据缓存 StorageSync

[数据缓存](https://uniapp.dcloud.net.cn/api/storage/storage.html#setstoragesync) 默认存储在 localStorage 中。

* `uni.setStorageSync(key, data)` - 将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口。
* `const data = uni.getStorageSync(key)` - 从本地缓存中同步获取指定 key 对应的内容。
* `uni.removeStorageSync(key)` - 从本地缓存中同步移除指定 key。



## 4. 数据请求

### 4.1 uni.request

[uni.request](https://uniapp.dcloud.net.cn/api/request/request.html) 发起网络请求。

data 参数数据说明：

- 对于 `GET` 方法，会将数据转换为 query string。例如 `{ name: 'name', age: 18 }` 转换后的结果是 `name=name&age=18`。
- 对于 `POST` 方法且 `header['content-type']` 为 `application/json` 的数据，会进行 JSON 序列化。
- 对于 `POST` 方法且 `header['content-type']` 为 `application/x-www-form-urlencoded` 的数据，会将数据转换为 query string。

```js
//方式1
uni.request({
  url: "https://jsonplaceholder.typicode.com/posts?_limit=10",
  success: (res) => {
    console.log(res.data);
  },
});
```

```js
//方式2【推荐】
uni.request({
    url: "https://jsonplaceholder.typicode.com/posts?_limit=10",
  }).then((res) => {
    console.log(res.data);
  }).catch(err => {
    console.error(err)
  })
```

```js
// 方式3【推荐】 <button @click="handleRequest">获取数据</button>
const handleRequest = async () => {
  try {
    let res = await uni.request({
      url: "https://jsonplaceholder.typicode.com/posts?_limit=10",
    });
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
};
```

#### 完整示例

```js
// 发送请求
function network() {
  // uni.showLoading({
  //   title: "加载中",
  // });
  uni.showNavigationBarLoading();  //显示loading
  uni.request({  //请求
      url: "https://api.thecatapi.com/v1/images/search?limit=10",
      data: {
        size: 10,
      },
    }).then((res) => { //请求结果
      console.log(res);
      if (res.statusCode === 200) { //成功
        pets.value = res.data;
        console.log(pets.value);
      } else {                      //失败
        uni.showToast({
          title: res.errMsg,
          icon: "none",
          duration: 2000,
        });
      }
    }).catch((err) => { //请求异常
      consolog.err(err);
      uni.showToast({
        title: "服务器繁忙",
        icon: "none",
        duration: 2000,
      });
    }).finally(() => { //隐藏loading
      console.log("成功或失败都会执行");
      // uni.hideLoading();
      uni.hideNavigationBarLoading();
    });
}
```



















