---
title: 17_SpringBoot+MyBatis多数据源实现
date: 2023-01-06 15:57:43
tags:
- SpringBoot
- MyBatis
- 多数据源
categories: 
- 08_框架技术
- 04_SpringBoot
---

![image-20200708160944615](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200708160946.png)

参考资料：https://www.cnblogs.com/SweetCode/p/15591792.html



随着应用用户数量的增加，相应的并发请求的数量也会跟着不断增加，慢慢地，单个数据库已经没有办法满足频繁的数据库操作请求了，在某些场景下，可能会需要配置多个数据源，使用多个数据源(例如实现数据库的读写分离)来缓解系统的压力等，同样的，Springboot官方提供了相应的实现来帮助开发者们配置多数据源，一般分为两种方式(目前所了解到的)，分包和AOP。

考虑到mybatis是java开发使用较为频繁的数据库框架，所以使用Springboot+Mybatis来实现多数据源的配置。

## 1.数据库准备

既然是配置多数据源，那么自然就要先把相应的数据源给准备好，本地新建了两个数据库，如下表：

| 数据库          | 数据表    | 字段                                             |
| --------------- | --------- | ------------------------------------------------ |
| testdatasource1 | sys_user  | user_id(int), user_name(varchar) user_age（int） |
| testdatasource2 | sys_user2 | 同上                                             |

并分别插入两条记录，为了方便对比，其中testdatasource1为芳年25岁的张三， testdatasource2为芳年30岁的李四。

## 2.环境准备

首先新建一个Springboot项目，这里版本是2.1.7.RELEASE，并在pom文件中引入相关依赖：关键依赖如下:

```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>1.3.2</version>
</dependency>

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```

## 3.代码部分

### 3.1多数据源配置

首先呢，在Springboot的配置文件中配置的datasourse，和以往不一样的是，因为有两个数据源，所以要指定相关数据库的名称，其中主数据源为primary，次数据源为secondary如下:

```java
#配置主数据库
spring.datasource.primary.jdbc-url=jdbc:mysql://localhost:3306/testdatasource1?useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC&useSSL=false
spring.datasource.primary.username=root
spring.datasource.primary.password=root
spring.datasource.primary.driver-class-name=com.mysql.cj.jdbc.Driver

##配置次数据库
spring.datasource.secondary.jdbc-url=jdbc:mysql://localhost:3306/testdatasource2?useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC&useSSL=false
spring.datasource.secondary.username=root
spring.datasource.secondary.password=root
spring.datasource.secondary.driver-class-name=com.mysql.cj.jdbc.Driver


spring.http.encoding.charset=UTF-8
spring.http.encoding.enabled=true
spring.http.encoding.force=true
```

> 需要注意的是，Springboot2.0 在配置数据库连接的时候需要使用jdbc-url，如果只使用url的话会报
> jdbcUrl is required with driverClassName.错误。

新建一个配置类PrimaryDataSourceConfig，用于配置的主数据库相关的bean，代码如下:

```java
@Configuration
//basePackages:接口文件的包路径
@MapperScan(basePackages = "com.jdkcb.mybatisstuday.mapper.one", sqlSessionFactoryRef = "PrimarySqlSessionFactory")
public class PrimaryDataSourceConfig {

    @Bean(name = "PrimaryDataSource")
    // 表示这个数据源是默认数据源
    @Primary//这个一定要加，如果两个数据源都没有@Primary会报错
    @ConfigurationProperties(prefix = "spring.datasource.primary")//配置文件中的前缀
    public DataSource getPrimaryDateSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "PrimarySqlSessionFactory")
    @Primary
    public SqlSessionFactory primarySqlSessionFactory(@Qualifier("PrimaryDataSource") DataSource datasource)
            throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(datasource);
        bean.setMapperLocations( 
                new PathMatchingResourcePatternResolver().getResources("classpath*:mapping/one/*.xml"));
        return bean.getObject();// 设置mybatis的xml所在位置
    }

    @Bean("PrimarySqlSessionTemplate")
    // 表示这个数据源是默认数据源
    @Primary
    public SqlSessionTemplate primarySqlSessionTemplate(
            @Qualifier("PrimarySqlSessionFactory") SqlSessionFactory sessionfactory) {
        return new SqlSessionTemplate(sessionfactory);
    }

}
```

