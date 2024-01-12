# 会话列表

<Toc />

对于单聊、群组聊天和聊天室会话，用户发消息时 SDK 会自动创建会话并将会话添加至用户的会话列表。

环信服务器和本地均存储会话，你可以获取会话列表。**服务器默认存储 100 条会话，可存储 7 天。若提升这两个上限，需联系环信商务。**

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

环信即时通讯 IM 支持从服务器和本地获取会话列表，主要方法如下：

- `ChatManager.fetchConversationsFromServerWithCursor`：从服务器获取会话列表。
- `ChatManager.getAllConversationsBySort`：获取本地所有会话。

## 实现方法

### 从服务器分页获取会话列表

你可以调用 `fetchConversationsFromServerWithCursor` 方法从服务端分页获取会话列表，包含单聊和群组聊天会话，不包含聊天室会话。SDK 按照会话活跃时间（会话的最新一条消息的时间戳）的倒序返回会话列表，每个会话对象中包含会话 ID、会话类型、是否为置顶状态、置顶时间（对于未置顶的会话，值为 `0`）、会话标记以及最新一条消息。从服务端拉取会话列表后会更新本地会话列表。

:::tip
1. **若使用该功能，需在环信控制台开通，并将 SDK 升级至 1.2.0。而且，只有开通该功能，你才能使用置顶会话功能。**
2. 建议你在首次下载、卸载后重装应用等本地数据库无数据情况下拉取服务端会话列表。其他情况下，调用 `getAllConversations` 方法获取本地所有会话即可。
3. 通过 RESTful 接口发送的消息默认不创建或写入会话。若会话中的最新一条消息通过 RESTful 接口发送，获取会话列表时，该会话中的最新一条消息显示为通过非 RESTful 接口发送的最新消息。若要开通 RESTful 接口发送的消息写入会话列表的功能，需联系商务。
:::

示例代码如下：

```typescript
// pageSize: 每页返回的会话数。取值范围为 [1,50]。
// cursor: 开始获取数据的游标位置。如果为空字符串或传 `undefined`，SDK 从最新活跃的会话开始获取。
ChatClient.getInstance()
  .chatManager.fetchConversationsFromServerWithCursor(cursor, pageSize)
  .then(() => {
    console.log("get conversions success");
  })
  .catch((reason) => {
    console.log("get conversions fail.", reason);
  });
```

若不支持 `fetchConversationsFromServerWithCursor`，你可以调用 `fetchConversationsFromServerWithPage` 接口从服务器获取会话列表。利用该接口，你总共可获取服务器最近 7 天内存储的 100 个会话。若提升这两个上限，需联系环信商务。

### 获取本地所有会话

你可以调用 `getAllConversations` 方法一次性获取本地所有会话。

本地会话列表包含单聊和群组聊天会话，至于是否包含聊天室会话，取决于在 SDK 初始化时 `ChatOptions#deleteMessagesAsExitChatRoom` 参数的设置。若设置为 `true`，即离开聊天室时删除该聊天室的所有本地消息，则本地会话列表中不包含聊天室会话。若设置为 `false`，即保留该聊天室的所有本地消息，则本地会话列表中包含聊天室会话。

若在初始化时，将 `ChatOptions#enableEmptyConversation` 设置为 `true` 允许返回空会话，则会话列表中会包含空会话，否则不包含。
 
示例代码如下：

```typescript
ChatClient.getInstance()
  .chatManager.getAllConversations()
  .then(() => {
    console.log("get conversions success");
  })
  .catch((reason) => {
    console.log("get conversions fail.", reason);
  });
```