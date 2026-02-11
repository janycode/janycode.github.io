---
title: Trae IDE&SOLO浅尝
date: 2026-2-10 16:05:43
index_img: https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210171959188.png
tags: 
- ai
- Trae
categories:
- 00_先利其器
- 09_Trae
---

![image-20260210171725390](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210171726358.png)



参考资料：

* Trae 官网：https://www.trae.cn/
* Trae 官方教程：https://docs.trae.cn/ide/what-is-trae?_lang=zh
* AI Short（多种 AI 提示词搜索、管理、共享）：https://www.aishort.top/

## 1. Trae 安装

### 1.1 下载

官网下载安装即可。



## 2. Trae 简单使用

### 2.1 Trae + Java

1. Trae 中创建文件夹，如 test01/，在该目录下创建文件夹 Hello.java
2. 在系统环境变量中正确配置 "JAVA_HOME"，Trae 会自动识别到相关配置
3. 通常会提示安装 Java 相关的扩展和插件，点击安装即可
4. 此时，我们就可以运行和调试程序了

![image-20260209185710780](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260209185712073.png)

![image-20260209185813174](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260209185815101.png)

![image-20260209185743855](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260209185746842.png)



### 2.2 Trae + HTML

创建一个 02_Vote 目录，体验快速通过 Trae 创建一个在线投票小程序。

* 打开 New Chat （`Ctrl + U`[win]）,使用内置智能体 `@Builder`，输入提示词。

![image-20260209190236075](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260209190237312.png)

版本1：

```txt
设计并开发一个功能完整的在线投票系统，该系统应包含以下核心功能模块：用户注册与登录模块（支持邮箱验证和密码加密存储）、投票项目管理模块（支持创建、编辑、发布和归档投票项目）、投票参与模块（支持单选/多选投票、投票结果实时展示）、权限管理模块（区分管理员、投票创建者和普通投票者权限）。系统需采用响应式设计，确保在桌面端和移动端均有良好的用户体验。技术实现上需考虑数据安全（防止重复投票、SQL注入攻击）、系统性能（支持至少1000名并发用户）和可扩展性（便于后续功能迭代）。需提供完整的数据库设计文档、API接口文档、用户操作手册以及单元测试报告。
```

版本2：

```txt
你现在是一名资深网页前端开发工程师，请帮我使用原生 HTML + CSS + JavaScript 编写一个可直接在浏览器打开使用的【在线投票程序】，要求如下：

- 功能：
  - 创建投票：输入投票标题，至少含2个选项；支持添加/删除选项
  - 开始投票：显示选项列表，点击为某一选项投票，实时更新票数与百分比
  - 防重复投票：同一设备对同一投票仅能投一次（使用localStorage记录）
  - 结果展示：显示每个选项票数和百分比，提供简单进度条或条形图效果
  - 数据持久化：投票标题、选项、票数、是否已投状态均使用 localStorage 保存，刷新后保留
  - 重置：提供“重置投票”按钮，清空数据并重新创建新的投票
- 界面与技术：
  - 风格简介淡雅（浅灰/浅蓝），居中卡片布局，按钮圆角阴影
  - 使用 CSS Flex 或 Grid 布局，当前日期不需要显示
  - 不使用任何框架和库，全部代码在同一个 HTML 文件中
  - 使用原生 JavaScript 操作 DOM，逻辑清晰，适量注释
- 输出格式：
  - 直接保存为`vote.html`文件，并在浏览器中打开即可使用
  - 代码可直接运行，无需任何依赖
```

Trae 会根据提示词生成相关的代码。

效果：

![image-20260209191620344](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260209191628901.png)





## 3. 上下文引擎 CUE

默认配置项是打开的，如果关闭就不会有上下文补全了。

![image-20260209193613587](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260209193614862.png)

### 3.1 写注释补全代码

// 编写一个方法内容，接收一个数组，并排序，排序使用冒泡排序算法

![image-20260209192042765](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260209192043996.png)



### 3.2 智能代码重写

// 编写一个方法内容，接收一个数组，并排序，排序使用冒泡排序算法`，排序从大到小`

![image-20260209192518722](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260209192519827.png)



### 3.3 多行协同优化

数据联想 和 多行批量修改。

![image-20260209192735395](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260209192736370.png)



![image-20260209192820476](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260209192821862.png)



### 3.4 光标位置预测

注释某个位置时，会在类同的位置，继续预测光标并将光标定位到注释位置。



### 3.5 接收、接收部分和拒绝

* `Tab` 键接收补全
* `Ctrl + →` 接收部分补全
* `ESC` ，并继续输入 表示拒绝补全



### 3.6 Ctrl+i 对选中代码AI修复

