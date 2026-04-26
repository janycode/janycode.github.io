---
title: 06-Github Workflow免费工作流
date: 2020-3-19 21:59:54
tags:
- Git
- github
- workflow
categories: 
- 12_项目管理
- 01_Git
---

![image-20200616223337238](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200616223339.png)

参考资料：

* GitHub Actions 文档：https://docs.github.com/zh/actions



今天终于把 GitHub Actions 的 auto build 自动化构建跑成功了！现在把完整的`从 0 到 1 上手流程`整理出来。

## 一、什么是Workflow

简单定义`GitHub Actions是GitHub官方推出的自动化工具。 可以在GitHub仓库内，自动完成代码提交之后的自动化构建`自动化测试自动化部署等一系列重复操作，无需手动输入命令执行。

本次部署的 auto build 核心作用` 只要向仓库推送新代码，GitHub云端就会自动完成项目编译`项目打包 \` 产物生成，全程无需本地操作，极大简化重复构建流程。

核心文件规则`所有自动化执行逻辑，统一编写在`.github/workflows/`目录下的`.yml 配置文件内，例如本次用到的 auto_build.yml，GitHub 会自动识别并调度执行文件内所有指令。

## 二、前期准备工作

配置工作流之前，提前确认两项基础条件，规避基础报错问题：

### 1. 仓库基础要求

- 项目代码已正常推送至 GitHub 仓库，公开仓库 / 私有仓库均完美适配 Actions 能力

### 2. 核心名词认知

无需死记硬背，简单了解即可：

- `Workflow` 完整自动化工作流整体统称，例如本次搭建的 Auto Build
- `Job` 工作流内独立任务单元，一个工作流可拆分多项不同任务
- `Step` 单个任务下的细分执行步骤，按配置顺序逐行运行
- `Runner`GitHub 免费提供的云端运行服务器，负责远程执行配置脚本，无需自建服务器

## 三、从零搭建工作流

### 1. 创建固定目录与配置文件

在项目仓库根目录，严格按照固定路径新建文件：

```Plain
.github/workflows/auto_build.yml
```

若无 `.github` 文件夹`workflows`子目录，手动逐级新建即可，目录名称大小写不可修改。

### 2. 编写基础通用配置文件

下方为通用小白版本配置，适配多数前端 / 后端项目，全程附带详细注释，可直接复制修改使用：

```yaml
# 工作流展示名称`GitHub Actions页面展示文案，自定义修改
name: Auto Build Project

# 触发规则`定义工作流在何种场景自动运行
on:
  # 推送代码触发`指定监听分支
  push:
    branches: [ main ]
  # 手动触发入口`无需推送代码，页面点击即可测试运行
  workflow_dispatch:

# 任务全局配置
jobs:
  build:
    # 云端运行系统`默认使用Ubuntu稳定版本
    runs-on: ubuntu-latest

    # 分步执行流程
    steps:
      # 步骤1 拉取仓库完整代码`固定依赖，必须保留
      - name: Checkout code
        uses: actions/checkout@v4

      # 步骤2 配置运行环境`根据自身项目切换对应环境
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      # 步骤3 安装项目依赖
      - name: Install dependencies
        run: npm install

      # 步骤4 执行项目构建指令`替换为自身项目真实命令
      - name: Build project
        run: npm run build

      # 步骤5 构建完成提示
      - name: Build success
        run: echo "✅ Auto build completed successfully!"
```

### 3. 关键配置修改说明

| 配置字段         | 核心作用         | 新手修改建议                              |
| ---------------- | ---------------- | ----------------------------------------- |
| on.push.branches | 监听触发分支     | 修改为自身开发分支，例如 dev/test         |
| runs-on          | 云端运行系统     | 固定保留 ubuntu-latest，无需改动          |
| uses 引用指令    | 复用官方封装动作 | 稳定版本无需修改，保证兼容性              |
| run 执行命令     | 自定义脚本指令   | 替换为项目本地可正常运行的打包 ` 编译命令 |

