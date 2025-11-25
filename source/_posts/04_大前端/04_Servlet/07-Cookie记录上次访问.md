---
title: 07-Cookie记录上次访问
date: 2017-5-22 22:26:20
tags:
- Servlet
- Cookie
categories: 
- 04_大前端
- 04_Servlet
---

### 记录用户上一次访问时间

工具类：

```java
import javax.servlet.http.Cookie;

public class CookieUtils {
    public static Cookie getCookie(Cookie[] cookies, String cookieName) {
        if (cookies != null && cookies.length != 0) {
            for (Cookie ck : cookies) {
                if (cookieName.equals(ck.getName())) {
                    return ck;
                }
            }
        }
        return null;
    }
}
```



核心逻辑：

```java
    // 判断是否是第一次请求
    Cookie cookie = CookieUtils.getCookie(request.getCookies(), "lastTime");
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    if (null == cookie) {
        // 第一次访问，打印当前时间，并创建Cookie，存储当前时间
        Date date = new Date();
        System.out.println("第一次访问时间：" + sdf.format(date));
        cookie = new Cookie("lastTime", String.valueOf(date.getTime()));
    } else {
        // 不是第一次访问，从cookie取出上一次访问时间，并打印，获取当前时间，存储cookie中
        long currTimeMills = Long.parseLong(cookie.getValue());
        System.out.println("上一次访问时间：" + sdf.format(new Date(currTimeMills)));
        cookie.setValue(String.valueOf((new Date()).getTime()));
    }
    response.addCookie(cookie);
```
