# 转发消息

转发消息即将会话中发送成功或收到的消息转发给别人，例如，用户 A 向用户 B 发送了一条消息，用户 B 收到后，将其转发给用户 C。

环信即时通讯 IM 支持用户转发单条或多条消息。

## 技术原理

环信即时通讯 IM Android SDK 通过 `EMChatManager` 类和 `EMMessage` 类实现消息的转发。

- 转发单条消息：创建一条与原消息完全相同的消息，调用 `EMChatManager#sendMessage` 方法转发消息。
- 转发多条消息：通过[发送合并消息](message_send_receive.html#发送和接收合并消息)实现。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 转发单条消息

你可以调用 `EMMessage#addBody` 和 `EMMessage#setAttribute` 方法通过传入原消息的消息体和扩展字段（若原消息有的话），创建一条与原消息完全相同的消息，然后调用 `EMChatManager#sendMessage` 方法转发消息。

你可以在单聊、群组聊天、聊天室以及子区中转发所有类型的消息。对于附件类型的消息，转发时无需重新上传附件，不过，若消息过期（即由于超过了存储时间已从环信服务器上删除），转发后接收方可查看附件地址，但无法下载附件。

:::tip
该功能也支持转发单条合并消息。
:::

```java
// messageId 为要转发的消息 ID。
String messageId = "";
EMMessage targetMessage = EMClient.getInstance().chatManager().getMessage(messageId);
// to: 单聊为对端用户 ID，群聊为群组 ID，聊天室聊天为聊天室 ID。
String to = "the conversationId you want to send to";
EMMessage newMessage = EMMessage.createSendMessage(targetMessage.getType());
newMessage.setTo(to);
//聊天类型默认为单聊。对于群聊或者聊天室，需要将 chatType 设置为 EMMessage.ChatType.GroupChat 或 EMMessage.ChatType.ChatRoom。
//newMessage.setChatType(EMMessage.ChatType.GroupChat);

// 使用原消息的 body 和 ext 创建转发消息
EMMessageBody targetMessageBody = targetMessage.getBody();
newMessage.addBody(targetMessageBody);
Map<String, Object> ext = targetMessage.ext();
//遍历 ext
if (ext != null) {
    for (Map.Entry<String, Object> entry : ext.entrySet()) {
        Object value = entry.getValue();
        if (value instanceof Long) {
            newMessage.setAttribute(entry.getKey(), (long) value);
        } else if (value instanceof Integer) {
            newMessage.setAttribute(entry.getKey(), (int) value);
        } else if (value instanceof String) {
            newMessage.setAttribute(entry.getKey(), (String) value);
        } else if (value instanceof Boolean) {
            newMessage.setAttribute(entry.getKey(), (boolean) value);
        } else if (value instanceof Double) {
            newMessage.setAttribute(entry.getKey(), (double) value);
        } else if (value instanceof Float) {
            newMessage.setAttribute(entry.getKey(), (float) value);
        } else if (value instanceof JSONArray) {
            newMessage.setAttribute(entry.getKey(), (JSONArray) value);
        } else if (value instanceof JSONObject) {
            newMessage.setAttribute(entry.getKey(), (JSONObject) value);
        }
    }
}
EMClient.getInstance().chatManager().sendMessage(newMessage);
```

### 转发多条消息

对于转发多条消息，环信即时通讯 IM 支持将多个消息合并在一起进行转发，详见[发送合并消息](message_send_receive.html#发送和接收合并消息)。








