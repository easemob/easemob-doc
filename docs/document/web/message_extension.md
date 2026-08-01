# 消息扩展

## 功能说明

当内置消息字段无法满足业务需求时，你可以通过消息扩展字段 `ext` 携带自定义业务数据，例如被回复消息信息、图文消息展示数据或业务标识等。

SDK 支持在创建各类消息时传入 `ext` 字段。该字段为可选字段，取值必须为可 JSON 序列化的对象。接收方收到消息后，可从消息对象的 `ext` 字段中读取自定义数据，并根据业务需求进行处理。

## 示例代码

```typescript
async function sendTextMessage() {
  const message = client.chatManager.createTextMessage({
    conversationId: 'user2',
    conversationType: 'singleChat',
    content: 'message content',
    // 设置消息扩展字段。扩展字段需为可 JSON 序列化的对象。
    ext: {
      key1: 'Self-defined value1',
      key2: {
        key3: 'Self-defined value3',
      },
    },
  });

  // 调用 `sendMessage` 方法发送携带扩展字段的消息。
  try {
    await client.chatManager.sendMessage(message);
    console.log('Send private text success.');
  } catch (e) {
    console.log('Send private text error.', e);
  }
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createTextMessage`](#示例代码) | `ChatManager` | 创建携带扩展字段的文本消息。 |
| [`sendMessage`](#示例代码) | `ChatManager` | 发送消息。 |
