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



## VSCode界面

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251207223406.jpg)

### 文件树

ctrl + shift + P 输入 *settings.json* 打开 *Open User Settgins*，添加如下 `3` 个配置：

```json
{
  ...
  "workbench.tree.indent": 12,
  "workbench.tree.renderIndentGuides": "always",
  "workbench.colorCustomizations": {
    "tree.indentGuidesStroke": "#05ef3c"
  }
}
```

效果

![image-20260111094012466](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260111094014106.png)



### 自动格式化（按需）

打开设置，找到 format on `paste`/save/type，3项开启：粘贴(范围格式化)/保存/键入一行



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







## 插件列表 (★)

* **Chinese (Simplified) (简体中文) Language Pack for Visual Studio Code**，中文插件包，第一个必装
* **Auto Rename Tag**，自动修改成对标签，默认生效
* **view-in-browser**，快速预览页面的插件
* **Live Server**，实时预览服务，快捷键 Alt + L，再 Alt + O
* **htmltagwrap**，快速键入p标签，结合成对修改标签使用，快捷键 Alt + W
* **px to rem & rpx & vw (cssrem)**，可以快速的转换px与rem单位，快捷键 Alt + Z
* **Image preview**，光标悬浮在图片路径上时，显示图片预览
* **Comment Translate**： 自动翻译 MDN reference 提示信息，最好设置一下源语种和目标语种
* **Code Translate** ：作者 w88975 自动翻译鼠标停留的代码变量单词悬浮
* **TRAE AI (formerly MarsCode)**: Coding Assistant，豆包智能编程助手，提供代码解释、单测生成、问题修复、技术问答等，提升编码效率与质量。
* **Code Spell Checker**，标志错的单词，还可以提示单词的正确拼法。
* **indent-rainbow**，提示我们的缩进是否到位，每步交替四种不同的颜色，没有到位的话颜色变红

  * ```json
    通过添加以下设置到settings.json文件并重新加载VSCode来移除错误的颜色。
    "indentRainbow.ignoreErrorLanguages": ["*"],
    "indentRainbow.colorOnWhiteSpaceOnly": true,
    ```

* **IntelliJ IDEA Keybindings**，转变快捷键习惯与 IDEA 风格
* **Preview on Web Server**，在web服务器上预览，重启vscode后，可以访问8080端口
  * 快捷键有冲突，记得修改快捷键，目前使用 `Ctrl+Alt+Shift+字母`  S 是停止，R 是重启，L 是快速预览
* **Error Lens**：主要用于代码编辑时错误及警告的提示和展示
* **CSS Peek**：是一个能够将类名快速转到定义的的插件，尤其是全局类名的时候，可以达到事半功倍的效果
* **ESLint**：ESLint语法标准检测（**暂时禁用**，语法提示过于严谨）
* **Vue（Offical）**：针对vue3的语法插件，需要禁用 Vetur 插件。
* **Material Icon Theme** ：文件图标主体插件，更高效美观的分辨不同的文件和文件夹 - 用的人多，但个人不太感冒。
* **VSCode Icons** ：【`推荐`】文件图标主体插件，简约简单，好识别不花哨。
* **Path Intellisense** ：路径智能提示补全插件，输入路径时非常好用
* **CodeSnap** ：选中的代码快速存储为美观的截图
* **Doxygen Documentation Generator** ：和 IDEA 一样快捷的输入方法或者类的注释
* **Outline Map** : 更好的代码大纲（大纲固定放在最右侧，更人性化）
  * 修改配置 `Outline-map: Expand` 为 **cursor**（即在光标移动到时展开对应位置的大纲-其他默认收起）

* **EJS language support** ：支持 ejs 的语法着色效果
* **ApiDoc Snippet** ：apidoc注释代码提示工具
* **ES7+ React/Redux/React-Native snippets** ：React 开发语法插件，有快捷输入指令，如 rcc/rfc...
* AI 代码补全插件：https://apifox.com/apiskills/vscode-code-completion/

PS：如果插件安装无法联网，把windows文件管理器下 `%USERPROFILE%\.vscode\extensions`，删除该文件夹下所有内容。

> 插件库推荐：https://www.kancloud.cn/nineqing/visualstudiocode/3170860



## 自用快捷键-IDEA风格

* **Ctrl + Alt + Shift + J**  批量选中相同变量
* **Ctrl + Alt + L**  转变快捷键习惯与 IDEA 风格后的 **代码自动格式化** 快捷键
  * 连带两个设置: `Editor: Word Wrap Column` 和  `Prettier: Print Width` 两个字段设置为 150（默认值为80），可以增加格式化时触发换行的宽度

* **Ctrl + E** 打开顶部文件搜索栏
* **Ctrl + G** 跳转到指定的行数
* **Ctrl + Shift + O** 搜索并跳转到当前文件指定的变量/方法名
* **Ctrl + Tab** 循环展示已打开的文件，↑ ↓ 选中到对应文件
* **Alt + ←或→** 快速左右跳转已打开的文件【最常用】
* 双击shift后输入`?` ，展示最常用的命令或快捷键
* **Ctrl + Shift + P**，打开VSCode的命令面板
* `Ctrl + \` 打开右侧拆分编辑器，此时 **Alt + ←或→** 在当前编辑器窗口内切换文件，**Ctrl+1或2** 在第1个或第2个编辑器间切换

* **Ctrl + Shift + ↑或↓** 移动当前代码行，或者 Alt + ↑或↓
* **Ctrl + L** 选中当前行，继续按就继续往下选（IDEA 中是 Ctrl + C 选中当前行）
* **Ctrl + W** 选中或扩选当前变量/方法，再按下 **Ctrl + Alt + Shift + J** 就可以选中当前文件中所有的该名字
* `Alt + 滚轮` 代码滚动加速滚动，方便浏览
* 对文件点击右键，可以选中当前比较文件，再选一个文件进行对比文件内容。
  * 终端命令方式 `code --diff 文件路径A 文件路径B` 会快速打开 vscode 的文件对比窗口进行对比（适用于不再同一个工程项目中）。
  * 替代工具 `BeyondCompare`




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





## 快捷键速查表

* Windows/Linux快捷键

![image-20251207212734054](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251207212735.png)

* MAC快捷键

![image-20251207212704144](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251207212712.png)
