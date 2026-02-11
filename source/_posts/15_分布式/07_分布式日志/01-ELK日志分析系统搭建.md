---
title: 01-ELK日志分析系统搭建
date: 2020-08-20 22:36:51
tags:
- 架构
- 分布式
- ELK
categories: 
- 15_分布式
- 07_分布式日志
---

![image-20230527095118017](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527095119.png)

> ELK是一套针对日志数据做解决方案的框架，分别代表了三款产品：
>
> - E: ElasticSearch（ES），负责日志的存储和检索； 
> - L：Logstash，负责日志的收集，过滤和格式化； 
> - K：Kibana，负责日志的展示统计和数据可视化。

# 一、ELK 是什么？

ELK 是三个开源框架的简写，分别是：Elasticsearch、Logstash、Kibana 。

![image-20230527100158786](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527100200.png)

# 二、安装部署 Elasticsearch

### 1、下载

官网下载地址：https://www.elastic.co/cn/downloads/elasticsearch

国内镜像源（华为）：https://mirrors.huaweicloud.com/elasticsearch/

推荐使用国内的下载地址，官网下载太慢了。

选择合适的版本下载（推荐下载自带 JDK 的版本，否者自己配置的 JDK 可能不符合版本要求。注意：Elasticsearch 会优先使用系统配置的 JDK 。可将 Elasticsearch 自带的 JDK 配置到系统的环境变量中，如果不这样做的话，在安装 Logstash 时，启动会报没有配置 JDK 环境变量的错误。）

```shell
[root@localhost ~]# wget https://mirrors.huaweicloud.com/elasticsearch/7.8.0/elasticsearch-7.8.0-linux-x86_64.tar.gz
```

### 2、解压到指定目录

```shell
# 新建文件夹
[root@localhost ~]# mkdir /usr/local/elasticsearch

# 解压到指定文件夹
[root@localhost ~]# tar -zxvf elasticsearch-7.8.0-linux-x86_64.tar.gz -C /usr/local/elasticsearch/
```

### 3、修改配置文件

```shell
# 进入安装目录
[root@localhost ~]# cd /usr/local/elasticsearch/elasticsearch-7.8.0/

# 修改config/elasticsearch.yml
[root@localhost elasticsearch-7.8.0]# vim ./config/elasticsearch.yml

# 修改以下几项：
node.name: node-1 # 设置节点名
network.host: 0.0.0.0 # 允许外部 ip 访问
cluster.initial_master_nodes: ["node-1"] # 设置集群初始主节点
```

### 4、新建用户并赋权

```shell
# 添加用户 es
[root@localhost elasticsearch-7.8.0]# adduser es

# 设置用户 es 的密码（需要输入两遍密码）
# （如果设置密码过于简单可能会提示 BAD PASSWORD: XXX ，如果是用 root 用户操作可忽略提示继续输入第二遍密码强制设置密码）
[root@localhost elasticsearch-7.8.0]# passwd es
Changing password for user es.
New password: 
BAD PASSWORD: The password is shorter than 8 characters
Retype new password: 
passwd: all authentication tokens updated successfully.

# 将对应的文件夹权限赋予用户 es
[root@localhost elasticsearch-7.8.0]# chown -R es /usr/local/elasticsearch
```

### 5、切换至新建的用户并启动 Elasticsearch

```shell
# 切换至用户 es
[root@localhost elasticsearch-7.8.0]# su es

# 启动 ElasticSearch （-d 表示在后台启动）
[es@localhost elasticsearch-7.8.0]$ ./bin/elasticsearch -d
```

错误处理
启动之后可能会报以下三个错误：

ERROR: [3] bootstrap checks failed
[1]: max file descriptors [4096] for elasticsearch process is too low, increase to at least [65535]
[2]: max number of threads [3795] for user [es] is too low, increase to at least [4096]
[3]: max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]

解决方式：

需切换到root用户解决错误：

