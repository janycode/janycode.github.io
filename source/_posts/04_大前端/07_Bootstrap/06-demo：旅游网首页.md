---
title: 06-demo：旅游网首页
date: 2018-5-13 21:36:21
tags:
- Bootstrap
categories: 
- 04_大前端
- 07_Bootstrap
---

### 效果图：
效果图：
![Bootstrap框架使用及可视化布局demo](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316145051.png)



### 源码 - 初版：

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>炎黄子孙旅游网</title>
    <link href="${pageContext.request.contextPath}/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <script src="${pageContext.request.contextPath}/bootstrap/js/jquery-3.5.1.min.js"></script>
    <script src="${pageContext.request.contextPath}/bootstrap/js/bootstrap.min.js"></script>
    <style>
        body {
            width: 100%;
            margin-left: auto;
            margin-right: auto;
        }

        .container-fluid {
            padding: 0;
        }

        /* 图片随窗口大小变化自动伸缩 */
        #top_banner {
            width: 100%;
            height: auto;
        }

        hr {
            margin-top: 5px;
        }

        .price {
            color: orange;
        }
		/* 需要两边留白且居中的主体内容 */
        .content {
            width: 80%;
        }

        .thumbnail {
            padding: 0;
        }
    </style>
</head>
<body>
<div class="container-fluid">
    <div class="row-fluid">
        <div class="span12">
            <%--顶部banner--%>
            <img id="top_banner" src="image/top_banner.jpg" alt="top-banner"/>
            <%--导航条--%>
            <nav class="navbar navbar-default">
                <div class="container-fluid">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                                data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <a style="color: orange; margin-left: 10px" class="navbar-brand" href="#">炎黄子孙旅游网</a>
                    </div>

                    <!-- Collect the nav links, forms, and other content for toggling -->
                    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul class="nav navbar-nav">
                            <li class="active"><a href="#">名胜 <span class="sr-only">(current)</span></a></li>
                            <li><a href="#">古迹</a></li>
                            <li class="dropdown">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"
                                   aria-haspopup="true" aria-expanded="false">各地景区 <span class="caret"></span></a>
                                <ul class="dropdown-menu">
                                    <li><a href="#">郑州</a></li>
                                    <li role="separator" class="divider"></li>
                                    <li><a href="#">开封</a></li>
                                    <li><a href="#">洛阳</a></li>
                                    <li role="separator" class="divider"></li>
                                    <li><a href="#">南阳</a></li>
                                    <li><a href="#">驻马店</a></li>
                                    <li><a href="#">平顶山</a></li>
                                </ul>
                            </li>
                        </ul>
                        <form class="navbar-form navbar-left">
                            <div class="form-group">
                                <input type="text" class="form-control" placeholder="地区或景点名称">
                            </div>
                            <button type="submit" class="btn btn-default">搜索</button>
                        </form>
                        <ul class="nav navbar-nav navbar-right">
                            <li><a href="#">关于我们</a></li>
                            <li class="dropdown">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"
                                   aria-haspopup="true" aria-expanded="false">个人中心 <span class="caret"></span></a>
                                <ul class="dropdown-menu">
                                    <li><a href="#">我的足迹</a></li>
                                    <li><a href="#">我的旅记</a></li>
                                    <li><a href="#">我的相册</a></li>
                                    <li role="separator" class="divider"></li>
                                    <li><a href="#">退出</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div><!-- /.navbar-collapse -->
                </div><!-- /.container-fluid -->
            </nav>
            <%--轮播图--%>
            <div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
                <!-- Indicators -->
                <ol class="carousel-indicators">
                    <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
                    <li data-target="#carousel-example-generic" data-slide-to="1"></li>
                    <li data-target="#carousel-example-generic" data-slide-to="2"></li>
                </ol>

                <!-- Wrapper for slides -->
                <div class="carousel-inner" role="listbox">
                    <div class="item active">
                        <img src="image/banner_1.jpg" alt="轮播图1">
                        <div class="carousel-caption">
                            ...
                        </div>
                    </div>
                    <div class="item">
                        <img src="image/banner_2.jpg" alt="轮播图2">
                        <div class="carousel-caption">
                            ...
                        </div>
                    </div>
                    <div class="item">
                        <img src="image/banner_3.jpg" alt="轮播图3">
                        <div class="carousel-caption">
                            ...
                        </div>
                    </div>
                </div>

                <!-- Controls -->
                <a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
                    <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                    <span class="sr-only">上一张</span>
                </a>
                <a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
                    <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                    <span class="sr-only">下一张</span>
                </a>
            </div>
        </div>
    </div>
