# 接收消息

## 功能说明

环信即时通讯 IM HarmonyOS SDK 通过 `ChatMessageListener` 接收文本、图片、语音、视频、文件、位置、透传、自定义和合并等类型的消息。应用在消息监听回调中识别消息类型，读取对应消息体并根据业务需要展示或处理消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 监听消息事件

应用通过 `ChatManager#addMessageListener` 注册 `ChatMessageListener`。收到普通消息时触发 `onMessageReceived`；收到透传消息时触发 `onCmdMessageReceived`。同一个 `ChatManager` 可以注册多个消息监听器，不再使用时应及时移除。

```typescript
let messageListener: ChatMessageListener = {
  onMessageReceived: (messages: Array<ChatMessage>): void => {
    // 处理文本、附件、位置、自定义及合并消息。
  },
  onCmdMessageReceived: (messages: Array<ChatMessage>): void => {
    // 处理透传消息。
  }
};

let chatManager = ChatClient.getInstance().chatManager();
chatManager?.addMessageListener(messageListener);

// 不再使用时移除同一个监听器实例。
chatManager?.removeMessageListener(messageListener);
```

## 消息通用信息

收到消息后，可通过以下 `ChatMessage` 方法读取消息的通用信息：

| 字段或属性 | 获取方式 | 说明 |
| :--- | :--- | :--- |
| 消息 ID | `ChatMessage#getMsgId` | 消息的唯一 ID。 |
| 发送方 | `ChatMessage#getFrom` | 消息发送者的用户 ID。 |
| 接收方 | `ChatMessage#getTo` | 消息目标 ID。 |
| 会话 ID | `ChatMessage#getConversationId` | 消息所属会话的 ID。 |
| 会话类型 | `ChatMessage#getChatType` | 单聊、群聊或聊天室。 |
| 消息类型 | `ChatMessage#getType` | 文本、图片、语音、视频、文件等类型。 |
| 消息体 | `ChatMessage#getBody` | 获取对应的 `ChatMessageBody` 子类；消息体不存在时返回 `undefined`。 |
| 扩展字段 | `ChatMessage#ext` | 获取发送方通过 `setExt` 设置的业务扩展字段，返回 `Map<string, MessageExtType>`。 |
| 发送方信息 | `ChatMessage#getSenderInfo` | 开启用户信息自动管理后，可获取发送方昵称、头像、群名片和好友备注等信息；消息未携带时返回 `undefined`。 |

## 接收文本消息

收到 `onMessageReceived` 回调后，遍历消息列表。对于文本消息，将消息体转换为 `TextMessageBody`，调用 `getContent()` 获取文本内容；如需读取业务扩展字段，可调用 `ChatMessage#ext` 获取扩展字段映射。

```typescript
let messageListener: ChatMessageListener = {
  onMessageReceived: (messages: Array<ChatMessage>): void => {
    messages.forEach((message: ChatMessage): void => {
      if (message.getType() !== ContentType.TXT) {
        return;
      }

      let textBody = message.getBody() as TextMessageBody;
      let text = textBody.getContent();

      let ext = message.ext();
      let businessValue = ext.get('businessKey');

      // 根据 text 和 businessValue 更新界面或执行业务逻辑。
    });
  }
};

ChatClient.getInstance()
  .chatManager()
  ?.addMessageListener(messageListener);
```

## 接收附件消息

除文本消息外，SDK 还支持接收附件类型消息，包括语音、图片、视频和文件消息。

附件消息的接收过程如下：

1. 接收附件消息。默认情况下，SDK 自动下载语音附件，并根据配置自动下载图片和视频的缩略图。原始图片附件、大图、视频和文件需要按业务需要调用对应下载接口。
2. 从消息体读取附件的服务器地址、本地路径及下载状态。

`ChatManager#downloadAttachment`、`downloadThumbnail` 和 `downloadBigImage` 均返回 `Promise<void>`，并支持可选的下载进度回调。进度值范围为 `0-100`。

### 接收语音消息

1. 默认情况下，接收方收到语音消息时，SDK 自动下载语音附件。
2. 接收方收到 `onMessageReceived` 回调后，通过 `VoiceMessageBody#getRemoteUrl` 或 `getLocalPath` 获取语音附件的服务器地址或本地路径。

