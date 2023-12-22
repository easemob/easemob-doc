# 会话介绍

<Toc />

会话是一个单聊、群聊或者聊天室所有消息的集合。用户需在会话中发送消息、查看或清空历史消息等操作。

环信即时通讯 IM SDK 提供 `ChatManager` 和 `ChatConversation` 类以会话为单位对消息数据进行管理，如获取会话列表、置顶会话、添加会话标记、删除会话和管理未读消息等。

## 会话类

环信即时通讯 IM 提供会话类 `ChatConversation`。该类定义了以下内容：

| 类/方法  | 描述         |
| :--------- | :------- | 
| ChatSearchDirection  | 消息搜索方向枚举。<br/> - `UP`：按照消息中的 Unix 时间戳的逆序搜索。<br/> - `DOWN`：按照消息中的时间戳的正序搜索。   |
| ChatConversationType  | 会话类型枚举。<br/> - `PeerChat`：单聊会话；<br/> - `GroupChat`：群聊会话；<br/> - `RoomChat`：聊天室会话。|
| convId  | 会话 ID，取决于会话类型。<br/> - 单聊：会话 ID 为对方的用户 ID；<br/> - 群聊：会话 ID 为群组 ID；<br/> - 聊天室：会话 ID 为聊天室的 ID。   |
| convType  | 会话类型。<br/> - `Chat`：单聊会话；<br/> - `GroupChat`：群聊会话；<br/> - `ChatRoom`：聊天室会话。 <br/> - `HelpDesk`：客服会话。     |
| isChatThread  | 是否为 thread 会话。   |
| ext  | 会话扩展属性。   |
| isPinned  | 是否为置顶会话。    |
| pinnedTime  | 会话置顶的 UNIX 时间戳，单位为毫秒。未置顶时值为 `0`。   |
| name   | 获取会话 ID。   |
| getUnreadCount  | 获取会话的未读消息数量。    |
| getMessageCount  | 获取会话中的消息数量。   |
| getLatestMessage  | 获取指定会话的最新消息。   |
| getLatestReceivedMessage  | 获取指定会话中最近接收到的消息。   |
| setConversationExtension  | 设置指定会话的自定义扩展信息。   |
| markMessageAsRead  | 标记指定消息为已读。   |
| markAllMessagesAsRead  | 标记所有消息为已读。   |
| updateMessage  | 更新本地数据库的指定消息。   |
| deleteMessage   | 删除本地数据库中的指定消息。    |
| deleteMessagesWithTimestamp  | 从本地数据库中删除指定时间段内的消息。   |
| deleteAllMessages  | 删除内存和本地数据库中的所有消息。   |
| getMessagesWithMsgType  | 从本地数据库获取会话中的指定用户发送的某些类型的消息。   |
| getMessages  | 从本地数据库获取指定会话中一定数量的消息。   |
| getMessagesWithKeyword  | 从本地数据库获取会话中的指定用户发送的一定数量的特定消息。   |
| getMessageWithTimestamp  | 从本地数据库获取指定会话在一段时间内的消息。   |
| fetchHistoryMessages  | 分页获取指定会话的历史消息。   |
| fetchHistoryMessagesByOptions  | 根据消息拉取参数配置从服务器分页获取指定会话的历史消息。   |
| removeMessagesFromServerWithMsgIds  | 根据消息 ID 单向删除漫游消息。   |
| removeMessagesFromServerWithTimestamp  | 根据消息时间戳单向删除漫游消息。   |
| pinConversation  | 置顶会话。   |


## 会话事件

`IEMChatManager` 类中提供会话事件的监听接口。开发者可以通过设置此监听，获取会话事件，并做出相应处理。如果不再使用该监听，需要移除，防止出现内存泄漏。

示例代码如下：

```typescript
ChatClient.getInstance().chatManager.addMessageListener({
  onConversationRead(from: string, to?: string): void {
    // 收到会话已读的事件。该事件在以下场景中触发：
    // 1. 当消息接收方调用 `sendConversationReadAck` 方法，SDK 会执行此回调，
    // 并将本地数据库中 `Message` 的 `hasReadAck` 置为 `true`.
    // 2. 多端多设备登录时，若一端发送会话已读回执（sendConversationReadAck），
    // 服务器端会将该会话的未读消息数置为 0，
    // 同时其他端会回调此方法，并将本地数据库中该会话中消息的 `hasRead` 属性置为 `true`。
  },
});
```






