---
title: 04-SpringMVC 全局异常处理
date: 2018-6-20 20:59:44
tags:
- SpringMVC
- 异常
categories: 
- 08_框架技术
- 03_SpringMVC
---





![image-20200620175456961](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200620175458.png)

参考资料：https://spring-mvc.linesh.tw/

### 1. 创建自定义全局异常处理

Controller 调用 service，service 调用 dao，异常都是向上抛出的，最终有 DispatcherServlet 找异常处理器进行异常的处理。

![异常处理](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200623082830.jpg)

1. 创建自定义异常类

```java
public class MyException extends Exception {
    public MyException(String message) {
        super(message);
    }
}
```

2. 创建异常处理器类

```java
public class MyExceptionResolver implements HandlerExceptionResolver {
    @Override
    public ModelAndView resolveException(HttpServletRequest request,
           HttpServletResponse response, Object object, Exception exception) {

        ModelAndView mv = new ModelAndView();
        // 判断异常类型
        if (exception instanceof MyException) {
            // 如果是自定义异常，读取异常信息
            mv.addObject("msg", "自定义异常：" + exception.getMessage());
        } else {
            // 如果是运行时异常，则取错误堆栈，从堆栈中获取异常信息
            mv.addObject("msg", "未知异常");
        }
        // 返回错误页面，给用户友好页面显示错误信息（手动准备一个 error.jsp ${msg}）
        mv.setViewName("/error.jsp");

        return mv;
    }
}
```

3. 在 springmvc.xml 中配置异常处理器

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/mvc
        http://www.springframework.org/schema/mvc/spring-mvc.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">

    <!--开启注解扫描-->
    <context:component-scan base-package="com.demo"/>

    <!--视图解析对象-->
    <bean id="internalResourceViewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/jsp"/>
    </bean>

    <!--开启SpringMVC框架注解支持-->
    <mvc:annotation-driven />

    <!--配置异常处理器-->
    <bean id="myExceptionResolver" class="com.demo.ex.MyExceptionResolver"/>
</beans>
```

4. 在 web.xml 中配置 前端控制器

```xml
<!DOCTYPE web-app PUBLIC
        "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
        "http://java.sun.com/dtd/web-app_2_3.dtd" >

<web-app>
  <display-name>Archetype Created Web Application</display-name>

  <!--配置中文乱码过滤器-->
  <filter>
    <filter-name>characterEncodingFilter</filter-name>
    <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
    <init-param>
      <param-name>encoding</param-name>
      <param-value>UTF-8</param-value>
    </init-param>
  </filter>
  <filter-mapping>
    <filter-name>characterEncodingFilter</filter-name>
    <url-pattern>/*</url-pattern>
  </filter-mapping>

  <!--配置前端控制器-->
  <servlet>
    <servlet-name>dispatcherServlet</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <init-param>
      <param-name>contextConfigLocation</param-name>
      <param-value>classpath:springmvc.xml</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
  </servlet>
  <servlet-mapping>
    <servlet-name>dispatcherServlet</servlet-name>
    <url-pattern>/</url-pattern>
  </servlet-mapping>

</web-app>

```

5. 创建一个 error.jsp 页面，注意 `isELIgnored=false`

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" isELIgnored="false" %>
<html>
<head>
    <title>exception</title>
</head>
<body>
<h2>exception</h2>
${msg}
</body>
</html>

```

6. 测试方法

```java
@Controller
@RequestMapping("/ex")
public class ExController {
    
    //测试异常方法
    @RequestMapping(value="/testException")
    public void testException() throws MyException{

        //System.out.println(1/0);
        throw new MyException("自定义异常");
    }
}
```

本地访问测试：http://localhost:8080/mvc/ex/testEx