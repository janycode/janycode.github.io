---
title: 05-React Hooks
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
* 参考资料：https://juejin.cn/post/7492238013192454170



## React Hooks

React Hooks 是 React 16.8 版本引入的一项重大特性。它`允许在不编写 class 的情况下使用 state 以及 React 的其他特性（如生命周期、context 等）`。

使用 Hooks 的理由：

1. 高阶组件为了复用，导致代码层级复杂
2. 生命周期的复杂
3. 写成 `function` 组件,无状态组件，因为需要状态，又改成了 class, 成本高

> 注意：
>
> 1. function 函数式组件中 `没有 this` 
> 2. function 函数式组件`不存在生命周期`，所以不要把 *Class Component* 的生命周期概念搬过来试图对号入座

### 1. userState() - 保存组件状态

`useState` - 在函数组件中添加和管理 state 状态。

**应用**：*管理组件内部的交互状态（最基础）、管理表单控件的状态（受控组件）、管理异步请求的状态（加载 / 成功 / 失败）、管理组件的动态渲染逻辑 等*

> 一句话记： **useState 是函数组件的 “视图发动机”—— 凡是需要「修改后让页面更新」的局部状态，都用它；不需要页面更新的持久数据用 useRef，跨组件共享用 useContext。**

**语法**：

```js
const [state, setstate] = useState(initialState)
//const [myname, setMyname] = useState("")
```

**使用**：

```js
import React, { useState } from 'react'

export default function App() {
    const [name, setName] = useState('jerry')
    const [age, setAge] = useState(20)
    return (
        <div>
            <button onClick={() => {
                setName('tom')
                setAge(18)
            }}>
                click
            </button>
            App-{name}-{age}
        </div>
    )
}
```

**原理：**

1. 首次渲染：
   - 调用 `useState(initialState)`。
   - React 在当前组件 Fiber 节点的 Hooks 链表中创建一个新的节点，存储 `initialState`。
   - 返回 `[initialState, dispatchSetState]`。`dispatchSetState` 是一个与该 state 关联的更新函数。
2. 后续渲染：
   - 再次调用 `useState`。
   - React 根据调用顺序找到对应的 Hook 节点。
   - 返回 `[currentState, dispatchSetState]`，`currentState` 是该 Hook 节点当前存储的值。
3. 状态更新 (`setState`):
   - 调用 `setState(newState)` 或 `setState(prevState => newState)`。
   - React 会将这个更新操作加入到一个更新队列中，并计划一次新的渲染。
   - 在下一次渲染时，React 会处理队列中的更新，计算出新的 state 值，并将其存储回对应的 Hook 节点。
   - 如果新的 state 值与旧的 state 值相同（使用 `Object.is` 比较），React 会跳过这次渲染（优化）。

案例：todolist

```js
import React, { useState } from 'react'

export default function App() {
    const [text, setText] = useState('')
    const [list, setList] = useState(['待办1', '待办2', '待办3'])
    const handleChange = evt => {
        setText(evt.target.value)
    }
    const handleAdd = () => {
        console.log(text)
        setList([...list, text])
        setText('') //清空
    }
    const handleDel = index => {
        console.log(index);
        let newList = [...list]
        newList.splice(index, 1)
        setList(newList)
    }
    return (
        <div>
            <input onChange={handleChange} value={text} />
            <button onClick={handleAdd}>add</button>
            <ul>
                {list.map((item, index) => (
                    <li key={item}>
                        {item}
                        <button onClick={() => handleDel(index)}>del</button>
                    </li>
                ))}
            </ul>
            {!list.length && <div>暂无待办事项</div>}
        </div>
    )
}
```



### 2. useEffect() - 处理副作用

`useEffect` - 处理副作用（Side Effects）。它类似于 class 组件中的 componentDidMount, componentDidUpdate, 和 componentWillUnmount 的组合。（覆盖99%场景）

**应用**：*数据获取、全局监听（窗口大小、滚动）、设置定时器、设置订阅、监听 Props/State 变化，执行二次处理（如搜索框输入后请求联想）、手动修改 DOM 样式 等* 

> 一句话记：**大部分场景用 useEffect，只有「操作 DOM 且怕闪烁」时用 useLayoutEffect**。

**语法**：

```js
useEffect(() => {
    //effect code
    return () => {
    	//[可选]cleanup: 清理逻辑，在组件卸载或下一次 effect 执行之前运行
    };
}, [依赖的状态-空数组表示不依赖])  //依赖的state改变，effect code会再次执行
```

**第一个参数（effect 函数）：** 包含副作用逻辑的函数。

**第二个参数（依赖项数组 `deps`，可选）：**

