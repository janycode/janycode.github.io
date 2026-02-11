---
title: 01-Swagger不同版本集成与聚合
date: 2022-04-06 21:38:52
tags:
- API
- Swagger
categories: 
- 15_分布式
- 00_Api文档
---

![image-20220406214732607](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220406214742.png)

参考资料(Swagger)：https://swagger.io/

参考资料(Knife4j)：https://doc.xiaominfo.com/



### 1. 官方Swagger UI

#### 1.1 访问效果

![image-20220406220100019](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220406220101.png)

#### 1.2 依赖

pom.xml

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!--Swagger 核心依赖-->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2</version>
</dependency>
<!--Swagger UI-->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>2.9.2</version>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```



#### 1.3 配置类

```java
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

@Configuration
@EnableSwagger2
public class SwaggerConfig {

    public static final String PROJECT_NAME = "TestSwagger";
    public static final String PROJECT_VERSION = "1.0.0";
    public static final String PROJECT_URL = "www.swaggertest.com";
    public static final String SCAN_API_PACKAGE = "com.jerry.swagger.controller";
    public static final String SCAN_API_PATH = "/**";
    public static final String CONTACT_NAME = "Jerry(姜源)";
    public static final String CONTACT_URL = PROJECT_URL;
    public static final String CONTACT_EMAIL = "swagger@163.com";

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



#### 1.4 配置文件

```yml
server:
  port: 8088
#解决Springboot启动报错Failed to start bean 'documentationPluginsBootstrapper'
spring:
  mvc:
    pathmatch:
      matching-strategy: ant_path_matcher
```



#### 1.5 测试接口

```java
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
@Api(tags = "测试接口")
public class TestController {

    @ApiOperation(value = "测试", notes = "测试")
    @PostMapping("/api")
    public String test() {
        return "OK";
    }
}
```



#### 1.6 访问路径

访问路径：/swagger-ui.html

接口json：/v2/api-docs



### 2. 美化BootStrap UI

#### 2.1 访问效果

![image-20220406220524190](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220406220525.png)

#### 2.2 依赖

pom.xml

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!--Swagger 核心依赖-->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2</version>
</dependency>
<!-- Swagger bootstrap UI -->
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>swagger-bootstrap-ui</artifactId>
    <version>1.9.6</version>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```



#### 2.3 配置类

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

@Configuration
@EnableSwagger2
@EnableSwaggerBootstrapUI  //springBoot 配 swagger 使用这个注解，对应 /doc.html
public class SwaggerConfig {

    public static final String PROJECT_NAME = "TestSwagger";
    public static final String PROJECT_VERSION = "1.0.0";
    public static final String PROJECT_URL = "www.swaggertest.com";
    public static final String SCAN_API_PACKAGE = "com.jerry.swagger.controller";
    public static final String SCAN_API_PATH = "/**";
    public static final String CONTACT_NAME = "Jerry(姜源)";
    public static final String CONTACT_URL = PROJECT_URL;
    public static final String CONTACT_EMAIL = "swagger@163.com";

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



#### 2.4 配置文件

```yml
server:
  port: 8088
#解决Springboot启动报错Failed to start bean 'documentationPluginsBootstrapper'
spring:
  mvc:
    pathmatch:
      matching-strategy: ant_path_matcher
```



#### 2.5 测试接口

```java
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
@Api(tags = "测试接口")
public class TestController {

