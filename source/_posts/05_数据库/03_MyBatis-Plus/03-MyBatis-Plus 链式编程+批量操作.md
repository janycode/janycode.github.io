---
title: 03-MyBatis-Plus 链式编程+批量操作
date: 2021-6-18 17:48:28
tags:
- MyBatis
- sql
categories: 
- 05_数据库
- 02_MyBatis
---



![001](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/001.png)

### 1. 链式编程

官网示例:

```java
// 区分:
// 链式调用 普通
UpdateChainWrapper<T> update();
// 链式调用 lambda 式。注意：不支持 Kotlin 
LambdaUpdateChainWrapper<T> lambdaUpdate();

// 等价示例：
query().eq("id", value).one();
lambdaQuery().eq(Entity::getId, value).one();

// 等价示例：
update().eq("id", value).remove();
lambdaUpdate().eq(Entity::getId, value).remove();
```

#### 1.1 链式查询

LambdaQueryWrapper 等价于 `LambdaQueryChainWrapper`。

```java
    /**
     * 获取总数
     */
    public int getUserInfoTotal() {
        //LambdaQueryWrapper<UserInfoPO> lqw = new LambdaQueryWrapper<>();
        //lqw.eq(UserInfoPO::getIsValid, CommonsConstant.ONE);
        //return userInfoMapper.selectCount(lqw);

        return new LambdaQueryChainWrapper<>(userInfoMapper)
                .eq(UserInfoPO::getIsValid, 1)
                .count();
    }
```

```java

    /**
     * 获得分页列表
     *
     * @param pageNo   页码
     * @param pageSize 页长
     */
    public List<UserInfoPO> getPageList(int pageNo, int pageSize) {
        //LambdaQueryWrapper<UserInfoPO> lqw = new LambdaQueryWrapper<>();
        //lqw.eq(UserInfoPO::getIsValid, CommonsConstant.ONE);
        //Page<UserInfoPO> userInfoPOPage = userInfoMapper.selectPage(new Page<>(pageNo, pageSize), lqw);
        //return userInfoPOPage.getRecords();

        return new LambdaQueryChainWrapper<>(userInfoMapper)
                .eq(UserInfoPO::getIsValid, 1)
                .page(new Page<>(pageNo, pageSize))
                .getRecords();
    }
```



#### 1.2 链式更新

LambdaUpdateWrapper 等价于 `LambdaUpdateChainWrapper`。

```java
    /**
     * 批量更新
     */
    public Boolean batchUpdate(List<Long> idList, Integer currentModule, Integer agreeProtocol) {
        //LambdaUpdateWrapper<UserInfoPO> luw = new LambdaUpdateWrapper<>();
        //luw.set(UserInfoPO::getCurrentModule, currentModule);
        //luw.set(UserInfoPO::getAgreeProtocol, agreeProtocol);
        //luw.in(UserInfoPO::getId, idList);
        //int update = userInfoMapper.update(null, luw);
        //return update == idList.size();
        
        return new LambdaUpdateChainWrapper<>(userInfoMapper)
                .set(UserInfoPO::getCurrentModule, currentModule)
                .set(UserInfoPO::getAgreeProtocol, agreeProtocol)
                .in(UserInfoPO::getId, idList)
                .update();
    }
```



### 2. 批量操作


#### 2.1 批量新增

```java
Long insertArticleList(List<ArticleInfo> articleInfos);
```

```xml
    <insert id="insertArticleList" useGeneratedKeys="true" keyProperty="id"  parameterType="com.xxx.ArticleInfo">
        insert ignore into article_info(articleKind, 多个字段逗号隔开, articleUrl)
                values
        <foreach collection="list" item="item" index="index" open="" separator="," close="">
            (
                #{item.articleKind},
                多个字段的取值逗号隔开,
                #{item.articleUrl}
            )
        </foreach>
    </insert>
```



* 保存批次每次100条 - demo

```java
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveBatch100(List<SendRecordListDTO> records, String wxCorpId) {
        int batchSize = 100;
        int totalSize = records.size();
        log.info("刷数据开始：totalSize -> {}", totalSize);
        //分批保存记录
        for (int i = 0; i < totalSize; i += batchSize) {
            int endIndex = Math.min(i + batchSize, totalSize);
            List<SendRecordListDTO> batchRecords = records.subList(i, endIndex);
            List<RoomReportStatisticsEntity> entityList = Lists.newArrayList();
            if (ObjUtil.isNotEmpty(batchRecords)) {
                batchRecords.forEach(r -> {
                    RoomReportStatisticsEntity entity = new RoomReportStatisticsEntity();
                    //entity.setXxx(yyy);
                    entityList.add(entity);
                });
            }

            //批量保存当前批次的记录
            if (ObjUtil.isNotEmpty(entityList)) {
                saveBatch(entityList);
            }
            log.info("刷数据进度 -> {}/{}", endIndex, totalSize);
        }
    }
```





#### 2.2 批量删除

```java
Integer deleteList(List<Long> ids);
```

```xml
    <update id="deleteList">
        update article_info
        set articleStatus =3
        where id in
        <foreach collection="list" index="index" item="item" open="(" separator="," close=")">
            #{item}
        </foreach>
    </update>
```

delete 物理删除类同。



#### 2.3 批量更新
```java
int batchUpdate(@Param("list") List<ArticleInfo> articleInfoList);
```

```xml
    <update id="batchUpdate">
        update article_info
        <trim prefix="set">
            <trim prefix=" articleKind = case " suffix=" end, ">
                <foreach collection="list" item="item">
                    when id = #{item.id} then #{item.articleKind}
                </foreach>
            </trim>
            更多字段可以直接添加，end后面的逗号需要保留
            <trim prefix=" checkUser = case " suffix=" end ">
                <foreach collection="list" item="item">
                    when id = #{item.id} then #{item.checkUser}
                </foreach>
            </trim>
        </trim>
        <where>
            id in
            <foreach collection="list" item="item" open="(" separator="," close=")" index="index">
                #{item.id}
            </foreach>
        </where>
    </update>
```

上述代码转换成 sql 如下：

```sql
    update article_info
    set articleKind = 
    case
        when id = #{item.id} then #{item.articleKind} //此处应该是<foreach>展开值
        ...
    end, checkUser = 
    case
        when id = #{item.id} then #{item.checkUser} //此处应该是<foreach>展开值
        ...
	end
    where id in (...);
```



#### 2.4 批量查询

```java
List<ArticleInfo> getArticleByIdList(@Param("list") List<Long> ids);
```

```xml
    <select id="getArticleByIdList" resultType="com.xxx.ArticleInfo">
        select * from article_info
        where isValid=1
        <if test="list != null and list.size() != 0">
            and grade in
            <foreach collection="list" index="index" open="(" close=")" item="id"  separator=",">
                #{id}
            </foreach>
        </if>
    </select>
```



