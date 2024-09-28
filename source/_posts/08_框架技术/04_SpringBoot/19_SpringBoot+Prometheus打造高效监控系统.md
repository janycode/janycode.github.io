---
title: 19_SpringBoot+Prometheus打造高效监控系统
date: 2024-05-27 14:53:26
tags:
- SpringBoot
- Prometheus
categories:
- 08_框架技术
- 04_SpringBoot
---

![image-20200708160944615](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708160946.png)


## 引言

随着微服务架构的流行，对服务的监控和管理变得尤为重要。`Prometheus`作为一个开源的监控和告警工具，以其强大的数据采集、存储和查询能力，受到了众多开发者的青睐。

Spring Boot作为Java领域快速构建微服务的框架，与`Prometheus`的结合可以实现对Spring Boot应用的实时监控。

> 本文将介绍如何使用`Prometheus`监控Spring Boot应用。

## 一、 Prometheus 简介

`Prometheus` 是一个开源的系统监控和警报工具包，它通过采集和存储指标（`metrics`），提供了强大的数据查询语言，可以帮助我们分析和理解应用程序的行为。`Prometheus` 的核心组件是 `Prometheus Server`，它负责采集监控指标并提供查询接口。

Prometheus 官网：

> https://prometheus.io/

项目 github 地址：

> https://github.com/prometheus/prometheus

## 二、 Spring Boot Actuator

`Spring Boot Actuator` 是 Spring Boot 提供的一系列用于监控和管理 Spring Boot 应用的工具。它提供了许多端点（`endpoints`），例如 `/health`、`/info`、`/metrics` 等，这些端点可以公开应用的内部信息，如健康状态、配置信息和度量指标。

## 三、 集成 Prometheus 和 Spring Boot

要将 `Prometheus` 与 Spring Boot 应用集成，我们需要执行以下步骤：

### 3.1 添加依赖

首先，将 `Spring Boot Actuator` 和 `Micrometer Prometheus Registry` 添加到项目的依赖中。

- `Actuator` 提供了一系列内置端点，用于显示运行应用的性能信息，如健康状况、指标等。
- `Micrometer Prometheus registry` 会将这些指标格式化为 `Prometheus `可读格式。

```xml
<dependencies>
    <!-- Spring Boot Actuator -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
        <version>2.7.15</version>
    </dependency>
    <!-- Micrometer Prometheus Registry -->
    <dependency>
        <groupId>io.micrometer</groupId>
        <artifactId>micrometer-registry-prometheus</artifactId>
        <version>1.9.14</version>
    </dependency>
</dependencies>
```

### 3.2 配置 Actuator

接下来，`application.yml` 文件中配置 `Actuator` 以暴露 `Prometheus` 端点：

```yml
management:
  endpoints:
    web:
      exposure:
        include: '*'
  metrics:
    export:
      prometheus:
        enabled: true
```

其他配置属性：

```properties
management.endpoints.web.exposure.include=* # 暴露所有端点
management.metrics.export.prometheus.enabled=true #启用Prometheus导出器
management.endpoints.web.base-path=“/status” # 将/actuator/xxx修改为/status/xxx，防止被猜到
management.endpoints.server.request.metric-name=“application:request” # 自定义接口指标名
management.server.port=10001 #指定端口,默认跟server.port一样，可以防止被猜到
```

### 3.3 启动 Prometheus

下载并运行 `Prometheus Server`。可以从 Prometheus官网 下载适用于您操作系统的版本。

1.docker 方式 拉取安装镜像文件

```bash
docker pull prom/prometheus
```

2.创建并运行容器

```bash
docker run --name prometheus -d -p 9090:9090 prom/prometheus
```

对于需要自定义配置的部署，可以将主机上的自定义 `prometheus.yml` 文件挂载到容器中：

```bash
docker run -d --name prometheus -p 9090:9090 -v D:\developsoft\docker\DockerDesktopWSL\data\prometheus\prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus
```

3.浏览器访问 http://localhost:9090

![image-20240927114025501](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240927114026.png)

### 3.4 配置 Prometheus

拷贝 `prometheus.yml` 文件到宿主机 ：

```bash
docker cp prometheus:/etc/prometheus/prometheus.yml  D:\developsoft\docker\DockerDesktopWSL\data\prometheus\prometheus.yml
```

修改 `Prometheus` 的配置文件 `prometheus.yml`，添加 Spring Boot 应用作为目标（target）：

```yml
scrape_configs:
  - job_name: 'spring-boot-application'
    metrics_path: 'prometheus-demo/actuator/prometheus'
    scrape_interval: 15s
    static_configs:
      - targets: ['192.168.10.108:8091']
```

如上，`localhost:8080` 应替换为 Spring Boot 应用相应的 宿主机 和端口。

- `scrape_interval` 指定 `Prometheus` 从应用中抓取指标的频率。
- `metrics_path` 中 `prometheus-demo`为 springboot 应用的`contextPath`，`/actuator/prometheus `为默认路径

### 3.5 访问监控数据

启动 Spring Boot 应用后，`Prometheus` 将定期从 `/actuator/prometheus` 端点抓取指标数据。

## 四、 Grafana 可视化指标

虽然 `Prometheus` 提供了基本的数据查询和展示功能，但通常我们会使用 Grafana 来实现更丰富的数据可视化。Grafana 支持 `Prometheus` 作为数据源，可以方便地创建仪表板展示监控数据。

### 4.1 安装 Grafana

docker 方式 拉取安装镜像文件

```bash
docker pull grafana/grafana
```

创建并运行容器

```bash
docker  run -d --name=grafana  -p 3000:3000  grafana/grafana
```

浏览器访问 `http://localhost:3000`

默认用户名/密码：`admin/admin`

![image-20240927114148857](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240927114150.png)

### 4.2 配置数据源

在 Grafana 中配置 `Prometheus` 作为数据源，指向 `Prometheus Server` 的地址。

![image-20240927115656388](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240927115657.png)

### 4.3 创建仪表板

创建新的仪表板，并添加面板来展示关心的监控指标。

![image-20240927115714291](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240927115715.png)

- 点击左侧边栏的图标，选择 “`Dashboard`”，创建一个新的仪表盘。
- 在仪表盘中添加一个全新的面板。在这里，选择要显示的指标，决定可视化类型（图表、仪表、表格等），并自定义面板的外观。
- 选择 `Prometheus` 记录源，并使用 `Prometheus` 查询语言 (PromQL) 选择希望可视化的指标。例如，要显示 HTTP 请求的消耗，可以使用 `price(http_requests_total[5m])` 这样的查询。
- 保存面板和仪表盘。可以创建尽可能多的面板，以可视化 Spring Boot 应用中的特殊指标。

## 五、 自定义监控指标

除了 `Spring Boot Actuator` 提供的内置指标，我们还可以通过 `Micrometer` 添加自定义监控指标，以监控特定的业务逻辑或性能瓶颈。

### 5.1 添加自定义指标

在 Spring Boot 应用中，使用 `Micrometer` 的 API 添加自定义指标：

```java
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;

@RestController
public class CustomMetricsController {
    private final Counter ordersCounter;

    public CustomMetricsController(MeterRegistry registry) {
        this.ordersCounter = Counter.builder("orders_count")
                                    .description("The total number of orders")
                                    .register(registry);
    }

    @GetMapping("/order")
    public String createOrder() {
        ordersCounter.increment();
        return "Order created";
    }
}
```

### 5.2 在 Grafana 中展示自定义指标

在 Grafana 中，可以像展示其他 `Prometheus` 指标一样展示自定义指标。