如题，修复 或 新增功能 或 优化功能均可。



## 4. 智能体 Agent 

### 4.1 内置智能体

#### Chat

聊聊你的代码库 或 编写代码，不能直接生成文件。

内置：**阅读、预览、联网搜索**。



#### Builder

端到端执行常规开发任务。

内置：**阅读、预览、联网搜索、`编辑`、`终端`**。



#### Builder with MCP

支持使用配置的所欲偶 MCP Servers。

内置：**阅读、预览、联网搜索、`编辑`、`终端`、`+配置的MCP Server`**。

![image-20260209194703215](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260209194704472.png)

![image-20260209194737539](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260209194738522.png)



#### SOLO Coder

> 【**IDE 模式**】
>
> 特点：保留传统开发流程，支持智能问答、代码补全等辅助功能，用户对开发过程有更强的掌控感。
>
> 场景：适合需要精细控制代码或逐步验证逻辑的开发者。
>
> 【**SOLO 模式**】
>
> 特点：AI主导全流程（需求理解、编码、测试、部署），通过自然语言输入即可自主完成开发任务，自动化程度高。
>
> 选择建议：若需保留开发自主性，选择 IDE 模式；若追求效率和处理标准化任务，SOLO模式更高效。

擅长项目迭代、问题修复与架构重构；智能任务规划，确认后精准推进执行；自主编排智能体，AI 专家团队协同开发。

* Plan 模式：为完成任务指定详细的计划，先和用户沟通指定计划，确认后再执行。
  * 沟通 → 制定计划 → 沟通修正计划 → 直到计划满意 → 执行



#### SOLO Builder - 国内无

适合个人与小团队，高效落地项目，从需求编写到上线发布，全链路协同，集成鉴权、数据库、AI服务等工具。

步骤：

1. 创建一个文件夹，使用 SOLO Builder 智能体进行 AI 编程
2. 集成 Supabase 服务，用于用户认证和数据存储（点击连接、去授权即可）



### 4.2 自定义智能体

参考资料：https://juejin.cn/post/7583983152324378650

在 Trae 中创建自定义智能体可以帮你高效处理各种任务。

我的自定义智能体：

![image-20260209205437154](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260209205438309.png)



## 5. 上下文 Context

### 5.1 代码索引

对工作区中的代码进行全局索引构建，发起`#Workspace`问答时将自动全局检索与问题相关的跨文件上下文，给出与项目更相关的回复。

![image-20260210103602923](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210103604113.png)

```
#Workspace 说明一下当前项目有哪些文件，都是什么功能
```

输出结果与预期一致。



### 5.2 忽略配置

设置 TRAE 在索引仓库时需要忽略的文件列表，这些规则将作为 `.gitigonre` 文件中已定义规则的补充，允许你你指定额外的排除条件。

即：通过将 .gitignore 文件添加到根目录来控制哪些文件/文件夹被忽略。

* 提升索引速度：排除依赖目录（比如 node_modules/、vendor/）、构建输出目录（比如 build/、out/）、大型媒体/数据文件（比如 x.mp4、x.mov）
* 避免干扰：某些文件与当前任务无关

![image-20260210104840240](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210104841616.png)

配置规则与代码项目中常规使用的 .gitignore 不上传 git 仓库的内容规则一致。



### 5.3 文档集

可以理解为创建知识库，通过 URL 或 本地上传的方式添加常用的文档集作为上下文与 AI 问答。

* URL 方式（举例 mybatis-plus 的官方文档：https://baomidou.com/introduce/）

![image-20260210111710338](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210111711284.png)

* 仅支持 `.md` 和 `.txt` 文档格式。

![image-20260210105443717](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210105444798.png)

```
根据 #Doc:Mybatis-Plus文档 总结主键生成的策略有哪几种？
```

输出结果与预期一致。



### 5.4 #号引用上下文

参考文档：https://docs.trae.cn/ide/number-sign

