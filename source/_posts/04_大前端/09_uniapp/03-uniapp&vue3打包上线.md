---
title: 03-uniapp&vue3打包上线
date: 2022-5-22 21:36:21
tags:
- uniapp
- vue3
categories: 
- 04_大前端
- 09_uniapp
---



![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260204182332703.png)

参考：

* uni-app 官网：https://www.dcloud.io/
* uni-app 条件编译：https://uniapp.dcloud.net.cn/tutorial/platform.html
* HBuild X 开发工具：https://hx.dcloud.net.cn/

## 1. 打包&上线

### 1.1 微信小程序

微信开放平台：https://mp.weixin.qq.com/

#### ① 小程序后台配置

`首页` -> `小程序信息`：

* **基本信息**：配置名称、头像、介绍、服务类目、认证信息、管局备案等
* **账号信息**：AppId - 微信开发者工具需要
* **隐私与安全**：按需勾选
* **服务内容声明**：按需配置

`管理` -> `开发管理`：

* **服务器域名**【`重要`】：必须要配置，用于 api 接口请求的安全域名
* 涉及支付则需要配置 AppSecret 小程序密钥



#### ② manifest.json 配置

HBuilderX 的项目中根目录下 manifest.json 中配置：

* 微信小程序 AppID
* ☑上传代码时自动压缩

> 关掉 **微信开发者工具** 运行的项目预览，然后再通过 发行 菜单打包。

打包步骤：

* 【`发行`】 -> 【`小程序-微信`】 -> 会重新打开 **微信开发者工具** 去编译和运行预览项目

打包生成目录：/unpackage/dist/build/mp-weixin



#### ③ 微信开发者工具上传

点击【`上传`】

> 上传时会提示主包尺寸限制 (不包合插件) 应小于 `1.5M`，因此需要注意处理 分包 和 静态资源上传 处理。

#### ④ 小程序后台审核

【`管理`】-> 【`版本管理`】 -> 【`开发版本`】 -> 【`提交审核`】，然后填写信息进行提交审核。

> 审核周期：快则2-3h，慢则2-3天。

审核通过后：

【管理】-> 【版本管理】 -> 【开发版本】 -> 【`发布版本`】



### 1.2 抖音小程序

抖音开放平台：https://developer.open-douyin.com/

#### ① 创建小程序

创建小程序不支持个人，需要使用企业身份。

按照流程进行申请 和 配置即可。

* 自定义导航 权限：需要单独申请才可以，位置【能力】->【互动能力】->【容器界面】->【自定义导航栏】，需要条件且时间预计5个工作日。

* 基础设置：基本信息、服务分类、logo 等，与 微信小程序 类同
* 【开发】->【开发配置】->【域名管理】



#### ② manifest.json 配置

HBuilderX 的项目中根目录下 manifest.json 中配置：

* 抖音小程序 AppID
* ☑上传代码时自动压缩

> 关掉 **微信开发者工具** 运行的项目预览，然后再通过 发行 菜单打包。

打包步骤：

* 【`发行`】 -> 【`小程序-抖音`】 -> 会重新打开 **抖音开发者工具** 去编译和运行预览项目

打包生成目录：/unpackage/dist/build/mp-toutiao



#### ③ 抖音开发者工具上传

【开发】->【版本管理】



#### ④ 小程序后台审核

【开发】->【版本管理】 提交审核，上线即可。



### 1.3 H5页面

#### ① manifest.json 配置

项目根目录 manifest.json 中配置 【`Web配置`】

* 页面标题
* 路由模式
* 运行的基础路径，建议直接配置为 `/h5/` （因为最终打包生成的目录也是 h5 则无需修改）
* 启用 https 协议

> 如果有跨域问题，则需要单独去处理下跨域。



#### ② HBuilderX发行

【`发行`】->【`网站 PC Web或手机H5`】->【`发行`】

打包生成目录：/unpackage/dist/build/h5

```txt
assets/
static/
index.html
```



#### ③ 上传到服务器

单独购买服务器 或者 unicloud 有免费的静态 web 托管可以申请。

上传到服务器，配置 nginx 即可访问，基本能力，不做赘述。

如 unicloud 中的话：【服务空间】 -> 【前端网页托管】 -> 【上传到当前目录】 -> 参数配置，使用 默认域名 + /h5/index.html 进行临时访问。

如果出现跨域，则需要把 默认域名 配置到 【跨域配置】 中。



### 1.4 安卓APP

真机运行：https://uniapp.dcloud.net.cn/tutorial/run/run-app.html

模拟器运行：

* 模拟器安装：https://uniapp.dcloud.net.cn/tutorial/run/installSimulator.html
* 设置CPU类型：https://uniapp.dcloud.net.cn/tutorial/app-android-abifilters.html

#### ① manifest.json 配置

* **基础配置**：应用名称、应用版本名称(如1.0.1)、应用版本号（如101）
  * 版本名称与版本号注意，如果版本名称为 1.0.1，则版本号必须是 101，没有 . 分隔
