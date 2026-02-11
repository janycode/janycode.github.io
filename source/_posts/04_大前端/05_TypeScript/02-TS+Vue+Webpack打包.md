---
title: 02-TS+Vue+Webpack打包
date: 2022-5-22 21:36:21
tags:
- Vue
- TypeScript
- ts
- webpack
categories: 
- 04_大前端
- 05_TypeScript
---

![image-20260107112930310](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260107112931807.png)

参考资料：

* TypeScript 官网：https://www.typescriptlang.org/zh/
* TypeScript 语法文档：https://zhongsp.gitbooks.io/typescript-handbook/content/

> 所有文件格式都是 `.ts` 后缀名。


## 1. TS + Vue3

1. TypeScript 的定位是静态类型语言，在`写代码的阶段就能检查错误`，而非运行阶段
2. 类型系统是最好的文档，增加了代码的`可读性和可维护性`
3. 有一定的学习成本，需要链接`接口 interfaces`、`泛型 generics`、`类 classes` 等
4. `.ts 最后被编译成 js`



### 变量声明

```js
// 类型推断
var myname:string = "jerry"   // 定义 myname 只能为字符串类型，其他类型赋值编写就报错
var myname1 = "hello"  //隐式类型推断
myname.substring(0, 1)

var myage:number = 100.34
myage = parseInt(myage.toFixed(2)) 
console.log(myage)

var myvalue:string|number = 100  // | 或，两种类型都可以
myvalue = "300"
```

```js
// 数组
var mylist:string[] = ['jerry', 'tom', 'spike']
mylist.push('lucy')

var mylist2:number[] = [1, 2, 3]
mylist2.push(100)

var mylist3:(string|number)[] = ['jerry', 18]
mylist3.push(20)
mylist3.push('tom')

var myany:any = "123"     // any类型 就失去了 ts 类型检查的能力了 - 能不用就不用
myany = {}
myany = []
```

```js
// 第二种风格: 泛型写法
var mylist4:Array<string> = ['aaa', 'bbb']
var mylist5:Array<string|number> = ['ccc', 10]
var mylist6:Array<any> = ['ddd', 11, {}, []]
```

```js
// 对象
var myobj = {
    name: 'jerry',
    age: 18
}
interface InterObj {        //接口形式定义对象的字段和类型
    name:string,
    age:number,
    location?:string        //?可选属性
    [propName:string]:any   //可以不限制添加额外属性
}
var myobj1:InterObj
myobj1 = {
    name: 'tom',
    age: 20,
    a: {},
    b: []
}
```

### 函数

```js
// 函数：限定形参类型、返回值类型
function test(a: number, b: number):number {
  return a + b
}

var mynum:number = test(1, 2)
```



### ts+选项式API

参考 vue 官网：https://cn.vuejs.org/guide/typescript/options-api.html

`不推荐`，官方更推荐与 组合式 api使用。

* 注意：接口类型限定
* 注意：类型断言

```vue
<template>
  <div>
    voa app - {{ myname }}
    <button @click="handleChange">click</button>
    <ul>
      <li v-for="(item, index) in list" :key="item">{{ item }}</li>
    </ul>
    <div ref="mydiv">测试</div>
    输入框：<input type="text" ref="myintput">
  </div>
</template>

<script lang="ts">
interface InterState {
  myname: string
  myage: number
  list: Array<string>
}
export default {
  data() {
    return {
      myname: "jerry",
      myage: 18,
      list: [],
    } as InterState // 限定为指定的接口类型
  },
  methods: {
    handleChange() {
      this.myname = "tom"
      this.list.push(this.myname)
      // 类型断言
      console.log((this.$refs.mydiv as HTMLDivElement).innerHTML)
      console.log((this.$refs.myintput as HTMLInputElement).value)
    },
  },
}
</script>
```

父-示例：

```vue
<template>
  <div>
    <Child title="首页" :item="{name:'jerry', age:18, list:[1,2,3]}"></Child>
  </div>
</template>

<script lang="ts">
import Child from "./Child.vue"

export default {
  components: {
    Child,
  }
}
</script>
```

子-示例：

```vue
<template>
  <div>child - {{ title }} - {{ item?.name }} - {{ item?.age }} - {{ item?.list }}</div>
</template>

<script lang="ts">
import type { PropType } from "vue"   //引入类型断言
interface IProps {  //定义接口类型
  name: string
  age: number
  list: Array<number>
}
export default {
  props: {
    title: String,
    item: Object as PropType<IProps>,  //限定为接口类型
  },
}
</script>
```



### ts+组合式API

示例：注意 接口类型限定 interface 和 类型断言如 `ref<HTMLDivElement>()`

```vue
<template>
  <div>
    vca - {{ myname }} - {{ computedMyname }}
    <div ref="mydiv">这是个div</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue"
import type { Ref } from "vue"
// 隐式推导
// const state = reactive({
//     myname: 'jerry'
// })
interface IState {
  myname: string
}
const state: IState = reactive({
  myname: "jerry",
})

// const myname = ref("tom1") //隐式推导
// const myname:Ref<string> = ref('tom2') //Ref<>泛型，需要导入 Ref
const myname = ref<string>("tom3") //ref<>
const mylist = ref<IState[]>([])   // [{myname:'xxx'}, {myname:'yyy'}]

const mydiv = ref<HTMLDivElement>()
onMounted(() => {
  console.log(mydiv.value?.innerHTML)
})

const computedMyname = computed<string>(() => myname.value.substring(0, 1).toUpperCase() + myname.value.substring(1))

</script>
```

