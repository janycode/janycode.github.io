---
title: 10-Session实现验证码登录
date: 2017-5-22 22:26:20
tags:
- Servlet
- Session
categories: 
- 04_网页技术
- 04_Servlet
---

### 使用验证码登陆 & 共享用户信息

表单数据：
```html
<form action="/demo/login" method="post">
    账户：<input type="text" name="username"  /> <br>
    密码：<input type="password" name="password" /> <br>
    验证：<input type="text" name="validateCode" /><img src="/demo/createCode"><br>
    <button type="submit">登陆</button>
</form>
```
验证码图片生成：

```java
@WebServlet(name = "CreateCodeServlet", urlPatterns = "/createCode")
public class CreateCodeServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int width = 60;//定义图片宽度
        int height = 32;//定义图片高度
        //创建图片对象
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        //创建画笔对象
        Graphics g = image.getGraphics();
        //设置背景颜色
        g.setColor(new Color(0xDCDCDC));
        g.fillRect(0, 0, width, height);//实心矩形
        //设置边框
        g.setColor(Color.black);
        g.drawRect(0, 0, width - 1, height - 1);//空心矩形

        Random rdm = new Random();
        //画干扰椭圆
        for (int i = 0; i < 50; i++) {
            int x = rdm.nextInt(width);
            int y = rdm.nextInt(height);
            g.drawOval(x, y, 0, 0);
        }
        //产生随机字符串
        String hash1 = Integer.toHexString(rdm.nextInt());
        //生成四位随机验证码
        String capstr = hash1.substring(0, 4);
        //将产生的验证码存储到session域中，方便以后进行验证码校验!
        request.getSession().setAttribute("existCode", capstr);
        System.out.println(capstr);
        g.setColor(new Color(0, 100, 0));
        g.setFont(new Font("Candara", Font.BOLD, 24));
        g.drawString(capstr, 8, 24);
        g.dispose();
        //将图片响应到浏览器
        response.setContentType("image/jpeg");
        OutputStream strm = response.getOutputStream();
        ImageIO.write(image, "jpeg", strm);
        strm.close();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```
登陆 Servlet：
```java
@WebServlet(name = "LoginServlet", urlPatterns = "/login")
public class LoginServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=utf-8");
        // 获取输入的验证码
        String validateCode = request.getParameter("validateCode");
        // 将输入的验证码和产生的随机验证码进行校验
        String existCode = (String) request.getSession().getAttribute("existCode");
        if (validateCode.equals(existCode)) {
            String username = request.getParameter("username");
            String password = request.getParameter("password");

            UserDao userDao = new UserDaoImpl();
            Userinfo inputUserinfo = new Userinfo();
            inputUserinfo.setUsername(username);
            inputUserinfo.setPassword(password);
            try {
                Userinfo existUserinfo = userDao.login(inputUserinfo);
                System.out.println(existUserinfo);
                if (null == existUserinfo) {
                    // 登陆失败，跳转登陆页面，转发
                    request.getRequestDispatcher("/login.html").forward(request, response);
                } else {
                    // 登陆成功，跳转到首页，重定向
                    request.getSession().setAttribute("existUser", existUserinfo);
                    response.sendRedirect("/demo/show");
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        } else {
            // 校验不通过，跳转到登陆页面
            request.getRequestDispatcher("/login.html").forward(request, response);
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```
展示 Servlet：
```java
@WebServlet(name = "ShowIndexServlet", urlPatterns = "/show")
public class ShowIndexServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html;charset=utf-8");
        Userinfo existUserinfo = (Userinfo) request.getSession().getAttribute("existUser");
        if (null != existUserinfo) {
            // 在登陆状态
            response.getWriter().write("欢迎回来，" + existUserinfo.getUsername());
        } else {
            // 不在登陆状态，根据需求：①提示 ②跳转到登陆页
            //response.getWriter().write("您还未登陆，<a href='/demo/login.html'>请登陆</a>");
            response.sendRedirect("/demo/login.html");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```