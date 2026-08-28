# Message Receipts

## Feature overview

A **message delivery receipt** indicates that a message has been successfully delivered to the recipient's device. After the recipient enables this feature, the SDK automatically sends a delivery receipt to the sender when it receives a one-to-one message. The sender can use this receipt to confirm that the message reached the recipient's client.

A **message read receipt** indicates that the recipient has read a specified message. After reading the message, the recipient must send a read receipt. When the sender receives the receipt, the sender can update the read state of the corresponding message.

The following image shows message delivery and read receipts:

![img](/images/web/message_receipt.png)

## Limitations

- One-to-one conversations support message delivery receipts and message read receipts.
- Group conversations support message read receipts but not message delivery receipts.
- Chat rooms currently support neither message delivery receipts nor message read receipts.
- **To use group message read receipts, [enable the feature in the EasyIM Console](/product/console/basic_single_group_chat.html#group-message-read-receipts).**

## Prerequisite

- You have completed [SDK initialization](initialization.html) and implemented account registration and login.
- You have registered `ChatManager` and use `client.chatManager` to call the message, receipt, and event-monitoring APIs in this document.
- To use group message read receipts, you have [enabled the feature in the EasyIM Console](/product/console/basic_single_group_chat.html#group-message-read-receipts).
- You understand the EasyIM limitations. For details, see [Limitations](/product/limitation.html).

## Understand the tech

#### One-to-one message delivery receipts

The following diagram shows the process for implementing one-to-one message delivery receipts:

![img](/images/web/message_delivery_receipt.png)

The basic steps are as follows:

1. The sender registers a message listener for the delivery-receipt event `onMessageDelivered`.
2. The recipient sets `enableDeliveryReceipt: true` during SDK initialization.
3. After receiving a one-to-one message, the recipient's SDK automatically sends a delivery receipt to the sender. No manual API call is required.
4. When the sender receives the `onMessageDelivered` event, the recipient's SDK has sent a delivery receipt. The sender's app can then update the local display state, for example by marking the message as delivered.

#### Message read receipts

The SDK uses `sendMessageReadReceipts` to send read receipts for one-to-one and group messages. The sender receives receipts through the `onMessageReadReceipts` event.

The following diagram shows the process for implementing message read receipts:

![img](/images/web/message_read_receipt.png)

The basic steps are as follows:

1. The sender registers a message listener for the read-receipt event `onMessageReadReceipts`.
2. After the recipient receives a one-to-one or group message and the user reads it, the recipient calls `sendMessageReadReceipts` to send a read receipt.
3. After the original sender receives the `onMessageReadReceipts` event, the sender can update the read state of the corresponding messages using `messageIds` in the event.

For a group message, if the sender needs to track which group members have read it, set `needReadReceipt: true` when sending the message. After group members read it and send read receipts, the sender can detect the read state through `onMessageReadReceipts`. To retrieve the list of members who have read a group message, call `getGroupMessageReadUsers`.

## One-to-one message delivery receipts

#### Step 1: Enable delivery receipts on the recipient

The recipient sets `enableDeliveryReceipt: true` during SDK initialization. The default value is `false`.

```typescript
const client = ChatClient.init({
  appKey: 'org#app',
  // Enable one-to-one message delivery receipts.
  enableDeliveryReceipt: true,
  managers: [ChatManager],
});
```

#### Step 2: Monitor delivery receipts on the sender

The sender monitors the `onMessageDelivered` event.

```typescript
client.chatManager.addEventHandler('message-delivery-listener', {
  onMessageDelivered: event => {
    // ID of the original message that was delivered.
    console.log('Message delivered:', event.messageId);
    // Conversation ID.
    console.log('Conversation ID:', event.conversationId);
    // Conversation type. This value is always singleChat for a one-to-one chat.
    console.log('Conversation type:', event.conversationType);
  },
});
```

#### Step 3: Send a one-to-one message

Send a one-to-one message:

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: 'user2',
  conversationType: 'singleChat',
  content: 'Hello',
});

await client.chatManager.sendMessage(message);
```

After receiving the one-to-one message, the recipient's SDK automatically sends a delivery receipt to the sender. After receiving `onMessageDelivered`, the sender can update the local message state.

## One-to-one message read receipts

A one-to-one message read receipt notifies the sender that the recipient has read a specified one-to-one message.

:::tip
A message's read receipt remains valid for as long as the message is stored on the server. Read receipts can be sent throughout the server-side storage period. The storage period depends on your plan. For details, see [EasyIM Plan Features](/product/product_package_feature.html). 
:::

#### Step 1: Register a read-receipt listener on the sender

```typescript
client.chatManager.addEventHandler('single-read-receipt-listener', {
  onMessageReadReceipts: receipts => {
    for (const receipt of receipts) {
      console.log('Conversation ID:', receipt.conversationId);
      console.log('Conversation type:', receipt.conversationType); // singleChat
      console.log('Read message ID list:', receipt.messageIds);
      console.log('Receipt time:', receipt.timestamp);
    }
  },
});
```

#### Step 2: Send a one-to-one message

Send a one-to-one message. You do not need to set `needReadReceipt: true` for a one-to-one message. After reading the message, the recipient can directly send a one-to-one message read receipt.

```typescript
const message = client.chatManager.createTextMessage({
  // Recipient user ID.
  conversationId: 'user2',
  // Conversation type: one-to-one chat.
  conversationType: 'singleChat',
  // Text message content.
  content: 'Hello',
});

