---
title: 02-LayUI快速搭建后台系统
date: 2020-2-12 21:36:21
tags:
- LayUI
- 后台系统
categories: 
- 04_大前端
- 08_LayUI
---

![image-20200701125924471](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200701125929.png)





> 核心功能：
>
> * 单页CRUD + 分页显示 + 批量删除 + 条件查询 + 下拉框回显 + 表格重载渲染
> * LayUI table 头部工具栏：显示/隐藏指定列、导出、打印、信息提示
>
> 开发环境：
>
> * Spring+SpringMVC+MyBatis（SSM分层代码结构）
> * JDK 1.8
> * Tomcat 9.0
> * IDEA 2020.1.1
>
> * LayUI v2.5.6 尝鲜
>
> 源码位置：
>
> * GidHub https://github.com/janycode/layUIdemo-CRUD.git

Demo 效果

![image-20200705140926894](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200705140928.png)

### 1. 环境配置

#### 1.1 创建数据库表

```sql
# 文档表
CREATE TABLE `tb_document`(
	`id` INT PRIMARY KEY AUTO_INCREMENT,
	`name` VARCHAR(50) NOT NULL,
	`description` VARCHAR(100) NOT NULL,
	`author` VARCHAR(20) NOT NULL,
	`uploadTime` DATE NOT NULL,
    `classId` INT NOT NULL
)CHARSET=utf8;

# 分类表
CREATE TABLE `tb_class`(
	`id` INT PRIMARY KEY AUTO_INCREMENT,
	`className` VARCHAR(20) NOT NULL
)CHARSET=utf8;
```



#### 1.2 创建工程+依赖

**创建 Maven 工程**：父工程 demo(删除src)，子工程 demo-utils、demo-dao、demo-service、demo-web

**导依赖**：

父工程 pom.xml（无需额外配置）

子工程 demo-utils `pom.xml`

```xml
    <dependencies>
        <dependency>
            <groupId>javax.mail</groupId>
            <artifactId>mail</artifactId>
            <version>1.4.7</version>
        </dependency>

        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.11.0</version>
        </dependency>
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>servlet-api</artifactId>
            <version>2.5</version>
        </dependency>
        <dependency>
            <groupId>javax.servlet.jsp</groupId>
            <artifactId>jsp-api</artifactId>
            <version>2.2.1-b03</version>
        </dependency>
    </dependencies>
```

子工程 demo-dao `pom.xml`

```xml
    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.2.6.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>5.2.6.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.20</version>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>1.1.19</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.4</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>2.0.4</version>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.12</version>
        </dependency>

        <dependency>
            <groupId>com.github.pagehelper</groupId>
            <artifactId>pagehelper</artifactId>
            <version>5.1.11</version>
        </dependency>

        <dependency>
            <groupId>com.demo</groupId>
            <artifactId>jiangyuan-utils</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>

        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.11</version>
        </dependency>
    </dependencies>
```

子工程 demo-service `pom.xml`

```xml
    <dependencies>
        <dependency>
            <groupId>com.demo</groupId>
            <artifactId>jiangyuan-dao</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>
    </dependencies>
```

子工程 demo-web `pom.xml`

```xml
    <dependencies>
        <dependency>
            <groupId>com.demo</groupId>
            <artifactId>jiangyuan-service</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.2.7.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.11.0</version>
        </dependency>

        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>jstl</artifactId>
            <version>1.2</version>
        </dependency>
        <dependency>
            <groupId>taglibs</groupId>
            <artifactId>standard</artifactId>
            <version>1.1.2</version>
        </dependency>
        <dependency>
            <groupId>org.apache.taglibs</groupId>
            <artifactId>taglibs-standard-impl</artifactId>
            <version>1.2.5</version>
        </dependency>

        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.11</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
```



#### 1.3 配置文件

applicationContext.xml（demo-dao 子工程的 resources 目录下）

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context-4.0.xsd">

    <!-- 扫描注解 -->
    <context:component-scan base-package="com.demo"/>

    <!-- 配置 读取properties文件 jdbc.properties -->
    <context:property-placeholder location="classpath:jdbc.properties"/>

    <!-- 配置 数据源 -->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="driverClassName" value="${jdbc.driver}"/>
        <property name="url" value="${jdbc.url}"/>
        <property name="username" value="${jdbc.username}"/>
        <property name="password" value="${jdbc.password}"/>
    </bean>

    <!--配置SqlSessionFactoryBean-->
    <bean id="sessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <!-- 设置数据源 -->
        <property name="dataSource" ref="dataSource"/>
        <!--配置mybatis 插件-->
        <property name="plugins">
            <set>
                <!--配置pageHelper 分页插件-->
                <bean class="com.github.pagehelper.PageInterceptor">
                    <property name="properties">
                        <props>
                            <!-- 数据库方言，可选择：oracle,mysql,mariadb 等-->
                            <prop key="helperDialect">mysql</prop>
                            <!--reasonable：分页合理化参数，默认值：false。
                            当该参数设置为true时，pageNum<=0时会查询第一页，
                            pageNum>pages（超过总数时），会查询最后一页-->
                            <prop key="reasonable">true</prop>
                            <!--supportMethodsArguments：
                            是否支持通过 Mapper 接口参数来传递分页参数，默认值：false-->
                            <prop key="supportMethodsArguments">true</prop>
                        </props>
                    </property>
                </bean>
            </set>
        </property>
    </bean>

    <!--配置Mapper扫描-->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <!--设置Mapper扫描的包-->
        <property name="basePackage" value="com.demo.dao" />
    </bean>
