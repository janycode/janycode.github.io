---
title: 02-Webpack配置
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



> 作为以 Java 为核心的全栈，需要掌握的 Webpack 程度：
>
> 不用像前端基建工程师那样精通 Webpack 源码，但要掌握 “够用” 的程度，核心目标是：能解决`日常开发` / `部署`的问题。
>
> 1. 必掌握的核心点（1-2 天）
>   - 理解核心概念：入口（entry）、出口（output）、loader（处理非 JS 文件）、plugin（扩展功能）；
>
>   - 会用脚手架内置的 Webpack 配置：比如 Vue CLI 的 vue.config.js、React CRA 的 config-overrides.js，能修改；
>
>   - 代理配置（解决跨域）；
>
>   - 输出路径（适配后端静态资源目录）；
>
>   - 环境变量（区分开发 / 生产后端接口）；
>
>   - 会执行核心命令：npm run dev（开发）、npm run build（打包），能看懂打包日志，解决常见报错（比如依赖缺失、路径错误）；
>
>   - 能把打包后的前端静态文件集成到 Java 项目：比如把 Webpack 打包后的 dist 目录复制到 Spring Boot 的 resources/static，或通过 Maven/Gradle 自动拷贝。
>
> 2. 可选掌握（遇到问题随查随用）
>   - 简单的性能优化：比如开启代码分割、压缩静态资源；
>
>   - 常见 loader/plugin 的作用：比如 babel-loader、mini-css-extract-plugin；
>
>   - 替代工具认知：知道 Vite 比 Webpack 快，Next.js/Nuxt.js 内置了打包工具，不用手动配置。
>




## 1、Webpack完整工作流程详解

### 1.1 Webpack打包流程图

让我们通过一个详细的流程图来理解Webpack的完整工作过程：

```css
📦 Webpack 打包完整流程

开始
  ↓
读取配置文件 ('webpack.config.js')
  ↓
初始化'Compiler'编译器对象
  ↓
挂载所有配置的'Plugin'插件
  ↓
执行'Compiler.run()'开始编译
  ↓
🔍 阶段1: 编译阶段 (Compilation)
  ├─ 从'Entry'入口开始
  ├─ 对每个'Module'调用匹配的'Loader'
  ├─ 解析模块间的依赖关系
  ├─ 递归处理所有依赖模块
  └─ 构建完整的依赖图('Dependency Graph')
  ↓
🔧 阶段2: 封装阶段 (Seal)
  ├─ 优化依赖图
  ├─ 代码分割('Code Splitting')
  ├─ 生成'Chunk'(代码块)
  ├─ 哈希计算
  └─ 模板渲染
  ↓
📁 阶段3: 发射阶段 (Emit)
  ├─ 创建输出目录
  ├─ 生成最终文件
  ├─ 写入文件系统
  └─ 触发'Plugin'的'afterEmit'钩子
  ↓
完成打包 🎉
  ↓
输出打包统计信息
```

### 1.2 流程各阶段详细说明

**阶段1：编译阶段（Compilation）**

```javascript
// 伪代码模拟编译过程
class WebpackCompilation {
  buildModule(modulePath) {
    // 1. 读取模块源代码
    const sourceCode = fs.readFileSync(modulePath, 'utf-8');
    
    // 2. 使用Loader进行转译
    const transformedCode = this.runLoaders(modulePath, sourceCode);
    
    // 3. 解析AST，找出依赖关系
    const dependencies = this.parseDependencies(transformedCode);
    
    // 4. 递归处理所有依赖
    dependencies.forEach(dep => {
      this.buildModule(dep);
    });
    
    // 5. 将模块信息存入依赖图
    this.addModuleToGraph(modulePath, transformedCode, dependencies);
  }
}
```

**阶段2：封装阶段（Seal）**

```javascript
class WebpackSeal {
  optimize() {
    // 1. 代码分割
    this.splitChunks();
    
    // 2. 树摇（Tree Shaking） - 删除未使用代码
    this.treeShaking();
    
    // 3. 作用域提升（Scope Hoisting）
    this.scopeHoisting();
    
    // 4. 生成Chunk
    this.createChunks();
  }
}
```

**阶段3：发射阶段（Emit）**

```javascript
class WebpackEmit {
  emitAssets() {
    // 1. 应用输出模板
    const assets = this.applyTemplates();
    
    // 2. 创建输出目录
    fs.ensureDirSync(this.outputPath);
    
    // 3. 写入文件
    Object.keys(assets).forEach(filename => {
      fs.writeFileSync(path.join(this.outputPath, filename), assets[filename]);
    });
  }
}
```

## 2、完整实战配置示例

### 2.1 基础Webpack配置

