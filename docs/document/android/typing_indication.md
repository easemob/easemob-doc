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

```java
//发送表示正在输入的透传消息
private static final String MSG_TYPING_BEGIN = "TypingBegin";
private long previousChangedTimeStamp;

private void textChange() {
    long currentTimestamp = System.currentTimeMillis();
    if(currentTimestamp - previousChangedTimeStamp > 5) {
        sendBeginTyping();
        previousChangedTimeStamp = currentTimestamp;
    }
}

private void sendBeginTyping() {
    EMMessage beginMsg = EMMessage.createSendMessage(EMMessage.Type.CMD);
    EMCmdMessageBody body = new EMCmdMessageBody(MSG_TYPING_BEGIN);
    // 将该透传消息只发送给在线用户
    body.deliverOnlineOnly(true);
    beginMsg.addBody(body);
    beginMsg.setTo(toChatUsername);
    EMClient.getInstance().chatManager().sendMessage(beginMsg);
}
```

### 接收和解析输入状态的透传消息

以下示例代码展示如何接收和解析输入状态的透传消息。

```java
private static final int TYPING_SHOW_TIME = 10000;
private static final int MSG_TYPING_END = 1;
private Handler typingHandler;

private void initTypingHandler() {
    typingHandler = new Handler(Looper.myLooper()) {
        @Override
        public void handleMessage(@NonNull Message msg) {
            switch (msg.what) {
                case MSG_TYPING_END :
                    cancelTimer();
                    break;
            }
        }
    };
}

@Override
public void onCmdMessageReceived(List<EMMessage> messages) {
    for (EMMessage msg : messages) {
        if(!TextUtils.equals(msg.conversationId(), currentConversationId)) {
            return;
        }
        EMCmdMessageBody body = (EMCmdMessageBody) msg.getBody();
        if(TextUtils.equals(body.action(), MSG_TYPING_BEGIN)) {
            // 这里需更新 UI，显示“对方正在输入”
            beginTimer();
        }
    }
}

private void beginTimer() {
    if(typingHandler != null) {
        typingHandler.removeMessages(MSG_TYPING_END);
        typingHandler.sendEmptyMessageDelayed(MSG_TYPING_END, TYPING_SHOW_TIME);
    }
}

private void cancelTimer() {
    // 这里需更新 UI，不再显示“对方正在输入”
    if(typingHandler != null) {
        typingHandler.removeCallbacksAndMessages(null);
    }
}

```