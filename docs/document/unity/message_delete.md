# 删除消息

<Toc />

本文介绍用户如何单向删除服务端和本地的历史消息。

## 技术原理

使用环信即时通讯 IM SDK 可以通过 `ChatManager` 和 `Conversation` 类单向删除服务端和本地的历史消息，主要方法如下：

- `ChatManager#RemoveMessagesFromServer`：单向删除服务端的历史消息。
- `Conversation#DeleteAllMessages`：删除本地指定会话的所有消息。
- `Conversation#DeleteMessages (long startTime, long endTime)`：删除本地单个会话在指定时间段的消息。
- `Conversation#DeleteMessage (string messageId)`：删除本地单个会话的指定消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 单向删除服务端的历史消息

你可以调用 `RemoveMessagesFromServer` 方法单向删除服务端的历史消息，每次最多可删除 50 条消息。删除后，消息自动从设备本地移除且该用户无法从服务端拉取到该消息。其他用户不受该操作影响。

登录该账号的其他设备会收到 `IMultiDeviceDelegate` 中的 `OnRoamDeleteMultiDevicesEvent` 回调，已删除的消息自动从设备本地移除。

:::tip
若使用该功能，需将 SDK 升级至 V1.1.0 或以上版本并联系商务。
:::

```csharp
// 按时间删除历史消息
SDKClient.Instance.ChatManager.RemoveMessagesFromServer(convId, ctype, time, new CallBack(
    onSuccess: () =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
// 按消息 ID 删除历史消息
SDKClient.Instance.ChatManager.RemoveMessagesFromServer(convId, ctype, msgList, new CallBack(
    onSuccess: () =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
```

### 删除本地指定会话的所有消息

你可以删除本地指定会话的所有消息，示例代码如下：

```csharp
Conversation conv = SDKClient.Instance.ChatManager.GetConversation(conversionId, conversationType);

if (conv.DeleteAllMessages()){
    //成功删除消息
}
else{
    //删除消息失败
}
```

### 删除本地单个会话在指定时间段的消息

你可以删除本地指定会话在一段时间内的本地消息，示例代码如下：

```csharp
Conversation conv = SDKClient.Instance.ChatManager.GetConversation(conversionId, conversationType);

if (conv.DeleteMessages(startTime, endTime)) {
    //成功删除消息
}
else {
    //删除消息失败
}
```

### 删除本地单个会话的指定消息

你可以删除本地单个会话的指定消息，示例代码如下：

```csharp
Conversation conv = SDKClient.Instance.ChatManager.GetConversation(conversionId, conversationType);

if (conv.DeleteMessage(msgid)){
    //成功删除消息
}
else{
    //删除消息失败
}
```





