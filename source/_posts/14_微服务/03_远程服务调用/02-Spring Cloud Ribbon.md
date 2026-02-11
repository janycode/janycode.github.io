---
title: 02-Spring Cloud Ribbon
date: 2020-03-02 17:59:44
tags:
- 微服务
- Feign
- Ribbon
- SpringCloudAlibaba
categories: 
- 14_微服务
- 03_远程服务调用
---



![image-20200729130824878](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200729130826.png)

GitHub地址：https://github.com/Netflix/ribbon

官网地址：https://cloud.spring.io/spring-cloud-static/spring-cloud-netflix/2.1.0.RC2/single/spring-cloud-netflix.html

负载均衡实现：https://www.jb51.net/article/154446.htm



### 1. Ribbon 简介

Ribbon，是一个客户端的`负载均衡`器，它提供对大量的HTTP和TCP客户端的访问控制，可以实现服务的远程调用和服务的负载均衡协调。

7 种负载均衡策略：

![image-20200730212521771](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200730212522.png)



### 2. Ribbon 开发步骤

1. 依赖

```xml
<dependency>
	<groupId>org.springframework.cloud</groupId>
	<artifactId>spring-cloud-starter-netflix-ribbon</artifactId>
</dependency>
```

2. 编写配置类

```java
@Configuration
public class RibbonConfig {
    @Bean
    @LoadBalanced //启用负载均衡
    public RestTemplate createRT() {
        return new RestTemplate();
    }

    //负载均衡算法
    @Bean
    public IRule createRule() {
        //Ribbon的负载均衡算法规则
        //1.随机分配 随机策略
        RandomRule randomRule = new RandomRule();
        //2.权重响应时间分配规则 代替ResponseTimeRule 响应时间加权策略
        WeightedResponseTimeRule responseTimeRule = new WeightedResponseTimeRule();
        //3.最低并发策略 分配的时候选择目前并发量最小的
        BestAvailableRule bestAvailableRule = new BestAvailableRule();
        //4.轮训策略
        RoundRobinRule roundRobinRule = new RoundRobinRule();
        //5.重试策略 如果在配置时间内，无法选择服务，尝试选择一个服务 重试机制
        RetryRule retryRule = new RetryRule();
        //6.区域感知策略 就近访问
        ZoneAvoidanceRule zoneAvoidanceRule = new ZoneAvoidanceRule();
        //7.可用过滤策略 可用根据阈值进行服务过滤
        AvailabilityFilteringRule filteringRule = new AvailabilityFilteringRule();
        
        return randomRule;
    }
}
```

3. 启动类配置

```java
@SpringBootApplication
@EnableDiscoveryClient //服务注册和发现
@RibbonClients //启用Ribbon 实现服务的调用和负载均衡策略
public class OfferApiApplication {
    public static void main(String[] args) {
    	SpringApplication.run(OfferApiApplication.class,args);
    }
}
```

4. 接口封装

```java
// 消费者 controller
@Api(tags = "用户接口")
@RestController
@RequestMapping("api/user/")
public class UserController {
    @Autowired
    private UserService service;

    //校验昵称
    @GetMapping("checknickname/{name}")
    public R check(@PathVariable String name) {
        return service.checkN(name);
    }
    //注册
    @PostMapping("register.do")
    public R save(@RequestBody UserRegisterDto dto){
        return service.save(dto);
    }
}

// 消费者 service
public interface UserService {
    R checkN(String name);
    R save(UserRegisterDto dto);
}

// 消费者 serviceimpl
@Service
public class UserServiceImpl implements UserService {
    /**
     * RestTemplate提供了多种便捷访问远程Http服务的方法，如访问提供者服务的接口
     */
    @Autowired
    private RestTemplate restTemplate;

    @Override
    public R checkN(String name) {
        return restTemplate.getForObject("http://jerryProvider/provider/user/checkname.do?name=" + name, R.class);
    }

    @Override
    public R save(UserRegisterDto dto) {
        return restTemplate.postForObject("http://jerryProvider/provider/user/register.do", dto, R.class);
    }
}
```