- **不提供 `deps`：** effect 函数在每次组件渲染完成后都会执行。
- **提供空数组 `[]`：** effect 函数只在组件`首次渲染时只执行一次`（类似于 componentDidMount）。清理函数只在组件**卸载**时执行一次（类似于 componentWillUnmount）。
- **提供包含依赖项的数组 `[dep1, dep2]`：** effect 函数在首次渲染后执行，并且在`任何一个依赖项发生变化后的渲染完成后再次执行`（类似于 componentDidUpdate 中对特定 props 或 state 的检查）。清理函数会在组件卸载前或下一次 effect 执行前运行。

**原理：**

1. **调度：** 在组件渲染完成后，React 不会立即执行 `useEffect` 中的函数。它会将 effect 函数**推迟**到浏览器完成绘制之后执行，这样可以避免阻塞浏览器渲染。

2. 执行与清理：

   - React 记录下传入的 effect 函数和依赖项数组。

   - 在浏览器绘制完成后，React 检查依赖项数组。

   - **首次渲染：** 执行 effect 函数。如果 effect 返回了一个清理函数，React 会存储它。

   - 后续渲染：

      React 会比较本次渲染的依赖项数组和上一次渲染的依赖项数组中的每一项（使用 `Object.is` 比较）。

     - 如果依赖项没有变化，跳过 effect 的执行。
     - 如果依赖项有变化，React 会先执行上一次 effect 返回的**清理函数**（如果存在），然后再执行本次的 effect 函数，并存储新的清理函数（如果本次 effect 返回了的话）。

   - **组件卸载：** React 会执行最后一次 effect 返回的清理函数。

3. **与 `useState` 的关系：** `useEffect` 常常依赖于 `useState` 管理的状态。当 `setState` 导致状态变化并触发重新渲染后，`useEffect` 会根据其依赖项决定是否重新执行副作用。

示例：

```js
import React, { useState, useEffect } from 'react';

// 示例 1: 组件挂载时获取数据
function FetchDataComponent({ userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(`WorkspaceDataComponent 渲染了, userId: ${userId}, loading: ${loading}`);

  // useEffect 用于处理副作用：数据获取
  useEffect(() => {
    console.log(`Effect: 开始获取 userId=${userId} 的数据`);
    setLoading(true); // 开始加载
    setError(null);   // 重置错误状态

    // 定义一个异步函数来获取数据
    const fetchData = async () => {
      try {
        // 模拟 API 请求
        const response = await new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ id: userId, name: `User ${userId}`, timestamp: Date.now() })
        }), 1000));

        if (!response.ok) {
          throw new Error('网络响应错误');
        }
        const result = await response.json();
        console.log(`Effect: 数据获取成功 for userId=${userId}`, result);
        setData(result);
      } catch (err) {
        console.error(`Effect: 数据获取失败 for userId=${userId}`, err);
        setError(err.message);
      } finally {
        setLoading(false); // 加载结束
        console.log(`Effect: 加载状态结束 for userId=${userId}`);
      }
    };

    fetchData(); // 执行数据获取

    // 清理函数 (可选)
    // 在这个例子中，如果 userId 变化非常快，我们可能想取消之前的请求
    // 这里简化处理，没有添加请求取消逻辑
    return () => {
      console.log(`Cleanup: Effect for userId=${userId} 即将重新运行或组件卸载`);
      // 可以在这里执行清理操作，例如取消正在进行的 fetch 请求
      // controller.abort(); // 如果使用了 AbortController
    };
  }, [userId]); // 依赖项数组：只有 userId 变化时，effect 才重新执行

  if (loading) {
    return <p>正在加载用户 {userId} 的数据...</p>;
  }

  if (error) {
    return <p>加载数据出错: {error}</p>;
  }

  return (
    <div>
      <h2>用户数据 (ID: {data?.id})</h2>
      <p>姓名: {data?.name}</p>
      <p>获取时间戳: {data?.timestamp}</p>
    </div>
  );
}

// 示例 2: 监听窗口大小变化
function WindowSizeReporter() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  console.log('WindowSizeReporter 渲染了, size:', windowSize);

  useEffect(() => {
    // 定义处理窗口大小变化的函数
    const handleResize = () => {
      console.log('窗口大小发生变化');
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    console.log('Effect: 添加 resize 事件监听器');
    // 添加事件监听器
    window.addEventListener('resize', handleResize);

    // 清理函数：在组件卸载时移除事件监听器
    return () => {
      console.log('Cleanup: 移除 resize 事件监听器');
      window.removeEventListener('resize', handleResize);
    };
  }, []); // 空依赖数组，表示这个 effect 只在挂载和卸载时运行

  return (
    <div>
      <h2>窗口大小</h2>
      <p>宽度: {windowSize.width}px</p>
      <p>高度: {windowSize.height}px</p>
    </div>
  );
}


// 示例 3: 依赖项变化触发的 Effect
function TimerComponent() {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(true);

    console.log(`TimerComponent 渲染了, seconds: ${seconds}, isActive: ${isActive}`);

    useEffect(() => {
        console.log(`Effect: 当前 isActive=${isActive}`);
        let intervalId = null;

        if (isActive) {
            console.log('Effect: 启动定时器');
            intervalId = setInterval(() => {
                // 注意：这里使用函数式更新，避免依赖 seconds
                setSeconds(s => s + 1);
            }, 1000);
        } else {
            console.log('Effect: 定时器未激活或已暂停');
        }

        // 清理函数
        return () => {
            if (intervalId) {
                console.log(`Cleanup: 清除定时器 (intervalId: ${intervalId})`);
                clearInterval(intervalId);
            } else {
                console.log('Cleanup: 无需清除定时器');
            }
        };
    }, [isActive]); // 依赖于 isActive 状态

    return (
        <div>
            <h2>定时器</h2>
            <p>秒数: {seconds}</p>
            <button onClick={() => setIsActive(!isActive)}>
                {isActive ? '暂停' : '启动'}
            </button>
            <button onClick={() => setSeconds(0)}>
                重置
            </button>
        </div>
    );
}


function App() {
  const [currentUserId, setCurrentUserId] = useState(1);
  const [showTimer, setShowTimer] = useState(true);

  return (
    <div>
      <h1>useEffect 示例</h1>
      <button onClick={() => setCurrentUserId(id => id + 1)}>
        加载下一个用户 (ID: {currentUserId + 1})
      </button>
      <FetchDataComponent userId={currentUserId} />
      <hr />
      <WindowSizeReporter />
      <hr />
      <button onClick={() => setShowTimer(s => !s)}>
        {showTimer ? '隐藏定时器' : '显示定时器'}
      </button>
      {showTimer && <TimerComponent />}
    </div>
  );
}

export default App;
```

