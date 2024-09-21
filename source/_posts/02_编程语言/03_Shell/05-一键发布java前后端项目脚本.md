---
title: 05-一键发布java前后端项目脚本
date: 2024-1-3 17:51:34
tags:
- shell
- 语法
categories: 
- 02_编程语言
- 03_Shell
---

> 以发布一个PC官网前后端项目为例。

# 后端

## 1. 代码和编译

### 目录结构

```bash
/root/java-project/
├── copy-jar-to-test-pc.sh
├── package-pc.sh
├── pull-test-pc.sh
├── run-test-pc.sh
└── dir-git-code-project     #目录：直接在当前 java-project/ 目录下 clone 下来项目的代码目录
```

### 脚本实现

copy-jar-to-test-pc.sh

```bash
#!/bin/sh

echo copy-jar-to-test-pc
echo copy doing
cp -f xxx-zuhu/ruoyi-pc/target/xxx-pc-*.jar ../xxx-pc-test/jars
echo copy done
```

package-pc.sh

```bash
#!/bin/sh

echo xxx-zuhu
cd xxx-zuhu
echo package doing
mvn clean package --settings /root/maven/maven-settings.xml -Dmaven.test.skip=true
if [ $? != 0 ]; then
    echo "mvn 打包出错，请检查！"
	exit 1
fi
echo package done
cd ..
```

pull-test-pc.sh

```bash
#!/bin/sh

echo xxx-zuhu
cd xxx-zuhu
echo pull doing
git checkout test
git pull
echo pull done

#用于git回显最近3条提交记录
gitLogTop3=`git log -3 --pretty=format:'%ad[%an]: %s\\n' --date=iso | sed 's/\([[:space:]]\+\)\([+-]\)\([0-9]\{4\}\)//'`
echo $gitLogTop3 > /tmp/.gitLogTop3-pc-test-jar

cd ..
```

run-test-pc.sh

```bash
#!/bin/sh

echo pull...
./pull-test-pc.sh
echo pull...over
echo package...
./package-pc.sh
if [ $? != 0 ]; then
    echo "package-pc.sh 构建出错，请检查！"
	exit 1
fi
echo package...over
echo copy...
./copy-jar-to-test-pc.sh
echo copy...over
```



## 2. 备份和发布

### 目录结构

```bash
/root/xxx-pc-test/
├── 808x                 #目录: 端口号
│   ├── logs             #目录: 后端日志目录
│   │   ├── xxx-pc.log
│   │   ├── xxx-error.log
│   │   ├── xxx-info.log
│   │   └── xxx-user.log
│   ├── pid              #文件: 进程启动的pid
│   ├── shutdown.sh
│   ├── startup.sh
│   └── xxx-pc-1.0.0.jar
├── jars                 #目录: 本次发布打包的jar包
│   └── xxx-pc-1.0.0.jar
├── jars-backup          #目录: 备份最近的2个jar包，子目录为日期-时间
│   ├── 20240114-101156
│   │   └── xxx-pc-1.0.0.jar
│   ├── 20240114-110731
│   │   └── xxx-pc-1.0.0.jar
│   └── latest-vid       #文件: 本次发布备份的jar包目录名字，eg: 20240114-110731，为随时回滚用于读取
├── backupjars.sh
├── releasejars.sh
├── rollbackjars.sh
├── run-jars-rb.sh
├── run-jars.sh
├── shutdown.sh
└── startup.sh
```

### 脚本实现

808x/startup.sh

```bash
#!/bin/sh

nohup java -server -Xms512m -Xmx512m -Dspring.profiles.active=$profile -Dserver.port=$port -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp/xxx-pc-test-heapdump.hprof -jar ./*.jar > /root/xxx-pc-test/$port/logs/xxx-pc.log 2>&1 &
echo "$!" > pid
```

808x/shutdown.sh

```bash
#!/bin/sh

kill -9 `cat pid`
```

backupjars.sh

