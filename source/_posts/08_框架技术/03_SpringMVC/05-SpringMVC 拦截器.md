---
title: 05-SpringMVC 拦截器
date: 2018-6-20 21:59:44
tags:
- SpringMVC
- 拦截器
- Interceptor
categories: 
- 08_框架技术
- 03_SpringMVC
---




![image-20200620175456961](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200620175458.png)

参考资料：https://spring-mvc.linesh.tw/



### 1. 拦截器作用

SpringMVC 框架中的拦截器用于对处理器进行`预处理`和`后处理`的技术。

可以定义拦截器链，连接器链就是将拦截器按着顺序结成一条链，在访问被拦截的方法时，拦截器链中的拦截器会按着定义的顺序执行。

拦截器和过滤器的功能比较类似，有以下区别：

* 过滤器是 Servlet 规范的一部分，任何框架都可以使用过滤器技术；
    拦截器是 `SpringMVC 框架独有的`。

* 过滤器配置了 /*，可以拦截任何资源；
    拦截器`只会对控制器中的方法进行拦截`。

拦截器也是 AOP 思想的一种实现方式。

### 2. 单个拦截器

自定义拦截器，需要实现 **`HandlerInterceptor`** 接口。

1. 创建自定义拦截器


```java
public class MyInterceptor implements HandlerInterceptor {
    /**
     * 预处理，controller 方法执行前
     * 应用：用于身份认证、身份授权
     * return true 放行，执行下一个拦截器，如果没有，执行 controller 中的方法
     * return false 不放行，即不向下执行
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("preHandle");
        return true; // true 放行（切记！）； false 拦截（不会往下执行）
    }

    /**
    * 后处理方法，controller 方法执行后，方法跳转 success.jsp 执行之前
    * 应用：从modelAndView出发：将公用的模型数据(比如菜单导航)在这里传到视图，也可以在这里统一指定视图
    */
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println("postHandle");
    }

    /**
    * success.jsp 页面执行后，该方法会执行
    * 应用：统一异常处理，统一日志处理
    */
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        System.out.println("afterCompletion");
    }
}
```

2. 在 springmvc.xml 中配置拦截器

```xml
   <!--配置拦截器-->
    <mvc:interceptors>
        <!--配置拦截器，多个拦截器时，顺序执行-->
        <mvc:interceptor>
            <!--要拦截的具体的方法-->
            <mvc:mapping path="/user/*"/>
            <!--不去拦截的方法
            <mvc:exclude-mapping path=""/>
            -->
            <!--配置拦截器对象-->
            <bean class="com.demo.interceptor.MyInterceptor" />
        </mvc:interceptor>
    </mvc:interceptors>
```

3. 测试

```java
@RequestMapping("/testInterceptor")
public String testInterceptor(){
    System.out.println("testInterceptor执行了...");
    return "success";
}
```



### 3. 多个拦截器

> 注意：
>
> * 多个拦截器时，按照 springmvc.xml 配置的顺序执行。
> * (2个拦截器时) 拦截器1 preHandle 不放行，postHandle 和 afterCompletion 不会执行。
> * (2个拦截器时) 拦截器1 preHandle 不放行，拦截器2不执行。

![image-20200622192223998](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200622192226.png)

2个拦截器的执行流程：

HandlerInterceptor1...preHandle
HandlerInterceptor2...preHandle

HandlerInterceptor2...postHandle
HandlerInterceptor1...postHandle

HandlerInterceptor2...afterCompletion
HandlerInterceptor1...afterCompletion