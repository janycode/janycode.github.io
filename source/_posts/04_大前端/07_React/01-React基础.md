---
title: 01-React基础
date: 2022-5-22 21:36:21
tags:
- React
categories: 
- 04_大前端
- 07_React
---

![re269r227-react-logo-react-logo-import-io](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260128100650181.png)

参考：

* React 官网：https://zh-hans.react.dev/
* React 教程：https://zh-hans.react.dev/learn
* 参考 React17 文档（英文）：https://17.reactjs.org/docs/getting-started.html

> 版本：`node 20`、`react 19`
>
> 说明：
>
> **版本差异**：React 17 和 19 核心一致，19 是增量升级，基于 17 的内容学习不影响以后的使用，仅需补充 19 的新特性。
>
> **主流版本**：当下 React 18/19 是主流，17 核心语法通用。
>
> **Node.js 选择**：优先用 nvm 切换到 Node.js 20（LTS），备选 18，放弃 16。
>
> React 17、18、19 三个版本的**官方发布时间及关键定位**如下：
>
> |   版本   |        发布时间         |                     核心定位 & 关键意义                      |
> | :------: | :---------------------: | :----------------------------------------------------------: |
> | React 17 | **2020 年 10 月 20 日** | 「过渡版本」，无重大新特性，核心目标是**为后续版本铺路**（如渐进式升级、事件系统重构），完全兼容 React 16 生态，无破坏性变更。 |
> | React 18 | **2022 年 3 月 29 日**  | 「性能升级版本」，引入**并发渲染（Concurrent Mode）** 核心引擎，新增 `createRoot` 渲染 API、自动批处理、Suspense 增强等，是 17 到 19 的关键过渡。 |
> | React 19 | **2024 年 6 月 18 日**  | 「功能增强版本」，稳定支持**服务器组件（RSC）**、`useActionState`、自动优化 `useMemo/useCallback`、简化表单 / 异步逻辑，进一步弱化类组件，强化 Hooks 生态。 |

## 1. React介绍

### 1.1 React起源与发展

React 起源于 `Facebook` 的内部项目，因为该公司对市场上所有 JavaScript MVC 框架，都不满意，就决定自己写一套，用来架设Instagram 的网站。做出来以后，发现这套东西很好用，就在2013年5月开源了。

### 1.2 React与传统MVC的关系

轻量级的视图层库！*A JavaScript library for building user interfaces*

React不是一个完整的MVC框架，最多可以认为是MVC中的V（View），甚至React并不非常认可MVC开发模式；React 构建页面 UI 的库。

可以简单地理解为，`React 将界面分成了各个独立的小块，每一个块就是组件，这些组件之间可以组合、嵌套`，就成了我们的页面。

### 1.3 特性

1.`声明式设计` -React采用声明范式，可以轻松描述应用。

2.`高效` -React通过对DOM的模拟(虚拟dom)，最大限度地减少与DOM的交互。

3.`灵活` -React可以与已知的库或框架很好地配合。

4.`JSX` -JSx是JavaScript语法的扩展。

5.`组件` -通过 React构建组件，使得代码更加容易得到**复用**，能够很好的应用在大项目的开发中。

6.`单向响应的数据流` -React实现了单向响应的数据流，从而减少了重复代码，这也是它为什么比传统数据绑定更简单。



> React 哲学思想：`如无必要，勿增实体！`



### 1.4 虚拟dom

dom 操作非常消耗性能，但是虚拟 dom 可以大大提高性能（对比不同 diff，打补丁 patch 方式，最小化更新 DOM）。

![image-20260120164044644](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260120164045784.png)



## 2. create-react-app

### 2.1 安装

全局安装：*npm i create-react-app -g*

> `create-react-app`，简称 CRA。默认安装时最新版本。

### 2.2 创建项目

创建项目：*create-react-app myapp*  - 注意命名方式

```sh
Creating a new React app in /dir/your-app.
Installing packages. This might take a couple of minutes. 安装过程较慢，
Installing react, react-dom, and react-scripts...
```

