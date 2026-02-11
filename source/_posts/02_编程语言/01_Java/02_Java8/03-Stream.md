---
title: 03-Stream
date: 2016-4-28 22:12:21
tags:
- Java8
- Stream
categories: 
- 02_编程语言
- 01_Java
- 02_Java8
---



**Stream** 接口: 支持对一系列元素进行顺序和并行的聚合操作功能接口，是Java8中处理**数组、集合**的抽象概念。
* 可以执行非常复杂的**查找、过滤、映射等**操作。



```java
public interface Stream<T>
    extends BaseStream<T,Stream<T>>
```

### 1.1 stream 基本操作
```java
public class TestStream {
      public static void main(String[] args) {
            // Stream --> 数组、集合
            List<String> list = Arrays.asList("zhangsan", "lisi",  "wangwu", "zhaoliu", "lucy");
            
            // Stream 中存储的是数据的操作，自身不保存数据。
            // 1.创建 Stream
            Stream<String> stream = list.stream();
            // 2.中间操作
            Stream<String> center = stream.filter((s)->s.length()>=5);
            // 3.最终操作
            System.out.println("名字长度>=5的是：");
            center.forEach(System.out::println);
            
            // 一行套娃版：
            System.out.println();
            list.stream().filter(s->s.length()>=5).forEach(System.out::println);
      }
}
// zhangsan wangwu zhaoliu
```

### 1.2 stream 中间操作
常用API： filter limit distinct map sorted 
```java
Stream<T> filter(Predicate<? super T> predicate)
返回由与此给定谓词匹配的此流的元素组成的流。

Stream<T> limit(long maxSize)
返回由此流的元素组成的流，截短长度不能超过 maxSize 。

Stream<T> distinct()
返回由该流的不同元素（根据 Object.equals(Object) ）组成的流。

<R> Stream<R> map(Function<? super T,? extends R> mapper)
返回由给定函数应用于此流的元素的结果组成的流。

Stream<T> sorted()
返回由此流的元素组成的流，根据自然顺序排序。

Stream<T> sorted(Comparator<? super T> comparator)
返回由该流的元素组成的流，根据提供的 Comparator进行排序。
```

中间操作示例：
```java
public class TestStreamAPI {
      public static void main(String[] args) {
            List<String> list = Arrays.asList("zhangsan", "lisi",  "wangwu", "zhaoliu", "zuee", "zhangsan");
            
            // filter：过滤，指定规则
            System.out.println("--------------filter---------------");
            list.stream().filter(s->s.startsWith("z")).filter(s->s.contains("an")).forEach(System.out::println); // zhangsan ×2
            
            // limit：截断，返回不超过指定数量
            System.out.println("--------------limit---------------");
            list.stream().limit(2).forEach(System.out::println); //  zhangsan lisi
            // distinct：筛选，利用 hashCode 和 equals，不会影响原数据
            System.out.println("--------------distinct---------------");
            List<String> ls = new ArrayList<String>();
            list.stream().distinct().forEach(s->ls.add(s));
            ls.stream().forEach(System.out::println); // 过滤掉了重复的1个 zhangsan
            
            // map：给到T返回R，自动推断类型。不是集合！不是集合！不是集合！
            System.out.println("--------------map---------------");
            list.stream().map(s->s.toUpperCase()).forEach(System.out::println); //  全转大写
            list.stream().map(String::toUpperCase).forEach(System.out::println); //  全转大写(方法引用)
            
            // sorted：自然排序，默认升序(基本类型直接排序，引用类型需要实现 Comparable 接口中的 compareTo)
            System.out.println("--------------sorted---------------");
            list.stream().sorted().forEach(System.out::println);
            System.out.println("--------------sorted()---------------");
            // sorted(Comparator<? super T> comparator)：定制排序
            list.stream().sorted((x,y)->x.charAt(0) -  y.charAt(0)).forEach(System.out::println); // 实现 Comparable 接口的匿名内部类
            
      }
}
```

