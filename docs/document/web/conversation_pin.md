# 会话置顶

## 功能说明

会话置顶用于将重要的单聊、群聊或聊天室会话固定在会话列表靠前位置，方便用户快速找到高频或重点会话。置顶状态会写入服务端会话列表功能，同时 SDK 会在本地会话列表缓存中同步更新该会话的置顶状态，便于前端直接刷新会话列表 UI。

## 功能开通

使用会话置顶前，需要 [开通服务端会话列表功能](conversation_list.html#从服务端获取会话列表)。会话置顶属于会话列表功能的一部分，建议和会话列表同步、会话列表本地读取一起接入。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并登录。
- SDK 初始化时已注册 `ChatManager`，可以通过 `client.chatManager` 调用会话相关接口。
- [已开通服务端会话列表功能](/product/console/basic_conversation_group_chatroom.html#服务端会话列表)。

## 设置或取消置顶会话

调用 `setConversationPinned` 可以设置或取消设置会话置顶状态。该方法会请求服务端更新置顶状态，并在成功后回写 SDK 本地会话列表缓存；如果本地会话列表因此发生变化，SDK 会触发 `onConversationListUpdate` 事件。

如需登录后自动同步会话列表，初始化 SDK 时保持或配置 `enableSyncData` 包含 `conversation`。

你最多可以置顶 50 个会话。

```typescript
// 置顶单聊会话。
const pinnedResult = await client.chatManager.setConversationPinned({
  conversationId: 'user2',
  conversationType: 'singleChat',
  pinned: true,
});

console.log(pinnedResult);

// 取消置顶单聊会话。
const unpinnedResult = await client.chatManager.setConversationPinned({
  conversationId: 'user2',  
  conversationType: 'singleChat',
  pinned: false,
});

console.log(unpinnedResult);
```

参数说明如下：

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `conversationId` | String | 是 | 会话 ID。单聊为对方用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `conversationType` | String | 是 | 会话类型，取值为 `singleChat`、`groupChat` 或 `chatRoom`。 |
| `pinned` | Boolean | 是 | 是否置顶。`true` 表示置顶，`false` 表示取消置顶。 |

返回结果为 `ConversationMutationResult`，主要字段如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | String | 会话 ID。 |
| `conversationType` | String | 会话类型。 |
| `operation` | String | 操作类型。设置或取消置顶时为 `setPinned`。 |
| `isPinned` | Boolean | 操作后的置顶状态。 |
| `pinnedTime` | Number | 置顶时间戳，单位为毫秒；取消置顶时通常为 `0`。 |

## 获取置顶会话列表

设置置顶后，可以通过 [getConversationList({ isPinned: true })](conversation_list.html#获取本地会话列表) 从 SDK 本地会话列表缓存中读取置顶会话。该方法不会发起网络请求，适合在渲染会话列表时直接使用。

```typescript
const pinnedConversations = client.chatManager.getConversationList({
  isPinned: true,
});

pinnedConversations.forEach(conversation => {
  console.log('会话 ID:', conversation.conversationId);
  console.log('会话类型:', conversation.conversationType);
  console.log('是否置顶:', conversation.isPinned);
  console.log('置顶时间:', conversation.pinnedTimestamp);
});
```

如果需要先从服务端同步最新会话列表，可先调用 [refreshSessionList](conversation_list.html#从服务端获取会话列表)，然后再读取本地置顶会话：

```typescript
await client.chatManager.refreshSessionList({
  includeEmpty: false,
});

const pinnedConversations = client.chatManager.getConversationList({
  isPinned: true,
});
```

`getConversationList` 返回的每一项为 `ConversationItem`，和会话置顶最相关的字段如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | String | 会话 ID。 |
| `conversationType` | String | 会话类型。 |
| `lastMessage` | JSON \| null | 最近一条消息摘要。 |
| `lastMessageAt` | Number | 最近一条消息的时间戳，单位为毫秒。 |
| `isPinned` | Boolean | 会话是否置顶。 |
| `pinnedTimestamp` | Number | 会话置顶时间戳，单位为毫秒。 |
| `marks` | Array | 会话标记列表。 |
| `unreadCount` | Number | 会话未读消息数。 |
| `remindType` | String | 会话提醒类型。 |

:::tip
`setConversationPinned` 的返回结果中置顶时间字段为 `pinnedTime`；会话列表项中的置顶时间字段为 `pinnedTimestamp`。二者都表示毫秒级置顶时间戳，但出现在不同的数据结构中。
:::

## 监听本地会话列表更新

调用 `setConversationPinned` 成功后，如果 SDK 本地会话列表缓存发生变化，会触发 `onConversationListUpdate` 事件，事件中的 `reason` 通常为 `local`。建议业务侧监听该事件，并使用事件中的 `items` 刷新会话列表 UI。

```typescript
client.chatManager.addEventHandler('conversation-pin-listener', {
  onConversationListUpdate: payload => {
    console.log('会话列表更新原因:', payload.reason);
    console.log('当前完整会话列表:', payload.items);
    console.log('本次变更补丁:', payload.patch);
  },
});
```

事件回调中的 `items` 是 SDK 当前完整且已排序的会话列表快照。置顶会话会携带 `isPinned` 和 `pinnedTimestamp` 字段，前端可以直接按该列表刷新展示。

## 监听多设备会话置顶事件

同一用户在其他设备上设置或取消会话置顶时，当前设备可通过 `onMultiDeviceConversation` 监听会话多设备事件。SDK 会将服务端下发的会话置顶相关操作归一化为以下操作类型：

| 操作 | 描述 |
| :--- | :--- |
| `CONVERSATION_PINNED` | 其他设备置顶会话。 |
| `CONVERSATION_UNPINNED` | 其他设备取消置顶会话。 |

```typescript
client.addEventHandler('multi-device-conversation-pin-listener', {
  onMultiDeviceConversation: event => {
    if (
      event.operation === 'CONVERSATION_PINNED' ||
      event.operation === 'CONVERSATION_UNPINNED'
    ) {
      console.log('会话置顶多设备事件:', event);
    }
  },
});
```

多设备事件中常见字段如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `category` | String | 事件分类。会话事件为 `conversation`。 |
| `operation` | String | 操作类型，例如 `CONVERSATION_PINNED` 或 `CONVERSATION_UNPINNED`。 |
| `conversationId` | String | 会话 ID。 |
| `conversationType` | String | 会话类型。 |
| `operatorId` | String | 操作者用户 ID。 |
| `deviceId` | String | 来源设备 ID。 |
| `timestamp` | Number | 事件时间戳。 |

:::tip
多设备事件用于通知当前用户的其他在线设备。当前设备自己发起的置顶操作成功后，主要通过 `setConversationPinned` 返回结果和 `onConversationListUpdate` 更新本地 UI。
:::

## 排序与展示建议

`client.chatManager.getConversationList` 返回 SDK 本地会话列表快照，列表已按 SDK 默认规则排序。展示会话列表时，建议直接使用 SDK 返回的顺序。

排序规则如下：

- 置顶会话位于非置顶会话之前。
- 多个置顶会话之间，按 `pinnedTimestamp` 倒序排列，即最近置顶的会话更靠前。
- 非置顶会话按最近活跃时间倒序排列，通常可理解为按 `lastMessageAt` 倒序排列。

```typescript
const conversations = client.chatManager.getConversationList();

console.log('会话列表:', conversations);
```

如果需要自定义排序，可基于 `ConversationItem` 中的 `isPinned`、`pinnedTimestamp` 和 `lastMessageAt` 字段处理：

```typescript
const conversations = client.chatManager.getConversationList();

const sortedConversations = [...conversations].sort((first, second) => {
  const firstPinned = first.isPinned === true;
  const secondPinned = second.isPinned === true;

  if (firstPinned !== secondPinned) {
    return firstPinned ? -1 : 1;
  }

  if (firstPinned && secondPinned) {
    return (second.pinnedTimestamp ?? 0) - (first.pinnedTimestamp ?? 0);
  }

  return (second.lastMessageAt ?? 0) - (first.lastMessageAt ?? 0);
});

console.log('自定义排序后的会话列表:', sortedConversations);
```

## 注意事项

- 调用 `setConversationPinned` 时，`conversationId` 不能为空，`conversationType` 必须为合法会话类型，`pinned` 必须为布尔值；参数非法时 SDK 会抛出参数错误，错误码为 `110`。
- 会话置顶会写入服务端，并同步回写 SDK 本地会话列表缓存；如果本地数据发生变化，会触发 `onConversationListUpdate`。
- 本地会话列表默认不返回 `lastMessage` 为空的空会话。如需从服务端刷新空会话，可调用 `refreshSessionList({ includeEmpty: true })` 并使用其返回结果。
- 会话置顶不影响消息收发、会话未读数、消息已读状态或会话标记。
- 服务端会话列表存在数量限制（对每个终端用户默认为 100）。若服务端会话列表达到上限，不活跃会话可能被服务端移出会话列表，对应会话的置顶状态在会话列表中也可能不再可见。

## 接口列表

| API | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`setConversationPinned`](#设置或取消置顶会话) | `ChatManager` | 设置或取消指定会话的置顶状态。 |
| [`getConversationList`](#获取置顶会话列表) | `ChatManager` | 从 SDK 本地会话列表缓存读取会话列表，并支持通过 `isPinned` 筛选置顶会话。 |
| [`refreshSessionList`](#获取置顶会话列表) | `ChatManager` | 从服务端刷新会话列表，并更新 SDK 本地会话列表缓存。 |
