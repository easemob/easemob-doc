# 管理本地消息数据

<Toc />

本文介绍即时通讯 IM SDK 如何管理本地消息数据。

除了发送和接收消息外，环信即时通讯 IM SDK 还支持以会话为单位对本地的消息数据进行管理，如获取与管理未读消息、删除聊天记录、搜索历史消息等。其中，会话是一个单聊、群聊或者聊天室所有消息的集合。用户需在会话中发送消息或查看历史消息，还可进行会话置顶、清空聊天记录等操作。

本文介绍如何使用环信即时通讯 IM SDK 在 app 中实现这些功能。

## 技术原理

SQLCipher 用于加密存储本地消息的数据库。即时通讯 IM SDK 使用 `IChatManager` 和 `Conversation` 管理本地消息。以下是核心方法：

- `IChatManager.LoadAllConversations` 获取本地会话列表；
- `Conversation.LoadMessages` 读取指定会话的消息；
- `Conversation.UnReadCount` 获取指定会话的未读消息数；
- `IChatManager.GetUnreadMessageCount` 获取所有会话的未读消息数；
- `IChatManager.MarkAllConversationsAsRead` 指定会话的未读消息数清零；
- `IChatManager.DeleteConversation` 删除本地会话及历史消息；
- `IChatManager.DeleteConversationFromServer` 删除服务端的会话及历史消息；
- `IChatManager.LoadMessage` 根据消息 ID 搜索消息；
- `Conversation.LoadMessagesWithMsgType` 获取指定会话中特定类型的消息；
- `Conversation.LoadMessagesWithTime` 获取指定会话中一定时间段内的消息；
- `IChatManager.SearchMsgFromDB` 根据关键字搜索会话消息；
- `IChatManager.ImportMessages` 批量导入消息到数据库；
- `Conversation.InsertMessage` 在指定会话中插入消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 获取本地所有会话

你可以调用 `LoadAllConversations` 方法可以根据会话 ID 和会话类型获取本地所有会话:

```csharp
List<Conversation>list = SDKClient.Instance.ChatManager.LoadAllConversations();
```

### 读取指定会话的消息

你可以从本地数据库中读取指定会话的消息，示例代码如下：

```csharp
// 获取本地会话。
Conversation conv = SDKClient.Instance.ChatManager.GetConversation(conversationId, convType);
// 该方法获取 `startMsgId` 之前的 `pagesize` 条消息。
conv.LoadMessages(startMsgId, pagesize, handle:new ValueCallBack<List<Message>>(
  onSuccess: (list) => {
     Debug.Log($"获取到{list.Count}条消息");
  },
  onError:(code, desc) => {
     Debug.Log($"获取会话消息失败，errCode={code}, errDesc={desc}");
  }
));
```

### 获取指定会话的未读消息数

你可以调用接口获取特定会话的未读消息数，示例代码如下：

```csharp
Conversation conv = SDKClient.Instance.ChatManager.GetConversation(conversationId, convType);
int unread = conv.UnReadCount;
```

### 获取所有会话的未读消息数

你可以通过接口获取所有会话的未读消息数量，示例代码如下：

```csharp
SDKClient.Instance.ChatManager.GetUnreadMessageCount();
```

### 指定会话的未读消息数清零

你可以调用接口对特定会话的未读消息数清零，示例代码如下：

```csharp
Conversation conv = SDKClient.Instance.ChatManager.GetConversation(conversationId, convType);
// 指定会话的未读消息数清零。
conv.MarkAllMessageAsRead();

// 将一条消息置为已读。
conv.MarkMessageAsRead(msgId);

// 将所有未读消息数清零。
SDKClient.Instance.ChatManager.MarkAllConversationsAsRead();
```

### 删除会话及历史消息

SDK 提供两个接口，分别可以删除本地会话和历史消息或者删除当前用户在服务器端的会话和聊天消息。

调用 `DeleteConversation` 和 `DeleteMessage` 删除本地会话和聊天消息，示例代码如下：

