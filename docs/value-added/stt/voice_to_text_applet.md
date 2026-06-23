# 语音转文字

本文介绍如何使用 SDK 将语音转换为文字。

本功能从 SDK 4.21.0 版本开始支持。

## 功能说明

语音转文字功能支持将语音内容转换为文本，主要包括以下能力：

- 语音消息转文字：将已经发送成功的语音消息转换为文本。
- 本地语音文件转文字：将本地语音文件路径对象转换为文本。
- 语音参数配置：为无文件头的本地语音文件补充格式、采样率、采样位深和声道数等参数。
- 读取转文字结果：转换成功后，可通过接口返回值中的 `res.data.text` 获取识别文本。

## 开通服务

使用该服务前，请联系环信商务进行开通。

## 使用限制

- 本地语音文件大小不能超过 10 MB，音频时长不能超过 60 秒。
- 单个 App Key 下，语音消息转文字和语音文件转文字两个接口的总调用频率上限为每秒 50 次；如需调整，请联系商务。

## 技术原理

语音转文字主要包括以下两种方式：

- 语音消息转文字：业务层传入 `AudioMsgBody`，SDK 校验参数后从 `messageBody.url` 中提取 `fileId`，再调用 [接口](#将语音消息转换为文本) 完成转换。
- 本地语音文件转文字：业务层传入本地文件路径对象，SDK 上传文件后调用 [接口](#将本地语音文件转换为文本) 完成转换。

时序图如下所示：

![img](/images/voicetotext/voice_to_text_sequence_mini_program.png)

流程如下：

**语音消息转文字**

1. App 调用 `voiceMessageToText(messageBody, audioParams)` 发起语音消息转文字请求。
2. IM SDK 校验 `messageBody` 是否存在、是否为语音消息，以及 `audioParams` 是否合法。
3. IM SDK 从 `messageBody.url` 中提取语音文件对应的 `fileId`。
4. IM SDK 向 IM Server 发起发起语音消息转文字请求。
5. IM Server 完成语音识别并返回转换结果或错误信息。
6. IM SDK 将结果封装为 `Promise<AsyncResult<{ text: string }>>` 返回给 App。

**本地语音文件转文字**

1. App 调用 `voiceFileToText(file, audioParams)` 发起本地语音文件转文字请求。
2. IM SDK 校验 `file` 和 `audioParams` 是否合法。
3. IM SDK 使用宿主提供的 `uploadFile` 上传本地 `filePath`。
4. IM SDK 向 IM Server 发起本地语音文件转文字请求。
5. IM Server 完成语音识别并返回转换结果或错误信息。
6. IM SDK 将结果封装为 `Promise<AsyncResult<{ text: string }>>` 返回给 App。

## 前提条件

开始前，请确保满足以下条件：

- 已将 SDK 升级至 v4.21.0 或以上版本。
- 已完成 [SDK 初始化](initialization.html)，并成功 [登录](login.html)。
- 已联系商务开通语音转文字服务。
- 已具备 [发送](message_send.html#发送语音消息) 和 [接收语音消息](message_receive.html#接收语音消息) 的基础集成能力。

## 将语音消息转换为文本

调用 `connection#voiceMessageToText` 可将单条语音消息转换为文本。

转换成功后，可通过返回值中的 `res.data.text` 获取识别结果。

```typescript
const audioMessageBody = {
  type: "audio",
  // 消息体中应包含可用的 `url`，且该 URL 可以解析出语音文件对应的 `fileId`。
  url: "https://a1.easemob.com/xxx/yyy/chatfiles/682df9f0-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
};

try {
  const res = await conn.voiceMessageToText(audioMessageBody);
  console.log("voiceMessageToText success:", res.data?.text);
} catch (error) {
  console.error(
    "voiceMessageToText failed:",
    error.type,
    error.message
  );
}
```

#### 关键参数

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `messageBody` | `AudioMsgBody` | 是 | 待转换的语音消息体，要求 `messageBody.type === 'audio'`。 |
| `audioParams` | `AudioParams` | 否 | 可选音频补充参数，用于识别原始语音数据。 |

#### 注意事项

- `voiceMessageToText` 仅支持已发送成功的语音消息，不支持其他消息类型。
- `messageBody.url` 必须存在，否则会返回 `410 FILE_NOT_FOUND`。
- SDK 会从 `messageBody.url` 中提取 `fileId`；如果 URL 无法解析出有效文件 ID，会返回 `407 FILE_INVALID`。
- 当前实现不会把识别结果回写到原始消息体中；如需展示文本，请自行使用 `res.data.text`。
- 该接口为异步接口，结果通过 `Promise` 返回，而不是通过回调返回。
- 当前语音消息转文字支持 `AMR`、`MP3`、`WAV`、`M4A` 和 `AAC` 格式的语音消息，不支持直接对 `PCM` 格式的语音消息进行转换。
- 如需转换 PCM 音频，请使用 [本地语音文件转文字接口](#将本地语音文件转换为文本)，并传入对应的 `AudioParams`。

## 将本地语音文件转换为文本

调用 `connection#voiceFileToText` 将本地语音文件转换为文本。

该接口支持 `PCM`、`MP3` 和 `AMR` 格式的本地语音文件，要求待转换文件的大小不超过 10 MB，且时长不超过 60 秒。其中，`PCM` 文件需要结合 `AudioParams` 指定格式、采样率、采样位深和声道数等参数。

```typescript
const miniProgramFile = {
  filePath: "/tmp/voice/test.pcm",
  name: "test.pcm",
  size: 20480,
};

const res = await conn.voiceFileToText(miniProgramFile, {
  format: "pcm",
  sampleRate: 16000,
  bitsPerSample: 16,
  channels: 1,
});

console.log("voiceFileToText success:", res.data?.text);
```

#### 关键参数

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `file` | `VoiceSourceFile` | 是 | 本地文件路径对象。 |
| `audioParams` | `AudioParams` | 否 | 语音参数。PCM 文件缺少头信息，必须传入该参数。对于 `MP3`、`AMR`、`WAV`、`M4A` 和 `AAC` 文件，可传 `null`。  |

## 配置语音文件识别的语音参数

`AudioParams` 用于描述语音文件的基础属性，包括格式、采样率、位深和声道数，有助于准确地解析语音内容。

- PCM 文件缺少头信息，必须传入 `audioParams`。
- 对于 `MP3`、`AMR`、`WAV`、`M4A` 和 `AAC` 文件，通常无需显式配置该对象。
- 对于格式信息完整的文件，通常可不传，或仅在需要时补充。
- 如果 `audioParams` 与真实语音内容不匹配，可能导致识别失败或结果异常。

```typescript
const audioParams = {
  format: "pcm",
  sampleRate: 16000,
  bitsPerSample: 16,
  channels: 1,
};
```

`AudioParams` 中的关键成员如下：

| 成员 | 说明 |
| :--- | :--- |
| `format` | 语音格式。仅支持配置 `pcm`、`mp3` 和 `amr` 格式。对于 `WAV`、`M4A` 和 `AAC` 格式的文件，服务端会进行解析和处理，SDK 仅做透传，不支持通过 `AudioParams` 配置格式参数，传入 `null` 即可。 |
| `sampleRate` | 采样率，单位为 Hz，建议设置为 `8000` 或 `16000`。 |
| `bitsPerSample` | 位深，单位为 bit，例如 `16`。 |
| `channels` | 声道数，例如 `1` 表示单声道，`2` 表示双声道。 |

## 读取语音消息的转换结果

直接使用接口返回值中的 `text` 字段读取转换结果：

```typescript
try {
  const res = await conn.voiceMessageToText(audioMessageBody);
  const text = res.data?.text || "";
  console.log("transcribed text:", text);
} catch (error) {
  console.error("voiceMessageToText failed:", error);
}
```

`voiceMessageToText` 和 `voiceFileToText` 调用成功后，识别结果均位于 `res.data.text`。

## 注意事项

- `voiceMessageToText` 和 `voiceFileToText` 的转换结果通过 `Promise` 返回。
- 调用 `voiceFileToText` 时，除传入有效 `filePath` 外，还要求宿主环境支持 `uploadFile`。
- 如果本地文件大小（10 MB）或时长（60 秒）超过限制，或音频格式与参数不匹配，可能导致识别失败。
- 对于复用错误码，SDK 会结合 `error.message` 尝试区分是否属于文件过大场景；如果无法区分，则统一映射为参数错误。
- `PCM` 音频仅支持通过 [本地文件转文字接口](#将本地语音文件转换为文本) 进行转换，不支持通过 [语音消息转文字接口](#将语音消息转换为文本) 直接转换。

## 常见错误与排查

#### 常见错误码

| 错误码 | 常量 | 说明 | 常见原因 | 处理建议 |
| :--- | :--- | :--- | :--- | :--- |
| `-3` | `REQUEST_PARAMETER_ERROR` | 请求参数错误。 | 上传请求参数缺失或不合法。 | 检查文件、表单和音频参数。 |
| `50` | `MAX_LIMIT` | 服务额度超限。 | Beta 服务使用量超过限制。 | 检查服务额度或联系商务开通正式服务。 |
| `52` | `NO_PERMISSION` | 无权限。 | `accessToken` 无效、过期，或鉴权失败。 | 重新登录并确认当前鉴权状态有效。 |
| `101` | `WEBIM_UPLOADFILE_ERROR` | 文件上传失败。 | 上传过程中网络异常，或接收文件失败。 | 检查网络状态并重试。 |
| `407` | `FILE_INVALID` | 语音文件无效。 | 传入的消息不是语音消息，文件对象不合法，或 URL 无法解析出有效文件 ID。 | 检查消息类型、文件对象和消息 URL。 |
| `408` | `FILE_DURATION_TOO_LONG` | 语音时长超过限制。 | 语音长度超过允许的上限 60 秒。 | 缩短音频时长后重试。 |
| `409` | `FILE_VOICE_TO_TEXT_FAILED` | 语音转文字失败。 | 音频内容无法识别，或转换失败。 | 检查音频质量、格式与音频参数是否匹配。 |
| `410` | `FILE_NOT_FOUND` | 语音文件不存在。 | 消息缺少可用附件，或找不到对应语音文件。 | 检查消息 URL、本地文件路径或附件可用性。 |
| `411` | `FILE_TOO_LARGE` | 语音文件过大。 | 上传文件超过大小限制 10 MB。 | 压缩或裁剪文件后重试。 |
| `505` | `SERVICE_NOT_ENABLED` | 服务未开通。 | 当前应用未开通语音转文字能力。 | 开通对应服务后再调用。 |

#### 常见问题

1. 为什么 `voiceMessageToText` 返回 `FILE_INVALID`？

通常有以下原因：

- 传入的 `messageBody` 为空。
- `messageBody.type` 不是 `audio`。
- `messageBody.url` 无法解析出有效的 `fileId`。
- `audioParams` 结构不合法。

2. 为什么 `voiceFileToText` 返回 `FILE_INVALID`？

通常有以下原因：

- 小程序环境中传入的对象缺少有效 `filePath`。
- 当前环境不支持小程序 `uploadFile` 能力。
- `audioParams` 字段类型不正确。

3. 为什么会返回 `FILE_TOO_LARGE` 或 `REQUEST_PARAMETER_ERROR`？

通常有以下原因：

- 上传文件大小超过限制 10 MB。
- 请求不是合法的 `multipart/form-data`。
- 上传文件字段缺失。

其中，服务端对多个场景复用了同一个错误码 `4001001`。SDK 仅在错误信息包含 `uploaded file exceeds` 时映射为 `411 FILE_TOO_LARGE`，其他场景会映射为 `-3 REQUEST_PARAMETER_ERROR`。

4. 为什么 `AudioParams.format` 不支持 WAV/M4A/AAC 格式，语音转文字功能却支持这些格式？

`WAV`、`M4A` 和 `AAC` 格式由服务端直接识别和处理，小程序 SDK 仅负责将文件数据透传至服务端，不进行本地解析或参数校验。因此，在调用 `voiceFileToText` 时，对于这些格式的文件，`audioParams` 参数传 `null` 即可。