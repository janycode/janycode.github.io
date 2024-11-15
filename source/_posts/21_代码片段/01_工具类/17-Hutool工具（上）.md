---
title: 17-Hutool工具（上）
date: 2023-08-20 15:16:15
tags:
- 工具类
categories:
- 21_代码片段
- 01_工具类
---



![image-20241114155630664](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241114155631.png)



参考资料: https://www.hutool.cn/

参考资料-api文档: https://apidoc.gitee.com/loolly/hutool/overview-summary.html

> 本文主要用作汇总和自查用。

依赖：

```xml
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.8.16</version>
</dependency>
```



# 支持泛型的克隆接口和克隆类

## 痛点

我们知道，JDK中的Cloneable接口只是一个空接口，并没有定义成员，它存在的意义仅仅是指明一个类的实例化对象支持位复制（就是对象克隆），如果不实现这个类，调用对象的clone()方法就会抛出CloneNotSupportedException异常。而且，因为clone()方法在Object对象中，返回值也是Object对象，因此克隆后我们需要自己强转下类型。

## 泛型克隆接口

因此，**cn.hutool.core.clone.Cloneable**接口应运而生。此接口定义了一个返回泛型的成员方法，这样，实现此接口后会提示必须实现一个public的clone方法，调用父类clone方法即可：

```java
/**
 * 猫猫类，使用实现Cloneable方式
 * @author Looly
 *
 */
private static class Cat implements Cloneable<Cat>{
    private String name = "miaomiao";
    private int age = 2;
    
    @Override
    public Cat clone() {
        try {
            return (Cat) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new CloneRuntimeException(e);
        }
    }
}
```

## 泛型克隆类

但是实现此接口依旧有不方便之处，就是必须自己实现一个public类型的clone()方法，还要调用父类（Object）的clone方法并处理异常。于是**cn.hutool.clone.CloneSupport**类产生，这个类帮我们实现了上面的clone方法，因此只要继承此类，不用写任何代码即可使用clone()方法：

```java
/**
 * 狗狗类，用于继承CloneSupport类
 * @author Looly
 *
 */
private static class Dog extends CloneSupport<Dog>{
    private String name = "wangwang";
    private int age = 3;
}
```

当然，使用**CloneSupport**的前提是你没有继承任何的类，谁让Java不支持多重继承呢（你依旧可以让父类继承这个类，如果可以的话）。如果没办法继承类，那实现**cn.hutool.clone.Cloneable\**也是不错的主意，因此**hutool**提供了这两种方式，任选其一，在便捷和灵活上都提供了支持。

## 深克隆

我们知道实现Cloneable接口后克隆的对象是浅克隆，要想实现深克隆，请使用：

```java
ObjectUtil.cloneByStream(obj)
```

前提是对象必须实现Serializable接口。

**ObjectUtil**同样提供一些静态方法：**clone(obj)\**、**cloneIfPossible(obj)**用于简化克隆调用，详细的说明请查看核心类的相关文档。



# 类型转换工具类-Convert

## 痛点

在Java开发中我们要面对各种各样的类型转换问题，尤其是从命令行获取的用户参数、从HttpRequest获取的Parameter等等，这些参数类型多种多样，我们怎么去转换他们呢？常用的办法是先整成String，然后调用XXX.parseXXX方法，还要承受转换失败的风险，不得不加一层try catch，这个小小的过程混迹在业务代码中会显得非常难看和臃肿。

## Convert类

**Convert**类可以说是一个工具方法类，里面封装了针对Java常见类型的转换，用于简化类型转换。**Convert**类中大部分方法为toXXX，参数为Object，可以实现将任意可能的类型转换为指定类型。同时支持第二个参数**defaultValue**用于在转换失败时返回一个默认值。

### Java常见类型转换

1. 转换为字符串：

```java
int a = 1;
//aStr为"1"
String aStr = Convert.toStr(a);

long[] b = {1,2,3,4,5};
//bStr为："[1, 2, 3, 4, 5]"
String bStr = Convert.toStr(b);
```

1. 转换为指定类型数组：

```java
String[] b = { "1", "2", "3", "4" };
//结果为Integer数组
Integer[] intArray = Convert.toIntArray(b);

long[] c = {1,2,3,4,5};
//结果为Integer数组
Integer[] intArray2 = Convert.toIntArray(c);
```

1. 转换为日期对象：

```
String a = "2017-05-06";
Date value = Convert.toDate(a);
```

1. 转换为集合

   ```
   Object[] a = {"a", "你", "好", "", 1};
   List<?> list = Convert.convert(List.class, a);
   //从4.1.11开始可以这么用
   List<?> list = Convert.toList(a);
   ```

### 其它类型转换

1. 标准类型

通过`Convert.convert(Class<T>, Object)`方法可以将任意类型转换为指定类型，Hutool中预定义了许多类型转换，例如转换为URI、URL、Calendar等等，这些类型的转换都依托于`ConverterRegistry`类。通过这个类和`Converter`接口，我们可以自定义一些类型转换。详细的使用请参阅“自定义类型转换”一节。

1. 泛型类型

通过`convert(TypeReference<T> reference, Object value)`方法，自行new一个`TypeReference`对象可以对嵌套泛型进行类型转换。例如，我们想转换一个对象为`List<String>`类型，此时传入的标准Class就无法满足要求，此时我们可以这样：

```java
Object[] a = { "a", "你", "好", "", 1 };
List<String> list = Convert.convert(new TypeReference<List<String>>() {}, a);
```

通过TypeReference实例化后制定泛型类型，即可转换对象为我们想要的目标类型。

### 半角和全角转换

在很多文本的统一化中这两个方法非常有用，主要对标点符号的全角半角转换。

半角转全角：

```java
String a = "123456789";

//结果为："１２３４５６７８９"
String sbc = Convert.toSBC(a);
```

全角转半角：

```java
String a = "１２３４５６７８９";

//结果为"123456789"
String dbc = Convert.toDBC(a);
```

### 16进制（Hex）

在很多加密解密，以及中文字符串传输（比如表单提交）的时候，会用到16进制转换，就是Hex转换，为此Hutool中专门封装了**HexUtil**工具类，考虑到16进制转换也是转换的一部分，因此将其方法也放在Convert类中，便于理解和查找，使用同样非常简单：

转为16进制（Hex）字符串

```java
String a = "我是一个小小的可爱的字符串";

//结果："e68891e698afe4b880e4b8aae5b08fe5b08fe79a84e58fafe788b1e79a84e5ad97e7aca6e4b8b2"
String hex = Convert.toHex(a, CharsetUtil.CHARSET_UTF_8);
```

将16进制（Hex）字符串转为普通字符串:

```java
String hex = "e68891e698afe4b880e4b8aae5b08fe5b08fe79a84e58fafe788b1e79a84e5ad97e7aca6e4b8b2";

//结果为："我是一个小小的可爱的字符串"
String raw = Convert.hexStrToStr(hex, CharsetUtil.CHARSET_UTF_8);

//注意：在4.1.11之后hexStrToStr将改名为hexToStr
String raw = Convert.hexToStr(hex, CharsetUtil.CHARSET_UTF_8);
```

> 因为字符串牵涉到编码问题，因此必须传入编码对象，此处使用UTF-8编码。 **toHex**方法同样支持传入byte[]，同样也可以使用**hexToBytes**方法将16进制转为byte[]

### Unicode和字符串转换

与16进制类似，Convert类同样可以在字符串和Unicode之间轻松转换：

```java
String a = "我是一个小小的可爱的字符串";

//结果为："\\u6211\\u662f\\u4e00\\u4e2a\\u5c0f\\u5c0f\\u7684\\u53ef\\u7231\\u7684\\u5b57\\u7b26\\u4e32"    
String unicode = Convert.strToUnicode(a);

//结果为："我是一个小小的可爱的字符串"
String raw = Convert.unicodeToStr(unicode);
```

很熟悉吧？如果你在properties文件中写过中文，你会明白这个方法的重要性。

### 编码转换

在接收表单的时候，我们常常被中文乱码所困扰，其实大多数原因是使用了不正确的编码方式解码了数据。于是`Convert.convertCharset`方法便派上用场了，它可以把乱码转为正确的编码方式：

```java
String a = "我不是乱码";
//转换后result为乱码
String result = Convert.convertCharset(a, CharsetUtil.UTF_8, CharsetUtil.ISO_8859_1);
String raw = Convert.convertCharset(result, CharsetUtil.ISO_8859_1, "UTF-8");
Assert.assertEquals(raw, a);
```

> 注意 经过测试，UTF-8编码后用GBK解码再用GBK编码后用UTF-8解码会存在某些中文转换失败的问题。

### 时间单位转换

`Convert.convertTime`方法主要用于转换时长单位，比如一个很大的毫秒，我想获得这个毫秒数对应多少分：

```java
long a = 4535345;

//结果为：75
long minutes = Convert.convertTime(a, TimeUnit.MILLISECONDS, TimeUnit.MINUTES);
```

### 金额大小写转换

面对财务类需求，`Convert.digitToChinese`将金钱数转换为大写形式：

```java
double a = 67556.32;

//结果为："陆万柒仟伍佰伍拾陆元叁角贰分"
String digitUppercase = Convert.digitToChinese(a);
```

> 注意 转换为大写只能精确到分（小数点儿后两位），之后的数字会被忽略。

### 数字转换

1. 数字转为英文表达

```java
// ONE HUNDRED AND CENTS TWENTY THREE ONLY
String format = Convert.numberToWord(100.23);
```

1. 数字简化

```java
// 1.2k
String format1 = Convert.numberToSimple(1200, false);
```

1. 数字转中文

数字转中文方法中，只保留两位小数

```java
// 一万零八百八十九点七二
String f1 = Convert.numberToChinese(10889.72356, false);

// 使用金额大写
// 壹万贰仟陆佰伍拾叁
String f1 = Convert.numberToChinese(12653, true);
```

1. 数字中文表示转换为数字

```java
// 1012
String f1 = Convert.numberToChinese("一千零一十二");
```

### 原始类和包装类转换

有的时候，我们需要将包装类和原始类相互转换（比如Integer.class 和 int.class），这时候我们可以：

```java
//去包装
Class<?> wrapClass = Integer.class;

//结果为：int.class
Class<?> unWraped = Convert.unWrap(wrapClass);

//包装
Class<?> primitiveClass = long.class;

//结果为：Long.class
Class<?> wraped = Convert.wrap(primitiveClass);
```

# 自定义类型转换-ConverterRegistry

## 由来

Hutool中类型转换最早只是一个工具类，叫做“Convert”，对于每一种类型转换都是用一个静态方法表示，但是这种方式有一个潜在问题，那就是扩展性不足，这导致Hutool只能满足部分类型转换的需求。

## 解决

为了解决这些问题，我对Hutool中这个类做了扩展。思想如下：

- `Converter` 类型转换接口，通过实现这个接口，重写convert方法，以实现不同类型的对象转换
- `ConverterRegistry` 类型转换登记中心。将各种类型Convert对象放入登记中心，通过`convert`方法查找目标类型对应的转换器，将被转换对象转换之。在此类中，存放着**默认转换器**和**自定义转换器**，默认转换器是Hutool中预定义的一些转换器，自定义转换器存放用户自定的转换器。

通过这种方式，实现类灵活的类型转换。使用方式如下：

```java
int a = 3423;
ConverterRegistry converterRegistry = ConverterRegistry.getInstance();
String result = converterRegistry.convert(String.class, a);
Assert.assertEquals("3423", result);
```

### 自定义转换

Hutool的默认转换有时候并不能满足我们自定义对象的一些需求，这时我们可以使用`ConverterRegistry.getInstance().putCustom()`方法自定义类型转换。

1. 自定义转换器

```java
public static class CustomConverter implements Converter<String>{
    @Override
    public String convert(Object value, String defaultValue) throws IllegalArgumentException {
        return "Custom: " + value.toString();
    }
}
```

1. 注册转换器

```java
ConverterRegistry converterRegistry = ConverterRegistry.getInstance();
//此处做为示例自定义String转换，因为Hutool中已经提供String转换，请尽量不要替换
//替换可能引发关联转换异常（例如覆盖String转换会影响全局）
converterRegistry.putCustom(String.class, CustomConverter.class);
```

1. 执行转换

```java
int a = 454553;
String result = converterRegistry.convert(String.class, a);
Assert.assertEquals("Custom: 454553", result);
```

> 注意： convert(Class type, Object value, T defaultValue, boolean isCustomFirst)方法的最后一个参数可以选择转换时优先使用自定义转换器还是默认转换器。convert(Class type, Object value, T defaultValue)和convert(Class type, Object value)两个重载方法都是使用自定义转换器优先的模式。

### `ConverterRegistry`单例和对象模式

ConverterRegistry提供一个静态方法getInstance()返回全局单例对象，这也是推荐的使用方式，当然如果想在某个限定范围内自定义转换，可以实例化ConverterRegistry对象。



# 日期时间工具-DateUtil

## 由来

考虑到Java本身对日期时间的支持有限，并且Date和Calendar对象的并存导致各种方法使用混乱和复杂，故使用此工具类做了封装。这其中的封装主要是日期和字符串之间的转换，以及提供对日期的定位（一个月前等等）。

对于Date对象，为了便捷，使用了一个DateTime类来代替之，继承自Date对象，主要的便利在于，覆盖了toString()方法，返回yyyy-MM-dd HH:mm:ss形式的字符串，方便在输出时的调用（例如日志记录等），提供了众多便捷的方法对日期对象操作，关于DateTime会在相关章节介绍。

## 方法

### 转换

#### Date、long、Calendar之间的相互转换

```java
//当前时间
Date date = DateUtil.date();
//当前时间
Date date2 = DateUtil.date(Calendar.getInstance());
//当前时间
Date date3 = DateUtil.date(System.currentTimeMillis());
//当前时间字符串，格式：yyyy-MM-dd HH:mm:ss
String now = DateUtil.now();
//当前日期字符串，格式：yyyy-MM-dd
String today= DateUtil.today();
```

#### 字符串转日期

`DateUtil.parse`方法会自动识别一些常用格式，包括：

yyyy-MM-dd HH:mm:ss

- yyyy/MM/dd HH:mm:ss
- yyyy.MM.dd HH:mm:ss
- yyyy年MM月dd日 HH时mm分ss秒
- yyyy-MM-dd
- yyyy/MM/dd
- yyyy.MM.dd
- HH:mm:ss
- HH时mm分ss秒
- yyyy-MM-dd HH:mm
- yyyy-MM-dd HH:mm:ss.SSS
- yyyyMMddHHmmss
- yyyyMMddHHmmssSSS
- yyyyMMdd
- EEE, dd MMM yyyy HH:mm:ss z
- EEE MMM dd HH:mm:ss zzz yyyy
- yyyy-MM-dd'T'HH:mm:ss'Z'
- yyyy-MM-dd'T'HH:mm:ss.SSS'Z'
- yyyy-MM-dd'T'HH:mm:ssZ
- yyyy-MM-dd'T'HH:mm:ss.SSSZ

```java
String dateStr = "2017-03-01";
Date date = DateUtil.parse(dateStr);
```

我们也可以使用自定义日期格式转化：

```java
String dateStr = "2017-03-01";
Date date = DateUtil.parse(dateStr, "yyyy-MM-dd");
```

### 格式化日期输出

```java
String dateStr = "2017-03-01";
Date date = DateUtil.parse(dateStr);

//结果 2017/03/01
String format = DateUtil.format(date, "yyyy/MM/dd");

//常用格式的格式化，结果：2017-03-01
String formatDate = DateUtil.formatDate(date);

//结果：2017-03-01 00:00:00
String formatDateTime = DateUtil.formatDateTime(date);

//结果：00:00:00
String formatTime = DateUtil.formatTime(date);
```

### 获取Date对象的某个部分

```java
Date date = DateUtil.date();
//获得年的部分
DateUtil.year(date);
//获得月份，从0开始计数
DateUtil.month(date);
//获得月份枚举
DateUtil.monthEnum(date);
//.....
```

### 开始和结束时间

有的时候我们需要获得每天的开始时间、结束时间，每月的开始和结束时间等等，DateUtil也提供了相关方法：

```java
String dateStr = "2017-03-01 22:33:23";
Date date = DateUtil.parse(dateStr);

//一天的开始，结果：2017-03-01 00:00:00
Date beginOfDay = DateUtil.beginOfDay(date);

//一天的结束，结果：2017-03-01 23:59:59
Date endOfDay = DateUtil.endOfDay(date);
```

### 日期时间偏移

日期或时间的偏移指针对某个日期增加或减少分、小时、天等等，达到日期变更的目的。Hutool也针对其做了大量封装

```java
String dateStr = "2017-03-01 22:33:23";
Date date = DateUtil.parse(dateStr);

//结果：2017-03-03 22:33:23
Date newDate = DateUtil.offset(date, DateField.DAY_OF_MONTH, 2);

//常用偏移，结果：2017-03-04 22:33:23
DateTime newDate2 = DateUtil.offsetDay(date, 3);

//常用偏移，结果：2017-03-01 19:33:23
DateTime newDate3 = DateUtil.offsetHour(date, -3);
```

针对当前时间，提供了简化的偏移方法（例如昨天、上周、上个月等）：

```java
//昨天
DateUtil.yesterday()
//明天
DateUtil.tomorrow()
//上周
DateUtil.lastWeek()
//下周
DateUtil.nextWeek()
//上个月
DateUtil.lastMonth()
//下个月
DateUtil.nextMonth()
```

### 日期时间差

有时候我们需要计算两个日期之间的时间差（相差天数、相差小时数等等），Hutool将此类方法封装为between方法：

```java
String dateStr1 = "2017-03-01 22:33:23";
Date date1 = DateUtil.parse(dateStr1);

String dateStr2 = "2017-04-01 23:33:23";
Date date2 = DateUtil.parse(dateStr2);

//相差一个月，31天
long betweenDay = DateUtil.between(date1, date2, DateUnit.DAY);
```

### 格式化时间差

有时候我们希望看到易读的时间差，比如XX天XX小时XX分XX秒，此时使用`DateUtil.formatBetween`方法：

```java
//Level.MINUTE表示精确到分
String formatBetween = DateUtil.formatBetween(between, Level.MINUTE);
//输出：31天1小时
Console.log(formatBetween);
```

### 星座和属相

```java
// "摩羯座"
String zodiac = DateUtil.getZodiac(Month.JANUARY.getValue(), 19);

// "狗"
String chineseZodiac = DateUtil.getChineseZodiac(1994);
```

### 其它

```java
//年龄
DateUtil.ageOfNow("1990-01-30");

//是否闰年
DateUtil.isLeapYear(2017);
```

# 日期时间对象-DateTime

## 由来

考虑工具类的局限性，在某些情况下使用并不简便，于是`DateTime`类诞生。`DateTime`对象充分吸取Joda-Time库的优点，并提供更多的便捷方法，这样我们在开发时不必再单独导入Joda-Time库便可以享受简单快速的日期时间处理过程。

## 说明

**DateTime**类继承于java.util.Date类，为Date类扩展了众多简便方法，这些方法多是`DateUtil`静态方法的对象表现形式，使用DateTime对象可以完全替代开发中Date对象的使用。

## 使用

### 新建对象

`DateTime`对象包含众多的构造方法，构造方法支持的参数有：

- Date
- Calendar
- String(日期字符串，第二个参数是日期格式)
- long 毫秒数

构建对象有两种方式：`DateTime.of()`和`new DateTime()`：

```java
Date date = new Date();
        
//new方式创建
DateTime time = new DateTime(date);
Console.log(time);

//of方式创建
DateTime now = DateTime.now();
DateTime dt = DateTime.of(date);
```

### 使用对象

`DateTime`的成员方法与`DateUtil`中的静态方法所对应，因为是成员方法，因此可以使用更少的参数操作日期时间。

示例：获取日期成员（年、月、日等）

```java
DateTime dateTime = new DateTime("2017-01-05 12:34:23", DatePattern.NORM_DATETIME_FORMAT);
        
//年，结果：2017
int year = dateTime.year();

//季度（非季节），结果：Season.SPRING
Season season = dateTime.seasonEnum();

//月份，结果：Month.JANUARY
Month month = dateTime.monthEnum();

//日，结果：5
int day = dateTime.dayOfMonth();
```

