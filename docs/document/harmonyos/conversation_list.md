# 会话列表


对于单聊、群聊和聊天室，SDK 会在用户收发消息时创建或更新对应的本地会话。你可以从服务端或本地获取会话列表。默认情况下，本地会话列表的返回结果不包含聊天室会话。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

环信即时通讯 IM HarmonyOS SDK 通过 `ChatManager` 和 `Conversation` 类支持从服务器和本地获取会话列表，主要方法如下：

- `ChatManager#fetchConversationsFromServer`：从服务器分页获取会话列表。
- `ChatManager#getAllConversationsBySort`：从本地数据库获取排序后的全部会话。
- `ChatManager#getConversationsFromDB`：从本地数据库分页获取会话列表。
- `ChatManager#getConversations`：获取本地当前所有会话。
- `ChatManager#getConversation`：根据会话 ID 和会话类型获取指定会话。

## 从服务器分页获取会话列表

你可以调用 `fetchConversationsFromServer` 方法从服务端分页获取会话列表。返回结果包含单聊和群聊会话，不包含聊天室会话。SDK 按照会话活跃时间，即会话中最新一条消息的时间戳，倒序返回会话列表。每个 `Conversation` 对象中包含会话 ID、会话类型、置顶状态、会话标记和最新一条消息等数据。从服务端拉取会话列表后，SDK 会更新本地会话列表。

对于每个终端用户，服务器默认保存最新的 100 条会话。超过数量限制时，新创建的会话会覆盖最早的不活跃会话。如需提升会话数量上限，请联系环信商务。当某个会话中的所有消息记录过期后，该会话即被视为空会话。默认情况下，从服务端拉取的会话列表中不包含空会话。

