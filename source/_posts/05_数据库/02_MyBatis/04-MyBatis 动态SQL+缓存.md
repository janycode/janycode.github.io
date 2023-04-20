---
title: 04-MyBatis 动态SQL+缓存
date: 2017-6-18 08:26:24
tags:
- MyBatis
- sql
categories: 
- 05_数据库
- 02_MyBatis
---



![001](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/001.png)




### 1. 动态SQL【★】

MyBatis的映射文件中支持在基础SQL上添加一些逻辑操作，并动态拼接成完整的SQL之后再执行，以达到SQL复用、简化编程的效果。



#### 1.1 < sql >

* 定义公共的 sql 片段

```xml
<mapper namespace="com.mybatis.part2.dynamic.BookDao">
    <sql id="BOOKS_FIELD"> <!-- 定义公共的 SQL 片段 -->
        SELECT id,name,author,publish,sort
    </sql>

    <select id="selectBookByCondition" resultType="com.mybatis.part2.dynamic.Book">
		<include refid="BOOKS_FIELD" /> <!-- 通过ID引用SQL片段 -->
        FROM t_books
    </select>
</mapper>
```



#### 1.2 < where >

```xml
<select id="selectBookByCondition" resultType="com.mybatis.part2.dynamic.Book">
    SELECT id , name , author , publish , sort
    FROM t_books
    <where> 
        <if test="id != null"> <!-- WHERE，会自动忽略前后缀（如：and | or） -->
            id = #{id}
        </if>
        <if test="name != null">
            and name = #{name}
        </if>
        <if test="author != null">
            and author = #{author}
        </if>
        <if test="publish != null">
            and publish = #{publish}
        </if>
        <if test="sort != null">
            and sort = #{sort}
        </if>
    </where>
</select>
```



#### 1.3 < set >

```xml
<update id="updateBookByCondition">
    UPDATE t_books
    <set>
        <if test="name != null">
            name = #{name} ,
        </if>
        <if test="author != null">
            author = #{author} ,
        </if>
        <if test="publish != null">
            publish = #{publish} ,
        </if>
        <if test="sort != null"> <!-- 最后一个逗号需要省略 -->
            sort = #{sort}
        </if>
    </set>
    WHERE id = #{id}
</update>
```



#### 1.4 < trim >

`<trim prefix="" suffix="" prefixOverrides="" suffixOverrides="">` 代替 `<where>` 、`<set>`

* **prefix** 在trim标签内sql语句加上前缀，如 where、set
* **suffix** 在trim标签内sql语句加上后缀，如插入时的 )
* **prefixOverrides**，忽略前缀，需手动写前缀，如 and、or
* **suffixOverrides**，忽略后缀，需手动写后缀，如 ,

```xml
<select id="selectBookByCondition" resultType="com.mybatis.day2.dynamic.Book">
	SELECT id,name,author,publish,sort FROM t_books
    <trim prefix="WHERE" prefixOverrides="AND|OR"> <!-- 增加WHERE前缀，自动忽略前缀 -->
        <if test="id != null">
            and id = #{id}
        </if>
        <if test="name != null">
            and name = #{name}
        </if>
        <if test="author != null">
            and author = #{author}
        </if>
        <if test="publish != null">
            and publish = #{publish}
        </if>
        <if test="sort != null">
            and sort = #{sort}
        </if>
	</trim>
</select>
```

```xml
<update id="updateBookByCondition">
    UPDATE t_books
    <trim prefix="SET" suffixOverrides=","> <!-- 增加SET前缀，自动忽略后缀 -->
        <if test="name != null">
            name = #{name},
        </if>
        <if test="author != null">
            author = #{author},
        </if>
        <if test="publish != null">
            publish = #{publish},
        </if>
        <if test="sort != null">
            sort = #{sort},
        </if>
    </trim>
	WHERE id = #{id}
</update>
```

```xml
<insert id="insertSelective" parameterType="com.hph.entity.TeaEval">
    insert into tb_teaeval
    <trim prefix="(" suffix=")" suffixOverrides=",">
      <if test="id != null">
        Id,
      </if>
      <if test="classname != null">
        className,
      </if>
      <if test="coursename != null">
        courseName,
      </if>
      <if test="teachername != null">
        teacherName,
      </if>
      <if test="teacherscore != null">
        teacherScore,
      </if>
    </trim>
    <trim prefix="values (" suffix=")" suffixOverrides=",">
      <if test="id != null">
        #{id},
      </if>
      <if test="classname != null">
        #{classname},
      </if>
      <if test="coursename != null">
        #{coursename},
      </if>
      <if test="teachername != null">
        #{teachername},
      </if>
      <if test="teacherscore != null">
        #{teacherscore},
      </if>
    </trim>
  </insert>
```



#### 1.5 < foreach >

