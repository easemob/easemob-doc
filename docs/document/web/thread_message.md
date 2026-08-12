# 管理消息话题中的消息

## 功能说明

消息话题（Thread）是群组消息的子会话。消息话题中的消息属于群聊消息，发送消息时需要在消息创建参数中设置 `isChatThread: true`，并使用消息话题 ID 作为会话 ID。

环信即时通讯 IM SDK 支持通过 `ChatManager` 管理消息话题中的消息，包括发送、接收、撤回和从服务器获取历史消息。消息话题本身的创建、加入、退出和成员管理等能力由 `ChatThreadManager` 提供。

## 消息收发流程

消息收发流程如下：

客户端 A 在消息话题中发送消息。消息发送至即时通讯 IM 服务器后，服务器将消息投递给该消息话题内的其他成员。客户端 B 收到消息后，SDK 触发消息事件。客户端 B 监听该事件并获取消息内容。对于消息话题中的消息，消息对象中 `isChatThread` 为 `true`，并可能携带 `chatThread` 上下文；父群消息如果携带消息话题概览信息，则会通过 `chatThreadOverview` 返回。

消息话题创建和查看如下图：

![img](/images/web/web_group_chat_chreat_new_thread_step_01.png)

![img](/images/web/web_group_chat_new_thread_created.png)

## 功能开通

使用消息话题功能前，你需要联系商务开通该功能。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并登录，详见 [快速开始](quickstart.html)；
- 已注册 `ChatManager`。如需创建或管理消息话题，还需注册 `ChatThreadManager`；
- 了解消息话题和消息话题成员数量限制，详见 [使用限制](/product/limitation.html)；
- 已联系商务开通消息话题功能。

## 发送消息话题中的消息

发送消息话题中的消息与发送群聊消息的方法基本一致，详情请参考 [发送消息](message_send.html)。区别在于：发送消息话题中的消息时，需将 `conversationId` 设置为消息话题 ID，将 `conversationType` 设置为 `groupChat`，并设置 `isChatThread: true`。

消息发送成功后，消息话题成员可通过 `onMessage` 事件接收消息。消息话题所属群组的成员还可以通过消息话题相关事件感知消息话题状态更新。

示例代码如下：

```typescript
// 在消息话题中发送文本消息。
async function sendTextMessage() {
  const message = client.chatManager.createTextMessage({
    // 消息话题 ID。
    conversationId: 'chatThreadId',
    // 消息话题中的消息属于群聊消息。
    conversationType: 'groupChat',
    // 消息内容。
    content: 'message content',
    // 标记该消息为消息话题中的消息。
    isChatThread: true,
  });

  try {
    await client.chatManager.sendMessage(message);
    console.log('Send text message success.');
  } catch (e) {
    console.log('Send text message error.', e);
  }
}
```

## 接收消息话题中的消息

可以通过 `addEventHandler` 注册消息监听器接收消息，详情参考 [接收消息](message_receive.html)。SDK 中所有类型的消息统一通过 `onMessage` 回调接收。若收到的消息为消息话题中的消息，消息对象中的 `isChatThread` 为 `true`。

示例代码如下：

```typescript
// 监听收到的消息。
client.addEventHandler('thread-message', {
  onMessage: (message) => {
    if (message.isChatThread) {
      console.log('Received thread message:', message);
      console.log('Thread context:', message.chatThread);
      // 接收到消息话题中的消息，添加业务处理逻辑。
    }
  },
});
```

## 撤回消息话题中的消息

撤回消息话题中的消息与撤回群聊消息的方法基本一致，详情请参考 [撤回消息](message_recall.html)。在 SDK 中，撤回接口不需要传入 `isChatThread` 参数，你需要通过消息话题 ID 和 `groupChat` 会话类型定位消息话题中的消息。

消息话题成员可以通过 `onMessageRecalled` 事件监听消息撤回。

示例代码如下：

```typescript
try {
  const result = await client.chatManager.recallMessage({
    // 要撤回的消息服务端 ID。
    messageId: 'msgServerId',
    // 消息话题 ID。
    conversationId: 'chatThreadId',
    // 消息话题中的消息属于群聊消息。
    conversationType: 'groupChat',
  });
  console.log('Recall message success:', result);
} catch (error) {
  // 消息撤回失败，例如超过可撤回时间限制。
  console.log('Recall message failed:', error);
}

// 监听消息撤回事件。
client.addEventHandler('thread-message-recall', {
  onMessageRecalled: (event) => {
    if (event.conversationType === 'groupChat') {
      console.log('Thread message recalled:', event.messageId);
      // 接收到消息话题中的消息被撤回，添加业务处理逻辑。
    }
  },
});
```

## 从服务器获取单个消息话题的消息

调用 `client.chatManager.getHistoryMessages` 方法从服务器获取消息话题中的历史消息。获取消息话题中的历史消息与获取群聊历史消息的方法基本一致，区别在于 `conversationId` 需传入消息话题 ID，`conversationType` 设置为 `groupChat`。

```typescript
const result = await client.chatManager.getHistoryMessages({
  // 消息话题 ID。
  conversationId: 'chatThreadId',
  // 消息话题中的消息属于群聊消息。
  conversationType: 'groupChat',
  // 每页获取的消息数量。取值范围为 1-50，默认值为 20。
  pageSize: 20,
  // 分页游标。首次请求可不传，或在运行时传 `null` / `''`；后续请求传入上次返回结果中的 `cursor`。当返回的 `cursor` 为空字符串时，表示已到达最后一页。
  cursor: '',
  // 消息搜索方向：`up` 表示拉取更早的消息，`down` 表示拉取更新的消息。
  searchDirection: 'up',
});

console.log('Message list:', result.items);
console.log('Next cursor:', result.cursor);
console.log('Has more:', result.hasMore);
$([Environment]::NewLine)
```

## 接口列表

| API | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createTextMessage`](#发送消息话题中的消息) | `ChatManager` | 创建消息话题中的文本消息。创建时需设置 `conversationType` 为 `groupChat`，并设置 `isChatThread: true`。 |
| [`sendMessage`](#发送消息话题中的消息) | `ChatManager` | 发送消息话题中的消息。 |
| [`recallMessage`](#撤回消息话题中的消息) | `ChatManager` | 撤回消息话题中的消息。 |
| [`getHistoryMessages`](#从服务器获取单个消息话题的消息) | `ChatManager` | 从服务器获取指定消息话题中的历史消息。 |