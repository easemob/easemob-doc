# 会话未读数

## 功能说明

你可以查看本地所有会话或指定会话的未读消息数，并针对会话的未读消息数清零。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。本地数据接口需在当前账号的数据库打开后调用。
- 已了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 会话未读数清零流程

会话未读数清零的核心流程如下：

![](/images/android/conversation_unread_count_clear.png)

会话未读数清零的基本步骤如下：

1. 用户进入会话页面后，在应用层记录当前会话 ID，并根据需要调用 `ChatManager#clearConversationUnreadMessageCount(convId)` 清零该会话的未读数。
2. SDK 会先将本地缓存中目标会话的未读数更新为 `0`，再尝试同步到当前用户登录的其他设备。
3. 应用应在操作成功后重新读取会话数据并刷新会话列表 UI。`ChatMessageEventListener#onConversationsUpdate` 仅通知会话新增或删除，不保证在每次未读数变化时触发。// TODO：研发确认。AI 的回答：描述与当前调用链一致。不应依赖 onConversationsUpdate 覆盖每次未读数变化，操作成功后主动重新读取数据是合理的。
4. 多设备登录时，清零操作不会通知会话对端，也不会触发对端的消息已读回执；同步请求仅面向当前用户的其他在线设备。
5. 如需清零所有会话的未读数，可调用 `ChatManager#clearAllConversationUnreadMessageCount` 接口。该操作会清零当前设备本地缓存中的全部会话未读数，并尝试同步到当前用户的其他在线设备。

:::tip
清零会话未读数不会向会话对端发送通知，也不会触发对端的消息已读回执。如需让消息发送方感知消息已读，请使用消息已读回执功能。
:::

:::notice
这两个清零接口会先更新本地未读数，再尝试同步到当前账号的其他设备。未连接服务器或同步请求超时等情况下，接口仍可能正常返回。因此，Promise 成功不表示其他设备已完成同步。当前设备应在调用成功后重新读取本地数据；其他设备应在实际收到多设备事件后重新读取本地数据并刷新界面。
:::

## 获取所有会话的未读消息数

调用 `ChatManager#getUnreadCount` 获取本地单聊和群聊会话的未读消息总数。

该接口的统计范围如下：

- 不统计聊天室会话。
- 不统计消息话题（Thread）的未读消息数。
- 不统计推送通知方式为 `ChatPushRemindType.MENTION_ONLY` 或 `ChatPushRemindType.NONE` 的会话。这些会话即使存在未读消息，也不纳入统计。
- 仅统计推送通知方式为 `ChatPushRemindType.ALL` 的单聊和群聊会话。

```typescript
async function readTotalUnreadCount(): Promise<void> {
  try {
    // 获取本地单聊和群聊会话的未读消息总数
    const unreadCount = await ChatClient.getInstance().chatManager.getUnreadCount();
    console.log('未读消息总数：', unreadCount);
  } catch (error: unknown) {
    console.error('读取未读消息总数失败：', error);
  }
}
```

## 获取指定会话的未读消息数

调用 `ChatManager#getConversation` 获取指定会话对象，再调用 `ChatConversation#getUnreadCount` 获取该会话的本地未读消息数。将 `createIfNeed` 设为 `false` 时，若本地不存在指定会话，`ChatManager#getConversation` 返回 `undefined`。

:::tip
`ChatManager#getConversation` 和 `ChatConversation#getUnreadCount` 接口支持单聊、群聊和聊天室会话。
:::

```typescript
async function readConversationUnreadCount(convId: string): Promise<void> {
  try {
    const conversation = await ChatClient.getInstance().chatManager
    // 群聊和聊天室查询分别使用 `ChatConversationType.GroupChat` 和 `ChatConversationType.RoomChat`。
      .getConversation(convId, ChatConversationType.PeerChat, false);
    const unreadCount = conversation ? await conversation.getUnreadCount() : 0;
    console.log('指定会话未读数：', unreadCount);
  } catch (error: unknown) {
    console.error('读取会话未读数失败：', error);
  }
}
```

