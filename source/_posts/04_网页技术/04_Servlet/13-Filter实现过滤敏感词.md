---
title: 13-Filter实现过滤敏感词
date: 2017-5-22 22:26:20
tags:
- Servlet
- Filter
categories: 
- 04_网页技术
- 04_Servlet
---

### Filter 过滤器实现敏感词过滤

核心逻辑：

```java
// 正常情况最好将注解信息配置在 web.xml 中
@WebFilter(
        filterName = "SensitiveWordsFilter",
        urlPatterns = "/*",
        initParams = {
                @WebInitParam(name="word1", value="笨蛋"),
                @WebInitParam(name="word2", value="傻蛋"),
                @WebInitParam(name="word3", value="蠢蛋")
        }
)
public class SensitiveWordsFilter implements Filter {
    // 敏感词
    private List<String> sensitiveWords = new ArrayList<>();
    @Override
    public void init(FilterConfig config) throws ServletException {
        Enumeration<String> parameterNames = config.getInitParameterNames();
        while (parameterNames.hasMoreElements()) {
            String sensitiveWord = config.getInitParameter(parameterNames.nextElement());
            sensitiveWords.add(sensitiveWord);
        }
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {
        HttpServletRequest request = (HttpServletRequest) req;
        // 增强 request 的 getParameter 方法
        HttpServletRequest requestProxy = (HttpServletRequest) Proxy.newProxyInstance(
                request.getClass().getClassLoader(),
                request.getClass().getInterfaces(),
                (proxy, method, args) -> {
                    Object returnValue = null;
                    String methodName = method.getName();
                    if ("getParameter".equals(methodName)) {
                        // returnValue 就是 getParameter 方法的返回值，需要处理敏感词
                        String word = (String) method.invoke(request, args);
                        // 处理敏感词
                        for (String sensitiveWord : sensitiveWords) {
                            if (word.contains(sensitiveWord)) {
                                // 处理敏感词
                                returnValue = word.replace(sensitiveWord, "***");
                            }
                        }
                    } else {
                        returnValue = method.invoke(request, args);
                    }
                    return returnValue;
                }
        );
        // 放行增强的请求对象 requestProxy（在 Servlet 中可以去使用到过滤后的）
        chain.doFilter(requestProxy, resp);
    }

    @Override
    public void destroy() { }
}
```