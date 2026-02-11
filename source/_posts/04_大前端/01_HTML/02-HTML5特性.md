---
title: 02-HTML5特性
date: 2017-4-28 22:23:58
tags:
- HTML
- HTML5
- 基础
categories: 
- 04_大前端
- 01_HTML
---

![image-20251125100829463](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251125100838.png)



> HTML5 草案在 2008年发布，2013年正式发布 HTML5 版本是 HTML5.1。

## HTML5 语法

![image-20251128165926672](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251128165928.png)



## HTML5 新增语义化标签

![image-20251128170344285](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251128170345.png)



## 案例：语义化标签

![image-20251128170759436](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251128170801.png)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        html,body{
            height: 100%;
        }
        header,footer{
            height: 50px;
            line-height: 50px;
            text-align: center;
            background: orange;
        }
        section{
            height: calc(100% - 100px);
        }
        nav,aside{
            width: 100px;
            height: 100%;
            background: #ccc;
            float: left;
        }
        main{
            width: calc(100% - 200px);
            height: 100%;
            float: left;
        }
        aside p{
            font-size: 12px;
            color: white;
        }
        main .article1{
            height: 60%;
        }
        main .article2{
            height: 40%;
        }
    </style>
</head>
<body>
    <!-- 头 -->
    <header>header</header>
    <!-- 内容 -->
    <section>
        <!-- 导航 -->
        <nav>
            <!-- 独立流内容 -->
            <figure>nav</figure>
            <ul>
                <li>link1</li>
                <li>link2</li>
                <li>link3</li>
            </ul>
        </nav>
        <!-- 主体 -->
        <main>
            <!-- 文章 -->
            <article class="article1">
                <header>article-header</header>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam odio error dolores quia, quibusdam officiis facere. Dicta saepe explicabo a perspiciatis dolores nostrum adipisci, esse quaerat voluptas impedit molestiae voluptatum?</p>
                <footer>article-footer</footer>
            </article>
            <!-- 文章 -->
            <article class="article2">
                <header>article-header</header>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam odio error dolores quia, quibusdam officiis facere. Dicta saepe explicabo a perspiciatis dolores nostrum adipisci, esse quaerat voluptas impedit molestiae voluptatum?</p>
                <footer>article-footer</footer>
            </article>
        </main>
        <!-- 侧边 -->
        <aside>
            <figure>aside</figure>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, beatae quos! Distinctio corporis commodi placeat iste magni, consequatur error provident. Eum soluta suscipit commodi laboriosam. Itaque animi consequuntur impedit numquam!</p>
        </aside>
    </section>
    <!-- 脚 -->
    <footer>footer</footer>
</body>
</html>
```



## HTML5 音视频标签

`audio`标签，定义音频

```html
<audio src="audio.mp3">Audio音频</audio>
```

`video`标签，定义视频

```html
<video src="movie.mp4" controls="controls">Video视频</video>
```

* **controls**，如果出现该属性，则向用户展示空间，比如播放按钮
* **autoplay**，如果出现该属性，则视频在就绪后马上播放（video在配合muted时才会每次刷新都自动播放）
* **loop**，重复播放属性
* **muted**，静音属性
* **poster**，规则视频正在下载时显示的图像，知道用户点击播放按钮



```html
<audio src="./FirstSnow.mp3" controls loop autoplay muted></audio>
```

效果：

![image-20251128173800998](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251128173802.png)

```html
    <style>
        video{
            height: 300px;
            width: 200px;
        }
    </style>

<video src="./video.mp4" controls loop autoplay muted poster="./poster.jpg"></video>
```

![image-20251128174633097](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251128174634.png)



## HTML5 增强表单

### 1) input增强的type

input 增强 type 属性可取的值：

* **color**，生成一个颜色选择的表单
* **tel**，唤起拨号盘表单（手机端适用）
* **search**，产生搜索意义的表单
* **range**，产生一个滑动条表单
* **number**，产生一个数值表单
* **email**，限制用户必须输入email类型
* **url**，限制用户必须输入url类型
* **date**，限制用户必须输入日期
* **month**，限制用户必须输入月
* **week**，限制用户必须输入周
* **time**，限制用户必须输入时间
* **datetime-local**，选取本地时间



示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form action="GET">
        <div>
            颜色：<input type="color" name="color">
        </div>
        <div>
            邮箱：<input type="email" name="email">
        </div>
        <div>
            URL完整地址：<input type="url" name="url">
        </div>
        <div>
            <!-- 手机端适用 -->
            电话：<input type="tel" name="tel">
        </div>
        <div>
            <!-- 支持范围区间修改，默认值修改，步长修改 -->
            滑块：<input type="range" name="range" min="100" max="200" value="100" step="10">
        </div>
        <div>
            <!-- 支持范围区间修改，默认值修改，步长修改 -->
            数字：<input type="number" name="number" min="0" max="10" value="4" step="2">
        </div>
        <div>
            <!-- 比输入框多了一个 x 快速清除按钮 -->
            搜索：<input type="search" name="search">
        </div>
        <div>
            日期选择：<input type="date" name="date">
            月份选择：<input type="month" name="month">
            周数选择：<input type="week" name="week">
            时间选择：<input type="datetime-local" name="datetime">
        </div>
        
        <input type="submit">
    </form>
</body>
</html>
```

效果：

![image-20251128180609064](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251128180610.png)



### 2) 增强表单属性

* **autofocus**，给文本框、选择框、或者按钮空间加上该属性，当打开页面时，该控件`自动获得光标焦点，一个页面只能有一个`

* **required**，校验输入`不能为空`

* **multiple**，可以输入`一个或多个值，每个值之间用英文逗号分开`，如应用于 email 或 file 均可

  ```html
  如: <input type="email" multiple>
  ```

* **pattern**，将属性值设为某个格式的正则表达式，在提交时会检查其内容是否符合给定格式

  ```html
  <input pattern="[0-9][A-Z]{3}" placeholder="输入内容：一个数与三个大写字母">
  ```



示例：

```html
    <form>
        <div>
            用户名：<input type="text" name="text" autofocus required pattern="[0-9][A-Z]{3}">
        </div>
        <div>
            邮箱：<input type="email" name="email" required multiple>
        </div>

        <input type="submit">
    </form>
```

![image-20251128182315518](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251128182316.png)





## HTML5 选项列表

`datalist` > `option` 并且通过input进行list关联，才能正常展示，且`支持模糊搜索`。

```html
    <!-- 关联 datalit 中 id=mylist 的列表内容 -->
    <input type="text" list="mylist">
    
    <datalist id="mylist">
        <option value="手机"></option>
        <option value="手表"></option>
        <option value="手环"></option>
        <option value="手链"></option>
        <option value="手镯"></option>
    </datalist>
```

![image-20251128181035195](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251128181036.png)

![image-20251128181046230](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20251128181047.png)





























