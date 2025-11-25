---
title: 03-JSP EL表达式
date: 2017-5-29 22:26:20
tags:
- JSP
- EL表达式
categories: 
- 04_大前端
- 05_JSP
---

### 1. 概念

el, expression language 是由 jsp 内置 jsp-api.jar 提供。
el 表达式用来替换 jsp 脚本。



### 2. 语法

```java
${表达式}
```

代替 <%=变量值%> jsp脚本。



### 3. 运算操作

算术运算：`+ - * /(div) %(mod)`

关系运算：`>(gt) <=(ge) <(lt) <=(le) ==(eq) !=(ne)`

逻辑运算：`&&(and) ||(or) !(not)`

三目运算：`? :`

字符串判等：`${str == 'hello'}` 和`${str != 'hello'}`

字符串判空： `${empty str}` 和 `${not empty str}`

```jsp
<%
request.setAttribute("num1", 100);
request.setAttribute("num2", 80);
%>

<%-- + - * /(div) %(mod) --%>
${num1+num2} <br>
${num1-num2} <br>
${num1*num2} <br>
${num1/num2} 或 ${num1 div num2} <br>
${num1%num2} 或 ${num1 mod num2} <br>

<%-- >(gt) <=(ge) <(lt) <=(le) ==(eq) !=(ne)--%>
${num1>num2}
${num1 gt num2}

<%-- &&(and) ||(or) !(not) --%>
${num1>num2 && num1<num2}
${num1>num2 or num1<num2}
${!(num1>num2)}

<%-- ? : --%>
${num1 ne num2 ? "不等" : "相等"}
```



### 4. 域对象操作×4

获取域对象：

* page域: `${pageScope.name1}`
* request域: `${requestScope.name2}`
* session域: `${sessionScope.name3}`
* application域: `${applicationScope.name4}`

> 获取对应域对象的属性值简写：${name}

```jsp
<%
    // 设置 page 域
    pageContext.setAttribute("msg1", "hello page1");
    // 设置 request 域
    request.setAttribute("msg2", "hello page2");
    // 设置 session 域
    session.setAttribute("msg3", "hello page3");
    // 设置 ServletContext 域
    application.setAttribute("msg4", "hello page4");
%>

<%--从 page 域中获取 msg1 变量--%>
${pageScope.msg1} <br>

<%--从 request 域中获取 msg2 变量--%>
${requestScope.msg2} <br>

<%--从 session 域中获取 msg3 变量--%>
${sessionScope.msg3} <br>

<%--从 application 域中获取 msg3 变量--%>
${applicationScope.msg4}
```

注意事项：

* 如果 el 表达式没有获取到结果，返回的不是 null 而是 "" 空字符串；
* ${name} 不指定域的写法，jsp 页面就会从小到大的域数据进行查找：
  `pageScope -> requestScope -> sessionScope -> applicationScope`
* 域中的共享数据一定要区别 name 的名字，以区别不同的域；

获取数组：

```jsp
<%
String[] msgs1 = {"hello", "hey", "hi"};
pageContext.setAttribute("msgs1", msgs1);
%>

<%--el 获取数组--%>
<%=
((String[])pageContext.getAttribute("msgs1"))[1]
%><br>

<%--${msgs1} 数组默认不会直接获取元素值--%>
${msgs1[1]}
```

获取List：

```jsp
<%
    List<String> msgs2 = Arrays.asList(msgs1);
    request.setAttribute("msgs2", msgs2);
%>

<%--el 获取 list--%>
<%=
((List<String>)request.getAttribute("msgs2")).get(0)
%><br>

${msgs2}<br>
${msgs2[1]}
```

获取Map：

```jsp
<%
    Map<String, Object> map = new HashMap<>();
    map.put("username", "root");
    map.put("password", "1234");
    session.setAttribute("map", map);
%>

<%--el 获取 map--%>
<%=
((HashMap<String, Object>)session.getAttribute("map")).get("username")
%><br>

${map.username}<br>
${map.password}
```

获取普通实体对象：

```jsp
<%
    User user = new User();
    user.setId(111);
    application.setAttribute("user", user);
%>

<%--el 获取 java对象--%>
<%=
((User)application.getAttribute("user")).getId()
%><br>

${user}
${user.id}
```



### 5. web对象操作×11

包含 4 个域对象：`pageScope` / `requestScope` / `sessionScope` / `applicationScope`
包含 7 个 web 对象：param / paramValues / initParam / header / headerValues / `cookie` / `pageContext`
常用：4个域对象 + cookie + pageContext

详细说明：

- param <==> request.getParameter()
- paramValues <==> request.getParameters()
- initParam <==> 获取初始化参数
- header <==> 获取单个请求头
- headerValues <==> 获取一组请求头
- cookie <==> 获取 Map 类型的 cookie 对象
- pageContext <==> 获取 jsp 内置的 9 大对象

```jsp
<%--
    param: 获取参数对象
    http://localhost:8080:/demo/elweb.jsp?username=root&password=1234
--%>
${param.username}
${param.password}

<%--
    paramValues: 获取参数对象数组
    http://localhost:8080:/demo/elweb.jsp?hobby=basketball&hobby=football
--%>
${paramValues.hobby[0]}
${paramValues.hobby[1]}

<%--
    initParam: 获取全局初始化参数对象(需要 web.xml 中配置全局初始化参数)
--%>
${initParam.username} <br>

<%--
    cookie: 获取所有的 cookie 键值对，是个 map 集合
--%>
${cookie} <br>
${cookie.JSESSIONID} <br>
${cookie.JSESSIONID.name} <br>
${cookie.JSESSIONID.value} <br>

<%--
    pageContext: 是 el 表达式的对象，不是 jsp 内置对象，用来获取 jsp 内置对象
--%>
${pageContext.page} <br>
${pageContext.request} <br>
${pageContext.response} <br>
${pageContext.session} <br>
${pageContext.servletContext} <br>
${pageContext.servletConfig} <br>
${pageContext.exception} <br>
${pageContext.out} <br>

<%-- pageContext 应用：获取项目路径 --%>
${pageContext.request.contextPath}
```