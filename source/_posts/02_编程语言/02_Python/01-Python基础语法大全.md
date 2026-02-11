---
title: 01-Python基础语法大全
date: 2017-9-9 22:20:17
tags:
- Python
- 语法
categories: 
- 02_编程语言
- 02_Python
---

**python学习笔记**：小甲鱼python全套视频  +  python基础教程 第2版修订版（书附10个大型案例）

**python学习环境**：python3, win10下python3.5.4的IDLE  +  ubuntu下python3辅助

**python分享范围**：适合有C/C++/JAVA任意语言之一为基础，不适合纯新手入门

**python语言优势**：至今还没有一门编程语言，开发速度比Python快，运行速度比C快

python常用工具手册：

http://bbs.fishc.com/forum.php?mod=collection&action=view&ctid=198

### 00. python背景与特点
Python语言起源
在1989年末，Guido van Rossum为了打发圣诞节的无聊，创造了python(大蟒蛇)。 1991年，第一个 Python 版本诞生。最新版本是Python3 3.6.2 。Guido van Rossum 是蒙提·派森的飞行马戏团（Monty Python‘s Flying Circus）的爱好者。logo是由两只蟒蛇的图形组成。


官网下载地址：
https://www.python.org/downloads/


Python 3 与 Python 2 不完全兼容
官方表示对 Python2 支持到2020年， Python2 2.7.13。Python 2 的生态库远远大于 Python 3。


简单：
学习曲线平滑， 45分钟学会基本使用，使用简单。
跨平台：
一次编写、到处运行。 Windows， Linux， Mac， Android
功能强大：
  动态类型、自动内存管理
  非常实用的内置对象类型
  强大的内置工具和标准库
  易于扩展，很多成熟易用第三方库
  大型程序支持
应用广泛：
  数据库、网络、图形图像、科学计算、机器学习、web开发、操作系统扩展等
缺点：
运行速度不够快(硬件的发展可以为此弥补不足)
开发速度与运行速度之间的矛盾：
至今还没有一门编程语言，开发速度比Python快，运行速度比C快
知名软件包：Django/Numpy/Pandas/Matplotlib/PIL (Pillow)/PyQt5/Tensorflow/Scipy/Theano/NLTK
知名项目：(网站)豆瓣/知乎/美团/Gmail/Youtube/Instagram/Calibre/……


### 01. 第一次亲密接触 first love
(1) win下的python IDLE集成开发环境自动缩进，table键补齐变量名
(2) linux下使用vi编辑.py的python文件，需要声明 #!/usr/bin/python3
(3) python使用等量(1个tab)的缩进来严格对齐表示作用域

``` python
#!/usr/bin/python3
#guess game


print ("   -游戏开始  -- - ")
temp = input ("输入一个我现在想的数字：")
guess = int (temp)
if guess == 8:
print ("猜对了！！！")
else:
print ("哈哈，猜错了。。")
print ("游戏结束喽~")
#-- -end-- -


BIF == Built-in functions(内置函数)
>>> dir(__builtins__)
..., 'input', ...
>>> help(input)
#可以查询内置函数的说明和用法，类似于C语言的man手册
```


### 02. 变量 variable
(1) python没有"变量"只有"名字"
(2) 变量使用之前，需要对其先赋值
(3) 变量名命名同C的规则，不能以数字开头，保证可读性命名即可
(4) 大小写敏感，区分
(5) =左右依次为左值和右值
(6) 十六进制，以0x 或 0X 开头 ，数字由"0"到"9" 或者 "a"到"f" 或者 "A"到"F"组成
八进制，0o或0O 开头，数字由"0" 到 "7"组成
二进制，0b或0B 开头表示，数字由"0" 或者"1"组成
十进制由数字"0"到"9"组成，并且不能以0开头

``` python
>>> teacher = 'jiangyuan'
>>> print (teacher)
jiangyuan
>>> teacher = 'somebody'
>>> print (teacher)
somebody
>>> first = 3
>>> second = 8
>>> third = first + second
>>> print (third)
11
>>> myteacher = 'jiangyuan'
>>> yourteacher = 'somebody'
>>> ourteacher = myteacher + yourteacher
>>> print (ourteacher)
jiangyuansomebody
```


### 03. 运算符及优先级 precedence of operator
#符合数学运算优先原则，括号最优先，最安全。
lambda lambda表达式
or 布尔或
and 布尔与
not 布尔非
in 和 not in 成员是否属于测试
is 和 is not 对象是否是同一个
>  >=  <  <=  ==  != 比较操作符
| 按位或
^ 按位异或
& 按位与
<< 和 >> 移位
+ 和 - 加法和减法
* 和 / 和 % 乘法、除法、取余
+x 和 -x 正负号
~x 按位翻转
** 指数(幂运算)
// 地板除法，舍弃小数部分
-- -python运算符优先级(图)-- -

``` python
#=连续赋值，自右向左，同C语言
>>> a = b = c = d = 10
>>> print (a, b, c, d)
10 10 10 10
>>> a += 1
>>> b -= 1
>>> c *= 10
>>> d /= 8 #真除法，精确值
>>> print (a, b, c, d)
11 9 100 1.25
>>> d = 10
>>> d // 3  #地板除法(Floor)舍弃小数部分
3
>>> 3 < 4 < 5  #支持连续判断，不建议这样用，可读性不高
True
>>> 3 < 4 and 4 < 5
True
```


### 04. 类型 type
数值类型：整型(int)、浮点型(float)、布尔类型(bool)、e记法(科学计数法,属于float)
(1) 整型与浮点型的区别就是是否含有小数点'.'
(2) bool类型的值是以大写开头的两个单词: True / False
(3) 纯数字的字符串可以使用int转为数字，进而参与计算，相当于C的atoi，非纯数字的不能使用int转换为数字
(4) float类型转换为int类型时，会丢弃小数部分
(5) str类型均可被其他类型转换，即变成字符串无障碍
(6) type (value) 返回变量类型，isinstance(value, type)类型判断返回bool值


``` python
#float→int，丢弃小数部分
>>> a = 5.99
>>> b = int (a)
>>> print (b)
5


#e记法示例
>>> 0.00000000000000111
1.11e-15
>>> 150000000000
150000000000
>>> 15e10
150000000000.0


#isinstance类型判断
>>> isinstance ('hello', str)
True
>>> isinstance (520, str)
False
>>> isinstance (520, int)
True
```

### 05. 条件分支与循环 condition and loop
条件bool值： True  False
False 的值： False  None  0  ""  ()  []  {}


``` python
if-else
if condition:
#condition == True, 执行的操作，可多层嵌套
else:
#condition == False, 执行的操作，可多层嵌套


if-elif-else
if condition:
#condition == True, 执行的操作，可多层嵌套
elif condition:
#condition == True, 执行的操作，可多层嵌套
else:
#condition == False, 执行的操作，可多层嵌套


x if condition else y  #三元操作符
举例：
>>> x, y = 4, 5
>>> small = x if x < y else y
>>> print (small)
4
```

assert 断言
当assert关键字后面的条件为假的时候，程序自动崩溃并抛出AssertionError异常。

```python
>>> assert 3 > 4
Traceback (most recent call last):
 File "<pyshell#160>", line 1, in <module>
  assert 3 > 4
AssertionError
>>> assert 3 < 4
```


while 循环
while condition:

``` python
#condition == true, 执行的循环体操作
#condition == false, 循环体外的操作
```


for 循环
for target in expression:
循环体
示例：

``` python
>>> favourite = 'string'
>>> for i in favourite:
print (i, end=' ')  #end以空格隔开
s t r i n g
```


range()函数
range ([start], [stop], [step])  #step默认每次递增1，且range的取值范围到stop-1
常与for循环一起使用。
示例：

``` python
>>> for i in range (2, 5):
print (i, end=' ')
2 3 4
>>> for i in range (1, 10, 2):
print (i, end=' ')
1 3 5 7 9
```


break 和 continue
同C语言的break和continue，依次为跳出循环和跳过当前循环。


pass 和 del 和 exec
pass 什么也不敢，暂时预留
del 删除不再使用的对象
exec 执行python语句
exal 计算python表达式，并返回结果值


### 06. 列表 list
普通列表：member = ['name', 'id', 'age', 'weight']
混合列表：mix = [1, 'name', 3.14, [1, 2, 3]]
空列表：empty = []
列表常用方法: len()/max()/min()/append()/extend()/insert()/remove()/pop()/count()/index()/reverse()/sort()


len()
功能：列表长度(元素个数)
len(listname)

``` python
>>> len(member)
4
```


append()
功能：向列表添加单个元素
listname.append(element)

``` python
>>> member.append('class')
>>> member
['name', 'id', 'age', 'weight', 'class']
```

extend()
功能：使用子列表扩展列表
listname.extend([element1, element2, ...])

``` python
>>> member.extend (['str1', 'str2'])
>>> member
['name', 'id', 'age', 'weight', 'class', 'str1', 'str2']
```

insert()
功能：向列表指定位置插入元素
listname.insert(position, element)

``` python
#list和数组一样，下标/索引均从0开始
>>> member.insert (1, 'new_elem')
>>> member
['name', 'new_elem', 'id', 'age', 'weight', 'class', 'str1', 'str2']
```

列表元素访问
listname[index]

``` python
#index从0开始，到index-1位置的索引访问
```

列表元素删除
listname.remove(element) #删除元素element

``` python
del listname[index] #删除index位置的元素
listname.pop() #删除最后一个元素，相当于C语言的弹栈
listname.pop(index) #删除index位置指定的元素
```

列表元素分片
listname[start_index:stop_index]
(1) 分片不会修改原列表的值，输出的是一份拷贝
(2) 分片输出的是从 start_index 到 stop_index-1 位置的值
(3) 分片的start和stop位置均可省略，start省略表示从头取值，stop省略表示取值到结尾，都省略表示取列表所有的值
示例：

``` python
>>> member = ['name', 'id', 'age', 'weight', 'class', 'str1', 'str2', 'str3']
        0    1   2    3     4     5    6    7
>>> member[1:3]
['id', 'age']
>>> member[1:]
['id', 'age', 'weight', 'class', 'str1', 'str2', 'str3']
>>> member[:3]
['name', 'id', 'age']
>>> member[:]
['name', 'id', 'age', 'weight', 'class', 'str1', 'str2', 'str3']
>>> member[5:len(member)] #访问最后3个元素
['str1', 'str2', 'str3']
>>> member[0:len(member):2] #最后的2代表步长
['name', 'age', 'class', 'str2']
```


列表常用操作符
(1) list元素的判断只会判断第一个元素，然后理解返回bool结果
(2) list支持比较、逻辑、连接(+)、重复(* )、成员关系(in)操作符
(3) list赋值list时需要注意加上[:]，左值会表现为一份拷贝
示例：
list2 = list1[:]#list2是list1的一份拷贝
list3 = list1 #list3是list1的一个引用(list1被修改,list3也会跟着被修改)
(4) dir(list) 查看list支持的所有方法：
listname.count(element)#element元素出现的次数
listname.index(element, [range_s], [rang_t])#查找元素在起止范围里第一次出现的下标位置
listname.reverse()#将list中的元素原地翻转
listname.sort()#将list中的元素进行排序，默认从小到大(修改原list内容)
listname.sort(reverse=True)#排序元素，实现从大到小(修改原list内容)


### 07. 元组 tuple
元组和列表使用上相似：
(1) 最大区别：列表可以任意修改和插入等操作，元组是不可改变的
(2) 创建：列表使用[]，元组使用()
元组只有1个元素时使用(element,)注意逗号
()可以省略，但是,逗号不能省略
(3) 访问：都使用name[index]来访问
(4) 元组在映射中当做键使用，而列表不行
示例：

``` python
>>> temp = 1,
>>> type (temp)
<class 'tuple'>
>>> 8 * (8)
64
>>> 8 * (8,)
(8, 8, 8, 8, 8, 8, 8, 8)  #重复元组
#元组元素插入
>>> temp = ('name1','name2','name3','name4')
>>> temp = temp[:2] + ('new_name',) + temp[2:]
>>> temp
('name1', 'name2', 'new_name', 'name3', 'name4')
```


