---
title: 22-SpringBoot+Java21脚手架
date: 2025-11-24 22:11:01
index_img: https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241024154522.png
tags:
- SpringBoot
- Java21
- 脚手架
categories:
- 08_框架技术
- 04_SpringBoot
---

![image-20200708160944615](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708160946.png)

参考资料：

* SpringBoot 4发布：https://springframework.org.cn/blog/2025/11/20/spring-boot-4-0-0-available-now/



## 一、架构脚手架

SpringBoot 4 已经正式发布，基于 **Spring Framework 7** 和 **Java 21+**，带来了声明式 HTTP 客户端、结构化并发、30% 启动速度提升等一系列令人兴奋的新特性。Spring Security 也升级到了 **7.x**，内置 MFA 支持，DSL 配置更加优雅。再配上 Vue3 的 `Composition API` + `Pinia` + `TypeScript`，这套组合拳打出去，项目架构直接起飞。

从**真实项目架构**出发，手把手带你搭建一套**生产级**的`前后端分离`方案：

- 一套完整的前后端分离架构设计思路
- Spring Security 7 的 JWT 无状态认证最佳实践
- RBAC 权限模型的优雅实现
- Vue3 前端鉴权的全链路方案
- 若干踩坑经验

------

## 二、技术栈全景

| 层级            | 技术选型        | 版本  | 一句话点评             |
| --------------- | --------------- | ----- | ---------------------- |
| **后端框架**    | Spring Boot     | 4.0.x | Java 21+，起飞的速度   |
| **安全框架**    | Spring Security | 7.x   | 终于对 SPA 友好了      |
| **持久层**      | MyBatis-Plus    | 3.5.x | 能少写 SQL 就少写      |
| **缓存**        | Redis           | 7.x   | Token 黑名单的好帮手   |
| **前端框架**    | Vue             | 3.5.x | Composition API 真香   |
| **构建工具**    | Vite            | 6.x   | 快到模糊               |
| **状态管理**    | Pinia           | 3.x   | 比 Vuex 优雅一万倍     |
| **HTTP 客户端** | Axios           | 1.x   | 拦截器 YYDS            |
| **UI 组件**     | Element Plus    | 2.x   | 企业级首选             |
| **认证方案**    | JWT             | -     | 无状态，天生适合分布式 |

------

## 三、系统架构设计

### 3.1 整体架构图

![图片](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260412110404891.webp)

###  3.2 认证授权流程

![图片](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260412110424978.webp)

> **经验之谈**：千万别把所有东西都揉在一个包里。按业务模块分包（`modules`），而不是按技术层分包（controller/service/mapper 各放一堆），这样当你删掉一个业务模块时，直接干掉一个文件夹就行，而不是在三个文件夹里翻找。

------

## 四、后端项目结构

```
backend/
├── pom.xml
└── src/main/java/com/example/
    ├── Application.java                    # 启动类
    ├── common/                             # 公共模块
    │   ├── result/
    │   │   ├── R.java                      # 统一响应体
    │   │   └── ResultCode.java             # 响应码枚举
    │   ├── exception/
    │   │   ├── BizException.java           # 业务异常
    │   │   └── GlobalExceptionHandler.java # 全局异常处理
    │   └── constant/
    │       └── SecurityConstants.java      # 安全相关常量
    ├── config/                             # 配置层
    │   ├── SecurityConfig.java             # Spring Security 核心配置
    │   ├── RedisConfig.java                # Redis 配置
    │   └── CorsConfig.java                 # 跨域配置
    ├── security/                           # 安全模块
    │   ├── filter/
    │   │   └── JwtAuthenticationFilter.java
    │   ├── handler/
    │   │   ├── LoginSuccessHandler.java
    │   │   ├── LoginFailureHandler.java
    │   │   ├── AccessDeniedHandlerImpl.java
    │   │   └── AuthenticationEntryPointImpl.java
    │   └── util/
    │       └── JwtUtils.java
    ├── modules/                            # 业务模块
    │   ├── auth/
    │   │   ├── controller/AuthController.java
    │   │   ├── service/AuthService.java
    │   │   └── dto/LoginRequest.java
    │   ├── user/
    │   │   ├── controller/UserController.java
    │   │   ├── service/UserService.java
    │   │   ├── mapper/UserMapper.java
    │   │   └── entity/User.java
    │   └── role/
    │       ├── controller/RoleController.java
    │       ├── service/RoleService.java
    │       └── entity/Role.java
    └── resources/
        ├── application.yml
        └── mapper/
```

