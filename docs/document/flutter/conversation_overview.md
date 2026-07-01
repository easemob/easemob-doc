# 会话介绍

会话是一个单聊、群聊或聊天室中的所有消息的集合。用户可在会话中发送消息、查看历史消息或清空历史消息等操作。

## 会话创建

#### 创建方式

- 方式一：通过发送消息创建会话：

  - 单聊会话：当两位用户之间发送消息时，即时通讯 IM 会自动创建一个单聊会话。创建后，双方可在该会话中进行消息收发。
  - 群组/聊天室会话：当群组或聊天室中有成员发送消息时，即时通讯 IM 会创建对应的群组或聊天室会话。两类会话功能相似，区别在于聊天室中的成员之间不存在固定关系。

- 方式二：通过获取会话信息时创建会话：

  调用 [getConversation](https://doc.easemob.com/apidoc/flutter/im_flutter_sdk/EMChatManager/getConversation.html) 接口时，若将参数 `createIfNeed` 设为 `true`(默认值)，即时通讯 IM 会在会话不存在时自动创建该会话。  

#### 会话 ID

创建会话时，即时通讯 IM 根据会话类型为其生成会话 ID：

- 单聊：使用对方用户的 ID。
- 群聊：使用群组 ID。
- 聊天室：使用聊天室 ID。

## 空会话

空会话指没有任何消息的会话。例如，当某个会话中的全部消息 [过期](/product/product_package_feature.html)、[清除](message_delete.html#删除本地指定会话的所有消息) 或 [撤回](message_recall.html) 后，该会话即成为空会话。

空会话相关的操作和管理与其他会话无异，例如，你可以 [从服务端获取会话列表时拉取空会话](conversation_list.html#从服务器分页获取会话列表)、[对空会话置顶](conversation_pin.html) 和 [添加标记](conversation_mark.html#标记会话)。

## 会话管理

环信即时通讯 IM SDK 提供 [EMChatManager](https://doc.easemob.com/apidoc/flutter/im_flutter_sdk/EMChatManager-class.html) 类和 [EMConversation](https://doc.easemob.com/apidoc/flutter/im_flutter_sdk/EMConversation-class.html) 类进行会话和消息管理：

- 会话管理：[获取会话列表](conversation_list.html#从服务器分页获取会话列表)、[会话已读回执](conversation_receipt.html)、[会话未读数管理](conversation_receipt.html#会话已读回执和消息未读数)、[置顶会话](conversation_pin.html)、[添加会话标记](conversation_mark.html)、[删除会话](conversation_delete.html)。

- 消息管理：[获取会话中的消息](message_retrieve.html)、[清除历史消息](message_delete.html#删除本地指定会话的所有消息)、[管理消息未读数](message_receipt.html#已读回执与未读消息数) 等。

## 会话类

环信即时通讯 IM 提供会话类 `EMConversation`。该类定义了以下内容：

| 方法  | 描述         |
| :--------- | :------- |
| id      | 会话 ID，取决于会话类型。<br/> - 单聊/help desk：会话 ID 为对方的用户 ID；<br/> - 群聊：会话 ID 为群组 ID；<br/> - 聊天室：会话 ID 为聊天室的 ID。|
| type | 会话类型枚举。<br/> - `Chat`：单聊会话；<br/> - `GroupChat`：群聊会话；<br/> - `ChatRoom`：聊天室会话。 <br/> - `HelpDesk`：客服会话。    |
| isChatThread      | 是否为消息话题会话。        | 
| isPinned     | 是否为置顶会话。       |
| pinnedTime  | 会话置顶的 UNIX 时间戳，单位为毫秒。未置顶时值为 `0`。   |
| setExt  | 获取会话扩展属性。    |
| latestMessage  | 获取会话中的最新一条消息。该消息可能是当前用户发送的，也可能是对端用户发送。       |
| lastReceivedMessage  | 获取会话中收到的最新一条消息，即当前用户收到的对端用户发送的最新消息。    |
| unreadCount  | 获取会话的消息未读数。     |
| markMessageAsRead  | 将消息标为已读。    |
| markAllMessagesAsRead  | 将所有消息标为已读。    |
| insertMessage  | 插入一条消息在 SDK 本地数据库，消息的 conversation ID 应该和会话的 conversation ID 一致，消息会根据消息里的时间戳被插入 SDK 本地数据库，并且更新会话的 `latestMessage` 等属性。    |
| appendMessage  | 插入一条消息到会话尾部。    |
| updateMessage  | 更新 SDK 本地数据库的消息。    |
| deleteMessage(String messageId)  | 删除会话中的一条消息，同时清除内存和数据库中的消息。    |
| deleteAllMessages()  | 同时从内存和本地数据库中删除会话中的所有消息。     |
| deleteMessagesWithTs  | 从本地数据库中删除指定时间段内的消息。    |
| loadMessage  | 获取指定 ID 的消息。优先从内存中加载，如果内存中没有则从数据库中加载，并将其插入到内存中。     |
| loadMessagesWithMsgType  | 根据消息类型、搜索消息的时间点、搜索结果的最大条数、搜索来源和搜索方向从 SDK 本地数据库中搜索指定数量的消息。    |
| loadMessages  | 从本地数据库加载消息。加载到的消息也会加入到当前会话的缓存中，通过 getAllMessages 方法将会返回所有加载的消息。|
| loadMessagesWithKeyword  | 根据消息中的关键词、搜索消息的时间点、搜索结果的最大条数、搜索来源和搜索方向从 SDK 本地数据库中搜索指定数量的消息。     |
| loadMessagesFromTime  | 加载一个时间段内的消息，不超过 `count` 参数指定的最大数量。    |

## 会话事件

`EMConversationListener` 中提供会话事件的监听接口。开发者可以通过设置此监听，获取会话事件，并做出相应处理。如果不再使用该监听，需要移除，防止出现内存泄漏。

示例代码如下：

```dart

EMClient.getInstance.chatManager.addEventHandler(
      sdkEventKey,
      EMChatEventHandler(
      // 收到会话已读的事件。该事件在以下场景中触发：
       // 1. 当消息接收放调用 `sendConversationReadAck` 方法，SDK 会执行此回调，
       // 并将本地数据库中 `Message` 的 `hasReadAck` 置为 `true`.
       // 2. 多端多设备登录时，若一端发送会话已读回执（sendConversationReadAck），
       // 服务器端会将该会话的未读消息数置为 0，
       // 同时其他端会回调此方法，并将本地数据库中该会话中消息的 `hasRead` 属性置为 `true`。
        onConversationRead: (from, to) {}, 
      ),
);

```






