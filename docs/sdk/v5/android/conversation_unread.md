# Conversation Unread Counts

## Feature overview

You can view the unread message count for all local conversations or a specified conversation and clear conversation unread counts.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in. For details, see [Quickstart](quickstart.html).
- Understand the EasyIM API [limitations](/product/limitation.html).

## Process

The core process is as follows:

![](/images/android/conversation_unread_count_clear.png)

The basic steps are as follows:

1. After the user enters a conversation page, record the current conversation ID at the app layer and call `asyncClearConversationUnreadMessageCount(conversationId, callback)` as needed to clear the conversation's unread count.
2. After the call succeeds, the SDK updates the target conversation's unread count in the local cache to `0` and synchronizes the change to the current user's other logged-in devices.
3. When conversation data changes, the registered `onConversationUpdate()` receives a callback, which the app can use to refresh the conversation list UI.
4. With multi-device login, clearing an unread count neither notifies the peer nor triggers a message read receipt for the peer. The change is synchronized only to the current user's other online devices.
5. To clear the unread counts of all conversations, call the asyncClearAllConversationUnreadMessageCount API.
   This operation clears all conversation unread counts in the current device's local cache and synchronizes the change to the current user's other online devices.

:::tip
Clearing a conversation unread count does not notify the peer or trigger a message read receipt for the peer. To inform the message sender that messages have been read, use message read receipts.
:::

## Retrieve the unread count for all conversations

Call `getUnreadMessageCount` to retrieve the total number of unread messages in local one-to-one and group conversations.

This API counts unread messages as follows:

- Chat room conversations are excluded.
- Unread messages in message threads are excluded.
- Conversations whose push notification mode is `EMPushRemindType.MENTION_ONLY` or `EMPushRemindType.NONE` are excluded even if they contain unread messages.
- Only one-to-one and group conversations whose push notification mode is `EMPushRemindType.ALL` are included.

```java
int unreadCount = EMClient.getInstance()
        .chatManager()
        .getUnreadMessageCount();
```

If you previously called `cleanConversationsMemoryCache` to clear the conversation memory cache, the returned total unread message count may be `0`. To count unread messages in a specific conversation, retrieve the corresponding `EMConversation` and call `getUnreadMsgCount`.

## Retrieve the unread count for a specified conversation

Call `getConversation` to retrieve a specified conversation object, and then call `getUnreadMsgCount` to retrieve its local unread message count. If the specified conversation does not exist locally, `getConversation` returns `null`.

:::tip
The `getConversation` and `getUnreadMsgCount` APIs support one-to-one, group, and chat room conversations.
:::

```java
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation(conversationId);

int unreadCount = conversation == null
        ? 0
        : conversation.getUnreadMsgCount();
```

## Clear the unread counts of all conversations

Call `asyncClearAllConversationUnreadMessageCount` to clear the unread message counts of all local conversations, including chat room conversations. The cleared state is synchronized to the current account's other devices, but no read receipt is sent to message senders.

Other logged-in devices receive the `EMMultiDeviceListener#ALL_CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED` event through `EMMultiDeviceListener#onConversationEvent(int event, String conversationId, EMConversation.EMConversationType type)`. When all conversations are cleared, `conversationId` and `type` do not represent a specific conversation.

```java
// Asynchronous method.
EMClient.getInstance()
        .chatManager()
        .asyncClearAllConversationUnreadMessageCount(new EMCallBack() {
            @Override
            public void onSuccess() {
                // The unread counts of all conversations have been cleared.
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
                // Failed to clear the unread counts. Handle the error based on the error code and error message.
            }
        });
```

:::tip
Clearing a conversation unread count does not send a read receipt to the message sender. To send message read receipts to the peer, call `EMChatManager#asyncSendMessageReadReceipts` separately. This API supports only one-to-one and group chats, not chat rooms. For details, see [Message Receipts](message_receipt.html).
:::

## Clear the unread count of a specified conversation

Call `asyncClearConversationUnreadMessageCount` to clear the local unread message count of a specified conversation. The cleared state is synchronized to the current account's other devices, but no read receipt is sent to the message sender.

Other logged-in devices receive the `EMMultiDeviceListener.CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED` event through `EMMultiDeviceListener#onConversationEvent(int event, String conversationId, EMConversation.EMConversationType type)`. In this event, `conversationId` is the conversation ID and `type` is the conversation type.

:::tip
Clearing a conversation unread count does not send a read receipt to the message sender. To send message read receipts to the peer, call `EMChatManager#asyncSendMessageReadReceipts` separately. For details, see [Message Receipts](message_receipt.html).
:::

```java
// Asynchronous method.
EMClient.getInstance()
        .chatManager()
        .asyncClearConversationUnreadMessageCount(
                conversationId,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // The unread message count of the specified conversation has been cleared.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // Failed to clear the unread count. Handle the error based on the error code and error message.
                    }
                });
```

## Monitor unread-count changes across devices

To synchronize conversation unread counts across devices, activate the multi-device login service. For details, see [Log In on Multiple Devices](multi_device.html).

Assume that the current user is logged in on devices A and B:

- After the user clears a specified conversation's unread count on device A, device B receives the `EMMultiDeviceListener#CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED` event.
- After the user clears all conversation unread counts on device A, device B receives the `EMMultiDeviceListener#ALL_CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED` event.

