---
title: 01-Java21+Groovy动态脚本
date: 2026-04-07 22:54:54
index_img: https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260328142921455.png
tags:
- Java21
- Groovy
categories: 
- 02_编程语言
- 01_Java
- 06_Java21
---

![java21](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20260328142921455.png)

参考资料：

* https://cloud.tencent.com/developer/section/1491437



**核心定位**：Groovy 是 Apache 基金会开源的、基于 JVM 的动态脚本语言，是 Java 的完美超集——所有 Java 代码可直接在 Groovy 中运行，无需修改。

Groovy 凭借简洁的语法、强大的动态特性，能快速实现 Java 项目的动态脚本扩展（如动态规则配置、脚本化计算等），且与 Java 兼容性极佳，是 Java 项目实现“灵活扩展”的优选方案。

## 一、Groovy 与 Java21 的核心关联

### 1. 版本兼容

- Groovy **4.0.15+** 版本完全兼容 Java（推荐最新稳定版 *4.0.22*），支持 Java 的虚拟线程、模式匹配等新特性。
- 旧版本（Groovy 3.x 及以下）不支持 Java，会出现编译报错、运行异常，务必选择 4.0.15+ 版本。
- Groovy 本质是 JVM 语言，编译后生成 class 文件，与 Java 字节码完全兼容，可与 Java 类双向互调、无缝集成。

### 2. 集成核心价值

- ✅ 动态扩展：无需重启 Java 服务，即可修改脚本实现业务规则调整（如动态计算、权限校验）。
- ✅ 语法简洁：Groovy 简化了 Java 的繁琐语法（省略分号、get/set 方法、main 方法等），提升开发效率。
- ✅ 无缝兼容：Java 的类、接口、第三方依赖（如 Spring Boot、MyBatis）可直接在 Groovy 中使用，反之亦然。
- ✅ 脚本化能力：支持字符串形式的脚本动态执行，适合实现可配置的业务逻辑（如动态规则引擎）。

## 二、Java 项目集成 Groovy

本章节聚焦“集成实操”，覆盖 IDEA 配置、Maven 依赖引入、集成测试，确保你能快速将 Groovy 集成到已有的 Java 项目中，或新建集成项目。

### 1. IDEA 环境配置

前提：如基于 JDK21，确保已安装 Java JDK，并配置好环境变量（java -version 可正常显示 21 版本）。

1. 打开 IDEA → File → Settings → Plugins → 搜索 `Groovy`（Apache 官方插件，IDEA 自带，无需额外下载），启用后重启 IDEA。
2. 新建 Java 项目（或打开已有 Java 项目）：        
   1. 新建项目：选择 Java → 配置 JDK 为 Java → 完成。
   2. 已有项目：确认 Project Structure → Project SDK 为 Java。
3. 为项目添加 Groovy 支持：        
   1. 右键项目 → Add Framework Support → 勾选 `Groovy` → 选择 Groovy SDK（若未检测到，点击 Download 下载 4.0.22 版本，自动适配 Java）。
   2. 配置完成后，可新建 `.groovy` 文件，IDE 会自动识别并提供语法提示。

### 2. Maven 依赖集成

`生产环境必备，核心步骤`

在 Java 项目的 `pom.xml` 中引入 Groovy 核心依赖，无需额外配置，即可实现 Groovy 与 Java 的无缝集成，支持 Groovy 脚本编译、运行。

