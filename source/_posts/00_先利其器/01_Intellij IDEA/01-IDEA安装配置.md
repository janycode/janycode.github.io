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



### 1. IDEA2023.1

#### 1.1 IDEA获取

官网获取：
https://www.jetbrains.com/zh-cn/idea/download/#section=windows

当前版本：
![image-20230417174343989](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230417174345.png)

破解效果：

![image-20230417174414064](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230417174415.png)

#### 1.2 下载工具包

IDEA2023.1破解工具包，百度网盘下载地址：

链接：https://pan.baidu.com/s/1722jEZAWrrn0otLq-XDBVw?pwd=xqid 
提取码：xqid

> **重要说明：**
>
> 1、工具下载后，放到本地合适的位置，存放路径不要含有汉字和空格，否则会造成激活失败
>
> 2、工具下载后，是zip压缩格式，一定要先解压，再按照下文中的步骤进行安装配置。
>
> 3、工具安装后，绝对不能移动或移除工具，否则后续IDEA打开会出现闪退，或提示找不到jar文件，“ja-netfilter.jar not found”

激活工具包解压后，目录文件如下：

![image-20230418101616524](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230418101617.png)

#### 1.3 破解激活

如下 `2.1 工具包安装配置` 和 `2.2 使用激活码` 两个步骤，是共同搭配起作用的，并非二选一，切记！！！

##### 1.3.1 工具包安装配置

通过执行 scripts 目录下的脚本文件，进行安装配置或者卸载配置。

##### 1.3.2 Windows 系统

Windows 系统，直接双击 `install-all-users.vbs` 或者 `install-current-user.vbs` 脚本，此脚本执行，会为我们添加一些环境变量配置，主要是配置 vmoptions 等。脚本 `install-all-users.vbs` 和 `install-current-user.vbs` 的区别，只在于环境变量是为系统变量还是用户变量。

![image-20230418101529143](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230418101530.png)

当看到如上图中提示 **Done** 时，表示工具安装配置完成。

依次点击 计算机 -> 属性 -> 高级系统设置 -> 环境变量，可以看到，脚本已经成功为我们安装的环境变量具体内容。

> 说明：
>
> 1. 因为脚本会修改环境变量，所以在 Windows 系统中，可能会被安全软件拦截，允许执行即可。
> 2. 激活完成后，绝不能移动或删除工具，否则会造成激活失效，甚至无法启动IDEA。若的确需要更换工具路径，路径更换完后，先执行对应的卸载脚本 uninstall，再重新按上面的步骤，执行安装脚本。

##### 1.3.3 MacOS环境

Macos 系统， 执行 `install.sh` 脚本，此脚本执行，会为我们添加一些环境变量配置。

![image-20230418101651003](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230418101652.png)

看到如上图中提示 **Done** 时，表示工具安装配置完成。

> 说明：
>
> 1. 激活完成后，绝不能移动或删除工具，否则会造成激活失效，甚至无法启动IDEA。若的确需要更换工具路径，路径更换完后，先执行对应的卸载脚本 uninstall，再重新按上面的步骤，执行安装脚本。
> 2. 若当前用户直接通过 `script/install.sh` 执行失败，可以尝试 `sudo script/install.sh` 再次执行。

#### 1.4 使用激活码

IDEA2023.1仍然支持服务器激活和激活码激活两种方式，任选其一。尽管服务器激活方式不太稳定，但仍然给出来，自行选择。

