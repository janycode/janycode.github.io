---
title: 03-TS+React
date: 2022-5-22 21:36:21
tags:
- React
- TypeScript
- ts
categories: 
- 04_大前端
- 05_TypeScript
---

![React](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260123164723034.png)

参考：

* TypeScript 语法文档：https://zhongsp.gitbooks.io/typescript-handbook/content/
* 案例源码：https://github.com/janycode/react-ts-demo

> 所有文件格式都是 `.ts` 后缀名，React 项目中是 `.tsx` 后缀名（因为使组件化了默认支持 xml 结构）。

## 1. 创建项目

### 1.1 创建

创建项目，如项目命名为 react-ts：

```sh
create-react-app react-ts --template typescript
```

> 如果没有安装 create-react-app ，那么重新全局安装：
>
> *npm un -g create-react-app*
>
> *npm i -g create-react-app*



### 1.2 使用工作区版本

默认创建出来的项目，打开 index.tsx 后，代码会有飘红的语法报错。此时需要做两步：

① 将当前项目放在 VSCode 的文件夹`根目录`（独立该项目在 IDE 下）

② 选择当前 IDE 的 typescript 的版本，Ctrl + Shift + P 输入 `选择typescript` ，然后选择 `使用工作区版本`

解决：飘红的语法报错就没有了！

![image-20260126194329125](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260126194615944.png)

![image-20260126194401119](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260126194618622.png)



### 1.3 版本选择：v18

默认创建出来的 react 项目是 react19 的版本，手动切到了 18 版本，如下命令：

```sh
npm i react@18 react-dom@18
```

而且完美兼容 react-router@6 版本。



## 2. TS 基础

1. TypeScript 的定位是静态类型语言，在`写代码阶段就能检查错误`，而非运行阶段
2. 类型系统是最好的文档，增加了代码的可读性和可维护性。
3. 有一定的学习成本，需要理解接口（Interfaces）、泛型（Generics）、类（Classes）等
4. `.ts 文件`最后被编译成 `.js` 文件



### 2.1 基本类型

* `变量: 类型`
* `变量: 类型1 | 类型2`
* `变量: any` （任何类型，回到 js 弱类型方式了）

```js
var myname = "jerry"
myname = myname.substring(0, 1).toUpperCase() + myname.substring(1)
console.log(myname); //Jerry

var myname: string = "tom"
// myname = 100 //编辑器中直接报错

var myage: number = 100
var ageString: string = myage.toFixed(1)  // toFixed 返回值是字符串
console.log(ageString); //100.0

var myshow: boolean = true
myshow = false

var my: string | number = "jerry"  // 不确定具体类型，可以是 string 也可以是 number
my = 20

var myany: any = 100  //any 任何类型
myany = "spike"
myany = [1, 2, 3]
```



### 2.2 数组

* `list变量: 类型[]`
* `list变量: (类型1 | 类型2)[]`
* `list变量: Array<类型>`

```js
var list = ["1", "2", "3", 4]
for (var i in list) {
    //list[i].substring(0, 1) //ERROR: string | number 不存在 substring()
}

var list1: string[] = ["a", "b", "c"]
list1.push("d")
//list1.push(1) //ERROR: string 数组不能赋值 数字

var list3: number[] = [1, 2, 3]
var list4: (string | number)[] = [1, 2, "aa", "bb"]

// 另一种写法：
var mylist1: Array<string> = ["aa", "bb", "cc"]
mylist1.push("dd")

var mylist2: Array<string | number> = ['aa', 'bb', 11, 22]
mylist2.push('dd')
mylist2.push(33)
```



### 2.3 对象

* `interface` 接口定义对象类型
* `对象: 接口类型`

```js
interface IObj {
    name: string,
    age: number,
    location?: string,  //? 可选属性，赋值时可以没有 location 字段
    [propName: string]: any  // 不关心类型的字段，只关心其他限定类型的字段
}

var obj1: IObj = {
    name: "jerry",
    //age: "18"  //ERROR 类型不符
    age: 18,
    //location: "china" //可选字段
    item: {name: "tom", type: 1}
}
console.log(obj1.name, obj1.age);
```



### 2.4 函数

* `function 函数名(参数: 参数类型): 返回值类型 { }`

