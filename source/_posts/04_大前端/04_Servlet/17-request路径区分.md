---
title: 17-request路径区分
date: 2017-3-22 22:26:20
tags:
- Servlet
- 请求
categories: 
- 04_大前端
- 04_Servlet
---


### 1. request 中的路径分类
项目名称：`/demo ` (IDEA中修改了当前Tomcat配置项目访问根目录为 /demo)
当前资源：`/path`
访问路径：`http://127.0.0.1:8080/demo/path`



#### 1.1 资源路径

- request.getServletPath();
> 毋庸置疑为 Servlet 资源路径： `/path`



#### 1.2 部署路径

- request.**getRealPath**("index.jsp"); // 过时了
- request.getServletContext().**getRealPath**("index.jsp");
- request.getSession().getServletContext().**getRealPath**("index.jsp");
> getRealPath(String path) 统一是部署路径：
> `磁盘路径\out\artifacts\demo_job_war_exploded\index.jsp`
> 应用：
>
> 1. 上传文件路径：xxx.getRealPath("uploadDir") + File.separator + uploadFilename



#### 1.3 项目路径

- this.getServletContext().**getContextPath**();
- request.**getContextPath**();
- request.getServletContext().**getContextPath**();
- request.getSession().getServletContext().**getContextPath**();
> getContextPath() 统一是项目路径： `/demo`
> 应用：
>
> 1. 重定向路径： request.getContextPath() + servletPath或htmlPath
> 2. 下载文件路径：request.getContextPath() + File.separator + "uploadDir" + File.separator + uploadFilename



#### 1.4 URI 与 URL

- request.**getRequestURI**();
- request.**getRequestURL**();
> 访问http://127.0.0.1:8080/demo/path 验证结果：
>
> 1. URI 路径为：`/demo/path` (当前 Servlet 在项目的绝对路径)
> 2. URL 路径为：`http://127.0.0.1:8080/demo/path` (当前 Servlet 在项目中带协议和地址端口的绝对路径)
>
> 总结：`URL = 协议 + ip:port + URI`



### 2. 源码验证 + 输出截图

```java
@WebServlet(name = "TestPathServlet", urlPatterns = "/path")
public class TestPathServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        /* 项目名称：/demo 当前资源：/path */

        // 毋庸置疑 ServletPath 为 "/path"
        String servletPath = request.getServletPath();

        // getRealPath(String path) 统一是部署路径: "磁盘路径\out\artifacts\demo_job_war_exploded\index.jsp"
        // 应用：
        // 1. 上传文件路径：xxx.getRealPath("uploadDir") + File.separator + uploadFilename
        String realPath1 = request.getRealPath("index.jsp");
        String realPath2 = request.getServletContext().getRealPath("index.jsp");
        String realPath3 = request.getSession().getServletContext().getRealPath("index.jsp");

        // getContextPath() 统一是项目路径： "/demo"
        // 应用：
        // 1. 重定向路径： request.getContextPath() + servletPath或htmlPath
        // 2. 下载文件路径：request.getContextPath() + File.separator + "uploadDir" + File.separator + uploadFilename
        String contextPath = this.getServletContext().getContextPath();
        String contextPath1 = request.getContextPath();
        String contextPath2 = request.getServletContext().getContextPath();
        String contextPath3 = request.getSession().getServletContext().getContextPath();

        // 访问：http://127.0.0.1:8080/demo/path得出的结果
        String remoteUser = request.getRemoteUser(); // null
        int localPort = request.getLocalPort(); // 8080
        String localAddr = request.getLocalAddr(); // 127.0.0.1
        String remoteAddr = request.getRemoteAddr(); // 127.0.0.1
        int remotePort = request.getRemotePort(); // 8080
        // /demo/path (当前 Servlet 在项目的绝对路径)
        String requestURI = request.getRequestURI();
        // http://127.0.0.1:8080/demo/path (当前 Servlet 在项目中带协议和地址端口的绝对路径)
        StringBuffer requestURL = request.getRequestURL();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```
输出截图：
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142859.png)