---
title: 01-VMware安装和配置CentOS7
date: 2018-3-28 23:06:42
tags:
- CentOS
- 虚拟机
- 服务器
categories: 
- 06_服务器
- 03_CentOS
---



## Centos7

* CentOS7在VMware上安装教程：https://blog.csdn.net/HXBest/article/details/123853738
* CentOS7配置网络：https://blog.csdn.net/feriman/article/details/121068882
* CentOS7配置yum镜像：https://blog.csdn.net/m0_64787068/article/details/140157410
* CentOS7配置ssh：
  * https://blog.csdn.net/lza20001103/article/details/144874625
  * https://blog.csdn.net/qq_42073364/article/details/121395224

## jdk多版本

* JDK多版本共存和切换：https://blog.csdn.net/weixin_48803304/article/details/107296245

  ```
  yum install java-1.8.0-openjdk.x86_64
  yum install java-11-openjdk
  java -version
  #更改默认java版本
  sudo alternatives --config java
  #设置java环境变量
  vi /etc/profile.d/java.sh
  添加1行: JAVA_HOME="/usr/lib/jvm/java-11-openjdk"
  source /etc/profile.d/java.sh
  echo $JAVA_HOME
  ```

  Maven仓库的安装与配置：https://blog.csdn.net/dontYouWorry/article/details/128934720

## Jenkins持续交付

* jenkins清华大学镜像站：https://mirrors.tuna.tsinghua.edu.cn/jenkins/

* jenkins各版本下载：https://get.jenkins.io/war-stable/

* jenkins两个插件下载源替换：https://blog.csdn.net/winerpro/article/details/143240901

  * http://mirror.esuni.jp/jenkins//updates/update-center.json
  * https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json

* jenkins安装基于jdk17的2.452.3版本：https://blog.csdn.net/weixin_34752204/article/details/142252963

  ```
  wget https://get.jenkins.io/war-stable/2.452.3/jenkins.war
  ```

  jdk17的安装与注册到多版本切换：https://blog.csdn.net/ChennyWJS/article/details/131979094

* jenkins安装后Manage jenkins中提示糟糕的问题：

  * Dashboard > Manage Jenkins > Security > 隐藏的安全警告(全部关闭就好了)
  * Dashboard > Manage Jenkins > System > 管理监控配置(全部关闭就好了)

* jenkins中默认json配置替换：

  ```bash
  cd /root/.jenkins/updates
  sed -i 's/https:\/\/updates.jenkins.io\/download/https:\/\/mirrors.tuna.tsinghua.edu.cn\/jenkins/g' default.json && sed -i 's/https:\/\/www.google.com/https:\/\/www.baidu.com/g' default.json
  ```

* 【Jenkins】Jenkins启动报错：AWT is not properly configured：https://blog.csdn.net/jiangjun_dao519/article/details/125620237

* jenkins 流水线pipeline阶段视图插件：`Pipeline stage view`

* jenkins 流水线pipeline使用java8来进行编译（与环境变量不冲突）：https://blog.51cto.com/u_16213346/7611153

* jenkins 流水线pipeline脚本中读取当前构建人名字插件：`build user vars`

  ```pipeline
          stage('开始发布通知') {
              steps {
                  sh 'echo 开始发布通知'
                  wrap([$class: 'BuildUser']) {
                  	script {
                  		BUILD_USER = "${env.BUILD_USER}"
                  	}
                  	sh 'echo BUILD_USER=${BUILD_USER}'
                  	//必须要放到wrap作用域内使用
                  	sh 'ssh root@${ipAddress} "cd /root/ && ./.push-start-msg.sh ${releaseTerminal} ${packageEnv} jar ${BUILD_USER}"'
                  }
                  sh 'echo 开始发布通知完成'
              }
          }
  ```

  