> **经验之谈**：千万别把所有东西都揉在一个包里。按业务模块分包（`modules`），而不是按技术层分包（controller/service/mapper 各放一堆），这样当你删掉一个业务模块时，直接干掉一个文件夹就行，而不是在三个文件夹里翻找。

------

## 五、后端核心实现：Java21

### 5.1 Maven 依赖

```xml
<!-- pom.xml 核心依赖 -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>4.0.5</version>
</parent>

<properties>
    <java.version>21</java.version>
    <mybatis-plus.version>3.5.9</mybatis-plus.version>
    <jjwt.version>0.12.6</jjwt.version>
</properties>

<dependencies>
    <!-- Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Spring Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- Redis -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>

    <!-- MyBatis-Plus -->
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
        <version>${mybatis-plus.version}</version>
    </dependency>

    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>${jjwt.version}</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>${jjwt.version}</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>${jjwt.version}</version>
        <scope>runtime</scope>
    </dependency>

    <!-- MySQL -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
```

### 5.2 application.yml

```yml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/db_admin?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
  data:
    redis:
      host: localhost
      port: 6379
      database: 0
      timeout: 10s
      lettuce:
        pool:
          max-active: 20
          max-idle: 10

# JWT 配置
jwt:
  secret: "xxx"
  access-token-expiration: 1800000   # 30分钟
  refresh-token-expiration: 604800000 # 7天

# MyBatis-Plus 配置
mybatis-plus:
  mapper-locations: classpath:mapper/**/*.xml
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

### 5.3 统一响应体

这是前后端分离项目的**第一条军规**：统一响应格式。前端不应该猜你返回的是啥结构。

```java

/**
 * 统一响应体 —— 前后端的"通用语言"
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class R<T> implements Serializable {

    private int code;
    private String message;
    private T data;
    private long timestamp;

    private R(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.timestamp = System.currentTimeMillis();
    }

    public static <T> R<T> ok() {
        return new R<>(200, "操作成功", null);
    }

    public static <T> R<T> ok(T data) {
        return new R<>(200, "操作成功", data);
    }

    public static <T> R<T> ok(String message, T data) {
        return new R<>(200, message, data);
    }

    public static <T> R<T> fail(int code, String message) {
        return new R<>(code, message, null);
    }

    public static <T> R<T> fail(ResultCode resultCode) {
        return new R<>(resultCode.getCode(), resultCode.getMessage(), null);
    }
}
```



```java
/**
 * 响应码枚举 —— 让错误码有据可查
 */
@Getter
@AllArgsConstructor
public enum ResultCode {

    SUCCESS(200, "操作成功"),
    UNAUTHORIZED(401, "未登录或Token已过期"),
    FORBIDDEN(403, "没有操作权限"),
    NOT_FOUND(404, "资源不存在"),
    BAD_REQUEST(400, "请求参数错误"),

    // 业务错误码从 1000 开始
    USER_NOT_FOUND(1001, "用户不存在"),
    USER_PASSWORD_ERROR(1002, "用户名或密码错误"),
    USER_DISABLED(1003, "账号已被禁用"),
    TOKEN_EXPIRED(1004, "Token已过期"),
    TOKEN_INVALID(1005, "Token无效"),
    REFRESH_TOKEN_EXPIRED(1006, "RefreshToken已过期，请重新登录"),

    INTERNAL_ERROR(500, "服务器内部错误，请联系管理员");

