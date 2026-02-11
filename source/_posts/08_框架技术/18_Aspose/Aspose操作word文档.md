---
title: Aspose操作word文档
date: 2023-09-23 15:32:29
tags:
- doc
- docx
- word
- aspose
categories:
- 08_框架技术
- 18_Aspose
---



参考资料：https://reference.aspose.com/tutorials/words/zh/java/



### 1. 依赖jar

```xml
<!-- aspose -->
<dependency>
    <groupId>com.aspose</groupId>
    <artifactId>aspose-words</artifactId>
    <version>16.8.0</version>
</dependency>
<dependency>
    <groupId>com.aspose</groupId>
    <artifactId>aspose-cells</artifactId>
    <version>8.5.2</version>
</dependency>
<dependency>
    <groupId>com.aspose</groupId>
    <artifactId>aspose-pdf</artifactId>
    <version>21.10</version>
</dependency>
```

### 2. 初始化

```java
import com.aspose.words.License;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.InputStream;

@Slf4j
@Configuration
public class InitAsposeWord {

    @PostConstruct
    public void init() throws Exception {
        InputStream resourceAsStream = InitAsposeWord.class.getClassLoader().getResourceAsStream("aspose-words-license.xml");
        License license = new License();
        license.setLicense(resourceAsStream);
        if (license.getIsLicensed()) {
            log.info("Aspose.Words for Java License Is Set");
        } else {
            log.error("Aspose.Words for Java License Is Not Set");
            throw new Exception("Aspose.Words for Java License Is Not Set");
        }
    }
}
```

resources/aspose-words-license.xml

```xml
<License>
    <Data>
        <Products>
            <Product>Aspose.Total for Java</Product>
            <Product>Aspose.Words for Java</Product>
        </Products>
        <EditionType>Enterprise</EditionType>
        <SubscriptionExpiry>20991231</SubscriptionExpiry>
        <LicenseExpiry>20991231</LicenseExpiry>
        <SerialNumber>8bfe198c-7f0c-4ef8-8ff0-acc3237bf0d7</SerialNumber>
    </Data>
    <Signature>
        sNLLKGMUdF0r8O1kKilWAGdgfs2BvJb/2Xp8p5iuDVfZXmhppo+d0Ran1P9TKdjV4ABwAgKXxJ3jcQTqE/2IRfqwnPf8itN8aFZlV3TJPYeD3yWE7IT55Gz6EijUpC7aKeoohTb4w2fpox58wWoF3SNp6sK6jDfiAUGEHYJ9pjU=
    </Signature>
</License>
```

> 针对 16.8.0 的破解版。

### 3. 验证生成文档

```java
package com.demo.mytest.aspose.doc;

import com.aspose.words.*;
import com.aspose.words.Font;
import com.demo.mytest.aspose.config.InitAsposeWord;
import lombok.extern.slf4j.Slf4j;

import java.awt.*;
import java.io.InputStream;

@Slf4j
public class DocumentGenerator {
    public static void main(String[] args) throws Exception {
        //加载license
        init();
        //创建一个新的Word文档
        Document doc = new Document();
        //添加文本到文档
        DocumentBuilder builder = new DocumentBuilder(doc);
        builder.writeln("Hello, world!~111");
        //创建 H1
        builder.getParagraphFormat().setStyleIdentifier(StyleIdentifier.HEADING_1);
        builder.writeln("Heading 1");
        builder.writeln("Hello, world!~222");
        builder.getParagraphFormat().setAlignment(ParagraphAlignment.CENTER);
        builder.getParagraphFormat().setFirstLineIndent(20);
        builder.getParagraphFormat().setLineSpacing(12.0);
        builder.writeln("Hello, world!~333");
        //创建H2
        builder.getParagraphFormat().setStyleIdentifier(StyleIdentifier.HEADING_2);
        builder.writeln("Heading 2");
        builder.writeln("Hello, world!~444");
        //将图像插入文档中
        builder.insertImage("/Users/jiangmoumou/IdeaProjects/mytest/mytest/src/main/resources/img/image.jpg");
        //将表格添加到文档中
        Table table = builder.startTable();
        builder.insertCell();
        builder.write("Row 1, Cell 1");
        builder.insertCell();
        builder.write("Row 1, Cell 2");
        builder.endRow();
        builder.insertCell();
        builder.write("Row 2, Cell 1");
        builder.insertCell();
        builder.write("Row 2, Cell 2");
        builder.endTable();
        //将格式应用于文本
        Font font = builder.getFont();
        font.setSize(16);
        font.setBold(true);
        font.setColor(Color.BLUE);
        //将格式应用于段落
        ParagraphFormat format = builder.getParagraphFormat();
        format.setAlignment(ParagraphAlignment.CENTER);
        //保存文档
        doc.save("output.docx");
    }

    public static void init() throws Exception {
        InputStream resourceAsStream = InitAsposeWord.class.getClassLoader().getResourceAsStream("aspose-words-license.xml");
        License license = new License();
        license.setLicense(resourceAsStream);
        if (license.getIsLicensed()) {
            log.info("Aspose.Words for Java License Is Set");
        } else {
            log.error("Aspose.Words for Java License Is Not Set");
            throw new Exception("Aspose.Words for Java License Is Not Set");
        }
    }
}
```

