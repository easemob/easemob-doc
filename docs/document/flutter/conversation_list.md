# 会话列表

## 功能说明

- **本地会话列表：** 对于单聊、群组聊天和聊天室会话，用户收发消息时，SDK 会在本地创建或更新对应会话，并将其维护在本地会话列表缓存中。应用可从本地内存或数据库读取会话列表，用于展示会话名称、头像、最后一条消息、未读数、置顶状态和会话标记等信息。
- **服务端与本地数据：** 环信服务器保存当前用户的会话状态，SDK 本地维护会话数据，供客户端快速读取和展示。完成初始化并成功登录后，若已启用会话数据同步，SDK 会自动将服务端会话数据同步到本地。会话同步、收发消息、删除会话、清空未读数、设置或取消置顶、添加或移除会话标记等操作均可能更新本地会话数据，客户端需重新读取本地列表并刷新界面。
- **同步与变更通知：** 应用应在初始化前通过 `ChatOptions.dataSyncType` 显式配置会话同步，并在同步完成后读取本地会话列表。当本地会话列表发生变化时，SDK 会通过会话列表更新事件通知应用；同一账号在其他设备上执行会话操作时，当前设备也可通过多设备事件感知变更。

## 功能开通

如需将服务端会话列表同步到本地，需要在 [环信控制台](/product/console/basic_conversation_group_chatroom.html#服务端会话列表) 开通服务端会话列表功能。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见[快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 获取会话列表

应用应按照登录后自动同步、监听同步完成和读取本地会话列表的流程获取最新会话数据。

### 登录后自动同步会话列表

Flutter SDK 支持通过 `ChatOptions.dataSyncType` 配置登录后自动同步的数据类型。为保证 Android 和 iOS 行为一致，应在调用 `ChatClient#init` 前显式包含 `ChatDataSyncType.conversations`。

```dart
final ChatOptions options = ChatOptions.withAppKey(
  appKey,
  dataSyncType: ChatDataSyncType.conversations,
);

await ChatClient.getInstance.init(options);
```

若还需要同步好友列表或已加入的群组列表，可以使用按位或运算符增加 `ChatDataSyncType.contacts` 或 `ChatDataSyncType.joinedGroups`。关于登录后自动同步数据，详见 [SDK 初始化文档](initialization.html)。

:::tip
Flutter SDK 5.0.0 基于原生 SDK 5.0.0。未配置 `dataSyncType` 时，Android 端默认不同步任何数据类型，iOS 端默认同步会话列表。
:::

### 监听会话列表同步状态

通过 `ConnectionEventHandler` 监听会话列表同步状态。当 `type` 包含 `ChatDataSyncType.conversations` 时，表示本次同步包含会话列表。

```dart
const String connectionHandlerId = 'conversation_sync_handler';

ChatClient.getInstance.addConnectionEventHandler(
  connectionHandlerId,
  ConnectionEventHandler(
    onConnected: () {
      // SDK 已成功连接到 IM 服务器。
    },
    onDisconnected: (errorCode, info) {
      // SDK 与 IM 服务器断开连接，可根据 errorCode 判断原因。
    },
    onDataSyncStart: (type) {
      if ((type & ChatDataSyncType.conversations) != 0) {
        // 会话列表开始同步。
      }
    },
    onDataSyncFinish: (type, error) async {
      if ((type & ChatDataSyncType.conversations) == 0) {
        return;
      }

      if (error == null) {
        // 会话列表同步成功，可以读取本地会话列表。
        final List<ChatConversation> conversations =
            await ChatClient.getInstance.chatManager.loadAllConversations();
      } else {
        // 会话列表同步失败，根据 error 处理错误。
      }
    },
  ),
);

// 不再需要监听时移除。
ChatClient.getInstance.removeConnectionEventHandler(connectionHandlerId);
```

### 会话相关选项

初始化时，你可以在 `ChatOptions` 中设置以下会话相关选项：

| 选项 | 描述 |
| :--- | :--- |
| `deleteMessagesAsExitChatRoom` | 设置主动或被动退出聊天室时是否删除该聊天室的本地消息。<br/> -（默认）`true`：删除本地消息。<br/> - `false`：保留本地消息。 |
| `enableEmptyConversation` | 设置从本地数据库加载会话时是否包含空会话。必须在初始化 SDK 前设置。<br/> - `true`：包含空会话。<br/> -（默认）`false`：不包含空会话。 |

### 一次性获取本地所有会话

调用 `ChatManager#loadAllConversations` 可以获取本地会话列表。SDK 会优先从内存中获取；如果内存中没有会话，则从本地数据库加载。

```dart
final List<ChatConversation> conversations =
    await ChatClient.getInstance.chatManager.loadAllConversations();
```

关于设置本地会话列表是否包含空会话，详见 [会话相关选项](#会话相关选项)。

**本地会话读取接口与自动同步会话的关系**

`ChatOptions.dataSyncType` 控制登录后是否将服务端会话数据同步到本地；`loadAllConversations` 负责读取本地内存或数据库中的会话。两者控制不同的数据处理阶段。

:::tip
如果 `dataSyncType` 包含 `ChatDataSyncType.conversations`，应等待 `onDataSyncFinish` 成功后，再将 `loadAllConversations` 的结果视为本次登录后的最新服务端会话数据。
:::

## 获取会话名称和头像

读取 `ChatConversation.name` 和 `ChatConversation.avatar` 可获取会话的显示名称和头像：

- 单聊会话：分别为对端用户的昵称和头像。
- 群聊会话：分别为群名称和群头像。
- 相关用户或群组数据尚未同步时，这两个属性可能为 `null` 或空字符串。

```dart
final String? conversationName = conversation.name;
final String? conversationAvatar = conversation.avatar;
```

## 会话列表数据更新场景

| 场景 | 是否影响服务端数据 | 是否影响本地会话列表 |
| :--- | :--- | :--- |
| 登录后从服务端同步会话数据并写入本地，不修改服务端会话状态 | 否 | 是 |
| 收发消息时，SDK 创建或更新本地会话的最后一条消息、排序和未读数 | 视服务端配置而定 | 是 |
| 设置或取消会话置顶，同时更新服务端和本地置顶状态<br/>方法：`pinConversation` | 是 | 是 |
| 添加或移除服务端及本地会话标记<br/>方法：`addRemoteAndLocalConversationsMark` / `deleteRemoteAndLocalConversationsMark` | 是 | 是 |
| 删除本地会话，由 `deleteMessages` 参数决定是否同时删除本地消息<br/>方法：`deleteConversation` | 否 | 是 |
| 删除服务端和本地的指定会话，由 `isDeleteMessage` 参数决定是否删除服务端历史消息<br/>方法：`deleteRemoteConversation` | 是 | 是 |
| 清空指定会话的未读消息数并同步多设备状态<br/>方法：`clearConversationUnreadMessageCount` | 是 | 是 |
| 清空全部会话的未读消息数并同步多设备状态<br/>方法：`clearAllConversationUnreadMessageCount` | 是 | 是 |

## 监听会话列表更新

当本地会话发生变化时，SDK 会触发 `ChatEventHandler#onConversationsUpdate`。该回调不直接返回完整会话列表，应用应重新调用 `loadAllConversations` 获取最新结果并刷新 UI。

```dart
const String chatHandlerId = 'conversation_update_handler';

ChatClient.getInstance.chatManager.addEventHandler(
  chatHandlerId,
  ChatEventHandler(
    onConversationsUpdate: () async {
      final List<ChatConversation> conversations =
          await ChatClient.getInstance.chatManager.loadAllConversations();
      // 使用最新会话列表刷新 UI。
    },
  ),
);

// 不再需要监听时移除。
ChatClient.getInstance.chatManager.removeEventHandler(chatHandlerId);
```

## 接口最佳实践

| 场景 | 推荐做法 |
| :--- | :--- |
| 获取最新会话列表 | 初始化前在 `dataSyncType` 中显式包含 `ChatDataSyncType.conversations`；在会话同步成功后调用 `loadAllConversations`。 |
| 展示会话列表 | 调用 `loadAllConversations` 读取本地数据；如需特定排序、筛选或分页，在应用层处理。 |
| 响应会话变化 | 注册 `ChatEventHandler`；收到 `onConversationsUpdate` 后重新读取本地会话列表并刷新 UI。 |
| 管理监听器 | 页面或组件销毁时移除 `ConnectionEventHandler` 和 `ChatEventHandler`，避免重复回调和内存泄漏。 |
| 读取本地缓存与最新同步数据 | `onDatabaseOpened` 表示本地数据库可读取；`onDataSyncFinish` 成功表示所配置的服务端数据已同步完成。 |

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`withAppKey`](#登录后自动同步会话列表) | `ChatOptions` | 使用 App Key 创建 SDK 配置。 |
| [`dataSyncType`](#登录后自动同步会话列表) | `ChatOptions` | 设置登录成功后自动同步的数据类型。 |
| [`deleteMessagesAsExitChatRoom`](#会话相关选项) | `ChatOptions` | 设置退出聊天室时是否删除该聊天室的本地消息。 |
| [`enableEmptyConversation`](#会话相关选项) | `ChatOptions` | 设置从本地数据库加载会话时是否包含空会话。 |
| [`init`](#登录后自动同步会话列表) | `ChatClient` | 使用指定配置初始化 Flutter SDK。 |
| [`loadAllConversations`](#一次性获取本地所有会话) | `ChatManager` | 获取本地全部会话；优先读取内存，内存中无会话时读取本地数据库。 |
| [`name`](#获取会话名称和头像) / [`avatar`](#获取会话名称和头像) | `ChatConversation` | 获取单聊或群聊会话的显示名称和头像。 |
| [`getUnreadMessageCount`](#会话列表数据更新场景) | `ChatManager` | 获取本地单聊和群聊会话的未读消息总数。 |
| [`pinConversation`](#会话列表数据更新场景) | `ChatManager` | 设置或取消会话置顶。 |
| [`addRemoteAndLocalConversationsMark`](#会话列表数据更新场景) / [`deleteRemoteAndLocalConversationsMark`](#会话列表数据更新场景) | `ChatManager` | 添加或移除会话标记。 |
| [`deleteConversation`](#会话列表数据更新场景) | `ChatManager` | 删除本地会话，并按参数决定是否删除本地消息。 |
| [`deleteRemoteConversation`](#会话列表数据更新场景) | `ChatManager` | 删除服务端和本地的指定会话。 |
| [`clearConversationUnreadMessageCount`](#会话列表数据更新场景) | `ChatManager` | 清空指定会话的未读消息数。 |
| [`clearAllConversationUnreadMessageCount`](#会话列表数据更新场景) | `ChatManager` | 清空全部会话的未读消息数。 |
