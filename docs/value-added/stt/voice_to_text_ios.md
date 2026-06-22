# 语音转文字

本文介绍如何使用 iOS SDK 将语音转换为文字。

本功能从 4.21.0 版本开始支持。

## 功能说明

语音转文字功能支持将语音内容转换为文本，主要包括以下能力：

- 语音消息转文字：将已经发送成功的语音消息转换为文本。
- 本地语音文件转文字：将本地语音文件转换为文本。
- 语音参数配置：为无文件头的本地语音文件补充格式、采样率、采样位深和声道数等参数。
- 读取转文字结果：转换成功后，可通过语音消息体读取已持久化的文本结果。

## 开通服务

使用该服务前，请联系环信商务进行开通。

## 使用限制

- 本地语音文件大小不能超过 10 MB，音频时长不能超过 60 秒。
- 单个 App Key 下，语音消息转文字和语音文件转文字两个接口的总调用频率上限为每秒 50 次；如需调整，请联系商务。

## 技术原理

语音转文字主要包括以下两种方式：

- 语音消息转文字：客户端传入语音消息对象，SDK 校验消息类型后调用底层转换能力。转换成功后，结果通过回调返回，并写入 `EMVoiceMessageBody` 的 `text` 属性。
- 本地语音文件转文字：客户端传入本地语音文件路径。SDK 校验文件是否存在；如果是 `PCM` 文件，则结合 `EMVoiceParam` 中的语音参数解析原始语音数据，再调用底层转换能力。

时序图如下所示：

![img](/images/voicetotext/voice_to_text_sequence_ios.png)

流程如下：

**语音消息转文字**

1. App 调用 `voiceMessageToText:completion:` 发起语音消息转文字请求。
2. IM SDK 对传入的 `message` 进行校验，包括是否为空，以及消息类型是否为语音消息。
3. 校验通过后，IM SDK 向 IM Server 发起语音消息转文字请求。
4. IM Server 执行语音识别和文本转换，并将转换结果或错误信息返回给 IM SDK。
5. IM SDK 在收到转换结果后，将文本写入 `EMVoiceMessageBody` 的 `text` 属性。
6. IM SDK 通过 `completion` 将转换结果或错误信息返回给 App。

**本地语音文件转文字**

1. App 调用 `voiceFileToText:voiceParam:completion:` 发起本地语音文件转文字请求。
2. IM SDK 校验 `filePath` 是否为空，并检查目标文件是否存在。
3. 如果待转换文件为 PCM 格式，IM SDK 还会读取 `voiceParam` 中的语音参数，用于识别原始语音数据。
4. IM SDK 向 IM Server 发起本地语音文件转文字请求。
5. IM Server 执行语音识别和文本转换，并将转换结果或错误信息返回给 IM SDK。
6. IM SDK 通过 `completion` 将转换结果或错误信息返回给 App。

## 前提条件

开始前，请确保满足以下条件：

