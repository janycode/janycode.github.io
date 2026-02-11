---
title: 03-DML增删改
date: 2017-6-18 23:04:05
tags:
- MySQL
- DML
categories: 
- 05_数据库
- 01_MySQL
---

![image-20200812132737977](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200812132738.png)



SQL语言分类：

1.	数据`查询`语言 `DQL`（Data Query Language）：select、where、order by、group by、having

2.	数据`定义`语言 `DDL`（Data Definition Language）：create、alter、drop

3.	数据`操作`语言 `DML`（Data Manipulation Language）：insert、update、delete

4.	事务`处理`语言 `TPL`（Transaction Process Language）：commit、rollback

5.	数据`控制`语言 `DCL`（Data Control Language）：grant、revoke


## 1.1 新增（INSERT）

> 语法：`INSERT INTO` 表名(列 1，列 2，列 3....) `VALUES`(值 1，值 2，值 3......);



#### 1.1.1 添加一条信息

```sql
# 添加一条工作岗位信息
INSERT INTO t_jobs(JOB_ID,JOB_TITLE,MIN_SALARY,MAX_SALARY) VALUES('JAVA_Le','JAVA_Lecturer',2500,9000);

# 添加一条员工信息
INSERT INTO t_employees(EMPLOYEE_ID,FIRST_NAME,LAST_NAME,EMAIL,PHONE_NUMBER,HIRE_DATE,JOB_ID,SALARY,COMMISSION_PCT,MANAGER_ID,DEPARTMENT_ID)
VALUES 
('194','Samuel','McCain','SMCCAIN', '650.501.3876', '1998-07-01', 'SH_CLERK', '3200', NULL, '123', '50'),
('195','Abba','HeNan','China', '651.521.3878', '1990-10-01', 'SH_CLERK', '15000', NULL, '123', '50');
# 多行添加，在值列表外边追加，再写一个值列表
```

- 注意：表名后的列名和 VALUES 里的`值要一一对应`（个数、顺序、类型）



## 1.2 修改（UPDATE）

> 语法：`UPDATE` 表名 `SET` 列1 = 新值1, 列2 = 新值2, ... `WHERE 条件`;



#### 1.2.1 修改一条信息

```sql
# 修改编号为100 的员工的工资为 25000
UPDATE t_employees SET SALARY = 25000 WHERE EMPLOYEE_ID = '100';

# 修改编号为135 的员工信息岗位编号为 ST_MAN，工资为3500
UPDATE t_employees SET JOB_ID=ST_MAN,SALARY = 3500 WHERE EMPLOYEE_ID = '135';
```

- 注意：SET 后多个列名=值，绝大多数情况下都要`加 WHERE 条件`，指定修改，`否则为整表更新`。



## 1.3 删除（DELETE）

> 语法：`DELETE` FROM 表名 `WHERE 条件`;



#### 1.3.1 删除一条信息

```sql
#删除编号为135 的员工
DELETE FROM t_employees WHERE EMPLOYEE_ID='135';

#删除姓Peter，并且名为 Hall 的员工
DELETE FROM t_employees WHERE FIRST_NAME = 'Peter' AND LAST_NAME='Hall';
```

- 注意：删除时，`必须加 WHERE 条件`，如若不加 WHERE条件，删除的是整张表的数据



## 1.4 清空整表数据（TRUNCATE）

> 语法：`TRUNCATE TABLE` 表名;



#### 1.4.1 清空整张表

```sql
# 清空t_countries整张表
TRUNCATE TABLE t2;
```

注意：与 DELETE 不加 WHERE 删除整表数据不同。

* DELETE 仅仅删除数据，`结构不变`；
* TRUNCATE 是`把表销毁`，再按照原表的格式`创建一张新表`。