```csharp
//删除和特定用户的会话，如需保留历史消息，传 `false`。
SDKClient.Instance.ChatManager.DeleteConversation(conversationId, true);

//删除当前会话中指定的一条历史消息。
Conversation conv = SDKClient.Instance.ChatManager.GetConversation(conversationId, convType);
conv.DeleteMessage(msgId);
```

调用 `DeleteConversationFromServer` 删除服务器端会话和历史消息，示例代码如下：

```csharp
//从服务器端删除和特定 ID 的会话，如果需要保留历史消息，第三个参数传 `false`。
SDKClient.Instance.ChatManager.DeleteConversationFromServer(conversationId, type, true, new CallBack(
    onSuccess: () => {
    },
    onError: (code, desc) => {
    }
));
```

### 根据消息 ID 搜索消息

你可以调用 `LoadMessage` 方法根据消息 ID 获取本地存储的指定消息。如果消息不存在会返回空值。

```csharp
// msgId：要获取消息的消息 ID。
Message msg = SDKClient.Instance.ChatManager.LoadMessage("msgId");
```

### 获取指定会话中特定类型的消息

你可以调用 `LoadMessagesWithMsgType` 方法从本地存储中获取指定会话中特定类型的消息。每次最多可获取 400 条消息。若未获取到任何消息，SDK 返回空列表。

```csharp
Conversation conv = SDKClient.Instance.ChatManager.GetConversation("convId");
// type：消息类型；count：每次获取的消息数量，取值范围为 [1,400]；direction：消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
conv.LoadMessagesWithMsgType(type: MessageBodyType.TXT, count: 50, direction: MessageSearchDirection.UP, new ValueCallBack<List<Message>>(
    onSuccess: (list) => {
        // 遍历消息列表
        foreach(var it in list)
        {
        }
    },
    onError: (code, desc) => {
    }
));
```

### 获取指定会话中一定时间段内的消息

你可以调用 `LoadMessagesWithTime` 方法从本地存储中获取指定的单个会话中一定时间内发送和接收的消息。每次最多可获取 400 条消息。

```csharp
Conversation conv = SDKClient.Instance.ChatManager.GetConversation("convId");
// startTime：搜索的起始时间戳；endTime：搜索的结束时间戳；count：每次获取的消息数量，取值范围为 [1,400]。
conv.LoadMessagesWithTime(startTime: startTime, endTime: endTime, count: 50, new ValueCallBack<List<Message>>(
    onSuccess: (list) => {
        // 遍历消息列表
        foreach (var it in list)
        {
        }
    },
    onError: (code, desc) => {
    }
));
```

### 根据关键字搜索会话消息

你可以调用 `LoadMessagesWithKeyword` 方法以从本地数据库获取会话中的指定用户发送的包含特定关键字的消息，示例代码如下：

```csharp
Conversation conv = SDKClient.Instance.ChatManager.GetConversation("convId");

conv.LoadMessagesWithKeyword(
        // 搜索关键字。
        "key", 
        // 消息发送方。
        sender: "tom",
        // 搜索开始的 Unix 时间戳，单位为毫秒。
        timestamp: 1653971593000,
        // 搜索的最大消息数。
        count: 10, 
        // 消息的搜索方向：消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
        direction: MessageSearchDirection.UP, 
        // 回调处理
        new ValueCallBack<List<Message>>(
    onSuccess: (list) => {
        // 遍历消息列表
        foreach(var it in list)
        {
        }
    },
    onError: (code, desc) => {
    }
));
```

### 批量导入消息到数据库

如果你需要使用批量导入方式在本地会话中插入消息，可以调用 `ImportMessages` 方法，构造 `EMMessage` 对象，将消息导入本地数据库。

示例代码如下：

```csharp
SDKClient.Instance.ChatManager.ImportMessages(msgs);
```

### 插入消息

如果你想在当前对话中插入消息而不实际发送消息，请构造消息正文并调用 `InsertMessage` 方法用于发送通知消息，例如“XXX 撤回一条消息”、“XXX 入群” 和 “对方正在输入...”。

```csharp
// 将消息插入到指定会话中。
Conversation conv = SDKClient.Instance.ChatManager.GetConversation(conversationId, convType);
conv.InsertMessage(message);
```