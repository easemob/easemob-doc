# 设置推送扩展功能

你可以在发送消息时通过消息扩展字段实现推送扩展功能，包括设置强制推送和发送静默消息。

## 强制推送

设置强制推送后，用户发送消息时可以忽略接收方的免打扰设置，不论接收方是否处于免打扰时间段，服务端都会正常向接收方发送离线推送通知。

```typescript
// 下面以文本消息为例，其他类型的消息设置方法相同。
const message = client.chatManager.createTextMessage({
  conversationId: 'targetUserId',
  conversationType: 'singleChat',
  content: 'message content',
  ext: {
    // 设置否强制推送。
    // `YES` 表示强制推送；不传或传 `NO` 表示按普通推送规则处理。
    em_force_notification: 'YES',
  },
});

await client.chatManager.sendMessage(message);
```

## 发送静默消息

发送静默消息指发送方在发送消息时设置不推送该消息。用户离线时，即时通讯 IM 服务不会通过推送服务向该用户的设备推送消息通知，因此用户不会收到该消息的推送通知。当用户再次上线时，仍会收到离线期间的消息。

发送静默消息和免打扰模式下均为不推送消息，区别在于发送静默消息为发送方在发送消息时设置，而免打扰模式为接收方设置在指定时间段内不接收推送通知。

```typescript
// 下面以文本消息为例，其他类型的消息设置方法相同。
const message = client.chatManager.createTextMessage({
  conversationId: 'targetUserId',
  conversationType: 'singleChat',
  content: 'message content',
  ext: {
    // 设置是否发送静默消息。该字段为服务端约定字段：
    // `true`：发送静默消息；`false` 或不传：按普通消息推送逻辑处理。
    em_ignore_notification: true,
  },
});

await client.chatManager.sendMessage(message);
```
