---
title: 15-Listener统计在线人数
date: 2017-5-22 22:26:20
tags:
- Servlet
- Listener
categories: 
- 04_网页技术
- 04_Servlet
---

### Listener 过滤器实现统计在线人数（流程图+核心逻辑）

流程图：
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142811.png)

核心逻辑：
login.html

```html
<form action="/demo/login" method="post">
    账户：<input type="text" name="username" id=""> <br>
    密码：<input type="password" name="password" id=""> <br>
    <input type="submit" value="登陆">
</form>
```
User.java
```java
/**
 * 事件源：Java对象
 * 监听器：HttpSessionBindingListener
 * 绑定：java对象实现监听器接口
 * 事件：java对象在Session中的状态发生改变
 */
public class User implements HttpSessionBindingListener {
    @Override
    public void valueBound(HttpSessionBindingEvent event) {
        System.out.println("HttpSession 与 User 绑定");
        // 有用户登陆成功
        // 判断是否是第一个登陆的人
        ServletContext servletContext = event.getSession().getServletContext();
        Integer count = (Integer) servletContext.getAttribute("count");
        // 第一个登陆为1，非第一个则++
        count = null == count ? 1 : (count += 1);
        servletContext.setAttribute("count", count);
    }

    @Override
    public void valueUnbound(HttpSessionBindingEvent event) {
        System.out.println("HttpSession 与 User 解绑");
        // 有用户注销登陆
        ServletContext servletContext = event.getSession().getServletContext();
        Integer count = (Integer) servletContext.getAttribute("count");
        // count--是因为在同浏览器下重复登陆时session.setAttribute(name, value)
        // 每次会覆盖value值进而触发监听器valueBound()的count++
        count--;
        servletContext.setAttribute("count", count);
    }

    private int id;
    private String username;
    private String password;

    public User() {
    }

    public User(int id, String username, String password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
```
LoginServlet.java
```java
@WebServlet(name = "LoginServlet", urlPatterns = "/login")
public class LoginServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        if ("root".equals(username) && "1234".equals(password)) {
            // 登陆成功，修改登陆状态，转发到showIndex页
            User user = new User();
            user.setUsername(username);
            user.setPassword(password);
            request.getSession().setAttribute("existUser", user);
            // 转发会导致每次刷新页面都会重新登陆，然后被统计新新用户中
            //request.getRequestDispatcher("/showIndex").forward(request, response);
            response.sendRedirect("/demo/showIndex");
        } else {
            // 登陆失败，转发到login.html
            request.getRequestDispatcher("/demo/login.html").forward(request, response);
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```
LogoutServlet.java
```java
@WebServlet(name = "LogoutServlet", urlPatterns = "/logout")
public class LogoutServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 注销登陆：将existUser从session域中移除 或 销毁session
        //request.getSession().removeAttribute("existUser");
        request.getSession().invalidate();
        // 注销成功
        request.getRequestDispatcher("/showIndex").forward(request, response);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```
ShowIndexServlet.java
```java
@WebServlet(name = "ShowIndexServlet", urlPatterns = "/showIndex")
public class ShowIndexServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        User existUser = (User) request.getSession().getAttribute("existUser");
        StringBuffer responseBody = new StringBuffer();
        if (null == existUser) {
            // 不在登陆状态
            responseBody.append("您还没有登陆，<a href='/demo/login.html'>请登录</a>");
        } else {
            // 在登陆状态
            responseBody.append("欢迎回来,").append(existUser.getUsername()).append("  <a href='/demo/logout'>注销</a>");
        }

        // 获取在线人数
        ServletContext servletContext = getServletContext();
        Integer count = (Integer) servletContext.getAttribute("count");
        System.out.println("在线人数：" + count);
        if (null == count) {
            // 没有人登陆时，0人
            count = 0;
        }
        responseBody.append("<br>在线人数为：").append(count).append("人");

        response.setContentType("text/html;charset=utf-8");
        response.getWriter().write(responseBody.toString());
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```