如果不想全局安装，可以使用 npx：*npx create-react-app myapp*  - 也可以实现相同的效果

这需要等待一段时间，这个过程实际上会安装三个东西

* react: react的顶级库

* react-dom: 因为react有很多的运行环境，比如app端的react-native, 我们要在web上运行就使用 react-dom

* react-scripts: 包含运行和打包react应用程序的所有脚本及配置

出现下面的界面，表示创建项目成功:

```txt
Success! Created myapp at E:\work\webProjects\react\code\myapp
Inside that directory, you can run several commands:

  npm start
    Starts the development server.

  npm run build
    Bundles the app into static files for production.

  npm test
    Starts the test runner.

  npm run eject
    Removes this tool and copies build dependencies, configuration files
    and scripts into the app directory. If you do this, you can’t go back!

We suggest that you begin by typing:

  cd myapp
  npm start

Happy hacking!
```

目录结构：

```js
├── README.md            //使用方法的文档
├── node_modules         //所有的依赖安装的目录
├── package-lock.json    //锁定安装时的包的版本号,保证团队的依赖能保证一致。
├── package.json
├── public               //静态公共目录
└── src                  //开发用的源代码目录
```

npm安装失败解决：

* 切换为npm镜像为淘宝镜像

* 使用yarn，如果本来使用yarn还要失败，还得把yarn的源切换到国内

* 如果还没有办法解决，请删除node_modules及package-lock.json然后重新执行 npm i 命令
* 再不能解决就删除node_modules及package-lock.json的同时清除npm缓存 npm cache clean --force 之后再执行 npm i 命令

### 2.3 启动项目

启动：*npm start*

默认端口号 3000

```sh
You can now view myapp in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.31.8:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```



### 2.4 版本降级(★)

如果不想使用最新的 react19 版本，可以选择降级到 react18，以求稳定性：

```sh
# 降级 React + React DOM 到 18.x
npm i react@18 react-dom@18
```



## 3. 第一个React应用

### 3.1 v17 与 v19

17 的这些写法在 19 中会直接报错，必须替换：

|        维度        |                  React 17 写法（19 中失效）                  |                      React 19 替代写法                       |                           学习建议                           |
| :----------------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|     根组件渲染     |                 ReactDOM.render(组件, 节点)                  | `import { createRoot } from 'react-dom/client';`<br />`createRoot(节点).render(组件)` | 17 学习时仍可写 `render`，但记好 19 的替换方式，这是最核心的变更 |
| 服务端渲染 hydrate |                 ReactDOM.hydrate(组件, 节点)                 |             `createRoot(节点).hydrateRoot(组件)`             |          若暂时不学服务端渲染，可先忽略，后续补即可          |
| 类组件过时生命周期 | UNSAFE_componentWillMount<br />UNSAFE_componentWillReceiveProps | 改用 `useEffect`/`useState`（Hooks）或 `componentDidMount`/`componentDidUpdate` | 17 学习时优先学 Hooks，少用这些带 UNSAFE 的生命周期，提前适配 19 |
|      过时 API      | React.createFactory()<br />ReactDOM.unstable_createPortal()  | 19 彻底移除，分别用 `React.createElement`/`React.createPortal` 替代 |           17 学习时直接避开这些冷门 API，无需掌握            |



### 3.2 createRoot(节点).render(组件)

react开发需要引入多个依赖文件：react.js、react-dom.js，分别又有开发版本和生产版本，create-react-app里已经帮我们把这些东西都安装好了。

把创建的工程目录下的`src目录清空`，然后在里面重新创建一个`index.js`（必须是这个文件名），写入以下代码：

