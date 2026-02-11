---
title: 10-ExcelUtil
date: 2020-9-3 22:30:01
tags:
- 工具类
categories: 
- 21_代码片段
- 01_工具类
---



### Excel快速导出

```java
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Excel快速导出
 *
 * @author Jerry(姜源)
 * @date 20/9/3 20:15
 */
@SuppressWarnings("all")
public class ExcelUtil {

    /*
     * 导出数据
     */
    public static OutputStream export(String title, String[] columnNames, List<Map> dataList) throws Exception {
        try {
            HSSFWorkbook workbook = new HSSFWorkbook(); //创建工作簿对象
            HSSFSheet sheet = workbook.createSheet(title); //创建工作表

            HSSFRow rowm = sheet.createRow(0);  //产生表格标题行
            HSSFCell cellTiltle = rowm.createCell(0);   //创建表格标题列
            cellTiltle.setCellValue(title);     //设置标题行值
            //合并表格标题行，合并列数为列名的长度,第一个0为起始行号，第二个1为终止行号，第三个0为起始列好，第四个参数为终止列号
            sheet.addMergedRegion(new CellRangeAddress(0, 1, 0, (columnNames.length - 1)));
            HSSFCellStyle columnTopStyle = getColumnTopStyle(workbook);//获取列头样式对象
            HSSFCellStyle style = getStyle(workbook); //获取单元格样式对象
            cellTiltle.setCellStyle(columnTopStyle);    //设置标题行样式

            int columnNum = columnNames.length;     //定义所需列数
            HSSFRow rowRowName = sheet.createRow(2); //在索引2的位置创建行(最顶端的行开始的第二行)
            //if (hasMoreHeader) {
            //   for (int i = 0; i < columnNames.length - 2; i++)
            //       sheet.addMergedRegion(new CellRangeAddress(2, 3, i, i));
            //}
            //将列头设置到sheet的单元格中
            for (int n = 0; n < columnNum; n++) {
                HSSFCell cellRowName = rowRowName.createCell(n); //创建列头对应个数的单元格
                cellRowName.setCellType(CellType.STRING); //设置列头单元格的数据类型
                HSSFRichTextString text = new HSSFRichTextString(columnNames[n]);
                cellRowName.setCellValue(text); //设置列头单元格的值
                cellRowName.setCellStyle(columnTopStyle); //设置列头单元格样式
            }

            //将查询出的数据设置到sheet对应的单元格中
            for (int i = 0; i < dataList.size(); i++) {
                Map obj = dataList.get(i);   //遍历每个对象

                Integer rowNum = i + 3;
                HSSFRow row = sheet.createRow(rowNum);   //创建所需的行数

                Integer j = 0;
                for (Object key : obj.keySet()) {

                    Object val = obj.get(key.toString());
                    if (val == null) {
                        val = "";
                    }

                    HSSFCell cell = row.createCell(j, CellType.STRING);
                    cell.setCellValue(val.toString());
                    cell.setCellStyle(style); //设置单元格样式
                    j++;
                }
            }

            //让列宽随着导出的列长自动适应
            for (int colNum = 0; colNum < columnNum; colNum++) {
                int columnWidth = sheet.getColumnWidth(colNum) / 256;
                for (int rowNum = 0; rowNum < sheet.getLastRowNum(); rowNum++) {
                    HSSFRow currentRow;
                    //当前行未被使用过
                    if (sheet.getRow(rowNum) == null) {
                        currentRow = sheet.createRow(rowNum);
                    } else {
                        currentRow = sheet.getRow(rowNum);
                    }
                    if (currentRow.getCell(colNum) != null) {
                        HSSFCell currentCell = currentRow.getCell(colNum);
                        if (currentCell.getCellType() == CellType.STRING) {
                            int length = currentCell.getStringCellValue()
                                    .getBytes().length;
                            if (columnWidth < length) {
                                columnWidth = length;
                            }
                        }
                    }
                }
                if (colNum == 0) {
                    sheet.setColumnWidth(colNum, (columnWidth - 2) * 256);
                } else {
                    sheet.setColumnWidth(colNum, (columnWidth + 4) * 256);
                }
            }

            OutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static OutputStream export(String title, List<Map<String, String>> configs, List<Map> dataList) throws Exception {
        try {
            HSSFWorkbook workbook = new HSSFWorkbook(); //创建工作簿对象
            HSSFSheet sheet = workbook.createSheet(title); //创建工作表

            HSSFRow rowm = sheet.createRow(0);  //产生表格标题行
            HSSFCell cellTiltle = rowm.createCell(0);   //创建表格标题列
            cellTiltle.setCellValue(title);     //设置标题行值
            //合并表格标题行，合并列数为列名的长度,第一个0为起始行号，第二个1为终止行号，第三个0为起始列好，第四个参数为终止列号
            sheet.addMergedRegion(new CellRangeAddress(0, 1, 0, configs.size() - 1));
            HSSFCellStyle columnTopStyle = getColumnTopStyle(workbook);//获取列头样式对象
            HSSFCellStyle style = getStyle(workbook); //获取单元格样式对象
            cellTiltle.setCellStyle(columnTopStyle);    //设置标题行样式

            int columnNum = configs.size();     //定义所需列数
            HSSFRow rowRowName = sheet.createRow(2); //在索引2的位置创建行(最顶端的行开始的第二行)

            //将列头设置到sheet的单元格中
            for (int n = 0; n < columnNum; n++) {

                HSSFCell cellRowName = rowRowName.createCell(n); //创建列头对应个数的单元格
                cellRowName.setCellType(CellType.STRING); //设置列头单元格的数据类型
                HSSFRichTextString text = new HSSFRichTextString(configs.get(n).get("cloumnName"));
                cellRowName.setCellValue(text); //设置列头单元格的值
                cellRowName.setCellStyle(columnTopStyle); //设置列头单元格样式
            }

            //将查询出的数据设置到sheet对应的单元格中
            for (int i = 0; i < dataList.size(); i++) {
                Map obj = dataList.get(i);   //遍历每个对象

                Integer rowNum = i + 3;
                HSSFRow row = sheet.createRow(rowNum);   //创建所需的行数
                Integer j = 0;

                for (Map<String, String> map : configs) {
                    String columnvalue = map.get("cloumnFiledName");
                    Object value = obj.get(columnvalue);

                    if (!ObjectUtils.isEmpty(value)) {
                        /* 地区编码处理 */
                        if ("recvaddrProvince".equals(columnvalue)) {
                            value = DictUtil.getAreaName(value);
                        }
                        if ("recvaddrCity".equals(columnvalue)) {
                            value = DictUtil.getAreaName(value);
                        }
                        if ("recvaddrRegion".equals(columnvalue)) {
                            value = DictUtil.getAreaName(value);
                        }

                        /*商品集合名称处理*/
                        if ("lproductMaps".equals(columnvalue)) {
                            StringBuffer products = new StringBuffer();
                            try {
                                JSONArray array = JSONUtils.toJSONArray(value.toString());
                                for (int v = 0; v < array.length(); v++) {
                                    Map productMap = array.getMap(v);
                                    if (v > 0) {
                                        products.append(",");
                                    }
                                    products.append(productMap.get("lproductName").toString());
                                }
                            } catch (Exception e) {
                            }
                            value = products.toString();
                        }

                        /* 订单类型处理 */
                        if ("orderType".equals(columnvalue)) {
                            if (value.equals(AcEnum.OrderType.FREE.getCode())) {
                                value = AcEnum.OrderType.FREE.getName();
                            } else if (value.equals(AcEnum.OrderType.NOTFREE.getCode())) {
                                value = AcEnum.OrderType.NOTFREE.getName();
                            }
                        }

                        /* 订单状态处理 */
                        if ("orderStatus".equals(columnvalue)) {
                            if (value.equals(AcEnum.OrderStatus.SUCCESS.getCode())) {
                                value = AcEnum.OrderStatus.SUCCESS.getName();
                            } else if (value.equals(AcEnum.OrderStatus.INVALID.getCode())) {
                                value = AcEnum.OrderStatus.INVALID.getName();
                            } else if (value.equals(AcEnum.OrderStatus.WAIT.getCode())) {
                                value = AcEnum.OrderStatus.WAIT.getName();
                            }
                        }

                        /* 金额处理 */
                        if ("orderPostage".equals(columnvalue) || "orderPayamount".equals(columnvalue)) {
                            BigDecimal price = new BigDecimal(value.toString());
                            if (price.compareTo(BigDecimal.ZERO) > 0) {
                                value = price.divide(BigDecimal.valueOf(100), 2, BigDecimal.ROUND_DOWN);
                            }
                        }

                        /* 砍价用户身份处理 */
                        if ("recordUsertype".equals(columnvalue)) {
                            if (value.equals(BargainEnum.UserType.OWN.getCode())) {
                                value = BargainEnum.UserType.OWN.getName();
                            } else if (value.equals(BargainEnum.UserType.OTHER.getCode())) {
                                value = BargainEnum.UserType.OTHER.getName();
                            }
                        }

                        /* 砍价状态处理 */
                        if ("ubStatus".equals(columnvalue)) {
                            if (value.equals(BargainEnum.BargainStatus.SUCCESS.getCode())) {
                                value = BargainEnum.BargainStatus.SUCCESS.getName();
                            } else if (value.equals(BargainEnum.BargainStatus.BARGAINING.getCode())) {
                                value = BargainEnum.BargainStatus.BARGAINING.getName();
                            } else if (value.equals(BargainEnum.BargainStatus.FAIL.getCode())) {
                                value = BargainEnum.BargainStatus.FAIL.getName();
                            }
                        }

                        /* 砍价用户真实状态处理 */
                        if ("ubReal".equals(columnvalue)) {
                            if (value.equals(AcEnum.RealStatus.Y.getCode())) {
                                value = AcEnum.RealStatus.Y.getName();
                            } else if (value.equals(AcEnum.RealStatus.N.getCode())) {
                                value = AcEnum.RealStatus.N.getName();
                            }
                        }

                        /* 秒杀商品类型处理 */
                        if ("sproductType".equals(columnvalue)) {
                            if (value.equals(SeckillEnum.SproductType.M.getCode())) {
                                value = SeckillEnum.SproductType.M.getName();
                            } else if (value.equals(SeckillEnum.SproductType.C.getCode())) {
                                value = SeckillEnum.SproductType.C.getName();
                            } else if (value.equals(SeckillEnum.SproductType.E.getCode())) {
                                value = SeckillEnum.SproductType.E.getName();
                            } else if (value.equals(SeckillEnum.SproductType.F.getCode())) {
                                value = SeckillEnum.SproductType.F.getName();
                            } else if (value.equals(SeckillEnum.SproductType.G.getCode())) {
                                value = SeckillEnum.SproductType.G.getName();
                            } else if (value.equals(SeckillEnum.SproductType.H.getCode())) {
                                value = SeckillEnum.SproductType.H.getName();
                            }
                        }

                    }

                    if (value == null) {
                        value = "";
                    }

                    HSSFCell cell = row.createCell(j, CellType.STRING);
                    cell.setCellValue(value.toString());
                    cell.setCellStyle(style);
                    j++;
                }

            }

            //让列宽随着导出的列长自动适应
            for (int colNum = 0; colNum < columnNum; colNum++) {
                int columnWidth = sheet.getColumnWidth(colNum) / 256;
                for (int rowNum = 0; rowNum < sheet.getLastRowNum(); rowNum++) {
                    HSSFRow currentRow;
                    //当前行未被使用过
                    if (sheet.getRow(rowNum) == null) {
                        currentRow = sheet.createRow(rowNum);
                    } else {
                        currentRow = sheet.getRow(rowNum);
                    }
                    if (currentRow.getCell(colNum) != null) {
                        HSSFCell currentCell = currentRow.getCell(colNum);
                        if (currentCell.getCellType() == CellType.STRING) {
                            int length = currentCell.getStringCellValue()
                                    .getBytes().length;
                            if (columnWidth < length) {
                                columnWidth = length;
                            }
                        }
                    }
                }
                if (colNum == 0) {
                    sheet.setColumnWidth(colNum, (columnWidth - 2) * 256);
                } else {
                    sheet.setColumnWidth(colNum, (columnWidth + 4) * 256);
                }
            }

            OutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static List<Map<Integer, String>> read(String urlpath) {
        List<Map<Integer, String>> list = new ArrayList<Map<Integer, String>>();
        try {
            URL url = new URL(urlpath);
            InputStream inputStream = url.openStream();
            String extString = urlpath.substring(urlpath.lastIndexOf("."));
            Workbook wb = null;
            if (".xls".equals(extString.trim()))
                wb = new HSSFWorkbook(inputStream);
            else if (".xlsx".equals(extString.trim()))
                wb = new XSSFWorkbook(inputStream);

            //开始解析
            Sheet sheet = wb.getSheetAt(0); //读取sheet 0

            int firstRowIndex = sheet.getFirstRowNum(); //第一行是列名，所以不读
            int lastRowIndex = sheet.getLastRowNum();
            for (int rIndex = firstRowIndex; rIndex <= lastRowIndex; rIndex++) { //遍历行
                Row row = sheet.getRow(rIndex);
                Map<Integer, String> map = new HashMap<Integer, String>();
                if (row != null) {
                    int firstCellIndex = row.getFirstCellNum();
                    int lastCellIndex = row.getLastCellNum();
                    for (int cIndex = firstCellIndex; cIndex < lastCellIndex; cIndex++) { //遍历列
                        Cell cell = row.getCell(cIndex);
                        if ((cell != null) && (!cell.toString().trim().equals(""))) {
                            map.put(cIndex, cell.toString());
                        } else {
                            map.put(cIndex, "");
                        }
                    }
                    list.add(map);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }


    /*
     * 列头单元格样式
     */
    private static HSSFCellStyle getColumnTopStyle(HSSFWorkbook workbook) {
        //设置字体
        HSSFFont font = workbook.createFont();
        //设置字体大小
        font.setFontHeightInPoints((short) 14);
        //字体加粗
        font.setBold(true);
        //设置字体名字
        font.setFontName("黑体");
        //设置样式;
        HSSFCellStyle style = workbook.createCellStyle();
        //设置底边框;
        style.setBorderBottom(BorderStyle.THIN);
        //设置底边框颜色;
        style.setBottomBorderColor((short) 0);
        //设置左边框;
        style.setBorderLeft(BorderStyle.THIN);
        //设置左边框颜色;
        style.setLeftBorderColor((short) 0);
        //设置右边框;
        style.setBorderRight(BorderStyle.THIN);
        //设置右边框颜色;
        style.setRightBorderColor((short) 0);
        //设置顶边框;
        style.setBorderTop(BorderStyle.THIN);
        //设置顶边框颜色;
        style.setTopBorderColor((short) 0);
        //在样式用应用设置的字体;
        style.setFont(font);
        //设置自动换行;
        style.setWrapText(false);
        //设置水平对齐的样式为居中对齐;
        style.setAlignment(HorizontalAlignment.CENTER);
        //设置垂直对齐的样式为居中对齐;
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    /*
     * 列数据信息单元格样式
     */
    private static HSSFCellStyle getStyle(HSSFWorkbook workbook) {
        //设置字体
        HSSFFont font = workbook.createFont();
        //设置字体大小
        font.setFontHeightInPoints((short) 12);
        //设置字体名字
        font.setFontName("黑体");
        //设置样式;
        HSSFCellStyle style = workbook.createCellStyle();
        //设置底边框;
        style.setBorderBottom(BorderStyle.THIN);
        //设置底边框颜色;
        style.setBottomBorderColor((short) 0);
        //设置左边框;
        style.setBorderLeft(BorderStyle.THIN);
        //设置左边框颜色;
        style.setLeftBorderColor((short) 0);
        //设置右边框;
        style.setBorderRight(BorderStyle.THIN);
        //设置右边框颜色;
        style.setRightBorderColor((short) 0);
        //设置顶边框;
        style.setBorderTop(BorderStyle.THIN);
        //设置顶边框颜色;
        style.setTopBorderColor((short) 0);
        //在样式用应用设置的字体;
        style.setFont(font);
        //设置自动换行;
        style.setWrapText(false);
        //设置水平对齐的样式为居中对齐;
        style.setAlignment(HorizontalAlignment.CENTER);
        //设置垂直对齐的样式为居中对齐;
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    /**
     * 处理数值字符
     *
     * @param str
     * @return
     */
    public static String convertStr(String str) {
        if (!StringUtils.isEmpty(str) && str.endsWith(".0")) {
            str = str.substring(0, str.length() - 2);
        }
        return str;
    }
}
```

