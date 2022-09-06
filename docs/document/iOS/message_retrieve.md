# 消息管理–从服务器获取消息（消息漫游）

[[toc]]

本文介绍用户如何从消息服务器获取会话和消息，该功能也称为消息漫游，指即时通讯服务将用户的历史消息保存在消息服务器上，用户即使切换终端设备，也能从服务器获取到单聊、群聊的历史消息，保持一致的会话场景。

## 技术原理

使用环信即时通讯 IM iOS SDK 可以从服务器获取会话和历史消息。

- `getConversationsFromServer` 获取在服务器保存的会话列表；
- `asyncFetchHistoryMessagesFromServer` 获取服务器保存的指定会话中的消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 从服务器获取会话

该功能需联系商务开通，开通后，用户默认可拉取 7 天内的 10 个会话（每个会话包含最新一条历史消息），如需调整会话数量或时间限制请联系商务。

调用 `getConversationsFromServer` 从服务端获取会话。我们建议在 app 安装时，或本地没有会话时调用该 API。否则调用 `LoadAllConversations` 即可。示例代码如下：

```objectivec
[[EMClient sharedClient].chatManager getConversationsFromServer:^(NSArray *aCoversations, EMError *aError) {
   if (!aError) {
      for (EMConversation *conversation in aCoversations) {
        // conversation 会话解析。
      }
   }
}];
```

### 分页获取指定会话的历史消息

从服务器分页获取指定会话的历史消息（消息漫游）。你可以指定消息查询方向，即明确按时间顺序或逆序获取。建议每次获取少于 50 条消息，可多次获取。拉取后默认 SDK 会自动将消息更新到本地数据库。

```objectivec
 [[EMClient.sharedClient].chatManager asyncFetchHistoryMessagesFromServer:conversation.conversationId conversationType:conversation.type startMessageId:self.moreMsgId pageSize:10 completion:^(EMCursorResult *aResult, EMError *aError) {
             [self.conversation loadMessagesStartFromId:self.moreMsgId count:10 searchDirection:EMMessageSearchDirectionUp completion:block];
          }];
```

## 更多操作

你可以参考如下文档，在项目中实现更多的消息相关功能：

- [发送和接收消息](message_send_receive.html)
- [管理本地消息数据](message_manage.html)
- [获取消息的已读回执和送达回执](message_receipt.html)
- [实现翻译功能](message_translation.html)