---
title: 04-Stream流处理全集
date: 2021-1-9 22:26:07
tags:
- Java8
- Stream
categories: 
- 02_编程语言
- 01_Java
- 02_Java8
---



### 1. Stream 概述和核心概念

#### 1.1 什么是 Stream

Stream 是 Java 8 引入的一个新的抽象层，用于以声明式方式处理数据集合。

```java
// 传统方式 vs Stream 方式
List<String> names = Arrays.asList("John", "Alice", "Bob", "David");

// 传统方式：命令式编程
List<String> result1 = new ArrayList<>();
for (String name : names) {
    if (name.startsWith("A")) {
        result1.add(name.toUpperCase());
    }
}

// Stream 方式：声明式编程
List<String> result2 = names.stream()
    .filter(name -> name.startsWith("A"))
    .map(String::toUpperCase)
    .collect(Collectors.toList());
```

#### 1.2 Stream 的主要特性

* 声明式编程：描述要做什么，而不是如何做
* 可组合性：可以将多个操作连接起来形成复杂的数据处理流水线
* 内部迭代：不需要显式地使用迭代器
* 惰性求值：中间操作是惰性的，只有在终端操作时才会执行
* 并行能力：可以轻松实现并行处理
* 无存储：Stream 本身不存储数据，数据存储在底层集合或源中

#### 1.3 Stream 操作分类

| 类型     | 操作                          | 特点                       |
| -------- | ----------------------------- | -------------------------- |
| 中间操作 | filter, map, sorted, distinct | 返回新的Stream，惰性执行   |
| 终端操作 | forEach, collect, reduce      | 产生结果或副作用，触发执行 |

### 2. Stream 创建方式详解

#### 2.1 从集合创建

```java
// 从List创建
List<String> list = Arrays.asList("a", "b", "c");
Stream<String> stream1 = list.stream();
Stream<String> parallelStream = list.parallelStream();

// 从Set创建
Set<Integer> set = new HashSet<>(Arrays.asList(1, 2, 3));
Stream<Integer> stream2 = set.stream();

// 从Map创建
Map<String, Integer> map = new HashMap<>();
map.put("A", 1);
map.put("B", 2);
Stream<Map.Entry<String, Integer>> entryStream = map.entrySet().stream();
Stream<String> keyStream = map.keySet().stream();
Stream<Integer> valueStream = map.values().stream();
```

#### 2.2 从数组创建

```java
// 基本方式
String[] array = {"a", "b", "c"};
Stream<String> stream1 = Arrays.stream(array);

// 指定范围
Stream<String> stream2 = Arrays.stream(array, 1, 3); // "b", "c"

// 使用Stream.of
Stream<String> stream3 = Stream.of("a", "b", "c");
Stream<Integer> stream4 = Stream.of(1, 2, 3, 4, 5);

// 空流
Stream<String> emptyStream = Stream.empty();
```

#### 2.3 使用 Stream.builder()

```java
Stream.Builder<String> builder = Stream.builder();
builder.add("a")
       .add("b")
       .add("c")
       .add("d");
Stream<String> stream = builder.build();

// 链式调用
Stream<String> stream2 = Stream.<String>builder()
    .add("hello")
    .add("world")
    .add("!")
    .build();
```

#### 2.4 生成无限流

```java
// Stream.generate() - 生成恒定值
Stream<String> constantStream = Stream.generate(() -> "constant");
Stream<Double> randomStream = Stream.generate(Math::random);

// 有限生成
Stream<Double> limitedRandom = Stream.generate(Math::random).limit(5);

// Stream.iterate() - 基于种子的迭代
Stream<Integer> infiniteIterate = Stream.iterate(0, n -> n + 1);
Stream<Integer> finiteIterate = Stream.iterate(0, n -> n < 10, n -> n + 1);

// 复杂的迭代模式
Stream.iterate(new int[]{0, 1}, t -> new int[]{t[1], t[0] + t[1]})
    .limit(10)
    .map(t -> t[0])
    .forEach(System.out::println); // 斐波那契数列
```

#### 2.5 从文件创建

```java
// 读取文件行
try (Stream<String> lines = Files.lines(Paths.get("data.txt"))) {
    lines.filter(line -> !line.startsWith("#"))
         .map(String::trim)
         .forEach(System.out::println);
} catch (IOException e) {
    e.printStackTrace();
}

// 读取目录文件
try (Stream<Path> paths = Files.list(Paths.get("."))) {
    paths.filter(Files::isRegularFile)
         .map(Path::getFileName)
         .forEach(System.out::println);
} catch (IOException e) {
    e.printStackTrace();
}
```

#### 2.6 基本类型特化流

