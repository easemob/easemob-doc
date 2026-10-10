# 离线推送概述


即时通讯 IM 支持集成第三方消息推送服务，为 HarmonyOS 开发者提供低延时、高送达、高并发、不侵犯用户个人数据的离线消息推送服务。

要体验离线推送功能，请在 [环信官网](https://www.easemob.com/download/demo) 下载即时通讯 IM 的 demo。

## 离线推送流程

### 触发条件与消息下发机制

当客户端断开连接或应用进程被系统关闭导致用户离线时，即时通讯 IM 会通过第三方消息推送服务向该离线用户的设备发送消息通知。待用户重新上线后，服务器会将离线期间的全部消息下发给用户（此处角标显示的是离线消息数量，而非实际未读消息数）。例如，当你离线期间收到其他用户发送的消息，手机通知中心会弹出相应的消息提醒；当你再次打开应用并成功登录后，即时通讯 IM SDK 会自动拉取离线期间的全部消息。

### 前置配置要求

除满足用户离线条件外，使用第三方离线推送服务还需在 [环信控制台](https://console.easemob.com/user/login) 完成推送证书信息的配置。以华为推送为例，需配置 **证书名称** 和 **推送密钥**，并调用客户端 SDK 提供的 API 向环信服务器上传 device token。

### 不触发离线推送的场景

在以下两种情况下，即时通讯 IM 不会发送离线推送通知：

1. 应用在后台运行时，用户仍处于在线状态，即时通讯 IM 不会推送消息通知。
2. 应用处于后台运行或手机锁屏等状态时，若客户端与服务器的连接未断开，即时通讯 IM 也不会触发离线推送通知。

## 推送原理

![image](/images/harmonyos/push/harmonyos_flowchart.png)

消息推送流程如下：

1. 用户 B 在 SDK 中配置应用的 Client ID。
2. 用户 B 使用 SDK 向环信服务器绑定推送 token。
3. 用户 A 向 用户 B 发送消息。
4. 环信服务器检查用户 B 是否在线。若在线，环信服务器直接将消息发送给用户 B。
5. 若用户 B 离线，环信服务器判断该用户的设备使用的推送服务类型。
6. 环信服务器将将消息发送给华为 Auth 服务端。
7. 华为 Auth 服务端将消息发送给用户 B。

## 推送证书与推送 Token

**推送证书**：使用 HarmonyOS 离线推送前，需先开通 HarmonyOS Push Kit 服务并申请服务账号密钥，然后在 [环信控制台](https://console.easemob.com/user/login) 中选择应用，进入 **即时通讯 > 功能配置 > 消息推送 > 证书管理**，添加 HarmonyOS 推送证书。证书名称应填写应用的 Client ID，并上传服务账号密钥 JSON 文件。证书名称是环信服务器判断目标设备所用推送通道的唯一依据，因此必须与客户端配置并上传的证书名称一致。初始化 IM SDK 前，还需通过 `ChatOptions#setAppIDForPush` 设置相同的 Client ID。

**推送 Token（Device Token）**：推送 Token 是 HarmonyOS Push Kit 为应用实例生成的唯一标识，用于将推送消息投递至对应设备上的应用。HarmonyOS IM SDK 已集成 Push Token 的获取与上传逻辑：成功登录后，SDK 会通过 Push Kit 获取 Token，并将 Token 与初始化时配置的 Client ID 上传至环信服务器。应用通常无需自行判断 Token 是否发生变化或是否需要重新上传，可通过 `PushListener` 监听 Token 的绑定结果。

调用 `ChatClient#logout` 退出登录时，`unbindToken` 参数用于控制是否解绑推送 Token：

- （默认）`true`：退出登录时解绑当前设备的推送 Token。
- `false`：仅退出 IM 账号，不解绑推送 Token。在推送证书和 Token 仍然有效的情况下，设备可能继续收到当前账号的离线推送通知。

关于申请服务账号密钥、上传推送证书、配置 Client ID 和监听 Push Token 上传结果的详细步骤，请参阅 [HarmonyOS 推送集成文档](/document/harmonyos/push/push_harmony.html)。

## 推送高级功能

### 功能开通

[推送通知方式](push_notification_mode_dnd.html#推送通知方式)、[免打扰模式](push_notification_mode_dnd.html#免打扰模式) 和 [推送模板](push_template.html) 是推送的高级功能。使用前，你需要在 [环信控制台](https://console.easemob.com/user/login) 免费开通。**激活后，如需关闭推送高级功能，必须联系商务，因为该操作会删除高级功能相关的所有配置。**

1. 登录 [环信控制台](https://console.easemob.com/user/login)。
2. 选择页面上方的 **应用管理**。在应用列表中，单击测试应用或正式版应用的 App Key。
3. 选择 **增值服务 > 消息推送 > 离线推送**。
4. 点击 **免费开通**。

![image](/images/android/push/push_advanced_feature_enable.png)

### 推送通知方式

推送通知方式提供以下三种类型：

- 接收所有离线消息的推送通知。
- 仅接收提及特定用户的消息的推送通知。
- 不接收任何离线消息的推送通知。

你可以为应用级别或单聊/群聊会话级别分别设置推送通知方式，会话级别的配置优先级高于应用级别的配置。

更多详情，请参见 [推送通知方式介绍](push_notification_mode_dnd.html#推送通知方式)。

### 免打扰模式

完成 SDK 初始化并成功登录应用后，你可以为应用及各类型的会话设置免打扰模式，即关闭离线推送功能。该模式提供以下能力：

- 支持设置免打扰时间段（例如，8:00-10:00）或免打扰时长（例如，30 分钟）。
- 支持应用级别及单聊/群聊会话级别的免打扰模式配置。
- 支持开启全天免打扰或完全关闭免打扰模式。
- 若在免打扰模式下需要向指定用户推送消息，可设置强制推送。

更多详情，请参见[免打扰模式介绍](push_notification_mode_dnd.html#免打扰模式)。

### 推送模板

推送模板主要用于服务器提供的默认离线推送配置不满足你的需求时，设置全局范围的推送标题和推送内容。推送模板包括默认推送模板 `default`、`detail` 和自定义推送模板。你可以在 [环信控制台](https://console.easemob.com/user/login) 配置推送模板。

推送模板的配置和使用，详见 [相关文档介绍](push_template.html)。

## 多设备离线推送策略

多设备登录时，可在 [环信控制台](https://console.easemob.com/user/login)的 **证书管理** 页面配置推送策略，该策略配置对所有推送通道生效：

- 所有设备均离线时，才发送推送消息。
- 任一设备离线时，即发送推送消息。

**多端登录时，若有设备被踢下线，即使已接入 IM 离线推送，也不会收到离线推送消息。**

![image](/images/android/push/push_multidevice_policy.png)

## 前提条件

- 已开通环信即时通讯服务，详见 [开启和配置即时通讯服务](/product/console/app_create.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 确保已经在 [AppGallery Connect](https://developer.huawei.com/consumer/cn/service/josp/agc/index.html) 网站开通开通推送服务。
- 检查并提醒用户允许接收通知消息，并将设备的推送证书上传到[环信控制台](https://console.easemob.com/user/login)。
- 若使用[推送模板](#推送模板)，需在[环信控制台](https://console.easemob.com/user/login)上激活。