效果：

![image-20260123090746539](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260123090747882.png)

> 不要对 Dependencies 撒谎, 如果你明明使用了某个变量，却没有申明在依赖中，你等于向 React 撒了谎，后果就是，当依赖的变量改变时，useEffect 也不会再次执行, eslint会报警告。
>
> *Preview*页面改造成函数式组件，在路径上从*id=1*切换到*id=2*也会自动重新加载，比*class*组件方便
>
> ```js
> let id = props.match.params.myid
> useEffect(()=>{
>     axios.get(`/articles/${id}`).then(res => {
>         settitle(res.data.title)
>         setcontent(res.data.content)
>         setcategory(res.data.category)
>     })
> },[id])
> ```



### 3. useLayoutEffect() - 同步执行副作用

`useLayoutEffect` - 同步执行副作用。（仅1%场景）

**应用**：

* *获取 DOM 宽高 / 位置后，立即修改布局（若用 useEffect 会先渲染初始位置，再调整，出现闪烁）。*
* *调整元素位置（如弹窗居中、滚动到指定位置），要求「页面渲染时直接是最终位置」。*
* *初始渲染的 DOM 样式不符合预期，需同步修正（如暗黑模式切换、主题色设置）。*

> 一句话记：**大部分场景用 useEffect，只有「操作 DOM 且怕闪烁」时用 useLayoutEffect**。



**useEffect() 与 useLayoutEffect() 有什么不同？**

简单来说就是调用时机不同：

* useEffect 是会在整个页面渲染完才会调用的代码。
* useLayoutEffect 和原来 componentDidMount & componentDidUpdate 一致，在react完成DOM更新后马上同步调用的代码，会阻塞页面渲染。

官方建议优先使用 useEffect ：

However, we recommend starting with `useEffect first` and only `trying useLayoutEffect` if that causes a problem.

在实际使用时如果想避免**页面抖动**（在 useEffect 里修改DOM很有可能出现）的话，可以把需要操作DOM的代码放在 useLayoutEffect 里。在这里做点dom操作，这些dom修改会和 react 做出的更改一起被一次性渲染到屏幕上，只有*一次回流、重绘*的代价。



### 4. useCallback() - 记忆函数

`useCallback` - 防止因为组件重新渲染，导致方法被重新创建 ，起到缓存作用*;* 只有第二个参数 变化了，才重新声明一次。它返回一个 memoized 版本的**回调函数**，该回调函数仅在某个依赖项改变时才会更新。

**应用**：

* *传递给子组件的回调函数（配合 `React.memo` 优化重渲染）*
* *作为 `useEffect` 的依赖项（避免无限执行）*
* *传递给自定义 Hooks / 第三方库（如防抖 / 节流、状态管理库，依赖函数引用稳定）*

> 一句话记：**只有当函数需要 “被缓存”（传递给子组件 / 做依赖 / 给第三方库）时，才用 useCallback，否则一律直接定义函数**。

**语法**：

