# 通过透传消息实现输入指示器

输入指示器用于在单聊场景中向对方展示“对方正在输入...”的状态。Web SDK 当前未提供专用的输入指示器 API，通常通过透传消息（CMD）实现。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- SDK 初始化时，已注册 `ChatManager`。
- 已了解即时通讯 IM 的 [使用限制](/product/limitation.html)。

## 实现过程

你可以通过透传消息实现输入指示器。下图为输入指示器的工作原理。

![img](/images/common/typing_indicator.png)

监听用户 A 的输入状态。一旦用户 A 开始输入文本，业务侧向用户 B 发送一条表示“正在输入”的透传消息。用户 B 收到该消息后，即可在与用户 A 的当前聊天界面中展示输入指示器。

- 用户 A 向用户 B 发送一条输入状态透传消息，通知对方“开始输入”。
- 用户 B 收到该消息后，若当前正停留在与用户 A 的单聊会话页面，可显示“对方正在输入”提示。
- 若用户 B 在设定时间内未再收到新的输入状态消息，应自动隐藏输入指示器。

:::tip
建议业务侧对输入状态透传消息进行节流控制，例如每 5 秒最多发送一次，避免频繁发送。
:::

### 发送输入状态的透传消息

以下示例代码展示如何发送输入状态透传消息。

```typescript
// 发送“正在输入”指示。
function sendTypingIndicator(to: string): void {
  const message = client.chatManager.createCmdMessage({
    // 接收方用户 ID。
    conversationId: to,
    // 会话类型。输入指示器通常仅用于单聊场景。
    conversationType: 'singleChat',
    // 透传动作名称，由发送方和接收方自行约定。
    action: 'TypingBegin',
    // 仅向在线用户投递，避免离线场景下收到过期输入状态。
    deliverOnlineOnly: true,
  });

  void client.chatManager.sendMessage(message);
}
```

### 接收和解析输入状态的透传消息

以下示例代码展示如何接收和解析输入状态透传消息。

```typescript
client.chatManager.addEventHandler('typing', {
  onMessage: (message) => {
    // 仅处理单聊透传消息。
    if (message.conversationType !== 'singleChat' || message.type !== 'cmd') {
      return;
    }
    // 根据约定的 action 判断是否为“正在输入”指示。
    if (message.body.action === 'TypingBegin') {
      // `message.from` 表示发送该输入状态的用户 ID。
      console.log(message.from, '正在输入...');
      // 可在此处显示“正在输入”提示。

      // 设置超时，例如 5 秒后自动隐藏输入指示器。
      setTimeout(() => {
        console.log('输入指示超时，隐藏提示');
      }, 5000);
    }
  },
});
```

## 接口列表

| API 名称                                           | 所属模块/类   | 说明                             |
| -------------------------------------------------- | ------------- | -------------------------------- |
| [`createCmdMessage`](#发送输入状态的透传消息)      | `ChatManager` | 创建输入状态透传消息。           |
| [`sendMessage`](#发送输入状态的透传消息)           | `ChatManager` | 发送输入状态透传消息。           |
