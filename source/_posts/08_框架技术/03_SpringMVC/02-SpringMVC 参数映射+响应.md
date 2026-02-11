---
title: 02-SpringMVC 参数映射+响应
date: 2018-6-20 18:59:44
tags:
- SpringMVC
- Request
- 注解
categories: 
- 08_框架技术
- 03_SpringMVC
---





![image-20200620175456961](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200620175458.png)

参考资料：https://spring-mvc.linesh.tw/

### 1. 请求参数映射

> GET 请求参数拼接在 URL 路径上，eg：
>
> * http://ip:port/project/user/get?key1=value1&key2=value2
>
> POST 请求参数 在 请求消息体中，eg：Form Data 或 Request payload
>
> ![image-20200813004720089](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200813004721.png)
>
> ![image-20200813004504301](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200813004506.png)

#### 1.1 @RequestMapping
* **`@RequestMapping`** 注解
    作用：是建立请求 URL 和处理方法之间数据的对应关系。
    该注解可以作用在方法和类上：
    * 作用在类上：一级访问目录

    * 作用在方法上：二级访问目录（默认GET请求，也可约束请求方式）

        * 约束方法 ①
            **@GetMapping**/**@PostMapping**/@PutMapping/@DeleteMapping/@PatchMapping...
            
        * 约束方法 ②
            @RequestMapping(value = "二级访问路径", **method = `RequestMethod.GET`**)
            
            ```java
            public enum RequestMethod {
            	GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS, TRACE
            }
            ```


> 注意：/ 表示应用的根目录开始，路径上不能只写一个 /


属性：

**path**：  指定请求路径的 url
**value**： value 属性和 path 属性是一样的
**method**： 指定该方法的请求方式
**params**： 指定限制请求参数的条件
**headers**： 发送的请求中必须包含的请求头

```java
@Controller // spring 三层中的控制层注解
@RequestMapping("/user") // 类上：指定控制器即 Servlet 的一级目录
public class UserController {

    //<a href="user/login">...</a>
    @RequestMapping("/login") // 方法上：指定控制器即 Servlet 的二级目录
    public String login() {
        System.out.println("login...");
        return "/success.jsp";
    }
}
```



#### 1.2 @RequestParam

* **`@RequestParam`** 注解
    作用：把请求中的指定名称的参数传递给控制器中的形参赋值
    * value：请求参数中的名称
    * required：请求参数中是否必须提供此参数，默认值是true，必须提供

**映射机制**:
表单提交的数据都是 k=v 格式的，如 username=jack&password=123
SpringMVC 的参数映射过程是把表单提交的请求参数，作为控制器中方法的参数进行映射的

**映射要求**：

提交表单的 `name属性 和 形参的名称 必须相同`，否则获取到的为 null。

**支持类型**：

* 基本数据类型和字符串类型
* 实体类型（JavaBean）
* 集合数据类型（List、map集合等）
* 日期类型转换处理（Date）




##### 1.2.1 基本类型映射

提交表单的name和参数的`名称必须相同`的，区分大小写。

```java
public class UserController {

    //name=id 与形参 id 相同： 
    //<a href="user/test_param?id=2001">...</a>
    @RequestMapping("/test_param")
    public void test_param(String id) {
        System.out.println("id=" + id);
    }

    // @RequestParam 注解映射 uid 名称为 id：
    // <a href="user/test_param2?id=2001&name=张三">...</a>
    @RequestMapping("/test_param2")
    public void test_param2(@RequestParam("id") String uid, String name) {
        System.out.println("uid=" + uid + ", name=" + name);
    }
}
```



##### 1.2.2 实体类映射

要求提交表单的 name 和 JavaBean 中的属性名称需要一致，如果一个 JavaBean 类中包含其他的引用类型，那么表单的name属性需要编写成：`对象.属性`

<center>↓ demo 例子如下  - 同集合映射 demo ↓</center>

##### 1.2.3 集合映射

* `list[index].属性名`
* `map['key'].属性名`

> 注意：如果请求参数是中文，可以在 web.xml 中配置 Spring 提供的字符集过滤器来解决中文乱码问题

```java
// 实体类 User
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {  //【实体类】映射
    private Integer id;
    private String username;
    private String password;

    private List<Car> carList;  //【List】映射
    private Map<String, Car> carMap;  //【Map】映射

    private Date birth; //java.util.Date; 【Date】映射
}

// 控制器 UserController
public class UserController {
    /**
     * 实体类型 + 集合类型 + 日期类型的映射
     * <form action="user/test_entity" method="get">
     *     编号：<input type="text" name="id"> <br>
     *     姓名：<input type="text" name="username"> <br>
     *     密码：<input type="password" name="password"> <br>
     *     list：<input type="text" name="carList[1].cname"> <br>
     *     list：<input type="text" name="carList[2].cname"> <br>
     *     map: <input type="text" name="carMap['mycar'].cname"> <br>
     *
     *     date:<input type="date" name="birth">
     *     <input type="submit">
     * </form>
     */
    @RequestMapping("/test_entity")
    public void test_entity(User user) {
        System.out.println(user);
    }
}
```

