---
title: 02-Trae IDE多角色Skills技能包
date: 2026-01-22 23:05:43
index_img: https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210171959188.png
tags: 
- ai
- Trae
- Skills
categories:
- 00_先利其器
- 09_Trae
---

![image-20260210171725390](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260210171726358.png)



参考资料：

* Trae 官网：https://www.trae.cn/
* Trae 官方教程：https://docs.trae.cn/ide/what-is-trae?_lang=zh
* Trae Skills 实用技巧：https://forum.trae.cn/t/topic/157

## 主流 AI Agent Skill 网站

截止 2026 年 2 月数据，Trae 中推荐使用 SkillsMP、skills.sh 这两个。

|  网站名称   |        访问域名        | Skill 数量 |                           核心优势                           |                           适用场景                           |                       Trae 兼容性说明                        |
| :---------: | :--------------------: | :--------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|  SkillsMP   | https://skillsmp.com/  |  77,000+   | 1. 全球最大的 Skill 聚合平台<br />2. 智能搜索 + 质量评分系统<br />3. 支持 Claude/Cursor/Antigravity 等多平台<br />4. 完全免费开源 | 技能快速搜索、高质量技能筛选、跨平台技能使用、一键复制技能代码 | `支持通过 MCP 协议兼容，可通过 skills-hub 工具同步到 Trae IDE` |
|  skills.sh  |   https://skills.sh/   |   9,700+   | 1. Vercel 官方维护，权威背书<br />2. 流行趋势排行榜<br />3. 一键安装，多 agent 支持<br />4. 每日更新，开源免费 |      初学者入门、跟随技能流行趋势、快速安装官方认证技能      |   `原生支持 npx skills CLI 生态系统，可直接在 Trae 中使用`   |
| Skills.pub  |  https://skills.pub/   |   5,000+   | 1. 中文精选，适合国内用户<br />2. 分类清晰，质量严格筛选<br />3. 提供详细使用教程<br />4. 社区活跃，中文支持完善 |   中文用户查找技能、学习技能使用方法、参与中文技能社区讨论   |        部分技能支持 MCP 协议，可通过转换工具适配 Trae        |
| Smithery.ai |  https://smithery.ai/  |   3,000+   | 1. 技能激活次数与 GitHub stars 显示<br />2. 一站式技能创建工具<br />3. 支持技能变现<br />4. 开发者友好，封装简单 |     技能开发与变现、查看技能实际使用热度、创建自定义技能     |     部分技能支持 MCP 协议，可通过 mcp-dock 工具适配 Trae     |
|  SkillsLLM  | https://skillsllm.com/ |   8,000+   | 1. 多模型适配，支持 GPT/Claude 等<br />2. 行业垂直分类<br />3. 技能组合推荐<br />4. 企业级技能定制 |       行业特定技能查找、多模型技能使用、企业级技能部署       |   部分企业级技能支持 Trae API 集成，需联系平台获取适配方案   |

> Trae（或者类似的 AI 编程工具，如 Cursor、Windsurf 等）中的“Skills”（技能/代理）通常指的是**自定义的 AI 助手角色或系统提示词**。配置好技能能让 AI 更精准地理解你的需求，而不是每次都从头解释。

## 一、Trae 的 Skill 长什么样？

根据 Trae 官方文档，一个 Skill 就是给 Agent 的**专业能力说明书**，本质上是一个文件夹，里面至少有一个 SKILL.md，包含：

- 顶部：markdown 前置元数据（name、description）
- 正文：用自然语言写的**步骤/规范/示例**，典型结构（也兼容 Anthropic 的 Agent Skills 标准）

```
my-skill/
  └─ SKILL.md      （必须：名称 + 描述 + 流程说明）
  └─ *.md/*.py/*...（可选：参考文档、脚本、模板等）
```

简单最小示例（官方模板风格）：

