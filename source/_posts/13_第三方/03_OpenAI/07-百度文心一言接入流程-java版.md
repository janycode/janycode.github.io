---
title: 07-百度文心一言接入流程-java版
date: 2024-07-29 12:51:49
index_img: https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241026114200.png
tags:
- 第三方
- OpenAI
- chatGPT
- 文心一言
categories: 
- 13_第三方
- 03_OpenAI
---

![image-20240729115444178](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240729115539.png)

参考资料：

* 百度文心一言：https://yiyan.baidu.com/
* 百度千帆大模型：https://qianfan.cloud.baidu.com/
* 百度千帆大模型文档：https://cloud.baidu.com/doc/WENXINWORKSHOP/index.html
* 千tokens调用费用说明：https://cloud.baidu.com/doc/WENXINWORKSHOP/s/hlrk4akp7
* 千帆SDK和java接入文档：https://github.com/baidubce/bce-qianfan-sdk/tree/main/java

> 文心一言，有用、有趣、有温度。
> 既能写文案、读文档，又能脑洞大开、答疑解惑，还能倾听你的故事、感受你的心声。快来和我对话吧！

### 一、准备工作

1. 进入百度智能云

2. 登陆账号中的【安全认证】中创建 AK 和 SK
   ![image-20240729155255355](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240729155256.png)

   PS：【千帆大模型平台】中【模型广场】中有很多`免费`的模型，可以根据情况使用。如：
   ![image-20240729141001744](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20240729141003.png)

3. 进行接口调用。



### 二、API接口调用-java

1. 添加 pom 依赖

   ```xml
   <dependency>
       <groupId>com.baidubce</groupId>
       <artifactId>qianfan</artifactId>
       <version>0.0.9</version>
   </dependency>
   ```

   

2. 调用执行

   ```java
   public class ApiConstant {
       public static final String AK = "xxx";
       public static final String SK = "yyy";
   
   }
   ```

   ChatDemo.java

   ```java
   import com.baidubce.qianfan.Qianfan;
   import com.baidubce.qianfan.model.chat.ChatResponse;
   
   public class ChatDemo {
       public static void main(String[] args) {
           //使用安全认证AK/SK鉴权，替换下列示例中参数，安全认证Access Key替换your_iam_ak，Secret Key替换your_iam_sk
           Qianfan qianfan = new Qianfan(ApiConstant.AK, ApiConstant.SK);
           
           //普通对话
          ChatResponse resp = qianfan.chatCompletion()
                  //指定模型：有免费的，比如 ERNIE-Speed-8K
                  .model("ERNIE-Speed-8K")
                  //也可以使用endpoint指定任意模型 (二选一)
                  //.endpoint("completions_pro")
                  //role角色：， content内容: 添加用户消息 (此方法可以调用多次，以实现多轮对话的消息传递)
                  .addMessage("user", "在沙漠里有两瓶水，一瓶毒药，一瓶尿，你快渴死了你会喝什么？")
                  //自定义超参数
                  .temperature(0.7)
                  .execute();
           System.out.println(resp.getResult());
       }
   }
   ```

   ChatStreamDemo.java

   ```java
   import com.baidubce.qianfan.Qianfan;
   import com.baidubce.qianfan.model.chat.ChatResponse;
   
   public class ChatStreamDemo {
       public static void main(String[] args) {
           //使用安全认证AK/SK鉴权，替换下列示例中参数，安全认证Access Key替换your_iam_ak，Secret Key替换your_iam_sk
           Qianfan qianfan = new Qianfan(ApiConstant.AK, ApiConstant.SK);
   
           //流式请求
           qianfan.chatCompletion()
                   //指定模型：有免费的，比如 ERNIE-Speed-8K
                   .model("ERNIE-Speed-8K")
                   //role角色：， content内容: 添加用户消息 (此方法可以调用多次，以实现多轮对话的消息传递)
                   .addMessage("user", "在沙漠里有两瓶水，一瓶毒药，一瓶尿，你快渴死了你会喝什么？")
                   //发起流式请求
                   .executeStream()
                   //流式迭代，并打印消息
                   .forEachRemaining(chunk -> System.out.print(chunk.getResult()));
       }
   }
   ```

   PromptDemo.java

   ```java
   import com.baidubce.qianfan.Qianfan;
   import com.baidubce.qianfan.core.StreamIterator;
   import com.baidubce.qianfan.model.completion.CompletionResponse;
   
   import java.io.IOException;
   
   public class PromptDemo {
       public static void main(String[] args) {
           //使用安全认证AK/SK鉴权，替换下列示例中参数，安全认证Access Key替换your_iam_ak，Secret Key替换your_iam_sk
           Qianfan qianfan = new Qianfan(ApiConstant.AK, ApiConstant.SK);
           /*
               CompletionResponse response = new Qianfan().completion()
               .model("CodeLlama-7b-Instruct")
               // 与Chat类似，但通过prompt传入指令
               .prompt("hello")
               .execute();
               System.out.println(response.getResult());
            */
           //流式请求
           try (StreamIterator<CompletionResponse> response = qianfan.completion()
                   .model("CodeLlama-7b-Instruct")
                   .prompt(PROMPT_EG1)
                   .executeStream()) {
               while (response.hasNext()) {
                   System.out.print(response.next().getResult());
               }
           } catch (IOException e) {
               throw new RuntimeException(e);
           }
       }
   
       public static final String PROMPT_EG1 = "你是一个经验丰富的程序员，对编程代码和程序设计都很精通。" +
               "目标：\n" +
               "1. 设计一个存储用户信息的json对象\n" +
               "2. 该用户信息里必须包含常见的通用字段\n" +
               "3. 尽可能多的列举字段 和 示例\n" +
               "强制：只输出JSON格式的内容，不要输出其他任何内容\n" +
               "响应格式:\n" +
               "{\n" +
               "    \"user\": {\n" +
               "        \"name\": \"姓名\",\n" +
               "        \"age\": \"年龄\",\n" +
               "        \"gender\": \"性别\",\n" +
               "        \"phone\": \"手机号\"\n" +
               "    }\n" +
               "}\n" +
               "确保响应可以被java fastjson解析\n";
   
   }
   ```



### 三、百度Prompt工程

参考文档：https://cloud.baidu.com/doc/WENXINWORKSHOP/s/wlommlzgj





