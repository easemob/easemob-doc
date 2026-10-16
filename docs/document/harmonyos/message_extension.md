# 消息扩展

## 功能说明

当内置消息字段无法满足业务需求时，你可以通过消息扩展字段携带自定义业务数据，例如被回复消息的信息、图文消息展示数据或业务标识等。

HarmonyOS SDK 通过 `ChatMessage#setExt` 设置消息扩展字段。扩展字段使用 `Map<string, MessageExtType>` 表示，字段值支持 `String`、`Boolean`、`number` 和 `object` 类型。接收方收到消息后，可以调用 `ChatMessage#ext` 获取消息中的全部扩展字段，并根据字段类型处理数据。

当扩展字段值为对象或数组时，SDK 会通过 `JSON.stringify` 将其序列化后发送，并在读取扩展字段时自动解析为对象。`Date`、`Map`、`Set` 等类型应先转换为普通对象或数组，再写入扩展字段。

## 示例代码

```typescript
interface ReplyInfo {
  messageId: string;
  sender: string;
}

let message = ChatMessage.createTextSendMessage(conversationId, content);
if (message) {
  // 设置消息扩展字段。
  let attributes = new Map<string, MessageExtType>();
  attributes.set('attribute1', 'value');
  attributes.set('attribute2', true);
  attributes.set('attribute3', 123);
  attributes.set('replyInfo', {
    messageId: 'referencedMessageId',
    sender: 'user1'
  } as ReplyInfo);
  message.setExt(attributes);

  // 发送携带扩展字段的消息。
  ChatClient.getInstance().chatManager()?.sendMessage(message);
}

// 接收消息后，读取全部扩展字段。
function handleReceivedMessage(receivedMessage: ChatMessage): void {
  let attributes = receivedMessage.ext();

  let attribute1 = attributes.get('attribute1');
  if (typeof attribute1 === 'string') {
    // 处理字符串类型扩展字段。
  }

  let attribute2 = attributes.get('attribute2');
  if (typeof attribute2 === 'boolean') {
    // 处理布尔类型扩展字段。
  }

  let replyValue = attributes.get('replyInfo');
  if (typeof replyValue === 'object' && replyValue !== null) {
    let replyInfo = replyValue as ReplyInfo;
    // 使用 replyInfo.messageId 和 replyInfo.sender。
  }
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createTextSendMessage`](#示例代码) | `ChatMessage` | 创建待发送的文本消息。 |
| [`setExt`](#示例代码) | `ChatMessage` | 设置消息扩展字段。 |
| [`ext`](#示例代码) | `ChatMessage` | 获取消息中的全部扩展字段。 |
| [`sendMessage`](#示例代码) | `ChatManager` | 发送携带扩展字段的消息。 |
