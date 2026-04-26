---
title: 04-Git 常用命令
date: 2020-3-19 21:59:54
tags:
- Git
- czg
categories: 
- 12_项目管理
- 01_Git
---

![image-20200616223337238](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200616223339.png)

参考资料：

* czg(cz-git)官网：https://cz-git.qbb.sh/zh/cli/



# czg 标准化提交

`czg` 是一款轻量化的 Commitizen 命令行工具，核心作用是**标准化 Git 提交信息**（遵循 Conventional Commits 规范），解决提交信息杂乱、不统一的问题，方便后续生成 Changelog、版本管理。下面从「环境准备→日常提交→定制化配置→常见场景」全维度说明日常开发中的使用方式：

------

### 一、安装与初始化

#### 1. 安装 czg

```bash
# npm 安装（推荐，需先安装 Node.js）
npm install -g czg

# 或 yarn/pnpm
yarn global add czg
pnpm add -g czg
```

#### 2. 项目级初始化

虽然 czg 可全局使用，但为项目配置专属的提交规范（如自定义提交类型、范围），需在项目根目录执行：

```bash
# 初始化 czg 配置（生成 .czrc 或 package.json 中的 config 字段）
czg init
```

执行后会弹出交互选项，按项目需求选择：

- **提交规范**：默认选 `Conventional Commits`（通用规范）；
- **配置文件位置**：推荐选 `.czrc`（独立配置文件，不污染 package.json）；
- **是否自定义提交类型**：初期选「否」，后续可按需调整。

------

### 二、代码提交完整流程

#### 步骤 1：完成开发，暂存代码

```bash
# 查看修改的文件
git status

# 暂存所有修改（或指定文件 git add xxx.java）
git add .
```

#### 步骤 2：使用 czg 替代 git commit，生成标准化提交信息

```bash
# 核心命令：启动 czg 交互界面
czg commit
# 简写：czg c
```

执行后会进入**交互式提问流程**，按提示填写即可（示例如下）：

```bash
# 第一步：选择提交类型（必填，按上下键选择，回车确认）
? 选择提交类型 (Use arrow keys)
> feat: 新功能 (A new feature)
  fix: 修复 bug (A bug fix)
  docs: 仅文档修改 (Documentation only changes)
  style: 代码格式修改（不影响代码逻辑）(Changes that do not affect the meaning of the code)
  refactor: 重构（既不是新增功能，也不是修复 bug）(A code change that neither fixes a bug nor adds a feature)
  perf: 性能优化 (A code change that improves performance)
  test: 增加/修改测试用例 (Adding missing tests or correcting existing tests)
  build: 构建相关（如依赖、打包配置）(Changes that affect the build system or external dependencies)
  ci: CI/CD 配置修改 (Changes to our CI configuration files and scripts)
  chore: 其他不修改 src/test 的操作 (Other changes that don't modify src or test files)
  revert: 回滚提交 (Reverts a previous commit)

# 第二步：填写提交范围（可选，如模块名、功能名，回车跳过则为空）
? 填写提交范围 (可选) → user-service

# 第三步：填写提交标题（必填，简洁描述改动，≤50 字符）
? 填写提交标题 → 优化用户列表查询接口性能

# 第四步：填写提交描述（可选，详细说明改动，回车跳过）
? 填写提交描述 (可选) → 1. 优化 SQL 索引；2. 增加 Redis 缓存，响应时间从 500ms 降至 50ms

# 第五步：是否是破坏性变更（可选，如接口兼容、数据库结构变更）
? 是否是破坏性变更? (y/N) → N

# 第六步：是否关联 Issue（可选，如 Jira 单号、GitLab Issue）
? 填写关闭的 issues (可选，例如: #123, #456) → WM-1234
```

#### 步骤 3：确认提交，完成操作

所有信息填写完成后，czg 会自动生成标准化的提交信息并执行 `git commit`，最终提交信息格式如下：

```bash
feat(user-service): 优化用户列表查询接口性能

1. 优化 SQL 索引；2. 增加 Redis 缓存，响应时间从 500ms 降至 50ms

Closes #WM-1234
```

- 格式规范：`类型(范围): 标题\n\n描述\n\n关联Issue`；
- 优势：机器可解析，后续可通过 `standard-version` 自动生成 Changelog、更新版本号。

#### 步骤 4：推送到远程仓库

```bash
git push origin 分支名
```



### 三、快捷操作与定制化

#### 1. 快捷提交

```bash
# 直接指定类型+标题，跳过其他交互
czg c --type feat --subject "新增订单导出功能"

# 指定类型+范围+标题
czg c --type fix --scope order-service --subject "修复订单支付状态更新失败问题"

# 提交并跳过校验（谨慎使用，仅临时紧急提交）
czg c --no-verify
```

