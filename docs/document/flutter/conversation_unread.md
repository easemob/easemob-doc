# 会话未读数

## 功能说明

你可以查看本地所有会话或指定会话的未读消息数，并针对会话的未读消息数清零。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 已了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 会话未读数清零流程

会话未读数清零的核心流程如下：

![](/images/android/conversation_unread_count_clear.png)

会话未读数清零的基本步骤如下：

1. 用户进入会话页面后，在应用层记录当前会话 ID，并根据需要调用 `clearConversationUnreadMessageCount(conversationId)` 清零该会话的未读数。
2. 调用成功后，SDK 会将本地缓存中目标会话的未读数更新为 `0`，并同步给当前用户登录的其他设备。
3. 会话数据发生变化时，注册的 `ChatEventHandler#onConversationsUpdate` 会收到回调，应用可据此刷新会话列表 UI。
4. 多设备登录时，清零操作不会通知会话对端，也不会触发对端的消息已读回执；仅会同步给当前用户的其他在线设备。
5. 如需清零所有会话的未读数，可调用 `clearAllConversationUnreadMessageCount`。该操作会清零当前设备本地缓存中的全部会话未读数，并同步给当前用户的其他在线设备。

:::tip
清零会话未读数不会向会话对端发送通知，也不会触发对端的消息已读回执。如需让消息发送方感知消息已读，请使用消息已读回执功能。
:::

## 获取所有会话的未读消息数

调用 `ChatManager#getUnreadMessageCount` 获取本地单聊和群聊会话的未读消息总数。

该接口的统计范围如下：

- 不统计聊天室会话。
- 不统计消息话题（Thread）会话。
- 不统计推送通知方式为 `ChatPushRemindType.MENTION_ONLY` 或 `ChatPushRemindType.NONE` 的会话。这些会话即使存在未读消息，也不纳入统计。
- 仅统计推送通知方式为 `ChatPushRemindType.ALL` 的单聊和群聊会话。

```dart
final int unreadCount =
    await ChatClient.getInstance.chatManager.getUnreadMessageCount();
```

如果业务需要其他统计口径，应遍历本地会话，并根据会话类型和 `ChatConversation#remindType` 返回的免打扰设置自行累加未读数。

## 获取指定会话的未读消息数

调用 `ChatManager#getConversation` 获取指定会话对象，再调用 `ChatConversation#unreadCount` 获取该会话的本地未读消息数。若本地不存在指定会话，`getConversation` 返回 `null`。

:::tip
`getConversation` 和 `unreadCount` 接口支持单聊、群聊和聊天室会话。
:::

```dart
final ChatConversation? conversation =
    await ChatClient.getInstance.chatManager.getConversation(
  conversationId,
  type: conversationType,
  createIfNeed: false,
);

final int unreadCount =
    conversation == null ? 0 : await conversation.unreadCount();
```

## 将所有会话的未读消息数清零

调用 `ChatManager#clearAllConversationUnreadMessageCount` 将本地全部会话（包括聊天室会话）的未读消息数清零。清零状态会同步到当前账号的其他设备，但不会向消息发送方发送已读回执。

其他登录设备会通过 `ChatMultiDeviceEventHandler#onConversationEvent` 收到 `ChatMultiDevicesEvent.ALL_CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED` 事件。清空全部会话时，`conversationId` 和 `type` 不表示某个具体会话。

```dart
try {
  await ChatClient.getInstance.chatManager
      .clearAllConversationUnreadMessageCount();
  // 全部会话的未读消息数已清零。
} on ChatError catch (e) {
  // 清零失败，根据错误码和错误信息处理。
}
```

:::tip
会话未读数清零不会向消息发送方发送已读回执。若需要向对方发送消息已读回执，请单独调用 `ChatManager#sendMessageReadReceipts`。该接口仅支持单聊和群聊，不支持聊天室。详见 [消息回执文档](message_receipt.html)。
:::

## 指定会话的未读消息数清零

调用 `ChatManager#clearConversationUnreadMessageCount` 将指定会话的本地未读消息数清零。清零状态会同步到当前账号的其他设备，但不会向消息发送方发送已读回执。

其他登录设备会通过 `ChatMultiDeviceEventHandler#onConversationEvent` 收到 `ChatMultiDevicesEvent.CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED` 事件。其中，`conversationId` 为会话 ID，`type` 为会话类型。

:::tip
会话未读数清零不会向消息发送方发送已读回执。若需要向对方发送消息已读回执，请单独调用 `ChatManager#sendMessageReadReceipts`。详见 [消息回执文档](message_receipt.html)。
:::

