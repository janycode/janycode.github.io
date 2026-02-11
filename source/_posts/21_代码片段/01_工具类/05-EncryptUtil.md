---
title: 05-EncryptUtil
date: 2016-5-3 11:22:34
tags:
- 工具类
categories: 
- 21_代码片段
- 01_工具类
---



### 1. EncryptUtil

```java
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.HashMap;

/**
 * 实现常用的加解密 方法，支持 Base64 MD5 SHA AES RSA(公私钥) 加密
 *
 * @description: 常用的加解密
 */
public class EncryptUtil {
    public static final String SHA1 = "SHA-1";
    public static final String SHA256 = "SHA-256";
    public static final String SHA384 = "SHA-384";
    public static final String SHA512 = "SHA-512";

    public static final String PUBKEY = "public_key";
    public static final String PRIKEY = "private_key";

    /**
     * base64 编码-String
     *
     * @param msg String
     * @return 密文字符串
     */
    public static String base64enc(String msg) {
        return Base64.getEncoder().encodeToString(msg.getBytes());
    }

    /**
     * base64 解码-String
     *
     * @param msg 密文字符串
     * @return 原字符串
     */
    public static String base64dec(String msg) {
        return new String(Base64.getDecoder().decode(msg));
    }

    /**
     * base64 编码-Byte[]
     *
     * @param msg byte[]数组的原数据
     * @return 密文字符串
     */
    private static String base64encByte(byte[] msg) {
        return Base64.getEncoder().encodeToString(msg);
    }

    /**
     * base64 解码-Byte[]
     *
     * @param msg 密文字符串
     * @return byte[]数组的原数据
     */
    private static byte[] base64decByte(String msg) {
        return Base64.getDecoder().decode(msg);
    }

    /**
     * MD5 摘要加密：不可逆-单向加密
     *
     * @param msg 原数据字符串
     * @return 密文字符串
     */
    public static String md5(String msg) {
        try {
            //创建摘要算法对象
            MessageDigest messageDigest = MessageDigest.getInstance("MD5");
            messageDigest.update(msg.getBytes());
            return base64encByte(messageDigest.digest());
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * SHA 摘要加密：不可逆-单项加密
     *
     * @param type SHA摘要类型：SHA-1 SHA-256 SHA-384 SHA-512
     * @param msg  原数据字符串
     * @return 密文字符串
     */
    public static String sha(String type, String msg) {
        try {
            //创建摘要算法对象
            MessageDigest messageDigest = MessageDigest.getInstance(type);
            messageDigest.update(msg.getBytes());
            return base64encByte(messageDigest.digest());
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 对称加密：生成密钥（for DES、AES等）
     *
     * @return 密钥字符串
     */
    public static String createAESKey() {
        try {
            //1、创建随机key
            KeyGenerator generator = KeyGenerator.getInstance("AES");
            generator.init(128);
            SecretKey key = generator.generateKey();
            return base64encByte(key.getEncoded());
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * AES 加密 返回的是base64格式
     *
     * @param key 密钥字符串
     * @param msg 原数据字符串
     * @return 密文字符串
     */
    public static String aesenc(String key, String msg) {
        SecretKeySpec secretKeySpec = new SecretKeySpec(base64decByte(key), "AES");
        try {
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
            return base64encByte(cipher.doFinal(msg.getBytes()));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * AES 解密 返回的是base64格式
     *
     * @param key 密钥字符串
     * @param msg 原数据字符串
     * @return 密文字符串
     */
    public static String aesdec(String key, String msg) {
        SecretKeySpec secretKeySpec = new SecretKeySpec(base64decByte(key), "AES");
        try {
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);
            return new String(cipher.doFinal(base64decByte(msg)));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 非对称加密：生成一对儿，即公私钥（for RSA、DSA等）
     *
     * @return HashMap类型的一对儿密钥（公私钥）
     */
    public static HashMap<String, String> createRSAKey() {
        try {
            KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
            KeyPair keyPair = generator.generateKeyPair();
            //创建使用私钥
            RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();
            //创建使用公钥
            RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
            HashMap<String, String> keys = new HashMap<>();
            keys.put(PUBKEY, base64encByte(publicKey.getEncoded()));
            keys.put(PRIKEY, base64encByte(privateKey.getEncoded()));
            return keys;
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * RSA 私钥-加密
     *
     * @param key 密钥字符串（私钥）  keyPair.getPrivate()
     * @param msg 原数据字符串
     * @return 密文字符串
     */
    public static String rsaEnc(String key, String msg) {
        try {
            //转换私钥
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(base64decByte(key));
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PrivateKey privateKey = keyFactory.generatePrivate(keySpec);
            Cipher cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.ENCRYPT_MODE, privateKey);
            return base64encByte(cipher.doFinal(msg.getBytes()));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * RSA  公钥-解密
     *
     * @param key 密钥字符串（公钥）  keyPair.getPublic()
     * @param msg 原数据字符串
     * @return 密文字符串
     */
    public static String rsaDec(String key, String msg) {
        try {
            //转换公钥
            X509EncodedKeySpec keySpec = new X509EncodedKeySpec(base64decByte(key));
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PublicKey publicKey = keyFactory.generatePublic(keySpec);
            Cipher cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.DECRYPT_MODE, publicKey);
            return new String(cipher.doFinal(base64decByte(msg)), "UTF-8");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
```

