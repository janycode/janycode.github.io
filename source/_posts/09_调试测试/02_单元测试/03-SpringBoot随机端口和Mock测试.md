---
title: 03-SpringBoot随机端口和Mock测试
date: 2021-3-23 17:34:24
tags: 
- SpringBoot
- 测试
- mock
categories: 
- 09_调试测试
- 02_单元测试
---

参考资料：[Spring Boot常用测试场景及分析](https://blog.csdn.net/icarusliu/article/details/78840951)


### 1. 普通测试
Spring Boot 提供了许多实用工具和注解来帮助测试应用程序，主要包括以下两个模块。
spring-boot-test：支持测试的核心内容。
spring-boot-test-autoconfigure：支持测试的自动化配置。

开发进行只要使用 spring-boot-starter-test 启动器就能引入这些 Spring Boot 测试模块，还能引入一些像 JUnit,AssertJ,Hamcrest 及其他一些有用的类库，具体如下所示。

* JUnit：Java 应用程序单元测试标准类库。
* Spring Test & Spring Boot Test：Spring Boot 应用程序功能集成化测试支持。
* AssertJ：一个轻量级的断言类库。
* Hamcrest：一个对象匹配器类库。
* Mockito：一个Java Mock测试框架，默认支付 1.x，可以修改为 2.x。
* JSONassert：一个用于JSON的断言库。
* JsonPath：一个JSON操作类库。

pom.xml 引入测试的依赖包，spring-boot-starter-test在默认Springboot项目创建的时候就会引入。
```xml
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
```
测试类：
```java
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class TestApplicationTests {
    @Test
    void contextLoads() {
        System.out.println("hello, Spring boot Test!!!");
    }
}
```

### 2. 使用随机端口测试
假设一个基于REST风格的请求已经开发好了，而且本地已经开启8080端口服务。这里就可以使用随机端口进行测试了。
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class MpServiceApplicationTests {

    @Autowired
    private TestRestTemplate testRestTemplate = null;

    @Test
    public void testApi() throws Exception {
        //一个键对应多个值, 如 put 方法: put(String, List<String>)
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("orderId", "ORDER20210312010000000046");
        //postForObject 默认只能映射 Map 类型返回，如果是实体类则映射不到属性的值，需要强转或者使用 postForEntity
        //Map orderMap = testRestTemplate.postForObject("/api/mp/order/info", params, Map.class);
        //if (!ObjectUtils.isEmpty(orderMap)) {
        //    MpOrder order = (MpOrder) orderMap;
        //    System.out.println("order = " + order);
        //}
        ResponseEntity<MpOrder> mpOrderResponseEntity = testRestTemplate.postForEntity("/api/mp/order/info", params, MpOrder.class);
        MpOrder order = mpOrderResponseEntity.getBody();
        System.out.println("order = " + order);
    }
```

#### 2.1 TestRestTemplate 使用
```java
@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AccountControllerTests {
    @Autowired
    private TestRestTemplate restTemplate;
    private HttpEntity httpEntity;

    /**
     * 登录
     * @throws Exception
     */
    private void login() throws Exception {
        String expectStr = "{\"code\":0,\"msg\":\"success\"}";
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("username", "183xxxxxxxx");
        map.add("password", "123456");
        ResponseEntity responseEntity = restTemplate.postForEntity("/api/account/sign_in", map, String.class);
        //添加cookie以保持状态
        HttpHeaders headers = new HttpHeaders();
        String headerValue = responseEntity.getHeaders().get("Set-Cookie").toString().replace("[", "");
        headerValue = headerValue.replace("]", "");
        headers.set("Cookie", headerValue);
        httpEntity = new HttpEntity(headers);
        assertThat(responseEntity.getBody()).isEqualTo(expectStr);
    }

    /**
     * 登出
     * @throws Exception
     */
    private void logout() throws Exception {
        String expectStr = "{\"code\":0,\"msg\":\"success\"}";
        String result = restTemplate.postForObject("/api/account/sign_out", null, String.class, httpEntity);
        httpEntity = null;
        assertThat(result).isEqualTo(expectStr);
    }

    /**
     * 获取信息
     * @throws Exception
     */
    private void getUserInfo() throws Exception {
        Detail detail = new Detail();
        detail.setNickname("疯狂的米老鼠");
        detail.setNicknamePinyin("fengkuangdemilaoshu");
        detail.setSex(1);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        detail.setCreatedAt(sdf.parse("2017-11-03 16:43:27"));
        detail.setUpdatedAt(sdf.parse("2017-11-03 16:43:27"));
        Role role = new Role();
        role.setName("ROLE_USER_NORMAL");
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        User user = new User();
        user.setId(1L);
        user.setPhone("183xxxxxxxx");
        user.setEmail("xxxxxx@gmail.com");
        user.setDetail(detail);
        user.setRoles(roles);
        ResultBean<User> resultBean = new ResultBean<>();
        resultBean.setData(user);
        ObjectMapper om = new ObjectMapper();
        String expectStr = om.writeValueAsString(resultBean);
        ResponseEntity<String> responseEntity = restTemplate.exchange("/api/user/get_user_info", HttpMethod.GET, httpEntity, String.class);
        assertThat(responseEntity.getBody()).isEqualTo(expectStr);
    }

    @Test
    public void testAccount() throws Exception {
        login();
        getUserInfo();
        logout();
    }
```

#### 2.2 GET 请求测试

``` java
import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;

import java.util.HashMap;
import java.util.Map;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class MpServiceApplicationTests {

    @Autowired
    private TestRestTemplate testRestTemplate;

    @Test
    public void get() throws Exception {
        Map<String, String> multiValueMap = new HashMap<>();
        multiValueMap.put("username", "Jerry");
        Map result = testRestTemplate.getForObject("/test/getUser?username={username}", Map.class, multiValueMap);
        Assert.assertEquals(result, 0);
    }
}
```

#### 2.3 POST 请求测试

``` java
import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.Map;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class MpServiceApplicationTests {

    @Autowired
    private TestRestTemplate testRestTemplate;

    @Test
    public void post() throws Exception {
        MultiValueMap multiValueMap = new LinkedMultiValueMap();
        multiValueMap.add("username", "Jerry");
        Map result = testRestTemplate.postForObject("/test/post", multiValueMap, Map.class);
        Assert.assertEquals(result, 0);
    }
}
```

#### 2.4 文件上传请求测试

``` java
import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.Map;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class MpServiceApplicationTests {

    @Autowired
    private TestRestTemplate testRestTemplate;

    @Test
    public void upload() throws Exception {
        Resource resource = new FileSystemResource("/home/javastack/test.jar");
        MultiValueMap multiValueMap = new LinkedMultiValueMap();
        multiValueMap.add("username", "Jerry");
        multiValueMap.add("files", resource);
        Map result = testRestTemplate.postForObject("/test/upload", multiValueMap, Map.class);
        Assert.assertEquals(result, 0);
    }
}
```

#### 2.5 文件下载请求测试

``` java
import com.google.common.io.Files;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;

import java.io.File;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class MpServiceApplicationTests {

    @Autowired
    private TestRestTemplate testRestTemplate;

    @Test
    public void download() throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.set("token", "Jerry");
        HttpEntity formEntity = new HttpEntity(headers);
        String[] urlVariables = new String[]{"admin"};
        ResponseEntity<byte[]> response = testRestTemplate.exchange("/test/download?username={1}", HttpMethod.GET, formEntity, byte[].class, urlVariables);
        if (response.getStatusCode() == HttpStatus.OK) {
            Files.write(response.getBody(), new File("/home/Jerry/test.jar"));
        }
    }
}
```


### 3. 使用Mock测试
使用 `@MockBean` 注解，以及虚拟数据进行测试，不会写入持久化数据库。

``` java
import org.junit.jupiter.api.Test;
import org.mockito.BDDMockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class MpServiceApplicationTests {

    @MockBean
    private MpUserrecvaddrService mpUserrecvaddrService;

    @Test
    public void testMock() {
        //构建虚拟对象
        MpUserrecvaddr mockAddr = new MpUserrecvaddr();
        mockAddr.setUraId("1");
        mockAddr.setUserId("001");
        mockAddr.setUraName("name_" + 1);
        mockAddr.setUraAddress("address_" + 1);
        //指定 Mock Bean 方法和参数，并返回虚拟对象
        BDDMockito.given(mpUserrecvaddrService.getById("1")).willReturn(mockAddr);
        //进行 Mock 测试
        MpUserrecvaddr addr = mpUserrecvaddrService.getById("1");
        System.out.println("addr = " + addr);
    }
}
```
![MockBean测试](https://jy-imgs.oss-cn-beijing.aliyuncs.com/小书匠/20213231616485091587.png)