### 08. 字符串  string
(1) 可以进行符号转义
(2) 单引号等同于双引号
(3) 定义字符串时使用r写在右值前面声明为原始字符串
(4) 使用三引号('''或""")可以指定多行字符串。并且字符串里可以包含单引号和双引号'''
(5) +号运算符可以连接字符串为1个字符串
(6) * 号运算符可以复制多个相同字符串
列表和元组应用于字符串，所有标准的序列操作均适用于字符串。

``` python
>>> str1 = 'hello, python!'  #字符串相当于元素是字符的元组
>>> str1 = str1[:5] + ';' + str1[5:]
>>> str1
'hello;, python!'
```


字符串常用方法: find()/join()/lower()/replace()/split()/strip()/translate()/

``` python
>>> dir(str)
...'capitalize', 'casefold', 'center', 'count', 'encode', 'endswith', 'expandtabs', 'find', 'format', 'format_map', 'index', 'isalnum', 'isalpha', 'isdecimal', 'isdigit', 'isidentifier', 'islower', 'isnumeric', 'isprintable', 'isspace', 'istitle', 'isupper', 'join', 'ljust', 'lower', 'lstrip', 'maketrans', 'partition', 'replace', 'rfind', 'rindex', 'rjust', 'rpartition', 'rsplit', 'rstrip', 'split', 'splitlines', 'startswith', 'strip', 'swapcase', 'title', 'translate', 'upper', 'zfill'...
```

【F1】可以从python的帮助文档中【索引】查找操作方法的介绍内容及举例。

``` python
capitalize() 返回新字符串，把字符串的第一个字符改为大写
casefold() 返回新字符串，把整个字符串的所有字符改为小写
center(width) 将字符串居中，并使用空格填充至长度 width 的新字符串
count(sub[, start[, end]]) 返回 sub 在字符串里边出现的次数，start 和 end 参数表示范围，可选。
encode(encoding='utf-8', errors='strict') 以 encoding 指定的编码格式对字符串进行编码。
endswith(sub[, start[, end]]) 检查字符串是否以 sub 子字符串结束，如果是返回 True，否则返回 False。start 和 end 参数表示范围，可选。
expandtabs([tabsize=8]) 把字符串中的 tab 符号（t）转换为空格，如不指定参数，默认的空格数是 tabsize=8。
find(sub[, start[, end]]) 检测 sub 是否包含在字符串中，如果有则返回索引值，否则返回 -1，start 和 end 参数表示范围，可选。
index(sub[, start[, end]]) 跟 find 方法一样，不过如果 sub 不在 string 中会产生一个异常。
isalnum() 如果字符串至少有一个字符并且所有字符都是字母或数字则返回 True，否则返回 False。
isalpha() 如果字符串至少有一个字符并且所有字符都是字母则返回 True，否则返回 False。
isdecimal() 如果字符串只包含十进制数字则返回 True，否则返回 False。
isdigit() 如果字符串只包含数字则返回 True，否则返回 False。
islower() 如果字符串中至少包含一个区分大小写的字符，并且这些字符都是小写，则返回 True，否则返回 False。
isnumeric() 如果字符串中只包含数字字符，则返回 True，否则返回 False。
isspace() 如果字符串中只包含空格，则返回 True，否则返回 False。
istitle() 如果字符串是标题化（所有的单词都是以大写开始，其余字母均小写），则返回 True，否则返回 False。
isupper() 如果字符串中至少包含一个区分大小写的字符，并且这些字符都是大写，则返回 True，否则返回 False。
join(sub) 以字符串作为分隔符，插入到 sub 中所有的字符之间。
ljust(width) 返回一个左对齐的字符串，并使用空格填充至长度为 width 的新字符串。
lower() 转换字符串中所有大写字符为小写。
lstrip() 去掉字符串左边的所有空格
partition(sub) 找到子字符串 sub，把字符串分成一个 3 元组 (pre_sub, sub, fol_sub)，如果字符串中不包含 sub 则返回 ('原字符串', '', '')
replace(old, new[, count]) 把字符串中的 old 子字符串替换成 new 子字符串，如果 count 指定，则替换不超过 count 次。
rfind(sub[, start[, end]]) 类似于 find() 方法，不过是从右边开始查找。
rindex(sub[, start[, end]]) 类似于 index() 方法，不过是从右边开始。
rjust(width) 返回一个右对齐的字符串，并使用空格填充至长度为 width 的新字符串。
rpartition(sub) 类似于 partition() 方法，不过是从右边开始查找。
rstrip() 删除字符串末尾的空格。
split(sep=None, maxsplit=-1) 不带参数默认是以空格为分隔符切片字符串，如果 maxsplit 参数有设置，则仅分隔 maxsplit 个子字符串，返回切片后的子字符串拼接的列表。
splitlines(([keepends])) 按照 'n' 分隔，返回一个包含各行作为元素的列表，如果 keepends 参数指定，则返回前 keepends 行。
startswith(prefix[, start[, end]]) 检查字符串是否以 prefix 开头，是则返回 True，否则返回 False。start 和 end 参数可以指定范围检查，可选。
strip([chars]) 删除字符串前边和后边所有的空格，chars 参数可以定制删除的字符，可选。
swapcase() 翻转字符串中的大小写。
title() 返回标题化（所有的单词都是以大写开始，其余字母均小写）的字符串。
translate(table) 根据 table 的规则（可以由 str.maketrans('a', 'b') 定制）转换字符串中的字符。
upper() 转换字符串中的所有小写字符为大写。
zfill(width) 返回长度为 width 的字符串，原字符串右对齐，前边用 0 填充。
```

字符串操作：格式化
(1) 通过format方法将位置参数传递给对应字段
(2) : 冒号表示格式化符号的开始


位置参数：{0~n}

``` python
>>> "{0} love {1},{2}.".format("I", "you", "too")
'I love you,too.'
```


关键字参数：{自定义}

``` python
>>> "{a} love {b}, {c}.".format(a="I", b="you", c="too")
'I love you, too.'
注意：位置参数和关键字参数可以同时使用，但位置参数必须在关键字参数的前面。
```

字符串格式化符号含义
%c 格式化字符及其 ASCII 码
%s 格式化字符串
%d 格式化整数
%o 格式化无符号八进制数
%x 格式化无符号十六进制数
%X 格式化无符号十六进制数（大写）
%f 格式化浮点数字，可指定小数点后的精度，默认精确到小数点后6位
%e 用科学计数法格式化浮点数
%E 作用同 %e，用科学计数法格式化浮点数
%g 根据值的大小决定使用 %f 或 %e
%G 作用同 %g，根据值的大小决定使用 %f 或者 %E
举例：

``` python
>>> '%c' % 97 # 此处 % 为占位符，同C语言中printf函数中的%
'a'
>>> '%c %c %c' % (97, 98, 99) #此处的元组()小括号不能省略
'a b c'
```


格式化操作符辅助命令
m.n m 是显示的最小总宽度，n 是小数点后的位数
- 用于左对齐
+ 在正数前面显示加号（+）
# 在八进制数前面显示 '0o'，在十六进制数前面显示 '0x' 或 '0X'
0 显示的数字前面填充 '0' 取代空格
举例：

``` python
>>> '%5.1f' % 27.658 #m.n
' 27.7'
>>> '%-10d' % 5 #填充的位数都是空格
'5      '
>>> '%#x' % 160 #对应进制显示方式
'0xa0'
>>> '%010d' % 5 #用0填充。'%-010d' % 5 负号的时候填充的只会是空格
'0000000005'
```


Python 的转义字符及其含义
' 单引号
" 双引号
a 发出系统响铃声
b 退格符
n 换行符
t 横向制表符（TAB）
v 纵向制表符
r 回车符
f 换页符
o 八进制数代表的字符
x 十六进制数代表的字符
0 表示一个空字符
 反斜杠


### 09. 序列方法 sequence method
列表、元组、字符串的共同点：
(1) 都可以通过索引得到每一个元素
(2) 默认索引值总是从0开始
(3) 可以通过分片的方法得到一个范围内的元素的集合
(4) 有很多共同的操作符(重复*、拼接+、成员关系in/not in等)
(5) 统称为序列，以下(成员函数)为序列方法


list()
list(iterable) 把一个可迭代对象转换为列表
举例：

``` python
>>> b = 'I love you.' # b也可以是元组 b = (1, 2, 3, 4, 5)
>>> b = list(b)
>>> b
['I', ' ', 'l', 'o', 'v', 'e', ' ', 'y', 'o', 'u', '.']
```

tuple()
tuple(iterable) 把一个可迭代对象转换为元组
举例：

``` python
>>> b = 'I love you.'
>>> b = tuple(b)
>>> b
('I', ' ', 'l', 'o', 'v', 'e', ' ', 'y', 'o', 'u', '.')
```

max(...) 返回集合或者序列中的最大值(要求类型一致)
min(...) 返回集合或者序列中的最小值(要求类型一致)

``` python
>>> max(iterable, * [, default=obj, key=func]) -> value
>>> max(arg1, arg2, * args, * [, key=func]) -> value
```

举例：

``` python
>>> numbers = [1, 18, 13, 0, -98, 34, 53, 76, 32]
>>> max(numbers)
76
>>> min(numbers)
-98
```


sum(...) 返回序列iterable和可选参数的总和(要求类型一致)

``` python
>>> sum(iterable, start=0, /)
```

举例：

``` python
>>> tuple1 = (3.1, 2.3, 3.4)
>>> sum(tuple1)
8.8
>>> sum(tuple1, 0.2) #0.2为可选参数，会加在一起
9.0
```


sorted(...) 返回序列的排序结果

``` python
>>> sorted(iterable, /, * , key=None, reverse=False)
```

举例：

``` python
>>> tuple1 = (3.1, 2.3, 3.4)
>>> sorted(tuple1)
[2.3, 3.1, 3.4]
```


reversed(...) 翻转一个序列的内容

``` python
>>> reversed(sequence)
```

举例：

``` python
>>> numbers = [1, 24, 5, -98, 54, 32]
>>> reversed(numbers)
<list_reverseiterator object at 0x000002C3EE5046A0>#这种格式都是：迭代器对象
>>> list(reversed(numbers)) # 将迭代器对象转换为list列表
[32, 54, -98, 5, 24, 1]
```


enumerate(...) 生成由序列组成的元组

``` python
>>> enumerate(iterable[, start])
```

举例：

``` python
>>> numbers = [1, 24, 5, -98, 54, 32]
>>> list(enumerate(numbers))
[(0, 1), (1, 24), (2, 5), (3, -98), (4, 54), (5, 32)]
```


zip(...) 返回由各个参数的序列组成的元组

``` python
>>> zip(iter1 [,iter2 [...]])
```

举例：

``` python
>>> a = [1, 2, 3, 4, 5, 6, 7, 8]
>>> b = [4, 5, 6, 7, 8]
>>> zip(a, b)
<zip object at 0x000002C3EE562948>
>>> list(zip(a, b))
[(1, 4), (2, 5), (3, 6), (4, 7), (5, 8)]
>>> for i,j in zip(a, b):  #并行迭代，同时迭代两个变量
print(str(i) + ' is ' + str(j))
1 is 4
2 is 5
3 is 6
4 is 7
5 is 8
```


### 10. 函数 function
(1) python只有函数(return)没有过程(no return)
(2) 函数返回多个值的时候，使用list列表或tuple元组进行返回
(3) 局部变量和全局变量的规则同C语言
(4) 在函数内部使用 global 修饰变量，使函数可以修改同名的全局变量
(5) 函数嵌套时，内部函数的作用域都在外部函数之内，出了外部函数就不能被调用


函数定义和调用

``` python
def function_name():
#函数体内容
function_name() #函数调用，执行函数体的内容
```


函数返回值

``` python
def function_name():
#函数体中返回
return value
print(function_name()) #调用函数并打印其返回值
```


函数参数

``` python
def function_name(param): #形参：多个参数使用,逗号隔开
#函数体使用参数param
function_name(parameter) #实参：传递实际参数
```


函数文档
举例：

``` python
>>> def my_sec_func(name):
'function document.'#函数文档部分，单引号引起来即可
print(name)
>>> my_sec_func('myname')
myname
>>> my_sec_func.__doc__  #打印输出函数文档部分
'function document.'
>>> help(my_sec_func)
Help on function my_sec_func in module __main__:
my_sec_func(name)
  function document.
```


关键字参数与默认参数
举例：

``` python
>>> def say_some(name, words):
#>> def say_some(name='abc', words='string'): #形参可设置默认值
print(name + ' -> ' + words)
>>> say_some('Jan', 'learning python.')
Jan -> learning python.
>>> say_some(words='learning python.', name='Jan') #指定形参对应实参
Jan -> learning python.
#>>> say_some()
#abc -> string
```


`*params`搜集其余的位置参数

``` python
>>> def test(*params): # *params把实参打包为元组
print('len = ', len(params))
print('second params = ', params[1])
>>> test(1, 'Jan', 3.14)
len =  3
second params =  Jan
#搜集参数param加上普通形参
>>> def test(*params, tmp):
print('len = ', len(params))
print('second params = ', params[1])
print('tmp = ', tmp)
>>> test(1, 'Jan', 3.14, tmp = 520) #注意传参需要单独指定
len =  3
second params =  Jan
tmp =  520
```


global 关键字
举例：

``` python
>>> cnt = 5
>>> def my_func():
global cnt
cnt= 10
print(cnt)
>>> my_func()
10
>>> print(cnt)
10
```


函数嵌套
举例：

``` python
>>> def func1():
print('func1 called...')
def func2():
print('func2 called...')
func2()
>>> func1() #调用func1
func1 called...
func2 called...
```


闭包closure
举例1：

``` python
>>> def funX(x):
def funY(y):
return x * y
return funY
>>> i = funX(8)
>>> i
<function funX.<locals>.funY at 0x000001EFE75E87B8>
>>> type(i)
<class 'function'>
>>> i(5)
40
>>> funX(8)(5)
40
>>> funY(5) #不可被调用，解决办法有2：list或者nonlocal
举例2 - list：
>>> def fun1():
x = [5] #对func2函数来说x是全局变量，在func2中没有定义x，是用list即可安全
def fun2():
x[0] *= x[0]
return x[0]
return fun2()
>>> fun1()
25
举例2 - nonlocal：
>>> def fun1():
x = 5
def fun2():
nonlocal x #在内部函数中声明x为非局部变量，再调用func1()也是安全的
x *= x
return x
return fun2()
>>> fun1()
25
```


lambda 表达式(匿名函数)
(1) 不需要考虑函数名的命名问题
(2) 极大简化函数编写的步骤
举例：

``` python
>>> def ds(x):
return 2*x + 1
>>> ds(5)
11
>>> lambda x : 2*x + 1
<function <lambda> at 0x000002170B3D87B8> #可以理解为返回的是C语言的函数指针
>>> g = lambda x : 2*x + 1 #赋值后，传参即可，g相当于接收了匿名函数
>>> g(5)
11
>>> g = lambda x, y : x+y #lambda匿名函数多个参数
>>> g(1, 3)
4
```


两个牛逼的BIF：filter和map
(1) filter 过滤：返回其函数为真的元素的列表

``` python
>>> filter(function or None, iterable)
```

举例：

``` python
>>> filter(None, [1, 0, False, True])
<filter object at 0x000001CE5BCB0710>
>>> list(filter(None, [1, 0, False, True]))
[1, True] #验证filter过滤的是非true的内容
>>> def odd(x):
return x % 2
>>> temp = range(10)
>>> show = filter(odd, temp)
>>> list(show)
[1, 3, 5, 7, 9]
>>> list(filter(lambda x : x % 2, range(10)))  #简化一行实现求奇数
[1, 3, 5, 7, 9]
```

(2) map 映射：对序列中每个元素都应用函数

``` python
>>> list(map(lambda x : x + 2, range(10)))
[2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
```



        -2017.08.28         -- 

### 11. 递归 recursion

``` python
#递归求阶乘：
def factorial(n):
  if n == 1:
    return 1 #(1)必须包含退出条件，同C语言
  else:
    return n * factorial(n-1) #(2)必须调用函数自身，同C语言
number = int(input("请输入一个正整数："))
result = factorial(number)
print("%d 的阶乘为：%d" % (number, result))
#运行：
请输入一个正整数：10
10 的阶乘为：3628800
```


斐波那契数列(递归)

``` python
def fab(n):
  if n < 1:
    print("input error!")
    return -1
  if n == 1 or n == 2:
    return 1
  else:
    return fab(n-1) + fab(n-2)
num = int(input("请输入一个数字："))
result = fab(num)
print("斐波那契数列结果为：%d" % result)
```


汉诺塔游戏(递归)

``` python
def hanoi(n, x, y, z):
  if n == 1:
    print(x, '-- >', z)
  else:
    hanoi(n-1, x, y, z)   #将前n-1个盘子从x移动到y上
    print(x, '-- >', z)    #将最底下的最后一个盘子从x移动到z上
    hanoi(n-1, y, x, z)   #将y上的n-1个盘子移动到z上


n = int(input('请输入汉诺塔的层数：'))
hanoi(n, 'x', 'y', 'z')
```




        -2017.08.29         -- 
### 12. 字典 dict
(1) 字典是一种映射类型（key:value 键值映射项），类型名为 dict
(2) 字典的表示使用{}大括号，元素映射之间使用:冒号，使用dictname[]访问字典映射的值
(3) 新建字典有两种方法：三层小括号，一层小括号中key=value
(4) 字典中的键值映射项是无序的，popitem时是随机弹出
(5) 字典基本操作：
len(d) 返回d中项的数量
d[k] 返回映射到键k上的值
d[k]=v 将值v映射到键k上
del d[k] 删除键为k的项
k in d 检查d中是否含有键为k的项
(6) 字典常用方法: clear()/copy()/fromkeys()/get()/has_key()/items()/iteritems()/keys()/iterkeys()/pop()/popitem()/setdefault()/update()/values()/itervalues()


映射关系示例

``` python
>>> brand = ['李宁', '耐克', '阿迪达斯', 'xx工作室']
>>> slogan = ['一切皆有可能', 'Just do it', 'Impossible is nothing', '让编程改变世界']
>>> print('鱼c工作室的口号是: ', slogan[brand.index('xx工作室')])
xx工作室的口号是:  让编程改变世界
#使用字典来完成映射工作
>>> dict1 = {'李宁':'一切皆有可能', '耐克':'Just do it', '阿迪达斯':'Impossible is nothing', 'xx工作室':'让编程改变世界'}
>>> print('xx工作室的口号是: ', dict1['xx工作室'])
xx工作室的口号是:  让编程改变世界
#新建一个字典方法1：dict(((key1, value1), (key2, value2), ...))
>>> dictname = dict((('y', 1), ('u', 2), ('a', 3), ('n', 4)))
>>> dictname
{'u': 2, 'a': 3, 'y': 1, 'n': 4}
#新建一个字典方法2：(key1=value1, key2=value2, ...)
>>> dictname = dict(苍井空='让AV改变宅男', 工作室='让编程改变世界')
>>> dictname
{'工作室': '让编程改变世界', '苍井空': '让AV改变宅男'}
>>> dictname['苍井空']
'让AV改变宅男'
#字典中新增映射元素
>>> dictname['爱迪生'] = '天才是99%的汗水+1%的灵感，但这1%的灵感比99%的汗水更重要。'
>>> dictname
{'工作室': '让编程改变世界', '爱迪生': '天才是99%的汗水+1%的灵感，但这1%的灵感比99%的汗水更重要。', '苍井空': '让AV改变宅男'}
```


字典中键、值、键值映射项的访问

``` python
>>> dict1 = dict1.fromkeys(range(10), '赞')
>>> dict1
{0: '赞', 1: '赞', 2: '赞', 3: '赞', 4: '赞', 5: '赞', 6: '赞', 7: '赞', 8: '赞', 9: '赞'}
>>> for eachKey in dict1.keys():
print(eachKey, end=' ')
0 1 2 3 4 5 6 7 8 9
>>> for eachValue in dict1.values():
print(eachValue, end=' ')
赞 赞 赞 赞 赞 赞 赞 赞 赞
>>> for eachItems in dict1.items():
print(eachItems, end=' ')
(0, '赞') (1, '赞') (2, '赞') (3, '赞') (4, '赞') (5, '赞') (6, '赞') (7, '赞') (8, '赞') (9, '赞')
```


fromkeys(...)  创建并返回一个新的字典
dictname.fromkeys(S[, V])
@S key；@V value 可选参数
举例：

``` python
>>> dict1 = {}
>>> dict1.fromkeys((1, 2, 3))
{1: None, 2: None, 3: None}
>>> dict1.fromkeys((1, 2, 3), 'number')
{1: 'number', 2: 'number', 3: 'number'}
>>> dict1.fromkeys((1, 2, 3), ('one', 'two', 'three'))
{1: ('one', 'two', 'three'), 2: ('one', 'two', 'three'), 3: ('one', 'two', 'three')}
>>> dict1.fromkeys((1, 3), 'num')
{1: 'num', 3: 'num'}  #还是返回新的字典，并不会修改dict1
```


get(...)  从字典中找到key的映射值value
举例：

``` python
>>> dict1 = dict.fromkeys(range(10), 'Yes!')
>>> dict1
{0: 'Yes!', 1: 'Yes!', 2: 'Yes!', 3: 'Yes!', 4: 'Yes!', 5: 'Yes!', 6: 'Yes!', 7: 'Yes!', 8: 'Yes!', 9: 'Yes!'}
>>> dict1.get(10)
>>> print(dict1.get(10))
None
>>> dict1.get(10, '木有')
'木有'
>>> dict1.get(9, '木有')
'Yes!'
```

setdefault(...)  类似于get但在字典里如果找不到的话会将映射项添加到字典中
dictname.setdefault(key, value)
举例：

``` python
>>> a
{3: 'three', 4: 'four'}
>>> a.setdefault(5, '小白')
'小白'
>>> a
{3: 'three', 4: 'four', 5: '小白'}
```


clear()  清空一个字典(包括使用当前字典赋值的其他字典)
举例：

``` python
>>> dict1.clear()
>>> dict1
{}
```


copy()  拷贝一个字典(浅拷贝，不受字典修改影响)

``` python
>>> a = {1:'one', 2:'two', 3:'three'}
>>> b = a.copy()
>>> c = a #相当于C的指针，C++的引用，修改字典c的值会同时影响字典a
>>> a
{1: 'one', 2: 'two', 3: 'three'}
>>> b
{1: 'one', 2: 'two', 3: 'three'}
>>> c
{1: 'one', 2: 'two', 3: 'three'}
>>> print(id(a), id(b), id(c))
2334673012680 2334672609672 2334673012680
>>> c[4] = 'four'
>>> c
{1: 'one', 2: 'two', 3: 'three', 4: 'four'}
>>> a
{1: 'one', 2: 'two', 3: 'three', 4: 'four'}
>>> b
{1: 'one', 2: 'two', 3: 'three'}
```


pop(...)  给定一个键弹出一个值
popitem()  随机弹出一个项(映射关系的键和值)
举例：

``` python
>>> a
{1: 'one', 2: 'two', 3: 'three', 4: 'four'}
>>> a.pop(2)
'two'
>>> a
{1: 'one', 3: 'three', 4: 'four'}
>>> a.popitem()
(1, 'one')
>>> a
{3: 'three', 4: 'four'}
```


update(...)  使用一个子字典去更新原字典
dictname1.update(dictname2)
举例：

``` python
>>> a
{3: 'three', 4: 'four', 5: '小白'}
>>> b = {'小白':'狗'}
>>> a.update(b)
>>> a
{'小白': '狗', 3: 'three', 4: 'four', 5: '小白'}
```


### 13. 集合 set
(1) 使用{}创建的没有映射关系的字典，成为集合类型，如num = {1, 2, 3, 4, 5}
(2) 集合中元素唯一，重复的数据会被自动清理掉
(3) 集合中元素无序，不能索引取到其元素的值
(4) 集合使用关键字 set([]) 来创建
(5) 集合支持 in 和 not in 来判断是否属于集合


举例：

``` python
>>> num = {}
>>> type(num)
<class 'dict'>
#set没有体现字典的映射
>>> num1 = {1, 2, 3, 4, 5}
>>> type(num1)
<class 'set'>
#set唯一性
>>> num2 = {1, 2, 3, 4, 2, 3, 5, 1, 5, 5}
>>> num2
{1, 2, 3, 4, 5}
#set无序性
>>> num2[2]
TypeError: 'set' object does not support indexing
#set关键字创建集合
>>> set1 = set([1, 2, 3, 4, 5, 5, 5, 3, 1])
>>> set1
{1, 2, 3, 4, 5}
#list实现set的唯一性
>>> num1 = [1, 2, 3, 4, 5, 5, 3, 1, 0]
>>> temp = []
>>> for each in num1:
if each not in temp:
temp.append(each)
>>> temp
[1, 2, 3, 4, 5, 0]
#简化: 实现set的唯一性，并且会把set的无序性变为有序
>>> num1
[1, 2, 3, 4, 5, 5, 3, 1, 0]
>>> num1 = list(set(num1))
>>> num1
[0, 1, 2, 3, 4, 5]
```


add(...)  往集合中加入元素
remove(...)  从集合中删除指定元素
举例：

``` python
>>> num2
{1, 2, 3, 4, 5}
>>> num2.add(6)
>>> num2
{1, 2, 3, 4, 5, 6}
>>> num2.remove(4)
>>> num2
{1, 2, 3, 5, 6}
```


frozenset(...)  将集合设置为不可变集合，frozen:冰冻的，冻结的
举例：

``` python
>>> num3 = frozenset([1, 2, 3, 4, 5])
>>> num3
frozenset({1, 2, 3, 4, 5})
>>> num3.add(6)
AttributeError: 'frozenset' object has no attribute 'add'
```


集合内建方法(整理出来)：
http://bbs.fishc.com/forum.php?mod=viewthread&tid=45276&extra=page%3D1%26filter%3Dtypeid%26typeid%3D403


### 14. 文件操作 file operation
open(...)  打开一个文件返回一个流对象
open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None)  #除了file参数，其他参数均有默认值
'r' 只读模式
'w' 写入(会覆盖已存在的文件)模式
'x' 文件存在，报异常的模式
'a' 写入(文件存在则追加)模式
'b' 二进制模式
't' 文本模式
'+' 可读写模式(可添加到其他模式)
'U' 通用换行符支持


举例：

