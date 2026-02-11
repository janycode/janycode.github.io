---
title: 01-Servlet开发
date: 2017-5-22 22:26:20
tags:
- Servlet
categories: 
- 08_框架技术
- 02_Spring
- 06_Servlet
---

### 1.1 Servlet 核心作用

1. 接收客户端浏览器请求，完成操作任务
2. 动态生成网页（页面数据可变）
3. 将包含操作结果的动态网页响应给客户端浏览器

### 1.2 Servlet 创建项目目录（参考）
Web项目参考目录：
```python
|--webapps（存放所有网站）
    |--MyServlet（网站）
        |--WEB_INF（核心内容）
            |--classes/*.class（.class文件）
            |--lib/*.jar（网站需要的jar包）
            |--web.xml（配置文件）
        |--css/*.css（样式文件）
        |--img/*.jpg/png/bmg/gif（图片资源）
        |--js/*.js（脚本文件）
        |--*.html（静态页面）
|--XXXServlet
```
### 1.3 Servlet 的jar包依赖库配置
IDEA 的`External Library`中没有Tomcat包( `jsp-api.jar` & `servlet-api.jar`)时：
**Alt+1** 切到项目窗口 >> **F4** 打开Module Setting >> 选择**Dependencies** >> **增加Tomcat的库**

### 1.4 Servlet 基本开发步骤
① 创建参考目录结构
② 三种方式实现 Servlet 处理 浏览器网页到 Tomcat服务器端 的请求和响应
* 方式一：
实现 `javax.servlet.Servlet` 接口，重写 5 个主要方法，处理请求的方法是 service( )
* 方式二：
继承 `javax.servlet.GenericServlet` 抽象类，重写需要的方法，处理请求的方法是 service( )
* 方式三：【最优】
继承 `javax.servlet.http.HttpServlet` 抽象类，默认重写了 service( ) 方法，且针对http协议优化，需自行重写 doGet( ) 和 doPost( ) 方法处理请求

③ 在文件 **WEB_INF/web.xml** 中新增如下内容：
```xml
<!--创建servlet标签--> 
<servlet> 
    <!--给指定的servlet类起一个名字--> 
    <servlet-name>demo01</servlet-name> 
    <!--servlet类的全限定路径--> 
    <servlet-class>com.demo.t1.servlet.Demo01</servlet-class>
    <!--servlet初始化加载优先级-->
    <load-on-startup>0</load-on-startup>
</servlet> 

<!--创建servlet映射标签--> 
<servlet-mapping> 
    <!--映射到哪个servlet，与上面一致--> 
    <servlet-name>demo01</servlet-name> 
    <!--客户端访问路径 localhost:8080/项目名称/demo--> 
    <url-pattern>/demo</url-pattern> 
</servlet-mapping>
```
web项目中此时会有 /demo 的访问资源，访问方式： 
http://localhost:8080/projname/demo

- projname：此时为IDEA中当前项目名称
- demo：为\<url-pattern>标签中的内容