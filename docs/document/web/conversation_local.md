# 管理本地会话

## 功能说明

本地会话是 SDK 在当前登录用户侧维护的会话列表缓存。用户收发消息、登录后同步会话列表、主动刷新服务端会话列表，以及执行会话置顶、标记、删除、未读数清零等操作时，SDK 会创建或更新本地会话列表缓存，业务层可基于该缓存渲染会话列表。

本文介绍如何读取、刷新和维护本地会话列表缓存。会话列表更新相关事件仅在本文用于说明监听方式，不纳入文末接口列表中的事件统计。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并登录成功。
- 初始化 SDK 时已注册 `ChatManager`，能够通过 `client.chatManager` 调用会话与消息相关接口。
- 如需使用服务端会话列表、会话置顶或会话标记能力，请确认已在控制台 [开通服务端会话列表功能](/product/console/basic_conversation_group_chatroom.html#服务端会话列表)。

## 本地会话数据来源

SDK 的本地会话列表缓存主要来自以下路径：

- 登录成功后，SDK 会初始化本地缓存，并读取当前用户此前已缓存到本地的会话列表。该步骤不依赖 `enableSyncData` 是否包含 `conversation`。
- 如果 `enableSyncData` 包含 `conversation`，SDK 在读取本地缓存后，还会自动从服务端同步会话列表，并用同步结果更新本地缓存。
- 业务侧可调用 `refreshSessionList` 主动从服务端刷新会话列表，并将刷新结果写入本地缓存。
- 当前用户收发消息时，SDK 会创建或更新对应会话的最后一条消息、未读数、排序时间等本地展示信息。
- 会话置顶、会话标记、删除会话、清空全部会话、清零会话未读数等操作成功后，SDK 会同步更新本地会话列表缓存。

本地会话列表缓存用于展示会话列表，不等同于完整的用户属性、群组信息或全部历史消息。若业务需要更完整的用户、群组或消息内容，请按需调用对应模块的接口获取。

## 登录后自动同步会话列表

SDK 初始化时，`enableSyncData` 默认包含 `conversation`。用户登录成功后，SDK 会先初始化并读取本地缓存；随后，如果 `enableSyncData` 包含 `conversation`，SDK 会自动同步服务端会话列表并刷新本地会话列表缓存。

如果业务侧将 `enableSyncData` 配置为不包含 `conversation`，SDK 仍会初始化并读取本地已有会话列表缓存，但不会在登录后自动从服务端同步会话列表。此时如需获取服务端最新会话列表，可在合适时机主动调用 [refreshSessionList](conversation_list.html#从服务端获取会话列表)。

如果业务侧显式配置同步项，需保留 `conversation`：

```typescript
const client = ChatClient.init({
  appKey: 'your appKey',
  managers: [ChatManager],
  enableSyncData: ['conversation'],
});
```

如需自动同步时包含 [空会话](conversation_overview.html#会话列表与空会话)，可配置 `syncConversationListConfig.includeEmpty`：

```typescript
const client = ChatClient.init({
  appKey: 'your appKey',
  managers: [ChatManager],
  enableSyncData: ['conversation'],
  syncConversationListConfig: {
    includeEmpty: true,
  },
});
```

:::tip
`syncConversationListConfig.includeEmpty` 影响登录自动同步和主动刷新服务端会话列表的结果。直接调用 `getConversationList` 读取本地缓存时，SDK 会过滤掉 `lastMessage` 为 `null` 的空会话。
:::

## 从本地缓存读取会话列表

调用 `getConversationList` 可从 SDK 本地会话列表缓存中读取当前会话列表。该接口不发起网络请求，适合用于页面初始化、收到会话列表更新事件后重新读取本地快照，或按置顶、标记条件筛选本地会话。

```typescript
// 获取全部非空本地会话。
const conversations = client.chatManager.getConversationList();

// 获取已置顶的本地会话。
const pinnedConversations = client.chatManager.getConversationList({
  isPinned: true,
});

// 获取带指定会话标记的本地会话。mark 取值范围为 0-19。
const markedConversations = client.chatManager.getConversationList({
  mark: 3,
});
```

`getConversationList` 支持的筛选参数如下：

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `isPinned` | Boolean | 否 | 是否只返回置顶或非置顶会话。 |
| `mark` | Number | 否 | 会话标记，取值范围为 `0` 到 `19` 的整数。参数非法时 SDK 会抛出参数错误。 |

:::tip
`getConversationList` 只读取当前本地缓存，不会向服务端刷新数据。如需获取服务端最新会话列表，请先调用 `refreshSessionList`。
:::

## 主动刷新本地会话列表缓存

调用 `refreshSessionList` 可从服务端获取最新会话列表，并刷新 SDK 本地会话列表缓存。该接口返回刷新后的会话列表。

```typescript
const conversations = await client.chatManager.refreshSessionList({
  includeEmpty: false,
});

console.log(conversations);
```

参数说明如下：

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `includeEmpty` | Boolean | 否 | 是否返回空会话。默认不返回空会话；如需返回空会话，设置为 `true`。 |

:::tip
服务端会话列表更新可能存在一定延迟。登录后 SDK 默认会自动同步会话列表，业务侧通常无需在每次收发消息后立即调用 `refreshSessionList`。
:::

## 会话列表项字段说明

`getConversationList` 和 `refreshSessionList` 返回的每个会话列表项均为 `ConversationItem`，主要字段如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | String | 会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `conversationType` | String | 会话类型，取值为 `singleChat`、`groupChat` 或 `chatRoom`。 |
| `unreadCount` | Number | 当前会话的本地未读消息数。 |
| `lastMessage` | Object \| null | 最后一条消息摘要。为空会话时可能为 `null`。 |
| `lastMessageAt` | Number | 最后一条消息的时间戳，单位为毫秒。 |
| `isPinned` | Boolean | 会话是否置顶。 |
| `pinnedTimestamp` | Number | 会话置顶时间戳，单位为毫秒。 |
| `marks` | Array | 会话已应用的标记列表。 |
| `readAt` | Number | 会话已读位置或已读时间戳。 |
| `remindType` | String | 会话提醒类型，例如默认提醒、全部消息、@ 消息或免打扰等。 |
| `conversationName` | String | 会话展示名称。 |
| `conversationAvatar` | String | 会话头像 URL。 |

## 设置当前正在浏览的会话

用户进入会话页面时，可调用 `setCurrentConversation` 设置当前正在浏览的会话。设置后，该会话后续收到在线消息时，SDK 仍会更新最后一条消息和会话列表排序，但不会继续累加该会话的本地未读数。

```typescript
client.chatManager.setCurrentConversation({
  conversationId: 'user_2',
  conversationType: 'singleChat',
});
```

该状态只保存在当前 SDK 实例的内存中。用户切换会话、离开会话页面或关闭会话页面时，应调用 `resetCurrentConversation` 恢复默认未读数累加规则：

```typescript
client.chatManager.resetCurrentConversation();
```

如需确认当前设置的会话，可调用 `getCurrentConversation`：

```typescript
const currentConversation = client.chatManager.getCurrentConversation();
console.log(currentConversation);
```

## 更新本地会话列表缓存的常见操作

以下操作成功后，SDK 会同步更新本地会话列表缓存；如果本地会话列表快照发生变化，SDK 会触发会话列表更新事件，业务层可据此刷新 UI。

| 场景 | API | 本地缓存变化 |
| :--- | :--- | :--- |
| 设置或取消会话置顶 | `setConversationPinned` | 更新会话的 `isPinned`、`pinnedTimestamp` 以及会话列表排序。 |
| 添加会话标记 | `addConversationMark` | 更新会话的 `marks`。 |
| 移除会话标记 | `removeConversationMark` | 更新会话的 `marks`。 |
| 删除指定会话 | `deleteConversation` | 从本地会话列表缓存中移除指定会话。 |
| 清空全部会话和消息 | `clearAllMessagesAndConversations` | 清空当前用户本地 conversation/session-list 缓存。 |
| 清零指定会话未读数 | `clearConversationUnreadMessageCount` | 将指定会话的 `unreadCount` 置为 `0`，并更新 `readAt`。 |
| 清零全部会话未读数 | `clearAllConversationUnreadMessageCount` | 将本地会话列表中全部会话的 `unreadCount` 置为 `0`，并更新 `readAt`。 |

示例代码如下：

```typescript
// 删除指定会话。
await client.chatManager.deleteConversation({
  conversationId: 'user_2',
  conversationType: 'singleChat',
  deleteRoamingMessages: false,
});

// 清空当前用户的全部会话和服务端漫游消息。
await client.chatManager.clearAllMessagesAndConversations();

// 清零指定会话未读数。
await client.chatManager.clearConversationUnreadMessageCount({
  conversationId: 'user_2',
  conversationType: 'singleChat',
});

// 清零全部会话未读数。
await client.chatManager.clearAllConversationUnreadMessageCount();
```

## 监听本地会话列表更新

当本地会话列表缓存发生变化时，SDK 会触发会话列表更新事件。你可以调用 `addEventHandler` 注册监听器，并使用事件中的会话列表快照刷新 UI。

```typescript
client.chatManager.addEventHandler('conversation-list-listener', {
  onConversationListUpdate: event => {
    console.log('会话列表更新原因:', event.reason);
    console.log('当前完整会话列表:', event.items);
    console.log('本次变化补丁:', event.patch);
  },
});
```

事件中的常用字段如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `items` | Array | 当前完整且已排序的会话列表快照。 |
| `reason` | String | 会话列表更新原因。由本地操作引起的变化通常为 `local`。 |
| `patch` | Object | 本次变化补丁。业务层如需保留自定义本地字段，可结合该字段做增量合并。 |

:::tip
事件名和事件字段用于说明本地会话列表的更新机制，不作为本文接口列表中的 API 单独统计。
:::

## 注意事项

- 本地会话列表缓存由 SDK 内置维护，不需要额外集成本地存储插件。
- `getConversationList` 只读本地缓存，不会刷新网络数据，并且会过滤 `lastMessage` 为 `null` 的空会话。
- `refreshSessionList({ includeEmpty: true })` 可从服务端刷新并返回空会话；是否展示空会话由业务侧自行决定。
- `getConversationList({ mark })` 中的 `mark` 必须是 `0` 到 `19` 的整数，否则 SDK 会抛出参数错误。
- `setCurrentConversation` 只影响当前 SDK 实例内存中的在线消息未读数累加规则，不会同步到其他设备，也不会持久化。
- 删除会话、清空会话、会话未读数清零等操作可能需要客户端处于已连接状态；调用失败时请根据 SDK 返回的错误信息进行处理。
- 建议统一登录用户 ID 的大小写，避免服务端会话列表与本地缓存出现数据不一致。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`ChatClient.init`](#登录后自动同步会话列表) | `ChatClient` | 初始化 SDK，可注册 `ChatManager`，并配置会话列表自动同步参数。 |
| [`getConversationList`](#从本地缓存读取会话列表) | `ChatManager` | 从 SDK 本地会话列表缓存中读取非空会话，并支持按置顶状态或会话标记筛选。 |
| [`refreshSessionList`](#主动刷新本地会话列表缓存) | `ChatManager` | 从服务端获取最新会话列表，并刷新本地会话列表缓存。 |
| [`setCurrentConversation`](#设置当前正在浏览的会话) | `ChatManager` | 设置当前正在浏览的会话，避免该会话后续在线消息继续累加本地未读数。 |
| [`resetCurrentConversation`](#设置当前正在浏览的会话) | `ChatManager` | 重置当前正在浏览的会话，恢复默认未读数累加规则。 |
| [`getCurrentConversation`](#设置当前正在浏览的会话) | `ChatManager` | 获取当前正在浏览的会话；未设置时返回 `null`。 |
| [`setConversationPinned`](#更新本地会话列表缓存的常见操作) | `ChatManager` | 设置或取消会话置顶，并更新本地会话列表缓存。 |
| [`addConversationMark`](#更新本地会话列表缓存的常见操作) | `ChatManager` | 为会话添加标记，并更新本地会话列表缓存。 |
| [`removeConversationMark`](#更新本地会话列表缓存的常见操作) | `ChatManager` | 移除会话标记，并更新本地会话列表缓存。 |
| [`deleteConversation`](#更新本地会话列表缓存的常见操作) | `ChatManager` | 删除指定会话，并同步移除本地会话列表缓存中的对应会话。 |
| [`clearAllMessagesAndConversations`](#更新本地会话列表缓存的常见操作) | `ChatManager` | 清空当前用户的全部会话和服务端漫游消息，并清空本地会话列表缓存。 |
| [`clearConversationUnreadMessageCount`](#更新本地会话列表缓存的常见操作) | `ChatManager` | 清零指定会话未读数，并更新本地缓存中的 `unreadCount` 和 `readAt`。 |
| [`clearAllConversationUnreadMessageCount`](#更新本地会话列表缓存的常见操作) | `ChatManager` | 清零全部会话未读数，并更新本地会话列表缓存。 |