```js
var handleClick = useCallback( ()=>{
    console.log(name)
},[name])
<button onClick={()=>handleClick()}>hello</button>
//只有name改变后， 这个函数才会重新声明一次，
//如果传入空数组， 那么就是第一次创建后就被缓存， 如果name后期改变了,拿到的还是老的name。
//如果不传第二个参数，每次都会重新声明一次，拿到的就是最新的name.
```

**第一个参数：** 回调函数（memoize 的函数）。

**第二个参数（依赖项数组）：** 数组中的值被回调函数闭包捕获。只有当数组中的某个值发生变化时，`useCallback` 才会返回一个新的函数实例。如果传入空数组 `[]`，则返回的函数实例在组件生命周期内永远不会改变。

**原理：**

1. 首次渲染：
   - 调用 `useCallback(fn, deps)`。
   - React 存储传入的函数 `fn` 和依赖项 `deps`。
   - 返回 `fn` 本身。
2. 后续渲染：
   - 再次调用 `useCallback(newFn, newDeps)`。
   - React 比较 `newDeps` 和上一次存储的 `deps`。
   - **如果依赖项没有变化：** React **不**使用 `newFn`，而是返回上一次存储的**旧的函数实例**。
   - **如果依赖项有变化：** React 存储 `newFn` 和 `newDeps`，并返回**新的函数实例** `newFn`。

> **为什么需要它？性能优化！**
>
> 在 JavaScript 中，函数是对象。每次组件渲染时，在组件内部定义的函数（没有被 `useCallback` 包裹）都会**重新创建**。这意味着即使函数体完全相同，它们也是不同的函数引用。
>
> 当满足以下条件时，`useCallback` 非常有用：
>
> 1. **将回调函数作为 prop 传递给子组件。**
> 2. **该子组件使用了 `React.memo` 或 `PureComponent` 或 `shouldComponentUpdate` 进行了性能优化。**
>
> 如果父组件每次渲染都传递一个新的函数实例给子组件，即使子组件被 `React.memo` 包裹，它也会因为接收到的 prop（回调函数）发生了变化（引用地址不同）而重新渲染，导致 `React.memo` 的优化失效。使用 `useCallback` 包装传递给子组件的回调函数，可以确保只有在依赖项真正改变时，才传递新的函数实例，从而让子组件的 `React.memo` 生效。
>
> **注意：** 不要滥用 `useCallback`。如果回调函数逻辑简单，或者传递给的子组件没有进行 `React.memo` 优化，使用 `useCallback` 可能带来的开销（存储函数和比较依赖项）会超过其收益。

示例：

```js
import { useCallback, useState } from 'react'

export default function App() {
    const [text, setText] = useState('')
    const [list, setList] = useState(['待办1', '待办2', '待办3'])
    const handleChange = useCallback(evt => {
        setText(evt.target.value)
    }, []) //没有相关的依赖，因此第二个参数传空数组即可
    const handleAdd = useCallback(() => {
        console.log(text)
        setList([...list, text])
        setText('')
    }, [text, list])  //依赖 text, list
    const handleDel = useCallback(index => {
        console.log(index)
        let newList = [...list]
        newList.splice(index, 1)
        setList(newList)
    }, [list])  //依赖 list
    return (
        <div>
            <input onChange={handleChange} value={text} />
            <button onClick={handleAdd}>add</button>
            <ul>
                {list.map((item, index) => (
                    <li key={item}>
                        {item}
                        <button onClick={() => handleDel(index)}>del</button>
                    </li>
                ))}
            </ul>
            {!list.length && <div>暂无待办事项</div>}
        </div>
    )
}
```

效果和功能与前面 todolist 一样，正常。



### 5. useMemo() - 记忆组件(计算属性)

`useMemo` - useCallback 的功能完全可以由 useMemo 所取代，如果你想通过使用 useMemo 返回一个记忆函数也是完全可以的。 类似于`vue的计算属性`

唯一的区别是：useCallback 不会执行第一个参数函数，而是将它返回给你，而 useMemo 会执行第一个函数并且将函数执行结果返回给你。所以在前面的例子中，可以返回 handleClick 来达到存储函数的目的。

**应用**：*避免重渲染时的高开销计算（最核心）、传递给子组件的复杂数据（配合 React.memo 优化重渲染）、缓存衍生数据（依赖多个状态 / Props 的计算结果）等*

**语法**：

```js
const memoizedValue = useMemo(
  () => {
    // 执行开销大的计算
    return computeExpensiveValue(a, b);
  },
  [a, b], // 依赖项数组
);
// useCallback(fn, inputs)  is equivalent to  useMemo(() => fn, inputs).
```

**第一个参数：** 一个“创建”函数，用于执行计算并返回需要被 memoized 的值。

**第二个参数（依赖项数组）：** 数组中的值被创建函数使用。只有当数组中的某个值发生变化时，`useMemo` 才会在渲染期间重新调用创建函数来计算新值。如果传入空数组 `[]`，则创建函数只会在初始渲染时执行一次。

