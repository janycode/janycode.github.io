---
title: 01-Socket网络编程
date: 2016-4-28 22:08:09
tags:
- JavaSE
- 网络
- Socket
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 07_网络编程
---

### 1. InetAddress类

位置：java.net

* 构造方法为默认default（包内可见），通过类内静态方法获取对象

常用方法：

```java
byte[] getAddress()
返回此 InetAddress对象的原始IP地址。
static InetAddress[] getAllByName(String host)
给定主机的名称，根据系统上配置的名称服务返回其IP地址数组。
static InetAddress getByAddress(byte[] addr)
给出原始IP地址的 InetAddress对象。
static InetAddress getByAddress(String host, byte[] addr)
根据提供的主机名和IP地址创建InetAddress。
static InetAddress getByName(String host)
确定主机名称的IP地址。
String getCanonicalHostName()
获取此IP地址的完全限定域名。
String getHostAddress()
返回文本显示中的IP地址字符串。
String getHostName()
获取此IP地址的主机名。
static InetAddress getLocalHost()
返回本地主机的地址。
static InetAddress getLoopbackAddress()
返回回送地址。
```

实例演示：
```java
import java.net.InetAddress;
import java.net.UnknownHostException;
public class TestInetAddress {
      public static void main(String[] args) throws  UnknownHostException {
            InetAddress local = InetAddress.getLocalHost();
            
            System.out.println(local); // 计算机名/ip地址
            String ip = local.getHostAddress(); //  Jan-Y480/192.168.31.129
            String name = local.getHostName();
            System.out.println(ip + " " + name); // 192.168.31.129  Jan-Y480
            
            InetAddress local1 = InetAddress.getByName("www.baidu.com");
            InetAddress mybook = InetAddress.getByName("jan-machenike");
            System.out.println(local1); // www.baidu.com/220.181.38.150
            System.out.println(mybook); // jan-machenike/192.168.31.244
            
            InetAddress[] address =  InetAddress.getAllByName("www.baidu.com");
            for (InetAddress inetAddress : address) {
                  System.out.println(inetAddress.getHostAddress()); //  220.181.38.150 220.181.38.149
            }
      }
}
class MyClass {
      static int count = 0;
      private MyClass() {}
      public static MyClass getMyClass() {
            if (count == 3) {
                  System.out.println("不能再创建对象了...");
                  return null;
            }
            count++;
            return new MyClass();
      }
}
```

### 2. Socket类 & ServerSocket类
![image-20230316140646555](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316140647.png)
网络通信步骤：
① 建立通信连接（会话）

* 创建ServerSocket，指定端口号；
* 调用accept等待客户端接入；
② 客户端请求服务器
* 创建Socket，指定服务器IP + 端口号；
* 使用字节输出流，发送请求数据给服务器；
* 使用字节输入流，接收响应数据到客户端（等待）；
③ 服务器响应客户端
* 使用字节输入流，接收请求数据到服务器（等待）；
* 使用字节输出流，发送响应数据到客户端。



```java
//Server.java
/**
* 服务端 提供注册 接收客户端发送的数据：zhangsan#123 保存在properties
*/
public class Server {
    private Properties userPros;


    public Server() {
        userPros = new Properties();
        File file = new File("files\\userPros.properties");
        if (file.exists()) {
            try {
                // 把文件的内容加载到properties集合中
                userPros.load(new FileReader(file));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }


    public void registerUser() {
        try {
            // 1.创建服务端
            @SuppressWarnings("resource")
            ServerSocket server = new ServerSocket(9999);
            System.out.println("服务端启动...");
            // 2.接收客户端
            Socket client = server.accept();
            // 3.输入流、输出流
            BufferedReader br = new BufferedReader(new InputStreamReader(client.getInputStream(), "UTF-8"));
            PrintWriter pw = new PrintWriter(new OutputStreamWriter(client.getOutputStream(), "UTF-8"));
            // 4.接收数据：zhangsan#123
            String[] userInfo = br.readLine().split("#");
            String username = userInfo[0];
            String password = userInfo[1];
            // 对用户名做判断
            if (userPros.containsKey(username)) {
                pw.println("用户名已存在，请重新注册！");
                pw.flush();
            } else {
                // 不存在，先存到userPros集合里，再存到文件里
                userPros.setProperty(username, password);
                // 将集合加载到文件中去
                userPros.store(new FileWriter("files\\UserPros.properties"), "用户信息");
                pw.println("注册成功!");
                pw.flush();
            }
            br.close();
            pw.close();
            client.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

```java
//Start.java
public class Start {
      public static void main(String[] args) {
            Server server = new Server();
            server.registerUser();
      }
}
```

```java
//Client.java
/**
* 客户端
* 注册 & 登陆
*/
public class Client {
    public static void main(String[] args) throws Exception {
        // 1.连接服务器
        Socket client = new Socket("192.168.31.129", 9999);
        System.out.println("开始注册...");
        Scanner sc = new Scanner(System.in);
        System.out.print("请输入用户名：");
        String username = sc.next();
        System.out.print("请输入密码：");
        String password = sc.next();
        
        String userinfo = username + "#" + password;
        // 2.获得流
        BufferedReader br = new BufferedReader(new InputStreamReader(client.getInputStream(), "UTF-8"));
        PrintWriter pw = new PrintWriter(new OutputStreamWriter(client.getOutputStream(), "UTF-8"));
        
        // 3.提交用户信息
        pw.println(userinfo);
        pw.flush();
        
        // 4.接收服务器的结果
        String recvinfo = br.readLine();
        System.out.println(recvinfo);
        
        // 5.关闭
        client.close();
        sc.close();
        br.close();
        pw.close();
    }
}
```