更多成员方法请参阅API文档。

### 对象的可变性

DateTime对象默认是可变对象（调用offset、setField、setTime方法默认变更自身），但是这种可变性有时候会引起很多问题（例如多个地方共用DateTime对象）。我们可以调用`setMutable(false)`方法使其变为不可变对象。在不可变模式下，`offset`、`setField`方法返回一个新对象，`setTime`方法抛出异常。

```java
DateTime dateTime = new DateTime("2017-01-05 12:34:23", DatePattern.NORM_DATETIME_FORMAT);

//默认情况下DateTime为可变对象，此时offset == dateTime
DateTime offset = dateTime.offset(DateField.YEAR, 0);

//设置为不可变对象后变动将返回新对象，此时offset != dateTime
dateTime.setMutable(false);
offset = dateTime.offset(DateField.YEAR, 0);
```

### 格式化为字符串

调用`toString()`方法即可返回格式为`yyyy-MM-dd HH:mm:ss`的字符串，调用`toString(String format)`可以返回指定格式的字符串。

```java
DateTime dateTime = new DateTime("2017-01-05 12:34:23", DatePattern.NORM_DATETIME_FORMAT);
//结果：2017-01-05 12:34:23
String dateStr = dateTime.toString();

//结果：2017/01/05
```

# 农历日期-ChineseDate

## 介绍

农历日期，提供了生肖、天干地支、传统节日等方法。

## 使用

1. 构建`ChineseDate`对象

`ChineseDate`表示了农历的对象，构建此对象既可以使用公历的日期，也可以使用农历的日期。

```java
//通过农历构建
ChineseDate chineseDate = new ChineseDate(1992,12,14);

//通过公历构建
ChineseDate chineseDate = new ChineseDate(DateUtil.parseDate("1993-01-06"));
```

1. 基本使用

```java
//通过公历构建
ChineseDate date = new ChineseDate(DateUtil.parseDate("2020-01-25"));
// 一月
date.getChineseMonth();
// 正月
date.getChineseMonthName();
// 初一
date.getChineseDay();
// 庚子
date.getCyclical();
// 生肖：鼠
date.getChineseZodiac();
// 传统节日（部分支持，逗号分隔）：春节
date.getFestivals();
// 庚子鼠年 正月初一
date.toString();
```

1. 获取天干地支

从`5.4.1`开始，Hutool支持天干地支的获取：

```java
//通过公历构建
ChineseDate chineseDate = new ChineseDate(DateUtil.parseDate("2020-08-28"));

// 庚子年甲申月癸卯日
String cyclicalYMD = chineseDate.getCyclicalYMD();
```

# LocalDateTime工具-LocalDateTimeUtil

## 介绍

从Hutool的5.4.x开始，Hutool加入了针对JDK8+日期API的封装，此工具类的功能包括`LocalDateTime`和`LocalDate`的解析、格式化、转换等操作。

## 使用

1. 日期转换

```java
String dateStr = "2020-01-23T12:23:56";
DateTime dt = DateUtil.parse(dateStr);

// Date对象转换为LocalDateTime
LocalDateTime of = LocalDateTimeUtil.of(dt);

// 时间戳转换为LocalDateTime
of = LocalDateTimeUtil.ofUTC(dt.getTime());
```

1. 日期字符串解析

```java
// 解析ISO时间
LocalDateTime localDateTime = LocalDateTimeUtil.parse("2020-01-23T12:23:56");


// 解析自定义格式时间
localDateTime = LocalDateTimeUtil.parse("2020-01-23", DatePattern.NORM_DATE_PATTERN);
```

解析同样支持`LocalDate`：

```java
LocalDate localDate = LocalDateTimeUtil.parseDate("2020-01-23");

// 解析日期时间为LocalDate，时间部分舍弃
localDate = LocalDateTimeUtil.parseDate("2020-01-23T12:23:56", DateTimeFormatter.ISO_DATE_TIME);
```

1. 日期格式化

```java
LocalDateTime localDateTime = LocalDateTimeUtil.parse("2020-01-23T12:23:56");

// "2020-01-23 12:23:56"
String format = LocalDateTimeUtil.format(localDateTime, DatePattern.NORM_DATETIME_PATTERN);
```

1. 日期偏移

```java
final LocalDateTime localDateTime = LocalDateTimeUtil.parse("2020-01-23T12:23:56");

// 增加一天
// "2020-01-24T12:23:56"
LocalDateTime offset = LocalDateTimeUtil.offset(localDateTime, 1, ChronoUnit.DAYS);
```

如果是减少时间，offset第二个参数传负数即可：

```java
// "2020-01-22T12:23:56"
offset = LocalDateTimeUtil.offset(localDateTime, -1, ChronoUnit.DAYS);
```

1. 计算时间间隔

```java
LocalDateTime start = LocalDateTimeUtil.parse("2019-02-02T00:00:00");
LocalDateTime end = LocalDateTimeUtil.parse("2020-02-02T00:00:00");

Duration between = LocalDateTimeUtil.between(start, end);

// 365
between.toDays();
```

1. 一天的开始和结束

```java
LocalDateTime localDateTime = LocalDateTimeUtil.parse("2020-01-23T12:23:56");

// "2020-01-23T00:00"
LocalDateTime beginOfDay = LocalDateTimeUtil.beginOfDay(localDateTime);

// "2020-01-23T23:59:59.999999999"
LocalDateTime endOfDay = LocalDateTimeUtil.endOfDay(localDateTime);
```

# 计时器工具-TimeInterval

## 介绍

Hutool通过封装`TimeInterval`实现计时器功能，即可以计算方法或过程执行的时间。

`TimeInterval`支持分组计时，方便对比时间。

## 使用

```java
TimeInterval timer = DateUtil.timer();

//---------------------------------
//-------这是执行过程
//---------------------------------

timer.interval();//花费毫秒数
timer.intervalRestart();//返回花费时间，并重置开始时间
timer.intervalMinute();//花费分钟数
```

也可以实现分组计时：

```java
final TimeInterval timer = new TimeInterval();

// 分组1
timer.start("1");
ThreadUtil.sleep(800);

// 分组2
timer.start("2");
ThreadUtil.sleep(900);

Console.log("Timer 1 took {} ms", timer.intervalMs("1"));
Console.log("Timer 2 took {} ms", timer.intervalMs("2"));
```

# IO工具类-IoUtil

## 由来

IO工具类的存在主要针对InputStream、OutputStream、Reader、Writer封装简化，并对NIO相关操作做封装简化。总体来说，Hutool对IO的封装，主要是工具层面，我们努力做到在便捷、性能和灵活之间找到最好的平衡点。

## 方法

### 拷贝

流的读写可以总结为从输入流读取，从输出流写出，这个过程我们定义为**拷贝**。这个是一个基本过程，也是文件、流操作的基础。

以文件流拷贝为例：

```java
BufferedInputStream in = FileUtil.getInputStream("d:/test.txt");
BufferedOutputStream out = FileUtil.getOutputStream("d:/test2.txt");
long copySize = IoUtil.copy(in, out, IoUtil.DEFAULT_BUFFER_SIZE);
```

copy方法同样针对Reader、Writer、Channel等对象有一些重载方法，并提供可选的缓存大小。默认的，缓存大小为`1024`个字节，如果拷贝大文件或流数据较大，可以适当调整这个参数。

针对NIO，提供了`copyByNIO`方法，以便和BIO有所区别。我查阅过一些资料，使用NIO对文件流的操作有一定的提升，我并没有做具体实验。相关测试请参阅博客：http://www.cnblogs.com/gaopeng527/p/4896783.html

### Stream转Reader、Writer

- `IoUtil.getReader`：将`InputStream`转为`BufferedReader`用于读取字符流，它是部分readXXX方法的基础。
- `IoUtil.getWriter`：将`OutputStream`转为`OutputStreamWriter`用于写入字符流，它是部分writeXXX的基础。

本质上这两个方法只是简单new一个新的Reader或者Writer对象，但是封装为工具方法配合IDE的自动提示可以大大减少查阅次数（例如你对BufferedReader、OutputStreamWriter不熟悉，是不需要搜索一下相关类？）

### 读取流中的内容

读取流中的内容总结下来，可以分为read方法和readXXX方法。

1. `read`方法有诸多的重载方法，根据参数不同，可以读取不同对象中的内容，这包括：

- `InputStream`
- `Reader`
- `FileChannel`

这三个重载大部分返回String字符串，为字符流读取提供极大便利。

1. `readXXX`方法主要针对返回值做一些处理，例如：

- `readBytes` 返回byte数组（读取图片等）
- `readHex` 读取16进制字符串
- `readObj` 读取序列化对象（反序列化）
- `readLines` 按行读取

1. `toStream`方法则是将某些对象转换为流对象，便于在某些情况下操作：

- `String` 转换为`ByteArrayInputStream`
- `File` 转换为`FileInputStream`

### 写入到流

- `IoUtil.write`方法有两个重载方法，一个直接调用`OutputStream.write`方法，另一个用于将对象转换为字符串（调用toString方法），然后写入到流中。
- `IoUtil.writeObjects` 用于将可序列化对象序列化后写入到流中。

`write`方法并没有提供writeXXX，需要自己转换为String或byte[]。

### 关闭

对于IO操作来说，使用频率最高（也是最容易被遗忘）的就是`close`操作，好在Java规范使用了优雅的`Closeable`接口，这样我们只需简单封装调用此接口的方法即可。

关闭操作会面临两个问题：

1. 被关闭对象为空
2. 对象关闭失败（或对象已关闭）

`IoUtil.close`方法很好的解决了这两个问题。

在JDK1.7中，提供了`AutoCloseable`接口，在`IoUtil`中同样提供相应的重载方法，在使用中并不能感觉到有哪些不同。

# 文件工具类-FileUtil

## 简介

在IO操作中，文件的操作相对来说是比较复杂的，但也是使用频率最高的部分，我们几乎所有的项目中几乎都躺着一个叫做FileUtil或者FileUtils的工具类，我想Hutool应该将这个工具类纳入其中，解决用来解决大部分的文件操作问题。

总体来说，FileUtil类包含以下几类操作工具：

1. 文件操作：包括文件目录的新建、删除、复制、移动、改名等
2. 文件判断：判断文件或目录是否非空，是否为目录，是否为文件等等。
3. 绝对路径：针对ClassPath中的文件转换为绝对路径文件。
4. 文件名：主文件名，扩展名的获取
5. 读操作：包括类似IoUtil中的getReader、readXXX操作
6. 写操作：包括getWriter和writeXXX操作

在FileUtil中，我努力将方法名与Linux相一致，例如创建文件的方法并不是createFile，而是`touch`，这种统一对于熟悉Linux的人来说，大大提高了上手速度。当然，如果你不熟悉Linux，那FileUtil工具类的使用则是在帮助你学习Linux命令。这些类Linux命令的方法包括：

- `ls` 列出目录和文件
- `touch` 创建文件，如果父目录不存在也自动创建
- `mkdir` 创建目录，会递归创建每层目录
- `del` 删除文件或目录（递归删除，不判断是否为空），这个方法相当于Linux的delete命令
- `copy` 拷贝文件或目录

这些方法提供了人性化的操作，例如`touch`方法，在创建文件的情况下会自动创建上层目录（我想对于使用者来说这也是大部分情况下的需求），同样`mkdir`也会创建父目录。

> 需要注意的是，`del`方法会删除目录而不判断其是否为空，这一方面方便了使用，另一方面也可能造成一些预想不到的后果（比如拼写错路径而删除不应该删除的目录），所以请谨慎使用此方法。

关于FileUtil中更多工具方法，请参阅API文档。



# 文件类型判断-FileTypeUtil

## 由来

在文件上传时，有时候我们需要判断文件类型。但是又不能简单的通过扩展名来判断（防止恶意脚本等通过上传到服务器上），于是我们需要在服务端通过读取文件的首部几个二进制位来判断常用的文件类型。

## 使用

这个工具类使用非常简单，通过调用`FileTypeUtil.getType`即可判断，这个方法同时提供众多的重载方法，用于读取不同的文件和流。

```java
File file = FileUtil.file("d:/test.jpg");
String type = FileTypeUtil.getType(file);
//输出 jpg则说明确实为jpg文件
Console.log(type);
```

## 原理和局限性

这个类是通过读取文件流中前N个byte值来判断文件类型，在类中我们通过Map形式将常用的文件类型做了映射，这些映射都是网络上搜集而来。也就是说，我们只能识别有限的几种文件类型。但是这些类型已经涵盖了常用的图片、音频、视频、Office文档类型，可以应对大部分的使用场景。

> 对于某些文本格式的文件我们并不能通过首部byte判断其类型，比如`JSON`，这类文件本质上是文本文件，我们应该读取其文本内容，通过其语法判断类型。

## 自定义类型

为了提高`FileTypeUtil`的扩展性，我们通过`putFileType`方法可以自定义文件类型。

```java
FileTypeUtil.putFileType("ffd8ffe000104a464946", "new_jpg");
```

第一个参数是文件流的前N个byte的16进制表示，我们可以读取自定义文件查看，选取一定长度即可(长度越长越精确)，第二个参数就是文件类型，然后使用`FileTypeUtil.getType`即可。

> 注意 xlsx、docx本质上是各种XML打包为zip的结果，因此会被识别为zip格式。

# 文件监听-WatchMonitor

## 由来

很多时候我们需要监听一个文件的变化或者目录的变动，包括文件的创建、修改、删除，以及目录下文件的创建、修改和删除，在JDK7前我们只能靠轮询方式遍历目录或者定时检查文件的修改事件，这样效率非常低，性能也很差。因此在JDK7中引入了`WatchService`。不过考虑到其API并不友好，于是Hutool便针对其做了简化封装，使监听更简单，也提供了更好的功能，这包括：

- 支持多级目录的监听（WatchService只支持一级目录），可自定义监听目录深度
- 延迟合并触发支持（文件变动时可能触发多次modify，支持在某个时间范围内的多次修改事件合并为一个修改事件）
- 简洁易懂的API方法，一个方法即可搞定监听，无需理解复杂的监听注册机制。
- 多观察者实现，可以根据业务实现多个`Watcher`来响应同一个事件（通过WatcherChain）

### WatchMonitor

在Hutool中，`WatchMonitor`主要针对JDK7中`WatchService`做了封装，针对文件和目录的变动（创建、更新、删除）做一个钩子，在`Watcher`中定义相应的逻辑来应对这些文件的变化。

### 内部应用

在hutool-setting模块，使用WatchMonitor监测配置文件变化，然后自动load到内存中。WatchMonitor的使用可以避免轮询，以事件响应的方式应对文件变化。

## 使用

`WatchMonitor`提供的事件有：

- `ENTRY_MODIFY` 文件修改的事件
- `ENTRY_CREATE` 文件或目录创建的事件
- `ENTRY_DELETE` 文件或目录删除的事件
- `OVERFLOW` 丢失的事件

这些事件对应`StandardWatchEventKinds`中的事件。

下面我们介绍WatchMonitor的使用：

### 监听指定事件

```java
File file = FileUtil.file("example.properties");
//这里只监听文件或目录的修改事件
WatchMonitor watchMonitor = WatchMonitor.create(file, WatchMonitor.ENTRY_MODIFY);
watchMonitor.setWatcher(new Watcher(){
    @Override
    public void onCreate(WatchEvent<?> event, Path currentPath) {
        Object obj = event.context();
        Console.log("创建：{}-> {}", currentPath, obj);
    }

    @Override
    public void onModify(WatchEvent<?> event, Path currentPath) {
        Object obj = event.context();
        Console.log("修改：{}-> {}", currentPath, obj);
    }

    @Override
    public void onDelete(WatchEvent<?> event, Path currentPath) {
        Object obj = event.context();
        Console.log("删除：{}-> {}", currentPath, obj);
    }

    @Override
    public void onOverflow(WatchEvent<?> event, Path currentPath) {
        Object obj = event.context();
        Console.log("Overflow：{}-> {}", currentPath, obj);
    }
});

//设置监听目录的最大深入，目录层级大于制定层级的变更将不被监听，默认只监听当前层级目录
watchMonitor.setMaxDepth(3);
//启动监听
watchMonitor.start();
```

### 监听全部事件

其实我们不必实现`Watcher`的所有接口方法，Hutool同时提供了`SimpleWatcher`类，只需重写对应方法即可。

同样，如果我们想监听所有事件，可以：

```java
WatchMonitor.createAll(file, new SimpleWatcher(){
    @Override
    public void onModify(WatchEvent<?> event, Path currentPath) {
        Console.log("EVENT modify");
    }
}).start();
```

`createAll`方法会创建一个监听所有事件的WatchMonitor，同时在第二个参数中定义Watcher来负责处理这些变动。

### 延迟处理监听事件

在监听目录或文件时，如果这个文件有修改操作，JDK会多次触发modify方法，为了解决这个问题，我们定义了`DelayWatcher`，此类通过维护一个Set将短时间内相同文件多次modify的事件合并处理触发，从而避免以上问题。

```java
WatchMonitor monitor = WatchMonitor.createAll("d:/", new DelayWatcher(watcher, 500));
monitor.start();
```

# 文件读取-FileReader

## 由来

在`FileUtil`中本来已经针对文件的读操作做了大量的静态封装，但是根据职责分离原则，我觉得有必要针对文件读取单独封装一个类，这样项目更加清晰。当然，使用FileUtil操作文件是最方便的。

## 使用

在JDK中，同样有一个FileReader类，但是并不如想象中的那样好用，于是Hutool便提供了更加便捷FileReader类。

```java
//默认UTF-8编码，可以在构造中传入第二个参数做为编码
FileReader fileReader = new FileReader("test.properties");
String result = fileReader.readString();
```

FileReader提供了以下方法来快速读取文件内容：

- `readBytes`
- `readString`
- `readLines`

同时，此类还提供了以下方法用于转换为流或者BufferedReader：

- `getReader`
- `getInputStream`

# 文件写入-FileWriter

相应的，文件读取有了，自然有文件写入类，使用方式与`FileReader`也类似：

```java
FileWriter writer = new FileWriter("test.properties");
writer.write("test");
```

写入文件分为追加模式和覆盖模式两类，追加模式可以用`append`方法，覆盖模式可以用`write`方法，同时也提供了一个write方法，第二个参数是可选覆盖模式。

同样，此类提供了：

- `getOutputStream`
- `getWriter`
- `getPrintWriter`

这些方法用于转换为相应的类提供更加灵活的写入操作。

# 文件追加-FileAppender

## 由来

顾名思义，`FileAppender`类表示文件追加器。此对象持有一个一个文件，在内存中积累一定量的数据后统一追加到文件，此类只有在写入文件时打开文件，并在写入结束后关闭之。因此此类不需要关闭。

在调用append方法后会缓存于内存，只有超过容量后才会一次性写入文件，因此内存中随时有剩余未写入文件的内容，在最后必须调用flush方法将剩余内容刷入文件。

也就是说，这是一个支持缓存的文件内容追加器。此类主要用于类似于日志写出这类需求所用。

## 使用

```java
FileAppender appender = new FileAppender(file, 16, true);
appender.append("123");
appender.append("abc");
appender.append("xyz");

appender.flush();
appender.toString();
```

# 文件跟随-Tailer

## 由来

有时候我们要启动一个线程实时“监控”文件的变化，比如有新内容写出到文件时，我们可以及时打印出来，这个功能非常类似于Linux下的`tail -f`命令。

## 使用

```java
Tailer tailer = new Tailer(FileUtil.file("f:/test/test.log"), Tailer.CONSOLE_HANDLER, 2);
tailer.start();
```

其中`Tailer.CONSOLE_HANDLER`表示文件新增内容默认输出到控制台。

```java
/**
 * 命令行打印的行处理器
 * 
 * @author looly
 * @since 4.5.2
 */
public static class ConsoleLineHandler implements LineHandler {
    @Override
    public void handle(String line) {
        Console.log(line);
    }
}
```