```dart
try {
  await ChatClient.getInstance.chatManager
      .clearConversationUnreadMessageCount(conversationId);
  // 指定会话的未读消息数已清零。
} on ChatError catch (e) {
  // 清零失败，根据错误码和错误信息处理。
}
```

## 监听多设备上的未读数变化

如需同步多设备上的会话未读数，需开通多端多设备服务，详见[在多个设备上登录](multi_device.html)。

假设当前用户同时登录设备 A 和设备 B：

- 用户在设备 A 上清空指定会话的未读数后，设备 B 会收到 `ChatMultiDevicesEvent.CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED` 事件。
- 用户在设备 A 上清空所有会话的未读数后，设备 B 会收到 `ChatMultiDevicesEvent.ALL_CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED` 事件。

你需要注册 `ChatMultiDeviceEventHandler`。收到 `onConversationEvent` 回调后，重新读取 SDK 中的会话数据并刷新界面。

```dart
const String multiDeviceHandlerId = 'conversation_unread_multi_device_handler';

ChatClient.getInstance.addMultiDeviceEventHandler(
  multiDeviceHandlerId,
  ChatMultiDeviceEventHandler(
    onConversationEvent: (event, conversationId, type) async {
      if (event ==
          ChatMultiDevicesEvent.CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED) {
        // 指定会话的未读数已在其他设备上清空。
        final ChatConversation? conversation =
            await ChatClient.getInstance.chatManager.getConversation(
          conversationId,
          type: type,
          createIfNeed: false,
        );
        final int unreadCount =
            conversation == null ? 0 : await conversation.unreadCount();
        // 根据 unreadCount 刷新该会话的未读数。
      } else if (event ==
          ChatMultiDevicesEvent.ALL_CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED) {
        // 所有会话的未读数已在其他设备上清空。
        final int unreadCount =
            await ChatClient.getInstance.chatManager.getUnreadMessageCount();
        final List<ChatConversation> conversations =
            await ChatClient.getInstance.chatManager.loadAllConversations();
        // 根据最新会话数据刷新列表和应用角标。
      }
    },
  ),
);

// 不再需要监听时移除监听器。
ChatClient.getInstance.removeMultiDeviceEventHandler(multiDeviceHandlerId);
```

:::tip
多设备回调仅表示数据已发生变化。建议在回调中重新读取 SDK 本地会话数据，而不是只修改界面缓存的数字。此外，清空未读数的 API 不会自动刷新应用界面或应用角标；应在 `clearConversationUnreadMessageCount`、`clearAllConversationUnreadMessageCount` 完成后以及多设备回调中，根据最新未读数自行刷新。
:::

## 单条消息的已读状态和已读回执

你可以通过 `ChatMessage.isRead` 查询消息的本地已读状态，但不能通过该属性修改。

如果需要通知消息发送方消息已读，可调用 `ChatManager#sendMessageReadReceipts` 发送一条或多条消息的已读回执。消息发送方可通过 `ChatEventHandler#onMessageReadReceipts` 统一接收单聊和群聊消息的已读回执列表；列表中的每个元素均为 `ChatMessageReadReceipt`。

关于消息的已读回执和已读状态，详见 [消息回执文档](message_receipt.html)。

:::tip
发送消息已读回执与清零会话未读数是两个独立操作：<br/>- `sendMessageReadReceipts`：向消息发送方发送已读回执，仅支持单聊和群聊。<br/>- `clearConversationUnreadMessageCount`：将指定会话的本地未读数清零，并同步当前账号的其他设备，但不向消息发送方发送已读回执。
:::

## 接口列表

| API 名称 | 所属模块/类 | 是否支持聊天室 | 说明 |
| :--- | :--- | :--- | :--- |
| [`getUnreadMessageCount`](#获取所有会话的未读消息数) | `ChatManager` | 否 | 获取本地单聊和群聊会话的未读消息总数。 |
| [`getConversation`](#获取指定会话的未读消息数) | `ChatManager` | 是 | 获取指定会话对象，包括聊天室会话。 |
| [`unreadCount`](#获取指定会话的未读消息数) | `ChatConversation` | 是 | 获取指定会话的本地未读消息数。 |
| [`clearAllConversationUnreadMessageCount`](#将所有会话的未读消息数清零) | `ChatManager` | 是 | 清空全部本地会话的未读消息数，并同步当前账号的其他设备。 |
| [`clearConversationUnreadMessageCount`](#指定会话的未读消息数清零) | `ChatManager` | 是 | 清空指定会话的本地未读消息数，并同步当前账号的其他设备。 |
| [`sendMessageReadReceipts`](#单条消息的已读状态和已读回执) | `ChatManager` | 否 | 为单聊或群聊消息发送已读回执。 |
