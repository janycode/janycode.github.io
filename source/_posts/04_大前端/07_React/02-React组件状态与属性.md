---
title: 02-React组件状态与属性
date: 2022-5-22 21:36:21
tags:
- React
categories: 
- 04_大前端
- 07_React
---

![image-20260120163108775](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260120163110162.png)

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

## 1. 组件数据挂载

### 1.1 状态 state

状态就是组件描述某种显示情况的数据，由`组件自己设置和更改`，也就是说由组件自己维护，使用状态的目的就是为了在不同的状态下使组件的显示不同(自己管理)。

#### state 与 setState

* `state`，该名字是固定的关键字，定义为对象类型`{ }`，内部可以自定义变量名称
* `this.setState({ })`，间接修改 state 的对象内部的状态值，且同时会导致组件的重新渲染

```js
import React, { Component } from "react"

export default class JerryApp extends Component {
    // state 名字是固定的关键字
    state = {  
        collectionShow: true
    }
    render() {
        return (
            <div>
                <h1>欢迎来到 React 开发</h1>
                <button onClick={() => {
                    this.setState({  //只能间接修改
                        collectionShow: !this.state.collectionShow
                    })
                    if (this.state.collectionShow) {
                        console.log("todo:收藏的函数逻辑");
                    } else {
                        console.log("todo:取消收藏的函数逻辑");
                    }
                }}>
                    {this.state.collectionShow ? "♥收藏" : "♡取消"}
                </button>
            </div>
        )
    }
}

```



#### setState 两个参数

注意的是这个方法接收两个参数，第一个是上一次的 `state`, 第二个是`props`。

* 第一个参数可以是对象，也可以是方法return一个对象，我们把这个参数叫做 updater
* 第二个参数是个**回调函数**，因为 setState() 是`异步`的（*多次调用合并处理-为了性能考虑*），该`回调函数中 状态和真实DOM 已经更新`完了。
  * v17 - setState() 处在**同步**逻辑中，是**合并且异步**执行
  * v17 - setState() 处在**异步**逻辑中，是**不合并且同步**执行
    * v18 & v19 setState() 多个会保持`合并且异步`

```js
    this.setState((preState, props) => {
        return {  //只能间接修改
            collectionShow: !preState.collectionShow,
            myname: "tom"
        }
    }, () => {
        console.log("第二个参数-回调里的：", this.state.collectionShow); //新值，输出：false
    })
    console.log("setState()外面的：", this.state.collectionShow); //旧值，输出：true
```



#### state 另一种写法

* `constructor() { }`，写在构造器中时，必须加上 `super()` 调用父类构造器（继承 Component 的父构造，以获取组件本身自带的属性和方法）

```js
import React, { Component } from "react"

export default class JerryApp extends Component {
    //另一种 state 写法
    constructor() {
        super() //必须添加！！！需要继承 Component 的父构造，以获取组件本身自带的属性和方法
        this.state = {
            myname: "jerry",
            collectionShow: true,
        }
    }
    render() {
        return (
            <div>
                <h1>欢迎{ this.state.myname }来到 React 开发</h1>
                <button onClick={() => {
                    this.setState({  //只能间接修改
                        collectionShow: !this.state.collectionShow,
                        myname: "tom"
                    })
                    if (this.state.collectionShow) {
                        console.log("todo:收藏的函数逻辑");
                    } else {
                        console.log("todo:取消收藏的函数逻辑");
                    }
                }}>
                    {this.state.collectionShow ? "♥收藏" : "♡取消"}
                </button>
            </div>
        )
    }
}
```



### 1.2 属性接收 props

props 是正常是外部传入的，组件内部也可以通过一些方式来初始化的设置，属性不能被组件自己更改，但是你可以通过父组件主动重新渲染的方式来传入新的 props属性是描述性质、特点的，组件自己不能随意更改。

之前的组件代码里面有 props 的简单使用，总的来说，在使用一个组件的时候，可以把参数放在标签的属性当中，所有的属性都会作为组件 props 对象的键值。通过箭头函数创建的组件，需要通过函数的参数来接收 props :

* 在组件上通过 `key=value` 写属性, 类组件通过 `this.props.key` 获取 value 属性值 || 函数组件通过**形参**接收 `props`
  * 注意：在传参数时候，组件标签上 `isShow={true}` 使用 `{}`模版语法才是 js 代码，才能解析为布尔值


#### 属性传值

##### 类组件传值 props

