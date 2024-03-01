# 删除会话

<Toc />

删除好友或退出群组后，SDK 不会自动删除对应的单聊或群聊会话。你可以调用相应的接口从服务器和本地删除单个会话及其历史消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

环信即时通讯 IM 支持从服务器和本地删除单个会话及其历史消息，主要方法如下：

- `DeleteConversationFromServer`：单向删除服务端的单个会话及其历史消息。
- `DeleteConversation`：删除本地单个会话及其历史消息。

## 实现方法

### 单向删除服务端会话及其历史消息

你可以调用 `DeleteConversationFromServer` 方法删除服务器端会话和历史消息。会话和消息删除后，当前用户无法从服务器获取该会话和消息，对本地的会话无影响，但会删除本地消息，而其他用户不受影响。

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

### 删除本地会话及历史消息

- 你可以调用 `DeleteConversation` 方法删除本地会话及其聊天消息：

```csharp
//如需保留历史消息，传 `false`。
SDKClient.Instance.ChatManager.DeleteConversation(conversationId, true);
```

- 你可以调用 `DeleteMessage` 方法删除指定会话中指定的一条历史消息。

```csharp
Conversation conv = SDKClient.Instance.ChatManager.GetConversation(conversationId, convType);
conv.DeleteMessage(msgId);
```
