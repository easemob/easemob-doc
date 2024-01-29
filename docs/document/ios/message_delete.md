# 删除消息

<Toc />

本文介绍用户如何单向删除服务端和本地的历史消息。
 
## 技术原理

使用环信即时通讯 IM iOS SDK 可以通过 `EMConversation` 类单向删除服务端和本地的历史消息，主要方法如下：

- `EMConversation#removeMessagesFromServerWithTimeStamp`/`removeMessagesFromServerMessageIds`：按消息时间或消息 ID 单向删除服务端的历史消息。
- `EMConversation#deleteAllMessages`：删除本地指定会话的所有消息。
- `EMConversation#removeMessagesStart`：删除本地单个会话在指定时间段的消息。
- `EMConversation#deleteMessage`：删除本地单个会话的指定消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 单向删除服务端的历史消息

你可以调用 `removeMessagesFromServerWithTimeStamp` 或 `removeMessagesFromServerMessageIds` 方法按消息时间或消息 ID 单向删除服务端的历史消息。每次最多可删除 50 条消息。消息删除后，该用户无法从服务端拉取到该消息。其他用户不受该操作影响。登录该账号的其他设备会收到 `EMMultiDevicesDelegate` 中的 `multiDevicesMessageBeRemoved` 回调，已删除的消息自动从设备本地移除。

:::tip
若使用该功能，需将 SDK 升级至 V3.9.8 或以上版本并联系商务开通。
:::

示例代码如下：

```Objectivec
// 按时间删除消息
[self.conversation removeMessagesFromServerWithTimeStamp:message.timestamp completion:^(EMError * _Nullable aError) {

}];

// 按消息 ID 删除消息
[self.conversation removeMessagesFromServerMessageIds:@[@"123314142214"] completion:^(EMError * _Nullable aError) {

}];
```

### 删除本地指定会话的所有消息

你可以删除本地指定会话的所有消息，示例代码如下：

```swift
if let conversation = EMClient.shared().chatManager?.getConversationWithConvId("conversationId") {
    var err: EMError? = nil
    conversation.deleteAllMessages(&err)
     if let err = err {
         // 删除消息失败
     } else {
        // 成功删除消息
     }
}
```

### 删除本地单个会话在指定时间段的消息

你可以删除本地指定会话在一段时间内的本地消息，示例代码如下：

```swift
if let conversation = EMClient.shared().chatManager?.getConversationWithConvId("conversationId") {
    conversation.removeMessagesStart(startTime, to: endTime)
}
```

### 删除本地单个会话的指定消息

你可以删除本地单个会话的指定消息，示例代码如下：

```swift
if let conversation = EMClient.shared().chatManager?.getConversationWithConvId("conversationId") {
      var err: EMError? = nil
     conversation.deleteMessage(withId: "messageId", error:&err)
     if let err = err {
         // 删除消息失败
     } else {
         // 成功删除消息
     }
}
```


