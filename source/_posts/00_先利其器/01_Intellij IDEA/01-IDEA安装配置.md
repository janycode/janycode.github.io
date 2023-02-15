---
title: 01-IDEA安装配置 
date: 2016-4-28 21:13:45
tags: 
- IDEA
- 安装
- 配置
categories:
- 00_先利其器
- 01_Intellij IDEA
---



#### 01. IDEA安装

###### 1.1 IDEA获取
官网获取：
https://www.jetbrains.com/idea/download/#section=windows

或者百度网盘 ideaIU-2020.1.1.exe 版本(2020更新，)：

链接：https://pan.baidu.com/s/19mlgYPNBRM4tCCgSFVZciA 
提取码：`aun5`



###### 1.2 安装
安装路径：非C盘且非中文路径
安装勾选：64-bit快捷方式（其他不勾选）

破解方法：(2020更新，适用于 `ideaIU-2020.1.1.exe`)

![image-20211231104412692](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211231104412692.png)

![image-20211231104446789](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211231104446789.png)

![image-20211231104515591](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211231104515591.png)

![image-20211231104525135](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211231104525135.png)

至此，激活成功！



###### 1.3 配置
同步配置：

![image-20211231112710513](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211231112710513.png)



插件选择：Swing和Android可以Disable掉。

* 创建项目进入工具主界面后，**Ctrl+Alt+S**打开setting，搜索font，设置等宽字体
* 搜索keymap后，右侧搜索Basic（非常常用），把Ctrl+空格修改为Alt+/
* 选择项目中的src，**Alt+Insert**新建Package，如com.demo.www
* 选择项目中的src，**Alt+Insert**新建Class，如MethodTest
* 输入**psvm**可以快捷输入 public static void main(String[] args) { }
* 输入**sout**可以快捷输入 System.out.println();
* **Ctrl+Shitf+F10**可以快速运行代码
* **Shift+ESC**可以快速隐藏掉运行结果弹窗
* **Ctrl+X**可以删除当前行

|      快捷键      |              功能              |
| :--------------: | :----------------------------: |
|    Alt+Insert    |            新建一切            |
|       psvm       |          快速main方法          |
|      Ctrl+Z      |              撤销              |
|   Ctrl+Shitf+Z   |             反撤销             |
|      Ctrl+C      |            复制一行            |
|     Ctrl+X/Y     |            删除一行            |
|    Ctrl+Alt+L    |   对齐代码(QQ/印象笔记冲突)    |
|      Alt+/       |    补齐代码(手动更改快捷键)    |
| Ctrl+Shift+Space |            智能补齐            |
|    Alt+Enter     |            修复代码            |
| Ctrl+Shift+Enter |          自动补齐分号          |
|    Ctrl+Alt+V    |    可以生成一个方法对应变量    |
|      Ctrl+Q      | 可以快速查看对应代码的文档注释 |
|      Ctrl+D      |     复制光标所在行到下一行     |

#### 02. 创建第一个IDEA项目
Alt+Insert 新建一切