# Configure Push Extension Features

You can use extension fields to implement custom push behavior, including force push and sending silent messages.

For push extension fields, see [Offline push extension fields](/rest/push_extension.html).

## Set custom push fields

When creating a push message, you can add custom fields to the message to implement custom push settings.

```java
// This example uses a text message. Other message types, such as attachment messages, are configured in the same way.
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("message content");
// Set the user ID to send to.
message.setTo("toChatUsername");
// Set the custom push extension.
JSONObject emPushExt = new JSONObject();
try {
    JSONObject custom = new JSONObject();
    custom.put("key1", "value1");
    custom.put("key2", "value2");
    emPushExt.put("custom", custom);
} catch (JSONException e) {
    // Handle JSON construction failure.
    return;
}
// Set the push extension to the message.
message.setAttribute("em_push_ext", emPushExt);
// Set the message body.
message.addBody(txtBody);
// Set the message callback.
message.setMessageStatusCallback(new EMCallBack() {
    @Override
    public void onSuccess() {}

    @Override
    public void onError(int errorCode, String errorMessage) {}

    @Override
    public void onProgress(int progress, String status) {}
});
// Send the message.
EMClient.getInstance().chatManager().sendMessage(message);
```

The data structure of custom fields is as follows:

```json
{
    "em_push_ext": {
        "custom": {
            "key1": "value1",
            "key2": "value2"
        }
    }
}
```

| Parameter | Description |
| :--------------- | :----------------- |
| `em_push_ext` | The fixed value of the message push extension. This value cannot be changed. |
| `custom` | Message extension. Use the extension to add custom fields to the push notification. This value is fixed. |
| `key1`/`key2` | The specific content of the custom message push extension. |

For how the app parses custom fields, see [Parse received push fields](push_parsing.html).

## Force push

After force push is set, when a user sends a message, the recipient's Do Not Disturb settings are ignored. The message is pushed to the recipient normally regardless of whether the recipient is in a Do Not Disturb time period.

```java
// This example uses a text message. Other message types, such as image and file messages, are configured in the same way.
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("test");
// Set the recipient: the peer user ID for one-to-one chat, the group ID for group chat, or the chat room ID for chat room chat.
message.setTo("toChatUsername");
// Set whether to force push. This field is a built-in extension field: `true`: force push; (default) `false`: non-force push.
message.setAttribute("em_force_notification", true);
// Set the message body.
message.addBody(txtBody);
// Set the message callback.
message.setMessageStatusCallback(new EMCallBack() {
    @Override
    public void onSuccess() {}

    @Override
    public void onError(int errorCode, String errorMessage) {}

    @Override
    public void onProgress(int progress, String status) {}
});
// Send the message.
EMClient.getInstance().chatManager().sendMessage(message);
```

## Send silent messages

Sending a silent message means that the sender sets the message not to be pushed when sending it. That is, when the user is offline, the EasyIM service does not push a message notification to the user's device through a third-party vendor message push service. Therefore, the user does not receive a message push notification. When the user gets online again, the user receives all messages sent during the offline period.

Both sending silent messages and Do Not Disturb mode result in no message push. The difference is that a silent message is configured by the sender when sending it, whereas DND is configured by the recipient to not receive push notifications during a specified period.

```java
// This example uses a text message. Other message types, such as image and file messages, are configured in the same way.
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("test");
// Set the recipient: the peer user ID for one-to-one chat, the group ID for group chat, or the chat room ID for chat room chat.
message.setTo("toChatUsername");
// Set whether to send a silent message. This field is a built-in extension field: `true`: send a silent message; (default) `false`: push this message.
message.setAttribute("em_ignore_notification", true);
// Set the message body.
message.addBody(txtBody);
// Set the message callback.
message.setMessageStatusCallback(new EMCallBack() {
    @Override
    public void onSuccess() {}

    @Override
    public void onError(int errorCode, String errorMessage) {}

    @Override
    public void onProgress(int progress, String status) {}
});
// Send the message.
EMClient.getInstance().chatManager().sendMessage(message);
```

## API list

| API name | Module/class | Description |
| :--- | :--- | :--- |
| [`createSendMessage`](#set-custom-push-fields) | `EMMessage` | Creates a message of the specified type. |
| [`addBody`](#set-custom-push-fields) | `EMMessage` | Sets the message body. |
| [`sendMessage`](#set-custom-push-fields) | `EMChatManager` | Sends a message. |
