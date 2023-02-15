---
title: 02-MySQL语句执行过程和索引原理
date: 2022-07-02 08:18:01
tags:
- 性能优化
- MySQL
categories: 
- 16_性能优化
- 02_数据库性能优化
---

![image-20200812132737977](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200812132738.png)

### 1.一条SQL查询语句是如何执行的？

![image-20220702082146121](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220702082147.png)

> 注意事项: `mysql -h$ip -P$port -u$user -p`  #密码直接写在p后面，会导致密码泄露；

**查询流程：①建立连接-->②查询缓存-->③分析器-->④优化器-->⑤执行器-->⑥引擎接口；**

1）一个用户成功建立连接后，即使你用管理员账号对这个用户的权限做了修改， 也不会影响已经存在连接的权限。修改完成后，只有再新建的连接才会使用新的权限设置。

```mysql
show processlist
```

![image-20220702082214015](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220702082215.png)

   

​     长连接（ `show global variables like 'wait_timeout';` ），参数 wait_timeout 控制的，默认值是 8 小时，内存由连接对象管理，容易出现OOM，优化方案：定期断开长连接、5.7以上版本执行mysql_reset_connection重新初始化连接资源；

2）查询缓存：mysql会对查询语句进行Hash计算后，hash值存放在一个hash链表中，Query的结果集存放到cache中，使用内存池技术自己管理， 参数query_cache_type控制 。

缺点： 

1）hash计算和查找所带来的开销 

2）Cache的失效问题  

3） 内存资源的过度消耗 

4） 内存碎片多， Cache频繁清理内存 ；

5）数据有变更会清空缓存，同时影响写入性能；

6）命中缓存的开销；

显示调用（特殊场景，比如基础数据）： 

```mysql
select SQL_CACHE * from s_user where ID=10；  
```

3）分析器：词法分析（对词进行分析，如关键字、别名等）、语法分析（对整体语句进行分析，如elect * from tableName会报错）， 要学习Mysql的分析器，则需要具备lex和yacc的相关知识。

4）优化器： 调整join语句中表的连接顺序、去除无效的条件、当表中有多个索引时决定选择哪一个等。  

假如有5张表关联查询，每张表有5个索引，那么共有 5! * 5! = 14400种可能的执行计划，如果优化器都逐个分析，很有可能分析所耗费的时间都比sql语句执行的时间长，这样的分析就失去了它的价值。  

 可以使用force index('index_a')强制优化器执行对应语句的索引，有时候复杂的sql，在某个时刻不会寻找最优的索引（慎用）

https://blog.csdn.net/taoerchun/article/details/121376459

5）执行器：全表扫描则打开表遍历每一条数据是否符合条件，索引则是取引擎中已经定义好的接口“取满足条件的第一行”、“满足条件的下一行”；



### 2.一条SQL更新语句是如何执行的？

**更新流程（两阶段提交）：**

①执行器找引擎返回结果（查询的流程）--> 

②执行器覆盖新值调用引擎接口写入这行新数据 -->

③引擎更新到内存同时作记录到redo log（ prepare）告知执行器 -->

④执行器生成binlog并写入磁盘 -->

⑤执行器调用引擎的提交事务接口并更新redo log（ prepare）

1）与查询语句的流程是一致的，但更新流程涉及redo log（重做日志）和 binlog（归档日志）。

2）MySQL 自带的引擎是 MyISAM，但是 MyISAM 没有 crash-safe 的能力，binlog 日志只能用于归档。

   InnoDB 引擎特有的日志：redo log（重做日志）， “粉板” +账本 crash-safe，InnoDB 的 redo log 是固定大小的，比如可以配置为一组 4 个文件，每个文件 的大小是 1GB，那么这块“粉板”总共就可以记录 4GB 的操作。

   Server 层的日志：binlog（归档日志）

3）crash与两阶段的疑问：

   1）先写 redo log 后写 binlog，redo log写完crash，使用binlog恢复数据会丢失这条语句； 

   2）先写 binlog 后写redo log，binlog写完之后crash，崩溃恢复以后这个事务无效。

   优化：innodb_flush_log_at_trx_commit = 1表示每次事务的 redo log 都直接持久化到磁盘，可以保证 MySQL 异常重启之后数据不丢失；

​     sync_binlog = 1表示每次事务的 binlog 都持久化到磁盘，这样可以保证 MySQL 异常重启之后 binlog 不丢失。



### **3.事务隔离：我们用到了哪几种？**