#### 2. 自定义提交类型

如果默认的提交类型（feat/fix 等）不满足业务需求（如新增「需求」「bugfix」「优化」等），可修改项目根目录的 `.czrc` 文件：

```json
{
  "types": [
    { "value": "feat", "name": "feat: 新功能" },
    { "value": "fix", "name": "fix: 修复 bug" },
    { "value": "req", "name": "req: 需求迭代" }, // 自定义类型
    { "value": "opt", "name": "opt: 性能优化" }, // 自定义类型
    { "value": "docs", "name": "docs: 文档修改" }
  ],
  "scopes": [
    "user-service", "order-service", "wm-service", "common" // 自定义常用范围
  ]
}
```

修改后再次执行 `czg c`，交互选项会显示自定义的类型 / 范围，减少手动输入成本。

#### 3. 结合 husky 强制使用 czg 提交

为避免团队成员直接使用 `git commit` 提交不规范信息，可通过 `husky` 配置提交钩子：

```bash
# 安装 husky
npm install husky --save-dev

# 启用 husky 钩子
npx husky install
npx husky add .husky/commit-msg 'npx --no -- czg check $1'
```

配置后，若有人直接执行 `git commit -m "随便写的提交信息"`，husky 会触发校验，不符合规范则拒绝提交，强制使用 `czg c`。



### 四、常见问题与解决方案

#### 1. 执行 czg 提示 command not found

- 原因：Node.js 全局包路径未加入系统环境变量；
- 解决：找到 npm 全局包路径（`npm root -g`），将该路径下的 `bin` 目录加入系统 PATH。

#### 2. 不想全局安装 czg，仅项目内使用

```bash
# 项目内安装
npm install czg --save-dev

# 配置 package.json 脚本
{
  "scripts": {
    "commit": "czg c"
  }
}

# 执行提交
npm run commit
```

#### 3. 提交信息需要支持中文

czg 原生支持中文，无需额外配置，填写标题 / 描述时直接输入中文即可（建议标题简洁，描述可详细）。



### 五、日常使用总结

|   场景   |            命令 / 操作             |          核心目的          |
| :------: | :--------------------------------: | :------------------------: |
| 首次配置 |             `czg init`             |    生成项目专属提交配置    |
| 常规提交 |        `git add . && czg c`        |       标准化提交信息       |
| 快捷提交 | `czg c --type fix --subject "xxx"` |   减少交互步骤，提升效率   |
| 团队规范 |  结合 husky 配置 commit-msg 钩子   | 强制使用 czg，统一提交规范 |
|  定制化  |    修改 .czrc 中的 types/scopes    | 适配项目业务，减少手动输入 |

使用 czg 的核心价值是「**标准化、可追溯、自动化**」：标准化的提交信息便于团队协作和代码追溯，后续可基于这些信息自动生成版本日志（Changelog）、触发版本号更新（如 feat 对应小版本 + 1，fix 对应补丁版本 + 1），提升研发流程效率。

如果需要针对你的项目（如 Java 微服务）定制 `.czrc` 配置文件，或配置 husky 强制提交规范



# Husky 强制提交规范

以下是**从 0 到 1 配置 Husky** 的完整步骤，包含「安装依赖→配置钩子→强制 czg 提交→校验提交信息格式」，适配 Java / 前端等所有项目类型，可直接复制使用。



### 一、前置条件

1. 项目已初始化 Git（`git init` 完成）；
2. 项目已安装 Node.js（推荐 16+ 版本，用于安装 husky 等依赖）；
3. 已全局 / 项目内安装 `czg`（若未安装，步骤中会补充）。



### 二、完整配置步骤

#### 步骤 1：初始化 package.json

Java 项目通常没有 `package.json`，需先初始化：

```bash
# 初始化 package.json（一路回车默认配置即可）
npm init -y
```

#### 步骤 2：安装核心依赖

```bash
# 安装 husky（提交钩子工具）、@commitlint/cli + @commitlint/config-conventional（提交信息校验规则）
npm install husky @commitlint/cli @commitlint/config-conventional --save-dev

# （可选）若未安装 czg，项目内安装（避免全局依赖）
npm install czg --save-dev
```

#### 步骤 3：启用 Husky 钩子

```bash
# 启用 husky（生成 .husky 目录）
npx husky install

# 配置 npm 脚本，确保项目克隆后自动启用 husky（团队协作必备）
npm set-script prepare "husky install"
```

#### 步骤 4：配置 commitlint 校验规则

在项目根目录创建 `commitlint.config.js` 文件，内容如下：

