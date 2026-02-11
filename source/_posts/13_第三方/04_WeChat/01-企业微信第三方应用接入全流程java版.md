---
title: 01-企业微信第三方应用接入全流程java版
date: 2024-9-21 19:54:51
index_img: https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241026114427.png
tags:
- 第三方
- 企业微信
- 第三方应用
- 服务商
categories:
- 13_第三方
- 04_WeChat
---

![image-20240920174732600](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240920174733.png)



> 一切的前提是 要仔细阅读企业微信开发者中心的文档，内容和流程相对较多，但并不复杂。



# 1.     概念与流程

## 1.1 概念

* 应用分类

![image-20240920175551452](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240920175552.png)

#### 1、企业内部应用

由企业内部的开发者自己开发部署，相当于是企业自己的资产，调用接口基本没有任何限制。

#### 2、`第三方应用`

由SaaS服务商的开发者开发并部署在服务商侧，面向所有企业。需要企业授权使用（先试用后付费），服务商仅可获取企业授权部分的权限，相当于白名单控制。

#### 3、代开发自建应用

由服务商的开发者开发，但部署在企业内部。一般是线下签约采购方式，因此权限几乎与自建应用无异，企业管理员只需要配置不对服务商开放的敏感权限，相当于黑名单控制。

![image-20240920175657978](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240920175659.png)

* 服务商后台 与 企业管理后台

