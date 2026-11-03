# 接收消息

## 功能说明

环信即时通讯 IM React Native SDK 通过 `ChatMessageEventListener` 接收文本、图片、语音、视频、文件、位置、透传、自定义和合并等类型的消息。应用在回调中识别消息类型，读取消息体并按需展示或处理。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并登录，详见 [初始化](initialization.html) 和 [登录](login.html)。
- 已了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。

## 监听消息事件

通过 `ChatManager#addMessageListener` 注册监听器。普通消息通过 `onMessagesReceived` 返回，透传消息通过 `onCmdMessagesReceived` 返回。一次回调可能包含一条或多条消息。

```typescript
const manager = ChatClient.getInstance().chatManager;
const listener: ChatMessageEventListener = {
  onMessagesReceived: (messages) => {
    console.log('收到普通消息数量：', messages.length);
  },
  onCmdMessagesReceived: (messages) => {
    console.log('收到透传消息数量：', messages.length);
  },
};
manager.addMessageListener(listener);

// 页面或组件销毁、不再需要监听时执行
// manager.removeMessageListener(listener);
```

## 消息通用信息

收到消息后，可以通过 `ChatMessage` 读取以下信息：

| 属性 | 类型 | 说明 |
| :--- | :--- | :--- |
| `msgId` | `string` | 消息 ID。 |
| `from` | `string` | 发送方用户 ID。 |
| `to` | `string` | 接收目标 ID。 |
| `conversationId` | `string` | 消息所属会话 ID。 |
| `chatType` | `ChatMessageChatType` | 单聊 `PeerChat`、群聊 `GroupChat` 或聊天室 `ChatRoom`。 |
| `body.type` | `ChatMessageType` | 消息类型。 |
| `body` | `ChatMessageBody` | 消息体，需按类型转换为对应子类。 |
| `attributes` | `Record<string, any>` | 业务扩展字段，详见 [消息扩展](message_extension.html)。 |

## 接收文本消息

在 `onMessagesReceived` 中遍历消息，对文本消息读取 `ChatTextMessageBody#content`，并从 `attributes` 获取业务扩展字段。扩展字段可能不存在，应按业务协议检查类型和默认值。

```typescript
const manager = ChatClient.getInstance().chatManager;
const textListener: ChatMessageEventListener = {
  onMessagesReceived: (messages) => {
    for (const message of messages) {
      if (message.body.type !== ChatMessageType.TXT) continue;
      const body = message.body as ChatTextMessageBody;
      const businessValue = message.attributes.businessKey;
      console.log('文本内容：', body.content);
      if (typeof businessValue === 'string') {
        console.log('业务字段：', businessValue);
      }
    }
  },
};
manager.addMessageListener(textListener);

// 页面或组件销毁时执行
// manager.removeMessageListener(textListener);
```

## 接收附件消息

除文本消息外，SDK 还支持接收附件类型消息，包括语音、图片、视频和文件消息。

附件消息的接收过程如下：

1. SDK 接收消息。语音附件通常由原生 SDK 自动下载；图片和视频的缩略图默认自动下载。自动下载失败时，可调用对应下载接口重试。
2. 按业务需要手动下载图片附件、大图、视频或文件。
3. 从消息体读取服务端地址和本地路径，并使用业务侧的图片、音视频或文件组件展示。

下载接口返回的 `Promise<void>` 用于报告调用错误；下载进度和最终结果通过 `ChatMessageStatusCallback` 返回。成功后，应从 `onSuccess` 返回的新消息对象读取最新路径，不要继续依赖原 JavaScript 对象。

### 接收语音消息

1. 收到语音消息后，原生 SDK 自动下载语音附件。
2. 在 `onMessagesReceived` 中读取 `ChatVoiceMessageBody#remotePath` 和 `localPath`，分别获取服务端地址和本地路径。
3. 本地文件尚不可用或自动下载失败时，可通过 `downloadAttachment` 手动下载，再从成功回调读取路径。

```typescript
function readVoicePaths(message: ChatMessage): void {
  if (message.body.type !== ChatMessageType.VOICE) return;
  const body = message.body as ChatVoiceMessageBody;
  console.log('语音服务端地址：', body.remotePath);
  console.log('语音本地路径：', body.localPath);
  console.log('语音时长，单位为秒：', body.duration);
}
```

### 接收图片消息

一条图片消息通常包含三类图片资源：