    @ApiOperation(value = "测试", notes = "测试")
    @PostMapping("/api")
    public String test() {
        return "OK";
    }
}
```



#### 2.6 访问路径

访问路径：/doc.html

接口json：/v2/api-docs



### 3. 增强Knife4j

#### 3.1  访问效果

![image-20220406220948735](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220406220949.png)

#### 3.2 依赖

pom.xml

```xml
<!--Swagger 核心依赖-->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2</version>
</dependency>
<!--Knife4j UI-->
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>knife4j-spring-boot-starter</artifactId>
    <version>2.0.9</version>
</dependency>
```



#### 3.3 配置类

同2.3

#### 3.4 配置文件

同2.4

#### 3.5 测试接口

同2.5

#### 3.6 访问路径

访问路径：/doc.html

接口json：/v2/api-docs



### 4. 架构师集成Swagger

#### 4.1 访问效果

![image-20220406222024224](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220406222025.png)

以最新的 Knife4j 为例，使 swagger 可配置开关。

#### 4.2 依赖

pom.xml

```xml
<!--Swagger 核心依赖-->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2</version>
</dependency>
<!--Knife4j UI-->
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>knife4j-spring-boot-starter</artifactId>
    <version>2.0.9</version>
</dependency>
```



#### 4.3 自动配置类

SwaggerAutoConfiguration.java

```java
import com.google.common.base.Predicate;
import com.google.common.base.Predicates;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.*;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@EnableSwagger2
//proxyBeanMethods默认为true，指定@Bean注解的方法使用代理即从IOC中取对象，为false可以提高性能
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties({SwaggerProperties.class})
//matchIfMissing=true，没有该配置属性时也会正常加载；反之则不会生效
@ConditionalOnProperty(name = {"swagger.enabled"}, matchIfMissing = true)
@SuppressWarnings("all")
public class SwaggerAutoConfiguration {
    /**
     * 默认排除的路径
     */
    private static final List<String> DEFAULT_EXCLUDE_PATH = Arrays.asList("/error", "/actuator/**");
    private static final String BASE_PATH = "/**";

    public SwaggerAutoConfiguration() {
    }

    @Bean
    public Docket api(SwaggerProperties swaggerProperties) {
        if (swaggerProperties.getBasePath().isEmpty()) {
            swaggerProperties.getBasePath().add("/**");
        }

        List<Predicate<String>> basePath = new ArrayList();
        swaggerProperties.getBasePath().forEach((path) -> {
            basePath.add(PathSelectors.ant(path));
        });
        if (swaggerProperties.getExcludePath().isEmpty()) {
            swaggerProperties.getExcludePath().addAll(DEFAULT_EXCLUDE_PATH);
        }

        List<Predicate<String>> excludePath = new ArrayList();
        swaggerProperties.getExcludePath().forEach((path) -> {
            excludePath.add(PathSelectors.ant(path));
        });
        return (new Docket(DocumentationType.SWAGGER_2)).host(swaggerProperties.getHost())
                .apiInfo(this.apiInfo(swaggerProperties))
                .select()
                .apis(RequestHandlerSelectors.basePackage(swaggerProperties.getBasePackage()))
                .paths(Predicates.and(Predicates.not(Predicates.or(excludePath)), Predicates.or(basePath)))
                .build()
                .securitySchemes(Collections.singletonList(this.securitySchema(swaggerProperties)))
                .securityContexts(Collections.singletonList(this.securityContext(swaggerProperties)))
                .pathMapping("/");
    }

    private SecurityContext securityContext(SwaggerProperties swaggerProperties) {
        return SecurityContext.builder().securityReferences(this.defaultAuth(swaggerProperties))
                .forPaths(PathSelectors.regex(swaggerProperties.getAuthorization().getAuthRegex()))
                .build();
    }

    private List<SecurityReference> defaultAuth(SwaggerProperties swaggerProperties) {
        ArrayList<AuthorizationScope> authorizationScopeList = new ArrayList();
        swaggerProperties.getAuthorization().getAuthorizationScopeList().forEach((authorizationScope) -> {
            authorizationScopeList.add(new AuthorizationScope(authorizationScope.getScope(), authorizationScope.getDescription()));
        });
        AuthorizationScope[] authorizationScopes = new AuthorizationScope[authorizationScopeList.size()];
        return Collections.singletonList(SecurityReference.builder().reference(swaggerProperties.getAuthorization().getName())
                .scopes((AuthorizationScope[]) authorizationScopeList.toArray(authorizationScopes))
                .build()
        );
    }