```markdown
---
name: my-skill-name
description: 这个技能是做什么、在什么场景下使用
---
# 技能名称
- 步骤 1：做…
- 步骤 2：做…
```

Trae 的官方说明也强调：Skill 就是**专业能力文档**，用来固化最佳实践和流程。

## 二、编程开发技能包模板

说明：

- 每个 Skill 都有一段 markdown 元数据 + 正文
- 你可以把 name / description 按需改成中文或更具体
- Trae 会根据 description 自动判断什么时候用这个 Skill（所以描述要尽量**场景化**）

#### 1）代码审查与重构 Skill（强推必配）

适用：写完功能、提 PR 前，让 AI 自检。

```markdown
---
name: code-reviewer
description: 用于对代码进行系统化审查和重构建议：检查安全性、可读性、性能、是否遵循团队规范，并给出可执行的修改方案。
---
# 代码审查与重构专家
## 审查范围
- 逻辑正确性
- 潜在安全风险（SQL 注入、XSS、敏感信息泄露等）
- 可读性与命名规范
- 性能瓶颈（N+1 查询、大循环中的重操作）
- 异常处理与边界条件
## 输出要求
- 先用 3~5 条**要点**列出问题（按优先级排序）
- 对每个问题：
- 说明风险/影响
- 给出修改后的代码片段或重构建议
- 如涉及团队规范（如命名风格），引用对应的规范条目
## 注意事项
- 优先修复安全与正确性问题
- 不要做过度优化，只点出真正影响性能的瓶颈
- 尽量保持原有接口签名，避免破坏调用方
```

#### 2）团队编码规范 Skill

适用：团队统一前端代码风格，防止每个人风格不一致。以前端 Vue 示例，可换成 React / Angular

* 后端版可以替换成 Java/Go/Python 的规范，例如包命名、接口设计、异常处理等。

```markdown
---
name: frontend-vue-style-guide
description: 当为 Vue 项目编写或修改组件时，自动按照团队约定规范进行代码风格与结构约束。
---
# 前端 Vue 项目编码规范
## 文件命名
- 组件文件使用 PascalCase，如：UserProfile.vue
- 工具函数文件使用 kebab-case，如：user-utils.ts
## 组件结构
- 单文件组件必须包含三个块：<template>、<script>、<style>
- 在 <script> 中使用 Composition API 时，统一将 setup 写法写在 <script setup> 中
## CSS 类命名
- 使用 kebab-case，如：user-profile、btn-primary
- 避免用标签名作为类名
## 注释要求
- 对复杂业务逻辑添加中文注释，说明**为什么这么做**
- 公共组件必须在其文件顶部添加用途说明注释
## 代码检查步骤
1. 检查文件命名是否符合上述规则
2. 检查组件结构是否完整
3. 检查类名和函数名是否符合命名约定
4. 检查是否为复杂逻辑添加了必要的注释
5. 如不符合，指出具体位置并给出修改建议
```

#### 3）单元测试生成器 Skill

适用：写完函数/类后，一键补齐测试用例。

```markdown
---
name: unit-test-generator
description: 根据选中的函数或类，自动生成完整、可运行的单元测试用例，覆盖正常、边界和异常情况。
---
# 单元测试生成器
## 测试框架选择
- 默认使用项目现有测试框架（如：Jest、Vitest、JUnit、PyTest）
- 如果检测不到，先询问用户确认框架
## 覆盖策略
对每个函数/方法：
- 至少 1 条正常路径用例
- 至少 2 条边界/异常情况用例
- 如有分支逻辑，每条分支至少一个用例
## 输出格式
- 按文件组织测试代码，与源码目录结构保持一致
- 为每个测试用例添加简短中文注释说明测试意图
- 如涉及 Mock，使用项目已有的 Mock 库和风格
## 步骤
1. 读取目标函数/类及其依赖
2. 列出关键路径和可能的异常
3. 生成测试代码
4. 标注哪些用例需要用户补充业务数据
```

