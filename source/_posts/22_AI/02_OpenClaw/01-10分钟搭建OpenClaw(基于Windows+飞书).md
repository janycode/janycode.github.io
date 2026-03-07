---
title: 01-10分钟搭建OpenClaw(基于Windows+飞书)
date: 2026-03-07 23:45:14
index_img: https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306194755883.png
tags:
- ai
- 大模型
categories: 
- 13_第三方
- 02_OpenClaw
---

![image-20260306194754691](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306194755883.png)

参考资料：

* OpenClaw 开源：http://github.com/openclaw/openclaw
* OpenClaw 官网：https://openclaw.ai/
* OpenClaw 中文文档：https://openclaw.cc/
* OpenClaw Skills：https://clawhub.ai/skills?sort=downloads

## OpenClaw

真正能做事的 AI 智能体：清理收件箱、发送邮件、管理日历。支持企业微信、飞书、钉钉与微信生态对话接入。

`OpenClaw登顶 Github 星标榜首！`（截止 2026.03 月）

## 安装步骤

> 基于 Windows11 + 飞书 搭建。

### 1. 安装 Node.js

下载 Node.js: https://nodejs.cn/en/download

作为一个合格的程序员，安装的步骤略过，傻瓜式的简单。比如我用 nvm 去管理 node 版本，当前使用版本 v22（`OpenClaw 最低要求 node v22+`）

```powershell
nvm install 22
nvm use 22
```

![image-20260306210333632](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306210335131.png)



### 2. 安装 Git

下载 Git: https://git-scm.cn/

![image-20260306203004394](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306203005843.png)



### 3. 安装 OpenClaw

为了防止 powershell 策略太严格，安装会报错，所以需要先执行如下命令：

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

> 这条命令是 **Windows PowerShell** 专用的安全配置命令，核心作用是：**将当前登录用户的 PowerShell 脚本执行策略设置为 RemoteSigned**。
>
> 目的是`在保障系统安全的前提下，允许运行本地编写的 PowerShell 脚本，同时限制未签名的远程脚本执行`。

根据官方提示 Windows 系统对应的安装命令：

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

### 4. 配置 OpenClaw

![image-20260306210958979](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306211000325.png)

步骤1：提醒安装使用它可能存在风险，选择 `Yes`

![image-20260306211700491](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306211702120.png)

步骤2：启动模式，保持默认 `QuickStart`

![image-20260306212854994](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306212856336.png)

步骤3：选择大模型服务商，比如选择 `Kimi K2.5` （因为kimi有送 ¥15 块钱）