``` python
#打开一个文件，注意路径的中反斜杠的转义(或用/斜杠一根即可)
>>> f = open('C:UsersJanDesktopIP.txt')
>>> f
<_io.TextIOWrapper name='C:UsersJanDesktopIP.txt' mode='r' encoding='cp936'>
```


文件对象方法
(整理)
http://bbs.fishc.com/forum.php?mod=viewthread&tid=45279&extra=page%3D1%26filter%3Dtypeid%26typeid%3D403
(1) 文件对象支持直接使用list转换读出
(2) 文件对象支持 for...in 的迭代方式读取


举例：

``` python
>>> f = open('C:UsersJanDesktopIP.txt') #f,打开的文件流对象
>>> f.read()
'【本机】nIP：192.168.31.217n[ Ctrl + r ]ncmdnping 192.168.31.207nmstscnnn【虚拟机】 - 虚拟网络编辑器（自动） - 桥接模式nIP：192.168.31.207nlinux账户：jiangyuannlinux密码：123456n'
>>> f.read()
''
>>> f.close()
>>> f = open('C:UsersJanDesktopIP.txt')
>>> f.read(5)
'【本机】n'
>>> f.tell()
10
>>> f.seek(45, 0) #0,文件起始位置；45,偏移字节数。从文件起始位置偏移一定量字节
45
>>> f.readline()
'mdn'
>>> list(f)
['ping 192.168.31.207n', 'mstscn', 'n', 'n', '【虚拟机】 - 虚拟网络编辑器（自动） - 桥接模式n', 'IP：192.168.31.207n', 'linux账户：jiangyuann', 'linux密码：123456n']
>>> for each_line in f:
print(each_line)#逐行读取文件内容的高效方法
【本机】
IP：192.168.31.217
[ Ctrl + r ]
cmd
ping 192.168.31.207
mstsc
...
#创建一个新的可写入的文件，写入内容，然后关闭文件流对象
>>> f = open('C:UsersJanDesktoptest.txt', 'w')
>>> f.write('some lines')
10
>>> f.close()
```

任务：将文件record.txt中的数据进行分割并且按照规律保存起来。



``` python
#最终代码如下：
def save_file(boy, girl, count):
  # 文件的分别保存操作
  file_name_boy = 'boy_' + str(count) + '.txt'
  file_name_girl = 'girl_' + str(count) + '.txt'


  boy_f = open(file_name_boy, 'w')
  girl_f = open(file_name_girl, 'w')


  boy_f.writelines(boy)
  girl_f.writelines(girl)


  boy_f.close()
  girl_f.close()


def split_file(filename):
  f = open(filename)


  boy = []
  girl = []
  count = 1


  for each_line in f:
    if each_line[:6] != '======':
      # 我们再这里进行字符串分割操作
      (role, line_spoken) = each_line.split('：', 1)  #中文冒号：否则会报错
      if role == '小甲鱼':
        boy.append(line_spoken)
      if role == '小客服':
        girl.append(line_spoken)
    else:
      save_file(boy, girl, count)


      boy = []
      girl = []
      count += 1


  save_file(boy, girl, count)
  f.close()


split_file('C:UsersJanDesktoppython_studyrecord.txt')
```

文件操作练习题及答案(伪代码可以保存一下)：
http://blog.csdn.net/junwei0206/article/details/44988195


        -2017.08.30         -- 
### 15. 模块 modules
(1) 模块是.py的python文件
(2) 使用模块是需要进行导入，使用关键字 import


举例：

``` python
>>> import random
>>> secret = random.randint(1, 10)
>>> secret
3
```


os 模块(系统模块)


os模块方法表格：http://bbs.fishc.com/thread-45512-1-2.html


举例：

``` python
>>> import os
>>> os.getcwd()  #输出当前工作目录
'C:UsersJanAppDataLocalProgramsPythonPython35'
>>> os.chdir('E:')  #改变工作目录
>>> os.getcwd()
'E:'
>>> os.listdir('E:')  #列举指定目录中的文件名
['$RECYCLE.BIN', '.cache', '360Downloads', 'Jan_mi', 'Jan个人总资料', 'Qiyi', 'QQMusicCache', 'qycache', 'System Volume Information', 'Youku Files', 'Youxun', '博客']  #RECYCLE.BIN是个回收站
>>> os.mkdir('E:A')  #创建单层目录，如该目录已存在抛出异常
>>> os.mkdir('E:AB')
>>> os.mkdir('E:CD')
FileNotFoundError: [WinError 3] 系统找不到指定的路径。: 'E:CD'
>>> os.remove('E:ABtest.txt')  #删除文件
>>> os.rmdir('E:AB')  #删除单层目录，如该目录非空则抛出异常
>>> os.system('cmd')  #运行系统的shell命令：windows shell窗口
-1073741510
>>> os.system('calc')  #运行系统的shell命令：calc计算器
0
>>> os.curdir  #当前目录（'.'）
'.'
>>> os.listdir(os.curdir)  # 等同于 os.listdir('.')
['$RECYCLE.BIN', '.cache', '360Downloads', 'A', 'Jan_mi', 'Jan个人总资料', 'Qiyi', 'QQMusicCache', 'qycache', 'System Volume Information', 'Youku Files', 'Youxun', '博客']
>>> os.sep  #输出操作系统特定的路径分隔符（Win下为''，Linux下为'/'）
''
>>> os.linesep  #当前平台使用的行终止符（Win下为'rn'，Linux下为'n'）
'rn'
>>> os.name  #指代当前使用的操作系统（包括：'posix',  'nt', 'mac', 'os2', 'ce', 'java'）
'nt'  #nt是windows系统平台
```


os.path 模块(系统路径模块属于os的子模块)

``` python
>>> os.path.basename('E:ABCsexy.avi')  #去掉目录路径，单独返回文件名
'sexy.avi'
>>> os.path.dirname('E:ABCsexy.avi')  #去掉文件名，单独返回目录路径
'E:ABC'
>>> os.path.join('A', 'B', 'C')  #将path1, path2...各部分组合成一个路径名
'ABC'
>>> os.path.join('D:', 'A', 'B', 'C')
'D:ABC'
>>> os.path.join('D:', 'A', 'B', 'C')  #注意盘符需要带上斜杠
'D:ABC'
>>> os.path.split('E:ASEXY.AVI')  #分割文件名与路径，返回(f_path, f_name)元组。
('E:A', 'SEXY.AVI')
>>> os.path.split('E:ABC')
('E:AB', 'C')
>>> os.path.splitext('E:ASEXY.AVI')  #分离文件名与扩展名，返回(f_name, f_extension)元组
('E:ASEXY', '.AVI')
>>> os.path.getatime('E:Atest.txt')  #返回指定文件最近的访问时间
1504103243.229383  #浮点型秒数，可用time模块的gmtime()或localtime()函数换算
>>> import time
>>> time.gmtime(os.path.getatime('E:Atest.txt'))
time.struct_time(tm_year=2017, tm_mon=8, tm_mday=30, tm_hour=14, tm_min=27, tm_sec=23, tm_wday=2, tm_yday=242, tm_isdst=0)
>>> time.localtime(os.path.getatime('E:Atest.txt'))
time.struct_time(tm_year=2017, tm_mon=8, tm_mday=30, tm_hour=22, tm_min=27, tm_sec=23, tm_wday=2, tm_yday=242, tm_isdst=0)
>>> time.localtime(os.path.getmtime('E:Atest.txt'))
time.struct_time(tm_year=2017, tm_mon=8, tm_mday=30, tm_hour=22, tm_min=30, tm_sec=1, tm_wday=2, tm_yday=242, tm_isdst=0)
>>> time.localtime(os.path.getctime('E:Atest.txt'))
time.struct_time(tm_year=2017, tm_mon=8, tm_mday=30, tm_hour=22, tm_min=27, tm_sec=23, tm_wday=2, tm_yday=242, tm_isdst=0)
>>> os.path.ismount('E:')  #判断指定路径是否存在且是一个挂载点
True
>>> os.path.ismount('E:A')
False
```


pickle 模块(泡菜模块)
举例：

``` python
>>> import pickle
>>> my_list = [123, 3.14, '名字', ['another list']]
>>> pickle_f = open('E:Amy_list.pkl', 'wb')
>>> pickle.dump(my_list, pickle_f)  #将list的内容倾倒入文件流对象中
>>> pickle_f.close()
>>> pickle_f = open('E:Amy_list.pkl', 'rb')
>>> my_list2 = pickle.load(pickle_f)  #将.pkl文件的内容装载到list中
>>> print(my_list2)
[123, 3.14, '名字', ['another list']]


>>> city = {'城市1':'000001', '城市2':'000002', '城市n':'999999'}  #此字典映射有70k这么大
>>> import pickle
>>> pickle_f = open('E:Acity.pkl', 'wb')  #将70k的字典映射写入文件
>>> pickle.dump(city, pickle_f)
>>> pickle_f.close()
>>> pickle_file = open('E:Acity.pkl', 'rb')  #使用字典的时候打开文件装载即可
>>> city = pickle.load(pickle_file)
>>> print(city)
{'城市2': '000002', '城市n': '999999', '城市1': '000001'}
```


        -2017.08.31         -- 
### 16. 异常 exception
异常汇总

``` python
AssertionError 断言语句（assert）失败<eg1>
AttributeError 尝试访问未知的对象属性<eg2>
EOFError 用户输入文件末尾标志EOF（Ctrl+d） 
FloatingPointError 浮点计算错误 
GeneratorExit generator.close()方法被调用的时候 
ImportError 导入模块失败的时候 
IndexError 索引超出序列的范围<eg3>
KeyError 字典中查找一个不存在的关键字<eg4>
KeyboardInterrupt 用户输入中断键（Ctrl+c） 
MemoryError 内存溢出（可通过删除对象释放内存） 
NameError 尝试访问一个不存在的变量 
NotImplementedError 尚未实现的方法 
OSError 操作系统产生的异常（例如打开一个不存在的文件） 
OverflowError 数值运算超出最大限制 
ReferenceError 弱引用（weak reference）试图访问一个已经被垃圾回收机制回收了的对象 
RuntimeError 一般的运行时错误 
StopIteration 迭代器没有更多的值 
SyntaxError Python的语法错误 
IndentationError 缩进错误 
TabError Tab和空格混合使用 
SystemError Python编译器系统错误 
SystemExit Python编译器进程被关闭 
TypeError 不同类型间的无效操作 
UnboundLocalError 访问一个未初始化的本地变量（NameError的子类） 
UnicodeError Unicode相关的错误（ValueError的子类） 
UnicodeEncodeError Unicode编码时的错误（UnicodeError的子类） 
UnicodeDecodeError Unicode解码时的错误（UnicodeError的子类） 
UnicodeTranslateError Unicode转换时的错误（UnicodeError的子类） 
ValueError 传入无效的参数 
ZeroDivisionError 除数为零 
```


部分举例：
``` python
>>> my_list = ['我是帅哥', '你是美女']
>>> assert len(my_list) > 0
>>> my_list.pop()
'你是美女'
>>> my_list.pop()
'我是帅哥'
>>> assert len(my_list) > 0
Traceback (most recent call last):
 File "<pyshell#856>", line 1, in <module>
  assert len(my_list) > 0
AssertionError #断言语句（assert）失败
>>> my_list.abcd
Traceback (most recent call last):
 File "<pyshell#857>", line 1, in <module>
  my_list.abcd
AttributeError: 'list' object has no attribute 'abcd'#尝试访问未知的对象属性
>>> my_list = [1, 2, 3]
>>> my_list[3]
Traceback (most recent call last):
 File "<pyshell#859>", line 1, in <module>
  my_list[3]
IndexError: list index out of range #索引超出序列的范围
>>> my_list[2]
3
>>> my_dict = {'one':1, 'two':2, 'three':3}
>>> my_dict['one']
1
>>> my_dict['four']
Traceback (most recent call last):
 File "<pyshell#863>", line 1, in <module>
  my_dict['four']
KeyError: 'four' #字典中查找一个不存在的关键字
>>> my_dict.get('four')
>>> #dict.get(...)方法比较安全合适
```


异常检测与处理
(1) try语句一旦检测出现异常，则剩下的其他代码则不会执行
(2) raise Exception_name 主动引发一个自定义异常名字的异常，可定义异常描述


try:

``` python
#检测范围
except Exception[as reason]:
#出现异常(Exception)后的处理代码
finally:
#无论如何都会被执行的代码(收尾工作)
```


举例：

``` python
try:
  f = open('我为什么是一个文件.txt')
  print(f.read())
  f.close()
except OSError:
  print('文件出错啦T_T')
运行：
文件出错啦T_T
```


``` python
try:
  f = open('我为什么是一个文件.txt')
  print(f.read())
  f.close()
except OSError as reason:
  print('文件出错啦T_Tn错误的原因是：' + str(reason))
运行：
文件出错啦T_T
错误的原因是：[Errno 2] No such file or directory: '我为什么是一个文件.txt'
```


``` python
try:
  sum = 1 + '1'
  f = open('我为什么是一个文件.txt')
  print(f.read())
  f.close()
except (OSError, TypeError):  #多个异常同时捕获
  print('出错啦T_T')
运行：出错啦T_T
```


``` python
try:
  f = open('我为什么是一个文件.txt', 'w')
  print(f.write('我存在了！'))  #没有finally时并不会写入文件
  sum = 1 + '1'
  f.close()
except (OSError, TypeError):
  print('出错啦T_T')
finally:
  f.close()
运行：
5
出错啦T_T
```


``` python
>>> raise ZeroDivisionError('除数为0的异常')
Traceback (most recent call last):
 File "<pyshell#872>", line 1, in <module>
  raise ZeroDivisionError('除数为0的异常')
ZeroDivisionError: 除数为0的异常
```

### 17. 丰富的esle-简洁的with
else


举例：while-else / for-else

``` python
def showMaxFactor(num):
  count = num // 2
  while count > 1:
    if num % count == 0:
      print('%d最大的约数是%d' % (num, count))
      break
    count -= 1
  else: #while循环完没有break就会执行else
    print('%d是素数！' % num)



num = int(input('请输入一个数：'))
showMaxFactor(num)
```

举例：try-else

``` python
try:
  print(int('123'))
except ValueError as reason:
  print('出错啦：' + str(reason))
else:
  print('Good！没有任何异常。')
运行：
123
Good！没有任何异常。
```


with as


举例：

``` python
try:
  with open('data.txt', 'w') as f: #比 f = open(...) 多了文件不使用时自动关闭功能
  for each_line in f:
    print(each_line)
except OSError as reason:
  print('出错啦：' + str(reason))
#finally:    #有了with就不需要finally去调用关闭，会自动关闭
#   f.close()  #如果文件data.txt不存在就试图去关闭一个不存在的文件
```


### 18. 图形用户界面 EasyGui
EasyGui官网：http://easygui.sourceforge.net
中文的教学文档：http://bbs.fishc.com/thread-46069-1-1.html (要看完并实操)
模块库：easygui-0.96.zip


安装方法：
(1) 使用命令窗口切换到easygui-docs-0.96的目录下
(2) 【Windows下】执行C:Python33python.exe setup.py install

``` python
> cd Desktop
> cd puthon_studyeasygui-0.96
#然后修改C:Program Files (x86)pythonpython.exe为管理员权限：右键-兼容性-更改所有用户的设置-以管理员身份运行此程序-确定
> "C:Program Files (x86)pythonpython.exe" setup.py install
#生成了文件模块库C:Program Files (x86)pythonLibsite-packageseasygui.py
> "C:Program Files (x86)pythonpython.exe" easygui.py
#easygui的演示程序
PS: 【Linux或Mac下】sudo /Library/Framworks/Python.framework/Versions/3.3/bin/python3.3 setup.py install
```


使用方法：
【遇到难题】import easygui 出错~！！！
【解决办法】
(1) 重装python IDLE勾选添加python路径，选择目录安装到C:python文件夹，如重装则忽略(2)，如此一来win-cmd下的python中sys.path和IDLE中的sys.path则一致了。
(2) 对比windows命令窗口中启动python与IDLE中python的系统路径，添加到IDLE即可。


windows中系统路径：
C:UsersJan> "C:Program Files (x86)pythonpython.exe"

``` python
>>> import sys
>>> sys.path
['', 
'C:Program Files (x86)pythonpython35.zip', 
'C:Program Files (x86)pythonDLLs', 
'C:Program Files (x86)pythonlib', 
'C:Program Files (x86)python', 
'C:Program Files (x86)pythonlibsite-packages']
```


IDLE中系统路径：

``` python
>>> import easygui as g
Traceback (most recent call last):
 File "<pyshell#0>", line 1, in <module>
  import easygui as g
ImportError: No module named 'easygui'
>>> import sys
>>> sys.path
['', 
'C:UsersJanAppDataLocalProgramsPythonPython35Libidlelib', 
'C:UsersJanAppDataLocalProgramsPythonPython35python35.zip', 
'C:UsersJanAppDataLocalProgramsPythonPython35DLLs', 
'C:UsersJanAppDataLocalProgramsPythonPython35lib', 
'C:UsersJanAppDataLocalProgramsPythonPython35', 
'C:UsersJanAppDataLocalProgramsPythonPython35libsite-packages']
>>> sys.path.append('C:Program Files (x86)pythonpython35.zip')
>>> sys.path.append('C:Program Files (x86)pythonDLLs')
>>> sys.path.append('C:Program Files (x86)pythonlib')
>>> sys.path.append('C:Program Files (x86)python')
>>> sys.path.append('C:Program Files (x86)pythonlibsite-packages')
>>> import easygui as g  #import ... as ... 导入模块的同时重定义模块名字
>>> g.msgbox('嗨，python！')
'OK'
>>> 
# No error, success... 但每次重启IDLE都需要将windows下的sys.path进行添加。
```


``` python
# 示例，gui界面文字小游戏
import easygui as g
import sys


while 1:
    g.msgbox("嗨，欢迎进入第一个界面小游戏^_^")


    msg ="请问你希望在鱼C工作室学习到什么知识呢？"
    title = "小游戏互动"
    choices = ["谈恋爱", "编程", "OOXX", "琴棋书画"]
    
    choice = g.choicebox(msg, title, choices)


    # note that we convert choice to string, in case
    # the user cancelled the choice, and we got None.
    g.msgbox("你的选择是: " + str(choice), "结果")


    msg = "你希望重新开始小游戏吗？"
    title = "请选择"
    
    if g.ccbox(msg, title):   # show a Continue/Cancel dialog
        pass  # user chose Continue
    else:
        sys.exit(0)   # user chose Cancel
```

        -2017.09.01         -- 

### 19. 类和对象 class and object
面向对象(Object Oriented)
(1) python约定类名以大写字母开头
(2) 面向对象特征：封装(信息隐蔽)、继承(子类共享父类公共内容)、多态(不同对象对同一方法响应不同的行动)


类的示例：

``` python
class Turtle:
#属性
color = 'green'
weight = 60
legs = 2
shell = True
age = 26
```


``` python
#方法
def climb(self):
print('我正在学习...')
def run(self):
print('我正在奔跑...')
```


运行：

``` python
>>> tt = Turtle()  #类Turtle的示例对象tt
>>> Turtle
<class '__main__.Turtle'>
>>> type(Turtle)
<class 'type'>
>>> type('abc')
<class 'str'>
>>> tt.climb()
我正在学习...
>>> tt.run()
我正在奔跑...
```


