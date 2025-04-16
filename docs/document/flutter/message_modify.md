# 修改消息

你是否有过这样的经历：发送消息后发觉消息内容中包含错别字、遗漏了的关键、内容不够完善清晰、甚至临时想更改自己的想法。为解决这些需求，环信即时通讯 IM 提供修改消息功能，提高沟通效率和准确性。 

对于单聊、群组和聊天室聊天会话中已经发送成功的消息，SDK 支持对这些消息的内容进行修改。

若使用该功能，**需联系环信商务开通**。SDK 4.13.0 之前的版本仅支持对单聊和群组聊天中的发送后的文本消息进行修改，SDK 4.13.0 及之后的版本中新增修改各类会话中各类消息：

- 文本/自定义消息：支持修改消息内容（body）和扩展字段 `ext`。
- 文件/视频/音频/图片/位置/合并转发消息：只支持修改消息扩展字段 `ext`。
- 命令消息：不支持修改。

## 技术原理

### 消息修改流程

1. 用户调用 SDK 的 API 修改一条消息。
2. 服务端存储的该条消息，修改成功后回调给 SDK。
3. SDK 修改客户端上的该条消息。成功后，SDK 将修改后的消息回调给用户。

### 各类会话的消息修改权限

- 对于单聊会话，只有消息发送方才能对消息进行修改。
- 对于群聊会话，普通群成员只能修改自己发送的消息。群主和群管理员除了可以修改自己发送的消息，还可以修改普通群成员发送的消息。这种情况下，消息的发送方不变，消息体中的修改者的用户 ID 属性为群主或群管理员的用户 ID。

### 消息修改后的生命周期

修改消息没有时间限制，即只要这条消息仍在服务端存储就可以修改。消息修改后，消息生命周期（在服务端的保存时间）会重新计算，例如，消息可在服务器上保存 180 天，用户在消息发送后的第 30 天（服务器上的保存时间剩余 150 天）修改了消息，修改成功后该消息还可以在服务器上保存 180 天。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html) 及 [SDK 集成概述](overview.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

你可以调用 `EMChatManager#modifyMessage` 方法修改已经发送成功的消息。该方法会同时更新服务器和本地的消息。对于修改后的消息，消息体中除了内容变化，还新增了修改者的用户 ID、修改时间和修改次数属性。除消息体和消息扩展属性 `ext` 外，该消息的其他信息（例如，消息 ID、消息发送方、接收方）均不会发生变化。

**一条消息默认最多可修改 10 次。**

```dart
    // 文本消息：可同时修改消息体和消息扩展属性
    final txtBody = EMTextMessageBody(content: 'new content');
    final attributes = {
      'newKey': 'new value',
    };
    await EMClient.getInstance.chatManager.modifyMessage(
      messageId: messageId,
      msgBody: txtBody,
      attributes: attributes,
    );

    // 自定义消息：可同时修改消息体和消息扩展属性
    final customBody = EMCustomMessageBody(event: 'new event');
    final attributes = {
      'newKey': 'new value',
    };
    await EMClient.getInstance.chatManager.modifyMessage(
      messageId: messageId,
      msgBody: customBody,
      attributes: attributes,
    );

    // 文件/视频/音频/图片/位置/合并转发消息：只能修改消息扩展属性
    final attributes = {
      'newKey': 'new value',
    };
    await EMClient.getInstance.chatManager.modifyMessage(
      messageId: messageId,
      attributes: attributes,
    );

```
消息修改后，消息的接收方会收到 `EMChatEventHandler#onMessageContentChanged` 事件，该事件中会携带修改后的消息对象、最新一次修改消息的用户以及消息的最新修改时间。对于群聊会话，除了修改消息的用户，群组内的其他成员均会收到该事件。

:::tip
若通过 RESTful API 修改自定义消息，消息的接收方也通过 `EMChatEventHandler#onMessageContentChanged` 事件接收修改后的自定义消息。
:::

```dart
final handler = EMChatEventHandler(
  onMessageContentChanged: (message, operatorId, operationTime) {},
);

// 添加消息监听
EMClient.getInstance.chatManager.addEventHandler(
  "UNIQUE_HANDLER_ID",
  handler,
);
  ...

// 移除消息监听
EMClient.getInstance.chatManager.removeEventHandler("UNIQUE_HANDLER_ID");

```