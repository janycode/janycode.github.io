---
title: 03 Kibana详解
date: 2020-05-30 21:15:39
index_img: https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220605211638.png
tags:
- 架构
- 分布式
- Kibana
- ELK
categories: 
- 15_分布式
- 07_分布式日志
---

![image-20230527095119](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527095119.png)

> ELK是一套针对日志数据做解决方案的框架，分别代表了三款产品：
>
> - E: ElasticSearch（ES），负责日志的存储和检索； 
> - L：Logstash，负责日志的收集，过滤和格式化； 
> - K：Kibana，负责日志的展示统计和数据可视化。

Kibana是一个开源的分析和可视化平台，设计用于和Elasticsearch一起工作。

你用Kibana来搜索，查看，并和存储在Elasticsearch索引中的数据进行交互。

你可以轻松地执行高级数据分析，并且以各种图标、表格和地图的形式可视化数据。

Kibana使得理解大量数据变得很容易。它简单的、基于浏览器的界面使你能够快速创建和共享动态仪表板，实时显示Elasticsearch查询的变化。

### 1. 安装Kibana

![image-20220612220111201](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612220112.png)

![image-20220612220127780](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612220128.png)

 

### 2. Kibana配置

 https://www.elastic.co/guide/en/kibana/current/settings.html

 

### 3. 访问Kibana

 Kibana是一个Web应用程序，你可以通过5601来访问它。例如：localhost:5601 或者 http://YOURDOMAIN.com:5601

当访问Kibana时，默认情况下，Discover页面加载时选择了默认索引模式。时间过滤器设置为最近15分钟，搜索查询设置为match-all(\*)

 

#### 3.1. 检查Kibana状态

http://localhost:5601/status

![image-20220612220553608](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612220554.png)

或者 http://192.168.101.5:5601/api/status 返回JSON格式状态信息

 

### 4. 用Elasticsearch连接到Kibana

 在你开始用Kibana之前，你需要告诉Kibana你想探索哪个Elasticsearch索引。第一次访问Kibana是，系统会提示你定义一个索引模式以匹配一个或多个索引的名字。

（提示：默认情况下，Kibana连接允许在localhost上的Elasticsearch实例。为了连接到一个不同的Elasticsearch实例，修改kabana.yml中Elasticsearch的URL，然后重启Kibana。）

为了配置你想要用Kibana访问的Elasticsearch索引：

　　1、访问Kibana UI。例如，localhost:56011 或者 http://YOURDOMAIN.com:5601

　　2、指定一个索引模式来匹配一个或多个你的Elasticsearch索引。当你指定了你的索引模式以后，任何匹配到的索引都将被展示出来。

　　（画外音：*匹配0个或多个字符； 指定索引默认是为了匹配索引，确切的说是匹配索引名字）

　　3、点击“**Next Step**”以选择你想要用来执行基于时间比较的包含timestamp字段的索引。如果你的索引没有基于时间的数据，那么选择“**I don’t want to use the Time Filter**”选项。

　　4、点击“**Create index pattern**”按钮来添加索引模式。第一个索引模式自动配置为默认的索引默认，以后当你有多个索引模式的时候，你就可以选择将哪一个设为默认。（提示：Management > Index Patterns）

![image-20220612220612487](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612220613.png)

![image-20220612220624330](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612220625.png)

![image-20220612220645911](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612220646.png)

现在，Kibana已经连接到你的Elasticsearch数据。Kibana展示了一个只读的字段列表，这些字段是匹配到的这个索引配置的字段。

 

### 5. Discover

你可以从Discover页面交互式的探索你的数据。你可以访问与所选择的索引默认匹配的每个索引中的每个文档。你可以提交查询请求，过滤搜索结构，并查看文档数据。你也可以看到匹配查询请求的文档数量，以及字段值统计信息。如果你选择的索引模式配置了time字段，则文档随时间的分布将显示在页面顶部的直方图中。

![image-20220612220705482](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612220706.png)

![image-20220612220720310](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612220721.png)

 

#### 5.1. 设置时间过滤

![image-20220612220737130](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612220737.png)

![image-20220612220748177](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612220749.png)

