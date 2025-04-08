---
title: 01-Nginx 配置详解
date: 2018-3-28 18:09:54
tags:
- Nginx
- 负载均衡
categories: 
- 06_服务器
- 02_Nginx
---

![image-20200719221339233](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200719221340.png)



参考资料：

* 官网：http://www.nginx.org/
* 源码：https://trac.nginx.org/nginx/browser
* 在线配置：https://nginxconfig.io/
* 在线格式化：https://nginxbeautifier.github.io/  （设置使用4个空格：Use Space 4 和 Don't join curly bracket）

> Nginx (engine x) 是一个轻量级高性能的HTTP和反向代理服务器，同时也是一个通用 代理服务器 （TCP/UDP/IMAP/POP3/SMTP），最初由俄罗斯人Igor Sysoev编写。

## 下载

官网下载地址：https://nginx.org/en/download.html

![image-20240730090645157](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240730090646.png)

如下载 1.18.0

```bash
#创建nginx（可选）
mkdir nginx

#下载nginx
wget https://nginx.org/download/nginx-1.18.0.tar.gz

#解压到指定位置
tar -xvf nginx-1.10.0.tar.gz -C /usr/local/
mv nginx-1.10.0 nginx
cd nginx

#安装依赖
yum -y install gcc-c++
yum -y install pcre pcre-devel
yum -y install zlib zlib-devel
yum -y install openssl openssl-devel

#全部采用默认安装
./configure
make && make install

#查看nginx安装位置 和 版本
whereis nginx
nginx -v
```



## 基本命令

```bash
nginx -t                  检查配置文件是否有语法错误
nginx -c /xxx/nginx.conf  指定配置文件启动
nginx -s reload           热加载，重新加载配置文件
nginx -s stop             快速关闭
nginx -s quit             等待工作进程处理完成后关闭
```

不关心配置文件位置关联配置文件启动`通过nginx -t找出配置文件然后指定`：

```bash
nginx -s stop && sleep 3 && nginx -c `nginx -t 2>&1 | tail -n 1 | awk -F 'file ' '{print $2}' | cut -d ' ' -f1` && sleep 2 && ps -ef | grep nginx | grep -v grep
```



## 默认配置

> Nginx 安装目录下, 复制一份`nginx.conf`成`nginx.conf.default`作为配置文件备份，然后修改`nginx.conf`

```cmake
# 工作进程的数量
worker_processes  1;
events {
    worker_connections  1024; # 每个工作进程连接数
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    # 日志格式
    log_format  access  '$remote_addr - $remote_user [$time_local] $host "$request" '
                  '$status $body_bytes_sent "$http_referer" '
                  '"$http_user_agent" "$http_x_forwarded_for" "$clientip"';
    access_log  /srv/log/nginx/access.log  access; # 日志输出目录
    gzip  on;
    sendfile  on;

    # 链接超时时间，自动断开
    keepalive_timeout  60;

    # 虚拟主机
    server {
        listen       8080;
        server_name  localhost; # 浏览器访问域名

        charset utf-8;
        access_log  logs/localhost.access.log  access;

        # 路由
        location / {
            root   www; # 访问根目录
            index  index.html index.htm; # 入口文件
        }
    }

    # 引入其他的配置文件
    include servers/*;
}
```

## 搭建站点

> 在其他配置文件`servers`目录下，添加新建站点配置文件 xx.conf。

> 电脑 hosts 文件添加 127.0.0.1  xx_domian

```perl
# 虚拟主机
server {
    listen       8080;
    server_name  xx_domian; # 浏览器访问域名

    charset utf-8;
    access_log  logs/xx_domian.access.log  access;

    # 路由
    location / {
        root   www; # 访问根目录
        index  index.html index.htm; # 入口文件
    }
}
```

执行命令 nginx -s reload，成功后浏览器访问 xx_domian 就能看到你的页面

## 根据文件类型设置过期时间

```powershell
location ~.*\.css$ {
    expires 1d;
    break;
}
location ~.*\.js$ {
    expires 1d;
    break;
}

location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$ {
    access_log off;
    expires 15d;    #保存15天
    break;
}

# curl -x127.0.0.1:80 http://www.test.com/static/image/common/logo.png -I #测试图片的max-age
```

## 禁止文件缓存

开发环境经常改动代码，由于浏览器缓存需要强制刷新才能看到效果。这是我们可以禁止浏览器缓存提高效率

```ruby
location ~* \.(js|css|png|jpg|gif)$ {
    add_header Cache-Control no-store;
}
```