</beans>
```

jdbc.properties（demo-dao 子工程的 resources 目录下）

```properties
jdbc.driver=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/doc?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf8
jdbc.username=root
jdbc.password=123456
```

springmvc.xml（demo-web 子工程的 resources 目录下）

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/mvc
        http://www.springframework.org/schema/mvc/spring-mvc.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">

    <!--配置注解扫描-->
    <context:component-scan base-package="com.demo.controller"/>

    <!--设置静态资源可访问-->
    <mvc:default-servlet-handler/>

    <!--配置 SpringMVC 注解支持-->
    <mvc:annotation-driven/>

    <!--配置视图解析器-->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <!--前缀-->
        <property name="prefix" value="/WEB-INF/jsp"/>
    </bean>

</beans>
```

web.xml （demo-web 的 webapp/WEB-INF/ 目录下）

```xml
<!DOCTYPE web-app PUBLIC
        "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
        "http://java.sun.com/dtd/web-app_2_3.dtd" >

<web-app>
  <display-name>Archetype Created Web Application</display-name>

  <!-- 全局参数（配置了 applicationContext 文件） -->
  <context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>classpath:applicationContext.xml</param-value>
  </context-param>

  <!-- 过滤器：解决中文乱码问题 -->
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

  <!-- spring context对象监听器：服务器启动 context 对象创建，则会加载全局参数中的配置文件 -->
  <listener>
    <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
  </listener>

  <!-- springMVC 的核心控制器：前端控制器 -->
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

  <!-- 默认 404 状态码时跳转的页面 -->
  <!--  <error-page>-->
  <!--    <error-code>404</error-code>-->
  <!--    <location>/WEB-INF/jsp/404.jsp</location>-->
  <!--  </error-page>-->
</web-app>
```



### 2. 核心逻辑


#### 2.1 新增

![image-20200705125254794](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200705125255.png)

![image-20200705125311733](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200705125312.png)

按钮和事件：

```js
<script type="text/html" id="toolbarDemo">
    <div class="layui-btn-fluid">
        <div class="layui-input-inline">
            <button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="toAdd">
                新增一个
		   </button>
	    </div>
		...
	</div>
</script>

<script>
    layui.use('table', function () {
        var table = layui.table;

        table.render({
            elem: '#test' // 页面中渲染 table 的 id
            , toolbar: '#toolbarDemo' // 开启头部工具栏，从 toolbarDemo 中渲染工具按钮
            
		...
            
        //头工具栏事件 lay-event
        table.on('toolbar(test)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id);
            switch (obj.event) {
			   ...
                case 'toAdd': // 执行表格头部工具栏中定义 lay-event 事件的对应逻辑
                    location.href = "/doc/toAdd"; // 进入 controller
                    break;
			   ...
            }
        });
        ...
	});
</script>
```

控制器：

```java
    /**
     * 跳转 addDoc.jsp
     * @param session
     * @return
     */
    @RequestMapping("/toAdd")
    public String toAdd(HttpSession session) {
        // 下拉菜单（查询、存 session）
        findClass(session);
        return "/addDoc.jsp"; // action="/doc/addOne"
    }

    /**
     * 新增一条记录
     * @param tbDocument
     * @return
     */
    @RequestMapping("/addOne")
    public String addOne(TbDocument tbDocument) {
        int res = tbDocumentService.addDoc(tbDocument);
        return "redirect:/doc/toShowAll"; // 回到查询所有的页面
    }
```



#### 2.2 删除+批量删除

![image-20200705141005737](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200705141006.png)

按钮和事件：

```js
<!--js定义两个操作表格的按钮：编辑、删除-->
<script type="text/html" id="barDemo">
	<a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
	<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
</script>

<script>
    layui.use('table', function () {
        var table = layui.table;

        table.render({
            ...
		   , cols: [[ // 表头
                {type: 'checkbox', fixed: 'left'}
			   ...
                , {field: 'right', title: '操作', width: 120, toolbar: '#barDemo'} // 单元格中按钮
            ]]
        })
        
        ...
        
        //监听行工具事件 lay-event
        table.on('tool(test)', function (obj) {
            var data = obj.data;
            //layer.msg(obj)
            if (obj.event === 'del') {  // lay-event='del'
                layer.confirm('真的删除行么？', function (index) {
                    // 页面删除（假删）
                    obj.del();
                    layer.close(index);
                    // ajax 异步请求 - 服务器删除（真删，本质也是加标记，并不真实删除）
                    $.ajax({
                        type: "post",
                        url: "/doc/toDelete",
                        data: {"id": data["id"]}, // 使用 data['列名'] 取 table 中的实际值
                        success: function (data) {
                            //layer.msg(data.flag + " " + data.msg);
                            if (data.msg === 'success') {
                                layer.msg(data.msg);
                                table.reload("test", {}); // 重新加载当前页面表格
                            } else {
                                alert("未知错误，请重试！");
                            }
                        },
                        dataType: "json",
                    });
                });
            }
        });

    });
</script>
```

控制器：

