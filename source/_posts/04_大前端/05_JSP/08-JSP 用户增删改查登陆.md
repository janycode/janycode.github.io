---
title: 08-JSP 用户增删改查登陆
date: 2018-4-29 22:36:54
tags:
- JSP
categories: 
- 04_大前端
- 05_JSP
---

### 1.0 核心流程

**主界面**：
![JSP+MVC+三层架构设计](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142946.png)

**核心功能**：
JSP + MVC + 三层架构设计实现，用户信息(id/username/password)的注册、删除、修改、查询展示所有、登陆、登出。

**核心流程图**(点击/拖动均可放大)：
![JSP+MVC+三层架构设计](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142951.png)
User.java

```java
public class User {
    private Integer id;
    private String username;
    private String password;
    ...
}
```
BaseServlet.java
```java
@WebServlet(name = "BaseServlet", urlPatterns = "/base")
public class BaseServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String methodName = request.getParameter("methodName");
        System.out.println("BaseServlet methodName=" + methodName);
        try {
            Method method = this.getClass().getMethod(methodName, HttpServletRequest.class, HttpServletResponse.class);
            String returnValue = (String) Objects.requireNonNull(method).invoke(this, request, response);
            if (null != returnValue) {
                // 资源跳转
                int index = returnValue.lastIndexOf(":");
                if (-1 == index) {
                    // 没有":" 转发
                    request.getRequestDispatcher(returnValue).forward(request, response);
                } else {
                    // 有":"
                    String path = returnValue.substring(index + 1);
                    if (returnValue.startsWith("redirect")) {
                        response.sendRedirect(request.getContextPath() + path);
                    } else if (returnValue.startsWith("forward")) {
                        request.getRequestDispatcher(path).forward(request, response);
                    }
                }
            } else {

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

### 1.1 注册
register.jsp
```html
<div style="color: red;">${errorMsg}</div>
<form action="${pageContext.request.contextPath}/user" method="post">
    <input type="hidden" name="methodName" value="registerUser">
    账户：<input type="text" name="username" placeholder="请输入用户名"> <br>
    密码：<input type="text" name="password" placeholder="请输入密码"> <br>
    <button type="submit">注册</button>
</form>
```
index.jsp
```html
<table border="1" cellspacing="0px" cellpadding="5px" width="500px">
    <tr>
        <td>ID</td>
        <td>账户</td>
        <td>密码</td>
        <td>操作</td>
    </tr>
    <c:forEach items="${userList}" var="user">
        <tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.password}</td>
            <td>
                <a href="${pageContext.request.contextPath}/user?methodName=toUpdateUserById&id=${user.id}">修改</a>
                <c:if test="${existUser.username != user.username}">
                    <a href="${pageContext.request.contextPath}/user?methodName=deleteUserById&id=${user.id}">删除</a>
                </c:if>
            </td>
        </tr>
    </c:forEach>
