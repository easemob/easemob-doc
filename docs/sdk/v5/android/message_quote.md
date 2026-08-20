# Quote Messages

## Feature overview

Quoting a message means replying to a sent message and including a summary of the quoted message in the new message so the recipient can understand the context of the reply.

Except for command messages, all message types can carry quote information through the new message's extension. The SDK does not verify the sending status or existence of the original quoted message.

:::tip
In a message quote, `msgQuote` is a custom business field in the new message's `ext`. It must remain JSON-serializable together with other extensions and comply with the overall message size limit when sent.
:::

The following table shows example quote UIs for different message types:

| Message type | Original message exists | Original message does not exist |
| :--- | :--- | :--- |
| Text message | ![img](/images/product/solution_common/message_reply/text_normal_mobile.png) | ![img](/images/product/solution_common/message_reply/text_no_mobile.png) |
| Image message | ![img](/images/product/solution_common/message_reply/image_normal_mobile.png) | ![img](/images/product/solution_common/message_reply/image_no_mobile.png) |
| Voice message | ![img](/images/product/solution_common/message_reply/voice_normal_mobile.png) | ![img](/images/product/solution_common/message_reply/voice_no_mobile.png) |
| Video message | ![img](/images/product/solution_common/message_reply/video_normal_mobile.png) | ![img](/images/product/solution_common/message_reply/video_no_mobile.png) |
| File message | ![img](/images/product/solution_common/message_reply/file_normal_mobile.png) | ![img](/images/product/solution_common/message_reply/file_no_mobile.png) |
| Contact card message | ![img](/images/product/solution_common/message_reply/card_normal_mobile.png) | ![img](/images/product/solution_common/message_reply/card_no_mobile.png) |
| Combined message | ![img](/images/product/solution_common/message_reply/combine_normal_mobile.png) | ![img](/images/product/solution_common/message_reply/combine_no_mobile.png) |

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in. See [Quickstart](quickstart.html).
- Implement basic message sending and receiving.
- Understand the EasyIM usage restrictions. See [Limitations](/product/limitation.html).

## Implementation

Implement message quotes as follows:

1. Before sending a reply, your business logic obtains key information from the original quoted message.
2. Create a new reply message and write a summary of the original message to the new message's `msgQuote` extension.
3. After receiving the new message, the recipient parses `msgQuote` and renders the quote area in the message list.
4. To support navigating to the original message by tapping the quote area, locate the original message in the local message list based on `msgQuote.msgID`.

Your business logic defines the data structure of `msgQuote`. You can use the following structure as a reference:

```json
{
  "msgQuote": {
    "msgID": "原消息 ID",
    "msgPreview": "原消息的预览内容",
    "msgSender": "原消息发送方的用户 ID",
    "msgType": "原消息类型"
  }
}
```

The fields are described below:

- `msgID`: The quoted message ID recorded by the business layer and used to locate the original message.
- `msgPreview`: A preview of the quoted message, used as a fallback when the original message cannot be found.
- `msgSender`: The sender of the quoted message recorded by the business layer.
- `msgType`: The quoted message type recorded by the business layer and used to render the quote summary by type.

When displaying the quote in the message list, combine information from `msgQuote` into a summary, such as `${msgSender}: ${msgPreview}`.

To support navigating to the original message by tapping the quote area, locate the message in the local message list based on `msgID`, scroll to it, and highlight it. If the quoted message has been deleted or is not loaded in the local message list, display `msgPreview` or a **Quoted content does not exist** prompt.

### Send a message with a quote

The following example replies to a text message with a quoted message:

::: tabs#code

@tab Java

```java
EMMessage message = EMMessage.createTextSendMessage(
        "好的，收到！",
        conversationId);

// Set GroupChat for group chat or ChatRoom for a chat room. The default is Chat for one-to-one chat.
message.setChatType(EMMessage.ChatType.Chat);

JSONObject quote = new JSONObject();
try {
    // Add summary information about the quoted message.
    quote.put("msgID", "original-message-id");
    quote.put("msgPreview", "原消息内容预览");
    quote.put("msgSender", "user1");
    quote.put("msgType", "text");
} catch (JSONException exception) {
    EMLog.e("MessageQuote", exception.getMessage());
    return;
}

// Send the quote information as an extension of the new message.
message.setAttribute("msgQuote", quote);
EMClient.getInstance()
        .chatManager()
        .sendMessage(message);
```

