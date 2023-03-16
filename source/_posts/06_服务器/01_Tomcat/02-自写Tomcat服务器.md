---
title: 02-自写Tomcat服务器
date: 2018-5-2 18:58:17
tags:
- Tomcat
categories: 
- 06_服务器
- 01_Tomcat
---

**核心操作：**

① socket解除阻塞时为新请求进入，使用`线程`解决多请求并发问题

② IO流的处理：客户端路径获取使用`字符流`，服务端响应给浏览器使用`字节流`

③ `响应行、响应头、响应正文`的处理(遵循HTTP协议)，使自写服务器可以正确被浏览器解析响应的内容



**源码示例：**

```java
public class MyTomcatServer {
    public static void main(String[] args) {
        try {
            ServerSocket serverSocket = new ServerSocket(8080);
            while (true) {
                // 没有请求时，阻塞这个代码，不会创建线程
                Socket socket = serverSocket.accept();
                // 每连接1个客户端创建1个线程，此处最好是用线程池合理分配资源
                new Thread(() -> service(socket)).start();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void service(Socket socket) {
        try {
            //处理请求行,获取访问资源的路径、转换流、封装成了高效字符流
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(socket.getInputStream()));

            //"GET /demo/index.html HTTP/1.1"
            //请求方式、请求路径、协议；其中，只有请求路径有用!
            String line = bufferedReader.readLine();
            String[] requestInfos = line.split(" ");
            String requestURL = requestInfos[1];
            System.out.println(requestURL);

            // 浏览器访问地址：http://localhost:8080/demo/index.html
            int length = "/demo/".length();
            // 获取请求资源的相对路径
            requestURL = requestURL.substring(length);

            //通过服务器将index.html响应给浏览器 ,  通过socket.getOutputStream();
            BufferedInputStream bis = new BufferedInputStream(new FileInputStream(requestURL));
            BufferedOutputStream bos = new BufferedOutputStream(socket.getOutputStream());

            //操作响应行 （协议、响应状态码）
            bos.write("HTTP/1.1 200 OK\r\n".getBytes());

            //操作响应头(Content-Type)
            bos.write("Content-Type:text/html\r\n".getBytes());
            bos.write("\r\n".getBytes());

            //操作响应正文
            int len = -1;
            byte[] bys = new byte[8192];
            while ((len = bis.read(bys)) != -1) {
                bos.write(bys, 0, len);
            }
            bis.close();
            bos.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

页面测试：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>主页</title>
</head>
<body>

<h2>首页</h2>

<img src="001.jpg" alt="图片1" width="300px">
<img src="002.jpg" alt="图片2" width="300px">

</body>
</html>
```
![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316153527.png)