---
title: 11-JSP 自定义标签
date: 2017-5-30 22:26:20
tags:
- JSP
- 自定义标签
categories: 
- 04_网页技术
- 05_JSP
---



需求： 向浏览器输出当前客户的 ip 地址和 port 端口 （使用 jsp 自定义标签）

demo：

![image-20200629161121509](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200629161122.png)

### 1. 创建和使用自定义标签

#### 1.1 继承 SimpleTagSupport 类

编写一个普通的 java 类，`继承 SimpleTagSupport` 类，叫**标签处理器类**。

```java
package com.demo.tag;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.PageContext;
import javax.servlet.jsp.tagext.SimpleTagSupport;
import java.io.IOException;

// 覆盖 doTag() 方法
public class ShowIpTag extends SimpleTagSupport {
    /**
     * 向浏览器输出客户的ip地址 和 端口号
     * @throws IOException
     */
    @Override
    public void doTag() throws IOException {
        PageContext pageContext = (PageContext) this.getJspContext();
        HttpServletRequest request = (HttpServletRequest) pageContext.getRequest();
        String ip = request.getLocalAddr(); // 使用 http://127.0.0.1:8080 访问
        int port = request.getLocalPort();
        JspWriter out = pageContext.getOut();
        out.write("使用自定义标签输出客户的IP地址：" + ip + ":" + port);
    }
}
```



#### 1.2 创建 .tld 声明文件

在 web 项目的 WEB-INF 目录下建立 `newc.tld` 文件，这个 tld 叫标签库的声明文件。

newc 是自定义的名字。

（参考核心标签库的 tld 文件，如 **standard.jar/META-INF/c.tld** `可以拷贝文件头约束信息`）

> **输出标签体内容格式**
>
> - JSP：  在传统标签中使用的。可以写和执行jsp的java代码。
>
> - scriptless:  标签体不可以写jsp的java代码
>
> - empty:   必须是空标签。
>
> - tagdependent : 标签体内容可以写jsp的java代码，但不会执行。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<taglib xmlns="http://java.sun.com/xml/ns/j2ee"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee http://java.sun.com/xml/ns/j2ee/web-jsptaglibrary_2_0.xsd"
    version="2.0">
    
  <tlib-version>1.1</tlib-version>
  <short-name>newc</short-name>
  <uri>http://newc.com.cn</uri>

  <tag>
    <name>showIp</name>
    <tag-class>com.demo.tag.ShowIpTag</tag-class>
    <body-content>scriptless</body-content>
  </tag>
</taglib>
```



#### 1.3 页面引入标签库

在 jsp 页面的头部导入自定义标签库。

```html
<%@ taglib prefix="newc" uri="http://newc.com.cn" %>
```



#### 1.4 使用自定义标签

在 jsp 中使用自定义标签。

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="newc" uri="http://newc.com.cn" %>
<html>
<head>
    <title>index.jsp</title>
</head>
<body>

<newc:showIp/>

</body>
</html>
```

![image-20200629160926042](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200629160927.png)



### 2. 自定义标签执行过程

确保 Tomcat 服务器启动时，加载到每个 web 应用，加载每个 web 应用的 WEB-INF 目录下的所有文件！！！例如 web.xml、.tld 文件！！！

1）访问 index.jsp 资源

2）tomcat 服务器把 jsp 文件翻译成 java 源文件 -> 编译 class -> 构造类对象 -> 调用 _jspService() 方法

3）检查 jsp 文件的 taglib 指令，是否存在一个名为`http://newc.com.cn`的 tld 文件。如果没有，则报错

4）上一步已经读到 newc.tld 文件

5）读到`<abyg:showIp>` 到newc.tld文件中查询是否存在`<name>`为 showIp 的 `<tag>` 标签

6）找到对应的 `<tag>` 标签，则读到 `<tag-class>` 内容

7）得到 `com.demo.tag.showIpTa`g 构造 ShowIpTag 对象，然后调用 ShowIpTag 里面的方法。