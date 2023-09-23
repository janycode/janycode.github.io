---
title: 16-TraceIdGenerator
date: 2023-08-20 15:16:15
tags:
- 工具类
categories:
- 20_收藏整理
- 03_工具类
---



### TraceIdGenerator

```java
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;

import java.net.InetAddress;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;


/**
 * 生成  TraceId
 */
@Slf4j
public class TraceIdGenerator {

    public static String setTraceId(String traceId) {
        ThreadTraceIdUtil.setTraceId(traceId);
        //Constant.TRACE_ID 的定义 String TRACE_ID = "traceId";
        MDC.put(Constant.TRACE_ID, traceId);
        return traceId;
    }

    public static void removeTraceId() {
        ThreadTraceIdUtil.removeTraceId();
        MDC.remove(Constant.TRACE_ID);
    }

    /**
     * 消费端创建TraceId,并设置到线程上下文中
     * 该方法只调用一次
     */
    public static String createTraceId() {
        String traceId = getTraceId();
        ThreadTraceIdUtil.setTraceId(traceId);
        return traceId;
    }

    /**
     * 生成32位traceId
     */
    private static String getTraceId() {
        StringBuilder result = new StringBuilder();
        String ip = "";

        // 获取本地ipv4地址
        try {
            InetAddress address = InetAddress.getLocalHost();
            ip = address.getHostAddress();
        } catch (Exception var5) {
            return result.toString();
        }

        // 根据.截取为String数组
        String[] ipAddressInArray = ip.split("\\.");
        // 拼装为字符串,将每一个元素转换为16进制
        for (int i = 3; i >= 0; --i) {
            Integer id = Integer.parseInt(ipAddressInArray[3 - i]);
            result.append(String.format("%02x", id));
        }

        // 拼装时间戳及随机数
        result.append(new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date()));
        result.append(UUID.randomUUID().toString(), 0, 7);
        return result.toString();
    }

    /**
     * TraceId默认第一个为空，如果没值则分配一个
     */
    public static String validateTraceId(String traceId) {
        if (null == traceId) {
            traceId = createTraceId();
        }
        return traceId;
    }
}
```



### ThreadTraceIdUtil

```java
/**
 * InheritableThreadLocal 线程传递
 */
public class ThreadTraceIdUtil {

    /**
     * 使用InheritableThreadLocal便于在主子线程间传递参数
     */
    private static final ThreadLocal<String> TRACE_ID = new InheritableThreadLocal<>();

    public ThreadTraceIdUtil() {
    }

    /**
     * 从当前线程局部变量获取TraceId
     * 首次调用该方法会生成traceId，后续每次都从线程上下文获取
     */
    public static String getTraceId() {
        return TRACE_ID.get();
    }

    public static void setTraceId(String traceId) {
        TRACE_ID.set(traceId);
    }

    public static void removeTraceId() {
        TRACE_ID.remove();
    }
}

```

