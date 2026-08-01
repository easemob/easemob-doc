# 定向消息

## 功能说明

发送定向消息是指向群组或聊天室的单个或多个指定的成员发送消息，其他成员不会收到该消息。

## 使用限制

- **支持消息类型：** 适用于文本、图片、语音、视频等各类消息。
- **接收人数限制：** 每条定向消息最多可指定群组或聊天室中的 20 名成员接收。
- **会话列表与未读数：** 定向消息不会写入服务端会话列表，也不计入服务端会话的未读消息数。
- **群组消息漫游：** 群组定向消息默认不支持漫游。如需使用，需联系环信商务开通。
- **聊天室消息漫游：** 聊天室定向消息默认不支持漫游。如需使用，需联系环信商务同时开通聊天室消息漫游和定向消息漫游功能。

## 发送定向消息

发送定向消息的流程与发送普通消息相似，唯一区别在于创建消息时需要设置定向接收方列表 `receiverList`。

下面以文本消息为例介绍，示例代码如下：

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: 'group1',
  // 会话类型：群聊和聊天室分别为 `groupChat` 和 `chatRoom`。
  conversationType: 'groupChat',
  content: '这条消息只有指定的人能看到',
  // 消息的接收方列表。最多可传 20 个接收方的用户 ID。若不设置该字段或传入数组类型之外的值，如字符串，则消息发送给群组或聊天室的所有成员。
  receiverList: ['user1', 'user2', 'user3'],
});

await client.chatManager.sendMessage(message);
```

`receiverList` 参数说明如下：

- `receiverList` 属于消息创建消息的参数，不是 `sendMessage` 的回调选项。
- `receiverList` 需为非空字符串数组；若不设置，则发送普通群消息。

接收定向消息与接收普通消息的操作相同，详见 [各类消息的接收描述](message_receive.html)。


## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| `createTextMessage` | `ChatManager` | 创建一条定向消息。 |