# 会话介绍

会话是一个单聊、群聊或聊天室中的所有消息的集合。用户可在会话中发送消息、查看历史消息或清空历史消息等操作。

## 会话创建

#### 创建方式

- 方式一：通过发送消息创建会话：

  - 单聊会话：当两位用户之间发送消息时，即时通讯 IM 会自动创建一个单聊会话。创建后，双方可在该会话中进行消息收发。
  - 群组/聊天室会话：当群组或聊天室中有成员发送消息时，即时通讯 IM 会创建对应的群组或聊天室会话。两类会话功能相似，区别在于聊天室中的成员之间不存在固定关系。

- 方式二：通过获取会话信息时创建会话：

  调用 [getConversation](https://doc.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_chat_manager-p.html#a4c90e488c1701ef6fc7ee6d5939e5cde) 接口时，若将参数 `createIfNotExist` 设为 `YES`（默认值），即时通讯 IM 会在会话不存在时自动创建该会话。  

#### 会话 ID

创建会话时，即时通讯 IM 根据会话类型为其生成会话 ID：

- 单聊：使用对方用户的 ID。
- 群聊：使用群组 ID。
- 聊天室：使用聊天室 ID。

## 空会话

空会话指没有任何消息的会话。例如，当某个会话中的全部消息 [过期](/product/product_package_feature.html)、[清除](message_delete.html#删除本地指定会话的所有消息) 或 [撤回](message_recall.html) 后，该会话即成为空会话。

空会话相关的操作和管理与其他会话无异，例如，你可以 [从服务端获取会话列表时拉取空会话](conversation_list.html#从服务器分页获取会话列表)、[对空会话置顶](conversation_pin.html) 和 [添加标记](conversation_mark.html#标记会话)。

## 会话管理

环信即时通讯 IM SDK 提供 [IEMChatManager](https://doc.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_chat_manager-p.html) 类和 [EMConversation](https://doc.easemob.com/apidoc/ios/chat3.0/interface_e_m_conversation.html) 类进行会话和消息管理：

- 会话管理：[获取会话列表](conversation_list.html#从服务器分页获取会话列表)、[会话已读回执](conversation_receipt.html)、[会话未读数管理](conversation_receipt.html#会话已读回执和消息未读数)、[置顶会话](conversation_pin.html)、[添加会话标记](conversation_mark.html)、[删除会话](conversation_delete.html)。

- 消息管理：[获取会话中的消息](message_retrieve.html)、[清除会话的消息](message_delete.html#删除本地指定会话的所有消息)、[管理消息未读数](message_receipt.html#已读回执与未读消息数) 等。

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
| lastReceivedMessage    | 获取会话中收到的最新一条消息，即当前用户收到的对端用户发送的最新消息。     |
| insertMessage    | 插入一条消息在 SDK 本地数据库。消息的会话 ID 应与会话的 ID 保持一致。消息会根据消息里的时间戳被插入 SDK 本地数据库，SDK 会更新会话的 `EMChatMessage#latestMessage` 等属性。    |
| appendMessage   | 插入一条消息到 SDK 本地数据库会话尾部。消息的会话 ID 应该和目标会话的 ID 一致。消息会被插入 SDK 本地数据库，并且更新会话的 `EMChatMessage#latestMessage` 等属性。     |
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

```objectivec
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