    private final int code;
    private final String message;
}
```

> **Tips**: 业务错误码从 1000 开始编排，和 HTTP 状态码区分开。前端可以通过 `code < 1000` 判断是系统级错误还是业务级错误。

### 5.4 JWT 工具类

```java
@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        if (userDetails instanceof LoginUser loginUser) {
            claims.put("userId", loginUser.getUser().getId());
            claims.put("authorities", loginUser.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList());
        }
        return buildToken(claims, userDetails.getUsername(), accessTokenExpiration);
    }

    public String generateRefreshToken(String username) {
        return buildToken(Map.of(), username, refreshTokenExpiration);
    }

    private String buildToken(Map<String, Object> claims, String subject, long expiration) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    @SuppressWarnings("unchecked")
    public List<String> extractAuthorities(String token) {
        return extractClaim(token, claims ->
                claims.get("authorities", List.class));
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claimsResolver.apply(claims);
    }
}
```

### 5.5 Spring Security 7核心配置

这是整个后端最关键的配置类。Spring Security 7 已经**完全移除了 `and()` 方法**，全面拥抱 Lambda DSL，配置起来更加清爽。

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity  // 启用方法级别权限控制
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationEntryPointImpl authEntryPoint;
    private final AccessDeniedHandlerImpl accessDeniedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 前后端分离：关闭 CSRF（用 JWT 代替）
            .csrf(AbstractHttpConfigurer::disable)
            // 不需要 Session，我们是无状态的
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            // 异常处理
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(authEntryPoint)   // 401
                .accessDeniedHandler(accessDeniedHandler)   // 403
            )
            // 请求授权规则
            .authorizeHttpRequests(auth -> auth
                // 白名单：登录、注册、刷新Token、验证码、Swagger
                .requestMatchers(
                    "/api/auth/login",
                    "/api/auth/register",
                    "/api/auth/refresh",
                    "/api/captcha/**",
                    "/doc.html",
                    "/swagger-ui/**",
                    "/v3/api-docs/**"
                ).permitAll()
                // 静态资源
                .requestMatchers("/static/**", "/favicon.ico").permitAll()
                // 其余所有请求都需要认证
                .anyRequest().authenticated()
            )
            // 在 UsernamePasswordAuthenticationFilter 之前加入 JWT 过滤器
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

> **划重点**：前后端分离项目中，`csrf` 必须关闭（因为不依赖 Cookie），`sessionManagement` 设为 `STATELESS`（因为不用 Session）。这两步缺一不可，否则你会收获一堆玄学 Bug。

### 5.6 JWT 认证过滤器

```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final StringRedisTemplate redisTemplate;

    private static final String TOKEN_PREFIX = "Bearer ";
    private static final String TOKEN_BLACKLIST_PREFIX = "token:blacklist:";

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        // 1. 从 Header 中提取 Token
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith(TOKEN_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(TOKEN_PREFIX.length());

        // 2. 检查 Token 是否在黑名单中（用户主动登出）
        if (Boolean.TRUE.equals(redisTemplate.hasKey(TOKEN_BLACKLIST_PREFIX + token))) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. 验证 Token 有效性
        if (!jwtUtils.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 4. 从 Token 中提取用户信息，构建认证对象
        String username = jwtUtils.extractUsername(token);
        List<String> authorities = jwtUtils.extractAuthorities(token);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            List<SimpleGrantedAuthority> grantedAuthorities = authorities.stream()
                    .map(SimpleGrantedAuthority::new)
                    .toList();

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            username, null, grantedAuthorities);
            authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request));

            // 5. 将认证信息放入 SecurityContext
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }
}
```

### 5.7 认证端点：登录/登出/刷新

```java
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserService userService;
    private final StringRedisTemplate redisTemplate;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    @PostMapping("/login")
    public R<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        // 1. 认证（密码校验交给 Spring Security）
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(), request.getPassword()));

        // 2. 认证成功，生成双 Token
        LoginUser loginUser = (LoginUser) authentication.getPrincipal();
        String accessToken = jwtUtils.generateAccessToken(loginUser);
        String refreshToken = jwtUtils.generateRefreshToken(loginUser.getUsername());

        // 3. RefreshToken 存入 Redis
        redisTemplate.opsForValue().set(
                "token:refresh:" + loginUser.getUsername(),
                refreshToken,
                refreshTokenExpiration,
                TimeUnit.MILLISECONDS);

        // 4. 返回响应
        LoginResponse response = LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userInfo(UserVo.from(loginUser.getUser()))
                .build();

        return R.ok("登录成功", response);
    }

    @PostMapping("/refresh")
    public R<Map<String, String>> refreshToken(@RequestBody RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        if (!jwtUtils.isTokenValid(refreshToken)) {
            return R.fail(ResultCode.REFRESH_TOKEN_EXPIRED);
        }

        String username = jwtUtils.extractUsername(refreshToken);
        String stored = redisTemplate.opsForValue().get("token:refresh:" + username);

        if (stored == null || !stored.equals(refreshToken)) {
            return R.fail(ResultCode.TOKEN_INVALID);
        }

        // 重新加载用户信息并生成新的 AccessToken
        LoginUser loginUser = (LoginUser) userService.loadUserByUsername(username);
        String newAccessToken = jwtUtils.generateAccessToken(loginUser);

        return R.ok(Map.of("accessToken", newAccessToken));
    }

    @PostMapping("/logout")
    public R<Void> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        // 将 Token 加入黑名单，过期时间与 Token 剩余有效期一致
        redisTemplate.opsForValue().set(
                "token:blacklist:" + token, "1",
                30, TimeUnit.MINUTES);

        String username = jwtUtils.extractUsername(token);
        redisTemplate.delete("token:refresh:" + username);

        SecurityContextHolder.clearContext();
        return R.ok();
    }
}
```

### 5.8 异常处理

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(BizException.class)
    public R<Void> handleBizException(BizException e) {
        log.warn("业务异常: {}", e.getMessage());
        return R.fail(e.getCode(), e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public R<Map<String, String>> handleValidationException(
            MethodArgumentNotValidException e) {
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getFieldErrors()
                .forEach(err -> errors.put(err.getField(), err.getDefaultMessage()));
        return R.fail(400, "参数校验失败");
    }

    @ExceptionHandler(AccessDeniedException.class)
    public R<Void> handleAccessDeniedException(AccessDeniedException e) {
        return R.fail(ResultCode.FORBIDDEN);
    }

    @ExceptionHandler(AuthenticationException.class)
    public R<Void> handleAuthException(AuthenticationException e) {
        return R.fail(ResultCode.USER_PASSWORD_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public R<Void> handleException(Exception e) {
        log.error("系统异常", e);
        return R.fail(ResultCode.INTERNAL_ERROR);
    }
}
```