``` python
#封装
>>> list1 = [2, 1, 7, 5, 3]
>>> list1.sort()  #sort() 方法封装在list1对象中
>>> list1
[1, 2, 3, 5, 7]
>>> list1.append(9)  #append() 方法封装在list1对象中
>>> list1
[1, 2, 3, 5, 7, 9]
```


``` python
#继承
>>> class Mylist(list):
pass
>>> list2 = Mylist()
>>> list2.append(5)  #list2可以使用append()方法，继承了Mylist(list)中的list参数类
>>> list2.append(3)
>>> list2.append(7)
>>> list2
[5, 3, 7]
>>> list2.sort()
>>> list2
[3, 5, 7]
```


``` python
#多态
>>> class A:
def fun(self):
print('我是小A')
>>> class B:
def fun(self):
print('我是小B')
>>> a = A()
>>> b = B()
>>> a.fun()  #不同对象对同一方法响应不同的行动
我是小A
>>> b.fun()  #不同对象对同一方法响应不同的行动
我是小B
```


self
相当于C++的this指针(指向当前对象本身的地址)，表明类自身
举例：

``` python
>>> class Ball:
def setName(self, name):  #默认self的写法
self.name = name
def kick(self):  #默认self的写法
print('我叫%s, 该死的谁踢我...' % self.name)
>>> a = Ball()
>>> a.setName('球A')
>>> b = Ball()
>>> b.setName('球B')
>>> c = Ball()
>>> c.setName('土豆')
>>> a.kick()
我叫球A, 该死的谁踢我...
>>> c.kick()
我叫土豆, 该死的谁踢我...
```


魔法方法：__init__(self)
__init__(self, parma1, parma2, ...)
举例：

``` python
>>> class Ball:
def __init__(self, name):
self.name = name
def kick(self):
print('我叫%s，该死的，谁踢我！！' % self.name)
>>> b = Ball('土豆')
>>> b.kick()
我叫土豆，该死的，谁踢我！！
>>> a = Ball()  #__init__默认设置了name，所以必须传递name实参，否则报错
TypeError: __init__() missing 1 required positional argument: 'name'
```


公有和私有
name mangling 名字改变/名字重造
公有成员：默认创建的成员均为公有。
私有成员：
(1) 在变量或函数名前加上 "`_`" 两个下划线即可。
(2) python中类的私有均属于伪私有，通过"`对象._类_变量`"的形式可以访问私有成员
举例：

``` python
>>> class Person:
__name = 'yuan.jiang'
>>> p = Person()
>>> p.name
AttributeError: 'Person' object has no attribute 'name'
>>> p.__name
AttributeError: 'Person' object has no attribute '__name'
>>> class Person:
__name = 'yuan.jiang'
def getName(self):
return self.__name
>>> p = Person()
>>> p.getName()
'yuan.jiang'
>>> p._Person__name  #python中类的私有属于伪私有，此方式可访问私有成员
'yuan.jiang'
```


继承 inherit
class DerivedClassName(BaseClassName):
...
(1) 如果子类中定义于父类同名的成员时，则会自动覆盖父类对应的方法或属性
(2) 解决子类中__init()


举例：

``` python
>>> class Parent:
def hello(self):
print('正在调用父类的方法...')
>>> class Child(Parent):
pass
>>> p = Parent()
>>> p.hello()
正在调用父类的方法...
>>> c = Child()
>>> c.hello()
正在调用父类的方法...
>>> class Child(Parent):
def hello(self):
print('正在调用子类的方法...')
>>> c = Child()
>>> c.hello()
正在调用子类的方法...
>>> p.hello()
正在调用父类的方法...
```


举例：

``` python
import random as r
class Fish:
  def __init__(self):
    self.x = r.randint(0, 10)
    self.y = r.randint(0, 10)


  def move(self):
    self.x -= 1
    print('我的位置是：', self.x, self.y)


class Goldfish(Fish):
  pass
class Carpfish(Fish):
  pass
class Salmonfish(Fish):
  pass
class Sharkfish(Fish):
  def __init__(self):  #重写了__init__方法覆盖了父类的__init__子类无法调用到self.x和self.y属性成员，导致了子类无法访问到父类的属性或方法的问题
    self.hungry = True
  def eat(self):
    if self.hungry:
      print('吃货的梦想就是天天有的吃^_^')
      self.hungry = False
    else:
      print('太撑了，吃不下了！')
运行：
>>> fish = Fish()
>>> fish.move()
我的位置是： 3 0
>>> fish.move()
我的位置是： 2 0
>>> goldfish = Goldfish()
>>> goldfish.move()
我的位置是： 4 9
>>> goldfish.move()
我的位置是： 3 9
>>> shark = Sharkfish()
>>> shark.eat()
吃货的梦想就是天天有的吃^_^
>>> shark.eat()
太撑了，吃不下了！
>>> shark.move()  #无法访问到父类的__init__()方法中的x变量
AttributeError: 'Sharkfish' object has no attribute 'x'
```


        2017.09.02          


覆盖属性或方法问题优化
问题：针对子类属性或方法覆盖父类属性或方法的情况，导致子类无法访问父类中被覆盖的属性
(1) 调用未绑定的父类的方法
(2) 使用super方法(推荐)
举例：
def __init__(self):
Fish.__init__(self)  #调用未绑定的父类的方法，相当于

``` python
>>>Fish.__init__(Sharkfish)
self.hungry = True
运行：
>>> shark = Sharkfish()
>>> shark.move()
我的位置是： -1 2
>>> shark.move()
我的位置是： -2 2
```


举例：
def __init__(self):
super().__init__()  #使用super方法解决
self.hungry = True
运行：

``` python
>>> shark = Sharkfish()
>>> shark.move()
我的位置是： 8 3
>>> shark.move()
我的位置是： 7 3
```


多重继承
class DerivedClassName(Base1, Base2, Base3, ...):
...

``` python
#建议少用，有可能会导致不可预见的bug(不可预见最麻烦)
>>> class Base1:
def fool(self):
print('我是fool，我为Base1代言...')
>>> class Base2:
def fool2(self):
print('我是fool2，我为Base2代言...')
>>> class C(Base1, Base2):
pass
>>> c = C()
>>> c.fool()
我是fool，我为Base1代言...
>>> c.fool2()
我是fool2，我为Base2代言...
```


组合

``` python
class Turtle:
  def __init__(self, x):
    self.num = x
class Fish:
  def __init__(self, x):
    self.num = x
class Pool:
  def __init__(self, x, y):  #组合的方式嵌套class
    self.turtle = Turtle(x)
    self.fish  = Fish(y)
  def print_num(self):
    print('水池里总共有乌龟 %d 只，小鱼 %d 条！' % (self.turtle.num, self.fish.num))
```

运行：

``` python
>>> pool = Pool(1, 10)
>>> pool.print_num()
水池里总共有乌龟 1 只，小鱼 10 条！
```


类、类对象、示例对象
类定义   C
类对象   C
实例对象  a  b  c
举例：

``` python
>>> class C:  #C, 既是类，也是类对象
count = 0
>>> a = C()   #a，实例对象
>>> b = C()   #b，实例对象
>>> c = C()   #c，实例对象
>>> a.count
0
>>> b.count
0
>>> c.count
0
>>> c.count += 10
>>> c.count
10
>>> a.count
0
>>> b.count
0
>>> C.count   #C，作为类对象
0
>>> C.count += 100   #C，作为类对象
>>> a.count
100
>>> b.count
100
>>> c.count
10
```


(1) 当属性名与方法名冲突，会导致方法不能正常调用。
(2) 一般遵循规则：属性名用英文名词，方法名用英文动词。
(3) python严格要求方法需要有实例才能被调用，即绑定的概念。


举例：

``` python
>>> class C:
def x(self):
print('X-man!')
>>> c = C()
>>> c.x()
X-man!
>>> c.x = 1
>>> c.x
1
>>> c.x()  #方法名字被属性名字覆盖，调用出错
TypeError: 'int' object is not callable


>>> class BB:
def printBB():
print('no zuo no die.')



>>> BB.printBB()
no zuo no die.
>>> #没有self，也没有将类实例化
>>> bb = BB()
>>> bb.printBB()
Traceback (most recent call last):
 File "<pyshell#187>", line 1, in <module>
  bb.printBB()
TypeError: printBB() takes 0 positional arguments but 1 was given
>>> class CC:
def setXY(self, x, y):
self.x = x;
self.y = y



>>> class CC:
def setXY(self, x, y):
self.x = x
self.y = y
def printXY(self):
print(self.x, self.y)



>>> dd = CC()
>>> dd.__dict__
{}  #返回空的字典类型
>>> CC.__dict__
mappingproxy({'printXY': <function CC.printXY at 0x0000020483176EA0>, '__doc__': None, '__dict__': <attribute '__dict__' of 'CC' objects>, 'setXY': <function CC.setXY at 0x0000020483176E18>, '__module__': '__main__', '__weakref__': <attribute '__weakref__' of 'CC' objects>})  #使用类对象显示类的属性详情
>>> dd.setXY(4, 5)
>>> dd.__dict__
{'y': 5, 'x': 4}  #将实例对象dd使用类的属性详情实例化了
>>> # setXY(self, x, y) <==> dd.setXY(dd, x, y)
>>> del CC
>>> ee = CC()
NameError: name 'CC' is not defined
>>> dd.printXY()
4 5  #类中定义的属性是静态的，类的实例对象中也会静态存储，所以实例对象dd正常存在。
```


类与对象的内置函数
issubclass
功能：测试一个类是否是另外一个类的子类
issubclass(class, classinfo)
(1) 一个类被认为是其自身的子类
(2) classinfo可以是类对象的元组，只要class属于其中任何一个候选类的子类，则返回True
举例：

``` python
>>> class A:
pass
>>> class B(A):
pass
>>> issubclass(B, A)
True
>>> issubclass(B, B)
True
>>> issubclass(B, object)  #object是所有类的基类
True
>>> class C:
pass
>>> issubclass(B, C)
```


isinstance
功能：测试一个对象是否是一个类的实例对象
isinstance(object, classinfo)
(1) object为类的实例对象，如果不是类的实例对象，永远返回False
(2) 如果第二个参数不是类或者由类对象组成的元组，会抛出一个TypeError异常
举例：

``` python
>>> class A:
pass
>>> class B(A):
pass
>>> class C:
pass
>>> b1 = B()
>>> isinstance(b1, B)
True
>>> isinstance(b1, A)
True
>>> isinstance(b1, C)
False
>>> isinstance(b1, (A, B, C))  #b1对象是否在A/B/C里面，答案是True
True
```


hasattr
功能：测试一个对象里面是否有指定的属性
hasattr(object, name)
(1) object 对象名, name 是属性名(需要用引号引起来，否则报错)


getattr
功能：返回对象指定的属性值
getattr(object, name[, default])
(1) 如果属性值不存在打印default，没有default则抛出异常


setattr
功能：设置对象中指定属性的值，如果属性不存在则创建并赋值
setattr(object, name, value)


delattr
功能：删除对象中指定的属性，如果属性不存在则抛出异常
delattr(object, name)


举例：

``` python
>>> class C:
def __init__(self, x=0):
self.x = x
>>> c1 = C()
>>> hasattr(c1, 'x')  #测试对象属性是否存在
True
>>> hasattr(c1, x)
NameError: name 'x' is not defined
>>> getattr(c1, 'x')  #获取对象属性的值
0
>>> getattr(c1, 'y')
AttributeError: 'C' object has no attribute 'y'
>>> getattr(c1, 'y', '您所访问的属性不存在！')  #设置default默认提示语
'您所访问的属性不存在！'
>>> setattr(c1, 'y', 100)  #设置对象属性的值
>>> getattr(c1, 'y')
100
>>> delattr(c1, 'y')  #删除对象属性的值
>>> delattr(c1, 'y')
Traceback (most recent call last):
 File "<pyshell#264>", line 1, in <module>
  delattr(c1, 'y')
AttributeError: y
```


property
功能：设置一个定义好的属性，通过对象属性来设置对象属性
property(fget=None, fset=None, fdel=None, doc=None)
(1) fget获取属性的方法, fset设置属性的方法, fdel删除属性的方法
举例：

``` python
>>> class C:
def __init__(self, size=10):
self.size = size
def getSize(self):
return self.size
def setSize(self, value):
self.size = value
def delSize(self):
del self.size
x = property(getSize, setSize, delSize)
>>> c1 = C()
>>> c1.getSize()
10
>>> c1.x
10
>>> c1.x = 18
>>> c1.x
18
>>> c1.getSize()
18
>>> c1.size
18
>>> del c1.x
>>> c1.size   #x与size相当于相互引用关系，删除其中一个另一个即不能访问
AttributeError: 'C' object has no attribute 'size'
```


### 20. 魔法方法 magic methods
(1) 魔法方法总是被双下划綫包围，如 `__init__`
(2) 魔法方法是面向对象的python的一切
(3) 魔法方法的魔力体现在能够在适当的时候被调用


魔法方法汇总：http://bbs.fishc.com/forum.php?mod=viewthread&tid=48793&extra=page%3D1%26filter%3Dtypeid%26typeid%3D403


`__init__`(self[, ...])
功能：初始化类对象(根据需求决定是否增加属性参数)
返回值： None
举例：

``` python
>>> class Rectangle: #矩形类，需要长和宽，所以重写__init__
def __init__(self, x, y):
self.x = x
self.y = y
def getPeri(self):  #获得周长
return (self.x + self.y) * 2
def getArea(self):  #获得面积
return self.x * self.y
>>> rect = Rectangle(3, 4)
>>> rect.getPeri()
14
>>> rect.getArea()
12
```


`__new__`(class[, ...])
功能：创建一个类对象
返回值：返回一个对象
(1) 在__init__方法之前被调用，属于类创建时第一个被调用的方法
举例：

``` python
>>> class CapStr(str):  #继承一个不可改变的类型str
def __new__(cls, string):  #使用new将类型的功能进行转换
string = string.upper()
return str.__new__(cls, string)  #把重写后的str中的new方法带传代餐返回
>>> a = CapStr("I love M.")
>>> a
'I LOVE M.'
```


`__del__`(self)
功能：对象将要被销毁的时候，自动调用，属于自动垃圾回收方法
注意：`del x != x.__del__()`
举例：

``` python
>>> class C:
def __init__(self):
print('我是init方法，我被调用了！')
def __del__(self):
print('我是del方法，我被调用了！')
>>> c1 = C()
我是init方法，我被调用了！
>>> c2 = c1  #对象的赋值不会调用__init__
>>> c3 = c2
>>> del c3
>>> del c2
>>> del c1  #其他的赋值对象del时不会调用__del__ (c2和c3只是c1的一份拷贝)
我是del方法，我被调用了！
```


算术运算魔法方法

``` python
__add__(self, other) 加法：+
__sub__(self, other) 减法：-
__mul__(self, other) 乘法：*
__truediv__(self, other) 真除法：/
__floordiv__(self, other) 整数除法：//
__mod__(self, other) 取模算法：%
__divmod__(self, other) divmod()调用时的行为
__pow__(self, other[, modulo]) power()调用或 ** 运算时的行为
__lshift__(self, other) 按位左移：<<
__rshift__(self, other) 按位右移：>>
__and__(self, other) 按位与：&
__xor__(self, other) 按位异或：^
__or__(self, other) 按位或：|
```

举例：

``` python
>>> class New_int(int):
def __add__(self, other):
return int.__sub__(self, other)
def __sub__(self, other):
return int.__add__(self, other)
>>> a = New_int(3)
>>> b = New_int(5)
>>> a + b
-2
>>> a - b
8
>>> class Try_int(int):
def __add__(self, other):
return int(self) + int(other)
def __sub__(self, other):
return int(self) - int(other)
>>> a = Try_int(3)
>>> b = Try_int(5)
>>> a + b
8
```


类定制的计时器
(1) 定制一个计时器的类
(2) start和stop方法代表启动计时和停止计时
(3) 假设计时器对象t1，print(t1)和直接调用t1均显示结果
(4) 当计时器未启动或已经停止计时，调用stop方法会给与温馨的提示
(5) 两个计时器对象可以进行相加：t1 + t2
需要的资源：
(1) 使用time模块的localtime方法获取时间
(2) `__str__` 方法 `__repr__` 方法可用来打印文字


time 模块
详解链接：http://bbs.fishc.com/forum.php?mod=viewthread&tid=51326&extra=page%3D1%26filter%3Dtypeid%26typeid%3D403


struct_time元组
time.struct_time(tm_year=2017, tm_mon=9, tm_mday=2, tm_hour=12, tm_min=18, tm_sec=55, tm_wday=5, tm_yday=245, tm_isdst=0)


类定制计时器代码：http://blog.csdn.net/sinat_36184075/article/details/77806778


属性访问

``` python
__getattribute__(self, name) #定义当该类的属性被访问时的行为
__getattr__(self, name) #定义当用户试图获取一个不存在的属性时的行为
__setattr__(self, name, value) #定义当一个属性被设置(包括初始化)时的行为
__delattr__(self, name) #定义一个属性被删除时的行为
```

举例：

``` python
>>> class C:
def __getattribute__(self, name):
print('getattribute')
return super().__getattribute__(name)
def __getattr__(self, name):
print('getattr')
def __setattr__(self, name, value):
print('setattr')
super().__setattr__(name, value)
def __delattr__(self, name):
print('delattr')
super().__delattr__(name)
>>> c = C()
>>> c.x
getattribute
getattr
>>> c.x = 1
setattr  #初始化时自动调用setattr
>>> c.x
getattribute
1
>>> del c.x
delattr
```


举例：属性访问时的严重问题，无限递归

``` python
class Rectangle:  #矩形
  def __init__(self, width=0, height=0):  #宽高不相等，长方形
    self.width = width
    self.height = height


  def __setattr__(self, name, value):
    if name == 'square':  #宽高相等，正方形
      self.width = value
      self.height = value
    else:
      #self.name = value  #会导致类无限递归自己
      super().__setattr__(name, value)  #解决办法①：super() 推荐。
      #self.__dict__[name] = value    #解决办法②：字典
  def getArea(self):
    return self.width * self.height
```


运行：

``` python
>>> r1 = Rectangle(4, 5)
>>> r1.getArea()
20
>>> r1.square = 10  #正方形
>>> r1.width
10
>>> r1.height
10
>>> r1.getArea()
100
>>> r1.__dict__  #以字典的形式查看类中的属性和值
{'width': 10, 'height': 10}
```


        2017.09.03          
描述符 decriptor

``` python
描述符就是将某种特殊类型的类的实例指派给另一个类的属性。
__get__(self, instance, owner)  #用于访问属性，返回属性的值
__set__(self, instance, value)  #将在属性分配操作中调用，不反悔任何内容
__delete__(self, instance)   #控制删除操作，不返回任何内容
@self, 描述符类本身的类实例
@instance, 拥有者的类实例
@owner, 拥有者类本身
@value, 所赋的值
```

举例：

