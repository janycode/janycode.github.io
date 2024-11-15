---
title: 01-接入chatGPT API
date: 2023-04-20 14:48:37
tags:
- 第三方
- OpenAI
- chatGPT
categories: 
- 13_第三方
- 03_OpenAI
---

![image-20230420144823328](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230420144824.png)

ChatGPT平台已经为技术提供了一个入口了，作为一个Java程序员，我们第一时间想到的就是快速开发一个应用，接入ChatGPT的接口，很简单的就可以实现了。

> 当然一切的前提是：科学上网，懂的都懂。
>
> ![image-20230420151318093](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230420151319.png)

### 一、准备工作

（1）已成功注册 OpenAI 的账号。

（2）创建 API KEY，这个 API KEY 是用于 HTTP 请求身份验证的，可以创建多个。注意这个创建之后需要马上复制好保存，关闭弹框之后就看不到了。

（3）官方 API 文档链接：https://platform.openai.com/docs/api-reference/authentication

（4）注意 API 调用是收费的，但是 OpenAI 已经为我们免费提供了18美元的用量，足够大家放心使用。

![image-20230420145025878](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230420145026.png)

### 二、补全接口示例

该接口功能较多，支持最常用的问答功能。

（1）请求方式，Post

（2）url：https://api.openai.com/v1/completions

（3）请求体 (json)。

```json
{
  "model": "text-davinci-003",
  "prompt": "Say this is a test",
  "max_tokens": 7,
  "temperature": 0,
  "top_p": 1,
  "n": 1,
  "stream": false
}
```

（4）接口文档

https://platform.openai.com/docs/api-reference/completions/create

请求参数解析：

| **字段**    | **说明**                                                     |
| ----------- | ------------------------------------------------------------ |
| model       | 可选参数。语言模型，这里选择的是text-davinci-003             |
| `prompt`    | 必选参数。即用户的输入。                                     |
| max_tokens  | 可选参数，默认值为 16。最大分词数，会影响返回结果的长度。    |
| temperature | 可选参数，默认值为 1，取值 0-2。该值越大每次返回的结果越随机，即相似度越小。 |
| top_p       | 可选参数，与temperature类似。                                |
| n           | 可选参数，默认值为 1。表示对每条prompt生成多少条结果。       |
| stream      | 可选参数，默认值为false。表示是否回流部分结果。              |

### 三、申请API-KEY

访问地址：https://platform.openai.com/account/api-keys

登录账号，然后创建API KEY:

![image-20230420145224006](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230420145224.png)

这个 API KEY 是用于 HTTP 请求身份验证的，可以创建多个。注意这个创建之后需要马上复制好保存，关闭弹框之后就看不到了。

### **四、JavaScript调用API**

直接可以使用 js+html 开发一个对话，具体的源码如下：

```html
<!doctype html>
<html class="no-js" lang="">

   <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <title>Ai - Chat</title>
      <meta name="description" content="">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
         #chatgpt-response {
            font-family: "宋体";
            font-size: 20px;
            color: #0000FF;
            font-weight: bold;
         }
</style>

      <script>
         async function callCHATGPT() {
            var responseText1 = document.getElementById("chatgpt-response");
            responseText1.innerHTML = ""

            function printMessage(message) {
               var responseText = document.getElementById("chatgpt-response");
               var index = 0;

               // 创建一个定时器，每隔一段时间打印一个字符
               var interval = setInterval(function() {
                     responseText.innerHTML += message[index];
                     index++;

                     // 当打印完成时，清除定时器
                     if (index >= message.length) {
                        clearInterval(interval);
                     }
                  },
                  150); // 每隔50毫秒打印一个字符
            }
            var xhr = new XMLHttpRequest();
            var url = "https://api.openai.com/v1/completions";
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Authorization", "Bearer API-KEY");
            xhr.onreadystatechange = function() {
               if (xhr.readyState === 4 && xhr.status === 200) {
                  var json = JSON.parse(xhr.responseText);
                  var response = json.choices[0].text;

                  // 将CHATGPT的返回值输出到文本框
                  var responseText = document.getElementById("chatgpt-response");
                  var index = 0;

                  // 创建一个定时器，每隔一段时间打印一个字符
                  var interval = setInterval(function() {
                        responseText.innerHTML += response[index];
                        index++;

                        // 当打印完成时，清除定时器
                        if (index >= response.length) {
                           clearInterval(interval);
                        }
                     },
                     50); // 每隔50毫秒打印一个字符
               }
            };

            var data = JSON.stringify({
               "prompt": document.getElementById("chat-gpt-input").value,
               "max_tokens": 2048,
               "temperature": 0.5,
               "top_p": 1,
               "frequency_penalty": 0,
               "presence_penalty": 0,
               "model": "text-davinci-003"
            });
            console.log(data);
            await printMessage('正在思考，请等待......');
            await xhr.send(data);
         }
</script>
   </head>

   <body>

      <div class="filter-menu text-center mb-40">
         <h4>与Ai对话，请描述您的需求-支持中文、英语、日本语等</h4>
      </div>

      <textarea class="form-control" id="chat-gpt-input" placeholder="输入描述" rows="3" resize="none"
         style="width: 135%; margin: 0 auto; background-color: #f4f4f4; color: #333; border: 1px solid #ccc; border-radius: 12px;"></textarea>
      <button onclick="callCHATGPT()" autocomplete="off" class="btn btn-large" href="#"
         style="background-color: #333; color: #f4f4f4; border-radius: 10px">
         <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>回答
      </button>
      <textarea class="form-control" id="chatgpt-response"
         placeholder="请耐心等待回答 Ai生成它很快，但是由于网络问题我们需要等待，通常内容越长等待越久 如果长时间没反应请刷新页面重试" rows="26" resize="none"
         style="width: 150%;height: auto; margin: 0 auto; background-color: #f4f4f4; color: #333; border: 1px solid #ccc; border-radius: 10px; overflow: scroll;"
         readonly="true">
       </textarea>
```

注意：需要替换自己的api-key，修改这一行代码：

```java
xhr.setRequestHeader("Authorization", "Bearer API-KEY")。
```

运行一下html，看下效果：

![image-20230420145410080](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230420145410.png)

### 五、SpringBoot整合ChatGPT

（1）构建一个Spring Boot项目，这里使用的是 GPT-3

（2）引入依赖：

```xml
<dependency>
    <groupId>com.theokanning.openai-gpt3-java</groupId>
    <artifactId>service</artifactId>
    <version>0.10.0</version>
</dependency>
```

官网链接地址：https://platform.openai.com/docs/libraries/community-libraries

（3）请求代码：

```java
String token = "API-KEY "; //System.getenv("OPENAI_TOKEN");

OpenAiService service = new OpenAiService(token);
CompletionRequest completionRequest = CompletionRequest.builder()
        .model("text-davinci-003")
        .prompt("今天天气怎么样？")
        .temperature(0.5)
        .maxTokens(2048)
        .topP(1D)
        .frequencyPenalty(0D)
        .presencePenalty(0D)
        .build();
service.createCompletion(completionRequest).getChoices().forEach(System.out::println);
```

请替换 API-KEY。

运行程序验证即可。

### 六、使用curl模拟请求

```shell
  curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

![image-20230420150616992](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230420150617.png)

![image-20230420151819429](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230420151820.png)