```bash
#!/bin/sh

datetime=`date +%Y%m%d-%H%M%S`
echo $datetime > ./jars-backup/latest-vid
mkdir ./jars-backup/"$datetime"
cp -f ./"$port"/*.jar ./jars-backup/"$datetime"/

backup_dir=./jars-backup
move_oldest_backup() {
    dirs=($(ls -dt $backup_dir/*))

    keep_count=2

    if [ ${#dirs[@]} -gt $keep_count ]; then
        #只保留最新的两个备份，其余的全部转移到临时目录/tmp(可手动清理或服务器重启自动清理)
        for (( i=$keep_count+1; i<${#dirs[@]}; i++ )); do
            echo "Moving extra backup: ${dirs[$i]} -> /tmp/"
            mv ${dirs[$i]} /tmp/
            echo "Move success."
        done
		rm /tmp/*-* -rf
    fi
}
move_oldest_backup
```

releasejars.sh

```bash
#!/bin/sh
cp -f ./jars/*.jar ./"$port"/
```

rollbackjars.sh

```bash
#!/bin/sh

datetime=`cat ./jars-backup/latest-vid`
cp -f ./jars-backup/"$datetime"/*.jar ./"$port"/
```

run-jars-rb.sh

```bash
#!/bin/sh

export port=808x
export profile=test

echo shutdown...
./shutdown.sh

echo rollbackjars...
./rollbackjars.sh

echo startup...
./startup.sh
```

run-jars.sh

```bash
#!/bin/sh

export port=808x
export profile=test

echo shutdown...
./shutdown.sh

echo backupjars...
./backupjars.sh

echo releasejars...
./releasejars.sh

echo startup...
./startup.sh
```

shutdown.sh

```bash
#!/bin/sh
cd $port
./shutdown.sh
cd ../
```

startup.sh

```bash
#!/bin/sh
cd $port
./startup.sh
cd ../
```



# 前端

## 1. 代码和编译

### 目录结构

```bash
/root/web-project/
├── copy-pc-dist-to-test.sh
├── package-pc-test.sh
├── pull-pc-test.sh
├── run-pc-test.sh
└── dir-git-code-project     #目录：直接在当前 web-project/ 目录下 clone 下来项目的代码目录
```

### 脚本实现

copy-pc-dist-to-test.sh

```bash
#!/bin/sh

echo copy-pc-dist-to-test
echo remove-pc-test doing
rm -rf ../xxx-pc-test/front/pc/dist
echo remove-pc-test done
echo copy-pc-test doing
cp -rf online-school-front/dist ../xxx-pc-test/front/pc/
echo copy-pc-test done
```

package-pc-test.sh

```bash
#!/bin/sh

echo xxx-webpc
cd online-school-front
echo npm cache clean
npm cache clean --force
echo package-pc-test doing
if [[ $1 = "i" ]]; then
    echo package-pc-test npm i start
    npm i
fi
npm pack --max-old-space-size=300
npm run testbuild
if [ $? != 0 ]; then
    echo "npm 打包出错，请检查！"
	exit 1
fi
echo package-pc-test done
cd ..
```

pull-pc-test.sh

```bash
#!/bin/sh

echo xxx-webpc
cd online-school-front
echo pull-pc doing
git checkout test

#从远程仓库同步当前分支
git reset --hard origin/`git branch | grep "\*" | cut -d ' ' -f 2`

git pull
echo pull-pc done

#用于git回显最近3条提交记录
gitLogTop3=`git log -3 --pretty=format:'%ad[%an]: %s\\n' --date=iso | sed 's/\([[:space:]]\+\)\([+-]\)\([0-9]\{4\}\)//'`
echo $gitLogTop3 > /tmp/.gitLogTop3-pc-test-front

cd ..
```

run-pc-test.sh

```bash
#!/bin/sh

echo pull-pc...
./pull-pc-test.sh
echo pull-pc...over
echo package-pc...
if [[ $1 = "i" ]]; then
    echo package-pc need npm i...
	./package-pc-test.sh $1
else
	./package-pc-test.sh
fi
if [ $? != 0 ]; then
    echo "package-pc-test.sh 出错，请检查！"
	exit 1
fi
echo package-pc...over
echo copy-pc...
./copy-pc-dist-to-test.sh
echo copy-pc...over
```



