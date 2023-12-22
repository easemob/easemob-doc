# 会话介绍

<Toc />

会话是一个单聊、群聊或者聊天室所有消息的集合。用户需在会话中发送消息、查看或清空历史消息等操作。

环信即时通讯 IM SDK 提供 `EMChatManager` 和 `EMConversation` 类以会话为单位对消息数据进行管理，如获取会话列表、置顶会话、添加会话标记、删除会话和管理未读消息等。

## 会话类

环信即时通讯 IM 提供会话类 `EMConversation`。该类定义了以下内容：

| 类/方法  | 描述         |
| :--------- | :------- | 
| EMConversationType | 会话类型枚举。<br/> - `Chat`：单聊会话；<br/> - `GroupChat`：群聊会话；<br/> - `ChatRoom`：聊天室会话。    |  
| EMSearchDirection   | 消息搜索方向枚举。<br/> - UP：按照消息中的 Unix 时间戳的逆序搜索。<br/> - DOWN：按照消息中的时间戳的正序搜索。      |     
| EMMarkType  | 会话标记枚举类型：MARK_0,MARK_1,MARK_2,MARK_3,MARK_4,MARK_5,MARK_6,MARK_7,MARK_8,MARK_9,MARK_10,MARK_11,MARK_12,MARK_13,MARK_14,MARK_15,MARK_16,MARK_17,MARK_18,MARK_19。     |    
| marks | 获取会话的所有标记。       |     
| conversationId      | 会话 ID，取决于会话类型。<br/> - 单聊：会话 ID 为对方的用户 ID；<br/> - 群聊：会话 ID 为群组 ID；<br/> - 聊天室：会话 ID 为聊天室的 ID。|     
| getType      | 获取会话类型。        |     
| getUnreadMsgCount   | 获取会话中未读的消息数量。       |     
| markAllMessagesAsRead   | 将所有未读消息设置为已读。       |    
| markMessageAsRead      | 设置指定消息为已读。       |   
| getAllMsgCount      | 获取 SDK 本地数据库中会话的全部消息数。       |   
| loadMoreMsgFromDB(String startMsgId, int pageSize)    | 从 SDK 本地数据库中分页加载消息。加载的消息会基于消息中的时间戳放入当前会话的缓存中，调用 `getAllMessages` 时会返回所有加载的消息。        |     
| loadMoreMsgFromDB(String startMsgId, int pageSize, EMSearchDirection direction)       | 从指定消息 ID 开始分页加载数据库中的消息。加载到的消息会加入到当前会话的消息中。       |      
| searchMsgFromDB(long timeStamp, int maxCount, EMSearchDirection direction)  | 基于 Unix 时间戳搜索本地数据库中的消息。       |      
| searchMsgFromDB(EMMessage.Type type, long timeStamp, int maxCount, String from, EMSearchDirection direction)      | 从本地数据库获取指定会话的一定数量的特定类型的消息。       |     
| searchMsgFromDB(String keywords, long timeStamp, int maxCount, String from, EMSearchDirection direction)      | 从本地数据库获取会话中的指定用户发送的包含特定关键词的消息。       |      
| searchMsgFromDB(long startTimeStamp, long endTimeStamp, int maxCount)      | 从本地数据库中搜索指定时间段内发送或接收的一定数量的消息。       | 
| searchCustomMsgFromDB(String keywords, long timeStamp, int maxCount, String from, EMSearchDirection direction)       | 从本地数据库获取会话中的指定用户发送的包含特定关键词的自定义消息。       |      
| getMessage      | 根据消息 ID 获取已读的消息。       | 
| getAllMessages      | 获取该会话当前内存中的所有消息。       | 
| removeMessage      | 删除本地数据库中的一条指定消息。       |      
| getLastMessage      | 获取会话中的最新一条消息。       | 
| getLatestMessageFromOthers | 获取会话中收到的最新一条消息。       |      
| clear      | 清除会话中的所有消息。只清除内存的，不清除本地数据库的消息。       | 
| clearAllMessages      | 清除内存和数据库中指定会话中的消息。       |      
| setExtField      | 设置会话的扩展字段。       | 
| getExtField      | 获取会话的扩展字段。       |      
| isPinned     | 获取会话的置顶状态。       | 
| getPinnedTime      | 获取会话置顶时间。会话置顶的 UNIX 时间戳，单位为毫秒。未置顶时值为 `0`。        |           
| insertMessage      | 在本地数据库的会话中插入一条消息。消息的会话 ID 应与会话的 ID 一致。消息会根据消息里的 Unix 时间戳插入本地数据库，SDK 会更新会话的 `latestMessage` 等属性。       |    
| updateMessage      | 更新本地数据库的指定消息。消息更新后，消息 ID 不会修改，SDK 会自动更新会话的 `latestMessage` 等属性。       |     
| `removeMessagesFromServer(List<String>, EMCallBack)`  | 根据消息 ID 单向删除漫游消息。       | 
| removeMessagesFromServer(long, EMCallBack)      | 根据时间单向删除漫游消息。       |
| removeMessages      | 从本地数据库中删除指定时间段内的消息。       |


## 会话事件

`EMConversationListener` 中提供会话事件的监听接口。开发者可以通过设置此监听，获取会话事件，并做出相应处理。如果不再使用该监听，需要移除，防止出现内存泄漏。

示例代码如下：

```java
EMConversationListener listener=new EMConversationListener() {
       // 收到会话已读的事件。该事件在以下场景中触发：
       // 1. 当消息接收方调用 `ackConversationRead()` 方法，SDK 会执行此回调，会将本地数据库中该会话中消息的 `isAcked` 属性置为 `true`。
       // 2. 多端多设备登录时，若一端发送会话已读回执（conversation ack），服务器端会将会话的未读消息数置为 0，同时其他端会回调此方法，并将本地数据库中该会话中消息的 `isRead` 属性置为 `true`。
        @Override
        public void onConversationRead(String from, String to) {
        }
    };
```






