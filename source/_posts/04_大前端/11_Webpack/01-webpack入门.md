---
title: 01-Webpack入门
date: 2022-5-22 21:36:21
tags:
- webpack
categories: 
- 04_大前端
- 11_Webpack
---



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260204182332703.png)

参考：

* webpack 官方网站：https://www.webpackjs.com/



## 1. 为什么需要 Webpack

### 1.1 前端开发的痛点

- 浏览器原生不支持 ES6+ 模块化（`import/export`）、TypeScript、Vue/React 单文件组件等现代语法。
- 资源管理混乱：JS、CSS、图片、字体等文件依赖关系复杂，手动维护易出错。
- 生产环境需代码压缩、兼容性处理、性能优化，手动操作效率低。

### 1.2 Webpack 的核心价值

- **模块化打包**：解析 `import/export` 等模块语法，构建依赖图，输出浏览器可识别的代码。
- **资源统一处理**：通过 Loader 处理非 JS 资源（CSS、图片等），Plugin 扩展打包能力（压缩、热更新等）。
- **环境适配**：区分开发 / 生产模式，开发模式保留调试信息，生产模式自动优化代码。
- **工程化集成**：与 Vue CLI、Create React App 等脚手架深度整合，降低配置成本。

### 1.3 Webpack 与其他工具对比

|  工具   |           核心优势           |            适用场景            |
| :-----: | :--------------------------: | :----------------------------: |
| Webpack |     全能型打包，生态丰富     | 复杂单页应用（SPA）、全栈项目  |
|  Vite   | 开发环境启动快，基于 ESBuild | 现代框架项目（Vue3、React18+） |
| Rollup  |    打包体积小，适合库开发    |       JS 库、组件库开发        |
| Parcel  |       零配置，快速上手       |       小型项目、原型开发       |

## 2. Webpack 基础配置

### 2.1 核心概念

- **Entry（入口）**：打包的起点，默认 `./src/index.js`，支持单入口 / 多入口。
- **Output（输出）**：指定打包文件路径和命名，默认 `./dist/main.js`。
- **Loader**：处理非 JS 文件，如 `css-loader` 解析 CSS、`babel-loader` 转译 ES6+。
- **Plugin**：扩展 Webpack 功能，如 `html-webpack-plugin` 生成 HTML、`clean-webpack-plugin` 清理输出目录。
- **Mode**：`development`（开发）/`production`（生产），决定内置优化策略。

### 2.2 基础配置示例

`webpack.config.js`

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin(), // 打包前清理 dist
    new HtmlWebpackPlugin({ template: './public/index.html' }), // 生成 HTML
  ],
};
```

### 2.3 常用命令

```sh
npm init -y # 初始化项目
npm install webpack webpack-cli --save-dev # 安装核心依赖
npx webpack # 执行打包（默认读取 webpack.config.js）
npx webpack --mode production # 指定生产模式打包
```

## 3. 管理资源（处理 CSS、图片、字体）

### 3.1 处理 CSS 文件

#### 3.1.1 安装依赖

```sh
npm install style-loader css-loader --save-dev
```

- `css-loader`：解析 CSS 文件中的 `@import` 和 `url()`。
- `style-loader`：将 CSS 注入到 HTML 的 `<style>` 标签中。

#### 3.1.2 配置 Loader

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'], // 执行顺序从右到左
      },
    ],
  },
};
```

#### 3.1.3 提取 CSS 到单独文件（生产环境推荐）

```sh
npm install mini-css-extract-plugin --save-dev
```

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin({ filename: 'styles.css' })],
};
```

### 3.2 处理图片与字体

#### 3.2.1 内置资源模块（Webpack5+）

无需额外 Loader，直接配置 `type: 'asset'`：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset', // 自动判断是否转为 Base64
        parser: { dataUrlCondition: { maxSize: 8*1024 } }, // 小于 8KB 转 Base64
        generator: { filename: 'images/[hash][ext][query]' }, // 输出路径
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource', // 直接输出文件
        generator: { filename: 'fonts/[hash][ext][query]' },
      },
    ],
  },
};
```

### 3.3 处理 SCSS（预处理器）

#### 3.3.1 安装依赖

```sh
npm install sass sass-loader postcss-loader autoprefixer --save-dev
```

- `sass-loader`：解析 SCSS 为 CSS。
- `postcss-loader`+`autoprefixer`：自动添加浏览器前缀。

#### 3.3.2 配置

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader', // 需创建 postcss.config.js
          'sass-loader',
        ],
      },
    ],
  },
};
```

`postcss.config.js`：

```js
module.exports = {
  plugins: [require('autoprefixer')],
};
```

## 4. 使用 babel-loader（ES6+ 转 ES5）

### 4.1 为什么需要 Babel

将 ES6+ 语法（箭头函数、Promise 等）转译为 ES5，适配低版本浏览器（如 IE11）。

### 4.2 安装依赖

```sh
npm install babel-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime --save-dev
npm install @babel/runtime @babel/runtime-corejs3 --save
```

- `babel-loader`：Webpack 与 Babel 的桥梁。
- `@babel/preset-env`：根据目标浏览器自动转换语法。
- `@babel/plugin-transform-runtime`：复用 Babel 辅助代码，减小打包体积。

### 4.3 配置

#### 4.3.1 `webpack.config.js` 配置

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/, // 排除第三方库
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: '> 0.25%, not dead' }] // 目标浏览器配置
            ],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      }
    ]
  }
};
```

#### 4.3.2 单独配置 Babel（`.babelrc`）

