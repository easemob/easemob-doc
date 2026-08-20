# Edit Messages

## Feature overview

EasyIM provides message editing. Users can edit successfully sent messages, and the messages stored on the server and locally are updated without sending a new message.

### Supported scope

This feature applies to one-to-one chats, group chats, and chat rooms as follows:

- Text and custom messages: Both the message body `body` and extension `ext` can be edited.
- File, video, audio, image, location, and combined messages: Only the extension `ext` can be edited. The message body cannot be edited.
- Command messages: Editing is not supported.

### Message editing process

1. The app calls the message editing API and passes the message to edit and the updated content.  
2. The SDK sends the edit request to the server. After updating the message, the server returns the edited message to the SDK.  
3. The SDK updates the corresponding message in the local database and returns the updated message to the app through the edit result callback.  
4. After other members of the conversation receive the message edit event, they can retrieve the edited message through the message listener and update the UI.

### Message editing permissions by conversation type

- In a one-to-one chat, only the sender can edit a message.
- In a group chat or chat room, regular members can edit only messages they sent. The group owner, chat room owner, and admins can edit their own messages and messages sent by regular members. In this case, the sender remains unchanged, while the editor user ID in the message body is the user ID of the group owner, chat room owner, or admin.

### Lifecycle of an edited message

There is no time limit for editing a message as long as it is still stored on the server. After a message is edited, its lifecycle, or server-side retention period, is recalculated. For example, if a message can be stored on the server for 180 days and a user edits it on day 30 after sending, when 150 days remain in its retention period, the message can be stored for another 180 days after the edit succeeds.

## Feature activation

To use this feature, **contact the Easemob business team to enable it**.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and connect to the server. See [Quickstart](quickstart.html) and [Initialization](initialization.html).
- Understand the EasyIM API usage restrictions. See [Limitations](/product/limitation.html).
- Contact the Easemob business team to enable message editing.

## Edit a message

Call `EMChatManager#asyncModifyMessage` to edit a successfully sent message. This method updates both the server-side and local message without changing the message ID. In addition to the updated content, the body of an edited message contains the last editor's user ID, the editing time, and the number of edits. Other message information, such as the message ID, sender, and recipient, does not change, except for the message body and extension `ext`.

`messageBodyModified` and `ext` cannot both be `null`. When a non-`null` `ext` is passed, the new extensions overwrite all extensions of the original message. To retain existing extensions, merge them into the new `Map` before passing it. Extension values support the `String`, `Integer`, `Double`, `Boolean`, `Long`, `Float`, `JSONObject`, and `JSONArray` types.

:::tip
A message can be edited up to 10 times by default.
:::

```java
// Text message: Both the message body and extensions can be edited.
EMTextMessageBody textBody =
        new EMTextMessageBody("new content");
Map<String, Object> textExt = new HashMap<>();
textExt.put("newKey", "new value");

EMClient.getInstance()
        .chatManager()
        .asyncModifyMessage(
                messageId,
                textBody,
                textExt,
                new EMValueCallBack<EMMessage>() {
                    @Override
                    public void onSuccess(EMMessage message) {
                        // message is the edited message.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });

// Custom message: Both the message body and extensions can be edited.
EMCustomMessageBody customBody =
        new EMCustomMessageBody("new action");
Map<String, Object> customExt = new HashMap<>();
customExt.put("newKey1", "new value");
customExt.put("newKey2", 123);

EMClient.getInstance()
        .chatManager()
        .asyncModifyMessage(
                messageId,
                customBody,
                customExt,
                new EMValueCallBack<EMMessage>() {
                    @Override
                    public void onSuccess(EMMessage message) {
                        // message is the edited message.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });

// File, video, audio, image, location, and combined messages:
// Only extensions can be edited, so pass null for the message body.
Map<String, Object> attachmentExt = new HashMap<>();
attachmentExt.put("newKey1", false);
attachmentExt.put("newKey2", "new value");

EMClient.getInstance()
        .chatManager()
        .asyncModifyMessage(
                messageId,
                null,
                attachmentExt,
                new EMValueCallBack<EMMessage>() {
                    @Override
                    public void onSuccess(EMMessage message) {
                        // message is the edited message.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

After a message is edited, the recipient and the current account's other online devices receive `EMMessageListener#onMessageContentChanged`. This callback carries the edited message, the last editor's user ID, and the latest editing time. For group chat and chat room conversations, all group or chat room members other than the user who performed the edit receive the callback.

:::tip
If a custom message is [edited through the RESTful API](/document/server-side/message_modify.html), the recipient also receives the edited custom message through `EMMessageListener#onMessageContentChanged`.
:::

```java
EMMessageListener messageListener = new EMMessageListener() {
    @Override
    public void onMessageContentChanged(
            EMMessage modifiedMessage,
            String operatorId,
            long operationTime) {
        EMMessageBody body = modifiedMessage.getBody();

        // Retrieve the cumulative number of edits.
        int operationCount = body.operationCount();

        // The last editor and editing time can also be retrieved from the message body.
        // Their values are the same as the operatorId and operationTime callback parameters.
        String lastOperatorId = body.operatorId();
        long lastOperationTime = body.operationTime();

        // Retrieve the edited message extensions.
        Map<String, Object> modifiedExt = modifiedMessage.ext();
        if (modifiedExt != null) {
            for (Map.Entry<String, Object> entry : modifiedExt.entrySet()) {
                EMLog.d(
                        "MessageModify",
                        "key: " + entry.getKey()
                                + ", value: " + entry.getValue());
            }
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
| [`asyncModifyMessage`](#edit-a-message) | `EMChatManager` | Edit the message body or extensions of a server-side and local message. |
| [`operatorId`](#edit-a-message) | `EMMessageBody` | Retrieve the user ID of the last message editor. |
| [`ext`](#edit-a-message) | `EMMessage` | Retrieve the edited message extensions. |
