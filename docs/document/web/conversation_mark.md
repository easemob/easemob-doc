# 会话标记

## 功能说明

会话标记用于为会话添加业务分类，例如标星、待处理、重要客户等。Web SDK 支持为单聊、群聊和聊天室会话添加或移除标记。单个会话最多支持添加 20 个标记，每个标记的业务含义由您自行定义和维护。

:::tip
会话标记只用于会话分类和筛选，不会影响会话的未读数、消息收发、置顶状态或消息已读状态。
:::

## 功能开通

会话标记属于服务端会话列表功能的一部分。使用前，需要在 [环信控制台](/product/console/basic_conversation_group_chatroom.html#服务端会话列表) 开通服务端会话列表功能。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- SDK 初始化时需注册 `ChatManager`，可以通过 `client.chatManager` 调用会话相关接口。
- 已开通 [服务端会话列表功能](/product/console/basic_conversation_group_chatroom.html#服务端会话列表)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 添加会话标记

你可以调用 `addConversationMark` 为单个或多个会话添加指定标记。

添加会话标记后，标记数据会更新到服务端，并同步更新 SDK 本地会话列表缓存。会话标记会随服务端会话列表在登录后自动同步到本地；同步完成后，可调用 `client.chatManager.getConversationList()` 读取本地会话列表，并通过会话对象中的 `marks` 字段获取该会话的全部标记。

若服务端会话列表达到数量限制，默认最多保存 100 个会话，服务端可能根据会话活跃度移除不活跃会话。对应会话被移出服务端会话列表后，该会话的标记也可能不再随服务端会话列表同步到本地。

- 为单个会话添加标记：

```typescript
const result = await client.chatManager.addConversationMark({
  conversationId: 'user2',
  conversationType: 'singleChat',
  mark: 0, // 标记编号 0-19。单个会话最多支持添加 20 个标记。
});

console.log(result.succeeded, result.failed, result.mark, result.operation);
```

- 为多个会话批量添加标记：

```typescript
const result = await client.chatManager.addConversationMark({
  conversations: [
    { conversationId: 'user2', conversationType: 'singleChat' },
    { conversationId: 'group1', conversationType: 'groupChat' },
  ],
  mark: 0, // 标记编号 0-19
});

console.log(result.succeeded, result.failed);
```

参数说明如下：

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `conversationId` | String | 条件必需 | 会话 ID。单个会话操作时传入。单聊为对方用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `conversationType` | String | 条件必需 | 会话类型。单个会话操作时传入。取值为 `singleChat`、`groupChat` 或 `chatRoom`。 |
| `conversations` | Array | 条件必需 | 会话列表。批量操作时传入，数组不能为空。 |
| `mark` | Number | 是 | 添加的会话标记，取值范围为 `0` 到 `19`。 |

返回结果为 `ConversationMarkMutationResult`，字段说明如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `succeeded` | Array | 成功应用标记变更的会话列表。 |
| `failed` | Array | 未能应用标记变更的会话列表。失败项中可能包含 `reason` 字段。 |
| `mark` | Number | 本次操作涉及的标记槽位。 |
| `operation` | String | 标记操作类型。添加标记时为 `addMark`。 |

## 移除会话标记

你可以调用 `removeConversationMark` 从单个或多个会话移除指定标记。

- 从单个会话移除标记：

```typescript
const result = await client.chatManager.removeConversationMark({
  conversationId: 'user2',
  conversationType: 'singleChat',
  mark: 0,
});

console.log(result.succeeded, result.failed, result.mark, result.operation);
```

- 从多个会话批量移除标记：

```typescript
const result = await client.chatManager.removeConversationMark({
  conversations: [
    { conversationId: 'user2', conversationType: 'singleChat' },
    { conversationId: 'group1', conversationType: 'groupChat' },
  ],
  mark: 0,
});

console.log(result.succeeded, result.failed);
```

`removeConversationMark` 的参数与 `addConversationMark` 相同。返回结果中的 `operation` 为 `removeMark`。

## 按标记筛选会话列表

添加会话标记后，会话对象中的 `marks` 字段会包含该会话已有的标记槽位。你可以调用 `getConversationList({ mark })` 从 SDK 本地会话列表缓存中筛选带有指定标记的会话。

```typescript
const markedConversations = client.chatManager.getConversationList({
  mark: 0,
});

markedConversations.forEach(conversation => {
  console.log('会话 ID:', conversation.conversationId);
  console.log('会话类型:', conversation.conversationType);
  console.log('会话标记:', conversation.marks);
});
```

如果需要先从服务端刷新会话列表，可调用 `refreshSessionList`：

```typescript
await client.chatManager.refreshSessionList({
  includeEmpty: false,
});

const markedConversations = client.chatManager.getConversationList({
  mark: 0,
});
```

:::tip
`getConversationList` 读取的是 SDK 本地会话列表缓存，不会发起网络请求。该方法默认不返回最后一条消息为空的空会话。
:::

## 监听会话列表更新

添加或移除会话标记后，如果本地会话列表缓存发生变化，SDK 会触发 `onConversationListUpdate` 事件，事件中的 `reason` 为 `local`。你可以监听该事件刷新会话列表 UI。

```typescript
client.chatManager.addEventHandler('conversation-mark-listener', {
  onConversationListUpdate: payload => {
    console.log('会话列表更新原因:', payload.reason);
    console.log('当前完整会话列表:', payload.items);
    console.log('本次变化补丁:', payload.patch);
  },
});
```

事件回调中的 `items` 为 SDK 当前完整且已排序的会话列表快照；简单 UI 可直接使用该字段刷新会话列表。如果业务层需要保留自定义本地字段，可结合 `patch` 做增量合并。

## 注意事项

- 会话标记取值范围为 `0` 到 `19`。各槽位的业务含义由你在业务层自行维护。
- `addConversationMark` 和 `removeConversationMark` 支持操作单个会话，也支持通过 `conversations` 批量操作多个会话。
- 如果 `mark` 不是 `0` 到 `19` 之间的整数，或会话目标列表非法，SDK 会返回参数错误，错误码为 `110`。
- 会话标记会写入服务端，并同步更新 SDK 本地会话列表缓存；如果本地会话列表发生变化，会触发 `onConversationListUpdate` 事件。
- 会话标记不影响会话未读数、消息已读状态、消息收发或会话置顶状态。
- 若服务端会话列表达到数量限制，服务端可能根据会话活跃度移除不活跃会话；对应会话的会话标记也会随会话列表数据一起不可见。

## 接口列表

| API | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`addConversationMark`](#添加会话标记) | `ChatManager` | 为单个或多个会话添加指定标记。 |
| [`removeConversationMark`](#移除会话标记) | `ChatManager` | 从单个或多个会话移除指定标记。 |
| [`getConversationList`](#按标记筛选会话列表) | `ChatManager` | 从 SDK 本地会话列表缓存读取会话列表，并支持按标记筛选。 |
| [`refreshSessionList`](#按标记筛选会话列表) | `ChatManager` | 从服务端刷新会话列表，并更新 SDK 本地会话列表缓存。 |
