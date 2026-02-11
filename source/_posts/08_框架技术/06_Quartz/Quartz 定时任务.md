---
title: Quartz 定时任务
date: 2018-6-21 23:59:45
tags:
- Spring
- Quartz
categories: 
- 08_框架技术
- 06_Quartz
---

![image-20200630095455577](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200630095456.png)



### 1. 入门

Quartz 官网：http://www.quartz-scheduler.org/

Quartz 入门：http://www.quartz-scheduler.org/documentation/2.4.0-SNAPSHOT/quick-start-guide.html

Quartz `定时任务调度框架`，可以实现诸如：

* 想在30分钟后，查看订单是否支付，未支付则取消订单；
* 想在每月29号，信用卡自动还款
* ...

Quartz 要做定时任务的调度，设置好`触发`时间规则，以及相应的`任务`即可。

Quartz 是 OpenSymphony 开源组织在 Job scheduling 领域又一个开源项目，完全由 Java 开发，可以用来执行定时任务，类似于 java.util.Timer。但是相较于 Timer， Quartz 增加了很多功能：

* **持久性作业** - 就是保持调度定时的状态；
* **作业管理** - 对调度作业进行有效的管理。



### 2. 使用

![image-20200630130618198](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200630130619.png)

Quartz 核心类：

- **调度器**：`Scheduler`
    所有的调度都由它来控制，是 Quartz 的大脑，所有任务都由它管理。
- **任务**：`JobDetail`
    Job 定时执行的事情（定义业务逻辑）；JobDetail 基于 Job 进一步包装，指定了更详细的属性，如标识等。
- **触发器**：Trigger，包括 SimpleTrigger 和 `CronTrigger`
    可以指定给某个任务，配置该任务的触发机制。



#### 2.1 依赖

```xml
<dependency>
    <groupId>org.quartz-scheduler</groupId>
    <artifactId>quartz</artifactId>
    <version>2.3.2</version>
</dependency>
```



#### 2.2 任务 Job

```java
import org.quartz.Job;
import org.quartz.JobDetail;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import java.util.Date;

public class DoTask implements Job {
    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        // 创建工作详情
        JobDetail jobDetail = jobExecutionContext.getJobDetail();
        // 获取工作名称
        String jobName = jobDetail.getKey().getName();  // 任务名
        String jobGroup = jobDetail.getKey().getGroup();  // 任务组
        System.out.println(
                "JOB:" + jobName + "," + jobGroup + " -- " + DoTask.class.getName() + ":" + new Date()
        );
    }
}
```



#### 2.3 测试

```java
import com.demo.task.DoTask;
import org.quartz.*;
import org.quartz.impl.StdSchedulerFactory;

import java.util.GregorianCalendar;

public class TestQuartz {
    public static void main(String[] args) throws SchedulerException {
        testSimpleTrigger();
    }

    /**
     * 启动定时任务
     * 注意：定时任务 与 junit 单元测试 线程冲突，不能使用 @Test 来测试
     */
    public static void testSimpleTrigger() throws SchedulerException {
        // 创建任务调度器
        Scheduler scheduler = StdSchedulerFactory.getDefaultScheduler();

        // 创建 job，任务，执行的具体任务即 DoTask 中的 execute()
        JobDetail job = JobBuilder.newJob(DoTask.class)
                .withIdentity("任务1", "群组1")  // 自定义name/group
                .build();

        // 创建 trigger，触发条件类
        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("触发器1", "群组1")  // 自定义name/group
                .startNow()  // 一旦加入 scheduler 则立即生效执行 1 次，并开始计时
                .withSchedule(SimpleScheduleBuilder.simpleSchedule()
                        .withIntervalInSeconds(1)  // 每隔 1s 执行 1 次
                        //.repeatForever()  // 一直执行，直到结束时间
                        .withRepeatCount(5)  // 执行 5 次
                        )
                // 设置结束时间（月份参数为 当前月份 - 1 即为当前月份的时间）
                .endAt(new GregorianCalendar(2018, 6-1, 30, 12, 30).getTime())
                .build();

        // 调度器加入 job 和 trigger
        scheduler.scheduleJob(job, trigger);
        // 启动任务调度
        scheduler.start();
    }
}
```

Job 执行 execute() 方法的时候，可以获取到 JobExecutionContext 中的信息：

