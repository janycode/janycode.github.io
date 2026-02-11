---
title: 04-Tomcat服务调优
date: 2020-05-02 19:47:06
tags:
- Tomcat
- 调优
categories: 
- 06_服务器
- 01_Tomcat
---



参考资料(Tomcat官网)：https://tomcat.apache.org/tomcat-9.0-doc/config/index.html

### conf/server.xml

- **protocol**：**org.apache.coyote.http11.Http11NioProtocol ,使用nio线程模型**

- **maxThreads**：请求处理的最大线程数，tomcat默认值是200

- **acceptCount**：TCP层面全连接队列长度默认值是100.队列满，请求一律被丢弃

- **maxConnections**：Tomcat在任意时刻接收和处理的最大连接数。如果设置为-1，则连接数不受限制。默认值与连接器使用的协议有关：NIO的默认值是10000，APR/native的默认值是8192

- **acceptorThreadConut**：从accept队列取连接的线程数，默认值为1。不建议调整

- **connectionTimeout**：连接超时时间，默认60s

- **keepAliveTimeout**：长连接最大保持时间（毫秒），默认是使用connectionTimeout时间，-1为不限制超时

- **maxKeepAliveRequests**：表示连接最大支持的请求数，1表示禁用，-1表示不限制个数，默认100个，一般设置在100~200之间