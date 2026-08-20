# Message Reactions

## Feature overview

EasyIM provides the Reaction feature. Users can add Reactions to or remove them from messages in one-to-one and group chats. Reactions visually express emotions. In group chats, the counts of different Reactions can also support lightweight polls, feedback collection, and other interactions.

- Add a Reaction:

![](/images/web/web_chat_reaction_add_reaction.png)

- View Reactions:

![](/images/web/web_group_chat_reaction_detail_another_version.png)

## Feature activation

To use the Reaction feature, enable it in the [Easemob Console](https://console.easemob.com/user/login). For detailed steps, see the [Easemob Console documentation](/product/console/basic_message.html#消息表情回复).

## Limitations

- Reactions currently apply only to one-to-one and group chats. Chat rooms are not supported.
- For Reaction counting rules, storage period, per-user addition limits, the number of Reactions that can be added to each message, and Reaction ID requirements, see [Limitations](limitation.html).

## Prerequisite

Before you begin, ensure that the following requirements are met:

1. You have initialized the SDK. For details, see [Quickstart](quickstart.html).
2. You registered `ChatManager` during SDK initialization.
3. You understand the EasyIM API [limitations](/product/limitation.html).
4. You enabled the Reaction feature in the [Easemob Console](https://console.easemob.com/user/login).

## Add a Reaction to a message

Call `addReaction` to add a Reaction to a message. For one-to-one and group chats, conversation members receive the `onReactionChanged` event. The event contains the message ID, conversation ID, conversation type, message sender, message recipient, complete Reaction list on the current message, and update timestamp. Use this information to update the message's Reaction display in real time.

The current user can add the same Reaction to the same message only once. If the user adds it again, the SDK typically returns error code `1301` with the error key `reaction_already_operated`. Your app can handle this uniformly as “This Reaction has already been added.”

Example code:

```typescript
await client.chatManager.addReaction({
  messageId: 'msg-id-123',
  reaction: '👍',
});
```

To monitor Reaction changes, register the following event:

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

## Remove a Reaction from a message

Call `removeReaction` to remove a Reaction that the current user added to a message. For one-to-one and group chats, conversation members receive the `onReactionChanged` event. Update the UI using the latest `reactions` list in the event.

Example code:

```typescript
await client.chatManager.removeReaction({
  messageId: 'msg-id-123',
  reaction: '👍',
});
```

## Retrieve a message's Reaction list

Call `getReactionList` to retrieve the Reaction summary lists for one or more messages from the server. The summary for each message contains:
- The message ID.
- A summary of each Reaction on the message. Each summary contains the Reaction, number of users who added it, whether the currently logged-in user added it, and the user IDs of the first three users who added it.

To query the Reaction list for a group message, pass `groupId`, as shown in the following example:

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

## Retrieve Reaction details

Call `getReactionDetail` to retrieve details about a Reaction on a specified message from the server. The details include the Reaction, number of users who added it, whether the current user added it, user ID list of users who added it, pagination cursor, whether more data is available, and Reaction creation time.

```typescript
const detail = await client.chatManager.getReactionDetail({
  messageId: 'msg-id-123',
  reaction: '👍',
  // Number of users who added this Reaction to return per page, which is the maximum number of `reactionUsers` entries in the result.
  // The default is 20, and the maximum is 100.
  pageSize: 20,
  // cursor: Cursor from which to retrieve data. For the first call, pass `null`, an empty string (''), or omit this field. For subsequent calls, pass res.data.cursor from the previous result. An empty cursor value ('') indicates that the current page is the last page.
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

Each item in `reactionUsers` contains the following information:

- `userId`: User ID of a user who added the Reaction.
- `user`: User object. The current SDK return value contains at least `userId`.
- `createdAt`: Time when the user added the Reaction.

## Retrieve Reactions in roaming messages

Call `getHistoryMessages` to retrieve roaming messages. If a Reaction was added to a historical message, the returned message object contains the `reactions` field, which describes the message's current Reaction summary.

Example code:

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

## API list

| API name                                           | Module/Class   | Description                                                |
| -------------------------------------------------- | ------------- | --------------------------------------------------- |
| [`addReaction`](#add-a-reaction-to-a-message)            | `ChatManager` | Adds a Reaction to a message.                             |
| [`removeReaction`](#remove-a-reaction-from-a-message)           | `ChatManager` | Removes a Reaction added by the current user from a message.               |
| [`getReactionList`](#retrieve-a-messages-reaction-list)     | `ChatManager` | Retrieves the Reaction summary lists for one or more messages.            |
| [`getReactionDetail`](#retrieve-reaction-details)         | `ChatManager` | Retrieves details about a Reaction on a specified message.                |
| [`getHistoryMessages`](#retrieve-reactions-in-roaming-messages) | `ChatManager` | Retrieves historical messages and reads their `reactions` fields. |