## 2. 备份和发布

### 目录结构

```bash
/root/xxx-pc-test/
├── 808x                 #目录: 端口号
│   └── front
│       └── pc           #目录: 目录下的文件内容与dist中的内容完全一样
├── front                #目录: 本次发布打包的dist包（静态资源）
│   └── pc
│       └── dist
├── front-backup         #目录: 备份最近的2个dist包，子目录为日期-时间
│   └── pc
│       ├── 20240114-101156
│       ├── 20240114-110731
│       └── latest-vid   #文件: 本次发布备份的dist包目录名字，eg: 20240114-110731，为随时回滚用于读取
├── backuppc.sh
├── releasepc.sh
├── rollbackpc.sh
├── run-pc-rb.sh
└── run-pc.sh
```

### 脚本实现

backuppc.sh

```bash
#!/bin/sh

datetime=`date +%Y%m%d-%H%M%S`
echo $datetime > ./front-backup/pc/latest-vid
mkdir ./front-backup/pc/"$datetime"
cp -rf ./"$port"/front/pc ./front-backup/pc/"$datetime"/dist

backup_dir=./front-backup/pc/
move_oldest_backup() {
    dirs=($(ls -dt $backup_dir/*))

    keep_count=2

    if [ ${#dirs[@]} -gt $keep_count ]; then
        #只保留最新的两个备份，其余的全部转移到临时目录/tmp(可手动清理或服务器重启自动清理)
        for (( i=$keep_count+1; i<${#dirs[@]}; i++ )); do
            echo "Moving extra backup: ${dirs[$i]} -> /tmp/"
            mv ${dirs[$i]} /tmp/
            echo "Move success."
        done
        rm /tmp/*-* -rf
    fi
}

move_oldest_backup
```

releasepc.sh

```bash
#!/bin/sh

rm -rf ./"$port"/front/pc
cp -rf ./front/pc/dist ./"$port"/front/pc
```

rollbackpc.sh

```bash
#!/bin/sh

datetime=`cat ./front-backup/pc/latest-vid`
rm -rf ./"$port"/front/pc
cp -rf ./front-backup/pc/"$datetime"/dist ./"$port"/front/pc
```

run-pc-rb.sh

```bash
#!/bin/sh

export port=808x

echo rollbackpc...
./rollbackpc.sh
```

run-pc.sh

```bash
#!/bin/sh

export port=808x

echo backuppc...
./backuppc.sh

echo releasepc...
./releasepc.sh
```



# .release.sh

