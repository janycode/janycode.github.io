---
title: 05-win11系统优化+powershell美化
date: 2023-11-8 15:09:26
tags:
- windows
- powershell
categories: 
- 01_操作系统
- 05_Windows
---



参考资料：

* 禁用18个系统服务：https://www.sohu.com/a/813109682_100037970
* 解决antimalware service executable程序占用：https://blog.csdn.net/weixin_45472167/article/details/126421562
* 本地组策略打不开的问题：https://zhuanlan.zhihu.com/p/673820397
* 彻底删除windows defender：https://blog.csdn.net/qq_41967792/article/details/139165924
* PowerShell 美化：https://zhuanlan.zhihu.com/p/690118041



# PowerShell 美化

## 1. 引言

作为一名程序员，终端命令行（CLI）无疑是我们日常工作中不可或缺的工具之一。因此，我想拥有一个既美观又实用的终端界面，不至于天天盯着那个黑框框，感觉那个比较单调乏味~

先看美化完成后的结果：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260130235026015.png)

可以看到当前用户、当前目录以及 **conda 的环境名称及 python 版本。** 最后一个对我来说比较实用。

## 2. 准备工作

### 2.1 安装 Powershell 7

相比于 Windows 默认提供的 Powershell，Powershell 7 拥有以下几个优势：

1. 支持跨平台使用，增强了其灵活性和适用范围。
2. 提供了更优越的性能表现。
3. 处于持续更新状态，保证了功能的不断完善和安全性的提升。

简而言之，Powershell 7 是 Powershell 的升级版。

官网地址：

[PowerShell 文档 - PowerShell](https://learn.microsoft.com/zh-cn/powershell/)

Github 地址：

[https://github.com/PowerShell/PowerShell](https://github.com/PowerShell/PowerShell)

下载地址：

1. [https://github.com/PowerShell/PowerShell/releases/](https://github.com/PowerShell/PowerShell/releases/)
2. [https://learn.microsoft.com/zh-cn/powershell/scripting/install/installing-powershell-on-windows](https://learn.microsoft.com/zh-cn/powershell/scripting/install/installing-powershell-on-windows)

选择合适自己的安装即可。

### 2.2 安装 Terminal（终端）

从 **微软商店（Microsoft Store）** 当中安装即可。

安装地址（懒得搜点这里的链接）：[Windows Terminal - Microsoft Apps](https://apps.microsoft.com/detail/9n0dx20hk701%3Fhl%3Den-us%26gl%3DUS)



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260130235106916.png)



### 2.3 安装 Oh my posh

如上，从微软商店安装。

安装地址（懒得搜点这里的链接）：[oh-my-posh - Microsoft Apps](https://apps.microsoft.com/detail/xp8k0hkjfrxgck%3Fhl%3Den-us%26gl%3DUS)

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260130235133250.png)



### 2.4 安装字体

由于 Oh My Posh 的众多主题广泛应用了各式图标，但并非所有字体都对这类图标提供支持，导致显示可能出现问题。

官方推荐使用[Meslo LGM NF](https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/Meslo.zip)字体以获得最佳体验，可通过点击上述链接下载并安装该字体。此外，如果想尝试更多种的 NF 字体，可以进下面链接查看更多种的。

[Nerd Fonts - Iconic font aggregator, glyphs/icons collection, & fonts patcher](https://www.nerdfonts.com/font-downloads)

我个人，比较喜欢使用 `JetBrainsMono Nerd Font`，因为日常写 代码 都是用的 JetBrain 家族的工具，如



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260130235211283.png)

或另一款

![image-20260130235234329](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260130235235932.png)

## 3. 配置

### 3.1 将 Powershell 7 作为 Windows Terminal 的默认 Shell

打开安装好的 Windows Terminal 软件。我一般是这样打开的：

1. `win+r` 调出运行，输入`wt`

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260130235245478.png)



2. 打开 Terminal 的设置，快捷键：`ctrl+,`

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260130235330560.png)

3. 将 Powershell 7 设置为默认项

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260130235406820.png)



### 3.2 设置字体

首先，在 3.1 内容打开的设置界面左侧导航栏中选择 **“PowerShell”** 。接着，滚动至右侧区域的底部，寻找并点击 **“其他设置”** 的 **“外观”** 选项。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260130235424964.png)

在这里可以配置 **配色方案、字体、字号、行高。**

> 需要特别注意的是，所选择的字体必须属于 Nerd Font 系列。 **否则，图标可能无法正确显示。**



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260130235439760.png)



### 3.3 创建 Powershell 7 的配置文件

输入如下命令，下面的命令会先检查配置文件存不存在，如果不存在才创建：

```powershell
if (-not (Test-Path $PROFILE)) {
    New-Item -Path $PROFILE -Type File -Force
}
```

接下来，打开配置文件（以下示例展示的是使用记事本进行操作）。

```powershell
notepad $PROFILE
```

### 3.4 输入 Oh my posh 的配置

输入如下命令：

```powershell
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH/jandedobbeleer.omp.json" | Invoke-Expression
```

> 这意味着每次启动 PowerShell 时，都会自动执行上述命令。该命令中引用的 JSON 文件是 Oh My Posh 的主题配置文件。

Oh My Posh 内置了众多主题，大家可以根据个人偏好选择喜爱的一款。如果想浏览所有预设主题的样式，可通过下方链接进行查看：

[Themes | Oh My Posh](https://ohmyposh.dev/docs/themes)

完成以上步骤后，将获得一个 **初步** 美化过的 Terminal 界面：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260130235852185.png)

如果在预设主题找到自己喜欢的主题，可以修改配置文件中的 `jandedobbeleer` 为该主题的名称。

例如我比较喜欢的 `amro` 主题，可以通过如下命令进行修改：

```powershell
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH/amro.omp.json" | Invoke-Expression
```

## 4. 自定义主题(按需)

Oh My Posh 的所有主题文件都存放在以下路径中：

```powershell
C:\Users\<用户名>\AppData\Local\Programs\oh-my-posh\themes
```

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260130235532656.png)

可以在该目录下创建一个新文件，或对现有的主题进行修改。首张图片展示的主题是基于 **`amro`** 主题进行修改得来的。

主要的区别如下（左侧为修改后的版本，右侧为原始的 **`amro`** 版本）：



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260130235546488.png)





![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260130235555790.png)

主要代码：

```json
# 第一行与第二行连接线的上半部分
{
    "foreground": "#21c7c7",
    "style": "plain",
    "template": "\u256d\u2500",
    "type": "text"
},
# 用于显示conda环境名称及python版本号
{
    "type": "python",
    "style": "plain",
    "foreground": "#16d46b",
    "template": " \ue235 {{ if .Error }}{{ .Error }}{{ else }}{{ if .Venv }}{{ .Venv }} {{ end }}{{ .Full }}{{ end }} ",
    "properties": {
    "display_virtual_env": true,
    "dispplay_default": true,
    "display_version": true,
    "home_enabled": true,
    "display_mode": "always"
    }
},
# 第一行与第二行连接线的下半部分
{
    "foreground": "#21c7c7",
    "style": "plain",
    "template": "\u2570\u2500",
    "type": "text"
},
# 箭头
{
    "foreground": "#e0f8ff",
    "foreground_templates": ["{{ if gt .Code 0 }}#ef5350{{ end }}"],
    "properties": {
    "always_enabled": true
    },
    "style": "plain",
    "template": "\ue285\ueab6 ",
    "type": "status"
}
```

与原版的对比：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260130235611303.png)

