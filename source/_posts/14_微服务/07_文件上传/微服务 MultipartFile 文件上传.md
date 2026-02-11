---
title: 微服务 MultipartFile 文件上传
date: 2020-03-02 17:59:44
tags:
- 微服务
- 文件上传
categories: 
- 14_微服务
- 07_文件上传
---



![image-20200729130824878](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200729130826.png)



### 1. 原因

默认情况下，在SpringCloud Alibaba 微服务项目中，无法通过消费者服务直接将前端上传的文件，以请求的方式发送到服务提供者来操作文件上传的。

因此需要在 OpenFeign 中将 文件名称 和 文件内容的Base64 封装为类，消费者添加 consumes 文件上传参数。



### 2. 解决

#### 2.1 依赖

```xml
<!-- 文件上传基本依赖 -->
<dependency>
    <groupId>commons-fileupload</groupId>
    <artifactId>commons-fileupload</artifactId>
    <version>1.3.3</version>
</dependency>
<!-- feign对form表单文件上传支持的依赖jar包 -->
<dependency>
    <groupId>io.github.openfeign.form</groupId>
    <artifactId>feign-form</artifactId>
    <version>3.8.0</version>
</dependency>
```

#### 2.2 参数

消费者 OssService 接口(`@FeignClient`注解修饰不需要实现类)，

添加参数 `consumes = MediaType.MULTIPART_FORM_DATA_VALUE`

```java
import org.springframework.http.MediaType; // 如遇导包问题，直接CV

@FeignClient("jerryProvider")
public interface OssService {
    /**
     * 文件上传
     * consumes 注解参数，实际本质还是配置的文件上传项 "multipart/form-data"
     * @param file
     * @return
     */
    @PostMapping(value = "provider/oss/upload.do", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    R upload(MultipartFile file);
}
```

消费者控制器：

```java
@RestController
@RequestMapping("/api/oss/")
public class OssController {
    @Autowired
    private OssService service;

    /**
     * 上传普通文件
     */
    @PostMapping("upload.do")
    public R upload(@RequestPart MultipartFile file) {
        return service.upload(file);
    }
}
```

提供者控制器：

```java
@RestController
@RequestMapping("/provider/oss/")
public class OssController {
    @Autowired
    private OssService service;

    /**
     * 普通文件上传
     */
    @PostMapping("upload.do")
    public R upload(MultipartFile file) {
        return service.upload(file);
    }
}
```



#### 2.3 Feign 配置类

消费者中的配置类：`实现Feign对表单传输文件的支持`

```java
@Configuration
public class FeignMultipartSupportConfig {
    @Autowired
    private ObjectFactory<HttpMessageConverters> messageConverters;

    @Bean
    public Encoder multipartFormEncoder() {
        return new SpringFormEncoder(new SpringEncoder(messageConverters));
    }

    @Bean
    public feign.Logger.Level multipartLoggerLevel() {
        return feign.Logger.Level.FULL;
    }
}
```

#### 2.4 Feign配置超时时间

application.yml

```yaml
feign:
  client:
    config:
      default:
        connectTimeout: 10000 #设置连接的超时时间 10s
        readTimeout: 20000  #设置读取的超时时间 20s
```

