---
title: 04-File文件读写
date: 2016-4-28 22:03:43
tags:
- JavaSE
- File
categories: 
- 02_编程语言
- 01_Java
- 01_JavaSE
- 06_文件和流
---

### 1. File类

文件和目录路径名的抽象表示形式，主要用于`获取文件的相关属性以及创建文件或目录`。

```java
public class File
    extends Object
    implements Serializable, Comparable<File>
```
构造方法：没有无参构造。

```java
File(File parent, String child)
从父抽象路径名和子路径名字符串创建新的 File实例。
File(String pathname)
通过将给定的路径名字符串转换为抽象路径名来创建新的 File实例。
File(String parent, String child)
从父路径名字符串和子路径名字符串创建新的 File实例。
File(URI uri)
通过将给定的 file: URI转换为抽象路径名来创建新的 File实例。
```
常用方法：参考File类 jdk1.8 API
部分常用方法演示：
```java
public class TestFiles {
      public static void main(String[] args) throws IOException,  Exception {
            File file = new File("files\\test\\target.txt");
            System.out.println(file.canExecute()); // 该文件/目录可执行
            System.out.println(file.canWrite()); // 该文件可写
            System.out.println(file.canRead()); // 该文件可读
            System.out.println(file.createNewFile()); // 受查异常：如果不存在，新建该文件
            System.out.println(file.delete()); // 删除该文件(如果文件存在)
            Thread.sleep(2000);
            file.deleteOnExit(); // JVM终止时，执行删除文件
            System.out.println(file.exists()); // 该文件存在，于createNewFile()结合使用
            
            System.out.println(file.getFreeSpace()/1024/1024/1024 +  "GB"); // 获取硬盘的空闲空间(计算为GB)
            System.out.println(file.getTotalSpace()/1024/1024/1024 +  "GB"); // 获取硬盘总空间(计算为GB)
            System.out.println(file.getAbsolutePath()); // 获取绝对路径字符串
            System.out.println(file.getPath()); // 获取相对路径字符串
            System.out.println(file.getName()); // 获取文件名：文件名.后缀名
            System.out.println(file.getParent()); // 获取父目录
            
            System.out.println(file.isDirectory()); // 文件目录判断
            System.out.println(file.isFile()); // 标准文件判断
            System.out.println(file.isHidden()); // 隐藏文件判断
            
            // 文件最后一次修改时间(long类型的毫秒值)
            System.out.println((System.currentTimeMillis()-file.lastModified()) /  1000 / 60); // xx分钟前修改的
            System.out.println(file.length()); // 文件内容的字节
            
            file.mkdirs(); // 将file中指定的路径全部创建为目录
            System.out.println(file);
      }
}
```

### 2. FileFilter接口
FileFilter接口：`实现按条件过滤指定文件`
```java
public interface FileFilter {
    //测试指定的抽象路径名是否应包含在某个路径列表
    boolean accept(File pathname);
}
```
* 当调用File类中的 listFiles() 方法时，支持传入 FileFilter 接口的实现类对象，对获取文件进行过滤，只有满足条件的文件才可出现在listFiles()的返回值中。——接口回调。

### 3. 统计指定类型文件

```java
public class TestShowAllFiles {
      static int fileCount = 0;
      
      public static void main(String[] args) {
            // 遍历E盘下，所有的.class结尾的文件
            File file = new File("E:\\");
            showAll(file);
            System.out.println("一共有 " + fileCount + " 个.class文件");
      }
      
      public static void showAll(File dir) {
            // 实现FileFilter接口的匿名内部类，作为过滤参数传入
            File[] files = dir.listFiles( new FileFilter() {
                  @Override
                  public boolean accept(File pathname) {
                        if (pathname.isDirectory()) {
                              return true; // 文件夹保存
                        }
                        
                        if (pathname.isFile()) {
                              if  (pathname.getName().endsWith(".class")) {
                                    return true; // 文件
                              }
                        }
                        return false;
                  }
            });
            
            // 避免遍历到结尾抛出空指针异常（因为空目录也会被保存到数组）
            if (files != null) {
                  for (File f : files) {
                        if (f.isFile()) { // 符合规则的文件，则输出
                              System.out.println(f.getName());
                              fileCount++;
                        } else { // 子目录，则遍历
                              showAll(f);
                        }
                  }
            }
      }
}
```