```java
// IntStream
IntStream intStream1 = IntStream.range(1, 5);        // 1, 2, 3, 4
IntStream intStream2 = IntStream.rangeClosed(1, 5);  // 1, 2, 3, 4, 5
IntStream intStream3 = IntStream.of(1, 2, 3, 4, 5);

// LongStream
LongStream longStream1 = LongStream.range(1L, 5L);
LongStream longStream2 = LongStream.rangeClosed(1L, 5L);

// DoubleStream
DoubleStream doubleStream = DoubleStream.of(1.0, 2.0, 3.0, 4.0);

// 从数组创建基本类型流
int[] intArray = {1, 2, 3, 4, 5};
IntStream fromArray = Arrays.stream(intArray);

// 字符流
"hello".chars()  // 返回IntStream
    .mapToObj(c -> (char) c)
    .forEach(System.out::println);
```

#### 2.7 正则表达式创建流

```java
String text = "apple,banana,orange,grape";
Stream<String> fruitStream = Pattern.compile(",")
    .splitAsStream(text)
    .map(String::trim);
```



### 3. 中间操作详解

#### 3.1 filter() - 过滤

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// 过滤偶数
List<Integer> evenNumbers = numbers.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList()); // [2, 4, 6, 8, 10]

// 多重条件过滤
List<Integer> filtered = numbers.stream()
    .filter(n -> n > 3)
    .filter(n -> n < 8)
    .filter(n -> n % 2 == 1)
    .collect(Collectors.toList()); // [5, 7]

// 过滤null值
List<String> listWithNulls = Arrays.asList("a", null, "b", null, "c");
List<String> withoutNulls = listWithNulls.stream()
    .filter(Objects::nonNull)
    .collect(Collectors.toList()); // ["a", "b", "c"]
```

#### 3.2 map() - 映射转换

```java
List<String> words = Arrays.asList("hello", "world", "java", "stream");

// 转换为大写
List<String> upperCase = words.stream()
    .map(String::toUpperCase)
    .collect(Collectors.toList()); // ["HELLO", "WORLD", "JAVA", "STREAM"]

// 获取字符串长度
List<Integer> lengths = words.stream()
    .map(String::length)
    .collect(Collectors.toList()); // [5, 5, 4, 6]

// 复杂对象映射
List<Person> people = Arrays.asList(
    new Person("Alice", 25),
    new Person("Bob", 30)
);
List<String> names = people.stream()
    .map(Person::getName)
    .collect(Collectors.toList()); // ["Alice", "Bob"]

// 多重映射
List<List<String>> nestedList = Arrays.asList(
    Arrays.asList("a", "b"),
    Arrays.asList("c", "d")
);
List<String> flatList = nestedList.stream()
    .map(list -> String.join("-", list))
    .collect(Collectors.toList()); // ["a-b", "c-d"]
```

#### 3.3 flatMap() - 扁平化映射

```java
// 扁平化嵌套集合
List<List<String>> nestedList = Arrays.asList(
    Arrays.asList("a", "b", "c"),
    Arrays.asList("d", "e", "f"),
    Arrays.asList("g", "h", "i")
);

List<String> flatList = nestedList.stream()
    .flatMap(List::stream)
    .collect(Collectors.toList()); // ["a", "b", "c", "d", "e", "f", "g", "h", "i"]

// 拆分字符串为字符
List<String> words = Arrays.asList("Hello", "World");
List<String> characters = words.stream()
    .flatMap(word -> Arrays.stream(word.split("")))
    .collect(Collectors.toList()); // ["H", "e", "l", "l", "o", "W", "o", "r", "l", "d"]

// 处理Optional
List<Optional<String>> optionals = Arrays.asList(
    Optional.of("A"),
    Optional.empty(),
    Optional.of("B")
);
List<String> values = optionals.stream()
    .flatMap(Optional::stream)
    .collect(Collectors.toList()); // ["A", "B"]

// 复杂扁平化示例
List<Order> orders = Arrays.asList(
    new Order(Arrays.asList("item1", "item2")),
    new Order(Arrays.asList("item3", "item4"))
);
List<String> allItems = orders.stream()
    .flatMap(order -> order.getItems().stream())
    .collect(Collectors.toList()); // ["item1", "item2", "item3", "item4"]
```

#### 3.4 distinct() - 去重

```java
List<Integer> numbers = Arrays.asList(1, 2, 2, 3, 3, 3, 4, 4, 4, 4);

// 基本去重
List<Integer> distinctNumbers = numbers.stream()
    .distinct()
    .collect(Collectors.toList()); // [1, 2, 3, 4]