```js
// 从 react 的包当中引入了 React。只要你要写 React.js 组件就必须引入React, 因为react里有一种语法叫JSX，稍后会讲到JSX，要写JSX，就必须引入React
import React from "react"
// ReactDOM 可以帮助我们把 React 组件渲染到页面上去，没有其它的作用了。它是从 react-dom 中引入的，而不是从 react 引入
import ReactDOM from "react-dom"
import { createRoot } from 'react-dom/client'  //v19 新
// ReactDOM里有一个render方法，功能就是把组件渲染并且构造 DOM 树，然后插入到页面上某个特定的元素上
//v17
// ReactDOM.render(<h1>欢迎来到React17</h1>, document.getElementById('root'))
//v19: createRoot(节点).render(组件)
createRoot(document.getElementById('root')).render(<h1>欢迎来到React19</h1>)  //JSX, JavaScript XML
```



## 4. JSX语法与组件

### 4.1 JSX

JSX 将 HTML 语法直接加入到 JavaScript 代码中，再通过翻译器转换到纯 JavaScript 后由浏览器执行。

在实际开发中，JSX 在产品打包阶段都已经编译成纯 JavaScript，不会带来任何副作用，反而会让代码更加直观并易于维护。 

编译过程由Babel 的 JSX 编译器实现。https://reactjs.org/docs/hello-world.html

原理是什么呢？要明白JSX的原理，需要先明白如何用 JavaScript 对象来表现一个 DOM 元素的结构?

看下面的DOM结构：`JSX 必须要有一个父标签`

```html
<div class='app' id='appRoot'>
    <h1 class='title'>欢迎进入React的世界</h1>
    <p>React.js 是一个帮助你构建页面 UI 的库</p>
</div>
```

用 JavaScript 对象来表示：

```js
{
    tag: 'div',
    attrs: { className: 'app', id: 'appRoot' },
    children: [
        {
            tag: 'h1',
            attrs: { className: 'title' },
            children: ['欢迎进入React的世界']
        },
        {
            tag: 'p',
            attrs: null,
            children: ['React.js 是一个构建页面 UI 的库']
        }
    ]
}
```

React.js 就把 JavaScript 的语法扩展了一下，让 JavaScript 语言能够支持这种直接在 JavaScript 代码里面编写类似 HTML 标签结构的语法。

编译的过程会把类似 HTML 的 JSX 结构转换成 JavaScript 的对象结构。

所谓的 JSX 其实就是 JavaScript 对象，所以使用 React 和 JSX 的时候一定要经过编译的过程:

>  JSX —使用react构造组件，bable进行编译—> JavaScript对象 — ReactDOM.render() —>DOM元素 —>插入页面



### 4.2 组件

#### 组件引用

前置：index.js

```js
import { createRoot } from "react-dom/client"
import 组件名 from '组件路径'

createRoot(document.getElementById("root"))
    .render(<组件名/>)
    //或
    .render(<组件名></组件名>)
```



#### class 类组件

ES6 的加入让 JavaScript 直接支持使用 class 来定义一个类，`react 创建组件的方式就是使用【类的继承】`，ES6 class 是目前官方推荐的使用方式，它使用了ES6标准语法来构建。

```js
import React, { Component } from 'react'
class JerryApp extends Component {
    render() {
        return (  // 多行可以使用小括号包裹
            <section>  {/* JSX 必须有一个父组件 */}
                <div>hello react component.</div>
                <div>hello react component.</div>
                <div>hello react component.</div>
            </section>
        )
    }
}
export default JerryApp
```

index.js - 类中的名字 可以与 导入后的名字不一样，即导入时可以自定义名字，一般保持一致即可。但强制要求`一定要保持首字母大写`！

```js
import { createRoot } from "react-dom/client"
import App from './01-base/01-class' //1.导入 js 模块

createRoot(document.getElementById("root"))
    .render(<App></App>)  //2.像标签一样去使用，双标签 或 单标签 都支持，如 <App/>
```



#### function 函数组件

具名函数

```js
function JerryApp() {
    return (
        <div>hello, function JerryApp</div>
    )
}
export default JerryApp
```

匿名函数

```js
export default () => (
    <div>hello, noname function JerryApp</div>
)
```

index.js

