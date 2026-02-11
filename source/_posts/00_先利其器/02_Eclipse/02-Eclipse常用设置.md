---
title: 02-Eclipse常用设置
date: 2016-4-28 21:36:36
tags: 
- Eclipse
- 设置
categories: 
- 00_先利其器
- 02_Eclipse
---

### 1. 设置字体

![image-20200528002856558](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9qeS1pbWdzLm9zcy1jbi1iZWlqaW5nLmFsaXl1bmNzLmNvbS9pbWcvaW1hZ2UtMjAyMDA1MjgwMDI4NTY1NTgucG5n?x-oss-process=image/format,png)



![image-20200528002928773](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9qeS1pbWdzLm9zcy1jbi1iZWlqaW5nLmFsaXl1bmNzLmNvbS9pbWcvaW1hZ2UtMjAyMDA1MjgwMDI5Mjg3NzMucG5n?x-oss-process=image/format,png)

### 2. 设置护眼色

![image-20200528003250545](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9qeS1pbWdzLm9zcy1jbi1iZWlqaW5nLmFsaXl1bmNzLmNvbS9pbWcvaW1hZ2UtMjAyMDA1MjgwMDMyNTA1NDUucG5n?x-oss-process=image/format,png)

### 3. 设置自动补全

26字母和"."均会提示：

![03-Eclipse自动提示-全字母](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9qeS1pbWdzLm9zcy1jbi1iZWlqaW5nLmFsaXl1bmNzLmNvbS9pbWcvMDMtRWNsaXBzZSVFOCU4NyVBQSVFNSU4QSVBOCVFNiU4RiU5MCVFNyVBNCVCQS0lRTUlODUlQTglRTUlQUQlOTclRTYlQUYlOEQuanBn?x-oss-process=image/format,png)

Java 和 Java 类型补全建议 + 26字母`异常强大`的补全提示：

![03-Eclipse自动补全-高级](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9qeS1pbWdzLm9zcy1jbi1iZWlqaW5nLmFsaXl1bmNzLmNvbS9pbWcvMDMtRWNsaXBzZSVFOCU4NyVBQSVFNSU4QSVBOCVFOCVBMSVBNSVFNSU4NSVBOC0lRTklQUIlOTglRTclQkElQTcuanBn?x-oss-process=image/format,png)



### 4. 快捷键修改-同IDEA

自动修复：Quick Fix [Ctrl+1] >> 搜索并设置 `Alt+Enter` (取消另外两个 Alt+Enter)

自动对齐：Editing Java Source [Ctrl + Shift + F] >> 搜索并设置 `Ctrl + Alt + L`



### 5. 配置 Tomcat 服务器

![配置Tomcat服务器-01](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9qeS1pbWdzLm9zcy1jbi1iZWlqaW5nLmFsaXl1bmNzLmNvbS9pbWcvJUU5JTg1JThEJUU3JUJEJUFFVG9tY2F0JUU2JTlDJThEJUU1JThBJUExJUU1JTk5JUE4LTAxLnBuZw?x-oss-process=image/format,png)

![配置Tomcat服务器-02](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9qeS1pbWdzLm9zcy1jbi1iZWlqaW5nLmFsaXl1bmNzLmNvbS9pbWcvJUU5JTg1JThEJUU3JUJEJUFFVG9tY2F0JUU2JTlDJThEJUU1JThBJUExJUU1JTk5JUE4LTAyLnBuZw?x-oss-process=image/format,png)

![配置Tomcat服务器-03](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9qeS1pbWdzLm9zcy1jbi1iZWlqaW5nLmFsaXl1bmNzLmNvbS9pbWcvJUU5JTg1JThEJUU3JUJEJUFFVG9tY2F0JUU2JTlDJThEJUU1JThBJUExJUU1JTk5JUE4LTAzLnBuZw?x-oss-process=image/format,png)



### 6. 新建 JSP File 默认配置

* **默认 JSP 编码方式修改**

![02-JSP创建时默认编码设置](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9qeS1pbWdzLm9zcy1jbi1iZWlqaW5nLmFsaXl1bmNzLmNvbS9pbWcvMDItSlNQJUU1JTg4JTlCJUU1JUJCJUJBJUU2JTk3JUI2JUU5JUJCJTk4JUU4JUFFJUE0JUU3JUJDJTk2JUU3JUEwJTgxJUU4JUFFJUJFJUU3JUJEJUFFLnBuZw?x-oss-process=image/format,png)



* **默认新建 JSP file 时消除 HTML 5 中废弃标签的警告**

![image-20200528160244871](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200528160244871.png)

模板如下：

```html
<%@ page language="java" contentType="text/html; charset=${encoding}"
    pageEncoding="${encoding}"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<!-- <meta charset="UTF-8"> -->
<title>Insert title here</title>
</head>
<body>
${cursor}
</body>
</html>
```



### 7. 无法导包解决方案

![在这里插入图片描述](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9qeS1pbWdzLm9zcy1jbi1iZWlqaW5nLmFsaXl1bmNzLmNvbS9pbWcvMDEtRWNsaXBzZSVFNiU5NyVBMCVFNiVCMyU5NSVFNSVBRiVCQyVFNSU4QyU4NSVFOCVBNyVBMyVFNSU4NiVCMyVFNiU5NiVCOSVFNiVBMSU4OCUyOCVFOSVBMSVCOSVFNyU5QiVBRS0lRTUlOEYlQjMlRTklOTQlQUUtJUU1JUIxJTlFJUU2JTgwJUE3JTI5LnBuZw?x-oss-process=image/format,png)