在 MySQL 中，事务支持是在引擎层实现的，MySQL 是一个支持多引擎的系统，但并不是所有的引擎都支持事务。比如 MySQL 原生的 MyISAM 引擎就不支持事务，这也是 MyISAM 被 `InnoDB` 取代的重要原因之一。

ACID（Atomicity、Consistency、Isolation、Durability，即原 子性、一致性、隔离性、持久性）

隔离级别：读未提交（read uncommitted）、读提交（read committed）、可重复读（repeatable read）和串行化 （serializable ）。

读未提交是指，一个事务还没提交时，它做的变更就能被别的事务看到。

读提交是指，一个事务提交之后，它做的变更才会被其他事务看到。

可重复读是指，一个事务执行过程中看到的数据，总是跟这个事务在启动时看到的数据是 一致的。当然在可重复读隔离级别下，未提交变更对其他事务也是不可见的。

串行化，顾名思义是对于同一行记录，“写”会加“写锁”，“读”会加“读锁”。当出 现读写锁冲突的时候，后访问的事务必须等前一个事务执行完成，才能继续执行。

![image-20220702083307291](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220702083308.png)

若隔离级别是“读未提交”， V1 = 2，V2 = 2，V3 = 2，遵循事务不提交也可以看到。

若隔离级别是“读提交”，V1 = 1，V2 = 2，V3 = 2，遵循事务提交后就被看到。

若隔离级别是“可重复读”，V1 = 1，V2 = 1，V3 = 2，遵循事务在执行期间看到的数据前后必须是一致的。

若隔离级别是“串行化”，V1 = 1，V2 = 1，V3 = 2，遵循事务的提交顺序，事务B执行“将 1 改成 2”的时候会被锁住。直到事务A提交后，事务B才可以继续执行。



### **4.深入浅出索引（上）**

#### 1、索引类型的划分

 1）功能划分：主键索引、唯一性索引、普通索引、全文索引

 2）物理划分：聚集索引（主键索引 -> 唯一索引 -> 隐藏索引）、非聚集索引（二级索引、辅助索引，B+Tree + 回表）

​       **回表**： InnoDB中的索引：主键索引和普通索引，`普通索引需要先搜索 k 索引树，得到 ID 的值为 500，再到 ID 索引树搜索一次。`这个过程称为回表。  

#### 2、索引的存储

  按照主键（非必须）来排序存储数据（索引存储模型是树），B+数索引插入数据时会产生页分裂，当前数据页会满，性能受到影响，与之对应的是页合并。

#####  1）Innodb 引擎和 Myisam 引擎的实现

​    MyISAM 虽然数据查找性能极佳，但是不支持事务处理。Innodb 最大的特色就是支持了 ACID 兼容的事务功能，而且他支持行级锁。Mysql 建立表的时候就可以指定引擎，比如下面的例子，就是分别指定了 Myisam 和 Innodb 作为 user 表和 user2 表的数据引擎。  

![image-20220702083415239](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220702083416.png)

  从生成的文件看来，这两个引擎底层数据和索引的组织方式并不一样，MyISAM 引擎把数据和索引分开了，一人一个文件，这叫做非聚集索引方式；Innodb 引擎把数据和索引放在同一个文件里了，这叫做聚集索引方式。  

![image-20220702083431637](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220702083432.png)

  Innodb 创建表后生成的文件有：

1. frm:创建表的语句
2. idb:表里面的数据+索引文件

Myisam 创建表后生成的文件有

1. frm:创建表的语句
2. MYD:表里面的数据文件（myisam data）
3. MYI:表里面的索引文件（myisam index）

#####    2）MyISAM 引擎的底层实现（非聚集索引方式）  

 MyISAM 用的是非聚集索引方式，即数据和索引落在不同的两个文件上。MyISAM 在建表时以主键作为 KEY 来建立主索引 B+树，树的叶子节点存的是对应数据的物理地址。我们拿到这个物理地址后，就可以到 MyISAM 数据文件中直接定位到具体的数据记录了。  

![image-20220702083517265](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220702083521.png)

 当我们为某个字段添加索引时，我们同样会生成对应字段的索引树，该字段的索引树的叶子节点同样是记录了对应数据的物理地址，然后也是拿着这个物理地址去数据文件里定位到具体的数据记录。  

