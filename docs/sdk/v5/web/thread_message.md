# Manage Messages in Message Threads

## Feature overview

A message thread is a sub-conversation of chat group messages. Messages in a message thread are group messages. When sending one, set `isChatThread: true` in the message creation parameters and use the message thread ID as the conversation ID.

The EasyIM SDK supports using `ChatManager` to manage messages in message threads, including sending, receiving, recalling, and retrieving historical messages from the server. `ChatThreadManager` provides capabilities for creating, joining, leaving, and managing the members of message threads.

## Message sending and receiving process

The process for sending and receiving messages is as follows:

Client A sends a message in a message thread. After the message is sent to the EasyIM server, the server delivers it to the other members of the message thread. After Client B receives the message, the SDK triggers a message event. Client B monitors the event and retrieves the message content. For a message in a message thread, `isChatThread` in the message object is `true`, and the message may carry the `chatThread` context. If a parent group message carries message-thread overview information, the information is returned through `chatThreadOverview`.

The following images show how to create and view a message thread:

![img](/images/web/web_group_chat_chreat_new_thread_step_01.png)

![img](/images/web/web_group_chat_new_thread_created.png)

## Feature activation

Before using message threads, contact the EasyIM business manager to enable the feature.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- You have initialized and logged in to the SDK. For details, see [Quickstart](quickstart.html).
- You have registered `ChatManager`. To create or manage message threads, also register `ChatThreadManager`.
- You understand the limits on message threads and the number of message thread members. For details, see [Limitations](/product/limitation.html).
- You have contacted the EasyIM business manager to enable message threads.

## Send a message in a message thread

Sending a message in a message thread is similar to sending a group message. For details, see [Send Messages](message_send.html). The difference is that for a message in a message thread, set `conversationId` to the message thread ID, `conversationType` to `groupChat`, and `isChatThread: true`.

After the message is sent successfully, message thread members can receive it through the `onMessage` event. Members of the chat group to which the message thread belongs can also receive message-thread state updates through message-thread events.

Example code:

```typescript
// Send a text message in a message thread.
async function sendTextMessage() {
  const message = client.chatManager.createTextMessage({
    // Message thread ID.
    conversationId: 'chatThreadId',
    // A message in a message thread is a group message.
    conversationType: 'groupChat',
    // Message content.
    content: 'message content',
    // Mark the message as a message in a message thread.
    isChatThread: true,
  });

  try {
    await client.chatManager.sendMessage(message);
    console.log('Send text message success.');
  } catch (e) {
    console.log('Send text message error.', e);
  }
}
```

## Receive messages in a message thread

Use `addEventHandler` to register a message listener and receive messages. For details, see [Receive Messages](message_receive.html). All SDK message types are received through the `onMessage` callback. If the received message is in a message thread, `isChatThread` in the message object is `true`.

Example code:

```typescript
// Monitor received messages.
client.addEventHandler('thread-message', {
  onMessage: (message) => {
    if (message.isChatThread) {
      console.log('Received thread message:', message);
      console.log('Thread context:', message.chatThread);
      // A message in a message thread was received. Add your business logic.
    }
  },
});
```

## Recall a message in a message thread

Recalling a message in a message thread is similar to recalling a group message. For details, see [Recall Messages](message_recall.html). In the SDK, the recall API does not require `isChatThread`. Locate the message in the message thread using the message thread ID and the `groupChat` conversation type.

Message thread members can monitor message recalls through the `onMessageRecalled` event.

Example code:

```typescript
try {
  const result = await client.chatManager.recallMessage({
    // Server-side ID of the message to recall.
    messageId: 'msgServerId',
    // Message thread ID.
    conversationId: 'chatThreadId',
    // A message in a message thread is a group message.
    conversationType: 'groupChat',
  });
  console.log('Recall message success:', result);
} catch (error) {
  // Message recall failed, for example, because the recall time limit was exceeded.
  console.log('Recall message failed:', error);
}

// Monitor message-recall events.
client.addEventHandler('thread-message-recall', {
  onMessageRecalled: (event) => {
    if (event.conversationType === 'groupChat') {
      console.log('Thread message recalled:', event.messageId);
      // A message in a message thread was recalled. Add your business logic.
    }
  },
});
```

## Retrieve messages in a message thread from the server

Call `client.chatManager.getHistoryMessages` to retrieve historical messages in a message thread from the server. This is similar to retrieving historical group messages, except that you pass the message thread ID to `conversationId` and set `conversationType` to `groupChat`.

```typescript
const result = await client.chatManager.getHistoryMessages({
  // Message thread ID.
  conversationId: 'chatThreadId',
  // A message in a message thread is a group message.
  conversationType: 'groupChat',
  // Number of messages retrieved per page. The value range is 1-50, and the default is 20.
  pageSize: 20,
  // Pagination cursor. For the first request, omit it or pass `null` / `''` at runtime. For subsequent requests, pass the `cursor` from the previous result. An empty returned `cursor` indicates that the last page has been reached.
  cursor: '',
  // Message search direction: `up` retrieves earlier messages, and `down` retrieves newer messages.
  searchDirection: 'up',
});

console.log('Message list:', result.items);
console.log('Next cursor:', result.cursor);
console.log('Has more:', result.hasMore);
$([Environment]::NewLine)
```

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`createTextMessage`](#send-a-message-in-a-message-thread) | `ChatManager` | Creates a text message in a message thread. Set `conversationType` to `groupChat` and `isChatThread: true` during creation. |
| [`sendMessage`](#send-a-message-in-a-message-thread) | `ChatManager` | Sends a message in a message thread. |
| [`recallMessage`](#recall-a-message-in-a-message-thread) | `ChatManager` | Recalls a message in a message thread. |
| [`getHistoryMessages`](#retrieve-messages-in-a-message-thread-from-the-server) | `ChatManager` | Retrieves historical messages in a specified message thread from the server. |