    private OAuth securitySchema(SwaggerProperties swaggerProperties) {
        ArrayList<AuthorizationScope> authorizationScopeList = new ArrayList();
        swaggerProperties.getAuthorization().getAuthorizationScopeList().forEach((authorizationScope) -> {
            authorizationScopeList.add(new AuthorizationScope(authorizationScope.getScope(), authorizationScope.getDescription()));
        });
        ArrayList<GrantType> grantTypes = new ArrayList();
        swaggerProperties.getAuthorization().getTokenUrlList().forEach((tokenUrl) -> {
            grantTypes.add(new ResourceOwnerPasswordCredentialsGrant(tokenUrl));
        });
        return new OAuth(swaggerProperties.getAuthorization().getName(), authorizationScopeList, grantTypes);
    }

    private ApiInfo apiInfo(SwaggerProperties swaggerProperties) {
        return (new ApiInfoBuilder()).title(swaggerProperties.getTitle())
                .description(swaggerProperties.getDescription())
                .license(swaggerProperties.getLicense())
                .licenseUrl(swaggerProperties.getLicenseUrl())
                .termsOfServiceUrl(swaggerProperties.getTermsOfServiceUrl())
                .contact(new Contact(swaggerProperties.getContact().getName(), swaggerProperties.getContact().getUrl(), swaggerProperties.getContact().getEmail()))
                .version(swaggerProperties.getVersion())
                .build();
    }
}
```

#### 4.4 配置映射类

SwaggerProperties.java

```java
import java.util.ArrayList;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("swagger")
public class SwaggerProperties {
    private Boolean enabled;
    private String basePackage = "";
    private List<String> basePath = new ArrayList();
    private List<String> excludePath = new ArrayList();
    private String title = "";
    private String description = "";
    private String version = "";
    private String license = "";
    private String licenseUrl = "";
    private String termsOfServiceUrl = "";
    private String host = "";
    private SwaggerProperties.Contact contact = new SwaggerProperties.Contact();
    /** 给所有Api的请求头Header中附加 Authorization 参数，值默认为空 */
    private SwaggerProperties.Authorization authorization = new SwaggerProperties.Authorization();


    public SwaggerProperties() {
    }


    public Boolean getEnabled() {
        return this.enabled;
    }


    public String getBasePackage() {
        return this.basePackage;
    }


    public List<String> getBasePath() {
        return this.basePath;
    }


    public List<String> getExcludePath() {
        return this.excludePath;
    }


    public String getTitle() {
        return this.title;
    }


    public String getDescription() {
        return this.description;
    }


    public String getVersion() {
        return this.version;
    }


    public String getLicense() {
        return this.license;
    }


    public String getLicenseUrl() {
        return this.licenseUrl;
    }


    public String getTermsOfServiceUrl() {
        return this.termsOfServiceUrl;
    }


    public String getHost() {
        return this.host;
    }


    public SwaggerProperties.Contact getContact() {
        return this.contact;
    }


    public SwaggerProperties.Authorization getAuthorization() {
        return this.authorization;
    }


    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }


    public void setBasePackage(String basePackage) {
        this.basePackage = basePackage;
    }


    public void setBasePath(List<String> basePath) {
        this.basePath = basePath;
    }


    public void setExcludePath(List<String> excludePath) {
        this.excludePath = excludePath;
    }


    public void setTitle(String title) {
        this.title = title;
    }


    public void setDescription(String description) {
        this.description = description;
    }


    public void setVersion(String version) {
        this.version = version;
    }


    public void setLicense(String license) {
        this.license = license;
    }


    public void setLicenseUrl(String licenseUrl) {
        this.licenseUrl = licenseUrl;
    }


    public void setTermsOfServiceUrl(String termsOfServiceUrl) {
        this.termsOfServiceUrl = termsOfServiceUrl;
    }


    public void setHost(String host) {
        this.host = host;
    }


    public void setContact(SwaggerProperties.Contact contact) {
        this.contact = contact;
    }


    public void setAuthorization(SwaggerProperties.Authorization authorization) {
        this.authorization = authorization;
    }


