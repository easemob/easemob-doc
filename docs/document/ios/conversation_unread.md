# 会话未读数

## 功能说明

会话未读数用于表示当前用户在会话中尚未阅读的消息数量。你可以获取指定会话或本地所有会话的未读消息数，也可以清空指定会话或所有会话的未读消息数。

在多设备登录场景下，清空会话未读数的操作会同步到当前账号登录的其他设备。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 已了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

会话未读数清零的核心流程如下：

![](/images/ios/conversation_unread_count_clear.png)

会话未读数清零的基本步骤如下：

1. 用户进入会话页面后，应用记录当前会话 ID，并根据需要调用 `IEMChatManager#clearConversationUnreadMessageCount:completion:` 清零该会话的未读数。
2. 调用成功后，SDK 会将本地数据库中目标会话的未读数更新为 `0`，并将该操作同步至当前用户登录的其他设备。
3. 应用应在 `completion` 回调成功后刷新当前会话及会话列表 UI。此外，可通过 `EMConversationDelegate#conversationListDidUpdate:` 监听会话列表变化。
4. 清零操作不会通知会话对端，也不会触发对端的消息已读回执；多设备登录时，当前用户的其他设备可通过 `EMMultiDevicesDelegate` 提供的多设备会话事件感知该操作。
5. 如需清零所有会话的未读数，可调用 `IEMChatManager#clearAllConversationUnreadMessageCount:`。该接口会清零本地数据库中所有会话的未读数，并将该操作同步至当前用户登录的其他设备。

:::tip 
清零会话未读数不会向会话对端发送通知，也不会自动发送消息已读回执。如需让消息发送方感知消息已读，请使用消息已读回执功能。 
:::

## 获取所有会话的未读消息数

你可以调用 `getUnreadMessageCount` 方法直接获取本地符合统计条件的会话未读消息总数，无需遍历会话列表并手动累加。

该接口的统计范围如下：

- 不统计聊天室会话。
- 不统计消息话题（Thread）的未读消息数。
- 不统计推送通知方式为 `EMPushRemindTypeMentionOnly` 或 `EMPushRemindTypeNone` 的会话。这些会话即使存在未读消息，也不纳入统计。
- 仅统计推送通知方式为 `EMPushRemindTypeAll` 的单聊和群聊会话。

```swift
let unreadCount = EMClient.shared().chatManager?.getUnreadMessageCount() ?? 0
```

## 获取指定会话的未读消息数

你可以调用 `getConversation` 方法从本地获取指定会话，然后读取会话的 `unreadMessagesCount` 属性。

查询未读数时，建议将 `createIfNotExist` 设为 `false`，避免为不存在的会话创建空的本地会话。示例将“会话不存在”和“会话未读数为 `0`”统一返回为 `0`；如业务需要区分这两种情况，请单独判断 `conversation` 是否为 `nil`。

```swift
let conversation = EMClient.shared().chatManager?.getConversation(
    conversationId,
    // 单聊、群聊和聊天室分别为 `.chat`、`.groupChat` 或 `.chatRoom`
    type: .chat,
    // 若会话不存在，是否自动创建
    createIfNotExist: false
)

let unreadCount = Int(conversation?.unreadMessagesCount ?? 0)
```

## 将所有会话的未读消息数清零

调用 `clearAllConversationUnreadMessageCount(_:)` 将本地全部会话的未读数清零。清零状态会同步到当前账号的其他设备，但不会向消息发送方发送已读回执。

其他登录设备会通过 `multiDevicesConversationEvent` 收到 `EMMultiDevicesEventAllConversationUnreadMessageCountCleared` 事件。

清空指定会话和清空所有会话的 completion 均在主队列执行，你可以在操作成功后直接刷新界面。

```swift
EMClient.shared().chatManager?
    .clearAllConversationUnreadMessageCount { error in
        if let error {
            print("全部会话未读数清零失败：\(error.errorDescription)")
        } else {
            print("全部会话未读数已清零")
        }
    }
```

:::tip
会话未读数清零不会向消息发送方发送已读回执。如需发送消息级已读回执，请单独调用 `sendMessageReadReceipts` 该接口仅支持单聊和群聊，不支持聊天室。详见 [消息回执文档](message_receipt.html)。
:::

## 指定会话的未读消息数清零

调用 `clearConversationUnreadMessageCount` 将指定会话的本地未读数清零。该状态会同步到当前账号的其他设备，但不会通知消息发送方。

其他登录设备会通过 `multiDevicesConversationEvent` 收到 `EMMultiDevicesEventConversationUnreadMessageCountCleared` 事件；该回调同时包含会话 ID 和会话类型。

:::tip
会话未读数清零不会向消息发送方发送已读回执。如需发送消息级已读回执，请单独调用 `sendMessageReadReceipts` 该接口仅支持单聊和群聊，不支持聊天室。详见 [消息回执文档](message_receipt.html)。
:::