### 2. RSAUtil

```java
import lombok.extern.slf4j.Slf4j;
import javax.crypto.Cipher;
import java.io.ByteArrayOutputStream;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

/**
 * @ClassName RSAUtil
 * @Description RSA工具类
 * @createTime 2022年11月28日 16:23:00
 */
@Slf4j
public class RSAUtil {
    //签名算法名称
    private static final String RSA_KEY_ALGORITHM = "RSA";

    //标准签名算法名称
    private static final String RSA_SIGNATURE_ALGORITHM = "SHA1withRSA";
    private static final String RSA2_SIGNATURE_ALGORITHM = "SHA256withRSA";

    //RSA密钥长度,默认密钥长度是1024,密钥长度必须是64的倍数，在512到65536位之间,不管是RSA还是RSA2长度推荐使用2048
    private static final int KEY_SIZE = 1024;

    /**
     * @Date: 2022/12/28 5:00 PM
     * @MethodName: generateKey
     * @Description 生成公私钥对
     * @Param []
     * @Return java.util.Map<java.lang.String, java.lang.String>
     */
    public static Map<String, String> generateKey() {
        KeyPairGenerator keygen;
        try {
            keygen = KeyPairGenerator.getInstance(RSA_KEY_ALGORITHM);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("RSA初始化密钥出现错误,算法异常");
        }
        SecureRandom secrand = new SecureRandom();
        //初始化随机产生器
        secrand.setSeed("Alian".getBytes());
        //初始化密钥生成器
        keygen.initialize(KEY_SIZE, secrand);
        KeyPair keyPair = keygen.genKeyPair();
        //获取公钥并转成base64编码
        byte[] pub_key = keyPair.getPublic().getEncoded();
        String publicKeyStr = Base64.getEncoder().encodeToString(pub_key);
        //获取私钥并转成base64编码
        byte[] pri_key = keyPair.getPrivate().getEncoded();
        String privateKeyStr = Base64.getEncoder().encodeToString(pri_key);
        //创建一个Map返回结果
        Map<String, String> keyPairMap = new HashMap<>();
        keyPairMap.put("publicKeyStr", publicKeyStr);
        keyPairMap.put("privateKeyStr", privateKeyStr);
        return keyPairMap;
    }

    /**
     * @Date: 2022/12/28 5:01 PM
     * @MethodName: encryptByPublicKey
     * @Description 公钥分段加密
     * @Param [data, publicKeyStr]
     * @Return java.lang.String
     */
    public static String encryptByPublicKey(String data, String publicKeyStr) {
        try {
            byte[] decodePublicKeyByte = Base64.getDecoder().decode(publicKeyStr);
            //调用X509EncodedKeySpec对象,转换格式
            X509EncodedKeySpec keySpec = new X509EncodedKeySpec(decodePublicKeyByte);
            //调用密钥工厂
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PublicKey publicKey = keyFactory.generatePublic(keySpec);

            //调用Java加密的Cipher对象，
            Cipher cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.ENCRYPT_MODE, publicKey);//第一个参数表示这是加密模式，第二个参数表示密钥

            //分段加密
            byte[] bytesContent = data.getBytes();
            int inputLen = bytesContent.length;
            int offLen = 0;//偏移量
            int i = 0;
            ByteArrayOutputStream bops = new ByteArrayOutputStream();
            while (inputLen - offLen > 0) {
                byte[] cache;
                if (inputLen - offLen > 117) {
                    cache = cipher.doFinal(bytesContent, offLen, 117);
                } else {
                    cache = cipher.doFinal(bytesContent, offLen, inputLen - offLen);
                }
                bops.write(cache);
                i++;
                offLen = 117 * i;
            }
            bops.close();
            byte[] encryptedData = bops.toByteArray();

            //使用Base64对加密结果进行编码
            String encode = Base64.getEncoder().encodeToString(encryptedData);
            return encode;
        } catch (Exception e) {
            log.error("加密失败：", e);
            return "";
        }
    }

    /**
     * @Date: 2022/12/28 5:00 PM
     * @MethodName: decryptByPrivateKey
     * @Description 私钥解密(分段解密)
     * @Param [data, privateKeyStr]
     * @Return java.lang.String
     */
    public static String decryptByPrivateKey(String data, String privateKeyStr) throws Exception {
        try {
            //Java原生base64解码
            byte[] priKey = Base64.getDecoder().decode(privateKeyStr);
            //创建PKCS8编码密钥规范
            PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(priKey);
            //返回转换指定算法的KeyFactory对象
            KeyFactory keyFactory = KeyFactory.getInstance(RSA_KEY_ALGORITHM);
            //根据PKCS8编码密钥规范产生私钥对象
            PrivateKey privateKey = keyFactory.generatePrivate(pkcs8KeySpec);
            //根据转换的名称获取密码对象Cipher（转换的名称：算法/工作模式/填充模式）
            Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
            //用私钥初始化此Cipher对象（解密模式）
            cipher.init(Cipher.DECRYPT_MODE, privateKey);

            byte[] bytesContent = Base64.getDecoder().decode(data.getBytes());
            int inputLen = bytesContent.length;
            int offLen = 0;
            int i = 0;
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            while (inputLen - offLen > 0) {
                byte[] cache;
                if (inputLen - offLen > 128) {
                    cache = cipher.doFinal(bytesContent, offLen, 128);
                } else {
                    cache = cipher.doFinal(bytesContent, offLen, inputLen - offLen);
                }
                byteArrayOutputStream.write(cache);
                i++;
                offLen = 128 * i;

            }
            byteArrayOutputStream.close();
            byte[] byteArray = byteArrayOutputStream.toByteArray();

            //使用Base64对加密结果进行编码
            return new String(byteArray);
        } catch (Exception e) {
            log.error("解密失败,待加密内容：{}", data, e);
            return "";
        }
    }

    /**
     * @Date: 2022/12/28 5:03 PM
     * @MethodName: sign
     * @Description RSA签名
     * @Param [data, priKey, signType]
     * @Return java.lang.String
     */
    public static String sign(byte[] data, byte[] priKey, String signType) throws Exception {
        //创建PKCS8编码密钥规范
        PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(priKey);
        //返回转换指定算法的KeyFactory对象
        KeyFactory keyFactory = KeyFactory.getInstance(RSA_KEY_ALGORITHM);
        //根据PKCS8编码密钥规范产生私钥对象
        PrivateKey privateKey = keyFactory.generatePrivate(pkcs8KeySpec);
        //标准签名算法名称(RSA还是RSA2)
        String algorithm = RSA_KEY_ALGORITHM.equals(signType) ? RSA_SIGNATURE_ALGORITHM : RSA2_SIGNATURE_ALGORITHM;
        //用指定算法产生签名对象Signature
        Signature signature = Signature.getInstance(algorithm);
        //用私钥初始化签名对象Signature
        signature.initSign(privateKey);
        //将待签名的数据传送给签名对象(须在初始化之后)
        signature.update(data);
        //返回签名结果字节数组
        byte[] sign = signature.sign();
        //返回Base64编码后的字符串
        return Base64.getEncoder().encodeToString(sign);
    }

    /**
     * RSA校验数字签名
     *
     * @param data     待校验数据
     * @param sign     数字签名
     * @param pubKey   公钥
     * @param signType RSA或RSA2
     * @return boolean 校验成功返回true，失败返回false
     */
    public static boolean verify(byte[] data, byte[] sign, byte[] pubKey, String signType) throws Exception {
        //返回转换指定算法的KeyFactory对象
        KeyFactory keyFactory = KeyFactory.getInstance(RSA_KEY_ALGORITHM);
        //创建X509编码密钥规范
        X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(pubKey);
        //根据X509编码密钥规范产生公钥对象
        PublicKey publicKey = keyFactory.generatePublic(x509KeySpec);
        //标准签名算法名称(RSA还是RSA2)
        String algorithm = RSA_KEY_ALGORITHM.equals(signType) ? RSA_SIGNATURE_ALGORITHM : RSA2_SIGNATURE_ALGORITHM;
        //用指定算法产生签名对象Signature
        Signature signature = Signature.getInstance(algorithm);
        //用公钥初始化签名对象,用于验证签名
        signature.initVerify(publicKey);
        //更新签名内容
        signature.update(data);
        //得到验证结果
        return signature.verify(sign);
    }

    public static void main(String[] args) throws Exception {
        Map<String, String> keyMap = RSAUtil.generateKey();
        String publicKeyStr = keyMap.get("publicKeyStr");
        String privateKeyStr = keyMap.get("privateKeyStr");

        System.out.println("-----------------生成的公钥和私钥------------------------------");
        System.out.println("获取到的公钥：" + publicKeyStr);
        System.out.println("获取到的私钥：" + privateKeyStr);

        // 数字签名
        String data = "tranSeq=1920542585&amount=100&payType=wechat";
        System.out.println("待签名的数据：" + data);
        String sign = RSAUtil.sign(data.getBytes(), Base64.getDecoder().decode(privateKeyStr), "RSA");
        System.out.println("数字签名结果：" + sign);

        boolean verify = RSAUtil.verify(data.getBytes(), Base64.getDecoder().decode(sign), Base64.getDecoder().decode(publicKeyStr), "RSA");
        System.out.println("数字签名验证结果：" + verify);

        String encryptText = encryptByPublicKey(data, publicKeyStr);
        System.out.println("密文：" + encryptText);

        String decryptText = decryptByPrivateKey(encryptText, privateKeyStr);
        System.out.println("解密后信息：" + decryptText);
    }
}
```

