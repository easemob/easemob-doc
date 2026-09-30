# 会话介绍

会话是一个单聊、群聊或聊天室中的所有消息的集合。用户可在会话中发送消息、查看历史消息或清空历史消息等操作。

## 会话创建

#### 创建方式

- 方式一：通过发送消息创建会话：

  - 单聊会话：当两位用户之间发送消息时，即时通讯 IM 会自动创建一个单聊会话。创建后，双方可在该会话中进行消息收发。
  - 群组/聊天室会话：当群组或聊天室中有成员发送消息时，即时通讯 IM 会创建对应的群组或聊天室会话。两类会话功能相似，区别在于聊天室中的成员之间不存在固定关系。

- 方式二：通过获取会话信息时创建会话：

  调用 [getConversation](https://doc.easemob.com/apidoc/harmony/chat3.0/classes/ChatManager.ChatManager.html#getConversation) 接口时，若将参数 `createIfNotExist` 设为 `true`（默认值），即时通讯 IM 会在会话不存在时自动创建该会话。  

#### 会话 ID

创建会话时，即时通讯 IM 根据会话类型为其生成会话 ID：

- 单聊：使用对方用户的 ID。
- 群聊：使用群组 ID。
- 聊天室：使用聊天室 ID。

## 空会话

空会话指没有任何消息的会话。例如，当某个会话中的全部消息 [过期](/product/product_package_feature.html)、[清除](message_delete.html#删除本地指定会话的所有消息) 或 [撤回](message_recall.html) 后，该会话即成为空会话。

空会话相关的操作和管理与其他会话无异，例如，你可以 [从服务端获取会话列表时拉取空会话](conversation_list.html#从服务器分页获取会话列表)、[对空会话置顶](conversation_pin.html) 和 [添加标记](conversation_mark.html#标记会话)。


## 会话管理

环信即时通讯 IM SDK 提供 [ChatManager](https://doc.easemob.com/apidoc/harmony/chat3.0/classes/ChatManager.ChatManager.html) 类和 [Conversation](https://doc.easemob.com/apidoc/harmony/chat3.0/modules/Conversation.html) 类进行会话和消息管理：

- 会话管理：[获取会话列表](conversation_list.html#从服务器分页获取会话列表)、[会话已读回执](conversation_receipt.html)、[会话未读数管理](conversation_receipt.html#会话已读回执和消息未读数)、[置顶会话](conversation_pin.html)、[添加会话标记](conversation_mark.html)、[删除会话](conversation_delete.html)。

- 消息管理：[获取会话中的消息](message_retrieve.html)、[清空历史消息](message_delete.html#清空聊天记录)、[管理消息未读数](message_receipt.html#已读回执与未读消息数) 等。

## 会话类

环信即时通讯 IM 提供会话类 `Conversation`。该类定义了以下内容：

| 类/方法  | 描述         |
| :--------- | :------- | 
| ConversationType | 会话类型枚举。<br/> - `Chat`：单聊会话；<br/> - `GroupChat`：群聊会话；<br/> - `ChatRoom`：聊天室会话。    |  
| SearchDirection   | 消息搜索方向枚举。<br/> - UP：按照消息中的 Unix 时间戳的逆序搜索。<br/> - DOWN：按照消息中的时间戳的正序搜索。      |
| MarkType  | 会话标记枚举类型：MARK_0,MARK_1,MARK_2,MARK_3,<br/>MARK_4,MARK_5,MARK_6,MARK_7,MARK_8,<br/>MARK_9,MARK_10,MARK_11,MARK_12,<br/>MARK_13,MARK_14,MARK_15,<br/>MARK_16,MARK_17,MARK_18,MARK_19。     |      
| conversationId      | 会话 ID，取决于会话类型。<br/> - 单聊：会话 ID 为对方的用户 ID；<br/> - 群聊：会话 ID 为群组 ID；<br/> - 聊天室：会话 ID 为聊天室的 ID。|     
| getType      | 获取会话类型。        |     
| getUnreadMsgCount   | 获取会话中未读的消息数量。       |     
| markAllMessagesAsRead   | 将所有未读消息设置为已读。       |    
| markMessageAsRead      | 设置指定消息为已读。       |   
| getAllMsgCount      | 获取 SDK 本地数据库中会话的全部消息数。       |
| getMsgCountInRange      | 获取 SDK 本地数据库中会话某个时间段内的全部消息数。       |      
| loadMoreMessagesFromDB(startMsgId: string, pageSize: number, direction?: SearchDirection)    | 从指定消息 ID 开始分页加载数据库中的消息。       |      
| searchMessagesFromDB(timestamp: number, maxCount: number, direction?: SearchDirection)  | 基于 Unix 时间戳搜索本地数据库中的消息。       |      
| searchMessagesByType(type: ContentType | `Array<ContentType>`, timestamp: number, maxCount: number, from?: string, direction: SearchDirection)      | 从本地数据库获取指定会话的一定数量的特定类型的消息。       |     
| searchMessagesByKeywords(keywords: string, timestamp: number, maxCount: number, from?: string, direction?: SearchDirection)      | 从本地数据库获取会话中的指定用户发送的包含特定关键词的消息。       |      
| searchMessagesBetweenTime(startTimestamp: number, endTimestamp: number, maxCount: number)      | 从本地数据库中搜索指定时间段内发送或接收的一定数量的消息。       | 
| getMessage      | 根据消息 ID 获取已读的消息。       | 
| removeMessage      | 删除本地数据库中的一条指定消息。       |      
| getLatestMessage      | 获取会话中的最新一条消息。该消息可能是当前用户发送的，也可能是对端用户发送。  | 
| getLatestMessageFromOthers | 获取会话中收到的最新一条消息，即当前用户收到的对端用户发送的最新消息。 |      
| clearAllMessages      | 清除内存和数据库中指定会话中的消息。       |      
| setExtField      | 设置会话的扩展字段。       | 
| getExtField      | 获取会话的扩展字段。       |      
| insertMessage      | 在本地数据库的会话中插入一条消息。消息的会话 ID 应与会话的 ID 一致。消息会根据消息里的 Unix 时间戳插入本地数据库，SDK 会更新会话的 `latestMessage` 等属性。       |    
| updateMessage      | 更新本地数据库的指定消息。消息更新后，消息 ID 不会修改，SDK 会自动更新会话的 `latestMessage` 等属性。       |     
| marks | 获取会话的所有本地标记。       | 
| pushRemindType | 从本地获取会话的推送提醒类型。如果本地没有则默认返回 `ALL`。       | 


## 会话事件

`ConversationListener` 中提供会话事件的监听接口。开发者可以通过设置此监听，获取会话事件，并做出相应处理。如果不再使用该监听，需要移除，防止出现内存泄漏。

示例代码如下：

```typescript
let listener: ConversationListener = {
    // 收到会话已读的事件。该事件在以下场景中触发：
    // 1. 当消息接收方调用 `ackConversationRead()` 方法，SDK 会执行此回调，
    // 会将本地数据库中该会话中消息的 `isReceiverRead` 属性置为 `true`。
    // 2. 多端多设备登录时，若一端发送会话已读回执（conversation ack），
    // 服务器端会将会话的未读消息数置为 0，
    // 同时其他端会回调此方法，并将本地数据库中该会话中消息的 `isUnread` 属性置为 `false`。
    onConversationRead: (from: string, to: string): void => {
        
    }
};
```






