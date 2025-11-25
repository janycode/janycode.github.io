---
title: 07-JS 用户CRUD+验证码
date: 2018-5-13 21:36:21
tags:
- JavaScript
- 验证码
categories: 
- 04_大前端
- 06_JavaScript
---

### 0. 环境准备
#### 0.1 依赖包 + jQuery库
![环境准备：依赖包](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316144717.png)



#### 0.2 JDBC 配置文件 + 工具类
c3p0.properties
```java
c3p0.driverClass=com.mysql.jdbc.Driver
c3p0.jdbcUrl=jdbc:mysql://localhost:3306/companydb
c3p0.user=root
c3p0.password=123456
```
JDBCUtils.java
```java
public class JDBCUtils {
    private static ComboPooledDataSource dataSource;
    static {
        dataSource = new ComboPooledDataSource();
    }
    public static ComboPooledDataSource getDataSource() {
        return dataSource;
    }
}
```
JsonUtils.java
```java
public class JsonUtils {
    /**
     * 将 java 对象转换为 json 字符串，并返回
     * @param object java对象
     * @return json字符串
     */
    public static String toJsonStr(Object object) throws JsonProcessingException {
        return new ObjectMapper().writeValueAsString(object);
    }
    /**
     * 转换 java 对象为 json字符串，并写入到响应
     * @param response HTTP响应
     * @param object java对象
     */
    public static void writeJsonStr(HttpServletResponse response, Object object) {
        response.setContentType("application/json;charset=utf-8");
        try {
            response.getWriter().write(toJsonStr(object));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### 0.3 bean 数据封装类
User.java

```java
public class User {
    private Integer id;
    private String username;
    private String password;
	// 构造、get、set、toString...
}
```
PageBean.java - 分页查询封装页数相关信息
```java
public class PageBean<T> {
    private Integer currentPage; // 当前页数
    private Integer totalPage; // 总页数
    private Integer totalSize; // 总记录数
    private Integer pageSize; // 每页记录数
    private List<T> list; // 当前页数据 <T> 针对哪种数据
	// 构造、get、set、toString...
}
```
#### 0.4 通用 Servlet
BaseServlet.java
```java
@WebServlet(name = "BaseServlet", urlPatterns = "/base")
public class BaseServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String methodName = request.getParameter("methodName");
        try {
            Method method = this.getClass().getMethod(methodName, HttpServletRequest.class, HttpServletResponse.class);
            String returnValue = (String) Objects.requireNonNull(method).invoke(this, request, response);
            if (null != returnValue) {
                int index = returnValue.lastIndexOf(":");
                if (-1 == index) {
                    // 没有":"
                    request.getRequestDispatcher(returnValue).forward(request, response);
                } else {
                    // 有":"
                    String path = returnValue.substring(index+1);
                    if (returnValue.startsWith("redirect")) {
                        response.sendRedirect(request.getContextPath() + File.separator + path);
                    } else if (returnValue.startsWith("forward")) {
                        request.getRequestDispatcher(path).forward(request, response);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```

UserServlet.java
```java
@WebServlet(name = "UserServlet", urlPatterns = "/user")
public class UserServlet extends BaseServlet {
    private UserService userService = new UserServiceImpl();
    // 方法：登陆、登出、注册、删除、修改、查询
}
```


### 1. 登陆登出
#### 1.1 登陆
login.jsp
```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>用户登陆</title>
    <script src="${pageContext.request.contextPath}/js/jquery-3.5.1.min.js"></script>
    <script src="${pageContext.request.contextPath}/js/check.js"></script>
</head>
<body>
<a href="${pageContext.request.contextPath}/register.jsp">
    <button>注册用户</button>
</a><br>
<br>
<span id="error" style="color: red">${errorMsg}</span>
<form action="${pageContext.request.contextPath}/user" method="post" onsubmit="return checkInfo()">
    <input type="hidden" name="methodName" value="login">
    账户：<input type="text" name="username" id="username"> <br><br>
    密码：<input type="text" name="password" id="password"> <br><br>
    验证码:<input type="text" name="validateCode">
    <img id="validateCode" src="${pageContext.request.contextPath}/validateCode.jsp" onclick="refreshCode()">
    <br>
    <button type="submit">登陆</button>
</form>
</body>
</html>
```
UserServlet.java

```java
    public String login(HttpServletRequest request, HttpServletResponse response) {
        // 获取输入验证码
        String inputCode = request.getParameter("validateCode");
        String existCode = (String) request.getSession().getAttribute("key");
        if (!inputCode.equals(existCode)) {
            // 验证码错误
            request.setAttribute("errorMsg", "验证码错误！");
            return "login.jsp";
        }

        User user = new User();
        try {
            BeanUtils.populate(user, request.getParameterMap());
            User existUser = userService.login(user);
            if (null == existUser) {
                // 登陆失败
                request.setAttribute("errorMsg", "账户或密码错误");
                return "login.jsp";
            } else {
                // 登陆成功
                request.getSession().setAttribute("existUser", existUser);
                return "redirect:index.jsp";
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "login.jsp";
    }
```
UserServiceImpl.java
```java
    @Override
    public User login(User inputUser) throws Exception {
        return userDao.login(inputUser);
    }
```
UserDaoImpl.java
```java
    @Override
    public User login(User inputUser) throws Exception {
        return new QueryRunner(JDBCUtils.getDataSource()).query(
                "select * from userinfo where username=? and password=?",
                new BeanHandler<>(User.class),
                inputUser.getUsername(),
                inputUser.getPassword()
        );
    }
```

#### 1.2 登出
index.jsp
```html
<%--登陆状态：显示用户名，提供注销--%>
<c:if test="${existUser != null}">
    欢迎回来，<span style="color: orange">${existUser.username}</span>
    <a href="${pageContext.request.contextPath}/user?methodName=logout">注销</a>

    <table id="tbl" border="1px" cellspacing="0px" cellpadding="15px" width="500px">
    </table>
    <button onclick="deleteUsers()">批量删除</button>
</c:if>
<%--不在登陆状态：提示登陆--%>
<c:if test="${existUser == null}">
    您还没有登陆，<a href="${pageContext.request.contextPath}/login.jsp">请登陆</a>
</c:if>
```

UserServlet.java
```java
    public String logout(HttpServletRequest request, HttpServletResponse response) {
        request.getSession().invalidate();
        return "redirect:index.jsp";
    }
```

#### 1.3 输入校验：check.js
```js
// 刷新验证码
function refreshCode() {
    console.log("refreshCode");
    // 因浏览器的缓存技术，故需欺骗浏览器，每次点击是一次新的图片生成
    $("#validateCode").attr("src", "${pageContext.request.contextPath}/../validateCode.jsp?" + Math.random());
}

// 表单校验 - 前端校验，不需要请求服务器
function checkInfo() {
    return checkNull("username") && checkRule("username") && checkUsernameExist() &&
        checkNull("password") && checkRule("password");
}

function checkNull(id) {
    var val = $("#" + id).val();
    var reg = /^\s*$/;
    if (reg.test(val)) {
        // 为空
        $("#error").html(id + "不能为空");
        return false;
    } else {
        // 不为空
        return true;
    }
}

// 校验账户和密码
function checkRule(id) {
    var val = $("#" + id).val();
    var reg = /^[a-z0-9]{6,9}$/;
    if (reg.test(val)) {
        return true;
    } else {
        $("#error").html(id + "由小写字母+数字组成，长度6-9位");
        return false;
    }
}

/**
 * 校验用户是否存在
 */
function checkUsernameExist() {
    var val = $("input[type='hidden']").val();
    if (val === "register") {
        var username = $("#username").val();
        $.post("${pageContext.request.contextPath}/user", {
            "methodName": "checkUsernameExist",
            "username": username
        }, function (data) {
            if (data.flag) {
                $("#error").html("用户名已存在");
                return false;
            } else {
                return true;
            }
        }, "json");
    }
}
```

#### 1.4 随机验证码：validateCode.jsp
```js
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ page import="java.util.Random"%>
<%@ page import="java.io.OutputStream"%>
<%@ page import="java.awt.Color"%>
<%@ page import="java.awt.Font"%>
<%@ page import="java.awt.Graphics"%>
<%@ page import="java.awt.image.BufferedImage"%>
<%@ page import="javax.imageio.ImageIO"%>
<%
    int width = 60;
    int height = 32;
    //创建图片对象
    BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
    Graphics g = image.getGraphics();
    //设置背景颜色
    g.setColor(new Color(0xDCDCDC));
    g.fillRect(0, 0, width, height);
    //设置边框
    g.setColor(Color.black);
    g.drawRect(0, 0, width - 1, height - 1);
    // create a random instance to generate the codes
    Random rdm = new Random();
    String hash1 = Integer.toHexString(rdm.nextInt());
    //画干扰线
    for (int i = 0; i < 50; i++) {
        int x = rdm.nextInt(width);
        int y = rdm.nextInt(height);
        g.drawOval(x, y, 0, 0);
    }
    //生成四位随机验证码
    String capstr = hash1.substring(0, 4);
    session.setAttribute("key", capstr);
    System.out.println(capstr);
    g.setColor(new Color(0, 100, 0));
    g.setFont(new Font("Candara", Font.BOLD, 24));
    g.drawString(capstr, 8, 24);
    g.dispose();
    response.setContentType("image/jpeg");
    out.clear();
    out = pageContext.pushBody();
    OutputStream strm = response.getOutputStream();
    ImageIO.write(image, "jpeg", strm);
    strm.close();
%>
```

### 2. 注册 C
register.jsp
```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>注册页面</title>
    <script src="${pageContext.request.contextPath}/js/jquery-3.5.1.min.js"></script>
    <script src="${pageContext.request.contextPath}/js/check.js"></script>
</head>
<body>
<span id="error" style="color: red">${errorMsg}</span>
<form action="${pageContext.request.contextPath}/user" method="post" onsubmit="return checkInfo()">
    <input type="hidden" name="methodName" value="register">
    账户：<input type="text" name="username" id="username"> <br><br>
    密码：<input type="text" name="password" id="password"> <br><br>
    验证码:<input type="text" name="validateCode">
    <img id="validateCode" src="${pageContext.request.contextPath}/validateCode.jsp" onclick="refreshCode()">
    <br>
    <button type="submit">注册</button>
</form>
</body>
</html>
```
UserServlet.java
```java
    public void checkUsernameExist(HttpServletRequest request, HttpServletResponse response) {
        String username = request.getParameter("username");
        boolean flag = false;
        String msg = null;
        if (null != username) {
            try {
                flag = userService.checkUsernameExist(username);
                msg = flag ? "用户名已存在" : "用户名可用";
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        Map<String, Object> map = new HashMap<>();
        map.put("flag", flag);
        map.put("msg", msg);
        JsonUtils.writeJsonStr(response, map);
    }
    public String register(HttpServletRequest request, HttpServletResponse response) {
        User user = new User();
        try {
            BeanUtils.populate(user, request.getParameterMap());
            return userService.addUser(user) ? "redirect:login.jsp" : "register.jsp";
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "register.jsp";
    }
```

UserServiceImpl.java
```java
    @Override
    public boolean addUser(User user) throws Exception {
        return userDao.addUser(user) == 1;
    }
```

UserDaoImpl.java
```java
    @Override
    public int addUser(User user) throws Exception {
        return new QueryRunner(JDBCUtils.getDataSource()).update(
                "insert into userinfo(username, password) values(?,?)",
                user.getUsername(),
                user.getPassword()
        );
    }
```

### 3. 查询 R
#### 3.1 分页查询
index.jsp - 注意 jstl标签库、jQuer库、异步请求。
```html
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>首页</title>
    <style>
        a {
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
    <script src="${pageContext.request.contextPath}/js/jquery-3.5.1.min.js"></script>
    <script>
        console.log("开始异步请求...");

        /**
         * 分页查询用户列表
         * @param currentPage 当前页数
         */
        function selectUserListByPage(currentPage) {
            // 异步加载列表数据
            $.get("${pageContext.request.contextPath}/user", {
                "methodName": "selectUserListByPage",
                "currentPage": currentPage
            }, function (data) {
                console.log(data);
                var pageBean = data; // data就是 pageBean (js对象)
                var html = "";
                html += "<tr>";
                html += "<th><input type='checkbox'></th>";
                html += "<th>ID</th>";
                html += "<th>账户</th>";
                html += "<th>密码</th>";
                html += "<th>操作</th>";
                html += "</tr>";
                var list = pageBean.list;
                $(list).each(function (index) {
                    html += "<tr>";
                    html += "<td style='text-align: center'><input type='checkbox' class='ids' value='" + this.id + "'></td>";
                    html += "<td>" + this.id + "</td>";
                    html += "<td>" + this.username + "</td>";
                    html += "<td>" + this.password + "</td>";
                    html += "<td>";
                    html += "<a href='javascript:void(0)' onclick='deleteUser(" + this.id + ")'>删除</a>&nbsp;";
                    html += "<a href='${pageContext.request.contextPath}/user?methodName=toUpdateUser&id=" + this.id + "'>修改</a>&nbsp;";
                    html += "</td>";
                    html += "</tr>";
                });
                // 第1/10页 总记录数:100 每页显示10条 [首页][上一页][下一页][尾页]
                html += "<tr>";
                html += "<td colspan='5' style='text-align: center'>";
                html += "第" + pageBean.currentPage + "/" + pageBean.totalPage + "页 总数:" + pageBean.totalSize + " 每页" + pageBean.pageSize + "条";
                if (pageBean.currentPage !== 1) {
                    // 显示[首页]和[上一页]
                    html += "&nbsp;[<a href='javascript:void(0)' onclick='selectUserListByPage(1)'>首页</a>]";
                    html += "&nbsp;[<a href='javascript:void(0)' onclick='selectUserListByPage(" + (pageBean.currentPage - 1) + ")'>上一页</a>]";
                }
                if (pageBean.currentPage !== pageBean.totalPage) {
                    // 显示[尾页]和[下一页]
                    html += "&nbsp;[<a href='javascript:void(0)' onclick='selectUserListByPage(" + (pageBean.currentPage + 1) + ")'>下一页</a>]";
                    html += "&nbsp;[<a href='javascript:void(0)' onclick='selectUserListByPage(" + pageBean.totalPage + ")'>尾页</a>]";
                }
                html += "</td>";
                html += "</tr>";
                $("#tbl").html(html);
            }, "json");
        }

        /**
         * 删除用户
         * @param id 用户编号
         */
        function deleteUser(id) {
            var flag = confirm("是否确认删除该用户？");
            if (flag) {
                $.post("${pageContext.request.contextPath}/user", {
                    "methodName": "deleteUser",
                    "id": id
                }, function (data) {
                    console.log(data);
                    // 如果删除成功，刷新列表区域(查询1次)；删除失败，不错任何处理
                    if (data.flag) {
                        selectUserListByPage(1);
                    }
                }, "json");
            }
        }

        /**
         * 批量删除用户
         */
        function deleteUsers() {
            var eles = $(".ids:checked");
            if (eles.length === 0) {
                alert("请选中需要删除的选项");
            } else {
                var ids = [];
                eles.each(function (index) {
                    var id = $(this).val();
                    ids.push(id);
                });
                var idsStr = ids.join(",");

                var flag = confirm("是否确认删除？");
                if (flag) {
                    $.post("${pageContext.request.contextPath}/user", {
                        "methodName": "deleteUsers",
                        "ids": idsStr
                    }, function (data) {
                        alert(data.msg);
                        selectUserListByPage(1);
                    }, "json");
                }
            }
        }

        $(function () {
            selectUserListByPage(1);
        });
    </script>
</head>
<body>

<%--登陆状态：显示用户名，提供注销--%>
<c:if test="${existUser != null}">
    欢迎回来，<span style="color: orange">${existUser.username}</span>
    <a href="${pageContext.request.contextPath}/user?methodName=logout">注销</a>

    <table id="tbl" border="1px" cellspacing="0px" cellpadding="15px" width="500px">
    </table>
    <button onclick="deleteUsers()">批量删除</button>
</c:if>
<%--不在登陆状态：提示登陆--%>
<c:if test="${existUser == null}">
    您还没有登陆，<a href="${pageContext.request.contextPath}/login.jsp">请登陆</a>
</c:if>

</body>
</html>

```
UserServlet.java
```java
    private Integer getCurrentPage(String currentPageStr) {
        return Integer.valueOf(currentPageStr) == null ? 1 : Integer.parseInt(currentPageStr);
    }

    public void selectUserListByPage(HttpServletRequest request, HttpServletResponse response) {
        String currentPageStr = request.getParameter("currentPage");
        Integer currentPage = getCurrentPage(currentPageStr);
        try {
            PageBean<User> pageBean = userService.selectUserListByPage(currentPage);
            // 将 PageBean 转换成 json 字符串
            JsonUtils.writeJsonStr(response, pageBean);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
```

UserServiceImpl.java
```java
    @Override
    public PageBean<User> selectUserListByPage(Integer currentPage) throws Exception {
        PageBean<User> pageBean = new PageBean<>();
        // 当前页数
        pageBean.setCurrentPage(currentPage);
        // 总记录数
        Integer totalSize = userDao.getTotalSize();
        pageBean.setTotalSize(totalSize);
        // 每页记录数
        Integer pageSize = 4;
        pageBean.setPageSize(pageSize);
        // 总页数(没余数为整页，有余数页数+1)
        Integer totalPages = (totalSize%pageSize==0) ? (totalSize/pageSize) : (totalSize/pageSize+1);
        pageBean.setTotalPage(totalPages);
        // 当前页数据
        List<User> list = userDao.queryAllByLimit(pageSize*(currentPage-1), pageSize);
        pageBean.setList(list);
        return pageBean;
    }
```

UserDaoImpl.java
```java
    @Override
    public Integer getTotalSize() throws Exception {
        return new QueryRunner(JDBCUtils.getDataSource()).query(
                "select count(id) from userinfo",
                new ScalarHandler<Long>()
        ).intValue();
    }

    @Override
    public List<User> queryAllByLimit(Integer begin, Integer pageSize) throws Exception {
        return new QueryRunner(JDBCUtils.getDataSource()).query(
                "select * from userinfo limit ?,?",
                new BeanListHandler<>(User.class),
                begin,
                pageSize
        );
    }
```

### 4. 修改 U
update.jsp
```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title></title>
    <script src="${pageContext.request.contextPath}/js/jquery-3.5.1.min.js"></script>
    <script src="${pageContext.request.contextPath}/js/check.js"></script>
</head>
<body>
<span id="error" style="color: red">${errorMsg}</span>
<form action="${pageContext.request.contextPath}/user" method="post" onsubmit="return checkInfo()">
    <input type="hidden" name="methodName" value="update">
    新账户：<input type="text" name="username" id="username" value="${user.username}"> <br><br>
    新密码：<input type="text" name="password" id="password" value="${user.password}"> <br><br>
    验证码:<input type="text" name="validateCode">
    <img id="validateCode" src="${pageContext.request.contextPath}/validateCode.jsp" onclick="refreshCode()">
    <br>
    <button type="submit">修改</button>
</form>
</body>
</html>

```

UserServlet.java
```java
    public String toUpdateUser(HttpServletRequest request, HttpServletResponse response) {
        Integer id = Integer.parseInt(request.getParameter("id"));
        try {
            User user = userService.selectUserById(id);
            if (null != user) {
                request.setAttribute("user", user); // 修改页显示当前信息，便于修改
                return "update.jsp";
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "redirect:index.jsp";
    }

    public String update(HttpServletRequest request, HttpServletResponse response) {
        User user = new User();
        try {
            BeanUtils.populate(user, request.getParameterMap());
            if (userService.updateUser(user)) {
                return "redirect:index.jsp";
            } else {
                request.setAttribute("errorMsg", "修改失败");
                return "update.jsp";
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "redirect:index.jsp";
    }
```

UserServiceImpl.java
```java
    @Override
    public User selectUserById(Integer id) throws Exception {
        return userDao.selectUserById(id);
    }

    @Override
    public boolean updateUser(User user) throws Exception {
        return userDao.updateUser(user) == 1;
    }
```

UserDaoImpl.java
```java
    @Override
    public User selectUserById(Integer id) throws Exception {
        return new QueryRunner(JDBCUtils.getDataSource()).query(
                "select * from userinfo where id=?",
                new BeanHandler<>(User.class),
                id
        );
    }

    @Override
    public int updateUser(User user) throws Exception {
        return new QueryRunner(JDBCUtils.getDataSource()).update(
                "update userinfo set username=?, password=? where id=?",
                user.getUsername(),
                user.getPassword(),
                user.getId()
        );
    }
```

### 5. 删除 D
#### 5.1 单个删除
index.jsp - 参考 分页查询。

UserServlet.java
```java
    public void deleteUser(HttpServletRequest request, HttpServletResponse response) {
        Integer id = Integer.parseInt(request.getParameter("id"));
        boolean flag = false;
        String msg = null;
        try {
            flag = userService.deleteUserById(id);
            msg = flag ? "删除成功" : "删除失败";
        } catch (Exception e) {
            e.printStackTrace();
        }
        Map<String, Object> map = new HashMap<>();
        map.put("flag", flag);
        map.put("msg", msg);
        JsonUtils.writeJsonStr(response, map);
    }
```

UserServiceImpl.java
```java
    @Override
    public boolean deleteUserById(Integer id) throws Exception {
        return userDao.deleteUserById(id) == 1;
    }
```
UserDaoImpl.java
```java
    @Override
    public int deleteUserById(Integer id) throws Exception {
        return new QueryRunner(JDBCUtils.getDataSource()).update(
                "delete from userinfo where id=?",
                id
        );
    }
```

#### 5.2 批量删除
index.jsp - 参考 分页查询。

UserServlet.java
```java
    public void deleteUsers(HttpServletRequest request, HttpServletResponse response) {
        String idsStr = request.getParameter("ids");
        String[] ids = idsStr.split(",");
        boolean flag = false;
        String msg = null;
        for (String id : ids) {
            try {
                flag = userService.deleteUserById(Integer.parseInt(id));
                if (!flag) {
                    msg = "删除失败";
                    break;
                } else {
                    msg = "删除成功";
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        Map<String, Object> map = new HashMap<>();
        map.put("flag", flag);
        map.put("msg", msg);
        JsonUtils.writeJsonStr(response, map);
    }
```

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316144733.png)



### 6. 注解优化通用 Servlet
MyResponseBody自定义注解
```java
@Retention(RetentionPolicy.RUNTIME) // 运行时可被反射捕获该注解
public @interface MyResponseBody {
}
```

UserServlet.java
```java
    @MyResponseBody
    public Object deleteUser(HttpServletRequest request, HttpServletResponse response) throws JsonProcessingException {
        Integer id = Integer.parseInt(request.getParameter("id"));
        boolean flag = false;
        String msg = null;
        try {
            flag = userService.deleteUserById(id);
            msg = flag ? "删除成功" : "删除失败";
        } catch (Exception e) {
            e.printStackTrace();
        }
        Map<String, Object> map = new HashMap<>();
        map.put("flag", flag);
        map.put("msg", msg);
        //JsonUtils.writeJsonStr(response, map);
        //return JsonUtils.toJsonStr(map);
        return map;
    }

    @MyResponseBody
    public Object deleteUsers(HttpServletRequest request, HttpServletResponse response) throws JsonProcessingException {
        String idsStr = request.getParameter("ids");
        String[] ids = idsStr.split(",");
        boolean flag = false;
        String msg = null;
        for (String id : ids) {
            try {
                flag = userService.deleteUserById(Integer.parseInt(id));
                if (!flag) {
                    msg = "删除失败";
                    break;
                } else {
                    msg = "删除成功";
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        Map<String, Object> map = new HashMap<>();
        map.put("flag", flag);
        map.put("msg", msg);
        //JsonUtils.writeJsonStr(response, map);
        return JsonUtils.toJsonStr(map);
        //return map;
    }
```

BaseServlet.java 优化兼容 json 字符串
```java
@WebServlet(name = "BaseServlet", urlPatterns = "/base")
public class BaseServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String methodName = request.getParameter("methodName");
        try {
            Method method = this.getClass().getMethod(methodName, HttpServletRequest.class, HttpServletResponse.class);
            Object returnValue = (String) Objects.requireNonNull(method).invoke(this, request, response);

            /* 判断方法上是否有 @MyResponseBody 标记注解 */
            boolean present = method.isAnnotationPresent(MyResponseBody.class);
            if (present) {
                // 有该标记注解
                if (returnValue.getClass() == String.class) {
                    // 情况一：将返回值内容作为 json 类型的响应正文，响应给浏览器
                    response.setContentType("application/json;charset=utf-8");
                    response.getWriter().write(returnValue + "");
                } else {
                    // 情况二：将返回值内容作为 java 对象类型的响应正文，响应给浏览器
                    JsonUtils.writeJsonStr(response, returnValue);
                }
            } else {
                // 没有该标记注解
                String returnValueStr = (String) returnValue;
                if (null != returnValue) {
                    int index = returnValueStr.lastIndexOf(":");
                    if (-1 == index) {
                        // 没有":"
                        request.getRequestDispatcher(returnValueStr).forward(request, response);
                    } else {
                        // 有":"
                        String path = returnValueStr.substring(index + 1);
                        if (returnValueStr.startsWith("redirect")) {
                            response.sendRedirect(request.getContextPath() + File.separator + path);
                        } else if (returnValueStr.startsWith("forward")) {
                            request.getRequestDispatcher(path).forward(request, response);
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```