**原理：**

1. 首次渲染：
   - 调用 `useMemo(computeFn, deps)`。
   - React 执行 `computeFn()`，得到结果 `value`。
   - React 存储 `value` 和依赖项 `deps`。
   - 返回 `value`。
2. 后续渲染：
   - 再次调用 `useMemo(newComputeFn, newDeps)`。
   - React 比较 `newDeps` 和上一次存储的 `deps`。
   - **如果依赖项没有变化：** React 不执行 `newComputeFn`，直接返回上一次存储的 旧的 `value`。
   - **如果依赖项有变化：** React 执行 `newComputeFn()`，得到新的结果 `newValue`。React 存储 `newValue` 和 `newDeps`，并返回 `newValue`。

> **为什么需要它？性能优化！**
>
> `useMemo` 主要用于优化以下场景：
>
> 1. **避免在每次渲染时执行开销大的计算：** 如果一个计算非常耗时（例如，对一个大数组进行排序、过滤或复杂计算），并且它的输入（依赖项）不经常变化，使用 `useMemo` 可以缓存结果，避免在每次渲染时重复进行昂贵的计算。
> 2. **避免子组件的不必要渲染（类似 `useCallback`）：** 如果你将一个通过计算得到的对象或数组作为 prop 传递给一个 `React.memo` 包裹的子组件，即使计算结果的内容没变，但每次渲染都会创建一个新的对象/数组引用，导致子组件重新渲染。使用 `useMemo` 可以确保只有在依赖项变化导致计算结果真正需要更新时，才创建新的对象/数组引用。
>
> 注意：简单计算 / 基础类型数据，❌不用缓存，因为无意义，增加代码复杂度
>
> **`useMemo` vs `useCallback`：**
>
> - `useCallback(fn, deps)` 等价于 `useMemo(() => fn, deps)`。
> - `useCallback` 是专门用来 memoize **函数**的。
> - `useMemo` 是用来 memoize **任意类型的值**（包括函数执行的结果，如对象、数组、数字、字符串等）。

示例：

```js
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'

export default function Cinema() {
    const [mytext, setMytext] = useState('')
    const [cinemaList, setCinemaList] = useState([])

    useEffect(() => {
        //演示：临时请求数据，axios 第三方库
        axios({
            url: 'https://m.maizuo.com/gateway?cityId=410100&ticketFlag=1&k=9366495',
            headers: {
                'x-client-info': '{"a":"3000","ch":"1002","v":"5.2.1","e":"17689720181688867040133121","bc":"410100"}',
                'x-host': 'mall.film-ticket.cinema.list',
            },
        }).then(res => {
            setCinemaList(res.data.data.cinemas)
        })
    }, []) //[] 只执行一次

    // 类似 vue 的计算属性，在 mytext 或 cinemaList 改变的时候才会触发重新计算
    const getCinemaList = useMemo(() => {  //使用{}代表包裹多行代码，就需要写 return；单行可省略return
        return cinemaList.filter(
            item =>
                item.name.toUpperCase().includes(mytext.toUpperCase()) ||
                item.address.toUpperCase().includes(mytext.toUpperCase()),
        )
    }, [mytext, cinemaList])

    return (
        <div>
            Cinema-{mytext}
            {/* 受控表单组件 input */}
            <input
                value={mytext}
                onChange={evt => {
                    setMytext(evt.target.value)
                }}
            />
            {/* better-scroll 在父节点为有限高度的情况下去使用。 */}
            <div className="jerryWrapper" style={{ height: '500px', backgroundColor: 'yellow', overflow: 'hidden' }}>
                <div className="jerryContent">
                    {getCinemaList.map(item => (
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
```

效果：

![chrome-capture-2026-01-23](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260123094627395.gif)



### 6. useRef() - 保存引用值

`useRef` - 保存引用值。获取一个持久的可变对象，该对象的 `.current` 属性被初始化为传入的参数 (`initialValue`)。返回的对象在组件的整个生命周期内保持不变。

**应用**：*访问 / 操作 DOM 元素（最常用）、跨渲染周期保存持久化数据（不触发重渲染）、规避 useEffect 的闭包陷阱、保存子组件实例（类组件）等*

> 一句话记：**useRef 是 “幕后数据管家”—— 存不影响视图的持久数据、操作 DOM、解决闭包问题，凡是不想触发重渲染但需跨周期保存的值，都用它。**

**语法**：

```js
const myswiper = useRef(null);
<Swiper ref={myswiper}/>
// 访问: myswiper.current
// 修改: myswiper.current = newValue; (不会触发 re-render)
// 示例：如果是input，获取其输入值则为 myinput.current.value
```

**原理：**