### 4. 实战使用

> 根据模版将模版中的 $通配符$ 替换为实际需要的文本。

```java
import cn.hutool.json.JSONUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.aspose.words.*;
import com.google.common.collect.Lists;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.File;
import java.io.FileInputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 模板文档服务impl
 *
 * @author Jerry(姜源)
 * @date 2023/09/09 15:17
 */
@Slf4j
@Service
public class TemplateDocServiceImpl implements TemplateDocService {

    @Resource
    private SysOssService sysOssService;

    /**
     * 根据阶段填充模板文档
     *
     * @param reportDTO    报告dto
     * @param templateList 模板列表
     * @return {@link List }<{@link FileDto }>
     * @author Jerry(姜源)
     * @date 2023/09/12 10:49
     */
    @Override
    public List<FileDto> fillTemplateDoc(ReportDTO reportDTO, List<RoomReportFileTemplateEntity> templateList) {
        //遍历url进行填充: 转结构化json字符串
        String structStr = JSONUtil.toJsonStr(reportDTO);
        log.info("填充模版文档结构化字符串: fillTemplateDoc structStr -> {}", structStr);

        List<FileDto> fileDtoList = Lists.newArrayList();
        for (RoomReportFileTemplateEntity template : templateList) {
            if (template.getTemplateType() == 0) {
                continue;
            }
            String templateName = template.getTemplateName();
            String templateDocExt = template.getTemplateDocExt();
            String filename = templateName + "." + templateDocExt;
            String templateDocUrl = template.getTemplateDocUrl();

            //填充模版核心逻辑
            String ossUrl = writeDoc(structStr, filename, templateDocUrl);

            FileDto fileDto = new FileDto();
            fileDto.setFileName(templateName);
            fileDto.setFileExt(templateDocExt);
            fileDto.setFileSize(FileUtil.getFileSize(ossUrl));
            fileDto.setFileUrl(ossUrl);
            fileDtoList.add(fileDto);
        }
        log.info("填充模版文档结果：fileDtoList -> {}", JSONUtil.toJsonStr(fileDtoList));
        return fileDtoList;
    }

    private String writeDoc(String structStr, String filename, String templateUrl) {
        String url = "";
        try {
            log.info("开始书写入文档: structStr:{}, filename:{}, templateUrl:{}", structStr, filename, templateUrl);
            String path = FileUtil.downloadFile(templateUrl, LocalDateTime.now().getNano() + FileTypeEnum.docx.getSuffix());
            Document document = new Document(new FileInputStream(path));
            //写入文档
            dealDoc(structStr, document);
            String fullFileName = FileUtil.BASE_DIR + filename;
            document.save(fullFileName);
            //上传OSS
            url = sysOssService.uploadSuffix(new File(fullFileName));
            log.info("上传OSS地址: url -> {}", url);
            //删除临时文件
            CompletableFutureUtil.supplyAsync(Lists.newArrayList(path), FileUtil::deleteFile);
        } catch (Exception e) {
            log.error("下载模版文档发生异常: {}", e.getMessage(), e);
        }
        return url;
    }

    private void dealDoc(String structStr, Document document) throws Exception {
        JSONObject jsonObject = JSON.parseObject(structStr);
        document.stopTrackRevisions();

        FindReplaceOptions options = new FindReplaceOptions();
        NodeCollection paragraphs = document.getChildNodes(NodeType.PARAGRAPH, true);
        // 循环遍历段落，整理模版
        log.info("开始遍历段落整理模版: {}", paragraphs.getCount());
        for (int i = 0; i < paragraphs.getCount(); i++) {
            Paragraph node = (Paragraph) paragraphs.get(i);
            String text = node.getRange().getText();
            String regex = "\\$(.*?)\\$";
            Matcher matcher = Pattern.compile(regex).matcher(text);
            if (matcher.find()) {
                String match = matcher.group(1);
                Object o = jsonObject.get(match);
                if (o instanceof JSONArray) {
                    JSONArray arr = (JSONArray) o;
                    if (arr.size() > 1) {
                        for (int arrIndex = arr.size() - 1; arrIndex >= 0; arrIndex--) {
                            // 创建一个新段落
                            Paragraph newParagraph = (Paragraph) node.deepClone(true);
                            // 添加一个分段符
                            newParagraph.getRange().replace(match, match + (arrIndex + 1), options);
                            // 将新段落插入到第一个节的段落集合中
                            document.getSections().get(0).getBody().insertAfter(newParagraph, node);
                            i++;
                        }
                        document.getSections().get(0).getBody().removeChild(node);
                    }
                }
            }
        }

        //替换内容
        log.info("替换模版内容: json -> {}", jsonObject.toJSONString());
        for (String s : jsonObject.keySet()) {
            Object o = jsonObject.get(s);
            if (o instanceof JSONArray) {
                JSONArray arr = (JSONArray) o;
                if (arr.size() > 1) {
                    for (int i = 0; i < arr.size(); i++) {
                        document.getRange().replace("$" + s + (i + 1) + "$", arr.get(i).toString(), options);
                    }
                } else {
                    document.getRange().replace("$" + s + "$", arr.get(0).toString(), options);
                }
            } else {
                document.getRange().replace("$" + s + "$", o.toString(), options);
            }
        }
    }
}
```

