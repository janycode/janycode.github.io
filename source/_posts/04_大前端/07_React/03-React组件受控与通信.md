---
title: 03-React组件受控与通信
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


## 1.受控与非受控组件

### 1.1 表单非受控组件

* `ref 来从 DOM 节点中获取表单数据，就是非受控组件`
* 如果你不介意代码美观性，并且希望快速编写代码，使用非受控组件往往可以减少你的代码量。否则，你应该使用**受控组件**。
* 在 React 渲染生命周期时，表单元素上的 value 将会覆盖 DOM 节点中的值，在非受控组件中，你经常希望 React 能赋予组件一个初始值，但是不去控制后续的更新。 在这种情况下, 你可以指定一个 `defaultValue` 属性，而不是 **value** 。
* 同样， `<input type="checkbox">` 和 `<input type="radio">` 支持 defaultChecked ，`<select>`和 `<textarea>`支持 defaultValue 。

非受控组件表单示例：

```js
import React, { Component, createRef } from 'react'

export default class JerryApp extends Component {
  myusername = createRef()
  render() {
    return (
      <div>
        <h1>登录页</h1>
        <input type="text" ref={this.myusername} defaultValue="jerry" />
        <button
          onClick={() => {
            console.log(this.myusername.current.value)
          }}
        >
          登陆
        </button>
        <button
          onClick={() => {
            this.myusername.current.value = ''
          }}
        >
          重置
        </button>
      </div>
    )
  }
}
```

### 1.2 表单受控组件

* 由于在表单元素上设置了 value 属性，因此显示的值将始终为 this.state.value ，这使得 React 的 state 成为唯一数据源。由于 handlechange 在每次按键时都会执行并更新 React 的 state，因此显示的值将随着用户输入而更新。

  对于受控组件来说，输入的值始终由 React 的 state 驱动。你也可以将 value 传递给其他 UI 元素，或者通过其他事件处理函数重置，但这意味着你需要编写更多的代码。

受控表单示例：

```js
import React, { Component, createRef } from 'react'

export default class JerryApp extends Component {
  state = {
    username: 'jerry',
  }
  render() {
    return (
      <div>
        <h1>登录页</h1>
        <input
          type="text"
          value={this.state.username}
          onChange={evt => {
            console.log(evt.target.value)
            this.setState({
              username: evt.target.value,
            })
          }}
        />
        <button onClick={() => { console.log(this.state.username) }}>登陆</button>
        <button onClick={() => { this.setState({ username: "" }) }}>重置</button>
        
        {/* 就可以再子组件中传入受控的 state 的 状态值 */}
        <Child myvalue={this.state.username}></Child>
      </div>
    )
  }
}
```

> 注意: 另一种说法（广义范围的说法），React 组件的数据渲染是否被调用者传递的 `props 完全控制，控制则为受控组件，否则非受控组件`。

#### 案例：列表跟随输入筛选

```js
import React, { Component } from 'react'
import axios from 'axios'
import BScroll from 'better-scroll'

export default class Cinema extends Component {
  constructor() {
    super()

    this.state = {
      cinemaList: [],
      mytext: ""
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
        Cinema-{this.state.mytext}
        {/* 受控表单组件 input */}
        <input value={this.state.mytext} onChange={(evt) => {
          this.setState({
            mytext: evt.target.value
          })
        }}/>
        {/* better-scroll 在父节点为有限高度的情况下去使用。 */}
        <div className="jerryWrapper" style={{ height: '500px', backgroundColor: 'yellow', overflow: 'hidden' }}>
          <div className="jerryContent">
            {/* 直接调用方法 */}
            {this.getCinemaList().map(item => (
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

  getCinemaList() {
    /* this.state.mytext 受控，会跟随输入值的改变而改变，因此列表也会改变 */
    return this.state.cinemaList.filter(
        item =>
          item.name.toUpperCase().includes(this.state.mytext.toUpperCase()) ||
          item.address.toUpperCase().includes(this.state.mytext.toUpperCase()),
      )
  }
}
```