![image-20220612220758481](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612220759.png)

#### 5.2. 搜索数据

你可以在搜索框中输入查询条件来查询当前索引模式匹配的索引。在查询的时候，你可以使用Kibana标准的查询语言（基于Lucene的查询语法）或者完全基于JSON的Elasticsearch查询语言DSL。Kibana查询语言可以使用自动完成和简化的查询语法作为实验特性，您可以在查询栏的“选项”菜单下进行选择。

当你提交一个查询请求时，直方图、文档表和字段列表都会更新，以反映搜索结果。命中（匹配到的文档）总数会显示在工具栏中。文档表格中显示了前500个命中。默认情况下，按时间倒序排列，首先显示最新的文档。你可以通过点击“Time”列来逆转排序顺序。

![image-20220612220812557](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612220813.png)

![image-20220612220826181](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612220830.png)

 

##### 5.2.1. Lucene查询语法

Kibana查询语言基于Lucene查询语法。下面是一些提示，可能会帮到你：

- 为了执行一个文本搜索，可以简单的输入一个文本字符串。例如，如果你想搜索web服务器的日志，你可以输入关键字"**safari**"，这样你就可以搜索到所有有关"safari"的字段
- 为了搜索一个特定字段的特定值，可以用字段的名称作为前缀。例如，你输入"**status:200**"，将会找到所有status字段的值是200的文档
- 为了搜索一个范围值，你可以用括号范围语法，**[START_VALUE TO END_VALUE]**。例如，为了找到状态码是4xx的文档，你可以输入**status:[400 TO 499]**
- 为了指定更改复杂的查询条件，你可以用布尔操作符 **AND** , **OR** , 和 **NOT**。例如，为了找到状态码是4xx并且extension字段是php或者html的文档，你可以输入**status:[400 TO 499] AND (extension:php OR extension:html)**

![image-20220612221437782](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612221438.png)





##### 5.2.2. Kibana查询语法增强

**新的更简单的语法**

如果你熟悉Kibana的旧Lucene查询语法，那么你应该对这种新的语法也不会陌生。基本原理保持不变，我们只是简单地改进了一些东西，使查询语言更易于使用。

response:200 将匹配response字段的值是200的文档

用引号引起来的一段字符串叫短语搜索。例如，message:"Quick brown fox" 将在message字段中搜索"quick brown fox"这个短语。如果没有引号，将会匹配到包含这些词的所有文档，而不管它们的顺序如何。这就意味着，会匹配到"Quick brown fox"，而不会匹配"quick fox brown"。（画外音：引号引起来作为一个整体）

查询解析器将不再基于空格进行分割。多个搜索项必须由明确的布尔运算符分隔。注意，布尔运算符不区分大小写。

在Lucene中，response:200 extension:php 等价于 response:200 and extension:php。这将匹配response字段值匹配200并且extenion字段值匹配php的文档。

如果我们把中间换成or，那么response:200 or extension:php将匹配response字段匹配200 或者 extension字段匹配php的文档。

默认情况下，and 比 or 具有更高优先级。

response:200 and extension:php or extension:css 将匹配response是200并且extension是php，或者匹配extension是css而response任意

括号可以改变这种优先级

response:200 and (extension:php or extension:css) 将匹配response是200并且extension是php或者css的文档

还有一种简写的方式：

response:(200 or 404) 将匹配response字段是200或404的文档。字符值也可以是多个，比如：tags:(success and info and security)

还可以用not

not response:200 将匹配response不是200的文档

response:200 and not (extension:php or extension:css) 将匹配response是200并且extension不是php也不是css的文档

范围检索和Lucene有一点点不同

代替 byte:>1000，我们用byte > 1000

\>, >=, <, <= 都是有效的操作符

response:* 将匹配所有存在response字段的文档

通配符查询也是可以的。machine.os:win* 将匹配machine.os字段以win开头的文档，像"windows 7"和"windows 10"这样的值都会被匹配到。

通配符也允许我们一次搜索多个字段，例如，假设我们有machine.os和machine.os.keyword两个字段，我们想要搜索这两个字段都有"windows 10"，那么我们可以这样写"machine.os*:windows 10"

