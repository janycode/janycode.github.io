---
title: 01-wechat微信小程序基础
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



## 1. 环境准备

### 1.1 运行环境

| **运行环境**     | **逻辑层**     | **渲染层**       |
| :--------------- | :------------- | :--------------- |
| iOS              | JavaScriptCore | WKWebView        |
| 安卓             | V8             | chromium定制内核 |
| 小程序开发者工具 | NWJS           | Chrome WebView   |

![image-20260202110625791](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260202110627517.png)

### 1.2 官方小程序功能体验

可以查看到微信小程序所有的功能。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260202110734472.jpg)



### 1.3 开发流程

1. 注册小程序：https://mp.weixin.qq.com/cgi-bin/wx
2. 登陆小程序后台：https://mp.weixin.qq.com/
3. 拿到 `AppID(小程序ID)`：【**开发与服务**】-【**开发管理**】，eg: wx51c55a4653bba442
4. 安装开发者工具（稳定版）：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
5. **扫码**开发者工具登陆，**新建**小程序项目，选择**目录**(自动取最后一级目录作为项目名称-提前创建)，填写 **AppID**，不使用云服务，模版默认选择官方推荐第一个即可。
   - 默认 `JS Skyline 模板`是微信小程序的「新一代性能版模板」，在兼容原有开发体验的前提下，实现了渲染性能的跨越式提升，是目前微信小程序开发的**主流推荐选择**。
   - 本文示例以 `JS 基础模版` 为准。

![image-20260202112210691](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260202112212090.png)

6. 点击创建
7. 多人开发设置：【**管理**】-【**成员管理**】添加项目成员（多人开发）、体验成员（测试人员）
8. 预览、上传，小程序后台：【**管理**】-【**版本管理**】查看开发版本上传情况，按需 **选为体验版本** 或 **提交审核**（上线）

![image-20260202113121682](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260202113123168.png)

![image-20260202113517796](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260202113519562.png)

### 1.4 快捷键映射

打开微信开发者工具 → 菜单栏「设置」→「通用设置」→「快捷键」；或按 Ctrl + , 直接打开设置面板。

手动配置：以下是 IDEA 高频快捷键与微信开发者工具的命令映射，直接修改即可适配开发习惯，避免冲突。

|                   IDEA 常用快捷键                    |      功能描述       | 微信开发者工具命令 |                           修改方法                           |
| :--------------------------------------------------: | :-----------------: | :----------------: | :----------------------------------------------------------: |
|  Ctrl + Alt + L（Win）/ Command + Option + L（Mac）  |     格式化代码      |     格式化文档     | 搜索「格式化文档」→ 右键「更改键绑定」→ 按下对应组合键 → 回车确认 |
|                 Ctrl + D（Win/Mac）                  |       复制行        |       复制行       |     搜索「复制行」→ 更改键绑定为 Ctrl + D / Command + D      |
|      Alt + Enter（Win）/ Option + Enter（Mac）       | 触发意图 / 快速修复 |      触发建议      | 搜索「触发建议」→ 更改键绑定为 Alt + Enter / Option + Enter  |
|         Ctrl + /（Win）/ Command + /（Mac）          |      单行注释       | 添加 / 移除行注释  |      搜索「添加 / 移除行注释」→ 确认或修改为对应组合键       |
| Ctrl + Shift + /（Win）/ Command + Option + /（Mac） |       块注释        | 添加 / 移除块注释  |            搜索「添加 / 移除块注释」→ 更改键绑定             |

1. 搜索定位：在快捷键面板顶部搜索框输入命令关键词（如「格式化」「删除行」）快速找到目标。
2. 修改方式：选中命令 → 右键「更改键绑定」→ 按下组合键（如 Ctrl + Alt + L）→ 回车保存。
3. 冲突处理：若提示「已被占用」，可先修改冲突快捷键，或选择「添加额外键绑定」保留多组映射。



## 2. 全局配置 app.json

| 文件                                                         | 必需 | 作用             |
| :----------------------------------------------------------- | :--- | :--------------- |
| [app.js](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html) | 是   | 小程序逻辑       |
| [app.json](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html) | 是   | 小程序公共配置   |
| [app.wxss](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxss.html) | 否   | 小程序公共样式表 |

### 2.1 pages

官方文档：https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#pages

页面组成：①`.js`-逻辑 ②`.wxml`-结构 ③`.json`-配置 ④`.wxss`-样式

