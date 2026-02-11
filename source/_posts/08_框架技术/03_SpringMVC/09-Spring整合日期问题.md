---
title: 09-Spring整合日期问题
date: 2018-6-21 22:59:44
tags:
- SpringMVC
- Date
categories: 
- 08_框架技术
- 03_SpringMVC
---



HTML 页面输入框：

```html
<input type="date" name="uploadTime">
```

![image-20200705123740098](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200705123741.png)



Java 实体类属性：

```java
    /*
     * @JsonFormat: 作为 json 输出时的格式
     * @DateTimeFormat: 给对象设置属性时，需要传入的格式，比如添加、修改
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", locale = "zh", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date uploadTime;
```



数据库字段类型：

```sql
CREATE TABLE `tb_document`(
	`id` INT PRIMARY KEY AUTO_INCREMENT,
	`name` VARCHAR(50) NOT NULL,
	`description` VARCHAR(100) NOT NULL,
	`author` VARCHAR(20) NOT NULL,
	`upload_time` DATE NOT NULL    # DATE 日期类型
)CHARSET=utf8;
```