await client.chatManager.sendMessage(message);
```

#### Step 3: Send a read receipt on the recipient

After receiving and reading the message, the recipient calls `sendMessageReadReceipts` to send a message read receipt.

```typescript
client.chatManager.addEventHandler('single-message-listener', {
  onMessage: async message => {
    if (message.conversationType !== 'singleChat') {
      return;
    }

    await client.chatManager.sendMessageReadReceipts({
      conversationId: message.conversationId,
      // Only `singleChat` and `groupChat` are supported.
      conversationType: 'singleChat',
      // `messageIds` must be a non-empty array containing no more than 50 message IDs. A single call can send read receipts only for messages in the same conversation.
      messageIds: [message.msgServerId],
    });
  },
});
```

:::tip
`sendMessageReadReceipts` sends only message-level read receipts. It does not update the conversation-level read position or directly clear the local conversation unread count. To clear the conversation unread count, see [Clear Conversation Unread Counts](conversation_unread.html).
:::

#### Step 4: Update the message state after the sender receives a read receipt

After receiving the `onMessageReadReceipts` event, the sender can update the read state of the corresponding messages using `messageIds` in the event.

## Group message read receipts

When sending a group message, a group member can specify whether the message requires a read receipt. If it does, after reading the message, group members should call `sendMessageReadReceipts` at an appropriate time to send read receipts. The read receipt count is the number of group members who have read the message and successfully sent a receipt.

The following table lists the limitations of group message read receipts:

| Limitation       | Default       | Description                                                         |
| :------- | :------- | :-------------- |
| Feature activation       | Disabled       | To use this feature, enable **Group Message Read Receipts** on the **EasyIM** > **Basic Features** > **Messages** page in the [EasyIM Console](https://console.easyim.ai/user/login). If the feature is not enabled, the SDK returns error code `505` with the key `SERVICE_NOT_ENABLED`. |
| Permission       | All group members | By default, all group members can request group message read receipts when sending messages. To limit this feature to the group owner and group admins, contact the EasyIM business manager. If this setting is enabled and a regular member sends a message that requires a group message read receipt, the SDK returns error code `603` with the key `GROUP_PERMISSION_DENIED`.    |
| Read receipt validity period | 3 days       | The default validity period for group message read receipts is 3 days. After this period, the server no longer records new read states for the message, and the SDK returns error code `506` with the key `MESSAGE_EXPIRED`. |
| Group size   | 200 members | This feature currently supports groups with up to 200 members. If the group size exceeds this limit, group messages may no longer produce valid read receipt statistics. If the server returns `limit send group ack msg`, the SDK may return error code `4` with the key `SERVICE_LIMIT_EXCEEDED`. |
| Who can view the read count   | Message sender | By default, only the sender can view the read count or list of members who have read a group message. To allow all group members to view this information, contact the EasyIM business manager to enable the option. |

:::tip
A message's read receipt remains valid for as long as the message is stored on the server. Read receipts can be sent throughout the server-side storage period. The storage period depends on your plan. For details, see [EasyIM Plan Features](/product/product_package_feature.html). 
:::

#### Step 1: Send a group message that requires read receipts

When sending a group message, set `needReadReceipt: true` during message creation to request read receipts after group members read it.

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: 'group_1',
  conversationType: 'groupChat',
  content: 'hello group',
  // Request group message read receipts.
  needReadReceipt: true,
});

await client.chatManager.sendMessage(message);
```

#### Step 2: Register a read-receipt listener on the sender

The group message sender receives group message read receipts through `onMessageReadReceipts`.

```typescript
client.chatManager.addEventHandler('group-read-receipt-listener', {
  onMessageReadReceipts: receipts => {
    for (const receipt of receipts) {
      console.log('Group ID:', receipt.conversationId);
      console.log('Conversation type:', receipt.conversationType); // groupChat
      console.log('Read message ID list:', receipt.messageIds);
      console.log('Receipt time:', receipt.timestamp);
    }
  },
});
```

#### Step 3: Send a read receipt as a group member

After reading the message, a group member calls `sendMessageReadReceipts` to send a group message read receipt.

```typescript
await client.chatManager.sendMessageReadReceipts({
  conversationId: groupMessage.conversationId,
  // Only `singleChat` and `groupChat` are supported.
  conversationType: 'groupChat',
  // `messageIds` must be a non-empty array containing no more than 50 message IDs. A single call can send read receipts only for messages in the same conversation.
  messageIds: [groupMessage.msgServerId],
});
```

## Retrieve group message read receipt details

### Retrieve the members who have read a group message

The message sender can call `getGroupMessageReadUsers` to retrieve a paginated list of members who have read a specified group message.