新建页面-方式1：pages/ 目录下，新建一个目录如 demo/ 目录，在 demo/ 目录下右键【`新建Page`】输入页面名字，不需要输入后缀，默认生成页面组成4个文件。

新建页面-方式2：在 app.json 的 `pages` 数组中添加 `"pages/页面名称/页面名称"` 即可自动创建页面并生成文件。`固定第 1 个是首页。`

```json
{
  "pages": [ //配置不同的页面，自动生成文件
    "pages/demo/demo",  //固定第1个是首页  
    "pages/home/home",
    "pages/order/order",
    "pages/center/center"
  ],
  ...
}
```

![image-20260202124900084](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260202124901107.png)

### 2.2 window

官方文档：https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#window

用于设置小程序的状态栏、导航条、标题、窗口背景色。

```json
{
  ...
  "window": {
    "navigationBarTextStyle": "white",           //导航栏标题、状态栏颜色，仅支持 black / white
    "navigationBarTitleText": "小布旅游助手",      //导航栏标题文字内容
    "navigationBarBackgroundColor": "#14c145",   //导航栏背景颜色
    "enablePullDownRefresh": true                //是否开启全局的下拉刷新（可剪贴到页面配置中，仅单页支持下拉刷新）
  },
  ...
}
```

![image-20260202124942244](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260202124943411.png)

### 2.3 tabbar

官方文档：https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#tabBar

如果小程序是一个多 tab 应用（客户端窗口的底部或顶部有 tab 栏可以切换页面），可以通过 tabBar 配置项指定 tab 栏的表现，以及 tab 切换时显示的对应页面。

```json
{
  ...
  "tabBar": {
    "selectedColor": "#f60",                           //tabbar 上的文字选中时的颜色，仅支持十六进制颜色
    "backgroundColor": "#fff",                         //tabbar 的背景色，仅支持十六进制颜色
    "borderStyle": "white",                            //tabbar 上边框的颜色， 仅支持 black / white
    "position": "bottom",                              //tabbar 位置：top | bottom
    "list": [                                          //一般配置 2-4 个，如图 4 个的效果
      {
        "pagePath": "pages/demo/demo",                  //页面路径，必须在 pages 中先定义
        "text": "测试",                                  //tab 上按钮文字
        "iconPath": "images/camera.png",                //图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px，不支持网络图片
        "selectedIconPath": "images/camera_light.png"   //选中时的图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px，不支持网络图片
      },
      ...
    ]
  },
  ...
}
```

![image-20260202125411320](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260202125412211.png)



## 3. 页面配置

官方文档：https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html

页面中配置项在当前页面会覆盖 `app.json` 中相同的配置项（样式相关的配置项属于 `app.json` 中的 `window` 属性，但这里不需要额外指定 `window` 字段）。

如 pages/home/home

```json
{
  "usingComponents": {},
  "navigationBarTitleText": "首页",    //具体导航页标题
  "enablePullDownRefresh": true       //去掉 app.json 中 window 中的 下拉刷新，下方到具体的页面支持
}
```



## 4. 基础语法

### 4.1 标签

#### `<view>`

- **定位**：通用**块级布局容器**，类比 Web 中的 `<div>`，是小程序布局的「基础骨架」。
- **底层**：渲染层基于原生视图容器实现，无文本专属优化，主要负责承载其他标签（`<view>`/`<text>`/`<image>` 等）、实现页面结构布局。
- **核心作用**：划分页面区域、实现 Flex/Grid 布局、承载非文本内容，是布局的核心载体。

#### `<text>`

- **定位**：专属**行内文本标签**，类比 Web 中的 `<span>`（但比 `<span>` 有更多文本专属能力）。
- **底层**：渲染层基于原生文本控件实现，做了文本渲染、选中文本、复制文本等专属优化，仅用于包裹`纯文本`内容；
- **核心作用**：渲染页面中的文字、实现文本的专属交互（选中、复制），是文本展示的「唯一标准标签」。

> `<view>` 是通用块级容器，主打布局承载；`<text>` 是专属行内文本标签，主打文本渲染与交互。

demo.wxml

```xml
<!--pages/demo/demo.wxml-->
<!-- 文本标签 -->
<text>{{ 10+20 }}</text>
<!-- 布局容器 -->
<view>{{ 10>20 ? 'aaa' : 'bbb' }}</view>
```



