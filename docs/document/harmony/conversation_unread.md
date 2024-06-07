# 会话未读数

<Toc />

你可以查看本地所有会话或指定会话的未读消息数，并针对会话的未读消息数清零。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

环信即时通讯 IM HarmonyOS SDK 通过 `ChatManager` 和 `Conversation` 类实现对本地会话的未读消息数的管理，其中核心方法如下：

- `Conversation#getUnreadMsgCount`：获取本地指定会话的未读消息数。
- `ChatManager#markAllConversationsAsRead`：将本地所有会话的未读消息数清零。
- `Conversation#markAllMessagesAsRead`：对于本地指定会话的未读消息数清零。
- `Conversation#markMessageAsRead`：将指定会话的单条未读消息置为已读。

## 实现方法

### 获取指定会话的未读消息数

你可以调用 `getUnreadMsgCount` 获取本地指定会话的未读消息数，示例代码如下：

```TypeScript
let conversation = ChatClient.getInstance().chatManager()?.getConversation(conversationId);
if (conversation) {
    let unreadMsgCount = conversation.getUnreadMsgCount();
}
```

### 将所有会话的未读消息数清零

你可以调用 `markAllConversationsAsRead` 方法将本地所有会话设为已读，即将所有会话的未读消息数清零，示例代码如下：

```TypeScript
ChatClient.getInstance().chatManager()?.markAllConversationsAsRead();
```

### 指定会话的未读消息数清零

你可以调用 `markAllMessagesAsRead` 方法对指定会话的未读消息数清零，示例代码如下：

```TypeScript
let conversation = ChatClient.getInstance().chatManager()?.getConversation(conversationId);
conversation?.markAllMessagesAsRead();
```

### 将指定会话的单条未读消息置为已读

你可以调用 `markMessageAsRead` 方法将指定会话的单条未读消息置为已读。

```TypeScript
let conversation = ChatClient.getInstance().chatManager()?.getConversation(conversationId);
conversation?.markMessageAsRead(messageId);
```