![image-20200630131044877](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200630131046.png)



### 3. 触发器

#### 3.1 SimpleTrigger

```java
// 创建 trigger，触发条件类
SimpleTrigger trigger = TriggerBuilder.newTrigger()
    .withIdentity("触发器1", "群组1")  // 自定义name/group
    .startNow()  // 一旦加入 scheduler 则立即生效执行 1 次，并开始计时
    .withSchedule(SimpleScheduleBuilder.simpleSchedule()
                  .withIntervalInSeconds(1)  // 每隔 1s 执行 1 次
                  //.repeatForever()  // 一直执行，直到结束时间
                  .withRepeatCount(5)  // 执行 5 次
                 )
    // 设置结束时间（月份参数为 当前月份 - 1 即为当前月份的时间）
    .endAt(new GregorianCalendar(2020, 6-1, 30, 12, 30).getTime())
    .build();
```



#### 3.2 CronTrigger(★)

适合更复杂的任务，支持类似于 linux cron 的语法，并且更强大。

如：

```java
public static void testCronTrigger() throws SchedulerException {
    // 创建任务调度器
    Scheduler scheduler = StdSchedulerFactory.getDefaultScheduler();

    // 创建 job，任务，执行的具体任务即 DoTask 中的 execute()
    JobDetail job = JobBuilder.newJob(DoTask.class)
        .withIdentity("任务1", "群组1")  // 自定义name/group
        .build();

    // 创建 trigger，触发条件类
    CronTrigger trigger = TriggerBuilder.newTrigger()
        .withIdentity("触发器1", "群组1")  // 自定义name/group
        /* scheduleExpression：秒 分 时 日 月 星期 年 (一般不指定年) */
        .withSchedule(CronScheduleBuilder.cronSchedule("*/2 * 10-12 * * ?"))
        .build();

    // 调度器加入 job 和 trigger
    scheduler.scheduleJob(job, trigger);
    // 启动任务调度
    scheduler.start();
}
```



##### 3.2.1 cron 表达式组成

表达式组成："`秒 分 时 日 月 星期 [年]`"，年可选，一般不指定。

如："10 20 18 3 5 ?" 代表 "5月3日18点20分10秒，星期不确定"

> 注意：因为 jar 包版本的问题，Corn 表达式中 0 可能不支持，替换为 * 即可。

Corn 表达式校验和生成：

* 校验：http://www.bejson.com/othertools/cronvalidate/

* 生成：http://www.bejson.com/othertools/cron/



| 位置 | 时间域 | 允许值 | 特殊值 |
| :----: | :----: | :----: | :----: |
| 1 | 秒 | 0~59 | , - * /   四个字符 |
| 2 | 分 | 0~59 | , - * /   四个字符 |
| 3 | 时 | 0~23 | , - * /   四个字符 |
| 4 | 日 | 1~31 | ,- * ? / L W C   八个字符 |
| 5 | 月 | 1~12 | , - * /   四个字符 |
| 6 | 星期 | 1~7 | , - * ? / L C #   八个字符 |
| 7 | 年(可选) | 大于当前时间 | , - * /   四个字符 |



##### 3.2.2 cron 表达式符号

每一个域都使用数字，但还可以出现如下特殊字符，它们的含义是：

（1）`*`：**表示匹配该域的任意值**。假如在 Minutes 域使用*, 即表示每分钟都会触发事件。

（2）`?`：**只能用在 DayofMonth 和 DayofWeek 两个域。它也匹配域的任意值，但实际不会。**因为DayofMonth和DayofWeek会相互影响。例如想在每月的20日触发调度，不管20日到底是星期几，则只能使用如下写法： 13 13 15 20 * ?, 其中最后一位只能用？，而不能使用*，如果使用*表示不管星期几都会触发，实际上并不是这样。

（3）`-`：**表示范围**。例如在Minutes域使用5-20，表示从5分到20分钟每分钟触发一次 

（4）`/`：**表示起始时间开始触发，然后每隔固定时间触发一次**。例如在Minutes域使用5/20,则意味着5分钟触发一次，而25，45等分别触发一次. 

（5）`,`：**表示列出枚举值**。例如：在Minutes域使用5,20，则意味着在5和20分每分钟触发一次。 

