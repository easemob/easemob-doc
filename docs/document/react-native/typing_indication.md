# 通过透传消息实现输入指示器

输入指示器显示其他用户何时输入消息。通过该功能，用户之间可进行有效沟通，增加了用户对聊天应用中交互的期待感。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 已完成 [登录](login.html)，并连接到聊天服务器。
- 了解即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现过程

你可以通过透传消息实现输入指示器。下图为输入指示器的工作原理。

![img](/images/common/typing_indicator.png)

监听用户 A 的输入状态。一旦有文本输入，通过透传消息将输入状态发送给用户 B，用户 B 收到该消息，了解到用户 A 正在输入文本。

- 用户 A 向用户 B 发送消息，通知其开始输入文本。
- 收到消息后，如果用户 B 与用户 A 的聊天页面处于打开状态，则显示用户 A 的输入指示器。
- 如果用户 B 在几秒后未收到用户 A 的输入，则自动取消输入指示器。

:::tip
输入状态属于瞬时状态，建议设置发送间隔，避免在每次文本变化时都发送消息。接收方在一段时间内未再次收到输入状态时，应自动隐藏输入指示器。
:::

### 发送输入状态的透传消息

以下示例代码展示如何发送输入状态的透传消息。

在当前单聊页面的文本变化回调中调用 `textChange`，传入对方的用户 ID。`TypingBegin` 为业务约定的动作，发送方和接收方需保持一致。通过 `ChatMessage#createCmdMessage` 创建透传消息，再调用 `ChatManager#sendMessage` 发送。

`deliverOnlineOnly` 控制是否仅向在线用户投递，默认为 `false`。输入状态属于瞬时状态，示例显式设为 `true`，接收方离线时不投递。

```typescript
// 发送表示正在输入的透传消息
const MSG_TYPING_BEGIN = 'TypingBegin';
let previousChangedTimeStamp = 0;
// 示例间隔为 5 秒，业务侧可根据交互体验调整
const TYPING_SEND_INTERVAL = 5_000;

function textChange(targetId: string): void {
  const currentTimestamp = Date.now();
  if (currentTimestamp - previousChangedTimeStamp >= TYPING_SEND_INTERVAL) {
    previousChangedTimeStamp = currentTimestamp;
    void sendBeginTyping(targetId);
  }
}

async function sendBeginTyping(targetId: string): Promise<void> {
  const beginMsg = ChatMessage.createCmdMessage(
    targetId,
    MSG_TYPING_BEGIN,
    ChatMessageChatType.PeerChat,
    {
      // 接收方离线时丢弃该瞬时状态消息
      deliverOnlineOnly: true,
    }
  );

  try {
    // 发送输入状态的透传消息
    await ChatClient.getInstance().chatManager.sendMessage(beginMsg, {
      onSuccess() {
        // 透传消息发送成功，不表示对方已展示输入指示器
      },
      onError(_localMsgId, error) {
        console.error('发送输入状态失败：', error);
      },
    });
  } catch (error: unknown) {
    console.error('发送调用失败：', error);
  }
}
```

### 接收和解析输入状态的透传消息

以下示例代码展示如何接收和解析输入状态的透传消息。

通过 `ChatMessageEventListener#onCmdMessagesReceived` 接收透传消息，读取 `ChatCmdMessageBody.action` 判断输入状态。以下示例仅处理当前单聊会话，每次收到输入状态时重置计时器，10 秒内未再次收到时隐藏输入指示器。

打开单聊页面时调用 `listenForTyping`，传入当前会话 ID 和业务侧更新输入指示器的方法 `setTyping`。离开或切换会话时，调用返回的清理函数，移除同一个监听器并清除定时器。

```typescript
const TYPING_SHOW_TIME = 10_000;

function listenForTyping(
  currentConversationId: string,
  setTyping: (typing: boolean) => void
): () => void {
  let typingTimer: ReturnType<typeof setTimeout> | undefined;

  function cancelTimer(): void {
    if (typingTimer !== undefined) {
      clearTimeout(typingTimer);
      typingTimer = undefined;
    }
    // 这里需更新 UI，不再显示“对方正在输入”
    setTyping(false);
  }

  function beginTimer(): void {
    if (typingTimer !== undefined) {
      clearTimeout(typingTimer);
    }
    // 再次收到输入状态时重新计时，超时后隐藏输入指示器
    typingTimer = setTimeout(cancelTimer, TYPING_SHOW_TIME);
  }

  const listener: ChatMessageEventListener = {
    onCmdMessagesReceived(messages: ChatMessage[]): void {
      for (const message of messages) {
        if (
          message.conversationId !== currentConversationId ||
          message.chatType !== ChatMessageChatType.PeerChat ||
          message.isChatThread ||
          message.body.type !== ChatMessageType.CMD
        ) {
          continue;
        }
        const body = message.body as ChatCmdMessageBody;
        if (body.action === MSG_TYPING_BEGIN) {
          // 这里需更新 UI，显示“对方正在输入”
          setTyping(true);
          beginTimer();
        }
      }
    },
  };

  const chatManager = ChatClient.getInstance().chatManager;
  // 注册透传消息监听器
  chatManager.addMessageListener(listener);

  return () => {
    // 离开或切换会话时移除同一个监听器，并清除定时器
    chatManager.removeMessageListener(listener);
    cancelTimer();
  };
}
```