```js
// c?: number  可选参数，如果传入则必须数字类型
function test1(a: string, b: string, c?: number): string {
    let res = a.substring(0, 1) + b.substring(0, 1)
    return res
}
let myname: string = test1('jerry', 'tom')
console.log(myname) //jt

interface IFunc {
    (a: string, b:string, c?:number): string
}
var test2: IFunc = test1   //接口约束函数，参数与返回值类型都一致 - 极少使用

interface IObj {
    name: string,
    age: number,
    getName: (name: string) => string
}
var obj: IObj = {
    name: "jerry",
    age: 18,
    getName: (newName: string) => {
        return newName
    }
}
obj.getName("tom")
```



### 2.5 类

* `public`, `private`, `protected-子类可访问` 访问限制同  java 的类属性限制关键字
* `implements 接口` 约定和限制为 接口 类型

```js
class Bus {
    public name = 'jerry'   //共有属性
    private _list: any = {} //私有属性
    protected age = 18      //保护属性
    subscribe(cb: any) {
        this._list.push(cb)
    }
    dispatch() {
        this._list.forEach((cb: any) => {
            cb && cb()
        })
    }
}
var b1 = new Bus()
//console.log(b1._list); // private 不允许直接访问
console.log(b1.name) //jerry

class Child extends Bus {
    test() {
        //console.log(super._list);  //也无法访问到
        console.log(this.name, this.age) //jerry 18
    }
}
var c1 = new Child()
console.log(c1.test()) //jerry 18
```

类 + 接口的用法：思想与 java 语法相同。

```js
interface IFunc {
    getName: () => string
}

class A implements IFunc {
    a1() {}
    a2() {}
    getName() {
        return 'aaa'
    }
}
class B implements IFunc {
    b1() {}
    b2() {}
    getName() {
        return 'bbb'
    }
}
function init(obj: IFunc) {
    objA.getName()
}
var objA = new A()
var objB = new B()
init(objA) //aaa
init(objB) //bbb
```



## 3. TS + React组件

### 3.1 TS + 类组件

#### 基本使用

* `class App extends Component<约定属性, 约定状态>`  - 需要在 Component 上进行泛型限制，才能有 TS 的语法类型检查

```js
import { Component } from 'react'

interface IState {
    name: string
}

export default class App extends Component<any, IState> {
    state: IState = {
        name: 'jerry',
    }
    render() {
        return (
            <div>
                App-{this.state.name.substring(0, 1).toUpperCase() + this.state.name.substring(1)}
                <button onClick={() => {
                        this.setState({
                            name: 'tom',
                            // name: 100, //ERROR：不能将number赋值给string
                        })
                    }}
                >
                    click
                </button>
            </div>
        )
    }
}
```

#### input 断言

* `onChange` 事件中，使用正常的 `Component<约定属性, 约定状态>` 方式
* `ref` 绑定的 input 框，获取 value 值需要断言： `(this.myref.current as HTMLInputElement).value`

```js
import { Component, createRef } from 'react'

interface IState {
    text: string
    list: string[]
}

export default class App extends Component<any, IState> {
    state = {
        text: '',
        list: []
    }
    myref = createRef<HTMLInputElement>()
    render() {
        return (
            <div>
                {/* 第一种 input + onChange */}
                {/* <input type="text" onChange={evt => {
                        console.log(evt.target.value)
                        this.setState({
                            text: evt.target.value,
                        })
                    }}
                /> <div>{this.state.text}</div>
                 */}
                {/* 第二种 input + ref */}
                <input ref={this.myref} />
                <button
                    onClick={() => {
                        // 需要类型断言
                        console.log((this.myref.current as HTMLInputElement).value)
                    }}
                >click</button>
            </div>
        )
    }
}
```

#### props 传值

* 泛型需要限制在 Child `子组件`上

```js
import { Component } from 'react'

interface IProps {
    name: string
}
export default class App extends Component {
    render() {
        return (
            <div>
                App
                <Child name="hello"></Child>
            </div>
        )
    }
}
// 泛型需要限制在 Child 子组件上
class Child extends Component<any, IProps> {
    render() {
        return <div>Child-{this.props.name}</div>
    }
}
```

#### 抽屉案例

点击显隐 Sidebar 组件

