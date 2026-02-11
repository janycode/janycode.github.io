---
title: 01-WebMagic爬虫框架
date: 2018-6-21 23:59:45
tags:
- 爬虫
- WebMagic
categories: 
- 08_框架技术
- 08_WebMagic
---



![image-20200722000742166](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200722000743.png)



中文教程文档：http://webmagic.io/docs/zh/



### 1. 简介

WebMagic 是一款简单灵活的爬虫框架。
WebMagic的设计参考了业界最优秀的爬虫`Scrapy`，而实现则应用了HttpClient、Jsoup等Java世界最成熟的工具，目标就是做一个Java语言Web爬虫的教科书般的实现。
WebMagic由四个组件(`Downloader`、`PageProcessor`、`Scheduler`、`Pipeline`)构成，核心代码非常简单，主要是将这些组件结合并完成多线程的任务。



### 2. 核心组件

1. **Downloader**
    Downloader 负责从互联网上下载页面，以便后续处理。WebMagic默认使用了 Apache HttpClient 作为下载工具。
2. **PageProcessor**
    PageProcessor 负责解析页面，抽取有用信息，以及发现新的链接。WebMagic 使用 Jsoup 作为 HTML 解析工具，并基于其开发了解析 XPath 的工具 Xsoup。
    在这四个组件中， PageProcessor 对于每个站点每个页面都不一样，是需要使用者定制的部分。
3. **Scheduler**
    Scheduler 负责管理待抓取的 URL，以及一些去重的工作。WebMagic 默认提供了JDK的内存队列来管理 URL，并用集合来进行去重。也支持使用 Redis 进行分布式管理。
    除非项目有一些特殊的分布式需求，否则无需自己定制 Scheduler。
4. **Pipeline**
    Pipeline 负责抽取结果的处理，包括计算、持久化到文件、数据库等。WebMagic 默认提供了“输出到控制台”和“保存到文件”两种结果处理方案。
    Pipeline 定义了结果保存的方式，如果你要保存到指定数据库，则需要编写对应的Pipeline。对于一类需求一般只需编写一个 Pipeline 。  



### 3. 爬虫 demo × 2

依赖

```xml
<dependency>
    <groupId>us.codecraft</groupId>
    <artifactId>webmagic-core</artifactId>
    <version>0.7.3</version>
</dependency>

<dependency>
    <groupId>us.codecraft</groupId>
    <artifactId>webmagic-extension</artifactId>
    <version>0.7.3</version>
</dependency>
```



#### 3.1 博客园 - 爬虫demo

博客园：https://www.cnblogs.com/

```java
import us.codecraft.webmagic.Page;
import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.processor.PageProcessor;
import us.codecraft.webmagic.selector.Selectable;

import java.util.List;

public class BlogPage implements PageProcessor {
    
    // process是定制爬虫逻辑的核心接口，在这里编写抽取逻辑
    @Override
    public void process(Page page) {
        // 部分二：定义如何抽取页面信息，并保存下来
        List<Selectable> nodes = page.getHtml().css("div#post_list div.post_item").nodes();
        nodes.forEach(s -> {
            System.out.println("--------------------------->");
            System.out.println("标题：" + s.css("div.post_item_body h3 a", "text").get());
            System.out.println("摘要：" + s.css("div.post_item_body p.post_item_summary", "text"));
            System.out.println("作者：" + s.css("div.post_item_body div.post_item_foot a", "text").get());
            //System.out.println("发布时间：" + s.css("div.post_item_body div.post_item_foot", "text").get().substring(6, 22));
            System.out.println();
        });
        
        // 部分三：从页面发现后续的url地址来抓取
        //page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/[\\w\\-]+/[\\w\\-]+)").all());
    }

    @Override
    public Site getSite() {
        // 部分一：抓取网站的相关配置，包括编码、抓取间隔、重试次数等
        return Site.me().setRetryTimes(500).setSleepTime(200).setTimeOut(5000);
    }
}
```

```java
import us.codecraft.webmagic.Spider;

public class Blog_Main {
    public static void main(String[] args) {
        String url = "https://www.cnblogs.com/";
        // 启动爬虫
        new Spider(new BlogPage())
                .addUrl(url)
                .thread(3)
                .start();
    }
}
```

![image-20200722001932802](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200722001934.png)



#### 3.2 职友集 - 爬虫demo

职友集：https://www.jobui.com/

* 页面处理器

