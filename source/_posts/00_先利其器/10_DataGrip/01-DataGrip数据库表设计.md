---
title: 01-DataGrip数据库表设计
date: 2017-10-18 21:13:45
tags: 
- UML
- 类图
- 设计
categories:
- 00_先利其器
- 10_DataGrip
---



以**用户表（user）** 为例，走完从`连接数据库`→`表结构设计`→`索引优化`→`生成ER图`→`导出脚本`的全流程，所有步骤均为工作中标准操作，可直接复用。

## 一、前期准备

### 1. 连接目标数据库

1. 打开 DataGrip，点击右侧 **Database** 面板 → 左上角 **+** → **Data Source** → **MySQL**
2. 填写连接信息：
   1. Host：数据库地址（如 [127.0.0.1](127.0.0.1)）
   2. Port：端口（默认 3306）
   3. User：用户名（如 root）
   4. Password：密码
   5. Database：目标数据库名（如 `wms`，提前在MySQL中创建好）
3. 点击 **Test Connection**，提示 `Connection successful` 后点击 **OK**

### 2. 统一设计规范

提前约定以下规范，避免后续返工：

- 表名：小写+下划线，前缀统一（如 `sys_user`、`asn_order`），禁止中文
- 字段名：小写+下划线，见名知意（如 `user_name`、`create_time`）
- 主键：统一用 `id`，类型 `BIGINT`，自增
- 时间字段：统一用 `DATETIME`，禁止用 `TIMESTAMP`（有2038年问题）
- 字符串：用 `VARCHAR`，长度按需设置（如姓名 `VARCHAR(20)`，手机号 `VARCHAR(11)`）
- 状态字段：用 `TINYINT`（0=禁用，1=启用），禁止用字符串存状态
- 所有表和字段必须加中文注释

## 二、eg: 设计用户表（sys_user）

### 步骤1：新建表

1. 在 Database 面板中，展开目标数据库（如 `jerry_test`）
2. 右键点击 **Tables** → **New** → **Table**
   ![image-20260407214942336](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260407214943788.png)
3. 在弹出的窗口中，填写表基本信息：
   1. Name名称：`sys_user`（表名，按规范命名）
   2. Comment注释：`系统用户表`（必填，中文注释）
   3. Engine引擎：默认 `InnoDB`（必须，支持事务和外键）
   4. Collation排序规则：`utf8mb4_general_ci`（默认排序规则）
   5. Charset字符集：*utf8mb4*（支持emoji和所有中文 - `无需填写`）

![image-20260407215450859](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260407215451896.png)

### 步骤2：添加10+个核心字段

点击 **Columns** 标签页，点击 **+** 逐个添加字段，按以下表格填写：

| 字段名      | 类型     | 长度 | 主键 | 自增 | 非空 | 默认值                                        | 注释                       |
| :---------- | :------- | :--- | :--- | :--- | :--- | :-------------------------------------------- | :------------------------- |
| id          | BIGINT   | -    | ✅    | ✅    | ✅    | -                                             | 用户ID（主键）             |
| user_name   | VARCHAR  | 20   | ❌    | ❌    | ✅    | -                                             | 用户名（登录用，唯一）     |
| password    | VARCHAR  | 100  | ❌    | ❌    | ✅    | -                                             | 密码（加密存储）           |
| phone       | VARCHAR  | 11   | ❌    | ❌    | ✅    | -                                             | 手机号（唯一）             |
| email       | VARCHAR  | 50   | ❌    | ❌    | ❌    | NULL                                          | 邮箱                       |
| nick_name   | VARCHAR  | 20   | ❌    | ❌    | ❌    | NULL                                          | 昵称                       |
| avatar      | VARCHAR  | 255  | ❌    | ❌    | ❌    | NULL                                          | 头像URL                    |
| gender      | TINYINT  | 1    | ❌    | ❌    | ❌    | 0                                             | 性别（0=未知，1=男，2=女） |
| birthday    | DATETIME | -    | ❌    | ❌    | ❌    | NULL                                          | 生日                       |
| status      | TINYINT  | 1    | ❌    | ❌    | ✅    | 1                                             | 状态（0=禁用，1=启用）     |
| create_time | DATETIME | -    | ❌    | ❌    | ✅    | CURRENT_TIMESTAMP                             | 创建时间                   |
| update_time | DATETIME | -    | ❌    | ❌    | ✅    | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间（自动更新）       |
| deleted     | TINYINT  | 1    | ❌    | ❌    | ✅    | 0                                             | 逻辑删除（0=未删，1=已删） |

![image-20260407215930380](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260407215931806.png)

![image-20260407221109420](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260407221110497.png)

![image-20260407221253731](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260407221254745.png)

#### 字段设置细节

- 主键：勾选 `Primary Key` 和 `Auto Increment`（自增）
- 非空：必填字段勾选 `Not Null`
- 默认值：在 `Default` 列填写，时间字段的自动更新按上面的写法
- 注释：在 `Comment` 列填写中文注释（必填）

### 步骤3：添加索引

点击 **Indexes** 标签页，添加以下必要索引：

