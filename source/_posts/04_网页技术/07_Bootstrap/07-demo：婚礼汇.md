---
title: 07-demo：婚礼汇
date: 2017-5-20 20:38:22
tags:
- Bootstrap
categories: 
- 04_网页技术
- 07_Bootstrap
---



### 1. 物理数据模型

PowerDesigner 软件设计：

* 酒店、房间、套餐、酒店信息、图片

![image-20230316145134731](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316145135.png)

* 用户、购物车

![image-20230316145148272](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316145149.png)



### 2. 功能详细结构

* **婚礼汇**
  * 会员中心
    * 登录
    * 注册
    * 我的订单
  * 婚宴场地
    * 酒店列表
    * 酒店详情
    * 套餐详情
  * 我的购物车
* **后台管理系统**
  * 登录
  * 首页
  * 酒店管理
    * 修改酒店
    * 添加酒店
    * 删除酒店
  * 会员管理
  * 订单管理



### 3. 功能流程说明

![image-20230316145230361](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316145231.png)



### 4. 项目环境搭建

#### 4.1 导入 jar 包

- ![image-20230316145242988](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316145243.png)

#### 4.2 导入工具类

* **CommonUtils**  获取32位随机字符串

```java
public class CommonUtils {
    public static String uuid(){
    	return UUID.randomUUID().toString().replace("-","");
    }
}
```

  * **JDBCUtils**  获取连接池

```java
public class JDBCUtils {
    private static DataSource dataSource;
    static {
        dataSource = new ComboPooledDataSource();
    }
    public static DataSource getDataSource() {
        return dataSource;
    }
}
```

* **JsonUtils**  产生json字符串、将json字符串作为响应正文