#### 4）技术文档README生成 Skill

适用：项目初始化、对外开源、交接时自动生成文档。

```markdown
---
name: doc-writer
description: 根据当前项目或选中文件生成/更新 README 或技术文档，包含项目简介、快速开始、结构说明、示例代码等。
---
# 技术文档 / README 生成器
## 文档结构
- 项目简介（1~2 段话）
- 主要功能列表
- 技术栈（语言、框架、关键依赖）
- 快速开始（安装、运行、验证）
- 目录结构说明
- 使用示例（可包含代码片段）
- 常见问题（可选）
## 信息来源
- 优先从 package.json / pom.xml / requirements.txt 提取依赖
- 从项目主要入口文件提取关键 API 和使用方式
- 如已有 README，则在原有基础上增量更新，不覆盖已有手动内容
## 输出方式
- 默认输出为 Markdown
- 如目标文件存在，采用**更新模式**：新增段落前给出对比摘要
- 如涉及变更多个文件，先用列表说明将要修改的文件清单
```

#### 5）中文注释规范 Skill

适用：希望 AI 生成的代码注释统一用中文。示例来自 Trae 教程，以 Python 为例

```markdown
---
name: chinese-comment-style
description: 强制所有生成/修改的 Python 代码必须使用中文注释，并在每个函数上方添加中文功能说明。
---
# 代码注释规范（中文）
## 注释语言
- 所有 Python 代码的注释必须使用中文
## 函数级注释
- 每个函数上方必须有中文说明：
- 函数是做什么的
- 参数含义和类型
- 返回值含义
## 行内注释
- 对复杂逻辑行，在右侧或上方添加中文解释，说明**为什么**而不是**做了什么**
## 检查步骤
1. 扫描所有函数定义
2. 确认是否存在中文注释
3. 如缺失，自动补齐
4. 确保注释语言为中文
```

#### 6）Java+Spring Boot后端专家 Skill

适用：后端是 Spring Boot 的项目，让 AI 按团队约定生成代码。

```markdown
---
name: java-spring-boot-expert
description: 在创建或修改 Spring Boot 项目代码时，按团队约定的分层结构、异常处理、日志规范进行开发。
---
# Java Spring Boot 开发规范
## 分层结构
- Controller 层：只做参数校验、调用 Service、返回 DTO
- Service 层：业务逻辑，事务边界
- Repository/Mapper 层：数据库访问
- 禁止跨层直接访问（如 Controller 直接调 Repository）
## 命名规范
- 类名使用 PascalCase，如 UserService
- 方法名使用 camelCase，如 getUserById
- 常量全大写下划线分隔，如 MAX_RETRY_COUNT
## 异常处理
- 不在代码中吞掉异常
- 使用统一的业务异常类型（如 BusinessException）
- 在 Controller 层统一异常处理与错误响应格式
## 日志规范
- 关键业务入口、出口必须记录日志（INFO）
- 异常情况必须记录异常堆栈（ERROR）
- 日志中避免输出敏感信息
## 步骤
1. 分析新增/修改涉及的类和接口
2. 确保分层正确、调用路径清晰
3. 检查异常处理是否符合统一规范
4. 补齐必要的日志记录
```

#### 7）Python FastAPI 专家 Skill

适用：Python Web / API 项目。

```markdown
---
name: python-fastapi-expert
description: 为 FastAPI 项目生成符合团队规范的接口代码：路由分组、依赖注入、统一响应格式、异常处理与校验。
---
# Python FastAPI 开发规范
## 路由组织
- 按业务模块拆分路由文件，如 routers/user.py、routers/order.py
- 使用 APIRouter 进行路由分组，统一前缀（如 /api/v1/users）
## 请求与响应
- 使用 Pydantic 模型定义请求体和响应体
- 统一响应格式：{ "code": int, "msg": str, "data": Any }
## 校验与异常
- 优先用 Pydantic 做参数校验
- 捕获已知异常，返回统一错误信息
- 不暴露内部实现细节和堆栈到客户端
## 依赖注入
- 复用 get_db 之类依赖注入数据库连接
- Service 层通过依赖注入传入 Router
## 步骤
1. 确认请求/响应模型已定义
2. 确认路由分组和前缀
3. 检查异常处理是否符合统一格式
4. 检查是否缺少必要的日志与监控埋点
```

