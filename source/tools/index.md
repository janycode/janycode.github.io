---
title: 自用工具
date: 2016-10-20 02:36:08
layout: tools
---

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>全栈工程师 - 自用工具库</title>
    <!-- 引入字体图标 -->
    <link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* 唯一命名空间 - 确保样式仅作用于工具库内部 */
        #tool-library-container * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        /* 全局主题 - 浅色科技风调整 (作用域隔离) */
        #tool-library-container {
            --bg-primary: #f8f9fa;
            --bg-secondary: #ffffff;
            --bg-tertiary: #f0f4f8;
            --text-primary: #2d3748;
            --text-secondary: #718096;
            --accent-green: #00b894;
            --accent-orange: #e67e22;
            --accent-blue: #0984e3;
            --border-color: #dee2e6;
            --shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            --transition: all 0.3s ease;
            background-color: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
            padding: 20px;
            background-image: 
                linear-gradient(rgba(248, 249, 250, 0.95), rgba(248, 249, 250, 0.95)),
                url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23cbd5e0' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        /* 容器 (作用域隔离) */
        #tool-library-container .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        /* 头部样式 (作用域隔离) */
        #tool-library-container .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--border-color);
        }
        #tool-library-container .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            background: linear-gradient(90deg, var(--accent-green), var(--accent-blue));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            letter-spacing: 2px;
        }
        #tool-library-container .header .subtitle {
            color: var(--text-secondary);
            font-size: 1rem;
        }
        /* ASCII图片悬浮效果 (作用域隔离) */
        #tool-library-container .ascii-link {
            display: inline-block;
            margin: 20px 0;
            color: var(--accent-orange);
            text-decoration: none;
            font-size: 1.1rem;
            transition: var(--transition);
        }
        #tool-library-container .ascii-link:hover {
            color: var(--accent-green);
            transform: translateX(5px);
        }
        #tool-library-container #asciiImg {
            display: none;
            position: absolute;
            z-index: 100;
            background-color: var(--bg-secondary);
            padding: 10px;
            border-radius: 8px;
            box-shadow: var(--shadow);
            border: 1px solid var(--border-color);
        }
        #tool-library-container #asciiImg img {
            max-height: 300px;
            border-radius: 4px;
        }
        /* 分类卡片样式 (作用域隔离) */
        #tool-library-container .category-card {
            background-color: var(--bg-secondary);
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: var(--shadow);
            overflow: hidden;
            transition: var(--transition);
        }
        #tool-library-container .category-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }
        /* 分类标题 (作用域隔离) */
        #tool-library-container .category-header {
            background-color: var(--bg-tertiary);
            padding: 15px 20px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-left: 4px solid var(--accent-green);
        }
        #tool-library-container .category-header h2 {
            font-size: 1.3rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        #tool-library-container .category-header h2 i {
            color: var(--accent-green);
        }
        #tool-library-container .category-header .toggle-icon {
            color: var(--text-secondary);
            transition: var(--transition);
        }
        #tool-library-container .category-header.active .toggle-icon {
            transform: rotate(180deg);
            color: var(--accent-green);
        }
        /* 分类内容 (作用域隔离) */
        #tool-library-container .category-content {
            padding: 20px;
            display: block;
        }
        #tool-library-container .category-content.collapsed {
            display: none;
        }
        /* 链接样式 (作用域隔离) */
        #tool-library-container a {
            color: var(--accent-blue);
            text-decoration: none;
            transition: var(--transition);
        }
        #tool-library-container a:hover {
            color: var(--accent-green);
            text-decoration: underline;
        }
        /* 表格样式 (作用域隔离) */
        #tool-library-container table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            background-color: var(--bg-tertiary);
            border-radius: 8px;
            overflow: hidden;
        }
        #tool-library-container th, 
        #tool-library-container td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }
        #tool-library-container th {
            background-color: var(--bg-secondary);
            color: var(--accent-green);
            font-weight: 600;
            position: relative;
        }
        #tool-library-container th::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 40px;
            height: 2px;
            /*background-color: var(--accent-green);*/
        }
        #tool-library-container tr:last-child td {
            border-bottom: none;
        }
        #tool-library-container tr:hover {
            background-color: rgba(224, 231, 255, 0.5);
        }
        /* 高亮文本 (作用域隔离) */
        #tool-library-container .highlight-orange {
            color: var(--accent-orange);
            font-weight: 600;
        }
        #tool-library-container .highlight-green {
            color: var(--accent-green);
            font-weight: 600;
        }
        /* iframe样式 (作用域隔离) */
        #tool-library-container iframe {
            width: 100%;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            margin: 20px 0;
        }
        /* 响应式调整 (作用域隔离) */
        @media (max-width: 992px) {
            #tool-library-container .container {
                padding: 10px;
            }
            #tool-library-container .header h1 {
                font-size: 2rem;
            }
        }
        @media (max-width: 768px) {
            #tool-library-container table, 
            #tool-library-container thead, 
            #tool-library-container tbody, 
            #tool-library-container th, 
            #tool-library-container td, 
            #tool-library-container tr {
                display: block;
            }
            #tool-library-container thead tr {
                position: absolute;
                top: -9999px;
                left: -9999px;
            }
            #tool-library-container tr {
                margin-bottom: 15px;
                border: 1px solid var(--border-color);
                border-radius: 8px;
            }
            #tool-library-container td {
                border: none;
                position: relative;
                padding-left: 50%;
            }
            #tool-library-container td::before {
                position: absolute;
                top: 12px;
                left: 12px;
                width: 45%;
                padding-right: 10px;
                white-space: nowrap;
                content: attr(data-label);
                font-weight: bold;
                color: var(--accent-green);
            }
        }
        @media (max-width: 576px) {
            #tool-library-container {
                padding: 10px;
            }
            #tool-library-container .header h1 {
                font-size: 1.8rem;
            }
            #tool-library-container .category-header h2 {
                font-size: 1.1rem;
            }
            #tool-library-container td, 
            #tool-library-container th {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <!-- 核心改动：添加唯一ID作为样式作用域 -->
    <div id="tool-library-container">
        <div class="container">
            <!-- 头部 -->
            <div class="header">
                <h1>工欲善其事，必先利其器</h1>
                <p class="subtitle">全栈工程师的工具集 | 持续更新</p>
                <!-- ASCII图片悬浮链接 -->
                <a href="javascript:void(0)" id="asciiLink">
                    <i class="fas fa-code"></i> ASCII码字符(图)
                </a>
                <div id="asciiImg" style="display:none;height:50px;back-ground:#f00;position:absolute;">
                    <img src="https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/image-20200523091606519.png" alt="ASCII码字符图">
                </div>
            </div>
            <!-- Java文档分类 -->
            <div class="category-card">
                <div class="category-header" data-target="java-docs">
                    <h2><i class="fab fa-java"></i> Java文档</h2>
                    <i class="fas fa-chevron-down toggle-icon"></i>
                </div>
                <div id="java-docs" class="category-content">
                    <p>Java SE API 官方文档： 
                        <a href="https://tool.oschina.net/apidocs/apidoc?api=jdk-zh">1.6中文</a> | 
                        <a href="https://docs.oracle.com/javase/7/docs/api/index.html">1.7英文</a> | 
                        <a href="https://www.matools.com/api/java8">1.8中文</a> | 
                        <a href="https://docs.oracle.com/javase/8/docs/api/index.html">1.8 英文</a>
                    </p>
                    <br>
                    <p>Java EE API 官方文档： 
                        <a href="https://docs.oracle.com/javaee/7/api/toc.htm">1.7英文</a> | 
                        <a href="https://javaee.github.io/javaee-spec/javadocs/">1.8英文</a>
                    </p>
                </div>
            </div>
            <!-- 开发工具分类 -->
            <div class="category-card">
                <div class="category-header" data-target="dev-tools">
                    <h2><i class="fas fa-tools"></i> 开发工具</h2>
                    <i class="fas fa-chevron-down toggle-icon"></i>
                </div>
                <div id="dev-tools" class="category-content">
                    <table>
                        <thead>
                            <tr>
                                <th>类型</th>
                                <th>工具名</th>
                                <th>链接地址</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td data-label="类型">Java 环境</td>
                                <td data-label="工具名"><strong>JDK1.8</strong></td>
                                <td data-label="链接地址"><a href="https://janycode.github.io/2016/04/28/02_%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80/01_Java/01_JavaSE/01_%E5%9F%BA%E7%A1%80%E8%AF%AD%E6%B3%95/01-JDK%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA/index.html">官方下载</a></td>
                                <td data-label="备注">下载与本地环境变量配置</td>
                            </tr>
                            <tr>
                                <td data-label="类型">Tomcat 环境</td>
                                <td data-label="工具名"><strong>Tomcat</strong></td>
                                <td data-label="链接地址"><a href="http://tomcat.apache.org/">官方下载</a></td>
                                <td data-label="备注">下载解压文件夹</td>
                            </tr>
                            <tr>
                                <td data-label="类型">Maven 环境</td>
                                <td data-label="工具名"><strong>Maven</strong></td>
                                <td data-label="链接地址"><a href="https://mvnrepository.com/">官方下载</a></td>
                                <td data-label="备注">下载解压文件夹</td>
                            </tr>
                            <tr>
                                <td data-label="类型">Jmeter 压测</td>
                                <td data-label="工具名"><strong>Jmeter</strong></td>
                                <td data-label="链接地址"><a href="https://jmeter.apache.org/download_jmeter.cgi">官方下载</a></td>
                                <td data-label="备注">下载解压文件夹</td>
                            </tr>
                            <tr>
                                <td data-label="类型">Java IDE</td>
                                <td data-label="工具名"><strong>Intellij IDEA 2023.1(`new`)</strong></td>
                                <td data-label="链接地址"><a href="https://pan.baidu.com/s/1td5tmXFJUMt3obVDs2x20A?pwd=frvn">百度网盘</a></td>
                                <td data-label="备注">提取码: frvn</td>
                            </tr>
                            <tr>
                                <td data-label="类型">数据库建模</td>
                                <td data-label="工具名"><strong>PowerDesigner 16.5</strong></td>
                                <td data-label="链接地址"><a href="https://pan.baidu.com/s/1ChK0u4tS9qQQBYLUklngNQ">百度网盘</a></td>
                                <td data-label="备注">提取码: mgut</td>
                            </tr>
                            <tr>
                                <td data-label="类型">MySQL 客户端</td>
                                <td data-label="工具名"><strong>Navicat Premium 15</strong></td>
                                <td data-label="链接地址"><a href="https://pan.baidu.com/s/1nLYd8LcC4jDSFrbhxZZnfw">百度网盘</a></td>
                                <td data-label="备注">提取码: 1zmt, 候选<a href="https://dbeaver.io/download/">DBeaver</a>，都比Navicat强</td>
                            </tr>
                            <tr>
                                <td data-label="类型">Redis 客户端</td>
                                <td data-label="工具名"><strong>AnotherRedisDesktopManager</strong></td>
                                <td data-label="链接地址"><a href="https://gitee.com/qishibo/AnotherRedisDesktopManager/releases">Gitee下载</a></td>
                                <td data-label="备注">开源免费，功能比普通的强大</td>
                            </tr>
                            <tr>
                                <td data-label="类型">HTTP 接口测试</td>
                                <td data-label="工具名"><strong>Postman</strong></td>
                                <td data-label="链接地址"><a href="https://www.postman.com/downloads/">官方下载</a></td>
                                <td data-label="备注">HTTP接口测试工具, 候选 <a href="https://www.apifox.cn/">Apifox</a>/<a href="https://www.apipost.cn/">Apipost</a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- 在线工具分类 -->
            <div class="category-card">
                <div class="category-header" data-target="online-tools">
                    <h2><i class="fas fa-globe"></i> 在线工具</h2>
                    <i class="fas fa-chevron-down toggle-icon"></i>
                </div>
                <div id="online-tools" class="category-content">
                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>网站</th>
                                <th>地址</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td data-label="No.">01</td>
                                <td data-label="网站">MySQL</td>
                                <td data-label="地址">
                                    <a href="https://cdn.mysql.com//Downloads/MySQLInstaller/mysql-installer-community-5.7.28.0.msi">5.7 点击访问</a><br>
                                    <a href="https://dev.mysql.com/downloads/mysql/">8.0 点击访问</a>
                                </td>
                                <td data-label="备注">MySQL 5.7直接下载，8.0进下载页</td>
                            </tr>
                            <tr>
                                <td data-label="No.">02</td>
                                <td data-label="网站" class="highlight-orange">Maven</td>
                                <td data-label="地址"><a href="https://mvnrepository.com/">在线访问</a></td>
                                <td data-label="备注">资源库、依赖库 jar 包下载</td>
                            </tr>
                            <tr>
                                <td data-label="No.">03</td>
                                <td data-label="网站" class="highlight-orange">Tomcat</td>
                                <td data-label="地址"><a href="http://tomcat.apache.org/">点击访问</a></td>
                                <td data-label="备注">Tomcat 官网，web 服务器下载</td>
                            </tr>
                            <tr>
                                <td data-label="No.">04</td>
                                <td data-label="网站">W3school</td>
                                <td data-label="地址"><a href="https://www.w3school.com.cn/index.html">在线访问</a></td>
                                <td data-label="备注">HTML/CSS/JavaScript/XML/jQuery手册</td>
                            </tr>
                            <tr>
                                <td data-label="No.">05</td>
                                <td data-label="网站">牛客网</td>
                                <td data-label="地址"><a href="https://www.nowcoder.com/">在线访问</a></td>
                                <td data-label="备注"><code>面试题/算法题</code></td>
                            </tr>
                            <tr>
                                <td data-label="No.">06</td>
                                <td data-label="网站">在线工具集合</td>
                                <td data-label="地址">
                                    <a href="https://tool.oschina.net/">在线访问</a><br>
                                    <a href="https://www.bejson.com/">JSON转换</a>
                                </td>
                                <td data-label="备注">手册/对照表/转码/插件/JSON/加密等强大工具集<code>BEJSON</code></td>
                            </tr>
                            <tr>
                                <td data-label="No.">07</td>
                                <td data-label="网站">在线文档查询</td>
                                <td data-label="地址"><a href="https://tool.oschina.net/apidocs">点击访问</a></td>
                                <td data-label="备注">语言、框架、工具类等在线文档</td>
                            </tr>
                            <tr>
                                <td data-label="No.">08</td>
                                <td data-label="网站">Java 干货集散地</td>
                                <td data-label="地址"><a href="http://www.hollischuang.com/">点击访问</a></td>
                                <td data-label="备注">阿里首席 Java 架构师</td>
                            </tr>
                            <tr>
                                <td data-label="No.">09</td>
                                <td data-label="网站">jQuery.js</td>
                                <td data-label="地址">
                                    <a href="https://jquery.com/download/">进入 .js 下载</a><br>
                                    <a href="https://code.jquery.com/">获取官网CDN</a><br>
                                    <a href="https://www.jquery123.com/">中文文档</a>
                                </td>
                                <td data-label="备注">jquery-X.X.X.min.js 函数库下载<br>CDN 选择 minified (压缩版)的即可</td>
                            </tr>
                            <tr>
                                <td data-label="No.">10</td>
                                <td data-label="网站">Lombok 插件</td>
                                <td data-label="地址"><a href="https://projectlombok.org/download">点击访问</a></td>
                                <td data-label="备注">Intellij IDEA 减少冗余代码 Lombok 插件</td>
                            </tr>
                            <tr>
                                <td data-label="No.">11</td>
                                <td data-label="网站">Color Scheme Designer</td>
                                <td data-label="地址"><a href="http://www.peise.net/tools/web/">点击访问</a></td>
                                <td data-label="备注">Web 单色/互补色/三角色等16进制色<code>配色</code>器</td>
                            </tr>
                            <tr>
                                <td data-label="No.">12</td>
                                <td data-label="网站" class="highlight-orange">Draw.io</td>
                                <td data-label="地址"><a href="http://draw.io">点击访问</a></td>
                                <td data-label="备注">在线流程图神器, <a href="https://pan.baidu.com/s/1ULhjKkQy799dJ98Ck48DdA">本地版本</a>(提取码: q5ls)</td>
                            </tr>
                            <tr>
                                <td data-label="No.">13</td>
                                <td data-label="网站" class="highlight-orange">ProcessOn</td>
                                <td data-label="地址"><a href="https://www.processon.com/">点击访问</a></td>
                                <td data-label="备注">在线思维导图/流程图/UML类图神器，免费9个</td>
                            </tr>
                            <tr>
                                <td data-label="No.">14</td>
                                <td data-label="网站">Bootstrap</td>
                                <td data-label="地址"><a href="https://v3.bootcss.com/">点击访问</a></td>
                                <td data-label="备注">目前最受欢迎的前端框架</td>
                            </tr>
                            <tr>
                                <td data-label="No.">15</td>
                                <td data-label="网站">Bootstrap 可视化工具</td>
                                <td data-label="地址"><a href="https://www.bootcss.com/p/layoutit/">点击访问</a></td>
                                <td data-label="备注">Bootstrap 可视化布局在线编辑、生成代码</td>
                            </tr>
                            <tr>
                                <td data-label="No.">16</td>
                                <td data-label="网站">Wiki 极客学院</td>
                                <td data-label="地址"><a href="https://wiki.jikexueyuan.com/">点击访问</a></td>
                                <td data-label="备注">全免费的综合技术能力学习，资料齐全</td>
                            </tr>
                            <tr>
                                <td data-label="No.">17</td>
                                <td data-label="网站">Hexo</td>
                                <td data-label="地址"><a href="https://hexo.bootcss.com/">点击访问</a></td>
                                <td data-label="备注">博客框架官网+中文文档、API以及插件和主体</td>
                            </tr>
                            <tr>
                                <td data-label="No.">18</td>
                                <td data-label="网站">Bootstrap Validator</td>
                                <td data-label="地址">
                                    <a href="https://github.com/nghuuphuoc/bootstrapvalidator">访问官网</a><br>
                                    <a href="http://bootstrapvalidator.votintsev.ru/api/">访问文档</a>
                                </td>
                                <td data-label="备注">数据校验、表单验证，基于bootstrap、jQuery</td>
                            </tr>
                            <tr>
                                <td data-label="No.">19</td>
                                <td data-label="网站">ECharts</td>
                                <td data-label="地址"><a href="https://echarts.apache.org/zh/index.html">点击访问</a></td>
                                <td data-label="备注">百度数据可视化图表，基于 JavaScript</td>
                            </tr>
                            <tr>
                                <td data-label="No.">20</td>
                                <td data-label="网站">HTML/CSS/JS在线运行</td>
                                <td data-label="地址"><a href="http://java.jsrun.net/new">点击访问</a></td>
                                <td data-label="备注">HTML/CSS/JS在线运行工具，<code>自动提示+补全</code></td>
                            </tr>
                            <tr>
                                <td data-label="No.">21</td>
                                <td data-label="网站">Java在线运行</td>
                                <td data-label="地址"><a href="http://www.dooccn.com/java/">点击访问</a></td>
                                <td data-label="备注">Java在线运行工具，<code>自动提示+补全+支持导包</code></td>
                            </tr>
                            <tr>
                                <td data-label="No.">22</td>
                                <td data-label="网站">Regex 正则在线测试</td>
                                <td data-label="地址"><a href="http://tool.chinaz.com/regex/">点击访问</a></td>
                                <td data-label="备注"><code>正则测试</code>，常用正则，代码生成</td>
                            </tr>
                            <tr>
                                <td data-label="No.">23</td>
                                <td data-label="网站">数据结构可视化</td>
                                <td data-label="地址"><a href="https://www.cs.usfca.edu/~galles/visualization/Algorithms.html">在线访问</a></td>
                                <td data-label="备注">数据结构可视化查看，插入数据+动态过程展示</td>
                            </tr>
                            <tr>
                                <td data-label="No.">24</td>
                                <td data-label="网站">MySQL数据库在线建模</td>
                                <td data-label="地址"><a href="https://dbdiagram.io/d">在线访问</a></td>
                                <td data-label="备注"><code>数据库在线建模</code>，独立的语法，导出.sql脚本</td>
                            </tr>
                            <tr>
                                <td data-label="No.">25</td>
                                <td data-label="网站">MySQL测试/假数据生成器</td>
                                <td data-label="地址"><a href="https://www.onlinedatagenerator.com/">在线访问</a></td>
                                <td data-label="备注"><code>测试数据生成</code>，好用且强大，生成.sql脚本</td>
                            </tr>
                            <tr>
                                <td data-label="No.">26</td>
                                <td data-label="网站">MyBatis逆向工程</td>
                                <td data-label="地址"><a href="https://github.com/mybatis/generator/releases">点击访问</a></td>
                                <td data-label="备注">实体类+dao双实现类</td>
                            </tr>
                            <tr>
                                <td data-label="No.">27</td>
                                <td data-label="网站">Spring 代码生成器</td>
                                <td data-label="地址"><a href="https://java.bejson.com/generator/">在线访问</a></td>
                                <td data-label="备注">解放双手，强大的一批，谁用谁知道</td>
                            </tr>
                            <tr>
                                <td data-label="No.">28</td>
                                <td data-label="网站">CDN查找</td>
                                <td data-label="地址"><a href="https://www.bootcdn.cn/">在线访问</a></td>
                                <td data-label="备注">稳定、快速、免费的前端开源项目 CDN 加速</td>
                            </tr>
                            <tr>
                                <td data-label="No.">29</td>
                                <td data-label="网站">前端测试数据生成</td>
                                <td data-label="地址"><a href="http://mockjs.com/">在线访问</a></td>
                                <td data-label="备注">生成随机数据，拦截 Ajax 请求</td>
                            </tr>
                            <tr>
                                <td data-label="No.">30</td>
                                <td data-label="网站">产品原型设计</td>
                                <td data-label="地址"><a href="https://lanhuapp.com/">在线访问</a></td>
                                <td data-label="备注">高效的产品设计协作平台</td>
                            </tr>
                            <tr>
                                <td data-label="No.">31</td>
                                <td data-label="网站">jQuery 插件库</td>
                                <td data-label="地址"><a href="http://www.jq22.com/">在线访问</a></td>
                                <td data-label="备注">各种页面组件和插件效果库</td>
                            </tr>
                            <tr>
                                <td data-label="No.">32</td>
                                <td data-label="网站" class="highlight-orange">Redis 命令在线测试</td>
                                <td data-label="地址"><a href="https://try.redis.io/">在线访问</a></td>
                                <td data-label="备注">非常方便的 redis 命令在线测试工具</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- 办公工具分类 -->
            <div class="category-card">
                <div class="category-header" data-target="office-tools">
                    <h2><i class="fas fa-briefcase"></i> 办公工具</h2>
                    <i class="fas fa-chevron-down toggle-icon"></i>
                </div>
                <div id="office-tools" class="category-content">
                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>工具</th>
                                <th>下载</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td data-label="No.">01</td>
                                <td data-label="工具">Evernote</td>
                                <td data-label="下载"><a href="https://www.yinxiang.com/download/">进入下载</a></td>
                                <td data-label="备注">印象笔记，自用笔记工具</td>
                            </tr>
                            <tr>
                                <td data-label="No.">02</td>
                                <td data-label="工具">SourceInsight 4.0</td>
                                <td data-label="下载"><a href="https://www.sourceinsight.com/download/">进入下载</a></td>
                                <td data-label="备注">C语言代码工程管理/编辑工具</td>
                            </tr>
                            <tr>
                                <td data-label="No.">03</td>
                                <td data-label="工具" class="highlight-orange">Xshell 5</td>
                                <td data-label="下载"><a href="https://www.netsarang.com/zh/xshell/">进入下载</a></td>
                                <td data-label="备注">终端 SSH 工具，<a href="https://pan.baidu.com/s/1O5zFOfah6M2YxOO7XTGOYg">Xshell 5版本</a>(提取码: a7jb)不限主机数</td>
                            </tr>
                            <tr>
                                <td data-label="No.">04</td>
                                <td data-label="工具">Sublime Text 3</td>
                                <td data-label="下载"><a href="http://www.sublimetext.com/3">进入下载</a></td>
                                <td data-label="备注">html/css/js/python 编辑神器，没有之一</td>
                            </tr>
                            <tr>
                                <td data-label="No.">05</td>
                                <td data-label="工具" class="highlight-orange">ToDesk</td>
                                <td data-label="下载"><a href="https://www.teamviewer.cn/cn/download/windows/">进入下载</a></td>
                                <td data-label="备注">远程连接神器，个人免费100终端，完胜 TeamViewer</td>
                            </tr>
                            <tr>
                                <td data-label="No.">06</td>
                                <td data-label="工具" class="highlight-orange">Beyond Compare 4</td>
                                <td data-label="下载"><a href="https://pan.baidu.com/s/1HIM7taNKwtYmhqkYm4RV8Q">网盘下载</a></td>
                                <td data-label="备注">代码对比神器，无限30天脚本(提取码: 29le)</td>
                            </tr>
                            <tr>
                                <td data-label="No.">07</td>
                                <td data-label="工具">VMware WorkStation 10<br>Ubuntu 16.04.iso</td>
                                <td data-label="下载">
                                    <a href="https://my.vmware.com/de/web/vmware/info/slug/desktop_end_user_computing/vmware_workstation/10_0">VMware下载</a><br>
                                    <a href="http://old-releases.ubuntu.com/releases/16.04.0/">Ubuntu下载</a>
                                </td>
                                <td data-label="备注">VMware虚拟机工具 + ubuntu(linux) 镜像</td>
                            </tr>
                            <tr>
                                <td data-label="No.">08</td>
                                <td data-label="工具">Editplus 64</td>
                                <td data-label="下载"><a href="https://www.editplus.com/download.html">进入下载</a></td>
                                <td data-label="备注">编辑器（效率高，支持查看/修改2进制文件）</td>
                            </tr>
                            <tr>
                                <td data-label="No.">09</td>
                                <td data-label="工具" class="highlight-orange">Notepad++</td>
                                <td data-label="下载"><a href="https://notepad-plus-plus.org/downloads/">进入下载</a></td>
                                <td data-label="备注">编辑器（log神器, 查找/过滤神器,支持列操作,json插件）</td>
                            </tr>
                            <tr>
                                <td data-label="No.">10</td>
                                <td data-label="工具" class="highlight-orange">Everything</td>
                                <td data-label="下载"><a href="https://www.voidtools.com/zh-cn/">进入下载</a></td>
                                <td data-label="备注">查找文件神器，使用64位安装版配合 uTools</td>
                            </tr>
                            <tr>
                                <td data-label="No.">11</td>
                                <td data-label="工具">cmder</td>
                                <td data-label="下载"><a href="https://cmder.net/">进入下载</a></td>
                                <td data-label="备注">windows命令行神器（兼容linux命令在win上使用）</td>
                            </tr>
                            <tr>
                                <td data-label="No.">12</td>
                                <td data-label="工具" class="highlight-orange">Q-dir</td>
                                <td data-label="下载"><a href="https://www.softwareok.com/?seite=faq-Windows-10&faq=1">进入下载</a></td>
                                <td data-label="备注">文件资源管理多窗口视图神器(有中文版)</td>
                            </tr>
                            <tr>
                                <td data-label="No.">13</td>
                                <td data-label="工具" class="highlight-orange">Desktopcal</td>
                                <td data-label="下载"><a href="http://chs.desktopcal.com/chs/">进入下载</a></td>
                                <td data-label="备注">桌面日历日程神器，目前在用 win11日历 (候选 <a href="http://xricheng.com/index.html">晓日程</a> )</td>
                            </tr>
                            <tr>
                                <td data-label="No.">14</td>
                                <td data-label="工具" class="highlight-orange">Xmind ZEN</td>
                                <td data-label="下载"><a href="https://www.xmind.cn/xmind2020/">进入下载</a></td>
                                <td data-label="备注">本地思维导图神器</td>
                            </tr>
                            <tr>
                                <td data-label="No.">15</td>
                                <td data-label="工具">Anaconda 3</td>
                                <td data-label="下载"><a href="https://www.anaconda.com/products/individual">进入下载</a></td>
                                <td data-label="备注">开源Python版本，含180多个科学包及其依赖项。</td>
                            </tr>
                            <tr>
                                <td data-label="No.">16</td>
                                <td data-label="工具">Tftp / hfs / Xftp</td>
                                <td data-label="下载"><a href="https://www.netsarang.com/zh/xftp/">进入下载</a></td>
                                <td data-label="备注">ftp和http的文件上传下载工具</td>
                            </tr>
                            <tr>
                                <td data-label="No.">17</td>
                                <td data-label="工具">Winscp</td>
                                <td data-label="下载"><a href="https://winscp.net/eng/download.php">进入下载</a></td>
                                <td data-label="备注">支持ftp/scp等协议的文件上传下载工具(可连接)</td>
                            </tr>
                            <tr>
                                <td data-label="No.">18</td>
                                <td data-label="工具">Putty Plus</td>
                                <td data-label="下载"><a href="https://ttyplus.com/downloads/">进入下载</a></td>
                                <td data-label="备注">服务器/终端连接工具，小巧而强大</td>
                            </tr>
                            <tr>
                                <td data-label="No.">19</td>
                                <td data-label="工具" class="highlight-orange">TortoiseSVN</td>
                                <td data-label="下载"><a href="https://tortoisesvn.net/downloads.html">进入下载</a></td>
                                <td data-label="备注">SVN代码版本 GUI 管理工具</td>
                            </tr>
                            <tr>
                                <td data-label="No.">20</td>
                                <td data-label="工具" class="highlight-orange">TortoiseGit</td>
                                <td data-label="下载"><a href="https://tortoisegit.org/download/">进入下载</a></td>
                                <td data-label="备注">Git代码版本 GUI 管理工具</td>
                            </tr>
                            <tr>
                                <td data-label="No.">21</td>
                                <td data-label="工具" class="highlight-orange">Typora</td>
                                <td data-label="下载"><a href="https://www.typora.io/#windows">进入下载</a></td>
                                <td data-label="备注">最好用的 Markdown 本地工具，没有之一(vue主题最佳)</td>
                            </tr>
                            <tr>
                                <td data-label="No.">22</td>
                                <td data-label="工具">Eclipse</td>
                                <td data-label="下载"><a href="https://www.eclipse.org/downloads/">进入下载</a></td>
                                <td data-label="备注">Java 集成开发工具</td>
                            </tr>
                            <tr>
                                <td data-label="No.">23</td>
                                <td data-label="工具">Intellij IDEA</td>
                                <td data-label="下载"><a href="https://www.jetbrains.com/idea/download/">进入下载</a></td>
                                <td data-label="备注">最好用的 Java 集成开发工具，没有之一</td>
                            </tr>
                            <tr>
                                <td data-label="No.">24</td>
                                <td data-label="工具">HBuilderX</td>
                                <td data-label="下载"><a href="https://www.dcloud.io/hbuilderx.html">进入下载</a></td>
                                <td data-label="备注">小巧、轻便、强大的 HTML/CSS/JS 网页开发神器</td>
                            </tr>
                            <tr>
                                <td data-label="No.">25</td>
                                <td data-label="工具">SQLyog</td>
                                <td data-label="下载"><a href="https://www.webyog.com/product/sqlyog">进入下载</a></td>
                                <td data-label="备注">快速而简洁的图形化管理 MySQL 数据库的工具</td>
                            </tr>
                            <tr>
                                <td data-label="No.">26</td>
                                <td data-label="工具" class="highlight-orange">Git Bash</td>
                                <td data-label="下载"><a href="https://gitforwindows.org/">进入下载</a></td>
                                <td data-label="备注">目前世界上最先进的分布式版本控制工具</td>
                            </tr>
                            <tr>
                                <td data-label="No.">27</td>
                                <td data-label="工具" class="highlight-orange">uTools</td>
                                <td data-label="下载"><a href="https://www.u.tools/">进入下载</a></td>
                                <td data-label="备注">你的生产力工具集</td>
                            </tr>
                            <tr>
                                <td data-label="No.">28</td>
                                <td data-label="工具">油猴脚本</td>
                                <td data-label="下载"><a href="http://www.tampermonkey.net/">进入下载</a></td>
                                <td data-label="备注">免费的浏览器扩展和最为流行的用户脚本管理器，脚本大全：<a href="https://greasyfork.org/zh-CN">GreasyFork</a></td>
                            </tr>
                            <tr>
                                <td data-label="No.">29</td>
                                <td data-label="工具">操作系统镜像</td>
                                <td data-label="下载"><a href="https://msdn.itellyou.cn/">进入下载</a></td>
                                <td data-label="备注">系统级的镜像、工具、资源下载</td>
                            </tr>
                            <tr>
                                <td data-label="No.">30</td>
                                <td data-label="工具">抓包工具</td>
                                <td data-label="下载">
                                    <a href="https://www.wireshark.org/">WireShark</a><br>
                                    <a href="https://www.charlesproxy.com/">ClarleSproxy</a>
                                </td>
                                <td data-label="备注">极其强大的两款HTTP/网口抓包工具</td>
                            </tr>
                            <tr>
                                <td data-label="No.">31</td>
                                <td data-label="工具" class="highlight-orange">FinalShell</td>
                                <td data-label="下载"><a href="https://pan.baidu.com/s/1DYzmAMPyPeLi-pbAGJbu_A">百度网盘</a></td>
                                <td data-label="备注">国产免费最好用的终端连接工具，提取码: 81nk</td>
                            </tr>
                            <tr>
                                <td data-label="No.">32</td>
                                <td data-label="工具">在线文档翻译器</td>
                                <td data-label="下载"><a href="https://www.onlinedoctranslator.com/zh-CN/">在线访问</a></td>
                                <td data-label="备注">PDF翻译工具，无需登陆，完全免费</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- AI工具分类 -->
            <div class="category-card">
                <div class="category-header" data-target="ai-tools">
                    <h2><i class="fas fa-robot"></i> AI工具</h2>
                    <i class="fas fa-chevron-down toggle-icon"></i>
                </div>
                <div id="ai-tools" class="category-content">
                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>工具</th>
                                <th>下载</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td data-label="No.">01</td>
                                <td data-label="工具">next-ai-drawio</td>
                                <td data-label="下载"><a href="https://next-ai-drawio.jiang.jp/zh">在线使用</a></td>
                                <td data-label="备注">免费的 AI 画架构图，在线对话，基于drawio实现</td>
                            </tr>
                            <tr>
                                <td data-label="No.">02</td>
                                <td data-label="工具">AI Short</td>
                                <td data-label="下载"><a href="https://www.aishort.top/">在线使用</a></td>
                                <td data-label="备注">多种 AI 提示词搜索、管理、共享</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- web组件库分类 -->
            <div class="category-card">
                <div class="category-header" data-target="web-components">
                    <h2><i class="fas fa-code-branch"></i> web组件库</h2>
                    <i class="fas fa-chevron-down toggle-icon"></i>
                </div>
                <div id="web-components" class="category-content">
                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>工具</th>
                                <th>下载</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td data-label="No.">01</td>
                                <td data-label="工具">element-ui/element-plus</td>
                                <td data-label="下载"><a href="https://element-plus.org/zh-CN/">官网</a></td>
                                <td data-label="备注">系统管理后台组件库</td>
                            </tr>
                            <tr>
                                <td data-label="No.">02</td>
                                <td data-label="工具">vant</td>
                                <td data-label="下载"><a href="https://vant-ui.github.io/vant/#/zh-CN/home">官网</a></td>
                                <td data-label="备注">移动端页面组件库</td>
                            </tr>
                            <tr>
                                <td data-label="No.">03</td>
                                <td data-label="工具">uiverse.io</td>
                                <td data-label="下载"><a href="https://uiverse.io/">官网</a></td>
                                <td data-label="备注">最大开源UI库，适配React、Vue、Lit等，开箱即用</td>
                            </tr>
                            <tr>
                                <td data-label="No.">04</td>
                                <td data-label="工具">VUE后台管理系统模板</td>
                                <td data-label="下载"><a href="http://vue.easydo.work/">官网</a></td>
                                <td data-label="备注">最全的前端管理系统模版开源库，含预览地址、官网、教程等</td>
                            </tr>
                            <tr>
                                <td data-label="No.">05</td>
                                <td data-label="工具">open-lovable</td>
                                <td data-label="下载"><a href="https://github.com/firecrawl/open-lovable">开源地址</a></td>
                                <td data-label="备注">克隆任何网站为React应用</td>
                            </tr>
                            <tr>
                                <td data-label="No.">06</td>
                                <td data-label="工具">vue bits</td>
                                <td data-label="下载"><a href="https://vue-bits.dev/">官网</a></td>
                                <td data-label="备注">vue组件库，各种酷炫特效的组件</td>
                            </tr>
                            <tr>
                                <td data-label="No.">07</td>
                                <td data-label="工具">UXbot</td>
                                <td data-label="下载"><a href="https://www.uxbot.cn/">官网</a></td>
                                <td data-label="备注">快速将想法变成ui网站界面</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- 系统辅助分类 -->
            <div class="category-card">
                <div class="category-header" data-target="system-tools">
                    <h2><i class="fas fa-desktop"></i> 系统辅助</h2>
                    <i class="fas fa-chevron-down toggle-icon"></i>
                </div>
                <div id="system-tools" class="category-content">
                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>工具</th>
                                <th>下载</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td data-label="No.">01</td>
                                <td data-label="工具" class="highlight-green">PotPlayer</td>
                                <td data-label="下载"><a href="http://www.potplayercn.com/download/">进入下载</a></td>
                                <td data-label="备注">免费，最好用的本地播放器，没有之一</td>
                            </tr>
                            <tr>
                                <td data-label="No.">02</td>
                                <td data-label="工具" class="highlight-green">Geek</td>
                                <td data-label="下载"><a href="https://geekuninstaller.com/">进入下载</a></td>
                                <td data-label="备注">免费，最好用的卸载工具，没有之一</td>
                            </tr>
                            <tr>
                                <td data-label="No.">03</td>
                                <td data-label="工具" class="highlight-green">Bandizip</td>
                                <td data-label="下载"><a href="http://www.bandisoft.com/">进入下载</a></td>
                                <td data-label="备注">免费，最好用的解压缩工具，没有之一</td>
                            </tr>
                            <tr>
                                <td data-label="No.">04</td>
                                <td data-label="工具" class="highlight-green">WizTree</td>
                                <td data-label="下载"><a href="https://www.diskanalyzer.com/">进入下载</a></td>
                                <td data-label="备注">免费，最好用的大文件分析工具，没有之一</td>
                            </tr>
                            <tr>
                                <td data-label="No.">05</td>
                                <td data-label="工具" class="highlight-green">FastStone Capture</td>
                                <td data-label="下载"><a href="https://pan.baidu.com/s/1ey4iK8GDObNINXSjCk4shg">百度网盘</a></td>
                                <td data-label="备注">破解版，最好用的截图工具，功能强大(提取码: r4oa)</td>
                            </tr>
                            <tr>
                                <td data-label="No.">06</td>
                                <td data-label="工具" class="highlight-green">ImTip</td>
                                <td data-label="下载"><a href="https://imtip.aardio.com/">进入官网</a></td>
                                <td data-label="备注">最好用的系统级输入法跟踪提示工具</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- CodePart -->
            <div class="category-card">
                <div class="category-header" data-target="code-part">
                    <h2><i class="fas fa-code"></i> CodePart</h2>
                    <i class="fas fa-chevron-down toggle-icon"></i>
                </div>
                <div id="code-part" class="category-content">
                    <iframe id="embed_dom" name="embed_dom" frameborder="0" style="display:block;width:100%; height:666px;" src="https://www.processon.com/embed/5e3b6d5ce4b00de9fd7dd195"></iframe>
                </div>
            </div>
        </div>
        <!-- 脚本 -->
        <script>
            // 页面加载完成后执行
            document.addEventListener('DOMContentLoaded', function() {
                // 显示/隐藏ASCII图片
                function showImg() {
                    document.getElementById('asciiImg').style.display = 'block';
                }
                function hideImg() {
                    document.getElementById('asciiImg').style.display = 'none';
                }
                // 分类折叠/展开功能
                function toggleCategory(targetId) {
                    const content = document.getElementById(targetId);
                    const header = content.parentElement.querySelector('.category-header');
                    content.classList.toggle('collapsed');
                    header.classList.toggle('active');
                    // 点击时让ASCII图片隐藏（防止遮挡）
                    hideImg();
                }
                // 绑定所有分类头部的点击事件
                const categoryHeaders = document.querySelectorAll('#tool-library-container .category-header');
                categoryHeaders.forEach(header => {
                    header.addEventListener('click', function() {
                        const targetId = this.getAttribute('data-target');
                        toggleCategory(targetId);
                    });
                });
                // 绑定ASCII链接的鼠标事件
                const asciiLink = document.getElementById('asciiLink');
                if (asciiLink) {
                    asciiLink.addEventListener('mouseover', showImg);
                    asciiLink.addEventListener('mouseout', hideImg);
                }
                // 让ASCII图片跟随鼠标
                document.addEventListener('mousemove', function(e) {
                    const img = document.getElementById('asciiImg');
                    if (img.style.display === 'block') {
                        img.style.left = (e.pageX + 10) + 'px';
                        img.style.top = (e.pageY + 10) + 'px';
                    }
                });
                // 默认展开第一个分类
                const firstCategory = document.querySelector('#tool-library-container .category-content');
                if (firstCategory) {
                    firstCategory.classList.remove('collapsed');
                    firstCategory.parentElement.querySelector('.category-header').classList.add('active');
                }
            });
        </script>
    </div>
</body>
