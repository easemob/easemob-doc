# Retrieve Historical Messages

## Feature overview

EasyIM provides message roaming, which stores historical messages from all of a user's conversations on the message server. Users can retrieve historical messages on any device, maintaining a consistent conversation experience when switching between devices.

This document describes how the EasyIM SDK retrieves historical messages from the server.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- You have initialized the SDK and connected to the server. For details, see [Quickstart](quickstart.html).
- You registered `ChatManager` during SDK initialization and can call historical-message APIs through `client.chatManager`.

## Retrieve messages in a specified conversation from the server with pagination

Call `getHistoryMessages` to retrieve historical messages in a specified conversation from the server with pagination. Use parameters such as `searchDirection`, `senderIds`, `messageTypes`, `startTime`, and `endTime` to control the retrieval direction and filters. To ensure data reliability, we recommend retrieving 20 messages at a time, with a maximum of 50.

For a group chat, set `senderIds` to retrieve historical messages sent by one or more group members.

:::tip
1. **By default, you can retrieve historical messages from one-to-one chats and group chats. To retrieve historical chat room messages, contact the EasyIM business manager.**
2. When retrieving historical one-to-one messages, the SDK reads the delivery and read states stored on the server. This feature is disabled by default. To enable it, contact the EasyIM business manager.
3. The storage period for historical messages on the server depends on your plan. For details, see [EasyIM Plan Features](/product/product_package_feature.html).
:::

```typescript
const result = await client.chatManager.getHistoryMessages({
  conversationId: 'user2',
  conversationType: 'singleChat',
   pageSize: 20, // Number of messages retrieved per page. The value range is 1-50 and the default is 20. If the total number of messages that match the query is greater than `pageSize`, `pageSize` messages are returned. If it is less than `pageSize`, the actual number is returned. When all messages have been retrieved, fewer than `pageSize` messages are returned.
  cursor: '', // Pagination cursor. For the first request, omit this parameter or pass `null` / `''` at runtime. For subsequent requests, pass the `cursor` from the previous result. An empty `cursor` in the result indicates that the last page has been reached.
  searchDirection: 'down', // 'up' for the previous page | 'down' for the next page
});

console.log('Message list:', result.items);
console.log('Next-page cursor:', result.cursor);
console.log('Has more:', result.hasMore);
```

You can also call `getHistoryMessages` to retrieve historical messages in a specified conversation from the server and specify whether to retrieve them in chronological or reverse chronological order.

To ensure data reliability, we recommend retrieving 20 messages at a time, with a maximum of 50. If more data is available, continue retrieving pages using the returned `cursor`.

```typescript
const result = await client.chatManager.getHistoryMessages({
  conversationId: 'group1',
  conversationType: 'groupChat',
  pageSize: 20,
  cursor: '',
  senderIds: ['user1'],        // Filter by sender. This parameter takes effect only in group chats.
  messageTypes: ['text'],      // Filter by message type.
  startTime: 1700000000000,    // Start timestamp in milliseconds.
  endTime: 1700100000000,      // End timestamp in milliseconds.
  },
});
```

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`getHistoryMessages`](#retrieve-messages-in-a-specified-conversation-from-the-server-with-pagination) | `ChatManager` | Retrieves historical messages in a specified conversation from the server with pagination. |