```js
import { Component } from 'react'

export default class APP extends Component {
    state = {
        isShow: true,
    }
    render() {
        return (
            <div>
                APP
                <Navbar
                    title="首页"
                    cb={() => {
                        this.setState({
                            isShow: !this.state.isShow,
                        })
                    }}
                ></Navbar>
                {this.state.isShow && <Sidebar></Sidebar>}
            </div>
        )
    }
}
interface IProps {
    title: string
    cb: () => void
}
class Navbar extends Component<any, IProps> {
    render() {
        return (
            <div>
                Navbar-{this.props.title}
                <button onClick={() => this.props.cb()}>change</button>
            </div>
        )
    }
}
class Sidebar extends Component {
    render() {
        return <div>Sidebar</div>
    }
}
```



### 3.2 TS + 函数组件

#### 基本使用

```js
import { useState } from 'react'

export default function App() {
    const [name, setName] = useState<string>('jerry')  //类型约束
    return (
        <div>
            App-{name.substring(0, 1).toUpperCase() + name.substring(1)}
            <button onClick={() => {
                setName("tom")
            }}>click</button>
        </div>
    )
}
```

#### input 断言

```js
import React, { useRef, useState } from 'react'

export default function App() {
    const text = useRef<HTMLInputElement>(null)
    const [list, setList] = useState<string[]>([])
    return <div>
        <input ref={text}></input>
        <button onClick={() => {
            console.log((text.current as HTMLInputElement).value);
            setList([...list, (text.current as HTMLInputElement).value])
        }}>click</button>
        {
            list.map(item => 
                <li key={item}>{item}</li>
            )
        }
    </div>
}
```

#### props 传值

```js
import React, { FC } from 'react'

export default function App() {
    return (
        <div>
            App
            <Child1 name='aaaa'></Child1>
            <Child2 name='bbbb'></Child2>
        </div>
    )
}
interface Iprops {
    name: string
}
// 函数式 子组件写法1
function Child1(props: Iprops) {
    return <div>child1-{props.name}</div>
}
// 函数式 子组件写法2
const Child2: FC<Iprops> = (props) => {
    return <div>child2-{props.name}</div>
}
```

#### 抽屉案例

```js
import React, { useState } from 'react'

export default function App() {
    const [isShow, setIsShow] = useState(true)
    return (
        <div>
            App
            <Navbar title="抽屉" cb={() => {
                setIsShow(!isShow)
            }}></Navbar>
            {isShow && <Sidebar></Sidebar>}
        </div>
    )
}
interface IProps {
    title: string
    cb: () => void
}
function Navbar(props: IProps) {
    return (
        <div>
            Navbar
            <button onClick={() => props.cb()}>click</button>
        </div>
    )
}
function Sidebar() {
    return <div>Sidebar</div>
}
```

### 3.3 TS + 路由

#### 前置安装

安装：*npm i react-router-dom@6*

> 以 router v6 版本 + react v18 为例，如果使用 `import { HashRouter } from 'react-router-dom'` 被 TS 检查**飘红报错**，则需要
>
> 安装：*npm i @types/react-router-dom*
>
> 编译器需要通过这个声明文件，进行类型检查工作（实测 v6 没有这个问题，按需安装）。

目录：

```txt
src/
  router+ts/
    router/
      index.tsx
    views/
      Center.tsx
      Cinema.tsx
      Detail.tsx
      Film.tsx
      FilmWrapper.tsx
    App.tsx
  index.tsx
```

index.tsx

```js
...
import App from './router+ts/App';  //导入验证 .tsx

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### 路由配置

App.tsx - 导入路由配置

```js
import React, { Component } from 'react'
import IndexRouter from './router'

export default class App extends Component {
  render() {
    return (
        <div>
            <IndexRouter></IndexRouter> {/* 导入路由配置 */}
      </div>
    )
  }
}
```

router/index.tsx - 路由配置

```js
import { Component } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Center from '../views/Center'
import Cinema from '../views/Cinema'
import Detail from '../views/Detail'
import FilmWrapper from '../views/FilmWrapper'

