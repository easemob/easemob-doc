# 实现会话已读回执

<Toc />

会话已读回执指接收方进入指定会话后就阅读了该会话中的所有未读消息。例如，当接收方进入会话页面，向服务器发送会话已读回执，服务器将该回执下发给发送方，并将接收方的指定会话的未读消息数置为 0。

目前，只有单聊支持会话已读回执。本文介绍如何使用环信即时通讯 IM Web SDK 实现会话已读回执功能。
    
例如，你可以实现下图所示的效果。 

![img](@static/images/uikit/chatuikit/feature/web/conversation/conversation_read.png) 

## 技术原理

单聊会话已读回执实现的流程如下：

1. 消息接收方收到消息后，调用 `send` 发送会话已读回执。

2. 消息发送方通过监听 `onChannelMessage` 回调接收会话已读回执。

## 前提条件

开始前，请确保满足以下要求：

- 已经集成和初始化环信 IM SDK，并实现了注册账号和登录功能。详情请参见 [快速开始](quickstart.html)。
- 了解 [使用限制](/product/limitation.html) 中的 API 调用频率限制。

## 实现方法

1. 接收方发送会话已读回执。

消息接收方进入会话页面，查看会话中是否有未读消息。若有，调用 `send` 方法发送会话已读回执，没有则不再发送。

若会话中存在多条未读消息，建议发送会话已读回执，因为若发送消息已读回执，则需要调用多次。

```javascript
let option = {
  chatType: "singleChat", // 会话类型，设置为单聊。
  type: "channel", // 消息类型。channel 表示会话已读回执。
  to: "userId", // 接收消息对象的用户 ID。
};
let msg = WebIM.message.create(option);
conn.send(msg);
```

2. 消息发送方在 `onChannelMessage` 回调中收到会话已读回执。

同一用户 ID 登录多设备的情况下，用户在一台设备上发送会话已读回执，服务器会将会话的未读消息数置为 0，同时其他设备会收到 `onChannelMessage` 回调。

```javascript
conn.addEventHandler("customEvent", {
  onChannelMessage: (message) => {},
});
```

## 会话已读回执和消息未读数

- 对于单聊会话，接收方发送会话已读回执后，服务器会将该会话的未读数置为 0。若你开启了本地存储，则需要调用 `clearConversationUnreadCount` 方法，清空本地会话的未读数。

- 对于群聊会话，你可以调用以下接口发送已读回执，清空指定群组会话的未读数。与单聊会话不同，对于群聊会话来说，调用以下接口只会清空群组会话的未读数，不会触发 `onChannelMessage` 回调。

```javascript
let option = {
  chatType: "groupChat", // 会话类型，设置为群聊。
  type: "channel", // 消息类型。channel 表示会话已读回执。
  to: "groupId", // 接收消息对象的用户 ID。
};
let msg = WebIM.message.create(option);
conn.send(msg);
```
