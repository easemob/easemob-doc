# Implement Message Receipts

## Feature overview

A **message delivery receipt** indicates that a message was successfully delivered to the recipient's device. After the recipient enables this feature, the SDK automatically returns a delivery receipt to the sender when a one-to-one message is received. The sender can use the receipt to confirm whether the message has reached the peer client.

A **message read receipt** indicates that the recipient has read a specified message. After reading a message, the recipient must send a read receipt. The sender can update the corresponding message's read state after receiving the receipt.

The following image shows an example of message delivery and read receipts:

![Message delivery and read states](/images/android/message_receipt.png)

## Limitations

- One-to-one conversations support message delivery receipts and read receipts.
- Group chat conversations support read receipts but not delivery receipts.
- Chat rooms do not currently support delivery receipts or read receipts.
- **Enable [group message read receipts in the EasyIM Console](/product/console/basic_message.html#群聊消息已读回执) before using them.**

## Understand the tech

#### One-to-one message delivery receipts

The process for implementing one-to-one message delivery receipts is as follows:

![img](/images/ios/message_delivery_receipt.png)

The basic implementation steps are as follows:

1. Before calling `initializeSDKWithOptions`, the recipient calls `EMOptions#enableDeliveryAck` to enable delivery receipts. The default value is `NO`.
2. The sender calls `addDelegate` to register a message delegate and monitors delivery receipts through `messagesDidDeliver`.
3. After the recipient receives a one-to-one message, the SDK automatically sends a delivery receipt to the sender. The app does not need to call an API manually.
4. After the sender receives `messagesDidDeliver`, the message has been delivered to the recipient's client. The app can update the displayed message state or call `isDeliverAcked` to query whether the message has been delivered.

:::tip
Message delivery receipts support only one-to-one chats, not group chats or chat rooms.
:::

#### Message read receipts

The iOS SDK uses `sendMessageReadReceipts` to send read receipts for both one-to-one and group messages. The sender receives the receipts through `onMessageReadReceipts`.

The basic process for implementing message read receipts is as follows:

![img](/images/ios/message_read_receipt.png)

The basic implementation steps are as follows:

1. Before sending a one-to-one or group message, the sender sets `isNeedReadReceipt` to `YES` to specify that the message requires a read receipt.
2. The sender calls `addDelegate` to register a message delegate and monitors read receipts through `onMessageReadReceipts`.
3. After the user actually reads the messages, the recipient calls `sendMessageReadReceipts` to send read receipts for one or more messages.
4. After receiving `onMessageReadReceipts`, the sender can locate the message based on `messageId` and update its read state.

You can pass up to 50 messages to `sendMessageReadReceipts` in each call. All messages must belong to the same conversation, and their `isNeedReadReceipt` value must be `YES`. This API supports only one-to-one and group chats, not chat rooms.

For group messages, the app can retrieve read information through the following APIs:

- `readCount` or `groupReadReceiptCount`: Retrieve the number of members who have read a group message.
- `getGroupMessageReadReceipts`: Batch-retrieve read receipt details for multiple group messages. You can pass up to 20 messages from the same conversation in each call.
- `asyncFetchGroupMessageReadUsersFromServer`: Retrieve the members who have read a single group message by page.

:::tip
Sending message read receipts does not change the conversation unread count. To clear the unread count, call `clearConversationUnreadMessageCount` separately. This operation does not send a read receipt to the sender. 
:::

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in successfully. See [Quickstart](quickstart.html).
- Understand the EasyIM usage restrictions. See [Limitations](/product/limitation.html).
- Enable group message read receipts in the [EasyIM Console](/product/console/basic_message.html#群聊消息已读回执) before using them.

## One-to-one message delivery receipts

#### Step 1: Enable delivery receipts

Before calling `initializeSDKWithOptions`, call `EMOptions#enableDeliveryAck` to specify whether one-to-one message delivery receipts are required. The default value is `NO`.

```objectivec
// Create an SDK configuration object.
EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];
// After the recipient enables this option, the SDK automatically sends a delivery receipt when a one-to-one message is received.
options.enableDeliveryAck = YES;

// Initialize the SDK with the configuration.
[[EMClient sharedClient] initializeSDKWithOptions:options];
```

After this feature is enabled, the SDK automatically sends a delivery receipt when the recipient receives a one-to-one message. The app does not need to call a sending API.

#### Step 2: Monitor delivery receipts

The sender receives delivery receipts through `messagesDidDeliver` and can call `isDeliverAcked` to query whether a message has been delivered.

```objectivec
// Implement the delivery receipt callback in EMChatManagerDelegate.
- (void)messagesDidDeliver:(NSArray<EMChatMessage *> *)messages {
    for (EMChatMessage *message in messages) {
        // YES indicates that the sender has received a delivery receipt from the peer.
        BOOL delivered = message.isDeliverAcked;
        // Update the message delivery status based on delivered.
    }
}

// Register the message delegate.
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];

// Remove the message delegate when it is no longer needed.
[[EMClient sharedClient].chatManager removeDelegate:self];
```

## One-to-one and group message read receipts

Both one-to-one and group messages support read receipts. Before using group message read receipts, note the following limitations:

| Limitation       | Default setting   | Description                                                         |
| :--- | :--- | :--- |
| Feature activation       | Disabled       | Before use, enable **Group Message Read Receipts** on the **EasyIM** > **Basic Features** > **Messages** page in the [EasyIM Console](https://console.easyim.ai/user/login).|
| Permission       | All group members | By default, all group members can require read receipts when sending messages. To allow only the group owner and group admins to require them, contact the EasyIM business manager to update the configuration. |
| Read receipt validity period | 3 days       | Group message read receipts are valid for 3 days. More than 3 days after a message is sent, the server no longer records the members who read the message or sends read receipts for it. |
| Group size         | 200 members     | This feature supports chat groups with up to 200 members. If a group has more than 200 members, group messages do not return read receipts. This limit cannot currently be increased. |
| View read count   | Message sender | By default, only the sender can view the number of members who have read a group message. To allow all group members to view it, contact the EasyIM business manager. |

:::tip
The message read receipt validity period is the same as the message's server-side retention period. A read receipt can be sent while the message is stored on the server. The retention period depends on your subscribed plan. See [EasyIM Plan Features](/product/product_package_feature.html). 
:::

#### Step 1: Set a message to require a read receipt

When initializing a message object, the sender must set `isNeedReadReceipt` to `YES`. The default value of this property is `NO`. This property applies to both one-to-one and group chats.

One-to-one message read receipts require no additional activation. For group message read receipts, first enable the feature in the EasyIM Console and then set this attribute.

```objectivec
// Create a text message. For a one-to-one chat, conversationId is the peer user ID.
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:content];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId body:body ext:nil];
// For a group chat, set this value to YES and pass the chat group ID for conversationId.
BOOL isGroupChat = NO;
// Set the chat type based on the conversation type.
message.chatType = isGroupChat ? EMChatTypeGroupChat : EMChatTypeChat;
// Mark the message as requiring the recipient to send a read receipt.
message.isNeedReadReceipt = YES;

// Send the message asynchronously.
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:^(EMChatMessage *message, EMError *error) {
    // Handle the sending result based on error.
}];
```

#### Step 2: Send message read receipts

After reading messages, the recipient calls `sendMessageReadReceipts` to send read receipts in batches. You can pass up to 50 messages in each call. All messages must belong to the same conversation, and `isNeedReadReceipt` must be `YES`.

```objectivec
// Pass only received messages that have been read, require read receipts, and belong to the same conversation.
NSArray<EMChatMessage *> *messages = @[message];

// Asynchronously send read receipts for the current batch of messages.
[[EMClient sharedClient].chatManager sendMessageReadReceipts:messages
                                                   completion:^(EMError *error) {
    if (!error) {
        // Read receipts for the current batch were sent successfully.
    } else {
        // Handle the failure based on the error code and error message.
    }
}];
```

:::tip
We recommend sending read receipts only for received one-to-one or group messages whose `isNeedReadReceipt` value is `YES` and whose `isPeerRead` value is `NO`. For video, voice, file, and similar messages, send the receipt after the user actually views the content.
:::

#### Step 3: Monitor message read receipts

The sender monitors both one-to-one and group message read receipts through `onMessageReadReceipts`. The callback returns a list of `EMMessageReadReceipt` objects. Each receipt object provides the following information:

| API                   | Return type  | Description                               |
| :--- | :--- | :--- |
| `messageId`      | `NSString *`  | Retrieve the ID of the message corresponding to the receipt.            |
| `conversationId` | `NSString *`  | Retrieve the ID of the conversation corresponding to the receipt.            |
| `isPeerReceipt`     | `BOOL` | Determine whether the receipt was sent by the peer in a one-to-one chat. |
| `readCount`      | `NSInteger`     | Retrieve the number of members who have read the group message.             |

```objectivec
// Implement the read receipt callback in EMChatManagerDelegate.
- (void)onMessageReadReceipts:(NSArray<EMMessageReadReceipt *> *)receipts {
    for (EMMessageReadReceipt *receipt in receipts) {
        // The message ID and conversation ID corresponding to the receipt.
        NSString *messageId = receipt.messageId;
        NSString *conversationId = receipt.conversationId;
        // The peer read status for a one-to-one message and the read count for a group message.
        BOOL peerRead = receipt.isPeerReceipt;
        NSInteger readCount = receipt.readCount;
        // Refresh the one-to-one message read status or group message read count based on the receipt.
    }
}

// Register the message delegate.
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];

// Remove the message delegate when it is no longer needed.
[[EMClient sharedClient].chatManager removeDelegate:self];
```

## Retrieve group message read receipt details

### Batch-retrieve receipt summaries for multiple group messages

Call `getGroupMessageReadReceipts` to batch-retrieve message read receipt details from the server. You can pass up to 20 messages in each call, and all messages must belong to the same conversation.

```objectivec
// messages contains up to 20 messages, all from the same group conversation.
[[EMClient sharedClient].chatManager getGroupMessageReadReceipts:messages
                                                       completion:^(NSArray<EMMessageReadReceipt *> *receipts, EMError *error) {
    if (!error) {
        // receipts contains the read receipt summary for each message.
    } else {
        // Retrieval failed.
    }
}];
```

### Retrieve receipt member details for a group message

Call `asyncFetchGroupMessageReadUsersFromServer` to retrieve the members who have read a group message by page. The target message must be a group message that requires read receipts.

Pass an empty string for `readReceiptId` in the first call. In subsequent calls, use the `cursor` from the previous result as the new `readReceiptId`.

```objectivec
// Pass an empty string for readReceiptId in the first call. In subsequent calls, pass the cursor from the previous result.
[[EMClient sharedClient].chatManager asyncFetchGroupMessageReadUsersFromServer:messageId
                                                                        groupId:groupId
                                                                  readReceiptId:readReceiptId
                                                                       pageSize:20
                                                                     completion:^(EMCursorResult<EMGroupReadReceipt *> *result, EMError *error, int totalCount) {
    if (!error) {
        NSArray<EMGroupReadReceipt *> *receipts = result.list;
        NSString *nextCursor = result.cursor;
        // Save nextCursor for retrieving the next page. totalCount is the total number of read receipts.
    } else {
        // Retrieval failed.
    }
}];
```

`EMGroupReadReceipt` provides the following information:

- `readReceiptId`: Read receipt ID.
- `messageId`: Message ID.
- `from`: Information about the group member who sent the receipt, of the `EMGroupMemberInfo` type.
- `readCount`: Read count.
- `timestamp`: Read receipt timestamp.

## Event descriptions

| Event     | Trigger conditions     | Recipient                 |
| :--- | :--- | :--- |
| `messagesDidReceive`                   | Triggered when a regular message is received.                                         | The message recipient. With multiple devices, the sender's other online devices may also receive the message. |
| `messagesDidDeliver`                  | Triggered after the recipient SDK automatically sends a delivery receipt for a one-to-one message.                  | The one-to-one message sender.                                             |
| `onMessageReadReceipts`               | Triggered after the recipient calls `sendMessageReadReceipts` to send read receipts for one or more messages. | The one-to-one or group message sender.                                       |

You can view message delivery and read states through properties of `EMChatMessage`.

## View message delivery and read states

| API | Use case | Description |
| :--- | :--- | :--- |
| `isDeliverAcked` | One-to-one chat | Query whether the message has been delivered to the peer. |
| `isPeerRead` | One-to-one chat | Query whether the peer has read the message. |
| `groupReadReceiptCount` | Group chat | Query the number of members who have read the group message. |
| `isRead` | One-to-one and group chats | Query the message's local read state on the current device. |
| `isNeedReadReceipt` | One-to-one and group chats | Query whether the message requires a read receipt. |

## Message read receipts and clearing conversation unread counts

Sending message read receipts and clearing conversation unread counts are independent operations:

| Operation | Effect | Notifies the message sender | Changes the conversation unread count |
| :--- | :--- | :--- | :--- |
| `sendMessageReadReceipts` | Send read receipts for specified messages. | Yes | No |
| `clearConversationUnreadMessageCount` | Clear the local unread count for a specified conversation and synchronize the current account's other devices. | No | Yes |
| `clearAllConversationUnreadMessageCount` | Clear the unread counts of all local conversations and synchronize the current account's other devices. See [Conversation Unread Counts](conversation_unread.html). | No | Yes |

## Considerations

- Message delivery receipts support only one-to-one chats, not group chats or chat rooms.
- Message read receipts support only one-to-one and group chats, not chat rooms.
- Before sending a one-to-one or group message, set `isNeedReadReceipt` to `YES`.
- You can pass up to 50 messages to `sendMessageReadReceipts` in each call. All messages must belong to the same conversation, and their `isNeedReadReceipt` value must be `YES`.
- The client that calls `sendMessageReadReceipts` does not receive its own receipts through `onMessageReadReceipts`; the original message sender receives this callback.
- Group message read receipts must be enabled in the EasyIM Console and are subject to server-side configurations such as validity period, group size, and viewing permissions.

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`EMOptions#enableDeliveryAck`](#step-1-enable-delivery-receipts) | `EMOptions` | Sets whether one-to-one message delivery receipts are required. |
| [`initializeSDKWithOptions`](#step-1-enable-delivery-receipts) | `EMClient` | Initializes the SDK with the specified configuration. |
| [`initWithConversationID`](#step-1-set-a-message-to-require-a-read-receipt) | `EMChatMessage` | Creates a message. |
| [`chatType`](#step-1-set-a-message-to-require-a-read-receipt) | `EMChatMessage` | Sets the conversation type of a message. |
| [`sendMessage`](#step-1-set-a-message-to-require-a-read-receipt) | `IEMChatManager` | Sends a message asynchronously. |
| [`sendMessageReadReceipts`](#step-2-send-message-read-receipts) | `IEMChatManager` | Asynchronously sends read receipts for one-to-one or group messages in batches. |
| [`messageId`](#step-3-monitor-message-read-receipts) / [`conversationId`](#step-3-monitor-message-read-receipts) | `EMMessageReadReceipt` | Retrieves the message ID and conversation ID corresponding to a receipt. |
| [`isPeerReceipt`](#step-3-monitor-message-read-receipts) / [`readCount`](#step-3-monitor-message-read-receipts) | `EMMessageReadReceipt` | Retrieves the one-to-one peer receipt status or group message read count. |
| [`getGroupMessageReadReceipts`](#batch-retrieve-receipt-summaries-for-multiple-group-messages) | `IEMChatManager` | Batch retrieves read receipt details for multiple group messages. |
| [`asyncFetchGroupMessageReadUsersFromServer`](#retrieve-receipt-member-details-for-a-group-message) | `IEMChatManager` | Retrieves the members who have read a group message by page. |
| [`readReceiptId`](#retrieve-receipt-member-details-for-a-group-message) / [`messageId`](#retrieve-receipt-member-details-for-a-group-message) / [`from`](#retrieve-receipt-member-details-for-a-group-message) / [`readCount`](#retrieve-receipt-member-details-for-a-group-message) / [`timestamp`](#retrieve-receipt-member-details-for-a-group-message) | `EMGroupReadReceipt` | Retrieves group message read receipt details. |
| [`groupReadReceiptCount`](#view-message-delivery-and-read-states) | `EMChatMessage` | Queries the group message read count. |
| [`clearConversationUnreadMessageCount`](#message-read-receipts-and-clearing-conversation-unread-counts) | `IEMChatManager` | Asynchronously clears the local unread message count of a specified conversation. |
| [`clearAllConversationUnreadMessageCount`](#message-read-receipts-and-clearing-conversation-unread-counts) | `IEMChatManager` | Asynchronously clears the unread message counts of all local conversations. |
