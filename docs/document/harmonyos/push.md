# HarmonyOS 第三方推送设置

<Toc />

即时通讯 IM 支持集成第三方消息推送服务，为 HarmonyOS 开发者提供低延时、高送达、高并发、不侵犯用户个人数据的离线消息推送服务。

客户端断开连接或应用进程被关闭等原因导致用户离线时，即时通讯 IM 会通过第三方消息推送服务向该离线用户的设备推送消息通知。当用户再次上线时，服务器会将离线期间的消息发送给用户（这里角标表示的是离线消息数，并不是实际的未读消息数）。例如，当你离线时，有用户向你发送了消息，你的手机的通知中心会弹出消息通知，当你再次打开 app 并登录成功，即时通讯 IM SDK 会主动拉取你不在线时的消息。

若应用在后台运行，则用户仍为在线状态，即时通讯 IM 不会向用户推送消息通知。多设备登录时，可在环信控制台的**证书管理**页面配置推送在所有设备离线或任一设备离线时发送推送消息，该配置对所有推送通道生效。

<div class="alert note">1. 应用在后台运行或手机锁屏等情况，若客户端未断开与服务器的连接，则即时通讯 IM 不会收到离线推送通知。<br/>2. 多端登录时若有设备被踢下线，即使接入了 IM 离线推送，也收不到离线推送消息。</div>

除了满足用户离线条件外，要使用第三方离线推送，用户还需在环信控制台配置推送证书信息，例如，对于华为推送，需配置**证书名称**和**推送证书**，并调用客户端 SDK 提供的 API 向环信服务器上传 device token。

本文介绍如何在客户端应用中实现厂商的推送服务。

## 技术原理

消息推送流程如下：

1. 消息接收方在 SDK 中配置应用的 Client ID。
2. 消息接收方使用 SDK 向环信服务器绑定推送 token。
3. 消息发送方向接收方发送消息。
4. 环信服务器检查消息接收方是否在线。若在线，环信服务器直接将消息发送给接收方。
5. 若消息接收方离线，环信服务器判断该用户的设备使用的推送服务类型。
6. 环信服务器将将消息发送给华为Auth服务端。
7. 华为Auth服务端将消息发送给消息接收方。

:::tip

1. 开发者通过环信即时通讯云控制台配置 App 的推送证书，需填写证书名称（或者 App Key）。该步骤须在登录环信 IM SDK 成功后进行。
2. 证书名称是环信服务器用来判断目标设备使用哪种推送通道的唯一条件，因此必须确保与 HarmonyOS 终端设备上传的证书名称一致。
:::

## 前提条件

- 已开启环信即时通讯服务，详见 [开启和配置即时通讯服务](/product/enable_and_configure_IM.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 确保已经在 [AppGallery Connect](https://developer.huawei.com/consumer/cn/service/josp/agc/index.html) 网站开通开通推送服务。
- 检查并提醒用户允许接收通知消息，并将设备的推送证书上传到环信即时通讯云控制台。

### 上传到设备证书到环信即时通讯云控制台

![image](@static/images/harmonyos/push/harmonyos_certificate.png)

## 在客户端实现推送

### 1. 开通推送服务与配置 Client ID。

在华为开发者后台创建应用，并开启推送服务，并上传对应的证书指纹。详见华为官方介绍：[开通推送服务与配置Client ID](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/push-config-setting-V5)。

### 2. 上传推送证书。

注册完成后，需要在环信即时通讯云控制台上传推送证书，选择你的应用 > **即时通讯** > **功能配置** > **消息推送** > **证书管理**。点击 **添加推送证书**，在 **添加推送证书** 窗口选择 **鸿蒙** 页签，然后设置推送证书相关参数。

| 推送证书参数    | 类型   | 是否必需 | 描述   |
| :-------- | :----- | :------- | :---------------- |
| `证书名称`        | String | 是  | 推送证书名称，即华为 API Console 上服务账号密钥的名称。详见 [**创建服务账号密钥**窗口中 **名称** 参数的值](https://developer.huawei.com/consumer/cn/doc/start/api-0000001062522591#section11695162765311)。|
| `上传文件`     | - | 是  | 点击 **上传证书**，上传 JSON 推送证书，即服务账号的密钥文件。申请服务器密钥可参考官方文档：[华为 API Console操作指南-服务帐号密钥](https://developer.huawei.com/consumer/cn/doc/start/api-0000001062522591#section11695162765311)，选择启用推送服务后，再生成服务器密钥。 |
| `Category` | - | 否      | 通知消息类别。详见 [HarmonyOS NEXT 官网相关文档](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/push-apply-right-V5#section16708911111611)。 |
| `Action`        | - | 否  | 消息接收方在收到离线推送通知时单击通知栏时打开的应用指定页面的自定义标记。 |

### 3. 在项目中配置 Client ID。

在项目模块级别下的 `src/main/module.json5`（例如 `entry/src/main/module.json5`）中，新增 `metadata` 并配置 `client_id`，如下所示：

> 配置 `client_id` 的 `value` 时，不能通过 `resource` 中的值配置（例如 `$media.icon`），请直接写入 `client_id` 的值。

```TypeScript
"module": {
  "name": "entry",
  "type": "xxx",
  "description": "xxxx",
  "mainElement": "xxxx",
  "deviceTypes": [],
  "pages": "xxxx",
  "abilities": [],
  // 配置如下信息
  "metadata": [ 
    {
      "name": "client_id",
      // 配置为步骤 1 中获取的 Client ID
      "value": "xxxxxx"  
    }
  ]
}

```

### 4. 在 SDK 初始化时配置应用的推送 Client ID。

```TypeScript
// ChatOptions 需要传入 appkey 参数。
let options = new ChatOptions("Your appKey");
// 传入 AppGallery Connect 获取到的 ClientID。
options.setAppIDForPush('Your ClientID');
// 初始化即时通讯 IM SDK。
ChatClient.getInstance().init(context, options);
```

#### 5. 监听 Push Token 上传结果。

你可以设置 `PushListener` 监听 Push Token 的上传结果。

```TypeScript
private pushListener: PushListener = {
    onError: (error: ChatError) => {
      // push token 绑定失败。
    },
    onBindTokenSuccess: (token: string) => {
      // push token 绑定成功。
    }
}
ChatClient.getInstance().pushManager()?.addListener(this.pushListener);
```


