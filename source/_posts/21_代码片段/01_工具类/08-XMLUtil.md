---
title: 08-XMLUtil
date: 2016-5-3 11:22:34
tags:
- 工具类
categories: 
- 21_代码片段
- 01_工具类
---



### XMLUtil - XML文件 生成&解析

* 依赖

```xml
<dependency>
    <groupId>org.dom4j</groupId>
    <artifactId>dom4j</artifactId>
    <version>2.1.3</version>
</dependency>
```

* 工具类

```java
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.dom4j.io.SAXWriter;

import java.io.ByteArrayInputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class XmlUtil {

    /**
     * 生成 XML
     * @return 字符串
     */
    public static String createXML(Map<String, String> map) {
        //StringBuffer buffer=new StringBuffer();
        //buffer.append("<xml>");
        //for(String k:map.keySet()){
        //    buffer.append("<"+k+">"+map.get(k)+"</"+k+">");
        //}
        //buffer.append("</xml>");
        //return buffer.toString();
        Document document = DocumentHelper.createDocument();
        Element root = document.addElement("xml");
        Set<String> keys = map.keySet();
        for (String k : keys) {
            Element child = root.addElement(k);
            //child.setText("<![CDATA["+map.get(k)+"]]");
            child.setText(map.get(k));
        }
        return document.asXML();
    }

    /**
     * 解析
     * @return Map<String, String>
     */
    public static Map<String, String> parseXml(String xml) {
        SAXReader reader = new SAXReader();
        try {
            Document document = reader.read(new ByteArrayInputStream(xml.getBytes()));
            //获取根节点
            Element root = document.getRootElement();
            List<Element> list = root.elements();
            Map<String, String> map = new HashMap<>();
            for (Element e : list) {
                map.put(e.getName(), e.getTextTrim());
            }
            return map;
        } catch (DocumentException e) {
            e.printStackTrace();
        }
        return null;
    }
}

```

