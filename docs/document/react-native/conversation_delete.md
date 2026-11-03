# 删除会话

## 功能说明

React Native SDK 中，删除好友、退出群组或退出聊天室时，本地会话及本地消息的处理方式如下：

| 删除项 | 默认情况 | 保留本地会话和消息的设置 |
| :--- | :--- | :--- |
| 删除好友 | Android 删除该好友对应的本地单聊会话及其中的本地消息；iOS 的参数处理与公开语义不一致。 | 不能依赖 `keepConversation` 实现双端一致的保留行为，详见 [删除好友时处理会话](#删除好友时处理会话)。 |
| 退出群组 | 保留本地群聊会话；默认删除本地群聊消息。 | 本地群聊会话默认保留。若需保留本地消息，在初始化前设置 `ChatOptions.deleteMessagesAsExitGroup` 为 `false`。 |
| 退出聊天室 | 默认删除本地聊天室会话及其中的本地消息。 | 在初始化前设置 `ChatOptions.deleteMessagesAsExitChatRoom` 为 `false`。 |

你还可以通过 `ChatManager` 删除当前用户服务端和本地的指定会话、仅删除本地会话、批量删除本地会话或清空全部会话；通过 `ChatConversation` 可删除指定的本地消息。

:::warning
删除操作可能无法恢复。调用前应明确删除范围。
:::

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 本地数据接口需在当前账号的数据库打开后调用。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 单向删除服务端会话

你可以调用 `ChatManager#removeConversationFromServer` 删除当前用户服务端和本地的指定会话。会话和消息删除后，当前用户无法从服务器获取该会话和消息，不影响其他用户的会话和消息。

`isDeleteMessage` 参数控制是否同时删除当前用户在服务端保存的该会话历史消息：

- （默认）`true`：删除服务端和本地会话，以及服务端和本地历史消息。
- `false`：删除服务端和本地会话，但保留服务端和本地历史消息。

示例代码如下：

```typescript
async function deleteConversationFromServer(
  convId: string,
  convType: ChatConversationType,
  isDeleteMessage: boolean
): Promise<void> {
  try {
    // 会话类型：单聊、群聊和聊天室分别为 PeerChat、GroupChat 和 RoomChat
    await ChatClient.getInstance().chatManager
      .removeConversationFromServer(convId, convType, isDeleteMessage);
    // 当前用户服务端和本地的指定会话已删除
  } catch (error: unknown) {
    // 根据错误码和错误信息处理
    console.error('删除会话失败：', error);
  }
}
```

如果需要保留服务端及本地历史消息，将 `isDeleteMessage` 传入 `false`：

```typescript
async function deleteConversationKeepingHistory(groupId: string): Promise<void> {
  try {
    await ChatClient.getInstance().chatManager
      .removeConversationFromServer(groupId, ChatConversationType.GroupChat, false);
    // 服务端和本地会话已删除，历史消息保留
  } catch (error: unknown) {
    // 删除失败
    console.error('删除会话失败：', error);
  }
}
```

:::tip
删除会话后，若后续再次收发消息，SDK 会重新创建对应的本地会话。删除会话时，若 `isDeleteMessage` 设置为 `false`，服务端漫游消息不会随会话删除，后续可在消息有效期内按需拉取；若 `isDeleteMessage` 设置为 `true`，该会话的服务端漫游消息会同时删除，删除后无法再通过 SDK 拉取。
:::

## 删除本地会话

调用 `ChatManager#deleteConversation` 删除单个指定的本地会话。

`withMessage` 参数控制是否同时删除该会话的本地历史消息：

- （默认）`true`：删除本地会话及其本地历史消息。
- `false`：删除本地会话，但保留本地历史消息。

```typescript
async function deleteLocalConversation(convId: string): Promise<void> {
  try {
    // 删除本地会话，同时删除该会话的本地历史消息
    await ChatClient.getInstance().chatManager.deleteConversation(convId, true);
  } catch (error: unknown) {
    // 删除失败，可检查会话 ID 是否为空以及本地数据库是否已打开
    console.error('删除本地会话失败：', error);
  }
}
```

该方法返回 `Promise<void>`，失败时通过 Promise 报错，不返回表示删除结果的布尔值。

若需要删除本地多个会话，可调用 `ChatManager#deleteConversations` 方法：

```typescript
async function deleteLocalConversationBatch(convId: string): Promise<void> {
  const convIds = [convId];
  try {
    // 异步删除单个本地会话，同时删除该会话的本地历史消息
    await ChatClient.getInstance().chatManager.deleteConversations(convIds, true);
    // 本地会话及其本地历史消息删除成功
  } catch (error: unknown) {
    // 删除失败，根据错误码和错误信息进行处理
    console.error('删除本地会话失败：', error);
  }
}
```

:::tip
删除本地会话后，若后续再次收发消息，SDK 会重新创建对应的本地会话。`withMessage` 为 `false` 时保留本地消息；为 `true` 时删除该会话的本地消息。该接口不删除服务端会话或服务端漫游消息。
:::

### 批量删除本地会话

调用 `ChatManager#deleteConversations` 可批量删除本地会话。

`deleteMessages` 参数控制是否同时删除各会话中的本地消息：

- （默认）`true`：删除本地会话及其中的本地消息。
- `false`：仅删除本地会话，保留本地消息。

```typescript
async function deleteLocalConversations(convIds: string[]): Promise<void> {
  try {
    // 批量删除本地会话及其中的本地消息
    await ChatClient.getInstance().chatManager.deleteConversations(convIds, true);
    // 批量删除成功
  } catch (error: unknown) {
    // 处理批量删除失败
    console.error('批量删除失败：', error);
  }
}
```

### 删除全部会话及消息

调用 `ChatManager#deleteAllMessageAndConversation` 可清空全部会话及其中的消息：

- `clearServerData` 为 `false`（默认）：仅清空全部本地会话及本地消息，服务端数据保留。
- `clearServerData` 为 `true`：同时清空当前用户服务端保存的全部会话及消息；当前用户之后无法再从服务端获取这些数据，其他用户不受影响。

```typescript
async function clearAllLocalConversations(): Promise<void> {
  try {
    // 仅清空全部本地会话及消息，保留服务端数据
    await ChatClient.getInstance().chatManager
      .deleteAllMessageAndConversation(false);
    // 已清空全部本地会话及消息
  } catch (error: unknown) {
    // 处理清空失败
    console.error('清空会话失败：', error);
  }
}
```

:::warning
将 `clearServerData` 设为 `true` 会删除当前用户服务端保存的全部会话及消息。执行前应再次向用户确认删除范围。
:::

### 删除会话中的指定本地消息

如需删除某条本地消息，可先获取对应的 `ChatConversation`，再调用 `ChatConversation#deleteMessage`。该接口会从 SDK 的本地数据库和内存缓存中删除该消息。

```typescript
async function deleteLocalMessage(convId: string, msgId: string): Promise<void> {
  try {
    const conversation = await ChatClient.getInstance().chatManager
      .getConversation(convId, ChatConversationType.PeerChat, false);
    if (conversation) {
      // 删除会话中的指定本地消息
      await conversation.deleteMessage(msgId);
    }
  } catch (error: unknown) {
    console.error('删除本地消息失败：', error);
  }
}
```

### 删除好友时处理会话

调用 `ChatContactManager#deleteContact` 删除好友时，可选参数 `keepConversation` 的公开语义为是否保留会话，默认为 `false`。

:::notice
React Native SDK 5.x 的 Android 端不使用 `keepConversation` 参数，删除好友时会同时删除对应的本地单聊会话及消息。iOS 端将该参数用于控制是否删除会话，与公开的保留语义相反。因此，不能通过该参数实现双端一致的会话保留行为；如需保留历史数据，应在使用前确认目标版本的实际支持情况。
:::

以下示例展示删除好友。由于两端对 `keepConversation` 的处理不同，该调用不能保证在两端均保留本地会话及消息。

```typescript
async function deleteFriend(userId: string): Promise<void> {
  try {
    // 删除指定好友
    await ChatClient.getInstance().contactManager.deleteContact(userId);
    // 好友删除成功；本地会话和消息的处理见上述平台说明
  } catch (error: unknown) {
    // 处理删除好友失败
    console.error('删除好友失败：', error);
  }
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`removeConversationFromServer`](#单向删除服务端会话) | `ChatManager` | 删除当前用户服务端和本地的指定会话，并可设置是否同时删除服务端历史消息。 |
| [`deleteConversation`](#删除本地会话) | `ChatManager` | 删除指定的本地会话，并可设置是否同时删除本地历史消息。 |
| [`deleteConversations`](#批量删除本地会话) | `ChatManager` | 异步批量删除本地会话，并可设置是否同时删除本地消息。 |
| [`deleteAllMessageAndConversation`](#删除全部会话及消息) | `ChatManager` | 异步清空全部本地会话和消息，并可选择是否同时清空当前用户的服务端数据。 |
| [`getConversation`](#删除会话中的指定本地消息) | `ChatManager` | 获取指定的本地会话。 |
| [`deleteMessage`](#删除会话中的指定本地消息) | `ChatConversation` | 删除会话中的指定本地消息。 |
| [`deleteContact`](#删除好友时处理会话) | `ChatContactManager` | 异步删除好友；保留会话参数存在上述平台差异。 |