* Jenkins的pipeline参考示例：
  后端：

  ```
  pipeline { 
      agent any 
      
      environment {
          REPOSITORY="http://ip地址:6060/background/xxx.git"
          def projectPath = "/root/xxx-project"
          def projectName = "xxx"
          def ipAddress = "ip地址"
          def releaseTerminal = "xxx"
          def packageEnv = "test"
      }
  
      tools {
          jdk 'Java8'
      }
      
      stages {
          stage('开始发布通知') {
              steps {
                  println "rollbackFlag=" + rollbackFlag
                  script {
                  	if (rollbackFlag == "true") {
                          wrap([$class: 'BuildUser']) {
                          	script {
                          		BUILD_USER = "${env.BUILD_USER}"
                      	    }
                          	sh 'echo BUILD_USER=${BUILD_USER}'
                          	sh 'echo 开始回滚通知'
                          	sh '/root/.push-start-msg.sh ${releaseTerminal} ${packageEnv} jar ${BUILD_USER} 回滚'
                          	sh 'echo 开始回滚通知完成'
                          }
                  	} else {
                  	     wrap([$class: 'BuildUser']) {
                          	script {
                          		BUILD_USER = "${env.BUILD_USER}"
                      	    }
                      	    sh 'echo BUILD_USER=${BUILD_USER}'
                          	sh 'echo 开始发布通知'
                          	sh '/root/.push-start-msg.sh ${releaseTerminal} ${packageEnv} jar ${BUILD_USER} 发布'
                          	sh 'echo 开始发布通知完成'
                  	    }
                  	}
                  }
              }
          }
          stage('拉取代码') { 
              steps {
                  script {
                      if (rollbackFlag == "true") {
                          sh 'echo 回滚操作，跳过拉取代码'
                      } else {
                          sh 'echo 拉取代码'
                          sh 'echo pull-${packageEnv}-${releaseTerminal}'
                          sh 'cd ${projectPath}/${projectName} && git checkout ${packageEnv} && git pull && ${projectPath}/pull-gitlog.sh ${releaseTerminal} ${packageEnv} jar'
                          sh 'echo 拉取代码完成'                        
                      }
                  }
              }
          }
          stage('项目编译') { 
              steps { 
                  script {
                      if (rollbackFlag == "true") {
                          sh 'echo 回滚操作，跳过项目编译'
                      } else {
                          sh 'echo 项目编译' 
                          sh 'echo package-${releaseTerminal}'
                          sh 'cd ${projectPath}/${projectName} && mvn clean package --settings /root/maven/jiechu-settings.xml -Dmaven.test.skip=true'
                          sh 'echo 项目编译完成'
                      }
                  }
              }
          }
          stage('远程拷贝'){
              steps {
                  script {
                      println "rollbackFlag=" + rollbackFlag
                      if (rollbackFlag == "true") {
                          sh 'echo 回滚操作，跳过远程拷贝'
                      } else {
                          sh 'echo 远程拷贝'
                          sh 'echo copy-jar-to-${packageEnv}-${releaseTerminal}'
                          sh 'time rsync -avzh ${projectPath}/${projectName}/ruoyi-admin/target/xxx-${releaseTerminal}-*.jar root@${ipAddress}:/root/xxx-${releaseTerminal}-${packageEnv}/jars'
                          sh 'echo 远程拷贝完成'
                      }
                  }
              }
          }
          stage('启动服务') {
              steps {
                  script {
                      println "rollbackFlag=" + rollbackFlag
                      if (rollbackFlag == "true") {
                          sh 'echo 回滚操作，启动上一个jar包服务'
                          sh 'ssh root@${ipAddress} "cd /root/xxx-${releaseTerminal}-${packageEnv} && ./run-jars-rb.sh"'
                      } else {
                          sh 'echo 启动服务'
                          sh 'ssh root@${ipAddress} "cd /root/xxx-${releaseTerminal}-${packageEnv} && ./run-jars.sh"'
                      }
                      sh 'echo 启动日志'
                      sh 'ssh root@${ipAddress} "cd /root/xxx-${releaseTerminal}-${packageEnv} && ./startlog.sh ${releaseTerminal} ${packageEnv}"'
                      sh 'echo 启动服务成功'
                  }
              }
          }
          stage('成功发布通知') {
              steps {
                  println "rollbackFlag=" + rollbackFlag
                  script {
                  	if (rollbackFlag == "true") {
                          wrap([$class: 'BuildUser']) {
                          	script {
                          		BUILD_USER = "${env.BUILD_USER}"
                          	}
                      	    sh 'echo BUILD_USER=${BUILD_USER}'
                      	    sh 'echo 成功回滚通知'
                      	    sh '/root/.push-success-msg.sh ${releaseTerminal} ${packageEnv} jar ${BUILD_USER} ${ipAddress} 回滚'
                      	    sh 'echo 成功回滚通知完成'
                          }
                  	} else {
                          wrap([$class: 'BuildUser']) {
                          	script {
                          		BUILD_USER = "${env.BUILD_USER}"
                          	}
                          	sh 'echo BUILD_USER=${BUILD_USER}'
                      	    sh 'echo 成功发布通知'
                      	    sh '/root/.push-success-msg.sh ${releaseTerminal} ${packageEnv} jar ${BUILD_USER} ${ipAddress} 发布'
                      	    sh 'echo 成功发布通知完成'
                          }
                  	}
                  }
              }
          }
      }
  }
  ```

  前端：

  ```
  pipeline { 
      agent any 
      
      environment {
          REPOSITORY="http://ip地址:6060/front/xxx.git"
          def projectPath = "/root/xxx-project"
  		def projectName = "xxx"
          def ipAddress = "ip地址"
          def releaseTerminal = "h5"
          def packageEnv = "test"
          def nodeVersion = "18.16.0"
      }
      
      stages {
          stage('开始发布通知') {
              steps {
                  println "rollbackFlag=" + rollbackFlag
                  script {
                  	if (rollbackFlag == "true") {
                          wrap([$class: 'BuildUser']) {
                          	script {
                          		BUILD_USER = "${env.BUILD_USER}"
                      	    }
                          	sh 'echo BUILD_USER=${BUILD_USER}'
                          	sh 'echo 开始回滚通知'
                          	sh '/root/.push-start-msg.sh ${releaseTerminal} ${packageEnv} front ${BUILD_USER} 回滚'
                          	sh 'echo 开始回滚通知完成'
                          }
                  	} else {
                  	     wrap([$class: 'BuildUser']) {
                          	script {
                          		BUILD_USER = "${env.BUILD_USER}"
                      	    }
                      	    sh 'echo BUILD_USER=${BUILD_USER}'
                          	sh 'echo 开始发布通知'
                          	sh '/root/.push-start-msg.sh ${releaseTerminal} ${packageEnv} front ${BUILD_USER} 发布'
                          	sh 'echo 开始发布通知完成'
                  	    }
                  	}
                  }
              }
          }
          stage('拉取代码') { 
              steps {
                  script {
                      if (rollbackFlag == "true") {
                          sh 'echo 回滚操作，跳过拉取代码'
                      } else {
                          sh 'echo 拉取代码'
                          sh 'echo pull-${packageEnv}-${releaseTerminal}'
                          sh 'cd ${projectPath}/${projectName} && git checkout ${packageEnv} && git pull && ${projectPath}/pull-gitlog.sh ${releaseTerminal} ${packageEnv} front'
                          sh 'echo 拉取代码完成'                        
                      }
                  }
              }
          }
          stage('项目编译') { 
              steps { 
                  script {
                      if (rollbackFlag == "true") {
                          sh 'echo 回滚操作，跳过项目编译'
                      } else {
                          sh 'echo 项目编译' 
                          sh 'echo 删除旧的dist包'
                          sh 'cd ${projectPath}/${projectName} && rm ./dist -rf'
                          sh 'echo 删除旧的dist包完成！'
                          sh 'echo package-${releaseTerminal}'
                          sh '. ~/.nvm/nvm.sh && nvm use ${nodeVersion} && cd ${projectPath}/${projectName} && npm cache clean --force && npm pack --max-old-space-size=300 && npm run testbuild'
                          sh 'echo 项目编译完成'
                      }
                  }
              }
          }
          stage('远程拷贝'){
              steps {
                  script {
                      println "rollbackFlag=" + rollbackFlag
                      if (rollbackFlag == "true") {
                          sh 'echo 回滚操作，跳过远程拷贝'
                      } else {
                          sh 'echo 远程拷贝'
                          sh 'echo copy-dist-to-${packageEnv}-${releaseTerminal}'
                          sh 'ssh root@${ipAddress} "rm -rf /root/xxx-${releaseTerminal}-${packageEnv}/front/${releaseTerminal}/dist"'
                          sh 'time rsync -avzh ${projectPath}/${projectName}/dist/build/${releaseTerminal}/* root@${ipAddress}:/root/xxx-${releaseTerminal}-${packageEnv}/front/${releaseTerminal}/'
                          sh 'echo 远程拷贝完成'
                      }
                  }
              }
          }
          stage('部署页面') {
              steps {
                  script {
                      println "rollbackFlag=" + rollbackFlag
                      if (rollbackFlag == "true") {
                          sh 'echo 回滚操作，部署上一个打包的静态页面'
                          sh 'ssh root@${ipAddress} "cd /root/xxx-${releaseTerminal}-${packageEnv} && ./run-${releaseTerminal}-rb.sh"'
                      } else {
                          sh 'echo 部署页面'
                          sh 'ssh root@${ipAddress} "cd /root/xxx-${releaseTerminal}-${packageEnv} && ./run-${releaseTerminal}.sh"'
                      }
                      sh 'echo 部署页面成功'
                  }
              }
          }
          stage('成功发布通知') {
              steps {
                  println "rollbackFlag=" + rollbackFlag
                  script {
                  	if (rollbackFlag == "true") {
                          wrap([$class: 'BuildUser']) {
                          	script {
                          		BUILD_USER = "${env.BUILD_USER}"
                          	}
                      	    sh 'echo BUILD_USER=${BUILD_USER}'
                      	    sh 'echo 成功回滚通知'
                      	    sh '/root/.push-success-msg.sh ${releaseTerminal} ${packageEnv} front ${BUILD_USER} ${ipAddress} 回滚'
                      	    sh 'echo 成功回滚通知完成'
                          }
                  	} else {
                          wrap([$class: 'BuildUser']) {
                          	script {
                          		BUILD_USER = "${env.BUILD_USER}"
                          	}
                          	sh 'echo BUILD_USER=${BUILD_USER}'
                      	    sh 'echo 成功发布通知'
                      	    sh '/root/.push-success-msg.sh ${releaseTerminal} ${packageEnv} front ${BUILD_USER} ${ipAddress} 发布'
                      	    sh 'echo 成功发布通知完成'
                          }
                  	}
                  }
              }
          }
    }
  }
```
  
  
  
