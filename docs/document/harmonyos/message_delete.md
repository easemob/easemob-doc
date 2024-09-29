# 删除消息

<Toc />

本文介绍用户如何单向删除服务端以及本地的历史消息。

## 技术原理

使用环信即时通讯 IM HarmonyOS SDK 可以通过 `Conversation` 和 `ChatManager` 类从服务器单向删除历史消息，主要方法如下：

- `ChatManager#removeMessagesFromServer`：按消息时间或消息 ID 单向删除服务端的历史消息。
- `Conversation#clearAllMessages`：删除本地指定会话的所有消息。
- `Conversation#removeMessage(targetMessageId)`：删除本地单个会话的指定消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

### 单向删除服务端的历史消息

你可以调用 `removeMessagesFromServer` 方法删除你在服务器和本地的消息。删除后，该用户无法从服务端拉取到该消息，不过，与该用户的单聊、群聊和聊天室会话中的其它用户的服务器消息不受影响，可以漫游获取。

每次最多可删除 50 条消息。多设备情况下，登录该账号的其他设备会收到 `MultiDeviceListener` 中的 `onMessageRemoved` 回调，已删除的消息自动从设备本地移除。

:::tip
1. 要单向删除服务端聊天室的历史消息，需将 SDK 升级至 1.4.0 或以上版本。
:::

示例代码如下：

```TypeScript 
// 按时间删除消息
ChatClient.getInstance().chatManager()?.removeMessagesFromServer(conversationId, conversationType, beforeTimeStamp).then(()=> {
    // success logic
});

// 按消息 ID 删除消息
ChatClient.getInstance().chatManager()?.removeMessagesFromServer(conversationId, conversationType, msgIdList).then(()=> {
    // success logic
});
```

### 删除本地指定会话的所有消息

你可以删除本地指定会话的所有消息，示例代码如下：

```TypeScript
let conversation = ChatClient.getInstance().chatManager()?.getConversation(conversationId);
if(conversation) {
    conversation.clearAllMessages();
}
```

### 删除本地单个会话的指定消息

你可以删除本地单个会话的指定消息，示例代码如下：

```TypeScript
let conversation = ChatClient.getInstance().chatManager()?.getConversation(conversationId);
if(conversation) {
    conversation.removeMessage(messageId);
}
```


