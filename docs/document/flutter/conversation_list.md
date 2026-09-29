# 会话列表

对于单聊、群聊和聊天室，SDK 会在用户收发消息时创建或更新对应的本地会话。你可以从服务端或本地获取会话列表。自 SDK 4.25.0 起，默认情况下，本地会话列表的返回结果不包含聊天室会话。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

环信即时通讯 IM 通过 `ChatManager` 类支持从服务器和本地获取会话列表，主要方法如下：

- `ChatManager#fetchConversationsByOptions`：从服务器获取会话列表。
- `ChatManager#fetchConversationsFromDB`：分页获取本地会话。
- `ChatManager#loadAllConversations`：获取本地所有会话。


## 从服务器分页获取会话列表

你可以调用 `fetchConversationsByOptions` 方法从服务端分页获取会话列表，包含单聊和群组聊天会话，不包含聊天室会话。SDK 按照会话活跃时间（会话的最新一条消息的时间戳）的倒序返回会话列表，每个会话对象中包含会话 ID、会话类型、是否为置顶状态、置顶时间（对于未置顶的会话，值为 `0`）以及最新一条消息。从服务端拉取会话列表后会更新本地会话列表。

对于每个终端用户，服务器默认保存最新的 100 条会话。超过此数量限制时，新创建的会话将自动覆盖最早的旧会话。当某个会话中的所有消息记录过期后，该会话即被视为 [空会话](conversation_overview.html#空会话)。默认情况下，从服务端拉取会话列表时不包含空会话。如需要拉取空会话，需在 SDK 初始化时设置 `ChatOptions#enableEmptyConversation` 为 `true`。注意，空会话将占用会话拉取名额。若希望拉取会话时不包含空会话，同时避免其占用会话名额，请联系商务开通相关配置。

:::tip
1. 使用该功能前，需 [在环信控制台开通服务端会话列表](/product/console/basic_conversation_group_chatroom.html#服务端会话列表)，并将 SDK 升级至 4.5.0 或以上版本。只有开通该功能后，才能使用置顶会话功能。
2. 建议仅在 app 安装后或本地没有会话时调用该方法；其他情况下可调用 `loadAllConversations` 获取本地会话。
3. 通过 RESTful API 发送的消息默认不会创建或写入会话。如果会话中的最新一条消息通过 RESTful API 发送，获取会话列表时，该会话的最新消息会显示为最近一条通过非 RESTful API 发送的消息。如需让 RESTful API 发送的消息写入会话列表，请 [在环信控制台开通该功能](/product/console/basic_conversation_group_chatroom.html#rest-发消息写会话列表)。
:::

示例代码如下：

```dart
try {
  final ChatCursorResult<ChatConversation> result =
      await ChatClient.getInstance.chatManager.fetchConversationsByOptions(
    options: ConversationFetchOptions(),
  );
  final List<ChatConversation> conversations = result.data;
} on ChatError catch (e) {
  // 处理获取失败。
}
```

## 从本地获取会话列表

SDK 提供以下方式获取本地会话列表： 

- [分页获取本地会话](#分页获取本地会话)
- [获取本地所有会话](#获取本地所有会话)

初始化 SDK 时，可以通过 `ChatOptions` 设置以下会话相关选项：

| 选项 | 描述 |
| :--- | :--- |
| `enableChatroomConversation` | 设置获取本地会话列表时是否包含聊天室会话。该功能自 Flutter SDK 4.25.0 起支持，必须在初始化 SDK 前设置。<br/> - `true`：本地会话列表中包含聊天室会话。<br/> -（默认）`false`：本地会话列表中不包含聊天室会话。<br/> 通过 `ChatOptions#enableChatroomConversation` 可查询当前配置。 |
| `deleteMessagesAsExitChatRoom` | 设置主动或被动退出聊天室时是否删除该聊天室的本地消息。<br/> -（默认）`true`：删除本地消息。<br/> - `false`：保留本地消息。 |
| `enableEmptyConversation` | 设置从本地数据库加载会话时是否包含空会话，必须在初始化 SDK 前设置。<br/> - `true`：包含空会话。<br/> -（默认）`false`：不包含空会话。 |
| `autoLoadConversations` | 设置初始化时是否自动将本地数据库中的全部会话加载到内存。该功能自 Flutter SDK 4.25.0 起支持，必须在初始化 SDK 前设置。<br/> -（默认）`true`：自动加载全部会话。<br/> - `false`：不自动加载全部会话，可通过 `fetchConversationsFromDB` 按页加载。 |

### 分页获取本地会话

**自 Flutter SDK 4.25.0 起**，你可以调用 `ChatManager#fetchConversationsFromDB` 从本地数据库分页获取会话列表。SDK 优先返回置顶会话。对于置顶状态相同的会话，SDK 按照最新一条消息的服务器时间戳降序排列；若时间戳也相同，则按照会话 ID 降序排列，比较会话 ID 时不区分大小写。

调用该方法前，需在 SDK 初始化时将 `ChatOptions#autoLoadConversations` 设置为 `false`，关闭本地会话的自动全量加载。该配置默认为 `true`；若不关闭，SDK 会在初始化时将数据库中的全部会话加载到内存，无法发挥分页加载在减少初始加载量和内存占用方面的作用。

```dart
// SDK 初始化前关闭自动加载全部本地会话。
final ChatOptions options = ChatOptions.withAppKey(
  appKey,
  autoLoadConversations: false,
);
await ChatClient.getInstance.init(options);

// 首次查询时，cursor 传 null 或空字符串，表示从第一页开始获取。
String? cursor;
const int pageSize = 20; // 取值范围为 [1,100]。

try {
  final ChatCursorResult<ChatConversation> result =
      await ChatClient.getInstance.chatManager.fetchConversationsFromDB(
    cursor: cursor,
    pageSize: pageSize,
  );

  final List<ChatConversation> conversations = result.data;
  cursor = result.cursor;

  if (cursor == null || cursor!.isEmpty) {
    // cursor 为空，表示当前页为最后一页。
  } else {
    // 保存 cursor；获取下一页时将其作为 cursor 传入。
  }
} on ChatError catch (e) {
  // cursor 无效时，SDK 抛出错误码为 INVALID_PARAM 的 ChatError。
}
```

### 获取本地所有会话

你可以调用 `ChatManager#loadAllConversations` 获取已加载到内存的全部本地会话。

```dart
final ChatOptions options = ChatOptions.withAppKey(
  appKey,
  // 本地会话列表包含聊天室会话。
  enableChatroomConversation: true,
  // 退出聊天室时保留本地消息。
  deleteMessagesAsExitChatRoom: false,
  // 从本地数据库加载会话时包含空会话。
  enableEmptyConversation: true,
);
await ChatClient.getInstance.init(options);

try {
  final List<ChatConversation> conversations =
      await ChatClient.getInstance.chatManager.loadAllConversations();
  // 成功加载会话。
} on ChatError catch (e) {
  // 处理加载失败。
}
```

如果初始化时将 `autoLoadConversations` 设置为 `false`，SDK 不会自动将本地数据库中的全部会话加载到内存。此时，`loadAllConversations` 返回的是当前已加载到内存的会话；如需按页读取数据库中的会话，请调用 [`fetchConversationsFromDB`](#分页获取本地会话)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`fetchConversationsByOptions`](#从服务器分页获取会话列表) | `ChatManager` | 从服务端分页获取会话列表。 |
| [`fetchConversationsFromDB`](#分页获取本地会话) | `ChatManager` | 从本地数据库分页获取会话列表。 |
| [`loadAllConversations`](#获取本地所有会话) | `ChatManager` | 获取已加载到内存的全部本地会话。 |
| [`enableChatroomConversation`](#从本地获取会话列表) | `ChatOptions` | 设置本地会话列表是否包含聊天室会话。 |
| [`deleteMessagesAsExitChatRoom`](#从本地获取会话列表) | `ChatOptions` | 设置退出聊天室时是否删除本地消息。 |
| [`enableEmptyConversation`](#从本地获取会话列表) | `ChatOptions` | 设置从本地数据库加载会话时是否包含空会话。 |
| [`autoLoadConversations`](#从本地获取会话列表) | `ChatOptions` | 设置初始化时是否自动加载全部本地会话。 |