```java
    /**
     * 删除单个
     * @param id
     * @return
     */
    @RequestMapping("/toDelete")
    @ResponseBody
    public Map<String, Object> toDelete(Integer id) {
        int res = tbDocumentService.deleteById(id);
        Map<String, Object> map = new HashMap<>();
        map.put("flag", true);
        map.put("msg", "success");
        return map;
    }
```



![image-20200705141104473](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200705141105.png)

按钮和事件：

```js
<script type="text/html" id="toolbarDemo">
    <div class="layui-btn-fluid">
        ...
        <div class="layui-input-inline">
            <button class="layui-btn layui-btn-sm layui-btn-danger" lay-event="toDel">
                批量删除
		   </button>
	   </div>
	   ...
	</div>
</script>

<script>
    layui.use('table', function () {
        var table = layui.table;

        table.render({
            elem: '#test' // 页面中渲染 table 的 id
            , toolbar: '#toolbarDemo' // 开启头部工具栏，从 toolbarDemo 中渲染工具按钮
            
		...
            
        //头工具栏事件 lay-event
        table.on('toolbar(test)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id);
            switch (obj.event) {
			   ... // 有些默认按钮事件，按需使用
                case 'toDel': // 执行表格头部工具栏中定义 lay-event 事件的对应逻辑
                    layer.confirm('确定删除此行数据吗？', function (index) {
                        var data = checkStatus.data;
                        //layer.msg(JSON.stringify(data)); // 显示所有选中的行的内容信息，data为数组

                        var params = "";
                        for (var i in data) {
                            // & 拼接所有选中的 id 参数，映射到 sprinMVC 为 Integer[] 数组
                            params += "&ids=" + data[i].id;
                        }
					  // ajax 异步请求 - 服务器删除（真删，本质也是加标记，并不真实删除）
                        $.ajax({
                            type: "POST",
                            url: "/doc/deleteByIds",
                            data: params,
                            success: function (msg) {
                                layer.msg(msg);
                                table.reload("test", {}); // 重新加载当前页面表格
                            }
                        });
                    });
                    break;
            }
        });
        ...
	});
</script>
```

控制器：

```java
    /**
     * 批量删除
     * @param ids
     * @return
     */
    @RequestMapping("/deleteByIds")
    @ResponseBody
    public String deleteByIds(Integer [] ids) {
        for (Integer id : ids) {
            int res = tbDocumentService.deleteById(id);
        }
        return "success";
    }
```



#### 2.3 修改

![image-20200705144839849](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200705144841.png)

![image-20200705154833224](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200705154834.png)

按钮和事件：

```js
<!-- 下拉菜单 -->
<div class="layui-form-item">
    <label class="layui-form-label">分类</label>
    <div class="layui-input-inline">
        <select name="classId" lay-filter="aihao">
            <c:forEach items="${classList}" var="cls">
                <!-- JSTL 标签判断当前 id 设置选中属性 -->
                <c:if test="${tbDocument.classId == cls.id}">
                    <option value="${cls.id}" selected>${cls.className}</option>
                </c:if>
                <c:if test="${tbDocument.classId != cls.id}">
                    <option value="${cls.id}">${cls.className}</option>
                </c:if>
            </c:forEach>
        </select>
    </div>
</div>


<!--js定义两个操作表格的按钮：编辑、删除-->
<script type="text/html" id="barDemo">
	<a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
	<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
</script>

<script>
    layui.use('table', function () {
        var table = layui.table;

        table.render({
            ...
		   , cols: [[ // 表头
                {type: 'checkbox', fixed: 'left'}
			   ...
                , {field: 'right', title: '操作', width: 120, toolbar: '#barDemo'} // 单元格中按钮
            ]]
        })
        
        ...
        
        //监听行工具事件 lay-event
        table.on('tool(test)', function (obj) {
            var data = obj.data;
            //layer.msg(obj)
            if (obj.event === 'edit') { // lay-event='edit'
                // ajax 异步请求
                $.ajax({
                    type: "post",
                    url: "/doc/toUpdate",
                    data: JSON.stringify(data), // 使用 JSON 对象转换，当前行信息传入控制器
                    contentType: "application/json", // JSON 格式传入，控制器使用 @RequestBody 接收
                    success: function (data) {
                        //layer.msg(data.flag + " " + data.msg);
                        if (data.msg === 'success') { // 控制器存 session 成功
                            location.href = "/doc/update"; // 进入修改（下拉菜单+回显当前分类）
                        } else {
                            alert("未知错误，请重试！");
                        }
                    },
                    dataType: "json",
                });
            }
        });
    });
</script>
```

控制器：

```java
   /**
     * 映射获取要修改的数据，响应 success
     * @return
     */
    @RequestMapping("/toUpdate")
    @ResponseBody
    public String toUpdate(@RequestBody TbDocument tbDocument, HttpSession session) throws Exception {
        session.setAttribute("tbDocument", tbDocument);
        Map<String, Object> map = new HashMap<>();
        map.put("flag", true);
        map.put("msg", "success");
        String jsonStr = JsonUtils.toJsonStr(map);
        return jsonStr;
    }

    /**
     * 进修改页 updateDoc.jsp
     * @return
     */
    @RequestMapping("/update")
    public String updateDoc(HttpSession session) {
        // 下拉菜单
        findClass(session);
        return "/updateDoc.jsp";
    }

    /**
     * 修改该条记录
     * @return
     */
    @RequestMapping("/updateOne")
    public String updateOne(TbDocument tbDocument) {
        int res = tbDocumentService.updateDoc(tbDocument);
        return "redirect:/doc/toShowAll";
    }
```