#####  3）Innodb 引擎的底层实现（聚集索引方式）  

 InnoDB 是聚集索引方式，因此数据和索引都存储在同一个文件里。首先 InnoDB 会根据主键 ID 作为 KEY 建立索引 B+树，如左下图所示，而 B+树的叶子节点存储的是主键 ID 对应的数据，比如在执行 select * from user_info where id=15 这个语句时，InnoDB 就会查询这颗主键 ID 索引 B+树，找到对应的 user_name='Bob'。

这是建表的时候 InnoDB 就会自动建立好主键 ID 索引树，这也是为什么 Mysql 在建表时要求必须指定主键的原因。当我们为表里某个字段加索引时 InnoDB 会怎么建立索引树呢？比如我们要给 user_name 这个字段加索引，那么 InnoDB 就会建立 user_name 索引 B+树，节点里存的是 user_name 这个 KEY，叶子节点存储的数据的是主键 KEY。注意，叶子存储的是主键 KEY！拿到主键 KEY 后，InnoDB 才会去主键索引树里根据刚在 user_name 索引树找到的主键 KEY 查找到对应的数据。

 ![image-20220702083548791](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220702083549.png)

 为什么 InnoDB 只在主键索引树的叶子节点存储了具体数据，但是其他索引树却不存具体数据呢，而要多此一举先找到主键，再在主键索引树找到对应的数据呢?  

 InnoDB 需要节省存储空间。一个表里可能有很多个索引，InnoDB 都会给每个加了索引的字段生成索引树，如果每个字段的索引树都存储了具体数据，那么这个表的索引数据文件就变得非常巨大（数据极度冗余了）。  



#### 3、索引的常见模型

 常归数据结构的选择：数组、链表、哈希、树、队列、堆、 栈、图， 其中最能提高查询效率的就是hash表和树。

在mysql中只有memory存储引擎支持hash表。而innodb和myisam都是使用的B+树。

###### 1） 哈希  

​    哈希的思路很简单，把值放在数组里，用一个哈希函数把 key 换算成一个确定的位置，然后把 value 放在数组的这个位置。不可避免地，多个 key 值经过哈希函数的换算，会出现同一个值的情况。处理这种情况的 一种方法是，拉出一个链表。哈希表这种结构适用于只有等值查询的场景。（主键）

![image-20220702083745588](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220702083746.png)

###### 2） 有序数组  

有序索引用二分法就可以快速得到，这个时间复杂度是 O(log(N))。 如果仅仅看查询效率，有序数组就是最好的数据结构了。但是，在需要更新数据的时候就麻 烦了，你往中间插入一个记录就必须得挪动后面所有的记录，成本太高。有序数组索引只适用于静态存储引擎。（静态基础数据）

![image-20220702083758039](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220702083758.png)



###### 3）二叉查找树（BST）

特点是：每个节点的左儿子小于父节点，父节点又小于右儿子。这个时间复杂度是 O(log(N))。树可以有二叉，也可以有多叉。多叉树就是每个节点有多个儿子，儿子之间的大小保证从左 到右递增。二叉树是搜索效率最高的，但是实际上大多数的数据库存储却并不使用二叉树。 其原因是，索引不止存在内存中，还要写到磁盘上。

![image-20220702083810012](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220702083811.png)

###### 4）AVL数、红黑树

​      二叉查找树存在不平衡问题，因此学者提出通过树节点的自动旋转和调整，让二叉树始终保持基本平衡的状态，就能保持二叉查找树的最佳查找性能了。基于这种思路的自调整平衡状态的二叉树有 AVL 树和红黑树。 

​     AVL树  ：绝对平衡的二叉树，因此他在调整二叉树的形态上消耗的性能会更多。  

![image-20220702083822836](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220702083823.png)

​    红黑树： 会自动调整树形态的树结构，比如当二叉树处于一个不平衡状态时，红黑树就会自动左旋右旋节点以及节点变色，调整树的形态，使其保持基本的平衡状态（时间复杂度为 O（logn）），也就保证了查找效率不会明显减低。  

![image-20220702083839135](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220702083840.png)



###### 5）B树

​     每个节点可以存储 多个key ， 尽可能少的磁盘 IO， 时间复杂度：B 树的查找性能等于 O（h*logn），其中 h 为树高，n 为每个节点关键词的个数；  

![image-20220702083853460](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220702083854.png)

######  6）B+树  

 B 树和 B+树有什么不同呢？