:::tip
1. 使用服务端会话列表前，需 [在环信控制台开通](/product/console/basic_conversation_group_chatroom.html#服务端会话列表)。只有开通该功能后，才能使用会话置顶和会话标记功能。
2. 建议仅在首次安装、卸载后重装等本地数据库无会话数据的场景下，从服务端拉取会话列表。其他场景可调用 `getAllConversationsBySort` 或 `getConversations` 获取本地会话。
3. 通过 RESTful API 发送的消息默认不创建或写入会话。若需将通过 RESTful API 发送的消息写入会话列表，请 [在环信控制台开通相应功能](/product/console/basic_conversation_group_chatroom.html#rest-发消息写会话列表)。
:::

示例代码如下：

```typescript
// limit：每页返回的会话数，取值范围为 [1, 20]，默认为 `10`。
// cursor：查询游标。首次查询时传空字符串，从最新活跃的会话开始获取。
let limit = 20;
let cursor = '';

ChatClient.getInstance().chatManager()?.fetchConversationsFromServer(limit, cursor)
  .then((result) => {
    // 当前页的会话列表。
    let conversations = result.getResult();
    // 下一页的查询游标；返回空字符串表示没有更多数据。
    let nextCursor = result.getNextCursor();
  })
  .catch((error: ChatError) => {
    // 根据 error.errorCode 和 error.description 处理失败结果。
  });
```

## 从本地获取会话列表

HarmonyOS SDK 提供以下方式获取本地会话：

- [分页获取本地会话](#分页获取本地会话)
- [一次性获取本地所有会话](#一次性获取本地所有会话)
- [获取指定会话](#获取指定会话)

初始化时可以设置 `ChatOptions` 中的以下会话选项：

| 选项 | 描述    | 
| :--------- | :----- |
| `enableChatroomConversation` | 设置会话列表中是否包含聊天室会话。该配置仅控制聊天室会话是否出现在内存会话列表、会话列表更新回调和本地数据库分页结果中；不控制 SDK 在底层创建或持久化聊天室会话，也不影响聊天室消息的正常收发。<br/> - `true`：会话列表和本地数据库分页结果中包含聊天室会话。<br/> -（默认）`false`：会话列表、会话列表更新回调和本地数据库分页结果中不包含聊天室会话。<br/> 该配置必须在初始化 SDK 前设置。使用 `ChatOptions` 对象初始化时，可调用 `setEnableChatroomConversation()` 设置；使用字面量参数初始化时，可设置 `enableChatroomConversation`。你可以通过 `isEnableChatroomConversation()` 查询当前配置。 |
| `setDeleteMessagesOnLeaveChatroom` | 设置主动或被动退出聊天室时是否删除该聊天室的本地消息。<br/> -（默认）`true`：删除本地消息。<br/> - `false`：保留本地消息。<br/>该配置只控制退出聊天室时是否删除本地消息，不决定本地会话列表是否返回聊天室会话。 |
|`setAutoLoadAllConversations` | 控制登录成功后是否自动将全部会话加载到内存：<br/> - （默认）`true`：自动加载全部会话。。<br/> - `false`：不自动加载全部会话。| 

### 分页获取本地会话

自 HarmonyOS SDK 1.15.0 起，你可以调用 `ChatManager#getConversationsFromDB` 从本地数据库分页获取会话列表。SDK 优先返回置顶会话。对于置顶状态相同的会话，SDK 按照最新一条消息的服务器时间戳降序排列；若时间戳也相同，则按照会话 ID 降序排列，比较会话 ID 时不区分大小写。

调用该方法前，需在初始化 SDK 前调用 `ChatOptions#setAutoLoadAllConversations(false)`，关闭本地会话的自动全量加载，默认自动全量加载。否则，SDK 会在登录成功后将数据库中的全部会话加载到内存，无法发挥分页加载在减少初始加载量和内存占用方面的作用。

```
// SDK 初始化前关闭自动加载全部本地会话。
let options = new ChatOptions({
  appKey: 'your-org#your-app'
});
options.setAutoLoadAllConversations(false);
ChatClient.getInstance().init(context, options);

// 首次查询时，cursor 传空字符串，表示从第一页开始获取。
let cursor = '';

// pageSize 的取值范围为 1-100 ，默认为 50。
let pageSize = 20;

ChatClient.getInstance()
  .chatManager()
  ?.getConversationsFromDB(cursor, pageSize)
  .then((result) => {
    // 获取当前页的会话列表。
    let conversations = result.getResult();

    // 获取下一页的游标。
    let nextCursor = result.getNextCursor();

    if (nextCursor.length > 0) {
      // 保存 nextCursor；获取下一页时将其作为 cursor 传入。
    } else {
      // nextCursor 为空字符串，表示当前页为最后一页。
    }
  })
  .catch((error: ChatError) => {
    if (error.errorCode === ChatError.INVALID_PARAM) {
      // cursor 无效。
    }
  });
```

`getConversationsFromDB` 返回 `Promise<CursorResult<Conversation>>`：

- 调用 `CursorResult#getResult()` 获取当前页的会话列表。
- 调用 `CursorResult#getNextCursor()` 获取下一页游标。
- 下一页游标为空字符串时，表示已经获取到最后一页。
- 传入无效的 `cursor` 时，Promise 以 `ChatError.INVALID_PARAM` 拒绝。

### 一次性获取本地所有会话

- 调用 `getAllConversationsBySort` 可以从本地数据库获取排序后的全部会话，返回值为 `Array<Conversation>`。SDK 按照以下规则排序：

1. 置顶会话排在非置顶会话之前。
2. 置顶状态相同的会话按照最新一条消息的时间戳倒序排列。

默认情况下，该方法的返回结果不包含聊天室会话。

```typescript
let conversations = ChatClient.getInstance()
  .chatManager()
  ?.getAllConversationsBySort();
```


- 调用 `getConversations` 可以获取本地当前所有会话，返回值为无序的 `Array<Conversation>`：

```typescript
let conversations = ChatClient.getInstance()
  .chatManager()
  ?.getConversations();
```

该方法不会提供分页、筛选或排序参数。如需获取按置顶状态和最新消息时间排序的全部本地会话，请调用 `getAllConversationsBySort`。

### 获取指定会话

调用 `getConversation` 可以根据会话 ID 和会话类型获取指定会话。`createIfNotExist` 用于设置本地不存在该会话时是否创建新会话。

```typescript
let conversationId = 'conversationId';
let conversationType = ConversationType.Chat;
let createIfNotExist = false;

let conversation = ChatClient.getInstance()
  .chatManager()
  ?.getConversation(conversationId, conversationType, createIfNotExist);
```

参数说明如下：

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `conversationId` | `string` | 是 | 会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `type` | `ConversationType` | 否 | 会话类型，默认为 `ConversationType.Chat`。群聊和聊天室分别使用 `ConversationType.GroupChat` 和 `ConversationType.ChatRoom`。 |
| `createIfNotExist` | `boolean` | 否 | 本地不存在指定会话时是否创建新会话，默认为 `false`。 |

默认本地会话列表不返回聊天室会话。如需访问已知聊天室的本地会话，可以将会话类型设置为 `ConversationType.ChatRoom`，通过 `getConversation` 单独获取。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`fetchConversationsFromServer`](#从服务器分页获取会话列表) | `ChatManager` | 从服务端分页获取会话列表。 |
| [`getConversationsFromDB`](#分页获取本地会话) | `ChatManager` | 从本地分页获取会话列表。 |
| [`getAllConversationsBySort`](#一次性获取本地所有会话) | `ChatManager` | 从本地数据库获取排序后的全部会话。 |
| [`getConversations`](#一次性获取本地所有会话) | `ChatManager` | 获取本地当前所有无序会话。 |
| [`getConversation`](#获取指定会话) | `ChatManager` | 根据会话 ID 和类型获取指定会话。 |
| `setDeleteMessagesOnLeaveChatroom` | `ChatOptions` | 设置退出聊天室时是否删除该聊天室的本地消息。 |
