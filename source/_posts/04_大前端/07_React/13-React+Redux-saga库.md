---
title: 13-React+Redux-saga库
date: 2022-5-22 21:36:21
tags:
- React
- redux-saga
categories: 
- 04_大前端
- 07_React
---

![React](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260123164723034.png)

参考：

* redux-saga 官网：https://redux-saga-in-chinese.js.org/index.html



## 1. 介绍

![image-20260127174702284](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260127174704246.png)

在*saga*中，全局监听器和接收器使用*Generator*函数和*saga*自身的一些辅助函数实现对整个流程的管控。



### 1.1 原理：生成器

```js
function *test() {
    console.log("1111");
    var input1 = yield "111-输出";
    console.log("2222", input1);
    var input2 = yield "222-输出";
    console.log("3333", input2);
    var input3 = yield "333-输出";
    console.log("4444", input3);
}

var res = test()
var res1 = res.next() // next 一次会走到第一个 yield
console.log(res1);
var res2 = res.next("aaa") // next 二次会走到第二个 yield
console.log(res2);
var res3 = res.next("bbb") // next 三次会走到第三个 yield
console.log(res3);
var res4 = res.next("ccc")
console.log(res4);
```

输出：

```js
1111
{value: '111-输出', done: false}
2222 aaa
{value: '222-输出', done: false}
3333 bbb
{value: '333-输出', done: false}
4444 ccc
{value: undefined, done: true}
```



### 1.2 原理：可执行生成器

```js
function getData1() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("data1")
        }, 1000)
    })
}
function getData2() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("data2")
        }, 1000)
    })
}
function getData3() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("data3")
        }, 1000)
    })
}

function* gen() {
    var f1 = yield getData1()
    console.log(f1);
    var f2 = yield getData2(f1)
    console.log(f2);
    var f3 = yield getData3(f2)
    console.log(f3);
}

function run(fn) {
    var g = fn()
    function next(data) {
        var result = g.next(data)
        if (result.done) {
            return result.value
        }
        result.value.then(res => {
            next(res)
        })
    }
    next()
}

run(gen)
```

输出：

data1

data2

data3





## 2. 使用 redux-saga

### 2.1 安装

安装：*npm i redux-saga*  - 当前版本 v1.4.2



### 2.2 使用

目录：

```txt
src/
  redux/
    reducer.js
    saga.js
    store.js
  App.js
```

App.js

```js
import React, { Component } from 'react'
import './02-可执行生成器'
import store from './redux/store';

export default class App extends Component {
  render() {
    return (
        <div>
            <button onClick={() => {
                if (store.getState().list1.length === 0) {
                    //dispatch 发布
                    store.dispatch({
                        type: "get-list"
                    })
                } else {
                    console.log("走缓存：", store.getState().list1);
                }
            }}>click-ajax-异步缓存</button>
      </div>
    )
  }
}
```

redux/store.js

```js
import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import reducer from "./reducer";
import watchSaga from "./saga";

const SagaMiddleware = createSagaMiddleware()
const store = createStore(reducer, applyMiddleware(SagaMiddleware))

SagaMiddleware.run(watchSaga) //saga任务

export default store
```

redux/saga.js

```js
import {take, put, fork, call} from 'redux-saga/effects'

function* watchSaga() {
    while (true) {
        // take 监听组件发来的 action
        yield take("get-list")
        // fork 同步立即执行异步处理函数 fn
        yield fork(getList)
    }
}

// 异步处理函数
function *getList() {
    //call 函数发异步请求
    let res = yield call(getListAction) //阻塞调用 fn
    yield put({
        type: "change-list",
        payload: res
    })
    //put 函数发出新的 action
}

function getListAction() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(["111", "222", "333"])
        }, 2000);
    })
}

export default watchSaga
```

redux/reducer.js

```js
function reducer(prevState = {
    list1: []
}, action = {}) {
    console.log(action);
    var newState = {...prevState}
    switch (action.type) {
        case "change-list":
            newState.list1 = action.payload
            return newState
        default:
            return prevState
    }
}

export default reducer
```

效果：点击按钮先触发 action1，即 get-list，然后触发 Promise 2s后拿到数据 change-list 中获取到值，后面再点击就走缓存。

![image-20260127184247970](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260127184248994.png)





### 2.3 多个 saga 监听

案例源码：https://github.com/janycode/react-ts-demo/tree/main/src/09-redux-saga/redux



### 2.4 takeEvery 写法

案例源码：https://github.com/janycode/react-ts-demo/commit/3c902f411c4647c546c6b61f4c1a5316e4e009d1



效果（2.3 & 2.4）：

![image-20260127190348272](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260127190351633.png)



