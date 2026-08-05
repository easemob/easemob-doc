# 定向消息

## 功能说明

发送定向消息是指向群组或聊天室的单个或多个指定成员发送消息，其他成员不会收到该消息。

## 使用限制

- **支持消息类型：** 适用于文本、图片、语音、视频等各类消息。
- **接收人数限制：** 每条定向消息最多可指定群组或聊天室中的 20 名成员接收。
- **会话列表与未读数：** 定向消息不会写入服务端会话列表，也不计入服务端会话的未读消息数。
- **群组消息漫游：** 群组定向消息默认不支持漫游。如需使用，需联系环信商务开通。
- **聊天室消息漫游：** 聊天室定向消息默认不支持漫游。如需使用，需联系环信商务同时开通聊天室消息漫游和定向消息漫游功能。

## 发送定向消息

发送定向消息的流程与发送普通消息相似，唯一区别在于发送前需要调用 `EMMessage#setReceiverList` 设置定向接收方列表。具体操作如下：

1. 创建一条群组或聊天室消息。
2. 设置消息的接收方列表。
3. 发送定向消息。

下面以文本消息为例介绍如何发送定向消息：

```java
// 创建一条群组文本消息。
EMMessage message = EMMessage.createTextSendMessage(
        "这条消息只有指定的成员能看到",
        groupId);

// 群聊和聊天室分别设置为 GroupChat 和 ChatRoom。
message.setChatType(EMMessage.ChatType.GroupChat);

List<String> receivers = new ArrayList<>();
receivers.add("user1");
receivers.add("user2");

// 设置定向接收方列表，最多可传入 20 个成员的用户 ID。
// 若传入 null，则消息发送给群组或聊天室的所有成员。
message.setReceiverList(receivers);

EMClient.getInstance()
        .chatManager()
        .sendMessage(message);
```

接收定向消息与接收普通消息的操作相同，详见 [接收消息](message_receive.html)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createTextSendMessage`](#发送定向消息) | `EMMessage` | 创建文本消息。 |
| [`sendMessage`](#发送定向消息) | `EMChatManager` | 发送定向消息。 |