[#Code](https://docs.trae.cn/ide/number-sign#a17f8ec4) 可以将`函数或类的相关代码`作为与 AI 助手对话的上下文

[#File](https://docs.trae.cn/ide/number-sign#97cb0d52) 可以将指定`文件中的所有内容`作为与 AI 助手对话的上下文

[#Folder](https://docs.trae.cn/ide/number-sign#669a0690) 可以将指定`文件夹中的所有内容`作为与 AI 助手对话的上下文

[#Workspace](https://docs.trae.cn/ide/number-sign#de84632b) 提出有关`整个工作空间`的问题

[#Doc](https://docs.trae.cn/ide/number-sign#ce804f2d) 可以上传`个人文档集`，将文档内容作为 AI 对话的上下文

[#Problems](https://docs.trae.cn/ide/number-sign#f3341914) AI 会全量分析 **问题** 页签中报告的所有问题并提供解决方案

[#Web](https://docs.trae.cn/ide/number-sign#2fed4a73) 可以将`线上网站的内容`作为 AI 对话的上下文，可以理解为`联网`的AI操作和总结输出



## 8. 规则 Rules

Rules 是给Trae AI 功能生成结果`添加规则和限制`，让 Trae 生成的代码贴合团队规范，主要的作用如下：

* 约束代码风格（如强制驼峰命名、要求方法写注释等）
* 能限定技术选型（如指定优先使用某技术/框架/库，禁止使用某组件/框架/库等）
* 提前指定配置参数（如提前设置连接数据库方式、账号密码等）

### 8.1 个人规则

示例：user_rules.md

```markdown
- 我使用 Java 17 或更高版本。
- 遵循标准的 Java 命名规范:类名用 PascalCase，方法和变量用 camelCase，常量全大写加下划线
- 所有 pubtic 方法必须包含完整的 Javadoc 注释，包括 @param、@return 和 @throws。
- 优先使用不可变对象和 final 关键字(如 final class、final fields)。
- 避免使用 Lombok;显式编写 getter/setter 和构造函数。
- 异常处理应具体，避免捕获通用 Exception，优先抛出或记录有意义的异常。
- 使用 SLF4J 进行日志记录，而不是 System.out.
- 依赖注入使用 SpringFramework (如适用)，偏好构造器注入而非字段注入。
- 单元测试使用 JUnit 5 + Mockito，每个业务类都应有对应的测试类。
```

![image-20260210113633593](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210113635157.png)





### 8.2 项目规则

示例：project_rules.md

```markdown
- 本项目是一个基于 Spring Boot 3.2 的 RESTful后端服务。
- 包结构遵循:
    com.example.myapp
    ├─controller
    ├─service
    ├─repository
    ├─model
    ├─dto
    └─config
- Controller层只负责HTTP映射和参数校验，不包含业务逻辑。
- 所有请求/响应使用 DTO(Data Transfer Object)，禁止直接暴露 Entity。
- 数据库使用 MySQL 8.0，实体类放在 model包，使用 Jakarta Persistence 注解。
- 全局异常处理通过 @ControllerAdvice 实现。
- 使用 Jakarta Validation (如 @NotBlank，@NotNull)进行参数校验。
- 配置文件使用 application.yml，敏感信息通过环境变量注入。
- 构建工具为Maven，依赖统一管理在dependencyManagement 中。
```

![image-20260210113936927](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210113938429.png)



### 8.3 上下文索引重建

创建完个人规则和项目规则后，最好在【上下文】中进行`重建索引`，让规则都生效。

![image-20260210115519774](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210115521360.png)



## 9. 技能 Skills - 未完待续...

未完待续...







## 10. 案例

### 10.1 案例1：数据分析可视化

1. 依赖：Node.js 和 npm

2. 配置：mcp-server-chart

   * 手动添加配置 mcp server

   * github 搜索 [mcp-server-chart](https://github.com/antvis/mcp-server-chart)，找到配置的 json

On Mac system:

```json
{
  "mcpServers": {
    "mcp-server-chart": {
      "command": "npx",
      "args": ["-y", "@antv/mcp-server-chart"]
    }
  }
}
```

On Window system:

```json
{
  "mcpServers": {
    "mcp-server-chart": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@antv/mcp-server-chart"]
    }
  }
}
```

![image-20260210161622175](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210161623372.png)

3. 需要使用 【Builder with MCP】 就会自动关联 MCP 服务 

![image-20260210161730267](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210161731359.png)

![image-20260210161904233](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210161905364.png)

sales_data.md 中是表格数据：

![image-20260210162014814](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210162015974.png)

```
#File:sales_data.md 请帮我只做2023年各类商品销售数据对比的柱状图
```

4. 生成的是一个 .html 文件，预览与预期目标一致

扩展：

![image-20260210162331171](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210162332397.png)

2025热词.md

![image-20260210162450312](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210162451586.png)



### 10.2 案例2：文档可视化

使用 @Builder 或 @Builder with MCP 都可以，提示词参考：

```markdown
请参考 #File:atxtfile.txt 生成可视化的报告网页
## 内容要求
- 将文档生成一个页面
- 所有页面内容必须为简体中文
- 保持原文件的核心信息，但以更易读、可视化的方式呈现
## 设计风格
- 整体风格参考Linear App的简约现代设计
- 使用清晰的视觉层次结构，突出重要内容
- 配色方案应专业、和谐，适合长时间阅读
## 技术规范
- 使用HTML5、TailwindCSs 3.0+(通过CDN引入)和必要的JavaScript
- 实现完整的深色/浅色模式切换功能，默认跟随系统设置
- 代码结构清晰，包含适当注释，便于理解和维护
```

![image-20260210162855521](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210162857182.png)





### 10.3 案例3：坦克大战小游戏

![image-20260210163410978](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210163412055.png)

优化后的提示词：

```
请设计并开发一款经典坦克大战小游戏，要求包含以下核心功能和技术规范：

1. 游戏核心机制：
   - 玩家控制坦克在网格地图中移动、射击
   - 敌方坦克具备基本AI行为，能够自动移动和攻击
   - 可破坏的障碍物系统（如砖块、钢铁等不同防御等级的障碍物）
   - 玩家生命值和关卡系统，随着关卡提升增加难度

2. 游戏界面要求：
   - 清晰的游戏区域显示
   - 玩家生命值、分数、关卡等状态信息展示
   - 开始、暂停、结束等游戏状态控制界面
   - 响应式设计，适配不同屏幕尺寸

3. 技术实现要求：
   - 使用HTML5 Canvas或WebGL进行图形渲染
   - 采用面向对象编程思想组织代码结构
   - 实现碰撞检测系统，处理坦克与障碍物、子弹与坦克等碰撞逻辑
   - 添加游戏音效和背景音乐增强体验

4. 开发与测试要求：
   - 代码需包含详细注释，遵循良好的编程规范
   - 实现基本的游戏测试用例，确保核心功能正常运行
   - 优化游戏性能，确保流畅的动画效果（目标帧率60FPS）

5. 可扩展性考虑：
   - 预留未来功能扩展接口（如多人模式、自定义地图等）
   - 代码结构模块化，便于维护和功能迭代

请提供完整的游戏实现代码，包括HTML、CSS和JavaScript文件，并附带简要的开发文档说明游戏架构和核心算法实现。
```



### 10.4 案例4：+Kimi 生成智能翻译插件

1_智能文本助手插件需求说明.md

```markdown
## 实现一款Chrome插件，要包含两个功能：
- 翻译选中的段落或者关键词（支持中文和英文翻译）
- 朗读选中的段落或关键词
## 具体说明：
- 当选中段落或关键词时，除夕拿插件，直接悬浮在选中关键词和段落上（功能按钮显示顺序：翻译、朗读）
- 翻译的结果直接在悬浮的下方出现结果即可
- 翻译语言选择（翻译目标：中文还是英文）
- 翻译功能使用kimi的api实现即可，具体参考配置kimi api文档
- 朗读直接调用chrome浏览器内置插件
- 写好readme文档，并说明如何部署 chrome 插件的过程
```

准备工作：配置 kimi API 文档集 → 添加文档集(通过kimi文档的URL) → 申请Kimi API Key

```
#File:1_智能文本助手插件需求说明.md 根据插件需求文档，写一份项目的UI文本设计图，将设计图写到 2_智能文本助手UI设计图.md 文件中，要求页面简洁大方，方便用户操作。
```

```
#File:1_智能文本助手插件需求说明.md
#File:2_智能文本助手UI设计图.md  基于需求和UI设计图，直接在当前文件夹下实现插件功能，同时提取单独配置文件用于填写kimi api url和key的位置！代码添加中文注释，实现后再次自检查，确保插件正常运行和实现所需功能。
```

测试验证跟期望很接近，可用。



### 10.5 案例5：+Figma 生成前端页面

Figma 是一款基于云端的界面设计和协作工具，主要用于用户界面（UI）和用户体验（UX）设计。

简单来说，它可以设计网站、手机APP、软件等数字产品界面的强大工具。

官网：https://www.figma.com/

第一步：注册和登陆，通过邮箱来注册和登陆。

第二步：创建访问 Figma 的 Token

* 【`Settings`】->【`Security`】->【`Generate new token`】，取个 token 名字，勾选权限（`所有`的都可以勾上）->【Generate token】

第三步：Trae 中添加 Figma MCP，需要填入 `token` 才能添加成功。

![image-20260210170224013](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210170225375.png)

![image-20260210171225666](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210171226823.png)

第四步：在 Figma 中找到要生成的页面设计风格（也可以自己创建对应的风格 或 导入 UI 设计），打开页面风格详情→`复制链接地址`（Copy link to selection）

![image-20260210171307247](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210171156609.jpg)

![image-20260210171307248](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210171308409.png)



第五步：在 Trae 生成前端页面，需要选择 @Builder with MCP 智能体

```
https://www.figma.com/xxx 还原设计页面代码，并帮我生成页面需要的所有图片
```

测试验证跟期望很接近，可用。





















