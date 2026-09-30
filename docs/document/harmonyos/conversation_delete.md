# 删除会话

## 功能说明

HarmonyOS SDK 中，删除好友、退出群组或退出聊天室时，本地会话及本地消息的处理方式如下：

| 操作 | 默认情况 | 保留本地会话或消息的设置 |
| :--- | :--- | :--- |
| 删除好友 | 删除该好友对应的本地单聊会话及其中的本地消息。 | 调用 `deleteContact` 时，将 `keepConversation` 设置为 `true`。 |
| 退出群组 | 保留本地群聊会话，默认删除本地群聊消息。 | 在初始化 SDK 前调用 `ChatOptions#setDeleteMessagesOnLeaveGroup(false)` 保留本地消息。 |
| 退出聊天室 | 默认删除该聊天室的本地消息。 | 在初始化 SDK 前调用 `ChatOptions#setDeleteMessagesOnLeaveChatroom(false)` 保留本地消息。 |

你还可以通过 `ChatManager` 删除当前用户服务端和本地的指定会话、仅删除本地会话、批量删除本地会话或清空全部会话；通过 `Conversation` 删除指定的本地消息。

:::warning
删除操作可能无法恢复。调用前应明确删除范围，尤其要区分仅删除本地数据和同时删除当前用户的服务端数据。
:::

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见[快速开始](quickstart.html)。
- 已了解环信即时通讯 IM API 的使用限制，详见[使用限制](/product/limitation.html)。

## 单向删除服务端会话

调用 `deleteConversationFromServer` 可以删除当前用户服务端和本地的指定会话。该操作仅影响当前用户的会话和消息，不影响其他用户的数据。

`isDeleteServerMessages` 参数控制是否同时删除当前用户在服务端和本地保存的该会话历史消息：

- `true`：删除服务端和本地会话，并删除服务端和本地历史消息。
- `false`：删除服务端和本地会话，但保留服务端和本地历史消息。

示例代码如下：

```typescript
let chatManager = ChatClient.getInstance().chatManager();
if (chatManager) {
    chatManager.deleteConversationFromServer(
        conversationId,
        // 单聊、群聊和聊天室分别传入 Chat、GroupChat 和 ChatRoom。
        conversationType,
        isDeleteServerMessages
    ).then(() => {
        // 当前用户服务端和本地的指定会话已删除。
    }).catch((error: ChatError) => {
        // 根据 error.errorCode 和 error.description 处理错误。
    });
}
```

如果需要保留服务端及本地历史消息，将 `isDeleteServerMessages` 传入 `false`：

```typescript
let chatManager = ChatClient.getInstance().chatManager();
if (chatManager) {
    chatManager.deleteConversationFromServer(
        conversationId,
        ConversationType.GroupChat,
        false
    ).then(() => {
        // 服务端和本地会话已删除，历史消息保留。
    }).catch((error: ChatError) => {
        // 删除失败，根据错误信息进行处理。
    });
}
```

:::tip
删除会话后，若后续再次收发消息，SDK 会重新创建对应的本地会话。若 `isDeleteServerMessages` 为 `false`，服务端漫游消息仍会保留，在消息有效期内可按需获取；若为 `true`，该会话的服务端漫游消息会同时删除，删除后无法再通过 SDK 获取。
:::

## 删除本地会话

调用 `deleteConversation` 可以删除单个指定的本地会话。

`isRemoveMessages` 参数控制是否同时删除该会话的本地历史消息：

- `true`：删除本地会话及其本地历史消息。
- `false`：删除本地会话，但保留本地历史消息。

```typescript
let chatManager = ChatClient.getInstance().chatManager();
if (chatManager) {
    // 删除本地会话，同时删除该会话的本地历史消息。
    let deleted: boolean = chatManager.deleteConversation(conversationId, true);
    if (!deleted) {
        // 未找到对应的本地会话。
    }
}
```

:::tip
`deleteConversation` 和 `deleteConversations` 只删除本地数据，不会删除服务端会话或服务端漫游消息。后续再次收发消息时，SDK 会重新创建对应的本地会话。
:::

### 批量删除本地会话

调用 `deleteConversations` 可以删除一个或多个本地会话。该方法既可以传入单个会话 ID，也可以传入会话 ID 数组；传入空数组时，Promise 会返回 `ChatError.INVALID_PARAM` 错误。