```shell
# 切换到 root 用户
[es@localhost elasticsearch-7.8.0]$ su root
```

**[1]** 和 **[2]** 的解决方法：

```shell
# 修改 /etc/security/limits.conf 文件
[root@localhost elasticsearch-7.8.0]# vim /etc/security/limits.conf
# 添加以下四行
* soft nofile 65536
* hard nofile 131072
* soft nproc 2048
* hard nproc 4096
```

**[3]** 的解决方法：

```shell
# 修改 /etc/sysctl.conf 文件
[root@localhost elasticsearch-7.8.0]# vim /etc/sysctl.conf
# 添加下面一行
vm.max_map_count=655360

# 执行命令
[root@localhost elasticsearch-7.8.0]# sysctl -p
```

切换到用户 es 重新启动程序就可以了。

### 6、验证

**注意：** 防火墙需要开放9200端口

```shell
[root@localhost elasticsearch-7.8.0]# firewall-cmd --permanent --add-port=9200/tcp
success
[root@localhost elasticsearch-7.8.0]# firewall-cmd --permanent --add-port=9200/udp
success
[root@localhost elasticsearch-7.8.0]# firewall-cmd --reload
success
```

访问：http://192.168.40.149:9200

返回结果：

```json
{
  "name": "node-1",
  "cluster_name": "elasticsearch",
  "cluster_uuid": "bZD6PjHIQ1uovZrQ6nXa8Q",
  "version": {
    "number": "7.8.0",
    "build_flavor": "default",
    "build_type": "tar",
    "build_hash": "757314695644ea9a1dc2fecd26d1a43856725e65",
    "build_date": "2020-06-14T19:35:50.234439Z",
    "build_snapshot": false,
    "lucene_version": "8.5.1",
    "minimum_wire_compatibility_version": "6.8.0",
    "minimum_index_compatibility_version": "6.0.0-beta1"
  },
  "tagline": "You Know, for Search"
}
```

# 三、安装部署 Kibana

### 1、下载

华为镜像源：https://mirrors.huaweicloud.com/kibana

选择合适的版本下载（和Elasticsearch版本保持一致）。

```shell
# 下载安装包
[root@localhost ~]# wget https://mirrors.huaweicloud.com/kibana/7.8.0/kibana-7.8.0-linux-x86_64.tar.gz
```

### 2、解压并移动到指定目录

```shell
# 解压到当前目录
[root@localhost ~]# tar -zxvf kibana-7.8.0-linux-x86_64.tar.gz

# 重命名并移动到指定目录
[root@localhost ~]# mv ./kibana-7.8.0-linux-x86_64 /usr/local/kibana-7.8.0
```

### 3、修改配置文件

```shell
[root@localhost kibana-7.8.0]# vim ./config/kibana.yml

# 服务端口
server.port: 5601
# 服务器ip  本机
server.host: "0.0.0.0"
# Elasticsearch 服务地址
elasticsearch.hosts: ["http://localhost:9200"]
# 设置语言为中文
i18n.locale: "zh-CN"
```

### 4、授权并切换用户

给 es 用户授予 kibana 目录的权限。

```shell
# 授权
[root@localhost ~]# chown -R es /usr/local/kibana-7.8.0

# 切换用户
root@localhost ~]# su es
```

### 5、启动 Kibana

注意：启动 Kibana 之前需要先启动 Elasticsearch

需要先配置防火墙打开5601端口：

```shell
[root@localhost kibana-7.8.0]# firewall-cmd --permanent --add-port=5601/tcp
success
[root@localhost kibana-7.8.0]# firewall-cmd --permanent --add-port=5601/udp
success
[root@localhost kibana-7.8.0]# firewall-cmd --reload
success
123456
# 前台启动方式
[es@localhost kibana-7.8.0]$ ./bin/kibana

# 后台启动方式
[es@localhost kibana-7.8.0]$ nohup ./bin/kibana &
```

### 6、在浏览器中访问 Kibana

