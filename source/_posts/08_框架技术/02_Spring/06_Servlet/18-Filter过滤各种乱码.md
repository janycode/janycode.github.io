---
title: 18-Filter过滤各种乱码
date: 2017-3-22 22:26:20
tags:
- Servlet
- Filter
categories: 
- 08_框架技术
- 02_Spring
- 06_Servlet
---



1. 解决 post 请求中文乱码
3. 解决 响应 中文乱码
4. 解决 浏览器解析 中文乱码
4. 解决 get 请求中文乱码
5. 解决 MySQL 在 jdbc 中传递数据中文乱码



```java
@WebFilter("/*")
public class EncodingFilter implements Filter {

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)  throws IOException, ServletException {
		// 1.解决 post 请求中文乱码
		request.setCharacterEncoding("utf-8"); 
        
		// 2.解决 响应 中文乱码
		response.setCharacterEncoding("utf-8"); 
		
		// 3.解决 浏览器解析 中文乱码
		//response.setContentType("text/html;charset=utf-8");
        // 使用Servlet时，由于需要每次给request和response设置编码格式，从而使用了一个全局的过滤器，将每次的请求的数据变为 text/html 导致CSS文件无法解析，因此需要 修改响应编码格式为 text/css
        resp.setContentType("text/css;charset=utf-8");
        
		// 4.解决 get 请求中文乱码
		// 通过 tomcat 的 conf 目录 server.xml 中 Connector 标签加入 URIEncoding="UTF-8"
		// <Connector URIEncoding="utf-8" connectionTimeout="20000" port="8080" protocol="HTTP/1.1" redirectPort="8443"/>
		
		// 5.解决 MySQL 数据库在 JDBC 中传递数据乱码
		// url = "jdbc:mysql://localhost:3306/db_name?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf8&useSSL=false"
		
		/* 放行 */
		chain.doFilter(request, response);
	}
}
```



6. 手动解决文件名中文乱码

![image-20200701150826183](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200701150827.png)