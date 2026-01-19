---
title: 11-Node.js+Mocha测试
date: 2022-5-22 21:36:21
tags:
- Vue
- Node
- Node.js
- mocha
categories: 
- 04_大前端
- 06_Node.js
---

![image-20260113102144733](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260113102145988.png)

参考：

* Express 官网：https://www.expressjs.com.cn/





## 1. 单元测试

单元测试是用来对一个模块、一个函数或者一个类来进行正确性检验的测试工作。

单元测试通过后有什么意义呢？如果我们对abs()函数代码做了修改，只需要再跑一遍单元测试，如果通过，说明我们的修改不会对abs()函数原有的行为造成影响，如果测试不通过，说明我们的修改与原有行为不一致，要么修改代码，要么修改测试。

这种以测试为驱动的开发模式最大的好处就是确保一个程序模块的行为符合我们设计的测试用例。在将来修改的时候，可以极大程度地保证该模块行为仍然是正确的。

`mocha` 是 JavaScript 的一种单元测试框架，既可以在浏览器环境下运行，也可以在 Node.js 环境下运行。

使用mocha，我们就只需要专注于编写单元测试本身，然后，让mocha去自动运行所有的测试，并给出测试结果。

mocha的特点主要有：

* 既可以测试简单的 JavaScript 函数，又可以测试异步代码，因为异步是 JavaScript 的特性之一；

* 可以自动运行所有测试，也可以只运行特定的测试；

* 可以支持before、after、beforeEach和afterEach来编写初始化代码。



## 2. mocha 单元测试

### 2.1 安装



官网：https://mocha.node.org.cn/

安装：*npm i mocha*

初始化为 node 项目: *npm init* ，mocha 此时为局部安装，修改 package.json 脚本，如 test命令

```json
  "scripts": {
    "test": "mocha"   //可以直接使用 npm test
  },
```

目录：

```
test/
  test1.js
sum.js
```

mocha 会查找当前项目目录下 test 目录下的所有 test 文件。



### 2.2 使用

sum.js

```js
module.exports = function (...rest) {
    var sum = 0
    for (let i of rest) {
        sum += i
    }
    return sum
}
```

test/test1.js - `assert` 为 node 内置的断言库。

```js
var assert = require("assert")

var sum = require("../sum")
console.log(sum(1, 2, 3, 4)); //10

// describe 一组测试，支持嵌套: it 一个测试
describe("大组1测试", () => {
    describe("小组1-1测试", () => {
        it("sum() 结果应该返回 0", () => {
            assert.strictEqual(sum(), 10)
        })
        it("sum() 结果应该返回 1", () => {
            assert.strictEqual(sum(1), 1)
        })
    })
    describe("小组1-2测试", () => {
        it("sum() 结果应该返回 3", () => {
            assert.strictEqual(sum(1, 2), 3)
        })
    })
})

describe("大组2测试", () => {
    describe("小组2-1测试", () => {
        it("sum() 结果应该返回 6", () => {
            assert.strictEqual(sum(1, 2, 3), 6)
        })
    })
})
```

npm test 单元测试结果：

```sh
  大组1测试
    小组1-1测试
      1) sum() 结果应该返回 0
      ✔ sum() 结果应该返回 1
    小组1-2测试
      ✔ sum() 结果应该返回 3

  大组2测试
    小组2-1测试
      ✔ sum() 结果应该返回 6


  3 passing (4ms)
  1 failing

  1) 大组1测试
       小组1-1测试
         sum() 结果应该返回 0:

      AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

0 !== 10

      + expected - actual

      -0
      +10

      at Context.<anonymous> (test\test.js:10:20)
      at process.processImmediate (node:internal/timers:476:21)
```



### 2.3 断言库

![image-20260119170715969](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260119170717405.png)

mocha 允许使用你喜欢的断言库，如 assert 是 node 内置的断言库，如果能够抛出一个错误，它就能运行。上述断言库都可以使用。




