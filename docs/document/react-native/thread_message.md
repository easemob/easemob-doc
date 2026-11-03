# 管理消息话题中的消息

## 功能说明

消息话题中的消息类型属于群聊消息类型，与普通群组消息的区别是需要添加 `isChatThread` 标记。使用消息话题中的消息功能前，你需要联系商务开通。

本文介绍环信即时通讯 IM React Native SDK 如何发送、接收以及撤回消息话题中的消息。

## 消息收发流程

消息收发流程如下：

客户端 A 向客户端 B 发送消息。消息发送至即时通讯 IM 服务器，服务器将消息传递给客户端 B。对于消息话题中的消息，服务器投递给消息话题内其他每一个成员。客户端 B 收到消息后，SDK 触发事件。客户端 B 监听事件并获取消息。

消息话题创建和查看如下图所示（以 Android 端界面为例）：

![img](/images/android/threads.png)

## 功能开通

使用消息话题功能前，你需要联系商务开通该功能。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并登录成功，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 已联系商务开通消息话题功能。

## 发送消息话题中的消息

发送消息话题中的消息和发送群组消息的方法基本一致，详情请参考 [发送消息](message_send.html)。唯一不同的是，发送消息话题中的消息需要指定标记 `isChatThread` 为 `true`。

创建消息时，会话类型应为 `ChatMessageChatType.GroupChat`，接收方 ID 为消息话题 ID。`isChatThread` 默认为 `false`，发送消息话题中的消息时必须设为 `true`。

示例代码如下：

```typescript
const chatThreadId = '<chat_thread_id>';
const content = '消息内容';

// 创建一条文本消息，content 为消息文字内容，chatThreadId 为消息话题 ID。
const message = ChatMessage.createTextMessage(
  chatThreadId,
  content,
  // 设置消息类型，消息话题中的消息需要将会话类型设置为 GroupChat。
  ChatMessageChatType.GroupChat,
  {
    // 设置消息标记 isChatThread 为 true。
    isChatThread: true,
  }
);

// 发送消息时可以设置回调，获得消息发送的状态，并据此更新消息的显示状态。
const callback: ChatMessageStatusCallback = {
  onSuccess(sentMessage: ChatMessage): void {
    // 消息发送成功。
    console.log('消息发送成功：', sentMessage.msgId);
  },
  onError(localMsgId: string, error: ChatError): void {
    // 处理消息发送失败。
    console.error('消息发送失败：', localMsgId, error);
  },
  onProgress(localMsgId: string, progress: number): void {
    // 附件消息可在此获取上传进度，文本消息通常不触发此回调。
    console.log('附件上传进度：', localMsgId, progress);
  },
};

try {
  // 发送消息，最终发送结果通过上述回调返回。
  await ChatClient.getInstance().chatManager.sendMessage(message, callback);
} catch (error: unknown) {
  // 处理发起发送调用时的错误。
  console.error('发起发送失败：', error);
}
```

## 接收消息话题中的消息

接收消息的具体逻辑，请参考 [接收消息](message_receive.html)，此处只介绍消息话题中的消息和其他消息的区别。

消息话题有新增消息时，消息话题所属群组的所有成员收到 `ChatMessageEventListener#onChatMessageThreadUpdated` 回调，消息话题成员收到 `ChatMessageEventListener#onMessagesReceived` 回调。

示例代码如下：

```typescript
const messageListener: ChatMessageEventListener = {
  // 收到消息，遍历消息队列，解析和显示。
  onMessagesReceived(messages: ChatMessage[]): void {
    for (const message of messages) {
      if (message.isChatThread) {
        // 接收到消息话题中的消息，添加处理逻辑。
      }
    }
  },
  // 其他回调，此处省略。
};

// 添加消息监听器。
ChatClient.getInstance().chatManager.addMessageListener(messageListener);

function stopListeningToThreadMessages(): void {
  // 不再需要监听时，移除同一个消息监听器对象。
  ChatClient.getInstance().chatManager.removeMessageListener(messageListener);
}
```

## 撤回消息话题中的消息

撤回消息的具体逻辑，请参考 [撤回消息](message_recall.html)，此处只介绍消息话题中的消息和其他消息的区别。

消息话题有消息撤回时，消息话题所属群组的所有成员收到 `ChatMessageEventListener#onChatMessageThreadUpdated` 回调，消息话题成员收到 `ChatMessageEventListener#onMessagesRecalledInfo` 回调。

监听器的注册和移除方式与接收消息时相同。

示例代码如下：

```typescript
const recallListener: ChatMessageEventListener = {
  // 收到撤回消息回调，遍历撤回信息，解析和显示。
  onMessagesRecalledInfo(infos: ChatRecalledMessageInfo[]): void {
    for (const info of infos) {
      const message = info.recalledMessage;
      if (message?.isChatThread) {
        // 接收到消息话题中的消息被撤回，添加处理逻辑。
      }
    }
  },
  // 其他回调，此处省略。
};
```

