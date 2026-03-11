# LiveCommunicationKit

## 概述

环信 CallKit 中的 `LiveCommunicationManager` 是一个用于管理 iOS VoIP 通话的单例管理器类，集成了 Apple 的 PushKit 和 LiveCommunicationKit 框架，提供完整的 VoIP 通话解决方案，包括来电推送、通话管理和音频会话控制。如果用户要使用系统的 LiveCommunicationKit，建议设置环信即时通讯 IM 为自动登录。

<ImageGallery :columns="3">
  <ImageItem src="/images/callkit/ios/notification_lock.png" title="VoIP 通话来电通知" />
  <ImageItem src="/images/callkit/ios/notification_call_answered.png" title="VoIP 通话接通" />
  <ImageItem src="/images/callkit/ios/notification_system.png" title="APNs 来电通知" />
</ImageGallery>

## 推荐环境

- iOS 17.4 或以上版本
- Swift 5.0 或以上版本
- 必需框架：Foundation、PushKit、AVFAudio 和 LiveCommunicationKit
  
## 前提条件

- 应用已获得 VoIP 推送权限。 
- 应用已启用 VoIP 后台模式。 

## 设置推送证书

环信 CallKit 支持 APNs 推送和 VoIP 推送。若开启了 VoIP 功能，则使用 VoIP 推送。

- APNs 推送：VoIP 功能未开启时，使用 APNs 推送。详见 IM 的 [APNs 离线推送文档](/document/ios/push/push_apns.html)。
- VoIP 推送：环信 CallKit 集成了 PushKit，你只需要在 IM SDK 初始化时设置 VoIP 推送证书，在 CallKit 初始化时启用 VoIP 功能。关于如何创建 VoIP 推送证书以及上传至 [环信控制台](https://console.easemob.com/user/login)，详见 IM 的 [APNs 离线推送文档](/document/ios/push/push_apns.html)。

```swift
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
        //初始化环信 CallKit。
        let config = EaseCallUIKit.CallKitConfig()
        config.enableVOIP = true//开启 VoIP 功能后会自动开启 LiveCommunicationKit，需要在 develop.apple.com 申请证书时勾选。
        config.enablePIPOn1V1VideoScene = true//开启画中画，同时需要开启应用后台摄像头采集权限。
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

来电流程如下图所示：

![img](/images/callkit/ios/incoming_call_flowchart.png)

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

### 2. 其他流程

<ImageGallery :columns="4">
  <ImageItem src="/images/callkit/ios/call_answer_flowchart.png" title="接听流程" />
  <ImageItem src="/images/callkit/ios/call_hangup_flowchart.png" title="挂断流程" />
  <ImageItem src="/images/callkit/ios/call_mute_flowchart.png" title="静音流程" />
</ImageGallery>


## 错误处理

| 错误场景 | 描述          |
| :-------------------- | :-------- |
| UUID 创建失败          | 自动生成新的呼叫 UUID。 |
| 通话信息缺失           | 日志记录错误，拒绝接听呼叫。  |
| 状态不匹配             | 验证通话状态后再执行操作。  |
| 超时处理               | 无论主叫或被叫超时，通话都自动取消。 |





