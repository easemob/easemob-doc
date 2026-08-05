# 删除消息

## 功能说明

SDK 支持单向删除服务端的消息：

- 单向清空服务端的聊天记录：单向清空服务端的当前用户的聊天记录，包括单聊、群组聊天和聊天室的消息和会话。清空成功后，SDK 会同步清除本地已缓存的会话和消息数据，并更新本地会话列表缓存
- 单向删除服务端的历史消息：按消息 ID 或时间戳单向删除当前用户在服务端保存的历史消息。不会自动删除当前设备上的本地消息缓存。若业务侧已在本地保存或展示这些消息，需要在接口调用成功后自行更新本地消息列表。

若你单向清空了服务端的聊天记录或删除了历史消息，你无法从服务端拉取到会话和消息，而其他用户不受该操作影响。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 初始化 SDK 时已注册 `ChatManager`，能够通过 `client.chatManager` 调用消息与会话删除相关接口。

## 单向清空聊天记录

你可以调用 `clearAllMessagesAndConversations` 方法单向清空服务端的当前用户的聊天记录，包括单聊、群组聊天和聊天室的消息和会话。若你清空了聊天记录，你无法从服务端拉取到会话和消息，而其他用户不受该操作影响。

清空成功后，SDK 会同步清除本地已缓存的会话和消息数据，并更新本地会话列表缓存；如果本地会话列表发生变化，会触发 `onConversationListUpdate` 事件，`reason` 为 `local`。

```typescript
await client.chatManager.clearAllMessagesAndConversations();
```

## 单向删除服务端的历史消息

你可以调用 `removeHistoryMessages`，按消息 ID或时间戳单向删除当前用户在服务端保存的历史消息。该操作仅对当前用户生效：删除后，当前用户无法再从服务端漫游获取这些消息；同一单聊、群聊或聊天室中的其他用户不受影响，仍可按照漫游策略获取这些消息。

支持以下删除方式：

- 按消息 ID 删除：通过 `messageIds` 指定要删除的消息，每次最多可删除 50 条。
- 按时间删除：通过 `beforeTimestamp` 指定时间戳，删除服务器接收时间早于该时间戳的历史消息，时间戳单位为毫秒。

调用时，`messageIds` 和 `beforeTimestamp` 至少需要传入一个：

- 仅传入 `messageIds`：按消息 ID 删除。
- 仅传入 `beforeTimestamp`：按时间戳删除。
- 同时传入两者：SDK 优先按 `messageIds` 删除。

多端多设备登录时，删除成功后，当前用户的其他在线设备会收到 `onMultiDeviceMessageRemoved` 回调。

:::tip 
1. `removeHistoryMessages` 仅删除当前用户在服务端保存的历史消息，不会自动删除当前设备上的本地消息缓存。若业务侧已在本地保存或展示这些消息，需要在调用成功后自行更新本地消息列表。
2. 聊天室漫游消息默认关闭，若要使用该功能需联系环信商务开通。
:::

- 按消息 ID 删除

```typescript
await client.chatManager.removeHistoryMessages({
  conversationId: 'user2',
  conversationType: 'singleChat',
  messageIds: ['msg-1', 'msg-2', 'msg-3'], // 最多 50 条
});
```

- 按时间删除

删除指定时间戳之前的所有消息：

```typescript
await client.chatManager.removeHistoryMessages({
  conversationId: 'user2',
  conversationType: 'singleChat',
  beforeTimestamp: Date.now(), 
});
```

## 接口列表

| API | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`clearAllMessagesAndConversations`](#单向清空聊天记录) | `ChatManager` | 清空当前用户侧的全部会话和服务端漫游消息。 |
| [`removeHistoryMessages`](#单向删除服务端的历史消息) | `ChatManager` | 按消息 ID 或时间范围单向删除指定会话的服务端历史消息。 |