```xml
<properties>
    <java.version>21</java.version>
    <groovy.version>4.0.22</groovy.version> <!-- 兼容 Java 的最新稳定版 -->
</properties>

<dependencies>
    <!-- Apache Groovy 核心依赖（包含所有 Groovy 核心功能） -->
    <dependency>
        <groupId>org.codehaus.groovy</groupId><!-- Groovy 官方groupId -->
        <artifactId>groovy-all</artifactId>
        <version>${groovy.version}</version>
        <type>pom</type>
    </dependency>

   <!-- 可选：Groovy 沙箱依赖（生产环境安全防护，防止恶意脚本执行） -->
    <dependency>
        <groupId>org.craftercms</groupId>
        <artifactId>groovy-sandbox</artifactId>
        <version>4.0.0</version>
    </dependency>
</dependencies>

<build>
    <plugins>
        <!-- 编译插件：同时编译 Java 和 Groovy 代码（适配 Java） -->
        <plugin>
            <groupId>org.codehaus.groovy</groupId>
            <artifactId>groovy-maven-plugin</artifactId>
            <version>${groovy.version}</version>
            <executions>
                <execution>
                    <goals>
                        <goal>compile</goal> <!-- 编译 Groovy 代码 -->
                        <goal>testCompile</goal> <!-- 编译 Groovy 测试代码 -->
                    </goals>
                    <configuration>
                        <source>21</source> <!-- 适配 Java 源码版本 -->
                        <target>21</target> <!-- 适配 Java 目标版本 -->
                    </configuration>
                </execution>
            </executions>
        </plugin>

        <!-- Java 编译插件（确保 Java 代码正常编译） -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.11.0</version>
            <configuration>
                <source>21</source>
                <target>21</target>
                <encoding>UTF-8</encoding>
            </configuration>
        </plugin>
    </plugins>
</build>
```

依赖说明：

- `groovy-all`：Groovy 核心依赖，包含所有 Groovy 语法、动态特性、工具类，无需额外引入其他 Groovy 相关依赖。
- `groovy-maven-plugin`：Apache 官方提供的 Groovy 编译插件，确保 Groovy 代码能与 Java 代码一起编译，生成可运行的 class 文件。
- `groovy-sandbox`：可选依赖，用于生产环境安全防护，限制 Groovy 脚本的执行权限，防止恶意脚本调用危险 API（如文件操作、网络请求）。

### 3. 集成测试：双向互调

集成完成后，通过 2 个简单案例，验证 Java 能调用 Groovy 脚本/类，Groovy 能调用 Java 类，确保集成无问题。

#### 案例 1：Java 调用 Groovy 脚本

```Java
import groovy.lang.GroovyShell;
import java.util.HashMap;
import java.util.Map;

/**
 * Java 调用 Groovy 脚本（验证集成成功）
 */
public class JavaCallGroovyDemo {
    public static void main(String[] args) {
        // 1. 创建 Groovy 脚本引擎（核心类，用于执行 Groovy 脚本）
        GroovyShell groovyShell = new GroovyShell();

        // 2. 案例1：执行简单的 Groovy 表达式（动态计算）
        Object simpleResult = groovyShell.evaluate("1 + 2 * 3");
        System.out.println("简单脚本执行结果：" + simpleResult); // 输出：7

        // 3. 案例2：传递参数给 Groovy 脚本（Java 向 Groovy 传参）
        Map<String, Object> params = new HashMap<>();
        params.put("a", 10);
        params.put("b", 20);
        // 设置脚本参数
        params.forEach(groovyShell::setVariable);
        // 执行带参数的脚本
        Object paramResult = groovyShell.evaluate("a + b");
        System.out.println("带参数脚本执行结果：" + paramResult); // 输出：30

        // 4. 案例3：执行复杂 Groovy 脚本（集合操作）
        String complexScript = """
            def list = [1, 2, 3, 4, 5]
            // 过滤偶数并求和（Groovy 简洁语法）
            return list.findAll { it % 2 == 0 }.sum()
        """;
        Object complexResult = groovyShell.evaluate(complexScript);
        System.out.println("复杂脚本执行结果：" + complexResult); // 输出：6
    }
}
```

#### 案例 2：Groovy 调用 Java 类

```Java
/**
 * Java 实体类（Groovy 可直接调用，无需任何修改）
 */
public class JavaUser {
    private String name;
    private Integer age;

    // Java 标准构造方法、get/set 方法
    public JavaUser(String name, Integer age) {
        this.name = name;
        this.age = age;
    }

    public String getUserName() {
        return "Java 用户：" + name;
    }

    // 静态方法
    public static String getStaticInfo() {
        return "这是 Java 静态方法，Groovy 可直接调用";
    }

    // getter/setter（Groovy 可省略 get/set，直接通过属性名访问）
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
}
// Groovy 脚本，调用 Java 类
def javaUser = new JavaUser("张三", 25) // 直接实例化 Java 类

// 1. 调用 Java 实例方法
println javaUser.getUserName() // 输出：Java 用户：张三
// Groovy 简化写法（无需 get 方法，直接访问属性）
println "用户姓名：${javaUser.name}，年龄：${javaUser.age}" // 输出：用户姓名：张三，年龄：25

// 2. 调用 Java 静态方法
println JavaUser.getStaticInfo() // 输出：这是 Java 静态方法，Groovy 可直接调用

// 3. 调用 Java setter 方法
javaUser.setAge(26)
println "修改后年龄：${javaUser.age}" // 输出：修改后年龄：26
```

