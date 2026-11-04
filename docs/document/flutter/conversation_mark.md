# 会话标记

## 功能说明

会话标记用于为会话添加业务分类，例如标星、待处理或重要客户等。SDK 支持为单聊、群聊和聊天室会话添加或移除标记。

SDK 提供 `Type0` 至 `Type19` 共 20 个标记，单个会话最多可同时包含 20 个标记。各标记的业务含义由应用自行定义和维护。

```dart
const Map<ConversationMarkType, String> markMapping =
    <ConversationMarkType, String>{
  ConversationMarkType.Type0: 'important',
  ConversationMarkType.Type1: 'pending',
  ConversationMarkType.Type2: 'customer',
};
```

:::tip
会话标记只用于会话分类和筛选，不会影响会话未读数、消息收发、置顶状态或消息已读状态。
:::

## 功能开通

会话标记属于服务端会话列表功能的一部分。使用前，需要在 [环信控制台](/product/console/basic_conversation_group_chatroom.html#服务端会话列表) 开通服务端会话列表功能。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见[快速开始](quickstart.html)。
- 已开通[服务端会话列表功能](/product/console/basic_conversation_group_chatroom.html#服务端会话列表)。
- 已了解环信即时通讯 IM API 的使用限制，详见[使用限制](/product/limitation.html)。

## 添加会话标记

调用 `ChatManager#addRemoteAndLocalConversationsMark` 为一个或多个会话添加指定标记。该操作会同时更新服务端和本地的会话标记。单次最多可传入 20 个会话 ID。

Flutter SDK 5.x 支持登录后自动同步会话列表及其标记并写入本地。应用应在初始化前通过 `ChatOptions.dataSyncType` 显式包含 `ChatDataSyncType.conversations`。同步完成后，可调用 `ChatManager#loadAllConversations` 获取本地会话列表，并通过 `ChatConversation.marks` 获取各会话的全部标记。

若服务端会话列表达到数量限制（默认最多 100 个会话），服务端可能根据会话活跃度移除不活跃会话。对应会话的标记也可能不再随服务端会话列表同步到本地。

:::tip
会话标记仅用于业务分类和筛选，不会影响消息收发、会话未读数、消息已读状态或会话置顶状态。
:::

```dart
final List<String> conversationIds = <String>['user2', 'group1'];

try {
  await ChatClient.getInstance.chatManager
      .addRemoteAndLocalConversationsMark(
    conversationIds: conversationIds,
    mark: ConversationMarkType.Type0,
  );
  // 会话标记添加成功。
} on ChatError catch (e) {
  // 根据错误码和错误信息处理。
}
```

参数说明如下：

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| `conversationIds` | `List<String>` | 会话 ID 列表，不能为空；单次最多传入 20 个会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `mark` | `ConversationMarkType` | 添加的标记，取值为 `Type0` 至 `Type19`。 |

## 移除会话标记

调用 `ChatManager#deleteRemoteAndLocalConversationsMark` 从一个或多个会话中移除指定标记。该操作会同时更新服务端和本地的会话标记。单次最多可传入 20 个会话 ID。

```dart
final List<String> conversationIds = <String>['user2', 'group1'];

try {
  await ChatClient.getInstance.chatManager
      .deleteRemoteAndLocalConversationsMark(
    conversationIds: conversationIds,
    mark: ConversationMarkType.Type0,
  );
  // 会话标记移除成功。
} on ChatError catch (e) {
  // 根据错误码和错误信息处理。
}
```

`deleteRemoteAndLocalConversationsMark` 的参数规则与 `addRemoteAndLocalConversationsMark` 相同。

## 按标记筛选会话列表

会话标记随会话数据在登录后自动同步并写入本地，应用应在同步完成后读取本地会话列表，并通过 `ChatConversation.marks` 筛选带有指定标记的会话。

初始化 SDK 前，在 `ChatOptions.dataSyncType` 中包含 `ChatDataSyncType.conversations`：

```dart
final ChatOptions options = ChatOptions.withAppKey(
  appKey,
  dataSyncType: ChatDataSyncType.conversations,
);

await ChatClient.getInstance.init(options);
```

当 `ConnectionEventHandler#onDataSyncFinish` 回调中的 `type` 包含 `ChatDataSyncType.conversations` 且 `error` 为 `null` 时，可以读取本地会话列表并按标记筛选：

```dart
const String connectionHandlerId = 'conversation_mark_sync_handler';

ChatClient.getInstance.addConnectionEventHandler(
  connectionHandlerId,
  ConnectionEventHandler(
    onDataSyncFinish: (type, error) async {
      if ((type & ChatDataSyncType.conversations) == 0 || error != null) {
        return;
      }

      final List<ChatConversation> conversations =
          await ChatClient.getInstance.chatManager.loadAllConversations();
      final List<ChatConversation> markedConversations = conversations
          .where(
            (conversation) =>
                conversation.marks?.contains(ConversationMarkType.Type0) ==
                true,
          )
          .toList();
    },
  ),
);
```

如需获取单个本地会话的全部标记，可以先调用 `getConversation` 获取会话对象，再读取 `marks`：

```dart
final ChatConversation? conversation =
    await ChatClient.getInstance.chatManager.getConversation(
  conversationId,
  type: conversationType,
  createIfNeed: false,
);

final List<ConversationMarkType> marks =
    conversation?.marks ?? <ConversationMarkType>[];
```

:::tip
`loadAllConversations` 和 `getConversation` 读取本地会话，不会主动向服务器请求数据。若需要最新的服务端标记状态，应先等待会话数据同步完成。
:::

## 监听会话列表更新

本地会话发生变化时，SDK 会触发 `ChatEventHandler#onConversationsUpdate`。该回调不返回完整会话列表，应用应重新读取本地会话列表并刷新界面。

```dart
const String chatHandlerId = 'conversation_mark_update_handler';

ChatClient.getInstance.chatManager.addEventHandler(
  chatHandlerId,
  ChatEventHandler(
    onConversationsUpdate: () async {
      final List<ChatConversation> conversations =
          await ChatClient.getInstance.chatManager.loadAllConversations();
      // 重新筛选带有目标标记的会话并刷新界面。
    },
  ),
);

// 不再需要监听时移除监听器。
ChatClient.getInstance.chatManager.removeEventHandler(chatHandlerId);
```

同一用户在其他设备上更新会话标记时，当前设备可通过 `ChatMultiDeviceEventHandler#onConversationEvent` 接收 `ChatMultiDevicesEvent.CONVERSATION_UPDATE_MARK` 事件。收到事件后，可重新读取本地会话列表并刷新界面。

```dart
const String multiDeviceHandlerId = 'conversation_mark_multi_device_handler';

ChatClient.getInstance.addMultiDeviceEventHandler(
  multiDeviceHandlerId,
  ChatMultiDeviceEventHandler(
    onConversationEvent: (event, conversationId, type) {
      if (event == ChatMultiDevicesEvent.CONVERSATION_UPDATE_MARK) {
        // 其他设备更新了会话标记，重新读取本地会话列表。
      }
    },
  ),
);

// 不再需要监听时移除监听器。
ChatClient.getInstance.removeMultiDeviceEventHandler(multiDeviceHandlerId);
```

## 注意事项

- 会话标记支持单聊、群聊和聊天室会话。
- 会话标记取值为 `Type0` 至 `Type19`，各标记的业务含义由应用维护。
- 单个会话最多可以同时包含 20 个标记。
- `addRemoteAndLocalConversationsMark` 和 `deleteRemoteAndLocalConversationsMark` 可同时操作多个会话，单次最多传入 20 个会话 ID。
- 会话 ID 列表不能为空；调用失败时，应根据 `ChatError` 中的错误码和错误信息处理。
- 会话标记会同时更新服务端和本地会话数据，并同步到当前用户的其他设备。
- 会话标记不影响会话未读数、消息已读状态、消息收发或会话置顶状态。
- 应在会话数据同步完成后，通过本地接口读取并筛选会话。
- 若服务端会话列表达到数量限制，不活跃会话可能被移出服务端会话列表，对应标记也可能不再随会话列表返回。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`addRemoteAndLocalConversationsMark`](#添加会话标记) | `ChatManager` | 为一个或多个会话添加指定标记。 |
| [`deleteRemoteAndLocalConversationsMark`](#移除会话标记) | `ChatManager` | 从一个或多个会话中移除指定标记。 |
| [`withAppKey`](#按标记筛选会话列表) | `ChatOptions` | 使用 App Key 创建 SDK 配置。 |
| [`dataSyncType`](#按标记筛选会话列表) | `ChatOptions` | 设置登录成功后自动同步的数据类型。 |
| [`init`](#按标记筛选会话列表) | `ChatClient` | 使用指定配置初始化 SDK。 |
| [`loadAllConversations`](#按标记筛选会话列表) | `ChatManager` | 获取本地会话列表。 |
| [`getConversation`](#按标记筛选会话列表) | `ChatManager` | 获取指定的本地会话对象。 |
| [`marks`](#按标记筛选会话列表) | `ChatConversation` | 获取会话的全部标记。 |
