---
title: 02-模拟FTP下载文件
date: 2016-4-28 22:08:09
tags:
- JavaSE
- FTP
- Socket
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 07_网络编程
---

>区别 字符流 与 字节流 各自的功能和过滤流的使用场景。

### Server 端 IO 流
```java
try {
	// 字符流：创建 Clinet/Server 交互输入输出字符流（收发字符串）
	BufferedReader br = new BufferedReader(new InputStreamReader(client.getInputStream(), "UTF-8"));
	PrintWriter pw = new PrintWriter(new OutputStreamWriter(client.getOutputStream(), "UTF-8"));

	// 从 Client 阻塞接收文件名
	String filename = br.readLine();

	// 字节流：创建文件的输入流(读)、客户端输出流(发送)
	BufferedInputStream bis = new BufferedInputStream(new FileInputStream(filename));
	BufferedOutputStream bos = new BufferedOutputStream(client.getOutputStream());

	// 判断目录下是否存在该文件
	if (checkFileExists(filename)) {
		System.out.println("文件存在，开始提供下载...");
		// 传输文件所有字节数据
		int data = 0;
		while ((data = bis.read()) >= 0) {
			bos.write(data);
		}
		bos.flush();
	} else {
		pw.println("文件不存在，请重新输入！");
		pw.flush();
	}

	bos.close();
	bis.close();
	pw.close();
	br.close();
} catch (Exception e) {
	e.printStackTrace();
}


	private boolean checkFileExists(String fn) {
		File[] files = new File(".").listFiles();
		for (File f : files) {
			if (f.getName().equals(fn)) {
				return true;
			}
		}
		return false;
	}
```

### Client 端 IO 流
```java
try {
	// 字符流：创建 Clinet/Server 交互输入输出流（收发字符串）
	BufferedReader br = new BufferedReader(new InputStreamReader(client.getInputStream(), "UTF-8"));
	PrintWriter pw = new PrintWriter(new OutputStreamWriter(client.getOutputStream(), "UTF-8"));

	// 发送文件名到服务器
	pw.println(filename);
	pw.flush();
	
	System.out.println("开始下载：" + filename);
	// 字节过滤流：创建文件输出流(写)、服务端输入流(接收)
	BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream("fromServer_" + filename));
	BufferedInputStream bis = new BufferedInputStream(client.getInputStream());
	
	// 读出文件所有字节数据，写入新命名的文件
	int data = 0;
	while ((data = bis.read()) >= 0) {
		bos.write(data);
	}
	System.out.println("下载完成...");
	
	bis.close();
	bos.close();
	br.close();
	pw.close();
} catch (Exception e) {
	e.printStackTrace();
}
```

### 运行结果示例
![image-20230316140703409](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316140704.png)