// 对象去重（需要正确实现equals和hashCode）
List<Person> people = Arrays.asList(
    new Person("Alice", 25),
    new Person("Bob", 30),
    new Person("Alice", 25) // 重复
);
List<Person> distinctPeople = people.stream()
    .distinct()
    .collect(Collectors.toList()); // 两个Alice只会保留一个

// 基于特定属性去重（使用自定义逻辑）
List<Person> distinctByName = people.stream()
    .filter(distinctByKey(Person::getName))
    .collect(Collectors.toList());

// 辅助方法：基于属性去重
public static <T> Predicate<T> distinctByKey(Function<? super T, ?> keyExtractor) {
    Set<Object> seen = ConcurrentHashMap.newKeySet();
    return t -> seen.add(keyExtractor.apply(t));
}
```

#### 3.5 sorted() - 排序

```java
List<String> words = Arrays.asList("banana", "apple", "cherry", "date");

// 自然排序
List<String> naturalSorted = words.stream()
    .sorted()
    .collect(Collectors.toList()); // ["apple", "banana", "cherry", "date"]

// 逆序排序
List<String> reverseSorted = words.stream()
    .sorted(Comparator.reverseOrder())
    .collect(Collectors.toList()); // ["date", "cherry", "banana", "apple"]

// 自定义排序：字符串长度
List<String> lengthSorted = words.stream()
    .sorted(Comparator.comparing(String::length))
    .collect(Collectors.toList()); // ["date", "apple", "banana", "cherry"]

// 多级排序
List<Person> people = Arrays.asList(
    new Person("Alice", 25),
    new Person("Bob", 30),
    new Person("Charlie", 25),
    new Person("David", 30)
);

// 先按年龄升序，再按姓名降序
List<Person> multiSorted = people.stream()
    .sorted(Comparator.comparing(Person::getAge)
        .thenComparing(Comparator.comparing(Person::getName).reversed()))
    .collect(Collectors.toList());

// 使用自定义比较器
List<String> customSorted = words.stream()
    .sorted((s1, s2) -> {
        if (s1.length() != s2.length()) {
            return s1.length() - s2.length();
        }
        return s1.compareTo(s2);
    })
    .collect(Collectors.toList());
```

#### 3.6 peek() - 查看元素（调试）

```java
List<String> result = Arrays.asList("a", "b", "c", "d").stream()
    .peek(element -> System.out.println("原始元素: " + element))
    .map(String::toUpperCase)
    .peek(element -> System.out.println("转换后: " + element))
    .filter(s -> s.length() == 1)
    .peek(element -> System.out.println("过滤后: " + element))
    .collect(Collectors.toList());

// 修改元素状态（谨慎使用）
List<Person> people = Arrays.asList(
    new Person("Alice", 25),
    new Person("Bob", 30)
);
List<Person> processed = people.stream()
    .peek(person -> person.setName(person.getName().toUpperCase()))
    .collect(Collectors.toList());
```

#### 3.7 limit() 和 skip() - 限制和跳过

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// 限制数量
List<Integer> limited = numbers.stream()
    .limit(5)
    .collect(Collectors.toList()); // [1, 2, 3, 4, 5]

// 跳过元素
List<Integer> skipped = numbers.stream()
    .skip(3)
    .collect(Collectors.toList()); // [4, 5, 6, 7, 8, 9, 10]

// 组合使用：分页实现
int pageSize = 3;
int pageNumber = 2; // 第二页（从0开始）
List<Integer> page = numbers.stream()
    .skip(pageNumber * pageSize)
    .limit(pageSize)
    .collect(Collectors.toList()); // [4, 5, 6]

// 无限流的分页
Stream.iterate(0, n -> n + 1)
    .skip(10)
    .limit(5)
    .forEach(System.out::println); // 10, 11, 12, 13, 14
```

#### 3.8 takeWhile() 和 dropWhile() (Java 9+)

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 1, 2, 3);

// takeWhile: 从开始获取元素，直到条件不满足
List<Integer> taken = numbers.stream()
    .takeWhile(n -> n < 4)
    .collect(Collectors.toList()); // [1, 2, 3]

// dropWhile: 从开始丢弃元素，直到条件不满足
List<Integer> dropped = numbers.stream()
    .dropWhile(n -> n < 4)
    .collect(Collectors.toList()); // [4, 5, 1, 2, 3]

// 实际应用：处理有序数据
List<String> lines = Arrays.asList("# Header", "Content line 1", "Content line 2", "# Footer");
List<String> content = lines.stream()
    .dropWhile(line -> line.startsWith("#"))
    .takeWhile(line -> !line.startsWith("#"))
    .collect(Collectors.toList()); // ["Content line 1", "Content line 2"]