```typescript
const result = await client.chatManager.getGroupMessageReadUsers({
  groupId: 'group_1',
  messageId: 'msg-id-123',
  pageSize: 20,
  // Pagination cursor. For the first request, omit this parameter or pass `null` / `''` at runtime. For subsequent requests, pass the `cursor` from the previous result. An empty `cursor` in the result indicates that the last page has been reached.
  cursor: '',
});

console.log('Group ID:', result.groupId);
console.log('Message ID:', result.messageId);
console.log('Read member list:', result.users);
console.log('Total number of members who have read the message:', result.count);
console.log('Next-page cursor:', result.cursor);
console.log('Has more:', result.hasMore);
```

Each item in `result.users` contains the following fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| `userId` | String | User ID of the member who read the message. |
| `user` | UserInfo | User profile summary of the member who read the message. |
| `ackId` | String | Server-side receipt ID. |
| `timestamp` | Number | Read timestamp in milliseconds. |
| `ackContent` | String | Custom receipt content returned by the server. Currently, `sendMessageReadReceipts` does not support passing this field. |

### Retrieve read counts for multiple group messages

You can also call `getGroupMessageReadReceipts` to retrieve the read counts for a group of messages in a batch. This API supports only group chats.

```typescript
const details = await client.chatManager.getGroupMessageReadReceipts({
  conversationId: 'group_1',
  conversationType: 'groupChat',
  // You can pass up to 20 message IDs.
  messageIds: ['msg-id-1', 'msg-id-2'],
});

details.forEach(item => {
  console.log('Message ID:', item.messageId);
  console.log('Read count:', item.count);
});
```

Each item in the result is a `MessageReadReceiptDetail` and contains the following fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| `messageId` | String | Group message ID. |
| `count` | Number | Read count for the message. |

## Event descriptions

| Event | Trigger conditions | Recipient |
| :--- | :--- | :--- |
| `onMessageDelivered` | Triggered after the recipient's SDK automatically sends a one-to-one message delivery receipt. | Sender of the one-to-one message. |
| `onMessageReadReceipts` | Triggered after the peer user or a group member calls `sendMessageReadReceipts` to send read receipts for one or more messages. | Message sender. |
| `onMessage` | Triggered after a regular message is received. | Message recipient. The sender's other online devices may also receive this event. |

The event payload of `onMessageReadReceipts` is an array. Each receipt object contains the following fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| `conversationId` | String | Conversation ID. For a one-to-one chat, this is the peer user ID. For a group chat, this is the group ID. |
| `conversationType` | String | Conversation type. Valid values are `singleChat` and `groupChat`. |
| `messageIds` | List | List of message IDs included in this receipt. |
| `timestamp` | Number | Receipt timestamp. |

## Considerations

- Message delivery receipts support only one-to-one chats. Group chats and chat rooms are not supported.
- Message read receipts support only one-to-one chats and group chats. Chat rooms are not supported.
- The local caller of `sendMessageReadReceipts` does not receive `onMessageReadReceipts`. This event is sent to the message sender.
- `sendMessageReadReceipts` does not update the conversation-level read position or directly clear the local conversation unread count.
- To clear conversation unread counts, call `clearConversationUnreadMessageCount` or `clearAllConversationUnreadMessageCount`. For details, see [Clear Conversation Unread Counts](conversation_unread.html).
- `needReadReceipt` is primarily used to count group message read receipts. You do not need to set this parameter for one-to-one message read receipts, and chat room messages do not support read receipts.

## Relationship between message read receipts and conversation unread counts

`sendMessageReadReceipts` is not directly related to conversation unread counts. After you call this method, the local conversation unread count of the caller does not change and is not automatically cleared. This method primarily sends message read receipts to the original sender to indicate that one or more one-to-one or group messages have been read.

To clear the unread count of a conversation after a user enters it, call `clearConversationUnreadMessageCount`. To clear the unread counts of all conversations, call `clearAllConversationUnreadMessageCount`.

## API list

| API | Module or class | Description |
| --- | --- | --- |
| [`ChatClient.init`](#step-1-enable-delivery-receipts-on-the-recipient) | `ChatClient` | Initializes the SDK. The recipient can enable automatic one-to-one delivery receipts through `enableDeliveryReceipt`. |
| [`createTextMessage`](#step-1-send-a-group-message-that-requires-read-receipts) | `ChatManager` | Creates a text message. Set `needReadReceipt: true` when group message read statistics are required. |
| [`sendMessage`](#step-1-send-a-group-message-that-requires-read-receipts) | `ChatManager` | Sends a message. |
| [`sendMessageReadReceipts`](#step-3-send-a-read-receipt-as-a-group-member) | `ChatManager` | Sends read receipts for multiple one-to-one or group messages. |
| [`getGroupMessageReadUsers`](#retrieve-the-members-who-have-read-a-group-message) | `ChatManager` | Retrieves a paginated list of members who have read a specified group message. |
| [`getGroupMessageReadReceipts`](#retrieve-read-counts-for-multiple-group-messages) | `ChatManager` | Retrieves read counts for multiple group messages. |
