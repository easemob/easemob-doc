# 从服务器获取会话和消息（消息漫游）

<Toc />

环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。本文介绍用户如何从消息服务器获取会话和消息。

:::tip
本文介绍的功能均为增值服务，需在[环信即时通讯 IM 管理后台](https://console.easemob.com/user/login)开通。
:::

## 实现原理

使用环信即时通讯 IM Flutter SDK 可以通过 `EMChatManager` 类的以下方法从服务器获取历史消息：

- `fetchConversationListFromServer` 分页获取服务器保存的会话列表；
- `fetchHistoryMessages` 获取服务器保存的指定会话中的消息。
- `deleteRemoteMessagesBefore`/`deleteRemoteMessagesWithIds` 根据消息时间或消息 ID 单向删除服务端的历史消息；
- `deleteRemoteConversation` 删除服务端的会话及其历史消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 从服务器获取会话列表

对于单聊或群聊，用户发消息时，会自动将对方添加到用户的会话列表。

你可以调用 `fetchConversationListFromServer` 从服务端分页获取会话列表。每个会话包含最新一条历史消息。

:::tip
1. 若使用该功能，需将 SDK 升级至 4.0.0。
2. 建议在 app 安装时或本地没有会话时调用该方法，否则调用 `loadAllConversations` 获取本地会话即可。
3. 获取的会话列表中不包含最新一条消息通过 RESTful 接口发送的会话。若需获取该类会话，需要联系商务开通将通过 RESTful 接口发送的消息写入会话列表的功能。
:::

```dart
try {
  List<EMConversation> list = await EMClient.getInstance.chatManager
      .fetchConversationListFromServer(
    // pageNum：当前页面，从 1 开始。
    pageNum: pageNum,
   // pageSize：每页获取的会话数量。取值范围为 [1,20]。
    pageSize: pageSize,
  );
} on EMError catch (e) {}
```

对于还不支持 `fetchConversationListFromServer` 接口的用户，可以调用 `getConversationsFromServer` 从服务端获取会话列表，SDK 默认可拉取 7 天内的 10 个会话（每个会话包含最新一条历史消息）。如需调整会话数量或时间限制请联系商务。

### 分页获取指定会话的历史消息

你可以调用 `fetchHistoryMessages` 方法从服务器获取指定会话的消息（消息漫游）。

为确保数据可靠，我们建议你多次调用该方法，且每次获取的消息数小于 50 条。获取到数据后，SDK 会自动将消息更新到本地数据库。

```dart
try {
  // 会话 ID
  String convId = "convId";
  // 会话类型。详见 `EMConversationType` 枚举类型。
  EMConversationType convType = EMConversationType.Chat;
  // 获取的最大消息数
  int pageSize = 10;
  // 搜索的起始消息 ID
  String startMsgId = "";
  EMCursorResult<EMMessage?> cursor =
      await EMClient.getInstance.chatManager.fetchHistoryMessages(
    conversationId: convId,
    type: convType,
    pageSize: pageSize,
    startMsgId: startMsgId,
  );
} on EMError catch (e) {
}
```
### 单向删除服务端的历史消息

你可以调用 `deleteRemoteMessagesBefore` 和 `deleteRemoteMessagesWithIds` 方法单向删除服务端的历史消息，每次最多可删除 50 条消息。消息删除后，该用户无法从服务端拉取到该消息。其他用户不受该操作影响。已删除的消息自动从设备本地移除。

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

### 删除服务端会话及其历史消息

你可以调用 `deleteRemoteConversation` 方法删除服务器端会话和历史消息。会话删除后，当前用户和其他用户均无法从服务器获取该会话。若该会话的历史消息也删除，所有用户均无法从服务器获取该会话的消息。

```dart
try {
  await EMClient.getInstance.chatManager.deleteRemoteConversation(
    conversationId,
  );
} on EMError catch (e) {}
```