```

#### 3.9 mapToXXX() - 转换为基本类型流

```java
List<String> numbers = Arrays.asList("1", "2", "3", "4", "5");

// 转换为IntStream
IntStream intStream = numbers.stream()
    .mapToInt(Integer::parseInt);
int sum = intStream.sum(); // 15

// 转换为DoubleStream
DoubleStream doubleStream = numbers.stream()
    .mapToDouble(Double::parseDouble);

// 转换为LongStream
LongStream longStream = numbers.stream()
    .mapToLong(Long::parseLong);

// 对象流和基本类型流的转换
List<Integer> integerList = Arrays.asList(1, 2, 3, 4, 5);
IntStream primitiveStream = integerList.stream().mapToInt(i -> i);
Stream<Integer> objectStream = primitiveStream.boxed();
```

### 4. 终端操作详解

#### 4.1 forEach() 和 forEachOrdered()

```java
List<String> words = Arrays.asList("apple", "banana", "cherry");

// 基本遍历
words.stream().forEach(System.out::println);

// 并行流中的顺序问题
words.parallelStream()
    .forEach(word -> System.out.println(Thread.currentThread().getName() + ": " + word));

// 保证顺序的遍历
words.parallelStream()
    .forEachOrdered(System.out::println); // 总是按原始顺序输出

// 修改外部状态（谨慎使用）
List<String> result = new ArrayList<>();
words.stream()
    .map(String::toUpperCase)
    .forEach(result::add); // 不推荐，应该使用collect
```

#### 4.2 toArray() - 转换为数组

```java
List<String> list = Arrays.asList("a", "b", "c");

// 转换为Object数组
Object[] objectArray = list.stream().toArray();

// 转换为特定类型数组
String[] stringArray = list.stream().toArray(String[]::new);

// 复杂对象转换
List<Person> people = Arrays.asList(
    new Person("Alice", 25),
    new Person("Bob", 30)
);
Person[] personArray = people.stream()
    .filter(p -> p.getAge() > 25)
    .toArray(Person[]::new);
```

#### 4.3 reduce() - 归约操作

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

// 1. 有初始值的reduce
Integer sum1 = numbers.stream()
    .reduce(0, Integer::sum); // 15

// 2. 无初始值的reduce（返回Optional）
Optional<Integer> sum2 = numbers.stream()
    .reduce(Integer::sum); // Optional[15]

// 3. 复杂reduce：字符串连接
String concatenated = numbers.stream()
    .map(Object::toString)
    .reduce("", (partial, element) -> partial + element); // "12345"

// 4. 并行reduce（需要满足结合律）
Integer parallelSum = numbers.parallelStream()
    .reduce(0, Integer::sum, Integer::sum);

// 5. 求最大值
Optional<Integer> max = numbers.stream()
    .reduce(Integer::max); // Optional[5]

// 6. 自定义归约逻辑
String longest = Arrays.asList("apple", "banana", "cherry").stream()
    .reduce("", (s1, s2) -> s1.length() > s2.length() ? s1 : s2);
```

#### 4.4 collect() - 收集操作（最强大的终端操作）

##### 4.4.1 基本收集操作

```java
List<String> words = Arrays.asList("apple", "banana", "cherry", "apple");

// 转换为List
List<String> list = words.stream().collect(Collectors.toList());

// 转换为Set（自动去重）
Set<String> set = words.stream().collect(Collectors.toSet());

// 转换为特定集合
LinkedList<String> linkedList = words.stream()
    .collect(Collectors.toCollection(LinkedList::new));

TreeSet<String> treeSet = words.stream()
    .collect(Collectors.toCollection(TreeSet::new));

// 转换为数组
String[] array = words.stream().toArray(String[]::new);
```

##### 4.4.2 连接字符串

```java
List<String> words = Arrays.asList("Hello", "World", "Java", "Stream");

// 简单连接
String simpleJoin = words.stream().collect(Collectors.joining()); // "HelloWorldJavaStream"

// 带分隔符连接
String withDelimiter = words.stream().collect(Collectors.joining(", ")); 
// "Hello, World, Java, Stream"

// 带前缀和后缀
String withPrefixSuffix = words.stream()
    .collect(Collectors.joining(", ", "[", "]")); 
// "[Hello, World, Java, Stream]"

// 复杂连接
String complexJoin = words.stream()
    .map(String::toUpperCase)
    .filter(s -> s.length() > 4)
    .collect(Collectors.joining(" | ", ">>> ", " <<<"));
// ">>> HELLO | WORLD | STREAM <<<"
```

##### 4.4.3 汇总统计

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// IntSummaryStatistics
IntSummaryStatistics stats = numbers.stream()
    .collect(Collectors.summarizingInt(Integer::intValue));
