# 删除会话

<Toc />

删除好友或退出群组后，SDK 不会自动删除对应的单聊或群聊会话。你可以调用相应的接口从服务器和本地删除单个会话及其历史消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

环信即时通讯 IM 支持从服务器和本地删除单个会话及其历史消息，主要方法如下：

- `ChatManager.removeConversationFromServer`：单向删除服务端的单个会话及其历史消息。
- `ChatManager.deleteConversation`：删除本地单个会话及其历史消息。

## 实现方法 

### 单向删除服务端会话及其历史消息

你可以调用 `removeConversationFromServer` 方法删除服务器端会话，并选择是否删除服务端和本地的历史消息。会话和消息删除后，当前用户无法从服务器获取该会话和消息。调用该接口不会删除本地会话。该接口不影响其他用户的会话和消息。

示例代码如下：

```typescript
// convId: 会话 ID。
// convType：会话类型。
// isDeleteMessage：删除会话时是否同时删除服务端和本地的该会话中的消息。
ChatClient.getInstance()
  .chatManager.removeConversationFromServer(convId, convType, isDeleteMessage)
  .then(() => {
    console.log("remove conversions success");
  })
  .catch((reason) => {
    console.log("remove conversions fail.", reason);
  });
```

### 删除本地会话及历史消息

你可以调用 `deleteConversation` 方法删除本地保存的指定会话，示例代码如下：

```typescript
// convId: 会话 ID。
// withMessage：删除会话时是否同时删除该会话中的消息。
ChatClient.getInstance()
  .chatManager.deleteConversation(convId, withMessage)
  .then(() => {
    console.log("remove conversions success");
  })
  .catch((reason) => {
    console.log("remove conversions fail.", reason);
  });
```