```swift
EMClient.shared().chatManager?.clearConversationUnreadMessageCount(
    conversationId
) { error in
    if let error {
        print("会话未读数清零失败：\(error.errorDescription)")
    } else {
        print("会话未读数已清零")
    }
}
```

## 监听多设备上的未读数变化

如需同步多设备上的会话未读数，需开通多端多设备服务，详见 [在多个设备上登录](multi_device.html)。

假设当前用户同时登录设备 A 和设备 B：

 - 用户在设备 A 上清空指定会话的未读数后，设备 B 会收到 `EMMultiDevicesEventConversationUnreadMessageCountCleared` 事件。
 - 用户在设备 A 上清空所有会话的未读数后，设备 B 会收到 `EMMultiDevicesEventAllConversationUnreadMessageCountCleared` 事件。

你需实现 `EMMultiDevicesDelegate` 协议，并调用 `addMultiDevices` 注册多设备代理。收到 `multiDevicesConversationEvent` 回调后，重新读取 SDK 中的会话数据并刷新界面。

```swift
final class ConversationListViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()

        // queue 传 nil 时，SDK 在主队列执行回调。
        EMClient.shared().addMultiDevices(delegate: self, queue: nil)
    }

    deinit {
        // 移除多设备代理。
        EMClient.shared().removeMultiDevicesDelegate(self)
    }
}

extension ConversationListViewController: EMMultiDevicesDelegate {
    func multiDevicesConversationEvent(
        _ event: EMMultiDevicesEvent,
        conversationId: String,
        conversationType: EMConversationType
    ) {
        switch event {
        case .conversationUnreadMessageCountCleared:
            // 指定会话的未读数已在其他设备上清空。
            // 重新读取最新的本地会话数据。
            let conversations = EMClient.shared().chatManager?.getAllConversations() ?? []
            let conversation = conversations.first {
                $0.conversationId == conversationId && $0.type == conversationType
            }
            let unreadCount = conversation?.unreadMessagesCount ?? 0
            // 根据 unreadCount 刷新该会话的未读数。

        case .allConversationUnreadMessageCountCleared:
            // 所有会话的未读数已在其他设备上清空。
            let unreadCount = EMClient.shared().chatManager?.getUnreadMessageCount() ?? 0
            // 根据 unreadCount 刷新会话列表和应用角标。

        default:
            break
        }
    }
}
```

:::tip 
多设备回调用于通知应用数据已变化。建议在回调中重新读取 SDK 的本地会话数据，不要只修改界面上缓存的数字。 清空未读数的 API 不会自动更新应用界面或 iOS 应用角标，你需要在 completion 或多设备回调中根据最新未读数自行更新。
:::

## 单条消息的已读状态和已读回执

你可以通过 `EMChatMessage.isRead` 查询单聊消息已读状态，但不能通过该接口修改。

如果需要通知消息发送方消息已读，调用 `sendMessageReadReceipts`。消息发送方可通过 `EMChatManagerDelegate.onMessageReadReceipts` 接收单聊和群聊统一的已读回执列表，元素类型为 `EMMessageReadReceipt`。

关于消息的已读回执和已读状态，详见 [消息回执文档](message_receipt.html)。

:::tip
[发送消息已读回执](message_receipt.html) 与清零会话未读数是两个独立操作：<br> - `sendMessageReadReceipts`：通知消息发送方，仅支持单聊和群聊，不改变会话未读数。<br> - `clearConversationUnreadMessageCount`：清零指定会话的本地未读数并同步当前账号其他设备，不通知消息发送方。
:::

## 接口列表

| API 名称 | 所属模块/类型 | 是否支持聊天室 | 说明 |
| :--- | :--- | :--- | :--- |
| [`getUnreadMessageCount`](#获取所有会话的未读消息数) | `IEMChatManager` | 否 | 获取符合统计条件的本地会话未读消息总数。 |
| [`filterConversationsFromDB`](#获取所有会话的未读消息数) | `IEMChatManager` | 是 | 从本地数据库加载全部或筛选后的会话。 |
| [`cleanConversationsMemoryCache`](#获取所有会话的未读消息数) | `IEMChatManager` | 是 | 清理内存中的全部会话缓存；会影响后续未读数统计的完整性。 |
| [`getConversation`](#获取指定会话的未读消息数) | `IEMChatManager` | 是 | 获取指定类型的本地会话对象。 |
| [`unreadMessagesCount`](#获取指定会话的未读消息数) | `EMConversation` | 是 | 获取指定会话的本地未读消息数。 |
| [`clearAllConversationUnreadMessageCount`](#将所有会话的未读消息数清零) | `IEMChatManager` | 是 | 清空全部本地会话的未读数，并同步当前账号其他设备。 |
| [`clearConversationUnreadMessageCount`](#指定会话的未读消息数清零) | `IEMChatManager` | 是 | 清空指定会话的本地未读数，并同步当前账号其他设备。 |
| [`sendMessageReadReceipts`](#单条消息的已读状态和已读回执) | `IEMChatManager` | 否 | 为同一单聊或群聊会话中的消息批量发送已读回执，最多 50 条。 |
