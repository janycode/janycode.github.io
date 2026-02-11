---
title: 13-PlantUML插件快速生成时序图
date: 2023-03-08 10:04:22
tags: 
- IDEA
- SpringBoot
- 开发
categories:
- 00_先利其器
- 01_Intellij IDEA
---



参考资料：

* PlantUML 官方文档：https://plantuml.com/zh/
* PlantUML 在线渲染：https://www.min2k.com/tools/mermaid/

## 引言

最近在做系统设计的时候，发现要画不少时序图，以前我用的最顺手的工具是draw.io，后来也尝试了语雀自带的画图工具，感觉画画简单的图还行，但是复杂一点的，就比较吃力了。

![image-20250308100842364](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250308100843.png)

最开始看下官方文档，发现PlantUML类似MarkDown，似乎需要一点学习成本，简单用了一下，曲线还是挺平缓的，上手相当快！

## 一、什么是PlantUML？

**PlantUML** 是一个多功能组件，可快速、直接地创建图表。用户可以使用简单直观的语言起草各种图表。

PlantUML是一个开源工具，它允许我们用简单的文本描述来创建UML图，包括序列图、用例图、类图、对象图、活动图、组件图、部署图、状态图，以及我们今天要讲的时序图。

![image-20250308101003697](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250308101005.png)

除了UML图之外，PlantUML 还支持一系列其他图表，例如JSON数据、YAML数据、EBNF图表、架构图等等。PlantUML的一大优势，是图表完全用文本代码描述，这就意味着它可以作为文档嵌入到源代码中，也非常方便版本控制和多人协作，不管是迭代设计、文档编写、系统建模，PlantUML都能胜任。

## 二、快速入门

### PlantUML插件

为了便捷地使用PlantUML，许多流行的IDE和代码编辑器提供了集成PlantUML的插件，如Visual Studio Code、IntelliJ IDEA、Eclipse等。插件提供了实时预览、语法高亮和图表导出等功能，能帮助我们更快捷，更高效地画图，整体上IDEA的插件用起来体验最好，但是IDEA大家懂的，太占内存了，VS Code相对而言，用起来就会轻量很多。

- IntelliJ IDEA：比如 "PlantUML integration" 可以让我们直接在 IDE 中查看和编辑 PlantUML 图表

  ![image-20250308101106582](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250308101107.png)

- - 插件使用效果

![image-20250308101202924](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250308101204.png)

- VS Code也是一样，从插件市场搜索安装即可。

### Hello World!

我们先来看个最简单的例子，通过`->` 、`-->`和` :`就可以在参与者之间传递消息，不用明确声明参与者。

```
@startuml
老张 -> 老王 : 老王，你好啊
老王--> 老张: 老张，你好啊

老张 -> 老王: 最近有空一起喝茶
老张 <-- 老王: OK
@enduml
```

![image-20250308101457200](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250308101458.png)

## 三、PlantUML时序图语法

### 声明参与者

我们使用关键字participant 来声明参与者，就可以对该参与者进行更多的控制。声明的顺序就是默认的**显示顺序** 。我们也可以用这些关键字来声明参与者，给参与者设置不同的形状。

- actor（角色）
- boundary（边界）
- control（控制）
- entity（实体）
- database（数据库）
- collections（集合）
- queue（队列）

我们还可以通过 `as`关键字重命名参与者。

```
@startuml
participant Participant as Foo
actor       Actor       as Foo1
boundary    Boundary    as Foo2
control     Control     as Foo3
entity      Entity      as Foo4
database    Database    as Foo5
collections Collections as Foo6
queue       Queue       as Foo7
@enduml
```

![image-20250308101756317](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250308103826.png)

默认的颜色比较单调，也可以通过`#`来设置参与者的颜色：