运行说明：将上述两个文件放入 Java 项目中，直接运行 Java 类或 Groovy 脚本，能正常输出结果，即说明 Groovy 与 Java 集成成功。

## 三、Groovy 核心语法

作为 Java 开发者，无需从头学习 Groovy，重点掌握其简化语法和核心特性即可，所有 Java 语法在 Groovy 中完全适用。

### 1. 变量定义：`def` 关键字

`动态类型，简化开发`

```Groovy
// Groovy 写法（简洁，自动类型推断）
def name = "张三" // 自动推断为 String
def age = 25     // 自动推断为 Integer
def salary = 12000.5 // 自动推断为 Double
def isMale = true // 自动推断为 Boolean

// 也可像 Java 一样写静态类型（推荐混合使用，兼顾安全和简洁）
String address = "北京市"
int phone = 13800138000

// 数组初始化（Groovy 简化写法）
def array1 = [1, 2, 3] // 自动推断为 List
int[] array2 = [4, 5, 6] as int[] // 转为 Java 数组
def array3 = new int[]{7, 8, 9} // 兼容 Java 写法
```

### 2. 字符串：3种写法 + 插值

`Groovy 核心简化特性`

```Groovy
// 1. 单引号：纯字符串，不支持插值（与 Java 一致）
def s1 = '普通字符串'

// 2. 双引号：支持 ${} 插值（最常用，简化字符串拼接）
def name = "李四"
def s2 = "我的名字是 ${name}，今年 ${2026 - 1998} 岁"
// 输出：我的名字是 李四，今年 28 岁

// 3. 三引号：保留换行和格式（写 SQL、JSON、HTML 神器，无需拼接）
def sql = """
    SELECT id, name, age
    FROM user
    WHERE id = ${userId}
    ORDER BY create_time DESC
"""

// 补充：字符串常用方法（Groovy 扩展方法，Java 可直接调用）
def str = "  Groovy  "
println str.trim() // 去除空格
println str.toUpperCase() // 转大写
println str.contains("Groovy") // 判断包含，返回 boolean
```

### 3. 空安全：彻底解决 Java 的 NPE 问题

```Groovy
// Java 写法（繁琐，需层层判断非空）
String userName = user == null ? null : user.getAddress() == null ? null : user.getAddress().getCity();

// Groovy 写法（安全导航运算符 ?.，自动判断非空）
String userName = user?.address?.city // 只要任意一步为 null，结果即为 null，不报错

// 猫王运算符 ?:：空值兜底（简化三目运算）
String userName = user?.name ?: "匿名用户" // 若 user?.name 为 null，返回 "匿名用户"

// 空值判断简化
def str = null
println str?.length() // 不会报错，返回 null
println str ?: "空字符串" // 输出：空字符串
```

### 4. 集合：比 Java Stream 简洁 10 倍