@tab Kotlin

```kotlin
val message = EMMessage.createTextSendMessage(
    "好的，收到！",
    conversationId
)

// Set GroupChat for group chat or ChatRoom for a chat room. The default is Chat for one-to-one chat.
message.chatType = EMMessage.ChatType.Chat

val quote = JSONObject()
try {
    // Add summary information about the quoted message.
    quote.put("msgID", "original-message-id")
    quote.put("msgPreview", "原消息内容预览")
    quote.put("msgSender", "user1")
    quote.put("msgType", "text")
} catch (exception: JSONException) {
    EMLog.e("MessageQuote", exception.message)
    return
}

// Send the quote information as an extension of the new message.
message.setAttribute("msgQuote", quote)
EMClient.getInstance()
    .chatManager()
    .sendMessage(message)
```

:::

### Parse the received message on the recipient

After receiving a message, the recipient checks whether its extensions contain `msgQuote`. If so, call `EMMessage#getJSONObjectAttribute` to parse the quote information and refresh the UI.

::: tabs#code

@tab Java

```java
private void handleQuotedMessage(EMMessage message) {
    Map<String, Object> ext = message.ext();
    if (ext == null || !ext.containsKey("msgQuote")) {
        return;
    }

    try {
        JSONObject quote = message.getJSONObjectAttribute("msgQuote");

        // Read the quoted message summary and update the UI.
        String quotedMessageId = quote.optString("msgID");
        String quotedSender = quote.optString("msgSender");
        String quotedType = quote.optString("msgType");
        String quotedPreview = quote.optString("msgPreview");
    } catch (HyphenateException exception) {
        EMLog.e("MessageQuote", exception.getMessage());
    }
}

private final EMMessageListener messageListener =
        new EMMessageListener() {
            @Override
            public void onMessageReceived(List<EMMessage> messages) {
                for (EMMessage message : messages) {
                    handleQuotedMessage(message);
                }
            }
        };

EMClient.getInstance()
        .chatManager()
        .addMessageListener(messageListener);
```

@tab Kotlin

```kotlin
private fun handleQuotedMessage(message: EMMessage) {
    val ext = message.ext()
    if (ext == null || !ext.containsKey("msgQuote")) {
        return
    }

    try {
        val quote = message.getJSONObjectAttribute("msgQuote")

        // Read the quoted message summary and update the UI.
        val quotedMessageId = quote.optString("msgID")
        val quotedSender = quote.optString("msgSender")
        val quotedType = quote.optString("msgType")
        val quotedPreview = quote.optString("msgPreview")
    } catch (exception: HyphenateException) {
        EMLog.e("MessageQuote", exception.message)
    }
}

private val messageListener = object : EMMessageListener {
    override fun onMessageReceived(messages: MutableList<EMMessage>?) {
        messages?.forEach { message ->
            handleQuotedMessage(message)
        }
    }
}

EMClient.getInstance()
    .chatManager()
    .addMessageListener(messageListener)
```

:::

Remove the listener when message monitoring is no longer needed:

```java
EMClient.getInstance()
        .chatManager()
        .removeMessageListener(messageListener);
```

## FAQ

1. Q: Does the SDK provide a dedicated API for creating quoted messages?
   A: No. Currently, quoted messages are implemented through the `msgQuote` extension of a new message.

2. Q: What should be displayed if the quoted message does not exist?
   A: Display the `msgPreview` content or **Quoted content does not exist**.

3. Q: Does the SDK automatically verify that a quoted message exists?
   A: No. `msgQuote` is primarily used for business display. Your business logic must locate the original message and implement fallback display when it does not exist.

4. Q: What should I do if too many messages exist between the current message and the quoted message when navigating to it?
   A: Loading all messages between the two messages into the UI at once may use a large amount of memory. Set a threshold for the number of messages loaded at a time. When the threshold is exceeded, stop loading more messages or do not perform the navigation.

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`createTextSendMessage`](#send-a-message-with-a-quote) | `EMMessage` | Create a text message that replies to the original message. |
| [`sendMessage`](#send-a-message-with-a-quote) | `EMChatManager` | Send a message carrying quote information. |
| [`ext`](#parse-the-received-message-on-the-recipient) | `EMMessage` | Retrieve all message extensions. |
