# Recall Messages

## Feature overview

One-to-one chats, group chats, and chat rooms support recalling successfully sent messages.

**Applicable scope**

All message types except command messages support recall.

**Permission rules**

- In a one-to-one chat, only the sender can recall their own message. Recall fails after the recall time limit expires.
- In a group chat or chat room, regular members can recall only their own messages. Recall fails after the recall time limit expires.
- In a group chat or chat room, the group owner, group admins, chat room owner, and chat room admins can recall messages sent by other members without the regular-member time limit, even after the message expires.

**Time limit**

- By default, the sender can recall a message within 2 minutes after sending it.
- You can adjust the recall period on the **Instant Messaging > Basic Features > Messages** page in the [EasyIM Console](https://console.easyim.ai/user/login). The maximum is 7 days.

**Recall result**

- After a message is recalled, the server removes it, including its historical, offline, and roaming copies.
- The sender's and recipient's local memory and database also remove the message.
- For attachment messages such as image, audio, video, and file messages, the corresponding attachment is also deleted after the message is recalled.

## Prerequisite

Before you start, make sure that the following requirements are met:

- The SDK is initialized and a connection is established. For details, see [Quickstart](quickstart.html).
- You understand the usage limits of EasyIM. For details, see [Usage limits](/product/limitation.html).

## Recall a message

Call `recallMessageWithMessageId` to recall a successfully sent message.

After the call succeeds, the message saved on the server and in the sender's and recipient's local storage—including historical, offline, and roaming copies—is removed. Relevant users receive the recall event through `messagesInfoDidRecall`.

:::tip
1. You can use the `ext` parameter to carry a custom string or JSON string for the client that receives the recall event.
2. For attachment messages, including image, audio, video, and file messages, the attachment is also deleted when the message is recalled.
:::

```objectivec
// messageId is the ID of the successfully sent message to recall.
NSString *recallExt = @"撤回了一条消息";

// Asynchronously recall the message and carry custom information in ext.
[[EMClient sharedClient].chatManager recallMessageWithMessageId:messageId
                                                             ext:recallExt
                                                      completion:^(EMError *error) {
    if (!error) {
        // Message recall succeeded.
    } else {
        // Message recall failed. Handle the error code and error message.
    }
}];
```

## Monitor message recalls

Use `messagesInfoDidRecall` to monitor message recall events. The callback returns a list of `EMRecallMessageInfo` objects:

| Property | Description |
| :--- | :--- |
| `recallBy` | Retrieves the user ID of the user who recalled the message. |
| `recallMessageId` | Retrieves the ID of the recalled message. |
| `ext` | Retrieves the extension string carried when the message was recalled. |
| `conversationId` | Retrieves the ID of the conversation containing the recalled message. |
| `recallMessage` | Retrieves the recalled message object. |

The return value of `recallMessage` depends on how the message was received:

- If the user received the message while online, this property usually returns the recalled message object when the message is recalled.
- If the recipient was offline both when the message was sent and when it was recalled, the user receives only the recall event after getting online, and this property returns `nil`.

The app can refresh the message list based on the callback information or display a placeholder such as “A user recalled a message” in the UI.

```objectivec
// Implement the message recall callback in EMChatManagerDelegate.
- (void)messagesInfoDidRecall:(NSArray<EMRecallMessageInfo *> *)recallInfoList {
    for (EMRecallMessageInfo *recallInfo in recallInfoList) {
        // User ID of the user who recalled the message.
        NSString *recaller = recallInfo.recallBy;
        // ID of the recalled message.
        NSString *recalledMessageId = recallInfo.recallMessageId;
        // Extension string carried when the message was recalled.
        NSString *recallExt = recallInfo.ext;
        // ID of the conversation containing the recalled message.
        NSString *conversationId = recallInfo.conversationId;
        // May be nil when a message is recalled while offline.
        EMChatMessage *recalledMessage = recallInfo.recallMessage;

        // Update the message list and UI based on the recall information.
    }
}

// Register the message delegate to receive messagesInfoDidRecall callbacks.
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];

// Remove the message delegate when monitoring is no longer needed.
[[EMClient sharedClient].chatManager removeDelegate:self];
```

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`recallMessageWithMessageId`](#recall-a-message) | `IEMChatManager` | Asynchronously recalls a successfully sent message and can carry an extension string. |
| [`recallBy`](#monitor-message-recalls) | `EMRecallMessageInfo` | Retrieves the user ID of the user who recalled the message. |
| [`recallMessageId`](#monitor-message-recalls) | `EMRecallMessageInfo` | Retrieves the ID of the recalled message. |
| [`ext`](#monitor-message-recalls) | `EMRecallMessageInfo` | Retrieves the extension string carried during recall. |
| [`conversationId`](#monitor-message-recalls) | `EMRecallMessageInfo` | Retrieves the ID of the conversation containing the recalled message. |
| [`recallMessage`](#monitor-message-recalls) | `EMRecallMessageInfo` | Retrieves the recalled message object; may return `nil` when the user was offline. |