System.out.println("平均值: " + stats.getAverage());
System.out.println("最大值: " + stats.getMax());
System.out.println("最小值: " + stats.getMin());
System.out.println("总和: " + stats.getSum());
System.out.println("数量: " + stats.getCount());

// 针对对象属性的统计
List<Person> people = Arrays.asList(
    new Person("Alice", 25),
    new Person("Bob", 30),
    new Person("Charlie", 35)
);
IntSummaryStatistics ageStats = people.stream()
    .collect(Collectors.summarizingInt(Person::getAge));
```

##### 4.4.4 分组操作

```java
List<Person> people = Arrays.asList(
    new Person("Alice", 25, "New York"),
    new Person("Bob", 30, "London"),
    new Person("Charlie", 25, "New York"),
    new Person("Diana", 30, "Paris"),
    new Person("Eve", 35, "London")
);

// 简单分组：按城市分组
Map<String, List<Person>> peopleByCity = people.stream()
    .collect(Collectors.groupingBy(Person::getCity));
// {New York=[Alice, Charlie], London=[Bob, Eve], Paris=[Diana]}

// 分组后对值进行转换
Map<String, List<String>> namesByCity = people.stream()
    .collect(Collectors.groupingBy(
        Person::getCity,
        Collectors.mapping(Person::getName, Collectors.toList())
    ));

// 多级分组：先按城市，再按年龄
Map<String, Map<Integer, List<Person>>> peopleByCityAndAge = people.stream()
    .collect(Collectors.groupingBy(
        Person::getCity,
        Collectors.groupingBy(Person::getAge)
    ));

// 分组并计数
Map<String, Long> countByCity = people.stream()
    .collect(Collectors.groupingBy(Person::getCity, Collectors.counting()));
// {New York=2, London=2, Paris=1}

// 分组并求和
Map<String, Integer> sumAgeByCity = people.stream()
    .collect(Collectors.groupingBy(
        Person::getCity,
        Collectors.summingInt(Person::getAge)
    ));

// 分组并获取最大值
Map<String, Optional<Person>> oldestByCity = people.stream()
    .collect(Collectors.groupingBy(
        Person::getCity,
        Collectors.maxBy(Comparator.comparingInt(Person::getAge))
    ));
```

##### 4.4.5 分区操作

```java
List<Person> people = Arrays.asList(
    new Person("Alice", 25),
    new Person("Bob", 30),
    new Person("Charlie", 35),
    new Person("Diana", 20)
);

// 简单分区：年龄是否大于30
Map<Boolean, List<Person>> partitioned = people.stream()
    .collect(Collectors.partitioningBy(p -> p.getAge() > 30));
// {false=[Alice, Bob, Diana], true=[Charlie]}

// 分区后统计
Map<Boolean, Long> countByPartition = people.stream()
    .collect(Collectors.partitioningBy(
        p -> p.getAge() > 30,
        Collectors.counting()
    ));
// {false=3, true=1}

// 分区后分组
Map<Boolean, Map<String, List<Person>>> complexPartition = people.stream()
    .collect(Collectors.partitioningBy(
        p -> p.getAge() > 30,
        Collectors.groupingBy(Person::getName)
    ));
```

##### 4.4.6 自定义收集器

```java
// 自定义收集器：计算平均值
Collector<Integer, ?, Double> averagingCollector = Collector.of(
    () -> new double[2],                    // 供应商：创建累加器 [sum, count]
    (a, i) -> { a[0] += i; a[1]++; },       // 累加器
    (a, b) -> { a[0] += b[0]; a[1] += b[1]; return a; }, // 组合器（用于并行）
    a -> a[1] == 0 ? 0.0 : a[0] / a[1]     // 完成器
);

Double average = numbers.stream().collect(averagingCollector);

// 自定义收集器：连接字符串并添加统计信息
Collector<String, ?, String> joiningWithStats = Collector.of(
    StringBuilder::new,                     // 供应商
    StringBuilder::append,                  // 累加器
    StringBuilder::append,                  // 组合器
    sb -> {                                // 完成器
        String result = sb.toString();
        return String.format("字符串: %s, 长度: %d", result, result.length());
    }
);

String result = words.stream().collect(joiningWithStats);
```

#### 4.5 min() 和 max() - 最小值和最大值

```java
List<Integer> numbers = Arrays.asList(3, 1, 4, 1, 5, 9, 2, 6);

// 最小值
Optional<Integer> min = numbers.stream().min(Integer::compareTo);
min.ifPresent(val -> System.out.println("最小值: " + val)); // 1