export default class IndexRouter extends Component {
    render() {
        return (
            <HashRouter>
                <Routes>
                    <Route path="/film" element={<FilmWrapper />} />
                    <Route path="/cinema" element={<Cinema />} />
                    <Route path="/center" element={<Center />} />

                    <Route path="/detail/:myid" element={<Detail />} />

                    <Route path="/" element={<Navigate to="/film" />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </HashRouter>
        )
    }
}
```

#### 中间层&泛型限定

views/FilmWrapper.tsx - 中间层，传递 navigate 到子组件 props接收（替代方案：高阶组件 withRouter 来做类组件的跳转方案）

```js
import { useNavigate } from 'react-router-dom'
import type { NavigateFunction } from 'react-router-dom'
import Film from './Film' // 导入你的 Film 类组件

// 函数中间层：调用 useNavigate 并传递给 Film 组件
const FilmWrapper = () => {
    const navigate: NavigateFunction = useNavigate() // 获取 navigate
    return <Film navigate={navigate} /> // 👉 传递必填的 navigate props
}

export default FilmWrapper
```

views/Film.tsx - 类组件

* 自定义类型限制：`class Film extends Component<FilmProps, FilmState>`
* 函数中间层 FilmWrapper：`从 props 中拿到父组件(即中间层)传递的 navigate（替代高阶组件注入）`

```js
// src/components/Film.tsx
import React, { Component } from 'react'
import axios from 'axios'
// 导入 v6 内置的路由类型（仅用于类型定义，不调用 Hooks）
import type { NavigateFunction } from 'react-router-dom'

// 1. 定义接口：匹配接口返回的 films 字段（精准类型）
interface IFilmItem {
    filmId: number
    name: string
    poster?: string
    grade?: number
}

// 2. 定义类组件的 Props 类型（包含需要的路由属性：navigate）
interface FilmProps {
    navigate: NavigateFunction // 仅传入需要的 navigate，无需多余属性
}

// 3. 定义类组件的 State 类型（替换 any）
interface FilmState {
    list: IFilmItem[]
}

// 4. 类组件：Props 用 FilmProps，State 用 FilmState（无高阶组件）
export default class Film extends Component<FilmProps, FilmState> {
    // 初始化 state，指定类型
    state: FilmState = {
        list: [],
    }

    componentDidMount(): void {
        axios({
            url: 'https://m.maizuo.com/gateway?cityId=410100&pageNum=1&pageSize=10&type=1&k=1671058',
            headers: {
                'x-client-info': '{"a":"3000","ch":"1002","v":"5.2.1","e":"17689720181688867040133121"}',
                'x-host': 'mall.film-ticket.film.list',
            },
        })
            .then(res => {
                // 类型断言：确保返回数据匹配 IFilmItem 类型
                const films = res.data.data.films as IFilmItem[]
                this.setState({ list: films })
            })
            .catch(err => {
                console.error('请求影片列表失败：', err)
            })
    }

