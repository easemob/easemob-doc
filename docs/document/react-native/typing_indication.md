# 通过透传消息实现输入指示器

输入指示器显示其他用户何时输入消息。通过该功能，用户之间可进行有效沟通，增加了用户对聊天应用中交互的期待感。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见各端快速开始，例如 [Android 端](/document/android/quickstart.html)。
- 了解即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现过程

你可以通过透传消息实现输入指示器。下图为输入指示器的工作原理。

![img](/images/common/typing_indicator.png)

监听用户 A 的输入状态。一旦有文本输入，通过透传消息将输入状态发送给用户 B，用户 B 收到该消息，了解到用户 A 正在输入文本。

- 用户 A 向用户 B 发送消息，通知其开始输入文本。
- 收到消息后，如果用户 B 与用户 A 的聊天页面处于打开状态，则显示用户 A 的输入指示器。
- 如果用户 B 在几秒后未收到用户 A 的输入，则自动取消输入指示器。

:::tip
用户 A 可根据需要设置透传消息发送间隔。
:::

### 发送输入状态的透传消息

以下示例代码展示如何发送输入状态的透传消息。

```typescript
// 发送自己在输入状态中的透传消息
const action = "inputting";
const msg = ChatMessage.createCmdMessage(targetId, action, chatType);
EMClient.getInstance().chatManager().sendMessage(msg, callback).then().catch();
```

### 接收和解析输入状态的透传消息

以下示例代码展示如何接收和解析输入状态的透传消息。

```typescript
let listener = new (class implements ChatMessageEventListener {
  onCmdMessagesReceived(messages: ChatMessage[]): void {
    // 收到透传消息
    for (msg of messages) {
      // 过略消息
      if (msg.body.action === "inputting") {
        // todo: 界面显示正在输入中的状态
      }
    }
  }
})();
ChatClient.getInstance().chatManager.addMessageListener(listener);
```