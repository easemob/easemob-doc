# 删除消息

## 功能说明

SDK 支持单向删除服务端的消息：

- 单向清空服务端聊天记录：清空当前用户的会话及消息，包括单聊、群聊和聊天室，并清除当前设备的本地会话及消息缓存。
- 单向删除服务端历史消息：按消息 ID 或时间戳删除当前用户在服务端保存的历史消息。同一会话中的其他用户不受影响。

单向清空或删除后，当前用户无法再从服务端获取相应数据。SDK 还支持删除本地指定会话的全部消息、指定时间段的消息或单条消息。本地删除不影响服务端和其他用户的数据。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，且当前用户的本地数据库已打开，详见 [快速开始](quickstart.html)。
- 删除服务端数据时，当前用户已登录并连接到服务器。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

:::warning
删除前应确认目标账号、会话和消息范围。删除服务端数据后，当前用户不能再通过消息漫游恢复这些数据；不要通过反复重试扩大删除范围。
:::

## 单向清空聊天记录

调用 `ChatManager#deleteAllMessageAndConversation(clearServerData)` 清空当前用户的全部本地会话及消息，包括单聊、群聊和聊天室会话。通过 `clearServerData` 参数可以决定是否同时单向清空当前用户在服务端的会话及消息：

- `true`：同时单向清空当前用户服务端的全部会话及消息。清空后，当前用户无法再从服务端获取这些数据，其他用户不受影响。
- （默认）`false`：仅清空当前设备的本地会话及消息，保留服务端数据。

该方法返回 `Promise<void>`。成功后应重新读取本地会话列表并刷新界面；也可通过 `ChatMessageEventListener#onConversationsUpdate` 监听会话列表变化。

```typescript
// 仅在用户确认后调用；传 true 会同时清除当前用户服务端数据
ChatClient.getInstance().chatManager
  .deleteAllMessageAndConversation(true)
  .then(() => console.log('聊天记录已清空，请刷新会话列表'))
  .catch((error: unknown) => console.error('清空聊天记录失败：', error));
```

## 单向删除服务端的历史消息

通过以下两个 `ChatManager` 方法按消息 ID 或时间戳删除当前用户在服务端保存的历史消息。该操作仅对当前用户生效：删除后，当前用户无法再从服务端漫游获取这些消息；同一单聊、群聊或聊天室中的其他用户不受影响，仍可按照漫游策略获取这些消息。

- 按消息 ID 删除：`removeMessagesFromServerWithMsgIds`：`msgIds` 参数为非空 `string[]`，每次最多 50 条消息 ID。
- 按时间删除：`removeMessagesFromServerWithTimestamp`：删除服务器接收时间早于指定时间戳的历史消息，`timestamp` 参数为大于 0 的 Unix 时间戳，单位为毫秒。

`convId` 为会话 ID，`convType` 为 `ChatConversationType`。两种方式都返回 `Promise<void>`，也都可通过第四个参数 `isChatThread` 指定是否操作消息话题，默认为 `false`。

多设备登录时，当前账号的其他在线设备通过 `ChatMultiDeviceEventListener#onMessageRemoved(convId?, deviceId?)` 接收删除通知。

:::tip
1. 删除成功后应刷新业务消息列表，不要继续使用删除前的消息数组。底层 SDK 负责其支持范围内的本地缓存处理，业务侧不应假定所有已加载消息对象会自动失效。
2. 聊天室消息漫游默认关闭，如需使用，需联系环信商务开通。
:::

以下为两种独立的删除方式，按业务需求选择，不要为同一操作重复调用：