注解说明:

**`@MapperScan`** ：配置mybatis的接口类放的地方

**`@Primary`** :表示使用的是默认数据库，这个一个要加，否则会因为不知道哪个数据库是默认数据库而报错

**`@ConfigurationProperties`**：读取application.properties中的配置参数映射成为一个对象，其中prefix表示参数的前缀

大功告成~ ~ 了吗？并没有，然后配置的第二个数据源的配置类,代码如下：

```java
@Configuration
@MapperScan(basePackages = "com.jdkcb.mybatisstuday.mapper.two", sqlSessionFactoryRef = "SecondarySqlSessionFactory")
public class SecondaryDataSourceConfig {

    @Bean(name = "SecondaryDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.secondary")
    public DataSource getSecondaryDataSource() {
        return DataSourceBuilder.create().build();
    }
    @Bean(name = "SecondarySqlSessionFactory")
    public SqlSessionFactory secondarySqlSessionFactory(@Qualifier("SecondaryDataSource") DataSource datasource)
            throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(datasource);
        bean.setMapperLocations(
                new PathMatchingResourcePatternResolver().getResources("classpath*:mapping/two/*.xml"));
        return bean.getObject();// 设置mybatis的xml所在位置
    }
    @Bean("SecondarySqlSessionTemplate")
    public SqlSessionTemplate secondarySqlSessionTemplate(
            @Qualifier("SecondarySqlSessionFactory") SqlSessionFactory sessionfactory) {
        return new SqlSessionTemplate(sessionfactory);
    }
```

剩下的就是编写相应的xml文件和接口类了，代码如下:

```java
@Component
@Mapper
public interface PrimaryUserMapper {
    List<User> findAll();
}
```

```java
@Component
@Mapper
public interface SecondaryUserMapper {
    List<User> findAll();
}
```

相关的xml文件如下:

```java
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.jdkcb.mybatisstuday.mapper.one.PrimaryUserMapper">
    <select id="findAll" resultType="com.jdkcb.mybatisstuday.pojo.User">
                select * from sys_user;
    </select>
</mapper>


<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.jdkcb.mybatisstuday.mapper.two.SecondaryUserMapper">
    <select id="findAll" resultType="com.jdkcb.mybatisstuday.pojo.User">
                select * from sys_user2;
    </select>

</mapper>
```

> 注:其中xml文件在本实例中目录为：resources/mapping

### 2.测试

编写一个Controller用于测试，因为是测试实例且代码相对来说较为简单，所以这里就不写Service层了。

代码如下:

```java
@RestController
public class UserController {

    @Autowired
    private PrimaryUserMapper primaryUserMapper;
    @Autowired
    private SecondaryUserMapper secondaryUserMapper;
    @RequestMapping("/primary")
    public Object primary(){
        List<User> list = primaryUserMapper.findAll();
        return list;
    }
    
    @RequestMapping("/secondary")
    public Object secondary  (){
        List<User> list = secondaryUserMapper.findAll();
        return list;
    }


}
```

在浏览器分别输入:[http://127.0.0.1:8080/primary](https://link.zhihu.com/?target=http%3A//127.0.0.1%3A8080/primary) 和 [http://127.0.0.1:8080/secondary](https://link.zhihu.com/?target=http%3A//127.0.0.1%3A8080/secondary)

结果如下:

```json
[{"user_id":1,"user_name":"张三","user_age":25}] //primary 
[{"user_id":1,"user_name":"李四","user_age":30}] //secondary
```

