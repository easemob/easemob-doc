# 消息表情回复 Reaction

## 功能说明

环信即时通讯 IM 提供消息表情回复功能。用户可以在单聊和群聊中对消息添加或删除表情。表情可以直观表达情绪；在群聊场景下，也可以结合不同表情的数量实现轻量投票、反馈收集等互动能力。

Reaction 场景示例如下，分别展示如何添加 Reaction，群聊中 Reaction 的效果，以及查看 Reaction 列表。

![img](/images/android/reactions.png)

## 功能开通

使用 Reaction 前，需在[环信控制台](https://console.easemob.com/user/login)开通该功能，具体操作请参见[环信控制台文档](/product/console/basic_message.html#消息表情回复)。

## 使用限制

- Reaction 仅适用于单聊和群聊，聊天室暂不支持。
- 同一用户对同一条消息上的同一个 Reaction 只能添加一次。
- Reaction 的计数规则和存储时间、用户添加限制、每条消息可添加的 Reaction 数量，以及表情 ID 规范，详见 [使用限制文档](limitation.html)。

## 前提条件

开始前，请确保满足以下条件：

1. 完成 SDK 初始化并登录，详见 [快速开始](quickstart.html)。
2. 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
3. 已在 [环信控制台](https://console.easemob.com/user/login) 开通 Reaction 功能。

## 在消息上添加 Reaction

调用 `ChatManager#addReaction` 可为消息添加 Reaction。对于单聊，会话对端用户会收到 `ChatMessageEventListener#onMessageReactionDidChange` 回调；对于群聊，除操作者外的其他群成员会收到该回调。回调信息包括会话 ID、消息 ID、发生变化的 Reaction 列表以及 Reaction 操作列表。操作列表会记录操作者用户 ID、发生变化的 Reaction 和操作类型，业务侧可据此实时更新消息上的 Reaction 展示。

同一用户对同一条消息上的同一个 Reaction 只能添加一次。重复添加时，SDK 会返回错误码 `1301`，业务侧可统一按“该 Reaction 已添加过”进行处理。

仅当目标消息已存在于本地时，SDK 才会处理其 Reaction 变更通知。事件中的 `reactions` 为本次发生变化的 Reaction 列表，不应直接将其作为完整列表覆盖原有数据；如需完整概览，可调用 `ChatManager#fetchReactionList` 查询。

示例代码如下：

```typescript
// 监听 Reaction 更新
const reactionListener: ChatMessageEventListener = {
  onMessageReactionDidChange(events) {
    for (const event of events) {
      // 根据会话 ID、消息 ID 和 Reaction 信息更新展示
      console.log(event.convId, event.msgId, event.reactions, event.operations);
    }
  },
};

// 注册消息监听
ChatClient.getInstance().chatManager.addMessageListener(reactionListener);

async function addReaction(msgId: string, reaction: string): Promise<void> {
  try {
    // 添加 Reaction，参数顺序为 Reaction 内容、消息 ID
    await ChatClient.getInstance().chatManager.addReaction(reaction, msgId);
    // 当前用户添加成功，可更新当前界面
  } catch (error: unknown) {
    console.error('添加 Reaction 失败：', error);
  }
}

function removeReactionListener(): void {
  // 不再需要监听时，移除同一个监听器对象
  ChatClient.getInstance().chatManager.removeMessageListener(reactionListener);
}
```

## 删除消息的 Reaction

调用 `ChatManager#removeReaction` 删除当前用户为消息添加的 Reaction。删除成功后，单聊中的对端用户以及群聊中除操作者外的其他成员会收到 `ChatMessageEventListener#onMessageReactionDidChange` 回调。回调信息包括会话 ID、消息 ID、发生变化的 Reaction 列表和 Reaction 操作列表；操作列表会记录操作者用户 ID、被删除的 Reaction 以及操作类型。业务侧可据此实时更新消息上的 Reaction 展示。

执行删除操作的一方可通过 `removeReaction` 返回的 Promise 获取操作结果，并在成功后更新当前界面。

示例代码如下：

```typescript
async function removeReaction(msgId: string, reaction: string): Promise<void> {
  try {
    // 删除 Reaction，参数顺序为 Reaction 内容、消息 ID
    await ChatClient.getInstance().chatManager.removeReaction(reaction, msgId);
    // 当前用户删除成功，可更新当前界面
  } catch (error: unknown) {
    console.error('删除 Reaction 失败：', error);
  }
}
```

## 获取消息的 Reaction 列表

调用 `ChatManager#fetchReactionList` 可从服务器获取一条或多条指定消息的 Reaction 概览。

每条 Reaction 概览包含 Reaction 内容、添加该 Reaction 的用户数量，以及最早添加 Reaction 的三个用户的用户 ID。该用户列表仅用于概览展示，并不代表全部用户。若需要获取完整用户列表，可调用 `ChatManager#fetchReactionDetail` 分页查询。对于已获取并缓存的消息，也可以通过 `ChatManager#getReactionList` 读取消息中的 Reaction 列表。

`fetchReactionList(msgIds, groupId, chatType)` 的三个参数均为必填：`msgIds` 为消息 ID 数组；`groupId` 在群聊场景下传入对应的群组 ID，单聊场景下传入空字符串；`chatType` 为会话类型。成功时返回以消息 ID 为键、`ChatMessageReaction[]` 为值的 Map。`ChatMessageReaction` 的 `reaction`、`count`、`isAddedBySelf` 和 `userList` 分别表示 Reaction 内容、添加该 Reaction 的用户数量、当前用户是否已添加以及用户 ID 列表。

示例代码如下：

```typescript
async function fetchReactions(msgIdList: string[]): Promise<void> {
  try {
    // chatType 仅支持单聊（PeerChat）和群聊（GroupChat）
    // 在群聊场景下，还需传入对应的 groupId
    const reactions = await ChatClient.getInstance().chatManager.fetchReactionList(
      msgIdList,
      '',
      ChatMessageChatType.PeerChat
    );
    console.log('消息 Reaction 概览：', reactions);
  } catch (error: unknown) {
    console.error('获取 Reaction 列表失败：', error);
  }
}
```

`ChatManager#getReactionList(msgId)` 读取的是本地消息中缓存的 Reaction 列表，不会主动从服务器查询。调用前应确保该消息已存在于本地。也可以通过 `await message.reactionList` 读取，`message` 应为已存在于本地的消息对象，而不是新创建的待发送消息。

## 获取 Reaction 详情

调用 `ChatManager#fetchReactionDetail` 可从服务器分页获取指定消息中指定 Reaction 的详细信息。返回的 `ChatMessageReaction` 包含以下属性：

- `reaction`：Reaction 内容。
- `count`：当前添加该 Reaction 的用户总数。
- `isAddedBySelf`：当前用户是否已添加该 Reaction，`true` 表示已添加，`false` 表示未添加。
- `userList`：本次分页查询返回的用户 ID 列表。

接口返回 `Promise<ChatCursorResult<ChatMessageReaction>>`，其中包含当前页数据和分页游标。如需获取添加该 Reaction 的全部用户 ID，可使用返回的游标继续查询，直至完成分页。

```typescript
const msgId = '<message_id>';
const reaction = '<reaction>';
// 首次查询传入空字符串，后续传入上一页返回的游标
const cursor = '';

try {
  // 分页获取指定消息中指定 Reaction 的详情
  const result = await ChatClient.getInstance().chatManager
    .fetchReactionDetail(msgId, reaction, cursor, 50);

  // 读取当前页的 Reaction 详情
  for (const detail of result.list ?? []) {
    console.log('Reaction 内容：', detail.reaction);
    console.log('添加该 Reaction 的用户总数：', detail.count);
    console.log('当前用户是否已添加：', detail.isAddedBySelf);
    console.log('当前页用户 ID 列表：', detail.userList);
  }

  // 游标非空时可继续查询下一页，为空时表示分页结束
  console.log('下一页游标：', result.cursor);
} catch (error: unknown) {
  console.error('获取 Reaction 详情失败：', error);
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`addReaction`](#在消息上添加-reaction) | `ChatManager` | 异步添加消息 Reaction。 |
| [`removeReaction`](#删除消息的-reaction) | `ChatManager` | 异步删除消息 Reaction。 |
| [`fetchReactionList`](#获取消息的-reaction-列表) | `ChatManager` | 异步获取多条消息的 Reaction 概览。 |
| [`getReactionList`](#获取消息的-reaction-列表) | `ChatManager` | 读取本地消息中缓存的 Reaction 列表。 |
| [`fetchReactionDetail`](#获取-reaction-详情) | `ChatManager` | 异步分页获取指定 Reaction 的详情。 |
| [`onMessageReactionDidChange`](#在消息上添加-reaction) | `ChatMessageEventListener` | 消息 Reaction 变更通知。 |
| [`convId`](#在消息上添加-reaction) | `ChatMessageReactionEvent` | 会话 ID。 |
| [`msgId`](#在消息上添加-reaction) | `ChatMessageReactionEvent` | 消息 ID。 |
| [`reactions`](#在消息上添加-reaction) | `ChatMessageReactionEvent` | 本次发生变化的消息 Reaction 列表。 |
| [`operations`](#在消息上添加-reaction) | `ChatMessageReactionEvent` | Reaction 操作列表。 |