父-示例：

```vue
<template>
  <div>
    <Child title="首页" :obj="{name:'jerry', age: 20}"></Child>
  </div>
</template>

<script lang="ts" setup>
import Child from "./Child.vue"
</script>
```

子-示例：`defineProps<{...}>` 与 `defineEmits<{...}>`

```vue
<template>
  <div>child... - {{ title }}-{{ obj.name }}-{{ obj.age }}</div>
</template>

<script lang="ts" setup>
interface IProps {
    name:String,
    age:Number
}
const props = defineProps<{
    title:string,
    obj:IProps   //可选属性，通过接口定义类型
}>()

// 子传父
const emit = defineEmits<{
  (e: 'event', myvalue: string): void
}>()
const handleClick = () => {
  emit("event", "hello")
}
</script>
```



## 2. TS 打包

### webpack 整合

通常情况下，实际开发中我们都需要使用构建工具对代码进行打包；

TS同样也可以结合构建工具一起使用，下边以webpack为例介绍一下如何结合构建工具使用TS；

步骤如下：

#### 初始化项目

进入项目根目录，执行命令 `npm init -y`，创建package.json文件

#### 下载构建工具

命令如下：

```sh
npm i -D webpack webpack-cli webpack-dev-server typescript ts-loader clean-webpack-plugin html-webpack-plugin
```

共安装了7个包:

- webpack：构建工具webpack
- webpack-cli：webpack的命令行工具
- webpack-dev-server：webpack的开发服务器
- typescript：ts编译器
- ts-loader：ts加载器，用于在webpack中编译ts文件
- clean-webpack-plugin：webpack中的清除插件，每次构建都会先清除目录
- html-webpack-plugin：webpack中html插件，用来自动创建html文件

#### 配置 webpack

根目录下创建 webpack 的配置文件`webpack.config.js`：

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// webpack中的所有配置信息都应该写在module.exports中
module.exports = {
   optimization:{
       minimize: false // 关闭代码压缩，可选
   },
   // 指定入口文件
   entry: "./src/index.ts",
   devtool: "inline-source-map",
   devServer: {
       contentBase: './dist'
   },
   // 指定打包文件所在目录
   output: {
       // 指定打包文件的目录
       path: path.resolve(__dirname, "dist"),
       // 打包后文件的文件名
       filename: "bundle.js",
       environment: {
           arrowFunction: false // 关闭webpack的箭头函数，可选
       }
   },
   resolve: {
       extensions: [".ts", ".js"]
   },
   // 指定webpack打包时要使用的模块
   module: {
       // 指定的加载规则
       rules: [
           {
               // test 指定规则生效的文件
               test: /\.ts$/,
               // 要用的加载器
               use: {
                   loader: "ts-loader"     
               },
               // 排除的文件
               exclude: /node_modules/
           }
       ]
   },
   plugins: [
       new CleanWebpackPlugin(),
       new HtmlWebpackPlugin({
           title:'这是一个自定义的 title'
       }),
   ]
}
```

#### 配置TS编译选项

根目录下创建 tsconfig.json，配置可以根据自己需要

```json
{
   "compilerOptions": {
       "target": "ES2015",
       "module": "ES2015",
       "strict": true
   }
}
```

#### 修改package.json配置

修改 package.json 添加如下配置

```json
{
   ...
   "scripts": {
       "test": "echo \"Error: no test specified\" && exit 1",
       "build": "webpack",
       "start": "webpack serve --open chrome.exe"
   },
   ...
}
```

#### 项目使用

在src下创建ts文件，并在并命令行执行`npm run build`对代码进行编译；

或者执行`npm start`来启动开发服务器；

### Babel

除了webpack，开发中还经常需要结合babel来对代码进行转换；

以使其可以兼容到更多的浏览器，在上述步骤的基础上，通过以下步骤再将babel引入到项目中；

> 虽然TS在编译时也支持代码转换，但是只支持简单的代码转换；
>
> 对于例如：Promise等ES6特性，TS无法直接转换，这时还要用到babel来做转换； 安装依赖包：

```sh
npm i -D @babel/core @babel/preset-env babel-loader core-js
```

共安装了4个包，分别是：

- @babel/core：babel的核心工具
- @babel/preset-env：babel的预定义环境
- @babel-loader：babel在webpack中的加载器
- core-js：core-js用来使老版本的浏览器支持新版ES语法

修改webpack.config.js配置文件

```js
...
module: {
    rules: [
        {
            test: /\.ts$/,
            use: [
                {
                    loader: "babel-loader",
                    options:{
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    "targets":{
                                        "chrome": "58",
                                        "ie": "11"
                                    },
                                    "corejs":"3",
                                    "useBuiltIns": "usage"
                                }
                            ]
                        ]
                    }
                },
                {
                    loader: "ts-loader",
                }
            ],
            exclude: /node_modules/
        }
    ]
}
...
```

如此一来，使用ts编译后的文件将会再次被babel处理；

使得代码可以在大部分浏览器中直接使用；

同时可以在配置选项的targets中指定要兼容的浏览器版本；

#### 报错：[BABEL] .targets is not allowed in preset options

原因：presets中是有两层中括号，少写一层会报这个错误

```
presets: [
  [
    "@babel/preset-env",
    {
      "targets":{
        "chrome": "58",
        "ie": "11"
      },
      "corejs":"3",
      "useBuiltIns": "usage"
    }
  ]
]
```



