## 防盗链

可以防止文件被其他网站调用

```ruby
location ~* \.(gif|jpg|png)$ {
    # 只允许 192.168.0.1 请求资源
    valid_referers none blocked 192.168.0.1;
    if ($invalid_referer) {
       rewrite ^/ http://$host/logo.png;
    }
}
```

## 静态文件压缩

```bash
server {
    # 开启gzip 压缩
    gzip on;
    # 设置gzip所需的http协议最低版本 （HTTP/1.1, HTTP/1.0）
    gzip_http_version 1.1;
    # 设置压缩级别，压缩级别越高压缩时间越长  （1-9）
    gzip_comp_level 4;
    # 设置压缩的最小字节数， 页面Content-Length获取
    gzip_min_length 1000;
    # 设置压缩文件的类型  （text/html)
    gzip_types text/plain application/javascript text/css;
}
```

执行命令 nginx -s reload，成功后浏览器访问

## 指定定错误页面

```yaml
# 根据状态码，返回对于的错误页面
error_page 500 502 503 504 /50x.html;
location = /50x.html {
    root /source/error_page;
}
```

执行命令 nginx -s reload，成功后浏览器访问



## 301或302重定向

参考博客：https://blog.csdn.net/zxh7770/article/details/103303312

核心配置：

```nginx
    server {
        listen               443 ssl;
        server_name          xxx.com;
        ssl_certificate      /usr/local/nginx/conf/cert/xxx.com.pem;
        ssl_certificate_key  /usr/local/nginx/conf/cert/xxx.com.key;

        location / {
            #permanent对应就是301重定向跳转
            rewrite ^/(.*) https://www.xxx.com/$1 permanent;
            try_files $uri $uri/ /index.html;
            index  index.html index.htm;
        }   
    }  
```

重启nginx，然后阿里云域名服务器配置一级域名 xxx.com 解析到 nginx 所在服务器 ip 。

示例：以 jiechujiaoyu.com 为例的6个访问域名均可以直接点击正常访问（域名解析里也辅助配置301跳转）

