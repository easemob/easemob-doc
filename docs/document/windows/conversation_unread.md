# 会话未读数

<Toc />

你可以查看本地所有会话或指定会话的未读消息数，并针对会话的未读消息数清零。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

环信即时通讯 IM SDK 通过 `IChatManager` 和 `Conversation` 类实现对本地会话的未读消息数的管理，其中核心方法如下：

- `IChatManager#GetUnreadMessageCount`：获取本地所有会话的未读消息数。
- `Conversation#UnReadCount`：获取本地指定会话的未读消息数。
- `IChatManager#MarkAllConversationsAsRead`：将本地所有会话的未读消息数清零。
- `IChatManager#MarkAllMessageAsRead`：对于本地指定会话的未读消息数清零。
- `IChatManager#MarkMessageAsRead`：将指定会话的单条未读消息置为已读。

## 实现方法

### 获取所有会话的未读消息数

你可以调用 `GetUnreadMessageCount` 方法获取本地所有会话的未读消息数量，示例代码如下：

```csharp
SDKClient.Instance.ChatManager.GetUnreadMessageCount();
```

### 获取指定会话的未读消息数

你可以调用 `UnReadCount` 方法获取本地指定会话的未读消息数，示例代码如下：

```csharp
Conversation conv = SDKClient.Instance.ChatManager.GetConversation(conversationId, convType);
int unread = conv.UnReadCount;
```

### 将所有会话的未读消息数清零

你可以调用 `MarkAllConversationsAsRead` 方法将本地所有会话设为已读，即将所有会话的未读消息数清零，示例代码如下：

```csharp
Conversation conv = SDKClient.Instance.ChatManager.GetConversation(conversationId, convType);
SDKClient.Instance.ChatManager.MarkAllConversationsAsRead();
```

### 指定会话的未读消息数清零

你可以调用 `MarkAllMessageAsRead` 方法对指定会话的未读消息数清零，示例代码如下：

```csharp
Conversation conv = SDKClient.Instance.ChatManager.GetConversation(conversationId, convType);
conv.MarkAllMessageAsRead();
```

### 将指定会话的单条未读消息置为已读

你可以调用 `markMessageAsRead` 方法将指定会话的单条未读消息置为已读。

```csharp
Conversation conv = SDKClient.Instance.ChatManager.GetConversation(conversationId, convType);
conv.MarkMessageAsRead(msgId);
```