// 最大值
Optional<Integer> max = numbers.stream().max(Integer::compareTo);
max.ifPresent(val -> System.out.println("最大值: " + val)); // 9

// 对象的最小值/最大值
List<Person> people = Arrays.asList(
    new Person("Alice", 25),
    new Person("Bob", 30),
    new Person("Charlie", 20)
);

Optional<Person> youngest = people.stream()
    .min(Comparator.comparingInt(Person::getAge));
youngest.ifPresent(p -> System.out.println("最年轻: " + p.getName())); // Charlie

Optional<Person> oldest = people.stream()
    .max(Comparator.comparingInt(Person::getAge));
oldest.ifPresent(p -> System.out.println("最年长: " + p.getName())); // Bob
```

#### 4.6 count() - 计数

```java
List<String> words = Arrays.asList("apple", "banana", "cherry", "date");

// 基本计数
long count = words.stream().count(); // 4

// 条件计数
long longWords = words.stream()
    .filter(word -> word.length() > 5)
    .count(); // 2

// 分组计数
Map<Integer, Long> countByLength = words.stream()
    .collect(Collectors.groupingBy(String::length, Collectors.counting()));
// {5=2, 6=1, 4=1}
```

#### 4.7 anyMatch(), allMatch(), noneMatch() - 匹配检查

```java
List<Integer> numbers = Arrays.asList(2, 4, 6, 8, 10);

// anyMatch: 是否存在偶数（所有都是偶数，所以返回true）
boolean anyEven = numbers.stream().anyMatch(n -> n % 2 == 0); // true

// allMatch: 是否所有都是偶数
boolean allEven = numbers.stream().allMatch(n -> n % 2 == 0); // true

// noneMatch: 是否没有奇数
boolean noneOdd = numbers.stream().noneMatch(n -> n % 2 == 1); // true

// 实际应用：验证数据
List<Person> people = Arrays.asList(
    new Person("Alice", 25),
    new Person("Bob", 17), // 未成年
    new Person("Charlie", 30)
);

boolean allAdults = people.stream()
    .allMatch(p -> p.getAge() >= 18); // false

boolean hasMinor = people.stream()
    .anyMatch(p -> p.getAge() < 18); // true
```

#### 4.8 findFirst() 和 findAny() - 查找元素

```java
List<String> words = Arrays.asList("apple", "banana", "cherry", "date");

// findFirst: 查找第一个元素
Optional<String> first = words.stream().findFirst();
first.ifPresent(System.out::println); // apple

// findAny: 查找任意元素（在并行流中更有用）
Optional<String> any = words.stream().findAny();
any.ifPresent(System.out::println); // 可能是任意元素

// 条件查找
Optional<String> firstLongWord = words.stream()
    .filter(word -> word.length() > 5)
    .findFirst(); // banana

// 并行流中的findAny
Optional<String> parallelAny = words.parallelStream()
    .filter(word -> word.length() > 5)
    .findAny();
```

### 5. 并行流详解

#### 5.1 创建并行流

```java
List<String> words = Arrays.asList("apple", "banana", "cherry", "date");

// 从集合创建并行流
Stream<String> parallelStream1 = words.parallelStream();

// 将顺序流转为并行流
Stream<String> parallelStream2 = words.stream().parallel();

// 将并行流转为顺序流
Stream<String> sequentialStream = parallelStream1.sequential();
```



#### 5.2 并行流的使用场景

```java
// 适合并行处理的情况：计算密集型任务
long result = LongStream.range(1, 10_000_000)
    .parallel()
    .filter(n -> n % 2 == 0)
    .sum();

// 不适合并行处理的情况：有状态操作或I/O密集型
List<String> processed = words.parallelStream()
    .map(String::toUpperCase) // 无状态操作，适合并行
    .collect(Collectors.toList());

// 注意：并行流不保证顺序
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
List<Integer> parallelProcessed = numbers.parallelStream()
    .map(n -> {
        System.out.println(Thread.currentThread().getName() + " processing: " + n);
        return n * 2;
    })
    .collect(Collectors.toList());
```

#### 5.3 并行流的注意事项

```java
// 1. 避免有状态的操作
List<String> badExample = Collections.synchronizedList(new ArrayList<>());
words.parallelStream()
    .forEach(badExample::add); // 可能产生竞态条件

// 正确的做法
List<String> goodExample = words.parallelStream()
    .collect(Collectors.toList());

// 2. 注意顺序敏感性
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
// 顺序流保证顺序
List<Integer> sequential = numbers.stream()
    .map(n -> n * 2)
    .collect(Collectors.toList()); // [2, 4, 6, 8, 10]