```js
import { createRoot } from "react-dom/client"
import App from './01-base/02-function'

createRoot(document.getElementById("root"))
    .render(<App/>)
```



#### 嵌套组件

安装插件：**ES7+ React/Redux/GraphQL/React-Native snippets**

可以使用该插件的快捷指令输入，比如快速创建一个组件内容 rcc （React -> Component -> Class）

```js
import React, { Component } from 'react'
// 类组件：与函数组件不要两掺！
class Navbar extends Component {
    render() {
        return (
            <div>
                Navbar
                <Child></Child>
            </div>
        )
    }
}
// 【嵌套】Navbar的子组件，App的孙子组件
class Child extends Component {
    render() {
        return <div>Child</div>
    }
}

// 函数组件：与类组件不要两掺！
function Swiper() {
    return <div>Swiper</div>
}
// 匿名函数：简写
const Tabbar = () => <div>Tabbar</div>

export default class JerryApp extends Component {
    render() {
        return (
            <div>
                <Navbar></Navbar>
                <Swiper></Swiper>
                <Tabbar></Tabbar>
            </div>
        )
    }
}
```



### 4.3 组件的样式

#### 行内样式（React推荐）

`React推荐我们使用行内样式，因为React觉得每一个组件都是一个独立的整体。`

```js
{/* 注意这里的两个括号，第一个表示我们在要JSX里插入JS了，第二个是对象的括号 */}
<p style={{color:'red', fontSize:'14px'}}>Hello world</p>
```

行内样式需要写入一个样式对象，而这个样式对象的位置可以放在很多地方，例如 render 函数里、组件原型上、外链js文件中。



#### 使用 class

* `导入 css 样式模块`，原理是 webpack 的支持
* 定义样式对象时，如果使用复合属性中的单一属性，必须用`驼峰`写法，如 backgroundColor 等价于  background-color
* `{ }` 大括号是 React 模版语法的规则
* class 在 React 中用 `className`
* for 在 React 中用 `htmlFor`，主要用于 label

```js
import React, { Component } from 'react'
import './css/01-index.css' //导入 css 样式模块，原理是 webpack 的支持

export default class JerryApp extends Component {
    render() {
        let myname = "jerry"
        let styleObj = {
            backgroundColor: "yellow" /* 必须用驼峰写法，等价于  background-color */
        }
        return (
            <div>
                {10 + 20} - {myname}  {/* {} 大括号是 React 模版语法的规则 */}
                {10 > 20 ? 'aaa' : 'bbb'}
                <div style={styleObj}>行内样式使用对象</div>
                <div style={{ background: "red" }}>行内样式使用单大括号+对象</div>
                <div className="active">验证css样式模块导入</div>  {/* class 在 React 中用 className */}
                <div id='myapp'>1111111111111</div>
                <label htmlFor="username">用户名：</label>  {/* for 在 React 中用 htmlFor */}
                <input type='text' id='username'></input>
            </div>
        )
    }
}
```



### 4.4 事件处理

#### 绑定事件

采用 `on+事件名` 的方式来绑定一个事件，注意，这里和原生的事件是有区别的，原生的事件全是小写 onclick , React里的事件是`驼峰 onClick`。

React的事件并不是原生事件，而是合成事件。

**原理**：*React并不会真正的绑定事件到每一个具体的\<\>元素标签上，而是通过事件代理的方式。* - 占用内存小，无需考虑解绑(节点消失事件也消失)

* 如果处理内容过多，不推荐把函数逻辑写在 dom 中；内容逻辑较少，可以适当写
* `this.handleClick()`-页面刷新就会执行，点击无效果【注意：`不要加括号`】！！！ `this.handleClick`-点击时才执行
* `onClick={() => { this.handleClick4() }}` 匿名函数中包含了函数调用时，页面进入不会被触发，点击时才触发