* **App图标配置**：自动生成图标（选择一张图标的图，点击`自动生成所有图标并替换`，则所有规格大小图标都有了）
* **App启动界面配置**：默认与小程序一样，隐私协议需要开启（如小米应用商店必须）
* **App模块管理**：按需
* **App权限管理**：按需
* **App常用其他设置**：注意 【支持CPU类型】 需要勾选 `X86` 来支持模拟器的运行。





#### ② 运行到手机或模拟器

需要使用手机通过 USB `连接`到开发工具的PC电脑，同时手机需要打开开发者选项中的 `USB调试`，然后（当然也可以选择模拟器，如 *逍遥模拟器* ）

1. 【运行】->【运行到手机或模拟器】->【`制作自定义基座`】（*注意：HBuilderX需要账号绑定 手机号 才能打包*）
2. 【运行】->【运行到手机或模拟器】->【运行到Android App基座】->【☑使用自定义基座运行】->刷新，选择 ip

![image-20260208134036472](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260208134037796.png)



#### ③ 打包发行

【`发行`】->【`原生App-云打包`】

菜单中其他不变，只需要勾选打正式包：![image-20260208134645206](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260208134646751.png)

打包完成后会生成一个下载地址：该临时地址只能下载 5 次，所以需要将 `.apk 文件保存到本地`，上传到 `OSS` 服务器中，再生成`二维码`供用户下载。



#### ④ apk 升级

app升级整包更新和热更新支持vue3 支持打开安卓、苹果市场，wgt静默更新：https://ext.dcloud.net.cn/plugin?id=7286

```json
data:{
    describe: '<p>1、修复已知问题</p> <p>2、优化用户体验</p>', 
    edition_url: '最新包路径', //apk、wgt包下载地址或者应用市场地址  安卓应用市场 market://details?id=xxxx 苹果store itms-apps://itunes.apple.com/cn/app/xxxxxx
    edition_force: 1, //是否强制更新 0代表否 1代表是
    package_type: 1, //0是整包升级（apk或者appstore或者安卓应用市场） 1是wgt升级
    edition_issue: 1, //是否发行  0否 1是 为了控制上架应用市场审核时不能弹出热更新框
    edition_number: 提供值, //100 版本号 最重要的manifest里的版本号 （检查更新主要以服务器返回的edition_number版本号是否大于当前app的版本号来实现是否更新）
    edition_name:'提供值',//1.0.0 版本名称 manifest里的版本名称
    edition_silence: 0, // 是否静默更新 0代表否 1代表是
}
```



后端接口 api：

```java
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;

@Data
@ApiModel("APP热更新参数")
public class AppHotAo implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 品牌名称，如xiaomi、apple、huawei
     */
    @ApiModelProperty("品牌名称")
    private String brandName;

    /**
     * 平台：1-安卓（默认），2-ios
     */
    @ApiModelProperty("平台（可选）：1-安卓（默认），2-ios")
    private Integer platform = 1;

    /**
     * 打包时manifest设置的版本号：100（默认）
     */
    @ApiModelProperty("版本号：100（默认）")
    private Integer versionCode = 100;
}
```

