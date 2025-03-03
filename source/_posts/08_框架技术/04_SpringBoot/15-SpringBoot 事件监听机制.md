---
title: 15_SpringBoot 事件监听机制
date: 2022-03-19 15:54:52
tags:
- SpringBoot
- Spring事件
categories: 
- 08_框架技术
- 04_SpringBoot
---

![image-20200708160944615](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708160946.png)



![image-20220319155642419](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220319155643.png)

> 背景：
>
> 知道什么叫“以增量的方式应对变化的需求”吗？听过Spring监听机制吗？
>
> ![image-20220319160420380](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220319160421.png)

### 1. Spring事件机制

![image-20220319162914908](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220319162916.png)

#### 1.1 环境准备

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.6.4</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.jerry</groupId>
    <artifactId>springevent</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>springevent</name>
    <description>Demo project for Spring Boot</description>
    <packaging>jar</packaging>

    <properties>
        <java.version>1.8</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```



#### 1.2 发布方服务

eg: 订单服务

```java
/**
 * 订单服务
 *
 * @author Jerry(姜源)
 * @date 2022-03-19 13:56
 */
@Service
public class OrderService {

    @Autowired
    private EventPublisher eventPublisher;

    public void order() {
        //下单成功
        System.out.println("下单成功...");
        //发布通知（true:异步执行, false:同步执行）
        eventPublisher.publishEvent(new OrderSuccessEvent(this), true);
        System.out.println("main线程结束...");
    }
}
```



#### 1.3 事件监听

eg: 物流服务

```java
/**
 * 物流服务，监听OrderSuccessEvent
 *
 * @author Jerry(姜源)
 * @date 2022-03-19 13:56
 */
@Service
public class CarService implements ApplicationListener<OrderSuccessEvent> {

    @Override
    public void onApplicationEvent(OrderSuccessEvent event) {
        this.dispatch();
    }

    /**
     * 发车
     */
    @Order(1)
    public void dispatch() {
        System.out.println("发车咯...");
    }
}
```

eg: 短信服务

```java
/**
 * 短信服务
 *
 * @author Jerry(姜源)
 * @date 2022-03-19 13:56
 */
@Service
public class SmsService {

    /**
     * 发送短信
     *
     * @EventListener 指定监听的事件类, 注解方式可以不用实现ApplicationListener
     * @Order 默认是最低优先级,值越小优先级越高
     * @author Jerry(姜源)
     * @date 2022-03-19 15:32
     */
    @Order(0)
    @EventListener(OrderSuccessEvent.class)
    public void sendSms() {
        System.out.println("发送短信...");
    }
}
```



#### 1.4 自定义事件

```java
/**
 * 自定义事件，继承ApplicationEvent
 *
 * @author Jerry(姜源)
 * @date 2022-03-19 13:56
 */
public class OrderSuccessEvent extends ApplicationEvent {

    /**
     * 创建一个新的应用程序事件。
     *
     * @param source 事件最初发生的对象（从不 {@code null}）
     */
    public OrderSuccessEvent(Object source) {
        super(source);
    }
}
```



#### 1.5 事件发布器

```java
@Component
public class EventPublisher {

    @Autowired
    private ApplicationContext applicationContext;

    /**
     * 发布 Spring 事件
     *
     * @param source    事件源
     * @param asyncBool 异步标记
     * @return void
     * @author Jerry(姜源)
     * @date 2022-03-19 14:47
     */
    public void publishEvent(Object source, Boolean asyncBool) {
        if (asyncBool) {
            //异步线程任务
            ThreadPoolExecutor executor = new ThreadPoolExecutor(
                    1, 1, 5, TimeUnit.SECONDS,
                    new ArrayBlockingQueue<>(10),
                    r -> new Thread(r, "Spring事件发布线程_Thread_" + r.hashCode()),
                    new ThreadPoolExecutor.DiscardOldestPolicy()
            );
            executor.execute(() -> applicationContext.publishEvent(source));
            executor.shutdown();
        } else {
            applicationContext.publishEvent(source);
        }
    }
}
```



### 2. 测试验证

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class SpringEventTest {

    @Autowired
    private OrderService orderService;

    @Test
    public void testSpringEvent() {
        orderService.order();
    }
}
```

![image-20220319162953304](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220319162954.png)



当然了，最后还是要说一句，项目并发高了以后，也不可能用Spring监听机制的，MQ会更合适。