（6）`L`：**表示最后，只能出现在DayofWeek和DayofMonth域**。如果在DayofWeek域使用5L,意味着在最后的一个星期四触发。 

（7）`W`：**表示有效工作日(周一到周五),只能出现在DayofMonth域，系统将在离指定日期的最近的有效工作日触发事件**。例如：在 DayofMonth使用5W，如果5日是星期六，则将在最近的工作日：星期五，即4日触发。如果5日是星期天，则在6日(周一)触发；如果5日在星期一到星期五中的一天，则就在5日触发。另外一点，W的最近寻找不会跨过月份 。

（8）`LW`：**这两个字符可以连用，表示在某个月最后一个工作日，即最后一个星期五**。 

（9）`#`：**用于确定每个月第几个星期几，只能出现在DayofWeek域**。例如在4#2，表示某月的第二个星期三。



##### 3.2.3  cron 表达式示例

* `0/20 * * * * ?`   表示每20秒 调整任务
* `0 0 2 1 * ?`   表示在每月的1日的凌晨2点调整任务
* `0 15 10 ? * MON-FRI`   表示周一到周五每天上午10:15执行作业
* `0 15 10 ? 6L 2002-2006`   表示2002-2006年的每个月的最后一个星期五上午10:15执行作
* `0 0 10,14,16 * * ?`   每天上午10点，下午2点，4点 
* `0 0/30 9-17 * * ?`   朝九晚五工作时间内每半小时 
* `0 0 12 ? * WED`    表示每个星期三中午12点 
* `0 0 12 * * ?`   每天中午12点触发 
* `0 15 10 ? * *`    每天上午10:15触发 
* `0 15 10 * * ?`     每天上午10:15触发 
* `0 15 10 * * ? *`    每天上午10:15触发 
* `0 15 10 * * ? 2005`    2005年的每天上午10:15触发 
* `0 * 14 * * ?`     在每天下午2点到下午2:59期间的每1分钟触发 
* `0 0/5 14 * * ?`    在每天下午2点到下午2:55期间的每5分钟触发 
* `0 0/5 14,18 * * ?`     在每天下午2点到2:55期间和下午6点到6:55期间的每5分钟触发 
* `0 0-5 14 * * ?`    在每天下午2点到下午2:05期间的每1分钟触发 
* `0 10,44 14 ? 3 WED`    每年三月的星期三的下午2:10和2:44触发 
* `0 15 10 ? * MON-FRI`    周一至周五的上午10:15触发 
* `0 15 10 15 * ?`    每月15日上午10:15触发 
* `0 15 10 L * ?`    每月最后一日的上午10:15触发 
* `0 15 10 ? * 6L`    每月的最后一个星期五上午10:15触发 
* `0 15 10 ? * 6L 2002-2005`   2002年至2005年的每月的最后一个星期五上午10:15触发 
* `0 15 10 ? * 6#3`   每月的第三个星期五上午10:15触发



### 4. Spring+Quartz(★)

#### 4.1 依赖

```xml
<!-- Quartz -->
<dependency>
    <groupId>org.quartz-scheduler</groupId>
    <artifactId>quartz</artifactId>
    <version>2.3.2</version>
</dependency>
<!-- spring 事务 -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-tx</artifactId>
    <version>5.2.6.RELEASE</version>
</dependency>
<!-- spring context -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context-support</artifactId>
    <version>5.2.6.RELEASE</version>
</dependency>
```



#### 4.2 任务 Job

```java
import org.quartz.Job;
import org.quartz.JobDetail;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import java.util.Date;

public class DoTask implements Job {
    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        // 创建工作详情
        JobDetail jobDetail = jobExecutionContext.getJobDetail();
        // 获取工作名称
        String jobName = jobDetail.getKey().getName();  // 任务名
        String jobGroup = jobDetail.getKey().getGroup();  // 任务组
        System.out.println(
                "JOB:" + jobName + "," + jobGroup + " -- " + DoTask.class.getName() + ":" + new Date()
        );
    }
}
```



#### 4.3 xml 配置