``` python
>>> class MyDecriptor:
def __get__(self, instance, owner):
print('getting: ', self, instance, owner)
def __set__(self, instance, value):
print('setting: ', self, instance, value)
def __delete__(self, instance):
print('deleting: ', self, instance)
>>> class Test:
x = MyDecriptor()
>>> #MyDecriptor是x的描述符类
>>> test = Test()  #实例化Test()类
>>> test.x
getting:  <__main__.MyDecriptor object at 0x000002164DC31FD0> <__main__.Test object at 0x000002164DBB6F28> <class '__main__.Test'>
>>> test
<__main__.Test object at 0x000002164DBB6F28>
>>> test.x = 'X-man'
setting:  <__main__.MyDecriptor object at 0x000002164DC31FD0> <__main__.Test object at 0x000002164DBB6F28> X-man
>>> del test.x
deleting:  <__main__.MyDecriptor object at 0x000002164DC31FD0> <__main__.Test object at 0x000002164DBB6F28>
```


自定义的描述符

``` python
>>> class MyProperty:
def __init__(self, fget=None, fset=None, fdel=None):
self.fget = fget
self.fset = fset
self.fdel = fdel
def __get__(self, instance, owner):
return self.fget(instance)  #instance拥有者的实例对象
def __set__(self, instance, value):
self.fset(instance, value)
def __delete__(self, instance):
self.fdel(instance)
```



``` python
>>> class C:
def __init__(self):
self._x = None
def getX(self):
return self._x
def setX(self, value):
self._x = value
def delX(self):
del self._x
x = MyProperty(getX, setX, delX)



>>> c = C()
>>> c.x = 'X-man'
>>> c.x
'X-man'  #使用x影响_x的值
>>> c._x
'X-man'
>>> del c.x  #删除后，c.x和c._x都不存在
```


练习：温度转换
定义一个温度类，然后定义两个描述符类用于描述摄氏度和华氏度两个属性。
要求两个属性会自动进行转换，也就是说可以给摄氏度这个属性赋值，打印华氏度是自动转换后的结果。
代码：

``` python
class Celsius:
  def __init__(self, value = 26.0):
    self.value = float(value)


  def __get__(self, instance, owner):
    return self.value
  def __set__(self, instance, value):
    self.value = float(value)


class Fahrenheit:
  def __get__(self, instance, owner):  #instance就是Temperature(属性:cel, fah)
    return instance.cel * 1.8 + 32
  def __set__(self, instance, value):
    #instance.cel = ('%.1f' % ((float(value) - 32) / 1.8))  #控制精度方法1
    instance.cel = round((float(value) - 32) / 1.8, 1)    #控制精度方法2
```


class Temperature:
  cel = Celsius()  #摄氏度
  fah = Fahrenheit()  #华氏度, fah在实例对象中被赋值时调用对应类的__set__
运行：

``` python
>>> temp = Temperature()
>>> temp.cel
26.0
>>> temp.cel = 30
>>> temp.fah
86.0
>>> temp.fah = 100
>>> temp.cel
37.8
```


定制序列(容器)
(1) 如果希望定制的容器不可变，只需要定义魔法方法__len__()和__getitem__()
(2) 如果希望定制的容器可变，需要定义__len__()和__getitem__()和__setitem__()和__delitem__()


魔法方法详解：
http://bbs.fishc.com/forum.php?mod=viewthread&tid=48793&extra=page%3D1%26filter%3Dtypeid%26typeid%3D403


练习：
编写一个不可改变的自定义列表，要求记录列表中每个元素被访问的次数。

``` python
class CountList:
  def __init__(self, *args):  #*args, 参数数量可变
    self.values = [x for x in args]
    self.count = {}.fromkeys(range(len(self.values)), 0)


  def __len__(self):
    return len(self.values)


  def __getitem__(self, key):
    self.count[key] += 1
    return self.values[key]
```

运行：

``` python
>>> c1 = CountList(1, 3, 5, 7, 9)
>>> c2 = CountList(2, 4, 6, 7, 10)
>>> c1[1]  #c1[1] == 3被访问1次
3
>>> c2[1]
4
>>> c1[1] + c2[1]  #c1[1] == 3被访问2次
7
>>> c1.count
{0: 0, 1: 2, 2: 0, 3: 0, 4: 0}
>>> c1[1]  #c1[1] == 3被访问3次
3
>>> c1.count
{0: 0, 1: 3, 2: 0, 3: 0, 4: 0}
```


迭代器 iter-next
iter
iter() 内置方法, 功能：返回一个迭代器对象
`__iter__`() 魔法方法


next
next() 内置方法
`__next__`()  魔法方法


for循环迭代器：

``` python
>>> links = {'百度':'http://www.baidu.com', 
'谷歌':'http://www.google.com', 
'搜狗':'http://www.sougou.com', 
'腾讯':'http://www.qq.com'}
>>> for each in links:
print("%s -> %s" % (each, links[each]))
谷歌 -> http://www.google.com
搜狗 -> http://www.sougou.com
腾讯 -> http://www.qq.com
百度 -> http://www.baidu.com
```


iter迭代器：

``` python
>>> string = 'yuan.jiang'
>>> it = iter(string)
>>> while True:
try:
each = next(it)
except StopIteration:
break;
print(each, end=' ')
运行：
y u a n . j i a n g 
```


斐波那契数列迭代器

``` python
>>> class Fibs:  #斐波那契数列
def __init__(self, n=10):   #加一个参数n控制迭代范围
self.a = 0
self.b = 1
self.n = n
def __iter__(self):
return self  #本身就是一个迭代器
def __next__(self):
self.a, self.b = self.b, self.a+self.b
if self.a > self.n:
raise StopIteration
return self.a
>>> fibs = Fibs()
>>> for each in fibs:
print(each, end=' ')
1 1 2 3 5 8
>>> fibs = Fibs(100)
>>> for each in fibs:
print(each, end=' ')
1 1 2 3 5 8 13 21 34 55 89
```


生成器 yield
(1) 生成器是一种特殊的迭代器，兼容next()内置方法
(2) 生成器模仿了协同程序
协同程序：可以运行的对立函数调用，函数可以暂停或挂起，并再需要的时候从程序离开的地方继续活着重新开始。
举例：

``` python
>>> def MyGen():
print('生成器被执行！')
yield 1
yield 2
>>> myg = MyGen()
>>> next(myg)
生成器被执行！
1
>>> next(myg)
2
>>> next(myg)
StopIteration
>>> for i in MyGen():  #for循环自动检测迭代器的StopIteration异常
print(i)
生成器被执行！
1
2
>>> def fibs():
a = 0
b = 1
while True:
a, b = b, a+b
yield a
>>> for each in fibs():
if each > 100:
break
print(each, end=' ')
1 1 2 3 5 8 13 21 34 55 89 
```


列表推导式

``` python
>>> a = [i for i in range(100) if not (i % 2) and (i % 3)]  #列表推导式
>>> a
[2, 4, 8, 10, 14, 16, 20, 22, 26, 28, 32, 34, 38, 40, 44, 46, 50, 52, 56, 58, 62, 64, 68, 70, 74, 76, 80, 82, 86, 88, 92, 94, 98]
>>> b = {i:i % 2 == 0 for i in range(10)}  #字典推导式(例子：小于10以内的偶数)
>>> b
{0: True, 1: False, 2: True, 3: False, 4: True, 5: False, 6: True, 7: False, 8: True, 9: False}
>>> c = {i for i in [1, 1, 2, 3, 4, 5, 5, 6, 7, 8, 3, 2, 1]}  #集合推导式(元素不重复)
>>> c
{1, 2, 3, 4, 5, 6, 7, 8}
#没有字符串推导式，引号内的强制解释为字符串
>>> e = (i for i in range(10))  #没有元组推导式，()小括号生成的是生成器推导式
>>> e
<generator object <genexpr> at 0x00000261E200A7D8>
>>> next(e)
0
>>> next(e)
1
>>> for each in e:
print(each, end=' ')
2 3 4 5 6 7 8 9 
>>> sum(i for i in range(100) if i % 2)
2500
```


生成器扩展阅读：
http://bbs.fishc.com/forum.php?mod=viewthread&tid=56023&extra=page%3D1%26filter%3Dtypeid%26typeid%3D403


### 21. 模块 module
容器 -> 数据的封装
函数 -> 语句的封装
类  -> 方法和属性的封装
模块 -> 程序的封装，其实就是.py的python程序
(1) import导入的.py模块文件必须放在与python.exe同一目录下，即可正确导入。
(2) 导入方法有三种：
① import 模块名
② from 模块名 import 函数名1, 函数名2, ...  #不建议这样用，可能会覆盖系统函数
③ import 模块名 as 新名字
举例：

``` python
在python下新建test_module文件夹：C:pythontest_module
C:pythontest_moduleTempeatureConversion.py
C:pythontest_modulecalc.py
#TempeatureConversion.py
def c2f(cel):
  fah = cel * 1.8 + 32

def f2c(fah):
  cel = round((fah - 32) / 1.8, 1)
  return cel


#calc.py
import TemperatureConversion as tc


print('32摄氏度 = %.1f华氏度' % tc.c2f(32))
print('99华氏度 = %.1f摄氏度' % tc.f2c(99))
```


运行calc.py：

``` python
=================== RESTART: C:pythontest_modulecalc.py ===================
32摄氏度 = 89.6华氏度
99华氏度 = 37.2摄氏度
>>> 
```


`__name__` 说明
`if __name__ = '__main__'`:  #决定是.py文件中的代码是当前程序运行，还是导入到其他程序中作为模块使用而运行
作用：限制为自身.py程序运行才执行的代码区域


搜索路径 path
(1) 最佳存放模块的目录：C:pythonlibsite-packages

``` python
>>> import sys
>>> sys.path
['', 'C:pythonLibidlelib', 'C:pythonpython35.zip', 'C:pythonDLLs', 'C:pythonlib', 'C:python', 'C:pythonlibsite-packages']
>>> sys.path.append('C:pythontest_module')  #自定义的模块目录可以append进去
>>> sys.path
['', 'C:pythonLibidlelib', 'C:pythonpython35.zip', 'C:pythonDLLs', 'C:pythonlib', 'C:python', 'C:pythonlibsite-packages', 'C:pythontest_module']
>>> import TemperatureConversion as temp
>>> temp.c2f(32)
89.6
```


包 package
(1) python目录下创建一个文件夹，用于存放相关的模块，文件夹的名字即包(package)的名字
(2) 在文件夹中创建一个 __init__.py 的模块文件，内容可以为空
举例：

``` python
C:pythontest_modulecalc.py
C:pythontest_moduleM1TemperatureConversion.py  #M1文件夹名，即为包名
C:pythontest_moduleM1__init__.py  #告诉python运行时将其解释为包
#calc.py中修改为：包名.模块名
import M1.TemperatureConversion as tc
print('32摄氏度 = %.1f华氏度' % tc.c2f(32))
print('99华氏度 = %.1f摄氏度' % tc.f2c(99))
```


自带电池：python标准库
(1) 电池：python-IDLE 帮助文档 F1
(2) 来自全球开发者贡献的python模块：https://pypi.python.org/pypi
#也可以自己写模块发布上去。
(3) PEP：python增强建议书，规范与定义python各种加强和延伸功能的技术规格，即参考标准
(4) PEP规范内容历史：http://www.python.org/dev/peps
(5) IDLE中模块信息查看：

``` python
>>> import timeit
>>> print(timeit.__doc__)  #帮助文档
>>> dir(timeit)  #内置方法
>>> timeit.__all__  #__all__属性是可供外界调用的类或接口函数
>>> timeit.__file__  #__file__属性是显示模块源代码在本地的位置(学习高手的代码)
>>> help(timeit)  #帮助文档
```


timeit 模块详解
地址：http://bbs.fishc.com/thread-55593-1-1.html


### 22. python实例：网络爬虫
python访问网络： urllib (是个包模块)
URL一般格式：
protocol://hostname[:port]/path/[;parameters][?query]#fragment
URL三部分组成：
(1) 协议：http, https, ftp, file, ed2k...
(2) 域名/IP地址：如http默认端口号80
(3) 资源具体地址：如目录或文件名

查看帮助文档后发现urllib包有4个模块：
urllib.request #for opening and reading URLs 
urllib.error #containing the exceptions raised by urllib.request 
urllib.parse #for parsing URLs 
urllib.robotparser #for parsing robots.txt files 
尝鲜：

```python
>>> import urllib.request
>>> response = urllib.request.urlopen('http://www.fishc.com')
>>> html = response.read()
>>> print(html)
b'xef...rn</html>rn'  #整个网页的二进制文件以16进制显示
>>> html = html.decode('utf-8')  #按其编码方式解码
>>> print(html)
"""
<!DOCTYPE html>
<html lang="en">
<head>
...
</head>
<body>
</body>
</html>
"""
```


访问网页内容存储本地
举例：

``` python
import urllib.request as url_req


response = url_req.urlopen('http://placekitten.com/g/1920/1080')
cat_img = response.read()


with open('cat_1920_1080.jpg', 'wb') as f:
  f.write(cat_img)
```

运行：
会生成这个文件：C:UsersJanDesktoppython_studycat_1920_1080.jpg


实现POST请求 - 自动翻译机

``` xl
import urllib.request as url_req
import urllib.parse  as url_prs
import json  #json, 轻量级的数据交换格式


while True:
  content = input('请输入需要翻译的内容<.q退出>：')
  if content == '.q':
    break
  else:
    #注意url地址<有道翻译>，按小甲鱼视频中的可能不对，需到网上查别人的
    url = 'http://fanyi.youdao.com/translate?smartresult=dict&smartresult=rule&smartresult=ugc&sessionFrom=http://www.youdao.com/'
    data = {}  #字典类型


    data['type'] = 'AUTO'
    data['i'] = content
    data['doctype'] = 'json'
    data['xmlVersion'] = '1.8'
    data['keyfrom'] = 'fanyi.web'
    data['ue'] = 'UTF-8'
    data['action'] = 'FY_BY_CLICKBUTTON'
    data['typoResult'] = 'true'


    data = url_prs.urlencode(data).encode('utf-8')
    response = url_req.urlopen(url, data)
    html = response.read().decode('utf-8')
    target = json.loads(html)
    print('翻译结果：%s' % (target['translateResult'][0][0]['tgt']))
#缺陷：能够被识别为代码访问，而非浏览器，即非人类访问
```

运行：

``` python
========= RESTART: C:UsersJanDesktoppython_studytranslation.py =========
请输入需要翻译的内容<.q退出>：生存，还是毁灭，这是一个问题
翻译结果：To survive, or not to be, this is a problem
请输入需要翻译的内容<.q退出>：To be or not to be, it's a question.
翻译结果：生存还是毁灭,这是一个问题。
请输入需要翻译的内容<.q退出>：.q
>>> 
```


修改header
(1) 通过Request的headers参数修改，字典形式
(2) 通过Request.add_header()方法修改
追加header模拟浏览器访问：

``` python
import urllib.request as url_req
import urllib.parse  as url_prs
import json  #json, 轻量级的数据交换格式


while True:
  content = input('请输入需要翻译的内容<.q退出>：')
  if content == '.q':
    break
  else:
    #注意url地址，视频中的可能不对需到网上查
    url = 'http://fanyi.youdao.com/translate?smartresult=dict&smartresult=rule&smartresult=ugc&sessionFrom=http://www.youdao.com/'


    #header方法1：创建字典，请求中传参
    '''
    head = {}  #模拟浏览器访问 Request Headers
    head['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'
    '''
    data = {}  #From data
    data['type'] = 'AUTO'
    data['i'] = content
    data['doctype'] = 'json'
    data['xmlVersion'] = '1.8'
    data['keyfrom'] = 'fanyi.web'
    data['ue'] = 'UTF-8'
    data['action'] = 'FY_BY_CLICKBUTTON'
    data['typoResult'] = 'true'
    data = url_prs.urlencode(data).encode('utf-8')


    '''req = url_req.Request(url, data, head)  #调用请求的方法：data, head '''
    #header方法2：请求中追加header
    req = url_req.Request(url, data)
    req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36')


    response = url_req.urlopen(req)
    html = response.read().decode('utf-8')
    target = json.loads(html)
    print('翻译结果：%s' % (target['translateResult'][0][0]['tgt']))
```

运行：

``` python
========= RESTART: C:UsersJanDesktoppython_studytranslation.py =========
请输入需要翻译的内容<.q退出>：生存，还是毁灭，这是一个问题
翻译结果：To survive, or not to be, this is a problem
请输入需要翻译的内容<.q退出>：To be or not to be, it's a question.
翻译结果：生存还是毁灭,这是一个问题。
请输入需要翻译的内容<.q退出>：.q
>>> 
```


代理
作用：让爬虫伪装浏览器请求，让http服务器不会认为是非人类访问。
步骤：

``` python
(1) 参数是一个字典{'类型':'代理ip:端口号'}
proxy_support = urllib.request.ProxyHandler({})
(2) 定制、创建一个opener
opener = urllib.request.build_opener(proxy_support)
(3) 安装opener
urllib.request.install_opener(opener)
(4) 调用opener
opener.open(url)
#或：urllib.request.urlopen(url)
```
代码：

``` python
import urllib.request as url_req
import random



url = 'http://www.whatismyip.com.tw'  #这个网站访问它会显示自己的ip地址


#待完善：抓取代理ip网站上的ip和端口，存入iplist
iplist = ['115.197.136.78:8118', '118.250.50.69:80', '183.133.81.57:8118',  '113.77.240.236:9797', '139.129.166.68:3128']  #使用random随机取ip


#网上查的免费代理ip网站：http://www.xicidaili.com/
proxy_support = url_req.ProxyHandler({'http':random.choice(iplist)})
opener = url_req.build_opener(proxy_support)


#headers = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'}
opener.addheaders = [('User-Agent', 'Chrome/55.0.2883.87')]
url_req.install_opener(opener)


#req = url_req.Request(url, headers=headers)
#response = url_req.urlopen(req)
response = url_req.urlopen(url)


html = response.read().decode('utf-8')
print(html)
```

补充：
Beautiful Soup 是用Python写的一个HTML/XML的解析器，使用安装python-IDLE时附带的pip命令，直接在windows下执行：

``` python
C:python> pip install bs4
#一键安装搞定，python中测试能否导入成功
>>> from bs4 import BeautifulSoup
>>> #成功导入，失败会报异常。
```


采集代理ip

``` python
import urllib.request as url_req
from bs4 import BeautifulSoup  #此库需要安装:win-cmd执行"pip install bs4"即可
import random
import pprint as ppr


#这个网站访问它会显示自己的ip地址
display_ip_url = 'http://www.whatismyip.com.tw'  #'http://ip.chinaz.com/getip.aspx'


#代理ip网站, http协议类型
proxy_ip_url = 'http://www.xicidaili.com/wt/'


header = {}
header['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'


def getProxyIp():  #获取代理ip
  proxyip_list = []
  for i in range(1, 2):
    try:
      url = proxy_ip_url + str(i)  #抓取前2页
      req = url_req.Request(url, headers=header)
      res = url_req.urlopen(req).read()
      soup = BeautifulSoup(res, "html.parser")  #BeautifulSoup(markup, “html.parser”) html解析器
      ips = soup.findAll('tr')  #findAll()搜索解析器解析出来的html文档树
      for x in range(1, len(ips)):
        ip = ips[x]
        tds = ip.findAll('td')  #ip和端口都在tr标签中的td标签中
        ip_tmp = tds[1].contents[0] + ':' + tds[2].contents[0]
        proxyip_list.append(ip_tmp)  #追加到列表
    except:
      continue
  return proxyip_list


iplist = getProxyIp()
#print(iplist)  #for test
ppr.pprint(iplist)  #以更规范的格式显示输出结果


#第一步：ProxyHandler传参
ip_port = random.choice(iplist)
proxy_support = url_req.ProxyHandler({'http':ip_port})  #从列表中随机选择代理ip和端口项
print('ip:port   ' + ip_port)
#第二步：opener创建
opener = url_req.build_opener(proxy_support)
#第三步：opener安装
opener.addheaders = [('User-Agent', 'Chrome/55.0.2883.87')]
url_req.install_opener(opener)
#第四步：opener调用
#response = url_req.urlopen(display_ip_url)
response = opener.open(display_ip_url)  


html = response.read().decode('utf-8')
print(html)
```


