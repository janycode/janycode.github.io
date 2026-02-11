---
title: 16-MySQL解析json字符串
date: 2021-09-16 09:37:12
tags:
- MySQL
- JSON
categories: 
- 05_数据库
- 01_MySQL
---

![image-20200812132737977](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200812132738.png)

参考资料: [https://dev.mysql.com/doc/refman/8.0/en/json.html](https://dev.mysql.com/doc/refman/8.0/en/json.html)



MySQL 5.7版本以后支持json格式的字段类型定义、存储和使用，最近做BI开发，开发把所需数据用JSON的形式存储在字段中，本次记录下MySQL解析JSON。



一般来说，主要是提取json字段的值，所以update就不写了，提取select json使用的参数是：

 JSON_EXTRACT


JSON_EXTRACT参数使用方式是：`JSON_EXTRACT（json串，'$.key'）`，select后得到的是key值对应的value；

那么，如何解释$

`$`,指得是json串，这里的json串，是`$`之前的变量；例如：

`JSON_EXTRACT('{1:0,2:0}','$.key')` 这里`$.key`的`$`指的是他前面的{1:0,2:0}

`JSON_EXTRACT(JSON_EXTRACT('{1:0,2:0}','$.1')，'$.key')`

这里`$.key`的`$`指的是他前面的`JSON_EXTRACT('{1:0,2:0}','$.1'),`

如果有多层嵌套的json，JSON_EXTRACT提取出来的子层级结果也是json属性的列表，JSON_EXTRACT可以层层套用；

MySQL EXTRACT解析出的json结果是一个list集合，官方的说法是array，由于操作方式和python的list很相似，同样就带有了list的操作方式，就如其他语言一样，list可以指定key值获得对应的value，可以循环，可以获得length，可以遍历；

MySQL中json解析出的list一样的有相关属性和操作；

由此，再回过头看 `JSON_EXTRACT('{1:0,2:0}','$.key')`

这里的意义是：解析json串{1：0，2：0}，得到list = [1:0,2:0],获取list中的key值对应的value

所以`select JSON_EXTRACT('{1:0,2:0}','$.1')`得到的结果是[0]

为什么是[0]，而不是0

因为MySQL解析list的key是list，得到的结果value也会是list属性，

 

到这里又得到新的灵感，既然解析的key是list属性，那么能不能指定key的index？

当然可以，比如有个这样的json：

{a:[1:0,2:0],b:[1:0,2:0]}

那么解析`select JSON_EXTRACT({a:[1:0,2:0],b:[1:0,2:0]}，'$[0]')` 会得到[a:[1:0,2:0]]

由此，可以反推 json 的 index值 `select JSON_EXTRACT(json,'$[index]')`

而`select JSON_EXTRACT(json,'$[index].key')`则是得到index下标的list中寻找对应的key值

值得注意的是这里的key只会在list同层中寻找，如果`$[index]`得到的list还包含多层json或者list，`$[index].key`并不会得到其他层级的value

如果不确定key在哪个index，那该怎么办呢？

sql中一样存在遍历，这个符号就是 * 

`$[*]` 就是遍历list。

`$[*].key` 则是遍历list中所有的key值并以list的形式反馈回value；当然这里的遍历也是同层级的遍历，如果有子层级，并不会遍历子层；但这并不妨碍大多数数据库解析json的使用；


所以，如果MySQL要对json进行数据处理，不用存过的形式下，建议：

1、明确数据结构，明确所需数据所在层级

2、明确层级数据定义，不要有的有，有的没有

 

如果出现json存储乱存的，值不确定的，层级有变化的，还要从json中提出数据让数据库出报表，作为一名DBA，我肯定会直接踢回去的，本来数据库就应该存定义好的最小维度，这种破玩意就是程序架构脑袋有si才会做出这样的定义，一点也不考虑数据后期维护，如果定义混乱，json_set也不一定能很好的更新维护值。今天接到一个sb的需求，记一记吐槽一下，以后这种需求表结构定义一定要通通打回去。

 

最后，sql范例:

```sql
SELECT
	cp.contents,
	replace(replace(replace( JSON_EXTRACT ( JSON_EXTRACT ( cp.contents, "$.comIds" ), '$[*].groupId' ),'"',''),'[',''),']','') ,
	replace(replace(replace( JSON_EXTRACT ( JSON_EXTRACT ( cp.contents, "$.comIds" ), '$[*].groupName' ),'"',''),'[',''),']','') ,
replace(replace(replace(JSON_EXTRACT(JSON_EXTRACT ( JSON_EXTRACT ( cp.contents, "$.comIds" ),"$[*].comIds"),'$[*][*].comid'),'"',''),'[',''),']','') 
FROM
	db_giftcard.t_coupon_assets ca
	LEFT JOIN db_giftcard.t_coupon_product cp ON ca.coupProdId = cp.id
```


所以，小结下，要层层遍历，用`$[*][*]`



数据字段的值示例：
```sql
[{"lproductId":"aaa01","lproductName":"AAA0元商品"},{"lproductId":"bbb01","lproductName":"BBB0元商品"}]
```

解析该字段：
```sql
TRIM(BOTH '"' FROM JSON_EXTRACT(a.lproductMaps, '$[*].lproductName'))
```

可以在 SELECT 或 WHERE 中使用：
```sql
...
# eg: ["AAA0元商品", "BBB0元商品"] LIKE '%A%'
AND TRIM(BOTH '"' FROM JSON_EXTRACT(a.lproductMaps, '$[*].lproductName')) LIKE concat('%', 'A', '%')
...
```