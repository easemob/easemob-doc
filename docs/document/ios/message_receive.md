# 接收消息

## 功能说明
环信即时通讯 IM iOS SDK 通过 `EMChatManagerDelegate` 接收文本、图片、语音、视频、文件、位置、透传、自定义和合并等类型的消息。应用在消息代理回调中识别消息类型，读取对应消息体并根据业务需要展示或处理消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 监听消息事件

应用通过 `addDelegate` 注册实现 `EMChatManagerDelegate` 的消息代理。收到普通消息时触发 `messagesDidReceive`；收到透传消息时触发 `cmdMessagesDidReceive`。

```objectivec
// 实现 EMChatManagerDelegate 中的消息回调。
- (void)messagesDidReceive:(NSArray<EMChatMessage *> *)messages {
    // 处理文本、附件、位置、自定义及合并消息。
}

- (void)cmdMessagesDidReceive:(NSArray<EMChatMessage *> *)messages {
    // 处理透传消息。
}

// 注册消息代理。
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];
// 不再使用时移除消息代理。
[[EMClient sharedClient].chatManager removeDelegate:self];
```

## 消息通用信息

收到消息后，可通过以下 `EMChatMessage` 属性读取消息通用信息：

| 字段或属性 | 说明 |
| :--- | :--- |
| `messageId` | 消息的唯一 ID。 |
| `from` | 消息发送者的用户 ID。 |
| `to` | 消息目标 ID。 |
| `chatType` | 单聊、群聊或聊天室。 |
| `body.type` | 文本、图片、语音、视频、文件等消息类型。 |
| `body` | 获取并转换为对应的 `EMMessageBody` 子类。 |
| `ext` | 读取发送方携带的业务扩展字段。 |

## 接收文本消息

收到 `messagesDidReceive` 回调后，遍历消息列表，将消息体转换为 `EMTextMessageBody`，通过 `text` 获取文本内容；如需读取业务扩展字段，可读取 `ext`。

```objectivec
- (void)messagesDidReceive:(NSArray<EMChatMessage *> *)messages {
    for (EMChatMessage *message in messages) {
        if (message.body.type == EMMessageBodyTypeText) {
            // 将消息体转换为文本消息体。
            EMTextMessageBody *textBody = (EMTextMessageBody *)message.body;
            NSString *content = textBody.text;
            // 读取发送方携带的扩展字段。
            NSString *value = message.ext[@"attribute"];
        }
    }
}
```

## 接收附件消息

除文本消息外，SDK 还支持接收附件类型消息，包括语音、图片、视频和文件消息。

附件消息的接收过程如下：

1. 接收附件消息。SDK 自动下载语音消息，默认自动下载图片和视频的缩略图。若下载原图、大图、视频和文件，需调用对应下载接口。
2. 获取附件的服务器地址和本地路径。

### 接收语音消息

1. 接收方收到语音消息时，自动下载语音文件。