#### 2.4 查询+重新渲染

![image-20200705155341087](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200705155342.png)

![image-20200705161159017](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200705161200.png)

按钮和事件：

```js
<script type="text/html" id="toolbarDemo">
    <div class="layui-btn-fluid">
	   ...
        <div class="layui-input-inline">
            分类：
        </div>
        <div class="layui-input-inline">
            <div class="selectOption">
                <select name="classId" id="cls">
                    <option value="">全部</option>
                    <c:forEach items="${classList}" var="cls">
                        <option value="${cls.id}">${cls.className}</option>
                    </c:forEach>
                </select>
            </div>
        </div>
        <div class="layui-input-inline">
            <button class="layui-btn layui-btn-sm" data-type="reload" id="searchByClass">
                查询
		   </button>
        </div>
    </div>
</script>


<script>
    layui.use('table', function () {
        var table = layui.table;

        table.render({
            elem: '#test' // 页面中渲染 table 的 id
            , toolbar: '#toolbarDemo' // 开启头部工具栏，并为其绑定左侧模板
		   ...
            , url: '/doc/findAll' // 后台获取的真实数据
		   ...
            // done: 表格 reload 后继续监听按钮事件，否则按钮会在第一次查询后失效
            , done: function () {
                // 监听查询 btn 的点击事件，即注册回调
                $('#searchByClass').on('click', function () {
                    var type = $(this).data('type');
                    active[type] ? active[type].call(this) : '';
                });
            }
        });

	   // active: 设置所要监听按钮的回调，可理解为 click 事件的回调
        var active = {
            reload: function () {
                // 获取下拉框的 value，用于设置表格重新渲染时的 where 条件
                var option = jQuery("#cls option:selected");
                layer.msg("查询：" + option.val() + " " + option.text());
                // 执行重载
                table.reload('test', {
                    page: {
                        curr: 1 // 重新从第 1 页开始渲染表格
                    }
                    , where: {
                        classId: option.val() // 重新渲染条件，可设为多个条件
                    }
                }, 'data');

                // 重新渲染 select 的 option
                var array = new Array();
                var ids = new Array();
                var defaultOpt = '全部';
                $("#cls option").each(function () {
                    // 遍历保存 option 的 val 和 text
                    var txt = $(this).text();
                    var id = $(this).val();
                    if (txt !== "全部" && txt !== option.text()) {
                        array.push(txt);
                        ids.push(id);
                    }
                    // 清空原有的 option
                    $(this).val('');
                    $(this).text('');
                })

                // 回显当前选中的 option 到选项框
                jQuery("#cls option:selected").text(option.text());
                // 回显包含 全部 和其他 option 到选项框
                var str = "";
                // 追加到 select 标签内，如果当前是'全部'就不追加
                if (option.text() !== defaultOpt) {
                    // value 必须为空格，否则重新查询 全部 时，该选项不会生效
                    str += "<option value=' '>" + defaultOpt + "</option>";
                }
                // 追加其他 option
                for (var i = 0; i < array.length; i++) {
                    str += "<option value='" + ids[i] + "'>" + array[i] + "</option>";
                }
                $("#cls").append(str);
            }
        };

    });
</script>
```

控制器：

```java
    /**
     * 查询所有，响应 json
     * 1. json 返回数据格式："{\"code\": 0,\"msg\": \"\",\"count\": 1000,\"data\": []}"
     * 2. 分页数据由 layUI 异步传入 page、limit 参数来进入查询分页信息
     * @return
     */
    @RequestMapping("/findAll")
    @ResponseBody
    public Map<String, Object> findAll(Integer page, Integer limit, Integer classId) {
        PageInfo<TbDocument> pageInfo = tbDocumentService.findAll(page, limit, classId);
        // 将数量和数据封装在 layUI 表格需要的 JSON 格式中
        Map<String, Object> map = new HashMap<>();
        map.put("code", 0); // 必须
        map.put("msg", "success"); // 必须，默认""
        map.put("count", pageInfo.getTotal()); // 必须
        map.put("data", pageInfo.getList()); // 必须，默认 ""
        return map;
    }
```





### 3. 核心代码

#### 3.1 dao+pojo

Mybatis 逆向工程生成：dao 接口、pojo+pojo example实体类、Mapper.xml 实现类

（实体类属性名与数据库列名需保持一致）

![image-20200705124816568](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200705124817.png)

TbDocument

```java
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TbDocument {
    private Integer id;

    private String name;

    private String description;

    private String author;

    // 作为 json 输出时的格式
    @JsonFormat(pattern = "yyyy-MM-dd", locale = "zh", timezone = "GMT+8")
    // 给对象设置属性时，需要传入的格式，比如添加、修改
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date uploadTime;

    private Integer classId;

    private TbClass tbClass;
}
```

TbClass

```java
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TbClass {
    private Integer id;

    private String className;

    private List<TbDocument> documentList;
}
```



#### 3.2 service

TbDocumentService 接口

