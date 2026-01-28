---
title: 12-React单元测试
date: 2022-5-22 21:36:21
tags:
- React
- 单元测试
- react-test-renderer
categories: 
- 04_大前端
- 07_React
---

![re269r227-react-logo-react-logo-import-io](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260128100650181.png)

参考：

* react-test-renderer 官网：https://zh-hans.legacy.reactjs.org/docs/test-renderer.html



## 1. react-test-renderer

### 1.1 安装

安装：*npm i react-test-renderer@18* - 对应 react 的版本，当前用的是 v18 就暂时下载的是 v18



### 1.2 使用

目录：

```js
src/
  test/
    react-test-renderer.test.js    //必须是 .test.js 命名的 js 文件
  App.js
```

test/react-test-renderer.test.js - 步骤：①运行 `npm test`； ②按 `a` 开始测试，观察全部 [PASS]()

```js
import ShallowRender from 'react-test-renderer/shallow'  //导入测试模块
import App from '../App'

describe("react-test-renderer", () => {
    //单元测试 it
    it("app 的名字是 jerry-todolist", () => {
        const render = new ShallowRender()  //虚拟 DOM
        render.render(<App />)
        // console.log(render.getRenderOutput());
        // console.log(render.getRenderOutput().props);
        expect(render.getRenderOutput().props.children[0].type).toBe("h1")
        expect(render.getRenderOutput().props.children[0].props.children).toBe("Jerry-todolist")
    })
})
```

App.js

```js
import React, { Component } from 'react'

export default class App extends Component {
    state = {
        text: "",
        list: ["111", "222", "333"]
    }
    render() {
        return (
            <div>
                <h1>Jerry-todolist</h1>
                <input onChange={(evt) => {
                    this.setState({
                        text: evt.target.value
                    })
                }} />
                <button onClick={() => {
                    this.setState({
                        text: "",
                        list: [...this.state.list, this.state.text]
                    })
                }}>add</button>
                <ul>
                    {
                        this.state.list.map((item, index) =>
                            <li key={item}>
                                {item}-<button className='del' onClick={(index) => {
                                    let newlist = [...this.state.list]
                                    newlist.splice(index, 1)
                                    this.setState({
                                        list: newlist
                                    })
                                }}>del</button>
                            </li>
                        )
                    }
                </ul>
            </div>
        )
    }
}
```

























