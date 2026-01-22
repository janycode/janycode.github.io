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

* `ref 标记` (父组件拿到子组件的引用，从而调用子组件的方法)——比**表单域组件(父子通信)**的方式更方便。
  * 在父组件中清除子组件的 input 输入框的 value 值。`this.refs.form.reset()`

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



#### 受控组件(父子通信)

目录

```txt
component/
  Center.js
  Cinema.js
  Film.js
  Infomation.js
  Navbar.js
  Tabbar.js
index.js
```

index.js

```js
import React, { Component } from 'react'
import './css/02-maizuo.css'
import Film from './component2/Film'
import Cinema from './component2/Cinema'
import Infomation from './component2/Infomation'
import Center from './component2/Center'
import Tabbar from './component2/Tabbar'
import Navbar from './component2/Navbar'

export default class JerryApp extends Component {
  state = {
    currentId: 1,
    list: [
      { id: 1, text: '电影' },
      { id: 2, text: '影院' },
      { id: 3, text: '资讯' },
      { id: 4, text: '我的' },
    ],
  }
  render() {
    return (
      <div>
        <Navbar
          myevent={() => {
            console.log('navbar myevent....')
            this.setState({
              currentId: 4,
            })
          }}
        ></Navbar>
        {
          this.which() // 函数表达式
        }
        <Tabbar
          myevent={id => {
            // 父组件定义的方法，子组件传的方法参数 id
            this.setState({ currentId: id })
          }}
          currentId={this.state.currentId}
          list={this.state.list}
        ></Tabbar>
      </div>
    )
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

Navbar.js

```js
import React, { Component } from 'react'

export default class Navbar extends Component {
  render() {
    return (
      <div style={{ background: 'yellow', textAlign: 'center', overflow: 'hidden' }}>
        <button style={{ float: 'left' }}>back</button>
        <span>热卖电影</span>
        <button
          style={{ float: 'right' }}
          onClick={() => {
            this.props.myevent()
          }}
        >
          center
        </button>
      </div>
    )
  }
}

```

Tabbar.js - 类组件 & 函数组件

```js
// import React, { Component } from 'react'

// export default class Tabbar extends Component {
//   render() {
//     return (
//       <div>
        // <ul>
        //   {this.props.list.map(item => (
        //     <li
        //       key={item.id}
        //       /* 使用 this.props 接收父组件传过来参数的 currentId 控制高亮 */
        //       className={this.props.currentId === item.id ? 'active' : ''}
        //       onClick={() => this.handleClick(item.id)}
        //     >
        //       {item.text}
        //     </li>
        //   ))}
        // </ul>
//       </div>
//     )
//   }
  // handleClick(id) {
  //   this.setState({
  //     currentId: id,
  //   })
  //   // 通知父组件，修改父组件的状态
  //   this.props.myevent(id)
  // }
// }

import React from 'react'

