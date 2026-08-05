# 转发消息

## 功能说明

转发消息是指将当前会话中发送成功或接收到的消息转发至其他会话。例如，用户 A 向用户 B 发送一条消息后，用户 B 可以将该消息转发给用户 C、群组、聊天室或消息话题。

环信即时通讯 IM SDK 支持以下转发方式：

- **转发单条消息**：基于原消息对象创建一条新消息，复用原消息的消息体和扩展字段，再将其发送至目标单聊、群聊、聊天室或消息话题。该方式支持文本、图片、语音、视频、文件、位置、透传、自定义及合并消息等消息类型。
- **转发多条消息**：将多条消息合并为一条合并消息，再发送至目标会话。接收方可以展开合并消息，查看其中包含的消息内容。详见 [发送合并消息](message_send.html#发送合并消息)。

转发操作会生成并发送一条新消息，新消息拥有独立的消息 ID、发送方、接收方和发送时间，不会改变原消息及其所在会话的数据。对于附件消息，SDK 可以复用原消息中的服务端附件地址，无需重新上传附件；若原附件已因超过存储期限而从服务器删除，接收方将无法下载该附件。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并登录，详见 [快速开始](quickstart.html)。
- 已注册 `ChatManager`，能够通过 `client.chatManager` 调用消息创建、历史消息查询和消息发送等接口。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 转发单条消息

转发单条消息时，需要先获取原始消息对象，再根据原消息类型调用对应的 `create*Message()` 方法创建一条同类型的新消息。创建新消息时，可复用原消息的消息体内容和扩展字段；完成目标会话及会话类型设置后，调用 `ChatManager#sendMessage` 发送新消息。

实际转发时，通常使用以下来源之一获取原始消息对象：

- 通过 `onMessage` 事件收到的消息对象；
- 当前页面已持有的消息列表项；
- 调用 `getHistoryMessages` 获取到的历史消息；
- 调用 `searchMessages` 获取到的服务端搜索结果。

单条消息可以转发至单聊、群聊、聊天室或消息话题。转发到消息话题时，需将 `conversationId` 设置为消息话题 ID，将 `conversationType` 设置为 `groupChat`，并设置 `isChatThread: true`。

转发附件消息时，SDK 可以复用原消息中的服务端附件地址，无需重新上传附件。如果附件因超过存储期限已从服务器删除，转发后的消息仍可包含原附件地址，但接收方将无法下载该附件。

:::tip
合并消息也可以作为单条消息直接转发。
:::

```typescript
import type {
  ChatConversationType,
  CombineMessageBody,
  CustomMessageBody,
  CmdMessageBody,
  FileMessageBody,
  ImageMessageBody,
  LocationMessageBody,
  Message,
  TextMessageBody,
  VideoMessageBody,
  VoiceMessageBody,
} from 'easemob-websdk';

// 原始消息对象通常来自 onMessage、当前消息列表、getHistoryMessages 或 searchMessages。
const targetMessage: Message = sourceMessage;

// 单聊传入对端用户 ID，群聊传入群组 ID，聊天室传入聊天室 ID。
// 转发到消息话题时，传入消息话题 ID，并将 conversationType 设为 groupChat，
// 同时设置 isChatThread: true。
const conversationId = 'conversationId';
const conversationType: ChatConversationType = 'groupChat';
const isChatThread = false;

async function buildForwardMessage(message: Message): Promise<Message> {
  switch (message.type) {
    case 'text': {
      const body = message.body as TextMessageBody;
      return client.chatManager.createTextMessage({
        conversationId,
        conversationType,
        isChatThread,
        content: body.content,
        targetLanguages: body.targetLanguages,
        ext: message.ext,
        webhookEnv: message.webhookEnv,
        deliverOnlineOnly: message.deliverOnlineOnly,
        receiverList: message.receiverList,
        priority: message.priority,
        needReadReceipt: message.needReadReceipt,
      });
    }

    case 'image': {
      const body = message.body as ImageMessageBody;
      return client.chatManager.createImageMessage({
        conversationId,
        conversationType,
        isChatThread,
        originalUrl: body.originalImageUrl || body.bigImageUrl,
        thumbnailUrl: body.thumbnailUrl,
        filename: body.filename,
        filetype: body.filetype,
        width: body.width,
        height: body.height,
        isGif: body.isGif,
        isOriginalImage: body.isOriginalImage,
        fileLength: body.fileLength,
        ext: message.ext,
        webhookEnv: message.webhookEnv,
        deliverOnlineOnly: message.deliverOnlineOnly,
        receiverList: message.receiverList,
        priority: message.priority,
        needReadReceipt: message.needReadReceipt,
      });
    }

    case 'voice': {
      const body = message.body as VoiceMessageBody;
      return client.chatManager.createVoiceMessage({
        conversationId,
        conversationType,
        isChatThread,
        originalUrl: body.url,
        filename: body.filename,
        filetype: body.filetype,
        duration: body.duration,
        fileLength: body.fileLength,
        ext: message.ext,
        webhookEnv: message.webhookEnv,
        deliverOnlineOnly: message.deliverOnlineOnly,
        receiverList: message.receiverList,
        priority: message.priority,
        needReadReceipt: message.needReadReceipt,
      });
    }

    case 'video': {
      const body = message.body as VideoMessageBody;
      return client.chatManager.createVideoMessage({
        conversationId,
        conversationType,
        isChatThread,
        originalUrl: body.url,
        thumbnailUrl: body.thumbnailUrl,
        filename: body.filename,
        filetype: body.filetype,
        duration: body.duration,
        width: body.width,
        height: body.height,
        fileLength: body.fileLength,
        ext: message.ext,
        webhookEnv: message.webhookEnv,
        deliverOnlineOnly: message.deliverOnlineOnly,
        receiverList: message.receiverList,
        priority: message.priority,
        needReadReceipt: message.needReadReceipt,
      });
    }

    case 'file': {
      const body = message.body as FileMessageBody;
      return client.chatManager.createFileMessage({
        conversationId,
        conversationType,
        isChatThread,
        originalUrl: body.url,
        filename: body.filename,
        filetype: body.filetype,
        fileSize: body.fileSize,
        fileLength: body.fileLength,
        ext: message.ext,
        webhookEnv: message.webhookEnv,
        deliverOnlineOnly: message.deliverOnlineOnly,
        receiverList: message.receiverList,
        priority: message.priority,
        needReadReceipt: message.needReadReceipt,
      });
    }

    case 'location': {
      const body = message.body as LocationMessageBody;
      return client.chatManager.createLocationMessage({
        conversationId,
        conversationType,
        isChatThread,
        latitude: body.latitude,
        longitude: body.longitude,
        address: body.address,
        buildingName: body.buildingName,
        ext: message.ext,
        webhookEnv: message.webhookEnv,
        deliverOnlineOnly: message.deliverOnlineOnly,
        receiverList: message.receiverList,
        priority: message.priority,
        needReadReceipt: message.needReadReceipt,
      });
    }

    case 'cmd': {
      const body = message.body as CmdMessageBody;
      return client.chatManager.createCmdMessage({
        conversationId,
        conversationType,
        isChatThread,
        action: body.action,
        ext: message.ext,
        webhookEnv: message.webhookEnv,
        deliverOnlineOnly: message.deliverOnlineOnly,
        receiverList: message.receiverList,
        priority: message.priority,
        needReadReceipt: message.needReadReceipt,
      });
    }

    case 'custom': {
      const body = message.body as CustomMessageBody;
      return client.chatManager.createCustomMessage({
        conversationId,
        conversationType,
        isChatThread,
        event: body.event,
        params: body.params,
        ext: message.ext,
        webhookEnv: message.webhookEnv,
        deliverOnlineOnly: message.deliverOnlineOnly,
        receiverList: message.receiverList,
        priority: message.priority,
        needReadReceipt: message.needReadReceipt,
      });
    }

    case 'combine': {
      const body = message.body as CombineMessageBody;
      const messageList =
        body.messageList ||
        (await client.chatManager.downloadAndParseCombineMessage({
          message,
        }));

      return client.chatManager.createCombineMessage({
        conversationId,
        conversationType,
        isChatThread,
        title: body.title,
        summary: body.summary,
        messageList,
        ext: message.ext,
        webhookEnv: message.webhookEnv,
        deliverOnlineOnly: message.deliverOnlineOnly,
        receiverList: message.receiverList,
        priority: message.priority,
        needReadReceipt: message.needReadReceipt,
      });
    }

    default:
      throw new Error(`Unsupported message type: ${message.type}`);
  }
}

const newMessage = await buildForwardMessage(targetMessage);
await client.chatManager.sendMessage(newMessage);
```

## 转发多条消息

对于转发多条消息，环信即时通讯 IM SDK 支持将多条消息合并在一起进行转发，详见 [发送合并消息](message_send.html#发送合并消息)。

## 注意事项

- 转发消息本质上是一条新消息。转发后生成的新消息拥有独立的消息 ID、发送方、接收方和发送时间，不会改变原消息及其所在会话的数据。
- SDK 接收到转发消息时，返回的仍是标准消息对象，不会自动标记该消息是否由转发产生。若业务上需要区分“普通消息”和“转发消息”，建议在转发时通过 `ext` 自定义标记字段，并在接收时自行解析。
- 对于单条转发，接收方接收的是重新创建并发送的新消息。虽然消息体内容通常与原消息保持一致，但消息元数据已经发生变化，因此不应将其视为原消息本身。
- 对于附件消息，转发时通常复用原消息中的服务端附件地址，无需重新上传附件。若原附件已因超过存储期限而被服务端删除，接收方仍可能收到该条转发消息，但将无法下载对应附件。
- 对于合并消息，接收方先收到的是一条 `combine` 类型消息。若需要查看其中包含的原始消息内容，还需进一步调用 `downloadAndParseCombineMessage` 进行下载和解析。
- 若消息被转发至消息话题，接收方可结合 `isChatThread`、`conversationId` 和 `conversationType` 判断该消息是否属于消息话题。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`getHistoryMessages`](message_retrieve.html) | `ChatManager` | 从服务器获取历史消息。转发单条消息时，可从返回结果中获取原始消息对象。 |
| [`searchMessages`](message_retrieve.html) | `ChatManager` | 按关键词和过滤条件搜索历史消息。需要从搜索结果中选择原始消息时可使用该接口。 |
| [`createTextMessage`](message_send.html#发送文本消息) | `ChatManager` | 创建转发后的文本消息。 |
| [`createImageMessage`](message_send.html#发送图片消息) | `ChatManager` | 创建转发后的图片消息。 |
| [`createVoiceMessage`](message_send.html#发送语音消息) | `ChatManager` | 创建转发后的语音消息。 |
| [`createVideoMessage`](message_send.html#发送视频消息) | `ChatManager` | 创建转发后的视频消息。 |
| [`createFileMessage`](message_send.html#发送文件消息) | `ChatManager` | 创建转发后的文件消息。 |
| [`createLocationMessage`](message_send.html#发送位置消息) | `ChatManager` | 创建转发后的位置消息。 |
| [`createCmdMessage`](message_send.html#发送透传消息) | `ChatManager` | 创建转发后的命令消息。 |
| [`createCustomMessage`](message_send.html#发送自定义类型消息) | `ChatManager` | 创建转发后的自定义消息。 |
| [`createCombineMessage`](message_send.html#发送合并消息) | `ChatManager` | 创建转发后的合并消息。 |
| [`downloadAndParseCombineMessage`](message_send.html#接收端解析合并消息) | `ChatManager` | 下载并解析合并消息中的原始子消息列表。 |
| [`sendMessage`](message_send.html#发送过程回调) | `ChatManager` | 发送转发消息。 |
