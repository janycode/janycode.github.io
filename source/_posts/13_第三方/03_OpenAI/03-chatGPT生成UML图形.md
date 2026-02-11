---
title: 03-chatGPT生成UML图形
date: 2023-04-21 13:28:42
tags:
- 第三方
- OpenAI
- chatGPT
categories: 
- 13_第三方
- 03_OpenAI
---

![image-20230420144823328](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230420144824.png)

参考资料（Mermaid）：https://mermaid.live/

参考资料（PlantUML）：https://plantuml.com/zh/class-diagram

参考工具（IDEA Plugin）：[PlantUML Integration](https://plugins.jetbrains.com/plugin/7017-plantuml-integration)



### 1. 生成流程图

#### 1.1 基于 Mermaid 绘制

> 基于在线的 markdown 文本语法的 `Mermaid` 图表绘制工具：https://mermaid.live/

示例：

```
实现流程图，功能为进销存的详细 mermaid 数据流程图，内容使用中文，以markdown 格式代码输出
```

![image-20230421112635304](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230421112636.png)

![image-20230421112648972](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230421112649.png)



#### 1.2 基于 PlantUML 绘制

> 基于 IDEA 插件 PlantUML Integration 新建 xxx.puml 文件，即可实时预览语法解析的图形(可点击定位)。

```
你是一个java架构师，请用PlantUML语法画一个秒杀核心逻辑的流程图
```

![image-20230524140606822](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230524140608.png)

![image-20230524141007639](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230524141008.png)



### 2. 生成时序图

#### 2.1 基于 Mermaid 绘制

> 基于在线的 markdown 文本语法的 `Mermaid` 图表绘制工具：https://mermaid.live/

示例1：

```
实现商品秒杀流程的 mermaid 的 时序图，内容使用中文，以markdown 格式代码输出，并通过 https://mermaid.live 进行生成验证不报错
```

![image-20230421111119972](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230421111122.png)

![image-20230421111147814](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230421111148.png)

示例2：

```
实现商品秒杀流程的 mermaid 的 时序图，内容使用中文，且流程中标记出使用redis缓存的技术，以markdown 格式代码输出，并通过 https://mermaid.live 进行生成验证不报错
```

![image-20230421111405177](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230421111406.png)

![image-20230421111420824](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230421111422.png)

#### 2.2 基于 PlantUML 绘制

> 基于 IDEA 插件 PlantUML Integration 新建 xxx.puml 文件，即可实时预览语法解析的图形(可点击定位)。

```
你是一个java架构师，请用PlantUML语法画一个秒杀核心逻辑的时序图
```

![image-20230524141200492](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230524141201.png)

![image-20230524141246251](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230524141247.png)



### 3. 生成类图

#### 3.1 基于 PlantUML 绘制

> 基于 IDEA 插件 PlantUML Integration 新建 xxx.puml 文件，即可实时预览语法解析的图形(可点击定位)。

```
你是一个java架构师，请基于jdk1.8生成 List 接口所有实现类的plantUML语法的类图，类图中只需要体现类，不需要体现类中的方法
```

![image-20230524204408073](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230524204409.png)

![image-20230524204454533](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230524204455.png)