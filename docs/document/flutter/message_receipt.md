# 消息回执

<Toc />

单聊会话支持消息送达回执、会话已读回执和消息已读回执，发送方发送消息后可及时了解接收方是否及时收到并阅读了信息，也可以了解整个会话是否已读。

群聊会话只支持消息已读回执。群成员在发送消息时，可以设置该消息是否需要已读回执。仅专业版及以上版本支持群消息已读回执功能。若要使用该功能，需在[环信即时通讯云控制台](https://console.easemob.com/user/login)开通，具体费用详见[产品价格](/product/pricing.html#增值服务费用)。

:::tip
仅单聊消息支持送达回执，群聊消息不支持。
:::

本文介绍如何使用环信即时通讯 IM Flutter SDK 实现单聊和群聊的消息回执功能。

## 技术原理

环信即时通讯 IM Flutter SDK 通过 `EMChatManager` 类提供消息的送达回执和已读回执功能。核心方法如下：

- `EMOptions.requireDeliveryAck` 送达回执的全局开关；
- `EMOptions.requireAck` 已读回执的全局开关；
- `EMChatManager.sendConversationReadAck` 发送会话的已读回执；
- `EMChatManager.sendMessageReadAck` 发送单聊消息的已读回执；
- `EMChatManager.sendGroupMessageReadAck` 发送群组消息的已读回执；

实现送达和已读回执的逻辑分别如下：

- 消息送达回执

  1. 消息发送方在发送消息前通过 `EMOptions.requireDeliveryAck` 开启送达回执功能。
  2. 消息接收方收到消息后，SDK 自动向发送方触发送达回执。
  3. 消息发送方通过监听 `onMessageDelivered` 回调接收消息送达回执。

- 会话及消息已读回执

  1. 消息发送方在发送消息前通话 `EMOptions.requireAck` 开启已读回执功能。
  2. 消息接收方收到或阅读消息后，调用 API `SendConversationReadAck` 或 `SendMessageReadAck` 发送会话或消息已读回执。
  3. 消息发送方通过监听 `onConversationRead` 或 `onMessagesRead` 回调接收会话或消息已读回执。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 群消息已读回执功能仅在环信 IM 专业版及以上版本支持该功能。若要使用该功能，需在[环信即时通讯云控制台](https://console.easemob.com/user/login)开通，具体费用详见[产品价格](/product/pricing.html#增值服务费用)。

## 实现方法

### 消息送达回执

1. 发送方开启全局送达回执。当接收方收到消息后，SDK 底层会自动进行消息送达回执。

```dart
// sdk app key
String appKey = "appKey";
// 开启消息送达回执
bool requireDeliveryAck = true;
EMOptions options = EMOptions(
  appKey: appKey,
  requireDeliveryAck: requireDeliveryAck,
);
await EMClient.getInstance.init(options);
```

2. 发送方监听事件 `onMessagesDelivered` 回调，收到接收方的送达回执。

```dart
// 添加监听器
EMClient.getInstance.chatManager.addEventHandler(
  "UNIQUE_HANDLER_ID",
  EMChatEventHandler(
    onMessagesDelivered: (list) => {},
  ),
);
```

### 消息和会话的已读回执

消息已读回执用于告知单聊或群聊中的用户接收方已阅读其发送的消息。为降低消息已读回执方法的调用次数，SDK 还支持在单聊中使用会话已读回执功能，用于获知接收方是否阅读了会话中的未读消息。

#### 单聊

单聊既支持消息已读回执，也支持会话已读回执。我们建议你按照如下逻辑结合使用两种回执结合使用，减少发送消息已读回执数量。

- 聊天页面未打开时，若有未读消息，进入聊天页面，发送会话已读回执；
- 聊天页面打开时，若收到消息，发送消息已读回执。

##### 会话已读回执

参考如下步骤在单聊中实现会话已读回执。

1. 开启全局的消息已读回执开关。如果全局设置不开启，消息和会话的相应设置也无法生效。

```dart
EMOptions options = EMOptions(
  appKey: appKey,
  requireAck: true,
);
EMClient.getInstance.init(options);
```

2. 接收方执行会话已读回执操作。进入会话页面，查看会话中是否有未读消息。若有，发送会话已读回执，没有则不再发送。

```dart
String convId = "convId";
try {
  await EMClient.getInstance.chatManager.sendConversationReadAck(convId);
} on EMError catch (e) {

}
```

3. 发送方监听 `onConversationRead` 回调，接收会话已读回执。

```dart
EMClient.getInstance.chatManager.addEventHandler(
  "UNIQUE_HANDLER_ID",
  EMChatEventHandler(
    onConversationRead: (from, to) => {},
  ),
);
```

> 同一用户 ID 登录多设备的情况下，用户在一台设备上发送会话已读回执，服务器会将会话的未读消息数置为 `0`，同时其他设备会收到 `onConversationRead` 回调。

##### 消息已读回执

单聊消息的已读回执有效期与消息在服务端的存储时间一致，即在服务器存储消息期间均可发送已读回执。消息在服务端的存储时间与你订阅的套餐包有关，详见[产品价格](/product/pricing.html#套餐包功能详情)。 

参考如下步骤在单聊中实现消息已读回执。

1. 开启全局的消息已读回执开关。如果全局设置不开启，消息和会话的相应设置也无法生效。

```dart
EMOptions options = EMOptions(
  appKey: "appKey",
  requireAck: true,
);
EMClient.getInstance.init(options);
```

2. 消息发送方监听 `onMessagesRead` 事件。

```dart
EMClient.getInstance.chatManager.addEventHandler(
  "UNIQUE_HANDLER_ID",
  EMChatEventHandler(
    onMessagesRead: (list) => {},
  ),
);
```

3. 消息接收方发送已读回执

```dart
try {
  EMClient.getInstance.chatManager.sendMessageReadAck(msg);
} on EMError catch (e) {

}
```

### 群聊

对于群聊，群成员发送消息时，可以设置该消息是否需要已读回执。若需要，每个群成员在阅读消息后，SDK 均会发送已读回执，即阅读该消息的群成员数量即为已读回执的数量。群聊已读回执的有效期为 3 天，即群组中的消息发送时间超过 3 天，服务器不记录阅读该条消息的群组成员，也不会发送已读回执。

群消息已读回执特性的使用限制如下表所示：

| 使用限制| 默认 | 描述 | 
| :--------- | :----- | :------- | 
| 功能开通   | 关闭   | 若要使用该功能，你需要在[环信即时通讯云控制台](https://console.easemob.com/user/login)的**即时通讯** > **功能配置** > **功能配置总览**> **基础功能**页签下，搜索找到 **消息已读回执（群聊）** 开通功能。具体费用详见[产品价格](/product/pricing.html#增值服务费用)。   | 
| 使用权限  | 所有群成员    | 默认情况下，所有群成员发送消息时可要求已读回执。如果仅需群主和群管理员发消息时要求已读回执，可联系商务修改。   | 
| 已读回执有效期    | 3 天    | 群聊已读回执的有效期为 3 天，即群组中的消息发送时间超过 3 天，服务器不记录阅读该条消息的群组成员，也不会发送已读回执。   | 
| 群规模    |  200 人   | 该特性最大支持 200 人的群组。如果超过 200 人/群，群成员发送的消息不会返回已读回执。你可以联系商务提升群成员上限。 | 
| 查看返回已读回执数量    | 消息发送方 | 对消息返回的已读回执数量（或返回已读回执的人数），默认仅消息发送方可查看。如需所有群成员均可查看，可联系商务开通。 | 

你可以按以下步骤实现群消息已读回执特性：

1. 消息发送方需要知道群组消息是否已读，需要监听 `onGroupMessageRead` 事件。

```dart
EMClient.getInstance.chatManager.addEventHandler(
  "UNIQUE_HANDLER_ID",
  EMChatEventHandler(
    onGroupMessageRead: (list) => {},
  ),
);
```

2. 群成员发送消息时若需已读回执，需设置 `needGroupAck` 为 `true`。

```dart
// 设置消息类型为群消息
msg.chatType = ChatType.GroupChat;
    // 设置本条消息需要群消息回执
msg.needGroupAck = true;
try {
  await EMClient.getInstance.chatManager.sendMessage(msg);
} on EMError catch (e) {

}
```

3. 群组里面的接收方收到消息，调用 `sendGroupMessageReadAck` 告知消息发送方消息已读。成功发送后，消息发送方会收到 `onGroupMessageRead` 回调。

```dart
try {
  EMClient.getInstance.chatManager.sendGroupMessageReadAck(msgId, groupId);
} on EMError catch (e) {
  // 发送群消息已读失败，错误代码：e.code，错误描述：e.description
}
```
