---
title: 04-Regex正则表达式
date: 2018-5-7 15:21:05
tags:
- 正则表达式
categories: 
- 04_大前端
- 03_JavaScript
---

![image-20251125100829463](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251128131801.png)

> 正则表达式在线测试+代码生成：[https://c.runoob.com/front-end/854](https://c.runoob.com/front-end/854)
>
> 正则表达式可视化: https://jex.im/regulex

## 1. 创建

### 1.1 字面量

```js
var reg = /abc/      //eg: 包含 abc 子字符串
```



### 1.2 构造函数

```js
var reg2 = new RegExp("abc")   //eg: 包含 abc 子字符串
```



示例：

```html
    <form action="">
        <input type="text" required id="mytext">
        <input type="email">
        <input type="submit" value="提交">
    </form>

    <script>
        /* 正则表达式 */
        // 1.字面量方式
        var reg = /abc/      //eg: 包含 abc 子字符串
        console.log(reg)
        // 2.内置构造函数
        var reg2 = new RegExp("abc")   //eg: 包含 abc 子字符串
        console.log(reg2)

        mytext.onblur = function() {
            console.log(mytext.value)
            console.log(reg.test(mytext.value))   // true/false
        }
    </script>
```



## 2. 元字符

### 2.1 基本元字符

* `\d` 一位数字
* `\D` 一位非数字
* `\s` 一位空白，包含空格、缩进、换行
* `\S` 一位非空白
* `\w` 一位字母、数字、下划线
* `\W` 一位非字母、非数字、非下划线
* `.` 一位任意内容（换行不算）
* `\` 转义字符
* ...

```js
    <script>
        //1. \d 一位数字
        var reg = /\d/    // 包含一位数字
        console.log(reg.test("abc"))   // false
        console.log(reg.test("123"))   // true
        reg = /\d\d/      // 包含两位数字
        console.log(reg.test("ab2"))   // false
        console.log(reg.test("123"))   // true

        //2. \D 一位非数字
        reg = /\D/         //包含一位非数字
        console.log(reg.test("ab2"))   // true
        console.log(reg.test("123"))   // false

        //3. \s 一位空白，包含空格、缩进、换行都算
        reg = /\s/
        console.log(reg.test("ab2"))    // false
        console.log(reg.test("ab\n2"))  // true

        //4. \S 一位非空白
        reg = /\S/
        console.log(reg.test("ab 2"))   // true
        console.log(reg.test("\n"))     // false

        //5. \w 一位字母、数字、下划线
        reg = /\w/
        console.log(reg.test("&(*)"))    // false
        console.log(reg.test("ab_1"))    // true
        
        //6. \W 一位非字母、非数字、非下划线
        reg = /\W/
        console.log(reg.test("&(*)"))    // true
        console.log(reg.test("ab_1"))    // false

        //7. . 任意内容（换行不算）
        reg = /./
        console.log(reg.test("&(*^"))      // true
        console.log(reg.test("\n\n\n"))    // false

        //8. \ 转义字符
        reg = /\d\.\d/     // 一位小数
        console.log(reg.test("1.2"))       // true
        console.log(reg.test("1a2"))       // false
    </script>
```

### 2.2 边界符

* `^` 以什么开头，只能限定一位字符
* `$` 以什么结尾，只能限定一位字符
* `^开头结尾$` 以什么开头且以什么结尾，开头结尾各一位字符

```js
    <script>
        // ^ 以什么开头
        var reg = /^\d/      // 以一位数字开头
        console.log(reg.test("abc"))     // false
        console.log(reg.test("12a"))     // true
        // $ 以什么结尾
        reg = /\d$/
        console.log(reg.test("abc"))     // false
        console.log(reg.test("a12"))     // true
        // ^开头结束$
        reg = /^a\dc$/
        console.log(reg.test("a1c"))      // true
        console.log(reg.test("abc"))      // false
    </script>
```

### 2.3 限定符

* `*` 0~n次
* `+` 1~n次
* `?` 0~1次
* `{n}` 限定n次
* `{n,}` 限定大于等于n次
* `{n,m}` 限定n~m次，包含n次和m次

```js
    <script>
        // * 0~n次
        var reg = /\d*/
        console.log(reg.test("abc"))        // true
        console.log(reg.test("abc1"))       // true
        console.log(reg.test("abc123"))     // true
        // + 1~n次
        reg = /\d+/
        console.log(reg.test("abc"))        // false
        console.log(reg.test("abc1"))       // true
        console.log(reg.test("abc123"))     // true
        // ? 0~1次
        reg = /\d?/
        console.log(reg.test("abc"))        // true
        console.log(reg.test("abc1"))       // true
        console.log(reg.test("abc123"))     // true
        // {n} 限定次数
        reg = /\d{3}/
        console.log(reg.test("abc"))        // false
        console.log(reg.test("abc1"))       // false
        console.log(reg.test("abc123"))     // true
        // {n,} 限定大于等于n次
        reg = /\d{3,}/
        console.log(reg.test("abc"))          // false
        console.log(reg.test("abc1"))         // false
        console.log(reg.test("abc12345"))     // true
        // {n,m} 限定 大于等于n次，小于等于m次
        reg = /\d{3,5}/
        console.log(reg.test("abc"))          // false
        console.log(reg.test("abc123"))       // true
        console.log(reg.test("abc12345"))     // true
        reg = /^abc{2}$/
        console.log(reg.test("abc"))           // false
        console.log(reg.test("decc"))          // false
        console.log(reg.test("332abcc3232"))   // false
        console.log(reg.test("abcc"))          // true
    </script>
```



### 2.4 特殊符号

* `()` 表示整体
* `|` 或，左右是整体，最好加上小括号便于分辨
* `[]` 代表包含1个，且需要连续，不能穿插不符合规则的字符
* `[^]` 取反，意思是不是这里面的字符

```js
    <script>
        // () 表示整体
        reg = /^(abc){2}$/
        console.log(reg.test("abc"))             // false
        console.log(reg.test("decc"))            // false
        console.log(reg.test("332abcabc3232"))   // false
        console.log(reg.test("abcabc"))          // true
        // | 或，左右是整体，最好加上小括号便于分辨
        reg = /a|b/
        console.log(reg.test("123"))    // false
        console.log(reg.test("1a3"))    // true
        console.log(reg.test("12b"))    // true
        console.log(reg.test("1ab"))    // true
        reg = /(abc|def)/    // | 前后整体，等价于 /((abc)|(def))/
        console.log(reg.test("abd"))      // false
        console.log(reg.test("abdef"))    // true
        reg = /abc|def|xyz/    // | 前后整体，等价于 /(abc)|(def)|(xyz)/
        console.log(reg.test("abc"))    // true
        console.log(reg.test("def"))    // true
        console.log(reg.test("fyz"))    // false
        // [] 代表包含1个，且需要连续，不能穿插不符合规则的字符
        reg = /[abcdef]/
        console.log(reg.test("x"))     // false
        console.log(reg.test("xa"))    // true
        reg = /[abcdef]{3,5}/
        console.log(reg.test("abcd"))     // true
        console.log(reg.test("abxyz"))    // false
        console.log(reg.test("a1b2c3d4xyz"))    // false
        reg = /[a-zA-Z0-9_]/
        console.log(reg.test("a1b2c3d4xyz"))       // true
        console.log(reg.test("a1!@@##$$%2c3d"))    // true
        // [^] 取反，意思是不是这里面的字符
        reg = /[^abc]/
        console.log(reg.test("a"))      // false
        console.log(reg.test("ac"))     // false
        console.log(reg.test("ac1"))    // true
    </script>
```



### 2.5 捕获exec

`exec()` 捕获匹配正则的字符串片段。

* `/reg/g` 全局匹配，此时exec()方法每调用一次就会往下匹配一个，直到匹配为 null 即为查找结束
* `/reg/i` 忽略大小写
* `/reg/gi` （两个标识符可以同时写）

```js
    <script>
        // exec() 方法
        var reg = /\d{3}/
        console.log(reg.exec("aa123aa"))   // ['123', index: 2, input: 'aa123aa', groups: undefined]

        // exec() 截取一次
        var dateStr = "time is 2077-02-01 12:20:30"
        // 2077/02/01
        reg = /\d{4}-\d{1,2}-\d{1,2}/
        var newStr = reg.exec(dateStr)
        console.log(newStr[0].split("-").join("/"))    // 2077/02/01

        // exec() 截取两次, 标识符 //g 全局往下逐次exec()调用匹配，//i 忽略大小写，写一起就是 //gi
        var dateStr1 = "time is 2077-02-01 12:20:30 2099-08-07 16:15:14"
        // 2077/02/01 - 2099/08/07
        reg = /\d{4}-\d{1,2}-\d{1,2}/g
        var newStr1 = reg.exec(dateStr1)
        console.log(newStr1)
        // 因为标识符g，每次调用exec()可以继续往下查找匹配
        var newStr2 = reg.exec(dateStr1)   // 查找匹配的第一个
        console.log(newStr2)
        var newStr3 = reg.exec(dateStr1)   // 查找匹配的第二个
        console.log(newStr3)             // null - 可用于while循环判断查找结束标记
        console.log(newStr1[0].split("-").join("/"))    // 2077/02/01
        console.log(newStr2[0].split("-").join("/"))    // 2099/08/07

        // () 和 g 一起使用，会将捕获的对象拆分到数组中去，可以通过数组下标直接获取
        reg = /(\d{4})-(\d{1,2})-(\d{1,2})/g
        var s = reg.exec(dateStr1);
        console.log(s)     // ['2077-02-01', '2077', '02', '01', index: 8, ...]
        console.log(s[0])  // 2077-02-01
        console.log(s[1])  // 2077
        console.log(s[2])  // 02
        console.log(s[3])  // 01

        // 标识符 i: 忽略大小写
        reg = /[a-z]/i
        console.log(reg.test("AA"))  // true
    </script>
```



## 3. 两大特性

1. **懒惰**，exec()每次只找匹配的第一个。
   - 解决：使用全局标识符 `g`，就可以exec()逐次调用查找
2. **贪婪**，会尽可能匹配最长的结果
   - 解决：正则表达式内部的最后，加上一个 `?` 就可以变为非贪婪（会尽可能匹配最短的结果）

```js
    <script>
        //1.懒惰特性，解决：使用全局标识符 g，就可以exec()逐次调用查找
        //2.贪婪，会尽可能匹配最长的结果
        var reg = /\d{1,4}/
        console.log(reg.exec("aa12345bb")[0]) 
        //3.非贪婪，会尽可能匹配最短的结果
        reg = /\d{1,4}?/
        console.log(reg.exec("aa12345bb")[0])

        // 示例-非贪婪
        var str = `<p class="active"><span>hello,world</span></p>`
        reg = /<p.*?>/
        console.log(reg.exec(str)[0])  // <p class="active">
    </script>
```



## 4. 正则与字符串方法

* `str.replace(reg, 要替换的内容)` 全局替换，记得加上标识符 g
* `str.search(reg)`  查找匹配正则的字符串的首个字符下标
* `str.match(reg)` 匹配正则，返回数组（需要加上标识符g）

```js
    <script>
        // 字符串 .replace() .search() .match
        var s = "aaa我艹bbb我艹cd"
        var newS = s.replace(/我艹/g, "*")
        console.log(newS)     // aaa*bbb*cd

        console.log(s.search("b"))    // 5
        console.log(s.search(/b/))    // 5
        console.log(s.search(/cd/))   // 10

        var ds = "time is 2077-02-01 12:20:30 2099-08-07 16:15:14"
        console.log(ds.match(/(\d{4})-(\d{1,2})-(\d{1,2})/g))    // ['2077-02-01', '2099-08-07']
    </script>
```





## 案例：密码强度验证

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        form {
            width: 500px;
            height: 100px;
            border: 2px solid black;
            margin: 10px auto;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        form input{
            height: 30px;
            line-height: 30px;
            width: 400px;
            font-size: 25px;
            padding-left: 5px;
        }
        form p {
            width: 400px;
            display: flex;
            justify-content: space-between;
        }
        form p span{
            width: 100px;
            margin-top: 10px;
            text-align: center;
            border: 1px solid gray;
            background: lightgrey;
        }

        form>p>.active:nth-child(1) {
            color: white;
            background: red;
        }
        form>p>.active:nth-child(2) {
            color: white;
            background: orange;
        }
        form>p>.active:nth-child(3) {
            color: white;
            background: green;
        }

    </style>
</head>
<body>
    <form action="">
        <label for="">
            <input type="text">
        </label>
        <p>
            <span>弱</span>
            <span>中</span>
            <span>强</span>
        </p>
    </form>

    <script>
        var oinput = document.querySelector("input")
        var reg1 = /\d/
        var reg2 = /[a-z]/i
        var reg3 = /[!@#$%^&*()]/

        var ospans = document.querySelectorAll("span")
        oinput.oninput = function(evt) {
            // 输入的值：this.value 或 evt.target.value
            //console.log(this.value)
            //console.log(evt.target.value)
            var level = 0
            if (reg1.test(this.value)) level++
            if (reg2.test(this.value)) level++
            if (reg3.test(this.value)) level++
            //console.log(level)

            for (var i = 0; i < ospans.length; i++) {
                //先移除
                ospans[i].classList.remove("active")
                if (i < level) {
                    //再添加
                    ospans[i].classList.add("active")
                }
            }
        }
    </script>
</body>
</html>
```

效果：

![chrome-capture-2025-12-10 (4)](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251210193550.gif)































<hr>

old备份：

1. 正则表达式 基本使用

1. `匹配`
    测试字符串内的模式。例如，可以测试输入字符串，以查看字符串内是否出现电话号码模式或信用卡号码模式。这称为数据验证。
2. `替换`
    替换文本。可以使用正则表达式来识别文档中的特定文本，完全删除该文本或者用其他文本替换它。
3. `提取`
    提取子字符串。基于模式匹配从字符串中提取子字符串，可以查找文档内或输入域内特定的文本。

1.1 Java执行正则方法

**String类**成员方法：

boolean `matches`(String regex); // 正则匹配

String[] `split`(String regex); // 正则分割

String `replaceFirst`(String regex, String replacement); // 正则替换第1个

String `replaceAll`(String regex, String replacement); // 正则替换所有

> 仅能进行匹配、校验、替换

**Pattern & Matcher 类** - 专门用于正则表达式：

Pattern 类：

public static Pattern `compile`(String regex); // 编译正则

public Matcher `matcher`(CharSequence input); // 匹配正则对象

Matcher 类：

boolean `find`() // 查找匹配子串

String `group`() // 返回匹配子串

String `replaceAll`(String replacement) // 替换所有

String `replaceFirst`(String replacement) // 替换第一个  

> 可以进行更匹配/校验、替换、抽取等操作。

```java
// 匹配用法
String reg = "[a]{3}";
Pattern pattern = Pattern.compile(reg);
Matcher matcher = pattern.matcher("aaa");
boolean b = matcher.matches();
System.out.println(b); // true

// 替换用法
String s = "18937162222...safsdfa.f.ds.afsdf18566206666a651sdfas18937115555";
String reg = "[1]{1}[356789]{1}\\d{9}";
Pattern pattern = Pattern.compile(reg);
Matcher matcher = pattern.matcher(s);
String newStr = matcher.replaceAll("手机号");
System.out.println(newStr); // 手机号...safsdfa.f.ds.afsdf手机号a651sdfas手机号

// 抽取用法
String s = "18937162222...safsdfa.f.ds.afsdf18566206666a651sdfas18937115555";
String reg = "[1]{1}[356789]{1}\\d{9}";
Pattern pattern = Pattern.compile(reg);
Matcher matcher = pattern.matcher(s);
List<String> phones = new ArrayList<>();
// find() 查找匹配的子字符串
while (matcher.find()) {
    // group() 返回匹配的子字符串
    phones.add(matcher.group());
}
System.out.println(phones); // [18937162222, 18566206666, 18937115555]
```

示例：匹配提取中文字符

```java
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ChineseFilter {
    private static final Pattern CHINESE_PATTERN = Pattern.compile("[\\u4e00-\\u9fa5]+");

    public static String filter(String text) {
        StringBuilder sb = new StringBuilder();
        Matcher matcher = CHINESE_PATTERN.matcher(text);
        while (matcher.find()) {
            sb.append(matcher.group());
        }
        return sb.toString();
    }

    public static boolean isChinese(String text) {
        if (StringUtils.isEmpty(text)) {
            return false;
        }
        char[] charArray = text.toCharArray();
        if (charArray.length > 1) {
            return false;
        }
        char c = charArray[0];
        //性能最高
        return (c >= '\u4e00' && c <= '\u9fa5');
    }

    //验证
    public static void main(String[] args) {
        String text = "这是一句中文，Hello World！";
        String filtered = ChineseFilter.filter(text);
        //输出：这是一句中文
        System.out.println(filtered);
    }
}
```



1.2 常用规则

**单字符类**：

● `[abc]` a/b/c任意1个

● `[^abc]` 除了a/b/c的任何字符

● `[a-zA-Z]` a到z或A到Z含边界字符

● `[0-9]` 0-9之间的字符都包括

**预定义字符/元字符类**：

● `.` 任意1个字符

● `\d` 单个数字 [0-9]

● `\D` 非数字 [^0-9]

● `\w` 单词字符 [a-zA-Z_0-9]

● `\W` 非单词字符 [^\w]

● `\s` 空白字符 [\t\n\x0B\f\r]

● `\S` 非空白字符 [^\s]

**数量类**：

X 表示一个字符或者预定义字符

● `X?` 0或1次

● `X*` 0到n次

● `X+` 1到n次

● `X{n}` n次

● `X{n,}` 至少n次

● `X{n,m}` 至少n次，不超过m次

1.3 常用正则案例 × 75

**校验数字的表达式**

1. 数字：`^[0-9]*$`
2. n位的数字：`^\d{n}$`
3. 至少n位的数字：`^\d{n,}$`
4. m-n位的数字：`^\d{m,n}$`
5. 零和非零开头的数字：`^(0|[1-9][0-9]*)$`
6. 非零开头的最多带两位小数的数字：`^([1-9][0-9]*)+(.[0-9]{1,2})?$`
7. 带1-2位小数的正数或负数：`^(\-)?\d+(\.\d{1,2})?$`
8. 正数、负数、和小数：`^(\-|\+)?\d+(\.\d+)?$`
9. 有两位小数的正实数：`^[0-9]+(.[0-9]{2})?$`
10. 有1~3位小数的正实数：`^[0-9]+(.[0-9]{1,3})?$`
11. 非零的正整数：`^[1-9]\d*$` 或 `^([1-9][0-9]*){1,3}$` 或 `^\+?[1-9][0-9]*$`
12. 非零的负整数：`^\-[1-9][]0-9"*$` 或 `^-[1-9]\d*$`
13. 非负整数：`^\d+$` 或 `^[1-9]\d*|0$`
14. 非正整数：`^-[1-9]\d*|0$` 或 `^((-\d+)|(0+))$`
15. 非负浮点数：`^\d+(\.\d+)?$` 或 `^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0$`
16. 非正浮点数：`^((-\d+(\.\d+)?)|(0+(\.0+)?))$` 或 `^(-([1-9]\d*\.\d*|0\.\d*[1-9]\d*))|0?\.0+|0$`
17. 正浮点数：`^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$` 或 `^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$`
18. 负浮点数：`^-([1-9]\d*\.\d*|0\.\d*[1-9]\d*)$` 或 `^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$`
19. 浮点数：`^(-?\d+)(\.\d+)?$` 或 `^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$`

**校验字符的表达式**
1. 汉字：`^[\u4e00-\u9fa5]{0,}$`

2. 英文和数字：`^[A-Za-z0-9]+$` 或 `^[A-Za-z0-9]{4,40}$`

3. 长度为3-20的所有字符：`^.{3,20}$`

4. 由26个英文字母组成的字符串：`^[A-Za-z]+$`

5. 由26个大写英文字母组成的字符串：`^[A-Z]+$`

6. 由26个小写英文字母组成的字符串：`^[a-z]+$`

7. 由数字和26个英文字母组成的字符串：`^[A-Za-z0-9]+$`

8. 由数字、26个英文字母或者下划线组成的字符串：`^\w+$` 或 `^\w{3,20}$`

9. 中文、英文、数字包括下划线：`^[\u4E00-\u9FA5A-Za-z0-9_]+$`

10. 中文、英文、数字但不包括下划线等符号：`^[\u4E00-\u9FA5A-Za-z0-9]+$` 或 `^[\u4E00-\u9FA5A-Za-z0-9]{2,20}$`

11. 可以输入含有`^%&',;=?$\"`等字符：`[^%&',;=?$\x22]+ 12` 

12. 禁止输入含有`~`的字符：`[^~\x22]+`

    其它：

    `.*`匹配除 \n 以外的任何字符。

    `/[\u4E00-\u9FA5]/` 汉字

    `/[\uFF00-\uFFFF]/` 全角符号

    `/[\u0000-\u00FF]/` 半角符号

**特殊需求表达式** 
1. Email地址：`^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$`
2. 域名：`[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(/.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+/.?`
3. InternetURL：`[a-zA-z]+://[^\s]* 或 ^http://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?$`
4. 手机号码：`^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$`
5. 电话号码("XXX-XXXXXXX"、"XXXX-XXXXXXXX"、"XXX-XXXXXXX"、"XXX-XXXXXXXX"、"XXXXXXX"和"XXXXXXXX)：`^(\(\d{3,4}-)|\d{3.4}-)?\d{7,8}$`
6. 国内电话号码(0511-4405222、021-87888822)：`\d{3}-\d{8}|\d{4}-\d{7}`
7. 身份证号(15位、18位数字)：`^\d{15}|\d{18}$`
8. 短身份证号码(数字、字母x结尾)：`^([0-9]){7,18}(x|X)?$` 或 `^\d{8,18}|[0-9x]{8,18}|[0-9X]{8,18}?$`
9. 帐号是否合法(字母开头，允许5-16字节，允许字母数字下划线)：`^[a-zA-Z][a-zA-Z0-9_]{4,15}$`
10. 密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)：`^[a-zA-Z]\w{5,17}$`
11. 强密码(必须包含大小写字母和数字的组合，不能使用特殊字符，长度在8-10之间)：`^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$`
12. 日期格式：`^\d{4}-\d{1,2}-\d{1,2}`
13. 一年的12个月(01～09和1～12)：`^(0?[1-9]|1[0-2])$`
14. 一个月的31天(01～09和1～31)：`^((0?[1-9])|((1|2)[0-9])|30|31)$`
15. 钱的输入格式：
1.有四种钱的表示形式我们可以接受:"10000.00" 和 "10,000.00", 和没有 "分" 的 "10000" 和 "10,000"：`^[1-9][0-9]*$`
2.这表示任意一个不以0开头的数字,但是,这也意味着一个字符"0"不通过,所以我们采用下面的形式：`^(0|[1-9][0-9]*)$`
3.一个0或者一个不以0开头的数字.我们还可以允许开头有一个负号：`^(0|-?[1-9][0-9]*)$`
4.这表示一个0或者一个可能为负的开头不为0的数字.让用户以0开头好了.把负号的也去掉,因为钱总不能是负的吧.下面我们要加的是说明可能的小数部分：`^[0-9]+(.[0-9]+)?$`
5.必须说明的是,小数点后面至少应该有1位数,所以"10."是不通过的,但是 "10" 和 "10.2" 是通过的：`^[0-9]+(.[0-9]{2})?$`
 6.这样我们规定小数点后面必须有两位,如果你认为太苛刻了,可以这样：`^[0-9]+(.[0-9]{1,2})?$`
7.这样就允许用户只写一位小数.下面我们该考虑数字中的逗号了,我们可以这样：`^[0-9]{1,3}(,[0-9]{3})*(.[0-9]{1,2})?$`
8.1到3个数字,后面跟着任意个 逗号+3个数字,逗号成为可选,而不是必须：`^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$`
备注：这就是最终结果了,别忘了"`+`"可以用"`*`"替代如果你觉得空字符串也可以接受的话(奇怪,为什么?)最后,别忘了在用函数时去掉去掉那个反斜杠,一般的错误都在这里
16. xml文件：`^([a-zA-Z]+-?)+[a-zA-Z0-9]+\\.[x|X][m|M][l|L]$`
17. 中文字符的正则表达式：`[\u4e00-\u9fa5]`
18. 双字节字符：`[^\x00-\xff]` (包括汉字在内，可以用来计算字符串的长度(一个双字节字符长度计2，ASCII字符计1))
19. 空白行的正则表达式：`\n\s*\r` (可以用来删除空白行)
20. HTML标记的正则表达式：`<(\S*?)[^>]*>.*?</\1>|<.*? />` (网上流传的版本太糟糕，上面这个也仅仅能部分，对于复杂的嵌套标记依旧无能为力)
21. 首尾空白字符的正则表达式：`^\s*|\s*$` 或 `(^\s*)|(\s*$)` (可以用来删除行首行尾的空白字符(包括空格、制表符、换页符等等)，非常有用的表达式)
22. 腾讯QQ号：`[1-9][0-9]{4,}` (腾讯QQ号从10000开始)
23. 中国邮政编码：`[1-9]\d{5}(?!\d)` (中国邮政编码为6位数字)
24. IP地址：`\d+\.\d+\.\d+\.\d+` (提取IP地址时有用)
25. IP地址：`((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))`
26. IP-v4地址：`\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b` (提取IP地址时有用)
27. 校验IP-v6地址:`(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))`
28. 子网掩码：`((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))`
29. 校验日期:`^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$`(“yyyy-mm-dd“ 格式的日期校验，已考虑平闰年。)
30. 抽取注释：`<!--(.*?)-->`
31. 查找CSS属性:`^\\s*[a-zA-Z\\-]+\\s*[:]{1}\\s[a-zA-Z0-9\\s.#]+[;]{1}`
32. 提取页面超链接:`(<a\\s*(?!.*\\brel=)[^>]*)(href="https?:\\/\\/)((?!(?:(?:www\\.)?'.implode('|(?:www\\.)?', $follow_list).'))[^" rel="external nofollow" ]+)"((?!.*\\brel=)[^>]*)(?:[^>]*)>`
33. 提取网页图片:`\\< *[img][^\\\\>]*[src] *= *[\\"\\']{0,1}([^\\"\\'\\ >]*)`
34. 提取网页颜色代码:`^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$`
35. 文件扩展名效验: `^([a-zA-Z]\\:|\\\\)\\\\([^\\\\]+\\\\)*[^\\/:*?"<>|]+\\.txt(l)?$`
36. 判断IE版本：`^.*MSIE [5-8](?:\\.[0-9]+)?(?!.*Trident\\/[5-9]\\.0).*$`

2. 正则表达式 语法（明细）

2.1 普通字符

普通字符包括没有显式指定为元字符的所有可打印和不可打印字符。这包括`所有大写和小写字母、所有数字、所有标点符号和一些其他符号`。

2.2 非打印字符

非打印字符也可以是正则表达式的组成部分。
<table class="reference">
<tr>
	<th width="20%">字符</th>
	<th width="80%">描述</th>
</tr>
<tr>
	<td>\cx</td>
    <td>匹配由x指明的控制字符。例如， \cM 匹配一个 Control-M 或回车符。x 的值必须为 A-Z 或 a-z 之一。否则，将 c 视为一个原义的 'c' 字符。</td>
</tr>
<tr>
	<td>\f</td>
    <td>匹配一个换页符。等价于 \x0c 和 \cL。</td>
</tr>
<tr>
	<td>\n</td>
    <td>匹配一个换行符。等价于 \x0a 和 \cJ。</td>
</tr>
<tr>
	<td>\r</td>
    <td>匹配一个回车符。等价于 \x0d 和 \cM。</td>
</tr>
<tr>
	<td>\s</td>
    <td>匹配任何空白字符，包括空格、制表符、换页符等等。等价于 [ \f\n\r\t\v]。注意 Unicode 正则表达式会匹配全角空格符。</td>
</tr>
<tr>
	<td>\S</td>
    <td>匹配任何非空白字符。等价于 [^ \f\n\r\t\v]。</td>
</tr>
<tr>
	<td>\t</td>
    <td>匹配一个制表符。等价于 \x09 和 \cI。</td>
</tr>
<tr>
	<td>\v</td>
    <td>匹配一个垂直制表符。等价于 \x0b 和 \cK。</td>
</tr>
</table>
2.3 特殊字符

许多元字符要求在试图匹配它们时特别对待。若要匹配这些特殊字符，必须首先使字符"转义"，即反斜杠字符`\`放在它们前面。
<table class="reference">
<tr>
	<th width="20%">特别字符</th>
	<th width="80%">描述</th>
</tr>
<tr>
	<td>$</td>
    <td>匹配输入字符串的结尾位置。如果设置了 RegExp 对象的 Multiline 属性，则 $ 也匹配 '\n' 或 '\r'。要匹配 $ 字符本身，请使用 \$。</td>
</tr>
<tr>
	<td>( )</td>
    <td>标记一个子表达式的开始和结束位置。子表达式可以获取供以后使用。要匹配这些字符，请使用 \( 和 \)。</td>
</tr>
<tr>
	<td>*</td>
    <td>匹配前面的子表达式零次或多次。要匹配 * 字符，请使用 \*。</td>
</tr>
<tr>
	<td>+</td>
    <td>匹配前面的子表达式一次或多次。要匹配 + 字符，请使用 \+。</td>
</tr>
<tr>
	<td>.</td>
    <td>匹配除换行符 \n 之外的任何单字符。要匹配 . ，请使用 \. 。</td>
</tr>
<tr>
	<td>[</td>
    <td>标记一个中括号表达式的开始。要匹配 [，请使用 \[。</td>
</tr>
<tr>
	<td>?</td>
    <td>匹配前面的子表达式零次或一次，或指明一个非贪婪限定符。要匹配 ? 字符，请使用 \?。</td>
</tr>
<tr>
	<td>\</td>
    <td>将下一个字符标记为或特殊字符、或原义字符、或向后引用、或八进制转义符。例如， 'n' 匹配字符 'n'。'\n' 匹配换行符。序列 '\\' 匹配 "\"，而 '\(' 则匹配 "("。</td>
</tr>
<tr>
	<td>^</td>
    <td>匹配输入字符串的开始位置，除非在方括号表达式中使用，当该符号在方括号表达式中使用时，表示不接受该方括号表达式中的字符集合。要匹配 ^ 字符本身，请使用 \^。</td>
</tr>
<tr>
	<td>{</td>
    <td>标记限定符表达式的开始。要匹配 {，请使用 \{。</td>
</tr>
<tr>
	<td>|</td>
    <td>指明两项之间的一个选择。要匹配 |，请使用 \|。</td>
</tr>
</table>
2.4 限定符

限定符用来指定正则表达式的一个给定组件必须要出现多少次才能满足匹配。有 `*` 或 `+` 或 `?` 或 `{n}` 或 `{n,}` 或 `{n,m}` 共6种。
<table class="reference">
<tr>
	<th width="20%">字符</th>
	<th width="80%">描述</th>
</tr>
<tr>
	<td>*</td>
    <td>匹配前面的子表达式零次或多次。例如，zo* 能匹配 "z" 以及 "zoo"。* 等价于{0,}。</td>
</tr>
<tr>
	<td>+</td>
    <td>匹配前面的子表达式一次或多次。例如，'zo+' 能匹配 "zo" 以及 "zoo"，但不能匹配 "z"。+ 等价于 {1,}。</td>
</tr>
<tr>
	<td>?</td>
    <td>匹配前面的子表达式零次或一次。例如，"do(es)?" 可以匹配 "do" 、 "does" 中的 "does" 、 "doxy" 中的 "do" 。? 等价于 {0,1}。</td>
</tr>
<tr>
	<td>{n}</td>
    <td>n 是一个非负整数。匹配确定的 n 次。例如，'o{2}' 不能匹配 "Bob" 中的 'o'，但是能匹配 "food" 中的两个 o。</td>
</tr>
<tr>
	<td>{n,}</td>
    <td>n 是一个非负整数。至少匹配n 次。例如，'o{2,}' 不能匹配 "Bob" 中的 'o'，但能匹配 "foooood" 中的所有 o。'o{1,}' 等价于 'o+'。'o{0,}' 则等价于 'o*'。</td>
</tr>
<tr>
	<td>{n,m}</td>
    <td>m 和 n 均为非负整数，其中n &lt;= m。最少匹配 n 次且最多匹配 m 次。例如，"o{1,3}" 将匹配 "fooooood" 中的前三个 o。'o{0,1}' 等价于 'o?'。请注意在逗号和两个数之间不能有空格。</td>
</tr>
</table>
2.5 定位符

定位符用来描述字符串或单词的边界，`^` 和 `$` 分别指字符串的开始与结束，`\b` 描述单词的前或后边界，`\B` 表示非单词边界。
<table class="reference">
<tr>
	<th width="20%">字符</th>
	<th width="80%">描述</th>
</tr>
<tr>
	<td>^</td>
    <td>匹配输入字符串开始的位置。如果设置了 RegExp 对象的 Multiline 属性，^ 还会与 \n 或 \r 之后的位置匹配。</td>
</tr>
<tr>
	<td>$</td>
    <td>匹配输入字符串结尾的位置。如果设置了 RegExp 对象的 Multiline 属性，$ 还会与 \n 或 \r 之前的位置匹配。</td>
</tr>
<tr>
	<td>\b</td>
    <td>匹配一个单词边界，即字与空格间的位置。</td>
</tr>
<tr>
	<td>\B</td>
    <td>非单词边界匹配。</td>
</tr>
</table>
2.6 选择与反向引用

- 选择
用圆括号将所有选择项括起来，相邻的选择项之间用|分隔。但用圆括号会有一个副作用，使相关的匹配会被缓存，此时可用?:放在第一个选项前来消除这种副作用。
其中 `?:` 是非捕获元之一，还有两个非捕获元是 `?=` 和 `?!`，这两个还有更多的含义，前者为正向预查，在任何开始匹配圆括号内的正则表达式模式的位置来匹配搜索字符串，后者为负向预查，在任何开始不匹配该正则表达式模式的位置来匹配搜索字符串。
- 反向引用
对一个正则表达式模式或部分模式两边添加圆括号将导致相关匹配存储到一个临时缓冲区中，所捕获的每个子匹配都按照在正则表达式模式中从左到右出现的顺序存储。缓冲区编号从 1 开始，最多可存储 99 个捕获的子表达式。每个缓冲区都可以使用 \n 访问，其中 n 为一个标识特定缓冲区的一位或两位十进制数。
可以使用非捕获元字符 ?:、?= 或 ?! 来重写捕获，忽略对相关匹配的保存。

**实例 - 查找重复的单词**：
```javascript
var str = "Is is the cost of of gasoline going up up";
var patt1 = /\b([a-z]+) \1\b/ig;
document.write(str.match(patt1));
```
运行结果：Is is,of of,up up

**实例 - 输出所有匹配的数据**：
```javascript
var str = "http://www.onesite.com:80/html/page-01.html";
var patt1 = /(\w+):\/\/([^/:]+)(:\d*)?([^# ]*)/;
arr = str.match(patt1);
for (var i = 0; i < arr.length ; i++) {
    document.write(arr[i]);
    document.write("<br>");
}
```
将正则表达式应用到上面的 URI，各子匹配项包含下面的内容：
第一个括号子表达式包含 http
第二个括号子表达式包含 www.onesite.com
第三个括号子表达式包含 :80
第四个括号子表达式包含 /html/page-01.html

2.7 预定义字符/元字符

<table class="reference notranslate">
<tr>
	<th width="20%">字符</th>
	<th width="80%">描述</th>
</tr>
<tr>
	<td>\</td>
    <td><p>将下一个字符标记为一个特殊字符、或一个原义字符、或一个 向后引用、或一个八进制转义符。例如，'n' 匹配字符 "n"。'\n' 匹配一个换行符。序列 '\\' 匹配 "\" 而 "\(" 则匹配 "("。</p></td>
</tr>
<tr>
	<td>^</td>
    <td><p>匹配输入字符串的开始位置。如果设置了 RegExp 对象的 Multiline 属性，^ 也匹配 '\n' 或 '\r' 之后的位置。</p></td>
</tr>
<tr>
	<td>$</td>
    <td><p>匹配输入字符串的结束位置。如果设置了RegExp 对象的 Multiline 属性，$ 也匹配 '\n' 或 '\r' 之前的位置。</p></td>
</tr>
<tr>
	<td>*</td>
    <td><p>匹配前面的子表达式零次或多次。例如，zo* 能匹配 "z" 以及 "zoo"。* 等价于{0,}。</p></td>
</tr>
<tr>
	<td>+</td>
    <td><p>匹配前面的子表达式一次或多次。例如，'zo+' 能匹配 "zo" 以及 "zoo"，但不能匹配 "z"。+ 等价于 {1,}。</p></td>
</tr>
<tr>
	<td>?</td>
    <td><p>匹配前面的子表达式零次或一次。例如，"do(es)?" 可以匹配 "do" 或 "does" 。? 等价于 {0,1}。</p></td>
</tr>
<tr>
	<td>{n}</td>
    <td><p>n 是一个非负整数。匹配确定的 n 次。例如，'o{2}' 不能匹配 "Bob" 中的 'o'，但是能匹配 "food" 中的两个 o。</p></td>
</tr>
<tr>
	<td>{n,}</td>
    <td><p>n 是一个非负整数。至少匹配n 次。例如，'o{2,}' 不能匹配 "Bob" 中的 'o'，但能匹配 "foooood" 中的所有 o。'o{1,}' 等价于 'o+'。'o{0,}' 则等价于 'o*'。</p></td>
</tr>
<tr>
	<td>{n,m}</td>
    <td><p>m 和 n 均为非负整数，其中n &lt;= m。最少匹配 n 次且最多匹配 m 次。例如，"o{1,3}" 将匹配 "fooooood" 中的前三个 o。'o{0,1}' 等价于 'o?'。请注意在逗号和两个数之间不能有空格。</p></td>
</tr>
<tr>
	<td>?</td>
    <td><p>当该字符紧跟在任何一个其他限制符 (*, +, ?, {n}, {n,}, {n,m}) 后面时，匹配模式是非贪婪的。非贪婪模式尽可能少的匹配所搜索的字符串，而默认的贪婪模式则尽可能多的匹配所搜索的字符串。例如，对于字符串 "oooo"，'o+?' 将匹配单个 "o"，而 'o+' 将匹配所有 'o'。</p></td>
</tr>
<tr>
	<td>.</td>
    <td><p>匹配除换行符（\n、\r）之外的任何单个字符。要匹配包括 '\n' 在内的任何字符，请使用像"<strong>(.|\n)</strong>"的模式。</p></td>
</tr>
<tr>
	<td>(pattern)</td>
    <td><p>匹配 pattern 并获取这一匹配。所获取的匹配可以从产生的 Matches 集合得到，在VBScript 中使用 SubMatches 集合，在JScript 中则使用 $0…$9 属性。要匹配圆括号字符，请使用 '\(' 或 '\)'。</p></td>
</tr>
<tr>
	<td>(?:pattern)</td>
    <td><p>匹配 pattern 但不获取匹配结果，也就是说这是一个非获取匹配，不进行存储供以后使用。这在使用 "或" 字符 (|) 来组合一个模式的各个部分是很有用。例如， 'industr(?:y|ies) 就是一个比 'industry|industries' 更简略的表达式。</p></td>
</tr>
<tr>
	<td>(?=pattern)</td>
    <td><p>正向肯定预查（look ahead positive assert），在任何匹配pattern的字符串开始处匹配查找字符串。这是一个非获取匹配，也就是说，该匹配不需要获取供以后使用。例如，"Windows(?=95|98|NT|2000)"能匹配"Windows2000"中的"Windows"，但不能匹配"Windows3.1"中的"Windows"。预查不消耗字符，也就是说，在一个匹配发生后，在最后一次匹配之后立即开始下一次匹配的搜索，而不是从包含预查的字符之后开始。</p></td>
</tr>
<tr>
	<td>(?!pattern)</td>
    <td><p>正向否定预查(negative assert)，在任何不匹配pattern的字符串开始处匹配查找字符串。这是一个非获取匹配，也就是说，该匹配不需要获取供以后使用。例如"Windows(?!95|98|NT|2000)"能匹配"Windows3.1"中的"Windows"，但不能匹配"Windows2000"中的"Windows"。预查不消耗字符，也就是说，在一个匹配发生后，在最后一次匹配之后立即开始下一次匹配的搜索，而不是从包含预查的字符之后开始。</p></td>
</tr>
<tr>
<td>(?&lt;=pattern)</td>
<td>反向(look behind)肯定预查，与正向肯定预查类似，只是方向相反。例如，"<code>(?&lt;=95|98|NT|2000)Windows</code>"能匹配"<code>2000Windows</code>"中的"<code>Windows</code>"，但不能匹配"<code>3.1Windows</code>"中的"<code>Windows</code>"。</td>
</tr>
<tr>
<td>(?&lt;!pattern)</td>
<td>反向否定预查，与正向否定预查类似，只是方向相反。例如"<code>(?&lt;!95|98|NT|2000)Windows</code>"能匹配"<code>3.1Windows</code>"中的"<code>Windows</code>"，但不能匹配"<code>2000Windows</code>"中的"<code>Windows</code>"。</td>
</tr>
<tr>
	<td>x|y</td>
    <td><p>匹配 x 或 y。例如，'z|food' 能匹配 "z" 或 "food"。'(z|f)ood' 则匹配 "zood" 或 "food"。</p></td>
</tr>
<tr>
	<td>[xyz]</td>
    <td><p>字符集合。匹配所包含的任意一个字符。例如， '[abc]' 可以匹配 "plain" 中的 'a'。</p></td>
</tr>
<tr>
	<td>[^xyz]</td>
    <td><p>负值字符集合。匹配未包含的任意字符。例如， '[^abc]' 可以匹配 "plain" 中的'p'、'l'、'i'、'n'。</p></td>
</tr>
<tr>
	<td>[a-z]</td>
    <td><p>字符范围。匹配指定范围内的任意字符。例如，'[a-z]' 可以匹配 'a' 到 'z' 范围内的任意小写字母字符。</p></td>
</tr>
<tr>
	<td>[^a-z]</td>
    <td><p>负值字符范围。匹配任何不在指定范围内的任意字符。例如，'[^a-z]' 可以匹配任何不在 'a' 到 'z' 范围内的任意字符。</p></td>
</tr>
<tr>
	<td>\b</td>
    <td><p>匹配一个单词边界，也就是指单词和空格间的位置。例如， 'er\b' 可以匹配"never" 中的 'er'，但不能匹配 "verb" 中的 'er'。</p></td>
</tr>
<tr>
	<td>\B</td>
    <td><p>匹配非单词边界。'er\B' 能匹配 "verb" 中的 'er'，但不能匹配 "never" 中的 'er'。</p></td>
</tr>
<tr>
	<td>\cx</td>
    <td><p>匹配由 x 指明的控制字符。例如， \cM 匹配一个 Control-M 或回车符。x 的值必须为 A-Z 或 a-z 之一。否则，将 c 视为一个原义的 'c' 字符。</p></td>
</tr>
<tr>
	<td>\d</td>
    <td><p>匹配一个数字字符。等价于 [0-9]。</p></td>
</tr>
<tr>
	<td>\D</td>
    <td><p>匹配一个非数字字符。等价于 [^0-9]。</p></td>
</tr>
<tr>
	<td>\f</td>
    <td><p>匹配一个换页符。等价于 \x0c 和 \cL。</p></td>
</tr>
<tr>
	<td>\n</td>
    <td><p>匹配一个换行符。等价于 \x0a 和 \cJ。</p></td>
</tr>
<tr>
	<td>\r</td>
    <td><p>匹配一个回车符。等价于 \x0d 和 \cM。</p></td>
</tr>
<tr>
	<td>\s</td>
    <td><p>匹配任何空白字符，包括空格、制表符、换页符等等。等价于 [ \f\n\r\t\v]。</p></td>
</tr>
<tr>
	<td>\S</td>
    <td><p>匹配任何非空白字符。等价于 [^ \f\n\r\t\v]。</p></td>
</tr>
<tr>
	<td>\t</td>
    <td><p>匹配一个制表符。等价于 \x09 和 \cI。</p></td>
</tr>
<tr>
	<td>\v</td>
    <td><p>匹配一个垂直制表符。等价于 \x0b 和 \cK。</p></td>
</tr>
<tr>
	<td>\w</td>
    <td><p>匹配字母、数字、下划线。等价于'[A-Za-z0-9_]'。</p></td>
</tr>
<tr>
	<td>\W</td>
    <td><p>匹配非字母、数字、下划线。等价于 '[^A-Za-z0-9_]'。</p></td>
</tr>
<tr>
	<td>\xn</td>
    <td><p>匹配 n，其中 n 为十六进制转义值。十六进制转义值必须为确定的两个数字长。例如，'\x41' 匹配 "A"。'\x041' 则等价于 '\x04' & "1"。正则表达式中可以使用 ASCII 编码。</p></td>
</tr>
<tr>
	<td>\num</td>
    <td><p>匹配 num，其中 num 是一个正整数。对所获取的匹配的引用。例如，'(.)\1' 匹配两个连续的相同字符。</p></td>
</tr>
<tr>
	<td>\n</td>
    <td><p>标识一个八进制转义值或一个向后引用。如果 \n 之前至少 n 个获取的子表达式，则 n 为向后引用。否则，如果 n 为八进制数字 (0-7)，则 n 为一个八进制转义值。</p></td>
</tr>
<tr>
	<td>\nm</td>
    <td><p>标识一个八进制转义值或一个向后引用。如果 \nm 之前至少有 nm 个获得子表达式，则 nm 为向后引用。如果 \nm 之前至少有 n 个获取，则 n 为一个后跟文字 m 的向后引用。如果前面的条件都不满足，若 n 和 m 均为八进制数字 (0-7)，则 \nm 将匹配八进制转义值 nm。</p></td>
</tr>
<tr>
	<td>\nml</td>
    <td><p>如果 n 为八进制数字 (0-3)，且 m 和 l 均为八进制数字 (0-7)，则匹配八进制转义值 nml。</p></td>
</tr>
<tr>
	<td>\un</td>
    <td><p>匹配 n，其中 n 是一个用四个十六进制数字表示的 Unicode 字符。例如， \u00A9 匹配版权符号 (?)。</p></td>
</tr>
</table>
2.8 方括号与圆括号

`方括号 [] 是单个匹配，字符集/排除字符集/命名字符集`。
示例：
 1、`[0-3]`：表示找到这一个位置上的字符只能是 0 到 3 这四个数字，与 (abc|bcd|cde) 的作用比较类似，但圆括号可以匹配多个连续的字符，而一对方括号只能匹配单个字符。
 2、`[^0-3]`：表示找到这一个位置上的字符只能是除了 0 到 3 之外的所有字符。

`圆括号 () 是组，主要应用在限制多选结构的范围/分组/捕获文本/环视/特殊模式处理`。
示例：
 1、`(abc|bcd|cde)`：表示这一段是abc、bcd、cde三者之一均可，顺序也必须一致。
 2、`(abc)?`：表示这一组要么一起出现，要么不出现，出现则按此组内的顺序出现。
 3、`(?:abc)`：表示找到这样abc这样一组，但不记录，不保存到$变量中，否则可以通过$x取第几个括号所匹配到的项，比如：(aaa)(bbb)(ccc)(?:ddd)(eee)，可以用 $1 获取 (aaa) 匹配到的内容，而 $3 则获取到了 (ccc) 匹配到的内容，而 $4 则获取的是由 (eee) 匹配到的内容，因为前一对括号没有保存变量。
 4、`a(?=bbb)`：顺序环视 表示 a 后面必须紧跟 3 个连续的 b。
 5、`(?i:xxxx)`：不区分大小写 (?s:.*) 跨行匹配.可以匹配回车符。

`() 和 [] 有本质的区别`
() 内的内容表示的是一个子表达式，() 本身不匹配任何东西，也不限制匹配任何东西，只是把括号内的内容作为同一个表达式来处理，例如 (ab){1,3}，就表示 ab 一起连续出现最少 1 次，最多 3 次。如果没有括号的话，ab{1,3} 就表示 a，后面紧跟的 b 出现最少 1 次，最多 3 次。另外，括号在匹配模式中也很重要。
[] 表示匹配的字符在 [] 中，并且只能出现一次，并且特殊字符写在 [] 会被当成普通字符来匹配。例如 [(a)]，会匹配 (、a、)、这三个字符。

