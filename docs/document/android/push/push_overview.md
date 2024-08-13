# 离线推送概述

<Toc />

即时通讯 IM 支持集成第三方离线消息推送服务，为 Android 开发者提供低延时、高送达、高并发、不侵犯用户个人数据的离线消息推送服务。目前支持的手机厂商推送服务包括：Google FCM、华为、荣耀、小米、OPPO、VIVO 和魅族。

要体验离线推送功能，请点击[这里](https://www.easemob.com/download/demo)下载即时推送 IM 的 demo。

客户端断开连接或应用进程被关闭等原因导致用户离线时，即时通讯 IM 会通过第三方消息推送服务向该离线用户的设备推送消息通知。当用户再次上线时，服务器会将离线期间的消息发送给用户（这里角标表示的是离线消息数，并不是实际的未读消息数）。例如，当你离线时，有用户向你发送了消息，你的手机的通知中心会弹出消息通知，当你再次打开 app 并登录成功，即时通讯 IM SDK 会主动拉取你不在线时的消息。

若应用在后台运行，则用户仍为在线状态，即时通讯 IM 不会向用户推送消息通知。多设备登录时，可在[环信即时通讯云控制台](https://console.easemob.com/user/login)的**证书管理**页面配置推送在所有设备离线或任一设备离线时发送推送消息，该配置对所有推送通道生效。

:::tip
1. 应用在后台运行或手机锁屏等情况，若客户端未断开与服务器的连接，则即时通讯 IM 不会收到离线推送通知。<br/>
2. 多端登录时若有设备被踢下线，即使接入了 IM 离线推送，也收不到离线推送消息。
:::

除了满足用户离线条件外，要使用第三方离线推送，你还需在[环信即时通讯云控制台](https://console.easemob.com/user/login)配置推送证书信息，例如，对于华为推送，需配置**证书名称**和**推送密钥**，并调用客户端 SDK 提供的 API 向环信服务器上传 device token。

## 技术原理

![image](/images/android/push/push_android_understand.png)

消息推送流程如下：

1. 用户 B（消息接收者）检查设备支持哪种推送渠道，即 app 配置了哪种第三方推送服务且满足该推送的使用条件。
2. 用户 B 根据配置的第三方推送 SDK 从第三方推送服务器获取推送 token。
3. 第三方推送服务器向用户 B 返回推送 token。
4. 用户 B 向环信服务器上传推送证书名称和推送 token。
5. 用户 A 向 用户 B 发送消息。
6. 环信服务器检查用户 B 是否在线。若在线，环信服务器直接将消息发送给用户 B。
7. 若用户 B 离线，环信服务器判断该用户的设备使用的推送服务类型。
8. 环信服务器将将消息发送给第三方推送服务器。
9. 第三方推送服务器将消息发送给用户 B。

:::tip
1. 开发者通过[环信即时通讯云控制台](https://console.easemob.com/user/login)配置 App 的推送证书，需填写证书名称（或者 App Key）。该步骤须在登录环信 IM SDK 成功后进行。证书名称是环信服务器用于判断目标设备使用哪种推送通道的唯一条件，因此必须确保与 Android 终端设备上传的证书名称一致。
2. 推送 token（device token） 是 FCM 推送提供的推送 token，即初次启动你的应用时，FCM SDK 为客户端应用实例生成的注册令牌 (registration token)。该 token 用于标识每台设备上的每个应用，FCM 通过该 token 明确消息是发送给哪个设备的，然后将消息转发给设备，设备再通知应用程序。你可以调用 `FirebaseMessaging.getInstance().getToken()` 方法获得 token。另外，如果退出即时通讯 IM 登录时不解绑 device token（调用 `logout` 方法时对 `unbindToken` 参数传 `false` 时不解绑 device token，传 `true` 表示解绑 token），用户在推送证书有效期和 token 有效期内仍会接收到离线推送通知。
:::

## 前提条件

1. 已开启环信即时通讯服务，详见 [开启和配置即时通讯服务](/product/enable_and_configure_IM.html)。
2. 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
3. 你已在 [环信即时通讯控制台](https://console.easemob.com/user/login)的**即时通讯 > 功能配置 > 功能配置总览**页面激活推送高级功能。高级功能激活后，你可以设置推送通知方式、免打扰模式和自定义推送模板。**如需关闭推送高级功能必须联系商务，因为该操作会删除所有相关配置。**
4. 各推送使用的条件：
  - Google FCM：需要 Google Play Service 和能连接 Google 服务器的网络；
  - 小米推送：在小米系统上可用；
  - 华为推送：在华为系统上可用；
  - 魅族推送：在魅族系统上可用；
  - OPPO 推送：在 OPPO 系统上可用；
  - VIVO 推送：在 VIVO 系统上可用。
SDK 内部会按照以上顺序检测设备的推送支持情况。如果未设置第三方推送或者不满足使用第三方推送的条件，环信 IM SDK 会通过一些保活手段尽可能的保持与环信服务器的长连接，以确保消息及时送达。
**如果你的 App 有海外使用场景，建议开启 FCM 推送；由于各推送使用条件不同，建议尽可能同时支持各家推送。**
5. 使用消息推送前，需要你在对应的厂商推送服务上注册项目，并将设备的推送证书上传到[环信即时通讯云控制台](https://console.easemob.com/user/login)。

## 配置推送接口

你需要在 SDK 初始化时进行推送接口的配置。

```java
EMOptions options = new EMOptions();
...
EMPushConfig.Builder builder = new EMPushConfig.Builder(this);
// 设置支持哪家手机厂商推送。
builder.enableMiPush(String appId, String appKey)
       //开发者需要调用该方法开启华为推送。
       .enableHWPush();
// 将 pushconfig 设置为 ChatOptions.
options.setPushConfig(builder.build());
// 初始化即时通讯 IM SDK。
EMClient.getInstance().init(this, options);
```

## 混淆

如果你在项目中开启了混淆，请将以下规则添加到你的混淆规则中：

```java
-keep class com.hyphenate.** {*;}
-dontwarn  com.hyphenate.**
```

除此之外，你还需要添加第三方推送的混淆规则，详见各厂商的开发者平台文档。
