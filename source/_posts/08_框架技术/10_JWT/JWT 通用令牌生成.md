---
title: JWT 通用令牌生成
date: 2020-03-02 17:59:44
tags:
- JWT
categories: 
- 08_框架技术
- 10_JWT
---

![image-20200801152515482](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200801152516.png)

官网：https://jwt.io/



### 1. 简介

JWT:Json Web Tokens 通用令牌生成算法。JSON Web令牌是一种开放的行业标准 RFC 7519方法，用于在双方之间安全地表示声明。重要、安全要求较高的信息交互，可以采用JWT算法。  

* **Header** - 头
    json格式
    头部信息：声明签名涉及的加密方式、令牌生成算法(JWT)
* **PayLoad** - 有效荷载
    json格式
    内容信息：用户信息或者是令牌的信息
* **Sign** - 签名
    签名信息：是根据头和内容对应的base64url格式，经过指定加密算法生成的密文

> JWT的结果：
>
> `header的json字符串的Base64URL字符串`.`PayLoad的json字符串的Base64URL字符串`.`签名`

![image-20200801152404580](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200801152405.png)



### 2. JWT 工具类

* 依赖

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.9.1</version>
</dependency>
```

* 封装工具类

```java
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Date;
import java.util.UUID;

public class JwtUtil {

    /**
     * 以JWT算法生成密文
     *
     * @param msg 需要加密的字符串
     */
    public static String createJWT(String msg) {
        //实例化 建造器对象
        JwtBuilder jwtBuilder = Jwts.builder();
        //设置内容信息
        jwtBuilder.setId(UUID.randomUUID().toString().replaceAll("-", ""));
        jwtBuilder.setIssuedAt(new Date());
        jwtBuilder.setSubject(msg);
        //jwtBuilder.setExpiration() //设置结束时间
        //设置加密的方式
        jwtBuilder.signWith(SignatureAlgorithm.HS256, createKey());
        //生成密文
        return jwtBuilder.compact();
    }

    /**
     * 解析JWT生成的密文
     */
    public static String parseJWT(String msg) {
        return Jwts.parser().setSigningKey(createKey()).parseClaimsJws(msg).getBody().getSubject();
    }

    /**
     * 生成秘钥
     */
    private static SecretKey createKey() {
        String key = "jwt_test_1234";
        return new SecretKeySpec(key.getBytes(), "AES");
    }

    // test
    public static void main(String[] args) {
        String p = "123456";
        String jw = JwtUtil.createJWT(p);
        System.out.println("token 密文：" + jw);
        System.out.println("token 解析：" + JwtUtil.parseJWT(jw));
    }
}
```

运行 main 测试：

![image-20201107233634072](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20201107233635.png)