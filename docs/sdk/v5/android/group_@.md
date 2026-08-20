# Group @ Messages

Group @ messages allow a user to @ mention one, multiple, or all members when sending a message in a group chat. Every member of a chat group can use the @ feature and @ mention all group members.

:::tip
Currently, this feature supports only text messages and emojis.
:::

For example, the UI can be implemented as follows:

1. Enter the "@" character in the input box and select the group members to mention.
2. After selecting the members, return to the chat page, edit the message, and send it.
3. When the current user is @ mentioned, display a corresponding prompt in the conversation list or on the message page, such as “Somebody@You”.
4. Open the conversation page to view the message.

The following image shows an example UI:

![img](/images/product/solution_common/group_mention/group_@_mobile.png)

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK. See [Quickstart](quickstart.html).
- Understand the EasyIM usage restrictions. See [Limitations](/product/limitation.html).

## Implementation

Group @ messages are sent in the same way as regular group messages. The sender specifies the @ mentioned group members in the `em_at_list` message extension. The SDK does not automatically generate @ prompts or handle the related UI. Your app must parse this field and display the prompt.

Implement an @ message as follows:

1. After creating a group message, the sender adds the mentioned members' user IDs to the `em_at_list` extension and sends the message.
2. The recipient receives the message through `EMMessageListener#onMessageReceived(List<EMMessage>)` and reads the extensions of `EMMessage`.
3. If `em_at_list` contains the current user's user ID or its value is `ALL`, the app can display an @ prompt in the UI. Otherwise, process it as a regular group message.

The data format of `em_at_list` is as follows:

- To @ mention one or more group members, use an array of user IDs, such as `["user1", "user2"]`.
- To @ mention all group members, use the string `ALL`.

::tip
The user IDs of @ mentioned members do not include the “@” prefix. The sender and recipient must use the same field name and value type and agree on the meaning of `ALL`.
:::

### Send messages

The following sample code shows how the sender @ mentions users in a message.

::: tabs#code

@tab Java

```java
// Add the user IDs of the @ mentioned members to the extension without the “@” prefix.
JSONArray atUserList = new JSONArray();
atUserList.put("user1");
atUserList.put("user2");

EMMessage msg = EMMessage.createTextSendMessage("@user1 @user2 你好", conversationId);
// A group @ message must be set to the group chat type.
msg.setChatType(EMMessage.ChatType.GroupChat);

// To @ mention one or more members, add the user ID array to em_at_list.
msg.setAttribute("em_at_list", atUserList);
// To @ mention all members, set em_at_list to the string "ALL":
// msg.setAttribute("em_at_list", "ALL");

// Send the group message.
EMClient.getInstance().chatManager().sendMessage(msg);

```

@tab Kotlin

```kotlin
// Add the user IDs of the @ mentioned members to the extension without the “@” prefix.
val atUserList = JSONArray()
atUserList.put("user1")
atUserList.put("user2")

val msg = EMMessage.createTextSendMessage("@user1 @user2 你好", conversationId)
// A group @ message must be set to the group chat type.
msg.chatType = EMMessage.ChatType.GroupChat

// To @ mention one or more members, add the user ID array to em_at_list.
msg.setAttribute("em_at_list", atUserList)
// To @ mention all members, set em_at_list to the string "ALL":
// msg.setAttribute("em_at_list", "ALL")

// Send the group message.
EMClient.getInstance().chatManager().sendMessage(msg)

```
:::

### Receive messages

When receiving a message, call `getJSONArrayAttribute` or `getStringAttribute` according to the value type of the extension to read `em_at_list` and check whether the message @ mentions the current user:

::: tabs#code

@tab Java

```java
private void handleMentionedMessage(EMMessage message) {
    // First read the value as a string to identify an @ mention of all members.
    String atAll = message.getStringAttribute("em_at_list", null);
    if ("ALL".equalsIgnoreCase(atAll)) {
        // The message @ mentions all members. Update the UI.
        return;
    }

    try {
        // When one or more members are @ mentioned, em_at_list is an array of user IDs.
        JSONArray atUserList = message.getJSONArrayAttribute("em_at_list");
        String currentUser = EMClient.getInstance().getCurrentUser();
        for (int i = 0; i < atUserList.length(); i++) {
            if (currentUser.equals(atUserList.getString(i))) {
                // The message @ mentions the current user. Update the UI.
                return;
            }
        }
    } catch (HyphenateException | JSONException e) {
        // The extension does not exist or its format is invalid. Process the message as a regular group message.
    }
}

@Override
public void onMessageReceived(List<EMMessage> messages) {
    for (EMMessage message : messages) {
        // Parse the @ extension only in group text messages.
        if (message.getChatType() == EMMessage.ChatType.GroupChat
                && message.getType() == EMMessage.Type.TXT) {
            handleMentionedMessage(message);
        }
    }
}

```

@tab Kotlin

```kotlin
private fun handleMentionedMessage(message: EMMessage) {
    // First read the value as a string to identify an @ mention of all members.
    val atAll = message.getStringAttribute("em_at_list", null)
    if (atAll.equals("ALL", ignoreCase = true)) {
        // The message @ mentions all members. Update the UI.
        return
    }

    try {
        // When one or more members are @ mentioned, em_at_list is an array of user IDs.
        val atUserList = message.getJSONArrayAttribute("em_at_list")
        val currentUser = EMClient.getInstance().currentUser
        for (i in 0 until atUserList.length()) {
            if (currentUser == atUserList.getString(i)) {
                // The message @ mentions the current user. Update the UI.
                return
            }
        }
    } catch (e: Exception) {
        // The extension does not exist or its format is invalid. Process the message as a regular group message.
    }
}

override fun onMessageReceived(messages: MutableList<EMMessage>?) {
    messages?.forEach { message ->
        // Parse the @ extension only in group text messages.
        if (message.chatType == EMMessage.ChatType.GroupChat
                && message.type == EMMessage.Type.TXT) {
            handleMentionedMessage(message)
        }
    }
}

```

:::

Implement the preceding `onMessageReceived` method in `EMMessageListener`. After creating the listener, register it and remove it when it is no longer needed:

```java
// Register the message listener saved as a member variable to receive callbacks for new messages.
EMClient.getInstance().chatManager().addMessageListener(messageListener);

// When the page or component is destroyed and the listener is no longer needed, remove the same listener instance.
EMClient.getInstance().chatManager().removeMessageListener(messageListener);
```

## FAQ

1. Q: Why is no @ prompt displayed when all group members are @ mentioned?

   A: Check whether the value of `em_at_list` is the string `ALL`. Because the app implements the @ feature through a message extension, inconsistent field names, value types, or spelling do not prevent the regular message from being sent, but they prevent the recipient from correctly identifying the @ status. You can perform a case-insensitive comparison for compatibility.

2. Q: What is the difference between @ mentioning multiple members and @ mentioning all members?

   A: When setting `ext`, use an array containing the user IDs of the members to mention for one or multiple group members. To @ mention everyone, use the string `ALL` as the field value.

3. Q: Q: Does the SDK automatically display a “Somebody @ mentioned me” prompt?

   A: No. The SDK transmits the message and its extensions. Your app must read the extensions of `EMMessage` in the `EMMessageListener#onMessageReceived(List<EMMessage>)` callback and update the conversation list or message page UI itself. 

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`createTextSendMessage`](#send-messages) | `EMMessage` | Create a text message to send. |
| [`sendMessage`](#send-messages) | `EMChatManager` | Send a group message. |
| [`getCurrentUser`](#receive-messages) | `EMClient` | Retrieve the current user's user ID. |







