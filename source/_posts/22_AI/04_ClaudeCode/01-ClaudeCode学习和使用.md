---
title: 01-ClaudeCode学习和使用
date: 2026-01-22 23:35:05
index_img: https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210171726358.png
tags:
- ai
- 大模型
- Chat拆解
categories: 
- 13_第三方
- 04_ClaudeCode
---



参考资料：

* https://www.runoob.com/claude-code/claude-code-install.html

* https://blog.csdn.net/liulin_521/article/details/155862222
* https://zhuanlan.zhihu.com/p/2018862186013946674



## 1. 安装

```sh
# https://github.com/anthropics/claude-code
irm https://claude.ai/install.ps1 | iex
# or
winget install Anthropic.ClaudeCode
```

```sh
# 检查版本，确认安装成功
claude --version
```

```sh
# 手动更新到最新版
claude update
```

## 2. 启动

```sh
claude
```

> **报错**：
>
> `Unable to connect to Anthropic services`
>
> `Failed to connect to api.anthropic.com: ERR_BAD_REQUEST`
>
> **解决**：
>
> 国内第一次使用claude code的新手，都遇到过这样的报错。而成为了使用claude code的第一道门槛。
>
> 解决办法：找到配置文件，在 `C:\Users\用户名\.claude.json` 下面，打开加入一行（记得上一行的逗号不要落下）：
>
> ```json
> "hasCompletedOnboarding": true
> ```
>
> 重新打开 powershell 进行启动 `claude`，启动成功。

接下来就是进入到自己的**项目目录**下，使用 `claude` 启动 ClaudeCode。



## 3. API配置与模型切换

参考步骤：https://www.runoob.com/claude-code/claude-code-setup.html

`CC Switch`下载：https://github.com/farion1231/cc-switch/releases

* 安装教程：https://zhuanlan.zhihu.com/p/2010439384097367984

目前使用免安装版：https://github.com/farion1231/cc-switch/releases/download/v3.13.0/CC-Switch-v3.13.0-Windows-Portable.zip

--> 重启命令行终端，powershell。

**常用模型推荐**：

- longcat: https://longcat.chat/platform/usage
- 阿里云百炼



**切换模型**：

- 在提示框输入 `/model`
- 或启动时用 `claude --model sonnet`

* 确认模型配置无误：`/status`

### 常见命令汇总

| 命令                | 说明                                                        | 示例                      |
| :------------------ | :---------------------------------------------------------- | :------------------------ |
| `/init`             | 在项目根目录生成 CLAUDE.md 文件，用于定义项目级指令和上下文 | `/init`                   |
| `/status`           | 查看当前模型、API Key、Base URL 等配置状态                  | `/status`                 |
| `/model <模型名称>` | 切换模型                                                    | `/model qwen3-coder-next` |
| `/clear`            | 清除对话历史，开始全新对话                                  | `/clear`                  |
| `/plan`             | 进入规划模式，仅分析和讨论方案，不修改代码                  | `/plan`                   |
| `/compact`          | 压缩对话历史，释放上下文窗口空间                            | `/compact`                |
| `/config`           | 打开配置菜单，可设置语言、主题等                            | `/config`                 |



> 真正的重心还是：`模型质量`、`提示词工程`、`skills`、`个人认知综合能力`。

