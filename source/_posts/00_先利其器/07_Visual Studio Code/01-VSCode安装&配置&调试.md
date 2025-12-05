---
title: 01-VSCode安装&配置&调试
date: 2018-5-22 20:14:49
tags: 
- Visual Studio Code
- VSCode
- 安装
- 配置
categories:
- 00_先利其器
- 07_Visual Studio Code
---



![image-20220212163939405](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220212163940.png)

参考资料(官网)：https://code.visualstudio.com/

> 在 Windows、macOS 和 Linux 上运行的独立源代码编辑器。 JavaScript 和 Web 开发人员的最佳选择，包含大量扩展，几乎支持任何编程语言。
>
> 重点：`免费!`

## 1. VSCode安装

### 1.1 VSCode获取
官网获取：[Visual Studio Code - Code Editing. Redefined](https://code.visualstudio.com/)

下载文件为 `vscodeusersetup-x64-x.yy.z.exe`


### 1.2 安装

选择英文的一个合适路径安装即可。

### 1.3 配置中文

1. 使用快捷键组合【Ctrl+Shift+p】，在搜索框中输入“configure display language”，选择 `Install Additional Languages`回车
   ![image-20220212164305619](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220212164306.png)
2. 选择第一个默认的就是中文简体
   ![image-20220212164414893](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220212164416.png)
   ![image-20220212164436693](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220212164437.png)

### 1.4 使用技巧

* 新建.html文件后，输入英文 `!` 然后 TAB，可以快速新建 html 默认页面结构模板。

  ![image-20220212164608039](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220212164609.png)

  ![image-20220212164553341](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220212164554.png)

* 快速在编辑器中预览当前代码的效果，只需要 `Ctrl+Shift+X` 搜索 `live server(即端口为 5500 的本地web服务器)` ，默认安装第一个即可，右键在编辑器中即可看到。

  ![image-20220212165445258](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220212165446.png)

  ![image-20220212165714680](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220212165716.png)

* 配置快捷键方案为 IDEA 方案，需要安装插件 `IntelliJ IDEA Keybindings`，无需重启即可生效

  ![image-20220213092801032](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220213092802.png)

* 推荐插件 `Microsoft Edge Tools for VS Code`,  在VS Code中使用 Edge 进行调试（有 Live Server 可作为替代）, 安装后工具在左侧栏
* Vue 代码提示插件 `Vue 2 Snippets` 和 `VueHelper`



打开同步：默认修改的配置和安装的插件都会进行同步

![image-20220213120413155](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220213120415.png)



## 2. 浏览器调试

F12 开发者工具：

![image-20251205105557876](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251205105605.png)

















