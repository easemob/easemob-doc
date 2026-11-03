# 离线推送概述

即时通讯 IM 支持集成第三方离线消息推送服务，为 React Native 开发者提供低延时、高送达率、高并发且不侵犯用户个人数据的离线消息推送服务。Android 端支持 Google FCM、华为、荣耀、小米、OPPO、VIVO 和魅族推送，iOS 端支持 APNs。此外，React Native SDK 5.x 提供 iOS PushKit（VoIP 推送）接口，适用于 VoIP 场景，不属于普通离线消息推送。

如需体验离线推送功能，请前往 [环信官网](https://www.easemob.com/download/demo) 下载即时通讯 IM 的 Demo 应用。

## 离线推送流程

### 触发条件与消息下发机制

当客户端断开连接或应用进程被系统关闭导致用户离线时，即时通讯 IM 会通过第三方消息推送服务向该离线用户的设备发送消息通知。待用户重新上线后，服务器会将离线期间的消息下发给用户（推送通知中的角标表示离线消息数量，而非客户端会话的实际未读消息数）。例如，当你离线期间收到其他用户发送的消息，手机通知中心会弹出相应的消息提醒；当你再次打开应用并成功登录后，即时通讯 IM SDK 会接收离线期间的消息。

收到离线推送通知不等同于 SDK 已接收到对应的聊天消息，应用应在重新上线并收到 SDK 消息后更新会话和聊天页面。推送是否触发还取决于证书与设备 Token 是否有效、推送通知方式、免打扰设置及多设备推送策略。

### 前置配置要求

除满足用户离线条件外，使用第三方离线推送服务还需在 [环信控制台](https://console.easemob.com/user/login) 完成推送证书信息的配置。以华为推送为例，需配置 **证书名称** 和 **推送密钥**，并在客户端集成华为推送服务、获取推送 Token，然后调用 `ChatClient#bindDeviceToken` 向环信服务器绑定推送信息。

React Native SDK 5.x 不负责接入厂商推送 SDK、申请通知权限或获取推送 Token，这些工作需由应用在 Android 或 iOS 原生工程中，按照对应推送服务的接入要求完成。Android 端绑定时还需传入对应厂商的推送凭据；iOS 端需在 SDK 初始化时配置 APNs 证书名称。详见 [推送证书与推送 Token](#推送证书与推送-token) 和 [配置推送接口](#配置推送接口)。

### 不触发离线推送的场景

在以下两种情况下，即时通讯 IM 不会因应用进入后台或手机锁屏而自动触发离线推送通知：

1. 应用在后台运行时，若客户端仍与服务器保持连接、用户仍处于在线状态，即时通讯 IM 直接投递消息，不触发该设备的离线推送通知。
2. 手机锁屏等状态下，若客户端与服务器的连接未断开，即时通讯 IM 也不会触发该设备的离线推送通知。

应用进入后台不等同于用户离线。多设备登录时，对离线设备是否推送还需结合 [多设备离线推送策略](#多设备离线推送策略) 判断，不能仅凭另一台设备在线就判定所有设备都不会收到推送。

## 推送原理

Android 端通过已集成的厂商推送服务接收通知，流程如下图所示：

![Android 离线推送原理](/images/android/push/push_android_understand.png)

消息推送的完整流程如下：

1. 用户 B（消息接收者）的应用检测设备支持的推送渠道，即应用已配置的第三方推送服务类型及其使用条件。
2. 用户 B 通过已配置的第三方推送 SDK 从第三方推送服务器请求获取推送 Token。
3. 第三方推送服务器向用户 B 返回推送 Token。
4. 用户 B 向环信服务器上传推送证书对应的厂商凭据和推送 Token。
5. 用户 A 向用户 B 发送消息。
6. 环信服务器检查用户 B 的在线状态。若用户 B 在线，服务器直接将消息投递给用户 B。
7. 若用户 B 离线，环信服务器根据已绑定的推送信息确定使用的推送服务类型，并结合推送设置和多设备策略判断是否推送。
8. 环信服务器将推送通知交给第三方推送服务器。
9. 第三方推送服务器将通知最终投递至用户 B 的设备。

:::tip
推送证书的控制台配置，详见 [上传推送证书](push_easemob_console.html)；客户端 Token 绑定要求，详见下文 [配置推送接口](#配置推送接口)。
:::

### iOS 平台离线推送

iOS 端通过 APNs 接收普通离线推送通知，流程如下图所示：

![iOS 离线推送原理](/images/ios/push/push_ios_1_understand.png)

推送流程如下：

1. 用户 B 向 APNs 推送服务注册，获取推送 Token。
2. APNs 返回推送 Token。
3. 用户 B 向环信服务器上传推送证书名称和推送 Token。
4. 用户 A 向用户 B 发送消息。
5. 环信服务器检查用户 B 是否在线。若在线，环信服务器直接将消息发送给用户 B。
6. 若用户 B 离线，环信服务器判断该用户是否使用了 APNs 推送。
7. 环信服务器将消息发送给 APNs 推送服务器。
8. APNs 推送服务器将消息发送给用户 B。

## 推送证书与推送 Token

**推送证书**：推送证书及其配置的凭据用于环信服务器识别推送通道，并向对应推送服务进行鉴权。在发送推送通知前，需在 [环信控制台](https://console.easemob.com/user/login) 为应用配置推送证书或厂商凭据，并确保与客户端使用的推送项目、应用及环境一致。各平台的证书配置要求，详见 [上传推送证书](push_easemob_console.html)；Android 绑定时的 `notifierName` 取值，参见下文 [配置推送接口](#配置推送接口)。

**推送 Token（Device Token）**：推送 Token 是第三方推送服务为应用实例生成的标识。以 FCM 推送为例，应用初次启动时，FCM SDK 会为客户端应用实例生成一个注册令牌（registration token），FCM 据此将通知准确投递至目标设备上的应用。在 Android 端接入 FCM 推送后，应用通过所用推送插件或原生推送 SDK 获取 FCM Token；iOS 普通 APNs 推送应获取 APNs Device Token。React Native IM SDK 不提供这些 Token 的获取接口。推送 Token 与 `ChatClient#loginWithToken` 使用的用户登录 Token 不同，不能混用。

推送 Token 发生变化后，应在用户已登录的状态下重新调用 `ChatClient#bindDeviceToken` 绑定最新 Token。若退出即时通讯 IM 登录时选择不解绑 Device Token，可调用 `ChatClient.getInstance().logout(false)`；在推送证书和 Token 有效且满足推送条件时，用户仍可收到离线推送通知。`ChatClient#logout` 的 `unbindDeviceToken` 为可选的位置参数，默认为 `true`，表示登出时请求解绑 Device Token；传入 `false` 表示不解绑。

关于推送证书上传和 Token 获取，可参考 [上传推送证书](push_easemob_console.html)、[Android FCM 推送集成文档](/document/android/push/push_fcm.html#步骤四-fcm-推送集成) 和 [iOS APNs 推送集成文档](/document/ios/push/push_apns.html)。原生文档中的工程配置可作为参考，React Native SDK 5.x 的客户端配置与 Token 绑定调用以本文为准。

:::tip
React Native SDK 5.x 支持 iOS PushKit 接口。VoIP 推送使用独立的证书和 Token：初始化时通过 `ChatOptions.pushKitCertName` 配置证书名称，获取 `PKPushRegistry` 回调返回的十六进制 Token 后调用 `ChatClient#bindPushKitToken`。`ChatClient#bindDeviceToken` 不用于绑定 PushKit Token。

`ChatClient#bindPushKitToken` 和 `ChatClient#unbindPushKitToken` 仅在 iOS 生效，其他平台调用不做任何处理。需要在保持登录状态下单独解绑 PushKit Token 时，调用 `ChatClient#unbindPushKitToken`。
:::

:::notice
iOS 端未配置 `ChatOptions.apnsCertName` 时，登出不会执行推送 Token 解绑。若仅使用 PushKit 推送并需要在登出时解除绑定，请先调用 `ChatClient#unbindPushKitToken`，成功后再登出，不要仅依赖 `logout(true)`。
:::

## 推送高级功能

### 功能开通

[推送通知方式](push_notification_mode_dnd.html#推送通知方式)、[免打扰模式](push_notification_mode_dnd.html#免打扰模式) 和 [推送模板](push_template.html) 属于推送的高级功能。使用前，你需在 [环信控制台](https://console.easemob.com/user/login) 免费开通相关服务。**激活后如需关闭推送高级功能，必须联系环信商务处理，因为该操作会删除高级功能相关的全部配置。**

开通步骤如下：

1. 登录 [环信控制台](https://console.easemob.com/user/login)。
2. 选择页面上方的 **应用管理**。在应用列表中，单击测试应用或正式版应用的 App Key。
3. 选择 **增值服务 > 消息推送 > 离线推送**。
4. 点击 **免费开通**。

![开通推送高级功能](/images/android/push/push_advanced_feature_enable.png)

### 推送通知方式

推送通知方式提供以下三种类型：

- 接收所有离线消息的推送通知。
- 仅接收提及特定用户的消息的推送通知。
- 不接收任何离线消息的推送通知。

你可以为应用级别或单聊/群聊会话级别分别设置推送通知方式，会话级别的配置优先级高于应用级别的配置。

更多详情，请参见 [推送通知方式介绍](push_notification_mode_dnd.html#推送通知方式)。

### 免打扰模式

完成 SDK 初始化并成功登录应用后，你可以为当前用户的应用级别及单聊/群聊会话级别设置免打扰模式，即在指定范围内关闭离线推送。该模式提供以下能力：

- 支持设置免打扰时间段（例如，8:00-10:00）或免打扰时长（例如，30 分钟）。
- 支持应用级别及单聊/群聊会话级别的免打扰模式配置。
- 支持开启全天免打扰或完全关闭免打扰模式。
- 若在免打扰模式下需要向指定用户推送消息，可设置强制推送。

更多详情，请参见 [免打扰模式介绍](push_notification_mode_dnd.html#免打扰模式)。

### 推送模板

当服务器提供的默认离线推送配置无法满足业务需求时，可通过推送模板设置全局范围的推送标题和推送内容。推送模板包括默认模板 `default`、`detail` 以及自定义模板，你可在 [环信控制台](https://console.easemob.com/user/login) 进行配置。

推送模板的具体配置方法和使用说明，请参见 [相关文档介绍](push_template.html)。

## 多设备离线推送策略

在多设备登录场景下，你可在 [环信控制台](https://console.easemob.com/user/login) 的 **证书管理** 页面配置推送策略，该策略对所有推送通道统一生效：

- 所有设备均离线时，才发送推送消息。
- 任一设备离线时，即向满足推送条件的离线设备发送推送消息。

**多端登录时，若有设备被踢下线，即使已接入 IM 离线推送，该设备也不会收到离线推送消息。**

![多设备离线推送策略](/images/android/push/push_multidevice_policy.png)

## 前提条件

1. 已开通环信即时通讯服务，详见 [开启和配置即时通讯服务](/product/console/app_create.html)。
2. 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
3. 若需使用推送模板，须先在 [环信控制台](https://console.easemob.com/user/login) 完成激活。
4. 各推送服务的适用条件如下：
   - Google FCM：Android 设备启用 Google Play 服务且可连接至 Google 服务器。
   - 小米推送：仅限小米设备。
   - 华为推送：仅限华为设备。
   - 魅族推送：仅限魅族设备。
   - OPPO 推送：仅限 OPPO 设备。
   - VIVO 推送：仅限 VIVO 设备。
   - 荣耀推送：仅限荣耀设备。
   - APNs：适用于 iOS 设备，需配置正确的证书、签名及推送环境。
   - PushKit（VoIP）：仅适用于 iOS 的 VoIP 推送场景，需单独配置 PushKit 证书并注册获取 Token。

React Native SDK 5.x 需要由应用集成推送插件或原生推送 SDK，并按设备条件选择推送渠道、获取 Token，再调用绑定接口。不能套用 Android 原生 SDK 的厂商推送配置示例，认为只配置 React Native IM SDK 就会自动检测、注册各厂商推送服务。

若未配置第三方推送或不满足使用条件，客户端在线时仍可通过与环信服务器的长连接接收消息；应用进程被关闭或连接断开后，不能依赖长连接或保活机制保证收到通知。

**如你的应用有海外使用场景，建议 Android 端接入 FCM 推送。由于各推送服务的适用条件不同，建议尽可能同时集成多家厂商推送服务。**

5. 使用消息推送前，需在对应厂商推送服务平台完成项目注册，并将设备的推送证书或厂商凭据配置到 [环信控制台](https://console.easemob.com/user/login)。
6. 在 React Native 工程的 Android/iOS 原生目录完成推送依赖、应用标识、权限和回调配置，并按系统及推送服务要求处理用户授权和隐私同意。

## 配置推送接口

React Native SDK 5.x 的配置流程为：完成推送服务的工程配置，在 SDK 初始化阶段配置 iOS 证书名称，然后在登录成功且取得推送 Token 后绑定设备。Android 端的厂商推送凭据在绑定时传入，不通过 `ChatOptions` 配置。

1. 在 SDK 初始化前通过 `ChatOptions#withAppKey` 创建配置对象。以下示例配置 iOS 的 APNs 证书名称；Android 会忽略该字段。

```typescript
async function initializeImSdk(): Promise<void> {
  try {
    const options = ChatOptions.withAppKey({
      appKey: '<org_name>#<app_name>',
      // iOS：填写环信控制台配置的 APNs 证书名称，仅初始化时生效
      apnsCertName: 'your_apns_cert_name',
      // 如需 iOS VoIP 推送，还需在此配置独立的 PushKit 证书名称
      // pushKitCertName: 'your_pushkit_cert_name',
    });

    // 初始化 SDK；推送 Token 通过 ChatClient 绑定，无需创建管理器
    await ChatClient.getInstance().init(options);
  } catch (error: unknown) {
    console.error('初始化 SDK 失败：', error);
  }
}
```

2. 使用 `ChatClient#loginWithToken` 登录。`userToken` 是由业务服务器获取或按环信规则生成的 IM 用户登录 Token，不是推送 Device Token。

```typescript
async function loginIm(userId: string, userToken: string): Promise<void> {
  try {
    // 使用 IM 用户登录 Token 登录
    await ChatClient.getInstance().loginWithToken(userId, userToken);
  } catch (error: unknown) {
    console.error('登录失败：', error);
  }
}
```

3. 通过推送插件或原生推送 SDK 获取设备 Token，并在 IM 登录成功后调用 `ChatClient#bindDeviceToken`。下面的方法供不同平台的推送 Token 获取/更新回调使用，按当前运行平台选择调用。

```typescript
// Android：deviceToken 为选定厂商返回的 Token，notifierName 为厂商凭据
// 例如 FCM 传 Sender ID，华为传 App ID，VIVO 传 appId#appKey
async function bindAndroidPushToken(
  deviceToken: string,
  notifierName: string
): Promise<void> {
  try {
    // 向环信服务器绑定厂商推送凭据和设备 Token
    await ChatClient.getInstance().bindDeviceToken({
      deviceToken,
      notifierName,
    });
  } catch (error: unknown) {
    // 根据错误码排查问题，不输出完整设备 Token
    console.error('绑定 Android 推送 Token 失败：',
      error instanceof ChatError ? error.code : '未知错误');
  }
}

// iOS：deviceToken 为 APNs 返回的 Device Token
async function bindApnsToken(deviceToken: string): Promise<void> {
  try {
    // 绑定 APNs Token，不传 notifierName，证书名使用初始化时的配置
    await ChatClient.getInstance().bindDeviceToken({ deviceToken });
  } catch (error: unknown) {
    // 检查登录状态、初始化证书名称及 Token 是否正确
    console.error('绑定 APNs Token 失败：',
      error instanceof ChatError ? error.code : '未知错误');
  }
}
```

若 Token 在登录前已获取，应用可先保存该 Token，在登录成功后再调用绑定接口；Token 更新后同样需要绑定最新值。绑定接口返回成功表示推送信息绑定成功，不代表系统通知权限已开启，也不保证每条通知均能送达，应在真实设备上验证离线推送。

## 混淆配置

如果你在 React Native 工程的 Android 应用模块中开启了 R8/ProGuard 代码混淆，请将以下规则添加到应用的混淆配置文件（例如 `android/app/proguard-rules.pro`）中，并确保发布构建使用该文件：

```proguard
-keep class com.hyphenate.** {*;}
-dontwarn com.hyphenate.**
```

此外，你还需要根据各厂商开发者平台文档及所用 React Native 推送插件的指引，添加相应第三方推送服务的混淆规则。
