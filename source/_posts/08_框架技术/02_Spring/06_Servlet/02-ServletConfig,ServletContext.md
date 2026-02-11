---
title: 02-ServletConfig,ServletContext
date: 2017-5-22 22:26:20
tags:
- Servlet
- 配置
categories: 
- 08_框架技术
- 02_Spring
- 06_Servlet
---

### 1. ServletConfig 接口作用和使用
`ServletConfig` 接口，是一个`配置对象`，通过 web.xml 或 注解方式配置 Servlet 参数后，可以通过 ServletConfig 对象获取初始化参数。

#### 1.1 ServletConfig API 详解
```java
public interface ServletConfig {
	//返回此 servlet 实例的名称。
    String getServletName();
	//返回对调用者在其中执行操作的 ServletContext 的引用
    ServletContext getServletContext();
	//返回包含指定初始化参数的值的 String，如果参数不存在，则返回 null
    String getInitParameter(String var1);
	//以 String 对象的 Enumeration 的形式返回 servlet 的初始化参数的名称
    Enumeration<String> getInitParameterNames();
}
```

ServletConfig 使用：
1. ServletConfig 对象是由服务器创建的，通过 Servlet 的 init 方法传递到 Servlet 中；
2. 作用：
    ① 获取 Servlet 名称使用 getServletName();
    ② 获取 Servlet 初始化参数 getInitParameter(); getInitParameterNames();
    ③ 获取 ServletContext 对象
3. **获取 ServletConfig 对象**：继承 HttpServlet 后直接调用 Servlet 接口的 `getServletConfig()` 方法即可返回一个该对象。

代码示例：
```java
@WebServlet(name = "ConfigServlet", value = "/config", initParams = {
        @WebInitParam(name = "username", value = "root"),
        @WebInitParam(name = "password", value = "1234")})
public class ConfigServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 1.获取 ServletConfig 对象
        ServletConfig servletConfig = getServletConfig();
        // 2.1 获取 Servlet 的名称：注解中的name 或 web.xml中的<servlet-name>
        System.out.println(servletConfig.getServletName() + "在运行..."); // ConfigServlet
        // 2.2 获取 Servlet 的初始化参数
        String username = servletConfig.getInitParameter("username");
        String password = servletConfig.getInitParameter("password");
        System.out.println("直接-servlet初始化参数 "+ username + ":" + password);
        // 2.2 动态获取初始化参数名称
        Enumeration<String> initParameterNames = servletConfig.getInitParameterNames();
        while (initParameterNames.hasMoreElements()) {
            String name = initParameterNames.nextElement();
            String value = servletConfig.getInitParameter(name);
            System.out.println("动态-servlet初始化参数 "+ username + ":" + password);
        }

        // 3. 获取 Servlet 的域对象
        ServletContext servletContext = servletConfig.getServletContext();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```

### 2. ServletContext 接口作用和使用
`ServletContext ` 接口是一个`域对象`(或叫 上下文对象)，用来存储数据。

#### 2.1 ServletContext API 详解
```java
public interface ServletContext {
	//返回 Web 应用程序的上下文路径。 
	public String getContextPath();
	//返回与服务器上的指定 URL 相对应的 ServletContext 对象。
	public ServletContext getContext(String uripath);
	//返回指定文件的 MIME 类型，如果 MIME 类型未知，则返回 null
	//常见 MIME 类型："text/html" 和 "image/gif"
	public String getMimeType(String file);
	//返回指向 Web 应用程序中资源的所有路径的类似目录的清单
	public java.util.Set<E> getResourcePaths(String path);
	//返回指向映射到指定路径的资源的 URL。该路径必须以 "/" 开头
	public java.net.URL getResource(String path);
	//以 InputStream 对象的形式返回位于指定路径上的资源
	public java.io.InputStream getResourceAsStream(String path);
	//返回一个 RequestDispatcher 对象，它充当位于给定路径上的资源的包装器
	public RequestDispatcher getRequestDispatcher(String path);
	//返回充当指定 servlet 的包装器的 RequestDispatcher 对象
	public RequestDispatcher getNamedDispatcher(String name);
	//将指定消息写入 servlet 日志文件（通常是一个事件日志）
	public void log(String msg);
	//将给定 Throwable 异常的解释性消息和堆栈跟踪写入 servlet 日志文件
	public void log(String message, Throwable throwable);
	//为给定虚拟路径返回包含实际路径的 String
	public String getRealPath(String path);
	//返回正在其上运行 servlet 的 servlet 容器的名称和版本
	public String getServerInfo();
	//返回包含指定上下文范围初始化参数值的 String，如果参数不存在，则返回 null
	public String getInitParameter(String name);
	//以 String 对象的 Enumeration 的形式返回上下文初始化参数的名称
	public java.util.Enumeration<E> getInitParameterNames();
	//返回具有给定名称的 servlet 容器属性，如果不具有该名称的属性，则返回 null
	public Object getAttribute(String name);
	//返回包含此 servlet 上下文中可用属性的名称的 Enumeration
	public java.util.Enumeration<E> getAttributeNames();
	//将对象绑定到此 servlet 上下文中的给定属性名称
	public void setAttribute(String name, Object object);
	//从 servlet 上下文中移除具有给定名称的属性
	public void removeAttribute(String name);
	//返回与此 ServletContext 相对应的 Web 应用程序的名称
	public String getServletContextName();
}
```

