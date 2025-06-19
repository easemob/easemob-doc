# 定向消息

发送定向消息是指向群组或聊天室的单个或多个指定的成员发送消息，其他成员不会收到该消息。

该功能适用于文本消息、图片消息和音视频消息等全类型消息，最多可向群组或聊天室的 20 个成员发送定向消息。

:::tip
1. 仅 SDK 1.2.0 及以上版本支持该功能。
2. 定向消息不写入服务端会话列表，不计入服务端会话的未读消息数。
3. 群组定向消息的漫游功能默认关闭，使用前需联系商务开通。
4. 聊天室定向消息的漫游功能默认关闭，使用前需联系商务开通聊天室消息漫游和定向消息漫游功能。
:::

发送定向消息的流程与发送普通消息相似，唯一区别是需要设置消息的接收方，具体操作如下：

1. 创建一条群组或聊天室消息。
2. 设置消息的接收方。
3. 发送定向消息。

下面以文本消息为例介绍如何发送定向消息，示例代码如下：

```typescript
const content = "This is text message";
msg = ChatMessage.createTextMessage(targetId, content, chatType);
msg.receiverList = ["001", "002"];
ChatClient.getInstance().chatManager.sendMessage(msg, {
  onSuccess: () => {},
  onError: () => {},
} as ChatMessageStatusCallback);
```

接收群定向消息与接收普通消息的操作相同，详见[接收消息](message_receive.html#接收文本消息)。