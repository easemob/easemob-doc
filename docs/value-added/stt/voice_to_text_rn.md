# 语音转文字

本文介绍如何使用 React Native SDK 将语音消息或本地语音文件转换为文字。

本功能从 React Native SDK 1.18.0 版本开始支持。

## 功能说明

语音转文字功能支持将语音内容转换为文本，主要包括以下功能：

- 语音消息转文字：将已经成功发送或接收、并保存在原生 SDK 本地数据库中的语音消息转换为文本。
- 本地语音文件转文字：将 Android 或 iOS 设备上应用可访问的本地语音文件转换为文本。
- 语音参数配置：为无文件头的本地语音文件补充格式、采样率、采样位深和声道数等参数。
- 读取转文字结果：转换成功后直接获取接口返回的文本；重新从本地数据库加载语音消息后，还可以读取 `ChatVoiceMessageBody#text`。

[语音消息转文字](#将语音消息转换为文本) 与 [本地语音文件转文字](#将本地语音文件转换为文本) 支持的音频格式不完全相同。

| 文件格式 | 语音消息转文字 | 本地语音文件转文字 |
| :--- | :---: | :---: |
| PCM | ❌ 不支持 | ✅ 支持 |
| AMR | ✅ 支持 | ✅ 支持 |
| MP3 | ✅ 支持 | ✅ 支持 |
| WAV | ✅ 支持 | ✅ 支持 |
| M4A | ✅ 支持 | ✅ 支持 |
| AAC | ✅ 支持 | ✅ 支持 |

为获得更优性能，**推荐优先使用标准的 `PCM` 和 `MP3` 格式**。

语音参数 `voiceParam` 仅用于本地语音文件转文字。对于本地 `PCM` 文件，由于文件本身不包含完整音频头信息，必须传入 `voiceParam`，以便 SDK 正确解析原始音频数据；其他格式通常可省略。具体配置方式请参考 [将本地语音文件转换为文本](#将本地语音文件转换为文本)。

## 开通服务

使用该服务前，请联系环信商务进行开通。

## 使用限制

- 本地语音文件大小不能超过 10 MB，音频时长不能超过 60 秒。
- 单个 App Key 下，语音消息转文字和本地语音文件转文字两个接口的总调用频率上限为每秒 50 次。如需调整，请联系环信商务。

## 技术原理

React Native SDK 对 Android 和 iOS 原生 SDK 的语音转文字能力进行了统一封装，主要支持以下两种调用方式：

- 语音消息转文字：React Native 层传入 `ChatMessage`。原生桥接层根据消息 ID 从原生 SDK 本地数据库重新读取消息，校验消息及语音附件后调用底层转换能力。转换成功后，原生 SDK 持久化文本结果，React Native 层通过 `Promise<string>` 获取本次转换文本。
- 本地语音文件转文字：React Native 层传入原生层可访问的本地文件路径。若文件为 `PCM` 格式，还需传入 [语音参数](#关键参数) 描述原始音频数据；原生桥接层完成参数转换后调用底层转换能力，并通过 `Promise<string>` 返回文本。

处理流程详见原生平台文档：
- [Android 处理流程](/value-added/stt/voice_to_text_android.html#技术原理)
- [iOS 处理流程](/value-added/stt/voice_to_text_ios.html#技术原理)

## 前提条件

开始前，请确保满足以下条件：

- 已将 React Native SDK 升级至 v1.18.0 或以上版本。
- 已联系环信商务开通语音转文字服务。
- 已完成 [React Native SDK 初始化](/document/react-native/initialization.html)，并成功 [登录](/document/react-native/login.html)。
- 已具备 [发送](/document/react-native/message_send.html#发送语音消息) 和 [接收语音消息](/document/react-native/message_receive.html#接收语音消息) 的基础集成能力。

## 将语音消息转换为文本

调用 `ChatManager#voiceMessageToText` 将单条语音消息转换为文本。该方法返回 `Promise<string>`；转换成功时返回文本，失败时抛出 `ChatError`。

// TODO：需要这一段吗？
该方法不会直接修改调用时传入的 JavaScript `ChatMessage` 对象。若需读取原生 SDK 已持久化的结果，应根据消息 ID 重新获取消息，详见 [读取语音消息的转换结果](#读取语音消息的转换结果)。

为获得更优性能，**推荐优先使用标准的 `MP3` 格式语音消息**。

```typescript
import {
  ChatClient,
  ChatError,
  ChatMessageType,
} from 'react-native-chat-sdk';
import type { ChatMessage } from 'react-native-chat-sdk';

async function convertVoiceMessage(voiceMessage: ChatMessage) {
  if (voiceMessage.body.type !== ChatMessageType.VOICE) {
    console.error('传入的消息不是语音消息');
    return;
  }

  try {
    const text = await ChatClient.getInstance()
      .chatManager.voiceMessageToText(voiceMessage);
    console.log('语音消息转文字成功：', text);
  } catch (error) {
    if (error instanceof ChatError) {
      console.error('语音消息转文字失败：', error.code, error.description);
    } else {
      console.error('语音消息转文字失败：', error);
    }
  }
}
```

#### 关键参数

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :---: | :--- |
| `message` | `ChatMessage` | 是 | 待转换的语音消息。`message.body.type` 必须为 `ChatMessageType.VOICE`，且该消息必须已成功发送或接收并存在于原生 SDK 本地数据库中。 |

| 返回值 | 类型 | 描述 |
| :--- | :--- | :--- |
| 转换文本 | `Promise<string>` | 成功时异步返回转换后的文本；失败时抛出 `ChatError`。 |

#### 注意事项

- 该方法只支持已成功发送或接收、具备有效消息 ID 和远端语音附件的语音消息。
- 传入消息的 `body.type` 必须为 `ChatMessageType.VOICE`，否则会返回消息不合法错误。
- Android 和 iOS 原生桥接层都会根据 `message.msgId` 从原生 SDK 本地数据库重新获取消息，因此该消息必须已保存在本地数据库中。
- `voiceMessageToText` 仅返回转换后的字符串，不会原地修改传入的 JavaScript `ChatMessage` 对象。请优先使用方法返回值即时展示文本。
- 该接口支持 `AMR`、`MP3`、`WAV`、`M4A` 和 `AAC` 格式的语音消息，不支持直接转换 `PCM` 格式的语音消息。
- 如需转换 `PCM` 音频，请使用 [本地语音文件转文字接口](#将本地语音文件转换为文本)，并传入对应的 `ChatVoiceParam`。

## 将本地语音文件转换为文本

调用 `ChatManager#voiceFileToText` 将本地语音文件转换为文本。该方法返回 `Promise<string>`；转换成功时返回文本，失败时抛出 `ChatError`。

调用前，必须确保应用具备访问目标文件的权限，且 `filePath` 是 Android 或 iOS 原生层可读取的本地文件路径。为获得更优性能，**推荐优先使用标准的 `PCM` 和 `MP3` 格式音频文件**。

下面示例以本地 `PCM` 文件为例，展示如何配置 `voiceParam` 并发起转换：

```typescript
import {
  ChatClient,
  ChatError,
  ChatVoiceFormat,
  ChatVoiceParam,
} from 'react-native-chat-sdk';

const filePath = '/path/to/voice.pcm';
const voiceParam = new ChatVoiceParam({
  format: ChatVoiceFormat.PCM,
  sampleRate: 16000,
  bitsPerSample: 16,
  channels: 1,
});

try {
  const text = await ChatClient.getInstance()
    .chatManager.voiceFileToText(filePath, voiceParam);
  console.log('本地语音文件转文字成功：', text);
} catch (error) {
  if (error instanceof ChatError) {
    console.error('本地语音文件转文字失败：', error.code, error.description);
  } else {
    console.error('本地语音文件转文字失败：', error);
  }
}
```

#### 关键参数

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :---: | :--- |
| `filePath` | `string` | 是 | 本地语音文件路径。必须确保 Android 或 iOS 原生层具备读取该路径的权限。Android 的 `content://` URI 或 iOS 文件提供器返回的临时地址不一定能直接使用，必要时先将文件复制到应用沙盒或缓存目录。 |
| `voiceParam` | `ChatVoiceParam` | 否 | 语音参数，用于描述语音文件。转换 `PCM` 文件时必须传入；对于 `MP3`、`AMR`、`WAV`、`M4A` 和 `AAC` 文件通常可省略。 |

| 返回值 | 类型 | 描述 |
| :--- | :--- | :--- |
| 转换文本 | `Promise<string>` | 成功时异步返回转换后的文本；失败时抛出 `ChatError`。 |

该接口支持 `PCM`、`MP3`、`AMR`、`WAV`、`M4A` 和 `AAC` 格式的本地语音文件。

`ChatVoiceParam` 用于描述语音文件的格式、采样率、采样位深和声道数。对于无文件头的 `PCM` 文件，必须传入该参数；对于 `MP3`、`AMR`、`WAV`、`M4A` 和 `AAC` 等格式信息完整的文件，通常可省略 `voiceParam`。

如果语音参数与原始文件不匹配，可能导致转换失败或结果异常。

```typescript
const voiceParam = new ChatVoiceParam({
  format: ChatVoiceFormat.PCM,
  sampleRate: 16000,
  bitsPerSample: 16,
  channels: 1,
});
```

`ChatVoiceParam` 的成员如下：

| 成员 | 类型 | 是否必需 | 说明 |
| :--- | :--- | :---: | :--- |
| `format` | `ChatVoiceFormat` | 是 | 语音格式。枚举仅包含 `ChatVoiceFormat.PCM`、`ChatVoiceFormat.AMR` 和 `ChatVoiceFormat.MP3`。对于 `WAV`、`M4A` 和 `AAC`，服务端会直接解析处理，SDK 仅透传文件数据，请省略整个 `voiceParam`。`format` 为必填项，无默认值。 |
| `sampleRate` | `number` | 否 | 采样率，单位为 Hz，例如 `8000` 或 `16000`。 |
| `bitsPerSample` | `number` | 否 | 采样位深，单位为 bit，例如 `16`。 |
| `channels` | `number` | 否 | 声道数，例如 `1` 表示单声道。 |

## 读取语音消息的转换结果

`voiceMessageToText` 和 `voiceFileToText` 均直接返回 `Promise<string>`，因此应优先使用方法返回值获取本次转换结果：

```typescript
const text = await ChatClient.getInstance()
  .chatManager.voiceMessageToText(voiceMessage);
```

`ChatVoiceMessageBody` 还包含可选字段 `text?: string`。该字段由原生 SDK 返回的消息数据反序列化得到；消息尚未转换或当前消息数据不包含转换结果时，其值为 `undefined`。

// TODO：下面一段话移掉？

调用 `voiceMessageToText` 后，传入的 JavaScript 消息对象不会被原地更新。如果需要检查本地数据库中的消息数据，可以根据消息 ID 重新获取消息，再读取 `text`：

```typescript
import {
  ChatClient,
  ChatMessageType,
} from 'react-native-chat-sdk';
import type { ChatVoiceMessageBody } from 'react-native-chat-sdk';

const reloadedMessage = await ChatClient.getInstance()
  .chatManager.getMessage(voiceMessage.msgId);

if (reloadedMessage?.body.type === ChatMessageType.VOICE) {
  const voiceBody = reloadedMessage.body as ChatVoiceMessageBody;
  console.log('已持久化的转换文本：', voiceBody.text);
}
```

:::tip
请勿通过手动修改 `ChatVoiceMessageBody.text` 的方式保存识别结果。应以 `voiceMessageToText` 的返回值，以及从 SDK 本地数据库重新获取或由 SDK 下发的消息数据为准。
:::

## 注意事项

- `voiceMessageToText` 和 `voiceFileToText` 均为异步接口，返回类型为 `Promise<string>`。
- 转换本地语音文件前，建议先校验文件是否存在且可读，避免无效调用。
- 如果文件来自 Android 外部存储、`content://` URI、iOS 文件提供器或第三方选择器，请确保最终传入的是原生 SDK 可读取的本地文件路径；必要时先复制到应用沙盒或缓存目录。
- 当前语音消息转文字支持 `AMR`、`MP3`、`WAV`、`M4A` 和 `AAC` 格式，不支持直接转换 `PCM` 格式的语音消息。
- 如需转换 `PCM` 音频，请使用 [本地语音文件转文字接口](#将本地语音文件转换为文本)，并传入与原始音频匹配的 `ChatVoiceParam`。
- 如果本地文件大小超过 10 MB、时长超过 60 秒，或语音参数与实际文件不匹配，可能导致识别失败。

## 常见错误与排查

#### 常见错误码

| 错误码 | 说明 | 常见原因 | 处理建议 |
| :--- | :--- | :--- | :--- |
| 4 | 服务使用量超限。 | 测试版语音转文字服务用量超过限制。 | 检查当前服务配额或联系环信商务开通正式服务。 |
| 104 | 鉴权失败。 | 当前登录状态失效，或 Token 无效、已过期。 | 重新登录并确保鉴权状态有效。 |
| 110 | 请求参数错误。 | 请求参数缺失或非法，例如文件路径为空或语音参数格式错误。 | 检查消息对象、文件路径和语音参数是否合法。 |
| 400 | 语音文件不存在。 | 服务端未找到消息关联的语音文件，或本地文件路径无效。 | 检查消息附件是否可用，或确认本地文件路径是否正确。 |
| 401 | 语音文件无效或格式不支持。 | 语音文件格式不支持，或文件内容异常。 | 检查文件格式、可读性和文件内容是否完整。 |
| 403 | 语音文件下载失败。 | 服务端拉取消息语音文件失败。 | 检查网络状态和服务端附件可用性。 |
| 408 | 待转换语音文件时长超过限制。 | 语音时长超过 60 秒。 | 缩短语音时长后重试。 |
| 409 | 语音文件转文字失败。 | 语音内容识别失败，或底层转换服务调用失败。 | 检查语音内容质量、格式和参数配置是否匹配。 |
| 500 | 消息不合法。 | 消息类型不是语音消息、消息不在原生本地数据库中，或不是已成功发送或接收的语音消息。 | 确保传入的是原生本地数据库中的有效语音消息。 |
| 505 | 服务未开通。 | 当前应用未开通语音转文字服务。 | 开通语音转文字服务后再调用。 |

错误处理示例：

```typescript
try {
  const text = await ChatClient.getInstance()
    .chatManager.voiceMessageToText(voiceMessage);
  console.log(text);
} catch (error) {
  if (error instanceof ChatError) {
    console.error('code=', error.code, 'description=', error.description);
  }
}
```

#### 常见问题

1. 为什么 `voiceMessageToText` 返回消息不合法错误？

通常有以下原因：

- 传入消息的 `body.type` 不是 `ChatMessageType.VOICE`。
- 消息尚未成功发送或接收，没有可用的远端语音附件。
- 消息未保存在原生 SDK 本地数据库中，原生桥接层无法根据 `message.msgId` 重新获取消息。
- 当前消息中的音频格式不在支持范围内。

2. 为什么本地文件转换返回文件不存在错误？

通常有以下原因：

- `filePath` 为空或路径错误。
- 目标文件不存在。
- 应用或原生 SDK 对该路径没有读取权限。
- 传入的是原生层无法直接读取的 URI，而不是实际本地文件路径。

3. 为什么 `PCM` 文件转换失败？

常见原因包括：

- 未传入 `ChatVoiceParam`。
- `format` 未设置为 `ChatVoiceFormat.PCM`。
- `sampleRate`、`bitsPerSample` 或 `channels` 与原始语音不匹配。
- 实际文件并非 `PCM` 原始流格式。

4. 为什么 `ChatVoiceFormat` 不包含 `WAV`、`M4A` 和 `AAC`，但语音转文字功能仍支持这些格式？

`ChatVoiceFormat` 仅包含 `PCM`、`AMR` 和 `MP3`。`WAV`、`M4A` 和 `AAC` 的格式信息由服务端直接解析，React Native 原生桥接层仅透传文件数据，因此转换这些格式时通常省略 `voiceParam`。

## 接口列表

| API 名称 | 所属模块/类 | 返回类型 | 说明 |
| :--- | :--- | :--- | :--- |
| [`voiceMessageToText`](#将语音消息转换为文本) | `ChatManager` | `Promise<string>` | 将本地数据库中的语音消息转换为文本。 |
| [`voiceFileToText`](#将本地语音文件转换为文本) | `ChatManager` | `Promise<string>` | 将本地语音文件转换为文本。 |
| [`getMessage`](#读取语音消息的转换结果) | `ChatManager` | `Promise<ChatMessage \| undefined>` | 根据消息 ID 从本地数据库重新获取消息。 |
| [`text`](#读取语音消息的转换结果) | `ChatVoiceMessageBody` | `string \| undefined` | 语音消息中已持久化的转换文本。 |
| [`ChatVoiceParam`](#将本地语音文件转换为文本) | `ChatVoiceParam` | — | 描述本地语音文件的格式、采样率、采样位深和声道数。 |
| [`ChatVoiceFormat`](#将本地语音文件转换为文本) | `ChatVoiceFormat` | — | 本地语音参数支持的格式枚举：`PCM`、`AMR` 和 `MP3`。 |