## 将所有会话的未读消息数清零

调用 `ChatManager#clearAllConversationUnreadMessageCount` 将本地全部会话（包括聊天室会话）的未读消息数清零，并尝试同步到当前账号的其他设备，但不会向消息发送方发送已读回执。

清零状态同步到其他登录设备后，这些设备可通过 `ChatMultiDeviceEventListener#onConversationEvent` 收到 `ChatMultiDeviceEvent.ALL_CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED` 事件。清空全部会话时，`convId` 和 `convType` 不表示某个具体会话。

```typescript
async function clearAllUnread(): Promise<void> {
  try {
    // 将所有会话的未读消息数清零
    await ChatClient.getInstance().chatManager
      .clearAllConversationUnreadMessageCount();
    // 全部会话的未读消息数已清零
  } catch (error: unknown) {
    // 清零失败，根据错误码和错误信息处理
    console.error('清零全部会话未读数失败：', error);
  }
}
```

:::tip
会话未读数清零不会向消息发送方发送已读回执。若需要向对方发送消息已读回执，请单独调用 `ChatManager#sendMessageReadReceipts`。该接口仅支持单聊和群聊，不支持聊天室。详见 [消息回执文档](message_receipt.html)。
:::

## 指定会话的未读消息数清零

调用 `ChatManager#clearConversationUnreadMessageCount` 将指定会话的本地未读消息数清零，并尝试同步到当前账号的其他设备，但不会向消息发送方发送已读回执。

清零状态同步到其他登录设备后，这些设备可通过 `ChatMultiDeviceEventListener#onConversationEvent` 收到 `ChatMultiDeviceEvent.CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED` 事件。其中，`convId` 为会话 ID，`convType` 为会话类型。

:::tip
会话未读数清零不会向消息发送方发送已读回执。若需要向对方发送消息已读回执，请单独调用 `ChatManager#sendMessageReadReceipts`。详见 [消息回执文档](message_receipt.html)。
:::

```typescript
async function clearConversationUnread(convId: string): Promise<void> {
  try {
    // 将指定会话的未读消息数清零
    await ChatClient.getInstance().chatManager
      .clearConversationUnreadMessageCount(convId);
    // 指定会话的未读消息数已清零
  } catch (error: unknown) {
    // 清零失败，根据错误码和错误信息处理
    console.error('清零指定会话未读数失败：', error);
  }
}
```

## 监听多设备上的未读数变化

如需同步多设备上的会话未读数，需开通多端多设备服务，详见[在多个设备上登录](multi_device.html)。

假设当前用户同时登录设备 A 和设备 B，且设备间的清零状态同步成功：

- 用户在设备 A 上清空指定会话的未读数后，设备 B 会收到 `ChatMultiDeviceEvent.CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED` 事件。
- 用户在设备 A 上清空所有会话的未读数后，设备 B 会收到 `ChatMultiDeviceEvent.ALL_CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED` 事件。

你需要实现 `ChatMultiDeviceEventListener`，并调用 `ChatClient#addMultiDeviceListener` 注册监听器。收到 `ChatMultiDeviceEventListener#onConversationEvent` 回调后，重新读取 SDK 中的会话数据并刷新界面。

以下代码在 React 组件内使用 `useEffect` 注册监听，并在组件卸载时移除同一个监听器对象：

