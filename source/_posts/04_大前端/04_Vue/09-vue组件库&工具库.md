---
title: 09-vue组件库&工具库
date: 2018-5-22 21:36:21
tags:
- Vue
- elementUI
- vant
categories: 
- 04_大前端
- 04_Vue
---

![image-20200723170734421](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200723170735.png)



## 1. 组件库

集合来自社区贡献的数以千计的插件和库：https://github.com/vuejs/awesome-vue#components--libraries

### 1.1 elementUI - PC端后台

`elementUI`，饿了么UED团队退出的 vue 前端框架，主要用于PC端（**偏后台系统**）。

官网：https://element.eleme.cn/

源码：https://github.com/ElemeFE/element



#### 1.1.1 安装×2

* 从0开始可以通过如下命令

```bash
vue create my-app
cd my-app
vue add element
```

* 项目已经写了，通过如下命令安装

```bash
# Vue 3 项目，安装 plus 版：
npm i element-plus -S

# Vue 2 项目，安装兼容版本，如2.9.2：
npm i element-ui@2.9.2 -S
```

> 默认安装的是最新版，如果需要安装指定版本使用如下命令：
>
> ```bash
> npm uninstall element-ui -f
> npm i element-ui@版本号 -f
> ```



#### 1.1.2 引入

```js
import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);
```

测试：

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="日期" width="180"> </el-table-column>
    <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
    <el-table-column prop="address" label="地址"> </el-table-column>
  {{msg}}
  </el-table>
</template>

<script>
import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);

export default {
  data() {
    return {
      msg: 'hello,table',
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
    };
  },
};
</script>

<style></style>

```

启动项目，验证发现 element-ui的 el-table 不显示，最终发现是依赖版本过高的问题。

解决方案：

```bash
npm uninstall element-ui -f
npm i element-ui@2.9.2 -f
```

重启项目，验证OK。



#### 1.1.3 使用

```vue
<template>
  <el-container style="height: 100%;">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '2']">
        <el-submenu v-for="data in sideList" :key="data.id" :index="data.id+''" >
          <template slot="title">
            <i class="el-icon-message"></i>
            {{data.title}}
            </template>
            <el-menu-item v-for="item in data.children" :key="item.id" :index="item.id+''">
              {{item.title}}
            </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
            <el-dropdown-item>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>{{myname}}</span>
      </el-header>

      <el-main>
        <el-table :data="tableData">
          <el-table-column prop="date" label="日期" width="140">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="120">
          </el-table-column>
          <el-table-column prop="address" label="地址"> </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Vue from "vue";

Vue.use(ElementUI);

export default {
  data() {
    const item = {
      date: "2016-05-02",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄",
    };
    return {
      myname: 'Jerry',
      sideList: [
        {
          id: 1,
          title: '用户管理',
          children: [
            {
              id: 11,
              title: '用户列表'
            },
            {
              id: 12,
              title: '用户权限'
            },
          ]
        },
        {
          id: 2,
          title: '权限管理',
          children: [
            {
              id: 21,
              title: '权限列表'
            },
            {
              id: 22,
              title: '角色列表'
            },
          ]
        }
      ],
      tableData: Array(10).fill(item),
    };
  },
};
</script>

<style lang="scss" scoped>
*{
  margin: 0;
}
html,body{
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>

```

效果：

![image-20251226105300321](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251226105303798.png)





### 1.2 vant - 移动端

`vant`，有赞技术团队退出的 vue 前端框架，主要用于移动端。

官网：https://vant-ui.github.io/vant/#/zh-CN

源码：https://github.com/youzan/vant

#### 1.2.1 安装

现有项目中使用，通过如下命令安装

```bash
# Vue 3 项目，安装最新版 Vant：
npm i vant -S

# Vue 2 项目，安装 Vant 2，如果有报错使用 -f 强制安装（如2.13.9）：
npm i vant@latest-v2 -S
```



#### 1.2.2 引入

```js
import Vue from 'vue';
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);
```



#### 1.2.3 使用

如 `NavBar 导航栏`（使用插槽自定义两侧内容） + `Icon 图标`（基础图标）

```vue
<template>
  <div>
    <van-nav-bar title="影院" @click-left="onClickLeft" @click-right="onClickRight" ref="navbar">
      <template #left>
        深圳
        <van-icon name="arrow-down" />
      </template>
      <template #right>
        <van-icon name="search" size="22" color="black" />
      </template>
    </van-nav-bar>
    ...
  </div>
</template>

<script>
...
import { Toast } from 'vant';

export default {
  ...data...
  mounted() {
    // 动态计算高度: 视口高度 - 底部选项卡高度, 注意一定要加单位 'px'
    this.height =
      document.documentElement.clientHeight -
      this.$refs.navbar.$el.offsetHeight -            //还需要减去顶部的高度
      document.querySelector("footer").offsetHeight +
      "px";
  },
  methods: {
    onClickLeft() {
      Toast("返回");
    },
    onClickRight() {
      Toast("搜索");
    },
  },
};
</script>
```

效果：

![image-20251226112537788](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251226112539161.png)





## 2. 工具库

### 2.1 axios - 请求库

axios 基于 Promise 的网络请求库，官网: https://www.axios-http.cn/ 

*npm i axios*

### 2.2 swiper - 轮播库

swiper 各种轮播样式库，官网: https://swiper.com.cn/

*npm i swiper*

### 2.3 moment - 时间库

moment 时间处理库，官网: https://momentjs.cn/

*npm i moment*

### 2.4 better-scroll - 流畅滚动库

better-scroll 更好的滚动库, 官网：https://better-scroll.github.io/docs/zh-CN/

*npm i better-scroll*



