```java
package com.demo.service;

import com.demo.pojo.TbDocument;
import com.github.pagehelper.PageInfo;

public interface TbDocumentService {

    PageInfo<TbDocument> findAll(Integer pageNum, Integer pageSize, Integer classId);

    TbDocument findDocById(Integer id);

    int addDoc(TbDocument tbDocument);

    int updateDoc(TbDocument tbDocument);

    int deleteById(Integer id);
}
```

TbDocumentServiceImpl 实现类

```java
package com.demo.service.impl;

import com.demo.dao.TbDocumentMapper;
import com.demo.pojo.TbDocument;
import com.demo.service.TbDocumentService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TbDocumentServiceImpl implements TbDocumentService {

    @Autowired
    private TbDocumentMapper tbDocumentMapper;

    @Override
    public PageInfo<TbDocument> findAll(Integer pageNum, Integer pageSize, Integer classId) {
        // 分页查询
        PageHelper.startPage(pageNum, pageSize);
        List<TbDocument> docList = tbDocumentMapper.findAll(classId);
        PageInfo<TbDocument> pageInfo = new PageInfo<>(docList);
        return pageInfo;
    }

    @Override
    public TbDocument findDocById(Integer id) {
        return tbDocumentMapper.selectByPrimaryKey(id);
    }

    @Override
    public int addDoc(TbDocument tbDocument) {
        return tbDocumentMapper.insert(tbDocument);
    }

    @Override
    public int updateDoc(TbDocument tbDocument) {
        return tbDocumentMapper.updateByPrimaryKey(tbDocument);
    }

    @Override
    public int deleteById(Integer id) {
        return tbDocumentMapper.deleteByPrimaryKey(id);
    }
}
```

TbClassService 接口

```java
package com.demo.service;

import com.demo.pojo.TbClass;

import java.util.List;

public interface TbClassService {

    List<TbClass> findAll();

}
```

TbDocumentServiceImpl 实现类

```java
package com.demo.service.impl;

import com.demo.dao.TbDocumentMapper;
import com.demo.pojo.TbDocument;
import com.demo.service.TbDocumentService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TbDocumentServiceImpl implements TbDocumentService {

    @Autowired
    private TbDocumentMapper tbDocumentMapper;

    @Override
    public PageInfo<TbDocument> findAll(Integer pageNum, Integer pageSize, Integer classId) {
        PageHelper.startPage(pageNum, pageSize);
        List<TbDocument> docList = tbDocumentMapper.findAll(classId);
        PageInfo<TbDocument> pageInfo = new PageInfo<>(docList);
        return pageInfo;
    }

    @Override
    public TbDocument findDocById(Integer id) {
        return tbDocumentMapper.selectByPrimaryKey(id);
    }

    @Override
    public int addDoc(TbDocument tbDocument) {
        return tbDocumentMapper.insert(tbDocument);
    }

    @Override
    public int updateDoc(TbDocument tbDocument) {
        return tbDocumentMapper.updateByPrimaryKey(tbDocument);
    }

    @Override
    public int deleteById(Integer id) {
        return tbDocumentMapper.deleteByPrimaryKey(id);
    }
}
```

#### 3.3 controller

TbDocumentController 控制器

```java
package com.demo.controller;

import com.demo.pojo.TbClass;
import com.demo.pojo.TbDocument;
import com.demo.service.TbClassService;
import com.demo.service.TbDocumentService;
import com.demo.utils.JsonUtils;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/doc")
public class TbDocumentController {

    @Autowired
    private TbDocumentService tbDocumentService;
    @Autowired
    private TbClassService tbClassService;

    /**
     * 查询下拉菜单
     * @param session
     */
    @RequestMapping("/getClasses")
    @ResponseBody
    public List<TbClass> findClass(HttpSession session) {
        List<TbClass> classList = tbClassService.findAll();
        session.setAttribute("classList", classList);
        return classList;
    }

    /**
     * 进 showAll.jsp
     * @return
     */
    @RequestMapping("/toShowAll")
    public String toShowAll(HttpSession session) {
        // 下拉菜单
        findClass(session);
        return "/showAll.jsp";
    }

    /**
     * 查询所有，响应 json
     * 1. json 返回数据："{\"code\": 0,\"msg\": \"\",\"count\": 1000,\"data\": []}"
     * 2. 分页数据由 layUI 异步传入 page、limit 参数来进入查询分页信息
     * @return
     */
    @RequestMapping("/findAll")
    @ResponseBody
    public Map<String, Object> findAll(Integer page, Integer limit, Integer classId) {
        PageInfo<TbDocument> pageInfo = tbDocumentService.findAll(page, limit, classId);
        // 将数量和数据封装在 layUI 表格需要的 JSON 格式中
        Map<String, Object> map = new HashMap<>();
        map.put("code", 0); // 必须
        map.put("msg", "success"); // 必须，默认""
        map.put("count", pageInfo.getTotal()); // 必须
        map.put("data", pageInfo.getList()); // 必须，默认 ""
        return map;
    }

    /**
     * 进 addDoc.jsp
     * @return
     */
    @RequestMapping("/toAdd")
    public String toAdd(HttpSession session) {
        // 下拉菜单
        findClass(session);
        return "/addDoc.jsp";
    }

    /**
     * 新增一条记录
     * @param tbDocument
     * @return
     */
    @RequestMapping("/addOne")
    public String addOne(TbDocument tbDocument) {
        int res = tbDocumentService.addDoc(tbDocument);
        return "redirect:/doc/toShowAll";
    }

    /**
     * 进 updateDoc.jsp
     * @return
     */
    @RequestMapping("/toUpdate")
    @ResponseBody
    public String toUpdate(@RequestBody TbDocument tbDocument, HttpSession session) throws Exception {
        session.setAttribute("tbDocument", tbDocument);
        Map<String, Object> map = new HashMap<>();
        map.put("flag", true);
        map.put("msg", "success");
        String jsonStr = JsonUtils.toJsonStr(map);
        return jsonStr;
    }

    /**
     * 进 修改页
     * @return
     */
    @RequestMapping("/update")
    public String updateDoc(HttpSession session) {
        // 下拉菜单
        findClass(session);
        return "/updateDoc.jsp";
    }

    /**
     * 修改该条记录
     * @return
     */
    @RequestMapping("/updateOne")
    public String updateOne(TbDocument tbDocument) {
        int res = tbDocumentService.updateDoc(tbDocument);
        return "redirect:/doc/toShowAll";
    }

    /**
     * 删除单个
     * @param id
     * @return
     */
    @RequestMapping("/toDelete")
    @ResponseBody
    public Map<String, Object> toDelete(Integer id) {
        int res = tbDocumentService.deleteById(id);
        Map<String, Object> map = new HashMap<>();
        map.put("flag", true);
        map.put("msg", "success");
        return map;
    }

    /**
     * 批量删除
     * @param ids
     * @return
     */
    @RequestMapping("/deleteByIds")
    @ResponseBody
    public String deleteByIds(Integer [] ids) {
        for (Integer id : ids) {
            int res = tbDocumentService.deleteById(id);
        }
        return "success";
    }
}
```

