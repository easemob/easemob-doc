# 语音转文字

本文介绍如何使用 Android SDK 将语音消息或本地语音文件转换为文字。

本功能从 SDK 4.21.0 版本开始支持。

## 功能说明

语音转文字功能支持将语音内容转换为文本，主要包括以下功能：
- 语音消息转文字：将已发送成功的语音消息转换为文本。
- 本地语音文件转文字：将本地语音文件转换为文本。
- 语音参数配置：为无文件头的本地语音文件补充格式、采样率、采样位深和声道数等参数。
- 读取转文字结果：转换成功后，可从语音消息体读取已持久化的文本结果。

[语音消息转文字](#将语音消息转换为文本) 与 [本地语音文件转文字](#将本地语音文件转换为文本) 支持的音频格式不完全相同。

| 文件格式 | 语音消息转文字 | 本地语音文件转文字  |
| :------- | :---------------------------------- | :----------------------------------- |
| PCM  | ❌ 不支持                            | ✅ 支持                               |
| AMR | ✅ 支持                              | ✅ 支持                               |
| MP3  | ✅ 支持                              | ✅ 支持                               |
| WAV  | ✅ 支持                              | ✅ 支持                               |
| M4A  | ✅ 支持                              | ✅ 支持                               |
| AAC  | ✅ 支持                              | ✅ 支持                               |

语音参数 `audioParams` 仅用于本地语音文件转文字。对于本地 `PCM` 文件，由于文件本身不包含完整音频头信息，必须传入 `audioParams`，以便 SDK 正确解析原始音频数据；其他格式通常可传 `null`。具体配置方式请参考 [将本地语音文件转换为文本](#将本地语音文件转换为文本)。

## 开通服务

使用该服务前，请联系环信商务进行开通。

## 使用限制

- 本地语音文件大小不能超过 10 MB，音频时长不能超过 60 秒。
- 单个 App Key 下，语音消息转文字和本地语音文件转文字两个接口的总调用频率上限为每秒 50 次。如需调整，请联系环信商务。

## 技术原理

语音转文字主要支持以下两种调用方式：

- 语音消息转文字：客户端传入语音消息对象，SDK 校验消息类型后调用底层转换能力。转换成功后，结果通过回调返回，并写入 `EMVoiceMessageBody`。
- 本地语音文件转文字：客户端传入本地语音文件路径。SDK 校验文件是否存在；若文件为 `PCM` 格式，则结合 [语音参数](#关键参数) 解析原始音频数据，再调用底层转换能力。

时序图如下所示：

![img](/images/voicetotext/voice_to_text_sequence_android.png)

处理流程如下：

**语音消息转文字**

1. App 调用 `voiceMessageToText(message, callback)` 发起语音消息转文字请求。
2. IM SDK 校验 `message` 是否为空，以及消息类型是否为语音消息。
3. 校验通过后，IM SDK 向 IM Server 发起语音消息转文字请求。
4. IM Server 执行语音识别和文本转换，并将转换结果或错误信息返回给 IM SDK。
5. IM SDK 在收到转换结果后，将文本写入 `EMVoiceMessageBody`。
6. IM SDK 通过 `callback` 将转换结果或错误信息返回给 App。

**本地语音文件转文字**

1. App 调用 `voiceFileToText(filePath, audioParams, callback)` 发起本地语音文件转文字请求。
2. IM SDK 校验 `filePath` 是否为空，并检查目标文件是否存在。
3. 如果待转换文件为 `PCM` 格式，IM SDK 还会读取 `audioParams` 中的语音参数，用于识别原始音频数据。
4. IM SDK 向 IM Server 发起本地语音文件转文字请求。
5. IM Server 执行语音识别和文本转换，并将转换结果或错误信息返回给 IM SDK。
6. IM SDK 通过 `callback` 将转换结果或错误信息返回给 App。

## 前提条件

开始前，请确保满足以下条件：

- 已将 SDK 升级至 v4.21.0 或以上版本。
- 已联系环信商务开通语音转文字服务。
- 已完成 [Android SDK 初始化](/document/android/initialization.html)，并成功 [登录](/document/android/login.html)。
- 已具备 [发送](/document/android/message_send.html#发送语音消息) 和 [接收语音消息](/document/android/message_receive.html#接收语音消息) 的基础集成能力。

## 将语音消息转换为文本

调用 `EMChatManager#voiceMessageToText` 将单条语音消息转换为文本，并通过回调返回结果。

转换成功后，可通过 `EMVoiceMessageBody#getText()` 获取对应文本。

```java
EMMessage voiceMessage = ...;

EMClient.getInstance().chatManager().voiceMessageToText(voiceMessage, new EMValueCallBack<String>() {
    @Override
    public void onSuccess(String value) {
        EMVoiceMessageBody body = (EMVoiceMessageBody) voiceMessage.getBody();
        String persistedText = body.getText();
        EMLog.d("voice-to-text", "callback text: " + value);
        EMLog.d("voice-to-text", "persisted text: " + persistedText);
    }

    @Override
    public void onError(int error, String errorMsg) {
        EMLog.e("voice-to-text", "voiceMessageToText failed, code=" + error + ", msg=" + errorMsg);
    }
});
```

#### 关键参数

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `voiceMessage` | EMMessage | 是 | 待转换的语音消息对象，消息体类型必须为 `EMVoiceMessageBody`。 |
| `callback` | `EMValueCallBack<String>` | 是 | 结果回调。成功时返回转换的文本；失败时返回错误码和错误描述。 |

#### 注意事项

- 该方法仅支持已发送成功的语音消息。
- 传入的 `EMMessage` 必须为语音消息，否则会返回 `EMError#MESSAGE_INVALID`。可通过 `EMMessage#getType` 判断消息类型。
- 转换成功后，可通过 `EMVoiceMessageBody#getText` 读取持久化的文本结果。
- 该接口支持 `AMR`、`MP3`、`WAV`、`M4A` 和 `AAC` 格式的语音消息，不支持直接转换 `PCM` 格式的语音消息。
- 如需转换 `PCM` 音频，请使用 [本地语音文件转文字接口](#将本地语音文件转换为文本)，并传入对应的 `audioParams`。

## 将本地语音文件转换为文本

调用 `EMChatManager#voiceFileToText` 可将本地语音文件转换为文本，并通过回调返回识别结果。

调用前，必须确保应用具备访问目标文件的权限，且文件路径可被当前进程读取。

```java
String filePath = "/sdcard/voice/test.pcm";

EMAudioParams audioParams = new EMAudioParams();
audioParams.setFormat(EMAudioParams.AudioFormat.PCM);
audioParams.setSampleRate(16000);
audioParams.setBitsPerSample(16);
audioParams.setChannels(1);

EMClient.getInstance().chatManager().voiceFileToText(filePath, audioParams, new EMValueCallBack<String>() {
    @Override
    public void onSuccess(String value) {
        EMLog.d("voice-to-text", "voiceFileToText success: " + value);
    }

    @Override
    public void onError(int error, String errorMsg) {
        EMLog.e("voice-to-text", "voiceFileToText failed, code=" + error + ", msg=" + errorMsg);
    }
});
```

#### 关键参数

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `filePath` | String | 是 | 本地语音文件路径。必须确保应用具备读取该路径的权限。 |
| `audioParams` | `EMAudioParams` | 否 | 语音参数。仅本地 `PCM` 文件必须传入，`MP3`、`AMR`、`WAV`、`M4A` 和 `AAC` 文件通常可传 `null`。 |
| `callback` | `EMValueCallBack<String>` | 是 | 结果回调。成功时返回转换文本；失败时返回错误码和错误描述。 |

该接口支持 `PCM`、`MP3`、`AMR`、`WAV`、`M4A` 和 `AAC` 格式的本地语音文件。

`EMAudioParams` 用于描述语音文件的格式、采样率、采样位深和声道数。对于无文件头的 `PCM` 文件，必须传入该参数；对于 `MP3`、`AMR`、`WAV`、`M4A` 和 `AAC` 等格式信息完整的文件，通常可传 `null`。

如果语音参数与原始文件不匹配，可能导致转换失败或结果异常。

```java
EMAudioParams audioParams = new EMAudioParams();
audioParams.setFormat(EMAudioParams.AudioFormat.PCM);
audioParams.setSampleRate(16000);
audioParams.setBitsPerSample(16);
audioParams.setChannels(1);
```

`EMAudioParams` 的关键成员如下：

| 成员 | 说明 |
| :--- | :--- |
| `EMAudioParams.AudioFormat` | 语音格式。仅支持配置 `PCM`、`MP3` 和 `AMR` 格式。对于 `WAV`、`M4A` 和 `AAC`，服务端会直接解析处理，SDK 仅透传文件数据，因此无需通过 `EMAudioParams` 配置格式参数。 |
| `getFormat/setFormat` | 获取或设置语音文件格式。 |
| `getSampleRate/setSampleRate` | 获取或设置采样率，单位为 Hz，建议设置为 `8000` 或 `16000`。 |
| `getBitsPerSample/setBitsPerSample` | 获取或设置采样位深，单位为 bit，例如 `16`。 |
| `getChannels/setChannels` | 获取或设置声道数，例如 `1` 表示单声道。 |

## 读取语音消息的转换结果

调用成功后，可通过 `EMVoiceMessageBody#getText` 获取语音消息中已持久化的转换文本。

- 仅当语音消息成功完成转换后，才能读取到有效文本。
- 如果消息尚未转换，或当前没有转换结果，则返回空字符串。
- 该方式适用于展示已识别结果，避免重复发起转换请求。

```java
EMMessage message = ...;
if (message.getType() == EMMessage.Type.VOICE) {
    EMVoiceMessageBody body = (EMVoiceMessageBody) message.getBody();
    String text = body.getText();
    EMLog.d("voice-to-text", "persisted text: " + text);
}
```

## 注意事项

- `voiceMessageToText` 和 `voiceFileToText` 均为异步接口，转换结果通过回调返回。
- 转换本地语音文件前，建议先校验文件是否存在且可读，避免无效调用。
- 如果本地语音文件来自外部存储、`content://` 或第三方路径，请确保应用具备读取权限，并且 SDK 能够正常将文件复制到私有目录。
- 当前语音消息转文字支持 `AMR`、`MP3`、`WAV`、`M4A` 和 `AAC` 格式的语音消息，不支持直接对 `PCM` 格式的语音消息进行转换。
- 如需转换 `PCM` 音频，请使用 [本地文件转文字接口](#将本地语音文件转换为文本)，并且传入 `EMAudioParams` 参数。
- 如果本地文件大小超过 10 MB、时长超过 60 秒，或语音参数与实际文件不匹配，可能导致识别失败。

## 常见错误与排查

#### 常见错误码

| 错误码 | 常量 | 说明 | 常见原因 | 处理建议 |
| :--- | :--- | :--- | :--- | :--- |
| 4 | `EMError#EXCEED_SERVICE_LIMIT` | 服务使用量超限。 | 测试版语音转文字服务用量超过限制。 | 检查当前服务配额或联系商务开通正式服务。 |
| 104 | `EMError#INVALID_TOKEN` | 鉴权失败。 | 当前登录状态失效，或 `token` 无效、已过期。 | 重新登录并确保鉴权状态有效。 |
| 110 | `EMError#INVALID_PARAM` | 请求参数错误。 | 请求参数缺失或非法，例如消息缺少可用的语音附件标识。 | 检查消息对象、文件路径和请求参数是否合法。 |
| 400 | `EMError#FILE_NOT_FOUND` | 语音文件不存在。 | 服务端未找到消息关联的语音文件，或本地文件路径无效。 | 检查消息附件是否可用，或确认本地文件路径是否正确。 |
| 401 | `EMError#FILE_INVALID` | 语音文件无效或格式不支持。 | 语音文件格式不支持，或文件内容异常。 | 检查文件格式、可读性和文件内容是否完整。 |
| 403 | `EMError#FILE_DOWNLOAD_FAILED` | 语音文件下载失败。 | 服务端拉取消息语音文件失败。 | 检查网络状态和服务端附件可用性。 |
| 408 | `EMError#FILE_DURATION_TOO_LONG` | 待转换语音文件时长超过限制。 | 语音时长超出 60 秒限制。 | 缩短语音时长后重试。 |
| 409 | `EMError#FILE_VOICE_TO_TEXT_FAILED` | 语音文件转文字失败。 | 语音内容识别失败，或底层转换服务调用失败。 | 检查语音内容质量、格式和参数配置是否匹配。 |
| 500 | `EMError#MESSAGE_INVALID` | 消息不合法。 | 传入 `message` 为 `null`，消息类型不是语音消息，或当前消息不是已发送成功的语音消息。 | 确保传入的是已发送成功的语音消息。 |
| 505 | `EMError#SERVICE_NOT_ENABLED` | 服务未开通。 | 当前应用未开通语音转文字服务。 | 开通语音转文字服务后再调用。 |

#### 常见问题

1. 为什么 `voiceMessageToText` 返回 `MESSAGE_INVALID`？

通常有以下原因：

- 传入的 `message` 为 `null`；
- 传入的消息类型不是语音消息；
- 当前消息不是已发送成功的语音消息；
- 当前消息中的音频格式不在支持范围内。

2. 为什么本地文件转换返回 `FILE_NOT_FOUND`？

通常有以下原因：

- `filePath` 为空；
- 文件路径错误；
- 目标文件不存在；
- 应用对该路径没有读取权限。

3. 为什么 `PCM` 文件转换失败？

常见原因包括：

- 未传入 `EMAudioParams`；
- `sampleRate`、`bitsPerSample` 或 `channels` 与原始语音不匹配；
- 实际文件并非 `PCM` 原始流格式。

4. 为什么 `EMAudioParams.AudioFormat` 不支持 `WAV`、`M4A` 和 `AAC`，但语音转文字功能仍支持这些格式？

`WAV`、`M4A` 和 `AAC` 格式由服务端直接识别和处理，Android SDK 仅负责将文件数据透传至服务端，不进行本地解析或参数校验。因此，在调用 `voiceFileToText` 时，对于这些格式的文件，`audioParams` 参数传 `null` 即可。
