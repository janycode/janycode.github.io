---
title: Java实现MQTT传输协议通信
date: 2023-05-23 15:28:28
tags:
- MQTT
- 物联网
- 传输协议
categories: 
- 08_框架技术
- 16_MQTT
---

![image-20230523152951628](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230523152952.png)

### 1. MQTT

#### 1.1 概述

MQTT 是一种基于发布/订阅模式的`轻量级物联网消息传输协议` ，可在严重受限的硬件设备和低带宽、高延迟的网络上实现稳定传输。它凭借**简单易实现**、**支持 QoS**、**报文小**等特点，占据了物联网协议的半壁江山。

MQTT是基于二进制消息的发布/订阅编程模式的消息协议，最早由IBM提出的，如今已经成为OASIS规范。由于规范很简单，非常适合需要低功耗和网络带宽有限的IoT场景，比如：

- 遥感数据
- 汽车
- 智能家居
- 智慧城市
- 医疗医护

由于物联网的环境是非常特别的，所以MQTT遵循以下设计原则：

1. 精简，不添加可有可无的功能。
2. 发布/订阅（Pub/Sub）模式，方便消息在传感器之间传递。
3. 允许用户动态创建主题，零运维成本。
4. 把传输量降到最低以提高传输效率。
5. 把低带宽、高延迟、不稳定的网络等因素考虑在内。
6. 支持连续的会话控制。
7. 理解客户端计算能力可能很低。
8. 提供服务质量管理。
9. 假设数据不可知，不强求传输数据的类型与格式，保持灵活性。

![image-20230523153209576](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230523153210.png)

#### 1.2 发布和订阅模型

发布和订阅模式是MQTT的核心。MQTT 协议在网络中定义了两种实体类型：一个消息代理和一些客户端。

代理是一个服务器，它从客户端接收所有消息，然后将这些消息路由到相关的目标客户端。

客户端是能够与代理交互来发送和接收消息的任何事物。客户端可以是现场的 IoT 传感器，或者是数据中心内处理 IoT 数据的应用程序。

1. 客户端连接到代理。它可以订阅代理中的任何消息“主题”。此连接可以是简单的 TCP/IP 连接，也可以是用于发送敏感消息的加密 TLS 连接。
2. 客户端通过将消息和主题发送给代理，发布某个主题范围内的消息。
3. 代理然后将消息转发给所有订阅该主题的客户端。

#### 1.3 客户端

一个使用MQTT协议的应用程序或者设备，它总是建立到服务器的网络连接。客户端可以：

（1）发布其他客户端可能会订阅的信息；

（2）订阅其它客户端发布的消息；

（3）退订或删除应用程序的消息；

（4）断开与服务器连接。

#### 1.4 服务器

`MQTT服务器以称为 “消息代理”（Broker）`，可以是一个应用程序或一台设备。它是位于消息发布者和订阅者之间，它可以：

（1）接受来自客户的网络连接；

（2）接受客户发布的应用信息；

（3）处理来自客户端的订阅和退订请求；

（4）向订阅的客户转发应用程序消息。

#### 1.5 订阅、主题、会话

* **订阅（Subscription）**

 订阅包含主题筛选器（Topic Filter）和最大服务质量（QoS）。订阅会与一个会话（Session）关联。一个会话可以包含多个订阅。每一个会话中的每个订阅都有一个不同的主题筛选器。

* **会话（Session）**

 每个客户端与服务器建立连接后就是一个会话，客户端和服务器之间有状态交互。会话存在于一个网络之间，也可能在客户端和服务器之间跨越多个连续的网络连接。

* **主题名（Topic Name）**

 连接到一个应用程序消息的标签，该标签与服务器的订阅相匹配。服务器会将消息发送给订阅所匹配标签的每个客户端。

* **主题筛选器（Topic Filter）**

 一个对主题名通配符筛选器，在订阅表达式中使用，表示订阅所匹配到的多个主题。

* **负载（Payload）**

 消息订阅者所具体接收的内容。

#### 1.6 协议中的方法

MQTT协议中定义了一些方法（也被称为动作），来于表示对确定资源所进行操作。这个资源可以代表预先存在的数据或动态生成数据，这取决于服务器的实现。通常来说，资源指服务器上的文件或输出。主要方法有：

（1）Connect: 等待与服务器建立连接。

（2）Disconnect: 等待MQTT客户端完成所做的工作，并与服务器断开TCP/IP会话。

（3）Subscribe: 等待完成订阅。

（4）UnSubscribe: 等待服务器取消客户端的一个或多个topics订阅。

（5）Publish: MQTT客户端发送消息请求，发送完成后返回应用程序线程。

### 2. Java使用MQTT

> Java 体系中 `Paho Java` 是比较稳定、广泛应用的 MQTT 客户端库。
>
> 如下代码包含 Java 语言的 Paho Java 连接 EMQ X Broker(免费)，并进行消息收发完整代码。

#### 2.1 添加 pom 依赖

