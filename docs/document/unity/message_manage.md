# 管理本地消息数据

<Toc />

本文介绍环信即时通讯 IM SDK 如何管理本地消息数据。SDK 内部使用 SQLite 保存本地消息，方便消息处理。

除了发送和接收消息外，环信即时通讯 IM SDK 还支持以会话为单位对本地的消息数据进行管理，如获取与管理未读消息、删除聊天记录、搜索历史消息等。其中，会话是一个单聊、群聊或者聊天室所有消息的集合。用户需在会话中发送消息或查看历史消息，还可进行会话置顶、清空聊天记录等操作。

本文介绍如何使用环信即时通讯 IM SDK 在 app 中实现这些功能。

## 技术原理

环信即时通讯 IM SDK 通过 `IChatManager` 和 `IConversationManager` 类实现对本地消息的管理，其中核心方法如下：

- `IChatManager.LoadAllConversations` 加载本地存储会话列表;
- `IChatManager.DeleteConversation` 删除本地存储的会话；
- `IConversationManager.UnReadCount` 获取指定会话的未读消息数；
- `IChatManager.GetUnreadMessageCount` 获取所有未读消息数；
- `IChatManager.DeleteConversationFromServer` 删除服务端的会话和聊天记录；
- `IChatManager.SearchMsgFromDB` 在本地存储的消息中搜索；
- `Conversation.insertMessage` 在指定会话中写入消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 获取本地所有会话

你可以根据会话 ID 和会话类型调用 API 获取本地会话:

```csharp
List<Conversation>list = SDKClient.Instance.ChatManager.LoadAllConversations();
```

### 读取指定会话的消息

你可以从本地数据库中读取指定会话的消息，示例代码如下：

```csharp
//获取本地会话。
Conversation conv = SDKClient.Instance.ChatManager.GetConversation(conversationId, convType);
//该方法获取 `startMsgId` 之前的 `pagesize` 条消息。
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
//指定会话的未读消息数清零。
conv.MarkAllMessageAsRead();

//将一条消息置为已读。
conv.MarkMessageAsRead(msgId);

//将所有未读消息数清零。
SDKClient.Instance.ChatManager.MarkAllConversationsAsRead();
```

### 删除会话及聊天记录

SDK 提供两个接口，分别可以删除本地会话和聊天记录或者删除当前用户在服务器端的会话和聊天记录。

- 删除本地会话和聊天记录示例代码如下：

```csharp
//删除和特定用户的会话，如需保留聊天记录，传 `false`。
SDKClient.Instance.ChatManager.DeleteConversation(conversationId, true);

//删除当前会话中指定的一条聊天记录。
Conversation conv = SDKClient.Instance.ChatManager.GetConversation(conversationId, convType);
conv.DeleteMessage(msgId);
```

- 删除服务器端会话和聊天记录，示例代码如下：

```csharp
//从服务器端删除和特定 ID 的会话，如果需要保留聊天记录，第三个参数传 `false`。
SDKClient.Instance.ChatManager.DeleteConversationFromServer(conversationId, type, true, new CallBack(
    onSuccess: () => {
    },
    onError: (code, desc) => {
    }
));
```

### 根据关键字搜索会话消息

你可以根据关键字搜索会话消息，示例代码如下：

```csharp
List<Message> list = SDKClient.Instance.ChatManager.SearchMsgFromDB(keywords, timeStamp, maxCount, from, MessageSearchDirection.UP);

```

### 批量导入消息到数据库

如果你需要使用批量导入方式在本地会话中插入消息，可以使用下面的接口，构造 `EMMessage` 对象，将消息导入本地数据库。

示例代码如下：

```csharp
SDKClient.Instance.ChatManager.ImportMessages(msgs);
```

### 插入消息

如果你需要在本地会话中加入一条消息，比如收到某些通知消息时，可以构造一条消息写入会话。

例如插入一条无需发送但有需要显示给用户看的内容，类似 “XXX 撤回一条消息”、“XXX 入群”、“对方正在输入” 等。

示例代码如下：

```csharp
//将消息插入到指定会话中。
Conversation conv = SDKClient.Instance.ChatManager.GetConversation(conversationId, convType);
conv.InsertMessage(message);
```