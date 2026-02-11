---
title: 03-MyBatis ORM关系映射
date: 2017-6-18 23:04:05
tags:
- MyBatis
- ORM
categories: 
- 05_数据库
- 02_MyBatis
---

![001](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/001.png)





### 1. ORM映射【★】

#### 1.1 MyBatis自动ORM失效

MyBatis 只能自动维护库表`列名与属性名相同`时的一一对应关系，二者不同时，无法自动ORM。

|                         自动ORM失效                          |
| :----------------------------------------------------------: |
| ![007](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/008.png) |



#### 1.2 一：列的别名

在SQL中使用 `as` 为查询字段添加列别名，以匹配属性名。

> 注意：列名与属性名相同时可不需要添加 列别名，直接使用 **ResultMap** 结果映射。

```xml
<mapper namespace="com.mybatis.part2.orm.ManagerDao">
    <select id="selectManagerByIdAndPwd" resultType="com.mybatis.part2.orm.Manager">
        SELECT mgr_id AS id , mgr_name AS username , mgr_pwd AS password
        FROM t_managers
        WHERE mgr_id = #{id} AND mgr_pwd = #{pwd}
    </select>
</mapper>
```



#### 1.3 二：结果映射

**ResultMap** - 查询结果的封装规则，通过`<resultMap id="" type="">`映射，匹配列名与属性名。

> 注意：
>
> 可通过 `<settings>` 标签将 ORM 映射结果的自动映射行为配置为 `FULL` ，此时只会映射 列名与属性名 相同的值，`对象类型 和 集合类型 还需手动映射`。

mybatis-config.xml

```xml
<properties ... />

<settings>
    <!--默认PARTIAL，还有 NOT 和 FULL（还需手动映射集合） -->
    <setting name="autoMappingBehavior" value="FULL"/>
</settings>

<typeAliases>
```

Mapper.xml

```xml
<mapper namespace="com.mybatis.part2.orm.ManagerDao">

    <!--定义resultMap标签-->
    <resultMap id="managerResultMap" type="com.mybatis.part2.orm.Manager">
      	<!--关联主键与列名-->
        <id property="id" column="mgr_id" />

      	<!--关联属性与列名-->
        <result property="username" column="mgr_name" />
        <result property="password" column="mgr_pwd" />
    </resultMap>
  
     <!--使用resultMap作为ORM映射依据-->
    <select id="selectAllManagers" resultMap="managerResultMap">
        SELECT mgr_id , mgr_name , mgr_pwd
        FROM t_managers
    </select>
</mapper>
```



### 2. MyBatis处理关联关系-多表连接【★】

实体间的关系：关联关系（拥有 has、属于 belong）

- **OneToOne**：一对一关系（Passenger旅客 --- Passport护照）

- **OneToMany**：一对多关系（Employee员工 --- Department部门）

- **ManyToMany**：多对多关系（Student学生 --- Subject科目）

|                      Table建立外键关系                       |
| :----------------------------------------------------------: |
| ![008](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20191230174727813.png) |

|                      Entity添加关系属性                      |
| :----------------------------------------------------------: |
| ![009_2](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/009_2.jpg) |

|                   Mapper中将属性与列名对应                   |
| :----------------------------------------------------------: |
| ![010](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/010.png) |



#### 2.1 OneToOne

```xml
<mapper namespace="com.mybatis.part2.one2one.PassengerDao">

  	<!-- 结果映射（查询结果的封装规则） -->
    <resultMap id="passengerResultMap" type="com.mybatis.part2.one2one.Passenger">
        <id property="id" column="id"/>
        <result property="name" column="name" />
        <result property="sex" column="sex" />
        <result property="birthday" column="birthday" />

      	<!-- 关系表中数据的封装规则 -->	 <!-- 指定关系表的实体类型 -->
        <association property="passport" javaType="com.mybatis.part2.one2one.Passport">
            <id property="id" column="passport_id" />
            <result property="nationality" column="nationality" />
            <result property="expire" column="expire" />
          	<result property="passenger_id" column="passenger_id" />
        </association>
    </resultMap>

  	<!-- 多表连接查询 -->	 <!-- 结果映射（查询结果的封装规则）-->
    <select id="selectPassengerById" resultMap="passengerResultMap">
        <!-- 别名（避免与p1.id冲突） -->
        SELECT p1.id , p1.name , p1.sex , p1.birthday , p2.id as passport_id , p2.nationality , p2.expire , p2.passenger_id
        FROM t_passengers p1 LEFT JOIN t_passports p2
        ON p1.id = p2.passenger_id
        WHERE p1.id = #{id}
    </select>
</mapper>
```

* 注意：指定“一方”关系时（对象），使用 `<association javaType="">`



#### 2.2 OneToMany

```xml
<mapper namespace="com.mybatis.part2.one2many.DepartmentDao">

  	<!-- 封装规则 -->
    <resultMap id="departmentResultMap" type="com.mybatis.part2.one2many.Department">
        <id property="id" column="id" />
        <result property="name" column="name" />
        <result property="location" column="location" />
        
      	<!-- 关系表中数据的封装规则 -->		<!-- 指定关系表的实体类型 -->
        <collection property="emps" ofType="com.mybatis.part2.one2many.Employee">
            <id property="id" column="emp_id" />
            <result property="name" column="emp_name" />
            <result property="salary" column="salary" />
            <result property="dept_id" column="dept_id" />
        </collection>
    </resultMap>

  	<!-- 多表连接查询 -->			      <!-- 封装规则 -->
    <select id="selectDepartmentById" resultMap="departmentResultMap" >
      	<!-- 别名（避免与d.id、d.name冲突）-->
        SELECT d.id , d.name , d.location , e.id AS emp_id , e.name emp_name , e.salary , e.dept_id
        FROM t_departments d LEFT JOIN t_employees e
        ON d.id = e.dept_id
        WHERE d.id = #{id}
    </select>

</mapper>
```

* 注意：指定“多方”关系时（集合），使用 `<collection ofType="">`



#### 2.3 ManyToMany

|                       建立第三张关系表                       |
| :----------------------------------------------------------: |
| ![011_2](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/011_2.jpg) |

```xml
<mapper namespace="com.mybatis.part2.many2many.StudentDao">

  	<!-- 映射查询只封装两表中的信息，可忽略关系表内容 -->
    <resultMap id="allMap" type="com.mybatis.part2.many2many.Student">
        <id property="id" column="id" />
        <result property="name" column="name" />
        <result property="sex" column="sex" />
        <collection property="subjects" ofType="com.mybatis.part2.many2many.Subject">
            <id property="id" column="sid" />
            <result property="name" column="sname" />
            <result property="grade" column="grade" />
        </collection>
    </resultMap>

  	<!-- 三表连接查询 -->
    <select id="selectAllStudents" resultMap="allMap">
        SELECT s1.* , ss.* , s2.id as sid , s2.name as sname , s2.grade
        FROM t_students s1 LEFT JOIN t_stu_sub ss
        ON s1.id = ss.student_id <!-- 通过t_stu_sub表建立二者之间的关系 -->
        LEFT JOIN t_subjects s2
        ON ss.subject_id = s2.id
    </select>
</mapper>
```

* 注意：指定“多方”关系时（集合），使用 `<collection ofType="">`



#### 2.4 关系总结

一方，属性字段中添加集合；多方，属性字段中添加对象。

双方均可建立关系属性，建立关系属性后，对应的 Mapper 文件中需使用 `<ResultMap>` 完成多表映射。

- 持有对象关系属性，使用 `<association property="dept" javaType="department">`

- 持有集合关系属性，使用 `<collection property="emps" ofType="employee">`


