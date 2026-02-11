---
title: 09-JSP 分页查询
date: 2018-4-30 19:19:22
tags:
- JSP
- 分页
categories: 
- 04_大前端
- 99_JSP
---

![分页查询](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316143012.png)

### 1. 分页查询准备工作
采用物理查询：页面查询一页，就从数据库里查询一页数量的数据。
优：减少单次查询数据库的时间
缺：增加了操作数据库的次数

所需的关于 `页数` 的数据：
请求：当前页数 `currentPage`
响应：PageBean 类封装
● 当前页数 `currentPage`
● 总页数 `totalPage`
● 总记录数 `totalSize`
● 每页记录数 `pageSize`
● 当前页数据 `pageList`

> **总页数** = `(总记录数 % 每页记录数 == 0) ? (总记录数 / 每页记录数) : (总记录数 / 每页记录数 + 1)`;
> **当前页数据** list = query( `select * from limit 每页记录数*(当前页数-1), 每页记录数` );


### 2. 分页查询逻辑实现
效果图：
![分页查询效果图](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316143021.png)


数据层封装 Employee.java(属性+生成即可) 和 `PageBean.java`：
```java
public class PageBean<T> {
    private Integer currentPage; // 当前页数
    private Integer totalPage; // 总页数
    private Integer totalSize; // 总记录数
    private Integer pageSize; // 每页记录数
    private List<T> list; // 当前页数据 <T> 针对哪种数据
    ...
}
```
显示层：`userList.jsp`
```html
<table border="1" cellspacing="0px" cellpadding="5px" width="900px">
    <tr>
        <th>ID</th>
        <th>姓</th>
        <th>名</th>
        <th>Email</th>
        <th>电话</th>
        <th>入职日期</th>
        <th>工号</th>
        <th>工资</th>
        <th>上级ID</th>
        <th>部门ID</th>
    </tr>
    <c:forEach items="${pageBean.list}" var="employee">
        <tr>
            <td>${employee.EMPLOYEE_ID}</td>
            <td>${employee.FIRST_NAME}</td>
            <td>${employee.LAST_NAME}</td>
            <td>${employee.EMAIL}</td>
            <td>${employee.PHONE_NUMBER}</td>
            <td>${employee.HIRE_DATE}</td>
            <td>${employee.JOB_ID}</td>
            <td>${employee.SALARY}</td>
            <td>${employee.MANAGER_ID}</td>
            <td>${employee.DEPARTMENT_ID}</td>
        </tr>
    </c:forEach>
    <tr>
        <td colspan="10" align="center">
            第${pageBean.currentPage}/${pageBean.totalPage}页
            总记录数:${pageBean.totalSize}条
            每页${pageBean.pageSize}条
            <c:if test="${pageBean.currentPage != 1}">
                <a href="${pageContext.request.contextPath}/user?methodName=selectUserListByPage&currentPage=1">
                    [首页]
                </a>
                <a href="${pageContext.request.contextPath}/user?methodName=selectUserListByPage&currentPage=${pageBean.currentPage-1}">
                    [上一页]
                </a>
            </c:if>
            <c:if test="${pageBean.currentPage != pageBean.totalPage}">
                <a href="${pageContext.request.contextPath}/user?methodName=selectUserListByPage&currentPage=${pageBean.currentPage+1}">
                    [下一页]
                </a>
                <a href="${pageContext.request.contextPath}/user?methodName=selectUserListByPage&currentPage=${pageBean.totalPage}">
                    [尾页]
                </a>
            </c:if>
        </td>
    </tr>
</table>
```
通用 `BaseServlet` 和 对应 `UserServlet` 资源逻辑：
```java
@WebServlet(name = "UserServlet", urlPatterns = "/user")
public class UserServlet extends BaseServlet {
    private EmployeeService employeeService = new EmployeeServiceImpl();

    public Integer getCurrentPage(String currentPagestr) {
        if (null == currentPagestr) {
            currentPagestr = "1";
        }
        return Integer.valueOf(currentPagestr);
    }

    public String selectUserListByPage(HttpServletRequest request, HttpServletResponse response) {
        String currentPageStr = request.getParameter("currentPage");
        Integer currentPageNum = getCurrentPage(currentPageStr);

        PageBean<Employee> pageBean = null;
        try {
            pageBean = employeeService.selectUserListByPage(currentPageNum);
            request.setAttribute("pageBean", pageBean);
            return "/userList.jsp";
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return "/index.jsp";
    }
}
```
```java
@WebServlet(name = "BaseServlet", urlPatterns = "/base")
public class BaseServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String methodName = request.getParameter("methodName");
        try {
            Method method = this.getClass().getMethod(methodName, HttpServletRequest.class, HttpServletResponse.class);
            String returnValue = (String) Objects.requireNonNull(method).invoke(this, request, response);
            // 路径含":"
            if (Objects.requireNonNull(returnValue).lastIndexOf(":") != -1) {
                String path = returnValue.split(":")[1];
                // 分隔出路径 r 开头的 --> 重定向
                if (returnValue.startsWith("r")) {
                    response.sendRedirect(request.getContextPath() + path);
                }
            } else {
                // 路径不含":"，默认 --> 转发
                request.getRequestDispatcher(returnValue).forward(request, response);
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
业务层：`EmployeeServiceImpl.java`
```java
public class EmployeeServiceImpl implements EmployeeService {
    private EmployeeDao employeeDao = new EmployeeDaoImpl();

    @Override
    public PageBean<Employee> selectUserListByPage(Integer currentPage) throws SQLException {
        PageBean<Employee> pageBean = new PageBean<>();
        // 当前页数
        pageBean.setCurrentPage(currentPage);
        // 总记录数
        Integer totalSize = employeeDao.getTotalSize();
        pageBean.setTotalSize(totalSize);
        // 每页记录数
        Integer pageSize = 10;
        pageBean.setPageSize(pageSize);
        // 总页数(没余数为整页，有余数页数+1)
        Integer totalPages = (totalSize%pageSize==0) ? (totalSize/pageSize) : (totalSize/pageSize+1);
        pageBean.setTotalPage(totalPages);
        // 当前页数据
        List<Employee> list = employeeDao.queryAllByLimit(pageSize*(currentPage-1), pageSize);
        pageBean.setList(list);
        return pageBean;
    }
}
```
持久层：`EmployeeDaoImpl.java`
```java
public class EmployeeDaoImpl implements EmployeeDao {
    private QueryRunner queryRunner = new QueryRunner(JDBCUtils.getDataSource());

    @Override
    public List<Employee> queryAllByLimit(int offset, int limit) throws SQLException {
        return queryRunner.query(
                "select * from t_employees limit " + offset + "," + limit,
                new BeanListHandler<>(Employee.class)
        );
    }

    @Override
    public Integer getTotalSize() throws SQLException {
        return queryRunner.query(
                "select count(*) from t_employees",
                new ScalarHandler<Long>()
        ).intValue();
    }
}
```