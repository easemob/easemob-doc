# Message Receipts

## Feature overview

A **message delivery receipt** indicates that a message was successfully delivered to the recipient's device. After the recipient enables this feature, the SDK automatically returns a delivery receipt to the sender when a one-to-one message is received. The sender can use the receipt to confirm whether the message has reached the peer client.

A **message read receipt** indicates that the recipient has read a specified message. After reading a message, the recipient must send a read receipt. The sender can update the corresponding message's read state after receiving the receipt.

The following image shows an example of message delivery and read receipts:

![Message delivery and read states](/images/android/message_receipt.png)

## Limitations

- One-to-one conversations support message delivery receipts and read receipts.
- Group chat conversations support read receipts but not delivery receipts.
- Chat rooms do not currently support delivery receipts or read receipts.
- **Group message read receipts must be [enabled in the EasyIM Console](/product/console/basic_single_group_chat.html#group-message-read-receipts).**

## Understand the tech

#### One-to-one message delivery receipts

The process for implementing one-to-one message delivery receipts is as follows:

![img](/images/android/message_delivery_receipt.png)

The basic implementation steps are as follows:

1. Before calling `EMClient#init`, the recipient calls `EMOptions#setRequireDeliveryAck(true)` to enable delivery receipts. The default value is `false`; set it to `true` to use delivery receipts.
2. The sender calls `EMChatManager#addMessageListener` to register a message listener and monitors delivery receipts through `EMMessageListener#onMessageDelivered`.
3. After the recipient receives a one-to-one message, the SDK automatically sends a delivery receipt to the sender. The app does not need to call an API manually.
4. After the sender receives `onMessageDelivered`, the message has been delivered to the recipient's client. The app can update the displayed message state or call `EMMessage#isDelivered` to query whether the message has been delivered.

:::tip 
Message delivery receipts support only one-to-one chats, not group chats or chat rooms.
:::

#### Message read receipts

The Android SDK uses `EMChatManager#asyncSendMessageReadReceipts` to send read receipts for both one-to-one and group messages. The sender receives the receipts through `EMMessageListener#onMessageReadReceipts`.

The basic process for implementing message read receipts is as follows:

![img](/images/android/message_read_receipt.png)

The basic implementation steps are as follows:

1. Before sending a one-to-one or group message, the sender calls `EMMessage#setIsNeedReadReceipt(true)` to specify that the message requires a read receipt.
2. The sender calls `EMChatManager#addMessageListener` to register a message listener and monitors read receipts through `EMMessageListener#onMessageReadReceipts`.
3. After the user actually reads the messages, the recipient calls `asyncSendMessageReadReceipts` to send read receipts for one or more messages.
4. After receiving `onMessageReadReceipts`, the sender can locate the message based on `EMMessageReadReceipt#getMessageId` and update its read state.

You can pass up to 50 messages to `asyncSendMessageReadReceipts` in each call. All messages must belong to the same conversation, and their `EMMessage#isNeedReadReceipt()` value must be `true`. This API supports only one-to-one and group chats, not chat rooms.

For group messages, the app can retrieve read information through the following APIs:

- `EMMessageReadReceipt#getReadCount` or `EMMessage#readReceiptCount`: Retrieve the number of members who have read a group message.
- `EMChatManager#asyncGetGroupMessageReadReceipts`: Batch-retrieve read receipt details for multiple group messages. You can pass up to 20 messages from the same conversation in each call.
- `EMChatManager#asyncFetchGroupMessageReadReceipts`: Retrieve the members who have read a single group message by page.

:::tip 
Sending message read receipts does not change the conversation unread count. To clear the unread count, call `asyncClearConversationUnreadMessageCount` separately. This operation does not send a read receipt to the sender. 
:::

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in successfully. See [Quickstart](quickstart.html).
- Understand the EasyIM usage restrictions. See [Limitations](/product/limitation.html).
- Before using group message read receipts, [enable the feature in the EasyIM Console](/product/console/basic_single_group_chat.html#group-message-read-receipts).

## One-to-one message delivery receipts

#### Step 1: Enable delivery receipts

Before calling `EMClient#init`, call `EMOptions#setRequireDeliveryAck` to specify whether one-to-one message delivery receipts are required. The default value is `false`; set it to `true` to use delivery receipts.

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setRequireDeliveryAck(true);

EMClient.getInstance().init(getApplicationContext(), options);
```

After this feature is enabled, the SDK automatically sends a delivery receipt when the recipient receives a one-to-one message. The app does not need to call a sending API.

#### Step 2: Monitor delivery receipts

The sender receives delivery receipts through `EMMessageListener#onMessageDelivered` and can call `EMMessage#isDelivered` to query whether a message has been delivered.

```java
EMMessageListener messageListener = new EMMessageListener() {
    @Override
    public void onMessageDelivered(List<EMMessage> messages) {
        for (EMMessage message : messages) {
            boolean delivered = message.isDelivered();
            // Update the message delivery state based on delivered.
        }
    }
};

EMClient.getInstance()
        .chatManager()
        .addMessageListener(messageListener);

// Remove the listener when it is no longer needed.
EMClient.getInstance()
        .chatManager()
        .removeMessageListener(messageListener);
```

## One-to-one and group message read receipts

Both one-to-one and group messages support read receipts. One-to-one message read receipts are enabled by default. Before using group message read receipts, note the following limitations:

| Limitation       | Default setting   | Description                                                         |
| :--------- | :----- | :------- | 
| Feature activation       | Disabled       | Before use, activate **Group Message Read Receipt** on the **Chat** > **Features** > **1-on-1/Group Chat** tab of the [EasyIM Console](https://console.easyim.ai/user/login).|
| Permission       | All group members | By default, all group members can require read receipts when sending messages. To allow only the group owner and group admins to require them, contact the EasyIM business manager to update the configuration. |
| Read receipt validity period | 3 days       | Group message read receipts are valid for 3 days. More than 3 days after a message is sent, the server no longer records the members who read the message or sends read receipts for it. |
| Group size         | 200 members     | This feature supports chat groups with up to 200 members. If a group has more than 200 members, group messages do not return read receipts. This limit cannot currently be increased. |
| View read count   | Message sender | By default, only the sender can view the number of members who have read a group message. To allow all group members to view it, contact the EasyIM business manager. |

:::tip
The message read receipt validity period is the same as the message's server-side retention period. A read receipt can be sent while the message is stored on the server. The retention period depends on your subscribed plan. See [EasyIM Plan Features](/product/product_package_feature.html). 
:::

#### Step 1: Set a message to require a read receipt

Before sending a one-to-one or group message, call `EMMessage#setIsNeedReadReceipt(true)` to specify that the message requires a read receipt. This attribute applies to both one-to-one and group messages.

One-to-one message read receipts require no additional activation. For group message read receipts, first enable the feature in the EasyIM Console and then set this attribute.

```java
EMMessage message = EMMessage.createTextSendMessage(content, conversationId);
message.setChatType(EMMessage.ChatType.Chat); // Set to GroupChat for a group chat.
message.setIsNeedReadReceipt(true);

EMClient.getInstance().chatManager().sendMessage(message);
```

#### Step 2: Send message read receipts

After reading messages, the recipient calls `asyncSendMessageReadReceipts` to send read receipts in batches. You can pass up to 50 messages in each call. All messages must belong to the same conversation, and `isNeedReadReceipt()` must be `true`.

```java
List<EMMessage> messages = Collections.singletonList(message);

// Asynchronous method.
EMClient.getInstance()
        .chatManager()
        .asyncSendMessageReadReceipts(
                messages,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // Read receipts for the current batch were sent successfully.
                    }

                    @Override
                    public void onError(int errorCode, String errorMessage) {
                        // Handle the failure based on the error code and error message.
                    }
                });
```

:::tip
We recommend sending read receipts only for received one-to-one or group messages whose `isNeedReadReceipt()` value is `true`. For video, voice, file, and similar messages, send the receipt after the user actually views the content.
:::

#### Step 3: Monitor message read receipts

The sender monitors both one-to-one and group message read receipts through `EMMessageListener#onMessageReadReceipts`. The callback returns `List<EMMessageReadReceipt>`. Each receipt object provides the following information:

| API                   | Return type  | Description                               |
| --------------------- | --------- | ---------------------------------- |
| `getMessageId()`      | `String`  | Retrieve the ID of the message corresponding to the receipt.            |
| `getConversationId()` | `String`  | Retrieve the ID of the conversation corresponding to the receipt.            |
| `isPeerReceipt()`     | `boolean` | Determine whether the receipt was sent by the peer in a one-to-one chat. |
| `getReadCount()`      | `int`     | Retrieve the number of members who have read the group message.             |

```java
EMMessageListener messageListener = new EMMessageListener() {
    @Override
    public void onMessageReadReceipts(
            List<EMMessageReadReceipt> receipts) {
        for (EMMessageReadReceipt receipt : receipts) {
            String messageId = receipt.getMessageId();
            String conversationId = receipt.getConversationId();
            boolean peerRead = receipt.isPeerReceipt();
            int readCount = receipt.getReadCount();
            // Refresh the read state of a one-to-one message or the read count of a group message based on the receipt.
        }
    }

    @Override
    public void onReadReceiptForGroupMessageUpdated() {
        // The group message read state was updated. Refresh the UI as needed.
    }
};

EMClient.getInstance()
        .chatManager()
        .addMessageListener(messageListener);

// Remove the listener when it is no longer needed.
EMClient.getInstance()
        .chatManager()
        .removeMessageListener(messageListener);
```

## Retrieve group message read receipt details

### Batch-retrieve receipt summaries for multiple group messages

Call `asyncGetGroupMessageReadReceipts` to batch-retrieve message read receipt details from the server. You can pass up to 20 messages in each call, and all messages must belong to the same conversation.

```java
// Asynchronous method.
EMClient.getInstance()
        .chatManager()
        .asyncGetGroupMessageReadReceipts(
                messages,
                new EMValueCallBack<List<EMMessageReadReceipt>>() {
                    @Override
                    public void onSuccess(
                            List<EMMessageReadReceipt> receipts) {
                        // receipts contains the read receipt details for each message.
                    }

                    @Override
                    public void onError(int errorCode, String errorMessage) {
                    }
                });
```

### Retrieve receipt member details for a group message

Call `asyncFetchGroupMessageReadReceipts` to retrieve read receipt details for a group message by page. The target message must be a group message that requires read receipts. The value range of `pageSize` is `[1, 50]`.

Pass `null` or an empty string for `startAckId` in the first call. In subsequent calls, use the `cursor` from the previous result as the new `startAckId`.

```java
// Asynchronous method.
EMClient.getInstance()
        .chatManager()
        .asyncFetchGroupMessageReadReceipts(
                messageId,
                20,
                startAckId,
                new EMValueCallBack<EMCursorResult<EMGroupReadReceipt>>() {
                    @Override
                    public void onSuccess(
                            EMCursorResult<EMGroupReadReceipt> result) {
                        List<EMGroupReadReceipt> receipts = result.getData();
                        String nextCursor = result.getCursor();
                        // Save nextCursor for retrieving the next page.
                    }

                    @Override
                    public void onError(int errorCode, String errorMessage) {
                    }
                });
```

`EMGroupReadReceipt` provides the following information:

- `getAckId`: Read receipt ID.
- `getMsgId`: Message ID.
- `getFrom`: Information about the group member who sent the receipt, of the `EMGroupMemberInfo` type.
- `getCount`: Read count.
- `getTimestamp`: Read receipt timestamp.

## Event descriptions

| Event     | Trigger conditions     | Recipient                 |
| :--------- | :----- | :----- |  
| `EMMessageListener#onMessageReceived`                   | Triggered when a regular message is received.                                         | The message recipient. With multiple devices, the sender's other online devices may also receive the message. |
| `EMMessageListener#onMessageDelivered`                  | Triggered after the recipient SDK automatically sends a delivery receipt for a one-to-one message.                  | The one-to-one message sender.                                             |
| `EMMessageListener#onMessageReadReceipts`               | Triggered after the recipient calls `asyncSendMessageReadReceipts` to send read receipts for one or more messages. | The one-to-one or group message sender.                                       |
| `EMMessageListener#onReadReceiptForGroupMessageUpdated` | Triggered when the read state of a group message is updated.                                 | Clients that need to refresh the group message read state.                             |

## View message delivery and read states

| API | Use case | Description |
| :--- | :--- | :--- |
| `EMMessage#isDelivered` | One-to-one chat | Query whether the message has been delivered to the peer. |
| `EMMessage#isPeerRead` | One-to-one chat | Query whether the peer has read the message. |
| `EMMessage#readReceiptCount` | Group chat | Query the number of members who have read the group message. |
| `EMMessage#isRead` | One-to-one and group chats | Query the message's local read state on the current device. |
| `EMMessage#isNeedReadReceipt` | One-to-one and group chats | Query whether the message requires a read receipt. |

## Message read receipts and clearing conversation unread counts

Sending message read receipts and clearing conversation unread counts are independent operations:

| Operation | Effect | Notifies the message sender | Changes the conversation unread count |
| :--- | :--- | :--- | :--- |
| `asyncSendMessageReadReceipts` | Send read receipts for specified messages. | Yes | No |
| `asyncClearConversationUnreadMessageCount` | Clear the local unread count for a specified conversation and synchronize the current account's other devices. | No | Yes |
| `asyncClearAllConversationUnreadMessageCount` | Clear the unread counts of all local conversations and synchronize the current account's other devices. See [Conversation Unread Counts](conversation_unread.html). | No | Yes |

## Considerations

- Message delivery receipts support only one-to-one chats, not group chats or chat rooms.
- Message read receipts support only one-to-one and group chats, not chat rooms.
- Before sending a one-to-one or group message, call `EMMessage#setIsNeedReadReceipt(true)`.
- You can pass up to 50 messages to `asyncSendMessageReadReceipts` in each call. All messages must belong to the same conversation, and their `isNeedReadReceipt()` value must be `true`.
- The client that calls `asyncSendMessageReadReceipts` does not receive its own receipts through `onMessageReadReceipts`; the original message sender receives this callback.
- Group message read receipts must be enabled in the EasyIM Console and are subject to server-side configurations such as validity period, group size, and viewing permissions.

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`setRequireDeliveryAck`](#step-1-enable-delivery-receipts) | `EMOptions` | Set whether one-to-one message delivery receipts are required. |
| [`init`](#step-1-enable-delivery-receipts) | `EMClient` | Initialize the SDK with the specified configuration. |
| [`createTextSendMessage`](#step-1-set-a-message-to-require-a-read-receipt) | `EMMessage` | Create a text message. |
| [`sendMessage`](#step-1-set-a-message-to-require-a-read-receipt) | `EMChatManager` | Send a message. |
| [`asyncSendMessageReadReceipts`](#step-2-send-message-read-receipts) | `EMChatManager` | Send read receipts for one-to-one or group messages in batches. |
| [`getMessageId`](#step-3-monitor-message-read-receipts) / [`getConversationId`](#step-3-monitor-message-read-receipts) | `EMMessageReadReceipt` | Retrieve the message ID and conversation ID corresponding to a receipt. |
| [`isPeerReceipt`](#step-3-monitor-message-read-receipts) / [`getReadCount`](#step-3-monitor-message-read-receipts) | `EMMessageReadReceipt` | Retrieve the one-to-one peer receipt state or group message read count. |
| [`asyncGetGroupMessageReadReceipts`](#batch-retrieve-receipt-summaries-for-multiple-group-messages) | `EMChatManager` | Batch-retrieve read receipt details for multiple group messages. |
| [`asyncFetchGroupMessageReadReceipts`](#retrieve-receipt-member-details-for-a-group-message) | `EMChatManager` | Retrieve the members who have read a group message by page. |
| [`getAckId`](#retrieve-receipt-member-details-for-a-group-message) / [`getMsgId`](#retrieve-receipt-member-details-for-a-group-message) / [`getFrom`](#retrieve-receipt-member-details-for-a-group-message) / [`getCount`](#retrieve-receipt-member-details-for-a-group-message) / [`getTimestamp`](#retrieve-receipt-member-details-for-a-group-message) | `EMGroupReadReceipt` | Retrieve group message read receipt details. |
| [`readReceiptCount`](#view-message-delivery-and-read-states) | `EMMessage` | Query the group message read count. |
| [`asyncClearConversationUnreadMessageCount`](#message-read-receipts-and-clearing-conversation-unread-counts) | `EMChatManager` | Clear the local unread message count for a specified conversation. |
| [`asyncClearAllConversationUnreadMessageCount`](#message-read-receipts-and-clearing-conversation-unread-counts) | `EMChatManager` | Clear the unread message counts of all local conversations. |
