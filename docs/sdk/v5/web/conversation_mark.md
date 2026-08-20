# Conversation Tags

## Feature overview

Conversation tags classify conversations for business purposes, such as starred, pending, or important-customer conversations. The Web SDK supports adding tags to or removing them from one-to-one, group, and chat room conversations. A conversation supports up to 20 tags, and you define and maintain the business meaning of each tag.

:::tip
Conversation tags are used only for classification and filtering. They do not affect the unread count, message sending or receiving, pin status, or message read status.
:::

## Feature activation

Conversation tags are part of the server-side conversation list feature. Before using them, [activate the server-side conversation list feature in Easemob Console](/product/console/basic_conversation_group_chatroom.html#服务端会话列表).

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and connect to the server. For details, see [Quickstart](quickstart.html).
- Register `ChatManager` during SDK initialization so that conversation APIs can be called through `client.chatManager`.
- Activate the [server-side conversation list feature](/product/console/basic_conversation_group_chatroom.html#服务端会话列表).
- Understand the EasyIM API [limitations](/product/limitation.html).

## Add conversation tags

Call `addConversationMark` to add a specified tag to one or more conversations.

After a conversation tag is added, the tag data is updated on the server and in the SDK's local conversation list cache. Conversation tags are automatically synchronized locally with the server-side conversation list after login. When synchronization finishes, call `client.chatManager.getConversationList()` to read the local conversation list and obtain all tags for a conversation from its `marks` field.

If the server-side conversation list reaches its limit, which is 100 conversations by default, the server may remove inactive conversations based on activity. After a conversation is removed from the server-side list, its tags may no longer be synchronized locally with that list.

- Add a tag to a single conversation:

```typescript
const result = await client.chatManager.addConversationMark({
  conversationId: 'user2',
  conversationType: 'singleChat',
  mark: 0, // Tag number 0-19. A conversation supports up to 20 tags.
});

console.log(result.succeeded, result.failed, result.mark, result.operation);
```

- Add a tag to multiple conversations in a batch:

```typescript
const result = await client.chatManager.addConversationMark({
  conversations: [
    { conversationId: 'user2', conversationType: 'singleChat' },
    { conversationId: 'group1', conversationType: 'groupChat' },
  ],
  mark: 0, // Tag number 0-19
});

console.log(result.succeeded, result.failed);
```

The parameters are as follows:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `conversationId` | String | Conditionally required | Conversation ID. Pass it for a single-conversation operation. For one-to-one chat, it is the peer user ID; for group chat, the chat group ID; and for chat room chat, the chat room ID. |
| `conversationType` | String | Conditionally required | Conversation type. Pass it for a single-conversation operation. Possible values are `singleChat`, `groupChat`, and `chatRoom`. |
| `conversations` | Array | Conditionally required | Conversation list. Pass it for a batch operation. The array cannot be empty. |
| `mark` | Number | Yes | Conversation tag to add. The value range is an integer from `0` through `19`. |

The result is returned as `ConversationMarkMutationResult` with the following fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| `succeeded` | Array | List of conversations to which the tag change was successfully applied. |
| `failed` | Array | List of conversations to which the tag change could not be applied. A failed item may contain `reason`. |
| `mark` | Number | Tag slot involved in this operation. |
| `operation` | String | Tag operation type. The value is `addMark` when adding a tag. |

## Remove conversation tags

Call `removeConversationMark` to remove a specified tag from one or more conversations.

- Remove a tag from a single conversation:

```typescript
const result = await client.chatManager.removeConversationMark({
  conversationId: 'user2',
  conversationType: 'singleChat',
  mark: 0,
});

console.log(result.succeeded, result.failed, result.mark, result.operation);
```

- Remove a tag from multiple conversations in a batch:

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

`removeConversationMark` uses the same parameters as `addConversationMark`. The `operation` value in the result is `removeMark`.

## Filter the conversation list by tag

After a tag is added, the `marks` field of the conversation object contains the conversation's existing tag slots. Call `getConversationList({ mark })` to filter conversations with a specified tag from the SDK's local conversation list cache.

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

To refresh the conversation list from the server first, call `refreshSessionList`:

```typescript
await client.chatManager.refreshSessionList({
  includeEmpty: false,
});

const markedConversations = client.chatManager.getConversationList({
  mark: 0,
});
```

:::tip
`getConversationList` reads the SDK's local conversation list cache without initiating a network request. By default, it does not return empty conversations whose last message is empty.
:::

## Monitor conversation list updates

After a conversation tag is added or removed, if the local conversation list cache changes, the SDK triggers `onConversationListUpdate` with `reason` set to `local`. Monitor this event to refresh the conversation list UI.

```typescript
client.chatManager.addEventHandler('conversation-mark-listener', {
  onConversationListUpdate: payload => {
    console.log('会话列表更新原因:', payload.reason);
    console.log('当前完整会话列表:', payload.items);
    console.log('本次变化补丁:', payload.patch);
  },
});
```

In the event callback, `items` is the SDK's current complete and sorted conversation list snapshot. A simple UI can use it directly to refresh the list. If the business layer must retain custom local fields, use `patch` for incremental merging.

## Considerations

- Conversation tag values range from `0` through `19`. Maintain the business meaning of each slot in your business layer.
- `addConversationMark` and `removeConversationMark` support both a single conversation and multiple conversations passed through `conversations` for batch operations.
- If `mark` is not an integer from `0` through `19`, or the target conversation list is invalid, the SDK returns parameter error `110`.
- Conversation tags are written to the server and synchronized to the SDK's local conversation list cache. If the local conversation list changes, `onConversationListUpdate` is triggered.
- Conversation tags do not affect the unread count, message read status, message sending or receiving, or pin status.
- If the server-side conversation list reaches its limit, the server may remove inactive conversations based on activity. The corresponding conversation tags then also become unavailable with the conversation list data.

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`addConversationMark`](#add-conversation-tags) | `ChatManager` | Add a specified tag to one or more conversations. |
| [`removeConversationMark`](#remove-conversation-tags) | `ChatManager` | Remove a specified tag from one or more conversations. |
| [`getConversationList`](#filter-the-conversation-list-by-tag) | `ChatManager` | Read the conversation list from the SDK's local cache and filter it by tag. |
| [`refreshSessionList`](#filter-the-conversation-list-by-tag) | `ChatManager` | Refresh the conversation list from the server and update the SDK's local conversation list cache. |
