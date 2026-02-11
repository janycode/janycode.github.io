---
title: 05-MyBatis 注解SQL+级联查询
date: 2017-6-18 08:26:24
tags:
- MyBatis
- 注解
categories: 
- 05_数据库
- 02_MyBatis
---



![001](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/001.png)





### 1. 注解操作

通过在接口中直接添加 MyBatis 注解（只需要注解即可），完成CRUD。

* 注意：接口注解定义完毕后，需将接口全限定名注册到 mybatis-config.xml 的`<mappers>`中。
* 经验：注解模式属于硬编码到 .java 文件中，失去了使用配置文件外部修改的优势，可结合需求选用。

```xml
<mappers>
	<mapper class="com.mybatis.part1.annotations.UserMapper" /> <!-- class="接口全限定名"-->
</mappers>
```



#### 1.1 查询

```java
public interface UserMapper {
    @Select("SELECT * FROM t_users WHERE id = #{id}")
    public User selectUserById(Integer id);

    @Select("SELECT * FROM t_users WHERE id = #{id} AND password = #{pwd}")
    public User selectUserByIdAndPwd_annotation(@Param("id") Integer id, @Param("pwd") String password);
}
```



#### 1.2 删除

```java
@Delete(value = "DELETE FROM t_users WHERE id = #{id}")
public int deleteUser(Integer id);
```



#### 1.3 修改

```java
@Update("UPDATE t_users SET name = #{name} , password = #{password} , salary = #{salary} , birthday = #{birthday} WHERE id = #{id}")
public int updateUser(User user);
```



#### 1.4 插入

```java
@Insert("INSERT INTO t_users VALUES(#{id},#{name},#{password},#{salary},#{birthday},null)")
public int insertUser(User user);

@Options(useGeneratedKeys = true , keyProperty = "id") // 自增key，主键为id
@Insert("INSERT INTO t_users VALUES(#{id},#{name},#{password},#{salary},#{birthday},null)")
public int insertUserGeneratedKeys(User user);
```

```java
    /**
     * keyProperty: 表示将select返回值设置到该属性中
     * resultType: 返回类型
     * before: 是否在insert之前执行
     * statement: 自定义子查询
     * @param userBase
     */
    @SelectKey(keyProperty = "userBase.id",resultType = String.class, before = true,
            statement = "select replace(uuid(), '-', '')")
    @Options(keyProperty = "userBase.id", useGeneratedKeys = true)
    @Insert("insert into user_base(id, " +
            "name, " +
            "passwd, " +
            "phone " +
            ") values (#{userBase.id}, " +
            "#{userBase.name}, " +
            "#{userBase.password}, " +
            "#{userBase.phone}" +
            ") "
    )
    public void insertForReg(@Param("userBase")UserBase userBase);
```



### 2. $符号的应用场景

`${attribute}` 属于字符串拼接SQL，而非预编译占位符，会有注入攻击问题，不建议在常规SQL中使用，常用于可解决动态生降序问题。



#### 2.1 $符号参数绑定

```java
public List<User> selectAllUsers1(User user); // ${name} ${id} 可获取user中的属性值
public List<User> selectAllUsers2(@Param("rule") String rule); //必须使用@Param否则会作为属性解析
```

```xml
<select id="selectAllUsers1" resultType="user">
	SELECT * FROM t_users 
    WHERE name = '${name}' or id = ${id} <!-- 拼接name和id，如果是字符类型需要用单引号：'${name}' -->
</select>
<select id="selectAllUsers2" resultType="user">
	SELECT * FROM t_users 
  	ORDER BY id ${rule} <!-- 拼接 asc | desc -->
</select>
```

```java
User user = new User(....);
List<User> ulist1 = userDAO.selectAllUsers1(user); //调用时传入user对象
List<User> ulist2 = userDao.selectAllUsers2("desc"); //调用时传入asc | desc
```



#### 2.2 $符号注入攻击

```xml
<select id="selectUsersByKeyword" resultType="user">
	SELECT * FROM t_user
  	WHERE name = '${name}' <!-- 会存在注入攻击  比如传入参数是 【String name = "tom' or '1'='1";】-->
</select>
```

|       注入攻击，拼接的内容，改变了原sql语义，被攻击！        |
| :----------------------------------------------------------: |
| ![注入](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/012.png) |



### 3. 处理关联关系-嵌套查询

思路：查询部门信息时，及联查询所属的员工信息。

* DepartmentDao接口中定义selectDepartmentById，并实现Mapper。
* EmployeeDao接口中定义selectEmployeesByDeptId，并实现Mapper。
* 当selectDepartmentById被执行时，通过`<collection>`调用selectEmployeesByDeptId方法，并传入条件参数。



#### 3.1 主表查询

定义selectEmployeesByDeptId，并书写Mapper，实现根据部门ID查询员工信息。

```java
public interface EmployeeDao {
    /**
     * 根据部门编号查询员工信息
     * @param did 部门编号
     * @return 该部门中的所有员工
     */
    public List<Employee> selectEmployeeByDeptId(@Param("did") String did);
}
```

```xml
<mapper namespace="com.mybatis.part2.one2many.EmployeeDao">
    <!-- 根据部门编号查询所有员工 -->
    <select id="selectEmployeeById" resultType="employee" >
        SELECT id,name,salary,dept_id 
      	FROM t_employees 
      	WHERE dept_id = #{did}
    </select>
</mapper>
```



#### 3.2 及联调用

定义selectDepartmentById，并书写Mapper，实现根据部门ID查询部门信息，并及联查询该部门员工信息。

```java
public interface DepartmentDao {
    /**
     * 查询部门信息
     * @param id
     * @return
     */
    public Department selectDepartmentById(@Param("id") String id);
}
```

```xml
<mapper namespace="com.mybatis.part2.one2many.DepartmentDao">
    <resultMap id="departmentResultMap" type="department">
        <id property="id" column="id" />
        <result property="name" column="name" />
        <result property="location" column="location" />
         <!-- column="传入目标方法的条件参数"  select="及联调用的查询目标"-->
        <collection property="emps" ofType="Employee" column="id" 
                    select="com.mybatis.part2.one2many.EmployeeDao.selectEmployeeByDeptId" />
    </resultMap>
    <select id="selectAllDepartments" resultMap="departmentResultMap">
        SELECT id , name , location
        FROM t_departments
        WHERE id = #{id}
    </select>
</mapper>
```



#### 3.3 延迟加载-懒加载

mybatis-config.xml 中开启延迟加载。

```xml
<settings>
	<setting name="lazyLoadingEnabled" value="true"/> <!-- 开启延迟加载（默认false） -->
</settings>
```

> 注意：
>
> 开启延迟加载后，如果不使用及联数据，则不会触发及联查询操作，有利于加快查询速度、节省内存资源。

【原理】使用 CGLIB 创建目标对象的代理对象，当调用目标方法时，进入拦截器方法，比如调用a.getB().getName()，拦截器 invoke()方法发现 a.getB()是null 值，那么就会单独发送事先保存好的查询关联 B 对象的 sql，把 B 查询上来，然后调用 a.setB(b)，于是 a 的对象 b 属性就有值了，接着完 a.getB().getName()
方法的调用。这就是延迟加载的基本原理。
不只是 Mybatis，几乎所有的包括 Hibernate，支持延迟加载的原理都是一样的。  