```xml
<dependencies>
   <dependency>
       <groupId>org.eclipse.paho</groupId>
       <artifactId>org.eclipse.paho.client.mqttv3</artifactId>
       <version>1.2.5</version>
   </dependency>
</dependencies>
```

#### 2.3 订阅方

此程序运行之后就会一直监听topic[test2], 只要这个topic中有新的消息,就会触发messageArrived方法,接收到这些新消息。

```java
import org.eclipse.paho.client.mqttv3.*;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;

/**
 * 订阅端
 */
public class SubscribeSample {

    public static void main(String[] args) {
        //EMQ X 默认端口 1883
        String broker = "tcp://broker-cn.emqx.io:1883";
        String topic = "test2";
        int qos = 1;
        String clientid = "subClient";
        String userName = "admin";
        String passWord = "password";
        try {
            // host为主机名，test为clientid即连接MQTT的客户端ID，一般以客户端唯一标识符表示，MemoryPersistence设置clientid的保存形式，默认为以内存保存
            MqttClient client = new MqttClient(broker, clientid, new MemoryPersistence());
            // MQTT的连接设置
            MqttConnectOptions options = new MqttConnectOptions();
            // 设置是否清空session,这里如果设置为false表示服务器会保留客户端的连接记录，这里设置为true表示每次连接到服务器都以新的身份连接
            options.setCleanSession(true);
            // 设置连接的用户名
            options.setUserName(userName);
            // 设置连接的密码
            options.setPassword(passWord.toCharArray());
            // 设置超时时间 单位为秒
            options.setConnectionTimeout(10);
            // 设置会话心跳时间 单位为秒 服务器会每隔1.5*20秒的时间向客户端发送个消息判断客户端是否在线，但这个方法并没有重连的机制
            options.setKeepAliveInterval(20);
            // 设置回调函数
            client.setCallback(new MqttCallback() {

                public void connectionLost(Throwable cause) {
                    System.out.println("connectionLost");
                }

                public void messageArrived(String topic, MqttMessage message) {
                    System.out.println("======监听到来自[" + topic + "]的消息======");
                    System.out.println("message content:" + new String(message.getPayload()));
                    System.out.println("============");
                }

                public void deliveryComplete(IMqttDeliveryToken token) {
                    System.out.println("deliveryComplete---------" + token.isComplete());
                }

            });

            // 建立连接
            System.out.println("连接到 broker: " + broker);
            client.connect(options);

            System.out.println("连接成功.");
            //订阅消息
            client.subscribe(topic, qos);
            System.out.println("开始监听" + topic);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

运行上述订阅方代码,控制台输出如下：

```text
连接到 broker: tcp://broker-cn.emqx.io:1883
连接成功.
开始监听test2
```

#### 2.4 发布方

接着某个发布方启动，并发送消息，代码如下：

```java
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;

/**
 *发布端
 */
public class PublishSample {
    public static void main(String[] args) {
        String topic = "test2";
        String content = "hello 哈哈";
        int qos = 1;
        String broker = "tcp://broker-cn.emqx.io:1883";
        String userName = "admin";
        String password = "password";
        String clientId = "pubClient";
        // 内存存储
        MemoryPersistence persistence = new MemoryPersistence();

        try {
            // 创建客户端
            MqttClient sampleClient = new MqttClient(broker, clientId, persistence);
            // 创建链接参数
            MqttConnectOptions connOpts = new MqttConnectOptions();
            // 在重新启动和重新连接时记住状态
            connOpts.setCleanSession(false);
            // 设置连接的用户名
            connOpts.setUserName(userName);
            connOpts.setPassword(password.toCharArray());
            // 建立连接
            System.out.println("连接到 broker: " + broker);
            sampleClient.connect(connOpts);
            System.out.println("连接成功.");
            // 创建消息
            MqttMessage message = new MqttMessage(content.getBytes());
            // 设置消息的服务质量
            message.setQos(qos);
            // 发布消息
            System.out.println("向" + topic + "发送消息:" + message);
            sampleClient.publish(topic, message);
            // 断开连接
            sampleClient.disconnect();
            // 关闭客户端
            sampleClient.close();
        } catch (MqttException me) {
            System.out.println("reason " + me.getReasonCode());
            System.out.println("msg " + me.getMessage());
            System.out.println("loc " + me.getLocalizedMessage());
            System.out.println("cause " + me.getCause());
            System.out.println("excep " + me);
            me.printStackTrace();
        }
    }
}
```

启动发布方, 发送一次消息, 发布方控制台输出如下

```text
连接到 broker: tcp://broker-cn.emqx.io:1883
连接成功.
向test2发送消息:hello 哈哈
```

接着查看订阅方的控制台, 输出如下

```text
连接到 broker: tcp://broker-cn.emqx.io:1883
连接成功.
开始监听test2
======监听到来自[test2]的消息======
message content:hello 哈哈
============
```



#### 2.4 MQTT 连接创建方式

##### 2.4.1 普通 TCP 连接

Demo验证使用 EMQX 提供的 免费公共 MQTT 服务器，该服务基于 EMQX 的 MQTT 云平台 创建。服务器接入信息如下：

- Broker: `broker.emqx.io`（中国用户可以使用 `broker-cn.emqx.io`）
- TCP Port: `1883`
- SSL/TLS Port: `8883`

设置 MQTT Broker 基本连接参数，用户名、密码为非必选参数。

```java
String broker = "tcp://broker.emqx.io:1883";
// TLS/SSL
// String broker = "ssl://broker.emqx.io:8883";
String username = "emqx";
String password = "public";
String clientid = "publish_client";
```

然后创建 MQTT 客户端并连接。

```java
MqttClient client = new MqttClient(broker, clientid, new MemoryPersistence());
MqttConnectOptions options = new MqttConnectOptions();
options.setUserName(username);
options.setPassword(password.toCharArray());
client.connect(options);
```

说明

- MqttClient: 同步调用客户端，使用阻塞方法通信。

- MqttClientPersistence: 代表一个持久的数据存储，用于在传输过程中存储出站和入站的信息，使其能够传递到指定的 QoS。

- MqttConnectOptions: 连接选项，用于指定连接的参数，下面列举一些常见的方法。

- - setUserName: 设置用户名
  - setPassword: 设置密码
  - setCleanSession: 设置是否清除会话
  - setKeepAliveInterval: 设置心跳间隔
  - setConnectionTimeout: 设置连接超时时间
  - setAutomaticReconnect: 设置是否自动重连

##### 2.4.2 TLS/SSL 连接

如果要使用自签名证书进行 TLS/SSL 连接，需添加 bcpkix-jdk15on 到 pom.xml 文件。

```xml
<!-- https://mvnrepository.com/artifact/org.bouncycastle/bcpkix-jdk15on -->
<dependency>
   <groupId>org.bouncycastle</groupId>
   <artifactId>bcpkix-jdk15on</artifactId>
   <version>1.70</version>
