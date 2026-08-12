# 实现会话未读数清零

## 功能说明

会话未读数清零用于将当前登录用户侧的指定会话或全部会话未读消息数置为 `0`。典型场景是用户进入某个会话页面后，业务侧调用清零接口，SDK 将该会话在当前用户侧标记为已读，并同步更新本地会话列表缓存中的会话未读数（`unreadCount`）和 清零时间（`readAt`）。

**目前，单聊和群聊支持会话未读数清零，聊天室不支持该功能。**

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化，并登录成功。
- 初始化 SDK 时已注册 `ChatManager`，能够通过 `client.chatManager` 调用会话与消息相关接口。
- 当前客户端已连接到服务器。清零动作需要通过连接通道发送到服务器。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 会话未读数清零流程

会话未读数清零的核心流程如下：

![](/images/web/conversation_unread_count_clear.png)

会话未读数清零的基本步骤如下：

1. 用户进入会话页面时，可先调用 `setCurrentConversation` 设置当前正在浏览的会话，避免该会话后续收到在线消息时继续累加本地未读数。
2. 如果该会话已有未读数，调用 `clearConversationUnreadMessageCount` 清零指定会话未读数。
3. 调用成功后，SDK 会更新当前设备的本地缓存：将目标会话的 `unreadCount` 置为 `0`，并更新会话列表项的清零时间 `readAt`。
4. 如果本地会话列表快照发生变化，SDK 会触发 `onConversationListUpdate`，你可据此刷新会话列表 UI。
5. 多设备登录时，该清零动作不会通知会话对端，只会同步给当前用户的其他在线设备；其他设备收到 `onConversationUnreadMessageCountCleared`。
6. 调用 `clearAllConversationUnreadMessageCount` 时，SDK 会清零当前设备本地缓存中的全部会话未读数，并通知当前用户的其他在线设备触发 `onAllConversationsUnreadMessageCountCleared`。

:::tip
- 清零会话未读数不会向会话对端发送通知，也不会触发对端的消息已读回执事件。若需要让消息发送方感知某些消息已读，应使用 [消息已读回执](message_receipt.html)。
- 会话列表快照是 SDK 在本地内存中维护的会话列表数据视图，用于记录当前已同步到本地的会话及其未读数、最后一条消息等展示信息。
:::

## 设置当前正在浏览的会话

用户进入会话页面时，可以调用 `setCurrentConversation` 设置当前正在浏览的会话。设置后，该会话收到在线消息时，SDK 仍会更新最后一条消息和会话列表排序，但不会累加该会话的本地未读数。

```typescript
client.chatManager.setCurrentConversation({
  conversationId: 'user_2',
  conversationType: 'singleChat',
});
```

该状态只保存在当前 SDK 实例的内存中。用户切换会话、离开会话页面或关闭会话页时，应调用 `resetCurrentConversation` 恢复默认未读数累加规则。

```typescript
client.chatManager.resetCurrentConversation();
```

如需确认当前设置的会话，可调用 `getCurrentConversation`：

```typescript
const currentConversation = client.chatManager.getCurrentConversation();
console.log(currentConversation);
```

## 清零单个会话未读数

用户进入会话页面后，如果该会话已有未读消息数，可调用 `clearConversationUnreadMessageCount` 清零该会话的未读数。

```typescript
await client.chatManager.clearConversationUnreadMessageCount({
  // 会话 ID。单聊时为对端用户 ID，群聊时为群组 ID。
  conversationId: 'user2',
  // 会话类型。仅支持 singleChat 和 groupChat。
  conversationType: 'singleChat',
});
```

参数说明如下：

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `conversationId` | String | 是 | 会话 ID。单聊为对端用户 ID，群聊为群组 ID。 |
| `conversationType` | String | 是 | 会话类型。仅支持 `singleChat` 和 `groupChat`。 |

调用成功后：

