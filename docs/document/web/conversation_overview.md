# 会话介绍

<Toc />

会话包含单聊会话、群聊会话。用户可与在会话中发送消息、查看或清空历史消息等操作。

环信即时通讯 IM SDK 提供会话相关 API，如获取会话列表、置顶会话、添加会话标记、删除会话等。

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
    // 2. 多端多设备登录时，若一端发送会话已读回执（`send` 方法发送`channel`类型消息），服务器端会将该会话的未读消息数置为 0，同时其他端会触发此回调。
    console.log("收到会话已读回执消息", message.from, message.to);
  },
});

```






