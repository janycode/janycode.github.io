---
title: 08-SSO单点登录sa-token接入流程
date: 2025-03-01 21:11:06
index_img: https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250217171430.png
tags:
- 架构设计
- 系统设计
categories: 
- 17_项目设计
- 01_业务设计
---

![image-20250217171428798](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250217171430.png)



参考资料：

* sa-token 开源官网：https://sa-token.cc/
* sa-token 官方文档：https://sa-token.cc/doc.html#/
* 接入文档：https://blog.csdn.net/Xixi0864/article/details/137650195
* Sa-Token圣经，史上最全的权限设计方案：https://mp.weixin.qq.com/s/l_k-tX-3JEQfvsy0xMukUw



## Sa-Token介绍

> Sa-Token 是一个轻量级 Java 权限认证框架，主要解决：登录认证、权限认证、单点登录、OAuth2.0、分布式Session会话、微服务网关鉴权 等一系列权限相关问题。
>
> Sa-Token 目前主要五大功能模块：登录认证、权限认证、单点登录、OAuth2.0、微服务鉴权。



## 一、创建和配置

### 1.创建SpringBoot项目

创建项目很简单，使用Mybatis-plus框架，可以根据数据库直接生成三层类。

### 2.添加Sa-Token依赖

```xml
<!-- Sa-Token 权限认证，在线文档：https://sa-token.cc -->
<dependency>
    <groupId>cn.dev33</groupId>
    <artifactId>sa-token-spring-boot-starter</artifactId>
    <version>1.40.0</version>
</dependency>
```



### 3.设置配置文件

有两种配置文件，风格不一样，选择自己喜欢的，新手的话建议选择.properties风格的

