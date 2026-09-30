# 发送消息

## 功能说明

环信即时通讯 IM HarmonyOS SDK 通过 `ChatMessage` 创建消息，并通过 `ChatManager` 发送消息。SDK 支持文本、图片、GIF、语音、视频、文件、位置、透传、自定义和合并消息，可用于单聊、群聊和聊天室。

- 对于单聊，默认支持陌生人之间发送消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要 [开启好友关系检查](/product/console/basic_user.html#好友关系检查)。
- 对于群组和聊天室，用户每次只能向所属的单个群组或聊天室发送消息。
- 关于消息发送控制，详见 [单聊](/product/message_single_chat.html#单聊消息发送控制)、[群组聊天](/product/message_group.html#群组消息发送控制) 和 [聊天室](/product/message_chatroom.html#聊天室消息发送控制) 的相关文档。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 发送消息统一流程

各类消息均按照以下流程发送：

1. 调用 `ChatMessage` 对应的消息创建方法，设置消息内容和目标会话 ID。
2. 设置会话类型。单聊默认为 `ChatType.Chat`；群聊和聊天室需分别设置为 `ChatType.GroupChat` 和 `ChatType.ChatRoom`。
3. 按业务需要设置扩展字段、已读回执、聊天室消息优先级或回调环境等可选属性。
4. 调用 `ChatMessage#setMessageStatusCallback` 监听发送结果和附件上传进度。
5. 调用 `ChatManager#sendMessage` 发送消息。

## 通用消息创建参数

HarmonyOS SDK 通过 `ChatMessage` 的不同静态方法创建各类消息。不同消息类型的创建方法参数并不完全相同；创建消息后，还可以通过 `ChatMessage` 提供的方法设置会话类型、扩展字段以及其他可选属性。

| 参数或属性 | HarmonyOS 设置方式 | 是否必需 | 适用场景 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| 目标会话 ID | 各 `create*SendMessage()` 方法的 `to` 参数 | 必需 | 所有消息 | 单聊时传入对端用户 ID，群聊时传入群组 ID，聊天室时传入聊天室 ID。 |
| 消息内容 | 各消息创建方法的内容参数，或 `ChatMessage#setBody` | 必需 | 所有消息 | 参数随消息类型而不同，例如文本内容、附件路径、位置坐标、透传命令或自定义事件。 |
| 会话类型 | `ChatMessage#setChatType` | 群聊和聊天室必需 | 所有消息 | 单聊、群聊和聊天室分别设置为 `ChatType.Chat`、`ChatType.GroupChat` 和 `ChatType.ChatRoom`。默认值为 `ChatType.Chat`。 |
| 扩展字段 | `ChatMessage#setExt` | 可选 | 所有消息 | 传入 `Map<string, MessageExtType>`。字段值支持字符串、布尔值、数值、对象和数组；对象和数组由 SDK 序列化为 JSON 字符串。扩展字段会计入消息大小限制。 |
| 仅在线投递 | `ChatMessage#deliverOnlineOnly` | 可选 | 所有消息 | 设置为 `true` 时，消息仅投递给在线用户；接收方离线时消息会被丢弃。 |
| 回调路由环境 | `ChatMessage#setWebhookEnv` | 可选 | 所有消息 | 设置 Webhook 回调环境标识，服务端根据该值匹配回调路由。 |
| 聊天室消息优先级 | `ChatMessage#setPriority` | 可选 | 聊天室消息 | 可选 `PriorityHigh`、`PriorityNormal` 和 `PriorityLow`，默认值为 `PriorityNormal`。 |
| 定向接收成员 | `ChatMessage#setReceiverList` | 可选 | 群聊和聊天室消息 | 设置群聊或聊天室消息的指定接收成员列表。是否可用还受相应服务端功能配置和使用限制约束。 |
| 是否需要已读回执 | `ChatMessage#setIsNeedReadReceipt` | 可选 | 单聊和群聊消息 | 标记该消息是否需要已读回执。接收方发送已读回执前，该属性必须为 `true`；聊天室不支持消息已读回执。 |

## 接口频率限制

默认情况下，SDK 不限制单个用户发送消息的频率。如果已联系环信商务配置单用户发送频率限制，当用户在单聊、群聊或聊天室中的发送频率超过上限时，SDK 会返回错误码 `509`（`ChatError#MESSAGE_CURRENT_LIMITING`）。

## 发送文本消息

#### 发送流程

1. 调用 `ChatMessage#createTextSendMessage` 创建文本消息。

   创建消息时依次传入目标会话 ID 和文本内容。单聊、群聊和聊天室的目标会话 ID 分别为对端用户 ID、群组 ID 和聊天室 ID。

   创建消息后，可按需设置扩展字段、目标翻译语言、仅在线投递、定向接收成员和消息优先级等属性。部分属性仅适用于特定会话类型：

   - `ChatMessage#setReceiverList` 仅适用于群聊和聊天室定向消息。
   - `ChatMessage#setPriority` 仅适用于聊天室消息。
   - `ChatMessage#setIsNeedReadReceipt` 适用于单聊和群聊消息，不支持聊天室。
   - 群聊和聊天室消息需要通过 `ChatMessage#setChatType` 设置对应的会话类型。

2. 调用 `ChatManager#sendMessage` 发送文本消息。

   如需获取发送结果，可在发送前调用 `ChatMessage#setMessageStatusCallback` 设置回调。

```typescript
// 单聊传入对端用户 ID，群聊传入群组 ID，聊天室传入聊天室 ID。
let message = ChatMessage.createTextSendMessage(conversationId, 'Hello!');
if (!message) {
  return;
}

// 设置会话类型：单聊、群聊和聊天室分别为 ChatType.Chat、ChatType.GroupChat 和 ChatType.ChatRoom。
// 默认为单聊。
message.setChatType(ChatType.Chat);

message.setMessageStatusCallback({
  onSuccess: (): void => {
    // 消息发送成功。
  },
  onError: (errorCode: number, errorMessage: string): void => {
    // 消息发送失败，根据错误码和错误信息处理。
  },
  onProgress: (progress: number): void => {
    // 文本消息通常不涉及附件上传进度。
  }
});

ChatClient.getInstance().chatManager()?.sendMessage(message);
```

#### 关键参数和属性

| 参数或属性 | 类型 | 设置方式 | 必填/可选 | 适用场景 | 说明 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 文本内容 | `string` | `createTextSendMessage` 的 `message` 参数 | 必填 | 文本消息 | 文本消息的正文，不可为空。 |
| 目标会话 ID | `string` | `createTextSendMessage` 的 `to` 参数 | 必填 | 所有会话类型 | 单聊时为对端用户 ID，群聊时为群组 ID，聊天室时为聊天室 ID。 |
| 会话类型 | `ChatType` | `setChatType` | 群聊和聊天室必填 | 所有会话类型 | 分别为 `Chat`、`GroupChat` 和 `ChatRoom`，默认值为 `Chat`。 |
| 目标翻译语言 | `string \| Array<string>` | `TextMessageBody#setTargetLanguages` | 可选 | 文本消息 | 从消息中获取 `TextMessageBody` 后设置目标语言代码。 |
| 扩展字段 | `Map<string, MessageExtType>` | `setExt` | 可选 | 业务扩展信息 | 用于携带业务附加信息，会计入消息大小限制。 |
| 仅在线投递 | `boolean` | `deliverOnlineOnly` | 可选 | 瞬时消息、状态通知 | 设置为 `true` 时仅投递给在线用户。 |
| 回调路由环境 | `string` | `setWebhookEnv` | 可选 | 多环境回调路由 | 设置 Webhook 回调环境标识。 |
| 定向接收成员 | `Array<string>` | `setReceiverList` | 可选 | 群聊、聊天室定向消息 | 指定群聊或聊天室消息的接收成员。 |
| 是否需要已读回执 | `boolean` | `setIsNeedReadReceipt` | 可选 | 单聊、群聊 | 标记消息是否需要已读回执；聊天室不支持。 |
| 消息优先级 | `ChatroomMessagePriority` | `setPriority` | 可选 | 聊天室消息 | 设置聊天室消息优先级。 |

#### 带群消息已读回执和扩展字段的示例

单聊或群聊消息需要已读回执时，应在发送前为该条消息调用 `setIsNeedReadReceipt(true)`。

```typescript
let message = ChatMessage.createTextSendMessage(groupId, '大家好');
if (!message) {
  return;
}
// 设置会话类型：单聊、群聊和聊天室分别为 ChatType.Chat、ChatType.GroupChat 和 ChatType.ChatRoom。
// 默认为单聊。
message.setChatType(ChatType.GroupChat);

let ext = new Map<string, MessageExtType>();
ext.set('bizType', 'announcement');
message.setExt(ext);

message.setIsNeedReadReceipt(true);
ChatClient.getInstance().chatManager()?.sendMessage(message);
```

## 发送附件消息

除文本消息外，SDK 还支持发送附件类型消息，包括语音、图片、视频和文件消息。

#### 发送流程

发送附件消息分为以下两步：

1. 创建并发送附件类型消息。附件工厂方法会检查本地文件路径；路径不可访问时返回 `undefined`。
2. SDK 将附件上传至环信服务器。你也可以 [上传消息附件至自有服务器](#上传消息附件至自有服务器)。

#### 资源处理说明

默认情况下，调用 `ChatManager#sendMessage` 后，SDK 会自动将本地附件上传至环信服务器，并自动下载接收到的附件。你可以通过 `ChatOptions#setAutoTransferMessageAttachments` 控制附件是否由 SDK 自动传输。消息附件大小和存储限制，详见 [消息附件限制说明](/product/limitation.html#消息存储)。

### 发送图片消息

图片消息通常涉及以下三类图片资源：

- 原图：发送方本地选择的原始图片文件，通常用于查看或保存原图。
- 大图：SDK 客户端基于原图进行等比压缩后上传的图片。压缩规则为：若图片短边大于 720 像素，则等比压缩至短边为 720 像素；若短边小于等于 720 像素，则保留原图尺寸，不做放大处理。此类图片通常用于聊天详情页展示。
- 缩略图：服务端基于原图进行等比压缩后的图片。压缩规则为：默认情况下，若图片短边大于 170 像素，则等比压缩至短边为 170 像素；若短边小于等于 170 像素，则保留原图尺寸，不做放大处理。缩略图的压缩方式和尺寸可在 [控制台进行配置](/product/console/basic_message.html#图片消息缩略图)。此类图片通常用于会话列表、聊天列表等轻量展示场景。

#### 发送流程

1. 获取图片的本地文件路径。
2. 调用 `ChatMessage#createImageSendMessage(to, filePath, false)` 创建普通图片消息。
3. 从消息中获取 `ImageMessageBody`，调用 `setSendOriginalImage` 选择上传原图或大图。
4. 调用 `ChatManager#sendMessage` 发送消息。默认情况下 SDK 自动上传图片附件，服务端生成缩略图。

```typescript
let message = ChatMessage.createImageSendMessage(conversationId, imagePath, false);
if (!message) {
  return;
}

// false 表示上传大图；true 表示上传原图。
let body = message.getBody() as ImageMessageBody;
body.setSendOriginalImage(false);

// 设置会话类型：单聊、群聊和聊天室分别为 ChatType.Chat、ChatType.GroupChat 和 ChatType.ChatRoom。
// 默认为单聊。
message.setChatType(ChatType.Chat);
ChatClient.getInstance().chatManager()?.sendMessage(message);
```

#### 关键参数

| 参数或属性 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `to` | `string` | 必填 | 目标会话 ID。 |
| `filePath` | `string` | 必填 | 图片的本地文件路径，路径必须可访问。 |
| `isGif` | `boolean` | 可选 | 是否为 GIF 图片。普通图片传 `false` 或省略。 |
| `sendOriginalImage` | `boolean` | 可选 | 通过 `ImageMessageBody#setSendOriginalImage` 设置。`true` 上传原图，`false` 上传大图，默认为 `false`。 |

### 发送 GIF 图片

GIF 图片消息是一种特殊的图片消息。GIF 发送时必须保留原始动画内容，**SDK 不压缩 GIF 原图**。

#### 发送流程

1. 调用 `ChatMessage#createImageSendMessage(to, filePath, true)` 创建 GIF 图片消息。
2. 调用 `ChatManager#sendMessage` 发送消息。SDK 会将图片上传至环信服务器，服务器自动生成图片缩略图。

```typescript
let message = ChatMessage.createImageSendMessage(to, gifPath, true);
if (!message) {
  return;
}
// 设置会话类型：单聊、群聊和聊天室分别为 ChatType.Chat、ChatType.GroupChat 和 ChatType.ChatRoom。
// 默认为单聊。
message.setChatType(ChatType.GroupChat);
ChatClient.getInstance().chatManager()?.sendMessage(message);
```

#### 关键参数

| 参数 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `to` | `string` | 必填 | 目标会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `filePath` | `string` | 必填 | GIF 图片的本地文件路径，路径必须可访问。 |
| `isGif` | `boolean` | 必填 | 传 `true`，标记为 GIF 图片并发送原图。 |

### 发送语音消息

#### 发送流程

1. 在应用层录制语音文件。
2. 调用 `ChatMessage#createVoiceSendMessage`，依次传入目标会话 ID、语音文件路径和语音时长，创建语音消息。
3. 调用 `ChatManager#sendMessage` 发送消息。SDK 默认将语音文件上传至环信服务器。

```typescript
let message = ChatMessage.createVoiceSendMessage(to, voicePath, duration);
if (!message) {
  return;
}
// 设置会话类型：单聊、群聊和聊天室分别为 ChatType.Chat、ChatType.GroupChat 和 ChatType.ChatRoom。
// 默认为单聊。
message.setChatType(ChatType.GroupChat);
ChatClient.getInstance().chatManager()?.sendMessage(message);
```

#### 关键参数

| 参数 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `to` | `string` | 必填 | 目标会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `filePath` | `string` | 必填 | 语音文件的本地路径，路径必须可访问。 |
| `duration` | `number` | 必填 | 语音时长，单位为秒。 |

### 发送视频消息

发送视频消息前，需要准备视频文件、视频时长以及可选的视频首帧缩略图。缩略图和时长主要用于消息展示。

#### 发送流程

1. 在应用层选取或录制视频，并准备视频文件路径、视频时长和可选的缩略图路径。
2. 调用 `ChatMessage#createVideoSendMessage(to, filePath, duration, imageThumbPath)` 创建视频消息。缩略图路径可省略；如需显示缩略图，应由应用层生成。
   
   创建消息时，需要传入视频文件的本地路径、缩略图的本地路径、视频时长以及接收方的用户 ID。若为群聊或聊天室消息，则分别传入群组 ID 或聊天室 ID。
3. 调用 `ChatManager#sendMessage` 发送消息。默认情况下，SDK 先上传附件，再发送消息。

```typescript
// getThumbPath 由应用层实现。
let thumbPath = getThumbPath(videoPath);
let message = ChatMessage.createVideoSendMessage(
  to,
  videoPath,
  duration,
  thumbPath
);
if (!message) {
  return;
}
// 设置会话类型：单聊、群聊和聊天室分别为 ChatType.Chat、ChatType.GroupChat 和 ChatType.ChatRoom。
// 默认为单聊。
message.setChatType(ChatType.GroupChat);
ChatClient.getInstance().chatManager()?.sendMessage(message);
```

#### 关键参数

| 参数 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `to` | `string` | 必填 | 目标会话 ID。 |
| `filePath` | `string` | 必填 | 视频文件的本地路径，路径必须可访问。 |
| `duration` | `number` | 必填 | 视频时长，单位为秒。 |
| `imageThumbPath` | `string` | 可选 | 视频缩略图的本地路径。传入后，SDK 会读取缩略图尺寸并写入消息体。 |

### 发送文件消息

#### 发送流程

1. 调用 `ChatMessage#createFileSendMessage`，依次传入目标会话 ID 和文件的本地路径。
2. 调用 `ChatManager#sendMessage` 发送消息。SDK 默认将文件上传至环信服务器。

```typescript
let message = ChatMessage.createFileSendMessage(to, filePath);
if (!message) {
  return;
}
// 设置会话类型：单聊、群聊和聊天室分别为 ChatType.Chat、ChatType.GroupChat 和 ChatType.ChatRoom。
// 默认为单聊。
message.setChatType(ChatType.GroupChat);
ChatClient.getInstance().chatManager()?.sendMessage(message);
```

#### 关键参数

| 参数 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `to` | `string` | 必填 | 目标会话 ID。 |
| `filePath` | `string` | 必填 | 文件的本地路径，路径必须可访问。 |

### 上传消息附件至自有服务器

若要将消息附件上传至自有服务器，而不是环信服务器，请执行以下操作：

1. 在 SDK 初始化前调用 `ChatOptions#setAutoTransferMessageAttachments(false)`。设置后，SDK 不再自动上传或下载消息附件。
2. 由应用上传附件，并将附件 URL、文件名和文件长度等信息写入消息体。
3. 使用 `ChatMessage#createSendMessage` 创建消息，再调用 `ChatManager#sendMessage` 发送。

```typescript
// SDK 初始化前关闭自动传输附件。ChatOptions 的构造参数需使用实际 App Key。
let options = new ChatOptions({ appKey: '<YourAppKey>' });
options.setAutoTransferMessageAttachments(false);
ChatClient.getInstance().init(context, options);

// urlPath 为应用上传图片后获得的 URL；localPathForPreview 应为可访问的本地路径。
function sendPrivateUrlImage(
  toUserId: string,
  urlPath: string,
  localPathForPreview: string
): void {
  let body = new ImageMessageBody(localPathForPreview);
  body.setRemoteUrl(urlPath);
  body.setFileName('IMG_111.png');
  // body.setFileLength(10000); // 可选，单位为字节。

  let message = ChatMessage.createSendMessage(toUserId, body, ChatType.Chat);
  message.setMessageStatusCallback({
    onSuccess: (): void => {},
    onError: (code: number, error: string): void => {},
    onProgress: (progress: number): void => {}
  });

  ChatClient.getInstance().chatManager()?.sendMessage(message);
}
```

:::tip
接收端可通过 `(message.getBody() as ImageMessageBody).getRemoteUrl()` 获取附件 URL。关闭 SDK 自动附件传输后，应用需自行实现附件下载和展示逻辑。
:::

## 发送位置消息

发送位置消息时，应用需要先集成第三方地图服务，获取位置的经纬度和地址信息。

#### 发送流程

1. 调用 `ChatMessage#createLocationSendMessage` 创建位置消息。
2. 调用 `ChatManager#sendMessage` 发送位置消息。

```typescript
let message = ChatMessage.createLocationSendMessage(
  to,
  latitude,
  longitude,
  locationAddress,
  buildingName
);
// 设置会话类型：单聊、群聊和聊天室分别为 ChatType.Chat、ChatType.GroupChat 和 ChatType.ChatRoom。
// 默认为单聊。
message.setChatType(ChatType.GroupChat);
ChatClient.getInstance().chatManager()?.sendMessage(message);
```

#### 关键参数

| 参数 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `to` | `string` | 必填 | 目标会话 ID。 |
| `latitude` | `number` | 必填 | 纬度。 |
| `longitude` | `number` | 必填 | 经度。 |
| `locationAddress` | `string` | 必填 | 位置的文字描述。 |
| `buildingName` | `string` | 可选 | 建筑物名称。 |

#### 逻辑说明

HarmonyOS SDK 只负责封装和发送位置消息，不提供地图定位或地图展示能力。应用需自行接入地图服务获取坐标，并在接收端根据业务需要展示位置。

## 发送透传消息

透传消息也称命令消息，可用于通知接收方执行自定义操作，例如更新头像或昵称。`action` 不能以 `em_` 或 `easemob::` 开头，这两个前缀为内部保留字段。

:::tip
- 透传消息发送后不支持撤回。
- 透传消息不会存入本地数据库，也不会创建本地会话，因此通常不在 UI 中显示。
:::

#### 发送流程

1. 使用 `CmdMessageBody` 创建透传消息体。
2. 调用 `ChatMessage#createSendMessage` 创建透传消息。
3. 调用 `ChatManager#sendMessage` 发送消息。

```typescript
let action = 'action1';
let body = new CmdMessageBody(action);

// 单聊、群聊和聊天室分别传 Chat、GroupChat 和 ChatRoom。
let message = ChatMessage.createSendMessage(to, body, ChatType.GroupChat);
ChatClient.getInstance().chatManager()?.sendMessage(message);
```

#### 关键参数

| 参数或属性 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `action` | `string` | 必填 | 命令动作，不能以 `em_` 或 `easemob::` 开头。 |
| `to` | `string` | 必填 | 目标会话 ID。 |
| `chatType` | `ChatType` | 必填 | 会话类型，分别为 `Chat`、`GroupChat` 和 `ChatRoom`。 |

## 发送自定义类型消息

你可以通过事件名称和键值对参数定义业务消息，例如礼物消息。

#### 发送流程

1. 使用 `CustomMessageBody` 创建自定义消息体，并按需设置参数。
2. 调用 `ChatMessage#createSendMessage` 创建自定义消息。
3. 调用 `ChatManager#sendMessage` 发送消息。

```typescript
let body = new CustomMessageBody('gift');
let params = new Map<string, string>();
params.set('giftId', 'gift_001');
body.setParams(params);

let message = ChatMessage.createSendMessage(to, body, ChatType.GroupChat);
ChatClient.getInstance().chatManager()?.sendMessage(message);
```

#### 关键参数

| 参数或属性 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `event` | `string` | 必填 | 自定义消息的事件类型，例如 `gift`。 |
| `params` | `Map<string, string>` | 可选 | 自定义消息携带的键值对参数。 |
| `to` | `string` | 必填 | 目标会话 ID。 |
| `chatType` | `ChatType` | 必填 | 会话类型，分别为 `Chat`、`GroupChat` 和 `ChatRoom`。 |

## 发送合并消息

SDK 支持将多条消息合并为一条消息进行转发。

#### 发送流程

1. 准备原始消息 ID 列表以及标题、概要和兼容文本。
2. 调用 `ChatMessage#createCombinedSendMessage` 创建合并消息。
3. 设置会话类型，然后调用 `ChatManager#sendMessage` 发送消息。

```typescript
let params = new CombineMessageParams();
params.title = 'A 和 B 的聊天记录';
params.summary = 'A：这是 A 的消息内容\nB：这是 B 的消息内容';
params.compatibleText = '当前版本不支持合并消息，请升级到最新版本';
// 添加原消息 ID。
params.messageIds = ['msgId1', 'msgId2'];

let message = ChatMessage.createCombinedSendMessage(receiverId, params);
// 设置会话类型：单聊、群聊和聊天室分别为 ChatType.Chat、ChatType.GroupChat 和 ChatType.ChatRoom。
// 默认为单聊。
message.setChatType(ChatType.GroupChat);

ChatClient.getInstance().chatManager()?.sendMessage(message);
```

#### 关键参数

| 属性或参数 | 类型 | 描述 |
| :--- | :--- | :--- |
| `title` | `string` | 合并消息的标题。 |
| `summary` | `string` | 合并消息的概要。 |
| `compatibleText` | `string` | 兼容不支持合并消息的旧版本；旧版本会将其解析为文本消息内容。 |
| `messageIds` | `Array<string>` | 原始消息 ID 列表，不可为空，最多包含 300 个消息 ID。 |
| `to` | `string` | 消息接收方。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |

#### 逻辑说明

:::tip
1. 合并转发支持嵌套，最多支持 10 层，每层最多包含 300 条消息。
2. 无论 `ChatOptions#setAutoTransferMessageAttachments` 设置为 `false` 还是 `true`，SDK 都会将合并消息附件上传至环信服务器。
3. 转发一条已收到的合并消息时，应使用转发单条消息的接口，详见 [转发单条消息](message_forward.html#转发单条消息)。
4. 合并消息不支持搜索。
:::

#### 使用建议

合并消息适用于转发聊天记录等场景。创建前应确认原始消息 ID 列表非空且不超过 300 条，并通过 `title`、`summary` 和 `compatibleText` 提供清晰的摘要及旧版本兼容提示。

## 发送过程回调

#### 使用说明

发送消息前，可调用 `ChatMessage#setMessageStatusCallback` 设置 `ChatCallback`，获取消息发送成功、发送失败以及附件上传进度。同一消息如需注册多个回调，可使用 `addMessageStatusCallback`，并在不需要时调用 `removeMessageStatusCallback`。

#### 示例代码

```typescript
let callback: ChatCallback = {
  onSuccess: (): void => {
    // 消息发送成功。
  },
  onError: (errorCode: number, errorMessage: string): void => {
    // 消息发送失败。
  },
  onProgress: (progress: number): void => {
    // 附件上传进度。
  }
};

message.setMessageStatusCallback(callback);
ChatClient.getInstance().chatManager()?.sendMessage(message);
```

#### 回调参数说明

| 回调 | 说明 |
| :--- | :--- |
| `onSuccess()` | 消息发送成功时触发。 |
| `onError(code, error)` | 消息发送失败时触发，返回错误码和错误信息。 |
| `onProgress(progress)` | 上传附件时触发；`progress` 表示上传进度百分比。无附件消息通常不会产生有效的上传进度。 |

#### 逻辑说明

`ChatManager#sendMessage` 本身不接收回调参数。应用应先为待发送的 `ChatMessage` 设置状态回调，再调用 `sendMessage`。同一个回调可用于更新消息发送状态和附件上传进度。

## 更多

#### 聊天室消息优先级与消息丢弃逻辑

对于聊天室消息，SDK 支持高、普通和低三种消息优先级：

- `ChatroomMessagePriority.PriorityHigh`：高优先级。
- `ChatroomMessagePriority.PriorityNormal`：普通优先级，默认值。
- `ChatroomMessagePriority.PriorityLow`：低优先级。

当聊天室消息并发量过大或发送频率过高时，服务器优先处理高优先级消息，并优先丢弃低优先级消息。消息优先级只能提高重要消息被优先处理的可能性，不能保证消息必达。

对于单个聊天室，默认每秒发送的消息数量超过 20 条时，可能触发消息丢弃逻辑：服务器优先丢弃低优先级消息；同一优先级的消息超过限制时，后发送的消息可能被丢弃。

```typescript
let message = ChatMessage.createTextSendMessage(roomId, 'Hi');
if (!message) {
  return;
}
// 设置会话类型：单聊、群聊和聊天室分别为 ChatType.Chat、ChatType.GroupChat 和 ChatType.ChatRoom。
// 默认为单聊。
message.setChatType(ChatType.ChatRoom);
message.setPriority(ChatroomMessagePriority.PriorityHigh);
ChatClient.getInstance().chatManager()?.sendMessage(message);
```

:::tip
`setPriority` 仅对聊天室消息有效，不适用于单聊和群聊消息。
:::

#### 语聊房麦位管理

你可以基于 [聊天室自定义属性](room_attributes.html) 实现语聊房麦位状态管理和多端同步。聊天室自定义属性采用 `Map<string, string>` 格式，因此结构化麦位信息需要先序列化为字符串，或将每个麦位保存为独立属性。

```typescript
let attributes = new Map<string, string>();
attributes.set(
  'seat_1',
  '{"userId":"user_001","state":"open","volume":0}'
);

ChatClient.getInstance().chatroomManager()?.setChatroomAttributes({
  chatroomId: roomId,
  attributeKeyOrMap: attributes,
  autoDelete: false,
  isForced: false
}).then((): void => {
  // 属性设置成功。
}).catch((error: ChatError): void => {
  // 属性设置失败。
});
```

聊天室内其他成员可通过 `ChatroomListener#onAttributesUpdate` 监听属性变化：

```typescript
let listener: ChatroomListener = {
  onAttributesUpdate: (
    roomId: string,
    attributeMap: Map<string, string>,
    from: string
  ): void => {
    // 解析本次更新的麦位数据并刷新界面。
  }
};

ChatClient.getInstance().chatroomManager()?.addListener(listener);
```

具体权限和限制，详见 [聊天室自定义属性](room_attributes.html)。

#### 获取发送附件消息的进度

发送图片、语音、视频或文件消息时，可通过 `ChatCallback#onProgress` 获取附件上传进度；`onSuccess` 和 `onError` 分别返回消息发送成功和失败事件。发送成功后，可通过原消息对象的 `getMsgId()` 获取消息 ID。

```typescript
message.setMessageStatusCallback({
  onProgress: (progress: number): void => {
    // 附件上传进度，取值范围为 0-100。
  },
  onSuccess: (): void => {
    let messageId = message.getMsgId();
    // 消息发送成功。
  },
  onError: (code: number, error: string): void => {
    // 消息发送失败。
  }
});

ChatClient.getInstance().chatManager()?.sendMessage(message);
```

:::tip
文本、位置、透传和自定义消息通常不涉及附件上传，`onProgress` 一般不会触发。应用更新 UI 时，应遵循 HarmonyOS 的 UI 线程模型。
:::

#### 发送消息前的内容审核

- 内容审核关注消息 body

[内容审核服务会关注消息 body 中指定字段的内容，不同类型的消息审核不同的字段](/value-added/moderation/moderation_mechanism.html)。若在这些字段中传入大量业务信息，可能影响审核效果。建议将业务信息放在消息扩展字段中。

- 设置发送方收到内容审核替换后的内容

默认情况下，内容审核替换后的内容仅下发至接收方。发送方如需同步接收替换内容，需联系环信商务开通权限，并在 SDK 初始化前调用 `ChatOptions#setUseReplacedMessageContents(true)`。该选项默认为 `false`；关闭时，发送方保留原始发送内容。

#### 消息大小和存储限制

各类消息的大小和存储限制，详见 [消息限制说明](/product/limitation.html#消息大小)。

#### 发消息时设置回调路由

回调路由允许你在同一个 App Key 下，将不同消息按回调环境分别投递到不同的回调地址。发送消息时，可通过 `ChatMessage#setWebhookEnv` 携带环境标识。服务器根据该标识匹配控制台中的 [回调路由规则](/product/console/basic_webhook.html#配置消息回调规则)，并将消息回调至对应的 [发送前回调](/document/server-side/callback_presending.html) 或 [发送后回调](/document/server-side/callback_postsending.html) 地址。

:::tip
目前，该功能仅面向国内 1 区和国内 2 区开放。
:::

**适用场景**

| 场景 | 说明 |
| :--- | :--- |
| 多环境隔离 | 同一 App Key 下区分开发、测试和生产环境。 |
| 灰度发布 | 将部分消息回调至新链路验证。 |
| 多业务线分流 | 不同业务模块回调至各自的审核、风控或同步服务。 |
| 降低发送前时延 | 避免消息先统一回调至一个入口，再由业务服务器二次转发。 |

**适用范围**

| 回调类型 | 生效范围 | 说明 |
| :--- | :--- | :--- |
| [发送前回调](/document/server-side/callback_presending.html) | 仅对 SDK 发送的消息生效，不支持群组或聊天室定向消息。 | 消息下发前，业务服务器可判断是否拦截或修改消息。 |
| [发送后回调](/document/server-side/callback_postsending.html) | 对 SDK 和 REST API 发送的消息均生效。 | 消息成功发送后通知业务服务器。 |

**工作流程**

1. 在控制台为发送前回调或发送后回调 [配置回调路由](/product/console/basic_webhook.html#配置消息回调规则)。
2. 客户端发送消息时，通过 `ChatMessage#setWebhookEnv` 设置回调环境标识。
3. 服务器根据消息中的环境标识匹配当前阶段的回调地址。
4. 命中有效路由后，服务器将回调请求发送至对应地址。

**示例代码**

`webhookEnv` 仅支持字母和数字，长度不超过 8 个字符。建议与控制台中的环境标识保持一致，例如 `dev`、`test` 或 `prod`。

```typescript
let message = ChatMessage.createTextSendMessage('toUser', 'hello');
if (!message) {
  return;
}

message.setWebhookEnv('test');
ChatClient.getInstance().chatManager()?.sendMessage(message);

// 未设置时返回 undefined。
let webhookEnv = message.getWebhookEnv();
```

**消息中的回调环境字段命中规则**

| 场景 | 路由结果 |
| :--- | :--- |
| 携带环境值且命中有效路由 | 按该环境值路由至对应的回调地址。 |
| 携带环境值但未命中有效路由 | 不触发回调，`default` 兜底配置不生效。 |
| 未携带环境值 | 自动路由至 `default` 环境对应的回调地址。 |
| 同一消息同时触发发送前与发送后回调 | 两个阶段必须使用相同的环境值。 |

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createTextSendMessage`](#发送文本消息) | `ChatMessage` | 创建文本消息。 |
| [`createImageSendMessage`](#发送图片消息) | `ChatMessage` | 创建普通图片或 GIF 图片消息。 |
| [`createVoiceSendMessage`](#发送语音消息) | `ChatMessage` | 创建语音消息。 |
| [`createVideoSendMessage`](#发送视频消息) | `ChatMessage` | 创建视频消息。 |
| [`createFileSendMessage`](#发送文件消息) | `ChatMessage` | 创建文件消息。 |
| [`createLocationSendMessage`](#发送位置消息) | `ChatMessage` | 创建位置消息。 |
| [`createSendMessage`](#发送透传消息) | `ChatMessage` | 根据消息体和会话类型创建待发送消息。 |
| [`createCombinedSendMessage`](#发送合并消息) | `ChatMessage` | 创建合并消息。 |
| [`deliverOnlineOnly`](#通用消息创建参数) | `ChatMessage` | 设置消息是否仅投递给在线用户。 |
| [`sendMessage`](#发送消息统一流程) | `ChatManager` | 发送消息。 |
| [`downloadAndParseCombineMessage`](#发送合并消息) | `ChatManager` | 下载并解析合并消息附件。 |
| [`setAutoTransferMessageAttachments`](#上传消息附件至自有服务器) | `ChatOptions` | 设置 SDK 是否自动上传和下载消息附件。 |
| [`setUseReplacedMessageContents`](#发送消息前的内容审核) | `ChatOptions` | 设置发送方是否接收内容审核替换后的消息内容。 |
