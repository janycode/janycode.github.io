---
title: 02-VSCode好用指南
date: 2018-5-22 20:14:49
tags: 
- Visual Studio Code
- VSCode
- 使用技巧
categories:
- 00_先利其器
- 07_Visual Studio Code
---



![image-20220212163939405](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220212163940.png)

参考资料(官网)：https://code.visualstudio.com/

> 在 Windows、macOS 和 Linux 上运行的独立源代码编辑器。 JavaScript 和 Web 开发人员的最佳选择，包含大量扩展，几乎支持任何编程语言。
>
> 重点：`免费!`



## 快捷键速查表

* Windows/Linux快捷键

![image-20251207212734054](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251207212735.png)

* MAC快捷键

![image-20251207212704144](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251207212712.png)



## 界面

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251207223406.jpg)



## npm|cnpm镜像

`cnpm` 安装

```bash
npm install -g cnpm --registry=https://registry.npmmirror.com/
```

验证：

```bash
cnpm -v
```

npm 最新国内镜像源设置 2025

1. 国内源

淘宝：`https://registry.npmmirror.com/`

腾讯云：`https://mirrors.cloud.tencent.com/npm/`

CNPM：`https://r.cnpmjs.org/`

2.设置

```bash
#查询当前使用的镜像源
npm get registry

#设置为淘宝镜像源 
npm config set registry https://registry.npmmirror.com/

#验证设置
npm get registry

#还原为官方源
npm config set registry https://registry.npmjs.org/ 
```







## 插件列表(★)

* **Chinese (Simplified) (简体中文) Language Pack for Visual Studio Code**，中文插件包，第一个必装
* **Auto Rename Tag**，自动修改成对标签，默认生效
* **view-in-browser**，快速预览页面的插件
* **Live Server**，实时预览服务，快捷键 Alt + L，再 Alt + O
* **htmltagwrap**，快速键入p标签，结合成对修改标签使用，快捷键 Alt + W
* **px to rem & rpx & vw (cssrem)**，可以快速的转换px与rem单位，快捷键 Alt + Z
* **Image preview**，光标悬浮在图片路径上时，显示图片预览
* **Comment Translate**： 自动翻译 MDN reference 提示信息，最好设置一下源语种和目标语种
* **TRAE AI (formerly MarsCode)**: Coding Assistant，豆包智能编程助手，提供代码解释、单测生成、问题修复、技术问答等，提升编码效率与质量。
* **Code Spell Checker**，标志错的单词，还可以提示单词的正确拼法。
* **indent-rainbow**，提示我们的缩进是否到位，每步交替四种不同的颜色，没有到位的话颜色变红
* **IntelliJ IDEA Keybindings**，转变快捷键习惯与 IDEA 风格
* **Preview on Web Server**，在web服务器上预览，重启vscode后，可以访问8080端口
  * 快捷键有冲突，记得修改快捷键，目前使用 `Ctrl+Alt+Shift+字母`  S 是停止，R 是重启，L 是快速预览
* **Error Lens**：主要用于代码编辑时错误及警告的提示和展示
* **CSS Peek**：是一个能够将类名快速转到定义的的插件，尤其是全局类名的时候，可以达到事半功倍的效果
* **ESLint**：ESLint语法标准检测（**暂时禁用**，语法提示过于严谨）
* **Vue（Offical）**：针对vue3的语法插件，需要禁用 Vetur 插件。
* AI 代码补全插件：https://apifox.com/apiskills/vscode-code-completion/

PS：如果插件安装无法联网，把windows文件管理器下 `%USERPROFILE%\.vscode\extensions`，删除该文件夹下所有内容。





## 自用快捷键

* **Ctrl + Alt + Shift + J**  批量选中相同变量
* **Ctrl + Alt + L**  转变快捷键习惯与 IDEA 风格后的 **代码自动格式化** 快捷键
  * 连带两个设置: `Editor: Word Wrap Column` 和  `Prettier: Print Width` 两个字段设置为 120（默认值为80），可以增加格式化时触发换行的宽度






## 浏览器开发者工具



### 1. 弱网

![image-20251209180818814](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251209180819.png)



### 2. 谷歌浏览器插件

FeHelper: https://chrome.zzzmh.cn/info/pkgccpejnmalmdinmhkkfafefagiiiad

可以插件内部添加很多使用的小组件进来。

![image-20251210193830106](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251210193831.png)



### 3. 局域网访问8080

在Windows 11上开启8080端口：

- 打开“**控制面板**”，选择“**系统和安全**”，然后选择“**Windows Defender 防火墙**”。
- 在左侧导航栏中，选择“**高级设置**”。
- 在弹出的窗口中，选择“**入站规则**”，然后选择“**新建规则…**”。
- 选择“**端口**”，点击“**下一步**”，选择“**TCP**”，在“**特定本地端口**”中输入“**8080**”，然后点击“下一步”。
- 勾选“**允许连接**”，填写**名称和描述**，最后点击“**完成**”以保存设置。

![image-20251223103132106](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251223103133.png)





### 4. 谷歌浏览器控制台字体设置

参考资料：https://juejin.cn/post/7348842402826485801

我的设置如下：

* 标准字体：**微软雅黑**
* Serif 字体：**Microsoft YaHei Mono** 或 Consolas
* Sans-serif 字体：**微软雅黑**
* 宽度固定的字体：**Microsoft YaHei Mono** 或 Consolas



## ESLint语法检测

.eslintrc.js

```js
module.exports = {
  ...,
  rules: {
    ...,
    'no-new': 'off',
    'no-unused-vars': 'off',
    'vue/multi-word-component-names': 'off'
  }
}
```

加上如上规则：

* no-new, 不准单独new - 关闭
* no-unused-vars， 不准有未使用的变量 - 关闭
* vue/multi-word-component-names，组件命名规则 - 关闭
  * 对应 error: Component name "xxx" should always be multi-word





