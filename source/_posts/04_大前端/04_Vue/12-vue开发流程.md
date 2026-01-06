---
title: 12-vue开发流程
date: 2022-5-22 21:36:21
tags:
- Vue
- git
- nginx
- 开发流程
categories: 
- 04_大前端
- 04_Vue
---

![image-20200723170734421](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200723170735.png)

参考资料：

* 官网：https://cn.vuejs.org/
* vue2 官方教程：https://v2.cn.vuejs.org/v2/guide/
* vue3 官方教程：https://cn.vuejs.org/guide/introduction.html
* 说明：`Vue 2.0 在 2023 年 12 月 31 日停止更新`。


## 1. 开发流程

### 1.1 git

使用 git bash 客户端工具。

命令使用速查 【项目管理】 >> 【Git】 下的内容。

#### .gitignore 参考

适配前端（React/Vue/Node.js）、全栈项目；若需要提交`package-lock.json`，注释掉对应的忽略行（**推荐保留 lock 文件**，保证多人开发依赖版本一致）。

```gitignore
# ========================= 系统通用文件 =========================
# macOS系统文件
.DS_Store
.AppleDouble
.LSOverride
Icon
._*
.DocumentRevisions-V100
.fseventsd
.Spotlight-V100
.TemporaryItems
.Trashes
.VolumeIcon.icns
.com.apple.timemachine.donotpresent
.AppleDB
.AppleDesktop
Network Trash Folder
Temporary Items
.apdisk

# Windows系统文件
Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN
*.cab
*.msi
*.msix
*.msm
*.msp
*.lnk
*.tmp
*.bak
*.swp
*.swo
*.log
*.cache

# Linux系统文件
*~
.fuse_hidden*
.directory
.Trash-*
.nfs*

# ========================= 编辑器/IDE配置 =========================
# VSCode编辑器（重点）
.vscode/
!.vscode/extensions.json  # 保留推荐插件配置（可选）
!.vscode/settings.json    # 保留项目专属配置（可选）
!.vscode/tasks.json       # 保留任务配置（可选）
!.vscode/launch.json      # 保留调试配置（可选）
.idea/                    # WebStorm/IDEA配置
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# ========================= 语言/框架专属 =========================
# Node.js/JavaScript（前端/后端通用）
# 依赖包（核心，必加）
node_modules/
# 包管理锁文件（根据团队规范选择是否忽略，建议保留lock文件）
# package-lock.json  # 不建议忽略，lock文件保证依赖版本一致
# yarn.lock
# pnpm-lock.yaml
# 编译/构建产物
dist/
build/
out/
coverage/          # 测试覆盖率报告
lib/               # 编译后的库文件
es/                # ES模块产物
umd/               # UMD模块产物
temp/              # 临时构建目录
*.min.js           # 压缩后的JS
*.min.css          # 压缩后的CSS

# TypeScript
*.tsbuildinfo
typings/
types/             # 手动声明文件（若自动生成则忽略）
*.d.ts             # 若手动写声明文件则注释这行

# Vue项目
*.vue.js
.vuepress/dist/
.nuxt/
.vue/

# React项目
.env.local
.env.development.local
.env.test.local
.env.production.local
.next/
.pnp/
.pnp.js

# ========================= 包管理/发布 =========================
# npm/yarn/pnpm
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*
.pnpm-store/
.yarn/cache/
.yarn/unplugged/
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*

# 发布包相关
*.tgz
*.tar.gz
package/
release/

# ========================= 环境/敏感信息 =========================
# 环境变量文件（核心，必加，避免泄露密钥）
.env
.env.*
!.env.example      # 保留示例环境文件
# 敏感配置
config/local.js
config/prod.js
*.pem
*.key
*.cert
secrets/
credentials/

# ========================= 测试/日志 =========================
# 测试文件/报告
test-results/
junit.xml
*.coverage
# 日志文件
logs/
*.log
access.log
error.log

# ========================= 其他 =========================
# 缓存文件
.cache/
.eslintcache
.stylelintcache
# 上传/下载文件
uploads/
downloads/
# 压缩包
*.zip
*.rar
*.7z
# 数据库文件
*.db
*.sqlite
*.sqlite3
# 进程文件
*.pid
*.seed
```



### 1.2 开发流程

瀑布流开发、敏捷开发。

迭代：Daily scrum（**每日站会**-`进度/风险点`）、看板、提测、bug修复、上线。



### 1.3 云服务器

阿里云、腾讯云、华为云、百度云等等。



### 1.4 nginx

参考 【服务器】>>【Nginx】章节内容。

其中windows服务器中对于 nginx 的安装最好用免安装的版本，启动方式与linux一致。



















