---
title: 07-MyBatis PageHelper分页
date: 2017-6-18 08:26:24
tags:
- MyBatis
- 分页
categories: 
- 05_数据库
- 02_MyBatis
---



![001](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/001.png)



### 1. 概念

PageHelper 是适用于 MyBatis 框架的一个分页插件，使用方式极为便捷，支持任何复杂的单表、多表分页查询操作。



### 2. 访问与下载

官方网站：https://pagehelper.github.io/

下载地址：https://github.com/pagehelper/Mybatis-PageHelper



### 3. 开发步骤

PageHelper中提供了多个分页操作的静态方法入口。



#### 3.1 引入依赖

pom.xml中引入PageHelper依赖。

```xml
<dependency>
		<groupId>com.github.pagehelper</groupId>
		<artifactId>pagehelper</artifactId>
		<version>5.1.10</version>
</dependency>
```



#### 3.2 配置MyBatis-config.xml

在MyBatis-config.xml中添加 `<plugins>`。

```xml
<configuration>
  	<typeAliases></typeAliases>
  
    <plugins>
        <!-- com.github.pagehelper为PageHelper类所在包名 -->
        <plugin interceptor="com.github.pagehelper.PageInterceptor"></plugin>
    </plugins>
  
  	<environments>...</environments>
</configuration>
```



#### 3.3 PageHelper应用方式

使用PageHelper提供的静态方法设置分页查询条件。

`配置分页，并检测当前线程中下一条 sql 语句，并追加 limit 参数进行查询。`

```java
@Test
public void testPagehelper(){
    UserDao userDao = MyBatisUtils.getMapper(UserDao.class);
    PageHelper.startPage(1,2);//使用PageHelper设置分页条件
    List<User> users = userDao.selectAllUsers();
    for(User user : users){
        System.out.println(user);
    }
}
```

![image-20200618084555457](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200618084557.png)



### 4. PageInfo对象

PageInfo对象中包含了分页操作中的所有相关数据。

|                        PageInfo结构图                        |
| :----------------------------------------------------------: |
| ![image-20200116145234073](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/注入.jpg) |



#### 4.1 PageInfo应用方式

使用 PageInfo 保存分页查询结果。

```java
@Test
public void testPageInfo(){
    UserDao userDao = MyBatisUtils.getMapper(UserDao.class);
    PageHelper.startPage(1, 2); // 查询第 1 页，该页总共 2 条数据
    List<User> users = userDao.selectAllUsers();
    PageInfo<User> pageInfo = new PageInfo<User>(users);//将分页查询的结果集保存在 PageInfo 对象中
    System.out.println(pageInfo);
}

@Test
public void testPageHelper() throws Exception {
    for (int i = 1; i <= 5 ; i++) {
        GoodsDao goodsDao = MyBatisUtils.getMapper(GoodsDao.class);
        // 配置分页，并检测当前线程中下一条 sql 语句，并追加 limit 参数进行查询
        PageHelper.startPage(i, 5);
        List<Goods> goodsList = goodsDao.getAllGoods();

        PageInfo<Goods> goodsPageInfo = new PageInfo<>(goodsList);
        System.out.println("-----------------------");
        System.out.println(i + " pageInfo: " + goodsPageInfo);
    }
}
```

![image-20200615164841158](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200615164841158.png)



#### 4.2 注意事项

* 只有在PageHelper.startPage()方法之后的`第一个查询会有执行分页`。
* 分页插件`不支持带有“for update”`的查询语句。
* 分页插件`不支持“嵌套查询”`，由于嵌套结果方式会导致结果集被折叠，所以无法保证分页结果数量正确。
* 可封装为**工具类**，或**页面标签**（如 `<xx:page />` 页面就有了通用分页功能）



### 5. Maven 项目添加分页

#### 5.1 导入依赖

```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper</artifactId>
    <version>5.1.11</version>
</dependency>
```



#### 5.2 配置分页插件（2选1）

2.1 第一种：在 applicationContext.xml 中添加分页插件配置

```xml
    <!-- 配置sqlSessionFactoryBean -->
    <bean name="sqlSessionFactoryBean" class="org.mybatis.spring.SqlSessionFactoryBean">
        <!-- 配置数据源 -->
        <property name="dataSource" ref="dataSource" />
        <!-- 引入mybatis-config.xml -->
        <property name="configLocation" value="classpath:mybatis-config.xml"/>

        <!--分页插件配置（applicationContext.xml 或 mybatis-config.xml 中任配其一）-->
        <property name="plugins">
            <set>
                <bean class="com.github.pagehelper.PageInterceptor">
                    <property name="properties">
                        <props>
                            <!-- 数据库方言，可选择：oracle,mysql,mariadb 等 -->
                            <prop key="helperDialect">mysql</prop>
                            <!--reasonable：分页合理化参数，默认值：false。
                            当该参数设置为true时，pageNum<=0 时会查询第一页，
                            pageNum>totalPages（总页数），会查询最后一页 -->
                            <prop key="reasonable">true</prop>
                            <!--supportMethodsArguments：
                            是否支持通过 Mapper 接口参数来传递分页参数，默认值：false -->
                            <prop key="supportMethodsArguments">true</prop>
                        </props>
                    </property>
                </bean>
            </set>
        </property>

    </bean>
```

2.2 第二种：在 mybatis-config.xml 中添加配置

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <!--分页插件配置（applicationContext.xml 或 mybatis-config.xml 中任配其一）-->
    <plugins>
        <plugin interceptor="com.github.pagehelper.PageInterceptor">
            <property name="helperDialect" value="mysql"/>
            <property name="reasonable" value="true"/>
            <property name="supportMtehodsArguments" value="true"/>
        </plugin>
    </plugins>

