---
title: 01-OAuth2.0 协议
date: 2018-5-13 21:36:21
tags:
- OAuth2
categories: 
- 13_第三方
- 00_OAuth2.0
---

![auth2.0协议-logo](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815143434.png)

官方网址：https://oauth.net/2/

参考资料：http://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html



### 1. 简介

OAuth 2.0是用于授权的行业标准协议目前行业主流的授权协议。

OAuth（开放授权）是一个开放标准，允许用户授权第三方网站访问他们存储在另外的服务提供者上的信息，而不需要将用户名和密码提供给第三方网站或分享他们数据的所有内容。  

#### 1.1 应用场景

对内授权：内部有多个系统，可以实现授权式操作

对外授权：可以让外部第三方应用，进行授权操作  

* 快递员：第三方 申请进入小区

* 居民：授权同意 第三方的进行

* 授权机制：数据的所有方，告诉系统，为谁授权，采用令牌(JWT)作为标记位

#### 1.2 授权模式

* 授权码模式 - 目前行业的标准方案
* 隐式模式
* 密码模式
* 客户端模式

**授权码模式** Authorization-code：

![image-20200815145758397](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815145800.png)

涉及到三种角色：

1.应用程序：第三方程序系统 ，需要在开放平台的主站进行申请

2.授权程序：实现基于Oauth2.0的授权交互

3.资源程序：最终要开放的接口资源  

通俗：

1. 需要根据应用的ip和秘钥获取授权码
    
    `oauth/authorize?client_id=应用的ID&client_secret=应用的秘钥&response_type=code&redirect_uri=回调地址`
    
    （获取授权服务返回的信息：可以获取授权码，也可以获取令牌等信息）
    
2. 再次请求授权服务，通过授权码去获取令牌

    `oauth/token?client_id=应用的ID&client_secret=应用的秘钥&response_type=code&redirect_uri=回调地址&code=授权码`

    eg: oauth/token?client_id=app1001&client_secret=654321&response_type=code&code=a3cepW  回调地址传递：token、refresh_token（刷新令牌一次性）

3. 有了令牌就可以操作资源



### 2. Spring Security

RBAC系统：基于角色的权限控制系统
Java的权限框架：**Shiro**( http://shiro.apache.org/ )、**Spring Security**( https://spring.io/projects/springsecurity/ )

Spring Security是一个功能强大且高度可定制的身份验证和访问控制框架。

* 依赖

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-security</artifactId>
        </dependency>
```

* 配置类

```java
// SecurityConfig 配置类
@Configuration
@Order(1)
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

//    @Autowired
//    private UserDetailsService detailsService;
//    @Autowired
//    private PasswordEncoder passwordEncoder;
    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        AuthenticationManager am= super.authenticationManagerBean();
        return am;
    }
    //授权  标记对应的访问权限 校验
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http   // 配置登录页并允许访问
                .formLogin().permitAll()
                // 配置登出页面
                .and().logout().logoutUrl("/logout").logoutSuccessUrl("/")
                .and().authorizeRequests().antMatchers("/api/hello/**").hasRole("admin")
                // 其余所有请求全部需要鉴权认证
                .anyRequest().authenticated()
                // 关闭跨域保护;
                .and().csrf().disable();
    }

    //认证 用户信息 登录
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication().withUser("laowang").password("{noop}13579").roles("admin").and()
        .withUser("wangsi").password("{noop}111").roles("user");
        //PasswordEncoderFactories 密码的格式 {名称}密码明文  名称来自PasswordEncoderFactories
//        auth.userDetailsService(detailsService).passwordEncoder(passwordEncoder);
    }
    //SHA256+盐 实现密码的加密处理
//    @Bean
//    public BCryptPasswordEncoder createBPE(){
//        return new BCryptPasswordEncoder();
//    }
}
```

* 接口

```java
// 对外接口1
@RestController
public class OrderController {
    @GetMapping("api/order/detail.do")
    public String detail(int id){
        return "欢迎---"+id;
    }
}

// 对外接口2
@RestController
//@Async //异步的接口
public class HiController {

    @GetMapping("/api/hi.do")
    public String hi(){
        return "OK";
    }
    @GetMapping("/api/hello/hi.do")
    public String hello(){
        return "OK";
    }
}
```

* 启动类

```java
@SpringBootApplication
//@EnableAsync //开启异步
public class OauthServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(OauthServerApplication.class,args);
    }
}
```



### 3. OAuth2.0整合授权码模式

* 依赖

```xml
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-oauth2</artifactId>
            <version>2.2.4.RELEASE</version>
        </dependency>