    @Override
    public boolean equals(Object o) {
        if (o == this) {
            return true;
        } else if (!(o instanceof SwaggerProperties)) {
            return false;
        } else {
            SwaggerProperties other = (SwaggerProperties)o;
            if (!other.canEqual(this)) {
                return false;
            } else {
                label167: {
                    Object this$enabled = this.getEnabled();
                    Object other$enabled = other.getEnabled();
                    if (this$enabled == null) {
                        if (other$enabled == null) {
                            break label167;
                        }
                    } else if (this$enabled.equals(other$enabled)) {
                        break label167;
                    }


                    return false;
                }


                Object this$basePackage = this.getBasePackage();
                Object other$basePackage = other.getBasePackage();
                if (this$basePackage == null) {
                    if (other$basePackage != null) {
                        return false;
                    }
                } else if (!this$basePackage.equals(other$basePackage)) {
                    return false;
                }


                label153: {
                    Object this$basePath = this.getBasePath();
                    Object other$basePath = other.getBasePath();
                    if (this$basePath == null) {
                        if (other$basePath == null) {
                            break label153;
                        }
                    } else if (this$basePath.equals(other$basePath)) {
                        break label153;
                    }


                    return false;
                }


                Object this$excludePath = this.getExcludePath();
                Object other$excludePath = other.getExcludePath();
                if (this$excludePath == null) {
                    if (other$excludePath != null) {
                        return false;
                    }
                } else if (!this$excludePath.equals(other$excludePath)) {
                    return false;
                }


                label139: {
                    Object this$title = this.getTitle();
                    Object other$title = other.getTitle();
                    if (this$title == null) {
                        if (other$title == null) {
                            break label139;
                        }
                    } else if (this$title.equals(other$title)) {
                        break label139;
                    }


                    return false;
                }


                Object this$description = this.getDescription();
                Object other$description = other.getDescription();
                if (this$description == null) {
                    if (other$description != null) {
                        return false;
                    }
                } else if (!this$description.equals(other$description)) {
                    return false;
                }


                label125: {
                    Object this$version = this.getVersion();
                    Object other$version = other.getVersion();
                    if (this$version == null) {
                        if (other$version == null) {
                            break label125;
                        }
                    } else if (this$version.equals(other$version)) {
                        break label125;
                    }


                    return false;
                }


                label118: {
                    Object this$license = this.getLicense();
                    Object other$license = other.getLicense();
                    if (this$license == null) {
                        if (other$license == null) {
                            break label118;
                        }
                    } else if (this$license.equals(other$license)) {
                        break label118;
                    }


                    return false;
                }


                Object this$licenseUrl = this.getLicenseUrl();
                Object other$licenseUrl = other.getLicenseUrl();
                if (this$licenseUrl == null) {
                    if (other$licenseUrl != null) {
                        return false;
                    }
                } else if (!this$licenseUrl.equals(other$licenseUrl)) {
                    return false;
                }


                label104: {
                    Object this$termsOfServiceUrl = this.getTermsOfServiceUrl();
                    Object other$termsOfServiceUrl = other.getTermsOfServiceUrl();
                    if (this$termsOfServiceUrl == null) {
                        if (other$termsOfServiceUrl == null) {
                            break label104;
                        }
                    } else if (this$termsOfServiceUrl.equals(other$termsOfServiceUrl)) {
                        break label104;
                    }


                    return false;
                }


                label97: {
                    Object this$host = this.getHost();
                    Object other$host = other.getHost();
                    if (this$host == null) {
                        if (other$host == null) {
                            break label97;
                        }
                    } else if (this$host.equals(other$host)) {
                        break label97;
                    }


                    return false;
                }


                Object this$contact = this.getContact();
                Object other$contact = other.getContact();
                if (this$contact == null) {
                    if (other$contact != null) {
                        return false;
                    }
                } else if (!this$contact.equals(other$contact)) {
                    return false;
                }


                Object this$authorization = this.getAuthorization();
                Object other$authorization = other.getAuthorization();
                if (this$authorization == null) {
                    if (other$authorization != null) {
                        return false;
                    }
                } else if (!this$authorization.equals(other$authorization)) {
                    return false;
                }


                return true;
            }
        }
    }


