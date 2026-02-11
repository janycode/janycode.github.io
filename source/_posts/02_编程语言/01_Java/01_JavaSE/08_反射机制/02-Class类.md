---
title: 02-Class类
date: 2016-4-28 22:09:30
tags:
- JavaSE
- Class
- 反射
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 08_反射机制
---

位置：**java.lang.Class**

* 类对象，类的实例代表一个运行 类 java应用程序的类和接口。



```java
public final class Class<T>
    extends Object
    implements Serializable, GenericDeclaration, Type, AnnotatedElement
```
### 2.1 常用方法和示例
常用方法：
```java
String getName()
返回由 类对象表示的实体（类，接口，数组类，原始类型或空白）的名称，作为 String 。

static Class<?> forName(String className)
获取类对象名

Package getPackage()
获取类对象的包名

Class<? super T> getSuperclass()
获取父类的类对象名

Class<?>[] getInterfaces()
获取接口的类对象名

Constructor<?>[] getConstructors()
获取构造方法

Class<?>[] getParameterTypes()
获取方法(构造/成员)的参数类型列表

Field[] getFields()
获取属性（自身+父类的所有public公开属性）

Field[] getDeclaredFields()
获取属性（自身所有的属性）

Method[] getMethods()
获取方法（自身+父类单继承叠加的所有public公开方法）

Method[] getDeclaredMethods()
获取方法（自身所有的方法）

T newInstance()
创建由此类对象表示的类的新实例（此类对象必须有无参构造）。
```

方法使用示例：
```java
public class TestClassMethods {
      public static void main(String[] args) throws Exception {
            // 获取类对象
            Class<?> c = Class.forName("com.day.methods.Student");
            System.out.println(c.getName()); //  com.day.methods.Student
            
            // 获得指定类对象的包名
            Package pack = c.getPackage();
            System.out.println(pack.getName()); // com.day.methods
            
            // 获得父类的类对象
            Class<?> superClass = c.getSuperclass();
            System.out.println(superClass.getName()); //  com.day.methods.Person
            
            // 获得接口的类对象
            Class<?>[] interfaces = c.getInterfaces();
            for (Class<?> inter : interfaces) {
                  // java.io.Serializable java.lang.Runnable  java.lang.Comparable
                  System.out.print(inter.getName() + " ");
            }
            
            // 获取属性(自身+父类的public公开属性)
            Field[] fields = c.getFields();
            for (Field field : fields) {
                  System.out.print(field.getName() + " "); // name age  name money
            }
            // 获取属性(自身所有的属性)
            Field[] fields2 = c.getDeclaredFields();
            for (Field field : fields2) {
                  System.out.print(field.getName() + " "); // name age  score
            }
            System.out.println("\n---------------------");
            
            // 获取方法(自身+父类单继承叠加的所有public公开方法)
            Method[] methods = c.getMethods();
            for (Method method : methods) {
                  // run compareTo exam play sleep eat wait wait wait  equals toString hashCode getClass notify notifyAll
                  System.out.print(method.getName() + " ");
            }
            System.out.println("\n---------------------");
            
            // 获取方法(自身所有的方法)
            Method[] methods2 = c.getDeclaredMethods();
            for (Method method : methods2) {
                  // run:void compareTo:int play:void exam:void
                  System.out.println(method.getName() + ":" +  method.getReturnType());
            }
            System.out.println("*************************");
            
            // 获取构造方法
            Constructor<?>[] cs = c.getConstructors();
            for (Constructor<?> cc : cs) {
                  // com.day.methods.Student:java.lang.String int
                  // com.day.methods.Student:java.lang.String
                  // com.day.methods.Student: (无参构造)
                  System.out.print(cc.getName() + ":");
                  Class<?>[] param = cc.getParameterTypes();
                  for (Class<?> p : param) {
                        System.out.print(p.getName() + " ");
                  }
                  System.out.println();
            }
            System.out.println();
            
            // new一个实例对象（必须要有无参构造）
            Object o = c.newInstance();
            Student stu = (Student)o;
            System.out.println(stu); //  com.day.methods.Student@3d4eac69
      }
}
class Person {
      public String name;
      public double money;
      public Person() {}
      public void eat() {}
      public void sleep() {}
}
@SuppressWarnings({ "serial", "rawtypes" })
class Student extends Person implements Serializable, Runnable,  Comparable{
      public String name;
      public int age;
      double score;
      
      public Student() {super();}
      public Student(String name) {}
      public Student(String name, int age) {}
      
      public void exam() {}
      public void play() {}
      @Override
      public void run() {}
      @Override
      public int compareTo(Object o) { return 0; }
}
```

### 2.2 获取Class对象的 3 种方法
① 通过类的对象，获取Class对象
② 通过类名获取一个Class对象
③ **通过Class的静态方法forName()获取类对象** 【最具普适性】
```java
public class TestGetClassObject {
      public static void main(String[] args) throws  ClassNotFoundException {
            // 1.通过类的对象，获取Class对象
            Person p = new Person(); // 类的对象
            Class<? extends Person> c = p.getClass();
            System.out.println(c.getName());
            
            // 2.通过类名获取一个Class对象
            Class<Person> c2 = Person.class;
            System.out.println(c2.getName());
            
            // 3.通过Class的静态方法获取类对象 【最具普适性】
            Class<?> c3 = Class.forName("com.day.reflect.Person");
            System.out.println(c3.getName());
      }
      // 更通用的获取类对象的方法
      public static Class<?> getClassObject(String className) {
            Class<?> c = null;
            try {
                  c = Class.forName(className);
            } catch (ClassNotFoundException e) {
                  e.printStackTrace();
            }
            return c;
      }
}
class Person {
}
```

### 2.3 反射创建对象的 2 种方法
① 反射通过类对象创建类的对象
② **方法传参返回对象**【普适性】
```java
public class TestNewInstance {
      public static void main(String[] args) throws Exception {
            // 手工new对象
            Teacher t = new Teacher();
            t.name = "JJ";
            System.out.println(t.name);
            
            // 1.反射通过类对象创建类的对象
            Class<?> c = Class.forName("com.day.methods.Teacher");
            Teacher t2 = (Teacher)c.newInstance();
            t2.name = "Jerry";
            System.out.println(t2.name);
            
            // 2.方法传参返回对象【普适性】
            Teacher t3 =  (Teacher)createObject("com.day.methods.Teacher");
            System.out.println(t3);
      }
      
      public static Object createObject(String className) {
            try {
                  Class<?> c = Class.forName(className);
                  return c.newInstance();
            } catch (Exception e) {
                  e.printStackTrace();
            }
            return null;
      }
}
class Teacher {
      String name;
      public Teacher() { }
}
```