```java
public class JsonUtils {
    /**
     * 将指定对象转换成json字符串
     * @param object
     * @return
     * @throws JsonProcessingException
     */
    public static String toJsonStr(Object object) throws JsonProcessingException {
        return new ObjectMapper().writeValueAsString(object);
    }
    /**
     * 将指定对象转换为json字符串，并将json字符串作为响应正文
     * @param response
     * @param object
     */
    public static void writeJsonStr(HttpServletResponse response,Object object){
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

#### 4.3 引入配置文件

* c3p0.properites

```properties
c3p0.driverClass=com.mysql.jdbc.Driver
c3p0.jdbcUrl=jdbc:mysql://localhost:3306/wedding
c3p0.user=root
c3p0.password=123456
```

* 建立三层架构

  * ![image-20230316145258806](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316145259.png)
* 通用Servlet
* 引入页面资源



### 5. BaseServlet 通用

* BaseServlet.java
  1. 根据子类中 methodName 方法名利用`反射调用执行`该方法
  2. 根据是否有返回值，有返回值进行`标记注解`判断，无返回值无需操作
  3. 有标记注解时：如果返回 String 类型则直接以`json`格式响应；如果返回其他对象格式，则`jackson`转换再响应
  4. 无标记注解时：如果不包含":"则`转发到"WEB-INF/jsp"+path`；如果包含":"则判断前缀进行转发或重定向操作

```java
@WebServlet(name = "BaseServlet",urlPatterns = "/base")
public class BaseServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String methodName = request.getParameter("methodName");
        try {
            Method method = this.getClass().getMethod(methodName, HttpServletRequest.class, HttpServletResponse.class);
            if (method != null) {
                Object returnValue = method.invoke(this,request,response);
                //判断是否有返回值
                if (null != returnValue) {
                    //有返回值，判断方法上是否有@MyResponseBody注解
                    boolean present = method.isAnnotationPresent(MyResponseBody.class);
                    if (present) {
                        //有@MyResponseBody注解，需要返回json字符串
                        if (returnValue.getClass() == String.class) {
                            //1,直接返回json字符串，将json字符串作为响应正文
                            response.setContentType("application/json;charset=utf-8");
                            response.getWriter().write(returnValue+"");
                        } else {
                            //2,直接返回java对象，将java对象转换成json字符串，将json字符串作为响应正文
                            JsonUtils.writeJsonStr(response,returnValue);
                        }
                    } else {
                        //没有@MyResponseBody注解，返回的是资源的路径
                        String newReturnValue = (String) returnValue;
                        int index = newReturnValue.lastIndexOf(":");
                        String path = newReturnValue.substring(index + 1);
                        if (index != -1) {
                            //存在":"
                            if (newReturnValue.startsWith("redirect")) {
                                //1,重定向
                                response.sendRedirect(request.getContextPath()+ File.separator + path);
                            } else if (newReturnValue.startsWith("forward")){
                                //2,请求转发
                                request.getRequestDispatcher("/WEB-INF/jsp/" + path).forward(request,response);
                            }
                        } else {
                            //不存在":"，请求转发
                            request.getRequestDispatcher("/WEB-INF/jsp/" + newReturnValue).forward(request,response);
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request,response);
    }
}
```



### 6. 登录

* 页面访问安全问题

  * 需要将 jsp 放入到 WEB-INF 文件夹中，WEB-INF 文件夹不能够被外部直接访问，只能通过内部转发的方式访问

#### 6.1 表单页面

- login.jsp

```html
<font color="red">${errorMsg}</font>
<form action="${pageContext.request.contextPath}/user" method="get">
    <input type="hidden" name="methodName" value="login"/>
    <div class="user-form-item">
        <input name="user_tel" class="user-input" type="text" max="15" maxlength="15" placeholder="手机号">
    </div>
    <div class="user-form-item">
        <input name="user_password" class="user-input" type="password" max="15" maxlength="15" placeholder="密码">
    </div>
    <div class="user-form-item">
        <input name="qrCode" class="user-input user-input-adjust" type="text" max="4" placeholder="验证码">
        <img onclick="$('.qrcode').attr('src','${pageContext.request.contextPath}/validatecode.jsp?'+Math.random())" class="qrcode" style="cursor:pointer" src="${pageContext.request.contextPath}/validatecode.jsp">
    </div>
    <div class="user-form-item">
        <label>
            <input class="user-check" type="checkbox" checked="false" value="yes">
            <span class="cos_span">
                登录即表示同意<a class="keyword-blue-pale">《119婚庆网用户协议》</a>
            </span>
        </label>
    </div>
    <div class="user-form-item">
        <button type="submit" class="user-form-button" style="font-weight: bold;">登&nbsp;&nbsp;录</button>
    </div>
    <div class="user-form-item us_text_right">
        <span class="cos_span"><a>忘记密码?</a></span>&nbsp;&nbsp;<span class="cos_span_empty">
        <a href="${pageContext.request.contextPath}/center?methodName=toRegister">注册账号</a>
        </span>
    </div>
</form>

```



#### 6.2 随机验证码

* login.jsp

```html
<img 
  onclick="$('.qrcode').attr('src','${pageContext.request.contextPath}/validatecode.jsp?'+Math.random())" 
  class="qrcode"
  style="cursor:pointer"
  src="${pageContext.request.contextPath}/validatecode.jsp"
/>
```

> style="cursor:pointer"   鼠标指针变成 手 的形状，和放到链接上面的鼠标指针一样。

* validatecode.jsp

```html
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.Random"%>
<%@ page import="java.io.OutputStream"%>
<%@ page import="java.awt.Color"%>
<%@ page import="java.awt.Font"%>
<%@ page import="java.awt.Graphics"%>
<%@ page import="java.awt.image.BufferedImage"%>
<%@ page import="javax.imageio.ImageIO"%>
<%
   int width = 60;
   int height = 32;
   //创建图片对象
   BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
   Graphics g = image.getGraphics();
   //设置背景颜色
   g.setColor(new Color(0xDCDCDC));
   g.fillRect(0, 0, width, height);
   //设置边框
   g.setColor(Color.black);
   g.drawRect(0, 0, width - 1, height - 1);
   // create a random instance to generate the codes
   Random rdm = new Random();
   String hash1 = Integer.toHexString(rdm.nextInt());
   //画干扰线
   for (int i = 0; i < 50; i++) {
      int x = rdm.nextInt(width);
      int y = rdm.nextInt(height);
      g.drawOval(x, y, 0, 0);
   }
   //生成四位随机验证码
   String capstr = hash1.substring(0, 4);
   session.setAttribute("key", capstr);
   System.out.println(capstr);
   g.setColor(new Color(0, 100, 0));
   g.setFont(new Font("Candara", Font.BOLD, 24));
   g.drawString(capstr, 8, 24);
   g.dispose();
   response.setContentType("image/jpeg");
   out.clear();
   out = pageContext.pushBody();
   OutputStream strm = response.getOutputStream();
   ImageIO.write(image, "jpeg", strm);
   strm.close();
%>
```

#### 6.3 Java 后端

* CenterServlet

```java
@WebServlet(name = "CenterServlet",urlPatterns = "/center")
public class CenterServlet extends BaseServlet {
    /**
     * 转发到login.jsp
     * @param request
     * @param response
     * @return
     */
    public String toLogin(HttpServletRequest request, HttpServletResponse response) {
        return "login.jsp";
    }

    /**
     * 转发到index.jsp
     * @param request
     * @param response
     * @return
     */
    public String toIndex(HttpServletRequest request, HttpServletResponse response) {
        return "index.jsp";
    }
}
```

* UserServlet

```java
@WebServlet(name = "UserServlet",urlPatterns = "/user")
public class UserServlet extends BaseServlet {

    public String login(HttpServletRequest request,HttpServletResponse response){
        UserService userService = new UserServiceImpl();
        try {
            User user = new User();
            BeanUtils.populate(user,request.getParameterMap());
            //获取输入的验证码
            String inputQrCode = request.getParameter("qrCode");
            Object existQrCode = request.getSession().getAttribute("key");//existQrCode存储在session中
            if (null != existQrCode) {
                if (existQrCode.equals(inputQrCode)) {
                    //验证码正确，进行登录操作
                    User existUser = userService.login(user);
                    System.out.println(existUser);
                    if (null != existUser) {
                        //登录成功，保存用户信息，跳转到首页
                        request.getSession().setAttribute("existUser",existUser);
                        return "redirect:center?methodName=toIndex";
                    } else {
                        //登录失败
                        request.setAttribute("errorMsg","登录失败");
                        return "login.jsp";
                    }
                } else {
                    //验证码不正确，跳转到登录页面
                    request.setAttribute("errorMsg","验证码错误");
                    return "login.jsp";
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        request.setAttribute("errorMsg","登录失败");
        return "login.jsp";
    }
}
```



### 7. 注册

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316145311.png)

#### 7.1 表单校验

* 注册页面
  * 发送验证码的页面代码
  * 表单校验的页面代码
* 代码实现

```html
<head>
    <meta charset="utf-8">
    <title>会员注册</title>
    <link href="${pageContext.request.contextPath}/css/wedding-3.css" rel="stylesheet"/>
    <link href="${pageContext.request.contextPath}/css/wedding-2.css" rel="stylesheet"/>
    <link href="${pageContext.request.contextPath}/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/bootstrapvalidator/css/bootstrapValidator.min.css" rel="stylesheet">
    <script src="${pageContext.request.contextPath}/js/jquery-3.1.1.js"></script>
    <script src="${pageContext.request.contextPath}/bootstrap/js/bootstrap.min.js"></script>
    <script src="${pageContext.request.contextPath}/bootstrapvalidator/js/bootstrapValidator.min.js"></script>

    <script>
        /**
         * 发送验证码
         */
        var inter;
        function sendSMS() {
            //校验手机号，触发 bootstrapValidator 对手机号校验
            //初始化 bootstrapValidator 对象
            var validator = $("#myForm").data('bootstrapValidator');
            validator.validateField("user_tel");
            var flag = validator.isValidField("user_tel");
            // 手机号被输入，且手机号规则符合正则才可以点击发送验证码
            if (flag) {
                //触发重复行为：每隔一秒显示一次数字
                inter = setInterval("showCount()",1000);
                $(".qrcode").attr("disabled",true);
			   //请求服务器发送验证码
                $.post("${pageContext.request.contextPath}/sms",{
                    "methodName":"sendSMS",
                    "phoneNum":$("#user_tel").val()
                },function (data) {
                    console.log(data);
                },"json");
            }
        }

        var count = 60;
        function showCount() {
            $(".qrcode").text(count+"S");
            count--;
            if (count < 0 ) {
                clearInterval(inter);
                $(".qrcode").text("发送验证码");
                count = 60;
                $(".qrcode").attr("disabled",false);
            }
        }

        $(function () {
            $("#myForm").bootstrapValidator({
                message:"this is no a valiad field",
                fields:{
                    user_tel:{
                        message: "手机号格式错误",
                        validators:{
                            notEmpty:{
                                message:"手机号不能为空"
                            },
                            stringLength:{
                                message:"手机号长度为11",
                                min:11,
                                max:11
                            },
                            regexp:{
                                message:"手机号格式不对",
                                regexp: /^[1]{1}[1356789]{1}[0-9]+$/
                            }
                        }
                    },
                    user_password:{
                        message: "密码格式错误",
                        validators:{
                            notEmpty:{
                                message:"密码不能为空"
                            },
                            stringLength:{
                                message:"密码长度为6~8",
                                min:6,
                                max:8
                            },
                            regexp:{
                                message:"密码由小写字母、数字组成",
                                regexp: /^[a-z0-9]+$/
                            },
                            different:{
                                message:"密码不能和手机号一致",
                                field:"user_tel"
                            }
                        }
                    },
                    qrCode:{
                        message:"验证码格式错误",
                        validators:{
                            notEmpty:{
                                message:"验证码不能为空"
                            },
                            stringLength:{
                                message:"验证码长度为4",
                                min:4,
                                max:4
                            }
                        }
                    }
                }
            });
        })
    </script>
    <style>
        .user-form-wraps{
            width: 400px;
        }
        .user-form-button{
            width: 320px;
        }
    </style>
</head>
<div id="public-toolbar" class="hidden_active user_adjust_public">
    <div class="layout_center layout_clear">
        <div class="page-logo layout_fl">
            <a><img src="${pageContext.request.contextPath}/img/rxT54692503vu.jpg"></a>
        </div>
        <div class="page-tels layout_fr">
            <span class="tel-show"> 全国免费咨询热线 </span>
            <span class="tel-pink"><strong>023-6766-4541</strong></span>
        </div>
    </div>
</div>
<div class="user-form" style="background:url(${pageContext.request.contextPath}/img/JQK51845110Xc.jpg)">
    <div class="layout_center">
        <div class="user-form-wrap">
            <div class="user-form-wraps">
                <div class="user-form-item"><strong class="user-form-title">会员注册</strong></div>
                <form id="myForm" action="${pageContext.request.contextPath}/user">
                    <input type="hidden" name="methodName" value="regist"/>
                    <div class="user-form-item form-group">
                        <input name="user_tel" class="user-input" type="text"  placeholder="手机号">
                    </div>
                    <div class="user-form-item form-group">
                        <input name="user_password" class="user-input" type="password"  placeholder="密码">
                    </div>
                    <div class="user-form-item form-group">
                        <input name="qrCode" class="user-input user-input-adjust" type="text"  placeholder="短信验证码">
                        <button type="button" class="qrcode" onclick="sendSMS()">发送验证码</button>
                    </div>
                    <div class="user-form-item">
                        <label>
                            <input class="user-check" type="checkbox" checked="false" value="yes">
                            <span class="cos_span">
                                	登录即表示同意<a class="keyword-blue-pale">《119婚庆网用户协议》</a>
                                </span>
                        </label>
                    </div>
                    <div class="user-form-item form-group">
                        <button type="submit" class="user-form-button" style="font-weight: bold;">立即注册</button>
                    </div>
                </form>
                <div class="user-form-item us_text_right">
                    	<span class="cos_span">
                            <a href="${pageContext.request.contextPath}/center?methodName=toLogin">已有账户?立即登录</a>
                        </span>
                </div>
            </div>
        </div>
    </div>
</div>
```



#### 7.2 手机验证码

* 手机验证码是由阿里云短信平台提供。
* 开发流程

  * 在阿里云短信平台开通服务
    * `权限码(AccessKey)`
    * `签名`
    * `短信模板`
  * 导入jar包
    * ![image-20230316145329154](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316145330.png)

  * 使用SMSUtils工具类
* **SMSUtils.java** 代码实现

```java
import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsRequest;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsResponse;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.profile.IClientProfile;
import sun.plugin2.os.windows.SECURITY_ATTRIBUTES;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.Random;

public class SmsUtil {
    //产品名称:云通信短信API产品,开发者无需替换
    static final String product = "Dysmsapi";
    //产品域名,开发者无需替换
    static final String domain = "dysmsapi.aliyuncs.com";

    static final String accessKeyId ;
    static final String accessKeySecret ;
    static {
        InputStream inputStream = SmsUtil.class.getClassLoader().getResourceAsStream("sms.properties");
        Properties properties = new Properties();
        try {
            properties.load(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
        accessKeyId = properties.getProperty("accessKeyId");
        accessKeySecret = properties.getProperty("accessKeySecret");
    }

    /**
     * 发送验证码
     * @param session
     * @return
     * @throws ClientException
     */
    public static SendSmsResponse sendSms(HttpSession session,String phoneNum) throws ClientException {
        //可自助调整超时时间
        System.setProperty("sun.net.client.defaultConnectTimeout", "10000");
        System.setProperty("sun.net.client.defaultReadTimeout", "10000");

        //初始化acsClient,暂不支持region化
        IClientProfile profile = DefaultProfile.getProfile("cn-hangzhou", accessKeyId, accessKeySecret);
        DefaultProfile.addEndpoint("cn-hangzhou", "cn-hangzhou", product, domain);
        IAcsClient acsClient = new DefaultAcsClient(profile);

        //组装请求对象-具体描述见控制台-文档部分内容
        SendSmsRequest request = new SendSmsRequest();
        //必填:待发送手机号
        request.setPhoneNumbers(phoneNum);
        //必填:短信签名-可在短信控制台中找到
        request.setSignName("签名名称");
        //必填:短信模板-可在短信控制台中找到
        request.setTemplateCode("模版CODE");

        //产生四位随机验证码
        StringBuffer randomNum = new StringBuffer();
        for (int i = 0; i < 4; i++) {
            randomNum.append(new Random().nextInt(10));
        }
        request.setTemplateParam("{'code':"+randomNum+"}");
        //四位随机验证码存储到session
        session.setAttribute("phoneVarificationCode",randomNum);

        //hint 此处可能会抛出异常，注意catch
        SendSmsResponse sendSmsResponse = acsClient.getAcsResponse(request);
        return sendSmsResponse;
    }
}
```

* sms.properties

```properties
accessKeyId:xxxx
accessKeySecret:xxxx
```



#### 7.3 Java 后端

* CenterServlet

```java
@WebServlet(name = "CenterServlet", urlPatterns = "/center")
public class CenterServlet extends BaseServlet {
	...
    /**
     * 转发到注册页面
     * @param request
     * @param response
     * @return
     */
    public String toRegister(HttpServletRequest request, HttpServletResponse response) {
        return "register.jsp";
    }
}
```

* SmsServlet
  当手机号格式正确情况下，点击短信验证码按钮，需要发起一个异步请求，该异步请求用于给用户发送手机验证码的。

```java
@WebServlet(name = "SmsServlet" ,urlPatterns = "/sms")
public class SmsServlet extends BaseServlet {
    public void sendSMS(HttpServletRequest request,HttpServletResponse response){
        String phoneNum = request.getParameter("phoneNum");
        System.out.println(phoneNum);
        //发送短信
        try {
            //session:存储
            SmsUtil.sendSms(request.getSession(),phoneNum);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
```

* UserServlet - regist()
  判断手机验证码是否正确，进行注册操作。

```java
public String regist(HttpServletRequest request,HttpServletResponse response){
    try {
        User user = new User();
        BeanUtils.populate(user,request.getParameterMap());
        String inputPhoneCode = request.getParameter("phoneCode");
        String existPhoneCode = (String) request.getSession().getAttribute("existPhoneCode");
        if (inputPhoneCode.equals("1234")) {
            //手机验证码正确,进行注册操作
            userService.regist(user);
            return "redirect:center?methodName=toLogin";
        } else {
            //手机验证码错误
            request.setAttribute("errorMsg","验证码错误");
            return "redirect:center?methodName=toRegister";
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
    request.setAttribute("errorMsg","注册失败");
    return "redirect:center?methodName=toRegister";
}
```



### 8. 列表

首页导航 >> 酒店列表 >> HotelServlet (selectHotelListByPage) >> toHotelList (session存储list) >> hotelList.jsp

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316145339.png)

#### 8.1 Java 后端

* HotelServlet

```java
@WebServlet(name = "HotelServlet",urlPatterns = "/hotel")
public class HotelServlet extends BaseServlet {
    private HotelService hotelService = new HotelServiceImpl();
    
    public Integer getCurrentPage(String currentPageStr){
        if (null == currentPageStr) {
            return 1;
        }
        return Integer.parseInt(currentPageStr);
    }
    
    public String selectHotelListByPage(HttpServletRequest request,HttpServletResponse response) throws Exception {
        Integer currentPage = getCurrentPage(request.getParameter("currentPage"));
        System.out.println("currentPage : "+currentPage);
        //分页查询酒店列表
        PageBean<Hotel> pageBean = hotelService.selectHotelListByPage(currentPage);
        System.out.println(pageBean);
        return "hotelList.jsp";
    }
}
```

* HotelService

```java
public class HotelServiceImpl implements HotelService {
    private HotelDao hotelDao = new HotelDaoImpl();

    @Override
    public PageBean<Hotel> selectHotelListByPage(Integer currentPage) throws Exception {
        PageBean<Hotel> pageBean = new PageBean<>();
        pageBean.setCurrentPage(currentPage); // 当前页数
        Integer pageSize = 3;
        pageBean.setPageSize(pageSize); // 每页记录数
        Long totalSize = hotelDao.selectTotalSize();
        pageBean.setTotalSize(totalSize); // 总记录数
        Long totalPage = totalSize % pageSize == 0 ? totalSize / pageSize : totalSize / pageSize + 1;
        pageBean.setTotalPage(totalPage); // 总页数
        Integer begin = (currentPage - 1 ) * pageSize;
        List<Hotel> hotelList = hotelDao.selectHotelListByPage(begin, pageSize);
        pageBean.setList(hotelList); // 当前页记录list
        return pageBean;
    }
}
```

* HotelDao
1. 内连接查询表，通过 MapListHandler() 封装 query 查询出 mapList
2. 遍历 mapList ，通过 BeanUtils 分别封装每1个 map 对象到 Hotel 和 Img
3. 将 Img 设置到 Hotel 对象中，再将 Hotel 实例在循环中 add 进 List 最终返回

```java
public class HotelDaoImpl implements HotelDao {
    @Override
    public Long selectTotalSize() throws Exception {
        return new QueryRunner(JDBCUtil.getDataSource()).query(
            "select count(*) from tb_hotel",
            new ScalarHandler<>()); // ScalarHander<>() 查询统计数据的单个结果
    }

    @Override
    public List<Hotel> selectHotelListByPage(Integer begin, Integer pageSize) throws Exception {
        List<Hotel> hotelList = new ArrayList<>();
        //1对1
        //MapListHandler:将单条记录封装到map(字段名=字段值)中，并将所有的map放到List中
        List<Map<String, Object>> mapList = new QueryRunner(JDBCUtil.getDataSource()).query(
            "select tb_hotel.* , tb_img.img_id,tb_img.img_add from tb_hotel,tb_img where tb_hotel.hotel_id = tb_img.tb_hotel_hotel_id limit ?,?",
            new MapListHandler(), // MapListHandler将结果集的每一行数据都封装在一个Map里，然后再存到List
            begin,pageSize);
        for (Map<String, Object> map : mapList) {
            //map:一个酒店对象、一个图片对象
            Hotel hotel = new Hotel();
            Img img = new Img();
            BeanUtils.populate(hotel,map); // 封装 hotel 查询出的属性
            BeanUtils.populate(img,map);  // 封装 img 查询出的属性
            hotel.setImg(img);
            hotelList.add(hotel);
        }
        return hotelList;
    }
}
```

#### 8.2 列表页

* hotelList.jsp
  1. **jstl** 标签进行 c:if判断 和 c:each遍历 显示列表信息

```html
<!-- 显示每行记录 -->
<c:forEach items="${pageBean.list}" var="hotel">
    <li>
        <div class="gdx-lists-wrap layout_clear">
            <div class="gdx-lists-img layout_fl">
                <a href="${pageContext.request.contextPath}/hotelDetails.html">
                    <img src="${pageContext.request.contextPath}/${hotel.img.img_add}" style="display:block">
                </a>
            </div>
            <div class="gdx-lists-data">
                <h2>
                    <a href="field.html" style="font-size: 20px">${hotel.hotel_name}</a>
                </h2>
                <div class="gdx-lists-local">
                    <span class="page_icon in_local_icon"></span>${hotel.hotel_address}
                </div>
                <div class="gdx-lists-heart">
                    <span class="page_icon add-heart-out">
                        <span class="page_icon add-heart-in" style="${hotel.hotel_star}"></span>
                    </span>
                    推荐指数
                </div>
                <div class="gdx-lists-info">
                    <div class="gdx-lists-icon">
                        <a href="field.html"><i class="page_icon in-data-Icon0"></i></a><a href="field.html"><i class="page_icon in-data-Icon1"></i></a><a href="field.html"><i class="page_icon in-data-Icon2"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </li>
</c:forEach>

<!-- 分页工具栏 -->
<div class="ma_page">
                <%--上一页按钮，当前页面是首页时不可用--%>
                <c:if test="${pageBean.currentPage == 1}">
                    <a class="disabled"><</a>
                </c:if>

                <c:if test="${pageBean.currentPage != 1}">
                    <a href="${pageContext.request.contextPath}/hotel?methodName=selectHotelListByPage&currentPage=${pageBean.currentPage-1}"><</a>
                </c:if>

                <c:forEach begin="1" end="${pageBean.totalPage}" step="1" var="pageNum">
                    <c:if test="${pageNum == pageBean.currentPage}">
                        <a class="cur">${pageNum}</a>
                    </c:if>
                    <c:if test="${pageNum != pageBean.currentPage}">
                        <a href="${pageContext.request.contextPath}/hotel?methodName=selectHotelListByPage&currentPage=${pageNum}">${pageNum}</a>
                    </c:if>
                </c:forEach>

                <%--下一页按钮，当前页面是尾页时不可用--%>
                <c:if test="${pageBean.currentPage == pageBean.totalPage}">
                    <a  class="disabled">></a>
                </c:if>
                <c:if test="${pageBean.currentPage != pageBean.totalPage}">
                    <a href="${pageContext.request.contextPath}/hotel?methodName=selectHotelListByPage&currentPage=${pageBean.currentPage+1}">></a>
                </c:if>
</div>
```



### 9. 描述详情

根据酒店编号，分别查询酒店简单信息、查询房间列表、查询酒店详细信息、查询套餐列表。

#### 9.1 Java 后端

* HotelServlet

```java
@WebServlet(name = "HotelServlet",urlPatterns = "/hotel")
public class HotelServlet extends BaseServlet {
	...
    public String selectHotelDetailsByHotelId(HttpServletRequest request,HttpServletResponse response) throws Exception {
        Integer hotelId = Integer.parseInt(request.getParameter("hotelId"));
        System.out.println("hotelId:"+hotelId);
        //根据酒店编号，查询酒店简单信息，存储到 request 域中
        Hotel hotel = hotelService.selectHotelById(hotelId);
        request.setAttribute("hotel",hotel);
        //根据酒店编号，查询房间列表，存储到 request 域中
        List<Room> roomList = roomService.selectRoomListByHotelId(hotelId);
        request.setAttribute("roomList",roomList);
        //根据酒店编号，查询酒店详细信息，存储到 request 域中
        MyInfo info = infoService.selectInfoListByHotelId(hotelId);
        request.setAttribute("info",info);
        //根据酒店编号，查询套餐列表，存储到 request 域中
        List<MyPackage> packageList = packageService.selectPackageListByHotelId(hotelId);
        request.setAttribute("packageList",packageList);
        return "hotelDetails.jsp";
    }
}
```

* HotelDao - 酒店信息

```java
@Override
public Hotel selectHotelById(Integer hotelId) throws Exception {
    Map<String, Object> map = new QueryRunner(JDBCUtil.getDataSource()).query(
        "select * from tb_hotel , tb_img where tb_hotel.hotel_id = tb_img.tb_hotel_hotel_id and hotel_id = ?",
        new MapHandler(), // 将结果集中的第一行封装到一个 Map 里，key是列名，value就是对应的值
        hotelId);
    Hotel hotel = new Hotel();
    Img img = new Img();
    BeanUtils.populate(hotel,map);
    BeanUtils.populate(img,map);
    hotel.setImg(img);
    return hotel;
}
```

* RoomDao - 房间信息

```java
public class RoomDaoImpl implements RoomDao {
    @Override
    public List<Room> selectRoomListByHotelId(Integer hotelId) throws Exception {
        return new QueryRunner(JDBCUtil.getDataSource()).query(
            "select * from tb_room where tb_hotel_hotel_id = ?",
            new BeanListHandler<Room>(Room.class),
            hotelId);
    }
}
```

* InfoDao - 详细信息

```java
public class InfoDaoImpl implements InfoDao {
    @Override
    public MyInfo selectInfoListByHotelId(Integer hotelId) throws Exception {
        return new QueryRunner(JDBCUtil.getDataSource()).query(
            "select * from tb_information where tb_hotel_hotel_id = ?",
            new BeanHandler<MyInfo>(MyInfo.class),
            hotelId);
    }
}
```

* PackageDao - 套餐信息

```java
public class PackageDaoImpl implements PackageDao {
    @Override
    public List<MyPackage> selectPackageListByHotelId(Integer hotelId) throws Exception {
        return new QueryRunner(JDBCUtil.getDataSource()).query(
            "select * from tb_package where tb_hotel_hotel_id = ?",
            new BeanListHandler<MyPackage>(MyPackage.class),
            hotelId);
    }
}
```

* PackageServlet

```java
@WebServlet(name = "PackageServlet",urlPatterns = "/package")
public class PackageServlet extends BaseServlet {

    private PackageService packageService = new PackageServiceImpl();

    public String selectPackageById(HttpServletRequest request,HttpServletResponse response) throws Exception {
        Integer packageId = Integer.parseInt(request.getParameter("packageId"));
        MyPackage myPackage = packageService.selectPackageById(packageId);
        System.out.println(myPackage);
        request.setAttribute("myPackage",myPackage);
        return "packageDetails.jsp";
    }

}
```

* PackageDao

```java
    @Override
    public MyPackage selectPackageById(Integer packageId) throws Exception {
        Map<String, Object> map = new QueryRunner(JDBCUtil.getDataSource())
                .query("select * from tb_package,tb_img where tb_package.package_id = tb_img.tb_package_package_id and package_id = ?",
                        new MapHandler(),
                        packageId);
        MyPackage myPackage = new MyPackage();
        Img img = new Img();
        BeanUtils.populate(myPackage,map);
        BeanUtils.populate(img,map);
        myPackage.setImg(img);

        return myPackage;
    }
```



#### 9.2 详情页

* hotelDetails.jsp - 概要信息
  从 request 域中取 hotel 数据，jstl 标签访问其属性。

```html
<div id="shops-header" class="second_clear">
    <div class="layout_fl shops-cover">
        <img src="${pageContext.request.contextPath}/${hotel.img.img_add}">
    </div>
    <div class="shops-deta second_clear layout_fl">
        <div class="shops-info layout_fl">
            <h1 class="shops-info-name">${hotel.hotel_name}</h1>
            <div class="shops-info-local">
                <i class="page_icon in-shop-local-icon" ></i>${hotel.hotel_address}
            </div>
            <ul class="shops-info-list">
                <li>联系电话：${hotel.hotel_tel}</li>
                <li>${info.info_bus}</li>
            </ul>
        </div>
        <div class="shops-label layout_fl">
            <h4 class="shops-label-name">店铺：${hotel.hotel_name}</h4>
            <div class="shops-label-param">
                <span class="shops-label-item">
                    <span class="shops-label-up">描述</span>
                    <span class="shops-label-down">4.8</span>
                </span>
                <span class="shops-label-item">
                    <span class="shops-label-up">服务</span>
                    <span class="shops-label-down">5.8</span>
                </span>
                <span class="shops-label-item">
                    <span class="shops-label-up">保障</span>
                    <span class="shops-label-down">4.8</span>
                </span>
            </div>
            <a class="shops-btn shops-btn0">收藏店铺</a>
            <a class="shops-btn shops-btn1">联系客服</a>
        </div>
    </div>
</div>
```

* hotelDetails.jsp - 房间列表
  从 request 域中取 roomList 数据，jstl 标签遍历。

```html
<ul>
    <c:forEach items="${roomList}" var="room">
        <li>
            <div class="room-div1">
                <div class="room-div2">
                    <div class="room-div3">
                        <img style="margin-left: 10px" alt="${room.room_name}" src="${pageContext.request.contextPath}/${room.img.img_add}">
                    </div>
                    <div class="room-div4">
                        <table border="1" >
                            <tr>
                                <td style="font-size: 25px" colspan="6" align="center">${room.room_name}</td>
                            </tr>
                            <tr align="center">
                                <td class="room-td1">空高</td>
                                <td class="room-td2">${room.room_height}</td>
                                <td class="room-td1">低消</td>
                                <td class="room-td3">${room.room_min_fee}</td>
                                <td class="room-td1">形状</td>
                                <td class="room-td4">${room.room_form}</td>
                            </tr>
                            <tr align="center">
                                <td class="room-td1">柱子</td>
                                <td class="room-td2">${room.room_pillar}</td>
                                <td class="room-td1">晚餐</td>
                                <td class="room-td3">${room.room_dinner}</td>
                                <td class="room-td1">电费</td>
                                <td class="room-td4">${room.room_electric_fee}</td>
                            </tr>
                            <tr align="center">
                                <td class="room-td1">拆分</td>
                                <td class="room-td2">${room.room_split}</td>
                                <td class="room-td1">面积</td>
                                <td class="room-td3">${room.room_area}</td>
                                <td class="room-td1">灯光</td>
                                <td class="room-td4">${room.room_lamplight}</td>
                            </tr>
                            <tr align="center">
                                <td class="room-td1">LED</td>
                                <td class="room-td2">${room.room_LED}</td>
                                <td class="room-td1">桌数</td>
                                <td class="room-td3">${room.room_tables}</td>
                                <td colspan="2"></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </li>
    </c:forEach>
</ul>
```

* hotelDetails.jsp - 详细信息
  从 request 域中取 info 数据，jstl 标签访问其属性。

```html
<table border="1" class="info-table">
    <tr>
        <td>星级</td>
        <td>${info.info_star_level}</td>
        <td>装修时间</td>
        <td>${info.info_decorate_time}</td>
    </tr>
    <tr>
        <td>服务费</td>
        <td>${info.info_service_fee}</td>
        <td>定金</td>
        <td>${info.info_subscription}</td>
    </tr>
    <tr>
        <td>进场费</td>
        <td>${info.info_enter_fee}</td>
        <td>婚房化妆间</td>
        <td>${info.info_dressing_room}</td>
    </tr>
    <tr>
        <td>麦克风</td>
        <td>${info.info_microphone}</td>
        <td>投影仪</td>
        <td>${info.info_projector}</td>
    </tr>
    <tr>
        <td>桌布</td>
        <td>${info.info_tablecloth}</td>
        <td>电费</td>
        <td>${info.info_electric_charge}</td>
    </tr>
    <tr>
        <td>公交路线</td>
        <td colspan="3">${info.info_bus}</td>
    </tr>
    <tr>
        <td>棋牌娱乐</td>
        <td>${info.info_amusement}</td>
        <td colspan="2"></td>
    </tr>
</table>
```

* hotelDetails.jsp - 套餐信息
  从 request 域中取 packageList 数据，jstl 标签遍历每个套餐信息。

```html
<div class="pac-div4">
    <c:forEach items="${packageList}" var="myPackage">
        <a href="${pageContext.request.contextPath}/package?methodName=selectPackageById&packageId=${myPackage.package_id}">
            <div class="pac-div5">
                <div class="pac-div7">
                    <img alt="${myPackage.package_name}" src="${pageContext.request.contextPath}/${myPackage.img.img_add}">
                </div>
                <div class="pac-div8">
                    <span style="font-size: 16px">${myPackage.package_name}</span>
                </div>
                <div class="pac-div9">
                    <span style="font-size: 25px; color: #f9326d; line-height: 52.8px">￥${myPackage.package_name}</span>
                </div>
                <div class="pac-div9">
                    <span style="font-size: 14px">${myPackage.package_content}</span>
                </div>
                <div class="pac-div10">
                    <span style="font-size: 14px">销量：${myPackage.package_sales}</span>
                </div>
            </div>
        </a>
    </c:forEach>
</div>
```



### 10. 商品详情

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316145408.png)

#### 10.1 选择套餐类型

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316145416.png)

```html
<script>
        function menuClick(id) {
            console.log("menuClick" + id);
            var check = $("#"+id).attr("class");
            if (check != "check") {
                //将所有的选中取消
                $("#menu li").each(function (index) {
                    $(this).attr("class","");
                });
                //选中点击的选项
                $("#"+id).attr("class","check");
            }
        }
</script>

<ul class="gods-pro-list gods-pro-list0" id="menu">
    <c:if test="${myPackage.package_menuA != null && myPackage.package_menuB != null}">
        <li id="menuA" class="check" onclick="menuClick('menuA')"><a><span>A款</span></a></li>
        <li id="menuB" onclick="menuClick('menuB')"><a><span>B款</span></a></li>
    </c:if>
    <c:if test="${myPackage.package_menuA != null && myPackage.package_menuB == null}">
        <li id="menuA" class="check"><a><span>A款</span></a></li>
    </c:if>
    <c:if test="${myPackage.package_menuA == null && myPackage.package_menuB != null}">
        <li  id="menuB"  class="check"><a><span>B款</span></a></li>
    </c:if>
</ul>
```

#### 10.2 选择房间类型

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316145422.png)

```html
<script>
    function roomClick(roomId) {
        console.log("roomClick : " + roomId);
        var check = $("#"+roomId).attr("class","check");
        if (check != "check") {
            $("#room li").each(function (index) {
                $(this).attr("class","");
            });
            $("#"+roomId).attr("class","check")
        }
    }
</script>
  
<ul class="gods-pro-list gods-pro-list0 " id="room">
    <c:forEach items="${roomList}" var="room" varStatus="status">
        <c:if test="${status.index == 0 }">
            <li id="${room.room_id}" onclick="roomClick('${room.room_id}')" class="check"><a><span>${room.room_name}</span></a></li>
        </c:if>
        <c:if test="${status.index != 0 }">
            <li id="${room.room_id}" onclick="roomClick('${room.room_id}')"><a><span>${room.room_name}</span></a></li>
        </c:if>
    </c:forEach>

</ul>
```

#### 10.3 加减数量

![image-20200522224928578](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200522224928578.png)

```html
<script>
    function reduce() {
        var count = $("#count").val();
        if (count >= 2 && count <= 99) {
            count--;
            $("#count").val(count);
        }
    }
    function plus() {
        var count = $("#count").val();
        if (count >=0 && count <= 98) {
            count++;
            $("#count").val(count);
        }
    }
</script>
  
<dl class="gods-pro-item layout_clear">
    <dt class="gods-pro-label gods-pro-clear2">数量</dt>
    <dd class="gods-pro-param gods-pro-primary layout_fl">
        <span class="gods-counter">
            <input id="count" type="text" class="gods-counter-text" name="BuyCarNum" value="1" maxlength="3" min="1">
            <span class="gods-counter-btn">
                <span class="gods-counter-push page_icon" title="加" onclick="plus()"></span>
                <span class="gods-counter-reduce page_icon" title="减" onclick="reduce()"></span>
            </span>
            <span class="gods-counter-outs">件</span>
            <span class="gods-counter-num" id="stock">(库存99件)</span>
        </span>
    </dd>
</dl>
```



#### 10.4 加入购物车

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316145432.png)

```html
<script>

    function addCart() {
        var shoppingcart_time = getTime();
        var shoppingcart_type = $("#menu li[class='check']").text();
        var shoppingcart_place = $("#room li[class='check']").text();
        var shoppingcart_count = $("#count").val();
        $.post("${pageContext.request.contextPath}/cart",{
            "methodName":"addCart",
            "shoppingcart_time":shoppingcart_time,
            "shoppingcart_name":"${myPackage.package_name}",
            "shoppingcart_type":shoppingcart_type,
            "shoppingcart_place":shoppingcart_place,
            "shoppingcart_price":"${myPackage.package_price}",
            "shoppingcart_count":shoppingcart_count,
            "shoppingcart_img":"${myPackage.img.img_add}",
            "shoppingcart_hotelname":"${hotel.hotel_name}"
        },function (data) {
            console.log(data);
            if (data.flag) {
                //加入成功,跳转到购物车页面
                location.href = "${pageContext.request.contextPath}/center?methodName=toShoppingCart";
            } else {
                //加入失败，弹窗
                alert("服务器被挤爆了...");
            }
        },"json");
    }
</script>
```



#### 10.5 Java后端

* CartServlet

```java
@WebServlet(name = "CartServlet",urlPatterns = "/cart")
public class CartServlet extends BaseServlet {
    private CartService cartService = new CartServiceImpl();

    @MyResponseBody
    public Map addCart(HttpServletRequest request,HttpServletResponse response){
        Map<String,Object> map = new HashMap<>();
        boolean flag = true;
        String msg = "添加成功";
        try {
            Cart cart = new Cart();
            BeanUtils.populate(cart,request.getParameterMap());
            cart.setShoppingcart_id(CommonUtils.uuid());
            cart.setTb_user_user_tel("13260621887");
            cartService.addCart(cart);
            flag = true;
            msg = "添加成功";
        } catch (Exception e) {
            e.printStackTrace();
            flag = false;
            msg = "添加失败";
        }
        map.put("flag",flag);
        map.put("msg",msg);
        return map;
    }
}
```

* CartDao

```java
public class CartDaoImpl implements CartDao {
    @Override
    public void addCart(Cart cart) throws Exception {
        new QueryRunner(JDBCUtil.getDataSource())
                .update("insert into tb_shoppingcart values(?,?,?,?,?,?,?,?,?,?)",
                        cart.getShoppingcart_id(),
                        cart.getShoppingcart_time(),
                        cart.getShoppingcart_name(),
                        cart.getShoppingcart_type(),
                        cart.getShoppingcart_place(),
                        cart.getShoppingcart_price(),
                        cart.getShoppingcart_count(),
                        cart.getTb_user_user_tel(),
                        cart.getShoppingcart_img(),
                        cart.getShoppingcart_hotelname());
    }
}
```



### 11. 我的购物车

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316145441.png)

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316145447.png)

```html
<html>
<head>
    <meta charset="utf-8">
    <title>我的购物车</title>
    <link href="${pageContext.request.contextPath}/css/wedding-3.css" rel="stylesheet"/>
    <link href="${pageContext.request.contextPath}/css/wedding-2.css" rel="stylesheet"/>
    <script src="${pageContext.request.contextPath}/js/jquery-3.1.1.js"></script>
    <script>
        function reduce(cartId) {
            console.log("reduce" + cartId)
            var count = $("#" + cartId + "_count").text();
            count--;
            if (count >= 1) {
                //修改数据库
                updateCart(cartId, count);
            }
        }

        function plus(cartId) {
            console.log("plus" + cartId)
            var count = $("#" + cartId + "_count").text();
            count++;
            //修改数据库
            updateCart(cartId,count);
        }

        function setSubtotal(cartId,count) {
            var price = $("#"+cartId+"_price").text();
            var subtotal = count * price;
            console.log("subtotal:" + subtotal)
            $("#"+cartId+"_subtotal").text(subtotal);
        }

        /**
         * 设置总价
         */
        function setTotalPrice() {
            ///获取所有选中的复选框
            //获取选中的复选框对应的小计
            var totalPrice = 0;
            $(".ids:checked").each(function (index) {
                var cartId = $(this).val();
                //选中的小计
                var subtotal = $("#"+cartId+"_subtotal").text();
                totalPrice += Number(subtotal);
            })
            console.log("totalSize : " + totalPrice);
            $("#totalPrice").text("￥"+totalPrice);
        }

        function selectAll() {
            var all = $("#all");
            var check = all.prop("checked");
            $(".ids").each(function (index) {
                $(this).prop("checked",check);
            })
            //设置总价
            setTotalPrice();
        }

        function updateCart(cartId,count) {
            console.log("updateCart")
            $.post("${pageContext.request.contextPath}/cart?methodName=updateCart",{
                "shoppingcart_id":cartId,
                "shoppingcart_count":count
            },function (data) {
                console.log(data.flag);
                if (data.flag) {
                    console.log(123456)
                    //设置数量
                    $("#" + cartId + "_count").text(count);
                    //设置小计:小计=数量*单价
                    setSubtotal(cartId,count);
                    //设置总价:总价=所有选中小计之和
                    setTotalPrice();
                } else {
                    alert("服务器被挤爆了，修改失败！！！");
                }
            },"json");
        }
    </script>
</head>

<body>
<div id="public-navbar">
<div id="public-toolbar" class="hidden_active">
<div id="page_Auser">
        <div id="us_fr" class="layout_fl">
            <div class="us_ChildPage us_adjust_padding2 us2_PageUint2">
                <h4 class="us_ChildHead">我的购物车</h4>
                <div class="us_buycar">
                    <ul class="us_buycar_wrap">
                        <c:forEach items="${cartList}" var="cart">
                            <li>
                                <div class="layout_clear">
                                    <div class="us_buycar_check layout_fl">
                                        <input  type="checkbox" class="ids" value="${cart.shoppingcart_id}" onchange="setTotalPrice()">
                                    </div>
                                    <div class="us_unit_table layout_fl">
                                        <div class="us_order_line">
                                            <span>${cart.shoppingcart_time}</span><span>订单号：${cart.shoppingcart_id}</span><span></span>
                                        </div>
                                        <table>
                                            <tbody>
                                            <tr>
                                                <td><span class="cos_span">商品信息</span></td>
                                                <td><span class="cos_span">套餐类型/婚宴场地</span></td>
                                                <td><span class="cos_span">单价</span></td>
                                                <td><span class="cos_span">数量</span></td>
                                                <td><span class="cos_span">小计</span></td>
                                                <td><span class="cos_span">操作</span></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div class="img"><img
                                                            src="${pageContext.request.contextPath}/${cart.shoppingcart_img}"
                                                            style="width:100px;"><span>${cart.shoppingcart_name}</span>
                                                    </div>
                                                </td>
                                                <td><span class="cos_span">套餐类型：${cart.shoppingcart_type}</span><span
                                                        class="cos_span">婚宴场地：${cart.shoppingcart_place}</span></td>
                                                <td><span class="cos_span" style="display:block"><ins></ins></span>
                                                    <span class="cos_span" id="${cart.shoppingcart_id}_price">${cart.shoppingcart_price}</span>
                                                </td>
                                                <td>
                                                        <span class="cos_span">
                                                            <span class="amont_line">
                                                                <span class="amont_line_btn amont_line_reduce"
                                                                      onclick="reduce('${cart.shoppingcart_id}')">-</span>
                                                                <span class="amont_line_text"
                                                                      id="${cart.shoppingcart_id}_count">${cart.shoppingcart_count}</span>
                                                                <span class="amont_line_btn amont_line_push"
                                                                      onclick="plus('${cart.shoppingcart_id}')">+</span>
                                                            </span>
                                                        </span>
                                                </td>
                                                <td>
                                                    <span class="cos_span">
                                                        <em class="keyword-pink" id="${cart.shoppingcart_id}_subtotal">
                                                                ${cart.shoppingcart_count * cart.shoppingcart_price}
                                                        </em>
                                                    </span>
                                                </td>
                                                <td><span class="cos_span"><a>移入收藏夹</a>/<a>删除</a></span></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </li>
                        </c:forEach>
                    </ul>
                </div>
                <div class="us_bottom_bar layout_clear">
                    <div class="us_buycar_check layout_fl">
                        <input  id="all" type="checkbox" onchange="selectAll()">
                    </div>
                    <div class="us_buycar_state layout_fl">
                        <span class="cos_span"><a>全选</a></span>
                        <span class="cos_span"><a>清空购物车</a></span>
                    </div>
                    <div class="us_buycar_buy layout_fr">
                        <span class="cos_span">已选择<span></span>件商品</span>
                        <span class="cos_span">总价：<em class="keyword-pink" id="totalPrice">￥0.00</em></span>
                        <a class="us_button" href="${pageContext.request.contextPath}/payPage.html">去结算</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
```





### 20. 页面效果

![在这里插入图片描述](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316145512.jpg)