- 原图：发送方本地选择的原始图片文件，通常用于查看或保存原图。
- 大图：原生 SDK 客户端基于原图进行等比压缩后上传的图片。压缩规则为：若图片短边大于 720 像素，则等比压缩至短边为 720 像素；若短边小于等于 720 像素，则保留原图尺寸，不做放大处理。此类图片通常用于聊天详情页展示。
- 缩略图：服务端基于原图进行等比压缩后的图片。压缩规则为：默认情况下，若图片短边大于 170 像素，则等比压缩至短边为 170 像素；若短边小于等于 170 像素，则保留原图尺寸，不做放大处理。缩略图的压缩方式和尺寸可在 [控制台进行配置](/product/console/basic_message.html#图片消息缩略图)。此类图片通常用于会话列表、聊天列表等轻量展示场景。

收到图片消息后，SDK 会根据配置自动下载缩略图。若业务需要显示更清晰的图片，可再按需下载大图或原图。

接收图片消息的流程如下：

1. 初始化时通过 `ChatOptions#isAutoDownload` 配置图片和视频缩略图自动下载，默认为 `true`。关闭后需手动调用 `downloadThumbnail`。

```typescript
async function initializeSdk(): Promise<void> {
  try {
    const options = ChatOptions.withAppKey({
      appKey: '<org_name>#<app_name>',
      isAutoDownload: false,
    });
    await ChatClient.getInstance().init(options);
  } catch (error: unknown) {
    console.error('初始化失败：', error);
  }
}
```

2. 在 `onMessagesReceived` 中识别图片消息，并根据业务需要下载原图或大图：

- `downloadThumbnail(message, callback)`：下载缩略图。
- `downloadAttachment(message, callback)`：下载 `remotePath` 对应的图片附件。`isOriginalImage === true` 时为原图；为 `false` 时下载发送方压缩后上传的大图。
- `downloadBigImage(message, callback)`：下载大图。图片附件本身已为大图时，通常无需重复下载。

示例代码如下所示：

```typescript
const messageListener: ChatMessageEventListener = {
  onMessagesReceived(messages: ChatMessage[]): void {
    for (const message of messages) {
      if (message.body.type !== ChatMessageType.IMAGE) {
        continue;
      }

      const callback: ChatMessageStatusCallback = {
        onSuccess(updatedMessage: ChatMessage): void {
          // 附件下载成功，以回调返回的消息对象为准
          console.log('附件下载成功：', updatedMessage.msgId);
        },
        onError(localMsgId: string, error: ChatError): void {
          // 附件下载失败
          console.error('附件下载失败：', localMsgId, error);
        },
        onProgress(localMsgId: string, progress: number): void {
          // 附件下载进度
          console.log('附件下载进度：', localMsgId, progress);
        },
      };

      // 下载图片附件：isOriginalImage 为 true 时为原图
      void ChatClient.getInstance().chatManager
        .downloadAttachment(message, callback)
        .catch((error: unknown) => {
          console.error('发起附件下载失败：', error);
        });

      // 如需下载大图，将上面的下载调用替换为以下代码
      // void ChatClient.getInstance().chatManager
      //   .downloadBigImage(message, callback)
      //   .catch((error: unknown) => {
      //     console.error('发起大图下载失败：', error);
      //   });
    }
  },
};

// 注册消息监听器
ChatClient.getInstance().chatManager.addMessageListener(messageListener);
```

默认开启自动下载缩略图时，不应仅因回调时路径暂时为空就立即重复下载；先等待自动下载完成，失败后再按需重试。

3. 通过 `ChatImageMessageBody` 读取图片附件、大图和缩略图的地址或路径：

```typescript
function readImagePaths(message: ChatMessage): void {
  if (message.body.type !== ChatMessageType.IMAGE) return;
  const body = message.body as ChatImageMessageBody;

  // 图片附件地址和路径；isOriginalImage 为 true 时附件为原图
  const imageRemotePath = body.remotePath;
  const imageLocalPath = body.localPath;

  // 大图地址和路径
  const bigImageRemotePath = body.bigImageRemotePath;
  const bigImageLocalPath = body.bigImageLocalPath;

  // 缩略图地址和路径
  const thumbnailRemotePath = body.thumbnailRemotePath;
  const thumbnailLocalPath = body.thumbnailLocalPath;

  console.log({
    imageRemotePath, imageLocalPath,
    bigImageRemotePath, bigImageLocalPath,
    thumbnailRemotePath, thumbnailLocalPath,
  });
}
```

除了上述图片资源的地址和路径，图片消息体还提供以下主要属性：

| 属性 | 类型 | 描述 |
| :--- | :--- | :--- |
| `fileStatus` | `ChatDownloadStatus` | 图片附件下载状态。 |
| `bigImageDownloadStatus` | `ChatDownloadStatus \| undefined` | 大图下载状态。 |
| `thumbnailStatus` | `ChatDownloadStatus` | 缩略图下载状态；当前 Android 图片桥接未完整回传此字段，不应单独据此判断下载结果。 |
| `isOriginalImage` | `boolean \| undefined` | 图片附件是否为未经压缩的原图。 |
| `width` / `height` | `number` | 图片宽高，单位为像素。 |

`ChatDownloadStatus` 包括 `PENDING`、`DOWNLOADING`、`SUCCESS` 和 `FAILED`。以下载成功回调及实际文件可用性确认完成。

### 接收 GIF 图片消息

GIF 消息仍为 `ChatMessageType.IMAGE`，缩略图和附件下载方法与普通图片相同，详见 [接收图片消息](#接收图片消息)。

// TODO：研发确认
:::notice
虽然 `ChatImageMessageBody` 声明了可选属性 `isGif`，React Native SDK 5.0.0 的 Android 和 iOS 图片消息序列化都未将原生 GIF 标记回传给 JavaScript；缺失时模型默认设为 `false`。因此不能仅凭 `body.isGif === false` 判断消息不是 GIF。
:::

业务需要可靠区分 GIF 时，可在发送时通过 `attributes` 约定资源格式，或在下载后检查文件格式。文件扩展名只能作为提示，不应当作可靠的格式校验。以下示例读取业务侧约定的字段，字段不是 SDK 自动生成：

```typescript
const messageListener: ChatMessageEventListener = {
  onMessagesReceived(messages: ChatMessage[]): void {
    for (const message of messages) {
      if (message.body.type === ChatMessageType.IMAGE) {
        // imageFormat 为业务约定字段，需由发送方设置
        if (message.attributes.imageFormat === 'gif') {
          // 根据业务情况处理 GIF 消息，例如下载并展示该消息
        }
      }
    }
  },
};

// 注册消息监听器
ChatClient.getInstance().chatManager.addMessageListener(messageListener);
```

### 接收视频消息

收到视频消息后，通常会先在聊天界面展示视频缩略图；当用户点击消息时，再下载或播放视频原文件。

接收视频消息的流程如下：

1. 接收方收到视频消息时，SDK 按 `isAutoDownload` 决定是否自动下载缩略图，默认开启；关闭后调用 `downloadThumbnail`。视频缩略图的下载策略与图片缩略图一致。详见 [设置图片缩略图自动下载](#接收图片消息)。
2. 接收方在 `onMessagesReceived` 中识别 `ChatMessageType.VIDEO`。接收方可根据业务需要选择使用缩略图，或进一步下载视频原文件。
   - 如果只需要在会话列表或聊天界面展示预览图，可优先使用缩略图。
   - 如果需要播放视频，调用 `downloadAttachment`。
  
3. 为避免重复下载，建议优先检查本地是否已存在对应的视频文件或缩略图；如果本地已有可用资源，可直接复用。

以下示例演示下载视频文件，并通过 `callback` 处理下载结果：

```typescript
// 下载视频文件
function downloadVideo(message: ChatMessage): void {
  const callback: ChatMessageStatusCallback = {
    onSuccess(updatedMessage: ChatMessage): void {
      // 视频下载成功，以回调返回的消息对象为准
    },
    onProgress(localMsgId: string, progress: number): void {
      // 视频下载进度
    },
    onError(localMsgId: string, error: ChatError): void {
      // 视频下载失败
    },
  };

  // 下载附件
  void ChatClient.getInstance().chatManager
    .downloadAttachment(message, callback)
    .catch((error: unknown) => {
      console.error('发起视频下载失败：', error);
    });
}
```

4. 从 `ChatVideoMessageBody` 读取视频原文件和缩略图地址。以下示例读取当前消息对象中的地址；下载成功后，请对回调返回的 `updatedMessage` 执行相同操作，读取最新本地路径：

```typescript
if (message.body.type === ChatMessageType.VIDEO) {
  const videoBody = message.body as ChatVideoMessageBody;

  // 获取视频文件的服务端地址
  const videoRemotePath = videoBody.remotePath;

  // 获取视频缩略图的服务端地址
  const thumbnailRemotePath = videoBody.thumbnailRemotePath;

  // 获取视频文件的本地路径
  const videoLocalPath = videoBody.localPath;

  // 获取视频缩略图的本地路径
  const thumbnailLocalPath = videoBody.thumbnailLocalPath;
}
```

其他主要属性如下：

| 属性 | 类型 | 描述 |
| :--- | :--- | :--- |
| `fileStatus` | `ChatDownloadStatus` | 视频文件下载状态。 |
| `thumbnailStatus` | `ChatDownloadStatus` | 缩略图下载状态。 |
| `duration` | `number` | 视频时长，单位为秒。 |
| `width` / `height` | `number` | 视频尺寸相关信息，单位为像素；具体映射由平台原生 SDK 提供。 |

### 接收文件消息

1. 接收方在 `onMessagesReceived` 中识别文件消息，按业务需要调用 `downloadAttachment` 下载。

```typescript
// 下载文件
function downloadFile(message: ChatMessage): void {
  const callback: ChatMessageStatusCallback = {
    onSuccess(updatedMessage: ChatMessage): void {
      // 文件下载成功，以回调返回的消息对象为准
    },
    onProgress(localMsgId: string, progress: number): void {
      // 文件下载进度
    },
    onError(localMsgId: string, error: ChatError): void {
      // 文件下载失败
    },
  };

  // 下载附件
  void ChatClient.getInstance().chatManager
    .downloadAttachment(message, callback)
    .catch((error: unknown) => {
      console.error('发起文件下载失败：', error);
    });
}
```

2. 通过 `ChatFileMessageBody` 获取文件附件的服务端地址或本地路径：

```typescript
if (message.body.type === ChatMessageType.FILE) {
  const fileBody = message.body as ChatFileMessageBody;

  // 获取文件附件的服务端地址
  const fileRemotePath = fileBody.remotePath;

  // 获取文件附件的本地路径
  const fileLocalPath = fileBody.localPath;
}
```

## 接收位置消息

接收位置消息与文本消息一致，详见 [接收文本消息](#接收文本消息)。

接收方收到位置消息时，识别 `ChatMessageType.LOCATION` 后，读取 `ChatLocationMessageBody` 的经纬度和地址，并通过业务侧地图组件展示。

React Native SDK 的 `latitude` 和 `longitude` 类型为 `string`。地图组件需要数字时，应自行转换并检查有效性：

```typescript
function readLocation(message: ChatMessage): void {
  if (message.body.type !== ChatMessageType.LOCATION) return;
  const body = message.body as ChatLocationMessageBody;
  const latitude = Number(body.latitude);
  const longitude = Number(body.longitude);
  if (!body.latitude || !body.longitude ||
      !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    console.warn('位置坐标无效');
    return;
  }
  console.log('位置：', latitude, longitude, body.address);
}
```

## 接收透传消息

透传消息可视为一条指令，通知对方执行某种业务操作。应用自行定义和处理 `ChatCmdMessageBody#action`。以 `em_` 和 `easemob::` 开头的 action 为内部保留字段，不要使用。

:::tip
透传消息不支持撤回，不保存到本地数据库，也不会创建本地会话，通常不在聊天 UI 展示。
:::

透传消息应在 `onCmdMessagesReceived` 中处理，不要依赖普通消息回调重复收到同一条指令。

```typescript
const manager = ChatClient.getInstance().chatManager;
const commandListener: ChatMessageEventListener = {
  onCmdMessagesReceived: (messages) => {
    for (const message of messages) {
      if (message.body.type !== ChatMessageType.CMD) continue;
      const body = message.body as ChatCmdMessageBody;
      console.log('收到业务指令：', body.action, message.attributes);
    }
  },
};
manager.addMessageListener(commandListener);

// 页面或组件销毁时执行
// manager.removeMessageListener(commandListener);
```

## 接收自定义类型消息

通过自定义消息的事件名和业务参数处理红包、订单等业务。接收方式与文本消息相同，在 `onMessagesReceived` 中识别 `ChatMessageType.CUSTOM`。

`ChatCustomMessageBody` 的 `event` 属性表示自定义事件，`params` 属性表示自定义参数。`params` 为可选的 `Record<string, string>` 类型，其中每个参数值均为字符串。如需传递对象或数组，应先序列化为字符串，接收后再解析。

```typescript
function readCustomMessage(message: ChatMessage): void {
  if (message.body.type !== ChatMessageType.CUSTOM) return;
  const body = message.body as ChatCustomMessageBody;
  console.log('自定义事件：', body.event);
  console.log('业务参数：', body.params ?? {});
}
```

## 接收合并消息

接收合并消息与接收普通消息的操作相同，应用在 `ChatMessageEventListener#onMessagesReceived` 回调中识别 `ChatMessageType.COMBINE` 消息。

- 对于不支持合并消息的 SDK 版本，该类消息会被解析为文本消息，消息内容为 `compatibleText` 携带的内容，其他字段会被忽略。
- 合并消息实际上是一种附件消息。收到合并消息后，可以调用 `ChatManager#fetchCombineMessageDetail` 下载并解析合并消息附件，获取原始消息列表。
- 首次调用该方法时，SDK 会下载并解析合并消息附件，并通过返回的 `Promise<ChatMessage[]>` 提供其中包含的原始消息列表。
- 后续调用该方法时：
  - 若合并消息附件已存在，SDK 会直接解析附件并返回原始消息列表。
  - 若合并消息附件不存在，SDK 会先下载附件，再解析并返回原始消息列表。

将消息体转换为 `ChatCombineMessageBody` 后，可以读取合并消息的标题 `title`、摘要 `summary` 和兼容文本 `compatibleText`。

```typescript
// 下载并解析合并消息附件
ChatClient.getInstance().chatManager
  .fetchCombineMessageDetail(combineMessage)
  .then((messages: ChatMessage[]) => {
    // 处理并展示消息列表
  })
  .catch((error: unknown) => {
    // 处理出错信息
    console.error('下载并解析合并消息失败：', error);
  });
```

原始消息中的附件如需另行下载，可使用 `downloadAttachmentInCombine` 或 `downloadThumbnailInCombine`，不要把仅存在于合并附件中的消息当作普通本地消息处理。

## 更多

### 消息接收回调返回发送成功的消息

初始化时设置 `ChatOptions#messagesReceiveCallbackIncludeSend: true` 后，发送成功的消息也可通过 `onMessagesReceived` 返回，默认值为 `false`。应用应按消息 ID 去重，并区分消息方向。

### 判断消息是否为聊天室广播消息

对于聊天室消息，可通过 `ChatMessage#isBroadcast` 判断是否为 [REST API 发送的聊天室全局广播消息](/document/server-side/broadcast_to_chatrooms.html)。

### 消息附件下载鉴权

环信即时通讯 IM 支持消息附件下载鉴权功能。该功能默认关闭，如要开通需联系环信商务。该功能开通后，用户必须调用 SDK 的 `ChatManager#downloadAttachment(message, callback)` 等下载接口下载消息附件。

下载失败时，应检查功能开通与鉴权要求、连接状态、附件是否已过期或被撤回，以及本地文件访问权限；先区分调用异常与下载结果回调，再按需重试。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`addMessageListener`](#监听消息事件) / [`removeMessageListener`](#监听消息事件) | `ChatManager` | 注册和移除消息监听器。 |
| [`onMessagesReceived`](#接收文本消息) / [`onCmdMessagesReceived`](#接收透传消息) | `ChatMessageEventListener` | 接收普通消息和透传消息。 |
| [`downloadThumbnail`](#接收图片消息) | `ChatManager` | 下载图片或视频缩略图。 |
| [`downloadBigImage`](#接收图片消息) | `ChatManager` | 下载图片大图。 |
| [`downloadAttachment`](#接收附件消息) | `ChatManager` | 下载图片、语音、视频或文件附件。 |
| [`fetchCombineMessageDetail`](#接收合并消息) | `ChatManager` | 下载并解析合并消息。 |
| [`downloadAttachmentInCombine`](#接收合并消息) / [`downloadThumbnailInCombine`](#接收合并消息) | `ChatManager` | 下载合并消息中的附件或缩略图。 |
| [`isAutoDownload`](#接收图片消息) | `ChatOptions` | 配置缩略图自动下载。 |
| [`messagesReceiveCallbackIncludeSend`](#消息接收回调返回发送成功的消息) | `ChatOptions` | 是否在接收回调返回发送成功的消息。 |