1. 首次渲染：
   - 调用 `useRef(initialValue)`。
   - React 创建一个简单的 JavaScript 对象 `{ current: initialValue }`。
   - 在 Fiber 节点的 Hooks 链表中创建一个节点，存储这个 ref 对象。
   - 返回这个 ref 对象。
2. 后续渲染：
   - 再次调用 `useRef`。
   - React 根据调用顺序找到对应的 Hook 节点，直接返回**同一个** ref 对象。
3. **关键点：** `useRef` 返回的对象本身是持久的（在多次渲染中是同一个对象引用）。修改 `ref.current` 属性**不会**通知 React，因此**不会触发组件的重新渲染**。这与 `useState` 不同，`setState` 会触发渲染。

示例：

```js
import { useRef, useState } from 'react'

export default function App() {
    const mytext = useRef() // 等价于 React.createRef() 写法
    const [list, setList] = useState(['待办1', '待办2', '待办3'])
    const handleChange = evt => {
        mytext = evt.target.value
    }
    const handleAdd = () => {
        console.log(mytext.current.value)
        setList([...list, mytext.current.value])
        // setText('') //清空
        mytext.current.value = ""
    }
    const handleDel = index => {
        console.log(index)
        let newList = [...list]
        newList.splice(index, 1)
        setList(newList)
    }
    return (
        <div>
            <input ref={mytext} />
            <button onClick={handleAdd}>add</button>
            <ul>
                {list.map((item, index) => (
                    <li key={item}>
                        {item}
                        <button onClick={() => handleDel(index)}>del</button>
                    </li>
                ))}
            </ul>
            {!list.length && <div>暂无待办事项</div>}
        </div>
    )
}
```

效果一样。

useRef 保存值：

```js
import { useState, useRef } from 'react'

export default function App() {
    const [count, setCount] = useState(0)
    let mycount = useRef(0)
    return (
        <div>
            App-{count}-{mycount.current}
            <button onClick={() => {
                    setCount(count + 1)
                    //mycount++        // let mycount = 0 临时变量会被重新渲染赋值，保存不住累加值
                    mycount.current++  //实现了保存值 mycount 的效果
                }}
            >
                add
            </button>
        </div>
    )
}
```



### 7. useContext() - 减少组件层级

`useContext` - 减少组件层级，与 `useReducer` 共同使用。订阅 React Context，获取当前 Context 的值。这允许你在组件树中深层传递数据，而无需手动一层层地传递 props。

**应用**：*全局 / 应用级状态共享（最常用）、局部组件树状态共享（模块级）、主题 / 样式配置共享 等*

> 一句话记：**useContext 是 “跨组件传参神器”—— 凡是需要跨层级（非父子直接传递）共享的轻量级状态，都用它；复杂全局状态用 Redux 等，高频更新状态用局部 useState**。

**语法**：

```js
const value = useContext(MyContext);
```

- `MyContext`: 由 `React.createContext()` 创建的 Context 对象。
- `value`: 组件从上层最近的 `<MyContext.Provider>` 获取到的 `value` prop 的值。如果上层没有对应的 Provider，则返回 `createContext` 时指定的默认值。

**原理：**

1. **创建 Context:** 使用 `React.createContext(defaultValue)` 创建一个 Context 对象。它包含 Provider 和 Consumer 两个组件（虽然 `useContext` 让我们通常不需要直接使用 Consumer）。
2. **提供 Context 值:** 在组件树的上层使用 `<MyContext.Provider value={...}>` 包裹子组件，通过 `value` prop 提供数据。
3. **订阅 Context:** 在需要消费数据的子组件中调用 `useContext(MyContext)`。
4. **查找与订阅:** React 会沿着组件树向上查找最近的 `<MyContext.Provider>`，并读取其 `value`。该组件会**订阅**这个 Context。
5. **更新:** 当 Provider 的 `value` prop 发生变化时，所有订阅了该 Context 的组件（即调用了 `useContext(MyContext)` 的组件）都会**自动重新渲染**，并获取到新的 Context 值。

示例：

```js
import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'

// 创建 context 对象
const GlobalContext = createContext()

export default function App() {
    const [info, setInfo] = useState('')
    const [filmList, setFilmList] = useState([])
    const value = useContext(GlobalContext)

    useEffect(() => {
        //演示：临时请求数据，axios 第三方库
        axios({
            url: 'https://m.maizuo.com/gateway?cityId=410100&pageNum=1&pageSize=10&type=1&k=7050049',
            headers: {
                'x-client-info': '{"a":"3000","ch":"1002","v":"5.2.1","e":"17689720181688867040133121","bc":"410100"}',
                'x-host': 'mall.film-ticket.film.list',
            },
        }).then(res => {
            console.log(res.data.data.films)
            setFilmList(res.data.data.films)
        })
    }, [])

    return (
        <GlobalContext.Provider
            value={{
                info: info,
                changeInfo: value => {
                    setInfo(value)
                },
            }}
        >
            <div>
                {filmList.map(item => (
                    <FilmItem key={item.filmId} {...item}></FilmItem>
                ))}
                <FilmDetail></FilmDetail>
            </div>
        </GlobalContext.Provider>
    )
}

function FilmItem(props) {
    let { name, poster, grade, director } = props
    const value = useContext(GlobalContext) //使用 context 对象，拿到生产者 value 对象
    console.log(value) // 输出：GlobalContext 中的 value 值
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
}

function FilmDetail() {
    const value = useContext(GlobalContext) //使用 context 对象，拿到生产者 value 对象
    let obj = { position: 'fixed', right: 0, top: '100px', backgroundColor: 'yellow', width: '300px', height: '300px' }
    return <div style={obj}>detail-{value.info}</div>
}
```

