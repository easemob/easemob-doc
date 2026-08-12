# 删除会话

## 功能说明

iOS SDK 中，删除好友、退出群组或退出聊天室时，本地会话及本地消息的处理方式如下：

| 删除项 | 默认情况 | 保留本地会话和消息的设置 |
| :--- | :--- | :--- |
| 删除好友 | 默认删除该好友对应的本地单聊会话及其中的本地消息。 | 调用 `deleteContact` 时，将 `isDeleteConversation` 设为 `NO`。 |
| 退出群组 | 保留本地群聊会话，默认删除其中的本地消息。 | 设置 `EMOptions#deleteMessagesOnLeaveGroup = NO`，即可保留本地消息；群聊会话默认保留。 |
| 退出聊天室 | 默认删除本地聊天室会话及其中的本地消息。 | 设置 `EMOptions#deleteMessagesOnLeaveChatroom = NO`，即可保留本地聊天室会话和消息。 |

你还可以通过 `IEMChatManager` 删除当前用户服务端和本地的指定会话、仅删除本地会话、批量删除本地会话或清空全部会话；通过 `EMConversation` 可删除指定的本地消息。

:::warning
删除操作可能无法恢复。调用前应明确删除范围。
:::

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见[使用限制](/product/limitation.html)。

## 单向删除服务端会话

调用 `deleteServerConversation`，可以删除当前用户服务端和本地的指定会话。会话和消息删除后，当前用户无法从服务器获取该会话和消息，不影响其他用户的会话和消息。


`isDeleteServerMessages` 参数控制是否同时删除当前用户在服务端保存的该会话历史消息：

- `true`：删除服务端和本地会话，以及服务端和本地历史消息。
- `false`：删除服务端和本地会话，但保留服务端及本地历史消息。

```swift
let conversationId = "conversationId"
let conversationType: EMConversationType = .chat

EMClient.shared().chatManager?.deleteServerConversation(
    conversationId,
    conversationType: conversationType,
    isDeleteServerMessages: true
) { deletedConversationId, error in
    if let error {
        print("删除服务端会话失败：\(error.errorDescription)")
    } else {
        print("已删除会话：\(deletedConversationId ?? "")")
    }
}
```

如果需要保留服务端及本地历史消息，将 `isDeleteServerMessages` 传 `false`：

```swift
EMClient.shared().chatManager?.deleteServerConversation(
    conversationId,
    conversationType: .groupChat,
    isDeleteServerMessages: false
) { _, error in
    if error == nil {
        // 服务端和本地会话已删除，历史消息保留。
    }
}
```

:::tip
删除会话后，若后续再次收发消息，SDK 会重新创建对应的本地会话。删除会话时，若 `isDeleteServerMessages` 设置为 `false`，服务端漫游消息不会随会话删除，后续可在消息有效期内按需拉取；若 `isDeleteServerMessages` 设置为 `true`，该会话的服务端漫游消息会同时删除，删除后无法再通过 SDK 拉取。
:::

## 删除本地会话

### 删除本地指定会话

调用 `deleteConversation` 删除指定的本地会话。

`isDeleteMessages` 参数控制是否同时删除该会话的本地历史消息：

- `true`：删除本地会话及其本地历史消息。
- `false`：删除本地会话，但保留本地历史消息。

```swift
// 删除本地会话，同时删除该会话的本地历史消息。
EMClient.shared().chatManager?.deleteConversation(
    conversationId,
    isDeleteMessages: true
) { deletedConversationId, error in
    if let error {
        print("删除本地会话失败：\(error.errorDescription)")
    } else {
        print("已删除本地会话：\(deletedConversationId ?? "")")
    }
}
```

如需保留本地历史消息，将 `isDeleteMessages` 传 `false`：

```swift
EMClient.shared().chatManager?.deleteConversation(
    conversationId,
    isDeleteMessages: false
) { _, error in
    if error == nil {
        // 本地会话已删除，本地历史消息保留。
    }
}
```

