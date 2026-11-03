# 定向消息

## 功能说明

发送定向消息是指向群组或聊天室的单个或多个指定成员发送消息，其他成员不会收到该消息。

## 使用限制

- **支持消息类型**：适用于文本、图片、语音、视频等各类消息。
- **接收人数限制**：每条定向消息最多可指定群组或聊天室中的 20 名成员接收。
- **会话列表与未读数**：定向消息不会写入服务端会话列表，也不计入服务端会话的未读消息数。
- **群组消息漫游**：群组定向消息默认不支持漫游。如需使用，需联系环信商务开通。
- **聊天室消息漫游**：聊天室定向消息默认不支持漫游。如需使用，需联系环信商务同时开通聊天室消息漫游和定向消息漫游功能。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 发送定向消息

发送定向消息的流程与发送普通消息相似，唯一区别在于发送前需要通过 `ChatMessage#receiverList` 设置定向接收方列表。具体操作如下：

1. 创建一条群组或聊天室消息。
2. 设置消息的定向接收方列表，类型为 `string[]`。
3. 调用 `ChatManager#sendMessage` 发送定向消息，通过发送状态回调获取最终结果。

下面以群组文本消息为例介绍如何发送定向消息：

```typescript
const message = ChatMessage.createTextMessage(
  '<group_id>',
  '这条消息只有指定的成员能看到',
  ChatMessageChatType.GroupChat
);

// 群聊和聊天室分别使用 GroupChat 和 ChatRoom
// 聊天室消息的目标 ID 应为聊天室 ID
message.receiverList = ['<member_user_id_1>', '<member_user_id_2>'];

// 不设置 receiverList 表示发送给群组或聊天室的全部成员
ChatClient.getInstance().chatManager.sendMessage(message, {
  onSuccess: (sentMessage) => {
    console.log('定向消息发送成功：', sentMessage.msgId);
  },
  onError: (localMsgId, error) => {
    console.error('发送失败：', localMsgId, error.code, error.description);
  },
}).catch((error: unknown) => {
  console.error('发起发送失败：', error);
});
```

`sendMessage` 返回的 `Promise<void>` 用于报告调用错误，最终发送结果以回调为准。接收定向消息与接收普通消息的操作相同，详见 [接收消息](message_receive.html)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createTextMessage`](#发送定向消息) | `ChatMessage` | 创建文本消息。 |
| [`receiverList`](#发送定向消息) | `ChatMessage` | 设置定向接收方用户 ID 列表。 |
| [`sendMessage`](#发送定向消息) | `ChatManager` | 发送定向消息。 |
