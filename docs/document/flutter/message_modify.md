# 修改消息

对于单聊或群聊会话中已经发送成功的消息，SDK 支持对这些消息进行修改，修改成功后会同步给会话中的接收方。

- 对于单聊会话，只有消息发送方才能对消息进行修改。
- 对于群聊会话，群主和群管理员除了可以修改自己发送的消息，还可以修改普通群成员发送的消息，而普通群成员只能修改自己发送的消息。

:::notice
1. 若使用该功能，需将 SDK 升级至 4.1.0 或以上版本。
2. 聊天室会话不支持消息修改功能。
:::

你可以调用 `EMChatManager#modifyMessage` 方法修改已经发送成功的消息, 目前只支持文本消息。一条消息默认最多可修改 10 次，若要提升修改次数，需联系商务。

示例代码如下：

```dart
try {
  // msgId: 需要修改消息的消息 ID。
  EMMessage modified = await EMClient.getInstance.chatManager.modifyMessage(
    messageId: msgId,
    msgBody: body,
  );
} on EMError catch (e) {}

```
消息修改后，消息的接收方会收到 `EMChatEventHandler#onMessageContentChanged` 事件，该事件中会携带修改后的消息对象、最新一次修改消息的用户以及消息的最新修改时间。对于群聊会话，除了修改消息的用户，群组内的其他成员均会收到该事件。

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