## 3. chai 断言库

### 3.1 安装

官网：https://www.chaijs.com/

安装：*npm i chai@4*

版本有兼容，chai 的大版本简易使用 4 版本，适配当前 node18 版本。

### 3.2 使用

#### assert

示例：

```js
var chai = require('chai')
var assert = chai.assert;

describe('assert Demo', function () {
    it('use assert lib', function () {
        var value = "hello";
        assert.typeOf(value, 'string')
        assert.equal(value, 'hello')
        assert.lengthOf(value, 5)
    })
})
```

test/test.js - assert 风格

```js
var chai = require('chai')
var assert = chai.assert;  // assert.equal(...)

var sum = require("../sum")
console.log(sum(1, 2, 3, 4)); //10

// describe 一组测试，支持嵌套: it 一个测试
describe("test2 大组1测试", () => {
    describe("小组1-1测试", () => {
        it("sum() 结果应该返回 0", () => {
            assert.equal(sum(), 0)
        })
        it("sum() 结果应该返回 1", () => {
            assert.equal(sum(1), 1)
        })
    })
    describe("小组1-2测试", () => {
        it("sum() 结果应该返回 3", () => {
            assert.equal(sum(1, 2), 3)
        })
    })
})

describe("test2 大组2测试", () => {
    describe("小组2-1测试", () => {
        it("sum() 结果应该返回 6", () => {
            assert.equal(sum(1, 2, 3), 6)
        })
    })
})
```

#### should

示例：

```js
var chai = require('chai');
chai.should();

describe('should Demo', function(){
    it('use should lib', function () {
        var value = 'hello'
        value.should.exist.and.equal('hello').and.have.length(5).and.be.a('string')
        // value.should.be.a('string')
        // value.should.equal('hello')
        // value.should.not.equal('hello2')
        // value.should.have.length(5);
    })
});
```

test/test.js - shoud 风格

```js
var chai = require('chai')
chai.should();  // value.should.equal(...)

var sum = require("../sum")
console.log(sum(1, 2, 3, 4)); //10

// describe 一组测试，支持嵌套: it 一个测试
describe("test3 大组1测试", () => {
    describe("小组1-1测试", () => {
        it("sum() 结果应该返回 0", () => {
            sum().should.equal(0)
        })
        it("sum() 结果应该返回 1", () => {
            sum(1).should.equal(1)
        })
    })
    describe("小组1-2测试", () => {
        it("sum() 结果应该返回 3", () => {
            sum(1, 2).should.equal(3)
        })
    })
})

describe("test3 大组2测试", () => {
    describe("小组2-1测试", () => {
        it("sum() 结果应该返回 6", () => {
            sum(1, 2, 3).should.equal(6)
        })
    })
})
```

#### expect

示例：

```js
var chai = require('chai');
var expect = chai.expect;

describe('expect Demo', function() {
    it('use expect lib', function () {
        var value = 'hello'
        var number = 3
        expect(number).to.be.at.most(5)
        expect(number).to.be.at.least(3)
        expect(number).to.be.within(1, 4)
        expect(value).to.exist
        expect(value).to.be.a('string')
        expect(value).to.equal('hello')
        expect(value).to.not.equal('您好')
        expect(value).to.have.length(5)
    })
});
```

test/test.js - expect 风格

```js
var chai = require('chai')
var expect = chai.expect;  // expect(value).to.equal()

var sum = require("../sum")
console.log(sum(1, 2, 3, 4)); //10

// describe 一组测试，支持嵌套: it 一个测试
describe("test4 大组1测试", () => {
    describe("小组1-1测试", () => {
        it("sum() 结果应该返回 0", () => {
            expect(sum()).to.equal(0)
        })
        it("sum() 结果应该返回 1", () => {
            expect(sum(1)).to.equal(1)
        })
    })
    describe("小组1-2测试", () => {
        it("sum() 结果应该返回 3", () => {
            expect(sum(1, 2)).to.equal(3)
        })
    })
})

describe("test4 大组2测试", () => {
    describe("小组2-1测试", () => {
        it("sum() 结果应该返回 6", () => {
            expect(sum(1, 2, 3)).to.equal(6)
        })
    })
})
```



