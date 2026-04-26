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
# 如果是 winget 安装的，则使用如下命令更新最新版
winget upgrade Anthropic.ClaudeCode
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
* 静默执行所有命令（不询问）⚠️危险慎用！：`claude --dangerously-skip-permissions`

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



## 4. 项目结构

设置 ClaudeCode 默认语言为中文。

![image-20260426120153286](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260426120156759.png)

对 Claude 最友好的项目结构：

```
claude-code-project/
├── .claude/                         # claude局部配置
├── backend/                         # 后端项目
│   ├── src/main/
│   ├── .gitignore                   # Git忽略配置
│   └── pom.xml                      # maven 依赖配置
├── frontend/                        # 前端项目
│   ├── src/
│   ├── .gitignore                   # Git忽略配置
│   └── package.json                 # pnpm 依赖配置
└── README.md                        # 文档
```

只有在`同一个目录下打开前后端项目`，才能让 AI 更好的理解项目，进行前后端互通协作编码。

为了让 ClaudeCode 更好用，更听话，不仅需要这个友好的项目结构，而且也需要结合 TRAE 生成 `CLAUDE.md` 核心文件（基础规范，每次对话都会携带）。

> 让 ClaudeCode 更好用：
> 1. 后端项目、前端项目 以平级的方式放在一个 父目录(新建)下。
> 2. 借助于 TRAE 中 Auto 模型就行，使用`计划模式`让其分析代码并生成 CLAUDE.md，提示词：
>
> ```
> /plan 帮我深度分析当前目录下的后端项目 xxx 和前端项目 xxx-web，然后在当前目录下重新生成一个详细的 CLAUDE.md 文件，用于 ClaudeCode 开发使用。
> ```

## 5. IDEA 插件使用

认准 `Claude Code [Beta]` 为官方插件。

![image-20260426120951789](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260426120953352.png)

MCP 需要 IDEA 2026版本（注意同版本的 jetBrain 的产品都需要爆破）

![image-20260426121631166](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260426121633985.png)
