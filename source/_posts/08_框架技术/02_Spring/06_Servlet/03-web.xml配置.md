---
title: 03-web.xml配置
date: 2017-5-22 22:26:20
tags:
- Servlet
- 配置
categories: 
- 08_框架技术
- 02_Spring
- 06_Servlet
---

Servlet2.5 规范之前，Java Web应用的绝大部分组件都通过 web.xml 文件来配置管理。
Servlet3.0 规范可通过 Annotation 来配置管理Web组件，极大简化了原有的配置信息。

>在`Servlet3.0 以后`，我们可以不需要在 web.xml 里面配置 servlet，只需要加上 `@WebServlet` 注解就可以修改该 Servlet 的属性了。

### 1. 文件配置：WEB_INF/web.xml 
```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <!--servlet与servlet-mapping标签需同时使用-->
    <!--创建servlet标签-->
    <servlet>
        <!--给指定的servlet类起一个名字-->
        <servlet-name>demo01</servlet-name>
        <!--servlet类的全限定路径-->
        <servlet-class>com.demo.servlet.DemoServlet</servlet-class>
        <!--servlet初始化加载优先级(0~10)-->
        <load-on-startup>0</load-on-startup>
    </servlet>

    <!--创建servlet映射标签-->
    <servlet-mapping>
        <!--映射到哪个servlet，与上面一致-->
        <servlet-name>demo01</servlet-name>
        <!--客户端访问路径 localhost:8080/项目名称/demo-->
        <url-pattern>/demo</url-pattern>
    </servlet-mapping>

    <!--全局初始化参数:整个web应用-->
    <context-param>
        <param-name>username</param-name>
        <param-value>root</param-value>
    </context-param>
    <context-param>
        <param-name>password</param-name>
        <param-value>1234</param-value>
    </context-param>

    <!--默认显示页面，如有404则会继续查找下一个welcome-file标签-->
    <welcome-file-list>
        <welcome-file>demo.html</welcome-file>
        <welcome-file>demo.htm</welcome-file>
        <welcome-file>demo.jsp</welcome-file>
    </welcome-file-list>

    <!--当页面未找到报404时显示 location 标签指定的页面-->
    <error-page>
        <error-code>404</error-code>
        <!--需要web项目下新建/error/404.html页面-->
        <location>/error/404.html</location>
    </error-page>

</web-app>
```

### 2. 注解配置：@WebServlet
@WebServlet 的属性列表：

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142429.png)

注解配置代码示例：
```java
@WebServlet(
        name = "TestWebServlet",
        /*value = {"/demo", "/web"},*/
        urlPatterns = {"/demo01", "/web01"},
        loadOnStartup = 1,
        initParams = {
                @WebInitParam(name = "username", value = "root"),
                @WebInitParam(name = "password", value = "123456"),
        }
)
public class TestWebServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("TestWebServlet 执行...");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```

### 3. 两者同时使用注意事项

如果使用@WebServlet Annotation（注解）来配置Servlet，需要注意：

① 不要在 web.xml 文件的根元素（\<web-app---/>）中指定 metadata-complete="true"；
② 不要在 web.xml 文件中再次配置该 Servlet 相关属性。