    render(): React.ReactNode {
        const { list } = this.state
        // 从 props 中拿到父组件传递的 navigate（替代高阶组件注入）
        const { navigate } = this.props

        return (
            <div>
                <ul>
                    {list.map((item: IFilmItem) => (
                        <li
                            key={item.filmId}
                            onClick={() => {
                                console.log('影片ID：', item.filmId)
                                // 核心：用传递进来的 navigate 实现跳转（v6 规范）
                                navigate(`/detail/${item.filmId}`)
                            }}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}
```

#### 动态路由

views/Detail.tsx - 函数组件

```js
import { useParams, useNavigate } from 'react-router-dom'

// 1. 修复：添加字符串索引签名（[key: string]: string | undefined）
interface DetailParams {
    myid: string // 明确的参数名
    [key: string]: string | undefined // 满足 Record<string, string | undefined> 约束
}

const Detail = () => {
    // 2. 泛型参数现在符合约束，无报错
    const params = useParams<DetailParams>()
    const { myid } = params // TS 仍能识别 myid 为 string 类型
    const navigate = useNavigate()
    const handleRecommendClick = (filmId: number) => {
        // 跳转到新的 Detail 页（同组件，仅参数变化）
        navigate(`/detail/${filmId}`)
        // 可选：滚动到页面顶部（优化体验）
        window.scrollTo(0, 0)
    }
    return (
        <div>
            <p>路由参数 myid：{myid}</p>
            <div>
                <button onClick={() => handleRecommendClick(1234)}> 猜你喜欢</button>
            </div>
        </div>
    )
}

export default Detail
```



### 3.4 TS + Redux

#### 前置安装

安装：*npm i redux@4.1.2*

目录：

```txt
src/
  redux+ts/
    redux/
      store.ts
    views/
      Detail.tsx
      Film.tsx
    App.tsx
  index.tsx
```

index.tsx - 引入 redux

```js
...
import App from './redux+ts/App';  //导入验证 .tsx

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```



#### store配置

redux/store.ts

```js
import { createStore } from 'redux'

interface IAction {
    type: string
    payload?: any   //可传可不传
}

const reducer = (
    prevState = {
        isShow: true,
    },
    action: IAction,   //明确 action 类型
) => {
    const { type } = action
    const newState = { ...prevState }
    switch (type) {
        case 'show':
            newState.isShow = true
            return newState
        case 'hide':
            newState.isShow = false
            return newState
        default:
            return prevState
    }
}

const store = createStore(reducer)
export default store
```

#### 订阅

App.tsx - 订阅 store 的数据变动，获取 state 中的属性值，控制 tabbar 在 Detail 页的隐藏，其他页面显示。

```js
import React, { Component } from 'react'
import store from './redux/store'
import IndexRouter from './router'

export default class App extends Component {
    state = {
        isShow: store.getState().isShow
    }
    componentDidMount() { 
        store.subscribe(() => {
            // console.log(store.getState());
            this.setState({
                isShow: store.getState().isShow
            })
        })
     }
    render() {
        return (
            <div>
                <IndexRouter></IndexRouter> {/* 导入路由配置 */}
                {/* Tabbar */}
                {this.state.isShow && (
                    <ul>
                        <li>电影</li>
                        <li>影院</li>
                        <li>我的</li>
                    </ul>
                )}
            </div>
        )
    }
}
```

#### 发布

views/Detail.tsx - 发布到 store 数据变动控制 tabbar 隐藏，当页面销毁，则发布 tabbar 显示。

```js
import { useEffect } from 'react'
import store from '../redux/store'

const Detail = () => {
    useEffect(() => {
        store.dispatch({
            type: 'hide',
        })
        return () => {
            store.dispatch({
                type: 'show',
            })
        }
    }, [])

    return (
        <div>
            <p>Detail</p>
        </div>
    )
}

export default Detail
```



### 3.5 TS + Antd-mobile

#### 前置安装

安装：*npm i antd-mobile* - 目前最新版 v5.42.3

> antd v5 版本无需引入 css。

#### Swiper 大轮播

官方文档：https://mobile.ant.design/zh/components/swiper

* 注意遍历时 item 需要类型限定，否则会报 TS 语法检查错误
* 注意 ref 绑定轮播组件时，需要指定组件的类型限定，否则也会报 TS 语法检查错误

```js
import React, { Component, createRef } from 'react'
import { Button, Swiper } from 'antd-mobile'
import axios from 'axios'
import { SwiperRef } from 'antd-mobile/es/components/swiper'

interface IItem {
    filmId: number
    poster: string
}
//以类组件为示例
export default class Cinema extends Component {
    state = {
        filmList: [],
    }
    componentDidMount() {
        axios({
            url: 'https://m.maizuo.com/gateway?cityId=410100&pageNum=1&pageSize=10&type=1&k=6167680',
            headers: {
                'x-client-info': '{"a":"3000","ch":"1002","v":"5.2.1","e":"17689720181688867040133121"}',
                'x-host': 'mall.film-ticket.film.list',
            },
        }).then(res => {
            console.log(res.data.data.films)
            this.setState({
                filmList: res.data.data.films,
            })
        })
    }
    // 函数组件使用: const ref = useRef<SwiperRef>(null)
    // 类组件使用：createRef<>()
    ref = createRef<SwiperRef>()
    render() {
        return (
            <div>
                <div>Cinema</div>
                {/* 大轮播 */}
                <Swiper loop autoplay ref={this.ref}>
                    {this.state.filmList.map((item: IItem) => (
                        <Swiper.Item key={item.filmId}>
                            <img src={item.poster} style={{ width: '100%', height: '200px' }} />
                        </Swiper.Item>
                    ))}
                </Swiper>
                <Button color="danger" onClick={() => {
                    this.ref.current?.swipePrev()  //上一张
                }}>上一个</Button>
                <Button color="primary" onClick={() => {
                    this.ref.current?.swipeNext()  //下一张
                }}>下一个</Button>
            </div>
        )
    }
}
```