```typescript
useEffect(() => {
  const client = ChatClient.getInstance();
  const chatManager = client.chatManager;
  let active = true;

  const multiDeviceListener: ChatMultiDeviceEventListener = {
    // 本示例仅处理会话多设备事件，其他回调可省略。
    async onConversationEvent(
      event?: ChatMultiDeviceEvent,
      convId?: string,
      convType?: ChatConversationType
    ): Promise<void> {
      try {
        if (
          event ===
          ChatMultiDeviceEvent.CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED
        ) {
          if (!convId || convType === undefined) return;

          // 指定会话的未读数已在其他设备上清空。
          // 重新读取 SDK 中最新的本地会话数据，不创建不存在的会话。
          const conversation = await chatManager.getConversation(
            convId,
            convType,
            false
          );
          const unreadCount = conversation
            ? await conversation.getUnreadCount()
            : 0;

          if (!active) return;

          // 根据 unreadCount 刷新该会话的未读数。
          refreshConversationUnreadCount(convId, unreadCount);
        } else if (
          event ===
          ChatMultiDeviceEvent.ALL_CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED
        ) {
          // 所有会话的未读数已在其他设备上清空。
          const unreadCount = await chatManager.getUnreadCount();
          const conversations = await chatManager.getAllConversations();

          if (!active) return;

          // 根据最新会话数据刷新列表和应用角标。
          refreshConversationList(conversations);
          updateAppBadge(unreadCount);
        }
      } catch (error: unknown) {
        console.error('读取会话未读数据失败：', error);
      }
    },
  };

  // 组件挂载时添加多设备监听器。
  client.addMultiDeviceListener(multiDeviceListener);

  return () => {
    // 组件卸载时移除同一个监听器，停止后续界面更新。
    active = false;
    client.removeMultiDeviceListener(multiDeviceListener);
  };
}, []);
```

:::tip
多设备回调仅表示数据已发生变化。建议在回调中重新读取 SDK 本地会话数据，而不是只修改界面缓存的数字。清空未读数的 API 不会自动刷新应用界面或应用角标；应在 `ChatManager#clearConversationUnreadMessageCount`、`ChatManager#clearAllConversationUnreadMessageCount` 的 Promise 成功后，以及多设备回调中，根据最新未读数自行刷新。
:::

## 单条消息的已读状态和已读回执

你可以通过 `ChatMessage.isRead` 查询，但不能通过该属性修改。

如果需要通知消息发送方消息已读，可调用 `ChatManager#sendMessageReadReceipts` 发送一条或多条消息的已读回执。消息发送方可通过 `ChatMessageEventListener#onMessageReadReceipts` 统一接收单聊和群聊消息的已读回执列表；列表中的每个元素均为 `ChatMessageReadReceipt`。

关于消息的已读回执和已读状态，详见 [消息回执文档](message_receipt.html)。

:::tip
发送消息已读回执与清零会话未读数是两个独立操作：<br/> - `ChatManager#sendMessageReadReceipts`：向消息发送方发送已读回执，仅支持单聊和群聊。<br/> - `ChatManager#clearConversationUnreadMessageCount`：将指定会话的本地未读数清零，并尝试同步到当前账号的其他设备，但不向消息发送方发送已读回执。
:::

## 接口列表

| API 名称 | 所属模块/类 | 是否支持聊天室 | 说明 |
| :--- | :--- | :--- | :--- |
| [`getUnreadCount`](#获取所有会话的未读消息数) | `ChatManager` | 否 | 获取本地单聊和群聊会话的未读消息总数。 |
| [`getConversation`](#获取指定会话的未读消息数) | `ChatManager` | 是 | 获取指定会话对象，包括聊天室会话。 |
| [`getUnreadCount`](#获取指定会话的未读消息数) | `ChatConversation` | 是 | 获取指定会话的本地未读消息数。 |
| [`clearAllConversationUnreadMessageCount`](#将所有会话的未读消息数清零) | `ChatManager` | 是 | 清空全部本地会话的未读消息数，并尝试同步到当前账号的其他设备。 |
| [`clearConversationUnreadMessageCount`](#指定会话的未读消息数清零) | `ChatManager` | 是 | 清空指定会话的本地未读消息数，并尝试同步到当前账号的其他设备。 |
| [`sendMessageReadReceipts`](#单条消息的已读状态和已读回执) | `ChatManager` | 否 | 为单聊或群聊消息发送已读回执。 |