</configuration>
```



#### 5.3 在 controller 中添加方法

```java
	@RequestMapping("/findPage")
    public PageInfo findPage(
        /* required：是否为必需参数(默认false)   defaultValue：参数未提供时的默认值 */
        @RequestParam(value = "pNo", required = false,defaultValue = "1") Integer pageNum,
        @RequestParam(value = "pSize", required = false,defaultValue = "10") Integer pageSize){

        PageHelper.startPage(pageNum,pageSize);
        List<TbMusic> list = musicService.findAll();
        PageInfo pageInfo = new PageInfo(list); // 将查询出的 list 进行分页
        return pageInfo;
    }
```

* pageInfo.list : 查询出的分页数据（list 属性继承自父类 protected 的 list）

* PageInfo 类的属性：
 ```java
 //当前页
 private int pageNum;
 //每页的数量
 private int pageSize;
 //当前页的数量
 private int size;
 
 //由于startRow和endRow不常用，这里说个具体的用法
 //可以在页面中"显示startRow到endRow 共size条数据"
 
 //当前页面第一个元素在数据库中的行号
 private int startRow;
 //当前页面最后一个元素在数据库中的行号
 private int endRow;
 //总页数
 private int pages;
 
 //前一页
 private int prePage;
 //下一页
 private int nextPage;
 
 //是否为第一页
 private boolean isFirstPage = false;
 //是否为最后一页
 private boolean isLastPage = false;
 //是否有前一页
 private boolean hasPreviousPage = false;
 //是否有下一页
 private boolean hasNextPage = false;
 //导航页码数
 private int navigatePages;
 //所有导航页号
 private int[] navigatepageNums;
 //导航条上的第一页
 private int navigateFirstPage;
 //导航条上的最后一页
 private int navigateLastPage;
 ```



#### 4. 前端分页数据

```html
<!-- 基于BootStrap -->
<div class="container">
    <nav aria-label="..." class="navbar-right" style="margin-right:15px">
        <ul class="pagination">
            <c:if test="${pageInfo.pageNum == 1}">
                <li class="disabled"><a href="javascript:void(0)" aria-label="Previous"><span aria-hidden="true">首</span></a></li>
                <li class="disabled"><a href="javascript:void(0)" aria-label="Previous"><span aria-hidden="true">«</span></a></li>
            </c:if>
            <c:if test="${pageInfo.pageNum != 1}">
                <li><a href="/video/list?pageNum=1" aria-label="Previous"><span aria-hidden="true">首</span></a></li>
                <li><a href="/video/list?pageNum=${pageInfo.pageNum - 1}" aria-label="Previous"><span aria-hidden="true">«</span></a></li>
            </c:if>
            <!-- 当前选中样式：li class="active"
                <span class="sr-only">(current)</span> -->
            <c:if test="${pageInfo.pages < 5}">
                <c:forEach begin="1" end="${pageInfo.pages}" var="pageNo">
                    <li id="liPage${pageNo}"><a href="" id="page${pageNo}">${pageNo}</a></li>
                </c:forEach>
            </c:if>
            <c:if test="${pageInfo.pages >= 5}">
                <li id="liPage1"><a href="" id="page1">1</a></li>
                <li id="liPage2"><a href="" id="page2">2</a></li>
                <li id="liPage3"><a href="" id="page3">3</a></li>
                <li id="liPage4"><a href="" id="page4">4</a></li>
                <li id="liPage5"><a href="" id="page5">5</a></li>
            </c:if>
            <c:if test="${pageInfo.pageNum == pageInfo.pages}">
                <li class="disabled"><a href="javascript:void(0)" aria-label="Next"><span aria-hidden="true">»</span></a></li>
                <li class="disabled"><a href="javascript:void(0)" aria-label="Next"><span aria-hidden="true">尾</span></a></li>
            </c:if>
            <c:if test="${pageInfo.pageNum != pageInfo.pages}">
                <li><a href="/video/list?pageNum=${pageInfo.pageNum + 1}" aria-label="Next"><span aria-hidden="true">»</span></a></li>
                <li><a href="/video/list?pageNum=${pageInfo.pages}" aria-label="Next"><span aria-hidden="true">尾</span></a></li>
            </c:if>
        </ul>
    </nav>
</div>

<script type="text/javascript">
    $(function() {
        changePageNo();
    });

    // 每点击一次下一页：1.清除上一页码样式 2.设置当前页样式 3.设置更新所有页链接
    function changePageNo() {
        var currentPage = ${pageInfo.pageNum}; // typeof: number
        var showPageNos = 5; // 总共显示5页的页码
        var link = "/video/list?pageNum=";

        // $("#page1").text(currentPage - showPageNos + 1);
        // $("#page2").text(currentPage - showPageNos + 2);
        // $("#page3").text(currentPage - showPageNos + 3);
        // $("#page4").text(currentPage - showPageNos + 4);
        // $("#page5").text(currentPage - showPageNos + 5);
        if (currentPage > showPageNos) {
            // 页码 > 5 时
            for (var i = 1; i <= 5; i++) {
                var pageNo = currentPage - showPageNos + i;
                $("#page"+i).text(pageNo);
                $("#page"+i).attr("href", link + pageNo);
            }
            $("#liPage"+showPageNos).attr("class", "active");
        } else {
            // 页码 < 5 时
            for (var i = 1; i <= 5; i++) {
                $("#page"+i).text(i);
                $("#page"+i).attr("href", link + i);
            }
            $("#liPage"+currentPage).attr("class", "active");
        }
    }
</script>
```



#### 5. 测试

![image-20200629002053456](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200629002054.png)

