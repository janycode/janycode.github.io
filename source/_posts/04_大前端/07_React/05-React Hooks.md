---
title: 05-React Hooks
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

`useState` - 在函数组件中添加和管理 state。

语法：

```
const [state, setstate] = useState(initialState)
```

使用：

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

`useEffect` - 处理副作用（Side Effects），如数据获取、设置订阅、手动更改 DOM 等。它类似于 class 组件中的 componentDidMount, componentDidUpdate, 和 componentWillUnmount 的组合。

语法：

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

useEffect() 与 useLayoutEffect() 有什么不同？

简单来说就是调用时机不同：

* useEffect 是会在整个页面渲染完才会调用的代码。
* useLayoutEffect 和原来 componentDidMount & componentDidUpdate 一致，在react完成DOM更新后马上同步调用的代码，会阻塞页面渲染。

官方建议优先使用 useEffect ：

However, we recommend starting with `useEffect first` and only `trying useLayoutEffect` if that causes a problem.

在实际使用时如果想避免**页面抖动**（在 useEffect 里修改DOM很有可能出现）的话，可以把需要操作DOM的代码放在 useLayoutEffect 里。在这里做点dom操作，这些dom修改会和 react 做出的更改一起被一次性渲染到屏幕上，只有*一次回流、重绘*的代价。



### 4. useCallback() - 记忆函数

防止因为组件重新渲染，导致方法被重新创建 ，起到缓存作用*;* 只有第二个参数 变化了，才重新声明一次。它返回一个 memoized 版本的**回调函数**，该回调函数仅在某个依赖项改变时才会更新。

语法：

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