> 核心包所有可配置项，在需要时查看即可，参考sa-token[框架配置](https://sa-token.cc/doc.html#/use/config)

下面配置文件的风格是application.yml风格的

```yml
server:
    # 端口
    port: 8081
    
#配置mysql
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/sa-token-db?useSSL=false&serverTimezone=GMT%2B8&characterEncoding=UTF8&useUnicode=true
    username: root
    password: root
    type: com.alibaba.druid.pool.DruidDataSource
    druid:
      remove-abandoned: true
      time-between-eviction-runs-millis: 60000
      remove-abandoned-timeout-millis: 1800
############## Sa-Token 配置 (文档: https://sa-token.cc) ##############
sa-token: 
    # token 名称（同时也是 cookie 名称）
    token-name: satoken
    # token 有效期（单位：秒） 默认30天，-1 代表永久有效
    timeout: 2592000
    # token 最低活跃频率（单位：秒），如果 token 超过此时间没有访问系统就会被冻结，默认-1 代表不限制，永不冻结
    active-timeout: -1
    # 是否允许同一账号多地同时登录 （为 true 时允许一起登录， 为 false 时新登录挤掉旧登录）
    is-concurrent: true
    # 在多人登录同一账号时，是否共用一个 token （为 true 时所有登录共用一个 token， 为 false 时每次登录新建一个 token）
    is-share: true
    # token 风格（默认可取值：uuid、simple-uuid、random-32、random-64、random-128、tik）
    token-style: uuid
    # 是否输出操作日志 
    is-log: true
```

下面的配置文件风格是application.properties风格的

```properties
# 端口
server.port=8081
    
############## Sa-Token 配置 (文档: https://sa-token.cc) ##############

# token 名称（同时也是 cookie 名称）
sa-token.token-name=satoken
# token 有效期（单位：秒） 默认30天，-1 代表永久有效
sa-token.timeout=2592000
# token 最低活跃频率（单位：秒），如果 token 超过此时间没有访问系统就会被冻结，默认-1 代表不限制，永不冻结
sa-token.active-timeout=-1
# 是否允许同一账号多地同时登录 （为 true 时允许一起登录， 为 false 时新登录挤掉旧登录）
sa-token.is-concurrent=true
# 在多人登录同一账号时，是否共用一个 token （为 true 时所有登录共用一个 token， 为 false 时每次登录新建一个 token）
sa-token.is-share=true
# token 风格（默认可取值：uuid、simple-uuid、random-32、random-64、random-128、tik）
sa-token.token-style=uuid
# 是否输出操作日志 
sa-token.is-log=true
```

### 4.创建启动类

在项目中新建包 com.xxx 在这个包内创建主类:SaTokenDemoApplication

```java
@SpringBootApplication
public class SaTokenDemoApplication {
    public static void main(String[] args) throws JsonProcessingException {
        SpringApplication.run(SaTokenDemoApplication.class, args);
        System.out.println("启动成功，Sa-Token 配置如下：" + SaManager.getConfig());
    }
}
```


创建好后的项目是这样的，此时可以启动一下，看一下有没有报错

![image-20250218095742939](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218095744.png)

启动成功：

![image-20250218105145415](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218105146.png)

### 5.创建数据库文件

```sql
CREATE TABLE `users`  (
  `user_id` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(125) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码',
  `user_name` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户姓名',
  `permission_level` int(11) NOT NULL DEFAULT 0 COMMENT '权限等级',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否被删除',
  `create_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `update_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  `cellphone_number` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '手机号',
  `user_type` int(10) NULL DEFAULT NULL COMMENT '用户类型:1超级管理员,2管理员,3运维人员,4工人,5游客',
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;
```

创建数据库，执行SQL语句

![image-20250218113007458](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218113008.png)

### 6.引入依赖

引入本次教程所需要的所有依赖，除了上面已经引入过的Sa-Token依赖。

```xml
    <!--mybatis plus 依赖 -->
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-boot-starter</artifactId>
        <version>3.3.1.tmp</version>
    </dependency>
    <!-- 阿里巴巴的Druid数据源依赖启动器 -->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid-spring-boot-starter</artifactId>
        <version>1.1.22</version>
    </dependency>
    <!-- mysql -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.21</version>
    </dependency>
    <!-- mybatis-plus  模板引擎-->
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-generator</artifactId>
        <version>3.3.1.tmp</version>
    </dependency>
    <!-- 添加 模板引擎 依赖 -->
    <dependency>
        <groupId>org.apache.velocity</groupId>
        <artifactId>velocity-engine-core</artifactId>
        <version>2.2</version>
    </dependency>
    <!-- lombok 生成set get -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.10</version>
    </dependency>
    <!--hutool工具包-->
    <dependency>
        <groupId>cn.hutool</groupId>
        <artifactId>hutool-all</artifactId>
        <version>5.8.12</version>
    </dependency>
```


### 7.创建数据库文件自动生成类

因为我们要使用mybatis-plus框架，而这个框架可以自动根据数据库表生成三层类，所以我们要有一个自动生成代码文件的类

#### 7.1 生成代码类

需要修改部分代码，下面注释有:**TODO:(需要修改)**的地方都要修改成自己的

启动这个类之前需要先启动主类，然后才可以运行这个生成代码类

```java
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.config.DataSourceConfig;
import com.baomidou.mybatisplus.generator.config.GlobalConfig;
import com.baomidou.mybatisplus.generator.config.PackageConfig;
import com.baomidou.mybatisplus.generator.config.StrategyConfig;
import com.baomidou.mybatisplus.generator.config.rules.DateType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;

// 生成mybatis-plus 相关的 controller  service dao  实体类  ===  easycode
public class TestAutoGenerate {
    public static void main(String[] args) {

        // Step1：代码生成器
        AutoGenerator mpg = new AutoGenerator();

        // Step2：全局配置
        GlobalConfig gc = new GlobalConfig();
        // 填写代码生成的目录(需要修改)!!!!!!!!!!!!!!!!!!!!!!!!!!
        // TODO:(需要修改)，修改成你自己的项目所在的目录
        String projectPath = "D:\\code\\yuxing_film\\sa-token-demo-springboot";
        // 拼接出代码最终输出的目录
        gc.setOutputDir(projectPath + "/src/main/java");
        // 配置开发者信息（可选）（需要修改）!!!!!!!!!!!!!
        // TODO:(需要修改)，可以改成自己的名字
        gc.setAuthor("zcj");
        // 配置是否打开目录，false 为不打开（可选）
        gc.setOpen(false);
        // 实体属性 Swagger2 注解，添加 Swagger 依赖，开启 Swagger2 模式（可选）
        //gc.setSwagger2(true);
        // 重新生成文件时是否覆盖，false 表示不覆盖（可选）
        gc.setFileOverride(false);
        // 配置主键生成策略，此处为 ASSIGN_ID（可选）
        gc.setIdType(IdType.ASSIGN_ID);
        // 配置日期类型，此处为 ONLY_DATE（可选）
        gc.setDateType(DateType.ONLY_DATE);
        // 默认生成的 service 会有 I 前缀
        gc.setServiceName("%sService");
        mpg.setGlobalConfig(gc);

        // Step3：数据源配置（需要修改）
        DataSourceConfig dsc = new DataSourceConfig();
        // 配置数据库 url 地址!!!!!!!!!!!
        // TODO:(需要修改)
        dsc.setUrl("jdbc:mysql://localhost:3306/sa-token-db?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai&characterEncoding=UTF-8");
        // dsc.setSchemaName("testMyBatisPlus"); // 可以直接在 url 中指定数据库名
        // 配置数据库驱动
        dsc.setDriverName("com.mysql.cj.jdbc.Driver");
        // 配置数据库连接用户名!!!!!!!!!!!!!!!!
        // TODO:(需要修改)
        dsc.setUsername("root");
        // 配置数据库连接密码!!!!!!!!!!!!!!!!!
        // TODO:(需要修改)
        dsc.setPassword("root");
        mpg.setDataSource(dsc);

        // Step:4：包配置
        PackageConfig pc = new PackageConfig();
        // 配置父包名（需要修改）
        // TODO:(需要修改)
        pc.setParent("com");
        // 配置模块名（需要修改）
        // TODO:(需要修改)
        pc.setModuleName("pj");
        // 配置 entity 包名
        pc.setEntity("entity");
        // 配置 mapper 包名
        pc.setMapper("mapper");
        // 配置 service 包名
        pc.setService("service");
        // 配置 controller 包名
        pc.setController("controller");
        mpg.setPackageInfo(pc);

        // Step5：策略配置（数据库表配置）
        StrategyConfig strategy = new StrategyConfig();

        // student_tb 针对学生表 生成 增删改查 controller service  dao  entity
        //  *    针对所有的表生成增删改查   !!!!!!!!!!!!
        //  TODO:(需要修改)，修改成自己要生成的数据库表名
        strategy.setInclude("users");

        // 配置数据表与实体类名之间映射的策略
        strategy.setNaming(NamingStrategy.underline_to_camel);
        // 配置数据表的字段与实体类的属性名之间映射的策略
        strategy.setColumnNaming(NamingStrategy.underline_to_camel);
        // 配置 lombok 模式
        strategy.setEntityLombokModel(true);
        // 配置 rest 风格的控制器（@RestController）
        strategy.setRestControllerStyle(true);
        // 配置驼峰转连字符
        strategy.setControllerMappingHyphenStyle(true);
        // 配置表前缀，生成实体时去除表前缀
        // 此处的表名为 test_mybatis_plus_user，模块名为 test_mybatis_plus，去除前缀后剩下为 user。
        strategy.setTablePrefix(pc.getModuleName() + "_");
        mpg.setStrategy(strategy);

        // Step6：执行代码生成操作
        mpg.execute();
    }
}
```

生成完成，在com.pj包下自动生成了下列文件，需要把mapper/xml/UsersMapper.xml文件放到resources/mapper文件夹内，没有这个文件夹的话，就创建一个

![image-20250218113138349](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218113139.png)

最终的目录是这样的

![image-20250218113230547](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218113231.png)

## 二、登录认证

OK，准备工作已经做完了，现在需要进行登录认证，登陆之前我们肯定要有用户，所以我们先创建一个用户，创建一个新增用户的接口，供后续登录使用

解决启动类报错问题

> 引入了mybatis-plus框架之后，需要在启动类上加个注解**@MapperScan(“com.pj.mapper”)**括号内是自己的mapper包，该包要被spring扫描到，否则启动会报错.

SaTokenDemoApplication.java类

```java
@SpringBootApplication
@MapperScan("com.pj.mapper")
public class SaTokenDemoApplication {
    public static void main(String[] args) throws JsonProcessingException {
        SpringApplication.run(SaTokenDemoApplication.class, args);
        System.out.println("启动成功，Sa-Token 配置如下：" + SaManager.getConfig());
    }
}
```

### 1.创建新增用户接口

UsersController.java类

```java
@RestController
@RequestMapping("/user")
public class UsersController {
    @Autowired
    private UsersService usersService;
    /**
     * 新增用户
     */
    @PostMapping("/savaUser")
    public R<String> savaUser(@RequestBody Users user) {
        return usersService.savaUser(user);
    }
    /**
     * 查询全部用户，下面这个方法也是mybatis-plus自带的查询方法，很方便
     */
    @GetMapping("/selectAllUser")
    public List<Users> queryAllUser() {
        return usersService.list();
    }
}
```

UsersServiceImpl.java类

该类是业务层，实现了UsersService接口，在此省略此接口的内容，

该类中有用到PasswordUtil.java工具类，这个工具类的作用是对明文密码进行加密，对加密密码进行解密并对比

```java
@Service
public class UsersServiceImpl extends ServiceImpl<UsersMapper, Users> implements UsersService {

    @Autowired
    private UsersMapper usersMapper;

    @Override
    public R<String> savaUser(Users user) {
        // TODO:mybatis-plus自带的有部分增删改查方法，所以mapper.java类就没有写下面那两个方法，该方法是自带的
        //查询数据库中是否有相同的用户
        if (usersMapper.selectById(user.getUserId()) != null){
            return R.failed("新增用户失败，用户已存在");
        }
        Users users = new Users();
        users.setUserId(user.getUserId());
        users.setUserName(user.getUserName());
        //密码加密存储到数据库中
        String hashedPassword = PasswordUtil.encryptPassword(user.getPassword());
        users.setPassword(hashedPassword);
        users.setUserType(user.getUserType());
        int insert = usersMapper.insert(users);
        if (insert <= 0){
            return R.failed("新增用户失败");
        }
        return R.ok("新增用户成功");
    }
}
```

PasswordUtil.java工具类

```java
public class PasswordUtil {
    /**
     * 加密密码
     *
     * @param plainTextPassword 明文密码
     * @return 加密后的密码哈希值
     */
    public static String encryptPassword(String plainTextPassword) {
        return BCrypt.hashpw(plainTextPassword, BCrypt.gensalt());
    }

    /**
     * 验证密码
     *
     * @param plainTextPassword 明文密码
     * @param hashedPassword   储存在数据库中的密码哈希值
     * @return 如果密码匹配，返回true，否则返回false
     */
    public static boolean verifyPassword(String plainTextPassword, String hashedPassword) 	  {
        return BCrypt.checkpw(plainTextPassword, hashedPassword);
    }
}
```

### 2.测试新增用户接口

接下来让我们重启一下项目，使用测试工具测试一下接口是否可用
调用该接口是成功的

![image-20250218133830973](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218133832.png)

> 数据库中也有这条数据，userType属性，后续使用权限校验会用到

![image-20250218134109920](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218134110.png)

接下来，我们就可以测试Sa-Token自带的登录认证了

### 3.配置拦截器

在com.pj包下创建一个config包，在这个config包内创建SaTokenConfig.java配置类，配置我们的拦截器

配置sa-token拦截器，会自动拦截登录接口之外的所有请求，检查有没有携带正确的Cookie，正确则放行，错误则爆出异常，异常码500，前端可以根据这个状态码来做一些操作.

只有登录过后，才能请求其他接口:

```java
@Configuration
public class SaTokenConfig implements WebMvcConfigurer {

    /**
     * 拦截器
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 注册 Sa-Token 拦截器，校验规则为 StpUtil.checkLogin() 登录校验。
        registry.addInterceptor(new SaInterceptor(handle -> StpUtil.checkLogin()))
                    .addPathPatterns("/**") // 拦截所有请求
                    .excludePathPatterns("/user/login"); // 放行登录接口
    }
}
```

### 4.创建login登录接口

登录接口最好是重新创建一个controller类，service接口，以及接口的Impl实现类，我们为了节约时间，就直接在UsersController层编写了

首先创建一个LoginService接口和接口的实现类LoginServiceImpl

在这两个类里面实现登录认证

UsersController.java类

在这个类后面追加一个登录接口


```java
/**
 * 登录
 */
@PostMapping("/login")
public R login(@RequestBody LoginBody loginBody){
    return usersService.login(loginBody);
}
```

UsersServiceImpl接口

因为controller层调用的是usersService接口，所以我们在这里面编写具体的登录代码

```java
/**
 * 登录
 */
@Override
public R login(LoginBody loginBody) {
    // 第一步:首先判断一下入参是否为空
    if (loginBody == null || loginBody.getUserName().isEmpty() || loginBody.getPassword().isEmpty()){
        return R.failed("用户名或密码为空");
    }
    // 第二步:不为空的话，检查密码是否正确，根据用户名去数据库查找对应的用户信息，得到存储的暗文密码
    QueryWrapper<Users> usersQueryWrapper = new QueryWrapper<>();
    usersQueryWrapper.eq("user_name",loginBody.getUserName());
    Users user = usersMapper.selectOne(usersQueryWrapper);
    String password = user.getPassword();
    if (!PasswordUtil.verifyPassword(loginBody.getPassword(),password)){
        return R.failed("密码错误");
    }
    // 第三步:使用sa-token登录认证
    StpUtil.login(loginBody.getUserName());
    // 第四步:获取登录认证的token，返回前端
    // 获取 Token  相关参数
    SaTokenInfo tokenInfo = StpUtil.getTokenInfo();
    SaResult data = SaResult.data(tokenInfo);
    return R.ok(data);
}
```
### 5.测试登录接口

测试登录接口，登录成功

![image-20250218134225917](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218134226.png)

因为我们配置了拦截器，只有先登录之后，才可以访问查询接口

![image-20250218134336117](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218134337.png)

### 6.测试登录认证功能

此时我们重启项目，直接访问查询接口

这是没有登录的情况，直接报错了，项目每次重新都要先登录，否则无法访问其他的接口

由此可见，我们配置的sa-token登录认证功能和配置的拦截器是生效的

![image-20250218134358629](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218134359.png)

## 三、权限校验

### 1.改造登录代码，授予用户权限

简单介绍:

> 权限校验是针对不同的用户来说的，管理员用户拥有所有的接口访问权限，包括增删改查.但是对于别的用户，比如访客来说，就只能查看数据，不能进行增删改，所以我们需要针对每个用户的不同，赋予每个用户不同的权限，然后在访问改接口的时候校验权限，如果有该权限的话，就允许访问该接口，否则不行!

接下来我们对登录业务层代码进行改造，针对当前登录用户，给予不同的权限

UsersServiceImpl.java类

上帝权限

当一个账号拥有 "`*`" 权限时，他可以验证通过任何权限码 （角色认证同理）

```java
/**
 * 登录
 */
@Override
public R login(LoginBody loginBody) {

    // 第一步:首先判断一下入参是否为空
    if (loginBody == null || loginBody.getUserName().isEmpty() || loginBody.getPassword().isEmpty()){
        return R.failed("用户名或密码为空");
    }

    // 第二步:不为空的话，检查密码是否正确，根据用户名去数据库查找对应的用户信息，得到存储的暗文密码
    QueryWrapper<Users> usersQueryWrapper = new QueryWrapper<>();
    usersQueryWrapper.eq("user_name",loginBody.getUserName());
    Users user = usersMapper.selectOne(usersQueryWrapper);
    String password = user.getPassword();
    if (!PasswordUtil.verifyPassword(loginBody.getPassword(),password)){
        return R.failed("密码错误");
    }

    // 第三步:使用sa-token登录认证
    StpUtil.login(loginBody.getUserName());

    //第四步:根据用户角色不的不同，赋予不同的权限
    List<String> permissionListResult = setUsernamePermission(user.getUserType());
    // 把该用户的权限存储到 Sa-Token的session中
    StpUtil.getSession().set("permissionList", permissionListResult);

    // 第五步:获取登录认证的token,返回前端
    SaTokenInfo tokenInfo = StpUtil.getTokenInfo();
    SaResult data = SaResult.data(tokenInfo);
    return R.ok(data);
}

/**
 * 根据用户类型的不同授予不同的权限
 * 1:管理员 2:访客
 */
public List<String> setUsernamePermission(Integer userType){
    ArrayList<String> permissionList = new ArrayList<>();
    switch (userType){
        case 1:
            // 1:代表管理员权限,拥有所有权限
            permissionList.add("*");
            return permissionList;
        case 2:
            // 2:代表访客权限,可以查看用户信息,不能增删改用户信息
            Collections.addAll(permissionList, "/select");
            return permissionList;
        default:
            return null;
    }
}
```

### 2.新建一个类，实现 StpInterface接口

创建interceptor包，把这个类放到这个包里面

该类实现了StpInterface接口，Sa-Token框架在这个接口内做了一下权限校验的操作，只需要获取权限列表就可以了

```java
@Component
public class StpInterfaceImpl implements StpInterface {
    /**
     * 返回指定账号id所拥有的权限码集合
     *
     * @param loginId   账号id
     * @param loginType 账号类型
     * @return 该账号id具有的权限码集合
     */
    @Override
    public List<String> getPermissionList(Object loginId, String loginType) {
        // 从session中获取权限列表
        return (List<String>) StpUtil.getSession().get("permissionList");
    }

    /**
     * 返回指定账号id所拥有的角色标识集合
     *
     * @param loginId   账号id
     * @param loginType 账号类型
     * @return 该账号id具有的角色标识集合
     */
    @Override
    public List<String> getRoleList(Object loginId, String loginType) {
        // 本list仅做模拟，实际项目中要根据具体业务逻辑来查询角色
        List<String> list = new ArrayList<String>();
        list.add("admin");
        list.add("super-admin");
        return list;
    }
}
```

### 3.在控制层方法内设置访问权限

UsersController.java

只需要添加一行代码即可（也可以改良为自定义注解形式去拦截接口的请求权限，sa-token也提供了[注解鉴权](https://sa-token.cc/doc.html#/use/at-check)）

更具体的权限认证操作可以访问Sa-Token官网: [权限认证 (sa-token.cc)](https://sa-token.cc/doc.html#/use/jur-auth)

```java
/**
 * 新增用户
 */
@PostMapping("/savaUser")
public R<String> savaUser(@RequestBody Users user) {
    // 新增用户需要/insert权限
    StpUtil.checkPermission("/insert");
    return usersService.savaUser(user);
}
/**
 * 查询全部用户
 */
@GetMapping("/selectAllUser")
public List<Users> queryAllUser() {
    // 查询全部用户需要/select权限
    StpUtil.checkPermission("/select");
    return usersService.list();
}
```

### 4.测试权限校验

我们针对两个用户分别测试，管理员和访客，所以需要增加一个测试用户，用户类型设置为访客，也就是2

此时我们新增用户，却发现，报错了，500，也就是未登录，Sa-Token框架检测到我们没有登录就想要访问新增接口，这是不允许的，所以我们需要先登录

![image-20250218134736377](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218134737.png)

登录过后，在新增用户.成功

![image-20250218134752699](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218134753.png)

#### 4.1 测试管理员权限

此时我们有了两个用户，我们先测试一下管理员的权限，测试方法很简单，用管理员的账号登录，然后访问新增和查询接口，看看是不是都能访问成功

* 第一步:我们先用管理员账户登录，登录成功

![image-20250218134846379](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218134847.png)

* 第二步:访问查询和新增接口

  可以看到，新增接口访问成功，新增加了一个用户，我们可以查询全部用户看一下是否新增成功

![image-20250218134914102](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218134914.png)

可以看到，test2用户是新增成功的，

管理员拥有*上帝权限，可以访问所有的接口，以 /selectAllUser 为例：

![image-20250218134939125](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218134940.png)

接下来，让我们测试访客权限

#### 4.2 测试访客权限

测试方法也很简单，用访客的账号登录，然后访问新增和查询接口，看看是不是都能访问成功

* 第一步:使用test访客账号登录

登录成功

![image-20250218135046627](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218135047.png)

* 第二步:访问新增接口，新增一个用户test3

没有权限，添加失败

![image-20250218135110756](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218135111.png)

此时我们再访问一下查询接口

是访问成功的，和管理员权限访问的结果一样

![image-20250218135136300](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218135137.png)

可以看到，我们设置的权限校验功能是成功的。



> 上述内容只是做简单的验证，实际情况根据业务所需去设计和使用sa-token。
>
> 比如参考如下方案，做统一认证中心，从源头上解决单点登录的场景需求。

## 附：SSO单点登录统一认证中心

Sa-Token-SSO 由简入难划分为三种模式，解决不同架构下的 SSO 接入问题：

| 系统架构                    | 采用模式 | 简介                 | 文档链接                                                     |
| --------------------------- | -------- | -------------------- | ------------------------------------------------------------ |
| 前端同域 + 后端同 Redis     | 模式1    | 共享 Cookie 同步会话 | [文档](https://sa-token.cc/doc.html#/sso/sso-type1)、[示例](https://gitee.com/dromara/sa-token/blob/master/sa-token-demo/sa-token-demo-sso/sa-token-demo-sso1-client) |
| 前端不同域 + 后端同 Redis   | 模式2    | URL重定向传播会话    | [文档](https://sa-token.cc/doc.html#/sso/sso-type2)、[示例](https://gitee.com/dromara/sa-token/blob/master/sa-token-demo/sa-token-demo-sso/sa-token-demo-sso2-client) |
| 前端不同域 + 后端不同 Redis | 模式3    | Http请求获取会话     | [文档](https://sa-token.cc/doc.html#/sso/sso-type3)、[示例](https://gitee.com/dromara/sa-token/blob/master/sa-token-demo/sa-token-demo-sso/sa-token-demo-sso3-client) |

1. 前端同域：就是指多个系统可以部署在同一个主域名之下，比如：`c1.domain.com`、`c2.domain.com`、`c3.domain.com`。
2. 后端同Redis：就是指多个系统可以连接同一个Redis。PS：这里并不需要把所有项目的数据都放在同一个Redis中，Sa-Token提供了 **`[权限缓存与业务缓存分离]`** 的解决方案，详情： [Alone独立Redis插件](https://sa-token.cc/doc.html#/plugin/alone-redis)。
3. 如果既无法做到前端同域，也无法做到后端同Redis，那么只能走模式三，Http请求获取会话（Sa-Token对SSO提供了完整的封装，你只需要按照示例从文档上复制几段代码便可以轻松集成）。

### 模式1：前端同域、后端同Redis

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218153917.gif)

### 模式2：前端不同域、后端同Redis

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218154108.gif)

### 模式3：前端不同域、后端不同Redis

在模式2中我们只需要将需要同步的资料放到 SaSession 即可，但是在模式3中两端不再连接同一个 Redis，这时候我们需要通过 http 接口来同步信息。



### 无刷单点注销

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218160048.gif)

所谓单点登录，其本质就是`多个系统之间的会话共享`。

当我们理解这一点之后，三种模式的工作原理也浮出水面：

- 模式一：采用共享 Cookie 来做到前端 Token 的共享，从而达到后端的 Session 会话共享。
- 模式二：采用 URL 重定向，以 ticket 码为授权中介，做到多个系统间的会话传播。
- 模式三：采用 Http 请求主动查询会话，做到 Client 端与 Server 端的会话同步。



### 前后端分离架构下的整合

https://sa-token.cc/doc.html#/sso/sso-h5