第一，B 树一个节点里存的是数据，而 B+树存储的是索引（地址），所以 B 树里一个节点存不了很多个数据，但是 B+树一个节点能存很多索引，B+树叶子节点存所有的数据。第二，B+树的叶子节点是数据阶段用了一个链表串联起来，便于范围查找。  

![image-20220702083908786](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220702083909.png)

 通过 B 树和 B+树的对比我们看出，B+树节点存储的是索引，在单个节点存储容量有限的情况下，单节点也能存储大量索引，使得整个 B+树高度降低，减少了磁盘 IO。其次，B+树的叶子节点是真正数据存储的地方，叶子节点用了链表连接起来，这个链表本身就是有序的，在数据范围查找时，更具备效率。因此 Mysql 的索引用的就是 B+树，B+树在查找效率、范围查找中都有着非常不错的性能。  



### **5.深入浅出索引（下）**

![image-20220702083921760](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220702083922.png)

```mysql
select * from T where k between 3 and 5；#执行过程
```

1. 在 k 索引树上找到 k=3 的记录，取得 ID = 300；

2. 再到 ID 索引树查到 ID=300 对应的 R3；

3. 在 k 索引树取下一个值 k=5，取得 ID=500；

4. 再回到 ID 索引树查到 ID=500 对应的 R4；(`回表`)

5. 在 k 索引树取下一个值 k=6，不满足条件，循环结束。

这个查询过程读了 k 索引树的 3 条记录（步骤 1、3 和 5），回表了两次（步骤 2 和 4）。



#### 1、覆盖索引

```
select ID from T where k between 3 and 5;
```

`ID` 的值已经在 k 索引树上了，因此可以直接提供查询结果，不需要回表。



#### 2、最左前缀原则（ 联合索引）

![image-20220702084027534](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220702084028.png)



```mysql
select * from tuser where name like '张 %' 
```

联合索引用（name，age）,可以通过name、name+age进行快速检索，单独的age是无法使用 (name，age) 这个联合索引的，这时候需要同时维护age索引。



#### 3、索引下推（ 联合索引）

 MySQL 5.6 引入的索引下推优化（index condition pushdown)， 可以在索引遍历过 程中，对索引中包含的字段先做判断，直接过滤掉不满足条件的记录，减少回表次数。   

```mysql
select * from tuser where name like '张 %' and age=10;
```

联合索引用（name，age）,不满足name的数据直接跳过，不产生回表查询；

![image-20220702084215034](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220702084216.png)



#### 4、隐藏索引

 隐藏索引的特性对性能调整非常有用。在8.0中，索引可以被隐藏和显示。当索引被隐藏时，它不会被查询优化器使用。

可以隐藏一个索引，然后观察它对数据库的影响。若数据库性能下降，则说明该索引有用，因此可恢复显示；若数据库性能无变化，则说明该索引多余，可删除。

```mysql
ALTER TABLE t ALTER INDEX i INVISIBLE;
ALTER TABLE t ALTER INDEX i VISIBLE;
```



### 6.索引实战：

#### 1、以下索引创建的对吗？是否有多余的索引？

```mysql
CREATE TABLE `geek` (
   `a` int(11) NOT NULL, 
   `b` int(11) NOT NULL, 
   `c` int(11) NOT NULL, 
   `d` int(11) NOT NULL, 
   PRIMARY KEY (`a`,`b`), KEY `c` (`c`), KEY `ca` (`c`,`a`), KEY `cb` (`c`,`b`) 
) ENGINE=InnoDB;
```

```mysql
select * from geek where c=N order by a limit 1;
select * from geek where c=N order by b limit 1;
```

1）主键 a，b 的聚簇索引组织顺序相当于 order by a,b ，也就是先按 a 排序，再按 b 排序；

2）索引 c 的组织是先按 c 排序，同时记录主键，组织顺序：c-a-b

3）索引 ca 的组织是先按 c 排序，再按 a 排序，同时记录主键，组织顺序：c-a-主键部分b

4）索引 cb 的组织是先按 c 排序，再按 b 排序，同时记录主键，组织顺序：c-b-主键部分a



#### 2、深度分页优化

```mysql
select * from employees limit 10000,10;
```

 表示从表 employees 中取出从 10001 行开始的 10 行记录。看似只查询了 10 条记录，实际这条 SQL 是先读取 10010条记录，然后抛弃前 10000 条记录，然后读到后面 10 条想要的数据。因此要查询一张大表比较靠后的数据，执行效率是非常低的。这是典型的深度分页问题。  

1）查询条件范围优化：

