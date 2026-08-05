# 接收消息

## 功能说明

环信即时通讯 IM SDK 可以实现文本、图片、音频、视频和文件等类型的消息的接收。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 初始化 SDK 时已注册 `ChatManager`，能够通过 `client.chatManager` 调用会话与消息相关接口。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 监听消息事件

接收消息时，请先注册消息事件监听器：

1. 调用 `client.chatManager.addEventHandler()` 注册消息事件监听器。
2. 在 `onMessage` 中接收普通消息。
3. 根据 `message.type` 判断消息类型，并进入对应的业务处理分支。

```typescript
const CHAT_HANDLER_ID = 'chat-message-listener';

client.chatManager.addEventHandler(CHAT_HANDLER_ID, {
  // 接收各类消息。
  onMessage: message => {
    console.log('收到消息:', message.msgServerId, message.type);
  },
});
```

## 消息通用字段

`onMessage` 回调中返回的是标准化后的 `Message` 对象。接收消息时，常用字段如下：

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `msgServerId` | String | 服务端消息 ID。 |
| `msgLocalId` | String | 本地消息 ID。 |
| `from` | String | 消息发送方的用户 ID。 |
| `to` | String | 消息接收方标识。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `sender` | Sender | 发送方摘要信息。 |
| `conversationId` | String | 所属会话 ID。 |
| `conversationType` | `'singleChat' \| 'groupChat' \| 'chatRoom'` | 会话类型。 |
| `type` | MessageType | 消息类型。 |
| `body` | MessageBody | 消息体。不同消息类型的结构不同。 |
| `ext` | `Record<string, unknown>` | 扩展字段。 |
| `timestamp` | Number | 消息时间戳，单位为毫秒。 |
| `direct` | `'SEND' \| 'RECEIVE'` | 消息方向。 |
| `isOnline` | Boolean | 是否为在线消息；`false` 表示离线同步得到的消息。 |
| `isBroadcast` | Boolean | 是否为聊天室广播消息。 |
| `modifiedInfo` | MessageModifiedInfo | 消息编辑信息。 |

## 接收文本消息

#### 接收流程

收到 `onMessage` 回调后，可根据消息的 `type` 判断消息类型。对于文本消息，消息内容位于 `message.body.content`；如需读取业务扩展字段，可通过 `message.ext` 获取。

示例代码如下所示：

```typescript
client.chatManager.addEventHandler('message-listener', {
  onMessage: message => {
    if (message.type === 'text') {
      console.log('文本内容:', message.body.content);
      console.log('扩展字段:', message.ext);
    }
  },
});
```

#### 关键字段

| 字段 | 类型 | 必填/可选 | 适用场景 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| `content` | String | 必填 | 普通聊天、通知正文、说明文本 | 文本消息核心内容。 |

## 接收图片消息

一条图片消息通常包含三类图片资源：