#### 案例：todolist - 受控组件

* checkbox 多选框 与 删除线 关联 受控组件 input checkbox 框的逻辑

```js
import React, { Component } from 'react'

export default class JerryApp extends Component {
  state = {
    mytext: '',
    list: [
      { id: 1, text: 'aaa', isChecked: false },
      { id: 2, text: 'bbb', isChecked: false },
      { id: 3, text: 'ccc', isChecked: false },
    ],
  }
  render() {
    return (
      <div>
        <input
          value={this.state.mytext}
          onChange={evt => {
            this.setState({ mytext: evt.target.value })
          }}
        />
        <button onClick={this.handleClick}>添加</button>
        <ul>
          {this.state.list.map(item => (
            <li key={item.id}>
              <input type="checkbox" checked={item.isChecked} onChange={() => this.handleChecked(item.id)} />
              <span style={{ textDecoration: item.isChecked ? 'line-through' : '' }}>
                {item.id}-{item.text}
              </span>
              <button onClick={() => this.handleDelClick(item.id)}>删除</button> {/* 第二种传参方式 */}
            </li>
          ))}
        </ul>
        {/* 方案2：条件判断列表的长度为 0 时，才执行 && 后面的内容 */}
        {!this.state.list.length && <div>暂无待办事项2</div>}
      </div>
    )
  }

  handleChecked = id => {
    console.log(id)
    let newList = [...this.state.list]
    let data = newList.find(item => item.id === id)
    data.isChecked = !data.isChecked
    this.setState({
      list: newList,
    })
  }

  handleClick = () => {
    //手动设置到 state，才会更新
    this.setState(
      {
        mytext: '',
        list: [
          ...this.state.list, //展开数组，深拷贝
          {
            id: Math.floor(Math.random() * 100) + 1, //1-100
            text: this.state.mytext,
            isChecked: false,
          },
        ],
      },
      () => {
        console.log('新的list：', this.state.list)
      },
    )
  }
  handleDelClick = id => {
    console.log('del id', id)
    let newList = this.state.list.slice() // slice() 深拷贝
    newList = newList.filter(item => item.id !== id) //
    this.setState({
      list: newList,
    })
  }
}
```

![image-20260121185034815](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260121185036200.png)



## 2. 组件通信

### 2.1 父子通信

* 父传子：`传递属性` —— 父组件上自定义标签属性 xxx，子组件使用 `this.props.xxx` 接收
* 子传父：`传递方法` —— 父组件上自定义事件回调 callback 函数 myevent(如修改父state)，子组件使用 `this.props.myevent()` 触发父组件执行函数

* `ref 标记` (父组件拿到子组件的引用，从而调用子组件的方法)
  * 在父组件中清除子组件的 input 输入框的 value 值。**this.refs.form.reset()**

父子通信示例：

```js
import React, { Component } from 'react'

export default class JerryApp extends Component {
  state = {
    isShow: false,
  }

  handleEvent = () => {
    this.setState({ isShow: !this.state.isShow })
  }
  render() {
    return (
      <div>
        {/* 子传父：回调函数方式 */}
        <Navbar myevent={this.handleEvent}></Navbar>
        {/* 父传子：属性 */}
        <Sidebar isShow={this.state.isShow}></Sidebar>
        {/* 或默认不创建DOM方式： {this.state.isShow && <Sidebar></Sidebar>} */}
      </div>
    )
  }
}

class Navbar extends Component {
  render() {
    return (
      <div style={{ background: 'yellow' }}>
        <button onClick={() => { this.props.myevent() }}> click </button>
        <span>navbar</span>
      </div>
    )
  }
}

class Sidebar extends Component {
  render() {
    return (
      <div style={{ display: this.props.isShow ? '' : 'none', background: 'red' }}>
        <ul>
          <li>1111</li>
          <li>1111</li>
          <li>1111</li>
        </ul>
      </div>
    )
  }
}
```

效果：

![chrome-capture-2026-01-21](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260121195425090.gif)





### 2.2 非父子通信















