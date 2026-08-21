# Pin Messages

## Feature overview

Pinning a message marks an important message in a conversation so that conversation members can view important messages together and locate them quickly.

**One-to-one chats, group chats, and chat rooms all support this feature.** The pin state is stored on the server and synchronized among relevant users in the same conversation.

Multiple messages can be pinned in the same conversation. An app can retrieve the pinned message list for a specified conversation from the server and update the page through pinned-message events. For an individual message, the app can also read details such as the operator who pinned it and the pin time.

## Feature activation

Before using message pinning, contact the EasyIM business manager to enable it.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- You have initialized the SDK and connected to the server. For details, see [Quickstart](quickstart.html).
- You understand the EasyIM API limitations. For details, see [Limitations](/product/limitation.html).

## Pin a message

Call `pinMessage` to pin a message in a specified conversation. After the message is pinned, the `onPinnedMessageChanged` event is triggered with `operation` set to `pin`.

Multiple members of the same conversation can pin the same message in succession. If the same message is pinned repeatedly, its pin information is updated to the most recent operation, including the latest operator and pin time.

By default, up to 20 messages can be pinned in a conversation. Contact the EasyIM business manager to increase this limit to a maximum of 100.

If the number of pinned messages reaches the server limit, `pinMessage` may return error code `4` with the error reason `pin_message_limit`.

```typescript
await client.chatManager.pinMessage({
  conversationId: 'group1',
  conversationType: 'groupChat',
  messageId: 'msg-id-123',
});
```

## Unpin a message

Call `unpinMessage` to unpin a message in a specified conversation. After the message is unpinned, the `onPinnedMessageChanged` event is also triggered with `operation` set to `unpin`.

The message no longer appears in the pinned message list for the conversation.

```typescript
await client.chatManager.unpinMessage({
  conversationId: 'group1',
  conversationType: 'groupChat',
  messageId: 'msg-id-123',
});
```

## Retrieve pinned messages in a conversation

Call `getPinnedMessageList` to retrieve the pinned message list for a specified conversation. The SDK returns messages in descending order by pin time. Each item in the result is a `PinnedMessageSummary` that contains the complete message object, the operator who pinned it, the pin time, and other information.

This API does not use pagination and currently returns **up to 20 pinned messages**.

:::tip 
1. If a pinned message expires on the server or the current user deletes it from the server only for themselves, the current user can no longer retrieve it through message roaming. However, the current user and other users can still retrieve it from the pinned message list.  
2. If a user recalls a pinned message, the message is removed from the server. No user can subsequently retrieve it from the server-side pinned message list.
:::

Example code:

```typescript
const result = await client.chatManager.getPinnedMessageList({
  conversationId: 'group1',
  conversationType: 'groupChat',
});

for (const item of result.items) {
  console.log('置顶消息 ID:', item.messageId);
  console.log('置顶时间:', item.pinnedAt);
  console.log('置顶消息:', item.message);
}
```

## Monitor pinned-message events

Use `onPinnedMessageChanged` to monitor changes to the message pin state. The event payload contains the message ID, conversation ID, conversation type, and operation type, and may contain the operator and pin time. In this payload:

- An `operation` value of `pin` indicates that a message was pinned. In this case, the event may contain `pinTime`.
- An `operation` value of `unpin` indicates that a message was unpinned.

With multi-device login, after a message is pinned or unpinned, the current user's other logged-in devices also receive the `onPinnedMessageChanged` event.

```typescript
client.addEventHandler('pin', {
  onPinnedMessageChanged: (event) => {
    console.log('操作:', event.operation); // 'pin' | 'unpin'
    console.log('消息 ID:', event.messageId);
    console.log('操作者:', event.operatorId);
  },
});
```
