# Recall Messages

## Feature overview

One-to-one, group chat, and chat room conversations support recalling a successfully sent message.

**Supported scope**

- All message types except command messages can be recalled.

**Permission rules**

- In a one-to-one chat, only the sender can recall a message they sent. The recall fails if the message has exceeded the recall time limit.
- In a group chat or chat room, regular members can recall only messages they sent. The recall fails if the message has exceeded the recall time limit.
- In a group chat or chat room, the group owner, group admins, chat room owner, and chat room admins can recall messages sent by other members and are not subject to the recall time limit for regular members. They can recall a message even after it expires.

**Time limit**

- By default, a sender can recall a message within 2 minutes after sending it.
- You can adjust the recall period, up to 7 days, on the **EasyIM > Basic Features > Messages** page in the [EasyIM Console](https://console.easyim.ai/user/login).

**Recall result**

- After a message is recalled, the message stored on the server is removed, including its historical, offline, and roaming copies.
- The message is also removed from local memory and the local databases of the sender and recipient.
- For attachment messages such as image, audio, video, and file messages, the corresponding attachment is also deleted when the message is recalled.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and establish a connection successfully. See [Quickstart](quickstart.html).
- Understand the EasyIM usage restrictions. See [Limitations](/product/limitation.html).

## Recall a message

Call `EMChatManager#asyncRecallMessage` to recall a successfully sent message.

After the call succeeds, the message stored on the server and the local copies stored by the sender and recipient, including historical, offline, and roaming copies, are removed. Relevant users receive the recall event through `EMMessageListener#onMessageRecalledWithExt`.

:::tip
1. When recalling a message, you can use the `ext` parameter to carry a custom string for business processing by clients that receive the recall event.
2. For attachment messages, including image, audio, video, and file messages, the attachment is also deleted after the message is recalled.
:::


```java
String recallExt = "撤回了一条消息";

// Asynchronous method.
EMClient.getInstance()
        .chatManager()
        .asyncRecallMessage(
                message,
                recallExt,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // The message was recalled successfully.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // Failed to recall the message. Handle the failure based on the error code and error message.
                    }

                    @Override
                    public void onProgress(
                            int progress,
                            String status) {
                    }
                });
```

## Monitor message recalls

Use `EMMessageListener#onMessageRecalledWithExt` to monitor message recall events. The callback returns a list of `EMRecallMessageInfo` objects:

| Method | Description |
| :--- | :--- |
| `getRecallBy()` | Retrieve the recaller's user ID. |
| `getRecallMessageId()` | Retrieve the ID of the recalled message. |
| `getExt()` | Retrieve the extension string carried when the message was recalled. |
| `getConversationId()` | Retrieve the ID of the conversation containing the recalled message. |
| `getRecallMessage()` | Retrieve the recalled message object. |

The return value of `getRecallMessage()` depends on how the message was received:

- If the user received the message while online, this method can usually retrieve the recalled message object when the message is recalled.
- If the recipient was offline both when the message was sent and when it was recalled, the user receives only the recall event after getting online, and this method returns `null`.

Your app can refresh the message list based on the callback information or display a placeholder prompt such as “A user recalled a message” in the UI.

```java
EMMessageListener messageListener = new EMMessageListener() {
    @Override
    public void onMessageRecalledWithExt(
            List<EMRecallMessageInfo> recallInfoList) {
        for (EMRecallMessageInfo recallInfo : recallInfoList) {
            String recaller = recallInfo.getRecallBy();
            String recalledMessageId =
                    recallInfo.getRecallMessageId();
            String recallExt = recallInfo.getExt();
            String conversationId =
                    recallInfo.getConversationId();
            EMMessage recalledMessage =
                    recallInfo.getRecallMessage();

            // Update the message list and UI based on the recall information.
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
| [`asyncRecallMessage`](#recall-a-message) | `EMChatManager` | Asynchronously recall a successfully sent message and optionally include an extension string. |
| [`recallMessage`](#recall-a-message) | `EMChatManager` | Synchronously recall a successfully sent message and optionally include an extension string. |