```java
/**
 * 401 处理器 —— 未认证时的响应
 */
@Component
public class AuthenticationEntryPointImpl implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException e) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write(
                new ObjectMapper().writeValueAsString(
                        R.fail(ResultCode.UNAUTHORIZED)));
    }
}
```

### 5.9 方法级权限控制：精确到按钮

Spring Security 7 的 `@EnableMethodSecurity` 让权限控制可以精细到每一个接口方法：

```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAuthority('system:user:list')")
    public R<IPage<UserVo>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        return R.ok(userService.pageUsers(page, size, keyword));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('system:user:add')")
    public R<Void> add(@RequestBody @Valid UserCreateRequest request) {
        userService.createUser(request);
        return R.ok();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('system:user:edit')")
    public R<Void> update(@PathVariable Long id,
                          @RequestBody @Valid UserUpdateRequest request) {
        userService.updateUser(id, request);
        return R.ok();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('system:user:delete')")
    public R<Void> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return R.ok();
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('system:user:edit')")
    public R<Void> toggleStatus(@PathVariable Long id) {
        userService.toggleStatus(id);
        return R.ok();
    }
}
```

> **权限编码规范**：采用 `模块:资源:操作` 的三段式命名，如 `system:user:add`。前端可以根据用户拥有的权限列表，动态控制按钮的显示/隐藏。

------

## 六、RBAC 权限模型设计

RBAC, Role Base Access Control（基于角色的权限控制）。

### 6.1 ER 关系图

![图片](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260412111129416.webp)

 

### 6.2 建表 SQL

