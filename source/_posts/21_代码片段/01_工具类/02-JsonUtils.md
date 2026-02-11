---
title: 02-JsonUtils
date: 2016-5-2 11:22:34
tags:
- 工具类
categories: 
- 21_代码片段
- 01_工具类
---

### JasonUtils
```java
/**
 * json 工具类
 */
public class JsonUtils {

    /**
     * 将 java 对象转换成 json 字符串
     * @param object java对象
     * @return json字符串
     * @throws Exception
     */
    public static String toJsonStr(Object object) throws Exception {
        return new ObjectMapper().writeValueAsString(object);
    }

    /**
     * 将 java 对象转换为 json 字符串，将 json 响应到浏览器
     * @param response 响应对象
     * @param object java对象
     */
    public static void writeJsonStr(HttpServletResponse response, Object object) {
        response.setContentType("application/json;charset=utf-8");
        try {
            String jsonStr = toJsonStr(object);
            response.getWriter().write(jsonStr);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```