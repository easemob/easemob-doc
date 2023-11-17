# 管理服务端的会话和消息

<Toc />

环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。本文介绍用户如何从消息服务器获取会话和消息。

:::tip
本文介绍的功能均为增值服务，需在[环信即时通讯 IM 管理后台](https://console.easemob.com/user/login)开通。
:::

## 技术原理

使用环信即时通讯 IM Flutter SDK 可以通过 `EMChatManager` 类的以下方法从服务器获取历史消息：

- `fetchConversation` 分页获取服务器保存的会话列表；
- `fetchPinnedConversations` 分页获取服务器保存的置顶会话列表；
- `pinConversation` 置顶会话。
- `fetchHistoryMessages` 获取服务器保存的指定会话中的消息。
- `deleteRemoteMessagesBefore`/`deleteRemoteMessagesWithIds` 根据消息时间或消息 ID 单向删除服务端的历史消息；
- `deleteRemoteConversation` 删除服务端的会话及其历史消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 从服务器分页获取会话列表

对于单聊或群聊，用户发消息时会自动将对方添加到用户的会话列表。

你可以调用 `fetchConversation` 方法从服务端分页获取会话列表。SDK 按照会话活跃时间（会话的最新一条消息的时间戳）的倒序返回会话列表，每个会话对象中包含会话 ID、会话类型、是否为置顶状态、置顶时间（对于未置顶的会话，值为 `0`）以及最新一条消息。从服务端拉取会话列表后会更新本地会话列表。

服务器默认存储 100 条会话，可存储 7 天。若提升这两个上限，需联系环信商务。

:::tip
1. 若使用该功能，需将 SDK 升级至 4.0.0。
2. 建议在 app 安装时或本地没有会话时调用该方法，否则调用 `loadAllConversations` 获取本地会话即可。
3. 通过 RESTful 接口发送的消息默认不创建或写入会话。若会话中的最新一条消息通过 RESTful 接口发送，获取会话列表时，该会话中的最新一条消息显示为通过非 RESTful 接口发送的最新消息。若要开通 RESTful 接口发送的消息写入会话列表的功能，需联系商务。
:::

示例代码如下：

```dart
// pageSize: 每页返回的会话数。取值范围为 [1,50]。
// cursor: 开始获取数据的游标位置。若获取数据时传空字符串（""），SDK 从最新活跃的会话开始获取。
try {
  int pageSize = 10;
  String cursor = "";
  EMCursorResult<EMConversation> result =
      await EMClient.getInstance.chatManager.fetchConversation(
    pageSize: pageSize,
    cursor: cursor,
  );
  // 获取到的会话列表
  List<EMConversation> conversations = result.data;
  // 下一次请求的 cursor
  String? nextCursor = result.cursor;
} on EMError catch (e) {}
```

## 获取服务端的置顶会话列表

你可以调用 `fetchPinnedConversations` 方法从服务端分页获取置顶会话列表。SDK 按照会话置顶时间的倒序返回。 

你最多可以拉取 50 个置顶会话。

:::notice
若使用该功能，需将 SDK 升级至 4.0.3。
:::

示例代码如下： 

```dart
// pageSize: 每页返回的会话数。取值范围为 [1,50]。
// cursor: 开始获取数据的游标位置。若获取数据时传 `null` 或者空字符串（""），SDK 从最新置顶的会话开始查询。
try {
  int pageSize = 10;
  String cursor = "";
  EMCursorResult<EMConversation> result =
      await EMClient.getInstance.chatManager.fetchPinnedConversations(
    pageSize: pageSize,
    cursor: cursor,
  );
  // 获取到的会话列表
  List<EMConversation> conversations = result.data;
  // 下一次请求的 cursor
  String? nextCursor = result.cursor;
} on EMError catch (e) {}
```

### 置顶会话

会话置顶指将单聊或群聊会话固定在会话列表的顶部，方便用户查找。例如，将重点会话置顶，可快速定位会话。

置顶状态会存储在服务器上，多设备登录情况下，更新置顶状态会同步到其他登录设备。你最多可以置顶 50 个会话。

你可以调用 `pinConversation` 方法设置是否置顶会话。多设备登录情况下，会话置顶或取消置顶后，其他登录设备分别会收到 `EMMultiDevicesEvent.CONVERSATION_PINNED` 和 `EMMultiDevicesEvent.CONVERSATION_UNPINNED` 事件。

:::notice
若使用该功能，需将 SDK 升级至 4.0.3。
:::

示例代码如下：

```dart
try {
  await EMClient.getInstance.chatManager.pinConversation(
    conversationId: conversationId,
    isPinned: true,
  );
} on EMError catch (e) {}
```

你可以通过 `EMConversation` 对象的 `isPinned` 字段检查会话是否为置顶状态，或者调用 `getPinnedTime` 方法获取会话置顶时间。

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

### 单向删除服务端会话及其历史消息

你可以调用 `deleteRemoteConversation` 方法删除服务器端会话和历史消息。会话和消息删除后，当前用户无法从服务器获取该会话和消息，对本地的会话无影响，但会删除本地消息，而其他用户不受影响。

```dart
try {
  await EMClient.getInstance.chatManager.deleteRemoteConversation(
    conversationId,
  );
} on EMError catch (e) {}
```