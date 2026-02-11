---
title: 03-SpringMVC 文件上传下载
date: 2018-6-20 19:59:44
tags:
- SpringMVC
categories: 
- 08_框架技术
- 03_SpringMVC
---





![image-20200620175456961](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200620175458.png)

参考资料：https://spring-mvc.linesh.tw/



### 1. SpringMVC 文件上传与下载

SpringMVC 框架提供了 `MultipartFile` 对象，该对象表示上传的文件，要求变量名称必须和表单 file 标签的
name属性名称相同。

![文件上传](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200623082811.jpg)

1. 在 pom.xml 文件中导入依赖 `commons-fileupload`

```xml
<!--commons-fileupload 中包含了 commons-io 的jar包，导入1个即可-->
<dependency>
    <groupId>commons-fileupload</groupId>
    <artifactId>commons-fileupload</artifactId>
    <version>1.4</version>
</dependency>

<!-- 可不导入 -->
<dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.5</version>
</dependency>
```
2. 在 springmvc.xml 中配置**文件解析器对象**，`id 名称必须为：multipartResolver`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/mvc
        http://www.springframework.org/schema/mvc/spring-mvc.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">

    <!--开启注解扫描-->
    <context:component-scan base-package="com.demo"/>

    <!--视图解析对象-->
    <bean id="internalResourceViewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/jsp"/>
    </bean>

    <!--开启SpringMVC框架注解支持-->
    <mvc:annotation-driven />

    <!--不拦截所有静态资源-->
    <mvc:default-servlet-handler/>

    <!--配置文件解析器对象-->
    <bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
        <property name="maxUploadSize" value="50000000"/>
    </bean>

</beans>
```
3. 创建 jsp 页面 `post + multipart/form-data`

```xml
<!-- upload.jsp -->
<form action="user/fileupload" method="post" enctype="multipart/form-data">
        选择文件：<input type="file" name="upload" /><br/>
        <input type="submit" value="上传" />
</form>

<!-- show.jsp -->
<img src="http://localhost:8081/uploadfile/images/${filename}">
```
4. 编写测试方法

准备工作：图片服务器要开着。

```java
@Controller
@RequestMapping("/img")
public class ImgController {
	@RequestMapping("/upload")
    public String upload(MultipartFile upload) throws Exception {
        System.out.println("springmvc文件上传...");

        // 使用fileupload组件完成文件上传
        // 上传的位置
        String path = "G:/upload";
        // 判断，该路径是否存在
        File file = new File(path);
        if(!file.exists()){
            // 创建该文件夹
            file.mkdirs();
        }

        // 说明上传文件项
        // 获取上传文件的名称
        String filename = upload.getOriginalFilename();
        // 把文件的名称设置唯一值，uuid
        String uuid = UUID.randomUUID().toString().replace("-", "");
        filename = uuid+"_"+filename;
        // 完成文件上传
        upload.transferTo(new File(path,filename));

        return "success";
    }
    
	// 下载
    @RequestMapping("download")
    public void download(String fileName, HttpServletResponse response)throws Exception{
        File file = new File("D:\\server\\apache-tomcat-8.5.31\\webapps\\upload\\"+fileName);
        //设置以下载方式打开文件
        response.setHeader("Content-Disposition", "attachment; filename="+file.getName());

        FileInputStream in = new FileInputStream(file);
        byte[] buf = new byte[1024];
        int len = 0;

        //把图片内容写出到浏览器
        while( (len=in.read(buf))!=-1 ){
            response.getOutputStream().write(buf, 0, len);
        }
    }
}
```

