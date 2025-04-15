---
title: 免费SSL证书配置https自动续期
date: 2024-5-28 19:57:23
index_img: https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241024153859.png
tags: 
- 服务器
- ssl
- https
categories:
- 06_服务器
- 00_Server
---



参考资料：

* 使用Let's Encrypt免费申请泛域名解析：https://www.cnblogs.com/michaelshen/p/18538178



## 1. 安装Certbot

### 1.1 snapd

```bash
yum update
#如果有epel-aliyuncs-release，这一步则不需要安装 epel-release
yum -y install epel-release
yum -y install snapd

#启动并设置开机启动
systemctl start snapd
systemctl enable snapd

#为了确保 /snap 目录可用，在某些情况下需要创建一个符号链接
ln -s /var/lib/snapd/snap /snap

```

### 1.2 certbot

```bash
#安装Certbot
snap install --classic certbot
#创建一个符号链接，确保可以执行certbot命令（相当于快捷方式）
ln -s /snap/bin/certbot /usr/bin/certbot
```



## 2. 申请泛域名证书

泛域名证书（Wildcard Certificate）可以为同一主域名下的所有子域名提供 HTTPS 支持。例如，`*.example.com` 可以覆盖 `blog.example.com`、`api.example.com` 等子域名。

#### 使用 DNS 验证申请泛域名证书

Let’s Encrypt 要求通过 **DNS-01** 验证来申请泛域名证书。运行以下命令（**`核心命令`**）：

```bash
certbot certonly --manual --preferred-challenges dns -d *.example.com -d example.com
```

Certbot 会要求你在 域名解析的 DNS（比如阿里云DNS解析）中创建一个特定的 **TXT 记录** 以验证域名的所有权。

```TXT
_acme-challenge.example.com  IN  TXT  "certbot给出的随机字符串"
```

前往你的域名 DNS 管理页面，添加该记录后，返回命令行按下 `Enter`。

![img](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250415112607.png)

```bash
#真实案例：
[root@ecs-webmanage ~]# certbot certonly --manual --preferred-challenges dns -d *.example.com -d example.com
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Requesting a certificate for *.example.com and example.com

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Please deploy a DNS TXT record under the name:

_acme-challenge.example.com.

with the following value:

lpzeQIa8na7tqaPJGQt-zVS1sv5a0FojFGTPfxepQdw

Before continuing, verify the TXT record has been deployed. Depending on the DNS
provider, this may take some time, from a few seconds to multiple minutes. You can
check if it has finished deploying with aid of online tools, such as the Google
Admin Toolbox: https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.example.com.
Look for one or more bolded line(s) below the line ';ANSWER'. It should show the
value(s) you've just added.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Press Enter to Continue

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/example.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/example.com/privkey.pem
This certificate expires on 202x-07-14.
These files will be updated when the certificate renews.

NEXT STEPS:
- This certificate will not be renewed automatically. Autorenewal of --manual certificates requires the use of an authentication hook script (--manual-auth-hook) but one was not provided. To renew this certificate, repeat this same certbot command before the certificate's expiry date.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
If you like Certbot, please consider supporting our work by:
 * Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
 * Donating to EFF:                    https://eff.org/donate-le
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```



## 3.配置nginx

### 申请的 SSL 证书文件所在目录

当使用 **Certbot** 成功申请到 SSL 证书后，证书文件将默认保存在以下目录中：

```bash
/etc/letsencrypt/live/your-domain-name/
```

具体包含以下几个文件：

- `cert.pem`：这是你的 **SSL 证书** 文件。
- `privkey.pem`：这是你的 **私钥** 文件，务必妥善保管，切勿泄露。
- `chain.pem`：这是 **中间证书链** 文件，用于验证证书的完整性。
- `fullchain.pem`：这是 **完整证书链** 文件，通常用于 Nginx 或 Apache 的 SSL 配置中。

例如，如果你的域名是 `example.com`，则目录路径为：

```bash
/etc/letsencrypt/live/example.com/
```

你可以使用以下命令查看证书详细信息：

```bash
sudo certbot certificates
```

