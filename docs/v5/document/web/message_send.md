# 发送消息

## 功能说明

环信即时通讯 IM SDK 支持发送文本、图片、语音、视频、文件、位置、透传、自定义和合并消息。

- 发送消息的功能统一由 `ChatManager` 提供，标准流程为先创建消息对象，再调用 `sendMessage` 发送。
- 单聊默认支持陌生人之间发送消息，无需先添加好友即可聊天。若你的应用只允许好友之间互发单聊消息，你需要在环信控制台 [开启好友关系检查](/product/console/basic_user.html#好友关系检查)。
- 对于群组和聊天室，用户每次只能向所属的单个群组和聊天室发送消息。

## 前提条件

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 初始化 SDK 时已注册 `ChatManager`，能够通过 `client.chatManager` 调用会话与消息相关接口。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 发送消息统一流程

发送消息的推荐流程如下：

1. 确定消息类型、会话 ID 和会话类型。。
2. 准备该类型消息所需的业务数据，例如文本内容、本地文件、远程 URL、位置坐标、合并转发的原始消息列表。
3. 调用 `client.chatManager.create*Message()` 创建消息对象。
4. 调用 `client.chatManager.sendMessage(message, options?)` 发送消息。
5. 监听发送回调或 `Promise` 结果，更新 UI、重试状态或上传进度。

例如，发送文本消息的示例代码如下：

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: "user2",
  // 单聊、群组聊天和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
  conversationType: "singleChat",
  content: "Hello!",
});

const sentMessage = await client.chatManager.sendMessage(message);
```

:::tip
- `sendMessage` 的 Promise 成功返回，表示该消息已经完成 SDK 发送流程。
- 接收方以及发送方的其他在线设备会通过 `onMessage` 事件收到消息。
- 附件类消息会先上传附件，再发送消息体。
:::

## 通用消息创建参数

各类消息的创建方法 `create*Message()` 都支持以下基础参数：

| 参数                   | 类型                    | 必填/可选   | 适用场景              | 说明                                                                                                 |
| :--------------------- | :---------------------- | :---------- | :-------------------- | :---------------------------- | 
| `conversationId`       | String                  | 必填        | 所有消息              | 会话 ID。单聊时为对端用户 ID，群聊时为群组 ID，聊天室时为聊天室 ID。   |
| `conversationType`     | `singleChat` / `groupChat` / `chatRoom`           | 必填              | 所有消息   | 指定单聊、群聊或聊天室。             |
| `ext`                  | `Record<string, unknown>` | 可选        | 所有消息              | 扩展字段，需可 JSON 序列化，建议放业务附加信息，如埋点、卡片元数据、审核外字段。                     |
| `timestamp`            | Number                  | 可选        | 所有消息              | 本地时间戳，单位毫秒。不传时由 SDK 自动生成。                                                        |
| `deliverOnlineOnly`    | Boolean                 | 可选        | 文本、透传、自定义等  | 是否仅投递给在线用户。适合输入状态、瞬时控制消息，不需要离线保存。                                   |
| `webhookEnv`           | String                  | 可选        | 所有消息              | Webhook 路由环境标识。服务端会根据该字段进行回调路由匹配。需要区分开发、测试或灰度等回调环境时使用。 |
| `priority`             | `high` / `low` / `normal`                | 可选      | 聊天室消息 | 聊天室高并发时为重要消息提高优先级。 |
| `receiverList`         | String[]                | 可选        | 群组/聊天室的定向消息 | 群组或聊天室里只发给指定成员时使用。    |
| `needReadReceipt` | Boolean                 | 可选        | 群聊消息              | 需要统计群消息已读情况时使用。                                                                       |

## 接口频率限制

如果服务端配置了发送频率限制，单聊、群聊或聊天室中超出单用户发送上限时，SDK 可能抛出错误码 `509`，即 `MESSAGE_CURRENT_LIMITING`。

## 发送文本消息

#### 发送流程

发送文本消息时，请按以下步骤操作：

1. 调用 `createTextMessage` 创建文本消息。

对于普通聊天消息，仅传入 `conversationId`、`conversationType` 和 `content` 即可。此外，也可传入业务所需的可选参数，例如，扩展字段和目标翻译语言等。部分参数仅在特定会话类型下生效。例如，`needReadReceipt` 仅适用于群聊场景。`receiverList` 仅适用于群组和聊天室发送 [定向消息](message_target.html) 的场景。

2. 调用 `sendMessage` 发送文本消息。
   发送时可通过回调参数或返回的 `Promise` 获取发送状态。

示例代码如下所示：

```typescript
const message = client.chatManager.createTextMessage({
  // 接收方：单聊为对方用户 ID，群聊为群组 ID，聊天室为聊天室 ID。
  conversationId: "user2",
  // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
  conversationType: "singleChat",
  // 消息的文本内容。
  content: "Hello!",
});

await client.chatManager.sendMessage(message);
```

#### 关键参数

| 参数                   | 类型                    | 必填/可选 | 适用场景                     | 说明                                                                                                             |
| :--------------------- | :---------------------- | :-------- | :--------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| `content`              | String                  | 必填      | 普通聊天、通知正文、说明文本 | 文本消息的核心内容。                                                                                             |
| `targetLanguages`      | String[]                | 可选      | 发送即翻译                   | 发送时附带目标翻译语言，适用于需要即时翻译的文本消息场景。                                                       |
| `ext`                  | `Record<string, unknown>` | 可选      | 业务扩展信息                 | 用于传递业务附加字段，需保持 JSON 可序列化。建议将业务附加数据放入该字段，而不要将复杂业务结构直接写入文本正文。 |
| `deliverOnlineOnly`    | Boolean                 | 可选      | 瞬时消息、状态通知           | 是否仅投递给在线用户。                                                                                           |
| `webhookEnv`           | String                  | 可选      | 多环境回调路由               | 用于区分不同 Webhook 回调环境。                                                                                  |
| `receiverList`         | String[]                | 可选      | 群聊/聊天室定向消息          | 指定群聊中的定向接收者，仅群聊和聊天室有效。                                                                     |
| `needReadReceipt` | Boolean                 | 可选      | 群消息已读统计               | 是否需要群消息已读回执，仅群聊有效。                                                                             |
| `priority`             | String                  | 可选      | 聊天室优先级控制             | 消息优先级，仅用于聊天室场景。                                                                                   |

#### 带群已读回执和扩展字段的示例

对于带业务属性的文本消息，建议通过 `ext` 承载业务附加字段。对于群聊场景，如需统计成员已读情况，可启用 `needReadReceipt`。

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: "group_001",
  conversationType: "groupChat",
  content: "大家好",
  // 扩展字段
  ext: { bizType: "announcement" },
  // 是否需要群消息已读回执
  needReadReceipt: true,
});

await client.chatManager.sendMessage(message);
```