### 1.3 stream 终止操作
常用API： count forEach anyMatch allMatch noneMatch findFirst findAny min max
```java
long count()
返回流中的元素个数。

void forEach(Consumer<? super T> action)
对此流的每个元素执行遍历操作。

boolean anyMatch(Predicate<? super T> predicate)
或，流中是否有包含指定规则的元素

boolean allMatch(Predicate<? super T> predicate)
且，流中是否全部包含指定规则的元素

boolean noneMatch(Predicate<? super T> predicate)
非，流中是否都不包含指定规则的元素

Optional<T> findFirst()
返回流的第一个元素的Optional，如果流为空，则返回一个空的Optional 。

Optional<T> findAny()
返回流的任意一个随机元素的Optional，如果流为空，则返回一个空的Optional 。

Optional<T> max(Comparator<? super T> comparator)
根据提供的 Comparator 返回此流的最大元素。

Optional<T> min(Comparator<? super T> comparator)
根据提供的 Comparator 返回此流的最小元素。
```

终止操作示例：
```java
public class TestStreamEnd {
      public static void main(String[] args) {
            List<String> list = Arrays.asList("changsan", "lisi",  "wangwu", "zhaoliu", "zuee");
            
            // 1.forEach: 遍历
            list.stream().forEach(System.out::println); // changsan  lisi wangwu zhaoliu zuee
            
            // 2.count: 流中元素的个数
            long count = list.stream().filter(s->s.length()>4).count();
            System.out.println("流中长度>4元素个数：" + count); // 3
            
            // 3.anymatch: 或，是否有包含的元素
            boolean bool1 =  list.stream().filter(s->s.length()>4).anyMatch(s->s.startsWith("w"));
            System.out.println("流中是否是有包含 w 开头的元素：" +  bool1); // true
            
            // 4.allmatch: 且，是否全部都包含的元素
            boolean bool2 =  list.stream().filter(s->s.length()>4).allMatch(s->s.startsWith("w"));
            System.out.println("流中是否全是包含 w 开头的元素：" +  bool2); // false
            // 5.noneMatch: 非，是否没有匹配的元素
            boolean bool3 =  list.stream().filter(s->s.length()>4).noneMatch(s->s.startsWith("a"));
            System.out.println("流中是否没有包含 a 开头的元素：" +  bool3); // true
            
            // 6.findFirst: 返回流中第一个元素
            String s1 =  list.stream().filter(s->s.length()>4).findFirst().get();
            System.out.println("流中的第一个元素是：" + s1); //  changsan
            
            // 7.findAny: 返回流中任意一个元素
            String s2 = list.stream().findAny().get();
            String s3 = list.parallelStream().findAny().get(); // 并行流
            System.out.println("流中的随机1个元素是：" + s2 + " " +  s3); // changsan wangwu
            
            // 8.max/min: 返回流中的一个最大/最小的元素，需要在max/min中指定 Comparable 接口的比较规则
            String max = list.stream().max((e1,  e2)->e1.charAt(0)-e2.charAt(0)).get();
            System.out.println("首字母最大的是：" + max); // zhaoliu
      }
}
```
串行与并行的 Stream 效率对比：
```java
public class TestStreamOther {
      public static void main(String[] args) {
            List<String> list = new ArrayList<String>();
            
            for (int i = 0; i < 1000000; i++) {
                  list.add(UUID.randomUUID().toString());
            }
            
            // stream串行：一条执行路径，单线程
            System.out.println("串行运行时间：");
            long start = System.currentTimeMillis();
            long count = list.stream().sorted().count();
            System.out.println("排序的元素数量：" + count);
            System.out.println("用时：" + (System.currentTimeMillis() -  start)); // ≈1050毫秒
            // parallelStream 并行：多条执行路径，多线程
            System.out.println("并行运行时间：");
            start = System.currentTimeMillis();
            count = list.parallelStream().sorted().count();
            System.out.println("排序的元素数量：" + count);
            System.out.println("用时：" + (System.currentTimeMillis() -  start)); // ≈520毫秒
      }
}
```