    protected boolean canEqual(Object other) {
        return other instanceof SwaggerProperties;
    }


    @Override
    public int hashCode() {
        boolean PRIME = true;
        int result = 1;
        Object $enabled = this.getEnabled();
        result = result * 59 + ($enabled == null ? 43 : $enabled.hashCode());
        Object $basePackage = this.getBasePackage();
        result = result * 59 + ($basePackage == null ? 43 : $basePackage.hashCode());
        Object $basePath = this.getBasePath();
        result = result * 59 + ($basePath == null ? 43 : $basePath.hashCode());
        Object $excludePath = this.getExcludePath();
        result = result * 59 + ($excludePath == null ? 43 : $excludePath.hashCode());
        Object $title = this.getTitle();
        result = result * 59 + ($title == null ? 43 : $title.hashCode());
        Object $description = this.getDescription();
        result = result * 59 + ($description == null ? 43 : $description.hashCode());
        Object $version = this.getVersion();
        result = result * 59 + ($version == null ? 43 : $version.hashCode());
        Object $license = this.getLicense();
        result = result * 59 + ($license == null ? 43 : $license.hashCode());
        Object $licenseUrl = this.getLicenseUrl();
        result = result * 59 + ($licenseUrl == null ? 43 : $licenseUrl.hashCode());
        Object $termsOfServiceUrl = this.getTermsOfServiceUrl();
        result = result * 59 + ($termsOfServiceUrl == null ? 43 : $termsOfServiceUrl.hashCode());
        Object $host = this.getHost();
        result = result * 59 + ($host == null ? 43 : $host.hashCode());
        Object $contact = this.getContact();
        result = result * 59 + ($contact == null ? 43 : $contact.hashCode());
        Object $authorization = this.getAuthorization();
        result = result * 59 + ($authorization == null ? 43 : $authorization.hashCode());
        return result;
    }


    @Override
    public String toString() {
        return "SwaggerProperties(enabled=" + this.getEnabled() + ", basePackage=" + this.getBasePackage() + ", basePath=" + this.getBasePath() + ", excludePath=" + this.getExcludePath() + ", title=" + this.getTitle() + ", description=" + this.getDescription() + ", version=" + this.getVersion() + ", license=" + this.getLicense() + ", licenseUrl=" + this.getLicenseUrl() + ", termsOfServiceUrl=" + this.getTermsOfServiceUrl() + ", host=" + this.getHost() + ", contact=" + this.getContact() + ", authorization=" + this.getAuthorization() + ")";
    }


    public static class AuthorizationScope {
        private String scope = "";
        private String description = "";


        public String getScope() {
            return this.scope;
        }


        public String getDescription() {
            return this.description;
        }


        public void setScope(String scope) {
            this.scope = scope;
        }


        public void setDescription(String description) {
            this.description = description;
        }


        @Override
        public boolean equals(Object o) {
            if (o == this) {
                return true;
            } else if (!(o instanceof SwaggerProperties.AuthorizationScope)) {
                return false;
            } else {
                SwaggerProperties.AuthorizationScope other = (SwaggerProperties.AuthorizationScope)o;
                if (!other.canEqual(this)) {
                    return false;
                } else {
                    Object this$scope = this.getScope();
                    Object other$scope = other.getScope();
                    if (this$scope == null) {
                        if (other$scope != null) {
                            return false;
                        }
                    } else if (!this$scope.equals(other$scope)) {
                        return false;
                    }


                    Object this$description = this.getDescription();
                    Object other$description = other.getDescription();
                    if (this$description == null) {
                        if (other$description != null) {
                            return false;
                        }
                    } else if (!this$description.equals(other$description)) {
                        return false;
                    }


                    return true;
                }
            }
        }


        protected boolean canEqual(Object other) {
            return other instanceof SwaggerProperties.AuthorizationScope;
        }


