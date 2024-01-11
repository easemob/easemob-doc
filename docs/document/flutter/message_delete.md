# 删除消息

<Toc />

本文介绍用户如何单向删除服务端的历史消息。

## 技术原理

使用环信即时通讯 IM Flutter SDK 可以通过 `EMChatManager` 类从服务器单向删除历史消息，主要方法如下：

- `EMChatManager#deleteRemoteMessagesBefore`/`EMChatManager#deleteRemoteMessagesWithIds`：根据消息时间或消息 ID 单向删除服务端的历史消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 单向删除服务端的历史消息

你可以调用 `deleteRemoteMessagesBefore` 和 `deleteRemoteMessagesWithIds` 方法单向删除服务端的历史消息，每次最多可删除 50 条消息。删除后，消息自动从设备本地移除且该用户无法从服务端拉取到该消息。其他用户不受该操作影响。

登录该账号的其他设备会收到 `EMMultiDeviceEventHandler` 中的 `onRemoteMessagesRemoved` 回调，已删除的消息自动从设备本地移除。

:::tip
若使用该功能，需将 SDK 升级至 V4.0.0 或以上版本并联系商务。
:::

```dart
try {
  await EMClient.getInstance.chatManager.deleteRemoteMessagesBefore(
    conversationId: conversationId,
    type: convType,
    timestamp: timestamp,
  );
} on EMError catch (e) {}

try {
  await EMClient.getInstance.chatManager.deleteRemoteMessagesWithIds(
    conversationId: conversationId,
    type: convType,
    msgIds: msgIds,
  );
} on EMError catch (e) {}
```