---
title: 12-BaseController
date: 2021-2-4 16:09:31
tags:
- 工具类
categories: 
- 21_代码片段
- 01_工具类
---



### BaseController.java

```java
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
* 公共BaseController
*/
public class BaseController {
    private static final Logger log = LoggerFactory.getLogger(BaseController.class);
    private static final int PAGE_SIZE = 10;

    public BaseController() {
    }

    public int getPageNo(Map<String, Object> parameterMap) {
        int pageNo = 1;
        String curr = MapUtils.getString(parameterMap, "pageNo", "");
        if (StringUtils.isBlank(curr)) {
            curr = MapUtils.getString(parameterMap, "pager.pageNo", "");
        }
        if (StringUtils.isNotBlank(curr)) {
            try {
                pageNo = Integer.parseInt(curr);
            } catch (Exception var5) {
                pageNo = 1;
            }
        }
        pageNo = Math.max(pageNo, 1);
        return pageNo;
    }

    public int getPageSize(Map<String, Object> parameterMap) {
        return getPageSize(parameterMap, PAGE_SIZE);
    }

    public int getPageSize(Map<String, Object> parameterMap, int defPageSize) {
        int pageSize = defPageSize;
        String curr = MapUtils.getString(parameterMap, "pageSize", "");
        if (StringUtils.isBlank(curr)) {
            curr = MapUtils.getString(parameterMap, "pager.pageSize", "");
        }
        if (StringUtils.isNotEmpty(curr)) {
            try {
                pageSize = Integer.parseInt(curr);
            } catch (Exception var5) {
                pageSize = defPageSize;
            }
        }
        return pageSize;
    }

    public String getOrderBy(Map<String, Object> parameterMap) {
        String sort = MapUtils.getString(parameterMap, "sort", "");
        String direction = MapUtils.getString(parameterMap, "direction", "");
        return StringUtils.isNotBlank(sort) && StringUtils.isNotBlank(direction) ? sort + " " + direction : "";
    }

    public Result renderSuccess() {
        Result result = new Result();
        result.setCode(0);
        result.setMessage("success");
        return result;
    }

    public <T> Result<T> renderSuccess(String message) {
        Result result = new Result();
        result.setCode(ErrorCode.OK.getCode());
        result.setMessage(message);
        return result;
    }

    public <T> Result<T> renderSuccess(T data) {
        Result<T> result = new Result();
        result.setCode(0);
        result.setMessage("success");
        result.setData(data);
        return result;
    }

    public <T> Result<T> renderRowsSuccess(T rows) {
        Result<T> result = new Result();
        result.setCode(0);
        result.setMessage("success");
        result.setRows(rows);
        return result;
    }

    public <T> Result<T> renderSuccess(T data, String message) {
        Result<T> result = new Result();
        result.setCode(0);
        result.setMessage(message);
        result.setData(data);
        return result;
    }

    public <T> Result<T> renderError(String message) {
        Result result = new Result();
        result.setCode(1000);
        result.setMessage(message);
        return result;
    }

    public Result<Object> exception(Exception ex) {
        log.error(ex.getMessage(), ex.getCause());
        return this.renderError(ex.getMessage());
    }

    public <T> Result<List<T>> renderSuccess(List list) {
        Result<List<T>> result = new Result();
        result.setCode(ErrorCode.OK.getCode());
        result.setMessage(ErrorCode.OK.getMessage());
        result.setData(list);
        return result;
    }

    public Result<Object> renderSuccess(String message, Object... data) {
        Result<Object> result = new Result();
        result.setCode(ErrorCode.OK.getCode());
        result.setMessage(message);
        result.setData(data);
        return result;
    }

    public Map<String, Object> renderWebPageInfo(Page<?> page) {
        Map<String, Object> jsonMap = new HashMap();
        jsonMap.put("pager.totalRows", page.getTotal());
        jsonMap.put("pager.pageNo", page.getCurrent());
        jsonMap.put("rows", page.getRecords());
        jsonMap.put("status", "0");
        jsonMap.put("message", "success");
        return jsonMap;
    }
}
```

### Result.java

```
import java.io.Serializable;
import org.slf4j.MDC;

/**
 * 公共返回实体 Result
 * @param <T>
 */
public class Result<T> implements Serializable {
    private static final long serialVersionUID = 1L;
    private int code;
    private String message;
    private T data;
    private T rows;
    private String requestId;
    private Boolean isSuccess;

    public static <T> Result<T> ok() {
        return (Result<T>) restResult((Object)null, CommonConstants.SUCCESS, (String)null);
    }

    public static <T> Result<T> ok(T data) {
        return restResult(data, CommonConstants.SUCCESS, (String)null);
    }

    public static <T> Result<T> ok(T data, String msg) {
        return restResult(data, CommonConstants.SUCCESS, msg);
    }

    public static <T> Result<T> failed() {
        return (Result<T>) restResult((Object)null, CommonConstants.FAIL, (String)null);
    }

    public static <T> Result<T> failed(String msg) {
        return (Result<T>) restResult((Object)null, CommonConstants.FAIL, msg);
    }

    public static <T> Result<T> failed(T data) {
        return restResult(data, CommonConstants.FAIL, (String)null);
    }

    public static <T> Result<T> failed(T data, String msg) {
        return restResult(data, CommonConstants.FAIL, msg);
    }

    public static <T> Result<T> restResult(T data, int code, String msg) {
        Result<T> apiResult = new Result();
        apiResult.setCode(code);
        apiResult.setData(data);
        apiResult.setMessage(msg);
        apiResult.setRequestId(MDC.get("traceId"));
        return apiResult;
    }

    public Boolean getSuccess() {
        return this.getCode() == CommonConstants.SUCCESS ? true : false;
    }

    @Override
    public String toString() {
        return "Result(code=" + this.getCode() + ", message=" + this.getMessage() + ", data=" + this.getData() + ", requestId=" + this.getRequestId() + ", isSuccess=" + this.isSuccess + ")";
    }

    public Result() {
    }

    public Result(int code, String message, T data, String requestId, Boolean isSuccess) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.requestId = requestId;
        this.isSuccess = isSuccess;
    }

    public int getCode() {
        return this.code;
    }

    public Result<T> setCode(int code) {
        this.code = code;
        return this;
    }

    public String getMessage() {
        return this.message;
    }

    public Result<T> setMessage(String message) {
        this.message = message;
        return this;
    }

    public T getData() {
        return this.data;
    }

    public Result<T> setData(T data) {
        this.data = data;
        return this;
    }
    public T getRows() {
        return this.rows;
    }

    public Result<T> setRows(T rows) {
        this.rows = rows;
        return this;
    }

    public String getRequestId() {
        return this.requestId;
    }

    public Result<T> setRequestId(String requestId) {
        this.requestId = requestId;
        return this;
    }
}
```

