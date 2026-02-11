---
title: 00-XxEnum
date: 2021-03-14 23:21:55
tags:
- 工具类
categories: 
- 21_代码片段
- 01_工具类
---



pom.xml

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.16</version>
</dependency>
<dependency>
    <groupId>com.google.code.google-collections</groupId>
    <artifactId>google-collect</artifactId>
    <version>snapshot-20080530</version>
</dependency>
```

XxEnum.java

```java
public class XxEnum {

    /**
     * 返回结果状态码
     */
    @Getter
    @AllArgsConstructor
    public enum XxResult {
        /**  */
        R_400("400", "系统繁忙，请稍后再试"),
        ;

        private final String code;
        private final String name;
    }

    /**
     * 功能类型
     */
    @Getter
    @AllArgsConstructor
    public enum XxType {
        /**  */
        CLIQUE("C", "拼团"),
        ;

        private final String code;
        private final String name;

        public static XxType getByCode(String code) {
            if (code != null && code.length() > 0) {
                for (XxType xxType : XxType.values()) {
                    if (code.equals(xxType.getCode())) {
                        return xxType;
                    }
                }
            }
            return null;
        }

        public static String[] getCodes() {
            List<String> codes = Lists.newArrayList(XxType.class.getEnumConstants()).stream().map(e -> e.getCode()).collect(Collectors.toList());
            return Arrays.copyOf(codes.toArray(), codes.size(), String[].class);
        }
    }
}
```

