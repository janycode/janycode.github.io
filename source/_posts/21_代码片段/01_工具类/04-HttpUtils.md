---
title: 04-HttpUtils
date: 2016-5-3 11:22:34
tags:
- 工具类
categories: 
- 21_代码片段
- 01_工具类
---



### OkHttp3

官网：https://square.github.io/okhttp/

基本使用参考：https://www.jianshu.com/p/da4a806e599b



### HttpUtils

```xml
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpclient</artifactId>
    <version>4.5.13</version>
</dependency>
```



```java
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpStatus;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpRequestRetryHandler;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.Charset;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Http Client 请求工具
 *
 * @Author Jerry(姜源)
 * @Date 2016-05-03 11:22:34
 */
@SuppressWarnings("all")
public class HttpUtils {
    private static final String DEFAULT_CHARSET = "UTF-8";
    private static final String DEFAULT_POST_CONTENTTYPE = "application/x-www-form-urlencoded";
    private static final String JSON_CONTENTTYPE = "application/json";
    private static final int REQUEST_TIMEOUT = 60 * 1000;// 设置请求超时5秒钟
    private static final int SO_TIMEOUT = 60 * 1000; // 设置等待数据超时时间5秒钟
    private static RequestConfig requestConfig;
    // 池化管理
    private static PoolingHttpClientConnectionManager poolConnManager = null;

    private static CloseableHttpClient httpClient;

    private static String userAgent;

    static {
        requestConfig = RequestConfig.custom()
                .setConnectionRequestTimeout(REQUEST_TIMEOUT)
                .setConnectTimeout(SO_TIMEOUT)
                .build();
        userAgent = "Mozilla/5.0 (Windows; U; Windows NT 6.1; rv:2.2) Gecko/20110201";

        try {
            SSLContextBuilder builder = new SSLContextBuilder();
            builder.loadTrustMaterial(null, new TrustSelfSignedStrategy());
            SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(
                    builder.build());
            // 配置同时支持 HTTP 和 HTPPS
            Registry<ConnectionSocketFactory> socketFactoryRegistry = RegistryBuilder.<ConnectionSocketFactory>create().register(
                    "http", PlainConnectionSocketFactory.getSocketFactory()).register(
                    "https", sslsf).build();
            // 初始化连接管理器
            poolConnManager = new PoolingHttpClientConnectionManager(
                    socketFactoryRegistry);
            // 将最大连接数增加到200，实际项目最好从配置文件中读取这个值
            poolConnManager.setMaxTotal(1000);
            // 设置最大路由
            poolConnManager.setDefaultMaxPerRoute(20);
            // 根据默认超时限制初始化requestConfig
            int socketTimeout = 10000;
            int connectTimeout = 10000;
            int connectionRequestTimeout = 10000;
            requestConfig = RequestConfig.custom().setConnectionRequestTimeout(
                    connectionRequestTimeout).setSocketTimeout(socketTimeout).setConnectTimeout(
                    connectTimeout).build();

            // 初始化httpClient
            httpClient = getConnection();

            // System.out.println("初始化HttpClient~~~结束");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (KeyStoreException e) {
            e.printStackTrace();
        } catch (KeyManagementException e) {
            e.printStackTrace();
        }

    }

    /**
     * http do get with params
     *
     * @param url
     * @param parameterMap
     * @return
     */
    public static String doGet(String url, Map<String, Object> parameterMap) {
        long start = System.currentTimeMillis();
        CloseableHttpClient client = buildClient();
        String uri = buildURI(url, parameterMap);
        String res = getEntityString(client, new HttpGet(uri), null);
        return res;
    }

    /**
     * http do get with param and parse response with charset name
     *
     * @param url
     * @param parameterMap
     * @param resCharSet
     * @return
     */
    public static String doGetForceResCharset(String url, Map<String, Object> parameterMap, String resCharSet) {
        CloseableHttpClient client = buildClient();
        String uri = buildURI(url, parameterMap);
        Charset charSet = Charset.forName(resCharSet);
        return getEntityString(client, new HttpGet(uri), charSet);
    }

    /**
     * http post with params
     *
     * @param url
     * @param parameterMap
     * @return
     */
    public static String doPost(String url, Map<String, Object> parameterMap) {
        return doPostWithEncoding(url, parameterMap, DEFAULT_CHARSET);
    }

    /**
     * http post with params
     *
     * @param url
     * @param parameterMap
     * @return
     */
    public static String doPost(String url, Map<String, Object> headerMap, String json) {
        return doPostJsonWithHeader(url, headerMap, json, DEFAULT_CHARSET);
    }

    /**
     * http post with json as data body
     *
     * @param url
     * @param json
     * @return
     */
    public static String doPost(String url, String json) {
        return doPostJsonWithCharset(url, json, DEFAULT_CHARSET);
    }

    /**
     * http post with json as data body and the header charset
     *
     * @param url
     * @param json
     * @param charset
     * @return
     */
    public static String doPostJsonWithCharset(String url, String json, String charset) {
        return getEntityString(buildClient(),
                buildHttpPost(url, null, null, charset, JSON_CONTENTTYPE, json), null);
    }

    /**
     * http post with json as data body and the header
     *
     * @param url
     * @param json
     * @param charset
     * @return
     */
    public static String doPostJsonWithHeader(String url, Map<String, Object> headerMap, String json, String charset) {
        return getEntityString(buildClient(),
                buildHttpPost(url, headerMap, null, charset, JSON_CONTENTTYPE, json), null);
    }

    /**
     * http post with param and charset
     *
     * @param url
     * @param parameterMap
     * @param charset
     * @return
     */
    public static String doPostWithEncoding(String url, Map<String, Object> parameterMap,
                                            String charset) {
        CloseableHttpClient client = buildClient();
        HttpPost post = buildHttpPost(url, null, parameterMap, charset, null, null);
        return getEntityString(client, post, null);
    }


    /**
     * get the HttpPost instance with configuritions
     *
     * @param url
     * @param parameterMap
     * @param charset      if null, set to DEFAULT_CHARSET
     * @param contentType  if null, set to DEFAULT_POST_CONTENTTYPE
     * @param body         if not null and contentType is "application/json", use StringEntity
     * @return
     */
    private static HttpPost buildHttpPost(String url, Map<String, Object> headerMap, Map<String, Object> parameterMap,
                                          String charset, String contentType, String body) {

        HttpPost post = new HttpPost(url);
        charset = null == charset ? DEFAULT_CHARSET : charset;
        contentType = null == contentType ? DEFAULT_POST_CONTENTTYPE : contentType;
        post.setHeader("Content-Type", contentType + "; charset=" + charset);
        //自定义的部分(易观接口使用)
        if (null != headerMap) {
            if (null != headerMap.get("token")) {
                post.setHeader("token", headerMap.get("token").toString());
            }
            if (null != headerMap.get("appKey")) {
                post.setHeader("appKey", headerMap.get("appKey").toString());
            }
        }
        if (null != body && contentType == "application/json" && null == parameterMap) {
            StringEntity stringEntity = new StringEntity(body, charset);
            post.setEntity(stringEntity);
        } else {
            try {
                UrlEncodedFormEntity entity =
                        new UrlEncodedFormEntity(mapToNameValueList(parameterMap), charset);
                post.setEntity(entity);
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
        return post;
    }

    private static CloseableHttpClient buildClient() {
        return httpClient;
    }

    private static String buildURI(String url, Map<String, Object> parameterMap) {
        URIBuilder builder;
        try {
            builder = new URIBuilder(url);
            if (null != parameterMap) {
                for (String key : parameterMap.keySet()) {
                    builder.addParameter(key, parameterMap.get(key).toString());
                }
            }
            URI uri = builder.build();
            return uri.toString();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        return StringUtils.EMPTY;
    }

    private static String getEntityString(CloseableHttpClient client, HttpUriRequest request, Charset forceCharset) {
        CloseableHttpResponse response = null;
        String res = "";
        request.setHeader("Connection", "close");
        try {
            response = client.execute(request);

            if (response.getStatusLine().getStatusCode() != HttpStatus.SC_OK) {
                request.abort();
            } else {
                HttpEntity entity = response.getEntity();
                ContentType contentType = ContentType.getOrDefault(entity);
                Charset charSet = contentType.getCharset();
                charSet = ensureCharset(charSet, forceCharset);
                res = EntityUtils.toString(entity, charSet);
            }
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (response != null)
                    response.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            client.getConnectionManager().closeIdleConnections(0, TimeUnit.SECONDS);
        }
        return res;
    }

    private static Charset ensureCharset(Charset charSet, Charset forceCharset) {
        if (forceCharset != null)
            charSet = forceCharset;
        if (charSet == null)
            charSet = Charset.forName(DEFAULT_CHARSET);
        return charSet;
    }

    public static CloseableHttpClient getConnection() {
        CloseableHttpClient httpClient = HttpClients.custom()
                // 设置连接池管理
                .setConnectionManager(poolConnManager)
                // 设置请求配置
                .setDefaultRequestConfig(requestConfig)
                // 设置重试次数
                .setRetryHandler(new DefaultHttpRequestRetryHandler(0, false))
                .build();

        return httpClient;
    }


    private static List<BasicNameValuePair> mapToNameValueList(Map<String, Object> parameterMap) {
        List<BasicNameValuePair> list = new ArrayList<BasicNameValuePair>();
        for (String key : parameterMap.keySet()) {
            list.add(new BasicNameValuePair(key, parameterMap.get(key).toString()));
        }
        return list;
    }
}
```