```typescript
const manager = ChatClient.getInstance().chatManager;
const convId = '<target_user_id>';
const convType = ChatConversationType.PeerChat;

async function deleteServerMessagesByIds(msgIds: string[]): Promise<void> {
  if (msgIds.length === 0 || msgIds.length > 50) {
    console.warn('每次应传入 1 至 50 个消息 ID');
    return;
  }
  try {
    await manager.removeMessagesFromServerWithMsgIds(convId, convType, msgIds);
    console.log('删除成功，请刷新消息列表');
  } catch (error: unknown) {
    console.error('按消息 ID 删除服务端消息失败：', error);
  }
}

async function deleteServerMessagesBefore(timestamp: number): Promise<void> {
  if (timestamp <= 0) {
    console.warn('时间戳必须大于 0');
    return;
  }
  try {
    await manager.removeMessagesFromServerWithTimestamp(
      convId, convType, timestamp
    );
    console.log('删除成功，请刷新消息列表');
  } catch (error: unknown) {
    console.error('按时间删除服务端消息失败：', error);
  }
}
```

## 删除本地指定会话的所有消息

调用 `ChatManager#deleteConversationAllMessages`，或异步获取会话后调用 `ChatConversation#deleteAllMessages`，删除指定会话在本地数据库和内存缓存中的全部消息。不删除服务端消息。

```typescript
ChatClient.getInstance().chatManager.deleteConversationAllMessages(
  '<target_user_id>',
  ChatConversationType.PeerChat
).then(() => {
  console.log('本地会话消息已清空');
}).catch((error: unknown) => {
  console.error('清空本地会话消息失败：', error);
});
```

## 删除本地会话指定时间段的消息

调用 `ChatManager#deleteMessagesWithTimestamp(convId, convType, { startTs, endTs })` 删除指定时间段的本地消息。

会话对象的对应方法为 `deleteMessagesWithTimestamp({ startTs, endTs })`。

```typescript
// `startTs` 和 `endTs` 的单位均为毫秒，开始时间应不晚于结束时间。
const endTs = Date.now();
const startTs = endTs - 24 * 60 * 60 * 1000;
ChatClient.getInstance().chatManager.deleteMessagesWithTimestamp(
  '<target_user_id>',
  ChatConversationType.PeerChat,
  { startTs, endTs }
).then(() => {
  console.log('指定时间段的本地消息已删除');
}).catch((error: unknown) => {
  console.error('删除指定时间段消息失败：', error);
});
```

## 删除本地会话的指定消息

调用 `ChatManager#deleteMessage(convId, convType, msgId)`，或会话对象的 `deleteMessage(msgId)`，从本地数据库和该会话的内存缓存中删除指定消息，不会删除服务端消息。

```typescript
ChatClient.getInstance().chatManager.deleteMessage(
  '<target_user_id>',
  ChatConversationType.PeerChat,
  '<message_id>'
).then(() => {
  console.log('指定本地消息已删除');
}).catch((error: unknown) => {
  console.error('删除本地消息失败：', error);
});
```

上述本地删除接口均返回 `Promise<void>`。删除失败时应检查会话 ID、会话类型、消息 ID 和本地数据库状态；调用成功后仍需刷新应用维护的消息列表。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`deleteAllMessageAndConversation`](#单向清空聊天记录) | `ChatManager` | 清空本地会话及消息，可同时单向清空服务端数据。 |
| [`removeMessagesFromServerWithMsgIds`](#单向删除服务端的历史消息) | `ChatManager` / `ChatConversation` | 按消息 ID 单向删除服务端历史消息。 |
| [`removeMessagesFromServerWithTimestamp`](#单向删除服务端的历史消息) | `ChatManager` / `ChatConversation` | 按时间戳单向删除服务端历史消息。 |
| [`deleteConversationAllMessages`](#删除本地指定会话的所有消息) | `ChatManager` | 删除指定会话的所有本地消息。 |
| [`deleteAllMessages`](#删除本地指定会话的所有消息) | `ChatConversation` | 删除当前会话的所有本地消息。 |
| [`deleteMessagesWithTimestamp`](#删除本地会话指定时间段的消息) | `ChatManager` / `ChatConversation` | 删除指定时间段内的本地消息。 |
| [`deleteMessage`](#删除本地会话的指定消息) | `ChatManager` / `ChatConversation` | 删除指定本地消息。 |