Implement `EMMultiDeviceListener` and call `addMultiDeviceListener` to register the listener. After receiving the `onConversationEvent` callback, read the conversation data from the SDK again and refresh the UI.

```java
public final class ConversationListActivity extends AppCompatActivity {

    private final EMMultiDeviceListener multiDeviceListener =
            new EMMultiDeviceListener() {
                @Override
                public void onContactEvent(int event, String target, String ext) {
                    // This example does not handle multi-device friend events.
                }

                @Override
                public void onGroupEvent(
                        int event, String target, List<String> usernames) {
                    // This example does not handle multi-device chat group events.
                }

                @Override
                public void onConversationEvent(
                        int event,
                        String conversationId,
                        EMConversation.EMConversationType type) {
                    EMChatManager chatManager =
                            EMClient.getInstance().chatManager();

                    if (event == EMMultiDeviceListener
                            .CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED) {
                        // The specified conversation's unread count was cleared on another device.
                        // Read the latest local conversation data from the SDK again.
                        EMConversation conversation = chatManager.getConversation(
                                conversationId,
                                type,
                                false
                        );
                        int unreadCount = conversation == null
                                ? 0
                                : conversation.getUnreadMsgCount();

                        runOnUiThread(() -> {
                            // Refresh the conversation's unread count based on unreadCount.
                            refreshConversationUnreadCount(
                                    conversationId, unreadCount);
                        });

                    } else if (event == EMMultiDeviceListener
                            .ALL_CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED) {
                        // All conversation unread counts were cleared on another device.
                        int unreadCount = chatManager.getUnreadMessageCount();

                        runOnUiThread(() -> {
                            // Refresh the list and app badge based on the latest conversation data.
                            refreshConversationList();
                            updateAppBadge(unreadCount);
                        });
                    }
                }
            };

    @Override
    protected void onStart() {
        super.onStart();
        EMClient.getInstance().addMultiDeviceListener(multiDeviceListener);
    }

    @Override
    protected void onStop() {
        EMClient.getInstance().removeMultiDeviceListener(multiDeviceListener);
        super.onStop();
    }

    private void refreshConversationUnreadCount(
            String conversationId, int unreadCount) {
        // Refresh the UI of the specified conversation.
    }

    private void refreshConversationList() {
        // Read the conversation list again and refresh the UI.
        Map<String, EMConversation> conversations =
                EMClient.getInstance().chatManager().getAllConversations();
    }

    private void updateAppBadge(int unreadCount) {
        // Update the app badge or unread-count UI.
    }
}
```

:::tip 
A multi-device callback only indicates that data has changed. We recommend reading the SDK's local conversation data again in the callback instead of only changing the number cached by the UI. The `onConversationEvent` callback is not guaranteed to run on the main thread. Switch to the main thread when updating the Android UI, for example by using `runOnUiThread`. In addition, the APIs that clear unread counts do not automatically refresh the app UI or badge. Refresh them using the latest unread count in the success callbacks of `asyncClearConversationUnreadMessageCount` and `asyncClearAllConversationUnreadMessageCount`, as well as in multi-device callbacks.
:::

## Read status and read receipt for an individual message

You can query the read status through `EMMessage#isRead`, but you cannot modify it through this API.

To notify the message sender that messages have been read, call `asyncSendMessageReadReceipts` to send read receipts for one or more messages. The sender can receive a list of read receipts for one-to-one and group messages through `EMMessageListener#onMessageReadReceipts(List<EMMessageReadReceipt>)`. Each item in the list is an `EMMessageReadReceipt`.

For details about message read receipts and read status, see [Message Receipts](message_receipt.html).

:::tip
Sending message read receipts and clearing a conversation unread count are independent operations:<br> - `asyncSendMessageReadReceipts`: Sends read receipts to the message sender. It supports only one-to-one and group chats.<br> - `asyncClearConversationUnreadMessageCount`: Clears the local unread count of a specified conversation and synchronizes the change to the current account's other devices, but does not send read receipts to the message sender.
:::

## API list

| API | Module/Class | Chat room support | Description |
| :--- | :--- | :--- | :--- |
| [`getUnreadMessageCount`](#retrieve-the-unread-count-for-all-conversations) | `EMChatManager` | No | Retrieves the total number of unread messages in local one-to-one and group conversations. |
| [`cleanConversationsMemoryCache`](#retrieve-the-unread-count-for-all-conversations) | `EMChatManager` | Yes | Clears all conversation caches from memory. |
| [`getConversation`](#retrieve-the-unread-count-for-a-specified-conversation) | `EMChatManager` | Yes | Retrieves a specified conversation object, including a chat room conversation. |
| [`getUnreadMsgCount`](#retrieve-the-unread-count-for-a-specified-conversation) | `EMConversation` | Yes | Retrieves the local unread message count of a specified conversation. |
| [`asyncClearAllConversationUnreadMessageCount`](#clear-the-unread-counts-of-all-conversations) | `EMChatManager` | Yes | Clears the unread message counts of all local conversations and synchronizes the change to the current account's other devices. |
| [`asyncClearConversationUnreadMessageCount`](#clear-the-unread-count-of-a-specified-conversation) | `EMChatManager` | Yes | Clears the local unread message count of a specified conversation and synchronizes the change to the current account's other devices. |
| [`asyncSendMessageReadReceipts`](#read-status-and-read-receipt-for-an-individual-message) | `EMChatManager` | No | Sends read receipts for one-to-one or group messages. |