```sql
-- 用户表
CREATE TABLE t_user (
    id          BIGINT       PRIMARY KEY AUTO_INCREMENT,
    username    VARCHAR(50)  NOT NULL UNIQUE COMMENT '用户名',
    password    VARCHAR(100) NOT NULL COMMENT '密码',
    nickname    VARCHAR(50)  DEFAULT '' COMMENT '昵称',
    email       VARCHAR(100) DEFAULT '' COMMENT '邮箱',
    phone       VARCHAR(20)  DEFAULT '' COMMENT '手机号',
    avatar      VARCHAR(255) DEFAULT '' COMMENT '头像',
    status      TINYINT      DEFAULT 1 COMMENT '状态 0禁用 1启用',
    created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 角色表
CREATE TABLE t_role (
    id          BIGINT       PRIMARY KEY AUTO_INCREMENT,
    role_key    VARCHAR(50)  NOT NULL UNIQUE COMMENT '角色标识',
    role_name   VARCHAR(50)  NOT NULL COMMENT '角色名称',
    status      TINYINT      DEFAULT 1 COMMENT '状态',
    sort        INT          DEFAULT 0 COMMENT '排序',
    remark      VARCHAR(255) DEFAULT '' COMMENT '备注',
    created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 菜单/权限表
CREATE TABLE t_menu (
    id          BIGINT       PRIMARY KEY AUTO_INCREMENT,
    parent_id   BIGINT       DEFAULT 0 COMMENT '父菜单ID',
    menu_name   VARCHAR(50)  NOT NULL COMMENT '菜单名称',
    path        VARCHAR(200) DEFAULT '' COMMENT '路由路径',
    component   VARCHAR(200) DEFAULT '' COMMENT '组件路径',
    permission  VARCHAR(100) DEFAULT '' COMMENT '权限标识',
    menu_type   TINYINT      NOT NULL COMMENT '类型 0目录 1菜单 2按钮',
    icon        VARCHAR(100) DEFAULT '' COMMENT '图标',
    sort        INT          DEFAULT 0 COMMENT '排序',
    visible     TINYINT      DEFAULT 1 COMMENT '是否可见',
    created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单权限表';

-- 用户角色关联表
CREATE TABLE t_user_role (
    user_id  BIGINT NOT NULL,
    role_id  BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

-- 角色菜单关联表
CREATE TABLE t_role_menu (
    role_id  BIGINT NOT NULL,
    menu_id  BIGINT NOT NULL,
    PRIMARY KEY (role_id, menu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色菜单关联表';

-- 初始化超级管理员 (密码: 123456 的 BCrypt 加密)
INSERT INTO t_user (username, password, nickname, status)
VALUES ('admin', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Lf4d/dRiC.VZRLE0GHzCq', '超级管理员', 1);

INSERT INTO t_role (role_key, role_name) VALUES ('admin', '超级管理员');

INSERT INTO t_user_role (user_id, role_id) VALUES (1, 1);
```



## 七、前端核心实现：Vue3

### 7.1 前端项目结构

```
frontend/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── src/
    ├── main.ts
    ├── App.vue
    ├── api/                    # API 接口层
    │   ├── request.ts          # Axios 封装
    │   ├── auth.ts             # 认证接口
    │   └── user.ts             # 用户接口
    ├── router/                 # 路由
    │   ├── index.ts            # 路由配置
    │   └── guards.ts           # 路由守卫
    ├── stores/                 # Pinia 状态管理
    │   ├── user.ts             # 用户状态
    │   └── permission.ts       # 权限状态
    ├── views/                  # 页面
    │   ├── login/
    │   │   └── index.vue
    │   ├── dashboard/
    │   │   └── index.vue
    │   └── system/
    │       ├── user/
    │       └── role/
    ├── components/             # 公共组件
    │   └── AuthButton.vue      # 权限按钮组件
    ├── directives/             # 自定义指令
    │   └── permission.ts       # v-permission 指令
    ├── utils/
    │   └── auth.ts             # Token 存取工具
    └── types/                  # TypeScript 类型定义
        └── api.d.ts
```

### 7.2 Axios 封装：请求拦截

这是前端和后端"对话"的翻译官，负责自动附加 Token、处理响应、Token 过期自动刷新。

