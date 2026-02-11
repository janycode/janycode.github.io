---
title: 06-HTTPS协议
date: 2017-4-28 22:23:58
tags:
- HTTPS
- 协议
categories: 
- 04_大前端
- 01_HTML
---



* HTTPS协议工作流程 `443 端口`

![20190609230605501-HTTPS协议流程](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200807083116.png)



1. Client发起一个HTTPS（https:/demo.linianhui.dev）的`请求`，根据 RFC2818 的规定，Client知道需要连接Server的`443`（默认）端口。
2. Server把事先配置好的`公钥证书`（public key certificate）返回给客户端。
3. Client`验证公钥证书`：比如是否在有效期内，证书的用途是不是匹配Client请求的站点，是不是在CRL吊销列表里面，它的上一级证书是否有效，这是一个递归的过程，直到验证到根证书（操作系统内置的Root证书或者Client内置的Root证书）。如果验证通过则继续，不通过则显示警告信息。
4. Client使用伪随机数生成器生成加密所使用的`会话密钥`，然后用证书的公钥加密这个会话密钥，发给Server。
5. Server使用自己的`私钥（private key）解密`这个消息，得到会话密钥。至此，Client和Server双方都持有了相同的会话密钥。
6. Server使用`会话密钥加密“明文内容A”`，发送给Client。
7. Client使用`会话密钥解密响应的密文`，得到“明文内容A”。
8. Client再次发起HTTPS的请求，使用会话密钥加密请求的“明文内容B”，然后Server使用会话密钥解密密文，得到“明文内容B”。