我们也可以实现自己的LineHandler来处理每一行数据。

> 注意 此方法会阻塞当前线程。

# 文件名工具-FileNameUtil

## 由来

文件名操作工具类，主要针对文件名获取主文件名、扩展名等操作，同时针对Windows平台，清理无效字符。

此工具类在`5.4.1`之前是`FileUtil`的一部分，后单独剥离为`FileNameUtil`工具。

## 使用

1. 获取文件名

```java
File file = FileUtil.file("/opt/test.txt");

// test.txt
String name = FileNameUtil.getName(file);
```

1. 获取主文件名和扩展名

```java
File file = FileUtil.file("/opt/test.txt");

// "test"
String name = FileNameUtil.mainName(file);

// "txt"
String name = FileNameUtil.extName(file);
```

> 注意，此处获取的扩展名不带`.`。 `FileNameUtil.mainName`和`FileNameUtil.getPrefix`等价，同理`FileNameUtil.extName`和`FileNameUtil.getSuffix`等价，保留两个方法用于适应不同用户的习惯。

# 资源工具-ResourceUtil

## 介绍

`ResourceUtil`提供了资源快捷读取封装。

## 使用

`ResourceUtil`中最核心的方法是`getResourceObj`，此方法可以根据传入路径是否为绝对路径而返回不同的实现。比如路径是：`file:/opt/test`，或者`/opt/test`都会被当作绝对路径，此时调用`FileResource`来读取数据。如果不满足以上条件，默认调用`ClassPathResource`读取classpath中的资源或者文件。

同样，此工具类还封装了`readBytes`和`readStr`用于快捷读取bytes和字符串。

举个例子，假设我们在classpath下放了一个`test.xml`，读取就变得非常简单：

```java
String str = ResourceUtil.readUtf8Str("test.xml");
```

假设我们的文件存放在`src/resources/config`目录下，则读取改为：

```java
String str = ResourceUtil.readUtf8Str("config/test.xml");
```

> 注意 在IDEA中，新加入文件到`src/resources`目录下，需要重新import项目，以便在编译时顺利把资源文件拷贝到target目录下。如果提示找不到文件，请去target目录下确认文件是否存在。

# ClassPath资源访问-ClassPathResource

## 什么是ClassPath

简单说来ClassPath就是查找class文件的路径，在Tomcat等容器下，ClassPath一般是`WEB-INF/classes`，在普通java程序中，我们可以通过定义`-cp`或者`-classpath`参数来定义查找class文件的路径，这些路径就是ClassPath。

为了项目方便，我们定义的配置文件肯定不能使用绝对路径，所以需要使用相对路径，这时候最好的办法就是把配置文件和class文件放在一起，便于查找。

## 由来

在Java编码过程中，我们常常希望读取项目内的配置文件，按照Maven的习惯，这些文件一般放在项目的`src/main/resources`下，读取的时候使用：

```java
String path = "config.properties";
InputStream in = this.class.getResource(path).openStream();
```

使用当前类来获得资源其实就是使用当前类的类加载器获取资源，最后openStream()方法获取输入流来读取文件流。

## 封装

面对这种复杂的读取操作，我们封装了`ClassPathResource`类来简化这种资源的读取：

```java
ClassPathResource resource = new ClassPathResource("test.properties");
Properties properties = new Properties();
properties.load(resource.getStream());

Console.log("Properties: {}", properties);
```

这样就大大简化了ClassPath中资源的读取。

> Hutool提供针对properties的封装类`Props`，同时提供更加强大的配置文件Setting类，这两个类已经针对ClassPath做过相应封装，可以以更加便捷的方式读取配置文件。相关文档请参阅Hutool-setting章节

# 字符串工具-StrUtil

## 由来

