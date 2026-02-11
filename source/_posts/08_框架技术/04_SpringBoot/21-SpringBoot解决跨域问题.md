---
title: 21-SpringBoot解决跨域问题
date: 2024-05-28 19:08:22
index_img: https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241024154522.png
tags:
- SpringBoot
- 跨域
categories:
- 08_框架技术
- 04_SpringBoot
---

![image-20200708160944615](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708160946.png)



 SpringBoot 项目处理跨域的四种技巧 :

![图片](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250106140951)

# 1 什么是跨域

我们先看下一个典型的网站的地址：

![图片](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250106141022)

**同源**是指：**协议、域名、端口号完全相同**。

下表给出了与 URL http://www.xxx.com/dir/page.html 的源进行对比的示例 :

![图片](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250106141049)

当用户通过浏览器访问应用（http://admin.xxx.com）时，调用接口的域名非同源域名(http://api.xxx.com)，这是显而易见的跨域场景。

# 2 理解 CORS

**CORS** 是一个 `W3C` 标准，全称是"跨域资源共享"（Cross-origin  resource  sharing）, 它需要浏览器和服务器同时支持他，允许浏览器向跨源服务器发送`XMLHttpRequest`请求，从而克服 AJAX 只能**同源**使用的限制。

**跨域资源共享**标准新增了一组 HTTP 首部字段，允许服务器声明哪些源站通过浏览器有权限访问哪些资源。

规范要求，对那些可能对服务器数据产生副作用的 HTTP 请求方法（特别是 GET 以外的 HTTP 请求，或者搭配某些 MIME 类型的 POST 请求），浏览器必须首先使用 OPTIONS 方法发起一个预检请求（preflight request），从而获知服务端是否允许该跨域请求。

服务器确认允许之后，才发起实际的 HTTP 请求。在预检请求的返回中，服务器端也可以通知客户端，是否需要携带身份凭证（包括 Cookies 和 HTTP 认证相关数据）。

![图片](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250106141458)

## 01 简单请求

简单请求模式，浏览器直接发送跨域请求，并在请求头中携带 Origin 的头，表明这是一个跨域的请求。 服务器端接到请求后，会根据自己的跨域规则，通过 Access-Control-Allow-Origin 和 Access-Control-Allow-Methods 响应头，来返回验证结果。

![图片](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250106141605)

## 02 预检请求

浏览器在发现页面发出的请求非简单请求，并不会立即执行对应的请求代码，而是会触发预先请求模式。预先请求模式会先发送preflight request（预先验证请求），preflight request是一个 OPTION 请求，用于询问要被跨域访问的服务器，是否允许当前域名下的页面发送跨域的请求。在得到服务器的跨域授权后才能发送真正的 HTTP 请求。

![图片](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250106141633)

# 3 Nginx 配置

![图片](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250106141650)

我们不用配置 SpringBoot 项目，在反向代理层 Nginx 直接配置 CORS ，典型配置如下图：

![图片](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250106141721)

# 4 配置类实现 addCorsMapping 接口

SpringBoot 中新增一个配置类 CorsConfig.java，继承 WebMvcConfigurerAdapter 或者实现WebMvcConfigurer 接口，项目启动后，会自动读取配置。

![图片](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250106141734)

# 5 CorsFilter 过滤器模式

下图是 SpringMvc 模式里，过滤器，拦截器，控制器的执行顺序。

![图片](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250106141804)

CorsFilter 过滤器模式的优点是：优先级高，可以规避代码中业务拦截器异常导致 adCorsMappings 方法失效的问题。

我们需要定义一个 corsFilter 方法，`@Bean` 注解表示此方法返回一个Spring Bean，该 Bean 将由Spring 容器管理。

`corsFilter()` 方法定义了一个 `FilterRegistrationBean`，这个 bean 是用来注册 `CorsFilter` 的，后者用于处理 CORS 请求。

![图片](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250106141839)

# 6 网关模式

在微服务架构体系中，网关是非常核心的组件。 API 网关可以做鉴权，限流，灰度等，同时可以配置 CORS 。内部服务端不用特别关注跨域这个问题。

![图片](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250106141856)



因此假如是 SpringCloud 体系，我们只需要配置 SpringCloud gateway 的跨域即可。