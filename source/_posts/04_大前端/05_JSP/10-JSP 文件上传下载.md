---
title: 10-JSP 文件上传下载
date: 2018-5-2 19:19:22
tags:
- JSP
- 文件
categories: 
- 04_大前端
- 05_JSP
---

IDEA 环境配置：导入依赖 jar 包。
- `commons-fileupload-1.4.jar`
- `commons-io-2.6.jar`

### 1. 文件上传
本质就是将一台电脑中的文件根据网络协议通过 io 流传递到另一台电脑(服务器)上。
#### 1.1 三要素
① 表单数据提交方式：`POST`
② 表单提交数据的类型：`<form ... enctype=multipart/form-data>...</form>`
③ 表单中设置文件上传项：`<input type="file" ... />`

#### 1.2 核心逻辑

前台 JSP 展示页面：
```html
<form action="${pageContext.request.contextPath}/upload" method="post" enctype="multipart/form-data">
    描述：<input type="text" name="desc"> <br>
    上传附件：<input type="file" name="file"> <br>
    <button type="submit">提交</button>
</form>
```
后台 Servlet 核心逻辑：
```java
    // 1. 创建磁盘文件项工厂对象
    // 2. 创建核心解析对象
    ServletFileUpload servletFileUpload = new ServletFileUpload(new DiskFileItemFactory());
    // 解决文件名中文乱码问题
    servletFileUpload.setHeaderEncoding("utf-8");
    try {
        // 3. 解析上传请求，获取文件项(包含form 中的所有项)
        List<FileItem> fileItems = servletFileUpload.parseRequest(request);
        for (FileItem fileItem : fileItems) {
            // 判断 fileItem 是否是上传的文件
            if (fileItem.isFormField()) {
                // true：其他的 form 项
                // 获取字段名称 <input name="字段名称">
                System.out.println(fileItem.getFieldName());
                // 描述 text 的中文内容乱码问题
                System.out.println(fileItem.getString("utf-8"));
            } else {
                // false：上传的文件
                // 输入流读到内存
                BufferedInputStream bis = new BufferedInputStream(fileItem.getInputStream());
                // 输出流写到服务器 request.getServletContext().getRealPath("upload")
                //File dirPath = new File(request.getRealPath("upload"));
                File dirPath = new File(request.getServletContext().getRealPath("upload"));
                if (!dirPath.exists()) {
                    dirPath.mkdir();
                }
                // 文件名 = 当前时间毫秒值 + 用户名(不重复) + 文件名
                String path = dirPath + File.separator + System.currentTimeMillis() + "-" + fileItem.getName();
                System.out.println(path);
                BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(path));
                byte[] bs = new byte[8*1024];
                int size;
                while ((size = bis.read(bs)) != -1) {
                    bos.write(bs, 0, size);
                }
                bos.close();
                bis.close();
            }
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
```
文件上传到服务器：
```java
// 存储到数据库(id, fileName, filePath, description)
FileService fileService = new FileServiceImpl();
MyFile myFile = new MyFile();
myFile.setFileName(filename);
myFile.setFilePath(request.getContextPath() + File.separator + "upload" + File.separator + filename);
myFile.setDescription(description);
fileService.addFile(myFile);
```

文件上传核心 API：
```java
ServletFileUpload 核心解析类
    parseRequest(HttpServletRequest request) 解析请求，并获取相关文件项
    setHeaderEncoding(String encoding) 解决中文文件名乱码
FileItem 文件项
	boolean isFormField() 返回为true，普通字段。返回为false，就是文件
	String getFieldName() 获取表单 name 字段 
	String getString(String encoding) 根据指定编码格式获取字段值，解决描述文本中文乱码 
	String getName() 获取上传文件名称 
	InputStream getInputStream() 获取上传文件对应的输入流
```