运行：
======== RESTART: C:UsersJanDesktoppython_studyproxy_support.py ========
```html
<!DOCTYPE HTML>
<html>
 <head>
 ...
 </head>
 <body>
 <h1>IP位址</h1>
 <span data-ip='183.56.177.130'><b style='font-size: 1.5em;'>183.56.177.130</b>  </span>
 <span data-ip-country='CN'><i>CN</i></span>
 <h1>真實IP</h1>
 <span data-ip-real='113.110.143.94'><b style='font-size: 1.5em;'>113.110.143.94</b></span>
 <span data-ip-real-country='CN'><i>CN</i></span>
 <script type="application/json" id="ip-json">
{
"ip": "183.56.177.130",
"ip-country": "CN",
"ip-real": "113.110.143.94",
"ip-real-country": "CN"
}
 </script>
 ...
 </body>
</html>
```


        2017.09.04          
urllib.request 返回响应后的内置方法
import urllib.request as url_req
req = url_req.Request('http://url')
res = url_req.urlopen(req) #打开一个链接，参数可以是一个字符串或者Request对象
res.geturl() #返回链接的字符串，即urlopen的字符串参数
res.info() #返回http响应数据包的头headers, 输出：print(res.info())
res.getcode() #返回http响应的状态码


举例：
=============== RESTART: C:/Users/Jan/Desktop/download_cat.py ===============

``` python
>>> res.geturl()
'http://placekitten.com/g/500/600'
>>> res.info()
<http.client.HTTPMessage object at 0x0000022E09C006D8>
>>> res.headers
<http.client.HTTPMessage object at 0x0000022E09C006D8>
>>> print(res.info())
Date: Mon, 04 Sep 2017 13:11:21 GMT
Content-Type: image/jpeg
Content-Length: 26590
Connection: close
Set-Cookie: __cfduid=d8354310653b8846db674de048175187b1504530681; expires=Tue, 04-Sep-18 13:11:21 GMT; path=/; domain=.placekitten.com; HttpOnly
Accept-Ranges: bytes
X-Powered-By: PleskLin
Access-Control-Allow-Origin: *
Cache-Control: public
Expires: Thu, 31 Dec 2020 20:00:00 GMT
Server: cloudflare-nginx
CF-RAY: 399131b5435b6d4e-SJC
>>> res.getcode()
200
```


python爬虫下载妹子图
代码：

``` python
#代理ip不太稳定，免费代理很多时好时坏
import urllib.request
import os
import random
import pprint as ppr
from bs4 import BeautifulSoup


header = {}
header_key = 'User-Agent'
header_value = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'
header[header_key] = header_value


def get_proxy_ip():  #获取代理ip
  proxyip_list = []
  proxy_ip_url = 'http://www.xicidaili.com/wt/'
  for i in range(1, 2):
    try:
      url = proxy_ip_url + str(i)
      req = urllib.request.Request(url, headers=header)
      res = urllib.request.urlopen(req).read()
      soup = BeautifulSoup(res, "html.parser")
      ips = soup.findAll('tr')
      for x in range(1, len(ips)):
        ip = ips[x]
        tds = ip.findAll('td')
        ip_tmp = tds[1].contents[0] + ':' + tds[2].contents[0]
        proxyip_list.append(ip_tmp)
    except:
      continue
  return proxyip_list


#打开url接口函数
def url_open(url):
  req = urllib.request.Request(url)
  req.add_header(header_key, header_value)
  '''
  #使用代理模拟真人访问而不是代码访问
  iplist = get_proxy_ip()
  #ppr.pprint(iplist)  #for test
  ip_port = random.choice(iplist)
  proxy_support = urllib.request.ProxyHandler({'http':ip_port})
  print('ip:port   ' + ip_port)  #for test
  opener = urllib.request.build_opener(proxy_support)
  opener.addheaders = [('User-Agent', 'Chrome/55.0.2883.87')]
  urllib.request.install_opener(opener)
  '''
  res = urllib.request.urlopen(url)
  html = res.read()


  print(url)
  return html


def get_page(url):
  html = url_open(url).decode('utf-8')


  a = html.find('current-comment-page') + 23
  b = html.find(']', a)  #从a位置开始找到一个]符号
  print (html[a:b])  #for test


  return html[a:b]


def find_imgs(url):
  html = url_open(url).decode('utf-8')
  img_addrs = []


  a = html.find('img src=')  #找到 img src= 的位置


  while a != -1:
    b = html.find('.jpg', a, a+255)  #找到从a位置开始，以 .jpg 结尾的地方
    if b != -1:  #find找不到时返回-1
      img_addrs.append('http:' + html[a+9:b+4])  #图片链接地址追加到列表中, 9=len('img src="'), 4=len('.jpg')
    else:
      b = a + 9
    
    a = html.find('img src=', b)    #下一次循环所找的位置就是从b开始


  #for each in img_addrs:
  #   print(each)


  return img_addrs


def save_imgs(folder, img_addrs):
  for each in img_addrs:
    filename = each.split('/')[-1]  #split以/分割字符串，-1取最后一个元素
    with open(filename, 'wb') as f:
      img = url_open(each)
      f.write(img)


def download_mm(folder='mm_dir', pages=25):
  if os.path.exists(folder):
    os.chdir(folder)
  else:
    os.mkdir(folder)
    os.chdir(folder)


  url = 'http://jandan.net/ooxx/'  #实际图源来源于新浪服务器
  page_num = int(get_page(url))   #函数get_page()


  for i in range(pages):
    page_num -= i
    page_url = url + 'page-' + str(page_num) + '#comments'
    img_addrs = find_imgs(page_url)  #函数find_imgs()
    save_imgs(folder, img_addrs)


if __name__ == '__main__':
  download_mm()
```


        2017.09.05          
### 正则表达式
"我知道，可以使用正则表达式解决现在遇到的难题。"于是，现在他就有两个问题了。

``` python
>>> import re
>>> re.search(r'Hello', 'I love you, Hello!~')  #search()方法用于在字符串中搜索正则表达式模式第一次出现的位置
<_sre.SRE_Match object; span=(12, 17), match='Hello'>  #第12-16个字符位置
>>> re.search(r'lo', 'hello')
<_sre.SRE_Match object; span=(3, 5), match='lo'>
>>> 'hello'.find('lo')
3
#.点号：匹配除了换行符的任何字符
>>> re.search(r'.', 'I love you, baidu.com!~')
<_sre.SRE_Match object; span=(0, 1), match='I'>
#匹配点号本身，使用反斜杠转义即可
>>> re.search(r'.', 'I love you, baidu.com!~')
<_sre.SRE_Match object; span=(17, 18), match='.'>
#d表示匹配一个0~9的数字
>>> re.search(r'd', 'I love 123, baidu.com!~')
<_sre.SRE_Match object; span=(7, 8), match='1'>
>>> re.search(r'ddd', 'I love 123, baidu.com!~')
<_sre.SRE_Match object; span=(7, 10), match='123'>
>>> re.search(r'ddd.ddd.ddd.ddd', '192.168.111.123:8080')
<_sre.SRE_Match object; span=(0, 15), match='192.168.111.123'>
>>> re.search(r'ddd.ddd.ddd.ddd', '192.168.1.1') #无法匹配，位数不同
#使用[]创建一个字符类
>>> re.search(r'[aeiou]', 'I love you, baidu.com!~')
<_sre.SRE_Match object; span=(3, 4), match='o'>
>>> re.search(r'[aeiouAEIOU]', 'I love you, baidu.com!~')
<_sre.SRE_Match object; span=(0, 1), match='I'>
#-短杠：表示匹配的范围
>>> re.search(r'[a-z]', 'I love you, baidu.com!~')
<_sre.SRE_Match object; span=(2, 3), match='l'>
>>> re.search(r'[0-9]', 'I love 123, baidu.com!~')
<_sre.SRE_Match object; span=(7, 8), match='1'>
#{}大括号：来限定匹配的次数
>>> re.search(r'ab{3}c', 'zabbbcz')
<_sre.SRE_Match object; span=(1, 6), match='abbbc'>
#{}3,10代表3到10次重复次数，不能有空格出现
>>> re.search(r'ab{3, 10}c', 'zabbbbbcz')
>>> re.search(r'ab{3,10}c', 'zabbbbbcz')
<_sre.SRE_Match object; span=(1, 8), match='abbbbbc'>
>>> re.search(r'[0-2][0-5][0-5]', '188')  #错误示范
>>> re.search(r'[0-255]', '188')  #0,1,2,5其中任何一个，匹配
<_sre.SRE_Match object; span=(0, 1), match='1'>
>>> re.search(r'[01]dd|2[0-4]d|25[0-5]', '188')  #0-255正则表达式
<_sre.SRE_Match object; span=(0, 3), match='188'>
#ip地址正则表达式
>>> re.search(r'(([01]{0,1}d{0,1}d|2[0-4]d|25[0-5]).){3}([01]{0,1}d{0,1}d|2[0-4]d|25[0-5])', '192.168.1.1')
<_sre.SRE_Match object; span=(0, 11), match='192.168.1.1'>
>>> re.search(r'(([01]{0,1}d{0,1}d|2[0-4]d|25[0-5]).){3}([01]{0,1}d{0,1}d|2[0-4]d|25[0-5])', '255.255.255.0')
<_sre.SRE_Match object; span=(0, 13), match='255.255.255.0'>
#此ip表达式的一点bug：
>>> re.search(r'(([01]{0,1}d{0,1}d|2[0-4]d|25[0-5]).){3}([01]{0,1}d{0,1}d|2[0-4]d|25[0-5])', '11192.168.41.8888')
<_sre.SRE_Match object; span=(2, 15), match='192.168.41.88'>


#ip地址匹配的正则表达式【严谨版】
import re
ptnIP = re.compile(r'(?<![d.])' # 前导 无 数字和小数点
          r'(?:(?:'
          r'[01]?d?d' #  0 ~ 199
          r'|2[0-4]d'  # 200 ~ 249
          r'|25[0-5])'  # 250 ~ 255
          r'.){3}'   # 3组 xxx.
          r'(?:'
          r'[01]?d?d'
          r'|2[0-4]d'
          r'|25[0-5])'
          r'(?![d.])'  # 后续 无 数字和小数点
         )
test_IP = (
    '0.0.0.0'
    ';1.22.333.444'     #不合法
    ';2.0.0.256'       #不合法
    ';3.22.33.23333333'   #不合法
    ';4.2.3.4.5'       #不合法
    ';5.111.222.99'
    ';6.0.0.0'
    ';7.234.234.234'
    ';255.255.255.255'
    ';234.234.234.234'
    ';1192.168.41.888'    #不合法
    )
match = ptnIP.findall(test_IP)
print(match)
```


运行：
========== RESTART: C:UsersJanDesktoppython_studyip_regular.py ==========

``` python
['0.0.0.0', '5.111.222.99', '6.0.0.0', '7.234.234.234', '255.255.255.255', '234.234.234.234']  #输出均为合法ip
```


        2017.09.07          
Python3 正则表达式特殊符号及用法（详细列表）
http://blog.csdn.net/riba2534/article/details/54288552


正则表达式举例：

``` python
import urllib.request
import re


header = {}
header_key = 'User-Agent'
header_value = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'
header[header_key] = header_value


def open_url(url):
  req = urllib.request.Request(url)
  req.add_header(header_key, header_value)
  page = urllib.request.urlopen(req)
  html = page.read().decode('utf-8')


  return html


def get_img(html):
  p = r'<img class="BDE_Image" src="([^"]+.jpg)'  # 正则表达式匹配贴吧图片链接
  imglist = re.findall(p, html)  # findall中的p包含子组()的话，会单独返回子组


  # test start
  for each in imglist:
    print(each)
  # test end


  for each in imglist:
    filename = each.split("/")[-1]
    urllib.request.urlretrieve(each, filename, None)


if __name__ == '__main__':
  url = 'https://tieba.baidu.com/p/5310571187'  # 下载百度贴吧图片示例
  get_img(open_url(url))
```


运行：
https://imgsa.baidu.com/forum/w%3D580/sign=0b340d2849a7d933bfa8e47b9d4ad194/f1f8e3dde71190ef7241a5e3c51b9d16fcfa60a4.jpg
https://imgsa.baidu.com/forum/w%3D580/sign=6ff2514ff0f2b211e42e8546fa816511/fe4fbf014a90f6030c47ab7b3212b31bb151ed60.jpg
https://imgsa.baidu.com/forum/w%3D580/sign=7f8aadd5f9d3572c66e29cd4ba136352/b9dc748b4710b912bda70cc2c8fdfc03934522f1.jpg


优化采集代理ip：

``` python
import urllib.request
import re


header = {}
header_key = 'User-Agent'
header_value = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'
header[header_key] = header_value


def open_url(url):
  req = urllib.request.Request(url)
  req.add_header(header_key, header_value)
  page = urllib.request.urlopen(req)
  html = page.read().decode('utf-8')


  return html


def get_ip(html):
  ptnIP = (r'(?<![d.])' # 前导 无 数字和小数点
       r'(?:(?:'
       r'[01]?d?d' #  0 ~ 199
       r'|2[0-4]d'  # 200 ~ 249
       r'|25[0-5])'  # 250 ~ 255
       r'.){3}'   # 3组 xxx.
       r'(?:'
       r'[01]?d?d'
       r'|2[0-4]d'
       r'|25[0-5])'
       r'(?![d.])') # 后续 无 数字和小数点
  iplist = re.findall(ptnIP, html)  # findall中的p包含子组()的话，会单独返回子组


  # test start
  for each in iplist:
    print(each)
  # test end


if __name__ == '__main__':
  url = 'http://www.xicidaili.com/wt/'  # 下载代理ip
  get_ip(open_url(url))
```

异常处理
URLError 举例：

``` python
>>> import urllib.request
>>> import urllib.error
>>> req = urllib.request.Request('http://www.ooxx-hello.com')  #打开一个不存在的链接
>>> try:
urllib.request.urlopen(req)
except urllib.error.URLError as e:
print(e.reason)
[Errno 11001] getaddrinfo failed  #错误信息
```

HTTPError 举例：

``` python
>>> import urllib.request
>>> import urllib.error
>>> req = urllib.request.Request('http://www.fishC.com/ooxx.html')
>>> try:
urllib.request.urlopen(req)
except urllib.error.HTTPError as e:
print(e.code)
print(e.read())
```

```
404
b'<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">n<html><head>n<title>404 Not Found</title>n</head><body>n<h1>Not Found</h1>n<p>The requested URL /ooxx.html was not found on this server.</p>n<hr>n<address>Apache Server at www.fishc.com Port 80</address>n</body></html>n'
```


处理异常的写法：

``` python
from urllib.request import Request, urlopen
from urllib.error import URLError
req = Request('http://someurl/')
try:
response = urlopen(req)
except URLError as e:
if hasattr(e, 'reason'):
print('We failed to reach a server.')
print('Reason: ', e.reason)
elif hasattr(e, 'code'):
print('The server couldn't fulfill the request.')
print('Error code: ', e.code)
else:
#everything is fine.
```


        2017.09.08          

### Scrapy爬虫框架


① Scrapy的安装与环境搭建
Scrapy对应python2.7的版本。（安装过程中如遇任何问题均可百度搜索一下，这是程序员必须学会的快速解决问题的办法）
1. 安装python2.7(32位版本)

``` python
安装包：python-2.7.6-win32.msi
设置环境变量：win-运行-cmd
> C:Python27python.exe C:Python27toolsScriptswin_add2path.py
重启windows系统，验证安装是否成功：
> python -- version
#如果显示是3.多的版本，请参考python2/3版本切换任性切换设置：http://blog.csdn.net/sinat_36184075/article/details/77872708
```

2. 安装pywin32(32位版本)

``` python
安装包：pywin32-215.win32-py2.7.exe
```

3. 安装python2.7的pip程序

``` python
安装程序：get-pip.py
安装方法：win-cmd> python C:pythonScrapyget-pip.py
先把pip的路径添加到windows的环境变量中。
重启windows系统，验证安装是否成功：
> pip -- version
#如果没有显示版本信息，请参考pip2/3任性切换设置：http://blog.csdn.net/sinat_36184075/article/details/77872708
```

4. 安装lxml

``` python
安装环境包：VCForPython27.msi
> pip2 install lxml
#如果pip2的路径有添加到windows中的话，安装可以成功。如果不成功，使用下面安装包安装
安装包：lxml-3.2.3.win32-py2.7.exe
```

5. 安装OpenSSL

``` python
> pip2 install pyOpenSSL
#如果pip2的路径有添加到windows中的话，安装可以成功。如果不成功，使用下面安装包安装
安装包：egenix-pyopenssl-0.13.7.win32-py2.7.msi
```

6. 安装Scrapy

``` python
> pip2 install service_identity
> pip2 install Scrapy
验证是否安装成功：
> Scrapy
#如果提示找不到命令的话，可能需要一个工具环境支持：Twisted-15.0.0.win32-py2.7.msi
安装完Twisted后再次尝试验证即可。
```




② Scrapy框架爬虫程序初探
一个为了爬取网站数据，提取结构性数据而编写的应用框架。最初是为了页面抓取所设计的，也可以应用在获取API所访问的数据上，或者说通用的网络爬虫上。
使用Scrapy抓取一个网站一共需要四个步骤：
1. 创建一个Scrapy项目；
2. 定义Item容器；
3. 编写爬虫；
4. 存储内容。


-- -Scrapy框架（官网）图示-- -


实验网站对象：www.dmoz.org


1. 创建一个Scrapy项目：crawler

``` python
C:UsersJanDesktoppython_study>Scrapy startproject crawler
#crawler是我们的项目名称
在python_studycrawler文件夹中即是我们的爬虫框架。
```


Item是保存爬取到的数据的容器，其使用方法和python字典类似，并且提供了额外保护机制来避免拼写错误导致的未定义字段错误。


2. 定义Item容器：

``` python
#crawlercrawleritems.py
import scrapy
class CrawlerItem(scrapy.Item):
  # define the fields for your item here like:
  # name = scrapy.Field()
  title = scrapy.Field()
  link = scrapy.Field()
  desc = scrapy.Field()
```

3. 编写爬虫：
编写爬虫类Spider，Spider是用户编写用于从网站上爬取数据的类。其包含了一个用于下载的初始化URL，然后是如何跟进网页中的链接以及如何分析页面中的内容，还有提取生成item的方法。

``` python
#crawlercrawlerspiderscrawler_spider.py 新建文件
import scrapy


class CrawlerSpider(scrapy.Spider):
  name = 'csdn'  #爬虫名字，调用的时候使用
  allowed_domains = ['csdn.net']
  start_urls = ['http://geek.csdn.net/AI']


  def parse(self, response):
    filename = response.url.split('/')[-2]
    with open(filename, 'wb') as f:
      f.write(response.body)
```

