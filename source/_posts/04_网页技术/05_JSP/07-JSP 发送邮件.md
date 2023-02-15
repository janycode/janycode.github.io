---
title: 07-JSP 发送邮件
date: 2018-4-29 01:14:37
tags:
- JSP
- 邮件
categories: 
- 04_网页技术
- 05_JSP
---



使用本站提供的下载链接：

- `mail.jar` [JavaMail mail.jar 1.4.5](http://static.runoob.com/download/mail.jar)

- `activation.jar` [JAF（版本 1.1.1） activation.jar](http://static.runoob.com/download/activation.jar)



下载完成后将包导入项目的 lib 中。



JSP 通过发送邮件正文+附件：

163邮箱增加了图片点字验证，验证处理需要单独再处理该案例才可用，其他流程OK。

```jsp
<%--163邮箱发送带有附件的邮件到qq邮箱--%>

<%@ page import="java.util.*" %>
<%@ page import="javax.mail.*" %>
<%@ page import="javax.mail.internet.*" %>
<%@ page import="javax.activation.*" %>
<%
    String result;
    // 收件人的电子邮件
    String to = "username1@qq.com";

    // 发件人的电子邮件名和密碼
    String from = "username2@163.com";
    String pwd = "yourpassword";
    //设置用户名
    String usr = "Jerry";

    Properties properties = new Properties();

    try {
        // 设置用户的认证方式
        properties.setProperty("mail.smtp.auth", "true");
        //设置传输协议
        properties.setProperty("mail.transport.protocol", "smtp");
        //SMTP邮件服务器
        properties.setProperty("mail.smtp.host", "smtp.163.com");
        //SMTP邮件服务器默认端口
        properties.setProperty("mail.smtp.port", "25");

        // 获取默认的Session对象。
        Session mailSession = Session.getDefaultInstance(properties);

        // 创建一个默认的MimeMessage对象。
        Message message = new MimeMessage(mailSession);
        // 根据session对象获取邮件传输对象Transport
        Transport transport = mailSession.getTransport();

        // 设置 From: 头部的header字段
        message.setFrom(new InternetAddress(from));
        // 设置 To: 头部的header字段
        message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
        // 设置 Subject: header字段
        message.setSubject("This is the Subject Line!");

        // 现在设置的实际消息
        BodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setText("This is message body");
        Multipart multipart = new MimeMultipart();
        multipart.addBodyPart(messageBodyPart);

        messageBodyPart = new MimeBodyPart();
        //使用绝对路径
        String filename = "E:\\JavaNote\\00_Tools\\04_Web\\javaMail_jar\\mail.jar";
        //添加文件到message
        DataSource source = new FileDataSource(filename);

        messageBodyPart.setDataHandler(new DataHandler(source));
        messageBodyPart.setFileName(filename);

        multipart.addBodyPart(messageBodyPart);
        message.setContent(multipart);
        message.setSentDate(new Date());

        // 设置发件人的账户名和密码
        transport.connect(usr, pwd);
        // 发送邮件，并发送到所有收件人地址
        // message.getAllRecipients() 获取到的是在创建邮件对象时添加的所有收件人, 抄送人, 密送人
        transport.sendMessage(message, message.getAllRecipients());

        result = "Sent message successfully....";
    } catch (Exception e) {
        e.printStackTrace();
        result = "Error: unable to send message....";
    }
%>
<html>
<head>
    <title>Send Email using JSP</title>
</head>
<body>
<div style="text-align: center;">
    <h1>Send Email using JSP</h1>
</div>
<p align="center">
    <%
        out.println("Result: " + result + "\n");
    %>
</p>
</body>
</html>
```

