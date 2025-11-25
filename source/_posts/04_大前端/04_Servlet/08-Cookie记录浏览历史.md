---
title: 08-Cookie记录浏览历史
date: 2017-5-22 22:26:20
tags:
- Servlet
- Cookie
categories: 
- 04_大前端
- 04_Servlet
---

### 记录商品的浏览历史信息

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

历史记录核心逻辑：
```java
    String id = request.getParameter("id");
    Cookie cookie = CookieUtils.getCookie(request.getCookies(), "history");
    if (null == cookie) {
        // 木有浏览记录：创建Cookie，并存储浏览记录
        cookie = new Cookie("history", id);
    } else {
        // 有浏览记录
        String history = cookie.getValue();
        if (!history.contains(id)) {
            // 有浏览记录，不包含当前浏览商品：将浏览商品拼接到已有的浏览记录中
            history += "-" + id;
            cookie.setValue(history);
        }
        // 有浏览记录，包含当前浏览商品则无需处理
    }
    response.addCookie(cookie);
    // 显示商品浏览记录，路径：/demo/show
    response.sendRedirect(request.getContextPath() + File.separator + "show");
```
显示历史记录信息：
```java
        // 获取商品浏览记录
        Cookie cookie = CookieUtils.getCookie(request.getCookies(), "history");
        StringBuffer respsb = new StringBuffer();
        if (null == cookie) {
            // 没有浏览记录
            respsb.append("<font color='red'>没有浏览记录</font>，");
            respsb.append("<a href='books.html'>浏览商品</a>");
        } else {
            // 有浏览记录: 0-1-2-3
            String[] books = {"西游记", "红楼梦", "水浒传", "三国志"};
            String history = cookie.getValue();
            String[] historys = history.split("-");
            respsb.append("您的浏览记录如下：<br>");
            for (String index : historys) {
                String bookName = books[Integer.parseInt(index)];
                respsb.append(bookName).append("<br>");
            }
        }
        response.setContentType("text/html;charset=utf-8");
        response.getWriter().println(respsb);
```
![Cookie应用](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142619.png)
点击第一个后：
![Cookie应用](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316142624.png)