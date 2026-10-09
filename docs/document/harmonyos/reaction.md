# 消息表情回复 Reaction

## 功能说明

环信即时通讯 IM 提供消息表情回复功能。用户可以在单聊和群聊中对消息添加或删除 Reaction。Reaction 可以直观表达情绪；在群聊场景下，也可以结合不同 Reaction 的数量实现轻量投票、反馈收集等互动能力。

Reaction 场景示例如下，分别展示如何添加 Reaction、群聊中 Reaction 的效果以及查看 Reaction 列表。

![消息表情回复 Reaction 的效果](/images/android/reactions.png)

## 功能开通

使用 Reaction 前，需在 [环信控制台](https://console.easemob.com/user/login) 开通该功能，具体操作请参见 [环信控制台文档](/product/console/basic_message.html#消息表情回复)。

## 使用限制

- Reaction 仅适用于单聊和群聊，聊天室暂不支持。
- 同一用户对同一条消息上的同一个 Reaction 只能添加一次。
- Reaction 的计数规则和存储时间、每条消息可添加的 Reaction 数量以及表情 ID 规范，详见 [使用限制文档](/product/limitation.html#消息表情回复-reaction)。

## 前提条件

开始前，请确保满足以下条件：

1. 完成 SDK 初始化并登录，详见 [快速开始](quickstart.html)。
2. 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
3. 已在 [环信控制台](https://console.easemob.com/user/login) 开通 Reaction 功能。

## 在消息上添加 Reaction

调用 `ChatManager#addReaction` 可为指定消息添加 Reaction。对于单聊，会话对端用户会收到 `ChatMessageListener#onReactionChanged` 回调；对于群聊，除操作者外的其他群成员会收到该回调。回调信息包括会话 ID、消息 ID、当前消息的 Reaction 列表以及本次 Reaction 操作列表。操作列表包含操作者用户 ID、发生变化的 Reaction 和操作类型，业务侧可据此实时更新消息上的 Reaction 展示。

同一用户对同一条消息上的同一个 Reaction 只能添加一次。重复添加时，SDK 返回错误码 `ChatError.REACTION_HAS_BEEN_OPERATED`（`1301`）。

```typescript
const messageId: string = message.getMsgId();
const reaction: string = '👍';

ChatClient.getInstance().chatManager()?.addReaction(messageId, reaction)
  .then((): void => {
    // 添加成功，更新当前界面。
  })
  .catch((error: ChatError): void => {
    if (error.errorCode === ChatError.REACTION_HAS_BEEN_OPERATED) {
      // 当前用户已添加过该 Reaction。
    }
  });

const listener: ChatMessageListener = {
  onMessageReceived: (messages: Array<ChatMessage>): void => {
    // 处理收到的消息。
  },
  onReactionChanged: (changes: Array<ChatMessageReactionChange>): void => {
    for (const change of changes) {
      const conversationId: string = change.conversationId();
      const changedMessageId: string = change.messageId();
      const reactions: Array<ChatMessageReaction> = change.reactions();
      const operations: Array<ChatMessageReactionOperation> = change.operations();
      // 根据当前 Reaction 列表和本次操作列表刷新消息展示。
    }
  }
};

ChatClient.getInstance().chatManager()?.addMessageListener(listener);
```

不再需要监听时，应调用 `ChatManager#removeMessageListener` 移除同一个监听器实例。

## 删除消息的 Reaction

调用 `ChatManager#removeReaction` 删除当前用户为指定消息添加的 Reaction。删除成功后，单聊中的对端用户以及群聊中除操作者外的其他成员会收到 `ChatMessageListener#onReactionChanged` 回调。操作者可根据 Promise 的执行结果更新当前界面。

如果当前用户未添加过该 Reaction，SDK 返回错误码 `ChatError.REACTION_OPERATION_IS_ILLEGAL`（`1302`）。

```typescript
const messageId: string = message.getMsgId();
const reaction: string = '👍';

ChatClient.getInstance().chatManager()?.removeReaction(messageId, reaction)
  .then((): void => {
    // 删除成功，更新当前界面。
  })
  .catch((error: ChatError): void => {
    if (error.errorCode === ChatError.REACTION_OPERATION_IS_ILLEGAL) {
      // 当前用户未添加过该 Reaction，或无权执行该操作。
    }
  });
```

接收方仍通过 [在消息上添加 Reaction](#在消息上添加-reaction) 中注册的 `ChatMessageListener#onReactionChanged` 回调获取 Reaction 变更。

## 获取消息的 Reaction 列表

调用 `ChatManager#fetchReactions` 可从服务器获取一条或多条指定消息的 Reaction 概览。该方法仅支持单聊和群聊；群聊场景还需传入群组 ID。

返回值为 `Map<string, Array<ChatMessageReaction>>`：key 为消息 ID，value 为该消息的 Reaction 概览列表。每个 Reaction 概览包含 Reaction 内容、添加该 Reaction 的用户数量、当前用户是否添加过该 Reaction，以及最早添加 Reaction 的三个用户的用户 ID。该用户列表仅用于概览展示，并不代表全部用户。若需获取完整用户列表，可调用 `ChatManager#fetchReactionDetail` 分页查询。

```typescript
const messageIds: Array<string> = [message.getMsgId()];
const groupId: string = message.getConversationId();

ChatClient.getInstance().chatManager()?.fetchReactions(
  messageIds,
  ChatType.GroupChat,
  groupId
)
  .then((result: Map<string, Array<ChatMessageReaction>>): void => {
    result.forEach((reactions: Array<ChatMessageReaction>, messageId: string): void => {
      for (const reaction of reactions) {
        const content: string = reaction.reaction();
        const userCount: number = reaction.userCount();
        const userIds: Array<string> = reaction.userIds();
        const isAddedBySelf: boolean = reaction.isAddedBySelf();
        // 展示该消息的 Reaction 概览。
      }
    });
  })
  .catch((error: ChatError): void => {
    // 获取失败。
  });
```

对于已获取并缓存到本地的消息，也可以调用 `ChatMessage#getReactions` 读取消息中的 Reaction 概览：

```typescript
const reactions: Array<ChatMessageReaction> = message.getReactions();
```

## 获取 Reaction 详情

调用 `ChatManager#fetchReactionDetail` 可从服务器分页获取指定消息中指定 Reaction 的详情，包括 Reaction 内容、添加该 Reaction 的用户总数、当前用户是否添加过该 Reaction 以及当前页的用户 ID 列表。

首次查询时，将 `cursor` 设为空字符串。接口返回 `CursorResult<ChatMessageReaction>`；通过 `getResult()` 获取当前页数据，通过 `getNextCursor()` 获取下一页游标。下一页游标为空字符串表示已无更多数据。

```typescript
const params: FetchReactionDetailParams = new FetchReactionDetailParams();
params.messageId = message.getMsgId();
params.reaction = '👍';
params.pageSize = 10;
params.cursor = '';

ChatClient.getInstance().chatManager()?.fetchReactionDetail(params)
  .then((result: CursorResult<ChatMessageReaction>): void => {
    const details: Array<ChatMessageReaction> = result.getResult();
    if (details.length > 0) {
      const detail: ChatMessageReaction = details[0];
      const content: string = detail.reaction();
      const userCount: number = detail.userCount();
      const userIds: Array<string> = detail.userIds();
      const isAddedBySelf: boolean = detail.isAddedBySelf();
      // userIds 为当前页添加该 Reaction 的用户 ID 列表。
    }

    const nextCursor: string = result.getNextCursor();
    // nextCursor 非空时，将其赋值给 params.cursor 以继续获取下一页。
  })
  .catch((error: ChatError): void => {
    // 获取失败。
  });
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`addReaction`](#在消息上添加-reaction) | `ChatManager` | 为指定消息添加 Reaction。 |
| [`removeReaction`](#删除消息的-reaction) | `ChatManager` | 删除当前用户为指定消息添加的 Reaction。 |
| [`fetchReactions`](#获取消息的-reaction-列表) | `ChatManager` | 获取一条或多条消息的 Reaction 概览。 |
| [`fetchReactionDetail`](#获取-reaction-详情) | `ChatManager` | 分页获取指定 Reaction 的详情。 |
| [`getReactions`](#获取消息的-reaction-列表) | `ChatMessage` | 获取本地消息中的 Reaction 概览。 |
| [`onReactionChanged`](#在消息上添加-reaction) | `ChatMessageListener` | 消息 Reaction 发生变化时触发。 |
| [`conversationId`](#在消息上添加-reaction) | `ChatMessageReactionChange` | 获取会话 ID。 |
| [`messageId`](#在消息上添加-reaction) | `ChatMessageReactionChange` | 获取消息 ID。 |
| [`reactions`](#在消息上添加-reaction) | `ChatMessageReactionChange` | 获取消息当前的 Reaction 列表。 |
| [`operations`](#在消息上添加-reaction) | `ChatMessageReactionChange` | 获取本次 Reaction 操作列表。 |
| [`reaction`](#获取消息的-reaction-列表) | `ChatMessageReaction` | 获取 Reaction 内容。 |
| [`userCount`](#获取消息的-reaction-列表) | `ChatMessageReaction` | 获取添加指定 Reaction 的用户数量。 |
| [`userIds`](#获取消息的-reaction-列表) | `ChatMessageReaction` | 获取 Reaction 概览或详情中的用户 ID 列表。 |
| [`isAddedBySelf`](#获取消息的-reaction-列表) | `ChatMessageReaction` | 获取当前用户是否添加过指定 Reaction。 |
| [`userId`](#在消息上添加-reaction) | `ChatMessageReactionOperation` | 获取 Reaction 操作者的用户 ID。 |
| [`operation`](#在消息上添加-reaction) | `ChatMessageReactionOperation` | 获取 Reaction 操作类型。 |
