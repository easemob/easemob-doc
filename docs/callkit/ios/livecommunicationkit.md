# LiveCommunicationKit

## 概述

// TODO：是否需要添加
`LiveCommunicationKit` 是苹果为iOS 系统新增的一项优化，用于改善语音或视频通话的接听体验，核心功能是让用户在锁屏状态下也能快速接听或挂断电话。

// TODO `LiveCommunicationManager` 是 CallKit 的一个类？
`LiveCommunicationManager` 是一个用于管理 iOS VoIP 通话的单例管理器类，集成了 Apple 的 PushKit 和 LiveCommunicationKit 框架，提供完整的 VoIP 通话解决方案，包括来电推送、通话管理和音频会话控制。

<ImageGallery :columns="5">
  <ImageItem src="/images/callkit/ios/1v1_video_caller_invitation.png" title="主叫发起通话邀请" />
  <ImageItem src="/images/callkit/ios/1v1_video_callee_invitation.png" title="被叫收到通话邀请" />
  <ImageItem src="/images/callkit/ios/1v1_video_ongoing.png" title="通话中" />
  <ImageItem src="/images/callkit/ios/1v1_video_notification_inapp.png" title="应用内来电通知" />
  <ImageItem src="/images/callkit/ios/notification_system.png" title="系统级来电通知" />
</ImageGallery>

## 推荐环境

- iOS 17.4 或以上版本
- Swift 5.0 或以上版本
- 必需框架：Foundation、PushKit、AVFAudio 和 LiveCommunicationKit
  
## 前提条件

- 应用已获得 VoIP 推送权限。 
- 应用已启用 VoIP 后台模式。 

## PushKit 集成

// TODO：添加后台和锁屏的截图

// TODO：是否需要这样改？https://doc.yunxin.163.com/nertccallkit/guide/TAzMjg5NjE?platform=iOS

主叫方发起呼叫时，环信服务器将呼叫信息通过 PushKit 推送给接听方，接听方选择接听或挂断后，将信息传递给 CallKit 呼叫组件，整体实现流程如下。

### 实现 PushKit 推送

1. 在系统中注册 PushKit。

- `PKPushRegistry`: 处理 VoIP 推送注册。
- `PKPushRegistryDelegate`: 响应推送事件。

2. 在环信即时通讯 IM 配置 PushKit 证书。
   调用 IM SDK 的接口绑定 VoIP 推送证书和推送 Token。`EMClient` 初始化时需绑定推送证书。
   关于如何创建 VoIP 推送证书以及上传至 [环信控制台](https://console.easemob.com/user/login)，详见 IM 的 [APNs 离线推送文档](/document/ios/push/push_apns.html)。

3. 将 PushKit token 传给环信 IM。

### 解析并弹出接听提示 UI

App 层接受 PushKit 消息后将消息传给 NERtcCallKit，由呼叫组件解析字段，并弹出相应的 UI。


// TODO：这是原来的

调用 IM SDK 的接口绑定 VoIP 推送证书和推送 Token。`EMClient` 初始化时需绑定推送证书。

- `PKPushRegistry`: 处理 VoIP 推送注册。
- `PKPushRegistryDelegate`: 响应推送事件。

关于如何创建 VoIP 推送证书以及上传至 [环信控制台](https://console.easemob.com/user/login)，详见 IM 的 [APNs 离线推送文档](/document/ios/push/push_apns.html)。

```Swift
    private func setupCallKit() {
        let options = EMOptions(appkey: appKey)
        #if DEBUG
        options.apnsCertName = "your_APNS_Developer"
        options.pushKitCertName = "yourVoipDev"
        #else
        options.apnsCertName = "your_APNS_Product"
        options.pushKitCertName = "yourVoipPro"
        #endif
        EMClient.shared().initializeSDK(with: options)
        //初始化环信 CallKit
        let config = EaseCallUIKit.CallKitConfig()
        config.enableVOIP = true//开启 VoIP 功能后会自动开启 LiveCommunicationKit，需要在 develop.apple.com 申请证书时勾选
        config.enablePIPOn1V1VideoScene = true//开启画中画，同时需要开启应用后台摄像头采集权限，详见[PictureInPicture.md](./PictureInPicture.md)。
        CallKitManager.shared.setup(config)
    }
```

## 通话管理

环信 CallKit 通过 `ConversationManager` 进行通话管理，包括上报来电通知、管理通话生命周期，例如，接听、挂断、静音等，以及通话超时处理。 

你可以创建 `ConversationManager`，进行如下配置：
- 铃声: `notes_of_the_optimistic`。
- 图标: 使用应用图标。
- 限制: 最大会话组数 为 `1`，每组最大会话数 为 `1`。
  
## 通话流程

### 1. 来电流程

1. 接收 VoIP 推送通知。
2. 解析推送载荷提取通话信息。
3. 创建 `ConversationManager`（如不存在）。
4. 生成或使用现有呼叫 UUID。
5. 上报新的来电会话。
6. 更新 `CallKitManager` 状态。

推送通知载荷应包含以下字段：

```json
{
  "e": {
    "callId": "通话ID",
    "callerNickname": "来电者昵称"
  },
  "f": "来电者ID",
  "m": "消息ID（可选）",
  "g": "群组ID（可选）"
}
```

来电流程如下图所示：

![img](/images/callkit/ios/incoming_call_flowchart.png)

来电界面如下图所示：

<ImageGallery>
  <ImageItem src="/images/callkit/ios/incoming_call_flow.png" title="来电流程" />
</ImageGallery>

### 2. 接听流程

1. 用户点击接听。
2. 执行 `JoinConversationAction`。
3. 调用 `CallKitManager.accept()`。
4. 显示连接中提示。

### 3. 挂断流程

1. 用户点击挂断。
2. 执行 `EndConversationAction`。
3. 调用 `CallKitManager.hangup()`。
4. 清理会话资源。

### 4. 静音操作

1. 用户切换静音状态。
2. 执行 `MuteConversationAction`。
3. 更新本地音频状态。

## 错误处理

| 错误场景 | 描述          |
| :-------------------- | :-------- |
| UUID 创建失败          | 自动生成新的呼叫 UUID。 |
| 通话信息缺失           | 日志记录错误，拒绝接听呼叫。  |
| 状态不匹配             | 验证通话状态后再执行操作。  |
| 超时处理               | 无论主叫或被叫超时，通话都自动取消。 |





