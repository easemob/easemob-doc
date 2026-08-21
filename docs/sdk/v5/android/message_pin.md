# Pin Messages

## Feature overview

Pinning messages marks important messages in a conversation so conversation members can view them together and locate them quickly.

**One-to-one chats, group chats, and chat rooms all support this feature.** The pinned state is stored on the server and synchronized among relevant users in the same conversation.

Multiple messages can be pinned in the same conversation. Your app can retrieve the pinned message list for a specified conversation from the server and promptly update the page through pinned-message events. For a single message, the app can also read details such as the operator and pinning time.

## Feature activation

Before using message pinning, contact the EasyIM business manager to enable it.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and connect to the server. See [Quickstart](quickstart.html).
- Contact the EasyIM business manager to enable message pinning.
- Understand the EasyIM API usage restrictions. See [Limitations](/product/limitation.html).

## Pin a message

Call `EMChatManager#asyncPinMessage` and pass a non-empty message ID to pin a specified message in a conversation. After the operation succeeds, other users in the conversation receive `EMMessageListener#onMessagePinChanged`. With multi-device login, the current account's other online devices also receive this callback after synchronizing the state change.

The same message can be pinned repeatedly by multiple users, but only information about the latest pin operation is retained. Therefore, the operator user ID and pinning time obtained through `EMMessagePinInfo` correspond to the latest pin operation.

Only messages still stored on the server can be pinned. If a message exists only locally and has been deleted from the server after its retention period expired, pinning fails.
**By default, up to 20 messages can be pinned in a conversation. To increase the limit, contact the EasyIM business manager. The maximum supported limit is 100.**

```java
String messageId = message.getMsgId();

// Asynchronous method.
EMClient.getInstance()
        .chatManager()
        .asyncPinMessage(
                messageId,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // The message was pinned successfully.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // Failed to pin the message.
                    }

                    @Override
                    public void onProgress(
                            int progress,
                            String status) {
                    }
                });
```

## Unpin a message

Call `EMChatManager#asyncUnPinMessage` and pass a non-empty message ID to unpin a message. After the operation succeeds, other users in the conversation receive `EMMessageListener#onMessagePinChanged`. With multi-device login, the current account's other online devices also receive this callback after synchronizing the state change.

All users in a one-to-one chat, group chat, or chat room can unpin a message, regardless of who originally pinned it. After the operation succeeds, `EMMessage#pinnedInfo` returns `null`, and the message is no longer included in the conversation's pinned message list retrieved from the server.

```java
String messageId = message.getMsgId();

// Asynchronous method.
EMClient.getInstance()
        .chatManager()
        .asyncUnPinMessage(
                messageId,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // The message was unpinned successfully.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // Failed to unpin the message.
                    }

                    @Override
                    public void onProgress(
                            int progress,
                            String status) {
                    }
                });
```

## Retrieve pinned messages in a conversation

Call `EMChatManager#asyncGetPinnedMessagesFromServer` to retrieve all pinned messages in a specified conversation from the server. The SDK returns the results in descending order by pinning time.

:::tip
1. If a pinned message expires on the server or the current user deletes it from the server for the current user only, the current user can no longer retrieve the message through message roaming, but the current user and other users can still retrieve it in the pinned message list.
2. If a pinned message is recalled, it is removed from the server, and no user can retrieve it from the pinned message list.
:::

```java
// Asynchronous method.
EMClient.getInstance()
        .chatManager()
        .asyncGetPinnedMessagesFromServer(
            // `conversationId` cannot be empty. Pass the peer user ID for one-to-one chat, the group ID for group chat, or the chat room ID for a chat room.
                conversationId,
                new EMValueCallBack<List<EMMessage>>() {
                    @Override
                    public void onSuccess(
                            List<EMMessage> pinnedMessages) {
                        // pinnedMessages is the pinned message list for the conversation.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

## Retrieve pin details for a message

Call `EMMessage#pinnedInfo` to retrieve pin details for a message:

- If the message is pinned, the returned `EMMessagePinInfo` contains the operator user ID and pinning time of the latest pin operation.
- If the message is not pinned, this method returns `null`.

```java
EMMessagePinInfo pinInfo = message.pinnedInfo();
if (pinInfo != null) {
    // The time of the latest pin operation.
    long pinTime = pinInfo.pinTime();

    // The user ID of the operator who performed the latest pin operation.
    String operatorId = pinInfo.operatorId();
} else {
    // The message is not currently pinned.
}
```

## Monitor pinned-message events

Register `EMMessageListener` and use `onMessagePinChanged` to monitor pinned-state changes. A `pinOperation` value of `PIN` indicates that a message was pinned, and `UNPIN` indicates that it was unpinned.

```java
EMMessageListener messageListener = new EMMessageListener() {
    @Override
    public void onMessagePinChanged(
            String messageId,
            String conversationId,
            EMMessagePinInfo.PinOperation pinOperation,
            EMMessagePinInfo pinInfo) {
        switch (pinOperation) {
            case PIN:
                // The message was pinned. Refresh the pin information based on pinInfo.
                break;
            case UNPIN:
                // The message was unpinned.
                break;
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

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`asyncPinMessage`](#pin-a-message) | `EMChatManager` | Pin a specified message. |
| [`asyncUnPinMessage`](#unpin-a-message) | `EMChatManager` | Unpin a specified message. |
| [`asyncGetPinnedMessagesFromServer`](#retrieve-pinned-messages-in-a-conversation) | `EMChatManager` | Retrieve the pinned message list for a specified conversation from the server. |
| [`pinnedInfo`](#retrieve-pin-details-for-a-message) | `EMMessage` | Retrieve pin details for a message. Returns `null` if it is not pinned. |
| [`pinTime`](#retrieve-pin-details-for-a-message) | `EMMessagePinInfo` | Retrieve the time of the latest pin operation. |
| [`operatorId`](#retrieve-pin-details-for-a-message) | `EMMessagePinInfo` | Retrieve the user ID of the operator who performed the latest pin operation. |
