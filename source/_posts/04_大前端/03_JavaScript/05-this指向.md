---
title: 05-this指向
date: 2018-5-7 15:21:05
tags:
- this
categories: 
- 04_大前端
- 03_JavaScript
---

![image-20251125100829463](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251128131801.png)

## 1. this 指向

面向对象语言中 `this` 表示当前对象的一个引用。

但在 JavaScript 中 this 不是固定不变的，它会随着执行环境的改变而改变。

- 单独使用，this 表示**全局对象window**。
- 在对象中，this 表示该**该对象**，可以通过 this.key 访问对象key对应的value值。
- 在事件中，this 表示**绑定事件的元素**。
  - 注意区分 *evt.target 是触发事件的元素*，不一定是绑定事件的元素。

> 口诀：谁调用this，this就指向谁（es6 箭头函数）。

示例：

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>this</title>
</head>
<body>
    <div id="box">
        点击-<span>11111</span>
    </div>
    <script>
        // this 谁调用我，this就指向谁（es6 箭头函数）

        // 全局
        console.log(this)         // this:window对象
        function test() {
            console.log(this)     // this:window对象
        }
        test()    // 等价于 window.test()

        // 对象
        var obj = {
            name: "jerry",
            age: 18,
            test: function() {
                console.log("func:", this)         // this: obj对象
                console.log("name:", this.name)    // jerry this: obj对象
            }
        }
        obj.test()

        // setTimeout 和 setInterval
        setTimeout(function() {
            console.log("setTimeout:", this)    // this:window对象
        }, 2000)

        // 事件绑定的this（dom0或dom2都一样）
        box.onclick = function() {
            console.log(this)        // this:元素box对象  <div id="box">点击</div>
        }
        box.addEventListener("click", function(evt) {
            console.log("1111:", this)        // this:元素box对象，即绑事件的元素对象
            console.log(evt.target)           // 点击的 span，即 <span>11111</span>
        })
    </script>
</body>
</html>
```



## 2. 改变this指向

* `call(obj, ...)` 让函数**执行**，并**改变**this指向为函数的第一个传入的参数
  * 支持**多个**参数
* `apply(obj, [...])` 让函数**执行**，并**改变**this指向为函数的第一个传入的参数
  * **两个**参数：第二个参数是个数组
* `bind(obj, ...)` 函数**不会执行**，只是**改变**this指向为第一个传入的参数，并**返回一个新函数**
  * 支持**多个**参数

```js
    <button id="btn">按钮</button>
    <script>
        var name = "11111111111111"
        var obj1 = {
            name: "obj1",
            getName: function(a, b, c) {
                // this 默认指向 obj1对象
                console.log("getName1:", this.name)   // getName: obj1
                console.log("参数：", a, b, c)
            }
        }
        var obj2 = {
            name: "obj2",
            getName: function() {
                // this 默认指向 obj2对象
                console.log("getName2:", this.name)   // getName: obj1
            }
        }
        // obj1.getName()
        // obj2.getName()

        // call: 让函数执行，并改变this指向为函数的第一个传入的参数
        // 支持多个参数
        obj1.getName.call(obj2)                  // this: obj2  所以getName是 obj2
        obj1.getName.call(obj2, 1, 2, 3)
        // apply: 让函数执行，并改变this指向为函数的第一个传入的参数
        // 两个参数：第二个参数是个数组
        obj1.getName.call(obj2, [1, 2, 3])         // 数组被a参数打印

        obj1.getName.call(window)  // this: window

        // bind：不会让函数执行，只是改变this指向为第一个传入的参数，并返回一个新的函数
        // 支持多个参数
        var fun1 = obj1.getName.bind(obj2)
        console.log(fun1)
        fun1(1,2,3)  // 手动执行：obj2 ,  1 2 3

        // bind 应用，先绑定，再延时或者点击等场景触发时再执行
        btn.onclick = handler.bind(window)
        function handler() {
            console.log("点击了", this)    // 点击了  window对象
        }
    </script>
```





