> 服务器列表：[JETBRAINS服务器](https://aijihuo.cn/jetbrains-license-servers.html)
>
> 最新激活码：[JETBRAINS激活码](https://aijihuo.cn/jetbrains-activation-codes.html)

* IDEA 2023.1

```
6G5NXCPJZB-eyJsaWNlbnNlSWQiOiI2RzVOWENQSlpCIiwibGljZW5zZWVOYW1lIjoic2lnbnVwIHNjb290ZXIiLCJhc3NpZ25lZU5hbWUiOiIiLCJhc3NpZ25lZUVtYWlsIjoiIiwibGljZW5zZVJlc3RyaWN0aW9uIjoiIiwiY2hlY2tDb25jdXJyZW50VXNlIjpmYWxzZSwicHJvZHVjdHMiOlt7ImNvZGUiOiJQU0kiLCJmYWxsYmFja0RhdGUiOiIyMDI1LTA4LTAxIiwicGFpZFVwVG8iOiIyMDI1LTA4LTAxIiwiZXh0ZW5kZWQiOnRydWV9LHsiY29kZSI6IlBEQiIsImZhbGxiYWNrRGF0ZSI6IjIwMjUtMDgtMDEiLCJwYWlkVXBUbyI6IjIwMjUtMDgtMDEiLCJleHRlbmRlZCI6dHJ1ZX0seyJjb2RlIjoiSUkiLCJmYWxsYmFja0RhdGUiOiIyMDI1LTA4LTAxIiwicGFpZFVwVG8iOiIyMDI1LTA4LTAxIiwiZXh0ZW5kZWQiOmZhbHNlfSx7ImNvZGUiOiJQUEMiLCJmYWxsYmFja0RhdGUiOiIyMDI1LTA4LTAxIiwicGFpZFVwVG8iOiIyMDI1LTA4LTAxIiwiZXh0ZW5kZWQiOnRydWV9LHsiY29kZSI6IlBHTyIsImZhbGxiYWNrRGF0ZSI6IjIwMjUtMDgtMDEiLCJwYWlkVXBUbyI6IjIwMjUtMDgtMDEiLCJleHRlbmRlZCI6dHJ1ZX0seyJjb2RlIjoiUFNXIiwiZmFsbGJhY2tEYXRlIjoiMjAyNS0wOC0wMSIsInBhaWRVcFRvIjoiMjAyNS0wOC0wMSIsImV4dGVuZGVkIjp0cnVlfSx7ImNvZGUiOiJQV1MiLCJmYWxsYmFja0RhdGUiOiIyMDI1LTA4LTAxIiwicGFpZFVwVG8iOiIyMDI1LTA4LTAxIiwiZXh0ZW5kZWQiOnRydWV9LHsiY29kZSI6IlBQUyIsImZhbGxiYWNrRGF0ZSI6IjIwMjUtMDgtMDEiLCJwYWlkVXBUbyI6IjIwMjUtMDgtMDEiLCJleHRlbmRlZCI6dHJ1ZX0seyJjb2RlIjoiUFJCIiwiZmFsbGJhY2tEYXRlIjoiMjAyNS0wOC0wMSIsInBhaWRVcFRvIjoiMjAyNS0wOC0wMSIsImV4dGVuZGVkIjp0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
```

> * 延伸 DataGrip 2023.1 数据库客户端工具激活码
>
> ```
> VPQ9LWBJ0Z-eyJsaWNlbnNlSWQiOiJWUFE5TFdCSjBaIiwibGljZW5zZWVOYW1lIjoic2lnbnVwIHNjb290ZXIiLCJhc3NpZ25lZU5hbWUiOiIiLCJhc3NpZ25lZUVtYWlsIjoiIiwibGljZW5zZVJlc3RyaWN0aW9uIjoiIiwiY2hlY2tDb25jdXJyZW50VXNlIjpmYWxzZSwicHJvZHVjdHMiOlt7ImNvZGUiOiJQU0kiLCJmYWxsYmFja0RhdGUiOiIyMDI1LTA4LTAxIiwicGFpZFVwVG8iOiIyMDI1LTA4LTAxIiwiZXh0ZW5kZWQiOnRydWV9LHsiY29kZSI6IlBEQiIsImZhbGxiYWNrRGF0ZSI6IjIwMjUtMDgtMDEiLCJwYWlkVXBUbyI6IjIwMjUtMDgtMDEiLCJleHRlbmRlZCI6dHJ1ZX0seyJjb2RlIjoiREIiLCJmYWxsYmFja0RhdGUiOiIyMDI1LTA4LTAxIiwicGFpZFVwVG8iOiIyMDI1LTA4LTAxIiwiZXh0ZW5kZWQiOmZhbHNlfSx7ImNvZGUiOiJQV1MiLCJmYWxsYmFja0RhdGUiOiIyMDI1LTA4LTAxIiwicGFpZFVwVG8iOiIyMDI1LTA4LTAxIiwiZXh0ZW5kZWQiOnRydWV9XSwibWV0YWRhdGEiOiIwMTIwMjIwOTAyUFNBTjAwMDAwNSIsImhhc2giOiJUUklBTDotMjI4OTE3MTciLCJncmFjZVBlcmlvZERheXMiOjcsImF1dG9Qcm9sb25nYXRlZCI6ZmFsc2UsImlzQXV0b1Byb2xvbmdhdGVkIjpmYWxzZX0=-Y35sXvjNUN0+WMouR7PGFzl62+ApqSBgPjwganzPG1ErZKJS1xh3O8MbkZnjiTPkjODi+pyBGjozBojATCzTGx4uCt61zccnyF+XI1fE9H9WTA5DAO3/maxGFJ2KthOmkuktNnNi9qa0n7EyRuZ8rVVrc5+ETiEcfo2GctNcGqHKuRF96Bf8EL1GmCOkI8vU293X+n3XKEmN+Q1hEEBGbP9yiF5zhZDzFq0svj8g4c0fnTOrCc4GKyyEps6aDW2/DurkotUFddzDhTCyoW1Gao0EZt0AnWUALsogI9ABjdtJq3ndyvuMrXTlOr2C/hCGjqIN8ZDA0gf9mnrKBhcMbA==-MIIETDCCAjSgAwIBAgIBDTANBgkqhkiG9w0BAQsFADAYMRYwFAYDVQQDDA1KZXRQcm9maWxlIENBMB4XDTIwMTAxOTA5MDU1M1oXDTIyMTAyMTA5MDU1M1owHzEdMBsGA1UEAwwUcHJvZDJ5LWZyb20tMjAyMDEwMTkwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCUlaUFc1wf+CfY9wzFWEL2euKQ5nswqb57V8QZG7d7RoR6rwYUIXseTOAFq210oMEe++LCjzKDuqwDfsyhgDNTgZBPAaC4vUU2oy+XR+Fq8nBixWIsH668HeOnRK6RRhsr0rJzRB95aZ3EAPzBuQ2qPaNGm17pAX0Rd6MPRgjp75IWwI9eA6aMEdPQEVN7uyOtM5zSsjoj79Lbu1fjShOnQZuJcsV8tqnayeFkNzv2LTOlofU/Tbx502Ro073gGjoeRzNvrynAP03pL486P3KCAyiNPhDs2z8/COMrxRlZW5mfzo0xsK0dQGNH3UoG/9RVwHG4eS8LFpMTR9oetHZBAgMBAAGjgZkwgZYwCQYDVR0TBAIwADAdBgNVHQ4EFgQUJNoRIpb1hUHAk0foMSNM9MCEAv8wSAYDVR0jBEEwP4AUo562SGdCEjZBvW3gubSgUouX8bOhHKQaMBgxFjAUBgNVBAMMDUpldFByb2ZpbGUgQ0GCCQDSbLGDsoN54TATBgNVHSUEDDAKBggrBgEFBQcDATALBgNVHQ8EBAMCBaAwDQYJKoZIhvcNAQELBQADggIBABqRoNGxAQct9dQUFK8xqhiZaYPd30TlmCmSAaGJ0eBpvkVeqA2jGYhAQRqFiAlFC63JKvWvRZO1iRuWCEfUMkdqQ9VQPXziE/BlsOIgrL6RlJfuFcEZ8TK3syIfIGQZNCxYhLLUuet2HE6LJYPQ5c0jH4kDooRpcVZ4rBxNwddpctUO2te9UU5/FjhioZQsPvd92qOTsV+8Cyl2fvNhNKD1Uu9ff5AkVIQn4JU23ozdB/R5oUlebwaTE6WZNBs+TA/qPj+5/we9NH71WRB0hqUoLI2AKKyiPw++FtN4Su1vsdDlrAzDj9ILjpjJKA1ImuVcG329/WTYIKysZ1CWK3zATg9BeCUPAV1pQy8ToXOq+RSYen6winZ2OO93eyHv2Iw5kbn1dqfBw1BuTE29V2FJKicJSu8iEOpfoafwJISXmz1wnnWL3V/0NxTulfWsXugOoLfv0ZIBP1xH9kmf22jjQ2JiHhQZP7ZDsreRrOeIQ/c4yR8IQvMLfC0WKQqrHu5ZzXTH4NO3CwGWSlTY74kE91zXB5mwWAx1jig+UXYc2w4RkVhy0//lOmVya/PEepuuTTI4+UJwC7qbVlh5zfhj8oTNUXgN0AOc+Q0/WFPl1aw5VV/VrO8FCoB15lFVlpKaQ1Yh+DVU8ke+rt9Th0BCHXe0uZOEmH0nOnH/0onD
> ```
>
> * 再延伸 PyCharm 2023.1 激活码：
>
> ```
> EUWT4EE9X2-eyJsaWNlbnNlSWQiOiJFVVdUNEVFOVgyIiwibGljZW5zZWVOYW1lIjoic2lnbnVwIHNjb290ZXIiLCJhc3NpZ25lZU5hbWUiOiIiLCJhc3NpZ25lZUVtYWlsIjoiIiwibGljZW5zZVJlc3RyaWN0aW9uIjoiIiwiY2hlY2tDb25jdXJyZW50VXNlIjpmYWxzZSwicHJvZHVjdHMiOlt7ImNvZGUiOiJQU0kiLCJmYWxsYmFja0RhdGUiOiIyMDI1LTA4LTAxIiwicGFpZFVwVG8iOiIyMDI1LTA4LTAxIiwiZXh0ZW5kZWQiOnRydWV9LHsiY29kZSI6IlBDIiwiZmFsbGJhY2tEYXRlIjoiMjAyNS0wOC0wMSIsInBhaWRVcFRvIjoiMjAyNS0wOC0wMSIsImV4dGVuZGVkIjpmYWxzZX0seyJjb2RlIjoiUFBDIiwiZmFsbGJhY2tEYXRlIjoiMjAyNS0wOC0wMSIsInBhaWRVcFRvIjoiMjAyNS0wOC0wMSIsImV4dGVuZGVkIjp0cnVlfSx7ImNvZGUiOiJQV1MiLCJmYWxsYmFja0RhdGUiOiIyMDI1LTA4LTAxIiwicGFpZFVwVG8iOiIyMDI1LTA4LTAxIiwiZXh0ZW5kZWQiOnRydWV9LHsiY29kZSI6IlBDV01QIiwiZmFsbGJhY2tEYXRlIjoiMjAyNS0wOC0wMSIsInBhaWRVcFRvIjoiMjAyNS0wOC0wMSIsImV4dGVuZGVkIjp0cnVlfV0sIm1ldGFkYXRhIjoiMDEyMDIyMDkwMlBTQU4wMDAwMDUiLCJoYXNoIjoiVFJJQUw6MzUzOTQ0NTE3IiwiZ3JhY2VQZXJpb2REYXlzIjo3LCJhdXRvUHJvbG9uZ2F0ZWQiOmZhbHNlLCJpc0F1dG9Qcm9sb25nYXRlZCI6ZmFsc2V9-FT9l1nyyF9EyNmlelrLP9rGtugZ6sEs3CkYIKqGgSi608LIamge623nLLjI8f6O4EdbCfjJcPXLxklUe1O/5ASO3JnbPFUBYUEebCWZPgPfIdjw7hfA1PsGUdw1SBvh4BEWCMVVJWVtc9ktE+gQ8ldugYjXs0s34xaWjjfolJn2V4f4lnnCv0pikF7Ig/Bsyd/8bsySBJ54Uy9dkEsBUFJzqYSfR7Z/xsrACGFgq96ZsifnAnnOvfGbRX8Q8IIu0zDbNh7smxOwrz2odmL72UaU51A5YaOcPSXRM9uyqCnSp/ENLzkQa/B9RNO+VA7kCsj3MlJWJp5Sotn5spyV+gA==-MIIETDCCAjSgAwIBAgIBDTANBgkqhkiG9w0BAQsFADAYMRYwFAYDVQQDDA1KZXRQcm9maWxlIENBMB4XDTIwMTAxOTA5MDU1M1oXDTIyMTAyMTA5MDU1M1owHzEdMBsGA1UEAwwUcHJvZDJ5LWZyb20tMjAyMDEwMTkwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCUlaUFc1wf+CfY9wzFWEL2euKQ5nswqb57V8QZG7d7RoR6rwYUIXseTOAFq210oMEe++LCjzKDuqwDfsyhgDNTgZBPAaC4vUU2oy+XR+Fq8nBixWIsH668HeOnRK6RRhsr0rJzRB95aZ3EAPzBuQ2qPaNGm17pAX0Rd6MPRgjp75IWwI9eA6aMEdPQEVN7uyOtM5zSsjoj79Lbu1fjShOnQZuJcsV8tqnayeFkNzv2LTOlofU/Tbx502Ro073gGjoeRzNvrynAP03pL486P3KCAyiNPhDs2z8/COMrxRlZW5mfzo0xsK0dQGNH3UoG/9RVwHG4eS8LFpMTR9oetHZBAgMBAAGjgZkwgZYwCQYDVR0TBAIwADAdBgNVHQ4EFgQUJNoRIpb1hUHAk0foMSNM9MCEAv8wSAYDVR0jBEEwP4AUo562SGdCEjZBvW3gubSgUouX8bOhHKQaMBgxFjAUBgNVBAMMDUpldFByb2ZpbGUgQ0GCCQDSbLGDsoN54TATBgNVHSUEDDAKBggrBgEFBQcDATALBgNVHQ8EBAMCBaAwDQYJKoZIhvcNAQELBQADggIBABqRoNGxAQct9dQUFK8xqhiZaYPd30TlmCmSAaGJ0eBpvkVeqA2jGYhAQRqFiAlFC63JKvWvRZO1iRuWCEfUMkdqQ9VQPXziE/BlsOIgrL6RlJfuFcEZ8TK3syIfIGQZNCxYhLLUuet2HE6LJYPQ5c0jH4kDooRpcVZ4rBxNwddpctUO2te9UU5/FjhioZQsPvd92qOTsV+8Cyl2fvNhNKD1Uu9ff5AkVIQn4JU23ozdB/R5oUlebwaTE6WZNBs+TA/qPj+5/we9NH71WRB0hqUoLI2AKKyiPw++FtN4Su1vsdDlrAzDj9ILjpjJKA1ImuVcG329/WTYIKysZ1CWK3zATg9BeCUPAV1pQy8ToXOq+RSYen6winZ2OO93eyHv2Iw5kbn1dqfBw1BuTE29V2FJKicJSu8iEOpfoafwJISXmz1wnnWL3V/0NxTulfWsXugOoLfv0ZIBP1xH9kmf22jjQ2JiHhQZP7ZDsreRrOeIQ/c4yR8IQvMLfC0WKQqrHu5ZzXTH4NO3CwGWSlTY74kE91zXB5mwWAx1jig+UXYc2w4RkVhy0//lOmVya/PEepuuTTI4+UJwC7qbVlh5zfhj8oTNUXgN0AOc+Q0/WFPl1aw5VV/VrO8FCoB15lFVlpKaQ1Yh+DVU8ke+rt9Th0BCHXe0uZOEmH0nOnH/0onD
> ```

启动IntelliJ IDEA2023.1，输入激活码：

![image-20230418102024031](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230418102024.png)

**若是这里显示 "Key is invalid"，请做如下排查和尝试**

> 1. 确保工具包安装配置成功，检查环境变量是否正确配置，避免被安全软件拦截
> 2. 尝试重启IDEA
> 3. 尝试断网并重启IDEA

点击 Activate 按钮之后，激活成功！

![image-20230418102044116](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230418102045.png)

注意，这里显示只激活到2025年，但`实际是永久激活的`，即使过了这个时间，此激活也仍然有效，IDEA也可以继续使用。



### 2. IDEA2020.1

#### 2.1 IDEA获取
官网获取：
https://www.jetbrains.com/idea/download/#section=windows

或者百度网盘 ideaIU-2020.1.exe 版本：

链接：https://pan.baidu.com/s/19mlgYPNBRM4tCCgSFVZciA 
提取码：`aun5`



#### 2.2 安装
安装路径：非C盘且非中文路径
安装勾选：64-bit快捷方式（其他不勾选）

破解方法：(2020更新，适用于 `ideaIU-2020.1.1.exe`)

![image-20211231104412692](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211231104412692.png)

![image-20211231104446789](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211231104446789.png)

![image-20211231104515591](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211231104515591.png)

![image-20211231104525135](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20211231104525135.png)

至此，激活成功！



#### 2.3 配置
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