访问地址：http://192.168.40.149:5601/

![image-20230527100659744](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527100700.png)

# 四、安装部署 Logstash

## 1、下载安装包

华为镜像源：https://mirrors.huaweicloud.com/logstash

选择合适版本的安装包（和 Elasticsearch 保持一致）。

```shell
[root@localhost ~]# wget https://mirrors.huaweicloud.com/logstash/7.8.0/logstash-7.8.0.tar.gz
```

### 2、解压并移动到指定目录

```shell
# 解压安装包
[root@localhost ~]# tar -zxvf logstash-7.8.0.tar.gz

# 移动到指定目录
[root@localhost ~]# mv ./logstash-7.8.0 /usr/local/logstash-7.8.0
```

### 3、新建配置文件

根据原有的 logstash-sample.conf 配置文件复制出一个新的配置文件并修改。

```shell
[root@localhost logstash-7.8.0]# cp config/logstash-sample.conf config/logstash-es.conf

# 修改配置文件logstash-es.conf
[root@localhost logstash-7.8.0]# vim config/logstash-es.conf
```

修改成如下内容：

```shell
input {
  tcp {
    port => 9601
    codec => json_lines
  }
}

output {
  elasticsearch {
    hosts => ["http://localhost:9200"]
  }
  stdout {
  	codec => rubydebug
  }
}
```

配置文件logstash-es.conf内容说明：

```shell
input {										# input输入源配置
  tcp {										# 使用tcp输入源
    port => 9601							# 服务器监听端口9061接收日志，默认ip localhost
    codec => json_lines						# 使用json解析日志  需要安装json解析插件
  }
}

output {									# output 数据输出配置
  elasticsearch {							# 使用elasticsearch接收
    hosts => ["http://localhost:9200"]		# 集群地址 多个用,隔开
  }
  stdout {
  	codec => rubydebug						# 输出到命令窗口
  }
}
```

### 4、安装插件

由于国内无法访问默认的gem source，需要将gem source改为国内的源。

```shell
# 修改Gemfile
[root@localhost logstash-7.8.0]# vim Gemfile

# 将source这一行改成如下所示：
source "https://ruby.taobao.org"
```

```shell
[root@localhost logstash-7.8.0]# ./bin/logstash-plugin install logstash-codec-json_lines
```

> 如果报以下错误，请检查是否已经配置了 JDK 环境变量。
>
> could not find java; set JAVA_HOME or ensure java is in PATH

### 5、启动 Logstash

```shell
# 后台启动Logstash
[root@localhost logstash-7.8.0]# nohup ./bin/logstash -f ./config/logstash-es.conf &
```

# 五、配置项目查看结果

本示例使用的是 Spring Boot 项目。

### 1、引入依赖

```xml
<dependency>
    <groupId>net.logstash.logback</groupId>
    <artifactId>logstash-logback-encoder</artifactId>
    <version>4.11</version>
</dependency>
```

### 2、在resources里新建 logback.xml 配置文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration>
<configuration>
    <appender name="LOGSTASH" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
        <!--指定logstash ip：监听端口-->
        <destination>192.168.40.149:9601</destination>
        <encoder charset="UTF-8" class="net.logstash.logback.encoder.LogstashEncoder" />
    </appender>

    <!--引用springboot默认配置-->
    <include resource="org/springframework/boot/logging/logback/base.xml"/>

    <root level="INFO">
        <!--使用上述订阅logstash数据tcp传输 -->
        <appender-ref ref="LOGSTASH" />
        <!--使用springboot默认配置 调试窗口输出-->
        <appender-ref ref="CONSOLE" />
    </root>

</configuration>
```

### 3、启动系统打印日志

启动 Spring Boot 项目：

![image-20230527101108051](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527101110.png)

Kibana还需要配置日志读取的索引：

![image-20230527101125044](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527101126.png)

在Kinaba中查看结果：

![image-20230527101149128](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527101150.png)