</dependency>
```

然后使用如下代码创建 SSLUtils.java 文件。

```java
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.openssl.PEMKeyPair;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManagerFactory;
import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.FileReader;
import java.security.KeyPair;
import java.security.KeyStore;
import java.security.Security;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

public class SSLUtils {
   public static SSLSocketFactory getSocketFactory(final String caCrtFile,
                                                   final String crtFile, final String keyFile, final String password)
           throws Exception {
       Security.addProvider(new BouncyCastleProvider());

       // load CA certificate
       X509Certificate caCert = null;

       FileInputStream fis = new FileInputStream(caCrtFile);
       BufferedInputStream bis = new BufferedInputStream(fis);
       CertificateFactory cf = CertificateFactory.getInstance("X.509");

       while (bis.available() > 0) {
           caCert = (X509Certificate) cf.generateCertificate(bis);
      }

       // load client certificate
       bis = new BufferedInputStream(new FileInputStream(crtFile));
       X509Certificate cert = null;
       while (bis.available() > 0) {
           cert = (X509Certificate) cf.generateCertificate(bis);
      }

       // load client private key
       PEMParser pemParser = new PEMParser(new FileReader(keyFile));
       Object object = pemParser.readObject();
       JcaPEMKeyConverter converter = new JcaPEMKeyConverter().setProvider("BC");
       KeyPair key = converter.getKeyPair((PEMKeyPair) object);
       pemParser.close();

       // CA certificate is used to authenticate server
       KeyStore caKs = KeyStore.getInstance(KeyStore.getDefaultType());
       caKs.load(null, null);
       caKs.setCertificateEntry("ca-certificate", caCert);
       TrustManagerFactory tmf = TrustManagerFactory.getInstance("X509");
       tmf.init(caKs);

       // client key and certificates are sent to server so it can authenticate
       KeyStore ks = KeyStore.getInstance(KeyStore.getDefaultType());
       ks.load(null, null);
       ks.setCertificateEntry("certificate", cert);
       ks.setKeyEntry("private-key", key.getPrivate(), password.toCharArray(),
               new java.security.cert.Certificate[]{cert});
       KeyManagerFactory kmf = KeyManagerFactory.getInstance(KeyManagerFactory
              .getDefaultAlgorithm());
       kmf.init(ks, password.toCharArray());

       // finally, create SSL socket factory
       SSLContext context = SSLContext.getInstance("TLSv1.2");
       context.init(kmf.getKeyManagers(), tmf.getTrustManagers(), null);

       return context.getSocketFactory();
  }
}
```

参照如下设置 options。

```java
// 设置 SSL/TLS 连接地址
String broker = "ssl://broker.emqx.io:8883";
// 设置 socket factory
String caFilePath = "/cacert.pem";
String clientCrtFilePath = "/client.pem";
String clientKeyFilePath = "/client.key";
SSLSocketFactory socketFactory = getSocketFactory(caFilePath, clientCrtFilePath, clientKeyFilePath, "");
options.setSocketFactory(socketFactory);
```

> .pem 和 .key为CA证书和私钥。
>
> 参考： [OpenSSL创建生成CA证书、服务器、客户端证书及密钥](https://blog.csdn.net/qq153471503/article/details/109524764)