```java
public class JobPage implements PageProcessor {
    @Override
    public void process(Page page) {
        List<Selectable> list=page.getHtml().css("div.j-recommendJob div.c-joblist").nodes();
        List<Job>jobs=new ArrayList<>();
        list.stream().forEach(s->{
            Job job=new Job();
            job.setJobname(s.css("div.job-content-box div.job-content div.job-segmetation
            a h3","title").get());
            job.setJobyear(s.css("div.job-content-box div.job-content div.job-segmetation
            div.job-desc span","text").all().get(0));
            job.setJobedu(s.css("div.job-content-box div.job-content div.job-segmetation
            div.job-desc span","text").all().get(1));
            job.setJobmoney(s.css("div.job-content-box div.job-content div.job-segmetation
            div.job-desc span.job-pay-text","text").get());
            job.setJobcompany(s.css("div.job-content-box div.job-content div.jobsegmetation a.job-company-name","text").get());
            jobs.add(job);
        });
    	page.putField("jobs",jobs);
    }

	@Override
    public Site getSite() {
        return Site.me().setRetryTimes(500).addHeader("User-Agent","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36").setSleepTime(200).setTimeOut(5000);
    }
}
```

* Mybatis-Plus 框架封装

```mysql
create database db_job2001;
use db_job2001;
create table t_zyjjob(
    id int primary key auto_increment,
    name varchar(50),
    jobyear varchar(20),
    company varchar(50) comment '公司名称',
    edu varchar(40) comment '学历要求',
    salary varchar(40) comment '薪水范围',
    jobid varchar(20) comment '原id',
    city varchar(20),
    stime datetime comment '发布职位的时间',
    ctime datetime
) comment '爬取的招聘职位信息';
```

* 依赖

```xml
<!-- mybatis-plus -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.3.2</version>
</dependency>
<!-- mysql & druid -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.22</version>
</dependency>
```

* 配置文件

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/数据库名?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf8
    username: root
    password: 123456
    type: com.alibaba.druid.pool.DruidDataSource
```

* 实体类

```java
@Data
@TableName("t_zyjjob")
public class Job {
    @TableId(type = IdType.AUTO)
    private Integer id;
    //@TableField //设置对应数据库的字段信息
    private String name;
    private String jobid;
    private String city;
    private String jobyear;
    private String edu;
    private String salary;
    private String company;
    private Date stime;
    private Date ctime;
}
```

* 持久层

```java
public interface JobDao extends BaseMapper<Job> { }
```

* 业务层

```java
public interface JobService extends IService<Job> { }
```

* 业务层实现

```java
@Service
public class JobServiceImpl extends ServiceImpl<JobDao, Job> implements JobService { }
```

* 控制层

```java
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.api.R;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.demo.webmagic.entity.Job;
import com.demo.webmagic.service.JobService;
import com.demo.webmagic.spider.JobPage;
import com.demo.webmagic.spider.JobPipeline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import us.codecraft.webmagic.Spider;

import java.util.List;

@RestController
public class JobController {
    @Autowired
    private JobService service;
    @Autowired
    private JobPage jobPage;
    @Autowired
    private JobPipeline pipeline;

    //查询
    @GetMapping("/api/job/all")
    public R<List<Job>> all() {
        QueryWrapper queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByDesc("stime");
        return R.ok(service.list(queryWrapper));
    }

    //分页
    @GetMapping("/api/job/page/{page}/{count}")
    public R<Page<Job>> page(@PathVariable int page, @PathVariable int count) {
        Page<Job> page1 = new Page<>(page, count);
        QueryWrapper queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByDesc("stime");
        return R.ok(service.page(page1, queryWrapper));
    }

    //爬取数据
    @GetMapping("/api/spider/startjob/{city}")
    public R<String> start(@PathVariable String city) {
        jobPage.setCity(city);
        new Spider(jobPage).addPipeline(pipeline).addUrl("https://www.jobui.com/jobs?jobKw=Java&cityKw=" + city).thread(3).start();
        return R.ok("OK");
    }
}
```

* 时间处理工具类

```java
import java.util.Calendar;
import java.util.Date;

