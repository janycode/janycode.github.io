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

* 案例源码：https://github.com/janycode/react-news-manage-system-demo



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
> 


## 项目搭建

实现步骤：https://github.com/janycode/react-news-manage-system-demo/commits/main/

1. `npx create-react-app myapp` 创建项目
2. 修改 index.js 去掉严格模式，reportWebVitals
3. 修改 App.js 为自己的 App
4. 安装 `sass` 支持 .scss 样式文件（局部样式 xxx.module.scss）
5. 配置反向代理，安装 `http-proxy-middleware`，然后在 src 下创建 setupProxy.js，拷贝配置并修改
6. 安装 `axios` 验证 反向代理，如使用猫眼电影的接口验证
7. 提前画路由架构图，路径对应组件，下载 `react-router-dom@6` 根据情况选择 v5还是v6 版本，推荐 v6 更易配置，配置路由、创建空组件
   ![路由架构图](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260129185242768.png)
8. 搭建具体的路由
9. 引入 `antd` 针对PC端的框架，v5+版本已经不需要引入样式文件了
10. 配置 `Layout` 组件，规划首页结构情况去使用 Layout，包含自定义的 SideMenu、TopHeader、Content中的路由切换等
11. 自定义的 TopHeader 组件中引入 antd 的 头像、下拉框 组件
12. 安装 json-server 模拟数据请求 等同于 后端准备数据（JSON 字符串可转为 Java 实体类 或 sql 建表语句，再生成后端三层结构代码——参考其他[我的博文](https://yuancodes.github.io/)即可生成）

    1. *json-server --watch .\db\test.json --port 8000*

    2. 新版 json-server 中的主键 id 只能为字符串，否则影响 删改 功能
13. 完善**侧边栏 Sidebar** 功能
14. 权限控制的数据流程图
    ![权限控制的数据流程图](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260129185156792.png)



## 业务实现

1. 完善**权限列表**页功能：Table 组件、树形展示、权限控制开关、删除等
2. 完善**角色列表**页功能：角色列表：完善Table组 件展示、删除弹窗和删除数据、编辑弹窗Tree树形结构、属性结构勾选和编辑数据生效后端
3. 完善**用户列表**页功能：Form子组件封装复用与新增和编辑、数据的增删改查、表头筛选支持、国家化i18n配置
4. 完善**登陆退出**的功能：登陆功能、粒子背景效果、用户信息结构、用户登陆菜单权限、用户列表数据权限、跳转等

   * 引入[粒子效果](https://github.com/tsparticles/react/#readme)，安装 `yarn add @tsparticles/react @tsparticles/slim`，按照[文档demo](https://github.com/tsparticles/react/#readme)使用即可，

     1. 适配 react19 和 antd6 的粒子效果：https://github.com/tsparticles/react/#readme

     2. particles 粒子库官网（更换其他特效）：https://particles.js.org/

5. 完善**路由权限**的功能：动态路由渲染、本地路由映射与路由权限校验、安装`nprogress`库用于侧边栏路由加载展示进度条、封装 axios 基地址

6. 完善**撰写新闻**页功能：优化Form表单中异步请求后设置默认值问题、安装[react-draft-wysiwyg](https://github.com/jpuri/react-draft-wysiwyg)引入富文本编辑器并封装、引入 Steps 步骤条组件
   - 引入富文本编辑器，安装 `yarn add react-draft-wysiwyg draft-js draftjs-to-html html-to-draftjs`


7. 完善**草稿箱**页功能：列表、删除、提交审核、预览(Descriptions 描述列表组件)、编辑（回显富文本）、引入时间格式化和时区扩展
   - 安装 `yarn add moment moment-timezone`

8. 完善**我的新闻**页功能：列表、撤销、更新、发布功能 （或者叫**审核列表**）
9. 完善**审核新闻**页功能：列表、通过、驳回功能
10. ...































