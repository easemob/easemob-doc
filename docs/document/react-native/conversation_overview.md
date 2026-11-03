# 会话介绍

## 功能说明

会话是单聊、群聊或聊天室中的消息集合。SDK 通过 `ChatConversation` 表示本地会话，应用可以读取会话 ID、会话类型、最近一条消息、未读数、置顶状态、会话标记和本地扩展字段等数据。

React Native SDK 支持在初始化前通过 `ChatOptions.dataSyncType` 配置 [登录成功后自动同步服务端会话数据并写入本地](conversation_list.html#登录后自动同步会话列表)。应用可在同步完成后通过本地接口读取和展示会话列表。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见[快速开始](quickstart.html)。本地数据接口需在当前账号的数据库打开后调用，详见 [监听会话列表同步状态](conversation_list.html#监听会话列表同步状态)。
- 已了解环信即时通讯 IM API 的使用限制，详见[使用限制](/product/limitation.html)。
- 如需使用服务端会话列表、会话置顶或会话标记等增值功能，已在环信控制台开通相应功能。

## 会话模型

### 会话类型和会话 ID

SDK 通过会话类型和会话 ID 标识会话：

| 会话类型 | `ChatConversationType` | 会话 ID |
| :--- | :--- | :--- |
| 单聊 | `PeerChat` | 对端用户 ID。 |
| 群聊 | `GroupChat` | 群组 ID。 |
| 聊天室 | `RoomChat` | 聊天室 ID。 |

### 会话对象

会话列表中的每一项为 `ChatConversation`，常用属性和方法如下：

| 属性或方法 | 说明 |
| :--- | :--- |
| `convId` | 会话 ID。 |
| `convType` | 会话类型。 |
| `displayName` | 会话名称。该属性适用于单聊和群聊会话，为只读可选属性。 |
| `displayAvatar` | 会话头像。该属性适用于单聊和群聊会话，为只读可选属性。 |
| `getUnreadCount()` | 获取该会话的本地未读消息数，返回 `Promise<number>`。 |
| `getLatestMessage()` | 获取会话中的最新一条消息，返回 `Promise<ChatMessage \| undefined>`。 |
| `isPinned` | 会话是否置顶，类型为 `boolean \| undefined`。 |
| `pinnedTime` | 会话置顶时间，单位为毫秒；未置顶时返回 `0`，类型为 `number \| undefined`。 |
| `marks` | 会话标记数组，类型为 `ChatConversationMarkType[] \| undefined`。 |
| `ext` | 会话的本地扩展字段。 |

设置本地扩展字段时，使用 `ChatManager#setConversationExtension`，传入会话 ID、会话类型和扩展对象。扩展对象的值支持 `string`、`number` 或 `boolean`。当前 `ChatConversation#setConversationExtension` 未将传入的新值正确转发给管理器，应使用管理器接口保存，并在成功后重新读取会话。// TODO：研发确认。AI 的回答：ChatConversation#setConversationExtension 确实把旧的 this.ext 传给管理器，没有正确转发新参数；使用管理器接口的建议正确。

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

调用 `ChatManager#getConversation` 时，将 `createIfNeed` 设为 `true`，SDK 会在本地不存在指定会话时创建会话对象；设为 `false` 时不会创建，未找到则返回 `undefined`。

```typescript
async function getOrCreateConversation(convId: string): Promise<void> {
  try {
    const conversation = await ChatClient.getInstance().chatManager
      .getConversation(convId, ChatConversationType.PeerChat, true);
    // 使用获取或创建的本地会话
  } catch (error: unknown) {
    console.error('获取或创建会话失败：', error);
  }
}
```

React Native SDK 的 `convId` 和 `convType` 均为必需参数，`createIfNeed` 默认为 `true`。仅查询已有会话时，应传入 `false`。

### 通过服务端同步更新会话列表

在调用 `ChatClient#init` 前，设置 `ChatOptions.dataSyncType` 包含 `ChatDataSyncType.Conversations`。用户登录成功后，SDK 会自动同步服务端会话数据并写入本地。传入 `ChatDataSyncType.None` 可关闭自动数据同步。

```typescript
async function initializeConversationSync(): Promise<void> {
  try {
    const options = ChatOptions.withAppKey({
      appKey: 'your-org#your-app',
      // 登录成功后自动同步会话列表
      dataSyncType: ChatDataSyncType.Conversations,
    });
    await ChatClient.getInstance().init(options);
  } catch (error: unknown) {
    console.error('初始化 SDK 失败：', error);
  }
}
```

应用可通过 `ChatConnectEventListener#onDataSyncStart` 和 `ChatConnectEventListener#onDataSyncFinish` 监听会话数据同步状态。当 `type` 位掩码包含 `ChatDataSyncType.Conversations` 且 `errorCode` 为 `0` 时，可以从本地读取最新会话列表。

## 会话列表与空会话

SDK 提供以下本地会话列表读取方式：

| 方式 | API | 说明 |
| :--- | :--- | :--- |
| 本地列表 | `ChatManager#getAllConversations` | 返回 `Promise<ChatConversation[]>`，不返回以会话 ID 为键的 Map。React Native SDK 5.x 在两端的返回顺序如下：Android 返回置顶优先的排序结果；iOS 按最近一条消息的时间排序，不保证置顶优先。 |

空会话是没有消息的会话。例如，会话中的全部消息过期、被清除或被撤回后，该会话可能成为空会话。

应用从本地数据库加载会话时，是否包含空会话由 `ChatOptions.enableEmptyConversation` 控制。该选项默认为 `false`；如需包含空会话，应在调用 `ChatClient#init` 前设置为 `true`。

```typescript
async function initializeIncludingEmptyConversations(): Promise<void> {
  try {
    const options = ChatOptions.withAppKey({
      appKey: 'your-org#your-app',
      // 从本地数据库加载会话时包含空会话
      enableEmptyConversation: true,
    });
    await ChatClient.getInstance().init(options);
  } catch (error: unknown) {
    console.error('初始化 SDK 失败：', error);
  }
}
```

空会话也可以进行置顶、添加会话标记和删除等操作。

## 当前会话与未读数

应用进入会话页面并处理完消息后，可按业务需要清零会话未读数：

| API | 说明 |
| :--- | :--- |
| `ChatManager#clearConversationUnreadMessageCount` | 清零指定会话的本地未读数，并尝试同步到当前账号的其他设备。 |
| `ChatManager#clearAllConversationUnreadMessageCount` | 清零所有会话的本地未读数，并尝试同步到当前账号的其他设备。 |

```typescript
async function clearCurrentConversationUnread(convId: string): Promise<void> {
  try {
    // 清零指定会话的未读消息数
    await ChatClient.getInstance().chatManager
      .clearConversationUnreadMessageCount(convId);
    // 指定会话的未读消息数已清零
  } catch (error: unknown) {
    console.error('清零会话未读数失败：', error);
  }
}
```

:::tip
清零接口的 Promise 成功不表示其他设备已完成同步，详见 [会话未读数清零流程](conversation_unread.html#会话未读数清零流程)。会话未读数清零不会向会话对端发送消息已读回执。若需通知原消息发送方消息已读，应调用 `ChatManager#sendMessageReadReceipts`，详见 [消息已读回执](message_receipt.html)。
:::

## 会话功能列表

| 功能 | 主要 API | 说明 |
| :--- | :--- | :--- |
| 会话列表 | `ChatManager#getAllConversations` | 从本地内存或数据库读取会话列表，详见 [会话列表](conversation_list.html)。 |
| 会话未读数 | `ChatManager#getUnreadCount`、`ChatConversation#getUnreadCount`、`ChatManager#clearConversationUnreadMessageCount`、`ChatManager#clearAllConversationUnreadMessageCount` | 获取或清零会话未读数，详见 [会话未读数](conversation_unread.html)。 |
| 会话删除 | `ChatManager#deleteConversation`、`ChatManager#deleteConversations`、`ChatManager#removeConversationFromServer`、`ChatManager#deleteAllMessageAndConversation` | 删除本地或服务端会话及消息，详见[删除会话](conversation_delete.html)。 |
| 会话置顶 | `ChatManager#pinConversation` | 设置或取消会话置顶，详见 [置顶会话](conversation_pin.html)。 |
| 会话标记 | `ChatManager#addRemoteAndLocalConversationsMark`、`ChatManager#deleteRemoteAndLocalConversationsMark` | 为一个或多个会话添加或移除标记，详见[会话标记](conversation_mark.html)。 |
| 会话免打扰 | `ChatPushManager` 的会话免打扰接口 | 设置或查询单聊、群聊会话的免打扰规则。 |
| 会话内消息 | `ChatConversation#getMsgs`、`ChatConversation#getMsgsWithKeyword`、`ChatConversation#deleteMessage`、`ChatConversation#deleteAllMessages` | 获取、搜索或删除本地会话消息。 |
| 会话内置顶消息 | `ChatManager#pinMessage`、`ChatManager#unpinMessage`、`ChatManager#fetchPinnedMessages` | 置顶、取消置顶或获取会话中的置顶消息。 |

## 会话事件

#### 会话列表事件

本地会话新增或删除时，SDK 会触发 `ChatMessageEventListener#onConversationsUpdate`。该回调不返回完整会话列表，应用应重新读取本地会话列表并刷新界面。

```typescript
const manager = ChatClient.getInstance().chatManager;
const conversationListener: ChatMessageEventListener = {
  onConversationsUpdate(): void {
    void manager.getAllConversations()
      .then((conversations) => {
        // 使用最新会话列表刷新界面
        console.log('最新会话列表：', conversations);
      })
      .catch((error: unknown) => console.error('读取会话列表失败：', error));
  },
};
manager.addMessageListener(conversationListener);

// 不再需要监听时移除监听器
// manager.removeMessageListener(conversationListener);
```

会话自动同步的开始和完成状态由 `ChatConnectEventListener#onDataSyncStart` 和 `ChatConnectEventListener#onDataSyncFinish` 监听。本端设置置顶、标记或清零未读数后，应在操作成功时按需重新读取列表，不依赖 `onConversationsUpdate` 覆盖这些变化。

#### 多设备会话事件

通过 `ChatClient#addMultiDeviceListener` 注册 `ChatMultiDeviceEventListener`，可以在 `ChatMultiDeviceEventListener#onConversationEvent` 中接收当前账号其他设备执行的会话操作。常见的 `ChatMultiDeviceEvent` 事件包括：

- `CONVERSATION_PINNED`：其他设备置顶会话。
- `CONVERSATION_UNPINNED`：其他设备取消会话置顶。
- `CONVERSATION_DELETED`：其他设备删除服务端会话。
- `CONVERSATION_UPDATE_MARK`：其他设备更新会话标记。
- `CONVERSATION_MUTE_CHANGED`：其他设备更新会话免打扰设置。
- `CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED`：其他设备清零指定会话的未读数。
- `ALL_CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED`：其他设备清零所有会话的未读数。

不再需要监听时，应调用 `ChatClient#removeMultiDeviceListener` 移除监听器。

## 最佳实践

- 在初始化 SDK 前配置 `ChatDataSyncType.Conversations`。当前账号的本地数据库成功打开后，即可读取已有的本地会话列表；如需本次从服务端同步的最新数据，应等待会话同步成功后再读取。如需关闭自动同步，显式配置 `ChatDataSyncType.None`。
- 注册 `ChatMessageEventListener`；收到 `ChatMessageEventListener#onConversationsUpdate` 后重新读取会话列表并刷新界面。
- 页面或组件销毁时移除 `ChatMessageEventListener`、`ChatConnectEventListener` 和 `ChatMultiDeviceEventListener`，避免重复回调和内存泄漏。
- 会话未读数清零与消息已读回执是两个独立功能：前者更新当前账号的会话未读状态，后者通知原消息发送方消息已读。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`convId` / `convType`](#会话对象) | `ChatConversation` | 会话 ID 和会话类型。 |
| [`getUnreadCount` / `getLatestMessage`](#会话对象) | `ChatConversation` | 获取会话未读数和最近一条消息。 |
| [`setConversationExtension`](#会话对象) | `ChatManager` | 设置会话的本地扩展字段。 |
| [`getConversation`](#通过接口创建本地会话) | `ChatManager` | 查找本地会话，并可按参数在会话不存在时创建。 |
| [`withAppKey`](#通过服务端同步更新会话列表) | `ChatOptions` | 使用应用的 App Key 创建初始化配置。 |
| [`dataSyncType`](#通过服务端同步更新会话列表) | `ChatOptions` | 设置登录成功后自动同步的数据类型。 |
| [`init`](#通过服务端同步更新会话列表) | `ChatClient` | 使用指定配置初始化 SDK。 |
| [`getAllConversations`](#会话列表与空会话) | `ChatManager` | 获取本地会话列表。 |
| [`enableEmptyConversation`](#会话列表与空会话) | `ChatOptions` | 设置从本地数据库加载会话时是否包含空会话。 |
| [`clearConversationUnreadMessageCount`](#当前会话与未读数) | `ChatManager` | 清零指定会话的本地未读消息数。 |
| [`clearAllConversationUnreadMessageCount`](#当前会话与未读数) | `ChatManager` | 清零所有会话的本地未读消息数。 |
| [`sendMessageReadReceipts`](#当前会话与未读数) | `ChatManager` | 为单聊或群聊消息发送已读回执。 |
| [`getUnreadCount`](#会话功能列表) | `ChatManager` | 获取本地单聊和群聊会话的未读消息总数。 |
| [`deleteConversation` / `removeConversationFromServer`](#会话功能列表) | `ChatManager` | 删除本地会话，或删除当前用户服务端和本地的指定会话。 |
| [`deleteConversations`](#会话功能列表) | `ChatManager` | 异步批量删除本地会话，并可设置是否删除本地消息。 |
| [`deleteAllMessageAndConversation`](#会话功能列表) | `ChatManager` | 删除所有消息和会话，并按参数决定是否清除服务端数据。 |
| [`pinConversation`](#会话功能列表) | `ChatManager` | 设置或取消会话置顶。 |
| [`addRemoteAndLocalConversationsMark` / `deleteRemoteAndLocalConversationsMark`](#会话功能列表) | `ChatManager` | 为会话添加或移除标记。 |
| [`getMsgs` / `getMsgsWithKeyword`](#会话功能列表) | `ChatConversation` | 从本地数据库分页加载或搜索会话消息。 |
| [`deleteMessage` / `deleteAllMessages`](#会话功能列表) | `ChatConversation` | 删除指定本地消息或清空会话的全部本地消息。 |
| [`pinMessage` / `unpinMessage`](#会话功能列表) | `ChatManager` | 置顶或取消置顶会话中的消息。 |
| [`fetchPinnedMessages`](#会话功能列表) | `ChatManager` | 从服务器获取会话中的置顶消息。 |