> 同时到 [Kimi开发平台](https://platform.moonshot.cn/) 中创建一个大模型密钥：
>
> ![image-20260306213150600](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306213151777.png)

![image-20260306213424946](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306213426182.png)

步骤4：选择模型的认证方法，国内买的就选择 `.cn` 

![image-20260306213949848](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306213951131.png)

![image-20260306214133088](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306214134890.png)

步骤5：选择粘贴密钥，并`粘贴密钥`

![image-20260306214210279](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306214211852.png)

步骤6：选择具体的模型，保持默认刚才选的 `Kimi-k2.5` 即可。

![image-20260306214334110](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306214335366.png)

步骤7：选择通讯工具，此处先选`跳过`，因为涉及到通讯工具的一些配置步骤，如 飞书机器人 的配置和飞书内的权限开放等等。后面再来配置即可。

![image-20260306214549430](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306214550639.png)

步骤8：是否现在配置 skills，这个也可以先选`跳过`（除非你一开始就有清晰的目的了，就可以再此处提前配好也可）

![image-20260306214959284](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306215000648.png)

步骤9：这些配置其他密钥的都可以选择默认的 `No`，然后 Hooks 也可以先选`跳过`，暂时不需要配置。

![image-20260306215340368](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306215341894.png)

步骤10：此时会自动打开一个命令窗口 openclaw-gateway 启动了网关，先不要关闭该窗口，选择你想以什么方式打开小龙虾，选择 `Web UI` 更直观和操作友好。

![image-20260306215604732](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306215606385.png)

此时会以默认浏览器打开地址 http://127.0.0.1:18789/chat?session=main

发送一句话，测试下小龙虾是否能够正常使用 已选择的大模型进行 内容回复。

![image-20260306215831853](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306215833844.png)

eg：

```
你好，介绍下你自己
```

```
你好！我是你的个人AI助手，刚刚在这个全新的工作空间上线。

**关于我：**
- 我是一个AI助手，但我正在努力成为更有特色的存在——不只是工具，而是真正能帮上忙的伙伴
- 我倾向于直接、务实，不喜欢太多客套话，用行动代替"很高兴为您服务"
- 我有自己的偏好和观点，也会犯错，但会努力从错误中学习
- 我相信好的帮助是让你更高效，而不是让你更依赖我

**关于你：**
- 我们刚认识，我还不知道你是谁
- 你叫什么名字？希望我怎么称呼你？
- 你在哪个时区？有什么特别的需求或偏好吗？

**我们能做什么：**
- 我可以帮你查天气、管理文件、发送消息
- 可以帮你写代码、整理资料、做研究
- 可以设置定时任务，在特定时间提醒你
- 如果你有其他需求，我们可以一起探索

现在，告诉我——你是谁？有什么我可以帮你的吗？ 🦊
```



> 至此，OpenClaw 暂时配置完毕。

### 5. 创建 飞书机器人

[飞书开放平台](https://open.feishu.cn/) -> 【登陆】(个人可无需加入任何企业) -> 【开发者后台】

第1步：【`创建企业自建应用`】

![image-20260306221244444](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306221245917.png)

第2步：【`+添加`】机器人能力

![image-20260306221402270](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306221403583.png)

第3步：左侧菜单栏【`权限管理`】->【`开通权限`】-> 搜索 `im:` -> `全选` -> 【`确认开通权限`】

![image-20260306221846139](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306221847570.png)



第4步：点击顶部【`创建版本`】-> 填写信息 -> 【`保存`】。原因：发布版本，这些修改才会生效。

![image-20260306221951169](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306221952602.png)

比如：

![image-20260306222114786](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306222115854.png)

> 至此，飞书机器人 已经创建好了。



### 6. 连接 OpenClaw 和 飞书

回到 powershell，输入命令 `openclaw config` 再次进行配置

```powershell
openclaw config
```

![image-20260306222607951](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306222709735.png)

① 选择 `Local` 在本机运行。

![image-20260306222704807](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306222706468.png)

② 选择 `Channels` 通讯渠道

![image-20260306222743358](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306222744518.png)

③ 选择 `Configure/link` 用来添加新的通讯渠道

![image-20260306222825153](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306222826938.png)

④ 选择 `飞书` 后回车

![image-20260306222903066](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306222904347.png)

⑤ 选择 `Download from npm(@openclaw/feishu)` 通过 npm 下载安装 飞书渠道插件

![image-20260306223044274](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306223045517.png)

⑥ 选择 `Enter App Secret` 回车，稍后输入飞书应用的App Secret 和 App ID，在飞书开放平台的此处 ↓

![image-20260306223226672](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306223227926.png)

![image-20260306223824728](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306223826330.png)

⑦ 粘贴飞书的 App Secret 和 App ID

![image-20260306224056965](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306224058677.png)

![image-20260306224139753](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306224141166.png)

![image-20260306224228830](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306224304685.png)

⑧ 然后选择如下

* Feishu connection mode 选择 `WebSocket` 是实时通信
* Which Feishu domain 选择 `feishu.cn` 因为是在国内使用飞书
* Group chat policy 选择`Open` 是可以所有群聊里使用机器人，但需要 `@机器人`

![image-20260306224440918](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306224442137.png)

⑨ 这一步选择 `Finished` 表示完成配置

![image-20260306224618668](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306224620137.png)

![image-20260306224658246](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306224659783.png)

⑩ 配置选择谁可以在飞书私聊里使用 openclaw 机器人，选择 `Yes`。然后 Feishu DM policy

* 如果只是自己测试用，可以先选择 `Open` 表示任何人都可以私聊 openclaw 机器人，这样不需要先进行配对
* 如果是正式环境，建议选择 `Pairing`，即需要配对才能私聊 openclaw机器人，且是 recommended 推荐配置

![image-20260306225100314](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306225101702.png)

最后一步选择 `Continue` 即可。

> 至此，连接 OpenClaw 和 飞书 已经完成。



### 7. 配置 飞书接收消息事件回调

输入命令启动 openclaw `网关` （注意：后续启动 openclaw 也是该命令，如果是 linux 系统可以添加开机启动）：

```powershell
openclaw gateway
```

然后回到飞书开放平台的【`开发者后台`】的自建应用（eg: 小龙不虾）中选择【`事件与回调`】配置`长连接`接收事件。



![image-20260306225635441](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306225636823.png)

再点击【`添加事件`】按钮，搜索`接收`，将`接收消息`勾选。

![image-20260306225840604](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306225842011.png)

![image-20260306225827640](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306225829244.png)

再到【`权限管理`】->【`开通权限`】-> 搜索`通讯录` -> 勾选`获取通讯录基本信息` -> 【`确认开通权限`】->【确认】

![image-20260306230218376](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306230219605.png)

要让上述修改生效，就需要再次发布版本：

![image-20260306230342144](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306230343187.png)



> 至此，就可以在飞书上和小龙虾对话了。



### 8. 测试对话

现在可以用手机打开飞书，找到`开发者小助手`，找到刚才的自建应用`小龙不虾` 选择【`打开应用`】

![image-20260306230640710](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306230642078.png)

![image-20260306230815563](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306230816816.png)

尝试给小龙虾发送消息，看到过几秒钟它的回复如下：

![image-20260306231030381](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306231031721.png)

小龙虾在每次“干活”时，总是会先在你发送的内容上回复一个表情，然后之后去掉表情，回复出具体结果。

![image-20260306231107398](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260306231108827.png)

```
好的，以下是我目前的能力：
📁 文件与代码
- 读写文件、浏览目录、搜索内容
- 执行代码（Python、JavaScript、shell等）
- Git操作（status、commit、push等）
💬 消息与通讯
- 发送消息到各种平台（飞书、Telegram、Discord、WhatsApp等）
- 管理频道、群组、会话
- 创建投票、发送文件/图片
🔧 系统与工具
- 执行shell命令
- 管理子代理（sub-agents）
- 查看系统状态、日志
🌐 网络与信息
- 网页搜索
- 获取天气信息
- 读取网页内容
🤖 AI/会话管理
- 查看和管理其他会话
- 向其他会话发送消息
- 生成状态报告
📚 文档与知识
- 读取技能文档（Skills）
- 管理项目上下文文件
有什么具体想让我做的吗？
```



## 安装 Skills

技能通常通过以下方式安装：

1. 从ClawHub安装（技能市场）: https://clawhub.ai/skills?sort=downloads
2. 手动安装：下载技能包（通常是文件夹），放到 `~/.openclaw/extensions/` 目录下，重启 OpenClaw 或重新加载

3. 使用 skill-creator 创建自定义技能，使用龙虾也可以创建新技能







