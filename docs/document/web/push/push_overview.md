# 离线推送概述

即时通讯 IM 支持集成第三方消息推送服务，在用户离线时向移动端设备发送消息通知。Web SDK 提供推送 Token 管理、推送通知方式、免打扰模式、推送语言和推送模板等能力；uni-app 原生 App 还支持通过原生推送插件自动管理设备 Push Token。

本文介绍离线推送流程、推送证书配置、Token 管理、推送通知设置以及多设备离线推送策略。

## 离线推送过程

当客户端断开连接、应用进程关闭，或其他原因导致用户离线时，即时通讯 IM 会通过已接入的第三方推送通道向该离线用户的设备发送通知。用户重新上线后，SDK 会从服务端同步离线期间产生的消息。通知栏角标通常表示离线期间累计的通知数量，并不等同于应用内实际未读消息数。详情请参见 [Android](/document/android/push/push_overview.html#推送原理) 和 [iOS 平台](/document/ios/push/push_overview.html#推送原理)的离线推送文档。

**以下两种情况，即时通讯 IM 不会发送离线推送通知：**

1. 应用处于前台或虽在后台但客户端仍保持在线连接时，用户仍被视为在线，不触发离线推送。
2. 应用在后台运行、锁屏或进入挂起状态，但客户端尚未与服务器断开连接时，也不会触发离线推送。

## 配置推送证书和 Token

除了满足用户离线条件外，要使用第三方离线推送，还需要在[环信控制台](https://console.easemob.com/user/login)中完成推送证书或通道参数配置，详见 [Android 推送](/document/android/push/push_fcm.html) 和 [APNs 推送](/document/ios/push/push_apns.html) 文档中各厂商证书配置说明。

当业务侧已经从推送平台获取设备 Push Token 时，可以调用 `client.pushManager.uploadPushToken()` 将 Token 上传到环信服务。调用前应先完成 SDK 初始化和登录，并确保已经获取到推送平台分配的 `deviceToken`。`deviceId` 用于标识当前设备，`notifierName` 对应环信控制台中配置的推送证书名称或通道标识。

```typescript
await client.pushManager.uploadPushToken({
  deviceId: 'device-id', // 设备 ID，用于标识设备。
  deviceToken: 'push-token-from-fcm-or-apns', // 推送 token，用于标识每台设备上的每个应用。
  notifierName: 'your-push-certificate-name', // 推送服务的证书名称。
});
```

## uni-app 原生离线推送

自 SDK 5.1.2 起，支持 uni-app App 通过 [uni-app 原生离线推送集成](uniapp_push.html) 接入 APNs、FCM 以及华为、小米、魅族、vivo、OPPO 和荣耀等推送通道。配置 `PushManager.setNativePush()` 后，SDK 会在登录后自动获取并绑定或更新设备 Push Token，退出登录时自动尝试解绑；业务侧也可以调用 `removePushToken()` 手动停用当前设备推送，再次调用 `setNativePush()` 重新启用。

浏览器 Web 端不具备原生设备 Token 获取能力，仍需由业务侧获取 Token 后调用 `uploadPushToken()`。

## 推送高级功能

### 开通功能

[推送通知方式](push_notification_mode_dnd.html#推送通知方式)、[免打扰模式](push_notification_mode_dnd.html#免打扰模式) 和 [推送模板](push_template.html) 属于推送相关的高级功能。使用前，你需要在 [环信控制台](https://console.easemob.com/user/login) 免费开通。**激活后，如需关闭推送高级功能，必须联系商务，因为该操作会删除高级功能相关的所有配置。**

1. 登录 [环信控制台](https://console.easemob.com/user/login)。
2. 选择页面上方的 **应用管理**。在弹出的应用列表页面，单击你的应用的 **操作** 栏中的 **管理**。
3. 选择 **增值服务 > 消息推送 > 离线推送**。
4. 点击 **免费开通**。

![image](/images/android/push/push_advanced_feature_enable.png)

### 推送通知方式

推送通知方式包含以下三种类型：

- `ALL`：接收所有离线消息的推送通知。
- `AT`：仅接收提及当前用户的消息的推送通知。
- `NONE`：不接收离线消息的推送通知。

你可以设置全局或单聊/群聊会话级别的推送通知方式。会话级别的设置优先于全局级别设置；如果清除会话级设置，该会话会恢复继承全局设置。

更多详情，请参见 [推送通知方式介绍](push_notification_mode_dnd.html#推送通知方式)。

### 免打扰模式

完成 SDK 初始化并成功登录后，你可以对全局以及单聊/群聊会话设置免打扰模式。

- 支持设置一次性免打扰时长（例如，30 分钟）。
- 支持设置每日循环生效的免打扰时间段（例如，8:0-10:0）。
- 支持设置全局级别和单聊/群聊会话级别的免打扰模式。
- 若在免打扰模式下需要对指定用户推送消息，需设置强制推送。

更多详情，请参见 [免打扰模式介绍](push_notification_mode_dnd.html#免打扰模式)。

### 推送模板

推送模板主要用于当服务端提供的默认离线推送内容不满足需求时，配置全局范围的推送标题和推送内容。推送模板包括默认模板 `default`、`detail` 和自定义模板，你可以在 [环信控制台](https://console.easemob.com/user/login) 中进行配置。

推送模板的配置和使用，详见 [相关文档介绍](push_template.html)。

## 多设备离线推送策略

多设备登录时，可在 [环信控制台](https://console.easemob.com/user/login) 的 **证书管理** 页面配置推送策略，该策略对所有推送通道生效：

- 所有设备离线时，才发送推送消息；
- 任一设备离线时，都发送推送消息。

**多端登录时若有设备被踢下线，即使已接入 IM 离线推送，也收不到离线推送消息。**

![image](/images/android/push/push_multidevice_policy.png)

## Web/uni-app 端可设置的功能

环信 IM SDK 根据运行环境支持以下移动端离线推送配置：

- 上传推送 Token：
- uni-app 原生 App 自动获取、绑定和更新 Push Token；
- 手动停用当前设备推送并在需要时重新启用；
- 设置推送通知，包括推送通知方式和免打扰模式：
  - 设置全局推送通知；
  - 获取全局推送通知设置；
  - 设置会话推送通知；
  - 获取单个或多个会话的推送通知设置；
  - 清除会话推送通知方式的设置，使其恢复继承全局配置。
- 查询已设置推送通知方式的会话列表。
- 设置推送语言。
- 设置推送模板。
- 设置推送扩展功能：包括强制推送和发送静默消息。