```js
import React, { Component } from 'react'

export default class JerryApp extends Component {
    a = 100
    render() {
        let count = 0
        return (
            <div>
                <input />
                <button onClick={() => {console.log("a的值是", this.a)}}>点击获取a</button>
                {/* 如果处理内容过多，不推荐把函数逻辑写在dom中 */}
                <button onClick={() => { console.log("点击了", count++) }}>点击</button>
                <button onMouseOver={() => { console.log("移入了", count++) }}>移入</button>
                {/* this.handleClick()-页面刷新就会执行，但点击无效果！！！ this.handleClick-点击时才执行。 */}
                <button onClick={this.handleClick2()}>add2</button>
                <button onClick={this.handleClick3}>add3</button>
                {/* 匿名函数中包含了函数调用时，页面进入不会被触发，点击时才触发 */}
                <button onClick={() => { this.handleClick4() }}>add4</button>
            </div>
        )
    }
    handleClick2() {
        console.log("点击点击");
    }
    handleClick3 = () => {
        console.log("handleClick3", this.a);
    }
    handleClick4 = () => {
        console.log("handleClick4");
    }
}

```



#### 事件处理

* 直接在render里写行内的箭头函数(不推荐)

* 在组件内使用**箭头函数**定义一个方法 -`推荐`

* 直接在组件内定义一个非箭头函数的方法，然后在render里直接使用 onClick={this.handleClick.bind(this)} (不推荐)

* 直接在组件内定义一个**非箭头函数**的方法，然后在 `constructor 里 bind(this)` -`推荐`
* `<button onClick={() => this.handleClick4() }>按钮</button>` - `【最推荐】`传参好用

```js
import React, { Component } from 'react'

export default class JerryApp extends Component {
    a = 100
    render() {
        return (
            <div>
                <input />
                <button onClick={this.handleClick1.bind(this)}>add1</button> {/* 普通函数需要 bind(this) 才能访问到值 */}
                <button onClick={this.handleClick2}>add2</button>  {/* 箭头函数可以正常获取值 */}
            </div>
        )
    }
    handleClick1() {
        console.log("handleClick1", this); // 如果不 bind(this) 则 undefined
    }
    handleClick2 = () => {
        console.log("handleClick2", this.a); //100
    }
}
```



#### Event 对象

和普通浏览器一样，事件handler会被自动传入一个 event 对象，这个对象和普通的浏览器 event 对象所包含的方法和属性都基本一致。

不同的是 `React 中的 event 对象是它自己内部所构建的`。

* event.stopPropagation - 阻止冒泡，与原生 dom 一样拥有该属性
* event.preventDefault - 默认行为，与原生 dom 一样拥有该属性

```js
import React, { Component } from 'react'

export default class JerryApp extends Component {
    render() {
        return (
            <div>
                <input />
                <button onClick={this.handleClick}>add</button>
            </div>
        )
    }
    handleClick = (evt) => {
        console.log("evt", evt); // SyntheticBaseEvent{}
        console.log("evt.target", evt.target);  //<button>add2</button>
    }
}
```



### 4.5 Ref 应用

* `myRef = createRef()` 创建 ref 引用对象
* `ref={this.myRef}`  绑定引用对象
* `this.myRef.current` 获取引用对象的对象内容，`.value` 就可以获取如 input 输入框的内容
* 注意：this 的指向不能出错！！！参考【事件处理】

```js
import React, { Component, createRef } from 'react'

export default class JerryApp extends Component {
    myRef = createRef()
    render() {
        return (
            <div>
                <input ref={this.myRef} />
                <button onClick={this.handleClick1}>add1</button>
                <button onClick={this.handleClick2.bind(this)}>add2</button>
            </div>
        )
    }
    handleClick1 = () => {
        console.log("click", this.myRef); // ref 对象
        console.log("ref current", this.myRef.current); // <input> 标签
        console.log("ref value", this.myRef.current.value); // input 输出的内容
    }
    handleClick2 () {
        console.log("click", this.myRef); // ref 对象
        console.log("ref current", this.myRef.current); // <input> 标签
        console.log("ref value", this.myRef.current.value); // input 输出的内容
    }
}
```













































