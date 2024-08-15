## 会话未读数

<Toc />

你可以查看本地所有会话或指定会话的未读消息数，并针对会话的未读消息数清零。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

环信即时通讯 IM iOS SDK 通过 `IEMChatManager` 和 `EMConversation` 类实现对本地会话的未读消息数的管理，其中核心方法如下：

- `EMChatManager#getAllConversations` + `EMConversation#unreadMessagesCount`：获取本地每个会话的未读消息数，然后累加获取所有会话的未读消息数。
- `EMConversation#unreadMessagesCount`：获取本地指定会话的未读消息数。
- `EMChatManager#markAllConversationsAsRead`：将所有会话的未读消息数清零。
- `EMConversation#markAllMessagesAsRead`：对于本地指定会话的未读消息数清零。
- `EMConversation#markMessageAsReadWithId`：将指定会话的单条未读消息置为已读。

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
