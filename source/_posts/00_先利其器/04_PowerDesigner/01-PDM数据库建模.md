---
title: 01-PDM数据库建模
date: 2017-10-18 21:13:45
tags: 
- Power Designer
- PDM
- 数据库建模
categories:
- 00_先利其器
- 04_PowerDesigner
---



![image-20200806203223621](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200806203224.png)



**PowerDesigner 16.5 软件下载**：
链接：https://pan.baidu.com/s/17qLr0funs3mkrhACk45_pw?pwd=k9d9 
提取码：k9d9
**PowerDesigner 16.5 软件破懈**：
链接：https://pan.baidu.com/s/1XzcxcLFLm8_xDlQRMwOIUw?pwd=ddrc 
提取码：ddrc

> 注意事项：
> 1. 安装时一路 next 即可，中间需要选择一下同意的协议语言；
> 2. 永久使用请覆盖第二个文件， 安装目录下覆盖即可。

### 1. 概述
Sybase公司的软件，几乎包括了数据库模型设计的全过程，利用PowerDesigner可以制作数据流程图、概念数据模型、物理数据模型、面向对象模型。
使用PowerDesigner可以更加直观的表现出数据库中表之间的关系，并且可以直接导出相应的建表语句。

### 2. 概念数据模型
`Conceptual Data Model` : 概念数据模型。
概念数据模型是现实世界到信息世界的第一层抽象，主要是在高水平和面向业务的角度对信息的一种描述，通常作为`业务人员和技术人员`之间沟通的桥梁。

> 简言之：给`人看`的数据库设计模型、`实体`。

#### 2.1 概念数据模型创建
* **Ctrl + N**  >>  **Model Types**  >>  **Conceptual Data Model**  >>  **Conceptual Diagram**


#### 2.2 E-R 实体-联系图
![image-20230316134346825](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316134347.png)
**① 一对一**
如 1个公司 对应 1个地址。
![image-20230316134406324](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316134407.png)

**① 一对多**
如 1个校长 对应 多个学生。
![image-20230316134421548](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316134422.png)

**① 多对多**
如 多个学生 对应 多个课程。
![image-20230316134432928](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316134433.png)


### 3. 物理数据模型 - 常用
`Physical Data Model` : 物理数据模型
是概念数据模型和逻辑数据模型在计算机中的具体表示。该模型描述了数据在物理存储介质上的具体组织结构，不但与具体的数据库管理系统相关，同时还与具体的操作系统以及硬件有关，但是很多工作都是由DBMS自动完成的，用户所要做的工作其实就是添加自己的索引等结构即可。

> 简言之：用来生成SQL语句脚本文件(`机器看`)的数据库模型、`表`。

#### 3.1 物理数据模型创建
* **Ctrl + N**  >>  **Model Types**  >>  **Physical Data Model**  >>  **Physical Diagram** >> **DBMS选择 MySQL5.0**

#### 3.2 E-R 实体-联系图
**① 一对一**
如 1个公司 对应 1个地址。
![image-20230316134448118](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316134448.png)

**① 一对多**
如 1个校长 对应 多个学生。
![image-20230316134500831](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316134501.png)

**① 多对多**
如 多个学生 对应 多个课程。
![image-20230316134515752](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316134516.png)

#### 3.3 常用操作设置

* 设置数据库表的字符集：（`将这三行拷贝到末尾`）

    ```vb
    ENGINE = %s : list = BDB | HEAP | ISAM | InnoDB | MERGE | MRG_MYISAM | MYISAM, default = InnoDB
    DEFAULT CHARACTER SET = %s : list = utf8 | utf8mb4 | gbk, default = utf8mb4
    COLLATE = %s : list = utf8_bin | utf8_general_ci | utf8mb4 | utf8mb4_general_ci | gbk_bin | gbk_chinese_ci, default = utf8mb4_general_ci
    ```

![image-20200819155843081](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200819155847.png)

![image-20200819160614098](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200819160615.png)

* unique 非空字段设置：

![image-20200806203616144](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200806203617.png)

* 主键自增、默认值、注释信息

![image-20200806203933345](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200806203934.png)



### 4. 生成脚本与逆向操作

#### 4.1 数据模型 >> SQL脚本文件
由`物理数据模型`生成SQL语句脚本文件步骤：
1. 将数据库修改为想要的数据库：**Database** >> **Change Current DBMS**... [MySQL5.0]
2. `Ctrl+G` 生成SQL语句 文件
3. SQLyog中右键数据库名 导入 >> 执行SQL脚本文件...

> 核心步骤：（Name+Code+Comment+default）
> 创建表 -> 添加字段 -> 设置类型 -> 设置默认值 -> 设置索引 -> 设置Physical Options物理选项 -> Ctrl+G生成 -> Option索引Drop index去勾选 -> Selection部分生成 -> Preview预览 -> 确定
>
> 注意事项：
>
> 1. 建表过程 以及 生成SQL脚本的存放路径 均不要有任何空格和中文字符；
> 2. 概念数据模型 生成 物理数据模型：Tools >> Generate Physical Data Model...  (Ctrl+Shift+P);
> 3. powerdesigner中添加了数据库表索引的话，Ctrl+G导出后，需要将 drop 索引的 sql 语句删除，因为默认生成的删除语句没有判断索引是否存在，通过 navicat 导入时会出现找不到表而报错。


