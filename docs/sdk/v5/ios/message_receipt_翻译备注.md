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
One-to-one message read receipts require no additional activation. For group message read receipts, first enable the feature in the Easemob Console and then set this attribute.

## Understand the tech

#### One-to-one message delivery receipts

The process for implementing one-to-one message delivery receipts is as follows:

![img](/images/ios/message_delivery_receipt.png)

The basic implementation steps are as follows:

1. Before calling `initializeSDKWithOptions`, the recipient calls `EMOptions#enableDeliveryAck` to enable delivery receipts. The default value is `NO`; set it to `true` to use delivery receipts.
2. The sender calls `addDelegate` to register a message listener and monitors delivery receipts through `messagesDidDeliver`.
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

1. Before sending a one-to-one or group message, the sender calls `isNeedReadReceipt` to specify that the message requires a read receipt.
2. The sender calls `addDelegate` to register a message listener and monitors read receipts through `onMessageReadReceipts`.
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
One-to-one message read receipts require no additional activation. For group message read receipts, first enable the feature in the Easemob Console and then set this attribute.

#### One-to-one message delivery receipts

#### Step 1: Enable delivery receipts

Before calling `initializeSDKWithOptions`, call `EMOptions#enableDeliveryAck` to specify whether one-to-one message delivery receipts are required. The default value is `NO`; set it to `true` to use delivery receipts.

```objectivec
// Handle the message or callback.
EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];
// Handle the message or callback.
options.enableDeliveryAck = YES;

// Handle the message or callback.
[[EMClient sharedClient] initializeSDKWithOptions:options];
```

After this feature is enabled, the SDK automatically sends a delivery receipt when the recipient receives a one-to-one message. The app does not need to call a sending API.

#### Step 2: Monitor delivery receipts

The sender receives delivery receipts through `messagesDidDeliver` and can call `isDeliverAcked` to query whether a message has been delivered.

```objectivec
// Handle the message or callback.
- (void)messagesDidDeliver:(NSArray<EMChatMessage *> *)messages {
    for (EMChatMessage *message in messages) {
        // Handle the message or callback.
        BOOL delivered = message.isDeliverAcked;
        // Handle the message or callback.
    }
}

// Handle the message or callback.
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];

// Handle the message or callback.
[[EMClient sharedClient].chatManager removeDelegate:self];
```

## One-to-one and group message read receipts

Both one-to-one and group messages support read receipts. One-to-one message read receipts are enabled by default. Before using group message read receipts, note the following limitations:

| Limitation       | Default setting   | Description                                                         |
| :--- | :--- | :--- |
| Feature activation       | Disabled       | Before use, enable **Group Message Read Receipts** on the **EasyIM** > **Basic Features** > **Messages** page in the [Easemob Console](https://console.easemob.com/user/login).|
| Permission       | All group members | By default, all group members can require read receipts when sending messages. To allow only the group owner and group admins to require them, contact the Easemob business team to update the configuration. |
| Read receipt validity period | 3 days       | Group message read receipts are valid for 3 days. More than 3 days after a message is sent, the server no longer records the members who read the message or sends read receipts for it. |
| Group size         | 200 members     | This feature supports chat groups with up to 200 members. If a group has more than 200 members, group messages do not return read receipts. This limit cannot currently be increased. |
| View read count   | Message sender | By default, only the sender can view the number of members who have read a group message. To allow all group members to view it, contact the Easemob business team. |

:::tip
The message read receipt validity period is the same as the message's server-side retention period. A read receipt can be sent while the message is stored on the server. The retention period depends on your subscribed plan. See [EasyIM Plan Features](/product/product_package_feature.html). 
:::

#### Step 1: Set a message to require a read receipt

messagesenderthe relevant informationmessagethe relevant information `isNeedReadReceipt` setthe relevant information `YES`；the relevant informationby defaultthe relevant information `NO`.the relevant informationone-to-one chatthe relevant informationgroup chatthe relevant information.

One-to-one message read receipts require no additional activation. For group message read receipts, first enable the feature in the Easemob Console and then set this attribute.

```objectivec
// Handle the message or callback.
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:content];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId body:body ext:nil];
// Handle the message or callback.
BOOL isGroupChat = NO;
// Handle the message or callback.
message.chatType = isGroupChat ? EMChatTypeGroupChat : EMChatTypeChat;
// Handle the message or callback.
message.isNeedReadReceipt = YES;

// Handle the message or callback.
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:^(EMChatMessage *message, EMError *error) {
    // Handle the message or callback.
}];
```

#### Step 2: Send message read receipts

After reading messages, the recipient calls `sendMessageReadReceipts` to send read receipts in batches. You can pass up to 50 messages in each call. All messages must belong to the same conversation, and `isNeedReadReceipt` must be `YES`.

```objectivec
// Handle the message or callback.
NSArray<EMChatMessage *> *messages = @[message];

// Handle the message or callback.
[[EMClient sharedClient].chatManager sendMessageReadReceipts:messages
                                                   completion:^(EMError *error) {
    if (!error) {
        // Handle the message or callback.
    } else {
        // Handle the message or callback.
    }
}];
```

:::tip
We recommend sending read receipts only for received one-to-one or group messages whose `isNeedReadReceipt` value is `YES`. For video, voice, file, and similar messages, send the receipt after the user actually views the content.
:::

#### Step 3: Monitor message read receipts

The sender monitors both one-to-one and group message read receipts through `onMessageReadReceipts`. The callback returns `EMMessageReadReceipt`. Each receipt object provides the following information:

| API                   | Return type  | Description                               |
| :--- | :--- | :--- |
| `messageId`      | `NSString *`  | Retrieve the ID of the message corresponding to the receipt.            |
| `conversationId` | `NSString *`  | Retrieve the ID of the conversation corresponding to the receipt.            |
| `isPeerReceipt`     | `BOOL` | Determine whether the receipt was sent by the peer in a one-to-one chat. |
| `readCount`      | `NSInteger`     | Retrieve the number of members who have read the group message.             |

```objectivec
// Handle the message or callback.
- (void)onMessageReadReceipts:(NSArray<EMMessageReadReceipt *> *)receipts {
    for (EMMessageReadReceipt *receipt in receipts) {
        // Handle the message or callback.
        NSString *messageId = receipt.messageId;
        NSString *conversationId = receipt.conversationId;
        // Handle the message or callback.
        BOOL peerRead = receipt.isPeerReceipt;
        NSInteger readCount = receipt.readCount;
        // Handle the message or callback.
    }
}

// Handle the message or callback.
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];

// Handle the message or callback.
[[EMClient sharedClient].chatManager removeDelegate:self];
```

## Retrieve group message read receipt details

### Batch-retrieve receipt summaries for multiple group messages

Call `getGroupMessageReadReceipts` to batch-retrieve message read receipt details from the server. You can pass up to 20 messages in each call, and all messages must belong to the same conversation.

```objectivec
// Handle the message or callback.
[[EMClient sharedClient].chatManager getGroupMessageReadReceipts:messages
                                                       completion:^(NSArray<EMMessageReadReceipt *> *receipts, EMError *error) {
    if (!error) {
        // Handle the message or callback.
    } else {
        // Handle the message or callback.
    }
}];
```

### Retrieve receipt member details for a group message

Call `asyncFetchGroupMessageReadUsersFromServer` to retrieve read receipt details for a group message by page. The target message must be a group message that requires read receipts. The value range of `pageSize` is `[1, 50]`.

Pass `readReceiptId` or an empty string for `readReceiptId` in the first call. In subsequent calls, use the `cursor` from the previous result as the new `startAckId`.

```objectivec
// Handle the message or callback.
[[EMClient sharedClient].chatManager asyncFetchGroupMessageReadUsersFromServer:messageId
                                                                        groupId:groupId
                                                                  readReceiptId:readReceiptId
                                                                       pageSize:20
                                                                     completion:^(EMCursorResult<EMGroupReadReceipt *> *result, EMError *error, int totalCount) {
    if (!error) {
        NSArray<EMGroupReadReceipt *> *receipts = result.list;
        NSString *nextCursor = result.cursor;
        // Handle the message or callback.
    } else {
        // Handle the message or callback.
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

## View message delivery and read states

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

Message delivery receipts support only one-to-one chats, not group chats or chat rooms.
- Message read receipts support only one-to-one and group chats, not chat rooms.
- Before sending a one-to-one or group message, call `isNeedReadReceipt`.
- You can pass up to 50 messages to `sendMessageReadReceipts` in each call. All messages must belong to the same conversation, and their `isNeedReadReceipt` value must be `YES`.
- The client that calls `sendMessageReadReceipts` does not receive its own receipts through `onMessageReadReceipts`; the original message sender receives this callback.
- Group message read receipts must be enabled in the Easemob Console and are subject to server-side configurations such as validity period, group size, and viewing permissions.

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`EMOptions#enableDeliveryAck`](#-1-) | `EMOptions` | Set whether one-to-one message delivery receipts are required. |
| [`initializeSDKWithOptions`](#-1-) | `EMClient` | Initialize the SDK with the specified configuration. |
| [`initWithConversationID`](#-1-) | `EMChatMessage` | Create a text message. |
| [`chatType`](#-1-) | `EMChatMessage` | Send a message. |
| [`sendMessage`](#-1-) | `IEMChatManager` | Send a message. |
| [`sendMessageReadReceipts`](#-2-) | `IEMChatManager` | Send read receipts for one-to-one or group messages in batches. |
| [`messageId`](#-3-) / [`conversationId`](#-3-) | `EMMessageReadReceipt` | Retrieve the message ID and conversation ID corresponding to a receipt. |
| [`isPeerReceipt`](#-3-) / [`readCount`](#-3-) | `EMMessageReadReceipt` | Retrieve the one-to-one peer receipt state or group message read count. |
| [`getGroupMessageReadReceipts`](#) | `IEMChatManager` | Batch-retrieve read receipt details for multiple group messages. |
| [`asyncFetchGroupMessageReadUsersFromServer`](#) | `IEMChatManager` | Retrieve the members who have read a group message by page. |
| [`readReceiptId`](#) / [`messageId`](#) / [`from`](#) / [`readCount`](#) / [`timestamp`](#) | `EMGroupReadReceipt` | Retrieve group message read receipt details. |
| [`groupReadReceiptCount`](#) | `EMChatMessage` | Query the group message read count. |
| [`clearConversationUnreadMessageCount`](#) | `IEMChatManager` | Clear the local unread message count for a specified conversation. |
| [`clearAllConversationUnreadMessageCount`](#) | `IEMChatManager` | Clear the unread message counts of all local conversations. |
