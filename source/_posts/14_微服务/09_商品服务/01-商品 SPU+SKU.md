---
title: 01-商品 SPU+SKU
date: 2020-03-02 17:59:44
tags:
- 微服务
- 商品服务
categories: 
- 14_微服务
- 09_商品服务
---

![image-20200815172233120](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815172234.png)



参考资料1：https://www.cnblogs.com/lingyejun/p/9569563.html

参考资料2：https://www.zhihu.com/question/29073730



### 1. SPU+SKU简介

#### 1.1 概念

`SPU` : Standard Product Unit 标准化产品单元（俗称" **款** "）——【商品属性】无关于库存

SPU是商品信息聚合的最小单位，是一组可复用、易检索的标准化信息的**集合**，该集合描述了一个产品的特性。

`SKU` : Stock keeping Unit 库存量单元（俗称" **件** "）——【销售属性】关乎于库存

SKU即库存进出计量的单位（买家购买、商家进货、供应商备货、工厂生产都是依据SKU进行的）。

SKU是**物理上不可分割的最小存货单元。**也就是说一款商品，可以**根据SKU来确定具体的货物存量。**



#### 1.2 关系

> SKU和商品之间的关系：
>
> 1）SKU（或称商品SKU）指的是商品子实体。
>
> 2）商品SPU和商品SKU是包含关系，一个商品SPU包含若干个商品SKU子实体，商品SKU从属于商品SPU。
>
> 3）SKU不是编码，每个SKU包含一个唯一编码，即SKU Code，用于管理。
>
> 4）商品本身也有一个编码，即Product Code，但不作为直接库存管理使用。

![image-20200815172317472](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815172318.png)

![image-20200815172347357](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815172348.png)



### 2. 数据库设计

* **商品类型表**：一级和二级类型

* **属性表**：存储商品属性：比如：颜色、尺码、材质
* **类型属性表**：连接商品类型和商品属性字典表（`中间表`）
* 商品表：商品信息

* **商品SPU属性表**：SPU 属性
* **商品SKU属性表**：SKU 属性、价格、库存（也可以和 商品表 合并为一张表）

#### 2.1 E-R 图

> 目的：可视化梳理表关系 + 一键生成建表SQL脚本。

① 在线工具：https://dbdiagram.io/d （它有其自身的语法，根据其语法创建）