* Jenkins账号权限设置：全局安全配置 - Authentication - 授权策略 - 安全矩阵 选择插件 `Role-based Authorization Strategy`

  https://blog.csdn.net/YZL40514131/article/details/130143433

* Java项目编译后的jar包瘦身数十倍（加快scp远程传输速度）：https://blog.csdn.net/tangjieqing/article/details/144455182

* 服务器之间传输文件使用：rsync -avzh 效果是最好的，参考示例

  ```bash
  time rsync -avzh xxx/target/*.jar root@ip:/root/xxx/jars
  ```



## node多版本

* 安装nvm

  ```
  #安装nvm
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  source ~/.bashrc
  nvm -v
  nvm list
  nvm install 18.16.0
  nvm use 18.16.0
  node -v #此时node为18.16.0
  
  如果报错则需要升级make和gcc：参考如下方法
  ```

* 安装nvm管理node多版本：https://blog.51cto.com/qiuyue/6260438
  比如我用的 node 16.15.1 和 18.16.0，通过 nvm list可以看到

* 安装nvm多版本管理后，jenkins中创建的任务可能看不到了，原因是因为中文编码问题。
  当时手动重新新建了pipeline以及做了如下中文设置才ok。`一定要先准备好环境再开始创建构建任务！`
  
* npm镜像源加速：https://blog.csdn.net/m0_52172586/article/details/142930356