```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// 判断当前环境
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  // 入口配置
  entry: {
    main: './src/index.js',
    vendor: ['./src/vendor.js']  // 第三方库单独打包
  },
  
  // 输出配置
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction 
      ? 'js/[name].[contenthash:8].js'  // 生产环境使用哈希
      : 'js/[name].js',                 // 开发环境不使用哈希
    chunkFilename: isProduction
      ? 'js/[name].[contenthash:8].chunk.js'
      : 'js/[name].chunk.js',
    publicPath: '/'
  },
  
  // 模式
  mode: isProduction ? 'production' : 'development',
  
  // 开发工具
  devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
  
  // 模块解析
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'components': path.resolve(__dirname, 'src/components')
    }
  },
  
  // Loader配置
  module: {
    rules: [
      // JavaScript/TypeScript
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript'
            ]
          }
        }
      },
      
      // CSS/SCSS
      {
        test: /\.(css|scss)$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      
      // 图片资源
      {
        test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8KB
          }
        },
        generator: {
          filename: 'images/[name].[hash:8][ext]'
        }
      },
      
      // 字体资源
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:8][ext]'
        }
      }
    ]
  },
  
  // 插件配置
  plugins: [
    // HTML模板
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: true,
      minify: isProduction ? {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      } : false
    }),
    
    // CSS提取（仅生产环境）
    ...(isProduction ? [
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].chunk.css'
      })
    ] : [])
  ],
  
  // 优化配置
  optimization: {
    minimize: isProduction,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // 第三方库
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          chunks: 'all'
        },
        // 公共代码
        common: {
          name: 'common',
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: {
      name: 'runtime'
    }
  },
  
  // 开发服务器
  devServer: {
    hot: true,
    open: true,
    port: 3000,
    historyApiFallback: true,
    static: [
      {
        directory: path.join(__dirname, 'public'),
        publicPath: '/'
      }
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
};
```

### 2.2 配套配置文件

**Babel配置 (.babelrc)**

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3,
        "targets": {
          "browsers": ["> 1%", "last 2 versions"]
        }
      }
    ],
    ["@babel/preset-react", { "runtime": "automatic" }],
    "@babel/preset-typescript"
  ],
  "plugins": [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-syntax-dynamic-import"
  ]
}
```

**PostCSS配置 (postcss.config.js)**

```javascript
module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: ['> 1%', 'last 2 versions']
    }),
    require('cssnano')({
      preset: 'default'
    })
  ]
};
```

## 3、高级特性和优化技巧

### 3.1 代码分割（Code Splitting）

```javascript
// 1. 动态导入 - 按需加载
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// 2. 配置代码分割
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      react: {
        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
        name: 'react',
        priority: 20
      },
      utils: {
        test: /[\\/]src[\\/]utils[\\/]/,
        name: 'utils',
        minChunks: 2,
        priority: 10
      }
    }
  }
}
```

### 3.2 缓存优化

```javascript
output: {
  filename: '[name].[contenthash:8].js',
  chunkFilename: '[name].[contenthash:8].chunk.js'
},

optimization: {
  moduleIds: 'deterministic',
  runtimeChunk: 'single',
  splitChunks: {
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all'
      }
    }
  }
}
```

### 3.3 性能监控

```javascript
// 打包速度分析
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
  // webpack配置
});

// 包大小分析
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

plugins: [
  new BundleAnalyzerPlugin({
    analyzerMode: 'server',
    analyzerPort: 8888
  })
]
```

## 4、常见问题解决方案

### 4.1 内存溢出处理

```javascript
// 增加Node.js内存限制
// package.json
"scripts": {
  "build": "node --max_old_space_size=4096 node_modules/webpack/bin/webpack.js"
}
```

### 4.2 路径问题处理

```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src'),
    '~': path.resolve(__dirname, 'node_modules')
  },
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
}
```

### 4.3 环境变量配置

```javascript
const webpack = require('webpack');

plugins: [
  new webpack.DefinePlugin({
    'process.env.API_URL': JSON.stringify(process.env.API_URL),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
]
```

## 5、Webpack 5 新特性

### 5.1 模块联邦（Module Federation）

```javascript
// app1/webpack.config.js (提供方)
new ModuleFederationPlugin({
  name: 'app1',
  filename: 'remoteEntry.js',
  exposes: {
    './Button': './src/Button'
  },
  shared: ['react', 'react-dom']
});

// app2/webpack.config.js (消费方)
new ModuleFederationPlugin({
  name: 'app2',
  remotes: {
    app1: 'app1@http://localhost:3001/remoteEntry.js'
  },
  shared: ['react', 'react-dom']
});
```

### 5.2 资源模块（Asset Modules）

```javascript
module: {
  rules: [
    {
      test: /\.(png|jpg|jpeg|gif)$/i,
      type: 'asset/resource'  // 替换 file-loader
    },
    {
      test: /\.svg$/i,
      type: 'asset/inline'    // 替换 url-loader
    }
  ]
}
```