```
@startuml
actor Bob #blue
' The only difference between actor
'and participant is the drawing
participant Alice #SkyBlue
participant "I have a really\nlong name" as L #00ff00

Alice->Bob: Authentication Request
Bob->Alice: Authentication Response
Bob->L: Log transaction
@enduml
```

![image-20250308101842864](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250308101844.png)

### 消息传递

在不同参与者之间，通过箭头+:来表示消息传递。

- 同步消息：

```
A -> B: 同步消息文本
```

![image-20250308101949606](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250308101950.png)

- 异步消息：由发送者A指向接收者B，表示A发送后不需要等待B立即处理。

```
A ->> B: 异步消息文本
```

![image-20250308102006472](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250308102007.png)

- 返回消息：通常从接收者返回到发送者，标识一个回应。

```
A <-- B: 返回消息文本
```

![image-20250308102025165](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250308102026.png)

- 自调用：一个参与者直接发送消息给自己，表示自我处理或运算。

  ```
  A ->A: 自调用
  ```

  ![image-20250308102042692](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250308102043.png)

整体效果：

![image-20250308102141209](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250308102142.png)

### 生命线与激活条

生命线（Lifeline）与激活条（Activation Bar）

在时序图中，生命线表示对象在一段时间内的活动状态，也就是从参与者往下延伸的那条虚线。激活条用来表示参与者或对象在处理某个任务期间的活动状态，是生命线的一部分，矩形条形式出现。

- 生命线的激活与撤销：可以用下面这些关键字来控制生命线的激活与撤销

- - activate: 显示参与者的活动状态开始
  - deactivate: 指示参与者的活动状态结束。
  - destroy: 用于表示参与者的生命线终结，通常表示对象生命周期的结束。

```
@startuml
participant User
User -> A: DoWork
activate A
A -> B: << createRequest >>
activate B
B -> C: DoWork
activate C
C --> B: WorkDone
destroy C
B --> A: RequestCreated
deactivate B
A -> User: Done
deactivate A
@enduml
```

![image-20250308102215147](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250308102218.png)

- 生命线的嵌套与颜色：我们还可以使用嵌套激活条来表示内部调用，并可以给生命线添加颜色。

```
@startuml
participant User
User -> A: DoWork
activate A #FFBBBB
A -> A: Internal call
activate A #DarkSalmon
A -> B: << createRequest >>
activate B
B --> A: RequestCreated
deactivate B
deactivate A
A -> User: Done
deactivate A
@enduml
```

![image-20250308102232088](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250308102233.png)

- 自动激活：在发送消息时自动显示激活条。

```
A->B++: 激活B并发送消息
```

![image-20250308102251041](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250308102252.png)

- 自动去激活：在接收回应时自动隐藏激活条。

```
A->B++: 激活B并发送消息
A <--B--: B去激活并回应消息
```

![image-20250308102304078](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250308102305.png)

### 分组和替代

- 分组：用于逻辑上分组一系列交互。

```
group 分组名
A -> B: 消息
...
end group
```

![image-20250308102357436](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250308102358.png)

- 替代（Alt/Else）：表示基于条件的替代执行流程。

```
alt 条件1
A -> B: 满足条件1的消息
else 条件2
A -> B: 满足条件2的消息
end
```

![image-20250308102407533](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250308102409.png)

### 注释

注释用于添加说明性文本。

- 可以用note left of，note right of或note over来控制注释相对节点的位置，还可以通过修改背景色来高亮显示注释。

```
@startuml
participant Alice
participant Bob
note left of Alice #aqua
This is displayed
left of Alice.
end note

note right of Alice: This is displayed right of Alice.

note over Alice: This is displayed over Alice.

note over Alice, Bob #FFAAAA: This is displayed\n over Bob and Alice.

note over Bob, Alice
This is yet another
example of
a long note.
end note
@enduml
```

![image-20250308102422537](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250308102423.png)

### 颜色

