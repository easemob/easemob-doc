# 删除会话

## 功能说明

Android SDK 中，删除好友、退出群组或退出聊天室时，本地会话及本地消息的处理方式如下：

| 删除项     | 默认情况                                                 | 保留本地会话和消息的设置                                     |
| ---------- | -------------------------------------------------------- | ------------------------------------------------------------ |
| 删除好友   | 删除该好友对应的本地单聊会话及其中的本地消息。           | 调用同步方法 `deleteContact`，并将 `keepConversation` 设置为 `true`。 |
| 退出群组   | 保留本地群聊会话并移除其内存缓存；默认删除本地群聊消息。 | 本地群聊会话默认保留。若需保留本地消息，在初始化前调用 `EMOptions#setDeleteMessagesAsExitGroup(false)`。 |
| 退出聊天室 | 默认删除本地聊天室会话及其中的本地消息。                 | 在初始化前调用 `EMOptions#setDeleteMessagesAsExitChatRoom(false)` |

你还可以通过 `EMChatManager` 删除当前用户服务端和本地的指定会话、仅删除本地会话、批量删除本地会话或清空全部会话；通过 `EMConversation` 可删除指定的本地消息。

:::warning
删除操作可能无法恢复。调用前应明确删除范围。
:::

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 单向删除服务端会话

你可以调用 `deleteConversationFromServer` 删除当前用户服务端和本地的指定会话。会话和消息删除后，当前用户无法从服务器获取该会话和消息，不影响其他用户的会话和消息。

`isDeleteServerMessages` 参数控制是否同时删除当前用户在服务端保存的该会话历史消息：

- `true`：删除服务端和本地会话，以及服务端和本地历史消息。
- `false`：删除服务端和本地会话，但保留服务端和本地历史消息。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance()
        .chatManager()
        .deleteConversationFromServer(
                conversationId,
                // 会话类型：单聊、群聊和聊天室分别为 Chat、GroupChat 和 ChatRoom。
                conversationType,
                isDeleteServerMessages,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 当前用户服务端和本地的指定会话已删除。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // 根据错误码和错误信息处理。
                    }
                });
```

如果需要保留服务端及本地历史消息，将 `isDeleteServerMessages` 传入 `false`：

```java
// 异步方法。
EMClient.getInstance()
        .chatManager()
        .deleteConversationFromServer(
                conversationId,
                EMConversation.EMConversationType.GroupChat,
                false,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 服务端和本地会话已删除，历史消息保留。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // 删除失败。
                    }
                });
```

:::tip
删除会话后，若后续再次收发消息，SDK 会重新创建对应的本地会话。删除会话时，若 `isDeleteServerMessages` 设置为 `false`，服务端漫游消息不会随会话删除，后续可在消息有效期内按需拉取；若 `isDeleteServerMessages` 设置为 `true`，该会话的服务端漫游消息会同时删除，删除后无法再通过 SDK 拉取。
:::

## 删除本地会话

调用 `deleteConversation` 删除单个指定的本地会话。

`deleteMessages` 参数控制是否同时删除该会话的本地历史消息：

- `true`：删除本地会话及其本地历史消息。
- `false`：删除本地会话，但保留本地历史消息。

```java
// 删除本地会话，同时删除该会话的本地历史消息。
boolean deleted = EMClient.getInstance()
        .chatManager()
        .deleteConversation(conversationId, true);

if (!deleted) {
    // 删除失败，可检查 conversationId 是否为空以及本地数据库是否已打开。
}
```

若需要删除本地多个会话，可调用 `asyncDeleteConversations` 方法：

```java
// 异步删除单个本地会话，同时删除该会话的本地历史消息。
List<String> conversationIds =
        Collections.singletonList(conversationId);

EMClient.getInstance()
        .chatManager()
        .asyncDeleteConversations(
                conversationIds,
                true,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 本地会话及其本地历史消息删除成功。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // 删除失败，根据错误码和错误信息进行处理。
                    }
                });