效果：

![chrome-capture-2026-01-22](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260122120047193.gif)



### 8. useReducer() - 减少组件层级

`useReducer` - 减少组件层级，与 `useContext` 共同使用。 `useState` 的替代方案，用于管理更复杂的 state 逻辑。特别适合 state 之间有关联或者下一个 state 依赖于前一个 state 的场景。

**应用**：*多个状态相互依赖且修改逻辑关联、状态修改规则复杂（多条件 / 多分支）、需要追踪状态修改轨迹（调试 / 日志）、配合 useContext 实现全局 / 局部状态管理 等*

> 一句话记：**useReducer 是 “复杂状态的管家”—— 当 useState 很难管理复杂的状态逻辑（多状态关联、多修改规则）时，就用它；简单状态直接用 useState 更轻便。**

**语法**：

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

- `reducer`: 一个形如 `(state, action) => newState` 的纯函数，接收当前 state 和一个 action 对象，返回新的 state。
- `initialArg`: 初始状态值。
- `init` (可选): 一个用于计算初始状态的函数。如果提供，初始状态将被设置为 `init(initialArg)`。这允许将计算初始状态的逻辑提取到 reducer 外部。
- `state`: 当前的状态值。
- `dispatch`: 一个函数，用于触发 action。调用 `dispatch(action)` 时，React 会调用 `reducer(currentState, action)` 来计算新状态，并触发组件重新渲染。

**原理：**

1. 首次渲染：
   - 调用 `useReducer(reducer, initialArg, init?)`。
   - React 计算初始状态（如果提供了 `init` 函数，则调用 `init(initialArg)`，否则使用 `initialArg`）。
   - 在 Fiber 节点的 Hooks 链表中创建节点，存储初始状态和 reducer 函数。
   - 返回 `[initialState, dispatch]`。`dispatch` 函数负责接收 action 并将其传递给 reducer。
2. 后续渲染：
   - 再次调用 `useReducer`。
   - React 根据调用顺序找到对应的 Hook 节点。
   - 返回 `[currentState, dispatch]`。
3. 状态更新 (`dispatch`):
   - 调用 `dispatch(action)`。
   - React 将 action 和当前的 state 传递给 `reducer` 函数：`newState = reducer(currentState, action)`。
   - React 将计算出的 `newState` 存储回 Hook 节点，并计划一次重新渲染。
   - 同样地，如果 `newState` 与 `currentState` 相同，React 会跳过渲染。

> **优势 vs `useState`：**
>
> - **逻辑集中：** 将状态更新逻辑（如何根据不同操作改变状态）集中在 `reducer` 函数中，使得组件本身更简洁。
> - **可测试性：** `reducer` 是纯函数，易于单独测试。
> - **复杂状态管理：** 对于包含多个子值的 state 对象或 state 转换逻辑复杂的场景，`useReducer` 通常更清晰。
> - **优化：** `dispatch` 函数的标识是稳定的，不会在每次渲染时改变。这意味着可以将 `dispatch` 作为依赖项传递给子组件或 `useEffect` 等，而不会导致不必要的重新渲染或 effect 执行（相比于直接传递 `setState` 函数，如果 `setState` 是通过内联函数创建的，则每次渲染都会是新的函数实例）。

简易示例：

```js
import { useReducer } from 'react'

// 处理函数
const reducer = (preState, action) => {
    // preState 对应 intialState， action 对应 dispatch
    console.log("reducer->", preState, action);
    let newState = {...preState}
    switch (action.type) {
        case "jerry-minus":
            newState.count--
            return newState
        case "jerry-add":
            newState.count++
            return newState
        default:
            return newState
    }
}
// 定义在外部的状态，如对象类型
const intialState = {
    count: 0,
    //list: []
}

export default function App() {
    const [state, dispatch] = useReducer(reducer, intialState)

    return <div>
        <button onClick={() => {
            dispatch({
                type: "jerry-minus"
            })
        }}>-</button>
        <span>{state.count}</span>
        <button onClick={() => {
            dispatch({
                type: "jerry-add"
            })
        }}>+</button>
    </div>
}
```

