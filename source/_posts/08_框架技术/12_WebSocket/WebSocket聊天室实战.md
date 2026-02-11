---
title: WebSocket聊天室实战
date: 2019-03-02 17:59:44
tags:
- WebSocket
categories: 
- 08_框架技术
- 12_WebSocket
---

![image-20200830123223268](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200830123224.png)



参考资料-后端：https://developer.ibm.com/zh/articles/j-lo-WebSocket/

参考资料-前端：https://www.runoob.com/html/html5-websocket.html

在线测试-地址：http://www.websocket-test.com/



### 1. 简介

WebSocket 是 HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。

WebSocket 使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。在WebSocket API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。

经典对比图示：

![image-20200830123430614](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200830123431.png)



效果图：

![image-20200830125011497](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200830125012.png)



### 2. 服务端实现

#### 2.1 依赖 jar

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

#### 2.2 配置类

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

@Configuration
public class WebSocketConfig {
    /**
     * WebSocket服务端解析器对象
     */
    @Bean
    public ServerEndpointExporter createSEE() {
        return new ServerEndpointExporter();
    }
}
```



#### 2.3 服务端

```java
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Scope(scopeName = "prototype") //注意要配置为多例模式，供多人聊天提供实例创建
@ServerEndpoint("/chatserver/{nickname}")
public class ChatServer {
    /**
     * 昵称
     */
    private String nickname;
    /**
     * 当前的会话对象
     */
    private Session session;
    public static ConcurrentHashMap<String, ChatServer> clients;

    static {
        clients = new ConcurrentHashMap<>();
    }

    /**
     * 连接  客户端连接
     *
     * @param name
     * @param session
     * @throws IOException
     */
    @OnOpen
    public void open(@PathParam("nickname") String name, Session session) throws IOException {
        if (clients.containsKey(name)) {
            //昵称存在
            session.getBasicRemote().sendText("亲，昵称与存在，请重新命名");
        } else {
            clients.put(name, this);
            nickname = name;
            this.session = session;
            //发送 群发消息 欢迎xx
            sendAlMsg("欢迎-" + name + "- 加入聊天室，鲜花走起来！", true);
        }
    }

    /**
     * 发送消息
     *
     * @param msg
     */
    @OnMessage
    public void message(String msg) {
        System.err.println(nickname + "----->" + msg);
        sendAlMsg(msg, false);
    }

    /**
     * 错误
     *
     * @param error
     */
    @OnError
    public void error(Throwable error) {
        error.printStackTrace();
    }

    /**
     * 关闭
     *
     * @param session
     * @throws IOException
     */
    @OnClose
    public void close(Session session) throws IOException {
        //移除
        clients.remove(nickname);
        //群发消息 告诉其他人 xxx 离开了聊天室，他错失了100万
        sendAlMsg(nickname + "-离开了聊天室，他错失了100万", true);
        //关闭会话
        session.close();
    }


    /**
     * 群发消息
     *
     * @param msg    发送的消息
     * @param isself 是否包含自己
     */
    private void sendAlMsg(String msg, boolean isself) {
        for (String s : clients.keySet()) {
            if (!isself) {
                if (s.equals(nickname)) {
                    continue;
                }
            }
            try {
                clients.get(s).session.getBasicRemote().sendText(msg);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```



### 3. 前端实现

核心：

* ws = `new WebSocket("ws://ip:port/chatserver/" + name)`;  创建 webSocket 连接
* style="`scroll-snap-type-y: unset;`" 界面滚动样式
* ws.onopen / ws.onmessage / ws.send / ws.close 相关事件

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>WebSocket 聊天室实战 Jerry</title>
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.0/dist/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
		 crossorigin="anonymous">
		<script type="application/javascript" src="https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.js"></script>

		<style type="text/css">
			div {
				text-align: center;
			}
			.inputmsg {
				padding: 5px;
				border-radius: 10px;
				width: 60%;
			}
			.dvleft {
				/* clear: all; */
				float: left;
				text-align: left;
				margin-left: 10px;
				width: 100%;
			}
			.dvright {
				float: right;
				width: 100%;
				text-align: right;
				margin-right: 10px;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<!-- 命名 连接 退出 -->
			<div class="row">
				<div class="col">
					<input class="inputmsg" id="nickname" style="width: 30%;" />
					<button class="btn btn-primary" id="btnjoin">加入聊天室</button>
					<button class="btn btn-primary" id="btnexit" disabled>退出聊天室</button>
				</div>
			</div>
			<!-- 聊天区域 别人在左边，自己的在右边。核心属性：scroll-snap-type-y 代表滚动样式 -->
			<div class="row" id="dvchat" style="scroll-snap-type-y: unset;margin-top: 10px;border: 1px solid red;height: 600px;">

				<p class="dvleft">哈哈哈哈</p>
				<p class="dvright">哦的</p>
			</div>
			<!-- 发送聊天内容 -->
			<div class="row" style="position: absolute;bottom: 10px; width: 100%;">
				<div class="col-sm-offset-1 col-sm-10">
					<input class="inputmsg" id="chatmsg" />
					<button class="btn btn-primary" id="btnsend">发送消息</button>
				</div>
			</div>
		</div>
		<script type="application/javascript">
			var ws;
			$(function() {
				//打开连接
				$("#btnjoin").click(function() {
					var n = $("#nickname").val();
					if (n) {
						ws = new WebSocket("ws://localhost:8085/chatserver/" + n);
						ws.onopen = function() {
							$("#btnjoin").attr("disabled", "");
							$("#btnexit").removeAttr("disabled");
						}
						//接收消息
						ws.onmessage = function(evt) {
							receiveMsg(evt);
						};
						ws.onclose = function() {
							// 关闭 websocket
							alert("连接已关闭...");
							window.close();
						};

					} else {
						alert("亲，请输入昵称");
					}
				})
				//发送消息
				$("#btnsend").click(function() {
					sendMsg();
				});
				//退出
				$("#btnexit").click(function() {
					ws.close();
				})
			})

			//发送消息
			function sendMsg() {
				// Web Socket 已连接上，使用 send() 方法发送数据
				var m = $("#chatmsg").val();
				if (m) {
					ws.send(m);
					$("#dvchat").append("<p class=\"dvright\">" + m + "</p>");
					$("#chatmsg").val("");
				} else {
					alert("请输入聊天消息");
				}
			};
			
			//接收消息
			function receiveMsg(evt) {
				var rmsg = evt.data;
				$("#dvchat").append("<p class=\"dvleft\">" + rmsg + "</p>");
			}
		</script>
	</body>
</html>
```



### 4. 在线测试

在线测试-地址：http://www.websocket-test.com/

接口地址：`ws://192.168.31.244:8085/chatserver/jerry`

```java
// ws://本机内网ip:端口号/资源路径
@ServerEndpoint("/chatserver/{nickname}")
public class ChatServer {
	...
}
```

![image-20200830130354226](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200830130355.png)