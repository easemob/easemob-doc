# 会话介绍

<Toc />

会话是一个单聊、群聊或者聊天室所有消息的集合。用户需在会话中发送消息、查看或清空历史消息等操作。

环信即时通讯 IM SDK 提供 `IChatManager` 和 `Conversation` 类以会话为单位对消息数据进行管理，如获取会话列表、置顶会话、添加会话标记、删除会话和管理未读消息等。

## 会话类

环信即时通讯 IM 提供会话类 `Conversation`。该类定义了以下内容：

| 类/方法  | 描述         |
| :--------- | :------- | 
| Id   | 会话 ID，取决于会话类型。<br/> - 单聊：会话 ID 为对方的用户 ID；<br/> - 群聊：会话 ID 为群组 ID；<br/> - 聊天室：会话 ID 为聊天室的 ID。  |
| Type    | 会话类型。<br/> - `Chat`：单聊会话；<br/> - `Group`：群聊会话；<br/> - `Room`：聊天室会话。 <br/> - `HelpDesk`：客服会话。         |
| IsThread   | 判断该会话是否为子区会话。         |
| IsPinned | 判断该会话是否被置顶。         |
| PinnedTime   | 会话置顶时间戳（毫秒）。如果 `IsPinned` 为 `false`，将返回 `0`。         |
| LastMessage  | 获取指定会话的最新消息。该方法的调用不影响会话的未读消息数。 SDK 首先从内存中获取最新消息，若在内存中未找到，则从数据库中加载，然后将其存放在内存中。 |
| LastReceivedMessage   | 获取指定会话中收到的最新消息。          |
| Ext       | 获取指定会话的扩展信息。         |
| UnReadCount       | 获取指定会话的未读消息数。         |
| MarkMessageAsRead  | 设置指定消息为已读。         |
| MarkAllMessageAsRead  | 将指定会话的所有未读消息设置为已读。        |
| InsertMessage        | 在本地数据库的指定会话中插入一条消息。         |
| AppendMessage        | 在本地数据库中指定会话的尾部插入一条消息。         |
| UpdateMessage        | 更新本地数据库的指定消息。         |
| DeleteMessage        | 删除本地数据库中的一条指定消息。         |
| DeleteMessages       | 删除本地数据库中指定时间段的消息。         |
| DeleteAllMessages    | 删除指定会话中所有消息。         |
| LoadMessage          | 加载指定消息。SDK 首先在内存中查找消息，若在内存中未找到，SDK 会在本地数据库查询并加载。         |
| LoadMessagesWithMsgType        | 加载特定类型的多条消息。SDK 首先在内存中查询消息，若在内存中未找到，SDK 会在本地数据库查询并加载。         |
| LoadMessages         |  从指定消息 ID 开始加载消息。        |
| LoadMessagesWithKeyword        | 根据关键字加载消息。SDK 首先在内存中查找消息，若在内存中未找到，SDK 会在本地数据库查询并加载。         |
| LoadMessagesWithTime        | 加载指定时间段内的消息。         |
| MessagesCount       | 获取 SDK 本地数据库中会话的全部消息数目。         |


## 会话事件

`IChatManagerDelegate` 中提供会话事件的监听接口。开发者可以通过设置此监听，获取会话事件，并做出相应处理。如果不再使用该监听，需要移除。

示例代码如下：

```csharp
public class ChatManagerDelegate : IChatManagerDelegate {
        // 收到会话已读回调
        public void OnConversationRead(string from, string to)
        {

        }
}

// 注册会话监听回调。
ChatManagerDelegate adelegate = new ChatManagerDelegate();
SDKClient.Instance.ChatManager.AddChatManagerDelegate(adelegate);

// 移除会话监听回调。
SDKClient.Instance.ChatManager.RemoveChatManagerDelegate(adelegate);

```






