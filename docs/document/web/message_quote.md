# 消息引用

## 功能说明

消息引用是指用户回复某一条已发送消息，并在新消息中携带被引用消息的摘要信息，便于接收方理解回复上下文。

除透传消息外，各类消息均可通过新消息的扩展字段携带引用信息。SDK 不会校验被引用原消息的发送状态或是否真实存在。

:::tip
消息引用场景下，`msgQuote` 作为新消息 `ext` 中的业务自定义字段，需与其他扩展字段一起保持 JSON 可序列化，并满足消息发送时的整体大小限制。
:::

各类型消息的引用 UI 展示示例如下：

| 消息类型  | 原消息存在 | 原消息不存在 |
| :--------- | :----- | :------- |
| 文本消息 | ![img](/images/product/solution_common/message_reply/text_normal_web.png) | ![img](/images/product/solution_common/message_reply/text_no_web.png) |
| 图片消息 | ![img](/images/product/solution_common/message_reply/image_normal_web.png)  | ![img](/images/product/solution_common/message_reply/image_no_web.png) |
| 语音消息 | ![img](/images/product/solution_common/message_reply/voice_normal_web.png) | ![img](/images/product/solution_common/message_reply/voice_no_web.png) |
| 视频消息 | ![img](/images/product/solution_common/message_reply/video_normal_web.png) | ![img](/images/product/solution_common/message_reply/video_no_web.png) |
| 文件消息 | ![img](/images/product/solution_common/message_reply/file_normal_web.png) | ![img](/images/product/solution_common/message_reply/file_no_web.png) |
| 名片消息 | ![img](/images/product/solution_common/message_reply/card_normal_web.png) | ![img](/images/product/solution_common/message_reply/card_no_web.png) |
| 合并消息 | ![img](/images/product/solution_common/message_reply/combine_normal_web.png) | ![img](/images/product/solution_common/message_reply/combine_no_web.png) |

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化和登录，详见 [快速开始](quickstart.html)。
- 已具备基础的消息收发能力，详见发送消息和接收消息相关文档。
- 已注册 `ChatManager`，能够通过 `client.chatManager` 调用消息创建、发送和事件监听相关接口。
- 了解即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现过程

消息引用的实现方式如下：

1. 业务侧在发送回复消息前，先获取被引用原消息的关键信息。
2. 创建新的消息对象时，将原消息摘要写入新消息的 `ext.msgQuote` 字段。
3. 接收方收到该消息后，解析 `ext.msgQuote`，在消息列表中渲染“引用区域”。
4. 如需支持点击引用区域跳转到原消息，可根据 `msgQuote.msgID` 在本地消息列表中定位原消息。

`msgQuote` 的数据结构由业务侧自行约定，可参考如下示例：

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: 'user2',
  conversationType: 'singleChat',
  content: '好的，收到！',
  ext: {
    msgQuote: {
      msgID: 'original-msg-id',
      msgPreview: '原消息内容预览',
      msgSender: 'user1',
      msgType: 'text',
    },
  },
});

await client.chatManager.sendMessage(message);
```

在上述示例中：

- `msgID` 表示业务侧记录的被引用消息 ID，用于后续定位原消息。
- `msgPreview` 表示业务侧保存的被引用消息预览内容，用于 UI 展示。
- `msgSender` 表示业务侧记录的被引用消息发送方。
- `msgType` 表示业务侧记录的被引用消息类型，用于按类型渲染引用摘要。

在消息列表中展示时，可根据 `msgQuote` 中的信息组合展示引用摘要，例如 `${msgSender}: ${msgPreview}`。

如果需要支持点击引用区域跳转到原消息，建议业务侧维护消息 ID 与消息列表项、DOM 节点或视图模型之间的映射关系，再根据 `msgID` 执行滚动定位和高亮展示。

如果被引用的原消息已不存在于当前本地消息列表中，可直接展示 `msgPreview`，或提示 **引用内容不存在**。

### 发送引用的消息

以发送一条“回复文本消息”的引用消息为例，流程如下：

1. 确定被引用的原消息。
2. 提取原消息的摘要信息，组装到 `ext.msgQuote` 中。
3. 调用 `client.chatManager.createTextMessage()` 创建新的回复消息。
4. 调用 `client.chatManager.sendMessage()` 发送消息。

示例代码如下：

```typescript
const message = client.chatManager.createTextMessage({
  // 接收方：单聊为对方用户 ID，群聊为群组 ID，聊天室为聊天室 ID。
  conversationId: 'user2',
  // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
  conversationType: 'singleChat',
  // 新发送的回复内容。
  content: '好的，收到！',
  // 扩展字段：通过 `msgQuote` 携带被引用消息的摘要信息。
  ext: {
    msgQuote: {
      // 被引用消息的消息 ID。
      msgID: 'original-msg-id',
      // 被引用消息的预览内容。
      msgPreview: '原消息内容预览',
      // 被引用消息的发送方用户 ID。
      msgSender: 'user1',
      // 被引用消息的类型，例如 `text`、`image`、`voice`。
      msgType: 'text',
    },
  },
});

await client.chatManager.sendMessage(message);
```

### 接收方解析收到的消息

接收方收到普通消息后，可在 `onMessage` 事件中解析 `message.ext?.msgQuote`，判断当前消息是否为引用消息。

```typescript
client.chatManager.addEventHandler('quote-message', {
  onMessage: message => {
    // 读取引用信息；若不存在，则说明当前消息不是引用消息。
    const quote = message.ext?.msgQuote as
      | {
          msgID?: string;
          msgPreview?: string;
          msgSender?: string;
          msgType?: string;
        }
      | undefined;

    if (!quote) {
      return;
    }

    // 在 UI 中展示引用摘要。
    console.log('引用消息 ID:', quote.msgID);
    console.log('引用消息预览:', quote.msgPreview);
    console.log('引用消息发送方:', quote.msgSender);
    console.log('引用消息类型:', quote.msgType);

    // 根据业务侧维护的消息 ID 映射关系定位原消息。
    const originalMessage = messageList.find(
      item => item.msgServerId === quote.msgID || item.msgLocalId === quote.msgID
    );

    if (!originalMessage) {
      console.log('引用内容不存在');
      return;
    }

    // 找到原消息对应的 DOM 节点后，可执行滚动和高亮。
    const messageDom = document.getElementById(originalMessage.msgServerId);
    messageDom?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    messageDom?.classList.add('reply-message-twinkle');

    setTimeout(() => {
      messageDom?.classList.remove('reply-message-twinkle');
    }, 1500);
  },
});
```

## 常见问题

1. Q: SDK 是否提供专用的引用消息创建 API？
   A: 不提供。当前通过新消息的扩展字段 `ext.msgQuote` 实现引用消息。

2. Q: 被引用消息不存在时，应如何展示？
   A: 可优先展示 `msgPreview` 中的摘要内容；若业务侧需要更明确的提示，也可展示“引用内容不存在”。

3. Q: SDK 是否会自动校验被引用消息是否真实存在？
   A: 不会。`msgQuote` 主要用于业务展示，原消息定位和不存在时的降级展示逻辑需由业务侧自行处理。