```js
import React, { Component } from 'react'
import Navbar from './navbar/NavBar'

export default class JerryApp extends Component {
  render() {
    return (
      <div>
        <div>
          <h2>首页</h2>
          <Navbar title="首页" leftShow={false} />
        </div>
        <div>
          <h2>列表</h2>
          <Navbar title="列表" />
        </div>
        <div>
          <h2>购物车</h2>
          <Navbar title="购物车" />
        </div>
      </div>
    )
  }
}
```

Navbar.js

```js
import React, { Component } from 'react'
import jerryPropTypes from 'prop-types' // 属性类型验证：1.导入模块

export default class Navbar extends Component {
  // 属性类型验证：2.设置验证的属性类型，使用内置静态属性 static
  prototype = {
    title: jerryPropTypes.string,
    leftShow: jerryPropTypes.bool,
  }
  // 设置属性默认值，v19 必须使用 static
  static defaultProps = {
    leftShow: true,
  }
  render() {
    console.log('props:', this.props)
    let { title, leftShow } = this.props  //【类组件】this.props 接收属性传值
    return (
      <div>
        {leftShow && <button>返回</button>}
        Navbar-{title}
        <button>菜单</button>
      </div>
    )
  }
}
```



##### 函数组件传值 props

```js
import React, { Component } from 'react'
import Sidebar from './sidebar/Sidebar'

export default class JerryApp extends Component {
  render() {
    return (
      <div>
        <Sidebar bg="red" position="right"></Sidebar>   {/* 函数组件属性传值 */}
      </div>
    )
  }
}
```

Sidebar.js

```js
import React from 'react'
// 【函数组件】形参 props 接收属性传值。
export default function Sidebar(props) {
  let { bg, position } = props
  console.log(bg, position)
  let obj = {
    background: bg,
    width: '200px',
    position: 'fixed',
  }
  let left = {
    left: 0,
  }
  let right = {
    right: 0,
  }
  //根据属性传值，展开再合并属性
  let styleObj = position === 'left' ? { ...obj, ...left } : { ...obj, ...right }
  return (
    <div style={styleObj}>
      <ul>
        <li>1111</li>
        <li>1111</li>
        <li>1111</li>
      </ul>
    </div>
  )
}
```



#### 默认属性

```js
export default class Navbar extends Component {
    static defaultProps = {
        myname:"默认的myname",
        myshow:true
    }
    render() {...}
}
```

#### 属性验证 prop-types

使用内置模块 `prop-types`

```js
import jerryPropTypes from 'prop-types'  // 属性类型验证：1.导入模块

export default class Navbar extends Component {
  // 属性类型验证：2.设置验证的属性类型，使用内置静态属性 static
  prototype = {
    title: jerryPropTypes.string,
    leftShow: jerryPropTypes.bool,
  }
  render() {...}
}
```

#### 展开赋值

`{...对象}` 展开赋值

```js
import React, { Component } from 'react'
import Navbar from './navbar/NavBar'

export default class JerryApp extends Component {
  render() {
    let obj = {
      title: '我的',
      leftShow: false,
    }
    return (
      <div>
        <div>
          <h2>我的</h2>
          <Navbar {...obj} /> {/* 属性展开 */}
        </div>
      </div>
    )
  }
}
```






### 1.3 状态与属性

`state` 状态、`props` 属性

相似点：都是纯 js 对象，都会触发 render 更新，都具有确定性（状态/属性相同，结果相同）

不同点：

1. 属性能从父组件获取，状态不能
2. 属性可以由父组件修改，状态不能
3. 属性能在内部设置默认值，状态也可以，设置方式不一样
4. 属性不在组件内部修改，状态要在组件内部修改
5. 属性能设置子组件初始值，状态不可以
6. 属性可以修改子组件的值，状态不可以

* state 的主要作用是用于组件保存、控制、修改自己的可变状态。 state 在组件内部初始化，可以被组件自身修改，而外部不能访问也不能修改。可以认为 state 是一个局部的、只能被组件自身控制的数据源。 state 中状态可以通过 this.setState 方法进行更新，setState 会导致组件的重新渲染。

* props 的主要作用是让使用该组件的父组件可以传入参数来配置该组件。它是外部传进来的配置参数，组件内部无法控制也无法修改。除非外部组件主动传入新的 props ，否则组件的 props 永远保持不变。

没有 state 的组件叫**无状态组件**（stateless component），设置了 state 的叫做**有状态组件**（stateful component）。因为状态会带来管理的复杂性，我们`尽量多地写无状态组件，尽量少地写有状态的组件`。这样会降低代码维护的难度，也会在一定程度上增强组件的可复用性。



### 1.4 渲染数据

#### 条件渲染

```js
{
  condition ? '渲染列表的代码' : '空空如也'
}
```



#### 列表渲染