// 并行流不保证顺序（除非使用forEachOrdered）
List<Integer> parallel = numbers.parallelStream()
    .map(n -> n * 2)
    .collect(Collectors.toList()); // 顺序可能变化

// 3. 合理使用并行流
boolean shouldUseParallel = numbers.size() > 1000; // 根据数据量决定
Stream<Integer> stream = shouldUseParallel ? numbers.parallelStream() : numbers.stream();
```

### 6. 高级特性和技巧

#### 6.1 无限流的高级用法

```java
// 生成随机数流
Stream<Double> randomStream = Stream.generate(Math::random).limit(10);

// 生成序列流
Stream<Integer> sequence = Stream.iterate(0, n -> n + 1).limit(100);

// 生成斐波那契数列
Stream.iterate(new long[]{0, 1}, t -> new long[]{t[1], t[0] + t[1]})
    .limit(20)
    .map(t -> t[0])
    .forEach(System.out::println);

// 生成质数流
IntStream primes = IntStream.iterate(2, n -> n + 1)
    .filter(n -> IntStream.range(2, (int) Math.sqrt(n) + 1).noneMatch(i -> n % i == 0))
    .limit(100);
```

#### 6.2 异常处理

```java
List<String> numberStrings = Arrays.asList("1", "2", "abc", "3", "4", "def");

// 方法1：使用try-catch包装
List<Integer> numbers = numberStrings.stream()
    .map(s -> {
        try {
            return Integer.parseInt(s);
        } catch (NumberFormatException e) {
            return null; // 或使用默认值
        }
    })
    .filter(Objects::nonNull)
    .collect(Collectors.toList());

// 方法2：使用Optional包装
List<Integer> numbers2 = numberStrings.stream()
    .map(s -> {
        try {
            return Optional.of(Integer.parseInt(s));
        } catch (NumberFormatException e) {
            return Optional.<Integer>empty();
        }
    })
    .flatMap(Optional::stream)
    .collect(Collectors.toList());

// 方法3：使用工具方法
public static Optional<Integer> parseInteger(String s) {
    try {
        return Optional.of(Integer.parseInt(s));
    } catch (NumberFormatException e) {
        return Optional.empty();
    }
}

List<Integer> numbers3 = numberStrings.stream()
    .map(StreamAdvancedExamples::parseInteger)
    .flatMap(Optional::stream)
    .collect(Collectors.toList());
```

#### 6.3 性能优化技巧

```java
// 1. 使用基本类型流避免装箱拆箱
IntSummaryStatistics stats = people.stream()
    .mapToInt(Person::getAge)  // 避免Integer装箱
    .summaryStatistics();

// 2. 短路操作提高性能
boolean hasSenior = people.stream()
    .anyMatch(p -> p.getAge() > 65); // 找到第一个就返回

// 3. 避免不必要的排序
List<Person> top3 = people.stream()
    .filter(p -> p.getAge() > 30)
    .limit(3)  // 先限制再排序可以提高性能
    .sorted(Comparator.comparing(Person::getAge).reversed())
    .collect(Collectors.toList());

// 4. 重用Stream（使用Supplier）
Supplier<Stream<String>> streamSupplier = () -> words.stream();
streamSupplier.get().filter(s -> s.length() > 3).count();
streamSupplier.get().map(String::toUpperCase).collect(Collectors.toList());
```

#### 6.4 调试和日志

```java
// 使用peek进行调试
List<String> result = words.stream()
    .peek(word -> System.out.println("原始: " + word))
    .map(String::toUpperCase)
    .peek(word -> System.out.println("大写: " + word))
    .filter(word -> word.length() > 4)
    .peek(word -> System.out.println("过滤后: " + word))
    .collect(Collectors.toList());

// 自定义调试工具
public static <T> Consumer<T> debug(String message) {
    return item -> System.out.println(message + ": " + item);
}

List<String> debugResult = words.stream()
    .peek(debug("原始"))
    .map(String::toUpperCase)
    .peek(debug("转换后"))
    .collect(Collectors.toList());
```

### 7. 实际应用案例

#### 7.1 数据处理管道

```java
public class DataProcessingPipeline {
    
    public static void processSalesData(List<Sale> sales) {
        // 复杂的多步数据处理
        Map<String, Double> result = sales.stream()
            .filter(sale -> sale.getDate().getYear() == 2023)  // 过滤2023年的数据
            .filter(sale -> sale.getAmount() > 1000)          // 过滤大额交易
            .collect(Collectors.groupingBy(
                Sale::getCategory,                            // 按类别分组
                Collectors.summingDouble(Sale::getAmount)     // 计算每类总额
            ))
            .entrySet().stream()
            .sorted(Map.Entry.<String, Double>comparingByValue().reversed()) // 按金额降序
            .limit(10)                                        // 取前10名
            .collect(Collectors.toMap(
                Map.Entry::getKey,
                Map.Entry::getValue,
                (e1, e2) -> e1,
                LinkedHashMap::new                           // 保持顺序
            ));
    }
    
