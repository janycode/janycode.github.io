#! /bin/bash
#Author: Jerry(姜源)

#生成一次最新需要部署的页面
echo "生成一次最新需要部署的页面..."
hexo g
echo "生成完毕！"
echo

MYNUM=1
while [ $MYNUM -ne 0 ]
do
    echo "尝试第 $MYNUM 次部署，正在部署(请勿退出程序)..."
	RESULT=`hexo d`
	echo
	echo "[JERRY]RESULT="$RESULT
	FLAG=`echo $RESULT | grep "done"`
	#判断执行结果中是否包含执行成功的字符串
	if [[ "$FLAG" != "" ]]
	then
		break
	else
		echo "结果：第 $MYNUM 次部署失败！"
		MYNUM=$(($MYNUM + 1))
		echo
	fi
done

echo
echo "部署成功！！！"
echo
#echo "开始更新 local-search.xml 到阿里云OSS..."
#echo
#./oss.sh ./public/local-search.xml local-search.xml
#echo
#echo "更新成功！！！"