```json
{
  "presets": [["@babel/preset-env", { "targets": "> 0.25%, not dead" }]],
  "plugins": ["@babel/plugin-transform-runtime"]
}
```

### 4.4 常见问题

- 转译不彻底：检查 `@babel/preset-env` 的 `targets` 配置，确保覆盖目标浏览器。
- 打包体积大：启用 `@babel/plugin-transform-runtime`，避免重复生成辅助代码。

## 5. 代码分离（Code Splitting）

### 5.1 核心目的

- 减小首屏加载体积，提升页面加载速度。
- 实现按需加载（如路由懒加载），减少初始请求资源。
- 复用公共代码，避免重复打包。

### 5.2 三种实现方式

#### 5.2.1 入口起点分离（多入口）

适用于多页面应用（MPA），每个页面单独打包。

```js
module.exports = {
  entry: {
    home: './src/home.js',
    about: './src/about.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

#### 5.2.2 公共代码分离（`splitChunks`）

自动提取多入口的公共依赖（如 React、Vue）到单独文件。

```js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all' // 对所有模块生效
    }
  }
};
```

#### 5.2.3 动态导入（按需加载）

通过 `import()` 语法实现组件 / 路由懒加载，Webpack 自动拆分代码。

```js
// 路由懒加载示例（React）
const Home = React.lazy(() => import('./Home'));
const About = React.lazy(() => import('./About'));

// 普通模块按需加载
document.getElementById('btn').addEventListener('click', async () => {
  const { default: module } = await import('./module');
  module.doSomething();
});
```

------

## 6. 缓存（提升构建与加载速度）

### 6.1 构建缓存（提升打包速度）

Webpack5 内置缓存机制，可缓存已编译的模块，二次打包时复用缓存。

```js
module.exports = {
  cache: {
    type: 'filesystem', // 基于文件系统的缓存
    buildDependencies: {
      config: [__filename] // 配置文件变化时重建缓存
    }
  }
};
```

### 6.2 浏览器缓存（提升加载速度）

通过文件名哈希（`contenthash`）实现静态资源长期缓存，文件内容变化时哈希值更新，浏览器重新请求。

```js
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js'
  },
  optimization: {
    runtimeChunk: 'single', // 将运行时代码提取到单独文件
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
```

### 6.3 缓存策略总结

1. 开发环境启用构建缓存，加速二次打包。
2. 生产环境使用 `contenthash` 命名文件，结合 `Cache-Control` 响应头设置长期缓存。
3. 提取第三方库（vendor）和运行时代码，避免业务代码变化导致缓存失效。

## 7. 开发环境优化（提升开发效率）

### 7.1 开发服务器（`webpack-dev-server`）

提供热更新、代理转发等功能，无需手动刷新页面。

#### 7.1.1 安装与配置

```sh
npm install webpack-dev-server --save-dev
```

```js
module.exports = {
  devServer: {
    port: 8080,
    open: true, // 自动打开浏览器
    proxy: { // 跨域代理
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
};
```

#### 7.1.2 启动命令

```sh
npx webpack serve
```

### 7.2 热模块替换（HMR）

修改代码后只更新变化的模块，不刷新整个页面，提升开发体验。

```js
module.exports = {
  devServer: {
    hot: true
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
};
```

## 8. 生产环境优化（提升应用性能）

### 8.1 代码压缩

Webpack5 生产模式默认启用 `terser-webpack-plugin`（JS 压缩）和 `css-minimizer-webpack-plugin`（CSS 压缩）。

```js
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({ parallel: true }), // 多线程压缩
      new CssMinimizerPlugin()
    ]
  }
};
```

### 8.2 资源压缩

- 图片压缩：使用 `image-webpack-loader` 压缩 PNG、JPG 等格式。
- 字体优化：使用 `url-loader` 将小字体文件转为 Base64。

### 8.3 性能分析

使用 `webpack-bundle-analyzer` 分析打包体积，定位大文件。

```sh
npm install webpack-bundle-analyzer --save-dev
```

```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [new BundleAnalyzerPlugin()]
};
```

## 9. 全栈下 Webpack 价值

### 9.1 与 Java 后端集成

1. 将 Webpack 打包后的 `dist` 目录复制到 Spring Boot 项目的 `src/main/resources/static` 目录。
2. 通过 Maven/Gradle 插件（如 `frontend-maven-plugin`）自动执行 `npm run build`，实现前后端一体化构建。

### 9.2 解决跨域问题

开发环境通过 `devServer.proxy` 将前端请求转发到 Java 后端，避免浏览器跨域限制。

```js
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080', // Java 后端地址
      changeOrigin: true
    }
  }
}
```

### 9.3 部署优化

1. 生产环境打包时指定输出路径，适配后端静态资源目录。
2. 启用代码压缩、缓存策略，减少后端服务器的带宽压力。

## 10. 常见问题与解决方案

|       问题       |               原因               |                       解决方案                        |
| :--------------: | :------------------------------: | :---------------------------------------------------: |
| Module not found | 文件路径错误、文件名大小写不匹配 |     检查文件路径，确保大小写一致，添加文件扩展名      |
| Babel 转译不彻底 |   `@babel/preset-env` 配置错误   |            指定 `targets`，安装缺失的插件             |
|   打包体积过大   |    未分离公共代码、未压缩资源    | 启用 `splitChunks`，使用 `terser-webpack-plugin` 压缩 |
|    热更新失效    |        配置错误、依赖缺失        |   检查 `hot: true` 配置，安装 `webpack-dev-server`    |