示例：

```js
import axios from 'axios'
import { createContext, useContext, useEffect, useState, useReducer } from 'react'

// 创建 context 对象
const GlobalContext = createContext()
const intialState = {
    info: '',
    filmList: [],
}
const reducer = (preState, action) => {
    // preState 对应 intialState， action 对应 dispatch
    console.log('reducer')
    let newState = { ...preState }
    switch (action.type) {
        case 'change-filmlist':
            newState.filmList = action.value
            return newState
        case "change-info":
            newState.info = action.value
            return newState
    }
}

export default function App() {
    const [state, dispatch] = useReducer(reducer, intialState)

    useEffect(() => {
        //演示：临时请求数据，axios 第三方库
        axios({
            url: 'https://m.maizuo.com/gateway?cityId=410100&pageNum=1&pageSize=10&type=1&k=7050049',
            headers: {
                'x-client-info': '{"a":"3000","ch":"1002","v":"5.2.1","e":"17689720181688867040133121","bc":"410100"}',
                'x-host': 'mall.film-ticket.film.list',
            },
        }).then(res => {
            console.log(res.data.data.films)
            dispatch({
                type: 'change-filmlist',
                value: res.data.data.films,
            })
        })
    }, [])

    return (
        <GlobalContext.Provider
            value={{
                state,
                dispatch,
            }}
        >
            <div>
                {state.filmList.map(item => (
                    <FilmItem key={item.filmId} {...item}></FilmItem>
                ))}
                <FilmDetail></FilmDetail>
            </div>
        </GlobalContext.Provider>
    )
}

function FilmItem(props) {
    let { name, poster, grade, director } = props
    const { dispatch } = useContext(GlobalContext)
    return (
        <div style={{ overflow: 'hidden', padding: '10px' }}>
            <img
                src={poster}
                alt={name}
                style={{ width: '100px', float: 'left' }}
                onClick={() => {
                    console.log('FilmItem:', director)
                    dispatch({
                        type: 'change-info',
                        value: director,
                    })
                }}
            />
            <h4>{name}</h4>
            <div>观众评分:{grade}</div>
        </div>
    )
}

function FilmDetail() {
    const { state } = useContext(GlobalContext)
    let obj = { position: 'fixed', right: 0, top: '100px', backgroundColor: 'yellow', width: '300px', height: '300px' }
    return <div style={obj}>detail-{state.info}</div>
}
```

效果：

![chrome-capture-2026-01-22](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260122120047193.gif)





## 自定义 Hooks

**当我们想在两个函数之间共享逻辑时，我们会把它提取到第三个函数中。**

必须以“use”开头吗？必须如此。这个约定非常重要。不遵循的话，由于无法判断某个函数是否包含对其内部 Hook 的调用，React 将无法自动检查你的 Hook 是否违反了 Hook 的规则。

示例：

```js
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
// 抽取可复用逻辑 1
function useCinemaList() {
    const [cinemaList, setCinemaList] = useState([])
    useEffect(() => {
        //演示：临时请求数据，axios 第三方库
        axios({
            url: 'https://m.maizuo.com/gateway?cityId=410100&ticketFlag=1&k=9366495',
            headers: {
                'x-client-info': '{"a":"3000","ch":"1002","v":"5.2.1","e":"17689720181688867040133121","bc":"410100"}',
                'x-host': 'mall.film-ticket.cinema.list',
            },
        }).then(res => {
            setCinemaList(res.data.data.cinemas)
        })
    }, []) //[] 只执行一次
    return { cinemaList }
}
// 抽取可复用逻辑 2
function useCinemaListFilter(list, text) {
    // 类似 vue 的计算属性，在 mytext 或 cinemaList 改变的时候才会触发重新计算
    const getCinemaList = useMemo(() => {
        //使用{}代表包裹多行代码，就需要写 return；单行可省略return
        return list.filter(
            item =>
                item.name.toUpperCase().includes(text.toUpperCase()) ||
                item.address.toUpperCase().includes(text.toUpperCase()),
        )
    }, [text, list])
    return { getCinemaList }
}

export default function Cinema() {
    const [mytext, setMytext] = useState('')
    const { cinemaList } = useCinemaList()
    const { getCinemaList } = useCinemaListFilter(cinemaList, mytext)
    return (
        <div>
            Cinema-{mytext}
            {/* 受控表单组件 input */}
            <input
                value={mytext}
                onChange={evt => {
                    setMytext(evt.target.value)
                }}
            />
            {/* better-scroll 在父节点为有限高度的情况下去使用。 */}
            <div className="jerryWrapper" style={{ height: '500px', backgroundColor: 'yellow', overflow: 'hidden' }}>
                <div className="jerryContent">
                    {getCinemaList.map(item => (
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
```

效果：

![chrome-capture-2026-01-23](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260123094627395.gif)

















