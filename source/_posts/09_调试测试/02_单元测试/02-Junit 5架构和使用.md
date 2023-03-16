---
title: 02-Junit 5架构和使用
date: 2019-05-30 17:35:06
tags:
- 测试
- Junit5
categories: 
- 09_调试测试
- 02_单元测试
---

![image-20220226112743888](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20220226112744.png)

参考资料:

- [Junit 5 用户手册](https://github.com/DanielHit/myblog/blob/7382d6931fa2f8141173ac100db0db5abebcb1e2/source/_posts/Junit5%20%E7%94%A8%E6%88%B7%E6%89%8B%E5%86%8C.md)
- [JUnit 5 简介，第 1 部分:JUnit 5 Jupiter API](https://www.ibm.com/developerworks/cn/java/j-introducing-junit5-part1-jupiter-api/index.html)
- [JUnit 5 简介，第 2 部分:JUnit 5 Vintage 和 JUnit Jupiter 扩展模型](https://www.ibm.com/developerworks/cn/java/j-introducing-junit5-part2-vintage-jupiter-extension-model/index.html?ca=drs-)



### 0. JUnit 4 用法

```java
import org.junit.Before;
import org.junit.Test;
import java.util.UUID;

public class Demo01 {
    String uuid;

    @Before // 该注解会在执行 @Test 注解的方法前调用执行
    public void init() {
        uuid = UUID.randomUUID().toString().replace("-", "");
    }

    @Test // 直接运行，不需要手写 main 方法（底层其实还是 main 方法）
    public void test() {
        System.out.println("随机码 = " + uuid); // 随机码 = 00bfd84953f04013aec86a02b6f5503b
    }
}
```



### 1. JUnit 5 架构

Junit5 = JUnit Platform + JUnit Jupiter + JUnit Vintage

##### 使用 JUnit Jupiter 编写测试内容

JUnit Jupiter 包含两个组件：`API` 和 `Test Engine`。

- 使用 API （ 通过注解、断言、回调等） `创建`单元测试。
- 使用 Test Engine `发现和执行` JUnit Jupiter 单元测试。

##### 使用 JUnit Platform 运行测试

JUnit Platform 包含 API、Test Engine 和 Launcher。

运行单元测试的过程分为两部分：

- 发现测试和创建测试计划
  - 提供由一个 TestEngine 实现的，用于发现测试和创建测试计划的 API
  - 使用 IDE 和构建工具发起测试发现流程
  - 根据测试规范创建测试计划
- 启动测试计划，以执行测试和向用户报告结果
  - 提供由一个或多个 TestEngine 实现的，用于执行测试的 API
  - 通过 IDE 和构建工具发起测试执行工作
  - Launcher 组件负责执行在测试发现期间创建的测试计划

##### 后向兼容性：JUnit Vintage

JUnit Vintage 可确保现有 JUnit 测试能与使用 JUnit Jupiter 创建的新测试一同运行。

JUnit Vintage 本身由两个模块组成：

- junit：junit 是用于 JUnit 3 和 JUnit 4 的 API。
- junit-vintage-engine：是在 JUnit Platform 上运行 JUnit 3 和 JUnit 4 测试的测试引擎。

![JUnit](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230316151246.jpg)



### 2. JUnit Jupiter 编写



#### 注解

JUnit 4 与 JUnit 5 中的常用注解比较

| JUnit 5      | JUnit 4      | 说明                                                         |
| ------------ | ------------ | ------------------------------------------------------------ |
| @Test        | @Test        | 被注解的方法是一个测试方法。与 JUnit 4 相同。                |
| @BeforeAll   | @BeforeClass | 被注解的（静态）方法将在当前类中的所有 @Test 方法前执行一次。 |
| @AfterAll    | @AfterClass  | 被注解的（静态）方法将在当前类中的所有 @Test 方法后执行一次。 |
| @BeforeEach  | @Before      | 被注解的方法将在当前类中的每个 @Test 方法前执行。            |
| @AfterEach   | @After       | 被注解的方法将在当前类中的每个 @Test 方法后执行。            |
| @Disabled    | @Ignore      | 被注解的方法不会执行（将被跳过），但会报告为已执行。         |
| @ExtendWith  | @RunWith     | 放在测试类名之前，用来确定这个类怎么运行的                   |
| @ExtendWith  | @Rule        | 一组实现了TestRule接口的共享类                               |
| @ExtendWith  | @ClassRule   | 用于测试类中的静态变量，必须是TestRule接口的public实例       |
| @Tag         | @Category    | 被用于通过声明标签来过滤测试方法                             |
| @TestFactory |              | 声明这个方法是针对于dynamic tests测试工厂                    |
| @DisplayName |              | 给这个类或者方法设定一个特殊的名字                           |
| @Nested      |              | 声明这个方法是 一个嵌套的, 非静态的方法                      |

##### 使用注解

```
@RunWith(JUnitPlatform.class)
@DisplayName("Testing using JUnit 5")
public class JUnit5AppTest {
  
  private static final Logger log = LoggerFactory.getLogger(JUnit5AppTest.class);
  
  private App classUnderTest;
  
  @BeforeAll
  public static void init() {
    // Do something before ANY test is run in this class
  }
  
  @AfterAll
  public static void done() {
    // Do something after ALL tests in this class are run
  }
  
  @BeforeEach
  public void setUp() throws Exception {
    classUnderTest = new App();
  }
  
  @AfterEach
  public void tearDown() throws Exception {
    classUnderTest = null;
  }
  
  @Test
  @DisplayName("Dummy test")
  void aTest() {
    log.info("As written, this test will always pass!");
    assertEquals(4, (2 + 2));
  }
  
  @Test
  @Disabled
  @DisplayName("A disabled test")
  void testNotRun() {
    log.info("This test will not run (it is disabled, silly).");
  }
.
.
}
```



#### 断言

Junit Jupiter 继承了许多 Junit 4 中的断言方法，同时增加了一些适配 Java 8 lambdas 特点的方法。所有的 Junit Jupiter 都是静态方法，在 org.junit.jupiter.Assertions 类中。

```
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
.
.
  @Test
  @DisplayName("Dummy test")
  void dummyTest() {
    int expected = 4;
    int actual = 2 + 2;
    assertEquals(expected, actual, "INCONCEIVABLE!");
    //
    Object nullValue = null;
    assertFalse(nullValue != null);
    assertNull(nullValue);
    assertNotNull("A String", "INCONCEIVABLE!");
    assertTrue(nullValue == null);
    .
    .
  }
```

##### @assertAll()

assertAll() 包含的所有断言都会执行，即使一个或多个断言失败也是如此。

```
import static org.junit.jupiter.api.Assertions.assertAll;
.
.
@Test
@DisplayName("Dummy test")
void dummyTest() {
  int expected = 4;
  int actual = 2 + 2;
  Object nullValue = null;
  .
  .
  assertAll(
      "Assert All of these",
      () -> assertEquals(expected, actual, "INCONCEIVABLE!"),
      () -> assertFalse(nullValue != null),
      () -> assertNull(nullValue),
      () -> assertNotNull("A String", "INCONCEIVABLE!"),
      () -> assertTrue(nullValue == null));
}
```

##### @assertThrows()

在某些条件下，接受测试的类应抛出异常。JUnit 4 通过 expected = 方法参数或一个 @Rule 提供此能力。与此相反，JUnit Jupiter 通过 Assertions 类提供此能力，使它与其他断言更加一致。

```
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;
.
.
@Test()
@DisplayName("Empty argument")
public void testAdd_ZeroOperands_EmptyArgument() {
  long[] numbersToSum = {};
  assertThrows(IllegalArgumentException.class, () -> classUnderTest.add(numbersToSum));
}
```



#### 前置条件

前置条件 (Assumption) 与断言类似，但前置条件必须为 true，否则测试将中止。

前置条件是 org.junit.jupiter.api.Assumptions 类的静态方法。

##### assumeTrue()

如果条件不成立，就不会执行 lambda 表达式的内容。

```
@Test
@DisplayName("This test is only run on Fridays")
public void testAdd_OnlyOnFriday() {
  LocalDateTime ldt = LocalDateTime.now();
  assumeTrue(ldt.getDayOfWeek().getValue() == 5);
  // Remainder of test (only executed if assumption holds)...
}
```

##### assumingThat()

无论 assumingThat() 中的前置条件成立与否，都会执行 lambda 表达式后的所有代码

```
@Test
@DisplayName("This test is only run on Fridays (with lambda)")
public void testAdd_OnlyOnFriday_WithLambda() {
  LocalDateTime ldt = LocalDateTime.now();
  assumingThat(ldt.getDayOfWeek().getValue() == 5,
      () -> {
        // Execute this if assumption holds...
      });
  // Execute this regardless
}
```



#### 嵌套测试

只有非静态的嵌套类可以被标记为 @Nested 测试，嵌套可以是任意的深度。

每个单元测试可以拥有自己的测试前和测试后生命周期，除了一个例外: @BeforeAll 和 @AfterAll 不起作用。

```
@RunWith(JUnitPlatform.class)
@DisplayName("Testing JUnit 5")
public class JUnit5AppTest {
.
.                
  @Nested
  @DisplayName("When zero operands")
  class JUnit5AppZeroOperandsTest {
  
  // @Test methods go here...
  
  }
.
.
}
```



### 3. JUnit Platform 运行

在 IDE 中运行单元测试

```
@RunWith(JUnitPlatform.class)
public class JUnit5AppTest {
}
```

使用 Maven 运行单元测试

```
mvn test
```



### 4. JUnit Jupiter 扩展



#### 扩展 JUnit 4 的核心功能

使用 Runner 和 @Rule 扩展。

##### Runner

必须在测试类级别上使用 @RunWith 注解来声明 Runner，每个测试类最多只能拥有一个 Runner。

常见的第三方Runner ，比如用于运行基于 Spring 的单元测试的 SpringJUnit4ClassRunner，以及用于处理单元测试中 Mockito 对象的 MockitoJUnitRunner。

##### @Rule

为了解决 Runner 概念的这一内置限制，JUnit 4.7 引入了 @Rule。

一个测试类可声明多个 @Rule，这些规则可在测试方法级别和类级别上运行

##### 扩展点和测试生命周期

一个扩展点对应于 JUnit test 生命周期中一个预定义的点。

| 接口                          | 说明                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| AfterAllCallback              | 定义 API 扩展，希望在调用所有测试后让测试容器执行额外的行为。 |
| AfterEachCallback             | 定义 API 扩展，希望在调用每个测试方法后让测试执行额外的行为。 |
| AfterTestExecutionCallback    | 定义 API 扩展，希望在执行每个测试后让测试立即执行额外的行为。 |
| BeforeAllCallback             | 定义 API 扩展，希望在调用所有测试前让测试容器执行额外的行为。 |
| BeforeEachCallback            | 定义 API 扩展，希望在调用每个测试前让测试执行额外的行为。    |
| BeforeTestExecutionCallback   | 定义 API 扩展，希望在执行每个测试前让测试立即执行额外的行为。 |
| ParameterResolver             | 定义 API 扩展，希望在运行时动态解析参数。                    |
| TestExecutionExceptionHandler | 定义 API 扩展，希望处理在测试执行期间抛出的异常。            |

##### 激活扩展

要激活上述扩展，只需使用 @ExtendWith 注解注册它

```
@ExtendWith(MyBeforeEachCallbackExtension.class)
public class MyTestClass {
.
.
    @Test
    public void myTestMethod() {
        // Test code here
    }
    @Test
    public void someOtherTestMethod() {
        // Test code here
    }
.
.
}
```



#### 参数注入

将一个参数传递给 @Test 方法

##### ParameterResolver 接口

ParameterResolver 接口包含 2 个方法：

- supports() 方法：测试引擎解析测试类参数时，首先会调用 supports() 方法，查看该扩展是否能处理这种参数类型。
- resolve() 方法：如果 supports() 返回 true，则调用 resolve() 来获取正确类型的 Object，随后在调用测试方法时会使用该对象。

##### 创建 ParameterResolver 实现

```
public class GeneratedPersonParameterResolver implements ParameterResolver {
 
  @Override
  public boolean supportsParameter(ParameterContext parameterContext, ExtensionContext extensionContext)
      throws ParameterResolutionException {
    return parameterContext.getParameter().getType() == Person.class;
  }
 
  @Override
  public Object resolveParameter(ParameterContext parameterContext, ExtensionContext extensionContext)
      throws ParameterResolutionException {
    return PersonGenerator.createPerson();
  }
 
}
```

##### 使用 ParameterResolver 实现

在类或方法上，使用 @ExtendWith 注解完成注册工作

```
@ExtendWith(GeneratedPersonParameterResolver.class)
```



#### 参数化测试

参数化测试是指多次调用 @Test 方法，但每次都使用不同的参数值。参数化测试必须使用 @ParameterizedTest 进行注解，而且必须为其参数指定一个来源。

JUnit Jupiter 提供了多个来源。每个来源指定一个 @ArgumentsSource，也就是一个 ArgumentsProvider 实现。

##### @ValueSource

仅支持以下类型：String、int、long、double

```
@ParameterizedTest
@ValueSource(longs = { 1L, 2L, 3L, 4L, 5L })
public void findById(Long id) {
  assertNotNull(classUnderTest);
  Person personFound = classUnderTest.findById(id);
  assertNotNull(personFound);
  assertEquals(id, personFound.getId());
}
```

##### @EnumSource

```
@ParameterizedTest
@EnumSource(PersonTestEnum.class)
public void findById(PersonTestEnum testPerson) {
  assertNotNull(classUnderTest);
  Person person = testPerson.getPerson();
  Person personFound = classUnderTest.findById(person.getId());
  assertNotNull(personFound);
  performPersonAssertions(person.getLastName(), person.getFirstName(), person.getAge(), person.getEyeColor(),
      person.getGender(), personFound);
}
```

##### @MethodSource

一个方法来源必须声明为 static，返回类型必须是 Stream、Iterator、Iterable 或数组。

```
@ParameterizedTest
@MethodSource(value = "personProvider")
public void findById(Person paramPerson) {
  assertNotNull(classUnderTest);
  long id = paramPerson.getId();
  Person personFound = classUnderTest.findById(id);
  assertNotNull(personFound);
  performPersonAssertions(paramPerson.getLastName(), paramPerson.getFirstName(),
      paramPerson.getAge(),
      paramPerson.getEyeColor(), paramPerson.getGender(), personFound);
}
```

##### 自定义显示名称

可以通过向 @ParameterizedTest 注解提供任何以下属性值来自定义输出：

- {index}：从 1 开始的索引（当前测试迭代 ）。
- {arguments}：完整的参数列表，使用逗号分隔。
- {0}, {1} …：一个特定的参数（0 是第一个，依此类推）。

```
@ParameterizedTest(name = "@ValueSource: FindById(): Test# {index}: Id: {0}")
```



#### 动态测试

##### @TestFactory

@TestFactory 方法用于生成动态测试。此方法必须返回 DynamicTest 实例的 Stream、Collection、Iterable 或 Iterator。

##### 创建 @TestFactory

```
@TestFactory
Collection<DynamicTest> dynamicTestsFromCollection() {
    return Arrays.asList(
        dynamicTest("1st dynamic test", () -> assertTrue(true)),
        dynamicTest("2nd dynamic test", () -> assertEquals(4, 2 * 2))
    );
}


@TestFactory
Stream<DynamicTest> dynamicTestsFromStream() {
    return Stream.of("A", "B", "C").map(
        str -> dynamicTest("test" + str, () -> { /* ... */ }));
}
```



#### 标签和过滤

可使用标签来注解方法或类。然后可使用 Maven POM 或 Gradle 构建脚本中的过滤器设置来过滤掉此测试。

##### 使用 Maven 过滤

```
<build>
    <plugins>
    .
    .
        <plugin>
            <artifactId>maven-surefire-plugin</artifactId>
            <version>2.19</version>
            <configuration>
                <properties>
                    <excludeTags>advanced</excludeTags>
                </properties>
            </configuration>
    .
    .
    </plugins>
</build>
```

##### 使用 Gradle 过滤

```
junitPlatform {
  filters {
    engines {
    }
    tags {
        exclude 'advanced'
    }
  }
  logManager 'org.apache.logging.log4j.jul.LogManager'
}
```