:::tip
删除会话后，若后续再次收发消息，SDK 会重新创建对应的本地会话。删除会话时，若 `isDeleteMessages` 设置为 `false`，服务端漫游消息不会随会话删除，后续可在消息有效期内按需拉取；若 `isDeleteMessages` 设置为 `true`，该会话的服务端漫游消息会同时删除，删除后无法再通过 SDK 拉取。
:::

### 批量删除本地会话

调用 `deleteConversations` 批量删除本地会话。参数必须是 `EMConversation` 对象数组，而不是会话 ID 数组。

```swift
let conversations: [EMConversation] = [conversation1, conversation2]

EMClient.shared().chatManager?.deleteConversations(
    conversations,
    isDeleteMessages: true
) { error in
    if let error {
        print("批量删除失败：\(error.errorDescription)")
    } else {
        print("批量删除成功")
    }
}
```

数组为 `nil` 或空数组时，completion 返回 `EMErrorInvalidConversation`。`isDeleteMessages` 只控制本地消息是否随会话删除，说明详见 [删除本地指定会话](#删除本地指定会话)。

### 删除全部会话及消息

调用 `deleteAllMessagesAndConversations` 清空全部会话及其中的消息：

- `clearServerData` 为 `false`：仅清空全部本地会话及本地消息，服务端数据保留。
- `clearServerData` 为 `true`：同时清空当前用户服务端的全部会话及消息；当前用户之后无法再从服务端获取这些数据，其他用户不受影响。

```swift
// 仅清空全部本地会话及本地消息。
EMClient.shared().chatManager?.deleteAllMessagesAndConversations(
    false
) { error in
    if let error {
        print("清空失败：\(error.errorDescription)")
    } else {
        print("已清空全部本地会话及消息")
    }
}
```

:::warning
将 `clearServerData` 设为 `true` 会删除当前用户服务端保存的全部会话及消息。执行前应再次向用户确认删除范围。
:::

### 删除会话中的指定本地消息

如果只需要删除某条本地消息，可先获取 `EMConversation`，再调用 `deleteMessage`。该接口只从 SDK 本地数据库删除消息。

```swift
guard let conversation = EMClient.shared().chatManager?.getConversation(
    conversationId,
    type: .chat,
    createIfNotExist: false
) else {
    return
}

var error: EMError?
conversation.deleteMessage(withId: "messageId", error: &error)

if let error {
    print("删除本地消息失败：\(error.errorDescription)")
}
```

### 删除好友时处理会话

删除好友时，可使用异步接口并通过 `isDeleteConversation` 控制是否同时删除与该好友的本地会话：

- `isDeleteConversation = true`：删除好友，并同步删除与该好友的本地会话。
- `isDeleteConversation = false`：只删除好友，保留本地会话。

```swift
EMClient.shared().contactManager?.deleteContact(
    "contactUserId",
    isDeleteConversation: true
) { username, error in
    if let error {
        print("删除好友失败：\(error.errorDescription)")
    } else {
        print("已删除好友：\(username ?? "")")
    }
}
```

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`deleteServerConversation`](#单向删除服务端会话) | `IEMChatManager` | 删除当前用户服务端和本地的指定会话，并按参数决定是否删除历史消息。 |
| [`deleteConversation`](#删除本地指定会话) | `IEMChatManager` | 删除指定的本地会话，并按参数决定是否删除本地历史消息。 |
| [`deleteConversations`](#批量删除本地会话) | `IEMChatManager` | 批量删除本地会话，并按参数决定是否删除本地历史消息。 |
| [`deleteAllMessagesAndConversations`](#删除全部会话及消息) | `IEMChatManager` | 清空全部会话及消息，并按参数决定是否同时清空当前用户服务端数据。 |
| [`getConversation`](#删除会话中的指定本地消息) | `IEMChatManager` | 获取指定本地会话，不需要自动创建时将 `createIfNotExist` 传 `false`。 |
| [`deleteMessageWithId`](#删除会话中的指定本地消息) | `EMConversation` | 从 SDK 本地数据库删除指定消息。 |
| [`deleteContact`](#删除好友时处理会话) | `IEMContactManager` | 删除好友，并按参数决定是否同时删除对应的本地会话。 |
