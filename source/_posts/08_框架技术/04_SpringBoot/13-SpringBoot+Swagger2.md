---
title: 13_SpringBoot+Swagger2
date: 2018-6-20 17:59:44
tags:
- SpringBoot
- Swagger
categories: 
- 08_框架技术
- 04_SpringBoot
---

![image-20200708160944615](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708160946.png)

参考资料：https://www.springcloud.cc/spring-boot.html

中文文档2：https://felord.cn/_doc/_springboot/2.1.5.RELEASE/_book/index.html

![image-20200824013238704](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200824013240.png)



### 1. 依赖

`很重要`：因为区别于 springMVC 所以依赖的名字和版本要和 springMVC 区别开来

```xml
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2</version>
</dependency>
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>swagger-bootstrap-ui</artifactId>
    <version>1.9.6</version>
</dependency>
```



### 2. 配置类

```java
import com.github.xiaoymin.swaggerbootstrapui.annotations.EnableSwaggerBootstrapUI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * @Configuration和@WebAppConfiguration都可以使用 如果项目引入junit测试，此处需要使用@WebAppConfiguration；如果没有使用junit使用@Configuration
 * @WebAppConfiguration 这个ComponentScan配置没有用处
 * 通过限定要生成文档的controller是通过apis()和paths()控制的
 * @ComponentScan(basePackages = "com.demo.controller.api.goods") 扫描control
 */
@Configuration
@EnableSwagger2
//@EnableWebMvc  // springMVC 配 swagger 使用这个注解，对应 /doc.html
@EnableSwaggerBootstrapUI  // springBoot 配 swagger 使用这个注解，对应 /doc.html
public class SwaggerConfig {

    public static final String PROJECT_NAME = "xx信息登记系统后端";
    public static final String PROJECT_VERSION = "1.0.0";
    public static final String PROJECT_URL = "www.interview.com";

    public static final String SCAN_API_PACKAGE = "com.jerry.interview.controller";
    public static final String SCAN_API_PATH = "/**";

    public static final String CONTACT_NAME = "Jerry(姜源)";
    public static final String CONTACT_URL = PROJECT_URL;
    public static final String CONTACT_EMAIL = "interview@163.com";

    /**
     * apis():指定要生成文档的接口包基本路径, eg: 扫描所有路径资源 .apis(RequestHandlerSelectors.any())
     * paths():指定针对哪些请求生成接口文档, eg: 匹配所有请求接口 .paths(PathSelectors.any())
     * 参考官方资料：http://www.baeldung.com/swagger-2-documentation-for-spring-rest-api
     */
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage(SCAN_API_PACKAGE))
                .paths(PathSelectors.ant(SCAN_API_PATH))
                .build()
                .apiInfo(apiInfo());
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title(PROJECT_NAME + " 项目接口文档")
                .description(PROJECT_NAME + " API接口文档")
                .version(PROJECT_VERSION)
                .contact(new Contact(CONTACT_NAME, CONTACT_URL, CONTACT_EMAIL))
                .termsOfServiceUrl(CONTACT_URL)
                .license("")
                .licenseUrl("")
                .build();
    }
}
```