##### 1.2.4 Demo配置文件

web.xml

```xml
<!DOCTYPE web-app PUBLIC
        "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
        "http://java.sun.com/dtd/web-app_2_3.dtd" >
<web-app>
    <display-name>Archetype Created Web Application</display-name>

    <!--配置中文乱码过滤器-->
    <filter>
        <filter-name>characterEncodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>characterEncodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <!--配置前端控制器-->
    <servlet>
        <servlet-name>dispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:springmvc.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>dispatcherServlet</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>

</web-app>
```

springmvc.xml

```xml
    <!--开启注解扫描-->
    <context:component-scan base-package="com.demo"/>

    <!--视图解析对象-->
    <bean id="internalResourceViewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/jsp"/>
    </bean>

    <!--开启SpringMVC框架注解支持-->
    <mvc:annotation-driven/>
```



##### 1.2.5 Date类型映射

如果对象的属性中有Date类型，页面输入参数格式是 2019/1/1 可以自动参数映射，如果页面输入参数格式是 2019-1-1 则无法映射，需要使用自定义类型转换器来解决。

<center>↑ demo 例子如上  - 同集合映射 demo ↑</center>

> 注意：表单提交的任何数据类型全部都是字符串类型，但是后台定义 Integer 类型，数据也可以封装上，说明 Spring 框架内部会默认进行数据类型转换。

如果想自定义数据类型转换，可以`实现 Converter 的接口`。

1. 创建日期转换工具类

```java
//把字符串转换日期
public class StringToDateConverter implements Converter<String, Date> {
    @Override
    public Date convert(String s) {
        if ("".equals(s)) {
            throw new RuntimeException("日期字符串不能为空");
        }

        try {
            return new SimpleDateFormat("yyyy-MM-dd").parse(s);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        throw new RuntimeException("日期类型转换异常");
    }
}
```

2. 修改 springmvc.xml

```xml
    <!--开启注解扫描-->
    <context:component-scan base-package="com.demo"/>

    <!--视图解析对象-->
    <bean id="internalResourceViewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/jsp"/>
    </bean>

    <!--配置自定义类型转换器 - 解决日期转换问题-->
    <bean id="conversionServiceFactoryBean" class="org.springframework.context.support.ConversionServiceFactoryBean">
        <property name="converters">
            <set>
                <bean class="com.demo.utils.StringToDateConverter"/>
            </set>
        </property>
    </bean>

    <!--开启SpringMVC框架注解支持-->
    <mvc:annotation-driven conversion-service="conversionServiceFactoryBean"/>
```



#### 1.3 @PathVariable

* **`@PathVariable`** 注解 - **Restful**
    作用：拥有映射 url 中的占位符的。url 中有 /delete/{id} ，{id} 就是占位符，也叫 `URI模板`
    * value：指定 url 中的占位符名称

```java
public class UserController {
	//映射 123 为 URI 的变量{id}: <a href="user/testPathVariable/123">...</a>
    @RequestMapping(value="/testPathVariable/{id}")
    public String testPathVariable(@PathVariable("id") String uid){ //即name=uid 可省略
        System.out.println(uid); // 123
        return "success";
    }
}
```

> 此之谓：`Restful 风格的 URL`，即通过 @PathVariable 实现：
> 请求路径一样，可以根据不同的请求方式去执行后台的不同方法，如京东的商品链接...
> restful风格的URL优点：结构清晰、符合标准、易于理解、扩展方便



#### 1.4 @RequestHeader

* **`@RequestHeader`** 注解
    作用：获取指定请求头的值
    * value：请求头的名称

```java
public class UserController {
    //Http Header信息映射： <a href="user/testRequestHeader">...</a>
    @RequestMapping(value="/testRequestHeader")
    public String testRequestHeader(@RequestHeader(value="Accept") String header){ //header里Accept参数
        System.out.println(header); // 打印 Accept 的头信息
        return "success";
    }
}
```

#### 1.5 @CookieValue

* **`@CookieValue`** 注解
    作用：用于获取指定cookie的名称的值
    * value：cookie的名称

```java
public class UserController {
	//Http Cookie信息映射： <a href="user/testCookieValue">...</a>
    @RequestMapping(value="/testCookieValue")
    public String testCookieValue(@CookieValue(value="JSESSIONID") String cookieValue){ //Cookies里JSESSIONID值
        System.out.println(cookieValue); // session id值
        return "success";
    }
}
```


#### 1.6 @RequestPart

* **`@RequestPart`** 注解
    作用：用于 multipart/form-data 表单提交请求的方法上，主要是文件上传。支持请求方法的方式 MultipartFile，属于Spring的MultipartResolver类，该请求通过http协议传输的。

