---
title: 03-MyBatisUtils
date: 2016-5-3 11:22:34
tags:
- 工具类
categories: 
- 21_代码片段
- 01_工具类
---

### MyBatisUtils
```java
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;

public class MyBatisUtils {

    //获得SqlSession工厂
    private static SqlSessionFactory sqlSessionFactory;
    //创建ThreadLocal绑定当前线程中的SqlSession对象
    private static final ThreadLocal<SqlSession> SQL_SESSION_THREAD_LOCAL = new ThreadLocal<>();

    static {
        try {
            InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(is);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取 SqlSession 连接对象（线程唯一）
     * @return SqlSession
     */
    public static SqlSession getSqlSession() {
        SqlSession sqlSession = SQL_SESSION_THREAD_LOCAL.get();
        if (null == sqlSession) {
            sqlSession = sqlSessionFactory.openSession();
            SQL_SESSION_THREAD_LOCAL.set(sqlSession);
        }
        return sqlSession;
    }

    /**
     * 释放 SqlSession 对象，移除线程绑定
     */
    public static void close() {
        getSqlSession().close();
        SQL_SESSION_THREAD_LOCAL.remove();
    }

    /**
     * 事务处理：提交
     */
    public static void commit() {
        getSqlSession().commit();
        close();
    }

    /**
     * 事务处理：回滚
     */
    public static void rollback() {
        getSqlSession().rollback();
        close();
    }

    /**
     * 获得接口实现类对象
     * @param t 接口类对象
     * @param <T> 接口类泛型
     * @return 返回 t 的实现类实例
     */
    public static <T> T getMapper(Class<T> t) {
        return getSqlSession().getMapper(t);
    }
}
```