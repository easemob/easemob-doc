# 服务端配置

通过配置服务端和客户端，利用环信即时通信 IM 服务器回调功能，在 IM 中引入 AI 服务（以 MiniMax 中文大语言模型为例），创建机器人账号，从而跑通示例项目。本文介绍通过跑通示例项目如何配置服务端。

此外，利用 AI 聊天功能，你可以设置问候语，让机器人用户每天定时主动向聊天用户发送问候语，实现详情请参见 [FAQ](#faq)。 

若要体验 Demo，你可以扫描以下二维码： 

![img](/images/aigc/ai_solution1_demo.png)

## 环境准备

1. 部署要求：Windows 或者 Linux 服务器

2. 环境要求

- JDK 1.8+
- Redis 3.0.504
- Redis 绑定地址更改为 127.0.0.1
- MySQL 8.0.30

## 代码下载

当部署环境准备好后，通过 [GitHub 链接下载服务端代码](https://github.com/easemob/Demo-ChattyAI/tree/dev/chattyai_server)。

## 信息配置

服务端配置信息全部集中在以下文件中，主要配置包含三个部分：环信即时通讯 IM、miniMax 和 redis，配置内容如下：

```
src/main/resources/application.yml
```

### 环信即时通讯 IM 相关配置

#### 1. 创建应用

登录[环信即时通讯云控制台](https://console.easemob.com/user/login)，点击**添加应用**，填写应用相关信息。

![img](/images/aigc/app_create.png)
 
#### 2. 获取 app 信息

选中创建的应用，点击**管理**，进入**应用详情**页面，获取 **App Key**、**ClientID** 及**ClientSecret**。

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

![img](/images/aigc/app_detail.png)

#### 3. 关闭好友关系检查
  
设置**用户注册模式**为**开放注册**，关闭好友关系检查。

![img](/images/aigc/user_register_contact.png)

#### 4. 创建机器人账号

选择**应用概览** > **用户认证** 创建机器人账号，进行单聊或群组聊天。

示例项目中创建了 3 个智能体，因此建议设置 3 个机器人账号与智能体一 一绑定，即 `com.easemob.chattyai.chat.util.BotSettingUtil` 中的 `botBean0.setAccount`（机器人用户 ID）与 `botBean0.setName`（智能体名称）为一 一对应关系，见下方代码。

下图红框中的用户 ID（`bot1222700215765565440`、`bot1223027765968633856` 和 `bot1223027786982096896`）为示例项目中的与智能体绑定的机器人账号，若使用其他用户 ID，则需同步修改 `BotSettingUtil` 的 `botBean0.setAccount` 中的值，否则无法跑通示例项目。

![img](/images/aigc/robot_account_create.png)

```java
static{

BotBean botBean0 = new BotBean();
botBean0.setAccount("boy0");
botBean0.setName("智能体名称");
botBean0.setGender(0);
botBean0.setContent("智能体介绍" +
");
botBean0.setDesc("智能体相关信息，例如特征等。");
bots.put("boy0",botBean0);

}
```

#### 5. 配置发送前回调规则

若使用消息发送前回调功能，你需要在[环信即时通讯云控制台](https://console.easemob.com/user/login)开通该功能，详见[回调配置相关文档](/product/enable_and_configure_IM.html#配置消息回调)。该功能为增值服务，费用详见[功能费用文档](/product/pricing.html#增值服务费用)。

回调功能开通后，选择**即时通讯** > **功能配置** > **消息回调**，点击**添加回调地址**，配置发送前回调规则。其中，**会话类型**选择**单聊**和**群聊**，**消息类型**选择**文本**，**启用状态**选择**启用**，**回调地址**需确保设置为环信即时通讯 IM 可以通过外网访问到回调地址，格式为 `http(s)://ip:端口/chatty/callback.json`。其他参数的含义详见[配置回调规则相关文档](/product/enable_and_configure_IM.html#配置回调规则)。

![img](/images/aigc/callback_address.png)

### 大语言模型（LLM）信息配置

本代码示例以 MiniMax 为例 [MiniMax 开放平台快速开始](https://platform.minimaxi.com/document/Fast%20access?key=66701cf51d57f38758d581b2)，若使用其他大语言模型，可按其他语言模型配置要求进行调整。

```yaml
miniMax:
  groupId:{groupId}  # MiniMax 基础信息的 groupID。选择 “MiniMax账号管理” > “账户信息”页面，获取 “groupID” 字段。
  appkey: {appkey}   # MiniMax 的接口密钥。当需要复制 API 密钥时，可以重新创建一个以完成复制操作。
  url: https://api.minimax.chat/v1/text/chatcompletion_pro?GroupId=
```  

### MySQL 配置

```yaml
spring:
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    driverClassName: com.mysql.cj.jdbc.Driver
    druid:
      url: xxxx
      username: xxxx
      password: xxxx
      initial-size: 10
      max-active: 100
      min-idle: 10
      max-wait: 60000
      pool-prepared-statements: true
```
### redis 配置

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
3. `password` 填写 redis 的密码(如果没有密码，使用 `#` 注释该配置)。

![img](/images/aigc/redis_password.png)

4. 使用 `mvn install` 将项目打包为 `jar`。

![img](/images/aigc/jar.png)

5. 找到对应位置的 `jar` 包，上传到服务器。

使用命令启动即可：

```shell
nohup java -jar $APP_DIR/chattyai-0.0.1-SNAPSHOT.jar --server.port=$PORT ./chattyai.log 2>&1 &
```

- `$APP_DIR` 替换为上传 jar 包存在的根路径。
- `$PORT` 替换为需要占用的端口。

6. 查看启动日志。

```shell
tail -f $APP_DIR/chattyai.log 
```

## FAQ

1. Q: 项目为何启动失败？

A: 确保 JDK 配置正确，端口没有被占用，redis 能被访问到。

1. Q: 项目启动后为何无法访问？

A: 检查以下两方面：
  - 配置 nginx 的情况下，请确保 nginx 配置正确。
  - 未配置 nginx 的情况下，请确保端口对外开放。

3. Q: MiniMax 的调用失败，无返回结果，是什么原因？

A: 请确保 MiniMax 有余额，否则可能导致调用 MiniMax 的调用失败。

4. Q: 如何实现问候语？
   
A: 你可以设置问候语，让机器人用户每天定时主动向聊天用户发送问候语。  

`com.easemob.chattyai.chat.util.GreetUtil` 类中存在一个静态代码块和以下三个镜头属性。

静态代码用于加载该类时，分别向这三个 List 中添加对应的问候语。

```java
    /**
     * 早上问候语 list
     */
    public static List<String> moringGreetList = new ArrayList<>();

    /**
     * 中午问候语 list
     */
    public static List<String> noonGreetList = new ArrayList<>();

    /**
     * 晚上问候语 list
     */
    public static List<String> eveningGreetList = new ArrayList<>();
```

设置问候语后，可在 `com.easemob.chattyai.task.GreetTask` 类中设置定时任务。定时任务触发的 Cron 如下所示。例如，若用户 A 与机器人用户 B 聊过天，机器人用户 B 会在每天早上 9 点、中午 12 点和晚上 21 点给用户发送消息。

```java
0 0 9,12,21 * * ? 
```

5. Q: 如何获取历史消息？

A: 下图中的 `MiniMaxAiSingleHandler` 为单聊的 MinMax 处理类，`MiniMaxAiGroupHandler` 为群聊的 MinMax 的处理类。

![img](/images/aigc/historical_message.png)

在本示例项目中，与智能体交互后，聊天记录会同步处理到 从 redis 获取的 key （`Constant.CHAT_GROUP_HISTORY_REDIS_KEY_PREFIX+发送人的环信用户ID+:+机器人的环信 ID`）的对应的 value 中，方便下一次聊天时作为历史消息传递给 AI。示例项目中只取最近 10 条消息作为历史数据，对应的代码如下所示：

```java
long l = redisUtil.lGetListSize(key);
if (l > 10) {
    redisUtil.leftpop(key, 2L);
}
```
