---
title: 20-SpringBoot外部配置文件热加载
date: 2024-05-27 14:53:26
index_img: https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241024154522.png
tags:
- SpringBoot
- 热加载
categories:
- 08_框架技术
- 04_SpringBoot
---

![image-20200708160944615](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708160946.png)



## 需求

系统遇到这样一个需求，线上环境在配置文件发生变动时，可以不用经过重启，通过刷新接口的方式得到配置文件的加载，主要目的是为了迅速部署，避免因手动重启，出现数据或任务丢失的问题。

## 外部配置

当启动 Spring Boot 项目的 jar 包时，可以通过`--spring.config.location`参数来指定外部配置文件的位置。例如，假设外部配置文件在`/Users/user/config/application.yml`，在命令行执行以下命令：

```bash
java -jar your-application.jar --spring.config.location=/Users/user/config/application.yml
```

还可以指定多个配置文件，使用逗号分隔。如：
`--spring.config.location=/Users/user/config/application.yml,/Users/user/config/database.yml`

这种方式在需要加载多个配置文件（如应用配置和数据库配置分开）时很有用。

## 实现

第一步，添加适合自己springboot版本的Springcloud context依赖，若Springboot版本低，maven可能会引不上高版本的context

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-context</artifactId>
    </dependency>
</dependencies>
```

这里参考 Spring-Cloud-Config 主要借助 `org.springframework.cloud.context.refresh.ContextRefresher` 这个类来实现配置刷新，因此需要对 SpringBoot 项目做一点修改。

### 代码演示

配置文件: application.yml

```yaml
server:
  refresh: ${random.long}
  key: refresh-test

config:
  uuid: ${random.uuid}
```

读取配置的Bean，两种获取方式分别如下

```java
@Component
@ConfigurationProperties(prefix = "server")
public class ServerConfig {
    private String key;
    private Long refresh;
}
```

开启刷新`@Value的`注解方式，注意下面的`@RefreshScoe`注解，这个必须有，否则更新后的配置不会同步

```java
@RefreshScope
@Component
public class ValueConfig {
    @Value("${config.uuid}")
    private String uuid;
}
```

测试 `Controller `如下

```java
@RestController
public class DemoController {
    @Autowired
    private ContextRefresher contextRefresher;

    @Autowired
    private ServerConfig serverConfig;

    @Autowired
    private ValueConfig valueConfig;

    @GetMapping(path = "/show")
    public String show() {
        JSONObject res = new JSONObject();
        res.put("biz", JSONObject.toJSONString(serverConfig));
        res.put("uuid", valueConfig.getUuid());
        return res.toJSONString();
    }

    @GetMapping(path = "/refresh")
    public String refresh() {
        new Thread(() -> contextRefresher.refresh()).start();
        return show();
    }
}
```

### 实例演示

启动上面的应用，然后开启愉快的测试，调用refresh接口，发现每次的返回都不一样（因为配置文件使用了random随机生成），但是访问show接口时，每次返回的都是一样的，也就是说refresh接口中确实实现了配置的刷新。

说明

- 使用`ConfigurationProperties`方式获取注解时，自动支持刷新配置
- 使用`@Value`注解的方式，需要开启`@RefreshScope`注解（上面没有演示不开启这个注解的情况, 建议有兴趣的可以自己尝试一下）

### 配置变更监听

既然配置能刷新，那么如果希望获取配置变更的事件，然后做一些其他的事情，是否ok呢？

其实进入 `ContextRefresher` 的源码，看下refresh接口，就很明确了

```java
public synchronized Set<String> refresh() {
    Map<String, Object> before = extract(
            this.context.getEnvironment().getPropertySources());
    addConfigFilesToEnvironment();
    Set<String> keys = changes(before,
            extract(this.context.getEnvironment().getPropertySources())).keySet();
    // 注意这一行，抛出了一个变更事件
    this.context.publishEvent(new EnvironmentChangeEvent(context, keys));
    this.scope.refreshAll();
    return keys;
}
```

从上面的源码中，借助spring的事件通知机制，很简单就可以知道该怎么做了

```java
import org.springframework.cloud.context.environment.EnvironmentChangeEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;

@Configuration
public class EnvConfiguration{
    @EventListener
    public void envListener(EnvironmentChangeEvent event) {
        System.out.println("conf change: " + event);
    }
}
```

注意下控制台的输出即可。