        @Override
        public int hashCode() {
            boolean PRIME = true;
            int result = 1;
            Object $scope = this.getScope();
            result = result * 59 + ($scope == null ? 43 : $scope.hashCode());
            Object $description = this.getDescription();
            result = result * 59 + ($description == null ? 43 : $description.hashCode());
            return result;
        }


        @Override
        public String toString() {
            return "SwaggerProperties.AuthorizationScope(scope=" + this.getScope() + ", description=" + this.getDescription() + ")";
        }


        public AuthorizationScope() {
        }
    }


    public static class Authorization {
        private String name = "";
        private String authRegex = "^.*$";
        private List<SwaggerProperties.AuthorizationScope> authorizationScopeList = new ArrayList();
        private List<String> tokenUrlList = new ArrayList();


        public String getName() {
            return this.name;
        }


        public String getAuthRegex() {
            return this.authRegex;
        }


        public List<SwaggerProperties.AuthorizationScope> getAuthorizationScopeList() {
            return this.authorizationScopeList;
        }


        public List<String> getTokenUrlList() {
            return this.tokenUrlList;
        }


        public void setName(String name) {
            this.name = name;
        }


        public void setAuthRegex(String authRegex) {
            this.authRegex = authRegex;
        }


        public void setAuthorizationScopeList(List<SwaggerProperties.AuthorizationScope> authorizationScopeList) {
            this.authorizationScopeList = authorizationScopeList;
        }


        public void setTokenUrlList(List<String> tokenUrlList) {
            this.tokenUrlList = tokenUrlList;
        }


        @Override
        public boolean equals(Object o) {
            if (o == this) {
                return true;
            } else if (!(o instanceof SwaggerProperties.Authorization)) {
                return false;
            } else {
                SwaggerProperties.Authorization other = (SwaggerProperties.Authorization)o;
                if (!other.canEqual(this)) {
                    return false;
                } else {
                    label59: {
                        Object this$name = this.getName();
                        Object other$name = other.getName();
                        if (this$name == null) {
                            if (other$name == null) {
                                break label59;
                            }
                        } else if (this$name.equals(other$name)) {
                            break label59;
                        }


                        return false;
                    }


                    Object this$authRegex = this.getAuthRegex();
                    Object other$authRegex = other.getAuthRegex();
                    if (this$authRegex == null) {
                        if (other$authRegex != null) {
                            return false;
                        }
                    } else if (!this$authRegex.equals(other$authRegex)) {
                        return false;
                    }


                    Object this$authorizationScopeList = this.getAuthorizationScopeList();
                    Object other$authorizationScopeList = other.getAuthorizationScopeList();
                    if (this$authorizationScopeList == null) {
                        if (other$authorizationScopeList != null) {
                            return false;
                        }
                    } else if (!this$authorizationScopeList.equals(other$authorizationScopeList)) {
                        return false;
                    }


                    Object this$tokenUrlList = this.getTokenUrlList();
                    Object other$tokenUrlList = other.getTokenUrlList();
                    if (this$tokenUrlList == null) {
                        if (other$tokenUrlList != null) {
                            return false;
                        }
                    } else if (!this$tokenUrlList.equals(other$tokenUrlList)) {
                        return false;
                    }


                    return true;
                }
            }
        }


        protected boolean canEqual(Object other) {
            return other instanceof SwaggerProperties.Authorization;
        }


        @Override
        public int hashCode() {
            boolean PRIME = true;
            int result = 1;
            Object $name = this.getName();
            result = result * 59 + ($name == null ? 43 : $name.hashCode());
            Object $authRegex = this.getAuthRegex();
            result = result * 59 + ($authRegex == null ? 43 : $authRegex.hashCode());
            Object $authorizationScopeList = this.getAuthorizationScopeList();
            result = result * 59 + ($authorizationScopeList == null ? 43 : $authorizationScopeList.hashCode());
            Object $tokenUrlList = this.getTokenUrlList();
            result = result * 59 + ($tokenUrlList == null ? 43 : $tokenUrlList.hashCode());
            return result;
        }


