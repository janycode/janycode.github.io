---
title: 05-ECharts数据可视化图表
date: 2018-5-13 21:36:21
tags:
- Bootstrap
- ECharts
categories: 
- 04_大前端
- 07_Bootstrap
---



官网：[https://echarts.apache.org/zh/index.html](https://echarts.apache.org/zh/index.html)

下载：[https://echarts.apache.org/zh/builder.html](https://echarts.apache.org/zh/builder.html)

实例：[https://echarts.apache.org/examples/zh/index.html](https://echarts.apache.org/examples/zh/index.html)

教程：[https://echarts.apache.org/zh/tutorial.html](https://echarts.apache.org/zh/tutorial.html)

(官网5分钟上手 ECharts)

### 1. ECharts 概述
ECharts 是一个使用 JavaScript 实现的开源数据可视化库，涵盖各行业图表，满足各种需求。
ECharts 遵循 Apache-2.0 开源协议，免费商用。
ECharts 兼容当前绝大部分浏览器（IE8/9/10/11，Chrome，Firefox，Safari等）及兼容多种设备，可随时随地任性展示。

### 2. ECharts 使用步骤
**① 引入 echarts.min.js 以及引入 jquery-3.5.1.min.js**
```html
<script src="echarts/echarts.min.js"></script>
<script src="js/jquery-3.5.1.min.js"></script>
```
或者 CDN 链接引入 JS 库：
```html
<script src="https://cdn.staticfile.org/echarts/4.3.0/echarts.min.js"></script>
<script src="https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js"></script>
```

**② 给定一个拥有 id 和宽高的 DOM 容器，如 div**
```html
<!--容器内不需要有内容-->
<div id="main" style="width: 600px; height: 400px"></div>
```

**③ 官网选择一个图表样式，编辑 option 填充 script 即可**
两个方法一组option参数。`init` 方法、`setOption` 方法、`option` 参数从官网图表样式中来。
```html
<script>
    $(function () {
            var eCharts = echarts.init(document.getElementById("main"));
            eCharts.setOption({
                // 图表属性 option
            });
    })
</script>
```

### 3. ECharts 官方示例
柱状图：
![ECharts数据可视化图表](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316145011.png)

柱状图示例源码：
```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>ECharts</title>
    <%--1.引入echarts.js--%>
    <script src="echarts/echarts.min.js"></script>
    <script src="js/jquery-3.5.1.min.js"></script>
    <script>
        $(function () {
            /* 3.初始化容器: 基于准备好的dom，初始化echarts实例 */
            var myChart = echarts.init(document.getElementById('main'));
            /* 4.设定echarts的属性: 指定图表的配置项和数据 */
            myChart.setOption({
                title: {
                    text: 'ECharts 入门示例'
                },
                tooltip: {},
                legend: {
                    data:['销量']
                },
                xAxis: {
                    data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }]
            });
        })
    </script>
</head>
<body>

<%--2.设定一个固定宽高的 DOM 容器--%>
<div id="main" style="width: 600px; height: 400px;"></div>

</body>
</html>
```

饼状图：
![ECharts数据可视化图表](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316145022.png)

饼状图示例源码：
```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>ECharts 饼状图</title>
    <script src="echarts/echarts.min.js"></script>
    <script src="js/jquery-3.5.1.min.js"></script>
    <script>
        $(function () {
            var eCharts = echarts.init(document.getElementById("main"));
            eCharts.setOption({
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',    // 设置图表类型为饼图
                        radius: '55%',  // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
                        data: [          // 数据数组，name 为数据项名称，value 为数据项值
                            {value: 235, name: '视频广告'},
                            {value: 274, name: '联盟广告'},
                            {value: 310, name: '邮件营销'},
                            {value: 335, name: '直接访问'},
                            {value: 500, name: '搜索引擎'}
                        ]
                    }
                ]
            });
        })
    </script>
</head>
<body>

<div id="main" style="width: 600px; height: 400px"></div>

</body>
</html>
```

### 4. ECharts 异步请求
官网教程和示例：[https://echarts.apache.org/zh/tutorial.html#异步数据加载和更新](https://echarts.apache.org/zh/tutorial.html#%E5%BC%82%E6%AD%A5%E6%95%B0%E6%8D%AE%E5%8A%A0%E8%BD%BD%E5%92%8C%E6%9B%B4%E6%96%B0)
![ECharts 数据可视化图表](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316145032.png)
echarts1.jsp

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Echarts饼状图</title>
    <script src="echarts/echarts.min.js"></script>
    <script src="js/jquery-3.2.1.min.js"></script>
    <script>
        $(function () {
            var eCharts = echarts.init(document.getElementById("main"));
            // 使用异步请求填充 xAxis的data，series的data
            $.get("${pageContext.request.contextPath}/demo01",{},function (data) {
                console.log(data);
                var option = {
                    xAxis: {
                        type: 'category',
                        data: data.list1
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: data.list2,
                        type: 'line',
                        smooth: true
                    }]
                };
                eCharts.setOption(option);
            },"json");
        })
    </script>
</head>
<body>

<div id="main" style="width: 600px;height: 400px"></div>

</body>
</html>
```

Demo01Servlet.java
```java
@WebServlet(name = "Demo01Servlet",urlPatterns = "/demo01")
public class Demo01Servlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("Demo01Servlet");
        SaleService saleService = new SaleServiceImpl();
        try {
            List<Sale> saleList = saleService.selectSalesList();
            List<String> weekList = new ArrayList<>();
            List<Integer> salesList = new ArrayList<>();
            for (Sale sale : saleList) {
                weekList.add(sale.getWeekName());
                salesList.add(sale.getSales());
            }
            Map<String,Object> map = new HashMap<>();
            map.put("list1",weekList);
            map.put("list2",salesList);
            JsonUtils.writeJsonStr(response,map);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```

Sale.java
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sale {
    private Integer id;
    private Integer sales;
    private String weekName;
}
```