使用：
1. 当服务器启动时，会为服务器中的每一个web应用创建一个 ServletContext 对象；
2. 作用：
    ① 实现多个 Servlet 数据共享
    ② 获取全局初始化参数
    ③ 获取资源在服务器上的真实磁盘路径
3. **获取 ServletContext 对象**：继承 HttpServlet 后直接调用 Servlet 接口的 `getServletContext()` 方法 或 `servletConfig.getServletContext()`(通过 ServletConfig 实例对象) 即可返回一个该对象。

#### 2.2 多个 Servlet 数据共享
public Object **getAttribute**(String name)  获取域中指定参数名称的值
public void **removeAttribute**(String name)  将指定的参数和值移除
public void **setAttribute**(String name, Object object) 存储参数和值到到域中

```java
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 共享数据
        String msg = "hello, Servlet";
        // 当前 Servlet 对象【设置】共享数据 —— 到 ServletContext 域对象中
        ServletConfig servletConfig = getServletConfig();
        ServletContext servletContext = servletConfig.getServletContext();
        servletContext.setAttribute("message", msg);
        // 其他 Servlet 对象【获取】共享数据
        ServletContext servletContextGet = getServletContext();
        Object msgGet = servletContextGet.getAttribute("message");
        System.out.println("其他的Servlet获取到的共享数据为：" + msgGet); // hello, Servlet
        // 其他 Servlet 对象【移除】共享数据
        servletContextGet.removeAttribute("message");
        msgGet = servletContextGet.getAttribute("message");
        System.out.println("其他的Servlet获取到的共享数据为：" + msgGet); // null

    }
```

#### 2.3 获取全局初始化参数
public String **getInitParameter**(String name)  获取初始化参数
public java.util.Enumeration<E> **getInitParameterNames**()  获取初始化参数集合

web.xml
```xml
<!--全局初始化参数:整个web应用，随着服务器的启动而初始化-->
<context-param>
    <param-name>username</param-name>
    <param-value>root</param-value>
</context-param>
<context-param>
    <param-name>password</param-name>
    <param-value>1234</param-value>
</context-param>
<!--或注解方式配置初始化参数-->
```
```java
@WebServlet(name = "ContextServlet02", value = "/context02", initParams = {
        @WebInitParam(name = "username", value = "admin"),
        @WebInitParam(name = "password", value = "888888")})
public class ContextServlet02 extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 获取全局初始化参数
        ServletContext servletContext = getServletContext();
        // 动态获取初始化参数名称
        Enumeration<String> initParameterNames = servletContext.getInitParameterNames();
        while (initParameterNames.hasMoreElements()) {
            String name = initParameterNames.nextElement();
            String value = servletContext.getInitParameter(name);
            System.out.println("name: " + name + ", value:" + value);
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```

#### 2.4 获取资源在服务器上的真实磁盘路径
public String **getRealPath**(String path)  获取资源的真实路径

```java
@WebServlet(name = "ContextServlet03", value = "/context03")
public class ContextServlet03 extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 获取服务器上的真实磁盘路径，相对于当前项目路径拼接(因此参数也需要相对当前路径传入)
        ServletContext servletContext = getServletContext();
        String imgPath = servletContext.getRealPath("img");
        System.out.println(imgPath); // E:\xxx\out\artifacts\xxx_war_exploded\img
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```

>根据项目的当前路径 / 拼接，注意参数给的时候也是相对于 / 当前路径。

#### 2.5 案例：统计站点访问次数
```java
@WebServlet(name = "VisitTimesServlet", value = "/count")
public class VisitTimesServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 统计站点的访问次数
        ServletContext servletContext = getServletContext();
        // 从域中获取 count 是否为 null
        Integer count = (Integer) servletContext.getAttribute("count");
        count = count == null ? 1 : (count += 1); // 第一次访问为1，非第一次访问就++
        servletContext.setAttribute("count", count);
        System.out.println("站点访问次数：" + count + "次数!");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```