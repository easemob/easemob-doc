# Use the Message Extension Field to Set Push Notification Content

When sending a message, you can set custom push display content through the fixed message extension field `em_push_ext`. The value of this field is a `JSONObject`, in which `title` and `content` are used to set the push title and push content respectively.

```java
// This example uses a text message. Other message types, such as attachment messages, are configured in the same way.
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("message content");
// Set the peer user ID for one-to-one chat.
message.setTo("toChatUsername");
// Set the custom push alert.
JSONObject extObject = new JSONObject();
try {
    extObject.put("title", "custom push title");
    extObject.put("content", "custom push content");
} catch (JSONException e) {
    e.printStackTrace();
}
// Set the push extension to the message.
message.setAttribute("em_push_ext", extObject);
// Set the message body.
message.addBody(txtBody);
// Set the message sending result callback.
message.setMessageStatusCallback(new EMCallBack() {
    @Override
    public void onSuccess() {
    }

    @Override
    public void onError(int errorCode, String errorMessage) {
    }

    @Override
    public void onProgress(int progress, String status) {
    }
});
// Send the message.
EMClient.getInstance().chatManager().sendMessage(message);
```

| Parameter | Description |
| :--- | :--- |
| `toChatUsername` | The user ID of the receiver of the one-to-one message. In group chat or chat room scenarios, set the corresponding group or chat room ID and set the message conversation type. |
| `em_push_ext` | The fixed message extension field used to customize push display content. The value is a `JSONObject`. |
| `title` | The fixed JSON key in `em_push_ext` used to set the custom push title. |
| `content` | The fixed JSON key in `em_push_ext` used to set the custom push content. |

## API list

| API name | Module/class | Description |
| :--- | :--- | :--- |
| [`createSendMessage`](#use-the-message-extension-field-to-set-push-notification-content) | `EMMessage` | Creates a message of the specified type. |
| [`addBody`](#use-the-message-extension-field-to-set-push-notification-content) | `EMMessage` | Sets the message body. |
| [`sendMessage`](#use-the-message-extension-field-to-set-push-notification-content) | `EMChatManager` | Sends a message. |
