# 设置推送扩展功能

你可以实现推送扩展功能，包括设置强制推送和发送静默消息。

## 强制推送

设置强制推送后，用户发送消息时会忽略接收方的免打扰设置，不论是否处于免打扰时间段都会正常向接收方推送消息。

```javascript
// 下面以文本消息为例，其他类型的消息设置方法相同。
const sendTextMsg = () => {
  let option: AgoraChat.CreateTextMsgParameters = {
    chatType: chatType,
    type: "txt",
    to: targetUserId,
    msg: msgContent,
    ext: {
      // 设置是否为强制推送，该字段为内置内置字段，取值如下：`YES`：强制推送；（默认）`NO`：非强制推送。
      em_force_notification: "YES"
    },
  };
  let msg = AC.message.create(option);
  connection.send(msg);
};
```

## 发送静默消息

发送静默消息指发送方在发送消息时设置不推送消息，即用户离线时，即时通讯 IM 服务不会通过推送服务向该用户的设备推送消息通知。因此，用户不会收到消息推送通知。当用户再次上线时，会收到离线期间的所有消息。

发送静默消息和免打扰模式下均为不推送消息，区别在于发送静默消息为发送方在发送消息时设置，而免打扰模式为接收方设置在指定时间段内不接收推送通知。

```javascript
// 下面以文本消息为例，其他类型的消息设置方法相同。
const sendTextMsg = () => {
  let option: AgoraChat.CreateTextMsgParameters = {
    chatType: chatType,
    type: "txt",
    to: targetUserId,
    msg: msgContent,
    ext: {
      // 设置是否发送静默消息。该字段为内置内置字段，取值如下：`YES`：发送静默消息；（默认）`NO`：推送该消息。 
      em_ignore_notification: "NO"
    },
  };
  let msg = AC.message.create(option);
  connection.send(msg);
};
```