### 4.2 数据绑定

官方文档：https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/data.html

demo.wxml

```xml
<view>{{myname}}</view>
<view id="my-{{ids[0]}}">动态id-{{ids[0]}}</view>
<view id="my-{{ids[1]}}">动态id-{{ids[1]}}</view>
<view id="my-{{ids[2]}}">动态id-{{ids[2]}}</view>
```

demo.js

```js
// 注册页面的方法
Page({
  /**
   * 页面的初始数据
   */
  data: {
    myname: "Jerry",  //定义变量，页面上可以 {{myname}} 使用
    ids: ["aaa", "bbb", "ccc"]  //定义数组变量
  },
  ...
})
```

![image-20260202170450838](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260202170452155.png)



### 4.3 列表渲染 wx:for, wx:key

官方文档：https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/list.html

**wx:for** 在组件上使用 `wx:for` 控制属性绑定一个数组，即可使用数组中各项的数据重复渲染该组件。默认数组的当前项的下标变量名默认为 `index`，数组当前项的变量名默认为 `item`。

**wx:key** 如果列表中项目的位置会动态改变或者有新的项目添加到列表中，并且希望列表中的项目保持自己的特征和状态（如 [input](https://developers.weixin.qq.com/miniprogram/dev/component/input.html) 中的输入内容，[switch](https://developers.weixin.qq.com/miniprogram/dev/component/switch.html) 的选中状态），需要使用 `wx:key` 来指定列表中项目的**唯一**的标识符。

demo.wxml

```xml
<!-- wx:for 循环, wx:key 必须添加 -->
<view wx:for="{{list}}" wx:key="index">
  {{index}} : {{item}}
</view>
<!-- wx:for 循环，自定义 item 和 index 名称 -->
<view wx:for="{{list}}" wx:for-item="a_item" wx:for-index="a_index" wx:key="a_index">
  {{a_index}} - {{a_item}}
</view>
```

demo.js

```js
Page({
  data: {
    list: ["jerry", "tom", "spike"]
  },
  ...
})
```



### 4.4 条件渲染 wx:if

官方文档：https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/conditional.html

#### wx:if

**wx:if** 使用 `wx:if` 来判断是否需要渲染该代码块。

也可以用 `wx:elif` 和 `wx:else` 来添加一个 else 块

demo.wxml

```xml
<view wx:if="{{isCreated}}">动态创建和删除</view>

<view wx:if="{{length > 5}}"> 1 </view>
<view wx:elif="{{length > 2}}"> 2 </view>
<view wx:else> 3 </view>
```

demo.js

```js
Page({
  data: {
    isCreated: true,
    length: 4,
  },
  ...
})
```



#### hidden

hidden 会`创建出节点`，在 hidden="false" 的时候，设置 DOM 节点为 `display: none` 以隐藏，反之则显示。

```xml
<view hidden="{{isHidden}}">动态隐藏和显示</view>
```

```js
Page({
  data: {
    isHidden: false
  },
  ...
})
```



### 4.5 事件绑定

官方文档：https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html

```xml
<!-- bindtap 与 catchtap -->
<button type="primary" bindtap="handleTap">click1</button>
<view id="outer" bindtap="handleTap1">
  outer view
  <view id="middle" catchtap="handleTap2">
    middle view - 阻止冒泡，只会触发自己的事件
    <view id="inner" bindtap="handleTap3">
      inner view - 会冒泡到上一层，会触发 handleTap2和3
    </view>
  </view>
</view>
```

```js
Page({
  handleTap() {
    console.log("click", this.data.myname);
    this.setData({
      myname: "tom",
      isCreated: !this.data.isCreated
    })
  },
  handleTap1() {
    console.log("handleTap1");
  },
  handleTap2() {
    console.log("handleTap2");
  },
  handleTap3() {
    console.log("handleTap3");
  },
})
```



### 案例：todolist

* `bindinput="func"` 绑定输入事件方法，通过 `evt.detail.value` 拿到输入值
* `value="{{xxx}}"` 绑定 input 输入框中的值，以按需置空
* `data-x="{{v}}"`  事件**传参**方式使用 `data-` 拼接自定义变量名，该参数名`纯小写`
* `evt.target.dataset.x` 事件**接参**方式

```xml
<!--pages/1-todolist/1-todolist.wxml-->
<view class="box">
  <!-- bindinput 输入事件获取输入内容: https://developers.weixin.qq.com/miniprogram/dev/component/input.html -->
  <!-- value : 绑定输入内容 -->
  <input type="text" bindinput="handleInput" value="{{mytext}}" />
  <button type="primary" size="mini" bindtap="handleTapAdd">添加</button>
</view>

<view wx:for="{{datalist}}" wx:key="index" class="list">
  <text>{{item}}</text>
  <!-- 事件传参 data-x="{{v}}" -->
  <button type="warn" size="mini" bind:tap="handleDelete" data-myid="{{index}}">删除</button>
</view>

<view wx:if="{{datalist.length === 0}}">暂无待办事项</view>
```

```css
/* pages/1-todolist/1-todolist.wxss */
.box {
  display: flex;
}
input {
  border: 1px solid gray;
  height: 30px;
  line-height: 30px;
  border-radius: 30px;
  padding-left: 10px;
  flex: 1;
}
.list {
  display: flex;
  flex-direction: row;
}
.list text{
  width: 300px;
}
```

```js
// pages/1-todolist/1-todolist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mytext: "",
    datalist: ["aaa", "bbb", "ccc"],
  },

  handleInput(evt) {
    //evt.detail.value 拿到输入框的值
    //console.log("input:", evt.detail.value);
    this.setData({
      mytext: evt.detail.value
    })
  },

  handleTapAdd() {
    console.log(this.data.mytext);
    this.setData({
      datalist: [...this.data.datalist, this.data.mytext],
      mytext: "",
    })
  },
  // 接收参数方式：evt.target.dataset.x
  handleDelete(evt) {
    console.log("delete:", evt.target.dataset.myid);
    this.data.datalist.splice(evt.target.dataset.myid, 1)
    this.setData({
      datalist: this.data.datalist
    })
  },
  ...
})
```

![image-20260202182134064](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260202182135613.png)

### 案例：高亮切换

* `evt.currentTarget.dataset.x` 拿到绑定事件的事件源，即接参，可用于高亮或其他

```xml
<!--pages/2-heightlight/2-heightlight.wxml-->
<view class="box">
  <!-- 点击的索引等于当前元素，则高亮 -->
  <view wx:for="{{datalist}}" wx:key="index" class="item {{ current === index ? 'active' : ''}}" bindtap="handleTap" data-currentid="{{index}}">
    <!-- 未包裹 <text> 时，通过 evt.target.dataset.x 接参 -->
    <!-- {{item}} -->
    <!-- 包裹 <text> 时，通过 evt.currentTarget.dataset.x 接参 -->
    <text>{{item}}</text>
  </view>
</view>
```

```css
/* pages/2-heightlight/2-heightlight.wxss */
.box {
  display: flex;
  flex-direction: row;
}
.box .item{
  flex: 1;
  text-align: center;
}
.active {
  color: red;
}
```

```js
// pages/2-heightlight/2-heightlight.js
Page({
  data: {
    datalist: ['衣服', '裤子', '鞋帽', '手套'],
    current: 0
  },
  handleTap(evt) {
    // 未包裹 <text>
    //console.log(evt.target.dataset.currentid);
    // 包裹 <text>，拿到绑定事件的事件源
    console.log(evt.currentTarget.dataset.currentid);
    this.setData({
      current: evt.currentTarget.dataset.currentid
    })
  },
  ...
})
```



## 5. wxss 样式

官方文档：https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxss.html

定义在 app.wxss 中的样式为**全局样式**，作用于每一个页面。在 page 的 wxss 文件中定义的样式为局部样式，只作用在对应的页面，并会覆盖 app.wxss 中相同的选择器。

**建议：** 开发微信小程序时设计师可以用 `iPhone6` 作为视觉稿的标准。

- rpx（responsive pixel）: 可以根据屏幕宽度进行自适应。`1rpx = 0.5px = 1物理像素`。

> 即按照量取的像素值，1:1 设置 rpx 值。

```xml
<view class="box"></view>
```

```css
/* 官方建议：以 iPhone6 为准 */
.box{
  width: 750rpx;  /* 以 iPhone6 为基准，rpx 单位，等比缩放适配所有机型 */
  height: 400rpx;
  background-color: yellow;
}
```



## 6. wxs 语法

官方文档：https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxs/

语法文档：https://developers.weixin.qq.com/miniprogram/dev/reference/wxs/

```xml
<!--pages/4-wxs/4-wxs.wxml-->
<!-- 引入定义的 wxs 脚本方法 -->
<wxs src="./date.wxs" module="handleDate"/>
<!-- 调用方法，传参，并执行方法 -->
<text>{{handleDate(startTime)}}</text>
```

```js
  data: {
    startTime: 1664229867258,
  },
```

```js
<!--pages/4-wxs/date.wxs-->
function handleDate(time) {
  console.log(time);
  var date = getDate(time)
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
}

module.exports = handleDate
```

案例：

```xml
<wxs src="./goodFilter.wxs" module="goodFilter"/>
<view>
  <input bindinput="handleInput" value="{{mytext}}" />
  <view wx:for="{{goodFilter(goodsList, mytext)}}" wx:key="index">
    {{item}}
  </view>
</view>
```

```js
  data: {
    goodsList: ["aaa", "bbb", "ccc", "abc", "acc", "bcc", "abb", "cbb"],
    mytext: ""
  },
```

```js
<!--pages/4-wxs/goodFilter.wxs-->
function goodFilter(list, text) {
  // 不能使用 => 箭头函数，只能显式的写函数
  return list.filter(function(item) {
    return item.indexOf(text) > -1
  })
}

module.exports = goodFilter
```



## 7. 数据请求

### 7.1 前提条件

> 请求报错：https://xxx.com 不在以下 request 合法域名列表中，请参考文档：https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html
>
> 方式一：`用于开发`
>
> 配置位置：在微信开发工具中【本地设置】-【`☑`不校验合法域名、web-view、TLS版本以及HTTPS证书】打开，但`上线时记得关掉`。
>
> 只能在微信开发工具中看到，无法手机预览 和 上线查看到。
>
> ![image-20260202201051152](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260202201052479.png)
>
> ![image-20260202201204851](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260202201206233.png)
>
> 方式二：`用于上线`
>
> 配置位置：服务器域名请在 「小程序后台-【开发与服务】-【开发设置】-【服务器域名】」 中进行配置 安全域名。
>
> 配置生效：检查项目配置中的合法域名、并重新编译项目。
>
> ![image-20260202193018479](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260202193019882.png)



### 7.2 wx.request({ })

* `wx.request({...})` 微信小程序中的请求方式，没有跨域限制，但需要配置**安全域名**。

```xml
<!--pages/5-request/5-request.wxml-->
<button type="primary" bindtap="handleAjax">ajax</button>

<view wx:for="{{datalist}}" wx:key="id">
{{item.nm}}
</view>
```

```js
// pages/5-request/5-request.js
Page({
  data: {
    datalist: []
  },
  //请求数据：没有跨域限制，但需要配置安全域名
  handleAjax() {
    wx.request({
      url: 'https://m.maoyan.com/ajax/movieOnInfoList',
      method: 'get',
      data: {},
      success: (res) => {
        console.log("success:", res.data.movieList);
        this.setData({
          datalist: res.data.movieList
        })
      },
      fail: () => {
        console.log("fail");
      }
    })
  },
  ...
})
```

![image-20260202194941693](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260202194943007.png)

## 8. 组件

### 8.1 image

官方文档：https://developers.weixin.qq.com/miniprogram/dev/component/image.html

`image` 标签组件，主要是 mode 属性。

```xml
<!--pages/5-request/5-request.wxml-->
<button type="primary" bindtap="handleAjax">ajax</button>
<view wx:for="{{datalist}}" wx:key="id" class="list">
  <!-- 如 widthFix：缩放模式，宽度不变，高度自动变化，保持原图宽高比不变 -->
  <image src='{{item.img}}' mode="widthFix"/>
  <view>{{item.nm}}</view>
</view>
```

```css
/* pages/5-request/5-request.wxss */
.list {
  display: flex;
  flex-direction: row;
  margin: 20rpx;
}
.list image{
  width: 200rpx;
}
.list view{
  flex: 1;
  margin-left: 10px;
}
```

```js
// pages/5-request/5-request.js
Page({
  data: {
    datalist: []
  },
  //请求数据：没有跨域限制，但需要配置安全域名
  handleAjax() {
    wx.request({
      url: 'https://m.maoyan.com/ajax/movieOnInfoList',
      method: 'get',
      data: {},
      success: (res) => {
        console.log("success:", res.data.movieList);
        this.setData({
          datalist: res.data.movieList
        })
      },
      fail: () => {
        console.log("fail");
      }
    })
  },
  ...
})
```

![image-20260202200605637](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260202200607104.png)

### 8.2 swiper

官方文档：https://developers.weixin.qq.com/miniprogram/dev/component/swiper.html

`swiper` 滑块视图容器(轮播图)。其中只可放置[swiper-item](https://developers.weixin.qq.com/miniprogram/dev/component/swiper-item.html)组件，否则会导致未定义的行为。

> ![image-20260202202624168](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260202202625698.png)
>
> swiper 组件会有默认的 `150px 固定高度`，需要单独给 swiper 进行高度 rpx 值。
>
> ```css
> swiper {
>   height: 480rpx; /* 图片实际高度(240px) * 2 的 rpx 值 */
> }
> ```

```xml
<!--pages/7-swiper/7-swiper.wxml-->
<button type="primary" bindtap="handleTap">ajax-swiper</button>
<swiper indicator-dots="{{true}}" circular="{{true}}" autoplay="{{true}}" interval="{{2000}}">
  <swiper-item wx:for="{{datalist}}" wx:key="index">
    <image src="{{item.banner_pic}}" mode="widthFix" style="width:100%" ></image>
  </swiper-item>
</swiper>
```

```css
/* pages/7-swiper/7-swiper.wxss */
swiper {
  height: 480rpx; /* 图片实际高度(240px) * 2 的 rpx 值 */
}
```

```js
// pages/7-swiper/7-swiper.js
Page({
  data: {
    datalist: []
  },
  handleTap() {
    wx.request({
      url: 'https://gw.juooo.com/gw/main/pageConfig?version=6.3.11&referer=2',
      method: 'post',
      success: (res) => {
        console.log(res.data.data.result.banner_list.home_banner);
        this.setData({
          datalist: res.data.data.result.banner_list.home_banner 
        })
      }
    })
  },
  ...
})
```

![image-20260202203045142](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260202203046342.png)

### 8.3 scroll-view

官方文档：https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html

`scroll-view` 可滚动视图区域。使用竖向滚动时，需要给[scroll-view](https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html)一个固定高度，通过 WXSS 设置 height。组件属性的长度单位默认为px，[2.4.0](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)起支持传入单位(rpx/px)。

* 可以实现非页面级别的 **下拉刷新** 。

```xml
<!--pages/8-scrollview/8-scrollview.wxml-->
<view>水平方向</view>
<scroll-view class="box_shuiping" enable-flex="{{true}}" scroll-x="{{true}}" bindscrolltolower="handleScrollToRight">
  <view class="item_shuiping">aaaa</view>
  <view class="item_shuiping">bbbb</view>
  <view class="item_shuiping">cccc</view>
</scroll-view>

<view>垂直方向</view>
<!-- scroll-view 示例 -->
<scroll-view class="box" scroll-y="{{true}}" bindscrolltolower="handleScrollToLower" 	refresher-enabled="{{true}}" bindrefresherrefresh="handleRefresh" refresher-triggered="{{isRefresh}}">
  <view class="item">1111</view>
  <view class="item">2222</view>
  <view class="item">3333</view>
</scroll-view>
```

```css
/* pages/8-scrollview/8-scrollview.wxss */
.box{
  height: 300rpx;
}
.item{
  height: 300rpx;
  background-color: yellow;
}

.box_shuiping{
  height: 200px;
  width: 100vw;
  display: flex;
  flex-direction: row;
}
.box_shuiping .item_shuiping {
  width: 300px;
  background-color: blue;
  flex-shrink: 0; /* 伸缩属性设置为 0 - 配合水平滑动 */
}
```

```js
// pages/8-scrollview/8-scrollview.js
Page({
  data: {
    isRefresh: false
  },
  handleScrollToLower() {
    console.log("到底了...");
  },
  handleScrollToRight() {
    console.log("到右边了...");
  },
  handleRefresh() {
    console.log("容器级别下拉刷新");
    setTimeout(() => {
      this.setData({
        isRefresh: false //停止下拉刷新
      })
    }, 1000)
  },
  ...
})
```



### 8.4 其他组件





### 8.5 自定义组件

#### 自定义组件



#### 父传子



#### 子传父



#### slot 插槽



#### 生命周期-自定义组件



## 9. 页面生命周期





