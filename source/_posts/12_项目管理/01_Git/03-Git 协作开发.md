---
title: 03-Git 协作开发
date: 2018-5-25 22:18:03
tags:
- Git
categories: 
- 12_项目管理
- 01_Git
---

![image-20200616223337238](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200616223339.png)

### 分支规范

|               分支名称               |  生命周期   |          功能          |
| :----------------------------------: | :---------: | :--------------------: |
|                master                |    长期     |  主分支、生产环境版本  |
|               develop                |    长期     |       开发、联调       |
|               release                |    长期     |          测试          |
| hotfix/jiangyuan/new-hotfix@20220422 |    临时     |        bug修复         |
|                 pre                  | 长期 / 临时 | 预上线、解决多版本冲突 |
| feature/jiangyuan/new-task@20220422  |    临时     |       新业务开发       |

### 单 feature 分支开发流程

![image-20230530202749419](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230530202750.png)

### 多 feature 分支开发流程

![image-20230530202854373](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230530202855.png)



> 整体流程：
>
> Git 公共仓库账号 → 邀请协作伙伴 → 协作伙伴都同意。
>
> Git 公共仓库账号 → 搭好项目架子上传 → `Git链接` → 作为基础代码可以被 被邀请者 pull(拉) 到本地。
>
> Git 公共仓库账号 → 创建 dev 分支 → push 远程仓库（即上传，此时 dev 分支代码同 master 代码）
>
> 协作者 → IDEA登陆 Git → 打开`Git链接` → Fork到自己仓库 → IDEA创建以自己仓库链接为源码的项目
>
> 协作者 → 更新代码 → Add → Commit → Commit Message(必填)
>
> 协作者 → dev分支 → Push 推送 → 页面操作创建 pull request
>
> Git 公共仓库账号 → 收到新的 pull request → review 代码没问题(相当于过了测试阶段) → Merge(默认合并到主分支)



### 1. 添加协作伙伴

> 添加协作伙伴有更高的权限，可以直接 pull request 到 主公共仓库 的 master分支上，且可直接 merge。
>
> 故：多人协作开发时，此步 `添加协作伙伴 可跳过。`

先注册一个公共 Git 账号，创建公共仓库，用于存放代码、更新项目代码。

该公共仓库所属账号，邀请所有协作伙伴，伙伴均同意成为伙伴。

![image-20200713195041226](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713195042.png)

![image-20200713195222104](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713195223.png)

![image-20200713195259380](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713195300.png)

邮件里点击按钮，进入页面直接同意邀请即可。

![image-20200713195348069](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713195349.png)





### 2. IDEA-Git 操作

公共仓库账号需要操作的是：将基础架子代码上传。名称不变，描述信息要写。

* 推主分支上一份 基础的架子 代码。

![image-20200713201048787](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713201050.png)

![image-20200713201129040](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713201130.png)

![image-20200713201348356](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713201349.png)



* 创建 dev 分支

![image-20200713202524457](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713202525.png)

