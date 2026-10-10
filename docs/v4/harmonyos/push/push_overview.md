# 离线推送概述

<Toc />

即时通讯 IM 支持集成第三方消息推送服务，为 HarmonyOS 开发者提供低延时、高送达、高并发、不侵犯用户个人数据的离线消息推送服务。

要体验离线推送功能，请在 [环信官网](https://www.easemob.com/download/demo) 下载即时通讯 IM 的 demo。

## 离线推送过程

客户端断开连接或应用进程被关闭等原因导致用户离线时，即时通讯 IM 会通过第三方消息推送服务向该离线用户的设备推送消息通知。当用户再次上线时，服务器会将离线期间的消息发送给用户（这里角标表示的是离线消息数，并不是实际的未读消息数）。例如，当你离线时，有用户向你发送了消息，你的手机的通知中心会弹出消息通知，当你再次打开 app 并登录成功，即时通讯 IM SDK 会主动拉取你不在线时的消息。

除了满足用户离线条件外，要使用 HarmonyOS 离线推送，用户还需在[环信控制台](https://console.easemob.com/user/login)配置推送证书信息，并调用客户端 SDK 提供的 API 向环信服务器上传 device token。

**以下两种情况，即时通讯 IM 不会发送离线推送通知：**

1. 若应用在后台运行，则用户仍为在线状态，即时通讯 IM 不会向用户推送消息通知。
   
2. 应用在后台运行或手机锁屏等情况，若客户端未断开与服务器的连接，则即时通讯 IM 不会收到离线推送通知。

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

## 推送高级功能

### 开通功能

[推送通知方式](push_notification_mode_dnd.html#推送通知方式)、[免打扰模式](push_notification_mode_dnd.html#免打扰模式) 和 [推送模板](push_template.html) 是推送的高级功能。使用前，你需要在 [环信控制台](https://console.easemob.com/user/login) 免费开通。**激活后，如需关闭推送高级功能，必须联系商务，因为该操作会删除高级功能相关的所有配置。**

1. 登录 [环信控制台](https://console.easemob.com/user/login)。
2. 选择页面上方的 **应用管理**。在弹出的应用列表页面，单击你的应用的 **操作** 栏中的 **管理**。
3. 选择 **增值服务 > 消息推送 > 离线推送**。
4. 点击 **免费开通**。

![image](/images/android/push/push_advanced_feature_enable.png)

### 推送通知方式

推送通知方式包含以下三种类型：

- 接收所有离线消息的推送通知。
- 仅接收提及某些用户的消息的推送通知。
- 不接收离线消息的推送通知。

你可以设置 App 或单聊/群聊会话级别的推送通知方式。会话级别的设置优先于 app 级别设置。

更多详情，请参见 [推送通知方式介绍](push_notification_mode_dnd.html#推送通知方式)。

### 免打扰模式

完成 SDK 初始化和成功登录 app 后，你可以对 app 以及各类型的会话设置免打扰模式，即关闭离线推送。

- 支持设置免打扰时间段（例如，8:0-10:0）和免打扰时长（例如，30 分钟）。
- 支持设置 app 级别和单聊/群聊的免打扰模式。
- 开启全天免打扰和关闭免打扰模式。
- 若在免打扰模式下需要对指定用户推送消息，需设置强制推送。

更多详情，请参见 [免打扰模式介绍](push_notification_mode_dnd.html#免打扰模式)。

### 推送模板

推送模板主要用于服务器提供的默认离线推送配置不满足你的需求时，设置全局范围的推送标题和推送内容。推送模板包括默认推送模板 `default`、`detail` 和自定义推送模板。你可以在 [环信控制台](https://console.easemob.com/user/login) 配置推送模板。

推送模板的配置和使用，详见 [相关文档介绍](push_template.html)。

## 多设备离线推送策略

多设备登录时，可在 [环信控制台](https://console.easemob.com/user/login)的 **证书管理** 页面配置推送策略，该策略配置对所有推送通道生效：

- 所有设备离线时，才发送推送消息；
- 任一设备离线时，都发送推送消息。

**多端登录时若有设备被踢下线，即使接入了 IM 离线推送，也收不到离线推送消息。**

![image](/images/android/push/push_multidevice_policy.png)

## 前提条件

- 已开启环信即时通讯服务，详见 [开启和配置即时通讯服务](/product/console/app_create.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 确保已经在 [AppGallery Connect](https://developer.huawei.com/consumer/cn/service/josp/agc/index.html) 网站开通开通推送服务。
- 检查并提醒用户允许接收通知消息，并将设备的推送证书上传到[环信控制台](https://console.easemob.com/user/login)。
- 若使用[推送模板](#推送模板)，需在[环信控制台](https://console.easemob.com/user/login)上激活。