服务商后台地址：[企业微信服务商官网](https://open.work.weixin.qq.com/)

![image-20240920175840806](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240920175842.png)

企业管理后台地址：[企业微信管理后台](https://work.weixin.qq.com/wework_admin/frame#/index)

![image-20240920175859303](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240920175900.png)

服务商，可以理解为 SAAS 中的运营端。

企业管理端，可以理解为 SAAS 中的租户端。

因此：

​            1.     既是服务商管理员又是企业管理后台的管理员时，可以在两个后台之间互相切换，自动登录。

​            2.     服务商创建的第三方应用，企业管理端可以在管理后台【应用管理】的第三方应用点[+]搜索应用添加授权到企业微信工作台中，企业下用户即可快捷使用。



## 1.2 流程

### 1.2.1 全局流程

https://doc.weixin.qq.com/flowchart-addon

"接入" 即开发和处理下方 数据流程 内容。

![image-20240920175945675](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240920175946.png)



### 1.2.2 应用配置

参考如下图。

![image-20240920180434133](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240920180435.png)

> 回调配置：
>
> 两个 getData 接口，一个是 GET 请求，一个是 POST 请求。

### 1.2.3 数据流程

参考文档：[企业微信应用接入指引 - 接口文档 - 企业微信开发者中心](https://developer.work.weixin.qq.com/document/path/90568)

![image-20240920181111270](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240920181112.png)

> Start
>
> 1.第三方服务商创建应用配置信息：https://open.work.weixin.qq.com/wwopen/developer#/sass/apps/list
>
> 2.企业微信服务指令回调：https://developer.work.weixin.qq.com/tutorial/detail/38
>
> 3.获取第三方应用凭证：https://developer.work.weixin.qq.com/tutorial/detail/39
>
> 4.获取预授权码：https://developer.work.weixin.qq.com/document/path/90601
>
> 5.设置授权配置：https://developer.work.weixin.qq.com/document/path/90602
>
> 6.拼接安装应用的授权页面：https://developer.work.weixin.qq.com/document/path/90597
>
> 7.授权成功拿到临时授权码页面 eg: `redirect_uri?auth_code=xxx&expires_in=600&state=xx`
>
> 8.获取永久授权码和企业信息: https://developer.work.weixin.qq.com/document/path/90603
>
> 9.获取企业凭证access_token后调用企业相关api: https://developer.work.weixin.qq.com/document/path/90605
>
> 10.拼接应用内用户自动登录授权页面: https://developer.work.weixin.qq.com/document/path/91120
>
> 11.授权成功拿到授权码页面 eg: `redirect_uri?code=CODE&state=STATE`
>
> End



#             2.     核心文档

第三方应用开发前提：[成为企业微信的服务商 - 企业微信开发者中心](https://developer.work.weixin.qq.com/document/path/90568#成为企业微信的服务商)

第三方应用开发流程：[教程 - 企业微信开发者中心](https://developer.work.weixin.qq.com/tutorial/开发第三方应用)

申请成为服务商：[企业微信申请成为服务商](https://open.work.weixin.qq.com/wwopen/login?login_type=service_register)

## 2.1 理解第三方应用开发流程和概念

从第三方应用整个项目周期的接入流程来看，主要分成两个阶段：2.1.1 & 2.1.2

![image-20240920182119904](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240920182121.png)

### 2.1.1 应用开发阶段

​            1.     创建应用，配置基本信息

​            2.     开发应用，测试应用逻辑

​            3.     上线应用，提交审核信息

### 2.1.2 应用推广阶段

​            1.     服务商自有渠道推广

​            2.     企业微信应用市场推广

​	应用申请可搜：[企业微信应用市场搜索指引](https://open.work.weixin.qq.com/wwopen/common/readDocument/27656)



### 2.1.3 基本流程

官方流程图参考：

![image-20240920182153054](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240920182154.png)

整体为四个阶段：

#### 1）前期应用准备

​            1.     创建应用

​            2.     获取 suite_id 与 suite_scret

#### 2）基础环境搭建

​            1.     获取第三方应用凭证

#### 3）企业授权安装

​            1.     获取临时授权码

​            2.     获取永久授权码

#### 4）调用企业接口

​            1.     获取登陆用户身份

​            2.     获取企业凭证

参考文档：[理解第三方应用开发的流程与概念](https://developer.work.weixin.qq.com/tutorial/detail/36)

## 2.2 如何创建第三方应用

参考文档：[一：如何创建第三方应用](https://developer.work.weixin.qq.com/tutorial/detail/37)

## 2.3 如何接受企业微信回调

参考文档：[二：如何接收企业微信回调](https://developer.work.weixin.qq.com/tutorial/detail/38)

## 2.4 如何获取第三方应用凭证

参考文档：[三：如何获取第三方应用凭证](https://developer.work.weixin.qq.com/tutorial/detail/39)

## 2.5 如何将应用安装到企业工作台

参考文档：[四：如何将应用安装到企业工作台](https://developer.work.weixin.qq.com/tutorial/detail/40)

## 2.6 如何获取登陆用户信息

参考文档：[五：如何获取登录用户信息](https://developer.work.weixin.qq.com/tutorial/detail/41)

## 2.7 如何向成员发送消息

参考文档：[六：如何向成员发送消息](https://developer.work.weixin.qq.com/tutorial/detail/42)

## 2.8 如何提交上架

参考文档：[七：如何提交上线第三方应用](https://developer.work.weixin.qq.com/tutorial/detail/43)



#             **3.** 接入实现 - Java

## 3.1 配置

### 一、在企业微信中开发第三方应用，需要填写一些基础配置

![image-20240921091253833](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921091254.png)

### 二、这些配置需要登录到企业微信服务商后台进行配置

![image-20240921091307108](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921091308.png)

以上数据配置填写完后，点击“创建应用” 会得到下面3的信息

### 三、进入服务商后台->应用管理->网页应用：点击“创建应用”

配置包含：

1）基本信息

Secret：点击获取

1）使用配置

应用主页（我们浏览器访问的地址，例如:[http://www.baidu.com](http://www.baidu.com/)）

桌面端独立主页（同应用主页）

可信域名（www.baidu.com）

安装完成回调域名（www.baidu.com）

业务设置URL（同应用主页）

2）回调配置

数据回调URL([http://www.baidu.com/test](http://www.baidu.com/test)) 必须验证通过

指令回调URL([http://www.baidu.com/test](http://www.baidu.com/test)) 必须验证通过

Token：**点击按钮"随机获取"**

EncodingAESKey：**点击按钮"随机获取"**

![image-20240921091551269](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921091552.png)



![image-20240921091613408](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921091614.png)

### 四、进入服务商后台->应用管理->通用开发参数

配置包含：

1）ProviderSecret：点击获取

2）系统事件接收URL（同"数据回调"）

3）Token：**点击按钮"随机获取"**

4）EncodingAESKey：**点击按钮"随机获取"**

![image-20240921091655671](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921091656.png)

### 五、进入服务商后台->应用管理->登录授权

登陆授权配置包含：

1）登录授权发起域名（www.baidu.com）

2)  授权完成回调域名（www.baidu.com）

![image-20240921091754552](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921091755.png)

### 六、以上根据提示信息，把配置信息填写好，就可以创建第三方应用

![image-20240921091818593](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921091819.png)



## 3.2 api使用测试

**api使用**

### 一、获取ticket

服务商后台-应用管理-应用详情-刷新ticket

![image-20240921091903593](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921091904.png)

> 企业微信每`10分钟`会自动刷新一次ticket，调用指令回调配置的接口；也可手动触发。

### 二、获取第三方应用凭证

作用：调用企业微信（网页授权登录）“获取访问用户身份”时候的入参”获取预授权码 入参，获取企业永久授权码 入参

调用接口及入参如下：

```json
API:https://qyapi.weixin.qq.com/cgi-bin/service/get_suite_token
入参：
{
    "suite_id":"ww4f66fa544a32f920" ,
    "suite_secret": "vVv8JzaBlEVCTQkHKqmr57EAMs65AILWiI_4ANc25T4", 
    "suite_ticket": "Uc8vAAYl6Rvb4-ShZ1i95l4okcan91cxg-eiXlPSX3rU5u7Cpp3O9C1fN5resTWw" 
}
出参：
{
    "suite_access_token": "Uu3Nplvf50qU7mzFSh4sa5G_8-xSub-4NXsgc-3SUpucWjr_Ov84BJ3BukTCpNxSlX8FscrV7HeteHq_xTSt3nVt6sf_CKNgn8nhysZDtjcazgN21Hgd9Ub1K2ceTsxP",
    "expires_in": 7200
}
```

### 三、服务商的token

作用：调用企业微信（扫码）“获取访问用户身份”时候的入参

调用接口及入参如下：

```json
API:https://qyapi.weixin.qq.com/cgi-bin/service/get_provider_token
入参：
{
    "corpid":"ww14438c6c07a317f2",
    "provider_secret":"RH7PehRJX3LIcw4axad_H2T9HSUG1finOBEpnLTVIioBrP-zgZrGsqJ9pHVw5vVj"
}
出参：
{
    "provider_access_token": "1GXKi47D10Ruu8kdKv1V1cXbNz3i6WjvsCF135XYv5aIN6oJyZ7TNhAYma60gWFihAlxBPwHBNxzsuGclPZ7QbhlUYr6jzkZ3F81xi6K2MJ-rZ4W_ChNzG9fo0mpwbQR",
    "expires_in": 7200
}
```

### 四、获取企业永久授权码

作用：获取“授权方（企业）access_token”值

获取企业永久授权码有两种方式：

1、会在授权成功时附加在redirect_uri中跳转回第三方服务商网站，

2、通过授权成功通知回调推送给服务商。

```json
API: https://qyapi.weixin.qq.com/cgi-bin/service/get_permanent_code?suite_access_token=SUITE_ACCESS_TOKEN
SUITE_ACCESS_TOKEN替换成第三方应用凭证，如下
SUITE_ACCESS_TOKEN = Uu3Nplvf50qU7mzFSh4sa5G_8-xSub-4NXsgc-3SUpucWjr_Ov84BJ3BukTCpNxSlX8FscrV7HeteHq_xTSt3nVt6sf_CKNgn8nhysZDtjcazgN21Hgd9Ub1K2ceTsxP
入参：
{
  "auth_code": "lEPN8e8WMf9wg0lN-Gc_a18mvwab3WXW-523-bxk7YMXPMTY_Pk4A"
}

出参：
{
	"errcode":0,
	"errmsg":"ok",
	"access_token": "ScVYefHLkgC4pq0w-iBXRlOdLh9pUk4D8lxGT5ed_seCzqlG9PDz6gVGiB552SQlBCXMd7vaKAo_Fpu_obpZ70fgUYrvcvzt8ZG7a7fHJ1qPg-y7wbJjqSugobMSathNYb0_Eni3nB8hPTK8H5_RyBNn05cQ3yOd-AZIwxYbNejguuJ6FcINILu-slmf1ES8CCbtopkGy2lpmwrqUgimQ", 
	"expires_in": 7200, 
	"permanent_code": "04RGGCWltNhW_H0KoeT_mdyIKQ52nLqvoU6WV_TCz-c", 
	"auth_corp_info": 
	{
		"corpid": "wpHXx7EAAAJODtytMO7Xpu7qWNPB-GFw",
		"corp_name": "wpHXx7EAAAJODtytMO7Xpu7qWNPB-GFw",
	},
	"auth_user_info":
	{
		"userid":"aa",
	}
}
```

### 五、获取企业凭证

作用：用于“获取用户信息”，“部门信息”，“信息发送”，“应用生成ticker”，“企业生成ticker”接口等入参

```json
API: https://qyapi.weixin.qq.com/cgi-bin/service/get_corp_token?suite_access_token=SUITE_ACCESS_TOKEN
SUITE_ACCESS_TOKEN 替换成第三方应用凭证，如下
SUITE_ACCESS_TOKEN = Uu3Nplvf50qU7mzFSh4sa5G_8-xSub-4NXsgc-3SUpucWjr_Ov84BJ3BukTCpNxSlX8FscrV7HeteHq_xTSt3nVt6sf_CKNgn8nhysZDtjcazgN21Hgd9Ub1K2ceTsxP
入参：
{
    "auth_corpid": "wpHXx7EAAAJODtytMO7Xpu7qWNPB-GFw",
    "permanent_code": "04RGGCWltNhW_H0KoeT_mdyIKQ52nLqvoU6WV_TCz-c"
 }

出参：
{
	"access_token": "0nqExjiBxP9XpD1nkWO6AwrUdqvFwNXxNi0lkbu-APYU0TFJkeW6agXPoopqorZyFYTYCf5q3iz0cyWS9sJgsnkpBfZZ94g3gj6d0Bel6C8i6guCnXCS-f0e0CfKea-NIRpH10Jv93T-g6dHMpyX_JVPb2eznMUISBVEbWgFIL6SmnzYSfPVjoz225mDwxOixM3mwMZUiHSt_axCDWIXrA",
	"expires_in": 7200
}
```

### 六、以上接口可以参考企业微信第三方应用api

https://developer.work.weixin.qq.com/document/path/90600

如下图红色部分

![image-20240921092327377](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921092328.png)







## 3.3 获取ticket, auth_code

> 基于springboot项目。

### 1、构建springboot项目

新建一个模块（module）：enterprise-wechat

新建一个子模块（module）：wechat

目录结构如下：

![image-20240921092423250](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921092424.png)

结构描述：

common

* --> WeChatConstants：存放企业微信一些常量，公用参数

* --> WeChatUtils：存放企业微信第三方应用api

controller

* --> SystemController：控制层，接收请求

entity

* --> aes：目录下文件企业微信加解密包

service

* --> IConfigService：调用企业微信服务层

pom.xml

* --> 导入所需要的jar包

pom.xml中需要导入commons.codec包

```xml
<dependency>
   <groupId>commons-codec</groupId>
   <artifactId>commons-codec</artifactId>
   <version>1.9</version>
</dependency>
```

### 2、方法描述

1）doGetCallback：

① 接收验证请求，用于验证通用开发参数系统事件接收URL、数据回调URL、指令回调URL。

② 企业微信后台录入回调URL点击保存时，微信服务器会立即发送一条GET请求到对应URL，该函数就对URL的signature进行验证。

2）doPostCallback：

① 用于获取 suite_ticket，安装应用时企业微信传递过来的auth_code：**指令回调URL**。

② 当刷新ticket传递【SuitID】：**指令回调URL**。

③ 当打开应用时传递【CorpID】：**数据回调URL**。

### 3、代码编写

1）企业微信配置类：WeChatConstants

```java
package com.wechat.common;

/**
 * 企业微信
 */
public class WeChatConstants {
    // 企业微信授权码获取时间
    public static final Long EXPIRES_IN = 24 * 60 * 60 * 1000L;
    //24 * 60 * 60 * 1000L 7200L * 1000
    /**
     * 服务商CorpID
     */
    public static final String CORP_ID = "wwxxx17f2";
    /**
     * 服务商身份的调用凭证
     */
    public static final String PROVIDER_SECRET = "RH7PehRJXxxx-zgZrGsqJ9pHVw5vVj";
    /**
     * 应用的唯一身份标识
     */
    public static final String SUITE_ID = "wwxxxf920";
    /**
     * 应用的调用身份密钥
     */
    public static final String SUITE_SECRET = "vVv8JzaBxxx_4ANc25T4";
    /**
     * 应用的ticket
     */
    public static final String SUITE_TICKET = "SUITE_TICKET";
    /**
     * 应用的auth_code
     */
    public static final String AUTH_CODE = "AUTH_CODE";
    /**
     * 第三方应用凭证token
     */
    public static final String SUITE_TOKEN = "suiteToken";
    /**
     * 授权方（企业）token
     */
    public static final String ACCESS_TOKEN = "ACCESS_TOKEN";
    /**
     * 提供商 授权方服务token
     */
    public static final String PROVIDER_ACCESS_TOKEN = "PROVIDER_ACCESS_TOKEN";
    /**
     * 应用企业corpid
     */
    public static final String AUTH_CORPID = "AUTH_CORPID";
    /**
     * 企业名称
     */
    public static final String CORP_NAME = "CORPNAME";
    /**
     * 授权方的网页应用ID，在具体的网页应用中查看
     */
    public static final String AGENT_ID = "AGENTID";
    /**
     * 用户id
     */
    public static final String USER_ID = "userId";
    // 回调相关
    /**
     * 回调/通用开发参数Token, 两者解密算法一样，所以为方便设为一样
     */
    public static final String TOKENS = "E0sOXx4LqeE5BmDvMTAz3x";
    /**
     * 回调/通用开发参数EncodingAESKey, 两者解密算法一样，所以为方便设为一样
     */
    public static final String ENCODING_AES_KEY = "IESLPSyW4vyBB90jkzfwfYRtcMky6LIOevr4SVefz7I";
    public static final String REDIRECT_URI = "REDIRECT_URI";
    /**
     * 重定向地址，自己设置
     */
    public static final String REDIRECT_URL = "www.baidu.com";
    // 第三方应用id（即ww或wx开头的suite_id）
    public static final String APP_ID= "APPID";
    public static final String PERMANENT_CODE = "PERMANENT_CODE";
}
```

2）企业微信api：WeChatUtils

```java
package com.wechat.common;

/**
 * 企业微信工具类
 */
public class WeChatUtils {
    /**
     * 第三方应用api start
     */
    // 获取第三方应用凭证
    public final static String THIRD_BUS_WECHAT_SUITE_TOKEN = "https://qyapi.weixin.qq.com/cgi-bin/service/get_suite_token";

    // 获取企业永久授权码
    public final static String THIRD_BUS_WECHAT_ACCESS_TOKEN = "https://qyapi.weixin.qq.com/cgi-bin/service/get_permanent_code?suite_access_token=SUITE_ACCESS_TOKEN";

    // 第三方 构造扫码登录链接
    public final static String THIRD_BUS_WECHAT_LOGIN = "https://open.work.weixin.qq.com/wwopen/sso/3rd_qrConnect?appid=CORPID&redirect_uri=REDIRECT_URI&state=web_login&usertype=member";

    // 第三方 获取登录用户信息 POST
    public final static String THIRD_BUS_WECHAT_GET_LOGIN_INFO = "https://qyapi.weixin.qq.com/cgi-bin/service/get_login_info?access_token=PROVIDER_ACCESS_TOKEN";

    // 第三方 构造网页授权链接
    public final static String THIRD_BUS_WECHAT_AUTHORIZE_URL = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=snsapi_privateinfo&state=STATE#wechat_redirect";

    // 第三方 获取访问用户身份 GET
    public final static String THIRD_BUS_WECHAT_GET_USER_INFO = "https://qyapi.weixin.qq.com/cgi-bin/service/getuserinfo3rd?suite_access_token=SUITE_TOKEN&code=CODE";

    // 第三方 获取访问用户敏感信息 post
    public final static String THIRD_BUS_WECHAT_GET_USER_DETAIL3RD = "https://qyapi.weixin.qq.com/cgi-bin/service/getuserdetail3rd?suite_access_token=SUITE_ACCESS_TOKEN";

    // 第三方 获取部门列表
    public final static String THIRD_BUS_WECHAT_DEPART_LIST = "https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=ACCESS_TOKEN&id=ID";

    // 第三方 获取部门成员
    public final static String THIRD_BUS_WECHAT_DEPART_USER = "https://qyapi.weixin.qq.com/cgi-bin/user/simplelist?access_token=ACCESS_TOKEN&department_id=DEPARTMENT_ID&fetch_child=FETCH_CHILD";

    // 第三方 获取部门成员详情
    public final static String THIRD_BUS_WECHAT_DEPART_USER_DETAIL = "https://qyapi.weixin.qq.com/cgi-bin/user/list?access_token=ACCESS_TOKEN&department_id=DEPARTMENT_ID&fetch_child=FETCH_CHILD";

    // 第三方 读取成员 GET
    public final static String THIRD_BUS_WECHAT_GET_USER = "https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=ACCESS_TOKEN&userid=USERID";

    // 服务商的token
    public final static String THIRD_BUS_WECHAT_GET_PROVIDER_TOKEN = "https://qyapi.weixin.qq.com/cgi-bin/service/get_provider_token";

    // 获取企业凭证
    public final static String THIRD_BUS_WECHAT_GET_CORP_TOKEN = "https://qyapi.weixin.qq.com/cgi-bin/service/get_corp_token?suite_access_token=SUITE_ACCESS_TOKEN";

    // 发送应用消息
    public final static String THIRD_BUS_WECHAT_SEND = "https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=ACCESS_TOKEN";

    // 获取应用的jsapi_ticket
    public final static String THIRD_BUS_GET_JSAPI_TICKET = "https://qyapi.weixin.qq.com/cgi-bin/ticket/get?access_token=ACCESS_TOKEN&type=agent_config";

    // 获取企业的jsapi_ticket
    public final static String THIRD_BUS_GET_JSAPI_TICKET_BUS = "https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket?access_token=ACCESS_TOKEN";
    /**
     * 第三方应用api end
     */
}
```

3）controller层：SystemController

```java
package com.wechat.controller;

import com.wechat.service.IConfigService;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;

/**
 * 控制层
 */
@Slf4j
@RestController
@RequestMapping(value = "system")
public class SystemController {

    @Autowired
    private IConfigService configService;

    /**
     * 验证通用开发参数及应用回调
     * @param: request
     * @param: response
     * @returns: void
     */
    @ApiOperation(value = "验证通用开发参数及应用回调")
    @GetMapping(value = "getEchostr")
    public void doGetCallback(HttpServletRequest request, HttpServletResponse response) throws Exception {
        // 微信加密签名
        String msgSignature = request.getParameter("msg_signature");
        // 时间戳
        String timestamp = request.getParameter("timestamp");
        // 随机数
        String nonce = request.getParameter("nonce");
        // 随机字符串
        // 如果是刷新，需返回原echostr
        String echoStr = request.getParameter("echostr");
        String sEchoStr=  "";
        PrintWriter out;
        log.debug("msgSignature: " + msgSignature+"timestamp="+timestamp+"nonce="+nonce+"echoStr="+echoStr);
        try {
            sEchoStr = configService.doGetCallback(msgSignature,timestamp,nonce,echoStr); //需要返回的明文;
            log.debug("doGetCallback-> echostr: " + sEchoStr);
            // 验证URL成功，将sEchoStr返回
            out = response.getWriter();
            out.print(sEchoStr);
        } catch (Exception e) {
            //验证URL失败，错误原因请查看异常
            e.printStackTrace();
        }
    }

    /**
     * 刷新ticket，AuthCode
     */
    @ApiOperation(value = "刷新ticket，AuthCode")
    @PostMapping(value = "getEchostr")
    public String doPostCallback(HttpServletRequest request) throws Exception {
        // 微信加密签名
        String msgSignature = request.getParameter("msg_signature");
        // 时间戳
        String timestamp = request.getParameter("timestamp");
        // 随机数
        String nonce = request.getParameter("nonce");
        // 类型
        String type = request.getParameter("type");
        // 企业id
        String corpId = request.getParameter("corpid");
        ServletInputStream in = request.getInputStream();
        // 刷新ticket，AuthCode
        String success = configService.doPostCallback(msgSignature, timestamp, nonce, type, corpId, in);
        return success;
    }
}
```

4）Service层：IConfigService

```java
package com.wechat.service;

import javax.servlet.ServletInputStream;

/**
 * 企业微信第三方服务service
 */
public interface IConfigService {

    /**
     * 验证通用开发参数及应用回调
     * @returns: java.lang.String
     */
    String doGetCallback(String msgSignature, String timestamp, String nonce, String echoStr);

    /**
     * 获取SuiteTicket，AuthCode
     */
    String doPostCallback(String msgSignature, String timestamp, String nonce, String type, String corpId, ServletInputStream in);
}
```

5）service实现类：ConfigServiceImpl

```java
package com.wechat.service.impl;

import com.alibaba.druid.support.json.JSONUtils;
import com.wechat.common.StringUtils;
import com.wechat.common.WeChatConstants;
import com.wechat.common.WxUtil;
import com.wechat.common.cache.CacheData;
import com.wechat.entity.aes.AesException;
import com.wechat.entity.aes.WXBizMsgCrypt;
import com.wechat.service.IConfigService;
import com.wechat.service.IWeChatService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.ServletInputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Map;

/**
 * 回调service
 */
@Slf4j
@Service
public class ConfigServiceImpl implements IConfigService {

    @Autowired
    private IWeChatService weChatService;

    /**
     * 验证通用开发参数及应用回调
     * @returns: java.lang.String
     */
    @Override
    public String doGetCallback(String msgSignature, String timestamp, String nonce, String echoStr) {
        //需要返回的明文
        String sEchoStr="";
        try {
            log.debug(WeChatConstants.TOKENS, WeChatConstants.ENCODING_AES_KEY, WeChatConstants.CORP_ID);
            WXBizMsgCrypt wxcpt = new WXBizMsgCrypt(WeChatConstants.TOKENS, WeChatConstants.ENCODING_AES_KEY, WeChatConstants.CORP_ID);
            sEchoStr = wxcpt.VerifyURL(msgSignature, timestamp, nonce, echoStr);
        } catch (AesException e) {
            e.printStackTrace();
        }
        return sEchoStr;
    }

    /**
     * 获取SuiteTicket，AuthCode
     * @param: msgSignature 微信加密签名
     * @param: timestamp 时间戳
     * @param: nonce  随机数
     * @param: type 类型
     * @param: corpId 企业id
     * @param: in
     * @returns: java.lang.String
     */
    @Override
    public String doPostCallback(String msgSignature, String timestamp, String nonce, String type, String corpId, ServletInputStream in) {
        String id = "";
        // 访问应用和企业回调传不同的ID
        if(!StringUtils.isNull(type) && type.equals("data")){
            id = corpId;
            log.debug("======corpId==="+id);
        } else {
            id = WeChatConstants.SUITE_ID;
            log.debug("======SuiteId===" + id);
        }
        try {
            WXBizMsgCrypt wxcpt = new WXBizMsgCrypt(WeChatConstants.TOKENS, WeChatConstants.ENCODING_AES_KEY, id);
            String postData="";   // 密文，对应POST请求的数据
            //1.获取加密的请求消息：使用输入流获得加密请求消息postData
            BufferedReader reader = new BufferedReader(new InputStreamReader(in));
            String tempStr = "";   //作为输出字符串的临时串，用于判断是否读取完毕
            while(null != (tempStr=reader.readLine())){
                postData+=tempStr;
            }
            log.debug("====msg_signature===="+msgSignature+"====timestamp==="+timestamp+"====nonce==="+nonce+"====postData==="+postData);
            String suiteXml = wxcpt.DecryptMsg(msgSignature, timestamp, nonce, postData);
            log.debug("suiteXml: " + suiteXml);
            Map suiteMap = WxUtil.parseXml(suiteXml);
            log.debug("==suiteMap=="+ JSONUtils.toJSONString(suiteMap));
            if(suiteMap.get("SuiteTicket") != null) {
                String suiteTicket = (String) suiteMap.get("SuiteTicket");
                CacheData.put(WeChatConstants.SUITE_TICKET, suiteTicket);
                log.debug("====SuiteTicket=====" + suiteTicket);
            } else if(suiteMap.get("AuthCode") != null){
                String authCode = (String) suiteMap.get("AuthCode");
                log.debug("doPostValid->AuthCode:" + authCode);
                //根据authcode获取企业永久授权码
                weChatService.getPermanentCode(authCode);
                CacheData.put(WeChatConstants.AUTH_CODE, authCode);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "success";
    }
}
```

pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <!--<parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.6.5</version>
        <relativePath/>

    </parent>-->
    <parent>
        <groupId>org.example</groupId>
        <artifactId>third-wechat</artifactId>
        <version>1.0-SNAPSHOT</version>
    </parent>

    <groupId>com.wechat</groupId>
    <artifactId>wechat</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>wechat</name>
    <description>wechat</description>
    <properties>
        <java.version>1.8</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.2.2</version>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.dom4j</groupId>
            <artifactId>dom4j</artifactId>
            <version>2.0.0</version>
        </dependency>

        <dependency>
            <groupId>commons-codec</groupId>
            <artifactId>commons-codec</artifactId>
            <version>1.9</version>
        </dependency>

        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
            <version>3.10</version>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.16</version>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>1.2.4</version>
        </dependency>
        <dependency>
            <groupId>io.swagger</groupId>
            <artifactId>swagger-annotations</artifactId>
            <version>1.5.24</version>
        </dependency>

        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
            <version>5.7.5</version>
        </dependency>

        <dependency>
            <groupId>org.aspectj</groupId>
            <artifactId>aspectjrt</artifactId>
            <version>1.9.6</version>
        </dependency>

    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```

logback.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration scan="true" scanPeriod="60 seconds" debug="false">
    <!-- 日志存放路径 -->
	<property name="log.path" value="logs/wechat" />
   <!-- 日志输出格式 -->
	<property name="log.pattern" value="%d{HH:mm:ss.SSS} [%thread] %-5level %logger{20} - [%method,%line] - %msg%n" />

    <!-- 控制台输出 -->
	<appender name="console" class="ch.qos.logback.core.ConsoleAppender">
		<encoder>
			<pattern>${log.pattern}</pattern>
		</encoder>
	</appender>

    <!-- 系统日志输出 -->
	<appender name="file_info" class="ch.qos.logback.core.rolling.RollingFileAppender">
	    <file>${log.path}/info.log</file>
        <!-- 循环政策：基于时间创建日志文件 -->
		<rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- 日志文件名格式 -->
			<fileNamePattern>${log.path}/info.%d{yyyy-MM-dd}.log</fileNamePattern>
			<!-- 日志最大的历史 60天 -->
			<maxHistory>60</maxHistory>
		</rollingPolicy>
		<encoder>
			<pattern>${log.pattern}</pattern>
		</encoder>
		<filter class="ch.qos.logback.classic.filter.LevelFilter">
            <!-- 过滤的级别 -->
            <level>INFO</level>
            <!-- 匹配时的操作：接收（记录） -->
            <onMatch>ACCEPT</onMatch>
            <!-- 不匹配时的操作：拒绝（不记录） -->
            <onMismatch>DENY</onMismatch>
        </filter>
	</appender>

    <appender name="file_error" class="ch.qos.logback.core.rolling.RollingFileAppender">
	    <file>${log.path}/error.log</file>
        <!-- 循环政策：基于时间创建日志文件 -->
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- 日志文件名格式 -->
            <fileNamePattern>${log.path}/error.%d{yyyy-MM-dd}.log</fileNamePattern>
			<!-- 日志最大的历史 60天 -->
			<maxHistory>60</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>${log.pattern}</pattern>
        </encoder>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <!-- 过滤的级别 -->
            <level>ERROR</level>
			<!-- 匹配时的操作：接收（记录） -->
            <onMatch>ACCEPT</onMatch>
			<!-- 不匹配时的操作：拒绝（不记录） -->
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <!-- 系统模块日志级别控制  -->
	<logger name="com.wechat" level="debug" />
	<!-- Spring日志级别控制  -->
	<logger name="org.springframework" level="warn" />

	<!--<root level="info">
		<appender-ref ref="console" />
	</root>-->

    <root level="debug">
        <appender-ref ref="console" />
    </root>
	
	<!--系统操作日志-->
    <root level="info">
        <appender-ref ref="file_info" />
        <appender-ref ref="file_error" />
    </root>
</configuration>
```

### 4、验证

以上代码编写完成后，就可以打包到环境上面进行测试验证：

①：echostr验证

![image-20240921093148718](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921093149.png)

![image-20240921093210826](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921093211.png)

返回结果：返回 echostr，并显示已验证

```
16:11:46.940 [http-nio-9205-exec-7] INFO  c.q.w.s.c.SystemController - [doGetValid,94] - doGetCallback->echostr: 577115934236344259
16:11:46.969 [http-nio-9205-exec-3] INFO  c.q.w.s.c.SystemController - [doGetValid,94] - doGetCallback->echostr: 5267604771365158379
```

②：刷新Ticket：获取Ticket有两种方式，一是点击**按钮**获取，二是企业微信**每15分钟**会调用回调接口获取一次

![image-20240921093254675](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921093255.png)

点击“刷新Ticket” 会弹出如下图，然后点击确定

![image-20240921093308047](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921093309.png)

Ticket 有效期为30分钟；**建议把Ticket放到数据库或者redis中**

![image-20240921093339447](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921093340.png)

③：获取auth_code

安装第三方应用的时候，会获取auth_code

![image-20240921093408654](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921093409.png)

④：安装测试流程

![image-20240921093426043](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921093426.png)

![image-20240921093437427](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921093438.png)

通过企业微信扫码进行安装:

![image-20240921093454935](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921093456.png)

![image-20240921093504898](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921093505.png)

上面就是验证通过，及获取Ticket和auth_code.

### 5、总结

在第三方应用开发中，主要围绕三种类型的access_token

**provider_access_token：服务商的token**

**suite_access_token：获取第三方应用凭证**

**access_token：授权方（企业）access_token**

通过上面的代码及配置，我们获取到了suiteTicket和auth_code。

接下来我们要通过这些值获取到上面token。



## 3.4 获取3个token

### 前言

上一节已获取**suite_ticket和auth_code**两个重要参数。

下面获取企业微信第三方应用的**三种token**方式。

| **类型**                                | **描述**                                                     | **使用场景**                       |
| --------------------------------------- | ------------------------------------------------------------ | ---------------------------------- |
| 获取服务商凭证**provider_access_token** | 服务商的corpid，服务商的secret，在服务商管理后台可见，获取服务商凭证provider_access_token | 用于登录授权等                     |
| 第三方应用**suite_access_token**        | suite_id（第三方应用ID，以ww或wx开头应用id）、suite_secret（应用secret）、suite_ticket（企业微信后台推送的ticket）来获取 suite_access_token，第三方应用access_token | 用于获取第三方应用的预授权码等信息 |
| 授权方（企业）**access_token**          | 企业安装第三方应用后通过授权方corpid，永久授权码permanent_code获取 | 用于获取通讯录信息等               |

### 获取TOKEN

![image-20240921094003402](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921094004.png)

上面图是获取三种token所需要的参数

1、获取服务商凭证**provider_access_token**

**WeChatThirdTokenController:**

```java
package com.wechat.controller;

import com.wechat.service.IWeChatThirdTokenService;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 第三方应用操作
 *
 * @author: wx
 * @date: 2022/4/1
 */
@Slf4j
@RestController
@RequestMapping(value = "wechatToken")
public class WeChatThirdTokenController {

    @Autowired
    private IWeChatThirdTokenService weChatThirdTokenService;


    /**
     * 获取第三方应用凭证
     */
    @ApiOperation(value = "获取第三方应用凭证")
    @PostMapping(value = "getSuiteToken")
    public void getSuiteToken(){
        //获取第三方应用凭证
        weChatThirdTokenService.getSuiteToken();
    }

    /**
     * 服务商的token
     */
    @ApiOperation(value = "服务商的token")
    @PostMapping(value = "getProviderToken")
    public void getProviderToken(){
        //服务商的token
        weChatThirdTokenService.getProviderToken();
    }

    /**
     * 获取企业凭证
     */
    @ApiOperation(value = "获取企业凭证")
    @PostMapping(value = "getCorpToken")
    public void getCorpToken(){
        weChatThirdTokenService.getCorpToken();
    }
}
```

**IWeChatThirdTokenService:**

```java
package com.wechat.service;

/**
 * 获取token
 */
public interface IWeChatThirdTokenService {

    /**
     * 获取第三方应用凭证
     */
    void getSuiteToken();

    /**
     * 服务商的token
     */
    void getProviderToken();

    /**
     * 获取企业凭证
     */
    void getCorpToken();
}
```

接口实现类**WeChatThirdTokenServiceImpl:**

```java
package com.wechat.service.impl;

import cn.hutool.http.ContentType;
import cn.hutool.http.HttpRequest;
import cn.hutool.json.JSONUtil;
import com.alibaba.druid.support.json.JSONUtils;
import com.wechat.common.StringUtils;
import com.wechat.common.WeChatConstants;
import com.wechat.common.WeChatUtils;
import com.wechat.common.cache.CacheData;
import com.wechat.entity.wechat.WeChatProviderAccessToken;
import com.wechat.entity.wechat.WeChatReturn;
import com.wechat.entity.wechat.WeChatSuiteReturn;
import com.wechat.service.IWeChatThirdTokenService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 获取token
 */
@Slf4j
@Service
public class WeChatThirdTokenServiceImpl implements IWeChatThirdTokenService {

    /**
     * 获取第三方应用凭证
     */
    @Override
    public void getSuiteToken() {
        // 获取第三方应用凭证url
        String suiteTokenUrl = WeChatUtils.THIRD_BUS_WECHAT_SUITE_TOKEN;
        // 	第三方应用access_token
        String suiteToken = "";
        try {
            Map<String,Object> map = new HashMap<>();
            //以ww或wx开头应用id
            map.put("suite_id", WeChatConstants.SUITE_ID);
            //应用secret
            map.put("suite_secret", WeChatConstants.SUITE_SECRET);
            //企业微信后台推送的ticket
            map.put("suite_ticket", CacheData.get(WeChatConstants.SUITE_TICKET));
            log.debug("getSuiteToken获取第三方应用凭证url入参:"+ JSONUtil.toJsonStr(map));
            String body = HttpRequest.post(suiteTokenUrl).body(JSONUtil.toJsonStr(map), ContentType.JSON.getValue()).execute().body();
            log.debug("getSuiteToken获取第三方应用凭证出参:"+JSONUtil.toJsonStr(body));
            WeChatSuiteReturn weChat = JSONUtil.toBean(body, WeChatSuiteReturn.class);
            log.debug("getSuiteToken获取第三方应用凭证出参转换成bea:"+JSONUtil.toJsonStr(weChat));
            if(weChat.getErrcode() == null || weChat.getErrcode() == 0){
                suiteToken = weChat.getSuite_access_token();
                CacheData.put(WeChatConstants.SUITE_TOKEN, suiteToken);
            }
            // 打印消息
            log.debug("获取suite token成功:"+suiteToken);
        } catch (Exception e) {
            log.debug("获取suite token失败errcode:"+suiteToken);
            throw new RuntimeException();
        }
    }

    /**
     * 服务商的token
     */
    @Override
    public void getProviderToken() {
        // 服务商的secret，在服务商管理后台可见
        String providerSecret = WeChatConstants.PROVIDER_SECRET;
        // 服务商的corpid
        String corpId = WeChatConstants.CORP_ID;
        // 获取服务商的tokenurl
        String providerTokenUrl = WeChatUtils.THIRD_BUS_WECHAT_GET_PROVIDER_TOKEN;
        String providerAccessToken = null;
        try {
            Map<String, Object> map = new HashMap<>();
            map.put("corpid", corpId);
            map.put("provider_secret", providerSecret);
            log.debug("getProviderToken入参:"+ JSONUtils.toJSONString(map));
            String body = HttpRequest.post(providerTokenUrl).body(JSONUtil.toJsonStr(map), ContentType.JSON.getValue()).execute().body();
            log.debug("getProviderToken出参"+body);
            WeChatProviderAccessToken weChat = JSONUtil.toBean(body, WeChatProviderAccessToken.class);
            if(weChat.getErrcode() == null || weChat.getErrcode() == 0){
                providerAccessToken = weChat.getProvider_access_token();
                CacheData.put("PROVIDER_ACCESS_TOKEN",providerAccessToken);
            }
            // 打印消息
            log.debug("获取providerAccessTokenn成功:"+ providerAccessToken);
        } catch (Exception e) {
            log.error("获取providerAccessToken失败:"+ providerAccessToken);
            throw new RuntimeException();
        }
    }

    /**
     * 如果企业凭证到期后
     * 根据授权方corpid，企业永久码获取获取企业凭证
     */
    @Override
    public void getCorpToken() {
        log.debug("获取企业凭证getCorpToken==========start============");
        //永久码
        String permanentCode =  (String)CacheData.get(WeChatConstants.PERMANENT_CODE);
        //第三方应用access_token
        String suiteAccessToken = (String) CacheData.get(WeChatConstants.SUITE_TOKEN);
        //应用企业corpid
        String authCorpId = (String)CacheData.get(WeChatConstants.AUTH_CORPID);
        //获取企业凭证
        String corpTokenUrl = WeChatUtils.THIRD_BUS_WECHAT_GET_CORP_TOKEN;
        corpTokenUrl = corpTokenUrl.replace("SUITE_ACCESS_TOKEN", suiteAccessToken);
        //授权方（企业）access_token
        String accessToken = null;
        try {
            Map<String, Object> map = new HashMap<>();
            //授权方corpid
            map.put("auth_corpid", authCorpId);
            //永久授权码
            map.put("permanent_code", permanentCode);
            log.debug("获取企业凭证 getCorpToken 入参："+suiteAccessToken+"==map："+JSONUtils.toJSONString(map));
            String body = HttpRequest.post(corpTokenUrl).body(JSONUtil.toJsonStr(map), ContentType.JSON.getValue()).execute().body();
            WeChatReturn weChat = JSONUtil.toBean(body, WeChatReturn.class);
            log.debug("获取企业凭证 getCorpToken 出参转换成bean=="+JSONUtil.toJsonStr(weChat));
            accessToken = weChat.getAccess_token();
            CacheData.put(WeChatConstants.ACCESS_TOKEN,accessToken);
            CacheData.put(WeChatConstants.AUTH_CORPID,authCorpId);
            //打印消息
            log.debug("获取accessToken成功:" + accessToken);
        } catch (Exception e) {
            log.debug("获取paccessToken失败:" + accessToken);
            throw new RuntimeException();
        }
        log.debug("获取企业凭证getCorpToken==========end============");
    }
}
```

验证：

getSuiteToken：

![image-20240921094157949](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921094159.png)

getProviderToken：

![image-20240921094216342](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921094217.png)

getCorpToken：

![image-20240921094236214](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921094237.png)

总结

企业微信三方开发的三个重要token已经成功获取!



## 3.5 实现登录及获取用户信息

**前言**

企业微信第三方应用登录有两种方式**网页授权登录和扫码授权登录**：[官网文档详解](https://developer.work.weixin.qq.com/document/path/91124)

**登录操作，需要与前端进行合作开发，我这边只有写了后端的开发流程及代码**

### 一、扫码授权登录

1、扫码授权登录需要进入**服务商后台->应用管理->登录授权**配置我们发起授权的域名

2、需要用到的参数

![image-20240921094404949](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921094405.png)

3、用户进入登录授权页后，需要确认并同意将自己的企业微信和登录账号信息授权给企业或服务商，完成授权流程

4、授权后回调URI，得到授权码和过期时间，授权流程完成后，会进入回调URI，并在URL参数中返回授权码，跳转地址

5、获取登录用户信息

### 二、网页授权登录

1、构造网页授权链接

2、所需要用到的参数

![image-20240921094610538](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921094611.png)

3、获取访问用户身份

扫码授权登录和网页授权登录之后，获取访问用户的身份需用用到一个入参code，这个入参**code需要前端给出**（点击登录按钮，访问OAuth2网页授权链接获取微信授权code【前端处理】）

### 三、开始开发

控制层：WeChatThirdController

```java
package com.wechat.controller;

import com.wechat.entity.wechat.WeChatLoginUrl;
import com.wechat.entity.wechat.WeChatUserinfo3rd;
import com.wechat.entity.wechat.WechatUserInfo;
import com.wechat.service.IWeChatService;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 第三方应用操作
 *
 * @author: wx
 * @date: 2022/4/1
 */
@Slf4j
@RestController
@RequestMapping(value = "wechat")
public class WeChatThirdController {

    @Autowired
    private IWeChatService weChatService;


    /**
     * 获取扫码登录地址
     */
    @ApiOperation(value = "获取扫码登录地址")
    @PostMapping(value = "login")
    public WeChatLoginUrl login(){
        //获取扫码登录地址
        return weChatService.thirdLoginUrl();
    }

    /**
     * 企业微信内登录地址
     */
    @ApiOperation(value = "企业微信内登录")
    @PostMapping(value = "wechatLogin")
    public WeChatLoginUrl wechatLogin(){
        //获取企业微信内登录地址
        return weChatService.wechatLoginUrl();
    }

    /**
     * 前端回调->扫码授权登录-获取访问用户身份
     */
    @ApiOperation(value = "获取访问用户身份")
    @PostMapping(value = "getUserInfo")
    public WechatUserInfo getUserInfo(String code){
        //获取访问用户身份
        return weChatService.getUserInfo(code);
    }

    /**
     * 前端回调->网页授权登录-获取访问用户身份
     */
    @ApiOperation(value = "获取访问用户身份")
    @PostMapping(value = "getUserinfo3rd")
    public WeChatUserinfo3rd getUserinfo3rd(String code){
        //获取访问用户身份
        return weChatService.getUserinfo3rd(code);
    }
}
```

服务层：IWeChatService

```java
package com.wechat.service;

import com.wechat.entity.wechat.WeChatLoginUrl;
import com.wechat.entity.wechat.WeChatUserinfo3rd;
import com.wechat.entity.wechat.WechatUserInfo;

/**
 * 第三方应用服务层
 */
public interface IWeChatService {
    /**
     * 获取企业永久码
     */
    void getPermanentCode(String authCode);

    /**
     * 扫码登录-获取用户信息
     */
    WechatUserInfo getUserInfo(String code);

    /**
     * 网页授权登录-获取用户信息
     */
    WeChatUserinfo3rd getUserinfo3rd(String code);

    /**
     * 获取扫码登录地址
     */
    WeChatLoginUrl thirdLoginUrl();

    /**
     * 获取企业微信内登录地址
     */
    WeChatLoginUrl wechatLoginUrl();
}
```

服务实现层impl：WeChatServiceImpl

```java
package com.wechat.service.impl;

import cn.hutool.http.ContentType;
import cn.hutool.http.HttpRequest;
import cn.hutool.json.JSONUtil;
import com.wechat.common.WeChatConstants;
import com.wechat.common.WeChatUtils;
import com.wechat.common.cache.CacheData;
import com.wechat.entity.wechat.WeChatLoginUrl;
import com.wechat.entity.wechat.WeChatPermanentCodeReturn;
import com.wechat.entity.wechat.WeChatUserinfo3rd;
import com.wechat.entity.wechat.WechatUserInfo;
import com.wechat.service.IWeChatService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

/**
 * 第三方应用服务层
 */
@Slf4j
@Service
public class WeChatServiceImpl implements IWeChatService {

    /**
     * 构造扫码登录链接
     */
    @Override
    public WeChatLoginUrl thirdLoginUrl() {
        WeChatLoginUrl login = new WeChatLoginUrl();
        // 企业微信的CorpID
        String corpId = WeChatConstants.CORP_ID;
        // 重定向url
        String redirectUrl = WeChatConstants.REDIRECT_URL;
        log.debug("登录地址url:"+redirectUrl+"企业微信corpId->"+corpId);
        // 重定向地址
        String redirectUri = "";
        try {
            redirectUri = URLEncoder.encode((redirectUrl), "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
        // 获取扫码登录链接
        String getWechatLogin = WeChatUtils.THIRD_BUS_WECHAT_LOGIN;
        // 转换成登录地址
        String loginUrl = getWechatLogin.replace(WeChatConstants.CORP_ID, corpId).replace(WeChatConstants.REDIRECT_URI,redirectUri);
        login.setLoginUrl(loginUrl);
        log.debug("重定向后登录地址url:"+login);
        return login;
    }

    /**
     * 构造企业微信内登录链接
     */
    @Override
    public WeChatLoginUrl wechatLoginUrl() {
        log.debug("wechatLogin->start");
        WeChatLoginUrl login = new WeChatLoginUrl();
        // 	第三方应用id（即ww或wx开头的suite_id）。
        String suiteId = WeChatConstants.SUITE_ID;
        // 重定向地址
        String redirectUrl = WeChatConstants.REDIRECT_URL;
        log.debug("suiteId:"+suiteId+"==redirectUrl:"+redirectUrl);
        // 重定向地址
        try {
            redirectUrl = URLEncoder.encode(redirectUrl, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
        //第三方 构造网页授权链接
        String getWechatLogin = WeChatUtils.THIRD_BUS_WECHAT_AUTHORIZE_URL;
        // 转换成登录地址
        String loginUrl = getWechatLogin.replace(WeChatConstants.APP_ID, suiteId).replace(WeChatConstants.REDIRECT_URI,redirectUrl);
        login.setLoginUrl(loginUrl);
        log.debug("企业微信内登录重定向url:"+loginUrl);
        return login;
    }

    /**
     * 获取企业永久码
     */
    @Override
    public void getPermanentCode(String authCode) {
        // 永久授权码
        log.debug("获取企业永久授权码->getPermanentCode->start");
        // 	第三方应用access_token
        String suiteToken = (String)CacheData.get("SUITE_TOKEN");
        // 获取企业永久授权码url
        String accessTokenUrl = WeChatUtils.THIRD_BUS_WECHAT_ACCESS_TOKEN;
        // 替换值
        accessTokenUrl = accessTokenUrl.replace("SUITE_ACCESS_TOKEN", suiteToken);
        try {
            Map<String, Object> map = new HashMap<>();
            map.put("auth_code", authCode);
            log.debug("获取企业永久授权码accessTokenUrl:"+accessTokenUrl+"->auth_code:"+authCode);
            String body = HttpRequest.post(accessTokenUrl).body(JSONUtil.toJsonStr(map), ContentType.JSON.getValue()).execute().body();
            WeChatPermanentCodeReturn weChat = JSONUtil.toBean(body, WeChatPermanentCodeReturn.class);
            log.debug("获取企业永久授权码转换成bean->weChat:"+weChat);
            //授权方（企业）access_token
            String accessToken = weChat.getAccess_token();
            //授权方企业微信id
            String corpId = weChat.getAuth_corp_info().getCorpid();
            //授权方企业微信名称
            String corpName = weChat.getAuth_corp_info().getCorp_name();
            //授权方应用id
            Long agentId = weChat.getAuth_info().getAgent().get(0).getAgentid();
            //用户id
            String userId = weChat.getAuth_user_info().getUserid();
            //企业永久授权码
            String permanentCode = weChat.getPermanent_code();
            //存放到cache中
            CacheData.put(WeChatConstants.ACCESS_TOKEN, accessToken);
            //授权方企业微信id
            CacheData.put(WeChatConstants.AUTH_CORPID, corpId);
            //授权方企业微信名称
            CacheData.put(WeChatConstants.CORP_NAME, corpName);
            //授权方应用id
            CacheData.put(WeChatConstants.AGENT_ID, agentId);
            //用户id
            CacheData.put(WeChatConstants.USER_ID, userId);
            //获取企业永久授权码
            CacheData.put(WeChatConstants.PERMANENT_CODE, permanentCode);
            log.debug("获取企业永久授权码->PERMANENT_CODE:"+permanentCode);
        } catch (Exception e) {
            log.debug("获取accessToken失败errcode");
            throw new RuntimeException();
        }
        log.debug("获取企业永久授权码->getPermanentCode->end");
    }

    /**
     * 获取用户信息
     */
    @Override
    public WechatUserInfo getUserInfo(String code) {
        // 	授权登录服务商的网站时，使用应用提供商的provider_access_toke
        String providerSccessToken = (String) CacheData.get(WeChatConstants. PROVIDER_ACCESS_TOKEN);
        // 获取扫码登录链接url
        String getUserInfo = WeChatUtils.THIRD_BUS_WECHAT_GET_LOGIN_INFO;
        // 获取登录用户信息
        String getUserInfoUrl = getUserInfo.replace(WeChatConstants.PROVIDER_ACCESS_TOKEN, providerSccessToken);
        log.debug("getUserInfo->获取登录用户信息Url->"+getUserInfoUrl);
        // 使用http请求调用
        Map<String, Object> mapCode = new HashMap<>();
        mapCode.put("auth_code", code);
        String body = HttpRequest.post(getUserInfoUrl).body(JSONUtil.toJsonStr(mapCode), ContentType.JSON.getValue()).execute().body();
        WechatUserInfo userInfo = null;
        String userId = "";
        try {
            // 获取用户信息
            userInfo = JSONUtil.toBean(body, WechatUserInfo.class);
            log.debug("getUserInfo->获取用户信息转换成bean:"+JSONUtil.toJsonStr(userInfo));
            if(userInfo.getErrcode() == null || userInfo.getErrcode() == 0){
                // 用户id
                userId = userInfo.getUser_info().getUserid();
                userInfo.setUserId(userId);
            } else{
                throw new RuntimeException(userInfo.getErrmsg());
            }
            log.debug("获取访问用户身份成功");
        } catch (Exception e) {
            log.debug("获取访问用户身份失败");
            throw new RuntimeException(userInfo.getErrmsg());
        }
        log.debug("getUserInfo->end->userInfo:"+JSONUtil.toJsonStr(userInfo));
        return userInfo;
    }

    /**
     * 网页授权登录-获取用户信息
     */
    @Override
    public WeChatUserinfo3rd getUserinfo3rd(String code) {
        //授权登录服务商的网站时，第三方应用access_token
        String suiteToken = (String) CacheData.get(WeChatConstants.SUITE_TOKEN);
        // 获取扫码登录链接url
        String getUserinfo3rdUrl = WeChatUtils.THIRD_BUS_WECHAT_GET_USER_INFO;
        // 替换
        getUserinfo3rdUrl = getUserinfo3rdUrl.replace(WeChatConstants.SUITE_TOKEN, suiteToken).replace(WeChatConstants.CODE, code);
        log.debug("获取访问用户身份url:"+getUserinfo3rdUrl);
        // 使用http请求调用
        String body = HttpRequest.get(getUserinfo3rdUrl).execute().body();
        WeChatUserinfo3rd userInfo = null;
        String userId = "";
        try {
            // 取部门列表信息
            userInfo = JSONUtil.toBean(body, WeChatUserinfo3rd.class);
            log.debug("获取访问用户身份userInfo转换成bean:"+JSONUtil.toJsonStr(userInfo));
            if(userInfo.getErrcode() == null || userInfo.getErrcode() == 0){
                // 用户id
                userId = userInfo.getUserId();
                userInfo.setUserId(userId);
            } else{
                throw new RuntimeException(userInfo.getErrmsg());
            }
            String success = String.format("获取访问用户身份成功", userId ,userInfo.getErrcode());
            log.debug(success);
        } catch (Exception e) {
            String error = String.format("获取访问用户身份失败", userInfo.getErrcode() ,userInfo.getErrmsg());
            log.debug(error);
            throw new RuntimeException(userInfo.getErrmsg());
        }
        log.debug("getUserinfo3rd->end:"+JSONUtil.toJsonStr(userInfo));
        return userInfo;
    }
}
```

实体类：WechatUserInfo

```java
package com.wechat.entity.wechat;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 获取访问用户身份返回值
 *
 * @author: wx
 * @date: 2021/12/31
 */
@NoArgsConstructor
@Data
public class WechatUserInfo {
    private Integer errcode;
    private String errmsg;
    private String userId;
    private UserInfo user_info;
    private CorpInfo corp_info;
    private Integer status;

    public static class UserInfo{
        private String userid;
        private String open_userid;
        private String name;

        public String getUserid() {
            return userid;
        }

        public void setUserid(String userid) {
            this.userid = userid;
        }

        public String getOpen_userid() {
            return open_userid;
        }

        public void setOpen_userid(String open_userid) {
            this.open_userid = open_userid;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    public static class CorpInfo{
        private String corpid;

        public String getCorpid() {
            return corpid;
        }

        public void setCorpid(String corpid) {
            this.corpid = corpid;
        }
    }
}
```

实体类：WeChatUserinfo3rd

```java
package com.wechat.entity.wechat;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 获取访问用户身份
 * 网页登录
 *
 * @author: wx
 * @date: 2022/2/23
 */
@NoArgsConstructor
@Data
public class WeChatUserinfo3rd {
    private Integer errcode;
    private String errmsg;
    private String CorpId;
    private String UserId;
    private String DeviceId;
    private String user_ticket;
    private String open_userid;
    private Integer status;
}
```

实体类：WeChatLoginUrl

```java
package com.wechat.entity.wechat;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 登录url地址
 *
 * @author: wx
 * @date: 2022/2/21
 */
@NoArgsConstructor
@Data
public class WeChatLoginUrl {
    private String loginUrl;
}
```

验证：

1、扫码方式

![image-20240921094849270](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921094850.png)

![image-20240921094901784](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921094902.png)

用企业微信扫码登录成功后，会回调用户信息接口，如下图：

![image-20240921094921007](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921094921.png)

2、网页方式

![image-20240921094941634](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921094942.png)

![image-20240921094952889](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921094953.png)

**总结**

以上就是实现登录和获取用户信息的功能！

1、企业微信第三方应用如何配置

2、api接口如何调用

3、如何获取三种token

4、实现两种登录方式

5、获取用户信息

上面五个内容完成了基础的企业微信第三方应用的开发，后面可以根据实际业务去调用企业微信第三方应用的api，方式同上面类似。

GitHub源码地址：https://github.com/18606199546/third-wechat/

Gitee源码地址：https://gitee.com/allenxiao/third-wechat



## 3.6 接口调用许可应用

**前言：企业微信服务商收费模式已于2022年5月16日调整为接口调用许可**

此文档是基于接口调用许可应用讲解

企业微信官网描述

![image-20240921095244860](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921095245.png)

### 一、安装测试

1、首先我们先安装配置企业微信第三方应用

2、开发的时候，需要对第三方应用进行安装测试，根据提示一步一步操作即可安装成功，如下图

![image-20240921095542820](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921095543.png)

![image-20240921095555606](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921095556.png)

安装成功后，会在列表中展示当前你所给某个企业安装的应用信息

3、安装成功后，在**“测试企业配置”**，添加刚刚所添加的测试企业

![image-20240921095614711](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921095615.png)



![image-20240921095627241](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921095628.png)

4、以上配置操作完成后，就可以对这个企业进行开发测试

### 二、购买接口许可

1、购买接口许可

![image-20240921095913137](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921095914.png)

2、购买

![image-20240921095931148](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921095932.png)

3、测试企业开通“基础账号”，“互通账号”是不收费的，只有上线的时候，开通才会收费

4、点击“提交订单”，会得到购买的接口调用许可账号，点击“导出账号”，即可得到“帐号激活码”，入下图

![image-20240921095953783](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921095954.png)

![image-20240921100009758](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921100010.png)

### 三、激活帐号

```json
API:https://qyapi.weixin.qq.com/cgi-bin/license/active_account?provider_access_token=ACCESS_TOKEN
入参：
{
	"active_code" : "XXXXXXXX",
	"corpid": "CORPID",
	"userid": "USERID"
}
出参：
{
    "errcode": "0",
    "errmsg": ok
}
```

* **provider_access_token**：应用服务商的接口调用凭证

* **active_code**：帐号激活码,刚刚导出的Excel里面有

* **corpid**：待绑定激活的成员所属企业corpid，只支持加密的corpid（corpid：在安装的时候已经保存到数据库或者缓存中，可在数据库或者缓存中查找）

* **userid**：待绑定激活的企业成员userid 。只支持加密的userid（userid：在安装的时候已经保存到数据库或者缓存中，可在数据库或者缓存中查找）

postman测试结果：

![image-20240921100136465](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921100137.png)

### 四、测试登录

账号激活成功后，就可以在企业微信登录第三方应用了，入下图

![image-20240921100205256](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921100206.png)



### 五、接口调用许可官方收费说明

![image-20240921100334848](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921100336.png)



## 3.7 权限与白名单

### 一、应用权限

根据需要配置所需要的权限：

![image-20240921100643093](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921100644.png)

### 二、白名单配置

![image-20240921100832176](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240921100833.png)





#             附1： 验证第三方应用api接入调用流程

![企微第三方应用接口设计与数据流程思维导图](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240927103158.png)

```json
①刷新ticket凭证： 服务商管理后台应用中【刷新ticket】（手动，线上10分钟自动）
SuiteTicket=====UaL6DLn8BLaeXB66bdggjysABAizgiAxWnQDpne4yJeaY6LnjQqWklSMXZIsr4PW

②获取第三方应用凭证token: /webtenant/wechatToken/getSuiteToken
{"suite_access_token":"xxx","expires_in":7200}


③获取与授权码：
curl https://qyapi.weixin.qq.com/cgi-bin/service/get_pre_auth_code?suite_access_token=xxx
{
    "errcode": 0,
    "errmsg": "ok",
    "pre_auth_code": "xxx",
    "expires_in": 3600
}

④设置授权配置：https://developer.work.weixin.qq.com/document/path/90602
接口: https://qyapi.weixin.qq.com/cgi-bin/service/set_session_info
入参是：suite_access_token  和 pre_auth_code  和 应用认证类型auth_type
{
	"pre_auth_code":"xxx",
	"session_info":
	{
		"auth_type":1  //官方枚举: 1-测试应用, 0-正式应用
	}
}
返回：
{
    "errcode": 0,
    "errmsg": "ok"
}

⑤拼接第三方应用安装地址，拿临时授权码：
https://open.work.weixin.qq.com/3rdapp/install?suite_id=xxx&pre_auth_code=xxx&redirect_uri=https%3a%2f%2fwww.xxx.com&state=STATE
用户（也就是默认的管理员）操作安装应用（注意：不要从企业微信打开，要贴到浏览器中访问！！！）
重定向后拿到 auth_code：
https://www.xxx.com/?auth_code=xxx&state=STATE&expires_in=1200#/login?redirect=%2Findex

⑥临时授权码获取企业永久授权码：https://developer.work.weixin.qq.com/document/path/90603?vid=1688856032541916&deviceid=e2a3bb57-08a5-4960-8c0b-620acd3041b5&version=4.1.28.6010&platform=win

https://qyapi.weixin.qq.com/cgi-bin/service/get_permanent_code?suite_access_token=xxx
{
	"auth_code": "xxx"
}
返回值：
{
    "access_token": "xxx",
    "expires_in": 7200,
    "permanent_code": "xxx",
    "auth_corp_info": {
        "corpid": "xxx",
        "corp_name": "测试企业",
        "corp_type": "verified",
        "corp_round_logo_url": "xxx",
        "corp_square_logo_url": "xxx",
        "corp_user_max": 1000,
        "corp_wxqrcode": "xxx",
        "corp_full_name": "测试企业",
        "subject_type": 1,
        "verified_end_time": 1749375120,
        "corp_scale": "501-1000人",
        "corp_industry": "教育",
        "corp_sub_industry": "培训机构",
        "location": ""
    },
    "auth_info": {
        "agent": [
            {
                "agentid": xxx,
                "name": "测试应用",
                "square_logo_url": "xxx",
                "privilege": {
                    "level": 1,
                    "allow_party": [
                        131
                    ],
                    "allow_user": [
                        "JiangYuan"
                    ],
                    "allow_tag": [],
                    "extra_party": [],
                    "extra_user": [],
                    "extra_tag": []
                },
                "auth_mode": 0,
                "is_customized_app": false
            }
        ]
    },
    "auth_user_info": {
        "userid": "JiangYuan",
        "name": "woSRCpDQAAjYP5YMX2RpCcOdCDv9d3hg",
        "avatar": "https://xxx.png",
        "open_userid": "xxx"
    },
    "edition_info": {
        "agent": [
            {
                "agentid": xxx,
                "edition_id": "xxx",
                "edition_name": "基础版",
                "app_status": 1,
                "user_limit": 888,
                "expired_time": 999,
                "is_virtual_version": false
            }
        ]
    }
}

⑦获取企业凭证access_token: https://developer.work.weixin.qq.com/document/path/90605
接口: https://qyapi.weixin.qq.com/cgi-bin/service/get_corp_token
入参： suite_access_token
 {
 	"auth_corpid": "xxx",
 	"permanent_code": "xxx"
 }
 
 返回：
 {
    "access_token": "xxx",
    "expires_in": 7200
}

⑧应用内自动登录的用户授权地址拼接（此时的appid为第三方应用的suiteId）：
https://open.weixin.qq.com/connect/oauth2/authorize?appid=xxx&redirect_uri=https%3a%2f%2fwww.xxx.com&response_type=code&scope=snsapi_privateinfo&state=STATE#wechat_redirect
用户同意：
https://www.xxx.com/?code=xxx&state=STATE#/login?redirect=%2Findex

code: xxx


⑨获取用户信息：
接口文档: https://developer.work.weixin.qq.com/document/path/91121
{
    "errcode": 0,
    "errmsg": "ok",
    "corpid": "xxx",
    "userid": "JiangYuan",
    "user_ticket": "xxx",
    "expires_in": 1800,
    "parents": [],
    "open_userid": "xxx"
}

接口文档: https://developer.work.weixin.qq.com/document/path/91122
{
    "errcode": 0,
    "errmsg": "ok",
    "corpid": "xxx",
    "userid": "JiangYuan",
    "name": "JiangYuan",
    "department": [
        131
    ],
    "gender": "1",
    "avatar": "xxx",
    "qr_code": "xxx",
    "open_userid": "xxx"
}
```



# 附2：接口逻辑代码实现

回调中处理业务逻辑。

```java
回调：
GET  /corpWx/callback/getData
POST /corpWx/callback/getData
自动登录：
POST  /qyWeChat/getUserInfoByCode
POST  /login （通过企业微信 userid 自动登录返回token）
```

