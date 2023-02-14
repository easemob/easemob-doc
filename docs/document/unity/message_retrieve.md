# 从服务器获取会话和消息（消息漫游）

<Toc />

环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。

本文介绍用户如何从消息服务器获取会话和消息。

## 实现原理

使用环信即时通讯 IM SDK 可以通过 `IChatManager` 类的以下方法从服务器获取历史消息：

- `GetConversationsFromServerWithPage` 分页获取服务器保存的会话列表；
- `FetchHistoryMessagesFromServer` 获取服务器保存的指定会话中的消息;
- `RemoveMessagesFromServer` 单向删除服务端的历史消息；
- `DeleteConversationFromServer` 删除服务端的会话及其历史消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 从服务器获取会话

对于单聊或群聊，用户发消息时，会自动将对方添加到用户的会话列表。

你可以调用 GetConversationsFromServerWithPage 方法从服务端分页获取会话列表，每个会话包含最新一条历史消息。该功能需在环信即时通讯 IM 管理后台[环信即时通讯 IM 管理后台](https://console.easemob.com/user/login)开通。

:::tip
1. 建议在 app 安装时或本地没有会话时调用该方法，否则调用 `LoadAllConversations` 即可。
2. 获取的会话列表中不包含最新一条消息通过 RESTful 接口发送的会话。若需获取该类会话，需要联系商务开通将通过 RESTful 接口发送的消息写入会话列表的功能。
:::

```csharp
SDKClient.Instance.ChatManager.GetConversationsFromServerWithPage(pageNum, pageSize, new ValueCallBack<List<Conversation>>(
    //获取会话成功后的处理逻辑。
    //list 为 List<Conversation> 类型。
    onSuccess: (list) =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
```

对于还不支持`GetConversationsFromServerWithPage`接口的用户，可以调用 `GetConversationsFromServer` 从服务端获取会话列表。该功能需在[环信即时通讯 IM 管理后台](https://console.easemob.com/user/login)开通，开通后，用户默认可拉取 7 天内的 10 个会话（每个会话包含最新一条历史消息），如需调整会话数量或时间限制请联系商务。

### 分页获取指定会话的历史消息

你可以调用 `FetchHistoryMessagesFromServer` 方法从服务器分页获取指定会话的历史消息，实现消息漫游。该功能需在[环信即时通讯 IM 管理后台](https://console.easemob.com/user/login)开通。

为确保数据可靠，我们建议你多次调用该方法，且每次获取的消息数小于 50 条。获取到数据后，SDK 会自动将消息更新到本地数据库。

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

### 单向删除服务端的历史消息

你可以调用 `RemoveMessagesFromServer` 方法单向删除服务端的历史消息，每次最多可删除 50 条消息。消息删除后，该用户无法从服务端拉取到该消息。其他用户不受该操作影响。已删除的消息自动从设备本地移除。

:::tip
若使用该功能，需将 SDK 升级至 V3.9.8 或以上版本。
:::

```csharp
SDKClient.Instance.ChatManager.RemoveMessagesFromServer(convId, ctype, time, new CallBack(
    onSuccess: () =>
    {
    },
    onError: (code, desc) =>
    {
    }
));

SDKClient.Instance.ChatManager.RemoveMessagesFromServer(convId, ctype, msgList, new CallBack(
    onSuccess: () =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
```

### 删除服务端会话及其历史消息

你可以调用 `DeleteConversationFromServer` 方法删除服务器端会话和历史消息。会话删除后，当前用户和其他用户均无法从服务器获取该会话。若该会话的历史消息也删除，所有用户均无法从服务器获取该会话的消息。

```csharp
SDKClient.Instance.ChatManager.DeleteConversationFromServer(conversationId, conversationType, isDeleteServerMessages, new CallBack(
    onSuccess: () =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
```