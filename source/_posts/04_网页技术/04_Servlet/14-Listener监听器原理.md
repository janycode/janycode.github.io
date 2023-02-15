---
title: 14-Listener监听器原理
date: 2017-5-22 22:26:20
tags:
- Servlet
- Listener
- 原理
categories: 
- 04_网页技术
- 04_Servlet
---

### 1.1 Listener 基本信息

概念：监听器就是一个实现了特定接口的Java类。
分类：
* 一类监听器：监听域对象的创建、销毁
* 二类监听器：监听域对象中的属性变更（属性设置、属性替换、属性移除）
* 三类监听器：监听域对象中的java对象的绑定



Servlet监听器：
`事件源`：request、session、servletContext三大域对象
`监听器`：Servlet对象（三种监听器）
`绑定`：web.xml配置 或 @WebListener注解
`事件`：域对象发生改变

### 1.2 Listener 工作原理
1. 实现了特定接口的类为监听器，用来监听另一个Java类的方法调用或者属性改变；
2. 当被监听的对象发生了方法调用或者属性改变后，监听器的对应方法就会立即执行。



### 1.3 Listener 基本使用
一类接口：
`ServletContextListener` 监听ServletContext域对象的创建、销毁
```java
// 服务器启动，ServletContext域对象创建，该监听器方法则执行
public void contextInitialized(ServletContextEvent servletContextEvent)
// 服务器关闭，ServletContext域对象销毁，该监听器方法则执行
public void contextDestroyed(ServletContextEvent servletContextEvent)
```
`HttpSessionListener` 监听HttpSession域对象的创建、销毁
```java
// 服务器第一次调用getSession方法时，该监听器方法被执行
public void sessionCreated(HttpSessionEvent httpSessionEvent)
// session过期/调用了invalidate方法销毁session时，该监听器方法被执行
public void sessionDestroyed(HttpSessionEvent httpSessionEvent)
```
`ServletRequestListener` 监听ServletRequest域对象的创建、销毁
```java
// 客户端向服务器发送了一个请求，服务器就会为该请求创建一个request对象，该监听器方法就被执行
public void requestInitialized(ServletRequestEvent servletRequestEvent)
// 当服务器为这次请求做出了响应后，将request对象销毁，该监听器方法就被执行
public void requestDestroyed(ServletRequestEvent servletRequestEvent)
```
二类接口：
`ServletContextAttributeListener`
`HttpSessionAttributeListener`
`ServletRequestAttributeListener`
```java
// 监听ServletContext域对象中属性的【添加】
void attributeAdded(ServletContextAttributeEvent var1);
// 监听ServletContext域对象中属性的【替换】
void attributeReplaced(ServletContextAttributeEvent var1);
// 监听ServletContext域对象中属性的【移除】
void attributeRemoved(ServletContextAttributeEvent var1);
```
三类接口：
`HttpSessionBindingListener`
监听session域对象中的java对象的状态（绑定和解绑）
绑定：将java对象存储到session域对象
解绑：将java对象从session域对象移除
* 该监听器不需要在web.xml中配置



```java
/**
 * 事件源：Java对象
 * 监听器：HttpSessionBindingListener
 * 绑定：java对象实现监听器接口
 * 事件：java对象在Session中的状态发生改变
 */
public class User implements HttpSessionBindingListener {
    private int id;
    private String username;
    private String password;

    /*构造、get/set、toString*/

    @Override
    public void valueBound(HttpSessionBindingEvent httpSessionBindingEvent) {
        System.out.println("HttpSession 与 User 绑定");
    }

    @Override
    public void valueUnbound(HttpSessionBindingEvent httpSessionBindingEvent) {
        System.out.println("HttpSession 与 User 解绑");
    }
}
```

### 1.4 Listener 开发步骤
① 定义类实现监听器接口
② 重写方法
③ 配置 web.xml

```java
<listener>
    <listener-class>Listener的全限定名</listener-class>
</listener>
```

### 1.5 Listener 使用示例
```java
/**
 * 事件源：ServletContext
 * 监听器：TestServletContextListener
 * 绑定：web.xml配置
 * 事件：ServletContext对象的创建、销毁
 */
public class TestServletContextListener implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {
        // 监听初始化
        System.out.println("ServletContext 初始化");
    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {
        // 监听销毁
        System.out.println("ServletContext 销毁");
    }
}
```
