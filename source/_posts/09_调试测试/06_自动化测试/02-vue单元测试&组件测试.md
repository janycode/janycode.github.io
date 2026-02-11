---
title: 02-vue测试
date: 2022-5-25 16:33:43
tags: 
- 服务器
- vue测试
categories:
- 09_调试测试
- 06_自动化测试
---

参考资料：

* vitest官网：https://cn.vitest.dev/



## 1. 单元测试

`Vitest` 是一个针对单元测试的框架，它由 Vue / Vite 团队成员开发和维护。主要用于测试函数、类、方法等逻辑结果。

提示：Vitest 需要 Vite >=v5.0.0 和 Node >=v20.0.0

官网：https://cn.vitest.dev/

### 1.1 安装

安装：*npm i vitest -D*

> -D 针对开发环境下使用。



### 1.2 配置

package.json - 添加 `"test": "vitest",`

```json
{
  ...
  "scripts": {
    "test": "vitest",  /* 添加此行，可用于测试命令: npm test */
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": { ... },
  "devDependencies": {
    ...
    "vitest": "^4.0.16"
  }
}
```



### 1.3 启动验证

```sh
npm test
```

> 如果报错：TypeError: crypto.getRandomValues is not a function
>
> 具体原因：*crypto.getRandomValues()* 用于生成加密级安全的随机数，Vite 在生成随机 ID 时会调用它。但该 API 在 **Node.js 19+** 才原生支持
>
> ```sh
> > node -v
> v16.20.2
> > nvm list
>     20.15.0
>   * 16.20.2 (Currently using 64-bit executable)
> > nvm use 20.15.0
> Now using node v20.15.0 (64-bit)
> > node -v
> v20.15.0
> ```
>
> 将 node 通过 nvm 升级到 19+ 版本即可解决问题。

```sh
> npm test
myappvite-elementplus@0.0.0 test
vitest

 DEV  v4.0.16 E:/work/webProjects/vue/3.0/myappvite-elementplus

No test files found. You can change the file name pattern by pressing "p"
include: **/*.{test,spec}.?(c|m)[jt]s?(x)
exclude:  **/node_modules/**, **/.git/**
```

* include，包含的测试文件规则，如 src/test/1.test.js 即符合文件命名规则
* exclude，排除掉的目标测试文件规则

按 `q` 可以退出测试，不退出的情况下可以一直进行动态测试，修改内容即可立即生效自动测试。

### 1.4 添加测试文件

参考 vue 官方测试文档：https://cn.vuejs.org/guide/scaling-up/testing.html#unit-testing

目录：

```txt
src/
  test/
    1.test.js
    moduleA.js
```

moduleA.js

```js
export function increment(current, max = 10) {
  if (current < max) {
    return current + 1
  }
  return current
}
```

1.test.js

```js
import { describe, test, expect } from 'vitest'  //必须引入的测试框架单元测试方法
import { increment } from './moduleA'            //引入需要单元测试的模块方法

describe('测试 increment 方法', () => {           //固定格式用法
    test('将当前数字加 1', () => {
        expect(increment(0, 10)).toBe(1)         //预期结果
    })

    test('不会将当前数量增加到超过最大数量', () => {
        expect(increment(10, 10)).toBe(10)
    })

    test('默认最大值为 10', () => {
        expect(increment(10)).toBe(10)
    })
})
```

保存直接自动测试，PASS没有报错，测试完成。

![image-20260107101942030](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260107101943513.png)



### 1.5 测试验证

以 pinia 的 strore 为例，作为验证：

2.test.js

```js
import { describe, test, expect, beforeEach } from 'vitest'  //引入测试框架的单元测试方法
import { createPinia, setActivePinia } from 'pinia'
import useNewsStore from '../store/newsStore'

describe('测试 pinia newsStore', () => {
    let store
    // 替换 beforeAll 为 beforeEach，保证每个测试用例都是干净的
    beforeEach(() => {
        setActivePinia(createPinia())   
        store = useNewsStore()
    })
    test('测试 newsStore 的 addNews 方法', () => {
        // 初始状态：数组为空
        expect(store.newsList).toEqual([])
        // 调用添加方法
        const newsItem = {
            title: "标题111",
            type: "keji",
            desc: "这是新闻111的内容2222",
        }
        store.addNews(newsItem)
        // 验证添加后的值（使用 toEqual 而非 toBe）
        expect(store.newsList).toEqual([{
            title: "标题111",
            type: "keji",
            desc: "这是新闻111的内容2222",
        }])
        // 额外验证：添加的是新对象（而非引用），确保你的深拷贝逻辑生效
        newsItem.title = "修改后的标题"
        expect(store.newsList[0].title).toBe("标题111") // 原数据未被修改
    })

})
```

newsStore.js - 基于 pinia 的 store

```js
import { defineStore } from "pinia";
import { ref } from "vue";

const useNewsStore = defineStore('news', () => {
    const newsList = ref([])
    const addNews = (value) => {
        newsList.value.push({...value})  //{...value} 展开为了防止 form 提交过来的是引用导致多次提交值都一样的问题
    }
    return {
        newsList,
        addNews
    }
})

export default useNewsStore
```



### 1.6 测试异步

```js
    test('测试 cinemaStore 异步请求', async () => {
        expect(cinemaStore.cinemaList.length).toBe(0)   //初始等于 0
        await cinemaStore.getCinemaList()
        console.log(cinemaStore.cinemaList.length)
        expect(cinemaStore.cinemaList.length).gt(0)     //大于 0
    })
```



## 2. 组件测试

组件测试主要捕捉组件中的 prop、事件、提供的插槽、样式、CSS class名，生命周期钩子 和 其他相关问题。

即 像用户那样点击一个元素，而不是编程式地与组件进行交互。

### 2.1 安装

安装：*npm i -D @testing-library/vue jsdom*

> -D 针对开发环境下使用。

安装后 package.json

```
{
  ...
  "devDependencies": {
    "@testing-library/vue": "^8.1.0",
    ...
  }
}
```



### 2.2 配置

为了让 vite 支持这个组件测试的环境。

vue.config.js - 添加 `test: { environment: 'jsdom' }`

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',  // or 'jsdom', 'node' 单独安装
  }
})

```



### 2.3 测试

App.vue

```vue
<template>
    <div>
        {{ count }}
        <button>add</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const count = ref(0)
const add = () => {
    count++
}
</script>
```

3.test.js

```js
import { describe, test, expect } from 'vitest'  //引入测试框架的单元测试方法
import { fireEvent, render } from '@testing-library/vue'      //引入组件测试的 render 对象
import Counter from './App.vue'

describe('测试 Counter 组件', () => {
    test('测试 Counter render', async () => {
        // expect(increment(0, 10)).toBe(1)
        const {getByText} = render(Counter)
        getByText("0") //隐式测试
        const button = getByText("add")
        await fireEvent.click(button)
        getByText("1")

        await fireEvent.click(button)
        getByText("1")
    })
})]
```