#### 8）安全与敏感信息检测 Skill

适用：代码提交前做一轮安全自查（防止密钥、硬编码等）。

```markdown
---
name: security-audit
description: 扫描代码中是否存在明显的安全风险与敏感信息泄露，包括硬编码密钥、不安全的 SQL/命令拼接等。
---
# 安全与敏感信息扫描
## 扫描范围
- 是否存在硬编码的密钥、密码、Token、AK/SK
- 是否存在 SQL/命令拼接（拼接字符串而非参数化查询）
- 是否存在默认账号密码、测试账号残留
- 是否存在敏感日志输出（如打印身份证号、银行卡号）
## 输出格式
- 对每个问题，按**风险等级（高/中/低）**标注
- 指出具体文件和行号
- 给出修复建议（如移至环境变量、使用参数化查询、脱敏日志）
## 注意事项
- 误报难免，请对每条进行人工确认
- 不要对已经明确标注为**测试/示例**的代码做过于严格的要求，但仍需提醒
```

## 三、Trae 使用 Skill

根据 Trae 的 Skills 设计（类似 Anthropic 的 Agent Skills 标准）：

#### 1）目录放置（两种常见方式）

- **项目级**：只对当前项目生效，适合*团队统一规范*使用
  - 路径示例：`<workspace-root>/.agent/skills/<skill-name>/SKILL.md`
  
- **全局级**：对本机所有项目生效，适合*个人常用技能*使用
  - 不同工具路径略有差异，Trae IDE 在 `~/.trae/skills/<skill-name>/SKILL.md` （或配置项里指定）
  

#### 2）创建步骤（通用）

- 在 Trae 里：
  1. 新建文件夹，例如 `code-reviewer`
  2. 在文件夹里新建 `SKILL.md`，把上面的模板粘贴进去
  3. 保存


#### 3）使用方式（Chat / Builder模式）

- 自动触发：
  - 当你在对话里提到**帮我审查这段代码**、**按团队规范重构一下**等，Trae 会扫描可用 Skills，根据 description 匹配并自动加载对应 Skill（注意 description 要写清楚**何时使用**）
- 手动指定（如果自动匹配不准）：
  - 可以用类似语句：
    - **请使用 code-reviewer 技能，审查当前文件。**
    - **用 unit-test-generator 为 UserService 生成测试。**

## 四、组合使用

推荐 3 个必配 + N 个按需选：

#### 4.1 必配（几乎所有项目都能用）

- `code-reviewer`：代码审查与重构
- `unit-test-generator`：单元测试生成
- `doc-writer`：文档/README 生成

#### 4.2 按技术栈选

- 前端：`frontend-vue-style-guide`（或改成 React / Angular 版）
- 后端 Java：`java-spring-boot-expert`
- 后端 Python：`python-fastapi-expert`

#### 4.3 按团队规范/公司要求选

- `chinese-comment-style`：统一用中文注释
- `security-audit`：安全与敏感信息扫描

## 五、注意

- **别一次加太多**：先上 3~5 个高频技能，用顺手了再加；
- **description 尽量**场景化：例如 `在 Spring Boot 项目中新增或修改接口时使用` 这类描述，有助于 Trae 自动匹配；
- **结合企业规范**：如果你公司有现成的编码规范 PDF / Wiki，可以提炼成 Skill 里的**步骤和 checklist**，这样 AI 会严格按规范干活。