* 列表渲染定义成render中的变量，还是一样要加 key 唯一属性

```js
import React, { Component } from "react"

export default class JerryApp extends Component {
  state = {
    list: ["aaa", "bbb", "ccc"],
  }
  render() {
    // 列表渲染定义成render中的变量，还是一样要加 key 唯一属性(不涉及列表的增加和删除时，设置index没问题)
    let newList = this.state.list.map((item, index) => <li key={index}>{item}</li>)
    return (
      <div>
        <ul>{newList}</ul>
      </div>
    )
  }
}

```

* key值说明

> React的高效依赖于所谓的 `Virtual-DOM`【虚拟DOM】，尽量不碰 DOM。
>
> 对于列表元素来说会有一个问题：元素可能会在一个列表中改变位置。要实现这个操作，只需要交换一下 DOM 位置就行了，但是React并不知道其实我们只是改变了元素的位置，所以它会重新渲染后面两个元素（再执行 Virtual-DOM ），这样会大大增加 DOM 操作。但如果给每个元素加上唯一的标识，React 就可以知道这两个元素只是交换了位置，这个标识就是 key ，因此这个 `key 必须是每个元素唯一的标识`。
>
> 当不涉及列表的增加和删除时，设置index没问题。



#### dangerouslySetInnerHTML

对于富文本创建的内容，后台拿到的数据是这样的：

```js
content = "<p>React.js是一个构建UI的库</p>"
```

处于安全的原因，React当中所有表达式的内容会被转义，如果直接输入，标签会被当成文本。这时候就需要使用 dangerouslySetHTML 属性，它允许我们动态设置 innerHTML。

```js
<span dangerouslySetInnerHTML={{ __html: item.text }}></span> {/* 危险HTML设置，会解析在浏览器 */}
```





### 案例：todolist

```js
import React, { Component, createRef } from "react"
import "./css/01-index.css"

export default class JerryApp extends Component {
  state = {
    list: [
      { id: 1, text: "aaa" },
      { id: 2, text: "bbb" },
      { id: 3, text: "ccc" },
    ],
  }
  myref = createRef()
  render() {
    return (
      <div>
        <input ref={this.myref} />
        <button onClick={this.handleClick}>添加</button>
        <ul>
          {this.state.list.map(item => (
            <li key={item.id}>
                  {item.text}-
                  <span dangerouslySetInnerHTML={{ __html: item.text }}></span> {/* 危险HTML设置，会解析在浏览器 */}
              {/* <button onClick={this.handleDelClick.bind(this, item.id)}>删除</button> */} {/* 第一种传参方式 */}
              <button onClick={() => this.handleDelClick(item.id)}>删除</button> {/* 第二种传参方式 */}
            </li>
          ))}
        </ul>
        {/* 方案1：条件判断列表的长度为 0 时，显示暂无 */}
        {this.state.list.length ? null : <div>暂无待办事项1</div>}
        {/* 方案2：条件判断列表的长度为 0 时，才执行 && 后面的内容 */}
        {!this.state.list.length && <div>暂无待办事项2</div>}
        {/* 方案3：隐藏与显示，即一开始就有 dom ，只控制显隐 */}
        <div className={this.state.list.length ? "hidden" : ""}>暂无待办事项3</div>
      </div>
    )
  }
  handleClick = () => {
    console.log("click", this.myref.current.value)
    //手动设置到 state，才会更新
    this.setState(
      {
        list: [
          ...this.state.list, //展开数组，深拷贝
          {
            id: Math.floor(Math.random() * 100) + 1, //1-100
            text: this.myref.current.value,
          },
        ],
      },
      () => {
        console.log("新的list：", this.state.list)
      },
    )
    // 通过 ref 引用直接操作 dom，清空输入框
    this.myref.current.value = ""
  }
  handleDelClick = id => {
    console.log("del id", id)
    let newList = this.state.list.slice() // slice() 深拷贝
    newList = newList.filter(item => item.id !== id) //
    this.setState({
      list: newList,
    })
  }
}

```

### 案例：H5底部导航-选项卡

目录

```txt
src/
  css/
    index.css
  component/
    Center.js
    Cinema.js
    Film.js
    Infomation.js
  index.js
```

index.js