```java
public class UserController {
    @RequestMapping("uploadFile")
    public String uploadFile(@RequestPart("file") MultipartFile file, @RequestParam String bucket) {
        String fileUrl = aliossService.uploadFile(file, bucket);
        Map<String, String> result = new HashMap<>();
        result.put("fileUrl", fileUrl);
        return "success";
    }
}
```



### 2. 响应数据和结果视图

#### 2.1 返回值分类

* **String** (`String 返回值 + Model 参数`)
    Controller 方法返回字符串可以指定逻辑视图的名称，根据视图解析器为物理视图的地址。
    应用时可以设置参数类型为 Model，使用 Model 对象调用 addAttribute 方法来存储数据，同 request。

    > request.setAttribute("data", data);
    >
    > model.addAttribute("data", data);

* **void** (`void 返回值 + request/response跳转`)
    如果控制器的方法返回值编写成 void，执行程序报 404 的异常，默认查找 JSP 页面没有找到。
    应用时可以设置参数类型为 HttpServletRequest 和 HttpServletResponse，使用转发或者重定向来跳转页面

* **ModelAndView** (`.addObject()存储数据` + `.setViewName()跳转`)
    ModelAndView 对象是 Spring 提供的一个对象，可以调用 addObject 方法来保存数据以及调用 setViewName 方法来跳转页面。
    
* **forward:** 和 **redirect:**  (`不会拼接配置的视图解析器中的前缀和后缀到路径里`)
    可以在前端控制器的方法中直接返回 forward: 或 redirect: 为前缀的路径字符串，由 SpringMVC 反射中自动解析路径选择 转发或重定向 跳转页面。

    > 使用forward关键字进行请求转发：return "forward:转发的JSP路径"
    >
    > 使用redirect关键字进行重定向（`默认会把项目路径加上`）：return "redirect:重定向的JSP路径"

User

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Integer id;
    private String username;
    private String password;
}
```

UserController

```java
@Controller
@RequestMapping("/user")
public class UserController {
    public List<User> getUsers() {
        List<User> list = new ArrayList<User>();
        list.add(new User(1, "aaa", "123"));
        list.add(new User(2, "bbb", "456"));
        list.add(new User(3, "ccc", "789"));
        return list;
    }

    // String 返回值跳转
    @RequestMapping("/testString")
    public String testString(HttpServletRequest request) {
        List<User> users = getUsers();
        request.setAttribute("users", users);
        return "/list.jsp";
    }

    // void 无返回值跳转
    @RequestMapping("/testVoid")
    public void testVoid(HttpServletRequest request, HttpServletResponse response) throws Exception {
        List<User> users = getUsers();
        request.setAttribute("users", users);
        request.getRequestDispatcher("/WEB-INF/jsp/list.jsp").forward(request, response);
    }

    // ModelAndView 返回值跳转
    @RequestMapping("/testModelAndView")
    public ModelAndView testModelAndView() {
        List<User> users = getUsers();
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("users", users);
        modelAndView.setViewName("/list.jsp");
        return modelAndView;
    }

    // forward / redirect 前缀指定 转发 或 重定向
    @RequestMapping("testForwardAndRedirect")
    public String testForwardAndRedirect(HttpServletRequest request) {
        List<User> users = getUsers();
        request.getSession().setAttribute("users", users);
        return "forward:/index.jsp";
        //return "redirect:/index.jsp";
    }
}
```

web.xml：中文乱码过滤器、前端控制器。

springmvc.xml

```xml
    <!--开启注解扫描-->
    <context:component-scan base-package="com.demo"/>

    <!--视图解析对象-->
    <bean id="internalResourceViewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/jsp"/>
    </bean>

    <!--开启SpringMVC框架注解支持-->
    <mvc:annotation-driven />
```



### 3. 配置不拦截静态资源

DispatcherServlet 会拦截到所有的资源，导致一个问题就是静态资源 img、css、js 也会被拦截到，从而不能被使用。

解决方案就是需要配置静态资源不进行拦截，在 springmvc.xml 配置文件添加如下配置：

方式一：`<mvc:resources>` + `<servlet-mapping>` 

```xml
<!-- springmvc.xml 前端控制器，哪些静态资源不拦截-->
<mvc:resources location="/css/" mapping="/css/**"/>
<mvc:resources location="/images/" mapping="/images/**"/>
<mvc:resources location="/js/" mapping="/js/**"/>

<!-- web.xml 配置 servlet 映射，html资源不被拦截 -->
<servlet-mapping>
	<serlvet-name>default</serlvet-name>
    <url-pattern>*.html</url-pattern>
</servlet-mapping>
```

方式二：`所有静态资源不被拦截`

```xml
<!-- springmvc.xml 所有静态资源不拦截-->
<mvc:default-servlet-handler />
```

