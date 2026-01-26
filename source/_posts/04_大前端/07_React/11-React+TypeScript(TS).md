---
title: 11-React+TypeScript(TS)
date: 2022-5-22 21:36:21
tags:
- React
- TypeScript
- ts
categories: 
- 04_大前端
- 07_React
---

![React](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260123164723034.png)

参考：

* TypeScript 语法文档：https://zhongsp.gitbooks.io/typescript-handbook/content/



## 1. 创建项目

### 1.1 创建

创建项目：

```sh
create-react-app react-ts --template typescript
```



### 1.2 使用工作区版本

默认创建出来的项目，打开 index.tsx 后，代码会有飘红的语法报错。此时需要做两步：

① 将当前项目放在 VSCode 的文件夹`根目录`（独立该项目在 IDE 下）

② 选择当前 IDE 的 typescript 的版本，Ctrl + Shift + P 输入 `选择typescript` ，然后选择 `使用工作区版本`

解决：飘红的语法报错就没有了！

![image-20260126194329125](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260126194615944.png)

![image-20260126194401119](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260126194618622.png)



### 1.3 版本选择：v18

默认创建出来的 react 项目是 react19 的版本，手动切到了 18 版本，如下命令：

```sh
npm i react@18 react-dom@18
```

而且完美兼容 react-router@6 版本。



































