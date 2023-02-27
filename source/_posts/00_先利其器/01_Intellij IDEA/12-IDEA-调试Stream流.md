---
title: 12-IDEA-调试Stream流
date: 2021-02-27 16:01:22
tags: 
- IDEA
- SpringBoot
- 开发
categories:
- 00_先利其器
- 01_Intellij IDEA
---



java的stream编程给调试带来了极大的不便，idea 推出了streamtrace功能，可以详细看到每一步操作的关系、结果，非常方便进行调试。

### 初遇StreamTrace

这里简单将字符串转成它的字符数，并设置断点开启debug模式。

![image-20230227160535945](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230227160537.png)

如上图所示，可以看到每一步操作的元素个数、操作的结果、元素转换前后的对应关，非常清晰明了；还可以查看具体的对象内容。



### 使用StreamTrace

StreamTrace只有在debug模式下才能使用，当在Stream代码上设置断点后，启动debug，点击流按钮，如图所示。

![image-20230227160547020](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230227160548.png)

点击后，默认Split 模式显示。

![image-20230227160605536](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230227160606.png)

可以点击左下方按钮切换到 FlatMode 模式，当然也可以再切换回去。

![image-20230227160619492](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230227160620.png)

### 实战演示

这里演示一段字符转长度并过滤长度小于5的stream操作：

```java
@Test
public void TestTrace() {
    Stream.of("beijing","tianjin","shanghai","wuhan")
        .map(String::length)
        .filter(e->e>5)
        .collect(Collectors.toList());
}
```

![image-20230227160830021](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230227160831.png)