---
title: 06-JS&Java JSON解析转换
date: 2018-5-4 19:19:22
tags:
- JavaScript
- JSON
categories: 
- 04_大前端
- 03_JavaScript
---

JSON字符串在线格式化工具：[JSON在线格式化](https://c.runoob.com/front-end/53)

### 1. JSON字符串格式
`同步请求`中，数据从后台到前端，需要将数据对象存储在 `域对象` 中；
`异步请求`中，数据从后台到前端，需要将数据对象转换为 `JSON 字符串`。
根据 JavaBean 对象生成对应的 JSON 字符串。

```json
// 1个值
{"键1":值1, "键2":值2}
// 1组值
[{"键1":值1, "键2":值2}, {"键1":值1, "键2":值2}]
```

### 2. JSON 在 Java 中的转换

![image-20200622194955596](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200622194957.png)

#### 2.1 FastJSON 使用
依赖 jar 包：
- fastjson-1.2.62.jar

将JavaBean序列化为JSON文本：
public static final String `toJSONString`(Object object); 
把JSON文本解析为JavaBean：
public static final \<T> T `parseObject`(String text, Class\<T> clazz);

```java
class User {
    private String username;
    private String password;
    /* 构造、get、set */
}

/**
 * java对象转 json字符串 
 */
@Test
public void objectTOJson(){
	//简单java类转json字符串
	User user = new User("dmego", "123456");
	String UserJson = JSON.toJSONString(user);
	System.out.println("简单java类转json字符串:"+UserJson);
	
	//List<Object>转json字符串
	User user1 = new User("zhangsan", "123123");
	User user2 = new User("lisi", "321321");
	List<User> users = new ArrayList<User>();
	users.add(user1);
	users.add(user2);
	String ListUserJson = JSON.toJSONString(users);
	System.out.println("List<Object>转json字符串:"+ListUserJson);	
	
	//复杂java类转json字符串
	UserGroup userGroup = new UserGroup("userGroup", users);
	String userGroupJson = JSON.toJSONString(userGroup);
	System.out.println("复杂java类转json字符串:"+userGroupJson);		
	
}
/**
 * json字符串转java对象
 * 注：字符串中使用双引号需要转义 (" --> \"),这里使用的是单引号
 */
@Test
public void JsonTOObject(){
	/* json字符串转简单java对象
     * 字符串：{"password":"123456","username":"dmego"}*/
	
	String jsonStr1 = "{'password':'123456','username':'dmego'}";
	User user = JSON.parseObject(jsonStr1, User.class);
	System.out.println("json字符串转简单java对象:"+user.toString());
	
	/*
	 * json字符串转List<Object>对象
	 * 字符串：[{"password":"123123","username":"zhangsan"},{"password":"321321","username":"lisi"}]
	 */
	String jsonStr2 = "[{'password':'123123','username':'zhangsan'},{'password':'321321','username':'lisi'}]";
	List<User> users = JSON.parseArray(jsonStr2, User.class);
	System.out.println("json字符串转List<Object>对象:"+users.toString());
		
	/*json字符串转复杂java对象
	 * 字符串：{"name":"userGroup","users":[{"password":"123123","username":"zhangsan"},{"password":"321321","username":"lisi"}]}
	 * */
	String jsonStr3 = "{'name':'userGroup','users':[{'password':'123123','username':'zhangsan'},{'password':'321321','username':'lisi'}]}";
	UserGroup userGroup = JSON.parseObject(jsonStr3, UserGroup.class);
	System.out.println("json字符串转复杂java对象:"+userGroup);	
}
```

#### 2.2 Jackson 使用
依赖 jar 包：
- jackson-annotations-2.9.9.jar
- jackson-core-2.9.9.jar
- jackson-databind-2.9.9.jar

将JavaBean序列化为JSON文本：
public String `writeValueAsString`(Object value) throws JsonProcessingException;
把JSON文本解析为JavaBean：
public \<T> T `readValue`(String content, Class\<T> valueType) throws JsonParseException;

```java
class Province {
    private Integer pId;
    private String pName;
    private List<City> cityList;
    /* 构造、get、set */
}

public class TestJackson {
    public static void main(String[] args) throws Exception {
        Province p1 = new Province(1, "河南省");
        List<City> cityList = new ArrayList<>();
        cityList.add(new City(11, "郑州市"));
        cityList.add(new City(11, "洛阳市"));
        cityList.add(new City(11, "开封市"));
        p1.setCityList(cityList);
        // java对象 >> json字符串
        ObjectMapper objectMapper = new ObjectMapper();
        String json1 = objectMapper.writeValueAsString(p1); // 可转对象/list/map
        System.out.println(json1);

        // 将json字符串转换为java对象
        Province province = objectMapper.readValue(jsonP1, Province.class);
        List list = objectMapper.readValue(jsonList, List.class);
        Map map = objectMapper.readValue(jsonMap, Map.class);
    }
}
```

#### 2.3 Gson 使用
依赖 jar 包：
- gson-2.8.5.jar

将JavaBean序列化为JSON文本：
public String `toJson`(Object src);
把JSON文本解析为JavaBean：
public \<T> T `fromJson`(String json, Class\<T> classOfT) throws JsonSyntaxException;

```java
// 生成JSON
Gson gson = new Gson();
User user = new User("张三",24);
String jsonObject = gson.toJson(user); // {"name":"张三kidou","age":24}
// 解析JSON
Gson gson = new Gson();
String jsonString = "{\"name\":\"张三\",\"age\":24}";
User user = gson.fromJson(jsonString, User.class);
```

#### 2.4 三种工具性能对比
三种工具均可转换：
- FastJSON
- Jackson
- Gson

> 【总结】
> 1. **Java对象JSON序列化**：
> `Jackson速度最快`，在测试中比Gson快接近50%，FastJSON和Gson速度接近。
> 2. **JSON反序列化成Java对象**：
> FastJSON、`Jackson速度最快`且接近，Gson速度稍慢，不过差距很小。
> 3. **复杂的JSON结构转换稳定性**：
> Gson成功率明显比FastJSON、Jackson都要高，`复杂JSON结构转换时稳定性Gson最好`。


### 3. JSON 在 JavaScript 中的转换
JSON全局对象：
```javascript
<html>
<head>
    <title>测试json</title>
    <script>
        function f_json() {
            var user = {
                "name": "周杰伦",
                "address": "中国台湾"
            };
            //将 JS 对象转换成 JSON 字符串
            var str = JSON.stringify(user);
            alert(str);
            //将 JSON 字符串转换成 js 对象
            var zxy = JSON.parse(str);
            alert(zxy.name + "," + zxy.address);
        }
    </script>
</head>
<body>
<button onclick="f_json()">测试</button>
</body>
</html>
```
eval() 全局方法：
```javascript
<script>
	// JSON 字符串转换为 JS 对象：eval()
    var jsonStr = '{"username":"root", "password":"1234"}';
    var obj = eval("(" + jsonStr + ")"); // 固定语法，将json字符串转换成js对象
    console.log(obj.username + "," + obj.password);
</script>
```



### 4. JSON字符串序列化顺序

`json字符串序列化后如何保持顺序不变`

使用阿里巴巴的fastjson对json字符串进行序列化，序列化之后发现顺序发生了改变，导致之后业务出现问题。

解决方法：

```java
LinkedHashMap<String, Object> json = JSON.parseObject(message, LinkedHashMap.class, Feature.OrderedField);
JSONObject jsonObject = new JSONObject(true);
jsonObject.putAll(json);
```

先将字符串转化为LinkedHashMap，然后定义有序的json对象，将map对象复制到json对象中即可。

其实

```java
LinkedHashMap<String, Object> json=这边设置获取数据；
JSONObject jsonObject = new JSONObject(true);
jsonObject.putAll(json);
```

json顺序也不变了。

