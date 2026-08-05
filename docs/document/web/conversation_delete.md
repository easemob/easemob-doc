# 删除会话

## 功能说明

删除好友、退出群组或退出聊天室后，SDK 不会自动删除对应的单聊、群聊或聊天室会话或消息。你可以调用会话删除相关接口，单向删除当前用户侧的指定会话，或清空当前用户侧的全部会话及服务端漫游消息。

会话删除操作仅影响当前登录用户，不会删除会话对端或群组中其他成员的会话和消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- SDK 初始化时需注册 `ChatManager`，能够通过 `client.chatManager` 调用消息和会话相关接口。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 删除单个会话

删除指定会话前，你需要先获取会话 ID 和会话类型。若需要从当前会话列表中选择待删除会话，可调用 [getConversationList](conversation_list.html#获取本地会话列表) 从 SDK 本地会话列表缓存中读取会话列表；若需要先从服务端刷新会话列表，可调用 `refreshSessionList`，详见 [从服务端获取会话列表](conversation_list.html#从服务端获取会话列表)。

获取会话 ID 和会话类型后，调用 `deleteConversation` 删除当前用户侧的指定会话，并通过 `deleteRoamingMessages` 控制是否同时删除该会话的服务端漫游消息。该操作仅影响当前登录用户，不会删除会话对端或群组中其他成员的会话和消息。

```typescript
const conversations = client.chatManager.getConversationList();

const targetConversation = conversations.find(
  conversation =>
    conversation.conversationId === 'user2' &&
    conversation.conversationType === 'singleChat'
);

if (targetConversation) {
  const result = await client.chatManager.deleteConversation({
    conversationId: targetConversation.conversationId,
    conversationType: targetConversation.conversationType,
    deleteRoamingMessages: true,
  });

  console.log(result.conversationId, result.conversationType, result.operation);
}
```

:::tip
删除会话后，若后续再次收发消息，SDK 会重新创建对应的本地会话。删除会话时，若设置 `deleteRoamingMessages: false`，服务端漫游消息不会随会话删除，后续可在消息有效期内按需拉取；若设置 `deleteRoamingMessages: true`，该会话的服务端漫游消息会同时删除，删除后无法再通过 SDK 拉取。
:::

## 删除多个指定会话

如需删除多个指定会话，可由应用侧遍历调用 `deleteConversation`。关于 `deleteRoamingMessage` 的设置，详见 [删除单个会话](#删除单个会话)。

```typescript
const conversations = [
  { conversationId: 'user1', conversationType: 'singleChat' },
  { conversationId: 'group1', conversationType: 'groupChat' },
] as const;

await Promise.all(
  conversations.map(conversation =>
    client.chatManager.deleteConversation({
      ...conversation,
      deleteRoamingMessages: false,
    })
  )
);
```

## 清空全部会话和消息

你可以调用 `clearAllMessagesAndConversations` 清空当前用户侧的全部会话和服务端漫游消息。清空成功后，当前用户无法再从服务端拉取这些会话和消息，其他用户不受影响。

```typescript
await client.chatManager.clearAllMessagesAndConversations();
```

调用成功后，SDK 会同步清空本地会话缓存和会话列表缓存。如果本地会话列表快照发生变化，SDK 会触发 `onConversationListUpdate` 事件，事件中的 `reason` 为 `local`。

## 监听会话列表更新

删除会话或清空全部会话后，如果本地会话列表发生变化，SDK 会触发 `onConversationListUpdate` 事件。你可以监听该事件刷新会话列表 UI。

```typescript
client.chatManager.addEventHandler('conversation-delete-listener', {
  onConversationListUpdate: payload => {
    console.log('会话列表更新原因:', payload.reason);
    console.log('当前完整会话列表:', payload.items);
    console.log('本次变化补丁:', payload.patch);
  },
});
```

事件回调中的 `items` 为 SDK 当前完整且已排序的会话列表快照；简单 UI 可直接使用该字段刷新会话列表。如果业务层需要保留自定义本地字段，可结合 `patch.removed`、`patch.upserted`、`patch.reset` 和 `patch.orderChanged` 做增量合并。

## 注意事项

- 删除会话或清空全部会话均为单向操作，仅影响当前登录用户侧的会话和消息，不影响其他用户。
- 删除好友或退出群组后，SDK 不会自动删除对应会话。如需删除会话，需要主动调用 `deleteConversation`。
- 调用 `deleteConversation` 时，若 `deleteRoamingMessages` 为 `false`，仅删除当前用户侧的会话记录，不会同时删除该会话的服务端漫游消息。
- 若删除会话后该会话再次产生新消息，或业务再次从服务端刷新到该会话，该会话可能重新出现在会话列表中。
- `clearAllMessagesAndConversations` 会清空当前用户侧的全部会话和服务端漫游消息，请谨慎调用。
- 若参数不合法，例如 `conversationId`、`conversationType` 或 `deleteRoamingMessages` 类型不正确，SDK 会返回参数错误，错误码为 `110`。

## 接口列表

| API | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`deleteConversation`](#删除单个会话) | `ChatManager` | 删除当前用户侧的指定会话，并可选择是否同时删除该会话的服务端漫游消息。 |
| [`clearAllMessagesAndConversations`](#清空全部会话和消息) | `ChatManager` | 清空当前用户侧的全部会话和服务端漫游消息。 |
