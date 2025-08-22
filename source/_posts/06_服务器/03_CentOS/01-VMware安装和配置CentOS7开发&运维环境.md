---
title: 01-VMware安装和配置CentOS7开发&运维环境
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
  
  ```bash
  #如果按上述方法安装了jdk后，jps -v命令提示找不到，则需要执行如下命令：
  yum install -y java-1.8.0-openjdk-devel.x86_64
  #然后jps -v 可以执行了。
  ```
  
  

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

* Jenkins启动报错：AWT is not properly configured：https://blog.csdn.net/jiangjun_dao519/article/details/125620237

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
  
* 后端：
  
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

* 前端：
  
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
  
* 比如我用的 node 16.15.1 和 18.16.0，通过 nvm list可以看到
  
* 安装nvm多版本管理后，jenkins中创建的任务可能看不到了，原因是因为中文编码问题。
  
  * 当时手动重新新建了pipeline以及做了如下中文设置才ok。`一定要先准备好环境再开始创建构建任务！`
  
* npm镜像源加速：https://blog.csdn.net/m0_52172586/article/details/142930356

### 一、Tomcat服务端编码修正

1. 修改 `server.xml` 文件

   * 在Tomcat的 `conf/server.xml` 中找到 `<Connector>` 标签，添加 `URIEncoding="UTF-8"` 参数：

  ```
   <Connector port="8080" protocol="HTTP/1.1"
              URIEncoding="UTF-8"  <!-- 新增此行 -->
              redirectPort="8443" />
  ```

   重启Tomcat生效[4](https://blog.csdn.net/ppdouble/article/details/12784475)。

2. 调整日志编码配置

   * 编辑 `conf/logging.properties` ，修改以下行：

   ```
   java.util.logging.ConsoleHandler.encoding  = UTF-8  # 原为GBK或其他编码则修改
   ```

   确保日志输出统一为UTF-8[6](https://blog.csdn.net/guodong2020/article/details/118516739)[8](https://blog.csdn.net/a350301941/article/details/90148765)]。

------

### 二、Jenkins全局编码设置

1. 修改JVM启动参数
   
* 在Tomcat的启动脚本（如 `bin/catalina.sh` ）中添加JVM编码参数：
  
   ```
   export JAVA_OPTS="-Dfile.encoding=UTF-8  -Dsun.jnu.encoding=UTF-8"   # 添加此行
   ```
   
   重启Tomcat使配置生效。

2. Jenkins系统环境变量配置

   * 进入Jenkins的 `Manage Jenkins → System Configuration → Global properties`，勾选 **Environment variables** 并添加：

   ```
   Key: LANG   Value: en_US.UTF-8
   Key: LC_ALL Value: en_US.UTF-8
   ```

   此操作覆盖系统默认编码。

------

### 三、构建脚本与日志输出修正

1. Shell脚本显式指定编码。在Jenkins的构建脚本（如 `Execute shell`）开头添加：
   
   ```
   export LANG="en_US.UTF-8"
   export LC_ALL="en_US.UTF-8"
   ```
   

确保子进程继承正确编码。

2. Maven/Gradle项目配置。对于Java项目，在 `pom.xml` 或 `gradle.properties` 中设置：
   
   ```
   # Maven
   <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding> 

   # Gradle
   systemProp.file.encoding=UTF-8 
   ```

------

### 四、系统级语言环境检查

1. 验证系统编码。执行 `locale` 命令查看当前编码，若未启用UTF-8，修改 `/etc/locale.conf` ：
   
   ```
   LANG="en_US.UTF-8"
   LC_ALL="en_US.UTF-8"
   ```
   

重启系统生效[6](https://blog.csdn.net/guodong2020/article/details/118516739)]。

2. 安装完整语言包。确保系统已安装中文语言支持：
   
   ```
   yum install glibc-common -y
   localedef -c -f UTF-8 -i en_US en_US.UTF-8
   ```

------

### 五、浏览器与缓存处理

1. 清除浏览器缓存。使用Chrome/Firefox的隐身模式访问Jenkins，排除缓存干扰[9](https://blog.csdn.net/xiaoyang9988/article/details/84784573)]。
2. 调整Jenkins界面编码。在 `Manage Jenkins → Configure System` 中，找到 **Locale** 配置项，强制设置为 `zh_CN.UTF-8` 并重启服务。

------

### 附：验证步骤

1. 查看构建日志文件编码：

   ```
   file -i Jenkins工作空间路径/builds/*/log
   ```
   
2. 若输出 `charset=utf-8` 表示配置生效。

------

通过以上步骤，90%的中文乱码问题可解决。若仍存在问题，需检查应用程序自身是否强制指定了编码（如日志框架配置）。



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
  
* prometheus.yml配置参考：
  
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
  
* prometheus启动：

  ```bash
  ./prometheus --config.file=prometheus.yml
  #如果配置了systemctl，则可以命令启动
  systemctl start prometheus
  systemctl status prometheus
  systemctl stop prometheus
  #开机启动
  systemctl enable prometheus
  #开机不启动
  systemctl disable prometheus
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
  
  * 注意context-path，eg：https://localhost:8080/webmanage/actuator/prometheus
  
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
  
  * java服务监控模版id：12856
* centos服务器主机监控模版id：12633
  
* grafana 报警规则官方中文文档：https://grafana.org.cn/docs/grafana/latest/alerting/fundamentals/alert-rules/



## Sonar代码扫描-增量

> 在sonar中环境和版本配置比较重要
>
> \#在sonar现在的版本中已经不支持mysql了,推荐使用postsql
>
> 推荐sonar 9.9.4 java 17 postsql 15 

* sonar10.4基于jdk17，下载sonar：https://www.sonarsource.com/products/sonarqube/downloads/historical-downloads/

* 安装sonar：
  * https://www.cnblogs.com/wutou/p/17458707.html
  * https://blog.csdn.net/weixin_50271247/article/details/119756146
  
* sonar最全使用教程：https://blog.csdn.net/tongfj/article/details/125751659

* 报错问题解决：

  * 发现sonar.log报错如下：

    ```
    INFO app[][o.s.a.SchedulerImpl] Waiting for Elasticsearch to be up and running
    ERROR app[][o.e.c.RestHighLevelClient] Failed to parse info response
    6 java.lang.IllegalStateException: Unsupported Content-Type: text/html;charset=UTF-8
    ```

  * 发现es.log报错如下：

    ```
    ERROR es[][o.e.b.Bootstrap] Exception
    java.lang.RuntimeException: can not run elasticsearch as root
    ```

  * 原因：`因为elasticsearch强制要求非root用户才能启动`。

  * 解决过程：

    ```bash
    # 创建名为 sonar 的用户（可自定义名称）
    useradd sonar 
    # 设置密码（可选），密码也是 sonar 需要输入两遍
    passwd sonar 
    # 重命名了一下sonarqube目录
    mv sonarqube-9.9.8.100196 sonarqube
    # 替换为你的 SonarQube 实际路径 
    chown -R sonar:sonar /opt/sonar/sonarqube
    
    --- 如下步骤也作为重启的必要步骤 Begin ---
    # 清理旧数据【关键步骤】：删除 Elasticsearch 的临时文件和锁文件
    rm -rf /opt/sonar/sonarqube/temp/* && rm -rf /opt/sonar/sonarqube/data/es8/node.lock
    # 切换到 sonar 用户，才能去启动 sonar
    su - sonar
    # 启动 SonarQube（需进入安装目录的 bin 目录）
    cd /opt/sonar/sonarqube/bin/linux-x86-64
    ./sonar.sh start
    # 或
    ./sonar.sh restart
    --- 如上步骤也作为重启的必要步骤 End ---
    ```
    
  * 启动还是失败，发现es端口被占用了，日志es.log下：

  ```
  ERROR es[][o.e.b.Bootstrap] Exception
     54 org.elasticsearch.http.BindHttpException: Failed to bind to 127.0.0.1:9001
  Caused by: java.net.BindException: Address already in use
  ```

  * 修改es默认端口号为 9200

    ```yml
  #vi /opt/sonar/sonarqube/elasticsearch/config/elasticsearch.yml
  http.port: 9200
    ```

    同步修改sonar.properties中的es端口：

    ```properties
  #vi /opt/sonar/sonarqube/conf/sonar.properties
  sonar.search.port=9200
  sonar.web.port=9000 #默认值根据情况修改
    ```

  * 启动成功！

  ```
    查看WEB界面 默认访问地址：http://ip:9000，默认账号:admin  密码: admin
    登录成功后会强制要求更改密码。
  ```

* 汉化：

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250411085338.png)

手动去下载汉化插件包:

打开页面：https://github.com/SonarQubeCommunity/sonar-l10n-zh/releases/latest

下载对应 sonarqube 的版本，比如我的是 9.9 版本，下载地址为：

```
wget https://github.com/xuhuisheng/sonar-l10n-zh/releases/download/sonar-l10n-zh-plugin-9.9/sonar-l10n-zh-plugin-9.9.jar
```

将插件放置到这个 ~/sonarqube/extensions/plugins 目录下，然后重启 sonar 服务。

> 如果wget很慢的话，可以使用windows的迅雷下载后，ftp工具将jar包推送到服务器制定目录。

* mvn扫描代码质量（参考方法二）：https://cloud.tencent.com/developer/article/1496871

  ```bash
  #sonar令牌：
  配置全局分析令牌: sqa_6c6e7c4f7cc5012b07df283ad05b5c619e31xxxx
  #比如java项目，到java项目目录下运行该命令进行代码质量扫描
  mvn sonar:sonar \
      -Dmaven.test.skip=true \
      -Dsonar.host.url=http://localhost:9000 \
      -Dsonar.login=sqa_6c6e7c4f7cc5012b07df283ad05b5c619e31xxxx \
      -Dsonar.java.binaries=target/sonar \
      -Dsonar.projectKey=project_a \    #用于api接口请求时使用的projectKey
      -Dsonar.projectName=ProjectA \    #显示在sonar的web界面的项目名
      -Dsonar.analysis.date=20xx-04-01
  #    -Dsonar.branch.name=test
  
  #eg: 真实例子
  + cd /root/jiechu-project/wangxiao
  + mvn sonar:sonar -Dmaven.test.skip=true -Dsonar.host.url=http://localhost:9000 -Dsonar.login=sqa_6c6e7c4f7cc5012b07df283ad05b5c619e31xxxx -Dsonar.java.binaries=/root/jiechu-project/wangxiao/target/sonar -Dsonar.projectKey=wangxiao -Dsonar.projectName=wangxiao -Dsonar.analysis.date=2025-04-11
  ```

* 如果要使用 -Dsonar.branch.name=test 指定分支扫描指令，需要安装插件 Sonarqube Community Branch Plugin

  * 插件地址：https://github.com/mc1arke/sonarqube-community-branch-plugin

  * 插件版本对应关系：sonar 9.9 对应插件版本 1.14.0

  * 下载1.14.0 版本（迅雷下载本地ftp传上去，记得重启）：

    ```
    wget https://github.com/mc1arke/sonarqube-community-branch-plugin/releases/download/1.14.0/sonarqube-community-branch-plugin-1.14.0.jar
    ```

    `指定分支的效果没有验证成功，暂时保持以test为验证代码核心分支`。

* 获取sonar扫描结果api：

  ```json
  curl http://182.92.171.35:9000/api/components/search?qualifiers=TRK&q=wangxiao
  
  {
    "paging": {
      "pageIndex": 1,
      "pageSize": 100,
      "total": 1
    },
    "components": [
      {
        "key": "com.ruoyi:ruoyi",
        "name": "wangxiao",
        "qualifier": "TRK",
        "project": "com.ruoyi:ruoyi"
      }
    ]
  }
  
  
  key 即为 projectKey
  
  curl -s -u sqa_6c6e7c4f7cc5012b07df283ad05b5c619e31xxxx: http://182.92.171.35:9000/api/qualitygates/project_status?projectKey=com.ruoyi:ruoyi
  //返回通过的情况：
  {
      "projectStatus": {
          "status": "OK",
          "conditions": [
              {
                  "status": "OK",
                  "metricKey": "new_reliability_rating",
                  "comparator": "GT",
                  "periodIndex": 1,
                  "errorThreshold": "1",
                  "actualValue": "1"
              },
              {
                  "status": "OK",
                  "metricKey": "new_security_rating",
                  "comparator": "GT",
                  "periodIndex": 1,
                  "errorThreshold": "1",
                  "actualValue": "1"
              },
              {
                  "status": "OK",
                  "metricKey": "new_maintainability_rating",
                  "comparator": "GT",
                  "periodIndex": 1,
                  "errorThreshold": "1",
                  "actualValue": "1"
              }
          ],
          "periods": [
              {
                  "index": 1,
                  "mode": "NUMBER_OF_DAYS",
                  "date": "2025-04-11T13:56:53+0800",
                  "parameter": "30"
              }
          ],
          "ignoredConditions": false,
          "period": {
              "mode": "NUMBER_OF_DAYS",
              "date": "2025-04-11T13:56:53+0800",
              "parameter": "30"
          },
          "caycStatus": "compliant"
      }
  }
  
  //返回未通过的情况：
  {
      "projectStatus": {
          "status": "ERROR",
          "conditions": [
              {
                  "status": "ERROR",
                  "metricKey": "new_reliability_rating",
                  "comparator": "GT",
                  "periodIndex": 1,
                  "errorThreshold": "1",
                  "actualValue": "5"
              },
              {
                  "status": "ERROR",
                  "metricKey": "new_security_rating",
                  "comparator": "GT",
                  "periodIndex": 1,
                  "errorThreshold": "1",
                  "actualValue": "5"
              },
              {
                  "status": "OK",
                  "metricKey": "new_maintainability_rating",
                  "comparator": "GT",
                  "periodIndex": 1,
                  "errorThreshold": "1",
                  "actualValue": "1"
              },
              {
                  "status": "ERROR",
                  "metricKey": "new_security_hotspots_reviewed",
                  "comparator": "LT",
                  "periodIndex": 1,
                  "errorThreshold": "100",
                  "actualValue": "0.0"
              }
          ],
          "periods": [
              {
                  "index": 1,
                  "mode": "PREVIOUS_VERSION",
                  "date": "2025-04-11T14:23:06+0800"
              }
          ],
          "ignoredConditions": false,
          "period": {
              "mode": "PREVIOUS_VERSION",
              "date": "2025-04-11T14:23:06+0800"
          },
          "caycStatus": "compliant"
      }
  }
  ```

* 加入jenkins pipeline中 groovy 语法的脚本：

  * 针对java后端项目

  ```groovy
          stage('项目编译') {...} //需要先进行项目编译才能去扫描
          stage('代码扫描') {
              tools { jdk 'Java17' }
              steps {
                  script {
                      sh 'java --version'
                      if (rollbackFlag == "true") {
                          sh 'echo 回滚操作，跳过拉取代码'
                      } else {
                          sh 'echo 代码扫描'
                          // git最近一次提交的文件
                          def changedFiles = sh(script: "cd ${projectPath}/${projectName} && git diff --name-only HEAD~1 HEAD | xargs -I{} realpath {}", returnStdout: true).trim()
                          def inclusions = changedFiles.replace('\n', ',')
                          // 使用双引号让变量插值生效
                          sh "echo 本次Git提交增量的文件为：${inclusions}"
                          sh "cd ${projectPath}/${projectName} && mvn sonar:sonar -Dmaven.test.skip=true -Dsonar.host.url=http://localhost:9000 -Dsonar.login=sqa_6c6e7c4f7cc5012b07df283ad05b5c619e31cd11 -Dsonar.inclusions=${inclusions} -Dsonar.java.binaries=${projectPath}/${projectName}/target/sonar -Dsonar.projectKey=${projectName} -Dsonar.projectName=${projectName} -Dsonar.analysis.date=2025-04-11"
                          sh 'echo 代码扫描完成'
                          sh 'sleep 5'
                          sh 'echo 开始确认代码扫描结果'
                          // 执行命令并获取输出
                          def commandOutput = sh(
                              script: "curl -s -u sqa_6c6e7c4f7cc5012b07df283ad05b5c619e31cd11: http://localhost:9000/api/qualitygates/project_status?projectKey=${projectName} | jq -r '.projectStatus.status'",
                              returnStdout: true
                          ).trim()
              
                          // 解析结果
                          def SCAN_RES = commandOutput
                          sh "echo 代码扫描结果：${SCAN_RES}"
                          
                          if (SCAN_RES != "OK") {
                              error "代码质量扫描未通过，详情查看地址(账号:viewer 密码:jcjy123456)：http://182.92.171.35:9000/dashboard?id=${projectName}" 
                          }
                          sh 'echo 确认代码扫描结果通过'
                      }
                  }
              }
          }
  ```

  * 针对vue前端项目，前端使用 sonar-scanner 工具进行扫描，命令使用方式类似java的 mvn。
  补充说明：当前安装的sonarqube是9.9版本，对应sonar-scanner的版本是4.8，别问怎么知道，搜一下即可
    下载地址：[sonar-scanner4.8-linux-x64.zip](https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.8.0.2856-linux.zip?_gl=1*m4ahcr*_gcl_au*MzExMzIzMTMyLjE3NDQxNzk4NDY.*_ga*MTM5MzI1NTIyNi4xNzQ0MTc5ODI1*_ga_9JZ0GZ5TC6*MTc0NDQyMTkwOS4yLjEuMTc0NDQyMjQ2OS42MC4wLjA.)
  环境变量：
    
  ```bash
    # vi /etc/profile
    
    #sonar-scanner 对应自己的解压路径即可
    export SONAR_SCANNER_HOME=/opt/sonar/sonar-scanner
    export PATH=$PATH:$SONAR_SCANNER_HOME/bin
    
    # source /etc/profile
    
    # sonar-scanner --version
    NFO: Scanner configuration file: /opt/sonar/sonar-scanner/conf/sonar-scanner.properties
    INFO: Project root configuration file: NONE
    INFO: SonarScanner 4.8.0.2856
    INFO: Java 11.0.17 Eclipse Adoptium (64-bit)
    INFO: Linux 3.10.0-1160.62.1.el7.x86_64 amd64
  ```

    命令方式与mvn命令方式基本一致：

    ```bash
    #sonar令牌：
    配置全局分析令牌: sqa_6c6e7c4f7cc5012b07df283ad05b5c619e31xxxx
    #比如java项目，到java项目目录下运行该命令进行代码质量扫描
    sonar-scanner \
        -Dsonar.host.url=http://localhost:9000 \
        -Dsonar.login=sqa_6c6e7c4f7cc5012b07df283ad05b5c619e31xxxx \
        -Dsonar.sources=. \
        -Dsonar.projectKey=project_a \    #用于api接口请求时使用的projectKey
        -Dsonar.projectName=ProjectA \    #显示在sonar的web界面的项目名
        -Dsonar.analysis.date=20xx-04-01
    #    -Dsonar.branch.name=test
    
    #eg：真实例子
    + cd /root/front-project/online-school-webmanage
    + /opt/sonar/sonar-scanner/bin/sonar-scanner -Dsonar.host.url=http://localhost:9000 -Dsonar.login=sqa_6c6e7c4f7cc5012b07df283ad05b5c619e31xxxx -Dsonar.sources=/root/front-project/online-school-webmanage/src -Dsonar.projectKey=online-school-webmanage -Dsonar.projectName=online-school-webmanage '-Dsonar.exclusions=/root/front-project/online-school-webmanage/node_modules/**,/root/front-project/online-school-webmanage/dist/**' -Dsonar.language=js -Dsonar.javascript.file.suffixes=.vue,.js -Dsonar.analysis.date=2025-04-11
    ```

    因此jenkins中的pipeline中的groovy脚本为：

    ```groovy
            stage('项目编译') {...}
            stage('代码扫描') {
                steps {
                    script {
                        if (rollbackFlag == "true") {
                            sh 'echo 回滚操作，跳过拉取代码'
                        } else {
                            sh 'echo 代码扫描'
                            sh 'cd ${projectPath}/${projectName} && /opt/sonar/sonar-scanner/bin/sonar-scanner -Dsonar.host.url=http://localhost:9000 -Dsonar.login=sqa_6c6e7c4f7cc5012b07df283ad05b5c619e31cd11 -Dsonar.sources=${projectPath}/${projectName}/src -Dsonar.projectKey=online-school-webmanage -Dsonar.projectName=online-school-webmanage -Dsonar.exclusions=${projectPath}/${projectName}/node_modules/**,${projectPath}/${projectName}/dist/** -Dsonar.language=js -Dsonar.javascript.file.suffixes=.vue,.js -Dsonar.analysis.date=2025-04-11'
                            sh 'echo 代码扫描完成'
                            sh 'sleep 5'
                            sh 'echo 开始确认代码扫描结果'
                            // 执行命令并获取输出
                            def commandOutput = sh(
                                script: "curl -s -u sqa_6c6e7c4f7cc5012b07df283ad05b5c619e31cd11: http://localhost:9000/api/qualitygates/project_status?projectKey=${projectName} | jq -r '.projectStatus.status'",
                                returnStdout: true
                            ).trim()
                
                            // 解析结果
                            def SCAN_RES = commandOutput
                            sh "echo 代码扫描结果：${SCAN_RES}"
                            
                            if (SCAN_RES != "OK") {
                                error "代码质量扫描未通过，详情查看地址(账号:viewer 密码:jcjy123456)：http://182.92.171.35:9000/dashboard?id=${projectName}" 
                            }
                            sh 'echo 确认代码扫描结果通过'
                        }
                    }
                }
            }
    ```

* 按照git最新提交记录的增量式扫描配置如下：

  ```groovy
         stage('代码扫描') {
              steps {
                  script {
                      if (rollbackFlag == "true") {
                          sh 'echo 回滚操作，跳过拉取代码'
                      } else {
                          sh 'echo 代码扫描'
                          // git最近一次提交的文件
                          def changedFiles = sh(script: "cd ${projectPath}/${projectName} && git diff --name-only HEAD~1 HEAD | xargs -I{} realpath {}", returnStdout: true).trim()
                          def inclusions = changedFiles.replace('\n', ',')
                          // 使用双引号让变量插值生效
                          sh "echo 本次Git提交增量的文件为：${inclusions}"
                          sh "cd ${projectPath}/${projectName} && /opt/sonar/sonar-scanner/bin/sonar-scanner -Dsonar.host.url=http://localhost:9000 -Dsonar.login=sqa_6c6e7c4f7cc5012b07df283ad05b5c619e31cd11 -Dsonar.sources=${projectPath}/${projectName}/src -Dsonar.projectKey=${projectName} -Dsonar.projectName=${projectName} -Dsonar.inclusions=${inclusions} -Dsonar.exclusions=${projectPath}/${projectName}/node_modules/**,${projectPath}/${projectName}/dist/** -Dsonar.language=js -Dsonar.javascript.file.suffixes=.vue,.js -Dsonar.analysis.date=2025-04-11"
                          sh 'echo 代码扫描完成'
                          sh 'sleep 5'
                          sh 'echo 开始确认代码扫描结果'
                          // 执行命令并获取输出
                          def commandOutput = sh(
                              script: "curl -s -u sqa_6c6e7c4f7cc5012b07df283ad05b5c619e31cd11: http://localhost:9000/api/qualitygates/project_status?projectKey=${projectName} | jq -r '.projectStatus.status'",
                              returnStdout: true
                          ).trim()
              
                          // 解析结果
                          def SCAN_RES = commandOutput
                          sh "echo 代码扫描结果：${SCAN_RES}"
                          
                          if (SCAN_RES != "OK") {
                              error "代码质量扫描未通过，详情查看地址(账号:viewer 密码:jcjy123456)：http://182.92.171.35:9000/dashboard?id=${projectName}" 
                          }
                          sh 'echo 确认代码扫描结果通过'
                      }
                  }
              }
          }
  ```

  

## php环境

### 一、起步操作

查询系统版本、系统内核

```bash
cat /etc/redhat-release
cat /proc/version
```

### 二、搭建Apache

1.安装Apache

```bash
yum install -y httpd
```

2.启动Apache服务

```bash
systemctl start httpd.service
systemctl status httpd.service
```

3.设置开机启动服务

```bash
systemclt enable httpd.service
```

4.开放防火墙的80端口（直接关闭防火墙在云服务器上打开安全组端口）

```bash
firewall-cmd --zone=public --add-port=80/tcp --permanent
firewall-cmd --reload
firewall-cmd --list-ports
```

5.Apache测试（在浏览器输入ip访问即可）

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250506152217.png)

### 三、搭建Mysql

1. Yum仓库下载mysql

```bash
yum localinstall https://repo.mysql.com//mysql80-community-release-el7-1.noarch.rpm
```

2.Yum安装mysql

```bash
yum install mysql-community-server
```

3.启动mysql服务

```bash
service mysqld start
service mysqld status
```

4.查看初始密码、设置mysql密码

```bash
grep 'temporary password' /var/log/mysqld.log
mysql -u root -p
```

使用初始化密码登录后必须设置一个自己的密码，否则不能进行其他操作。设置密码的策略组是默认的必须包含大小写字符、数字、特殊字符且大于8位(可以通过修改密码策略等级来允许配置简单密码，这个自己bing吧)。

5.开放防火墙3306端口

6.登录mysql，进入mysql数据库设置允许远程访问

```bash
alter user 'root'@'localhost' identified with mysql_native_password by '123456';
```

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250506152317.png)

### 四、搭建Php

1.yum安装php

```bash
yum -y install php
```

2.重启Apache服务器。

```bash
systemctl restart httpd
```

3.安装php的扩展，安装完成之后也需要重启Apache服务器

```bash
yum -y install php-gd php-ldap php-odbc php-pear php-xml php-xmlrpc php-mbstring php-snmp php-soap curl curl-devel
```

五、测试
1.在/var/www/html目录下创建index.php文件，并在其中添加一下代码保存。

```php
<?php
phpinfo();
?>
```

2.使用浏览器访问ip，出现以下界面表示成功。

![image-20250506152406379](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250506152407.png)

注：

```bash
cd /var/www/html
ls -la
chomd -R 777 ./					//修改文件夹权限
```



php版本升级到7.3版本：https://www.oryoy.com/news/centos-xi-tong-xia-sheng-ji-php-zhi-te-ding-ban-ben-hao-de-xiang-xi-bu-zhou-yu-zhu-yi-shi-xiang.html

![image-20250508112545232](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250508112555.png)