```xml
<delete id="deleteBookByIds">
    DELETE FROM t_books
    WHERE id IN
    <foreach collection="list" open="(" separator="," close=")"  item="id" index="i">
        #{id}
    </foreach>
</delete>
```

| 参数       | 描述     | 取值                                          |
| :----------: | :--------: | :---------------------------------------------: |
| collection | 容器类型 | list、array、map                              |
| open       | 起始符   | (                                             |
| close      | 结束符   | )                                             |
| separator  | 分隔符   | ,                                             |
| index      | 下标号   | 从0开始，依次递增                             |
| item       | 当前项   | 任意名称（循环中通过 #{任意名称} 表达式访问） |




### 2. 缓存（Cache）【★】

内存中的一块存储空间，服务于某个应用程序，旨在将频繁读取的数据临时保存在内存中，便于二次快速访问。

如 redis 缓存服务器，每秒读写 10w 数据，效率比较高。

| `无缓存`<br />用户在访问相同数据时，需要发起多次对数据库的直接访问，产生大量IO、读写硬盘操作，效率低下 |
| :---------------------------------------------------------- |
| ![012](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200116145234073.png) |

| `有缓存`<br />首次访问时，查询数据库，将数据存储到缓存中；<br />再次访问时，直接访问缓存，减少IO、硬盘读写次数、提高效率 |
| :---------------------------------------------------------- |
| ![013](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/013.png) |



#### 2.1 一级缓存

`SqlSession级别的缓存`，同一个SqlSession的发起多次同构查询，会将数据保存在一级缓存中。

* 一旦执行了 commit(), close(), clearCache()等方法，一级缓存将清空。

> 注意：无需任何配置，默认开启一级缓存。



#### 2.2 二级缓存

`SqlSessionFactory级别的缓存`，同一个 SqlSessionFactory 构建的 SqlSession 发起的多次同构查询，会将数据保存在二级缓存中。

> 注意：在 sqlSession.commit() 或者 sqlSession.close() 之后生效。



##### 2.2.1 开启全局缓存(二级缓存)

> `<settings>`是MyBatis中极为重要的调整设置，他们会改变MyBatis的运行行为，其他详细配置可参考官方文档。

```xml
<configuration>
	<properties .../>
  	
  	<!-- 注意书写位置 -->
    <settings>
        <setting name="cacheEnabled" value="true"/> <!-- mybaits-config.xml中开启全局缓存（需手动开启） -->
    </settings>
  
  	<typeAliases></typeAliases>
</configuration>
```



##### 2.2.2 指定Mapper缓存

```xml
<mapper namespace="com.mybatis.part2.cache.BookDao">
    <cache /> <!-- 指定全局缓存 -->

    <select id="selectBookByCondition" resultType="com.mybatis.part2.cache.Book">
        SELECT * FROM t_books
    </select>
</mapper>
```

```java
@Test
public void testMapperCache(){
  	SqlSession sqlSession1 = MyBatisUtils.getSession();
  	BookDao bookDao1 = sqlSession1.getMapper(BookDao.class);
  	bookDao1.selectBookByCondition(new Book());
  	sqlSession1.close(); //必须关闭SqlSession才可缓存数据
    
  	/* -------------------- */

  	SqlSession sqlSession2 = MyBatisUtils.getSession();
  	BookDao bookDao2 = sqlSession2.getMapper(BookDao.class);
  	bookDao2.selectBookByCondition(new Book());
  	sqlSession2.close(); //缓存击中
}
```



##### 2.2.3 缓存清空并重新缓存

```java
@Test
public void testMapperCache(){
  	SqlSession sqlSession1 = MyBatisUtils.getSession();
  	BookDao bookDao1 = sqlSession1.getMapper(BookDao.class);
  	bookDao1.selectBookByCondition(new Book());
  	sqlSession1.close(); //必须关闭SqlSession才可缓存数据

  	//--------------------

    SqlSession sqlSession3 = MyBatisUtils.getSession();
    BookDao bookDao3 = sqlSession3.getMapper(BookDao.class);
    bookDao3.deleteBookById(102);
    sqlSession3.commit(); //DML成功，数据发生变化，缓存清空
    sqlSession3.close();
  
  	//--------------------

  	SqlSession sqlSession2 = MyBatisUtils.getSession();
  	BookDao bookDao2 = sqlSession2.getMapper(BookDao.class);
  	bookDao2.selectBookByCondition(new Book());
  	sqlSession2.close(); //缓存未击中，重新查询数据库、重新缓存
}
```

> Cache Hit Ratio [xxx.xxx.xxx]: **X.X**  缓存击中比例：
>
> `0.0` ： 0/1，0次缓存击中（调用1次sql语句，没有使用到缓存）；
>
> `0.5` ： 1/2，1次缓存击中（调用1次sql语句，使用1次缓存数据）；
>
> `0.666...` ： 2/3，2次缓存击中（调用1次sql语句，使用到缓存2次）；
>
> 以此类推...



