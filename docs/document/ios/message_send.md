# 发送消息

## 功能说明

环信即时通讯 IM iOS SDK 通过 `EMMessageBody` 的相应子类创建消息体，并使用 `EMChatMessage` 封装消息，最后通过 `IEMChatManager` 发送消息。SDK 支持文本、图片、GIF、语音、视频、文件、位置、透传、自定义和合并消息，可用于单聊、群聊和聊天室。

- 对于单聊，环信即时通讯 IM 默认支持陌生人之间发送消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要 [开启好友关系检查](/product/console/basic_user.html#好友关系检查)。
- 对于群组和聊天室，用户每次只能向所属的单个群组或聊天室发送消息。
- 关于消息发送控制，详见 [单聊](/product/message_single_chat.html#单聊消息发送控制)、[群组聊天](/product/message_group.html#群组消息发送控制) 和 [聊天室](/product/message_chatroom.html#聊天室消息发送控制) 的相关文档。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 发送消息统一流程

各类消息均按照以下流程发送：

1. 创建对应的 `EMMessageBody` 子类实例，并通过 `EMChatMessage` 的初始化方法设置消息体、目标会话 ID 和扩展字段。
2. 设置消息的 `chatType`。单聊默认为 `EMChatTypeChat`；群聊和聊天室需分别设置为 `EMChatTypeGroupChat` 和 `EMChatTypeChatRoom`。
3. 按业务需要设置已读回执、聊天室消息优先级或回调环境等可选属性。
4. 调用 `IEMChatManager#sendMessage:progress:completion:` 发送消息。
5. 通过 `progress` 回调监听附件上传进度，并通过 `completion` 回调获取消息发送结果。

## 通用消息创建参数

iOS SDK 通过不同的 `EMMessageBody` 子类创建各类消息体，再使用消息体、会话 ID 和扩展字段初始化 `EMChatMessage`。不同消息体的初始化参数并不完全相同；创建消息后，还可以通过 `EMChatMessage` 提供的属性设置会话类型及其他可选属性。

| 参数或属性 | 类型 | 设置方式 | 是否必需 | 适用场景 | 说明 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 目标会话 ID | `NSString *` | `initWithConversationID` | 必需 | 所有消息 | 单聊传对端用户 ID；群聊传群组 ID；聊天室传聊天室 ID。 |
| 消息内容 | `EMMessageBody *` | 消息体初始化参数 | 必需 | 所有消息 | 根据消息类型设置文本、附件路径、位置坐标、命令或自定义事件。 |
| 会话类型 | `EMChatType` | `chatType` | 群聊和聊天室必需 | 所有消息 | 单聊、群聊和聊天室分别设置为 `EMChatTypeChat`、`EMChatTypeGroupChat` 和 `EMChatTypeChatRoom`。 |
| 扩展字段 | `NSDictionary *` | `ext` | 可选 | 所有消息 | 携带业务自定义信息；扩展字段会计入消息大小限制。 |
| 仅在线投递 | `BOOL` | `deliverOnlineOnly` | 可选 | 所有消息 | 设置为 `YES` 时仅投递给在线用户，不进行离线存储。 |
| 回调路由环境 | `NSString *` | `webhookEnv` | 可选 | 所有消息 | 设置 Webhook 回调环境标识，服务端据此匹配回调路由。 |
| 聊天室消息优先级 | `EMChatRoomMessagePriority` | `priority` | 可选 | 聊天室消息 | 设置为 `EMChatRoomMessagePriorityHigh`、`EMChatRoomMessagePriorityNormal` 或 `EMChatRoomMessagePriorityLow`。 |
| 定向接收成员 | `NSArray<NSString *> *` | `receiverList` | 可选 | 群聊和聊天室消息 | 设置指定接收成员列表；是否可用受服务端功能限制。 |
| 是否需要已读回执 | `BOOL` | `isNeedReadReceipt` | 可选 | 单聊和群聊消息 | 标记消息需要已读回执；聊天室不支持。 |

## 接口频率限制

默认情况下，SDK 不限制单个用户发送消息的频率。如果已联系环信商务配置单用户发送频率限制，当用户在单聊、群聊或聊天室中的发送频率超过上限时，SDK 会返回错误码 `509`（`MESSAGE_CURRENT_LIMITING`）。

## 发送文本消息

#### 发送流程

1. 创建 `EMTextMessageBody` 文本消息体，再使用该消息体、目标会话 ID 和扩展字段初始化 `EMChatMessage`。

   创建消息时，单聊、群聊和聊天室的目标会话 ID 分别为对端用户 ID、群组 ID 和聊天室 ID。

   创建消息后，可根据业务需要设置目标翻译语言、仅在线投递、定向接收成员和消息优先级等属性。部分属性仅适用于特定会话类型，例如：

   - `EMChatMessage#receiverList` 仅适用于群聊和聊天室定向消息。
   - `EMChatMessage#priority` 仅适用于聊天室消息。
   - `EMChatMessage#isNeedReadReceipt` 适用于单聊和群聊消息，不支持聊天室。
   - 群聊和聊天室消息需要通过 `EMChatMessage#chatType` 设置对应的会话类型。

2. 调用 `IEMChatManager#sendMessage:progress:completion:` 发送文本消息。

   通过 `completion` 回调获取发送结果。文本消息通常不涉及附件上传，因此可以将 `progress` 设置为 `nil`。

创建和发送文本消息的示例代码如下：

```swift
// 创建文本消息体。
let body = EMTextMessageBody(text: "Hello!")

// 创建文本消息：单聊传入对端用户 ID，群聊传入群组 ID，
// 聊天室传入聊天室 ID。
let message = EMChatMessage(
    conversationID: conversationId,
    body: body,
    ext: nil
)

// 设置会话类型。单聊默认为 .chat；群聊和聊天室需分别设置为
// .groupChat 和 .chatRoom。
message.chatType = .chat

// 发送消息。
EMClient.shared().chatManager?.send(
    message,
    progress: nil
) { message, error in
    if let error = error {
        // 消息发送失败，根据错误信息处理。
        print("发送失败：\(error.errorDescription ?? "未知错误")")
        return
    }

    // 消息发送成功。
    print("发送成功")
}
```

#### 关键参数和属性

| 参数或属性       | 类型                        | 设置方式                                                     | 必填/可选        | 适用场景             | 说明                                                         |
| ---------------- | --------------------------- | ------------------------------------------------------------ | ---------------- | -------------------- | ------------------------------------------------------------ |
| 文本内容         | `String`                    | `EMTextMessageBody#initWithText:`                            | 必填             | 文本消息             | 文本消息的正文。                                             |
| 目标会话 ID      | `String`                    | `EMChatMessage#initWithConversationID:body:ext:` 的 `conversationID` 参数 | 必填             | 所有会话类型         | 单聊时为对端用户 ID，群聊时为群组 ID，聊天室时为聊天室 ID。  |
| 会话类型         | `EMChatType`                | `chatType`                                                   | 群聊和聊天室必填 | 所有会话类型         | 单聊、群聊和聊天室分别为 `.chat`、`.groupChat` 和 `.chatRoom`，默认值为 `.chat`。 |
| 目标翻译语言     | `[String]`                  | `EMTextMessageBody#targetLanguages`                          | 可选             | 文本消息             | 设置自动翻译的目标语言代码列表。                             |
| 扩展字段         | `[String: Any]`             | 初始化方法的 `ext` 参数或 `EMChatMessage#ext`                | 可选             | 业务扩展信息         | 用于携带业务附加信息。扩展字段会计入消息大小限制。           |
| 仅在线投递       | `Bool`                      | `deliverOnlineOnly`                                          | 可选             | 瞬时消息、状态通知   | 设置为 `true` 时，消息仅投递给在线用户。                     |
| 回调路由环境     | `String`                    | `webhookEnv`                                                 | 可选             | 多环境回调路由       | 设置 Webhook 回调环境标识。                                  |
| 定向接收成员     | `[String]`                  | `receiverList`                                               | 可选             | 群聊、聊天室定向消息 | 指定群聊或聊天室消息的接收成员。                             |
| 是否需要已读回执 | `Bool`                      | `isNeedReadReceipt`                                          | 可选             | 单聊、群聊           | 标记消息是否需要已读回执；聊天室不支持。                     |
| 消息优先级       | `EMChatRoomMessagePriority` | `priority`                                                   | 可选             | 聊天室消息           | 设置聊天室消息优先级。                                       |

#### 带群消息已读回执和扩展字段的示例

对于带有业务属性的文本消息，可以在初始化 `EMChatMessage` 时传入 `ext`，或创建消息后设置 `EMChatMessage#ext`。群聊场景下，如需统计群成员的消息已读情况，可将 `EMChatMessage#isNeedReadReceipt` 设置为 `true`。

```swift
// 创建群聊文本消息体。
let body = EMTextMessageBody(text: "大家好")

// 添加业务扩展字段。
let ext: [String: Any] = [
    "bizType": "announcement"
]

// 创建群聊消息，groupId 为群组 ID。
let message = EMChatMessage(
    conversationID: groupId,
    body: body,
    ext: ext
)

// 设置为群聊消息。
message.chatType = .groupChat

// 设置该消息需要已读回执。
message.isNeedReadReceipt = true

// 发送消息。
EMClient.shared().chatManager?.send(
    message,
    progress: nil
) { message, error in
    if let error = error {
        print("发送失败：\(error.errorDescription ?? "未知错误")")
        return
    }

    print("发送成功")
}
```

## 发送附件消息

除文本消息外，SDK 还支持发送附件类型消息，包括语音、图片、视频和文件消息。

#### 发送流程

发送附件消息分为以下两步：

1. 创建对应的附件消息体，并使用该消息体创建 `EMChatMessage`。
2. 调用 `IEMChatManager#sendMessage:progress:completion:` 发送消息。SDK 将附件上传至环信服务器。另外，你也可以 [上传消息附件至自有服务器](#上传消息附件至自有服务器)。

#### 资源处理说明

默认情况下，调用 `IEMChatManager#sendMessage:progress:completion:` 后，SDK 会自动将本地附件上传至环信服务器。接收方也可由 SDK 自动下载附件。

初始化 SDK 时，可以通过 `EMOptions#isAutoTransferMessageAttachments` 设置是否由 SDK 自动上传或下载消息附件。对于图片和视频缩略图以及语音消息，可以通过 `EMOptions#autoDownloadThumbnail` 控制是否自动下载。

消息附件大小和存储限制，详见 [消息附件限制说明](/product/limitation.html#消息存储)。

### 发送图片消息

图片消息通常涉及以下三类图片资源：

- 原图：发送方本地选择的原始图片文件，通常用于查看或保存原图。
- 大图：SDK 客户端基于原图进行等比压缩后的图片。压缩规则为：若图片短边大于 720 像素，则等比压缩至短边为 720 像素；若短边小于等于 720 像素，则保留原图尺寸，不做放大处理。此类图片通常用于聊天详情页展示。
- 缩略图：服务端基于原图进行等比压缩后的图片。压缩规则为：默认情况下，若图片短边大于 170 像素，则等比压缩至短边为 170 像素；若短边小于等于 170 像素，则保留原图尺寸，不做放大处理。缩略图的压缩方式和尺寸可在 [控制台进行配置](/product/console/basic_message.html#图片消息缩略图)。此类图片通常用于会话列表、聊天列表等轻量展示场景。

#### 发送流程

发送图片消息的流程如下：

1. 获取图片在本地文件系统中的路径。

2. 调用 `EMImageMessageBody#initWithLocalPath:displayName:` 创建图片消息体。

   创建消息体时，需要传入图片的本地路径和显示名称。通过 `EMImageMessageBody#isOriginalImage` 设置是否发送原图：

   - `true`：上传原图。
   - `false`：上传压缩后的大图。

3. 使用图片消息体和目标会话 ID 创建 `EMChatMessage`。

   单聊、群聊和聊天室的目标会话 ID 分别为对端用户 ID、群组 ID 和聊天室 ID。群聊和聊天室还需要将 `chatType` 分别设置为 `.groupChat` 和 `.chatRoom`。

4. 调用 `IEMChatManager#sendMessage:progress:completion:` 发送图片消息。

   默认情况下，SDK 会自动上传图片附件，服务器会自动生成缩略图。可以通过 `progress` 回调获取附件上传进度，通过 `completion` 回调获取发送结果。

创建和发送图片消息的示例代码如下：

```swif
// 从系统相册或文件选择器获取图片后，将其保存到应用可访问的本地路径。
let imagePath = selectedImagePath
let displayName = "image.jpg"

guard FileManager.default.fileExists(atPath: imagePath) else {
    print("图片文件不存在")
    return
}

// 创建图片消息体。
let body = EMImageMessageBody(
    localPath: imagePath,
    displayName: displayName
)

// false 表示发送压缩后的大图；true 表示发送原图。
body.isOriginalImage = false

// 创建图片消息：单聊传入对端用户 ID，群聊传入群组 ID，
// 聊天室传入聊天室 ID。
let message = EMChatMessage(
    conversationID: conversationId,
    body: body,
    ext: nil
)

// 设置会话类型。单聊默认为 .chat；群聊和聊天室需分别设置为
// .groupChat 和 .chatRoom。
message.chatType = .chat

// 发送图片消息。
EMClient.shared().chatManager?.send(
    message,
    progress: { progress in
        // 附件上传进度，取值范围为 0～100。
        print("上传进度：\(progress)%")
    },
    completion: { message, error in
        if let error = error {
            print("发送失败：\(error.errorDescription ?? "未知错误")")
            return
        }

        print("发送成功")
    }
)
```

#### 关键参数和属性

| 参数或属性         | 类型         | 必填/可选        | 说明                                                         |
| ------------------ | ------------ | ---------------- | ------------------------------------------------------------ |
| `localPath`        | `String`     | 必填             | 图片在本地文件系统中的路径。发送前应确保 SDK 可以读取该文件。 |
| `displayName`      | `String`     | 必填             | 图片的显示名称，通常为带扩展名的文件名。                     |
| `isOriginalImage`  | `Bool`       | 可选             | 是否发送原图。`true` 表示上传原图，`false` 表示上传压缩后的大图。 |
| `compressionRatio` | `CGFloat`    | 可选             | 图片压缩率，取值范围为 `(0.0, 1.0]`，默认值为 `0.6`；`1.0` 表示不压缩。 |
| `conversationID`   | `String`     | 必填             | 目标会话 ID。单聊时为对端用户 ID，群聊时为群组 ID，聊天室时为聊天室 ID。 |
| `chatType`         | `EMChatType` | 群聊和聊天室必填 | 单聊、群聊和聊天室分别为 `.chat`、`.groupChat` 和 `.chatRoom`，默认值为 `.chat`。 |

### 发送 GIF 图片

GIF 图片消息是一种特殊的图片消息。与普通图片消息不同，GIF 图片发送时不能压缩。

#### 发送流程

发送 GIF 图片消息的流程如下：

1. 获取 GIF 图片在本地文件系统中的路径。
2. 调用 `EMImageMessageBody#initWithGifFilePath:displayName:` 创建 GIF 图片消息体。
3. 使用 GIF 图片消息体和目标会话 ID 创建 `EMChatMessage`，并设置相应的会话类型。
4. 调用 `IEMChatManager#sendMessage:progress:completion:` 发送 GIF 图片消息。SDK 会将 GIF 图片上传至环信服务器，服务器自动生成图片缩略图。

创建和发送 GIF 图片消息的示例代码如下：

```swift
let gifPath = selectedGifPath
let displayName = "animation.gif"

guard FileManager.default.fileExists(atPath: gifPath) else {
    print("GIF 图片文件不存在")
    return
}

// 使用 GIF 专用初始化方法创建消息体。
// SDK 不会压缩通过该方法创建的 GIF 图片。
let body = EMImageMessageBody(
    gifFilePath: gifPath,
    displayName: displayName
)

// 创建消息。
let message = EMChatMessage(
    conversationID: conversationId,
    body: body,
    ext: nil
)

// 设置会话类型。单聊默认为 .chat；群聊和聊天室分别设置为
// .groupChat 和 .chatRoom。
message.chatType = .chat

// 发送 GIF 图片消息。
EMClient.shared().chatManager?.send(
    message,
    progress: { progress in
        print("上传进度：\(progress)%")
    },
    completion: { message, error in
        if let error = error {
            print("发送失败：\(error.errorDescription ?? "未知错误")")
            return
        }

        print("发送成功")
    }
)
```

#### 关键参数

| 参数             | 类型     | 必填/可选 | 说明                                                         |
| ---------------- | -------- | --------- | ------------------------------------------------------------ |
| `gifFilePath`    | `String` | 必填      | GIF 图片在本地文件系统中的路径。GIF 图片发送时不进行压缩。   |
| `displayName`    | `String` | 必填      | GIF 图片的显示名称，通常为带 `.gif` 扩展名的文件名。         |
| `conversationID` | `String` | 必填      | 目标会话 ID。单聊时为对端用户 ID，群聊时为群组 ID，聊天室时为聊天室 ID。 |

### 发送语音消息

#### 发送流程

1. 在应用层录制语音，并将语音文件保存到应用可访问的本地路径。
2. 调用 `EMVoiceMessageBody#initWithLocalPath:displayName:` 创建语音消息体，并通过 `duration` 设置语音时长。
3. 使用语音消息体和目标会话 ID 创建 `EMChatMessage`。发送群聊或聊天室消息时，还需设置对应的 `chatType`。
4. 调用 `IEMChatManager#sendMessage:progress:completion:` 发送消息。SDK 会将语音文件上传至环信服务器。

通过 `progress` 回调可以获取附件上传进度，通过 `completion` 回调可以获取发送结果。

创建和发送语音消息的示例代码如下：

```swift
// voicePath 为语音文件的本地路径，duration 为语音时长，单位为秒。
let voicePath = recordedVoicePath
let duration: Int32 = 10

guard FileManager.default.fileExists(atPath: voicePath) else {
    print("语音文件不存在")
    return
}

// 创建语音消息体。
let body = EMVoiceMessageBody(
    localPath: voicePath,
    displayName: "voice.m4a"
)
body.duration = duration

// 创建语音消息。单聊传入对端用户 ID，群聊传入群组 ID，
// 聊天室传入聊天室 ID。
let message = EMChatMessage(
    conversationID: conversationId,
    body: body,
    ext: nil
)

// 设置会话类型。单聊默认为 .chat；群聊和聊天室需分别设置为
// .groupChat 和 .chatRoom。
message.chatType = .chat

// 发送语音消息。
EMClient.shared().chatManager?.send(
    message,
    progress: { progress in
        // 附件上传进度，取值范围为 0～100。
        print("上传进度：\(progress)%")
    },
    completion: { _, error in
        if let error = error {
            print("发送失败：\(error.errorDescription ?? "未知错误")")
            return
        }

        print("发送成功")
    }
)
```

#### 关键参数和属性

| 参数或属性       | 类型         | 必填/可选        | 说明                                                         |
| ---------------- | ------------ | ---------------- | ------------------------------------------------------------ |
| `localPath`      | `String`     | 必填             | 语音文件在本地文件系统中的路径。发送前应确保 SDK 可以读取该文件。 |
| `displayName`    | `String`     | 必填             | 语音附件的显示名称，通常为带扩展名的文件名。                 |
| `duration`       | `Int32`      | 必填             | 语音时长，单位为秒。                                         |
| `conversationID` | `String`     | 必填             | 目标会话 ID。单聊时为对端用户 ID，群聊时为群组 ID，聊天室时为聊天室 ID。 |
| `chatType`       | `EMChatType` | 群聊和聊天室必填 | 单聊、群聊和聊天室分别为 `.chat`、`.groupChat` 和 `.chatRoom`，默认值为 `.chat`。 |

### 发送视频消息

发送视频消息前，需要在应用层选取或录制视频，并获取视频文件的本地路径和时长。创建视频消息体时，SDK 会尝试从视频中截取画面并生成缩略图。应用也可以提供自定义缩略图，用于消息展示。

#### 发送流程

发送视频消息的流程如下：

1. 在应用层选取或录制视频，并将视频文件保存到应用可访问的本地路径。
2. 调用 `EMVideoMessageBody#initWithLocalPath:displayName:` 创建视频消息体。SDK 会尝试从视频文件中截取画面并生成缩略图。
3. 通过 `duration` 设置视频时长。如果需要使用自定义缩略图，可以在应用层生成缩略图，并通过 `thumbnailLocalPath` 设置其本地路径。
4. 使用视频消息体和目标会话 ID 创建 `EMChatMessage`。发送群聊或聊天室消息时，还需设置对应的 `chatType`。
5. 调用 `IEMChatManager#sendMessage:progress:completion:` 发送消息。

发送过程中，SDK 会上传视频及其缩略图，然后发送消息。通过 `progress` 回调可以获取附件上传进度，通过 `completion` 回调可以获取发送结果。

创建和发送视频消息的示例代码如下：

```swift
let videoPath = selectedVideoPath
let duration: Int32 = 30

guard FileManager.default.fileExists(atPath: videoPath) else {
    print("视频文件不存在")
    return
}

// 创建视频消息体。
// SDK 会尝试从视频文件中截取画面并生成缩略图。
let body = EMVideoMessageBody(
    localPath: videoPath,
    displayName: "video.mp4"
)

// 设置视频时长。
body.duration = duration

// 可选：使用应用生成的缩略图覆盖 SDK 生成的缩略图。
// let thumbnailPath = generatedThumbnailPath
// if FileManager.default.fileExists(atPath: thumbnailPath) {
//     body.thumbnailLocalPath = thumbnailPath
// }

// 创建视频消息。单聊传入对端用户 ID，群聊传入群组 ID，
// 聊天室传入聊天室 ID。
let message = EMChatMessage(
    conversationID: conversationId,
    body: body,
    ext: nil
)

// 设置会话类型。单聊默认为 .chat；群聊和聊天室需分别设置为
// .groupChat 和 .chatRoom。
message.chatType = .chat

// 发送视频消息。
EMClient.shared().chatManager?.send(
    message,
    progress: { progress in
        // 附件上传进度，取值范围为 0～100。
        print("上传进度：\(progress)%")
    },
    completion: { _, error in
        if let error = error {
            print("发送失败：\(error.errorDescription ?? "未知错误")")
            return
        }

        print("发送成功")
    }
)
```

#### 关键参数和属性

| 参数或属性           | 类型         | 必填/可选        | 说明                                                         |
| -------------------- | ------------ | ---------------- | ------------------------------------------------------------ |
| `localPath`          | `String`     | 必填             | 视频文件在本地文件系统中的路径。发送前应确保 SDK 可以读取该文件。 |
| `displayName`        | `String`     | 必填             | 视频附件的显示名称，通常为带扩展名的文件名。                 |
| `duration`           | `Int32`      | 必填             | 视频时长，单位为秒。                                         |
| `thumbnailLocalPath` | `String`     | 可选             | 自定义视频缩略图的本地路径。未设置时，SDK 会尝试自动生成缩略图。 |
| `conversationID`     | `String`     | 必填             | 目标会话 ID。单聊时为对端用户 ID，群聊时为群组 ID，聊天室时为聊天室 ID。 |
| `chatType`           | `EMChatType` | 群聊和聊天室必填 | 单聊、群聊和聊天室分别为 `.chat`、`.groupChat` 和 `.chatRoom`，默认值为 `.chat`。 |

### 发送文件消息

#### 发送流程

1. 获取文件在本地文件系统中的路径，并确保 SDK 可以读取该文件。
2. 调用 `EMFileMessageBody#initWithLocalPath:displayName:` 创建文件消息体。
3. 使用文件消息体和目标会话 ID 创建 `EMChatMessage`。发送群聊或聊天室消息时，还需设置相应的 `chatType`。
4. 调用 `IEMChatManager#sendMessage:progress:completion:` 发送文件消息。SDK 会将文件上传至环信服务器。

通过 `progress` 回调可以获取文件上传进度，通过 `completion` 回调可以获取发送结果。

创建和发送文件消息的示例代码如下：

```swift
let filePath = selectedFilePath

guard FileManager.default.fileExists(atPath: filePath) else {
    print("文件不存在")
    return
}

// 获取文件名。
let displayName = URL(fileURLWithPath: filePath).lastPathComponent

// 创建文件消息体。
let body = EMFileMessageBody(
    localPath: filePath,
    displayName: displayName
)

// 创建文件消息。单聊传入对端用户 ID，群聊传入群组 ID，
// 聊天室传入聊天室 ID。
let message = EMChatMessage(
    conversationID: conversationId,
    body: body,
    ext: nil
)

// 设置会话类型。单聊默认为 .chat；群聊和聊天室需分别设置为
// .groupChat 和 .chatRoom。
message.chatType = .chat

// 发送文件消息。
EMClient.shared().chatManager?.send(
    message,
    progress: { progress in
        // 文件上传进度，取值范围为 0～100。
        print("上传进度：\(progress)%")
    },
    completion: { _, error in
        if let error = error {
            print("发送失败：\(error.errorDescription ?? "未知错误")")
            return
        }

        print("发送成功")
    }
)
```

#### 关键参数和属性

| 参数或属性       | 类型         | 必填/可选        | 说明                                                         |
| ---------------- | ------------ | ---------------- | ------------------------------------------------------------ |
| `localPath`      | `String`     | 必填             | 文件在本地文件系统中的路径。发送前应确保 SDK 可以读取该文件。 |
| `displayName`    | `String`     | 必填             | 文件的显示名称，通常为带扩展名的文件名。                     |
| `conversationID` | `String`     | 必填             | 目标会话 ID。单聊时为对端用户 ID，群聊时为群组 ID，聊天室时为聊天室 ID。 |
| `chatType`       | `EMChatType` | 群聊和聊天室必填 | 单聊、群聊和聊天室分别为 `.chat`、`.groupChat` 和 `.chatRoom`，默认值为 `.chat`。 |

### 上传消息附件至自有服务器

发送消息时，如果需要将附件上传至自有服务器，而不是环信服务器，需要关闭 SDK 的附件自动传输功能，并由应用自行负责附件的上传。

具体步骤如下：

1. 初始化 SDK 前，将 `EMOptions#isAutoTransferMessageAttachments` 设置为 `false`，使 SDK 不再自动上传或下载消息附件。
2. 由应用将附件上传至自有服务器，并获取附件的远程地址。
3. 创建对应类型的附件消息体，将远程地址设置到继承自 `EMFileMessageBody` 的 `remotePath` 属性中。
4. 创建并发送 `EMChatMessage`。

以下示例演示如何发送已上传至自有服务器的图片。

```swift
// 1. 初始化 SDK 前关闭附件自动上传和下载。
let options = EMOptions.options(withAppkey: "your-org#your-app")
options.isAutoTransferMessageAttachments = false

if let error = EMClient.shared().initializeSDK(with: options) {
    print("SDK 初始化失败：\(error.errorDescription ?? "未知错误")")
} else {
    print("SDK 初始化成功")
}
```

应用将图片上传至自有服务器并获取远程地址后，创建并发送图片消息：

```swift
func sendPrivateImage(
    conversationId: String,
    remoteURL: String,
    localPreviewPath: String? = nil
) {
    // localPreviewPath 可选，仅用于发送方本地预览或占位。
    let body = EMImageMessageBody(
        localPath: localPreviewPath,
        displayName: "IMG_111.png"
    )

    // 设置为原图模式，确保 remotePath 表示当前图片的远程地址。
    body.isOriginalImage = true

    // 设置图片在自有服务器中的地址。
    body.remotePath = remoteURL

    // 可选：设置附件大小，单位为字节。
    // body.fileLength = 10_000

    let message = EMChatMessage(
        conversationID: conversationId,
        body: body,
        ext: nil
    )

    // 此处以单聊为例。群聊和聊天室需分别设置为
    // .groupChat 和 .chatRoom。
    message.chatType = .chat

    // SDK 不负责上传附件，因此不需要监听 SDK 的附件上传进度。
    EMClient.shared().chatManager?.send(
        message,
        progress: nil,
        completion: { _, error in
            if let error = error {
                print("消息发送失败：\(error.errorDescription ?? "未知错误")")
                return
            }

            print("消息发送成功")
        }
    )
}
```

:::tip 
对于图片消息，应将 `isOriginalImage` 设置为 `true`，确保 `remotePath` 表示设置的自有服务器地址。 <br/> - 关闭 `isAutoTransferMessageAttachments` 后，附件的上传、下载、缓存、失败重试和访问鉴权均需由应用自行实现。 <br/>  - 该配置会影响所有附件消息，而不只影响图片消息。 - 消息本身仍通过环信服务器发送。 
:::

## 发送位置消息

发送位置消息前，应用需要通过 Core Location、MapKit 或第三方地图服务获取位置的经纬度和地址信息。iOS SDK 只负责封装和发送位置数据，不提供定位或地图展示能力。

#### 发送流程

1. 在应用层获取位置的纬度、经度和地址描述。
2. 调用 `EMLocationMessageBody#initWithLatitude:longitude:address:` 创建位置消息体。
3. 使用位置消息体和目标会话 ID 创建 `EMChatMessage`。发送群聊或聊天室消息时，还需设置相应的 `chatType`。
4. 调用 `IEMChatManager#sendMessage:progress:completion:` 发送位置消息。

创建和发送位置消息的示例代码如下：

```swift
// latitude 为纬度，longitude 为经度，address 为位置描述。
let latitude = 39.9042
let longitude = 116.4074
let address = "北京市东城区"

// 创建位置消息体。
let body = EMLocationMessageBody(
    latitude: latitude,
    longitude: longitude,
    address: address
)

// 创建位置消息。
let message = EMChatMessage(
    conversationID: conversationId,
    body: body,
    ext: nil
)

// 设置会话类型。单聊默认为 .chat；群聊和聊天室需分别设置为
// .groupChat 和 .chatRoom。
message.chatType = .chat

// 位置消息不包含附件，无需监听附件上传进度。
EMClient.shared().chatManager?.send(
    message,
    progress: nil,
    completion: { _, error in
        if let error = error {
            print("发送失败：\(error.errorDescription ?? "未知错误")")
            return
        }

        print("发送成功")
    }
)
```

如果需要携带建筑物名称，可以使用包含 `buildingName` 参数的初始化方法：

```swift
let body = EMLocationMessageBody(
    latitude: latitude,
    longitude: longitude,
    address: address,
    buildingName: "环信大厦"
)
```

#### 关键参数和属性

| 参数或属性       | 类型         | 必填/可选        | 说明                                                         |
| ---------------- | ------------ | ---------------- | ------------------------------------------------------------ |
| `latitude`       | `Double`     | 必填             | 纬度。                                                       |
| `longitude`      | `Double`     | 必填             | 经度。                                                       |
| `address`        | `String`     | 可选             | 位置的文字描述。                                             |
| `buildingName`   | `String`     | 可选             | 建筑物名称。                                                 |
| `conversationID` | `String`     | 必填             | 目标会话 ID。单聊时为对端用户 ID，群聊时为群组 ID，聊天室时为聊天室 ID。 |
| `chatType`       | `EMChatType` | 群聊和聊天室必填 | 单聊、群聊和聊天室分别为 `.chat`、`.groupChat` 和 `.chatRoom`，默认值为 `.chat`。 |

#### 逻辑说明

iOS SDK 只负责封装和发送经纬度、地址及建筑物名称等位置数据，不提供以下能力：

- 获取设备当前位置。
- 地图搜索或地理编码。
- 在地图中展示位置。
- 路线规划和导航。

应用需要自行接入 Core Location、MapKit 或第三方地图服务，并在接收端根据业务需要展示位置。

## 发送透传消息

透传消息也称为命令消息。发送方可以通过透传消息通知接收方执行自定义操作，例如刷新头像、昵称或业务状态。

`action` 用于标识具体的业务命令，但不能以 `em_` 或 `easemob::` 开头，这些前缀为 SDK 内部保留字段。

:::tip 
<br/> - 透传消息发送后不支持撤回。 <br/> - 透传消息不会写入 SDK 本地消息数据库，因此通常不在聊天 UI 中显示。<br/> - 如果只需将透传消息投递给当前在线用户，可以将 `EMCmdMessageBody#isDeliverOnlineOnly` 设置为 `true`。 
:::

#### 发送流程

1. 调用 `EMCmdMessageBody#initWithAction:` 创建透传消息体。
2. 使用透传消息体和目标会话 ID 创建 `EMChatMessage`。发送群聊或聊天室消息时，还需设置相应的 `chatType`。
3. 调用 `IEMChatManager#sendMessage:progress:completion:` 发送透传消息。

创建和发送透传消息的示例代码如下：

```swift
let action = "action1"

// 创建透传消息体。
let body = EMCmdMessageBody(action: action)

// 可选：仅向当前在线用户投递。
// body.isDeliverOnlineOnly = true

// 创建透传消息。单聊传入对端用户 ID，群聊传入群组 ID，
// 聊天室传入聊天室 ID。
let message = EMChatMessage(
    conversationID: conversationId,
    body: body,
    ext: nil
)

// 设置会话类型。单聊默认为 .chat；群聊和聊天室需分别设置为
// .groupChat 和 .chatRoom。
message.chatType = .chat

// 透传消息不包含附件，无需监听附件上传进度。
EMClient.shared().chatManager?.send(
    message,
    progress: nil,
    completion: { _, error in
        if let error = error {
            print("发送失败：\(error.errorDescription ?? "未知错误")")
            return
        }

        print("发送成功")
    }
)
```

#### 关键参数和属性

| 参数或属性            | 类型         | 必填/可选        | 说明                                                         |
| --------------------- | ------------ | ---------------- | ------------------------------------------------------------ |
| `action`              | `String`     | 必填             | 命令动作，不能以 `em_` 或 `easemob::` 开头。                 |
| `isDeliverOnlineOnly` | `Bool`       | 可选             | 是否仅向当前在线用户投递该命令消息，默认值为 `false`。       |
| `conversationID`      | `String`     | 必填             | 目标会话 ID。单聊时为对端用户 ID，群聊时为群组 ID，聊天室时为聊天室 ID。 |
| `chatType`            | `EMChatType` | 群聊和聊天室必填 | 单聊、群聊和聊天室分别为 `.chat`、`.groupChat` 和 `.chatRoom`，默认值为 `.chat`。 |

## 发送自定义类型消息

你可以通过自定义消息承载业务自定义事件和参数，例如礼物、名片或互动通知等。

#### 发送流程

1. 调用 `EMCustomMessageBody#initWithEvent:customExt:` 创建自定义消息体，并设置事件名称和自定义参数。
2. 使用自定义消息体和目标会话 ID 创建 `EMChatMessage`。
3. 发送群聊或聊天室消息时，设置对应的 `chatType`。
4. 调用 `IEMChatManager#sendMessage:progress:completion:` 发送自定义消息。

创建和发送自定义消息的示例代码如下：

```swift
// event 用于标识自定义消息的业务事件。
let event = "gift"

// customExt 用于携带自定义参数，Key 和 Value 均为 String。
let customExt: [String: String] = [
    "giftId": "gift_001",
    "giftName": "鲜花",
    "count": "1"
]

// 创建自定义消息体。
let body = EMCustomMessageBody(
    event: event,
    customExt: customExt
)

// 创建自定义消息。单聊传入对端用户 ID，群聊传入群组 ID，
// 聊天室传入聊天室 ID。
let message = EMChatMessage(
    conversationID: conversationId,
    body: body,
    ext: nil
)

// 设置会话类型。单聊默认为 .chat；群聊和聊天室需分别设置为
// .groupChat 和 .chatRoom。
message.chatType = .chat

// 自定义消息不包含附件，无需监听附件上传进度。
EMClient.shared().chatManager?.send(
    message,
    progress: nil,
    completion: { _, error in
        if let error = error {
            print("发送失败：\(error.errorDescription ?? "未知错误")")
            return
        }

        print("发送成功")
    }
)
```

#### 关键参数和属性

| 参数或属性       | 类型               | 必填/可选        | 说明                                                         |
| ---------------- | ------------------ | ---------------- | ------------------------------------------------------------ |
| `event`          | `String`           | 必填             | 自定义消息的事件类型，例如 `gift`。建议为不同业务场景定义稳定且唯一的事件名称。 |
| `customExt`      | `[String: String]` | 可选             | 自定义消息携带的键值对参数，Key 和 Value 均为字符串。        |
| `conversationID` | `String`           | 必填             | 目标会话 ID。单聊时为对端用户 ID，群聊时为群组 ID，聊天室时为聊天室 ID。 |
| `chatType`       | `EMChatType`       | 群聊和聊天室必填 | 单聊、群聊和聊天室分别为 `.chat`、`.groupChat` 和 `.chatRoom`，默认值为 `.chat`。 |

## 发送合并消息

环信即时通讯 IM iOS SDK 支持将多条消息合并为一条消息进行转发，适用于转发聊天记录等场景。

合并消息属于附件消息。SDK 根据原始消息 ID 列表生成合并消息附件，将附件上传至环信服务器后发送消息。

#### 发送流程

1. 准备合并消息的标题、摘要、兼容文本和原始消息 ID 列表。
2. 调用 `EMCombineMessageBody#initWithTitle:summary:compatibleText:messageIdList:` 创建合并消息体。
3. 使用合并消息体和目标会话 ID 创建 `EMChatMessage`。
4. 发送群聊或聊天室消息时，设置对应的 `chatType`。
5. 调用 `IEMChatManager#sendMessage:progress:completion:` 发送合并消息。

通过 `progress` 回调可以获取合并消息附件的上传进度，通过 `completion` 回调可以获取发送结果。

创建和发送合并消息的示例代码如下：

```swift
let title = "A 和 B 的聊天记录"
let summary = """
A：这是 A 的消息内容
B：这是 B 的消息内容
"""
let compatibleText = "当前版本不支持合并消息，请升级至最新版本"

// 添加需要合并的原始消息 ID。
let messageIdList = [
    "1390191369179366180",
    "1390191426268037924",
    "1390186040483906340"
]

// 产品限制：列表不能为空，每层最多包含 300 个消息 ID。
// iOS SDK 构造方法不会主动校验数量，因此建议在应用层检查。
guard !messageIdList.isEmpty,
      messageIdList.count <= 300,
      messageIdList.allSatisfy({ !$0.isEmpty }) else {
    print("原始消息 ID 列表不合法")
    return
}

// 创建合并消息体。
let body = EMCombineMessageBody(
    title: title,
    summary: summary,
    compatibleText: compatibleText,
    messageIdList: messageIdList
)

// 创建合并消息。单聊传入对端用户 ID，群聊传入群组 ID，
// 聊天室传入聊天室 ID。
let message = EMChatMessage(
    conversationID: conversationId,
    body: body,
    ext: nil
)

// 设置会话类型。单聊默认为 .chat；群聊和聊天室需分别设置为
// .groupChat 和 .chatRoom。
message.chatType = .chat

// 发送合并消息。
EMClient.shared().chatManager?.send(
    message,
    progress: { progress in
        // 合并消息附件上传进度，取值范围为 0～100。
        print("上传进度：\(progress)%")
    },
    completion: { _, error in
        if let error = error {
            print("发送失败：\(error.errorDescription ?? "未知错误")")
            return
        }

        print("发送成功")
    }
)
```

#### 关键参数和属性

| 参数或属性            | 类型         | 必填/可选        | 说明                                                         |
| --------------------- | ------------ | ---------------- | ------------------------------------------------------------ |
| `title`               | `String`     | 建议设置         | 合并消息的标题，例如“群聊记录”。                             |
| `summary`             | `String`     | 建议设置         | 合并消息的概要，用于展示其中部分消息内容。                   |
| `compatibleText`      | `String`     | 建议设置         | 低版本兼容文本。不支持合并消息的旧版本 SDK 可将其作为普通文本展示。 |
| `messageIdList`       | `[String]`   | 必填             | 需要合并的原始消息 ID 列表，不能为空。按照产品限制，每层最多包含 300 个消息 ID。 |
| `conversationID`      | `String`     | 必填             | 目标会话 ID。单聊时为对端用户 ID，群聊时为群组 ID，聊天室时为聊天室 ID；消息话题中为消息话题 ID。 |
| `chatType`            | `EMChatType` | 群聊和聊天室必填 | 单聊、群聊和聊天室分别为 `.chat`、`.groupChat` 和 `.chatRoom`，默认值为 `.chat`。消息话题使用 `.groupChat`。 |
| `isChatThreadMessage` | `Bool`       | 消息话题必填     | 是否为消息话题中的消息。向消息话题发送时设置为 `true`。      |

#### 逻辑说明

:::tip 
1. 按照产品限制，合并消息最多嵌套 10 层，每层最多包含 300 条消息。iOS SDK 构造方法不会主动校验这些限制，建议应用在发送前自行检查。<br/> 2. 合并消息属于附件消息。按照产品规则，无论 `EMOptions#isAutoTransferMessageAttachments` 设置为 `true` 还是 `false`，合并消息附件都会上传至环信服务器。 <br/>3. 如果需要再次转发已有的合并消息，可以将该合并消息的消息 ID 添加到新合并消息的 `messageIdList` 中。该操作会形成嵌套的合并消息，并计入嵌套层级限制。 
:::

#### 使用建议

创建合并消息前，建议检查以下内容：

- `messageIdList` 不能为空，不能包含空消息 ID，且每层不能超过 300 条。
- 列表中的消息 ID 应真实存在且当前用户有权访问。
- `title` 和 `summary` 应清楚说明合并消息的内容。
- 建议始终设置 `compatibleText`，供不支持合并消息的旧版本客户端降级展示。

## 发送过程回调

#### 使用说明

iOS SDK 无需在 `EMChatMessage` 上单独设置状态回调。调用 `IEMChatManager#sendMessage:progress:completion:` 发送消息时，可以直接通过以下两个回调监听发送过程：

- `progress`：监听附件上传进度，取值范围为 `0～100`。
- `completion`：获取消息发送结果。`error` 为 `nil` 表示发送成功，否则表示发送失败。

文本、位置、透传和自定义消息等不包含附件的消息通常不会产生有效的上传进度，可以将 `progress` 设置为 `nil`。

#### 示例代码

```objectivec
EMClient.shared().chatManager?.send(
    message,
    progress: { progress in
        // 附件上传进度，取值范围为 0～100。
        print("上传进度：\(progress)%")
    },
    completion: { sentMessage, error in
        if let error = error {
            // 消息发送失败，根据错误码和错误描述进行处理。
            print("发送失败，错误码：\(error.code)")
            print("错误描述：\(error.errorDescription ?? "未知错误")")
            return
        }

        // 消息发送成功。
        print("发送成功，消息 ID：\(sentMessage?.messageId ?? "")")
    }
)
```

#### 回调参数说明

| 回调或参数    | 类型                                 | 说明                                                         |
| ------------- | ------------------------------------ | ------------------------------------------------------------ |
| `progress`    | `(Int32) -> Void`                    | 上传附件时触发，参数表示上传进度百分比，取值范围为 `0～100`。 |
| `completion`  | `(EMChatMessage?, EMError?) -> Void` | 消息发送完成时触发，返回发送后的消息对象和错误信息。         |
| `sentMessage` | `EMChatMessage?`                     | 发送后的消息对象。发送成功后可读取消息 ID、发送状态等信息。  |
| `error`       | `EMError?`                           | 错误信息。为 `nil` 表示发送成功；非 `nil` 表示发送失败。     |

#### 逻辑说明

`IEMChatManager#sendMessage:progress:completion:` 本身接收进度回调和完成回调，应用不需要预先为 `EMChatMessage` 设置状态回调。

- 对于附件消息，可以同时使用 `progress` 和 `completion` 更新上传进度及最终发送状态。
- 对于不包含附件的消息，可以将 `progress` 设置为 `nil`，只通过 `completion` 处理发送结果。
- `completion` 通常在主线程调用，应用可以在其中更新消息列表或发送状态。

## 更多

#### 聊天室消息优先级与消息丢弃逻辑

对于聊天室消息，环信即时通讯 IM 支持高、普通和低三种消息优先级。你可以通过 `EMChatMessage#priority` 设置单条聊天室消息的优先级。

- `EMChatRoomMessagePriorityHigh`：高优先级。
- `EMChatRoomMessagePriorityNormal`：普通优先级，默认值。
- `EMChatRoomMessagePriorityLow`：低优先级。

当聊天室消息并发量过大或发送频率过高时，服务器会优先处理高优先级消息，并优先丢弃低优先级消息。因此，可以将打赏、公告等重要消息设置为高优先级。

消息优先级只能提高重要消息被优先处理的可能性，不能保证消息必达。在聊天室消息并发量过大的情况下，高优先级消息仍可能被丢弃。

对于单个聊天室，默认每秒发送的消息数量超过 20 条时，可能触发消息丢弃逻辑：

1. 服务器优先丢弃低优先级消息，尽量保留高优先级消息。
2. 同一优先级的消息超过限制时，服务器按照消息发送时间顺序处理，后发送的消息可能被丢弃。

```objectivec
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"Hi"];

EMChatMessage *message = [[EMChatMessage alloc]
    initWithConversationID:@"roomId"
    body:body
    ext:nil];

// 设置为聊天室消息。
message.chatType = EMChatTypeChatRoom;

// 设置聊天室消息优先级。
// 未设置时，默认值为 EMChatRoomMessagePriorityNormal。
message.priority = EMChatRoomMessagePriorityHigh;

[[EMClient sharedClient].chatManager
    sendMessage:message
    progress:nil
    completion:^(EMChatMessage *message, EMError *error) {
        if (error) {
            NSLog(@"发送失败：%@", error.errorDescription);
            return;
        }

        NSLog(@"发送成功");
    }];
```

:::tip 
`priority` 仅对聊天室消息有效，不适用于单聊和群聊消息。
:::

#### 语聊房麦位管理

你可以基于 [聊天室自定义属性](room_attributes.html) 实现语聊房麦位状态管理和多端同步，例如记录麦位用户、麦位状态和音量状态等信息。

iOS SDK 的聊天室自定义属性采用字符串键值对格式：

```objectivec
NSDictionary<NSString *, NSString *> *
```

因此，麦位列表或其他结构化数据不能直接作为数组、字典或自定义对象写入。应用可以采用以下方式存储：

- 每个麦位使用一个独立属性，属性 Key 表示麦位编号，Value 为序列化后的麦位信息。
- 将麦位列表序列化为 JSON 字符串后，作为单个属性值写入。

设置或更新聊天室自定义属性后，聊天室内其他成员可以通过 `EMChatroomManagerDelegate#chatroomAttributesDidUpdated:attributeMap:from:` 监听属性变更，并更新本地麦位状态。

具体实现方式和权限要求，详见 [聊天室自定义属性](room_attributes.html)。

#### 获取发送附件消息的进度

发送图片、语音、视频或文件等附件消息时，可以通过 `IEMChatManager#sendMessage:progress:completion:` 的 `progress` 回调获取附件上传进度。

`progress` 的取值范围为 `0-100`，表示附件上传百分比。通过 `completion` 回调可以获取消息发送结果：

- `error` 为 `nil`：消息发送成功。
- `error` 不为 `nil`：消息发送失败，包含错误码和错误描述。
- `message`：SDK 返回的消息对象。

```objectivec
[[EMClient sharedClient].chatManager
    sendMessage:message
    progress:^(int progress) {
        // 附件上传进度，取值范围为 0～100。
        NSLog(@"上传进度：%d%%", progress);
    }
    completion:^(EMChatMessage *message, EMError *error) {
        if (error) {
            // 消息发送失败，可根据错误码和错误描述更新 UI。
            NSLog(@"发送失败：%@", error.errorDescription);
            return;
        }

        // 消息发送成功。
        NSLog(@"发送成功，消息 ID：%@", message.messageId);
    }];
```

:::tip 
文本、位置、透传和自定义消息通常不涉及附件上传，可以将 `progress` 设置为 `nil`。
:::

#### 消息大小和存储限制

各类消息正文、扩展字段和附件的大小及存储期限受产品限制。发送消息前，应确保消息内容和附件大小未超过相应限制。

具体限制详见 [消息限制说明](/product/limitation.html#消息大小)。

#### 发消息时设置回调路由

回调路由允许你在同一个 App Key 下，根据消息携带的回调环境标识，将不同消息分别回调至不同的服务地址。

发送消息时，可以通过 `EMChatMessage#webhookEnv` 设置回调环境，例如 `dev`、`test` 或 `prod`。环信服务器收到消息后，会根据该环境标识匹配控制台中配置的回调路由，并将当前消息回调至对应的 [发送前回调](/document/server-side/callback_presending.html) 或 [发送后回调](/document/server-side/callback_postsending.html) 地址。

:::tip 
目前，该功能仅面向国内 1 区和国内 2 区开放。
:::

**适用场景**

| 场景           | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| 多环境隔离     | 在同一 App Key 下区分开发、测试和生产环境，将消息分别回调至对应的服务地址。 |
| 灰度发布       | 将部分消息回调至新链路进行验证，其余消息仍使用原有链路。     |
| 多业务线分流   | 将不同业务模块的消息回调至对应的审核、风控或同步服务。       |
| 降低发送前时延 | 避免消息先统一回调至一个入口，再由业务服务器进行二次转发。   |

**适用范围**

| 回调类型                                                     | 生效范围                                            | 说明                                                         |
| ------------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------ |
| [发送前回调](/document/server-side/callback_presending.html) | 仅对 SDK 发送的消息生效，不支持群组和聊天室定向消息 | 消息下发给目标用户前，业务服务器可以判断是否拦截或修改消息内容。 |
| [发送后回调](/document/server-side/callback_postsending.html) | 对 SDK 和 REST API 发送的消息均生效                 | 消息成功发送后，通知业务服务器。                             |

**工作流程**

1. 在控制台为发送前回调或发送后回调[配置回调路由](/product/console/basic_webhook.html#配置消息回调规则)。
2. 客户端发送消息时，通过 `webhookEnv` 设置回调环境标识。
3. 环信服务器根据回调环境标识匹配当前回调阶段的服务地址。
4. 命中有效路由后，服务器将回调请求发送至对应地址。

#### 参数说明

| 参数         | 类型     | 是否必需 | 说明                                                         |
| ------------ | -------- | -------- | ------------------------------------------------------------ |
| `webhookEnv` | `String` | 否       | 回调环境标识。仅支持字母和数字，长度不超过 8 个字符。建议与控制台配置保持一致，例如 `dev`、`test` 或 `prod`。不设置或设置为 `nil` 时，使用默认回调路由。 |

**示例代码**

```swift
func sendTextMessage(
    to userId: String,
    text: String,
    webhookEnv: String?
) {
    // 创建文本消息体。
    let body = EMTextMessageBody(text: text)

    // 创建单聊消息。
    let message = EMChatMessage(
        conversationID: userId,
        body: body,
        ext: nil
    )
    message.chatType = .chat

    // 设置回调环境标识。传入 nil 时使用默认回调路由。
    message.webhookEnv = webhookEnv

    // 发送消息。
    EMClient.shared().chatManager?.send(
        message,
        progress: nil,
        completion: { sentMessage, error in
            if let error = error {
                print("发送失败：\(error.errorDescription ?? "未知错误")")
                return
            }

            print("发送成功，消息 ID：\(sentMessage?.messageId ?? "")")
        }
    )
}
```

**回调环境命中规则**

| 场景                                     | 路由结果                                                     |
| :--------------------------------------- | :----------------------------------------------------------- |
| 携带环境值且命中有效路由           | 按该环境值路由至对应的回调地址。                             |
| 携带环境值但未命中有效路由           | **不触发回调**，控制台中的 `default` 兜底配置在此场景下 **不生效**。 |
| 未携带环境值                         | 自动路由至 `default` 环境对应的回调地址。                    |
| 同一消息需同时触发发送前与发送后回调 | 两个阶段必须使用 **相同的环境值**。例如，发送前配置 `test -> url1`，发送后配置 `test -> url2`，则消息中携带 `test` 即可同时生效于两阶段。 |

