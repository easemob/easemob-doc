# 转发消息

转发消息即将会话中发送成功或收到的消息转发给别人，例如，用户 A 向用户 B 发送了一条消息，用户 B 收到后，将其转发给用户 C。

环信即时通讯 IM 支持用户转发单条。

## 技术原理

环信即时通讯 IM Android SDK 通过 `ChatManager` 类和 `ChatMessage` 类实现消息的转发。

创建一条与原消息完全相同的消息，调用 `ChatManager#sendMessage` 方法转发消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 转发单条消息

你可以调用 `ChatMessage#setBody` 和 `ChatMessage#setExt` 方法通过传入原消息的消息体和扩展字段（若原消息有的话），创建一条与原消息完全相同的消息，然后调用 `ChatManager#sendMessage` 方法转发消息。

你可以在单聊、群组聊天、聊天室中转发所有类型的消息。对于附件类型的消息，转发时无需重新上传附件，不过，若消息过期（即由于超过了存储时间已从环信服务器上删除），转发后接收方可查看附件地址，但无法下载附件。

```TypeScript
// messageId 为要转发的消息 ID。
let messageId = "";
let targetMessage = ChatClient.getInstance().chatManager()?.getMessage(messageId);
if (!targetMessage) {
    return;
}
// to: 单聊为对端用户 ID，群聊为群组 ID，聊天室聊天为聊天室 ID。
let to = "the conversationId you want to send to";
let newMessage = ChatMessage.createSendMessage(targetMessage.getType());
newMessage.setTo(to);
let to = "the conversationId you want to send to";
// 使用原消息的 body 转发消息
let targetMessageBody = targetMessage.getBody();
//对于群聊或者聊天室，需要将 chatType 设置为 ChatType.GroupChat 或 ChatType.ChatRoom。
let newMessage = ChatMessage.createSendMessage(to, targetMessageBody, ChatType.Chat);

// 使用原消息的 ext
let ext = targetMessage.ext();
newMessage.setExt(ext);
ChatClient.getInstance().chatManager()?.sendMessage(newMessage);
```