- SDK 会向服务器发送会话未读数清零动作，且该动作不会发送给会话对端。
- 当前设备本地缓存中目标会话的 `unreadCount` 会被置为 `0`。
- 当前设备本地会话列表项中的 `readAt` 会更新为清零时间。
- 如果本地会话列表发生变化，当前设备会触发 `onConversationListUpdate`，事件中的 `reason` 通常为 `local`。
- 当前用户的其他在线设备会收到 `onConversationUnreadMessageCountCleared`。

## 清零全部会话未读数

如需一次性清零当前用户全部会话的未读消息数，可调用 `clearAllConversationUnreadMessageCount`。

```typescript
await client.chatManager.clearAllConversationUnreadMessageCount();
```

调用成功后：

- SDK 会向服务器发送全部会话未读数清零动作，且该动作不会发送给会话对端。
- 当前设备本地缓存中的全部会话 `unreadCount` 会被置为 `0`。
- 当前设备本地会话列表项中的 `readAt` 会更新为清零时间。
- 如果本地会话列表发生变化，当前设备会触发 `onConversationListUpdate`。
- 当前用户的其他在线设备会收到 `onAllConversationsUnreadMessageCountCleared`。

## 监听当前设备会话列表更新

调用单个或全部会话未读数清零接口成功后，如果 SDK 本地会话列表快照发生变化，会触发 `onConversationListUpdate`。建议业务侧监听该事件，并使用事件中的 `items` 刷新会话列表 UI。

```typescript
client.chatManager.addEventHandler('conversation-unread-listener', {
  onConversationListUpdate: event => {
    console.log('会话列表更新原因:', event.reason);
    console.log('当前完整会话列表:', event.items);
    console.log('本次变化补丁:', event.patch);
  },
});
```

`onConversationListUpdate` 事件中的主要字段如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `version` | Number | 会话列表快照版本号。 |
| `items` | Array | 当前完整且已排序的会话列表快照。 |
| `reason` | String | 会话列表更新原因。清零未读数引起的本地变化通常为 `local`。 |
| `patch` | JSON | 本次变化补丁。需要保留业务侧自定义本地字段时，可结合该字段做增量合并。 |

如果只需要主动读取当前本地会话列表，也可以调用 `getConversationList`：

```typescript
const conversations = client.chatManager.getConversationList();
```

## 监听多设备上的未读数变化

如需同步多设备上的会话未读数，需开通多端多设备服务，详见 [在多个设备上登录](multi_device.html)。

假设当前用户同时登录设备 A 和设备 B：

- 用户在设备 A 上清零指定会话的未读数后，设备 B 会收到 `onMultiDeviceConversation` 事件，事件中的 `operation` 为 `CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED`。
- 用户在设备 A 上清零全部会话的未读数后，设备 B 会收到 `onMultiDeviceConversation` 事件，事件中的 `operation` 为 `ALL_CONVERSATIONS_UNREAD_MESSAGE_COUNT_CLEARED`。

你需要通过 `client.addEventHandler` 注册多设备事件监听。收到事件后，建议重新读取 SDK 本地会话列表，并据此刷新会话列表、未读数或应用角标。

```typescript
// 监听多设备会话未读数清零事件。
client.addEventHandler('multi-device-conversation-unread-listener', {
  onMultiDeviceConversation: event => {
    const conversations = client.chatManager.getConversationList();

    if (event.operation === 'CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED') {
      // 指定会话的未读数已在其他设备上清零。
      const conversation = conversations.find(
        item =>
          item.conversationId === event.conversationId &&
          item.conversationType === event.conversationType
      );

      const unreadCount = conversation?.unreadCount ?? 0;

      // 根据最新 unreadCount 刷新该会话的未读数。
      refreshConversationUnreadCount(event.conversationId, unreadCount);
      return;
    }

    if (event.operation === 'ALL_CONVERSATIONS_UNREAD_MESSAGE_COUNT_CLEARED') {
      // 全部会话的未读数已在其他设备上清零。
      const totalUnreadCount = conversations.reduce(
        (total, conversation) => total + conversation.unreadCount,
        0
      );

      // 根据最新会话列表刷新列表和应用角标。
      refreshConversationList(conversations);
      updateAppBadge(totalUnreadCount);
    }
  },
});

function refreshConversationUnreadCount(
  conversationId: string,
  unreadCount: number
) {
  // 刷新指定会话 UI。
}

function refreshConversationList(conversations) {
  // 刷新会话列表 UI。
}

function updateAppBadge(unreadCount: number) {
  // 更新应用角标或未读数 UI。
}
```