## 4. 异步测试

```js
const assert = require("assert")
const fs = require("fs")
const fsp = fs.promises
// 利用 done 回调函数做异步测试
describe("test5 异步测试-done", () => {
    it("异步读取文件", (done) => {
        fs.readFile("./1.txt", "utf8", (err, data) => {
            if (err) {
                done(err)
            } else {
                assert.strictEqual(data, "hello") // 1.txt 里是 hello2
                done()
            }
        })
    })
})
// 利用 async+await 做异步测试
describe("test5 异步测试-async", () => {
    it("异步读取文件", async () => {
        var data = await fsp.readFile("./1.txt", "utf8")
        assert.strictEqual(data, "hello")  // 1.txt 里是 hello2
    })
})
```



## 5. http测试

以 koa 为例：*npm i koa@2 axios supertest*

主要是引入 `supertest` 模块，自带 **expect** 期望风格的断言库。

示例：

```js
const request = require('supertest')
const app = require('../app');

describe('#test koa app', () => {
    let server = app.listen(3000);
    describe('#test server', () => {
        it('#test GET /', async () => {
            await request(server)
                .get('/')
                .expect('Content-Type', /text/html/)
                .expect(200, '<h1>hello world</h1>');
        });

        after(function () {
            server.close()
        });
    });
});
```



验证：

app.js

```js
const Koa = require("koa")
const app = new Koa()

app.use((ctx) => {
    ctx.body = "<h1>hello</h1>"
})
// app.listen(3000)   // supertest 时，不用启动服务器，导出 app 模块即可

module.exports = app
```

test/test.js - http 接口测试

```js
const axios = require("axios")
const assert = require("assert")
const supertest = require('supertest')

const app = require("../app")

describe("test-http 测试1", () => {
    it("返回html代码片段测试1", async () => {
        var res = await axios.get("http://localhost:3000")
        assert.strictEqual(res.data, "<h1>hello</h1>")
    })
})

describe("test-http 测试2", () => {
    let server = app.listen(3000)  // 启动服务器
    it("返回html代码片段测试2", async () => {
        await supertest(server).get("/")
            .expect("Content-Type", /text\/html/)
            .expect(200, "<h1>hello</h1>")
    })
    // mocha 库自带的 钩子函数 after()
    after(() => {
        server.close()             // 关闭服务器
    })
})
```



## 6. 钩子函数

mocha 中包含一些钩子函数，如

```js
describe('#hello.js', () => {
    describe('#sum()', () => {
        before(function () {
            console.log('before:');
        });
        after(function () {
            console.log('after.');
        });
        beforeEach(function () {
            console.log('  beforeEach:');
        });
        afterEach(function () {
            console.log('  afterEach.');
        });
    });
});
```

实例：

```js
const axios = require("axios")
const assert = require("assert")
const supertest = require('supertest')

const app = require("../app")

describe("test-http 测试1", () => {
    it("返回html代码片段测试1", async () => {
        // var res = await axios.get("http://localhost:3000")
        // assert.strictEqual(res.data, "<h1>hello</h1>")
    })
})

describe("test-http 测试2", () => {
    let server
    it("返回html代码片段测试2", async () => {
        await supertest(server).get("/")
            .expect("Content-Type", /text\/html/)
            .expect(200, "<h1>hello</h1>")
    })
    // mocha 库自带的 钩子函数 before() after()
    before(() => {
        server = app.listen(3000)  // 启动服务器
    })
    after(() => {
        server.close()             // 关闭服务器
    })
})
```







