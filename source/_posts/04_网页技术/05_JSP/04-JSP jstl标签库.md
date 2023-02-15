---
title: 04-JSP jstl标签库
date: 2017-5-29 22:26:20
tags:
- JSP
- jstl
categories: 
- 04_网页技术
- 05_JSP
---

参考资料：https://www.runoob.com/jsp/jsp-jstl.html

### 1. jstl标签库

jstl, java standard tag library 和 el 表达式结合使用，可以让功能更加强大。



### 2. jstl环境配置

① 项目中导包：

Apache Tomcat安装 JSTL 库步骤如下：

从Apache的标准标签库中下载的二进包(jakarta-taglibs-standard-current.zip)。

官方下载地址：http://archive.apache.org/dist/jakarta/taglibs/standard/binaries/
本站下载地址：[jakarta-taglibs-standard-1.1.2.zip](http://static.runoob.com/download/jakarta-taglibs-standard-1.1.2.tar.gz)

下载 **jakarta-taglibs-standard-1.1.2.zip** 包并解压，将 **jakarta-taglibs-standard-1.1.2/lib/** 下的两个 jar 文件：`standard.jar` 和 `jstl.jar` 文件拷贝到 `/WEB-INF/lib/` 下。



② 页面中导库：

如用到的 核心库 core，前缀prefix是标记使用时的写法，格式 prefix:标签

```jsp
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
```



### 3. 核心标签

```jsp
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
```

| 标签            | 描述                                                         |
| :-------------- | :----------------------------------------------------------- |
| \<c:out>        | 用于在JSP中显示数据，就像<%= ... >                           |
| \<c:set>        | 用于保存数据                                                 |
| \<c:remove>     | 用于删除数据                                                 |
| \<c:catch>      | 用来处理产生错误的异常状况，并且将错误信息储存起来           |
| `<c:if>`        | 与我们在一般程序中用的 if 一样                               |
| `<c:choose>`    | 本身只当做<c:when>和<c:otherwise>的父标签，可以作为 if-else 分支使用 |
| `<c:when>`      | <c:choose>的子标签，用来判断条件是否成立                     |
| `<c:otherwise>` | <c:choose>的子标签，接在<c:when>标签后，当<c:when>标签判断为false时被执行 |
| \<c:import>     | 检索一个绝对或相对 URL，然后将其内容暴露给页面               |
| \<c:forEach>    | 基础迭代标签，接受多种集合类型                               |
| \<c:forTokens>  | 根据指定的分隔符来分隔内容并迭代输出                         |
| \<c:param>      | 用来给包含或重定向的页面传递参数                             |
| \<c:redirect>   | 重定向至一个新的URL.                                         |
| \<c:url>        | 使用可选的查询参数来创造一个URL                              |

c:set  向域中设置数据，等价于 域对象.setAttribute()

```jsp
<%-- set标签：往域中设置数据 --%>
<c:set var="msg" scope="request" value="hello,jstl-set"/>
<%-- 获取 --%>
${msg}
```

c:remove  将数据从域中移除，等价于 域对象.removeAttribute()

```jsp
<%-- remove标签：从域中移除数据 --%>
<c:remove var="msg" scope="request"/>
<%-- 获取为空 --%>
${msg}
```

c:catch  捕获异常，等价于 try-catch

```jsp
<%-- catch标签：捕获异常 --%>
<c:catch var="e">
    <%
        int num = 1/0;
    %>
</c:catch>
<%-- 获取异常信息 --%>
${e} <br>
${e.message}
```

c:if  条件判断

```jsp
<%-- if标签：条件判断 --%>
<c:set var="msg" scope="request" value="100"/>
<c:if test="${msg == 100}">
    msg 等于 100
</c:if>

<c:if test="${msg != 100}">
    msg 不等于 100
</c:if>
```

c:choose 条件判断可以作为 if-else 多分支语句使用

```
<c:choose>
     <c:when test="布尔表达式">    <!--如果 --> 
 </c:when>      
     <c:otherwise>  <!--否则 -->    
  </c:otherwise> 
</c:choose>
```

c:forEach  遍历数组或集合

```jsp
<%
    List<String> strs = new ArrayList<>();
    strs.add("hello");
    strs.add("world");
    strs.add("OMG");
    request.setAttribute("strs", strs);
%>
${strs.size()}

<%-- forEach标签：等价于普通 for 循环 --%>
<c:forEach var="i" begin="0" end="${strs.size()}" step="1">
    ${strs[i]}
</c:forEach>

<%-- forEach标签：等价于增强 for 循环 --%>
<c:forEach var="str" items="${strs}" varStatus="status">
    ${str} <br>
    当前元素：${status.current} 下标：${status.index} 是否第1个元素：${status.first} 是否最尾元素：${status.last} <br>
</c:forEach>
<br>
${strs[1]}
```

c:forTokens  分割字符串

```jsp
<%-- forTokens标签：分割字符串 --%>
<%
    String s = "hello:word:OMG";
    request.setAttribute("s", s);
%>

<c:forTokens items="${s}" delims=":" var="subStr" varStatus="status">
    ${subStr}
</c:forTokens>
```



### 4. 格式化标签

JSTL格式化标签用来格式化并输出文本、日期、时间、数字。

引用格式化标签库的语法如下：

```jsp
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
```

| 标签                   | 描述                                     |
| :--------------------- | :--------------------------------------- |
| \<fmt:formatNumber>    | 使用指定的格式或精度格式化数字           |
| \<fmt:parseNumber>     | 解析一个代表着数字，货币或百分比的字符串 |
| \<fmt:formatDate>      | 使用指定的风格或模式格式化日期和时间     |
| \<fmt:parseDate>       | 解析一个代表着日期或时间的字符串         |
| \<fmt:bundle>          | 绑定资源                                 |
| \<fmt:setLocale>       | 指定地区                                 |
| \<fmt:setBundle>       | 绑定资源                                 |
| \<fmt:timeZone>        | 指定时区                                 |
| \<fmt:setTimeZone>     | 指定时区                                 |
| \<fmt:message>         | 显示资源配置文件信息                     |
| \<fmt:requestEncoding> | 设置request的字符编码                    |

```js
首先，在jsp页面引入<fmt> tags，<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>。
其次，将EL表达式作为fmt标签属性的value值。再增加pattern参数，为日期制定需要格式化的格式，如yyyy-MM-dd。例如：
<fmt:formatDate value="${object.dateproperty}" pattern="yyyy-MM-dd HH:mm"/>
```



### 5. SQL标签
JSTL SQL标签库提供了与关系型数据库（Oracle，MySQL，SQL Server等等）进行交互的标签。

引用SQL标签库的语法如下：

```jsp
<%@ taglib prefix="sql" uri="http://java.sun.com/jsp/jstl/sql" %>
```

| 标签                 | 描述                                                         |
| :------------------- | :----------------------------------------------------------- |
| \<sql:setDataSource> | 指定数据源                                                   |
| \<sql:setDataSource> | 运行SQL查询语句                                              |
| \<sql:update>        | 运行SQL更新语句                                              |
| \<sql:param>         | 将SQL语句中的参数设为指定值                                  |
| \<sql:dateParam>     | 将SQL语句中的日期参数设为指定的java.util.Date 对象值         |
| \<sql:transaction>   | 在共享数据库连接中提供嵌套的数据库行为元素，将所有语句以一个事务的形式来运行 |



### 6. XML标签

JSTL XML标签库提供了创建和操作XML文档的标签。引用XML标签库的语法如下：

```jsp
<%@ taglib prefix="x" uri="http://java.sun.com/jsp/jstl/xml" %>
```


在使用xml标签前，你必须将XML 和 XPath 的相关包拷贝至你的`<Tomcat 安装目录>\lib`下:

`XercesImpl.jar`
下载地址： http://www.apache.org/dist/xerces/j/

`xalan.jar`
下载地址： http://xml.apache.org/xalan-j/index.html

| 标签           | 描述                                                      |
| :------------- | :-------------------------------------------------------- |
| \<x:out>       | 与<%= ... >,类似，不过只用于XPath表达式                   |
| \<x:parse>     | 解析 XML 数据                                             |
| \<x:parse>     | 设置XPath表达式                                           |
| \<x:if>        | 判断XPath表达式，若为真，则执行本体中的内容，否则跳过本体 |
| \<x:forEach>   | 迭代XML文档中的节点                                       |
| \<x:choose>    | <x:when>和<x:otherwise>的父标签                           |
| \<x:when>      | <x:choose>的子标签，用来进行条件判断                      |
| \<x:otherwise> | <x:choose>的子标签，当<x:when>判断为false时被执行         |
| \<x:transform> | 将XSL转换应用在XML文档中                                  |
| \<x:param>     | 与<x:transform>共同使用，用于设置XSL样式表                |



### 7. JSTL函数

JSTL包含一系列标准函数，大部分是通用的字符串处理函数。引用JSTL函数库的语法如下：

```jsp
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
```

| 函数                    | 描述                                                     |
| :---------------------- | :------------------------------------------------------- |
| fn:contains()           | 测试输入的字符串是否包含指定的子串                       |
| fn:containsIgnoreCase() | 测试输入的字符串是否包含指定的子串，大小写不敏感         |
| fn:endsWith()           | 测试输入的字符串是否以指定的后缀结尾                     |
| fn:escapeXml()          | 跳过可以作为XML标记的字符                                |
| fn:indexOf()            | 返回指定字符串在输入字符串中出现的位置                   |
| fn:join()               | 将数组中的元素合成一个字符串然后输出                     |
| fn:length()             | 返回字符串长度                                           |
| fn:replace()            | 将输入字符串中指定的位置替换为指定的字符串然后返回       |
| fn:split()              | 将字符串用指定的分隔符分隔然后组成一个子字符串数组并返回 |
| fn:startsWith()         | 测试输入字符串是否以指定的前缀开始                       |
| fn:substring()          | 返回字符串的子集                                         |
| fn:substringAfter()     | 返回字符串在指定子串之后的子集                           |
| fn:substringBefore()    | 返回字符串在指定子串之前的子集                           |
| fn:toLowerCase()        | 将字符串中的字符转为小写                                 |
| fn:toUpperCase()        | 将字符串中的字符转为大写                                 |
| fn:trim()               | 移除首尾的空白符                                         |

fn:contains()函数测试输入的字符串是否包含指定的子串。

```
<c:if test="${fn:contains(<原始字符串>, <要查找的子字符串>)}">
...
</c:if>
```

fn:containsIgnoreCase()函数用于确定一个字符串是否包含指定的子串，忽略大小写。

```
<c:if test="${fn:containsIgnoreCase(<原始字符串>, <要查找的子字符串>)}">
...
</c:if>
```

fn:endsWith()函数用于确定一个字符串是否以指定后缀结尾。

```
<c:if test="${fn:endsWith(<原始字符串>, <要查找的子字符串>)}">
...
</c:if>
```

fn:escapeXml()函数忽略用于XML标记的字符。

```
<c:set var="string1" value="This is first String."/>
<c:set var="string2" value="This <abc>is second String.</abc>"/>

<p>使用 escapeXml() 函数:</p>
<p>string (1) : ${fn:escapeXml(string1)}</p>
<p>string (2) : ${fn:escapeXml(string2)}</p>

运行结果：
使用 escapeXml() 函数:
string (1) : This is first String.
string (2) : This <abc>is second String.</abc>
```

fn:indexOf()函数返回一个字符串中指定子串的位置。

```
${fn:indexOf(<原始字符串>,<子字符串>)}

<c:set var="string1" value="This is first String."/>
<c:set var="string2" value="This <abc>is second String.</abc>"/>

<p>Index (1) : ${fn:indexOf(string1, "first")}</p>
<p>Index (2) : ${fn:indexOf(string2, "second")}</p>

运行结果如下：
Index (1) : 8
Index (2) : 13
```

fn:join()函数将一个数组中的所有元素使用指定的分隔符来连接成一个字符串。

```
${fn:join([数组], <分隔符>)}

<c:set var="string1" value="www abc com"/>
<c:set var="string2" value="${fn:split(string1, ' ')}" />
<c:set var="string3" value="${fn:join(string2, '-')}" />

<p>字符串为 : ${string3}</p>

运行结果如下：

字符串为 : www-abc-com
```

fn:length()函数返回字符串长度或集合中元素的数量。

```
${fn:length(collection | string)}

<c:set var="string1" value="This is first String."/>
<c:set var="string2" value="This is second String." />

<p>字符串长度 (1) : ${fn:length(string1)}</p>
<p>字符串长度 (2) : ${fn:length(string2)}</p>

运行结果如下：
字符串长度 (1) : 21
字符串长度 (2) : 22
```

fn:replace()函数将字符串中所有指定的子串用另外的字符串替换。

```
${fn:replace(<原始字符串>, <被替换的字符串>, <要替换的字符串>)}

<c:set var="string1" value="I am from google"/>
<c:set var="string2" value="${fn:replace(string1, 
                                'google', 'baidu')}" />

<p>替换后的字符串 : ${string2}</p>

运行结果如下：
替换后的字符串 : I am from baidu
```

fn:split() 函数将一个字符串用指定的分隔符分裂为一个子串数组。

```
${fn:split(<待分隔的字符串>, <分隔符>)}

<c:set var="string1" value="www runoob com"/>
<c:set var="string2" value="${fn:split(string1, ' ')}" />
<c:set var="string3" value="${fn:join(string2, '-')}" />

<p>string3 字符串 : ${string3}</p>

运行结果如下：
string3 字符串 : www-runoob-com
```

fn:startsWith()函数用于确定一个字符串是否以指定的前缀开始。

```
<c:if test="${fn:startsWith(<原始字符串>, <搜索的前缀>)}">
            ...
</c:if>
```

fn:substring()函数返回字符串中指定开始和结束索引的子串。

```
${fn:substring(<string>, <beginIndex>, <endIndex>)}

<c:set var="string1" value="This is first String."/>
<c:set var="string2" value="${fn:substring(string1, 5, 15)}" />

<p>生成的子字符串为 : ${string2}</p>

运行结果如下：
生成的子字符串为 : is first S
```

fn:substringAfter()函数返回字符串中指定子串后面的部分。

```
${fn:substringAfter(<string>, <substring>)}

<c:set var="string1" value="This is first String."/>
<c:set var="string2" value="${fn:substringAfter(string1, 'is')}" />

<p>生成的子字符串 : ${string2}</p>

运行结果如下：
生成的子字符串 : is first String.
```

fn:substringBefore()函数返回一个字符串中指定子串前面的部分。

```
${fn:substringBefore(<string>, <substring>)}

<c:set var="string1" value="This is first String."/>
<c:set var="string2" value="${fn:substringBefore(string1, 
                                            'first')}" />

<p>生成的子字符串 : ${string2}</p>

运行结果如下：
生成的子字符串 : This is
```

fn:toLowerCase() / fn:toUpperCase()函数将字符串中的所有字符转为小写/大写。

```
${fn.toLowerCase(<string>)}
${fn:toUpperCase(<string>)}

<c:set var="string1" value="I am from ABC"/>
<c:set var="string2" value="${fn:toLowerCase(string1)}" />

<p>字符串为 : ${string2}</p>

运行结果如下：
字符串为 : i am from abc
```

fn:trim()函数将字符串两端的空白符移除。

```
${fn:trim(<string>)}

<c:set var="string1" value="I am from abcdef         "/>
<p>string1 长度 : ${fn:length(string1)}</p>

<c:set var="string2" value="${fn:trim(string1)}" />
<p>string2 长度 : ${fn:length(string2)}</p>
<p>字符串为 : ${string2}</p>

运行结果如下：
string1 长度 : 25
string2 长度 : 16
字符串为 : I am from abcdef
```

