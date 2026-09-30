# 会话未读数

## 功能说明

你可以查看本地会话的未读消息数，并将指定会话或全部会话的未读消息数清零。

如需展示未读总数或应用角标，应用可读取本地会话列表并汇总各会话的未读数。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 已了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 会话未读数清零流程

会话未读数清零的核心流程如下：

![](/images/harmonyos/conversation_unread_count_clear.png)

会话未读数清零的基本步骤如下：

1. 用户进入会话页面后，应用记录当前会话 ID，并根据业务需要调用 `clearConversationUnreadMessageCount(conversationId)` 清零该会话的未读数。
2. SDK 先将本地目标会话的未读数更新为 `0`，再将清零结果同步给当前用户登录的其他设备。
3. 本地会话数据发生变化时，`ConversationListener#onConversationUpdate` 会收到回调。应用应重新读取会话数据并刷新会话列表 UI。
4. 清零操作不会通知会话对端，也不会触发消息已读回执；仅会同步给当前用户的其他设备。
5. 如需清零所有会话的未读数，可调用 `clearAllConversationUnreadMessageCount()`。该操作会清零本地全部会话的未读数，并同步给当前用户的其他设备。

如果指定会话的本地未读数已经清零，但同步时出现服务端确认超时或连接断开，本地清零结果会保留，不会回滚。

:::tip
清零会话未读数不会向会话对端发送通知，也不会触发消息已读回执。如需让消息发送方感知消息已读，请使用消息已读回执功能。
:::

## 获取所有会话的未读消息数

应用可以调用 `getAllConversationsBySort` 获取本地会话列表，再累加每个会话的 `getUnreadMsgCount()`：

```typescript
let conversations: Array<Conversation> = ChatClient.getInstance()
    .chatManager()
    ?.getAllConversationsBySort() ?? [];

let unreadCount: number = 0;
conversations.forEach((conversation: Conversation): void => {
    unreadCount += conversation.getUnreadMsgCount();
});
```

