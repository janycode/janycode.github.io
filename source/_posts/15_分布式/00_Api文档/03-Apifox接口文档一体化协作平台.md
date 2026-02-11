---
title: 03-Apifox接口文档一体化协作平台
date: 2022-11-7 14:49:52
tags:
- API
- YApi
categories: 
- 15_分布式
- 00_Api文档
---



# 一、接口文档选型

默认的原生的 swagger 界面和交互并不是很便捷，增加了前后端沟通和协作的时间成本。

因此选择成型的免费、功能丰富、没有太多限制的工具 `ApiFox` ([很多大厂都在用](https://apifox.com/))，强烈推荐！

Apifox 官方网站地址：[Apifox - API 文档、调试、Mock、测试一体化协作平台。](https://apifox.com/)

Apifox 官方帮助文档：[Apifox 快速入门 | Apifox 帮助文档](https://apifox.com/help/)

● 推荐官网首页直接下载客户端版（**免费**）使用即可。

![image-20241107143647612](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241107143648.png)



# 二、代码改动

### 2.0 pom依赖新增

```xml
<dependency>
    <groupId>io.swagger</groupId>
    <artifactId>swagger-annotations</artifactId>
    <version>1.5.22</version>
</dependency>
```



### 2.1 Swagger 注解补全

以下为示例。

#### @Api - 接口类

![image-20241107143958043](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241107143959.png)

#### @ApiOperation - 接口方法

![image-20241107144039747](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241107144040.png)

#### @ApiParam - 方法参数

![image-20241107144052019](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241107144052.png)

#### @ApiModel - 实体参数

![image-20241107144105073](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241107144105.png)

#### @ApiModelProperty - 实体参数字段

![image-20241107144121120](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241107144122.png)

### 2.2 Controller 返回值统一

#### 返回List

![image-20241107144140135](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241107144141.png)

#### 返回分页

![image-20241107144153530](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241107144154.png)

#### 返回对象

![image-20241107144211360](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241107144212.png)

#### 返回其他类型

![image-20241107144228313](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241107144229.png)



# 三、Apifox一键导入

### 3.1 新建团队

![image-20241107144242789](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241107144243.png)

### 3.2 新建项目

团队下新建项目。

![image-20241107144300752](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241107144301.png)

### 3.3 导入数据

![image-20241107144316137](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241107144316.png)

![image-20241107144332764](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241107144333.png)

![image-20241107144349298](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241107144350.png)

![image-20241107144404345](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241107144405.png)

### 3.4 效果使用

#### 入参显示

![image-20241107144419528](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241107144420.png)

#### 出参显示

![image-20241107144432293](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241107144433.png)

#### 自测调用

![image-20241107144527151](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241107144528.png)

# 四、协作流程

### 4.1 分享接口文档

![image-20241107144542766](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241107144544.png)

### 4.2 查看接口文档

![image-20241107144606820](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241107144607.png)

示例链接：

https://apifox.com/apidoc/shared-6bbcd6f0-70f4-4478-bf6b-2a71ca976a22/api-189590149



# 五、其他补充

● 分享链接注意不要外泄

● 分享链接地址中注意禁止选择生产环境请求地址（防止接口盗刷带来的风险）





