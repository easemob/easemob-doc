# 会话介绍

## 功能说明

会话是单聊、群聊或聊天室中的消息集合。SDK 通过 `Conversation` 表示本地会话，应用可以读取会话 ID、会话类型、名称、头像、最新一条消息、未读数、置顶状态、会话标记和本地扩展字段等数据。

HarmonyOS SDK 5.0.0 默认在登录成功后自动同步服务端会话数据并写入本地。应用可在同步完成后通过本地接口读取和展示会话列表。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见[快速开始](quickstart.html)。
- 已了解环信即时通讯 IM API 的使用限制，详见[使用限制](/product/limitation.html)。
- 如需使用服务端会话列表、会话置顶或会话标记等增值功能，已在环信控制台开通相应功能。

## 会话模型

### 会话类型和会话 ID

SDK 通过会话类型和会话 ID 标识会话：

| 会话类型 | `ConversationType` | 会话 ID |
| :--- | :--- | :--- |
| 单聊 | `Chat` | 对端用户 ID。 |
| 群聊 | `GroupChat` | 群组 ID。 |
| 聊天室 | `ChatRoom` | 聊天室 ID。 |

### 会话对象

会话列表中的每一项为 `Conversation`，常用接口如下：

| API | 说明 |
| :--- | :--- |
| `conversationId()` | 获取会话 ID。 |
| `getType()` | 获取会话类型。 |
| `getConversationName()` | 获取会话名称。该接口适用于单聊和群聊会话。 |
| `getConversationAvatar()` | 获取会话头像。该接口适用于单聊和群聊会话。 |
| `getUnreadMsgCount()` | 获取该会话的本地未读消息数。 |
| `getLatestMessage()` | 获取会话中的最新一条消息。 |
| `isPinned()` | 获取会话是否置顶。 |
| `getPinnedTime()` | 获取会话置顶时间，单位为毫秒；未置顶时返回 `0`。 |
| `marks()` | 获取会话标记集合。 |
| `getExtField()` / `setExtField(ext)` | 获取或设置会话的本地扩展字段。该字段只保存在本地，不同步到服务器。 |

:::tip
`Conversation` 主要包含本地会话及消息相关数据，不等同于完整的用户属性、群组详情或聊天室详情。单聊或群聊的相关用户、群组数据尚未同步时，`getConversationName()` 和 `getConversationAvatar()` 可能返回空字符串。
:::

## 会话创建与更新

### 通过消息创建或更新会话

收发消息时，SDK 会根据消息所属的会话创建或更新本地会话：

- 单聊消息：根据对端用户 ID 创建或更新单聊会话。
- 群聊消息：根据群组 ID 创建或更新群聊会话。
- 聊天室消息：根据聊天室 ID 创建或更新聊天室会话。

收到在线消息后，SDK 会更新会话的最新一条消息、排序和未读数等本地状态。命令消息不保存到本地；发送命令消息前，SDK 也不会为其创建本地会话。

### 通过接口创建本地会话

调用 `getConversation(conversationId, type, createIfNotExist)` 时，将 `createIfNotExist` 设为 `true`，SDK 会在本地不存在指定会话时创建会话对象；设为 `false` 时不会创建，未找到则返回 `undefined`。该参数的默认值为 `false`。

```typescript
let conversation: Conversation | undefined = ChatClient.getInstance()
    .chatManager()
    ?.getConversation(
        conversationId,
        ConversationType.Chat,
        true
    );
```

省略 `type` 和 `createIfNotExist` 时，SDK 按单聊类型查找已有会话，不会自动创建。

### 通过服务端同步更新会话列表

`ChatOptions#setDataSyncType` 默认包含 `DataSyncType.CONVERSATIONS`。用户登录成功后，SDK 会自动同步服务端会话数据并写入本地。你也可以在调用 `ChatClient#init` 前显式配置该方法，以指定需要自动同步的数据类型；传入 `DataSyncType.NONE` 可关闭自动数据同步。

```typescript
let options = new ChatOptions({ appKey: "your-org#your-app" });
options.setDataSyncType(DataSyncType.CONVERSATIONS);

ChatClient.getInstance().init(context, options);
```

应用可通过 `ConnectionListener#onDataSyncStart` 和 `onDataSyncFinish` 监听会话数据同步状态。当 `type` 为 `DataSyncType.CONVERSATIONS` 且 `errorCode` 为 `ChatError.EM_NO_ERROR` 时，可以从本地读取最新会话列表。详见 [会话列表](conversation_list.html)。

## 会话列表与空会话

SDK 提供以下本地会话列表读取方式：

