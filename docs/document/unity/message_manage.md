#  管理本地会话和消息

<Toc />

本文介绍即时通讯 IM SDK 如何实现管理本地消息，例如获取消息、搜索消息、导入消息、插入消息、更新消息以及统计消息流量等。

## 技术原理

SQLCipher 用于加密存储本地消息的数据库。即时通讯 IM SDK 使用 `IChatManager` 和 `Conversation` 管理本地消息。以下是核心方法：

- `Conversation.LoadMessages` 读取指定会话的消息。
- `IChatManager.DeleteConversation` 删除本地会话及历史消息。
- `IChatManager.DeleteConversationFromServer` 删除服务端的会话及历史消息。
- `IChatManager.LoadMessage` 根据消息 ID 搜索消息。
- `Conversation.LoadMessagesWithMsgType` 获取指定会话中特定类型的消息。
- `Conversation.LoadMessagesWithTime` 获取指定会话中一定时间段内的消息。
- `IChatManager.SearchMsgFromDB` 根据关键字搜索会话消息。
- `IChatManager.ImportMessages` 批量导入消息到数据库。
- `Conversation.InsertMessage` 在指定会话中插入消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 读取指定会话的消息

你可以从本地数据库中读取指定会话的消息，示例代码如下：

```csharp
// 获取本地会话。
Conversation conv = SDKClient.Instance.ChatManager.GetConversation(conversationId, convType);
// 该方法获取 `startMsgId` 之前的 `pagesize` 条消息。
conv.LoadMessages(startMsgId, pagesize, callback:new ValueCallBack<List<Message>>(
  onSuccess: (list) => {
     Debug.Log($"获取到{list.Count}条消息");
  },
  onError:(code, desc) => {
     Debug.Log($"获取会话消息失败，errCode={code}, errDesc={desc}");
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
SDKClient.Instance.ChatManager.ImportMessages(messages, new CallBack(
   onSuccess: () => {
   },
   onError: (code, desc) =>
   {
   }
));
```

### 插入消息

如果你想在当前对话中插入消息而不实际发送消息，请构造消息正文并调用 `InsertMessage` 方法用于发送通知消息，例如“XXX 撤回一条消息”、“XXX 入群” 和 “对方正在输入...”。

```csharp
// 将消息插入到指定会话中。
Conversation conv = SDKClient.Instance.ChatManager.GetConversation(conversationId, convType);
conv.InsertMessage(message);
```