1. **唯一索引**：保证用户名和手机号唯一
   1. 点击 **+** → 选择 `Unique Index`
   2. Name：`uk_user_name`（命名规则：uk_字段名）
   3. Columns：选择 `user_name`
   4. 同理添加 `uk_phone` 索引，字段为 `phone`
2. **普通索引**：加速常用查询
   1. 点击 **+** → 选择 `Index`
   2. Name：`idx_status`
   3. Columns：选择 `status`
   4. 同理添加 `idx_create_time` 索引，字段为 `create_time`

### 步骤4：预览并执行SQL

1. 点击窗口右上角的 **SQL Preview**，查看自动生成的建表SQL：

```SQL
CREATE TABLE `sys_user`(
    `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '用户ID（主键）',
    `user_name`   VARCHAR(20)  NOT NULL COMMENT '用户名（登录用，唯一）',
    `password`    VARCHAR(100) NOT NULL COMMENT '密码（加密存储）',
    `phone`       VARCHAR(11)  NOT NULL COMMENT '手机号（唯一）',
    `email`       VARCHAR(50)           DEFAULT NULL COMMENT '邮箱',
    `nick_name`   VARCHAR(20)           DEFAULT NULL COMMENT '昵称',
    `avatar`      VARCHAR(255)          DEFAULT NULL COMMENT '头像URL',
    `gender`      TINYINT(1)            DEFAULT '0' COMMENT '性别（0=未知，1=男，2=女）',
    `birthday`    DATETIME              DEFAULT NULL COMMENT '生日',
    `status`      TINYINT(1)   NOT NULL DEFAULT '1' COMMENT '状态（0=禁用，1=启用）',
    `create_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间（自动更新）',
    `deleted`     TINYINT(1)   NOT NULL DEFAULT '0' COMMENT '逻辑删除（0=未删，1=已删）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_name` (`user_name`),
    UNIQUE KEY `uk_phone` (`phone`),
    KEY `idx_status` (`status`),
    KEY `idx_create_time` (`create_time`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='系统用户表';
```

2. 检查SQL无误后，点击 **OK**，DataGrip会自动执行建表语句



## 三、进阶操作：表关系设计与可视化

### 1. 设计关联表（如角色表 sys_role）

按照上面的步骤，先创建角色表 `sys_role`，核心字段：

- id（主键，自增）
- role_name（角色名称，唯一）
- role_code（角色编码，唯一）
- status（状态）
- create_time、update_time、deleted

### 2. 添加用户-角色中间表（多对多关系）

用户和角色是多对多关系，需要中间表 `sys_user_role`：

1. 新建表 `sys_user_role`，注释：`用户角色关联表`
2. 添加字段：
   1. id（主键，自增）
   2. user_id（BIGINT，非空，关联 [sys_user.id](sys_user.id)）
   3. role_id（BIGINT，非空，关联 [sys_role.id](sys_role.id)）
   4. create_time（DATETIME，默认当前时间）
3. 添加外键（DataGrip自动识别关系）：
   1. 点击 **Foreign Keys** 标签页 → **+**
   2. Name：`fk_user_role_user_id`
   3. Referenced Table：选择 `sys_user`
   4. Columns：`user_id` → 对应 `id`
   5. 同理添加 `fk_user_role_role_id`，关联 `sys_role.id`
4. 添加联合唯一索引：`uk_user_role`，字段为 `user_id` 和 `role_id`（防止重复关联）

### 3. 生成ER图查看表关系

1. 在 Database 面板中，按住 `Ctrl` 选中 `sys_user`、`sys_role`、`sys_user_role` 三张表
2. 右键 → **Diagrams** → **Show Visualization**
3. DataGrip会自动生成ER图，显示表之间的关联关系（外键连线）
4. 拖拽调整表的位置，点击右上角 **Export** 保存为PNG/PDF，方便团队分享

## 四、验证与导出

### 1. 验证表结构

1. 双击 `sys_user` 表，查看表结构

2. 点击 **Columns** 标签，检查字段类型、注释、默认值是否正确

3. 点击 **Indexes** 标签，检查索引是否正确

4. 执行测试插入语句，验证自动字段：

   1. ```SQL
      INSERT INTO sys_user (user_name, password, phone) 
      VALUES ('zhangsan', '123456', '13800138000');
      ```

   2.  执行后查看 `create_time` 和 `update_time` 是否自动生成，修改一条数据，查看 `update_time` 是否自动更新

### 2. 导出DDL脚本

1. 右键点击目标表 → **SQL Scripts** → **Generate DDL**
2. 选择导出范围（单个表/全库），点击 **OK**
3. 保存SQL文件，用于版本控制和团队协作

## 五、工作中最佳实践

1. **先设计ER图，再建表**：复杂业务先在DataGrip中画ER图，理清表关系，再逐个建表
2. **禁止直接修改生产库表结构**：先在开发库设计，导出DDL脚本，测试通过后再在生产库执行
3. **字段长度预留余量**：比如姓名设为20，不要刚好设为10，避免后续不够用
4. **不要用外键强制约束**：高并发场景下，外键会影响性能，建议在应用层维护关系
5. **统一逻辑删除**：所有表都加 `deleted` 字段，用逻辑删除替代物理删除
6. **定期备份表结构**：每次修改表结构后，导出DDL脚本备份