```

* 配置类

```java
// OauthConfig 配置类
@Configuration
@EnableAuthorizationServer
public class OauthConfig extends AuthorizationServerConfigurerAdapter {
    @Autowired
    private AuthenticationManager authenticationManager;
    //实现客户端（第三方应用信息）的配置
    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        clients.inMemory().withClient("app1001").secret("{bcrypt}654321"). //设置客户端的id和对应的秘钥
                redirectUris("http://localhost:8080/api/hello.html").
                autoApprove(true).scopes("all")
                .refreshTokenValiditySeconds(1800).accessTokenValiditySeconds(600).
                authorizedGrantTypes("authorization_code");
    }

    //设置权限接口信息
    @Override
    public void configure(AuthorizationServerSecurityConfigurer security) throws Exception {
//        security.tokenKeyAccess("isAuthenticated()").
//                checkTokenAccess("isAuthenticated()").
//                allowFormAuthenticationForClients();
        ClientDetails details;
        security.tokenKeyAccess("permitAll()").
                checkTokenAccess("permitAll()").
                allowFormAuthenticationForClients();
    }
    //授权服务的认证
    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
        endpoints.authenticationManager(authenticationManager).tokenStore(createTS());
    }
    @Bean
    public TokenStore createTS(){
        //new RedisTokenStore() 存储到Redis
        //new JdbcTokenStore(); 存储到数据库
//        JwtTokenStore
        return new InMemoryTokenStore(); //存储到内存中
    }
}
```

* 启动测试

    > Oauth2.0的授权码模式，默认提供的接口：
    >
    > * oauth/authorize 获取授权码
    >     需要的参数：client_id=应用id&response_type=code&redirect_uri=回调接口地址&forcelogin=1&state=随机签名
    > * 通过回调地址获取返回授权码
    >     返回的内容：code=授权码

    请求接口：
    
    http://localhost:8011/oauth/authorize?response_type=code&client_id=user-client&state=123432
    ![image-20200815153042000](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815153042.png)



### 4. OAuth2.0 授权 - 基于GitHub

Oauth2.0模式：授权码的模式

1. 请求需求的内容：
    
    1.获取授权码 code
    
    2.获取令牌 access_token

    3.刷新令牌获取新令牌 refresh_token
    
    4.校验令牌 check_token
    
2. Oauth2.0默认提供的接口：

    get /oauth/authorize 获取授权码

    需求参数：

    client_id: 客户端id

    response_type: 类型 code

    state: 随机签名 时间戳

    scope: 范围 /oauth/token  

* 依赖

```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
	<groupId>org.springframework.cloud</groupId>
	<artifactId>spring-cloud-starter-oauth2</artifactId>
</dependency>
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

* 权限配置

```java
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    //密文：SHA-256+随机盐+Key 生成的单向加密
    @Bean
    public PasswordEncoder passwordEncoder() {
//        NoOpPasswordEncoder
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    /**
     * 允许匿名访问所有接口 主要是 oauth 接口
     * @param http
     * @throws Exception
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/**").permitAll().
                and().httpBasic().
                and().csrf().disable();
    }
}
```

* 令牌存储配置

```java
@Configuration
public class RedisTokenStoreConfig {
    //存储到Redis ,使用的是Spring Data Redis
    @Autowired
    private RedisConnectionFactory redisConnectionFactory;

   // JdbcTokenStore;
   // JwtTokenStore j;
    //TokenConverter
    @Bean
    public TokenStore redisTokenStore (){
        return new RedisTokenStore(redisConnectionFactory);
    }
}
```

* 用户信息配置

```java
@Slf4j
@Service
public class UserDetailsService implements UserDetailsService {
    @Autowired
    private PasswordEncoder passwordEncoder;

    //默认提供的用户信息：admin 123456
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("username---:" + username);
        // 来自数据库的查询
        // 查询数据库操作
        if(!username.equals("admin")){
            throw new UsernameNotFoundException("the user is not found");
        }else{
            // 用户角色也应在数据库中获取
            String role = "ROLE_ADMIN";
            List<SimpleGrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority(role));
            // 线上环境应该通过用户名查询数据库获取加密后的密码
            String password = passwordEncoder.encode("123456");
            return new org.springframework.security.core.userdetails.User(username,password, authorities);
        }
    }
}
```

* 授权配置

```java
@Configuration
@EnableAuthorizationServer
public class OAuth2Config  extends AuthorizationServerConfigurerAdapter {
    @Autowired
    public PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    public UserDetailsService detailsService;
    @Autowired
    private TokenStore redisTokenStore;

    @Override
    public void configure(final AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
        /**
         * redis token 方式
         */
        endpoints.authenticationManager(authenticationManager)
                .userDetailsService(detailsService)
                .tokenStore(redisTokenStore);
    }

    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        //操作数据库 --来自数据库
        //clients.withClientDetails();
        //来自内存
        clients.inMemory()
                .withClient("app001")
                .secret(passwordEncoder.encode("123456"))
                .authorizedGrantTypes("refresh_token", "authorization_code")
                .accessTokenValiditySeconds(3600).
                redirectUris("http://localhost:8011/call.html")
                .scopes("all")
                .and()
                .withClient("app002")
                .secret(passwordEncoder.encode("123456"))
                .authorizedGrantTypes("refresh_token", "authorization_code")
                .accessTokenValiditySeconds(3600).
                redirectUris("http://localhost:8011/call.html")
                .scopes("all");
    }

    @Override
    public void configure(AuthorizationServerSecurityConfigurer security) throws Exception {
        security.allowFormAuthenticationForClients();//允许表单提交
        security.checkTokenAccess("permitAll()");//校验令牌是否有效
        security.tokenKeyAccess("isAuthenticated()");
    }
}
```

* yml 配置

```yaml
server:
  port: 8011
spring:
  application:
    name: oauthserver  #服务名称
  redis:
    database: 0
    host: 39.105.189.141
    port: 6380
    password: 123456
```

测试：

测试授权：

1. 请求接口
    http://localhost:8011/oauth/authorize?response_type=code&client_id=app001&state=123432
    
    调用登录页面，输入账号信息，成功之后，将授权码回调到指定的页面

![image-20200815163506482](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815163508.png)

取到对应的授权码：code=u8cCJ0  

2. postman进行接口请求 获取令牌
    http://localhost:8011/oauth/token
    
    需求的参数：post请求 
    
    请求示例：http://localhost:8011/oauth/token?client_id=app001&client_secret=123456&code=u8cCJ0&grant_type=authorization_code 

![image-20200815163611887](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815163613.png)

3.校验令牌是否有效
http://localhost:8011/oauth/check_token

需求参数：token:令牌

请求示例：http://localhost:8011/oauth/check_token?token=0cf70c84-47c5-4132-be3d-e3e9a3f9b889