| 方式 | API | 说明 |
| :--- | :--- | :--- |
| 排序列表 | `getAllConversationsBySort()` | 从本地数据库读取全部会话。置顶会话优先；置顶和非置顶会话内部均按最新一条消息的时间戳倒序排列。 |
| 本地列表 | `getConversations()` | 获取当前加载到本地的会话数组。 |

## 当前会话与未读数

应用进入会话页面并处理完消息后，可按业务需要清零会话未读数：

| API | 说明 |
| :--- | :--- |
| `clearConversationUnreadMessageCount` | 清零指定会话的本地未读数，并同步当前账号的其他设备。 |
| `clearAllConversationUnreadMessageCount` | 清零所有会话的本地未读数，并同步当前账号的其他设备。 |

```typescript
let chatManager = ChatClient.getInstance().chatManager();
if (chatManager) {
    chatManager.clearConversationUnreadMessageCount(conversationId)
        .then(() => {
            // 指定会话的未读消息数已清零。
        })
        .catch((error: ChatError) => {
            // 根据 error.errorCode 和 error.description 处理错误。
        });
}
```

:::tip
清零会话未读数不会向消息发送方发送消息已读回执。若需通知原消息发送方消息已读，应调用 `sendMessageReadReceipts`，详见[消息已读回执](message_receipt.html#消息已读回执与会话未读数清零)。
:::

## 会话功能列表

| 功能 | 主要 API | 说明 |
| :--- | :--- | :--- |
| 会话列表 | `getAllConversationsBySort`、`getConversations` | 从本地读取会话列表，详见[会话列表](conversation_list.html)。 |
| 会话未读数 | `getUnreadMsgCount`、`clearConversationUnreadMessageCount`、`clearAllConversationUnreadMessageCount` | 获取或清零会话未读数，详见[会话未读数](conversation_unread.html)。 |
| 会话删除 | `deleteConversation`、`deleteConversations`、`deleteConversationFromServer`、`deleteAllConversationsAndMessages` | 删除本地或服务端会话及消息，详见[删除会话](conversation_delete.html)。 |
| 会话置顶 | `pinConversation` | 设置或取消会话置顶，详见[置顶会话](conversation_pin.html)。 |
| 会话标记 | `addConversationMark`、`removeConversationMark` | 为一个或多个会话添加或移除标记，详见[会话标记](conversation_mark.html)。 |
| 会话推送通知方式 | `PushManager` 的会话推送接口 | 设置或查询单聊、群聊会话的推送通知方式，详见 [设置指定会话的推送接收规则](push/push_notification_mode_dnd.html#设置指定会话的推送接收规则)。 |
| 会话内消息 | `loadMoreMessagesFromDB`、`searchMessagesFromDB`、`removeMessage`、`clearAllMessages` | 获取、搜索或删除本地会话消息，详见[获取本地历史消息](message_retrieve.html)和[删除本地消息](message_delete.html)。 |
| 会话内置顶消息 | `pinMessage`、`unpinMessage`、`fetchPinnedMessagesFromServer` | 置顶、取消置顶或从服务器获取会话中的置顶消息，详见[置顶消息](message_pin.html)。 |

## 会话事件

#### 会话列表事件

本地会话发生变化时，SDK 会触发 `ConversationListener#onConversationUpdate`。该回调不返回完整会话列表，应用应重新读取本地会话列表并刷新界面。

```typescript
let conversationListener: ConversationListener = {
    onConversationUpdate: (): void => {
        let conversations: Array<Conversation> = ChatClient.getInstance()
            .chatManager()
            ?.getAllConversationsBySort() ?? [];
        // 使用最新会话列表刷新界面。
    }
};

ChatClient.getInstance()
    .chatManager()
    ?.addConversationListener(conversationListener);

// 不再需要监听时移除监听器。
ChatClient.getInstance()
    .chatManager()
    ?.removeConversationListener(conversationListener);
```

会话自动同步的开始和完成状态由 `ConnectionListener#onDataSyncStart` 和 `onDataSyncFinish` 监听。

#### 多设备会话事件

通过 `ChatClient#addMultiDevicesListener` 注册 `MultiDevicesListener`，可以在 `onConversationEvent` 中接收当前账号其他设备执行的会话操作。常见事件包括：

- `CONVERSATION_PINNED`：其他设备置顶会话。
- `CONVERSATION_UNPINNED`：其他设备取消会话置顶。
- `CONVERSATION_DELETED`：其他设备删除服务端会话。
- `CONVERSATION_MARK_UPDATE`：其他设备更新会话标记。
- `CONVERSATION_MUTE_INFO_CHANGED`：其他设备更新会话免打扰设置。
- `CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED`：其他设备清零指定会话的未读数。
- `ALL_CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED`：其他设备清零所有会话的未读数。

收到会话事件后，应用应重新读取本地会话列表并刷新界面。不再需要监听时，应调用 `ChatClient#removeMultiDevicesListener` 移除监听器。

## 最佳实践

- 使用默认配置或在初始化 SDK 前配置 `DataSyncType.CONVERSATIONS`，并在会话数据同步成功后读取本地会话列表；如需关闭自动同步，显式配置 `DataSyncType.NONE`。
- 展示会话列表时优先使用 `getAllConversationsBySort`，直接使用 SDK 返回的置顶优先排序结果。
- 注册 `ConversationListener`；收到 `onConversationUpdate` 后重新读取会话列表并刷新界面。
- 页面或组件销毁时移除 `ConversationListener`、`ConnectionListener` 和 `MultiDevicesListener`，避免重复回调和资源泄漏。
- 会话未读数清零与消息已读回执是两个独立功能：前者更新当前账号的会话未读状态，后者通知原消息发送方消息已读。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`conversationId`](#会话对象) / [`getType`](#会话对象) | `Conversation` | 获取会话 ID 和会话类型。 |
| [`getConversationName`](#会话对象) / [`getConversationAvatar`](#会话对象) | `Conversation` | 获取单聊或群聊会话的名称和头像。 |
| [`getUnreadMsgCount`](#会话对象) / [`getLatestMessage`](#会话对象) | `Conversation` | 获取会话未读数和最新一条消息。 |
| [`isPinned`](#会话对象) / [`getPinnedTime`](#会话对象) / [`marks`](#会话对象) | `Conversation` | 获取会话置顶状态、置顶时间和会话标记。 |
| [`getExtField`](#会话对象) / [`setExtField`](#会话对象) | `Conversation` | 获取或设置会话的本地扩展字段。 |
| [`getConversation`](#通过接口创建本地会话) | `ChatManager` | 查找本地会话，并可按参数在会话不存在时创建。 |
| [`setDataSyncType`](#通过服务端同步更新会话列表) | `ChatOptions` | 设置登录成功后自动同步的数据类型。 |
| [`init`](#通过服务端同步更新会话列表) | `ChatClient` | 使用指定配置初始化 SDK。 |
| [`onDataSyncStart`](#通过服务端同步更新会话列表) / [`onDataSyncFinish`](#通过服务端同步更新会话列表) | `ConnectionListener` | 监听登录后的数据自动同步状态。 |
| [`getAllConversationsBySort`](#会话列表与空会话) / [`getConversations`](#会话列表与空会话) | `ChatManager` | 获取本地会话列表。 |
| [`clearConversationUnreadMessageCount`](#当前会话与未读数) | `ChatManager` | 清零指定会话的本地未读消息数。 |
| [`clearAllConversationUnreadMessageCount`](#当前会话与未读数) | `ChatManager` | 清零所有会话的本地未读消息数。 |
| [`sendMessageReadReceipts`](#当前会话与未读数) | `ChatManager` | 为单聊或群聊消息发送已读回执。 |
| [`deleteConversation`](#会话功能列表) / [`deleteConversations`](#会话功能列表) | `ChatManager` | 删除一个或多个本地会话，并按参数决定是否删除本地历史消息。 |
| [`deleteConversationFromServer`](#会话功能列表) / [`deleteAllConversationsAndMessages`](#会话功能列表) | `ChatManager` | 删除服务端和本地的会话及消息。 |
| [`pinConversation`](#会话功能列表) | `ChatManager` | 设置或取消会话置顶。 |
| [`addConversationMark`](#会话功能列表) / [`removeConversationMark`](#会话功能列表) | `ChatManager` | 为会话添加或移除标记。 |
| [`loadMoreMessagesFromDB`](#会话功能列表) / [`searchMessagesFromDB`](#会话功能列表) | `Conversation` | 从本地数据库分页加载或搜索会话消息。 |
| [`removeMessage`](#会话功能列表) / [`clearAllMessages`](#会话功能列表) | `Conversation` | 删除指定本地消息或清空会话的全部本地消息。 |
| [`pinMessage`](#会话功能列表) / [`unpinMessage`](#会话功能列表) | `ChatManager` | 置顶或取消置顶会话中的消息。 |
| [`fetchPinnedMessagesFromServer`](#会话功能列表) | `ChatManager` | 从服务器获取会话中的置顶消息。 |
| [`addConversationListener`](#会话列表事件) / [`removeConversationListener`](#会话列表事件) | `ChatManager` | 添加或移除会话更新监听器。 |
| [`addMultiDevicesListener`](#多设备会话事件) / [`removeMultiDevicesListener`](#多设备会话事件) | `ChatClient` | 添加或移除多设备监听器。 |
