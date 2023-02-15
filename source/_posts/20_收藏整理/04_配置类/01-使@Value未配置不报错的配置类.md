---
title: 01-@Value未配置不报错的配置类
date: 2022-06-15 20:47:19
tags:
- 配置类
categories: 
- 20_收藏整理
- 04_配置类
---



> springboot注解@Value再未配置对应的字段和值的时候报Could not resolve placeholder的解决方案。

PropertySourcePlaceholderConfig.java

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

/**
 * 配置防止 @Value 中的值未配置时报错导致无法启动服务
 *
 * @author Jerry(姜源)
 * @since 2022/6/15 16:05
 */
@Configuration
public class PropertySourcePlaceholderConfig {

    @Bean
    public PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        PropertySourcesPlaceholderConfigurer configurer = new PropertySourcesPlaceholderConfigurer();
        configurer.setIgnoreUnresolvablePlaceholders(true);
        return configurer;
    }

}
```

