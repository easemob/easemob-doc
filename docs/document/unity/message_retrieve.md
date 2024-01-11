# 获取历史消息

<Toc />

本文介绍环信即时通讯 IM SDK 如何从服务器和本地获取历史消息。

- 环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。

- SDK 内部使用 SQLite 保存本地消息，你可以获取本地消息。

## 实现原理

使用环信即时通讯 IM SDK 可以通过 `IChatManager` 和 `Conversation` 类的以下方法从服务器获取和删除历史消息：

- `IChatManager.FetchHistoryMessagesFromServer` 获取服务器保存的指定会话中的消息;
- `Conversation.LoadMessages` 读取本地指定会话的消息。
- `IChatManager.LoadMessage` 根据消息 ID 获取消息。
- `Conversation.LoadMessagesWithMsgType` 获取本地单个会话中特定类型的消息。
- `Conversation.LoadMessagesWithTime` 获取本地单个会话中一定时间段内的消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 分页获取指定会话的历史消息

对于单聊或群聊，用户发消息时，会自动将对方添加到用户的会话列表。

你可以调用 `FetchHistoryMessagesFromServer` 方法从服务器获取指定会话的消息（消息漫游）。

为确保数据可靠，我们建议你多次调用该方法，且每次获取的消息数小于 50 条。获取到数据后，SDK 会自动将消息更新到本地数据库。

:::tip
1. 历史消息和离线消息在服务器上的存储时间与你订阅的套餐包有关，详见[产品价格](/product/pricing.html#套餐包功能详情)。
2. 各类事件通知发送时，若接收的用户离线时，事件通知的存储时间与离线消息的存储时间一致，即也取决于你订阅的套餐包。
:::

```csharp
SDKClient.Instance.ChatManager.FetchHistoryMessagesFromServer(conversationId, type, startId, pageSize, new ValueCallBack<CursorResult<Message>>(
    // 获取历史消息成功。
    // result 为 CursorResult<Message> 类型。
    onSuccess: (result) => {
    },

    // 获取历史消息失败。
    onError:(code, desc) => {
    }
));
```

### 从本地读取指定会话的消息

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

### 根据消息 ID 获取本地消息

你可以调用 `LoadMessage` 方法根据消息 ID 获取本地存储的指定消息。如果消息不存在会返回空值。

```csharp
// msgId：要获取消息的消息 ID。
Message msg = SDKClient.Instance.ChatManager.LoadMessage("msgId");
```

### 获取本地指定会话中特定类型的消息

你可以调用 `LoadMessagesWithMsgType` 方法从本地存储中获取指定会话中特定类型的消息。

每次最多可获取 400 条消息。若未获取到任何消息，SDK 返回空列表。

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

### 获取指定时间段内本地单个会话的消息

你可以调用 `LoadMessagesWithTime` 方法从本地存储中搜索一定时间段内指定会话中发送和接收的消息。

每次最多可获取 400 条消息。

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
