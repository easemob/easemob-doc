# 会话介绍

会话是一个单聊、群聊或聊天室中的所有消息的集合。用户可在会话中发送消息、查看历史消息或清空历史消息等操作。

## 会话创建

#### 创建方式

- 方式一：通过发送消息创建会话：

  - 单聊会话：当两位用户之间发送消息时，即时通讯 IM 会自动创建一个单聊会话。创建后，双方可在该会话中进行消息收发。
  - 群组/聊天室会话：当群组或聊天室中有成员发送消息时，即时通讯 IM 会创建对应的群组或聊天室会话。两类会话功能相似，区别在于聊天室中的成员之间不存在固定关系。

- 方式二：通过获取会话信息时创建会话：

  调用 [getConversation](https://doc.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_chat_manager.html#aa18a33432d743061e642f229cc218b83) 接口时，若将参数 `createIfNotExists` 设为 `true`（默认值），即时通讯 IM 会在会话不存在时自动创建该会话。  

#### 会话 ID

创建会话时，即时通讯 IM 根据会话类型为其生成会话 ID：

- 单聊：使用对方用户的 ID。
- 群聊：使用群组 ID。
- 聊天室：使用聊天室 ID。

## 空会话

空会话指没有任何消息的会话。例如，当某个会话中的全部消息 [过期](/product/product_package_feature.html)、[清除](message_delete.html#删除本地指定会话的所有消息) 或 [撤回](message_recall.html) 后，该会话即成为空会话。

空会话相关的操作和管理与其他会话无异，例如，你可以 [从服务端获取会话列表时拉取空会话](conversation_list.html#从服务器分页获取会话列表)、[对空会话置顶](conversation_pin.html) 和 [添加标记](conversation_mark.html#标记会话)。

## 会话管理

环信即时通讯 IM SDK 提供 [EMChatManager](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_chat_manager.html) 类和 [EMConversation](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conversation.html) 类进行会话和消息管理：

- 会话管理：[获取会话列表](conversation_list.html#从服务器分页获取会话列表)、[会话已读回执](conversation_receipt.html)、[会话未读数管理](conversation_receipt.html#会话已读回执和消息未读数)、[置顶会话](conversation_pin.html)、[添加会话标记](conversation_mark.html)、[删除会话](conversation_delete.html)。

- 消息管理：[获取会话中的消息](message_retrieve.html)、[清除会话的消息](message_delete.html#删除本地指定会话的所有消息)、[管理消息未读数](message_receipt.html#已读回执与未读消息数) 等。

## 会话类

环信即时通讯 IM 提供会话类 [EMConversation](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conversation.html)。该类定义了以下内容：

| 类/方法  | 描述         |
| :--------- | :------- | 
| EMConversationType | 会话类型枚举。<br/> - `Chat`：单聊会话；<br/> - `GroupChat`：群聊会话；<br/> - `ChatRoom`：聊天室会话。    |  
| EMSearchDirection   | 消息搜索方向枚举。<br/> - UP：按照消息中的 Unix 时间戳的逆序搜索。<br/> - DOWN：按照消息中的时间戳的正序搜索。      |     
| EMMarkType  | 会话标记枚举类型：MARK_0,MARK_1,MARK_2,MARK_3,<br/>MARK_4,MARK_5,MARK_6,MARK_7,MARK_8,<br/>MARK_9,MARK_10,MARK_11,MARK_12,<br/>MARK_13,MARK_14,MARK_15,<br/>MARK_16,MARK_17,MARK_18,MARK_19。     |    
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
| getLastMessage      | 获取会话中的最新一条消息。该消息可能是当前用户发送的，也可能是对端用户发送。  | 
| getLatestMessageFromOthers | 获取会话中收到的最新一条消息，即当前用户收到的对端用户发送的最新消息。 |      
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
       // 1. 当消息接收方调用 `ackConversationRead()` 方法，SDK 会执行此回调，
       // 会将本地数据库中该会话中消息的 `isAcked` 属性置为 `true`。
       // 2. 多端多设备登录时，若一端发送会话已读回执（conversation ack），
       // 服务器端会将会话的未读消息数置为 0，
       // 同时其他端会回调此方法，并将本地数据库中该会话中消息的 `isRead` 属性置为 `true`。
        @Override
        public void onConversationRead(String from, String to) {
        }
    };
```






