---
title: 03-高性能Excel工具
date: 2018-5-13 21:36:21
tags:
- 第三方
- Aliyun
categories: 
- 13_第三方
- 02_Aliyun
---



参考资料：

easyexcel官网：[https://easyexcel.opensource.alibaba.com/](https://easyexcel.opensource.alibaba.com/)



### **什么是alibaba-easyexcel**

EasyExcel是阿里巴巴开源的一个excel处理框架，**以使用简单、节省内存著称**。EasyExcel能大大减少占用内存的主要原因是在解析Excel时没有将文件数据一次性全部加载到内存中，而是从磁盘上一行行读取数据，逐个解析。

![image-20230227162848588](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230227162849.png)

**其他的Excel处理工具：**

Java领域解析、生成Excel比较有名的框架有Apache poi、jxl等

**alibaba-easyexcel与其它框架的区别：**

Apache poi、jxl等处理Excel的框架，他们都存在一个严重的问题就是非常的耗内存。如果你的系统并发量不大的话可能还行，但是一旦并发上来后一定会OOM或者JVM频繁的full gc。而EasyExcel采用一行一行的解析模式，并将一行的解析结果以观察者的模式通知处理（AnalysisEventListener）。

### pom依赖

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>easyexcel</artifactId>
    <version>2.1.7</version>
</dependency>
```

**1、创建demo**

**2、导入pom依赖**

```xml
<dependencies>

    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>easyexcel</artifactId>
        <version>2.1.7</version>
    </dependency>

    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-simple</artifactId>
        <version>1.7.5</version>
    </dependency>

    <dependency>
        <groupId>org.apache.xmlbeans</groupId>
        <artifactId>xmlbeans</artifactId>
        <version>3.1.0</version>
    </dependency>

    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.12</version>
    </dependency>

    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
    </dependency>

</dependencies>
```

**2、创建pojo**

```java
import com.alibaba.excel.annotation.ExcelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data//生成get、set方法
@NoArgsConstructor//生成无参构造
@AllArgsConstructor//生成有参构造
public class ExcelOrder {

    // @ExcelProperty：指定当前字段对应excel中的那一列。
    @ExcelProperty("订单编号")
    private String orderId;//订单编号

    @ExcelProperty("商品名称")
    private String tradeName;//商品名称

    @ExcelProperty("成本价")
    private Double costPrice;//成本价

    @ExcelProperty("销售价")
    private Double sellingPrice;//销售价
}
```

### **写入数据**

```java
import com.alibaba.excel.EasyExcel;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


public class ExcelWriteTest {

    @Test
    public void excelWrite(){
        //1、创建一个文件对象
        File excelFile = new File("./订单表.xlsx");
        //2、判断文件是否存在，不存在则创建一个Excel文件
        if (!excelFile.exists()) {
            try {
                excelFile.createNewFile();//创建一个新的文件
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        //3、指定需要那个class去写。然后写到第一个sheet，名字为模版，然后文件流会自动关闭
        EasyExcel.write(excelFile, ExcelOrder.class).sheet("订单模版").doWrite(data());
    }

    private List<ExcelOrder> data(){
        //创建一个List集合
        List excelOrderList = new ArrayList<>();

        /*
         *xls版本的Excel最多一次可写0 ...65535行
         * xlsx 版本的Excel最多一次可写0...1048575行
         */
        //超出报异常：java.lang.IllegalArgumentException: Invalid row number (65536) outside allowable range (0..65535)
        for (int i=0;i<65535;i++){
            ExcelOrder data = new ExcelOrder();
            data.setOrderId("20220224"+(i+1));
            data.setTradeName("商品名称"+i);
            data.setCostPrice(i+5.0);
            data.setSellingPrice(i+10.0);
            excelOrderList.add(data);
        }

        return excelOrderList;//返回list集合
    }
}
```

结果展示：

![image-20230227162339968](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230227162340.png)

### **读取数据**

1)、创建监听器

```java
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.event.AnalysisEventListener;
import lombok.extern.slf4j.Slf4j;

/***
 *
 * 监听器
 *
 ***/
@Slf4j
public class EasyExcelOrderListener extends AnalysisEventListener<ExcelOrder> {

    /**
     * 此方法每一条数据解析都会来调用
     *
     * @param data
     * @param context
     */
    @Override
    public void invoke(ExcelOrder data, AnalysisContext context) {
        log.info("解析到一条数据："+data);
    }

    /**
     * 所有数据解析完成都会来调用
     *
     * @param context
     */
    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        log.info("所有数据解析完成！！！");
    }
}
```

2)、读取

```java
import com.alibaba.excel.EasyExcel;
import org.junit.Test;

/***
 *
 * easyExcel测试类
 *
 ***/
public class ExcelReadTest {

    @Test
    public void excelRead(){
        String fileName = "./订单表.xlsx";//文件路径
        //默认读取第一个sheet
        EasyExcel.read(fileName, ExcelOrder.class,new EasyExcelOrderListener()).sheet().doRead();
    }
}
```



扩展阅读：

[100000 行级别数据的 Excel 导入优化之路](https://mp.weixin.qq.com/s/yMrhs7r6xvXQ-iXCRsT3og)



### 读取数据-Demo

上传方法：

```java
	@Override
    public void uploadBatch(CaseExcelReq req, String key) {
        String wxCorpId = SecurityUser.getWxCorpId();
        Long userId = SecurityUser.getUserId();
        String excelUrl = req.getExcelUrl();
        log.info("开始解析excel: uploadBatch -> wxCorpId = {}, key = {}, excelUrl = {}", wxCorpId, key, excelUrl);
        if (!(excelUrl.endsWith(ExcelTypeEnum.XLSX.getValue()) || excelUrl.endsWith(ExcelTypeEnum.XLS.getValue()))) {
            log.info("uploadBatch -> excel 格式有误！");
            return;
        }

        Long logId = jsonStoreService.generatorStoreId();
        CaseExcelUploadLogEntity entity = new CaseExcelUploadLogEntity();
        entity.setId(logId);
        entity.setFileName(req.getFileName());
        entity.setExcelUrl(excelUrl);
        entity.setStatus(1);
        entity.setCreator(userId);
        entity.setCreatorName(sysUserService.get(userId).getRealName());
        entity.setCreateDate(DateUtil.date());
        caseExcelUploadLogService.save(entity);
        log.info("uploadBatch: 存储成功解析中的状态实体 entity -> {}", entity);

        doExcelParse(excelUrl, wxCorpId, userId, logId, key);

    }
```

异步调用：

```java
    @Override
    public void doExcelParse(String excelUrl, String wxCorpId, Long userId, Long logId, String key) {
        log.info("开始异步解析表格: traceId -> {}", key);
        //线程最大允许超时时间单位：分钟
        CompletableFuture<Void> future = CompletableAsyncUtil.run(30, TimeUnit.MINUTES, () -> {
            TraceIdGenerator.setTraceId(key);

            InputStream inputStream = null;
            try {
                inputStream = sysOssService.download(excelUrl);
                if (Objects.isNull(inputStream)) {
                    throw new RenException("未读取到对应的文件信息");
                }
                //调用EasyExcel的read方法，传入输入流、Sheet对象和监听器，通过监听器存数据入库
                EasyExcel.read(inputStream, CaseExcelFeildDTO.class, new CaseBaseInfoDataListener(this, excelUrl, excelImportLimitCount, userId, wxCorpId, logId))
                        .sheet()            //默认第1个sheet
                        .headRowNumber(2)   //表头行号为2，数据则从第3行开始取
                        .doRead();

                TraceIdGenerator.removeTraceId();
            } catch (Exception e) {
                log.error("uploadBatch 上传excel解析失败：error -> {}", e.getMessage(), e);
            } finally {
                if (Objects.nonNull(inputStream)) {
                    try {
                        inputStream.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        });
        //等待线程执行完毕
        //CompletableFutureUtil.allOf(future);
    }
```

解析类：

```java
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.event.AnalysisEventListener;
import com.alibaba.excel.exception.ExcelAnalysisException;
import com.alibaba.fastjson.JSON;
import com.google.common.collect.Lists;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

@Slf4j
public class CaseBaseInfoDataListener extends AnalysisEventListener<CaseExcelFeildDTO> {
    private List<CaseExcelFeildDTO> cachedDataList;
    private CaseBaseInfoService caseBaseInfoService;
    private String excelUrl;
    private Integer limitCount;
    private String wxCorpId;
    private Long userId;
    private Long logId;

    public CaseBaseInfoDataListener(CaseBaseInfoService service, String excelUrl, Integer limit, Long userId, String wxCorpId, Long logId) {
        log.info("CaseBaseInfoDataListener init: service={}, limit={}, wxCorpId={}", service, limit, wxCorpId);
        this.caseBaseInfoService = service;
        this.excelUrl = excelUrl;
        this.limitCount = limit;
        this.wxCorpId = wxCorpId;
        this.userId = userId;
        this.logId = logId;
        //为了校验超过 limit 值，需要 +1 操作，防止下标越界
        cachedDataList = Lists.newArrayListWithCapacity(this.limitCount + 1);
    }

    @Override
    public void invoke(CaseExcelFeildDTO data, AnalysisContext analysisContext) {
        log.info("invoke() 解析到一条数据：{}", JSON.toJSONString(data));
        cachedDataList.add(data);
        if (cachedDataList.size() > limitCount) {
            String msg = "最大支持导入的条数为" + limitCount + "条！";
            //入库失败原因和状态
            caseBaseInfoService.updateFailLog(Lists.newArrayList(msg), logId);

            log.warn(msg);

            //异常必须抛出去，才会终止后续逻辑
            throw new ExcelAnalysisException(msg);
        }
    }

    @Override
    public void doAfterAllAnalysed(AnalysisContext analysisContext) {
        log.info("所有数据【解析】完成！");
        this.saveData();
        log.info("所有数据【保存】完成！");
    }

    /**
     * 存储数据库
     *
     * @author Jerry(姜源)
     * @date 2023/10/09 09:32
     */
    private void saveData() {
        boolean res = caseBaseInfoService.saveBatchFromExcel(cachedDataList, excelUrl, userId, wxCorpId, logId);
        log.info(res ? "存储数据库成功！" : "存储数据库失败！");
    }
}
```



