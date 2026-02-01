---
title: 02-全栈项目搭建-React
date: 2023-9-28 21:36:21
tags:
- React
- antd
- 全栈
categories: 
- 17_项目设计
- 04_全栈项目设计
---



参考资料：

* 全栈项目-前端代码工程：https://github.com/janycode/react-news-manage-system-demo
* 全栈项目-后端模拟数据：https://rtool.cn/jsonserver/docs/introduction
  * https://github.com/janycode/react-news-manage-system-demo/blob/main/db/db.json




> 技术栈：
>
> 前端：React19 + Antd6
>
> 后端：json-server 模拟后端数据
>
> 功能：**基于 React 实现的 CMS 文章发布系统、包含一整套用户管理、权限管理、登录校验、审核管理、发布管理等功能，项目搭建快速起步架子**。
>
> 一页效果：
>
> ![image-20260201183028400](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260201183032066.png)


## 项目搭建

实现步骤：https://github.com/janycode/react-news-manage-system-demo/commits/main/

1. `npx create-react-app myapp` [创建项目](https://github.com/janycode/react-news-manage-system-demo/commit/493ac996adaa5808c4a9424edd49e8fd7a0f0d72)
2. 修改 index.js 去掉严格模式，reportWebVitals
3. 修改 App.js 为自己的 App
4. 安装 `sass` 支持 .scss 样式文件（局部样式 xxx.module.scss）
5. 配置[反向代理](https://github.com/janycode/react-news-manage-system-demo/commit/a2814c876c38d2289c6f421565ebb3f6f8a2af0d)，安装 `http-proxy-middleware`，然后在 src 下创建 [setupProxy.js](https://github.com/janycode/react-news-manage-system-demo/commit/a2814c876c38d2289c6f421565ebb3f6f8a2af0d#diff-cefe8c57f73f1f3dedcc5c99e7b12f0d69e11f1a102150a924581b57881dabcc)，拷贝配置并修改
6. 安装 `axios` 验证 反向代理，如使用猫眼电影的接口验证
7. 提前画路由架构图，路径对应组件，下载 `react-router-dom@6` 根据情况选择 v5还是v6 版本，推荐 v6 更易配置，[配置路由、创建空组件](https://github.com/janycode/react-news-manage-system-demo/commit/c59e803921c76cdda19ae8e12636ed1ff6c8fef0)
   ![路由架构图](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260129185242768.png)
8. [搭建具体的路由](https://github.com/janycode/react-news-manage-system-demo/commit/6b23b1681f3583d33363ec78f7047d10fd37495b)
9. 引入 `antd` 针对PC端的框架，v5+版本已经不需要引入样式文件了
10. 配置 `Layout` 组件，规划[首页结构](https://github.com/janycode/react-news-manage-system-demo/commit/ca34eced44f11418c1b3af2d73f46167437836d1)根据需求使用 Layout，包含自定义的 SideMenu、TopHeader、Content中的路由切换等
11. 自定义的 [TopHeader](https://github.com/janycode/react-news-manage-system-demo/commit/30b037243ac99fe78df75c4a3d938ff1048ca23c) 组件中引入 antd 的 头像、下拉框 组件
12. 安装 `json-server` 模拟数据请求 等同于 后端准备数据（JSON 字符串可转为 Java 实体类 或 sql 建表语句，再生成后端三层结构代码——参考其他[我的博文](https://yuancodes.github.io/#/./00_%E5%85%88%E5%88%A9%E5%85%B6%E5%99%A8/01_Intellij%20IDEA/10-IDEA-%E5%9F%BA%E4%BA%8ESpringBoot%E7%9A%84%E9%AB%98%E6%95%88%E5%BC%80%E5%8F%91%E6%96%B9%E5%BC%8F)即可生成）

    1. *json-server --watch .\db\test.json --port 5000*

    2. 新版 [json-server](https://rtool.cn/jsonserver/docs/introduction) 中的连表查询的 外键字段 只能为**字符串**，否则影响 连表查询 功能
13. 完善 [侧边栏 Sidebar](https://github.com/janycode/react-news-manage-system-demo/commit/6e3a872781b81b8910b294a456ac384308ef3b53) 功能
    - 添加json假数据模拟后端返回数据，[菜单图标映射递归赋值](https://github.com/janycode/react-news-manage-system-demo/commit/4dad41ca8241d56fb97573fd7e95098eab9f7af5)同时剔除DOM无用字段
    - 首页菜单是默认进入，且没有二级，[剔除首页的children](https://github.com/janycode/react-news-manage-system-demo/commit/203e808b48c662660f6dd32c11c114f7d503c38e)
    - 添加侧边栏[全局滚动条样式](https://github.com/janycode/react-news-manage-system-demo/commit/6a144e5d0ba1808c48024c75b7b66419f22da8f1)、Logo和标题显示样式
    - 侧边栏[高亮处理、默认和点击展开处理](https://github.com/janycode/react-news-manage-system-demo/commit/6f58682d85a84e3315da63269cc1e9a7089d76e2)、重定向到首页时首页高亮处理

14. 权限控制的数据流程图
    ![权限控制的数据流程图](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260129185156792.png)



## 业务实现

1. 完善[权限列表](https://github.com/janycode/react-news-manage-system-demo/commit/07a49bacddf0f6c37f203959c42b43951f281ae5)页功能：Table 组件、树形展示、[权限控制开关](https://github.com/janycode/react-news-manage-system-demo/commit/66944e6ee3b9f3ff2d002540d73bd03a02f26ea8)、删除等
2. 完善[角色列表](https://github.com/janycode/react-news-manage-system-demo/commit/ccc56b7985857691e91dd07b21e9e92336128190)页功能：完善Table组 件展示、删除弹窗和删除数据、编辑弹窗Tree树形结构、属性结构勾选和编辑数据生效后端
3. 完善[用户列表](https://github.com/janycode/react-news-manage-system-demo/commit/0f7881b1b3b8d511a19f4c69aafd30785a742333)页功能：Form子组件封装复用与新增和编辑、数据的增删改查、表头筛选支持、国家化i18n配置
4. 完善[登陆退出](https://github.com/janycode/react-news-manage-system-demo/commit/8e55b351195547b0a546a71fb0e5b536a8cfc627)的功能：登陆功能、粒子背景效果、用户信息结构、用户登陆菜单权限、用户列表数据权限、跳转等

   * 引入[粒子效果](https://github.com/tsparticles/react/#readme)，安装 `yarn add @tsparticles/react @tsparticles/slim`，按照[文档demo](https://github.com/tsparticles/react/#readme)使用即可，

     1. 适配 react19 和 antd6 的粒子效果：https://github.com/tsparticles/react/#readme

     2. particles 粒子库官网（更换其他特效）：https://particles.js.org/

5. 完善[路由权限](https://github.com/janycode/react-news-manage-system-demo/commit/da15c6046415eedb428ba4a28e6594ac50c4df03)的功能：动态路由渲染、本地路由映射与路由权限校验、安装`nprogress`库用于侧边栏路由加载展示进度条、封装 axios 基地址

6. 完善[撰写新闻](https://github.com/janycode/react-news-manage-system-demo/commit/14a345b93f76a8bf32690c22cffcc66e25eb094f)页功能：优化 Form表单中异步请求后设置默认值问题、安装[react-draft-wysiwyg](https://github.com/jpuri/react-draft-wysiwyg)引入富文本编辑器并封装、引入 Steps 步骤条组件
   - 引入富文本编辑器，安装 `yarn add react-draft-wysiwyg draft-js draftjs-to-html html-to-draftjs`


7. 完善[草稿箱](https://github.com/janycode/react-news-manage-system-demo/commit/9fda3b5f3e5fa778ccc590fdb1982a06bb9e21ab)页功能：列表、删除、提交审核、预览(Descriptions 描述列表组件)、编辑（回显富文本）、引入时间格式化和时区扩展
   - 安装 `yarn add moment moment-timezone`

8. 完善[我的新闻](https://github.com/janycode/react-news-manage-system-demo/commit/f6d619a5915bd0a291b0693780a99a467a7846c0)页功能：列表、撤销、更新、发布功能 （或者叫**审核列表**）
9. 完善[审核新闻](https://github.com/janycode/react-news-manage-system-demo/commit/e4f2d80808e4771a0c2d31b642e6a0c276f41530)页功能：列表、通过、驳回功能
10. 完善[新闻分类](https://github.com/janycode/react-news-manage-system-demo/commit/b8e49f5cf3d8b39267d9b11eff7d7ac9a4282c92)页功能：可编辑单元格（4个步骤）、列表、删除
11. 完善[发布管理](https://github.com/janycode/react-news-manage-system-demo/commit/9c852ce26585b56252c0074303e077db0fe9d2e3)页功能：待发布&已发布&已下线 三个页面复用组件封装、自定义hooks、操作按钮功能、优化内容区域滚动条展示



## 状态管理

1. [侧边栏折叠](https://github.com/janycode/react-news-manage-system-demo/commit/e824208d52ac35623c84fd62fdc631ee1e5b0ed8)功能：引入 [redux](https://redux.js.org/) 实现顶部折叠按钮控制侧边栏折叠，通过 redux 公共状态管理的属性
   - 安装 `yarn add redux react-redux` 需重启项目

2. [全局 Loading](https://github.com/janycode/react-news-manage-system-demo/commit/71aac7acb37978b7a525e78f615d6cb7661f8743)：利用 [redux](https://redux.js.org/) 状态管理控制全局 axios 请求的加载中样式
3. [侧边栏折叠持久化](https://github.com/janycode/react-news-manage-system-demo/commit/56348d7376e85f31919609125b05e959e05b7eec)：利用 [redux-persist](https://github.com/rt2zz/redux-persist) 持久化处理，刷新不改变折叠状态，支持 redux浏览器插件配置
   - 安装 `yarn add redux-persist`



## 排版和数据图

1. 首页[栅格布局](https://github.com/janycode/react-news-manage-system-demo/commit/20b52fc31cd9513065d850dfdfe6d08089ba2a04)：Card 组件布局和展示、List 组件、排序处理
2. 首页[数据可视化](https://github.com/janycode/react-news-manage-system-demo/commit/dea5958c1dff82b3ee5a96adefcd4d100b00c3e7)：引入 [echarts](https://echarts.apache.org/zh/index.html) 组件实现可视化**柱状图** 和 饼状图、引入高性能 JS 处理库 lodash 做运算、处理异步渲染DOM
   - 安装 `yarn add echarts`



## 前台用户端

1. 简易[用户端列表页和详情页](https://github.com/janycode/react-news-manage-system-demo/commit/8d359c16a82d7fb4b5e4d62c324802b53a9d7e84)(复用预览页)：列表页 Card 组件遍历、数据清洗为二维数组、详情页浏览量和点赞量数据交互
   - `let list = Object.entries(_.groupBy(list, item => item.category.title))` 按照分类标题分组并转为二维数组 - 更利于遍历



二维数组结构：

![image-20260201201153222](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260201201154617.png)

展开第一个元素：

![image-20260201201213734](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260201201214936.png)

















