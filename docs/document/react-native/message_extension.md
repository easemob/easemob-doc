# 消息扩展

## 功能说明

当内置消息字段无法满足业务需求时，你可以通过消息扩展字段携带自定义业务数据，例如被回复消息信息、图文消息展示数据或业务标识等。

React Native SDK 通过 `ChatMessage#attributes` 设置和读取消息扩展字段，类型为 `Record<string, any>`。建议使用可序列化的 JSON 数据，包括字符串、数字、布尔值、数组和对象，不要传入函数、`Symbol`、循环引用或依赖 JavaScript 原型的对象。接收方收到消息后，可从 `attributes` 中按业务字段名读取数据；字段不存在时返回 `undefined`，应用应自行处理默认值。

扩展字段应在发送消息前设置。仅修改收到的消息对象不会将变更发送给对端；如需编辑已发送消息的扩展字段，详见 [编辑消息](message_modify.html)。

## 示例代码

以下示例创建并发送携带扩展字段的文本消息，同时演示接收后读取字段。执行前应已完成 SDK 初始化和登录。

```typescript
const chatManager = ChatClient.getInstance().chatManager;
const message = ChatMessage.createTextMessage(
  '<target_user_id>',
  '携带业务信息的文本消息',
  ChatMessageChatType.PeerChat
);

// 增加自定义属性
message.attributes = {
  attribute1: 'value',
  attribute2: true,
  business: { orderId: '<order_id>', quantity: 2 },
};

chatManager.sendMessage(message, {
  onSuccess: (sentMessage) => {
    console.log('发送成功：', sentMessage.msgId);
  },
  onError: (localMsgId, error) => {
    console.error('发送失败：', localMsgId, error.code, error.description);
  },
}).catch((error: unknown) => {
  console.error('发起发送失败：', error);
});

const listener: ChatMessageEventListener = {
  onMessagesReceived: (messages) => {
    for (const receivedMessage of messages) {
      const attributes = receivedMessage.attributes;
      const attribute1 = typeof attributes.attribute1 === 'string'
        ? attributes.attribute1 : undefined;
      const attribute2 = typeof attributes.attribute2 === 'boolean'
        ? attributes.attribute2 : false;
      console.log('业务字段：', attribute1, attribute2);
    }
  },
};
chatManager.addMessageListener(listener);

// 页面或组件销毁、不再需要监听时执行
// chatManager.removeMessageListener(listener);
```

`sendMessage` 返回的 `Promise<void>` 用于报告调用错误；消息最终发送结果通过 `onSuccess` 或 `onError` 返回。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createTextMessage`](#示例代码) | `ChatMessage` | 创建待发送的文本消息。 |
| [`attributes`](#示例代码) | `ChatMessage` | 设置或读取消息扩展字段。 |
| [`sendMessage`](#示例代码) | `ChatManager` | 发送携带扩展字段的消息。 |
