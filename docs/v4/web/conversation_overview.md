# 会话介绍

会话是一个单聊、群聊或聊天室中的所有消息的集合。用户可在会话中发送消息、查看历史消息或清空历史消息等操作。

## 会话创建

#### 通过发送消息创建会话

  - 单聊会话：当两位用户之间发送消息时，即时通讯 IM 会自动创建一个单聊会话。创建后，双方可在该会话中进行消息收发。
  - 群组/聊天室会话：当群组或聊天室中有成员发送消息时，即时通讯 IM 会创建对应的群组或聊天室会话。两类会话功能相似，区别在于聊天室中的成员之间不存在固定关系。  

#### 会话 ID

创建会话时，即时通讯 IM 根据会话类型为其生成会话 ID：

- 单聊：使用对方用户的 ID。
- 群聊：使用群组 ID。
- 聊天室：使用聊天室 ID。

## 空会话

空会话指没有任何消息的会话。例如，当某个会话中的全部消息 [过期](/product/product_package_feature.html)、[清除](message_delete.html#删除本地指定会话的所有消息) 或 [撤回](message_recall.html) 后，该会话即成为空会话。

空会话相关的操作和管理与其他会话无异，例如，你可以 [从服务端获取会话列表时拉取空会话](conversation_list.html#从服务器分页获取会话列表)、[对空会话置顶](conversation_pin.html) 和 [添加标记](conversation_mark.html#标记会话)。


## 会话管理

环信即时通讯 IM SDK 提供会话相关 API 进行会话和消息管理：

- 会话管理：[获取会话列表](conversation_list.html#从服务器分页获取会话列表)、[会话已读回执](conversation_receipt.html)、[会话未读数管理](conversation_receipt.html#会话已读回执和消息未读数)、[置顶会话](conversation_pin.html)、[添加会话标记](conversation_mark.html)、[删除会话](conversation_delete.html)。

- 消息管理：[获取会话中的消息](message_retrieve.html)、[清除会话的消息](message_delete.html#删除本地指定会话的所有消息)、[管理消息未读数](message_receipt.html#已读回执与未读消息数) 等。

## 会话 API

环信即时通讯 IM 提供如下会话方法：

| 方法  | 描述         |
| :--------- | :------- | 
| getServerConversations  | 分页获取服务器会话列表。    |
| pinConversation  | 设置是否置顶会话。   |
| getServerPinnedConversations  | 分页获取服务器端的置顶会话列表。 |
| deleteConversation | 删除会话。  |
| getLocalConversations | 获取本地会话列表。 |
| getLocalConversation | 获取单个本地会话。 |
| removeLocalConversation | 删除单个本地会话。  |
| setLocalConversationCustomField | 设置本地会话自定义字段。 |
| clearConversationUnreadCount | 对本地会话的未读消息数清零。 |

## 会话事件

SDK 提供了会话已读事件 `onChannelMessage`，用户可以通过该事件，更新会话未读状态。

示例代码如下：

```javascript
conn.addEventHandler("handlerId", {
  onChannelMessage: (message) => {
    // 收到会话已读的事件。该事件在以下场景中触发：
    // 1. 当消息接收方调用 `send` 方法发送 `channel` 类型消息。SDK 会触发此回调。
    // 2. 多端多设备登录时，若一端发送会话已读回执（`send` 方法发送`channel`类型消息），
    // 服务器端会将该会话的未读消息数置为 0，同时其他端会触发此回调。
    console.log("收到会话已读回执消息", message.from, message.to);
  },
});

```