```js
// src/api/request.ts
import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { getAccessToken, getRefreshToken, setAccessToken } from '@/utils/auth'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
})

// 是否正在刷新 Token
let isRefreshing = false
// 等待刷新的请求队列
let pendingRequests: Array<(token: string) => void> = []

// ==================== 请求拦截器 ====================
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ==================== 响应拦截器 ====================
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message, data } = response.data

    if (code === 200) {
      return response.data
    }

    // 业务错误统一提示
    ElMessage.error(message || '请求失败')
    return Promise.reject(new Error(message))
  },
  async (error) => {
    const originalRequest = error.config

    // AccessToken 过期，尝试用 RefreshToken 续期
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 已经在刷新了，排队等着
        return new Promise((resolve) => {
          pendingRequests.push((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            resolve(service(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = getRefreshToken()
        if (!refreshToken) throw new Error('No refresh token')

        const { data } = await axios.post('/api/auth/refresh', {
          refreshToken,
        })

        const newAccessToken = data.data.accessToken
        setAccessToken(newAccessToken)

        // 通知所有排队的请求
        pendingRequests.forEach((cb) => cb(newAccessToken))
        pendingRequests = []

        // 重发原始请求
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return service(originalRequest)
      } catch {
        // RefreshToken 也过期了，乖乖去登录吧
        const userStore = useUserStore()
        userStore.logout()
        router.push('/login')
        ElMessage.error('登录已过期，请重新登录')
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    // 403 权限不足
    if (error.response?.status === 403) {
      ElMessage.error('没有操作权限')
    }

    return Promise.reject(error)
  }
)

export default service
```

> **这段代码的精髓在于 Token 无感刷新**：当 AccessToken 过期时，不会直接跳到登录页，而是静默地用 RefreshToken 换取新的 AccessToken，然后重发失败的请求。用户甚至感知不到 Token 曾经过期过。多个并发请求同时遇到 401 时，通过 `pendingRequests` 队列确保只刷新一次。

### 7.3 Pinia 用户状态管理

```js
// src/stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginApi, logoutApi, getUserInfoApi } from '@/api/auth'
import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from '@/utils/auth'
import type { UserInfo, LoginParams } from '@/types/api'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(getAccessToken() || '')
  const userInfo = ref<UserInfo | null>(null)
  const permissions = ref<string[]>([])
  const roles = ref<string[]>([])

  const isLoggedIn = computed(() => !!token.value)

  async function login(params: LoginParams) {
    const { data } = await loginApi(params)
    token.value = data.accessToken
    setAccessToken(data.accessToken)
    setRefreshToken(data.refreshToken)
    userInfo.value = data.userInfo
  }

  async function fetchUserInfo() {
    const { data } = await getUserInfoApi()
    userInfo.value = data.user
    permissions.value = data.permissions
    roles.value = data.roles
  }

  async function logout() {
    try {
      await logoutApi()
    } finally {
      resetState()
    }
  }

  function resetState() {
    token.value = ''
    userInfo.value = null
    permissions.value = []
    roles.value = []
    clearTokens()
  }

  function hasPermission(perm: string): boolean {
    if (roles.value.includes('admin')) return true
    return permissions.value.includes(perm)
  }

  return {
    token, userInfo, permissions, roles, isLoggedIn,
    login, fetchUserInfo, logout, resetState, hasPermission,
  }
})
```

### 7.4 路由守卫

```js
// src/router/guards.ts
import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'
import NProgress from 'nprogress'

const WHITE_LIST = ['/login', '/register', '/404']

export function setupRouterGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start()

    const userStore = useUserStore()
    const permissionStore = usePermissionStore()

    if (userStore.isLoggedIn) {
      if (to.path === '/login') {
        // 已登录，跳回首页
        next({ path: '/' })
      } else {
        // 如果还没拉取过用户信息 → 拉取并生成动态路由
        if (!userStore.userInfo) {
          try {
            await userStore.fetchUserInfo()
            const dynamicRoutes = await permissionStore.generateRoutes(
              userStore.permissions
            )
            dynamicRoutes.forEach((route) => router.addRoute(route))
            next({ ...to, replace: true })
          } catch {
            userStore.resetState()
            next(`/login?redirect=${to.path}`)
          }
        } else {
          next()
        }
      }
    } else {
      // 未登录
      if (WHITE_LIST.includes(to.path)) {
        next()
      } else {
        next(`/login?redirect=${to.path}`)
      }
    }
  })

  router.afterEach(() => {
    NProgress.done()
  })
}
```

