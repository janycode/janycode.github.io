---
title: 02-注解定制Double精度位数
date: 2021-8-22 22:09:21
tags:
- JavaSE
- Double
- 注解
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 08_反射机制
---

![image-20210218161045094](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210218161046.png)



### 注解定制Double精度位数


```java
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.util.Objects;

/**
 * 定制Double序列化格式
 *
 * @author Jerry
 * @date 2021-08-20
 */
@Slf4j
public class DoubleSerialize extends JsonSerializer {

    private final DecimalFormat df = new DecimalFormat("0.0");

    @Override
    public void serialize(Object o, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        if (Objects.nonNull(o)) {
            //四舍五入
            df.setRoundingMode(RoundingMode.HALF_UP);
            String result = df.format(o);
            jsonGenerator.writeNumber(Double.parseDouble(result));
            log.info("转换数字：" + Double.parseDouble(result));
        } else {
            jsonGenerator.writeNumber(Double.valueOf(0));
        }
    }
}
```

```java
    @ApiModelProperty(value = "试卷总分")
    @JsonSerialize(using = DoubleSerialize.class)
    private Double paperScoreTotal;
```

![image-20220110215830845](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20220110215830845.png)

