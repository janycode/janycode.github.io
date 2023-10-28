---
title: 04-递归解析json任意层级文件
date: 2023-10-06 17:16:35
tags:
- json
- 递归
categories:
- 20_收藏整理
- 04_配置类
---



### 递归解析json任意层级文件

java工程的 `resources` 目录下 json/json_info_all.json 文件解析。

```java
import cn.hutool.core.io.resource.ClassPathResource;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.nacos.common.utils.CollectionUtils;
import com.google.common.collect.Lists;
import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;
import java.util.Deque;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * JSON配置预加载
 *
 * @author Jerry(姜源)
 * @date 2023/09/21 16:16
 */
@Slf4j
public class JsonConfig {
    private static final String JSON_FILE_PATH = "json/json_info_all.json";
    private static final List<Map<String, Object>> DATA = Lists.newArrayList();

    static {
        try {
            JSONArray jsonArray = JSON.parseObject(new ClassPathResource(JSON_FILE_PATH).getStream(), StandardCharsets.UTF_8, new TypeReference<JSONArray>() {{
            }}.getType());
            if (CollectionUtils.isNotEmpty(jsonArray)) {
                traverseChildren(jsonArray);
            }
            log.info("JSON层级解析完成！size={}", DATA.size());
        } catch (Exception e) {
            log.error("JSON层级信息解析出错！", e);
        }
    }

    /**
     * 遍历子对象
     *
     * @param jsonArray json数组
     * @author Jerry(姜源)
     * @date 2023/09/21 16:16
     */
    private static void traverseChildren(JSONArray jsonArray) {
        Deque<JSONArray> stack = new LinkedList<>();
        stack.push(jsonArray);
        while (!stack.isEmpty()) {
            JSONArray currentArray = stack.pop();
            for (Object obj : currentArray) {
                if (obj instanceof JSONObject) {
                    JSONObject jsonObject = (JSONObject) obj;
                    if (jsonObject.containsKey("children")) {
                        JSONArray children = jsonObject.getJSONArray("children");
                        DATA.add(jsonObject);
                        if (CollectionUtils.isNotEmpty(children)) {
                            stack.push(children);
                        }
                    }
                }
            }
        }
    }

    /**
     * 获取数据
     *
     * @return {@link List }<{@link Map }<{@link String }, {@link Object }>>
     * @author Jerry(姜源)
     * @date 2023/09/21 16:16
     */
    public static List<Map<String, Object>> getData() {
        return DATA;
    }
}
```