- 已将 SDK 升级至 v4.21.0 或以上版本。
- 已联系商务开通语音转文字服务。
- 已完成 [iOS SDK 初始化](initialization.html)，并成功 [登录](login.html)。
- 已具备 [发送](message_send.html#发送语音消息) 和 [接收语音消息](message_receive.html#接收语音消息) 的基础集成能力。

## 将语音消息转换为文本

调用 `IEMChatManager` 中的 `voiceMessageToText:completion:` 将单条语音消息转换为文本，并通过回调返回结果。

转换成功后，也可通过 `EMVoiceMessageBody.text` 获取对应文本。

```objc
EMChatMessage *voiceMessage = ...;

[[EMClient sharedClient].chatManager voiceMessageToText:voiceMessage
                                             completion:^(NSString * _Nullable text, EMError * _Nullable error) {
    if (!error) {
        EMVoiceMessageBody *body = (EMVoiceMessageBody *)voiceMessage.body;
        NSString *persistedText = body.text;
        NSLog(@"voiceMessageToText callback text: %@", text);
        NSLog(@"voiceMessageToText persisted text: %@", persistedText);
    } else {
        NSLog(@"voiceMessageToText failed, code=%ld, desc=%@", (long)error.code, error.errorDescription);
    }
}];
```

#### 关键参数

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `aMessage` | `EMChatMessage` | 是 | 待转换的语音消息对象。 |
| `aCompletionBlock` | `void (^)(NSString * _Nullable text, EMError * _Nullable error)` | 是 | 结果回调。成功时返回转换文本；失败时返回错误对象。 |

#### 注意事项

- 该方法仅支持已发送成功的语音消息。
- 传入的 `EMChatMessage` 必须是语音消息，否则会返回 `EMErrorMessageInvalid`。你可以通过判断 `message.body.type == EMMessageBodyTypeVoice` 确认消息体类型。
- 当前语音消息转文字仅支持 `AMR`、`MP3`、`WAV`、`M4A` 和 `AAC` 格式的语音消息，不支持直接对 `PCM` 格式的语音消息进行转换。
- 如需转换 PCM 音频，请使用本地语音文件转文字接口 `IEMChatManager#voiceFileToText:voiceParam:completion:`，并传入对应的 `EMVoiceParam`。
- 转换成功后，可通过 `EMVoiceMessageBody.text` 读取持久化的文本结果。

## 将本地语音文件转换为文本

调用 `IEMChatManager#voiceFileToText:voiceParam:completion:` 将本地语音文件转换为文本，并通过回调返回识别结果。

该接口支持 `PCM`、`MP3`、`AMR`、`WAV`、`M4A` 和 `AAC` 格式的本地语音文件，要求待转换文件的大小不超过 10 MB，且时长不超过 60 秒。其中，`PCM` 文件需要结合 `EMVoiceParam` 指定格式、采样率、采样位深和声道数等参数。

此外，必须确保应用具备访问目标文件的权限，且文件路径可被当前进程读取。

```objc
NSString *filePath = @"/path/to/voice/test.pcm";

EMVoiceParam *voiceParam = [[EMVoiceParam alloc] init];
voiceParam.format = EMVoiceFormatPCM;
voiceParam.sampleRate = 16000;
voiceParam.bitsPerSample = 16;
voiceParam.channels = 1;

[[EMClient sharedClient].chatManager voiceFileToText:filePath
                                          voiceParam:voiceParam
                                          completion:^(NSString * _Nullable text, EMError * _Nullable error) {
    if (!error) {
        NSLog(@"voiceFileToText success: %@", text);
    } else {
        NSLog(@"voiceFileToText failed, code=%ld, desc=%@", (long)error.code, error.errorDescription);
    }
}];
```

#### 关键参数

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `aFilePath` | NSString  | 是 | 本地语音文件路径。必须确保应用具备读取该路径的权限。 |
| `aVoiceParam` | `EMVoiceParam` | 否 | 语音参数。对于 `PCM` 文件必须传入；对于 `MP3`、`AMR`、`WAV`、`M4A` 和 `AAC` 文件，可传 `nil`。 |
| `aCompletionBlock` | `void (^)(NSString * _Nullable text, EMError * _Nullable error)` | 是 | 结果回调。成功时返回转换文本；失败时返回错误对象。 |

## 配置语音文件识别的语音参数

`EMVoiceParam` 类用于描述本地语音文件的基础语音属性，包括语音文件格式、采样率、采样位深和声道数，帮助 SDK 正确解析原始语音数据。

- 对于 `PCM` 文件，由于缺少文件头信息，必须提供该参数。
- 对于 `MP3`、`AMR`、`WAV`、`M4A` 和 `AAC` 文件，通常无需显式配置该对象。
- 如果语音参数与原始文件不匹配，可能导致转换失败或结果异常。

```objc
EMVoiceParam *voiceParam = [[EMVoiceParam alloc] init];
voiceParam.format = EMVoiceFormatPCM;
voiceParam.sampleRate = 16000;
voiceParam.bitsPerSample = 16;
voiceParam.channels = 1;
```

`EMVoiceParam` 中的关键成员如下：

| 成员 | 说明 |
| :--- | :--- |
| `EMVoiceFormat` | 语音格式枚举。当前支持 `EMVoiceFormatPCM`、`EMVoiceFormatMP3`、`EMVoiceFormatAMR`、`EMVoiceFormatWAV`、`EMVoiceFormatM4A` 和 `EMVoiceFormatAAC`。 |
| `format` | 语音文件格式。 |
| `sampleRate` | 采样率，单位为 Hz，例如 `8000` 或 `16000`。 |
| `bitsPerSample` | 采样位深，单位为 bit，例如 `16`。 |
| `channels` | 声道数，例如 `1` 表示单声道。 |

## 读取语音消息的转换结果

使用 `EMVoiceMessageBody.text` 获取语音消息中已持久化的转换文本。

- 仅当语音消息成功完成转换后，才能读取到有效文本。
- 如果消息尚未转换，或当前没有转换结果，则读取到的文本为空。
- 该方式适用于二次展示场景时直接读取，避免重复发起转换。

```objc
EMChatMessage *message = ...;
if (message.body.type == EMMessageBodyTypeVoice) {
    EMVoiceMessageBody *body = (EMVoiceMessageBody *)message.body;
    NSString *text = body.text;
    NSLog(@"persisted text: %@", text);
}
```

## 注意事项

- `voiceMessageToText:completion:` 和 `voiceFileToText:voiceParam:completion:` 均为异步接口，转换结果通过回调返回。
- 转换本地语音文件前，建议先校验文件是否存在且可读，避免无效调用。
- 如果本地语音文件来自沙盒外部目录、文件提供器或第三方路径，请确保应用具备读取权限，并且路径可被当前进程访问。
- 如果本地文件大小（10 MB）或时长（60 秒）超过限制，或音频格式与参数不匹配，可能导致识别失败。
- `PCM` 音频仅支持通过 [本地文件转文字接口](#将本地语音文件转换为文本) 进行转换，不支持通过 [语音消息转文字接口](#将语音消息转换为文本) 直接转换。
- 对于 `PCM` 本地语音文件，调用 `voiceFileToText:voiceParam:completion:` 时必须传入 `EMVoiceParam`，语音参数配置错误通常会直接导致转换失败或结果异常。

## 常见错误与排查

#### 常见错误码

| 错误码 | 常量 | 说明 | 常见原因 | 处理建议 |
| :--- | :--- | :--- | :--- | :--- |
| 4 | `EMErrorExceedServiceLimit` | 服务使用量超限。 | 测试版语音转文字服务用量超过限制。 | 检查当前服务配额或联系商务开通正式服务。 |
| 104 | `EMErrorInvalidToken` | 鉴权失败。 | 当前登录状态失效，或 `token` 无效、已过期。 | 重新登录并确保鉴权状态有效。 |
| 110 | `EMErrorInvalidParam` | 请求参数错误。 | 请求参数缺失或非法，例如文件路径为空或参数格式错误。 | 检查消息对象、文件路径和语音参数是否合法。 |
| 400 | `EMErrorFileNotFound` | 语音文件不存在。 | 服务端未找到消息关联的语音文件，或本地文件路径无效。 | 检查消息附件是否可用，或确认本地文件路径是否正确。 |
| 401 | `EMErrorFileInvalid` | 语音文件无效或格式不支持。 | 语音文件格式不支持，或文件内容异常。 | 检查文件格式、可读性和文件内容是否完整。 |
| 403 | `EMErrorFileDownloadFailed` | 语音文件下载失败。 | 服务端拉取消息语音文件失败。 | 检查网络状态和服务端附件可用性。 |
| 408 | `EMErrorFileDurationTooLong` | 待转换语音文件时长超过限制。 | 语音时长过长，超出服务端 60 秒限制。 | 缩短语音时长后重试。 |
| 409 | `EMErrorFileVoiceToTextFailed` | 语音文件转文字失败。 | 语音内容识别失败，或底层转换服务调用失败。 | 检查语音内容质量、格式和参数是否匹配。 |
| 500 | `EMErrorMessageInvalid` | 消息不合法。 | 传入的消息为空、消息类型不是语音消息，或当前消息不是已发送成功的语音消息。 | 确保传入的是已发送成功的语音消息。 |
| 505 | `EMErrorServiceNotEnable` | 服务未开通。 | 当前应用未开通语音转文字服务。 | 开通语音转文字服务后再调用。 |

#### 常见问题

1. 为什么 `voiceMessageToText:completion:` 返回 `EMErrorMessageInvalid`？

通常有以下原因：

- 传入的 `message` 为 `nil`；
- 传入的消息类型不是语音消息；
- 当前消息不是已发送成功的语音消息；
- 当前消息中的语音附件不满足接口的支持范围。

2. 为什么本地文件转换返回 `EMErrorFileNotFound`？

通常有以下原因：

- `filePath` 为空；
- 文件路径错误；
- 目标文件不存在；
- 应用对该路径没有读取权限。

3. 为什么 `PCM` 文件转换失败？

常见原因包括：

- 未传入 `EMVoiceParam`；
- `sampleRate`、`bitsPerSample` 或 `channels` 与原始语音不匹配；
- 实际文件并非 `PCM` 原始流格式。