#### 3.4 下拉框

下拉框被渲染在 table 的头部工具栏中。

```js
<script type="text/html" id="toolbarDemo">
    <div class="layui-btn-fluid">
        
        <div class="layui-input-inline">
        分类：
        </div>
        <div class="layui-input-inline">
            <div class="selectOption">
                <select name="classId" id="cls">
                    <option value="">全部</option>
                    <c:forEach items="${classList}" var="cls">
                    	<option value="${cls.id}">${cls.className}</option>
                    </c:forEach>
                </select>
            </div>
        </div>
        <div class="layui-input-inline">
        	<button class="layui-btn layui-btn-sm" data-type="reload" id="searchByClass">
                查询
		   </button>
        </div>

    </div>
</script>
```

```java
    /**
     * 查询下拉菜单
     * @param session
     * @return 返回值用于测试接口的 json 数据
     */
    @RequestMapping("/getClasses")
    @ResponseBody
    public List<TbClass> findClass(HttpSession session) {
        List<TbClass> classList = tbClassService.findAll();
        session.setAttribute("classList", classList);
        return classList;
    }
```

#### 3.5 表格

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" isELIgnored="false" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title>电子文档列表</title>
</head>
<link rel="stylesheet" href="${pageContext.request.contextPath}/layui/css/layui.css" media="all">
<script src="${pageContext.request.contextPath}/layui/layui.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery-3.2.1.min.js"></script>
<body>