- 原图：发送方本地选择的原始图片文件，通常用于查看或保存原图。
- 大图：服务端基于原图进行等比压缩后的图片。压缩规则为：若图片短边大于 720 像素，则等比压缩至短边为 720 像素；若短边小于等于 720 像素，则保留原图尺寸，不做放大处理。此类图片通常用于聊天详情页展示。
- 缩略图：服务端基于原图进行等比压缩后的图片。压缩规则为：默认情况下，若图片短边大于 170 像素，则等比压缩至短边为 170 像素；若短边小于等于 170 像素，则保留原图尺寸，不做放大处理。缩略图的压缩方式和尺寸可在 [控制台进行配置](/product/console/basic_message.html#图片消息缩略图)。此类图片通常用于会话列表、聊天列表等轻量展示场景。

#### 接收流程

接收图片消息时，请按以下流程执行：

1. [调用 `addEventHandler` 注册消息事件监听器](#监听消息事件)。
2. 监听 `onMessage` 回调，接收图片消息。
3. 若需要下载原图文件，可调用 `client.chatManager.downloadAttachment({ message })`。
4. 若需要使用大图或缩略图，可直接使用 `bigImageUrl` 或 `thumbnailUrl` 进行展示或由业务侧自行下载。

示例代码如下所示：

```typescript
client.chatManager.addEventHandler('image-message-listener', {
  // 接收图片消息。
  onMessage: message => {
    // 判断是否为图片消息。
    if (message.type !== 'image') {
      return;
    }

    // 缩略图地址，适合会话列表或聊天列表展示。
    console.log('缩略图地址:', message.body.thumbnailUrl);
    // 大图地址，适合聊天详情页展示。
    console.log('大图地址:', message.body.bigImageUrl);
    // 原图地址，适合查看或保存原图。
    console.log('原图地址:', message.body.originalImageUrl);
    // 图片宽高。
    console.log('图片尺寸:', message.body.width, message.body.height);
    // 是否为 GIF 图片。
    console.log('是否为 GIF:', message.body.isGif);
  },
});
```

#### 下载原图、大图和缩略图

接收图片消息后，若业务需要进一步获取不同规格的图片资源，可按以下方式处理：

1. 缩略图通常直接使用 `message.body.thumbnailUrl` 展示。
2. 大图通常直接使用 `message.body.bigImageUrl` 展示。
3. 原图通常直接使用 `message.body.originalImageUrl` 展示或保存。
4. 若需要下载原图二进制数据，可调用 `client.chatManager.downloadAttachment({ message })`。

```typescript
client.chatManager.addEventHandler('image-download-listener', {
  // 接收图片消息。
  onMessage: async message => {
    // 判断是否为图片消息。
    if (message.type !== 'image') {
      return;
    }

    // 读取缩略图地址。
    const thumbnailUrl = message.body.thumbnailUrl;
    // 读取大图地址。
    const bigImageUrl = message.body.bigImageUrl;
    // 读取原图地址。
    const originalImageUrl = message.body.originalImageUrl;

    console.log('缩略图地址:', thumbnailUrl);
    console.log('大图地址:', bigImageUrl);
    console.log('原图地址:', originalImageUrl);

    // 下载原图附件。
    const attachment = await client.chatManager.downloadAttachment({ message });

    console.log('下载文件名:', attachment.filename);
    console.log('下载地址:', attachment.downloadUrl);
    console.log('原图二进制数据:', attachment.data);
  },
});
```

#### 关键字段

| 字段 | 类型 | 必填/可选 | 适用场景 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| `thumbnailUrl` | String | 可选 | 会话列表、聊天列表 | 缩略图地址。 |
| `bigImageUrl` | String | 可选 | 聊天详情页预览 | 大图地址。 |
| `originalImageUrl` | String | 可选 | 查看或保存原图 | 原图地址。 |
| `width` | Number | 可选 | 预排版、预览展示 | 图片宽度。 |
| `height` | Number | 可选 | 预排版、预览展示 | 图片高度。 |
| `isGif` | Boolean | 必填 | GIF 动图判断 | 标识当前图片是否为 GIF。 |
| `isOriginalImage` | Boolean | 必填 | 原图语义判断 | 标识发送方是否按原图语义发送。 |
| `secret` | String | 可选 | 私有附件下载 | 下载鉴权密钥。 |
| `fileLength` | Number | 可选 | 文件大小展示 | 图片文件大小，单位为字节。 |

## 接收 GIF 图片消息

GIF 图片消息本质上仍属于图片消息，接收时仍通过 `onMessage` 处理。

#### 接收流程

接收 GIF 图片消息时，请按以下流程执行：

1. [调用 `addEventHandler` 注册消息事件监听器](#监听消息事件)。
2. 监听 `onMessage` 回调，接收 GIF 图片消息。

示例代码如下所示：

```typescript
client.chatManager.addEventHandler('gif-message-listener', {
  // 接收 GIF 消息。
  onMessage: message => {
    // 仅处理图片消息。
    if (message.type !== 'image') {
      return;
    }

    // 判断是否为 GIF 图片。
    if (message.body.isGif !== true) {
      return;
    }

    // 读取 GIF 图片资源地址。
    console.log('GIF 缩略图:', message.body.thumbnailUrl);
    console.log('GIF 原图:', message.body.originalImageUrl);
  },
});
```

#### 关键字段

| 字段 | 类型 | 必填/可选 | 适用场景 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| `isGif` | Boolean | 必填 | GIF 动图判断 | `true` 表示当前图片为 GIF。 |
| `thumbnailUrl` | String | 可选 | 列表预览 | GIF 缩略图地址。 |
| `originalImageUrl` | String | 可选 | 原图展示 | GIF 原图地址。 |

## 接收语音消息

#### 接收流程

接收语音消息时，请按以下流程执行：

1. [调用 `addEventHandler` 注册消息事件监听器](#监听消息事件)。
2. 监听 `onMessage` 回调，接收语音消息。
3. 若需要语音文件，可调用 `client.chatManager.downloadAttachment({ message })` 下载。

示例代码如下所示：

```typescript
client.chatManager.addEventHandler('voice-message-listener', {
  // 接收语音消息。
  onMessage: async message => {
    // 判断是否为语音消息。
    if (message.type !== 'voice') {
      return;
    }

    // 读取语音地址。
    console.log('语音地址:', message.body.url);
    // 读取语音时长。
    console.log('语音时长:', message.body.duration);
    // 读取语音文件名。
    console.log('文件名:', message.body.filename);

    // 下载语音附件。
    const attachment = await client.chatManager.downloadAttachment({ message });
    console.log('下载地址:', attachment.downloadUrl);
  },
});
```

#### 关键字段

| 字段 | 类型 | 必填/可选 | 适用场景 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| `url` | String | 可选 | 在线播放、下载 | 语音资源地址。 |
| `duration` | Number | 必填 | 语音播放时长展示 | 语音时长，单位为秒。 |
| `filename` | String | 可选 | 文件名展示 | 语音文件名。 |
| `filetype` | String | 可选 | 类型识别 | 语音文件 MIME 类型。 |
| `fileLength` | Number | 可选 | 文件大小展示 | 语音文件大小，单位为字节。 |
| `secret` | String | 可选 | 私有附件下载 | 下载鉴权密钥。 |

## 接收视频消息

视频消息用于短视频、录屏片段等场景。通常同时包含视频地址和视频缩略图地址。

#### 接收流程

接收视频消息时，请按以下流程执行：

1. [调用 `addEventHandler` 注册消息事件监听器](#监听消息事件)。
2. 监听 `onMessage` 回调，接收视频消息。
3. 若需要视频文件，可调用 `client.chatManager.downloadAttachment({ message })` 下载。

示例代码如下所示：

```typescript
client.chatManager.addEventHandler('video-message-listener', {
  // 接收视频消息。
  onMessage: async message => {
    // 判断是否为视频消息。
    if (message.type !== 'video') {
      return;
    }

    // 读取视频地址。
    console.log('视频地址:', message.body.url);
    // 读取视频缩略图地址。
    console.log('缩略图地址:', message.body.thumbnailUrl);
    // 读取视频时长。
    console.log('视频时长:', message.body.duration);
    // 读取视频尺寸。
    console.log('视频尺寸:', message.body.width, message.body.height);

    // 下载视频附件。
    const attachment = await client.chatManager.downloadAttachment({ message });
    console.log('下载地址:', attachment.downloadUrl);
  },
});
```

#### 关键字段

| 字段 | 类型 | 必填/可选 | 适用场景 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| `url` | String | 可选 | 视频播放、下载 | 视频资源地址。 |
| `thumbnailUrl` | String | 可选 | 列表预览、封面展示 | 视频缩略图地址。 |
| `duration` | Number | 必填 | 时长展示 | 视频时长，单位为秒。 |
| `width` | Number | 可选 | 播放器布局 | 视频宽度。 |
| `height` | Number | 可选 | 播放器布局 | 视频高度。 |
| `filename` | String | 可选 | 文件名展示 | 视频文件名。 |
| `fileLength` | Number | 可选 | 文件大小展示 | 视频文件大小，单位为字节。 |
| `secret` | String | 可选 | 私有附件下载 | 下载鉴权密钥。 |

## 接收文件消息

文件消息适用于文档、压缩包、表格等通用文件传输场景。

#### 接收流程

接收文件消息时，请按以下流程执行：

1. [调用 `addEventHandler` 注册消息事件监听器](#监听消息事件)。
2. 监听 `onMessage` 回调，接收文件消息。
3. 若需要文件，可调用 `client.chatManager.downloadAttachment({ message })` 下载。

示例代码如下所示：

```typescript
client.chatManager.addEventHandler('file-message-listener', {
  // 接收文件消息。
  onMessage: async message => {
    // 判断是否为文件消息。
    if (message.type !== 'file') {
      return;
    }

    // 读取文件地址。
    console.log('文件地址:', message.body.url);
    // 读取文件名。
    console.log('文件名:', message.body.filename);
    // 读取文件类型。
    console.log('文件类型:', message.body.filetype);
    // 读取文件大小。
    console.log('文件大小:', message.body.fileSize ?? message.body.fileLength);

    // 下载文件附件。
    const attachment = await client.chatManager.downloadAttachment({ message });
    console.log('下载地址:', attachment.downloadUrl);
  },
});
```

#### 关键字段

| 字段 | 类型 | 必填/可选 | 适用场景 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| `url` | String | 可选 | 下载文件 | 文件资源地址。 |
| `filename` | String | 可选 | 文件展示 | 文件名。 |
| `filetype` | String | 可选 | 类型识别 | 文件 MIME 类型。 |
| `fileSize` | Number | 可选 | 文件大小展示 | 文件大小。 |
| `fileLength` | Number | 可选 | 服务端兼容字段 | 文件大小，单位为字节。 |
| `secret` | String | 可选 | 私有附件下载 | 下载鉴权密钥。 |

## 接收位置消息

位置消息用于接收地理位置信息，通常包含经纬度和位置描述。

#### 接收流程

接收位置消息时，请按以下流程执行：

1. [调用 `addEventHandler` 注册消息事件监听器](#监听消息事件)。
2. 监听 `onMessage` 回调，接收位置消息。可以结合第三方地图服务或定位展示组件渲染位置。

示例代码如下所示：

```typescript
client.chatManager.addEventHandler('location-message-listener', {
  // 接收位置消息。
  onMessage: message => {
    // 判断是否为位置消息。
    if (message.type !== 'location') {
      return;
    }

    // 读取经纬度。
    console.log('纬度:', message.body.latitude);
    console.log('经度:', message.body.longitude);
    // 读取地址描述。
    console.log('地址描述:', message.body.address);
    // 读取建筑名称。
    console.log('建筑名称:', message.body.buildingName);
  },
});
```

#### 关键字段

| 字段 | 类型 | 必填/可选 | 适用场景 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| `latitude` | Number | 必填 | 地图定位 | 纬度。 |
| `longitude` | Number | 必填 | 地图定位 | 经度。 |
| `address` | String | 可选 | 地址展示 | 位置描述。 |
| `buildingName` | String | 可选 | 地点名称展示 | 建筑名称。 |

## 接收透传消息

透传消息用于通知接收方执行某种业务动作，通常不直接作为普通聊天内容展示。

`action` 为透传消息的动作名称，不能为空。建议使用业务自定义且语义明确的字符串；为避免与 SDK 或服务端内部动作名称冲突，不建议使用 `em_`、`easemob::` 等可能具有内部含义的前缀。

#### 接收流程

接收透传消息时，请按以下流程执行：

1. [调用 `addEventHandler` 注册消息事件监听器](#监听消息事件)。
2. 监听 `onMessage` 回调，接收透传消息。

示例代码如下所示：

```typescript
client.chatManager.addEventHandler('cmd-message-listener', {
  // 接收透传消息。
  onMessage: message => {
    // 判断是否为透传消息。
    if (message.type !== 'cmd') {
      return;
    }

    // 读取命令动作。
    console.log('命令动作:', message.body.action);
    // 读取命令参数。
    console.log('命令参数:', message.body.params);
  },
});
```

#### 关键字段

| 字段 | 类型 | 必填/可选 | 适用场景 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| `action` | String | 必填 | 业务指令分发 | 透传消息的命令动作。 |
| `params` | `Record<string, String>` | 可选 | 协议兼容读取 | 命令参数。当前主要用于接收或协议兼容场景。 |

## 接收自定义类型消息

自定义消息适用于礼物、订单、卡片、互动动作等业务事件。

#### 接收流程

接收自定义消息时，请按以下流程执行：

1. [调用 `addEventHandler` 注册消息事件监听器](#监听消息事件)。
2. 监听 `onMessage` 回调，接收自定义消息。根据事件名和参数执行对应的界面渲染或业务逻辑。

示例代码如下所示：

```typescript
client.chatManager.addEventHandler('custom-message-listener', {
  // 接收自定义消息。
  onMessage: message => {
    // 判断是否为自定义消息。
    if (message.type !== 'custom') {
      return;
    }

    // 读取自定义事件名。
    console.log('事件名:', message.body.event);
    // 读取自定义参数。
    console.log('业务参数:', message.body.params);
  },
});
```

#### 关键字段

| 字段 | 类型 | 必填/可选 | 适用场景 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| `event` | String | 必填 | 业务事件分发 | 自定义消息事件名。 |
| `params` | `Record<string, String>` | 可选 | 业务参数读取 | 自定义业务参数。 |

## 接收合并消息

合并消息用于“聊天记录转发”或“多条消息打包转发”。接收方收到的是一条外层合并消息，若需查看其中的原始消息，还需进一步下载并解析合并消息详情。

#### 接收流程

接收合并消息与接收普通消息的方式相同。应用可在 `onMessage` 回调中根据 `message.type === 'combine'` 识别合并消息。

合并消息包含标题、摘要、兼容文本以及合并消息附件信息。收到合并消息后，可直接从消息体中读取 `title`、`summary` 和 `compatibleText`；如需获取合并消息中的原始消息列表，可调用 `downloadAndParseCombineMessage` 下载并解析合并消息附件。首次调用该方法时，SDK 会根据合并消息中的附件信息下载并解析附件，然后返回原始消息列表。后续调用时，若附件数据已可用，SDK 可直接解析并返回原始消息列表。

:::tip
对于不支持合并转发消息的 SDK 版本，该类消息会按兼容文本展示；当前 SDK 接收到合并消息时，`message.body` 中不包含 `compatibleText` 字段。
:::

示例代码如下所示：

```typescript
client.chatManager.addEventHandler('combine-message-listener', {
  // 接收合并消息。
  onMessage: async message => {
    // 判断是否为合并消息。
    if (message.type !== 'combine') {
      return;
    }

    // 读取合并消息标题。
    console.log('标题:', message.body.title);
    // 读取合并消息摘要。
    console.log('摘要:', message.body.summary);
    // 读取兼容文案。
    console.log('兼容文案:', message.body.compatibleText);

    // 下载并解析原始子消息列表。
    const subMessages = await client.chatManager.downloadAndParseCombineMessage({
      message,
    });

    console.log('子消息列表:', subMessages);
  },
});
```

也可以直接传入合并消息体中的最小下载参数：

```typescript
const subMessages = await client.chatManager.downloadAndParseCombineMessage({
  url: combineMessage.body.url!,
  secret: combineMessage.body.secret,
});
```

`downloadAndParseCombineMessage()` 支持两种入参：`{ message }` 和 `{ url, secret }`。

#### 关键字段

| 字段 | 类型 | 必填/可选 | 适用场景 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| `title` | String | 必填 | 概览展示 | 合并消息标题。 |
| `summary` | String | 必填 | 概览展示 | 合并消息摘要。仅适合做概览展示；若要展示原始聊天记录，应进一步调用 `downloadAndParseCombineMessage()`。 |
| `compatibleText` | String | 必填 | 兼容展示 | 不支持完整合并展示时的兼容文案。 | // 要删除吗？
| `url` | String | 可选 | 下载详情 | 合并消息详情下载地址。 |
| `secret` | String | 可选 | 下载鉴权 | 合并消息详情下载密钥。 |
| `messageList` | `ReadonlyArray<Message>` | 可选 | 解析后详情展示 | 仅在发送场景或详情解析后可能出现。 |
| `combineLevel` | Number | 必填 | 嵌套层级判断 | 当前合并消息层级。 |

## 离线消息同步事件

离线消息同步属于 `ChatClient` 级别事件，应通过 `client.addEventHandler()` 监听，而不是通过 `chatManager.addEventHandler()` 监听。

#### 监听流程

监听离线消息同步事件时，请按以下流程执行：

1. 调用 `client.addEventHandler()` 注册 `ChatClient` 级事件处理器。
2. 监听 `onOfflineMessageSyncStart`，感知离线消息开始同步。
3. 监听 `onOfflineMessageSyncFinish`，感知离线消息同步完成。
4. 在消息处理逻辑中结合 `message.isOnline` 判断当前消息是否为在线消息。

#### 示例代码

```typescript
client.addEventHandler('offline-sync', {
  // 离线消息同步开始时触发。
  onOfflineMessageSyncStart: () => {
    console.log('开始同步离线消息');
  },
  // 离线消息同步完成时触发。
  onOfflineMessageSyncFinish: () => {
    console.log('离线消息同步完成');
  },
});
```

如需进一步区分消息来源，可在消息处理时结合 `isOnline` 判断：

```typescript
client.chatManager.addEventHandler('online-flag-listener', {
  // 接收普通消息。
  onMessage: message => {
    // 判断当前消息是否为离线同步消息。
    if (message.isOnline === false) {
      console.log('收到离线消息:', message.msgServerId);
      return;
    }

    console.log('收到在线消息:', message.msgServerId);
  },
});
```

:::tip
- `addEventHandler` 的第一个参数是事件处理器 ID，不是固定事件名，因此示例中的 `'offline-sync'` 可以替换为任意不重复的字符串。
- 聊天室消息只支持在线消息，不支持离线消息。单聊和群聊既支持在线消息，也支持离线同步消息。
:::

## 更多说明

#### 判断是否为聊天室广播消息

对于聊天室下行消息，你可以通过 `message.isBroadcast` 判断该消息是否为通过 REST API 发送的聊天室广播消息。

```typescript
client.chatManager.addEventHandler('chatroom-broadcast-listener', {
  // 接收普通消息。
  onMessage: message => {
    // 判断是否为聊天室广播消息。
    if (message.conversationType === 'chatRoom' && message.isBroadcast) {
      console.log('收到聊天室广播消息:', message.msgServerId);
    }
  },
});
```

#### 消息回执

关于消息送达回执和已读回执的实现，详见 [消息回执文档](message_receipt.html)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`downloadAttachment`](#接收图片消息) | `ChatManager` | 下载图片、语音、视频、文件等附件消息的二进制数据。 |
| [`downloadAndParseCombineMessage`](#接收合并消息) | `ChatManager` | 下载并解析合并消息中的原始消息列表。 |
