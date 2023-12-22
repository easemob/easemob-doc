# 会话介绍

<Toc />

会话是一个单聊、群聊或者聊天室所有消息的集合。用户需在会话中发送消息、查看或清空历史消息等操作。

环信即时通讯 IM SDK 提供 `IEMChatManager` 和 `EMConversation` 类以会话为单位对消息数据进行管理，如获取会话列表、置顶会话、添加会话标记、删除会话和管理未读消息等。

## 会话类

环信即时通讯 IM 提供会话类 `EMConversation`。该类定义了以下内容：

| 类/方法  | 描述         |
| :--------- | :------- | 
| EMConversationType | 会话类型枚举。<br/> - `Chat`：单聊会话；<br/> - `GroupChat`：群聊会话；<br/> - `ChatRoom`：聊天室会话。 <br/> - `HelpDesk`：客服会话。    |  
| EMMarkType  | 会话标记枚举类型：EMMarkType0、EMMarkType1、EMMarkType2、EMMarkType3、EMMarkType4、EMMarkType5、EMMarkType6、EMMarkType7、EMMarkType8、EMMarkType9、EMMarkType10、EMMarkType11、EMMarkType12、EMMarkType13、EMMarkType14、EMMarkType15、EMMarkType16、EMMarkType16、EMMarkType17、EMMarkType18 和 EMMarkType19。     |  
| EMMessageSearchDirection  | 消息搜索方向枚举。<br/> - EMMessageSearchDirectionUp：按照消息中的 Unix 时间戳的逆序搜索。<br/> - EMMessageSearchDirectionDown：按照消息中的时间戳的正序搜索。      |   
| EMConversation    | 聊天会话类。     |
| conversationId   | 会话 ID，取决于会话类型。<br/> - 单聊：会话 ID 为对方的用户 ID；<br/> - 群聊：会话 ID 为群组 ID；<br/> - 聊天室：会话 ID 为聊天室的 ID。     |
| type    | 会话类型。     |
| messagesCount    | 会话中的消息数量。     |
| ext    | 会话扩展属性。     |
| isChatThread    | 是否为 thread 会话。     |
| isPinned    | 是否为置顶会话。       |
| pinnedTime    | 会话置顶的 UNIX 时间戳，单位为毫秒。未置顶时值为 `0`。    |
| marks    | 会话标记。     |
| lastReceivedMessage    | 收到的对方发送的最后一条消息。     |
| insertMessage    | 插入一条消息在 SDK 本地数据库。消息的会话 ID 应与会话的 ID 保持一致。消息会根据消息里的时间戳被插入 SDK 本地数据库，SDK 会更新会话的 `latestMessage` 等属性。    |
| appendMessage   | 插入一条消息到 SDK 本地数据库会话尾部。消息的会话 ID 应该和目标会话的 ID 一致。消息会被插入 SDK 本地数据库，并且更新会话的 `latestMessage` 等属性。     |
| deleteMessageWithId    | 从 SDK 本地数据库删除一条消息。     |
| deleteAllMessages    | 清除内存和数据库中指定会话中的消息。     |
| removeMessagesFromServerMessageIds    | 从会话中删除消息（包括本地存储和服务器存储）。     |
| removeMessagesFromServerWithTimeStamp    | 从会话中删除消息（包括本地存储和服务器存储）。     |
| updateMessageChange    | 更新 SDK 本地数据库的消息。      |
| markMessageAsReadWithId    | 将 SDK 本地数据库中的指定消息设置为已读。     |
| markAllMessagesAsRead    | 将 SDK 本地数据库所有未读消息设置为已读。    |
| loadMessageWithId    | 从 SDK 本地数据库获取指定 ID 的消息。     |
| loadMessagesStartFromId    | 从 SDK 本地数据库获取指定数量的消息。     |
| loadMessagesWithType    | 从本地数据库中获取会话中指定用户发送的一定数量的特定类型的消息。     |
| loadMessagesWithKeyword    | 从本地数据库获取会话中的指定用户发送的包含特定关键词的消息。      |
| loadCustomMsgWithKeyword    | 从本地数据库获取会话中的指定用户发送的包含特定关键词的自定义消息。     |
| loadMessagesFrom    | 从本地数据库中搜索指定时间段内发送或接收的一定数量的消息。     |
| removeMessagesStart    | 从本地数据库中删除指定时间段内的消息。     |

## 会话事件

`EMChatManagerDelegate` 中提供会话事件的监听接口。开发者可以通过设置此监听，获取会话事件，并做出相应处理。如果不再使用该监听，需要移除，防止出现内存泄漏。

示例代码如下：

```Objective-C
// 收到会话已读的事件。该事件在以下场景中触发：
// 1. 当消息接收方调用 `ackConversationRead()` 方法，SDK 会执行此回调，
// 会将本地数据库中该会话中消息的 `isAcked` 属性置为 `true`。
// 2. 多端多设备登录时，若一端发送会话已读回执（conversation ack），
// 服务器端会将会话的未读消息数置为 0，
// 同时其他端会回调此方法，并将本地数据库中该会话中消息的 `isRead` 属性置为 `true`。
- (void)onConversationRead:(NSString *)from to:(NSString *)to
{
    
}
```