<%-- 主体内容表格，由 LayUI 的 js 框架渲染 --%>
<table class="layui-hide" id="test" lay-filter="test"></table>
...
```

```js
<script>
    layui.use('table', function () {
        var table = layui.table;

        table.render({
            elem: '#test' // 页面中渲染 table 的 id
            , toolbar: '#toolbarDemo' // 开启头部工具栏，并为其绑定左侧模板
            , height: 730 // table 的整体高度
            , cellMinWidth: 80 // 单元格最小宽度
            , defaultToolbar: ['filter', 'exports', 'print', { // 自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
                title: '提示'
                , layEvent: 'LAYTABLE_TIPS'
                , icon: 'layui-icon-tips'
            }]
            , title: '用户数据表'
            //,url: 'test.json' // JSON 格式的测试数据
            , url: '/doc/findAll' // 后台获取的真实数据
            //,page: true // 开启分页(默认分页样式+每页10条)
            , page: {
                limit: 15 // 默认limit 是 pageSize, page 是 pageNum
                , limits: [15, 20, 30] // 下拉框，可选 pageSize，第一个值要与 limit 相同
                , first: '首页'
                , last: '尾页'
                , prev: '<i class="layui-icon layui-icon-prev"></i>' // 上一页图标样式
                , next: '<i class="layui-icon layui-icon-next"></i>' // 下一页图标样式
                , layout: ['prev', 'page', 'next', 'count', 'limit', 'skip', 'refresh']  // 自定义分页布局
            }
            , cols: [[ // 表头
                {type: 'checkbox', fixed: 'left'}
                , {field: 'id', title: '编号', width: 80, sort: true, fixed: 'left'}
                , {field: 'name', title: '文档名称', width: 150}
                , {field: 'description', title: '文档摘要'}
                , {field: 'author', title: '上传人', width: 100}
                , {field: 'uploadTime', title: '上传时间', width: 177}
                , {field: 'className', title: '分类', width: 177}
                , {field: 'right', title: '操作', width: 120, toolbar: '#barDemo'}
            ]]
            // 表格 reload 后继续监听按钮事件
            , done: function () {
                // 监听查询 btn 的点击事件，注册回调 active
                $('#searchByClass').on('click', function () {
                    var type = $(this).data('type');
                    active[type] ? active[type].call(this) : '';
                });
            }
        });

        // 设置按钮的回调，即点击事件
        var active = {
            reload: function () {
                // 获取下拉框的 value
                var option = jQuery("#cls option:selected");
                layer.msg("查询：" + option.val() + " " + option.text());
                // 执行重载
                table.reload('test', {
                    page: {
                        curr: 1 //重新从第 1 页开始
                    }
                    , where: {
                        classId: option.val()
                    }
                }, 'data');

                // 重新渲染 select 的 option
                var array = new Array();
                var ids = new Array();
                var defaultOpt = '全部';
                $("#cls option").each(function () {
                    // 遍历保存 option 的 val 和 text
                    var txt = $(this).text();
                    var id = $(this).val();
                    if (txt !== "全部" && txt !== option.text()) {
                        array.push(txt);
                        ids.push(id);
                    }
                    // 清空原有的 option
                    $(this).val('');
                    $(this).text('');
                })

                // 回显当前选中的 option 到选项框
                jQuery("#cls option:selected").text(option.text());
                // 回显包含 全部 和其他 option 到选项框
                var str = "";
                // 追加到 select 标签内，如果当前是'全部'就不追加
                if (option.text() !== defaultOpt) {
                    // value 必须为空格，否则重新查询 全部 时，该选项不会生效
                    str += "<option value=' '>" + defaultOpt + "</option>";
                }
                // 追加其他 option
                for (var i = 0; i < array.length; i++) {
                    str += "<option value='" + ids[i] + "'>" + array[i] + "</option>";
                }
                $("#cls").append(str);
            }
        };

        // table 中的 lay-event 事件
        table.on('toolbar(test)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id);
            switch (obj.event) {
                case 'getCheckData':
                    var data = checkStatus.data;
                    layer.alert(JSON.stringify(data));
                    break;
                case 'getCheckLength':
                    var data = checkStatus.data;
                    layer.msg('选中了：' + data.length + ' 个');
                    break;
                case 'isAll':
                    layer.msg(checkStatus.isAll ? '全选' : '未全选');
                    break;
                //自定义头工具栏右侧图标 - 提示
                case 'LAYTABLE_TIPS':
                    layer.alert('这是工具栏右侧自定义的一个图标按钮');
                    break;
                case 'toAdd':
                    location.href = "/doc/toAdd";
                    break;
                case 'toDel':
                    layer.confirm('真的删除这些行么？', function (index) {
                        var data = checkStatus.data;
                        //layer.alert(JSON.stringify(data));

                        var params = "";
                        for (var i in data) {
                            //alert(data[i].vid+"---");
                            params += "&ids=" + data[i].id;
                        }

                        $.ajax({
                            type: "POST",
                            url: "/doc/deleteByIds",
                            data: params,
                            success: function (msg) {
                                layer.alert(msg);
                                table.reload("test", {});//重新加载当前页面表格
                            }
                        });
                    });
                    break;
            }
        });

        //监听行工具事件
        table.on('tool(test)', function (obj) {
            var data = obj.data;
            //console.log(obj)
            if (obj.event === 'del') {
                layer.confirm('真的删除行么？', function (index) {
                    // 页面删除（假删）
                    obj.del();
                    layer.close(index);

                    // 向服务端发送更新请求 - 服务器删除（真删，本质也是加标记，不真实删除）
                    $.ajax({
                        type: "post",
                        url: "/doc/toDelete",
                        data: {"id": data["id"]}, // 使用 data['列名'] 取 table 中的实际值
                        success: function (data) {
                            //layer.alert(data.flag + " " + data.msg);
                            if (data.msg === 'success') {
                                layer.alert(data.msg);
                                table.reload("test", {});//重新加载当前页面表格
                            } else {
                                alert("未知错误，请重试！");
                            }
                        },
                        dataType: "json",
                    });
                });
            } else if (obj.event === 'edit') {
                // 向服务端发送更新请求
                $.ajax({
                    type: "post",
                    url: "/doc/toUpdate",
                    data: JSON.stringify(data), // 使用 JSON 对象转换
                    contentType: "application/json",
                    success: function (data) {
                        //alert(data.flag + " " + data.msg);
                        if (data.msg === 'success') {
                            location.href = "/doc/update";
                        } else {
                            alert("未知错误，请重试！");
                        }
                    },
                    dataType: "json",
                });
            }
        });
    });