## 四、提交配置并验证工作流

### 1 推送配置文件至远程仓库

执行常规 Git 命令，将新增的工作流配置提交推送：

```bash
git add .github/workflows/auto_build.yml
git commit -m "feat: 新增auto build自动化构建工作流"
git push
```

### 2 查看云端运行状态

1 打开对应 GitHub 仓库主页

2 点击顶部导航栏 Actions 选项卡

3 找到新建的工作流名称，实时查看运行进度

![image-20260426205238798](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260426205240025.png)

状态标识说明 

- `绿色对勾 ` 构建全部流程执行成功
- `红色叉号 ` 流程异常终止，点击进入页面查看日志排错

## 五、auto_build.yml 实例

### 5.1 示例

以下为本人自己的[开源项目](https://github.com/janycode/help-memory-system)真实跑通的完整配置示例，可直接参考复用：

```yaml
name: action自动构建打包（前后端）
on:
  push:
    branches: [ main, master ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: 拉取代码
        uses: actions/checkout@v4

      # ========== 第一步：构建后端（Java） ==========
      - name: 配置JDK 21（后端）
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: maven  # 后端Maven缓存（适配backend目录）
          cache-dependency-path: backend/pom.xml  # 指定后端pom.xml路径

      - name: 后端Maven构建打包
        run: mvn clean package -DskipTests
        working-directory: ./backend  # 进入后端目录执行构建

      # ========== 第二步：构建前端 ==========
      - name: 配置Node.js 20（前端）
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: 前端安装依赖并构建
        run: npm i && npm run build
        working-directory: ./frontend  # 进入前端目录执行构建

      # ========== 第三步：上传构建产物 ==========
      - name: 上传后端jar包
        uses: actions/upload-artifact@v4
        with:
          name: 后端构建包
          path: backend/target/*.jar  # 后端产物路径
          retention-days: 30

      - name: 上传前端静态文件
        uses: actions/upload-artifact@v4
        with:
          name: 前端构建包
          path: frontend/dist  # 前端产物路径（通用dist目录，可根据你的项目调整）
          retention-days: 30
      - name: 微信通知构建成功
        if: success()
        run: |
          curl -X POST ${{ secrets.QYWX_WEBHOOK_URL }} \
          -H "Content-Type: application/json" \
          -d '{
            "msgtype": "markdown",
            "markdown": {
              "content": "## ✅ GitHub自动构建完成\n**项目**：${{ github.repository }}\n**Commit**：${{ github.sha }}\n**构建产物下载**：[点击下载](https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }})\n"
            }
          }'

      - name: 微信通知构建失败
        if: failure()
        run: |
          curl -X POST ${{ secrets.QYWX_WEBHOOK_URL }} \
          -H "Content-Type: application/json" \
          -d '{
            "msgtype": "markdown",
            "markdown": {
              "content": "## ❌ GitHub自动构建失败\n**项目**：${{ github.repository }}\n**Commit**：${{ github.sha }}\n**查看日志**：[点击查看](https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }})\n"
            }
          }'
```

### 5.2 仓库变量

其中涉及到了仓库加密变量的配置：

**项目主页** - `Settings` - `Secrets and variables` - `Repository secrets`

![image-20260426205543831](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260426205545445.png)

### 5.3 区分环境

也就是通过分支名区分环境，比如 test 分支 对应 test 环境，两种方式均可。

方式一：

```yml
on:
  push:
    branches: [ test, uat ]
```

方式二：

```yml
on:
  push:
    branches: 
      - test
      - uat
```



## 六、实操踩坑避坑总结

1. 项目存在子目录时，必须添加路径切换命令，否则会出现文件找不到的报错
2. 国外源下载依赖速度缓慢，统一配置国内镜像源，提升构建效率
3. 本地开发环境与云端运行环境版本保持统一，规避语法兼容类异常
4. 务必开启 workflow_dispatch 手动触发配置，日常调试无需频繁提交代码

