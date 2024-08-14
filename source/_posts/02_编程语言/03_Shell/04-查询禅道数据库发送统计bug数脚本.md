---
title: 04-查询禅道数据库发送统计bug数脚本
date: 2024-8-14 12:34:13
tags:
- shell
- 语法
categories: 
- 02_编程语言
- 03_Shell
---




### 脚本：查询禅道数据库发送统计bug数脚本

基于企业微信（钉钉、飞书同理）webhook，核心为查询远程数据库并处理输出内容：

```bash
#!/bin/sh

# 定义 MySQL 用户名、密码和数据库
HOST="127.0.0.1"     #可以为远程数据库地址
USER="root"
PASSWORD="password"
DATABASE="zentao"    #禅道数据库就叫这名

# 查询bug总数
SQL_COMMAND1="SELECT CONCAT(p.name, '：', u.realname, '-', count(b.id), ',') as 'bug总数：\\\\n'
    from zt_user u
      inner join zt_bug b on b.assignedTo = u.account
      inner join zt_product p on p.id = b.product
    where u.type = 'inside'    #内部员工
      and u.role = 'dev'       #研发
      and b.status = 'active'  #bug状态：激活
      and b.deleted = '0'      #未删除
      and p.status = 'normal'  #项目状态：正常
    group by u.realname, p.name
    order by p.name, count(b.id) desc;"

# 查询P1的bug数
SQL_COMMAND2="SELECT CONCAT(p.name, '：', u.realname, '-', count(b.id), ',') as '【P1】bug数：\\\\n'
    from zt_user u
      inner join zt_bug b on b.assignedTo = u.account
      inner join zt_product p on p.id = b.product
    where u.type = 'inside'    #内部员工
      and u.role = 'dev'       #研发
      and b.status = 'active'  #bug状态：激活
      and b.severity = 1       #严重等级：P1
      and b.deleted = '0'      #未删除
      and p.status = 'normal'  #项目状态：正常
    group by u.realname, p.name
    order by p.name, count(b.id) desc;"

# 使用 mysql 命令执行 SQL 并获取结果（本地有mysql命令就用本地的，没有就用禅道自带的/opt/zbox/bin/mysql）
RESULT1=$(/opt/zbox/bin/mysql -h $HOST -u $USER -p$PASSWORD $DATABASE -e "$SQL_COMMAND1")
RESULT2=$(/opt/zbox/bin/mysql -h $HOST -u $USER -p$PASSWORD $DATABASE -e "$SQL_COMMAND2")

echo $RESULT1 > /tmp/totalBugs
echo $RESULT2 > /tmp/p1Bugs

# 输出并确认结果
cat /tmp/totalBugs
echo
cat /tmp/p1Bugs

#企微部门群
CURL_URL='https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=a1b2c3'
#测试一下
#CURL_URL='https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=abc123'

#推送群机器人消息
push_webhook_msg() {
	currentDate=`date +%Y-%m-%d`
	totalBugs=`perl -pe 's/,/\\\\n/g' /tmp/totalBugs`
	echo 'totalBugs='$totalBugs
	p1Bugs=`perl -pe 's/,/\\\\n/g' /tmp/p1Bugs`
	echo 'p1Bugs='$p1Bugs

	CURL_DATA="{\"msgtype\": \"text\", \"text\": {\"content\": \"截止$currentDate >> bug统计：\\n  现$totalBugs \\n $p1Bugs\", \"mentioned_list\":[\"@all\"]}}"
	echo $CURL_DATA

	CURL_CMD="curl \"$CURL_URL\" -H \"Content-Type: application/json\" -d '$CURL_DATA'"
  echo $CURL_CMD

  CURL_RES=$(eval $CURL_CMD) # 使用eval执行curl命令
  echo $CURL_RES
}

push_webhook_msg

exit 0

```

把脚本加到计划任务就可以了：

```shell
# crontab -e
0 9 * * 1-6 /root/.notice/bug-notice.sh
```

> 每周的周1~周6上午9点执行一次脚本。

效果展示：
![image-20240814100143795](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240814100146.png)