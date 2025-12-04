---
title: 01-HTTP协议
date: 2017-4-28 22:23:58
tags:
- HTTP
- 协议
categories: 
- 04_大前端
- 06_HTTP
---

协议：两个设备进行数据交换的约定。
HTTP协议：超文本(字符/音频/视频/图片)传输协议，`基于TCP协议`。

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142315.png)
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142321.png)
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142326.png)

![20190703104551896-HTTP协议](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200807083038.png)

### 1. HTTP 请求报文(图)

HTTP `请求数据` - 抓包中核心内容：
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142334.png)
HTTP `请求报文`的原始细节：
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142339.jpg)

### 2. HTTP 响应报文(图)
HTTP `响应数据` - 抓包中的核心内容：
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142345.png)
HTTP `响应报文`的原始细节：
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142352.jpg)

### 3. HTTP 请求-响应执行流程
1. 发起请求（`GET`/`POST`）
2. 域名解析
     本地域名解析(C:\Windows\System32\drivers\etc\hosts)
     互联网域名解析(DNS)
3. 执行请求
4. 响应请求

### 4. GET 与 POST 请求的区别
● GET 只能传递`1kb以下`的数据；POST 可以传递`大数据`
● GET 请求参数会直接`拼接到Request URL上`(&)；POST 请求参数是在`请求正文中，更安全`
● GET 主要用于`获取/查询`数据；POST 主要用于`更新`数据/`上传文件`

GET 与 POST 详细区别：

**1、发送的数据数量**

在 GET 中，只能发送有限数量的数据，因为数据是在 URL 中发送的。

在 POST 中，可以发送大量的数据，因为数据是在正文主体中发送的。

**2、安全性**

GET 方法发送的数据不受保护，因为数据在 URL 栏中公开，这增加了漏洞和黑客攻击的风险。

POST 方法发送的数据是安全的，因为数据未在 URL 栏中公开，还可以在其中使用多种编码技术，这使其具有弹性。

**3、加入书签中**

GET 查询的结果可以加入书签中，因为它以 URL 的形式存在；而 POST 查询的结果无法加入书签中。

**4、编码**

在表单中使用 GET 方法时，数据类型中只接受 ASCII 字符。

在表单提交时，POST 方法不绑定表单数据类型，并允许二进制和 ASCII 字符。

**5、可变大小**

GET 方法中的可变大小约为 2000 个字符。

POST 方法最多允许 8 Mb 的可变大小。

**6、缓存**

GET 方法的数据是可缓存的，而 POST 方法的数据是无法缓存的。

**7、主要作用**

GET 方法主要用于获取信息。而 POST 方法主要用于更新数据。



### 5. 常用响应状态码
`200`：服务器响应成功
`302`：页面重定向
`304`：页面无变化，无需重新请求服务器
`404`：没有对应的服务器资源
`500`：服务器内部错误
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142359.png)