```java
import cn.hutool.core.util.ObjUtil;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.common.core.domain.entity.SysDictData;
import com.ruoyi.common.core.redis.RedisCache;
import com.ruoyi.system.service.ISysDictDataService;
import com.ruoyi.web.domain.ao.AppHotAo;
import com.ruoyi.web.domain.vo.AppHotResVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * APP Controller
 *
 * @author ruoyi
 */
@Api(tags = "APP接口")
@RestController
@RequestMapping("/app")
@RequiredArgsConstructor
@Slf4j
@SuppressWarnings("all")
public class AppController extends BaseController {
    /**
     * 热更新版本
     */
    private static final String APP_HOT_UPDATE_KEY = "APP:HOT_UPDATE_DATA";
    /**
     * 当前在线版本
     */
    private static final String APP_CURRENT_ONLINE_KEY = "APP:HOT_UPDATE_DATA:CURRENT_ONLINE";
    /**
     * 默认包路径
     */
    public static final String APK_DEFAULT_URL = "https://jcwxsaas.obs.cn-north-4.myhuaweicloud.com/apk/jiechujiaoyu.apk";
    /**
     * wgt 默认 URL 前缀
     */
    public static final String WGT_DEFAULT_URL_PREFIX = "https://jcwxsaas.obs.cn-north-4.myhuaweicloud.com/apk/wgt/__UNI__8356014_";
    /**
     * dict 类型
     */
    public static final String DICT_TYPE = "app_brand_market_url";
    /**
     * 包名称
     */
    public static final String PACKAGE_NAME = "com.jiechujiaoyu";
    /**
     * 默认 dict 数据
     */
    public static final String DEFAULT_DICT_DATA = "yingyongbao";

    private final RedisCache redisCache;

    private final ISysDictDataService sysDictDataService;

    @Value("${spring.profiles.active}")
    private String envStr;


    /**
     * 获取APP热更新版本
     * <br>
     * 参考文档：https://doc.weixin.qq.com/doc/w3_AdwAfAblAG8M0QrkyQjREiKmD52d7?scode=AEkAEAepAA0Ol3ES3lAdwAfAblAG8
     *
     * @param appHotAo 应用热更新参数 AO
     * @return {@link R }<{@link AppHotResVo }>
     * @author Jerry(姜源)
     * @date 2025/05/30
     */
    @ApiOperation("获取APP热更新版本")
    @PostMapping(value = "/newest")
    public R<AppHotResVo> appGetNewest(@RequestBody AppHotAo appHotAo) {
        //默认值
        AppHotResVo vo = buildDefaultAppHotResVo();
        //此key为主key，可手动更改做wgt热更新使用
        Object obj = redisCache.getCacheObject(APP_HOT_UPDATE_KEY);
        if (ObjUtil.isNotNull(obj)) {
            vo = (AppHotResVo) obj;
        } else {
            //初始值
            redisCache.setCacheObject(APP_HOT_UPDATE_KEY, vo);
        }

        vo.setEditionIssue(1);
        Integer hotUpdate = vo.getHotUpdate();
        //热更新版本
        if (hotUpdate == 1) {
            //废弃：仅内部员工可见
            //Boolean interior = Optional.ofNullable(SecurityUtils.getLoginUser()).map(LoginUser::getInterior).orElse(false);
            //目前没有真正意义的A/B测试，因此 hotUpdate = 1 时即强制走热更新
            Boolean interior = true;
            if (interior) {
                //强制走热更新
                if (vo.getEditionUrl().endsWith(".wgt")) {
                    vo.setPackageType(hotUpdate);
                    redisCache.setCacheObject(APP_HOT_UPDATE_KEY, vo);
                } else {
                    log.error("内部员工热更新仅支持wgt格式的包路径");
                    return R.error("内部员工热更新仅支持wgt格式的包路径 editionUrl！");
                }
            } else {
                //外部用户无需更新，接口返回最近的公测版本
                Object objCurrent = redisCache.getCacheObject(APP_CURRENT_ONLINE_KEY);
                if (ObjUtil.isNotNull(objCurrent)) {
                    vo = (AppHotResVo) objCurrent;
                    return R.success(vo);
                } else {
                    //初始值
                    redisCache.setCacheObject(APP_CURRENT_ONLINE_KEY, vo);
                }
            }
        } else {
            //应用市场更新版本
            //此时vo为最后一个热更新版本对象，作为公测版本缓存使用，但还需覆盖 editionUrl 和 packageType 字段
            SysDictData data = sysDictDataService.selectDictDataByLabel(DICT_TYPE, appHotAo.getBrandName());
            if (ObjUtil.isNotEmpty(data)) {
                //应用市场整包更新
                vo.setPackageType(hotUpdate);
                vo.setEditionUrl(data.getDictValue() + PACKAGE_NAME);
                redisCache.setCacheObject(APP_CURRENT_ONLINE_KEY, vo);
            } else {
                //废弃：使用应用宝作为默认跳转更新市场 - 有学员下载觉得麻烦
                //data = sysDictDataService.selectDictDataByLabel(DICT_TYPE, DEFAULT_DICT_DATA);
                //走热更新方式，即原需应用宝下载的现在热更新升级
                vo.setPackageType(1);
                String url = WGT_DEFAULT_URL_PREFIX + vo.getEditionNumber();
                if ("pre".equals(envStr)) {
                    url += "_pre";
                }
                vo.setEditionUrl(url + ".wgt");
                redisCache.setCacheObject(APP_HOT_UPDATE_KEY, vo);
            }

        }
        return R.success(vo);
    }

    private AppHotResVo buildDefaultAppHotResVo() {
        AppHotResVo appHotResVo = new AppHotResVo();
        appHotResVo.setDescribe("<p>1、修复已知问题</p> <p>2、优化用户体验</p>");
        appHotResVo.setEditionUrl(APK_DEFAULT_URL);
        appHotResVo.setEditionForce(1);
        appHotResVo.setPackageType(1);
        appHotResVo.setEditionIssue(1);
        appHotResVo.setEditionNumber(100);
        appHotResVo.setEditionName("1.0.0");
        appHotResVo.setEditionSilence(0);
        //默认走热更新
        appHotResVo.setHotUpdate(1);
        return appHotResVo;
    }
}
```

> 此 api 逻辑判断有后台配置数据的逻辑，可以去除。
>
> 热更新的数据内容缓存在 redis 中，手动修改新的版本号以支持版本更新。
>
> ```json
> {
>     "@type": "com.ruoyi.web.domain.vo.AppHotResVo",
>     "describe": "<p>1、修复已知问题</p> <p>2、优化用户体验</p>",       //修改项
>     "editionForce": 1,
>     "editionIssue": 1,
>     "editionName": "1.0.0",   //版本号修改项，与前端协商一致
>     "editionNumber": 100,     //版本号修改项，与前端协商一致
>     "editionSilence": 0,
>     "editionUrl": "https://obs地址/apk/wgt/__UNI__8356014_104.wgt", //.wgt文件
>     下载的云存储url
>     "packageType": 1
> }
> ```
>
> ![image-20260208141817415](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260208141818900.png)