    public static class Sale {
        private String category;
        private double amount;
        private LocalDate date;
        // getters and setters
    }
}
```

#### 7.2 文件处理

```java
public class FileProcessor {
    
    public static void processLogFile(String filePath) throws IOException {
        // 读取日志文件并分析
        Map<String, Long> errorCounts = Files.lines(Paths.get(filePath))
            .filter(line -> line.contains("ERROR"))          // 过滤错误行
            .map(line -> line.split(" ")[2])                 // 提取错误类型
            .collect(Collectors.groupingBy(
                errorType -> errorType,
                Collectors.counting()                        // 统计每种错误数量
            ))
            .entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .collect(Collectors.toMap(
                Map.Entry::getKey,
                Map.Entry::getValue,
                (e1, e2) -> e1,
                LinkedHashMap::new
            ));
    }
    
    public static List<String> findLargeFiles(String directory) throws IOException {
        // 查找大文件
        return Files.walk(Paths.get(directory))
            .filter(Files::isRegularFile)
            .filter(path -> {
                try {
                    return Files.size(path) > 1024 * 1024; // 大于1MB
                } catch (IOException e) {
                    return false;
                }
            })
            .map(Path::toString)
            .sorted()
            .collect(Collectors.toList());
    }
}
```

#### 7.3 Web应用中的使用

```java
@RestController
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/users/stats")
    public Map<String, Object> getUserStats() {
        List<User> users = userRepository.findAll();
        
        return users.stream()
            .collect(Collectors.collectingAndThen(
                Collectors.toList(),
                list -> {
                    Map<String, Object> stats = new HashMap<>();
                    stats.put("totalUsers", list.size());
                    stats.put("activeUsers", list.stream()
                        .filter(User::isActive)
                        .count());
                    stats.put("averageAge", list.stream()
                        .mapToInt(User::getAge)
                        .average()
                        .orElse(0));
                    stats.put("topCountries", list.stream()
                        .collect(Collectors.groupingBy(
                            User::getCountry,
                            Collectors.counting()
                        ))
                        .entrySet().stream()
                        .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                        .limit(5)
                        .collect(Collectors.toList()));
                    return stats;
                }
            ));
    }
}
```

### 8. 最佳实践和常见陷阱

#### 8.1 最佳实践

```java
// 1. 使用方法引用提高可读性
List<String> names = people.stream()
    .map(Person::getName)          // 而不是 p -> p.getName()
    .filter(Objects::nonNull)      // 而不是 s -> s != null
    .collect(Collectors.toList());

// 2. 避免不必要的装箱拆箱
IntSummaryStatistics stats = people.stream()
    .mapToInt(Person::getAge)      // 使用基本类型流
    .summaryStatistics();

// 3. 合理使用并行流
List<Integer> largeList = // 大量数据
boolean useParallel = largeList.size() > 10000;
Stream<Integer> stream = useParallel ? largeList.parallelStream() : largeList.stream();

// 4. 使用短路操作提高性能
boolean hasMatch = largeList.stream()
    .anyMatch(n -> n > 1000);     // 找到第一个匹配就返回
```

#### 8.2 常见陷阱

```java
// 1. 流只能被消费一次
Stream<String> stream = words.stream();
stream.forEach(System.out::println);
// stream.count(); // 错误：流已被关闭

// 解决方案：使用Supplier
Supplier<Stream<String>> streamSupplier = () -> words.stream();
streamSupplier.get().forEach(System.out::println);
streamSupplier.get().count();

// 2. 避免在peek中修改状态
List<Person> people = new ArrayList<>(originalPeople);
// 错误做法：在peek中修改外部状态
people.stream()
    .peek(p -> people.remove(p))  // 并发修改异常
    .collect(Collectors.toList());

// 3. 注意并行流中的线程安全
List<String> result = Collections.synchronizedList(new ArrayList<>());
words.parallelStream()
    .forEach(result::add);  // 虽然同步，但性能差

// 正确做法
List<String> goodResult = words.parallelStream()
    .collect(Collectors.toList());

// 4. 避免过度使用流
// 简单的循环用传统方式可能更清晰
for (String word : words) {
    if (word.length() > 5) {
        System.out.println(word);
    }
}
// 比下面的流方式更清晰
words.stream()
    .filter(word -> word.length() > 5)
    .forEach(System.out::println);
```