```Groovy
// 1. List 简化写法（无需 new ArrayList<>()）
def list = [1, 2, 3, 4, 5]

// 2. Map 简化写法（无需 new HashMap<>()，key 无需引号）
def map = [name: "王五", age: 30, city: "上海"]

// 3. 集合遍历（简化 Java 的 for-each）
list.each { println it } // it 是默认参数名，代表集合中的每个元素
list.each { num -> println "数字：${num}" } // 自定义参数名

// 4. 常用集合操作（比 Java Stream 简洁，无需链式调用）
def evenList = list.findAll { it % 2 == 0 } // 过滤偶数，返回 [2,4]
def squareList = list.collect { it * it } // 转换为平方，返回 [1,4,9,16,25]
def sum = list.sum() // 求和，返回 15
def max = list.max() // 最大值，返回 5
def first = list.find { it > 3 } // 找到第一个大于3的元素，返回 4

// 5. Map 操作（简化 Java 的 get/put）
println map.name // 等价于 map.get("name")，返回 "王五"
map.sex = "男" // 等价于 map.put("sex", "男")
map.each { key, value -> println "${key}: ${value}" } // 遍历 Map

// 6. 范围生成（Groovy 特有，简化连续序列）
def rang = 1..10 // 生成 1-10 的连续数字
def charRang = 'A'..'Z' // 生成 A-Z 的连续字符
rang.each { println "数字：${it}" } // 遍历范围
```

### 5. 方法：简化写法

`省略 return、分号、修饰符`

```Groovy
// 1. 简化方法定义（无需写 return，最后一行自动作为返回值）
def add(int a, int b) {
    a + b // 等价于 Java 的 return a + b;
}

// 调用方法（无需括号，简洁）
println add 1, 2 // 输出 3（也可写 add(1,2)，兼容 Java 写法）

// 2. 默认参数（简化 Java 的重载）
def sayHello(String name, String msg = "你好") {
    "${msg}，${name}"
}
println sayHello "赵六" // 输出：你好，赵六（使用默认参数）
println sayHello "赵六", "早上好" // 输出：早上好，赵六（覆盖默认参数）

// 3. 无参数方法（可省略括号）
def sayHi() {
    "Hi, Groovy!"
}
println sayHi // 输出：Hi, Groovy!

// 4. 与 Java 方法互调（无缝兼容）
def javaUser = new JavaUser("张三", 25)
println add javaUser.age, 5 // 调用 Groovy 方法，传入 Java 对象的属性
println javaUser.getUserName() // 调用 Java 方法，Groovy 中直接使用
```

### 6. 闭包（Closure）：Groovy 的灵魂

闭包是“可传递的代码块”，相当于 Java 的 Lambda，但功能更强大，是 Groovy 动态特性的`核心`，也是 Java 项目集成 Groovy 实现动态扩展的关键。

```Groovy
// 1. 定义闭包（格式：{ 参数 -> 代码块 }）
def closure = { String name ->
    println "Hello ${name}，我是 Groovy 闭包"
}

// 2. 调用闭包（两种方式）
closure.call("Java 开发者") // 方式1：call 方法调用
closure("Java 开发者") // 方式2：简化调用（省略 call）

// 3. 闭包作为方法参数（核心用法，实现动态逻辑）
def processList(List list, Closure closure) {
    list.each { closure(it) } // 遍历集合，执行闭包逻辑
}

// 调用方法，传入闭包（动态定义逻辑）
processList([1,2,3]) { num ->
    println num * 2 // 闭包逻辑：每个元素乘以 2，输出 2、4、6
}

// 4. 闭包默认参数 it（只有一个参数时，可省略参数定义）
def printItem = {
    println "元素：${it}" // it 代表默认参数
}
printItem(100) // 输出：元素：100
processList([4,5,6], printItem) // 传入闭包，输出 元素：4、元素：5、元素：6
```

## 四、Groovy 动态特性

Java 项目集成 Groovy 的核心价值，在于其动态特性——可在运行时动态执行脚本、添加属性/方法，实现业务逻辑的动态配置，无需重启服务。

### 1. 动态方法调用

`运行时调用任意方法`

```Groovy
def user = new JavaUser("张三", 25)

// Java 写法（固定方法调用）
user.setName("李四")

// Groovy 动态写法（方法名可动态拼接）
user."setName"("李四") // 字符串形式调用方法
def methodName = "setName"
user."${methodName}"("李四") // 动态拼接方法名，灵活调用

// 动态调用 Java 静态方法
def staticMethodName = "getStaticInfo"
println JavaUser."${staticMethodName}"() // 输出：这是 Java 静态方法，Groovy 可直接调用
```

### 2. 运行时添加属性和方法

`动态扩展 Java 类`