#### 1.3 中文乱码和名字重复
**文件名中文乱码**：
```java
// 1. 创建磁盘文件项工厂对象
// 2. 创建核心解析对象
ServletFileUpload servletFileUpload = new ServletFileUpload(new DiskFileItemFactory());
// 解决文件名中文乱码问题
servletFileUpload.setHeaderEncoding("utf-8");
```
**描述内中文乱码**：
```java
// 判断 fileItem 是否是上传的文件
if (fileItem.isFormField()) {
    // true：其他的 form 项
    // 描述 text 的中文内容乱码问题
    System.out.println(fileItem.getString("utf-8"));
} else { ... }
```
**文件名重复问题**：
```java
// 文件名 = 当前时间毫秒值 + 用户名(不重复) + 文件名
String path = serverPath + File.separator + System.currentTimeMillis() + "-" + username + "-" + fileItem.getName();
```


### 2. 文件下载
本质就是将一台电脑(服务器)中的文件根据网络协议通过 io 流传递到另外一台电脑上。
#### 2.1 三步骤
前端：超链接携带文件名参数
① `设置媒体类型`
② `设置下载窗口(内容特征）`
③ `IO读写(写-响应给浏览器)`

#### 2.2 核心逻辑
**超链接携带文件名**：
```html
<a href="${pageContext.request.contextPath}/download?fileName=${file.fileName}">下载</a>
```
**设置媒体类型**：
```java
// 1. 设置媒体类型 <- 获取下载文件的媒体类型
String fileName = request.getParameter("fileName");
String mimeType = request.getServletContext().getMimeType(fileName);
response.setContentType(mimeType);
```
**设置下载窗口(内容特征)**：
```java
String userAgent = request.getHeader("User-Agent");
String newFileName = userAgent.contains("Chrome") ? URLEncoder.encode(fileName, "utf-8") : base64EncodeFileName(fileName);
// 2. 设置下载窗口 -> Content-Disposition
response.setHeader("Content-Disposition", "attachment;filename=" + newFileName);
```
**IO读写(写-响应给浏览器)**：
```java
// 3. IO读写文件: 读出服务器文件，响应写入到浏览器
String path = request.getServletContext().getRealPath("upload") + File.separator + fileName;
BufferedInputStream bis = new BufferedInputStream(new FileInputStream(path));
BufferedOutputStream bos = new BufferedOutputStream(response.getOutputStream());
byte[] bs = new byte[8*1024];
int size = -1;
while ((size = bis.read(bs)) != -1) {
    bos.write(bs, 0, size);
}
bis.close();
bos.close();
```

#### 2.3 中文乱码处理
不同浏览器编码方式不同：对文件名进行编码时以谷歌为代表的是 `utf-8`，其他浏览器是 `base64`
根据浏览器在下载窗口前设置编码方式：
```java
String userAgent = request.getHeader("User-Agent");
String newFileName = userAgent.contains("Chrome") ? URLEncoder.encode(fileName, "utf-8") : base64EncodeFileName(fileName);
response.setHeader("Content-Disposition", "attachment;filename=" + newFileName);
```
base64编码 API(固定写法) ：
```java
public String base64EncodeFileName(String fileName) {
    BASE64Encoder base64Encoder = new BASE64Encoder();
    try {
        return "=?UTF‐8?B?"
               + new String(base64Encoder.encode(fileName.getBytes("UTF-8")))
               + "?=";
    } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException(e);
    }
}
```

