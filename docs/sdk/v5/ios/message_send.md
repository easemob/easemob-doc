# Send Messages

## Feature overview

The EasyIM iOS SDK creates message bodies through the corresponding subclasses of `EMMessageBody`, wraps messages in `EMChatMessage`, and sends them through `IEMChatManager`. The SDK supports text, image, GIF, voice, video, file, location, command, custom, and combined messages in one-to-one chats, group chats, and chat rooms.

- For one-to-one chat, EasyIM supports messaging between strangers by default, which means users can chat without adding each other as friends. To allow one-to-one messages only between friends, [enable friend relationship check](/product/console/basic_user.html#好友关系检查).
- For group chats and chat rooms, a user can send a message to only one group or chat room to which the user belongs at a time.
- For message sending controls, see the related documentation for [one-to-one chat](/product/message_single_chat.html#单聊消息发送控制), [group chat](/product/message_group.html#群组消息发送控制), and [chat room](/product/message_chatroom.html#聊天室消息发送控制).

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK. See [Initialization](initialization.html).
- Understand the EasyIM usage restrictions. See [Limitations](/product/limitation.html).

## Unified message sending process

All message types are sent through the following process:

1. Create an instance of the corresponding `EMMessageBody` subclass, and use an `EMChatMessage` initializer to set the message body, target conversation ID, and extension fields.
2. Set the message's `chatType`. The default for one-to-one chat is `EMChatTypeChat`. For group chat and a chat room, set it to `EMChatTypeGroupChat` and `EMChatTypeChatRoom`, respectively.
3. Set optional properties such as read receipts, chat room message priority, or callback environment as required by your business.
4. Call `IEMChatManager#sendMessage:progress:completion:` to send the message.
5. Monitor attachment upload progress through the `progress` callback and retrieve the message sending result through the `completion` callback.

## Common message creation parameters

The iOS SDK creates message bodies through different `EMMessageBody` subclasses and then initializes `EMChatMessage` with the message body, conversation ID, and extension fields. The initialization parameters vary between message body types. After creating a message, you can also set the conversation type and other optional properties provided by `EMChatMessage`.

| Parameter or property | Type | Configuration | Required | Use case | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Target conversation ID | `NSString *` | `initWithConversationID` | Required | All messages | Pass the peer user ID for one-to-one chat, the group ID for group chat, or the chat room ID for a chat room. |
| Message content | `EMMessageBody *` | Message body initialization parameter | Required | All messages | Set text, an attachment path, location coordinates, a command, or a custom event according to the message type. |
| Conversation type | `EMChatType` | `chatType` | Required for group chats and chat rooms | All messages | Set it to `EMChatTypeChat`, `EMChatTypeGroupChat`, or `EMChatTypeChatRoom` for one-to-one chat, group chat, or a chat room, respectively. |
| Extension fields | `NSDictionary *` | `ext` | Optional | All messages | Carry custom business information. Extension fields count toward the message size limit. |
| Online-only delivery | `BOOL` | `deliverOnlineOnly` | Optional | All messages | When set to `YES`, the message is delivered only to online users and is not stored offline. |
| Callback routing environment | `NSString *` | `webhookEnv` | Optional | All messages | Set a Webhook callback environment identifier, which the server uses to match a callback route. |
| Chat room message priority | `EMChatRoomMessagePriority` | `priority` | Optional | Chat room messages | Set it to `EMChatRoomMessagePriorityHigh`, `EMChatRoomMessagePriorityNormal`, or `EMChatRoomMessagePriorityLow`. |
| Target recipients | `NSArray<NSString *> *` | `receiverList` | Optional | Group and chat room messages | Set a list of specified recipients. Availability is subject to server-side feature restrictions. |
| Read receipt required | `BOOL` | `isNeedReadReceipt` | Optional | One-to-one and group messages | Mark whether the message requires a read receipt. Chat rooms are not supported. |

## API call frequency limit

By default, the SDK does not limit the frequency at which a single user sends messages. If you have contacted the EasyIM business manager to configure a per-user sending frequency limit, the SDK returns error code `509` (`MESSAGE_CURRENT_LIMITING`) when a user's sending frequency in one-to-one chats, group chats, or chat rooms exceeds the limit.

## Send text messages

#### Sending process

1. Create an `EMTextMessageBody` text message body, and initialize `EMChatMessage` with the message body, target conversation ID, and extension fields.

   When creating the message, pass the peer user ID, group ID, or chat room ID as the target conversation ID for one-to-one chat, group chat, or a chat room, respectively.

   After creating the message, you can set properties such as target translation languages, online-only delivery, target recipients, and message priority as required by your business. Some properties apply only to specific conversation types. For example:

   - `EMChatMessage#receiverList` applies only to targeted group and chat room messages.
   - `EMChatMessage#priority` applies only to chat room messages.
   - `EMChatMessage#isNeedReadReceipt` applies to one-to-one and group messages, not chat rooms.
   - For group and chat room messages, set the corresponding conversation type through `EMChatMessage#chatType`.

2. Call `IEMChatManager#sendMessage:progress:completion:` to send the text message.

   Retrieve the sending result through the `completion` callback. Text messages generally do not involve attachment uploads, so you can set `progress` to `nil`.

The following sample code creates and sends a text message:

```swift
// Create a text message body.
let body = EMTextMessageBody(text: "Hello!")

// Create a text message. Pass the peer user ID for one-to-one chat or the group ID for group chat.
// For a chat room, pass the chat room ID.
let message = EMChatMessage(
    conversationID: conversationId,
    body: body,
    ext: nil
)

// Set the conversation type. The default for one-to-one chat is .chat. For group chat and a chat room,
// set it to .groupChat and .chatRoom, respectively.
message.chatType = .chat

// Send the message.
EMClient.shared().chatManager?.send(
    message,
    progress: nil
) { message, error in
    if let error = error {
        // Failed to send the message. Handle the failure based on the error information.
        print("Failed to send: \(error.errorDescription ?? "Unknown error")")
        return
    }

    // The message was sent successfully.
    print("Sent successfully")
}
```

#### Key parameters and properties

| Parameter or property | Type | Configuration | Required/Optional | Use case | Description |
| ---------------- | --------------------------- | ------------------------------------------------------------ | ---------------- | -------------------- | ------------------------------------------------------------ |
| Text content | `String` | `EMTextMessageBody#initWithText:` | Required | Text messages | The text message body. |
| Target conversation ID | `String` | The `conversationID` parameter of `EMChatMessage#initWithConversationID:body:ext:` | Required | All conversation types | The peer user ID for one-to-one chat, group ID for group chat, or chat room ID for a chat room. |
| Conversation type | `EMChatType` | `chatType` | Required for group chats and chat rooms | All conversation types | `.chat`, `.groupChat`, or `.chatRoom` for one-to-one chat, group chat, or a chat room, respectively. The default is `.chat`. |
| Target translation languages | `[String]` | `EMTextMessageBody#targetLanguages` | Optional | Text messages | Set a list of target language codes for automatic translation. |
| Extension fields | `[String: Any]` | The `ext` parameter of the initializer or `EMChatMessage#ext` | Optional | Business extensions | Carry additional business information. Extension fields count toward the message size limit. |
| Online-only delivery | `Bool` | `deliverOnlineOnly` | Optional | Transient messages and state notifications | When set to `true`, the message is delivered only to online users. |
| Callback routing environment | `String` | `webhookEnv` | Optional | Multi-environment callback routing | Set the Webhook callback environment identifier. |
| Target recipients | `[String]` | `receiverList` | Optional | Targeted group and chat room messages | Specify the recipients of a group or chat room message. |
| Read receipt required | `Bool` | `isNeedReadReceipt` | Optional | One-to-one and group chats | Mark whether the message requires a read receipt. Chat rooms are not supported. |
| Message priority | `EMChatRoomMessagePriority` | `priority` | Optional | Chat room messages | Set the chat room message priority. |

#### Example with group message read receipts and extension fields

For a text message with business properties, you can pass `ext` when initializing `EMChatMessage` or set `EMChatMessage#ext` after creating the message. In a group chat, to track whether group members have read the message, set `EMChatMessage#isNeedReadReceipt` to `true`.

```swift
// Create a group chat text message body.
let body = EMTextMessageBody(text: "Hello everyone")

// Add a business extension field.
let ext: [String: Any] = [
    "bizType": "announcement"
]

// Create a group chat message. groupId is the group ID.
let message = EMChatMessage(
    conversationID: groupId,
    body: body,
    ext: ext
)

// Set the message as a group chat message.
message.chatType = .groupChat

// Set the message to require read receipts.
message.isNeedReadReceipt = true

// Send the message.
EMClient.shared().chatManager?.send(
    message,
    progress: nil
) { message, error in
    if let error = error {
        print("Failed to send: \(error.errorDescription ?? "Unknown error")")
        return
    }

    print("Sent successfully")
}
```

## Send attachment messages

In addition to text messages, the SDK supports attachment messages, including voice, image, video, and file messages.

#### Sending process

Sending an attachment message consists of the following two steps:

1. Create the corresponding attachment message body and use it to create an `EMChatMessage`.
2. Call `IEMChatManager#sendMessage:progress:completion:` to send the message. The SDK uploads the attachment to the EasyIM server. Alternatively, you can [upload message attachments to your own server](#upload-message-attachments-to-your-own-server).

#### Resource processing

By default, after `IEMChatManager#sendMessage:progress:completion:` is called, the SDK automatically uploads the local attachment to the EasyIM server. The recipient's SDK can also download the attachment automatically.

When initializing the SDK, you can use `EMOptions#isAutoTransferMessageAttachments` to set whether the SDK automatically uploads or downloads message attachments. For image and video thumbnails and voice messages, you can use `EMOptions#autoDownloadThumbnail` to control automatic downloading.

For message attachment size and storage restrictions, see [Message Attachment Restrictions](/product/limitation.html#消息存储).

### Send image messages

An image message typically involves the following three image resources:

- Original image: The original image file selected locally by the sender, typically used for viewing or saving the original image.
- Large image: An image proportionally compressed from the original image by the SDK client. If the shorter side is greater than 720 pixels, the image is proportionally compressed until the shorter side is 720 pixels. If the shorter side is less than or equal to 720 pixels, the original dimensions are retained without upscaling. This type of image is typically displayed on the chat details page.
- Thumbnail: An image proportionally compressed by the server from the original image. By default, if the shorter side is greater than 170 pixels, the image is proportionally compressed until the shorter side is 170 pixels. If the shorter side is less than or equal to 170 pixels, the original dimensions are retained without upscaling. You can configure the thumbnail compression method and dimensions in the [EasyIM Console](/product/console/basic_message.html#图片消息缩略图). This type of image is typically used for lightweight displays such as conversation lists and chat lists.

#### Sending process

The process for sending an image message is as follows:

1. Retrieve the path of the image in the local file system.

2. Call `EMImageMessageBody#initWithLocalPath:displayName:` to create an image message body.

   When creating the message body, pass the local path and display name of the image. Use `EMImageMessageBody#isOriginalImage` to specify whether to send the original image:

   - `true`: Upload the original image.
   - `false`: Upload the compressed large image.

3. Create an `EMChatMessage` with the image message body and target conversation ID.

   The target conversation ID is the peer user ID, group ID, or chat room ID for one-to-one chat, group chat, or a chat room, respectively. For group chat and a chat room, you must also set `chatType` to `.groupChat` and `.chatRoom`, respectively.

4. Call `IEMChatManager#sendMessage:progress:completion:` to send the image message.

   By default, the SDK automatically uploads the image attachment, and the server automatically generates a thumbnail. You can retrieve the attachment upload progress through the `progress` callback and the sending result through the `completion` callback.

The following sample code creates and sends an image message:

```swif
// After selecting an image from the system photo library or file picker, save it to a local path accessible to the app.
let imagePath = selectedImagePath
let displayName = "image.jpg"

guard FileManager.default.fileExists(atPath: imagePath) else {
    print("The image file does not exist")
    return
}

// Create an image message body.
let body = EMImageMessageBody(
    localPath: imagePath,
    displayName: displayName
)

// false means sending the compressed large image. true means sending the original image.
body.isOriginalImage = false

// Create an image message. Pass the peer user ID for one-to-one chat or the group ID for group chat.
// For a chat room, pass the chat room ID.
let message = EMChatMessage(
    conversationID: conversationId,
    body: body,
    ext: nil
)

// Set the conversation type. The default for one-to-one chat is .chat. For group chat and a chat room,
// set it to .groupChat and .chatRoom, respectively.
message.chatType = .chat

// Send the image message.
EMClient.shared().chatManager?.send(
    message,
    progress: { progress in
        // Attachment upload progress. The value range is 0-100.
        print("Upload progress: \(progress)%")
    },
    completion: { message, error in
        if let error = error {
            print("Failed to send: \(error.errorDescription ?? "Unknown error")")
            return
        }

        print("Sent successfully")
    }
)
```

#### Key parameters and properties

| Parameter or property | Type | Required/Optional | Description |
| ------------------ | ------------ | ---------------- | ------------------------------------------------------------ |
| `localPath` | `String` | Required | The image path in the local file system. Ensure that the SDK can read the file before sending. |
| `displayName` | `String` | Required | The image display name, which is usually a filename with an extension. |
| `isOriginalImage` | `Bool` | Optional | Whether to send the original image. `true` means uploading the original image, and `false` means uploading the compressed large image. |
| `compressionRatio` | `CGFloat` | Optional | The image compression ratio. The value range is `(0.0, 1.0]`, and the default is `0.6`. `1.0` means no compression. |
| `conversationID` | `String` | Required | The target conversation ID. It is the peer user ID for one-to-one chat, group ID for group chat, or chat room ID for a chat room. |
| `chatType` | `EMChatType` | Required for group chats and chat rooms | `.chat`, `.groupChat`, or `.chatRoom` for one-to-one chat, group chat, or a chat room, respectively. The default is `.chat`. |

### Send GIF images

A GIF image message is a special type of image message. Unlike a regular image message, a GIF image cannot be compressed when sent.

#### Sending process

The process for sending a GIF image message is as follows:

1. Retrieve the path of the GIF image in the local file system.
2. Call `EMImageMessageBody#initWithGifFilePath:displayName:` to create a GIF image message body.
3. Create an `EMChatMessage` with the GIF image message body and target conversation ID, and set the corresponding conversation type.
4. Call `IEMChatManager#sendMessage:progress:completion:` to send the GIF image message. The SDK uploads the GIF image to the EasyIM server, and the server automatically generates an image thumbnail.

The following sample code creates and sends a GIF image message:

```swift
let gifPath = selectedGifPath
let displayName = "animation.gif"

guard FileManager.default.fileExists(atPath: gifPath) else {
    print("The GIF image file does not exist")
    return
}

// Create a message body using the GIF-specific initializer.
// The SDK does not compress GIF images created through this method.
let body = EMImageMessageBody(
    gifFilePath: gifPath,
    displayName: displayName
)

// Create the message.
let message = EMChatMessage(
    conversationID: conversationId,
    body: body,
    ext: nil
)

// Set the conversation type. The default for one-to-one chat is .chat. For group chat and a chat room,
// set it to .groupChat and .chatRoom, respectively.
message.chatType = .chat

// Send the GIF image message.
EMClient.shared().chatManager?.send(
    message,
    progress: { progress in
        print("Upload progress: \(progress)%")
    },
    completion: { message, error in
        if let error = error {
            print("Failed to send: \(error.errorDescription ?? "Unknown error")")
            return
        }

        print("Sent successfully")
    }
)
```

#### Key parameters

| Parameter | Type | Required/Optional | Description |
| ---------------- | -------- | --------- | ------------------------------------------------------------ |
| `gifFilePath` | `String` | Required | The path of the GIF image in the local file system. GIF images are not compressed when sent. |
| `displayName` | `String` | Required | The GIF image display name, which is usually a filename with the `.gif` extension. |
| `conversationID` | `String` | Required | The target conversation ID. It is the peer user ID for one-to-one chat, group ID for group chat, or chat room ID for a chat room. |

### Send voice messages

#### Sending process

1. Record audio at the app layer and save the voice file to a local path accessible to the app.
2. Call `EMVoiceMessageBody#initWithLocalPath:displayName:` to create a voice message body, and set the voice duration through `duration`.
3. Create an `EMChatMessage` with the voice message body and target conversation ID. When sending a group or chat room message, also set the corresponding `chatType`.
4. Call `IEMChatManager#sendMessage:progress:completion:` to send the message. The SDK uploads the voice file to the EasyIM server.

You can retrieve the attachment upload progress through the `progress` callback and the sending result through the `completion` callback.

The following sample code creates and sends a voice message:

```swift
// voicePath is the local path of the voice file, and duration is the voice duration in seconds.
let voicePath = recordedVoicePath
let duration: Int32 = 10

guard FileManager.default.fileExists(atPath: voicePath) else {
    print("The voice file does not exist")
    return
}

// Create a voice message body.
let body = EMVoiceMessageBody(
    localPath: voicePath,
    displayName: "voice.m4a"
)
body.duration = duration

// Create a voice message. Pass the peer user ID for one-to-one chat or the group ID for group chat.
// For a chat room, pass the chat room ID.
let message = EMChatMessage(
    conversationID: conversationId,
    body: body,
    ext: nil
)

// Set the conversation type. The default for one-to-one chat is .chat. For group chat and a chat room,
// set it to .groupChat and .chatRoom, respectively.
message.chatType = .chat

// Send the voice message.
EMClient.shared().chatManager?.send(
    message,
    progress: { progress in
        // Attachment upload progress. The value range is 0-100.
        print("Upload progress: \(progress)%")
    },
    completion: { _, error in
        if let error = error {
            print("Failed to send: \(error.errorDescription ?? "Unknown error")")
            return
        }

        print("Sent successfully")
    }
)
```

#### Key parameters and properties

| Parameter or property | Type | Required/Optional | Description |
| ---------------- | ------------ | ---------------- | ------------------------------------------------------------ |
| `localPath` | `String` | Required | The voice file path in the local file system. Ensure that the SDK can read the file before sending. |
| `displayName` | `String` | Required | The voice attachment display name, which is usually a filename with an extension. |
| `duration` | `Int32` | Required | The voice duration in seconds. |
| `conversationID` | `String` | Required | The target conversation ID. It is the peer user ID for one-to-one chat, group ID for group chat, or chat room ID for a chat room. |
| `chatType` | `EMChatType` | Required for group chats and chat rooms | `.chat`, `.groupChat`, or `.chatRoom` for one-to-one chat, group chat, or a chat room, respectively. The default is `.chat`. |

### Send video messages

Before sending a video message, select or record a video at the app layer and retrieve the local path and duration of the video file. When creating the video message body, the SDK attempts to capture a frame from the video and generate a thumbnail. The app can also provide a custom thumbnail for message display.

#### Sending process

The process for sending a video message is as follows:

1. Select or record a video at the app layer and save the video file to a local path accessible to the app.
2. Call `EMVideoMessageBody#initWithLocalPath:displayName:` to create a video message body. The SDK attempts to capture a frame from the video file and generate a thumbnail.
3. Set the video duration through `duration`. To use a custom thumbnail, generate the thumbnail at the app layer and set its local path through `thumbnailLocalPath`.
4. Create an `EMChatMessage` with the video message body and target conversation ID. When sending a group or chat room message, also set the corresponding `chatType`.
5. Call `IEMChatManager#sendMessage:progress:completion:` to send the message.

During sending, the SDK uploads the video and its thumbnail and then sends the message. You can retrieve the attachment upload progress through the `progress` callback and the sending result through the `completion` callback.

The following sample code creates and sends a video message:

```swift
let videoPath = selectedVideoPath
let duration: Int32 = 30

guard FileManager.default.fileExists(atPath: videoPath) else {
    print("The video file does not exist")
    return
}

// Create a video message body.
// The SDK attempts to capture a frame from the video file and generate a thumbnail.
let body = EMVideoMessageBody(
    localPath: videoPath,
    displayName: "video.mp4"
)

// Set the video duration.
body.duration = duration

// Optional: Use an app-generated thumbnail instead of the thumbnail generated by the SDK.
// let thumbnailPath = generatedThumbnailPath
// if FileManager.default.fileExists(atPath: thumbnailPath) {
//     body.thumbnailLocalPath = thumbnailPath
// }

// Create a video message. Pass the peer user ID for one-to-one chat or the group ID for group chat.
// For a chat room, pass the chat room ID.
let message = EMChatMessage(
    conversationID: conversationId,
    body: body,
    ext: nil
)

// Set the conversation type. The default for one-to-one chat is .chat. For group chat and a chat room,
// set it to .groupChat and .chatRoom, respectively.
message.chatType = .chat

// Send the video message.
EMClient.shared().chatManager?.send(
    message,
    progress: { progress in
        // Attachment upload progress. The value range is 0-100.
        print("Upload progress: \(progress)%")
    },
    completion: { _, error in
        if let error = error {
            print("Failed to send: \(error.errorDescription ?? "Unknown error")")
            return
        }

        print("Sent successfully")
    }
)
```

#### Key parameters and properties

| Parameter or property | Type | Required/Optional | Description |
| -------------------- | ------------ | ---------------- | ------------------------------------------------------------ |
| `localPath` | `String` | Required | The video file path in the local file system. Ensure that the SDK can read the file before sending. |
| `displayName` | `String` | Required | The video attachment display name, which is usually a filename with an extension. |
| `duration` | `Int32` | Required | The video duration in seconds. |
| `thumbnailLocalPath` | `String` | Optional | The local path of the custom video thumbnail. If it is not set, the SDK attempts to generate a thumbnail automatically. |
| `conversationID` | `String` | Required | The target conversation ID. It is the peer user ID for one-to-one chat, group ID for group chat, or chat room ID for a chat room. |
| `chatType` | `EMChatType` | Required for group chats and chat rooms | `.chat`, `.groupChat`, or `.chatRoom` for one-to-one chat, group chat, or a chat room, respectively. The default is `.chat`. |

### Send file messages

#### Sending process

1. Retrieve the path of the file in the local file system and ensure that the SDK can read the file.
2. Call `EMFileMessageBody#initWithLocalPath:displayName:` to create a file message body.
3. Create an `EMChatMessage` with the file message body and target conversation ID. When sending a group or chat room message, also set the corresponding `chatType`.
4. Call `IEMChatManager#sendMessage:progress:completion:` to send the file message. The SDK uploads the file to the EasyIM server.

You can retrieve the file upload progress through the `progress` callback and the sending result through the `completion` callback.

The following sample code creates and sends a file message:

```swift
let filePath = selectedFilePath

guard FileManager.default.fileExists(atPath: filePath) else {
    print("The file does not exist")
    return
}

// Retrieve the filename.
let displayName = URL(fileURLWithPath: filePath).lastPathComponent

// Create a file message body.
let body = EMFileMessageBody(
    localPath: filePath,
    displayName: displayName
)

// Create a file message. Pass the peer user ID for one-to-one chat or the group ID for group chat.
// For a chat room, pass the chat room ID.
let message = EMChatMessage(
    conversationID: conversationId,
    body: body,
    ext: nil
)

// Set the conversation type. The default for one-to-one chat is .chat. For group chat and a chat room,
// set it to .groupChat and .chatRoom, respectively.
message.chatType = .chat

// Send the file message.
EMClient.shared().chatManager?.send(
    message,
    progress: { progress in
        // File upload progress. The value range is 0-100.
        print("Upload progress: \(progress)%")
    },
    completion: { _, error in
        if let error = error {
            print("Failed to send: \(error.errorDescription ?? "Unknown error")")
            return
        }

        print("Sent successfully")
    }
)
```

#### Key parameters and properties

| Parameter or property | Type | Required/Optional | Description |
| ---------------- | ------------ | ---------------- | ------------------------------------------------------------ |
| `localPath` | `String` | Required | The file path in the local file system. Ensure that the SDK can read the file before sending. |
| `displayName` | `String` | Required | The file display name, which is usually a filename with an extension. |
| `conversationID` | `String` | Required | The target conversation ID. It is the peer user ID for one-to-one chat, group ID for group chat, or chat room ID for a chat room. |
| `chatType` | `EMChatType` | Required for group chats and chat rooms | `.chat`, `.groupChat`, or `.chatRoom` for one-to-one chat, group chat, or a chat room, respectively. The default is `.chat`. |

### Upload message attachments to your own server

To upload an attachment to your own server instead of the EasyIM server when sending a message, disable the SDK's automatic attachment transfer and have the app upload the attachment itself.

The steps are as follows:

1. Before initializing the SDK, set `EMOptions#isAutoTransferMessageAttachments` to `false` so that the SDK no longer automatically uploads or downloads message attachments.
2. Have the app upload the attachment to your own server and retrieve the remote URL of the attachment.
3. Create an attachment message body of the corresponding type and set the remote URL in the `remotePath` property inherited from `EMFileMessageBody`.
4. Create and send the `EMChatMessage`.

The following example shows how to send an image that has been uploaded to your own server.

```swift
// 1. Disable automatic attachment upload and download before initializing the SDK.
let options = EMOptions.options(withAppkey: "your-org#your-app")
options.isAutoTransferMessageAttachments = false

if let error = EMClient.shared().initializeSDK(with: options) {
    print("Failed to initialize the SDK: \(error.errorDescription ?? "Unknown error")")
} else {
    print("SDK initialized successfully")
}
```

After the app uploads the image to its own server and retrieves the remote URL, create and send the image message:

```swift
func sendPrivateImage(
    conversationId: String,
    remoteURL: String,
    localPreviewPath: String? = nil
) {
    // localPreviewPath is optional and is used only for local preview or as a placeholder on the sender's side.
    let body = EMImageMessageBody(
        localPath: localPreviewPath,
        displayName: "IMG_111.png"
    )

    // Set original image mode to ensure that remotePath represents the remote URL of the current image.
    body.isOriginalImage = true

    // Set the URL of the image on your own server.
    body.remotePath = remoteURL

    // Optional: Set the attachment size in bytes.
    // body.fileLength = 10_000

    let message = EMChatMessage(
        conversationID: conversationId,
        body: body,
        ext: nil
    )

    // This example uses one-to-one chat. For group chat and a chat room,
    // set it to .groupChat and .chatRoom, respectively.
    message.chatType = .chat

    // The SDK does not upload the attachment, so you do not need to monitor SDK attachment upload progress.
    EMClient.shared().chatManager?.send(
        message,
        progress: nil,
        completion: { _, error in
            if let error = error {
                print("Failed to send the message: \(error.errorDescription ?? "Unknown error")")
                return
            }

            print("Message sent successfully")
        }
    )
}
```

:::tip 
For an image message, set `isOriginalImage` to `true` to ensure that `remotePath` represents the configured URL on your own server. <br/> - After `isAutoTransferMessageAttachments` is disabled, the app must implement attachment upload, download, caching, failure retries, and access authentication. <br/>  - This setting affects all attachment messages, not only image messages. - The message itself is still sent through the EasyIM server. 
:::

## Send location messages

Before sending a location message, the app needs to retrieve the latitude, longitude, and address through Core Location, MapKit, or a third-party map service. The iOS SDK only wraps and sends location data. It does not provide positioning or map display capabilities.

#### Sending process

1. Retrieve the latitude, longitude, and address description at the app layer.
2. Call `EMLocationMessageBody#initWithLatitude:longitude:address:` to create a location message body.
3. Create an `EMChatMessage` with the location message body and target conversation ID. When sending a group or chat room message, also set the corresponding `chatType`.
4. Call `IEMChatManager#sendMessage:progress:completion:` to send the location message.

The following sample code creates and sends a location message:

```swift
// latitude is the latitude, longitude is the longitude, and address is the location description.
let latitude = 39.9042
let longitude = 116.4074
let address = "Dongcheng District, Beijing"

// Create a location message body.
let body = EMLocationMessageBody(
    latitude: latitude,
    longitude: longitude,
    address: address
)

// Create a location message.
let message = EMChatMessage(
    conversationID: conversationId,
    body: body,
    ext: nil
)

// Set the conversation type. The default for one-to-one chat is .chat. For group chat and a chat room,
// set it to .groupChat and .chatRoom, respectively.
message.chatType = .chat

// A location message does not contain an attachment, so there is no need to monitor attachment upload progress.
EMClient.shared().chatManager?.send(
    message,
    progress: nil,
    completion: { _, error in
        if let error = error {
            print("Failed to send: \(error.errorDescription ?? "Unknown error")")
            return
        }

        print("Sent successfully")
    }
)
```

To include a building name, use the initializer that contains the `buildingName` parameter:

```swift
let body = EMLocationMessageBody(
    latitude: latitude,
    longitude: longitude,
    address: address,
    buildingName: "EasyIM Building"
)
```

#### Key parameters and properties

| Parameter or property | Type | Required/Optional | Description |
| ---------------- | ------------ | ---------------- | ------------------------------------------------------------ |
| `latitude` | `Double` | Required | The latitude. |
| `longitude` | `Double` | Required | The longitude. |
| `address` | `String` | Optional | The text description of the location. |
| `buildingName` | `String` | Optional | The building name. |
| `conversationID` | `String` | Required | The target conversation ID. It is the peer user ID for one-to-one chat, group ID for group chat, or chat room ID for a chat room. |
| `chatType` | `EMChatType` | Required for group chats and chat rooms | `.chat`, `.groupChat`, or `.chatRoom` for one-to-one chat, group chat, or a chat room, respectively. The default is `.chat`. |

#### Logic

The iOS SDK only wraps and sends location data such as latitude, longitude, address, and building name. It does not provide the following capabilities:

- Retrieve the device's current location.
- Map search or geocoding.
- Display a location on a map.
- Route planning and navigation.

The app must integrate Core Location, MapKit, or a third-party map service and display the location on the receiving side as required by the business.

## Send command messages

A command message is also known as a passthrough message. The sender can use a command message to notify the recipient to perform a custom operation, such as refreshing an avatar, nickname, or business state.

`action` identifies the specific business command, but it cannot begin with `em_` or `easemob::`, because these prefixes are reserved internal fields of the SDK.

:::tip 
<br/> - A command message cannot be recalled after it is sent. <br/> - Command messages are not written to the SDK's local message database and therefore are generally not displayed in the chat UI.<br/> - To deliver a command message only to users who are currently online, set `EMCmdMessageBody#isDeliverOnlineOnly` to `true`. 
:::

#### Sending process

1. Call `EMCmdMessageBody#initWithAction:` to create a command message body.
2. Create an `EMChatMessage` with the command message body and target conversation ID. When sending a group or chat room message, also set the corresponding `chatType`.
3. Call `IEMChatManager#sendMessage:progress:completion:` to send the command message.

The following sample code creates and sends a command message:

```swift
let action = "action1"

// Create a command message body.
let body = EMCmdMessageBody(action: action)

// Optional: Deliver the message only to users who are currently online.
// body.isDeliverOnlineOnly = true

// Create a command message. Pass the peer user ID for one-to-one chat or the group ID for group chat.
// For a chat room, pass the chat room ID.
let message = EMChatMessage(
    conversationID: conversationId,
    body: body,
    ext: nil
)

// Set the conversation type. The default for one-to-one chat is .chat. For group chat and a chat room,
// set it to .groupChat and .chatRoom, respectively.
message.chatType = .chat

// A command message does not contain an attachment, so there is no need to monitor attachment upload progress.
EMClient.shared().chatManager?.send(
    message,
    progress: nil,
    completion: { _, error in
        if let error = error {
            print("Failed to send: \(error.errorDescription ?? "Unknown error")")
            return
        }

        print("Sent successfully")
    }
)
```

#### Key parameters and properties

| Parameter or property | Type | Required/Optional | Description |
| --------------------- | ------------ | ---------------- | ------------------------------------------------------------ |
| `action` | `String` | Required | The command action, which cannot begin with `em_` or `easemob::`. |
| `isDeliverOnlineOnly` | `Bool` | Optional | Whether to deliver the command message only to users who are currently online. The default is `false`. |
| `conversationID` | `String` | Required | The target conversation ID. It is the peer user ID for one-to-one chat, group ID for group chat, or chat room ID for a chat room. |
| `chatType` | `EMChatType` | Required for group chats and chat rooms | `.chat`, `.groupChat`, or `.chatRoom` for one-to-one chat, group chat, or a chat room, respectively. The default is `.chat`. |

## Send custom messages

You can use custom messages to carry custom business events and parameters, such as gifts, business cards, or interaction notifications.

#### Sending process

1. Call `EMCustomMessageBody#initWithEvent:customExt:` to create a custom message body, and set the event name and custom parameters.
2. Create an `EMChatMessage` with the custom message body and target conversation ID.
3. When sending a group or chat room message, set the corresponding `chatType`.
4. Call `IEMChatManager#sendMessage:progress:completion:` to send the custom message.

The following sample code creates and sends a custom message:

```swift
// event identifies the business event of the custom message.
let event = "gift"

// customExt carries custom parameters. Both Key and Value are String values.
let customExt: [String: String] = [
    "giftId": "gift_001",
    "giftName": "Flowers",
    "count": "1"
]

// Create a custom message body.
let body = EMCustomMessageBody(
    event: event,
    customExt: customExt
)

// Create a custom message. Pass the peer user ID for one-to-one chat or the group ID for group chat.
// For a chat room, pass the chat room ID.
let message = EMChatMessage(
    conversationID: conversationId,
    body: body,
    ext: nil
)

// Set the conversation type. The default for one-to-one chat is .chat. For group chat and a chat room,
// set it to .groupChat and .chatRoom, respectively.
message.chatType = .chat

// A custom message does not contain an attachment, so there is no need to monitor attachment upload progress.
EMClient.shared().chatManager?.send(
    message,
    progress: nil,
    completion: { _, error in
        if let error = error {
            print("Failed to send: \(error.errorDescription ?? "Unknown error")")
            return
        }

        print("Sent successfully")
    }
)
```

#### Key parameters and properties

| Parameter or property | Type | Required/Optional | Description |
| ---------------- | ------------------ | ---------------- | ------------------------------------------------------------ |
| `event` | `String` | Required | The event type of the custom message, such as `gift`. We recommend defining a stable and unique event name for each business scenario. |
| `customExt` | `[String: String]` | Optional | The key-value parameters carried in the custom message. Both Key and Value are strings. |
| `conversationID` | `String` | Required | The target conversation ID. It is the peer user ID for one-to-one chat, group ID for group chat, or chat room ID for a chat room. |
| `chatType` | `EMChatType` | Required for group chats and chat rooms | `.chat`, `.groupChat`, or `.chatRoom` for one-to-one chat, group chat, or a chat room, respectively. The default is `.chat`. |

## Send combined messages

The EasyIM iOS SDK supports combining multiple messages into one message for forwarding, such as forwarding chat history.

A combined message is an attachment message. The SDK generates a combined message attachment based on the original message ID list, uploads the attachment to the EasyIM server, and then sends the message.

#### Sending process

1. Prepare the title, summary, compatibility text, and original message ID list for the combined message.
2. Call `EMCombineMessageBody#initWithTitle:summary:compatibleText:messageIdList:` to create a combined message body.
3. Create an `EMChatMessage` with the combined message body and target conversation ID.
4. When sending a group or chat room message, set the corresponding `chatType`.
5. Call `IEMChatManager#sendMessage:progress:completion:` to send the combined message.

You can retrieve the combined message attachment upload progress through the `progress` callback and the sending result through the `completion` callback.

The following sample code creates and sends a combined message:

```swift
let title = "Chat history between A and B"
let summary = """
A: This is A's message content
B: This is B's message content
"""
let compatibleText = "The current version does not support combined messages. Upgrade to the latest version."

// Add the original message IDs to combine.
let messageIdList = [
    "1390191369179366180",
    "1390191426268037924",
    "1390186040483906340"
]

// Product restriction: The list cannot be empty and can contain up to 300 message IDs at each level.
// The iOS SDK initializer does not actively validate the number, so we recommend checking it at the app layer.
guard !messageIdList.isEmpty,
      messageIdList.count <= 300,
      messageIdList.allSatisfy({ !$0.isEmpty }) else {
    print("The original message ID list is invalid")
    return
}

// Create a combined message body.
let body = EMCombineMessageBody(
    title: title,
    summary: summary,
    compatibleText: compatibleText,
    messageIdList: messageIdList
)

// Create a combined message. Pass the peer user ID for one-to-one chat or the group ID for group chat.
// For a chat room, pass the chat room ID.
let message = EMChatMessage(
    conversationID: conversationId,
    body: body,
    ext: nil
)

// Set the conversation type. The default for one-to-one chat is .chat. For group chat and a chat room,
// set it to .groupChat and .chatRoom, respectively.
message.chatType = .chat

// Send the combined message.
EMClient.shared().chatManager?.send(
    message,
    progress: { progress in
        // Combined message attachment upload progress. The value range is 0-100.
        print("Upload progress: \(progress)%")
    },
    completion: { _, error in
        if let error = error {
            print("Failed to send: \(error.errorDescription ?? "Unknown error")")
            return
        }

        print("Sent successfully")
    }
)
```

#### Key parameters and properties

| Parameter or property | Type | Required/Optional | Description |
| --------------------- | ------------ | ---------------- | ------------------------------------------------------------ |
| `title` | `String` | Recommended | The combined message title, such as "Group Chat History." |
| `summary` | `String` | Recommended | The combined message summary, which displays some of the message content. |
| `compatibleText` | `String` | Recommended | Compatibility text for earlier versions. An earlier SDK version that does not support combined messages can display it as regular text. |
| `messageIdList` | `[String]` | Required | The original message ID list to combine. It cannot be empty. According to the product restriction, each level can contain up to 300 message IDs. |
| `conversationID` | `String` | Required | The target conversation ID. It is the peer user ID for one-to-one chat, group ID for group chat, or chat room ID for a chat room. In a message thread, it is the message thread ID. |
| `chatType` | `EMChatType` | Required for group chats and chat rooms | `.chat`, `.groupChat`, or `.chatRoom` for one-to-one chat, group chat, or a chat room, respectively. The default is `.chat`. A message thread uses `.groupChat`. |
| `isChatThreadMessage` | `Bool` | Required for message threads | Whether the message is in a message thread. Set it to `true` when sending a message to a message thread. |

#### Logic

:::tip 
1. According to the product restriction, combined messages can be nested up to 10 levels, with up to 300 messages at each level. The iOS SDK initializer does not actively validate these restrictions, so we recommend that the app check them before sending.<br/> 2. A combined message is an attachment message. According to the product rules, the combined message attachment is uploaded to the EasyIM server regardless of whether `EMOptions#isAutoTransferMessageAttachments` is set to `true` or `false`. <br/>3. To forward an existing combined message again, add the combined message's message ID to the new combined message's `messageIdList`. This creates a nested combined message and counts toward the nesting level restriction. 
:::

#### Recommendations

Before creating a combined message, we recommend checking the following:

- `messageIdList` cannot be empty, cannot contain an empty message ID, and cannot contain more than 300 messages at each level.
- The message IDs in the list must exist, and the current user must have permission to access them.
- `title` and `summary` should clearly describe the combined message content.
- We recommend always setting `compatibleText` so that earlier clients that do not support combined messages can display fallback text.

## Message sending callbacks

#### Usage

The iOS SDK does not require a separate state callback to be set on `EMChatMessage`. When you call `IEMChatManager#sendMessage:progress:completion:` to send a message, you can monitor the sending process directly through the following two callbacks:

- `progress`: Monitors attachment upload progress. The value range is `0～100`.
- `completion`: Retrieves the message sending result. A `nil` `error` indicates that the message was sent successfully. Otherwise, sending failed.

Messages that do not contain attachments, such as text, location, command, and custom messages, generally do not generate valid upload progress, so you can set `progress` to `nil`.

#### Sample code

```objectivec
EMClient.shared().chatManager?.send(
    message,
    progress: { progress in
        // Attachment upload progress. The value range is 0-100.
        print("Upload progress: \(progress)%")
    },
    completion: { sentMessage, error in
        if let error = error {
            // Failed to send the message. Handle the failure based on the error code and error description.
            print("Failed to send. Error code: \(error.code)")
            print("Error description: \(error.errorDescription ?? "Unknown error")")
            return
        }

        // The message was sent successfully.
        print("Sent successfully. Message ID: \(sentMessage?.messageId ?? "")")
    }
)
```

#### Callback parameters

| Callback or parameter | Type | Description |
| ------------- | ------------------------------------ | ------------------------------------------------------------ |
| `progress` | `(Int32) -> Void` | Triggered when an attachment is uploaded. The parameter indicates the upload progress percentage, ranging from `0～100`. |
| `completion` | `(EMChatMessage?, EMError?) -> Void` | Triggered when message sending is complete. It returns the sent message object and error information. |
| `sentMessage` | `EMChatMessage?` | The sent message object. After the message is sent successfully, you can read information such as the message ID and sending state. |
| `error` | `EMError?` | Error information. `nil` indicates that the message was sent successfully, while a non-`nil` value indicates that sending failed. |

#### Logic

`IEMChatManager#sendMessage:progress:completion:` itself accepts a progress callback and a completion callback. The app does not need to set a state callback for `EMChatMessage` in advance.

- For attachment messages, use both `progress` and `completion` to update the upload progress and final sending state.
- For messages that do not contain attachments, set `progress` to `nil` and process the sending result only through `completion`.
- `completion` is generally called on the main thread. The app can update the message list or sending state in this callback.

## More information

#### Chat room message priority and message dropping

For chat room messages, EasyIM supports high, normal, and low message priorities. You can set the priority of an individual chat room message through `EMChatMessage#priority`.

- `EMChatRoomMessagePriorityHigh`: High priority.
- `EMChatRoomMessagePriorityNormal`: Normal priority, which is the default.
- `EMChatRoomMessagePriorityLow`: Low priority.

When chat room message concurrency or the sending frequency is too high, the server processes high-priority messages first and drops low-priority messages first. Therefore, you can set important messages such as rewards and announcements to high priority.

Message priority only increases the likelihood that important messages are processed first and does not guarantee delivery. High-priority messages may still be dropped when chat room message concurrency is too high.

For a single chat room, message dropping may be triggered when more than 20 messages are sent per second by default:

1. The server drops low-priority messages first and attempts to retain high-priority messages.
2. When messages of the same priority exceed the limit, the server processes them in sending order, and messages sent later may be dropped.

```objectivec
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"Hi"];

EMChatMessage *message = [[EMChatMessage alloc]
    initWithConversationID:@"roomId"
    body:body
    ext:nil];

// Set the message as a chat room message.
message.chatType = EMChatTypeChatRoom;

// Set the chat room message priority.
// If it is not set, the default is EMChatRoomMessagePriorityNormal.
message.priority = EMChatRoomMessagePriorityHigh;

[[EMClient sharedClient].chatManager
    sendMessage:message
    progress:nil
    completion:^(EMChatMessage *message, EMError *error) {
        if (error) {
            NSLog(@"Failed to send: %@", error.errorDescription);
            return;
        }

        NSLog(@"Sent successfully");
    }];
```

:::tip 
`priority` applies only to chat room messages, not to one-to-one or group messages.
:::

#### Voice chat room seat management

You can use [custom chat room attributes](room_attributes.html) to implement voice chat room seat state management and multi-device synchronization, such as recording the user on a seat, seat state, and volume state.

Custom chat room attributes in the iOS SDK use string key-value pairs:

```objectivec
NSDictionary<NSString *, NSString *> *
```

Therefore, a seat list or other structured data cannot be written directly as an array, dictionary, or custom object. The app can store the data in the following ways:

- Use a separate attribute for each seat. The attribute Key indicates the seat number, and its Value contains the serialized seat information.
- Serialize the seat list as a JSON string and write it as a single attribute value.

After custom chat room attributes are set or updated, other members in the chat room can monitor attribute changes through `EMChatroomManagerDelegate#chatroomAttributesDidUpdated:attributeMap:from:` and update their local seat states.

For implementation details and permission requirements, see [Custom Chat Room Attributes](room_attributes.html).

#### Retrieve the progress of sending attachment messages

When sending an attachment message such as an image, voice, video, or file message, you can retrieve the attachment upload progress through the `progress` callback of `IEMChatManager#sendMessage:progress:completion:`.

The value range of `progress` is `0-100`, indicating the attachment upload percentage. You can retrieve the message sending result through the `completion` callback:

- A `nil` `error`: The message was sent successfully.
- A non-`nil` `error`: Failed to send the message. The error contains an error code and error description.
- `message`: The message object returned by the SDK.

```objectivec
[[EMClient sharedClient].chatManager
    sendMessage:message
    progress:^(int progress) {
        // Attachment upload progress. The value range is 0-100.
        NSLog(@"Upload progress: %d%%", progress);
    }
    completion:^(EMChatMessage *message, EMError *error) {
        if (error) {
            // Failed to send the message. Update the UI based on the error code and error description.
            NSLog(@"Failed to send: %@", error.errorDescription);
            return;
        }

        // The message was sent successfully.
        NSLog(@"Sent successfully. Message ID: %@", message.messageId);
    }];
```

:::tip 
Text, location, command, and custom messages generally do not involve attachment uploads, so you can set `progress` to `nil`.
:::

#### Message size and storage restrictions

The sizes and storage periods of the message body, extension fields, and attachments for each message type are subject to product restrictions. Before sending a message, ensure that the message content and attachment size do not exceed the corresponding restrictions.

For details, see [Message Restrictions](/product/limitation.html#消息大小).

#### Set callback routing when sending a message

Callback routing allows you to route different messages under the same App Key to different service URLs based on the callback environment identifier carried in the message.

When sending a message, you can set a callback environment such as `dev`, `test`, or `prod` through `EMChatMessage#webhookEnv`. After the EasyIM server receives the message, it matches the environment identifier against the callback routes configured in the EasyIM Console and sends the current message callback to the corresponding [pre-delivery callback](/document/server-side/callback_presending.html) or [post-delivery callback](/document/server-side/callback_postsending.html) URL.

:::tip 
Currently, this feature is available only in China Regions 1 and 2.
:::

**Use cases**

| Use case | Description |
| -------------- | ------------------------------------------------------------ |
| Multi-environment isolation | Distinguish development, testing, and production environments under the same App Key and route messages to the corresponding service URLs. |
| Canary release | Route some messages to a new path for verification while the remaining messages continue to use the existing path. |
| Multi-business-line routing | Route messages from different business modules to the corresponding moderation, risk control, or synchronization services. |
| Reduce pre-delivery latency | Avoid routing all message callbacks to one entry point first and then having the business server forward them again. |

**Scope**

| Callback type | Scope | Description |
| ------------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------ |
| [Pre-delivery callback](/document/server-side/callback_presending.html) | Applies only to messages sent through the SDK. Targeted group and chat room messages are not supported. | Before the message is delivered to the target user, the business server can determine whether to intercept or modify the message content. |
| [Post-delivery callback](/document/server-side/callback_postsending.html) | Applies to messages sent through both the SDK and REST API. | Notifies the business server after the message is sent successfully. |

**Workflow**

1. [Configure callback routes](/product/console/basic_webhook.html#配置消息回调规则) for pre-delivery or post-delivery callbacks in the EasyIM Console.
2. When the client sends a message, set the callback environment identifier through `webhookEnv`.
3. The EasyIM server matches the service URL for the current callback stage based on the callback environment identifier.
4. After a valid route is matched, the server sends the callback request to the corresponding URL.

#### Parameters

| Parameter | Type | Required | Description |
| ------------ | -------- | -------- | ------------------------------------------------------------ |
| `webhookEnv` | `String` | No | The callback environment identifier. It supports only letters and numbers and cannot exceed 8 characters. We recommend keeping it consistent with the configuration in the EasyIM Console, such as `dev`, `test`, or `prod`. If it is not set or is set to `nil`, the default callback route is used. |

**Sample code**

```swift
func sendTextMessage(
    to userId: String,
    text: String,
    webhookEnv: String?
) {
    // Create a text message body.
    let body = EMTextMessageBody(text: text)

    // Create a one-to-one chat message.
    let message = EMChatMessage(
        conversationID: userId,
        body: body,
        ext: nil
    )
    message.chatType = .chat

    // Set the callback environment identifier. Pass nil to use the default callback route.
    message.webhookEnv = webhookEnv

    // Send the message.
    EMClient.shared().chatManager?.send(
        message,
        progress: nil,
        completion: { sentMessage, error in
            if let error = error {
                print("Failed to send: \(error.errorDescription ?? "Unknown error")")
                return
            }

            print("Sent successfully. Message ID: \(sentMessage?.messageId ?? "")")
        }
    )
}
```

**Callback environment matching rules**

| Scenario | Routing result |
| :--------------------------------------- | :----------------------------------------------------------- |
| An environment value is included and matches a valid route | Route to the corresponding callback URL based on that environment value. |
| An environment value is included but does not match a valid route | **No callback is triggered.** The `default` fallback configuration in the EasyIM Console **does not take effect** in this scenario. |
| No environment value is included | Automatically route to the callback URL for the `default` environment. |
| The same message needs to trigger both pre-delivery and post-delivery callbacks | Both stages must use the **same environment value**. For example, if pre-delivery is configured as `test -> url1` and post-delivery as `test -> url2`, including `test` in the message enables it for both stages. |
