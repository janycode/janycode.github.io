---
title: 01-Nginx 负载均衡
date: 2018-3-28 23:06:42
tags:
- Nginx
- 负载均衡
categories: 
- 06_服务器
- 02_Nginx
---

![image-20200719221339233](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200719221340.png)



### 1. Nginx 简介

#### 1.1 Nginx是什么

Nginx : nginx [engine x]是HTTP和反向代理服务器，邮件代理服务器和通用TCP / UDP代理服务器，最初由Igor Sysoev编写。

* 特别是在高并发下，应用广泛
* 功能丰富
* 插件繁多
* 配置灵活
* 低消耗

#### 1.2 正向代理和反向代理

正向代理：是代理的用户本机的请求，比如：翻墙、网络加速器等，安装在用户的电脑上。
反向代理：是代理的服务端的请求，比如：Nginx ，安装在服务器上。

#### 1.3 Nginx作用

1. 静态服务器：图片服务器、视频服务器 可以抗万级并发
2. 动态服务器，可以代理：php\Java\数据库
3. 可以实现负载均衡
4. 缓存服务器

#### 1.4 Nginx优点

1. 占用资源，2万并发，10个线程，只需要占用几百M
2. 简单、灵活
3. 支持类型的多：http、负载均衡、邮件、tcp
4. 配置 实现IP限速、预过滤等
5. 高并发支持

#### 1.5 Nginx负载均衡算法

Nginx作为负载均衡服务器，就需要对所有的请求进行分发，那么这个分发策略，有哪些？

1. `轮询` 默认
2. `权重` 根据权重分配请求 权重大的分配的概率高
3. `IP_hash` 根据IP进行分配
4. `最少连接分配`
5. fair `最小响应时间`

### 2. Nginx应用

#### 2.1 安装Nginx

* Linux原生安装
* Docker安装Nginx

默认监听 80 端口

Docker 实现 Nginx 的安装：

1. 下载镜像 `docker pull nginx:latest`
2. 创建文件夹并准备配置
    * 创建文件夹：`mkdir -p /docker/nginx/`
    * 拷贝配置文件：`vim /docker/nginx/nginx.conf`

拷贝如下内容：——来源：windows上下载的 nginx 解压后找到 nginx.conf

```sh
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }

    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}
}
```



3. 创建默认页面
   
    创建目录：`mkdir -p /docker/nginx/html/`
    拷贝页面 index.html  50x.html 到该目录
4. 创建 Nginx 容器
    运行：`docker run -d --name nginx81 -p 81:80  -v /docker/nginx/nginx.conf:/etc/nginx/nginx.conf -v  /docker/nginx/html:/usr/share/nginx/html nginx`
5. 访问 Nginx 容器
    输入：`http://IP地址:81端口/`

#### 2.2 基于Nginx实现负载均衡

基于Nginx搭建Tomcat的集群，实现的话，需要提前准备多个Tomcat容器。

比如准备3个Tomcat容器，实现Nginx负载均衡

使用 3个 Tomcat的不同端口实例，模拟 3台实际的服务器实现负载均衡。

1. 搭建3台Tomcat

```sh
#1.创建文件夹，3个
mkdir -p /docker/tomcat/webapp8081
mkdir -p /docker/tomcat/webapp8082
mkdir -p /docker/tomcat/webapp8083
#2.依次创建3台Tomcat容器
docker run -d --name tomcat8081 -p 8081:8080 -v /docker/tomcat/webapp8081:/usr/local/tomcat/webapps/
tomcat
docker run -d --name tomcat8082 -p 8082:8080 -v /docker/tomcat/webapp8082:/usr/local/tomcat/webapps/
tomcat
docker run -d --name tomcat8083 -p 8083:8080 -v /docker/tomcat/webapp8083:/usr/local/tomcat/webapps/
tomcat
#3.发布要运行项目
依次上传3个本地war包到3台Tomcat容器中，对应的webapp8081、webapp8082、webapp8083
#4.访问发布的项目
依次访问3台Tomcat,确保都可以正常访问
```

2. 修改Nginx配置文件

```sh
#配置负载均衡
vim /docker/nginx/nginx.conf

    #CPU核心 一般都是服务器的核数  进程数量
    worker_processes  1;
    #事件  配置每个进程的连接数
    events {
        worker_connections  1024;
    }
    #1.使用管理员
    user root;
    #2.设置要负载均衡的机器
    #在http 内部配置负载均衡
    #配置负载均衡的服务器 weight权重 值越大机率越高
    upstream lxtomcat{
    server 172.18.0.6:8080 weight=4;
    server 172.18.0.7:8080 weight=2;
    server 172.18.0.9:8080 weight=3;
    } p
    #s:容器与容器的通信，需要使用容器本身的ip地址,也需要写容器本身的端口，通过 docker inspect 容器名称，查看容器的ip地址
    Tomcat8081 172.18.0.6
    Tomcat8082 172.18.0.7
    Tomcat8083 172.18.0.9
    #3.在server 标签内部：
    #配置：
    server_name lxtomcat;
    #在配置访问规则：
    location / {
    #root html;
    #index index.html index.htm;
    proxy_connect_timeout 5;
    proxy_read_timeout 10;
    proxy_send_timeout 20;
    proxy_pass http://lxtomcat ;
    } 

#保存上传配置文件
#重启Nginx容器
docker restart nginx
#访问测试
访问 http://IP地址:81端口/tomcat可访问页
```