### 3. 通用 Servlet 实现文件上传下载
upload.jsp
```html
<h2>文件上传</h2>
<form action="${pageContext.request.contextPath}/file?methodName=upload" method="post" enctype="multipart/form-data">
    描述：<input type="text" name="description" > <br> <br>
    上传文件：<input type="file" name="file"> <br> <br>
    <button type="submit">提交</button>
</form>
```
fileList.jsp
```html
<h2>文件列表：</h2>
<table border="1px" cellpadding="5px" cellspacing="0px">
    <tr>
        <td>编号</td>
        <td>文件名</td>
        <td>文件描述</td>
        <td>操作</td>
    </tr>

    <c:forEach items="${fileList}" var="file">
        <tr>
            <td>${file.id}</td>
            <td>${file.fileName}</td>
            <td>${file.description}</td>
            <td>
                <a href="${pageContext.request.contextPath}/file?methodName=download&fileName=${file.fileName}">下载</a>
            </td>
        </tr>
    </c:forEach>
</table>
```
FileServlet.java
```java
@WebServlet(name = "FileServlet", urlPatterns = "/file")
public class FileServlet extends BaseServlet {
    private FileService fileService = new FileServiceImpl();

    // 上传文件
    public String upload(HttpServletRequest request, HttpServletResponse response) {
        ServletFileUpload servletFileUpload = new ServletFileUpload(new DiskFileItemFactory());
        // 解决文件名中文乱码
        servletFileUpload.setHeaderEncoding("utf-8");
        
        String filename = null;
        String description = null;
        try {
            List<FileItem> fileItems = servletFileUpload.parseRequest(request);
            for (FileItem fileItem : fileItems) {
                if (fileItem.isFormField()) {
                    // 描述信息 + 处理描述内容乱码
                    description = fileItem.getString("utf-8");
                } else {
                    File dirPath = new File(request.getServletContext().getRealPath("upload"));
                    if (!dirPath.exists()) {
                        dirPath.mkdir();
                    }
                    
                    // 解决文件名重复
                    filename = System.currentTimeMillis() + "-" + fileItem.getName();
                    String path = dirPath + File.separator + filename;

                    // IO流处理
                    BufferedInputStream bis = new BufferedInputStream(fileItem.getInputStream());
                    BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(path));
                    byte[] bs = new byte[8192];
                    int size = 0;
                    while ((size = bis.read(bs)) != -1) {
                        bos.write(bs, 0, size);
                    }
                    bos.close();
                    bis.close();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        FileService fileService = new FileServiceImpl();
        FileInfo newFile = new FileInfo();
        newFile.setFileName(filename);
        newFile.setFilePath(request.getContextPath() + File.separator + "upload" + File.separator + filename);
        newFile.setDescription(description);
        boolean result = false;
        try {
            result = fileService.addFile(newFile);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result ? "r:/file?methodName=fileList" : "/upload.jsp";
    }

    // 展示文件列表
    public String fileList(HttpServletRequest request, HttpServletResponse response) {
        try {
            List<FileInfo> fileList = fileService.selectAllFiles();
            request.setAttribute("fileList", fileList);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "/fileList.jsp";
    }

    // 下载文件
    public void download(HttpServletRequest request, HttpServletResponse response) {
        // 设置下载文件的媒体类型
        String fileName = request.getParameter("fileName");
        String mimeType = request.getServletContext().getMimeType(fileName);
        response.setContentType(mimeType);

        String userAgent = request.getHeader("User-Agent");
        try {
            // 文件名中文乱码处理
            String newFileName = userAgent.contains("Chrome") ? URLEncoder.encode(fileName, "utf-8") : base64EncodeFileName(fileName);
            response.setHeader("Content-Disposition", "attachment;filename=" + newFileName);

            String path = request.getServletContext().getRealPath("upload") + File.separator + fileName;
            
            // IO流处理
            BufferedInputStream bis = new BufferedInputStream(new FileInputStream(path));
            BufferedOutputStream bos = new BufferedOutputStream(response.getOutputStream());
            byte[] bs = new byte[8192];
            int size = -1;
            while ((size = bis.read(bs)) != -1) {
                bos.write(bs, 0, size);
            }
            bos.close();
            bis.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String base64EncodeFileName(String fileName) {
        BASE64Encoder base64Encoder = new BASE64Encoder();
        try {
            return "=?UTF‐8?B?"
                    + new String(base64Encoder.encode(fileName.getBytes("UTF-8")))
                    + "?=";
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}
```
通用 Servlet ：
```java
@WebServlet(name = "BaseServlet", urlPatterns = "/base")
public class BaseServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String methodName = request.getParameter("methodName");
        System.out.println(methodName);
        try {
            Method method = this.getClass().getMethod(methodName, HttpServletRequest.class, HttpServletResponse.class);
            String returnValue = (String) Objects.requireNonNull(method).invoke(this, request, response);
            if (null != returnValue) {
                if (returnValue.lastIndexOf(":") != -1) {
                    String path = returnValue.split(":")[1];
                    if (returnValue.startsWith("r")) {
                        response.sendRedirect(request.getContextPath() + path);
                    } else if (returnValue.startsWith("f")) {
                        request.getRequestDispatcher(path).forward(request, response);
                    }
                } else {
                    request.getRequestDispatcher(returnValue).forward(request, response);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```