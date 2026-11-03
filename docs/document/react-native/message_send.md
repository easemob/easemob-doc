# 发送消息

## 功能说明

环信即时通讯 IM React Native SDK 通过 `ChatMessage` 创建消息，并通过 `ChatManager` 发送消息。SDK 支持文本、图片、GIF、语音、视频、文件、位置、透传、自定义和合并消息，可用于单聊、群聊和聊天室。

- 对于单聊，环信即时通讯 IM 默认支持陌生人之间发送消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要 [开启好友关系检查](/product/console/basic_user.html#好友关系检查)。
- 对于群组和聊天室，用户每次只能向所属的单个群组和聊天室发送消息。
- 关于消息发送控制，详见 [单聊](/product/message_single_chat.html#单聊消息发送控制)、[群组聊天](/product/message_group.html#群组消息发送控制) 和 [聊天室](/product/message_chatroom.html#聊天室消息发送控制) 的相关文档。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 发送消息统一流程

各类消息均按照以下流程发送：

1. 调用 `ChatMessage` 对应的消息创建方法，设置消息内容和目标会话 ID。
2. 设置会话类型。单聊默认为 `ChatMessageChatType.PeerChat`；群聊和聊天室需分别设置为 `GroupChat` 和 `ChatRoom`。SDK 可在创建消息时直接传入会话类型。
3. 按业务需要设置扩展字段、已读回执、聊天室消息优先级或回调环境等可选属性。
4. 创建 `ChatMessageStatusCallback`，监听发送结果和附件上传进度。
5. 调用 `ChatManager#sendMessage` 发送消息，并传入状态回调。

`sendMessage` 返回 `Promise<void>`。Promise 完成只表示原生层已受理调用，最终发送结果以 `onSuccess` 或 `onError` 为准。

本页示例使用以下导入，并提供文本消息示例复用的发送方法：

```typescript
// 设置消息发送状态回调
const messageStatusCallback: ChatMessageStatusCallback = {
  onProgress(localMsgId, progress) {
    // 附件上传进度，取值范围为 0-100
    console.log('附件上传进度：', localMsgId, progress);
  },
  onError(localMsgId, error) {
    // 消息发送失败，根据错误码和错误描述处理
    console.error(
      '消息发送失败：',
      localMsgId,
      error.code,
      error.description
    );
  },
  onSuccess(message) {
    // 消息发送成功，使用回调中的消息获取最终消息 ID
    console.log('消息发送成功：', message.msgId);
  },
};

async function sendMessageWithCallback(message: ChatMessage): Promise<void> {
  try {
    // 发送消息，并传入状态回调
    await ChatClient.getInstance().chatManager.sendMessage(
      message,
      messageStatusCallback
    );
  } catch (error: unknown) {
    // 处理原生发送调用本身的异常
    if (error instanceof ChatError) {
      console.error('发送调用失败：', error.code, error.description);
    } else {
      console.error('发送调用失败：', error);
    }
  }
}
```

## 通用消息创建参数

React Native SDK 通过 `ChatMessage` 的不同静态方法创建各类消息。不同消息类型的创建方法参数并不完全相同；创建消息后，还可以通过 `ChatMessage` 提供的属性设置会话类型、扩展字段以及其他可选属性。

| 参数或属性 | 类型 | 是否必需 | 适用场景 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| `targetId` | `string` | 是 | 所有消息 | 目标会话 ID。单聊时为对端用户 ID，群聊时为群组 ID，聊天室时为聊天室 ID。 |
| 消息内容参数 | 取决于消息类型 | 是 | 所有消息 | 例如文本内容、附件路径、位置坐标、透传命令或自定义事件。 |
| `chatType` | `ChatMessageChatType` | 群聊和聊天室必需 | 所有消息 | 单聊、群聊和聊天室分别设置为 `PeerChat`、`GroupChat` 和 `ChatRoom`。默认值为 `PeerChat`。 |
| `attributes` | `Record<string, any>` | 否 | 所有消息 | 添加业务自定义信息。支持字符串、布尔值、数值、JSON 对象和 JSON 数组等可序列化类型；扩展字段会计入消息大小限制。不要传入函数或 `symbol`。 |
| `deliverOnlineOnly` | `boolean` | 否 | 单聊和群聊的各类消息 | 设置为 `true` 时，消息仅投递给在线用户；接收方离线时消息会被丢弃。该功能不适用于聊天室，适用于输入状态、瞬时控制信息等场景。默认值为 `false`。 |
| `receiverList` | `string[]` | 否 | 群聊、聊天室 | 定向消息的接收成员列表。 |
| `isNeedReadReceipt` | `boolean` | 否 | 单聊、群聊 | 标记该消息是否需要已读回执。接收方发送已读回执前，消息的该属性必须为 `true`；聊天室不支持消息已读回执。默认值为 `false`。 |
| `messagePriority` | `ChatRoomMessagePriority` | 否 | 聊天室 | 设置聊天室消息的优先级，可选 `PriorityHigh`、`PriorityNormal` 和 `PriorityLow`，默认值为 `PriorityNormal`。 |
| `webhookEnv` | `string` | 否 | 所有消息 | 创建消息后设置 Webhook 回调环境标识，服务端根据该值匹配回调路由。 |
| `isChatThread` | `boolean` | 否 | 群组消息话题 | 在各消息创建方法的可选参数中设置。设置为 `true` 时，`targetId` 为消息话题 ID。 |

## 接口频率限制

默认情况下，SDK 不限制单个用户发送消息的频率。如果已联系环信商务配置单用户发送频率限制，当用户在单聊、群聊或聊天室中的发送频率超过上限时，SDK 会返回错误码 `509`。

## 发送文本消息

#### 发送流程

1. 调用 `ChatMessage#createTextMessage` 创建文本消息。

   创建消息时传入目标会话 ID、文本内容和会话类型。单聊、群聊和聊天室的目标会话 ID 分别为对端用户 ID、群组 ID 和聊天室 ID。单聊可以省略会话类型；群聊和聊天室必须分别传入 `ChatMessageChatType.GroupChat` 和 `ChatMessageChatType.ChatRoom`。

   创建消息后，可根据业务需要设置扩展字段、目标翻译语言、仅在线投递、定向接收成员和消息优先级等属性。部分属性仅适用于特定会话类型，例如：

   - `opt.receiverList` 设置群聊或聊天室的定向接收成员。
   - `ChatRoomMessagePriority` 设置聊天室消息优先级。仅适用于聊天室消息。
   - 将 `isNeedReadReceipt` 设置为 `true`，请求单聊或群聊消息的已读回执。
   - 设置 `messagePriority` 调整聊天室消息优先级。

2. 创建 `ChatMessageStatusCallback`，并调用 `ChatManager#sendMessage` 发送文本消息。

 通过 `onSuccess` 或 `onError` 判断最终发送结果；不要仅根据 `sendMessage` 的 `Promise` 完成状态判断发送成功。

创建和发送单聊文本消息的示例代码如下：

```typescript
// 调用前需完成 SDK 初始化和 Token 登录
async function sendTextMessage(conversationId: string): Promise<void> {
  // 创建文本消息：单聊传入对端用户 ID，群聊传入群组 ID，
  // 聊天室传入聊天室 ID
  // 创建时同时设置会话类型，单聊默认为 PeerChat；
  // 群聊和聊天室需分别传入 GroupChat 和 ChatRoom
  const message = ChatMessage.createTextMessage(
    conversationId,
    'Hello!',
    ChatMessageChatType.PeerChat
  );

  // 创建消息发送状态回调，在调用 sendMessage 时传入
  const callback: ChatMessageStatusCallback = {
    onSuccess(sentMessage) {
      // 消息发送成功，使用回调中的消息更新界面
      // sentMessage.msgId 为发送成功后的消息 ID
      console.log('消息发送成功：', sentMessage.msgId);
    },

    onError(localMsgId, error) {
      // 消息发送失败，使用 localMsgId 关联本地消息
      // 根据错误码和错误描述处理失败状态
      console.error(
        '消息发送失败：',
        localMsgId,
        error.code,
        error.description
      );
    },

    onProgress(localMsgId, progress) {
      // 文本消息通常不涉及附件上传进度
      // 附件消息的 progress 取值范围为 0-100
    },
  };

  try {
    // 发送消息，并传入状态回调
    await ChatClient.getInstance().chatManager.sendMessage(message, callback);

    // Promise 完成仅表示原生层已受理发送调用
    // 最终发送结果以 onSuccess 或 onError 为准
  } catch (error: unknown) {
    // 处理原生发送调用本身的异常
    if (error instanceof ChatError) {
      console.error('发送调用失败：', error.code, error.description);
    } else {
      console.error('发送调用失败：', error);
    }
  }
}

// 单聊示例：替换为接收方的用户 ID
void sendTextMessage('<target_user_id>');
```

#### 关键参数和属性

| 参数或属性 | 类型 | 设置方式 | 是否必需 | 适用场景 | 说明 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetId` | `string` | `createTextMessage` 的第一个参数 | 是 | 所有会话类型 | 单聊时为对端用户 ID，群聊时为群组 ID，聊天室时为聊天室 ID。 |
| `content` | `string` | `createTextMessage` 的第二个参数 | 是 | 文本消息 | 文本消息正文。正文和扩展字段都会计入消息大小限制。 |
| `chatType` | `ChatMessageChatType` | `createTextMessage` 的第三个参数 | 群聊和聊天室必需 | 所有会话类型 | 默认值为 `PeerChat`；群聊和聊天室分别传入 `GroupChat` 和 `ChatRoom`。 |
| `targetLanguageCodes` | `string[]` | 第四个参数中的可选属性 | 否 | 文本翻译 | 目标翻译语言代码。使用前需确认翻译服务及支持语言。 |
| `attributes` | `Record<string, any>` | 创建消息后赋值 | 否 | 业务扩展信息 | 字段值必须能通过 React Native 桥接序列化，且会计入消息大小限制。 |
| `deliverOnlineOnly` | `boolean` | 第四个参数中的可选属性 | 否 | 单聊、群聊的瞬时消息 | 默认值为 `false`。设置为 `true` 时，接收方离线则丢弃消息。 |
| `receiverList` | `string[]` | 第四个参数中的可选属性 | 否 | 群聊、聊天室定向消息 | 指定接收成员。是否可用还受服务端配置和使用限制约束。 |
| `isChatThread` | `boolean` | 第四个参数中的可选属性 | 否 | 群组消息话题 | 设置为 `true` 时，`targetId` 为消息话题 ID。 |
| `isNeedReadReceipt` | `boolean` | 创建消息后赋值 | 否 | 单聊、群聊 | 默认值为 `false`。接收方还需调用 `sendMessageReadReceipts` 发送回执。 |
| `messagePriority` | `ChatRoomMessagePriority` | 创建消息后赋值 | 否 | 聊天室 | 可设为高、普通或低优先级；不适用于单聊和群聊。 |
| `webhookEnv` | `string` | 创建消息后赋值 | 否 | 回调路由 | 仅支持字母和数字，长度不超过 8 个字符。 |

#### 带群消息已读回执和扩展字段的示例

对于带有业务属性的文本消息，可通过 `attributes` 添加扩展字段。

若需要单聊或群聊消息的已读回执，必须在发送前将当前消息的 `isNeedReadReceipt` 设置为 `true`。详见 [消息已读回执](message_receipt.html)。

```typescript
const groupMessage = ChatMessage.createTextMessage(
  '<group_id>',
  '请阅读群公告',
  ChatMessageChatType.GroupChat
);
// 添加业务扩展字段。
groupMessage.attributes = {
  businessType: 'announcement',
};
// 设置该消息需要已读回执。
groupMessage.isNeedReadReceipt = true;

// 发送消息。
await sendMessageWithCallback(groupMessage);
```

## 发送附件消息

除文本消息外，SDK 还支持发送附件类型消息，包括语音、图片、视频和文件消息。

#### 发送流程

发送附件消息分为以下两步：

1. 创建和发送附件类型消息。
2. SDK 将附件上传到环信服务器。另外，你也可以 [上传消息附件至自有服务器](#上传消息附件至自有服务器)。

#### 资源处理说明

默认情况下，调用 `ChatManager#sendMessage` 后，SDK 会自动将本地附件上传至环信服务器；接收方也可由 SDK 自动下载附件。你可以通过 `ChatOptions#serverTransfer` 控制附件是否由 SDK 自动传输，默认值为 `true`。消息附件大小和存储限制，详见 [消息附件限制说明](/product/limitation.html#消息存储)。

:::notice
附件路径必须在消息发送完成前持续可被原生层访问。对于相册、文件选择器或临时目录返回的资源，应确认访问权限和文件生命周期；不要把仅能在 JavaScript 层解析的资源标识直接作为附件路径。
:::

### 发送图片消息

图片消息通常涉及以下三类图片资源：

- 原图：发送方本地选择的原始图片文件，通常用于查看或保存原图。
- 大图：SDK 客户端基于原图进行等比压缩后上传的图片。压缩规则为：若图片短边大于 720 像素，则等比压缩至短边为 720 像素；若短边小于等于 720 像素，则保留原图尺寸，不做放大处理。此类图片通常用于聊天详情页展示。
- 缩略图：服务端基于原图进行等比压缩后的图片。压缩规则为：默认情况下，若图片短边大于 170 像素，则等比压缩至短边为 170 像素；若短边小于等于 170 像素，则保留原图尺寸，不做放大处理。缩略图的压缩方式和尺寸可在 [控制台进行配置](/product/console/basic_message.html#图片消息缩略图)。此类图片通常用于会话列表、聊天列表等轻量展示场景。

#### 发送流程

发送图片消息的流程如下：

1. 获取图片的本地路径或 URI，确保原生层可以访问。
2. 调用 `ChatMessage#createImageMessage` 创建图片消息。

   创建消息时，需要传入目标会话 ID、图片的本地路径和会话类型。单聊传入接收方用户 ID；群聊或聊天室分别传入群组 ID 或聊天室 ID。

   `sendOriginalImage` 参数用于控制实际上传的图片资源：`true` 表示 SDK 上传原图，`false` 表示上传压缩后的大图。建议根据图片质量和上传流量需求设置。

3. 调用 `ChatManager#sendMessage` 发送消息。

   如果 `ChatOptions#serverTransfer` 为 `true`，SDK 会自动上传图片附件。服务器自动生成缩略图。关于图片的上传进度，详见 [获取发送附件消息的进度](#获取发送附件消息的进度)。

创建和发送图片消息的示例代码如下所示：

```typescript
// 获取图片的本地文件路径，替换为图片选择器返回的可访问路径
const imagePath = '<native_accessible_image_path>';

if (!imagePath) {
  throw new Error('图片路径不能为空');
}

// 设置会话类型：单聊、群聊和聊天室分别为 PeerChat、GroupChat 和 ChatRoom。
// 以下以单聊为例，发送群聊或聊天室消息时，替换为对应类型。
const chatType = ChatMessageChatType.PeerChat;
// const chatType = ChatMessageChatType.GroupChat; // 群聊
// const chatType = ChatMessageChatType.ChatRoom;  // 聊天室

// 单聊传入对端用户 ID，群聊传入群组 ID，聊天室传入聊天室 ID
const targetId = '<target_id>';

// 创建图片消息
const imageMessage = ChatMessage.createImageMessage(
  targetId,
  imagePath,
  chatType,
  {
    displayName: 'photo.jpg',
    sendOriginalImage: false, // false 表示发送大图，true 表示发送原图
    width: 1920,
    height: 1080,
  }
);

// 发送图片消息，默认情况下 SDK 会自动上传图片附件
try {
  await ChatClient.getInstance().chatManager.sendMessage(imageMessage);
} catch (error: unknown) {
  console.error('发送调用失败：', error);
}
```

#### 关键参数

| 参数 | 类型 | 是否必需 | 说明 |
| :--- | :--- | :--- | :--- |
| `targetId` | `string` | 是 | 目标会话 ID。 |
| `filePath` | `string` | 是 | 原生层可访问的图片本地路径或 URI。 |
| `chatType` | `ChatMessageChatType` | 群聊和聊天室必需 | 会话类型，默认值为 `PeerChat`。 |
| `displayName` | `string` | 否 | 图片显示名称，建议包含文件扩展名。 |
| `thumbnailLocalPath` | `string` | 否 | 自定义缩略图的本地路径。 |
| `sendOriginalImage` | `boolean` | 否 | 是否发送原图，默认值为 `false`。 |
| `width` | `number` | 否 | 图片宽度，单位为像素。未传入时消息体中的默认值为 `0`。 |
| `height` | `number` | 否 | 图片高度，单位为像素。未传入时消息体中的默认值为 `0`。 |
| `fileSize` | `number` | 否 | 图片文件大小，单位为字节。 |
| `isGif` | `boolean` | 否 | 是否为 GIF 图片，默认值为 `false`。 |

### 发送 GIF 图片

GIF 图片消息是一种特殊的图片消息，与普通图片消息不同，**GIF 图片发送时不能压缩**。

#### 发送流程

发送 GIF 图片消息的过程如下：

1. 发送方调用 `ChatMessage#createImageMessage` 创建 GIF 图片消息，传入真实的 GIF 文件路径，并设置 `isGif: true` 和 `sendOriginalImage: true`。
2. 发送方调用 `ChatManager#sendMessage` 发送 GIF 图片消息。SDK 会将图片上传至环信服务器，服务器自动生成图片缩略图。

创建和发送 GIF 图片消息的示例代码如下所示：

```typescript
// filePath 为 GIF 图片的本地文件路径，必须能被原生层读取
// 会话类型默认为 PeerChat，群聊和聊天室需分别传入 GroupChat 和 ChatRoom
const gifMessage = ChatMessage.createImageMessage(
  '<target_user_id>',
  '<native_accessible_gif_path>',
  ChatMessageChatType.PeerChat,
  {
    displayName: 'animation.gif',
    isGif: true, // 标记为 GIF 图片
    sendOriginalImage: true, // 发送原图，避免压缩动画资源
  }
);

// 发送消息
try {
  await ChatClient.getInstance().chatManager.sendMessage(gifMessage);
} catch (error: unknown) {
  console.error('发送调用失败：', error);
}
```
// TODO：研发确认：是否需要写明这个
:::notice
React Native SDK 5.x 的 Android 桥接会将 `isGif` 显式传给底层 SDK；iOS 桥接通过本地文件创建图片消息体，不单独传递该标记。请确保 iOS 侧传入的文件本身是有效的 GIF 文件，并在双端验证动画展示效果。
:::

#### 关键参数

| 参数 | 类型 | 是否必需 | 说明 |
| :--- | :--- | :--- | :--- |
| `targetId` | `string` | 是 | 目标会话 ID。 |
| `filePath` | `string` | 是 | 原生层可访问的 GIF 文件路径。 |
| `chatType` | `ChatMessageChatType` | 群聊和聊天室必需 | 会话类型，默认值为 `PeerChat`。 |
| `displayName` | `string` | 否 | GIF 文件显示名称，建议保留 `.gif` 扩展名。 |
| `isGif` | `boolean` | 否 | 建议设置为 `true`。Android 桥接使用该值标记 GIF。 |
| `sendOriginalImage` | `boolean` | 否 | 建议设置为 `true`，避免按普通图片压缩。 |

### 发送语音消息

#### 发送流程

1. 发送语音消息前，在应用层录制语音文件。
2. 发送方调用 `ChatMessage#createVoiceMessage`，传入接收方用户 ID、语音文件的本地路径、会话类型和语音时长，创建语音消息。群聊或聊天室分别传入群组 ID 或聊天室 ID。
3. 发送方调用 `ChatManager#sendMessage` 发送消息。SDK 会将语音文件上传至环信服务器。

创建和发送语音消息的示例代码如下所示：

```typescript
// filePath 为语音文件的本地路径，duration 为语音时长，单位为秒
// 会话类型默认为 PeerChat，群聊和聊天室需分别传入 GroupChat 和 ChatRoom
const voiceMessage = ChatMessage.createVoiceMessage(
  '<target_user_id>',
  '<native_accessible_voice_path>',
  ChatMessageChatType.PeerChat,
  {
    displayName: 'voice.m4a',
    duration: 8, // 使用录音完成后得到的实际时长
  }
);

// 发送消息
try {
  await ChatClient.getInstance().chatManager.sendMessage(voiceMessage);
} catch (error: unknown) {
  console.error('发送调用失败：', error);
}
```

#### 关键参数

| 参数 | 类型 | 是否必需 | 说明 |
| :--- | :--- | :--- | :--- |
| `targetId` | `string` | 是 | 目标会话 ID。 |
| `filePath` | `string` | 是 | 原生层可访问的语音文件路径。 |
| `chatType` | `ChatMessageChatType` | 群聊和聊天室必需 | 会话类型，默认值为 `PeerChat`。 |
| `displayName` | `string` | 否 | 语音文件显示名称。 |
| `duration` | `number` | 否 | 语音时长，单位为秒；默认值为 `0`。建议传入准确值以便 UI 展示。 |
| `fileSize` | `number` | 否 | 语音文件大小，单位为字节。 |

### 发送视频消息

发送视频消息前，需要先准备视频文件、本地缩略图路径和视频时长。其中，缩略图和时长主要用于消息展示。

#### 发送流程

发送视频消息的流程如下：

1. 在应用层完成视频文件的选取或录制，并准备视频文件的本地路径、视频时长和缩略图路径。
2. 调用 `ChatMessage#createVideoMessage` 创建视频消息。

   创建消息时，需要传入目标会话 ID、视频文件的本地路径和会话类型，并在可选参数中设置缩略图路径和视频时长。单聊传入接收方用户 ID；群聊或聊天室分别传入群组 ID 或聊天室 ID。

   如果需要显示视频缩略图，你需要在应用层自行获取视频首帧，并将对应路径作为 `thumbnailLocalPath` 参数传入。

3. 调用 `ChatManager#sendMessage` 发送消息。

   发送过程中，SDK 会先上传视频附件，上传完成后再发送消息。你可以结合消息状态或相关回调感知上传进度以及发送结果。

创建和发送视频消息的示例代码如下所示：

```typescript
// 在应用层获取视频首帧，替换为生成的缩略图路径
const thumbnailPath = '<native_accessible_thumbnail_path>';

// 创建视频消息，duration 为视频时长，单位为秒
// 会话类型默认为 PeerChat，群聊和聊天室需分别传入 GroupChat 和 ChatRoom
const videoMessage = ChatMessage.createVideoMessage(
  '<target_user_id>',
  '<native_accessible_video_path>',
  ChatMessageChatType.PeerChat,
  {
    displayName: 'video.mp4',
    thumbnailLocalPath: thumbnailPath,
    duration: 30,
    width: 320,
    height: 180,
  }
);

// 发送消息
try {
  await ChatClient.getInstance().chatManager.sendMessage(videoMessage);
} catch (error: unknown) {
  console.error('发送调用失败：', error);
}
```

#### 关键参数

| 参数 | 类型 | 是否必需 | 说明 |
| :--- | :--- | :--- | :--- |
| `targetId` | `string` | 是 | 目标会话 ID。 |
| `filePath` | `string` | 是 | 原生层可访问的视频文件路径。 |
| `chatType` | `ChatMessageChatType` | 群聊和聊天室必需 | 会话类型，默认值为 `PeerChat`。 |
| `displayName` | `string` | 否 | 视频附件显示名称。 |
| `thumbnailLocalPath` | `string` | 否 | 视频缩略图的本地路径。 |
| `duration` | `number` | 否 | 视频时长，单位为秒；默认值为 `0`。 |
| `width` | `number` | 否 | 视频缩略图宽度，单位为像素。 |
| `height` | `number` | 否 | 视频缩略图高度，单位为像素。 |
| `fileSize` | `number` | 否 | 视频文件大小，单位为字节。 |

### 发送文件消息

#### 发送流程

1. 发送方调用 `ChatMessage#createFileMessage`，传入目标会话 ID、文件的本地路径和会话类型，创建文件消息。单聊传入接收方用户 ID；群聊或聊天室分别传入群组 ID 或聊天室 ID。
2. 发送方调用 `ChatManager#sendMessage` 发送文件消息。SDK 将文件上传至环信服务器。

创建和发送文件消息的示例代码如下所示：

```typescript
// filePath 为原生层可访问的本地文件路径
// 会话类型默认为 PeerChat，群聊和聊天室需分别传入 GroupChat 和 ChatRoom
const fileMessage = ChatMessage.createFileMessage(
  '<target_user_id>',
  '<native_accessible_file_path>',
  ChatMessageChatType.PeerChat,
  {
    displayName: 'project-materials.zip',
  }
);

// 发送消息
try {
  await ChatClient.getInstance().chatManager.sendMessage(fileMessage);
} catch (error: unknown) {
  console.error('发送调用失败：', error);
}
```

#### 关键参数

| 参数 | 类型 | 是否必需 | 说明 |
| :--- | :--- | :--- | :--- |
| `targetId` | `string` | 是 | 目标会话 ID。 |
| `filePath` | `string` | 是 | 原生层可访问的文件路径。 |
| `chatType` | `ChatMessageChatType` | 群聊和聊天室必需 | 会话类型，默认值为 `PeerChat`。 |
| `displayName` | `string` | 否 | 文件显示名称，建议包含文件扩展名。 |
| `fileSize` | `number` | 否 | 文件大小，单位为字节。 |

### 上传消息附件至自有服务器

发消息时，若要将消息附件上传至你自己的服务器（而非环信服务器），需执行以下操作：

1. 在 SDK 初始化时将 `ChatOptions#serverTransfer` 设置为 `false`，使 SDK **不再自动上传或下载附件**。设置后，`ChatManager#sendMessage` 将不再处理图片、视频等普通附件的自动处理与上传逻辑。
2. 图片上传到你的服务器后，将附件 URL 填入消息体，然后发送消息。

   以图片消息为例，上传后获取其 URL，通过 `ChatImageMessageBody#remotePath` 设置到消息体中，然后调用 `sendMessage` 发送消息。

以下示例以图片消息为例：

```typescript
// 1) 首次初始化 SDK 时关闭自动附件传输
const options = ChatOptions.withAppKey({
  appKey: '<your_app_key>',
  serverTransfer: false,
});

try {
  await ChatClient.getInstance().init(options);
} catch (error: unknown) {
  console.error('初始化失败：', error);
}

// 2) 业务层将图片上传至自有服务器，取得接收方可访问的 URL
// 上传逻辑由你实现，不属于 SDK API

// 3) 登录成功后，使用上传得到的 URL 和本地预览路径调用此方法
async function sendPrivateUrlImage(
  targetId: string,
  remoteUrl: string,
  localPathForPreview: string
): Promise<void> {
  // 创建图片消息，本地路径用于预览，实际附件下载由 remoteUrl 指定
  const message = ChatMessage.createImageMessage(
    targetId,
    localPathForPreview,
    ChatMessageChatType.PeerChat,
    { displayName: 'photo.jpg' }
  );

  // 设置图片远程 URL，指向你的服务器地址
  (message.body as ChatImageMessageBody).remotePath = remoteUrl;

  // 发送消息，复用前文定义的发送状态回调
  try {
    await ChatClient.getInstance().chatManager.sendMessage(
      message,
      messageStatusCallback
    );
  } catch (error: unknown) {
    console.error('发送调用失败：', error);
  }
}
```

:::tip
接收端收到消息后，可通过 `(message.body as ChatImageMessageBody).remotePath` 取到你的 URL，然后用你自己的下载和展示逻辑处理，因为你已关闭 SDK 自动附件传输。
:::

:::warning
关闭 `serverTransfer` 后，SDK 不再替应用完成普通附件的自动传输。自有服务器 URL 不应包含永久有效的敏感凭据；应用还需要处理访问授权、URL 过期、下载失败和隐私保护。合并消息附件仍会上传至环信服务器，不受该配置影响。
:::

## 发送位置消息

发送位置消息时，应用需要先集成第三方地图服务，获取位置的经纬度和地址信息。

#### 发送流程

1. 发送方调用 `ChatMessage#createLocationMessage` 创建位置消息。
2. 发送方调用 `ChatManager#sendMessage` 发送位置消息。

创建和发送位置消息的示例代码如下所示：

```typescript
// latitude 为纬度，longitude 为经度，address 为具体位置描述
// React Native SDK 公开 API 中的纬度和经度均使用十进制数字符串
// 会话类型默认为 PeerChat，群聊和聊天室需分别传入 GroupChat 和 ChatRoom
const locationMessage = ChatMessage.createLocationMessage(
  '<target_user_id>',
  '39.9042',
  '116.4074',
  ChatMessageChatType.PeerChat,
  { address: '北京市东城区' }
);

// 发送消息
try {
  await ChatClient.getInstance().chatManager.sendMessage(locationMessage);
} catch (error: unknown) {
  console.error('发送调用失败：', error);
}
```

#### 关键参数

| 参数 | 类型 | 是否必需 | 说明 |
| :--- | :--- | :--- | :--- |
| `targetId` | `string` | 是 | 目标会话 ID。 |
| `latitude` | `string` | 是 | 纬度的十进制数字符串，例如 `39.9042`。 |
| `longitude` | `string` | 是 | 经度的十进制数字符串，例如 `116.4074`。 |
| `chatType` | `ChatMessageChatType` | 群聊和聊天室必需 | 会话类型，默认值为 `PeerChat`。 |
| `address` | `string` | 否 | 位置的文字描述。 |

#### 逻辑说明

React Native SDK 只负责封装和发送位置消息，不提供地图定位或地图展示能力。应用需自行接入地图服务获取坐标，并在接收端根据业务需要展示位置。

React Native 双端桥接会将字符串类型的 `latitude` 和 `longitude` 转换为原生浮点数。请使用小数点作为小数分隔符，并在发送前校验坐标范围和格式。

## 发送透传消息

透传消息可视为命令消息，通过发送这条命令给对方，通知对方要进行的操作，收到消息可以自定义处理。

具体功能可以根据自身业务需求自定义，例如实现头像、昵称的更新等。另外，以 `em_` 和 `easemob::` 开头的 `action` 为内部保留字段，注意不要使用。

:::tip
- 透传消息发送后，不支持撤回。
- 透传消息不会存入本地数据库，也不会创建本地会话，因此通常不在 UI 中显示。
:::

#### 发送流程

发送透传消息的过程如下：

1. 发送方调用 `ChatMessage#createCmdMessage` 创建透传消息。
2. 发送方调用 `ChatManager#sendMessage` 发送透传消息。

创建和发送透传消息的示例代码如下所示：

```typescript
// action 为业务自定义命令，不能以 em_ 或 easemob:: 开头
const action = 'typing';

// 创建透传消息：单聊传入对端用户 ID，群聊传入群组 ID，聊天室传入聊天室 ID
// 会话类型默认为 PeerChat，群聊和聊天室需分别传入 GroupChat 和 ChatRoom
const commandMessage = ChatMessage.createCmdMessage(
  '<target_user_id>',
  action,
  ChatMessageChatType.PeerChat,
  { deliverOnlineOnly: true } // 输入状态只对在线用户有意义，显式设置为仅在线投递
);

// 发送消息
try {
  await ChatClient.getInstance().chatManager.sendMessage(commandMessage);
} catch (error: unknown) {
  console.error('发送调用失败：', error);
}
```

#### 关键参数

| 参数 | 类型 | 是否必需 | 说明 |
| :--- | :--- | :--- | :--- |
| `targetId` | `string` | 是 | 目标会话 ID。 |
| `action` | `string` | 是 | 命令动作。不能以 `em_` 或 `easemob::` 开头。 |
| `chatType` | `ChatMessageChatType` | 群聊和聊天室必需 | 会话类型，默认值为 `PeerChat`。 |
| `deliverOnlineOnly` | `boolean` | 否 | 是否仅在线投递。未传入时，消息对象中的默认值为 `false`。对于输入状态等瞬时事件，建议显式设置为 `true`。 |
| `receiverList` | `string[]` | 否 | 群聊或聊天室定向消息的接收成员列表。 |

## 发送自定义类型消息

你可以自己定义消息类型，方便业务处理，即首先设置一个消息类型名称，然后可添加多种自定义消息。

#### 发送流程

1. 发送方调用 `ChatMessage#createCustomMessage` 创建自定义消息。
2. 发送方调用 `ChatManager#sendMessage` 发送自定义消息。

创建和发送自定义消息的示例代码如下所示：

```typescript
// event 为自定义消息事件，例如礼物消息可以设置为 gift
const event = 'gift';

// params 为字符串键值对，类型为 Record<string, string>
const params: Record<string, string> = {
  giftId: 'flower',
  giftCount: '1',
};

// 创建自定义消息：单聊传入对端用户 ID，群聊传入群组 ID，聊天室传入聊天室 ID
// 会话类型默认为 PeerChat，群聊和聊天室需分别传入 GroupChat 和 ChatRoom
const customMessage = ChatMessage.createCustomMessage(
  '<target_user_id>',
  event,
  ChatMessageChatType.PeerChat,
  { params }
);

// 发送消息
try {
  await ChatClient.getInstance().chatManager.sendMessage(customMessage);
} catch (error: unknown) {
  console.error('发送调用失败：', error);
}
```

#### 关键参数

| 参数 | 类型 | 是否必需 | 说明 |
| :--- | :--- | :--- | :--- |
| `targetId` | `string` | 是 | 目标会话 ID。 |
| `event` | `string` | 是 | 自定义事件名称，例如 `gift`。 |
| `chatType` | `ChatMessageChatType` | 群聊和聊天室必需 | 会话类型，默认值为 `PeerChat`。 |
| `params` | `Record<string, string>` | 否；传入第四个 `opt` 参数时必需 | 自定义字符串键值对。没有业务参数时可省略整个 `opt` 参数，或传入 `{ params: {} }`。 |
| `receiverList` | `string[]` | 否 | 群聊或聊天室定向消息的接收成员列表。 |

## 发送合并消息

环信即时通讯 IM 支持将多个消息合并在一起进行转发。

#### 发送流程

你可以采取以下步骤进行消息的合并转发：

1. 利用原始消息列表创建一条合并消息。
2. 发送合并消息。

你可以调用 `ChatMessage#createCombineMessage` 创建一条合并消息，然后调用 `ChatManager#sendMessage` 发送该条消息。

创建和发送合并消息的示例代码如下所示：

```typescript
// 设置合并消息的标题、摘要和低版本兼容文本
const title = 'A和B的聊天记录';
const summary = 'A:这是A的消息内容\nB:这是B的消息内容';
const compatibleText = '您当前的版本不支持该消息，请升级到最新版本';

// 添加原始消息 ID，替换为待合并消息的实际 ID
const sourceMessageIds = [
  '<source_message_id_1>',
  '<source_message_id_2>',
];

// 创建合并消息，单聊传入对端用户 ID，群聊或聊天室传入对应会话 ID
// 群聊或聊天室消息需分别传入 GroupChat 或 ChatRoom
const combineMessage = ChatMessage.createCombineMessage(
  '<target_user_id>',
  sourceMessageIds,
  ChatMessageChatType.PeerChat,
  {
    title,
    summary,
    compatibleText,
  }
);

// 发送合并消息
try {
  await ChatClient.getInstance().chatManager.sendMessage(combineMessage);
} catch (error: unknown) {
  console.error('发送调用失败：', error);
}
```

#### 关键参数

创建合并消息时，需要设置以下参数：

| 参数 | 类型 | 是否必需 | 说明 |
| :--- | :--- | :--- | :--- |
| `targetId` | `string` | 是 | 消息接收方。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。群组消息话题需同时设置 `isChatThread: true`，此时为消息话题 ID。 |
| `messageIdList` | `string[]` | 是 | 合并消息的原始消息 ID 列表，不能为空，最多包含 300 个消息 ID。 |
| `chatType` | `ChatMessageChatType` | 群聊和聊天室必需 | 会话类型，默认值为 `PeerChat`。 |
| `title` | `string` | 否 | 合并消息标题。建议提供便于用户识别的标题。 |
| `summary` | `string` | 否 | 合并消息摘要。 |
| `compatibleText` | `string` | 否 | 合并消息的兼容文本。当支持合并消息的 SDK 向不支持合并消息的低版本 SDK 发送消息时，低版本 SDK 会将该属性解析为文本消息的消息内容。 |

#### 逻辑说明

:::tip
1. 合并转发最多支持 10 层嵌套，每层最多包含 300 条消息。
2. 无论 `ChatOptions#serverTransfer` 为 `true` 还是 `false`，SDK 都会将合并消息附件上传至环信服务器。
3. 转发一条已有的合并消息时，使用 [转发单条消息](message_forward.html#转发单条消息) 的方式。
4. 本地消息内容搜索支持匹配合并消息的标题和摘要，不会展开合并消息附件并搜索其中原始消息的内容。
:::

#### 使用建议

合并消息适用于转发聊天记录等场景。创建合并消息前，应确认原始消息 ID 列表非空且不超过 300 条；展示合并消息时，应使用 `title`、`summary` 和 `compatibleText` 提供清晰的摘要及低版本兼容提示。

React Native 接收端可调用 `ChatManager#fetchCombineMessageDetail(message)` 下载并解析合并消息中的原始消息，返回值为 `Promise<ChatMessage[]>`。请传入完整的合并消息对象，并处理 Promise 异常。

## 发送过程回调

#### 使用说明

`ChatManager#sendMessage` 的第二个参数为 `ChatMessageStatusCallback`。对于图片、语音、视频和文件等附件消息，`onProgress` 返回上传进度；`onSuccess` 和 `onError` 返回最终发送结果。

#### 示例代码

```typescript
const callback: ChatMessageStatusCallback = {
  onProgress(localMsgId, progress) {
    // 附件上传进度，取值范围为 0-100
    console.log('上传进度：', localMsgId, progress);
  },
  onError(localMsgId, error) {
    // 消息发送失败，根据错误码和错误描述处理
    console.error(
      '发送失败：',
      localMsgId,
      error.code,
      error.description
    );
  },
  onSuccess(message) {
    // 消息发送成功，message 为包含最终消息 ID 的消息对象
    console.log('发送成功：', message.msgId);
  },
};

const message = ChatMessage.createTextMessage(
  '<target_user_id>',
  '你好',
  ChatMessageChatType.PeerChat
);

try {
  // 发送消息时传入状态回调
  await ChatClient.getInstance().chatManager.sendMessage(message, callback);
} catch (error: unknown) {
  console.error('原生发送调用失败：', error);
}
```

#### 回调参数说明

| 回调 | 参数 | 说明 |
| :--- | :--- | :--- |
| `onProgress` | `localMsgId: string`、`progress: number` | 附件上传进度。`progress` 的取值范围为 `0-100`。无附件消息通常不会产生有效进度。 |
| `onError` | `localMsgId: string`、`error: ChatError` | 最终发送失败。通过 `error.code` 和 `error.description` 获取错误信息。 |
| `onSuccess` | `message: ChatMessage` | 最终发送成功。回调中的消息包含服务端消息 ID 等更新后的信息。 |

#### 逻辑说明

`sendMessage` 先注册状态回调，再通过原生桥接发起发送。Android 和 iOS 原生层会立即返回“发送调用已受理”的结果，最终状态通过独立事件回传。因此，即使 `await sendMessage(...)` 没有抛出异常，也应继续等待 `onSuccess` 或 `onError`。

## 更多

#### 聊天室消息优先级与消息丢弃逻辑

对于聊天室消息，环信即时通讯 IM 支持高、普通和低三种消息优先级。你可以通过 `ChatMessage#messagePriority` 设置单条聊天室消息的优先级。

- `ChatRoomMessagePriority.PriorityHigh`：高优先级。
- `ChatRoomMessagePriority.PriorityNormal`：普通优先级，默认值。
- `ChatRoomMessagePriority.PriorityLow`：低优先级。

当聊天室消息并发量过大或发送频率过高时，服务器会优先处理高优先级消息，并优先丢弃低优先级消息。因此，可以将打赏、公告等重要消息设置为高优先级。

消息优先级只能提高重要消息被优先处理的可能性，不能保证消息必达。在聊天室消息并发量过大的情况下，高优先级消息仍可能被丢弃。

对于单个聊天室，默认每秒发送的消息数量超过 20 条时，可能触发消息丢弃逻辑：

1. 服务器优先丢弃低优先级消息，尽量保留高优先级消息。
2. 同一优先级的消息超过限制时，服务器按照消息发送时间顺序处理，后发送的消息可能被丢弃。

以下示例发送一条高优先级聊天室消息：

```typescript
// 创建文本消息，并设置会话类型为聊天室 ChatRoom
const roomMessage = ChatMessage.createTextMessage(
  '<chat_room_id>',
  '重要公告',
  ChatMessageChatType.ChatRoom
);

// 设置聊天室消息优先级，未设置时默认为 PriorityNormal
roomMessage.messagePriority = ChatRoomMessagePriority.PriorityHigh;

// 设置发送结果回调
const roomMessageCallback: ChatMessageStatusCallback = {
  onSuccess(message) {
    console.log('发送成功：', message.msgId);
  },
  onError(localMsgId, error) {
    console.error('发送失败：', localMsgId, error.code, error.description);
  },
  onProgress() {
    // 文本消息通常不会触发该回调
  },
};

// 发送消息
try {
  await ChatClient.getInstance().chatManager.sendMessage(
    roomMessage,
    roomMessageCallback
  );
} catch (error: unknown) {
  console.error('发送调用失败：', error);
}
```

:::tip
`messagePriority` 仅对聊天室消息有效，不适用于单聊和群聊消息。
:::

#### 语聊房麦位管理

你可以基于 [聊天室自定义属性](room_attributes.html) 实现语聊房麦位状态管理和多端同步，例如记录麦位用户、麦位状态和音量状态等信息。

SDK 的聊天室自定义属性采用字符串键值对。设置属性时，`addAttributes` 接收 `{ [key: string]: string }[]`，查询属性时返回 `Map<string, string>`。

因此，麦位列表或其他结构化数据不能直接作为数组、`Map` 或自定义对象写入属性值。应用可以采用以下方式存储：

- 每个麦位使用一个独立属性，属性 Key 表示麦位编号，Value 为序列化后的麦位信息。
- 将麦位列表序列化为 JSON 字符串后，作为单个属性值写入。

例如，设置单个麦位属性：

```typescript
const roomManager = ChatClient.getInstance().roomManager;
const roomId = '<chat_room_id>';

// Value 为序列化后的麦位信息
const seatAttributes = [
  {
    seat_1: JSON.stringify({
      userId: '<seat_user_id>',
      state: 'open',
      volume: 0,
    }),
  },
];

try {
  const result = await roomManager.addAttributes({
    roomId,
    attributes: seatAttributes,
    deleteWhenLeft: false,
    overwrite: false,
  });
  // result 为未成功设置的属性及失败原因，空 Map 表示全部成功
  if (result.size > 0) {
    console.warn('部分麦位属性设置失败：', result);
  }
} catch (error: unknown) {
  console.error('设置麦位属性失败：', error);
}
```

设置或更新聊天室自定义属性后，聊天室内其他成员可以通过 `ChatRoomEventListener#onAttributesUpdated` 监听属性变更，并更新本地麦位状态：

```typescript
function listenForSeatUpdates(): () => void {
  const manager = ChatClient.getInstance().roomManager;
  const roomListener: ChatRoomEventListener = {
    async onAttributesUpdated({ roomId, from }) {
      try {
        // 收到变更通知后，查询对应麦位的当前属性
        const attributes = await manager.fetchChatRoomAttributes(roomId, ['seat_1']);
        // 按业务约定解析 JSON 字符串，并刷新麦位界面
        console.log('当前麦位状态：', roomId, from, attributes.get('seat_1'));
      } catch (error: unknown) {
        console.error('查询麦位属性失败：', error);
      }
    },
  };

  manager.addRoomListener(roomListener);

  // 返回清理方法，页面卸载或不再监听时调用，移除同一个监听器对象
  return () => manager.removeRoomListener(roomListener);
}
```

通过 `ChatClient.getInstance().roomManager.addRoomListener(...)` 注册监听器。具体实现方式和权限要求，详见 [聊天室自定义属性](room_attributes.html)。React Native 示例中的 `listenForSeatUpdates` 返回清理方法，应在页面卸载时调用。

#### 获取发送附件消息的进度

发送图片、语音、视频或文件等附件消息时，可以通过 `ChatMessageStatusCallback#onProgress` 回调获取附件上传进度。

`progress` 的取值范围为 `0-100`，表示附件上传百分比。通过 `onSuccess` 和 `onError` 回调可以获取消息发送结果：

- `onSuccess`：消息发送成功。
- `onError`：消息发送失败，包含错误码和错误描述。
- `localMsgId`：本地消息 ID，用于将上传进度或错误关联到本地消息。
- `message`：`onSuccess` 返回的消息对象，发送成功后可通过 `message.msgId` 获取最终消息 ID。

```typescript
const attachmentCallback: ChatMessageStatusCallback = {
  onProgress(localMsgId, progress) {
    // 附件上传进度，取值范围为 0-100，可据此更新进度条
    console.log('附件上传进度：', localMsgId, progress);
  },
  onError(localMsgId, error) {
    // 消息发送失败，结束对应消息的上传进度状态
    console.error('附件消息发送失败：', localMsgId, error.code, error.description);
  },
  onSuccess(message) {
    // 消息发送成功，使用回调中的消息获取最终消息 ID
    console.log('附件消息发送成功：', message.msgId);
  },
};

const attachmentMessage = ChatMessage.createFileMessage(
  '<target_user_id>',
  '<native_accessible_file_path>',
  ChatMessageChatType.PeerChat,
  { displayName: 'project-materials.zip' }
);

try {
  // attachmentMessage 为已创建的附件消息，发送时传入上传进度和结果回调
  await ChatClient.getInstance().chatManager.sendMessage(
    attachmentMessage,
    attachmentCallback
  );
} catch (error: unknown) {
  console.error('原生发送调用失败：', error);
}
```

:::tip
`onProgress` 用于通知附件上传进度。文本、位置、透传和自定义消息不涉及附件上传，通常不会触发该回调。
:::

#### 发送消息前的内容审核

- 内容审核关注消息 body

[内容审核服务会关注消息 body 中指定字段的内容，不同类型的消息审核不同的字段](/value-added/moderation/moderation_mechanism.html)，若创建消息时在这些字段中传入了很多业务信息，可能会影响审核效果。因此，创建消息时需要注意内容审核的字段不涉及业务信息，建议业务信息放在扩展字段中。

- 设置发送方收到内容审核替换后的内容

默认情况下，内容审核替换后的内容仅下发至接收方。发送方如需同步接收替换内容，需 **联系环信商务开通权限**，并在初始化 SDK 时将 `ChatOptions#useReplacedMessageContents` 参数设为 `true`。开启后，发送方将在消息被审核替换时收到新内容；若开关关闭（默认状态），则发送方仍保留原始发送内容，不会感知替换结果。

```typescript
const optionsWithModerationResult = ChatOptions.withAppKey({
  appKey: '<your_app_key>',
  useReplacedMessageContents: true, // 发送方同步接收内容审核替换后的消息内容
});

// 在首次初始化 SDK 时设置，勿在发送消息前重复初始化
try {
  await ChatClient.getInstance().init(optionsWithModerationResult);
} catch (error: unknown) {
  console.error('初始化失败：', error);
}
```

#### 消息大小和存储限制

各类消息的大小和存储限制，详见 [消息限制说明](/product/limitation.html#消息大小)。`ChatMessage#attributes` 也会计入消息大小。

#### 发消息时设置回调路由

回调路由允许你在同一个 App Key 下，将不同消息按回调环境维度分别投递到不同的回调地址。发送消息时，你可以在消息中携带回调环境字段（如 `dev`、`test`、`prod`），环信服务器收到消息后，根据该字段匹配控制台中配置的 [回调路由规则](/product/console/basic_webhook.html#配置消息回调规则)，并将当前消息回调至对应的 [发送前回调](/document/server-side/callback_presending.html) 或 [发送后回调](/document/server-side/callback_postsending.html) 地址。

:::tip
目前，该功能仅面向国内 1 区和国内 2 区开放。
:::

**适用场景**

| 场景 | 说明 |
| :--- | :--- |
| 多环境隔离 | 同一 App Key 下区分开发、测试、生产环境，消息分别回调至各自的服务地址。 |
| 灰度发布 | 部分消息回调至新链路验证，其余消息仍走旧链路。 |
| 多业务线分流 | 不同业务模块的消息回调至各自的审核、风控或同步服务。 |
| 降低发送前时延 | 避免消息先统一回调至一个入口，再由业务服务器二次转发。 |

**适用范围**

| 回调类型 | 生效范围 | 说明 |
| :--- | :--- | :--- |
| [发送前回调](/document/server-side/callback_presending.html) | 仅对 **SDK 发送的消息** 生效（不支持群组/聊天室的定向消息）。 | 消息下发给目标用户前，你的服务器可判断是否拦截或修改消息内容。 |
| [发送后回调](/document/server-side/callback_postsending.html) | 对 **SDK 和 REST API 发送的消息** 均生效。 | 消息成功发送后，通知你的服务器。 |

**工作流程**

1. 在控制台为发送前回调或发送后回调 [配置回调路由](/product/console/basic_webhook.html#配置消息回调规则)。
2. 客户端发送消息时，设置回调环境值。
3. 环信服务器收到消息后，根据消息中的回调环境值匹配当前阶段的回调地址。
4. 命中有效路由后，服务器将回调请求发送到对应地址。

**示例代码**

发消息时通过 `ChatMessage#webhookEnv` 设置回调环境。

回调环境参数 `webhookEnv` 的说明如下：

| 参数 | 类型 | 是否必需 | 说明 |
| :--- | :--- | :--- | :--- |
| `webhookEnv` | `string` | 否 | 回调环境值。回调环境仅支持字母和数字，长度不超过 8 个字符。服务器根据该值匹配控制台中的回调地址。建议与控制台中配置的回调环境保持一致，例如 `dev`、`test`、`prod`。 |

设置消息的 `webhookEnv` 属性：

```typescript
// 创建消息，单聊传入对端用户 ID
const routedMessage = ChatMessage.createTextMessage(
  '<target_user_id>',
  '需要路由的消息',
  ChatMessageChatType.PeerChat
);

// 设置回调环境，与控制台配置保持一致
routedMessage.webhookEnv = 'test';

// 发送消息
try {
  await ChatClient.getInstance().chatManager.sendMessage(routedMessage);
} catch (error: unknown) {
  console.error('发送调用失败：', error);
}
```

读取当前消息设置的回调环境值：

```typescript
const webhookEnv = routedMessage.webhookEnv;
```

**消息中的回调环境字段命中规则**

| 场景 | 路由结果 |
| :--- | :--- |
| 携带环境值且命中有效路由 | 按该环境值路由至对应的回调地址。 |
| 携带环境值但未命中有效路由 | **不触发回调**，控制台中的 `default` 兜底配置在此场景下 **不生效**。 |
| 环境值为空字符串 | 按未匹配到有效路由处理，不触发回调。 |
| 未携带环境值 | 自动路由至 `default` 环境对应的回调地址。 |
| 同一消息需同时触发发送前与发送后回调 | 两个阶段必须使用 **相同的环境值**。例如，发送前配置 `test -> url1`，发送后配置 `test -> url2`，则消息中携带 `test` 即可同时生效于两阶段。 |

## 注意事项

- `sendMessage` 的 `Promise` 与消息最终发送回调是两个阶段。不要只根据 `Promise` 完成更新消息状态。
- React Native SDK 5.0.0 的 `ChatMessage#isNeedReadReceipt` 默认为 `false`。需要已读回执时，应在发送前显式设为 `true`。
- 群聊和聊天室消息必须使用正确的 `ChatMessageChatType`，且当前用户需已加入目标群组或聊天室。
- 附件路径必须能被原生层访问，并在最终回调返回前保持有效。临时文件被清理或权限失效会导致上传失败。
- 定向消息、内容审核、回调路由和发送频率限制可能依赖控制台配置或商务开通。接入前应确认服务端能力。
- 不要在消息正文、扩展字段、日志或示例代码中写入 App Secret、长期有效 Token 或其他敏感信息。

## 常见错误与排查

### 常见错误码

React Native SDK 通过 `ChatError#code` 和 `ChatError#description` 返回错误。下表中的标识来自底层原生 SDK，React Native 包未导出可直接引用的同名错误常量，业务代码应比较数字错误码或统一封装自己的错误映射。

| 错误码 | 底层标识 | 说明 | 常见原因 | 处理建议 |
| :--- | :--- | :--- | :--- | :--- |
| `110` | `INVALID_PARAM` | 参数无效。 | 目标 ID、消息内容、坐标、消息 ID 列表或其他参数为空或格式错误。 | 记录 `description`，核对当前消息创建方法的必需参数和会话类型。 |
| `201` | `USER_NOT_LOGIN` | 用户未登录。 | Token 登录未完成、登录态已失效，或断线退出后继续发送。 | 确认登录成功；若登录态失效，获取新 Token 后重新登录。 |
| `402` | `FILE_UPLOAD_FAILED` | 附件上传失败。 | 网络异常、附件路径不可访问、临时文件被删除或自定义附件配置错误。 | 检查网络、原生文件访问权限、文件生命周期和 `serverTransfer` 配置。 |
| `405` | `FILE_TOO_LARGE` | 附件超过大小限制。 | 图片、语音、视频或文件超过当前 App 的附件限制。 | 压缩或重新选择文件，并核对 [消息附件限制](/product/limitation.html#消息存储)。 |
| `500` | `MESSAGE_INVALID` | 消息无效。 | 消息对象、消息体、发送方或目标会话信息不合法。 | 重新检查消息创建流程，不要手工构造缺少必需字段的消息对象。 |
| `507` | `MESSAGE_ILLEGAL_WHITELIST` | 当前用户无权发送消息。 | 群组或聊天室已全员禁言，且当前用户不在白名单中。 | 检查群组或聊天室禁言状态、成员角色和白名单配置。 |
| `508` | `MESSAGE_EXTERNAL_LOGIC_BLOCKED` | 消息被发送前回调拦截。 | 业务服务器的发送前回调规则拒绝该消息。 | 查看发送前回调日志和拦截规则，按业务提示修改消息内容。 |
| `509` | `MESSAGE_CURRENT_LIMITING` | 发送频率超过限制。 | 单个用户在单聊、群聊或聊天室中的发送频率超过已配置上限。 | 降低发送频率并增加客户端节流，不要无间隔重试。 |
| `510` | `MESSAGE_SIZE_LIMIT` | 消息体超过大小限制。 | 文本、扩展字段或自定义参数过大。 | 缩短正文或扩展字段，将大数据改为附件或业务服务器引用。 |

### 常见问题

1. 为什么 `await sendMessage(...)` 已完成，但 UI 仍未显示发送成功？

   `Promise` 完成只表示原生层已接受调用。请在 `ChatMessageStatusCallback#onSuccess` 中将消息更新为发送成功，在 `onError` 中显示失败状态。

2. 为什么附件消息没有上传进度？

   文本、位置、透传和自定义消息通常没有附件上传进度。对于附件消息，请确认传入了回调、`serverTransfer` 为 `true`、本地路径可访问，并且上传尚未完成。关闭自动附件传输后，业务上传进度不由 SDK 回调提供。

3. 为什么发送方收不到消息已读回执？

   确认发送前将 `isNeedReadReceipt` 设置为 `true`，会话类型为单聊或群聊，并且接收方已调用 `sendMessageReadReceipts`。聊天室不支持消息已读回执。

4. 为什么群聊或聊天室消息发送失败？

   依次检查 `targetId`、`chatType`、当前用户的加入状态、禁言状态、白名单、定向接收配置和发送频率限制。不要把群组 ID 或聊天室 ID 作为默认的 `PeerChat` 发送。

5. 为什么同一个附件路径在一个平台可用，在另一个平台上传失败？

   React Native 返回的 URI 可能对应平台专用的资源授权。应确认 Android 和 iOS 原生层都能读取该资源，并在发送结束前保留访问权限；必要时将资源复制到 App 可控的缓存目录后再发送。

## 接口列表

| API 或属性 | 所属类 | 说明 |
| :--- | :--- | :--- |
| [`createTextMessage`](#发送文本消息) | `ChatMessage` | 创建文本消息。 |
| [`createImageMessage`](#发送图片消息) | `ChatMessage` | 创建图片或 GIF 图片消息。 |
| [`createVoiceMessage`](#发送语音消息) | `ChatMessage` | 创建语音消息。 |
| [`createVideoMessage`](#发送视频消息) | `ChatMessage` | 创建视频消息。 |
| [`createFileMessage`](#发送文件消息) | `ChatMessage` | 创建文件消息。 |
| [`createLocationMessage`](#发送位置消息) | `ChatMessage` | 创建位置消息。 |
| [`createCmdMessage`](#发送透传消息) | `ChatMessage` | 创建透传消息。 |
| [`createCustomMessage`](#发送自定义类型消息) | `ChatMessage` | 创建自定义消息。 |
| [`createCombineMessage`](#发送合并消息) | `ChatMessage` | 创建合并消息。 |
| [`sendMessage`](#发送消息统一流程) | `ChatManager` | 发起消息发送。 |
| [`fetchCombineMessageDetail`](#发送合并消息) | `ChatManager` | 下载并解析合并消息中的原始消息。 |
| [`sendMessageReadReceipts`](#带群消息已读回执和扩展字段的示例) | `ChatManager` | 批量发送单聊或群聊消息已读回执。 |
| [`attributes`](#通用消息创建参数) | `ChatMessage` | 设置消息扩展字段。 |
| [`isNeedReadReceipt`](#带群消息已读回执和扩展字段的示例) | `ChatMessage` | 设置消息是否需要已读回执。 |
| [`messagePriority`](#聊天室消息优先级与消息丢弃逻辑) | `ChatMessage` | 设置聊天室消息优先级。 |
| [`webhookEnv`](#发消息时设置回调路由) | `ChatMessage` | 设置消息回调路由环境。 |
| [`serverTransfer`](#上传消息附件至自有服务器) | `ChatOptions` | 设置是否由 SDK 自动传输普通消息附件。 |
| [`useReplacedMessageContents`](#发送消息前的内容审核) | `ChatOptions` | 设置发送方是否接收内容审核替换后的消息内容。 |
