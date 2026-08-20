# Implement a Typing Indicator with Command Messages

A typing indicator shows when another user is typing a message. This feature facilitates effective communication between users and builds anticipation for interactions in a chat app.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK. For details, see [Quickstart](quickstart.html).
- Understand the EasyIM [limitations](/product/limitation.html).

## Implementation process

You can implement a typing indicator with command messages. The following figure illustrates how a typing indicator works.

![img](/images/common/typing_indicator.png)

Monitor user A's typing state. As soon as text is entered, send the typing state to user B through a command message. After receiving the message, user B knows that user A is typing.

- User A sends user B a message indicating that user A has started typing.
- After receiving the message, user B displays user A's typing indicator if the chat page with user A is open.
- If user B does not receive another typing state from user A after several seconds, the typing indicator is automatically hidden.

:::tip
The typing state is transient. We recommend setting a send interval instead of sending a message after every text change. The recipient should automatically hide the typing indicator if it does not receive another typing state within a period of time.
:::

### Send a typing-state command message

The following sample code shows how to send a typing-state command message.

```java
// Send a command message indicating that the user is typing.
private static final String MSG_TYPING_BEGIN = "TypingBegin";
private long previousChangedTimeStamp;
// The sample interval is 5 seconds. Adjust it according to the desired interaction experience.
private static final long TYPING_SEND_INTERVAL = 5_000L;

private void textChange() {
    long currentTimestamp = System.currentTimeMillis();
    if (currentTimestamp - previousChangedTimeStamp >= TYPING_SEND_INTERVAL) {
        sendBeginTyping();
        previousChangedTimeStamp = currentTimestamp;
    }
}

private void sendBeginTyping() {
    EMMessage beginMsg = EMMessage.createSendMessage(EMMessage.Type.CMD);
    EMCmdMessageBody body = new EMCmdMessageBody(MSG_TYPING_BEGIN);
    // Discard this transient state message when the recipient is offline.
    body.deliverOnlineOnly(true);
    beginMsg.addBody(body);
    beginMsg.setTo(toChatUsername);
    EMClient.getInstance().chatManager().sendMessage(beginMsg);
}
```

### Receive and parse a typing-state command message

The following sample code shows how to receive and parse a typing-state command message.

```java
private static final int TYPING_SHOW_TIME = 10000;
private static final int MSG_TYPING_END = 1;
private Handler typingHandler;

private void initTypingHandler() {
    typingHandler = new Handler(Looper.getMainLooper()) {
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
        if (!TextUtils.equals(msg.conversationId(), currentConversationId)) {
            continue;
        }
        EMCmdMessageBody body = (EMCmdMessageBody) msg.getBody();
        if(TextUtils.equals(body.action(), MSG_TYPING_BEGIN)) {
            // Update the UI here to show "The other user is typing".
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
    // Update the UI here to stop showing "The other user is typing".
    if(typingHandler != null) {
        typingHandler.removeCallbacksAndMessages(null);
    }
}

```
