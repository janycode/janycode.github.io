---
title: 16-Servlet通用编程
date: 2017-5-22 22:26:20
tags:
- Servlet
categories: 
- 04_大前端
- 04_Servlet
---

以模拟账号登陆为案例：

### 1. 表单中隐藏标签传递方法名
通过 html 中的 from 表单可以实现发送请求到 web 服务器。
此时对 form 表单中加入核心的一句：
`<input type="hidden" name="methodName" value="login">`
一个对客户端用户隐藏的键值对 methodName = "login"。

```java
<form action="/demo/user" method="post">
    <input type="hidden" name="methodName" value="login">
    账户：<input type="text" name="username"> <br><br>
    密码：<input type="text" name="password"> <br><br>
    <button type="submit">登陆</button>
</form>
```

### 2. BaseServlet：通用Servlet父类
创建 BaseServlet 核心父类默认继承 HttpServlet 来实现对服务器中的 web 页面请求和响应的处理。
此时我们做通用编程：
① 使用 request 获取到 form 表单中的隐藏键值对，即方法名
② 使用 反射 获取到 this 当前实例的 Method 对象
`当一个子类继承该类，即拥有了一份父类的方法（处理请求响应的 doPost/doGet），此时的 this 代表的是子类实例对象。`
③ 使用 反射 中 Method 对象的 invoke 来调用执行方法
`执行的则是子类中的对应方法名的方法。`
④ 接收方法的返回值（返回路径字符串）来做按需转发/重定向
```java
@WebServlet(name = "BaseServlet", urlPatterns = "/base")
public class BaseServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 中文乱码最好用 Filter 过滤器处理，此时此行单独加这里
        response.setContentType("text/html;charset=utf-8");

        String methodName = request.getParameter("methodName");
        try {
            Method method = this.getClass().getMethod(methodName, HttpServletRequest.class, HttpServletResponse.class);
            String returnValue = (String) Objects.requireNonNull(method).invoke(this, request, response);
            // 返回值：String(需处理) / null(不需处理)
            if (null != returnValue) {
                if (returnValue.lastIndexOf(":") != -1) {
                    // 有':'分隔符
                    // 实现资源跳转，重定向 或 转发
                    String path = returnValue.split(":")[1];
                    if (returnValue.startsWith("redirect")) {
                        // request.getContextPath() 当前项目名称，可以统一 path 的写法
                        response.sendRedirect(request.getContextPath() + path);
                    } else if (returnValue.startsWith("forward")) {
                        request.getRequestDispatcher(path).forward(request, response);
                    }
                } else {
                    // 没有':'分隔符，默认转发到 /xxx.html
                    request.getRequestDispatcher(returnValue).forward(request, response);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```

### 3. UserServlet：用户管理子类
如用户管理模块的请求处理：
通过继承 BaseServlet 来实现调用父类的 doPost() 处理请求和响应
好处：
① 不需要写额外的Servlet
② 在子类 Servlet 中将请求和响应集成为不同的方法调用
`继承了通用 Servlet 的子类 Servlet，可以把每一个方法看做一个独立的 Servlet`
③ 字符串返回值使用 请求或重定向标记，分隔目的资源路径

```java
@WebServlet(name = "UserServlet", urlPatterns = "/user")
public class UserServlet extends BaseServlet {
    public String login(HttpServletRequest request, HttpServletResponse response) {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        User inputUser = new User();
        inputUser.setUsername(username);
        inputUser.setPassword(password);

        UserDao userDao = new UserDaoImpl();
        try {
            User existUser = userDao.login(inputUser);
            if (null != existUser) {
                // 登陆成功
                request.getSession().setAttribute("existUser", existUser);
                // 重定向请求到showIndex方法
                //response.sendRedirect("/demo/user?methodName=showIndex");
                return "redirect:/user?methodName=showIndex";
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 登陆失败
        //request.getRequestDispatcher("/login.html").forward(request, response);
        return "forward:/login.html";
    }

    public void showIndex(HttpServletRequest request, HttpServletResponse response) throws IOException {
        System.out.println("showIndex");
        User existUser = (User) request.getSession().getAttribute("existUser");
        StringBuilder respBody = new StringBuilder();
        if (null != existUser) {
            // 登陆状态
            respBody.append("欢迎回来，")
                    .append(existUser.getUsername())
                    .append(" <a href='/demo/user?methodName=logout'>注销</a>")
            ;
        } else {
            // 不在登陆状态
            respBody.append("你还没有登陆，")
                    .append("<a href='/login.html'>登陆</a>")
            ;
        }
        response.getWriter().write(respBody.toString());
    }

    public String logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.getSession().invalidate();
        //response.sendRedirect("/demo/login.html");
        return "redirect:/login.html";
    }
}
```