这个工具的用处类似于[Apache Commons Lang](http://commons.apache.org/)中的`StringUtil`，之所以使用`StrUtil`而不是使用`StringUtil`是因为前者更短，而且`Str`这个简写我想已经深入人心了，大家都知道是字符串的意思。常用的方法例如`isBlank`、`isNotBlank`、`isEmpty`、`isNotEmpty`这些我就不做介绍了，判断字符串是否为空，下面我说几个比较好用的功能。

## 方法

### 1. `hasBlank`、`hasEmpty`方法

就是给定一些字符串，如果一旦有空的就返回true，常用于判断好多字段是否有空的（例如web表单数据）。

**这两个方法的区别是`hasEmpty`只判断是否为null或者空字符串（""），`hasBlank`则会把不可见字符也算做空，`isEmpty`和`isBlank`同理。**

### 2. `removePrefix`、`removeSuffix`方法

这两个是去掉字符串的前缀后缀的，例如去个文件名的扩展名啥。

```Java
String fileName = StrUtil.removeSuffix("pretty_girl.jpg", ".jpg")  //fileName -> pretty_girl
```

还有忽略大小写的`removePrefixIgnoreCase`和`removeSuffixIgnoreCase`都比较实用。

### 3. `sub`方法

不得不提一下这个方法，有人说String有了subString你还写它干啥，我想说subString方法越界啥的都会报异常，你还得自己判断，难受死了，我把各种情况判断都加进来了，而且index的位置还支持负数哦，-1表示最后一个字符（这个思想来自于[Python](https://www.python.org/)，如果学过[Python](https://www.python.org/)的应该会很喜欢的），还有就是如果不小心把第一个位置和第二个位置搞反了，也会自动修正（例如想截取第4个和第2个字符之间的部分也是可以的哦~） 举个栗子

```Java
String str = "abcdefgh";
String strSub1 = StrUtil.sub(str, 2, 3); //strSub1 -> c
String strSub2 = StrUtil.sub(str, 2, -3); //strSub2 -> cde
String strSub3 = StrUtil.sub(str, 3, 2); //strSub2 -> c
```

### 4. `str`、`bytes`方法

好吧，我承认把`String.getByte(String charsetName)`方法封装在这里了，原生的`String.getByte()`这个方法太坑了，使用系统编码，经常会有人跳进来导致乱码问题，所以我就加了这两个方法强制指定字符集了，包了个try抛出一个运行时异常，省的我得在我业务代码里处理那个恶心的`UnsupportedEncodingException`。

### 5. format方法

我会告诉你这是我最引以为豪的方法吗？灵感来自slf4j，可以使用字符串模板代替字符串拼接，我也自己实现了一个，而且变量的标识符都一样，神马叫无缝兼容~~来，上栗子（吃多了上火吧……）

```Java
String template = "{}爱{}，就像老鼠爱大米";
String str = StrUtil.format(template, "我", "你"); //str -> 我爱你，就像老鼠爱大米
```

参数我定义成了Object类型，如果传别的类型的也可以，会自动调用toString()方法的。

### 6. 定义的一些常量

为了方便，我定义了一些比较常见的字符串常量在里面，像点、空串、换行符等等，还有HTML中的一些转义字符。

更多方法请参阅API文档。

# 16进制工具-HexUtil

## 介绍

十六进制（简写为hex或下标16）在数学中是一种逢16进1的进位制，一般用数字0到9和字母A到F表示（其中:A~~F即10~~15）。例如十进制数57，在二进制写作111001，在16进制写作39。

像java,c这样的语言为了区分十六进制和十进制数值,会在十六进制数的前面加上 0x,比如0x20是十进制的32,而不是十进制的20。`HexUtil`就是将字符串或byte数组与16进制表示转换的工具类。

## 用于

16进制一般针对无法显示的一些二进制进行显示，常用于： 1、图片的字符串表现形式 2、加密解密 3、编码转换

## 使用

`HexUtil`主要以`encodeHex`和`decodeHex`两个方法为核心，提供一些针对字符串的重载方法。

```java
String str = "我是一个字符串";

String hex = HexUtil.encodeHexStr(str, CharsetUtil.CHARSET_UTF_8);

//hex是：
//e68891e698afe4b880e4b8aae5ad97e7aca6e4b8b2

String decodedStr = HexUtil.decodeHexStr(hex);

//解码后与str相同
```

# Escape工具-EscapeUtil

## 介绍

转义和反转义工具类Escape / Unescape。escape采用ISO Latin字符集对指定的字符串进行编码。所有的空格符、标点符号、特殊字符以及其他非ASCII字符都将被转化成%xx格式的字符编码(xx等于该字符在字符集表里面的编码的16进制数字)。

此类中的方法对应Javascript中的`escape()`函数和`unescape()`函数。

## 方法

1. `EscapeUtil.escape` Escape编码（Unicode），该方法不会对 ASCII 字母和数字进行编码，也不会对下面这些 ASCII 标点符号进行编码： * @ - _ + . / 。其他所有的字符都会被转义序列替换。
2. `EscapeUtil.unescape` Escape解码。
3. `EscapeUtil.safeUnescape` 安全的unescape文本，当文本不是被escape的时候，返回原文。

# Hash算法-HashUtil

## 介绍

`HashUtil`其实是一个hash算法的集合，此工具类中融合了各种hash算法。

## 方法

这些算法包括：

1. `additiveHash` 加法hash
2. `rotatingHash` 旋转hash
3. `oneByOneHash` 一次一个hash
4. `bernstein` Bernstein's hash
5. `universal` Universal Hashing
6. `zobrist` Zobrist Hashing
7. `fnvHash` 改进的32位FNV算法1
8. `intHash` Thomas Wang的算法，整数hash
9. `rsHash` RS算法hash
10. `jsHash` JS算法
11. `pjwHash` PJW算法
12. `elfHash` ELF算法
13. `bkdrHash` BKDR算法
14. `sdbmHash` SDBM算法
15. `djbHash` DJB算法
16. `dekHash` DEK算法
17. `apHash` AP算法
18. `tianlHash` TianL Hash算法
19. `javaDefaultHash` JAVA自己带的算法
20. `mixHash` 混合hash算法，输出64位的值

# URL工具-URLUtil

## 介绍

URL（Uniform Resource Locator）中文名为统一资源定位符，有时也被俗称为网页地址。表示为互联网上的资源，如网页或者FTP地址。在Java中，也可以使用URL表示Classpath中的资源（Resource）地址。

## 方法

### 获取URL对象

- `URLUtil.url` 通过一个字符串形式的URL地址创建对象
- `URLUtil.getURL` 主要获得ClassPath下资源的URL，方便读取Classpath下的配置文件等信息。

### 其它

- `URLUtil.normalize` 标准化化URL链接。对于不带http://头的地址做简单补全。

```java
String url = "http://www.hutool.cn//aaa/bbb";
// 结果为：http://www.hutool.cn/aaa/bbb
String normalize = URLUtil.normalize(url);

url = "http://www.hutool.cn//aaa/\\bbb?a=1&b=2";
// 结果为：http://www.hutool.cn/aaa/bbb?a=1&b=2
normalize = URLUtil.normalize(url);
```

- `URLUtil.encode` 封装`URLEncoder.encode`，将需要转换的内容（ASCII码形式之外的内容），用十六进制表示法转换出来，并在之前加上%开头。

```java
String body = "366466 - 副本.jpg";
// 结果为：366466%20-%20%E5%89%AF%E6%9C%AC.jpg
String encode = URLUtil.encode(body);
```

- `URLUtil.decode` 封装`URLDecoder.decode`，将%开头的16进制表示的内容解码。
- `URLUtil.getPath` 获得path部分 URI -> http://www.aaa.bbb/search?scope=ccc&q=ddd PATH -> /search
- `URLUtil.toURI` 转URL或URL字符串为URI。

# XML工具-XmlUtil

## 由来

在日常编码中，我们接触最多的除了JSON外，就是XML格式了，一般而言，我们首先想到的是引入Dom4j包，却不知JDK已经封装有XML解析和构建工具：w3c dom。但是由于这个API操作比较繁琐，因此Hutool中提供了XmlUtil简化XML的创建、读和写的过程。

## 使用

### 读取XML

读取XML分为两个方法：

- `XmlUtil.readXML` 读取XML文件
- `XmlUtil.parseXml` 解析XML字符串为Document对象

### 写XML

- `XmlUtil.toStr` 将XML文档转换为String
- `XmlUtil.toFile` 将XML文档写入到文件

### 创建XML

- `XmlUtil.createXml` 创建XML文档, 创建的XML默认是utf8编码，修改编码的过程是在toStr和toFile方法里，既XML在转为文本的时候才定义编码。

### XML操作

通过以下工具方法，可以完成基本的节点读取操作。

- `XmlUtil.cleanInvalid` 除XML文本中的无效字符
- `XmlUtil.getElements` 根据节点名获得子节点列表
- `XmlUtil.getElement` 根据节点名获得第一个子节点
- `XmlUtil.elementText` 根据节点名获得第一个子节点
- `XmlUtil.transElements` 将NodeList转换为Element列表

### XML与对象转换

- `writeObjectAsXml` 将可序列化的对象转换为XML写入文件，已经存在的文件将被覆盖。
- `readObjectFromXml` 从XML中读取对象。

> 注意 这两个方法严重依赖JDK的`XMLEncoder`和`XMLDecoder`，生成和解析必须成对存在（遵循固定格式），普通的XML转Bean会报错。

### [Xpath操作](https://www.hutool.cn/docs/#/core/工具类/XML工具-XmlUtil?id=xpath操作)

Xpath的更多介绍请看文章：https://www.ibm.com/developerworks/cn/xml/x-javaxpathapi.html

- `createXPath` 创建XPath
- `getByXPath` 通过XPath方式读取XML节点等信息

栗子：

```xml
<?xml version="1.0" encoding="utf-8"?>

<returnsms> 
  <returnstatus>Success（成功）</returnstatus>  
  <message>ok</message>  
  <remainpoint>1490</remainpoint>  
  <taskID>885</taskID>  
  <successCounts>1</successCounts> 
</returnsms>
Document docResult=XmlUtil.readXML(xmlFile);
//结果为“ok”
Object value = XmlUtil.getByXPath("//returnsms/message", docResult, XPathConstants.STRING);
```

## 总结

XmlUtil只是w3c dom的简单工具化封装，减少操作dom的难度，如果项目对XML依赖较大，依旧推荐Dom4j框架。

# 对象工具-ObjectUtil

## 由来

在我们的日常使用中，有些方法是针对Object通用的，这些方法不区分何种对象，针对这些方法，Hutool封装为`ObjectUtil`。

## 方法

### 默认值

借助于lambada表达式，ObjectUtil可以完成判断给定的值是否为null，不为null执行特定逻辑的功能。

```java
final String dateStr = null;

// 此处判断如果dateStr为null，则调用`Instant.now()`，不为null则执行`DateUtil.parse`
Instant result1 = ObjectUtil.defaultIfNull(dateStr,
        () -> DateUtil.parse(dateStr, DatePattern.NORM_DATETIME_PATTERN).toInstant(), Instant.now());
```

### `ObjectUtil.equal`

比较两个对象是否相等，相等需满足以下条件之一：

1. obj1 == null && obj2 == null
2. obj1.equals(obj2)

```java
Object a = null;
Object b = null;

// true
ObjectUtil.equals(a, b);
```

### `ObjectUtil.length`

计算对象长度，如果是字符串调用其length方法，集合类调用其size方法，数组调用其length属性，其他可遍历对象遍历计算长度。

支持的类型包括：

- CharSequence
- Collection
- Map
- Iterator
- Enumeration
- Array

```java
int[] array = new int[]{1,2,3,4,5};

// 5
int length = ObjectUtil.length(array);

Map<String, String> map = new HashMap<>();
map.put("a", "a1");
map.put("b", "b1");
map.put("c", "c1");

// 3
length = ObjectUtil.length(map);
```

### `ObjectUtil.contains`

对象中是否包含元素。

支持的对象类型包括：

- String
- Collection
- Map
- Iterator
- Enumeration
- Array

```java
int[] array = new int[]{1,2,3,4,5};

// true
final boolean contains = ObjectUtil.contains(array, 1);
```

### 判断是否为null

- `ObjectUtil.isNull`
- `ObjectUtil.isNotNull`

> 注意：此方法不能判断对象中字段为空的情况，如果需要检查Bean对象中字段是否全空，请使用`BeanUtil.isEmpty`。

### 克隆

- `ObjectUtil.clone` 克隆对象，如果对象实现Cloneable接口，调用其clone方法，如果实现Serializable接口，执行深度克隆，否则返回`null`。

```java
class Obj extends CloneSupport<Obj> {
    public String doSomeThing() {
        return "OK";
    }
}
Obj obj = new Obj();
Obj obj2 = ObjectUtil.clone(obj);

// OK
obj2.doSomeThing();
```

- `ObjectUtil.cloneIfPossible` 返回克隆后的对象，如果克隆失败，返回原对象
- `ObjectUtil.cloneByStream` 序列化后拷贝流的方式克隆，对象必须实现Serializable接口

### 序列化和反序列化

- `serialize` 序列化，调用JDK序列化
- `deserialize` 反序列化，调用JDK

### 判断基本类型

`ObjectUtil.isBasicType` 判断是否为基本类型，包括包装类型和原始类型。

包装类型：

- Boolean
- Byte
- Character
- Double
- Float
- Integer
- Long
- Short

原始类型：

- boolean
- byte
- char
- double
- float
- int
- long
- short

```java
int a = 1;

// true
final boolean basicType = ObjectUtil.isBasicType(a);
```

# 反射工具-ReflectUtil

## 介绍

Java的反射机制，可以让语言变得更加灵活，对对象的操作也更加“动态”，因此在某些情况下，反射可以做到事半功倍的效果。Hutool针对Java的反射机制做了工具化封装，封装包括：

1. 获取构造方法
2. 获取字段
3. 获取字段值
4. 获取方法
5. 执行方法（对象方法和静态方法）

## 使用

### 获取某个类的所有方法

```java
Method[] methods = ReflectUtil.getMethods(ExamInfoDict.class);
```

### 获取某个类的指定方法

```java
Method method = ReflectUtil.getMethod(ExamInfoDict.class, "getId");
```

### 构造对象

```java
ReflectUtil.newInstance(ExamInfoDict.class);
```

### 执行方法

```java
class TestClass {
    private int a;

    public int getA() {
        return a;
    }

    public void setA(int a) {
        this.a = a;
    }
}
TestClass testClass = new TestClass();
ReflectUtil.invoke(testClass, "setA", 10);
```

# 泛型类型工具-TypeUtil

## 介绍

针对 `java.lang.reflect.Type` 的工具类封装，最主要功能包括：

1. 获取方法的参数和返回值类型（包括Type和Class）
2. 获取泛型参数类型（包括对象的泛型参数或集合元素的泛型类型）

## 方法

首先我们定义一个类：

```java
public class TestClass {
    public List<String> getList(){
        return new ArrayList<>();
    }
    
    public Integer intTest(Integer integer) {
        return 1;
    }
}
```

### `getClass`

获得Type对应的原始类

### `getParamType`

```java
Method method = ReflectUtil.getMethod(TestClass.class, "intTest", Integer.class);
Type type = TypeUtil.getParamType(method, 0);
// 结果：Integer.class
```

获取方法参数的泛型类型

### `getReturnType`

获取方法的返回值类型

```java
Method method = ReflectUtil.getMethod(TestClass.class, "getList");
Type type = TypeUtil.getReturnType(method);
// 结果：java.util.List<java.lang.String>
```

### `getTypeArgument`

获取泛型类子类中泛型的填充类型。

```java
Method method = ReflectUtil.getMethod(TestClass.class, "getList");
Type type = TypeUtil.getReturnType(method);

Type type2 = TypeUtil.getTypeArgument(type);
// 结果：String.class
```

# 分页工具-PageUtil

## 由来

分页工具类并不是数据库分页的封装，而是分页方式的转换。在我们手动分页的时候，常常使用页码+每页个数的方式，但是有些数据库需要使用开始位置和结束位置来表示。很多时候这种转换容易出错（边界问题），于是封装了PageUtil工具类。

## 使用

### transToStartEnd

将页数和每页条目数转换为开始位置和结束位置。 此方法用于不包括结束位置的分页方法。

例如：

- 页码：0，每页10 -> [0, 10]
- 页码：1，每页10 -> [10, 20]

```java
int[] startEnd1 = PageUtil.transToStartEnd(0, 10);//[0, 10]
int[] startEnd2 = PageUtil.transToStartEnd(1, 10);//[10, 20]
```

> 方法中，页码从0开始，位置从0开始

### totalPage

根据总数计算总页数

```java
int totalPage = PageUtil.totalPage(20, 3);//7
```

### 分页彩虹算法

此方法来自：https://github.com/iceroot/iceroot/blob/master/src/main/java/com/icexxx/util/IceUtil.java

在页面上显示下一页时，常常需要显示前N页和后N页，`PageUtil.rainbow`作用于此。

例如我们当前页为第5页，共有20页，只显示6个页码，显示的分页列表应为：

```
上一页 3 4 [5] 6 7 8 下一页
//参数意义分别为：当前页、总页数、每屏展示的页数
int[] rainbow = PageUtil.rainbow(5, 20, 6);
//结果：[3, 4, 5, 6, 7, 8]
```

# 剪贴板工具-ClipboardUtil

## 介绍

在Hutool群友的强烈要求下，在3.2.0+ 中新增了`ClipboardUtil`这个类用于简化操作剪贴板（当然使用场景被局限）。

## 使用

`ClipboardUtil` 封装了几个常用的静态方法:

### 通用方法

1. `getClipboard` 获取系统剪贴板
2. `set` 设置内容到剪贴板
3. `get` 获取剪贴板内容

### 针对文本

1. `setStr` 设置文本到剪贴板
2. `getStr` 从剪贴板获取文本

### 针对Image对象（图片）

1. `setImage` 设置图片到剪贴板
2. `getImage` 从剪贴板获取图片

# 类工具-ClassUtil

## 类处理工具 `ClassUtil`

这个工具主要是封装了一些反射的方法，使调用更加方便。而这个类中最有用的方法是`scanPackage`方法，这个方法会扫描classpath下所有类，这个在Spring中是特性之一，主要为[Hulu](https://github.com/looly/hulu)框架中类扫描的一个基础。下面介绍下这个类中的方法。

### `getShortClassName`

获取完整类名的短格式如：`cn.hutool.core.util.StrUtil` -> `c.h.c.u.StrUtil`

### `isAllAssignableFrom`

比较判断types1和types2两组类，如果types1中所有的类都与types2对应位置的类相同，或者是其父类或接口，则返回true

### `isPrimitiveWrapper`

是否为包装类型

### `isBasicType`

是否为基本类型（包括包装类和原始类）

### `getPackage`

获得给定类所在包的名称，例如： `cn.hutool.util.ClassUtil` -> `cn.hutool.util`

### `scanPackage`方法

此方法唯一的参数是包的名称，返回结果为此包以及子包下所有的类。方法使用很简单，但是过程复杂一些，包扫面首先会调用 `getClassPaths`方法获得ClassPath，然后扫描ClassPath，如果是目录，扫描目录下的类文件，或者jar文件。如果是jar包，则直接从jar包中获取类名。这个方法的作用显而易见，就是要找出所有的类，在Spring中用于依赖注入，我在[Hulu](https://github.com/looly/hulu)中则用于找到Action类。当然，你也可以传一个`ClassFilter`对象，用于过滤不需要的类。

### `getClassPaths`方法

此方法是获得当前线程的ClassPath，核心是`Thread.currentThread().getContextClassLoader().getResources`的调用。

### `getJavaClassPaths`方法

此方法用于获得java的系统变量定义的ClassPath。

### `getClassLoader`和`getContextClassLoader`方法

后者只是获得当前线程的ClassLoader，前者在获取失败的时候获取`ClassUtil`这个类的ClassLoader。

### `getDefaultValue`

获取指定类型分的默认值，默认值规则为：

1. 如果为原始类型，返回0
2. 非原始类型返回null

### 其它

更多详细的方法描述见：

https://apidoc.gitee.com/loolly/hutool/cn/hutool/core/util/ClassUtil.html

# 类加载工具-ClassLoaderUtil

## 介绍

提供ClassLoader相关的工具类，例如类加载（Class.forName包装）等

## 方法

### 获取ClassLoader

#### [`getContextClassLoader`](https://www.hutool.cn/docs/#/core/工具类/类加载工具-ClassLoaderUtil?id=getcontextclassloader)

获取当前线程的ClassLoader，本质上调用`Thread.currentThread().getContextClassLoader()`

#### [`getClassLoader`](https://www.hutool.cn/docs/#/core/工具类/类加载工具-ClassLoaderUtil?id=getclassloader)

按照以下顺序规则查找获取ClassLoader：

1. 获取当前线程的ContextClassLoader
2. 获取ClassLoaderUtil类对应的ClassLoader
3. 获取系统ClassLoader（ClassLoader.getSystemClassLoader()）

### 加载Class

#### [`loadClass`](https://www.hutool.cn/docs/#/core/工具类/类加载工具-ClassLoaderUtil?id=loadclass)

加载类，通过传入类的字符串，返回其对应的类名，使用默认ClassLoader并初始化类（调用static模块内容和可选的初始化static属性）

扩展`Class.forName`方法，支持以下几类类名的加载：

1. 原始类型，例如：int
2. 数组类型，例如：int[]、Long[]、String[]
3. 内部类，例如：java.lang.Thread.State会被转为java.lang.Thread$State加载

同时提供`loadPrimitiveClass`方法用于快速加载原始类型的类。包括原始类型、原始类型数组和void

#### [`isPresent`](https://www.hutool.cn/docs/#/core/工具类/类加载工具-ClassLoaderUtil?id=ispresent)

指定类是否被提供，通过调用`loadClass`方法尝试加载指定类名的类，如果加载失败返回false。

加载失败的原因可能是此类不存在或其关联引用类不存在。

# 枚举工具-EnumUtil

## 介绍

枚举（enum）算一种“语法糖”，是指一个经过排序的、被打包成一个单一实体的项列表。一个枚举的实例可以使用枚举项列表中任意单一项的值。枚举在各个语言当中都有着广泛的应用，通常用来表示诸如颜色、方式、类别、状态等等数目有限、形式离散、表达又极为明确的量。Java从JDK5开始，引入了对枚举的支持。

`EnumUtil` 用于对未知枚举类型进行操作。

## 方法

首先我们定义一个枚举对象：

```java
//定义枚举
public enum TestEnum{
    TEST1("type1"), TEST2("type2"), TEST3("type3");
    
    private TestEnum(String type) {
        this.type = type;
    }
    
    private String type;
    
    public String getType() {
        return this.type;
    }
}
```

### `getNames`

获取枚举类中所有枚举对象的name列表。栗子：

```java
//定义枚举
public enum TestEnum {
    TEST1, TEST2, TEST3;
}
List<String> names = EnumUtil.getNames(TestEnum.class);
//结果：[TEST1, TEST2, TEST3]
```

### `getFieldValues`

获得枚举类中各枚举对象下指定字段的值。栗子：

```java
List<Object> types = EnumUtil.getFieldValues(TestEnum.class, "type");
//结果：[type1, type2, type3]
```

### `getEnumMap`

获取枚举字符串值和枚举对象的Map对应，使用LinkedHashMap保证有序，结果中键为枚举名，值为枚举对象。栗子：

```java
Map<String,TestEnum> enumMap = EnumUtil.getEnumMap(TestEnum.class);
enumMap.get("TEST1") // 结果为：TestEnum.TEST1
```

### `getNameFieldMap`

获得枚举名对应指定字段值的Map，键为枚举名，值为字段值。栗子：

```java
Map<String, Object> enumMap = EnumUtil.getNameFieldMap(TestEnum.class, "type");
enumMap.get("TEST1") // 结果为：type1
```

# 命令行工具-RuntimeUtil

## 介绍

在Java世界中，如果想与其它语言打交道，处理调用接口，或者JNI，就是通过本地命令方式调用了。Hutool封装了JDK的Process类，用于执行命令行命令（在Windows下是cmd，在Linux下是shell命令）。

## 方法

### 基础方法

1. `exec` 执行命令行命令，返回Process对象，Process可以读取执行命令后的返回内容的流

### 快捷方法

1. `execForStr` 执行系统命令，返回字符串
2. `execForLines` 执行系统命令，返回行列表

## 使用

```java
String str = RuntimeUtil.execForStr("ipconfig");
```

执行这个命令后，在Windows下可以获取网卡信息。

# 数字工具-NumberUtil

## 由来

数字工具针对数学运算做工具性封装

## 使用

### 加减乘除

- `NumberUtil.add` 针对数字类型做加法
- `NumberUtil.sub` 针对数字类型做减法
- `NumberUtil.mul` 针对数字类型做乘法
- `NumberUtil.div` 针对数字类型做除法，并提供重载方法用于规定除不尽的情况下保留小数位数和舍弃方式。

以上四种运算都会将double转为BigDecimal后计算，解决float和double类型无法进行精确计算的问题。这些方法常用于商业计算。

### 保留小数

保留小数的方法主要有两种：

- `NumberUtil.round` 方法主要封装BigDecimal中的方法来保留小数，返回BigDecimal，这个方法更加灵活，可以选择四舍五入或者全部舍弃等模式。

```java
double te1=123456.123456;
double te2=123456.128456;
Console.log(round(te1,4));//结果:123456.1235
Console.log(round(te2,4));//结果:123456.1285
```

- `NumberUtil.roundStr` 方法主要封装`String.format`方法,舍弃方式采用四舍五入。

```java
double te1=123456.123456;
double te2=123456.128456;
Console.log(roundStr(te1,2));//结果:123456.12
Console.log(roundStr(te2,2));//结果:123456.13
```

### decimalFormat

针对 `DecimalFormat.format`进行简单封装。按照固定格式对double或long类型的数字做格式化操作。

```java
long c=299792458;//光速
String format = NumberUtil.decimalFormat(",###", c);//299,792,458
```

格式中主要以 # 和 0 两种占位符号来指定数字长度。0 表示如果位数不足则以 0 填充，# 表示只要有可能就把数字拉上这个位置。

- 0 -> 取一位整数
- 0.00 -> 取一位整数和两位小数
- 00.000 -> 取两位整数和三位小数
- \# -> 取所有整数部分
- \#.##% -> 以百分比方式计数，并取两位小数
- \#.#####E0 -> 显示为科学计数法，并取五位小数
- ,### -> 每三位以逗号进行分隔，例如：299,792,458
- 光速大小为每秒,###米 -> 将格式嵌入文本

关于格式的更多说明，请参阅：[Java DecimalFormat的主要功能及使用方法](http://blog.csdn.net/evangel_z/article/details/7624503)

### 是否为数字

- `NumberUtil.isNumber` 是否为数字
- `NumberUtil.isInteger` 是否为整数
- `NumberUtil.isDouble` 是否为浮点数
- `NumberUtil.isPrimes` 是否为质数

### 随机数

- `NumberUtil.generateRandomNumber` 生成不重复随机数 根据给定的最小数字和最大数字，以及随机数的个数，产生指定的不重复的数组。
- `NumberUtil.generateBySet` 生成不重复随机数 根据给定的最小数字和最大数字，以及随机数的个数，产生指定的不重复的数组。

### 整数列表

`NumberUtil.range` 方法根据范围和步进，生成一个有序整数列表。 `NumberUtil.appendRange` 将给定范围内的整数添加到已有集合中

### 其它

- `NumberUtil.factorial` 阶乘
- `NumberUtil.sqrt` 平方根
- `NumberUtil.divisor` 最大公约数
- `NumberUtil.multiple` 最小公倍数
- `NumberUtil.getBinaryStr` 获得数字对应的二进制字符串
- `NumberUtil.binaryToInt` 二进制转int
- `NumberUtil.binaryToLong` 二进制转long
- `NumberUtil.compare` 比较两个值的大小
- `NumberUtil.toStr` 数字转字符串，自动并去除尾小数点儿后多余的0

# 数组工具-ArrayUtil

## 介绍

数组工具中的方法在2.x版本中都在CollectionUtil中存在，3.x之后版本（包括4.x版本）中拆分出来作为ArrayUtil。数组工具类主要针对原始类型数组和泛型数组相关方案进行封装。

数组工具类主要是解决对象数组（包括包装类型数组）和原始类型数组使用方法不统一的问题。

## 方法

### 判空

数组的判空类似于字符串的判空，标准是`null`或者数组长度为0，ArrayUtil中封装了针对原始类型和泛型数组的判空和判非空：

1. 判断空

   ```java
   int[] a = {};
   int[] b = null;
   ArrayUtil.isEmpty(a);
   ArrayUtil.isEmpty(b);
   ```

2. 判断非空

   ```java
   int[] a = {1,2};
   ArrayUtil.isNotEmpty(a);
   ```

### 新建泛型数组

`Array.newInstance`并不支持泛型返回值，在此封装此方法使之支持泛型返回值。

```java
String[] newArray = ArrayUtil.newArray(String.class, 3);
```

### 调整大小

使用 `ArrayUtil.resize`方法生成一个新的重新设置大小的数组。

### 合并数组

`ArrayUtil.addAll`方法采用可变参数方式，将多个泛型数组合并为一个数组。

### 克隆

数组本身支持clone方法，因此确定为某种类型数组时调用`ArrayUtil.clone(T[])`,不确定类型的使用`ArrayUtil.clone(T)`，两种重载方法在实现上有所不同，但是在使用中并不能感知出差别。

1. 泛型数组调用原生克隆

   ```java
   Integer[] b = {1,2,3};
   Integer[] cloneB = ArrayUtil.clone(b);
   Assert.assertArrayEquals(b, cloneB);
   ```

2. 非泛型数组（原始类型数组）调用第二种重载方法

   ```java
   int[] a = {1,2,3};
   int[] clone = ArrayUtil.clone(a);
   Assert.assertArrayEquals(a, clone);
   ```

### 有序列表生成

`ArrayUtil.range`方法有三个重载，这三个重载配合可以实现支持步进的有序数组或者步进为1的有序数组。这种列表生成器在Python中做为语法糖存在。

### 拆分数组

`ArrayUtil.split`方法用于拆分一个byte数组，将byte数组平均分成几等份，常用于消息拆分。

### 过滤

`ArrayUtil.filter`方法用于过滤已有数组元素，只针对泛型数组操作，原始类型数组并未提供。 方法中`Filter`接口用于返回boolean值决定是否保留。

过滤数组，只保留偶数

```java
Integer[] a = {1,2,3,4,5,6};
// [2,4,6]
Integer[] filter = ArrayUtil.filter(a, (Editor<Integer>) t -> (t % 2 == 0) ? t : null);
```

### 编辑

对已有数组编辑，获得编辑后的值。

```java
Integer[] a = {1, 2, 3, 4, 5, 6};
// [1, 20, 3, 40, 5, 60]
Integer[] filter = ArrayUtil.filter(a, (Editor<Integer>) t -> (t % 2 == 0) ? t * 10 : t);
```

### zip

`ArrayUtil.zip`方法传入两个数组，第一个数组为key，第二个数组对应位置为value，此方法在Python中为zip()函数。

```java
String[] keys = {"a", "b", "c"};
Integer[] values = {1,2,3};
Map<String, Integer> map = ArrayUtil.zip(keys, values, true);

//{a=1, b=2, c=3}
```

### 是否包含元素

`ArrayUtil.contains`方法只针对泛型数组，检测指定元素是否在数组中。

### 包装和拆包

在原始类型元素和包装类型中，Java实现了自动包装和拆包，但是相应的数组无法实现，于是便是用`ArrayUtil.wrap`和`ArrayUtil.unwrap`对原始类型数组和包装类型数组进行转换。

### 判断对象是否为数组

`ArrayUtil.isArray`方法封装了`obj.getClass().isArray()`。

### 转为字符串

1. `ArrayUtil.toString` 通常原始类型的数组输出为字符串时无法正常显示，于是封装此方法可以完美兼容原始类型数组和包装类型数组的转为字符串操作。
2. `ArrayUtil.join` 方法使用间隔符将一个数组转为字符串，比如[1,2,3,4]这个数组转为字符串，间隔符使用“-”的话，结果为 1-2-3-4，join方法同样支持泛型数组和原始类型数组。

### toArray

`ArrayUtil.toArray`方法针对ByteBuffer转数组提供便利。

# 随机工具-RandomUtil

## 说明

`RandomUtil`主要针对JDK中`Random`对象做封装，严格来说，Java产生的随机数都是伪随机数，因此Hutool封装后产生的随机结果也是伪随机结果。不过这种随机结果对于大多数情况已经够用。

## 使用

- `RandomUtil.randomInt` 获得指定范围内的随机数

例如我们想产生一个[10, 100)的随机数，则：

```java
int c = RandomUtil.randomInt(10, 100);
```

- `RandomUtil.randomBytes` 随机bytes，一般用于密码或者salt生成

```java
byte[] c = RandomUtil.randomBytes(10);
```

- `RandomUtil.randomEle` 随机获得列表中的元素
- `RandomUtil.randomEleSet` 随机获得列表中的一定量的不重复元素，返回Set

```java
Set<Integer> set = RandomUtil.randomEleSet(CollUtil.newArrayList(1, 2, 3, 4, 5, 6), 2);
```

- `RandomUtil.randomString` 获得一个随机的字符串（只包含数字和字符）
- `RandomUtil.randomNumbers` 获得一个只包含数字的字符串
- `RandomUtil.weightRandom` 权重随机生成器，传入带权重的对象，然后根据权重随机获取对象

# 唯一ID工具-IdUtil

## 介绍

在分布式环境中，唯一ID生成应用十分广泛，生成方法也多种多样，Hutool针对一些常用生成策略做了简单封装。

唯一ID生成器的工具类，涵盖了：

- UUID
- ObjectId（MongoDB）
- Snowflake（Twitter）

## 使用

### UUID

UUID全称通用唯一识别码（universally unique identifier），JDK通过`java.util.UUID`提供了 Leach-Salz 变体的封装。在Hutool中，生成一个UUID字符串方法如下：

```java
//生成的UUID是带-的字符串，类似于：a5c8a5e8-df2b-4706-bea4-08d0939410e3
String uuid = IdUtil.randomUUID();

//生成的是不带-的字符串，类似于：b17f24ff026d40949c85a24f4f375d42
String simpleUUID = IdUtil.simpleUUID();
```

> 说明 Hutool重写`java.util.UUID`的逻辑，对应类为`cn.hutool.core.lang.UUID`，使生成不带-的UUID字符串不再需要做字符替换，性能提升一倍左右。

### ObjectId

ObjectId是MongoDB数据库的一种唯一ID生成策略，是UUID version1的变种，详细介绍可见：[服务化框架－分布式Unique ID的生成方法一览](http://calvin1978.blogcn.com/articles/uuid.html)。

Hutool针对此封装了`cn.hutool.core.lang.ObjectId`，快捷创建方法为：

```java
//生成类似：5b9e306a4df4f8c54a39fb0c
String id = ObjectId.next();

//方法2：从Hutool-4.1.14开始提供
String id2 = IdUtil.objectId();
```

### Snowflake

分布式系统中，有一些需要使用全局唯一ID的场景，有些时候我们希望能使用一种简单一些的ID，并且希望ID能够按照时间有序生成。Twitter的Snowflake 算法就是这种生成器。

使用方法如下：

```java
//参数1为终端ID
//参数2为数据中心ID
Snowflake snowflake = IdUtil.getSnowflake(1, 1);
long id = snowflake.nextId();

//简单使用
long id = IdUtil.getSnowflakeNextId();
String id = snowflake.getSnowflakeNextIdStr();

```

> 注意 `IdUtil.createSnowflake`每次调用会创建一个新的Snowflake对象，不同的Snowflake对象创建的ID可能会有重复，因此请自行维护此对象为单例，或者使用`IdUtil.getSnowflake`使用全局单例对象。



# 压缩工具-ZipUtil

## 由来

在Java中，对文件、文件夹打包，压缩是一件比较繁琐的事情，我们常常引入[Zip4j](https://github.com/srikanth-lingala/zip4j)进行此类操作。但是很多时候，JDK中的zip包就可满足我们大部分需求。ZipUtil就是针对`java.util.zip`做工具化封装，使压缩解压操作可以一个方法搞定，并且自动处理文件和目录的问题，不再需要用户判断，压缩后的文件也会自动创建文件，自动创建父目录，大大简化的压缩解压的复杂度。

## 方法

### Zip

1. 压缩

`ZipUtil.zip` 方法提供一系列的重载方法，满足不同需求的压缩需求，这包括：

- 打包到当前目录（可以打包文件，也可以打包文件夹，根据路径自动判断）

```java
//将aaa目录下的所有文件目录打包到d:/aaa.zip
ZipUtil.zip("d:/aaa");
```

- 指定打包后保存的目的地，自动判断目标是文件还是文件夹

```java
//将aaa目录下的所有文件目录打包到d:/bbb/目录下的aaa.zip文件中
// 此处第二个参数必须为文件，不能为目录
ZipUtil.zip("d:/aaa", "d:/bbb/aaa.zip");

//将aaa目录下的所有文件目录打包到d:/bbb/目录下的ccc.zip文件中
ZipUtil.zip("d:/aaa", "d:/bbb/ccc.zip");
```

- 可选是否包含被打包的目录。比如我们打包一个照片的目录，打开这个压缩包有可能是带目录的，也有可能是打开压缩包直接看到的是文件。zip方法增加一个boolean参数可选这两种模式，以应对众多需求。

```java
//将aaa目录以及其目录下的所有文件目录打包到d:/bbb/目录下的ccc.zip文件中
ZipUtil.zip("d:/aaa", "d:/bbb/ccc.zip", true);
```

- 多文件或目录压缩。可以选择多个文件或目录一起打成zip包。

```java
ZipUtil.zip(FileUtil.file("d:/bbb/ccc.zip"), false, 
    FileUtil.file("d:/test1/file1.txt"),
    FileUtil.file("d:/test1/file2.txt"),
    FileUtil.file("d:/test2/file1.txt"),
    FileUtil.file("d:/test2/file2.txt")
);
```

1. 解压

`ZipUtil.unzip` 解压。同样提供几个重载，满足不同需求。

```java
//将test.zip解压到e:\\aaa目录下，返回解压到的目录
File unzip = ZipUtil.unzip("E:\\aaa\\test.zip", "e:\\aaa");
```

### Gzip

Gzip是网页传输中广泛使用的压缩方式，Hutool同样提供其工具方法简化其过程。

`ZipUtil.gzip` 压缩，可压缩字符串，也可压缩文件 `ZipUtil.unGzip` 解压Gzip文件

### Zlib

`ZipUtil.zlib` 压缩，可压缩字符串，也可压缩文件 `ZipUtil.unZlib` 解压zlib文件

> 注意 ZipUtil默认情况下使用系统编码，也就是说：
>
> 1. 如果你在命令行下运行，则调用系统编码（一般Windows下为GBK、Linux下为UTF-8）
> 2. 如果你在IDE（如Eclipse）下运行代码，则读取的是当前项目的编码（详细请查阅IDE设置，我的项目默认都是UTF-8编码，因此解压和压缩都是用这个编码）

### 常见问题

1. 解压时报`java.lang.IllegalArgumentException:MALFORMED`错误

基本是因为编码问题，Hutool默认使用UTF-8编码，自定义为其他编码即可（一般为GBK）。

```java
//将test.zip解压到e:\\aaa目录下，返回解压到的目录
File unzip = ZipUtil.unzip("E:\\aaa\\test.zip", "e:\\aaa", CharsetUtil.CHARSET_GBK);
```

1. 压缩并添加密码

Hutool或JDK的Zip工具并不支持添加密码，可以考虑使用[Zip4j](https://github.com/srikanth-lingala/zip4j)完成，以下代码来自Zip4j官网。

```java
ZipParameters zipParameters = new ZipParameters();
zipParameters.setEncryptFiles(true);
zipParameters.setEncryptionMethod(EncryptionMethod.AES);
// Below line is optional. AES 256 is used by default. You can override it to use AES 128. AES 192 is supported only for extracting.
zipParameters.setAesKeyStrength(AesKeyStrength.KEY_STRENGTH_256); 

List<File> filesToAdd = Arrays.asList(
    new File("somefile"), 
    new File("someotherfile")
);

ZipFile zipFile = new ZipFile("filename.zip", "password".toCharArray());
zipFile.addFiles(filesToAdd, zipParameters);
```

# 引用工具-ReferenceUtil

## 介绍

引用工具类，主要针对Reference 工具化封装

主要封装包括：

1. SoftReference 软引用，在GC报告内存不足时会被GC回收
2. WeakReference 弱引用，在GC时发现弱引用会回收其对象
3. PhantomReference 虚引用，在GC时发现虚引用对象，会将PhantomReference插入ReferenceQueue。此时对象未被真正回收，要等到ReferenceQueue被真正处理后才会被回收。

## 方法

### `create`

根据类型枚举创建引用。

# 正则工具-ReUtil

## 由来

在文本处理中，正则表达式几乎是全能的，但是Java的正则表达式有时候处理一些事情还是有些繁琐，所以我封装了部分常用功能。就比如说我要匹配一段文本中的某些部分，我们需要这样做：

```java
String content = "ZZZaaabbbccc中文1234";
Pattern pattern = Pattern.compile(regex, Pattern.DOTALL);
Matcher matcher = pattern.matcher(content);
if (matcher.find()) {
    String result= matcher.group();
}
```

其中牵涉到多个对象，想用的时候真心记不住。好吧，既然功能如此常用，我就封装一下：

```java
/**
* 获得匹配的字符串
* 
* @param pattern 编译后的正则模式
* @param content 被匹配的内容
* @param groupIndex 匹配正则的分组序号
* @return 匹配后得到的字符串，未匹配返回null
*/
public static String get(Pattern pattern, String content, int groupIndex) {
    Matcher matcher = pattern.matcher(content);
    if (matcher.find()) {
        return matcher.group(groupIndex);
    }
    return null;
}

/**
* 获得匹配的字符串
* 
* @param regex 匹配的正则
* @param content 被匹配的内容
* @param groupIndex 匹配正则的分组序号
* @return 匹配后得到的字符串，未匹配返回null
*/
public static String get(String regex, String content, int groupIndex) {
    Pattern pattern = Pattern.compile(regex, Pattern.DOTALL);
    return get(pattern, content, groupIndex);
}
```

## 使用

### ReUtil.extractMulti

抽取多个分组然后把它们拼接起来

```java
String content = "ZZZaaabbbccc中文1234";
String resultExtractMulti = ReUtil.extractMulti("(\\w)aa(\\w)", content, "$1-$2");
Assert.assertEquals("Z-a", resultExtractMulti);
```

### ReUtil.delFirst

删除第一个匹配到的内容

```java
String content = "ZZZaaabbbccc中文1234";
String resultDelFirst = ReUtil.delFirst("(\\w)aa(\\w)", content);
Assert.assertEquals("ZZbbbccc中文1234", resultDelFirst);
```

### ReUtil.findAll

查找所有匹配文本

```java
String content = "ZZZaaabbbccc中文1234";
List<String> resultFindAll = ReUtil.findAll("\\w{2}", content, 0, new ArrayList<String>());
// 结果：["ZZ", "Za", "aa", "bb", "bc", "cc", "12", "34"]
```

### ReUtil.getFirstNumber

找到匹配的第一个数字

```java
Integer resultGetFirstNumber = ReUtil.getFirstNumber(content);
// 结果：1234
```

### ReUtil.isMatch

给定字符串是否匹配给定正则

```java
String content = "ZZZaaabbbccc中文1234";
boolean isMatch = ReUtil.isMatch("\\w+[\u4E00-\u9FFF]+\\d+", content);
Assert.assertTrue(isMatch);
```

### ReUtil.replaceAll

通过正则查找到字符串，然后把匹配到的字符串加入到replacementTemplate中，$1表示分组1的字符串

```java
String content = "ZZZaaabbbccc中文1234";
//此处把1234替换为 ->1234<-
String replaceAll = ReUtil.replaceAll(content, "(\\d+)", "->$1<-");
Assert.assertEquals("ZZZaaabbbccc中文->1234<-", replaceAll);
```

### ReUtil.escape

转义给定字符串，为正则相关的特殊符号转义

```java
String escape = ReUtil.escape("我有个$符号{}");
// 结果：我有个\\$符号\\{\\}
```

# 身份证工具-IdcardUtil

## 由来

在日常开发中，我们对身份证的验证主要是正则方式（位数，数字范围等），但是中国身份证，尤其18位身份证每一位都有严格规定，并且最后一位为校验位。而我们在实际应用中，针对身份证的验证理应严格至此。于是`IdcardUtil`应运而生。

> `IdcardUtil`从3.0.4版本起加入Hutool工具家族，请升级至此版本以上可使用。

## 介绍

`IdcardUtil`现在支持大陆15位、18位身份证，港澳台10位身份证。

工具中主要的方法包括：

1. `isValidCard` 验证身份证是否合法
2. `convert15To18` 身份证15位转18位
3. `getBirthByIdCard` 获取生日
4. `getAgeByIdCard` 获取年龄
5. `getYearByIdCard` 获取生日年
6. `getMonthByIdCard` 获取生日月
7. `getDayByIdCard` 获取生日天
8. `getGenderByIdCard` 获取性别
9. `getProvinceByIdCard` 获取省份

## 使用

```java
String ID_18 = "321083197812162119";
String ID_15 = "150102880730303";

//是否有效
boolean valid = IdcardUtil.isValidCard(ID_18);
boolean valid15 = IdcardUtil.isValidCard(ID_15);

//转换
String convert15To18 = IdcardUtil.convert15To18(ID_15);
Assert.assertEquals(convert15To18, "150102198807303035");

//年龄
DateTime date = DateUtil.parse("2017-04-10");
        
int age = IdcardUtil.getAgeByIdCard(ID_18, date);
Assert.assertEquals(age, 38);

int age2 = IdcardUtil.getAgeByIdCard(ID_15, date);
Assert.assertEquals(age2, 28);

//生日
String birth = IdcardUtil.getBirthByIdCard(ID_18);
Assert.assertEquals(birth, "19781216");

String birth2 = IdcardUtil.getBirthByIdCard(ID_15);
Assert.assertEquals(birth2, "19880730");

//省份
String province = IdcardUtil.getProvinceByIdCard(ID_18);
Assert.assertEquals(province, "江苏");

String province2 = IdcardUtil.getProvinceByIdCard(ID_15);
Assert.assertEquals(province2, "内蒙古");
```

> **声明** 以上两个身份证号码为随机编造的，如有雷同，纯属巧合。

# 信息脱敏工具-DesensitizedUtil

## 介绍

在数据处理或清洗中，可能涉及到很多隐私信息的脱敏工作，因此Hutool针对常用的信息封装了一些脱敏方法。

现阶段支持的脱敏数据类型包括：

1. 用户id
2. 中文姓名
3. 身份证号
4. 座机号
5. 手机号
6. 地址
7. 电子邮件
8. 密码
9. 中国大陆车牌，包含普通车辆、新能源车辆
10. 银行卡

整体来说，所谓脱敏就是隐藏掉信息中的一部分关键信息，用`*`代替，自定义隐藏可以使用`StrUtil.hide`方法完成。

## 使用

我们以身份证号码为例：

```java
// 5***************1X
DesensitizedUtil.idCardNum("51343620000320711X", 1, 2);
```

对于约定俗成的脱敏，我们可以不用指定隐藏位数，比如手机号：

```java
// 180****1999
DesensitizedUtil.mobilePhone("18049531999");
```

当然还有一些简单粗暴的脱敏，比如密码，只保留了位数信息：

```java
// **********
DesensitizedUtil.password("1234567890");
```

# 社会信用代码工具-CreditCodeUtil

## 介绍

法人和其他组织统一社会信用代码制度，相当于让法人和其他组织拥有了一个全国统一的“身份证号”。

规则如下：

1. 第一部分：登记管理部门代码1位 (数字或大写英文字母)
2. 第二部分：机构类别代码1位 (数字或大写英文字母)
3. 第三部分：登记管理机关行政区划码6位 (数字)
4. 第四部分：主体标识码（组织机构代码）9位 (数字或大写英文字母)
5. 第五部分：校验码1位 (数字或大写英文字母)

此工具主要提供校验和随机生成。

## 使用

### 校验

```java
String testCreditCode = "91310110666007217T";
// true
CreditCodeUtil.isCreditCode(testCreditCode);
```

### 随机社会信用代码

```java
final String s = CreditCodeUtil.randomCreditCode();
```

# SPI加载工具-ServiceLoaderUtil

## 介绍

SPI（Service Provider Interface），是一种服务发现机制。它通过在ClassPath路径下的META-INF/services文件夹查找文件，自动加载文件里所定义的类。

更多介绍见：https://www.jianshu.com/p/3a3edbcd8f24

## 使用

定义一个接口：

```java
package cn.hutool.test.spi;

public interface SPIService {
    void execute();
}
```

有两个实现:

```java
package cn.hutool.test.spi;

public class SpiImpl1 implements SPIService{
    public void execute() {
        Console.log("SpiImpl1.execute()");
    }
}
package cn.hutool.test.spi;

public class SpiImpl2 implements SPIService{
    public void execute() {
        Console.log("SpiImpl2.execute()");
    }
}
```

然后在classpath的`META-INF/services`下创建一个文件，叫`cn.hutool.test.spi.SPIService`，内容为：

```java
cn.hutool.test.spi.SpiImpl1
cn.hutool.test.spi.SpiImpl2
```

加载第一个可用服务，如果用户定义了多个接口实现类，只获取第一个不报错的服务。这个方法多用于同一接口多种实现的自动甄别加载， 通过判断jar是否引入，自动找到实现类。

```java
SPIService service = ServiceLoaderUtil.loadFirstAvailable(SPIService.class);
service.execute();
```

# HashMap扩展-Dict

## 由来

如果你了解Python，你一定知道Python有dict这一数据结构，也是一种KV（Key-Value）结构的数据结构，类似于Java中的Map，但是提供了更加灵活多样的使用。Hutool中的Dict对象旨在实现更加灵活的KV结构，针对强类型，提供丰富的getXXX操作，将HashMap扩展为无类型区别的数据结构。

## 介绍

Dict继承HashMap，其key为String类型，value为Object类型，通过实现`BasicTypeGetter`接口提供针对不同类型的get方法，同时提供针对Bean的转换方法，大大提高Map的灵活性。

> Hutool-db中Entity是Dict子类，做为数据的媒介。

## 使用

### 创建

```java
Dict dict = Dict.create()
    .set("key1", 1)//int
    .set("key2", 1000L)//long
    .set("key3", DateTime.now());//Date
```

通过链式构造，创建Dict对象，同时可以按照Map的方式使用。

### 获取指定类型的值

```java
Long v2 = dict.getLong("key2");//1000
```

# 单例工具-Singleton

## 为什么会有这个类

平常我们使用单例不外乎两种方式：

1. 在对象里加个静态方法getInstance()来获取。此方式可以参考 [【转】线程安全的单例模式](http://my.oschina.net/looly/blog/152865) 这篇博客，可分为饿汉和饱汉模式。
2. 通过Spring这类容器统一管理对象，用的时候去对象池中拿。Spring也可以通过配置决定懒汉或者饿汉模式

说实话我更倾向于第二种，但是Spring更注重的是注入，而不是拿，于是我想做Singleton这个类，维护一个单例的池，用这个单例对象的时候直接来拿就可以，这里我用的懒汉模式。我只是想把单例的管理方式换一种思路，我希望管理单例的是一个容器工具，而不是一个大大的框架，这样能大大减少单例使用的复杂性。

## 使用

```java
/**
 * 单例样例
 * @author loolly
 *
 */
public class SingletonDemo {

    /**
     * 动物接口
     * @author loolly
     *
     */
    public static interface Animal{
        public void say();
    }

    /**
     * 狗实现
     * @author loolly
     *
     */
    public static class Dog implements Animal{
        @Override
        public void say() {
            System.out.println("汪汪");
        }
    }

    /**
     * 猫实现
     * @author loolly
     *
     */
    public static class Cat implements Animal{
        @Override
        public void say() {
            System.out.println("喵喵");
        }
    }

    public static void main(String[] args) {
        Animal dog = Singleton.get(Dog.class);
        Animal cat = Singleton.get(Cat.class);

        //单例对象每次取出为同一个对象，除非调用Singleton.destroy()或者remove方法
        System.out.println(dog == Singleton.get(Dog.class));        //True
        System.out.println(cat == Singleton.get(Cat.class));            //True

        dog.say();        //汪汪
        cat.say();        //喵喵
    }
}
```

## 总结

大家如果有兴趣可以看下这个类，实现非常简单，一个HashMap用于做为单例对象池，通过newInstance()实例化对象（不支持带参数的构造方法），无论取还是创建对象都是线程安全的（在单例对象数量非常庞大且单例对象实例化非常耗时时可能会出现瓶颈），考虑到在get的时候使双重检查锁，但是并不是线程安全的，故直接加了`synchronized`做为修饰符，欢迎在此给出建议。

# 断言-Assert

## 由来

Java中有`assert`关键字，但是存在许多问题：

1. assert关键字需要在运行时候显式开启才能生效，否则你的断言就没有任何意义。
2. 用assert代替if是陷阱之二。assert的判断和if语句差不多，但两者的作用有着本质的区别：assert关键字本意上是为测试调试程序时使用的，但如果不小心用assert来控制了程序的业务流程，那在测试调试结束后去掉assert关键字就意味着修改了程序的正常的逻辑。
3. assert断言失败将面临程序的退出。

因此，并不建议使用此关键字。相应的，在Hutool中封装了更加友好的Assert类，用于断言判定。

## 介绍

Assert类更像是Junit中的Assert类，也很像Guava中的Preconditions，主要作用是在方法或者任何地方对参数的有效性做校验。当不满足断言条件时，会抛出IllegalArgumentException或IllegalStateException异常。

## 使用

```java
String a = null;
cn.hutool.lang.Assert.isNull(a);
```

## 更多方法

- isTrue 是否True
- isNull 是否是null值，不为null抛出异常
- notNull 是否非null值
- notEmpty 是否非空
- notBlank 是否非空白符
- notContain 是否为子串
- notEmpty 是否非空
- noNullElements 数组中是否包含null元素
- isInstanceOf 是否类实例
- isAssignable 是子类和父类关系
- state 会抛出IllegalStateException异常

# 二进码十进数-BCD

## 介绍

BCD码（Binary-Coded Decimal‎）亦称二进码十进数或二-十进制代码，BCD码这种编码形式利用了四个位元来储存一个十进制的数码，使二进制和十进制之间的转换得以快捷的进行。

这种编码技巧最常用于会计系统的设计里，因为会计制度经常需要对很长的数字串作准确的计算。相对于一般的浮点式记数法，采用BCD码，既可保存数值的精确度，又可免却使电脑作浮点运算时所耗费的时间。此外，对于其他需要高精确度的计算，BCD编码亦很常用。

BCD码是四位二进制码, 也就是将十进制的数字转化为二进制, 但是和普通的转化有一点不同, 每一个十进制的数字0-9都对应着一个四位的二进制码,对应关系如下: 十进制0 对应 二进制0000 ;十进制1 对应二进制0001 ....... 9 1001 接下来的10就有两个上述的码来表示 10 表示为00010000 也就是BCD码是遇见1001就产生进位,不象普通的二进制码,到1111才产生进位10000

## 方法

```java
String strForTest = "123456ABCDEF";
        
//转BCD
byte[] bcd = BCD.strToBcd(strForTest);
//解码BCD
String str = BCD.bcdToStr(bcd);
Assert.assertEquals(strForTest, str);
```



# 控制台打印封装-Console

## 由来

编码中我们常常需要调试输出一些信息，除了打印日志，最长用的要数`System.out`和`System.err`

比如我们打印一个Hello World，可以这样写：

```java
System.out.println("Hello World");
```

但是面对纷杂的打印需求，`System.out.println`无法满足，比如：

1. 不支持参数，对象打印需要拼接字符串
2. 不能直接打印数组，需要手动调用`Arrays.toString`

考虑到以上问题，我封装了`Console`对象。

> Console对象的使用更加类似于Javascript的`console.log()`方法，这也是借鉴了JS的一个语法糖。

## 使用

1. `Console.log` 这个方法基本等同于`System.out.println`,但是支持类似于Slf4j的字符串模板语法，同时也会自动将对象（包括数组）转为字符串形式。

```java
String[] a = {"abc", "bcd", "def"};
Console.log(a);//控制台输出：[abc, bcd, def]
Console.log("This is Console log for {}.", "test");
//控制台输出：This is Console log for test.
```

2. `Console.error` 这个方法基本等同于`System.err.println`，,但是支持类似于Slf4j的字符串模板语法，同时也会自动将对象（包括数组）转为字符串形式。

# 字段验证器-Validator

## 作用

验证给定字符串是否满足指定条件，一般用在表单字段验证里。

此类中全部为静态方法。

## 使用

### 判断验证

直接调用`Validator.isXXX(String value)`既可验证字段，返回是否通过验证。

例如：

```Java
boolean isEmail = Validator.isEmail("loolly@gmail.com")
```

表示验证给定字符串是否复合电子邮件格式。

其他验证信息请参阅`Validator`类

如果Validator里的方法无法满足自己的需求，那还可以调用

```
Validator.isMactchRegex("需要验证字段的正则表达式", "被验证内容")
```

来通过正则表达式灵活的验证内容。

### 异常验证

除了手动判断，我们有时需要在判断未满足条件时抛出一个异常，Validator同样提供异常验证机制：

```java
Validator.validateChinese("我是一段zhongwen", "内容中包含非中文");
```

因为内容中包含非中文字符，因此会抛出ValidateException。

# 字符串格式化-StrFormatter

## 由来

我一直对Slf4j的字符串格式化情有独钟，通过`{}`这种简单的占位符完成字符串的格式化。于是参考Slf4j的源码，便有了`StrFormatter`。

> StrFormatter.format的快捷使用方式为`StrUtil.format`，推荐使用后者。

## 使用

```java
//通常使用
String result1 = StrFormatter.format("this is {} for {}", "a", "b");
Assert.assertEquals("this is a for b", result1);

//转义{}
String result2 = StrFormatter.format("this is \\{} for {}", "a", "b");
Assert.assertEquals("this is {} for a", result2);

//转义\
String result3 = StrFormatter.format("this is \\\\{} for {}", "a", "b");
Assert.assertEquals("this is \\a for b", result3);
```

# 树结构工具-TreeUtil

## 介绍

考虑到菜单等需求的普遍性，有用户提交了一个扩展性极好的树状结构实现。这种树状结构可以根据配置文件灵活的定义节点之间的关系，也能很好的兼容关系数据库中数据。实现

```
关系型数据库数据  <->  Tree  <->  JSON
```

树状结构中最大的问题就是关系问题，在数据库中，每条数据通过某个字段关联自己的父节点，每个业务中这个字段的名字都不同，如何解决这个问题呢？

PR的提供者提供了一种解决思路：自定义字段名，节点不再是一个bean，而是一个map，实现灵活的字段名定义。

## 使用

### 定义结构

我们假设要构建一个菜单，可以实现系统管理和店铺管理，菜单的样子如下：

```
系统管理
    |- 用户管理
    |- 添加用户

店铺管理
    |- 商品管理
    |- 添加商品
```

那这种结构如何保存在数据库中呢？一般是这样的：

| id   | parentId | name     | weight |
| ---- | -------- | -------- | ------ |
| 1    | 0        | 系统管理 | 5      |
| 11   | 1        | 用户管理 | 10     |
| 111  | 1        | 用户添加 | 11     |
| 2    | 0        | 店铺管理 | 5      |
| 21   | 2        | 商品管理 | 10     |
| 221  | 2        | 添加添加 | 11     |

我们看到，每条数据根据`parentId`相互关联并表示层级关系，`parentId`在这里也叫外键。

### 构建Tree

```java
// 构建node列表
List<TreeNode<String>> nodeList = CollUtil.newArrayList();

nodeList.add(new TreeNode<>("1", "0", "系统管理", 5));
nodeList.add(new TreeNode<>("11", "1", "用户管理", 222222));
nodeList.add(new TreeNode<>("111", "11", "用户添加", 0));
nodeList.add(new TreeNode<>("2", "0", "店铺管理", 1));
nodeList.add(new TreeNode<>("21", "2", "商品管理", 44));
nodeList.add(new TreeNode<>("221", "2", "商品管理2", 2));
```

> TreeNode表示一个抽象的节点，也表示数据库中一行数据。 如果有其它数据，可以调用`setExtra`添加扩展字段。

```java
// 0表示最顶层的id是0
List<Tree<String>> treeList = TreeUtil.build(nodeList, "0");
```

因为两个Tree是平级的，再没有上层节点，因此为List。

### 自定义字段名

```java
//配置
TreeNodeConfig treeNodeConfig = new TreeNodeConfig();
// 自定义属性名 都要默认值的
treeNodeConfig.setWeightKey("order");
treeNodeConfig.setIdKey("rid");
// 最大递归深度
treeNodeConfig.setDeep(3);

//转换器
List<Tree<String>> treeNodes = TreeUtil.build(nodeList, "0", treeNodeConfig,
        (treeNode, tree) -> {
            tree.setId(treeNode.getId());
            tree.setParentId(treeNode.getParentId());
            tree.setWeight(treeNode.getWeight());
            tree.setName(treeNode.getName());
            // 扩展属性 ...
            tree.putExtra("extraField", 666);
            tree.putExtra("other", new Object());
        });
```

通过TreeNodeConfig我们可以自定义节点的名称、关系节点id名称，这样就可以和不同的数据库做对应。

# Bean工具-BeanUtil

## 什么是Bean

把一个拥有对属性进行set和get方法的类，我们就可以称之为JavaBean。实际上JavaBean就是一个Java类，在这个Java类中就默认形成了一种规则——对属性进行设置和获得。而反之将说Java类就是一个JavaBean，这种说法是错误的，因为一个java类中不一定有对属性的设置和获得的方法（也就是不一定有set和get方法）。

通常Java中对Bean的定义是包含setXXX和getXXX方法的对象，在Hutool中，采取一种简单的判定Bean的方法：是否存在只有一个参数的setXXX方法。

Bean工具类主要是针对这些setXXX和getXXX方法进行操作，比如将Bean对象转为Map等等。

## 方法

### 是否为Bean对象

`BeanUtil.isBean`方法根据是否存在只有一个参数的setXXX方法或者public类型的字段来判定是否是一个Bean对象。这样的判定方法主要目的是保证至少有一个setXXX方法用于属性注入。

```java
boolean isBean = BeanUtil.isBean(HashMap.class);//false
```

### 内省 Introspector

把一类中需要进行设置和获得的属性访问权限设置为private（私有的）让外部的使用者看不见摸不着，而通过public（共有的）set和get方法来对其属性的值来进行设置和获得，而内部的操作具体是怎样的？外界使用的人不用知道，这就称为内省。

Hutool中对内省的封装包括：

1. `BeanUtil.getPropertyDescriptors` 获得Bean字段描述数组

```java
PropertyDescriptor[] propertyDescriptors = BeanUtil.getPropertyDescriptors(SubPerson.class);
```

1. `BeanUtil.getFieldNamePropertyDescriptorMap` 获得字段名和字段描述Map
2. `BeanUtil.getPropertyDescriptor` 获得Bean类指定属性描述

### Bean属性注入

`BeanUtil.fillBean`方法是bean注入的核心方法，此方法传入一个ValueProvider接口，通过实现此接口来获得key对应的值。CopyOptions参数则提供一些注入属性的选项。

CopyOptions的配置项包括：

1. `editable` 限制的类或接口，必须为目标对象的实现接口或父类，用于限制拷贝的属性，例如一个类我只想复制其父类的一些属性，就可以将editable设置为父类。
2. `ignoreNullValue` 是否忽略空值，当源对象的值为null时，true: 忽略而不注入此值，false: 注入null
3. `ignoreProperties` 忽略的属性列表，设置一个属性列表，不拷贝这些属性值
4. `ignoreError` 是否忽略字段注入错误

可以通过`CopyOptions.create()`方法创建一个默认的配置项，通过setXXX方法设置每个配置项。

ValueProvider接口需要实现两个方法：

1. `value`方法是通过key和目标类型来从任何地方获取一个值，并转换为目标类型，如果返回值不和目标类型匹配，将会自动调用`Convert.convert`方法转换。
2. `containsKey`方法主要是检测是否包含指定的key，如果不包含这个key，其对应的属性将会忽略注入。

首先定义两个bean：

```java
// Lombok注解
@Data
public class Person{
    private String name;
    private int age;
}

// Lombok注解
@Data
public class SubPerson extends Person {
    public static final String SUBNAME = "TEST";

    private UUID id;
    private String subName;
    private Boolean isSlow;
}
```

然后注入这个bean：

```java
Person person = BeanUtil.fillBean(new Person(), new ValueProvider<String>(){

    @Override
    public Object value(String key, Class<?> valueType) {
        switch (key) {
            case "name":
                return "张三";
            case "age":
                return 18;
        }
        return null;
    }

    @Override
    public boolean containsKey(String key) {
        //总是存在key
        return true;
    }
    
}, CopyOptions.create());

Assert.assertEquals(person.getName(), "张三");
Assert.assertEquals(person.getAge(), 18);
```

同时，Hutool还提供了`BeanUtil.toBean`方法，此处并不是传Bean对象，而是Bean类，Hutool会自动调用默认构造方法创建对象。

基于`BeanUtil.fillBean`方法Hutool还提供了Map对象键值对注入Bean，其方法有：

1. `BeanUtil.fillBeanWithMap` 使用Map填充bean

```java
HashMap<String, Object> map = CollUtil.newHashMap();
map.put("name", "Joe");
map.put("age", 12);
map.put("openId", "DFDFSDFWERWER");

SubPerson person = BeanUtil.fillBeanWithMap(map, new SubPerson(), false);
```

1. `BeanUtil.fillBeanWithMapIgnoreCase` 使用Map填充bean，忽略大小写

```java
HashMap<String, Object> map = CollUtil.newHashMap();
map.put("Name", "Joe");
map.put("aGe", 12);
map.put("openId", "DFDFSDFWERWER");
SubPerson person = BeanUtil.fillBeanWithMapIgnoreCase(map, new SubPerson(), false);
```

同时提供了map转bean的方法，与fillBean不同的是，此处并不是传Bean对象，而是Bean类，Hutool会自动调用默认构造方法创建对象。当然，前提是Bean类有默认构造方法（空构造），这些方法有：

1. `BeanUtil.toBean`

```java
HashMap<String, Object> map = CollUtil.newHashMap();
map.put("a_name", "Joe");
map.put("b_age", 12);
// 设置别名，用于对应bean的字段名
HashMap<String, String> mapping = CollUtil.newHashMap();
mapping.put("a_name", "name");
mapping.put("b_age", "age");
Person person = BeanUtil.toBean(map, Person.class, CopyOptions.create().setFieldMapping(mapping));
```

1. `BeanUtil.toBeanIgnoreCase`

```java
HashMap<String, Object> map = CollUtil.newHashMap();
map.put("Name", "Joe");
map.put("aGe", 12);

Person person = BeanUtil.toBeanIgnoreCase(map, Person.class, false);
```

### Bean转为Map

`BeanUtil.beanToMap`方法则是将一个Bean对象转为Map对象。

```java
SubPerson person = new SubPerson();
person.setAge(14);
person.setOpenid("11213232");
person.setName("测试A11");
person.setSubName("sub名字");

Map<String, Object> map = BeanUtil.beanToMap(person);
```

### Bean转Bean

Bean之间的转换主要是相同属性的复制，因此方法名为`copyProperties`，此方法支持Bean和Map之间的字段复制。

`BeanUtil.copyProperties`方法同样提供一个`CopyOptions`参数用于自定义属性复制。

```java
SubPerson p1 = new SubPerson();
p1.setSlow(true);
p1.setName("测试");
p1.setSubName("sub测试");

Map<String, Object> map = MapUtil.newHashMap();

BeanUtil.copyProperties(p1, map);
```

### Alias注解

5.x的Hutool中增加了一个自定义注解：`@Alias`，通过此注解可以给Bean的字段设置别名。

首先我们给Bean加上注解：

```java
// Lombok注解
@Getter
@Setter
public static class SubPersonWithAlias {
    @Alias("aliasSubName")
    private String subName;
    private Boolean slow;
SubPersonWithAlias person = new SubPersonWithAlias();
person.setSubName("sub名字");
person.setSlow(true);

// Bean转换为Map时，自动将subName修改为aliasSubName
Map<String, Object> map = BeanUtil.beanToMap(person);
// 返回"sub名字"
map.get("aliasSubName")
```

同样Alias注解支持注入Bean时的别名：

```java
Map<String, Object> map = MapUtil.newHashMap();
map.put("aliasSubName", "sub名字");
map.put("slow", true);

SubPersonWithAlias subPersonWithAlias = BeanUtil.mapToBean(map, SubPersonWithAlias.class, false);
// 返回"sub名字"
subPersonWithAlias.getSubName();
```



# DynaBean

## 介绍

DynaBean是使用反射机制动态操作JavaBean的一个封装类，通过这个类，可以通过字符串传入name方式动态调用get和set方法，也可以动态创建JavaBean对象，亦或者执行JavaBean中的方法。

## 使用

我们先定义一个JavaBean：

```java
// Lombok注解
@Data
public static class User{
    private String name;
    private int age;
    
    public String testMethod(){
        return "test for " + this.name;
    }

}
```

### 创建

```java
DynaBean bean = DynaBean.create(user);
//我们也可以通过反射构造对象
DynaBean bean2 = DynaBean.create(User.class);
```

### 操作

我们通过DynaBean来包装并操作这个Bean

```java
User user = new User();
DynaBean bean = DynaBean.create(user);
bean.set("name", "李华");
bean.set("age", 12);

String name = bean.get("name");//输出“李华”
```

这样我们就可以像操作Map一样动态操作JavaBean

### invoke

除了标准的get和set方法，也可以调用invoke方法执行对象中的任意方法：

```java
//执行指定方法
Object invoke = bean2.invoke("testMethod");
Assert.assertEquals("test for 李华", invoke);
```

> 说明: DynaBean默认实现了hashCode、equals和toString三个方法，这三个方法也是默认调用原对象的相应方法操作。

# 表达式解析-BeanPath

## 由来

很多JavaBean嵌套有很多层对象，这其中还夹杂着Map、Collection等对象，因此获取太深的嵌套对象会让代码变得冗长不堪。因此我们可以考虑使用一种表达式还获取指定深度的对象，于是BeanResolver应运而生。

## 原理

通过传入一个表达式，按照表达式的规则获取bean下指定的对象。

表达式分为两种：

- `.`表达式，可以获取Bean对象中的属性（字段）值或者Map中key对应的值
- `[]`表达式，可以获取集合等对象中对应index的值

栗子：

1. `person` 获取Bean对象下person字段的值，或者Bean本身如果是Person对象，返回本身。
2. `person.name` 获取Bean中person字段下name字段的值，或者Bean本身如果是Person对象，返回其name字段的值。
3. `persons[3]` 获取persons字段下第三个元素的值（假设person是数组或Collection对象）
4. `person.friends[5].name` 获取person字段下friends列表（或数组）的第5个元素对象的name属性

## 使用

由于嵌套Bean定义过于复杂，在此我们省略，有兴趣的可以看下这里：cn.hutool.core.lang.test.bean（src/test/java下）下定义了测试用例用的bean。

首先我们创建这个复杂的Bean（实际当中这个复杂的Bean可能是从数据库中获取，或者从JSON转入）

这个复杂Bean的关系是这样的：

定义一个Map包含用户信息（UserInfoDict）和一个标志位（flag），用户信息包括一些基本信息和一个考试信息列表（ExamInfoDict）。

```java
//------------------------------------------------- 考试信息列表
ExamInfoDict examInfoDict = new ExamInfoDict();
examInfoDict.setId(1);
examInfoDict.setExamType(0);
examInfoDict.setAnswerIs(1);

ExamInfoDict examInfoDict1 = new ExamInfoDict();
examInfoDict1.setId(2);
examInfoDict1.setExamType(0);
examInfoDict1.setAnswerIs(0);

ExamInfoDict examInfoDict2 = new ExamInfoDict();
examInfoDict2.setId(3);
examInfoDict2.setExamType(1);
examInfoDict2.setAnswerIs(0);

List<ExamInfoDict> examInfoDicts = new ArrayList<ExamInfoDict>();
examInfoDicts.add(examInfoDict);
examInfoDicts.add(examInfoDict1);
examInfoDicts.add(examInfoDict2);

//------------------------------------------------- 用户信息
UserInfoDict userInfoDict = new UserInfoDict();
userInfoDict.setId(1);
userInfoDict.setPhotoPath("yx.mm.com");
userInfoDict.setRealName("张三");
userInfoDict.setExamInfoDict(examInfoDicts);

Map<String, Object> tempMap = new HashMap<String, Object>();
tempMap.put("userInfo", userInfoDict);
tempMap.put("flag", 1);
```

下面，我们使用`BeanPath`获取这个Map下此用户第一门考试的ID：

```java
BeanPath resolver = new BeanPath("userInfo.examInfoDict[0].id");
Object result = resolver.get(tempMap);//ID为1
```

只需两句（甚至一句）即可完成复杂Bean中各层次对象的获取。

> 说明： 为了简化`BeanPath`的使用，Hutool在BeanUtil中也加入了快捷入口方法：`BeanUtil.getProperty`，这个方法的命名更容易理解（毕竟BeanPath不但可以解析Bean，而且可以解析Map和集合）。

# Bean描述-BeanDesc

## 介绍

Hutool封装了Bean的信息描述来将一个Bean的相关信息全部通过反射解析出来，此类类似于JDK的`BeanInfo`，也可以理解为是这个类的强化版本。

BeanDesc包含所有字段（属性）及对应的Getter方法和Setter方法，与`BeanInfo`不同的是，`BeanDesc`要求属性和getter、setter必须严格对应，即如果有非public属性，没有getter，则不能获取属性值，没有setter也不能注入属性值。

属性和getter、setter关联规则如下：

1. 忽略字段和方法名的大小写（匹配时）
2. 字段名是XXX，则Getter查找getXXX、isXXX、getIsXXX
3. 字段名是XXX，Setter查找setXXX、setIsXXX
4. Setter忽略参数值与字段值不匹配的情况，因此有多个参数类型的重载时，会调用首次匹配的

## 使用

我们定义一个较为复杂的Bean：

```java
public static class User {
    private String name;
    private int age;
    private boolean isAdmin;
    private boolean isSuper;
    private boolean gender;

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public int getAge() {
        return age;
    }
    public User setAge(int age) {
        this.age = age;
        return this;
    }
    public String testMethod() {
        return "test for " + this.name;
    }
    public boolean isAdmin() {
        return isAdmin;
    }
    public void setAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
    }
    public boolean isIsSuper() {
        return isSuper;
    }
    public void setIsSuper(boolean isSuper) {
        this.isSuper = isSuper;
    }
    public boolean isGender() {
        return gender;
    }
    public void setGender(boolean gender) {
        this.gender = gender;
    }
    @Override
    public String toString() {
        return "User [name=" + name + ", age=" + age + ", isAdmin=" + isAdmin + ", gender=" + gender + "]";
    }
}
```

### 字段getter方法获取

1. 一般字段

```java
BeanDesc desc = BeanUtil.getBeanDesc(User.class);
// User
desc.getSimpleName();

// age
desc.getField("age").getName();
// getAge
desc.getGetter("age").getName();
// setAge
desc.getSetter("age").getName();
```

1. Boolean字段

我们会发现`User`中的boolean字段叫做`isAdmin`，此时同名的getter也可以获取到：

```java
BeanDesc desc = BeanUtil.getBeanDesc(User.class);

// isAdmin
desc.getGetter("isAdmin").getName()；
```

当然，用户如果觉得`isIsXXX`才是正确的，`BeanDesc`也可以完美获取，我们以`isSuper`字段为例：

```java
// isIsSuper
desc.getGetter("isSuper");
```

### 字段属性赋值

```java
BeanDesc desc = BeanUtil.getBeanDesc(User.class);
User user = new User();
desc.getProp("name").setValue(user, "张三");
```

# 空检查属性获取-Opt

## 介绍

在嵌套对象的属性获取中，由于子对象无法得知是否为`null`，每次获取属性都要检查属性兑现是否为null，使得代码会变得特备臃肿，因此使用`Opt`来优雅的链式获取属性对象值。

> 声明：此类的作者：[阿超](https://gitee.com/VampireAchao) ，PR来自：https://gitee.com/dromara/hutool/pulls/426

## 使用

我们先定义一个嵌套的Bean：

```java
// Lombok注解
@Data
public static class User {
    private String name;
    private String gender;
    private School school;
    
    @Data
    public static class School {
        private String name;
        private String address;
    }
}
```

假设我们想获取`address`属性，则：

```java
User user = new User();
user.setName("hello");

// null
String addressValue = Opt.ofNullable(user)
        .map(User::getSchool)
        .map(User.School::getAddress).get();
```

由于school对象的值为`null`，一般直接获取会报空指针，使用`Opt`即可避免判断。

- ofBlankAble函数基于ofNullable的逻辑下，额外进行了空字符串判断

  ```java
  // ofBlankAble相对于ofNullable考虑了字符串为空串的情况
  String hutool = OptionalBean.ofBlankAble("").orElse("hutool");
  Assert.assertEquals("hutool", hutool);
  ```

- 原版Optional有区别的是，get不会抛出NoSuchElementException

- 如果想使用原版Optional中的get这样，获取一个一定不为空的值，则应该使用orElseThrow

  ```java
  // 和原版Optional有区别的是，get不会抛出NoSuchElementException
  // 如果想使用原版Optional中的get这样，获取一个一定不为空的值，则应该使用orElseThrow
  Object opt = OptionalBean.ofNullable(null).get();
  Assert.assertNull(opt);
  ```

- 这是参考了jdk11 Optional中的新函数isEmpty，用于判断不存在值的情况

  ```java
  // 这是参考了jdk11 Optional中的新函数
  // 判断包裹内元素是否为空，注意并没有判断空字符串的情况
  boolean isEmpty = OptionalBean.empty().isEmpty();
  Assert.assertTrue(isEmpty);
  ```

- 灵感来源于jdk9 Optional中的新函数ifPresentOrElse，用于 存在值时执行某些操作，不存在值时执行另一个操作，支持链式编程

  ```java
  // 灵感来源于jdk9 Optional中的新函数ifPresentOrElse
  // 存在就打印对应的值，不存在则用{@code System.err.println}打印另一句字符串
  OptionalBean.ofNullable("Hello Hutool!").ifPresentOrElse(System.out::println, () -> System.err.println("Ops!Something is wrong!"));
  OptionalBean.empty().ifPresentOrElse(System.out::println, () -> System.err.println("Ops!Something is wrong!"));
  ```

- 新增了peek函数，相当于ifPresent的链式调用（个人常用）

  ```java
  User user = new User();
  // 相当于ifPresent的链式调用
  OptionalBean.ofNullable("hutool").peek(user::setUsername).peek(user::setNickname);
  Assert.assertEquals("hutool", user.getNickname());
  Assert.assertEquals("hutool", user.getUsername());
  ```

// 注意，传入的lambda中，对包裹内的元素执行赋值操作并不会影响到原来的元素 String name = OptionalBean.ofNullable("hutool").peek(username -> username = "123").peek(username -> username = "456").get(); Assert.assertEquals("hutool", name);

```
- 灵感来源于jdk11 Optional中的新函数or，用于值不存在时，用别的Opt代替
​```java
// 灵感来源于jdk11 Optional中的新函数or
// 给一个替代的Opt
String str = OptionalBean.<String>ofNullable(null).or(() -> OptionalBean.ofNullable("Hello hutool!")).map(String::toUpperCase).orElseThrow();
Assert.assertEquals("HELLO HUTOOL!", str);

User user = User.builder().username("hutool").build();
OptionalBean<User> userOptionalBean = OptionalBean.of(user);
// 获取昵称，获取不到则获取用户名
String name = userOptionalBean.map(User::getNickname).or(() -> userOptionalBean.map(User::getUsername)).get();
Assert.assertEquals("hutool", name);
```

- 对orElseThrow进行了重载，支持 双冒号+自定义提示语 写法，比原来的

  ```java
  orElseThrow(() -> new IllegalStateException("Ops!Something is wrong!"))
  ```

  更加优雅,修改后写法为：

  ```java
  orElseThrow(IllegalStateException::new, "Ops!Something is wrong!")
  ```

## 学习

经常有朋友问我，你这个`Opt`，参数怎么都是一些`lambda`，我怎么知道对应的`lambda`怎么写呢？

这函数式编程，真是一件美事啊~

对于这种情况，我们依靠我们强大的`idea`即可

例如此处我写到这里写不会了

```java
User user = new User();
// idea提示下方参数，如果没显示，光标放到括号里按ctrl+p主动呼出            
         |Function<? super User,?> mapper|
Opt.ofNullable(user).map()
```

这里`idea`为我们提示了参数类型，可这个`Function`我也不知道它是个什么

实际上，我们`new`一个就好了

```java
Opt.ofNullable(user).map(new Fun)
                            |Function<User, Object>{...} (java.util.function)   |  <-戳我
                            |Func<P,R> cn.hutool.core.lang.func                 |
```

这里`idea`提示了剩下的代码，我们选`Function`就行了，接下来如下：

```java
Opt.ofNullable(user).map(new Function<User, Object>() {
})
```

此处开始编译报错了，不要着急，我们这里根据具体操作选取返回值

例如我这里是想判断`user`是否为空，不为空时调用`getSchool`，从而获取其中的返回值`String`类型的`school`

我们就如下写法，将第二个泛型，也就是象征返回值的泛型改为`String`：

```java
Opt.ofNullable(user).map(new Function<User, String>() {
})
```

然后我们使用`idea`的修复所有，默认快捷键`alt`+回车

```java
Opt.ofNullable(user).map(new Function<User, String>() {
})                                                | 💡 Implement methods                  |  <-选我
                                                  | ✍  Introduce local variable          |
                                                  | ↩  Rollback changes in current line   |
```

选择第一个`Implement methods`即可，这时候弹出一个框，提示让你选择你想要实现的方法

这里就选择我们的`apply`方法吧，按下一个回车就可以了，或者点击选中`apply`，再按一下`OK`按钮

```java
    ||IJ| Select Methods to Implement                        X |
    |                                                          |
    | 👇  ©  |  ↹  ↸                                          |
    | -------------------------------------------------------- |
    | | java.util.function.Function                            |
    | | ⒨ 🔓 apply(t:T):R                                     |      <-选我选我
    | | ⒨ 🔓 compose(before:Function<? super V,? extents T):Fu|
    | | ⒨ 🔓 andThen(after:Function<? super R,? extends V>):Fu|
    | |                                                        |
    | | ========================================               |                                        
    | -------------------------------------------------------- |
    |  ☐ Copy JavaDoc                                          |
    |  ☑ Insert @Override               |  OK  |  | CANCEL |   |     <-选完点我点我
```

此时此刻，代码变成了这样子

```java
Opt.ofNullable(user).map(new Function<User, String>() {
    @Override
    public String apply(User user) {
        return null;
    }
})
```

这里重写的方法里面就写你自己的逻辑(别忘了补全后面的分号)

```java
Opt.ofNullable(user).map(new Function<User, String>() {
    @Override
    public String apply(User user) {
        return user.getSchool();
    }
});
```

我们可以看到，上边的`new Function<User, String>()`变成了灰色

我们在它上面按一下`alt`+`enter`(回车)

```java
Opt.ofNullable(user).map(new Function<User, String>() {
    @Override                              | 💡 Replace with lambda             > |  <-选我啦
    public String apply(User user) {       | 💡 Replace with method reference   > |
        return user.getSchool();           | 💎 balabala...                     > |
    }
});
```

选择第一个`Replace with lambda`，就会自动缩写为`lambda`啦

```java
Opt.ofNullable(user).map(user1 -> user1.getSchool());
```

如果选择第二个，则会缩写为我们双冒号格式

```java
Opt.ofNullable(user).map(User::getSchool);
```

看，是不是很简单！

# 集合工具-CollUtil

## 介绍

这个工具主要增加了对数组、集合类的操作。

### `join` 方法

将集合转换为字符串，这个方法还是挺常用，是`StrUtil.split`的反方法。这个方法的参数支持各种类型对象的集合，最后连接每个对象时候调用其`toString()`方法。栗子如下：

```Java
String[] col= new String[]{"a","b","c","d","e"};
List<String> colList = CollUtil.newArrayList(col);

String str = CollUtil.join(colList, "#"); //str -> a#b#c#d#e
```

### `sortPageAll`、`sortPageAll2`方法

这个方法其实是一个真正的组合方法，功能是：将给定的多个集合放到一个列表（`List`）中，根据给定的`Comparator`对象排序，然后分页取数据。这个方法非常类似于数据库多表查询后排序分页，这个方法存在的意义也是在此。`sortPageAll2`功能和`sortPageAll`的使用方式和结果是 一样的，区别是`sortPageAll2`使用了`BoundedPriorityQueue`这个类来存储组合后的列表，不知道哪种性能更好一些，所以就都保留了。使用此方法，栗子如下：

```Java
//Integer比较器
Comparator<Integer> comparator = new Comparator<Integer>(){
    @Override
    public int compare(Integer o1, Integer o2) {
        return o1.compareTo(o2);
    }
};

//新建三个列表，CollUtil.newArrayList方法表示新建ArrayList并填充元素
List<Integer> list1 = CollUtil.newArrayList(1, 2, 3);
List<Integer> list2 = CollUtil.newArrayList(4, 5, 6);
List<Integer> list3 = CollUtil.newArrayList(7, 8, 9);

//参数表示把list1,list2,list3合并并按照从小到大排序后，取0~2个（包括第0个，不包括第2个），结果是[1,2]
@SuppressWarnings("unchecked")
List<Integer> result = CollUtil.sortPageAll(0, 2, comparator, list1, list2, list3);
System.out.println(result);     //输出 [1,2]
```

### `sortEntrySetToList`方法

这个方法主要是对`Entry<Long, Long>`按照Value的值做排序，使用局限性较大，我已经忘记哪里用到过了……

### `popPart`方法

这个方法传入一个栈对象，然后弹出指定数目的元素对象，弹出是指`pop()`方法，会从原栈中删掉。

### `append`方法

在给定数组里末尾加一个元素，其实List.add()也是这么实现的，这个方法存在的意义是只有少量的添加元素时使用，因为内部使用了`System.arraycopy`,每调用一次就要拷贝数组一次。这个方法也是为了在某些只能使用数组的情况下使用，省去了先要转成`List`，添加元素，再转成Array。

### 7. `resize`方法

重新调整数据的大小，如果调整后的大小比原来小，截断，如果比原来大，则多出的位置空着。（貌似List在扩充的时候会用到类似的方法）

### `addAll`方法

将多个数据合并成一个数组

### `sub`方法

对集合切片，其他类型的集合会转换成`List`，封装`List.subList`方法，自动修正越界等问题，完全避免`IndexOutOfBoundsException`异常。

### `isEmpty`、`isNotEmpty`方法

判断集合是否为空（包括null和没有元素的集合）。

### `zip`方法

此方法也是来源于[Python](https://www.python.org/)的一个语法糖，给定两个集合，然后两个集合中的元素一一对应，成为一个Map。此方法还有一个重载方法，可以传字符，然后给定分分隔符，字符串会被split成列表。栗子：

```Java
Collection<String> keys = CollUtil.newArrayList("a", "b", "c", "d");
Collection<Integer> values = CollUtil.newArrayList(1, 2, 3, 4);

// {a=1,b=2,c=3,d=4}
Map<String, Integer> map = CollUtil.zip(keys, values);
```

# 列表工具-ListUtil

## 介绍

List在集合中中使用最为频繁，因此新版本的Hutool中针对`List`单独封装了工具方法。

## 使用

### 过滤列表

```java
List<String> a = ListUtil.toLinkedList("1", "2", "3");
// 结果: [edit1, edit2, edit3]
List<String> filter = ListUtil.filter(a, str -> "edit" + str);
```

### 获取满足指定规则所有的元素的位置

```java
List<String> a = ListUtil.toLinkedList("1", "2", "3", "4", "3", "2", "1");
// [1, 5]
int[] indexArray = ListUtil.indexOfAll(a, "2"::equals);
```

其他方法与`CollUtil`工具类似，很多工具也有重复。

### 拆分

对集合按照指定长度分段，每一个段为单独的集合，返回这个集合的列表：

```java
List<List<Object>> lists = ListUtil.split(Arrays.asList(1, 2, 3, 4), 1);
List<List<Object>> lists = ListUtil.split(null, 3);
```

也可以平均拆分，即平均分成N份，每份的数量差不超过1：

```java
// [[1, 2, 3, 4]]
List<List<Object>> lists = ListUtil.splitAvg(Arrays.asList(1, 2, 3, 4), 1);

// [[1, 2], [3], [4]]
lists = ListUtil.splitAvg(Arrays.asList(1, 2, 3, 4), 3);
```

### 编辑元素

我们可以针对集合中所有元素按照给定的lambda定义规则修改元素：

```java
List<String> a = ListUtil.toLinkedList("1", "2", "3");
final List<String> filter = (List<String>) CollUtil.edit(a, str -> "edit" + str);

// edit1
filter.get(0);
```

### 查找位置

```java
List<String> a = ListUtil.toLinkedList("1", "2", "3", "4", "3", "2", "1");

// 查找所有2的位置
// [1,5]
final int[] indexArray = ListUtil.indexOfAll(a, "2"::equals);
```

### 列表截取

```java
final List<Integer> of = ListUtil.of(1, 2, 3, 4);

// [3, 4]
final List<Integer> sub = ListUtil.sub(of, 2, 4);

// 对子列表操作不影响原列表
sub.remove(0);
```

### 排序

如我们想按照bean对象的order字段值排序：

```java
@Data
@AllArgsConstructor
class TestBean{
    private int order;
    private String name;
}

final List<TestBean> beanList = ListUtil.toList(
        new TestBean(2, "test2"),
        new TestBean(1, "test1"),
        new TestBean(5, "test5"),
        new TestBean(4, "test4"),
        new TestBean(3, "test3")
        );

final List<TestBean> order = ListUtil.sortByProperty(beanList, "order");
```

### 元素交换

```java
List<Integer> list = Arrays.asList(7, 2, 8, 9);

// 将元素8和第一个位置交换
ListUtil.swapTo(list, 8, 1);
```

# Iterator工具-IterUtil

## 来源

最早此工具类中的方法是在CollUtil中的，由于经过抽象，因此单独拿出来以适应更广的场景。

## 方法介绍

- `isEmpty` 是否为null或者无元素
- `isNotEmpty` 是否为非null或者至少一个元素
- `hasNull` 是否有null元素
- `isAllNull` 是否全部为null元素
- `countMap` 根据集合返回一个元素计数的Map，所谓元素计数就是假如这个集合中某个元素出现了n次，那将这个元素做为key，n做为value
- `join` 使用分隔符将集合转换为字符串
- `toMap` toMap Entry列表转Map，或者key和value单独列表转Map
- `asIterator` Enumeration转Iterator
- `asIterable` Iterator转Iterable
- `getFirst` 获取列表的第一个元素
- `getElementType` 获取元素类型

# 有界优先队列-BoundedPriorityQueue

## 简介

举个例子。我有一个用户表，这个表根据用户名被Hash到不同的数据库实例上，我要找出这些用户中最热门的5个，怎么做？我是这么做的：

1. 在每个数据库实例上找出最热门的5个
2. 将每个数据库实例上的这5条数据按照热门程度排序，最后取出前5条

这个过程看似简单，但是你应用服务器上的代码要写不少。首先需要Query N个列表，加入到一个新列表中，排序，再取前5。这个过程不但代码繁琐，而且牵涉到多个列表，非常浪费空间。

于是，`BoundedPriorityQueue`应运而生。

先看Demo：

```Java
/**
 * 有界优先队列Demo
 * @author Looly
 *
 */
public class BoundedPriorityQueueDemo {
    
    public static void main(String[] args) {
        //初始化队列，设置队列的容量为5（只能容纳5个元素），元素类型为integer使用默认比较器，在队列内部将按照从小到大排序
        BoundedPriorityQueue<Integer> queue = new BoundedPriorityQueue<Integer>(5);
        
        //初始化队列，使用自定义的比较器
        queue = new BoundedPriorityQueue<>(5, new Comparator<Integer>(){

            @Override
            public int compare(Integer o1, Integer o2) {
                return o1.compareTo(o2);
            }
        });
        
        //定义了6个元素，当元素加入到队列中，会按照从小到大排序，当加入第6个元素的时候，队列末尾（最大的元素）将会被抛弃
        int[] array = new int[]{5,7,9,2,3,8};
        for (int i : array) {
            queue.offer(i);
        }
        
        //队列可以转换为List哦~~
        ArrayList<Integer> list = queue.toList();

        System.out.println(queue);
    }
}
```

原理非常简单。设定好队列的容量，然后把所有的数据add或者offer进去（两个方法相同），就会得到前5条数据了。

# 线程安全的HashSet-ConcurrentHashSet

## 简介

我们知道，JDK提供了线程安全的HashMap：ConcurrentHashMap，但是没有提供对应的ConcurrentHashSet，Hutool借助ConcurrentHashMap封装了线程安全的ConcurrentHashSet。

## 使用

与普通的HashSet使用一致:

```java
Set<String> set = new ConcurrentHashSet<>();
set.add("a");
set.add("b");
```



# 集合串行流工具-CollStreamUtil

## 介绍

Java8中的新特性之一就是Stream，Hutool针对常用操作做了一些封装

## 使用

### 集合转Map

```java
@Data
@AllArgsConstructor
@ToString
public static class Student {
    private long termId;//学期id
    private long classId;//班级id
    private long studentId;//班级id
    private String name;//学生名称
}
```

我们可以建立一个学生id和学生对象之间的map：

```java
List<Student> list = new ArrayList<>();
list.add(new Student(1, 1, 1, "张三"));
list.add(new Student(1, 1, 2, "李四"));
list.add(new Student(1, 1, 3, "王五"));

Map<Long, Student> map = CollStreamUtil.toIdentityMap(list, Student::getStudentId);

// 张三
map.get(1L).getName();
```

我们也可以自定义Map的key和value放的内容，如我们可以将学生信息的id和姓名生成map：

```java
Map<Long, String> map = map = CollStreamUtil.toMap(list, Student::getStudentId, Student::getName);

// 张三
map.get(1L);
```

### 分组

我们将学生按照班级分组：

```java
List<Student> list = new ArrayList<>();
list.add(new Student(1, 1, 1, "张三"));
list.add(new Student(1, 2, 2, "李四"));
list.add(new Student(2, 1, 1, "擎天柱"));
list.add(new Student(2, 2, 2, "威震天"));
list.add(new Student(2, 3, 2, "霸天虎"));

Map<Long, List<Student>> map = CollStreamUtil.groupByKey(list, Student::getClassId);
```

### 转换提取

我们可以将学生信息列表转换提取为姓名的列表：

```java
List<String> list = CollStreamUtil.toList(null, Student::getName);
```

### 合并

合并两个相同key类型的map，可自定义合并的lambda，将key value1 value2合并成最终的类型,注意value可能为空的情况。

```java
Map<Long, Student> map1 = new HashMap<>();
map1.put(1L, new Student(1, 1, 1, "张三"));

Map<Long, Student> map2 = new HashMap<>();
map2.put(1L, new Student(2, 1, 1, "李四"));
```

定义merge规则：

```java
private String merge(Student student1, Student student2) {
    if (student1 == null && student2 == null) {
        return null;
    } else if (student1 == null) {
        return student2.getName();
    } else if (student2 == null) {
        return student1.getName();
    } else {
        return student1.getName() + student2.getName();
    }
Map<Long, String> map = CollStreamUtil.merge(map1, map2, this::merge);
```



# 行遍历器-LineIter

## 介绍

此工具分别参考和`Apache Commons io`和`Guava`项目。

将Reader包装为一个按照行读取的Iterator。

### 使用

```java
final LineIter lineIter = new LineIter(ResourceUtil.getUtf8Reader("test_lines.csv"));

for (String line : lineIter) {
    Console.log(line);
}
```

# Map工具-MapUtil

## 介绍

MapUtil是针对Map的一一列工具方法的封装，包括getXXX的快捷值转换方法。

## 方法

- `isEmpty`、`isNotEmpty` 判断Map为空和非空方法，空的定义为null或没有值
- `newHashMap` 快速创建多种类型的HashMap实例
- `createMap` 创建自定义的Map类型的Map
- `of` 此方法将一个或多个键值对加入到一个新建的Map中，下面是栗子:

```java
Map<Object, Object> colorMap = MapUtil.of(new String[][] {
     {"RED", "#FF0000"},
     {"GREEN", "#00FF00"},
     {"BLUE", "#0000FF"}
});
```

- `toListMap` 行转列，合并相同的键，值合并为列表，将Map列表中相同key的值组成列表做为Map的value，例如传入数据是：

```json
[
  {a: 1, b: 1, c: 1},
  {a: 2, b: 2},
  {a: 3, b: 3},
  {a: 4}
]
```

结果为：

```json
{
   a: [1,2,3,4],
   b: [1,2,3,],
   c: [1]
}
```

- `toMapList` 列转行。将Map中值列表分别按照其位置与key组成新的map，例如传入数据：

```json
{
   a: [1,2,3,4],
   b: [1,2,3,],
   c: [1]
}
```

结果为：

```json
[
  {a: 1, b: 1, c: 1},
  {a: 2, b: 2},
  {a: 3, b: 3},
  {a: 4}
]
```

- `join`、`joinIgnoreNull`、`sortJoin`将Map按照给定的分隔符转换为字符串，此方法一般用于签名。

```java
Map<String, String> build = MapUtil.builder(new HashMap<String, String>())
    .put("key1", "value1")
    .put("key3", "value3")
    .put("key2", "value2").build();

// key1value1key2value2key3value3
String join1 = MapUtil.sortJoin(build, StrUtil.EMPTY, StrUtil.EMPTY, false);
// key1value1key2value2key3value3123
String join2 = MapUtil.sortJoin(build, StrUtil.EMPTY, StrUtil.EMPTY, false, "123");
```

- `filter` 过滤过程通过传入的Editor实现来返回需要的元素内容，这个Editor实现可以实现以下功能：1、过滤出需要的对象，如果返回null表示这个元素对象抛弃 2、修改元素对象，返回集合中为修改后的对象

```java
Map<String, String> map = MapUtil.newHashMap();
map.put("a", "1");
map.put("b", "2");
map.put("c", "3");
map.put("d", "4");

Map<String, String> map2 = MapUtil.filter(map, (Filter<Entry<String, String>>) t -> Convert.toIn(t.getValue()) % 2 == 0);
```

结果为

```json
{
   b: "2",
   d: "4"
}
```

- `reverse` Map的键和值互换

```java
Map<String, String> map = MapUtil.newHashMap();
        map.put("a", "1");
        map.put("b", "2");
        map.put("c", "3");
        map.put("d", "4");

Map<String, String> map2 = MapUtil.reverse(map);
```

结果为：

```json
{
   "1": "a",
   "2": "b",
   "3": "c",
   "4": "d",
}
```

- `sort` 排序Map
- `getAny` 获取Map的部分key生成新的Map
- `get`、`getXXX` 获取Map中指定类型的值

# 双向查找Map-BiMap

## 介绍

我们知道在Guava中提供了一种特殊的Map结构，叫做BiMap，它实现了一种双向查找的功能，即根据key查找value和根据value查找key，Hutool也同样提供此对象。

BiMap要求key和value都不能重复（非强制要求），如果key重复了，后加入的键值对会覆盖之前的键值对，如果value重复了，则会按照不确定的顺序覆盖key，这完全取决于map实现。比如HashMap无序（按照hash顺序），则谁覆盖谁和hash算法有关；如果是LinkedHashMap，则有序，是后加入的覆盖先加入的。

## 使用

```java
BiMap<String, Integer> biMap = new BiMap<>(new HashMap<>());
biMap.put("aaa", 111);
biMap.put("bbb", 222);

// 111
biMap.get("aaa");
// 222
biMap.get("bbb");

// aaa
biMap.getKey(111);
// bbb
biMap.getKey(222);
```

# 可重复键值Map-TableMap

## 介绍

有时候我们需要键值对一一对应，但是又有可能有重复的键，也可能有重复的值，就像一个2列的表格一样：

| 键   | 值     |
| ---- | ------ |
| key1 | value1 |
| key2 | value2 |

因此，Hutool创建了`TableMap`这类数据结构，通过键值单独建立List方式，使键值对一一对应，实现正向和反向两种查找。

当然，这种Map无论是正向还是反向，都是遍历列表查找过程，相比标准的HashMap要慢，数据越多越慢。

## 使用

```java
TableMap<String, Integer> tableMap = new TableMap<>(new HashMap<>());
tableMap.put("aaa", 111);
tableMap.put("bbb", 222);

// 111
tableMap.get("aaa");
// 222
tableMap.get("bbb");

// aaa
tableMap.getKey(111);
// bbb
tableMap.getKey(222);

// [111]
tableMap.getValues("aaa");

//[aaa]
tableMap.getKeys(111);
```



# Base62编码解码-Base62

## 介绍

Base62编码是由10个数字、26个大写英文字母和26个小写英文字母组成，多用于安全领域和短URL生成。

## 使用

```java
String a = "伦家是一个非常长的字符串66";

// 17vKU8W4JMG8dQF8lk9VNnkdMOeWn4rJMva6F0XsLrrT53iKBnqo
String encode = Base62.encode(a);

// 还原为a
String decodeStr = Base62.decodeStr(encode);
```

# Base64编码解码-Base64

## 介绍

Base64编码是用64（2的6次方）个ASCII字符来表示256（2的8次方）个ASCII字符，也就是三位二进制数组经过编码后变为四位的ASCII字符显示，长度比原来增加1/3。

## 使用

```java
String a = "伦家是一个非常长的字符串";
//5Lym5a625piv5LiA5Liq6Z2e5bi46ZW/55qE5a2X56ym5Liy
String encode = Base64.encode(a);

// 还原为a
String decodeStr = Base64.decodeStr(encode);
```

# Base32编码解码-Base32

## 介绍

Base32就是用32（2的5次方）个特定ASCII码来表示256个ASCII码。所以，5个ASCII字符经过base32编码后会变为8个字符（公约数为40），长度增加3/5.不足8n用“=”补足。

## 使用

```java
String a = "伦家是一个非常长的字符串";

String encode = Base32.encode(a);
Assert.assertEquals("4S6KNZNOW3TJRL7EXCAOJOFK5GOZ5ZNYXDUZLP7HTKCOLLMX46WKNZFYWI", encode);
        
String decodeStr = Base32.decodeStr(encode);
Assert.assertEquals(a, decodeStr);
```



# 莫尔斯电码-Morse

## 介绍

摩尔斯电码也被称作摩斯密码，是一种时通时断的信号代码，通过不同的排列顺序来表达不同的英文字母、数字和标点符号。

摩尔斯电码是由点dot（.）划dash（-）这两种符号所组成的。

## 实现

### 编码

```java
final Morse morseCoder = new Morse();

String text = "Hello World!";

// ...././.-../.-../---/-...../.--/---/.-./.-../-../-.-.--/
morseCoder.encode(text);
```

### 解码

```java
String text = "你好，世界！";

// -..----.--...../-.--..-.-----.-/--------....--../-..---....-.--./---.-.-.-..--../--------.......-/
String morse = morseCoder.encode(text);

morseCoder.decode(morse);
```

# BCD码-BCD

## 介绍

BCD码（Binary-Coded Decimal‎）亦称二进码十进数或二-十进制代码。

BCD码这种编码形式利用了四个位元来储存一个十进制的数码，使二进制和十进制之间的转换得以快捷的进行。

## 使用

```java
String strForTest = "123456ABCDEF";

// 转BCD
byte[] bcd = BCD.strToBcd(strForTest);

// 解码BCD
String str = BCD.bcdToStr(bcd);
```

# 回转N位密码-Rot

## 介绍

RotN（rotate by N places），回转N位密码，是一种简易的替换式密码，也是过去在古罗马开发的凯撒加密的一种变体。

## 使用

以Rot-13为例：

```java
String str = "1f2e9df6131b480b9fdddc633cf24996";

// 4s5r2qs9464o713o2sqqqp966ps57229
String encode13 = Rot.encode13(str);

// 解码
String decode13 = Rot.decode13(encode13);
```



# Punycode实现-PunyCode.md

## 介绍

Punycode是一个根据RFC 3492标准而制定的编码系统，主要用于把域名从地方语言所采用的Unicode编码转换成为可用于DNS系统的编码。

具体见：[RFC 3492](https://www.ietf.org/rfc/rfc3492.html)

## 使用

```java
String text = "Hutool编码器";

// Hutool-ux9js33tgln
String strPunyCode = PunyCode.encode(text);

// Hutool编码器
String decode = PunyCode.decode("Hutool-ux9js33tgln");

// Hutool编码器
decode = PunyCode.decode("xn--Hutool-ux9js33tgln");
```



# CSV文件处理工具-CsvUtil

## 介绍

逗号分隔值（Comma-Separated Values，CSV，有时也称为字符分隔值，因为分隔字符也可以不是逗号），其文件以纯文本形式存储表格数据（数字和文本）。

Hutool针对此格式，参考FastCSV项目做了对CSV文件读写的实现(Hutool实现完全独立，不依赖第三方)

`CsvUtil`是CSV工具类，主要封装了两个方法：

- getReader 用于对CSV文件读取
- getWriter 用于生成CSV文件

这两个方法分别获取`CsvReader`对象和`CsvWriter`，从而独立完成CSV文件的读写。

## 使用

### 读取CSV文件

#### 读取为CsvRow

```java
CsvReader reader = CsvUtil.getReader();
//从文件中读取CSV数据
CsvData data = reader.read(FileUtil.file("test.csv"));
List<CsvRow> rows = data.getRows();
//遍历行
for (CsvRow csvRow : rows) {
    //getRawList返回一个List列表，列表的每一项为CSV中的一个单元格（既逗号分隔部分）
    Console.log(csvRow.getRawList());
}
```

`CsvRow`对象还记录了一些其他信息，包括原始行号等。

#### 读取为Bean列表

首先测试的CSV：`test_bean.csv`:

```csv
姓名,gender,focus,age
张三,男,无,33
李四,男,好对象,23
王妹妹,女,特别关注,22
```

1. 定义Bean：

```java
// lombok注解
@Data
private static class TestBean{
    // 如果csv中标题与字段不对应，可以使用alias注解设置别名
    @Alias("姓名")
    private String name;
    private String gender;
    private String focus;
    private Integer age;
}
```

1. 读取

```java
final CsvReader reader = CsvUtil.getReader();
//假设csv文件在classpath目录下
final List<TestBean> result = reader.read(
                ResourceUtil.getUtf8Reader("test_bean.csv"), TestBean.class);
```

1. 输出：

```
CsvReaderTest.TestBean(name=张三, gender=男, focus=无, age=33)
CsvReaderTest.TestBean(name=李四, gender=男, focus=好对象, age=23)
CsvReaderTest.TestBean(name=王妹妹, gender=女, focus=特别关注, age=22)
```

### 生成CSV文件

```java
//指定路径和编码
CsvWriter writer = CsvUtil.getWriter("e:/testWrite.csv", CharsetUtil.CHARSET_UTF_8);
//按行写出
writer.write(
    new String[] {"a1", "b1", "c1"}, 
    new String[] {"a2", "b2", "c2"}, 
    new String[] {"a3", "b3", "c3"}
);
```



### 乱码问题

CSV文件本身为一种简单文本格式，有编码区分，你可以使用任意编码。

但是当使用Excel读取CSV文件时，如果你的编码与系统编码不一致，会出现乱码的情况，解决方案如下：

1. 可以将csv文本编码设置为与系统一致，如Windows下可以设置GBK
2. 可以增加BOM头来指定编码，这样Excel可以自动识别bom头的编码完成解析。

# 可复用字符串生成器-StrBuilder

## 介绍

在JDK提供的`StringBuilder`中，拼接字符串变得更加高效和灵活，但是生成新的字符串需要重新构建`StringBuilder`对象，造成性能损耗和内存浪费，因此Hutool提供了可复用的`StrBuilder`。

## 使用

`StrBuilder`和`StringBuilder`使用方法基本一致，只是多了`reset`方法可以重新构建一个新的字符串而不必开辟新内存。

```java
StrBuilder builder = StrBuilder.create();
builder.append("aaa").append("你好").append('r');
//结果：aaa你好r
```

## 多次构建字符串性能测试

我们模拟创建1000000次字符串对两者性能对比，采用`TimeInterval`计时：

```
//StringBuilder 
TimeInterval timer = DateUtil.timer();
StringBuilder b2 = new StringBuilder();
for(int i =0; i< 1000000; i++) {
    b2.append("test");
    b2 = new StringBuilder();
}
Console.log(timer.interval());
//StrBuilder
TimeInterval timer = DateUtil.timer();
StrBuilder builder = StrBuilder.create();
for(int i =0; i< 1000000; i++) {
    builder.append("test");
    builder.reset();
}
Console.log(timer.interval());
```

测试结果为：

```
StringBuilder: 39ms
StrBuilder   : 20ms
```

性能几乎翻倍。也欢迎用户自行测试。

# Unicode编码转换工具-UnicodeUtil

## 介绍

此工具主要针对类似于`\\u4e2d\\u6587`这类Unicode字符做一些特殊转换。

## 使用

### 字符串转Unicode符

```
//第二个参数true表示跳过ASCII字符（只跳过可见字符）
String s = UnicodeUtil.toUnicode("aaa123中文", true);
//结果aaa123\\u4e2d\\u6587
```

### Unicode转字符串

```
String str = "aaa\\U4e2d\\u6587\\u111\\urtyu\\u0026";
String res = UnicodeUtil.toString(str);
//结果aaa中文\\u111\\urtyu&
```

由于`\\u111`为非Unicode字符串，因此原样输出。

# 字符串切割-StrSplitter

## 由来

在Java的String对象中提供了split方法用于通过某种字符串分隔符来把一个字符串分割为数组。但是有的时候我们对这种操作有不同的要求，默认方法无法满足，这包括：

- 分割限制分割数
- 分割后每个字符串是否需要去掉两端空格
- 是否忽略空白片
- 根据固定长度分割
- 通过正则分隔

因此，`StrSplitter`应运而生。`StrSplitter`中全部为静态方法，方便快捷调用。

## 方法

### 基础方法

`split` 切分字符串，众多可选参数，返回结果为List `splitToArray` 切分字符串，返回结果为数组 `splitsplitByRegex` 根据正则切分字符串 `splitByLength` 根据固定长度切分字符串

栗子：

```java
String str1 = "a, ,efedsfs,   ddf";
//参数：被切分字符串，分隔符逗号，0表示无限制分片数，去除两边空格，忽略空白项
List<String> split = StrSplitter.split(str1, ',', 0, true, true);
```

### 特殊方法

`splitPath` 切分字符串，分隔符为"/" `splitPathToArray` 切分字符串，分隔符为"/"，返回数组。

# 注解工具-AnnotationUtil

## 介绍

封装了注解获取等方法的工具类。

## 使用

### 方法介绍

1. 注解获取相关方法：

- `getAnnotations` 获取指定类、方法、字段、构造等上的注解列表
- `getAnnotation` 获取指定类型注解
- `getAnnotationValue` 获取指定注解属性的值

例子：

我们定义一个注解：

```java
// Retention注解决定MyAnnotation注解的生命周期
@Retention(RetentionPolicy.RUNTIME)
// Target注解决定MyAnnotation注解可以加在哪些成分上，如加在类身上，或者属性身上，或者方法身上等成分
@Target({ ElementType.METHOD, ElementType.TYPE })
public @interface AnnotationForTest {
    
    /**
     * 注解的默认属性值
     * 
     * @return 属性值
     */
    String value();
}
```

给需要的类加上注解：

```java
@AnnotationForTest("测试")
public static class ClassWithAnnotation{

}
```

获取注解中的值：

```java
// value为"测试"
Object value = AnnotationUtil.getAnnotationValue(ClassWithAnnotation.class, AnnotationForTest.class);
```

1. 注解属性获取相关方法：

- `getRetentionPolicy` 获取注解类的保留时间，可选值 SOURCE（源码时），CLASS（编译时），RUNTIME（运行时），默认为 CLASS
- `getTargetType` 获取注解类可以用来修饰哪些程序元素，如 TYPE, METHOD, CONSTRUCTOR, FIELD, PARAMETER 等
- `isDocumented` 是否会保存到 Javadoc 文档中
- `isInherited` 是否可以被继承，默认为 false

更多方法见API文档：

https://apidoc.gitee.com/loolly/hutool/cn/hutool/core/annotation/AnnotationUtil.html

# 比较工具-CompareUtil

## 介绍

在JDK提供的比较器中，对于`null`的比较没有考虑，Hutool封装了相关比较，可选null是按照最大值还是最小值对待。

```java
// 当isNullGreater为true时，null始终最大，此处返回的compare > 0
int compare = CompareUtil.compare(null, "a", true);
// 当isNullGreater为false时，null始终最小，此处返回的compare < 0
int compare = CompareUtil.compare(null, "a", false);
```

# 版本比较器-VersionComparator

## 介绍

版本比较器用于比较版本号，支持的格式包括：

- x.x.x(1.3.20)
- x.x.yyyyMMdd(6.82.20160101)
- 带字母的版本(8.5a/8.5c)
- 带V的版本(V8.5)

## 使用

```java
// -1
int compare = VersionComparator.INSTANCE.compare("1.12.1", "1.12.1c");
// 1
int compare = VersionComparator.INSTANCE.compare("V0.0.20170102", "V0.0.20170101");
```



# 异常工具-ExceptionUtil

## 介绍

针对异常封装，例如包装为`RuntimeException`。

## 方法

### 包装异常

假设系统抛出一个非Runtime异常，我们需要包装为Runtime异常，那么：

```java
IORuntimeException e = ExceptionUtil.wrap(new IOException(), IORuntimeException.class);
```

### 获取入口方法

```java
StackTraceElement ele = ExceptionUtil.getRootStackElement();
// main
ele.getMethodName();
```

### 异常转换

如果我们想把异常转换指定异常为来自或者包含指定异常，那么：

```java
IOException ioException = new IOException();
IllegalArgumentException argumentException = new IllegalArgumentException(ioException);

IOException ioException1 = ExceptionUtil.convertFromOrSuppressedThrowable(argumentException, IOException.class, true);
```

### 其他方法

- `getMessage` 获得完整消息，包括异常名
- `wrapRuntime` 使用运行时异常包装编译异常
- `getCausedBy` 获取由指定异常类引起的异常
- `isCausedBy` 判断是否由指定异常类引起
- `stacktraceToString` 堆栈转为完整字符串

其它方法见API文档：

https://apidoc.gitee.com/dromara/hutool/cn/hutool/core/exceptions/ExceptionUtil.html

# 数学相关-MathUtil

## 介绍

此工具是NumberUtil的一个补充，NumberUtil偏向于简单数学计算的封装，MathUtil偏向复杂数学计算。

## 方法

1. 排列

- `arrangementCount` 计算排列数
- `arrangementSelect` 排列选择（从列表中选择n个排列）

1. 组合

- `combinationCount` 计算组合数，即C(n, m) = n!/((n-m)! * m!)
- `combinationSelect` 组合选择（从列表中选择n个组合）