```js
import React, { Component } from 'react'
import './css/02-maizuo.css'
import Film from './component/Film'
import Cinema from './component/Cinema'
import Infomation from './component/Infomation'
import Center from './component/Center'

export default class JerryApp extends Component {
  state = {
    list: [
      { id: 1, text: '电影' },
      { id: 2, text: '影院' },
      { id: 3, text: '资讯' },
      { id: 4, text: '我的' },
    ],
    currentId: 1,
  }
  render() {
    return (
      <div>
        {/* 方式1 */}
        {/* {this.state.currentId === 1 && <Film></Film>}
        {this.state.currentId === 2 && <Cinema></Cinema>}
        {this.state.currentId === 3 && <Infomation></Infomation>}
        {this.state.currentId === 4 && <Center></Center>} */}
        {/* 方式2 */}
        {
          this.which() // 函数表达式
        }
        <ul>
          {this.state.list.map(item => (
            <li
              key={item.id}
              className={this.state.currentId === item.id ? 'active' : ''}
              onClick={() => this.handleClick(item.id)}
            >
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    )
  }
  handleClick(id) {
    this.setState({
      currentId: id,
    })
  }
  which() {
    switch (this.state.currentId) {
      case 1:
        return <Film></Film>
      case 2:
        return <Cinema></Cinema>
      case 3:
        return <Infomation></Infomation>
      case 4:
        return <Center></Center>
    }
  }
}
```

component/Cinema.js

```js
import React, { Component } from 'react'
import axios from 'axios'
import BScroll from 'better-scroll'

export default class Cinema extends Component {
  constructor() {
    super()

    this.state = {
      cinemaList: [],
      sourceCinemaList: [],
    }

    //演示：临时请求数据，axios 第三方库
    axios({
      url: 'https://m.maizuo.com/gateway?cityId=410100&ticketFlag=1&k=9366495',
      headers: {
        'x-client-info': '{"a":"3000","ch":"1002","v":"5.2.1","e":"17689720181688867040133121","bc":"410100"}',
        'x-host': 'mall.film-ticket.cinema.list',
      },
    })
      .then(res => {
        console.log(res.data)
        this.setState({
          cinemaList: res.data.data.cinemas,
          sourceCinemaList: res.data.data.cinemas,
        }, () => {
          // 注意：回调函数中 DOM 才更新，才能去初始化 better-scroll
          new BScroll('.jerryWrapper')
        })
      })
      .catch(err => {
        console.error('请求出错', err)
      })
  }
  // 生命周期函数更适合发 ajax
  render() {
    return (
      <div>
        Cinema
        <input type="text" onInput={this.handleInput} />
        {/* better-scroll 在父节点为有限高度的情况下去使用。 */}
        <div className="jerryWrapper" style={{ height: '500px', backgroundColor: 'yellow', overflow: 'hidden' }}>
          <div className="jerryContent">
            {this.state.cinemaList.map(item => (
              <dl key={item.cinemaId}>
                <dt>{item.name}</dt>
                <dd>{item.address}</dd>
              </dl>
            ))}
          </div>
        </div>
      </div>
    )
  }
  handleInput = event => {
    console.log('input:', event.target.value)
    this.setState({
      cinemaList: this.state.sourceCinemaList.filter(
        item =>
          item.name.toUpperCase().includes(event.target.value.toUpperCase()) ||
          item.address.toUpperCase().includes(event.target.value.toUpperCase()),
      ),
    })
  }
}
```

css/index.css

```css
* {
    margin: 0;
    padding: 0;
}

.active {
    color: red;
}

.hidden {
    display: none;
}

ul {
    list-style: none;
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 50px;
    line-height: 50px;
    width: 100%;
    background-color: white;
}

ul li {
    flex: 1;
    text-align: center;
    border: 1px dashed lightgray;
}

dl {
    height: 50px;
    border: 1px solid lightgray;
}

dl dt {
    font-size: 20px;
}

dl dd{
    font-size: 12px;
    color: gray;
}

input {
    width: 80%;
    height: 30px;
    line-height: 30px;
    font-size: 20px;
}
```

效果：

![image-20260121185119940](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260121185121273.png)

### 案例：better-scroll 平滑滚动

安装：*npm i better-scroll*

```js
import React, { Component } from 'react'
import BetterScroll from 'better-scroll'

export default class JerryApp extends Component {
  state = {
    list: [],
  }
  render() {
    return (
      <div>
        <button onClick={this.handleClick}>click</button>
        <div className="wrapper" style={{ height: '200px', backgroundColor: 'yellow', overflow: 'hidden' }}>
          <ul className="content">
            {this.state.list.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
  handleClick = () => {
    let dataList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    this.setState(
      {
        list: dataList,
      },
      () => {
        // 此时 state 和 DOM 才更新完，可以进行初始化 better-scroll
        new BetterScroll('.wrapper')
      },
    )
    console.log(this.state.list) //[]
    console.log(document.querySelectorAll('li')) //NodeList[]
  }
}
```