### 7.5 权限指令

```js
// src/directives/permission.ts
import type { App, Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores/user'

const permissionDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const userStore = useUserStore()
    const requiredPerms = Array.isArray(binding.value)
      ? binding.value
      : [binding.value]

    const hasPermission = requiredPerms.some((perm) =>
      userStore.hasPermission(perm)
    )

    if (!hasPermission) {
      el.parentNode?.removeChild(el)
    }
  },
}

export function setupPermissionDirective(app: App) {
  app.directive('permission', permissionDirective)
}
```

在模板中这样使用：

```html
<template>
  <div class="user-management">
    <el-button
      v-permission="'system:user:add'"
      type="primary"
      @click="handleAdd"
    >
      新增用户
    </el-button>

    <el-table :data="userList">
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button
            v-permission="'system:user:edit'"
            link type="primary"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            v-permission="'system:user:delete'"
            link type="danger"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
```

> **小贴士**：`v-permission` 指令只能控制按钮的"显示/隐藏"，但挡不住用户手动调接口。所以后端的 `@PreAuthorize` 才是真正的安全防线。前端权限控制本质上是**用户体验优化**，后端权限控制才是**安全保障**。两手都要抓，两手都要硬。

------

## 八、跨域处理

![图片](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260412111446985.webp)

### 开发环境：Vite Proxy

```js
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

### 生产环境：后端 CORS 配置

```java
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.addExposedHeader("Authorization");
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

### 生产环境：Nginx 配置（推荐）

```nginx
server {
    listen       80;
    server_name  your-domain.com;

    # 前端静态资源
    location / {
        root   /usr/share/nginx/html;
        index  index.html;
        try_files $uri $uri/ /index.html;  # SPA 必须！
    }

    # 后端 API 反向代理
    location /api/ {
        proxy_pass http://backend:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket 支持（如果需要）
    location /ws/ {
        proxy_pass http://backend:8080/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

> **划重点**：`try_files $uri $uri/ /index.html` 这行配置是 SPA 的生命线。没有它，用户刷新页面就是一片 404 的汪洋大海。

------

## 九、部署架构

![图片](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260412111625077.webp)

### Docker Compose 一键部署

```yml
# docker-compose.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
      - ./frontend/dist:/usr/share/nginx/html
    depends_on:
      - backend
    networks:
      - app-network

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/db_admin?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
      - SPRING_DATASOURCE_PASSWORD=123456
      - SPRING_DATA_REDIS_HOST=redis
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - app-network

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: db_admin
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
      - ./sql/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - app-network

volumes:
  mysql-data:
  redis-data:

networks:
  app-network:
    driver: bridge
```



## 十、血泪经验总结

### 10.1 安全篇

![图片](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260412111708016.webp)

### 10.2 前后端协作的 10 条军规

| #    | 规则               | 说明                                                      |
| ---- | ------------------ | --------------------------------------------------------- |
| 1    | **统一响应格式**   | `{ code, message, data, timestamp }` 雷打不动             |
| 2    | **统一错误码**     | 系统级 `<` 1000，业务级 `≥` 1000，前端用 code 做逻辑判断  |
| 3    | **RESTful 风格**   | GET 查询、POST 新增、PUT 修改、DELETE 删除                |
| 4    | **接口版本化**     | `/api/v1/users`，SpringBoot 4 原生支持 API 版本化         |
| 5    | **时间格式统一**   | ISO 8601：`2026-04-12T10:30:00+08:00`                     |
| 6    | **分页参数统一**   | `page`（从 1 开始）+ `size`，返回 `total`                 |
| 7    | **枚举值传数字**   | 前端不应该传 "ACTIVE"，而应该传 `1`                       |
| 8    | **字段命名统一**   | 后端 `snake_case` ↔ 前端 `camelCase`，JSON 序列化自动转换 |
| 9    | **Token 续期透明** | 对用户无感知，前端 Axios 拦截器自动处理                   |
| 10   | **接口文档先行**   | 用 Swagger / Knife4j 生成文档                             |

### 10.3 性能优化清单

```yml
// 1. SpringBoot 4 虚拟线程
// application.yml
spring:
  threads:
    virtual:
      enabled: true  // 开启虚拟线程，I/O 密集型操作直接起飞
