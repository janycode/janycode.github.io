---
title: 08-数据库Date转换
date: 2016-4-28 22:15:35
tags:
- JDBC
- Date
- 数据库
categories: 
- 02_编程语言
- 01_Java
- 03_JDBC
---

### MySQL 中 Date 转换

看我一张图，胜写10行码！
![image-20230316141139130](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316141139.png)



从页面获取 `String` 类型，在 entity 的类中需要转为 `java.util.Date`:

```java
public class Stu {
	private Integer stuId;
	private String stuName;
	private Integer stuAge;
	private java.util.Date stuBirthday; // 全限定名的类型
	private String stuHobby;
	private String pwd;
	private Integer gId;
    //...
}
```

```java
@WebServlet(name = "RegistServlet", urlPatterns = "/regist")
public class RegistServlet extends HttpServlet {
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		// 获取参数
		...		
		// 封装参数
		Stu stu = new Stu();
		...
		stu.setStuBirthday(DateUtils.strToDate(birthday)); // String >> java.util.Date
		System.out.println(stu);
		// 插入数据库
		...
}
```



从 java 代码中设置 `java.util.Date` 类型到数据库 `java.sql.Date` 中：

```java
public class StuDaoImpl implements StuDao {
	@Override
	public boolean regist(Stu stu) throws Exception {
		Connection connection = ConnUtils.getConnection();
		String sql = "...";
		PreparedStatement prepareStatement = connection.prepareStatement(sql);
		...
		prepareStatement.setDate(3, DateUtils.utilToSql(stu.getStuBirthday())); // java.util.Date >> java.sql.Date
		...
		return prepareStatement.executeUpdate() == 1;
	}
}
```



### DateUtils

```java
public class DateUtils {
	private static SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-DD");

	// String >> java.util.Date
	public static java.util.Date strToDate(String date) {
		try {
			return simpleDateFormat.parse(date);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}

	// java.util.Date >> java.sql.Date
	public static java.sql.Date utilToSql(java.util.Date date) {
		return new java.sql.Date(date.getTime());
	}
}
```

