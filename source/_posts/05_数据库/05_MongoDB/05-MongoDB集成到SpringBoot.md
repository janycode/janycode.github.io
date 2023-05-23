---
title: 05-MongoDB集成到SpringBoot
date: 2022-08-14 11:19:31
index_img: https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220813214425.png
tags:
- 数据库
- NoSQL
- MongoDB
categories: 
- 05_数据库
- 05_MongoDB
---

![image-20220813214346098](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220813214347.png)



### SpringBoot集成MongoDB

使用的版本是SpringBoot 2.6.4
可以像Mybaits Plus 一样的功能

```xml
<!-- mongodb -->
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

```yaml
spring:
  data:
    mongodb:
      #open 自定义 使用aop切面控制开关
      open: true
      host: 127.0.0.1
      port: 27017
      username: test
      password: mongodb
      authentication-database: admin  #认证的库,不加会报错
      database: test_db
```

配置类，默认不配置 添加的时候会有一个class字段，_class定义了每一条数据映射的实体类的类型，在使用SpringBoot-MongoDB的api插入数据时，即使引用类型是父类型，_class的值会插入对象的实际类型

![image-20220814112110250](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220814112111.png)

`转换器`的作用一看就能理解 ，只是查询量比较大的时候，转换器会消耗很大的资源，慎用！

```java
import org.springframework.beans.factory.BeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.data.convert.WritingConverter;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.convert.*;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

import java.util.Date;

/**
 * @description: 使用 spring data mongo 时，默认情况下会向您的集合添加一个 _class 键，
 * 以便能够处理继承。但是如果你的领域模型简单而扁平，你可以通过覆盖默认的 MappingMongoConverter 来移除它
 */
@Configuration
public class MongoConfig {

    // 注册转换器
    @Bean
    public MongoCustomConversions customConversions() {
        return MongoCustomConversions.create(i -> {
            i.registerConverter(new DateToLongConverter());
            i.registerConverter(new LongToDateConverter());
        });
    }

    /**
     * mongo映射转换器
     *
     * @param factory           mongo工厂
     * @param context           映射命名空间
     * @param customConversions 自定义转换器
     * @return org.springframework.data.mongodb.core.convert.MappingMongoConverter
     */
    @Bean
    public MappingMongoConverter mappingMongoConverter(MongoDatabaseFactory factory, MongoMappingContext context, BeanFactory beanFactory, MongoCustomConversions customConversions) {
        DbRefResolver dbRefResolver = new DefaultDbRefResolver(factory);
        MappingMongoConverter mappingConverter = new MappingMongoConverter(dbRefResolver, context);
        //添加自定义的转换器
        mappingConverter.setCustomConversions(customConversions);
        // 去掉默认mapper添加的_class
        mappingConverter.setTypeMapper(new DefaultMongoTypeMapper(null));
        return mappingConverter;
    }

    /**
     * mongo时间转换器(Long转Date)
     **/
    @ReadingConverter
    private static class LongToDateConverter implements Converter<Long, Date> {
        @Override
        public Date convert(Long source) {
            // 判断是否为毫秒,兼容之前存的毫秒级时间
            if (source.toString().length() < 11) {
                return new Date(source * 1000);
            } else return new Date(source);
        }
    }

    /**
     * mongo时间转换器(Date转Long)
     **/
    @WritingConverter
    private static class DateToLongConverter implements Converter<Date, Long> {
        @Override
        public Long convert(Date source) {
            return source.getTime() / 1000;
        }
    }
}
```

### Mongodb注解含义

![image-20220814112245789](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220814112247.png)

实体类举例：HssHistoryEntity

```java
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import hss.server.handler.DateLongTypeHandler;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.Date;
@Data
@TableName(value = "hss_history", autoResultMap = true)
@Document(collection = "hss_history")
@CompoundIndexes({@CompoundIndex(name = "age_idx", def = "{‘lastName’: 1, ‘age’: -1}")})
public class HssHistoryEntity implements Serializable {
    private static final long serialVersionUID = 1L;
    @TableId
    @Id
    private String id;
    private Long equipmentId;
    private Long typeId;
    // 需要开启自动映射
    @TableField(typeHandler = JacksonTypeHandler.class)
    private JSONObject data;
    @TableField(typeHandler = JacksonTypeHandler.class)
    private JSONObject parseData;
    // 运行正常的数据，为1才返回到前端
    private Integer state;
    private Long parseTime;
    // @Field(targetType = FieldType.INT64)
    //@TableField(typeHandler = DateLongTypeHandler.class)
    private Long createTime;
}
```

### MongoDBUtil 工具类

```java
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.client.result.UpdateResult;
import hss.server.hss.entity.HssHistoryEntity;
import hss.server.utils.DateUtils;
import hss.server.utils.PageUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.IndexOperations;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.*;

