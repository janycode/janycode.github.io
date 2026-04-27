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

### CLAUDE.md

`/init` 命令会生成这个文件，模版可以参考如下进行修改。

```markdown
# PROJECT: [你的项目名称]

## 项目概述
[用一段话精确描述你在构建什么，目标用户是谁]

## 技术栈
- Frontend: [React / Next.js / Vue / 纯 HTML]
- Backend: [Node / Python / 等]
- Database: [Supabase / PostgreSQL / MongoDB]
- Styling: [Tailwind / CSS / SCSS]
- Deployment: [Vercel / Railway / 等]

## 项目结构
[描述你的文件夹结构和各目录的职责]
src/
  components/ — 可复用 UI 组件
  pages/ — 路由级页面组件
  lib/ — 工具函数和辅助模块
  api/ — API 路由处理器

## 编码规范
- [你的语言偏好 — TypeScript 还是 JavaScript]
- [错误处理方式]
- [文件和函数的命名规范]
- [你始终坚持的任何模式]

## 当前正在构建
[当前正在开发的功能或任务]

## Claude Code 绝对不要做的事
- 永远不要修改 [受保护文件夹] 中的文件
- 永远不要读取或访问 .env 文件
- 永远不要在未获明确指令的情况下 push 到 git
- 永远不要在未与我确认的情况下删除文件

## 重要上下文
[Claude Code 需要了解的关于你项目的任何其他信息]
```



> 真正的重心还是：`模型质量`、`提示词工程`、`skills`、`个人认知综合能力`。



### CLAUDE.md 强制追加

来源于 ☆star 数达 `90k+` 的开源项目：https://github.com/forrestchang/andrej-karpathy-skills

~~~markdown
## 必须遵守的四个原则

这些指南倾向于谨慎而非速度。对于琐碎的任务（简单的拼写错误修复、显而易见的一行修改），请自行判断 —— 并非每个改动都需要完整的严谨流程。

目标是减少非琐碎工作中的代价高昂的错误，而不是拖慢简单任务。

### 1. 编码前思考

**不要假设。不要隐藏困惑。呈现权衡。**

LLM 经常默默选择一种解释然后执行。这个原则强制明确推理：

- **明确说明假设** — 如果不确定，询问而不是猜测
- **呈现多种解释** — 当存在歧义时，不要默默选择
- **适时提出异议** — 如果存在更简单的方法，说出来
- **困惑时停下来** — 指出不清楚的地方并要求澄清

### 2. 简洁优先

**用最少的代码解决问题。不要过度推测。**

对抗过度工程的倾向：

- 不要添加要求之外的功能
- 不要为一次性代码创建抽象
- 不要添加未要求的"灵活性"或"可配置性"
- 不要为不可能发生的场景做错误处理
- 如果 200 行代码可以写成 50 行，重写它

**检验标准：** 资深工程师会觉得这过于复杂吗？如果是，简化。

### 3. 精准修改

**只碰必须碰的。只清理自己造成的混乱。**

编辑现有代码时：

- 不要"改进"相邻的代码、注释或格式
- 不要重构没坏的东西
- 匹配现有风格，即使你更倾向于不同的写法
- 如果注意到无关的死代码，提一下 —— 不要删除它

当你的改动产生孤儿代码时：

- 删除因你的改动而变得无用的导入/变量/函数
- 不要删除预先存在的死代码，除非被要求

**检验标准：** 每一行修改都应该能直接追溯到用户的请求。

### 4. 目标驱动执行

**定义成功标准。循环验证直到达成。**

将指令式任务转化为可验证的目标：

| 不要这样做... | 转化为... |
|--------------|-----------------|
| "添加验证" | "为无效输入编写测试，然后让它们通过" |
| "修复 bug" | "编写重现 bug 的测试，然后让它通过" |
| "重构 X" | "确保重构前后测试都能通过" |

对于多步骤任务，说明一个简短的计划：

```
1. [步骤] → 验证: [检查]
2. [步骤] → 验证: [检查]
3. [步骤] → 验证: [检查]
```

强有力的成功标准让 LLM 能够独立循环执行。弱标准（"让它工作"）需要不断澄清。

---

**这些指南在以下情况下有效:** 减少不必要的差异修改，减少由于过度复杂而导致的重写，并在实施之前而非错误之后澄清问题。
~~~



### 三大文件

![d16c7c425b42b4fc76066f87cb0a7572](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260427215818847.png)

![399e6a0627db7402fcffb730fc781906](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260427215827678.png)

* **CLAUDE.md**

![9ae99973df6193dfe220f6c9c368618c](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260427215706464.png)

* **settings.json**

![a9270577532d422b42a954d0793b2caf](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260427215724982.png)

* **rules/**

![e16f38daa54384d801db629e9d8c6403](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260427215739860.png)



## 4. 项目结构

设置 ClaudeCode 默认语言为中文。

![image-20260426120153286](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260426120156759.png)

如果不达预期，就使用提示词让其记住，以后本项目的所有对话全部使用中文，包括文档。

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