2. 接收方收到 [`messagesDidReceive`](#接收文本消息) 回调，调用 `remotePath` 或 `localPath` 方法获取语音文件的服务器地址或本地路径，从而获取语音文件。

```objectivec
EMVoiceMessageBody *voiceBody = (EMVoiceMessageBody *)message.body;
// 获取语音文件在服务器的地址。
NSString *voiceRemotePath = voiceBody.remotePath;
// 本地语音文件的资源路径。
NSString *voiceLocalPath = voiceBody.localPath;
```

### 接收图片消息

一条图片消息通常包含三类图片资源：

- 原图：发送方本地选择的原始图片文件，通常用于查看或保存原图。
- 大图：服务端基于原图进行等比压缩后的图片。压缩规则为：若图片短边大于 720 像素，则等比压缩至短边为 720 像素；若短边小于等于 720 像素，则保留原图尺寸，不做放大处理。此类图片通常用于聊天详情页展示。
- 缩略图：服务端基于原图进行等比压缩后的图片。压缩规则为：默认情况下，若图片短边大于 170 像素，则等比压缩至短边为 170 像素；若短边小于等于 170 像素，则保留原图尺寸，不做放大处理。缩略图的压缩方式和尺寸可在 [控制台进行配置](/product/console/basic_message.html#图片消息缩略图)。此类图片通常用于会话列表、聊天列表等轻量展示场景。

收到图片消息后，SDK 会根据配置自动下载缩略图。若业务需要显示更清晰的图片，可再按需下载大图或原图。

接收图片消息的流程如下：

1. 接收图片消息时，SDK 会根据配置决定是否自动下载缩略图：
   - 默认自动下载，即 `EMOptions#autoDownloadThumbnail` 为 `YES`。
   - 如果关闭自动下载，即 `EMOptions#autoDownloadThumbnail` 为 `NO`，则需要调用 `downloadMessageThumbnail` 手动下载。
2. 收到图片消息后，接收方可以在 `messagesDidReceive` 回调中处理图片消息，并根据业务需要下载原图或大图。
   - 调用 `downloadMessageAttachment` 下载原图。
   - 调用 `downloadBigImageAttachment` 下载大图。
 
如果本地已存在对应资源路径，建议优先复用本地文件，避免重复下载。

示例代码如下：

```objectivec
- (void)messagesDidReceive:(NSArray<EMChatMessage *> *)messages {
    for (EMChatMessage *message in messages) {
        if (message.body.type != EMMessageBodyTypeImage) {
            continue;
        }

        // 下载原图。
        [[EMClient sharedClient].chatManager downloadMessageAttachment:message
                                                              progress:^(int progress) {
            // 原图下载进度，范围为 0 到 100。
        }
                                                            completion:^(EMChatMessage *message, EMError *error) {
            if (!error) {
                // 原图下载成功。
            } else {
                // 原图下载失败。
            }
        }];

        // 下载大图。
        [[EMClient sharedClient].chatManager downloadBigImageAttachment:message
                                                               progress:^(int progress) {
            // 大图下载进度，范围为 0 到 100。
        }
                                                             completion:^(EMChatMessage *message, EMError *error) {
            if (!error) {
                // 大图下载成功。
            } else {
                // 大图下载失败。
            }
        }];
    }
}
```

3. 你可以通过 `EMImageMessageBody` 获取原图、大图和缩略图的服务端地址或本地路径：

```objectivec
EMImageMessageBody *imageBody = (EMImageMessageBody *)message.body;

// 从服务器获取原图、大图和缩略图地址。
NSString *remotePath = imageBody.remotePath;
NSString *bigImageRemotePath = imageBody.bigImageRemotePath;
NSString *thumbnailRemotePath = imageBody.thumbnailRemotePath;

// 从本地获取原图、大图和缩略图路径。
NSString *localPath = imageBody.localPath;
NSString *bigImageLocalPath = imageBody.bigImageLocalPath;
NSString *thumbnailLocalPath = imageBody.thumbnailLocalPath;

// 判断 remotePath 对应原图还是发送方压缩后的大图资源。
BOOL isOriginalImage = imageBody.isOriginalImage;

// 获取大图的下载状态。
EMDownloadStatus bigImageDownloadStatus = imageBody.bigImageDownloadStatus;

// 获取图片宽高。
CGSize imageSize = imageBody.size;
```

### 接收 GIF 图片消息

GIF 图片缩略图的下载与普通图片消息相同，详见 [接收图片消息](#接收图片消息)。

与普通消息相同，接收 GIF 图片消息时，接收方会收到 `messagesDidReceive` 回调方法。接收方判断为图片消息后，读取消息体的 `isGif` 属性，若值是 `YES`， 则为 GIF 图片消息。

```objectivec
- (void)messagesDidReceive:(NSArray<EMChatMessage*> *)aMessages
{
  // 收到消息，遍历消息列表。
  for (EMChatMessage *message in aMessages) {
    // 消息解析和展示。
    if (message.body.type == EMMessageBodyTypeImage) {
        EMImageMessageBody *body = (EMImageMessageBody *)message.body;
        if (body.isGif) {
            // 是 GIF 图片消息
        }
      }
   }
}
```

### 接收视频消息

收到视频消息后，通常会先在聊天界面展示视频缩略图；当用户点击消息时，再下载或播放视频原文件。

接收视频消息的流程如下：

1. 接收方收到视频消息时，SDK 会根据配置决定是否自动下载视频缩略图。

   视频缩略图的下载策略与图片缩略图一致。默认情况下，SDK 自动下载缩略图；如果关闭自动下载，则需要在业务侧手动下载。详见 [设置图片缩略图自动下载](#接收图片消息)。

2. SDK 会通过 [messagesDidReceive 回调](#接收文本消息) 将视频消息传递给接收方。接收方可根据业务需要选择使用缩略图，或进一步下载视频原文件。
   
   - 如果只需要在会话列表或聊天界面展示预览图，可优先使用缩略图。
   - 如果用户需要播放视频，再调用 `downloadMessageAttachment` 下载视频原文件。

   为避免重复下载，建议优先检查本地是否已存在对应的视频文件或缩略图；如果本地已有可用资源，可直接复用。

```typescript
// 下载视频文件。
[[EMClient sharedClient].chatManager downloadMessageAttachment:message
                                                      progress:^(int progress) {
    // 附件下载进度，范围为 0 到 100。
}
                                                    completion:^(EMChatMessage *message, EMError *error) {
    if (!error) {
        EMFileMessageBody *body = (EMFileMessageBody *)message.body;
        // 下载成功后获取附件本地路径。
        NSString *localPath = body.localPath;
    } else {
        // 附件下载失败。
    }
}];
``` 
3. 通过 `EMVideoMessageBody` 获取视频原文件和缩略图的服务端地址或本地路径。其中，缩略图适合用于预览展示，视频原文件适合用于播放或下载保存。

```objectivec
// 发送成功后，获取视频消息缩略图及附件。
EMVideoMessageBody *body = (EMVideoMessageBody *)message.body;
// 从服务器端获取视频文件的地址。
NSString *remotePath = body.remotePath;
// 从服务器端获取视频缩略图。
NSString *thumbnailPath = body.thumbnailRemotePath;
// 从本地获取视频文件。
NSString *localPath = body.localPath;
// 从本地获取视频缩略图。
NSString *thumbnailLocalPath = body.thumbnailLocalPath;
```

### 接收文件消息

接收文件消息的流程如下所示：
1. 接收方收到 [messagesDidReceive](#接收文本消息) 回调，调用 `downloadMessageAttachment` 方法下载文件。

```objectivec
[[EMClient sharedClient].chatManager downloadMessageAttachment:message progress:nil completion:^(EMChatMessage *message, EMError *error) {
            if (!error) {
                // 附件下载成功
            }
        }];
```

2. 调用以下方法从服务器或本地获取文件附件：

```objectivec
EMFileMessageBody *body = (EMFileMessageBody *)message.body;
// 从服务器端获取文件路径。
NSString *remotePath = body.remotePath;
// 从本地获取文件路径。
NSString *localPath = body.localPath;
```

## 接收位置消息

接收位置消息与文本消息一致，详见 [接收文本消息](#接收文本消息)。
   
接收方接收到位置消息时，需要将该位置的经纬度，借由第三方的地图服务，将位置在地图上显示出来。

将消息体转换为 `EMLocationMessageBody`，通过 `latitude`、`longitude` 和 `address` 获取位置坐标及地址信息。

```objectivec
EMLocationMessageBody *locationBody = (EMLocationMessageBody *)message.body;

// 获取位置坐标及地址信息。
double latitude = locationBody.latitude;
double longitude = locationBody.longitude;
NSString *address = locationBody.address;
```

## 接收透传消息

可将透传消息理解为一条指令，通过发送这条指令给对方，通知对方要执行的操作，收到消息可以自定义处理。

具体功能可以根据自身业务需求自定义。另外，以 `em_` 和 `easemob::` 开头的 `action` 为内部保留字段，注意不要使用。

:::tip
- 透传消息发送后，不支持撤回。
- 透传消息不会存入本地数据库中，所以在 UI 上不会显示。
:::

接收方通过 `cmdMessagesDidReceive` 回调接收透传消息，方便用户进行不同的处理。

```objectivec
// 收到透传消息。
- (void)cmdMessagesDidReceive:(NSArray *)aCmdMessages{
  for (EMChatMessage *message in aCmdMessages) {
        EMCmdMessageBody *body = (EMCmdMessageBody *)message.body;
        // 进行透传消息 body 解析。
    }
  }
```

将消息体转换为 `EMCmdMessageBody`，通过 `action` 获取命令动作。如需传递结构化参数，应在命令内容中定义业务协议，或改用自定义消息。

## 接收自定义类型消息

你可以自定义消息类型，方便业务处理，即创建自定义消息时设置事件名称，并可通过扩展字段携带业务数据。

接收自定义消息与其他普通消息一致，应用在 `messagesDidReceive` 回调中判断消息类型并读取消息体。详见 [接收文本消息](#接收文本消息)。

将消息体转换为 `EMCustomMessageBody`，通过 `event` 获取自定义事件，通过 `customExt` 获取自定义参数。

```objectivec
EMCustomMessageBody *customBody = (EMCustomMessageBody *)message.body;

// 获取自定义事件名称。
NSString *event = customBody.event;

// 获取自定义扩展字段。
NSDictionary<NSString *, NSString *> *customExt = customBody.customExt;
```

## 接收合并消息

接收合并消息与接收普通消息的操作相同，详见 [接收消息](#接收文本消息)。

- 对于不支持合并转发消息的 SDK 版本，该类消息会被解析为文本消息，消息内容为 `compatibleText` 携带的内容，其他字段会被忽略。
- 合并消息实际上是一种附件消息。收到合并消息后，你可以调用 `downloadAndParseCombineMessage` 方法下载合并消息附件并解析出原始消息列表。
- 首次调用该方法会下载和解析合并消息附件，然后返回原始消息列表：
  - 若附件已存在，该方法会直接解析附件并返回原始消息列表。
  - 若附件不存在，该方法首先下载附件，然后解析附件并返回原始消息列表。

将消息体转换为 `EMCombineMessageBody` 后，可以读取合并消息的标题、摘要和兼容文本。

```objectivec
- (void)messagesDidReceive:(NSArray<EMChatMessage *> *)aMessages
{

    for (EMChatMessage* msg in aMessages) {
        if (msg.body.type == EMMessageBodyTypeCombine) {
            // 合并消息类型，解析合并消息
            [EMClient.sharedClient.chatManager downloadAndParseCombineMessage:msg completion:^(NSArray<EMChatMessage *> * _Nullable messages, EMError * _Nullable error) {

            }];
        }
    }
}
```

## 更多

### 消息接收回调返回发送成功的消息

若初始化时打开了 `EMOptions#includeSendMessageInMessageListener` 开关，发送成功的消息也会通过 `messagesDidReceive` 返回。

### 判断消息是否为聊天室广播消息

对于聊天室消息，你可以通过消息的 `EMChatMessage#broadcast` 属性判断该消息是否为 [通过 REST API 发送的聊天室全局广播消息](/document/server-side/broadcast_to_chatrooms.html)。

### 消息附件下载鉴权

支持消息附件下载鉴权功能。该功能默认关闭，如要开通需联系环信商务。该功能开通后，用户必须调用 SDK 的 API `downloadMessageAttachment` 下载消息附件。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`addDelegate`](#接收文本消息) | `IEMChatManager` | 注册消息代理。 |
| [`removeDelegate`](#接收文本消息) | `IEMChatManager` | 移除消息代理。 |
| [`downloadMessageThumbnail`](#接收图片消息) | `IEMChatManager` | 下载图片或视频缩略图。 |
| [`downloadBigImageAttachment`](#接收图片消息) | `IEMChatManager` | 下载图片大图。 |
| [`downloadMessageAttachment`](#接收附件消息) | `IEMChatManager` | 下载原图、视频或文件附件。 |
| [`downloadAndParseCombineMessage`](#接收合并消息) | `IEMChatManager` | 下载并解析合并消息。 |

