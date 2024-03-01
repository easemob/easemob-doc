# 管理子区消息

<Toc />

子区消息消息类型属于群聊消息类型，与普通群组消息的区别是需要添加 `isChatThread` 标记。本文介绍即时通讯 IM React Native SDK 如何发送、接收以及撤回子区消息。

## 技术原理

即时通讯 IM React Native SDK 提供 `ChatManager`、`ChatMessage` 和 `ChatMessageThread` 类，用于管理子区消息，支持你通过调用 API 在项目中实现如下功能：

- 发送子区消息
- 接收子区消息
- 撤回子区消息
- 获取子区消息

![img](@static/images/android/sendandreceivemsg.png)

如上图所示，消息收发流程如下：

1. 用户 A 发送一条消息到消息服务器；
2. 对于子区消息，服务器投递给子区内其他每一个成员；
3. 用户收到消息。

子区创建和查看如下图：

![img](@static/images/android/threads.png)

## 前提条件

开始前，请确保满足以下条件：

- 已集成 `1.0.5 或以上版本` SDK 的基本功能，完成 SDK 初始化，详见 [快速开始](quickstart.html) 及 [SDK 集成概述](overview.html)。
- 了解即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 联系商务开通子区功能。

## 实现方法

本节介绍如何使用即时通讯 IM React Native SDK 提供的 API 实现上述功能。

### 发送子区消息

发送子区消息和发送群组消息的方法基本一致，详情请参考 [发送消息](message_send_receive.html#发送消息)。唯一不同的是，发送子区消息需要指定标记 `isChatThread` 为 `true`。

示例代码如下：

```typescript
// chatThreadID: 子区 ID。
// content: 文本消息内容
// convType: 会话类型为群组会话，即 ChatConversationType.GroupChat
// isChatThread: 是否是子区消息，这里设置为 `true`，即是子区消息
const message = ChatMessage.createTextMessage(chatThreadID, content, convType, {
  isChatThread: true,
});
// 发送消息时可以设置回调，接收消息的发送状态和结果
const callback = new ChatMessageCallback();
// 发送消息。
ChatClient.getInstance()
  .chatManager.sendMessage(message, callback)
  .then(() => {
    // 消息发送动作完成，会在这里打印日志。
    // 消息的发送结果通过回调返回
    console.log("send message operation success.");
  })
  .catch((reason) => {
    // 消息发送动作失败，会在这里打印日志。
    console.log("send message operation fail.", reason);
  });
```

### 接收子区消息

接收消息的具体逻辑，请参考 [接收消息](message_send_receive.html#接收消息)，此处只介绍子区消息和其他消息的区别。

子区有新增消息时，子区所属群组的所有成员收到 `ChatMessageEventListener#onChatMessageThreadUpdated` 回调，子区成员收到 `ChatMessageEventListener#onMessagesReceived` 回调。

示例代码如下：

```typescript
// 继承并实现 `ChatMessageEventListener`
class ChatMessageEvent implements ChatMessageEventListener {
  onMessagesReceived(messages: ChatMessage[]): void {
    console.log(`onMessagesReceived: `, messages);
  }
  onChatMessageThreadUpdated(msgThread: ChatMessageThreadEvent): void {
    console.log(`onChatMessageThreadUpdated: `, msgThread);
  }
  // 其他回调接收省略，实际开发需添加
}

// 注册监听器
const listener = new ChatMessageEvent();
ChatClient.getInstance().chatManager.addMessageListener(listener);

// 移除监听器
ChatClient.getInstance().chatManager.removeMessageListener(listener);

// 移除所有监听器。
ChatClient.getInstance().chatManager.removeAllMessageListener();
```

### 撤回子区消息

接收消息的具体逻辑，请参考 [撤回消息](message_recall.html)，此处只介绍子区消息和其他消息的区别。

子区有消息撤回时，子区所属群组的所有成员收到 `ChatMessageEventListener#onChatMessageThreadUpdated` 回调，子区成员收到 `ChatMessageEventListener#onMessagesRecalled` 回调。

示例代码如下：

```typescript
// 继承并实现 `ChatMessageEventListener`
class ChatMessageEvent implements ChatMessageEventListener {
  onMessagesRecalled(messages: ChatMessage[]): void {
    console.log(`onMessagesRecalled: `, messages);
  }
  onChatMessageThreadUpdated(msgThread: ChatMessageThreadEvent): void {
    console.log(`onChatMessageThreadUpdated: `, msgThread);
  }
  // 其他回调接收省略，实际开发中需添加
}
```

### 获取子区消息

从服务器还是本地数据库获取子区消息取决于你的生产环境。

你可以通过 `ChatConversation#isChatThread()` 判断当前会话是否是子区会话。

#### 从服务器获取单个子区的消息（消息漫游）

调用 `fetchHistoryMessages` 方法从服务器获取子区消息。从服务器获取子区消息与获取群组消息的唯一区别为前者需传入子区 ID，后者需传入群组 ID。

```typescript
// chatThreadID: 子区 ID。
const chatThreadID = "chatThreadID";
// 会话类型为群聊，即 ChatConversationType.GroupChat。
const convType = ChatConversationType.GroupChat;
// 期望每页获取的消息数量。
const pageSize = 10;
// 搜索的起始消息 ID。
const startMsgId = "";
// 消息搜索方向
const direction = ChatSearchDirection.UP;
ChatClient.getInstance()
  .chatManager.fetchHistoryMessages(chatThreadID, chatType, {
    pageSize,
    startMsgId,
    direction,
  })
  .then((messages) => {
    console.log("get message success: ", messages);
  })
  .catch((reason) => {
    console.log("load conversions fail.", reason);
  });
```

#### 获取本地单个子区的消息

调用 `ChatManager#getAllConversations` 方法只能获取单聊或群聊会话。

你可以调用 `getThreadConversation` 方法获取子区会话，然后从本地数据库中读取指定会话的消息：

```typescript
// 获取子区会话
ChatClient.getInstance()
  .chatManager.getThreadConversation(chatThreadID, createIfNeed)
  .then((conv) => {
    // 从本地数据库获取子区会话消息
    conv
      .getMessages(
        chatThreadID,
        ChatConversationType.GroupChat,
        startMsgId,
        direction,
        loadCount
      )
      .then((messages) => {
        console.log("success.", messages);
      })
      .catch((reason) => {
        console.log("fail.", reason);
      });
  })
  .catch((reason) => {
    console.log("fail.", reason);
  });
```