```bash
#!/bin/sh

#声明关联数组
declare -A terminal 
terminal["pc"]="PC端"
terminal["h5"]="h5端"

declare -A jar_or_front
jar_or_front["jar"]="后端服务"
jar_or_front["front"]="前端页面"


cmd_log() {
    echo "脚本：$1";
    echo "终端：$2";
    echo "环境：$3";
    echo "前后：$4";

    #三种情况：① rb i  ② rb  ③ i
    echo -n "回滚：";
    if [[ $5 = "rb" ]]; then echo "回滚发布"; else echo "不回滚发布"; fi
    echo -n "依赖：";
    if [[ $5 = "i" || $6 = "i" ]]; then echo "更新前端依赖包"; else echo "不更新前端依赖包"; fi
}

start_log() {
	project_path=/root/xxx-$1-$2/
    current_port=`cat ${project_path}run-jars.sh | grep 'port=' | cut -d '=' -f 2`
	log_file=${project_path}${current_port}/logs/xxx-$1-$2.log
	if [ ! -e "$log_file" ];then
		echo "[ERROR]日志文件不存在！！！请检查是否选错了发布端！ log_file="$log_file
		exit 1
	fi
	echo log_file:${log_file}
	echo .jar starting...

	#定义查找的字符串
	search_string="JVM running"
	#定义开始时间
	start_time=$(date +%s)
	#定义超时时间（3 分钟，以秒为单位）
	timeout=180

	while true; do
		#查找字符串所在的行号
		line_number=`grep -n "$search_string" $log_file | awk -F ':' '{print $1}'`
	    #如果找到了
	    if [ -n "$line_number" ]; then
			line_number=$((line_number + 10))
			#输出从第一行到找到的行的内容
			head -n $line_number $log_file
			break
		fi
		#如果未找到且未超时
		current_time=$(date +%s)
		elapsed_time=$((current_time - start_time))
		if [ $elapsed_time -lt $timeout ]; then
			sleep 5
		else
			#超时退出
			echo "[ERROR]Timeout. Could not find the string within 3 minutes. Project start failed!!!"
			exit 1 #jenkins会根据返回状态码非0而显示为 FAILURE
		fi
	done
}

#后端打包发布
release_jar() {
    #拉代码打包
    cd java-project/
    echo ./run-$2-$1.sh
    ./run-$2-$1.sh

    #到指定目录
    if [[ $1 = "pc" || $1 = "h5" ]]; then
        echo cd ../xxx-$1-$2/
        cd ../xxx-$1-$2/
    else
        echo "终端名称有误!"
    fi
    
    if [[ $3 = "rb" ]]; then
        #jar包回滚并重启
        echo ./run-jars-rb.sh
        ./run-jars-rb.sh
    else
        #备份jar包并重启
        echo ./run-jars.sh
        ./run-jars.sh
    fi

    #启动日志
	start_log $1 $2
}

static_check() {
	project_path=/root/xxx-$1-$2/
	current_port=`cat ${project_path}run-jars.sh | grep 'port=' | cut -d '=' -f 2`
	dist_dir=${project_path}${current_port}/front/$1/
	echo dist_dir:${dist_dir}

	if [ ! -d "$dist_dir" ]; then
		echo "[ERROR]Static dist not exists. Please check!!!"
		exit 1
	fi
}

#前端打包发布
release_front() {
    #拉代码打包
    cd web-project/
    echo ./run-$1-$2.sh
    #判断是否要更新依赖包: rb 与 i 均为可选参数
    #三种情况：① rb i  ② rb  ③ i
	if [[ $3 = "i" || $4 = "i" ]]; then
        ./run-$1-$2.sh i
	else
        ./run-$1-$2.sh
	fi

    #到指定目录
    if [[ $1 = "pc" || $1 = "h5" ]]; then
        echo cd ../xxx-$1-$2/
        cd ../xxx-$1-$2/
    else
        echo "终端名称有误!"
    fi
    
    if [[ $3 = "rb" ]]; then
        #前端回滚并发布
        echo ./run-$1-rb.sh
        ./run-$1-rb.sh
    else
        #备份前端并发布
        echo ./run-$1.sh
        ./run-$1.sh
    fi

	#检查资源
	static_check $1 $2
}

#推送群机器人消息
push_webhook_msg() {
    echo "push webhook msg."

	env_val=$2
	current=$1
	zd=${terminal[$1]}
	gitLog=`cat /tmp/.gitLogTop3-${current}-${env_val}-$3`
	nr=${jar_or_front[$3]}"\\n"$gitLog
	ip=`curl -s inet-ip.info`

	echo env_val=$env_val, current=$current, zd=$zd, ip=$ip, nr=$nr
	if [[ $env_val = "test" || $env_val = "pre" ]]; then
        # test pre
	    CURL_URL='https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxx'
    else
        # prod
		CURL_URL='https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxx'
	fi

	CURL_DATA=$(printf '{"msgtype": "markdown", "markdown": {"content": "<font color=\\\"warning\\\">xxx-%s-%s</font>发布完成，请相关同事注意。\\n>终端：<font color=\\\"comment\\\">%s</font>\\n>环境：<font color=\\\"info\\\">%s</font>\\n>主机：<font color=\\\"comment\\\">%s</font>\\n>内容：<font color=\\\"comment\\\">%s</font>"}}' "$current" "$env_val" "$zd" "$env_val" "$ip" "$nr")

	CURL_CMD="curl \"$CURL_URL\" -H \"Content-Type: application/json\" -d '$CURL_DATA'"
	echo "CURL_CMD="$CURL_CMD

	CURL_RES=$(eval $CURL_CMD) # 使用eval执行curl命令
	echo "CURL_RES="$CURL_RES
}

if [[ ($1 = "pc" || $1 = "h5") && ($2 = "test" || $2 = "pre" || $2 = "prod") ]]; then
    cmd_log $0 $1 $2 $3 $4 $5
    
    if [[ $3 = "jar" ]]; then
        release_$3 $1 $2 $4
    elif [[ $3 = "front" ]]; then
        release_$3 $1 $2 $4 $5
    else
        echo "前后端名称有误！"
    fi

    #等待10秒
	sleep 10
    #发送消息
    push_webhook_msg $1 $2 $3

    #执行结束
    echo
    echo "Success!"
    cd ~
else
    #使用说明
    echo "命令格式: ./release.sh 终端名 环境名 前后端 [回滚参]"
    echo "命令示例：./release.sh pc test jar rb i"
    echo "参数解释："
    echo "- 终端名：pc-${terminal['pc']}, h5-${terminal['h5']}"
    echo "- 环境名：test-测试环境, pre-预发布环境(内部测试), prod-生产环境"
    echo "- 前后端：jar-后端, front-前端"
    echo "- 回滚参：可选参数，rb-回滚并重启"
    echo "- 更新参：可选参数，i-即npm i更新安装前端依赖包"
fi
```

