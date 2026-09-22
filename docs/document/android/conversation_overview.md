# 会话介绍

## 功能说明

会话是单聊、群聊或聊天室中的消息集合。SDK 通过 `EMConversation` 表示本地会话，应用可以读取会话 ID、会话类型、最近一条消息、未读数、置顶状态、会话标记和本地扩展字段等数据。

SDK 可在 [登录成功后自动同步服务端会话数据并写入本地](initialization.html#设置登录后自动同步数据)。应用在同步完成后，通过本地接口读取和展示会话列表。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见[快速开始](quickstart.html)。
- 已了解环信即时通讯 IM API 的使用限制，详见[使用限制](/product/limitation.html)。
- 如需使用服务端会话列表、会话置顶或会话标记等增值功能，已在环信控制台开通相应功能。

## 会话模型

### 会话类型和会话 ID

SDK 通过会话类型和会话 ID 标识会话：

| 会话类型 | `EMConversationType` | 会话 ID |
| :--- | :--- | :--- |
| 单聊 | `Chat` | 对端用户 ID。 |
| 群聊 | `GroupChat` | 群组 ID。 |
| 聊天室 | `ChatRoom` | 聊天室 ID。 |

### 会话对象

会话列表中的每一项为 `EMConversation`，常用接口如下：

| API | 说明 |
| :--- | :--- |
| `conversationId()` | 获取会话 ID。 |
| `getType()` | 获取会话类型。 |
| `getUnreadMsgCount()` | 获取该会话的本地未读消息数。 |
| `getLastMessage()` | 获取会话中的最新一条消息。 |
| `isPinned()` | 获取会话是否置顶。 |
| `getPinnedTime()` | 获取会话置顶时间，单位为毫秒；未置顶时返回 `0`。 |
| `marks()` | 获取会话标记集合。 |
| `getExtField()` / `setExtField(String)` | 获取或设置会话的本地扩展字段。 |

:::tip
`EMConversation` 主要包含本地会话及消息相关数据，不等同于完整的用户属性、群组详情或聊天室详情。如需展示名称和头像等完整信息，应按会话类型调用用户属性、群组或聊天室相关接口。
:::

## 会话创建与更新

### 通过消息创建或更新会话

收发消息时，SDK 会根据消息所属的会话创建或更新本地会话：

- 单聊消息：根据对端用户 ID 创建或更新单聊会话。
- 群聊消息：根据群组 ID 创建或更新群聊会话。
- 聊天室消息：根据聊天室 ID 创建或更新聊天室会话。

收到在线消息后，SDK 会更新会话的最近一条消息、排序和未读数等本地状态。

### 通过接口创建本地会话

调用 `getConversation(String, EMConversationType, boolean)` 时，将 `createIfNotExists` 设为 `true`，SDK 会在本地不存在指定会话时创建会话对象；设为 `false` 时不会创建，未找到则返回 `null`。

```java
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation(
                conversationId,
                EMConversationType.Chat,
                true);
```

`getConversation(String)` 和 `getConversation(String, EMConversationType)` 仅查找已有会话，不会自动创建。

### 通过服务端同步更新会话列表

在调用 `EMClient#init` 前，通过 `EMOptions#setDataSyncType` 配置 `EMDataSyncType.CONVERSATIONS`。用户登录成功后，SDK 会自动同步服务端会话数据并写入本地。

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setDataSyncType(EnumSet.of(
        EMOptions.EMDataSyncType.CONVERSATIONS));

EMClient.getInstance().init(getApplicationContext(), options);
```

应用可通过 `EMConnectionListener#onDataSyncStart` 和 `onDataSyncFinish` 监听会话数据同步状态。当 `type` 为 `CONVERSATIONS` 且 `errorCode` 为 `EMError.EM_NO_ERROR` 时，可以从本地读取最新会话列表。

## 会话列表与空会话

SDK 提供以下本地会话列表读取方式：

| 方式 | API | 说明 |
| :--- | :--- | :--- |
| 排序列表 | `getAllConversationsBySort()` | 返回置顶会话优先的列表；置顶和非置顶会话内部均按最后一条消息的时间戳倒序排列。 |
| 会话映射 | `getAllConversations()` | 返回以会话 ID 为键的 `Map<String, EMConversation>`。 |
| 数据库筛选 | `asyncFilterConversationsFromDB(...)` | 从本地数据库加载全部会话或按自定义条件筛选会话。 |

空会话是没有消息的会话。例如，会话中的全部消息过期、被清除或被撤回后，该会话可能成为空会话。

应用从本地数据库加载会话时，是否包含空会话由 `EMOptions#setLoadEmptyConversations` 控制。该选项默认为 `false`；如需包含空会话，应在调用 `EMClient#init` 前设置为 `true`。

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setLoadEmptyConversations(true);

EMClient.getInstance().init(getApplicationContext(), options);
```

空会话也可以进行置顶、添加会话标记和删除等操作。

## 当前会话与未读数

应用进入会话页面并处理完消息后，可按业务需要清零会话未读数：

| API | 说明 |
| :--- | :--- |
| `asyncClearConversationUnreadMessageCount` | 清零指定会话的本地未读数，并同步当前账号的其他设备。 |
| `asyncClearAllConversationUnreadMessageCount` | 清零所有会话的本地未读数，并同步当前账号的其他设备。 |

```java
// 异步方法。
EMClient.getInstance()
        .chatManager()
        .asyncClearConversationUnreadMessageCount(
                conversationId,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 指定会话的未读消息数已清零。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

:::tip
会话未读数清零不会向会话对端发送消息已读回执。若需通知原消息发送方消息已读，应调用 `asyncSendMessageReadReceipts`，详见[消息已读回执](message_receipt.html)。
:::

## 会话功能列表

| 功能 | 主要 API | 说明 |
| :--- | :--- | :--- |
| 会话列表 | `getAllConversationsBySort`、`getAllConversations`、`asyncFilterConversationsFromDB` | 从本地内存或数据库读取会话列表，详见[会话列表](conversation_list.html)。 |
| 会话未读数 | `getUnreadMessageCount`、`getUnreadMsgCount`、`asyncClearConversationUnreadMessageCount`、`asyncClearAllConversationUnreadMessageCount` | 获取或清零会话未读数，详见[会话未读数](conversation_unread.html)。 |
| 会话删除 | `deleteConversation`、`asyncDeleteConversations`、`deleteConversationFromServer`、`asyncDeleteAllMsgsAndConversations` | 删除本地或服务端会话及消息，详见[删除会话](conversation_delete.html)。 |
| 会话置顶 | `asyncPinConversation` | 设置或取消会话置顶，详见[置顶会话](conversation_pin.html)。 |
| 会话标记 | `asyncAddConversationMark`、`asyncRemoveConversationMark` | 为一个或多个会话添加或移除标记，详见[会话标记](conversation_mark.html)。 |
| 会话免打扰 | `EMPushManager` 的会话免打扰接口 | 设置或查询单聊、群聊会话的免打扰规则。 |
| 会话内消息 | `loadMoreMsgFromDB`、`searchMsgFromDB`、`removeMessage`、`clearAllMessages` | 获取、搜索或删除本地会话消息。 |
| 会话内置顶消息 | `asyncPinMessage`、`asyncUnPinMessage`、`asyncGetPinnedMessagesFromServer` | 置顶、取消置顶或获取会话中的置顶消息。 |

## 会话事件

#### 会话列表事件

本地会话发生变化时，SDK 会触发 `EMConversationListener#onConversationUpdate`。该回调不返回完整会话列表，应用应重新读取本地会话列表并刷新界面。

```java
EMConversationListener conversationListener =
        new EMConversationListener() {
            @Override
            public void onConversationUpdate() {
                List<EMConversation> conversations = EMClient.getInstance()
                        .chatManager()
                        .getAllConversationsBySort();
                // 使用最新会话列表刷新界面。
            }
        };

EMClient.getInstance()
        .chatManager()
        .addConversationListener(conversationListener);

// 不再需要监听时移除监听器。
EMClient.getInstance()
        .chatManager()
        .removeConversationListener(conversationListener);
```

会话自动同步的开始和完成状态由 `EMConnectionListener#onDataSyncStart` 和 `onDataSyncFinish` 监听。

#### 多设备会话事件

通过 `EMClient#addMultiDeviceListener` 注册 `EMMultiDeviceListener`，可以在 `onConversationEvent` 中接收当前账号其他设备执行的会话操作。常见事件包括：

- `CONVERSATION_PINNED`：其他设备置顶会话。
- `CONVERSATION_UNPINNED`：其他设备取消会话置顶。
- `CONVERSATION_DELETED`：其他设备删除服务端会话。
- `CONVERSATION_MARK_UPDATE`：其他设备更新会话标记。
- `CONVERSATION_MUTE_INFO_CHANGED`：其他设备更新会话免打扰设置。
- `CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED`：其他设备清零指定会话的未读数。
- `ALL_CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED`：其他设备清零所有会话的未读数。

不再需要监听时，应调用 `EMClient#removeMultiDeviceListener` 移除监听器。

## 最佳实践

- 初始化 SDK 前配置 `EMDataSyncType.CONVERSATIONS`，并在会话数据同步成功后读取本地会话列表。
- 展示会话列表时优先使用 `getAllConversationsBySort`，直接使用 SDK 返回的置顶优先排序结果。
- 注册 `EMConversationListener`；收到 `onConversationUpdate` 后重新读取会话列表并刷新界面。
- 页面或组件销毁时移除 `EMConversationListener`、`EMConnectionListener` 和 `EMMultiDeviceListener`，避免重复回调和内存泄漏。
- 会话未读数清零与消息已读回执是两个独立功能：前者更新当前账号的会话未读状态，后者通知原消息发送方消息已读。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`conversationId`](#会话对象) / [`getType`](#会话对象) | `EMConversation` | 获取会话 ID 和会话类型。 |
| [`getUnreadMsgCount`](#会话对象) / [`getLastMessage`](#会话对象) | `EMConversation` | 获取会话未读数和最近一条消息。 |
| [`getConversation`](#通过接口创建本地会话) | `EMChatManager` | 查找本地会话，并可按参数在会话不存在时创建。 |
| [`setAppKey`](#通过服务端同步更新会话列表) | `EMOptions` | 设置应用的 App Key。 |
| [`setDataSyncType`](#通过服务端同步更新会话列表) | `EMOptions` | 设置登录成功后自动同步的数据类型。 |
| [`init`](#通过服务端同步更新会话列表) | `EMClient` | 使用指定配置初始化 SDK。 |
| [`getAllConversationsBySort`](#会话列表与空会话) | `EMChatManager` | 获取置顶优先排序的本地会话列表。 |
| [`getAllConversations`](#会话列表与空会话) | `EMChatManager` | 获取以会话 ID 为键的本地会话映射。 |
| [`asyncFilterConversationsFromDB`](#会话列表与空会话) | `EMChatManager` | 从本地数据库加载全部会话或筛选会话。 |
| [`setLoadEmptyConversations`](#会话列表与空会话) | `EMOptions` | 设置从本地数据库加载会话时是否包含空会话。 |
| [`asyncClearConversationUnreadMessageCount`](#当前会话与未读数) | `EMChatManager` | 清零指定会话的本地未读消息数。 |
| [`asyncClearAllConversationUnreadMessageCount`](#当前会话与未读数) | `EMChatManager` | 清零所有会话的本地未读消息数。 |
| [`asyncSendMessageReadReceipts`](#当前会话与未读数) | `EMChatManager` | 为单聊或群聊消息发送已读回执。 |
| [`getUnreadMessageCount`](#会话功能列表) | `EMChatManager` | 获取本地单聊和群聊会话的未读消息总数。 |
| [`deleteConversation`](#会话功能列表) / [`deleteConversationFromServer`](#会话功能列表) | `EMChatManager` | 删除本地会话，或删除当前用户服务端和本地的指定会话。 |
| [`asyncDeleteConversations`](#会话功能列表) | `EMChatManager` | 异步批量删除本地会话，并可设置是否删除本地消息。 |
| [`asyncDeleteAllMsgsAndConversations`](#会话功能列表) | `EMChatManager` | 删除所有消息和会话，并按参数决定是否清除服务端数据。 |
| [`asyncPinConversation`](#会话功能列表) | `EMChatManager` | 设置或取消会话置顶。 |
| [`asyncAddConversationMark`](#会话功能列表) / [`asyncRemoveConversationMark`](#会话功能列表) | `EMChatManager` | 为会话添加或移除标记。 |
| [`loadMoreMsgFromDB`](#会话功能列表) / [`searchMsgFromDB`](#会话功能列表) | `EMConversation` | 从本地数据库分页加载或搜索会话消息。 |
| [`removeMessage`](#会话功能列表) / [`clearAllMessages`](#会话功能列表) | `EMConversation` | 删除指定本地消息或清空会话的全部本地消息。 |
| [`asyncPinMessage`](#会话功能列表) / [`asyncUnPinMessage`](#会话功能列表) | `EMChatManager` | 置顶或取消置顶会话中的消息。 |
| [`asyncGetPinnedMessagesFromServer`](#会话功能列表) | `EMChatManager` | 从服务器获取会话中的置顶消息。 |