该结果只统计 `getAllConversationsBySort` 返回的本地会话。SDK 不会在上述应用层求和过程中自动排除特定会话类型或特定 [推送提醒类型](/document/harmonyos/push/push_notification_mode_dnd.html#推送通知方式)；如需仅统计单聊和群聊，或排除 [免打扰](/document/harmonyos/push/push_notification_mode_dnd.html#免打扰模式) 会话，应先按照业务规则筛选会话再求和。

## 获取指定会话的未读消息数

调用 `getConversation` 获取指定会话对象，再调用 `getUnreadMsgCount` 获取该会话的本地未读消息数。若本地不存在指定会话，`getConversation` 返回 `undefined`。

:::tip
`getConversation` 和 `getUnreadMsgCount` 支持单聊、群聊和聊天室会话。获取会话时应传入正确的 `ConversationType`。
:::

```typescript
let conversation: Conversation | undefined = ChatClient.getInstance()
    .chatManager()
    ?.getConversation(conversationId, conversationType, false);

let unreadCount: number = conversation?.getUnreadMsgCount() ?? 0;
```

## 将所有会话的未读消息数清零

调用 `clearAllConversationUnreadMessageCount` 将本地全部会话（包括聊天室会话）的未读消息数清零。清零状态会同步到当前账号的其他设备，但不会向消息发送方发送已读回执。

其他登录设备会通过 `MultiDevicesListener#onConversationEvent` 收到 `MultiDevicesEvent#ALL_CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED` 事件。清空全部会话时，回调中的 `conversationId` 和 `type` 不表示某个具体会话。

```typescript
let chatManager = ChatClient.getInstance().chatManager();
if (chatManager) {
    chatManager.clearAllConversationUnreadMessageCount()
        .then(() => {
            // 全部会话的未读消息数已清零。
        })
        .catch((error: ChatError) => {
            // 根据 error.errorCode 和 error.description 处理错误。
        });
}
```

:::tip
会话未读数清零不会向消息发送方发送已读回执。若需要向对方发送消息已读回执，请单独调用 `ChatManager#sendMessageReadReceipts`。该接口仅支持单聊和群聊，不支持聊天室，详见 [消息回执文档](message_receipt.html#消息已读回执与会话未读数清零)。
:::

## 指定会话的未读消息数清零

调用 `clearConversationUnreadMessageCount` 将指定会话的本地未读消息数清零。清零状态会同步到当前账号的其他设备，但不会向消息发送方发送已读回执。

其他登录设备会通过 `MultiDevicesListener#onConversationEvent` 收到 `MultiDevicesEvent#CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED` 事件。其中，`conversationId` 为会话 ID，`type` 为会话类型。

```typescript
let chatManager = ChatClient.getInstance().chatManager();
if (chatManager) {
    chatManager.clearConversationUnreadMessageCount(conversationId)
        .then(() => {
            // 指定会话的未读消息数已清零。
        })
        .catch((error: ChatError) => {
            // 根据 error.errorCode 和 error.description 处理错误。
        });
}
```

:::tip
会话未读数清零与消息已读回执相互独立。若需要通知消息发送方消息已读，应另行调用 `sendMessageReadReceipts`。
:::

## 监听多设备上的未读数变化

如需同步多设备上的会话未读数，需开通多端多设备服务，详见[在多个设备上登录](multi_device.html)。

假设当前用户同时登录设备 A 和设备 B：

- 用户在设备 A 上清零指定会话的未读数后，设备 B 会收到 `MultiDevicesEvent#CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED` 事件。
- 用户在设备 A 上清零所有会话的未读数后，设备 B 会收到 `MultiDevicesEvent#ALL_CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED` 事件。

你需要实现 `MultiDevicesListener`，并调用 `addMultiDevicesListener` 注册监听器。收到 `onConversationEvent` 回调后，应重新读取 SDK 中的本地会话数据并刷新界面。

```typescript
let multiDevicesListener: MultiDevicesListener = {
    // 以下三个回调为 MultiDevicesListener 的必填回调。
    onContactEvent: (
        event: MultiDevicesEvent,
        target: string,
        ext: string
    ): void => {
    },
    onGroupEvent: (
        event: MultiDevicesEvent,
        target: string,
        userIds: Array<string>
    ): void => {
    },
    onMessageRemoved: (conversationId: string, deviceId: string): void => {
    },
    onConversationEvent: (
        event: MultiDevicesEvent,
        conversationId: string,
        type: ConversationType
    ): void => {
        let chatManager = ChatClient.getInstance().chatManager();
        if (!chatManager) {
            return;
        }

        if (event === MultiDevicesEvent.CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED) {
            let conversation: Conversation | undefined = chatManager.getConversation(
                conversationId,
                type,
                false
            );
            let unreadCount: number = conversation?.getUnreadMsgCount() ?? 0;
            // 使用 unreadCount 刷新该会话的未读数。
        } else if (
            event === MultiDevicesEvent.ALL_CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED
        ) {
            let conversations: Array<Conversation> = chatManager
                .getAllConversationsBySort();
            // 使用最新会话列表刷新界面，并重新计算应用角标。
        }
    }
};

ChatClient.getInstance().addMultiDevicesListener(multiDevicesListener);

// 不再需要监听时移除监听器。
ChatClient.getInstance().removeMultiDevicesListener(multiDevicesListener);
```

:::tip
多设备回调只表示数据已经发生变化。建议在回调中重新读取 SDK 本地会话数据，不要只修改应用缓存的数字。清零未读数的接口不会自动刷新应用界面或应用角标；应用应在 Promise 成功返回以及收到多设备回调后，根据最新会话数据自行刷新。
:::

## 单条消息的已读状态和已读回执

你可以通过 `ChatMessage#isRead()` 查询单条消息的本地已读状态，但不能通过该接口修改。

如果需要通知消息发送方消息已读，可调用 `sendMessageReadReceipts` 发送一条或多条消息的已读回执。消息发送方可通过 `ChatMessageListener#onMessageReadReceipts` 统一接收单聊和群聊消息的已读回执列表。

通过 `ChatMessage.createReceiveMessage(...)` 创建的接收消息对象默认标记为已读，不会计入会话未读数。

关于消息的已读回执和已读状态，详见 [消息回执文档](message_receipt.html)。

:::tip
发送消息已读回执与清零会话未读数是两个独立操作：<br/>- `sendMessageReadReceipts`：向消息发送方发送已读回执，仅支持单聊和群聊。<br/>- `clearConversationUnreadMessageCount`：将指定会话的本地未读数清零，并同步当前账号的其他设备，但不向消息发送方发送已读回执。
:::

## 接口列表

| API 名称 | 所属模块/类 | 是否支持聊天室 | 说明 |
| :--- | :--- | :--- | :--- |
| [`getAllConversationsBySort`](#获取所有会话的未读消息数) | `ChatManager` | 视本地列表而定 | 获取本地会话列表，应用可遍历列表计算未读消息总数。 |
| [`getConversation`](#获取指定会话的未读消息数) | `ChatManager` | 是 | 获取指定的本地会话对象。 |
| [`getUnreadMsgCount`](#获取指定会话的未读消息数) | `Conversation` | 是 | 获取指定会话的本地未读消息数。 |
| [`clearAllConversationUnreadMessageCount`](#将所有会话的未读消息数清零) | `ChatManager` | 是 | 清零全部本地会话的未读消息数，并同步当前账号的其他设备。 |
| [`clearConversationUnreadMessageCount`](#指定会话的未读消息数清零) | `ChatManager` | 是 | 清零指定会话的本地未读消息数，并同步当前账号的其他设备。 |
| [`addMultiDevicesListener`](#监听多设备上的未读数变化) / [`removeMultiDevicesListener`](#监听多设备上的未读数变化) | `ChatClient` | 是 | 添加或移除多设备监听器。 |
| [`isRead`](#单条消息的已读状态和已读回执) | `ChatMessage` | 是 | 查询单条消息的本地已读状态。 |
| [`sendMessageReadReceipts`](#单条消息的已读状态和已读回执) | `ChatManager` | 否 | 为单聊或群聊消息发送已读回执。 |