applicationContext.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--
		Spring 整合 Quartz 配置步骤：
		1. 配置工作任务 Job
		2. 配置触发器 Trigger，并绑定 Job，配置执行时间规则
		3. 配置调度器 Scheduler，并注册 Trigger
	-->
    
    <!-- 配置任务 -->
    <bean id="jobDetail" class="org.springframework.scheduling.quartz.JobDetailFactoryBean">
        <property name="name" value="job1"/>  <!-- 指定 Job 名称 -->
        <property name="group" value="group1"/>  <!-- 指定 Job 分组 -->
        <property name="jobClass" value="com.deo.task.DoTask"/>  <!-- 指定 Job 类 -->
    </bean>

    <!-- 配置触发器（绑定 任务 + 表达式） -->
    <bean id="cronTrigger" class="org.springframework.scheduling.quartz.CronTriggerFactoryBean">
        <property name="name" value="trigger1"/>  <!-- 指定 Trigger 名称 -->
        <property name="group" value="trigger_group1"/>  <!-- 指定 Trigger 分组 -->
        <property name="jobDetail" ref="jobDetail"/>  <!-- 绑定 JobDetail -->
        <!-- 每隔 2s 执行一次 -->
        <property name="cronExpression" value="*/2 * * * * ?"/>  <!-- 指定 Cron 时间规则表达式 -->
    </bean>

    <!-- 配置调度器（注册 触发器） -->
    <bean id="scheduler" class="org.springframework.scheduling.quartz.SchedulerFactoryBean">
        <property name="triggers">
            <list>
                <ref bean="cronTrigger"/>
            </list>
        </property>
        <!-- 添加 Quartz 配置，如下两种方式均可 -->
        <!-- <property name="configLocation" value="classpath:quartz.properties"/> -->
        <property name="quartzProperties">
            <value>
                # 指定调度器名称，实际类型为：QuartzScheduler
                org.quartz.scheduler.instanceName = MyScheduler
                # 指定连接池
                org.quartz.threadPool.class = org.quartz.simpl.SimpleThreadPool
                # 连接池线程数量
                org.quartz.threadPool.threadCount = 11
                # 优先级
                org.quartz.threadPool.threadPriority = 5
                # 不持久化job
                org.quartz.jobStore.class = org.quartz.simpl.RAMJobStore
            </value>
        </property>
    </bean>

</beans>
```



Quartz 默认配置：[Quartz Configuration Reference - 官网配置参考](http://www.quartz-scheduler.org/documentation/2.3.1-SNAPSHOT/configuration.html)

```properties
# 【quartz.properties】 放在 classpath 下，如果没有次配置则按照默认配置启动

#============================================================================
# 指定调度器名称，非实现类
#============================================================================
org.quartz.scheduler.instanceName = MyClusteredScheduler
org.quartz.scheduler.instanceId = AUTO

#============================================================================
# 指定线程池实现类、线程池线程数量、优先级(默认5)
#============================================================================
org.quartz.threadPool.class = org.quartz.simpl.SimpleThreadPool
org.quartz.threadPool.threadCount = 25
org.quartz.threadPool.threadPriority = 5

#============================================================================
# 非持久化 job
#============================================================================
org.quartz.jobStore.class = org.quartz.simpl.RAMJobStore
```



#### 4.4 任务操作

* 启动任务

```java
public class TestSpringQuartz {
    public static void main(String[] args) throws InterruptedException {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
	}
}
```



* 删除任务

```java
public class TestSpringQuartz {
    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        Scheduler scheduler = (Scheduler) context.getBean("scheduler");
        Thread.sleep(3000);
        // 删除任务
        scheduler.deleteJob(JobKey.jobKey("job1", "group1"));
    }
}
```



* 暂停/恢复

```java
public class TestSpringQuartz {
    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        Scheduler scheduler = (Scheduler) context.getBean("scheduler");
        Thread.sleep(3000);
        scheduler.pauseJob(JobKey.jobKey("job1", "group1"));  // 暂停任务
        Thread.sleep(3000);
        scheduler.resumeJob(JobKey.jobKey("job1", "group1"));  // 恢复任务
    }
}
```



* 批量操作

```java
public class TestSpringQuartz {
    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        Scheduler scheduler = (Scheduler) context.getBean("scheduler");
        Thread.sleep(3000);
        GroupMatcher<JobKey> group1 = GroupMatcher.groupEquals("group1");
        scheduler.pauseJobs(group1);
        Thread.sleep(3000);
        scheduler.resumeJobs(group1);
    }
}
```