export default function Tabbar(props) {
  return (
    <div>
      <ul>
        {props.list.map(item => (
          <li
            key={item.id}
            /* 使用 this.props 接收父组件传过来参数的 currentId 控制高亮 */
            className={props.currentId === item.id ? 'active' : ''}
            onClick={() => props.myevent(item.id)}
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

效果：点击导航栏的 center，会导致组件内容切换为 center的内容，且 Tabbar 也会高亮到 我的。

#### 表单域组件(父子通信)

```js
import React, { Component } from 'react'

export default class JerryApp extends Component {
  state = {
    username: localStorage.getItem('username'),
    password: '',
  }
  render() {
    return (
      <div>
        <h1>登录页面</h1>
        <Field
          /* 父传子：属性 */
          label="用户名"
          type="text"
          /* 子传父：子组件触发自定义事件 onChangeEvent */
          onChangeEvent={value => {
            console.log(value)
            this.setState({ username: value })
            localStorage.setItem('username', value)
          }}
          /* 通过 value 绑定父的 state 给子，用于重置时清空表单 */
          value={this.state.username}
        />
        <Field
          label="密码"
          type="password"
          onChangeEvent={value => {
            console.log(value)
            this.setState({ password: value })
          }}
          value={this.state.password}
        />
        <button
          onClick={() => {
            console.log('登录:', this.state.username, this.state.password)
          }}
        >
          登陆
        </button>
        <button
          onClick={() => {
            this.setState({
              username: '',
              password: '',
            })
          }}
        >
          重置
        </button>
      </div>
    )
  }
}

class Field extends Component {
  render() {
    return (
      <div>
        <label>{this.props.label}</label>
        <input
          type={this.props.type}
          onChange={evt => {
            this.props.onChangeEvent(evt.target.value)
          }}
          value={this.props.value}
        />
      </div>
    )
  }
}
```

#### 表单域组件(ref 方式)

```js
import React, { Component, createRef } from 'react'

export default class JerryApp extends Component {
  username = createRef()
  password = createRef()
  render() {
    return (
      <div>
        <h1>登录页面</h1>
        <Field
          /* 父传子：属性 */
          label="用户名"
          type="text"
          /* ref 绑定父的 Ref 变量，就可以【强取】拿到子组件的 state状态 */
          ref={this.username}
        />
        <Field label="密码" type="password" ref={this.password} />
        <button
          onClick={() => {
            console.log(this.username.current.state.value, this.password.current.state.value)
          }}
        >
          登陆
        </button>
        <button
          onClick={() => {
            this.username.current.clear()
            this.password.current.clear()
          }}
        >
          重置
        </button>
      </div>
    )
  }
}

class Field extends Component {
  state = {
    value: '',
  }
  clear() {
    this.setState({ value: '' })
  }
  setValue(value) {
    this.setState({ value: value })
  }
  render() {
    return (
      <div>
        <label>{this.props.label}</label>
        <input
          type={this.props.type}
          onChange={evt => {
            this.setState({
              value: evt.target.value /* 设置为自己的 state */,
            })
          }}
          value={this.state.value}
        />
      </div>
    )
  }
}
```



### 2.2 非父子通信

#### ① 状态提升(中间人模式)

React中的状态提升就是将多个组件需要共享的状态提升到它们最近的父组件上，在父组件上改变这个状态然后通过props分发给子组件。

```js
import React, { Component } from 'react'
import axios from 'axios'

export default class JerryApp extends Component {
  constructor() {
    super()

    this.state = {
      filmList: [],
      info: '',
    }

    //演示：临时请求数据，axios 第三方库
    axios({
      url: 'https://m.maizuo.com/gateway?cityId=410100&pageNum=1&pageSize=10&type=1&k=7050049',
      headers: {
        'x-client-info': '{"a":"3000","ch":"1002","v":"5.2.1","e":"17689720181688867040133121","bc":"410100"}',
        'x-host': 'mall.film-ticket.film.list',
      },
    })
      .then(res => {
        console.log(res.data.data.films)
        this.setState({
          filmList: res.data.data.films,
        })
      })
      .catch(err => {
        console.error('请求出错', err)
      })
  }

  render() {
    return (
      <div>
        {this.state.filmList.map(item => (
          <FilmItem
            key={item.filmId}
            {...item}
            onEvent={value => {
              console.log("父：", value)
              this.setState({ info: value })
            }}
          ></FilmItem>
        ))}
        <FilmDetail info={this.state.info}></FilmDetail>     {/* 父传子：属性 */}
      </div>
    )
  }
}
/* 受控组件 */
class FilmItem extends Component {
  render() {
    //console.log(this.props); // 接收 {...item}
    let { name, poster, grade, synopsis, director } = this.props
    return (
      <div style={{ overflow: 'hidden', padding: '10px' }}>
        <img
          src={poster}
          alt={name}
          style={{ width: '100px', float: 'left' }}
          onClick={() => {
            console.log('FilmItem:', director)
            this.props.onEvent(director)                /* 子传父：调用父的方法 */
          }}
        />
        <h4>{name}</h4>
        <div>观众评分:{grade}</div>
      </div>
    )
  }
}

class FilmDetail extends Component {
  obj = { position: 'fixed', right: 0, top: '100px', backgroundColor: 'yellow', width: '300px', height: '300px' }
  render() {
    return <div style={this.obj}>{this.props.info}</div>
  }
}
```

效果：

![chrome-capture-2026-01-22](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260122120047193.gif)

#### ② 发布订阅模式

```js
import React, { Component } from 'react'
import axios from 'axios'

// 订阅发布中心
var bus = {
  list: [],
  subscribe(cb) {
    //订阅
    this.list.push(cb)
  },
  publish(text) {
    //发布
    this.list.forEach(cb => cb && cb(text))
  },
}

export default class JerryApp extends Component {
  constructor() {
    super()

    this.state = {
      filmList: [],
    }

    //演示：临时请求数据，axios 第三方库
    axios({
      url: 'https://m.maizuo.com/gateway?cityId=410100&pageNum=1&pageSize=10&type=1&k=7050049',
      headers: {
        'x-client-info': '{"a":"3000","ch":"1002","v":"5.2.1","e":"17689720181688867040133121","bc":"410100"}',
        'x-host': 'mall.film-ticket.film.list',
      },
    })
      .then(res => {
        console.log(res.data.data.films)
        this.setState({
          filmList: res.data.data.films,
        })
      })
      .catch(err => {
        console.error('请求出错', err)
      })
  }

  render() {
    return (
      <div>
        {this.state.filmList.map(item => (
          <FilmItem key={item.filmId} {...item}></FilmItem>
        ))}
        <FilmDetail></FilmDetail> {/* 父传子：属性 */}
      </div>
    )
  }
}
/* 受控组件 */
class FilmItem extends Component {
  render() {
    //console.log(this.props); // 接收 {...item}
    let { name, poster, grade, director } = this.props
    return (
      <div style={{ overflow: 'hidden', padding: '10px' }}>
        <img
          src={poster}
          alt={name}
          style={{ width: '100px', float: 'left' }}
          onClick={() => {
            console.log('FilmItem:', director)
            bus.publish(director) //发布
          }}
        />
        <h4>{name}</h4>
        <div>观众评分:{grade}</div>
      </div>
    )
  }
}

class FilmDetail extends Component {
  constructor() {
    super()
    this.state = {
      info: '',
    }
    bus.subscribe(value => {
      //订阅
      console.log('我是订阅者')
      this.setState({ info: value })
    })
  }

  obj = { position: 'fixed', right: 0, top: '100px', backgroundColor: 'yellow', width: '300px', height: '300px' }
  render() {
    return <div style={this.obj}>{this.state.info}</div>
  }
}
```

效果：同上。



#### ③ context 状态树传参

React 提供的`跨级通信方案`，原理是 `生产者消费者` 模式。

* 注意：GlobalContext.Consumer 内必须是`回调函数写法`，通过 context 方法改变根组件状态

* 优点：跨组件访问数据

* 缺点：react 组件树种某个上级组件 shouldComponetUpdate 返回 false，当 context 更新时，不会引起下级组件更新

```js
import React, { Component, createContext } from 'react'
import axios from 'axios'

// 创建 context 对象
const GlobalContext = createContext()

export default class JerryApp extends Component {
  constructor() {
    super()

    this.state = {
      filmList: [],
      info: '',
    }

    //演示：临时请求数据，axios 第三方库
    axios({
      url: 'https://m.maizuo.com/gateway?cityId=410100&pageNum=1&pageSize=10&type=1&k=7050049',
      headers: {
        'x-client-info': '{"a":"3000","ch":"1002","v":"5.2.1","e":"17689720181688867040133121","bc":"410100"}',
        'x-host': 'mall.film-ticket.film.list',
      },
    })
      .then(res => {
        console.log(res.data.data.films)
        this.setState({
          filmList: res.data.data.films,
        })
      })
      .catch(err => {
        console.error('请求出错', err)
      })
  }

  render() {
    // 使用全局 context Provider 包裹组件最外层标签，指定 value 属性传 obj
    return (
      <GlobalContext.Provider
        value={{
          info: this.state.info,
          changeInfo: value => {
            this.setState({ info: value })
          },
        }}
      >
        <div>
          {this.state.filmList.map(item => (
            <FilmItem key={item.filmId} {...item}></FilmItem>
          ))}
          <FilmDetail></FilmDetail>
        </div>
      </GlobalContext.Provider>
    )
  }
}
/* 受控组件 */
class FilmItem extends Component {
  render() {
    let { name, poster, grade, director } = this.props
    // 使用全局 context Consumer 包裹组件最外层标签，且使用{()=>{...}} 匿名回调再次包裹
    return (
      <GlobalContext.Consumer>
        {value => {
          return (
            <div style={{ overflow: 'hidden', padding: '10px' }}>
              <img
                src={poster}
                alt={name}
                style={{ width: '100px', float: 'left' }}
                onClick={() => {
                  console.log('FilmItem:', director)
                  value.changeInfo(director) // 修改 context Provider 中的对象值 value.changeXxx()
                }}
              />
              <h4>{name}</h4>
              <div>观众评分:{grade}</div>
            </div>
          )
        }}
      </GlobalContext.Consumer>
    )
  }
}

class FilmDetail extends Component {
  obj = { position: 'fixed', right: 0, top: '100px', backgroundColor: 'yellow', width: '300px', height: '300px' }
  render() {
    // 使用全局 context Consumer 包裹组件最外层标签，且使用{()=>{...}} 匿名回调再次包裹
    return (
      <GlobalContext.Consumer>
        {value => {
          return <div style={this.obj}>detail-{value.info}</div> //使用 context Provider 中的对象值 value.info
        }}
      </GlobalContext.Consumer>
    )
  }
}
```



### 3. 插槽

#### this.props.children

`this.props.children[index]` 固定属性 children 数组，默认是插槽替换过来所有内容，也可以通过下标控制插槽内容的顺序。

1. 提高组件的复用性
2. 一定程度减少父子通信

```js
import React, { Component } from 'react'

export default class JerryApp extends Component {
  render() {
    return (
      <div>
        <Child>
          <div>app child-div1</div>
          <div>app child-div2</div>
          <div>app child-div3</div>
        </Child>
      </div>
    )
  }
}

class Child extends Component {
  render() {
      return (
        <div>
          child-具名插槽-特殊属性 this.props.children
          {this.props.children[2]}
          {this.props.children[1]}
          {this.props.children[0]}
        </div>
      )
  }
}
```

效果：

```txt
child-具名插槽-特殊属性 this.props.children
app child-div3
app child-div2
app child-div1
```



插槽抽屉：

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
        <Navbar>
          <button onClick={() => {
              this.setState({ isShow: !this.state.isShow })
            }}
          >
            click
          </button>
        </Navbar>
        <Sidebar isShow={this.state.isShow}></Sidebar>
      </div>
    )
  }
}

class Navbar extends Component {
  render() {
    return (
      <div style={{ background: 'yellow' }}>
        {this.props.children}  {/* 插槽：将父组件定义的 button 替换进来 */}
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

































