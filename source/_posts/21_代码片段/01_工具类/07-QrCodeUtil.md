---
title: 07-QrCodeUtil
date: 2016-5-3 11:22:34
tags:
- 工具类
categories: 
- 21_代码片段
- 01_工具类
---



### QRCodeUtils - 二维码图片 生成&解析

* 依赖

```xml
<dependency>
    <groupId>com.google.zxing</groupId>
    <artifactId>javase</artifactId>
    <version>3.4.0</version>
</dependency>
```

* 工具类

```java
import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.client.j2se.MatrixToImageConfig;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

import javax.annotation.Nullable;
import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;

public class QRCodeUtils {
    /**
     * 图片格式
     */
    public static final String QRCODE_PNG = "png";
    public static final String QRCODE_JPG = "jpg";
    public static final String QRCODE_GIF = "gif";
    public static final String QRCODE_BMP = "bmp";
    public static final String QRCODE_JPEG = "jpeg";
    public static final String QRCODE_PNM = "pnm";
    /**
     * 图片大小
     */
    private static final Integer QRCode_width = 200;
    private static final Integer QRCode_height = 200;
    /**
     * 前景颜色 - 黑色 & 背景颜色 - 白色
     */
    private static final int QRCOLOR = 0xFF000000;
    private static final int BGWHITE = 0xFFFFFFFF;

    /**
     * 二维码logo图片，默认使用logo图片
     */
    public static final String QRCode_logoImg = "/pinklogo.jpg";

    /**
     * 不带logo的二维码
     *
     * @param text   二维码附带的信息
     * @param path   要存放二维码图片的路径
     * @param format 图片格式 /jpg,png,gif..........
     * @throws Exception
     * @throws WriterException
     * @throws IOException
     */
    public static final String[] createQRCode(String text, String path, String format)
            throws WriterException, IOException {
        String serverImgName = createServerImgName(format);
        String filePath = path + "/" + serverImgName;
        FileOutputStream fos = new FileOutputStream(filePath);

        try {
            BitMatrix matrix = new MultiFormatWriter().encode(text, BarcodeFormat.QR_CODE, QRCode_width, QRCode_height, getDecodeHintType());
            // 生成不带中心位置图标的二维码图片, 设置格式 颜色 黑白色
            MatrixToImageConfig config = new MatrixToImageConfig(0xFF000001, 0xFFFFFFFF);
            BufferedImage image = MatrixToImageWriter.toBufferedImage(matrix, config);
            ImageIO.write(image, format, fos);

            String[] img = new String[3];
            img[0] = serverImgName;
            img[1] = String.valueOf(QRCode_width);
            img[2] = String.valueOf(QRCode_height);
            return img;
        } catch (WriterException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 带logo的二维码
     *
     * @param text   二维码附带的信息
     * @param path   要存放二维码图片的路径
     * @param format 图片格式 /jpg,png,gif..........
     * @param file   需要显示在二维码中心位置的小图标(图片)
     * @return String[] 返回字符串数组，包含文件名、和宽高
     * @throws Exception
     * @throws WriterException
     * @throws IOException
     */
    public static final String[] createLogoQRCode(String text, String path, String format, @Nullable File file)
            throws WriterException, IOException {
        BitMatrix bitMatrix = new MultiFormatWriter().encode(text, BarcodeFormat.QR_CODE, QRCode_width, QRCode_height,
                getDecodeHintType());
        int w = bitMatrix.getWidth();
        int h = bitMatrix.getHeight();
        BufferedImage image = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
        // 开始利用二维码数据创建Bitmap图片，分别设为黑（0xFFFFFFFF）白（0xFF000000）两色
        for (int x = 0; x < w; x++) {
            for (int y = 0; y < h; y++) {
                image.setRGB(x, y, bitMatrix.get(x, y) ? QRCOLOR : BGWHITE);
            }
        }
        BufferedImage bufferedImage = null;
        if (file != null) {
            // 绘制二维码自定义中心位置图片,注意实际格式，更改图片后缀名为满足的格式无效
            bufferedImage = encodeImgLogo(image, file);
        } else {
            // logo图片
            String logoPath = path + QRCode_logoImg;
            // 绘制二维码中心位置logo图片
            bufferedImage = encodeImgLogo(image, new File(logoPath));
        }
        if (bufferedImage == null) {
            return null;
        }
        // 重新生成带logo的二维码图片
        String imgName = createServerImgName(format);
        String QRClogCode = path + "/" + imgName;
        // 生成带中心位置图标的二维码图片
        ImageIO.write(bufferedImage, format, new File(QRClogCode));

        String[] img = new String[3];
        img[0] = imgName;
        img[1] = String.valueOf(QRCode_width);
        img[2] = String.valueOf(QRCode_height);
        return img;
    }

    /**
     * 使用时间命名文件名 + 后缀名
     *
     * @return
     */
    private static String createServerImgName(String suffix) {
        return System.currentTimeMillis() + "." + suffix;
    }

    /**
     * 解析二维码，需要javase包。 文件方式解码
     *
     * @param file
     * @return
     */
    public static String decode(File file) {
        BufferedImage image;
        try {
            if (file == null || file.exists() == false) {
                throw new Exception(" File not found:" + file.getPath());
            }
            image = ImageIO.read(file);
            return unifiedDecode(image);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 解析二维码 流方式解码
     *
     * @param input
     * @return
     */
    public static String decode(InputStream input) {
        BufferedImage image;
        try {
            if (input == null) {
                throw new Exception(" input is null");
            }
            image = ImageIO.read(input);
            return unifiedDecode(image);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private static String unifiedDecode(BufferedImage image) throws NotFoundException {
        LuminanceSource source = new BufferedImageLuminanceSource(image);
        BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));
        Result result;
        // 解码设置编码方式为：utf-8
        Hashtable<DecodeHintType, String> hints = new Hashtable<>();
        hints.put(DecodeHintType.CHARACTER_SET, "utf-8");
        result = new MultiFormatReader().decode(bitmap, hints);
        return result.getText();
    }

    /**
     * 设置二维码的格式参数
     *
     * @return
     */
    public static Map<EncodeHintType, Object> getDecodeHintType() {
        // 用于设置QR二维码参数
        Map<EncodeHintType, Object> hints = new HashMap<>();
        // 设置QR二维码的纠错级别（H为最高级别）具体级别信息
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
        // 设置编码方式
        hints.put(EncodeHintType.CHARACTER_SET, "utf-8");
        hints.put(EncodeHintType.MARGIN, 0);
        hints.put(EncodeHintType.MAX_SIZE, 350);
        hints.put(EncodeHintType.MIN_SIZE, 100);
        return hints;
    }

    /**
     * 二维码绘制logo
     *
     * @param image
     * @param logoImg logo图片文件 格式：JPG, jpg, tiff, pcx, PCX, bmp, BMP, gif, GIF,
     *                WBMP, png, PNG, raw, RAW, JPEG, pnm, PNM, tif, TIF, TIFF,
     *                wbmp, jpeg
     * @throws IOException
     */
    public static BufferedImage encodeImgLogo(BufferedImage image, File logoImg) throws IOException {
        // String[] names = ImageIO.getReaderFormatNames();
        // System.out.println(Arrays.toString(names));
        // 能读取的图片格式：JPG, jpg, tiff, pcx, PCX, bmp, BMP, gif, GIF, WBMP, png, PNG, raw, RAW, JPEG, pnm, PNM, tif, TIF, TIFF, wbmp, jpeg
        // 读取二维码图片
        // 获取画笔
        Graphics2D g = image.createGraphics();
        // 读取logo图片
        BufferedImage logo = ImageIO.read(logoImg);
        // 设置二维码大小，太大，会覆盖二维码，此处20%
        int logoWidth = Math.min(logo.getWidth(null), image.getWidth() * 2 / 10);
        int logoHeight = Math.min(logo.getHeight(null), image.getHeight() * 2 / 10);
        // 设置logo图片放置位置
        // 中心
        int x = (image.getWidth() - logoWidth) / 2;
        int y = (image.getHeight() - logoHeight) / 2;
        // 右下角，15为调整值
        // int x = twodimensioncode.getWidth() - logoWidth-15;
        // int y = twodimensioncode.getHeight() - logoHeight-15;
        // 开始合并绘制图片
        g.drawImage(logo, x, y, logoWidth, logoHeight, null);
        g.drawRoundRect(x, y, logoWidth, logoHeight, 15, 15);
        // logo边框大小
        g.setStroke(new BasicStroke(2));
        // logo边框颜色
        g.setColor(Color.WHITE);
        g.drawRect(x, y, logoWidth, logoHeight);
        g.dispose();
        logo.flush();
        image.flush();
        return image;
    }

    // test
    public static void main(String[] args) throws Exception {
        String content = "http://janycode.github.io/index.html";
        String path = ".";
        String format = QRCODE_PNG;
        File file = new File("E:\\图片\\logo.jpg");

        // 中心带 logo 的二维码
        String[] pngs = createLogoQRCode(content, path, format, file);
        for (int i = 0; i < pngs.length; i++) {
            System.out.println(pngs[i]);
        }

        // 中心不带 logo 的二维码
        String[] ss = createQRCode(content, path, format);
        for (int i = 0; i < ss.length; i++) {
            System.out.println(ss[i]);
        }
    }
}
```