```Groovy
def user = new JavaUser("张三", 25)

// 1. 动态添加属性（Java 类本身没有该属性，运行时动态添加）
user.age = 25 // 若 Java 类已有 age 属性，直接赋值；若无，动态添加
user.sex = "男" // 动态添加 sex 属性
println user.sex // 输出：男

// 2. 动态添加方法（运行时给 Java 类添加新方法）
user.sayHello = {
    println "我是 ${name}，今年 ${age} 岁，性别：${sex}"
}
user.sayHello() // 调用动态添加的方法，输出：我是 张三，今年 25 岁，性别：男

// 3. 动态添加静态方法
JavaUser.staticMethod = {
    "动态添加的 JavaUser 静态方法"
}
println JavaUser.staticMethod() // 调用动态静态方法
```

### 3. 运行 Groovy 脚本文件

生产环境中，常用“脚本文件”形式管理 Groovy 逻辑，Java 服务可`动态加载脚本文件`，修改脚本后无需重启服务，直接生效。

```Java
import groovy.lang.GroovyClassLoader;
import java.io.File;

/**
 * Java 动态加载 Groovy 脚本文件
 */
public class GroovyFileLoader {
    public static void main(String[] args) throws Exception {
        // 1. 创建 Groovy 类加载器（用于加载脚本文件）
        GroovyClassLoader classLoader = new GroovyClassLoader();

        // 2. 加载 Groovy 脚本文件（路径：src/main/resources/groovy/TestScript.groovy）
        File scriptFile = new File("src/main/resources/groovy/TestScript.groovy");
        Class<?> scriptClass = classLoader.parseClass(scriptFile);

        // 3. 创建脚本实例，调用脚本方法
        Object scriptInstance = scriptClass.newInstance();
        // 调用脚本中的 run 方法（脚本中需定义 run 方法）
        Object result = scriptClass.getMethod("run").invoke(scriptInstance);
        System.out.println("脚本文件执行结果：" + result);

        // 4. 调用脚本中的带参方法
        Object paramResult = scriptClass.getMethod("calculate", int.class, int.class)
                .invoke(scriptInstance, 10, 20);
        System.out.println("带参方法执行结果：" + paramResult);
    }
}
// Groovy 脚本文件，可被 Java 动态加载
def run() {
    "Groovy 脚本文件执行成功（Java 动态加载）"
}

// 带参方法（可被 Java 调用）
def calculate(int a, int b) {
    a + b // 自动返回结果
}

// 调用 Java 类（脚本中可直接使用 Java 类）
def getUserInfo() {
    def user = new JavaUser("脚本用户", 30)
    return user.getUserName()
}
```

## 五、生产环境集成

Java 项目集成 Groovy 后，需关注性能、安全、可维护性，以下是企业级生产环境的最佳实践。

### 1. 性能优化：预编译脚本 + 缓存

每次调用 `GroovyShell.evaluate()` 或 `GroovyClassLoader.parseClass()` 都会重新编译脚本，性能较差。生产环境建议“预编译脚本并缓存”，提升执行效率。

```Java
import groovy.lang.GroovyShell;
import groovy.lang.Script;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Groovy 脚本缓存工具类（Java 生产环境专用）
 */
public class CachedGroovyScriptUtil {
    // 线程安全的脚本缓存（key：脚本ID/脚本内容MD5，value：预编译的脚本）
    private static final Map<String, Script> SCRIPT_CACHE = new ConcurrentHashMap<>();
    // 单例 Groovy 脚本引擎（避免频繁创建，提升性能）
    private static final GroovyShell GROOVY_SHELL = new GroovyShell();

    /**
     * 执行 Groovy 脚本（预编译 + 缓存）
     * @param scriptId 脚本唯一标识（如规则ID）
     * @param scriptCode 脚本内容
     * @param params 脚本参数
     * @return 脚本执行结果
     */
    public static Object executeScript(String scriptId, String scriptCode, Map<String, Object> params) {
        // 1. 从缓存获取预编译脚本，不存在则编译并缓存
        Script script = SCRIPT_CACHE.computeIfAbsent(scriptId, id -> GROOVY_SHELL.parse(scriptCode));

        // 2. 设置脚本参数（线程安全，每次执行前重置参数）
        script.setBinding(null); // 清空之前的参数
        params.forEach(script::setVariable);

        // 3. 执行脚本（复用预编译脚本，无需重新编译）
        return script.run();
    }

    // 手动清除缓存（如脚本更新后）
    public static void clearCache(String scriptId) {
        SCRIPT_CACHE.remove(scriptId);
    }
}
```

