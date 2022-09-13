# 消息管理–从服务器获取会话和消息（消息漫游）

本文介绍用户如何从消息服务器获取会话和消息，该功能也称为消息漫游，指即时通讯服务将用户的历史消息保存在 Chat 服务器上，用户即使切换终端设备，也能从服务器获取到单聊、群聊和聊天室的历史消息，保持一致的会话场景。

## 实现原理

使用环信即时通讯 IM React Native SDK 可以通过 `ChatManager` 类的以下方法从服务器获取历史消息：

- `getConversationsFromServer` 获取服务器保存的会话列表；
- `fetchHistoryMessages` 获取服务器保存的指定会话中的消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 从服务器获取消息

当你切换设备或新加入群时，可以从服务器拉取历史消息。

#### 从服务器获取会话

该功能需联系商务开通，开通后，用户默认可拉取 7 天内的 10 个会话（每个会话包含最新一条历史消息），如需调整会话数量或时间限制请联系商务。

调用 `getConversationsFromServer` 从服务端获取会话。我们建议在 app 安装时，或本地没有会话时调用该 API。否则调用 `loadAllConversations` 即可。示例代码如下：

```typescript
ChatClient.getInstance()
  .chatManager.getConversationsFromServer()
  .then(() => {
    console.log("load conversions success");
  })
  .catch((reason) => {
    console.log("load conversions fail.", reason);
  });
```

#### 分页获取指定会话的历史消息

你还可以从服务器分页获取指定会话的历史消息，实现消息漫游功能。为确保数据可靠，我们建议你多次调用该方法，且每次获取的消息数小于 50 条。获取到数据后，SDK 会自动将消息更新到本地数据库。

```typescript
// 会话 ID
const convId = "convId";
// 会话类型。详见 `ChatConversationType` 枚举类型。
const convType = ChatConversationType.PeerChat;
// 获取的最大消息数目
const pageSize = 10;
// 搜索的起始消息 ID
const startMsgId = "";
ChatClient.getInstance()
  .chatManager.fetchHistoryMessages(convId, chatType, pageSize, startMsgId)
  .then((messages) => {
    console.log("get message success: ", messages);
  })
  .catch((reason) => {
    console.log("load conversions fail.", reason);
  });
```

### 更多操作

你可以参考如下文档，在项目中实现更多的消息相关功能：

- [消息概述](message_overview.html);
- [发送和接收消息](message_send_receive.html)；
- [管理本地消息数据](message_manage.html)；
- [获取消息的已读回执和送达回执](message_receipt)；
- [实现翻译功能](message_translation)。