##### 5.2.3. 刷新搜索结果

![image-20220612221450031](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612221451.png)

####  5.3. 按字段过滤

![image-20220612221503906](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612221504.png)

![image-20220612221517235](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612221518.png)

以上是控制列表显示哪些字段，还有一种方式是在查看文档数据的时候点那个像书一样的小图标

![image-20220612221529131](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612221530.png)

 

删除也是可以的

![image-20220612221540765](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612221541.png)

我们还可以编辑一个DSL查询语句，用于过滤筛选，例如

![image-20220612221550800](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612221551.png)

 

#### 5.4. 查看文档数据

![image-20220612221640929](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612221641.png)

![image-20220612221657572](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612221658.png)

 

#### 5.5. 查看文档上下文

![image-20220612221705901](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612221706.png)

![image-20220612221715200](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612221716.png)

 

#### 5.6. 查看字段数据统计

![image-20220612221740934](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612221741.png)

### 6. Visualize

 Visualize使得你可以创建在你的Elasticsearch索引中的数据的可视化效果。然后，你可以构建dashboard来展示相关可视化。

Kibana可视化是基于Elasticsearch查询的。通过用一系列的Elasticsearch聚集来提取并处理你的数据，你可以创建图片来线上你需要了解的趋势、峰值和低点。

#### 6.1. 创建一个可视化

为了创建一个可视化的视图：

第1步：点击左侧导航条中的“**Visualize**”按钮

第2步：点击“Create new visualization”按钮或者**加号(+)**按钮

第3步：选择一个可视化类型

第4步：指定一个搜索查询来检索可视化数据

第5步：在可视化的构建器中选择Y轴的聚合操作。例如，sum，average，count等等

第6步：设置X轴

例如：

![image-20220612221752176](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612221752.png)

![image-20220612221801752](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612221802.png)

![image-20220612221818502](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612221819.png)

![image-20220612221828975](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612221829.png)

 

更多请看这里:

https://www.elastic.co/guide/en/kibana/current/createvis.html

https://www.elastic.co/guide/en/kibana/current/xy-chart.html

https://www.elastic.co/guide/en/kibana/current/visualize.html

 

### 7. Dashboard

 Kibana仪表板显示可视化和搜索的集合。你可以安排、调整和编辑仪表板内容，然后保存仪表板以便共享它。

#### 7.1. 构建一个Dashboard

第1步：在导航条上点击“**Dashboard**”

第2步：点击“Create new dashboard”或者“加号(+)”按钮

第3步：点击“Add”按钮

第4步：为了添加一个可视化，从可视化列表中选择一个，或者点击“Add new visualization”按钮新创建一个

第5步：为了添加一个已保存的查询，点击“Saved Search”选项卡，然后从列表中选择一个

第6步：当你完成添加并且调整了dashboard的内容后，去顶部菜单栏，点击“Save”，然后输入一个名字。

默认情况下，Kibana仪表板使用浅色主题。要使用深色主题，单击“选项”并选择“使用深色主题”。要将dark主题设置为默认，请转到管理>Management > Advanced ，并将dashboard:defaultDarkTheme设置为On。

![image-20220612221850745](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612221851.png)

![image-20220612221857220](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612221858.png)

![image-20220612221910244](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612221911.png)

 

### 8. Monitoring

```
Elasticsearch控制台打印日志
[2018-08-15T14:48:26,874][INFO ][o.e.c.m.MetaDataCreateIndexService] [Px524Ts] [.monitoring-kibana-6-2018.08.15] creating index, cause [auto(bulk api)], templates [.monitoring-kibana], shards [1]/[0], mappings [doc]

Kibana控制台打印日志
log   [03:26:53.605] [info][license][xpack] Imported license information from Elasticsearch for the [monitoring] cluster: mode: basic | status: active
```

![image-20220612221927124](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612221928.png)

![image-20220612221936599](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612221937.png)

![image-20220612221950020](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612221950.png)

![image-20220612222007796](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612222008.png)

![image-20220612222019870](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220612222020.png)

https://www.elastic.co/guide/en/kibana/current/elasticsearch-metrics.html

 

 