</div>
<div class="content container-fluid">
    <div class="mod_title row-fluid">
        <div class="span12">
            <%--栏目标题--%>
            <div style="margin-top: 20px">
                <div>
                    <img src="image/icon_5.jpg" alt="">旅游精选
                </div>
                <hr/>
            </div>
            <%--栏目内容 2x4--%>
            <div class="row-fluid">
                <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                    <div class="thumbnail">
                        <img src="image/jingxuan_1.jpg" alt="精选1">
                        <div class="caption">
                            <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游首选+豪华酒店任选+机场酒店免费接送)</p>
                            <span class="price">$699</span>
                            <a href="#" class="btn btn-warning" role="button" style="margin-left: 50%">预定</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                    <div class="thumbnail">
                        <img src="image/jingxuan_1.jpg" alt="精选1">
                        <div class="caption">
                            <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游首选+豪华酒店任选+机场酒店免费接送)</p>
                            <span class="price">$699</span>
                            <a href="#" class="btn btn-warning" role="button" style="margin-left: 50%">预定</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                    <div class="thumbnail">
                        <img src="image/jingxuan_1.jpg" alt="精选1">
                        <div class="caption">
                            <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游首选+豪华酒店任选+机场酒店免费接送)</p>
                            <span class="price">$699</span>
                            <a href="#" class="btn btn-warning" role="button" style="margin-left: 50%">预定</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                    <div class="thumbnail">
                        <img src="image/jingxuan_1.jpg" alt="精选1">
                        <div class="caption">
                            <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游首选+豪华酒店任选+机场酒店免费接送)</p>
                            <span class="price">$699</span>
                            <a href="#" class="btn btn-warning" role="button" style="margin-left: 50%">预定</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row-fluid">
                <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                    <div class="thumbnail">
                        <img src="image/jingxuan_1.jpg" alt="精选1">
                        <div class="caption">
                            <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游首选+豪华酒店任选+机场酒店免费接送)</p>
                            <span class="price">$699</span>
                            <a href="#" class="btn btn-warning" role="button" style="margin-left: 50%">预定</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                    <div class="thumbnail">
                        <img src="image/jingxuan_1.jpg" alt="精选1">
                        <div class="caption">
                            <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游首选+豪华酒店任选+机场酒店免费接送)</p>
                            <span class="price">$699</span>
                            <a href="#" class="btn btn-warning" role="button" style="margin-left: 50%">预定</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                    <div class="thumbnail">
                        <img src="image/jingxuan_1.jpg" alt="精选1">
                        <div class="caption">
                            <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游首选+豪华酒店任选+机场酒店免费接送)</p>
                            <span class="price">$699</span>
                            <a href="#" class="btn btn-warning" role="button" style="margin-left: 50%">预定</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                    <div class="thumbnail">
                        <img src="image/jingxuan_1.jpg" alt="精选1">
                        <div class="caption">
                            <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游首选+豪华酒店任选+机场酒店免费接送)</p>
                            <span class="price">$699</span>
                            <a href="#" class="btn btn-warning" role="button" style="margin-left: 50%">预定</a>
                        </div>
                    </div>
                </div>
            </div>
            <%--分页栏--%>
            <div align="center">
                <nav aria-label="Page navigation">
                    <ul class="pagination">
                        <li>
                            <a href="#" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        <li><a href="#">1</a></li>
                        <li><a href="#">2</a></li>
                        <li><a href="#">3</a></li>
                        <li><a href="#">4</a></li>
                        <li><a href="#">5</a></li>
                        <li>
                            <a href="#" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
    <div class="row-fluid">
        <div class="span12">
            <%--栏目标题--%>
            <div>
                <div>
                    <img src="image/icon_6.jpg" alt="">人气推荐
                </div>
                <hr/>
            </div>
            <%--栏目内容 1 + 2x3--%>
            <div class="row-fluid">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="width: 30%">
                    <img style="width: 300px; height: 445px;" src="image/guonei_1.jpg" alt="特卖">
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="width: 70%; padding: 0">
                    <div class="row-fluid">
                        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                            <div class="thumbnail">
                                <img src="image/jingxuan_1.jpg" alt="精选1">
                                <div class="caption">
                                    <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游)</p>
                                    <span class="price">$699</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                            <div class="thumbnail">
                                <img src="image/jingxuan_2.jpg" alt="精选1">
                                <div class="caption">
                                    <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游)</p>
                                    <span class="price">$699</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                            <div class="thumbnail">
                                <img src="image/jingxuan_3.jpg" alt="精选1">
                                <div class="caption">
                                    <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游)</p>
                                    <span class="price">$699</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row-fluid">
                        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                            <div class="thumbnail">
                                <img src="image/jingxuan_4.jpg" alt="精选1">
                                <div class="caption">
                                    <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游)</p>
                                    <span class="price">$699</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                            <div class="thumbnail">
                                <img src="image/jingxuan_5.jpg" alt="精选1">
                                <div class="caption">
                                    <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游)</p>
                                    <span class="price">$699</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                            <div class="thumbnail">
                                <img src="image/jingxuan_6.jpg" alt="精选1">
                                <div class="caption">
                                    <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游)</p>
                                    <span class="price">$699</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="container-fluid" style="background-color: #383838; width: 100%; height: 100px;">
    <div class="content container-fluid">
        <div class="row-fluid">
            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="margin-top: 20px;">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="width: 25%;">
                    <img src="image/icon_1.jpg">
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"
                     style="width: 75%; color: white; font-family: 'Microsoft YaHei UI'; ">
                    <span style="font-size: 20px"><b>产品齐全</b></span>
                    <p style="color: gray; padding-top: 0px">产品全自主选，随心买</p>
                </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="margin-top: 20px;">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="width: 25%;">
                    <img src="image/icon_1.jpg">
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"
                     style="width: 75%; color: white; font-family: 'Microsoft YaHei UI'; ">
                    <span style="font-size: 20px"><b>便利快捷</b></span>
                    <p style="color: gray; padding-top: 0px">产品全自主选，随心买</p>
                </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="margin-top: 20px;">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="width: 25%;">
                    <img src="image/icon_1.jpg">
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"
                     style="width: 75%; color: white; font-family: 'Microsoft YaHei UI'; ">
                    <span style="font-size: 20px"><b>安全支付</b></span>
                    <p style="color: gray; padding-top: 0px">产品全自主选，随心买</p>
                </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="margin-top: 20px;">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="width: 25%;">
                    <img src="image/icon_1.jpg">
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"
                     style="width: 75%; color: white; font-family: 'Microsoft YaHei UI'; ">
                    <span style="font-size: 20px"><b>贴心服务</b></span>
                    <p style="color: gray; padding-top: 0px">产品全自主选，随心买</p>
                </div>
            </div>
        </div>
    </div>