```mysql
select * from employees where id > 90000 limit 5;
```

前提：主键自增且连续、结果是按照主键排序的，比较适合日志类的查询，因为他们数据量不会变且主键连续；

2）使用索引覆盖优化（不回表）：

```mysql
select * from employees ORDER BY name limit 90000,5;
```

```mysql
select * from employees e inner join (select id from employees order by name limit 90000,5) ed on e.id = ed.id;
```



#### 3、jion关联优化

​     inner join 时，排在前面的表并不一定就是驱动表，由优化器选择；

​     left join时，左表是驱动表，右表是被驱动表；

​     right join时，右表是驱动表，左表是被驱动表；

#### 4、**in和exsits优化**

```mysql
select * from A where id in ( select id from B) ;  # in是in后的表先执行（适用于B表小于A表）
```

```mysql
select * from A where id exsits ( select id from B);  # exists是exists前面的表先执行（适用于A表小于B表）  
```

#### 5、count查询优化

1、字段有索引： `count(*)≈count(1)>count(字段)>count(主键 id)`

字段有索引，count(字段)统计走二级索引，二级索引存储数据比主键索引少，所以count(字段)>count(主键 id)

2、字段无索引: `count(*)≈count(1)>count(主键 id)>count(字段)`

字段没有索引count(字段)统计走不了索引，count(主键 id)还可以走主键索引，所以count(主键 id)>count(字段)

count(*) 是例外，mysql并不会把全部字段取出来，而是专门做了优化(5.7版本)，不取值按行累加，效率高；

count(1) 跟 count(字段) 执行过程类似，不过count(1)不需要取出字段统计，就用常量1做统计，count(字段)还需要取出字段，所以理论上count(1)比count(字段)会快一点。  

为什么对于count(id)，mysql最终选择辅助索引而不是主键聚集索引？因为二级索引相对主键索引存储数据更少，检索性能应该更高，mysql内部做了点优化(应该是在5.7版本才优化)。



### 7.全局锁和表锁 ：给表加个字段怎么有这么多阻碍？**

锁的范围：全局锁、表级锁和行锁；

全局锁：

1、全局锁就是对整个数据库实例加锁， Flush tables with read lock (FTWRL)，使用场景是做全库逻辑备份，也就是把整库每个表都 select 出来存成文本。

   不加锁的话，备份系统备份的得到的库不是一个逻辑时间点（买书 + 付款），拿不到一致性视图； 

  一致性可通过可重复读隔离级别保证，官方自带的逻辑备份工具是 mysqldump， 使用参数–single-transaction保证备份一致性。

2、为什么有FTWRL，支持使用类似mysqldump工具不就好了？

   MyISAM引擎不支持事务，参数–single-transaction只能用于支持有事务的引擎。

3、使用set global readonly=true替代FTWRL？

   1）readonly参数被用作了其他逻辑，比如主库与从库； 

   2）FTWRL 命令之后由于客户端发生异常断开， 那么 MySQL 会自动释放这个全局锁，readonly不会释放；

表级锁：表级别的锁有两种：一种是表锁，一种是元数据锁（meta data lock， MDL)。 

1、锁表方式：

   第一种：语法是lock tables … read/write，可以用 unlock tables 主动 释放锁，也可以在客户端断开的时候自动释放。

   第二种：MDL（metadata lock)，当要对表做结构变更操作的时候，加 MDL 写锁。读锁之间不互斥，读写锁之间、写锁之间是互斥的。

2、给表加字段，会生成MDL写锁，阻塞，后面session的select MDL读锁无法获取；

3、锁表怎么处理、避免？你肯定知道，给一个表加字段，或者修改字段，或者加索引，需要扫描全表的数据。

  处理：找到information_schema 库的 innodb_trx 表长事务，kill掉（频繁的热点表会不生效，因为请求太多）；

  避免：比较理想的机制是，在 alter table 语句里面设定等待时间，如果在这个指定的等待时间里面能够拿到 MDL 写锁最好，拿不到 也不要阻塞后面的业务语句，先放弃。

​       ALTER TABLE tbl_name NOWAIT add column ...

​       ALTER TABLE tbl_name WAIT N add column ...



### 8.表分区

  range分区：按id范围，100，100-200，200-**

  list分区：按值分区，如：男、女

  hash分区：只支持数字分区

  key分区：在hash分区的基础上支持，支持表达式

  column分区：

  alter table user add partition(partition p3 values less than(4000));   range分区的使用