</script>
```

* table 携带 HTTP 消息请求头 `headers`：

![image-20200715225508417](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200715225510.png)



#### 3.6 表单

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" isELIgnored="false" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title>修改电子文档</title>
</head>
<link rel="stylesheet" href="${pageContext.request.contextPath}/layui/css/layui.css" media="all">
<script src="${pageContext.request.contextPath}/layui/layui.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery-3.2.1.min.js"></script>
<body>

<div class="layui-container">
    <br>
    <br>
    <div align="center">
        <!-- JSTL 标签判断 id 区分新增 or 修改 -->
        <h2 style="font-family: '楷体';font-size: 38px;">新增/修改电子文档</h2>
    </div>
    <br>
    <br>
    <!-- 表单：layui-form -->
    <form class="layui-form" action="/doc/updateOne">
        <div class="layui-form-item">
            <label class="layui-form-label">文档编号</label>
            <div class="layui-input-inline"> <!-- layui-input-block 输入框长度顶边 -->
                <input type="text" name="id" readonly autocomplete="off" class="layui-input" style="background-color: lightgray"
                       value="${tbDocument.id}">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">文档名称</label>
            <div class="layui-input-inline"> <!-- layui-input-block 输入框长度顶边 -->
                <input type="text" name="name" required lay-verify="required" autocomplete="off" class="layui-input"
                       value="${tbDocument.name}">
            </div>
        </div>
        <div class="layui-form-item layui-form-text">
            <label class="layui-form-label">文本域</label>
            <div class="layui-input-block">
                <textarea name="description" class="layui-textarea">${tbDocument.description}</textarea>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">上传人</label>
            <div class="layui-input-inline"> <!-- layui-input-block 输入框长度顶边 -->
                <input type="text" name="author" required lay-verify="required" autocomplete="off" class="layui-input"
                       value="${tbDocument.author}">
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label">分类</label>
            <div class="layui-input-inline">
                <select name="classId" lay-filter="aihao">
                    <!-- JSTL 标签判断 id 区分新增 or 修改，修改的情况设置当前被选中的项 -->
                    <c:forEach items="${classList}" var="cls">
                        <c:if test="${tbDocument.classId == cls.id}">
                        	<option value="${cls.id}" selected>${cls.className}</option>
                        </c:if>
                        <c:if test="${tbDocument.classId == cls.id}">
                        	<option value="${cls.id}">${cls.className}</option>
					  </c:if>
                    </c:forEach>
                </select>
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label">上传时间</label>
            <div class="layui-input-inline"> <!-- layui-input-block 输入框长度顶边 -->
                <input type="date" name="uploadTime" required lay-verify="required" autocomplete="off"
                       class="layui-input" value="${tbDocument.uploadTime}">
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-input-block">
                <button class="layui-btn" lay-submit lay-filter="formDemo">提交</button>
                <button class="layui-btn" onclick="toShowAll()">返回</button>
            </div>
        </div>
    </form>
</div>

<script>
    // 必须导入 form 模块，才能保证表单正常渲染
    layui.use('form', function () {
        var form = layui.form;
        //监听提交
        form.on('submit(formDemo)', function (data) {
            layer.msg(JSON.stringify(data.field));
            return true; // true: 跳转到 form 的 action   false：不跳转
        });
    });
</script>


</body>
</html>
```

#### 3.7 QueryVo 条件查询工具类

util 子工程：com.demo.utils

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QueryVo implements Serializable {
    // 查询条件 1
    private String title;
    // 查询条件 2
    private String speakerId;
    // 查询条件 3
    private String courseId;
    ...
}
```

web 子工程：controller

```java
    // 使用 QueryVo 作为参数，自动映射
	@RequestMapping("/findAll")
    @ResponseBody
    public Map<String, Object> findAll(Integer page, Integer limit, QueryVo queryVo) {
        PageInfo<TbDocument> pageInfo = tbDocumentService.findAll(page, limit, queryVo);
        // 将数量和数据封装在 layUI 表格需要的 JSON 格式中
        Map<String, Object> map = new HashMap<>();
        map.put("code", 0); // 必须
        map.put("msg", "success"); // 必须，默认""
        map.put("count", pageInfo.getTotal()); // 必须
        map.put("data", pageInfo.getList()); // 必须，默认 ""
        return map;
    }
```

service 子工程：XXXserviceImpl

```java
    @Override
    public PageInfo<Video> findAll(Integer pageNum, Integer pageSize, QueryVo queryVo) {
        PageHelper.startPage(pageNum, pageSize);
        List<Video> videoList = videoMapper.findAll(queryVo); // 传入条件封装类引用
        PageInfo<Video> pageInfo = new PageInfo<>(videoList);
        return pageInfo;
    }
```

dao 子工程：resources/com/demo/dao （模糊查询+精确查询）

```xml
...
<!-- hashmap 结果类型：可以自动映射连表查询后的所有显示列(不论pojo实体类是否有该属性) -->
<select id="findAll" resultType="hashmap">
    SELECT
    <include refid="Base_Column_List_Name"/>
    FROM video,
    speaker,
    course
    WHERE video.`spearker_id` = speaker.`id`
    AND video.`course_id` = course.`id`
    <trim>
        <if test="title != null and title != ''">
            AND video.title LIKE CONCAT('%', #{title,jdbcType=VARCHAR}, '%')
        </if>
        <if test="speakerId != null and speakerId != ''">
            AND video.`spearker_id` = #{speakerId,jdbcType=VARCHAR}
        </if>
        <if test="courseId != null and courseId != ''">
            AND video.`course_id` = #{courseId,jdbcType=VARCHAR}
        </if>
    </trim>
</select>
```

> 自动取值：
>
> * Mapper.xml 文件的标签中，可以自动从 QueryVo 变量中映射取值，如 title、speakerId、courseId
>
> 自动映射：
>
> * `resultType="hashmap"` 结果类型可以`自动映射连表查询后的所有显示列到 pojo 实体类`(不论 pojo 实体类是否有该列字段的属性) 