```bash
// commitlint.config.js
module.exports = {
  // 继承官方的 Conventional Commits 规则
  extends: ['@commitlint/config-conventional'],
  // 自定义规则（适配 czg 生成的提交信息，可根据项目调整）
  rules: {
    // 提交类型必须在指定列表内（和 czg 的 types 对应）
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert', 'opt', 'req'] // 包含自定义类型
    ],
    // 提交类型不能为空
    'type-empty': [2, 'never'],
    // 提交标题不能为空
    'subject-empty': [2, 'never'],
    // 提交标题长度限制（≤50 字符）
    'subject-max-length': [2, 'always', 50],
    // 范围可选，若填写则不能为空
    'scope-empty': [1, 'never'],
    // 提交信息大小写不强制（适配中文标题）
    'subject-case': [0, 'never']
  }
};
```

#### 步骤 5：添加 Husky 钩子

添加 2 个关键钩子：`pre-commit`（提交前校验）、`commit-msg`（校验提交信息格式）。

##### ① 添加 commit-msg 钩子

```bash
# 创建 commit-msg 钩子，校验提交信息
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit $1'
```

执行后会生成 `.husky/commit-msg` 文件，内容如下（无需修改）：

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

##### ② 添加 pre-commit 钩子

强制使用 czg 提交，禁止直接 git commit

```bash
# 创建 pre-commit 钩子
npx husky add .husky/pre-commit
```

编辑生成的 `.husky/pre-commit` 文件，替换内容为：

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 检查是否通过 czg 提交（判断 COMMIT_EDITMSG 内容是否为 czg 生成）
# 核心逻辑：若不是 czg 提交，直接终止并提示使用 czg
COMMIT_MSG_FILE=".git/COMMIT_EDITMSG"
# 获取提交信息第一行
FIRST_LINE=$(head -n1 $COMMIT_MSG_FILE)
# 判断是否符合 Conventional Commits 格式（czg 生成的信息会匹配该正则）
if ! echo "$FIRST_LINE" | grep -qE '^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert|opt|req)(\(.+\))?: .+'; then
  echo "=============================================="
  echo "❌ 错误：提交信息不符合规范，请使用 czg 提交！"
  echo "✅ 正确命令：npm run commit 或 czg c"
  echo "=============================================="
  exit 1
fi
```

#### 步骤 6：配置 package.json 快捷脚本

可选，提升团队使用效率。

编辑 `package.json`，添加快捷命令：

```json
{
  "scripts": {
    "prepare": "husky install",
    "commit": "czg c", // 快捷提交命令
    "commit:check": "commitlint --config commitlint.config.js --edit" // 校验提交信息
  }
}
```



### 三、配置验证

#### 测试 1：直接使用 git commit 提交不规范信息

```bash
git add .
git commit -m "随便写的提交信息"
```

预期结果：

```text
==============================================
❌ 错误：提交信息不符合规范，请使用 czg 提交！
✅ 正确命令：npm run commit 或 czg c
==============================================
husky - pre-commit hook exited with code 1 (error)
```

#### 测试 2：使用 czg 提交规范信息

```bash
git add .
# 方式 1：使用 npm 脚本
npm run commit
# 方式 2：直接执行 czg
czg c
```

按 czg 交互提示填写信息后，提交成功，且 commitlint 会校验信息格式是否符合规则。

#### 测试 3：提交信息格式错误

若 czg 提交时选择了不在 `commitlint.config.js` 中的类型（如 `test123`），commit-msg 钩子会触发报错：

```text
⧗   input: test123: 测试提交
✖   type must be one of [feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert, opt, req] [type-enum]

✖   found 1 problems, 0 warnings
husky - commit-msg hook exited with code 1 (error)
```



### 四、关键文件说明

|        文件路径        |                          作用                           |
| :--------------------: | :-----------------------------------------------------: |
|     `package.json`     |              包含 husky/czg 依赖、快捷脚本              |
| `commitlint.config.js` |  commitlint 校验规则（定义合法的提交类型、标题长度等）  |
|  `.husky/commit-msg`   |        校验提交信息格式是否符合 commitlint 规则         |
|  `.husky/pre-commit`   | 禁止直接使用 git commit，强制通过 czg 生成规范提交信息  |
|    `.czrc`（可选）     | czg 自定义提交类型 / 范围（需手动创建，参考上一篇回复） |

------

### 五、团队协作注意事项

1. **依赖同步**：将 `package.json`、`package-lock.json` 提交到仓库，团队成员拉取代码后执行 `npm install` 即可同步依赖；
2. **兼容旧提交**：若项目已有历史不规范提交，可配置 `commitlint` 规则为「警告」而非「错误」（将规则中第一个数字从 2 改为 1），逐步过渡；
3. **临时跳过校验**：紧急修复时可通过 `git commit --no-verify -m "xxx"` 跳过钩子（需团队约定慎用）；
4. **中文支持**：commitlint/czg 原生支持中文，提交标题 / 描述可直接写中文，无需额外配置。
