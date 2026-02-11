#!/bin/bash
#Author: Jerry(姜源)

readonly host="oss-cn-beijing.aliyuncs.com"
readonly bucket="jy-imgs"
readonly Id="LTAI4FyyynygqrNZYZdWfynN"
readonly Key="BGHgPN0hfEQYBJiqurvXM9tq8BQcYo"

readonly source=$1  #本地文件路径+名称，如 test.xml
readonly dest=$2    #OSS中的文件名称，如 test.xml
readonly ossHost=${bucket}.${host}
readonly date=$(date '+%Y-%m-%d')
readonly uploadLog=./oss_upload_${date}.log
readonly resultLog=./oss_upload_${date}_result.log

function info() {
    time=$(date '+%Y-%m-%d %H:%M:%S')
    #echo "[INFO][${time}] $1" >> ${uploadLog}
	echo "[INFO][${time}] $1"
}

function error() {
    time=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[ERROR][${time}] $1" >> ${uploadLog}
    info "================END================"
    exit 1
}

function checkPath() {
    # 校验上传目标路径
    info "start check path"
    if test -z "$source" || test -z "$dest"
    then
        error "no source or dest path"
    fi
    info "source: ${source}"
    info "dest: ${dest}"
    info "ossHost: ${ossHost}"
}


function checkResult() {
    if [ ! -f ${resultLog} ];then
        error "no found resultLog: ${resultLog}"
    fi
    count=$(cat ${resultLog}|grep '200 OK'|wc -l)
    if [ ${count} -ge 1 ];then
        costTime=$(cat ${resultLog}|grep 'x-oss-server-time'|awk '{print $NF}')
        info "UPLOAD SUCCESS, Cost Time: ${costTime}"
    else
        error "UPLOAD ERROR"
    fi
}

function upload() {
    method=PUT
    resource="/${bucket}/${dest}"
    contentType=`file -ib ${source} |awk -F ";" '{print $1}'`
    dateValue="`TZ=GMT env LANG=en_US.UTF-8 date +'%a, %d %b %Y %H:%M:%S GMT'`"
    stringToSign="${method}\n\n${contentType}\n${dateValue}\n${resource}"
    signature=`echo -en ${stringToSign} | openssl sha1 -hmac ${Key} -binary | base64`
    url=http://${ossHost}/${dest}

    info "stringToSign: ${stringToSign}"
    info "signature: ${signature}"
    info "upload ${source} to ${url}"

    curl -i -q -X PUT -T "${source}" -o ${resultLog} \
      -H "Host: ${ossHost}" \
      -H "Date: ${dateValue}" \
      -H "Content-Type: ${contentType}" \
      -H "Authorization: OSS ${Id}:${signature}" \
      ${url}
    checkResult
    info "Finished."
}

info "==============BEGIN=================="
checkPath
upload
info "================END================"
echo
echo "https://"$bucket"."$host"/"$dest
exit 0