② 本地工具：[PowerDesigner 建模](https://janycode.github.io/2017/10/18/00_%E5%85%88%E5%88%A9%E5%85%B6%E5%99%A8/04_PowerDesigner/01-PDM%E6%95%B0%E6%8D%AE%E5%BA%93%E5%BB%BA%E6%A8%A1/)

![image-20200815174136380](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815174137.png)

![image-20200815174208432](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815174209.png)

→ 导出 .sql 的脚本文件。（PowerDesigner 使用 `Ctrl + G` 导出建表SQL脚本）



#### 2.2 建表示例

![image-20200815174520122](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200815174521.png)



#### 2.3 SQL 脚本 demo

数据库 json 字段类型的处理：[MyBatis JSON转换器](https://janycode.github.io/2017/06/19/05_%E6%95%B0%E6%8D%AE%E5%BA%93/02_MyBatis/09-MyBatis%20JSON%E8%BD%AC%E6%8D%A2%E5%99%A8/index.html)

```mysql
CREATE DATABASE db_goodsapi;

USE db_goodsapi;

-- 1、商品类型
 DROP TABLE IF EXISTS t_goodstype;

CREATE TABLE t_goodstype (
  id INT PRIMARY KEY AUTO_INCREMENT,
  NAME VARCHAR (30),
  parentid INT,
  LEVEL INT,
  flag INT
);

INSERT INTO t_goodstype (NAME, parentid, LEVEL, flag)
VALUES
  ('家用电器', - 1, 1, 1),
  ('手机', - 1, 1, 2),
  ('运营商', - 1, 1, 2),
  ('数码', - 1, 1, 2),
  ('电脑', - 1, 1, 1),
  ('办公', - 1, 1, 1),
  ('电视', 1, 2, 101),
  ('冰箱', 1, 2, 101),
  ('空调', 1, 2, 101),
  ('洗衣机', 1, 2, 101),
  ('手机通讯', 2, 2, 1),
  ('手机配件', 2, 2, 201),
  ('摄影', 4, 2, 201),
  ('数码配件', 4, 2, 201);

UPDATE
  t_goodstype
SET
  LEVEL = 2
WHERE id = 11;

SELECT
  *
FROM
  t_goodstype;

-- 2、商品属性字段
 DROP TABLE IF EXISTS t_attribute;

CREATE TABLE t_attribute (
  id INT PRIMARY KEY AUTO_INCREMENT,
  NAME VARCHAR (30)
);

INSERT INTO t_attribute (NAME)
VALUES
  ('能效等级'),
  ('商品毛重'),
  ('商品产地'),
  ('电视类型'),
  ('电源功率（w）'),
  ('待机功率（w）'),
  ('工作电压（v）'),
  ('运行内存');

INSERT INTO t_attribute (NAME)
VALUES
  ('color'),
  ('size');

-- 3、商品类型属性表
 DROP TABLE IF EXISTS t_typeattribute;

CREATE TABLE t_typeattribute (
  id INT PRIMARY KEY AUTO_INCREMENT,
  gtid INT,
  aid INT,
  flag INT COMMENT '标记位：值是否为类型 1否 2是'
);

INSERT INTO t_typeattribute (gtid, aid)
VALUES
  (7, 1),
  (7, 2),
  (7, 3),
  (7, 4),
  (7, 5),
  (7, 6),
  (7, 7),
  (7, 8);

-- 4、商品表
 DROP TABLE IF EXISTS t_goods;

CREATE TABLE t_goods (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR (50),
  subtitle VARCHAR (100),
  gtid INT,
  flag INT COMMENT '1 下架 2上架 ',
  ctime DATETIME
);

INSERT INTO t_goods (title, subtitle, gtid, flag, ctime)
VALUES
  (
    '长虹 55D4P 超薄无边全面屏 4K超高清 手机投屏 智能网络 教育电视 平板液晶电视',
    '【暑期欢乐购】热销TOP榜，数量有限，超薄无边全面屏，4K超清教育电视',
    7,
    2,
    NOW()
  );

-- 5、商品属性表
 DROP TABLE IF EXISTS t_goodsattribute;

CREATE TABLE t_goodsattribute (
  id INT PRIMARY KEY AUTO_INCREMENT,
  gid INT,
  aid INT,
  val VARCHAR (50),
  flag INT COMMENT '标记位 ：1 SPU属性 2：SKU属性'
);

ALTER TABLE t_goodsattribute
  ADD flag INT DEFAULT 1;

INSERT INTO t_goodsattribute (gid, aid, val)
VALUES
  (1, 1, '二级能效'),
  (1, 2, '17.0kg'),
  (1, 3, '中国大陆'),
  (
    1,
    4,
    '超薄电视；4K超清电视；LED电视'
  );

INSERT INTO t_goodsattribute (gid, aid, val, flag)
VALUES
  (1, 9, '黑色', 2),
  (1, 9, '白色', 2),
  (1, 9, '银色', 2),
  (1, 9, '红色', 2),
  (1, 10, 55, 2),
  (1, 9, 45, 2),
  (1, 9, 60, 2),
  (1, 9, 65, 2);

SELECT
  *
FROM
  t_goodsattribute;

-- 6、商品SKU属性
 DROP TABLE IF EXISTS t_goodssku;

CREATE TABLE t_goodssku (
  id INT PRIMARY KEY AUTO_INCREMENT,
  gid INT,
  skuid json COMMENT 'JSON数组：t_goodsattribute表的id [6,9]',
  sku json COMMENT '{"color":"黄色","size":2XL}',
  repertory INT,
  price INT COMMENT '单位 分',
  saleprice INT COMMENT '销售价格',
  minrepertory INT COMMENT '预警库存',
  flag INT
);

INSERT INTO t_goodssku (
  gid,
  skuid,
  sku,
  repertory,
  price,
  saleprice,
  minrepertory,
  flag
)
VALUES
  (
    1,
    '[6,9]',
    '{"size":55,"color":"白色"}',
    100,
    130000,
    99900,
    10,
    1
  ),
  (
    1,
    '[5,9]',
    '{"size":55,"color":"黑色"}',
    100,
    130000,
    94900,
    10,
    1
  ),
  (
    1,
    '[5,12]',
    '{"size":65,"color":"黑色"}',
    100,
    230000,
    194900,
    10,
    1
  );
```



### 3. 商品查询 Demo

* 实体类

```java
@Data
public class GoodsSkuDto {
    private Integer id;
    private JsonObject sku;
    private double price;
    private double saleprice;
    private int repertory;
}

@Data
public class GoodsSpuDto {
    private Integer id;
    private Integer aid;
    private String aname;
    private String val;
}

@Data
public class GoodsDetailDto {
    private Integer id;
    private String title;
    private String subtitle;
    private Integer flag;
    private List<GoodsSpuDto> spus;
    private List<GoodsSkuDto> skus;
}
```

* 业务层

```java
@Service
public class GoodsServiceImpl implements GoodsService {
    @Autowired
    private GoodsDao dao;

    @Override
    public R detail(int gid) {
        GoodsDetailDto detailDto=new GoodsDetailDto();
        //查询商品
        Goods goods=dao.selectById(gid);
        detailDto.setFlag(goods.getFlag());
        detailDto.setSubtitle(goods.getSubtitle());
        detailDto.setTitle(goods.getTitle());
        //查询商品spu
        detailDto.setSpus(dao.selectSpu(gid));
        //查询商品sku
        detailDto.setSkus(dao.selectSku(gid));
        return R.ok(detailDto);
    }
}
```

* Mapper.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.demo.open.server.dao.GoodsDao">
    <select id="selectById" resultType="com.demo.open.server.entity.Goods">
        select g.*
        from t_goods g
        where g.id = #{id}
        limit 1
    </select>

    <select id="selectSpu" resultType="com.demo.open.common.dto.GoodsSpuDto">
        select ga.*, a.name aname
        from t_goodsattribute ga
                     inner join t_attribute a on a.id = ga.aid
        where ga.gid = #{gid}
        order by ga.id asc
    </select>

    <select id="selectSku" resultType="com.demo.open.common.dto.GoodsSkuDto">
        select *
        from t_goodssku
        where gid = #{gid}
        order by price asc
    </select>
</mapper>
```