输出示例：

```TXT
Certificate Name: example.com
    Domains: example.com www.example.com
    Expiry Date: 2024-02-10 14:30:00+00:00 (VALID: 75 days)
    Certificate Path: /etc/letsencrypt/live/example.com/fullchain.pem
    Private Key Path: /etc/letsencrypt/live/example.com/privkey.pem
```

> **提示**：为了避免证书路径错误，建议在 Nginx 或 Apache 配置中直接使用 `fullchain.pem` 和 `privkey.pem` 两个文件。

### nginx配置证书示例

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
 
    location / {
        return 301 https://$host$request_uri;
    }
}
 
server {
    listen 443 ssl;
    server_name example.com www.example.com;
 
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
 
    location / {
        proxy_pass http://127.0.0.1:8080;
    }
}
```

如果使用docker nginx，可以通过docker挂载卷使用证书，比如我就是这样使用的：
`compose.yml：`

```yml
services:
  nginx:
    image: nginx:latest
    networks:
     - spy
    ports:
      - "80:80"
      - "443:443"
    environment:
      - TZ=Asia/Shanghai # 设置为上海时区
    volumes:
    # 主配置
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:rw 
    # include配置
      - ./nginx/conf.d/:/etc/nginx/conf.d/:rw
    # 证书
      - /etc/letsencrypt/live/spystudy.cn/fullchain.pem:/etc/ssl/certs/spystudy.cn/fullchain.pem:rw
      - /etc/letsencrypt/live/spystudy.cn/privkey.pem:/etc/ssl/certs/spystudy.cn/private.pem:rw
    # 日志
      - ./nginx/logs/:/var/log/nginx/:rw
```

然后nginx配置文件：

```conf
server {
    listen 443 ssl;
    server_name spystudy.cn;
 
    ssl_certificate /etc/ssl/certs/spystudy.cn/fullchain.pem;
    ssl_certificate_key /etc/ssl/certs/spystudy.cn/private.pem;
 
    return 301 https://www.spystudy.cn$request_uri;
}
```

### 查看证书信息和剩余时间

证书安装完成后，可以通过访问 `https://example.com` 检查是否成功启用了 HTTPS。你也可以使用以下命令查看证书状态：

```bash
certbot certificates
```

如果证书信息显示正确，并且 `expiry date` 在未来日期，说明配置成功。



## 4.自动续期

### 手动

```bash
#手动续期
certbot renew
```

将手动排续期加入定时任务：

```
crontab -e
0 */12 * * * /usr/bin/certbot renew --quiet
```

每 12 小时（即每天的 0 点和 12 点）执行一次 certbot renew 命令，--quiet 选项用于在执行时不输出过多信息。

也可参考下方设置：

```bash
#测试续期
sudo certbot renew --dry-run

#为了尽量确保证书不失效，我们配置一下定时任务即可更新证书并重启nginx，使用 crontab -e 配置定时任务：
0 0 * 1 * sudo certbot renew && nginx -s reload

#使用certbot的renew命令续签之前申请的通配符域名时遇到了一个报错，本文记录该问题的解决方法。
#使用的命令如下，由于certbot判定我的这个证书还没有接近到期，所以使用--force-renew参数来强制续签证书。
certbot renew --force-renew

#报错
The error was: PluginError('An authentication script must be provided with --manual-auth-hook when using the manual plugin non-interactively.',). Skipping.

可以看到，问题的原因是：An authentication script must be provided with --manual-auth-hook when using the manual plugin non-interactively.
也就是需要使用--manual-auth-hook参数来指定一个脚本来续签证书。
问题原因
出现这个问题的原因是，第一次申请证书的时候使用的是DNS验证方式，而续签时需要使用脚本来更新DNS记录，如果你想使用脚本来更新的话，可以从github中搜寻相关自动DNS验证脚本，本文将使用另一种方式解决。
问题解决
可以使用standalone命令来解决续签问题，使用该方法的前提是，本机的certbot目录中已存在之前申请过的证书相关资料

certbot certonly --standalone
```



### 自动

