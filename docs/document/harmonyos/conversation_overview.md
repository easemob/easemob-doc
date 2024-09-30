# 会话介绍

<Toc />

会话是一个单聊、群聊或者聊天室所有消息的集合。用户需在会话中发送消息、查看或清空历史消息等操作。

环信即时通讯 IM SDK 提供 `ChatManager` 和 `Conversation` 类以会话为单位对消息数据进行管理，如获取会话列表、删除会话和管理未读消息等。

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
| getLatestMessage      | 获取会话中的最新一条消息。       | 
| getLatestMessageFromOthers | 获取会话中收到的最新一条消息。       |      
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

```TypeScript
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