@Component
@Slf4j
public class MongoDBUtil {

    private static final Query EMPTY_QUERY = new BasicQuery("{}");
    private static MongoTemplate template;

    @Autowired
    public void setTemplate(MongoTemplate template) {
        MongoDBUtil.template = template;
    }

    // 设置索引
    private void setIndex() {
        // HssHistoryEntity实体类，自己去定义
        IndexOperations indexOps = template.indexOps(HssHistoryEntity.class);
        Index index = new Index("equipmentId", Sort.Direction.ASC);
        index.on("typeId", Sort.Direction.ASC);
        indexOps.ensureIndex(index);
    }

    private static Query idEqQuery(Serializable id) {
        Criteria criteria = Criteria.where("id").is(id);
        return Query.query(criteria);
    }

    private Query idInQuery(Collection<? extends Serializable> idList) {
        Criteria criteria = Criteria.where("id").in(idList);
        return Query.query(criteria);
    }

    private Query eqQuery(Map<String, Object> data) {
        if (CollectionUtils.isEmpty(data)) {
            return EMPTY_QUERY;
        } else {
            Criteria criteria = new Criteria();
            data.forEach((k, v) -> criteria.and(k).is(v));
            return Query.query(criteria);
        }
    }

    private static <T> Serializable getIdValue(T entity) {
        try {
            Field field = entity.getClass().getDeclaredField("id");
            field.setAccessible(true);
            return (Serializable) field.get(entity);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            e.printStackTrace();
        }
        return null;
    }