### 2. 安全防护：沙箱模式

生产环境中，若脚本来自用户输入或外部配置，必须启用 Groovy 沙箱，限制脚本的执行权限，防止恶意脚本调用危险 API（如文件操作、网络请求、反射），避免安全漏洞。

```Java
import groovy.lang.GroovyShell;
import org.codehaus.groovy.control.CompilerConfiguration;
import org.codehaus.groovy.control.customizers.ASTTransformationCustomizer;
import org.kohsuke.groovy.sandbox.SandboxTransformer;
import groovy.transform.ThreadInterrupt;

/**
 * Groovy 沙箱工具类（Java 生产环境安全防护）
 */
public class GroovySandboxUtil {
    // 带沙箱的 Groovy 脚本引擎（全局单例）
    private static final GroovyShell SANDBOX_GROOVY_SHELL;

    static {
        // 1. 配置 Groovy 编译器，启用沙箱
        CompilerConfiguration config = new CompilerConfiguration();
        // 添加沙箱转换器（核心：限制脚本权限）
        config.addCompilationCustomizers(new SandboxTransformer());
        // 启用线程中断（防止脚本死循环）
        config.addCompilationCustomizers(new ASTTransformationCustomizer(ThreadInterrupt.class));

        // 2. 创建带沙箱的脚本引擎
        SANDBOX_GROOVY_SHELL = new GroovyShell(config);

        // 3. 可选：注册自定义拦截器，限制特定 API（如禁止文件操作）
        // new GroovySecurityInterceptor().register();
    }

    /**
     * 安全执行 Groovy 脚本（沙箱模式）
     */
    public static Object executeSafeScript(String scriptCode, Map<String, Object> params) {
        params.forEach(SANDBOX_GROOVY_SHELL::setVariable);
        return SANDBOX_GROOVY_SHELL.evaluate(scriptCode);
    }
}
```

### 3. 混合开发最佳实践

- ✅ 核心业务逻辑（如数据库操作、权限校验）：用 Java 编写（类型安全、性能好、易维护）。
- ✅ 动态逻辑（如业务规则、计算表达式、配置解析）：用 Groovy 编写（灵活、可动态修改）。
- ✅ 接口定义：用 Java 定义接口，Groovy 实现接口（兼顾接口规范和 Groovy 的简洁性）。
- ✅ 脚本管理：将 Groovy 脚本文件放在 resources 目录下，通过配置中心动态更新脚本，无需重启服务。
- ✅ 避免陷阱：复杂逻辑避免使用 Groovy 动态类型，优先使用静态类型，减少运行时类型错误；避免在 Groovy 中过度使用元编程，降低维护成本。

## 六、避坑指南

1. **版本兼容坑**：使用 Groovy 3.x 版本集成 Java 会报错，务必选择 Groovy 4.0.15+ 版本，且 Maven 依赖中指定 Java 源码和目标版本。
2. **语法混淆坑**：Groovy 中 `==` 等价于 Java 的 `equals()`，比较对象引用需用 `is()`（如 `user1.is(user2)`），避免误判。
3. **性能坑**：频繁调用 `GroovyShell.evaluate()` 会导致性能瓶颈，务必使用预编译 + 缓存（参考生产实践章节）。
4. **安全坑**：不启用沙箱直接执行外部脚本，会导致远程代码执行漏洞，生产环境必须集成 Groovy 沙箱。
5. **互调坑**：Groovy 调用 Java 类时，若 Java 类有重载方法，需明确指定参数类型，避免 Groovy 动态类型匹配错误。
6. **日期 API 坑**：Groovy 4.0+ 完全支持 Java 的 `java.time` API（如 LocalDate、LocalDateTime），避免使用 Groovy 旧日期 API，保持与 Java 一致。