`deleteMessages` 参数控制是否同时删除各会话中的本地消息：

- `true`：删除本地会话及其中的本地消息。
- `false`：仅删除本地会话，保留本地消息。

```typescript
let conversationIds: Array<string> = [conversationId1, conversationId2];
let chatManager = ChatClient.getInstance().chatManager();

if (chatManager) {
    chatManager.deleteConversations(conversationIds, true)
        .then(() => {
            // 本地会话及其中的本地消息已批量删除。
        })
        .catch((error: ChatError) => {
            // 根据 error.errorCode 和 error.description 处理错误。
        });
}
```

### 删除全部会话及消息

调用 `deleteAllConversationsAndMessages` 可以清空全部会话及其中的消息：

- `clearServerData` 为 `false`：仅清空全部本地会话及本地消息，服务端数据保留。
- `clearServerData` 为 `true`：同时清空当前用户服务端保存的全部会话及消息。当前用户之后无法再从服务端获取这些数据，其他用户不受影响。

```typescript
let chatManager = ChatClient.getInstance().chatManager();
if (chatManager) {
    chatManager.deleteAllConversationsAndMessages(false)
        .then(() => {
            // 已清空全部本地会话及本地消息。
        })
        .catch((error: ChatError) => {
            // 根据 error.errorCode 和 error.description 处理错误。
        });
}
```

:::warning
将 `clearServerData` 设为 `true` 会删除当前用户服务端保存的全部会话及消息。执行前应再次向用户确认删除范围。
:::

### 删除会话中的指定本地消息

如需删除某条本地消息，可先调用 `getConversation` 获取对应的 `Conversation`，再调用 `removeMessage`。`removeMessage` 可以传入消息 ID 或 `ChatMessage` 对象，并返回删除结果。

```typescript
let conversation: Conversation | undefined = ChatClient.getInstance()
    .chatManager()
    ?.getConversation(
        conversationId,
        ConversationType.Chat,
        false
    );

if (conversation) {
    let deleted: boolean = conversation.removeMessage(messageId);
    if (!deleted) {
        // 未找到对应的本地消息或删除失败。
    }
}
```

### 删除好友时处理会话

调用 `ContactManager#deleteContact(userId, keepConversation)` 删除好友时，`keepConversation` 控制是否保留与该好友的本地单聊会话及消息：

- `true`：保留本地会话和消息。
- `false`：删除本地会话和消息。该参数的默认值为 `false`。

```typescript
let contactManager = ChatClient.getInstance().contactManager();
if (contactManager) {
    contactManager.deleteContact("contactUserId", false)
        .then(() => {
            // 好友及其对应的本地单聊会话和消息已删除。
        })
        .catch((error: ChatError) => {
            // 根据 error.errorCode 和 error.description 处理错误。
        });
}
```

关于删除好友的更多说明，详见[删除好友](user_relationship.html#删除好友)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`setDeleteMessagesOnLeaveGroup`](#功能说明) | `ChatOptions` | 设置主动或被动退出群组时是否删除本地群聊消息。 |
| [`setDeleteMessagesOnLeaveChatroom`](#功能说明) | `ChatOptions` | 设置主动或被动退出聊天室时是否删除本地聊天室消息。 |
| [`deleteConversationFromServer`](#单向删除服务端会话) | `ChatManager` | 删除当前用户服务端和本地的指定会话，并可设置是否同时删除历史消息。 |
| [`deleteConversation`](#删除本地会话) | `ChatManager` | 删除指定的本地会话，并可设置是否同时删除本地历史消息。 |
| [`deleteConversations`](#批量删除本地会话) | `ChatManager` | 删除一个或多个本地会话，并可设置是否同时删除本地消息。 |
| [`deleteAllConversationsAndMessages`](#删除全部会话及消息) | `ChatManager` | 清空全部本地会话和消息，并可选择是否同时清空当前用户的服务端数据。 |
| [`getConversation`](#删除会话中的指定本地消息) | `ChatManager` | 获取指定的本地会话。 |
| [`removeMessage`](#删除会话中的指定本地消息) | `Conversation` | 删除会话中的指定本地消息。 |
| [`deleteContact`](#删除好友时处理会话) | `ContactManager` | 删除好友，并通过 `keepConversation` 参数控制是否保留对应的本地会话和消息。 |
