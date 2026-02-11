---
title: 01-MyBatis-Plus 入门使用
date: 2017-6-18 23:04:05
tags: 
- MyBatis
- MyBatisPlus
- 语法
categories: 
- 05_数据库
- 03_MyBatis-Plus
---

![image-20200723144358925](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200723144400.png)

中文官网：https://mp.baomidou.com/



### 1. 简介

Mybatis目前市场很主流，但是基础操作很臃肿。市场上有一些对其进行二次封装的框架，中小型企业首选：

* **Mybatis-plus**
    官网：https://mp.baomidou.com/
    源码：https://github.com/baomidou/mybatis-plus
* **TKMybatis**：
    源码：https://github.com/abel533/Mapper

MyBatis-Plus为简化开发而生,（简称 MP）是一个 MyBatis的增强工具，在 MyBatis 的基础上只做增强不做改变，为简化开发、提高效率而
生。适用于中小型企业快速开发。

MyBatis-Plus 框架结构

![image-20200723144952300](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200723144953.png)

### 2. 入门 Demo

WebMagic + MyBatis-Plus 爬取职友集页面信息，并存储到 MySQL。

* Mybatis-Plus 框架封装

```mysql
-- 数据库表
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
    //@TableField //设置对应数据库的字段信息，别名
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
// 接口继承 BaseMapper<实体类泛型> 即可拥有已封装的 CRUD 操作
public interface JobDao extends BaseMapper<Job> { }
```

* 业务层

```java
// 接口继承 IService<实体类泛型> 即可拥有已封装的业务层 CRUD 操作
public interface JobService extends IService<Job> { }
```

* 业务层实现

```java
// 实现类继承 ServiceImpl<持久层接口泛型, 实体类泛型> 即可拥有已封装的业务层实现 CRUD 操作
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
    // 注入 service
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
    // 注入 service
    @Autowired
    private JobService service;

    @Override
    public void process(ResultItems resultItems, Task task) {
        List<Job> jobList = resultItems.get("jobs");
        //批量处理，保存 list 到数据库
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
@MapperScan(basePackages = "com.demo.webmagic.dao") // 扫描dao
@EnableTransactionManagement // 开启事务（因 mybatis-plus 中封装的CRUD操作中有事务注解）
public class WebmagicApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebmagicApplication.class, args);
    }

    /**
     * Mybatis-Plus 分页方法支持
     * @return
     */
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



### 3. 查询字段为null

* **mybatisPlus 查询返回结果为null**
    在通过mybatisPlus 进行数据查询的时候，返回的查询结果为null。
    解决方案：检查实体类中的字段是否存在下划线，将所有所有存在的下划线的字段，修改为标准的驼峰命名字段。
    * 数据库表

```mysql
drop table if exists t_interview;

/*==============================================================*/
/* Table: t_interview                                           */
/*==============================================================*/
create table t_interview
(
   id                   int not null auto_increment comment '编号',
   name                 char(10) comment '姓名',
   post                 char(20) comment '岗位',
   city                 char(10) comment '城市',
   company              char(50) comment '公司',
   company_about        char(200) comment '公司简介',
   interview_content    text comment '面试内容',
   interview_time       date comment '面试时间',
   ctime                date comment '创建时间',
   primary key (id)
);

alter table t_interview comment '面试记录表';
```

* 实体类

```java
@ApiModel(value = "com-jerry-interview-entity-Interview")
@TableName("t_interview") // Mybatis-Plus 注解指定映射的 mysql 表名
@Data
public class Interview implements Serializable {
    /**
     * 编号
     */
    @ApiModelProperty(value = "编号")
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    ...

    /**
     * 公司简介
     */
    @ApiModelProperty(value = "公司简介")
    @TableField("company_about")
    private String companyAbout;

	...

    /**
     * 面试时间
     */
    @ApiModelProperty(value = "面试时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", locale = "zh", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @TableField("interview_time")
    private Date interviewTime;

    /**
     * 创建时间
     */
    @ApiModelProperty(value = "创建时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", locale = "zh", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date ctime;

    private static final long serialVersionUID = 1L;
}
```

