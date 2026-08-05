# 消息表情回复 Reaction

## 功能说明

环信即时通讯 IM 提供消息表情回复功能。用户可以在单聊和群聊中对消息添加或删除表情。表情可以直观表达情绪；在群聊场景下，也可以结合不同表情的数量实现轻量投票、反馈收集等互动能力。

- 添加 Reaction：

![](/images/web/web_chat_reaction_add_reaction.png)

- 查看 Reaction：

![](/images/web/web_group_chat_reaction_detail_another_version.png)

## 功能开通

要使用 Reaction 功能，需在 [环信控制台](https://console.easemob.com/user/login) 开通。具体操作步骤详见 [环信控制台文档](/product/console/basic_message.html#消息表情回复)。

## 使用限制

- 目前 Reaction 仅适用于单聊和群聊，聊天室暂不支持。
- Reaction 的计数规则和存储时间、用户添加限制、每条消息可添加的 Reaction 数量，以及表情 ID 规范，详见 [使用限制文档](limitation.html)。

## 前提条件

开始前，请确保满足以下条件：

1. 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
2. SDK 初始化时，已注册 `ChatManager`。
3. 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
4. 已在 [环信控制台](https://console.easemob.com/user/login) 开通 Reaction 功能。

## 在消息上添加 Reaction

调用 `addReaction` 在消息上添加 Reaction。对于单聊和群聊会话，会话内成员都会收到 `onReactionChanged` 事件。该事件中的信息包括消息 ID、会话 ID、会话类型、消息发送方、消息接收方、当前消息上的完整 Reaction 列表和更新时间戳。业务侧可据此实时刷新消息上的 Reaction 展示。

对于同一条消息上的同一个 Reaction，当前用户只能添加一次。重复添加时，SDK 返回的典型错误为错误码 `1301`，错误 Key 为 `reaction_already_operated`。业务侧可统一按“该 Reaction 已添加过”处理。

示例代码如下：

```typescript
await client.chatManager.addReaction({
  messageId: 'msg-id-123',
  reaction: '👍',
});
```

如需监听 Reaction 变化，可注册如下事件：

```typescript
client.chatManager.addEventHandler('reaction-events', {
  onReactionChanged: payload => {
    console.log('消息 ID:', payload.messageId);
    console.log('会话 ID:', payload.conversationId);
    console.log('会话类型:', payload.conversationType);
    console.log('发送方:', payload.from);
    console.log('接收方:', payload.to);
    console.log('当前 Reaction 列表:', payload.reactions);
    console.log('更新时间:', payload.timestamp);
  },
});
```

## 删除消息的 Reaction

调用 `removeReaction` 删除当前用户在消息上添加的 Reaction。对于单聊和群聊会话，会话内成员都会收到 `onReactionChanged` 事件，业务侧可根据事件中的最新 `reactions` 列表刷新界面。

示例代码如下：

```typescript
await client.chatManager.removeReaction({
  messageId: 'msg-id-123',
  reaction: '👍',
});
```

## 获取消息的 Reaction 列表

调用 `getReactionList` 方法可以从服务器获取一条或多条消息的 Reaction 汇总列表。每条消息的汇总结果中包含以下内容：
- 消息 ID。
- 消息上的各个 Reaction 摘要。每个摘要项包含 Reaction 内容、添加该 Reaction 的用户数量、当前登录用户是否已添加该 Reaction，以及最早添加 Reaction 的三个用户的用户 ID。

若查询群消息的 Reaction 列表，需要传入 `groupId`，如下列示例代码所示：

```typescript
const reactions = await client.chatManager.getReactionList({
  messageId: 'msg-id-123',
  conversationType: 'groupChat',
  groupId: 'group-id-123',
});

reactions.forEach(item => {
  console.log('消息 ID:', item.messageId);

  item.reactions.forEach(reaction => {
    console.log('Reaction:', reaction.reaction);
    console.log('数量:', reaction.count);
    console.log('用户 ID 列表:', reaction.userIds);
    console.log('自己是否添加:', reaction.isAddedBySelf);
  });
});
```

## 获取 Reaction 详情

调用 `getReactionDetail` 方法可以从服务器获取指定消息上某个 Reaction 的详情，包括 Reaction 内容、添加该 Reaction 的用户数量、当前用户是否已添加、添加该 Reaction 的用户 ID 列表、分页游标、是否还有更多数据，以及该 Reaction 的创建时间。

```typescript
const detail = await client.chatManager.getReactionDetail({
  messageId: 'msg-id-123',
  reaction: '👍',
  // 表示每页返回的添加该 Reaction 的用户条目数量，即返回结果中 `reactionUsers` 的数量上限。
  // 默认为 20，最大为 100。
  pageSize: 20,
  // cursor：开始获取数据的游标位置。首次调用方法时传 `null` 、空字符串（''）或不传该字段。后续调用传入上一次查询结果的游标 res.data.cursor，若 cursor 的值为空字符串（''），表示当前为最后一页数据。
  cursor: '',
});

console.log('Reaction:', detail.reaction);
console.log('数量:', detail.count);
console.log('自己是否添加:', detail.isAddedBySelf);
console.log('用户列表:', detail.reactionUsers);
console.log('下一页游标:', detail.cursor);
console.log('是否还有更多:', detail.hasMore);
console.log('创建时间:', detail.createdAt);
```

其中，`reactionUsers` 中的每一项包含以下信息：

- `userId`：添加该 Reaction 的用户 ID。
- `user`：用户对象。当前 SDK 返回值中至少包含 `userId`。
- `createdAt`：该用户添加 Reaction 的时间。

## 获取漫游消息中的 Reaction

调用 `getHistoryMessages` 可以获取漫游消息。如果一条历史消息已添加 Reaction，则返回的消息对象中会包含 `reactions` 字段，用于表示该消息当前的 Reaction 概览。

示例代码如下：

```typescript
const page = await client.chatManager.getHistoryMessages({
  conversationId: 'group-id-123',
  conversationType: 'groupChat',
  pageSize: 20,
});

page.items.forEach(message => {
  console.log('消息 ID:', message.msgServerId);
  console.log('Reaction 概览:', message.reactions);
});
```

## 接口列表

| API 名称                                           | 所属模块/类   | 说明                                                |
| -------------------------------------------------- | ------------- | --------------------------------------------------- |
| [`addReaction`](#在消息上添加-reaction)            | `ChatManager` | 在消息上添加 Reaction。                             |
| [`removeReaction`](#删除消息的-reaction)           | `ChatManager` | 删除当前用户在消息上添加的 Reaction。               |
| [`getReactionList`](#获取消息的-reaction-列表)     | `ChatManager` | 获取一条或多条消息的 Reaction 汇总列表。            |
| [`getReactionDetail`](#获取-reaction-详情)         | `ChatManager` | 获取指定消息上某个 Reaction 的详情。                |
| [`getHistoryMessages`](#获取漫游消息中的-reaction) | `ChatManager` | 获取历史消息，并从消息对象中读取 `reactions` 字段。 |