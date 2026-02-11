---
title: 12-vite&vue区分环境配置
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



## 1. 区分不同环境

### 1.1 ①创建环境变量文件

创建 3 个.env 文件，统一前缀`VITE_`（Vite 仅暴露这个前缀的变量），放在项目根目录下。

```env
# .env.development （开发环境，npm run dev用）
NODE_ENV=development
VITE_API_BASE_URL=http://dev-api.xxx.com
VITE_ENV_NAME=开发环境
VITE_OPEN_DEBUG=true
```

```env
# .env.test （测试环境，npm run testbuild用）
NODE_ENV=production  # 测试环境打包也用production模式
VITE_API_BASE_URL=http://test-api.xxx.com
VITE_ENV_NAME=测试环境
VITE_OPEN_DEBUG=true
```

```env
# .env.production （生产环境，npm run build用）
NODE_ENV=production
VITE_API_BASE_URL=http://prod-api.xxx.com
VITE_ENV_NAME=生产环境
VITE_OPEN_DEBUG=false
```



### 1.2 ②修改 vite.config.js

读取对应环境变量，配置打包、代理等差异化逻辑

```js
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  // 加载当前环境的.env文件，拿到环境变量
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [vue()],
    // 基础路径（生产环境可能需要配置，比如部署到子目录）
    base: env.VITE_BASE_URL || '/',
    // 开发服务器代理（仅dev环境生效）
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    },
    // 打包配置（test/prod差异化）
    build: {
      // 输出目录
      outDir: mode === 'test' ? 'dist-test' : 'dist',
      // 代码压缩（生产环境更严格）
      minify: env.NODE_ENV === 'production' ? 'terser' : 'esbuild',
      terserOptions: {
        // 生产环境移除console
        compress: env.VITE_OPEN_DEBUG ? {} : { drop_console: true, drop_debugger: true }
      }
    }
  }
})
```

> test 环境如果使用差异化包名称，如 dist-test，记得 `.gitignore 中添加忽略该目录 dist-test`。

### 1.3 ③配置 package.json

添加不同环境的运行 / 打包脚本，`--mode` 指定环境，核心，快速切换环境

```json
{
  "scripts": {
    // 开发环境（默认mode=development，对应.env.development）
    "dev": "vite",
    // 测试环境若需本地运行，使用 npm run test
    "test": "vite --mode test",
    // 测试环境打包（自己定义命令名称如 testbuild， mode=test，对应.env.test）
    "testbuild": "vite build --mode test",
    // 测试环境预览打包结果
    "testpreview": "vite preview --outDir dist-test --port 8080",
    // 生产环境打包（默认mode=production，对应.env.production）
    "build": "vite build",
    // 生产环境预览打包结果
    "preview": "vite preview"
  }
}
```

使用命令：

```sh
# 先打测试包
npm run testbuild
# 再启动预览服务
npm run testpreview
```



### 1.4 项目中使用环境变量

业务代码里区分环境直接通过`import.meta.env`获取，不用额外引入

```js
// 接口请求封装示例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000
})
```

```js
// 开发/测试环境打印日志（放 main.js 末尾验证 OK）
if (import.meta.env.VITE_OPEN_DEBUG) {
    console.log('当前环境：', import.meta.env.VITE_ENV_NAME)
    console.log('BASE_URL：', import.meta.env.VITE_API_BASE_URL)
}
```



### 1.5 关键补充（避坑）

1. 环境变量只能是字符串，布尔值要自己转（如`VITE_OPEN_DEBUG === 'true'`）
2. `.env`文件不要提交敏感信息（如密钥），可建`.env.local`（git 忽略）
3. 测试环境若需本地运行，可加脚本：`"test": "vite --mode test"`

### 1.6 运行&打包

- 本地开发：`npm run dev`
- 打测试包：`npm run testbuild`
- 打生产包：`npm run build`



## 2. 开发流程

### 2.1 git

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



### 2.2 开发流程

瀑布流开发、敏捷开发。

迭代：Daily scrum（**每日站会**-`进度/风险点`）、看板、提测、bug修复、上线。



### 2.3 云服务器

阿里云、腾讯云、华为云、百度云等等。



### 2.4 nginx

参考 【服务器】>>【Nginx】章节内容。

其中windows服务器中对于 nginx 的安装最好用免安装的版本，启动方式与linux一致。



















