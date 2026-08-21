# Send Messages

## Feature overview

The EasyIM Android SDK creates messages through `EMMessage` and sends them through `EMChatManager`. The SDK supports text, image, GIF, voice, video, file, location, command, custom, and combined messages in one-to-one chats, group chats, and chat rooms.

- By default, EasyIM allows strangers to send one-to-one messages without adding each other as friends. To allow only friends to exchange one-to-one messages, [enable friend relationship checks](/product/console/basic_user.html#好友关系检查).
- For chat groups and chat rooms, a user can send a message to only one group or chat room at a time, and the user must belong to that group or chat room.
- For message sending controls, see the relevant documentation for [one-to-one chats](/product/message_single_chat.html#单聊消息发送控制), [group chats](/product/message_group.html#群组消息发送控制), and [chat rooms](/product/message_chatroom.html#聊天室消息发送控制).

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK. See [Initialization](initialization.html).
- Understand the EasyIM usage restrictions. See [Limitations](/product/limitation.html).

## Unified message sending process

All message types are sent through the following process:

1. Call the corresponding message creation method of `EMMessage` and set the message content and target conversation ID.
2. Set the conversation type. The default for one-to-one chat is `EMMessage.ChatType.Chat`. For group chat and a chat room, set it to `GroupChat` and `ChatRoom`, respectively.
3. Set optional attributes such as extensions, read receipts, chat room message priority, or callback environment as required.
4. Call `EMMessage#setMessageStatusCallback` to monitor the sending result and attachment upload progress.
5. Call `EMChatManager#sendMessage` to send the message.

## Common message creation parameters

The Android SDK creates different message types through different static methods of `EMMessage`. The parameters of the creation methods vary by message type. After creating a message, use methods provided by `EMMessage` to set the conversation type, extensions, and other optional attributes.

| Parameter or attribute       | Android configuration                                             | Required         | Use case         | Description                                                         |
| ---------------- | ------------------------------------------------------------ | ---------------- | ---------------- | ------------------------------------------------------------ |
| Target conversation ID      | The recipient parameter of each `create*SendMessage()` method, or `EMMessage#setTo` | Yes             | All messages         | Pass the peer user ID for one-to-one chat, the group ID for group chat, or the chat room ID for a chat room. |
| Message content         | The content parameter of each message creation method, or `EMMessage#setBody`             | Yes             | All messages         | The parameter varies by message type, such as text content, attachment URI, location coordinates, command, or custom event. |
| Conversation type         | `EMMessage#setChatType`                                      | Required for group chat and chat rooms | All messages         | Set it to `EMMessage.ChatType.Chat`, `GroupChat`, or `ChatRoom` for one-to-one chat, group chat, or a chat room, respectively. The default is `Chat`. |
| Extension         | `EMMessage#setAttribute`                                     | No             | All messages         | Add custom business information. String, Boolean, numeric, JSON object, JSON array, and other types are supported. Extensions count toward the message size limit. |
| Online-only delivery       | `EMMessage#deliverOnlineOnly`                                | No             | All messages         | When set to `true`, the message is delivered only to online users and is not stored offline. This is suitable for typing indicators, transient control information, and similar scenarios. |
| Callback routing environment     | `EMMessage#setWebhookEnv`                                    | No             | All messages         | Set a Webhook callback environment identifier, which the server uses to match a callback route.      |
| Chat room message priority | `EMMessage#setPriority`                                      | No             | Chat room messages       | Set the chat room message priority to `PriorityHigh`, `PriorityNormal`, or `PriorityLow`. The default is `PriorityNormal`. |
| Target recipients     | `EMMessage#setReceiverList`                                  | No             | Group and chat room messages | Set the specified recipients of a group or chat room message. Availability is also subject to the corresponding server-side feature configurations and usage restrictions. |
| Read receipt required | `EMMessage#setIsNeedReadReceipt`                             | No             | One-to-one and group messages   | Mark whether the message requires a read receipt. This attribute must be `true` before the recipient sends a read receipt. Chat rooms do not support message read receipts. |

## API call frequency limit

By default, the SDK does not limit the frequency at which a single user sends messages. If you have contacted the EasyIM business manager to configure a per-user sending frequency limit, the SDK returns error code `509` (`MESSAGE_CURRENT_LIMITING`) when a user's sending frequency in one-to-one chats, group chats, or chat rooms exceeds the limit.

## Send text messages

#### Sending process

1. Call `EMMessage#createTextSendMessage` to create a text message.

   When creating the message, pass the text content and target conversation ID. The target conversation ID is the peer user ID for one-to-one chat, the group ID for group chat, or the chat room ID for a chat room.

   After creating the message, set attributes such as extensions, target translation languages, online-only delivery, target recipients, and message priority as required. Some attributes apply only to specific conversation types. For example:

   - `EMMessage#setReceiverList` applies only to targeted group and chat room messages.
   - `EMMessage#setPriority` applies only to chat room messages.
   - `EMMessage#setIsNeedReadReceipt` applies to one-to-one and group messages, not chat rooms.
   - For group and chat room messages, set the corresponding conversation type through `EMMessage#setChatType`.

2. Call `EMChatManager#sendMessage` to send the text message.

   To obtain the sending result, call `EMMessage#setMessageStatusCallback` before sending to set a callback.

The following sample code creates and sends a text message:

```java
// Create a text message. Pass the peer user ID for one-to-one chat, the group ID for group chat,
// or the chat room ID for a chat room.
EMMessage message = EMMessage.createTextSendMessage(
        "Hello!",
        conversationId);

// Set the conversation type. The default is Chat for one-to-one chat. For group chat and a chat room,
// set it to GroupChat and ChatRoom, respectively.
message.setChatType(EMMessage.ChatType.Chat);

// Set the message sending state callback.
message.setMessageStatusCallback(new EMCallBack() {
    @Override
    public void onSuccess() {
        // The message was sent successfully.
    }

    @Override
    public void onError(int errorCode, String errorMessage) {
        // Failed to send the message. Handle the failure based on the error code and error message.
    }

    @Override
    public void onProgress(int progress, String status) {
        // Text messages typically have no attachment upload progress.
    }
});

// Send the message.
EMClient.getInstance()
        .chatManager()
        .sendMessage(message);
```

#### Key parameters and attributes

| Parameter or attribute       | Type                                  | Configuration                                  | Required        | Use case             | Description                                                         |
| ---------------- | ------------------------------------- | ----------------------------------------- | ---------------- | -------------------- | ------------------------------------------------------------ |
| Text content         | `String`                              | The `message` parameter of `createTextSendMessage` | Yes             | Text messages             | The text message body.                                             |
| Target conversation ID      | `String`                              | The `to` parameter of `createTextSendMessage`      | Yes             | All conversation types         | The peer user ID for one-to-one chat, group ID for group chat, or chat room ID for a chat room.  |
| Conversation type         | `EMMessage.ChatType`                  | `setChatType`                             | Required for group chat and chat rooms | All conversation types         | `Chat`, `GroupChat`, or `ChatRoom` for one-to-one chat, group chat, or a chat room, respectively. The default is `Chat`. |
| Target translation languages     | `List<String>`                        | `EMTextMessageBody#setTargetLanguages`    | No             | Text messages             | After obtaining `EMTextMessageBody` from the text message, set target language codes. |
| Extension         | Depends on the field value                          | `setAttribute`                            | No             | Business extensions         | Carry additional business information. Extensions count toward the message size limit.           |
| Online-only delivery       | `boolean`                             | `deliverOnlineOnly`                       | No             | Transient messages and state notifications   | When set to `true`, the message is delivered only to online users.                     |
| Callback routing environment     | `String`                              | `setWebhookEnv`                           | No             | Multi-environment callback routing       | Set the Webhook callback environment identifier.                                  |
| Target recipients     | `List<String>`                        | `setReceiverList`                         | No             | Targeted group and chat room messages | Specify the recipients of a group or chat room message.                             |
| Read receipt required | `boolean`                             | `setIsNeedReadReceipt`                    | No             | One-to-one and group chats           | Mark whether the message requires a read receipt. Chat rooms are not supported.                     |
| Message priority       | `EMMessage.EMChatRoomMessagePriority` | `setPriority`                             | No             | Chat room messages           | Set the chat room message priority.                                       |

#### Example with group message read receipts and extensions

For a text message with business attributes, call `EMMessage#setAttribute` to add extensions. In a group chat, call `EMMessage#setIsNeedReadReceipt(true)` to collect message read information from group members.

```java
// Create a group text message. groupId is the chat group ID.
EMMessage message = EMMessage.createTextSendMessage(
        "大家好",
        groupId);

// Set the message as a group chat message.
message.setChatType(EMMessage.ChatType.GroupChat);

// Add a business extension.
message.setAttribute("bizType", "announcement");

// Set the message to require read receipts.
message.setIsNeedReadReceipt(true);

// Send the message.
EMClient.getInstance()
        .chatManager()
        .sendMessage(message);
```

## Send attachment messages

In addition to text messages, the SDK supports attachment messages, including voice, image, video, and file messages.

#### Sending process

Sending an attachment message consists of the following two steps:

1. Create and send the attachment message.
2. The SDK uploads the attachment to the EasyIM server. Alternatively, you can [upload message attachments to your own server](#upload-message-attachments-to-your-own-server).

#### Resource processing

By default, after `EMChatManager#sendMessage` is called, the SDK automatically uploads local attachments to the EasyIM server, and the recipient SDK can automatically download them. Use `EMOptions#setAutoTransferMessageAttachments` to control whether the SDK automatically transfers attachments. For message attachment size and storage limits, see [Message Attachment Limitations](/product/limitation.html#消息存储).

### Send image messages

An image message typically involves the following three image resources:

- Original image: The original image file selected locally by the sender, typically used for viewing or saving the original image.
- Large image: An image proportionally compressed from the original and uploaded by the SDK client. If the shorter side is greater than 720 pixels, it is proportionally compressed to 720 pixels. If the shorter side is less than or equal to 720 pixels, the original dimensions are retained without upscaling. This image is typically displayed on the chat details page.
- Thumbnail: An image proportionally compressed by the server from the original. By default, if the shorter side is greater than 170 pixels, it is proportionally compressed to 170 pixels. If the shorter side is less than or equal to 170 pixels, the original dimensions are retained without upscaling. You can configure the thumbnail compression method and dimensions in the [EasyIM Console](/product/console/basic_message.html#图片消息缩略图). Thumbnails are typically used for lightweight displays such as conversation and chat lists.

#### Sending process

The process for sending an image message is as follows:

1. Obtain the local URI of the image.
2. Call `EMMessage#createImageSendMessage` to create an image message.
   
   When creating the message, pass the image's local URI, a flag indicating whether to send the original image, and the recipient's user ID. For a group or chat room message, pass the group ID or chat room ID, respectively.

   The `sendOriginalImage` parameter controls the image resource that is actually uploaded. `true` means the SDK uploads the original image, while `false` means it uploads the large image.

3. Call `EMChatManager#sendMessage` to send the message.
   
   If `EMOptions#setAutoTransferMessageAttachments(boolean)` is enabled, the SDK automatically uploads the image attachment, and the server automatically generates a thumbnail.

The following sample code creates and sends an image message: 

```java
// Retrieve the local image file path.
String imagePath = selectedImagePath;

if (imagePath == null || imagePath.isEmpty()) {
    throw new IllegalArgumentException("图片路径不能为空");
}

// Create an image message.
EMMessage message = EMMessage.createImageSendMessage(
        imagePath,
        false,          // false sends the large image; true sends the original image.
        conversationId  // The peer user ID for one-to-one chat, group ID for group chat, or chat room ID for a chat room.
);

// Set the conversation type to Chat, GroupChat, or ChatRoom for one-to-one chat, group chat, or a chat room, respectively.
// The default for one-to-one chat is Chat. Set the corresponding type when sending a group or chat room message.
message.setChatType(EMMessage.ChatType.Chat);

// Send the image message. By default, the SDK automatically uploads the image attachment.
EMClient.getInstance()
        .chatManager()
        .sendMessage(message);
```

#### Key parameters

| Parameter                | Type      | Required | Description                                                         |
| ------------------- | --------- | --------- | ------------------------------------------------------------ |
| `imagePath`          | `Uri`     | Yes      | The local URI of the image, typically obtained through the system gallery or file picker.           |
| `sendOriginalImage` | `boolean` | Yes      | Whether to send the original image. `true` uploads the original image, and `false` uploads the large image. Set this value based on image quality and upload traffic requirements. |
| `conversationId`    | `String`  | Yes      | Target conversation ID. The peer user ID for one-to-one chat, group ID for group chat, or chat room ID for a chat room. |

### Send GIF images

A GIF image message is a special image message. Unlike a regular image message, **a GIF image cannot be compressed when sent**.

#### Sending process

The process for sending a GIF image message is as follows:

1. The sender calls `EMMessage#createGifImageMessage` to construct a GIF image message body.
2. The sender calls `EMChatManager#sendMessage` to send the GIF image message. The SDK uploads the image to the EasyIM server, which automatically generates a thumbnail.

The following sample code creates and sends a GIF image message:

```java
// `imagePath` is the local GIF image file path of the String type.
EMMessage message = EMMessage.createGifImageMessage(imagePath, toChatUsername);
// Set the conversation type through the `ChatType` attribute of `EMMessage`. `Chat`, `GroupChat`, and `ChatRoom` represent one-to-one chat, group chat, and a chat room. The default is one-to-one chat.
// message.setChatType(EMMessage.ChatType.GroupChat);
// Send the message.
EMClient.getInstance().chatManager().sendMessage(message);
```

#### Key parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `imagePath` | `Uri` | Yes | The local URI of the GIF image. GIF images are not compressed when sent. |
| `toChatUsername` | `String` | Yes | Target conversation ID. The peer user ID for one-to-one chat, group ID for group chat, or chat room ID for a chat room. |

### Send voice messages

#### Sending process

1. Record the voice file in the app before sending a voice message.
2. The sender calls `EMMessage#createVoiceSendMessage` and passes the voice file URI, voice duration, and recipient user ID, or the group ID or chat room ID for a group or chat room message, to create the voice message.
3. The sender calls `EMChatManager#sendMessage` to send the message. The SDK uploads the voice file to the EasyIM server.

The following sample code creates and sends a voice message:

```java
// `voiceUri` is the local resource identifier of the voice file. `duration` is the voice duration in seconds.
EMMessage message = EMMessage.createVoiceSendMessage(voiceUri, duration, toChatUsername);
// Set the conversation type through the `ChatType` attribute of `EMMessage`. `Chat`, `GroupChat`, and `ChatRoom` represent one-to-one chat, group chat, and a chat room. The default is one-to-one chat.
// message.setChatType(EMMessage.ChatType.GroupChat);
// Send the message.
EMClient.getInstance().chatManager().sendMessage(message);
```

#### Key parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `voiceUri` | `Uri` | Yes | The local URI of the voice file. |
| `duration` | `int` | Yes | The voice duration in seconds. |
| `toChatUsername` | `String` | Yes | Target conversation ID. The peer user ID for one-to-one chat, group ID for group chat, or chat room ID for a chat room. |

### Send video messages

Before sending a video message, prepare the video file, local thumbnail path, and video duration. The thumbnail and duration are primarily used for message display.

#### Sending process

The process for sending a video message is as follows:

1. Select or record the video in the app and prepare its local URI, duration, and thumbnail path.

2. Call `EMMessage#createVideoSendMessage` to create a video message.

   When creating the message, pass the local URI of the video file, local thumbnail path, video duration, and recipient user ID. For a group or chat room message, pass the group ID or chat room ID, respectively.

   To display a video thumbnail, obtain the first video frame in your app and pass the corresponding path as `thumbPath`.

3. Call `EMChatManager#sendMessage` to send the message.

   During sending, the SDK uploads the video attachment before sending the message. Use the message state or related callbacks to monitor upload progress and the sending result.

The following sample code creates and sends a video message:

```java
// Obtain the first video frame in the app. You must implement getThumbPath yourself.
String thumbPath = getThumbPath(videoUri);
EMMessage message = EMMessage.createVideoSendMessage(videoUri, thumbPath, videoLength, toChatUsername);
// Set the conversation type through the `ChatType` attribute of `EMMessage`. `Chat`, `GroupChat`, and `ChatRoom` represent one-to-one chat, group chat, and a chat room. The default is one-to-one chat.
// message.setChatType(EMMessage.ChatType.GroupChat);
// Send the message.
EMClient.getInstance().chatManager().sendMessage(message);
```

#### Key parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `videoUri` | `Uri` | Yes | The local URI of the video file. |
| `thumbPath` | `String` | Yes | The local video thumbnail path generated by the app. |
| `videoLength` | `int` | Yes | The video duration in seconds. |
| `toChatUsername` | `String` | Yes | Target conversation ID. The peer user ID for one-to-one chat, group ID for group chat, or chat room ID for a chat room. |

### Send file messages

#### Sending process

1. The sender calls `EMMessage#createFileSendMessage` and passes the file's local resource identifier and the recipient user ID, or the group ID or chat room ID for a group or chat room message, to create a file message.
2. The sender calls `EMChatManager#sendMessage` to send the file message. The SDK uploads the file to the EasyIM server.

The following sample code creates and sends a file message:

```java
// `fileLocalUri` is the local resource identifier.
EMMessage message = EMMessage.createFileSendMessage(fileLocalUri, toChatUsername);
// Set the conversation type through the `ChatType` attribute of `EMMessage`. `Chat`, `GroupChat`, and `ChatRoom` represent one-to-one chat, group chat, and a chat room. The default is one-to-one chat. 
// message.setChatType(EMMessage.ChatType.GroupChat);
// Send the message.
EMClient.getInstance().chatManager().sendMessage(message);
```

#### Key parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `fileLocalUri` | `Uri` | Yes | The local URI of the file. |
| `toChatUsername` | `String` | Yes | Target conversation ID. The peer user ID for one-to-one chat, group ID for group chat, or chat room ID for a chat room. |

### Upload message attachments to your own server

To upload message attachments to your own server instead of the EasyIM server, perform the following operations:

1. During SDK initialization, call `EMOptions#setAutoTransferMessageAttachments(false)` so the SDK **no longer automatically uploads or downloads attachments**. After this setting is applied, `EMChatManager#sendMessage()` no longer handles automatic processing and uploading for images, videos, and other attachments.
2. After uploading an image to your server, add the attachment URL to the message body and send the message.
   For example, after uploading an image and obtaining its URL, call `EMImageMessageBody#setRemoteUrl(String)` to set the URL in the message body, and then call `sendMessage()`.

```java
// 1) Disable automatic attachment uploads to the EasyIM server during SDK initialization.
EMOptions options = new EMOptions();
options.setAutoTransferMessageAttachments(false);
EMClient.getInstance().init(appContext, options);

// 2) Your business logic: Upload the image to your own server and obtain an accessible URL.
// String urlPath = uploadToYourServerAndGetUrl(...);

// 3) Send the image message.
public static void sendPrivateUrlImg(String toUserId,
                                     String urlPath,
                                     String localPathForPreview /* Optional: for local preview/placeholder */ ) {

    // Construct the image message body. We still recommend passing a local path for local display. Your app controls the actual download through urlPath.
    EMImageMessageBody body = new EMImageMessageBody(new java.io.File(localPathForPreview));
    body.setRemoteUrl(urlPath);              // Remote image URL on your server.
    body.setFileName("IMG_111.png");         // Optional: File name.
    // body.setFileLength(10000);            // Optional: File size in bytes. This setting can be omitted.

    // Construct the message.
    EMMessage message = EMMessage.createSendMessage(EMMessage.Type.IMAGE);
    message.setTo(toUserId);
    message.setBody(body);

    // Optional sending callback.
    message.setMessageStatusCallback(new EMCallBack() {
        @Override public void onSuccess() { /* send success */ }
        @Override public void onError(int code, String error) { /* send fail */ }
        @Override public void onProgress(int progress, String status) { }
    });

    // Send the message.
    EMClient.getInstance().chatManager().sendMessage(message);
}
```

:::tip
After receiving the message, the recipient can call `((EMImageMessageBody)msg.getBody()).getRemoteUrl()` to obtain your URL and process it with your own download and display logic because automatic SDK attachment transfer is disabled.
:::

## Send location messages

Before sending a location message, your app must integrate a third-party map service and obtain the location's latitude, longitude, and address.

#### Sending process

1. The sender calls `EMMessage#createLocationSendMessage` to create a location message.
2. The sender calls `EMChatManager#sendMessage` to send the location message.

The following sample code creates and sends a location message:

```java
// `latitude` is the latitude, `longitude` is the longitude, and `locationAddress` is the location description.
EMMessage message = EMMessage.createLocationSendMessage(latitude, longitude, locationAddress, toChatUsername);
// Set the conversation type through the `ChatType` attribute of `EMMessage`. `Chat`, `GroupChat`, and `ChatRoom` represent one-to-one chat, group chat, and a chat room. The default is one-to-one chat. 
// message.setChatType(EMMessage.ChatType.GroupChat);
// Send the message.
EMClient.getInstance().chatManager().sendMessage(message);
```

#### Key parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `latitude` | `double` | Yes | Latitude. |
| `longitude` | `double` | Yes | Longitude. |
| `locationAddress` | `String` | Yes | Text description of the location. |
| `toChatUsername` | `String` | Yes | Target conversation ID. The peer user ID for one-to-one chat, group ID for group chat, or chat room ID for a chat room. |

#### Logic

The Android SDK only encapsulates and sends location messages. It does not provide map positioning or display capabilities. Your app must integrate a map service to obtain coordinates and display the location on the recipient according to business requirements.

## Send command messages

A command message can be considered an instruction sent to the peer to notify it of an operation to perform. The recipient can customize how the message is processed.

Customize its specific behavior according to your business requirements, such as updating avatars or nicknames. Actions beginning with `em_` or `easemob::` are reserved internal fields and must not be used.

:::tip
- A command message cannot be recalled after it is sent.
- Command messages are not stored in the local database and therefore are not displayed in the UI.
:::

#### Sending process

The process for sending a command message is as follows:

1. The sender calls `EMMessage#createSendMessage` to create a command message.
2. The sender calls `EMChatManager#sendMessage` to send the command message.

The following sample code creates and sends a command message:

```java
EMMessage cmdMsg = EMMessage.createSendMessage(EMMessage.Type.CMD);
// Set the conversation type through the `ChatType` attribute of `EMMessage`. `Chat`, `GroupChat`, and `ChatRoom` represent one-to-one chat, group chat, and a chat room. The default is one-to-one chat.
// For group chat, add the following line.
// cmdMsg.setChatType(EMMessage.ChatType.GroupChat);
// For a chat room, add the following line.
// cmdMsg.setChatType(EMMessage.ChatType.ChatRoom);

String action="action1";
// You can customize `action`.
EMCmdMessageBody cmdBody = new EMCmdMessageBody(action);
String toUsername = "test1";
// Pass the recipient user ID for one-to-one chat, group ID for group chat, or chat room ID for a chat room.
cmdMsg.setTo(toUsername);
cmdMsg.setBody(cmdBody);
// Send the message.
EMClient.getInstance().chatManager().sendMessage(cmdMsg);
```

#### Key parameters

| Parameter or attribute | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `action` | `String` | Yes | Command action. It cannot begin with `em_` or `easemob::`. |
| `toUsername` | `String` | Yes | Target conversation ID. |
| `chatType` | `EMMessage.ChatType` | Required for group chat and chat rooms | Conversation type. The default is `Chat` for one-to-one chat. |

## Send custom messages

You can define message types for business processing by first setting a message type name and then adding various custom messages.

#### Sending process

1. The sender calls `EMMessage#createSendMessage` to create a custom message.
2. The sender calls `EMChatManager#sendMessage` to send the custom message.

The following sample code creates and sends a custom message:

```java
EMMessage customMessage = EMMessage.createSendMessage(EMMessage.Type.CUSTOM);
// `event` is the custom message event to pass. For example, for a gift message, set:
String event = "gift";
EMCustomMessageBody customBody = new EMCustomMessageBody(event);
// `params` is of the `Map<String, String>` type.
customBody.setParams(params);
customMessage.setBody(customBody);
// `to` specifies the recipient: the peer user ID for one-to-one chat, group ID for group chat, or chat room ID for a chat room.
customMessage.setTo(to);
// Set `chatType` to `Chat`, `GroupChat`, or `ChatRoom` for one-to-one chat, group chat, or a chat room, respectively. The default is one-to-one chat.
customMessage.setChatType(chatType);
// Send the message.
EMClient.getInstance().chatManager().sendMessage(customMessage);
```

#### Key parameters

| Parameter or attribute | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `event` | `String` | Yes | The custom message event type, such as `gift`. |
| `params` | `Map<String, String>` | No | Key-value parameters carried by the custom message. |
| `to` | `String` | Yes | Target conversation ID. |
| `chatType` | `EMMessage.ChatType` | Required for group chat and chat rooms | Conversation type. The default is `Chat` for one-to-one chat. |

## Send combined messages

EasyIM supports combining multiple messages for forwarding.

#### Sending process

Forward combined messages as follows:

1. Create a combined message from the original message list.
2. Send the combined message.

Call `createCombinedSendMessage` to create a combined message, and then call `sendMessage` to send it.

The following sample code creates and sends a combined message:

```java
String title = "A和B的聊天记录";
String summary = "A:这是A的消息内容\nB:这是B的消息内容";
String compatibleText = "您当前的版本不支持该消息，请升级到最新版本";

// Add the original message IDs.
ArrayList<String> msgIdList = new ArrayList<>();
msgIdList.add("1390191369179366180");
msgIdList.add("1390191426268037924");
msgIdList.add("1390186040483906340");

EMMessage message = EMMessage.createCombinedSendMessage(
        title,
        summary,
        compatibleText,
        msgIdList,
        receiverId);

// Set the corresponding conversation type for a group or chat room message.
// message.setChatType(EMMessage.ChatType.GroupChat);

EMClient.getInstance().chatManager().sendMessage(message);
```

#### Key parameters

Set the following parameters when creating a combined message:

| Attribute   | Type        | Description    |
| :-------------- | :-------------------- | :-------------------- |
| `title`  | String    | The combined message title.    |
| `summary` | String       | The combined message summary.   |
| `compatibleText` | String       | The combined message compatibility text.<br/>This text provides backward compatibility for versions that do not support combined messages. When an SDK that supports combined messages sends one to an older SDK that does not, the older SDK parses this attribute as the content of a text message.  |
| `messageIdList` | List      | The list of original message IDs in the combined message. This list can contain up to 300 message IDs.  |
| `userId` | String     | Message recipient. Set this field based on the conversation type:<br/> - One-to-one chat: Peer user ID;<br/> - Group chat: Chat group ID;<br/> - Message thread: Message thread ID;<br/> - Chat room: Chat room ID.|

#### Logic

:::tip
1. Combined-message forwarding can be nested up to 10 levels, with up to 300 messages at each level.
2. Regardless of whether `EMOptions#setAutoTransferMessageAttachments` is set to `false` or `true`, the SDK uploads combined message attachments to the EasyIM server.
3. To forward a combined message, for example, when user A sends a combined message to user B and user B forwards it to user C, call the API for forwarding a single combined message. See [Forward a single message](message_forward.html#forward-a-single-message).
:::

#### Recommendations

Combined messages are suitable for forwarding chat history and similar scenarios. Before creating one, confirm that the original message ID list is not empty and contains no more than 300 items. When displaying it, use `title`, `summary`, and `compatibleText` to provide a clear summary and compatibility prompt for older versions.

## Message sending callbacks

#### Usage

Before sending a message, call `EMMessage#setMessageStatusCallback` to receive the sending success, failure, and attachment upload progress. For an attachment message, `progress` in `onProgress` is the upload percentage.

#### Example code

```java
message.setMessageStatusCallback(new EMCallBack() {
    @Override
    public void onSuccess() {
        // The message was sent successfully.
    }

    @Override
    public void onError(int errorCode, String errorMessage) {
        // Failed to send the message. Handle the failure based on the error code and error message.
    }

    @Override
    public void onProgress(int progress, String status) {
        // Attachment upload progress. The value range is 0-100.
    }
});

EMClient.getInstance().chatManager().sendMessage(message);
```

#### Callback parameters

| Callback | Description |
| :--- | :--- |
| `onSuccess()` | Triggered when the message is sent successfully. |
| `onError(int, String)` | Triggered when message sending fails. Returns an error code and error message. |
| `onProgress(int, String)` | Triggered when an attachment is uploaded. `progress` is the upload percentage. Messages without attachments, such as text messages, typically do not produce meaningful upload progress. |

#### Logic

`EMChatManager#sendMessage` does not accept a callback parameter. Your app must set a state callback on the `EMMessage` to send before calling `sendMessage`. The same callback can update both the message sending state and attachment upload progress.

## More

#### Chat room message priority and message dropping

For chat room messages, EasyIM supports high, normal, and low priorities. Call `EMMessage#setPriority` to set the priority of a chat room message.

- `EMMessage.EMChatRoomMessagePriority.PriorityHigh`: High priority.
- `EMMessage.EMChatRoomMessagePriority.PriorityNormal`: Normal priority and the default value.
- `EMMessage.EMChatRoomMessagePriority.PriorityLow`: Low priority.

When chat room message concurrency or sending frequency is too high, the server prioritizes high-priority messages and drops low-priority messages first. Therefore, set important messages such as rewards and announcements to high priority.

Message priority only increases the possibility that an important message is processed first; it does not guarantee delivery. When chat room message concurrency is too high, high-priority messages may still be dropped.

For a single chat room, message dropping may be triggered when more than 20 messages are sent per second by default:

1. The server drops low-priority messages first and attempts to retain high-priority messages.
2. When messages of the same priority exceed the limit, the server processes them in sending order, and later messages may be dropped.

```java
String roomId = "roomId";

// Create a text message.
EMMessage message = EMMessage.createTextSendMessage("Hi", roomId);

// Set the message as a chat room message.
message.setChatType(EMMessage.ChatType.ChatRoom);

// Set the chat room message priority.
// If not set, the default is PriorityNormal.
message.setPriority(
        EMMessage.EMChatRoomMessagePriority.PriorityHigh
);

// Set the sending result callback.
message.setMessageStatusCallback(new EMCallBack() {
    @Override
    public void onSuccess() {
        Log.d("Chat", "发送成功");
    }

    @Override
    public void onError(int code, String error) {
        Log.e("Chat", "发送失败：" + code + ", " + error);
    }

    @Override
    public void onProgress(int progress, String status) {
        // Text messages typically do not trigger this callback.
    }
});

EMClient.getInstance().chatManager().sendMessage(message);
```

:::tip 
`setPriority` applies only to chat room messages, not one-to-one or group messages.
:::

#### Voice chat room seat management

Use [custom chat room attributes](room_attributes.html) to manage voice chat room seat states and synchronize them across devices, such as recording the user on a seat, seat state, and volume state.

Custom chat room attributes in the Android SDK use the `Map<String, String>` format:

```java
Map<String, String>
```

Therefore, a seat list or other structured data cannot be written directly as an array, `Map`, or custom object. Store the data in either of the following ways:

- Use an independent attribute for each seat. The attribute key identifies the seat number, and the value is the serialized seat information.
- Serialize the seat list as a JSON string and write it as a single attribute value.

For example, set a single seat attribute:

```java
String roomId = "roomId";
Map<String, String> attributes = new HashMap<>();

// The value is the serialized seat information.
attributes.put("seat_1", "{\"userId\":\"user_001\",\"state\":\"open\",\"volume\":0}");

EMClient.getInstance().chatroomManager()
        .asyncSetChatroomAttributes(
                roomId,
                attributes,
                false,
                new EMResultCallBack<Map<String, Integer>>() {
                    @Override
                    public void onSuccess(Map<String, Integer> result) {
                        // result contains the setting result for each attribute.
                    }

                    @Override
                    public void onError(int errorCode, String errorMsg) {
                        Log.e("ChatRoom", "设置麦位属性失败：" + errorMsg);
                    }
                }
        );
```

After custom chat room attributes are set or updated, other members can monitor changes through `EMChatRoomChangeListener#onAttributesUpdate(String, Map<String, String>, String)` and update the local seat state:

```java
@Override
public void onAttributesUpdate(
        String chatRoomId,
        Map<String, String> attributeMap,
        String from) {
    // attributeMap contains the attributes updated in this operation.
    // Parse the seat data and refresh the UI.
}
```

Register the listener through `EMClient.getInstance().chatroomManager().addChatRoomChangeListener(...)`. For implementation and permission requirements, see [Custom Chat Room Attributes](room_attributes.html).

#### Retrieve the attachment message sending progress

When sending an attachment message such as an image, voice, video, or file, obtain the attachment upload progress through `onProgress` in `EMMessage#setMessageStatusCallback(EMCallBack)`.

The value range of `progress` is `0-100`, representing the attachment upload percentage. Use `onSuccess` and `onError` to obtain the message sending result:

- `onSuccess`: The message was sent successfully.
- `onError`: Message sending failed. The callback contains the error code and description.
- `message`: The `EMMessage` object created before sending. After sending succeeds, call `message.getMsgId()` to obtain the message ID.

```java
// message is the created image, voice, video, or file message.
message.setMessageStatusCallback(new EMCallBack() {
    @Override
    public void onProgress(int progress, String status) {
        // Attachment upload progress. The value range is 0～100.
        runOnUiThread(() -> {
            Log.d("Chat", "上传进度：" + progress + "%");
            // progressBar.setProgress(progress);
        });
    }

    @Override
    public void onSuccess() {
        runOnUiThread(() -> {
            Log.d("Chat", "发送成功，消息 ID：" + message.getMsgId());
        });
    }

    @Override
    public void onError(int code, String error) {
        runOnUiThread(() -> {
            Log.e("Chat", "发送失败：" + code + ", " + error);
        });
    }
});

EMClient.getInstance().chatManager().sendMessage(message);
```

:::tip 
Text, location, command, and custom messages typically do not involve attachment uploads, so `onProgress` is generally not triggered. SDK callbacks are not guaranteed to run on the main thread. Switch to the main thread when updating the Android UI.
:::

#### Content moderation before sending messages

- Content moderation examines the message body.

[The content moderation service examines specified fields in the message body, and the fields vary by message type](/value-added/moderation/moderation_mechanism.html). Adding large amounts of business information to these fields when creating a message may affect moderation. Ensure that fields subject to content moderation do not contain business information; put business information in extensions instead.

- Set whether the sender receives replaced content after moderation.

By default, content replaced during moderation is delivered only to the recipient. For the sender to also receive the replacement, **contact the EasyIM business manager to enable the permission** and set `EMOptions#setUseReplacedMessageContents` to `true` during SDK initialization. After it is enabled, the sender receives the new content when a message is replaced during moderation. If the setting is disabled, which is the default, the sender retains the original sent content and is not notified of the replacement.

#### Message size and storage limitations

For size and storage limits of each message type, see [Message Limitations](/product/limitation.html#消息大小).

#### Set callback routing when sending a message

Callback routing allows you to deliver different messages under the same App Key to different callback URLs by callback environment. When sending a message, include a callback environment such as `dev`, `test`, or `prod`. After the EasyIM server receives the message, it matches the [callback routing rule](/product/console/basic_webhook.html#配置消息回调规则) configured in the console based on this value and sends the current message callback to the corresponding [pre-delivery webhook](/document/server-side/callback_presending.html) or [post-delivery webhook](/document/server-side/callback_postsending.html) URL.

:::tip
Currently, this feature is available only in Mainland China regions 1 and 2.
:::

**Use cases**

| Use case               | Description                                                         |
| :----------------- | :----------------------------------------------------------- |
| Multi-environment isolation     | Distinguish development, test, and production environments under the same App Key and send messages to the respective service URLs. |
| Canary release      | Send some message callbacks to a new path for verification while other messages continue using the existing path.               |
| Multiple business lines   | Route messages from different business modules to their respective moderation, risk control, or synchronization services.         |
| Lower pre-delivery latency | Avoid sending all message callbacks to a single entry point before forwarding them again through the app server.       |

**Supported scope**

| Callback type    | Scope       | Description      |
| :------------- | :------- | :---------------- |
| [Pre-delivery webhook](/document/server-side/callback_presending.html) | Applies only to **messages sent through an SDK**. Targeted group and chat room messages are not supported. | Before delivering a message to target users, your server can determine whether to intercept or modify it. |
| [Post-delivery webhook](/document/server-side/callback_postsending.html) | Applies to **messages sent through an SDK or REST API**.  | Notify your server after a message is sent successfully.   |

**Workflow**

1. [Configure callback routing](/product/console/basic_webhook.html#配置消息回调规则) in the console for a pre-delivery or post-delivery callback.
2. Set a callback environment value when the client sends a message.
3. After the EasyIM server receives the message, it matches the callback URL for the current phase based on the environment value in the message.
4. After a valid route is matched, the server sends the callback request to the corresponding URL.

**Example code**

Call `setWebhookEnv` when sending a message to set the callback environment.

The `webhookEnv` callback environment parameter is described below:

| Parameter | Type | Required | Description |
| :--- | :--- |  :--- | :--- |
| `webhookEnv` | String | No | Callback environment value. It supports only letters and numbers and can contain up to 8 characters. The server uses this value to match the callback URL in the console. Use the same value as the callback environment configured in the console, such as `dev`, `test`, or `prod`. |

Call `setWebhookEnv` to set the callback environment:

```java
// Create a message.
EMMessage message = EMMessage.createTextSendMessage("hello", "toUser");

// Set the callback environment. 
message.setWebhookEnv("test");

// Send the message.
EMClient.getInstance().chatManager().sendMessage(message);
```

Call `getWebhookEnv` to read the callback environment value set for the current message:

```java
String webhookEnv = message.getWebhookEnv();
```

**Routing rules for the callback environment field in a message**

| Scenario                                     | Routing result                                                     |
| :--------------------------------------- | :----------------------------------------------------------- |
| An environment value is included and matches a valid route           | Route to the corresponding callback URL based on the environment value.                             |
| An environment value is included but does not match a valid route           | **Do not trigger a callback**. The `default` fallback configuration in the console **does not take effect** in this scenario. |
| No environment value is included                         | Automatically route to the callback URL corresponding to the `default` environment.                    |
| The same message must trigger both pre-delivery and post-delivery callbacks | Both phases must use **the same environment value**. For example, if pre-delivery is configured as `test -> url1` and post-delivery as `test -> url2`, including `test` in the message enables it for both phases. |

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`createTextSendMessage`](#send-text-messages) | `EMMessage` | Create a text message. |
| [`createImageSendMessage`](#send-image-messages) | `EMMessage` | Create an image message. |
| [`createGifImageMessage`](#send-gif-images) | `EMMessage` | Create a GIF image message. |
| [`createVoiceSendMessage`](#send-voice-messages) | `EMMessage` | Create a voice message. |
| [`createVideoSendMessage`](#send-video-messages) | `EMMessage` | Create a video message. |
| [`createFileSendMessage`](#send-file-messages) | `EMMessage` | Create a file message. |
| [`createLocationSendMessage`](#send-location-messages) | `EMMessage` | Create a location message. |
| [`createSendMessage`](#send-command-messages) | `EMMessage` | Create a message of a specified type to send. |
| [`createCombinedSendMessage`](#send-combined-messages) | `EMMessage` | Create a combined message. |
| [`deliverOnlineOnly`](#common-message-creation-parameters) | `EMMessage` | Set whether to deliver the message only to online users. |
| [`sendMessage`](#unified-message-sending-process) | `EMChatManager` | Send a message. |
| [`downloadAndParseCombineMessage`](#send-combined-messages) | `EMChatManager` | Download and parse a combined message attachment. |
| [`setAutoTransferMessageAttachments`](#upload-message-attachments-to-your-own-server) | `EMOptions` | Set whether the SDK automatically uploads and downloads message attachments. |
| [`setUseReplacedMessageContents`](#content-moderation-before-sending-messages) | `EMOptions` | Set whether the sender receives message content replaced by content moderation. |