[jiechujiaoyu.com](jiechujiaoyu.com)
[www.jiechujiaoyu.com](www.jiechujiaoyu.com)
[http://jiechujiaoyu.com](http://jiechujiaoyu.com)
[http://www.jiechujiaoyu.com](http://www.jiechujiaoyu.com)
[https://jiechujiaoyu.com](https://jiechujiaoyu.com)
[https://www.jiechujiaoyu.com](https://www.jiechujiaoyu.com)

阿里云域名解析配置：

![image-20250327103058414](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250327103059.png)

nginx配置如下：

```nginx
    server {
        listen               80;
        server_name          jiechujiaoyu.com www.jiechujiaoyu.com;
        ssl_certificate      /usr/local/nginx/conf/cert/jiechujiaoyu.com.pem;
        ssl_certificate_key  /usr/local/nginx/conf/cert/jiechujiaoyu.com.key;

		location / {
			rewrite ^/(.*) https://www.jiechujiaoyu.com/$1 permanent;
		}
    }

    server {
        listen               443 ssl;
        server_name          jiechujiaoyu.com www.jiechujiaoyu.com;
        ssl_certificate      /usr/local/nginx/conf/cert/jiechujiaoyu.com.pem;
        ssl_certificate_key  /usr/local/nginx/conf/cert/jiechujiaoyu.com.key;

        #开启解压缩静态文件
        gzip_static on; 
        #强制一级域名跳转到www子域名
        if ($host = jiechujiaoyu.com)  {
            return 301 https://www.jiechujiaoyu.com$request_uri;
        }

        location / { 
           root /opt/wangxiao-pc-prod/9091/front/pc;
           try_files $uri $uri/ /index.html;
           index  index.html index.htm;
        }   
             
        location /webpc/ {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_hide_header X-Powered-By;
            proxy_hide_header Server;
            proxy_read_timeout 7200;
            proxy_pass https://127.0.0.1:9091/webpc/; 
        }   

        location = /50x.html {
           root html;
        }   
    }
```



## 跨域问题

> #### 跨域的定义
>
> 同源策略限制了从同一个源加载的文档或脚本如何与来自另一个源的资源进行交互。这是一个用于隔离潜在恶意文件的重要安全机制。通常不允许不同源间的读操作。
>
> #### 同源的定义
>
> 如果两个页面的协议，端口（如果有指定）和域名都相同，则两个页面具有相同的源。

#### nginx解决跨域的原理

例如：

- 前端server域名为：`http://xx_domain`
- 后端server域名为：`https://github.com`

现在`http://xx_domain`对`https://github.com`发起请求一定会出现跨域。

不过只需要启动一个nginx服务器，将`server_name`设置为`xx_domain`,然后设置相应的location以拦截前端需要跨域的请求，最后将请求代理回`github.com`。如下面的配置：

```perl
## 配置反向代理的参数
server {
    listen    8080;
    server_name xx_domain

    ## 1. 用户访问 http://xx_domain，则反向代理到 https://github.com
    location / {
        proxy_pass  https://github.com;
        proxy_redirect     off;
        proxy_set_header   Host             $host;        # 传递域名
        proxy_set_header   X-Real-IP        $remote_addr; # 传递ip
        proxy_set_header   X-Scheme         $scheme;      # 传递协议
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    }
}
```

这样可以完美绕过浏览器的同源策略：`github.com`访问`nginx`的`github.com`属于同源访问，而`nginx`对服务端转发的请求不会触发浏览器的同源策略。

## Nginx配置参数中文详细说明

```bash
#定义Nginx运行的用户和用户组
user www www;
#
#nginx进程数,建议设置为等于CPU总核心数.
worker_processes 8;
#
#全局错误日志定义类型,[ debug | info | notice | warn | error | crit ]
error_log /var/log/nginx/error.log info;
#
#进程文件
pid /var/run/nginx.pid;
#
#一个nginx进程打开的最多文件描述符数目,理论值应该是最多打开文件数（系统的值ulimit -n）与nginx进程数相除,但是nginx分配请求并不均匀,所以建议与ulimit -n的值保持一致.
worker_rlimit_nofile 65535;
#
#工作模式与连接数上限
events
{
    #参考事件模型,use [ kqueue | rtsig | epoll | /dev/poll | select | poll ]; epoll模型是Linux 2.6以上版本内核中的高性能网络I/O模型,如果跑在FreeBSD上面,就用kqueue模型.
    use epoll;
    #单个进程最大连接数（最大连接数=连接数*进程数）
    worker_connections 65535;
}
#
#设定http服务器
http
{
    include mime.types; #文件扩展名与文件类型映射表
    default_type application/octet-stream; #默认文件类型
    #charset utf-8; #默认编码
    server_names_hash_bucket_size 128; #服务器名字的hash表大小
    client_header_buffer_size 32k; #上传文件大小限制
    large_client_header_buffers 4 64k; #设定请求缓
    client_max_body_size 8m; #设定请求缓

    # 开启目录列表访问,合适下载服务器,默认关闭.
    autoindex on; # 显示目录
    autoindex_exact_size on; # 显示文件大小 默认为on,显示出文件的确切大小,单位是bytes 改为off后,显示出文件的大概大小,单位是kB或者MB或者GB
    autoindex_localtime on; # 显示文件时间 默认为off,显示的文件时间为GMT时间 改为on后,显示的文件时间为文件的服务器时间

    sendfile on; # 开启高效文件传输模式,sendfile指令指定nginx是否调用sendfile函数来输出文件,对于普通应用设为 on,如果用来进行下载等应用磁盘IO重负载应用,可设置为off,以平衡磁盘与网络I/O处理速度,降低系统的负载.注意：如果图片显示不正常把这个改成off.
    tcp_nopush on; # 防止网络阻塞
    tcp_nodelay on; # 防止网络阻塞

    keepalive_timeout 120; # (单位s)设置客户端连接保持活动的超时时间,在超过这个时间后服务器会关闭该链接

    # FastCGI相关参数是为了改善网站的性能：减少资源占用,提高访问速度.下面参数看字面意思都能理解.
    fastcgi_connect_timeout 300;
    fastcgi_send_timeout 300;
    fastcgi_read_timeout 300;
    fastcgi_buffer_size 64k;
    fastcgi_buffers 4 64k;
    fastcgi_busy_buffers_size 128k;
    fastcgi_temp_file_write_size 128k;

    # gzip模块设置
    gzip on; #开启gzip压缩输出
    gzip_min_length 1k; #允许压缩的页面的最小字节数,页面字节数从header偷得content-length中获取.默认是0,不管页面多大都进行压缩.建议设置成大于1k的字节数,小于1k可能会越压越大
    gzip_buffers 4 16k; #表示申请4个单位为16k的内存作为压缩结果流缓存,默认值是申请与原始数据大小相同的内存空间来存储gzip压缩结果
    gzip_http_version 1.1; #压缩版本（默认1.1,目前大部分浏览器已经支持gzip解压.前端如果是squid2.5请使用1.0）
    gzip_comp_level 2; #压缩等级.1压缩比最小,处理速度快.9压缩比最大,比较消耗cpu资源,处理速度最慢,但是因为压缩比最大,所以包最小,传输速度快
    gzip_types text/plain application/x-javascript text/css application/xml;
    #压缩类型,默认就已经包含text/html,所以下面就不用再写了,写上去也不会有问题,但是会有一个warn.
    gzip_vary on;#选项可以让前端的缓存服务器缓存经过gzip压缩的页面.例如:用squid缓存经过nginx压缩的数据

    #开启限制IP连接数的时候需要使用
    #limit_zone crawler $binary_remote_addr 10m;

    ##upstream的负载均衡,四种调度算法(下例主讲)##
    #虚拟主机的配置
    server
    {
        # 监听端口
        listen 80;
        # 域名可以有多个,用空格隔开
        server_name ably.com;
        # HTTP 自动跳转 HTTPS
        rewrite ^(.*) https://$server_name$1 permanent;
    }

    server
    {
        # 监听端口 HTTPS
        listen 443 ssl;
        server_name ably.com;

        # 配置域名证书
        ssl_certificate C:\WebServer\Certs\certificate.crt;
        ssl_certificate_key C:\WebServer\Certs\private.key;
        ssl_session_cache shared:SSL:1m;
        ssl_session_timeout 5m;
        ssl_protocols SSLv2 SSLv3 TLSv1;
        ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
        ssl_prefer_server_ciphers on;

        index index.html index.htm index.php;
        root /data/www/;
        location ~ .*\.(php|php5)?$
        {
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_index index.php;
            include fastcgi.conf;
        }

        # 配置地址拦截转发，解决跨域验证问题
        location /oauth/
        {
            proxy_pass https://localhost:13580/oauth/;
            proxy_set_header HOST $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # 图片缓存时间设置
        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
        {
            expires 10d;
        }

        # JS和CSS缓存时间设置
        location ~ .*\.(js|css)?$
        {
            expires 1h;
        }

        # 日志格式设定
        log_format access '$remote_addr - $remote_user [$time_local] "$request" '
        '$status $body_bytes_sent "$http_referer" '
        '"$http_user_agent" $http_x_forwarded_for';
        # 定义本虚拟主机的访问日志
        access_log /var/log/nginx/access.log access;

        # 设定查看Nginx状态的地址.StubStatus模块能够获取Nginx自上次启动以来的工作状态，此模块非核心模块，需要在Nginx编译安装时手工指定才能使用
        location /NginxStatus
        {
            stub_status on;
            access_log on;
            auth_basic "NginxStatus";
            auth_basic_user_file conf/htpasswd;
            #htpasswd文件的内容可以用apache提供的htpasswd工具来产生.
        }
    }
}
```

## Nginx多台服务器实现负载均衡

```bash
1.Nginx负载均衡服务器：
IP：192.168.0.4（Nginx-Server）
2.Web服务器列表：
Web1:192.168.0.5（Nginx-Node1/Nginx-Web1） ；Web2:192.168.0.7（Nginx-Node2/Nginx-Web2）
3.实现目的：用户访问Nginx-Server（“http://mongo.demo.com:8888”）时，通过Nginx负载均衡到Web1和Web2服务器
Nginx负载均衡服务器的nginx.conf配置注释如下：

events
{
    use epoll;
    worker_connections 65535;
}
http
{
    ##upstream的负载均衡,四种调度算法##
    #调度算法1:轮询.每个请求按时间顺序逐一分配到不同的后端服务器,如果后端某台服务器宕机,故障系统被自动剔除,使用户访问不受影响
    upstream webhost
    {
        server 192.168.0.5:6666 ;
        server 192.168.0.7:6666 ;
    }
    #调度算法2:weight(权重).可以根据机器配置定义权重.权重越高被分配到的几率越大
    upstream webhost
    {
        server 192.168.0.5:6666 weight=2;
        server 192.168.0.7:6666 weight=3;
    }
    #调度算法3:ip_hash. 每个请求按访问IP的hash结果分配,这样来自同一个IP的访客固定访问一个后端服务器,有效解决了动态网页存在的session共享问题
    upstream webhost
    {
        ip_hash;
        server 192.168.0.5:6666 ;
        server 192.168.0.7:6666 ;
    }
    #调度算法4:url_hash(需安装第三方插件).此方法按访问url的hash结果来分配请求,使每个url定向到同一个后端服务器,可以进一步提高后端缓存服务器的效率.Nginx本身是不支持url_hash的,如果需要使用这种调度算法,必须安装Nginx 的hash软件包
    upstream webhost
    {
        server 192.168.0.5:6666 ;
        server 192.168.0.7:6666 ;
        hash $request_uri;
    }
    #调度算法5:fair(需安装第三方插件).这是比上面两个更加智能的负载均衡算法.此种算法可以依据页面大小和加载时间长短智能地进行负载均衡,也就是根据后端服务器的响应时间来分配请求,响应时间短的优先分配.Nginx本身是不支持fair的,如果需要使用这种调度算法,必须下载Nginx的upstream_fair模块
    #
    #虚拟主机的配置(采用调度算法3:ip_hash)
    server
    {
        listen 80;
        server_name mongo.demo.com;
        #对 "/" 启用反向代理
        location /
        {
            proxy_pass http://webhost;
            proxy_redirect off;
            proxy_set_header X-Real-IP $remote_addr;
            #后端的Web服务器可以通过X-Forwarded-For获取用户真实IP
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            #以下是一些反向代理的配置,可选.
            proxy_set_header Host $host;
            client_max_body_size 10m; #允许客户端请求的最大单文件字节数
            client_body_buffer_size 128k; #缓冲区代理缓冲用户端请求的最大字节数,
            proxy_connect_timeout 90; #nginx跟后端服务器连接超时时间(代理连接超时)
            proxy_send_timeout 90; #后端服务器数据回传时间(代理发送超时)
            proxy_read_timeout 90; #连接成功后,后端服务器响应时间(代理接收超时)
            proxy_buffer_size 4k; #设置代理服务器（nginx）保存用户头信息的缓冲区大小
            proxy_buffers 4 32k; #proxy_buffers缓冲区,网页平均在32k以下的设置
            proxy_busy_buffers_size 64k; #高负荷下缓冲大小（proxy_buffers*2）
            proxy_temp_file_write_size 64k;
            #设定缓存文件夹大小,大于这个值,将从upstream服务器传
        }
    }
}

负载均衡操作演示如下：
操作对象：192.168.0.4（Nginx-Server）

# 创建文件夹准备存放配置文件
$ mkdir -p /opt/confs
$ vim /opt/confs/nginx.conf

# 编辑内容如下：
events
{
use epoll;
worker_connections 65535;
}

http
{
upstream webhost {
ip_hash;
server 192.168.0.5:6666 ;
server 192.168.0.7:6666 ;
}

server
{
listen 80;
server_name mongo.demo.com;
location / {
proxy_pass http://webhost;
proxy_redirect off;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header Host $host;
client_max_body_size 10m;
client_body_buffer_size 128k;
proxy_connect_timeout 90;
proxy_send_timeout 90;
proxy_read_timeout 90;
proxy_buffer_size 4k;
proxy_buffers 4 32k;
proxy_busy_buffers_size 64k;
proxy_temp_file_write_size 64k;
}
}
}
# 然后保存并退出

# 启动负载均衡服务器192.168.0.4（Nginx-Server）
docker run -d -p 8888:80 --name nginx-server -v /opt/confs/nginx.conf:/etc/nginx/nginx.conf --restart always nginx
操作对象：192.168.0.5（Nginx-Node1/Nginx-Web1）
# 创建文件夹用于存放web页面
$ mkdir -p /opt/html
$ vim /opt/html/index.html

# 编辑内容如下：
<div>
<h1>
The host is 192.168.0.5(Docker02) - Node 1!
</h1>
</div>
# 然后保存并退出

# 启动192.168.0.5（Nginx-Node1/Nginx-Web1）
$ docker run -d -p 6666:80 --name nginx-node1 -v /opt/html:/usr/share/nginx/html --restart always nginx
操作对象：192.168.0.7（Nginx-Node2/Nginx-Web2）
# 创建文件夹用于存放web页面
$ mkdir -p /opt/html
$ vim /opt/html/index.html

# 编辑内容如下：
<div>
<h1>
The host is 192.168.0.7(Docker03) - Node 2!
</h1>
</div>
# 然后保存并退出

# 启动192.168.0.7（Nginx-Node2/Nginx-Web2）
$ docker run -d -p 6666:80 --name nginx-node2 -v $(pwd)/html:/usr/share/nginx/html --restart always nginx
```