        @Override
        public String toString() {
            return "SwaggerProperties.Authorization(name=" + this.getName() + ", authRegex=" + this.getAuthRegex() + ", authorizationScopeList=" + this.getAuthorizationScopeList() + ", tokenUrlList=" + this.getTokenUrlList() + ")";
        }


        public Authorization() {
        }
    }


    public static class Contact {
        private String name = "";
        private String url = "";
        private String email = "";


        public String getName() {
            return this.name;
        }


        public String getUrl() {
            return this.url;
        }


        public String getEmail() {
            return this.email;
        }


        public void setName(String name) {
            this.name = name;
        }


        public void setUrl(String url) {
            this.url = url;
        }


        public void setEmail(String email) {
            this.email = email;
        }


        @Override
        public boolean equals(Object o) {
            if (o == this) {
                return true;
            } else if (!(o instanceof SwaggerProperties.Contact)) {
                return false;
            } else {
                SwaggerProperties.Contact other = (SwaggerProperties.Contact)o;
                if (!other.canEqual(this)) {
                    return false;
                } else {
                    label47: {
                        Object this$name = this.getName();
                        Object other$name = other.getName();
                        if (this$name == null) {
                            if (other$name == null) {
                                break label47;
                            }
                        } else if (this$name.equals(other$name)) {
                            break label47;
                        }


                        return false;
                    }


                    Object this$url = this.getUrl();
                    Object other$url = other.getUrl();
                    if (this$url == null) {
                        if (other$url != null) {
                            return false;
                        }
                    } else if (!this$url.equals(other$url)) {
                        return false;
                    }


                    Object this$email = this.getEmail();
                    Object other$email = other.getEmail();
                    if (this$email == null) {
                        if (other$email != null) {
                            return false;
                        }
                    } else if (!this$email.equals(other$email)) {
                        return false;
                    }


                    return true;
                }
            }
        }


        protected boolean canEqual(Object other) {
            return other instanceof SwaggerProperties.Contact;
        }


        @Override
        public int hashCode() {
            boolean PRIME = true;
            int result = 1;
            Object $name = this.getName();
            result = result * 59 + ($name == null ? 43 : $name.hashCode());
            Object $url = this.getUrl();
            result = result * 59 + ($url == null ? 43 : $url.hashCode());
            Object $email = this.getEmail();
            result = result * 59 + ($email == null ? 43 : $email.hashCode());
            return result;
        }


        @Override
        public String toString() {
            return "SwaggerProperties.Contact(name=" + this.getName() + ", url=" + this.getUrl() + ", email=" + this.getEmail() + ")";
        }


        public Contact() {
        }
    }
}
```

#### 4.5 配置文件

application.yml

```yml
server:
  port: 8088
#解决Springboot启动报错:Failed to start bean 'documentationPluginsBootstrapper'
spring:
  mvc:
    pathmatch:
      matching-strategy: ant_path_matcher
#swagger配置
swagger:
  enabled: true
  title: 测试Swagger
  description: 这是一次对自动配置对象的注入和测试swagger配置类的自动配置
  version: 1.0
  host: localhost
  termsOfServiceUrl: http://${swagger.host}:${server.port}/doc.html
  contact:
    name: 姜源
    url: http://www.xxx.com
    email: jerry@xxx.com
```

#### 4.6 配置Spring工厂

resources/META-INF/spring.factories

```factories
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
  com.jerry.swagger.config.SwaggerAutoConfiguration
```

#### 4.7 测试接口+启动类

测试接口：

```java
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
@Api(tags = "测试接口")
public class TestController {

    @ApiOperation(value = "测试", notes = "测试")
    @PostMapping("/api")
    public String test() {
        return "OK";
    }
}
```

启动类：

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SwaggerApplication {
    public static void main(String[] args) {
        SpringApplication.run(SwaggerApplication.class, args);
    }
}
```

#### 4.8 使用方式

* 单服务中直接配置使用；
* 打 jar 包放私服上供其他服务直接引用，启动自带swagger。