```bash
# systemctl list-timers
NEXT                         LEFT          LAST                         PASSED  UNIT                         ACTIVATES
Tue 202x-04-15 17:20:30 CST  3h 20min left Mon 202x-04-14 17:20:30 CST  20h ago systemd-tmpfiles-clean.timer systemd-tmpfiles-clean.service
Tue 202x-04-15 18:19:00 CST  4h 18min left n/a                          n/a     snap.certbot.renew.timer     snap.certbot.renew.service

```

系统使用 `systemd timer` 来管理定时任务。如果看到类似下面的输出，则表示 `certbot` 的自动续期 timer 已启用：

```
Tue 202x-04-15 18:19:00 CST  4h 18min left n/a                          n/a     snap.certbot.renew.timer     snap.certbot.renew.service
```

- **NEXT**：下一次激活时间为 `202x-04-15 18:19:00`（周二）。
- **LEFT**：距离下次激活还有 **4 小时 18 分钟**。
- **LAST**：`n/a`，表示该定时器从未激活过（可能是首次运行或刚安装）。
- **PASSED**：`n/a`，同上。
- **UNIT**：定时器单元为 `snap.certbot.renew.timer`，注意前缀 `snap.`，说明这是通过 **Snap 包**安装的 Certbot 自动续期定时器（而非传统的 RPM/DEB 包）。
- **ACTIVATES**：激活 `snap.certbot.renew.service` 服务，用于执行 SSL 证书续期任务。



> 若需修改续期频率，需编辑 Snap 定时器的配置（需通过 Snap 命令或修改系统级定时器文件），但默认配置已足够安全（证书到期前 30 天内才会实际续期）。



## 5.不同服务器使用

我在服务器A已经生成了证书，用于 test 和 pre的域名；

我在服务器B还需要拷贝证书，用于 prod 的域名。

因此需要做如下操作：

**第一步**：参考步骤 1.安装Certbot

**第二步**：拷贝服务器A上生成的文件到服务器B，并设置相应的权限和软连接

```bash
#服务器A上执行，拷贝到服务器B
scp -r /etc/letsencrypt/live user@IP地址:/etc/letsencrypt/
scp -r /etc/letsencrypt/renewal user@IP地址:/etc/letsencrypt/
scp -r /etc/letsencrypt/archive user@IP地址:/etc/letsencrypt/

#服务器B上做如下操作
chown -R root:root /etc/letsencrypt
chmod -R 600 /etc/letsencrypt/archive
chmod -R 644 /etc/letsencrypt/renewal
#注意域名路径
cd /etc/letsencrypt/live/example.com
rm -f cert.pem chain.pem fullchain.pem privkey.pem
ln -s /etc/letsencrypt/archive/example.com/cert1.pem cert.pem
ln -s /etc/letsencrypt/archive/example.com/chain1.pem chain.pem
ln -s /etc/letsencrypt/archive/example.com/fullchain1.pem fullchain.pem
ln -s /etc/letsencrypt/archive/example.com/privkey1.pem privkey.pem
ls -l /etc/letsencrypt/live/example.com

```

**第三步**：验证拷贝结果

```bash
#执行命令
certbot certificates

Saving debug log to /var/log/letsencrypt/letsencrypt.log
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Found the following certs:
  Certificate Name: example.com
    Serial Number: 6f1e25e49555e71e57857ea2b13ae68f604
    Key Type: ECDSA
    Domains: *.example.com example.com
    Expiry Date: 202x-07-14 02:27:54+00:00 (VALID: 89 days)
    Certificate Path: /etc/letsencrypt/live/example.com/fullchain.pem
    Private Key Path: /etc/letsencrypt/live/example.com/privkey.pem
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```

**第四步**：检查自动续期timer是否启用

```bash
#检查certbot的timer是否存在
systemctl list-timers |grep certbot
Wed 202x-04-16 04:52:00 CST  13h left    Tue 202x-04-15 14:36:05 CST  18min ago     snap.certbot.renew.timer     snap.certbot.renew.service
```

**第五步**：服务器B修改相应的nginx ssl证书配置即可，参考服务器A。