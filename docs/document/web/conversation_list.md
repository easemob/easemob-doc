# 会话列表

## 功能说明

- **本地会话列表：** 对于单聊、群组聊天和聊天室会话，用户收发消息时，SDK 会在本地创建或更新对应会话，并将其维护在本地会话列表缓存中。应用可从本地内存或数据库读取会话列表，用于展示会话名称、头像、最后一条消息、未读数、置顶状态和会话标记等信息。
- **服务端与本地数据：** 环信服务器和 SDK 本地均可维护会话列表数据：服务端保存当前用户的会话状态，SDK 本地缓存用于客户端快速读取和展示会话列表。完成 SDK 初始化并成功登录后，SDK 会自动维护本地会话列表；会话同步、主动刷新、收发消息、删除会话、清空未读数、设置或取消置顶、添加或移除会话标记等操作均可能更新本地列表。
- **同步与变更通知：** 若需获取服务端维护的最新会话数据，应在初始化 SDK 前配置会话数据自动同步，并在登录后等待同步完成，再读取本地会话列表。当本地会话列表发生变化时，SDK 会通过会话列表更新事件通知应用；同一账号在其他设备上设置或取消会话置顶时，当前设备也可通过多设备事件感知该变更。

## 功能开通

使用前，需要在 [环信控制台](/product/console/basic_conversation_group_chatroom.html#服务端会话列表) 开通服务端会话列表功能。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- SDK 初始化时已注册 `ChatManager`，能够通过 `client.chatManager` 调用消息和会话相关接口。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

:::tip
本地会话列表缓存依赖浏览器本地存储功能，建议在现代浏览器中使用，例如 Chrome、Firefox、Safari 以及使用这些引擎的其他浏览器（例如 Microsoft Edge），**不支持 Internet Explorer（IE）浏览器**。
:::

## 登录后自动同步会话列表

SDK 初始化时，`enableSyncData` 默认包含 `conversation`。用户登录成功后，SDK 会自动从服务端同步会话列表，并更新本地会话列表缓存。你可以通过 `onSyncDataStart` 和 `onSyncDataFinished` 事件监听同步状态。详见 [监听会话列表同步状态](#监听会话列表同步状态)。

如果需要在自动同步会话列表时包含空会话，可在初始化 SDK 时设置 `syncConversationListConfig.includeEmpty` 为 `true`：

```typescript
const client = ChatClient.init({
  appKey: 'easemob-demo#chatdemoui',
  enableSyncData: ['conversation'],
  syncConversationListConfig: {
    includeEmpty: true,
  },
});
```

:::tip
1. 会话标记会固定同步，无需额外配置。
2. 关于登录后自动同步数据，详见 [SDK 初始化文档](initialization.html)。
:::

## 从服务端获取会话列表

你可以调用 `refreshSessionList` 方法从服务端获取最新会话列表，并刷新 SDK 本地会话列表缓存。该方法返回刷新后的会话列表，列表项包含会话 ID、会话类型、未读数、最后一条消息摘要、置顶状态、会话标记、会话展示名称和头像等信息。

SDK 返回的会话列表已按照会话列表排序规则排序：置顶会话优先展示；非置顶会话通常按照会话更新时间或最新一条消息时间倒序排列。

对于每个终端用户，服务端默认存储 100 条会话。超过该限制后，新会话会覆盖旧会话。若会话中的历史消息均已过期，该会话可能变成 [空会话](conversation_overview.html#会话列表与空会话)。调用 `refreshSessionList` 时，默认不返回空会话；如需返回空会话，可将 `includeEmpty` 设置为 `true`。

:::tip
1. **若使用该功能，需 [在环信控制台开通](/product/console/basic_conversation_group_chatroom.html#服务端会话列表)。只有开通该功能，你才能使用置顶会话和会话标记功能。**
2. 登录用户 ID 大小写混用可能导致会话列表为空或数据不一致，建议用户 ID 统一使用小写字母。
3. 服务端会话列表的更新存在一定延时，不建议在每次收发消息后立即调用该方法刷新会话列表。登录后 SDK 默认会自动同步会话列表；如需主动刷新，可按业务需要调用该方法。
4. 通过 RESTful 接口发送的消息默认不创建或写入会话。若会话中的最新一条消息通过 RESTful 接口发送，获取会话列表时，该会话中的最新一条消息可能仍显示为通过非 RESTful 接口发送的最新消息。若要开通 RESTful 接口发送的消息写入会话列表的功能，需在 [环信控制台开通](/product/console/basic_conversation_group_chatroom.html#rest-发消息写会话列表)。
:::

```typescript
const conversations = await client.chatManager.refreshSessionList({
  includeEmpty: false,
});

console.log(conversations);
```

## 获取本地会话列表

你可以调用 `getConversationList` 从本地会话列表缓存中一次性获取非空会话列表，并支持筛选置顶会话或带指定标记的会话。该方法不会发起网络请求。

:::tip
`getConversationList` 不返回 `lastMessage` 为空的空会话。如需从服务端拉取空会话，可调用 `refreshSessionList({ includeEmpty: true })`，并使用该方法的返回结果。
:::

```typescript
// 获取全部非空会话。
const allConversations = client.chatManager.getConversationList();

// 获取置顶会话。
const pinnedConversations = client.chatManager.getConversationList({
  isPinned: true,
});

// 获取带指定标记的会话。
const markedConversations = client.chatManager.getConversationList({
  mark: 3,
});
```

`getConversationList` 返回的每一项均为 `ConversationItem`，主要字段如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | String | 会话 ID。单聊为对方用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `conversationType` | String | 会话类型，取值为 `singleChat`、`groupChat` 或 `chatRoom`。 |
| `unreadCount` | Number | 该会话的未读消息数。 |
| `lastMessage` | JSON | 最近一条消息摘要。 |
| `lastMessageAt` | Number | 最近一条消息的时间戳，单位为毫秒。 |
| `isPinned` | Boolean | 会话是否置顶。 |
| `pinnedTimestamp` | Number | 会话置顶时间戳，单位为毫秒。 |
| `marks` | Array | 会话已应用的标记列表。 |
| `readAt` | Number | 会话已读位置或已读时间戳。 |
| `remindType` | String | 会话的推送通知方式，取值为 `DEFAULT`、`ALL`、`AT` 或 `NONE`。 |
| `conversationName` | String | 会话显示名称。 |
| `conversationAvatar` | String | 会话头像 URL。 |

## 获取会话名称和头像

Web SDK 的会话列表项 `ConversationItem` 中提供 `conversationName` 和 `conversationAvatar`，可用于会话列表展示。

- 单聊会话：分别为对端用户的昵称和头像。
- 群聊会话：分别为群名称和群头像。
- 聊天室会话：会话列表项通常不会自动补全聊天室名称和头像；如需展示聊天室名称或头像，建议业务侧通过聊天室详情接口获取并自行维护展示信息。
- 相关用户、好友或群组信息尚未同步、未加载或不可用时，`conversationName` 可能为会话 ID，`conversationAvatar` 可能为 `undefined`。

```typescript
const conversations = client.chatManager.getConversationList();

conversations.forEach(conversation => {
  const conversationName = conversation.conversationName;
  const conversationAvatar = conversation.conversationAvatar;

  console.log('会话名称:', conversationName);
  console.log('会话头像:', conversationAvatar);
});
```

如果需要先从服务端刷新会话列表，可调用 [`refreshSessionList`](#从服务端获取会话列表)。

## 会话列表数据更新场景

| 场景 | 是否影响服务端会话列表 | 是否影响本地会话列表 | 说明 |
| :--- | :--- | :--- | :--- |
| 登录后的会话同步 | 否 | 是 | 从服务端拉取会话列表并写入本地缓存，不修改服务端数据。 |
| 主动调用 `refreshSessionList` 刷新会话列表 | 否 | 是 | 从服务端刷新会话列表并更新本地缓存，不修改服务端数据。 |
| 收发消息 | 是 | 是 | 会更新服务端会话状态，同时更新本地会话的最后一条消息、排序、未读数等信息。 |
| 设置或取消会话置顶 | 是 | 是 | 会同步服务端置顶状态，并更新本地会话的置顶状态。 |
| 添加或移除会话标记 | 是 | 是 | 会同步服务端会话标记，并更新本地会话的 `marks` 字段。 |
| 删除会话 | 是 | 是 | 会删除服务端当前用户侧的会话记录，并同步删除本地会话缓存；是否删除漫游消息取决于 `deleteRoamingMessages`。 |
| 清空单个会话未读数 | 是 | 是 | 会同步当前用户该会话的服务端未读状态，并更新本地会话的 `unreadCount` 和 `readAt`。 |
| 清空全部会话未读数 | 是 | 是 | 会同步当前用户所有会话的服务端未读状态，并更新本地会话列表中的未读数快照。 |

:::tip
表格中的“影响服务端会话列表”指会修改服务端保存的当前用户会话状态，例如，最后消息、置顶状态、会话标记、会话删除状态或未读状态；“影响本地会话列表”指会修改 SDK 本地缓存中的会话列表数据，并可能触发 `onConversationListUpdate`。登录后的会话同步和 `refreshSessionList` 仅从服务端拉取会话列表并更新本地缓存，不会修改服务端会话列表。
:::

## 监听会话列表相关事件

### 监听会话列表同步状态

如果需要关注登录后会话列表同步状态，可通过 `client.addEventHandler` 监听 `onSyncDataStart` 和 `onSyncDataFinished` 事件。当事件中的 `dataType` 为 `conversation` 时，表示当前事件对应会话列表同步。

```typescript
client.addEventHandler('conversation-sync-listener', {
  onSyncDataStart: payload => {
    if (payload.dataType === 'conversation') {
      console.log('会话列表同步开始');
    }
  },
  onSyncDataFinished: payload => {
    if (payload.dataType === 'conversation') {
      console.log('会话列表同步完成:', payload.status, payload.error);
    }
  },
});
```

`onSyncDataFinished` 中的 `status` 表示同步结果：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `dataType` | String | 同步的数据类型。值为 `conversation` 时，表示会话列表同步。 |
| `status` | String | 同步完成状态。`success` 表示同步成功，`failed` 表示同步失败。 |
| `error` | JSON | 同步失败详情。仅当 `status` 为 `failed` 时返回。 |

### 监听会话列表更新

当会话列表发生变化时，SDK 会触发 `onConversationListUpdate` 事件。该事件可能由会话同步、收发消息、用户资料变化、置顶、标记、删除会话、清零未读数等操作触发。

事件回调中的 `items` 为 SDK 当前完整且已排序的会话列表快照；简单 UI 可直接使用该字段刷新会话列表。如果业务层需要保留自定义本地字段，可结合 `patch` 做增量合并。

```typescript
client.addEventHandler('conversation-listener', {
  onConversationListUpdate: payload => {
    console.log('会话列表更新原因:', payload.reason);
    console.log('当前完整会话列表:', payload.items);
    console.log('本次变化补丁:', payload.patch);
  },
});
```

如果页面销毁或不再需要监听该事件，可以调用 `client.removeEventHandler` 移除对应监听器。

```typescript
client.removeEventHandler('conversation-listener');
```

## 接口最佳实践

| 场景 | 说明 | 推荐做法 |
| :--- | :--- | :--- |
| 会话列表更新 | `getConversationList` 从 SDK 本地会话列表缓存中读取当前已有的非空会话，不发起网络请求。收发消息、会话同步、置顶、标记、删除会话、清零未读数等操作可能更新本地会话列表，并触发 `onConversationListUpdate`。 | 1. 登录后可通过自动同步或调用 `refreshSessionList` 从服务端获取最新会话列表，并更新本地缓存。<br/>2. 展示会话列表时，建议监听 `onConversationListUpdate`，使用事件中的 `items` 刷新 UI。<br/>3. 如需主动读取当前本地非空会话列表，可调用 `getConversationList`。 |
| 会话展示信息 | `ConversationItem` 提供会话列表展示所需的基础字段，例如 `conversationName`、`conversationAvatar`、`lastMessage` 和 `unreadCount`，但不等同于完整用户属性或完整群组详情。 | 1. 会话列表可优先使用 `ConversationItem` 中的展示字段渲染。<br/>2. 如需展示更完整的用户资料或群组信息，可按需调用 [用户属性接口](userprofile.html#从服务端获取用户的所有属性) 或 [群组详情接口](group_attributes.html#获取群组详情)。 |

## 接口列表

| API | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`refreshSessionList`](#从服务端获取会话列表) | `ChatManager` | 从服务端获取最新会话列表，并更新本地会话列表缓存。 |
| [`getConversationList`](#获取本地会话列表) | `ChatManager` | 从 SDK 本地会话列表缓存读取会话列表，并支持按置顶状态或会话标记筛选。 |
