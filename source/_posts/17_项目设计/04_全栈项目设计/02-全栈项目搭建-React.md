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
> 一页效果：
>
> 


## 项目搭建和实现流程

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
13. 完善侧边栏 Sidebar 功能
14. 权限控制的数据流程图
    ![权限控制的数据流程图](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260129185156792.png)
15. 完善权限列表页的功能：Table 组件、树形展示、权限控制开关、删除等
16. 1



