#### 4.2 SQL脚本文件 >> 数据模型
由`SQL脚本文件`生成物理数据模型步骤：
1. **File** >> **Reverse Engineer** >> **Database**...
2. 确定
3. `+` 添加SQL脚本文件 >> 确定

> 注意事项：
> 从生成的 物理数据模型，也可再生成 概念数据模型：Tools >> Generate Conceptual Data Model...  (Ctrl+Shift+C)

### 5. 导入SQL脚本

如SQLyog中：

第一步：创建一个数据库，取个数据库名
![image-20230316134541975](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316134542.png)
第二步：右键数据库名 >> 导入 >> 执行SQL脚本... >> 选择SQL脚本文件的目录 >> [执行]，即可生成数据库中的表。
![image-20230316134603148](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316134604.png)



### 6. 生成测试数据-假数据

![2020-8-10-生成测试数据](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200810145421.png)



### 7. pdm2excel 导出

![image-20210418171352731](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210418171354.png)

![image-20210418171836014](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210418171837.png)

```vbscript
'******************************************************************************
Option Explicit
   Dim rowsNum
   rowsNum = 0
'-----------------------------------------------------------------------------
' Main function
'-----------------------------------------------------------------------------
' Get the current active model
    Dim Model
    Set Model = ActiveModel
    If (Model Is Nothing) Or (Not Model.IsKindOf(PdPDM.cls_Model)) Then
       MsgBox "The current model is not an PDM model."
    Else
      ' Get the tables collection
      '创建EXCEL APP
      dim beginrow
      DIM EXCEL, SHEET, SHEETLIST
      set EXCEL = CREATEOBJECT("Excel.Application")
      EXCEL.workbooks.add(-4167)'添加工作表
      EXCEL.workbooks(1).sheets(1).name ="表结构"
      set SHEET = EXCEL.workbooks(1).sheets("表结构")
      
      EXCEL.workbooks(1).sheets.add
      EXCEL.workbooks(1).sheets(1).name ="目录"
      set SHEETLIST = EXCEL.workbooks(1).sheets("目录")
      ShowTableList Model,SHEETLIST

      ShowProperties Model, SHEET,SHEETLIST
      
      
      EXCEL.workbooks(1).Sheets(2).Select
      EXCEL.visible = true
      '设置列宽和自动换行
      sheet.Columns(1).ColumnWidth = 20 
      sheet.Columns(2).ColumnWidth = 20 
      sheet.Columns(3).ColumnWidth = 20 
      sheet.Columns(4).ColumnWidth = 40 
      sheet.Columns(5).ColumnWidth = 10 
      sheet.Columns(6).ColumnWidth = 10 
      sheet.Columns(1).WrapText =true
      sheet.Columns(2).WrapText =true
      sheet.Columns(4).WrapText =true
      '不显示网格线
      EXCEL.ActiveWindow.DisplayGridlines = False
      
      
 End If
'-----------------------------------------------------------------------------
' Show properties of tables
'-----------------------------------------------------------------------------
Sub ShowProperties(mdl, sheet,SheetList)
   ' Show tables of the current model/package
   rowsNum=0
   beginrow = rowsNum+1
   Dim rowIndex 
   rowIndex=3
   ' For each table
   output "begin"
   Dim tab
   For Each tab In mdl.tables
      ShowTable tab,sheet,rowIndex,sheetList
      rowIndex = rowIndex +1
   Next
   if mdl.tables.count > 0 then
        sheet.Range("A" & beginrow + 1 & ":A" & rowsNum).Rows.Group
   end if
   output "end"
End Sub
'-----------------------------------------------------------------------------
' Show table properties
'-----------------------------------------------------------------------------
Sub ShowTable(tab, sheet,rowIndex,sheetList)
   If IsObject(tab) Then
     Dim rangFlag
     rowsNum = rowsNum + 1
      ' Show properties
      Output "================================"
      sheet.cells(rowsNum, 1) =tab.name
      sheet.cells(rowsNum, 1).HorizontalAlignment=3
      sheet.cells(rowsNum, 2) = tab.code
      'sheet.cells(rowsNum, 5).HorizontalAlignment=3
      'sheet.cells(rowsNum, 6) = ""
      'sheet.cells(rowsNum, 7) = "表说明"
      sheet.cells(rowsNum, 3) = tab.comment
      'sheet.cells(rowsNum, 8).HorizontalAlignment=3
      sheet.Range(sheet.cells(rowsNum, 3),sheet.cells(rowsNum, 7)).Merge
      '设置超链接，从目录点击表名去查看表结构
      '字段中文名    字段英文名    字段类型    注释    是否主键    是否非空    默认值
      sheetList.Hyperlinks.Add sheetList.cells(rowIndex,2), "","表结构"&"!B"&rowsNum
      rowsNum = rowsNum + 1
      sheet.cells(rowsNum, 1) = "字段中文名"
      sheet.cells(rowsNum, 2) = "字段英文名"
      sheet.cells(rowsNum, 3) = "字段类型"
      sheet.cells(rowsNum, 4) = "注释"
      sheet.cells(rowsNum, 5) = "是否主键"
      sheet.cells(rowsNum, 6) = "是否非空"
      sheet.cells(rowsNum, 7) = "默认值"
      '设置边框
      sheet.Range(sheet.cells(rowsNum-1, 1),sheet.cells(rowsNum, 7)).Borders.LineStyle = "1"
      'sheet.Range(sheet.cells(rowsNum-1, 4),sheet.cells(rowsNum, 9)).Borders.LineStyle = "1"
      '字体为10号
      sheet.Range(sheet.cells(rowsNum-1, 1),sheet.cells(rowsNum, 7)).Font.Size=10
            Dim col ' running column
            Dim colsNum
            colsNum = 0
      for each col in tab.columns
        rowsNum = rowsNum + 1
        colsNum = colsNum + 1
          sheet.cells(rowsNum, 1) = col.name
        'sheet.cells(rowsNum, 3) = ""
          'sheet.cells(rowsNum, 4) = col.name
          sheet.cells(rowsNum, 2) = col.code
          sheet.cells(rowsNum, 3) = col.datatype
        sheet.cells(rowsNum, 4) = col.comment
          If col.Primary = true Then
        sheet.cells(rowsNum, 5) = "Y" 
        Else
        sheet.cells(rowsNum, 5) = " " 
        End If
        If col.Mandatory = true Then
        sheet.cells(rowsNum, 6) = "Y" 
        Else
        sheet.cells(rowsNum, 6) = " " 
        End If
        sheet.cells(rowsNum, 7) =  col.defaultvalue
      next
      sheet.Range(sheet.cells(rowsNum-colsNum+1,1),sheet.cells(rowsNum,7)).Borders.LineStyle = "3"       
      'sheet.Range(sheet.cells(rowsNum-colsNum+1,4),sheet.cells(rowsNum,9)).Borders.LineStyle = "3"
      sheet.Range(sheet.cells(rowsNum-colsNum+1,1),sheet.cells(rowsNum,7)).Font.Size = 10
      rowsNum = rowsNum + 2
      
      Output "FullDescription: "       + tab.Name
   End If
   
End Sub
'-----------------------------------------------------------------------------
' Show List Of Table
'-----------------------------------------------------------------------------
Sub ShowTableList(mdl, SheetList)
   ' Show tables of the current model/package
   Dim rowsNo
   rowsNo=1
   ' For each table
   output "begin"
   SheetList.cells(rowsNo, 1) = "主题"
   SheetList.cells(rowsNo, 2) = "表中文名"
   SheetList.cells(rowsNo, 3) = "表英文名"
   SheetList.cells(rowsNo, 4) = "表说明"
   rowsNo = rowsNo + 1
   SheetList.cells(rowsNo, 1) = mdl.name
   Dim tab
   For Each tab In mdl.tables
     If IsObject(tab) Then
         rowsNo = rowsNo + 1
      SheetList.cells(rowsNo, 1) = ""
      SheetList.cells(rowsNo, 2) = tab.name
      SheetList.cells(rowsNo, 3) = tab.code
      SheetList.cells(rowsNo, 4) = tab.comment
     End If
   Next
    SheetList.Columns(1).ColumnWidth = 20 
      SheetList.Columns(2).ColumnWidth = 20 
      SheetList.Columns(3).ColumnWidth = 30 
     SheetList.Columns(4).ColumnWidth = 60 
   output "end"
End Sub
```

