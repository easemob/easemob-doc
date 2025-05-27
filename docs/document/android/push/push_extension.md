# 设置推送扩展功能

你可以利用扩展字段实现自定义推送设置，本文以强制推送和发送静默消息为例介绍如何实现推送扩展功能。

对于推送扩展字段，详见[离线推送扩展字段文档](/document/server-side/push_extension.html)。

## 设置自定义推送字段

创建推送消息时，可以在消息中添加自定义字段，实现自定义推送设置。

```java
// 下面以文本消息为例，附件等类型的消息设置方法相同。
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("message content");
// 设置要发送的用户 ID。
message.setTo("toChatUsername");
// 设置自定义推送扩展。
JSONObject emPushExt = new JSONObject() {
   {
        put("custom", new JSONObject() {
            {
                put("key1", "value1");
                put("key2", "value2");
            }
        });
    }
};
// 将推送扩展设置到消息中。
message.setAttribute("em_push_ext", emPushExt);
// 设置消息体。
message.addBody(txtBody);
// 设置消息回调。
message.setMessageStatusCallback(new CallBack() {...});
// 发送消息。
EMClient.getInstance().chatManager().sendMessage(message);
```

自定义字段的数据结构如下：

```json
{
    "em_push_ext": {
        "custom": {
            "key1": "value1",
            "key2": "value2"
        }
    }
}
```

| 参数             | 描述               |
| :--------------- | :----------------- |
| `em_push_ext`    | 消息推送扩展固定值，不可修改。 |
| `custom`         | 消息扩展，使用扩展的方式向推送中添加自定义字段，该值为固定值。 |
| `key1`/`key2`    | 自定义消息推送扩展的具体内容。 |

应用端解析自定义字段，参见 [解析收到的推送字段](push_parsing.html)。

## 强制推送

设置强制推送后，用户发送消息时会忽略接收方的免打扰设置，不论是否处于免打扰时间段都会正常向接收方推送消息。

```java
// 下面以文本消息为例，图片、文件等类型的消息设置方法相同。
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("test");
// 设置接收方：单聊为对端用户的用户 ID；群聊为群组 ID；聊天室聊天为聊天室 ID。
message.setTo("toChatUsername");
// 设置是否为强制推送，该字段为内置扩展字段：`true`：强制推送；（默认）`false`：非强制推送。
message.setAttribute("em_force_notification", true);
// 设置消息回调。
message.setMessageStatusCallback(new CallBack() {...});
// 发送消息。
EMClient.getInstance().chatManager().sendMessage(message);
```

## 发送静默消息

发送静默消息指发送方在发送消息时设置不推送消息，即用户离线时，环信即时通讯 IM 服务不会通过第三方厂商的消息推送服务向该用户的设备推送消息通知。因此，用户不会收到消息推送通知。当用户再次上线时，会收到离线期间的所有消息。

发送静默消息和免打扰模式下均为不推送消息，区别在于发送静默消息为发送方在发送消息时设置，而免打扰模式为接收方设置在指定时间段内不接收推送通知。

```java
// 下面以文本消息为例，图片、文件等类型的消息设置方法相同。
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("test");
// 设置接收方：单聊为对端用户的用户 ID；群聊为群组 ID；聊天室聊天为聊天室 ID。
message.setTo("toChatUsername");
// 设置是否发送静默消息。该字段为内置扩展字段：`true`：发送静默消息；（默认）`false`：推送该消息。
message.setAttribute("em_ignore_notification", true);
// 设置消息回调。
message.setMessageStatusCallback(new CallBack() {...});
// 发送消息。
EMClient.getInstance().chatManager().sendMessage(message);
```