消息示例：

![image-20240920145453828](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240920145455.png)


# Jenkins

通过执行远程脚本命令跑编译和运行。

```bash
echo -e "\nStart...\n"

echo "服务器IP地址="${ipAddress}
echo "发布终端="${releaseTerminal}
echo "发布环境="${packageEnv}
echo "打包终端="${packageContent}
echo "是否回滚="${rollbackFlag}
echo "是否更新前端依赖包="${npmUpdateFlag}

#eg: ssh root@xxx.xxx.xxx.xxx "/root/.release.sh pc test jar"
release_cmd="ssh root@"${ipAddress}" \"source /etc/profile && /root/.release.sh "${releaseTerminal}" "${packageEnv}" "${packageContent}
#release_cmd="ssh root@"${ipAddress}" \"ifconfig"
if [[ ${rollbackFlag} = "true" ]]; then
	release_cmd=${release_cmd}" rb"
fi
if [[ ${npmUpdateFlag} = "true" ]]; then
	release_cmd=${release_cmd}" i"
fi
release_cmd=${release_cmd}"\""

#执行
eval ${release_cmd}

#exit
```




# Nginx

```nginx
#############################################################################################
    server {
        #listen 的端口号要与后端的端口号 808x 区分开
        listen               809x ssl;
        #自定义的二级域名 xxx
        server_name          xxx.domain.com;
        #域名服务如阿里云的域名的 ssl证书 中申请并下载 nginx 需要的证书文件，放在nginx/cert/目录下
        ssl_certificate      /root/nginx/cert/server.crt;
        ssl_certificate_key  /root/nginx/cert/server.key;

        #开启解压缩静态文件(若依需要的)
        gzip_static on;

        #默认根目录 / 会访问到的资源配置，配置访问到了 root 指定目录下的 index.html 文件
        location / {
            root /root/xxx-pc-test/808x/front/pc;
            try_files $uri $uri/ /index.html;
            index index.html index.htm;
        }

        #/webpc/ 为后端 context-path 的值
        location /webpc/ {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_hide_header X-Powered-By;
            proxy_hide_header Server;
            proxy_read_timeout 300;
            #后端在服务器本地 127.0.0.1 上的进程端口号，即拼接的是 jar 服务的启动端口号
            proxy_pass https://127.0.0.1:808x; 
        }
    }
#############################################################################################
```



























