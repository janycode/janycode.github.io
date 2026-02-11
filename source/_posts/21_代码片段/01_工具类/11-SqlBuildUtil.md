---
title: 11-SqlBuildUtil
date: 2020-9-4 21:11:56
tags:
- 工具类
categories: 
- 21_代码片段
- 01_工具类
---



### SQL语句构建

```java
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * 构造SQL语句
 *
 * @author Jerry(姜源)
 * @date 20/9/4 16:13
 */
@SuppressWarnings("all")
public class SqlBuildUtil {

    protected static Logger logger = Logger.getLogger(SqlBuildUtil.class);

    /**
     * 构造批量插入 SQL 语句
     *
     * @param
     * @return java.util.Map
     * @throws
     * @author Jerry(姜源)
     * @date 2020-09-04 16:15
     */
    public static Map batchInsert(List sourceList, Class clazz) throws Exception {
        List list = new ArrayList<>();
        //代理类对象转普通类对象
        sourceList.stream().forEach(o -> {
            try {
                Object obj = Class.forName(clazz.getName()).newInstance();
                BeanUtils.setBean(obj, BeanUtils.bean2Map(o));
                list.add(obj);
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
        //表名
        String tableName = clazz.getSimpleName();
        //类的属性名列表
        List<Field> fieldList = Arrays.asList(clazz.getDeclaredFields());
        //SQL
        StringBuilder sql = new StringBuilder();
        StringBuilder keySb = new StringBuilder("INSERT INTO");
        keySb.append(" `").append(tableName).append("` ");
        keySb.append(" (");
        int fieldLength = fieldList.size();
        //拼接属性名
        for (int i = 0; i < fieldLength; i++) {
            Field field = fieldList.get(i);
            keySb.append("`").append(field.getName()).append("`");
            if (i != fieldLength - 1) {
                keySb.append(",");
            }
        }
        keySb.append(") ").append("VALUES");
        //拼接属性值
        int listSize = list.size();
        for (int i = 0; i < listSize; i++) {
            StringBuilder valSb = new StringBuilder();
            valSb.append(" (");
            for (int j = 0; j < fieldLength; j++) {
                Field field = fieldList.get(j);
                field.setAccessible(true);
                Object val = field.get(list.get(i));
                if (String.class.equals(field.getType())) {
                    valSb.append("'").append(ObjectUtils.isEmpty(val) ? "" : val).append("'");
                } else {
                    valSb.append(ObjectUtils.isEmpty(val) ? 0 : val);
                }
                if (j != fieldLength - 1) {
                    valSb.append(",");
                }
            }
            valSb.append(");\n");
            sql.append(keySb).append(valSb);
            logger.info("构造表名为 " + tableName + " 的恢复数据量为 " + listSize + " 条，SQL:\n" + sql.toString());
        }
        return MapUtils.toMap(new Object[][]{
                {"sql", sql},
                {"count", listSize},
        });
    }

}
```