</div>

</body>
</html>
```

### 源码 - 优化：

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>炎黄旅游网</title>
    <link href="${pageContext.request.contextPath}/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <script src="${pageContext.request.contextPath}/bootstrap/js/jquery-3.5.1.min.js"></script>
    <script src="${pageContext.request.contextPath}/bootstrap/js/bootstrap.min.js"></script>
    <style>
        #top_banner {
            width: 100%;
        }

        .jx {
            margin-top: 20px;
            border-bottom: 1px solid orange;
            padding-bottom: 5px;
            margin-bottom: 20px;
        }

        .footer img{
            width: 100%;
        }
    </style>
</head>
<body>
<%--页眉--%>
<div class="container-fluid">
    <%--顶部广告图：处理宽度跟随浏览器宽度即 width:100%--%>
    <div class="row">
        <img src="image/top_banner.jpg" id="top_banner">
    </div>
    <%--导航条：处理默认自带的底部外边距20px为0px--%>
    <div class="row">
        <nav class="navbar navbar-default" style="margin-bottom: 0px;">
            <div class="container-fluid">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                            data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a style="color: orange;" class="navbar-brand" href="#">炎黄子孙旅游网</a>
                </div>

                <!-- Collect the nav links, forms, and other content for toggling -->
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav">
                        <li class="active"><a href="#">名胜 <span class="sr-only">(current)</span></a></li>
                        <li><a href="#">古迹</a></li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"
                               aria-haspopup="true" aria-expanded="false">各地景区 <span class="caret"></span></a>
                            <ul class="dropdown-menu">
                                <li><a href="#">郑州</a></li>
                                <li role="separator" class="divider"></li>
                                <li><a href="#">开封</a></li>
                                <li><a href="#">洛阳</a></li>
                                <li role="separator" class="divider"></li>
                                <li><a href="#">南阳</a></li>
                                <li><a href="#">驻马店</a></li>
                                <li><a href="#">平顶山</a></li>
                            </ul>
                        </li>
                    </ul>
                    <form class="navbar-form navbar-left">
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="地区或景点名称">
                        </div>
                        <button type="submit" class="btn btn-default">搜索</button>
                    </form>
                    <ul class="nav navbar-nav navbar-right">
                        <li><a href="#">关于我们</a></li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"
                               aria-haspopup="true" aria-expanded="false">个人中心 <span class="caret"></span></a>
                            <ul class="dropdown-menu">
                                <li><a href="#">我的足迹</a></li>
                                <li><a href="#">我的相册</a></li>
                                <li><a href="#">我的订单</a></li>
                                <li role="separator" class="divider"></li>
                                <li><a href="#">退出</a></li>
                            </ul>
                        </li>
                    </ul>
                </div><!-- /.navbar-collapse -->
            </div><!-- /.container-fluid -->
        </nav>
    </div>
    <%--轮播图--%>
    <div class="row">
        <div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
            <!-- Indicators -->
            <ol class="carousel-indicators">
                <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
                <li data-target="#carousel-example-generic" data-slide-to="1"></li>
                <li data-target="#carousel-example-generic" data-slide-to="2"></li>
            </ol>

            <!-- Wrapper for slides -->
            <div class="carousel-inner" role="listbox">
                <div class="item active">
                    <img src="image/banner_1.jpg" alt="轮播图1">
                </div>
                <div class="item">
                    <img src="image/banner_2.jpg" alt="轮播图2">
                </div>
                <div class="item">
                    <img src="image/banner_3.jpg" alt="轮播图3">
                </div>
            </div>

            <!-- Controls -->
            <a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
                <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                <span class="sr-only">上一张</span>
            </a>
            <a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
                <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                <span class="sr-only">下一张</span>
            </a>
        </div>
    </div>
</div>
<%--主体--%>
<div class="container">
    <div class="row jx">
        <img src="image/icon_5.jpg">旅游精选
    </div>
    <div class="row">
        <div class="col-lg-3 col-md-6">
            <div class="thumbnail">
                <img src="image/jingxuan_3.jpg">
                <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游首选+豪华酒店任选+机场酒店免费接送)</p>
                <font color="orange">$699</font>
            </div>
        </div>
        <div class="col-lg-3 col-md-6">
            <div class="thumbnail">
                <img src="image/jingxuan_3.jpg">
                <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游首选+豪华酒店任选+机场酒店免费接送)</p>
                <font color="orange">$699</font>
            </div>
        </div>
        <div class="col-lg-3 col-md-6">
            <div class="thumbnail">
                <img src="image/jingxuan_3.jpg">
                <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游首选+豪华酒店任选+机场酒店免费接送)</p>
                <font color="orange">$699</font>
            </div>
        </div>
        <div class="col-lg-3 col-md-6">
            <div class="thumbnail">
                <img src="image/jingxuan_3.jpg">
                <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游首选+豪华酒店任选+机场酒店免费接送)</p>
                <font color="orange">$699</font>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-3 col-md-6">
            <div class="thumbnail">
                <img src="image/jingxuan_3.jpg">
                <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游首选+豪华酒店任选+机场酒店免费接送)</p>
                <font color="orange">$699</font>
            </div>
        </div>
        <div class="col-lg-3 col-md-6">
            <div class="thumbnail">
                <img src="image/jingxuan_3.jpg">
                <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游首选+豪华酒店任选+机场酒店免费接送)</p>
                <font color="orange">$699</font>
            </div>
        </div>
        <div class="col-lg-3 col-md-6">
            <div class="thumbnail">
                <img src="image/jingxuan_3.jpg">
                <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游首选+豪华酒店任选+机场酒店免费接送)</p>
                <font color="orange">$699</font>
            </div>
        </div>
        <div class="col-lg-3 col-md-6">
            <div class="thumbnail">
                <img src="image/jingxuan_3.jpg">
                <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游首选+豪华酒店任选+机场酒店免费接送)</p>
                <font color="orange">$699</font>
            </div>
        </div>

    </div>

    <div class="row jx">
        <img src="image/icon_6.jpg">人气推荐
    </div>
    <div class="row">
        <%--左边占三分之一即 4 列--%>
        <div class="col-md-4">
            <%--thumbnail：边框--%>
            <div class="thumbnail">
                <img src="image/guonei_1.jpg">
            </div>
        </div>
        <%--右边占三分之一即 8 列--%>
        <div class="col-md-8">
            <div class="row">
                <div class="col-lg-4 col-md-12">
                    <div class="thumbnail">
                        <img src="image/jingxuan_4.jpg">
                        <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游首选+豪华酒店任选+机场酒店免费接送)</p>
                        <font color="orange">$699</font>
                    </div>
                </div>
                <div class="col-lg-4 col-md-12">
                    <div class="thumbnail">
                        <img src="image/jingxuan_4.jpg">
                        <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游首选+豪华酒店任选+机场酒店免费接送)</p>
                        <font color="orange">$699</font>
                    </div>
                </div>
                <div class="col-lg-4 col-md-12">
                    <div class="thumbnail">
                        <img src="image/jingxuan_4.jpg">
                        <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游首选+豪华酒店任选+机场酒店免费接送)</p>
                        <font color="orange">$699</font>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-4 col-md-12">
                    <div class="thumbnail">
                        <img src="image/jingxuan_4.jpg">
                        <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游首选+豪华酒店任选+机场酒店免费接送)</p>
                        <font color="orange">$699</font>
                    </div>
                </div>
                <div class="col-lg-4 col-md-12">
                    <div class="thumbnail">
                        <img src="image/jingxuan_4.jpg">
                        <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游首选+豪华酒店任选+机场酒店免费接送)</p>
                        <font color="orange">$699</font>
                    </div>
                </div>
                <div class="col-lg-4 col-md-12">
                    <div class="thumbnail">
                        <img src="image/jingxuan_4.jpg">
                        <p>上海直飞三亚5天4晚自由行(春节预售+亲子/蜜月/休闲旅游首选+豪华酒店任选+机场酒店免费接送)</p>
                        <font color="orange">$699</font>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<%--页脚--%>
<div class="container-fluid footer">
    <div class="row">
        <img src="image/footer_service.png">
    </div>
</div>
</body>
</html>
```