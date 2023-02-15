---
title: 19-BeanUtils数据封装
date: 2018-4-28 23:07:15
tags:
- Servlet
- JSP
categories: 
- 04_网页技术
- 04_Servlet
---

### 1. jsp+javaBean

jsp：请求处理、业务处理、数据库操作、数据显示
javaBean：数据封装



优点：开发简单
缺点：维护难，代码几乎都在 jsp 中



### 2. jsp+javaBean+Servlet(MVC)

jsp: 数据显示
Servlet: 请求处理、业务处理、数据库操作
javaBean: 数据封装

> 该方式属于 MVC 设计模式的一种。
>
> 即 M 模型层、V 视图层、C 控制层

优点：维护方便，开发各司其职利于模块分工，适合开发复杂项目，组件可以重用
缺点：开发难度大，对开发要求高



`BeanUtils 框架`

① 需要下载导入3个依赖 jar 包

jar 包下载地址：http://commons.apache.org/proper/commons-beanutils/download_beanutils.cgi

`commons-beanutils-1.9.4.jar`
`commons-collections-3.2.2.jar`
`commons-logging-1.2.jar`

② 要求：页面上的参数 name 名需要与Bean实体类的属性名完全一致。



#### 2.1 示例: 登陆实现

regist.jsp

```jsp
<form action="/demo/reg" method="post">
    账号：<input type="text" name="username"> <br>
    密码：<input type="text" name="password"> <br>
    年龄：<input type="text" name="age"> <br>
    <button type="submit">注册</button>
</form>
```

RegServlet.doPost()

```java
protected void doPost(... request, ... response)  {
    Map<String, String[]> map = request.getParameterMap();
    User user = new User();
    try {
        BeanUtils.populate(user, map);
        // 获取到封装了设置好jsp提交的参数的实例对象
        System.out.println(user);
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

User

```java
public class User {
    private Integer id;
    private String username;
    private String password;
    private Integer age;
    ...
}
```

### 3. 自定义 MyBeanUtils.populate()

精简版的 BeanUtils 源码实现逻辑。

```java
// 自定义 BeanUtils
public class MyBeanUtils {
    /**
     * 将map集合中的请求参数值封装到对象t中
     */
    public static <T> void populate(T t, Map<String, ? extends Object> map) {
        Class<?> clazz = t.getClass();
        Field[] fields = clazz.getDeclaredFields();
        for (Field field : fields) {
            String fieldName = field.getName();
            String methodName = "set" + fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1);
            // 获取对应的set方法
            try {
                Class<?> type = field.getType();
                Method method = clazz.getMethod(methodName, type);
                if (null != method) {
                    // invoke 第2个参数：请求参数的值，需要从map中获得
                    Object object = map.get(fieldName);
                    if (null != object) {
                        String[] strs = (String[]) object;
                        if (type.getName().equals("java.lang.Integer")) {
                            method.invoke(t, Integer.parseInt(strs[0]));
                        } else {
                            method.invoke(t, strs[0]);
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
```

