# 会话列表

<Toc />

对于单聊、群聊和聊天室，SDK 会在用户收发消息时创建或更新对应的本地会话。你可以从服务端或本地获取会话列表。自 React Native SDK 1.21.0 起，默认情况下，本地会话列表不包含聊天室会话。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

环信即时通讯 IM 支持从服务器和本地获取会话列表，主要方法如下：

- `ChatManager.fetchConversationsFromServerWithCursor`：从服务器分页获取会话列表。
- `ChatManager.fetchConversationsFromDB`：从本地数据库分页获取会话列表。
- `ChatManager.getAllConversations`：一次性获取本地所有会话。

## 从服务器分页获取会话列表

你可以调用 `fetchConversationsFromServerWithCursor` 方法从服务端分页获取会话列表，包含单聊和群聊会话，不包含聊天室会话。SDK 按照会话活跃时间（会话的最新一条消息的时间戳）的倒序返回会话列表，每个会话对象中包含会话 ID、会话类型、是否为置顶状态、置顶时间（对于未置顶的会话，值为 `0`）、会话标记以及最新一条消息。从服务端拉取会话列表后会更新本地会话列表。

对于每个终端用户，服务器默认保存最新的 100 条会话。超过此数量限制时，新创建的会话将自动覆盖最早的旧会话。当某个会话中的所有消息记录过期后，该会话即被视为 [空会话](conversation_overview.html#空会话)。默认情况下，从服务端拉取会话列表时不包含空会话。如需拉取空会话，需在 SDK 初始化时将 `ChatOptions.enableEmptyConversation` 设置为 `true`。注意，空会话将占用会话拉取名额。若希望拉取会话时不包含空会话，同时避免其占用会话名额，请联系环信商务开通相关配置。

:::tip
1. **若使用该功能，需 [在环信控制台开通](/product/console/basic_conversation_group_chatroom.html#服务端会话列表)，并将 SDK 升级至 1.2.0 或以上版本。只有开通该功能，你才能使用置顶会话和会话标记功能。**
2. 建议你在首次下载、卸载后重装应用等本地数据库无数据情况下拉取服务端会话列表。其他情况下，调用 `getAllConversations` 方法获取本地所有会话即可。
3. 通过 RESTful 接口发送的消息默认不创建或写入会话。若会话中的最新一条消息通过 RESTful 接口发送，获取会话列表时，该会话中的最新一条消息显示为通过非 RESTful 接口发送的最新消息。若要开通 RESTful 接口发送的消息写入会话列表的功能，需在[环信控制台开通](/product/console/basic_conversation_group_chatroom.html#rest-发消息写会话列表)。
:::

示例代码如下：

```typescript
// pageSize: 每页返回的会话数。取值范围为 [1,20]，默认为 `10`。
// cursor: 开始获取数据的游标位置。如果为空字符串或传 `undefined`，SDK 从最新活跃的会话开始获取。
const result = await ChatClient.getInstance().chatManager
  .fetchConversationsFromServerWithCursor(undefined, 20);

const conversations = result.list ?? [];
const nextCursor = result.cursor;

if (nextCursor) {
  // 获取下一页时，将 nextCursor 作为 cursor 传入。
}
```

若不支持 `fetchConversationsFromServerWithCursor`，可以调用 `fetchConversationsFromServerWithPage` 从服务器获取会话列表。

## 从本地获取会话列表

SDK 提供以下方式获取本地会话列表：

- [分页获取本地会话](#分页获取本地会话)
- [获取本地所有会话](#获取本地所有会话)

初始化 SDK 时，可以配置以下会话选项：

| 选项 | 描述 |
| :--- | :--- |
| `enableChatroomConversation` | 设置获取本地会话列表时是否包含聊天室会话。该配置不控制聊天室会话的创建或存储，也不影响聊天室消息的正常收发。自 React Native SDK 1.21.0 起支持。<br/>- `true`：本地会话列表中包含聊天室会话。<br/>-（默认）`false`：本地会话列表中不包含聊天室会话。必须在初始化 SDK 前设置。 |
| `deleteMessagesAsExitChatRoom` | 设置主动或被动退出聊天室时是否删除该聊天室的本地消息。该配置不决定获取本地会话列表时是否包含聊天室会话。<br/>-（默认）`true`：删除本地消息。<br/>- `false`：保留本地消息。 |
| `enableEmptyConversation` | 设置获取本地会话时是否包含空会话。<br/>- `true`：包含空会话。<br/>-（默认）`false`：不包含空会话。 |
| `autoLoadConversations` | 设置登录成功后是否自动将全部本地会话加载到内存。<br/>-（默认）`true`：自动加载全部会话。<br/>- `false`：不自动加载全部会话，可使用 `fetchConversationsFromDB` 分页加载。 |

### 分页获取本地会话

自 React Native SDK 1.21.0 起，你可以调用 `ChatManager.fetchConversationsFromDB` 从本地数据库分页获取会话列表。SDK 先按置顶时间倒序返回置顶会话，再按最新一条消息的服务器时间戳倒序返回其他会话；若时间戳相同，则按会话 ID 的字母倒序返回，比较会话 ID 时不区分大小写。

调用该方法前，需在 SDK 初始化时将 `ChatOptions.autoLoadConversations` 设置为 `false`，关闭登录后的本地会话自动全量加载。该配置默认为 `true`。否则，SDK 会将数据库中的全部会话加载到内存，无法发挥分页加载在减少初始加载量和内存占用方面的作用。

```typescript
// SDK 初始化前关闭自动加载全部本地会话。
const options = ChatOptions.withAppKey({
  appKey: 'your-org#your-app',
  autoLoadConversations: false,
});
await ChatClient.getInstance().init(options);

// 首次查询时，cursor 传 undefined 或空字符串。
let cursor: string | undefined;
const pageSize = 20; // 取值范围为 [1,100]，默认值为 20。

try {
  const result = await ChatClient.getInstance().chatManager
    .fetchConversationsFromDB(cursor, pageSize);

  const conversations = result.list ?? [];
  cursor = result.cursor;

  if (cursor) {
    // 保存 cursor；获取下一页时将其作为 cursor 传入。
  } else {
    // cursor 为空字符串，表示当前页为最后一页。
  }
} catch (error) {
  const chatError = error as ChatError;
  console.error(
    `获取本地会话失败：${chatError.code}, ${chatError.description}`
  );
}
```

如果传入的 `cursor` 无效，Promise 会抛出错误码为 `110` 的 `ChatError`。

### 获取本地所有会话

你可以调用 `ChatManager.getAllConversations` 一次性获取本地所有会话。SDK 按照会话活跃时间倒序返回会话，置顶会话在前，非置顶会话在后。


```typescript
try {
  const conversations = await ChatClient.getInstance().chatManager
    .getAllConversations();
  console.log('本地会话数量：', conversations.length);
} catch (error) {
  const chatError = error as ChatError;
  console.error(
    `获取本地会话失败：${chatError.code}, ${chatError.description}`
  );
}
```

:::tip
如果将 `autoLoadConversations` 设置为 `false`，建议使用 `fetchConversationsFromDB` 按页读取本地数据库中的会话。
:::

## 接口列表

| API 名称 | 所属模块/类 | 返回类型 | 说明 |
| :--- | :--- | :--- | :--- |
| [`fetchConversationsFromServerWithCursor`](#从服务器分页获取会话列表) | `ChatManager` | `Promise<ChatCursorResult<ChatConversation>>` | 从服务器分页获取会话列表。 |
| [`fetchConversationsFromDB`](#分页获取本地会话) | `ChatManager` | `Promise<ChatCursorResult<ChatConversation>>` | 从本地数据库分页获取会话列表。 |
| [`getAllConversations`](#获取本地所有会话) | `ChatManager` | `Promise<ChatConversation[]>` | 一次性获取本地所有会话。 |
| [`enableChatroomConversation`](#从本地获取会话列表) | `ChatOptions` | `boolean` | 设置获取本地会话列表时是否包含聊天室会话，默认不包含聊天室会话。自 React Native SDK 1.21.0 起支持。 |
| [`deleteMessagesAsExitChatRoom`](#从本地获取会话列表) | `ChatOptions` | `boolean` | 设置主动或被动退出聊天室时是否删除该聊天室的本地消息。该配置不决定获取本地会话列表时是否包含聊天室会话。默认删除本地消息。 |
| [`enableEmptyConversation`](#从本地获取会话列表) | `ChatOptions` | `boolean` | 设置获取本地会话时是否包含空会话。默认不包含空会话。 |
| [`autoLoadConversations`](#分页获取本地会话) | `ChatOptions` | `boolean` | 设置登录成功后是否自动将全部本地会话加载到内存。默认自动加载全部会话。 |
