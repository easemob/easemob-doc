# Pin Messages

## Feature overview

Pinning a message marks an important message in a conversation so that conversation members can view it together and locate it quickly. **One-to-one chats, group chats, and chat rooms all support this feature.** The pin status is stored on the server and synchronized among relevant users in the same conversation.

A conversation can contain multiple pinned messages at the same time. The app can retrieve the pinned message list for a specified conversation from the server and update the page promptly through message pin events. For an individual message, the app can also retrieve details such as the operator and pin time.

## Feature activation

Contact the EasyIM business manager to enable message pinning before using this feature.

## Prerequisite

Before you start, make sure that the following requirements are met:

- Initialize the SDK and connect to the server. For details, see [Quickstart](quickstart.html).
- Contact the EasyIM business manager to enable message pinning.
- Understand the API usage limits of EasyIM. For details, see [IM feature limits](/product/limitation.html).

## Pin a message

Call `pinMessage` with a non-empty message ID to pin the specified message in a conversation. After pinning succeeds, other users in the conversation receive the `onMessagePinChanged` callback. In a multi-device login scenario, the current account's other online devices also receive the callback after synchronizing the status change.

Multiple users can pin the same message. Only the most recent pin operation is retained, so the operator user ID and pin time returned by `EMMessagePinInfo` correspond to the latest operation.

Only messages still stored on the server can be pinned. If a message exists only locally but has been deleted from the server because its retention period expired, pinning fails.

**A conversation can contain at most 20 pinned messages by default. Contact the EasyIM business manager to increase the limit, up to 100 messages.**

```objectivec
// Retrieve the ID of the message to pin.
NSString *messageId = message.messageId;

// Asynchronously pin the specified message.
[[EMClient sharedClient].chatManager pinMessage:messageId
                                     completion:^(EMChatMessage *message, EMError *error) {
    if (!error) {
        // Message pinning succeeded; message is the pinned message.
    } else {
        // Message pinning failed.
    }
}];
```

## Unpin a message

Call `unpinMessage` with a non-empty message ID to unpin a message. After unpinning succeeds, other users in the conversation receive `onMessagePinChanged`. In a multi-device login scenario, the current account's other online devices also receive the callback after synchronizing the status change.

All users in a one-to-one chat, group chat, or chat room can unpin a message, regardless of which user originally pinned it. After unpinning succeeds, `pinnedInfo` returns `nil`, and the message is no longer included in the pinned message list retrieved from the server.

```objectivec
// Retrieve the ID of the message to unpin.
NSString *messageId = message.messageId;

// Asynchronously unpin the specified message.
[[EMClient sharedClient].chatManager unpinMessage:messageId
                                       completion:^(EMChatMessage *message, EMError *error) {
    if (!error) {
        // Unpinning succeeded; message is the unpinned message.
    } else {
        // Unpinning failed.
    }
}];
```

## Retrieve pinned messages in a conversation

Call `getPinnedMessagesFromServer` to retrieve all pinned messages in a specified conversation from the server. The SDK returns the results in descending order of pin time.

:::tip
1. If a pinned message expires on the server or the current user deletes it one way from the server, the current user can no longer retrieve it through message roaming. However, the current user and other users can still retrieve it from the pinned message list.
2. If a user recalls a pinned message, the message is removed from the server, and no user can retrieve it from the pinned message list.
:::

```objectivec
// conversationId cannot be empty: pass the other party's user ID for a one-to-one chat, the chat group ID for a group chat, or the chat room ID for a chat room.
[[EMClient sharedClient].chatManager getPinnedMessagesFromServer:conversationId
                                                       completion:^(NSArray<EMChatMessage *> *messages, EMError *error) {
    if (!error) {
        // messages is the conversation's pinned message list in descending order of pin time.
    } else {
        // Retrieving the pinned message list failed.
    }
}];
```

## Retrieve the pin details of a message

Use `pinnedInfo` to retrieve the pin details of an individual message:

- If the message is pinned, the returned `EMMessagePinInfo` contains the operator user ID and pin time of the latest pin operation.
- If the message is not pinned, the property returns `nil`.

```objectivec
// Read the pin details from the message; pinInfo is nil when the message is not pinned.
EMMessagePinInfo *pinInfo = message.pinnedInfo;
if (pinInfo) {
    // Time of the latest pin operation, in milliseconds.
    NSInteger pinTime = pinInfo.pinTime;

    // User ID of the operator who performed the latest pin operation.
    NSString *operatorId = pinInfo.operatorId;
} else {
    // The message is not currently pinned.
}
```

## Monitor message pin events

Register `EMChatManagerDelegate` and use `onMessagePinChanged` to monitor pin status changes. A `pinOperation` of `EMMessagePin` means that the message was pinned, while `EMMessageUnpin` means that it was unpinned.

```objectivec
// Implement the message pin status change callback in EMChatManagerDelegate.
- (void)onMessagePinChanged:(NSString *)messageId
             conversationId:(NSString *)conversationId
                  operation:(EMMessagePinOperation)pinOperation
                    pinInfo:(EMMessagePinInfo *)pinInfo {
    switch (pinOperation) {
        case EMMessagePin:
            // The message was pinned. Refresh pin information based on pinInfo.
            break;
        case EMMessageUnpin:
            // The message was unpinned.
            break;
    }
}

// Register the message delegate to receive onMessagePinChanged callbacks.
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];

// Remove the message delegate when monitoring is no longer needed.
[[EMClient sharedClient].chatManager removeDelegate:self];
```

## API list

| API name | Module/Type | Description |
| :--- | :--- | :--- |
| [`messageId`](#pin-a-message) | `EMChatMessage` | Retrieves the message ID. |
| [`pinMessage`](#pin-a-message) | `IEMChatManager` | Asynchronously pins a specified message. |
| [`unpinMessage`](#unpin-a-message) | `IEMChatManager` | Asynchronously unpins a specified message. |
| [`getPinnedMessagesFromServer`](#retrieve-pinned-messages-in-a-conversation) | `IEMChatManager` | Asynchronously retrieves a conversation's pinned message list from the server. |
| [`pinnedInfo`](#retrieve-the-pin-details-of-a-message) | `EMChatMessage` | Retrieves an individual message's pin details; returns `nil` when the message is not pinned. |
| [`pinTime`](#retrieve-the-pin-details-of-a-message) | `EMMessagePinInfo` | Retrieves the time of the latest pin operation. |
| [`operatorId`](#retrieve-the-pin-details-of-a-message) | `EMMessagePinInfo` | Retrieves the user ID of the operator who performed the latest pin operation. |
