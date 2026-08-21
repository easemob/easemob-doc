# Edit Messages

## Feature overview

The SDK supports editing the content of successfully sent messages in one-to-one chats, group chats, and chat rooms.

### Supported scope

This feature applies to one-to-one chats, group chats, and chat rooms and supports the following:

- Text messages: You can edit `body.content` in the message body and the extension `ext`.
- Custom messages: You can edit `body.event` and `body.params` in the message body and the extension `ext`.
- Image, voice, video, file, location, and combined messages: You can edit only the extension `ext`.
- Command messages: Editing is not supported.

### Message editing process

1. The app calls the message modification API and passes the message to edit and the updated content.    
2. The SDK sends the message modification request to the server. After updating the message, the server returns the updated message to the SDK.
3. The SDK updates the local message cache and returns the updated message to the app through the Promise returned by the API.
4. After other members of the conversation receive the message modification event, they can obtain the updated message through the message listener and update the UI.

### Message editing permissions by conversation type

- In a one-to-one chat, only the message sender can edit the message.
- In a group chat or chat room, regular members can edit only messages they sent. In addition to their own messages, the group owner, chat room owner, and admins can edit messages sent by regular members. In this case, the message sender does not change, and the editor user ID property in the message body is the user ID of the group owner, chat room owner, or admin.

### Lifecycle of an edited message

There is no time limit for editing a message as long as the message remains stored on the server. After a message is edited, its lifecycle, or server-side storage period, is recalculated. For example, suppose a message can be stored on the server for 180 days. A user edits it on day 30 after it was sent, when 150 days of its storage period remain. After the edit succeeds, the message can be stored on the server for another 180 days.

In addition to changes to the content or extension, the body of an edited message contains new properties for the editor's user ID, edit time, and number of edits. Other information outside the message body, such as the sender and recipient, does not change.

## Feature activation

To use message editing, **contact the EasyIM business manager to enable it**.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and connect to the server. For details, see [Quickstart](quickstart.html) and [Initialization](initialization.html).
- Register `ChatManager` during SDK initialization so that you can call message APIs through `client.chatManager`.
- Understand the EasyIM API limitations. For details, see [Limitations](/product/limitation.html).
- Contact the EasyIM business manager to enable message editing.

## Edit a message

Call `modifyMessage` to edit a successfully sent message. Currently, only text and custom messages can be edited. You can update the message body content and message extension `ext`, but identifying fields such as the message ID, sender, recipient, and conversation information do not change.

After a message is edited, the `onMessageUpdated` event is triggered. Relevant members in a one-to-one chat, group chat, or chat room receive this event. The event carries the message ID, conversation information, edited message content, `modifiedInfo`, and other data. Use `modifiedInfo` to view information about the edit, including the edit time `operationTime`, editor `operatorId`, and edit count `operationCount`.

:::tip
1. By default, a message can be edited up to 10 times.
2. Currently, only text and custom messages can be edited.
:::

Example code:

```typescript
// Register a message editing event
client.addEventHandler('modify', {
  onMessageUpdated: event => {
    console.log('onMessageUpdated', event);
    console.log('编辑后的消息内容:', event.message);
    console.log('编辑者:', event.message.modifiedInfo?.operatorId);
    console.log('编辑时间:', event.message.modifiedInfo?.operationTime);
    console.log('编辑次数:', event.message.modifiedInfo?.operationCount);
  },
});

// 1. Text message: body.content and ext can be edited
await client.chatManager.modifyMessage({
  conversationId: 'user-1',
  conversationType: 'singleChat',
  messageId: 'msg-text-123',
  message: {
    type: 'text',
    body: {
      content: '修改后的内容',
    },
    ext: {
      edited: true,
    },
  },
});

// 2. Custom message: body.event, body.params, and ext can be edited
await client.chatManager.modifyMessage({
  conversationId: 'user-1',
  conversationType: 'singleChat',
  messageId: 'msg-custom-123',
  message: {
    type: 'custom',
    body: {
      event: 'newEvent',
      params: {
        key: 'new value',
      },
    },
    ext: {
      edited: true,
    },
  },
});

// 3. Image, voice, video, file, location, and combined messages: only ext can be edited
// Image message
await client.chatManager.modifyMessage({
  conversationId: 'user-1',
  conversationType: 'singleChat',
  messageId: 'msg-image-123',
  message: {
    type: 'image',
    body: {
      // Original image message body
    } as any,
    ext: {
      edited: true,
    },
  },
});

// Voice message
await client.chatManager.modifyMessage({
  conversationId: 'user-1',
  conversationType: 'singleChat',
  messageId: 'msg-voice-123',
  message: {
    type: 'voice',
    body: {
      // Original voice message body
    } as any,
    ext: {
      edited: true,
    },
  },
});

// Video message
await client.chatManager.modifyMessage({
  conversationId: 'user-1',
  conversationType: 'singleChat',
  messageId: 'msg-video-123',
  message: {
    type: 'video',
    body: {
      // Original video message body
    } as any,
    ext: {
      edited: true,
    },
  },
});

// File message
await client.chatManager.modifyMessage({
  conversationId: 'user-1',
  conversationType: 'singleChat',
  messageId: 'msg-file-123',
  message: {
    type: 'file',
    body: {
      // Original file message body
    } as any,
    ext: {
      edited: true,
    },
  },
});

// Location message
await client.chatManager.modifyMessage({
  conversationId: 'user-1',
  conversationType: 'singleChat',
  messageId: 'msg-location-123',
  message: {
    type: 'location',
    body: {
      // Original location message body
    } as any,
    ext: {
      edited: true,
    },
  },
});

// Combined message
await client.chatManager.modifyMessage({
  conversationId: 'user-1',
  conversationType: 'singleChat',
  messageId: 'msg-combine-123',
  message: {
    type: 'combine',
    body: {
      // Original combined message body
    } as any,
    ext: {
      edited: true,
    },
  },
});
```

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`modifyMessage`](#edit-a-message) | `ChatManager` | Edits a message. |