`ChatRecalledMessageInfo.recalledMessage` 可能为 `undefined`。消息对象不可用时，可通过 `recalledMessageId` 及业务侧记录的消息所属话题更新界面，不要依赖消息对象始终存在。

## 获取消息话题中的消息

从服务器还是本地数据库获取消息话题中的消息取决于你的生产环境。

你可以通过 `ChatConversation.isChatThread` 判断当前会话是否为消息话题会话。

### 从服务器获取单个消息话题的消息（消息漫游）

调用 `ChatManager#fetchHistoryMessagesByOptions` 从服务器获取消息话题中的消息。从服务器获取消息话题中的消息与获取群组消息的唯一区别为前者需传入消息话题 ID，后者需传入群组 ID。

创建 `ChatFetchMessageOptions` 时，`startTs`、`endTs`、`direction` 和 `needSave` 均为必填项，需显式设置。

以下示例不限制时间范围，按时间正序获取消息，且不将获取的消息保存到本地数据库；如需保存，将 `needSave` 设为 `true`。

```typescript
const chatThreadId = '<chat_thread_id>';
const convType = ChatConversationType.GroupChat;
// 每页返回的消息数量，默认为 20。
const pageSize = 10;
// cursor：分页查询的游标。默认为空字符串。首次查询传入空字符串，后续查询传入上一页返回的 `cursor`
// 返回的 `cursor` 为空字符串时，表示已获取最后一页。
const cursor = '';

const options = new ChatFetchMessageOptions({
  startTs: -1,
  endTs: -1,
  // 设置按时间正序获取消息。
  direction: ChatSearchDirection.DOWN,
  // 设置获取的消息不保存到本地数据库。
  needSave: false,
});

try {
  // 从服务器分页获取消息话题中的消息。
  const result = await ChatClient.getInstance().chatManager
    .fetchHistoryMessagesByOptions(chatThreadId, convType, {
      pageSize,
      cursor,
      options,
    });
  // 处理本页消息及下一页游标。
  console.log('消息列表：', result.list, '下一页游标：', result.cursor);
} catch (error: unknown) {
  // 处理获取失败。
  console.error('获取消息话题中的历史消息失败：', error);
}
```

### 从本地获取单个消息话题的消息

你可以调用 `ChatManager#getConversation` 获取本地消息话题会话，再调用 `ChatConversation#getMsgs` 从本地数据库获取消息。

- 调用 `ChatManager#getConversation` 时，需要指定会话类型为 `ChatConversationType.GroupChat`，并将 `isChatThread` 设为 `true`（默认为 `false`）。`createIfNeed` 默认为 `true`，表示指定会话不存在时创建会话；设为 `false` 且会话不存在时，返回 `undefined`。

- 调用 `ChatConversation#getMsgs` 从本地数据库加载消息后，SDK 会将这些消息自动存入原生会话的内存缓存。`startMsgId` 为必填参数，空字符串表示按搜索方向查询消息；`direction` 默认为 `ChatSearchDirection.UP`，即按时间倒序查询；`loadCount` 默认为 `20`。

```typescript
const chatThreadId = '<chat_thread_id>';

try {
  // 需要指定会话类型为 GroupChat，且将 isChatThread 设置为 true。
  const conversation = await ChatClient.getInstance().chatManager
    .getConversation(chatThreadId, ChatConversationType.GroupChat, true, true);

  if (conversation) {
    // 从本地数据库中获取消息，SDK 会将这些消息自动存入此会话的内存缓存。
    const messages = await conversation.getMsgs({
      startMsgId: '',
      loadCount: 10,
      direction: ChatSearchDirection.UP,
    });
    console.log('本地消息话题消息：', messages);
  }
} catch (error: unknown) {
  // 处理获取失败。
  console.error('获取本地消息话题消息失败：', error);
}
```

调用 `ChatManager#getAllConversations` 方法不能获取消息话题会话。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`ChatMessage#createTextMessage`](#发送消息话题中的消息) | `ChatMessage` | 创建文本消息。 |
| [`ChatManager#sendMessage`](#发送消息话题中的消息) | `ChatManager` | 发送消息话题中的消息。 |
| [`ChatManager#fetchHistoryMessagesByOptions`](#从服务器获取单个消息话题的消息-消息漫游) | `ChatManager` | 从服务器分页获取消息话题中的历史消息。 |
| [`ChatManager#getConversation`](#从本地获取单个消息话题的消息) | `ChatManager` | 获取本地消息话题会话。 |
| [`ChatConversation#getMsgs`](#从本地获取单个消息话题的消息) | `ChatConversation` | 从本地数据库加载更多消息。 |