### 一、Tomcat服务端编码修正

1. 修改 `server.xml` 文件
   在Tomcat的 `conf/server.xml` 中找到 `<Connector>` 标签，添加 `URIEncoding="UTF-8"` 参数：

   ```
   xml复制<Connector port="8080" protocol="HTTP/1.1"
              URIEncoding="UTF-8"  <!-- 新增此行 -->
              redirectPort="8443" />
   ```

   重启Tomcat生效[4](https://blog.csdn.net/ppdouble/article/details/12784475)。

2. 调整日志编码配置
   编辑 `conf/logging.properties` ，修改以下行：

   ```
   properties
   
   复制
   java.util.logging.ConsoleHandler.encoding  = UTF-8  # 原为GBK或其他编码则修改
   ```

   确保日志输出统一为UTF-8[6](https://blog.csdn.net/guodong2020/article/details/118516739)[8](https://blog.csdn.net/a350301941/article/details/90148765)]。

------

### 二、Jenkins全局编码设置

1. 修改JVM启动参数
   在Tomcat的启动脚本（如 `bin/catalina.sh` ）中添加JVM编码参数：

   ```
   bash
   
   复制
   export JAVA_OPTS="-Dfile.encoding=UTF-8  -Dsun.jnu.encoding=UTF-8"   # 添加此行
   ```

   重启Tomcat使配置生效[10](https://blog.csdn.net/weixin_42844971/article/details/109053781)]。

2. Jenkins系统环境变量配置
   进入Jenkins的 `Manage Jenkins → System Configuration → Global properties`，勾选 **Environment variables** 并添加：

   ```
   ini复制Key: LANG   Value: en_US.UTF-8
   Key: LC_ALL Value: en_US.UTF-8
   ```

   此操作覆盖系统默认编码[9](https://blog.csdn.net/xiaoyang9988/article/details/84784573)]。

------

### 三、构建脚本与日志输出修正

1. Shell脚本显式指定编码
   在Jenkins的构建脚本（如 `Execute shell`）开头添加：

   ```
   bash复制export LANG="en_US.UTF-8"
   export LC_ALL="en_US.UTF-8"
   ```

   确保子进程继承正确编码[5](https://blog.csdn.net/weixin_35353187/article/details/88776226)]。

2. Maven/Gradle项目配置
   对于Java项目，在 `pom.xml` 或 `gradle.properties` 中设置：

   ```
   properties复制# Maven
   <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding> 
   
   # Gradle
   systemProp.file.encoding=UTF-8 
   ```

------

### 四、系统级语言环境检查

1. 验证系统编码
   执行 `locale` 命令查看当前编码，若未启用UTF-8，修改 `/etc/locale.conf` ：

   ```
   ini复制LANG="en_US.UTF-8"
   LC_ALL="en_US.UTF-8"
   ```

   重启系统生效[6](https://blog.csdn.net/guodong2020/article/details/118516739)]。

2. 安装完整语言包
   确保系统已安装中文语言支持：

   ```
   bash复制yum install glibc-common -y
   localedef -c -f UTF-8 -i en_US en_US.UTF-8
   ```

------

### 五、浏览器与缓存处理

1. 清除浏览器缓存
   使用Chrome/Firefox的隐身模式访问Jenkins，排除缓存干扰[9](https://blog.csdn.net/xiaoyang9988/article/details/84784573)]。
2. 调整Jenkins界面编码
   在 `Manage Jenkins → Configure System` 中，找到 **Locale** 配置项，强制设置为 `zh_CN.UTF-8` 并重启服务[9](https://blog.csdn.net/xiaoyang9988/article/details/84784573)]。

------

### 附：验证步骤

1. 查看构建日志文件编码：

   ```
   bash
   
   复制
   file -i Jenkins工作空间路径/builds/*/log
   ```

2. 若输出 `charset=utf-8` 表示配置生效。

------

通过以上步骤，90%的中文乱码问题可解决。若仍存在问题，需检查应用程序自身是否强制指定了编码（如日志框架配置）[8](https://blog.csdn.net/a350301941/article/details/90148765)]。



## jumpserver堡垒机

* 验证版本：v4.7.0
* 一键部署安装：https://blog.csdn.net/icanflyingg/article/details/121898008
* 版本列表：https://github.com/jumpserver/jumpserver/releases

* 重置管理员密码的解决方法：https://zhuanlan.zhihu.com/p/696246180
* 登陆提示“配置文件有问题无法登陆”：https://bbs.fit2cloud.com/t/topic/1935
* jumpserver 用户列表和资产列表转移，使用列表导出导入功能：https://kb.fit2cloud.com/?p=56



## Grafana+Prometheus监控搭建

* 环境搭建和使用：https://blog.csdn.net/qq_31725371/article/details/114697770

* prometheusv2.25.0-linux-amd64单独下载（实测迅雷最快）：https://github.com/prometheus/prometheus/releases?page=17
  prometheus.yml配置参考：

  ```yml
  scrape_configs:
    # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
    - job_name: 'prometheus'
      # metrics_path defaults to '/metrics'
      # scheme defaults to 'http'.
      static_configs:
      - targets: ['localhost:9003']
  
    - job_name: 'xxx-centos'
      static_configs:
      - targets: ['121.40.67.xxx:9100'] # 多个用,分开
  
    - job_name: 'xxx-manage'
      scheme: https  # 强制使用 HTTPS 协议 
      tls_config:
        insecure_skip_verify: true  # 跳过证书验证（可选）
      metrics_path: /webmanage/actuator/prometheus   #java项目指定这个路径 /actuator/prometheus
      static_configs:
      - targets: ['121.40.67.xxx:9088'] # 多个用,分开
      relabel_configs:
      - source_labels: [job]       # 从 job 名称提取值 
        target_label: application  # 映射到 application 标签 
        replacement: $1            # 直接替换 
  ```

  

* grafana单独下载：https://mirrors.tuna.tsinghua.edu.cn/grafana/yum/rpm/Packages/grafana-7.4.3-1.x86_64.rpm

* grafana启动failed拯救：https://blog.csdn.net/ximenjianxue/article/details/125200854

  ```bash
  #!/bin/bash
  
  nohup /usr/sbin/grafana-server --config=/etc/grafana/grafana.ini --pidfile=/var/run/grafana/grafana-server.pid --homepath=/usr/share/grafana --packaging=rpm cfg:default.paths.logs=/var/log/grafana > /tmp/grafana.log 2>&1 &
  
  echo "$!" > pid
  ```

* java springboot项目接入：
  
* 依赖添加。版本可以自动关联，不需要对应，比如springboot2.5.x对应是1.7.x会自动拉取：
    注意context-path，eg：https://localhost:8080/webmanage/actuator/prometheus
  
  ```xml
          <dependency>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-actuator</artifactId>
          </dependency>
          <dependency>
              <groupId>io.micrometer</groupId>
              <artifactId>micrometer-registry-prometheus</artifactId>
        </dependency>
  ```
  
  * 配置添加。
  
  ```yml
  # Spring配置
  spring:
    # 服务名称
    application:
      name: wangxiao-manage
  
  ...
  
  #grafana
  management:
    endpoint:
      prometheus:
        enabled: true
    endpoints:
      web:
        exposure:
          include: '*'
    metrics:
      export:
        prometheus:
          enabled: true
      tags:
        application: ${spring.application.name}
  ```
  
  * 接口开放。
  
  ```java
  SecurityConfig.configure(...) 方法中添加：
  // prometheus监控
  .antMatchers("/actuator/**").permitAll()
  ```
  
* grafana dashboards官方可视化模版：https://grafana.com/grafana/dashboards/

* grafana dashboards常用模版推荐：https://blog.csdn.net/sdhzdtwhm/article/details/135546426
  java服务监控模版id：12856
  centos服务器主机监控模版id：12633

* grafana 报警规则官方中文文档：https://grafana.org.cn/docs/grafana/latest/alerting/fundamentals/alert-rules/
* grafana 邮件告警&webhook告警：