```

```java
// 2. SpringBoot 4 声明式 HTTP 客户端
@HttpExchange(url = "/api/v1")
public interface ExternalApiClient {

    @GetExchange("/users/{id}")
    UserDTO getUser(@PathVariable Long id);

    @PostExchange("/notifications")
    void sendNotification(@RequestBody NotificationRequest request);
}
```

```java
// 3. Redis 缓存热点数据
@Cacheable(value = "user:permissions", key = "#userId", unless = "#result == null")
public List<String> getUserPermissions(Long userId) {
    return menuMapper.selectPermissionsByUserId(userId);
}
```



## 十一、常见问题及解决方案

### 1：前端刷新页面后 Pinia 状态丢失

**症状**：用户登录后刷新页面，直接被踢到登录页。

**原因**：Pinia 状态存在内存里，刷新就没了。

**解决方案**：Token 存 `localStorage`，用户信息在路由守卫中重新拉取。

```js
// 路由守卫中的关键逻辑
if (userStore.isLoggedIn && !userStore.userInfo) {
  // Token 在，但用户信息没了（刷新导致） → 重新拉取
  await userStore.fetchUserInfo()
}
```

### 2：多个请求同时 401，Token 被刷新多次

**症状**：页面同时发了 5 个请求，AccessToken 都过期了，RefreshToken 被调了 5 次。

**解决方案**：用 `isRefreshing` 标志位 + 请求队列，确保只刷新一次（前面 Axios 封装已实现）。



### 3：Spring Security 的过滤器顺序问题

**症状**：CORS 预检请求（OPTIONS）被 Security 拦截，返回 401/403。

**解决方案**：确保 `CorsFilter` 在 `SecurityFilterChain` 之前执行：

```java
// 方案一：在 SecurityConfig 中配置 cors
http.cors(cors -> cors.configurationSource(corsConfigurationSource()));

// 方案二：注册高优先级的 CorsFilter Bean
@Bean
@Order(Ordered.HIGHEST_PRECEDENCE)
public CorsFilter corsFilter() { ... }
```

### 4：JWT Token 太大导致 Header 超限

**症状**：把用户所有角色、权限、菜单都塞进 JWT，Header 超过 Nginx 的 8KB 限制。

**解决方案**：JWT 只存必要信息（userId、username），权限数据从 Redis 取。

```js
✅ JWT payload: { sub: "admin", userId: 1, exp: ... }          → ~200 bytes
❌ JWT payload: { sub: "admin", userId: 1, roles: [...], 
                  permissions: [...50个...], menus: [...] }    → 可能 > 8KB
```



## 十二、总结与全链路数据流

![图片](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260412112120353.webp)

用一张图总结整个请求的生命旅程：

1. **用户操作** → Vue3 组件触发事件
2. **API 调用** → Axios 请求拦截器自动附加 JWT Token
3. **网络传输** → Nginx 反向代理分发请求
4. **安全过滤** → JWT 过滤器验证 Token，加载用户认证信息
5. **权限校验** → `@PreAuthorize` 检查是否有操作权限
6. **业务处理** → Controller → Service → Mapper
7. **数据返回** → 统一 `R<T>` 响应体封装
8. **前端处理** → Axios 响应拦截器统一处理 code，展示数据或错误提示



最后：

> 前后端分离不是把一个项目拆成两个 Git 仓库就完事了。它是一种**架构思想**，要求前后端团队在**接口规范、认证方案、错误处理、权限模型**等达成高度一致。
