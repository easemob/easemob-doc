# 会话介绍

## 功能说明

会话是单聊、群聊或聊天室中消息列表和会话展示状态的集合，用于承载最近一条消息、未读数、置顶状态、会话标记、提醒状态以及会话展示名称和头像等信息。

SDK 会在本地维护会话列表缓存，并可在登录后自动同步服务端会话列表，或由业务主动调用接口从服务端刷新会话列表。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- SDK 初始化时已注册 `ChatManager`，以便使用 `client.chatManager` 相关方法。
- 若需要使用会话免打扰相关功能，SDK 初始化时还需注册 `PushManager`。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 会话模型

### 会话类型和会话 ID

SDK 通过会话类型和会话 ID 唯一标识一个会话。不同会话类型对应的会话 ID 如下：

| 会话类型 | 会话 ID | 说明 |
| :--- | :--- | :--- |
| `singleChat` | 对方用户 ID | 单聊会话。 |
| `groupChat` | 群组 ID | 群聊会话。 |
| `chatRoom` | 聊天室 ID | 聊天室会话。 |

### 会话列表项

会话列表中的每一项为 `ConversationItem`，来自 SDK 本地会话列表缓存的投影数据。主要字段如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | String | 会话 ID。 |
| `conversationType` | String | 会话类型，取值为 `singleChat`、`groupChat` 或 `chatRoom`。 |
| `unreadCount` | Number | 该会话的未读消息数。 |
| `lastMessage` | JSON \| null | 最近一条消息摘要。空会话中该字段为 `null`。 |
| `lastMessageAt` | Number | 最近一条消息的时间戳，单位为毫秒。 |
| `isPinned` | Boolean | 会话是否置顶。 |
| `pinnedTimestamp` | Number | 会话置顶时间戳，单位为毫秒。 |
| `marks` | Array | 会话已应用的标记列表。会话标记槽位取值范围为 0 至 19，业务含义由开发者维护。 |
| `readAt` | Number | 会话已读位置或已读时间戳。 |
| `remindType` | String | 会话提醒类型，取值为 `DEFAULT`、`ALL`、`AT` 或 `NONE`。 |
| `conversationName` | String | 会话显示名称。 |
| `conversationAvatar` | String | 会话头像 URL。 |

:::tip
`ConversationItem` 提供会话列表展示所需的基础字段，但不等同于完整用户属性、完整群组详情或完整聊天室详情。如需展示更完整的信息，可按需调用用户属性、群组或聊天室相关接口。
:::

## 会话创建与更新

### 通过消息创建或更新会话

当用户收发消息时，SDK 会根据消息所属会话创建或更新本地会话列表缓存：

- 单聊消息：SDK 根据消息收发关系创建或更新单聊会话。
- 群聊消息：SDK 根据群组 ID 创建或更新群聊会话。
- 聊天室消息：SDK 根据聊天室 ID 创建或更新聊天室会话。

