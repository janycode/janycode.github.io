---
title: 07-项目任务分解WBS
date: 2018-5-25 22:18:03
tags:
- 项目管理
- WBS
categories: 
- 12_项目管理
- 05_Document
---

![image-20210213102723819](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210213102724.png)

附件下载：https://janycode.github.io/files/document_record.xls



![QQ图片20210219164037](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20210219164050.png)



WBS任务排期：[https://janycode.github.io/files/项目计划流程WBS示例.drawio](https://janycode.github.io/files/项目计划流程WBS示例.drawio)



* 企业微信智能表格模版样例：

![项目任务表格字段模版](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218164958.png)

* 【任务状态】枚举：

![任务状态枚举模版](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250218165043.png)

* 【进度】公式：

```
IF([任务状态]="已完成", 100%, IF([任务状态]="测试中", 80%, IF([任务状态]="已提测", 70%, IF([任务状态]="联调中", 60%, IF([任务状态]="待联调", 50%, IF([任务状态]="前端开发中", 40%, IF([任务状态]="后端开发中", 20%, IF([任务状态]="准备中", 10%, 0%))))))))
```

