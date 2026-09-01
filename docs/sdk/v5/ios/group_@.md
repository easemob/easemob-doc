# Group @ Mentions

Group @ mentions allow users to mention one, multiple, or all group members and send a message in a group chat. Every group member can use the @ feature, including to mention all members in the group.

:::tip
Currently, this feature supports only text messages and Reactions.
:::

An example UI implementation is shown below:

1. Enter the `@` character in the input box and select the group members to mention.
2. After selecting group members, return to the chat page, edit the message, and send it.
3. When the current user is mentioned, display a corresponding prompt in the conversation list or message page, such as `Somebody@You`.
4. The user enters the conversation page to view the message.

The following figure shows an example UI implementation:

![img](/images/product/solution_common/group_mention/group_@_mobile.png)

## Prerequisite

Before you start, make sure that the following requirements are met:

- The SDK is initialized. For details, see [Quickstart](quickstart.html).
- You understand the usage limits of EasyIM. For details, see [IM feature limits](/product/limitation.html).

## Implementation process

Sending a group @ mention message follows the same process as sending a regular group message. The app implements the @ feature through message extension fields; the SDK does not automatically generate @ prompts or process the related UI.

The implementation process is as follows:

1. The sender writes the user IDs of the mentioned members to the `em_at_list` message extension field and then sends the group message.
2. The recipient obtains the message in the `messagesDidReceive` callback and parses `ext`.
3. If `em_at_list` contains the current logged-in user's ID or its value is `ALL`, the app should display the corresponding @ prompt in the UI. Otherwise, process the message as a regular group message.

The data format of `em_at_list` is as follows:

- Mention one or multiple group members: The value is an array of user IDs, for example, `"em_at_list": ["user1", "user2"]`.
- Mention all group members: The value is the string `ALL`, that is, `"em_at_list": "ALL"`.

:::tip
The user IDs of mentioned members do not include the `@` prefix. The sender and recipient must agree on the field name, field value type, and `ALL` string.
:::

### Send a message

The sender creates an `EMChatMessage`, writes the IDs of the mentioned members to `ext`, sets `chatType` to a group chat, and sends the message.

```swift
let groupId = "groupId"
let mentionedUserIds = ["user1", "user2"]
let body = EMTextMessageBody(text: "@user1 @user2 Hello")

// When mentioning one or multiple group members, em_at_list is an array of user IDs.
let ext: [String: Any] = ["em_at_list": mentionedUserIds]
let message = EMChatMessage(
    conversationID: groupId,
    body: body,
    ext: ext
)
message.chatType = .groupChat

EMClient.shared().chatManager?.send(
    message,
    progress: nil
) { _, error in
    if let error = error {
        print("Failed to send the group @ message: \(error.errorDescription ?? "unknown error")")
        return
    }
    print("Group @ message sent successfully")
}
```

To mention all group members, set `em_at_list` to the string `ALL`:

```swift
let ext: [String: Any] = ["em_at_list": "ALL"]
```

### Receive a message

The recipient implements `messagesDidReceive`, parses only the `em_at_list` extension field of group text messages, and determines whether the message mentions the current user.

```swift
final class GroupMentionHandler: NSObject, EMChatManagerDelegate {
    func startObserving() {
        EMClient.shared().chatManager?.add(self, delegateQueue: nil)
    }

    func stopObserving() {
        EMClient.shared().chatManager?.remove(self)
    }

    func messagesDidReceive(_ messages: [EMChatMessage]) {
        for message in messages {
            guard message.chatType == .groupChat,
                  message.body.type == .text else {
                continue
            }

            handleMention(in: message)
        }
    }

    private func handleMention(in message: EMChatMessage) {
        guard let mentionValue = message.ext?["em_at_list"] else {
            return
        }

        // When em_at_list is the string ALL, it indicates all group members are mentioned.
        if let mentionTarget = mentionValue as? String,
           mentionTarget.caseInsensitiveCompare("ALL") == .orderedSame {
            // Update the UI to display a prompt such as "@Everyone".
            return
        }

        // When em_at_list is an array of strings, check whether it contains the current logged-in user.
        guard let mentionedUserIds = mentionValue as? [String],
              let currentUserId = EMClient.shared().currentUsername,
              mentionedUserIds.contains(currentUserId) else {
            return
        }

        // Update the UI to display a prompt such as "Someone mentioned you".
    }
}
```

Call `startObserving` to register the message delegate. When the page or component is destroyed and no longer needs message callbacks, call `stopObserving` to remove the same delegate instance and avoid duplicate callbacks.

## FAQ

1. Q: Why is no @ prompt displayed when all group members are mentioned?

   A: Make sure that the value of `em_at_list` is the string `ALL`. The app implements the @ feature through message extensions. Inconsistent field names, field value types, or spelling usually does not affect regular message sending, but it prevents the recipient from identifying the @ status. The recipient can ignore letter case when comparing `ALL`.

2. Q: What is the difference between mentioning multiple members and mentioning all members?

   A: When one or multiple members are mentioned, `em_at_list` is an array of the mentioned members' user IDs. When all members are mentioned, its value is the string `ALL`.

3. Q: Does the SDK automatically display a "Someone mentioned you" prompt?

   A: No. The SDK transmits the message and its extension fields. After receiving a message, the app must parse `ext` and update the UI of the conversation list or message page.

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`initWithConversationID`](#send-a-message) | `EMChatMessage` | Creates a message and carries the user ID array or the string `ALL` of mentioned members in `ext`. |
| [`chatType`](#send-a-message) | `EMChatMessage` | Sets the conversation type. A group @ mention message should use `EMChatTypeGroupChat`. |
| [`sendMessage`](#send-a-message) | `IEMChatManager` | Sends a group @ mention message. |
| [`addDelegate`](#receive-a-message) / [`removeDelegate`](#receive-a-message) | `IEMChatManager` | Registers or removes the message delegate. |
| [`ext`](#receive-a-message) | `EMChatMessage` | Obtains the message extension fields and reads `em_at_list`. |
| [`currentUsername`](#receive-a-message) | `EMClient` | Obtains the user ID of the current logged-in user. |