:::tip 
多设备事件仅表示当前用户在其他设备上的会话未读状态发生了变化。建议在回调中重新读取 SDK 本地会话列表数据，而不是只修改界面缓存中的数字。 `clearConversationUnreadMessageCount` 和 `clearAllConversationUnreadMessageCount` 调用成功后，当前设备会通过 `onConversationListUpdate` 感知本地会话列表变化；当前用户的其他设备会通过 `onMultiDeviceConversation` 感知多设备同步事件。
:::

## 与消息已读回执的区别

`sendMessageReadReceipts` 用于发送消息已读回执，作用对象是指定消息；`clearConversationUnreadMessageCount` 和 `clearAllConversationUnreadMessageCount` 作用对象是当前用户侧的会话未读数。

```typescript
await client.chatManager.sendMessageReadReceipts({
  conversationId: 'user2',
  conversationType: 'singleChat',
  messageIds: ['msg1', 'msg2'],
});
```

两类功能的差异如下：

| 功能 | 作用对象 | 是否清零本地会话未读数 | 主要事件 |
| :--- | :--- | :--- | :--- |
| 会话未读数清零 | 当前用户侧的会话未读状态 | 是 | `onConversationListUpdate`、`onConversationUnreadMessageCountCleared`、`onAllConversationsUnreadMessageCountCleared` |
| [消息已读回执](message_receipt.html#单聊消息已读回执) | 指定消息的已读状态 | 否 | `onMessageReadReceipts` |

## 注意事项

- `clearConversationUnreadMessageCount` 仅支持单聊和群聊，`conversationType` 只能为 `singleChat` 或 `groupChat`，不支持聊天室。
- 调用 `clearConversationUnreadMessageCount` 时，`conversationId` 不能为空，`conversationType` 必须合法；参数非法时 SDK 会抛出参数错误，错误码为 `110`。
- 调用清零接口前，客户端需要处于已连接状态；未连接时会抛出连接相关错误。
- 清零会话未读数不会向会话对端发送通知，也不会触发对端的会话已读事件或消息已读回执事件。
- 清零动作会更新当前登录用户侧的本地会话未读状态；若本地会话列表快照发生变化，会触发 `onConversationListUpdate`。
- `setCurrentConversation` 只影响当前 SDK 实例内存中的在线消息未读累加规则；切换页面或离开会话时应调用 `resetCurrentConversation`。
- `sendMessageReadReceipts` 只表示指定消息已读，不会推进会话级 `readAt`，也不会直接清零本地会话未读数。

## 接口列表

| API | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`setCurrentConversation`](#设置当前正在浏览的会话) | `ChatManager` | 设置当前浏览会话，使该会话后续在线消息不再累加本地未读数。 |
| [`resetCurrentConversation`](#设置当前正在浏览的会话) | `ChatManager` | 重置当前浏览会话，恢复默认未读数累加规则。 |
| [`getCurrentConversation`](#设置当前正在浏览的会话) | `ChatManager` | 获取当前正在浏览的会话；未设置时返回 `null`。 |
| [`clearConversationUnreadMessageCount`](#清零单个会话未读数) | `ChatManager` | 清零指定单聊或群聊会话的未读数。 |
| [`clearAllConversationUnreadMessageCount`](#清零全部会话未读数) | `ChatManager` | 清零当前用户全部会话的未读数。 |
| [`getConversationList`](#监听当前设备会话列表更新) | `ChatManager` | 主动读取 SDK 本地会话列表缓存。 |
| [`sendMessageReadReceipts`](#与消息已读回执的区别) | `ChatManager` | 发送指定消息的已读回执，不会直接清零会话未读数。 |