3.1 爬

``` python
win-cmd：
C:UsersJanDesktoppython_study>cd crawler
C:UsersJanDesktoppython_studycrawler>scrapy crawl csdn  #csdn爬虫类中的name
2017-09-08 21:56:28 [scrapy.utils.log] INFO: Scrapy 1.4.0 started (bot: crawler)
...
2017-09-08 21:56:30 [scrapy.core.engine] INFO: Spider opened
2017-09-08 21:56:30 [scrapy.extensions.logstats] INFO: Crawled 0 pages (at 0 pages/min), scraped 0 items (at 0 items/min)
2017-09-08 21:56:30 [scrapy.extensions.telnet] DEBUG: Telnet console listening on 127.0.0.1:6023
2017-09-08 21:56:30 [scrapy.core.engine] DEBUG: Crawled (200) <GET http://geek.csdn.net/robots.txt> (referer: None)  #Here: robots.txt
2017-09-08 21:56:30 [scrapy.core.engine] DEBUG: Crawled (200) <GET http://geek.csdn.net/AI> (referer: None)  #Here: 我们的目标爬取链接
2017-09-08 21:56:31 [scrapy.core.engine] INFO: Closing spider (finished)
...
2017-09-08 21:56:31 [scrapy.core.engine] INFO: Spider closed (finished)


#爬取的内容存储位置(爬取网站的源码文件)：
C:UsersJanDesktoppython_studycrawler 目录下 geek.csdn.net 的NET文件。
```


3.2 取
在Scrapy中使用的是一种基于XPath和CSS的表达式机制：Scrapy Selectors(选择器)
Selector是一个选择器，有4个基本方法：
xpath() 传入xpath表达式，返回该表达式所对应的所有节点的selector list列表。
css() 传入CSS表达式，返回该表达式所对应的所有节点的selector list列表。
extract() 序列化该节点为unicode字符串并返回list。
re() 根据传入的正则表达式对数据进行提取，返回unicode字符串list列表。


``` python
win-cmd进入项目根目录后执行：scrapy shell "http://target_url/"
C:UsersJanDesktoppython_studycrawler>scrapy shell "http://geek.csdn.net/AI"
2017-09-08 22:05:48 [scrapy.utils.log] INFO: Scrapy 1.4.0 started (bot: crawler)
...
2017-09-08 22:05:50 [scrapy.extensions.telnet] DEBUG: Telnet console listening on 127.0.0.1:6023
2017-09-08 22:05:50 [scrapy.core.engine] INFO: Spider opened
2017-09-08 22:05:50 [scrapy.core.engine] DEBUG: Crawled (200) <GET http://geek.csdn.net/robots.txt> (referer: None)
2017-09-08 22:05:50 [scrapy.core.engine] DEBUG: Crawled (200) <GET http://geek.csdn.net/AI> (referer: None)
...
>>> response.body #输出网页的源码信息
>>> response.headers  #输出网页的头部信息
{'Date': ['Fri, 08 Sep 2017 14:06:31 GMT'], 'Content-Type': ['text/html; charset=utf-8'], 'Server': ['openresty'], 'Vary': ['Accept-Encoding', 'Accept-Encoding']}
```


XPath是一门在网页中查找特定信息的语言，所以用XPath来筛选数据，要比使用正则表达式容易些。

``` python
/html/head/title 选择HTML文档中<head>标签内的<title>元素
/html/head/title/text() 选择上面提到的<title>元素的文字
//td 选择所有的<td>元素
//div[@class="mine"] 选择所有具有 class="mine" 属性的div元素



response.xpath() = response.selector.xpath()  #已经映射。可以直接使用.xpath()
>>> response.xpath('//title')
[<Selector xpath='//title' data=u'<title>CSDNu6781u5ba2u5934u6761-u63a8u8350u6bcfu65e5u6700u65b0u6700u70edITu8d44u8baf</title>'>]  #u的那些是中文字符，编码方式决定显示
>>> response.xpath('//title/text()').extract()  #截图title内容
[u'CSDNu6781u5ba2u5934u6761-u63a8u8350u6bcfu65e5u6700u65b0u6700u70edITu8d44u8baf']
>>> sel.xpath('//span/a')  #输出所有<span><a>标签的内容全部输出
2017-09-08 22:36:08 [py.warnings] WARNING: <string>:1: ScrapyDeprecationWarning: "sel" shortcut is deprecated. Use "response.xpath()", "response.css()" or "response.selector" instead
>>> sel.xpath('//span/a/text()').extract()  #获取所有<span><a>标签中的字符串，即标题
>>> sel.xpath('//span/a/@href').extract()  #获取<span><a>中的连接地址
>>> sites = sel.xpath('//div/div/div/dl/dd/span/a/text()').extract()  #按照标签包裹的层级<body>下开始找到包裹标题的<a>标签写入xpath中
>>> for title in sites:  #使用for循环打印可以自动将Unicode转换为对应中文编码显示
...   print(title)
自己动手做聊天机器人 四十二-(重量级长文)从理论到实践开发自己的聊天机器人
微软携手 Facebook 推出开源项目 打造共享神经网络模型
Taylor Swift vs 人工智能：作词谁更强？
推荐13个机器学习框架
...
>>> sites = sel.xpath('//div/div/div[@class="directory-url"]/dl/dd/span/a/text()').extract()
#其中[@class="directory-url"]的功能是：过滤掉对应样式类的内容，此处仅做演示
```

``` python
#crawlercrawlerspiderscrawler_spider.py 修改代码
import scrapy


class CrawlerSpider(scrapy.Spider):
  name = 'csdn'
  allowed_domains = ['csdn.net']
  start_urls = ['http://geek.csdn.net/AI']


  def parse(self, response):
    sel = scrapy.selector.Selector(response)
    sites = sel.xpath('//div/div/div/dl/dd/span')
    for site in sites:
      title = site.xpath('a/text()').extract()
      link  = site.xpath('a/@href').extract()
      desc  = site.xpath('text()').extract()
      print(title, link, desc)
win-cmd：
C:UsersJanDesktoppython_studycrawler>scrapy crawl csdn
#运行就可以将print中的内容在爬取时一并显示出来（输出内容略）
```


4. 存储内容
最常见的导出为json格式。
中文乱码问题：http://bbs.fishc.com/thread-85672-1-1.html

``` python
#crawlercrawlerspiderscrawler_spider.py  构造items的列表对象
import scrapy
from crawler.items import CrawlerItem


class CrawlerSpider(scrapy.Spider):
  name = 'csdn'
  allowed_domains = ['csdn.net']
  start_urls = ['http://geek.csdn.net/AI']


  def parse(self, response):
    sel = scrapy.selector.Selector(response)
    items = []
    sites = sel.xpath('//div/div/div/dl/dd/span')
    for site in sites:
      item = CrawlerItem()  #实例化一个item类（类似于字典）
      item['title'] = site.xpath('a/text()').extract()
      item['link']  = site.xpath('a/@href').extract()
      item['desc']  = site.xpath('text()').extract()
      print(item['title'], item['link'], item['desc'])
      items.append(item)


    return items
```


``` python
#crawlercrawlerpipelines.py  设置抓取内容存储的文件名以及校正中文乱码
import json
import codecs


store_filename = 'items.json'   #item.json指的是要保存的json格式文件的名称


class CrawlerPipeline(object):
  def __init__(self):
    self.file = codecs.open(store_filename, 'wb', encoding='utf-8')  #中文编码格式一般都是'utf-8'
  def process_item(self, item, spider):
    line = json.dumps(dict(item), ensure_ascii=False) + 'n'  #这一句会将你每次返回的字典抓取出来,“ensure_ascii=False”这一句话很重要，如果是True的话就是我们保存的u4e2du56fd这种格式了
    self.file.write(line)  #写入到文件中
    return item
```


``` python
#crawlercrawlersetting.py  使pipelines.py生效，取消注释ITEM_PIPELINES
ITEM_PIPELINES = {
  'crawler.pipelines.CrawlerPipeline': 300,  #300是正常值，不变。
}
```


win-cmd运行scrapy，即可自动在crawler目录下生成items.json文件，并且中文显示正常：

``` python
C:UsersJanDesktoppython_studycrawler>scrapy crawl csdn
C:UsersJanDesktoppython_studycrawleritems.json  #中文正常。
{"title": ["自己动手做聊天机器人 四十二-(重量级长文)从理论到实践开发自己的聊天机器人"], "link": ["http://www.shareditor.com/blogshow?blogId=136&hmsr=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io"], "desc": ["n               ", "n             "]}
{"title": ["微软携手 Facebook 推出开源项目 打造共享神经网络模型"], "link": ["http://tech.163.com/17/0908/08/CTQ1403R00097U80.html"], "desc": ["n               ", "n             "]}
{"title": ["Taylor Swift vs 人工智能：作词谁更强？"], "link": ["http://dataquestion.com/taylor-vs-ai"], "desc": ["n               ", "n             "]}
...
```


        2017.09.09          
### 23. GUI界面的终极选择 Tkinter
Tkinter是python的默认GUI模块库。
示例1：主窗口及标题

``` python
import tkinter as tk


app = tk.Tk()  #根窗口的实例(root窗口)
app.title('Tkinter root window')  #根窗口标题


theLabel = tk.Label(app, text='我的第2个窗口程序！')  #label组件及文字内容
theLabel.pack()  #pack()用于自动调节组件的尺寸


app.mainloop()  #窗口的主事件循环，必须的。
```


示例2：按钮

``` python
import tkinter as tk


class APP:
  def __init__(self, master):  #root 传参赋值给master
    frame = tk.Frame(master)  #frame 组件
    frame.pack(side=tk.LEFT, padx=10, pady=10)


    self.hi_there = tk.Button(frame, text='打招呼', bg='black', fg='white', command=self.say_hi)  #Button按钮, command中调用定义的方法
    self.hi_there.pack()


  def say_hi(self):
    print('卧槽，居然打了个招呼！~')


root = tk.Tk()
app = APP(root)


root.mainloop()
```


示例3：图片

``` python
from tkinter import *


root = Tk()
textLabel = Label(root,
         text='请重试！n您的操作不被允许！',  #文字支持换行
         justify=LEFT,  #左对齐
         padx=10,  #左边距10px
         pady=10)  #右边距10px 
textLabel.pack(side=LEFT)


#显示图片
photo = PhotoImage(file='tk_image.png')
imageLabel = Label(root, image=photo)
imageLabel.pack(side=RIGHT)


mainloop()
```

示例4：背景

``` python
from tkinter import *


root = Tk()


photo = PhotoImage(file='tk4_bg.png')
theLabel = Label(root,
         text='生存还是毁灭n这是一个问题',
         justify=LEFT,
         image=photo,
         compound=CENTER,
         font=('华文隶书', 20),
         fg='blue')
theLabel.pack()


mainloop()
```


示例5：按钮交互

``` python
from tkinter import *


def callback():
  var.set('吹吧你，我才不信呢！')


root = Tk()


frame1 = Frame(root)
frame2 = Frame(root)


var = StringVar()
var.set('请重试！n您的操作不被允许！')
textLabel = Label(frame1,
         textvariable=var,
         justify=LEFT)  #左对齐
textLabel.pack(side=LEFT)


#显示图片
photo = PhotoImage(file='tk_image.png')
imageLabel = Label(root, image=photo)
imageLabel.pack(side=RIGHT)


theButton = Button(frame2, text='我是超级管理员', command=callback)
theButton.pack()


frame1.pack(padx=10, pady=10)
frame2.pack(padx=10, pady=10)


mainloop()
```


示例6：选项按钮

``` python
from tkinter import *


root = Tk()


v = IntVar()


c = Checkbutton(root, text='测试一下', variable=v)  #v用来存放选中状态
c.pack()


l = Label(root, textvariable=v)
l.pack()  #未选中显示为0，选中显示1


mainloop()
```


示例7：多个方框选项

``` python
from tkinter import *


root = Tk()


GIRLS = ['西施', '貂蝉', '王昭君', '杨玉环']


v =  []
for girl in GIRLS:
  v.append(IntVar())
  b = Checkbutton(root, text=girl, variable=v[-1])
  b.pack(anchor=W)  #设置对齐方位，东E南S西W北N


mainloop()
```


示例8：多个圆点选项 Radiobutton

``` python
from tkinter import *


root = Tk()


v = IntVar()


Radiobutton(root, text='one', variable=v, value=1).pack(anchor=W)
Radiobutton(root, text='two', variable=v, value=2).pack(anchor=W)
Radiobutton(root, text='three', variable=v, value=3).pack(anchor=W)
Radiobutton(root, text='four', variable=v, value=4).pack(anchor=W)


mainloop()
```


示例9：内陷填充按钮选项 Radiobutton indicatoron

``` python
from tkinter import *


root = Tk()


LANGS = [
  ('C', 1),
  ('C++', 2),
  ('shell', 3),
  ('python', 4)]


v = IntVar()
v.set(1)


for lang, num in LANGS:  #对应列表中包含元组同时执行多个循环
  b = Radiobutton(root, text=lang, variable=v, value=num, indicatoron=False)
  b.pack(fill=X)


mainloop()
```


示例10：附带标题的圆点选项 LabelFrame

``` python
from tkinter import *


root = Tk()


group = LabelFrame(root, text='最好的开发语言是？', padx=5, pady=5)
group.pack(padx=10, pady=10)


LANGS = [
  ('C', 1),
  ('C++', 2),
  ('shell', 3),
  ('python', 4)]


v = IntVar()
v.set(1)


for lang, num in LANGS:  #对应列表中包含元组同时执行多个循环
  b = Radiobutton(group, text=lang, variable=v, value=num)
  b.pack(anchor=W)


mainloop()
```


示例11：输入框 Entry

``` python
from tkinter import *


root = Tk()


e = Entry(root)
e.pack(padx=20, pady=20)


e.delete(0, END)
e.insert(0, '默认文本...')


mainloop()
```


示例12：按钮和输入框交互

``` python
from tkinter import *


root = Tk()
root.title('输入框与按钮程序')


Label(root, text='作品:').grid(row=0, column=0)
Label(root, text='作者:').grid(row=1, column=0)


e1 = Entry(root)
e2 = Entry(root)
e1.grid(row=0, column=1, padx=10, pady=5)
e2.grid(row=1, column=1, padx=10, pady=5)


def show():  #当输入内容时点击获取信息会打印
  print('作品：《%s》' % e1.get())
  print('作者：《%s》' % e2.get())


Button(root, text='获取信息', width=10, command=show) 
       .grid(row=3, column=0, sticky=W, padx=10, pady=5)
Button(root, text='点击退出', width=10, command=root.quit) 
       .grid(row=3, column=1, sticky=E, padx=10, pady=5)
#退出按钮必须是双击打开.py文件才可以，而不是在IDLE下调试运行时


mainloop()
```


示例12：登陆框程序

``` python
from tkinter import *


root = Tk()
root.title('登陆程序')


Label(root, text='账号:').grid(row=0, column=0)
Label(root, text='密码:').grid(row=1, column=0)


v1 = StringVar()
v2 = StringVar()


e1 = Entry(root, textvariable=v1)
e2 = Entry(root, textvariable=v2, show='*')
e1.grid(row=0, column=1, padx=10, pady=5)
e2.grid(row=1, column=1, padx=10, pady=5)


def show():
  print('账号：%s' % e1.get())
  print('密码：%s' % e2.get())


Button(root, text='芝麻开门', width=10, command=show) 
       .grid(row=3, column=0, sticky=W, padx=10, pady=5)
Button(root, text='点击退出', width=10, command=root.quit) 
       .grid(row=3, column=1, sticky=E, padx=10, pady=5)
#退出按钮必须是双击打开.py文件才可以，而不是在IDLE下调试运行时


mainloop()
```


示例13：输入对错验证程序

``` python
from tkinter import *


root = Tk()
root.title('输入对错验证')


def test():
  if e1.get() == '张三':
    print('正确！')
    return True
  else:
    print('错误！')
    e1.delete(0, END)
    return False


v = StringVar()


#focusout指定在当前输入框失去焦点时，代表输入完，会去调用test校验<tab>键可测试
e1 = Entry(root, textvariable=v, validate='focusout', validatecommand=test)
e2 = Entry(root)
e1.pack(padx=10, pady=10)
e2.pack(padx=10, pady=10)


mainloop()
```


示例13：简单计算器程序

``` python
from tkinter import *


root = Tk()
root.title('计算器程序')


frame = Frame(root)
frame.pack(padx=10, pady=10)


v1 = StringVar()
v2 = StringVar()
v3 = StringVar()


def test(content):
  return content.isdigit()


testCMD = frame.register(test)
#focusout指定在当前输入框失去焦点时，代表输入完，会去调用test校验<tab>键可测试
e1 = Entry(frame, width=10, textvariable=v1, validate='key', 
      validatecommand=(testCMD, '%P')).grid(row=0, column=0)  #width的单位是字符数
Label(frame, text='+').grid(row=0, column=1)


e2 = Entry(frame, width=10, textvariable=v2, validate='key', 
      validatecommand=(testCMD, '%P')).grid(row=0, column=2)
Label(frame, text='=').grid(row=0, column=3)


e3 = Entry(frame, width=10, textvariable=v3, state='readonly').grid(row=0, column=4)


def calc():
  result = int(v1.get()) + int(v2.get())
  v3.set(str(result))


Button(frame, text='计算结果', command=calc).grid(row=1, column=2, pady=5)


mainloop()
```

示例14：按钮删除列表中的选项

``` python
from tkinter import *


master= Tk()


theLB = Listbox(master, selectmode=SINGLE, height=15)  #SINGLE单选，MULTIPLE多选，height设置显示项数
theLB.pack()


for item in ['笔', '墨', '纸', '砚']:
  theLB.insert(END, item)  #END表示最后一个


for item in range(11):
  theLB.insert(END, item)



theButton = Button(master, text='删除', 
          command=lambda x=theLB:x.delete(ACTIVE) ) #ACTIVE表示当前选中的值
theButton.pack()


mainloop()
```


示例15：为列表组件添加滚动条
安装垂直滚动条步骤：
1) 设置该组件的yscrollbarcommand选项为Scrollbar组件的set方法；
2) 设置Scrollbar组件的command选项为该组件的yview()方法。

``` python
from tkinter import *


root = Tk()
root.title('滚动条程序')


sb = Scrollbar(root)
sb.pack(side=RIGHT, fill=Y)


lb = Listbox(root, yscrollcommand=sb.set)


for i in range(1000):
  lb.insert(END, i)
lb.pack(side=LEFT, fill=BOTH)


#让滚动条与选项互通互连
sb.config(command=lb.yview)


mainloop()


示例16：滑块滚动条 Scale
from tkinter import *


root = Tk()
root.title('滑块程序')


s1 = Scale(root, from_=0, to=100, tickinterval=5, resolution=5, length=200)  #默认是垂直, tickinterval精度刻度, length单位是像素
s1.pack()


s2 = Scale(root, from_=0, to=100, tickinterval=5, orient=HORIZONTAL, length=400)
s2.pack()


def show():
  print(s1.get(), s2.get())


#获取滑块的当前位置，点击后才有效
Button(root, text='音量：', command=show).pack()


mainloop()
```

