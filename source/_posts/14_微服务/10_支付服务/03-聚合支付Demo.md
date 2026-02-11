---
title: 03-聚合支付Demo
date: 2020-03-02 17:59:44
tags:
- 微服务
- 支付服务
- SpringCloudAlibaba
categories: 
- 14_微服务
- 10_支付服务
---

![image-20200830120530611](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200830120531.png)



### 1. 页面 demo

![image-20200830120630324](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20200830120631.png)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<title>支付系统-体验页面</title>
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.0/dist/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
		 crossorigin="anonymous">
		<style type="text/css">
			input {
				margin-bottom: 10px;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<!-- 订单信息 -->
			<div class="row" style="margin-top: 20px;padding: 20px;">
				<div class="col-sm-12">
					<input class="form-control" id="oid" placeholder="请输入订单号" />
					<input class="form-control" id="orderdes" placeholder="请输入订单的描述信息" />
					<input class="form-control" type="number" id="price" placeholder="请输入价格" />
					<select class="form-control form-control-lg" id="paytype">
						<option value="-1">--请选择支付方式--</option>
						<option value="1">支付宝</option>
						<option value="2">微信</option>
					</select>
					<button class="btn btn-primary" style="margin-top: 10px;width: 100%;" id="btnpay">发起支付</button>
				</div>
			</div>
			<!-- 扫码页面 -->
			<div class="row">
				<div class="col align-self-center">
					<div class="card" style="display: none;text-align: center;" id="dvpay">
						<h6>欢迎选择：<label id="lb1"></label> 支付</h6>
						<img style="width: 300px;height: 300px;" id="payimg" />
						<p>请扫描支付哟！</p>
					</div>
				</div>
			</div>
			<!-- 查询订单支付状态 -->
			<div class="row">
				<div class="col align-self-center">
					<input class="form-control" id="queryoid" placeholder="请输入订单号" />
					<button class="btn-primary" id="btnquery">查询订单的支付状态</button>
					<p id="pmsg"></p>
				</div>
			</div>
		</div>
		<script type="application/javascript" src="js/jquery-3.4.1.min.js"></script>
		<script type="application/javascript">
			var l;
			$(function() {
				$("#btnpay").click(function() {
					var o = new Object();
					o.oid = $("#oid").val();
					o.orderdes = $("#orderdes").val();
					o.price = parseFloat($("#price").val()) * 100;
					o.paytype = $("#paytype").val();
					$.ajax({
						method: "post",
						url: "http://localhost:8085/api/pay/sendpay",
						data: JSON.stringify(o),
						headers: {
							"Content-Type": "application/json;charset=UTF-8"
						},
						success: function(obj) {
							if (obj.code = 10000) {
								$("#dvpay").css("display", "block");
								$("#payimg")[0].src = obj.data;
								//开启轮训
								l = setInterval("lxstatus()", 1000);
							}
						}
					})
				});

				$("#btnquery").click(function() {
					console.log("dj");
					$.get("http://localhost:8085/api/pay/querypay/" + $("#queryoid").val(), null, function(obj) {
						console.log(obj);
						if (obj.code == 10000) {
							$("#pmsg").text(obj.data);
						} else {
							alert(obj.msg);
						}
					})
				});
			});

			function lxstatus() {
				$.get("http://localhost:8085/api/pay/querypay/" + $("#oid").val(), null, function(obj) {
					if (obj.code == 10000) {
						if (obj.data == "支付成功") {
							//关闭定时任务
							clearInterval(l);
							alert("亲，支付成功啦");
						}
					}
				})
			}
		</script>
	</body>
</html>

```



### 2. 后端 demo

融合支付宝支付、微信支付的工具类和配置信息。

#### 2.1 controller

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pay/")
public class PayController {
    @Autowired
    private PayService service;

    @PostMapping("sendpay")
    public R<String> createPay(@RequestBody PayDto dto) {
        return service.createPay(dto);
    }

    @GetMapping("querypay/{oid}")
    public R queryPay(@PathVariable String oid) {
        return service.queryPay(oid);
    }

    @PostMapping("closepay/{oid}")
    public R refundPay(@PathVariable String oid) {
        return service.closePay(oid);
    }
}
```

#### 2.2 service

```java
public interface PayService {
    //生成支付信息，返回支付二维码
    R<String> createPay(PayDto dto);

    //查询支付状态
    R<String> queryPay(String oid);

    //关闭订单
    R<String> closePay(String oid);
}
```

```java
import com.alibaba.fastjson.JSON;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Base64;

@Service
public class PayServiceImpl implements PayService {
    @Autowired
    private OrderPayDao dao;

    @Override
    public R<String> createPay(PayDto dto) {
        if (dto.getPaytype() < 3) {
            AliPayDto aliPayDto = new AliPayDto();
            String qrcodeurl = null;
            if (dto.getPaytype() == 1) {
                //支付宝
                aliPayDto.setOut_trade_no(dto.getOid());
                aliPayDto.setSubject(dto.getOrderdes());
                aliPayDto.setTotal_amount(dto.getPrice() / 100.0);
                qrcodeurl = AliPayUtil.createPayUrl(JSON.toJSONString(aliPayDto));
            } else if (dto.getPaytype() == 2) {
                //微信
                qrcodeurl = WxPayUtil.wxpay_create(dto);
            }
            if (!StringUtils.isEmpty(qrcodeurl)) {
                //拥有支付链接
                String url = "http://localhost:8085/api/qrcode/payqrcode/" + Base64.getUrlEncoder().encodeToString(qrcodeurl.getBytes());
                OrderPay pay = new OrderPay();
                pay.setBody(dto.getOrderdes());
                pay.setOid(Long.parseLong(dto.getOid()));
                pay.setPayurl(url);
                pay.setPaymoney(dto.getPrice());
                pay.setType(dto.getPaytype());
                //dao.insert(pay);
                return R.ok(url);
            }
            return R.error("亲，第三方支付服务不可用！", null);
        } else {
            return R.error("亲，你选择的支付方式目前还不支持！", null);
        }
    }

    @Override
    public R<String> queryPay(String oid) {
        OrderPay pay = dao.selectByOid(Long.parseLong(oid));
        if (pay != null) {
            if (pay.getFlag() == 1) {
                //未支付
                String r, msg = null;
                if (pay.getType() == 1) {
                    //支付宝
                    r = AliPayUtil.queryPay(oid);
                } else {
                    //微信支付
                    r = WxPayUtil.wxpay_query(oid);
                }
                System.err.println(r);
                if (!StringUtils.isEmpty(r)) {
                    switch (r) {
                        case "WAIT_BUYER_PAY":
                        case "NOTPAY":
                            msg = "未付款";
                            break;
                        case "TRADE_CLOSED":
                        case "CLOSED":
                        case "REVOKED":
                            msg = "交易超时关闭";
                            break;
                        case "TRADE_SUCCESS":
                        case "SUCCESS":
                            msg = "支付成功";
                            break;
                        case "TRADE_FINISHED":
                            msg = "交易结束";
                            break;
                        default:
                            msg = "异常状态";
                            break;
                    }
                }
                return R.ok(msg);
            }
            return R.error();
        } else {
            return R.error("亲，请检查订单号！", null);
        }
    }

    @Override
    public R<String> closePay(String oid) {
        OrderPay pay = dao.selectByOid(Long.parseLong(oid));
        if (pay != null) {
            if (pay.getFlag() == 1) {
                //关闭订单
                String r;
                if (pay.getType() == 1) {
                    r = AliPayUtil.closePay(oid);
                } else {
                    r = WxPayUtil.wxpay_close(oid);
                }
                if (StringUtils.isEmpty(r)) {
                    return R.error("关闭订单失败！", null);
                } else {
                    return R.ok();
                }
            } else {
                return R.error("亲，无法关闭订单，请检查订单状态", null);
            }
        } else {
            return R.error("亲，请检查订单号！", null);
        }
    }
}
```

