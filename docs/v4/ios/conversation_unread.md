## 会话未读数

<Toc />

你可以查看本地所有会话或指定会话的未读消息数，将全部或单条消息标记为已读，也可以按时间点批量标记消息已读，以更新会话未读数。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

环信即时通讯 IM iOS SDK 通过 `IEMChatManager` 和 `EMConversation` 类实现对本地会话的未读消息数的管理，其中核心方法如下：

- `EMChatManager#getAllConversations + EMConversation#unreadMessagesCount`：获取本地每个会话的未读消息数，然后累加获取所有会话的未读消息数。
- `EMConversation#unreadMessagesCount`：获取本地指定会话的未读消息数。
- `EMChatManager#markAllConversationsAsRead`：将所有会话的未读消息数清零。
- `EMConversation#markAllMessagesAsRead`：对于本地指定会话的未读消息数清零。
- `EMConversation#markMessageAsReadWithId`：将指定会话的单条未读消息置为已读。
- `EMConversation#markMessagesAsReadWithTimestamp:completion:`：将指定会话中指定时间点及以前的未读接收消息标记为已读，并按实际标记条数更新未读数。

## 实现方法

### 获取所有会话的未读消息数

你可以调用 `getAllConversations` 方法获取每个本地会话的未读消息数量，即`EMConversation#unreadMessagesCount`，然后累加该数量，得到所有会话的未读消息数，示例代码如下：

```objectivec
NSArray *conversations = [[EMClient sharedClient].chatManager getAllConversations];
NSInteger unreadCount = 0;
for (EMConversation *conversation in conversations) {
    unreadCount += conversation.unreadMessagesCount;
}
```

### 获取指定会话的未读消息数

你可以调用 `unreadMessagesCount` 方法获取本地指定会话的未读消息数，示例代码如下：

```objectivec
// 获取指定会话 ID 的会话。
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversation:conversationId type:type createIfNotExist:YES];
// 获取未读消息数。
NSInteger unreadCount = conversation.unreadMessagesCount;
```

### 将所有会话的未读消息数清零

你可以调用 `EMChatManager#markAllConversationsAsRead` 方法将本地所有会话设为已读，即将所有会话的未读消息数清零，示例代码如下：

```swift
let err = EMClient.shared().chatManager?.markAllConversationsAsRead()
    if err == nil {
        // 标记所有会话为已读成功
    }
```

:::tip
要使用该功能，你需要将 SDK 升级至 4.5.0 及以上版本。
:::

### 指定会话的未读消息数清零

你可以调用 `markAllMessagesAsRead` 方法对指定会话的未读消息数清零，示例代码如下：

```objectivec
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversation:conversationId type:type createIfNotExist:YES];
[conversation markAllMessagesAsRead:nil];
```

### 将指定会话的单条未读消息置为已读

你可以调用 `markMessageAsReadWithId` 方法将指定会话的单条未读消息置为已读。

```objectivec
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversation:conversationId type:type createIfNotExist:YES];
[conversation markMessageAsReadWithId:messageId error:nil];
```

### 按时间点批量标记消息已读

自 SDK 4.26.0 起，你可以调用 `markMessagesAsReadWithTimestamp:completion:`，将会话中指定时间点及以前的未读接收消息标记为已读，便于按用户实际阅读进度更新已读状态。SDK 按实际标记的消息条数扣减该会话的未读消息数。

- 时间戳单位为毫秒，必须大于 `0`，处理范围包含指定时间点。
- 仅处理接收方向的未读消息，不影响指定时间点之后的消息。
- 该操作只修改本地已读状态，不向服务器发送已读回执。如需向发送方发送已读回执，请参见 [消息已读回执](message_receipt.html)。
- 该方法异步执行，传入的 `completion` 在主线程回调；成功时 `error` 为 `nil`。

```objectivec
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversation:conversationId
                                                                              type:type
                                                                  createIfNotExist:YES];
// 以用户已阅读到的消息时间戳作为截止时间，单位为毫秒。
long long timestamp = lastReadMessage.timestamp;
[conversation markMessagesAsReadWithTimestamp:timestamp completion:^(EMError *error) {
    if (error) {
        // 处理失败，可通过 error.code 和 error.errorDescription 获取错误信息。
        return;
    }
    // 当前回调位于主线程，可读取更新后的未读数并刷新界面。
    NSInteger unreadCount = conversation.unreadMessagesCount;
}];
```

时间戳小于或等于 `0` 时返回 `EMErrorInvalidParam`，未登录时返回 `EMErrorUserNotLogin`，底层会话不存在或数据库操作失败时返回 `EMErrorDatabaseOperationFailed`。