收到在线消息时，SDK 会更新会话的最近一条消息、会话排序及未读数等本地展示状态。若当前正在浏览该会话，则 SDK 仍会更新最近一条消息和会话排序，但不会累加该会话的本地未读数。详见 [当前会话与未读数](#当前会话与未读数)。

### 通过服务端同步更新会话列表

SDK 初始化时，`enableSyncData` 默认包含 `conversation`。用户登录成功后，SDK 会自动从服务端同步会话列表，并更新本地会话列表缓存。

如需主动从服务端获取最新会话列表，可调用 `refreshSessionList`。该方法会触发会话列表同步流程，并返回刷新后的会话列表。

:::tip
若使用服务端会话列表、会话置顶和会话标记功能，需在环信控制台开通对应功能。
:::

## 会话列表与空会话

SDK 提供两类会话列表读取方式：

| 方式 | 方法 | 说明 |
| :--- | :--- | :--- |
| 从服务端刷新 | `refreshSessionList` | 从服务端获取最新会话列表，并更新 SDK 本地会话列表缓存。可通过 `includeEmpty` 控制是否返回空会话。 |
| 从本地读取 | `getConversationList` | 从 SDK 本地会话列表缓存中读取当前已有的非空会话，不发起网络请求，支持按置顶状态或会话标记过滤。 |

空会话指没有消息或最近一条消息为空的会话。例如，当某个会话中的全部消息 [过期](/product/product_package_feature.html)、[清除](message_delete.html) 或 [撤回](message_recall.html) 后，该会话可能成为空会话。

调用 `refreshSessionList` 时，默认不返回空会话；如需返回空会话，可将 `includeEmpty` 设置为 `true`。登录后自动同步会话列表时，也可以通过 `syncConversationListConfig.includeEmpty` 配置是否同步空会话。

此外，也可以对空会话进行 [置顶](conversation_pin.html) 或 [添加标记](conversation_mark.html#会话标记)。

:::tip
`getConversationList` 从本地会话列表缓存中读取非空会话，不返回空会话。如需获取空会话，请使用 `refreshSessionList({ includeEmpty: true })` 的返回结果。
:::

## 当前会话与未读数

当用户进入某个会话页面时，建议调用 `setCurrentConversation` 设置当前正在浏览的会话。设置后，该会话收到在线消息时，SDK 会更新最近一条消息和会话排序，但不会累加该会话的本地未读数。该状态只保存在当前 SDK 实例的内存中，用户离开或切换会话页面时，应调用 `resetCurrentConversation` 重置当前会话状态。

如果需要清零会话未读数，可调用以下方法：

| 方法 | 说明 |
| :--- | :--- |
| `clearConversationUnreadMessageCount` | 清零指定单聊或群聊会话的未读数。调用成功后，SDK 会更新当前设备上的会话列表缓存；当前用户的其他已登录设备会收到 `onConversationUnreadMessageCountCleared` 事件。 |
| `clearAllConversationUnreadMessageCount` | 清零全部会话的未读数。调用成功后，SDK 会更新当前设备上的会话列表缓存；当前用户的其他已登录设备会收到 `onAllConversationsUnreadMessageCountCleared` 事件。 |

:::tip
会话未读数清零用于更新当前登录用户侧的会话未读状态，不会向会话对端发送消息已读回执。若需要让消息发送方感知某些消息已读，应使用 [消息已读回执](message_receipt.html)。
:::

## 会话功能列表

SDK 常用会话功能如下：

| 功能 | 主要方法 | 说明 |
| :--- | :--- | :--- |
| 会话列表 | `refreshSessionList`、`getConversationList` | 从服务端刷新会话列表，或从本地缓存读取非空会话列表。详见 [会话列表](conversation_list.html)。 |
| 当前会话 | `setCurrentConversation`、`resetCurrentConversation`、`getCurrentConversation` | 标识当前正在浏览的会话，用于控制在线消息到达时的本地未读数累加行为。 |
| 会话未读数 | `clearConversationUnreadMessageCount`、`clearAllConversationUnreadMessageCount` | 清零单个或全部会话的未读数。详见 [会话未读数清零](conversation_unread.html)。 |
| 会话删除 | `deleteConversation`、`clearAllMessagesAndConversations` | 删除指定会话，或清空当前用户的所有会话和服务端漫游消息。详见 [删除会话](conversation_delete.html)。 |
| 会话置顶 | `setConversationPinned` | 设置或取消设置会话置顶。详见 [置顶会话](conversation_pin.html)。 |
| 会话标记 | `addConversationMark`、`removeConversationMark` | 为单个或多个会话添加或移除标记。详见 [会话标记](conversation_mark.html)。 |
| 会话免打扰 | `PushManager` 中的会话免打扰相关方法 | 设置、查询或清除单聊和群聊会话的免打扰规则。聊天室会话不支持该功能。 |
| 会话内消息 | `getHistoryMessages`、`removeHistoryMessages` 等 | 获取或删除指定会话中的历史消息。详见 [获取历史消息](message_retrieve.html) 和 [删除消息](message_delete.html)。 |
| 会话内置顶消息 | `pinMessage`、`unpinMessage`、`getPinnedMessageList` | 置顶、取消置顶或获取指定会话中的置顶消息列表，最多返回 20 条。详见 [置顶消息](message_pin.html)。 |

## 会话事件

#### 会话列表事件

SDK 通过 `client.chatManager.addEventHandler` 和 `client.addEventHandler` 提供会话及会话列表相关事件。

| 会话事件名称 | 触发时机 | 说明 |
| :--- | :--- | :--- |
| `onConversationListUpdate` | 会话列表发生变化时触发，例如会话同步、收发消息、用户资料变化、置顶会话、标记会话、删除会话、清零未读数等。 | 事件中的 `items` 为 SDK 当前完整且已排序的会话列表快照；如需保留业务本地字段，可结合 `patch` 做增量合并。 |
| `onSyncDataStart` | SDK 开始自动同步数据时触发。 | 该事件为全局同步事件。当 `payload.dataType` 为 `conversation` 时，表示会话列表同步开始。 |
| `onSyncDataFinished` | SDK 自动同步数据完成时触发。 | 该事件为全局同步事件。当 `payload.dataType` 为 `conversation` 时，表示会话列表同步完成；可通过 `status` 和 `error` 获取同步结果。 |

#### 多设备会话事件

| 会话事件名称 | 触发时机 | 说明 |
| :--- | :--- | :--- |
| `onConversationUnreadMessageCountCleared` | 当前用户在其他设备上清零单个会话未读数后，本设备收到该事件。 | 用于多设备同步单个会话未读数清零状态，事件中包含 `conversationId`、`conversationType` 和 `timestamp`。 |
| `onAllConversationsUnreadMessageCountCleared` | 当前用户在其他设备上清零全部会话未读数后，本设备收到该事件。 | 用于多设备同步全部会话未读数清零状态。该事件无事件载荷。 |
| `onMultiDeviceConversation` | 当前用户在其他设备上执行会话相关操作时触发，例如删除会话、置顶或取消置顶会话、添加会话标记、会话免打扰变更等。 | 用于感知会话类多设备操作，事件中包含 `operation`、`conversationId`、`conversationType` 等信息。 |

## 最佳实践

- 展示会话列表时，建议优先监听 `onConversationListUpdate`，并使用事件中的 `items` 刷新 UI。
- 如需主动读取当前本地会话列表，可调用 `getConversationList`；该方法不发起网络请求，也不返回空会话。
- 如需从服务端刷新会话列表或获取空会话，可调用 `refreshSessionList`。
- 用户进入会话页面时，建议调用 `setCurrentConversation`；离开或切换会话页面时，调用 `resetCurrentConversation`。
- 会话未读数清零和消息已读回执是不同功能：前者更新当前用户侧的会话未读状态，后者用于通知消息原始发送方消息已读。
- 通过 RESTful 接口发送的消息默认不创建或写入会话列表。如需将 RESTful 接口发送的消息写入会话列表，需在环信控制台开通对应功能。

## 接口列表

| API | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`refreshSessionList`](#会话列表与空会话) | `ChatManager` | 从服务端刷新会话列表，并可通过配置决定是否返回空会话。 |
| [`getConversationList`](#会话列表与空会话) | `ChatManager` | 从 SDK 本地会话列表缓存读取当前已有的非空会话。 |
| [`setCurrentConversation`](#当前会话与未读数) | `ChatManager` | 设置当前正在浏览的会话，避免该会话后续在线消息继续累加本地未读数。 |
| [`resetCurrentConversation`](#当前会话与未读数) | `ChatManager` | 重置当前正在浏览的会话，恢复默认未读数累加规则。 |
| [`getCurrentConversation`](#当前会话与未读数) | `ChatManager` | 获取当前正在浏览的会话。 |
| [`clearConversationUnreadMessageCount`](#当前会话与未读数) | `ChatManager` | 清零指定单聊或群聊会话的未读数。 |
| [`clearAllConversationUnreadMessageCount`](#当前会话与未读数) | `ChatManager` | 清零全部会话的未读数。 |
| [`deleteConversation`](#会话功能列表) | `ChatManager` | 删除指定会话。 |
| [`clearAllMessagesAndConversations`](#会话功能列表) | `ChatManager` | 清空当前用户侧的全部会话和服务端漫游消息。 |
| [`setConversationPinned`](#会话功能列表) | `ChatManager` | 设置或取消指定会话的置顶状态。 |
| [`addConversationMark`](#会话功能列表) | `ChatManager` | 为会话添加标记。 |
| [`removeConversationMark`](#会话功能列表) | `ChatManager` | 移除会话标记。 |
| [`getHistoryMessages`](#会话功能列表) | `ChatManager` | 获取指定会话中的历史消息。 |
| [`removeHistoryMessages`](#会话功能列表) | `ChatManager` | 删除指定会话中的历史消息。 |
| [`pinMessage`](#会话功能列表) | `ChatManager` | 置顶会话内的指定消息。 |
| [`unpinMessage`](#会话功能列表) | `ChatManager` | 取消置顶会话内的指定消息。 |
| [`getPinnedMessageList`](#会话功能列表) | `ChatManager` | 获取指定会话中的置顶消息列表。 |
