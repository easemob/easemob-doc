# 会话介绍

## 功能说明

会话是单聊、群聊或聊天室中的消息集合。SDK 通过 `ChatConversation` 表示本地会话，应用可以读取会话 ID、会话类型、名称、头像、最近一条消息、未读数、置顶状态、会话标记和本地扩展字段等数据。

Flutter SDK 支持按初始化配置，在 [登录成功后自动同步服务端会话数据并更新本地数据](initialization.html#设置登录后自动同步数据)。如需开启会话数据同步，应在初始化时显式配置 `ChatDataSyncType.conversations`。应用可在同步完成后通过本地接口读取和展示会话列表。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见[快速开始](quickstart.html)。
- 已了解环信即时通讯 IM API 的使用限制，详见[使用限制](/product/limitation.html)。
- 如需使用服务端会话列表、会话置顶或会话标记等增值功能，已在环信控制台开通相应功能。

## 会话模型

### 会话类型和会话 ID

SDK 通过会话类型和会话 ID 标识会话：

| 会话类型 | `ChatConversationType` | 会话 ID |
| :--- | :--- | :--- |
| 单聊 | `Chat` | 对端用户 ID。 |
| 群聊 | `GroupChat` | 群组 ID。 |
| 聊天室 | `ChatRoom` | 聊天室 ID。 |

### 会话对象

会话列表中的每一项为 `ChatConversation`，常用接口如下：

| API | 说明 |
| :--- | :--- |
| `id` | 获取会话 ID。 |
| `type` | 获取会话类型。 |
| `name` | 获取会话名称。该属性适用于单聊和群聊会话，数据同步完成前可能为空。 |
| `avatar` | 获取会话头像。该属性适用于单聊和群聊会话，数据同步完成前可能为空。 |
| `unreadCount()` | 获取该会话的本地未读消息数。 |
| `latestMessage()` | 获取会话中的最新一条消息。 |
| `isPinned` | 获取会话是否置顶。 |
| `pinnedTime` | 获取会话置顶时间，单位为毫秒；未置顶时返回 `0`。 |
| `marks` | 获取会话标记列表。 |
| `ext` / `setExt(Map<String, String>?)` | 获取或设置会话的本地扩展字段。 |

:::tip
`ChatConversation` 主要包含本地会话及消息相关数据，不等同于完整的用户属性、群组详情或聊天室详情。如需展示名称和头像等完整信息，应按会话类型调用用户属性、群组或聊天室相关接口。
:::

## 会话创建与更新

### 通过消息创建或更新会话

收发消息时，SDK 会根据消息所属的会话创建或更新本地会话：

- 单聊消息：根据对端用户 ID 创建或更新单聊会话。
- 群聊消息：根据群组 ID 创建或更新群聊会话。
- 聊天室消息：根据聊天室 ID 创建或更新聊天室会话。

收到在线消息后，SDK 会更新会话的最近一条消息、排序和未读数等本地状态。命令消息（透传消息）不会保存到 SDK 的本地数据库或内存消息缓存中。发送命令消息时，SDK 也不会为其创建本地会话。该限制不影响命令消息通过 `ChatCmdMessageBody` 和命令消息回调正常发送与接收。

### 通过接口创建本地会话

调用 `ChatManager#getConversation` 时，将 `createIfNeed` 设为 `true`，SDK 会在本地不存在指定会话时创建会话对象；设为 `false` 时不会创建，未找到则返回 `null`。

```dart
final ChatConversation? conversation =
    await ChatClient.getInstance.chatManager.getConversation(
  conversationId,
  type: ChatConversationType.Chat,
  createIfNeed: true,
);
```

`getConversation` 的 `type` 默认为 `ChatConversationType.Chat`，`createIfNeed` 默认为 `true`。获取群聊或聊天室会话时必须显式传入正确类型；仅查找已有会话时应显式传入 `createIfNeed: false`。

### 通过服务端同步更新会话列表

Flutter SDK 5.x 可通过 `ChatOptions.dataSyncType` 指定登录成功后自动同步的数据类型。应在调用 `ChatClient#init` 前显式包含 `ChatDataSyncType.conversations`；如设置为 `ChatDataSyncType.none`，则关闭自动数据同步。

```dart
final ChatOptions options = ChatOptions.withAppKey(
  appKey,
  dataSyncType: ChatDataSyncType.conversations,
);

await ChatClient.getInstance.init(options);
```

应用可通过 `ConnectionEventHandler#onDataSyncStart` 和 `onDataSyncFinish` 监听会话数据同步状态。当 `type` 包含 `ChatDataSyncType.conversations` 且 `error` 为 `null` 时，可以从本地读取最新会话列表。

:::tip
Flutter 5.0.0 的 Android 和 iOS 原生默认同步范围不同。需要跨平台一致行为时必须显式设置 `dataSyncType`。
:::

## 会话列表与空会话

SDK 提供以下本地会话读取方式：

| 方式 | API | 说明 |
| :--- | :--- | :--- |
| 全部会话 | `loadAllConversations()` | 优先从内存中获取全部本地会话；内存中无会话时从本地数据库加载。 |
| 单个会话 | `getConversation(...)` | 按会话 ID 和类型读取本地会话，并可通过 `createIfNeed` 控制不存在时是否创建。 |

空会话是没有消息的会话。例如，会话中的全部消息过期、被清除或被撤回后，该会话可能成为空会话。

应用从本地数据库加载会话时，是否包含空会话由 `ChatOptions.enableEmptyConversation` 控制。该选项默认为 `false`；如需包含空会话，应在调用 `ChatClient#init` 前设置为 `true`。

```dart
final ChatOptions options = ChatOptions.withAppKey(
  appKey,
  enableEmptyConversation: true,
);

await ChatClient.getInstance.init(options);
```

空会话也可以进行置顶、添加会话标记和删除等操作。

## 当前会话与未读数

应用进入会话页面并处理完消息后，可按业务需要清零会话未读数：

| API | 说明 |
| :--- | :--- |
| `clearConversationUnreadMessageCount` | 清零指定会话的本地未读数，并同步当前账号的其他设备。 |
| `clearAllConversationUnreadMessageCount` | 清零所有会话的本地未读数，并同步当前账号的其他设备。 |

```dart
try {
  await ChatClient.getInstance.chatManager
      .clearConversationUnreadMessageCount(conversationId);
  // 指定会话的未读消息数已清零。
} on ChatError catch (e) {
  // 根据错误码和错误信息处理。
}
```

:::tip
会话未读数清零不会向会话对端发送消息已读回执。若需通知原消息发送方消息已读，应调用 `sendMessageReadReceipts`，详见[消息已读回执](message_receipt.html)。
:::

## 会话功能列表

| 功能 | 主要 API | 说明 |
| :--- | :--- | :--- |
| 会话列表 | `loadAllConversations`、`getConversation` | 从本地内存或数据库读取会话，详见[会话列表](conversation_list.html)。 |
| 会话未读数 | `getUnreadMessageCount`、`unreadCount`、`clearConversationUnreadMessageCount`、`clearAllConversationUnreadMessageCount` | 获取或清零会话未读数，详见 [会话未读数](conversation_unread.html)。 |
| 会话删除 | `deleteConversation`、`deleteConversations`、`deleteRemoteConversation`、`deleteAllMessageAndConversation` | 删除本地或服务端会话及消息，详见 [删除会话](conversation_delete.html)。 |
| 会话置顶 | `pinConversation` | 设置或取消会话置顶，详见 [置顶会话](conversation_pin.html)。 |
| 会话标记 | `addRemoteAndLocalConversationsMark`、`deleteRemoteAndLocalConversationsMark` | 为一个或多个会话添加或移除标记，详见 [会话标记](conversation_mark.html)。 |
| 会话免打扰 | `ChatPushManager` 的会话免打扰接口 | 设置或查询单聊、群聊会话的免打扰规则。 |
| 会话内消息 | `loadMessages`、`loadMessagesWithKeyword`、`deleteMessage`、`deleteAllMessages` | 获取、搜索或删除本地会话消息。 |
| 会话内置顶消息 | `pinMessage`、`unpinMessage`、`fetchPinnedMessages` | 置顶、取消置顶或获取会话中的置顶消息。 |

## 会话事件

#### 会话列表事件

本地会话发生变化时，SDK 会触发 `ChatEventHandler#onConversationsUpdate`。该回调不返回完整会话列表，应用应重新读取本地会话列表并刷新界面。

```dart
const String chatHandlerId = 'conversation_update_handler';

ChatClient.getInstance.chatManager.addEventHandler(
  chatHandlerId,
  ChatEventHandler(
    onConversationsUpdate: () async {
      final List<ChatConversation> conversations =
          await ChatClient.getInstance.chatManager.loadAllConversations();
      // 使用最新会话列表刷新界面。
    },
  ),
);

// 不再需要监听时移除监听器。
ChatClient.getInstance.chatManager.removeEventHandler(chatHandlerId);
```

会话自动同步的开始和完成状态由 `ConnectionEventHandler#onDataSyncStart` 和 `onDataSyncFinish` 监听。

#### 多设备会话事件

通过 `ChatClient#addMultiDeviceEventHandler` 注册 `ChatMultiDeviceEventHandler`，可以在 `onConversationEvent` 中接收当前账号其他设备执行的会话操作。常见事件包括：

- `CONVERSATION_PINNED`：其他设备置顶会话。
- `CONVERSATION_UNPINNED`：其他设备取消会话置顶。
- `CONVERSATION_DELETE`：其他设备删除服务端会话。
- `CONVERSATION_UPDATE_MARK`：其他设备更新会话标记。
- `CONVERSATION_MUTE_INFO_CHANGED`：其他设备更新会话免打扰设置。
- `CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED`：其他设备清零指定会话的未读数。
- `ALL_CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED`：其他设备清零所有会话的未读数。

不再需要监听时，应调用 `ChatClient#removeMultiDeviceEventHandler` 移除监听器。

## 最佳实践

- 在初始化 SDK 前显式配置 `ChatDataSyncType.conversations`，并在会话数据同步成功后读取本地会话列表；如需关闭自动同步，配置 `ChatDataSyncType.none`。
- 展示会话列表时调用 `loadAllConversations`；如需特定排序、分页或筛选，在应用层处理。
- 注册 `ChatEventHandler`；收到 `onConversationsUpdate` 后重新读取会话列表并刷新界面。
- 页面或组件销毁时移除 `ChatEventHandler`、`ConnectionEventHandler` 和 `ChatMultiDeviceEventHandler`，避免重复回调和内存泄漏。
- 会话未读数清零与消息已读回执是两个独立功能：前者更新当前账号的会话未读状态，后者通知原消息发送方消息已读。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`id`](#会话对象) / [`type`](#会话对象) | `ChatConversation` | 获取会话 ID 和会话类型。 |
| [`unreadCount`](#会话对象) / [`latestMessage`](#会话对象) | `ChatConversation` | 获取会话未读数和最近一条消息。 |
| [`getConversation`](#通过接口创建本地会话) | `ChatManager` | 查找本地会话，并可按参数在会话不存在时创建。 |
| [`withAppKey`](#通过服务端同步更新会话列表) | `ChatOptions` | 使用 App Key 创建 SDK 配置。 |
| [`dataSyncType`](#通过服务端同步更新会话列表) | `ChatOptions` | 设置登录成功后自动同步的数据类型。 |
| [`init`](#通过服务端同步更新会话列表) | `ChatClient` | 使用指定配置初始化 SDK。 |
| [`loadAllConversations`](#会话列表与空会话) | `ChatManager` | 获取本地全部会话。 |
| [`enableEmptyConversation`](#会话列表与空会话) | `ChatOptions` | 设置从本地数据库加载会话时是否包含空会话。 |
| [`clearConversationUnreadMessageCount`](#当前会话与未读数) | `ChatManager` | 清零指定会话的本地未读消息数。 |
| [`clearAllConversationUnreadMessageCount`](#当前会话与未读数) | `ChatManager` | 清零所有会话的本地未读消息数。 |
| [`sendMessageReadReceipts`](#当前会话与未读数) | `ChatManager` | 为单聊或群聊消息发送已读回执。 |
| [`getUnreadMessageCount`](#会话功能列表) | `ChatManager` | 获取本地单聊和群聊会话的未读消息总数。 |
| [`deleteConversation`](#会话功能列表) / [`deleteRemoteConversation`](#会话功能列表) | `ChatManager` | 删除本地会话，或删除当前用户服务端和本地的指定会话。 |
| [`deleteConversations`](#会话功能列表) | `ChatManager` | 异步批量删除本地会话，并可设置是否删除本地消息。 |
| [`deleteAllMessageAndConversation`](#会话功能列表) | `ChatManager` | 删除所有消息和会话，并按参数决定是否清除服务端数据。 |
| [`pinConversation`](#会话功能列表) | `ChatManager` | 设置或取消会话置顶。 |
| [`addRemoteAndLocalConversationsMark`](#会话功能列表) / [`deleteRemoteAndLocalConversationsMark`](#会话功能列表) | `ChatManager` | 为会话添加或移除标记。 |
| [`loadMessages`](#会话功能列表) / [`loadMessagesWithKeyword`](#会话功能列表) | `ChatConversation` | 从本地数据库分页加载或搜索会话消息。 |
| [`deleteMessage`](#会话功能列表) / [`deleteAllMessages`](#会话功能列表) | `ChatConversation` | 删除指定本地消息或清空会话的全部本地消息。 |
| [`pinMessage`](#会话功能列表) / [`unpinMessage`](#会话功能列表) | `ChatManager` | 置顶或取消置顶会话中的消息。 |
| [`fetchPinnedMessages`](#会话功能列表) | `ChatManager` | 从服务器获取会话中的置顶消息。 |
