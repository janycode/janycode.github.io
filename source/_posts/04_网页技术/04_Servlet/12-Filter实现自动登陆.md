---
title: 12-Filter实现自动登陆
date: 2017-5-22 22:26:20
tags:
- Servlet
- Filter
categories: 
- 04_网页技术
- 04_Servlet
---

### 案例：Filter 过滤器实现自动登陆（流程图+核心实现）

* 逻辑流程：

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142726.png)

* 逻辑流程图梳理（单击放大更易查看）：

![Filter过滤器应用：自动登陆实现](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142735.png)

login.jsp
```java
<form action="/demo/login" method="post">
    账户:<input type="text" name="username"/><br>
    密码:<input type="text" name="password"/><br>
    7天内自动登录:<input type="checkbox" name="autoLogin" value="logined"><br>
    <button type="submit">登录</button>
</form>
```
AutoLoginServlet.java
```java
@WebServlet(name = "AutoLoginServlet", urlPatterns = "/login")
public class AutoLoginServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        if ("root".equals(username) && "1234".equals(password)) {
            String autoLogin = request.getParameter("autoLogin");
            System.out.println(autoLogin);
            if ("logined".equals(autoLogin)) {
                // 进行自动登陆，将用户信息保存起来，cookie最合适
                Cookie cookie = new Cookie("autoLogin", username + "-" + password);
                cookie.setMaxAge(7*24*60*60);
                response.addCookie(cookie);
            }
            // 登陆成功，转发到一个页面，显示用户信息
            Userinfo userinfo = new Userinfo();
            userinfo.setUsername(username);
            userinfo.setPassword(password);
            request.getSession().setAttribute("existUser", userinfo);
            request.getRequestDispatcher("/showIndex").forward(request, response);
        } else {
            // 登陆失败，转发到登陆页面
            request.getRequestDispatcher("/login.jsp").forward(request, response);
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```
AutoLoginFilter.java
```java
public class AutoLoginFilter implements Filter {
    @Override
    public void destroy() {
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {
        HttpServletRequest request = (HttpServletRequest) req;
        // 获取请求路径
        String requestURI = request.getRequestURI();
        System.out.println("0 requestURI:" + requestURI);
        // 1.判断访问资源是否和登陆相关
        if (requestURI.contains("login")) {
            // 登陆相关资源，直接放行
            chain.doFilter(req, resp);
        } else {
            // 非登陆相关资源
            // 2.判断是否在登陆状态 Session
            Userinfo existUser = (Userinfo) request.getSession().getAttribute("existUser");
            System.out.println("1 existUser:" + existUser);
            if (null == existUser) {
                // 不在登陆状态，进行自动登陆
                // 获取 Cookie
                Cookie cookie = CookieUtils.getCookie(request.getCookies(), "autoLogin");
                // 判断 Cookie 是否为空，存在浏览器被清理掉缓存问题
                if (null == cookie) {
                    // 浏览器清理缓存，相当于自动登陆失败！跳转到登陆页面，进行手动登陆。
                    request.getRequestDispatcher("/login.jsp").forward(request, resp);
                } else {
                    // 缓存还存在，进行自动登陆
                    // 获取用户信息
                    String[] infos = cookie.getValue().split("-");
                    String username = infos[0];
                    String password = infos[1];
                    System.out.println("3 username="+username+",password="+password);
                    if ("root".equals(username) && "1234".equals(password)) {
                        // 自动登陆成功，修改登陆状态，
                        System.out.println("自动登陆成功");
                        existUser = new Userinfo();
                        existUser.setUsername(username);
                        existUser.setPassword(password);
                        request.getSession().setAttribute("existUser", existUser);
                        chain.doFilter(req, resp);
                    } else {
                        // 自动登陆失败（修改了密码）
                        System.out.println("自动登陆失败");
                        request.getRequestDispatcher("/login.jsp").forward(request, resp);
                    }
                }
            } else {
                // 在登陆状态，直接放行
                chain.doFilter(req, resp);
            }
        }
    }

    @Override
    public void init(FilterConfig config) throws ServletException {

    }
}
```
ShowIndexServlet.java
```java
@WebServlet(name = "ShowIndexServlet", urlPatterns = "/showIndex")
public class ShowIndexServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Userinfo existUser = (Userinfo) request.getSession().getAttribute("existUser");
        StringBuffer respBody = new StringBuffer();
        if (null == existUser) {
            // 不在登陆状态
            respBody.append("您没有登陆, <a href='/demo/login.jsp'>请登陆</a>");
        } else {
            // 还在登陆状态
            respBody.append("欢迎回来，").append(existUser.getUsername());
        }
        response.getWriter().write(respBody.toString());
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```
web.xml
```xml
    <filter>
        <filter-name>AutoLoginFilter</filter-name>
        <filter-class>com.demo.filter.AutoLoginFilter</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>AutoLoginFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
```