---
title: 01-Eclipse常用操作
date: 2016-4-28 21:36:36
tags: 
- Eclipse
- 快捷键
categories: 
- 00_先利其器
- 02_Eclipse
---

### 1.常规使用
* 创建项目：**File > new > project > Java Project**
* src下创建包：[右键]**new > Package**
* package下创建类：[右键]**new > Class (.java文件)**
* 修改编辑字体：**Windows > Preferences > Gerenal > Appearance > Colors and Fonts > Basic > Text Font > Edit > "Microsoft YaHei Mono"-11**
* 修改输出字体：**Windows > Preferences > Gerenal > Appearance > Colors and Fonts > Debug > Text Font > Edit > "Microsoft YaHei Mono"-11**
* 重置窗体排布：**Windows > Perspective > Reset Perspective**

### 2. 导入项目
* 导入项目：**File > Import > General > Existing Projects into Workspace > Browse > [项目根文件夹] > finish**

### 3. 常用快捷键
* `Ctrl+1` 快捷修复
* `Ctrl+D` 快捷删除行
* `Shift+Enter` 无视光标直接跳入下一行
* `Ctrl+F11` 一键运行
* `Alt+↑/↓` 快速移动单/多行
* `Ctrl+Alt+↑/↓` 快速复制单/多行
* `Ctrl+M` 将当前代码编辑框放大/恢复
* `Alt+/` 快速补全代码
  sout：System.out.println();
* `Ctrl+/` 快速注释单/多行和恢复（单行注释符 // ）
* `Ctrl+Shift+/` 快速注释单/多行和恢复，需选中 （多行注释符 `/* */`）
* `/**` 快速创建函数的javadoc文档注释
* `Ctrl+Shift+F` 格式化代码(注意印象笔记&搜狗输入法的快捷键冲突)

* `Ctrl+E` 弹出快速文件选择窗然后上下选择
* `Alt+Shift+W` 选择第一个Package Explorer即可快速定位

* `Alt+Shift+R` 然后修改即可修改所有相同变量
* `Ctrl+Q` 返回上一个Ctrl+鼠标单击跳转的原始位置
* `F3` 在关键字上按，可以跳转进入源码
* `Alt+←/→` 浏览F3跳转源码的轨迹
* `Ctrl+Shift+O` 快速导包：导入需要的包同时去掉无用的包
* `Alt+Shift+Z` 选中代码行后，快速创建try-catch块

* `Ctrl+O` 快速显示OutLine悬浮窗，搜索和浏览成员方法
* `Ctrl+2,L` 为调用方法时返回值的本地变量赋值

### 4.快速生成代码
 `Alt+Shift+S` 弹出源码选项：
**+o** 完成构造方法
**+r** 添加geter和seter
**+s** 添加覆盖Object父类的toString()方法
**+v** 继承覆盖方法
**+c** 继承构造方法
**+m** 成员的方法
**+h** 添加 hashcode() 和equals()

### 5. 附加源码
* 默认正确，无需改动，如需改动，参考步骤：
Windows > Preferences > Java > Installed JRES > 选中JRE > Edit > 选中..\rt.jar > Source Attachment > External location > 找到src.zip