### Controller

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("/api/qrcode")
public class QrCodeController {

    @Autowired
    private QrCodeService service;

    @GetMapping("/showqrcode/{msg}")
    public void showQrCode(@PathVariable String msg, HttpServletResponse response) {
        service.createQrcode(msg, response);
    }

    @GetMapping("/payqrcode/{msg}")
    public void payQrCode(@PathVariable String msg, HttpServletResponse response) {
        service.createQrcodePass(msg, response);
    }
}
```

### Service

```java
import javax.servlet.http.HttpServletResponse;

public interface QrCodeService {
    /**
     * 明文生成
     */
    void createQrcode(String msg, HttpServletResponse response);

    /**
     * 密文
     */
    void createQrcodePass(String msg, HttpServletResponse response);
}
```

### ServiceImpl

```java
import org.springframework.stereotype.Service;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Base64;

@Service
public class QrCodeServiceImpl implements QrCodeService {
    @Override
    public void createQrcode(String msg, HttpServletResponse response) {
        // 创建大小 400 的二维码对象
        BufferedImage image = QrCodeUtil.createQrCode(msg, 400);
        try {
            // 将二维码以 png 格式的流响应到浏览器
            ImageIO.write(image, "png", response.getOutputStream());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void createQrcodePass(String msg, HttpServletResponse response) {
        // 解密出 msg 消息内容
        String m = new String(Base64.getUrlDecoder().decode(msg));
        // 创建大小 400 的二维码对象
        BufferedImage image = QrCodeUtil.createQrCode(m, 400);
        try {
            // 将二维码以 png 格式的流响应到浏览器
            ImageIO.write(image, "png", response.getOutputStream());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```





### QRCodeUtil.java

```java
/**
 * @copyright @2015-2016 Abel-Studio.All Rights Reserved
 */

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageConfig;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import lombok.extern.slf4j.Slf4j;

import javax.imageio.ImageIO;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.awt.image.ColorModel;
import java.awt.image.WritableRaster;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Hashtable;
import java.util.List;


/**
 * 生成二维码帮助类
 *
 */
@Slf4j
public class QRCodeUtil {
	private static int onColor =0xFF000001;     //前景色
	private static int offColor =0xFFFFFFFF;    //背景色
	private static int margin = 0;               //白边大小，取值范围0~4
	private static ErrorCorrectionLevel level = ErrorCorrectionLevel.L;  //二维码容错率

    public static final String APPLET_CODE_FONT_TYPE = "PingFangSC";

    private static BufferedImage logoImg=null;

    //客服消息二维码外边距
    private static final Integer outSpacing = 20;
    //二维码的宽度
    public static final Integer width = 240;
    //二维码的高度
    public static final Integer height = 240;
    //二维码下边距
    private static final Integer belowSpacing = 24;
    //二维码下方文字,标题字体大小
    private static final Integer titleFontSize = 12;
    //二维码下方文字字体大小
    private static final Integer txtFontSize = 14;
    //二维码下方文字行数
    private static final Integer fontRow = 4;
    //标题间距
    private static final Integer titlesSpacing = 16;
    //二维码下方文字行间距
    private static final Integer txtRowSpacing = 5;
    //二维码图片下边距
    private static final Integer bottomSpacing = 36;

    /**
     * 生成不带文字的二维码
     * @param url
     * @return
     * @author yyl
     * @date 2021-01-08 16:26
     */
    public static InputStream generateQRImage(String url, InputStream logo){
        Hashtable<EncodeHintType, Object> hints = new Hashtable<>();
        // 指定纠错等级
        hints.put(EncodeHintType.ERROR_CORRECTION, level);
        // 指定编码格式
        hints.put(EncodeHintType.CHARACTER_SET, "utf-8");
        hints.put(EncodeHintType.MARGIN, margin);
        try {
            MatrixToImageConfig config = new MatrixToImageConfig(onColor,offColor);
            BitMatrix bitMatrix = new MultiFormatWriter().encode(url,BarcodeFormat.QR_CODE, width, height, hints);
            //去除白边
            //bitMatrix=deleteWhite(bitMatrix);
            BufferedImage image= MatrixToImageWriter.toBufferedImage(bitMatrix, config);

            //构建绘图对象
            Graphics2D gs = image.createGraphics();
            int ratioWidth = image.getWidth()*2/10;
            int ratioHeight = image.getHeight()*2/10;
            //读取logo图片
            int logoWidth = image.getWidth(null)>ratioWidth?ratioWidth:image.getWidth(null);
            int logoHeight = image.getHeight(null)>ratioHeight?ratioHeight:image.getHeight(null);
            //计算宽高
            int x = (image.getWidth() - logoWidth) / 2;
            int y = (image.getHeight() - logoHeight) / 2;

            Image img = ImageIO.read(logo);
            //开始绘制图片x,y是距离grap两个边的距离，logoWidth,logoHeight是中间logo的大小
            gs.drawImage(img, x, y, logoWidth, logoHeight, null);
            gs.setColor(Color.black);
            gs.setBackground(Color.WHITE);
            gs.dispose();

            ByteArrayOutputStream bs = new ByteArrayOutputStream();
            ImageOutputStream imOut = ImageIO.createImageOutputStream(bs);
            ImageIO.write(image, "jpg", imOut);
            return new ByteArrayInputStream(bs.toByteArray());
        } catch (Exception e) {
            log.error("生成二维码" + url + "异常",e);
        }
        return null;
    }

    /**
     * 生成带文字的二维码
     * @param txt
     * @return
     */
	public static InputStream generateQRImage(String txt, List title,String type){
        Hashtable<EncodeHintType, Object> hints = new Hashtable<EncodeHintType, Object>();
        // 指定纠错等级  
        hints.put(EncodeHintType.ERROR_CORRECTION, level);  
        // 指定编码格式  
        hints.put(EncodeHintType.CHARACTER_SET, "utf-8");
        hints.put(EncodeHintType.MARGIN, margin);
        //图片高度
        Integer totalHeight = outSpacing+height+belowSpacing+titleFontSize*2+txtFontSize*fontRow+txtRowSpacing*4+titlesSpacing+bottomSpacing;
        //图片不包含班级名称的高度
        Integer totalHeightShort = outSpacing+height+belowSpacing+titleFontSize+txtFontSize+txtRowSpacing+bottomSpacing;
        try {  
        	MatrixToImageConfig config = new MatrixToImageConfig(onColor,offColor);
        	BitMatrix bitMatrix = new MultiFormatWriter().encode(txt,BarcodeFormat.QR_CODE, width, height, hints);
        	//去除白边
            bitMatrix=deleteWhite(bitMatrix);
            BufferedImage image= MatrixToImageWriter.toBufferedImage(bitMatrix, config);
        	if(logoImg!=null){
                //构建绘图对象
                try {
                    Graphics2D gs = image.createGraphics();
                    int ratioWidth = image.getWidth()*2/10;
                    int ratioHeight = image.getHeight()*2/10;
                    //读取logo图片
                    int logoWidth = logoImg.getWidth(null)>ratioWidth?ratioWidth:logoImg.getWidth(null);
                    int logoHeight = logoImg.getHeight(null)>ratioHeight?ratioHeight:logoImg.getHeight(null);
                    //计算宽高
                    int x = (image.getWidth() - logoWidth) / 2;
                    int y = (image.getHeight() - logoHeight) / 2;
                    //开始绘制图片
                    gs.drawImage(logoImg, x, y, logoWidth, logoHeight, null);
                    gs.setColor(Color.black);
                    gs.setBackground(Color.WHITE);
                    gs.dispose();
                    logoImg.flush();
                }catch (Exception e){
                    log.error("生成二维码添加logo异常",e);
                }
            }

            //调整宽高
            image=resizeBufferedImage(image, width, height, true);
            //根据入参调整图片高度，在图片下方放文字
            int picHeight = totalHeightShort;
            //附带文字时的图片长度
            if(title.size()>1){
                picHeight = totalHeight;
            }
            //生成新画布
            BufferedImage bi = new BufferedImage(width+outSpacing*2,picHeight,BufferedImage.TYPE_INT_RGB);

            //新建一个绘图类
            Graphics2D gp = bi.createGraphics();
            //消除文字锯齿
            gp.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING,RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
            //消除画图锯
            gp.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            gp.setColor(Color.white);
            gp.fillRect(0,0,600,600);
            gp.drawImage(image,outSpacing,outSpacing,width,height,null);
            Font font = new Font(APPLET_CODE_FONT_TYPE,Font.PLAIN,txtFontSize);
            Font titleFont = new Font(APPLET_CODE_FONT_TYPE,Font.PLAIN,titleFontSize);
            FontMetrics metrics = gp.getFontMetrics(font);

            //班级名称起始位置Y坐标
            int loc_Y = totalHeightShort+titlesSpacing+titleFontSize+txtFontSize+txtRowSpacing-bottomSpacing;
            //设置字体颜色
            gp.setColor(Color.black);
            for(int i=0;i<title.size();i++){
                String titleStr = (String) title.get(i);
                int titleStrLength = metrics.stringWidth(titleStr);
                if(i==0){
                    gp.setFont(titleFont);
                    log.info("============订单号");
                    gp.drawString("订单号：",outSpacing,outSpacing+height+belowSpacing+titleFontSize);
                    //打印订单号
                    gp.setFont(font);
                    gp.drawString(titleStr,outSpacing,totalHeightShort-bottomSpacing);
                }
                if(i==1){
                    gp.setFont(titleFont);
                    if("sys".equals(type)){
                        gp.drawString("班级名称：",outSpacing,outSpacing+height+belowSpacing+titleFontSize*2+titlesSpacing+txtFontSize+txtRowSpacing);
                    }else {
                        gp.drawString("课程名称：",outSpacing,outSpacing+height+belowSpacing+titleFontSize*2+titlesSpacing+txtFontSize+txtRowSpacing);
                    }
                    //判断班级名称是否需要折行
                    if(titleStrLength<width){
                        gp.setFont(font);
                        gp.drawString(titleStr,outSpacing,loc_Y);
                    }else {
                        gp.setFont(font);
                        drawStringWithFontStyleLineFeed(gp,titleStr,width,outSpacing,loc_Y,txtRowSpacing,txtFontSize);
                    }
                }
            }
            gp.dispose();
            ByteArrayOutputStream bs = new ByteArrayOutputStream();
            ImageOutputStream imOut = ImageIO.createImageOutputStream(bs);
            ImageIO.write(bi, "jpg", imOut);
            return new ByteArrayInputStream(bs.toByteArray());
        } catch (Exception e) {
            log.error("生成二维码" + txt + "异常",e);
        }
        return null;
    }


    /**
     * 去除二维码白边
     * @param matrix
     * @return
     */
    private static BitMatrix deleteWhite(BitMatrix matrix) {
        int[] rec = matrix.getEnclosingRectangle();
        int resWidth = rec[2] + 1;
        int resHeight = rec[3] + 1;

        BitMatrix resMatrix = new BitMatrix(resWidth, resHeight);
        resMatrix.clear();
        for (int i = 0; i < resWidth; i++) {
            for (int j = 0; j < resHeight; j++) {
                if (matrix.get(i + rec[0], j + rec[1]))
                    resMatrix.set(i, j);
            }
        }
        return resMatrix;
    }

    /**
     * 调整bufferedimage大小
     * @param source BufferedImage 原始image
     * @param targetW int  目标宽
     * @param targetH int  目标高
     * @param flag boolean 是否同比例调整
     * @return BufferedImage  返回新image
     */
    private static BufferedImage resizeBufferedImage(BufferedImage source, int targetW, int targetH, boolean flag) {
        int type = source.getType();
        BufferedImage target = null;
        double sx = (double) targetW / source.getWidth();
        double sy = (double) targetH / source.getHeight();
        if (flag && sx > sy) {
            sx = sy;
            targetW = (int) (sx * source.getWidth());
        } else if(flag && sx <= sy){
            sy = sx;
            targetH = (int) (sy * source.getHeight());
        }
        if (type == BufferedImage.TYPE_CUSTOM) { // handmade
            ColorModel cm = source.getColorModel();
            WritableRaster raster = cm.createCompatibleWritableRaster(targetW, targetH);
            boolean alphaPremultiplied = cm.isAlphaPremultiplied();
            target = new BufferedImage(cm, raster, alphaPremultiplied, null);
        } else {
            target = new BufferedImage(targetW, targetH, type);
        }
        Graphics2D g = target.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g.drawRenderedImage(source, AffineTransform.getScaleInstance(sx, sy));
        g.dispose();
        return target;
    }

    /**
     * 文本内容自动换行
     * @param g 画图类
     * @param strContent 文本内容
     * @param maxWdith 最大宽度
     * @param loc_X 开始X坐标
     * @param loc_Y 开始Y坐标
     * @param rowSpacing 行距
     *
     */
    private static void  drawStringWithFontStyleLineFeed(Graphics2D g, String strContent, int maxWdith, int loc_X, int loc_Y,int rowSpacing,int txtFontSize){
        //获取字符串 字符的总宽度
        int strWidth =getStringLength(g,strContent);
        //每一行字符串宽度
        int rowWidth=maxWdith;
        //获取字符高度
        int strHeight=getStringHeight(g);
        //字符串总个数
        if(strWidth>rowWidth){
            char[] strContentArr = strContent.toCharArray();
            int count = 0;
            int line = 0;
            int charWidth;
            int charWidthNext;
            int countValue = 0;
            int countValueNext;
            for(int j=0;j< strContentArr.length;j++){
                charWidth = g.getFontMetrics().charWidth(strContentArr[j]);
                if(j==strContentArr.length-1){
                    charWidthNext=0;
                    g.drawString(strContent.substring(count,j+1),loc_X,loc_Y+(txtFontSize+rowSpacing)*line);
                }else {
                    charWidthNext = g.getFontMetrics().charWidth(strContentArr[j+1]);
                }
                //到当前字符长度
                countValue = charWidth + countValue;
                //加下一个字符的长度
                countValueNext = countValue+charWidthNext;
                if(countValue<maxWdith&&countValueNext<maxWdith){
                    continue;
                }else if(countValue<maxWdith&&countValueNext>=maxWdith){
                    g.drawString(strContent.substring(count,j),loc_X,loc_Y+(txtFontSize+rowSpacing)*line);
                    countValue=0;
                    line++;
                    count=j;
                }
            }

        }else{
            //直接绘制
            g.drawString(strContent, loc_X, loc_Y);
        }

    }
    private static int  getStringLength(Graphics g, String str) {
        char[]  strcha=str.toCharArray();
        return g.getFontMetrics().charsWidth(strcha, 0, str.length());
    }

    private static int  getStringHeight(Graphics g) {
        return g.getFontMetrics().getHeight();
    }
}
```

