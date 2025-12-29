---
title: 02-Nginx 负载均衡
date: 2018-3-28 23:06:42
tags:
- Nginx
- 负载均衡
categories: 
- 06_服务器
- 02_Nginx
---

![image-20200719221339233](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200719221340.png)



## 1. Nginx 简介

### 1.1 Nginx是什么

Nginx : nginx [engine x]是HTTP和反向代理服务器，邮件代理服务器和通用TCP / UDP代理服务器，最初由Igor Sysoev编写。

* 特别是在高并发下，应用广泛
* 功能丰富
* 插件繁多
* 配置灵活
* 低消耗

### 1.2 正向代理和反向代理

正向代理：是代理的用户本机的请求，比如：翻墙、网络加速器等，安装在用户的电脑上。
反向代理：是代理的服务端的请求，比如：Nginx ，安装在服务器上。

### 1.3 Nginx作用

1. 静态服务器：图片服务器、视频服务器 可以抗万级并发
2. 动态服务器，可以代理：php\Java\数据库
3. 可以实现负载均衡
4. 缓存服务器

### 1.4 Nginx优点

1. 占用资源，2万并发，10个线程，只需要占用几百M
2. 简单、灵活
3. 支持类型的多：http、负载均衡、邮件、tcp
4. 配置 实现IP限速、预过滤等
5. 高并发支持

### 1.5 Nginx负载均衡算法

Nginx作为负载均衡服务器，就需要对所有的请求进行分发，那么这个分发策略，有哪些？

1. `轮询` 默认
2. `权重` 根据权重分配请求 权重大的分配的概率高
3. `IP_hash` 根据IP进行分配
4. `最少连接分配`
5. fair `最小响应时间`

## 2. Nginx应用

### 2.1 安装Nginx

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

### 2.2 基于Nginx实现负载均衡

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
    upstream lxtomcat {
        server 172.18.0.6:8080 weight=4;
        server 172.18.0.7:8080 weight=2;
        server 172.18.0.9:8080 weight=3;
    }
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
        proxy_pass http://lxtomcat;
    } 

#保存上传配置文件
#重启Nginx容器
docker restart nginx
#访问测试
访问 http://IP地址:81端口/tomcat可访问页
```



## 3. Nginx 负载均衡基础配置


首先，搭建一个基础的 Nginx 负载均衡器，用于将流量分发到多个后端服务器上。

### 步骤 1：安装 Nginx


在每台要作为负载均衡器的服务器上，安装 Nginx。可以使用包管理工具进行安装，例如在 Ubuntu 上执行以下命令：

```bash
sudo apt update
sudo apt install nginx
```

### 步骤 2：配置 Nginx 负载均衡


Nginx 的核心是配置文件 nginx.conf，我们可以在其中定义后端服务器池以及负载均衡策略。以下是一个简单的 Nginx 负载均衡配置：

```bash
#定义一个名为 backend 的后端服务器池
upstream backend {
    server backend1.example.com weight=5;  # 设置权重
    server backend2.example.com weight=3;
    server backend3.example.com weight=2;
    
    # 启用健康检查（需要 Nginx Plus 支持开箱配置，开源版本需要第三方模块）
    # Nginx Plus 示例：
    health_check interval=10s fails=3 passes=2;
}