</table>
```
UserServlet.java
```java
public String registerUser(HttpServletRequest request, HttpServletResponse response) {
    User inputUser = new User();
    try {
        BeanUtils.populate(inputUser, request.getParameterMap());
        userService.registerUser(inputUser);
        // 注册成功
        return "/user?methodName=selectUserList";
    } catch (Exception e) {
        e.printStackTrace();
    }
    // 注册失败
    request.setAttribute("errorMsg", "注册失败!");
    return "/user?methodName=registerUser" +
            "&username=" + inputUser.getUsername() +
            "&password=" + inputUser.getPassword();
}
```
UserServiceImpl.java
```java
public boolean registerUser(User inputUser) {
    return userDao.registerUser(inputUser) == 1;
}
```
UserDaoImpl.java
```java
public int registerUser(User inputUser) {
    try {
        return queryRunner.update(
                "insert into user(username, password) value(?,?)",
                inputUser.getUsername(),
                inputUser.getPassword()
        );
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return -1;
}
```
### 1.2 登陆
login.jsp
```html
<div style="color: red;">${errorMsg}</div>
<form action="${pageContext.request.contextPath}/user" method="post">
    <input type="hidden" name="methodName" value="login">
    账户：<input type="text" name="username"> <br>
    密码：<input type="text" name="password"> <br>
    <button type="submit">登陆</button>
</form>
```
index.jsp
```html
<%--在登陆状态：显示用户名，提供注销--%>
<c:if test="${existUser != null}">
    欢迎回来，<span style="color: red;">${existUser.username}</span>！
    <br>
    <a href="${pageContext.request.contextPath}/register.jsp">
        <button>新增用户</button>
    </a>
    ...
</c:if>
<%--不在登陆状态：提示登陆--%>
<c:if test="${existUser == null}">
    您还没有登陆，<a href="${pageContext.request.contextPath}/login.jsp">请登录</a>
</c:if>

```
UserServlet.java
```java
public String login(HttpServletRequest request, HttpServletResponse response) {
    User inputUser = new User();

    try {
        BeanUtils.populate(inputUser, request.getParameterMap());
        User existUser = userService.login(inputUser);
        if (null != existUser) {
            // 登陆成功修改登陆状态，重定向到获取用户列表，首页
            request.getSession().setAttribute("existUser", existUser);
            //return "redirect:/index.jsp";
            // 地址的变化可以保证在用户列表页，每次刷新都会重新获取新的列表
            return "redirect:/user?methodName=selectUserList";
        } else {
            request.setAttribute("errorMsg", "账户或密码错误");
            return "/login.jsp";
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
    // 有异常产生意味着登陆失败，返回登陆页面，重新登陆
    return "/login.jsp";
}

public String selectUserList(HttpServletRequest request, HttpServletResponse response) {
    List<User> userList = userService.selectUserList();
    request.getSession().setAttribute("userList", userList);
    return "/index.jsp";
}
```
UserServiceImpl.java
```java
public User login(User inputUser) {
    return userDao.login(inputUser);
}
```
UserDaoImpl.java
```java
public User login(User inputUser) {
    try {
        return queryRunner.query(
                "select * from user where username=? and password=?",
                new BeanHandler<>(User.class),
                inputUser.getUsername(),
                inputUser.getPassword()
        );
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return null;
}
```
### 1.3 登陆校验
LoginFilter.java
```java
@Override
public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {
    HttpServletRequest request = (HttpServletRequest) req;
    HttpServletResponse response = (HttpServletResponse) resp;

    String requestURI = request.getRequestURI();
    String methodName = request.getParameter("methodName");
    if (requestURI.contains("login") || (methodName != null && methodName.equals("login"))) {
        // 和登陆页面相关
        chain.doFilter(req, resp);
    } else {
        // 登陆状态校验
        User existUser = (User) request.getSession().getAttribute("existUser");
        if (null == existUser) {
            // 不在登陆状态
            response.sendRedirect("/demo/login.jsp");
        } else {
            // 在登陆状态，放行
            chain.doFilter(req, resp);
        }
    }
}
```

### 1.4 注销
index.jsp
```html
...
<a href="${pageContext.request.contextPath}/user?methodName=logout">注销</a>
...
```
UserServlet.java
```java
public String logout(HttpServletRequest request, HttpServletResponse response) {
    try {
        request.getSession().invalidate();
        // 注销成功
        return "redirect:/index.jsp";
    } catch (Exception e) {
        e.printStackTrace();
        // 注销失败
        return "/index.jsp";
    }
}
```

### 1.5 修改
index.jsp
```html
<table border="1" cellspacing="0px" cellpadding="5px" width="500px">
	...
     <c:forEach items="${userList}" var="user">
         <tr>
             <td>${user.id}</td>
             <td>${user.username}</td>
             <td>${user.password}</td>
             <td>
                 <a href="${pageContext.request.contextPath}/user?methodName=toUpdateUserById&id=${user.id}">修改</a>
             </td>
         </tr>
     </c:forEach>
 </table>
```
updateUser.jsp
```html
<div style="color: red;">${errorMsg}</div>
<form action="${pageContext.request.contextPath}/user" method="post">
    <input type="hidden" name="methodName" value="updateUser">
    <input type="hidden" name="id" value="${user.id}">
    新账户：<input type="text" name="username" value="${user.username}"> <br>
    新密码：<input type="text" name="password" value="${user.password}"> <br>
    <button type="submit">修改</button>
</form>
```

UserServlet.java

```java
public String toUpdateUserById(HttpServletRequest request, HttpServletResponse response) {
    Integer id = Integer.valueOf(request.getParameter("id"));
    User user = userService.selectUserById(id);
    request.setAttribute("user", user);
    return "/updateUser.jsp";
}

public String updateUser(HttpServletRequest request, HttpServletResponse response) {
    User inputUser = new User();
    try {
        BeanUtils.populate(inputUser, request.getParameterMap());
        userService.updateUserById(inputUser);
        // 修改成功
        return "/user?methodName=selectUserList";
    } catch (Exception e) {
        e.printStackTrace();
    }
    request.setAttribute("errorMsg", "修改失败!");
    // 修改失败
    return "/user?methodName=toUpdateUserById&id=" + inputUser.getId();
}
```
UserServiceImpl.java
```java
public User selectUserById(Integer id) {
    return userDao.selectUserById(id);
}

public boolean updateUserById(User inputUser) {
    return userDao.updateUserById(inputUser) == 1;
}
```
UserDaoImpl.java
```java
public User selectUserById(Integer id) {
    try {
        return queryRunner.query(
                "select * from user where id=?",
                new BeanHandler<>(User.class),
                id);
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return null;
}

public int updateUserById(User inputUser) {
    try {
        return queryRunner.update(
                "update user set username=?,password=? where id=?",
                inputUser.getUsername(),
                inputUser.getPassword(),
                inputUser.getId()
        );
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return -1;
}
```
### 1.6 删除
index.jsp
```html
<table border="1" cellspacing="0px" cellpadding="5px" width="500px">
	...
    <c:forEach items="${userList}" var="user">
        <tr>
			...
            <td>
                <c:if test="${existUser.username != user.username}">
                    <a href="${pageContext.request.contextPath}/user?methodName=deleteUserById&id=${user.id}">删除</a>
                </c:if>
            </td>
        </tr>
    </c:forEach>
</table>
```
UserServlet.java
```java
public String deleteUserById(HttpServletRequest request, HttpServletResponse response) {
    Integer id = Integer.valueOf(request.getParameter("id"));
    boolean result = userService.deleteUserById(id);
    return "redirect:/user?methodName=selectUserList";
}
```
UserServiceImpl.java
```java
public boolean deleteUserById(Integer id) {
    return userDao.deleteUserById(id) == 1;
}
```
UserDaoImpl.java
```java
public int deleteUserById(Integer id) {
    try {
        return queryRunner.update(
                "delete from user where id=?",
                id);
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return -1;
}
```
### 1.7 批量删除
index.jsp
```html
<form action="${pageContext.request.contextPath}/user?methodName=deleteUsersByIds" method="post">
    <table border="1" cellspacing="0px" cellpadding="5px" width="500px">
		...
        <c:forEach items="${userList}" var="user">
            <tr>
                <td>
                    <input type="checkbox" name="ids" value="${user.id}">
                </td>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.password}</td>
				...
            </tr>
        </c:forEach>
    </table>
    <br>
    <button type="submit">批量删除</button>
</form>
```
UserServlet.java
```java
public String deleteUsersByIds(HttpServletRequest request, HttpServletResponse response) {
    String[] ids = request.getParameterValues("ids");
    if (null != ids) {
        List<Integer> idList = new ArrayList<>();
        Arrays.stream(ids).forEach(id -> idList.add(Integer.valueOf(id)));
        userService.deleteUsersByIds(idList);
    }
    return "/user?methodName=selectUserList";
}
```
UserServiceImpl.java
```java
public boolean deleteUsersByIds(List<Integer> idList) {
    return userDao.deleteUsersByIds(idList) == idList.size();
}
```
UserDaoImpl.java
```java
public int deleteUsersByIds(List<Integer> idList) {
    int numLines = 0;
    for (Integer id : idList) {
        try {
            numLines += queryRunner.update("delete from user where id=?", id);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    return numLines;
}
```

