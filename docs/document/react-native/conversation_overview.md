# 会话介绍

会话是一个单聊、群聊或聊天室中的所有消息的集合。用户可在会话中发送消息、查看历史消息或清空历史消息等操作。

## 会话创建

#### 创建方式

- 方式一：通过发送消息创建会话：

  - 单聊会话：当两位用户之间发送消息时，即时通讯 IM 会自动创建一个单聊会话。创建后，双方可在该会话中进行消息收发。
  - 群组/聊天室会话：当群组或聊天室中有成员发送消息时，即时通讯 IM 会创建对应的群组或聊天室会话。两类会话功能相似，区别在于聊天室中的成员之间不存在固定关系。

- 方式二：通过获取会话信息时创建会话：

  调用 [getConversation](https://doc.easemob.com/apidoc/rn/classes/ChatManager.html#getConversation) 接口时，若将参数 `createIfNeed` 设为 `true`（默认值），即时通讯 IM 会在会话不存在时自动创建该会话。  

#### 会话 ID

创建会话时，即时通讯 IM 根据会话类型为其生成会话 ID：

- 单聊：使用对方用户的 ID。
- 群聊：使用群组 ID。
- 聊天室：使用聊天室 ID。

## 空会话

空会话指没有任何消息的会话。例如，当某个会话中的全部消息 [过期](/product/product_package_feature.html)、[清除](message_delete.html#删除本地指定会话的所有消息) 或 [撤回](message_recall.html) 后，该会话即成为空会话。

空会话相关的操作和管理与其他会话无异，例如，你可以 [从服务端获取会话列表时拉取空会话](conversation_list.html#从服务器分页获取会话列表)、[对空会话置顶](conversation_pin.html) 和 [添加标记](conversation_mark.html#标记会话)。

## 会话管理

环信即时通讯 IM SDK 提供 [ChatManager](https://doc.easemob.com/apidoc/rn/classes/ChatManager.html) 类和 [ChatConversation](https://doc.easemob.com/apidoc/rn/classes/ChatConversation.html) 类进行会话和消息管理：

- 会话管理：[获取会话列表](conversation_list.html#从服务器分页获取会话列表)、[会话已读回执](conversation_receipt.html)、[会话未读数管理](conversation_receipt.html#会话已读回执和消息未读数)、[置顶会话](conversation_pin.html)、[添加会话标记](conversation_mark.html)、[删除会话](conversation_delete.html)。

- 消息管理：[获取会话中的消息](message_retrieve.html)、[清除会话的消息](message_delete.html#删除本地指定会话的所有消息)、[管理消息未读数](message_receipt.html#已读回执与未读消息数) 等。

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
| getLatestReceivedMessage  | 获取会话中的最新一条消息。该消息可能是当前用户发送的，也可能是对端用户发送。 |
| setConversationExtension  | 获取会话中收到的最新一条消息，即当前用户收到的对端用户发送的最新消息。 |
| markMessageAsRead  | 标记指定消息为已读。   |
| markAllMessagesAsRead  | 标记所有消息为已读。   |
| updateMessage  | 更新本地数据库的指定消息。   |
| deleteMessage   | 删除本地数据库中的指定消息。    |
| deleteMessagesWithTimestamp  | 从本地数据库中删除指定时间段内的消息。   |
| deleteAllMessages  | 删除内存和本地数据库中的所有消息。   |
| getConvMsgsWithMsgType  | 从本地数据库获取会话中的指定用户发送的某些类型的消息。   |
| getMsgs  | 从本地数据库获取指定会话中一定数量的消息。   |
| getMsgsWithKeyword  | 从本地数据库获取会话中的指定用户发送的一定数量的特定消息。   |
| getMsgWithTimestamp  | 从本地数据库获取指定会话在一段时间内的消息。   |
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