```

:::tip
删除会话后，若后续再次收发消息，SDK 会重新创建对应的本地会话。删除会话时，若 `deleteMessages` 设置为 `false`，服务端漫游消息不会随会话删除，后续可在消息有效期内按需拉取；若 `deleteMessages` 设置为 `true`，该会话的服务端漫游消息会同时删除，删除后无法再通过 SDK 拉取。
:::

### 批量删除本地会话

调用 `asyncDeleteConversations` 可批量删除本地会话。

`deleteMessages` 参数控制是否同时删除各会话中的本地消息：

- `true`：删除本地会话及其中的本地消息。
- `false`：仅删除本地会话，保留本地消息。

```java
// 异步方法。
EMClient.getInstance()
        .chatManager()
        .asyncDeleteConversations(
                conversationIds,
                true,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 批量删除成功。
                    }

                    @Override
                    public void onError(int code, String error) {
                        // 处理批量删除失败。
                    }
                });
```

### 删除全部会话及消息

调用 `asyncDeleteAllMsgsAndConversations` 可清空全部会话及其中的消息：

- `clearServerData` 为 `false`：仅清空全部本地会话及本地消息，服务端数据保留。
- `clearServerData` 为 `true`：同时清空当前用户服务端保存的全部会话及消息；当前用户之后无法再从服务端获取这些数据，其他用户不受影响。

```java
// 异步方法。
EMClient.getInstance()
        .chatManager()
        .asyncDeleteAllMsgsAndConversations(
                false,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 已清空全部本地会话及消息。
                    }

                    @Override
                    public void onError(int code, String error) {
                        // 处理清空失败。
                    }
                });
```

:::warning
将 `clearServerData` 设为 `true` 会删除当前用户服务端保存的全部会话及消息。执行前应再次向用户确认删除范围。
:::

### 删除会话中的指定本地消息

如需删除某条本地消息，可先获取对应的 `EMConversation`，再调用 `removeMessage`。该接口会从 SDK 的本地数据库和内存缓存中删除该消息。

```java
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation(
                conversationId,
                EMConversation.EMConversationType.Chat,
                false);

if (conversation != null) {
    conversation.removeMessage(messageId);
}
```

### 删除好友时处理会话

调用异步方法 `asyncDeleteContact` 删除好友时，SDK 同时删除与该好友对应的本地单聊会话及其中的本地消息。

如需在删除好友时保留本地会话及消息，Android SDK 提供的 `deleteContact` 为同步接口，其中 `keepConversation` 传 `true` 即可保留。

```java
// 异步方法。
EMClient.getInstance()
        .contactManager()
        .asyncDeleteContact(
                "contactUserId",
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 已删除好友，以及对应的本地单聊会话和消息。
                    }

                    @Override
                    public void onError(int code, String error) {
                        // 处理删除好友失败。
                    }
                });
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`deleteConversationFromServer`](#单向删除服务端会话) | `EMChatManager` | 删除当前用户服务端和本地的指定会话，并可设置是否同时删除服务端历史消息。 |
| [`deleteConversation`](#删除本地会话) | `EMChatManager` | 删除指定的本地会话，并可设置是否同时删除本地历史消息。 |
| [`asyncDeleteConversations`](#批量删除本地会话) | `EMChatManager` | 异步批量删除本地会话，并可设置是否同时删除本地消息。 |
| [`asyncDeleteAllMsgsAndConversations`](#删除全部会话及消息) | `EMChatManager` | 异步清空全部本地会话和消息，并可选择是否同时清空当前用户的服务端数据。 |
| [`getConversation`](#删除会话中的指定本地消息) | `EMChatManager` | 获取指定的本地会话。 |
| [`removeMessage`](#删除会话中的指定本地消息) | `EMConversation` | 删除会话中的指定本地消息。 |
| [`asyncDeleteContact`](#删除好友时处理会话) | `EMContactManager` | 异步删除好友，以及对应的本地单聊会话和消息。 |
| [`deleteContact`](#删除好友时处理会话) | `EMContactManager` | 删除好友，并通过 `keepConversation` 参数设置是否保留对应的本地会话和消息。 |