Ctrl + Shift + `

>> Git >> 操作分支，将 dev 分支推到远程仓库。

![image-20200713202841629](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713202842.png)

远程仓库中可以看到 dev 分支代码（截止目前 dev 和 master 主分支代码相同）。

![image-20200713203030154](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713203031.png)



### 3. 被邀请的协作者操作

* 准备工作：需要协作开发的人员在 IDEA 中登陆自己的 Git 账号。

其他所有被邀请者登陆自己的账号，登陆之后才能进行相关的 pull(拉) 和 push(推) 代码的操作，切记不能使用 公共仓库的账号直接推库（会影响所有被邀请者的本地代码提交->冲突）。

![image-20200713200643684](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713200645.png)

* 打开公共仓库的 git 地址，Fork 一份到自己仓库中

![image-20200713205135196](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713205136.png)

* 然后使用自己仓库中 fork 下来的代码的 git 路径创建工程

![image-20200720151357146](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200720151400.png)

![image-20200720151443268](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200720151444.png)

* 右下角，切换到 dev 分支，进行代码更新和上库

![image-20200713204615352](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713204616.png)

![image-20200713204638220](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713204639.png)



* 更新上库步骤三步走：**Add**(添加到暂存库) → **Commit**(提交到本地仓库) → **Push**(推送的远程仓库)

`要求：必须填写 commit message！不填不予合并！`

![image-20200713205446918](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713205448.png)

![image-20200713205707122](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713205708.png)

分支推送才算真正的推送成功：`遇到 TimeOut 超时错误提示，不用怕，网络问题，继续 Push即可。`

![image-20200713205821000](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713205822.png)

![image-20200713205802739](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713205803.png)

![image-20200713210155223](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713210157.png)

> 看到上面这句，恭喜你，已经推送到 分支 成功了！

* 然后，提交 pull request （才能被 公共仓库 账号合并到主分支，测试、发布上线）

![image-20200713210336602](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713210338.png)

如果看不到 Compare & pull request 按钮的提示，那么做如下操作也是一样：

![image-20200713212251506](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713212252.png)

![image-20200713210348400](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713210349.png)



### 4. 公共仓库账号合并代码

#### 4.1 子分支合并到主分支

收到新的 pull request(1)

![image-20200713210435088](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713210436.png)



![image-20200713210619833](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713210620.png)



![image-20200713212654846](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713212655.png)

![image-20200713212715779](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713212717.png)



![image-20200713210652493](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713210653.png)

![image-20200713210715174](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713210716.png)

#### 4.2 主分支同步到子分支

```sh
git checkout dev
git merge master
git push origin dev
```



### 5. (测过OK)将 dev 分支合并到 master 主分支

公共仓库账号需要的操作：

![image-20200713213544437](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713213545.png)

![image-20200713213603838](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713213604.png)



![image-20200713213626643](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713213627.png)

![image-20200713213649836](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713213651.png)



![image-20200713213725598](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713213726.png)

继续 Merge 即可。

![image-20200713213737265](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713213738.png)



### 6. 最高频坑：代码冲突

项目组 n 个人共同协作开发公司项目，项目的代码版本从 01 版本开始迭代。（01是什么意思？如图）

![image-20200714001144030](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200714001145.png)

第一天，A B C 三个程序猿一大早就从Git链接创建了工程，开始写自己部分的代码。

假定 A 写登陆注册、B写购物车、C写列表页详情页等，都是写后台 API 接口

早上拉下来的代码，大家都是一样的 01 版本(即 commit id，非项目自定义版本号)。

临近下班时，A 写完了自己的功能，add→commit→push了代码，测试测过了，主管 merge 了代码，此时 Git 的版本号即 commit id 已经变为了 02 了。

那么问题来了：`B 和 C 的代码是基于早上拉下来的 01 写的，B与C不论谁再次提交都会冲突且无法提交！`

解决办法：

[**B写好的代码 1份**]  → 合并 → [**git clone xxx.git 为 02 版本的代码一份**]

Beyond Compare 代码对比工具，将 B 写好的代码合并到基于 02 版本(与库上一致)后，通过 git bash 命令行进行 Push 操作。

（B提交后，dev 分支版本变为 03，然后 C 需要重复 B 的操作，基于 03 开始合代码提交，`这是必然且必须的`）

![image-20200713235928806](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200713235930.png)

Beyond Compare(坡懈无限30天)

链接：https://pan.baidu.com/s/1MTBlQ0SYYfvLhfNB3pSkug 
提取码：alrs

```sh
# git config --global user.name "xxx"
# git config --global user.email "xxx"
git add filename  # 【添加】到暂存库（==内存）
git commit -m "commit message"  # 【提交】到本地仓库（==硬盘）
git push origin dev  # 【推送】到远程 dev 分支（==远端服务器）
```

![image-20200714000811832](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200714000813.png)

GitHub 提 pull request，公共仓库账号查看并合并 pull request 里的代码到 dev，测试拉取 dev 分支最新代码进行测试，测试OK后，公共仓库账号再将 dev 直接合并到 master，作为正式版本发布上线。



### 7. 同步 fork远程地址代码

> 自己账号仓库下主要操作哪个分支，就从 主仓库 中同步代码到该分支上即可。
>
> 一般情况下，
>
> * `同步代码到自己账号仓库下为：my仓库 master ← fork仓库 master`
> * `代码提交到远端公共仓库上位：fork仓库 dev ← my仓库 master`

![image-20200718095809788](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200718095812.png)

### 8. 开源项目多人协作流程

![github开源项目多人协作流程示意图](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200718223609.png)