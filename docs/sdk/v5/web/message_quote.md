# Quote Messages

## Feature overview

Quoting a message means replying to a sent message and including a summary of the quoted message in the new message so that the recipient can understand the context of the reply.

For all message types except command messages, quote information can be carried in the extension of the new message. The SDK does not verify the sending state or existence of the original quoted message.

:::tip
When quoting a message, `msgQuote` is a custom business field in the new message's `ext`. It must remain JSON serializable together with the other extension fields and comply with the overall message size limit for sending.
:::

The following table shows UI examples of quotes for different message types:

| Message type  | Original message exists | Original message does not exist |
| :--------- | :----- | :------- |
| Text message | ![img](/images/product/solution_common/message_reply/text_normal_web.png) | ![img](/images/product/solution_common/message_reply/text_no_web.png) |
| Image message | ![img](/images/product/solution_common/message_reply/image_normal_web.png)  | ![img](/images/product/solution_common/message_reply/image_no_web.png) |
| Voice message | ![img](/images/product/solution_common/message_reply/voice_normal_web.png) | ![img](/images/product/solution_common/message_reply/voice_no_web.png) |
| Video message | ![img](/images/product/solution_common/message_reply/video_normal_web.png) | ![img](/images/product/solution_common/message_reply/video_no_web.png) |
| File message | ![img](/images/product/solution_common/message_reply/file_normal_web.png) | ![img](/images/product/solution_common/message_reply/file_no_web.png) |
| Contact card message | ![img](/images/product/solution_common/message_reply/card_normal_web.png) | ![img](/images/product/solution_common/message_reply/card_no_web.png) |
| Combined message | ![img](/images/product/solution_common/message_reply/combine_normal_web.png) | ![img](/images/product/solution_common/message_reply/combine_no_web.png) |

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in. For details, see [Quickstart](quickstart.html).
- Implement basic message sending and receiving. For details, see the documents about sending and receiving messages.
- Register `ChatManager` so that you can call APIs for message creation, sending, and event monitoring through `client.chatManager`.
- Understand the EasyIM limitations. For details, see [Limitations](/product/limitation.html).

## Implementation

Implement message quoting as follows:

1. Before sending the reply, obtain key information from the original message to quote in your app.
2. When creating the new message object, write the original message summary to `ext.msgQuote` in the new message.
3. After receiving the message, the recipient parses `ext.msgQuote` and renders a quote area in the message list.
4. To support jumping to the original message by clicking the quote area, locate the original message in the local message list using `msgQuote.msgID`.

Define the `msgQuote` data structure according to your business requirements. The following is an example:

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: 'user2',
  conversationType: 'singleChat',
  content: '好的，收到！',
  ext: {
    msgQuote: {
      msgID: 'original-msg-id',
      msgPreview: '原消息内容预览',
      msgSender: 'user1',
      msgType: 'text',
    },
  },
});

await client.chatManager.sendMessage(message);
```

In this example:

- `msgID` is the quoted message ID recorded by your app and is used to locate the original message later.
- `msgPreview` is the quoted message preview saved by your app for UI display.
- `msgSender` is the quoted message sender recorded by your app.
- `msgType` is the quoted message type recorded by your app and is used to render a type-specific quote summary.

In the message list, combine the information in `msgQuote` to display a quote summary, such as `${msgSender}: ${msgPreview}`.

To support jumping to the original message by clicking the quote area, maintain a mapping between message IDs and message-list items, DOM nodes, or view models in your app. Then use `msgID` to scroll to and highlight the original message.

If the original quoted message no longer exists in the current local message list, display `msgPreview` directly or show **Quoted content does not exist**.

### Send a message with a quote

To send a text reply that quotes another message:

1. Identify the original message to quote.
2. Extract its summary information and assemble it in `ext.msgQuote`.
3. Call `client.chatManager.createTextMessage()` to create the new reply.
4. Call `client.chatManager.sendMessage()` to send the message.

Example code:

```typescript
const message = client.chatManager.createTextMessage({
  // Recipient: the peer user ID for a one-to-one chat, group ID for a group chat, or chat room ID for a chat room.
  conversationId: 'user2',
  // Conversation type: `singleChat` for a one-to-one chat, `groupChat` for a group chat, or `chatRoom` for a chat room.
  conversationType: 'singleChat',
  // Content of the new reply.
  content: '好的，收到！',
  // Extension: Use `msgQuote` to carry a summary of the quoted message.
  ext: {
    msgQuote: {
      // Message ID of the quoted message.
      msgID: 'original-msg-id',
      // Preview of the quoted message.
      msgPreview: '原消息内容预览',
      // User ID of the quoted message sender.
      msgSender: 'user1',
      // Type of the quoted message, such as `text`, `image`, or `voice`.
      msgType: 'text',
    },
  },
});

await client.chatManager.sendMessage(message);
```

### Parse the received message on the recipient

After receiving a regular message, the recipient can parse `message.ext?.msgQuote` in the `onMessage` event to determine whether the current message quotes another message.

```typescript
client.chatManager.addEventHandler('quote-message', {
  onMessage: message => {
    // Read the quote information. If it does not exist, the current message does not quote another message.
    const quote = message.ext?.msgQuote as
      | {
          msgID?: string;
          msgPreview?: string;
          msgSender?: string;
          msgType?: string;
        }
      | undefined;

    if (!quote) {
      return;
    }

    // Display the quote summary in the UI.
    console.log('引用消息 ID:', quote.msgID);
    console.log('引用消息预览:', quote.msgPreview);
    console.log('引用消息发送方:', quote.msgSender);
    console.log('引用消息类型:', quote.msgType);

    // Locate the original message using the message ID mapping maintained by your app.
    const originalMessage = messageList.find(
      item => item.msgServerId === quote.msgID || item.msgLocalId === quote.msgID
    );

    if (!originalMessage) {
      console.log('引用内容不存在');
      return;
    }

    // After locating the DOM node for the original message, scroll to and highlight it.
    const messageDom = document.getElementById(originalMessage.msgServerId);
    messageDom?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    messageDom?.classList.add('reply-message-twinkle');

    setTimeout(() => {
      messageDom?.classList.remove('reply-message-twinkle');
    }, 1500);
  },
});
```

## FAQ

1. Q: Does the SDK provide a dedicated API for creating quoted messages?
   A: No. Currently, quoted messages are implemented through `ext.msgQuote` in the extension of a new message.

2. Q: What should be displayed if the quoted message does not exist?
   A: You can display the summary in `msgPreview`. If your app requires a clearer prompt, display “Quoted content does not exist”.

3. Q: Does the SDK automatically verify that the quoted message exists?
   A: No. `msgQuote` is primarily used for business display. Your app must locate the original message and implement fallback display logic if the message does not exist.
