# Recall Messages

## Feature overview

You can recall a successfully sent message in a one-to-one chat, group chat, or chat room conversation.

**Scope**

- All message types except command messages can be recalled.

**Permission rules**

- In a one-to-one chat, only the sender can recall their own message. The recall fails if the message is older than the recall time limit.
- In a group chat or chat room, regular members can recall only their own messages. The recall fails if the message is older than the recall time limit.
- In a group chat or chat room, the group owner, group admins, chat room owner, and chat room admins can recall messages sent by other members. They are not subject to the recall time limit for regular members and can recall expired messages.

**Time limit**

- By default, senders can recall messages within 2 minutes after sending them.
- You can adjust the message recall period, up to 7 days, on the **EasyIM > Basic Features > Messages** page in the [EasyIM Console](https://console.easemob.com/user/login).

**Recall results**

- After a message is recalled, the message stored on the server is removed, including its historical, offline, and roaming copies.
- The message is also removed from local memory and databases for the sender and recipients.
- For attachment messages, such as image, voice, video, and file messages, the corresponding attachment is also deleted after the message is recalled.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- You have initialized the SDK and established a connection. For details, see [Quickstart](quickstart.html).
- You understand the EasyIM limitations. For details, see [Limitations](/product/limitation.html).
- You registered `ChatManager` and can call message-recall APIs through `client.chatManager`.

## Recall a message

Call `recallMessage` to recall a successfully sent message.

After the call succeeds, the message stored on the server is removed and all relevant members in the conversation receive the `onMessageRecalled` event. In a group chat or chat room, if the group owner, an admin, or a chat room admin recalls a message sent by another member, the message sender also receives this event.

```typescript
const result = await client.chatManager.recallMessage({
  messageId: 'msgServerId', // Server-side message ID
  conversationId: 'user2',
  conversationType: 'singleChat',
  // Optional: Extension information included with the recall, such as "recalled and edited a message"
  ext: { reason: '发错了' },
});
```

## Monitor message recalls

Use `onMessageRecalled` to monitor message-recall events. After a message is recalled, relevant members in the conversation receive this event. The event payload contains the recalled message ID `messageId`, conversation ID `conversationId`, conversation type `conversationType`, and recall time `timestamp`. Your app must update the local message list, recall placeholder text, or attachment display state as needed. Note that the SDK currently does not provide the recaller's user ID, extension information, or full content of the recalled message. If your app needs to display this information, supplement it with local message data or an app-level cache.

```typescript
client.addEventHandler('recall', {
  onMessageRecalled: (event) => {
    console.log('消息被撤回:', event.messageId);
    console.log('会话 ID:', event.conversationId);
    console.log('撤回时间:', event.timestamp);
    // Replace the message identified by messageId in the UI with placeholder text such as "Message recalled."
  },
});
```

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`recallMessage`](#recall-a-message) | `ChatManager` | Recalls a message. |