```typescript
let voiceBody = message.getBody() as VoiceMessageBody;

// 语音附件的服务器地址。
let voiceRemoteUrl = voiceBody.getRemoteUrl();
// 语音附件的本地路径。
let voiceLocalPath = voiceBody.getLocalPath();
// 语音时长，单位为秒。
let duration = voiceBody.getDuration();
```

### 接收图片消息

一条图片消息通常包含三类图片资源：

- 原图：发送方本地选择的原始图片文件，通常用于查看或保存原图。
- 大图：发送非原图且图片不是 GIF 时，发送端 SDK 生成的压缩图。若图片短边大于 720 像素，SDK 将其等比压缩至短边为 720 像素，并按 85% 的质量编码；短边不超过 720 像素时不放大。大图通常用于聊天详情页展示。HarmonyOS SDK 自 1.14.0 起支持大图资源。
- 缩略图：服务端根据上传的图片生成的缩略资源。缩略图的压缩方式和尺寸可在 [控制台进行配置](/product/console/basic_message.html#图片消息缩略图)，通常用于会话列表、聊天列表等轻量展示场景。

收到图片消息后，SDK 会根据配置自动下载缩略图。若业务需要显示更清晰的图片，可再按需下载大图或图片附件。

接收图片消息的流程如下：

1. SDK 根据初始化配置决定是否自动下载缩略图：

   - `ChatOptions#setAutoDownloadThumbnail` 默认为 `true`，SDK 自动下载图片和视频缩略图。
   - 设置为 `false` 后，应用需调用 `ChatManager#downloadThumbnail` 手动下载缩略图。

2. 在 `onMessageReceived` 中识别图片消息，并根据业务需要下载资源：

   - 调用 `ChatManager#downloadAttachment` 下载图片附件。若发送方发送原图，该附件为原图；若发送方发送大图，该附件为发送方生成的大图。
   - 调用 `ChatManager#downloadBigImage` 下载大图。该方法仅适用于图片消息。

如果本地已存在对应资源，建议直接复用本地文件，避免重复下载。

```typescript
/**
 * 下载图片的大图或图片附件。
 * useBigImage 为 true 时下载大图，为 false 时下载图片附件。
 */
function downloadImage(message: ChatMessage, useBigImage: boolean): void {
  let chatManager = ChatClient.getInstance().chatManager();
  if (!chatManager) {
    return;
  }

  let downloadTask: Promise<void>;
  if (useBigImage) {
    downloadTask = chatManager.downloadBigImage(
      message,
      (progress: number): void => {
        // 大图下载进度。
      }
    );
  } else {
    downloadTask = chatManager.downloadAttachment(
      message,
      (progress: number): void => {
        // 图片附件下载进度。
      }
    );
  }

  downloadTask.then((): void => {
    // 图片资源下载成功。
  }).catch((error: ChatError): void => {
    // 图片资源下载失败。
  });
}
```

3. 通过 `ImageMessageBody` 获取图片附件、大图和缩略图的服务器地址、本地路径和状态：

```typescript
let imageBody = message.getBody() as ImageMessageBody;

// true 表示图片附件为原图；false 表示为发送方压缩后的大图。
let isOriginal = imageBody.isOriginalImage();

let imageRemoteUrl = imageBody.getRemoteUrl();
let imageLocalPath = imageBody.getLocalPath();

let bigImageRemoteUrl = imageBody.getBigImageRemoteUrl();
let bigImageLocalPath = imageBody.getBigImageLocalPath();

let thumbnailRemoteUrl = imageBody.getThumbnailRemoteUrl();
let thumbnailLocalPath = imageBody.getThumbnailLocalPath();

let attachmentStatus = imageBody.getDownloadStatus();
let bigImageStatus = imageBody.getBigImageDownloadStatus();
let thumbnailStatus = imageBody.getThumbnailDownloadStatus();

let width = imageBody.getWidth();
let height = imageBody.getHeight();
```

### 接收 GIF 图片消息

HarmonyOS SDK 自 1.7.0 起支持接收 GIF 图片消息。

GIF 图片缩略图的下载方式与普通图片消息相同，详见 [接收图片消息](#接收图片消息)。

接收方在 `onMessageReceived` 中识别图片消息后，可调用 `ImageMessageBody#isGif` 判断是否为 GIF 图片。

```typescript
let messageListener: ChatMessageListener = {
  onMessageReceived: (messages: Array<ChatMessage>): void => {
    messages.forEach((message: ChatMessage): void => {
      if (message.getType() !== ContentType.IMAGE) {
        return;
      }

      let body = message.getBody() as ImageMessageBody;
      if (body.isGif()) {
        // 根据业务需要下载并展示 GIF 图片。
      }
    });
  }
};
```

### 接收视频消息

收到视频消息后，通常先在聊天界面展示视频缩略图；用户点击消息时，再下载或播放视频原文件。

接收视频消息的流程如下：

1. SDK 根据 `ChatOptions#setAutoDownloadThumbnail` 的配置决定是否自动下载视频缩略图。该选项默认为 `true`；关闭后，需调用 `ChatManager#downloadThumbnail` 手动下载。详见 [接收图片消息](#接收图片消息)。
2. SDK 通过 `onMessageReceived` 将视频消息传递给应用。可优先使用缩略图展示预览；用户播放视频时，再调用 `ChatManager#downloadAttachment` 下载视频原文件。
3. 下载前建议检查本地路径是否已有可用文件，避免重复下载。

```typescript
function downloadVideo(message: ChatMessage): void {
  let chatManager = ChatClient.getInstance().chatManager();
  if (!chatManager) {
    return;
  }

  chatManager.downloadAttachment(
    message,
    (progress: number): void => {
      // 视频附件下载进度。
    }
  ).then((): void => {
    // 视频附件下载成功，可播放或保存视频。
  }).catch((error: ChatError): void => {
    // 视频附件下载失败。
  });
}
```

4. 通过 `VideoMessageBody` 获取视频原文件和缩略图的服务器地址或本地路径：

```typescript
let videoBody = message.getBody() as VideoMessageBody;

let videoRemoteUrl = videoBody.getRemoteUrl();
let videoLocalPath = videoBody.getLocalPath();

let thumbnailRemoteUrl = videoBody.getThumbnailRemoteUrl();
let thumbnailLocalPath = videoBody.getThumbnailLocalPath();

let duration = videoBody.getDuration();
let attachmentStatus = videoBody.getDownloadStatus();
let thumbnailStatus = videoBody.getThumbnailDownloadStatus();
```

### 接收文件消息

接收文件消息的流程如下：

1. 接收方收到 `onMessageReceived` 回调后，调用 `ChatManager#downloadAttachment` 下载文件。

```typescript
function downloadFile(message: ChatMessage): void {
  let chatManager = ChatClient.getInstance().chatManager();
  if (!chatManager) {
    return;
  }

  chatManager.downloadAttachment(
    message,
    (progress: number): void => {
      // 文件下载进度。
    }
  ).then((): void => {
    // 文件下载成功。
  }).catch((error: ChatError): void => {
    // 文件下载失败。
  });
}
```

2. 通过 `FileMessageBody` 获取文件的服务器地址、本地路径和其他属性：

```typescript
let fileBody = message.getBody() as FileMessageBody;

let fileRemoteUrl = fileBody.getRemoteUrl();
let fileLocalPath = fileBody.getLocalPath();
let fileName = fileBody.getFileName();
let fileLength = fileBody.getFileLength();
let downloadStatus = fileBody.getDownloadStatus();
```

## 接收位置消息

接收位置消息与文本消息的监听方式相同，详见 [接收文本消息](#接收文本消息)。

应用将消息体转换为 `LocationMessageBody`，通过 `getLatitude()`、`getLongitude()`、`getAddress()` 和 `getBuildingName()` 获取位置数据，再使用第三方地图服务展示位置。

```typescript
let locationBody = message.getBody() as LocationMessageBody;

let latitude = locationBody.getLatitude();
let longitude = locationBody.getLongitude();
let address = locationBody.getAddress();
let buildingName = locationBody.getBuildingName();
```

## 接收透传消息

透传消息也称命令消息，可用于通知接收方执行自定义操作。`action` 不能以 `em_` 或 `easemob::` 开头，这两个前缀为内部保留字段。

:::tip
- 透传消息发送后不支持撤回。
- 透传消息不会存入本地数据库，也不会创建本地会话，因此通常不在 UI 中显示。
:::

透传消息通过 `ChatMessageListener#onCmdMessageReceived` 回调，而不是普通消息的 `onMessageReceived` 回调。将消息体转换为 `CmdMessageBody` 后，可通过 `action()` 获取命令动作。

```typescript
let messageListener: ChatMessageListener = {
  onMessageReceived: (messages: Array<ChatMessage>): void => {
    // 接收普通消息。
  },
  onCmdMessageReceived: (messages: Array<ChatMessage>): void => {
    messages.forEach((message: ChatMessage): void => {
      let body = message.getBody() as CmdMessageBody;
      let action = body.action();
      // 根据 action 执行业务逻辑。
    });
  }
};
```

## 接收自定义类型消息

应用在 `onMessageReceived` 中识别 `ContentType.CUSTOM` 消息，将消息体转换为 `CustomMessageBody`，再通过 `event()` 获取自定义事件，通过 `getParams()` 获取自定义参数。

```typescript
if (message.getType() === ContentType.CUSTOM) {
  let customBody = message.getBody() as CustomMessageBody;
  let event = customBody.event();
  let params = customBody.getParams();

  // 根据 event 和 params 执行业务逻辑。
}
```

## 接收合并消息

接收合并消息与接收普通消息的流程相同，应用在 `onMessageReceived` 中识别 `ContentType.COMBINE` 消息。

- 对于不支持合并消息的 SDK 版本，该类消息会被解析为文本消息，消息内容为 `compatibleText`，其他字段会被忽略。
- 合并消息是一种附件消息。调用 `ChatManager#downloadAndParseCombineMessage` 可下载并解析合并消息附件，获取原始消息列表。
- 如果附件已存在，该方法直接解析并返回消息列表；如果附件不存在，该方法先下载附件，再解析并返回消息列表。

通过 `CombineMessageBody` 还可以读取合并消息的标题、摘要和兼容文本。

```typescript
if (message.getType() === ContentType.COMBINE) {
  let body = message.getBody() as CombineMessageBody;
  let title = body.getTitle();
  let summary = body.getSummary();
  let compatibleText = body.getCompatibleText();

  ChatClient.getInstance()
    .chatManager()
    ?.downloadAndParseCombineMessage(message)
    .then((messages: Array<ChatMessage>): void => {
      // 处理并展示原始消息列表。
    })
    .catch((error: ChatError): void => {
      // 处理下载或解析错误。
    });
}
```

## 更多

### 消息接收回调返回发送成功的消息

在 SDK 初始化前调用 `ChatOptions#setIncludeSendMessageInMessageListener(true)` 后，本端发送成功的消息也会通过 `onMessageReceived` 回调返回。该选项默认为 `false`，此时 `onMessageReceived` 仅返回接收到的消息。

### 判断消息是否为聊天室广播消息

对于聊天室消息，可以通过 `ChatMessage#isBroadcast` 判断该消息是否为 [通过 REST API 发送的聊天室全局广播消息](/document/server-side/broadcast_to_chatrooms.html)。

### 消息附件下载鉴权

环信即时通讯 IM 支持消息附件下载鉴权功能。该功能默认关闭，如需开通请联系环信商务。功能开通后，应用必须通过 SDK 的 `downloadAttachment`、`downloadThumbnail` 或 `downloadBigImage` 等接口下载相应附件，不能直接使用附件 URL 下载。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`addMessageListener`](#监听消息事件) | `ChatManager` | 注册消息监听器。 |
| [`removeMessageListener`](#监听消息事件) | `ChatManager` | 移除消息监听器。 |
| [`downloadThumbnail`](#接收图片消息) | `ChatManager` | 下载图片或视频缩略图。 |
| [`downloadBigImage`](#接收图片消息) | `ChatManager` | 下载图片大图。 |
| [`downloadAttachment`](#接收附件消息) | `ChatManager` | 下载图片附件、语音、视频或文件附件。 |
| [`downloadAndParseCombineMessage`](#接收合并消息) | `ChatManager` | 下载并解析合并消息。 |
| [`getThumbnailLocalPath`](#接收图片消息) | `ImageMessageBody` | 获取图片缩略图的本地路径。 |
| [`getBigImageLocalPath`](#接收图片消息) | `ImageMessageBody` | 获取图片大图的本地路径。 |