#配置 HTTP 服务器
server {
    listen 80;
    server_name loadbalancer.example.com;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

配置详解：

* upstream 指令：定义了后端服务器池（`backend`），并为各服务器分配了不同的权重，Nginx 根据权重将流量按照比例分发到后端服务器。

* 健康检查：此配置会定期检查后端服务器是否可用，确保当某个服务器宕机时，不会继续向其发送请求。

* proxy_pass：将客户端请求代理到后端服务器池。



### 步骤 3：启动和测试 Nginx


确保配置无误后，启动或重启 Nginx 服务：

```bash
sudo nginx -t  # 测试配置文件是否正确
sudo systemctl restart nginx  # 重启 Nginx
```


测试：通过访问 http://loadbalancer.example.com，验证请求是否被均匀分发到后端服务器。



## 4. 高可用性配置（Keepalived + Nginx）


单独使用 Nginx 进行负载均衡仍然会面临单点故障问题。如果前端的 Nginx 宕机，整个服务将不可用。因此，我们需要通过 Keepalived 实现高可用的 Nginx 集群。

### 步骤 1：安装 Keepalived


在每台 Nginx 服务器上安装 Keepalived。以 Ubuntu 为例：

```bash
sudo apt install keepalived
```

### 步骤 2：配置 Keepalived


Keepalived 通过虚拟 IP 地址（VIP）实现故障转移。当主服务器宕机时，VIP 自动切换到备用服务器，确保服务的高可用性。

在主 Nginx 服务器上，编辑 Keepalived 的配置文件 /etc/keepalived/keepalived.conf：

```bash
vrrp_instance VI_1 {
    state MASTER  # 主服务器
    interface eth0  # 网络接口
    virtual_router_id 51
    priority 100  # 主服务器优先级较高
    advert_int 1  # 广播间隔
    authentication {
        auth_type PASS
        auth_pass 123456  # 密码
    }
    virtual_ipaddress {
        192.168.0.100  # 虚拟IP地址
    }
    track_script {
        chk_nginx  # 监控 Nginx 状态的脚本
    }
}
```


在备用 Nginx 服务器上，将 state 设置为 BACKUP，并将 priority 设置为较低的值，例如 90。

### 步骤 3：监控 Nginx 状态


Keepalived 可以通过监控 Nginx 的运行状态来决定是否切换 VIP。创建一个监控脚本 /etc/keepalived/check_nginx.sh：

```bash
#!/bin/bash
if ! pidof nginx > /dev/null
then
    systemctl stop keepalived  # 如果 Nginx 停止，关闭 Keepalived 以触发 VIP 切换
fi
```


将此脚本添加为可执行：

```bash
sudo chmod +x /etc/keepalived/check_nginx.sh
```


在 Keepalived 的配置文件中添加监控脚本：

```bash
vrrp_script chk_nginx {
    script "/etc/keepalived/check_nginx.sh"
    interval 2
}
```

### 步骤 4：启动 Keepalived


完成配置后，启动或重启 Keepalived 服务：

```bash
sudo systemctl restart keepalived
```


测试：关闭主服务器的 Nginx，VIP 应该自动切换到备用服务器，确保服务不中断。



## 5. Nginx 健康检查和动态扩展


Nginx 可以结合健康检查功能，确保只有状态正常的服务器参与负载均衡。另外，动态扩展是应对突发流量的关键。以下是相关配置和实战方案。

### 步骤 3.1：配置健康检查（开源版本）


Nginx 开源版本不自带健康检查模块，可以通过第三方模块（如 ngx_http_healthcheck_module）实现健康检查。假设已安装此模块，配置如下：

    upstream backend {
        server backend1.example.com;
        server backend2.example.com;
        server backend3.example.com;
    	# 使用第三方模块实现健康检查
    	check interval=5000 rise=2 fall=5 timeout=2000;
    }
### 步骤 3.2：动态扩展后端服务器


结合容器化技术（如 Docker 或 Kubernetes），可以根据流量自动扩展后端服务器。例如，在 Kubernetes 集群中可以使用 Horizontal Pod Autoscaler (HPA) 自动扩展应用服务的副本数。

以下是在 Kubernetes 中配置自动扩展的示例：

```bash
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70  # 当 CPU 利用率超过 70% 时扩容
```


通过这种方式，后端服务可以根据负载动态扩展，Nginx 通过配置服务发现机制可以自动识别新的后端服务器。



## 6. Nginx SSL/TLS 配置


在生产环境中，启用 HTTPS 是必不可少的。以下是启用 SSL/TLS 的配置：

### 步骤 4.1：生成或获取 SSL 证书


使用 Let's Encrypt 生成免费的 SSL 证书：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### 步骤 4.2：配置 Nginx 使用 SSL

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# 自动将 HTTP 请求重定向到 HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}
```