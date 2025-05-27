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

::: tabs#code

@tab Android

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

@tab iOS

```objectivec
//发送表示正在输入的透传消息
#define MSG_TYPING_BEGIN @"TypingBegin"

- (void)textViewDidChange:(UITextView *)textView
{
    long long currentTimestamp = [self getCurrentTimestamp];
    // 5 秒内不能重复发送消息
    if ((currentTimestamp - _previousChangedTimeStamp) > 5) {
        // 发送开始输入的透传消息
        [self _sendBeginTyping];
        _previousChangedTimeStamp = currentTimestamp;
    }
}

- (void)_sendBeginTyping
{
    EMCmdMessageBody *body = [[EMCmdMessageBody alloc] initWithAction:MSG_TYPING_BEGIN];
    body.isDeliverOnlineOnly = YES;
    EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId body:body ext:nil];
    [[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
}
```

@tab Web/Applet

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

@tab Flutter

```dart
//发送表示正在输入的透传消息
final String msgTypingBegin = "TypingBegin";

void textChange() {
  int currentTimestamp = getCurrentTimestamp();
  if (currentTimestamp - _previousChangedTimeStamp > 5) {
    _sendBeginTyping();
    _previousChangedTimeStamp = currentTimestamp;
  }
}

void _sendBeginTyping() async {
  var msg = EMMessage.createCmdSendMessage(
    targetId: conversationId,
    action: msgTypingBegin,
    // 将该透传消息只发送给在线用户
    deliverOnlineOnly: true,
  );
  msg.chatType = ChatType.Chat;
  EMClient.getInstance.chatManager.sendMessage(msg);
}

```

@tab React Native

```typescript
// 发送自己在输入状态中的命令消息
const action = "inputting";
const msg = ChatMessage.createCmdMessage(targetId, action, chatType);
EMClient.getInstance().chatManager().sendMessage(msg, callback).then().catch();
```

@tab Unity/Windows

```csharp
//发送表示正在输入的透传消息
string msgTypingBegin = "TypingBegin";

void textChange() {
  int currentTimestamp = getCurrentTimestamp();
  if (currentTimestamp - _previousChangedTimeStamp > 5) {
    _sendBeginTyping();
    _previousChangedTimeStamp = currentTimestamp;
  }
}

void _sendBeginTyping() {
  var msg = Message.CreateCmdSendMessage(
    username: conversationId,
    action: msgTypingBegin,
    deliverOnlineOnly: true,
  );
  msg.chatType = MessageType.Chat;
  SDKClient.getInstance.chatManager.sendMessage(msg);
}

```
:::

### 接收和解析输入状态的透传消息

以下示例代码展示如何接收和解析输入状态的透传消息。

::: tabs#code

@tab Android

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

@tab iOS

```objectivec
#define TypingTimerCountNum 10
- (void)cmdMessagesDidReceive:(NSArray *)aCmdMessages
{
    NSString *conId = self.currentConversation.conversationId;
    for (EMChatMessage *message in aCmdMessages) {
        if (![conId isEqualToString:message.conversationId]) {
            continue;
        }
        EMCmdMessageBody *body = (EMCmdMessageBody *)message.body;
        // 收到正在输入的透传消息
        if ([body.action isEqualToString:MSG_TYPING_BEGIN]) {
            if (_receiveTypingCountDownNum == 0) {
                [self startReceiveTypingTimer];
            }else {
                _receiveTypingCountDownNum = TypingTimerCountNum;
            }
        }

    }
}

- (void)startReceiveTypingTimer {
    [self stopReceiveTypingTimer];
    _receiveTypingCountDownNum = TypingTimerCountNum;
    _receiveTypingTimer = [NSTimer scheduledTimerWithTimeInterval:1.0 target:self selector:@selector(startReceiveCountDown) userInfo:nil repeats:YES];

    [[NSRunLoop currentRunLoop] addTimer:_receiveTypingTimer forMode:UITrackingRunLoopMode];
    [_receiveTypingTimer fire];
    // 这里需更新 UI，显示“对方正在输入”
}

- (void)startReceiveCountDown
{
    if (_receiveTypingCountDownNum == 0) {
        [self stopReceiveTypingTimer];
        // 这里需更新 UI，不再显示“对方正在输入”

        return;
    }
    _receiveTypingCountDownNum--;
}

- (void)stopReceiveTypingTimer {
    _receiveTypingCountDownNum = 0;
    if (_receiveTypingTimer) {
        [_receiveTypingTimer invalidate];
        _receiveTypingTimer = nil;
    }
}
```

@tab Web/Applet

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

@tab Flutter

```dart
final int typingTime = 10;
Timer? _timer;

void onCmdMessagesReceived(List<EMMessage> list) {
  for (var msg in list) {
    if (msg.conversationId != currentConversationId) {
      continue;
    }
    EMCmdMessageBody body = msg.body as EMCmdMessageBody;
    if (body.action == msgTypingBegin) {
      // 这里需更新 UI，显示“对方正在输入”
      beginTimer();
    }
  }
}

void beginTimer() {
  _timer = Timer.periodic(
    Duration(seconds: typingTime),
    (timer) {
      // 这里需更新 UI，显示“对方正在输入”
      cancelTimer();
    },
  );
}

void cancelTimer() {
  _timer?.cancel();
}
```

@tab React Native

```typescript
let listener = new (class implements ChatMessageEventListener {
  onCmdMessagesReceived(messages: ChatMessage[]): void {
    // 收到命令消息
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

@tab Unity/Windows

```csharp
int typingTime = 10;

void OnCmdMessagesReceived(List<Message> list) {
  for (var msg in list) {
    if (msg.ConversationId != currentConversationId) {
      continue;
    }
    MessageBody.CmdBody body = msg.Body as MessageBody.CmdBody;
    if (body.Action == msgTypingBegin) {
      // 这里需更新 UI，显示“对方正在输入”

      Timer timer = new Timer((state) =>
      {
      	// 这里需更新 UI，不再显示“对方正在输入”
      }, null, typingTime, Timeout.Infinite);
    }
  }
}
```
:::