### 8. comment2name 显示

将sql中的中文注释COMMENT字段复制给Name。

![image-20210418171352731](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210418171354.png)

```vbscript
Option   Explicit 
ValidationMode   =   True 
InteractiveMode   =   im_Batch
 
Dim   mdl   '   the   current   model
'   get   the   current   active   model 
Set   mdl   =   ActiveModel 
If   (mdl   Is   Nothing)   Then 
  MsgBox   "There   is   no   current   Model " 
ElseIf   Not   mdl.IsKindOf(PdPDM.cls_Model)   Then 
  MsgBox   "The   current   model   is   not   an   Physical   Data   model. " 
Else 
  ProcessFolder   mdl 
End   If
 
Private   sub   ProcessFolder(folder) 
On Error Resume Next
  Dim   Tab   'running table 
  for   each   Tab   in   folder.tables 
if   not   tab.isShortcut   then 
  tab.name   =   tab.comment
  Dim   col   '   running   column 
  for   each   col   in   tab.columns 
  if col.comment="" then
  else
col.name=   col.comment 
  end if
  next 
end   if 
  next
 
  Dim   view   'running   view 
  for   each   view   in   folder.Views 
if   not   view.isShortcut   then 
  view.name   =   view.comment 
end   if 
  next
  '   go   into   the   sub-packages 
  Dim   f   '   running   folder 
  For   Each   f   In   folder.Packages 
if   not   f.IsShortcut   then 
  ProcessFolder   f 
end   if 
  Next 
end   sub
```