public class DateUtil {
    //解析爬取的时间
    public static Date parseTimeV1(String msg) {
        Calendar calendar = Calendar.getInstance();
        if (msg != null && msg.length() > 0) {
            if (msg.indexOf('天') > -1) {
                calendar.add(Calendar.DAY_OF_MONTH, -Integer.parseInt(msg.substring(0, msg.indexOf('天'))));
            } else if (msg.indexOf('小') > -1) {
                calendar.add(Calendar.DAY_OF_MONTH, -Integer.parseInt(msg.substring(0, msg.indexOf('小'))));
            }
        }
        return calendar.getTime();
    }
}

```

* Page页面数据获取 + Pipeline管道处理

```java
// JobPage.java
import com.demo.webmagic.entity.Job;
import com.demo.webmagic.util.DateUtil;
import org.springframework.stereotype.Component;
import us.codecraft.webmagic.Page;
import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.processor.PageProcessor;
import us.codecraft.webmagic.selector.Selectable;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
public class JobPage implements PageProcessor {
    private String city;

    public void setCity(String city) {
        this.city = city;
    }

    @Override
    public void process(Page page) {
        List<Selectable> list = page.getHtml().css("div.j-recommendJob div.c-job-list").nodes();
        List<Job> jobs = new ArrayList<>();
        list.forEach(s -> {
            Job job = new Job();
            job.setName(s.css("div.job-content-box div.job-content div.job-segmetation a h3", "title").get());
            job.setJobYear(s.css("div.job-content-box div.job-content div.job-segmetation div.job-desc span", "text").all().get(0));
            job.setEdu(s.css("div.job-content-box div.job-content div.job-segmetation div.job-desc span", "text").all().get(1));
            job.setSalary(s.css("div.job-content-box div.job-content div.job-segmetation div.job-desc span.job-pay-text", "text").get());
            job.setCompany(s.css("div.job-content-box div.job-content div.job-segmetation a.job-company-name", "text").get());
            job.setJobId(s.css("div.job-content-box div.job-addition-box div.job-icon-box span", "data-positionid").get());
            job.setSTime(DateUtil.parseTimeV1(s.css("div.job-content-box div.job-addition-box div.job-add-date", "text").get()));
            job.setCTime(new Date());
            job.setCity(city);
            jobs.add(job);
        });
        page.putField("jobs", jobs);
        //继续爬取  设置要继续爬取的链接
        if (page.getUrl().get().equals("https://www.jobui.com/jobs?jobKw=Java&cityKw=" + city)) {
            //https://www.jobui.com/jobs?jobKw=Java&cityKw=%E9%83%91%E5%B7%9E&n=8
            List<String> urls = new ArrayList<>();
            String u = "https://www.jobui.com/jobs?jobKw=Java&cityKw=" + getClass() + "&n=";
            for (int i = 2; i <= 50; i++) {
                urls.add(u + i);
            }
            //设置继续爬取的页面路径
            page.addTargetRequests(urls);
        }
    }

    @Override
    public Site getSite() {
        return Site.me().setRetryTimes(500).addHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36").setSleepTime(200).setTimeOut(5000);
    }
}
```

```java
// JobPipeline.java
import com.demo.webmagic.entity.Job;
import com.demo.webmagic.service.JobService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import us.codecraft.webmagic.ResultItems;
import us.codecraft.webmagic.Task;
import us.codecraft.webmagic.pipeline.Pipeline;

import java.util.List;

@Component
@Slf4j
public class JobPipeline implements Pipeline {
    @Autowired
    private JobService service;

    @Override
    public void process(ResultItems resultItems, Task task) {
        List<Job> jobList = resultItems.get("jobs");
        //批量处理
        if (service.saveBatch(jobList)) {
            log.info("操作成功");
        } else {
            log.error("爬虫数据添加失败");
        }
    }
}
```



* SpringBoot 启动类

```java
import com.baomidou.mybatisplus.extension.plugins.PaginationInterceptor;
import com.baomidou.mybatisplus.extension.plugins.pagination.optimize.JsqlParserCountOptimize;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@MapperScan(basePackages = "com.demo.webmagic.dao") //扫描dao
@EnableTransactionManagement // 开启事务（因mybatis-plus中封装的CRUD操作中有事务注解）
public class WebmagicApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebmagicApplication.class, args);
    }

    @Bean
    public PaginationInterceptor paginationInterceptor() {
        PaginationInterceptor paginationInterceptor = new PaginationInterceptor();
        // 开启 count 的 join 优化,只针对部分 left join
        paginationInterceptor.setCountSqlParser(new JsqlParserCountOptimize(true));
        return paginationInterceptor;
    }
}
```

![image-20200722213243836](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200722213245.png)