    private <T> Update getUpdate(T entity) {
        Field[] fields = entity.getClass().getDeclaredFields();
        for (Field field : fields) {
            field.setAccessible(true);
            try {
                System.out.println(field.getName() + " " + field.get(entity));
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    public <T> void save(T entity) {
        template.save(entity);
    }

    public <T> void inset(T entity) {
        template.insert(entity);
    }

    public <T> void saveBatch(Collection<T> entityList) {
        template.insertAll(entityList);
    }

    public void removeById(Serializable id, Class<?> clazz) {
        template.remove(idEqQuery(id.toString()), clazz);
    }

    public void removeByMap(Map<String, Object> columnMap, Class<?> clazz) {
        template.remove(eqQuery(columnMap), clazz);
    }

    public void removeByIds(Collection<? extends Serializable> idList, Class<?> clazz) {
        template.remove(idInQuery(idList), clazz);
    }

    public void remove(Query query, Class<?> clazz) {
        template.remove(query, clazz);
    }

    public <T> boolean updateById(T entity) {
        Assert.notNull(entity, "entity must not be null!");
        JSONObject obj = (JSONObject) JSONObject.toJSON(entity);
        DBObject update = new BasicDBObject();
        update.put("$set", obj);
        UpdateResult result = template.updateFirst(idEqQuery(getIdValue(entity)), new BasicUpdate(update.toString()), entity.getClass());
        return result.getModifiedCount() == 1L;
    }

    public <T> void updateBatchById(Collection<T> entityList) {
        entityList.forEach(e -> updateById(e));
    }

    public void update(Query query, Update update, Class<?> clazz) {
        template.updateMulti(query, update, clazz);
    }

    public static <T> void saveOrUpdate(T entity) {
        Assert.notNull(entity, "entity must not be null!");
        String key = JSONObject.toJSONString(entity);
        Update inc = new Update().inc(key, 1);
        template.upsert(idEqQuery(getIdValue(entity)), inc, entity.getClass());
    }

    public <T> void saveOrUpdateBatch(Collection<T> entityList) {
        entityList.forEach(MongoDBUtil::saveOrUpdate);
    }

    public <T> T getById(Serializable id, Class<T> clazz) {
        return template.findById(id.toString(), clazz);
    }

    public <T> T getOne(Query query, Class<T> clazz) {
        return template.findOne(query, clazz);
    }

    public <T> List<T> listByIds(Collection<? extends Serializable> idList, Class<T> clazz) {
        return template.find(idInQuery(idList), clazz);
    }

    public <T> List<T> listByMap(Map<String, Object> columnMap, Class<T> clazz) {
        return template.find(eqQuery(columnMap), clazz);
    }

    public <T> List<T> list(Class<T> clazz) {
        return template.findAll(clazz);
    }

    public <T> List<T> list(Query query, Class<T> clazz) {
        return template.find(query, clazz);
    }

    public <T> long count(Class<T> clazz) {
        return template.count(EMPTY_QUERY, clazz);
    }

    public <T> long count(Query query, Class<T> clazz) {
        return template.count(query, clazz);
    }

    public <T> PageUtils page(Map<String, Object> params, Query query, Class<T> clazz) {
        // 设置索引
        //setIndex();
        IPage<T> page = new hss.server.utils.Query<T>().getPage(params);
        page.setTotal(count(query, clazz));
        // 分页索引从0开始，当前页需要减1,这里打断点可以看出 skip跳出多少条数据，数据量大有点影响性能
        Pageable pageable = PageRequest.of((int) page.getCurrent() - 1, (int) page.getSize());
        query.with(pageable);
        List<T> records = template.find(query, clazz);
        page.setPages(page.getPages());
        page.setRecords(records);
        return new PageUtils(page);
    }
}
```

### 分页工具类

```java
import com.baomidou.mybatisplus.core.metadata.IPage;

import java.io.Serializable;
import java.util.List;

/**
 * 分页工具类
 */
public class PageUtils implements Serializable {
	private static final long serialVersionUID = 1L;
	/**
	 * 总记录数
	 */
	private int totalCount;
	/**
	 * 每页记录数
	 */
	private int pageSize;
	/**
	 * 总页数
	 */
	private int totalPage;
	/**
	 * 当前页数
	 */
	private int currPage;
	/**
	 * 列表数据
	 */
	private List<?> list;
	
	/**
	 * 分页
	 * @param list        列表数据
	 * @param totalCount  总记录数
	 * @param pageSize    每页记录数
	 * @param currPage    当前页数
	 */
	public PageUtils(List<?> list, int totalCount, int pageSize, int currPage) {
		this.list = list;
		this.totalCount = totalCount;
		this.pageSize = pageSize;
		this.currPage = currPage;
		this.totalPage = (int)Math.ceil((double)totalCount/pageSize);
	}

	/**
	 * 分页
	 */
	public PageUtils(IPage<?> page) {
		this.list = page.getRecords();
		this.totalCount = (int)page.getTotal();
		this.pageSize = (int)page.getSize();
		this.currPage = (int)page.getCurrent();
		this.totalPage = (int)page.getPages();
	}

	public int getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(int totalCount) {
		this.totalCount = totalCount;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public int getTotalPage() {
		return totalPage;
	}

	public void setTotalPage(int totalPage) {
		this.totalPage = totalPage;
	}

	public int getCurrPage() {
		return currPage;
	}

	public void setCurrPage(int currPage) {
		this.currPage = currPage;
	}

	public List<?> getList() {
		return list;
	}

	public void setList(List<?> list) {
		this.list = list;
	}
	
}
```



```java
// mongodb 查询对象
Query query = new Query();
// 查询条件构造器
Criteria criteria1 = new Criteria();
// 就像MP的wrapper
QueryWrapper<Object> wrapper = new QueryWrapper<>();
```



### Criteria 方法含义

![image-20220814112556951](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220814112558.png)