### HttpClient

```java
public class HttpClient {
    public static String get(String sUrl, HashMap<String, String> paramMap, int timeOut) {

//		hainaids=9997&act=0&
        String line = "";
        StringBuilder sb = new StringBuilder();
        HttpURLConnection httpConn = null;
        try {
            if (paramMap.size() > 0) {
                sUrl += "?temp=1";
                for (String key : paramMap.keySet()) {
                    sUrl += "&" + key + "=" + paramMap.get(key);
                }
            }
//			System.out.println("url:"+sUrl);
            URL url = new URL(sUrl);
            Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("web-proxy.oa.com", 8080));
            httpConn = (HttpURLConnection) url.openConnection(proxy);
            httpConn.setRequestMethod("GET");
            httpConn.setConnectTimeout(timeOut);
            httpConn.setDoOutput(true);
            BufferedReader in = null;
            if (httpConn.getResponseCode() == 200) {
                in = new BufferedReader(new InputStreamReader(httpConn.getInputStream(), "UTF-8"));
                while ((line = in.readLine()) != null) {
                    sb.append(line);
                }
            }
            httpConn.disconnect();
            return sb.toString();
        } catch (Exception e) {
            // 关闭连接
            httpConn.disconnect();
            e.printStackTrace();
            return "";
        }
    }

    public static String post(String sUrl, String postData, int timeOut) {
        HttpURLConnection httpUrlConn = null;
        BufferedReader in = null;
        InputStreamReader reader = null;
        try {
            String line = "";
            StringBuilder sb = new StringBuilder();
            URL url = new URL(sUrl);
            Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("web-proxy.oa.com", 8080));
            httpUrlConn = (HttpURLConnection) url.openConnection(proxy);
            httpUrlConn.setRequestMethod("POST");
            httpUrlConn.setDoInput(true);
            httpUrlConn.setDoOutput(true);
            httpUrlConn.setConnectTimeout(timeOut);
            httpUrlConn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            httpUrlConn.setRequestProperty("Content-Length", Integer.toString(postData.length()));
            OutputStream os = httpUrlConn.getOutputStream();
            OutputStreamWriter osw = new OutputStreamWriter(os, "utf-8");
            osw.write(postData);
            osw.flush();
            osw.close();

            if (httpUrlConn.getResponseCode() == 200) {
                reader = new InputStreamReader(httpUrlConn.getInputStream(), "UTF-8");
                in = new BufferedReader(reader);
                while ((line = in.readLine()) != null) {
                    sb.append(line);
                }
//				 sb.append("OK");
            }
            return sb.toString();
        } catch (Exception e) {
            System.out.println("sendSoapToWebService error" + e.getMessage());
            return "false:" + e.getMessage();
        } finally {
            try {
                if (in != null) {
                    in.close();
                }
                if (reader != null) {
                    reader.close();
                }
                if (httpUrlConn != null) {
                    httpUrlConn.disconnect();
                }
            } catch (IOException e) {
            }
        }
    }
}
```

