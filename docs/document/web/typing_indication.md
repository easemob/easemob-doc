# 通过透传消息实现输入指示器

输入指示器显示其他用户何时输入消息。通过该功能，用户之间可进行有效沟通，增加了用户对聊天应用中交互的期待感。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
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
let previousChangedTimeStamp = 0;
// 监听输入状态的变化
const onInputChange = function () {
  const currentTimestamp = new Date().getTime();
  if (currentTimestamp - previousChangedTimeStamp > 5000) {
    sendBeginTyping();
    previousChangedTimeStamp = currentTimestamp;
  }
};

// 创建输入状态消息并发送
const sendBeginTyping = function () {
  const option = {
    // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
    chatType: "singleChat",
    // 消息类型。
    type: "cmd",
    // 消息接收方：单聊为对方用户 ID，群聊和聊天室分别为群组 ID 和聊天室 ID。
    to: "<target id>",
    // 用户自定义操作。
    action: "TypingBegin",
  };
  const typingMessage = message.create(option);

  connection
    .send(typingMessage)
    .then(() => {
      console.log("success");
    })
    .catch((e) => {
      console.log("fail");
    });
};
```

### 接收和解析输入状态的透传消息

以下示例代码展示如何接收和解析输入状态的透传消息。

```typescript
// 设置状态监听器
let timer;
conn.addEventHandler("message", {
  onCmdMessage: (msg) => {
    console.log("onCmdMessage", msg);
    if (msg.action === "TypingBegin") {
      // 这里需更新 UI，显示“对方正在输入”
      beginTimer();
    }
  },
});

const beginTimer = () => {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    // 这里需更新 UI，不再显示“对方正在输入”
  }, 5000);
};
```
