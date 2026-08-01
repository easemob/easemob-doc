# 转发消息

## 功能说明

转发消息是指将当前会话中发送成功或接收到的消息转发至其他会话。例如，用户 A 向用户 B 发送一条消息后，用户 B 可以将该消息转发给用户 C、群组或聊天室。

环信即时通讯 IM iOS SDK 支持以下转发方式：

 - **转发单条消息**：创建一条新消息，复用原消息的消息体和扩展字段，再将其发送至目标单聊、群聊、聊天室或消息话题。该方式支持文本、图片、音频、视频、文件、位置、自定义及合并消息等消息类型。
 - **转发多条消息**：将多条消息合并为一条合并消息，再发送至目标会话。接收方可以展开合并消息，查看其中包含的消息内容。详见 [发送合并消息](message_send.html#发送合并消息)。

转发操作会生成并发送一条新消息，新消息拥有独立的消息 ID、发送方、接收方和发送时间，不会改变原消息及其所在会话的数据。对于附件消息，SDK 可以复用原消息中的服务端附件地址，无需重新上传附件；若原附件已因超过存储期限从服务器删除，接收方将无法下载该附件。

## 前提条件

开始前，请确保满足以下条件：

 - 完成 SDK 初始化，详见[快速开始](quickstart.html)。
 - 了解环信即时通讯 IM 的使用限制，详见[使用限制](/product/limitation.html)。

## 转发单条消息

转发单条消息时，需要创建一条与原消息类型相同的新消息，复用原消息的 `body` 和 `ext`。完成目标会话及会话类型设置后，调用 `sendMessage` 发送新消息。

单条消息可以转发至单聊、群聊、聊天室或消息话题，支持文本、图片、音频、视频、文件、位置、自定义和合并消息等消息类型。

转发附件消息时，SDK 可以复用原消息的服务端附件地址，无需重新上传附件。如果附件因超过存储期限已从服务器删除，转发后的消息仍可包含原附件地址，但接收方将无法下载该附件。

:::tip
合并消息也可以作为单条消息直接转发。
:::

```objectivec
// messageId 为要转发的本地消息 ID。
NSString *messageId = @"messageId";
EMChatMessage *sourceMessage = [[EMClient sharedClient].chatManager getMessageWithMessageId:messageId];
if (!sourceMessage) {
    return;
}

// 单聊传入对端用户 ID，群聊传入群组 ID，聊天室传入聊天室 ID。
NSString *conversationId = @"conversationId";

// 使用原消息的 body 和 ext 创建新消息；新消息拥有独立的消息 ID。
EMChatMessage *forwardMessage = [[EMChatMessage alloc] initWithConversationID:conversationId
                                                                          body:sourceMessage.body
                                                                           ext:sourceMessage.ext];

// 默认单聊。转发至群聊或聊天室时，分别设置为 EMChatTypeGroupChat 或 EMChatTypeChatRoom。
forwardMessage.chatType = EMChatTypeGroupChat;

// 转发到消息话题时，将会话 ID 设置为话题 ID，并标记为话题消息。
// forwardMessage.isChatThreadMessage = YES;

// 发送转发后的新消息。
[[EMClient sharedClient].chatManager sendMessage:forwardMessage
                                        progress:nil
                                      completion:^(EMChatMessage *message, EMError *error) {
    if (!error) {
        // 转发成功。
    }
}];
```

## 转发多条消息

对于转发多条消息，环信即时通讯 IM 支持将多个消息合并在一起进行转发，详见[发送合并消息](message_send.html#发送合并消息)。

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`getMessageWithMessageId`](#转发单条消息) | `IEMChatManager` | 根据消息 ID 获取本地消息。 |
| [`initWithConversationID`](#转发单条消息) | `EMChatMessage` | 创建与原消息类型相同的待发送消息。 |
| [`body`](#转发单条消息) | `EMChatMessage` | 获取原消息的消息体。 |
| [`ext`](#转发单条消息) | `EMChatMessage` | 获取原消息的扩展字段。 |
| [`chatType`](#转发单条消息) | `EMChatMessage` | 设置新消息的会话类型。 |
| [`isChatThreadMessage`](#转发单条消息) | `EMChatMessage` | 设置新消息是否为消息话题消息。 |
| [`sendMessage`](#转发单条消息) | `IEMChatManager` | 发送转发消息。 |