Choosing colors在 PlantUML 中，我们可以对时序图的各个元素自定义颜色，比如参与者（actors）、对象（objects）、激活条（activation bars)等，来让我们的时序图更加美观。在声明元素时，可以直接指定颜色，格式为#颜色代码。颜色代码可以是不同的形式：

- 直接指定颜色：颜色代码可以是一个十六进制颜色值，也可以是预定义的颜色名称。

```
@startuml
actor 用户  #Green
participant 参与者  #B4A7E5

用户-[#red]>参与者:消息
activate 参与者 #Blue

@enduml
```

![image-20250308102437424](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250308102438.png)

- 使用 `skinparam` 设置颜色：除了直接为特定元素指定颜色外，还可以使用 `skinparam` 全局设置时序图中的颜色。用这种方式更改元素的默认颜色比较方便：

```
@startuml
skinparam ActorBorderColor #DarkOrange
skinparam ParticipantBackgroundColor #SkyBlue

actor 用户
participant 参与者
@enduml
```

![image-20250308102454757](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250308102455.png)

当使用 `skinparam` 时，我们可以设置许多不同属性的颜色，如边框颜色（BorderColor）、背景颜色（BackgroundColor）、字体颜色（FontColor）和激活条颜色（SequenceGroupBodyBackgroundColor）。更多语法可以直接查看官方文档：顺序图的语法和功能，目前这些内容，已经足够我们常见的时序图需求了。

## 四、完整实例

我们接下来看一个稍微完整一点的例子，在这个例子中，我们的需求，是要在原本的登录的基础上，引入Google登录。

```
@startuml
skinparam ParticipantBackgroundColor #DeepSkyBlue

actor 用户 as c  #DeepSkyBlue
participant "客户端" as client
participant "服务网关" as ga
participant "用户服务" as user
database "数据库" as DB  #DeepSkyBlue
participant "Google服务" as google  #LightCoral

activate c #DeepSkyBlue
activate client #DeepSkyBlue

c->client:用户登录

group#LightCoral #LightCoral Google登录客户端流程
  client -> google : 请求Google OAuth登录
            activate google #DeepSkyBlue
            google-->client:登录url
            client->google:跳转登录页
            google -> google : 用户登录
            google --> client : Google登录Token
            deactivate google
end

|||

client -> ga : 登录请求
note right#LightCoral:新增登录方式，三方登录请求实体
activate ga #DeepSkyBlue
ga ->user:请求转发
activate user #DeepSkyBlue


alt#DeepSkyBlue 常规登录
    user -> DB : 查询用户信息
    activate DB #DeepSkyBlue
    DB -> user : 用户信息
    deactivate DB
    user->user:登录密码校验

|||
else Google登录
    group#LightCoral #LightCoral Google登录服务端流程
          user->google:验证token
          activate google #DeepSkyBlue
          google-->user:用户信息
          deactivate google
          user->user:存储或更新用户信息
    end group
end


user-->ga:登录结果
deactivate user
ga -> client : 响应
deactivate ga
alt#DeepSkyBlue 成功
        client -> c : 登录成功
else 失败
        client -> c : 登录失败
end
deactivate client
|||
@enduml
```

![image-20250308102520473](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250308102521.png)

## 五、总结

PlantUML使用起来整体上还是非常舒服的，对我而言，这几个特点让我爱不释手：

- 提供了类似MarkDown的所见即所得的使用体验，免去调整图形之扰
- PlantUML本质是文本，可以进行版本控制，多人协同
- 语雀支持文本画图的功能，可以嵌入PlantUML文本，支持在语雀文档里直接修改

PlantUML还有很强大的扩展性和灵活性，我们可以通过 官方文档：https://plantuml.com/zh/ 继续探索更多高级语法和技巧，来绘制更加复杂和丰富的图表。



## 附：补充

AI 如 deepseek 生成 mermaid 语法，然后直接使用 PlantUML 进行渲染，画图效率直接成倍提升。

而且修改起来也很便捷，因为从面向画图工具变成面向文本语言了。