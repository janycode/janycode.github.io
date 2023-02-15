---
title: 06-JSP 商品列表
date: 2017-5-29 22:26:20
tags:
- JSP
categories: 
- 04_网页技术
- 05_JSP
---

![商品列表信息](https://img-blog.csdnimg.cn/20200428180850711.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzM2MTg0MDc1,size_16,color_FFFFFF,t_70#pic_center)

#### 1. productList.jsp 页面
```html
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title>商品列表</title>
</head>
<body>
<table border="1px" cellspacing="0px" cellpadding="5px" width="400px" height="200px" >
    <tr>
        <td>ID</td>
        <td>名称</td>
        <td>价格</td>
        <td>数量</td>
        <td>小计</td>
    </tr>
    <c:set var="total" value="0" scope="request"></c:set>
    <c:forEach items="${products}" var="product">
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.count}</td>
            <td>${product.price * product.count}</td>
        </tr>
        <c:set var="total" value="${total + product.price * product.count}"></c:set>
    </c:forEach>
    <tr>
        <td colspan="5" align="right">
            总计：${total}元
        </td>
    </tr>
</table>
</body>
</html>
```

#### 2. servlet.ProductServlet 类
```java
@WebServlet(name = "ProductServlet", urlPatterns = "/products")
public class ProductServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ProductDao productDao = new ProductDaoImpl();
        try {
            List<Product> products = productDao.selectAll();
            System.out.println(products);
            request.getSession().setAttribute("products", products);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```

#### 3. bean.Product 类
```java
public class Product {
    private Integer id;
    private String name;
    private Integer count;
    private Double price;
    ...//无参构造、有参构造、get/set、toString
}
```

#### 4. dao.ProductDaoImpl 类
```java
// 接口：ProductDao
public class ProductDaoImpl implements ProductDao {
    private QueryRunner queryRunner = new QueryRunner(DBUtils.getDataSource());
    @Override
    public List<Product> selectAll() throws SQLException {
        return queryRunner.query("select * from goods", new BeanListHandler<>(Product.class));
    }
}
```