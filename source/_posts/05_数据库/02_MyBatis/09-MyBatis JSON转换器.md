---
title: 09-MyBatis JSON转换器
date: 2017-6-19 08:26:24
tags:
- MyBatis
- JSON
categories: 
- 05_数据库
- 02_MyBatis
---



![001](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/001.png)



> Mysql5.7 之后推出新增的数据类型：`json` (支持数组和对象)
>
> 但是 MyBatis 目前还不支持Json类型的转换，需要在 Mybatis 自定义类型转换器。



### 1. Mybatis JSON 转换器

* 依赖

```xml
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.8.6</version>
</dependency>
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.3</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.21</version>
</dependency>
```



* 转换器

```java
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedTypes;
import org.springframework.util.StringUtils;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

@MappedTypes({Map.class, JsonObject.class, JsonArray.class})
public class JsonTypeHandler extends BaseTypeHandler<Object> {
    private static final Gson G = new Gson();
    private final Class javaType;

    public JsonTypeHandler(Class javaType) {
        this.javaType = javaType;
    }

    public Class getJavaType() {
        return javaType;
    }

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i,
                                    Object parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, G.toJson(parameter));
    }

    public Object toJsonObject(String jsonStr) {
        if (StringUtils.isEmpty(jsonStr)) {
            //可以考虑针对 Map 等特殊类型进行特殊处理
            return G.fromJson(jsonStr, getJavaType());
        }
        return null;
    }

    @Override
    public Object getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return toJsonObject(rs.getString(columnName));
    }

    @Override
    public Object getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return toJsonObject(rs.getString(columnIndex));
    }

    @Override
    public Object getNullableResult(CallableStatement cs, int columnIndex)
            throws SQLException {
        return toJsonObject(cs.getString(columnIndex));
    }
}
```



* 邮件流水日志

```java
// entity
@Data
@NoArgsConstructor
public class EmailLog {
    private Integer id;
    private String title;
    private String content;
    private JsonArray receemails;
    private JsonArray copyemails;
    private Date ctime;

    public EmailLog(String title, String content, JsonArray receemails, JsonArray copyemails) {
        this.title = title;
        this.content = content;
        this.receemails = receemails;
        this.copyemails = copyemails;
    }
}

// dao
public interface EmailLogDao {
    @Insert("insert into t_emaillog(title,content,ctime,receemails,copyemails)" +
            " values(#{title},#{content},now()," +
            " #{receemails,typeHandler=com.demo.open.server.convert.JsonTypeHandler}," +
            " #{copyemails,typeHandler=com.demo.open.server.convert.JsonTypeHandler})")
    int insert(EmailLog log);
}
```



* 配置

```yaml
server:
  port: 8082
spring:
  mail:
    username: xxx@163.com
    password: yyy
    host: smtp.163.com
    properties:
      mail:
        smtp:
          ssl:
            enable: true

  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/db_openapi?serverTimezone=Asia/Shanghai
    username: root
    password: root
    type: com.alibaba.druid.pool.DruidDataSource

mybatis:
  type-handlers-package: com.demo.open.server.convert
```

### 2. spring-boot-starter-mail

* 依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

* 邮件发送 - 核心逻辑

```java
// entity
@Data
public class EmailDto {
    private String title;
    private String content;
    private String recemail;
}

// serverImpl
@Service
public class EmailServiceImpl implements EmailService {
    @Autowired
    private EmailLogDao logDao;
    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String mail;

    @Override
    public R sendEmail(EmailDto dto) {
        SimpleMailMessage message = new SimpleMailMessage();
        // message.setBcc(); //密送
        // message.setCc();//抄送
        // message.setTo(); //收件人
        // message.setFrom(); //发件人
        message.setTo(dto.getRecemail()); // 收件人
        message.setSentDate(new Date()); // 发送日期
        message.setSubject(dto.getTitle()); // 邮箱主题
        message.setText(dto.getContent()); // 邮箱内容
        message.setFrom(mail); // 发件人
        mailSender.send(message); // 调用发送
        JsonArray ja = new JsonArray();
        ja.add(dto.getRecemail());
        EmailLog log = new EmailLog(dto.getTitle(), dto.getContent(), ja,
                null);
        logDao.insert(log);
        return R.ok();
    }
}
```