## 发送附件消息

#### 基本说明

图片、语音、视频和文件消息都属于附件消息。发送附件消息时，SDK 会根据传入的资源类型，完成消息创建、附件上传和消息发送等流程。

附件消息通常有两种构造方式：

- `data`：传入本地文件对象，由 SDK 负责上传附件。
- `originalUrl`：传入远程文件地址，适用于附件已上传到业务服务器或 CDN 的场景。此时 SDK 直接使用该地址构造消息，不再执行本地上传。详见 [上传消息附件至自有服务器](#上传消息附件至自有服务器)。 

#### 发送流程

附件消息的发送统一遵循以下通用步骤：

1. **准备资源**：传入本地文件对象（`data`）或已存在的远程文件地址（`originalUrl`）。
2. **创建消息**：根据附件类型调用对应的 `createImageMessage()`、`createVoiceMessage()`、`createVideoMessage()` 或 `createFileMessage()` 方法。
3. **发送消息**：调用 `sendMessage()` 发送。
   - 传 `data` 时，SDK 先上传附件再发送消息体。
   - 传 `originalUrl` 时，SDK 直接使用远程地址发送。
     对于图片消息，传入 `originalUrl` 后，SDK 会将该地址作为原图地址，并默认生成大图和缩略图对应的访问地址。

#### 资源处理说明

- 图片消息发送后，服务端会自动生成缩略图。
- 视频消息发送后，通常以视频首帧作为缩略图。
- 不同附件类型在创建消息时，除通用会话参数外，还需传入各自特有的业务参数，例如图片宽高、语音时长、视频时长、文件名等。

消息附件大小和存储限制，详见 [消息附件限制说明](limitation.html#消息存储)。

### 发送图片消息

图片消息通常涉及以下三类图片资源：

- 原图：发送方本地选择的原始图片文件，通常用于查看或保存原图。
- 大图：SDK 客户端基于原图进行等比压缩后的图片。压缩规则为：若图片短边大于 720 像素，则等比压缩至短边为 720 像素；若短边小于等于 720 像素，则保留原图尺寸，不做放大处理。此类图片通常用于聊天详情页展示。
- 缩略图：服务端基于原图进行等比压缩后的图片。压缩规则为：默认情况下，若图片短边大于 170 像素，则等比压缩至短边为 170 像素；若短边小于等于 170 像素，则保留原图尺寸，不做放大处理。缩略图的压缩方式和尺寸可在 [控制台进行配置](/product/console/basic_message.html#图片消息缩略图)。此类图片通常用于会话列表、聊天列表等轻量展示场景。

#### 发送流程

发送图片消息时，请按以下流程执行：

1. 准备图片资源。
   若发送本地图片，需获取本地图片文件；若发送已上传到业务服务器或 CDN 的图片，需准备远程图片地址。
2. 创建图片消息。
   调用 `createImageMessage` 创建图片消息，并根据业务需要传入会话信息、图片资源、图片宽高、是否为 GIF、是否按原图发送等参数。
3. 发送图片消息。
   调用 `sendMessage` 发送消息。
   - 当传入 `data` 时，SDK 会先上传本地图片，再发送消息。
   - 当传入 `originalUrl` 时，SDK 会使用远程地址构造并发送消息，不再执行本地上传。对于图片消息，SDK 会将该地址作为原图地址，并默认补全大图和缩略图对应的访问地址。详见 [上传消息附件至自有服务器](#上传消息附件至自有服务器)。

下面的示例代码为传入本地图片文件，创建并发送图片消息：

```typescript
// 选择本地图片文件。
const fileInput = document.getElementById("imageInput") as HTMLInputElement;
const file = fileInput.files?.[0];

if (!file) {
  throw new Error("No image file selected.");
}

// 创建一条图片消息。
const message = client.chatManager.createImageMessage({
  // 接收方：单聊为对方用户 ID，群聊为群组 ID，聊天室为聊天室 ID。
  conversationId: "user2",
  // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
  conversationType: "singleChat",
  // 本地图片文件。若使用远程图片资源，应传 `originalUrl`，而不是 `originalImageUrl`。
  data: file,
  // 可选：图片宽高。建议在已知时传入，便于消息列表和预览展示。
  width: 800,
  height: 600,
  // 可选：是否按原图发送。
  // `true` 表示按原图发送；`false` 表示按大图发送。
  // 默认值为 `false`。
  isOriginalImage: false,
});

await client.chatManager.sendMessage(message);
```

#### 关键参数

| 参数              | 类型           | 必填/可选                   | 适用场景           | 说明                                                              |
| :---------------- | :------------- | :-------------------------- | :----------------- | :---------------------------------------------------------------- |
| `data`            | CompatibleFile | 与 `originalUrl` 二选一必填 | 本地选图发送       | 本地图片文件。传入后由 SDK 负责上传。                             |
| `originalUrl`     | String         | 与 `data` 二选一必填        | 远程图片直发       | 图片已存储在业务服务器或 CDN 时使用。SDK 不再执行本地上传。       |
| `filename`        | String         | 可选                        | 需要保留文件名     | 本地或远程图片场景下均可传入。                                    |
| `filetype`        | String         | 可选                        | 需要明确 MIME 类型 | 例如 `image/png`、`image/gif`。                                   |
| `width`           | Number         | 可选                        | 聊天列表、预览展示 | 图片宽度。建议在已知时传入。                                      |
| `height`          | Number         | 可选                        | 聊天列表、预览展示 | 图片高度。通常与 `width` 配合使用。                               |
| `isGif`           | Boolean        | 可选                        | GIF 动图           | 标识当前图片是否为 GIF。                                          |
| `isOriginalImage` | Boolean        | 可选                        | 原图发送           | `true` 表示按原图发送，`false` 表示按大图发送。默认值为 `false`。 |
| `fileLength`      | Number         | 可选                        | 需要补充文件大小   | 对界面展示或业务校验有帮助时可传入。                              |
| `thumbnailUrl`    | String         | 可选                        | 自定义缩略图资源   | 远程图片资源场景下较常见。                                        |

:::tip
- `data` 和 `originalUrl` 至少传一个。
  - 传 `data` 时，SDK 会先使用本地文件创建消息，并在发送前自动上传。
  - 传 `originalUrl` 时，SDK 使用已有远程地址构造图片消息，不再负责本地上传。
- `isOriginalImage` 用于表达是否按原图发送。在远程图片场景下，SDK 会按该语义组织图片消息信息。
- `width` 和 `height` 虽非必填，但建议在已知时传入，以提升前端渲染的稳定性和一致性。
:::

### 发送 GIF 图片

GIF 图片消息属于图片消息的特殊场景，其创建方式与普通图片消息一致，但需额外标识当前资源为 GIF。

- GIF 图片消息仍通过 `createImageMessage` 创建。
- GIF 图片的缩略图生成逻辑与普通图片消息一致。
- GIF 图片发送时不应按静态图片压缩处理。

#### 发送流程

发送 GIF 图片时，请按以下流程执行：

1. 准备 GIF 图片资源。
   可为本地 GIF 文件，也可为已上传的远程 GIF 地址。
2. 创建图片消息。
   调用 `createImageMessage`，并设置 `isGif: true`。
3. 发送图片消息。
   调用 `sendMessage` 完成 GIF 图片消息发送。

示例代码如下所示：

```typescript
const message = client.chatManager.createImageMessage({
  // 接收方：单聊为对方用户 ID，群聊为群组 ID，聊天室为聊天室 ID。
  conversationId: "user2",
  // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
  conversationType: "singleChat",
  // 本地 GIF 文件对象。
  data: gifFile,
  // 是否为 GIF 图片。发送 GIF 图片时应设置为 `true`。
  isGif: true,
});

await client.chatManager.sendMessage(message);
```

:::tip
- 发送 GIF 时，建议显式设置 `isGif: true`，以避免按普通静态图片处理。
- 各参数的描述，详见 [发送图片消息](#发送图片消息)。
- 若 GIF 已上传至业务服务器或 CDN，可通过 `originalUrl` 方式发送。详见 [上传消息附件至自有服务器](#上传消息附件至自有服务器) 的说明。
- 若业务侧对附件上传链路有统一要求，建议先完成自有上传，再通过 `originalUrl` 发送 GIF 图片消息。
:::

### 发送语音消息

语音消息通常包含语音文件资源和语音时长信息，用于语音聊天、语音留言等场景。

#### 发送流程

发送语音消息时，请按以下流程执行：

1. 准备语音资源。
   若发送本地语音，需获取本地语音文件；若发送已上传到业务服务器或 CDN 的语音，需准备远程语音地址。同时，需准备语音时长，单位为秒。
2. 创建语音消息。
   调用 `createVoiceMessage` 创建语音消息，并根据业务需要传入会话信息、语音资源、语音时长及其他可选参数。
3. 发送语音消息。
   调用 `sendMessage` 发送消息。
   - 当传入 `data` 时，SDK 会先上传本地语音文件，再发送消息。
   - 当传入 `originalUrl` 时，SDK 直接使用远程地址构造并发送消息，不再执行本地上传。详见 [上传消息附件至自有服务器](#上传消息附件至自有服务器) 的说明。

下面的示例代码为传入本地语音文件，创建并发送语音消息：

```typescript
// 本地语音文件对象。
const audioFile = selectedAudioFile;

// 创建一条语音消息。
const message = client.chatManager.createVoiceMessage({
  // 接收方：单聊为对方用户 ID，群聊为群组 ID，聊天室为聊天室 ID。
  conversationId: "user2",
  // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
  conversationType: "singleChat",
  // 本地语音文件。若使用远程语音资源，应传 `originalUrl`。
  data: audioFile,
  // 语音时长，单位为秒。
  duration: 5,
  // 可选：语音文件名。
  filename: "voice.amr",
  // 可选：语音文件 MIME 类型。
  filetype: "audio/amr",
});

await client.chatManager.sendMessage(message);
```

#### 关键参数

| 参数          | 类型           | 必填/可选                   | 适用场景           | 说明                                                        |
| :------------ | :------------- | :-------------------------- | :----------------- | :---------------------------------------------------------- |
| `data`        | CompatibleFile | 与 `originalUrl` 二选一必填 | 本地语音发送       | 本地语音文件。传入后由 SDK 负责上传。                       |
| `originalUrl` | String         | 与 `data` 二选一必填        | 远程语音直发       | 语音已存储在业务服务器或 CDN 时使用。SDK 不再执行本地上传。 |
| `filename`    | String         | 可选                        | 需要保留文件名     | 本地或远程语音场景下均可传入。                              |
| `filetype`    | String         | 可选                        | 需要明确 MIME 类型 | 例如 `audio/amr`、`audio/mpeg`。                            |
| `duration`    | Number         | 必填                        | 语音消息发送       | 语音时长，单位为秒。                                        |
| `fileLength`  | Number         | 可选                        | 需要补充文件大小   | 对界面展示或业务校验有帮助时可传入。                        |

:::tip
- `data` 和 `originalUrl` 至少传一个。
  - 传 `data` 时，SDK 会先使用本地文件创建消息，并在发送前自动上传。
  - 传 `originalUrl` 时，SDK 使用已有远程地址构造语音消息，不再负责本地上传。
- `duration` 为必填参数，创建语音消息时必须传入。
:::

### 发送视频消息

视频消息通常包含视频文件资源、视频时长，以及可选的视频宽高和缩略图地址，用于短视频、视频消息等场景。

#### 发送流程

发送视频消息时，请按以下流程执行：

1. 准备视频资源。
   若发送本地视频，需获取本地视频文件；若发送已上传到业务服务器或 CDN 的视频，需准备远程视频地址。同时，需准备视频时长；如已知，也可补充视频宽高和缩略图地址。
2. 创建视频消息。
   调用 `createVideoMessage` 创建视频消息，并根据业务需要传入会话信息、视频资源、视频时长、视频宽高及缩略图地址等参数。
3. 发送视频消息。
   调用 `sendMessage` 发送消息。
   - 当传入 `data` 时，SDK 会先上传本地视频文件，再发送消息。
   - 当传入 `originalUrl` 时，SDK 直接使用远程地址构造并发送消息，不再执行本地上传。详见 [上传消息附件至自有服务器](#上传消息附件至自有服务器) 的说明。

下面的示例代码为传入本地视频文件，创建并发送视频消息：

```typescript
// 本地视频文件对象。
const videoFile = selectedVideoFile;

// 创建一条视频消息。
const message = client.chatManager.createVideoMessage({
  // 接收方：单聊为对方用户 ID，群聊为群组 ID，聊天室为聊天室 ID。
  conversationId: "user2",
  // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
  conversationType: "singleChat",
  // 本地视频文件。若使用远程视频资源，应传 `originalUrl`。
  data: videoFile,
  // 视频时长，单位为秒。
  duration: 30,
  // 可选：视频宽度。
  width: 1280,
  // 可选：视频高度。
  height: 720,
  // 可选：视频文件名。
  filename: "video.mp4",
  // 可选：视频文件 MIME 类型。
  filetype: "video/mp4",
  // 可选：视频缩略图地址。适用于业务侧已生成缩略图的场景。
  thumbnailUrl: "https://example.com/thumb.jpg",
});

await client.chatManager.sendMessage(message);
```

#### 关键参数

| 参数           | 类型           | 必填/可选                   | 适用场景             | 说明                                                        |
| :------------- | :------------- | :-------------------------- | :------------------- | :---------------------------------------------------------- |
| `data`         | CompatibleFile | 与 `originalUrl` 二选一必填 | 本地视频发送         | 本地视频文件。传入后由 SDK 负责上传。                       |
| `originalUrl`  | String         | 与 `data` 二选一必填        | 远程视频直发         | 视频已存储在业务服务器或 CDN 时使用。SDK 不再执行本地上传。 |
| `filename`     | String         | 可选                        | 需要保留文件名       | 本地或远程视频场景下均可传入。                              |
| `filetype`     | String         | 可选                        | 需要明确 MIME 类型   | 例如 `video/mp4`。                                          |
| `duration`     | Number         | 必填                        | 视频消息发送         | 视频时长，单位为秒。                                        |
| `width`        | Number         | 可选                        | 聊天列表、预览展示   | 视频宽度。建议在已知时传入。                                |
| `height`       | Number         | 可选                        | 聊天列表、预览展示   | 视频高度。通常与 `width` 配合使用。                         |
| `fileLength`   | Number         | 可选                        | 需要补充文件大小     | 对界面展示或业务校验有帮助时可传入。                        |
| `thumbnailUrl` | String         | 可选                        | 自定义视频缩略图资源 | 业务侧已生成视频缩略图时使用。                              |

:::tip
- `data` 和 `originalUrl` 至少传一个。
  - 传 `data` 时，SDK 会先使用本地文件创建消息，并在发送前自动上传。
  - 传 `originalUrl` 时，SDK 使用已有远程地址构造视频消息，不再负责本地上传。
- `duration` 为必填参数，创建视频消息时必须传入。
- `width` 和 `height` 虽非必填，但建议在已知时传入，以提升前端渲染的稳定性和一致性。
:::

### 发送文件消息

文件消息适用于发送文档、压缩包、表格、演示文稿等各类通用文件资源。

#### 发送流程

发送文件消息时，请按以下流程执行：

1. 准备文件资源。
   若发送本地文件，需获取本地文件对象；若发送已上传到业务服务器或 CDN 的文件，需准备远程文件地址。根据业务需要，也可补充文件名、MIME 类型和文件大小信息。
2. 创建文件消息。
   调用 `createFileMessage` 创建文件消息，并根据业务需要传入会话信息、文件资源及其他可选参数。
3. 发送文件消息。
   调用 `sendMessage` 发送消息。
   - 当传入 `data` 时，SDK 会先上传本地文件，再发送消息。
   - 当传入 `originalUrl` 时，SDK 直接使用远程地址构造并发送消息，不再执行本地上传。详见 [上传消息附件至自有服务器](#上传消息附件至自有服务器) 的说明。

下面的示例代码为传入本地文件，创建并发送文件消息：

```typescript
// 本地文件对象。
const selectedFile = fileInput.files?.[0];

if (!selectedFile) {
  throw new Error("No file selected.");
}

// 创建一条文件消息。
const message = client.chatManager.createFileMessage({
  // 接收方：单聊为对方用户 ID，群聊为群组 ID，聊天室为聊天室 ID。
  conversationId: "user2",
  // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
  conversationType: "singleChat",
  // 本地文件。若使用远程文件资源，应传 `originalUrl`。
  data: selectedFile,
  // 可选：文件名。建议在已知时传入，便于消息列表和下载展示。
  filename: "document.pdf",
  // 可选：文件 MIME 类型。
  filetype: "application/pdf",
  // 可选：文件大小，单位为字节。
  fileSize: 102400,
});

await client.chatManager.sendMessage(message);
```

#### 关键参数

| 参数          | 类型           | 必填/可选                   | 适用场景           | 说明                                                        |
| :------------ | :------------- | :-------------------------- | :----------------- | :---------------------------------------------------------- |
| `data`        | CompatibleFile | 与 `originalUrl` 二选一必填 | 本地文件发送       | 本地文件。传入后由 SDK 负责上传。                           |
| `originalUrl` | String         | 与 `data` 二选一必填        | 远程文件直发       | 文件已存储在业务服务器或 CDN 时使用。SDK 不再执行本地上传。 |
| `filename`    | String         | 可选                        | 文件展示、下载展示 | 建议传入，便于界面显示和用户下载识别。                      |
| `filetype`    | String         | 可选                        | 文件类型识别       | 例如 `application/pdf`、`application/zip`。                 |
| `fileSize`    | Number         | 可选                        | 文件大小展示       | 用于界面展示更直接。                                        |
| `fileLength`  | Number         | 可选                        | 服务端兼容字段     | 与部分服务端字段兼容时使用。                                |

:::tip
- `data` 和 `originalUrl` 至少传一个。
  - 传 `data` 时，SDK 会先使用本地文件创建消息，并在发送前自动上传。
  - 传 `originalUrl` 时，SDK 使用已有远程地址构造文件消息，不再负责本地上传。
- `fileSize` 更适合用于界面展示；`fileLength` 更偏向服务端兼容字段，使用时应根据业务需要选择。
:::

### 上传消息附件至自有服务器

若消息附件需上传至你自己的服务器或 CDN，而非环信服务器，建议由业务侧先完成附件上传，再在创建消息时传入附件的远程地址。该方式适用于以下场景：

- 业务侧已有统一的附件上传服务；
- 附件需经过业务侧鉴权、转码、压缩或 CDN 分发；
- 不希望由 SDK 直接上传本地附件到环信服务器。

发送消息的具体流程如下：

1. 业务侧先将图片、语音、视频或文件上传至自有服务器。
2. 获取附件的远程访问地址。
3. SDK 初始化配置中开启 `useCustomAttachmentUpload`。
4. 创建对应类型的消息时，不传本地文件 `data`，而是传入远程地址 `originalUrl`。
   SDK 直接使用该远程地址构造并发送消息，不再执行本地上传。
5. 调用 `sendMessage()` 发送消息。

下面的示例代码为业务侧已将图片上传至自有服务器，创建并发送图片消息。

```typescript
const message = client.chatManager.createImageMessage({
  // 接收方：单聊为对方用户 ID，群聊为群组 ID，聊天室为聊天室 ID。
  conversationId: "user2",
  // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
  conversationType: "singleChat",
  // 已上传到自有服务器的图片地址。
  originalUrl: "https://static.example.com/chat/image_001.jpg",
  // 可选：图片宽高。建议在已知时传入，便于消息列表和预览展示。
  width: 800,
  height: 600,
  // 可选：自有服务器生成的缩略图地址。
  thumbnailUrl: "https://static.example.com/chat/thumb_001.jpg",
  // 可选：图片文件名。
  filename: "image_001.jpg",
  // 可选：图片 MIME 类型。
  filetype: "image/jpeg",
  // 可选：是否按原图发送。
  isOriginalImage: true,
});

await client.chatManager.sendMessage(message);
```

## 发送位置消息

位置消息用于发送地理位置信息，通常包括位置点的经纬度和地址描述。该消息类型不涉及附件上传。发送位置消息前，业务侧需接入第三方地图或定位服务，以获取准确的经纬度信息；如有需要，还可补充位置名称、建筑名称或地址描述，用于优化消息展示效果。

#### 发送流程

发送位置消息时，请按以下流程执行：

1. 准备位置数据。
   业务侧需接入地图或定位服务，获取目标位置的经纬度；如有需要，也可补充地址描述或建筑名称。
2. 创建位置消息。
   调用 `createLocationMessage` 创建位置消息，并传入会话信息、经纬度及位置描述等参数。
3. 调用 `sendMessage` 发送消息。

下面的示例代码为创建并发送位置消息：

```
// 创建一条位置消息。
const message = client.chatManager.createLocationMessage({
  // 接收方：单聊为对方用户 ID，群聊为群组 ID，聊天室为聊天室 ID。
  conversationId: 'user2',
  // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
  conversationType: 'singleChat',
  // 位置纬度。
  latitude: 39.9042,
  // 位置经度。
  longitude: 116.4074,
  // 可选：位置地址描述。
  address: '北京市天安门广场',
  // 可选：建筑名称。
  buildingName: '天安门',
});

await client.chatManager.sendMessage(message);
```

#### 关键参数

| 参数           | 类型   | 必填/可选 | 适用场景           | 说明                             |
| :------------- | :----- | :-------- | :----------------- | :------------------------------- |
| `latitude`     | Number | 必填      | 发送位置消息       | 位置纬度。                       |
| `longitude`    | Number | 必填      | 发送位置消息       | 位置经度。                       |
| `address`      | String | 可选      | 地图展示、聊天展示 | 位置地址描述。建议在已知时传入。 |
| `buildingName` | String | 可选      | 地标展示           | 建筑名称或地点名称。             |

#### 逻辑说明

- `latitude` 和 `longitude` 为必填参数，创建位置消息时必须传入。
- `address` 和 `buildingName` 为可选参数，但建议在已知时传入，以提升消息展示的可读性。
- 位置消息不涉及附件上传，因此创建后可直接发送。

## 发送透传消息

透传消息用于通知接收方执行某种业务动作，通常不直接作为普通聊天内容展示，例如输入状态提示、控制信令、业务指令等。

具体功能可以根据自身业务需求自定义，例如实现头像、昵称的更新等。另外，以 `em_` 和 `easemob::` 开头的 action 为内部保留字段，注意不要使用。

:::tip
- 透传消息发送后，不支持撤回。
- 透传消息不会存入本地数据库中，所以在 UI 上不会显示。
:::

#### 发送流程

发送透传消息时，请按以下流程执行：

1. 准备透传动作。
   定义透传消息对应的业务动作名称，例如输入中、停止输入、业务控制指令等。
2. 创建透传消息。
   调用 `createCmdMessage` 创建透传消息，并传入会话信息、动作名称及其他可选参数。
3. 发送透传消息。
   调用 `sendMessage` 发送消息。
   如需仅向在线用户投递，可设置 `deliverOnlineOnly: true`。

透传消息发送后，应由接收方自行处理，不应按普通文本消息展示。

下面的示例代码为创建并发送透传消息：

```
// 创建一条透传消息。
const message = client.chatManager.createCmdMessage({
  // 接收方：单聊为对方用户 ID，群聊为群组 ID，聊天室为聊天室 ID。
  conversationId: 'user2',
  // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
  conversationType: 'singleChat',
  // 透传动作名称。
  action: 'TypingBegin',
  // 可选：是否仅投递给在线用户。
  deliverOnlineOnly: true,
});

await client.chatManager.sendMessage(message);
```

#### 关键参数

| 参数                | 类型                    | 必填/可选 | 适用场景                     | 说明                     |
| :------------------ | :---------------------- | :-------- | :--------------------------- | :----------------------- |
| `action`            | String                  | 必填      | 输入状态、控制信令、业务指令 | 透传消息的动作名称。     |
| `deliverOnlineOnly` | Boolean                 | 可选      | 瞬时状态通知                 | 是否仅投递给在线用户。   |
| `ext`               | `Record<string, unknown>` | 可选      | 业务扩展信息                 | 用于携带附加业务上下文。 |

## 发送自定义类型消息

自定义消息适用于承载业务事件，例如礼物、订单、卡片、互动动作等。自定义消息将“事件类型”和“业务参数”拆分管理，便于业务扩展和消息解析。

#### 发送流程

发送自定义消息时，请按以下流程执行：

1. 准备自定义事件数据。
   定义业务事件名称，并准备结构简单、可序列化的业务参数。
2. 创建自定义消息。
   调用 `createCustomMessage` 创建自定义消息，并传入会话信息、事件名称、业务参数及扩展字段。
3. 发送自定义消息。
   调用 `sendMessage` 发送消息。

:::tip
自定义消息的解析和展示逻辑由业务侧自行定义。
:::

下面的示例代码为创建并发送自定义消息：

```
// 创建一条自定义消息。
const message = client.chatManager.createCustomMessage({
  // 接收方：单聊为对方用户 ID，群聊为群组 ID，聊天室为聊天室 ID。
  conversationId: 'user2',
  // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
  conversationType: 'singleChat',
  // 自定义事件名称。
  event: 'gift',
  // 可选：自定义业务参数。
  params: {
    giftId: '123',
    giftName: 'rose',
  },
  // 可选：扩展字段，用于携带更多业务上下文。
  ext: {
    source: 'web',
  },
});

await client.chatManager.sendMessage(message);
```

#### 关键参数

| 参数     | 类型                    | 必填/可选 | 适用场景                       | 说明                               |
| :------- | :---------------------- | :-------- | :----------------------------- | :--------------------------------- |
| `event`  | String                  | 必填      | 礼物、订单、互动动作、业务卡片 | 自定义事件名称。                   |
| `params` | `Record<string, string>`  | 可选      | 传递业务参数                   | 自定义业务参数。建议保持结构简单。 |
| `ext`    | `Record<string, unknown>` | 可选      | 业务扩展信息                   | 用于传递额外业务上下文。           |

## 发送合并消息

合并消息用于聊天记录转发或多条消息打包转发。该消息类型并不是将多条消息文本简单拼接，而是将一组原始消息编码为一条合并消息发送，接收方可在收到后进一步下载并解析其中的原始消息列表。

#### 发送流程

发送合并消息时，请按以下流程执行：

1. 准备原始消息列表。
   收集合并转发所需的原始消息对象列表。
2. 创建合并消息。
   调用 `createCombineMessage` 创建合并消息，并传入会话信息、标题、摘要、兼容展示文本和原始消息列表等参数。
3. 发送合并消息。
   调用 `sendMessage` 发送消息。
4. 解析合并消息。
   接收方收到合并消息后，如需查看原始聊天记录，可继续调用解析接口下载并解析其中的原始消息列表。

下面的示例代码为创建并发送合并消息：

```typescript
// 创建一条合并消息。
const message = client.chatManager.createCombineMessage({
  // 接收方：单聊为对方用户 ID，群聊为群组 ID，聊天室为聊天室 ID。
  conversationId: "user2",
  // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
  conversationType: "singleChat",
  // 合并消息标题。
  title: "聊天记录",
  // 合并消息摘要，通常用于消息列表中的预览展示。
  summary: "user1: Hello\nuser2: Hi",
  // 可选：兼容展示文本。未传时 SDK 默认使用 `[版本过低]`。
  compatibleText: "[版本过低]",
  // 被合并的原始消息列表。
  messageList: [msg1, msg2, msg3],
});

await client.chatManager.sendMessage(message);
```

#### 关键参数

| 参数             | 类型                   | 必填/可选 | 适用场景         | 说明                                             |
| :--------------- | :--------------------- | :-------- | :--------------- | :----------------------------------------------- |
| `title`          | String                 | 必填      | 聊天记录转发     | 合并消息标题。                                   |
| `summary`        | String                 | 必填      | 聊天记录预览     | 合并消息摘要，通常用于列表预览展示。             |
| `compatibleText` | String                 | 可选      | 兼容展示         | 兼容展示文本；未传时 SDK 默认使用 `[版本过低]`。 |
| `messageList`    | `ReadonlyArray<Message>` | 必填      | 多条消息打包转发 | 被合并的原始消息列表。                           |

#### 逻辑说明

- `messageList` 为必填参数，且必须为可合并的消息对象列表。
- 单条合并消息最多可包含 300 条消息。
- 合并消息支持嵌套，但嵌套层级最多为 10 层。SDK 会根据子消息自动计算当前合并层级，超限时将拒绝创建。
- 只有结构合法且可编码的消息才能被成功合并。
- `summary` 用于合并消息在会话列表或消息列表中的摘要展示，并不等同于原始聊天记录内容。
- 接收方如需查看完整原始消息内容，应进一步调用下载解析接口。

#### 接收端解析合并消息

收到合并消息后，可继续下载并解析其中的原始消息列表。

方式一：直接传入完整的合并消息对象。

```typescript
const items = await client.chatManager.downloadAndParseCombineMessage({
  message: combineMessage,
});
```

方式二：直接传入合并消息体中的最小下载参数。

```typescript
const items = await client.chatManager.downloadAndParseCombineMessage({
  url,
  secret,
});
```

#### 使用建议

- 建议仅将已成功发送或已成功接收的消息用于合并转发，以保证展示和解析结果稳定。
- `title` 和 `summary` 建议使用对用户友好的描述文本，以提升会话列表和消息列表中的可读性。
- 如业务侧需要兼容不支持完整合并展示的客户端，可显式传入 `compatibleText`。

## 发送过程回调

调用 `sendMessage(message, options)` 发送消息时，可通过第二个参数 `options` 传入发送过程回调，用于监听消息发送状态和附件上传状态。该参数仅用于发送过程控制，不用于传递消息业务字段。

#### 使用说明

发送过程回调适用于以下场景：

- 更新消息列表中的发送中、发送成功、发送失败等状态；
- 展示图片、语音、视频、文件等附件消息的上传进度；
- 在上传完成、上传失败或上传取消后执行相应的业务处理。

#### 示例代码

```
await client.chatManager.sendMessage(message, {
  // 消息开始发送时触发。
  onSending: current => {
    console.log('sending', current.msgLocalId);
  },
  // 消息发送成功时触发。
  onSuccess: sent => {
    console.log('success', sent.msgLocalId);
  },
  // 消息发送失败时触发。
  onFailed: (failed, error) => {
    console.error('failed', failed.msgLocalId, error);
  },
  // 附件上传进度变化时触发。
  onFileUploadProgress: progress => {
    console.log('upload progress', progress);
  },
});
```

#### 回调参数说明

| 参数                   | 类型                       | 适用场景 | 说明                     |
| :--------------------- | :------------------------- | :------- | :----------------------- |
| `onSending`            | `(message) => void`        | 所有消息 | 消息开始发送时触发。     |
| `onSuccess`            | `(message) => void`        | 所有消息 | 消息发送成功时触发。     |
| `onFailed`             | `(message, error) => void` | 所有消息 | 消息发送失败时触发。     |
| `onFileUploadProgress` | `(progress) => void`       | 附件消息 | 附件上传进度变化时触发。 |
| `onFileUploadComplete` | `(result) => void`         | 附件消息 | 附件上传完成时触发。     |
| `onFileUploadError`    | `(error) => void`          | 附件消息 | 附件上传失败时触发。     |
| `onFileUploadCanceled` | `() => void`               | 附件消息 | 附件上传取消时触发。     |

#### 逻辑说明

- `options` 仅用于传入发送过程回调，不用于设置消息内容或业务字段。
- `onSending`、`onSuccess` 和 `onFailed` 适用于所有消息类型。
- `onFileUploadProgress`、`onFileUploadComplete`、`onFileUploadError` 和 `onFileUploadCanceled` 主要适用于图片、语音、视频、文件等附件消息。
- 若仅需获取最终发送结果，也可直接通过 `await sendMessage(...)` 或 `Promise` 的 `then/catch` 获取，不一定必须使用回调。

## 更多

#### 聊天室消息优先级与消息丢弃逻辑

对于聊天室消息，环信即时通讯 IM 支持高、普通和低三种消息优先级。Web SDK 可在创建消息时通过 `priority` 设置单条聊天室消息的优先级。

- `high`：高优先级。
- `normal`：普通优先级，默认值。
- `low`：低优先级。

当聊天室消息并发量过大或发送频率过高时，服务器会优先处理高优先级消息，并优先丢弃低优先级消息。因此，可以将打赏、公告等重要消息设置为高优先级。

消息优先级只能提高重要消息被优先处理的可能性，不能保证消息必达。在聊天室消息并发量过大的情况下，高优先级消息仍可能被丢弃。

对于单个聊天室，默认每秒发送的消息数量超过 20 条时，可能触发消息丢弃逻辑：

1. 服务器优先丢弃低优先级消息，尽量保留高优先级消息。
2. 同一优先级的消息超过限制时，服务器按照消息发送时间顺序处理，后发送的消息可能被丢弃。

```typescript
const roomId = 'roomId';

// 创建聊天室文本消息，并设置消息优先级。
// 未设置 priority 时，默认按普通优先级处理。
const message = client.chatManager.createTextMessage({
  conversationId: roomId,
  conversationType: 'chatRoom',
  content: 'Hi',
  priority: 'high',
});

await client.chatManager.sendMessage(message, {
  onSuccess: sentMessage => {
    console.log('发送成功:', sentMessage.msgServerId);
  },
  onFailed: (failedMessage, error) => {
    console.log('发送失败:', failedMessage, error);
  },
});
```

:::tip 
`priority` 主要用于聊天室消息优先级控制，不建议用于单聊和群聊消息。
:::

#### 语聊房麦位管理

你可以基于 [聊天室自定义属性](room_attributes.html) 实现语聊房麦位状态管理和多端同步，例如记录麦位用户、麦位状态和音量状态等信息。

Web SDK 的聊天室自定义属性采用 `Record<string, string>` 格式：

```typescript
Record<string, string>
```

因此，麦位列表或其他结构化数据不能直接作为数组、对象或嵌套结构写入。应用可以采用以下方式存储：

- 每个麦位使用一个独立属性，属性 Key 表示麦位编号，Value 为序列化后的麦位信息。
- 将麦位列表序列化为 JSON 字符串后，作为单个属性值写入。

例如，设置单个麦位属性：

```typescript
const roomId = 'roomId';

const result = await client.chatRoomManager.setAttributes({
  chatRoomId: roomId,
  attributes: {
    // Value 为序列化后的麦位信息。
    seat_1: JSON.stringify({
      userId: 'user_001',
      state: 'open',
      volume: 0,
    }),
  },
  // 成员离开聊天室时是否自动删除其设置的属性。默认值为 true。
  autoDelete: false,
  // 是否允许覆盖其他成员设置的属性。默认值为 false。
  isForced: false,
});

console.log('设置麦位属性结果:', result);
```

设置或更新聊天室自定义属性后，聊天室内其他成员可以通过 `onAttributesUpdate` 监听属性变更，并更新本地麦位状态：

```typescript
client.chatRoomManager.addEventHandler('room-attributes-listener', {
  onAttributesUpdate: event => {
    console.log('聊天室 ID:', event.chatRoomId);
    console.log('本次更新的属性:', event.attributes);
    console.log('操作者:', event.operatorId);

    const seat = event.attributes.seat_1
      ? JSON.parse(event.attributes.seat_1)
      : undefined;

    // 根据 seat 刷新麦位 UI。
    console.log('麦位信息:', seat);
  },
  onAttributesRemoved: event => {
    console.log('被删除的属性:', event.keys);
  },
});
```

具体实现方式和权限要求，详见 [聊天室自定义属性](room_attributes.html)。

#### 获取发送附件消息的进度

发送图片、语音、视频或文件等附件消息时，可以在调用 `sendMessage` 时通过 `onFileUploadProgress` 回调获取附件上传进度。

`onFileUploadProgress` 回调中的 `loaded` 表示当前已上传的字节数。通过 `onSuccess` 和 `onFailed` 回调可以获取消息发送结果：

- `onSuccess`：消息发送成功，回调参数为发送成功后的消息对象。
- `onFailed`：消息发送失败，回调参数包含发送失败的消息对象和错误信息。
- `onFileUploadProgress`：附件上传进度回调。

```typescript
const file = document.querySelector<HTMLInputElement>('#file')?.files?.[0];

if (!file) {
  throw new Error('请选择要发送的文件');
}

const message = client.chatManager.createImageMessage({
  conversationId: 'userId',
  conversationType: 'singleChat',
  data: file,
});

await client.chatManager.sendMessage(message, {
  onFileUploadProgress: progress => {
    console.log('已上传字节数:', progress.loaded);

    // 如果当前运行环境能获取文件总大小，可自行计算百分比。
    const percent = Math.round((progress.loaded / file.size) * 100);
    console.log('上传进度:', `${percent}%`);
  },
  onSuccess: sentMessage => {
    console.log('发送成功，消息 ID:', sentMessage.msgServerId);
  },
  onFailed: (failedMessage, error) => {
    console.log('发送失败:', failedMessage, error);
  },
});
```

:::tip 
文本、位置、透传和自定义消息通常不涉及附件上传，`onFileUploadProgress` 一般不会被触发。建议在回调中根据最新状态更新页面数据。
:::

#### 发送消息前的内容审核

- 内容审核关注消息 body

[内容审核服务会关注消息 body 中指定字段的内容，不同类型的消息审核不同的字段](/value-added/moderation/moderation_mechanism.html)，若创建消息时在这些字段中传入了很多业务信息，可能会影响审核效果。因此，创建消息时需要注意内容审核的字段不涉及业务信息，建议业务信息放在扩展字段中。

- 设置发送方收到内容审核替换后的内容

若初始化时打开了 `useReplacedMessageContents` 开关，发送文本消息时如果被内容审核（Moderation）进行了内容替换，发送方会收到替换后的内容。若该开关为关闭状态，则发送方不会收到替换后的内容。

#### 消息大小和存储限制

各类消息的大小和存储限制，详见 [消息限制说明](limitation.html#消息大小)。

#### 发消息时设置回调路由

回调路由用于在同一 App Key 下，按消息携带的回调环境值，将不同消息分别投递到不同的回调地址。

发送消息时，你可以在创建消息时设置 `webhookEnv` 字段，例如 `dev`、`test`、`prod`。消息发送后，环信服务器会根据该字段匹配控制台中配置的[回调路由规则](/product/console/basic_webhook.html#配置消息回调规则)，并将当前消息路由到对应的[发送前回调](/document/server-side/callback_presending.html)或[发送后回调](/document/server-side/callback_postsending.html)地址。

**适用场景**

| 场景             | 说明                                                                  |
| :--------------- | :-------------------------------------------------------------------- |
| 多环境隔离       | 在同一 App Key 下区分开发、测试、生产环境，分别回调到各自的服务地址。 |
| 灰度发布         | 将部分消息路由到新链路进行验证，其余消息仍沿用原有链路。              |
| 多业务线分流     | 不同业务模块的消息分别回调到各自的审核、风控或同步服务。              |
| 降低回调转发成本 | 避免所有消息先统一回调到单一入口，再由业务服务器进行二次分发。        |

**适用范围**

| 回调类型                                                      | 生效范围                            | 说明                                                       |
| :------------------------------------------------------------ | :---------------------------------- | :--------------------------------------------------------- |
| [发送前回调](/document/server-side/callback_presending.html)  | 仅对 SDK 发送的消息生效             | 消息下发给目标用户前，业务服务器可按需拦截或修改消息内容。 |
| [发送后回调](/document/server-side/callback_postsending.html) | 对 SDK 和 REST API 发送的消息均生效 | 消息发送完成后，业务服务器收到回调通知。                   |

**工作流程**

发送带回调路由的消息时，请按以下流程执行：

1. 在控制台配置回调路由。
   为发送前回调或发送后回调配置不同环境值对应的回调地址。
2. 创建消息时设置回调环境。
   调用 `client.chatManager.create*Message()` 创建消息，并在创建参数中传入 `webhookEnv`。
3. 发送消息。
   调用 `client.chatManager.sendMessage()` 发送消息。
4. 服务端按环境值匹配路由。
   环信服务器根据消息中的 `webhookEnv`，将当前消息回调到对应的目标地址。

**示例代码**

下面的示例代码为创建并发送一条带回调环境的文本消息：

```typescript
const message = client.chatManager.createTextMessage({
  // 接收方：单聊为对方用户 ID，群聊为群组 ID，聊天室为聊天室 ID。
  conversationId: "user2",
  // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
  conversationType: "singleChat",
  // 文本消息内容。
  content: "Hello!",
  // 可选：回调环境值。服务端会基于该值匹配控制台中配置的回调路由。
  webhookEnv: "test",
});

await client.chatManager.sendMessage(message);
```

**关键参数**

| 参数         | 类型   | 必填/可选 | 适用场景                 | 说明                                                                                   |
| :----------- | :----- | :-------- | :----------------------- | :------------------------------------------------------------------------------------- |
| `webhookEnv` | String | 可选      | 按环境或业务维度路由回调 | 消息的回调环境标识。创建消息时传入后，SDK 会随消息一并发送，由服务端用于匹配回调路由。 |

**命中规则**

| 场景                                 | 路由结果                                                                                                                                  |
| :----------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| 携带环境值且命中有效路由             | 按该环境值路由至对应的回调地址。                                                                                                          |
| 携带环境值但未命中有效路由           | **不触发回调**，控制台中的 `default` 兜底配置在此场景下 **不生效**。                                                                      |
| 未携带环境值                         | 自动路由至 `default` 环境对应的回调地址。                                                                                                 |
| 同一消息需同时触发发送前与发送后回调 | 两个阶段必须使用 **相同的环境值**。例如，发送前配置 `test -> url1`，发送后配置 `test -> url2`，则消息中携带 `test` 即可同时生效于两阶段。 |

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`addEventHandler`](#监听消息相关事件) | `ChatClient` | 注册事件监听。 |
| [`createTextMessage`](#发送文本消息) | `ChatManager` | 创建文本消息。 |
| [`createImageMessage`](#发送图片消息) | `ChatManager` | 创建图片消息，GIF 也通过该 API 创建。 |
| [`createVoiceMessage`](#发送语音消息) | `ChatManager` | 创建语音消息。 |
| [`createVideoMessage`](#发送视频消息) | `ChatManager` | 创建视频消息。 |
| [`createFileMessage`](#发送文件消息) | `ChatManager` | 创建文件消息。 |
| [`createLocationMessage`](#发送位置消息) | `ChatManager` | 创建位置消息。 |
| [`createCmdMessage`](#发送命令消息) | `ChatManager` | 创建命令消息。 |
| [`createCustomMessage`](#发送自定义类型消息) | `ChatManager` | 创建自定义消息。 |
| [`createCombineMessage`](#发送合并消息) | `ChatManager` | 创建合并消息。 |
| [`downloadAndParseCombineMessage`](#解析合并消息) | `ChatManager` | 下载并解析合并消息中的原始消息列表。 |
| [`sendMessage`](#发送过程回调) | `ChatManager` | 发送已创建的消息，并支持发送过程回调。 |
