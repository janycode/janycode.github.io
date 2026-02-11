---
title: Mail 服务 Demo
date: 2020-03-02 17:59:44
tags:
- 微服务
- 邮件服务
categories: 
- 14_微服务
- 08_邮箱服务
---

![image-20200816135654108](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200816135655.png)

### 1. 服务 demo

* controller

```java
@RestController
@RequestMapping("/mail")
public class MailController {
    @Autowired
    private MailService mailServcer;

    @GetMapping("/sendCodeMail.do")
    public R sendMail(String to, String str) {
        return mailServcer.sendCodeMail(to, str);
    }
}
```

* service

```java
// service
public interface MailService {
    R sendCodeMail(String to, String str);
}

// serviceImpl
@Service
public class MailServciceImpl implements MailService {

    @Override
    public R sendCodeMail(String to, String str) {
        MailUtil.sendMail(to, str);
        return R.ok();
    }
}
```

* 启动类

```java
@SpringBootApplication
@EnableDiscoveryClient
public class MailApplication {
    public static void main(String[] args) {
        SpringApplication.run(MailApplication.class, args);
    }
}
```

* 配置

```yaml
server:
  port: 8091
spring:
  application:
    name: mailserver  #服务名称
  cloud:
    nacos:
      discovery:
        server-addr: 47.94.193.104:8848 #注册中心地址

feign:
  client:
    config:
      default:
        connectTimeout: 10000 #设置连接的超时时间
        readTimeout: 20000  #设置读取的超时时间
```

* spring 邮箱服务配置（补充）

![springboot-mail](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200822131121.png)



### 2. Mail 工具类

* 依赖

```xml
        <dependency>
            <groupId>javax.mail</groupId>
            <artifactId>mail</artifactId>
            <version>1.4.7</version>
        </dependency>
```



```java
package com.autohome.common.email;


import javax.mail.Address;
import javax.mail.Message;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

public class MailUtil {
    // 邮箱地址
    private static final String emailAddr = "xxx@qq.com";
    // 邮箱授权码
    private static final String authCode = "xxx";

    /**
     * 外网邮件发送
     *
     * @param to   收件人邮箱地址 收件人@xx.com
     * @param code 传入的验证码
     */
    public static void sendMail(String to, String code) {
        // Session对象:
        Properties props = new Properties();
        props.setProperty("mail.smtp.host", "smtp.qq.com"); // 设置主机地址
        // smtp.163.com
        // smtp.qq.com
        // smtp.sina.com
        props.setProperty("mail.smtp.auth", "true");// 认证
        // 2.产生一个用于邮件发送的Session对象
        Session session = Session.getInstance(props);

        // Message对象:
        Message message = new MimeMessage(session);
        // 设置发件人：
        try {
            // 4.设置消息的发送者
            Address fromAddr = new InternetAddress(emailAddr);
            message.setFrom(fromAddr);

            // 5.设置消息的接收者 nkpxcloxbtpxdjai
            Address toAddr = new InternetAddress(to);
            // TO 直接发送 CC抄送 BCC密送
            message.setRecipient(MimeMessage.RecipientType.TO, toAddr);

            // 6.设置邮件标题
            message.setSubject("来自 " + emailAddr + " 的安全验证码");
            // 7.设置正文
            message.setContent("这里是邮件的正文信息\n\n您的验证码为：" + code, "text/html;charset=UTF-8");

            // 8.准备发送，得到火箭
            Transport transport = session.getTransport("smtp");
            // 9.设置火箭的发射目标（第三个参数就是你的邮箱授权码）
            //transport.connect("smtp.163.com", "发送者@163.com", "abcdefghabcdefgh");
            transport.connect("smtp.qq.com", emailAddr, authCode);
            // 10.发送
            transport.sendMessage(message, message.getAllRecipients());

            // Transport对象:
            // Transport.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    /**
     * 根据传入的参数生成指定长度随机验证码
     *
     * @param length 验证码长度
     * @return 字符串验证码
     */
    public static String generateRandomCode(int length) {
        String s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        while (sb.length() < length) {
            // 0 ~ s.length()-1
            int index = (new java.util.Random()).nextInt(s.length());
            // 处理重复字符：每个新的随机字符在 sb 中使用indexOf()查找下标值，-1为没找到，即不重复
            Character ch = s.charAt(index);
            if (sb.indexOf(ch.toString()) < 0) {
                sb.append(ch);
            }
        }
        return sb.toString();
    }
}
```



### 3. 远程调用服务

```java
// serviceImpl
@Service
public class MailServiceImpl implements MailService {

    @Autowired
    private RestTemplate restTemplate;

    // 远程调用 Mail 服务并传递参数
    @Override
    public R sendMail(String to, String str) {
        return restTemplate.getForObject("http://mailserver/mail/sendCodeMail.do?to=" + to + "&str=" + str, R.class);
    }
}
```



### 4. Spring Boot Mail

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