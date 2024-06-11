# 跑通示例项目

## 服务端说明

### 环境准备

1. 部署要求

Windows 或者 Linux 服务器

2. 环境要求

- JDK 1.8+
- Redis
- Redis 绑定地址更改为 127.0.0.1

### 服务配置

#### 代码下载

当部署环境准备好后，通过 [GitHub 链接下载服务端代码](https://github.com/easemob/Easemob-AIGCService-Example)。

#### 信息配置

服务端配置信息全部集中在以下文件中，主要配置包含三个部分：环信即时通讯 IM、miniMax 和 redis，配置内容如下：

```
src/main/resources/application.yml
```

**环信即时通讯 IM 信息配置**
 
1. 登录[环信即时通讯云控制台](https://console.easemob.com/user/login)，获取配置信息。

```yaml
logging:
  level:
    com.easemob.im.http: debug  #启动之后可打印的日志级别
server:
  port: 80             #修改启动端口，只能为数字(请确保该端口没有被占用)
easemob:
  appkey: {appkey}     # 创建应用获取到的 App Key，可通过环信即时通讯云控制台的 “应用详情” 页面上的 “APPKEY” 字段获取。
  clientId:{clientId}  #  App 的 client_id，可通过环信即时通讯云控制台的 “应用详情” 页面上的 “Client ID” 字段获取。
  clientSecret:{clientSecret}  #  App 的 client_secret，可通过环信即时通讯云控制台的 “应用详情” 页面上的 “ClientSecret” 字段获取。
```

![img](@static/images/aigc/app_detail.png)

2. 设置用户注册模式为开放注册，关闭好友关系检查。

![img](@static/images/aigc/user_register_contact.png)

3. 创建机器人的账号。

选择**应用概览** > **用户认证**，创建 8 个机器人的账号。

:::tip
不能修改这 8 个基础账号的用户 ID，否则需要调整代码中 `BotSettingUtil` 中八个对应机器人的账号。
:::

![img](@static/images/aigc/robot_account_create.png)

4. 配置回调规则。

选择**即时通讯** > **功能配置** > **消息回调**，点击**添加回调地址**，配置发送前回调和发送后回调地址。请确保环信即时通讯 IM 可以通过外网访问到回调地址。

![img](@static/images/aigc/callback_address.png)

**大语言模型（LLM）信息配置**

本代码示例以 miniMax 为例 [MiniMax 开放平台快速开始](https://platform.minimaxi.com/document/guides/example?id=6433f36f94878d408fc82947)，若使用其他大语言模型，可按其他语言模型配置要求进行调整。

```yaml
miniMax:
  groupId:{groupId}  # MiniMax 基础信息的 groupID。选择 “MiniMax账号管理” > “账户信息”页面，获取 “groupID” 字段。
  appkey: {appkey}   # MiniMax 的接口密钥。当需要复制 API 密钥时，可以重新创建一个以完成复制操作。
  url: https://api.minimax.chat/v1/text/chatcompletion_pro?GroupId=
```  

**redis 配置**

redis 安装完成以后，设置上 redis 的密码(也可以设置为空)，确保 “host：port" 链接可以访问 redis 即可。

```yaml
  redis:
    host: {host}           #redis 地址
    port: {port}           #redis 端口
    password: {password}   #redis 密码
    # 连接超时时间（毫秒）
    timeout: 30000
    # 连接池中的最大空闲连接
    max-idle: 8
    # 连接池中的最小空闲连接
    min-idle: 10
    # 连接池最大连接数（使用负值表示没有限制）
    max-active: 100
    # 连接池最大阻塞等待时间（使用负值表示没有限制）
    max-wait: -1
```      

### 启动说明

1. `host` 填写为 `127.0.0.1`。
2. `port` 填写为 redis 所占用的端口。
3. `password` 填写 redis 的密码(如果没有密码，使用 # 注释该配置)。

![img](@static/images/aigc/redis_password.png)

4. 使用 `mvn install` 将项目打包为 jar。

![img](@static/images/aigc/jar.png)

5. 找到对应位置的 jar 包，上传到服务器。

使用命令启动即可：

```
nohup java -jar $APP_DIR/chattyai-0.0.1-SNAPSHOT.jar --server.port=$PORT ./chattyai.log 2>&1 &
```

- $APP_DIR 替换为上传 jar 包存在的根路径。
- $PORT 替换为需要占用的端口。

6. 查看启动日志

如果需要额外配置 nginx 的代理，则将对应的请求拦截，代理到 $PORT 端口即可。

```
tail -f $APP_DIR/chattyai.log 
```

### Q&A

1. 项目为何启动失败？

  确保 JDK 配置正确，端口没有被占用，redis 能被访问到。

2. 项目启动后为何无法访问？

  - 配置 nginx 的情况下，请确保 nginx 配置正确。
  - 未配置 nginx 的情况下，请确保端口对外开放。

3. MiniMax 的调用失败，无返回结果，是什么原因？

  请确保 MiniMax 有余额，否则可能导致调用 MiniMax 的调用失败。


## 客户端说明

### 环境准备

1. 开发环境

- 工具：Android Studio
- 系统：MacOS
- 代码：Java

2. 运行环境

系统: Android 6.0 +

3. 项目包含内容

- Android Project
- 安装包

### 参数配置

使用 `AndroidStudio` 运行项目，前往 `com.imchat.chanttyai/base/Constants.java` 文件，只需要配置 `APP_KEY` 及 `HTTP_HOST` 两个参数。

![img](@static/images/aigc/parameter_configure.png)