示例17：文本组件 Text  （插入按钮）

``` python
from tkinter import *


root = Tk()
root.title('Text')


text = Text(root, width=30, height=20)
text.pack()


#窗口中的文本可编辑
text.insert(INSERT, '这里是显示的文本信息内容。n')  #INSERT表示输入光标插入的位置
text.insert(END, '对比一下效果。')


def show():
  print('提交中...')  #此行内容显示在IDLE中


#插入一个Button组件
b1 = Button(text, text='提交', command=show)
text.window_create(INSERT, window=b1)  #将b1插入


mainloop()
```


示例18：文本组件 Text  （插入图片）

``` python
from tkinter import *


root = Tk()
root.title('Text')


text = Text(root, width=100, height=30)
text.pack()


photo = PhotoImage(file="tk_image.png")
def show_img():
  text.image_create(END, image=photo)


#插入一个图片
b1 = Button(text, text='插入图片', command=show_img)
text.window_create(INSERT, window=b1)  #将b1插入


mainloop()
```


示例19：文本组件 Text  （Indexes：索引定位）

``` python
from tkinter import *


root = Tk()
root.title('Text')


text = Text(root, width=30, height=10)
text.pack()
text.insert(INSERT, 'I love baidu.com！')


text.tag_add('tag1', '1.7', '1.12', '1.14')  #1.7~1.12 baidu  1.14 o
text.tag_add('tag2', '1.7', '1.12', '1.14')
text.tag_config('tag1', background='blue', foreground='yellow')
text.tag_config('tag2', foreground='red')  #文字会以red为准


mainloop()
```


示例20：文本组件中可点击连接

``` python
from tkinter import *
import webbrowser as wb


root = Tk()
root.title('GUI link show')


text = Text(root, width=30, height=5)
text.pack()


text.insert(INSERT, 'I love baidu.com!')
text.tag_add('link', '1.7', '1.16')
text.tag_config('link', foreground='blue', underline=True)


def show_arrow_cursor(event):
  text.config(cursor='arrow')


def show_xterm_cursor(event):
  text.config(cursor='xterm')


def click(event):
  wb.open('http://www.baidu.com')


#绑定事件
text.tag_bind('link', '<Enter>', show_arrow_cursor)  #<Enter>鼠标进入
text.tag_bind('link', '<Leave>', show_xterm_cursor)  #<Enter>鼠标离开
text.tag_bind('link', '<Button-1>', click)  #<Enter>鼠标点击


mainloop()
```


示例21：文本组件之MD5

``` python
from tkinter import *
import hashlib  #用于获取文件的MD5值，检查内容是否有修改


root = Tk()
root.title('link click')


text = Text(root, width=50, height=10)
text.pack()


text.insert(INSERT, 'I love www.baidu.com')
contents = text.get('1.0', END)


def getSig(contents):
  m = hashlib.md5(contents.encode())
  return m.digest()


sig = getSig(contents)


def check():
  contents = text.get('1.0', END)
  if sig != getSig(contents):
    print('内容有修改，是否保存？')
  else:
    print('无任何修改！')


Button(root, text='检查', command=check).pack()


mainloop()
```

示例22：文本组件之全文搜索

``` python
from tkinter import *


root = Tk()
root.title('link click')


text = Text(root, width=50, height=10)
text.pack()


text.insert(INSERT, 'I love www.baidu.com')


def getIndex(text, index):
  return tuple(map(int, str.split(text.index(index), '.')))


start = '1.0'  #开头的位置，第1行的第0个下标位置
while True:
  pos = text.search('o', start, stopindex=END)  #查找文本中字符o的位置
  if not pos:
    break
  print('找到啦，位置是:', getIndex(text, pos))
  start = pos + '+1c'  #'+1c'指向下一个字符


mainloop()
```


示例23：文本组件之撤销操作

``` python
from tkinter import *


root = Tk()
root.title('link click')


text = Text(root, width=50, height=10, undo=True)  #undo模式开启
text.pack()


text.insert(INSERT, 'I love www.baidu.com')


def show():
  text.edit_undo()


Button(root, text='撤销', command=show).pack()  #多次撤销会删除文本组件内的内容


mainloop()
```


示例24：绘制组件 Canvas

``` python
from tkinter import *


root = Tk()
root.title('Canvas')


w = Canvas(root, width=500, height=300)  #background='black' 改变背景色
w.pack()


#黄色的矩形
w.create_rectangle(50, 50, 450, 250, fill='yellow')  #参数：左边距, 上边距, 宽, 高
#红色的横线
w.create_line(0, 300//2, 500, 300//2, fill='red')
#蓝色的竖虚线
w.create_line(500//2, 0, 500//2, 300, fill='blue', dash=(4, 4))  #dash 虚线


mainloop()
```


示例25：绘制组件 Canvas （修改和删除图形）

``` python
from tkinter import *


root = Tk()
root.title('Canvas')


w = Canvas(root, width=500, height=300)  #background='black' 改变背景色
w.pack()


rect1 = w.create_rectangle(50, 50, 450, 250, fill='yellow')  #参数：左边距, 上边距, 宽, 高
line1 = w.create_line(0, 300//2, 500, 300//2, fill='red')
line2 = w.create_line(500//2, 0, 500//2, 300, fill='blue', dash=(4, 4))  #dash 虚线


w.coords(line1, 0, 25, 500, 25)  #移动位置
w.itemconfig(rect1, fill='red')
w.delete(line2)


Button(root, text='删除全部', command=(lambda x=ALL:w.delete(x))).pack()


mainloop()
```


示例26：绘制组件 Canvas （图形正中心）

``` python
from tkinter import *


root = Tk()
root.title('Canvas')


w = Canvas(root, width=600, height=300)
w.pack()




line1 = w.create_line(0, 0, 600, 300, fill='green', width=3)
line1 = w.create_line(600, 0, 0, 300, fill='green', width=3)
rect1 = w.create_rectangle(60, 30, 540, 270, fill='green')
rect2 = w.create_rectangle(120, 60, 480, 240, fill='yellow')


w.create_text(300, 150, text='Hello, python!')


mainloop()
```


示例27：绘制组件 Canvas （椭圆和圆形）

``` python
from tkinter import *


root = Tk()
root.title('Canvas')


w = Canvas(root, width=600, height=300)
w.pack()


w.create_rectangle(60, 30, 540, 270, dash=(4, 4))
w.create_oval(60, 30, 540, 270, fill='pink')  #椭圆是通过限定矩形的方式画出来，圆形通过正方形
#w.create_oval(60, 30, 300, 270, fill='pink')  #正方形对应正圆（60-300=30-270）
w.create_text(300, 150, text='wow~')


mainloop()
```


示例28：绘制组件 Canvas （五角星）

``` python
from tkinter import *
import math as m  #用到sin和cos数学函数


root = Tk()
root.title('Canvas')


w = Canvas(root, width=600, height=300, background='red')
w.pack()


center_x = 300
center_y = 150
r = 150


points = [
  #左上点
  center_x - int(r * m.sin(2 * m.pi / 5)),
  center_y - int(r * m.cos(2 * m.pi / 5)),
  #右上点
  center_x + int(r * m.sin(2 * m.pi / 5)),
  center_y - int(r * m.cos(2 * m.pi / 5)),
  #左下点
  center_x - int(r * m.sin(m.pi / 5)),
  center_y + int(r * m.cos(m.pi / 5)),
  #顶点
  center_x,
  center_y - r,
  #右下点
  center_x + int(r * m.sin(m.pi / 5)),
  center_y + int(r * m.cos(m.pi / 5)),
  ]


w.create_polygon(points, outline='yellow', fill='yellow')  #polygon多边形


mainloop()
```


示例29：绘制组件 Canvas （自定义画板）

``` python
#绘制一个极小的圆来代表一个点(tkinter本身不支持画点)
from tkinter import *


root = Tk()
root.title('Canvas draw tool')


w = Canvas(root, width=400, height=200, background='white')
w.pack()


def paint(event):
  x1, y1 = (event.x - 1), (event.y - 1)
  x2, y2 = (event.x + 1), (event.y + 1)
  w.create_oval(x1, y1, x2, y2, fill='red')


w.bind('<B1-Motion>', paint)  #<B1-Motion>绑定鼠标左键事件


Label(root, text='按住鼠标左键并移动，开始绘制吧！~~').pack(side=BOTTOM)


mainloop()
```


示例30：菜单组件 Menu （主菜单/下拉菜单/右键菜单/单多选菜单/按钮菜单/选项菜单(列表)）

``` python
from tkinter import *


root = Tk()
root.title('Main Menu Show')


def callback():
  print('你好~')


menubar = Menu(root)


#注册菜单：文件（下拉菜单）
filemenu = Menu(menubar, tearoff=False)  #来自主菜单，tearoff参数可让菜单窗口分离
filemenu.add_command(label='新建', command=callback)
filemenu.add_command(label='打开...', command=callback)
filemenu.add_separator()  #分割线
filemenu.add_command(label='保存', command=callback)
filemenu.add_separator()  #分割线
filemenu.add_command(label='退出', command=root.quit)
menubar.add_cascade(label='文件(W)', menu=filemenu)


#主菜单：编辑（下拉菜单）
editmenu = Menu(menubar, tearoff=False)  #来自主菜单
editmenu.add_command(label='撤销', command=callback)
editmenu.add_command(label='重做', command=callback)
editmenu.add_separator()  #分割线
editmenu.add_command(label='剪切', command=callback)
editmenu.add_command(label='复制', command=callback)
editmenu.add_command(label='粘贴', command=callback)
editmenu.add_separator()  #分割线
editmenu.add_command(label='全选', command=callback)
editmenu.add_separator()  #分割线
editmenu.add_command(label='查找...', command=callback)
menubar.add_cascade(label='编辑(B)', menu=editmenu)


#主菜单：多选√ checkbutton（下拉菜单）
openVar = IntVar()
saveVar = IntVar()
quitVar = IntVar()
optionmenu = Menu(menubar, tearoff=False)
optionmenu.add_checkbutton(label='多选项1', command=callback, variable=openVar)
optionmenu.add_checkbutton(label='多选项2', command=callback, variable=saveVar)
optionmenu.add_checkbutton(label='多选项3', command=callback, variable=quitVar)
menubar.add_cascade(label='选项(C)', menu=optionmenu)


#主菜单：单选√ radiobutton（下拉菜单）
otherVar = IntVar()
othermenu = Menu(menubar, tearoff=False)
othermenu.add_radiobutton(label='单选项1', command=callback, variable=otherVar, value=1)
othermenu.add_radiobutton(label='单选项2', command=callback, variable=otherVar, value=2)
othermenu.add_radiobutton(label='单选项3', command=callback, variable=otherVar, value=3)
menubar.add_cascade(label='其他(C)', menu=othermenu)


#内部菜单：按钮菜单 Menubutton
mb = Menubutton(root, text='按钮菜单...', relief=RAISED)
mb.pack()
openVar = IntVar()
saveVar = IntVar()
quitVar = IntVar()
optionmenu = Menu(mb, tearoff=False)
optionmenu.add_checkbutton(label='test', command=callback, variable=openVar)
optionmenu.add_checkbutton(label='test', command=callback, variable=saveVar)
optionmenu.add_checkbutton(label='test', command=callback, variable=quitVar)
mb.config(menu=optionmenu)


#内部菜单：选项菜单 OptionMenu
variable = StringVar()
variable.set('one')  #默认显示one
w = OptionMenu(root, variable, 'one', 'two', 'three')
w.pack()


#将列表添加到选项菜单 OptionMenu
OPTIONS = [
  '表项1',
  '对比2',
  '选项3',
  '其他4',
  '退出5'
  ]
var = StringVar()
var.set(OPTIONS[0])
o = OptionMenu(root, var, *OPTIONS)  #*星号解包可变参数列表为逐个元素
o.pack()


#主菜单：帮助
helpmenu = Menu(menubar, tearoff=False)
helpmenu.add_separator()  #分割线
helpmenu.add_command(label='关于...', command=callback)
helpmenu.add_separator()  #分割线
menubar.add_cascade(label='帮助(F1)', menu=helpmenu)


#弹出菜单(暂用编辑菜单作为右键)
frame = Frame(root, width=512, height=512)
frame.pack()
def popup(event):
  editmenu.post(event.x_root, event.y_root)
frame.bind('<Button-3>', popup)  #Button-3为鼠标右键，1为左键，2为中键


root.config(menu=menubar)  #menu参数会将菜单设置添加到root根窗口


mainloop()
```


示例31：事件绑定 bind （鼠标/按键/按键组合）

``` python
from tkinter import *


root = Tk()
root.title('Event bind')


frame = Frame(root, width=200, height=200)
#鼠标响应事件
def callback1(event):  #event形参获取事件描述，必备参数
  print('点击位置：', event.x, event.y)
frame.bind('<Button-1>', callback1)  #Button表示鼠标点击事件, 12345分别代表左中右键上滚下滚
frame.pack()


#键盘响应事件
def callback2(event):
  print(event.keysym)  #打印信息在IDLE, keysym指键盘所有按键
frame.bind('<Key>', callback2)
frame.focus_set()
frame.pack()


#鼠标即时响应事件
def callback3(event):
  print('点击位置：', event.x, event.y)
frame.bind('<Motion>', callback3)  #鼠标在窗口内只要有移动就一直输出位置
frame.pack()


#事件序列（按键组合），语法：<modifier-type-detail> 如
#点击鼠标左键：<Button-1>  ButtonRelease更安全，移除组件释放点击时不去触发
#点击H字母按键：<KeyPress-H>
#同时点击Ctrl+Shift+H：<Control-Shift-KeyPress-H>
mainloop()
```


示例32：消息组件 Message | 输入组件 Spinbox

``` python
from tkinter import *


root = Tk()
root.title('Module')


#消息组件：Message
m1 = Message(root, text='这是一个消息：', width=100)
m1.pack()


m2 = Message(root, text='这是一n则骇人听闻的长长长长长长长消息！', width=100)
m2.pack()


#输入组件：Spinbox  (可指定输入范围)
s1 = Spinbox(root, from_=0, to=5)
s1.pack()
s2 = Spinbox(root, values=('zero', 'one', 'two', 'three', 'four', 'five'))
s2.pack()


mainloop()
```


示例33：窗口布局管理器 PanedWindow

``` python
from tkinter import *


root = Tk()
root.title('Module')


#二窗格
'''
p = PanedWindow(orient=VERTICAL)
p.pack(fill=BOTH, expand=1)


top = Label(p, text='top pane')
p.add(top)


bottom = Label(p, text='bottom pane')
p.add(bottom)
'''
#三窗格，同时显示隐藏布局线（showhandle=True, sashrelief=SUNKEN）
p = PanedWindow(showhandle=True, sashrelief=SUNKEN)
p.pack(fill=BOTH, expand=1)


left = Label(p, text='left pane')
p.add(left)


q = PanedWindow(orient=VERTICAL, showhandle=True, sashrelief=SUNKEN)
p.add(q)


top = Label(q, text='top pane')
q.add(top)
bottom = Label(q, text='bottom pane')
q.add(bottom)


mainloop()
```


示例34：容器组件 Toplevel （创建顶级窗口，即弹出窗口）

``` python
from tkinter import *


root = Tk()
root.title('Toplevel')


def create():
  top = Toplevel()
  #top.attributes('-alpha', 0.5) 设置弹出的顶级窗口透明度：50%
  top.title('Toplevel demo...')


  msg = Message(top, text='I love python...')
  msg.pack()


Button(root, text='创建顶级窗口', command=create).pack()  #点击出现顶级窗口


mainloop()
```


示例35：几何管理类，包pack()，网格grid()，位置place()

``` python
#pack()  注意pack和grid不要混合使用
from tkinter import *


root = Tk()
root.title('pack')


#Listbox完全填充测试
listbox = Listbox(root)
listbox.pack(fill=BOTH, expand=True)  #fill=BOTH将窗口填满
for i in range(10):
  listbox.insert(END, str(i))


#Label纵向填充
Label(root, text='red', bg='red', fg='white').pack(fill=X)
Label(root, text='green', bg='green', fg='black').pack(fill=X)
Label(root, text='blue', bg='blue', fg='white').pack(fill=X)


#Label横向填充
Label(root, text='red', bg='red', fg='white').pack(side=LEFT)
Label(root, text='green', bg='green', fg='black').pack(side=LEFT)
Label(root, text='blue', bg='blue', fg='white').pack(side=LEFT)


mainloop()
```


grid()  注意pack和grid不要混合使用

``` python
from tkinter import *


root = Tk()
root.title('grid')


#两个sticky=W实现第一列左对齐
Label(root, text='用户名').grid(row=0, sticky=W)
Label(root, text='密码').grid(row=1, sticky=W)


#rowspan=2可以让图片横跨2行
photo = PhotoImage(file='tk_image.png')
Label(root, image=photo).grid(row=0, column=2, rowspan=2, padx=5, pady=5)


Entry(root).grid(row=0, column=1)
Entry(root, show='*').grid(row=1, column=1)


def callback():
  print('登陆中...')


#columnspan=3可以让按钮横跨3列
Button(text='提交', width=10, command=callback).grid(row=2, columnspan=3, pady=5)


mainloop()
```


place()  可以实现一些pack和grid实现不了的布局

``` python
from tkinter import *


root = Tk()
root.title('place')


#place位置布局测试
'''
photo = PhotoImage(file='tk_image.png')
Label(root, image=photo).pack()  #按钮就会出现在图片的组件上，实现组件叠加显示


def callback():
  print('正中靶心！！！')


#relx,rely相对父组件root的位置，0.5正中间，1最右边，0最左边，anchor=CENTER居中显示
Button(root, text='射击', command=callback).place(relx=0.5, rely=0.5, anchor=CENTER)
'''
Label(root, bg='red').place(relx=0.5, rely=0.5, relheight=0.75, relwidth=0.75, anchor=CENTER)
Label(root, bg='yellow').place(relx=0.5, rely=0.5, relheight=0.5, relwidth=0.5, anchor=CENTER)
Label(root, bg='blue').place(relx=0.5, rely=0.5, relheight=0.25, relwidth=0.25, anchor=CENTER)


mainloop()
```


示例35：对话框 （警告 showinfo | 消息 messagebox | 文件 filedialog | 颜色 colorchooser)

``` python
from tkinter import *
from tkinter import messagebox   #messagebox()需要单独导入
from tkinter import filedialog   #filedialog()需要单独导入
from tkinter import colorchooser  #colorchooser()需要单独导入
from tkinter.messagebox import *  #用户使用showinfo()


#警告对话框
showinfo(title='test', message='警告')


#消息对话框
result = messagebox.askokcancel('demo', '发射核弹？')  #返回值是True或False
print(result)  #根据用户按下了确定还是取消做进一步的操作


#文件对话框
root = Tk()
def callback1():
  filename = filedialog.askopenfilename(defaultextension='.py')  #指定文件后缀
  print(filename)  #返回的是文件的完整路径


Button(root, text='打开文件', command=callback1).pack()


#颜色选择对话框
def callback2():
  color_data = colorchooser.askcolor()  #调用windows的颜色选择器
  print(color_data)  #选择红色打印：((255.99609375, 0.0, 0.0), '#ff0000')


Button(root, text='选择颜色', command=callback2).pack()

mainloop()
```























