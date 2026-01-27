---
title: 11-React+styled-components库
date: 2022-5-22 21:36:21
tags:
- React
- styled-components
categories: 
- 04_大前端
- 07_React
---

![React](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260123164723034.png)

参考：

* styled-components 官网：https://styled-components.com/
* styled-components 教程：https://www.zhifeiya.cn/reference/styled-components.html



## 1. styled-components

> 它是通过*JavaScript*改变*CSS*编写方式的解决方案之一，从根本上解决常规*CSS*编写的一些弊端。
>
> 通过*JavaScript*来为*CSS*赋能，我们能达到常规*CSS*所不好处理的逻辑复杂、函数方法、复用、避免干扰。样式书写将直接依附在*JSX*上面，*HTML*、*CSS*、*JS*三者再次内聚，**all in js** 的思想。

### 1.1 安装

安装：*npm i styled-components* - 当前大版本是 v6

VSCode 插件

安装：**vscode-styled-components** 可以支持 styled-components 在 js 或 ts 文件中写 css 也能高亮且提示。



### 1.2 基本使用

* 所有的样式语法都使用 ` styled.xxx`` ` 语法。

```js
import React, { Component } from 'react'
import { styled } from 'styled-components' //引入 styled 带样式的组件

export default class App extends Component {
    render() {
        // 使用 `` 包裹样式代码，返回的是一个标签组件
        const StyledFooter = styled.footer`
            background: yellow;
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 50px;
            line-height: 50px
            text-align: center;
            ul {
                display: flex;
                list-style: none;
                li{
                    flex: 1;
                    &:hover {
                        background: red;
                    }
                }
                
            }
        `
        return (
            <StyledFooter>
                <footer>
                    <ul>
                        <li>首页</li>
                        <li>列表</li>
                        <li>我的</li>
                    </ul>
                </footer>
            </StyledFooter>
        )
    }
}
```

![image-20260127160551278](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260127160552885.png)





### 1.3 透传 props

```js
import React, { Component } from 'react'
import { styled } from 'styled-components'

export default class App extends Component {
    render() {
        const StyledInput = styled.input`
            outline: none;
            border-radius: 10px;
            border-bottom: 1px solid red;
        `
        const StyledDiv = styled.div`
            background: ${props => props.bg || 'yellow'};
            width: 100px;
            height: 100px;
        `
        return (
            <div>
                App
                <StyledInput type="password" placeholder="请输入" />
                <StyledDiv bg="red"></StyledDiv>
            </div>
        )
    }
}
```

![image-20260127161327218](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260127161328211.png)



### 1.4 样式化组件

```js
import { Component } from 'react'
import styled from 'styled-components'

export default class App extends Component {
    render() {
        const StyledChild = styled(Child)`
            background: yellow;
        `
        return (
            <div>App
                {/* 默认会传给子组件 className 属性 */}
                <StyledChild></StyledChild>
            </div>
        )
    }
}

function Child(props) {
    return <div className={props.className}>child</div>
}
```

![image-20260127161737462](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260127161738680.png)





### 1.5 样式继承

```js
import React, { Component } from 'react'
import styled from 'styled-components'

export default class App extends Component {
    render() {
        const StyledButton = styled.button`
            width: 60px;
            height: 30px;
            background: yellow;
        `
        // 样式继承
        const StyledButton2 = styled(StyledButton)`
            background: blue;
        `
    return (
        <div>App
            <StyledButton>按钮1</StyledButton>
            <StyledButton2>按钮2</StyledButton2>
      </div>
    )
  }
}
```

![image-20260127162109107](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260127162110372.png)





### 1.6 动画

```js
import { Component } from 'react'
import styled, { keyframes } from 'styled-components'

export default class App extends Component {
    render() {
        const myaniamtion = keyframes`
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        `
        const StyleDiv = styled.div`
            width: 100px;
            height: 100px;
            background: yellow;
            animation: ${myaniamtion} 1s infinite
        `
        return (
            <div>
                <StyleDiv></StyleDiv>
            </div>
        )
    }
}
```

![chrome-capture-2026-01-27](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260127163043755.gif)





